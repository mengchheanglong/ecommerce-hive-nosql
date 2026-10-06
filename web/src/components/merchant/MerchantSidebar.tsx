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
    { name: "Overview", href: "/merchant", icon: LayoutDashboard },
    { name: "Products & Stock", href: "/merchant/products", icon: Package },
    { name: "Fulfillment Orders", href: "/merchant/orders", icon: ShoppingCart },
    { name: "Fleet Telemetry", href: "/merchant/fleet", icon: Truck },
    { name: "Referral Network", href: "/merchant/referrals", icon: Share2 },
    { name: "Hive Warehouse", href: "/merchant/warehouse", icon: Database },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#01281e] text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 border-r border-[#0a4636] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo / Merchant Identity */}
          <div className="h-18 px-6 flex items-center justify-between border-b border-[#0a4636]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#15c089] text-[#01281e] flex items-center justify-center font-bold shadow-md">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  Merchant Console
                </span>
                <span className="text-[11px] text-[#9cf0ce] font-medium block">
                  Operations & Datastores
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#9cf0ce]/60 px-3 py-2">
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? "bg-[#15c089] text-[#01281e] shadow-md shadow-[#15c089]/20 font-black"
                      : "text-[#cad6cf] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#01281e]" : "text-[#15c089]"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#01281e]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Storefront Switcher */}
        <div className="p-4 border-t border-[#0a4636] space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors border border-white/10"
          >
            <Store className="w-3.5 h-3.5 text-[#15c089]" />
            <span>Switch to Customer Storefront</span>
          </Link>

          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center space-x-1.5 py-2 text-[11px] text-[#9cf0ce] hover:underline"
          >
            <span>NestJS Swagger OpenAPI</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>
    </>
  );
}
