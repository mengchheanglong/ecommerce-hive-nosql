"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
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
} from "lucide-react";

export default function CheckoutPage() {
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

  const [customer, setCustomer] = useState(INITIAL_CUSTOMER);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"khqr" | "cod" | "card">("khqr");
  const [isKhqrOpen, setIsKhqrOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");

  // Address form modal
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("Phnom Penh");

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

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    if (paymentMethod === "khqr") {
      setIsKhqrOpen(true);
      return;
    }

    await finalizeOrder("Cash on Delivery (COD)");
  };

  const finalizeOrder = async (payMethodName: string) => {
    setIsSubmitting(true);
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

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
      total: finalTotalUSD,
      province: currentAddress?.city || "Phnom Penh",
      payment_method: payMethodName,
      status: "Preparing",
      delivery_address: `${currentAddress?.street}, ${currentAddress?.city}`,
      promo_code: promoCode || undefined,
      discountUSD: discountUSD > 0 ? discountUSD : undefined,
    };

    const res = await createOrder(orderPayload);
    setIsSubmitting(false);

    if (res.success) {
      setOrderSuccessId(orderId);
      clearCart();
      showToast(`Order #${orderId} created successfully in MongoDB store!`, "success");
    } else {
      showToast("Order creation encountered an issue", "error");
    }
  };

  if (orderSuccessId) {
    return (
      <div className="max-w-2xl w-full mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#eafaf4] text-[#0c835c] flex items-center justify-center mx-auto border border-[#9cf0ce] shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-[#15c089]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0c835c]">
            Order Confirmation
          </span>
          <h2 className="text-3xl font-black text-[#013326] tracking-tight">
            Thank You for Your Order!
          </h2>
          <p className="text-sm font-mono font-bold text-[#013326]">Order Code: {orderSuccessId}</p>
          <p className="text-xs text-[#5c7167] max-w-md mx-auto">
            Your order has been recorded into the MongoDB operational store and queued for courier fulfillment.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#e2eae5] shadow-card text-left text-xs space-y-2">
          <div className="flex justify-between text-[#5c7167]">
            <span>Recipient:</span>
            <span className="font-bold text-[#013326]">{customer.name}</span>
          </div>
          <div className="flex justify-between text-[#5c7167]">
            <span>Delivery Zone:</span>
            <span className="font-bold text-[#013326]">{currentAddress?.city}</span>
          </div>
          <div className="flex justify-between text-[#5c7167]">
            <span>Payment Method:</span>
            <span className="font-bold text-[#013326]">
              {paymentMethod === "khqr" ? "NBC Bakong KHQR" : "Cash on Delivery"}
            </span>
          </div>
          {promoCode && (
            <div className="flex justify-between text-[#0c835c]">
              <span>Coupon Applied:</span>
              <span className="font-bold">{promoCode} (-{formatPrice(discountUSD)})</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-[#013326] pt-2 border-t border-[#e2eae5]">
            <span>Settled Total:</span>
            <span className="font-mono">{formatPrice(finalTotalUSD)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={`/orders/${orderSuccessId}`}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Track Order Timeline</span>
            <ArrowRight className="w-4 h-4 text-[#15c089]" />
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-[#e2eae5] text-xs font-bold text-[#5c7167] hover:bg-[#f1f6f3] transition-colors"
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
        <h2 className="text-xl font-bold text-[#013326]">No items in cart</h2>
        <p className="text-xs text-[#5c7167]">Add items to your cart before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#013326] text-white text-xs font-bold"
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
      <div className="flex items-center space-x-2 text-xs text-[#5c7167]">
        <Link href="/" className="hover:text-[#013326]">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-[#013326]">Cart</Link>
        <span>/</span>
        <span className="text-[#013326] font-bold">Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Step Fulfillment Options */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e2eae5] shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#013326] text-white flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#15c089]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#013326]">1. Delivery Destination</h3>
                  <p className="text-xs text-[#5c7167]">Select preferred shipping address</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-xs font-bold text-[#0c835c] hover:underline flex items-center space-x-1 cursor-pointer"
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
                  onClick={() => setSelectedAddressIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-1.5 ${
                    selectedAddressIndex === idx
                      ? "border-[#013326] bg-[#eafaf4]/30 ring-2 ring-[#15c089]/30"
                      : "border-[#e2eae5] bg-[#fafcfb] hover:bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-[#013326]">{addr.label}</span>
                    {selectedAddressIndex === idx && (
                      <span className="w-2 h-2 rounded-full bg-[#15c089]" />
                    )}
                  </div>
                  <p className="text-[#5c7167] leading-relaxed line-clamp-2">{addr.street}</p>
                  <p className="font-bold text-[#013326] text-[11px]">{addr.city}</p>
                </div>
              ))}
            </div>

            {/* Add Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-[#f6faf8] border border-[#e2eae5] space-y-3">
                <h4 className="text-xs font-bold text-[#013326]">Add Destination Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Address Label (e.g. Condo, Warehouse)"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    required
                    className="px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eae5]"
                  />
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eae5]"
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
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eae5]"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-3 py-1.5 text-xs text-[#5c7167]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#013326] text-white text-xs font-bold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e2eae5] shadow-card space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#013326] text-white flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-[#15c089]" />
              </div>
              <h3 className="text-base font-extrabold text-[#013326]">2. Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setPaymentMethod("khqr")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "khqr"
                    ? "border-[#e02020] bg-rose-50/40 ring-2 ring-rose-500/20"
                    : "border-[#e2eae5] bg-[#fafcfb] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-[#e02020]">Bakong KHQR</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                    Instant
                  </span>
                </div>
                <p className="text-[11px] text-[#5c7167]">ABA, Wing, ACLEDA, Sathapana instant scan</p>
              </div>

              <div
                onClick={() => setPaymentMethod("cod")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "cod"
                    ? "border-[#013326] bg-[#eafaf4]/30 ring-2 ring-[#15c089]/30"
                    : "border-[#e2eae5] bg-[#fafcfb] hover:bg-white"
                }`}
              >
                <span className="text-xs font-bold text-[#013326] block mb-1">Cash on Delivery (COD)</span>
                <p className="text-[11px] text-[#5c7167]">Pay upon courier arrival at doorstep</p>
              </div>

              <div
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-[#013326] bg-[#eafaf4]/30 ring-2 ring-[#15c089]/30"
                    : "border-[#e2eae5] bg-[#fafcfb] hover:bg-white"
                }`}
              >
                <span className="text-xs font-bold text-[#013326] block mb-1">Credit / Debit Card</span>
                <p className="text-[11px] text-[#5c7167]">Visa, Mastercard, UnionPay gateway</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#e2eae5] shadow-card space-y-6">
          <h3 className="text-base font-extrabold text-[#013326]">Order Review</h3>

          <div className="max-h-56 overflow-y-auto space-y-2 divide-y divide-[#f1f6f3]">
            {cart.map((item) => (
              <div key={item.product.product_id} className="pt-2 flex justify-between text-xs">
                <div>
                  <p className="font-bold text-[#013326]">{item.product.name}</p>
                  <p className="text-[11px] text-[#5c7167]">Qty: {item.quantity}</p>
                </div>
                <span className="font-mono font-bold text-[#013326]">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Promo code bar on checkout */}
          {promoCode ? (
            <div className="p-3 bg-[#eafaf4] rounded-2xl border border-[#9cf0ce] text-xs text-[#0c835c] flex items-center justify-between font-semibold">
              <div className="flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-[#15c089]" />
                <span>Coupon: <strong>{promoCode}</strong> (-{formatPrice(discountUSD)})</span>
              </div>
              <button onClick={removePromoCode} className="p-1 hover:text-rose-600 transition-colors">
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
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] font-mono uppercase focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#013326] text-white text-xs font-bold rounded-xl hover:bg-[#0a4636]"
              >
                Apply
              </button>
            </form>
          )}

          <div className="space-y-2 text-xs pt-3 border-t border-[#e2eae5]">
            <div className="flex justify-between text-[#5c7167]">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-[#013326]">{formatPrice(cartTotalUSD)}</span>
            </div>
            <div className="flex justify-between text-[#5c7167]">
              <span>Express Courier Delivery</span>
              <span className="font-mono font-bold text-[#013326]">
                {deliveryFeeUSD === 0 ? "FREE" : formatPrice(deliveryFeeUSD)}
              </span>
            </div>
            {discountUSD > 0 && (
              <div className="flex justify-between text-[#0c835c]">
                <span>Discount ({promoCode})</span>
                <span className="font-mono font-bold">-{formatPrice(discountUSD)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-[#013326] pt-2 border-t border-[#e2eae5]">
              <span>Total Payable</span>
              <span className="font-mono">{formatPrice(finalTotalUSD)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#15c089]" />
                <span>
                  {paymentMethod === "khqr"
                    ? `Open Bakong KHQR (${formatPrice(finalTotalUSD)})`
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
