import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { INITIAL_PRODUCTS } from "@/lib/data";

let inMemoryProducts = [...INITIAL_PRODUCTS];

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
    console.warn("MongoDB fetch failed, serving fallback products:", error);
  }

  let list = [...inMemoryProducts];
  if (category && category !== "All") {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );
  }
  return NextResponse.json({ success: true, source: "fallback", products: list });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProduct = {
    product_id: body.product_id || `P${Math.floor(1000 + Math.random() * 9000)}`,
    name: body.name,
    category: body.category,
    price: Number(body.price),
    status: body.status || "active",
    screen_size: body.screen_size,
    warranty: body.warranty,
    size: body.size,
    colours: body.colours,
    weight: body.weight,
    expiry_date: body.expiry_date,
    description: body.description,
    created_at: new Date(),
  };

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("products").insertOne(newProduct);
    return NextResponse.json({ success: true, source: "mongodb", product: newProduct, insertedId: result.insertedId });
  } catch (error: any) {
    console.warn("Failed to insert product in MongoDB, storing in fallback state:", error);
    inMemoryProducts.push(newProduct as any);
    return NextResponse.json({ success: true, source: "fallback", product: newProduct });
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
    return NextResponse.json({ success: true, source: "mongodb", deletedId: productId });
  } catch (error: any) {
    console.warn("Failed to delete product in MongoDB, updating fallback state:", error);
    inMemoryProducts = inMemoryProducts.filter((p) => p.product_id !== productId);
    return NextResponse.json({ success: true, source: "fallback", deletedId: productId });
  }
}
