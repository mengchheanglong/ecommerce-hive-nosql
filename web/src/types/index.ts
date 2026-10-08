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
  store_id?: string;
  store_slug?: string;
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
  cancellation_reason?: string;
  return_reason?: string;
  return_status?: "Pending" | "Approved" | "Refunded" | "Rejected" | string;
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
  banner?: string;
  description?: string;
  address?: string;
  delivery_areas?: string[];
  badges?: string[];
  opening_hours?: string;
  positive_feedback?: number;
  response_time?: string;
  features?: string[];
  followers_count?: number;
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

export interface SandboxVehicle {
  id: string;
  name: string;
  type: "truck" | "van" | "motorcycle";
  status: "idle" | "en_route" | "delivering" | "returning" | "broken_down" | string;
  driverId: string;
  driverName?: string;
  position: { lat: number; lon: number };
  speed_kmh: number;
  capacity_kg: number;
  currentLoad_kg: number;
  currentRouteId?: string;
  assignedOrderIds?: string[];
  routeGeometry?: [number, number][];
  routeProgress?: number;
  routeDistanceM?: number;
  routeDurationS?: number;
  depotId?: string;
  battery?: number;
}

export interface SandboxSimStats {
  activeVehicles: number;
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  lateOrders: number;
  avgDeliveryTimeMin: number;
  totalDistanceKm: number;
  slaOnTimeDeliveries?: number;
  slaBreachedDeliveries?: number;
  slaComplianceRate?: number;
  atRiskOrdersCount?: number;
}

export interface SandboxSimState {
  simulationId: string;
  simTime: number;
  speed: number;
  status: "running" | "paused" | "stopped" | string;
  vehicles: SandboxVehicle[];
  orders: any[];
  warehouses: any[];
  stats: SandboxSimStats;
  activeScenarioId?: string;
  trafficMultiplier?: number;
}

export interface PathfinderGraphStats {
  nodes: number;
  edges: number;
  status?: string;
  version?: string;
  queryLatencyMs?: number;
}


export interface FleetTelemetrySnapshot {
  schemaVersion: 1;
  success: boolean;
  source: "fixture" | "unavailable";
  sourceId: string;
  tenantId: "demo";
  status: "fixture" | "unavailable";
  observedAt: null;
  storage: "none";
  durable: false;
  sinkOwner: "none";
  units: { coordinates: "degrees"; speed: "km/h"; battery: "percent" };
  riders: RiderTelemetry[];
}
