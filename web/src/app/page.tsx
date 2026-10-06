"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/customer/ProductCard";
import { QuickViewModal } from "@/components/shared/QuickViewModal";
import { useCurrency } from "@/context/CurrencyContext";
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Zap,
  CreditCard,
  Search,
  SlidersHorizontal,
  Layers,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function StorefrontHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "low" | "high">("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    loadData();
  }, []);

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

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      {/* Hero Showcase Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#013326] text-white p-6 sm:p-12 shadow-elegant border border-[#0a4636]">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#15c089]/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#15c089]/20 border border-[#15c089]/30 text-[#15c089] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Cambodian Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            High-Scale Polyglot E-Commerce Platform
          </h1>
          <p className="text-sm sm:text-base text-[#cad6cf] font-medium leading-relaxed">
            Experience next-generation shopping across Phnom Penh, Siem Reap, and Battambang with instant NBC Bakong KHQR checkout.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/shop"
              className="px-6 py-3 rounded-2xl bg-[#15c089] hover:bg-[#10a374] text-[#011c15] text-xs font-black transition-all shadow-md flex items-center space-x-2 active:scale-95"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/merchant"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/20"
            >
              Access Merchant Portal ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Advantage Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#eafaf4] text-[#0c835c] flex items-center justify-center shrink-0 border border-[#9cf0ce]">
            <Truck className="w-6 h-6 text-[#15c089]" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#013326]">Express Courier Fleet</h4>
            <p className="text-xs text-[#5c7167]">Live GPS tracking in Phnom Penh & Siem Reap</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#eafaf4] text-[#0c835c] flex items-center justify-center shrink-0 border border-[#9cf0ce]">
            <CreditCard className="w-6 h-6 text-[#15c089]" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#013326]">Bakong KHQR Settlement</h4>
            <p className="text-xs text-[#5c7167]">Instant zero-fee payment with all major banks</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#eafaf4] text-[#0c835c] flex items-center justify-center shrink-0 border border-[#9cf0ce]">
            <ShieldCheck className="w-6 h-6 text-[#15c089]" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#013326]">Verified Distributors</h4>
            <p className="text-xs text-[#5c7167]">Authenticity guarantee on all products</p>
          </div>
        </div>
      </section>

      {/* Catalog Browser Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#013326] tracking-tight">
              Featured Products & Catalog
            </h2>
            <p className="text-xs text-[#5c7167]">
              Curated items stored in MongoDB polymorphic document schemas
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-bold text-[#0c835c] hover:text-[#013326] flex items-center space-x-1"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Pills and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e2eae5] shadow-card">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["All", "Electronics", "Clothing", "Groceries"].map((cat) => {
              const count = cat === "All" ? products.length : products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
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

          <div className="flex items-center space-x-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-[#5c7167] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15c089]/30"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#09211a] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-[#e2eae5] animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-20 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e2eae5] shadow-card space-y-3">
            <ShoppingBag className="w-12 h-12 text-[#cad6cf] mx-auto" />
            <h3 className="text-base font-bold text-[#013326]">No products found</h3>
            <p className="text-xs text-[#5c7167]">No items match your filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.product_id}
                product={p}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
