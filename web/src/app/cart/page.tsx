"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight, ArrowLeft, ShieldCheck, X } from "lucide-react";

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
        <div className="w-20 h-20 rounded-full bg-[#f1f6f3] flex items-center justify-center mx-auto text-[#cad6cf]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-[#013326]">Your shopping bag is empty</h2>
        <p className="text-xs text-[#5c7167]">You haven't added any products to your cart yet.</p>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#013326] text-white text-xs font-bold hover:bg-[#0a4636] transition-all"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-4 h-4 text-[#15c089]" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#e2eae5] pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#013326]">Shopping Cart</h1>
          <p className="text-xs text-[#5c7167]">Review your selected items ({cartCount} total units)</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#e2eae5] shadow-card overflow-hidden">
          <div className="divide-y divide-[#f1f6f3]">
            {cart.map((item) => (
              <div
                key={item.product.product_id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#f1f6f3] flex items-center justify-center shrink-0 text-[#013326]">
                    <ShoppingBag className="w-6 h-6 text-[#15c089]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#5c7167] uppercase tracking-wider">
                      {item.product.category}
                    </span>
                    <Link
                      href={`/shop/${item.product.product_id}`}
                      className="text-sm font-extrabold text-[#013326] hover:text-[#0c835c] transition-colors block"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs font-mono font-bold text-[#0c835c] mt-0.5">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                  {/* Quantity Stepper */}
                  <div className="flex items-center space-x-2 bg-[#f1f6f3] p-1.5 rounded-2xl border border-[#e2eae5]">
                    <button
                      onClick={() => updateQuantity(item.product.product_id, item.quantity - 1)}
                      className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#013326] shadow-2xs hover:bg-[#e2eae5] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#013326]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.product_id, item.quantity + 1)}
                      className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[#013326] shadow-2xs hover:bg-[#e2eae5] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-mono font-black text-[#013326] w-20 text-right">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.product_id)}
                    className="p-2 text-[#5c7167] hover:text-rose-600 transition-colors cursor-pointer"
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
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#e2eae5] shadow-card space-y-6">
          <h3 className="text-base font-extrabold text-[#013326]">Order Summary</h3>

          {/* Promo code */}
          {promoCode ? (
            <div className="p-3 bg-[#eafaf4] rounded-2xl border border-[#9cf0ce] text-xs text-[#0c835c] flex items-center justify-between font-semibold">
              <div className="flex items-center space-x-2">
                <Tag className="w-3.5 h-3.5 text-[#15c089]" />
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
                <Tag className="w-3.5 h-3.5 text-[#5c7167] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Promo code (VIP10 / KHMER2026)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326] font-mono uppercase focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#013326] text-white text-xs font-bold hover:bg-[#0a4636] transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
          )}

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#5c7167]">
              <span>Cart Subtotal</span>
              <span className="font-mono font-bold text-[#013326]">{formatPrice(cartTotalUSD)}</span>
            </div>
            <div className="flex justify-between text-[#5c7167]">
              <span>Courier Delivery</span>
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
            <div className="pt-3 border-t border-[#e2eae5] flex justify-between items-baseline">
              <span className="text-sm font-black text-[#013326]">Total Amount</span>
              <div className="text-right">
                <span className="text-xl font-black text-[#013326] font-mono block">
                  {formatPrice(finalTotalUSD)}
                </span>
                <span className="text-[11px] text-[#5c7167]">
                  (~៛{netTotalKHR.toLocaleString()} KHR)
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 rounded-2xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 text-[#15c089]" />
          </Link>

          <Link
            href="/shop"
            className="w-full py-2.5 rounded-xl text-center text-xs text-[#5c7167] hover:text-[#013326] font-semibold flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
