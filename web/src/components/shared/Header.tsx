"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
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
  Gift,
  Percent,
  Globe,
  Check,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { CategoryMegaMenu } from "./CategoryMegaMenu";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, cartTotalUSD, setIsCartDrawerOpen } = useCart();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { wishlistCount } = useWishlist();
  const { selectedProvince, setSelectedProvince, availableProvinces } = useLocation();
  const { user, isAuthenticated, setIsSignInModalOpen, logout } = useAuth();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [localeDropdownOpen, setLocaleDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"en" | "km">("en");

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
            <span className="inline-flex items-center space-x-1.5 text-blue-400 font-semibold">
              <Zap className="w-3 h-3 text-blue-400 fill-blue-400" />
              <span>Express Delivery</span>
            </span>
            <span className="hidden sm:inline text-slate-400">
              Free courier dispatch on orders over $30 across Phnom Penh & Siem Reap
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline-flex items-center space-x-1 text-slate-300">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
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
                <MapPin className="w-3 h-3 text-blue-400" />
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
                        showToast(`Active delivery hub set to ${prov}`, "info");
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 cursor-pointer ${
                        selectedProvince === prov ? "font-bold text-blue-700 bg-blue-50/60" : "text-slate-700"
                      }`}
                    >
                      <span>{prov}</span>
                      {selectedProvince === prov && <span className="text-[10px] text-blue-600 font-semibold">Active</span>}
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

            {/* Merchant & Admin Quick Links */}
            <div className="hidden sm:flex items-center space-x-2 text-[11px]">
              <Link
                href="/merchant"
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                title="Merchant Seller Studio"
              >
                <Store className="w-3 h-3" />
                <span>Seller Hub</span>
              </Link>
              <span className="text-slate-700">|</span>
              <Link
                href="/admin"
                className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                title="Platform Administration HQ"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Platform Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/assets/rentify-logo.webp"
                alt="Rentify Marketplace"
                className="w-8 h-8 rounded-lg object-contain shadow-xs group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Rentify Marketplace
              </span>
            </Link>
          </div>

          {/* Center: Universal Pill Search Bar */}
          {!isMerchant ? (
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center rounded-full bg-slate-100/90 border border-slate-200/90 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-600 transition-all pl-3 pr-2 py-1.5 shadow-inner"
              >
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  aria-label="Department Scope"
                  className="bg-transparent text-slate-700 font-semibold text-xs border-r border-slate-300 pr-2 mr-2 outline-none cursor-pointer max-w-[135px] truncate shrink-0"
                >
                  <option value="All">All Departments</option>
                  <option value="Food & Groceries">Food & Groceries</option>
                  <option value="Fashion & Accessories">Fashion & Accessories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Beauty & Wellness">Beauty & Wellness</option>
                  <option value="Arts & Culture">Arts & Culture</option>
                </select>
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full text-xs bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
                />
                {searchVal && (
                  <button
                    type="button"
                    onClick={() => setSearchVal("")}
                    className="p-1 mr-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="p-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shrink-0 ml-1 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 text-center hidden md:block">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Merchant Operations Suite
              </span>
            </div>
          )}

          {/* Right Controls: Merchant link, Language, Wishlist, Cart, Sign In */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            {/* Merchant & Admin Quick Switchers */}
            <div className="hidden sm:flex items-center space-x-1.5">
              <Link
                href="/merchant"
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isMerchant
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 bg-slate-100/80"
                }`}
                title="Merchant Seller Studio"
              >
                <Store className="w-3.5 h-3.5 text-blue-500" />
                <span>Merchant</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all cursor-pointer"
                title="Platform Administration HQ"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin</span>
              </Link>
            </div>

            {/* Language & Currency Globe Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLocaleDropdownOpen(!localeDropdownOpen)}
                className="p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors cursor-pointer flex items-center gap-1"
                title="Currency & Language Preferences"
              >
                <Globe className="w-4.5 h-4.5" />
                <span className="text-[10px] font-mono font-bold text-slate-700 hidden lg:inline">
                  {currency}
                </span>
              </button>

              {localeDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 py-3 px-3 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-3"
                  onMouseLeave={() => setLocaleDropdownOpen(false)}
                >
                  {/* Currency Selector */}
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                      Currency
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrency("USD");
                          setLocaleDropdownOpen(false);
                          showToast("Currency switched to USD ($)", "info");
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          currency === "USD"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                        }`}
                      >
                        <span>USD ($)</span>
                        {currency === "USD" && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrency("KHR");
                          setLocaleDropdownOpen(false);
                          showToast("Currency switched to KHR (៛ 4,100)", "info");
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          currency === "KHR"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                        }`}
                      >
                        <span>KHR (៛)</span>
                        {currency === "KHR" && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                      Language / ភាសា
                    </p>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLang("en");
                          setLocaleDropdownOpen(false);
                          showToast("Language set to English", "info");
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          selectedLang === "en" ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>English (US)</span>
                        {selectedLang === "en" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLang("km");
                          setLocaleDropdownOpen(false);
                          showToast("បានប្ដូរទៅជាភាសាខ្មែរ (Khmer)", "info");
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          selectedLang === "km" ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>ភាសាខ្មែរ (Khmer)</span>
                        {selectedLang === "km" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Orders Tab */}
            {!isMerchant && (
              <Link
                href="/orders"
                className={`relative px-2.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  pathname?.startsWith("/orders")
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-950 hover:bg-slate-100 bg-slate-100/80 border border-slate-200/60"
                }`}
                title="Track My Orders"
              >
                <Package className={`w-4 h-4 ${pathname?.startsWith("/orders") ? "text-white" : "text-blue-600"}`} />
                <span className="hidden sm:inline">Orders</span>
              </Link>
            )}

            {/* Wishlist Button */}
            {!isMerchant && (
              <Link
                href="/wishlist"
                className="relative p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors hidden sm:flex items-center justify-center cursor-pointer"
                title="View Wishlist"
              >
                <Heart className={`w-4.5 h-4.5 ${wishlistCount > 0 ? "text-rose-500 fill-rose-500" : ""}`} />
                {wishlistCount > 0 && (
                  <span className="absolute 0 top-0 right-0 flex items-center justify-center min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart Trigger */}
            {!isMerchant && (
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                title="Open Shopping Cart"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute 0 top-0 right-0 flex items-center justify-center min-w-4 h-4 px-1 bg-blue-600 text-white text-[9px] font-bold rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Authentication / User Profile Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-900 text-xs font-bold transition-all shadow-xs cursor-pointer border border-slate-200"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full font-bold hidden sm:inline">
                    VIP
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{user.phone}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 w-fit">
                        <span>⭐ {user.tier}</span>
                        <span>•</span>
                        <span>{user.loyalty_points} pts</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile & Rewards</span>
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>Track My Orders</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span>Saved Wishlist ({wishlistCount})</span>
                      </Link>
                      <Link
                        href="/help"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        <span>Help Center & Support</span>
                      </Link>
                      <Link
                        href="/merchant"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium border-t border-slate-100 mt-1 pt-2"
                      >
                        <Store className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-blue-600">Merchant Store Studio</span>
                      </Link>
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-600 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span className="font-bold text-purple-600">Platform Admin HQ</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1 px-2">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>Sign Out</span>
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSignInModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </div>

      {/* Storefront Category Navigation Bar with Interactive Hover Mega-Menu */}
      {!isMerchant && <CategoryMegaMenu />}

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
            <Link
              href="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 col-span-2 text-center text-blue-600 font-bold"
            >
              Help Center & Support
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
