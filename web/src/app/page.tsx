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
  Check,
  Eye,
  QrCode,
  Radio,
  Package,
  Award,
  TrendingUp,
  Plus,
} from "lucide-react";

export default function StorefrontHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "low" | "high" | "rating">("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  // Flash Deals Countdown Timer (ticks every second)
  const [flashTimeLeft, setFlashTimeLeft] = useState({ hours: 6, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Rentify Marketplace Promos and Hero Carousel Banners
  const promotionalBanners = [
    {
      id: "multi-category-store",
      title: "Rentify Marketplace",
      subtitle: "Discover featured products across fashion, beauty, homeware, children’s products and Cambodian-made gifts.",
      image: "/assets/ads/multi-category-store-landscape.png",
      link: "/shop",
      category: "All",
      imageOnly: false,
      sponsoredLabel: "Curated by Rentify Marketplace · Marketplace edit",
      eyebrow: "Rentify Marketplace week",
      offer: "Special finds from trusted stores",
      ctaLabel: "Shop featured products",
      secondaryLabel: "Browse categories",
      secondaryLink: "/shop",
      badge: "Marketplace edit",
    },
    {
      id: "promo-mid-autumn",
      title: "Mid-Autumn Festival · សែនព្រះខែ",
      subtitle: "Special Offer: Mooncakes and festival gift sets",
      image: "/assets/ads/promo-mid-autumn.webp",
      link: "/shop?category=Groceries",
      category: "Groceries",
      imageOnly: true,
      offer: "Mid-Autumn Festival · សែនព្រះខែ",
    },
    {
      id: "premium-supermarket",
      title: "Mekong Fresh Market",
      subtitle: "Fresh groceries, pantry favourites and household essentials from a trusted Cambodian store—all in one order.",
      image: "/assets/ads/premium-supermarket-landscape.png",
      link: "/shop?category=Groceries",
      category: "Groceries",
      imageOnly: false,
      sponsoredLabel: "Curated by Rentify Marketplace · Groceries",
      eyebrow: "This week at Mekong Fresh Market",
      offer: "Fresh picks for the whole home",
      ctaLabel: "Browse groceries",
      secondaryLabel: "Explore stores",
      secondaryLink: "/shop",
      badge: "Groceries",
    },
    {
      id: "promo-khmer-products",
      title: "Khmer Products",
      subtitle: "Cambodian-made rice, water, dairy and household goods",
      image: "/assets/ads/promo-khmer-products.webp",
      link: "/shop?category=Groceries",
      category: "Groceries",
      imageOnly: true,
      offer: "Khmer Products",
    },
    {
      id: "promo-organic-foods",
      title: "Organic Foods",
      subtitle: "Organic rice, oils, juices and pantry staples",
      image: "/assets/ads/promo-organic-foods.webp",
      link: "/shop?category=Groceries",
      category: "Groceries",
      imageOnly: true,
      offer: "Organic Foods",
    },
    {
      id: "promo-carton-sale",
      title: "Carton Sale",
      subtitle: "Drinks and household staples by the carton",
      image: "/assets/ads/promo-carton-sale.webp",
      link: "/shop?category=Groceries",
      category: "Groceries",
      imageOnly: true,
      offer: "Carton Sale",
    },
    {
      id: "promo-pre-pack-foods",
      title: "Pre-Pack Foods",
      subtitle: "Ready-to-cook meal packs, prepared fresh",
      image: "/assets/ads/promo-pre-pack-foods.webp",
      link: "/shop?category=Groceries",
      category: "Groceries",
      imageOnly: true,
      offer: "Pre-Pack Foods",
    },
  ];

  const [isPaused, setIsPaused] = useState(false);

  // Carousel auto-advance (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % promotionalBanners.length);
    }, 5500);
    return () => clearInterval(slideInterval);
  }, [isPaused, promotionalBanners.length]);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % promotionalBanners.length);
  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + promotionalBanners.length) % promotionalBanners.length);

  // Specific categorized slices for shelves and quadrants
  const isFoodCategory = (p: Product) =>
    p.category === "Food & Groceries" ||
    p.category === "Groceries" ||
    p.category_slug === "food-groceries" ||
    (p.category_aliases && p.category_aliases.includes("Groceries"));

  const isFashionCategory = (p: Product) =>
    p.category === "Fashion & Accessories" ||
    p.category === "Clothing" ||
    p.category_slug === "fashion" ||
    (p.category_aliases && p.category_aliases.includes("Clothing"));

  const isElectronicsCategory = (p: Product) =>
    p.category === "Electronics" || p.category_slug === "electronics";

  const isHomeCategory = (p: Product) =>
    p.category === "Home & Living" || p.category_slug === "home-living";

  const isBeautyCategory = (p: Product) =>
    p.category === "Beauty & Wellness" || p.category_slug === "beauty-wellness";

  const isArtsCategory = (p: Product) =>
    p.category === "Arts & Culture" || p.category_slug === "arts-culture";

  const matchesCategory = (p: Product, cat: string) => {
    if (cat === "All") return true;
    if (cat === "Food & Groceries" || cat === "Groceries") return isFoodCategory(p);
    if (cat === "Fashion & Accessories" || cat === "Clothing") return isFashionCategory(p);
    if (cat === "Electronics") return isElectronicsCategory(p);
    if (cat === "Home & Living") return isHomeCategory(p);
    if (cat === "Beauty & Wellness") return isBeautyCategory(p);
    if (cat === "Arts & Culture") return isArtsCategory(p);
    return p.category === cat;
  };

  const electronicsProducts = useMemo(
    () => products.filter(isElectronicsCategory),
    [products]
  );
  const clothingProducts = useMemo(
    () => products.filter(isFashionCategory),
    [products]
  );
  const groceriesProducts = useMemo(
    () => products.filter(isFoodCategory),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => matchesCategory(p, selectedCategory))
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
      {/* 1. ADVERTISEMENT CAROUSEL BANNER */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full aspect-[3/1] min-h-[220px] max-h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80 group select-none"
        aria-roledescription="carousel"
        aria-label="Promotions"
      >
        {/* Banner Slides */}
        {promotionalBanners.map((slide, idx) => (
          <Link
            key={slide.id}
            href={slide.link}
            className={`absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out ${
              activeSlide === idx ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-label={slide.title}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              loading={idx === 0 ? "eager" : "lazy"}
            />
          </Link>
        ))}

        {/* Carousel Arrow Controls (Translucent circular discs matching media_1791258316517.png) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous slide"
          className="absolute left-3.5 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/60 text-white shadow-md backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/20 hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next slide"
          className="absolute right-3.5 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/60 text-white shadow-md backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/20 hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Centered Frosted Capsule Dots Indicator */}
        <div
          className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md shadow-md border border-white/60"
          role="tablist"
          aria-label="Choose banner"
        >
          {promotionalBanners.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={activeSlide === i}
              aria-label={`Show ${slide.title}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveSlide(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === i
                  ? "w-6 bg-blue-600"
                  : "w-2 bg-slate-900/25 hover:bg-slate-900/50"
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
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                    {item.name}
                  </p>
                  <p className="text-[10px] font-mono font-bold text-slate-900">
                    {formatPrice(item.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/shop?category=Electronics"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between"
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
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                    {item.name}
                  </p>
                  <p className="text-[10px] font-mono font-bold text-slate-900">
                    {formatPrice(item.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/shop?category=Clothing"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between"
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
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                    {item.name}
                  </p>
                  <p className="text-[10px] font-mono font-bold text-slate-900">
                    {formatPrice(item.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/shop?category=Groceries"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between"
          >
            <span>Shop organic food & pantry</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Box 4: Rentify Prime Benefits */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Rentify Prime Benefits
            </h3>
            <p className="text-[11px] text-slate-500 mb-3.5">Express logistics & Bakong payment</p>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                <QrCode className="w-5 h-5 text-blue-600" />
                <p className="text-[11px] font-bold text-slate-900">Bakong KHQR</p>
                <p className="text-[9px] text-slate-500">Zero transaction fees</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                <Truck className="w-5 h-5 text-blue-600" />
                <p className="text-[11px] font-bold text-slate-900">800 Riders</p>
                <p className="text-[9px] text-slate-500">Fixture GPS illustration</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                <Zap className="w-5 h-5 text-blue-600" />
                <p className="text-[11px] font-bold text-slate-900">Free Delivery</p>
                <p className="text-[9px] text-slate-500">On orders over $30</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                <Award className="w-5 h-5 text-blue-600" />
                <p className="text-[11px] font-bold text-slate-900">VIP Rewards</p>
                <p className="text-[9px] text-slate-500">Neo4j social points</p>
              </div>
            </div>
          </div>

          <Link
            href="/account"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between"
          >
            <span>View your member benefits</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. FLASH DEALS WITH LIVE COUNTDOWN & INVENTORY CLAIM BARS */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-rose-600/30 text-rose-400 border border-rose-500/40">
                <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Lightning Flash Deals
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                Up to 40% Off
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Limited-time discounts refreshed hourly across authentic Cambodian merchants.
            </p>
          </div>

          {/* Live Countdown Clock */}
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-2xl shadow-inner">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ends In:</span>
            <div className="flex items-center space-x-1 font-mono text-sm font-black text-amber-400">
              <span className="bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                {String(flashTimeLeft.hours).padStart(2, "0")}
              </span>
              <span>:</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                {String(flashTimeLeft.minutes).padStart(2, "0")}
              </span>
              <span>:</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 text-rose-400">
                {String(flashTimeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Flash Deals 4-Item Grid with Inventory Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.slice(0, 4).map((item, idx) => {
            const claimPct = [84, 91, 68, 76][idx % 4];
            const stockLeft = [3, 2, 6, 4][idx % 4];
            const flashDiscount = [25, 30, 20, 35][idx % 4];
            const originalPrice = item.price * (1 + flashDiscount / 100);

            return (
              <div
                key={item.product_id}
                className="bg-white text-slate-900 rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                    <Link href={`/shop/${item.product_id}`} className="block w-full h-full">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black shadow-xs">
                      -{flashDiscount}% OFF
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(item)}
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/95 text-slate-700 hover:text-slate-950 shadow-md border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Category & Title */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <Link href={`/shop/${item.product_id}`} className="block">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                    </Link>

                    {/* Price Block */}
                    <div className="flex items-baseline space-x-2 pt-1">
                      <span className="text-base font-black font-mono text-slate-900">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-xs font-mono text-slate-400 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    </div>

                    {/* Inventory Claim Bar */}
                    <div className="pt-2 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-semibold">
                        <span className="text-rose-600 font-bold">{claimPct}% Claimed</span>
                        <span className="text-slate-500">Only {stockLeft} left!</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 rounded-full transition-all duration-500"
                          style={{ width: `${claimPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-emerald-700 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" />
                    <span>Express 2hr Dispatch</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(item, 1);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Claim Deal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
          <span>⚡ Lightning deals claim allocation reserves units in cart for 15 minutes.</span>
          <Link
            href="/shop"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1 transition-colors"
          >
            <span>View All Deals</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
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
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
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
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
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
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
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

      {/* 6. TRUST & ADVANTAGE BADGES (INFINITE SCROLLING LOOP) */}
      <section className="relative w-full overflow-hidden py-1">
        {/* Soft edge fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />

        <div className="flex animate-marquee gap-4 sm:gap-5 py-2">
          {[
            // Set 1
            { icon: Truck, title: "Express Delivery Fleet", subtitle: "Phnom Penh & Siem Reap dispatch" },
            { icon: CreditCard, title: "Bakong KHQR Payments", subtitle: "Zero fee instant scan with 20+ banks" },
            { icon: ShieldCheck, title: "100% Authentic Products", subtitle: "Verified official seller warranty" },
            { icon: CheckCircle2, title: "24/7 Dedicated Support", subtitle: "Khmer & English bilingual team" },
            // Set 2
            { icon: Truck, title: "Express Delivery Fleet", subtitle: "Phnom Penh & Siem Reap dispatch" },
            { icon: CreditCard, title: "Bakong KHQR Payments", subtitle: "Zero fee instant scan with 20+ banks" },
            { icon: ShieldCheck, title: "100% Authentic Products", subtitle: "Verified official seller warranty" },
            { icon: CheckCircle2, title: "24/7 Dedicated Support", subtitle: "Khmer & English bilingual team" },
            // Set 3
            { icon: Truck, title: "Express Delivery Fleet", subtitle: "Phnom Penh & Siem Reap dispatch" },
            { icon: CreditCard, title: "Bakong KHQR Payments", subtitle: "Zero fee instant scan with 20+ banks" },
            { icon: ShieldCheck, title: "100% Authentic Products", subtitle: "Verified official seller warranty" },
            { icon: CheckCircle2, title: "24/7 Dedicated Support", subtitle: "Khmer & English bilingual team" },
            // Set 4
            { icon: Truck, title: "Express Delivery Fleet", subtitle: "Phnom Penh & Siem Reap dispatch" },
            { icon: CreditCard, title: "Bakong KHQR Payments", subtitle: "Zero fee instant scan with 20+ banks" },
            { icon: ShieldCheck, title: "100% Authentic Products", subtitle: "Verified official seller warranty" },
            { icon: CheckCircle2, title: "24/7 Dedicated Support", subtitle: "Khmer & English bilingual team" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="shrink-0 min-w-[280px] sm:min-w-[310px] bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center space-x-3.5 hover:border-slate-300 hover:shadow-md transition-all select-none"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 whitespace-nowrap">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 whitespace-nowrap">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
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
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>Open Dedicated Catalog Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Pills and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              "All",
              "Food & Groceries",
              "Fashion & Accessories",
              "Electronics",
              "Home & Living",
              "Beauty & Wellness",
              "Arts & Culture",
            ].map((cat) => {
              const count =
                cat === "All"
                  ? products.length
                  : products.filter((p) => matchesCategory(p, cat)).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-xs font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedCategory === cat ? "bg-white/20 text-white" : "bg-white text-slate-500"
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
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100/80 border border-slate-200/80 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
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
