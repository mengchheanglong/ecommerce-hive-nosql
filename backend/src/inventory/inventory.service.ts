import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { createHash } from "node:crypto";
import { ClientSession, Db, Document } from "mongodb";
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
} from "../orders/dto/create-order.dto";

export interface InventoryLine {
  product_id: string;
  quantity: number;
}
export interface Reservation {
  version: 1;
  state: "reserved" | "shipped" | "released";
  lines: InventoryLine[];
}

const transitions: Record<string, string[]> = {
  Pending: ["Preparing", "Out for Delivery", "Cancelled"],
  Preparing: ["Out for Delivery", "Cancelled"],
  "Out for Delivery": ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

/** Convert the compatibility USD input once; authoritative storage uses integer cents. */
export function moneyMinor(value: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
    throw new BadRequestException("Money must be a nonnegative USD amount");
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(String(value));
  if (!match)
    throw new BadRequestException("Money must have at most two decimal places");
  const result =
    Number(match[1]) * 100 + Number((match[2] || "").padEnd(2, "0"));
  if (!Number.isSafeInteger(result))
    throw new BadRequestException("Money exceeds supported range");
  return result;
}

export function normalizeOrder(dto: CreateOrderDto) {
  for (const field of [
    "order_id",
    "customer_name",
    "province",
    "payment_method",
  ] as const) {
    if (typeof dto[field] !== "string" || !dto[field].trim())
      throw new BadRequestException(field + " is required");
  }
  if (!["Pending", "Preparing"].includes(dto.status || "Pending"))
    throw new BadRequestException("New orders must be Pending or Preparing");
  if (!Array.isArray(dto.items) || dto.items.length === 0)
    throw new BadRequestException("At least one order item is required");
  const grouped = new Map<
    string,
    { product_id: string; name: string; quantity: number; price_minor: number }
  >();
  for (const item of dto.items) {
    if (
      !item ||
      typeof item.product_id !== "string" ||
      !item.product_id.trim() ||
      typeof item.name !== "string"
    )
      throw new BadRequestException("Each item requires a SKU and name");
    if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0)
      throw new BadRequestException(
        "Item quantities must be positive safe integers",
      );
    const price_minor = moneyMinor(item.price);
    const existing = grouped.get(item.product_id);
    if (existing && existing.price_minor !== price_minor)
      throw new BadRequestException("Duplicate SKU prices must match");
    const quantity = (existing?.quantity || 0) + item.quantity;
    if (!Number.isSafeInteger(quantity))
      throw new BadRequestException(
        "Aggregated quantity exceeds supported range",
      );
    grouped.set(item.product_id, {
      product_id: item.product_id,
      name: item.name,
      quantity,
      price_minor,
    });
  }
  const items = [...grouped.values()].sort((a, b) =>
    a.product_id < b.product_id ? -1 : a.product_id > b.product_id ? 1 : 0,
  );
  const payload = {
    tenant_id: "demo",
    source_system: "marketplace-demo",
    customer_id: dto.customer_id || "C0457",
    customer_name: dto.customer_name,
    items,
    total_minor: moneyMinor(dto.total),
    currency: "USD",
    province: dto.province,
    payment_method: dto.payment_method,
    delivery_address: dto.delivery_address || "",
    status: dto.status || "Pending",
    assigned_courier_id: dto.assigned_courier_id || "",
  };
  return {
    payload,
    fingerprint: createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex"),
  };
}

@Injectable()
export class InventoryService {
  private initialization: Promise<void> | undefined;
  constructor(@Inject("MONGODB_CONNECTION") private readonly db: Db | null) {}

  async ensureReady(): Promise<void> {
    if (!this.db)
      throw new ServiceUnavailableException(
        "MongoDB is unavailable; inventory writes are disabled",
      );
    if (!this.initialization) {
      this.initialization = (async () => {
        await this.db
          .collection("products")
          .createIndex({ product_id: 1 }, { unique: true });
        await this.db
          .collection("orders")
          .createIndex({ order_id: 1 }, { unique: true });
        await this.db
          .collection("inventory_events")
          .createIndex({ order_id: 1, operation: 1 }, { unique: true });
      })().catch((error) => {
        this.initialization = undefined;
        throw error;
      });
    }
    try {
      await this.initialization;
    } catch {
      throw new ServiceUnavailableException(
        "Inventory indexes unavailable; reconcile duplicate or missing IDs before writing",
      );
    }
  }

  private async transaction<T>(
    work: (session: ClientSession) => Promise<T>,
  ): Promise<T> {
    await this.ensureReady();
    const session = this.db.client.startSession();
    try {
      return await session.withTransaction(() => work(session), {
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
        maxCommitTimeMS: 5000,
      });
    } catch (error) {
      if (
        error instanceof HttpException ||
        (error as { code?: number }).code === 11000
      )
        throw error;
      throw new ServiceUnavailableException(
        "Inventory transaction failed; retry with the same order ID. A replica set is required",
      );
    } finally {
      await session.endSession();
    }
  }

  private assertCounters(product: Document): void {
    if (
      !Number.isSafeInteger(product.stock) ||
      product.stock < 0 ||
      !Number.isSafeInteger(product.reserved_stock ?? 0) ||
      (product.reserved_stock ?? 0) < 0 ||
      !Number.isSafeInteger(product.stock + (product.reserved_stock ?? 0))
    )
      throw new ConflictException(
        "Invalid inventory counters for " + product.product_id,
      );
  }

  private replay(existing: Document, fingerprint: string) {
    if (existing.request_fingerprint !== fingerprint)
      throw new ConflictException(
        "Order ID already exists with a different request or legacy inventory state",
      );
    return {
      success: true,
      source: "mongodb",
      replayed: true,
      order: existing,
    };
  }

  async reserve(
    dto: CreateOrderDto,
    courierFields: Record<string, string> = {},
  ) {
    const { payload, fingerprint } = normalizeOrder(dto);
    const lines = payload.items.map(({ product_id, quantity }) => ({
      product_id,
      quantity,
    }));
    try {
      return await this.transaction(async (session) => {
        const existing = await this.db
          .collection("orders")
          .findOne({ order_id: dto.order_id }, { session });
        if (existing) return this.replay(existing, fingerprint);
        for (const line of lines) {
          const product = await this.db
            .collection("products")
            .findOne({ product_id: line.product_id }, { session });
          if (!product)
            throw new NotFoundException("Unknown product " + line.product_id);
          this.assertCounters(product);
          const result = await this.db.collection("products").updateOne(
            {
              product_id: line.product_id,
              stock: { $gte: line.quantity },
              status: "active",
            },
            {
              $inc: { stock: -line.quantity, reserved_stock: line.quantity },
            },
            { session },
          );
          if (result.matchedCount !== 1)
            throw new ConflictException(
              "Insufficient or inactive stock for " + line.product_id,
            );
        }
        const order = {
          ...payload,
          order_id: dto.order_id,
          total: payload.total_minor / 100,
          items: payload.items.map((item) => ({
            ...item,
            price: item.price_minor / 100,
          })),
          ...courierFields,
          request_fingerprint: fingerprint,
          inventory: {
            version: 1,
            state: "reserved",
            lines,
          } satisfies Reservation,
          created_at: new Date(),
        };
        await this.db.collection("orders").insertOne(order, { session });
        await this.record(dto.order_id, "reserve", lines, session);
        return { success: true, source: "mongodb", replayed: false, order };
      });
    } catch (error) {
      // Racing identical creates collide on the unique ID. Read the committed winner.
      if ((error as { code?: number }).code === 11000) {
        const existing = await this.db
          .collection("orders")
          .findOne({ order_id: dto.order_id });
        if (existing) return this.replay(existing, fingerprint);
        throw new ConflictException(
          "Inventory operation conflicts with an existing ledger entry",
        );
      }
      throw error;
    }
  }

  async transition(
    dto: UpdateOrderStatusDto,
    courierFields: Record<string, string> = {},
  ) {
    if (
      typeof dto.order_id !== "string" ||
      !dto.order_id.trim() ||
      typeof dto.status !== "string" ||
      (dto.courier_id !== undefined && typeof dto.courier_id !== "string")
    )
      throw new BadRequestException(
        "Order ID, status and optional courier must be strings",
      );
    if (!Object.prototype.hasOwnProperty.call(transitions, dto.status))
      throw new BadRequestException("Unknown fulfillment status");
    return this.transaction(async (session) => {
      const order = await this.db
        .collection("orders")
        .findOne({ order_id: dto.order_id }, { session });
      if (!order) throw new NotFoundException("Order not found");
      if (order.status === dto.status) {
        if (dto.courier_id && dto.courier_id !== order.assigned_courier_id)
          throw new ConflictException(
            "Status retry cannot change courier assignment",
          );
        return { success: true, replayed: true, order };
      }
      if (!transitions[order.status]?.includes(dto.status))
        throw new ConflictException(
          "Invalid fulfillment transition from " +
            order.status +
            " to " +
            dto.status,
        );
      const reservation = order.inventory as Reservation | undefined;
      if (reservation?.version !== 1)
        throw new ConflictException(
          "Legacy order requires inventory reconciliation before transition",
        );
      if (
        !Array.isArray(reservation.lines) ||
        reservation.lines.length === 0 ||
        reservation.lines.some(
          (line) =>
            typeof line.product_id !== "string" ||
            !Number.isSafeInteger(line.quantity) ||
            line.quantity <= 0,
        ) ||
        new Set(reservation.lines.map((line) => line.product_id)).size !==
          reservation.lines.length
      )
        throw new ConflictException("Reservation lines require reconciliation");
      const expectedState =
        order.status === "Out for Delivery" ? "shipped" : "reserved";
      if (reservation.state !== expectedState)
        throw new ConflictException(
          "Order and reservation states require reconciliation",
        );
      let state: Reservation["state"] = reservation.state;
      if (dto.status === "Out for Delivery" || dto.status === "Cancelled") {
        if (state !== "reserved")
          throw new ConflictException("Order has no active reservation");
        const release = dto.status === "Cancelled";
        for (const line of reservation.lines) {
          const product = await this.db
            .collection("products")
            .findOne({ product_id: line.product_id }, { session });
          if (!product)
            throw new ConflictException(
              "Reserved product requires reconciliation",
            );
          this.assertCounters(product);
          const result = await this.db.collection("products").updateOne(
            {
              product_id: line.product_id,
              reserved_stock: { $gte: line.quantity },
            },
            {
              $inc: {
                reserved_stock: -line.quantity,
                ...(release ? { stock: line.quantity } : {}),
              },
            },
            { session },
          );
          if (result.matchedCount !== 1)
            throw new ConflictException(
              "Reservation counters require reconciliation",
            );
        }
        state = release ? "released" : "shipped";
        await this.record(
          dto.order_id,
          release ? "release" : "ship",
          reservation.lines,
          session,
        );
      } else if (dto.status === "Delivered" && state !== "shipped") {
        throw new ConflictException("Delivery requires a shipped reservation");
      }
      const fields = {
        ...courierFields,
        status: dto.status,
        "inventory.state": state,
        updated_at: new Date(),
        ...(dto.status === "Delivered" ? { delivered_at: new Date() } : {}),
      };
      const result = await this.db
        .collection("orders")
        .findOneAndUpdate(
          { order_id: dto.order_id, status: order.status },
          { $set: fields },
          { session, returnDocument: "after" },
        );
      if (!result)
        throw new ConflictException("Order changed during transition");
      return { success: true, replayed: false, order: result };
    });
  }

  private async record(
    orderId: string,
    operation: "reserve" | "release" | "ship",
    lines: InventoryLine[],
    session: ClientSession,
  ) {
    await this.db.collection("inventory_events").insertOne(
      {
        schema_version: 1,
        tenant_id: "demo",
        source_system: "marketplace-demo",
        order_id: orderId,
        operation,
        lines,
        quantity_unit: "each",
        created_at: new Date(),
      },
      { session },
    );
  }
}
