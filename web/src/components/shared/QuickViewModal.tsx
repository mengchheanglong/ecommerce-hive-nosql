"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { Modal } from "./Modal";
import { Plus, Minus, ShoppingBag, ShieldCheck, Star, Check } from "lucide-react";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [qty, setQty] = useState(1);
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, qty);
    setQty(1);
    onClose();
  };

  return (
    <Modal isOpen={!!product} onClose={onClose} title={product.name} maxWidth="max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-1">
        {/* Left Column: Product Image Showcase */}
        <div className="sm:col-span-5 flex flex-col space-y-3">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-12 h-12" />
              </div>
            )}
            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-slate-800 border border-white/60 shadow-2xs">
              {product.category}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs px-1 text-slate-500 font-mono">
            <span>SKU: {product.product_id}</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              In Stock
            </span>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs font-semibold text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating || 4.8}</span>
                <span className="text-[11px] text-amber-700 font-normal">
                  ({product.reviews_count || 45} reviews)
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {product.stock ?? 25} units available
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description ||
                "Authentic marketplace item fulfilled with verified distributor inspection and rapid courier dispatch."}
            </p>

            {/* Dynamic Polymorphic Document Attributes */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
              <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider block mb-1">
                Polymorphic Specifications
              </span>

              {product.screen_size && (
                <div className="flex justify-between py-0.5 border-b border-slate-200/60 text-slate-600">
                  <span>Display Size</span>
                  <span className="font-semibold text-slate-900">{product.screen_size}</span>
                </div>
              )}
              {product.warranty && (
                <div className="flex justify-between py-0.5 border-b border-slate-200/60 text-slate-600">
                  <span>Warranty</span>
                  <span className="font-semibold text-slate-900">{product.warranty}</span>
                </div>
              )}
              {product.size && (
                <div className="flex justify-between py-0.5 border-b border-slate-200/60 text-slate-600">
                  <span>Garment Size</span>
                  <span className="font-semibold text-slate-900">{product.size}</span>
                </div>
              )}
              {product.colours && product.colours.length > 0 && (
                <div className="flex justify-between py-0.5 border-b border-slate-200/60 text-slate-600">
                  <span>Colours</span>
                  <span className="font-semibold text-slate-900">{product.colours.join(", ")}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between py-0.5 border-b border-slate-200/60 text-slate-600">
                  <span>Net Weight</span>
                  <span className="font-semibold text-slate-900">{product.weight}</span>
                </div>
              )}
              {product.expiry_date && (
                <div className="flex justify-between py-0.5 border-b border-slate-200/60 text-slate-600">
                  <span>Expiry Date</span>
                  <span className="font-semibold text-slate-900">{product.expiry_date}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Add to Cart Controls */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Price</p>
              <p className="text-xl font-bold font-mono text-slate-900">
                {formatPrice(product.price * qty)}
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-slate-900">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center space-x-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
