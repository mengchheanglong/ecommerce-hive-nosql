"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OrderRecord } from "@/types";
import { fetchOrderById } from "@/lib/api";
import { useCurrency } from "@/context/CurrencyContext";
import { OrderTimeline } from "@/components/customer/OrderTimeline";
import { Package, ArrowLeft, MapPin, CreditCard, Truck, CheckCircle2 } from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function load() {
      if (!orderId) return;
      setLoading(true);
      const data = await fetchOrderById(orderId);
      setOrder(data);
      setLoading(false);
    }
    load();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#15c089] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#5c7167] mt-3">Retrieving order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#013326]">Order not found</h2>
        <p className="text-xs text-[#5c7167]">No order record matched ID {orderId}.</p>
        <Link
          href="/orders"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#013326] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center space-x-2 text-xs text-[#5c7167]">
        <Link href="/" className="hover:text-[#013326]">Home</Link>
        <span>/</span>
        <Link href="/orders" className="hover:text-[#013326]">Orders</Link>
        <span>/</span>
        <span className="text-[#013326] font-bold">{order.order_id}</span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eae5] shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#f1f6f3] pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#013326] text-white flex items-center justify-center">
              <Package className="w-6 h-6 text-[#15c089]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#013326]">{order.order_id}</h1>
              <p className="text-xs text-[#5c7167]">Placed on {new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                order.status === "Delivered"
                  ? "bg-[#eafaf4] text-[#0c835c] border border-[#9cf0ce]"
                  : order.status === "Out for Delivery"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {order.status}
            </span>
            <p className="text-xl font-black text-[#013326] font-mono mt-1">
              {formatPrice(order.total)}
            </p>
          </div>
        </div>

        {/* Live Delivery Progression */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#5c7167]">
            Fulfillment Progression Timeline
          </h3>
          <OrderTimeline status={order.status} />
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#f1f6f3]">
          <div className="p-4 rounded-2xl bg-[#f6faf8] border border-[#e2eae5] space-y-1 text-xs">
            <div className="flex items-center space-x-2 text-[#013326] font-bold">
              <MapPin className="w-4 h-4 text-[#15c089]" />
              <span>Delivery Destination</span>
            </div>
            <p className="text-[#5c7167] mt-1">{order.delivery_address || `${order.province}, Cambodia`}</p>
            <p className="text-[#013326] font-semibold">Recipient: {order.customer_name}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f6faf8] border border-[#e2eae5] space-y-1 text-xs">
            <div className="flex items-center space-x-2 text-[#013326] font-bold">
              <CreditCard className="w-4 h-4 text-[#15c089]" />
              <span>Settlement Method</span>
            </div>
            <p className="text-[#5c7167] mt-1">{order.payment_method}</p>
            <p className="text-[#0c835c] font-semibold">Status: Settled & Confirmed</p>
          </div>
        </div>

        {/* Itemized breakdown */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#5c7167]">
            Order Line Items
          </h3>
          <div className="border border-[#e2eae5] rounded-2xl overflow-hidden divide-y divide-[#f1f6f3] text-xs">
            {order.items.map((it, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center bg-[#fafcfb]">
                <div>
                  <p className="font-bold text-[#013326]">{it.name}</p>
                  <p className="text-[#5c7167]">SKU: {it.product_id} • Quantity: {it.quantity}</p>
                </div>
                <span className="font-mono font-bold text-[#013326]">
                  {formatPrice(it.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center">
          <Link
            href="/orders"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#013326] hover:text-[#0c835c]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
