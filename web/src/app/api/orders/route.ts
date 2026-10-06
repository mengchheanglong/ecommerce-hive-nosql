import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { INITIAL_ORDERS } from "@/lib/data";

let inMemoryOrders = [...INITIAL_ORDERS];

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const orders = await db.collection("orders").find({}).sort({ created_at: -1 }).toArray();
    if (orders.length > 0) {
      return NextResponse.json({ success: true, source: "mongodb", orders });
    }
  } catch (error) {
    console.warn("MongoDB orders fetch failed, serving default orders:", error);
  }
  return NextResponse.json({ success: true, source: "fallback", orders: inMemoryOrders });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newOrder = {
    order_id: body.order_id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    customer_id: body.customer_id || "C0457",
    customer_name: body.customer_name || "Sokha Meas",
    items: body.items || [],
    total: Number(body.total),
    province: body.province || "Phnom Penh",
    payment_method: body.payment_method || "Bakong KHQR",
    status: body.status || "Preparing",
    delivery_address: body.delivery_address || "Street 271, Phnom Penh",
    created_at: new Date().toISOString(),
  };

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("orders").insertOne(newOrder);
    return NextResponse.json({ success: true, source: "mongodb", order: newOrder, insertedId: result.insertedId });
  } catch (error: any) {
    console.warn("Failed to insert order in MongoDB, storing in fallback state:", error);
    inMemoryOrders.unshift(newOrder as any);
    return NextResponse.json({ success: true, source: "fallback", order: newOrder });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { order_id, status } = body;

  if (!order_id || !status) {
    return NextResponse.json({ success: false, error: "Missing order_id or status" }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    await db.collection("orders").updateOne({ order_id }, { $set: { status, updated_at: new Date() } });
    return NextResponse.json({ success: true, source: "mongodb", order_id, status });
  } catch (error: any) {
    console.warn("Failed to update order status in MongoDB, updating fallback state:", error);
    const existing = inMemoryOrders.find((o) => o.order_id === order_id);
    if (existing) {
      existing.status = status;
    }
    return NextResponse.json({ success: true, source: "fallback", order_id, status });
  }
}
