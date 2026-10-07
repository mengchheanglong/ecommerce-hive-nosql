"use client";

import React from "react";
import Link from "next/link";
import { Menu, ShieldCheck, Server, ExternalLink, Activity, Database, Zap, Radio, Layers, Store, ShoppingBag } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
}

export function AdminHeader({ onToggleSidebar, title, subtitle }: AdminHeaderProps) {
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
              {title || "Platform Administration HQ"}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
              Super Admin
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Datastore Status Chips (from the Blueprint Trust band!) */}
        <div className="hidden 2xl:flex items-center space-x-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/80">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>MongoDB • Redis • Cassandra • Neo4j • Hive Cluster Online</span>
        </div>

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
          <Link
            href="/merchant"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title="Switch to Store Merchant Portal"
          >
            <Store className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Merchant</span>
          </Link>
          <span
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold shadow-xs cursor-default"
            title="Current: Platform Admin Console"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Admin</span>
          </span>
        </div>

        {/* Swagger OpenAPI Link */}
        <a
          href="http://localhost:4000/api/docs"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80 text-xs font-mono font-semibold transition-all"
        >
          <Server className="w-3.5 h-3.5 text-purple-600" />
          <span>Swagger API</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </header>
  );
}
