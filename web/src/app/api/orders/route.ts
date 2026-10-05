import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const orders = await db.collection("orders").find({}).sort({ created_at: -1 }).toArray();
    return NextResponse.json({ success: true, source: "mongodb", orders });
  } catch (error) {
    console.warn("MongoDB fetch failed, serving default orders:", error);
    const defaultOrders = [
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
    return NextResponse.json({ success: true, source: "fallback", orders: defaultOrders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();

    const newOrder = {
      order_id: body.order_id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customer_id: body.customer_id || "C0457",
      customer_name: body.customer_name || "Sokha Meas",
      items: body.items || [],
      total: Number(body.total),
      province: body.province || "Phnom Penh",
      payment_method: body.payment_method || "Bakong KHQR",
      status: body.status || "Pending",
      delivery_address: body.delivery_address,
      created_at: new Date(),
    };

    const result = await db.collection("orders").insertOne(newOrder);
    return NextResponse.json({ success: true, order: newOrder, insertedId: result.insertedId });
  } catch (error: any) {
    console.error("Failed to insert order in MongoDB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { order_id, status } = body;

    if (!order_id || !status) {
      return NextResponse.json({ success: false, error: "Missing order_id or status" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    await db.collection("orders").updateOne({ order_id }, { $set: { status, updated_at: new Date() } });
    return NextResponse.json({ success: true, order_id, status });
  } catch (error: any) {
    console.error("Failed to update order status in MongoDB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
