"use client";

import React from "react";
import Link from "next/link";
import { Menu, Store, ExternalLink, ShieldCheck, ShoppingBag, CheckCircle2, ChevronDown } from "lucide-react";

interface MerchantHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
}

export function MerchantHeader({ onToggleSidebar, title, subtitle }: MerchantHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 h-16 sm:h-18 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {title || "Mekong Electronics Hub"}
            </h1>
            <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Store Open</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            {subtitle || "Phnom Penh Branch • Merchant Studio"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* 3-Role Quick Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
          <Link
            href="/"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title="Switch to Public Customer Storefront"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Storefront</span>
          </Link>
          <span
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold shadow-xs cursor-default"
            title="Current: Merchant Store Portal"
          >
            <Store className="w-3.5 h-3.5 text-white" />
            <span>Merchant</span>
          </span>
          <a
            href="http://localhost:3300"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-purple-700 hover:text-purple-900 hover:bg-purple-50 transition-colors"
            title="Switch to Standalone Platform Admin Control Plane (:3300)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Platform Admin (:3300)</span>
          </a>
        </div>

        {/* View Live Storefront */}
        <Link
          href="/shop"
          className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
        >
          <span>View Public Store</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>
      </div>
    </header>
  );
}
