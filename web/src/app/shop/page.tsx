"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types";
import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/customer/ProductCard";
import { QuickViewModal } from "@/components/shared/QuickViewModal";
import {
  Search,
  Grid,
  List,
  X,
  ShoppingBag,
  Plus,
  Eye,
  Star,
  Check,
  Heart,
  ShieldCheck,
  Filter,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

function ShopCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState<"all" | "under25" | "25to100" | "100to300" | "over300">("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "low" | "high" | "rating">("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Sync when search params change in url
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get("search");
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

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

  const priceRangeOptions = [
    { id: "all", label: "All Prices" },
    { id: "under25", label: "Under $25" },
    { id: "25to100", label: "$25 to $100" },
    { id: "100to300", label: "$100 to $300" },
    { id: "over300", label: "$300+" },
  ] as const;

  const handleAddToList = (prod: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod, 1);
    setJustAddedId(prod.product_id);
    setTimeout(() => {
      setJustAddedId((curr) => (curr === prod.product_id ? null : curr));
    }, 1200);
  };

  const resetAllFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setPriceRange("all");
    setInStockOnly(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    searchQuery.trim() !== "" ||
    priceRange !== "all" ||
    inStockOnly ||
    sortBy !== "featured";

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => (selectedCategory === "All" ? true : p.category === selectedCategory))
      .filter((p) => {
        if (priceRange === "under25") return p.price < 25;
        if (priceRange === "25to100") return p.price >= 25 && p.price <= 100;
        if (priceRange === "100to300") return p.price > 100 && p.price <= 300;
        if (priceRange === "over300") return p.price > 300;
        return true;
      })
      .filter((p) => {
        if (inStockOnly) return (p.stock ?? 0) > 0;
        return true;
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.product_id.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "low") return a.price - b.price;
        if (sortBy === "high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating ?? 4.5) - (a.rating ?? 4.5);
        return 0;
      });
  }, [products, selectedCategory, priceRange, inStockOnly, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Catalog</span>
            {selectedCategory !== "All" && (
              <>
                <span>/</span>
                <span className="text-emerald-700 font-semibold">{selectedCategory}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Explore Marketplace Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Official distributors, authentic local Cambodian products & real-time inventory
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of{" "}
            {products.length} products
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
        {/* Row 1: Category Filter Pills */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => {
              const count =
                cat === "All" ? products.length : products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedCategory === cat
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* In-Stock Only Toggle & View Switcher */}
          <div className="flex items-center space-x-3 text-xs">
            <label className="flex items-center space-x-2 text-slate-700 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>

            <div className="hidden sm:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Search, Price Range and Sort By */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Price Range Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-slate-400" />
              <span>Price:</span>
            </span>
            {priceRangeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPriceRange(opt.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  priceRange === opt.id
                    ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-300"
                    : "text-slate-600 hover:bg-slate-100 border border-transparent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search Input & Sort Dropdown */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-slate-100/80 border border-slate-200/80 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100/80 border border-slate-200/80 text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="low">Sort: Price Low → High</option>
              <option value="high">Sort: Price High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Listing */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 animate-pulse space-y-4"
            >
              <div className="aspect-[4/3] bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-200/80 shadow-xs space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No products matched your criteria</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your price range, search term, or category filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold mt-2 hover:bg-slate-800 cursor-pointer transition-colors"
          >
            Reset All Filters
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
        /* Rich List View with Wishlist, Compare-at Price, Verified Badge, and Tactile Add */
        <div className="space-y-3.5">
          {filteredProducts.map((prod) => {
            const hasDiscount =
              (prod.price > 40 && prod.price < 500) || prod.category === "Electronics";
            const compareAtPrice = hasDiscount ? prod.price * 1.18 : null;
            const isSaved = isInWishlist(prod.product_id);
            const isJustAdded = justAddedId === prod.product_id;

            return (
              <div
                key={prod.product_id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md p-4 sm:p-5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
              >
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  {/* Thumbnail with Wishlist Toggle */}
                  <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 relative">
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}

                    {/* Heart button inside thumbnail */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(prod);
                      }}
                      className={`absolute top-1.5 right-1.5 p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-xs ${
                        isSaved
                          ? "bg-rose-50 text-rose-500"
                          : "bg-white/80 text-slate-500 hover:text-rose-500"
                      }`}
                      title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {prod.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        SKU: {prod.product_id}
                      </span>
                      <span className="flex items-center space-x-0.5 text-xs text-amber-500 font-semibold ml-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{prod.rating ?? 4.8}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({prod.reviews_count ?? 35})
                        </span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium flex items-center space-x-0.5 hidden sm:inline-flex">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Store</span>
                      </span>
                    </div>

                    <Link
                      href={`/shop/${prod.product_id}`}
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors block truncate"
                    >
                      {prod.name}
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {prod.description ||
                        "Authentic marketplace item distributed with official warranty and rapid delivery."}
                    </p>

                    {/* Polymorphic Spec Highlights */}
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 pt-0.5">
                      {prod.screen_size && (
                        <span>
                          Display: <strong className="text-slate-800">{prod.screen_size}</strong>
                        </span>
                      )}
                      {prod.warranty && (
                        <span>
                          Warranty: <strong className="text-slate-800">{prod.warranty}</strong>
                        </span>
                      )}
                      {prod.size && (
                        <span>
                          Size: <strong className="text-slate-800">{prod.size}</strong>
                        </span>
                      )}
                      {prod.colours && (
                        <span>
                          Colors: <strong className="text-slate-800">{prod.colours.join(", ")}</strong>
                        </span>
                      )}
                      {prod.weight && (
                        <span>
                          Net: <strong className="text-slate-800">{prod.weight}</strong>
                        </span>
                      )}
                      {prod.expiry_date && (
                        <span>
                          Exp: <strong className="text-slate-800">{prod.expiry_date}</strong>
                        </span>
                      )}
                      <span className="text-emerald-700 font-medium">
                        • {prod.stock ?? 25} units available
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end w-full md:w-auto space-x-5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                      Price
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
                        {formatPrice(prod.price)}
                      </span>
                      {compareAtPrice && (
                        <span className="text-xs font-mono text-slate-400 line-through">
                          {formatPrice(compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuickViewProduct(prod)}
                      className="p-2.5 rounded-xl border border-slate-200/80 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleAddToList(prod, e)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-all active:scale-95 cursor-pointer ${
                        isJustAdded
                          ? "bg-emerald-600 text-white ring-2 ring-emerald-500/30"
                          : "bg-slate-900 hover:bg-emerald-600 text-white"
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4 text-white animate-in zoom-in" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-emerald-400" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

export default function ShopCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
          Loading marketplace catalog...
        </div>
      }
    >
      <ShopCatalogContent />
    </Suspense>
  );
}
