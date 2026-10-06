import { Injectable, Inject, BadRequestException, NotFoundException } from "@nestjs/common";
import { Db } from "mongodb";
import { CreateOrderDto, UpdateOrderStatusDto } from "./dto/create-order.dto";

@Injectable()
export class OrdersService {
  constructor(@Inject("MONGODB_CONNECTION") private readonly db: Db) {}

  private validTransitions: Record<string, string[]> = {
    Pending: ["Preparing", "Cancelled"],
    Preparing: ["Out for Delivery", "Cancelled"],
    "Out for Delivery": ["Delivered", "Cancelled"],
    Delivered: [],
    Cancelled: [],
  };

  private fallbackOrders = [
    {
      order_id: "ORD-100001",
      customer_id: "C0457",
      customer_name: "Sokha Meas",
      items: [{ product_id: "P2210", name: "Ultra Smartphone Pro Max", quantity: 1, price: 289.0 }],
      total: 289.0,
      province: "Phnom Penh",
      payment_method: "Bakong KHQR",
      status: "Delivered",
      created_at: new Date("2026-09-03"),
    },
    {
      order_id: "ORD-100002",
      customer_id: "C1893",
      customer_name: "Chenda Som",
      items: [{ product_id: "P0874", name: "Battambang Jasmine Fragrant Rice 5kg", quantity: 4, price: 4.8 }],
      total: 19.2,
      province: "Siem Reap",
      payment_method: "Cash (COD)",
      status: "Delivered",
      created_at: new Date("2026-09-03"),
    },
    {
      order_id: "ORD-100003",
      customer_id: "C0457",
      customer_name: "Sokha Meas",
      items: [{ product_id: "P3314", name: "Premium Linen Casual Shirt", quantity: 2, price: 18.5 }],
      total: 37.0,
      province: "Phnom Penh",
      payment_method: "Bakong KHQR",
      status: "Out for Delivery",
      created_at: new Date(),
    },
    {
      order_id: "ORD-100004",
      customer_id: "C2241",
      customer_name: "Piseth Seng",
      items: [{ product_id: "P2211", name: "Noise-Cancelling Wireless Earbuds", quantity: 1, price: 65.0 }],
      total: 65.0,
      province: "Siem Reap",
      payment_method: "Bakong KHQR",
      status: "Preparing",
      created_at: new Date(),
    },
  ];

  async findAll() {
    if (this.db) {
      try {
        const orders = await this.db.collection("orders").find({}).sort({ created_at: -1 }).toArray();
        if (orders.length > 0) {
          return { success: true, source: "mongodb", count: orders.length, orders };
        }
      } catch (err) {
        console.warn("MongoDB orders query failed, using fallback:", err);
      }
    }
    return { success: true, source: "fallback", count: this.fallbackOrders.length, orders: this.fallbackOrders };
  }

  async create(dto: CreateOrderDto) {
    const order = {
      order_id: dto.order_id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customer_id: dto.customer_id || "C0457",
      customer_name: dto.customer_name,
      items: dto.items,
      total: Number(dto.total),
      province: dto.province,
      payment_method: dto.payment_method,
      status: dto.status || "Pending",
      delivery_address: dto.delivery_address,
      created_at: new Date(),
    };

    if (this.db) {
      const res = await this.db.collection("orders").insertOne(order);
      return { success: true, insertedId: res.insertedId, order };
    }
    this.fallbackOrders.unshift(order as any);
    return { success: true, order };
  }

  async updateStatus(dto: UpdateOrderStatusDto) {
    let currentStatus: string | undefined;

    if (this.db) {
      const existing = await this.db.collection("orders").findOne({ order_id: dto.order_id });
      if (existing) currentStatus = existing.status;
    }

    if (!currentStatus) {
      const fallback = this.fallbackOrders.find((o) => o.order_id === dto.order_id);
      if (fallback) currentStatus = fallback.status;
    }

    if (currentStatus && currentStatus !== dto.status) {
      const allowed = this.validTransitions[currentStatus];
      if (allowed && !allowed.includes(dto.status)) {
        throw new BadRequestException(
          `Invalid fulfillment transition from "${currentStatus}" to "${dto.status}". Allowed next states: ${
            allowed.join(", ") || "none (terminal state)"
          }`
        );
      }
    }

    if (this.db) {
      await this.db
        .collection("orders")
        .updateOne({ order_id: dto.order_id }, { $set: { status: dto.status, updated_at: new Date() } });
      return { success: true, order_id: dto.order_id, status: dto.status };
    }

    const order = this.fallbackOrders.find((o) => o.order_id === dto.order_id);
    if (order) order.status = dto.status;
    return { success: true, order_id: dto.order_id, status: dto.status };
  }

  async findOne(orderId: string) {
    if (this.db) {
      try {
        const order = await this.db.collection("orders").findOne({ order_id: orderId });
        if (order) return { success: true, order };
      } catch (err) {
        console.warn("MongoDB findOne order failed, using fallback:", err);
      }
    }
    const order = this.fallbackOrders.find((o) => o.order_id === orderId);
    return { success: !!order, order };
  }
}
