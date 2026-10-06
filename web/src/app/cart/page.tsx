"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight, ArrowLeft, ShieldCheck, X, Truck, Sparkles, CheckCircle2 } from "lucide-react";

export default function FullCartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotalUSD,
    cartCount,
    deliveryFeeUSD,
    discountUSD,
    discountPercent,
    promoCode,
    applyPromoCode,
    removePromoCode,
    finalTotalUSD,
  } = useCart();
  const { formatPrice, currency, exchangeRate } = useCurrency();
  const [inputCode, setInputCode] = useState("");

  const FREE_SHIPPING_THRESHOLD = 30;
  const shippingProgress = Math.min(100, Math.round((cartTotalUSD / FREE_SHIPPING_THRESHOLD) * 100));
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotalUSD);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    if (applyPromoCode(inputCode)) {
      setInputCode("");
    }
  };

  const netTotalKHR = Math.round(finalTotalUSD * exchangeRate);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your shopping bag is empty</h2>
        <p className="text-xs text-slate-500">You haven't added any products to your cart yet.</p>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-4 h-4 text-blue-400" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-slate-500">Review your selected items ({cartCount} total units)</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      {/* Free Delivery Progress Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 font-bold text-slate-800">
            <Truck className="w-4 h-4 text-blue-600" />
            {amountToFreeShipping > 0 ? (
              <span>
                Add <strong className="text-blue-700 font-mono">{formatPrice(amountToFreeShipping)}</strong> more to unlock <strong className="text-slate-900">FREE Express Delivery</strong>!
              </span>
            ) : (
              <span className="text-blue-700 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Congratulations! You qualified for FREE Express Courier Delivery!</span>
              </span>
            )}
          </div>
          <span className="font-mono font-bold text-xs text-slate-500">{shippingProgress}%</span>
        </div>

        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              amountToFreeShipping === 0 ? "bg-blue-600" : "bg-gradient-to-r from-blue-400 to-indigo-600"
            }`}
            style={{ width: `${shippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {cart.map((item) => (
              <div
                key={item.product.product_id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center space-x-4">
                  {/* Thumbnail Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 relative">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {item.product.category}
                    </span>
                    <Link
                      href={`/shop/${item.product.product_id}`}
                      className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors block"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-5">
                  {/* Quantity Stepper */}
                  <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                    <button
                      onClick={() => updateQuantity(item.product.product_id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-200 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.product_id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-200 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-mono font-bold text-slate-900 w-20 text-right">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.product_id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900">Order Summary</h3>

          {/* Promo code */}
          {promoCode ? (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs text-emerald-800 flex items-center justify-between font-semibold">
              <div className="flex items-center space-x-2">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Code <strong>{promoCode}</strong> applied ({discountPercent > 0 ? `${discountPercent}% off` : "Free Shipping"})</span>
              </div>
              <button
                onClick={removePromoCode}
                className="p-1 hover:text-rose-600 transition-colors cursor-pointer"
                title="Remove promo code"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Promo code (VIP10 / KHMER2026)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200/80 text-slate-900 font-mono uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
          )}

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Cart Subtotal</span>
              <span className="font-mono font-bold text-slate-900">{formatPrice(cartTotalUSD)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Courier Delivery</span>
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
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Amount</span>
              <div className="text-right">
                <span className="text-xl font-extrabold text-slate-900 font-mono block">
                  {formatPrice(finalTotalUSD)}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  (~៛{netTotalKHR.toLocaleString()} KHR)
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/shop"
            className="w-full py-2 rounded-xl text-center text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
