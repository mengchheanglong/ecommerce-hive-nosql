"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OrderRecord, RiderTelemetry } from "@/types";
import { fetchOrderById, updateOrderStatus, fetchRiders } from "@/lib/api";
import { VALID_ORDER_TRANSITIONS } from "@/lib/data";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import { OrderTimeline } from "@/components/customer/OrderTimeline";
import {
  Package,
  ArrowLeft,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Truck,
  Radio,
  Phone,
  AlertTriangle,
  ArrowRight,
  Battery,
  Gauge,
  Sparkles,
} from "lucide-react";

export default function MerchantOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [riders, setRiders] = useState<RiderTelemetry[]>([]);
  const [selectedRiderId, setSelectedRiderId] = useState("R-101");
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      if (!orderId) return;
      setLoading(true);
      const [orderData, riderData] = await Promise.all([
        fetchOrderById(orderId),
        fetchRiders(),
      ]);
      setOrder(orderData);
      setRiders(riderData);
      if (orderData?.assigned_courier_id) {
        setSelectedRiderId(orderData.assigned_courier_id);
      } else if (orderData && riderData.length > 0) {
        const provRider = riderData.find(
          (r) => r.city.toLowerCase() === orderData.province.toLowerCase()
        );
        if (provRider) setSelectedRiderId(provRider.id);
      }
      setLoading(false);
    }
    load();
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    const res = await updateOrderStatus(order.order_id, newStatus);
    if (res.success) {
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
      showToast(`Order status updated to "${newStatus}"`, "success");
    } else {
      showToast(res.error || "Cannot perform invalid state transition", "error");
    }
  };

  const handleDispatchCourier = async () => {
    if (!order) return;
    const rider = riders.find((r) => r.id === selectedRiderId);
    const res = await updateOrderStatus(order.order_id, "Out for Delivery", false, selectedRiderId);
    if (res.success) {
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: "Out for Delivery",
              assigned_courier_id: rider?.id,
              assigned_courier_name: rider?.name,
              courier_phone:
                rider?.city === "Phnom Penh"
                  ? "+855 12 999 888"
                  : rider?.city === "Siem Reap"
                  ? "+855 15 777 666"
                  : "+855 17 444 333",
            }
          : prev
      );
      showToast(
        `Courier ${rider?.name || selectedRiderId} dispatched for ${order.order_id}!`,
        "success"
      );
    } else {
      showToast(res.error || "Cannot dispatch courier", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500 font-medium">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs">Loading order document and courier fleet from MongoDB & Cassandra...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Order not found</h2>
        <Link
          href="/merchant/orders"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fulfillment Queue</span>
        </Link>
      </div>
    );
  }

  const legalNextStates = VALID_ORDER_TRANSITIONS[order.status] || [];
  const assignedRider = riders.find((r) => r.id === selectedRiderId) || riders[0];

  return (
    <div className="max-w-4xl w-full mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/merchant" className="hover:text-slate-900 transition-colors">Merchant</Link>
        <span>/</span>
        <Link href="/merchant/orders" className="hover:text-slate-900 transition-colors">Orders</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">{order.order_id}</span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
        {/* Header with Status Indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-bold">
              <Package className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{order.order_id}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    order.status === "Delivered"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : order.status === "Out for Delivery"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : order.status === "Preparing"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Recorded on {new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Grand Total</span>
            <p className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
              {formatPrice(order.total)}
            </p>
          </div>
        </div>

        {/* Visual State Progression Timeline */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Fulfillment Progression Timeline
          </h3>
          <OrderTimeline status={order.status} />
        </div>

        {/* STATE MACHINE TRANSITION CONTROLS */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Legal State Machine Transitions</h4>
              <p className="text-[11px] text-slate-500">
                Single-document ACID queue governed by deterministic state machine
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
              State: {order.status}
            </span>
          </div>

          {legalNextStates.length === 0 ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Terminal fulfillment state reached ({order.status}). No further state transitions required.</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {legalNextStates.map((nextSt) => (
                <button
                  key={nextSt}
                  onClick={() => handleStatusChange(nextSt)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer active:scale-95 ${
                    nextSt === "Cancelled"
                      ? "bg-white hover:bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-slate-900 hover:bg-emerald-600 text-white"
                  }`}
                >
                  <span>Transition to: {nextSt}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COURIER DISPATCH PANEL */}
        {order.status !== "Delivered" && order.status !== "Cancelled" && (
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-700" />
                <h4 className="font-extrabold text-slate-900">Cassandra Courier Fleet Dispatch</h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                800 Live Couriers Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Select Active Courier in {order.province}
                </label>
                <select
                  value={selectedRiderId}
                  onChange={(e) => setSelectedRiderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 cursor-pointer focus:outline-none"
                >
                  <optgroup label={`Local Hub: ${order.province}`}>
                    {riders
                      .filter((r) => r.city.toLowerCase() === order.province.toLowerCase())
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.id}) — {r.status} • {r.speed} • Battery: {r.battery}%
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Other Regional Hubs">
                    {riders
                      .filter((r) => r.city.toLowerCase() !== order.province.toLowerCase())
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.id}) — {r.city} • {r.status}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              {assignedRider && (
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{assignedRider.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{assignedRider.id}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-600 pt-0.5">
                    <span className="flex items-center space-x-1">
                      <Gauge className="w-3 h-3 text-emerald-600" />
                      <span>{assignedRider.speed}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Battery className="w-3 h-3 text-emerald-600" />
                      <span>{assignedRider.battery}%</span>
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[10px]">{assignedRider.city}</span>
                  </div>
                </div>
              )}
            </div>

            {order.status === "Preparing" && (
              <button
                type="button"
                onClick={handleDispatchCourier}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer active:scale-95"
              >
                <Truck className="w-4 h-4" />
                <span>Assign & Dispatch Courier to Customer Destination</span>
              </button>
            )}
          </div>
        )}

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Customer Information</span>
            </div>
            <p className="text-slate-900 font-semibold">{order.customer_name}</p>
            <p className="text-slate-500">Customer ID: {order.customer_id}</p>
            <p className="text-slate-500">Payment: {order.payment_method}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Delivery Destination</span>
            </div>
            <p className="text-slate-600">{order.delivery_address || `${order.province}, Cambodia`}</p>
            <p className="text-slate-900 font-semibold">Province: {order.province}</p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Line Items ({order.items.length})
          </h3>
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
            {order.items.map((it, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-bold text-slate-900">{it.name}</p>
                  <p className="text-slate-400">SKU: {it.product_id} • Quantity: {it.quantity}</p>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  {formatPrice(it.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
          <Link
            href="/merchant/orders"
            className="flex items-center space-x-1 font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fulfillment Queue</span>
          </Link>
          <div className="text-right">
            <span className="text-slate-500">Settled Order Total:</span>
            <span className="text-lg font-bold text-slate-900 font-mono ml-2">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
