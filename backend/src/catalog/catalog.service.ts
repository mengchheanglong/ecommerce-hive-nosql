import { Injectable, Inject, OnModuleInit, BadRequestException, ConflictException, ServiceUnavailableException, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { Db } from "mongodb";
import { InventoryService, moneyMinor } from "../inventory/inventory.service";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class CatalogService implements OnModuleInit {
  constructor(@Inject("MONGODB_CONNECTION") private readonly db: Db, private readonly inventory: InventoryService) {}

  private fallbackProducts: any[] = [
    // ELECTRONICS
    {
      product_id: "P2210",
      name: "Ultra Smartphone Pro Max",
      category: "Electronics",
      price: 289.0,
      status: "active",
      stock: 45,
      rating: 4.8,
      reviews_count: 124,
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
      screen_size: "6.7 inch OLED 120Hz",
      warranty: "1 Year Official Distributor",
      frequently_bought_with: ["P2211", "P2215"],
      description: "Flagship AMOLED display with high-efficiency 5G modem, AI computational photography, and fast charge.",
    },
    {
      product_id: "P2211",
      name: "Noise-Cancelling Wireless Earbuds",
      category: "Electronics",
      price: 65.0,
      status: "active",
      stock: 80,
      rating: 4.7,
      reviews_count: 89,
      image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
      screen_size: "Touch Sensor Interface",
      warranty: "6 Months Replacement",
      frequently_bought_with: ["P2210", "P2215"],
      description: "Active noise cancellation up to 42dB with transparency mode and water-resistant nano-coating.",
    },
    {
      product_id: "P2212",
      name: "Curved 4K Ultra-Wide Monitor 34\"",
      category: "Electronics",
      price: 420.0,
      status: "active",
      stock: 18,
      rating: 4.9,
      reviews_count: 53,
      image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=800&q=80",
      screen_size: "34 inch 1500R Curved 4K",
      warranty: "2 Years Manufacturer",
      frequently_bought_with: ["P2214", "P2215"],
      description: "Immersive panoramic display with 99% sRGB color accuracy, USB-C 90W power delivery, and built-in KVM switch.",
    },
    {
      product_id: "P2213",
      name: "Fitness Smartwatch GPS Pro",
      category: "Electronics",
      price: 85.0,
      status: "active",
      stock: 65,
      rating: 4.6,
      reviews_count: 72,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      screen_size: "1.43 inch AMOLED Sapphire",
      warranty: "1 Year Official Distributor",
      description: "Multi-band GPS tracking, continuous SpO2 heart-rate telemetry, and 14-day battery life.",
    },
    {
      product_id: "P2214",
      name: "Mechanical Keyboard RGB (Hot-Swap)",
      category: "Electronics",
      price: 54.0,
      status: "active",
      stock: 50,
      rating: 4.8,
      reviews_count: 64,
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
      screen_size: "75% Compact Layout",
      warranty: "1 Year Warranty",
      frequently_bought_with: ["P2212", "P2211"],
      description: "Factory-lubed linear switches with sound-dampening silicone gasket and RGB backlighting.",
    },
    {
      product_id: "P2215",
      name: "Ultra Fast-Charging Power Bank 20,000mAh",
      category: "Electronics",
      price: 36.0,
      status: "active",
      stock: 110,
      rating: 4.9,
      reviews_count: 145,
      image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80",
      screen_size: "Smart Digital Power Display",
      warranty: "6 Months Replacement",
      description: "65W USB-C Power Delivery charges laptops and smartphones simultaneously.",
    },
    {
      product_id: "P2216",
      name: "Wi-Fi 6 Gigabit Mesh Router",
      category: "Electronics",
      price: 79.0,
      status: "active",
      stock: 40,
      rating: 4.7,
      reviews_count: 38,
      image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80",
      screen_size: "Dual-Band AX3000",
      warranty: "2 Years Replacement",
      description: "Covers up to 3,000 sq ft with low-latency beamforming antennas.",
    },
    {
      product_id: "P2217",
      name: "Compact 4K Foldable Drone with Gimbal",
      category: "Electronics",
      price: 349.0,
      status: "active",
      stock: 14,
      rating: 4.8,
      reviews_count: 29,
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
      screen_size: "4K 60fps 3-Axis Gimbal",
      warranty: "1 Year Manufacturer",
      description: "Under 249g ultra-lightweight drone with obstacle avoidance and 31-minute flight time.",
    },

    // CLOTHING
    {
      product_id: "P3314",
      name: "Premium Linen Casual Shirt",
      category: "Clothing",
      price: 18.5,
      status: "active",
      stock: 120,
      rating: 4.6,
      reviews_count: 67,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      size: "L",
      colours: ["Navy Blue", "Sand Beige", "Olive"],
      frequently_bought_with: ["P3316", "P3319"],
      description: "Breathable 100% natural organic linen tailored for tropical climates with reinforced horn-button closure.",
    },
    {
      product_id: "P3315",
      name: "Handwoven Silk Scarf (Krama Luxe)",
      category: "Clothing",
      price: 32.0,
      status: "active",
      stock: 60,
      rating: 4.9,
      reviews_count: 94,
      image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
      size: "Free Size (180x60cm)",
      colours: ["Crimson Red", "Royal Indigo", "Emerald Gold"],
      frequently_bought_with: ["P3314", "P3318"],
      description: "Artisanal handwoven silk from Takeo weavers, featuring authentic heritage patterns with a modern drape.",
    },
    {
      product_id: "P3316",
      name: "Everyday Stretch Chino Pants",
      category: "Clothing",
      price: 24.0,
      status: "active",
      stock: 75,
      rating: 4.5,
      reviews_count: 42,
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
      size: "32W x 30L",
      colours: ["Khaki", "Charcoal", "Dark Navy"],
      frequently_bought_with: ["P3314", "P3319"],
      description: "Comfortable four-way stretch cotton twill designed for versatile office and casual city commuting.",
    },
    {
      product_id: "P3317",
      name: "Organic Cotton Short-Sleeve Resort Shirt",
      category: "Clothing",
      price: 21.0,
      status: "active",
      stock: 90,
      rating: 4.7,
      reviews_count: 58,
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
      size: "M",
      colours: ["Palm Leaf Green", "Ivory White"],
      description: "Relaxed Cuban collar cut in pure combed cotton, pre-washed for zero shrinkage and ultra-soft feel.",
    },
    {
      product_id: "P3318",
      name: "Waterproof Commuter Backpack 22L",
      category: "Clothing",
      price: 45.0,
      status: "active",
      stock: 55,
      rating: 4.8,
      reviews_count: 83,
      image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
      size: "22 Litres (16\" Laptop Compartment)",
      colours: ["Matte Black", "Graphite Grey"],
      description: "Weatherproof coated canvas with magnetic quick-release clasps and padded ergonomic shoulder straps.",
    },
    {
      product_id: "P3319",
      name: "Handcrafted Heritage Leather Loafers",
      category: "Clothing",
      price: 58.0,
      status: "active",
      stock: 35,
      rating: 4.9,
      reviews_count: 46,
      image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80",
      size: "EU 42 (US 9)",
      colours: ["Cognac Brown", "Ebony Black"],
      description: "Full-grain vegetable-tanned leather handcrafted by local cordwainers with cushioned cork insole.",
    },
    {
      product_id: "P3320",
      name: "Breathable Bamboo Fiber Lounge Set",
      category: "Clothing",
      price: 28.0,
      status: "active",
      stock: 65,
      rating: 4.6,
      reviews_count: 39,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      size: "L",
      colours: ["Sage Mist", "Warm Oat"],
      description: "Thermo-regulating natural bamboo viscose two-piece lounge set engineered for hot and humid climates.",
    },
    {
      product_id: "P3321",
      name: "UV-Protection Lightweight Sun Hoodie",
      category: "Clothing",
      price: 19.5,
      status: "active",
      stock: 100,
      rating: 4.7,
      reviews_count: 61,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
      size: "XL",
      colours: ["Glacier Blue", "Stone Grey"],
      description: "UPF 50+ sun protection hooded jacket with thumbholes and fast-drying fabric.",
    },

    // GROCERIES
    {
      product_id: "P0874",
      name: "Battambang Jasmine Fragrant Rice 5kg",
      category: "Groceries",
      price: 4.8,
      status: "active",
      stock: 250,
      rating: 4.9,
      reviews_count: 310,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
      weight: "5.0 kg Bag",
      expiry_date: "2027-10-01",
      frequently_bought_with: ["P0875", "P0878"],
      description: "Award-winning Malys Angkor aromatic long-grain jasmine rice, vacuum-sealed at source in Battambang.",
    },
    {
      product_id: "P0875",
      name: "Kampot Organic Black Pepper 250g",
      category: "Groceries",
      price: 7.5,
      status: "active",
      stock: 140,
      rating: 5.0,
      reviews_count: 184,
      image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
      weight: "250g Glass Jar",
      expiry_date: "2028-04-15",
      frequently_bought_with: ["P0874", "P0879"],
      description: "Protected Geographical Indication (PGI) certified Kampot peppercorns with intense floral and mint notes.",
    },
    {
      product_id: "P0876",
      name: "Mondulkiri Dark Roast Arabica Beans 500g",
      category: "Groceries",
      price: 9.2,
      status: "active",
      stock: 95,
      rating: 4.8,
      reviews_count: 112,
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
      weight: "500g Foil Valve Bag",
      expiry_date: "2027-08-30",
      frequently_bought_with: ["P0877", "P0879"],
      description: "High-altitude volcanic soil highland beans roasted in small artisan batches for rich cacao undertones.",
    },
    {
      product_id: "P0877",
      name: "Wild Raw Forest Honey from Koh Kong 500ml",
      category: "Groceries",
      price: 14.0,
      status: "active",
      stock: 70,
      rating: 4.9,
      reviews_count: 89,
      image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80",
      weight: "500ml Sealed Glass Bottle",
      expiry_date: "2028-06-15",
      description: "Harvested sustainably by community foragers in the Cardamom Mountains, unprocessed and unfiltered.",
    },
    {
      product_id: "P0878",
      name: "Kampot Fleur de Sel (Flower of Salt) 300g",
      category: "Groceries",
      price: 5.5,
      status: "active",
      stock: 115,
      rating: 4.9,
      reviews_count: 67,
      image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=800&q=80",
      weight: "300g Ceramic Crock",
      expiry_date: "2029-01-01",
      description: "Hand-skimmed delicate salt crystals from solar salt evaporation ponds along the Gulf of Thailand coastline.",
    },
    {
      product_id: "P0879",
      name: "Artisanal Kampong Speu Palm Sugar 500g",
      category: "Groceries",
      price: 3.8,
      status: "active",
      stock: 180,
      rating: 4.8,
      reviews_count: 121,
      image: "https://images.unsplash.com/photo-1571951526378-bdf707fce400?auto=format&fit=crop&w=800&q=80",
      weight: "500g Eco Palm Container",
      expiry_date: "2027-09-20",
      description: "PGI certified natural unrefined golden palm sugar syrup granulated traditionally over wood fires.",
    },
    {
      product_id: "P0880",
      name: "Organic Lemongrass & Ginger Herbal Tea 50 Bags",
      category: "Groceries",
      price: 6.5,
      status: "active",
      stock: 85,
      rating: 4.7,
      reviews_count: 54,
      image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
      weight: "150g Biodegradable Box",
      expiry_date: "2027-11-30",
      description: "Refreshing immune-supporting herbal infusion crafted with whole sun-dried lemongrass stalks.",
    },
    {
      product_id: "P0881",
      name: "Roasted Cashew Nuts with Sea Salt 400g",
      category: "Groceries",
      price: 8.5,
      status: "active",
      stock: 130,
      rating: 4.9,
      reviews_count: 165,
      image: "https://images.unsplash.com/photo-1641718085818-2f0432d84fe4?auto=format&fit=crop&w=800&q=80",
      weight: "400g Foil Seal Tub",
      expiry_date: "2027-07-15",
      description: "Premium jumbo M23 cashew nuts grown in Kampong Cham, slow-roasted with skin on for deep crunch.",
    },
  ];

  async onModuleInit() {
    if (this.db) {
      try {
        const count = await this.db.collection("products").countDocuments();
        if (count === 0) {
          console.log("[CatalogService] Seeding 24 initial products into MongoDB collection...");
          await this.db.collection("products").insertMany(this.fallbackProducts);
          console.log("[CatalogService] MongoDB catalog seeded successfully.");
        }
      } catch (err) {
        console.warn("[CatalogService] Could not check or seed MongoDB collection:", err);
      }
    }
  }

  async findAll(category?: string, search?: string, subcategory?: string) {
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    if (this.db) {
      try {
        const query: any = {};

        // Intelligent category matching across name, slug, or aliases
        if (category && category !== "All") {
          const escCat = escapeRegex(category);
          query.$or = [
            { category: { $regex: `^${escCat}$`, $options: "i" } },
            { category_slug: { $regex: `^${escCat}$`, $options: "i" } },
            { category_aliases: { $regex: `^${escCat}$`, $options: "i" } },
          ];
        }

        // Subcategory filter
        if (subcategory && subcategory !== "all") {
          const escSub = escapeRegex(subcategory);
          const subCond = [
            { subcategory: { $regex: `^${escSub}$`, $options: "i" } },
            { subcategory_name: { $regex: `^${escSub}$`, $options: "i" } },
          ];
          if (query.$or) {
            query.$and = [{ $or: query.$or }, { $or: subCond }];
            delete query.$or;
          } else {
            query.$or = subCond;
          }
        }

        // Search keyword filter
        if (search) {
          const searchCond = [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { subcategory_name: { $regex: search, $options: "i" } },
            { product_id: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ];
          if (query.$and) {
            query.$and.push({ $or: searchCond });
          } else if (query.$or) {
            query.$and = [{ $or: query.$or }, { $or: searchCond }];
            delete query.$or;
          } else {
            query.$or = searchCond;
          }
        }

        const products = await this.db.collection("products").find(query).toArray();
        return { success: true, source: "mongodb", count: products.length, products };
      } catch (err) {
        console.warn("MongoDB catalog query failed, using fallback:", err);
      }
    }

    let filtered = [...this.fallbackProducts];
    if (category && category !== "All") {
      const catLower = category.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.category.toLowerCase() === catLower ||
          (p.category_slug && p.category_slug.toLowerCase() === catLower) ||
          (p.category_aliases && p.category_aliases.some((a: string) => a.toLowerCase() === catLower))
      );
    }
    if (subcategory && subcategory !== "all") {
      const subLower = subcategory.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.subcategory && p.subcategory.toLowerCase() === subLower) ||
          (p.subcategory_name && p.subcategory_name.toLowerCase() === subLower)
      );
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.product_id.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return { success: true, source: "fallback", count: filtered.length, products: filtered };
  }

  async getCategoryCounts() {
    if (this.db) {
      try {
        const [categoriesAgg, subcategoriesAgg] = await Promise.all([
          this.db
            .collection("products")
            .aggregate([{ $group: { _id: "$category_slug", count: { $sum: 1 } } }])
            .toArray(),
          this.db
            .collection("products")
            .aggregate([{ $group: { _id: "$subcategory", count: { $sum: 1 } } }])
            .toArray(),
        ]);

        const counts: Record<string, number> = {};
        for (const item of categoriesAgg) {
          if (item._id) counts[item._id] = item.count;
        }
        for (const item of subcategoriesAgg) {
          if (item._id) counts[item._id] = item.count;
        }
        return { success: true, counts };
      } catch (err) {
        console.warn("Failed to aggregate category counts:", err);
      }
    }
    return { success: true, counts: {} };
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
    await this.inventory.ensureReady();
    if (!Number.isSafeInteger(dto.stock ?? 50) || (dto.stock ?? 50) < 0) throw new BadRequestException("Stock must be a nonnegative safe integer");
    moneyMinor(dto.price);
    if (dto.product_id !== undefined && (typeof dto.product_id !== "string" || !dto.product_id.trim())) throw new BadRequestException("Product ID must be a nonempty string");
    const product: any = {
      product_id: dto.product_id || `P-${randomUUID()}`,
      name: dto.name,
      category: dto.category,
      price: Number(dto.price),
      price_minor: moneyMinor(dto.price),
      status: dto.status || "active",
      screen_size: dto.screen_size,
      warranty: dto.warranty,
      size: dto.size,
      colours: dto.colours,
      weight: dto.weight,
      expiry_date: dto.expiry_date,
      dimensions: dto.dimensions,
      material: dto.material,
      volume: dto.volume,
      skin_type: dto.skin_type,
      artisan: dto.artisan,
      origin_province: dto.origin_province,
      category_slug: dto.category_slug,
      category_aliases: dto.category_aliases,
      subcategory: dto.subcategory,
      subcategory_name: dto.subcategory_name,
      stock: dto.stock ?? 50,
      reserved_stock: 0,
      image: dto.image,
      description: dto.description,
      frequently_bought_with: dto.frequently_bought_with || [],
      created_at: new Date(),
    };

    if (this.db) {
      const res = await this.db.collection("products").insertOne(product);
      return { success: true, insertedId: res.insertedId, product };
    }
    throw new ServiceUnavailableException("Catalog writes require MongoDB");
  }

  async update(productId: string, dto: Partial<CreateProductDto>) {
    await this.inventory.ensureReady();
    // Allow only catalog metadata; counters and identity cannot bypass reservations.
    const allowed = new Set(["name", "category", "price", "status", "screen_size", "warranty", "size", "colours", "weight", "expiry_date", "dimensions", "material", "volume", "skin_type", "artisan", "origin_province", "category_slug", "category_aliases", "subcategory", "subcategory_name", "image", "images", "description", "frequently_bought_with", "reviews", "rating", "reviews_count", "seller", "store_id", "store_slug"]);
    if (Object.keys(dto).some(key => !allowed.has(key))) throw new BadRequestException("Inventory counters and product identity cannot be edited through catalog updates");
    if (dto.price !== undefined) moneyMinor(dto.price);
    const product = await this.db.collection("products").findOneAndUpdate(
      { product_id: productId }, { $set: { ...dto, ...(dto.price !== undefined ? { price_minor: moneyMinor(dto.price) } : {}), updated_at: new Date() } }, { returnDocument: "after" });
    if (!product) throw new NotFoundException("Product not found");
    return { success: true, product };
  }

  async delete(productId: string) {
    await this.inventory.ensureReady();
    const result = await this.db.collection("products").deleteOne({ product_id: productId, $or: [{ reserved_stock: 0 }, { reserved_stock: { $exists: false } }] });
    if (!result.deletedCount) {
      if (!await this.db.collection("products").findOne({ product_id: productId })) throw new NotFoundException("Product not found");
      throw new ConflictException("A product with active reservations cannot be deleted");
    }
    return { success: true };
  }

  async adjustStock(_items: Array<{ product_id: string; quantity: number }>) {
    throw new ConflictException("Unscoped stock adjustment is disabled; use the order reservation lifecycle");
  }
}
