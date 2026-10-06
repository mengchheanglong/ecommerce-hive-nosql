"use client";

import React from "react";
import Link from "next/link";
import { Layers, ShieldCheck, Truck, CreditCard, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e2eae5] bg-white text-[#5c7167] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Platform Overview */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#013326] flex items-center justify-center text-white">
                <Layers className="w-4 h-4 text-[#15c089]" />
              </div>
              <span className="font-extrabold text-base text-[#013326]">Marketplace</span>
            </div>
            <p className="text-xs leading-relaxed text-[#5c7167]">
              Next-generation high-scale Cambodian online marketplace powered by a polyglot persistence architecture.
            </p>
          </div>

          {/* Col 2: Customer Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#013326]">Customer Store</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/shop" className="hover:text-[#013326] transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#013326] transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#013326] transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#013326] transition-colors">
                  Customer Profile & Addresses
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Merchant & Datastores */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#013326]">Merchant Operations</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/merchant" className="hover:text-[#013326] transition-colors">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/merchant/products" className="hover:text-[#013326] transition-colors">
                  Product Inventory (MongoDB)
                </Link>
              </li>
              <li>
                <Link href="/merchant/orders" className="hover:text-[#013326] transition-colors">
                  Fulfillment State Machine
                </Link>
              </li>
              <li>
                <Link href="/merchant/fleet" className="hover:text-[#013326] transition-colors">
                  Fleet Telemetry (Cassandra)
                </Link>
              </li>
              <li>
                <Link href="/merchant/referrals" className="hover:text-[#013326] transition-colors">
                  Referral Graph (Neo4j)
                </Link>
              </li>
              <li>
                <Link href="/merchant/warehouse" className="hover:text-[#013326] transition-colors">
                  Hive Analytics (HDFS ORC)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Cambodian Polyglot Infrastructure */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#013326]">Architecture Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-semibold text-[11px]">
                MongoDB 8.0
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-semibold text-[11px]">
                Apache Cassandra
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-semibold text-[11px]">
                Neo4j Graph
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-semibold text-[11px]">
                Apache Hive 3.1
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-semibold text-[11px]">
                NestJS 10
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-semibold text-[11px]">
                Next.js 15
              </span>
            </div>
            <p className="text-[11px] text-[#5c7167]">
              Integrated with NBC Bakong KHQR QR-324 and multi-provincial delivery networks.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#e2eae5] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            &copy; 2026 Marketplace Data Platform. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0c835c]" />
              <span>Bakong KHQR Certified</span>
            </span>
            <span className="flex items-center space-x-1">
              <Truck className="w-3.5 h-3.5 text-[#0c835c]" />
              <span>Phnom Penh • Siem Reap • Battambang</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
