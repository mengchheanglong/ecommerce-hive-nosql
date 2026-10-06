"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchOrders, fetchProducts, fetchHiveAnalytics, updateOrderStatus } from "@/lib/api";
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
} from "lucide-react";

export default function MerchantDashboardOverview() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

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
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Create Product</span>
          </Link>
          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl border border-slate-200/80 bg-slate-100 hover:bg-slate-200/70 text-slate-800 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Server className="w-4 h-4 text-emerald-600" />
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
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
        />
        <KpiCard
          title="Fulfillment Queue"
          value={orders.length}
          change="+12.5%"
          trend="up"
          subtitle="MongoDB Operational State"
          icon={<ShoppingCart className="w-5 h-5 text-emerald-600" />}
        />
        <KpiCard
          title="Catalog SKUs"
          value={products.length}
          change="+3 new"
          trend="up"
          subtitle="Polymorphic Documents"
          icon={<Package className="w-5 h-5 text-emerald-600" />}
        />
        <KpiCard
          title="Active Courier Fleet"
          value="800 Riders"
          change="160 w/s"
          trend="up"
          subtitle="Cassandra LSM Ingestion"
          icon={<Truck className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Polyglot Datastore Architecture Grid */}
      <div className="bg-slate-950 text-white rounded-2xl p-5 sm:p-7 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400" />
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

      {/* Recent Orders Queue with Fulfillment Controls */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Fulfillment Order Queue</h3>
            <p className="text-xs text-slate-500">Advance order fulfillment state machine in MongoDB</p>
          </div>
          <Link
            href="/merchant/orders"
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center space-x-1"
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
                    <Link href={`/merchant/orders/${ord.order_id}`} className="hover:text-emerald-700">
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
                                  : "bg-slate-900 hover:bg-emerald-600 text-white"
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
