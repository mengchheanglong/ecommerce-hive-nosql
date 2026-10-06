import { Injectable, Inject } from "@nestjs/common";
import { Db } from "mongodb";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class CatalogService {
  constructor(@Inject("MONGODB_CONNECTION") private readonly db: Db) {}

  private fallbackProducts: any[] = [
    {
      product_id: "P2210",
      name: "Ultra Smartphone Pro Max",
      category: "Electronics",
      price: 289.0,
      status: "active",
      screen_size: "6.7 inch OLED",
      warranty: "1 Year Official",
      description: "Flagship AMOLED display with high-efficiency 5G modem.",
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
      description: "Award-winning Malys Angkor aromatic long-grain rice.",
    },
  ];

  async findAll(category?: string, search?: string) {
    if (this.db) {
      try {
        const query: any = {};
        if (category && category !== "All") query.category = category;
        if (search) query.name = { $regex: search, $options: "i" };

        const products = await this.db.collection("products").find(query).toArray();
        return { success: true, source: "mongodb", count: products.length, products };
      } catch (err) {
        console.warn("MongoDB catalog query failed, using fallback:", err);
      }
    }

    let filtered = [...this.fallbackProducts];
    if (category && category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    return { success: true, source: "fallback", count: filtered.length, products: filtered };
  }

  async findOne(productId: string) {
    if (this.db) {
      const product = await this.db.collection("products").findOne({ product_id: productId });
      if (product) return { success: true, product };
    }
    const product = this.fallbackProducts.find((p) => p.product_id === productId);
    return { success: !!product, product };
  }

  async create(dto: CreateProductDto) {
    const product = {
      product_id: dto.product_id || `P${Math.floor(1000 + Math.random() * 9000)}`,
      name: dto.name,
      category: dto.category,
      price: Number(dto.price),
      status: dto.status || "active",
      screen_size: dto.screen_size,
      warranty: dto.warranty,
      size: dto.size,
      colours: dto.colours,
      weight: dto.weight,
      expiry_date: dto.expiry_date,
      description: dto.description,
      created_at: new Date(),
    };

    if (this.db) {
      const res = await this.db.collection("products").insertOne(product);
      return { success: true, insertedId: res.insertedId, product };
    }
    this.fallbackProducts.push(product as any);
    return { success: true, product };
  }

  async delete(productId: string) {
    if (this.db) {
      await this.db.collection("products").deleteOne({ product_id: productId });
      return { success: true, deletedId: productId };
    }
    this.fallbackProducts = this.fallbackProducts.filter((p) => p.product_id !== productId);
    return { success: true, deletedId: productId };
  }

  async update(productId: string, dto: Partial<CreateProductDto>) {
    if (this.db) {
      try {
        await this.db.collection("products").updateOne(
          { product_id: productId },
          { $set: { ...dto, updated_at: new Date() } }
        );
        return { success: true, product_id: productId };
      } catch (err) {
        console.warn("MongoDB update failed, updating fallback:", err);
      }
    }
    const idx = this.fallbackProducts.findIndex((p) => p.product_id === productId);
    if (idx !== -1) {
      this.fallbackProducts[idx] = { ...this.fallbackProducts[idx], ...dto };
    }
    return { success: true, product_id: productId };
  }
}
