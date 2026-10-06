import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { INITIAL_ORDERS } from "@/lib/data";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { db } = await connectToDatabase();
    const order = await db.collection("orders").findOne({ order_id: id });
    if (order) {
      return NextResponse.json({ success: true, source: "mongodb", order });
    }
  } catch (error) {
    console.warn("MongoDB single order lookup fallback:", error);
  }

  const fallback = INITIAL_ORDERS.find((o) => o.order_id === id);
  if (fallback) {
    return NextResponse.json({ success: true, source: "fallback", order: fallback });
  }

  return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { status } = body;
    const { db } = await connectToDatabase();
    await db.collection("orders").updateOne(
      { order_id: id },
      { $set: { status, updated_at: new Date() } }
    );
    return NextResponse.json({ success: true, order_id: id, status });
  } catch (error: any) {
    console.warn("MongoDB single order update fallback:", error);
    return NextResponse.json({ success: true, order_id: id, status: "updated_mock" });
  }
}
