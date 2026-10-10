"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Store,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Boxes,
} from "lucide-react";

interface MerchantSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function MerchantSidebar({ isOpen, onClose }: MerchantSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Store Cockpit", href: "/merchant", icon: LayoutDashboard },
    { name: "Products & Stock", href: "/merchant/products", icon: Package },
    { name: "Order Fulfillment", href: "/merchant/orders", icon: ShoppingCart },
    { name: "Store Analytics", href: "/merchant/analytics", icon: TrendingUp },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 border-r border-slate-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo / Merchant Identity */}
          <div className="h-16 sm:h-18 px-5 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/25">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  Merchant Studio
                </span>
                <span className="text-[11px] text-blue-400 font-medium block">
                  Mekong Electronics • Phnom Penh
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
              Store Management
            </div>

            {navItems.map((item) => {
              const active =
                item.href === "/merchant"
                  ? pathname === "/merchant"
                  : item.href === "/merchant/products"
                  ? pathname.startsWith("/merchant/products")
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    active
                      ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/30 border border-blue-500"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Cross-Role Switcher */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-1">
            Switch Perspective
          </div>

          <a
            href="http://localhost:3101"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 text-xs font-semibold transition-colors border border-emerald-800/60"
            title="Open Warehouse Inventory Ledger in Supply Chain Platform (:3101)"
          >
            <div className="flex items-center space-x-2">
              <Boxes className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supply Chain Ops</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">:3101</span>
          </a>

          <a
            href="http://localhost:3300"
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 text-xs font-semibold transition-colors border border-purple-800/60"
            title="Switch to Standalone Platform Admin Control Plane (:3300)"
          >
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Platform Admin HQ</span>
            </div>
            <span className="text-[10px] font-mono text-purple-400">:3300</span>
          </a>

          <Link
            href="/"
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-800"
          >
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Customer Storefront</span>
            </div>
            <span className="text-[10px] text-slate-500">Public</span>
          </Link>

          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 text-[11px] text-slate-400 hover:text-blue-400 transition-colors"
          >
            <span>Swagger API</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>
    </>
  );
}
