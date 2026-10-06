"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/customer/ProductCard";
import { QuickViewModal } from "@/components/shared/QuickViewModal";
import { Search, Grid, List, X, ShoppingBag, Plus, Eye, Star, Check } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";

export default function ShopCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "low" | "high">("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const categories = ["All", "Electronics", "Clothing", "Groceries"];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => (selectedCategory === "All" ? true : p.category === selectedCategory))
      .filter((p) =>
        searchQuery === ""
          ? true
          : p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.product_id.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "low") return a.price - b.price;
        if (sortBy === "high") return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#e2eae5] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#5c7167]">
            <Link href="/" className="hover:text-[#013326]">Home</Link>
            <span>/</span>
            <span className="text-[#013326] font-bold">Catalog</span>
          </div>
          <h1 className="text-2xl font-black text-[#013326] mt-1 tracking-tight">
            All Products & Inventory
          </h1>
        </div>
        <p className="text-xs text-[#5c7167]">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e2eae5] shadow-card">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => {
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

        {/* Search, Sort and View Toggles */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-[#5c7167] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15c089]/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5c7167] hover:text-[#013326]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
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

          <div className="hidden sm:flex items-center bg-[#f1f6f3] p-1 rounded-xl border border-[#e2eae5]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-white text-[#013326] shadow-xs" : "text-[#5c7167]"
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list" ? "bg-white text-[#013326] shadow-xs" : "text-[#5c7167]"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Listing */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-[#e2eae5] animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-24 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-[#e2eae5] shadow-card space-y-3">
          <ShoppingBag className="w-12 h-12 text-[#cad6cf] mx-auto" />
          <h3 className="text-base font-bold text-[#013326]">No products matched your criteria</h3>
          <p className="text-xs text-[#5c7167]">Try clearing your search or switching categories.</p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-[#013326] text-white text-xs font-bold mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.product_id}
              product={p}
              onQuickView={(prod) => setQuickViewProduct(prod)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.product_id}
              className="bg-white rounded-3xl border border-[#e2eae5] shadow-card hover:shadow-hover p-5 sm:p-6 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                <div className="w-16 h-16 rounded-2xl bg-[#f1f6f3] flex items-center justify-center shrink-0 border border-[#e2eae5]">
                  <ShoppingBag className="w-7 h-7 text-[#15c089]" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f1f6f3] text-[#013326]">
                      {prod.category}
                    </span>
                    <span className="text-[11px] font-mono text-[#5c7167]">SKU: {prod.product_id}</span>
                    <span className="flex items-center space-x-0.5 text-xs text-amber-500 font-bold ml-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{prod.rating ?? 4.8}</span>
                    </span>
                  </div>

                  <Link
                    href={`/shop/${prod.product_id}`}
                    className="text-base font-extrabold text-[#013326] hover:text-[#0c835c] transition-colors block truncate"
                  >
                    {prod.name}
                  </Link>
                  <p className="text-xs text-[#5c7167] line-clamp-1">
                    {prod.description || "Authentic marketplace item with official distributor warranty."}
                  </p>

                  {/* Polymorphic Spec Highlights */}
                  <div className="flex flex-wrap gap-2 text-[11px] text-[#5c7167] pt-1">
                    {prod.screen_size && <span>Display: <strong>{prod.screen_size}</strong></span>}
                    {prod.warranty && <span>Warranty: <strong>{prod.warranty}</strong></span>}
                    {prod.size && <span>Size: <strong>{prod.size}</strong></span>}
                    {prod.colours && <span>Colors: <strong>{prod.colours.join(", ")}</strong></span>}
                    {prod.weight && <span>Net: <strong>{prod.weight}</strong></span>}
                    {prod.expiry_date && <span>Exp: <strong>{prod.expiry_date}</strong></span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end w-full md:w-auto space-x-6 border-t md:border-t-0 pt-3 md:pt-0 border-[#f1f6f3]">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-bold text-[#5c7167] block">Price</span>
                  <span className="text-xl font-black text-[#013326] font-mono">
                    {formatPrice(prod.price)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuickViewProduct(prod)}
                    className="p-2.5 rounded-xl border border-[#e2eae5] text-[#5c7167] hover:bg-[#f1f6f3] transition-colors cursor-pointer"
                    title="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => addToCart(prod, 1)}
                    className="px-4 py-2.5 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#15c089]" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
