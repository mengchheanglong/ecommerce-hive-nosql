"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PLATFORM_KPIS,
  SYSTEM_DATASTORES,
  STORE_TENANTS,
} from "@/lib/data";
import { fetchOrders, fetchProducts, fetchHiveAnalytics, sendRiderPing } from "@/lib/api";
import { OrderRecord, Product } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import {
  ShieldCheck,
  Store,
  DollarSign,
  ShoppingCart,
  Truck,
  Users,
  Database,
  Radio,
  Zap,
  Share2,
  Layers,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Server,
} from "lucide-react";

export default function PlatformAdminOverview() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  // Live Cassandra Telemetry Simulation
  const [radarLogs, setRadarLogs] = useState<string[]>([
    "[Cassandra LSM] Cluster connected on port 9042. Token partitioner active.",
    "[Cassandra LSM] KeySpace telemetry_ks: rider_gps_pings (TTL 30 days, TWCS enabled).",
    "[Cassandra LSM] INSERT INTO rider_gps_pings (rider_id, ping_time, lat, lng, speed, battery) VALUES ('R-101', '13:22:10', 11.5564, 104.9282, '28 km/h', 88%);",
  ]);
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const riders = ["R-101", "R-102", "R-104", "R-201", "R-202", "R-301"];
      const rId = riders[Math.floor(Math.random() * riders.length)];
      const speed = Math.floor(18 + Math.random() * 24);
      const lat = (11.54 + Math.random() * 0.05).toFixed(4);
      const lng = (104.91 + Math.random() * 0.04).toFixed(4);
      const timeStr = new Date().toTimeString().slice(0, 8);
      const cql = `[Cassandra LSM] INSERT INTO rider_gps_pings (rider_id, ping_time, lat, lng, speed, battery) VALUES ('${rId}', '${timeStr}', ${lat}, ${lng}, '${speed} km/h', 92%);`;
      setRadarLogs((prev) => [cql, ...prev.slice(0, 4)]);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleTriggerRadarPing = async () => {
    setIsPinging(true);
    const speed = `${Math.floor(22 + Math.random() * 18)} km/h`;
    const battery = Math.floor(65 + Math.random() * 30);
    const lat = `11.${Math.floor(5400 + Math.random() * 300)}`;
    const lng = `104.${Math.floor(9100 + Math.random() * 250)}`;
    await sendRiderPing("R-101", lat, lng, speed, battery);
    const timeStr = new Date().toTimeString().slice(0, 8);
    const cql = `[Cassandra LSM] INSERT INTO rider_gps_pings (rider_id, ping_time, lat, lng, speed, battery) VALUES ('R-101', '${timeStr}', ${lat}, ${lng}, '${speed}', ${battery}%);`;
    setRadarLogs((prev) => [cql, ...prev.slice(0, 4)]);
    setIsPinging(false);
    showToast("Cassandra LSM write committed (160 writes/sec node)", "success");
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const ordData = await fetchOrders();
      setOrders(ordData);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome & Command Plane Hero Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Marketplace Control Plane • Cambodia Multi-Tenant HQ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Platform Operations & Datastores Cockpit
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Governing {PLATFORM_KPIS.activeStoresCount.toLocaleString()} stores, 800 delivery couriers, and 1,000,000+ orders across Phnom Penh, Siem Reap & Battambang.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <Link
            href="/admin/stores"
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Manage Stores</span>
          </Link>
          <Link
            href="/admin/warehouse"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Hive Warehouse</span>
          </Link>
        </div>
      </div>

      {/* BAND 1: Headline Platform Health KPIs (Blueprint Architecture) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Platform GMV */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Platform GMV (Sept)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ${(PLATFORM_KPIS.gmvUSD / 1000000).toFixed(2)}M
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>▲ +18.4% month-over-month</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">1,000,000 orders</span>
            </div>
          </div>
        </div>

        {/* Active Store Tenants */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Stores</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {PLATFORM_KPIS.activeStoresCount.toLocaleString()}
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-blue-600 font-semibold mt-1">
              <span>▲ +42 new this month</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">2 pending KYC</span>
            </div>
          </div>
        </div>

        {/* Cassandra Fleet Couriers */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Cassandra Fleet</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              800 Riders
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-purple-600 font-semibold mt-1">
              <span>13.8M pings/day</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">160 writes/sec node</span>
            </div>
          </div>
        </div>

        {/* Payment Gateway Reliability */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gateway Success</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {PLATFORM_KPIS.gatewayReliability.bakongKHQR}%
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>Bakong KHQR $0 fee</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">98.8% ABA</span>
            </div>
          </div>
        </div>
      </div>

      {/* BAND 2: Polyglot Infrastructure Health Matrix (5 Engines) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Server className="w-5 h-5 text-purple-600" />
              <span>Polyglot Datastore Architecture Status</span>
            </h3>
            <p className="text-xs text-slate-500">
              Real-time monitoring across 5 specialized NoSQL & OLAP database nodes
            </p>
          </div>
          <Link
            href="/admin/system"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center space-x-1"
          >
            <span>Inspect CAP Architecture</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {SYSTEM_DATASTORES.map((ds) => (
            <div
              key={ds.name}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-purple-300 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-900 truncate">{ds.name}</span>
                <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>{ds.status}</span>
                </span>
              </div>
              <div className="text-[11px] text-purple-600 font-semibold">
                Port {ds.port} • {ds.latencyMs}ms latency
              </div>
              <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                {ds.metrics}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BAND 3: Action Center Queues (SLA-Governed Platform Work) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store KYC Approvals */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900">Merchant KYC Queue</h4>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              2 Pending
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Banteay Meanchey Ceramics</span>
                <span className="text-[10px] font-mono text-slate-500">Siem Reap</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Owner: Sreypov Keo • Documents submitted 18h ago (SLA: 24h)
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => showToast("Store verified & activated in MongoDB", "success")}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 cursor-pointer"
                >
                  Approve KYC
                </button>
                <button
                  onClick={() => showToast("KYC details requested from merchant", "info")}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-semibold text-[11px] hover:bg-slate-300 cursor-pointer"
                >
                  Request Info
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Cardamom Wild Botanicals</span>
                <span className="text-[10px] font-mono text-slate-500">Battambang</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Owner: Kosal Heng • Documents submitted 6h ago (SLA: 24h)
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => showToast("Store verified & activated in MongoDB", "success")}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 cursor-pointer"
                >
                  Approve KYC
                </button>
                <button
                  onClick={() => showToast("KYC details requested from merchant", "info")}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-semibold text-[11px] hover:bg-slate-300 cursor-pointer"
                >
                  Request Info
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cassandra Fleet Live Radar Feed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-bold text-slate-900">Cassandra GPS Telemetry</h4>
            </div>
            <Link
              href="/admin/fleet"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center space-x-1"
            >
              <span>Full Radar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 border border-purple-200/80">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-purple-900 block">800 Delivery Couriers</span>
                <span className="text-[11px] text-purple-700">14M writes/day to ring</span>
              </div>
              <button
                onClick={handleTriggerRadarPing}
                disabled={isPinging}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                {isPinging ? "Writing..." : "Simulate Ping"}
              </button>
            </div>

            <div className="bg-slate-950 text-purple-300 p-3 rounded-xl font-mono text-[10px] space-y-1 h-36 overflow-hidden">
              <span className="text-slate-400 block pb-1 border-b border-slate-800">
                // Live CQL Write Stream (Port 9042)
              </span>
              {radarLogs.map((log, i) => (
                <div key={i} className="truncate text-slate-300 hover:text-white">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Neo4j Viral Referral Graph Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">Neo4j Viral Referrals</h4>
            </div>
            <Link
              href="/admin/referrals"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>View Graph</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
              <span className="text-xs font-bold text-blue-900 block">3-Tier Depth Rewards</span>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Level 1: 5% • Level 2: 2% • Level 3: 1%. Index-free adjacency avoids recursive SQL self-joins.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-xs text-slate-500 block">Viral Coefficient</span>
                <span className="text-lg font-black text-slate-900">1.42 K-Factor</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-xs text-slate-500 block">Total Rewards Paid</span>
                <span className="text-lg font-black text-emerald-600">$18,450 USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BAND 4: Multi-Tenant Stores Overview (Top Sellers Snapshot) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Top Performing Stores</h3>
            <p className="text-xs text-slate-500">Live sales performance across registered marketplace tenants</p>
          </div>
          <Link
            href="/admin/stores"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center space-x-1"
          >
            <span>View All Stores Directory ({STORE_TENANTS.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50/70">
                <th className="py-2.5 px-3">Store Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Province</th>
                <th className="py-2.5 px-3">Owner</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">GMV (USD)</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {STORE_TENANTS.slice(0, 5).map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{store.name}</td>
                  <td className="py-3 px-3 text-slate-600">{store.category}</td>
                  <td className="py-3 px-3 text-slate-600">{store.province}</td>
                  <td className="py-3 px-3 text-slate-600">{store.owner}</td>
                  <td className="py-3 px-3 font-mono">{store.products_count}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    ${store.revenue_usd.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        store.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {store.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
