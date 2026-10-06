import { Product, OrderRecord, CustomerProfile, RiderTelemetry, ReferralNode, HiveQueryMeta } from "@/types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    product_id: "P2210",
    name: "Ultra Smartphone Pro Max",
    category: "Electronics",
    price: 289.0,
    status: "active",
    stock: 45,
    rating: 4.8,
    reviews_count: 124,
    screen_size: "6.7 inch OLED 120Hz",
    warranty: "1 Year Official Distributor",
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
      {
        id: "rev-3",
        author: "Vireak Chan",
        rating: 4,
        date: "2026-10-01",
        comment: "Very solid build quality. Minor warmth under heavy gaming but overall stellar value.",
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
    screen_size: "Touch Sensor Interface",
    warranty: "6 Months Replacement",
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
      {
        id: "rev-5",
        author: "Kolab Heng",
        rating: 4,
        date: "2026-10-02",
        comment: "Crisp highs and punchy bass. Comfortable fit for extended jogging sessions.",
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
    screen_size: "34 inch 1500R Curved 4K",
    warranty: "2 Years Manufacturer",
    description: "Immersive panoramic display with 99% sRGB color accuracy, USB-C 90W power delivery, and built-in KVM switch.",
    reviews: [
      {
        id: "rev-6",
        author: "Rithy Pen",
        rating: 5,
        date: "2026-09-29",
        comment: "Productivity dream. Single USB-C cable powers my MacBook and connects all peripherals.",
        verified: true,
      },
    ],
  },
  {
    product_id: "P3314",
    name: "Premium Linen Casual Shirt",
    category: "Clothing",
    price: 18.5,
    status: "active",
    stock: 120,
    rating: 4.6,
    reviews_count: 67,
    size: "L",
    colours: ["Navy Blue", "Sand Beige", "Olive"],
    description: "Breathable 100% natural organic linen tailored for tropical climates with reinforced horn-button closure.",
    reviews: [
      {
        id: "rev-7",
        author: "Dara Kong",
        rating: 5,
        date: "2026-09-12",
        comment: "Wonderfully light and breathable linen fabric. Perfectly suited for sunny afternoon strolls.",
        verified: true,
      },
    ],
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
    size: "Free Size (180x60cm)",
    colours: ["Crimson Red", "Royal Indigo", "Emerald Gold"],
    description: "Artisanal handwoven silk from Takeo weavers, featuring authentic heritage patterns with a modern drape.",
    reviews: [
      {
        id: "rev-8",
        author: "Bopha Nou",
        rating: 5,
        date: "2026-09-15",
        comment: "Exquisite craftsmanship and soft touch. Bought two more as gifts for international guests.",
        verified: true,
      },
    ],
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
    size: "32W x 30L",
    colours: ["Khaki", "Charcoal", "Dark Navy"],
    description: "Comfortable four-way stretch cotton twill designed for versatile office and casual city commuting.",
  },
  {
    product_id: "P0874",
    name: "Battambang Jasmine Fragrant Rice 5kg",
    category: "Groceries",
    price: 4.8,
    status: "active",
    stock: 250,
    rating: 4.9,
    reviews_count: 310,
    weight: "5.0 kg Bag",
    expiry_date: "2027-10-01",
    description: "Award-winning Malys Angkor aromatic long-grain jasmine rice, vacuum-sealed at source in Battambang province.",
    reviews: [
      {
        id: "rev-9",
        author: "Sophea Kim",
        rating: 5,
        date: "2026-09-10",
        comment: "Unmatched fragrance when steamed. Vacuum seal keeps it fresh as day one.",
        verified: true,
      },
    ],
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
    weight: "250g Glass Jar",
    expiry_date: "2028-04-15",
    description: "Protected Geographical Indication (PGI) certified Kampot peppercorns with intense floral and mint notes.",
    reviews: [
      {
        id: "rev-10",
        author: "Chan Vuthy",
        rating: 5,
        date: "2026-09-22",
        comment: "The floral aroma upon freshly grinding is intoxicating. The only pepper we use at home now.",
        verified: true,
      },
    ],
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
    weight: "500g Foil Valve Bag",
    expiry_date: "2027-08-30",
    description: "High-altitude volcanic soil highland beans roasted in small artisan batches for rich cacao undertones.",
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
    payment_method: "Bakong KHQR",
    status: "Delivered",
    delivery_address: "Street 271, Sangkat Boeung Tumpun, Phnom Penh",
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
    payment_method: "Bakong KHQR",
    status: "Out for Delivery",
    delivery_address: "Street 271, Sangkat Boeung Tumpun, Phnom Penh",
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
    payment_method: "Bakong KHQR",
    status: "Preparing",
    delivery_address: "Wat Bo Village, Salakamreuk, Siem Reap",
    created_at: "2026-10-05T19:20:00Z",
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
      label: "Home",
      street: "Street 271, Sangkat Boeung Tumpun",
      city: "Phnom Penh",
      isDefault: true,
    },
    {
      id: "addr-2",
      label: "Office",
      street: "Exchange Square, Norodom Blvd, Sangkat Tonle Bassac",
      city: "Phnom Penh",
      isDefault: false,
    },
    {
      id: "addr-3",
      label: "Siem Reap Residence",
      street: "Street 07, Wat Bo Village",
      city: "Siem Reap",
      isDefault: false,
    },
  ],
};

export const INITIAL_RIDERS: RiderTelemetry[] = [
  { id: "R-101", name: "Chan Vuthy", city: "Phnom Penh", lat: "11.5564° N", lng: "104.9282° E", status: "Delivering", battery: 88, speed: "28 km/h" },
  { id: "R-102", name: "Sok Rith", city: "Phnom Penh", lat: "11.5721° N", lng: "104.9150° E", status: "Picked Up", battery: 74, speed: "34 km/h" },
  { id: "R-103", name: "Meng Kiri", city: "Phnom Penh", lat: "11.5430° N", lng: "104.9390° E", status: "Idle", battery: 96, speed: "0 km/h" },
  { id: "R-201", name: "Thy Dara", city: "Siem Reap", lat: "13.3633° N", lng: "103.8564° E", status: "Delivering", battery: 62, speed: "22 km/h" },
  { id: "R-202", name: "Chea Bora", city: "Siem Reap", lat: "13.3510° N", lng: "103.8670° E", status: "Delivering", battery: 81, speed: "26 km/h" },
  { id: "R-301", name: "Heng Samnang", city: "Battambang", lat: "13.0957° N", lng: "103.2022° E", status: "Delivering", battery: 54, speed: "30 km/h" },
  { id: "R-302", name: "Keo Visal", city: "Battambang", lat: "13.1020° N", lng: "103.1940° E", status: "Idle", battery: 91, speed: "0 km/h" },
];

export const INITIAL_REFERRALS: ReferralNode[] = [
  { id: "C1001", name: "Vireak Chan", level: 1, city: "Phnom Penh", spend: 420.0, earned: 21.0, referredBy: "C0457", date: "2026-07-10" },
  { id: "C1002", name: "Sophea Kim", level: 1, city: "Siem Reap", spend: 650.0, earned: 32.5, referredBy: "C0457", date: "2026-07-15" },
  { id: "C1003", name: "Rithy Pen", level: 2, city: "Battambang", spend: 810.0, earned: 24.3, referredBy: "C1001", date: "2026-08-01" },
  { id: "C1005", name: "Kolab Heng", level: 2, city: "Phnom Penh", spend: 390.0, earned: 11.7, referredBy: "C1002", date: "2026-08-12" },
  { id: "C1004", name: "Bopha Nou", level: 3, city: "Phnom Penh", spend: 1120.0, earned: 11.2, referredBy: "C1003", date: "2026-08-20" },
  { id: "C1007", name: "Dara Kong", level: 3, city: "Siem Reap", spend: 780.0, earned: 7.8, referredBy: "C1005", date: "2026-09-02" },
];

export const HIVE_QUERIES: Record<string, HiveQueryMeta> = {
  D1: {
    id: "D1",
    title: "Revenue by Province (September 2026)",
    hql: `SELECT province, \n       SUM(quantity * unit_price) AS total_revenue\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY province\nORDER BY total_revenue DESC;`,
    speedup: "Partition Pruning: skips non-target HDFS folders, reducing scanned data by over 90%.",
    engine: "Apache Hive on Tez Engine",
    results: [
      { col1: "Siem Reap", col2: "$5,175.00", col3: "57.3% share" },
      { col1: "Phnom Penh", col2: "$2,989.50", col3: "33.1% share" },
      { col1: "Battambang", col2: "$862.50", col3: "9.6% share" },
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
      { col1: "Dara Sam", col2: "$750.00", col3: "Siem Reap • Silver" },
      { col1: "Sreypov Keo", col2: "$510.00", col3: "Battambang • Silver" },
    ],
  },
  D3: {
    id: "D3",
    title: "High-Volume Categories (> 1,000 Orders)",
    hql: `SELECT category, \n       COUNT(*) AS order_count\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY category\nHAVING COUNT(*) > 1000\nORDER BY order_count DESC;`,
    speedup: "Predicate Pushdown: Columnar ORC reader inspects Stripe statistics to skip unneeded blocks.",
    engine: "Apache Hive on Tez Engine",
    results: [
      { col1: "Groceries", col2: "1,245 orders", col3: "Fast Consumables" },
      { col1: "Electronics", col2: "1,080 orders", col3: "High Revenue Margin" },
    ],
  },
  D4: {
    id: "D4",
    title: "Order Tier Segmentation (CASE WHEN)",
    hql: `SELECT CASE \n         WHEN (quantity * unit_price) > 100 THEN 'high'\n         ELSE 'normal'\n       END AS tier,\n       COUNT(*) AS order_count\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY CASE \n           WHEN (quantity * unit_price) > 100 THEN 'high'\n           ELSE 'normal'\n         END;`,
    speedup: "Lightweight ZLIB Compression: High-compression ORC reads bypass disk I/O bottlenecks.",
    engine: "Apache Hive on Tez Engine",
    results: [
      { col1: "Normal Tier (≤ $100)", col2: "33 orders", col3: "64.7% volume" },
      { col1: "High Tier (> $100)", col2: "18 orders", col3: "35.3% volume" },
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
// GlobalThis singleton guarantees persistence across fast refreshes & separate Next.js route bundles
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
  force: boolean = false
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
  store[idx] = { ...currentOrder, status, updated_at: new Date().toISOString() };
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
