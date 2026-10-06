"use client";

import React from "react";
import Link from "next/link";
import { Menu, Layers, ExternalLink, Activity, Database, Server } from "lucide-react";

interface MerchantHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
}

export function MerchantHeader({ onToggleSidebar, title, subtitle }: MerchantHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e2eae5] h-18 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[#013326] hover:bg-[#f1f6f3] lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-[#013326] tracking-tight">
            {title || "Merchant Operations Portal"}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#5c7167] font-medium hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Datastore Status Indicators */}
        <div className="hidden xl:flex items-center space-x-2 text-[11px] font-semibold text-[#0c835c] bg-[#eafaf4] px-3 py-1.5 rounded-full border border-[#9cf0ce]">
          <span className="w-2 h-2 rounded-full bg-[#15c089] animate-pulse" />
          <span>MongoDB • Cassandra • Neo4j • Hive Online</span>
        </div>

        {/* Swagger OpenAPI Link */}
        <a
          href="http://localhost:4000/api/docs"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-xs font-mono font-bold transition-all"
        >
          <Server className="w-3.5 h-3.5 text-emerald-600" />
          <span>Swagger Docs</span>
          <ExternalLink className="w-3 h-3 text-emerald-600" />
        </a>

        {/* Quick Customer Storefront Toggle */}
        <Link
          href="/"
          className="px-3 py-1.5 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all shadow-xs"
        >
          Customer Store
        </Link>
      </div>
    </header>
  );
}
