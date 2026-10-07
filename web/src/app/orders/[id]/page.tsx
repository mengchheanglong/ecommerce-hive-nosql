"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OrderRecord, RiderTelemetry } from "@/types";
import { fetchOrderById, fetchRiders } from "@/lib/api";
import { useCurrency } from "@/context/CurrencyContext";
import { OrderTimeline } from "@/components/customer/OrderTimeline";
import { Modal } from "@/components/shared/Modal";
import {
  Package,
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Radio,
  Printer,
  FileText,
  QrCode,
  Download,
  Building2,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [riders, setRiders] = useState<RiderTelemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    async function load(showSpinner = false) {
      if (!orderId) return;
      if (showSpinner) setLoading(true);
      try {
        const [orderData, riderData] = await Promise.all([
          fetchOrderById(orderId),
          fetchRiders(),
        ]);
        setOrder(orderData);
        setRiders(riderData);
      } catch (err) {
        // Retrying on next tick
      } finally {
        if (showSpinner) setLoading(false);
      }
    }
    load(true);

    // Live polling every 2s to reflect digital-twin progression & Cassandra telemetry
    timer = setInterval(() => {
      load(false);
    }, 2000);

    return () => clearInterval(timer);
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 mt-3 font-medium">Retrieving order telemetry & line items...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Order not found</h2>
        <p className="text-xs text-slate-500">No order record matched ID {orderId}.</p>
        <Link
          href="/orders"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/orders" className="hover:text-slate-900 transition-colors">Orders</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">{order.order_id}</span>
        </div>

        <button
          onClick={() => setIsReceiptModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border border-slate-200"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>View Tax Receipt</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
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
              <p className="text-xs text-slate-500 mt-0.5">Placed on {new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
            <p className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
              {formatPrice(order.total)}
            </p>
            <button
              onClick={() => setIsReceiptModalOpen(true)}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* Live Delivery Progression */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Fulfillment Progression Timeline
          </h3>
          <OrderTimeline status={order.status} />
        </div>

        {/* Assigned Courier Card (if Out for Delivery or Delivered) */}
        {(order.status === "Out for Delivery" || order.status === "Delivered") && (() => {
          const assignedRider =
            riders.find((r) => r.id === order.assigned_courier_id) ||
            riders.find((r) => r.name.toLowerCase() === (order.assigned_courier_name || "").toLowerCase()) ||
            riders.find((r) => r.city.toLowerCase() === order.province.toLowerCase()) ||
            riders[0];
          const riderPhone =
            order.courier_phone ||
            (assignedRider?.city === "Siem Reap"
              ? "+855 15 777 666"
              : assignedRider?.city === "Battambang"
              ? "+855 17 444 333"
              : "+855 12 999 888");

          if (!assignedRider) return null;

          return (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      Assigned Courier: Rider {assignedRider.name} ({assignedRider.id})
                    </span>
                    <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[9px] font-bold rounded">
                      Cassandra Telemetry
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 flex items-center space-x-1 mt-0.5">
                    <Radio className="w-3 h-3 text-blue-600 animate-pulse" />
                    <span>
                      Speed: {assignedRider.speed} • Battery: {assignedRider.battery}% • Hub: {assignedRider.city} ({assignedRider.lat}, {assignedRider.lng})
                    </span>
                  </p>
                </div>
              </div>
              <a
                href={`tel:${riderPhone.replace(/\s+/g, "")}`}
                className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center space-x-1 hover:bg-slate-50 transition-colors shadow-2xs self-end sm:self-auto cursor-pointer"
              >
                <Phone className="w-3 h-3 text-blue-600" />
                <span>Call Rider ({riderPhone})</span>
              </a>
            </div>
          );
        })()}

        {/* Delivery Destination & Settlement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1 text-xs">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Delivery Destination</span>
            </div>
            <p className="text-slate-600 mt-1">{order.delivery_address || `${order.province}, Cambodia`}</p>
            <p className="text-slate-900 font-semibold">Recipient: {order.customer_name}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1 text-xs">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Settlement Method</span>
            </div>
            <p className="text-slate-600 mt-1">{order.payment_method}</p>
            <p className="text-emerald-700 font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Payment Confirmed & Verified</span>
            </p>
          </div>
        </div>

        {/* Itemized breakdown */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Order Line Items ({order.items.length})
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

        <div className="pt-4 flex justify-between items-center border-t border-slate-100">
          <Link
            href="/orders"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Orders</span>
          </Link>

          <button
            onClick={() => setIsReceiptModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print Tax Receipt</span>
          </button>
        </div>
      </div>

      {/* Official Tax Invoice / Receipt Modal */}
      {isReceiptModalOpen && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          title="Official Tax Receipt & Invoice"
          maxWidth="max-w-2xl"
        >
          <div id="official-tax-receipt" className="space-y-6 text-slate-900 print:text-black print:p-6 print:bg-white print:block">
            {/* Invoice Top Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span className="font-black text-base text-slate-900 tracking-tight">
                    Rentify E-Commerce Co., Ltd.
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  VAT TIN: K009-902188439 • General Department of Taxation Compliant
                </p>
                <p className="text-[11px] text-slate-500">
                  Sangkat Boeung Keng Kang 1, Khan Boeng Keng Kang, Phnom Penh
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Official Tax Receipt
                </span>
                <p className="font-mono font-bold text-xs text-slate-900 mt-1.5">
                  TAX-INV-{order.order_id.replace("ORD-", "")}
                </p>
                <p className="text-[11px] text-slate-500">
                  Date: {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Customer & Order Metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Billed & Delivered To</p>
                <p className="font-bold text-slate-900 mt-1">{order.customer_name}</p>
                <p className="text-slate-600 text-[11px] mt-0.5">{order.delivery_address || `${order.province}, Cambodia`}</p>
                <p className="text-slate-500 text-[11px]">Province: {order.province}</p>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Payment & Settlement</p>
                <p className="font-bold text-slate-900 mt-1">{order.payment_method}</p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Status: PAID & CLEARED</p>
                <p className="text-slate-400 text-[10px] font-mono mt-0.5">TXN: KHQR-772819482</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((it, i) => (
                    <tr key={i}>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{it.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">SKU: {it.product_id}</span>
                      </td>
                      <td className="p-3 text-center font-mono">{it.quantity}</td>
                      <td className="p-3 text-right font-mono">{formatPrice(it.price)}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {formatPrice(it.price * it.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Calculation */}
            <div className="flex justify-between items-start text-xs pt-2">
              <div className="flex items-center space-x-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <QrCode className="w-10 h-10 text-emerald-700 shrink-0" />
                <div className="text-[10px] text-emerald-800">
                  <p className="font-bold">NBC Bakong Digital Seal</p>
                  <p className="text-slate-500 font-mono">Verify at: verify.rentify.kh/tax</p>
                </div>
              </div>

              <div className="w-56 space-y-1.5 text-right">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Courier Delivery:</span>
                  <span className="font-mono text-emerald-700 font-semibold">FREE ($0.00)</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>VAT (10% Included):</span>
                  <span className="font-mono font-semibold">{formatPrice(order.total * (0.1 / 1.1))}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                  <span>Grand Total:</span>
                  <span className="font-mono text-base">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200 print:hidden">
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
