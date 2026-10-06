import { Injectable, Inject } from "@nestjs/common";
import { Db } from "mongodb";
import { CreateOrderDto, UpdateOrderStatusDto } from "./dto/create-order.dto";

@Injectable()
export class OrdersService {
  constructor(@Inject("MONGODB_CONNECTION") private readonly db: Db) {}

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
