import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const products = await db.collection("products").find({}).toArray();
    return NextResponse.json({ success: true, source: "mongodb", products });
  } catch (error) {
    console.warn("MongoDB fetch failed, serving fallback products:", error);
    const fallbackProducts = [
      {
        product_id: "P2210",
        name: "Ultra Smartphone Pro Max",
        category: "Electronics",
        price: 289.0,
        status: "active",
        screen_size: "6.7 inch OLED",
        warranty: "1 Year Official",
        description: "Flagship AMOLED display with high-efficiency 5G modem and all-day fast charge.",
      },
      {
        product_id: "P3314",
        name: "Premium Linen Casual Shirt",
        category: "Clothing",
        price: 18.5,
        status: "active",
        size: "L",
        colours: ["Navy Blue", "Sand Beige"],
        description: "Breathable 100% natural organic linen tailored for tropical climates.",
      },
      {
        product_id: "P0874",
        name: "Battambang Jasmine Fragrant Rice 5kg",
        category: "Groceries",
        price: 4.8,
        status: "active",
        weight: "5.0 kg",
        expiry_date: "2027-10-01",
        description: "Award-winning Malys Angkor aromatic long-grain rice, vacuum-sealed at source.",
      },
    ];
    return NextResponse.json({ success: true, source: "fallback", products: fallbackProducts });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();

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

    const result = await db.collection("products").insertOne(newProduct);
    return NextResponse.json({ success: true, product: newProduct, insertedId: result.insertedId });
  } catch (error: any) {
    console.error("Failed to insert product in MongoDB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ success: false, error: "Missing product id" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    await db.collection("products").deleteOne({ product_id: productId });
    return NextResponse.json({ success: true, deletedId: productId });
  } catch (error: any) {
    console.error("Failed to delete product in MongoDB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
