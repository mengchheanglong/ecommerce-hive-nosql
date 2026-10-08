"use client";

import React, { useState, useEffect } from "react";
import { HiveWorkbench } from "@/components/merchant/HiveWorkbench";
import { fetchHiveAnalytics } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import {
  BarChart3,
  Database,
  TrendingUp,
  MapPin,
  Users,
  Layers,
  Sparkles,
  Zap,
  Cpu,
  ArrowUpRight,
  DollarSign,
  PieChart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "provinces" | "customers" | "workbench">("overview");
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchHiveAnalytics();
      setAnalytics(data);
      setLoading(false);
    }
    load();
  }, []);

  const metrics = analytics?.metrics || {
    totalMonthlyOrders: 1000000,
    activeCustomers: 50000,
    customerBuckets: 8,
    septemberRevenue: 76554792.32,
    queryLatencyMs: 50.87,
    csvLatencyMs: 423.32,
    speedupMultiplier: 8.3,
    compressionRatio: 3.52,
  };

  const provinces = analytics?.revenueByProvince || [
    { province: "Phnom Penh", revenue: 42130965.2, share: "55.0%" },
    { province: "Siem Reap", revenue: 19191375.01, share: "25.1%" },
    { province: "Battambang", revenue: 7570672.18, share: "9.9%" },
    { province: "Kandal", revenue: 3058095.15, share: "4.0%" },
    { province: "Sihanoukville", revenue: 2341096.15, share: "3.1%" },
    { province: "Kampot", revenue: 2253587.83, share: "2.9%" },
  ];

  const topCustomers = analytics?.topCustomers || [
    { rank: 1, name: "Bopha Pich (C10524)", city: "Battambang", spend: 14479.74, tier: "VIP Platinum" },
    { rank: 2, name: "Neary Long (C47708)", city: "Phnom Penh", spend: 13982.51, tier: "VIP Platinum" },
    { rank: 3, name: "Bopha Pich (C28429)", city: "Phnom Penh", spend: 13311.93, tier: "VIP Gold" },
    { rank: 4, name: "Sophea Mao (C13118)", city: "Phnom Penh", spend: 13257.03, tier: "VIP Gold" },
    { rank: 5, name: "Neary Long (C45423)", city: "Siem Reap", spend: 13150.46, tier: "VIP Gold" },
  ];

  const orderTiers = analytics?.orderTiers || {
    highTier: { label: "> $100", count: 421842, percentage: "42.2%" },
    normalTier: { label: "≤ $100", count: 578158, percentage: "57.8%" },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Platform Admin</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">Big Data & OLAP Analytics</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <span>Platform & Big Data OLAP Analytics</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Apache Hive 3.1 on Tez Engine • 1,000,000+ orders staged in HDFS with Columnar ORC Snappy Compression
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tez Query Latency: {metrics.queryLatencyMs}ms ({metrics.speedupMultiplier}x vs CSV)</span>
          </div>
        </div>
      </div>

      {/* Analytics Dimension Tabs */}
      <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 w-fit">
        {[
          { id: "overview", label: "Executive Overview", icon: TrendingUp },
          { id: "provinces", label: "Provincial Revenue", icon: MapPin },
          { id: "customers", label: "Customer Cohorts & LTV", icon: Users },
          { id: "workbench", label: "HiveQL Tez Workbench", icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* BAND 1: Headline Financial & OLAP Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gross Platform Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              ${(metrics.septemberRevenue / 1000000).toFixed(2)}M
            </span>
            <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
              <span>▲ +18.4% MoM</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">September Batch</span>
            </div>
          </div>
        </div>

        {/* Processed Orders */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">HDFS Analyzed Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {(metrics.totalMonthlyOrders / 1000000).toFixed(1)}M Orders
            </span>
            <div className="flex items-center space-x-1 text-[11px] text-blue-600 font-semibold mt-0.5">
              <span>50k active customers</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">8 hash buckets</span>
            </div>
          </div>
        </div>

        {/* Query Acceleration */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Tez DAG Speedup</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {metrics.speedupMultiplier}x Faster
            </span>
            <div className="flex items-center space-x-1 text-[11px] text-indigo-600 font-semibold mt-0.5">
              <span>{metrics.queryLatencyMs}ms vs {metrics.csvLatencyMs}ms</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Vectorized</span>
            </div>
          </div>
        </div>

        {/* Storage Efficiency */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Columnar Compression</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {metrics.compressionRatio}x Ratio
            </span>
            <div className="flex items-center space-x-1 text-[11px] text-sky-600 font-semibold mt-0.5">
              <span>74.4 MB $\rightarrow$ 21.2 MB</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Snappy ORC</span>
            </div>
          </div>
        </div>
      </div>

      {/* TAB CONTENT: Overview or Provincial Breakdown */}
      {(activeTab === "overview" || activeTab === "provinces") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Provincial Revenue Distribution */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Provincial Revenue & Geographic Market Share</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Aggregated from 1M records via HiveQL: <code className="font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded">SELECT province, SUM(total) GROUP BY province</code>
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 font-bold">Cambodia Core Ring</span>
            </div>

            <div className="space-y-3.5">
              {provinces.map((prov: any, idx: number) => {
                const pct = parseFloat(prov.share);
                return (
                  <div key={prov.province} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 font-bold font-mono flex items-center justify-center text-[10px]">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-slate-900">{prov.province}</span>
                      </div>
                      <div className="flex items-center space-x-3 font-mono">
                        <span className="font-extrabold text-slate-900">
                          ${(prov.revenue / 1000000).toFixed(2)}M USD
                        </span>
                        <span className="text-blue-600 font-bold w-12 text-right">{prov.share}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(pct * 1.5, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spending Tier & Basket Size Analysis */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-sky-600" />
                  <span>Basket Size Segmentation</span>
                </h3>
                <p className="text-xs text-slate-500">Order value tiers partitioned in Tez</p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900">High-Tier Basket ({orderTiers.highTier.label})</span>
                    <span className="font-mono font-black text-blue-700 text-sm">{orderTiers.highTier.percentage}</span>
                  </div>
                  <p className="text-[11px] text-blue-700">
                    {orderTiers.highTier.count.toLocaleString()} high-margin transactions
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-900">Standard Daily Basket ({orderTiers.normalTier.label})</span>
                    <span className="font-mono font-black text-sky-700 text-sm">{orderTiers.normalTier.percentage}</span>
                  </div>
                  <p className="text-[11px] text-sky-700">
                    {orderTiers.normalTier.count.toLocaleString()} everyday FMCG & grocery orders
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1 text-xs">
              <span className="font-bold text-slate-800 block">Average Order Value (AOV):</span>
              <p className="font-mono font-black text-lg text-emerald-600">$76.55 USD</p>
              <p className="text-[11px] text-slate-500">Consistent with urban Southeast Asian digital adoption</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Customers LTV */}
      {(activeTab === "overview" || activeTab === "customers") && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Customer Lifetime Value (LTV) & VIP Leaderboard</span>
              </h3>
              <p className="text-xs text-slate-500">
                Clustered by 8 customer hash buckets to eliminate shuffle sorting skew
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700">Top Spenders</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {topCustomers.map((cust: any) => (
              <div
                key={cust.name}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-blue-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-blue-600">#{cust.rank}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/60">
                    {cust.tier}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{cust.name}</h4>
                  <p className="text-[11px] text-slate-500">{cust.city}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 font-mono font-bold text-emerald-600 text-sm">
                  ${cust.spend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HiveQL Workbench & Execution Pipeline */}
      {(activeTab === "overview" || activeTab === "workbench") && (
        <div className="space-y-6">
          {/* Interactive HiveQL Console */}
          <HiveWorkbench />

          {/* 5-Stage Big Data Architecture Pipeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Apache Hive 3.1 & HDFS Optimization Pipeline
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Stage 1
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-2">HDFS CSV Staging</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Monthly dump at /staging/orders/orders_raw.csv (74.4 MB).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Stage 2
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-2">orders_raw Table</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  External TextFile schema-on-read table without data duplication.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Stage 3
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-2">Partition & Bucket</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Partitioned by month, clustered into 8 customer hash buckets.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Stage 4
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-2">Columnar ORC</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Snappy compression (21.2 MB, 3.5x ratio), stripe index pushdown.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Stage 5
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-2">Tez BI Reporting</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Partition pruning skips 60% of folders for 50.8ms analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
