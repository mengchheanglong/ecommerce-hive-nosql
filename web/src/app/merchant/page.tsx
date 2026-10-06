"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchOrders, fetchProducts, fetchHiveAnalytics, updateOrderStatus } from "@/lib/api";
import { OrderRecord, Product } from "@/types";
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
      showToast(`Order ${orderId} updated to "${newStatus}"`, "success");
    }
  };

  const gmvTotal = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2eae5] shadow-card">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15c089] animate-pulse" />
            <span className="text-xs font-bold text-[#0c835c] uppercase tracking-wider">
              Production Distributed Cluster Online
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#013326] mt-1 tracking-tight">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs text-[#5c7167]">
            Real-time telemetry, MongoDB inventory, Neo4j social referrals, and Hive OLAP pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/merchant/products/new"
            className="px-4 py-2.5 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-[#15c089]" />
            <span>Create Product</span>
          </Link>
          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-[#e2eae5] bg-[#f1f6f3] hover:bg-[#e2eae5] text-[#013326] text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Server className="w-4 h-4 text-[#0c835c]" />
            <span>NestJS API</span>
            <ExternalLink className="w-3 h-3 text-[#5c7167]" />
          </a>
        </div>
      </div>

      {/* KPI Cards Grid (Angkoro style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Gross Revenue (GMV)"
          value={formatPrice(9027.0 + gmvTotal)}
          change="+18.4%"
          trend="up"
          subtitle="Hive Warehouse + Live"
          icon={<DollarSign className="w-5 h-5 text-[#0c835c]" />}
        />
        <KpiCard
          title="Fulfillment Queue"
          value={orders.length}
          change="+12.5%"
          trend="up"
          subtitle="MongoDB Operational State"
          icon={<ShoppingCart className="w-5 h-5 text-[#0c835c]" />}
        />
        <KpiCard
          title="Catalog SKUs"
          value={products.length}
          change="+3 new"
          trend="up"
          subtitle="Polymorphic Documents"
          icon={<Package className="w-5 h-5 text-[#0c835c]" />}
        />
        <KpiCard
          title="Active Courier Fleet"
          value="800 Riders"
          change="160 w/s"
          trend="up"
          subtitle="Cassandra LSM Ingestion"
          icon={<Truck className="w-5 h-5 text-[#0c835c]" />}
        />
      </div>

      {/* Polyglot Datastore Architecture Grid */}
      <div className="bg-[#011c15] text-white rounded-3xl p-6 sm:p-8 border border-[#0a4636] space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#0a4636]">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#15c089]" />
            <h3 className="text-base font-extrabold text-white">
              Polyglot Persistence Architecture Matrix
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#9cf0ce] bg-[#0a4636]/60 px-3 py-1 rounded-full">
            All 5 Datastores Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#01281e] border border-[#0a4636] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#15c089]">MongoDB 8.0</span>
              <span className="w-2 h-2 rounded-full bg-[#15c089]" />
            </div>
            <p className="text-[11px] text-[#cad6cf]">Catalog & Orders</p>
            <p className="text-[10px] text-[#9cf0ce]/70">Polymorphic Schemas, Single-doc ACID</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#01281e] border border-[#0a4636] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#15c089]">Cassandra</span>
              <span className="w-2 h-2 rounded-full bg-[#15c089]" />
            </div>
            <p className="text-[11px] text-[#cad6cf]">Rider Telemetry</p>
            <p className="text-[10px] text-[#9cf0ce]/70">160 writes/sec, TWCS compaction</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#01281e] border border-[#0a4636] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#15c089]">Neo4j Graph</span>
              <span className="w-2 h-2 rounded-full bg-[#15c089]" />
            </div>
            <p className="text-[11px] text-[#cad6cf]">Referral Network</p>
            <p className="text-[10px] text-[#9cf0ce]/70">Index-Free Adjacency, 3-Hop Traversal</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#01281e] border border-[#0a4636] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#15c089]">Apache Hive</span>
              <span className="w-2 h-2 rounded-full bg-[#15c089]" />
            </div>
            <p className="text-[11px] text-[#cad6cf]">OLAP Warehouse</p>
            <p className="text-[10px] text-[#9cf0ce]/70">HDFS ORC, 8 Buckets, Tez Engine</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#01281e] border border-[#0a4636] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#15c089]">Redis 7.2</span>
              <span className="w-2 h-2 rounded-full bg-[#15c089]" />
            </div>
            <p className="text-[11px] text-[#cad6cf]">Caches & Sessions</p>
            <p className="text-[10px] text-[#9cf0ce]/70">Sub-millisecond cart & rate limiting</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Queue with Fulfillment Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e2eae5] shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#013326]">Live Fulfillment Order Queue</h3>
            <p className="text-xs text-[#5c7167]">Advance order fulfillment state machine in MongoDB</p>
          </div>
          <Link
            href="/merchant/orders"
            className="text-xs font-bold text-[#0c835c] hover:underline flex items-center space-x-1"
          >
            <span>View All Orders ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6faf8] text-[#5c7167] font-bold border-b border-[#e2eae5]">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Advance State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f6f3]">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.order_id} className="hover:bg-[#fafcfb] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#013326]">
                    <Link href={`/merchant/orders/${ord.order_id}`} className="hover:underline">
                      {ord.order_id}
                    </Link>
                  </td>
                  <td className="p-3.5 font-semibold text-[#013326]">{ord.customer_name}</td>
                  <td className="p-3.5 text-[11px] text-[#5c7167]">
                    {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-[#013326]">
                    {formatPrice(ord.total)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        ord.status === "Delivered"
                          ? "bg-[#eafaf4] text-[#0c835c] border border-[#9cf0ce]"
                          : ord.status === "Out for Delivery"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.order_id, e.target.value)}
                      className="px-2.5 py-1 text-xs rounded-xl border border-[#e2eae5] bg-[#f1f6f3] font-bold text-[#013326] cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
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
