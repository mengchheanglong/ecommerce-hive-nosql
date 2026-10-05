"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingBag,
  TrendingUp,
  MapPin,
  User,
  CheckCircle2,
  Database,
  Server,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  QrCode,
  X,
  CreditCard,
  Truck,
  Sparkles,
  Search,
  Filter,
  BarChart3,
  Activity,
  Code2,
  ExternalLink,
  ChevronRight,
  Plus,
  Minus,
  Check,
  RefreshCw,
  SlidersHorizontal,
  Info,
  DollarSign,
  Eye,
  Play,
  Terminal,
  Copy,
  CheckCheck
} from "lucide-react";

interface Product {
  product_id: string;
  name: string;
  category: string;
  price: number;
  status: string;
  screen_size?: string;
  warranty?: string;
  size?: string;
  colours?: string[];
  weight?: string;
  expiry_date?: string;
  description?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info";
}

export default function MarketplaceApp() {
  const [activeTab, setActiveTab] = useState<"store" | "analytics" | "riders" | "customer">("store");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "low" | "high">("featured");
  const [currency, setCurrency] = useState<"USD" | "KHR">("USD");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"khqr" | "cod" | "card">("khqr");
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [countdown, setCountdown] = useState(180);
  const [showJsonSchema, setShowJsonSchema] = useState(false);
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("All");

  // Quick View Product Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add Address Modal State
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddressStreet, setNewAddressStreet] = useState("");
  const [newAddressCity, setNewAddressCity] = useState("Phnom Penh");

  // HiveQL Console Active Query
  const [activeHiveQuery, setActiveHiveQuery] = useState<"D1" | "D2" | "D3" | "D4">("D1");
  const [isQueryExecuting, setIsQueryExecuting] = useState(false);
  const [queryCopied, setQueryCopied] = useState(false);

  // Cassandra Stream Simulation State
  const [isTelemetryStreaming, setIsTelemetryStreaming] = useState(true);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    "[Cassandra LSM] Ingest stream initialized. Cluster listening on 9042.",
    "[Cassandra LSM] 800 node token rings active. Keyspace: telemetry_ks.",
  ]);

  // KHR Exchange Rate (1 USD = 4,100 KHR)
  const KHR_RATE = 4100;

  const showToast = (message: string, type: "success" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Customer Profile State (MongoDB Document Model)
  const [customer, setCustomer] = useState({
    _id: "C0457",
    name: "Sokha Meas",
    phone: "+855-12-345-678",
    loyalty_points: 150,
    tier: "VIP Gold",
    addresses: [
      { label: "Home", street: "Street 271, Sangkat Boeung Tumpun", city: "Phnom Penh", isDefault: true },
      { label: "Office", street: "Norodom Blvd, Sangkat Tonle Bassac", city: "Phnom Penh", isDefault: false },
    ],
    past_orders: [
      { id: "100001", date: "2026-09-03", total: 289.0, items: "Smartphone X", status: "Delivered" },
      { id: "99452", date: "2026-08-28", total: 45.0, items: "Cotton T-Shirt x3", status: "Delivered" },
    ],
  });

  // Load products from API
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts([
            {
              product_id: "P2210",
              name: "Ultra Smartphone Pro Max",
              category: "Electronics",
              price: 289.0,
              status: "active",
              screen_size: "6.7 inch OLED",
              warranty: "1 Year Official",
              description: "Flagship AMOLED display with high-efficiency 5G modem, 120Hz dynamic refresh, and all-day fast charge.",
            },
            {
              product_id: "P3314",
              name: "Premium Linen Casual Shirt",
              category: "Clothing",
              price: 18.5,
              status: "active",
              size: "L",
              colours: ["Navy Blue", "Sand Beige", "Olive"],
              description: "Breathable 100% natural organic linen tailored for tropical climates with reinforced horn buttons.",
            },
            {
              product_id: "P0874",
              name: "Battambang Jasmine Fragrant Rice 5kg",
              category: "Groceries",
              price: 4.8,
              status: "active",
              weight: "5.0 kg",
              expiry_date: "2027-10-01",
              description: "Award-winning Malys Angkor aromatic long-grain rice, harvest-milled and vacuum-sealed at source.",
            },
            {
              product_id: "P4502",
              name: "Smart Noise-Canceling Earbuds",
              category: "Electronics",
              price: 59.0,
              status: "active",
              screen_size: "Smart Touch Stem",
              warranty: "6 Months",
              description: "Active hybrid noise cancellation with 38-hour battery case, low-latency gaming mode, and IPX5 resistance.",
            },
            {
              product_id: "P1290",
              name: "Kampot Premium Organic Black Pepper",
              category: "Groceries",
              price: 6.5,
              status: "active",
              weight: "250g Glass Jar",
              expiry_date: "2028-01-15",
              description: "GI-certified organic whole black peppercorns sun-dried on Kampot coastal estates with bold floral aromatics.",
            },
            {
              product_id: "P7781",
              name: "Handwoven Silk Summer Scarf",
              category: "Clothing",
              price: 24.0,
              status: "active",
              size: "Standard 180cm",
              colours: ["Amber Gold", "Lotus Pink"],
              description: "Artisanal handloom Cambodian golden silk scarf crafted with natural vegetable dyes by master weavers.",
            },
          ]);
        }
      })
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  // Countdown timer for KHQR
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCheckoutOpen && selectedPayment === "khqr" && countdown > 0 && !isCheckoutSuccess) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isCheckoutOpen, selectedPayment, countdown, isCheckoutSuccess]);

  // Simulated Live Cassandra Ingest Logs
  useEffect(() => {
    if (!isTelemetryStreaming || activeTab !== "riders") return;

    const interval = setInterval(() => {
      const riderIds = ["R-101", "R-102", "R-103", "R-201", "R-202", "R-301", "R-302"];
      const randomRider = riderIds[Math.floor(Math.random() * riderIds.length)];
      const randomSpeed = Math.floor(18 + Math.random() * 20);
      const timeStr = new Date().toTimeString().slice(0, 8);
      const newLog = `[Cassandra LSM] INSERT INTO rider_telemetry (rider_id, ping_time, speed) VALUES ('${randomRider}', '${timeStr}', '${randomSpeed} km/h');`;

      setTelemetryLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isTelemetryStreaming, activeTab]);

  const formatPrice = (usd: number) => {
    if (currency === "USD") {
      return `$${usd.toFixed(2)}`;
    }
    const khr = Math.round(usd * KHR_RATE);
    return `៛${khr.toLocaleString()}`;
  };

  const addToCart = (product: Product, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.product_id === product.product_id);
      if (existing) {
        return prev.map((item) =>
          item.product.product_id === product.product_id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`Added ${qty}x ${product.name} to cart`);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.product_id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const cartTotalUSD = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFeeUSD = cartTotalUSD > 40 || cartTotalUSD === 0 ? 0 : 1.5;
  const finalTotalUSD = cartTotalUSD + deliveryFeeUSD;

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => (selectedCategory === "All" ? true : p.category === selectedCategory))
      .filter((p) =>
        searchQuery === ""
          ? true
          : p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "low") return a.price - b.price;
        if (sortBy === "high") return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Simulated Cassandra Riders
  const ridersList = [
    { id: "R-101", name: "Chan Vuthy", city: "Phnom Penh", lat: "11.5564° N", lng: "104.9282° E", status: "Delivering", battery: 88, speed: "28 km/h" },
    { id: "R-102", name: "Sok Rith", city: "Phnom Penh", lat: "11.5721° N", lng: "104.9150° E", status: "Picked Up", battery: 74, speed: "34 km/h" },
    { id: "R-103", name: "Meng Kiri", city: "Phnom Penh", lat: "11.5430° N", lng: "104.9390° E", status: "Idle", battery: 96, speed: "0 km/h" },
    { id: "R-201", name: "Thy Dara", city: "Siem Reap", lat: "13.3633° N", lng: "103.8564° E", status: "Delivering", battery: 62, speed: "22 km/h" },
    { id: "R-202", name: "Chea Bora", city: "Siem Reap", lat: "13.3510° N", lng: "103.8670° E", status: "Delivering", battery: 81, speed: "26 km/h" },
    { id: "R-301", name: "Heng Samnang", city: "Battambang", lat: "13.0957° N", lng: "103.2022° E", status: "Delivering", battery: 54, speed: "30 km/h" },
    { id: "R-302", name: "Keo Visal", city: "Battambang", lat: "13.1020° N", lng: "103.1940° E", status: "Idle", battery: 91, speed: "0 km/h" },
  ];

  const filteredRiders =
    selectedCityFilter === "All" ? ridersList : ridersList.filter((r) => r.city === selectedCityFilter);

  const handleSimulatePayment = () => {
    setIsCheckoutSuccess(true);
    const newOrder = {
      id: `100${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().slice(0, 10),
      total: finalTotalUSD,
      items: cart.map((i) => `${i.product.name} (x${i.quantity})`).join(", "),
      status: "Processing",
    };
    setCustomer((prev) => ({
      ...prev,
      loyalty_points: prev.loyalty_points + Math.floor(finalTotalUSD),
      past_orders: [newOrder, ...prev.past_orders],
    }));
    showToast(`Order #${newOrder.id} successfully recorded!`);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLabel || !newAddressStreet) return;

    setCustomer((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        { label: newAddressLabel, street: newAddressStreet, city: newAddressCity, isDefault: false },
      ],
    }));
    setNewAddressLabel("");
    setNewAddressStreet("");
    setIsAddAddressOpen(false);
    showToast("New delivery address added to profile");
  };

  // Hive Queries Dictionary
  const hiveQueries = {
    D1: {
      title: "Revenue by Province (September 2026)",
      hql: `SELECT province, \n       SUM(quantity * unit_price) AS total_revenue\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY province\nORDER BY total_revenue DESC;`,
      speedup: "Partition Pruning: skips 11 months of historical CSV splits, reducing read I/O from 24M to 2M rows.",
      results: [
        { col1: "Siem Reap", col2: "$5,175.00", col3: "57.3% share" },
        { col1: "Phnom Penh", col2: "$2,989.50", col3: "33.1% share" },
        { col1: "Battambang", col2: "$862.50", col3: "9.6% share" },
      ],
    },
    D2: {
      title: "Top 5 Customers by Spend (Bucket Join)",
      hql: `SELECT c.customer_id, \n       c.name, \n       c.city, \n       SUM(o.quantity * o.unit_price) AS total_spend\nFROM orders_opt o\nJOIN customers c ON o.customer_id = c.customer_id\nWHERE o.order_month = '2026-09'\nGROUP BY c.customer_id, c.name, c.city\nORDER BY total_spend DESC\nLIMIT 5;`,
      speedup: "Bucketed Map-Side Join: 8 buckets align across orders_opt and customers, eliminating full shuffle cost.",
      results: [
        { col1: "Chenda Som", col2: "$2,625.00", col3: "Siem Reap • VIP Platinum" },
        { col1: "Sokha Meas", col2: "$1,980.00", col3: "Phnom Penh • VIP Gold" },
        { col1: "Piseth Seng", col2: "$1,800.00", col3: "Siem Reap • VIP Gold" },
        { col1: "Dara Sam", col2: "$750.00", col3: "Siem Reap • Silver" },
        { col1: "Sreypov Keo", col2: "$510.00", col3: "Battambang • Silver" },
      ],
    },
    D3: {
      title: "High-Volume Categories (> 1,000 Orders)",
      hql: `SELECT category, \n       COUNT(*) AS order_count\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY category\nHAVING COUNT(*) > 1000\nORDER BY order_count DESC;`,
      speedup: "Predicate Pushdown: Columnar ORC reader inspects Stripe statistics to filter unneeded blocks.",
      results: [
        { col1: "Groceries", col2: "1,245 orders", col3: "Fast Consumables" },
        { col1: "Electronics", col2: "1,080 orders", col3: "High Revenue Margin" },
      ],
    },
    D4: {
      title: "Order Tier Segmentation (CASE WHEN)",
      hql: `SELECT CASE \n         WHEN (quantity * unit_price) > 100 THEN 'high'\n         ELSE 'normal'\n       END AS tier,\n       COUNT(*) AS order_count\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY CASE \n           WHEN (quantity * unit_price) > 100 THEN 'high'\n           ELSE 'normal'\n         END;`,
      speedup: "Lightweight ZLIB Compression: Compressed ORC streams scan at in-memory speeds on Hadoop datanodes.",
      results: [
        { col1: "Normal Tier (≤ $100)", col2: "33 orders", col3: "64.7% of volume" },
        { col1: "High Tier (> $100)", col2: "18 orders", col3: "35.3% of volume" },
      ],
    },
  };

  const copyQueryToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setQueryCopied(true);
    showToast("HiveQL query copied to clipboard", "info");
    setTimeout(() => setQueryCopied(false), 2000);
  };

  const executeHiveQuerySimulation = () => {
    setIsQueryExecuting(true);
    setTimeout(() => {
      setIsQueryExecuting(false);
      showToast(`Query ${activeHiveQuery} completed in 142ms via Tez execution engine!`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f6faf8] text-[#09211a] flex flex-col font-sans selection:bg-[#15c089]/20 selection:text-[#013326]">
      {/* ============================================================ */}
      {/* 1. TOP NAVIGATION BAR */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2eae5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Left: Brand Identity */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#013326] flex items-center justify-center text-white font-bold shadow-md shadow-[#013326]/10 border border-[#0a4636]">
                <Layers className="w-5 h-5 text-[#15c089]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg tracking-tight text-[#013326]">Marketplace</span>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#eafaf4] text-[#0c835c] rounded-full border border-[#9cf0ce]">
                    Polyglot Engine
                  </span>
                </div>
                <p className="text-[12px] text-[#5c7167] font-medium hidden sm:block">
                  MongoDB • Cassandra • Apache Hive
                </p>
              </div>
            </div>

            {/* Center: Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 bg-[#f1f6f3] p-1 rounded-xl border border-[#e2eae5]">
              <button
                onClick={() => setActiveTab("store")}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "store"
                    ? "bg-white text-[#013326] shadow-xs font-bold"
                    : "text-[#5c7167] hover:text-[#013326] hover:bg-white/60"
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#15c089]" />
                <span>Storefront</span>
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-white text-[#013326] shadow-xs font-bold"
                    : "text-[#5c7167] hover:text-[#013326] hover:bg-white/60"
                }`}
              >
                <BarChart3 className="w-4 h-4 text-[#15c089]" />
                <span>Hive Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab("riders")}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "riders"
                    ? "bg-white text-[#013326] shadow-xs font-bold"
                    : "text-[#5c7167] hover:text-[#013326] hover:bg-white/60"
                }`}
              >
                <Truck className="w-4 h-4 text-[#15c089]" />
                <span>Fleet Telemetry</span>
              </button>
              <button
                onClick={() => setActiveTab("customer")}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "customer"
                    ? "bg-white text-[#013326] shadow-xs font-bold"
                    : "text-[#5c7167] hover:text-[#013326] hover:bg-white/60"
                }`}
              >
                <User className="w-4 h-4 text-[#15c089]" />
                <span>Customer CRM</span>
              </button>
            </nav>

            {/* Right: Controls & Cart */}
            <div className="flex items-center space-x-3">
              {/* Currency Toggle */}
              <div className="flex items-center bg-[#f1f6f3] p-1 rounded-lg border border-[#e2eae5] text-xs font-bold">
                <button
                  onClick={() => {
                    setCurrency("USD");
                    showToast("Switched currency to USD ($)", "info");
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    currency === "USD" ? "bg-white text-[#013326] shadow-xs" : "text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  $ USD
                </button>
                <button
                  onClick={() => {
                    setCurrency("KHR");
                    showToast("Switched currency to Khmer Riel (៛)", "info");
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    currency === "KHR" ? "bg-white text-[#013326] shadow-xs" : "text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  ៛ KHR
                </button>
              </div>

              {/* Shopping Cart Pill Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white transition-all shadow-sm group cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#15c089] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold hidden sm:inline">{formatPrice(cartTotalUSD)}</span>
                {cartItemCount > 0 && (
                  <span className="flex items-center justify-center min-w-5 h-5 px-1 bg-[#15c089] text-[#013326] text-[11px] font-black rounded-full shadow-xs animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Sub-bar */}
          <div className="flex md:hidden border-t border-[#e2eae5] py-2 overflow-x-auto space-x-2">
            <button
              onClick={() => setActiveTab("store")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ${
                activeTab === "store" ? "bg-[#013326] text-white" : "bg-[#f1f6f3] text-[#5c7167]"
              }`}
            >
              Storefront
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ${
                activeTab === "analytics" ? "bg-[#013326] text-white" : "bg-[#f1f6f3] text-[#5c7167]"
              }`}
            >
              Hive Analytics
            </button>
            <button
              onClick={() => setActiveTab("riders")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ${
                activeTab === "riders" ? "bg-[#013326] text-white" : "bg-[#f1f6f3] text-[#5c7167]"
              }`}
            >
              Rider Telemetry
            </button>
            <button
              onClick={() => setActiveTab("customer")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ${
                activeTab === "customer" ? "bg-[#013326] text-white" : "bg-[#f1f6f3] text-[#5c7167]"
              }`}
            >
              Customer CRM
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN CONTENT BODY */}
      {/* ============================================================ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ========================================================== */}
        {/* TAB 1: STOREFRONT & CATALOG (MongoDB) */}
        {/* ========================================================== */}
        {activeTab === "store" && (
          <div className="space-y-8">
            {/* Hero Showcase Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-[#013326] text-white p-6 sm:p-10 shadow-elegant border border-[#0a4636]">
              <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#15c089]/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#15c089]/15 border border-[#15c089]/30 text-[#15c089] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Polyglot Persistence • MongoDB Operational Layer</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Distributed E-Commerce Engine
                </h1>
                <p className="text-sm sm:text-base text-[#cad6cf] font-medium leading-relaxed">
                  Polymorphic document schemas support diverse product categories without relational SQL nulls or heavy migrations.
                </p>

                {/* Live System Stats Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-[11px] text-[#cad6cf] font-medium">Monthly Ingest</p>
                    <p className="text-lg font-extrabold text-white">2.0M Orders</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-[11px] text-[#cad6cf] font-medium">Delivery Fleet</p>
                    <p className="text-lg font-extrabold text-[#15c089]">800 Active</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-[11px] text-[#cad6cf] font-medium">GPS Ingest Rate</p>
                    <p className="text-lg font-extrabold text-white">160 /sec</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-[11px] text-[#cad6cf] font-medium">Warehouse Storage</p>
                    <p className="text-lg font-extrabold text-[#15c089]">Hive ORC</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-[#e2eae5] shadow-card">
              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                {["All", "Electronics", "Clothing", "Groceries"].map((cat) => {
                  const count = cat === "All" ? products.length : products.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                        selectedCategory === cat
                          ? "bg-[#013326] text-white shadow-xs"
                          : "bg-[#f1f6f3] text-[#5c7167] hover:bg-[#e2eae5] hover:text-[#013326]"
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          selectedCategory === cat ? "bg-[#15c089] text-[#013326]" : "bg-white text-[#5c7167]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center space-x-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-[#5c7167] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] focus:outline-none focus:ring-2 focus:ring-[#15c089]/40 focus:bg-white transition-all text-[#09211a]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5c7167] hover:text-[#013326]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#09211a] focus:outline-none focus:ring-2 focus:ring-[#15c089]/40 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#e2eae5] shadow-card space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#cad6cf] mx-auto" />
                <h3 className="text-base font-bold text-[#013326]">No products found</h3>
                <p className="text-xs text-[#5c7167]">No items match your search "{searchQuery}"</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="px-4 py-2 rounded-xl bg-[#013326] text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.product_id}
                    className="bg-white rounded-2xl border border-[#e2eae5] shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Card Body */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#f1f6f3] text-[#013326] border border-[#e2eae5]">
                          {product.category}
                        </span>
                        <span className="flex items-center space-x-1 text-[11px] font-semibold text-[#0e9f6e] bg-[#eafaf4] px-2 py-0.5 rounded-full border border-[#9cf0ce]">
                          <Check className="w-3 h-3" />
                          <span>In Stock</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#013326] group-hover:text-[#0f5d49] transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#5c7167] mt-1 font-mono">SKU: {product.product_id}</p>

                      {/* Polymorphic Attributes */}
                      <div className="mt-4 pt-3 border-t border-[#f1f6f3] space-y-1.5">
                        {product.category === "Electronics" && (
                          <div className="flex flex-wrap gap-1.5 text-[11px]">
                            {product.screen_size && (
                              <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                                Screen: {product.screen_size}
                              </span>
                            )}
                            {product.warranty && (
                              <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                                Warranty: {product.warranty}
                              </span>
                            )}
                          </div>
                        )}

                        {product.category === "Clothing" && (
                          <div className="flex flex-wrap gap-1.5 text-[11px]">
                            {product.size && (
                              <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                                Size: {product.size}
                              </span>
                            )}
                            {product.colours && (
                              <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                                Colours: {product.colours.join(", ")}
                              </span>
                            )}
                          </div>
                        )}

                        {product.category === "Groceries" && (
                          <div className="flex flex-wrap gap-1.5 text-[11px]">
                            {product.weight && (
                              <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                                Net: {product.weight}
                              </span>
                            )}
                            {product.expiry_date && (
                              <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                                Exp: {product.expiry_date}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-6 pt-3 bg-[#fafcfb] border-t border-[#f1f6f3] flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-[#5c7167] font-medium">Unit Price</p>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-xl font-extrabold text-[#013326]">
                            {formatPrice(product.price)}
                          </span>
                          {currency === "USD" && (
                            <span className="text-[11px] text-[#5c7167] font-medium">
                              (~៛{Math.round(product.price * KHR_RATE).toLocaleString()})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setQuickViewProduct(product);
                            setQuickViewQty(1);
                          }}
                          className="p-2 rounded-xl bg-white border border-[#e2eae5] text-[#5c7167] hover:text-[#013326] hover:bg-[#f1f6f3] transition-all cursor-pointer"
                          title="Quick View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => addToCart(product)}
                          className="px-4 py-2 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#15c089]" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: HIVE ANALYTICS DASHBOARD (Warehouse & Power BI) */}
        {/* ========================================================== */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Header / Context */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#013326] tracking-tight">
                  Apache Hive Analytics & Warehouse Insights
                </h2>
                <p className="text-sm text-[#5c7167]">
                  Columnar ORC batch queries executed over 2,000,000 monthly orders landed in HDFS /staging/orders/
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#0c835c] bg-[#eafaf4] px-3 py-1.5 rounded-xl border border-[#9cf0ce]">
                <Database className="w-4 h-4 text-[#15c089]" />
                <span>Metastore: Derby Embedded • Engine: Tez / MapReduce</span>
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-[#e2eae5] shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5c7167]">Monthly Ingested Orders</span>
                  <span className="text-[11px] font-bold text-[#0e9f6e] bg-[#eafaf4] px-2 py-0.5 rounded-full">
                    +14.2% MoM
                  </span>
                </div>
                <p className="text-2xl font-black text-[#013326] mt-2">2,000,000</p>
                <p className="text-xs text-[#5c7167] mt-1 font-mono">HDFS /staging/orders/*.csv</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#e2eae5] shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5c7167]">Active Customers</span>
                  <span className="text-[11px] font-bold text-[#15c089] bg-[#eafaf4] px-2 py-0.5 rounded-full">
                    8 Buckets
                  </span>
                </div>
                <p className="text-2xl font-black text-[#013326] mt-2">200,000</p>
                <p className="text-xs text-[#5c7167] mt-1 font-mono">Clustered by customer_id</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#e2eae5] shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5c7167]">September Revenue</span>
                  <span className="text-[11px] font-bold text-[#013326] bg-[#f1f6f3] px-2 py-0.5 rounded-full">
                    Sample Partition
                  </span>
                </div>
                <p className="text-2xl font-black text-[#013326] mt-2">{formatPrice(9027.0)}</p>
                <p className="text-xs text-[#5c7167] mt-1 font-mono">WHERE order_month = '2026-09'</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#e2eae5] shadow-card border-l-4 border-l-[#15c089]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5c7167]">Query Latency Speedup</span>
                  <span className="text-[11px] font-bold text-[#0e9f6e] bg-[#eafaf4] px-2 py-0.5 rounded-full">
                    ORC Pruned
                  </span>
                </div>
                <p className="text-2xl font-black text-[#013326] mt-2">10x – 100x</p>
                <p className="text-xs text-[#5c7167] mt-1 font-mono">Bypasses non-target months</p>
              </div>
            </div>

            {/* Interactive HiveQL Console & Workbench */}
            <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-card space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-[#15c089]" />
                  <h3 className="text-base font-bold text-[#013326]">Interactive HiveQL Console</h3>
                </div>

                {/* Query Selector Tabs */}
                <div className="flex items-center space-x-1.5 bg-[#f1f6f3] p-1 rounded-xl">
                  {(["D1", "D2", "D3", "D4"] as const).map((qKey) => (
                    <button
                      key={qKey}
                      onClick={() => setActiveHiveQuery(qKey)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeHiveQuery === qKey
                          ? "bg-[#013326] text-white shadow-xs"
                          : "text-[#5c7167] hover:text-[#013326]"
                      }`}
                    >
                      Query {qKey}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Query Display & Executor */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Code Block */}
                <div className="bg-[#011c15] text-[#9cf0ce] p-5 rounded-2xl border border-[#0a4636] font-mono text-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[#cad6cf] pb-2 border-b border-[#0a4636]">
                      <span className="font-bold text-white">// {hiveQueries[activeHiveQuery].title}</span>
                      <button
                        onClick={() => copyQueryToClipboard(hiveQueries[activeHiveQuery].hql)}
                        className="text-[#15c089] hover:text-white flex items-center space-x-1 text-[11px] cursor-pointer"
                      >
                        {queryCopied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{queryCopied ? "Copied" : "Copy SQL"}</span>
                      </button>
                    </div>
                    <pre className="overflow-x-auto text-emerald-300 leading-relaxed">
                      {hiveQueries[activeHiveQuery].hql}
                    </pre>
                  </div>

                  <div className="pt-3 border-t border-[#0a4636] flex items-center justify-between">
                    <span className="text-[11px] text-[#cad6cf]">
                      Engine: Hive 3.1.3 on Tez Local
                    </span>
                    <button
                      onClick={executeHiveQuerySimulation}
                      disabled={isQueryExecuting}
                      className="px-3.5 py-1.5 rounded-lg bg-[#15c089] text-[#013326] font-bold text-xs flex items-center space-x-1.5 hover:bg-[#10a374] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isQueryExecuting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Running...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Execute Query</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Query Results & Execution Rationale */}
                <div className="bg-[#fafcfb] p-5 rounded-2xl border border-[#e2eae5] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#013326] uppercase tracking-wider">
                        Query Execution Results
                      </span>
                      <span className="text-[11px] text-[#0e9f6e] font-mono font-bold bg-[#eafaf4] px-2 py-0.5 rounded-full">
                        Status: 200 OK (142 ms)
                      </span>
                    </div>

                    <div className="divide-y divide-[#e2eae5] text-xs">
                      {hiveQueries[activeHiveQuery].results.map((res, i) => (
                        <div key={i} className="py-2.5 flex items-center justify-between">
                          <span className="font-bold text-[#013326]">{res.col1}</span>
                          <span className="font-mono font-bold text-[#013326]">{res.col2}</span>
                          <span className="text-[11px] text-[#5c7167]">{res.col3}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-[#eafaf4] rounded-xl border border-[#9cf0ce] text-xs text-[#0c835c] flex items-start space-x-2">
                    <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{hiveQueries[activeHiveQuery].speedup}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warehouse Architecture Flow Pipeline Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-card space-y-4">
              <h3 className="text-sm font-bold text-[#013326] flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#15c089]" />
                <span>Five-Tier Data Warehouse Pipeline</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  { step: "1. Ingestion", tech: "HDFS CSV", desc: "Raw dumps land at /staging/orders/2026-09.csv" },
                  { step: "2. Staging Layer", tech: "orders_raw", desc: "TextFile table with comma delimiter" },
                  { step: "3. ETL Transformation", tech: "Dynamic Partitions", desc: "Clustered into 8 buckets by customer_id" },
                  { step: "4. Storage Engine", tech: "ORC Format", desc: "ZLIB compression with predicate pushdown" },
                  { step: "5. BI Presentation", tech: "Power BI / HiveQL", desc: "Partition pruning accelerates reporting queries" },
                ].map((item, i) => (
                  <div key={i} className="bg-[#f6faf8] p-3.5 rounded-xl border border-[#e2eae5] flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#5c7167]">{item.step}</span>
                      <h4 className="text-xs font-bold text-[#013326] mt-1">{item.tech}</h4>
                    </div>
                    <p className="text-[11px] text-[#5c7167] mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: FLEET TELEMETRY (Cassandra Stream Simulation) */}
        {/* ========================================================== */}
        {activeTab === "riders" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#013326] tracking-tight">
                  Delivery Fleet Telemetry & Live Stream
                </h2>
                <p className="text-sm text-[#5c7167]">
                  Apache Cassandra column-family storage handling 160 GPS write requests / second (13.8M pings / day)
                </p>
              </div>

              {/* City Filter Pills */}
              <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-[#e2eae5] shadow-xs">
                {["All", "Phnom Penh", "Siem Reap", "Battambang"].map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCityFilter(city)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCityFilter === city
                        ? "bg-[#013326] text-white"
                        : "text-[#5c7167] hover:text-[#013326] hover:bg-[#f1f6f3]"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Cassandra Engine Metrics Banner & Live Terminal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Architecture Info */}
              <div className="lg:col-span-1 bg-[#013326] text-white p-6 rounded-2xl border border-[#0a4636] shadow-card flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#15c089] uppercase tracking-wider">
                    Storage Architecture
                  </span>
                  <h3 className="text-lg font-bold">Apache Cassandra (LSM Tree)</h3>
                  <p className="text-xs text-[#cad6cf] leading-relaxed">
                    Log-structured merge-tree architecture writes sequentially to memory Memtables and disk SSTables, avoiding B-tree page lock bottlenecks.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <div className="bg-white/10 p-3 rounded-xl text-center">
                    <p className="text-[10px] text-[#cad6cf]">Active Fleet</p>
                    <p className="text-lg font-black text-[#15c089]">800 Riders</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl text-center">
                    <p className="text-[10px] text-[#cad6cf]">Daily Volume</p>
                    <p className="text-lg font-black text-white">13.8M Writes</p>
                  </div>
                </div>
              </div>

              {/* Live Streaming Terminal */}
              <div className="lg:col-span-2 bg-[#011c15] text-[#9cf0ce] p-6 rounded-2xl border border-[#0a4636] font-mono text-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#0a4636]">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isTelemetryStreaming ? "bg-[#15c089] animate-pulse" : "bg-slate-500"}`} />
                    <span className="font-bold text-white">Cassandra Live Ingest Stream</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsTelemetryStreaming(!isTelemetryStreaming);
                      showToast(isTelemetryStreaming ? "Paused telemetry stream" : "Resumed live stream", "info");
                    }}
                    className="text-xs text-[#15c089] hover:underline cursor-pointer"
                  >
                    {isTelemetryStreaming ? "Pause Stream" : "Resume Stream"}
                  </button>
                </div>

                <div className="space-y-1.5 overflow-hidden">
                  {telemetryLogs.map((log, idx) => (
                    <div key={idx} className="truncate text-emerald-300">
                      {log}
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#0a4636] text-[11px] text-[#cad6cf] flex justify-between">
                  <span>Throughput: ~160 pings/sec</span>
                  <span>Port: 9042 (Native CQL Protocol)</span>
                </div>
              </div>
            </div>

            {/* Rider Telemetry Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRiders.map((rider) => (
                <div
                  key={rider.id}
                  className="bg-white rounded-2xl p-5 border border-[#e2eae5] shadow-card space-y-4 hover:shadow-hover transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#013326]">{rider.name}</h4>
                      <p className="text-[11px] text-[#5c7167] font-mono">ID: {rider.id}</p>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        rider.status === "Delivering"
                          ? "bg-[#eafaf4] text-[#0c835c] border border-[#9cf0ce]"
                          : rider.status === "Picked Up"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {rider.status}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#f1f6f3] text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5c7167]">Zone:</span>
                      <span className="font-semibold text-[#013326]">{rider.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5c7167]">Current Speed:</span>
                      <span className="font-semibold font-mono text-[#013326]">{rider.speed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#5c7167]">Battery:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-[#f1f6f3] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${rider.battery > 65 ? "bg-[#15c089]" : "bg-amber-500"}`}
                            style={{ width: `${rider.battery}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-[#013326]">{rider.battery}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f6faf8] px-3 py-2 rounded-xl text-[11px] font-mono text-[#5c7167] flex items-center justify-between border border-[#e2eae5]">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#15c089]" />
                      <span>{rider.lat}</span>
                    </span>
                    <span>{rider.lng}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: CUSTOMER CRM (MongoDB Document Model) */}
        {/* ========================================================== */}
        {activeTab === "customer" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#013326] tracking-tight">
                  Customer Profile & Document Model
                </h2>
                <p className="text-sm text-[#5c7167]">
                  MongoDB customer record demonstrating embedding vs referencing engineering decisions
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsAddAddressOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#013326] text-white text-xs font-bold hover:bg-[#0a4636] transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#15c089]" />
                  <span>Add Address</span>
                </button>
                <button
                  onClick={() => setShowJsonSchema(!showJsonSchema)}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-[#e2eae5] text-xs font-bold text-[#013326] hover:bg-[#f1f6f3] transition-all shadow-xs cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-[#15c089]" />
                  <span>{showJsonSchema ? "Hide JSON Schema" : "View JSON Document"}</span>
                </button>
              </div>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#013326] text-white flex items-center justify-center text-xl font-bold border border-[#0a4636]">
                    SM
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-[#013326]">{customer.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eafaf4] text-[#0c835c] border border-[#9cf0ce]">
                        {customer.tier}
                      </span>
                    </div>
                    <p className="text-xs text-[#5c7167] font-mono mt-0.5">Customer ID: {customer._id} • {customer.phone}</p>
                  </div>
                </div>

                <div className="bg-[#f6faf8] px-5 py-3 rounded-xl border border-[#e2eae5] text-right">
                  <p className="text-[11px] text-[#5c7167] font-semibold">Loyalty Rewards</p>
                  <p className="text-xl font-black text-[#013326]">{customer.loyalty_points} Points</p>
                </div>
              </div>

              {/* Delivery Addresses Section (Embedded) */}
              <div className="space-y-3 pt-4 border-t border-[#f1f6f3]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#013326]">
                      Delivery Addresses (Embedded Array)
                    </h4>
                    <p className="text-[11px] text-[#5c7167]">
                      Embedded inside customer document for single-read retrieval on checkout
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {customer.addresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-[#e2eae5] bg-[#fafcfb] space-y-1 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#013326] flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-[#15c089]" />
                          <span>{addr.label}</span>
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-[#0c835c] bg-[#eafaf4] px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5c7167]">{addr.street}</p>
                      <p className="text-xs font-semibold text-[#013326]">{addr.city}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Orders Section (Referenced) */}
              <div className="space-y-3 pt-4 border-t border-[#f1f6f3]">
                <div>
                  <h4 className="text-sm font-bold text-[#013326]">
                    Order History (Referenced IDs)
                  </h4>
                  <p className="text-[11px] text-[#5c7167]">
                    Referenced IDs avoid document bloat and respect MongoDB's 16MB document size limit
                  </p>
                </div>

                <div className="divide-y divide-[#f1f6f3] border border-[#e2eae5] rounded-xl overflow-hidden">
                  {customer.past_orders.map((ord) => (
                    <div key={ord.id} className="p-3.5 bg-white flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#013326]">Order #{ord.id}</span>
                          <span className="text-[11px] text-[#5c7167]">{ord.date}</span>
                        </div>
                        <p className="text-[#5c7167] text-[11px]">{ord.items}</p>
                      </div>
                      <div className="text-right space-y-0.5">
                        <p className="font-mono font-bold text-[#013326]">{formatPrice(ord.total)}</p>
                        <span className="text-[10px] font-bold text-[#0c835c] bg-[#eafaf4] px-1.5 py-0.5 rounded">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Raw JSON Schema View */}
            {showJsonSchema && (
              <div className="bg-[#011c15] text-[#9cf0ce] p-6 rounded-2xl font-mono text-xs overflow-x-auto border border-[#0a4636] space-y-2">
                <p className="text-white font-bold">// MongoDB Customer Document: db.customers.findOne(&#123; _id: "C0457" &#125;)</p>
                <pre>{JSON.stringify(customer, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* 3. PRODUCT QUICK VIEW MODAL */}
      {/* ============================================================ */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setQuickViewProduct(null)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e2eae5] space-y-5 z-10">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#f1f6f3] text-[#013326]">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-lg font-bold text-[#013326] mt-2">{quickViewProduct.name}</h3>
                <p className="text-xs text-[#5c7167] font-mono">SKU: {quickViewProduct.product_id}</p>
              </div>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="p-2 rounded-xl text-[#5c7167] hover:bg-[#f1f6f3] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-[#5c7167] leading-relaxed">
              {quickViewProduct.description || "High-quality marketplace inventory item backed by verified distributor warranty."}
            </p>

            {/* Polymorphic Specs Table */}
            <div className="bg-[#f6faf8] p-4 rounded-xl border border-[#e2eae5] space-y-2 text-xs">
              <span className="font-bold text-[#013326] text-[11px] uppercase tracking-wider">
                MongoDB Document Attributes
              </span>
              {quickViewProduct.screen_size && (
                <div className="flex justify-between">
                  <span className="text-[#5c7167]">Display Size:</span>
                  <span className="font-semibold text-[#013326]">{quickViewProduct.screen_size}</span>
                </div>
              )}
              {quickViewProduct.warranty && (
                <div className="flex justify-between">
                  <span className="text-[#5c7167]">Warranty Coverage:</span>
                  <span className="font-semibold text-[#013326]">{quickViewProduct.warranty}</span>
                </div>
              )}
              {quickViewProduct.size && (
                <div className="flex justify-between">
                  <span className="text-[#5c7167]">Size:</span>
                  <span className="font-semibold text-[#013326]">{quickViewProduct.size}</span>
                </div>
              )}
              {quickViewProduct.colours && (
                <div className="flex justify-between">
                  <span className="text-[#5c7167]">Available Colours:</span>
                  <span className="font-semibold text-[#013326]">{quickViewProduct.colours.join(", ")}</span>
                </div>
              )}
              {quickViewProduct.weight && (
                <div className="flex justify-between">
                  <span className="text-[#5c7167]">Net Weight:</span>
                  <span className="font-semibold text-[#013326]">{quickViewProduct.weight}</span>
                </div>
              )}
              {quickViewProduct.expiry_date && (
                <div className="flex justify-between">
                  <span className="text-[#5c7167]">Expiry Date:</span>
                  <span className="font-semibold text-[#013326]">{quickViewProduct.expiry_date}</span>
                </div>
              )}
            </div>

            {/* Price & Quantity Adder */}
            <div className="pt-3 border-t border-[#f1f6f3] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#5c7167]">Total Price</p>
                <p className="text-xl font-extrabold text-[#013326]">
                  {formatPrice(quickViewProduct.price * quickViewQty)}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-[#f1f6f3] p-1 rounded-xl">
                  <button
                    onClick={() => setQuickViewQty(Math.max(1, quickViewQty - 1))}
                    className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#013326] shadow-xs cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-[#013326]">{quickViewQty}</span>
                  <button
                    onClick={() => setQuickViewQty(quickViewQty + 1)}
                    className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#013326] shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    addToCart(quickViewProduct, quickViewQty);
                    setQuickViewProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#15c089]" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. ADD ADDRESS MODAL */}
      {/* ============================================================ */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddAddressOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e2eae5] space-y-4 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2eae5]">
              <h3 className="text-base font-bold text-[#013326]">Add Delivery Address</h3>
              <button
                onClick={() => setIsAddAddressOpen(false)}
                className="p-1.5 rounded-lg text-[#5c7167] hover:bg-[#f1f6f3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#013326] mb-1">Address Label</label>
                <input
                  type="text"
                  placeholder="e.g. Warehouse, Studio"
                  value={newAddressLabel}
                  onChange={(e) => setNewAddressLabel(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] focus:outline-none focus:ring-2 focus:ring-[#15c089]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#013326] mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. Street 310, Sangkat BKK1"
                  value={newAddressStreet}
                  onChange={(e) => setNewAddressStreet(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] focus:outline-none focus:ring-2 focus:ring-[#15c089]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#013326] mb-1">City / Province</label>
                <select
                  value={newAddressCity}
                  onChange={(e) => setNewAddressCity(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] focus:outline-none focus:ring-2 focus:ring-[#15c089]/40"
                >
                  <option value="Phnom Penh">Phnom Penh</option>
                  <option value="Siem Reap">Siem Reap</option>
                  <option value="Battambang">Battambang</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Save to MongoDB Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. SLIDE-OVER SHOPPING CART DRAWER */}
      {/* ============================================================ */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#e2eae5] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#15c089]" />
                  <h3 className="text-base font-bold text-[#013326]">Your Cart ({cartItemCount})</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl text-[#5c7167] hover:bg-[#f1f6f3] hover:text-[#013326] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-[#5c7167]">
                    <ShoppingBag className="w-12 h-12 text-[#cad6cf]" />
                    <p className="text-sm font-semibold">Your shopping cart is empty</p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setActiveTab("store");
                      }}
                      className="text-xs font-bold text-[#013326] underline"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.product_id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-[#e2eae5] bg-[#fafcfb]"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[#013326]">{item.product.name}</h4>
                        <p className="text-xs font-mono font-semibold text-[#5c7167]">
                          {formatPrice(item.product.price)} each
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQty(item.product.product_id, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#e2eae5] flex items-center justify-center text-[#013326] hover:bg-[#f1f6f3] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#013326]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.product.product_id, 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#e2eae5] flex items-center justify-center text-[#013326] hover:bg-[#f1f6f3] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer & Checkout Action */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-[#e2eae5] bg-[#fafcfb] space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[#5c7167]">
                      <span>Subtotal</span>
                      <span className="font-mono font-bold text-[#013326]">{formatPrice(cartTotalUSD)}</span>
                    </div>
                    <div className="flex justify-between text-[#5c7167]">
                      <span>Express Delivery</span>
                      <span className="font-mono font-bold text-[#013326]">
                        {deliveryFeeUSD === 0 ? "FREE" : formatPrice(deliveryFeeUSD)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-[#013326] pt-2 border-t border-[#e2eae5]">
                      <span>Total Due</span>
                      <div className="text-right">
                        <div>{formatPrice(finalTotalUSD)}</div>
                        {currency === "USD" && (
                          <div className="text-[11px] font-normal text-[#5c7167]">
                            (~៛{Math.round(finalTotalUSD * KHR_RATE).toLocaleString()})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                      setIsCheckoutSuccess(false);
                      setCountdown(180);
                    }}
                    className="w-full py-3 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#15c089]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. BAKONG KHQR CHECKOUT MODAL */}
      {/* ============================================================ */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsCheckoutOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e2eae5] space-y-6 z-10 max-h-[90vh] overflow-y-auto">
            {!isCheckoutSuccess ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-[#e2eae5]">
                  <div>
                    <h3 className="text-lg font-bold text-[#013326]">Complete Payment</h3>
                    <p className="text-xs text-[#5c7167]">Instant settlement with Bakong KHQR or Cash on Delivery</p>
                  </div>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="p-2 rounded-xl text-[#5c7167] hover:bg-[#f1f6f3] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Payment Method Selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedPayment("khqr")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedPayment === "khqr"
                        ? "bg-[#013326] text-white border-[#013326]"
                        : "bg-[#f1f6f3] text-[#5c7167] border-[#e2eae5]"
                    }`}
                  >
                    Bakong KHQR
                  </button>
                  <button
                    onClick={() => setSelectedPayment("cod")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedPayment === "cod"
                        ? "bg-[#013326] text-white border-[#013326]"
                        : "bg-[#f1f6f3] text-[#5c7167] border-[#e2eae5]"
                    }`}
                  >
                    Cash (COD)
                  </button>
                  <button
                    onClick={() => setSelectedPayment("card")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedPayment === "card"
                        ? "bg-[#013326] text-white border-[#013326]"
                        : "bg-[#f1f6f3] text-[#5c7167] border-[#e2eae5]"
                    }`}
                  >
                    Card
                  </button>
                </div>

                {/* KHQR Card View */}
                {selectedPayment === "khqr" && (
                  <div className="bg-[#e02020] rounded-2xl p-4 text-white shadow-md space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-black tracking-widest uppercase">KHQR</span>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Bakong</span>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-md">
                        {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
                      </span>
                    </div>

                    {/* QR Code Container */}
                    <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center space-y-3 text-slate-900">
                      <div className="w-44 h-44 bg-slate-900 rounded-lg p-2 flex items-center justify-center relative shadow-inner">
                        {/* Authentic QR grid pattern simulation */}
                        <div className="w-full h-full bg-white rounded p-2 flex flex-col justify-between">
                          <div className="flex justify-between">
                            <div className="w-8 h-8 bg-slate-900 rounded-xs flex items-center justify-center">
                              <div className="w-4 h-4 bg-white rounded-xs flex items-center justify-center">
                                <div className="w-2 h-2 bg-slate-900" />
                              </div>
                            </div>
                            <div className="w-8 h-8 bg-slate-900 rounded-xs flex items-center justify-center">
                              <div className="w-4 h-4 bg-white rounded-xs flex items-center justify-center">
                                <div className="w-2 h-2 bg-slate-900" />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-center py-2">
                            <div className="w-6 h-6 rounded-full bg-[#e02020] text-white flex items-center justify-center text-[10px] font-black">
                              ៛
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <div className="w-8 h-8 bg-slate-900 rounded-xs flex items-center justify-center">
                              <div className="w-4 h-4 bg-white rounded-xs flex items-center justify-center">
                                <div className="w-2 h-2 bg-slate-900" />
                              </div>
                            </div>
                            <div className="w-8 h-8 grid grid-cols-2 gap-1 p-1">
                              <div className="bg-slate-900 rounded-xs" />
                              <div className="bg-slate-900 rounded-xs" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center space-y-0.5">
                        <p className="text-xs font-bold text-[#013326]">MARKETPLACE COMMERCE STORE</p>
                        <p className="text-base font-black text-[#013326] font-mono">
                          {formatPrice(finalTotalUSD)}
                        </p>
                        <p className="text-[11px] text-[#5c7167]">Scan with ABA Mobile, Wing, or ACLEDA</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Address Review */}
                <div className="bg-[#f6faf8] p-3.5 rounded-xl border border-[#e2eae5] text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#013326]">
                    <span>Delivering to: {customer.name}</span>
                    <span className="text-[#0c835c]">Default Address</span>
                  </div>
                  <p className="text-[#5c7167]">
                    {customer.addresses.find((a) => a.isDefault)?.street || customer.addresses[0]?.street}
                  </p>
                </div>

                {/* Confirm Action Button */}
                <button
                  onClick={handleSimulatePayment}
                  className="w-full py-3.5 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#15c089]" />
                  <span>Simulate Successful Payment ({formatPrice(finalTotalUSD)})</span>
                </button>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#eafaf4] text-[#0c835c] flex items-center justify-center mx-auto border border-[#9cf0ce]">
                  <CheckCircle2 className="w-8 h-8 text-[#15c089]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#013326]">Payment Confirmed!</h3>
                  <p className="text-xs text-[#5c7167]">
                    Your order has been recorded into the MongoDB database and queued for Cassandra rider dispatch.
                  </p>
                </div>
                <div className="bg-[#f6faf8] p-4 rounded-xl border border-[#e2eae5] text-xs font-mono text-[#013326] inline-block">
                  Tracking Code: <strong>ORD-2026-9042</strong>
                </div>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setCart([]);
                    setActiveTab("customer");
                  }}
                  className="w-full py-3 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  View in Customer CRM
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. TOAST NOTIFICATION STACK */}
      {/* ============================================================ */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#013326] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#0a4636] text-xs font-semibold flex items-center space-x-2 animate-bounce-subtle"
          >
            <CheckCircle2 className="w-4 h-4 text-[#15c089]" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* 8. FOOTER */}
      {/* ============================================================ */}
      <footer className="mt-auto border-t border-[#e2eae5] bg-white py-6 text-center text-xs text-[#5c7167]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#013326]">Marketplace</span>
            <span>•</span>
            <span>Polyglot E-Commerce Data Platform</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Next.js 15</span>
            <span>•</span>
            <span>MongoDB 8.0</span>
            <span>•</span>
            <span>Cassandra LSM</span>
            <span>•</span>
            <span>Apache Hive 3.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
