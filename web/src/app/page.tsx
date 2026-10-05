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

export default function KhmerCartApp() {
  const [activeTab, setActiveTab] = useState<"store" | "analytics" | "riders" | "customer">("store");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"aba" | "cash" | "acleda">("aba");

  // Sokha Meas Customer State
  const [customer, setCustomer] = useState({
    _id: "C0457",
    name: "Sokha Meas",
    phone: "+855-12-345-678",
    loyalty_points: 150,
    addresses: [
      { label: "Home", street: "Street 271", city: "Phnom Penh" },
      { label: "Work", street: "Norodom Blvd", city: "Phnom Penh" },
    ],
    past_orders: ["100001", "99452"],
  });

  // Load products from API
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch((err) => console.error("Error loading products:", err));
  }, []);

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

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center font-bold text-xl shadow-md">
                KC
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  KhmerCart
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs uppercase px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full font-semibold">
                  Big Data Platform
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex space-x-1">
              {[
                { id: "store", label: "Storefront", icon: ShoppingBag },
                { id: "analytics", label: "Hive Analytics", icon: TrendingUp },
                { id: "riders", label: "Rider Telemetry", icon: Truck },
                { id: "customer", label: "Customer Profile", icon: User },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Cart Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium border border-slate-700 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-indigo-400" />
                <span>Cart</span>
                {cart.length > 0 && (
                  <span className="bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ml-1">
                    {cart.reduce((c, i) => c + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex border-t border-slate-800 px-2 py-1.5 space-x-1 overflow-x-auto">
          {[
            { id: "store", label: "Store", icon: ShoppingBag },
            { id: "analytics", label: "Analytics", icon: TrendingUp },
            { id: "riders", label: "Riders", icon: Truck },
            { id: "customer", label: "Profile", icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  activeTab === tab.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ========================================================= */}
        {/* TAB 1: STOREFRONT */}
        {/* ========================================================= */}
        {activeTab === "store" && (
          <div className="space-y-8">
            {/* Banner */}
            <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 overflow-hidden shadow-xl border border-slate-800">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Polyglot Persistence E-Commerce</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Cambodia&apos;s Next-Gen Marketplace
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Serving 200,000 customers across Phnom Penh, Siem Reap, and Battambang with 800 active delivery
                  riders. Product catalog powered directly by MongoDB.
                </p>
                <div className="pt-2 flex flex-wrap gap-3 text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Database className="w-4 h-4 text-emerald-400" />
                    MongoDB (Catalogue)
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Redis (Cart & Sessions)
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Apache Hive (Analytics)
                  </span>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {["All", "Electronics", "Clothing", "Groceries"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Showing {filteredProducts.length} items from MongoDB
              </span>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.product_id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {prod.category}
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        In Stock
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {prod.product_id}</p>
                    </div>

                    {/* Category-Specific Polymorphic Attributes */}
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 border border-slate-100">
                      {prod.category === "Electronics" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Screen Size:</span>
                            <span className="font-semibold text-slate-800">{prod.screen_size}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Warranty:</span>
                            <span className="font-semibold text-emerald-600">{prod.warranty}</span>
                          </div>
                        </>
                      )}
                      {prod.category === "Clothing" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Size:</span>
                            <span className="font-semibold text-slate-800">{prod.size}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Available Colours:</span>
                            <div className="flex space-x-1">
                              {prod.colours?.map((c) => (
                                <span
                                  key={c}
                                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-700"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      {prod.category === "Groceries" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Weight:</span>
                            <span className="font-semibold text-slate-800">{prod.weight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Expiry Date:</span>
                            <span className="font-semibold text-amber-600">{prod.expiry_date}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Price</span>
                      <span className="text-xl font-black text-slate-900">${prod.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => addToCart(prod)}
                      className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-transform active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: HIVE DATA WAREHOUSE ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Apache Hive Warehouse Analytics
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Data generated from orders_opt ORC table with partition pruning and bucketing optimizations.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">September Gross Sales</span>
                <p className="text-3xl font-black text-slate-900 mt-2">$9,027.00</p>
                <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">↑ Verified from orders_opt</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Province</span>
                <p className="text-3xl font-black text-indigo-600 mt-2">Siem Reap</p>
                <span className="text-xs text-slate-500 font-medium mt-1 inline-block">57.3% of total volume</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Value Tiers</span>
                <p className="text-3xl font-black text-slate-900 mt-2">18 High / 33 Norm</p>
                <span className="text-xs text-indigo-500 font-semibold mt-1 inline-block">CASE WHEN &gt; $100</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Warehouse Format</span>
                <p className="text-3xl font-black text-emerald-600 mt-2">ORC Columnar</p>
                <span className="text-xs text-slate-500 font-medium mt-1 inline-block">8 Buckets on customer_id</span>
              </div>
            </div>

            {/* Task D1: Province Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Task D1: Revenue by Province (September 2026)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Aggregated with SUM(quantity * unit_price) DESC</p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">
                  Partition Pruned: order_month = &apos;2026-09&apos;
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { province: "Siem Reap", revenue: 5175.0, percent: 57.3, color: "bg-indigo-600" },
                  { province: "Phnom Penh", revenue: 2989.5, percent: 33.1, color: "bg-rose-500" },
                  { province: "Battambang", revenue: 862.5, percent: 9.6, color: "bg-amber-500" },
                ].map((item) => (
                  <div key={item.province} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-800">{item.province}</span>
                      <span className="text-slate-900 font-mono">${item.revenue.toFixed(2)} ({item.percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                      <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task D2: Top Customers Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Task D2: Top 5 Customers by Lifetime Spend</h3>
                <p className="text-xs text-slate-500 mt-0.5">Bucket MapJoin on orders_opt.customer_id = customers.customer_id</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold">
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Province / City</th>
                      <th className="py-3 px-4 text-right">Total Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {[
                      { rank: "1", name: "Chenda Som", city: "Siem Reap", spend: "$2,625.00", badge: "bg-amber-100 text-amber-800" },
                      { rank: "2", name: "Sokha Meas", city: "Phnom Penh", spend: "$1,980.00", badge: "bg-slate-100 text-slate-700" },
                      { rank: "3", name: "Piseth Seng", city: "Siem Reap", spend: "$1,800.00", badge: "bg-slate-100 text-slate-700" },
                      { rank: "4", name: "Dara Sam", city: "Siem Reap", spend: "$750.00", badge: "bg-slate-100 text-slate-700" },
                      { rank: "5", name: "Sreypov Keo", city: "Battambang", spend: "$510.00", badge: "bg-slate-100 text-slate-700" },
                    ].map((row) => (
                      <tr key={row.name} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-400">#{row.rank}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{row.name}</td>
                        <td className="py-3 px-4 text-slate-600">{row.city}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">{row.spend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Task D5: Internal Hive Processing Flow */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-400" />
                  Task D5: Query Execution Architecture Lifecycle
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  How Hive executes `SELECT ... WHERE order_month = &apos;2026-09&apos;` internally.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { step: "1. Driver", role: "Session & Parser", desc: "Receives SQL, creates AST, manages session state." },
                  { step: "2. Compiler", role: "Semantic Analysis", desc: "Consults Metastore for schema & table structures." },
                  { step: "3. Metastore", role: "Schema Catalog", desc: "Resolves HDFS partition file paths and ORC types." },
                  { step: "4. Optimizer", role: "Partition Pruning", desc: "Skips all non-2026-09 directories, converts to DAG." },
                  { step: "5. Engine", role: "MapReduce / Tez", desc: "Executes in parallel across cluster data nodes." },
                ].map((s) => (
                  <div key={s.step} className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
                    <span className="text-xs font-bold text-indigo-400 block">{s.step}</span>
                    <span className="text-xs font-semibold text-white block">{s.role}</span>
                    <p className="text-[11px] text-slate-400 leading-snug">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: RIDER TELEMETRY (CASSANDRA USE CASE) */}
        {/* ========================================================= */}
        {activeTab === "riders" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Rider GPS Telemetry (Apache Cassandra)
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Data Need 4: 800 delivery riders pinging location every 5 seconds (~13.8 Million rows per day).
              </p>
            </div>

            {/* Ingestion Metric Stream Banner */}
            <div className="bg-indigo-900 text-white p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg border border-indigo-800">
              <div className="space-y-1">
                <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Cassandra Ingestion Stream</span>
                <p className="text-3xl font-black text-white">160 writes / second</p>
                <p className="text-xs text-indigo-200">13,824,000 append-only rows written daily</p>
              </div>
              <div className="flex gap-2 text-xs font-semibold">
                <span className="bg-indigo-800/80 border border-indigo-700 px-3 py-1.5 rounded-lg">
                  800 Active Riders
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live GPS Ingestion
                </span>
              </div>
            </div>

            {/* Simulated Live Riders List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: "R-101", name: "Chan Vuthy", province: "Phnom Penh", coords: "11.5564° N, 104.9282° E", status: "Delivering", speed: "28 km/h", batt: "88%" },
                { id: "R-102", name: "Sok Rith", province: "Phnom Penh", coords: "11.5721° N, 104.9150° E", status: "Picked Up", speed: "34 km/h", batt: "72%" },
                { id: "R-201", name: "Thy Dara", province: "Siem Reap", coords: "13.3633° N, 103.8564° E", status: "Delivering", speed: "22 km/h", batt: "64%" },
                { id: "R-202", name: "Chea Bora", province: "Siem Reap", coords: "13.3510° N, 103.8670° E", status: "Delivering", speed: "26 km/h", batt: "81%" },
                { id: "R-301", name: "Heng Samnang", province: "Battambang", coords: "13.0957° N, 103.2022° E", status: "Delivering", speed: "30 km/h", batt: "59%" },
                { id: "R-302", name: "Keo Visal", province: "Battambang", coords: "13.1020° N, 103.1940° E", status: "Idle", speed: "0 km/h", batt: "90%" },
              ].map((rider) => (
                <div key={rider.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono text-slate-400 font-bold">{rider.id}</span>
                      <h4 className="text-base font-bold text-slate-900">{rider.name}</h4>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      rider.status === "Delivering" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                    }`}>
                      {rider.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Province:</span>
                      <span className="font-semibold text-slate-800">{rider.province}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400 font-sans">GPS Ping:</span>
                      <span>{rider.coords}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Velocity:</span>
                      <span className="font-semibold text-slate-800">{rider.speed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CUSTOMER PROFILE (MONGODB DATA MODELING) */}
        {/* ========================================================= */}
        {activeTab === "customer" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Customer Profile (Task B1 & B2.3)
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Demonstrates MongoDB document design with embedded addresses and referenced past orders.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400 font-bold">{customer._id}</span>
                  <h3 className="text-xl font-bold text-slate-900">{customer.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{customer.phone}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Loyalty Points</span>
                  <span className="text-2xl font-black text-indigo-600">{customer.loyalty_points} pts</span>
                </div>
              </div>

              {/* Embedded Addresses */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-800">
                    Embedded Delivery Addresses ({customer.addresses.length})
                  </h4>
                  <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-100">
                    Embedded (Bounded Array)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customer.addresses.map((addr, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-900 block">{addr.label} Address</span>
                      <p className="text-slate-600">{addr.street}</p>
                      <p className="text-slate-500 font-medium">{addr.city}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referenced Past Orders */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-800">
                    Referenced Past Orders ({customer.past_orders.length})
                  </h4>
                  <span className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-semibold border border-indigo-100">
                    Referenced (Unbounded Growth)
                  </span>
                </div>
                <div className="flex gap-2">
                  {customer.past_orders.map((ordId) => (
                    <span
                      key={ordId}
                      className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-700 border border-slate-200"
                    >
                      Order #{ordId}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* SLIDE-OVER SHOPPING CART DRAWER */}
      {/* ========================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900">Your Shopping Cart</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-sm">Your shopping cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.product_id}
                      className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-sm"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{item.product.name}</span>
                        <span className="text-xs text-slate-400">
                          ${item.product.price.toFixed(2)} × {item.quantity}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold text-slate-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Delivery (Phnom Penh)</span>
                    <span className="text-emerald-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-100 pt-2">
                    <span>Total</span>
                    <span className="font-mono font-black text-indigo-600">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Payment Method</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedPayment("aba")}
                      className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${
                        selectedPayment === "aba" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600"
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-rose-600" />
                      <span>ABA Pay</span>
                    </button>
                    <button
                      onClick={() => setSelectedPayment("acleda")}
                      className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${
                        selectedPayment === "acleda" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>ACLEDA</span>
                    </button>
                    <button
                      onClick={() => setSelectedPayment("cash")}
                      className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${
                        selectedPayment === "cash" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600"
                      }`}
                    >
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Cash</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCheckoutSuccess(true);
                    setCart([]);
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Pay with {selectedPayment.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Success Modal */}
      {isCheckoutSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Order Placed Successfully!</h3>
            <p className="text-xs text-slate-500">
              Your transaction has been recorded. An order record will be exported to HDFS for monthly reporting.
            </p>
            <button
              onClick={() => {
                setIsCheckoutSuccess(false);
                setIsCartOpen(false);
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Back to Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
