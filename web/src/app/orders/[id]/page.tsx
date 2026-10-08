"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { OrderRecord, RiderTelemetry } from "@/types";
import { fetchOrderById, fetchRiders, updateOrderStatus } from "@/lib/api";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { OrderTimeline } from "@/components/customer/OrderTimeline";
import { LiveOrderTrackingMap } from "@/components/customer/LiveOrderTrackingMap";
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
  RotateCcw,
  XCircle,
  ShieldAlert,
  ShoppingBag,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [riders, setRiders] = useState<RiderTelemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const [cancelReason, setCancelReason] = useState("Found better price / alternative");
  const [cancelNotes, setCancelNotes] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const [returnReason, setReturnReason] = useState("Damaged or defective on arrival");
  const [returnNotes, setReturnNotes] = useState("");
  const [refundSettlement, setRefundSettlement] = useState("Bakong KHQR (Original Account)");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  const { formatPrice } = useCurrency();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { showToast } = useToast();

  const handleBuyAgain = () => {
    if (!order || !order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      addToCart(
        {
          product_id: item.product_id,
          name: item.name,
          category: item.category || "General",
          price: item.price,
          status: "active",
        },
        item.quantity
      );
    });
    showToast(`Added ${order.items.length} item(s) from Order #${order.order_id} to cart!`, "success");
    setIsCartDrawerOpen(true);
  };

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setIsCancelling(true);
    const res = await updateOrderStatus(order.order_id, "Cancelled", true);
    setIsCancelling(false);
    if (res.success) {
      setOrder((prev) => (prev ? { ...prev, status: "Cancelled", cancellation_reason: cancelReason } : prev));
      setIsCancelModalOpen(false);
      showToast(`Order #${order.order_id} has been cancelled. Refund initiated to Bakong.`, "info");
    } else {
      showToast(res.error || "Failed to cancel order", "error");
    }
  };

  const handleConfirmReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setIsSubmittingReturn(true);
    const res = await updateOrderStatus(order.order_id, "Return Requested", true);
    setIsSubmittingReturn(false);
    if (res.success) {
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: "Return Requested",
              return_reason: returnReason,
              return_status: "Pending",
            }
          : prev
      );
      setIsReturnModalOpen(false);
      showToast(`Return request submitted for Order #${order.order_id}. Review within 24h.`, "success");
    } else {
      showToast(res.error || "Failed to submit return request", "error");
    }
  };

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

        <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
          {/* Buy Again Button */}
          <button
            onClick={handleBuyAgain}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Buy Again</span>
          </button>

          {/* Cancel Order Button (if Pending or Preparing) */}
          {(order.status === "Pending" || order.status === "Preparing") && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border border-rose-200"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          )}

          {/* Return / Refund Button (if Delivered and not already requested) */}
          {order.status === "Delivered" && order.return_status !== "Pending" && (
            <button
              onClick={() => setIsReturnModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border border-amber-200"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Request Return / Refund</span>
            </button>
          )}

          <button
            onClick={() => setIsReceiptModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border border-slate-200"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>View Tax Receipt</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
        {/* Cancellation Notice Banner */}
        {order.status === "Cancelled" && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-extrabold text-rose-900 block text-sm">Order Cancelled</span>
              <p className="text-rose-700">
                Reason: <strong>{order.cancellation_reason || "Customer request"}</strong>. Refund settlement of{" "}
                <strong>{formatPrice(order.total)}</strong> has been processed to your payment account.
              </p>
            </div>
          </div>
        )}

        {/* Return Requested Notice Banner */}
        {(order.status === "Return Requested" || order.return_status === "Pending") && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-extrabold text-amber-900 block text-sm">Return & Refund Request Under Review</span>
              <p className="text-amber-800">
                Our merchant support team is reviewing your claim under Rentify's 7-Day Guarantee. A courier pickup or direct refund will be confirmed within 24 hours.
              </p>
            </div>
          </div>
        )}

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
                      : order.status === "Cancelled"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
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

        {/* Live Interactive Digital-Twin Map & Real-Time Telemetry */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Digital-Twin Route & Fleet Telemetry
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Cassandra Stream Active
            </span>
          </div>
          <LiveOrderTrackingMap order={order} riders={riders} />
        </div>

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
            Order Line Items ({(order.items || []).length})
          </h3>
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
            {(order.items || []).map((it, idx) => (
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

        <div className="pt-4 flex justify-between items-center border-t border-slate-100 flex-wrap gap-3">
          <Link
            href="/orders"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Orders</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleBuyAgain}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Buy Again</span>
            </button>

            <button
              onClick={() => setIsReceiptModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print Tax Receipt</span>
            </button>
          </div>
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
                  {(order.items || []).map((it, i) => (
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

      {/* Self-Service Order Cancellation Modal */}
      {isCancelModalOpen && (
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title={`Cancel Order #${order.order_id}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmCancel} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Are you sure you want to cancel?</span>
                <p className="text-[11px] text-rose-700">
                  Once cancelled, line items will be returned to merchant inventory, and a full refund of {formatPrice(order.total)} will be released.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Please select a reason for cancellation:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
              >
                <option value="Found better price / alternative">Found better price / alternative</option>
                <option value="Ordered by mistake / duplicate order">Ordered by mistake / duplicate order</option>
                <option value="Need to change delivery address">Need to change delivery address</option>
                <option value="Estimated delivery time too long">Estimated delivery time too long</option>
                <option value="Payment / billing method change">Payment / billing method change</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Additional notes (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="Provide any feedback for the merchant..."
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="submit"
                disabled={isCancelling}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>{isCancelling ? "Cancelling..." : "Confirm Cancellation"}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Return & Refund Request Modal */}
      {isReturnModalOpen && (
        <Modal
          isOpen={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
          title={`Request Return / Refund for #${order.order_id}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleConfirmReturn} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Rentify 7-Day Buyer Protection</span>
                <p className="text-[11px] text-amber-800">
                  All purchases are eligible for hassle-free returns within 7 calendar days of delivery. Items must be in original condition with tags and packaging.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Reason for Return:
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="Damaged or defective on arrival">Damaged or defective on arrival</option>
                <option value="Item does not match website description">Item does not match website description</option>
                <option value="Wrong item or variant delivered">Wrong item or variant delivered</option>
                <option value="Missing parts or accessories">Missing parts or accessories</option>
                <option value="Quality not as expected">Quality not as expected</option>
                <option value="Changed mind / No longer needed">Changed mind / No longer needed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Preferred Refund Method:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRefundSettlement("Bakong KHQR (Original Account)")}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                    refundSettlement === "Bakong KHQR (Original Account)"
                      ? "border-blue-600 bg-blue-50/60 text-blue-900"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="block font-bold">NBC Bakong KHQR</span>
                  <span className="text-[10px] text-slate-500">Refund to original bank account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRefundSettlement("Rentify Wallet Loyalty Credit")}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                    refundSettlement === "Rentify Wallet Loyalty Credit"
                      ? "border-blue-600 bg-blue-50/60 text-blue-900"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="block font-bold">Wallet Credit</span>
                  <span className="text-[10px] text-slate-500">Instant credit + 5% bonus</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Issue Description & Photo Evidence:
              </label>
              <textarea
                rows={3}
                placeholder="Describe what went wrong or details about the item's condition..."
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsReturnModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingReturn}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isSubmittingReturn ? "Submitting..." : "Submit Return Claim"}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
