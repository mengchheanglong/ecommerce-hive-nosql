"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { STORE_TENANTS } from "@/lib/data";
import { StoreTenant } from "@/types";
import { useToast } from "@/context/ToastContext";
import {
  Store,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Package,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  Heart,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export default function StoresDirectoryPage() {
  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [followedStores, setFollowedStores] = useState<Record<string, boolean>>({});
  const { showToast } = useToast();

  const provinces = ["All", "Phnom Penh", "Siem Reap", "Battambang", "Kandal"];
  const categories = [
    "All",
    "Electronics & Solar",
    "Clothing & Heritage Silk",
    "Handicrafts & Decor",
    "Food & Groceries",
    "Gourmet Spices & PGI",
    "Apparel & Kroma Street",
    "Ceramics & Stoneware",
    "Natural Wellness & Teas",
  ];

  const filteredStores = STORE_TENANTS.filter((s) => {
    const matchesProvince = provinceFilter === "All" || s.province.toLowerCase() === provinceFilter.toLowerCase();
    const matchesCategory = categoryFilter === "All" || s.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.owner.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.province.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()));

    return matchesProvince && matchesCategory && matchesSearch;
  });

  const toggleFollow = (storeId: string, storeName: string) => {
    setFollowedStores((prev) => {
      const isNowFollowed = !prev[storeId];
      showToast(
        isNowFollowed ? `Following ${storeName}! You'll receive updates on new products.` : `Unfollowed ${storeName}.`,
        isNowFollowed ? "success" : "info"
      );
      return { ...prev, [storeId]: isNowFollowed };
    });
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Stores</span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-10 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <Store className="w-3.5 h-3.5" />
            <span>Official Merchant & Artisan Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Discover Verified Stores & Artisan Guilds
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Support authentic Cambodian enterprises, silk heritage weavers, organic farmers, and official technology distributors. All stores are verified with direct delivery and NBC Bakong KHQR checkout.
          </p>

          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-lg font-black text-white block">{STORE_TENANTS.length}</span>
              <span className="text-slate-300 text-[11px]">Verified Stores</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-lg font-black text-white block">4 Provinces</span>
              <span className="text-slate-300 text-[11px]">National Coverage</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-lg font-black text-emerald-400 block">100%</span>
              <span className="text-slate-300 text-[11px]">Authenticity Guarantee</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-lg font-black text-amber-300 block">4.9 ★</span>
              <span className="text-slate-300 text-[11px]">Average Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search store name, craft, owner, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
            />
          </div>

          {/* Province Filter */}
          <div className="flex items-center space-x-2 shrink-0">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              aria-label="Filter stores by province"
              className="px-3 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov === "All" ? "All Provinces" : prov}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "bg-slate-900 text-white shadow-xs font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stores Grid */}
      {filteredStores.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs space-y-4">
          <Store className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No stores match your search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or resetting the province and category filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setProvinceFilter("All");
              setCategoryFilter("All");
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => {
            const isFollowed = !!followedStores[store.id];
            return (
              <div
                key={store.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Store Cover Banner */}
                  <Link href={`/stores/${store.slug}`} className="block relative h-36 w-full overflow-hidden bg-slate-100 cursor-pointer">
                    <img
                      src={store.banner || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                    
                    {/* Province badge on top-right of banner */}
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-slate-800 backdrop-blur-md shadow-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      <span>{store.province}</span>
                    </span>
                  </Link>

                  {/* Store Info Section */}
                  <div className="p-5 pt-0 relative space-y-4">
                    {/* Logo avatar overlapping banner */}
                    <div className="flex items-end justify-between -mt-9">
                      <Link
                        href={`/stores/${store.slug}`}
                        className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md border-2 border-white overflow-hidden shrink-0 cursor-pointer group-hover:ring-2 group-hover:ring-blue-500/50 transition-all"
                      >
                        <img
                          src={store.logo || "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80"}
                          alt={store.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </Link>

                      <button
                        onClick={() => toggleFollow(store.id, store.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isFollowed
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFollowed ? "fill-rose-500 text-rose-500" : ""}`} />
                        <span>{isFollowed ? "Following" : "Follow"}</span>
                      </button>
                    </div>

                    {/* Name & Badges */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/stores/${store.slug}`}
                          className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {store.name}
                        </Link>
                        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      </div>
                      <p className="text-xs font-medium text-blue-600">{store.category}</p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {store.description || "Authentic registered merchant providing premium verified goods with guaranteed national delivery."}
                    </p>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                      <div>
                        <span className="text-[11px] font-bold text-amber-600 flex items-center justify-center gap-0.5">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{store.rating}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block">Rating</span>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-900 flex items-center justify-center gap-0.5">
                          <Package className="w-3 h-3 text-slate-400" />
                          <span>{store.products_count} items</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block">Catalog</span>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{store.positive_feedback || 99}%</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block">Positive</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <Link
                    href={`/stores/${store.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer"
                  >
                    <span>Visit Store Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
