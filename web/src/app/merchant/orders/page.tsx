"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchOrders, updateOrderStatus } from "@/lib/api";
import { VALID_ORDER_TRANSITIONS } from "@/lib/data";
import { OrderRecord } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import {
  ShoppingCart,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  Package,
} from "lucide-react";

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Order ${orderId} transitioned to ${newStatus}`, "success");
    } else {
      showToast(res.error || "Error updating order state", "error");
    }
  };

  const statuses = ["All", "Pending", "Preparing", "Out for Delivery", "Delivered"];

  const filtered = useMemo(() => {
    return orders
      .filter((o) => (selectedStatus === "All" ? true : o.status.toLowerCase() === selectedStatus.toLowerCase()))
      .filter((o) =>
        searchQuery === ""
          ? true
          : o.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.province.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [orders, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium mb-1">
            <span>Merchant Console</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Orders Fulfillment</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Fulfillment & Order State Machine</h1>
          <p className="text-xs text-slate-500">
            Single-document ACID queue in MongoDB with staged courier transition
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedStatus === st
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, name, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Province</th>
                <th className="p-4">Items Summary</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Transition State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Loading order queue...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.order_id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      <Link
                        href={`/merchant/orders/${ord.order_id}`}
                        className="hover:underline flex items-center space-x-1"
                      >
                        <span>{ord.order_id}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </Link>
                    </td>
                    <td className="p-4 font-semibold text-slate-900">{ord.customer_name}</td>
                    <td className="p-4 text-slate-600">{ord.province}</td>
                    <td className="p-4 text-[11px] text-slate-500 max-w-xs truncate">
                      {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="p-4 text-[11px] text-slate-600">{ord.payment_method}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                    </td>
                    <td className="p-4 text-right">
                      {(() => {
                        const nextStates = VALID_ORDER_TRANSITIONS[ord.status] || [];
                        if (nextStates.length === 0) {
                          return (
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                                ord.status === "Cancelled"
                                  ? "text-rose-700 bg-rose-50 border-rose-200"
                                  : "text-emerald-700 bg-emerald-50 border-emerald-200"
                              }`}
                            >
                              {ord.status === "Cancelled" ? "✕ Cancelled" : "✓ Fulfilled"}
                            </span>
                          );
                        }
                        return (
                          <div className="flex items-center justify-end gap-1.5">
                            {nextStates.map((nextSt) => (
                              <button
                                key={nextSt}
                                onClick={() => handleStatusChange(ord.order_id, nextSt)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
