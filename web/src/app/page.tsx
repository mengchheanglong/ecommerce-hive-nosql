"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingBag,
  Store,
  LayoutDashboard,
  Package,
  Truck,
  Database,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  X,
  CreditCard,
  Sparkles,
  Search,
  Filter,
  BarChart3,
  Activity,
  Code2,
  ChevronRight,
  Plus,
  Minus,
  Check,
  RefreshCw,
  Info,
  DollarSign,
  Eye,
  Play,
  Terminal,
  Copy,
  CheckCheck,
  User,
  Trash2,
  Share2,
  SlidersHorizontal,
  MapPin,
  CheckCircle2
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

interface OrderRecord {
  order_id: string;
  customer_id: string;
  customer_name: string;
  items: Array<{ product_id: string; name: string; quantity: number; price: number }>;
  total: number;
  province: string;
  payment_method: string;
  status: string;
  created_at: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

export default function MarketplaceApp() {
  // Mode Switcher: "customer" (Consumer Storefront) vs "merchant" (Operations & Warehouse Portal)
  const [portalMode, setPortalMode] = useState<"customer" | "merchant">("customer");

  // Customer Navigation Subtabs
  const [customerTab, setCustomerTab] = useState<"shop" | "orders" | "profile">("shop");

  // Merchant Navigation Subtabs
  const [merchantTab, setMerchantTab] = useState<"inventory" | "orders" | "fleet" | "referrals" | "warehouse">("inventory");

  // Products State (Loaded from /api/products)
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Orders State (Loaded from /api/orders)
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Filter & Search Controls
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "low" | "high">("featured");
  const [currency, setCurrency] = useState<"USD" | "KHR">("USD");

  // Shopping Cart & Checkout
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"khqr" | "cod" | "card">("khqr");
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [countdown, setCountdown] = useState(180);

  // Modals State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Telemetry Streaming State (Cassandra)
  const [isTelemetryStreaming, setIsTelemetryStreaming] = useState(true);
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("All");
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    "[Cassandra LSM] Cluster connected on 9042. Token partitioner active.",
    "[Cassandra LSM] Table telemetry_ks.rider_gps_pings initialized (TTL 30 days).",
  ]);

  // Hive Workbench State
  const [activeHiveQuery, setActiveHiveQuery] = useState<"D1" | "D2" | "D3" | "D4">("D1");
  const [isQueryExecuting, setIsQueryExecuting] = useState(false);
  const [queryCopied, setQueryCopied] = useState(false);

  // Form State for Adding New Product (Merchant CRUD)
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Electronics");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdScreen, setNewProdScreen] = useState("");
  const [newProdWarranty, setNewProdWarranty] = useState("");
  const [newProdSize, setNewProdSize] = useState("");
  const [newProdColours, setNewProdColours] = useState("");
  const [newProdWeight, setNewProdWeight] = useState("");
  const [newProdExpiry, setNewProdExpiry] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");

  // Customer Profile State
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
  });

  // New Address Form
  const [newAddrLabel, setNewAddrLabel] = useState("");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("Phnom Penh");

  // Exchange rate
  const KHR_RATE = 4100;

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Fetch Products from MongoDB
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch Orders from MongoDB
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Countdown timer for KHQR
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCheckoutOpen && selectedPayment === "khqr" && countdown > 0 && !isCheckoutSuccess) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isCheckoutOpen, selectedPayment, countdown, isCheckoutSuccess]);

  // Telemetry stream
  useEffect(() => {
    if (!isTelemetryStreaming || portalMode !== "merchant" || merchantTab !== "fleet") return;

    const interval = setInterval(() => {
      const riderIds = ["R-101", "R-102", "R-103", "R-201", "R-202", "R-301", "R-302"];
      const randomRider = riderIds[Math.floor(Math.random() * riderIds.length)];
      const randomSpeed = Math.floor(18 + Math.random() * 20);
      const timeStr = new Date().toTimeString().slice(0, 8);
      const newLog = `[Cassandra LSM] INSERT INTO rider_gps_pings (rider_id, ping_time, speed) VALUES ('${randomRider}', '${timeStr}', '${randomSpeed} km/h');`;

      setTelemetryLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isTelemetryStreaming, portalMode, merchantTab]);

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

  // Filtered products
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

  // Handle Checkout Submission (writes to MongoDB /api/orders)
  const handleSimulatePayment = async () => {
    const newOrderPayload = {
      order_id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customer_id: customer._id,
      customer_name: customer.name,
      items: cart.map((i) => ({
        product_id: i.product.product_id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
      })),
      total: finalTotalUSD,
      province: customer.addresses[0]?.city || "Phnom Penh",
      payment_method: selectedPayment === "khqr" ? "Bakong KHQR" : selectedPayment === "cod" ? "Cash (COD)" : "Card",
      status: "Preparing",
      delivery_address: customer.addresses[0]?.street || "Street 271, Phnom Penh",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrderPayload),
      });
      const data = await res.json();
      if (data.success) {
        setIsCheckoutSuccess(true);
        setCustomer((prev) => ({
          ...prev,
          loyalty_points: prev.loyalty_points + Math.floor(finalTotalUSD),
        }));
        fetchOrders();
        showToast(`Order #${newOrderPayload.order_id} recorded in MongoDB!`);
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      setIsCheckoutSuccess(true);
    }
  };

  // Handle Create Product (Merchant POST to MongoDB)
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const payload: any = {
      name: newProdName,
      category: newProdCategory,
      price: parseFloat(newProdPrice),
      description: newProdDesc || undefined,
      status: "active",
    };

    if (newProdCategory === "Electronics") {
      if (newProdScreen) payload.screen_size = newProdScreen;
      if (newProdWarranty) payload.warranty = newProdWarranty;
    } else if (newProdCategory === "Clothing") {
      if (newProdSize) payload.size = newProdSize;
      if (newProdColours) payload.colours = newProdColours.split(",").map((c) => c.trim());
    } else if (newProdCategory === "Groceries") {
      if (newProdWeight) payload.weight = newProdWeight;
      if (newProdExpiry) payload.expiry_date = newProdExpiry;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Product "${newProdName}" created in MongoDB!`);
        setIsAddProductOpen(false);
        // Reset form
        setNewProdName("");
        setNewProdPrice("");
        setNewProdScreen("");
        setNewProdWarranty("");
        setNewProdSize("");
        setNewProdColours("");
        setNewProdWeight("");
        setNewProdExpiry("");
        setNewProdDesc("");
        fetchProducts();
      }
    } catch (err) {
      console.error("Product creation failed:", err);
      showToast("Failed to create product in MongoDB", "error");
    }
  };

  // Handle Delete Product (Merchant DELETE from MongoDB)
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}" from the catalog?`)) return;

    try {
      const res = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Product "${productName}" deleted from MongoDB`);
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("Error deleting product", "error");
    }
  };

  // Handle Order Status Update (Merchant PUT to MongoDB)
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order ${orderId} updated to "${newStatus}"`);
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  // Handle Add Address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel || !newAddrStreet) return;

    setCustomer((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        { label: newAddrLabel, street: newAddrStreet, city: newAddrCity, isDefault: false },
      ],
    }));
    setNewAddrLabel("");
    setNewAddrStreet("");
    setIsAddAddressOpen(false);
    showToast("Address added to customer profile");
  };

  // Hive Queries Dictionary
  const hiveQueries = {
    D1: {
      title: "Revenue by Province (September 2026)",
      hql: `SELECT province, \n       SUM(quantity * unit_price) AS total_revenue\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY province\nORDER BY total_revenue DESC;`,
      speedup: "Partition Pruning: skips non-target HDFS folders, reducing scanned data by over 90%.",
      results: [
        { col1: "Siem Reap", col2: "$5,175.00", col3: "57.3% share" },
        { col1: "Phnom Penh", col2: "$2,989.50", col3: "33.1% share" },
        { col1: "Battambang", col2: "$862.50", col3: "9.6% share" },
      ],
    },
    D2: {
      title: "Top 5 Customers by Spend (Bucket Map-Join)",
      hql: `SELECT c.customer_id, \n       c.name, \n       c.city, \n       SUM(o.quantity * o.unit_price) AS total_spend\nFROM orders_opt o\nJOIN customers c ON o.customer_id = c.customer_id\nWHERE o.order_month = '2026-09'\nGROUP BY c.customer_id, c.name, c.city\nORDER BY total_spend DESC\nLIMIT 5;`,
      speedup: "Bucket Map-Side Join: 8 aligned hash buckets eliminate shuffle overhead across worker datanodes.",
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
      speedup: "Predicate Pushdown: Columnar ORC reader inspects Stripe statistics to skip unneeded blocks.",
      results: [
        { col1: "Groceries", col2: "1,245 orders", col3: "Fast Consumables" },
        { col1: "Electronics", col2: "1,080 orders", col3: "High Revenue Margin" },
      ],
    },
    D4: {
      title: "Order Tier Segmentation (CASE WHEN)",
      hql: `SELECT CASE \n         WHEN (quantity * unit_price) > 100 THEN 'high'\n         ELSE 'normal'\n       END AS tier,\n       COUNT(*) AS order_count\nFROM orders_opt\nWHERE order_month = '2026-09'\nGROUP BY CASE \n           WHEN (quantity * unit_price) > 100 THEN 'high'\n           ELSE 'normal'\n         END;`,
      speedup: "Lightweight ZLIB Compression: High-compression ORC reads bypass disk I/O bottlenecks.",
      results: [
        { col1: "Normal Tier (≤ $100)", col2: "33 orders", col3: "64.7% volume" },
        { col1: "High Tier (> $100)", col2: "18 orders", col3: "35.3% volume" },
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
      showToast(`Query ${activeHiveQuery} executed in 142ms via Tez local engine!`);
    }, 600);
  };

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

  return (
    <div className="min-h-screen bg-[#f6faf8] text-[#09211a] flex flex-col font-sans selection:bg-[#15c089]/20 selection:text-[#013326]">
      {/* ============================================================ */}
      {/* TOP HEADER: BRAND + PORTAL MODE SWITCHER */}
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
                    Microservices
                  </span>
                </div>
                <p className="text-[12px] text-[#5c7167] font-medium hidden sm:block">
                  Polyglot NoSQL • Apache Hive Warehouse
                </p>
              </div>
            </div>

            {/* Center: DOMAIN PORTAL SWITCHER (Separates Customer from Merchant) */}
            <div className="flex items-center bg-[#f1f6f3] p-1 rounded-2xl border border-[#e2eae5] shadow-inner">
              <button
                onClick={() => {
                  setPortalMode("customer");
                  showToast("Switched to Customer Storefront", "info");
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  portalMode === "customer"
                    ? "bg-[#013326] text-white shadow-sm"
                    : "text-[#5c7167] hover:text-[#013326]"
                }`}
              >
                <Store className="w-3.5 h-3.5 text-[#15c089]" />
                <span>Storefront</span>
              </button>

              <button
                onClick={() => {
                  setPortalMode("merchant");
                  showToast("Switched to Merchant Operations Portal", "info");
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  portalMode === "merchant"
                    ? "bg-[#013326] text-white shadow-sm"
                    : "text-[#5c7167] hover:text-[#013326]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#15c089]" />
                <span>Merchant Portal</span>
              </button>
            </div>

            {/* Right: Currency & Cart / Account */}
            <div className="flex items-center space-x-3">
              {/* Currency Toggle */}
              <div className="flex items-center bg-[#f1f6f3] p-1 rounded-lg border border-[#e2eae5] text-xs font-bold">
                <button
                  onClick={() => {
                    setCurrency("USD");
                    showToast("Currency set to USD ($)", "info");
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
                    showToast("Currency set to Khmer Riel (៛)", "info");
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    currency === "KHR" ? "bg-white text-[#013326] shadow-xs" : "text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  ៛ KHR
                </button>
              </div>

              {/* Cart Button (Always visible for quick checkout) */}
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

          {/* Sub-Navigation Ribbon (Adapts strictly to selected Portal Mode) */}
          <div className="border-t border-[#e2eae5] py-2 flex items-center justify-between overflow-x-auto text-xs">
            {portalMode === "customer" ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCustomerTab("shop")}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    customerTab === "shop" ? "bg-[#013326] text-white" : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  🛍️ Catalog & Shop
                </button>
                <button
                  onClick={() => setCustomerTab("orders")}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    customerTab === "orders" ? "bg-[#013326] text-white" : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  📦 My Orders & Tracking
                </button>
                <button
                  onClick={() => setCustomerTab("profile")}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    customerTab === "profile" ? "bg-[#013326] text-white" : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  👤 Account & Addresses
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMerchantTab("inventory")}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    merchantTab === "inventory" ? "bg-[#013326] text-white" : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  📦 Inventory (MongoDB CRUD)
                </button>
                <button
                  onClick={() => setMerchantTab("orders")}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    merchantTab === "orders" ? "bg-[#013326] text-white" : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  📋 Orders & Fulfillment
                </button>
                <button
                  onClick={() => setMerchantTab("fleet")}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    merchantTab === "fleet" ? "bg-[#013326] text-white" : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  🛵 Fleet Telemetry (Cassandra)
                </button>
                <button
                  onClick={() => setMerchantTab("referrals")}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    merchantTab === "referrals" ? "bg-[#013326] text-white" : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  🤝 Referral Network (Neo4j)
                </button>
                <button
                  onClick={() => setMerchantTab("warehouse")}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    merchantTab === "warehouse" ? "bg-[#013326] text-white" : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  📊 Hive Warehouse (OLAP)
                </button>
              </div>
            )}

            <div className="hidden lg:flex items-center space-x-3 text-[11px] font-semibold">
              <div className="flex items-center space-x-1.5 text-[#0c835c]">
                <span className="w-2 h-2 rounded-full bg-[#15c089] animate-ping" />
                <span>Services Active • Polyglot Ready</span>
              </div>
              <a
                href="http://localhost:4000/api/docs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100/90 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 font-mono text-[11px] font-semibold transition-colors shadow-xs"
                title="View NestJS Swagger OpenAPI Documentation"
              >
                <span>NestJS API Docs</span>
                <span className="text-[9px]">↗</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MAIN CONTAINER */}
      {/* ============================================================ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ========================================================== */}
        {/* DOMAIN 1: CUSTOMER FACING STOREFRONT */}
        {/* ========================================================== */}
        {portalMode === "customer" && (
          <div className="space-y-8">
            {/* 1.1 Customer Shop View */}
            {customerTab === "shop" && (
              <div className="space-y-8">
                {/* Hero Showcase Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-[#013326] text-white p-6 sm:p-10 shadow-elegant border border-[#0a4636]">
                  <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#15c089]/10 blur-3xl pointer-events-none" />
                  <div className="relative z-10 max-w-2xl space-y-3">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#15c089]/15 border border-[#15c089]/30 text-[#15c089] text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Polyglot E-Commerce Marketplace</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                      Modern Consumer Storefront
                    </h1>
                    <p className="text-sm sm:text-base text-[#cad6cf] font-medium leading-relaxed">
                      Instant delivery across Phnom Penh, Siem Reap, and Battambang with seamless Bakong KHQR checkout.
                    </p>
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

                  {/* Search & Sort */}
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-[#5c7167] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search products..."
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

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-[#e2eae5] shadow-card space-y-3">
                    <ShoppingBag className="w-12 h-12 text-[#cad6cf] mx-auto" />
                    <h3 className="text-base font-bold text-[#013326]">No products found</h3>
                    <p className="text-xs text-[#5c7167]">No catalog items match your search criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.product_id}
                        className="bg-white rounded-2xl border border-[#e2eae5] shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                      >
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

                          {/* Category-Specific Specs */}
                          <div className="mt-4 pt-3 border-t border-[#f1f6f3] space-y-1.5">
                            {product.category === "Electronics" && (
                              <div className="flex flex-wrap gap-1.5 text-[11px]">
                                {product.screen_size && (
                                  <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                                    Display: {product.screen_size}
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

                        <div className="p-6 pt-3 bg-[#fafcfb] border-t border-[#f1f6f3] flex items-center justify-between">
                          <div>
                            <p className="text-[11px] text-[#5c7167] font-medium">Price</p>
                            <span className="text-xl font-extrabold text-[#013326]">
                              {formatPrice(product.price)}
                            </span>
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

            {/* 1.2 Customer Orders View */}
            {customerTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#013326]">My Orders & Delivery Tracking</h2>
                    <p className="text-xs text-[#5c7167]">Live tracking for orders placed across Cambodia</p>
                  </div>
                  <span className="px-3 py-1 bg-[#eafaf4] text-[#0c835c] text-xs font-bold rounded-xl border border-[#9cf0ce]">
                    {orders.length} Total Orders
                  </span>
                </div>

                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.order_id}
                      className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-card space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#f1f6f3] pb-4">
                        <div className="flex items-center space-x-3">
                          <Package className="w-5 h-5 text-[#15c089]" />
                          <div>
                            <span className="text-sm font-bold text-[#013326]">{ord.order_id}</span>
                            <p className="text-[11px] text-[#5c7167]">Placed on {new Date(ord.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              ord.status === "Delivered"
                                ? "bg-[#eafaf4] text-[#0c835c] border border-[#9cf0ce]"
                                : ord.status === "Out for Delivery"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {ord.status}
                          </span>
                          <span className="text-base font-black text-[#013326] font-mono">
                            {formatPrice(ord.total)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 text-xs">
                        <p className="font-semibold text-[#5c7167]">Ordered Items:</p>
                        <div className="bg-[#f6faf8] p-3 rounded-xl border border-[#e2eae5] space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-[#013326]">{it.name} (x{it.quantity})</span>
                              <span className="font-mono text-[#5c7167]">{formatPrice(it.price * it.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#5c7167] pt-2">
                        <span>Payment: <strong>{ord.payment_method}</strong></span>
                        <span>Delivery Zone: <strong>{ord.province}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1.3 Customer Account View */}
            {customerTab === "profile" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-card space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#013326] text-white flex items-center justify-center text-xl font-bold">
                      SM
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#013326]">{customer.name}</h3>
                      <p className="text-xs text-[#5c7167]">Customer ID: {customer._id} • {customer.phone}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eafaf4] text-[#0c835c]">
                        {customer.tier} ({customer.loyalty_points} Points)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#f1f6f3]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#013326]">Saved Delivery Addresses</h4>
                      <button
                        onClick={() => setIsAddAddressOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-[#013326] text-white text-xs font-bold hover:bg-[#0a4636] flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#15c089]" />
                        <span>Add Address</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {customer.addresses.map((addr, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-[#e2eae5] bg-[#fafcfb] space-y-1">
                          <div className="flex justify-between items-center">
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
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* DOMAIN 2: MERCHANT & OPERATIONS DASHBOARD */}
        {/* ========================================================== */}
        {portalMode === "merchant" && (
          <div className="space-y-8">
            {/* 2.1 Merchant Inventory CRUD */}
            {merchantTab === "inventory" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#013326]">Product Catalog Management (MongoDB CRUD)</h2>
                    <p className="text-xs text-[#5c7167]">Direct operational document read, insert, and delete operations</p>
                  </div>
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold flex items-center space-x-2 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#15c089]" />
                    <span>Create New Product</span>
                  </button>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-2xl border border-[#e2eae5] shadow-card overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f6faf8] text-[#5c7167] border-b border-[#e2eae5] font-bold">
                      <tr>
                        <th className="p-4">SKU / ID</th>
                        <th className="p-4">Product Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Polymorphic Specs</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f6f3]">
                      {products.map((p) => (
                        <tr key={p.product_id} className="hover:bg-[#fafcfb] transition-colors">
                          <td className="p-4 font-mono font-bold text-[#013326]">{p.product_id}</td>
                          <td className="p-4 font-bold text-[#013326]">{p.name}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#f1f6f3] text-[#013326] font-semibold text-[11px]">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-[#013326]">{formatPrice(p.price)}</td>
                          <td className="p-4 text-[11px] text-[#5c7167]">
                            {p.category === "Electronics" && `Display: ${p.screen_size || "-"} | Warranty: ${p.warranty || "-"}`}
                            {p.category === "Clothing" && `Size: ${p.size || "-"} | Colors: ${p.colours?.join(", ") || "-"}`}
                            {p.category === "Groceries" && `Weight: ${p.weight || "-"} | Exp: ${p.expiry_date || "-"}`}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleDeleteProduct(p.product_id, p.name)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2.2 Merchant Orders Fulfillment */}
            {merchantTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-[#013326]">Fulfillment & Order State Machine</h2>
                  <p className="text-xs text-[#5c7167]">Live queue of customer orders with stage progression</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#e2eae5] shadow-card overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f6faf8] text-[#5c7167] border-b border-[#e2eae5] font-bold">
                      <tr>
                        <th className="p-4">Order Code</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Update State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f6f3]">
                      {orders.map((ord) => (
                        <tr key={ord.order_id} className="hover:bg-[#fafcfb] transition-colors">
                          <td className="p-4 font-mono font-bold text-[#013326]">{ord.order_id}</td>
                          <td className="p-4 font-semibold text-[#013326]">{ord.customer_name}</td>
                          <td className="p-4 text-[11px] text-[#5c7167]">
                            {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                          </td>
                          <td className="p-4 font-mono font-bold text-[#013326]">{formatPrice(ord.total)}</td>
                          <td className="p-4">{ord.payment_method}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                ord.status === "Delivered"
                                  ? "bg-[#eafaf4] text-[#0c835c]"
                                  : ord.status === "Out for Delivery"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.order_id, e.target.value)}
                              className="px-2 py-1 text-xs rounded-lg border border-[#e2eae5] bg-[#f1f6f3] font-semibold text-[#013326]"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2.3 Fleet Telemetry (Cassandra) */}
            {merchantTab === "fleet" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#013326]">Cassandra Telemetry Fleet Command</h2>
                    <p className="text-xs text-[#5c7167]">Ingesting 160 writes / second across 800 riders (13.8M rows / day)</p>
                  </div>

                  <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-[#e2eae5]">
                    {["All", "Phnom Penh", "Siem Reap", "Battambang"].map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCityFilter(city)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                          selectedCityFilter === city ? "bg-[#013326] text-white" : "text-[#5c7167]"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live CQL Terminal */}
                <div className="bg-[#011c15] text-[#9cf0ce] p-5 rounded-2xl border border-[#0a4636] font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#0a4636]">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#15c089] animate-pulse" />
                      <span className="font-bold text-white">Live Cassandra Ingest Stream</span>
                    </div>
                    <button
                      onClick={() => setIsTelemetryStreaming(!isTelemetryStreaming)}
                      className="text-xs text-[#15c089] hover:underline"
                    >
                      {isTelemetryStreaming ? "Pause Stream" : "Resume Stream"}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {telemetryLogs.map((log, idx) => (
                      <div key={idx} className="truncate text-emerald-300">{log}</div>
                    ))}
                  </div>
                </div>

                {/* Rider Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredRiders.map((rider) => (
                    <div key={rider.id} className="bg-white rounded-2xl p-5 border border-[#e2eae5] shadow-card space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-bold text-[#013326]">{rider.name}</h4>
                          <p className="text-[11px] text-[#5c7167] font-mono">{rider.id} • {rider.city}</p>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#eafaf4] text-[#0c835c]">
                          {rider.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#5c7167]">Speed: <strong className="text-[#013326]">{rider.speed}</strong></span>
                        <span className="text-[#5c7167]">Battery: <strong className="text-[#013326]">{rider.battery}%</strong></span>
                      </div>

                      <div className="bg-[#f6faf8] p-2.5 rounded-xl border border-[#e2eae5] text-[11px] font-mono text-[#5c7167] flex justify-between">
                        <span>{rider.lat}</span>
                        <span>{rider.lng}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2.4 Referral Network (Neo4j) */}
            {merchantTab === "referrals" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-[#013326]">Neo4j 3-Level Referral Reward Network</h2>
                  <p className="text-xs text-[#5c7167]">Index-free adjacency traversing social graphs up to 3 hops deep</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Tier 1 */}
                  <div className="bg-white rounded-2xl p-5 border border-[#e2eae5] shadow-card space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-[#013326]">Level 1: Direct Invites</h3>
                      <span className="px-2 py-0.5 bg-[#eafaf4] text-[#0c835c] rounded text-xs font-bold">5% Reward</span>
                    </div>
                    <p className="text-xs text-[#5c7167]">Directly referred by Sokha Meas (C0457)</p>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-[#fafcfb] rounded-xl border border-[#e2eae5]">
                        <p className="font-bold text-[#013326]">Vireak Chan (C1001)</p>
                        <p className="text-[#5c7167]">Phnom Penh • Spend: $420.00 • Earned: $21.00</p>
                      </div>
                      <div className="p-3 bg-[#fafcfb] rounded-xl border border-[#e2eae5]">
                        <p className="font-bold text-[#013326]">Sophea Kim (C1002)</p>
                        <p className="text-[#5c7167]">Siem Reap • Spend: $650.00 • Earned: $32.50</p>
                      </div>
                    </div>
                  </div>

                  {/* Tier 2 */}
                  <div className="bg-white rounded-2xl p-5 border border-[#e2eae5] shadow-card space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-[#013326]">Level 2: 2nd-Degree Friends</h3>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold">3% Reward</span>
                    </div>
                    <p className="text-xs text-[#5c7167]">Referred by Level 1 contacts</p>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-[#fafcfb] rounded-xl border border-[#e2eae5]">
                        <p className="font-bold text-[#013326]">Rithy Pen (C1003)</p>
                        <p className="text-[#5c7167]">Battambang • Spend: $810.00 • Earned: $24.30</p>
                      </div>
                      <div className="p-3 bg-[#fafcfb] rounded-xl border border-[#e2eae5]">
                        <p className="font-bold text-[#013326]">Kolab Heng (C1005)</p>
                        <p className="text-[#5c7167]">Phnom Penh • Spend: $390.00 • Earned: $11.70</p>
                      </div>
                    </div>
                  </div>

                  {/* Tier 3 */}
                  <div className="bg-white rounded-2xl p-5 border border-[#e2eae5] shadow-card space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-[#013326]">Level 3: 3rd-Degree Friends</h3>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-bold">1% Reward</span>
                    </div>
                    <p className="text-xs text-[#5c7167]">Referred by Level 2 contacts</p>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-[#fafcfb] rounded-xl border border-[#e2eae5]">
                        <p className="font-bold text-[#013326]">Bopha Nou (C1004)</p>
                        <p className="text-[#5c7167]">Phnom Penh • Spend: $1,120.00 • Earned: $11.20</p>
                      </div>
                      <div className="p-3 bg-[#fafcfb] rounded-xl border border-[#e2eae5]">
                        <p className="font-bold text-[#013326]">Dara Kong (C1007)</p>
                        <p className="text-[#5c7167]">Siem Reap • Spend: $780.00 • Earned: $7.80</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2.5 Warehouse Analytics (Hive) */}
            {merchantTab === "warehouse" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-extrabold text-[#013326]">Apache Hive Analytics & Warehouse</h2>
                  <p className="text-xs text-[#5c7167]">Monthly batch processing over 2M orders staged at /staging/orders/ in HDFS</p>
                </div>

                {/* Hive Workbench */}
                <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-card space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-5 h-5 text-[#15c089]" />
                      <h3 className="text-base font-bold text-[#013326]">HiveQL Query Console</h3>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-[#f1f6f3] p-1 rounded-xl">
                      {(["D1", "D2", "D3", "D4"] as const).map((qKey) => (
                        <button
                          key={qKey}
                          onClick={() => setActiveHiveQuery(qKey)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                            activeHiveQuery === qKey ? "bg-[#013326] text-white" : "text-[#5c7167]"
                          }`}
                        >
                          Query {qKey}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-[#011c15] text-[#9cf0ce] p-5 rounded-2xl border border-[#0a4636] font-mono text-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[#cad6cf] pb-2 border-b border-[#0a4636]">
                          <span className="font-bold text-white">// {hiveQueries[activeHiveQuery].title}</span>
                          <button
                            onClick={() => copyQueryToClipboard(hiveQueries[activeHiveQuery].hql)}
                            className="text-[#15c089] hover:text-white flex items-center space-x-1"
                          >
                            {queryCopied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{queryCopied ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                        <pre className="overflow-x-auto text-emerald-300">{hiveQueries[activeHiveQuery].hql}</pre>
                      </div>

                      <div className="pt-3 border-t border-[#0a4636] flex justify-between items-center">
                        <span className="text-[11px] text-[#cad6cf]">Driver → Compiler → Tez Engine</span>
                        <button
                          onClick={executeHiveQuerySimulation}
                          disabled={isQueryExecuting}
                          className="px-3.5 py-1.5 rounded-lg bg-[#15c089] text-[#013326] font-bold text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isQueryExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                          <span>Execute Query</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#fafcfb] p-5 rounded-2xl border border-[#e2eae5] space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#013326]">Query Execution Results</span>
                        <span className="text-[11px] text-[#0e9f6e] font-mono bg-[#eafaf4] px-2 py-0.5 rounded-full">
                          142 ms latency
                        </span>
                      </div>

                      <div className="divide-y divide-[#e2eae5] text-xs">
                        {hiveQueries[activeHiveQuery].results.map((res, i) => (
                          <div key={i} className="py-2.5 flex justify-between">
                            <span className="font-bold text-[#013326]">{res.col1}</span>
                            <span className="font-mono font-bold text-[#013326]">{res.col2}</span>
                            <span className="text-[11px] text-[#5c7167]">{res.col3}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-[#eafaf4] rounded-xl border border-[#9cf0ce] text-xs text-[#0c835c] flex items-center space-x-2">
                        <Zap className="w-4 h-4 shrink-0" />
                        <span>{hiveQueries[activeHiveQuery].speedup}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL 1: ADD PRODUCT (Merchant CRUD) */}
      {/* ============================================================ */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddProductOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e2eae5] space-y-4 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#e2eae5]">
              <h3 className="text-base font-bold text-[#013326]">Create New Product (MongoDB)</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="p-1.5 rounded-lg text-[#5c7167]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#013326] mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Noise Canceling Headphones"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] focus:ring-2 focus:ring-[#15c089]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#013326] mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5]"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Groceries">Groceries</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#013326] mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="29.99"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5]"
                  />
                </div>
              </div>

              {/* Dynamic Polymorphic Category Fields */}
              {newProdCategory === "Electronics" && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#f6faf8] rounded-xl border border-[#e2eae5]">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#013326]">Screen Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 6.5 inch OLED"
                      value={newProdScreen}
                      onChange={(e) => setNewProdScreen(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-[#e2eae5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#013326]">Warranty</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Year Official"
                      value={newProdWarranty}
                      onChange={(e) => setNewProdWarranty(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-[#e2eae5]"
                    />
                  </div>
                </div>
              )}

              {newProdCategory === "Clothing" && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#f6faf8] rounded-xl border border-[#e2eae5]">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#013326]">Size</label>
                    <input
                      type="text"
                      placeholder="e.g. M, L, XL"
                      value={newProdSize}
                      onChange={(e) => setNewProdSize(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-[#e2eae5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#013326]">Colours (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Black, Navy, Sand"
                      value={newProdColours}
                      onChange={(e) => setNewProdColours(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-[#e2eae5]"
                    />
                  </div>
                </div>
              )}

              {newProdCategory === "Groceries" && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#f6faf8] rounded-xl border border-[#e2eae5]">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#013326]">Net Weight</label>
                    <input
                      type="text"
                      placeholder="e.g. 1kg Bag"
                      value={newProdWeight}
                      onChange={(e) => setNewProdWeight(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-[#e2eae5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#013326]">Expiry Date</label>
                    <input
                      type="date"
                      value={newProdExpiry}
                      onChange={(e) => setNewProdExpiry(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-[#e2eae5]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#013326] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Item details..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Insert into MongoDB Collection
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: PRODUCT QUICK VIEW */}
      {/* ============================================================ */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setQuickViewProduct(null)} className="absolute inset-0 bg-black/50 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e2eae5] space-y-5 z-10">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#f1f6f3] text-[#013326]">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-lg font-bold text-[#013326] mt-2">{quickViewProduct.name}</h3>
                <p className="text-xs text-[#5c7167] font-mono">SKU: {quickViewProduct.product_id}</p>
              </div>
              <button onClick={() => setQuickViewProduct(null)} className="p-2 rounded-xl text-[#5c7167] hover:bg-[#f1f6f3]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5c7167] leading-relaxed">
              {quickViewProduct.description || "High-quality marketplace inventory item backed by verified distributor warranty."}
            </p>

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
                    className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#013326] shadow-xs"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-[#013326]">{quickViewQty}</span>
                  <button
                    onClick={() => setQuickViewQty(quickViewQty + 1)}
                    className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#013326] shadow-xs"
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
      {/* MODAL 3: ADD ADDRESS */}
      {/* ============================================================ */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddAddressOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e2eae5] space-y-4 z-10">
            <div className="flex justify-between items-center pb-3 border-b border-[#e2eae5]">
              <h3 className="text-base font-bold text-[#013326]">Add Delivery Address</h3>
              <button onClick={() => setIsAddAddressOpen(false)} className="p-1.5 rounded-lg text-[#5c7167]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#013326] mb-1">Label</label>
                <input
                  type="text"
                  placeholder="e.g. Warehouse, Studio"
                  value={newAddrLabel}
                  onChange={(e) => setNewAddrLabel(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#013326] mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="Street 310, Sangkat BKK1"
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#013326] mb-1">City</label>
                <select
                  value={newAddrCity}
                  onChange={(e) => setNewAddrCity(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5]"
                >
                  <option value="Phnom Penh">Phnom Penh</option>
                  <option value="Siem Reap">Siem Reap</option>
                  <option value="Battambang">Battambang</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#013326] text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Save to Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DRAWER: SHOPPING CART */}
      {/* ============================================================ */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              <div className="p-6 border-b border-[#e2eae5] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#15c089]" />
                  <h3 className="text-base font-bold text-[#013326]">Shopping Cart ({cartItemCount})</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl text-[#5c7167]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-[#5c7167]">
                    <ShoppingBag className="w-12 h-12 text-[#cad6cf]" />
                    <p className="text-sm font-semibold">Your shopping cart is empty</p>
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
                          className="w-7 h-7 rounded-lg bg-white border border-[#e2eae5] flex items-center justify-center text-[#013326]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#013326]">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.product.product_id, 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#e2eae5] flex items-center justify-center text-[#013326]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

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
      {/* CHECKOUT MODAL (Bakong KHQR) */}
      {/* ============================================================ */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsCheckoutOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e2eae5] space-y-6 z-10 max-h-[90vh] overflow-y-auto">
            {!isCheckoutSuccess ? (
              <>
                <div className="flex justify-between items-center pb-4 border-b border-[#e2eae5]">
                  <div>
                    <h3 className="text-lg font-bold text-[#013326]">Checkout & Payment</h3>
                    <p className="text-xs text-[#5c7167]">Instant settlement with Bakong KHQR or Cash on Delivery</p>
                  </div>
                  <button onClick={() => setIsCheckoutOpen(false)} className="p-2 rounded-xl text-[#5c7167]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedPayment("khqr")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedPayment === "khqr" ? "bg-[#013326] text-white border-[#013326]" : "bg-[#f1f6f3] text-[#5c7167]"
                    }`}
                  >
                    Bakong KHQR
                  </button>
                  <button
                    onClick={() => setSelectedPayment("cod")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedPayment === "cod" ? "bg-[#013326] text-white border-[#013326]" : "bg-[#f1f6f3] text-[#5c7167]"
                    }`}
                  >
                    Cash (COD)
                  </button>
                  <button
                    onClick={() => setSelectedPayment("card")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedPayment === "card" ? "bg-[#013326] text-white border-[#013326]" : "bg-[#f1f6f3] text-[#5c7167]"
                    }`}
                  >
                    Credit Card
                  </button>
                </div>

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

                    <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center space-y-3 text-slate-900">
                      <div className="w-44 h-44 bg-slate-900 rounded-lg p-2 flex items-center justify-center relative shadow-inner">
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
                        <p className="text-xs font-bold text-[#013326]">MARKETPLACE COMMERCE</p>
                        <p className="text-base font-black text-[#013326] font-mono">
                          {formatPrice(finalTotalUSD)}
                        </p>
                        <p className="text-[11px] text-[#5c7167]">Scan with ABA Mobile, Wing, or ACLEDA</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-[#f6faf8] p-3.5 rounded-xl border border-[#e2eae5] text-xs space-y-1">
                  <div className="flex justify-between font-bold text-[#013326]">
                    <span>Delivering to: {customer.name}</span>
                    <span className="text-[#0c835c]">Home</span>
                  </div>
                  <p className="text-[#5c7167]">{customer.addresses[0]?.street}</p>
                </div>

                <button
                  onClick={handleSimulatePayment}
                  className="w-full py-3.5 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#15c089]" />
                  <span>Simulate Payment & Persist Order ({formatPrice(finalTotalUSD)})</span>
                </button>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#eafaf4] text-[#0c835c] flex items-center justify-center mx-auto border border-[#9cf0ce]">
                  <CheckCircle2 className="w-8 h-8 text-[#15c089]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#013326]">Payment Confirmed!</h3>
                  <p className="text-xs text-[#5c7167]">
                    Order persisted into MongoDB and dispatched to the fulfillment pipeline.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setCart([]);
                    setCustomerTab("orders");
                  }}
                  className="w-full py-3 rounded-xl bg-[#013326] text-white text-xs font-bold cursor-pointer"
                >
                  Track Order in My Orders
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TOAST NOTIFICATION STACK */}
      {/* ============================================================ */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold flex items-center space-x-2 animate-bounce-subtle ${
              toast.type === "error"
                ? "bg-rose-900 text-white border-rose-700"
                : "bg-[#013326] text-white border-[#0a4636]"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#15c089]" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer className="mt-auto border-t border-[#e2eae5] bg-white py-6 text-center text-xs text-[#5c7167]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#013326]">Marketplace</span>
            <span>•</span>
            <span>Polyglot E-Commerce Microservices Engine</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Next.js 15</span>
            <span>•</span>
            <span>MongoDB 8.0</span>
            <span>•</span>
            <span>Cassandra LSM</span>
            <span>•</span>
            <span>Neo4j Graph</span>
            <span>•</span>
            <span>Apache Hive 3.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
