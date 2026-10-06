import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { findProductById, updateProductInStore, addProductReview } from "@/lib/data";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { db } = await connectToDatabase();
    const product = await db.collection("products").findOne({ product_id: id });
    if (product) {
      return NextResponse.json({ success: true, source: "mongodb", product });
    }
  } catch (error) {
    // MongoDB unavailable, check synchronized store
  }

  const fallback = findProductById(id);
  if (fallback) {
    return NextResponse.json({ success: true, source: "fallback", product: fallback });
  }

  return NextResponse.json({ success: false, error: `Product "${id}" not found in catalog` }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();

    if (body.price !== undefined) {
      const priceNum = Number(body.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        return NextResponse.json(
          { success: false, error: "Validation error: price must be a positive number." },
          { status: 400 }
        );
      }
      body.price = priceNum;
    }

    if (body.stock !== undefined) {
      const stockNum = Number(body.stock);
      if (isNaN(stockNum) || stockNum < 0) {
        return NextResponse.json(
          { success: false, error: "Validation error: stock cannot be negative." },
          { status: 400 }
        );
      }
      body.stock = stockNum;
    }

    try {
      const { db } = await connectToDatabase();
      await db.collection("products").updateOne(
        { product_id: id },
        { $set: { ...body, updated_at: new Date() } }
      );
    } catch (error: any) {
      // Continue to update synchronized fallback store
    }

    const updated = updateProductInStore(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: `Product "${id}" not found` }, { status: 404 });
    }

    return NextResponse.json({ success: true, product_id: id, product: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { author, rating, comment } = body;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    const updated = addProductReview(id, {
      author: author || "Verified Customer",
      rating: Number(rating),
      comment: comment || "Great product quality!",
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: `Product "${id}" not found` }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Invalid review payload" }, { status: 400 });
  }
}
