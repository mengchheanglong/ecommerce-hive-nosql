"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchOrders, fetchProducts, fetchHiveAnalytics, updateOrderStatus, sendRiderPing } from "@/lib/api";
import { OrderRecord, Product } from "@/types";
import { VALID_ORDER_TRANSITIONS } from "@/lib/data";
import { KpiCard } from "@/components/merchant/KpiCard";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Truck,
  Plus,
  ArrowRight,
  Database,
  Layers,
  Activity,
  Server,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Radio,
  Zap,
} from "lucide-react";

export default function MerchantDashboardOverview() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  // Cassandra Telemetry Radar State
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
      const [ordData, prodData] = await Promise.all([fetchOrders(), fetchProducts()]);
      setOrders(ordData);
      setProducts(prodData);
      setLoading(false);
    }
    load();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Order ${orderId} transitioned to "${newStatus}"`, "success");
    } else {
      showToast(res.error || "Cannot perform invalid state transition", "error");
    }
  };

  const gmvTotal = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Distributed Polyglot Cluster Online
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Real-time telemetry, MongoDB inventory, Neo4j social referrals, and Hive OLAP pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/merchant/products/new"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create Product</span>
          </Link>
          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl border border-slate-200/80 bg-slate-100 hover:bg-slate-200/70 text-slate-800 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Server className="w-4 h-4 text-slate-600" />
            <span>NestJS API</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KpiCard
          title="Gross Revenue (GMV)"
          value={formatPrice(9027.0 + gmvTotal)}
          change="+18.4%"
          trend="up"
          subtitle="Hive Warehouse + Live"
          icon={<DollarSign className="w-5 h-5 text-blue-600" />}
        />
        <KpiCard
          title="Fulfillment Queue"
          value={orders.length}
          change="+12.5%"
          trend="up"
          subtitle="MongoDB Operational State"
          icon={<ShoppingCart className="w-5 h-5 text-blue-600" />}
        />
        <KpiCard
          title="Catalog SKUs"
          value={products.length}
          change="+3 new"
          trend="up"
          subtitle="Polymorphic Documents"
          icon={<Package className="w-5 h-5 text-blue-600" />}
        />
        <KpiCard
          title="Active Courier Fleet"
          value="800 Riders"
          change="160 w/s"
          trend="up"
          subtitle="Cassandra LSM Ingestion"
          icon={<Truck className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* Polyglot Datastore Architecture Grid */}
      <div className="bg-slate-950 text-white rounded-2xl p-5 sm:p-7 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Polyglot Persistence Architecture Matrix
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            All 5 Datastores Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">MongoDB 8.0</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Catalog & Orders</p>
            <p className="text-[10px] text-slate-500">Polymorphic Schemas, Document ACID</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">Cassandra</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Rider Telemetry</p>
            <p className="text-[10px] text-slate-500">160 writes/sec, TWCS compaction</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400">Neo4j Graph</span>
              <span className="w-2 h-2 rounded-full bg-purple-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Referral Network</p>
            <p className="text-[10px] text-slate-500">Index-Free Adjacency, 3 Hops</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">Apache Hive</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-medium">OLAP Warehouse</p>
            <p className="text-[10px] text-slate-500">HDFS ORC, 8 Buckets, Partitioning</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">Redis 7.2</span>
              <span className="w-2 h-2 rounded-full bg-rose-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Caches & Sessions</p>
            <p className="text-[10px] text-slate-500">Sub-ms cart & rate limiting</p>
          </div>
        </div>
      </div>

      {/* Cassandra Fleet Telemetry Radar Widget */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Cassandra Fleet Telemetry Radar
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  160 w/s LSM Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time courier GPS tracking via distributed Apache Cassandra cluster with TWCS compaction.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTriggerRadarPing}
              disabled={isPinging}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isPinging ? "Writing..." : "Simulate Radar Ping"}</span>
            </button>
            <Link
              href="/merchant/fleet"
              className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors flex items-center space-x-1"
            >
              <span>Full Fleet Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Radar Screen Visualization */}
          <div className="lg:col-span-5 flex justify-center py-2">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-cyan-500/30 bg-slate-900/80 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex items-center justify-center overflow-hidden">
              {/* Concentric distance rings */}
              <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-12 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-20 rounded-full border border-cyan-500/25" />
              <div className="absolute inset-28 rounded-full border border-cyan-500/30" />

              {/* Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-500/20" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-cyan-500/20" />

              {/* Rotating Sweep Beam */}
              <div
                className="absolute inset-0 origin-center pointer-events-none animate-[spin_5s_linear_infinite]"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(6, 182, 212, 0.35) 0deg, rgba(6, 182, 212, 0) 60deg, transparent 360deg)",
                }}
              />

              {/* Center Tower Pin */}
              <div className="w-3 h-3 rounded-full bg-cyan-400 z-10 shadow-[0_0_10px_#22d3ee]" />

              {/* Courier Radar Blips */}
              {/* Rider 101 - Phnom Penh Central */}
              <div className="absolute top-[32%] left-[45%] z-10 group cursor-pointer">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                </span>
                <span className="absolute left-4 top-0 bg-slate-950/90 text-cyan-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap hidden group-hover:block">
                  R-101 (Phnom Penh) • 28 km/h
                </span>
              </div>

              {/* Rider 102 - Tuol Kork */}
              <div className="absolute top-[48%] left-[68%] z-10 group cursor-pointer">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="absolute left-3 top-0 bg-slate-950/90 text-emerald-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap hidden group-hover:block">
                  R-102 (Tuol Kork) • 32 km/h
                </span>
              </div>

              {/* Rider 201 - Siem Reap */}
              <div className="absolute top-[20%] left-[26%] z-10 group cursor-pointer">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
                <span className="absolute left-3 top-0 bg-slate-950/90 text-cyan-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap hidden group-hover:block">
                  R-201 (Siem Reap) • 24 km/h
                </span>
              </div>

              {/* Rider 301 - Battambang */}
              <div className="absolute top-[70%] left-[34%] z-10 group cursor-pointer">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </span>
                <span className="absolute left-3 top-0 bg-slate-950/90 text-amber-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-amber-500/30 whitespace-nowrap hidden group-hover:block">
                  R-301 (Battambang) • 26 km/h
                </span>
              </div>

              {/* Range labels */}
              <span className="absolute bottom-2 text-[9px] font-mono text-cyan-500/60 uppercase tracking-widest">
                RADAR RANGE: 25 KM
              </span>
            </div>
          </div>

          {/* Cassandra LSM Architecture Metrics & CQL Feed */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Throughput</span>
                <p className="text-base font-bold text-cyan-400 font-mono mt-0.5">160 writes/s</p>
                <span className="text-[10px] text-slate-500">LSM Memtable</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Write Latency</span>
                <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">1.2 ms</p>
                <span className="text-[10px] text-slate-500">CommitLog append</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Fleet</span>
                <p className="text-base font-bold text-white font-mono mt-0.5">800 Riders</p>
                <span className="text-[10px] text-slate-500">3 Prov. Hubs</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Compaction</span>
                <p className="text-base font-bold text-purple-400 font-mono mt-0.5">TWCS</p>
                <span className="text-[10px] text-slate-500">30-day TTL drop</span>
              </div>
            </div>

            {/* Live CQL Stream Console */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                <div className="flex items-center space-x-1.5 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cassandra CQL Stream (keyspace: telemetry_ks)</span>
                </div>
                <span className="flex items-center space-x-1 text-emerald-400 font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>STREAMING</span>
                </span>
              </div>

              <div className="font-mono text-[11px] text-slate-300 space-y-1.5 overflow-hidden">
                {radarLogs.map((log, i) => (
                  <div key={i} className={`truncate ${i === 0 ? "text-cyan-300 font-medium" : "text-slate-400 opacity-80"}`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Queue with Fulfillment Controls */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Fulfillment Order Queue</h3>
            <p className="text-xs text-slate-500">Advance order fulfillment state machine in MongoDB</p>
          </div>
          <Link
            href="/merchant/orders"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All Orders ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Advance State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.order_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    <Link href={`/merchant/orders/${ord.order_id}`} className="hover:text-blue-600">
                      {ord.order_id}
                    </Link>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">{ord.customer_name}</td>
                  <td className="p-3.5 text-[11px] text-slate-500">
                    {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    {formatPrice(ord.total)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        ord.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                          : ord.status === "Out for Delivery"
                          ? "bg-blue-50 text-blue-700 border border-blue-200/80"
                          : "bg-amber-50 text-amber-700 border border-amber-200/80"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {(() => {
                      const nextStates = VALID_ORDER_TRANSITIONS[ord.status] || [];
                      if (nextStates.length === 0) {
                        return (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            ✓ Fulfilled
                          </span>
                        );
                      }
                      return (
                        <div className="flex items-center justify-end gap-1.5">
                          {nextStates.map((nextSt) => (
                            <button
                              key={nextSt}
                              onClick={() => handleUpdateStatus(ord.order_id, nextSt)}
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                nextSt === "Cancelled"
                                  ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                                  : "bg-slate-900 hover:bg-blue-600 text-white"
                              }`}
                            >
                              → {nextSt}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
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
