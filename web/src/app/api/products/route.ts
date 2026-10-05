import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const products = await db.collection("products").find({}).toArray();
    return NextResponse.json({ success: true, source: "mongodb", products });
  } catch (error) {
    console.warn("MongoDB fetch failed, serving fallback products:", error);
    // Fallback baseline from scenario
    const fallbackProducts = [
      {
        product_id: "P2210",
        name: "Smartphone X",
        category: "Electronics",
        price: 289.0,
        status: "active",
        screen_size: "6.5 inches",
        warranty: "1 year",
      },
      {
        product_id: "P3314",
        name: "Cotton T-Shirt",
        category: "Clothing",
        price: 15.0,
        status: "active",
        size: "M",
        colours: ["Red", "Blue"],
      },
      {
        product_id: "P0874",
        name: "Jasmine Rice 5kg",
        category: "Groceries",
        price: 3.5,
        status: "active",
        weight: "5kg",
        expiry_date: "2027-09-01",
      },
    ];
    return NextResponse.json({ success: true, source: "fallback", products: fallbackProducts });
  }
}
