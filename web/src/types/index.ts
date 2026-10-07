export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface SellerInfo {
  name: string;
  rating: number;
  reviews_count: number;
  positive_feedback: number;
  response_time: string;
  verified: boolean;
  store_id: string;
}

export interface Product {
  product_id: string;
  name: string;
  category: "Electronics" | "Clothing" | "Groceries" | string;
  price: number;
  status: "active" | "archived" | "draft" | string;
  description?: string;
  // Polymorphic attributes
  screen_size?: string;
  warranty?: string;
  size?: string;
  colours?: string[];
  weight?: string;
  expiry_date?: string;
  dimensions?: string;
  material?: string;
  volume?: string;
  skin_type?: string;
  artisan?: string;
  origin_province?: string;
  image?: string;
  images?: string[];
  seller?: SellerInfo;
  frequently_bought_with?: string[];
  rating?: number;
  reviews_count?: number;
  reviews?: ProductReview[];
  stock?: number;
  category_slug?: string;
  category_aliases?: string[];
  subcategory?: string;
  subcategory_name?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

export interface OrderRecord {
  order_id: string;
  customer_id: string;
  customer_name: string;
  items: OrderItem[];
  total: number;
  province: string;
  payment_method: string;
  status: "Pending" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled" | string;
  delivery_address?: string;
  promo_code?: string;
  discountUSD?: number;
  assigned_courier_id?: string;
  assigned_courier_name?: string;
  courier_phone?: string;
  created_at: string;
  updated_at?: string;
}

export interface CustomerProfile {
  _id: string;
  name: string;
  phone: string;
  email: string;
  loyalty_points: number;
  tier: "Standard" | "Silver" | "VIP Gold" | "VIP Platinum";
  addresses: DeliveryAddress[];
  referral_code: string;
}

export interface DeliveryAddress {
  id?: string;
  label: string;
  street: string;
  city: "Phnom Penh" | "Siem Reap" | "Battambang" | string;
  isDefault?: boolean;
}

export interface RiderTelemetry {
  id: string;
  name: string;
  city: string;
  lat: string | number;
  lng: string | number;
  status: "Delivering" | "Picked Up" | "Idle" | string;
  battery: number;
  speed: string;
  lastPing?: string;
}

export interface ReferralNode {
  id: string;
  name: string;
  level: 1 | 2 | 3;
  city: string;
  spend: number;
  earned: number;
  referredBy?: string;
  date?: string;
}

export interface HiveQueryMeta {
  id: "D1" | "D2" | "D3" | "D4" | "D5" | string;
  title: string;
  hql: string;
  speedup: string;
  engine: string;
  results: Array<{ col1: string; col2: string; col3: string }>;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info" | "error" | "warning";
}

export interface StoreTenant {
  id: string;
  name: string;
  slug: string;
  category: string;
  province: "Phnom Penh" | "Siem Reap" | "Battambang" | "Kandal" | string;
  owner: string;
  email: string;
  phone: string;
  status: "Active" | "Pending KYC" | "Suspended";
  products_count: number;
  orders_count: number;
  revenue_usd: number;
  joined_date: string;
  rating: number;
  logo?: string;
}

export interface PlatformKPIs {
  gmvUSD: number;
  totalOrders: number;
  activeStoresCount: number;
  totalCustomers: number;
  gatewayReliability: {
    bakongKHQR: number;
    abaPay: number;
    cashOnDelivery: number;
  };
  polyglotStats: {
    mongoCatalogsCount: number;
    redisActiveCartsCount: number;
    cassandraDailyPings: number;
    neo4jReferralNodes: number;
    hiveOrdersIngested: number;
  };
}

export interface StoreKPIs {
  todaySalesUSD: number;
  todayOrdersCount: number;
  availableBalanceUSD: number;
  avgOrderValueUSD: number;
  pendingDecisionCount: number;
  readyToPackCount: number;
  lowStockItemsCount: number;
}

export interface SystemDatastoreStatus {
  name: string;
  role: string;
  type: string;
  port: number;
  status: "Healthy" | "Degraded" | "Offline";
  latencyMs: number;
  metrics: string;
  iconName: string;
}
