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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const CATEGORY_MAP: Record<string, string> = {
  "food-groceries": "Food & Groceries",
  "groceries": "Food & Groceries",
  "Groceries": "Food & Groceries",
  "food": "Food & Groceries",
  "Food": "Food & Groceries",
  "Food & Groceries": "Food & Groceries",
  "fashion": "Fashion & Accessories",
  "fashion-accessories": "Fashion & Accessories",
  "clothing": "Fashion & Accessories",
  "Clothing": "Fashion & Accessories",
  "Fashion & Accessories": "Fashion & Accessories",
  "electronics": "Electronics",
  "Electronics": "Electronics",
  "home-living": "Home & Living",
  "Home & Living": "Home & Living",
  "home": "Home & Living",
  "Home": "Home & Living",
  "beauty-wellness": "Beauty & Wellness",
  "Beauty & Wellness": "Beauty & Wellness",
  "beauty": "Beauty & Wellness",
  "Beauty": "Beauty & Wellness",
  "arts-culture": "Arts & Culture",
  "Arts & Culture": "Arts & Culture",
  "arts": "Arts & Culture",
  "Arts": "Arts & Culture",
};

function normalizeCategory(param: string | null): string {
  if (!param || param === "All") return "All";
  return CATEGORY_MAP[param] || param;
}

function ShopCatalogContent() {
  const searchParams = useSearchParams();
  const rawCat = searchParams.get("category");
  const rawSub = searchParams.get("subcategory");
  const initialCategory = normalizeCategory(rawCat);
  const initialSubcategory = rawSub || "all";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState<"all" | "under25" | "25to100" | "100to300" | "over300">("all");
  const [maxPrice, setMaxPrice] = useState(500);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "low" | "high" | "rating">("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Sync when search params change in url
  useEffect(() => {
    const cat = searchParams.get("category");
    setSelectedCategory(normalizeCategory(cat));
    const sub = searchParams.get("subcategory");
    setSelectedSubcategory(sub || "all");
    const q = searchParams.get("search");
    if (q !== null) setSearchQuery(q);
    setCurrentPage(1);
  }, [searchParams]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, searchQuery, priceRange, maxPrice, inStockOnly, sortBy]);

  // Fetch live products directly from NestJS MongoDB backend
  useEffect(() => {
    let isCancelled = false;
    async function loadData() {
      setLoading(true);
      const data = await fetchProducts(
        selectedCategory !== "All" ? selectedCategory : undefined,
        searchQuery.trim() ? searchQuery.trim() : undefined,
        selectedSubcategory !== "all" ? selectedSubcategory : undefined
      );
      if (!isCancelled) {
        setProducts(data);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, searchQuery, selectedSubcategory]);

  const categories = [
    "All",
    "Food & Groceries",
    "Fashion & Accessories",
    "Electronics",
    "Home & Living",
    "Beauty & Wellness",
    "Arts & Culture",
  ];

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
    setSelectedSubcategory("all");
    setSearchQuery("");
    setPriceRange("all");
    setMaxPrice(500);
    setInStockOnly(false);
    setSortBy("featured");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedSubcategory !== "all" ||
    searchQuery.trim() !== "" ||
    priceRange !== "all" ||
    maxPrice < 500 ||
    inStockOnly ||
    sortBy !== "featured";

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (priceRange === "under25") return p.price < 25;
        if (priceRange === "25to100") return p.price >= 25 && p.price <= 100;
        if (priceRange === "100to300") return p.price > 100 && p.price <= 300;
        if (priceRange === "over300") return p.price > 300;
        return true;
      })
      .filter((p) => (maxPrice < 500 ? p.price <= maxPrice : true))
      .filter((p) => {
        if (inStockOnly) return (p.stock ?? 0) > 0;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "low") return a.price - b.price;
        if (sortBy === "high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating ?? 4.5) - (a.rating ?? 4.5);
        return 0;
      });
  }, [products, priceRange, maxPrice, inStockOnly, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, safePage, pageSize]);

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
                <span className="text-blue-600 font-semibold">{selectedCategory}</span>
              </>
            )}
            {selectedSubcategory !== "all" && (
              <>
                <span>/</span>
                <span className="text-slate-800 font-semibold capitalize inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                  <span>{selectedSubcategory.replace(/-/g, " ")}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory("all")}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer font-bold"
                    title="Clear subcategory filter"
                  >
                    ×
                  </button>
                </span>
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
                cat === "All"
                  ? products.length
                  : products.filter(
                      (p) =>
                        p.category === cat ||
                        (p.category_slug && p.category_slug === cat.toLowerCase()) ||
                        (p.category_aliases && p.category_aliases.includes(cat)) ||
                        (cat === "Food & Groceries" && (p.category === "Groceries" || p.category === "Food")) ||
                        (cat === "Fashion & Accessories" && (p.category === "Clothing" || p.category === "Fashion"))
                    ).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedSubcategory("all");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-xs font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedCategory === cat
                        ? "bg-white/20 text-white"
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
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
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

        {/* Row 2: Search, Price Presets, Price Slider and Sort By */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Price Range Pills & Interactive Slider */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 flex-wrap gap-y-1.5">
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
                    ? "bg-blue-50 text-blue-800 font-bold border border-blue-300"
                    : "text-slate-600 hover:bg-slate-100 border border-transparent"
                }`}
              >
                {opt.label}
              </button>
            ))}

            {/* Interactive Price Range Slider */}
            <div className="flex items-center space-x-2 pl-2 sm:ml-1 border-l border-slate-200">
              <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                Max: <strong className="font-mono text-blue-600">{formatPrice(maxPrice)}</strong>
              </span>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-20 sm:w-28 h-1.5 accent-blue-600 cursor-pointer"
                title={`Filter up to ${formatPrice(maxPrice)}`}
              />
            </div>
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
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-slate-100/80 border border-slate-200/80 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
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

        {/* Active Filter Tags Row */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Filters:
            </span>
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <span>Category: {selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedSubcategory("all");
                  }}
                  className="hover:text-blue-900 font-bold ml-0.5 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
            {selectedSubcategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <span>Subcategory: {selectedSubcategory.replace(/-/g, " ")}</span>
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory("all")}
                  className="hover:text-blue-900 font-bold ml-0.5 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
            {maxPrice < 500 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <span>Max: {formatPrice(maxPrice)}</span>
                <button
                  type="button"
                  onClick={() => setMaxPrice(500)}
                  className="hover:text-blue-900 font-bold ml-0.5 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
            {priceRange !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <span>Range: {priceRangeOptions.find((p) => p.id === priceRange)?.label}</span>
                <button
                  type="button"
                  onClick={() => setPriceRange("all")}
                  className="hover:text-blue-900 font-bold ml-0.5 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span>In-Stock Only</span>
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="hover:text-emerald-900 font-bold ml-0.5 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery.trim() !== "" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <span>Search: &quot;{searchQuery}&quot;</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="hover:text-blue-900 font-bold ml-0.5 cursor-pointer"
                >
                  ×
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 ml-1 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}
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
          {paginatedProducts.map((p) => (
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
          {paginatedProducts.map((prod) => {
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
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 transition-colors block truncate"
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
                          ? "bg-blue-600 text-white ring-2 ring-blue-500/30"
                          : "bg-slate-900 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4 text-white animate-in zoom-in" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-blue-400" />
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredProducts.length === 0 ? 0 : (safePage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-900">
              {Math.min(safePage * pageSize, filteredProducts.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-900">{filteredProducts.length}</span> products
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={safePage === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    safePage === pageNum
                      ? "bg-blue-600 text-white shadow-xs font-bold"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, totalPages));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={safePage === totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
