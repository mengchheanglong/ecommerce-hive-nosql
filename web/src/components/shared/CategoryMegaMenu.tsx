"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES_DATA, CategoryData } from "@/lib/categories";
import { fetchCategoryCounts } from "@/lib/api";
import {
  Store,
  Gift,
  Percent,
  Package,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const SHOP_BY_OPTIONS = [
  { label: "Best sellers", sort: "featured" },
  { label: "New arrivals", sort: "newest" },
  { label: "Top rated", sort: "rating" },
  { label: "Under $5", maxPrice: "5" },
];

export function CategoryMegaMenu() {
  const pathname = usePathname();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [liveCounts, setLiveCounts] = useState<Record<string, number>>({});
  const openTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCategoryCounts().then((counts) => {
      if (counts && Object.keys(counts).length > 0) {
        setLiveCounts(counts);
      }
    });
  }, []);

  const handleMouseEnterItem = (slug: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    openTimerRef.current = setTimeout(() => {
      setOpenSlug(slug);
    }, 90);
  };

  const handleMouseLeaveItem = () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setOpenSlug(null);
    }, 180);
  };

  const handleMouseEnterPanel = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  const handleMouseLeavePanel = () => {
    closeTimerRef.current = setTimeout(() => {
      setOpenSlug(null);
    }, 180);
  };

  // Close when pathname changes
  useEffect(() => {
    setOpenSlug(null);
  }, [pathname]);

  const activeCategory: CategoryData | undefined = CATEGORIES_DATA.find(
    (c) => c.slug === openSlug
  );

  return (
    <div
      className="relative w-full border-t border-slate-200/80 bg-white"
      onMouseLeave={handleMouseLeaveItem}
    >
      {/* Category Links Row */}
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[12.5px] font-medium h-10 select-none overflow-x-auto scrollbar-none"
        aria-label="Product categories"
      >
        <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-4 lg:space-x-5 shrink-0 mx-auto md:mx-0 h-full">
          {CATEGORIES_DATA.map((cat) => {
            const isOpen = openSlug === cat.slug;
            return (
              <div
                key={cat.slug}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleMouseEnterItem(cat.slug)}
              >
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className={`h-full inline-flex items-center px-1.5 transition-colors whitespace-nowrap border-b-2 ${
                    isOpen
                      ? "text-blue-700 font-bold border-blue-600"
                      : "text-slate-700 hover:text-slate-950 border-transparent hover:border-blue-400/50"
                  }`}
                  aria-expanded={isOpen}
                >
                  {cat.name}
                </Link>
              </div>
            );
          })}

          <span className="w-px h-4 bg-slate-300 mx-1.5 shrink-0" aria-hidden="true" />

          {/* 3 Shortcut Action Pills */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full text-[12px] font-bold text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md transition-all whitespace-nowrap shadow-xs"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Stores</span>
          </Link>
          <Link
            href="/shop?category=arts-culture&sub=souvenirs-gifts"
            className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-md transition-all whitespace-nowrap shadow-xs"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Gifts</span>
          </Link>
          <Link
            href="/shop?sale=1"
            className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full text-[12px] font-bold text-white bg-rose-600 hover:bg-rose-700 hover:-translate-y-0.5 hover:shadow-md transition-all whitespace-nowrap shadow-xs"
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Discount</span>
          </Link>
          <Link
            href="/orders"
            className={`inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full text-[12px] font-bold transition-all whitespace-nowrap shadow-xs ${
              pathname?.startsWith("/orders")
                ? "text-white bg-slate-900 ring-2 ring-emerald-500/50"
                : "text-white bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-md"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders</span>
          </Link>
        </div>
      </nav>

      {/* Hover Mega-Menu Panel */}
      {activeCategory && (
        <div
          role="menu"
          aria-label={`${activeCategory.name} subcategories`}
          onMouseEnter={handleMouseEnterPanel}
          onMouseLeave={handleMouseLeavePanel}
          className="absolute top-full left-0 right-0 z-50 w-full border-t border-b border-slate-200/90 bg-white shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 lg:grid-cols-[minmax(420px,1.5fr)_minmax(140px,0.5fr)_400px] gap-8 items-start min-h-[220px]">
            {/* Column 1: Subcategories Multi-Column Grid */}
            <div className="min-w-0">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Subcategories
              </h4>
              <div className="grid grid-rows-6 grid-flow-col gap-x-6 gap-y-1 auto-cols-fr">
                {activeCategory.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/shop?category=${activeCategory.slug}&subcategory=${sub.slug}`}
                    onClick={() => setOpenSlug(null)}
                    className="group flex items-center gap-2 py-1 text-[13px] text-slate-700 hover:text-blue-600 hover:font-semibold transition-colors"
                  >
                    <span className="truncate">{sub.name}</span>
                    <span className="ml-auto text-[10.5px] text-slate-400 font-mono group-hover:text-blue-600">
                      {liveCounts[sub.slug] ?? 0}
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 2: Shop By Filters */}
            <div className="flex flex-col">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Shop by
              </h4>
              <div className="flex flex-col space-y-1.5">
                {SHOP_BY_OPTIONS.map((item) => (
                  <Link
                    key={item.label}
                    href={`/shop?category=${activeCategory.slug}${
                      item.sort ? `&sort=${item.sort}` : ""
                    }${item.maxPrice ? `&maxPrice=${item.maxPrice}` : ""}`}
                    onClick={() => setOpenSlug(null)}
                    className="text-[13px] text-slate-700 hover:text-blue-600 hover:font-semibold py-0.5 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3: Featured Category Promo Aside Card */}
            <aside className="relative rounded-2xl bg-gradient-to-br from-blue-50/70 via-slate-50 to-indigo-50/50 border border-blue-100 p-6 overflow-hidden flex flex-col justify-between self-stretch min-h-[190px] shadow-xs">
              {/* Category Watermark Artwork */}
              <div
                className="absolute right-0 top-0 bottom-0 w-3/5 bg-no-repeat bg-right bg-contain opacity-35 pointer-events-none"
                style={{
                  backgroundImage: `url(${activeCategory.bannerImage})`,
                }}
              />

              <div className="relative z-10">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm mb-3">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                  {activeCategory.name}
                </h3>
                <p className="mt-1.5 text-[12.5px] text-slate-600 leading-relaxed max-w-[24ch]">
                  {activeCategory.tagline}
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <Link
                  href={`/shop?category=${activeCategory.slug}`}
                  onClick={() => setOpenSlug(null)}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95 group/cta"
                >
                  <span>Shop {activeCategory.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
