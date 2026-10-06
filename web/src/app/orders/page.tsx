"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OrderRecord } from "@/types";
import { fetchOrders } from "@/lib/api";
import { useCurrency } from "@/context/CurrencyContext";
import { OrderTimeline } from "@/components/customer/OrderTimeline";
import { Package, Clock, MapPin, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  const statuses = ["All", "Pending", "Preparing", "Out for Delivery", "Delivered"];

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === statusFilter.toLowerCase());

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium mb-1">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Orders</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Orders & Delivery Tracking
          </h1>
          <p className="text-xs text-slate-500">Live order fulfillment updates and Cassandra rider tracking across Cambodia</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/80 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-6 bg-slate-200 rounded w-1/2" />
              <div className="h-12 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-200/80 shadow-xs space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No orders found in this status</h3>
          <p className="text-xs text-slate-500">You haven't placed any orders matching the selected filter.</p>
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((ord) => (
            <div
              key={ord.order_id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow space-y-5"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold">
                    <Package className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-extrabold text-slate-900">{ord.order_id}</span>
                      <span className="text-xs text-slate-400">• {new Date(ord.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Payment: <strong className="text-slate-700">{ord.payment_method}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      ord.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : ord.status === "Out for Delivery"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : ord.status === "Preparing"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {ord.status}
                  </span>
                  <span className="text-lg font-bold text-slate-900 font-mono">
                    {formatPrice(ord.total)}
                  </span>
                  <Link
                    href={`/orders/${ord.order_id}`}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    title="View details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Delivery Progression Timeline */}
              <OrderTimeline status={ord.status} />

              {/* Items List */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Items Ordered
                </span>
                <div className="divide-y divide-slate-200/60">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">
                        {item.name} <span className="text-slate-400 font-normal">x{item.quantity}</span>
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 pt-1 gap-2">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Delivery Zone: <strong className="text-slate-800">{ord.province}</strong></span>
                </div>
                <span>Customer ID: <strong className="text-slate-800">{ord.customer_id}</strong> ({ord.customer_name})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
