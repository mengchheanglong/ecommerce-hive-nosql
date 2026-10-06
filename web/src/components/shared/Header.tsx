"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLocation } from "@/context/LocationContext";
import {
  Layers,
  ShoppingBag,
  Store,
  LayoutDashboard,
  Search,
  User,
  Package,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  Heart,
  MapPin,
  Flame,
  ChevronDown,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, cartTotalUSD, setIsCartDrawerOpen } = useCart();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { wishlistCount } = useWishlist();
  const { selectedProvince, setSelectedProvince, availableProvinces } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const isMerchant = pathname.startsWith("/merchant");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCategory && searchCategory !== "All") params.append("category", searchCategory);
    if (searchVal.trim()) params.append("search", searchVal.trim());
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 transition-all">
      {/* Top Announcement & Utility Bar */}
      <div className="bg-slate-950 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Announcement */}
          <div className="flex items-center space-x-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              <span>Express Delivery</span>
            </span>
            <span className="hidden sm:inline text-slate-400">
              Free courier dispatch on orders over $30 across Phnom Penh & Siem Reap
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline-flex items-center space-x-1 text-slate-300">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>NBC Bakong KHQR $0 fee</span>
            </span>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0 text-slate-300 font-medium">
            {/* Location Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span className="hidden xs:inline text-slate-400">Deliver to:</span>
                <span className="font-semibold text-white">{selectedProvince}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {locationDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setLocationDropdownOpen(false)}
                >
                  <p className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Select Delivery Hub
                  </p>
                  {(["Phnom Penh", "Siem Reap", "Battambang"] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => {
                        setSelectedProvince(prov);
                        setLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 cursor-pointer ${
                        selectedProvince === prov ? "font-bold text-emerald-700 bg-emerald-50/60" : "text-slate-700"
                      }`}
                    >
                      <span>{prov}</span>
                      {selectedProvince === prov && <span className="text-[10px] text-emerald-600">Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-slate-700">|</span>

            {/* Track Orders Link */}
            <Link
              href="/orders"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Package className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">Track Orders</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Heart className={`w-3 h-3 ${wishlistCount > 0 ? "text-rose-400 fill-rose-400" : "text-slate-400"}`} />
              <span className="hidden sm:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Merchant Portal Quick Link */}
            <Link
              href="/merchant"
              className="hidden sm:flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
            >
              <Store className="w-3 h-3" />
              <span>Seller Hub</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white font-bold shadow-md shadow-slate-950/10 border border-slate-800 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Rentify
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/80 hidden sm:inline-block">
                    Marketplace
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                  Polyglot NoSQL • MongoDB • Cassandra • Hive
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Universal Scoped Search Bar (Storefront) or Domain Selector */}
          {!isMerchant ? (
            <div className="flex-1 max-w-2xl mx-2 hidden md:block">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center rounded-xl bg-slate-100/90 border border-slate-200/90 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-inner overflow-hidden"
              >
                {/* Category Scope Dropdown */}
                <div className="relative border-r border-slate-300/70 shrink-0">
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="bg-slate-200/70 hover:bg-slate-200 text-slate-700 text-xs font-bold pl-3 pr-6 py-2.5 outline-none cursor-pointer appearance-none transition-colors"
                  >
                    <option value="All">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Groceries">Groceries</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Search Input */}
                <div className="relative flex-1 flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search 200,000+ authentic Cambodian products, electronics, food..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                  {searchVal && (
                    <button
                      type="button"
                      onClick={() => setSearchVal("")}
                      className="p-1 mr-1 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="m-1 px-4 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
                >
                  Search
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 text-center hidden md:block">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Rentify Merchant Operations Suite
              </span>
            </div>
          )}

          {/* Right Controls: Store/Merchant switcher, Currency, Wishlist & Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Domain Switcher */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
              <Link
                href="/"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !isMerchant
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Store</span>
              </Link>

              <Link
                href="/merchant"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isMerchant
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Merchant</span>
              </Link>
            </div>

            {/* Currency Toggle */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => setCurrency("KHR")}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  currency === "KHR"
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                ៛ KHR
              </button>
            </div>

            {/* Wishlist Icon Button */}
            {!isMerchant && (
              <Link
                href="/wishlist"
                className="relative p-2.5 rounded-xl border border-slate-200/80 text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-colors hidden sm:flex items-center justify-center cursor-pointer"
                title="View Wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? "text-rose-500 fill-rose-500" : ""}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-4.5 h-4.5 px-1 bg-rose-500 text-white text-[10px] font-extrabold rounded-full shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart Trigger */}
            {!isMerchant && (
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Open Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono hidden sm:inline">
                  {formatPrice(cartTotalUSD)}
                </span>
                {cartCount > 0 && (
                  <span className="flex items-center justify-center min-w-5 h-5 px-1 bg-emerald-500 text-slate-950 text-[10px] font-extrabold rounded-full shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Account Link */}
            <Link
              href="/account"
              className="p-2.5 rounded-xl border border-slate-200/80 text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-colors hidden sm:flex items-center justify-center"
              title="Customer Account & Addresses"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Storefront Secondary Sub-navigation Bar */}
        {!isMerchant && (
          <div className="border-t border-slate-200/60 py-2.5 flex items-center justify-between overflow-x-auto text-xs">
            <div className="flex items-center space-x-1.5 font-medium shrink-0">
              <Link
                href="/shop"
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  pathname === "/shop"
                    ? "bg-slate-900 text-white font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                All Products
              </Link>
              <Link
                href="/shop?category=Electronics"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
              >
                Electronics
              </Link>
              <Link
                href="/shop?category=Clothing"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
              >
                Clothing & Apparel
              </Link>
              <Link
                href="/shop?category=Groceries"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
              >
                Groceries & Organics
              </Link>
              <Link
                href="/orders"
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  pathname === "/orders"
                    ? "bg-slate-900 text-white font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                Track Orders
              </Link>
              <Link
                href="/account"
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  pathname === "/account"
                    ? "bg-slate-900 text-white font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                Account
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-2 text-[11px] font-medium text-emerald-700 bg-emerald-50/70 px-3 py-1 rounded-full border border-emerald-200/60 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>800 Live Couriers • Cassandra Telemetry Active</span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <div className="flex rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-slate-200/80 text-slate-700 text-xs font-semibold px-2.5 py-2 border-r border-slate-300 outline-none"
              >
                <option value="All">All</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Groceries">Groceries</option>
              </select>
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-transparent text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-slate-900 text-white text-xs font-bold"
              >
                Go
              </button>
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
            >
              All Products
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between"
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && <span className="text-rose-600">({wishlistCount})</span>}
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
            >
              Track Orders
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
            >
              My Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
