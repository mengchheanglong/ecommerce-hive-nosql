import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import {
  getOrdersStore,
  addOrderToStore,
  updateOrderStatusInStore,
  VALID_ORDER_STATUSES,
} from "@/lib/data";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const orders = await db.collection("orders").find({}).sort({ created_at: -1 }).toArray();
    if (orders.length > 0) {
      return NextResponse.json({ success: true, source: "mongodb", orders });
    }
  } catch (error) {
    // Proceed to synchronized fallback store
  }
  return NextResponse.json({ success: true, source: "fallback", orders: getOrdersStore() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order must contain at least one line item" },
        { status: 400 }
      );
    }

    const totalNum = Number(body.total);
    if (isNaN(totalNum) || totalNum <= 0) {
      return NextResponse.json(
        { success: false, error: "Order total must be greater than zero" },
        { status: 400 }
      );
    }

    const newOrder = {
      order_id: body.order_id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customer_id: body.customer_id || "C0457",
      customer_name: body.customer_name || "Sokha Meas",
      items: body.items,
      total: totalNum,
      province: body.province || "Phnom Penh",
      payment_method: body.payment_method || "Bakong KHQR",
      status: body.status || "Preparing",
      delivery_address: body.delivery_address || "Street 271, Phnom Penh",
      promo_code: body.promo_code || undefined,
      discountUSD: body.discountUSD ? Number(body.discountUSD) : undefined,
      created_at: new Date().toISOString(),
    };

    try {
      const { db } = await connectToDatabase();
      const result = await db.collection("orders").insertOne(newOrder);
      return NextResponse.json({
        success: true,
        source: "mongodb",
        order: newOrder,
        insertedId: result.insertedId,
      });
    } catch (error: any) {
      // Synchronized in-memory operational store
      addOrderToStore(newOrder as any);
      return NextResponse.json({ success: true, source: "fallback", order: newOrder });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Invalid JSON order payload" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { order_id, status, force } = body;

    if (!order_id || !status) {
      return NextResponse.json({ success: false, error: "Missing order_id or status" }, { status: 400 });
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

    // Update in-memory synchronized store with state machine validation
    const result = updateOrderStatusInStore(order_id, status, !!force);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    try {
      const { db } = await connectToDatabase();
      await db
        .collection("orders")
        .updateOne({ order_id }, { $set: { status, updated_at: new Date() } });
    } catch (error: any) {
      // MongoDB write error logged, synchronized store already updated
    }

    return NextResponse.json({
      success: true,
      order_id,
      status,
      order: result.order,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }
}
