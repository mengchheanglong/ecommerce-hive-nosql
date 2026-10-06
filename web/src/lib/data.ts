import { Product, OrderRecord, CustomerProfile, RiderTelemetry, ReferralNode, HiveQueryMeta } from "@/types";

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // ELECTRONICS (8 items)
  // ==========================================
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
    description: "Flagship AMOLED display with high-efficiency 5G modem, AI computational photography, and all-day fast charge.",
    reviews: [
      {
        id: "rev-1",
        author: "Sokha Meas",
        rating: 5,
        date: "2026-09-20",
        comment: "Excellent AMOLED display, buttery smooth 120Hz and super fast courier delivery in Phnom Penh.",
        verified: true,
      },
      {
        id: "rev-2",
        author: "Piseth Seng",
        rating: 5,
        date: "2026-09-24",
        comment: "Battery easily lasts 1.5 days under heavy usage. Bakong KHQR checkout was instantaneous.",
        verified: true,
      },
    ],
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
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    screen_size: "Touch Sensor Interface",
    warranty: "6 Months Replacement",
    frequently_bought_with: ["P2210", "P2215"],
    description: "Active noise cancellation up to 42dB with transparency mode and water-resistant nano-coating.",
    reviews: [
      {
        id: "rev-4",
        author: "Chenda Som",
        rating: 5,
        date: "2026-09-18",
        comment: "Active noise cancellation works very well during coffee shop remote work in Siem Reap.",
        verified: true,
      },
    ],
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
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    screen_size: "1.43 inch AMOLED Sapphire",
    warranty: "1 Year Official Distributor",
    description: "Multi-band GPS tracking, continuous SpO2 heart-rate telemetry, and 14-day battery life with water resistance to 50m.",
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
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    screen_size: "75% Compact Layout",
    warranty: "1 Year Warranty",
    frequently_bought_with: ["P2212", "P2211"],
    description: "Factory-lubed linear switches with sound-dampening silicone gasket and programmable per-key RGB backlighting.",
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
    image: "https://images.unsplash.com/photo-1609592424364-77be1c028ba4?auto=format&fit=crop&w=800&q=80",
    screen_size: "Smart Digital Power Display",
    warranty: "6 Months Replacement",
    description: "65W USB-C Power Delivery charges laptops and smartphones simultaneously with airplane-safe certified battery cells.",
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
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    screen_size: "Dual-Band AX3000",
    warranty: "2 Years Replacement",
    description: "Covers up to 3,000 sq ft with low-latency beamforming antennas and WPA3 enterprise security protocol.",
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
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
    screen_size: "4K 60fps 3-Axis Gimbal",
    warranty: "1 Year Manufacturer",
    description: "Under 249g ultra-lightweight drone with obstacle avoidance, return-to-home GPS fail-safe, and 31-minute flight time.",
  },

  // ==========================================
  // CLOTHING & APPAREL (8 items)
  // ==========================================
  {
    product_id: "P3314",
    name: "Premium Linen Casual Shirt",
    category: "Clothing",
    price: 18.5,
    status: "active",
    stock: 120,
    rating: 4.6,
    reviews_count: 67,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    size: "22 Litres (16\" Laptop Compartment)",
    colours: ["Matte Black", "Graphite Grey"],
    description: "Weatherproof coated canvas with magnetic quick-release clasps and padded ergonomic air-mesh shoulder straps.",
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
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    size: "XL",
    colours: ["Glacier Blue", "Stone Grey"],
    description: "UPF 50+ sun protection hooded jacket with thumbholes, breathable mesh underarms, and fast-drying fabric.",
  },

  // ==========================================
  // GROCERIES & CAMBODIAN SPECIALTIES (8 items)
  // ==========================================
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
    description: "Award-winning Malys Angkor aromatic long-grain jasmine rice, vacuum-sealed at source in Battambang province.",
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
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    weight: "150g Biodegradable Box",
    expiry_date: "2027-11-30",
    description: "Refreshing immune-supporting herbal infusion crafted with whole sun-dried lemongrass stalks and spicy wild ginger.",
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
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    weight: "400g Foil Seal Tub",
    expiry_date: "2027-07-15",
    description: "Premium jumbo M23 cashew nuts grown in Kampong Cham, slow-roasted with skin on for deep nutty crunch.",
  },
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
    title: "Revenue by Province (September 2026)",
    hql: `SELECT province, \n       SUM(quantity * unit_price) AS total_revenue\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY province\nORDER BY total_revenue DESC;`,
    speedup: "Partition Pruning: skips non-target HDFS folders, reducing scanned data by over 90%.",
    engine: "Apache Hive on Tez Engine",
    results: [
      { col1: "Phnom Penh", col2: "$5,420.50", col3: "54.1% market share" },
      { col1: "Siem Reap", col2: "$3,180.00", col3: "31.7% market share" },
      { col1: "Battambang", col2: "$1,426.50", col3: "14.2% market share" },
    ],
  },
  D2: {
    id: "D2",
    title: "Top 5 Customers by Spend (Bucket Map-Join)",
    hql: `SELECT c.customer_id, \n       c.name, \n       c.city, \n       SUM(o.quantity * o.unit_price) AS total_spend\nFROM orders_opt o\nJOIN customers c ON o.customer_id = c.customer_id\nWHERE o.order_month = '2026-09'\nGROUP BY c.customer_id, c.name, c.city\nORDER BY total_spend DESC\nLIMIT 5;`,
    speedup: "Bucket Map-Side Join: 8 aligned hash buckets eliminate shuffle overhead across worker datanodes.",
    engine: "Apache Hive on Tez Engine",
    results: [
      { col1: "Chenda Som", col2: "$2,625.00", col3: "Siem Reap • VIP Platinum" },
      { col1: "Sokha Meas", col2: "$1,980.00", col3: "Phnom Penh • VIP Gold" },
      { col1: "Piseth Seng", col2: "$1,800.00", col3: "Siem Reap • VIP Gold" },
      { col1: "Vireak Chan", col2: "$1,294.00", col3: "Phnom Penh • VIP Gold" },
      { col1: "Bopha Nou", col2: "$1,120.00", col3: "Phnom Penh • VIP Platinum" },
    ],
  },
  D3: {
    id: "D3",
    title: "High-Volume Categories (> 1,000 Orders)",
    hql: `SELECT category, \n       COUNT(*) AS order_count\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY category\nHAVING COUNT(*) > 1000\nORDER BY order_count DESC;`,
    speedup: "Predicate Pushdown: Columnar ORC reader inspects Stripe statistics to skip unneeded blocks.",
    engine: "Apache Hive on Tez Engine",
    results: [
      { col1: "Electronics", col2: "1,480 orders", col3: "High Revenue Margin" },
      { col1: "Groceries", col2: "1,245 orders", col3: "Fast Consumables" },
      { col1: "Clothing", col2: "1,030 orders", col3: "High Volume Repeat" },
    ],
  },
  D4: {
    id: "D4",
    title: "Order Tier Segmentation (CASE WHEN)",
    hql: `SELECT CASE \n         WHEN (quantity * unit_price) > 100 THEN 'high'\n         ELSE 'normal'\n       END AS tier,\n       COUNT(*) AS order_count\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY CASE \n           WHEN (quantity * unit_price) > 100 THEN 'high'\n           ELSE 'normal'\n         END;`,
    speedup: "Lightweight ZLIB Compression: High-compression ORC reads bypass disk I/O bottlenecks.",
    engine: "Apache Hive on Tez Engine",
    results: [
      { col1: "Normal Tier (≤ $100)", col2: "42 orders", col3: "58.3% volume" },
      { col1: "High Tier (> $100)", col2: "30 orders", col3: "41.7% volume" },
    ],
  },
  D5: {
    id: "D5",
    title: "Payment Gateway Share & Average Order Value (AOV)",
    hql: `SELECT payment_method, \n       COUNT(*) AS total_transactions, \n       ROUND(AVG(quantity * unit_price), 2) AS avg_order_value, \n       SUM(quantity * unit_price) AS total_settled_usd\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY payment_method\nORDER BY total_settled_usd DESC;`,
    speedup: "Vectorized Query Execution: SIMD vector processing operates on 1,024-row batches in CPU L1/L2 cache.",
    engine: "Apache Hive on Tez Engine",
    results: [
      { col1: "Bakong KHQR (NBC)", col2: "$6,240.50 (62.2%)", col3: "AOV: $124.81 • $0 Interbank Fee" },
      { col1: "Cash on Delivery (COD)", col2: "$2,780.00 (27.7%)", col3: "AOV: $46.33 • Rider Cash Reconciliation" },
      { col1: "Credit / Debit Card", col2: "$1,006.50 (10.1%)", col3: "AOV: $83.88 • 2.5% Surcharge" },
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
  "Delivered",
  "Cancelled",
] as const;

export const VALID_ORDER_TRANSITIONS: Record<string, string[]> = {
  Pending: ["Preparing", "Cancelled"],
  Preparing: ["Out for Delivery", "Cancelled"],
  "Out for Delivery": ["Delivered", "Cancelled"],
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
