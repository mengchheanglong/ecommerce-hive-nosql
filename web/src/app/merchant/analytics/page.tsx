"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchOrders, fetchProducts } from "@/lib/api";
import { OrderRecord, Product } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Download,
  Filter,
  CheckCircle2,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
} from "lucide-react";

export default function MerchantAnalyticsPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      const [ordData, prodData] = await Promise.all([fetchOrders(), fetchProducts()]);
      setOrders(ordData);
      setProducts(prodData);
    }
    load();
  }, []);

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Merchant Studio</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Store Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span>Store Business Intelligence & Growth</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Conversion funnels, payment settlements, and sales velocity for Mekong Electronics Hub
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Time range switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeRange === range
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => showToast("Exporting CSV sales report...", "info")}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Paid Revenue</span>
          <div className="text-2xl font-black text-slate-900">
            ${totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">
            ▲ +22.4% vs previous {timeRange}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Checkout Conversion</span>
          <div className="text-2xl font-black text-slate-900">
            4.82%
          </div>
          <p className="text-[11px] text-blue-600 font-semibold">
            Industry Benchmark: 3.2% (Top 10% tier)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">COD Collection Rate</span>
          <div className="text-2xl font-black text-slate-900">
            96.4%
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">
            Only 3.6% courier cash returns
          </p>
        </div>
      </div>

      {/* Conversion Funnel (from the blueprint specification) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Storefront Conversion Funnel</h3>
            <p className="text-xs text-slate-500">From initial visitor impression to completed paid order</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            Last {timeRange} Cohort
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              Step 1: Traffic
            </span>
            <div className="text-xl font-black text-slate-900">14,200</div>
            <p className="text-[11px] text-slate-500">Storefront Impressions</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-full" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              Step 2: PDP Views
            </span>
            <div className="text-xl font-black text-slate-900">6,840</div>
            <p className="text-[11px] text-slate-500">48.2% view rate</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[48%]" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              Step 3: Cart Additions
            </span>
            <div className="text-xl font-black text-slate-900">2,450</div>
            <p className="text-[11px] text-slate-500">35.8% add-to-cart rate</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[36%]" />
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Step 4: Paid Orders
            </span>
            <div className="text-xl font-black text-emerald-700">{orders.length > 0 ? orders.length * 15 : 420}</div>
            <p className="text-[11px] text-slate-500">17.1% cart checkout rate</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full w-[17%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Distribution & Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Payment Gateway Distribution</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">NBC Bakong Preferred</span>
          </div>

          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  KHQR
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Bakong KHQR (National Bank)</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">$0 interbank fee • Instant settlement</span>
                </div>
              </div>
              <span className="font-mono font-black text-sm text-slate-900">64.5%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  ABA
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">ABA Pay Direct Mobile</span>
                  <span className="text-[11px] text-blue-700 font-semibold">Instant push authentication</span>
                </div>
              </div>
              <span className="font-mono font-black text-sm text-slate-900">25.3%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                  COD
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Cash on Delivery</span>
                  <span className="text-[11px] text-amber-700 font-semibold">Courier reconciliation (T+1)</span>
                </div>
              </div>
              <span className="font-mono font-black text-sm text-slate-900">10.2%</span>
            </div>
          </div>
        </div>

        {/* Top Product Velocity & Stock Alerts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Top Selling Products Velocity</h3>
            <Link
              href="/merchant/products"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View Inventory
            </Link>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((p, idx) => (
              <div
                key={p.product_id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="font-mono text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-900 truncate block">{p.name}</span>
                    <span className="text-[11px] text-slate-500">${p.price.toFixed(2)} • {p.category}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-xs text-slate-900 block">
                    {Math.floor(28 + (4 - idx) * 12)} sold
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">High Velocity</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
