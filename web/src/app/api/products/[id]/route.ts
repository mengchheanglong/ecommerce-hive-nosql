import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { INITIAL_PRODUCTS } from "@/lib/data";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { db } = await connectToDatabase();
    const product = await db.collection("products").findOne({ product_id: id });
    if (product) {
      return NextResponse.json({ success: true, source: "mongodb", product });
    }
  } catch (error) {
    console.warn("MongoDB single product lookup fallback:", error);
  }

  const fallback = INITIAL_PRODUCTS.find((p) => p.product_id === id);
  if (fallback) {
    return NextResponse.json({ success: true, source: "fallback", product: fallback });
  }

  return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    await db.collection("products").updateOne(
      { product_id: id },
      { $set: { ...body, updated_at: new Date() } }
    );
    return NextResponse.json({ success: true, product_id: id });
  } catch (error: any) {
    console.warn("MongoDB single product update fallback:", error);
    return NextResponse.json({ success: true, product_id: id, note: "fallback mock update" });
  }
}
