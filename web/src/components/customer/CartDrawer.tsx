"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ShoppingBag, X, Plus, Minus, ArrowRight, Trash2, Tag, ShieldCheck } from "lucide-react";

export function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    cartTotalUSD,
    cartCount,
    deliveryFeeUSD,
    finalTotalUSD,
  } = useCart();
  const { formatPrice, currency } = useCurrency();
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  if (!isCartDrawerOpen) return null;

  const discountAmount = discountApplied ? cartTotalUSD * 0.1 : 0;
  const netTotal = Math.max(0, finalTotalUSD - discountAmount);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "VIP10") {
      setDiscountApplied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-[#e2eae5]">
          {/* Header */}
          <div className="p-5 border-b border-[#e2eae5] flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#013326] flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4 text-[#15c089]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#013326]">Shopping Cart</h3>
                <p className="text-[11px] text-[#5c7167] font-medium">{cartCount} items selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-xl text-[#5c7167] hover:bg-[#f1f6f3] hover:text-[#013326] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-[#5c7167] py-16">
                <div className="w-16 h-16 rounded-full bg-[#f1f6f3] flex items-center justify-center text-[#cad6cf]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#013326]">Your cart is empty</h4>
                  <p className="text-xs text-[#5c7167] mt-1">Explore our catalog to add fresh goods & electronics.</p>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#013326] text-white text-xs font-bold hover:bg-[#0a4636] transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.product_id}
                  className="flex items-start justify-between p-3.5 rounded-2xl border border-[#e2eae5] bg-[#fafcfb] hover:bg-white transition-all shadow-xs space-x-3"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#5c7167] uppercase tracking-wider block">
                      {item.product.category}
                    </span>
                    <h4 className="text-xs font-bold text-[#013326] truncate mt-0.5">{item.product.name}</h4>
                    <p className="text-xs font-mono font-bold text-[#0c835c] mt-1">
                      {formatPrice(item.product.price)} each
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    <div className="flex items-center space-x-1.5 bg-[#f1f6f3] p-1 rounded-xl border border-[#e2eae5]">
                      <button
                        onClick={() => updateQuantity(item.product.product_id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#013326] shadow-xs hover:bg-[#e2eae5]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#013326]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.product_id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#013326] shadow-xs hover:bg-[#e2eae5]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.product_id)}
                      className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center space-x-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#e2eae5] bg-[#fafcfb] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={applyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#5c7167] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Promo code (try VIP10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white border border-[#e2eae5] text-[#013326] uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#013326] text-white text-xs font-bold hover:bg-[#0a4636] transition-colors"
                >
                  Apply
                </button>
              </form>

              {discountApplied && (
                <div className="text-[11px] font-semibold text-[#0c835c] bg-[#eafaf4] px-3 py-1.5 rounded-xl border border-[#9cf0ce] flex justify-between">
                  <span>VIP 10% Discount Applied!</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#5c7167]">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-[#013326]">{formatPrice(cartTotalUSD)}</span>
                </div>
                <div className="flex justify-between text-[#5c7167]">
                  <span>Delivery Fee</span>
                  <span className="font-mono font-bold text-[#013326]">
                    {deliveryFeeUSD === 0 ? "FREE (Orders > $40)" : formatPrice(deliveryFeeUSD)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#013326] pt-2 border-t border-[#e2eae5]">
                  <span>Estimated Total</span>
                  <span className="font-mono">{formatPrice(netTotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="py-3 rounded-xl border border-[#013326] text-[#013326] text-xs font-bold text-center hover:bg-[#f1f6f3] transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="py-3 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold text-center flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#15c089]" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
