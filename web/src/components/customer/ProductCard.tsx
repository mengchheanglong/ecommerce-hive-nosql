"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { Plus, Eye, Check, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-3xl border border-[#e2eae5] shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div className="p-5 pb-3">
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#f1f6f3] text-[#013326] border border-[#e2eae5]">
            {product.category}
          </span>
          <span className="flex items-center space-x-1 text-[11px] font-semibold text-[#0c835c] bg-[#eafaf4] px-2 py-0.5 rounded-full border border-[#9cf0ce]">
            <Check className="w-3 h-3" />
            <span>In Stock</span>
          </span>
        </div>

        {/* Title & Link to PDP */}
        <Link href={`/shop/${product.product_id}`} className="block">
          <h3 className="text-sm sm:text-base font-extrabold text-[#013326] group-hover:text-[#0c835c] transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-[11px] text-[#5c7167] mt-1 font-mono">SKU: {product.product_id}</p>

        {/* Rating preview */}
        <div className="flex items-center space-x-1 mt-2 text-xs text-amber-500 font-bold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{product.rating ?? 4.8}</span>
          <span className="text-[10px] text-[#5c7167] font-normal">({product.reviews_count ?? 30})</span>
        </div>

        {/* Polymorphic Attributes */}
        <div className="mt-3 pt-3 border-t border-[#f1f6f3] space-y-1">
          {product.category === "Electronics" && (
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {product.screen_size && (
                <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                  {product.screen_size}
                </span>
              )}
              {product.warranty && (
                <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                  {product.warranty}
                </span>
              )}
            </div>
          )}

          {product.category === "Clothing" && (
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {product.size && (
                <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                  Size: {product.size}
                </span>
              )}
              {product.colours && (
                <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                  {product.colours.slice(0, 2).join(", ")}
                </span>
              )}
            </div>
          )}

          {product.category === "Groceries" && (
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {product.weight && (
                <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                  {product.weight}
                </span>
              )}
              {product.expiry_date && (
                <span className="px-2 py-0.5 rounded-md bg-[#f1f6f3] text-[#013326] font-medium">
                  Exp: {product.expiry_date}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Price and Actions */}
      <div className="p-5 pt-3 bg-[#fafcfb] border-t border-[#f1f6f3] flex items-center justify-between">
        <div>
          <p className="text-[10px] text-[#5c7167] font-medium uppercase tracking-wider">Price</p>
          <span className="text-lg font-black text-[#013326]">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="p-2 rounded-xl bg-white border border-[#e2eae5] text-[#5c7167] hover:text-[#013326] hover:bg-[#f1f6f3] transition-all cursor-pointer shadow-2xs"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => addToCart(product, 1)}
            className="px-3.5 py-2 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#15c089]" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
