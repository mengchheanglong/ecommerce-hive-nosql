"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Share2,
  Database,
  Layers,
  Store,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface MerchantSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function MerchantSidebar({ isOpen, onClose }: MerchantSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Executive Overview", href: "/merchant", icon: LayoutDashboard },
    { name: "Products & Inventory", href: "/merchant/products", icon: Package },
    { name: "Order Fulfillment", href: "/merchant/orders", icon: ShoppingCart },
    { name: "Cassandra Fleet", href: "/merchant/fleet", icon: Truck },
    { name: "Neo4j Referrals", href: "/merchant/referrals", icon: Share2 },
    { name: "Hive Warehouse", href: "/merchant/warehouse", icon: Database },
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
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  Merchant Console
                </span>
                <span className="text-[11px] text-slate-400 font-medium block">
                  Operations & Datastores
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
              Management Modules
            </div>

            {navItems.map((item) => {
              const isActive =
                item.href === "/merchant"
                  ? pathname === "/merchant"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/30 border border-blue-500"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Storefront Switcher */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors border border-slate-800"
          >
            <Store className="w-3.5 h-3.5 text-blue-400" />
            <span>Customer Storefront</span>
          </Link>

          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center space-x-1.5 py-2 text-[11px] text-slate-400 hover:text-blue-400 transition-colors"
          >
            <span>NestJS Swagger API</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>
    </>
  );
}
