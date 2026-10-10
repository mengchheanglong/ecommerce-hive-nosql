"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ExternalLink,
  Store,
  ShoppingBag,
  Database,
  Truck,
  BarChart3,
  AlertCircle,
  Share2,
  Cpu
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [countdown, setCountdown] = useState(5);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    if (!autoRedirect) return;
    if (countdown <= 0) {
      window.location.href = "http://localhost:8300";
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, autoRedirect]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600/30 selection:text-white">
      {/* Top Header */}
      <header className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white block">E-Commerce Reference Application</span>
            <span className="text-[11px] text-slate-400 font-semibold block">Internal Admin Namespace — RETIRED</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Storefront</span>
          </Link>
          <Link
            href="/merchant"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-blue-400" />
            <span>Seller Hub</span>
          </Link>
        </div>
      </header>

      {/* Main Retirement Notice */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center space-y-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Internal Namespace Retired</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              E-Commerce Admin Dashboard has been Retired
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              All administrative operations, stores governance, analytics, live fleet tracking, and system telemetry have been permanently consolidated into the standalone <strong className="text-slate-200">Platform Admin Control Plane</strong> on Port 8300.
            </p>
          </div>

          {/* Auto-redirect Banner */}
          {autoRedirect ? (
            <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-800/80 flex items-center justify-between text-xs text-blue-200">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                <span>Redirecting to Platform Admin HQ in <strong className="font-mono text-white text-sm">{countdown}s</strong>...</span>
              </div>
              <button
                onClick={() => setAutoRedirect(false)}
                className="px-2.5 py-1 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-300 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Cancel Auto-Redirect
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Auto-redirect paused. Launch Platform Admin directly below:</span>
              <button
                onClick={() => { setCountdown(3); setAutoRedirect(true); }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Resume Redirect
              </button>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <a
              href="http://localhost:8300"
              className="flex-1 py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Launch Platform Admin HQ (:8300)</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              href="/"
              className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer Storefront</span>
            </Link>

            <Link
              href="/merchant"
              className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <Store className="w-4 h-4" />
              <span>Seller Hub</span>
            </Link>
          </div>

          {/* Destination Map */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Where to find each feature in Platform Admin (:8300)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-2.5">
                <BarChart3 className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Big Data & Hive Analytics</span>
                  <span className="text-[11px] text-slate-400">Provincial revenue, VIP LTV & HiveQL workbench</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-2.5">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Digital-Twin Fleet & 2D Vector Map</span>
                  <span className="text-[11px] text-slate-400">Phnom Penh road network, hubs & telemetry HUD</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-2.5">
                <Store className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Stores Directory & KYC Approvals</span>
                  <span className="text-[11px] text-slate-400">1,248 merchant stores & onboarding verification</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-2.5">
                <Database className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Polyglot System Health</span>
                  <span className="text-[11px] text-slate-400">5 NoSQL datastores & CAP network split simulator</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-2.5">
                <Share2 className="w-4 h-4 text-pink-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Neo4j Graph Explorer</span>
                  <span className="text-[11px] text-slate-400">Referral viral networks & distribution topology</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-2.5">
                <Cpu className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Live Orders Ingestion Stream</span>
                  <span className="text-[11px] text-slate-400">Real customer checkouts buffer & tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-slate-800/80 text-center text-xs text-slate-500 font-mono">
        Platform Admin Service: http://localhost:8300 • E-Commerce Storefront: http://localhost:8401
      </footer>
    </div>
  );
}
