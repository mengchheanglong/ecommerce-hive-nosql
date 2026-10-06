"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/customer/ProductCard";
import { QuickViewModal } from "@/components/shared/QuickViewModal";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Zap,
  CreditCard,
  Search,
  Layers,
  Star,
  Flame,
  Clock,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Shirt,
  Apple,
  Home,
  Tag,
  CheckCircle2,
  QrCode,
  Radio,
  Package,
  Award,
  TrendingUp,
} from "lucide-react";

export default function StorefrontHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "low" | "high" | "rating">("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  // Flash deal countdown timer state (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 29 });

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

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 6, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Carousel auto-advance
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 6500);
    return () => clearInterval(slideInterval);
  }, []);

  const heroSlides = [
    {
      id: 0,
      eyebrow: "⚡ FLASH TECH GALA",
      title: "Flagship AMOLED Smartphones & 4K Ultra-Wide Displays",
      description:
        "Official distributor warranty, 120Hz refresh rates, and NBC Bakong KHQR instant scan settlement.",
      cta: "Explore Electronics Deals",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
      accent: "from-slate-950 via-slate-900 to-emerald-950",
      badge: "Up to 25% OFF",
    },
    {
      id: 1,
      eyebrow: "🌿 CAMBODIAN HERITAGE",
      title: "Handwoven Takeo Silk & Breathable Natural Linen",
      description:
        "Authentic Cambodian heritage weavers crafting comfortable tropical fashion designed for city commutes.",
      cta: "Shop Apparel & Silk",
      category: "Clothing",
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=80",
      accent: "from-slate-950 via-slate-900 to-amber-950",
      badge: "Artisanal Silk",
    },
    {
      id: 2,
      eyebrow: "🌾 FARM-TO-DOOR ORGANICS",
      title: "GI-Certified Kampot Black Pepper & Fragrant Jasmine Rice",
      description:
        "Sourced directly from cooperatives in Kampot and Battambang. 100% natural organic harvest.",
      cta: "Browse Farm Organics",
      category: "Groceries",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      accent: "from-slate-950 via-slate-900 to-teal-950",
      badge: "GI Certified",
    },
  ];

  // Specific categorized slices for shelves and quadrants
  const electronicsProducts = useMemo(
    () => products.filter((p) => p.category === "Electronics"),
    [products]
  );
  const clothingProducts = useMemo(
    () => products.filter((p) => p.category === "Clothing"),
    [products]
  );
  const groceriesProducts = useMemo(
    () => products.filter((p) => p.category === "Groceries"),
    [products]
  );

  // Lightning deals selection
  const lightningDeals = useMemo(() => {
    return [
      products.find((p) => p.product_id === "P2210") || products[0],
      products.find((p) => p.product_id === "P2211") || products[1],
      products.find((p) => p.product_id === "P3315") || products[2],
      products.find((p) => p.product_id === "P0875") || products[3],
    ].filter(Boolean) as Product[];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => (selectedCategory === "All" ? true : p.category === selectedCategory))
      .filter((p) =>
        searchQuery === ""
          ? true
          : p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === "low") return a.price - b.price;
        if (sortBy === "high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-10">
      {/* 1. HERO PROMOTIONAL BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white min-h-[360px] sm:min-h-[400px] flex flex-col justify-between shadow-[0_12px_36px_rgba(0,0,0,0.18)] border border-slate-800">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              activeSlide === idx ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-center brightness-40 scale-105"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} opacity-85`} />

            {/* Slide Content */}
            <div className="relative z-10 h-full p-6 sm:p-12 flex flex-col justify-between max-w-2xl">
              <div className="space-y-3.5">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 backdrop-blur-md">
                    {slide.eyebrow}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold backdrop-blur-md">
                    {slide.badge}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {slide.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
                  {slide.description}
                </p>
              </div>

              <div className="pt-4 flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedCategory(slide.category);
                    const el = document.getElementById("catalog-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/shop"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all border border-white/20"
                >
                  Browse Full Catalog ({products.length})
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicator Dots */}
        <div className="relative z-20 pb-5 pl-6 sm:pl-12 flex items-center space-x-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeSlide === i ? "w-8 bg-emerald-400" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. SIGNATURE AMAZON 4-CARD QUADRANT FEATURE BOXES */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Box 1: Electronics Top Deals */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Deals in Electronics
            </h3>
            <p className="text-[11px] text-slate-500 mb-3.5">Top-rated gadgets & displays</p>

            <div className="grid grid-cols-2 gap-2.5">
              {electronicsProducts.slice(0, 4).map((item) => (
                <Link
                  key={item.product_id}
                  href={`/shop/${item.product_id}`}
                  className="group block bg-slate-50 rounded-xl p-2 border border-slate-100 hover:border-slate-300 transition-colors"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Smartphone className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700">
                    {item.name}
                  </p>
                  <p className="text-[10px] font-mono font-bold text-emerald-700">
                    {formatPrice(item.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/shop?category=Electronics"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-between"
          >
            <span>See all electronics deals</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Box 2: Authentic Cambodian Fashion */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Cambodian Heritage Fashion
            </h3>
            <p className="text-[11px] text-slate-500 mb-3.5">Handwoven silk & organic linen</p>

            <div className="grid grid-cols-2 gap-2.5">
              {clothingProducts.slice(0, 4).map((item) => (
                <Link
                  key={item.product_id}
                  href={`/shop/${item.product_id}`}
                  className="group block bg-slate-50 rounded-xl p-2 border border-slate-100 hover:border-slate-300 transition-colors"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Shirt className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700">
                    {item.name}
                  </p>
                  <p className="text-[10px] font-mono font-bold text-emerald-700">
                    {formatPrice(item.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/shop?category=Clothing"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-between"
          >
            <span>Explore apparel & silk</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Box 3: Farm-Fresh Organics & Pantry */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              GI Organics & Pantry
            </h3>
            <p className="text-[11px] text-slate-500 mb-3.5">PGI Kampot pepper & jasmine rice</p>

            <div className="grid grid-cols-2 gap-2.5">
              {groceriesProducts.slice(0, 4).map((item) => (
                <Link
                  key={item.product_id}
                  href={`/shop/${item.product_id}`}
                  className="group block bg-slate-50 rounded-xl p-2 border border-slate-100 hover:border-slate-300 transition-colors"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Apple className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700">
                    {item.name}
                  </p>
                  <p className="text-[10px] font-mono font-bold text-emerald-700">
                    {formatPrice(item.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/shop?category=Groceries"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-between"
          >
            <span>Shop organic food & pantry</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Box 4: KhmerCart Prime Services */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              KhmerCart Prime Benefits
            </h3>
            <p className="text-[11px] text-slate-500 mb-3.5">Express logistics & Bakong payment</p>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <p className="text-[11px] font-bold text-slate-900">Bakong KHQR</p>
                <p className="text-[9px] text-slate-500">Zero transaction fees</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                <Truck className="w-5 h-5 text-emerald-600" />
                <p className="text-[11px] font-bold text-slate-900">800 Riders</p>
                <p className="text-[9px] text-slate-500">Live Cassandra GPS</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                <Zap className="w-5 h-5 text-emerald-600" />
                <p className="text-[11px] font-bold text-slate-900">Free Delivery</p>
                <p className="text-[9px] text-slate-500">On orders over $30</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                <Award className="w-5 h-5 text-emerald-600" />
                <p className="text-[11px] font-bold text-slate-900">VIP Rewards</p>
                <p className="text-[9px] text-slate-500">Neo4j social points</p>
              </div>
            </div>
          </div>

          <Link
            href="/account"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-between"
          >
            <span>View your member benefits</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. LIGHTNING DEALS SECTION WITH LIVE COUNTDOWN TIMER */}
      <section className="bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-rose-900/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Flame className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  Today&apos;s Lightning Deals
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                  Limited Quantities
                </span>
              </div>
              <p className="text-xs text-rose-200/80 mt-0.5">
                Steep discounts on top-rated electronics and local artisanal picks
              </p>
            </div>
          </div>

          {/* Live Urgency Countdown Clock */}
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
            <Clock className="w-4 h-4 text-rose-400" />
            <span className="text-xs text-slate-300 font-medium mr-1">Ends in:</span>
            <div className="flex items-center space-x-1 font-mono font-bold text-sm text-white">
              <span className="px-2 py-0.5 bg-black/40 rounded-lg">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span>:</span>
              <span className="px-2 py-0.5 bg-black/40 rounded-lg">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span>:</span>
              <span className="px-2 py-0.5 bg-black/40 rounded-lg text-rose-400">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Lightning Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lightningDeals.map((p) => {
            const wasPrice = p.price * 1.25;
            return (
              <div
                key={p.product_id}
                className="bg-white rounded-2xl p-4 text-slate-900 flex flex-col justify-between shadow-lg relative group"
              >
                <div>
                  <Link href={`/shop/${p.product_id}`} className="block relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold rounded-full shadow-xs">
                      -20% OFF
                    </span>
                  </Link>

                  <Link href={`/shop/${p.product_id}`} className="block">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {p.name}
                    </h3>
                  </Link>

                  <div className="flex items-center space-x-1 text-amber-500 text-xs mt-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-bold text-slate-800">{p.rating ?? 4.8}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({p.reviews_count ?? 30})
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-base font-bold font-mono text-rose-600">
                      {formatPrice(p.price)}
                    </span>
                    <span className="text-xs font-mono text-slate-400 line-through">
                      {formatPrice(wasPrice)}
                    </span>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Available: {p.stock ?? 15} units</span>
                      <span className="font-bold text-rose-600">85% Sold</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full w-[85%]" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(p, 1)}
                  className="mt-3 w-full py-2 bg-slate-950 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center space-x-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Claim Deal</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. AMAZON-STYLE BEST SELLERS SHELF (ELECTRONICS) */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Best Sellers in Electronics & Tech
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              1-Year Official Distributor Warranty & NBC Bakong KHQR instant scan
            </p>
          </div>
          <Link
            href="/shop?category=Electronics"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>View All ({electronicsProducts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {electronicsProducts.slice(0, 4).map((p, idx) => (
            <ProductCard
              key={p.product_id}
              product={p}
              rankBadge={`#${idx + 1} Best Seller`}
              onQuickView={(prod) => setQuickViewProduct(prod)}
            />
          ))}
        </div>
      </section>

      {/* 5. AMAZON-STYLE SHELF (CAMBODIAN ORGANICS & GROCERIES) */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Top Rated in Cambodian Specialty Organics
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Protected Geographical Indication (PGI) certified Kampot pepper & jasmine rice
            </p>
          </div>
          <Link
            href="/shop?category=Groceries"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>View All ({groceriesProducts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {groceriesProducts.slice(0, 4).map((p, idx) => (
            <ProductCard
              key={p.product_id}
              product={p}
              featuredBadge="GI Certified"
              onQuickView={(prod) => setQuickViewProduct(prod)}
            />
          ))}
        </div>
      </section>

      {/* 6. TRUST & ADVANTAGE BADGES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center space-x-3.5 hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Express Delivery Fleet</h4>
            <p className="text-[11px] text-slate-500">Phnom Penh & Siem Reap dispatch</p>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center space-x-3.5 hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Bakong KHQR Payments</h4>
            <p className="text-[11px] text-slate-500">Zero fee instant scan with 20+ banks</p>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center space-x-3.5 hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Authentic Products</h4>
            <p className="text-[11px] text-slate-500">Verified official seller warranty</p>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center space-x-3.5 hover:border-slate-300 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">24/7 Dedicated Support</h4>
            <p className="text-[11px] text-slate-500">Khmer & English bilingual team</p>
          </div>
        </div>
      </section>

      {/* 7. MAIN CATALOG BROWSER & PRODUCT GRID */}
      <section id="catalog-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore All Marketplace Departments
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredProducts.length} of {products.length} products stored in MongoDB polymorphic catalog
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>Open Dedicated Catalog Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Pills and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["All", "Electronics", "Clothing", "Groceries"].map((cat) => {
              const count = cat === "All" ? products.length : products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-xs font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedCategory === cat ? "bg-emerald-500 text-slate-950" : "bg-white text-slate-500"
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
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100/80 border border-slate-200/80 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100/80 border border-slate-200/80 text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="rating">Customer Rating</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200/80 animate-pulse space-y-4">
                <div className="aspect-[4/3] bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500">No items match your filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
