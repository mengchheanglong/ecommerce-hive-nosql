import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import {
  getProductsStore,
  addProductToStore,
  deleteProductFromStore,
} from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  try {
    const { db } = await connectToDatabase();
    const query: any = {};
    if (category && category !== "All") query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await db.collection("products").find(query).toArray();
    if (products.length > 0) {
      return NextResponse.json({ success: true, source: "mongodb", products });
    }
  } catch (error) {
    // MongoDB unavailable, proceed to synchronized fallback store
  }

  let list = [...getProductsStore()];
  if (category && category !== "All") {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.product_id.toLowerCase().includes(search.toLowerCase())
    );
  }
  return NextResponse.json({ success: true, source: "fallback", products: list });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Polymorphic Document Validation
    if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Validation failed: Product name must be at least 2 characters." },
        { status: 400 }
      );
    }

    const priceNum = Number(body.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { success: false, error: "Validation failed: Product price must be a positive number." },
        { status: 400 }
      );
    }

    const stockNum = body.stock !== undefined ? Number(body.stock) : 25;
    if (isNaN(stockNum) || stockNum < 0) {
      return NextResponse.json(
        { success: false, error: "Validation failed: Product stock cannot be negative." },
        { status: 400 }
      );
    }

    const newProduct = {
      product_id: body.product_id?.trim() || `P${Math.floor(1000 + Math.random() * 9000)}`,
      name: body.name.trim(),
      category: body.category || "Electronics",
      price: priceNum,
      stock: stockNum,
      status: body.status || "active",
      screen_size: body.screen_size?.trim() || undefined,
      warranty: body.warranty?.trim() || undefined,
      size: body.size?.trim() || undefined,
      colours: Array.isArray(body.colours)
        ? body.colours.filter((c: string) => c && c.trim().length > 0)
        : undefined,
      weight: body.weight?.trim() || undefined,
      expiry_date: body.expiry_date?.trim() || undefined,
      description: body.description?.trim() || undefined,
      rating: 5.0,
      reviews_count: 0,
      reviews: [],
      created_at: new Date().toISOString(),
    };

    try {
      const { db } = await connectToDatabase();
      const result = await db.collection("products").insertOne(newProduct);
      return NextResponse.json({
        success: true,
        source: "mongodb",
        product: newProduct,
        insertedId: result.insertedId,
      });
    } catch (error: any) {
      // Synchronized fallback store
      addProductToStore(newProduct as any);
      return NextResponse.json({ success: true, source: "fallback", product: newProduct });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("id");

  if (!productId) {
    return NextResponse.json({ success: false, error: "Missing product id" }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    await db.collection("products").deleteOne({ product_id: productId });
  } catch (error: any) {
    // Continue to remove from fallback store
  }

  deleteProductFromStore(productId);
  return NextResponse.json({ success: true, deletedId: productId });
}
