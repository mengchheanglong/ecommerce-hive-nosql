import { Product } from "@/types";
import { getProductsStore, addProductToStore, updateProductInStore } from "./data";

export interface WarehouseSkuDefinition {
  product_id: string;
  name: string;
  category: string;
  category_slug: string;
  category_aliases: string[];
  stock: number;
  warehouse_facility: string;
  warehouse_unit: string;
  suggested_price: number;
  description: string;
  weight?: string;
  dimensions?: string;
  warranty?: string;
  volume?: string;
  sample_image: string;
  sample_image_label: string;
}

export const SUPPLY_CHAIN_WAREHOUSE_SKUS: WarehouseSkuDefinition[] = [
  {
    product_id: "SKU-MED-01",
    name: "Emergency First Aid Kit (Type A Certified)",
    category: "Beauty & Wellness",
    category_slug: "beauty-wellness",
    category_aliases: ["Beauty & Wellness", "Health", "Medical"],
    stock: 500,
    warehouse_facility: "WH-PP-01 Daun Penh Hub",
    warehouse_unit: "each",
    suggested_price: 29.50,
    weight: "1.8 kg Kit",
    dimensions: "28cm x 20cm x 12cm",
    description: "OSHA & Ministry of Health certified 120-piece emergency response kit with waterproof casing.",
    sample_image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=80",
    sample_image_label: "Hospital Grade First Aid Kit",
  },
  {
    product_id: "SKU-ELEC-01",
    name: "Solar Inverter Battery 5kWh (LiFePO4 Storage)",
    category: "Electronics",
    category_slug: "electronics",
    category_aliases: ["Electronics", "Power", "Solar"],
    stock: 200,
    warehouse_facility: "WH-PP-01 Daun Penh Hub",
    warehouse_unit: "each",
    suggested_price: 850.00,
    weight: "48.0 kg",
    dimensions: "65cm x 45cm x 22cm",
    warranty: "5 Years Official",
    description: "Grade-A lithium iron phosphate energy storage module designed for off-grid and backup hybrid solar installations.",
    sample_image: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=800&q=80",
    sample_image_label: "LiFePO4 Solar Battery Unit",
  },
  {
    product_id: "SKU-FOOD-01",
    name: "Organic Jasmine Rice 25kg Bulk Sack (Phka Rumduol)",
    category: "Food & Groceries",
    category_slug: "food-groceries",
    category_aliases: ["Food & Groceries", "Groceries", "Food"],
    stock: 1000,
    warehouse_facility: "WH-PP-01 Daun Penh Hub",
    warehouse_unit: "each",
    suggested_price: 24.00,
    weight: "25.0 kg Sack",
    description: "Export-grade premium Phka Rumduol fragrant jasmine rice milled in Battambang with moisture-resistant poly-woven bag.",
    sample_image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    sample_image_label: "Jasmine Rice Harvest Sack",
  },
  {
    product_id: "SKU-COLD-01",
    name: "Temperature-Controlled Vaccine Vial (Cold-Chain Pack)",
    category: "Beauty & Wellness",
    category_slug: "beauty-wellness",
    category_aliases: ["Beauty & Wellness", "Medical", "Cold-Chain"],
    stock: 300,
    warehouse_facility: "WH-PP-01 Daun Penh Hub",
    warehouse_unit: "each",
    suggested_price: 45.00,
    volume: "10ml Sealed Vial",
    description: "Precision temperature-buffered cold-chain biological vial maintained at 2°C to 8°C in validated insulated transport shipper.",
    sample_image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    sample_image_label: "Cold-Chain Medical Vial",
  },
  {
    product_id: "SKU-FASH-01",
    name: "Handwoven Silk Krama Heritage Scarf (Siem Reap)",
    category: "Fashion & Accessories",
    category_slug: "fashion",
    category_aliases: ["Fashion & Accessories", "Clothing", "Fashion"],
    stock: 450,
    warehouse_facility: "WH-REP-01 Siem Reap Depot",
    warehouse_unit: "each",
    suggested_price: 18.50,
    dimensions: "180cm x 70cm",
    description: "100% natural raw mulberry silk handloomed by women artisan cooperatives in Banteay Srei.",
    sample_image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
    sample_image_label: "Handwoven Silk Krama",
  },
  {
    product_id: "SKU-HOME-01",
    name: "Kampong Chhnang Artisan Glazed Terracotta Planter",
    category: "Home & Living",
    category_slug: "home-living",
    category_aliases: ["Home & Living", "Home", "Decor"],
    stock: 180,
    warehouse_facility: "WH-BAT-01 Battambang Depot",
    warehouse_unit: "each",
    suggested_price: 32.00,
    dimensions: "35cm x 35cm x 40cm",
    description: "Kiln-fired earthenware botanical planter hand-thrown using alluvial clay from the Tonle Sap basin.",
    sample_image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    sample_image_label: "Artisan Terracotta Planter",
  },
];

export interface SupplyChainSyncResult {
  success: boolean;
  syncedCount: number;
  newCount: number;
  updatedStockCount: number;
  needsImageCount: number;
  source: "live_api" | "ledger_snapshot";
  facility: string;
}

export async function syncWarehouseCatalog(): Promise<SupplyChainSyncResult> {
  const store = getProductsStore();
  let newCount = 0;
  let updatedStockCount = 0;

  for (const whSku of SUPPLY_CHAIN_WAREHOUSE_SKUS) {
    const existing = store.find((p) => p.product_id === whSku.product_id);

    if (existing) {
      // Reconcile stock from warehouse ledger, but preserve merchant-curated image, price, and description
      updateProductInStore(whSku.product_id, {
        stock: whSku.stock,
        warehouse_facility: whSku.warehouse_facility,
        warehouse_unit: whSku.warehouse_unit,
        synced_from_supply_chain: true,
        needs_image: !existing.image || existing.image.trim() === "",
      });
      updatedStockCount++;
    } else {
      // Brand new warehouse SKU: imported without image so merchant can add storefront photo
      const newProduct: Product = {
        product_id: whSku.product_id,
        name: whSku.name,
        category: whSku.category,
        category_slug: whSku.category_slug,
        category_aliases: whSku.category_aliases,
        price: whSku.suggested_price,
        stock: whSku.stock,
        status: "needs_merchandising",
        image: "", // Explicitly empty: awaiting merchant image!
        needs_image: true,
        synced_from_supply_chain: true,
        warehouse_facility: whSku.warehouse_facility,
        warehouse_unit: whSku.warehouse_unit,
        weight: whSku.weight,
        dimensions: whSku.dimensions,
        warranty: whSku.warranty,
        volume: whSku.volume,
        description: whSku.description,
        rating: 5.0,
        reviews_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      addProductToStore(newProduct);
      newCount++;
    }
  }

  const allProducts = getProductsStore();
  const needsImageCount = allProducts.filter((p) => !p.image || p.image.trim() === "").length;

  return {
    success: true,
    syncedCount: SUPPLY_CHAIN_WAREHOUSE_SKUS.length,
    newCount,
    updatedStockCount,
    needsImageCount,
    source: "ledger_snapshot",
    facility: "WH-PP-01 Daun Penh Hub",
  };
}
