"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import { useLocation, DeliveryProvince } from "@/context/LocationContext";
import { createOrder } from "@/lib/api";
import { INITIAL_CUSTOMER } from "@/lib/data";
import { KhqrPaymentModal } from "@/components/customer/KhqrPaymentModal";
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  Plus,
  ArrowLeft,
  Clock,
  Tag,
  X,
  Truck,
} from "lucide-react";

export default function CheckoutPage() {
  const checkoutAttempt = useRef<{ fingerprint: string; orderId: string } | null>(null);
  const router = useRouter();
  const {
    cart,
    cartTotalUSD,
    deliveryFeeUSD,
    discountUSD,
    discountPercent,
    promoCode,
    applyPromoCode,
    removePromoCode,
    finalTotalUSD,
    clearCart,
  } = useCart();
  const { formatPrice, currency } = useCurrency();
  const { showToast } = useToast();
  const { selectedProvince, setSelectedProvince } = useLocation();

  const [customer, setCustomer] = useState(INITIAL_CUSTOMER);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(() => {
    const idx = INITIAL_CUSTOMER.addresses.findIndex((a) => a.city === selectedProvince);
    return idx >= 0 ? idx : 0;
  });
  const [paymentMethod, setPaymentMethod] = useState<"khqr" | "cod" | "abapay">("khqr");
  const [isKhqrOpen, setIsKhqrOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");

  // Address form modal
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState<DeliveryProvince>(selectedProvince);

  const currentAddress = customer.addresses[selectedAddressIndex] || customer.addresses[0];

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newStreet) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      street: newStreet,
      city: newCity,
    };
    setCustomer((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddr],
    }));
    setSelectedAddressIndex(customer.addresses.length);
    setSelectedProvince(newCity);
    setIsAddingAddress(false);
    setNewLabel("");
    setNewStreet("");
    showToast("Address added to your profile", "success");
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    if (applyPromoCode(promoInput)) {
      setPromoInput("");
    }
  };

  const hasOutOfStockItems = cart.some(
    (item) => (item.product.stock ?? 0) <= 0 || item.quantity > (item.product.stock ?? 0)
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    const invalidItem = cart.find(
      (item) => (item.product.stock ?? 0) <= 0 || item.quantity > (item.product.stock ?? 0)
    );
    if (invalidItem) {
      const avail = Math.max(0, invalidItem.product.stock ?? 0);
      showToast(
        avail <= 0
          ? `${invalidItem.product.name} is out of stock. Please remove it from cart.`
          : `Only ${avail} unit(s) available for ${invalidItem.product.name}. Please adjust quantity.`,
        "error"
      );
      return;
    }

    if (paymentMethod === "khqr") {
      setIsKhqrOpen(true);
      return;
    }

    if (paymentMethod === "abapay") {
      await finalizeOrder("ABA Pay");
      return;
    }

    await finalizeOrder("Cash on Delivery (COD)");
  };

  const finalizeOrder = async (payMethodName: string) => {
    const invalidItem = cart.find(
      (item) => (item.product.stock ?? 0) <= 0 || item.quantity > (item.product.stock ?? 0)
    );
    if (invalidItem) {
      const avail = Math.max(0, invalidItem.product.stock ?? 0);
      showToast(
        avail <= 0
          ? `${invalidItem.product.name} is out of stock. Please remove it from cart.`
          : `Only ${avail} unit(s) available for ${invalidItem.product.name}.`,
        "error"
      );
      return;
    }

    setIsSubmitting(true);
    let orderId = checkoutAttempt.current?.orderId || `ORD-${crypto.randomUUID()}`;

    const orderPayload = {
      order_id: orderId,
      customer_id: customer._id,
      customer_name: customer.name,
      items: cart.map((i) => ({
        product_id: i.product.product_id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        category: i.product.category,
      })),
      total: Number(finalTotalUSD.toFixed(2)),
      province: currentAddress?.city || "Phnom Penh",
      payment_method: payMethodName,
      status: "Preparing",
      delivery_address: `${currentAddress?.street}, ${currentAddress?.city}`,
      promo_code: promoCode || undefined,
      discountUSD: discountUSD > 0 ? discountUSD : undefined,
    };

    const fingerprint = JSON.stringify({ ...orderPayload, order_id: undefined });
    if (checkoutAttempt.current && checkoutAttempt.current.fingerprint !== fingerprint) orderId = `ORD-${crypto.randomUUID()}`;
    checkoutAttempt.current = { fingerprint, orderId };
    orderPayload.order_id = orderId;
    const res = await createOrder(orderPayload);
    setIsSubmitting(false);

    if (res.success) {
      // Instant digital-twin synchronization webhook to logistics-sandbox
      fetch("/sandbox-api/integrations/ecommerce/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      }).catch(() =>
        fetch("http://localhost:8500/api/integrations/ecommerce/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        }).catch(() => {})
      );

      setOrderSuccessId(orderId);
      clearCart();
      showToast(`Order #${orderId} created successfully in MongoDB store!`, "success");
    } else {
      showToast(res.error || "Order creation rejected due to stock limit", "error");
    }
  };

  if (orderSuccessId) {
    return (
      <div className="max-w-2xl w-full mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Order Confirmation
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Thank You for Your Order!
          </h2>
          <p className="text-sm font-mono font-bold text-slate-900">Order Code: {orderSuccessId}</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your order has been recorded into the MongoDB operational store and queued for courier fulfillment.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs text-left text-xs space-y-2">
          <div className="flex justify-between text-slate-500">
            <span>Recipient:</span>
            <span className="font-bold text-slate-900">{customer.name}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Delivery Zone:</span>
            <span className="font-bold text-slate-900">{currentAddress?.city}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Payment Method:</span>
            <span className="font-bold text-slate-900">
              {paymentMethod === "khqr"
                ? "NBC Bakong KHQR"
                : paymentMethod === "abapay"
                ? "ABA Pay"
                : "Cash on Delivery (COD)"}
            </span>
          </div>
          {promoCode && (
            <div className="flex justify-between text-emerald-700">
              <span>Coupon Applied:</span>
              <span className="font-bold">{promoCode} (-{formatPrice(discountUSD)})</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
            <span>Settled Total:</span>
            <span className="font-mono">{formatPrice(finalTotalUSD)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={`/orders/${orderSuccessId}`}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Track Order Timeline</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-white" />
            <span>Watch in Sandbox Twin (Port 5173)</span>
          </a>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No items in cart</h2>
        <p className="text-xs text-slate-500">Add items to your cart before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-slate-900">Cart</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Step Fulfillment Options */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">1. Delivery Destination</h3>
                  <p className="text-xs text-slate-500">Select preferred shipping address</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Address Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {customer.addresses.map((addr, idx) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setSelectedAddressIndex(idx);
                    if (addr.city === "Phnom Penh" || addr.city === "Siem Reap" || addr.city === "Battambang") {
                      setSelectedProvince(addr.city as DeliveryProvince);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-1.5 ${
                    selectedAddressIndex === idx
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                      : "border-slate-200/80 bg-slate-50 hover:bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">{addr.label}</span>
                    {selectedAddressIndex === idx && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <p className="text-slate-500 leading-relaxed line-clamp-2">{addr.street}</p>
                  <p className="font-bold text-slate-900 text-[11px]">{addr.city}</p>
                </div>
              ))}
            </div>

            {/* Add Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Add Destination Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Address Label (e.g. Condo, Warehouse)"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    required
                    className="px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value as DeliveryProvince)}
                    className="px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  >
                    <option value="Phnom Penh">Phnom Penh</option>
                    <option value="Siem Reap">Siem Reap</option>
                    <option value="Battambang">Battambang</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Street and Sangkat description"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-3 py-1.5 text-xs text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">2. Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setPaymentMethod("khqr")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "khqr"
                    ? "border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20"
                    : "border-slate-200/80 bg-slate-50 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-rose-600">NBC Bakong KHQR</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                    Instant QR
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">ABA, Wing, ACLEDA, Sathapana instant dynamic scan</p>
              </div>

              <div
                onClick={() => setPaymentMethod("cod")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "cod"
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20"
                    : "border-slate-200/80 bg-slate-50 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Cash on Delivery</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-medium px-1.5 py-0.5 rounded">
                    Doorstep
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Pay upon courier arrival at doorstep</p>
              </div>

              <div
                onClick={() => setPaymentMethod("abapay")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "abapay"
                    ? "border-sky-600 bg-sky-50/50 ring-2 ring-sky-500/20"
                    : "border-slate-200/80 bg-slate-50 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-sky-700">ABA Pay</span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">
                    Instant Push
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">ABA Mobile instant push & deep-link checkout</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900">Order Review</h3>

          <div className="max-h-56 overflow-y-auto space-y-2 divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.product.product_id} className="pt-2 flex justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{item.product.name}</p>
                  <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Promo code bar on checkout */}
          {promoCode ? (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between font-semibold">
              <div className="flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Coupon: <strong>{promoCode}</strong> (-{formatPrice(discountUSD)})</span>
              </div>
              <button onClick={removePromoCode} className="p-1 hover:text-rose-600 transition-colors cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (VIP10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200/80 font-mono uppercase focus:outline-none focus:bg-white"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Apply
              </button>
            </form>
          )}

          <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-slate-900">{formatPrice(cartTotalUSD)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Express Courier Delivery</span>
              <span className="font-mono font-bold text-slate-900">
                {deliveryFeeUSD === 0 ? "FREE" : formatPrice(deliveryFeeUSD)}
              </span>
            </div>
            {discountUSD > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({promoCode})</span>
                <span className="font-mono font-bold">-{formatPrice(discountUSD)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Payable</span>
              <span className="font-mono">{formatPrice(finalTotalUSD)}</span>
            </div>
          </div>

          {hasOutOfStockItems && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
              Some items in your cart exceed available inventory. Please adjust quantities to proceed.
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || hasOutOfStockItems}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>
                  {hasOutOfStockItems
                    ? "Items Out of Stock"
                    : paymentMethod === "khqr"
                    ? `Open Bakong KHQR (${formatPrice(finalTotalUSD)})`
                    : paymentMethod === "abapay"
                    ? `Pay with ABA Pay (${formatPrice(finalTotalUSD)})`
                    : `Confirm & Place Order (${formatPrice(finalTotalUSD)})`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bakong KHQR Modal */}
      <KhqrPaymentModal
        isOpen={isKhqrOpen}
        onClose={() => setIsKhqrOpen(false)}
        amountUSD={finalTotalUSD}
        onPaymentSuccess={async () => {
          setIsKhqrOpen(false);
          await finalizeOrder("Bakong KHQR (NBC)");
        }}
      />
    </div>
  );
}
