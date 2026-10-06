"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
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
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, cartTotalUSD, setIsCartDrawerOpen } = useCart();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const isMerchant = pathname.startsWith("/merchant");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2eae5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl bg-[#013326] flex items-center justify-center text-white font-bold shadow-md shadow-[#013326]/10 border border-[#0a4636] group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-[#15c089]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg tracking-tight text-[#013326]">
                    Marketplace
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#eafaf4] text-[#0c835c] rounded-full border border-[#9cf0ce] hidden sm:inline-block">
                    Microservices
                  </span>
                </div>
                <p className="text-[11px] text-[#5c7167] font-medium hidden md:block">
                  Polyglot NoSQL • Apache Hive
                </p>
              </div>
            </Link>
          </div>

          {/* Center: DOMAIN SWITCHER (Customer Storefront vs Merchant Portal) */}
          <div className="flex items-center bg-[#f1f6f3] p-1 rounded-2xl border border-[#e2eae5] shadow-inner">
            <Link
              href="/"
              className={`flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isMerchant
                  ? "bg-[#013326] text-white shadow-sm font-black"
                  : "text-[#5c7167] hover:text-[#013326]"
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#15c089]" />
              <span>Storefront</span>
            </Link>

            <Link
              href="/merchant"
              className={`flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isMerchant
                  ? "bg-[#013326] text-white shadow-sm font-black"
                  : "text-[#5c7167] hover:text-[#013326]"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#15c089]" />
              <span>Merchant Portal</span>
            </Link>
          </div>

          {/* Right Controls: Search, Currency & Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search (Storefront) */}
            {!isMerchant && (
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-56">
                <Search className="w-3.5 h-3.5 text-[#5c7167] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15c089]/30"
                />
              </form>
            )}

            {/* Currency Toggle */}
            <div className="flex items-center bg-[#f1f6f3] p-1 rounded-xl border border-[#e2eae5] text-xs font-bold">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-white text-[#013326] shadow-xs font-black"
                    : "text-[#5c7167] hover:text-[#013326]"
                }`}
              >
                $
              </button>
              <button
                onClick={() => setCurrency("KHR")}
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currency === "KHR"
                    ? "bg-white text-[#013326] shadow-xs font-black"
                    : "text-[#5c7167] hover:text-[#013326]"
                }`}
              >
                ៛
              </button>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#15c089]" />
              <span className="text-xs font-bold hidden sm:inline">{formatPrice(cartTotalUSD)}</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1 bg-[#15c089] text-[#013326] text-[11px] font-black rounded-full shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Link */}
            <Link
              href="/account"
              className="p-2 rounded-xl border border-[#e2eae5] text-[#5c7167] hover:text-[#013326] hover:bg-[#f1f6f3] transition-colors hidden sm:flex items-center justify-center"
              title="Customer Account & Addresses"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Storefront Secondary Sub-navigation Bar */}
        {!isMerchant && (
          <div className="border-t border-[#e2eae5] py-2 flex items-center justify-between overflow-x-auto text-xs">
            <div className="flex items-center space-x-2 font-bold">
              <Link
                href="/shop"
                className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                  pathname === "/shop"
                    ? "bg-[#013326] text-white"
                    : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
                }`}
              >
                🛍️ All Products
              </Link>
              <Link
                href="/orders"
                className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                  pathname === "/orders"
                    ? "bg-[#013326] text-white"
                    : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
                }`}
              >
                📦 My Orders & Tracking
              </Link>
              <Link
                href="/account"
                className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                  pathname === "/account"
                    ? "bg-[#013326] text-white"
                    : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
                }`}
              >
                👤 Profile & Addresses
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-3 text-[11px] font-semibold text-[#0c835c]">
              <span className="w-2 h-2 rounded-full bg-[#15c089] animate-ping" />
              <span>Phnom Penh • Siem Reap • Battambang Express Courier</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
