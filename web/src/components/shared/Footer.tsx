"use client";

import React from "react";
import Link from "next/link";
import { Layers, ShieldCheck, Truck, CreditCard, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Platform Overview */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <img
                src="/assets/rentify-logo.webp"
                alt="Rentify Marketplace"
                className="w-7 h-7 rounded-lg object-contain shadow-2xs"
              />
              <span className="font-bold text-base text-slate-900 tracking-tight">Rentify Marketplace</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Next-generation high-scale Cambodian online marketplace powered by a polyglot persistence architecture.
            </p>
          </div>

          {/* Col 2: Customer Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">Customer Store</h4>
            <ul className="space-y-1.5 font-medium">
              <li>
                <Link href="/shop" className="hover:text-slate-900 transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-slate-900 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-slate-900 transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-slate-900 transition-colors">
                  Customer Profile & Addresses
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-slate-900 transition-colors">
                  Merchant Stores Directory
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-slate-900 transition-colors text-blue-600 font-bold">
                  Help Center & Buyer Protection
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Merchant & Datastores */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">Merchant Operations</h4>
            <ul className="space-y-1.5 font-medium">
              <li>
                <Link href="/merchant" className="hover:text-slate-900 transition-colors">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/merchant/products" className="hover:text-slate-900 transition-colors">
                  Product Inventory (MongoDB)
                </Link>
              </li>
              <li>
                <Link href="/merchant/orders" className="hover:text-slate-900 transition-colors">
                  Fulfillment State Machine
                </Link>
              </li>
              <li>
                <Link href="/merchant/fleet" className="hover:text-slate-900 transition-colors">
                  Fleet Telemetry (Cassandra)
                </Link>
              </li>
              <li>
                <Link href="/merchant/referrals" className="hover:text-slate-900 transition-colors">
                  Referral Graph (Neo4j)
                </Link>
              </li>
              <li>
                <Link href="/merchant/warehouse" className="hover:text-slate-900 transition-colors">
                  Hive Analytics (HDFS ORC)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Cambodian Polyglot Infrastructure */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">Architecture Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200/60">
                MongoDB 8.0
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200/60">
                Apache Cassandra
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200/60">
                Neo4j Graph
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200/60">
                Apache Hive 3.1
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200/60">
                NestJS 10
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200/60">
                Next.js 15
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Integrated with NBC Bakong KHQR and multi-provincial delivery logistics.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            &copy; 2026 Rentify Marketplace. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Bakong KHQR Certified</span>
            </span>
            <span className="flex items-center space-x-1 text-slate-600">
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              <span>Phnom Penh • Siem Reap • Battambang</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
