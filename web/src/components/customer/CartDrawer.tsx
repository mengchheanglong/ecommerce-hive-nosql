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
    discountUSD,
    discountPercent,
    promoCode,
    applyPromoCode,
    removePromoCode,
    finalTotalUSD,
  } = useCart();
  const { formatPrice } = useCurrency();
  const [inputCode, setInputCode] = useState("");

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    if (applyPromoCode(inputCode)) {
      setInputCode("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-slate-200/80">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Shopping Cart</h3>
                <p className="text-[11px] text-slate-500 font-medium">{cartCount} items selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Progress Bar */}
          {cart.length > 0 && (
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">
                  {cartTotalUSD < 30 ? (
                    <>Add <strong className="text-emerald-700 font-mono">{formatPrice(30 - cartTotalUSD)}</strong> for Free Delivery</>
                  ) : (
                    <span className="text-emerald-700 font-bold">🎉 FREE Delivery Unlocked!</span>
                  )}
                </span>
                <span className="font-mono text-slate-400 font-bold">
                  {Math.min(100, Math.round((cartTotalUSD / 30) * 100))}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartTotalUSD / 30) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-500 py-16">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Your cart is empty</h4>
                  <p className="text-xs text-slate-500 mt-1">Explore our catalog to add fresh goods & electronics.</p>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.product_id}
                  className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-all shadow-2xs space-x-3 group"
                >
                  {/* Thumbnail Image */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 relative">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {item.product.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.product.name}</h4>
                    <p className="text-xs font-mono font-bold text-emerald-700 mt-1">
                      {formatPrice(item.product.price)} each
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
                      <button
                        onClick={() => updateQuantity(item.product.product_id, item.quantity - 1)}
                        className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-200 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.product_id, item.quantity + 1)}
                        className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-200 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.product_id)}
                      className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center space-x-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50/60 space-y-4">
              {/* Promo code */}
              {promoCode ? (
                <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 flex justify-between items-center">
                  <span>Coupon {promoCode} ({discountPercent > 0 ? `${discountPercent}% off` : "Free Shipping"})</span>
                  <button
                    onClick={removePromoCode}
                    className="p-1 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
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
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200/80 text-slate-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-slate-900">{formatPrice(cartTotalUSD)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
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
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200/80">
                  <span>Estimated Total</span>
                  <span className="font-mono text-base font-extrabold">{formatPrice(finalTotalUSD)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="py-2.5 rounded-xl border border-slate-200/80 bg-white text-slate-800 text-xs font-semibold text-center hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold text-center flex items-center justify-center space-x-1.5 shadow-xs transition-all active:scale-95"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
