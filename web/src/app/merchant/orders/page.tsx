"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchOrders, updateOrderStatus } from "@/lib/api";
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
      showToast("Error updating order state", "error");
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
          <h1 className="text-2xl font-black text-[#013326]">Fulfillment & Order State Machine</h1>
          <p className="text-xs text-[#5c7167]">
            Single-document ACID queue in MongoDB with staged courier transition
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e2eae5] shadow-card">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedStatus === st
                  ? "bg-[#013326] text-white"
                  : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#5c7167] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, name, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#e2eae5] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6faf8] text-[#5c7167] font-bold border-b border-[#e2eae5]">
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
            <tbody className="divide-y divide-[#f1f6f3]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#5c7167]">
                    Loading order queue...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#5c7167]">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.order_id} className="hover:bg-[#fafcfb] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#013326]">
                      <Link
                        href={`/merchant/orders/${ord.order_id}`}
                        className="hover:underline flex items-center space-x-1"
                      >
                        <span>{ord.order_id}</span>
                        <ChevronRight className="w-3 h-3 text-[#5c7167]" />
                      </Link>
                    </td>
                    <td className="p-4 font-semibold text-[#013326]">{ord.customer_name}</td>
                    <td className="p-4 text-[#5c7167]">{ord.province}</td>
                    <td className="p-4 text-[11px] text-[#5c7167] max-w-xs truncate">
                      {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                    </td>
                    <td className="p-4 font-mono font-bold text-[#013326]">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="p-4 text-[11px] text-[#5c7167]">{ord.payment_method}</td>
                    <td className="p-4">
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
                    <td className="p-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.order_id, e.target.value)}
                        className="px-2.5 py-1 text-xs rounded-xl border border-[#e2eae5] bg-[#f1f6f3] font-bold text-[#013326] cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
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
