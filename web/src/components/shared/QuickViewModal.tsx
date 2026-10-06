"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { Modal } from "./Modal";
import { Plus, Minus, ShoppingBag, ShieldCheck, Star } from "lucide-react";

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
    <Modal isOpen={!!product} onClose={onClose} title={product.name} maxWidth="max-w-xl">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#f1f6f3] text-[#013326]">
              {product.category}
            </span>
            <span className="text-xs text-[#5c7167] font-mono">SKU: {product.product_id}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating || 4.8}</span>
            <span className="text-[10px] text-amber-500 font-normal">({product.reviews_count || 45} reviews)</span>
          </div>
        </div>

        <p className="text-xs text-[#5c7167] leading-relaxed">
          {product.description || "Authentic marketplace item fulfilled with verified distributor inspection and rapid courier dispatch."}
        </p>

        {/* Dynamic Polymorphic Document Attributes */}
        <div className="bg-[#f6faf8] p-4 rounded-2xl border border-[#e2eae5] space-y-2 text-xs">
          <span className="font-extrabold text-[#013326] text-[11px] uppercase tracking-wider block mb-1">
            MongoDB Schema Specification
          </span>

          {product.screen_size && (
            <div className="flex justify-between py-1 border-b border-[#e2eae5]/60">
              <span className="text-[#5c7167]">Display Size</span>
              <span className="font-bold text-[#013326]">{product.screen_size}</span>
            </div>
          )}
          {product.warranty && (
            <div className="flex justify-between py-1 border-b border-[#e2eae5]/60">
              <span className="text-[#5c7167]">Warranty</span>
              <span className="font-bold text-[#013326]">{product.warranty}</span>
            </div>
          )}
          {product.size && (
            <div className="flex justify-between py-1 border-b border-[#e2eae5]/60">
              <span className="text-[#5c7167]">Garment Size</span>
              <span className="font-bold text-[#013326]">{product.size}</span>
            </div>
          )}
          {product.colours && product.colours.length > 0 && (
            <div className="flex justify-between py-1 border-b border-[#e2eae5]/60">
              <span className="text-[#5c7167]">Colours</span>
              <span className="font-bold text-[#013326]">{product.colours.join(", ")}</span>
            </div>
          )}
          {product.weight && (
            <div className="flex justify-between py-1 border-b border-[#e2eae5]/60">
              <span className="text-[#5c7167]">Net Weight</span>
              <span className="font-bold text-[#013326]">{product.weight}</span>
            </div>
          )}
          {product.expiry_date && (
            <div className="flex justify-between py-1 border-b border-[#e2eae5]/60">
              <span className="text-[#5c7167]">Expiry Date</span>
              <span className="font-bold text-[#013326]">{product.expiry_date}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-[#5c7167]">Inventory In Stock</span>
            <span className="font-bold text-[#0c835c]">{product.stock ?? 25} units available</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#f1f6f3] flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#5c7167] font-medium">Unit Price</p>
            <p className="text-xl font-black text-[#013326]">{formatPrice(product.price * qty)}</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-[#f1f6f3] p-1 rounded-xl border border-[#e2eae5]">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#013326] shadow-xs hover:bg-[#e2eae5] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-bold text-[#013326]">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#013326] shadow-xs hover:bg-[#e2eae5] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-5 py-2.5 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#15c089]" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
