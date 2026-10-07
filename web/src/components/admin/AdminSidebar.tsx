"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Store,
  Truck,
  Share2,
  Database,
  Cpu,
  Layers,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  Server,
  Activity,
  ShoppingBag,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Platform Cockpit", href: "/admin", icon: LayoutDashboard },
    { name: "Stores Directory", href: "/admin/stores", icon: Store },
    { name: "Cassandra Fleet (800 Riders)", href: "/admin/fleet", icon: Truck },
    { name: "Neo4j Social Graph", href: "/admin/referrals", icon: Share2 },
    { name: "Hive OLAP Warehouse", href: "/admin/warehouse", icon: Database },
    { name: "Polyglot System Health", href: "/admin/system", icon: Cpu },
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
          {/* Logo / Admin Identity */}
          <div className="h-16 sm:h-18 px-5 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/25">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  Platform Admin
                </span>
                <span className="text-[11px] text-purple-400 font-semibold block">
                  Marketplace HQ • Control Plane
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
              Platform Modules
            </div>

            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-purple-600 text-white font-bold shadow-sm shadow-purple-600/30 border border-purple-500"
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

        {/* Bottom Cross-Role Switcher */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-1">
            Switch Perspective
          </div>

          <Link
            href="/merchant"
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-800"
          >
            <div className="flex items-center space-x-2">
              <Store className="w-3.5 h-3.5 text-blue-400" />
              <span>Merchant Portal</span>
            </div>
            <span className="text-[10px] text-slate-500">Seller View</span>
          </Link>

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
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 text-[11px] text-slate-400 hover:text-purple-400 transition-colors"
          >
            <span>Swagger OpenAPI Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>
    </>
  );
}
