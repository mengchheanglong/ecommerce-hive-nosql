"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  Plus,
  Eye,
  Check,
  Star,
  Heart,
  Sparkles,
  ShieldCheck,
  Truck,
  Smartphone,
  Shirt,
  Apple,
  Package,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  featuredBadge?: string;
  rankBadge?: string;
}

export function ProductCard({ product, onQuickView, featuredBadge, rankBadge }: ProductCardProps) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const saved = isInWishlist(product.product_id);

  // Compute realistic compare-at price for promotional discounts
  const hasDiscount = (product.price > 20 && product.price < 500) || product.category === "Electronics";
  const compareAtPrice = hasDiscount ? product.price * 1.2 : null;
  const discountPercent = hasDiscount ? 17 : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const getCategoryIcon = () => {
    switch (product.category) {
      case "Electronics":
        return <Smartphone className="w-8 h-8 text-slate-400" />;
      case "Clothing":
        return <Shirt className="w-8 h-8 text-slate-400" />;
      case "Groceries":
        return <Apple className="w-8 h-8 text-slate-400" />;
      default:
        return <Package className="w-8 h-8 text-slate-400" />;
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.09),0_6px_12px_-4px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Visual Image Media Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden flex items-center justify-center">
        <Link href={`/shop/${product.product_id}`} className="block w-full h-full">
          {product.image && !imageFailed ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 p-4">
              {getCategoryIcon()}
              <span className="text-[11px] font-bold mt-1 text-slate-600">{product.category}</span>
              <span className="text-[10px] text-slate-400">{product.product_id}</span>
            </div>
          )}
        </Link>

        {/* Ambient Gradient Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {rankBadge && (
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md bg-amber-500 text-slate-950 shadow-xs flex items-center space-x-1">
              <span>{rankBadge}</span>
            </span>
          )}
          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-white/95 backdrop-blur-md text-slate-800 border border-white/60 shadow-xs">
            {product.category}
          </span>
          {discountPercent && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-600 text-white shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
          {featuredBadge && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white shadow-xs flex items-center space-x-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{featuredBadge}</span>
            </span>
          )}
        </div>

        {/* Wishlist Button (Top-Right) */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 z-20 p-2 rounded-xl backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xs active:scale-90 ${
            saved
              ? "bg-rose-50 text-rose-500 border border-rose-200"
              : "bg-white/90 text-slate-500 hover:text-rose-500 hover:bg-white border border-slate-200/80"
          }`}
          title={saved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart className={`w-4 h-4 transition-transform ${saved ? "fill-current scale-110" : ""}`} />
        </button>

        {/* Quick View Button Hover Overlay */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 right-3 z-20 p-2 rounded-xl bg-white/95 text-slate-700 hover:text-slate-950 hover:bg-white shadow-md border border-slate-200/80 backdrop-blur-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer active:scale-95"
            title="Quick Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Rating & Distributor */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs text-slate-800">{product.rating ?? 4.8}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                ({product.reviews_count ?? 58})
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Official Store</span>
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/shop/${product.product_id}`} className="block group/link">
            <h3 className="text-sm font-bold text-slate-900 group-hover/link:text-blue-600 transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Amazon-style Delivery Promise */}
          <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-medium">
            <Truck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="text-slate-700 font-semibold">FREE Delivery</span>
            <span>Tomorrow by 2 PM</span>
          </div>

          {/* Polymorphic Category Attributes */}
          <div className="pt-0.5 flex flex-wrap gap-1 text-[10px]">
            {product.category === "Electronics" && (
              <>
                {product.screen_size && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200/60 truncate max-w-[140px]">
                    {product.screen_size}
                  </span>
                )}
                {product.warranty && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200/60 truncate max-w-[140px]">
                    {product.warranty}
                  </span>
                )}
              </>
            )}

            {product.category === "Clothing" && (
              <>
                {product.size && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200/60">
                    Size: {product.size}
                  </span>
                )}
                {product.colours && product.colours.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200/60">
                    {product.colours.slice(0, 2).join(", ")}
                  </span>
                )}
              </>
            )}

            {product.category === "Groceries" && (
              <>
                {product.weight && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200/60">
                    {product.weight}
                  </span>
                )}
                {product.expiry_date && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200/60">
                    Exp: {product.expiry_date}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Pricing and Action Footer */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base sm:text-lg font-bold font-mono text-slate-900 tracking-tight">
                {formatPrice(product.price)}
              </span>
              {compareAtPrice && (
                <span className="text-xs font-mono text-slate-400 line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">In Stock • Ships immediately</p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 shadow-xs cursor-pointer active:scale-95 ${
              justAdded
                ? "bg-blue-600 text-white ring-2 ring-blue-500/30"
                : "bg-slate-900 hover:bg-blue-600 text-white"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white animate-in zoom-in" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-blue-400 group-hover:text-white transition-colors" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
