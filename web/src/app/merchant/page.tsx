"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchOrders, fetchProducts, updateOrderStatus } from "@/lib/api";
import { OrderRecord, Product } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Truck,
  ExternalLink,
  Layers,
} from "lucide-react";

export default function MerchantStoreOverview() {
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
    } else {
      showToast(res.error || "Cannot perform invalid state transition", "error");
    }
  };

  // Store-specific metrics calculations
  const totalStoreSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const preparingOrders = orders.filter((o) => o.status === "Preparing");
  const lowStockItems = products.filter((p) => (p.stock ?? 100) < 30);
  const avgOrderValue = orders.length > 0 ? totalStoreSales / orders.length : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 mb-1">
            <span>Store Operations Cockpit</span>
            <span>•</span>
            <span>Mekong Electronics Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Daily Store Management & Fulfillment
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your store's inventory, accept incoming customer orders, and dispatch courier pickups.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <Link
            href="/merchant/products/new"
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Item</span>
          </Link>
          <Link
            href="/merchant/analytics"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Store Analytics</span>
          </Link>
        </div>
      </div>

      {/* BAND 1: Store Headline KPIs (Blueprint Architecture) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Paid Store Sales */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Paid Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ${totalStoreSales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>▲ +14.2% vs yesterday</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{orders.length} orders</span>
            </div>
          </div>
        </div>

        {/* Available Withdrawable Balance */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Available Balance</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              $14,250.00
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-blue-600 font-semibold mt-1">
              <span>NBC Bakong Settlement Ready</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">$0 fee</span>
            </div>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Average Basket (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ${avgOrderValue.toFixed(2)}
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-purple-600 font-semibold mt-1">
              <span>High-value Electronics mix</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Inventory Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {lowStockItems.length} Items Low
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-amber-600 font-semibold mt-1">
              <span>Reorder recommended</span>
            </div>
          </div>
        </div>
      </div>

      {/* BAND 2: Immediate Tasks & Queues (Blueprint Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Needing Decision / Acceptance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Orders Awaiting Acceptance</h3>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              {pendingOrders.length} Pending (SLA &lt; 15m)
            </span>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              All incoming orders have been accepted! Good job.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((ord) => (
                <div
                  key={ord.order_id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{ord.order_id}</span>
                      <span className="text-[11px] font-semibold text-slate-600">• {ord.customer_name}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">
                        {ord.province}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Total: <strong className="text-slate-900">${ord.total.toFixed(2)}</strong> via {ord.payment_method}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleUpdateStatus(ord.order_id, "Preparing")}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(ord.order_id, "Cancelled")}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders Ready to Pack & Dispatch */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Packing & Courier Dispatch</h3>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
              {preparingOrders.length} In Progress
            </span>
          </div>

          {preparingOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No orders waiting to be packed right now.
            </div>
          ) : (
            <div className="space-y-3">
              {preparingOrders.map((ord) => (
                <div
                  key={ord.order_id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{ord.order_id}</span>
                      <span className="text-[11px] font-semibold text-slate-600">• {ord.customer_name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Courier: <strong>{ord.assigned_courier_name || "Assigning Rider..."}</strong>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleUpdateStatus(ord.order_id, "Out for Delivery")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Ready for Pickup</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BAND 3: Store Inventory Quick Snapshot */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Store Catalog & Stock Levels</h3>
            <p className="text-xs text-slate-500">Current stock availability in your store warehouse</p>
          </div>
          <Link
            href="/merchant/products"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>Full Inventory Table ({products.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 6).map((prod) => (
            <div
              key={prod.product_id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center space-x-3"
            >
              <img
                src={prod.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80"}
                alt={prod.name}
                className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-xs text-slate-900 truncate block">
                  {prod.name}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  ${prod.price.toFixed(2)} • {prod.category}
                </span>
                <div className="flex items-center space-x-1.5 mt-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      (prod.stock ?? 0) < 20 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                  />
                  <span className="text-[10px] font-semibold text-slate-600">
                    {prod.stock ?? 0} in stock
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
