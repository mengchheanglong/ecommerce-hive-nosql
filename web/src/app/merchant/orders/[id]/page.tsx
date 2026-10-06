"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OrderRecord } from "@/types";
import { fetchOrderById, updateOrderStatus } from "@/lib/api";
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
} from "lucide-react";

export default function MerchantOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

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

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    const res = await updateOrderStatus(order.order_id, newStatus);
    if (res.success) {
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
      showToast(`Order status updated to ${newStatus}`, "success");
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#5c7167]">
        Loading order document from MongoDB...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#013326]">Order not found</h2>
        <Link
          href="/merchant/orders"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#013326] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Queue</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-[#5c7167]">
        <Link href="/merchant" className="hover:text-[#013326]">Merchant</Link>
        <span>/</span>
        <Link href="/merchant/orders" className="hover:text-[#013326]">Orders</Link>
        <span>/</span>
        <span className="text-[#013326] font-bold">{order.order_id}</span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eae5] shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#f1f6f3] pb-6">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#013326] text-white flex items-center justify-center">
                <Package className="w-5 h-5 text-[#15c089]" />
              </div>
              <div>
                <h1 className="text-xl font-black text-[#013326]">{order.order_id}</h1>
                <p className="text-xs text-[#5c7167]">Recorded on {new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-[#5c7167]">Fulfillment State:</span>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#e2eae5] bg-[#f1f6f3] text-xs font-bold text-[#013326] cursor-pointer"
            >
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <OrderTimeline status={order.status} />
        </div>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#f6faf8] border border-[#e2eae5] space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-[#013326]">
              <User className="w-4 h-4 text-[#15c089]" />
              <span>Customer Information</span>
            </div>
            <p className="text-[#013326] font-semibold">{order.customer_name}</p>
            <p className="text-[#5c7167]">Customer ID: {order.customer_id}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f6faf8] border border-[#e2eae5] space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-[#013326]">
              <MapPin className="w-4 h-4 text-[#15c089]" />
              <span>Delivery Destination</span>
            </div>
            <p className="text-[#5c7167]">{order.delivery_address || `${order.province}, Cambodia`}</p>
            <p className="text-[#013326] font-semibold">Province: {order.province}</p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#5c7167]">
            Line Items ({order.items.length})
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

        <div className="flex justify-between items-center pt-3 border-t border-[#f1f6f3] text-xs">
          <Link
            href="/merchant/orders"
            className="flex items-center space-x-1 font-bold text-[#013326] hover:text-[#0c835c]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fulfillment Queue</span>
          </Link>
          <div className="text-right">
            <span className="text-[#5c7167]">Order Grand Total:</span>
            <span className="text-lg font-black text-[#013326] font-mono ml-2">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
