import {
  Product,
  OrderRecord,
  CustomerProfile,
  RiderTelemetry,
  ReferralNode,
  HiveQueryMeta,
  StoreTenant,
  PlatformKPIs,
  StoreKPIs,
  SystemDatastoreStatus,
} from "@/types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    "product_id": "P0874",
    "name": "Battambang Jasmine Fragrant Rice 5kg (Malys Angkor)",
    "category": "Food & Groceries",
    "category_slug": "food-groceries",
    "category_aliases": [
      "Groceries",
      "Food",
      "Food & Groceries",
      "food-groceries"
    ],
    "subcategory": "rice-grains",
    "subcategory_name": "Rice & Grains",
    "price": 4.8,
    "status": "active",
    "stock": 250,
    "rating": 4.9,
    "reviews_count": 310,
    "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    "weight": "5.0 kg Bag",
    "expiry_date": "2027-10-01",
    "description": "Award-winning Malys Angkor aromatic long-grain jasmine rice, vacuum-sealed at source in Battambang province.",
    "frequently_bought_with": [
      "P0875",
      "P0878"
    ]
  },
  {
    "product_id": "P0875",
    "name": "Kampot Organic Black Pepper 250g (PGI Certified)",
    "category": "Food & Groceries",
    "category_slug": "food-groceries",
    "category_aliases": [
      "Groceries",
      "Food",
      "Food & Groceries",
      "food-groceries"
    ],
    "subcategory": "pantry-spices",
    "subcategory_name": "Pantry & Spices",
    "price": 7.5,
    "status": "active",
    "stock": 140,
    "rating": 5,
    "reviews_count": 184,
    "image": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80",
    "weight": "250g Glass Jar",
    "expiry_date": "2028-04-15",
    "description": "Protected Geographical Indication (PGI) certified Kampot peppercorns with intense floral and minty aroma.",
    "frequently_bought_with": [
      "P0874",
      "P0878"
    ]
  },
  {
    "product_id": "P0876",
    "name": "Mondulkiri Dark Roast Arabica Beans 500g",
    "category": "Food & Groceries",
    "category_slug": "food-groceries",
    "category_aliases": [
      "Groceries",
      "Food",
      "Food & Groceries",
      "food-groceries"
    ],
    "subcategory": "coffee-tea",
    "subcategory_name": "Coffee & Tea",
    "price": 9.2,
    "status": "active",
    "stock": 95,
    "rating": 4.8,
    "reviews_count": 112,
    "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
    "weight": "500g Foil Valve Bag",
    "expiry_date": "2027-08-30",
    "description": "High-altitude volcanic soil highland beans roasted in small artisan batches for rich cacao undertones."
  },
  {
    "product_id": "P0877",
    "name": "Wild Raw Forest Honey from Koh Kong 500ml",
    "category": "Food & Groceries",
    "category_slug": "food-groceries",
    "category_aliases": [
      "Groceries",
      "Food",
      "Food & Groceries",
      "food-groceries"
    ],
    "subcategory": "pantry-spices",
    "subcategory_name": "Pantry & Spices",
    "price": 14,
    "status": "active",
    "stock": 70,
    "rating": 4.9,
    "reviews_count": 89,
    "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    "weight": "500ml Sealed Glass Bottle",
    "expiry_date": "2028-06-15",
    "description": "Harvested sustainably by community foragers in the Cardamom Mountains, unprocessed and unfiltered."
  },
  {
    "product_id": "P0878",
    "name": "Kampot Fleur de Sel (Flower of Salt) 300g",
    "category": "Food & Groceries",
    "category_slug": "food-groceries",
    "category_aliases": [
      "Groceries",
      "Food",
      "Food & Groceries",
      "food-groceries"
    ],
    "subcategory": "pantry-spices",
    "subcategory_name": "Pantry & Spices",
    "price": 5.5,
    "status": "active",
    "stock": 115,
    "rating": 4.9,
    "reviews_count": 67,
    "image": "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=800&q=80",
    "weight": "300g Ceramic Crock",
    "expiry_date": "2029-01-01",
    "description": "Hand-skimmed delicate salt crystals from solar salt evaporation ponds along the Gulf of Thailand coastline."
  },
  {
    "product_id": "P0879",
    "name": "Artisanal Kampong Speu Palm Sugar 500g",
    "category": "Food & Groceries",
    "category_slug": "food-groceries",
    "category_aliases": [
      "Groceries",
      "Food",
      "Food & Groceries",
      "food-groceries"
    ],
    "subcategory": "palm-sugar-sweeteners",
    "subcategory_name": "Palm Sugar & Sweeteners",
    "price": 3.8,
    "status": "active",
    "stock": 180,
    "rating": 4.8,
    "reviews_count": 121,
    "image": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    "weight": "500g Eco Palm Container",
    "expiry_date": "2027-09-20",
    "description": "PGI certified natural unrefined golden palm sugar syrup granulated traditionally over wood fires."
  },
  {
    "product_id": "P0880",
    "name": "Organic Lemongrass & Ginger Herbal Tea 50 Bags",
    "category": "Food & Groceries",
    "category_slug": "food-groceries",
    "category_aliases": [
      "Groceries",
      "Food",
      "Food & Groceries",
      "food-groceries"
    ],
    "subcategory": "coffee-tea",
    "subcategory_name": "Coffee & Tea",
    "price": 6.5,
    "status": "active",
    "stock": 85,
    "rating": 4.7,
    "reviews_count": 54,
    "image": "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
    "weight": "150g Biodegradable Box",
    "expiry_date": "2027-11-30",
    "description": "Refreshing immune-supporting herbal infusion crafted with whole sun-dried lemongrass stalks."
  },
  {
    "product_id": "P0881",
    "name": "Roasted Cashew Nuts with Sea Salt 400g (Jumbo M23)",
    "category": "Food & Groceries",
    "category_slug": "food-groceries",
    "category_aliases": [
      "Groceries",
      "Food",
      "Food & Groceries",
      "food-groceries"
    ],
    "subcategory": "snacks-dried-fruit",
    "subcategory_name": "Snacks & Dried Fruit",
    "price": 8.5,
    "status": "active",
    "stock": 130,
    "rating": 4.9,
    "reviews_count": 165,
    "image": "https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?auto=format&fit=crop&w=800&q=80",
    "weight": "400g Foil Seal Tub",
    "expiry_date": "2027-07-15",
    "description": "Premium jumbo M23 cashew nuts grown in Kampong Cham, slow-roasted with skin on for deep crunch."
  },
  {
    "product_id": "P0882",
    "name": "Fresh Battambang Green Sweet Oranges 3kg",
    "category": "Food & Groceries",
    "category_slug": "food-groceries",
    "category_aliases": [
      "Groceries",
      "Food",
      "Food & Groceries",
      "food-groceries"
    ],
    "subcategory": "fresh-produce",
    "subcategory_name": "Fresh Produce",
    "price": 4.5,
    "status": "active",
    "stock": 150,
    "rating": 4.8,
    "reviews_count": 78,
    "image": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80",
    "weight": "3.0 kg Mesh Bag",
    "expiry_date": "2026-10-20",
    "description": "Juicy, thin-skinned sweet green oranges picked ripe from riverside orchards along the Sangkae River in Battambang."
  },
  {
    "product_id": "P0883",
    "name": "Kampot Diamond Golden Mangoes 2kg",
    "category": "Food & Groceries",
    "category_slug": "food-groceries",
    "category_aliases": [
      "Groceries",
      "Food",
      "Food & Groceries",
      "food-groceries"
    ],
    "subcategory": "fresh-produce",
    "subcategory_name": "Fresh Produce",
    "price": 5.2,
    "status": "active",
    "stock": 80,
    "rating": 4.9,
    "reviews_count": 92,
    "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
    "weight": "2.0 kg Gift Box",
    "expiry_date": "2026-10-18",
    "description": "Sweet fragrance Keo Romeat variety mangoes, hand-selected for export grade sweetness and firm texture."
  },
  {
    "product_id": "P0884",
    "name": "Kandal Hydroponic Bok Choy & Asian Greens 500g",
    "category": "Food & Groceries",
    "category_slug": "food-groceries",
    "category_aliases": [
      "Groceries",
      "Food",
      "Food & Groceries",
      "food-groceries"
    ],
    "subcategory": "fresh-produce",
    "subcategory_name": "Fresh Produce",
    "price": 2.1,
    "status": "active",
    "stock": 90,
    "rating": 4.7,
    "reviews_count": 45,
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    "weight": "500g Crisp Pack",
    "expiry_date": "2026-10-14",
    "description": "Clean hydroponic pesticide-free baby bok choy and morning glory harvest delivered fresh from Kandal farm."
  },
  {
    "product_id": "P0888",
    "name": "Artisanal Koh Kong Barrel-Aged Fish Sauce 500ml",
    "category": "Food & Groceries",
    "category_slug": "food-groceries",
    "category_aliases": [
      "Groceries",
      "Food",
      "Food & Groceries",
      "food-groceries"
    ],
    "subcategory": "cooking-oil-sauces",
    "subcategory_name": "Cooking Oil & Sauces",
    "price": 3.2,
    "status": "active",
    "stock": 110,
    "rating": 4.9,
    "reviews_count": 73,
    "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    "weight": "500ml Glass Bottle",
    "expiry_date": "2028-12-31",
    "description": "First press anchovy extract naturally fermented in wooden barrels for 12 months in coastal Koh Kong."
  },
  {
    "product_id": "P3314",
    "name": "Premium Linen Casual Shirt (Summer Edition)",
    "category": "Fashion & Accessories",
    "category_slug": "fashion",
    "category_aliases": [
      "Clothing",
      "Fashion",
      "Fashion & Accessories",
      "fashion"
    ],
    "subcategory": "mens-clothing",
    "subcategory_name": "Men's Clothing",
    "price": 18.5,
    "status": "active",
    "stock": 120,
    "rating": 4.6,
    "reviews_count": 67,
    "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    "size": "L",
    "colours": [
      "Navy Blue",
      "Sand Beige",
      "Olive"
    ],
    "description": "Breathable 100% natural organic linen tailored for tropical climates with reinforced horn-button closure."
  },
  {
    "product_id": "P3315",
    "name": "Handwoven Silk Scarf (Takeo Krama Luxe)",
    "category": "Fashion & Accessories",
    "category_slug": "fashion",
    "category_aliases": [
      "Clothing",
      "Fashion",
      "Fashion & Accessories",
      "fashion"
    ],
    "subcategory": "traditional-wear",
    "subcategory_name": "Traditional Wear",
    "price": 32,
    "status": "active",
    "stock": 60,
    "rating": 4.9,
    "reviews_count": 94,
    "image": "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
    "size": "Free Size (180x60cm)",
    "colours": [
      "Crimson Red",
      "Royal Indigo",
      "Emerald Gold"
    ],
    "description": "Artisanal handwoven silk from Takeo weavers, featuring authentic heritage patterns with a modern drape."
  },
  {
    "product_id": "P3316",
    "name": "Everyday Stretch Chino Pants",
    "category": "Fashion & Accessories",
    "category_slug": "fashion",
    "category_aliases": [
      "Clothing",
      "Fashion",
      "Fashion & Accessories",
      "fashion"
    ],
    "subcategory": "mens-clothing",
    "subcategory_name": "Men's Clothing",
    "price": 24,
    "status": "active",
    "stock": 75,
    "rating": 4.5,
    "reviews_count": 42,
    "image": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
    "size": "32W x 30L",
    "colours": [
      "Khaki",
      "Charcoal",
      "Dark Navy"
    ],
    "description": "Comfortable four-way stretch cotton twill designed for versatile office and casual city commuting."
  },
  {
    "product_id": "P3317",
    "name": "Organic Cotton Short-Sleeve Resort Shirt",
    "category": "Fashion & Accessories",
    "category_slug": "fashion",
    "category_aliases": [
      "Clothing",
      "Fashion",
      "Fashion & Accessories",
      "fashion"
    ],
    "subcategory": "mens-clothing",
    "subcategory_name": "Men's Clothing",
    "price": 21,
    "status": "active",
    "stock": 90,
    "rating": 4.7,
    "reviews_count": 58,
    "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    "size": "M",
    "colours": [
      "Palm Leaf Green",
      "Ivory White"
    ],
    "description": "Relaxed Cuban collar cut in pure combed cotton, pre-washed for zero shrinkage and ultra-soft feel."
  },
  {
    "product_id": "P3318",
    "name": "Waterproof Commuter Backpack 22L (Laptop Ready)",
    "category": "Fashion & Accessories",
    "category_slug": "fashion",
    "category_aliases": [
      "Clothing",
      "Fashion",
      "Fashion & Accessories",
      "fashion"
    ],
    "subcategory": "bags-luggage",
    "subcategory_name": "Bags & Luggage",
    "price": 45,
    "status": "active",
    "stock": 55,
    "rating": 4.8,
    "reviews_count": 83,
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "size": "22 Litres (16\" Laptop Compartment)",
    "colours": [
      "Matte Black",
      "Graphite Grey"
    ],
    "description": "Weatherproof coated canvas with magnetic quick-release clasps and padded ergonomic shoulder straps."
  },
  {
    "product_id": "P3319",
    "name": "Handcrafted Heritage Leather Loafers",
    "category": "Fashion & Accessories",
    "category_slug": "fashion",
    "category_aliases": [
      "Clothing",
      "Fashion",
      "Fashion & Accessories",
      "fashion"
    ],
    "subcategory": "shoes",
    "subcategory_name": "Shoes",
    "price": 58,
    "status": "active",
    "stock": 35,
    "rating": 4.9,
    "reviews_count": 46,
    "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    "size": "EU 42 (US 9)",
    "colours": [
      "Cognac Brown",
      "Ebony Black"
    ],
    "description": "Full-grain vegetable-tanned leather handcrafted by local cordwainers with cushioned cork insole."
  },
  {
    "product_id": "P3320",
    "name": "Breathable Bamboo Fiber Lounge Set",
    "category": "Fashion & Accessories",
    "category_slug": "fashion",
    "category_aliases": [
      "Clothing",
      "Fashion",
      "Fashion & Accessories",
      "fashion"
    ],
    "subcategory": "womens-clothing",
    "subcategory_name": "Women's Clothing",
    "price": 28,
    "status": "active",
    "stock": 65,
    "rating": 4.6,
    "reviews_count": 39,
    "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    "size": "L",
    "colours": [
      "Sage Mist",
      "Warm Oat"
    ],
    "description": "Thermo-regulating natural bamboo viscose two-piece lounge set engineered for hot and humid climates."
  },
  {
    "product_id": "P3323",
    "name": "Traditional Hand-Loomed Cotton Krama Scarf",
    "category": "Fashion & Accessories",
    "category_slug": "fashion",
    "category_aliases": [
      "Clothing",
      "Fashion",
      "Fashion & Accessories",
      "fashion"
    ],
    "subcategory": "traditional-wear",
    "subcategory_name": "Traditional Wear",
    "price": 6.5,
    "status": "active",
    "stock": 200,
    "rating": 4.8,
    "reviews_count": 140,
    "image": "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80",
    "size": "170cm x 65cm",
    "colours": [
      "Red Check",
      "Navy Check",
      "Purple Check"
    ],
    "description": "Versatile authentic woven Cambodian gingham krama, soft pure cotton suitable as scarf, wrap or headwear."
  },
  {
    "product_id": "P2210",
    "name": "Ultra Smartphone Pro Max 5G (12GB/256GB)",
    "category": "Electronics",
    "category_slug": "electronics",
    "category_aliases": [
      "Electronics",
      "electronics"
    ],
    "subcategory": "phones-tablets",
    "subcategory_name": "Phones & Tablets",
    "price": 289,
    "status": "active",
    "stock": 45,
    "rating": 4.8,
    "reviews_count": 124,
    "image": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
    "screen_size": "6.7 inch OLED 120Hz",
    "warranty": "1 Year Official Distributor",
    "description": "Flagship AMOLED display with high-efficiency 5G modem, AI computational photography, and 65W fast charge.",
    "frequently_bought_with": [
      "P2211",
      "P2215"
    ],
    "reviews": [
      {
        "id": "rev-1",
        "author": "Sokha Meas",
        "rating": 5,
        "date": "2026-09-20",
        "comment": "Excellent AMOLED display, buttery smooth 120Hz and super fast courier delivery in Phnom Penh.",
        "verified": true
      },
      {
        "id": "rev-2",
        "author": "Piseth Seng",
        "rating": 5,
        "date": "2026-09-24",
        "comment": "Battery easily lasts 1.5 days under heavy usage. Bakong KHQR checkout was instantaneous.",
        "verified": true
      }
    ]
  },
  {
    "product_id": "P2211",
    "name": "Noise-Cancelling Wireless Earbuds Pro",
    "category": "Electronics",
    "category_slug": "electronics",
    "category_aliases": [
      "Electronics",
      "electronics"
    ],
    "subcategory": "tv-audio",
    "subcategory_name": "TV & Audio",
    "price": 65,
    "status": "active",
    "stock": 80,
    "rating": 4.7,
    "reviews_count": 89,
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    "screen_size": "Touch Sensor Interface",
    "warranty": "6 Months Replacement",
    "description": "Active noise cancellation up to 42dB with transparency mode and water-resistant nano-coating.",
    "frequently_bought_with": [
      "P2210",
      "P2215"
    ],
    "reviews": [
      {
        "id": "rev-4",
        "author": "Chenda Som",
        "rating": 5,
        "date": "2026-09-18",
        "comment": "Active noise cancellation works very well during coffee shop remote work in Siem Reap.",
        "verified": true
      }
    ]
  },
  {
    "product_id": "P2212",
    "name": "Curved 4K Ultra-Wide Monitor 34\"",
    "category": "Electronics",
    "category_slug": "electronics",
    "category_aliases": [
      "Electronics",
      "electronics"
    ],
    "subcategory": "computers",
    "subcategory_name": "Computers",
    "price": 420,
    "status": "active",
    "stock": 18,
    "rating": 4.9,
    "reviews_count": 53,
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    "screen_size": "34 inch 1500R Curved 4K",
    "warranty": "2 Years Manufacturer",
    "description": "Immersive panoramic display with 99% sRGB color accuracy, USB-C 90W power delivery, and built-in KVM switch."
  },
  {
    "product_id": "P2213",
    "name": "Fitness Smartwatch GPS Pro Sapphire",
    "category": "Electronics",
    "category_slug": "electronics",
    "category_aliases": [
      "Electronics",
      "electronics"
    ],
    "subcategory": "wearable-technology",
    "subcategory_name": "Wearable Technology",
    "price": 85,
    "status": "active",
    "stock": 65,
    "rating": 4.6,
    "reviews_count": 72,
    "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    "screen_size": "1.43 inch AMOLED Sapphire",
    "warranty": "1 Year Official Distributor",
    "description": "Multi-band GPS tracking, continuous SpO2 heart-rate telemetry, and 14-day battery life."
  },
  {
    "product_id": "P2214",
    "name": "Mechanical Gaming Keyboard RGB (Hot-Swap)",
    "category": "Electronics",
    "category_slug": "electronics",
    "category_aliases": [
      "Electronics",
      "electronics"
    ],
    "subcategory": "computers",
    "subcategory_name": "Computers",
    "price": 54,
    "status": "active",
    "stock": 50,
    "rating": 4.8,
    "reviews_count": 64,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    "screen_size": "75% Compact Layout",
    "warranty": "1 Year Warranty",
    "description": "Factory-lubed linear switches with sound-dampening silicone gasket and RGB backlighting."
  },
  {
    "product_id": "P2215",
    "name": "Ultra Fast-Charging Power Bank 20,000mAh 65W",
    "category": "Electronics",
    "category_slug": "electronics",
    "category_aliases": [
      "Electronics",
      "electronics"
    ],
    "subcategory": "electronic-accessories",
    "subcategory_name": "Electronic Accessories",
    "price": 36,
    "status": "active",
    "stock": 110,
    "rating": 4.9,
    "reviews_count": 145,
    "image": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80",
    "screen_size": "Smart Digital Power Display",
    "warranty": "6 Months Replacement",
    "description": "65W USB-C Power Delivery charges laptops and smartphones simultaneously with airline-approved capacity."
  },
  {
    "product_id": "P2217",
    "name": "Compact 4K Foldable Drone with 3-Axis Gimbal",
    "category": "Electronics",
    "category_slug": "electronics",
    "category_aliases": [
      "Electronics",
      "electronics"
    ],
    "subcategory": "cameras-drones",
    "subcategory_name": "Cameras & Drones",
    "price": 349,
    "status": "active",
    "stock": 14,
    "rating": 4.8,
    "reviews_count": 29,
    "image": "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
    "screen_size": "4K 60fps 3-Axis Gimbal",
    "warranty": "1 Year Manufacturer",
    "description": "Under 249g ultra-lightweight drone with obstacle avoidance and 31-minute flight time."
  },
  {
    "product_id": "P4001",
    "name": "Kampong Chhnang Handcrafted Terracotta Teapot Set",
    "category": "Home & Living",
    "category_slug": "home-living",
    "category_aliases": [
      "Home & Living",
      "Home",
      "Home & Kitchen",
      "home-living"
    ],
    "subcategory": "pottery-ceramics",
    "subcategory_name": "Pottery & Ceramics",
    "price": 19.5,
    "status": "active",
    "stock": 40,
    "rating": 4.8,
    "reviews_count": 32,
    "image": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    "description": "Naturally fired red earthenware teapot with 4 companion cups crafted using century-old Kampong Chhnang heritage methods."
  },
  {
    "product_id": "P4002",
    "name": "Glazed Ceramic Rice Bowl Set of 4 (Angkor Lotus)",
    "category": "Home & Living",
    "category_slug": "home-living",
    "category_aliases": [
      "Home & Living",
      "Home",
      "Home & Kitchen",
      "home-living"
    ],
    "subcategory": "pottery-ceramics",
    "subcategory_name": "Pottery & Ceramics",
    "price": 16,
    "status": "active",
    "stock": 65,
    "rating": 4.7,
    "reviews_count": 48,
    "image": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
    "description": "Hand-thrown stoneware bowls with crackled celadon glaze and relief carved lotus rim, microwave and dishwasher safe."
  },
  {
    "product_id": "P4003",
    "name": "Natural Water Hyacinth Woven Storage Baskets (Set of 3)",
    "category": "Home & Living",
    "category_slug": "home-living",
    "category_aliases": [
      "Home & Living",
      "Home",
      "Home & Kitchen",
      "home-living"
    ],
    "subcategory": "bamboo-rattan",
    "subcategory_name": "Bamboo & Rattan",
    "price": 24.5,
    "status": "active",
    "stock": 50,
    "rating": 4.9,
    "reviews_count": 61,
    "image": "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80",
    "description": "Eco-friendly nested organizer baskets woven from Tonle Sap lake water hyacinth fibers with sturdy wire frame."
  },
  {
    "product_id": "P4004",
    "name": "Artisanal Coconut Wood Cooking Utensil 5-Piece Set",
    "category": "Home & Living",
    "category_slug": "home-living",
    "category_aliases": [
      "Home & Living",
      "Home",
      "Home & Kitchen",
      "home-living"
    ],
    "subcategory": "kitchen-dining",
    "subcategory_name": "Kitchen & Dining",
    "price": 12,
    "status": "active",
    "stock": 95,
    "rating": 4.8,
    "reviews_count": 53,
    "image": "https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=800&q=80",
    "description": "Handcrafted from aged reclaimed coconut palm wood with smooth natural oil polish; safe for non-stick cookware."
  },
  {
    "product_id": "P5001",
    "name": "Cardamom Mountain Cold-Pressed Moringa Face Oil 30ml",
    "category": "Beauty & Wellness",
    "category_slug": "beauty-wellness",
    "category_aliases": [
      "Beauty & Wellness",
      "Beauty",
      "Health & Beauty",
      "beauty-wellness"
    ],
    "subcategory": "skincare",
    "subcategory_name": "Skincare",
    "price": 16.5,
    "status": "active",
    "stock": 75,
    "rating": 4.9,
    "reviews_count": 88,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
    "description": "Nutrient-dense antioxidant botanical face serum with cold-pressed moringa seed oil and vitamin E."
  },
  {
    "product_id": "P5002",
    "name": "Pure Virgin Cold-Pressed Coconut Oil 250ml",
    "category": "Beauty & Wellness",
    "category_slug": "beauty-wellness",
    "category_aliases": [
      "Beauty & Wellness",
      "Beauty",
      "Health & Beauty",
      "beauty-wellness"
    ],
    "subcategory": "skincare",
    "subcategory_name": "Skincare",
    "price": 5.5,
    "status": "active",
    "stock": 120,
    "rating": 4.8,
    "reviews_count": 142,
    "image": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
    "description": "Unrefined extra-virgin coconut oil produced within hours of harvest for deep hair and skin nourishment."
  },
  {
    "product_id": "P5003",
    "name": "Natural Turmeric & Wild Honey Herbal Soap Bar (Set of 3)",
    "category": "Beauty & Wellness",
    "category_slug": "beauty-wellness",
    "category_aliases": [
      "Beauty & Wellness",
      "Beauty",
      "Health & Beauty",
      "beauty-wellness"
    ],
    "subcategory": "bath-body",
    "subcategory_name": "Bath & Body",
    "price": 7.2,
    "status": "active",
    "stock": 110,
    "rating": 4.7,
    "reviews_count": 65,
    "image": "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80",
    "description": "Cold-process handmade body bars infused with healing turmeric powder, raw forest honey and soothing rice bran oil."
  },
  {
    "product_id": "P6001",
    "name": "Silver-Plated Copper Betel Box (Angkor Animal Motif)",
    "category": "Arts & Culture",
    "category_slug": "arts-culture",
    "category_aliases": [
      "Arts & Culture",
      "Arts",
      "Arts & Crafts",
      "arts-culture"
    ],
    "subcategory": "handmade-crafts",
    "subcategory_name": "Handmade Crafts",
    "price": 42,
    "status": "active",
    "stock": 25,
    "rating": 5,
    "reviews_count": 36,
    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    "description": "Exquisite hand-hammered repoussé silver-plated keepsake box fashioned in traditional elephant and mythical motifs."
  },
  {
    "product_id": "P6002",
    "name": "Hand-Carved Bas-Relief Stone Apsara Sculpture",
    "category": "Arts & Culture",
    "category_slug": "arts-culture",
    "category_aliases": [
      "Arts & Culture",
      "Arts",
      "Arts & Crafts",
      "arts-culture"
    ],
    "subcategory": "handmade-crafts",
    "subcategory_name": "Handmade Crafts",
    "price": 35,
    "status": "active",
    "stock": 20,
    "rating": 4.9,
    "reviews_count": 27,
    "image": "https://images.unsplash.com/photo-1599837565318-67429bde7162?auto=format&fit=crop&w=800&q=80",
    "description": "Authentic sandstone wall sculpture depicting celestial Apsara dancers carved by Siem Reap artisan apprentices."
  },
  {
    "product_id": "P6003",
    "name": "Traditional Khmer Copper Lacquerware Serving Platter",
    "category": "Arts & Culture",
    "category_slug": "arts-culture",
    "category_aliases": [
      "Arts & Culture",
      "Arts",
      "Arts & Crafts",
      "arts-culture"
    ],
    "subcategory": "souvenirs-gifts",
    "subcategory_name": "Souvenirs & Gifts",
    "price": 28,
    "status": "active",
    "stock": 30,
    "rating": 4.8,
    "reviews_count": 19,
    "image": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
    "description": "Multi-layered natural tree resin lacquerware tray with gold-leaf inlay highlights, ideal for ceremonies or dining."
  },
  {
    "product_id": "P4005",
    "name": "Handwoven Takeo Silk Cushion Covers (Pair, Angkor Motif)",
    "category": "Home & Living",
    "category_slug": "home-living",
    "category_aliases": [
      "Home & Living",
      "Home",
      "Home & Kitchen",
      "home-living"
    ],
    "subcategory": "home-decor",
    "subcategory_name": "Home Décor & Accents",
    "price": 22,
    "status": "active",
    "stock": 45,
    "rating": 4.9,
    "reviews_count": 38,
    "image": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    "description": "Pair of 45x45cm luxury raw silk throw pillow covers woven with traditional Cambodian lotus patterns and hidden zipper."
  },
  {
    "product_id": "P4006",
    "name": "Tonle Sap Woven Bamboo Winnowing Wall Art (Chhngier 40cm)",
    "category": "Home & Living",
    "category_slug": "home-living",
    "category_aliases": [
      "Home & Living",
      "Home",
      "Home & Kitchen",
      "home-living"
    ],
    "subcategory": "home-decor",
    "subcategory_name": "Home Décor & Accents",
    "price": 16.5,
    "status": "active",
    "stock": 35,
    "rating": 4.8,
    "reviews_count": 24,
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "description": "Authentic Cambodian rustic rice winnowing basket (Chhngier) hand-smoked over coconut husks for deep honey hue."
  },
  {
    "product_id": "P4007",
    "name": "Hand-Poured Lemongrass & Jasmine Soy Candle in Ceramic Vessel",
    "category": "Home & Living",
    "category_slug": "home-living",
    "category_aliases": [
      "Home & Living",
      "Home",
      "Home & Kitchen",
      "home-living"
    ],
    "subcategory": "home-decor",
    "subcategory_name": "Home Décor & Accents",
    "price": 9.5,
    "status": "active",
    "stock": 60,
    "rating": 4.9,
    "reviews_count": 51,
    "image": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    "description": "Clean-burning pure soy wax infused with Kampot lemongrass and wild jasmine blossoms in reusable terracotta pot."
  },
  {
    "product_id": "P4008",
    "name": "Kampong Chhnang Handcrafted Terracotta Relief Planter Pot",
    "category": "Home & Living",
    "category_slug": "home-living",
    "category_aliases": [
      "Home & Living",
      "Home",
      "Home & Kitchen",
      "home-living"
    ],
    "subcategory": "pottery-ceramics",
    "subcategory_name": "Pottery & Ceramics",
    "price": 14,
    "status": "active",
    "stock": 40,
    "rating": 4.7,
    "reviews_count": 19,
    "image": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    "description": "Porous natural red clay indoor/outdoor planter with drainage hole, hand-etched with Khmer temple geometric borders."
  },
  {
    "product_id": "P4009",
    "name": "Artisan Bamboo Lantern Lampshade with Handwoven Rattan Trim",
    "category": "Home & Living",
    "category_slug": "home-living",
    "category_aliases": [
      "Home & Living",
      "Home",
      "Home & Kitchen",
      "home-living"
    ],
    "subcategory": "bamboo-rattan",
    "subcategory_name": "Bamboo & Rattan Crafts",
    "price": 21,
    "status": "active",
    "stock": 25,
    "rating": 4.8,
    "reviews_count": 15,
    "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    "description": "Organic pendant lampshade casting warm ambient lattice shadows, crafted by Siem Reap village basket-makers."
  },
  {
    "product_id": "P4010",
    "name": "Hand-Carved Palm Wood Mortar & Pestle (Khmer Chhrok)",
    "category": "Home & Living",
    "category_slug": "home-living",
    "category_aliases": [
      "Home & Living",
      "Home",
      "Home & Kitchen",
      "home-living"
    ],
    "subcategory": "kitchen-dining",
    "subcategory_name": "Kitchen & Dining",
    "price": 13.5,
    "status": "active",
    "stock": 55,
    "rating": 4.9,
    "reviews_count": 42,
    "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    "description": "Solid aged sugar palm wood mortar and pestle, perfectly balanced for crushing Kampot pepper, garlic, and fresh kroeung."
  },
  {
    "product_id": "P5004",
    "name": "Traditional Khmer Herbal Inhaler & Refreshing Balm Duo",
    "category": "Beauty & Wellness",
    "category_slug": "beauty-wellness",
    "category_aliases": [
      "Beauty & Wellness",
      "Beauty",
      "beauty-wellness"
    ],
    "subcategory": "herbal-wellness",
    "subcategory_name": "Herbal Remedies & Balms",
    "price": 5.5,
    "status": "active",
    "stock": 120,
    "rating": 4.9,
    "reviews_count": 88,
    "image": "https://images.unsplash.com/photo-1547793549-70faf88838c8?auto=format&fit=crop&w=800&q=80",
    "description": "Aromatic blend of cardamoms, star anise, clove and peppermint oil in traditional engraved brass casing for instant clarity."
  },
  {
    "product_id": "P5005",
    "name": "Kampot Sea Salt Body Scrub with Kaffir Lime & Lemongrass 250g",
    "category": "Beauty & Wellness",
    "category_slug": "beauty-wellness",
    "category_aliases": [
      "Beauty & Wellness",
      "Beauty",
      "beauty-wellness"
    ],
    "subcategory": "herbal-wellness",
    "subcategory_name": "Herbal Remedies & Balms",
    "price": 11.5,
    "status": "active",
    "stock": 65,
    "rating": 4.8,
    "reviews_count": 36,
    "image": "https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=800&q=80",
    "description": "Exfoliating solar fleur de sel infused with organic cold-pressed coconut oil and zesty Kaffir lime leaf essential oil."
  },
  {
    "product_id": "P3324",
    "name": "Hand-Block Printed Cambodian Cotton Midi Dress",
    "category": "Fashion & Accessories",
    "category_slug": "fashion",
    "category_aliases": [
      "Clothing",
      "Fashion",
      "Fashion & Accessories",
      "fashion"
    ],
    "subcategory": "womens-clothing",
    "subcategory_name": "Women's Clothing",
    "price": 34,
    "status": "active",
    "stock": 40,
    "rating": 4.8,
    "reviews_count": 29,
    "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    "size": "Free Size (Adjustable Wrap)",
    "colours": [
      "Indigo Blue",
      "Terracotta Red"
    ],
    "description": "Lightweight breathable pure cotton dress hand-printed using botanical vegetable dyes and traditional woodblocks."
  },
  {
    "product_id": "P3325",
    "name": "Handcrafted Khmer Hol Silk Sarong Wrap (Heritage Weave)",
    "category": "Fashion & Accessories",
    "category_slug": "fashion",
    "category_aliases": [
      "Clothing",
      "Fashion",
      "Fashion & Accessories",
      "fashion"
    ],
    "subcategory": "traditional-wear",
    "subcategory_name": "Traditional Wear (Krama & Silk)",
    "price": 48,
    "status": "active",
    "stock": 25,
    "rating": 5,
    "reviews_count": 41,
    "image": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    "size": "200cm x 100cm",
    "colours": [
      "Royal Gold & Crimson",
      "Deep Emerald"
    ],
    "description": "Masterpiece Cambodian ikat (Chong Kiet) silk sarong hand-loomed over 3 weeks by elder craftswomen in Takeo."
  },
  {
    "product_id": "P6004",
    "name": "Handwoven Takeo Golden Silk Heritage Wall Tapestry",
    "category": "Arts & Culture",
    "category_slug": "arts-culture",
    "category_aliases": [
      "Arts & Culture",
      "Arts",
      "Arts & Crafts",
      "arts-culture"
    ],
    "subcategory": "handmade-crafts",
    "subcategory_name": "Handmade Crafts & Carvings",
    "price": 65,
    "status": "active",
    "stock": 12,
    "rating": 5,
    "reviews_count": 18,
    "image": "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
    "description": "Framed raw golden silk tapestry depicting scenes from the Reamker epic, woven with indigenous yellow silkworm threads."
  },
  {
    "product_id": "P6005",
    "name": "Hand-Painted Angkor Wat Watercolor Art Print (Signed Limited)",
    "category": "Arts & Culture",
    "category_slug": "arts-culture",
    "category_aliases": [
      "Arts & Culture",
      "Arts",
      "Arts & Crafts",
      "arts-culture"
    ],
    "subcategory": "souvenirs-gifts",
    "subcategory_name": "Heritage Souvenirs & Gifts",
    "price": 18,
    "status": "active",
    "stock": 50,
    "rating": 4.9,
    "reviews_count": 32,
    "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    "description": "Original sunrise reflection over Angkor Wat lotus pond painted by Siem Reap visual artists on archival handmade paper."
  },
  {
    "product_id": "P2216",
    "name": "Dual-Band Wi-Fi 6 Gigabit Mesh Router",
    "category": "Electronics",
    "category_slug": "electronics",
    "category_aliases": [
      "Electronics",
      "electronics"
    ],
    "subcategory": "electronic-accessories",
    "subcategory_name": "Power & Accessories",
    "price": 79,
    "status": "active",
    "stock": 40,
    "rating": 4.7,
    "reviews_count": 38,
    "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    "screen_size": "Dual-Band AX3000",
    "warranty": "2 Years Replacement",
    "description": "Covers up to 3,000 sq ft with low-latency beamforming antennas."
  },
  {
    "product_id": "P3321",
    "name": "UV-Protection Lightweight Sun Hoodie UPF 50+",
    "category": "Fashion & Accessories",
    "category_slug": "fashion",
    "category_aliases": [
      "Clothing",
      "Fashion",
      "Fashion & Accessories",
      "fashion"
    ],
    "subcategory": "mens-clothing",
    "subcategory_name": "Men's Clothing",
    "price": 19.5,
    "status": "active",
    "stock": 100,
    "rating": 4.7,
    "reviews_count": 61,
    "image": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    "size": "XL",
    "colours": [
      "Glacier Blue",
      "Stone Grey"
    ],
    "description": "UPF 50+ sun protection hooded jacket with thumbholes, breathable mesh underarms, and fast-drying fabric."
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    order_id: "ORD-100001",
    customer_id: "C0457",
    customer_name: "Sokha Meas",
    items: [
      { product_id: "P2210", name: "Ultra Smartphone Pro Max", quantity: 1, price: 289.0, category: "Electronics" },
    ],
    total: 289.0,
    province: "Phnom Penh",
    payment_method: "NBC Bakong KHQR",
    status: "Delivered",
    delivery_address: "Street 271, Sangkat Boeung Tumpun, Phnom Penh",
    assigned_courier_id: "R-101",
    assigned_courier_name: "Chan Vuthy",
    courier_phone: "+855 12 999 888",
    created_at: "2026-09-03T10:15:00Z",
  },
  {
    order_id: "ORD-100002",
    customer_id: "C1893",
    customer_name: "Chenda Som",
    items: [
      { product_id: "P0874", name: "Battambang Jasmine Fragrant Rice 5kg", quantity: 4, price: 4.8, category: "Groceries" },
    ],
    total: 19.2,
    province: "Siem Reap",
    payment_method: "Cash (COD)",
    status: "Delivered",
    delivery_address: "Sivatha Road, Svay Dangkum, Siem Reap",
    assigned_courier_id: "R-201",
    assigned_courier_name: "Thy Dara",
    courier_phone: "+855 15 777 666",
    created_at: "2026-09-03T14:45:00Z",
  },
  {
    order_id: "ORD-100003",
    customer_id: "C0457",
    customer_name: "Sokha Meas",
    items: [
      { product_id: "P3314", name: "Premium Linen Casual Shirt", quantity: 2, price: 18.5, category: "Clothing" },
      { product_id: "P0875", name: "Kampot Organic Black Pepper 250g", quantity: 1, price: 7.5, category: "Groceries" },
    ],
    total: 44.5,
    province: "Phnom Penh",
    payment_method: "NBC Bakong KHQR",
    status: "Out for Delivery",
    delivery_address: "Street 271, Sangkat Boeung Tumpun, Phnom Penh",
    assigned_courier_id: "R-102",
    assigned_courier_name: "Sok Rith",
    courier_phone: "+855 12 888 777",
    created_at: "2026-10-05T08:30:00Z",
  },
  {
    order_id: "ORD-100004",
    customer_id: "C2241",
    customer_name: "Piseth Seng",
    items: [
      { product_id: "P2211", name: "Noise-Cancelling Wireless Earbuds", quantity: 1, price: 65.0, category: "Electronics" },
    ],
    total: 65.0,
    province: "Siem Reap",
    payment_method: "NBC Bakong KHQR",
    status: "Preparing",
    delivery_address: "Wat Bo Village, Salakamreuk, Siem Reap",
    created_at: "2026-10-05T19:20:00Z",
  },
  {
    order_id: "ORD-100005",
    customer_id: "C1001",
    customer_name: "Vireak Chan",
    items: [
      { product_id: "P2212", name: "Curved 4K Ultra-Wide Monitor 34\"", quantity: 1, price: 420.0, category: "Electronics" },
      { product_id: "P2214", name: "Mechanical Keyboard RGB (Hot-Swap)", quantity: 1, price: 54.0, category: "Electronics" },
    ],
    total: 474.0,
    province: "Phnom Penh",
    payment_method: "ABA Pay (KHQR)",
    status: "Delivered",
    delivery_address: "Norodom Boulevard, Sangkat Tonle Bassac, Phnom Penh",
    assigned_courier_id: "R-101",
    assigned_courier_name: "Chan Vuthy",
    courier_phone: "+855 12 999 888",
    created_at: "2026-09-18T11:00:00Z",
  },
  {
    order_id: "ORD-100006",
    customer_id: "C1002",
    customer_name: "Sophea Kim",
    items: [
      { product_id: "P3315", name: "Handwoven Silk Scarf (Krama Luxe)", quantity: 2, price: 32.0, category: "Clothing" },
      { product_id: "P0877", name: "Wild Raw Forest Honey from Koh Kong 500ml", quantity: 1, price: 14.0, category: "Groceries" },
    ],
    total: 78.0,
    province: "Siem Reap",
    payment_method: "NBC Bakong KHQR",
    status: "Delivered",
    delivery_address: "Charles de Gaulle Blvd, Siem Reap Central",
    assigned_courier_id: "R-202",
    assigned_courier_name: "Chea Bora",
    courier_phone: "+855 15 555 444",
    created_at: "2026-09-21T15:20:00Z",
  },
  {
    order_id: "ORD-100007",
    customer_id: "C1003",
    customer_name: "Rithy Pen",
    items: [
      { product_id: "P3318", name: "Waterproof Commuter Backpack 22L", quantity: 1, price: 45.0, category: "Clothing" },
      { product_id: "P2215", name: "Ultra Fast-Charging Power Bank 20,000mAh", quantity: 1, price: 36.0, category: "Electronics" },
    ],
    total: 81.0,
    province: "Battambang",
    payment_method: "Wing Bank (KHQR)",
    status: "Out for Delivery",
    delivery_address: "Street 3, Sangkat Svay Pao, Battambang",
    assigned_courier_id: "R-301",
    assigned_courier_name: "Heng Samnang",
    courier_phone: "+855 17 444 333",
    created_at: "2026-10-06T06:15:00Z",
  },
  {
    order_id: "ORD-100008",
    customer_id: "C1004",
    customer_name: "Bopha Nou",
    items: [
      { product_id: "P2217", name: "Compact 4K Foldable Drone with Gimbal", quantity: 1, price: 349.0, category: "Electronics" },
    ],
    total: 349.0,
    province: "Phnom Penh",
    payment_method: "NBC Bakong KHQR",
    status: "Preparing",
    delivery_address: "Russian Federation Blvd, Sangkat Teuk Thla, Phnom Penh",
    created_at: "2026-10-06T07:45:00Z",
  },
  {
    order_id: "ORD-100009",
    customer_id: "C1005",
    customer_name: "Kolab Heng",
    items: [
      { product_id: "P0875", name: "Kampot Organic Black Pepper 250g", quantity: 3, price: 7.5, category: "Groceries" },
      { product_id: "P0876", name: "Mondulkiri Dark Roast Arabica Beans 500g", quantity: 2, price: 9.2, category: "Groceries" },
      { product_id: "P0878", name: "Kampot Fleur de Sel (Flower of Salt) 300g", quantity: 2, price: 5.5, category: "Groceries" },
    ],
    total: 51.9,
    province: "Phnom Penh",
    payment_method: "NBC Bakong KHQR",
    status: "Pending",
    delivery_address: "Street 51 (Pasteur), Sangkat Boeng Keng Kang 1, Phnom Penh",
    created_at: "2026-10-06T08:10:00Z",
  },
  {
    order_id: "ORD-100010",
    customer_id: "C1007",
    customer_name: "Dara Kong",
    items: [
      { product_id: "P3316", name: "Everyday Stretch Chino Pants", quantity: 2, price: 24.0, category: "Clothing" },
      { product_id: "P3319", name: "Handcrafted Heritage Leather Loafers", quantity: 1, price: 58.0, category: "Clothing" },
    ],
    total: 106.0,
    province: "Siem Reap",
    payment_method: "ACLEDA Pay (KHQR)",
    status: "Delivered",
    delivery_address: "Pokambor Ave, Riverside, Siem Reap",
    assigned_courier_id: "R-201",
    assigned_courier_name: "Thy Dara",
    courier_phone: "+855 15 777 666",
    created_at: "2026-09-29T16:30:00Z",
  },
];

export const INITIAL_CUSTOMER: CustomerProfile = {
  _id: "C0457",
  name: "Sokha Meas",
  phone: "+855-12-345-678",
  email: "sokha.meas@ecommerce.kh",
  loyalty_points: 320,
  tier: "VIP Gold",
  referral_code: "SOKHA2026",
  addresses: [
    {
      id: "addr-1",
      label: "Home (Phnom Penh)",
      street: "Street 271, Sangkat Boeung Tumpun, Khan Meanchey",
      city: "Phnom Penh",
      isDefault: true,
    },
    {
      id: "addr-2",
      label: "Corporate Office",
      street: "Exchange Square, Level 14, Norodom Blvd, Sangkat Wat Phnom",
      city: "Phnom Penh",
      isDefault: false,
    },
    {
      id: "addr-3",
      label: "Siem Reap Residence",
      street: "Street 07, Wat Bo Village, Sangkat Salakamreuk",
      city: "Siem Reap",
      isDefault: false,
    },
    {
      id: "addr-4",
      label: "Battambang Villa",
      street: "Road 1, Near Old Stone Bridge, Sangkat Svay Pao",
      city: "Battambang",
      isDefault: false,
    },
  ],
};

export const INITIAL_RIDERS: RiderTelemetry[] = [
  { id: "R-101", name: "Chan Vuthy", city: "Phnom Penh", lat: "11.5564° N", lng: "104.9282° E", status: "Delivering", battery: 88, speed: "28 km/h", lastPing: "Just now" },
  { id: "R-102", name: "Sok Rith", city: "Phnom Penh", lat: "11.5721° N", lng: "104.9150° E", status: "Picked Up", battery: 74, speed: "34 km/h", lastPing: "12s ago" },
  { id: "R-103", name: "Meng Kiri", city: "Phnom Penh", lat: "11.5430° N", lng: "104.9390° E", status: "Idle", battery: 96, speed: "0 km/h", lastPing: "5s ago" },
  { id: "R-104", name: "Long Sovann", city: "Phnom Penh", lat: "11.5620° N", lng: "104.9080° E", status: "Delivering", battery: 67, speed: "24 km/h", lastPing: "8s ago" },
  { id: "R-201", name: "Thy Dara", city: "Siem Reap", lat: "13.3633° N", lng: "103.8564° E", status: "Delivering", battery: 62, speed: "22 km/h", lastPing: "Just now" },
  { id: "R-202", name: "Chea Bora", city: "Siem Reap", lat: "13.3510° N", lng: "103.8670° E", status: "Delivering", battery: 81, speed: "26 km/h", lastPing: "15s ago" },
  { id: "R-203", name: "Nop Chhay", city: "Siem Reap", lat: "13.3780° N", lng: "103.8420° E", status: "Idle", battery: 90, speed: "0 km/h", lastPing: "3s ago" },
  { id: "R-301", name: "Heng Samnang", city: "Battambang", lat: "13.0957° N", lng: "103.2022° E", status: "Delivering", battery: 54, speed: "30 km/h", lastPing: "10s ago" },
  { id: "R-302", name: "Keo Visal", city: "Battambang", lat: "13.1020° N", lng: "103.1940° E", status: "Idle", battery: 91, speed: "0 km/h", lastPing: "Just now" },
  { id: "R-303", name: "Prum Kosal", city: "Battambang", lat: "13.0880° N", lng: "103.2110° E", status: "Picked Up", battery: 78, speed: "25 km/h", lastPing: "20s ago" },
];

export const INITIAL_REFERRALS: ReferralNode[] = [
  { id: "C1001", name: "Vireak Chan", level: 1, city: "Phnom Penh", spend: 474.0, earned: 23.7, referredBy: "C0457", date: "2026-07-10" },
  { id: "C1002", name: "Sophea Kim", level: 1, city: "Siem Reap", spend: 650.0, earned: 32.5, referredBy: "C0457", date: "2026-07-15" },
  { id: "C1003", name: "Rithy Pen", level: 2, city: "Battambang", spend: 810.0, earned: 24.3, referredBy: "C1001", date: "2026-08-01" },
  { id: "C1005", name: "Kolab Heng", level: 2, city: "Phnom Penh", spend: 390.0, earned: 11.7, referredBy: "C1002", date: "2026-08-12" },
  { id: "C1004", name: "Bopha Nou", level: 3, city: "Phnom Penh", spend: 1120.0, earned: 11.2, referredBy: "C1003", date: "2026-08-20" },
  { id: "C1007", name: "Dara Kong", level: 3, city: "Siem Reap", spend: 780.0, earned: 7.8, referredBy: "C1005", date: "2026-09-02" },
  { id: "C1008", name: "Sarath Ouk", level: 1, city: "Phnom Penh", spend: 310.0, earned: 15.5, referredBy: "C0457", date: "2026-09-14" },
  { id: "C1009", name: "Maly Chey", level: 2, city: "Siem Reap", spend: 520.0, earned: 15.6, referredBy: "C1008", date: "2026-09-25" },
];

export const HIVE_QUERIES: Record<string, HiveQueryMeta> = {
  D1: {
    id: "D1",
    title: "Revenue by Province (September 2026 - 1,000,000 Orders)",
    hql: `SELECT province, \n       ROUND(SUM(quantity * unit_price), 2) AS total_revenue\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY province\nORDER BY total_revenue DESC;`,
    speedup: "Partition Pruning: 50.9ms on Columnar Warehouse vs 423.3ms on 74.4MB CSV (8.3x speedup). Skips non-September HDFS directories.",
    engine: "Apache Hive on Tez Engine (Vectorized)",
    results: [
      { col1: "Phnom Penh", col2: "$42,130,965.20", col3: "55.0% market share • 220,118 orders" },
      { col1: "Siem Reap", col2: "$19,191,375.01", col3: "25.1% market share • 100,042 orders" },
      { col1: "Battambang", col2: "$7,570,672.18", col3: "9.9% market share • 40,011 orders" },
      { col1: "Kandal", col2: "$3,058,095.15", col3: "4.0% market share • 16,039 orders" },
      { col1: "Sihanoukville", col2: "$2,341,096.15", col3: "3.1% market share • 12,015 orders" },
      { col1: "Kampot", col2: "$2,253,587.83", col3: "2.9% market share • 11,775 orders" },
    ],
  },
  D2: {
    id: "D2",
    title: "Top 5 Customers by Spend (Fact-Dimension Star Join)",
    hql: `SELECT c.customer_id, \n       c.name, \n       c.city, \n       ROUND(SUM(o.quantity * o.unit_price), 2) AS total_spend\nFROM orders_opt o\nJOIN customers c ON o.customer_id = c.customer_id\nWHERE o.order_month = '2026-09'\nGROUP BY c.customer_id, c.name, c.city\nORDER BY total_spend DESC\nLIMIT 5;`,
    speedup: "Bucket Map-Side Join: 8 hash buckets eliminate shuffle overhead across worker datanodes (executed in 363.9ms across 1M records).",
    engine: "Apache Hive on Tez Engine",
    results: [
      { col1: "Bopha Pich (C10524)", col2: "$14,479.74", col3: "Battambang • VIP Platinum" },
      { col1: "Neary Long (C47708)", col2: "$13,982.51", col3: "Phnom Penh • VIP Platinum" },
      { col1: "Bopha Pich (C28429)", col2: "$13,311.93", col3: "Phnom Penh • VIP Gold" },
      { col1: "Sophea Mao (C13118)", col2: "$13,257.03", col3: "Phnom Penh • VIP Gold" },
      { col1: "Neary Long (C45423)", col2: "$13,150.46", col3: "Siem Reap • VIP Gold" },
    ],
  },
  D3: {
    id: "D3",
    title: "High-Volume Categories (> 1,000 Orders)",
    hql: `SELECT category, \n       COUNT(*) AS order_count,\n       ROUND(SUM(quantity * unit_price), 2) AS total_revenue\nFROM orders_opt\nGROUP BY category\nHAVING COUNT(*) > 1000\nORDER BY order_count DESC;`,
    speedup: "Predicate Pushdown & Columnar Scan: Only 2 of 9 columns read off disk (executed in 47.8ms across 1,000,000 records).",
    engine: "Apache Hive on Tez Engine",
    results: [
      { col1: "Electronics", col2: "300,194 orders", col3: "$146,423,934.76 • 30.0% volume" },
      { col1: "Groceries", col2: "250,265 orders", col3: "$7,128,597.29 • 25.0% volume" },
      { col1: "Clothing", col2: "249,730 orders", col3: "$19,903,188.38 • 25.0% volume" },
      { col1: "Home & Kitchen", col2: "100,138 orders", col3: "$14,665,313.19 • 10.0% volume" },
      { col1: "Beauty", col2: "49,966 orders", col3: "$2,939,812.41 • 5.0% volume" },
      { col1: "Books", col2: "49,707 orders", col3: "$1,941,038.67 • 5.0% volume" },
    ],
  },
  D4: {
    id: "D4",
    title: "Order Tier Segmentation (CASE WHEN)",
    hql: `SELECT CASE \n         WHEN (quantity * unit_price) > 100 THEN 'high'\n         ELSE 'normal'\n       END AS tier,\n       COUNT(*) AS order_count,\n       ROUND(SUM(quantity * unit_price), 2) AS tier_revenue\nFROM orders_opt\nGROUP BY 1;`,
    speedup: "Lightweight Snappy/ZLIB Compression: 21.15MB warehouse vs 74.39MB CSV (3.5x compression ratio) executed in 46.0ms.",
    engine: "Apache Hive on Tez Engine",
    results: [
      { col1: "Normal Tier (≤ $100)", col2: "578,158 orders (57.8%)", col3: "$22,618,564.58 total settled" },
      { col1: "High Tier (> $100)", col2: "421,842 orders (42.2%)", col3: "$170,383,320.12 total settled" },
    ],
  },
  D5: {
    id: "D5",
    title: "Behind the Scenes: Partition Pruning Proof",
    hql: `-- 1 Month Scan (Pruned):\nSELECT COUNT(*) FROM orders_opt WHERE order_month = '2026-09';\n\n-- Full 3-Month Scan:\nSELECT COUNT(*) FROM orders_opt;`,
    speedup: "Tez DAG Optimizer: Filter pushes directly to HDFS PathFilter. 1-Month read took 4.15ms vs 10.92ms for 3-Month (60% data skipped).",
    engine: "Apache Hive on Tez Engine (Calcite Optimizer)",
    results: [
      { col1: "September Partition (Pruned)", col2: "4.15 ms execution", col3: "400,000 records read (60% skipped)" },
      { col1: "Full Table Scan (3 Months)", col2: "10.92 ms execution", col3: "1,000,000 records read (100%)" },
      { col1: "CSV Raw Full Scan", col2: "423.32 ms execution", col3: "74.39 MB uncompressed disk I/O" },
    ],
  },
};

// ============================================================================
// Order Fulfillment State Machine Rules
// ============================================================================
export const VALID_ORDER_STATUSES = [
  "Pending",
  "Preparing",
  "Out for Delivery",
  "Dispatched",
  "Delivered",
  "Cancelled",
] as const;

export const VALID_ORDER_TRANSITIONS: Record<string, string[]> = {
  Pending: ["Preparing", "Cancelled"],
  Preparing: ["Out for Delivery", "Dispatched", "Cancelled"],
  "Out for Delivery": ["Delivered", "Cancelled"],
  Dispatched: ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

export function isValidOrderTransition(fromStatus: string, toStatus: string): boolean {
  if (fromStatus === toStatus) return true;
  const allowed = VALID_ORDER_TRANSITIONS[fromStatus];
  if (!allowed) return false;
  return allowed.includes(toStatus);
}

// ============================================================================
// Synchronized Global In-Memory Stores (for Cross-Route Persistence)
// ============================================================================
const globalStore = globalThis as unknown as {
  __productsStore?: Product[];
  __ordersStore?: OrderRecord[];
  __ridersStore?: RiderTelemetry[];
};

if (!globalStore.__productsStore) {
  globalStore.__productsStore = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
}

if (!globalStore.__ordersStore) {
  globalStore.__ordersStore = JSON.parse(JSON.stringify(INITIAL_ORDERS));
}

if (!globalStore.__ridersStore) {
  globalStore.__ridersStore = JSON.parse(JSON.stringify(INITIAL_RIDERS));
}

export function getProductsStore(): Product[] {
  return globalStore.__productsStore!;
}

export function findProductById(id: string): Product | undefined {
  return globalStore.__productsStore!.find((p) => p.product_id === id);
}

export function addProductToStore(prod: Product): Product {
  const store = globalStore.__productsStore!;
  const existingIdx = store.findIndex((p) => p.product_id === prod.product_id);
  if (existingIdx >= 0) {
    store[existingIdx] = { ...store[existingIdx], ...prod, updated_at: new Date().toISOString() };
    return store[existingIdx];
  }
  store.unshift(prod);
  return prod;
}

export function updateProductInStore(id: string, updates: Partial<Product>): Product | null {
  const store = globalStore.__productsStore!;
  const idx = store.findIndex((p) => p.product_id === id);
  if (idx >= 0) {
    store[idx] = { ...store[idx], ...updates, updated_at: new Date().toISOString() };
    return store[idx];
  }
  return null;
}

export function deleteProductFromStore(id: string): boolean {
  const store = globalStore.__productsStore!;
  const initialLen = store.length;
  globalStore.__productsStore = store.filter((p) => p.product_id !== id);
  return globalStore.__productsStore.length < initialLen;
}

export function addProductReview(
  productId: string,
  review: { author: string; rating: number; comment: string }
): Product | null {
  const prod = findProductById(productId);
  if (!prod) return null;
  const newRev = {
    id: `rev-${Date.now()}`,
    author: review.author || "Anonymous Customer",
    rating: review.rating,
    date: new Date().toISOString().split("T")[0],
    comment: review.comment,
    verified: true,
  };
  const list = prod.reviews ? [...prod.reviews, newRev] : [newRev];
  const avg = Number((list.reduce((sum, r) => sum + r.rating, 0) / list.length).toFixed(1));
  return updateProductInStore(productId, {
    reviews: list,
    reviews_count: list.length,
    rating: avg,
  });
}

export function getOrdersStore(): OrderRecord[] {
  return globalStore.__ordersStore!;
}

export function findOrderById(id: string): OrderRecord | undefined {
  return globalStore.__ordersStore!.find((o) => o.order_id === id);
}

export function addOrderToStore(order: OrderRecord): OrderRecord {
  const store = globalStore.__ordersStore!;
  const existingIdx = store.findIndex((o) => o.order_id === order.order_id);
  if (existingIdx >= 0) {
    store[existingIdx] = { ...store[existingIdx], ...order, updated_at: new Date().toISOString() };
    return store[existingIdx];
  }
  // Synchronize inventory: deduct stock for purchased items
  if (Array.isArray(order.items)) {
    for (const item of order.items) {
      if (item && item.product_id && item.quantity) {
        const prod = globalStore.__productsStore?.find((p) => p.product_id === item.product_id);
        if (prod) {
          prod.stock = Math.max(0, (prod.stock || 0) - Number(item.quantity));
        }
      }
    }
  }
  store.unshift(order);
  return order;
}

export function updateOrderStatusInStore(
  orderId: string,
  status: string,
  force: boolean = false,
  courierId?: string
): { success: boolean; order?: OrderRecord; error?: string } {
  const store = globalStore.__ordersStore!;
  const idx = store.findIndex((o) => o.order_id === orderId);
  if (idx === -1) {
    return { success: false, error: `Order ${orderId} not found` };
  }
  const currentOrder = store[idx];
  if (!force && !isValidOrderTransition(currentOrder.status, status)) {
    return {
      success: false,
      error: `Invalid transition from "${currentOrder.status}" to "${status}". Legal next states: ${
        VALID_ORDER_TRANSITIONS[currentOrder.status]?.join(", ") || "none (terminal state)"
      }`,
    };
  }

  let assigned_courier_id = currentOrder.assigned_courier_id;
  let assigned_courier_name = currentOrder.assigned_courier_name;
  let courier_phone = currentOrder.courier_phone;

  if (courierId) {
    const rider = globalStore.__ridersStore?.find((r) => r.id === courierId);
    if (rider) {
      assigned_courier_id = rider.id;
      assigned_courier_name = rider.name;
      courier_phone =
        rider.city === "Phnom Penh"
          ? "+855 12 999 888"
          : rider.city === "Siem Reap"
          ? "+855 15 777 666"
          : "+855 17 444 333";
      rider.status = "Delivering";
    }
  }

  // Restock items if order was cancelled
  if (status === "Cancelled" && currentOrder.status !== "Cancelled" && Array.isArray(currentOrder.items)) {
    for (const item of currentOrder.items) {
      if (item && item.product_id && item.quantity) {
        const prod = globalStore.__productsStore?.find((p) => p.product_id === item.product_id);
        if (prod) {
          prod.stock = (prod.stock || 0) + Number(item.quantity);
        }
      }
    }
  }

  store[idx] = {
    ...currentOrder,
    status,
    assigned_courier_id,
    assigned_courier_name,
    courier_phone,
    updated_at: new Date().toISOString(),
  };
  return { success: true, order: store[idx] };
}

export function getRidersStore(city?: string): RiderTelemetry[] {
  const list = globalStore.__ridersStore!;
  if (city && city !== "All") {
    return list.filter((r) => r.city.toLowerCase() === city.toLowerCase());
  }
  return list;
}

export function updateRiderLocation(
  riderId: string,
  lat: string | number,
  lng: string | number,
  speed?: string,
  battery?: number
): RiderTelemetry | null {
  const store = globalStore.__ridersStore!;
  const idx = store.findIndex((r) => r.id === riderId);
  if (idx >= 0) {
    store[idx] = {
      ...store[idx],
      lat,
      lng,
      speed: speed ?? store[idx].speed,
      battery: battery ?? store[idx].battery,
      lastPing: new Date().toISOString(),
    };
    return store[idx];
  }
  return null;
}

// ============================================================================
// Multi-Tenant Store Directory & Platform Administration Datasets
// ============================================================================

export const STORE_TENANTS: StoreTenant[] = [
  {
    id: "STR-001",
    name: "Mekong Electronics Hub",
    slug: "mekong-electronics",
    category: "Electronics & Solar",
    province: "Phnom Penh",
    owner: "Vireak Chan",
    email: "vireak@mekongelectronics.kh",
    phone: "+855 12 888 777",
    status: "Active",
    products_count: 18,
    orders_count: 420,
    revenue_usd: 84250.0,
    joined_date: "2024-03-15",
    rating: 4.9,
  },
  {
    id: "STR-002",
    name: "Sovann Silk Studio & Weavers",
    slug: "sovann-silk",
    category: "Clothing & Heritage Silk",
    province: "Phnom Penh",
    owner: "Chenda Som",
    email: "chenda@sovannsilk.com",
    phone: "+855 15 333 444",
    status: "Active",
    products_count: 14,
    orders_count: 310,
    revenue_usd: 38920.0,
    joined_date: "2024-05-20",
    rating: 4.8,
  },
  {
    id: "STR-003",
    name: "Angkor Artisan & Handicrafts",
    slug: "angkor-artisan",
    category: "Handicrafts & Decor",
    province: "Siem Reap",
    owner: "Piseth Seng",
    email: "piseth@angkorartisan.com",
    phone: "+855 17 222 111",
    status: "Active",
    products_count: 22,
    orders_count: 280,
    revenue_usd: 29400.0,
    joined_date: "2024-06-10",
    rating: 4.9,
  },
  {
    id: "STR-004",
    name: "Battambang Organic Harvest",
    slug: "battambang-organic",
    category: "Food & Groceries",
    province: "Battambang",
    owner: "Sokha Meas",
    email: "sokha@battambangharvest.kh",
    phone: "+855 77 444 555",
    status: "Active",
    products_count: 16,
    orders_count: 590,
    revenue_usd: 19850.0,
    joined_date: "2024-02-01",
    rating: 4.9,
  },
  {
    id: "STR-005",
    name: "Kampot Heritage Pepper Co.",
    slug: "kampot-heritage-pepper",
    category: "Gourmet Spices & PGI",
    province: "Kandal",
    owner: "Bopha Nou",
    email: "bopha@kampotheritage.com",
    phone: "+855 89 666 777",
    status: "Active",
    products_count: 8,
    orders_count: 340,
    revenue_usd: 14780.0,
    joined_date: "2024-08-12",
    rating: 4.9,
  },
  {
    id: "STR-006",
    name: "Phnom Penh Urban Streetwear",
    slug: "phnom-penh-streetwear",
    category: "Apparel & Kroma Street",
    province: "Phnom Penh",
    owner: "Dara Sam",
    email: "dara@ppstreetwear.kh",
    phone: "+855 93 111 222",
    status: "Active",
    products_count: 12,
    orders_count: 180,
    revenue_usd: 8940.0,
    joined_date: "2025-01-15",
    rating: 4.7,
  },
  {
    id: "STR-007",
    name: "Banteay Meanchey Ceramic Works",
    slug: "bm-ceramics",
    category: "Ceramics & Stoneware",
    province: "Siem Reap",
    owner: "Sreypov Keo",
    email: "sreypov@bmceramics.kh",
    phone: "+855 12 333 999",
    status: "Pending KYC",
    products_count: 9,
    orders_count: 24,
    revenue_usd: 1250.0,
    joined_date: "2026-02-01",
    rating: 4.6,
  },
  {
    id: "STR-008",
    name: "Cardamom Wild Botanicals",
    slug: "cardamom-botanicals",
    category: "Natural Wellness & Teas",
    province: "Battambang",
    owner: "Kosal Heng",
    email: "kosal@cardamombotanicals.kh",
    phone: "+855 10 555 888",
    status: "Pending KYC",
    products_count: 6,
    orders_count: 15,
    revenue_usd: 820.0,
    joined_date: "2026-03-10",
    rating: 4.8,
  },
];

export const PLATFORM_KPIS: PlatformKPIs = {
  gmvUSD: 76554792.32,
  totalOrders: 1000000,
  activeStoresCount: 1248,
  totalCustomers: 200000,
  gatewayReliability: {
    bakongKHQR: 99.4,
    abaPay: 98.8,
    cashOnDelivery: 89.2,
  },
  polyglotStats: {
    mongoCatalogsCount: 51,
    redisActiveCartsCount: 1420,
    cassandraDailyPings: 13824000,
    neo4jReferralNodes: 45000,
    hiveOrdersIngested: 1000000,
  },
};

export const SYSTEM_DATASTORES: SystemDatastoreStatus[] = [
  {
    name: "MongoDB 8.0",
    role: "Document Store (OLTP)",
    type: "NoSQL Flexible JSON",
    port: 27017,
    status: "Healthy",
    latencyMs: 1.8,
    metrics: "51 products • 200k customer profiles • ACID per doc",
    iconName: "Database",
  },
  {
    name: "Redis 7-Alpine",
    role: "Key-Value Store (In-Memory)",
    type: "RAM Cache & Cart TTL",
    port: 6379,
    status: "Healthy",
    latencyMs: 0.4,
    metrics: "1,420 active carts • sub-ms session lookup • AOF enabled",
    iconName: "Zap",
  },
  {
    name: "Apache Cassandra 4.1",
    role: "Wide-Column Family (Telemetry)",
    type: "Masterless Peer-to-Peer Ring",
    port: 9042,
    status: "Healthy",
    latencyMs: 2.3,
    metrics: "160 writes/sec node • 13.8M pings/day • TWCS compaction",
    iconName: "Radio",
  },
  {
    name: "Neo4j 5.18 Community",
    role: "Graph Database (Referrals)",
    type: "Index-Free Adjacency (Cypher)",
    port: 7687,
    status: "Healthy",
    latencyMs: 3.1,
    metrics: "3-tier viral referral tree • APOC plugin active",
    iconName: "Share2",
  },
  {
    name: "Apache Hive 3.1 on HDFS",
    role: "Columnar Data Warehouse (OLAP)",
    type: "Batch Analytics (ORC / Snappy)",
    port: 10000,
    status: "Healthy",
    latencyMs: 50.8,
    metrics: "1,000,000 orders • 8.3x speedup vs CSV • 3 partitions",
    iconName: "Layers",
  },
];

export function getStoreTenants(filter?: { province?: string; status?: string; search?: string }): StoreTenant[] {
  let list = STORE_TENANTS;
  if (filter?.province && filter.province !== "All") {
    list = list.filter((s) => s.province.toLowerCase() === filter.province!.toLowerCase());
  }
  if (filter?.status && filter.status !== "All") {
    list = list.filter((s) => s.status.toLowerCase() === filter.status!.toLowerCase());
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter((s) => s.name.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  }
  return list;
}

