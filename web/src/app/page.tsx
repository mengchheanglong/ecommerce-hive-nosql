"use client";

import React, { useState, useEffect } from "react";
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
  DollarSign
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
}

interface CartItem {
  product: Product;
  quantity: number;
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

  // KHR Exchange Rate (1 USD = 4,100 KHR)
  const KHR_RATE = 4100;

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
          // Default fallbacks with varied categories
          setProducts([
            {
              product_id: "P2210",
              name: "Ultra Smartphone Pro Max",
              category: "Electronics",
              price: 289.0,
              status: "active",
              screen_size: "6.7 inch OLED",
              warranty: "1 Year Official",
            },
            {
              product_id: "P3314",
              name: "Premium Linen Casual Shirt",
              category: "Clothing",
              price: 18.5,
              status: "active",
              size: "L",
              colours: ["Navy Blue", "Sand Beige", "Olive"],
            },
            {
              product_id: "P0874",
              name: "Battambang Jasmine Fragrant Rice 5kg",
              category: "Groceries",
              price: 4.8,
              status: "active",
              weight: "5.0 kg",
              expiry_date: "2027-10-01",
            },
            {
              product_id: "P4502",
              name: "Smart Noise-Canceling Earbuds",
              category: "Electronics",
              price: 59.0,
              status: "active",
              screen_size: "Touch Display",
              warranty: "6 Months",
            },
            {
              product_id: "P1290",
              name: "Kampot Premium Organic Black Pepper",
              category: "Groceries",
              price: 6.5,
              status: "active",
              weight: "250g Glass Jar",
              expiry_date: "2028-01-15",
            },
            {
              product_id: "P7781",
              name: "Handwoven Silk Summer Scarf",
              category: "Clothing",
              price: 24.0,
              status: "active",
              size: "Standard 180cm",
              colours: ["Amber Gold", "Lotus Pink"],
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

  const formatPrice = (usd: number) => {
    if (currency === "USD") {
      return `$${usd.toFixed(2)}`;
    }
    const khr = Math.round(usd * KHR_RATE);
    return `៛${khr.toLocaleString()}`;
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.product_id === product.product_id);
      if (existing) {
        return prev.map((item) =>
          item.product.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
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
  const filteredProducts = products
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
    // Add new order to customer past_orders
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
  };

  return (
    <div className="min-h-screen bg-[#f6faf8] text-[#09211a] flex flex-col font-sans selection:bg-[#15c089]/20 selection:text-[#013326]">
      {/* ============================================================ */}
      {/* 1. TOP NAVIGATION BAR (Inspired by Angkoro & Freshhaul) */}
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
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
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
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
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
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
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
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
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
                  onClick={() => setCurrency("USD")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    currency === "USD" ? "bg-white text-[#013326] shadow-xs" : "text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  $ USD
                </button>
                <button
                  onClick={() => setCurrency("KHR")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    currency === "KHR" ? "bg-white text-[#013326] shadow-xs" : "text-[#5c7167] hover:text-[#013326]"
                  }`}
                >
                  ៛ KHR
                </button>
              </div>

              {/* Shopping Cart Pill Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white transition-all shadow-sm group cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#15c089] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold hidden sm:inline">{formatPrice(cartTotalUSD)}</span>
                {cartItemCount > 0 && (
                  <span className="flex items-center justify-center min-w-5 h-5 px-1 bg-[#15c089] text-[#013326] text-[11px] font-black rounded-full shadow-xs">
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
            {/* Hero Banner (Inspired by Angkoro / FreshHaul) */}
            <div className="relative overflow-hidden rounded-3xl bg-[#013326] text-white p-6 sm:p-10 shadow-elegant border border-[#0a4636]">
              <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#15c089]/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#15c089]/15 border border-[#15c089]/30 text-[#15c089] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Polyglot Architecture • MongoDB Operational Store</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  High-Performance Distributed Marketplace
                </h1>
                <p className="text-sm sm:text-base text-[#cad6cf] font-medium leading-relaxed">
                  Polymorphic JSON schemas power dynamic electronics, apparel, and grocery specifications with zero rigid SQL migrations.
                </p>

                {/* Live System Stats Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-[11px] text-[#cad6cf] font-medium">Monthly Orders</p>
                    <p className="text-lg font-extrabold text-white">2.0M</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-[11px] text-[#cad6cf] font-medium">Delivery Fleet</p>
                    <p className="text-lg font-extrabold text-[#15c089]">800 Riders</p>
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
                {["All", "Electronics", "Clothing", "Groceries"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#013326] text-white shadow-xs"
                        : "bg-[#f1f6f3] text-[#5c7167] hover:bg-[#e2eae5] hover:text-[#013326]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
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
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] focus:outline-none focus:ring-2 focus:ring-[#15c089]/40 focus:bg-white transition-all text-[#09211a]"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#09211a] focus:outline-none focus:ring-2 focus:ring-[#15c089]/40 cursor-pointer"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.product_id}
                  className="bg-white rounded-2xl border border-[#e2eae5] shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Visual Header */}
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

                    {/* Polymorphic Category-Specific Attributes Badge Group */}
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
                              Net Weight: {product.weight}
                            </span>
                          )}
                          {product.expiry_date && (
                            <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                              Best Before: {product.expiry_date}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-6 pt-3 bg-[#fafcfb] border-t border-[#f1f6f3] flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#5c7167] font-medium">Unit Price</p>
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

                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#15c089]" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
                <span>Metastore: Derby Embedded • Engine: HiveQL on Tez/MapReduce</span>
              </div>
            </div>

            {/* KPI Cards Row (Angkoro KpiCard Style) */}
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
                <p className="text-xs text-[#5c7167] mt-1 font-mono">Partitioned by customer_id</p>
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

            {/* Detailed Analytics Grid: Provincial Breakdown & Top Spenders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Provincial Revenue Breakdown */}
              <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-card space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#013326]">Revenue by Province (September 2026)</h3>
                    <p className="text-xs text-[#5c7167]">Hive Query D1: Aggregated group-by province</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#013326] bg-[#f1f6f3] px-2.5 py-1 rounded-lg">
                    Total: {formatPrice(9027.0)}
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  {[
                    { province: "Siem Reap", revenue: 5175.0, percentage: 57.3, color: "bg-[#013326]" },
                    { province: "Phnom Penh", revenue: 2989.5, percentage: 33.1, color: "bg-[#15c089]" },
                    { province: "Battambang", revenue: 862.5, percentage: 9.6, color: "bg-[#5c7167]" },
                  ].map((p) => (
                    <div key={p.province} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#013326]">{p.province}</span>
                        <span className="font-mono text-[#013326]">
                          {formatPrice(p.revenue)} ({p.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#f1f6f3] h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${p.color} rounded-full transition-all duration-500`}
                          style={{ width: `${p.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 5 VIP Spenders Leaderboard */}
              <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#013326]">Top 5 Customers by Spend</h3>
                    <p className="text-xs text-[#5c7167]">Hive Query D2: JOIN orders_opt with customers</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0c835c] bg-[#eafaf4] px-2.5 py-1 rounded-lg">
                    5 Customers
                  </span>
                </div>

                <div className="divide-y divide-[#f1f6f3]">
                  {[
                    { rank: 1, name: "Chenda Som", city: "Siem Reap", spend: 2625.0, tier: "VIP Platinum" },
                    { rank: 2, name: "Sokha Meas", city: "Phnom Penh", spend: 1980.0, tier: "VIP Gold" },
                    { rank: 3, name: "Piseth Seng", city: "Siem Reap", spend: 1800.0, tier: "VIP Gold" },
                    { rank: 4, name: "Dara Sam", city: "Siem Reap", spend: 750.0, tier: "Silver" },
                    { rank: 5, name: "Sreypov Keo", city: "Battambang", spend: 510.0, tier: "Silver" },
                  ].map((c) => (
                    <div key={c.rank} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                            c.rank === 1
                              ? "bg-[#013326] text-[#15c089]"
                              : c.rank === 2
                              ? "bg-[#eafaf4] text-[#013326]"
                              : "bg-[#f1f6f3] text-[#5c7167]"
                          }`}
                        >
                          {c.rank}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-[#013326]">{c.name}</p>
                          <p className="text-[11px] text-[#5c7167]">{c.city}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold font-mono text-[#013326]">{formatPrice(c.spend)}</p>
                        <span className="text-[10px] font-semibold text-[#0c835c] bg-[#eafaf4] px-1.5 py-0.5 rounded">
                          {c.tier}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Tier Segmentation (High vs Normal) */}
            <div className="bg-white rounded-2xl p-6 border border-[#e2eae5] shadow-card space-y-3">
              <h3 className="text-sm font-bold text-[#013326]">
                Order Tier Classification (Query D4: CASE WHEN revenue &gt; $100)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#eafaf4] p-4 rounded-xl border border-[#9cf0ce]">
                  <span className="text-xs font-bold text-[#0c835c]">High Tier Orders (&gt; $100)</span>
                  <p className="text-xl font-extrabold text-[#013326] mt-1">18 orders (35.3%)</p>
                  <p className="text-[11px] text-[#5c7167] mt-1">High-ticket electronics and bulk grocery purchases</p>
                </div>
                <div className="bg-[#f1f6f3] p-4 rounded-xl border border-[#e2eae5]">
                  <span className="text-xs font-bold text-[#5c7167]">Normal Tier Orders (≤ $100)</span>
                  <p className="text-xl font-extrabold text-[#013326] mt-1">33 orders (64.7%)</p>
                  <p className="text-[11px] text-[#5c7167] mt-1">Daily consumables and individual apparel purchases</p>
                </div>
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

            {/* Cassandra Engine Metrics Banner */}
            <div className="bg-[#013326] text-white p-6 rounded-2xl border border-[#0a4636] shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#15c089] uppercase tracking-wider">
                  Storage Engine Architecture
                </span>
                <h3 className="text-base font-bold">Apache Cassandra (Log-Structured Merge Tree)</h3>
                <p className="text-xs text-[#cad6cf]">
                  SSTables and append-only commit logs provide sequential write speeds capable of absorbing 800 continuous rider pings.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
                  <p className="text-[10px] text-[#cad6cf]">Active Fleet</p>
                  <p className="text-lg font-black text-[#15c089]">800 Riders</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
                  <p className="text-[10px] text-[#cad6cf]">Daily Writes</p>
                  <p className="text-lg font-black text-white">13.8M Rows</p>
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

              <button
                onClick={() => setShowJsonSchema(!showJsonSchema)}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-[#e2eae5] text-xs font-bold text-[#013326] hover:bg-[#f1f6f3] transition-all shadow-xs cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-[#15c089]" />
                <span>{showJsonSchema ? "Hide JSON Schema" : "View JSON Document"}</span>
              </button>
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

            {/* Raw JSON Schema Toggle */}
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
      {/* 3. SLIDE-OVER SHOPPING CART DRAWER */}
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
      {/* 4. BAKONG KHQR CHECKOUT MODAL (Angkoro & FreshHaul Style) */}
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
                    <p className="text-xs text-[#5c7167]">Fast checkout with Bakong KHQR or Cash on Delivery</p>
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
                    <span className="text-[#0c835c]">Home Address</span>
                  </div>
                  <p className="text-[#5c7167]">Street 271, Sangkat Boeung Tumpun, Phnom Penh</p>
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
      {/* 5. FOOTER */}
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
