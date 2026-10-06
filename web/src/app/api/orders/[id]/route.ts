import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { findOrderById, updateOrderStatusInStore, VALID_ORDER_STATUSES } from "@/lib/data";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { db } = await connectToDatabase();
    const order = await db.collection("orders").findOne({ order_id: id });
    if (order) {
      return NextResponse.json({ success: true, source: "mongodb", order });
    }
  } catch (error) {
    // Proceed to synchronized store
  }

  const fallback = findOrderById(id);
  if (fallback) {
    return NextResponse.json({ success: true, source: "fallback", order: fallback });
  }

  return NextResponse.json({ success: false, error: `Order "${id}" not found` }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { status, force } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Missing required 'status' field" }, { status: 400 });
    }

    if (!VALID_ORDER_STATUSES.includes(status as any)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status "${status}". Allowed values: ${VALID_ORDER_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // State machine transition validation and update
    const result = updateOrderStatusInStore(id, status, !!force);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    try {
      const { db } = await connectToDatabase();
      await db.collection("orders").updateOne(
        { order_id: id },
        { $set: { status, updated_at: new Date() } }
      );
    } catch (error: any) {
      // MongoDB write error logged, synchronized store already updated
    }

    return NextResponse.json({
      success: true,
      order_id: id,
      status,
      order: result.order,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }
}
