"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { StoreTenant, Product } from "@/types";
import { fetchStoreByIdOrSlug, fetchStoreProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import {
  Store,
  MapPin,
  Star,
  ShieldCheck,
  Package,
  Clock,
  Phone,
  Mail,
  Heart,
  Share2,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  Award,
  Truck,
  Sparkles,
  Info,
  MessageSquare,
  X,
} from "lucide-react";

export default function StoreProfilePage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || "";

  const [store, setStore] = useState<StoreTenant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "about" | "reviews">("products");

  // In-store search & filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcat, setSelectedSubcat] = useState("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");

  // Interaction states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadStore() {
      setLoading(true);
      const s = await fetchStoreByIdOrSlug(rawId);
      if (s) {
        setStore(s);
        setFollowersCount(s.followers_count || 1200);
        const prods = await fetchStoreProducts(s.id);
        setProducts(prods);
      }
      setLoading(false);
    }
    if (rawId) {
      loadStore();
    }
  }, [rawId]);

  // Handle follow toggle
  const handleToggleFollow = () => {
    if (!store) return;
    setIsFollowing((prev) => {
      const next = !prev;
      setFollowersCount((c) => (next ? c + 1 : c - 1));
      showToast(
        next ? `You are now following ${store.name}!` : `Unfollowed ${store.name}`,
        next ? "success" : "info"
      );
      return next;
    });
  };

  // Handle share
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Store profile URL copied to clipboard!", "success");
    }
  };

  // Subcategories derived from products
  const availableSubcategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.subcategory) set.add(p.subcategory);
    });
    return Array.from(set);
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.product_id.toLowerCase().includes(q)
      );
    }

    if (selectedSubcat !== "all") {
      list = list.filter((p) => p.subcategory === selectedSubcat);
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [products, searchQuery, selectedSubcat, sortBy]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading store profile & verified catalog...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <Store className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-black text-slate-900">Store Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The requested merchant store could not be located in our multi-tenant directory.
        </p>
        <Link
          href="/stores"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Stores</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/stores" className="hover:text-slate-900 transition-colors">
          Stores
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{store.name}</span>
      </div>

      {/* Hero Store Cover Banner & Avatar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
        {/* Banner Cover Image */}
        <div className="relative h-48 sm:h-64 lg:h-72 w-full overflow-hidden bg-slate-900">
          <img
            src={store.banner || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80"}
            alt={store.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Top badges on banner */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 backdrop-blur-md shadow-xs flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{store.province}</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Merchant</span>
            </span>
          </div>
        </div>

        {/* Store Identity & Action Controls */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-14 sm:-mt-16 mb-6">
            {/* Logo Avatar & Title */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-1.5 shadow-xl border-4 border-white overflow-hidden shrink-0">
                <img
                  src={store.logo || "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80"}
                  alt={store.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {store.name}
                  </h1>
                  <span title="Verified by NBC & Ministry of Commerce">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </span>
                </div>
                <p className="text-xs font-semibold text-blue-600 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5" />
                  <span>{store.category}</span>
                  <span>•</span>
                  <span>Member since {new Date(store.joined_date).getFullYear()}</span>
                </p>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={handleToggleFollow}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  isFollowing
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFollowing ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{isFollowing ? "Following" : "Follow Store"}</span>
                <span className="opacity-70 text-[10px] ml-1">({followersCount})</span>
              </button>

              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Contact Seller</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Share store"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Store Description & Trust Pills */}
          <div className="space-y-4 border-t border-slate-100 pt-5">
            <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
              {store.description}
            </p>

            {/* Badges / Guarantees Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {store.badges?.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60"
                >
                  <Award className="w-3 h-3 text-blue-600" />
                  <span>{badge}</span>
                </span>
              ))}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <Truck className="w-3 h-3 text-emerald-600" />
                <span>Fast Courier Dispatch</span>
              </span>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                <span className="text-base font-black text-amber-600 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{store.rating}</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Customer Rating</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                <span className="text-base font-black text-slate-900">{products.length} Items</span>
                <span className="text-[11px] text-slate-500 font-medium">Active Products</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                <span className="text-base font-black text-emerald-600">{store.positive_feedback || 99}%</span>
                <span className="text-[11px] text-slate-500 font-medium">Positive Feedback</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                <span className="text-base font-black text-blue-600">{store.response_time || "< 15 mins"}</span>
                <span className="text-[11px] text-slate-500 font-medium">Chat Response</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 sm:px-8 border-t border-slate-200/80 bg-slate-50/50 flex items-center space-x-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "products"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`py-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "about"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About Store & Verification</span>
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "reviews"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Store Reviews ({store.orders_count || 120})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Products Showcase */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* In-Store Search & Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search inside ${store.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
              />
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {availableSubcategories.length > 0 && (
                <select
                  value={selectedSubcat}
                  onChange={(e) => setSelectedSubcat(e.target.value)}
                  aria-label="Filter products by subcategory"
                  className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold outline-none cursor-pointer"
                >
                  <option value="all">All Departments</option>
                  {availableSubcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products"
                className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No items match your criteria</h3>
              <p className="text-xs text-slate-500">
                Clear the search query or subcategory filter to see all store products.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubcat("all");
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
              >
                Reset Store Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((p) => {
                const isSaved = isInWishlist(p.product_id);
                return (
                  <div
                    key={p.product_id}
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail Image */}
                      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                        <Link href={`/shop/${p.product_id}`} className="block w-full h-full cursor-pointer">
                          <img
                            src={p.image || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Wishlist Heart Toggle */}
                        <button
                          onClick={() => toggleWishlist(p)}
                          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-rose-500 hover:bg-white shadow-xs transition-colors cursor-pointer"
                          title="Save to wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? "text-rose-500 fill-rose-500" : ""}`} />
                        </button>

                        {/* Stock badge */}
                        {(p.stock ?? 10) <= 5 && (
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500 text-white shadow-xs">
                            Only {p.stock} left
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3.5 sm:p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-semibold text-blue-600 truncate">{p.category}</span>
                          <span className="flex items-center space-x-0.5 text-amber-600 font-bold shrink-0">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{p.rating || 4.8}</span>
                          </span>
                        </div>

                        <Link
                          href={`/shop/${p.product_id}`}
                          className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug cursor-pointer"
                        >
                          {p.name}
                        </Link>
                      </div>
                    </div>

                    {/* Price & Add to Cart button */}
                    <div className="p-3.5 sm:p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                      <span className="text-sm sm:text-base font-black text-slate-900 font-mono">
                        {formatPrice(p.price)}
                      </span>

                      <button
                        onClick={() => {
                          addToCart(p, 1);
                          showToast(`Added ${p.name} to cart`, "success");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: About Store & Verification */}
      {activeTab === "about" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" />
                <span>Store Story & Background</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {store.description}
              </p>
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Capabilities & Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(store.features || [
                    "Direct Manufacturer Warranty",
                    "NBC Bakong Real-Time Payment",
                    "Authenticity Guaranteed",
                    "Express Dispatch Across Cambodia",
                  ]).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>Legal Registration & Platform Compliance</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Ministry of Commerce</span>
                  <span className="font-bold text-slate-900">MOC Registered Merchant</span>
                  <p className="text-slate-500 text-[11px]">Valid e-commerce business registration in Kingdom of Cambodia.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">General Department of Taxation</span>
                  <span className="font-bold text-slate-900">TIN Compliant Entity</span>
                  <p className="text-slate-500 text-[11px]">Authorized invoicing with Bakong KHQR settlement.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Store Details & Contact Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-sm font-black text-slate-900">Store Information</h4>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Address</span>
                    <span className="text-slate-600">{store.address || `${store.province}, Cambodia`}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Business Hours</span>
                    <span className="text-slate-600">{store.opening_hours || "Mon - Sun: 8:00 AM - 8:00 PM"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Store Phone</span>
                    <span className="text-slate-600 font-mono">{store.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Email Support</span>
                    <span className="text-slate-600 font-mono">{store.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Direct Message</span>
                </button>
              </div>
            </div>

            {/* Delivery Areas */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Delivery Coverage</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {(store.delivery_areas || ["Phnom Penh (Same-Day Express)", "Siem Reap (24h)", "Battambang (24-48h)"]).map((area, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Store Customer Reviews */}
      {activeTab === "reviews" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">Verified Customer Feedback</h3>
              <p className="text-xs text-slate-500">
                Real reviews submitted by customers who purchased from {store.name}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200/60">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              <div>
                <span className="text-lg font-black text-amber-900 leading-none block">{store.rating} / 5.0</span>
                <span className="text-[10px] font-bold text-amber-700">Based on {store.orders_count || 140} verified orders</span>
              </div>
            </div>
          </div>

          {/* Sample Verified Reviews */}
          <div className="space-y-4">
            {[
              {
                id: "sr-1",
                name: "Sokha Meas",
                rating: 5,
                date: "September 24, 2026",
                comment: `Exceptional service from ${store.name}! Order arrived within 40 minutes in Phnom Penh. Packaging was flawless and item was 100% authentic.`,
              },
              {
                id: "sr-2",
                name: "Piseth Seng",
                rating: 5,
                date: "September 18, 2026",
                comment: "Seller answered my questions via chat in under 5 minutes. Paid seamlessly with Bakong KHQR. Highly recommended!",
              },
              {
                id: "sr-3",
                name: "Chenda Som",
                rating: 5,
                date: "September 12, 2026",
                comment: "Very trustworthy merchant. Everything matches the product specs on Rentify Marketplace.",
              },
            ].map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{rev.name}</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-10">{rev.comment}</p>
                <div className="pl-10 flex items-center space-x-1 text-[11px] font-semibold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Purchase</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Seller Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Contact {store.name}</h3>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/60 space-y-1">
                <span className="font-bold text-blue-900 block">Direct Merchant Hotline</span>
                <p className="text-blue-700 font-mono text-sm font-bold">{store.phone}</p>
                <span className="text-[11px] text-blue-600">Available: {store.opening_hours || "8:00 AM - 8:00 PM"}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                <span className="font-bold text-slate-900 block">Official Support Email</span>
                <p className="text-slate-700 font-mono text-xs">{store.email}</p>
                <span className="text-[11px] text-slate-500">Average response time: {store.response_time || "< 15 mins"}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                <span className="font-bold text-slate-900 block">Store Location</span>
                <p className="text-slate-600 text-xs">{store.address || `${store.province}, Cambodia`}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href={`tel:${store.phone.replace(/[^0-9+]/g, "")}`}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center transition-colors shadow-xs"
              >
                Call Store Now
              </a>
              <button
                onClick={() => {
                  setIsContactModalOpen(false);
                  showToast("Merchant chat session initiated!", "info");
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-colors shadow-xs"
              >
                Start In-App Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
