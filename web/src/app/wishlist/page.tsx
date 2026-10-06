"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import { Product } from "@/types";
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  Trash2,
  ShoppingCart,
  Star,
} from "lucide-react";

export default function WishlistPage() {
  const { wishlist, clearWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const handleMoveToCart = (prod: Product) => {
    addToCart(prod, 1);
    removeFromWishlist(prod.product_id);
    showToast(`Moved "${prod.name}" to your cart!`, "success");
  };

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    const count = wishlist.length;
    wishlist.forEach((item) => addToCart(item, 1));
    clearWishlist();
    showToast(`Successfully moved all ${count} items to your shopping cart!`, "success");
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your wishlist is empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Save items you love by clicking the heart icon on any product card while browsing.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4 text-blue-400" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Title & Bulk Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium mb-1">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Wishlist</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Saved Items & Wishlist</h1>
          <p className="text-xs text-slate-500">{wishlist.length} item{wishlist.length === 1 ? "" : "s"} saved for later</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleMoveAllToCart}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Move All to Cart</span>
          </button>
          <button
            onClick={() => {
              clearWishlist();
              showToast("Wishlist cleared", "info");
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-2.5 rounded-xl border border-rose-200 text-xs text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wishlist</span>
          </button>
        </div>
      </div>

      {/* Grid of Wishlist Products with Dedicated "Move to Cart" button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {wishlist.map((prod) => {
          const hasDiscount = (prod.price > 40 && prod.price < 500) || prod.category === "Electronics";
          const compareAtPrice = hasDiscount ? prod.price * 1.18 : null;

          return (
            <div
              key={prod.product_id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-12 h-12" />
                    </div>
                  )}

                  <button
                    onClick={() => {
                      removeFromWishlist(prod.product_id);
                      showToast(`Removed "${prod.name}" from wishlist`, "info");
                    }}
                    className="absolute top-2 right-2 p-2 rounded-xl bg-white/90 text-rose-600 hover:bg-rose-50 shadow-xs backdrop-blur-xs transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-slate-700 shadow-xs">
                    {prod.category}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center space-x-1 text-xs text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{prod.rating ?? 4.8}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({prod.reviews_count ?? 30})
                    </span>
                  </div>

                  <Link
                    href={`/shop/${prod.product_id}`}
                    className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-2 block leading-snug"
                  >
                    {prod.name}
                  </Link>

                  <div className="flex items-baseline space-x-2 pt-1">
                    <span className="text-base font-extrabold text-slate-900 font-mono">
                      {formatPrice(prod.price)}
                    </span>
                    {compareAtPrice && (
                      <span className="text-xs font-mono text-slate-400 line-through">
                        {formatPrice(compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleMoveToCart(prod)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-blue-400" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
