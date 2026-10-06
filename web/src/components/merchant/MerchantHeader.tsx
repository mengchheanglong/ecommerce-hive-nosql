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
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 h-16 sm:h-18 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {title || "Merchant Operations Portal"}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Datastore Status Indicators */}
        <div className="hidden xl:flex items-center space-x-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/80">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>MongoDB • Cassandra • Neo4j • Hive Cluster Online</span>
        </div>

        {/* Swagger OpenAPI Link */}
        <a
          href="http://localhost:4000/api/docs"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80 text-xs font-mono font-semibold transition-all"
        >
          <Server className="w-3.5 h-3.5 text-blue-600" />
          <span>Swagger API</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        {/* Quick Customer Storefront Toggle */}
        <Link
          href="/"
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs"
        >
          Customer Store
        </Link>
      </div>
    </header>
  );
}
