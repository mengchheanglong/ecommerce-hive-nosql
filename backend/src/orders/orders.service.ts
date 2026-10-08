import { Injectable, Inject, BadRequestException, NotFoundException } from "@nestjs/common";
import { Db } from "mongodb";
import { CreateOrderDto, UpdateOrderStatusDto } from "./dto/create-order.dto";

@Injectable()
export class OrdersService {
  constructor(@Inject("MONGODB_CONNECTION") private readonly db: Db) {}

  private validTransitions: Record<string, string[]> = {
    Pending: ["Preparing", "Out for Delivery", "Cancelled"],
    Preparing: ["Out for Delivery", "Cancelled"],
    "Out for Delivery": ["Delivered", "Cancelled"],
    Delivered: [],
    Cancelled: [],
  };

  private couriers: Record<string, { name: string; phone: string }> = {
    "R-101": { name: "Chan Vuthy", phone: "+855 12 999 888" },
    "R-102": { name: "Sok Rith", phone: "+855 12 888 777" },
    "R-103": { name: "Meng Kiri", phone: "+855 12 777 666" },
    "R-104": { name: "Long Sovann", phone: "+855 12 666 555" },
    "R-201": { name: "Thy Dara", phone: "+855 15 777 666" },
    "R-202": { name: "Chea Bora", phone: "+855 15 555 444" },
    "R-203": { name: "Nop Chhay", phone: "+855 15 444 333" },
    "R-301": { name: "Heng Samnang", phone: "+855 17 444 333" },
    "R-302": { name: "Keo Visal", phone: "+855 17 333 222" },
    "R-303": { name: "Prum Kosal", phone: "+855 17 222 111" },
    // Logistics Sandbox DRV IDs mapping
    "DRV-001": { name: "Chan Vuthy", phone: "+855 12 999 888" },
    "DRV-002": { name: "Sok Rith", phone: "+855 12 888 777" },
    "DRV-003": { name: "Meng Kiri", phone: "+855 12 777 666" },
    "DRV-004": { name: "Long Sovann", phone: "+855 12 666 555" },
    "DRV-005": { name: "Thy Dara", phone: "+855 15 777 666" },
    "DRV-006": { name: "Chea Bora", phone: "+855 15 555 444" },
    "DRV-007": { name: "Nop Chhay", phone: "+855 15 444 333" },
    "DRV-008": { name: "Heng Samnang", phone: "+855 17 444 333" },
    "DRV-009": { name: "Keo Visal", phone: "+855 17 333 222" },
    "DRV-010": { name: "Prum Kosal", phone: "+855 17 222 111" },
  };

  private fallbackOrders: any[] = [
    {
      order_id: "ORD-100001",
      customer_id: "C0457",
      customer_name: "Sokha Meas",
      items: [{ product_id: "P2210", name: "Ultra Smartphone Pro Max", quantity: 1, price: 289.0, category: "Electronics" }],
      total: 289.0,
      province: "Phnom Penh",
      payment_method: "NBC Bakong KHQR",
      status: "Delivered",
      delivery_address: "Street 271, Sangkat Boeung Tumpun, Phnom Penh",
      assigned_courier_id: "R-101",
      assigned_courier_name: "Chan Vuthy",
      courier_phone: "+855 12 999 888",
      created_at: new Date("2026-09-03T10:15:00Z"),
    },
    {
      order_id: "ORD-100002",
      customer_id: "C1893",
      customer_name: "Chenda Som",
      items: [{ product_id: "P0874", name: "Battambang Jasmine Fragrant Rice 5kg", quantity: 4, price: 4.8, category: "Groceries" }],
      total: 19.2,
      province: "Siem Reap",
      payment_method: "Cash (COD)",
      status: "Delivered",
      delivery_address: "Sivatha Road, Svay Dangkum, Siem Reap",
      assigned_courier_id: "R-201",
      assigned_courier_name: "Thy Dara",
      courier_phone: "+855 15 777 666",
      created_at: new Date("2026-09-03T14:45:00Z"),
    },
    {
      order_id: "ORD-100003",
      customer_id: "C0457",
      customer_name: "Sokha Meas",
      items: [
        { product_id: "P3314", name: "Premium Linen Casual Shirt", quantity: 2, price: 18.5, category: "Clothing" },
        { product_id: "P0875", name: "Kampot Organic Black Pepper 250g", quantity: 1, price: 7.5, category: "Groceries" },
      ],
      total: 44.5,
      province: "Phnom Penh",
      payment_method: "NBC Bakong KHQR",
      status: "Out for Delivery",
      delivery_address: "Street 271, Sangkat Boeung Tumpun, Phnom Penh",
      assigned_courier_id: "R-102",
      assigned_courier_name: "Sok Rith",
      courier_phone: "+855 12 888 777",
      created_at: new Date("2026-10-05T08:30:00Z"),
    },
    {
      order_id: "ORD-100004",
      customer_id: "C2241",
      customer_name: "Piseth Seng",
      items: [{ product_id: "P2211", name: "Noise-Cancelling Wireless Earbuds", quantity: 1, price: 65.0, category: "Electronics" }],
      total: 65.0,
      province: "Siem Reap",
      payment_method: "NBC Bakong KHQR",
      status: "Preparing",
      delivery_address: "Wat Bo Village, Salakamreuk, Siem Reap",
      created_at: new Date("2026-10-05T19:20:00Z"),
    },
    {
      order_id: "ORD-100005",
      customer_id: "C1001",
      customer_name: "Vireak Chan",
      items: [
        { product_id: "P2212", name: "Curved 4K Ultra-Wide Monitor 34\"", quantity: 1, price: 420.0, category: "Electronics" },
        { product_id: "P2214", name: "Mechanical Keyboard RGB (Hot-Swap)", quantity: 1, price: 54.0, category: "Electronics" },
      ],
      total: 474.0,
      province: "Phnom Penh",
      payment_method: "ABA Pay (KHQR)",
      status: "Delivered",
      delivery_address: "Norodom Boulevard, Sangkat Tonle Bassac, Phnom Penh",
      assigned_courier_id: "R-101",
      assigned_courier_name: "Chan Vuthy",
      courier_phone: "+855 12 999 888",
      created_at: new Date("2026-09-18T11:00:00Z"),
    },
    {
      order_id: "ORD-100006",
      customer_id: "C1002",
      customer_name: "Sophea Kim",
      items: [
        { product_id: "P3315", name: "Handwoven Silk Scarf (Krama Luxe)", quantity: 2, price: 32.0, category: "Clothing" },
        { product_id: "P0877", name: "Wild Raw Forest Honey from Koh Kong 500ml", quantity: 1, price: 14.0, category: "Groceries" },
      ],
      total: 78.0,
      province: "Siem Reap",
      payment_method: "NBC Bakong KHQR",
      status: "Delivered",
      delivery_address: "Charles de Gaulle Blvd, Siem Reap Central",
      assigned_courier_id: "R-202",
      assigned_courier_name: "Chea Bora",
      courier_phone: "+855 15 555 444",
      created_at: new Date("2026-09-21T15:20:00Z"),
    },
    {
      order_id: "ORD-100007",
      customer_id: "C1003",
      customer_name: "Rithy Pen",
      items: [
        { product_id: "P3318", name: "Waterproof Commuter Backpack 22L", quantity: 1, price: 45.0, category: "Clothing" },
        { product_id: "P2215", name: "Ultra Fast-Charging Power Bank 20,000mAh", quantity: 1, price: 36.0, category: "Electronics" },
      ],
      total: 81.0,
      province: "Battambang",
      payment_method: "Wing Bank (KHQR)",
      status: "Out for Delivery",
      delivery_address: "Street 3, Sangkat Svay Pao, Battambang",
      assigned_courier_id: "R-301",
      assigned_courier_name: "Heng Samnang",
      courier_phone: "+855 17 444 333",
      created_at: new Date("2026-10-06T06:15:00Z"),
    },
    {
      order_id: "ORD-100008",
      customer_id: "C1004",
      customer_name: "Bopha Nou",
      items: [
        { product_id: "P2217", name: "Compact 4K Foldable Drone with Gimbal", quantity: 1, price: 349.0, category: "Electronics" },
      ],
      total: 349.0,
      province: "Phnom Penh",
      payment_method: "NBC Bakong KHQR",
      status: "Preparing",
      delivery_address: "Russian Federation Blvd, Sangkat Teuk Thla, Phnom Penh",
      created_at: new Date("2026-10-06T07:45:00Z"),
    },
    {
      order_id: "ORD-100009",
      customer_id: "C1005",
      customer_name: "Kolab Heng",
      items: [
        { product_id: "P0875", name: "Kampot Organic Black Pepper 250g", quantity: 3, price: 7.5, category: "Groceries" },
        { product_id: "P0876", name: "Mondulkiri Dark Roast Arabica Beans 500g", quantity: 2, price: 9.2, category: "Groceries" },
        { product_id: "P0878", name: "Kampot Fleur de Sel (Flower of Salt) 300g", quantity: 2, price: 5.5, category: "Groceries" },
      ],
      total: 51.9,
      province: "Phnom Penh",
      payment_method: "NBC Bakong KHQR",
      status: "Pending",
      delivery_address: "Street 51 (Pasteur), Sangkat Boeng Keng Kang 1, Phnom Penh",
      created_at: new Date("2026-10-06T08:10:00Z"),
    },
    {
      order_id: "ORD-100010",
      customer_id: "C1007",
      customer_name: "Dara Kong",
      items: [
        { product_id: "P3316", name: "Everyday Stretch Chino Pants", quantity: 2, price: 24.0, category: "Clothing" },
        { product_id: "P3319", name: "Handcrafted Heritage Leather Loafers", quantity: 1, price: 58.0, category: "Clothing" },
      ],
      total: 106.0,
      province: "Siem Reap",
      payment_method: "ACLEDA Pay (KHQR)",
      status: "Delivered",
      delivery_address: "Pokambor Ave, Riverside, Siem Reap",
      assigned_courier_id: "R-201",
      assigned_courier_name: "Thy Dara",
      courier_phone: "+855 15 777 666",
      created_at: new Date("2026-09-29T16:30:00Z"),
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
    const order: any = {
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

    if (dto.assigned_courier_id) {
      order.assigned_courier_id = dto.assigned_courier_id;
      const courier = this.couriers[dto.assigned_courier_id];
      if (courier) {
        order.assigned_courier_name = courier.name;
        order.courier_phone = courier.phone;
      }
    }

    if (this.db) {
      // 1. Validate stock availability before accepting order
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item && item.product_id && item.quantity) {
            const prod = await this.db.collection("products").findOne({ product_id: item.product_id });
            if (prod) {
              const currentStock = prod.stock ?? 0;
              if (currentStock <= 0) {
                throw new BadRequestException(
                  `Item "${prod.name || item.product_id}" is currently out of stock.`
                );
              }
              if (Number(item.quantity) > currentStock) {
                throw new BadRequestException(
                  `Insufficient stock for "${prod.name || item.product_id}". Only ${currentStock} units available.`
                );
              }
            }
          }
        }
      }

      const res = await this.db.collection("orders").insertOne(order);

      // 2. Safe inventory deduction (strictly clamped at 0, never negative)
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item && item.product_id && item.quantity) {
            const prod = await this.db.collection("products").findOne({ product_id: item.product_id });
            const currentStock = prod ? (prod.stock ?? 0) : 0;
            const newStock = Math.max(0, currentStock - Number(item.quantity));
            await this.db.collection("products").updateOne(
              { product_id: item.product_id },
              { $set: { stock: newStock, updated_at: new Date() } }
            );
          }
        }
      }
      // Notify logistics sandbox digital twin immediately via webhook
      this.notifyLogisticsSandbox(order).catch(() => {});

      return { success: true, insertedId: res.insertedId, order };
    }
    this.fallbackOrders.unshift(order);
    this.notifyLogisticsSandbox(order).catch(() => {});
    return { success: true, order };
  }

  private async notifyLogisticsSandbox(order: any): Promise<void> {
    try {
      await fetch('http://localhost:3001/api/integrations/ecommerce/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
        signal: AbortSignal.timeout(2000),
      });
    } catch {
      // Non-blocking bridge notification
    }
  }

  async updateStatus(dto: UpdateOrderStatusDto) {
    let currentStatus: string | undefined;
    let existingDoc: any = null;

    if (this.db) {
      existingDoc = await this.db.collection("orders").findOne({ order_id: dto.order_id });
      if (existingDoc) currentStatus = existingDoc.status;
    }

    if (!currentStatus) {
      const fallback = this.fallbackOrders.find((o) => o.order_id === dto.order_id);
      if (fallback) {
        currentStatus = fallback.status;
        existingDoc = fallback;
      }
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

    const updateFields: any = { status: dto.status, updated_at: new Date() };
    if (dto.status === "Delivered") {
      updateFields.delivered_at = new Date();
    }

    if (dto.courier_id) {
      updateFields.assigned_courier_id = dto.courier_id;
      const courier = this.couriers[dto.courier_id] || {
        name: `Driver ${dto.courier_id.replace('DRV-', '#')}`,
        phone: "+855 12 999 888",
      };
      updateFields.assigned_courier_name = courier.name;
      updateFields.courier_phone = courier.phone;
    }

    // Restock if order is cancelled
    if (dto.status === "Cancelled" && currentStatus !== "Cancelled" && existingDoc && Array.isArray(existingDoc.items)) {
      if (this.db) {
        for (const item of existingDoc.items) {
          if (item && item.product_id && item.quantity) {
            await this.db.collection("products").updateOne(
              { product_id: item.product_id },
              { $inc: { stock: Number(item.quantity) }, $set: { updated_at: new Date() } }
            );
          }
        }
      }
    }

    if (this.db) {
      await this.db
        .collection("orders")
        .updateOne({ order_id: dto.order_id }, { $set: updateFields });
      return { success: true, order_id: dto.order_id, ...updateFields };
    }

    const order = this.fallbackOrders.find((o) => o.order_id === dto.order_id);
    if (order) {
      Object.assign(order, updateFields);
    }
    return { success: true, order_id: dto.order_id, ...updateFields };
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
