"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Heart, ShoppingBag, ArrowRight, Trash2, ArrowLeft, Star } from "lucide-react";
import { ProductCard } from "@/components/customer/ProductCard";

export default function WishlistPage() {
  const { wishlist, clearWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

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
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium mb-1">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Wishlist</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Saved Items & Wishlist</h1>
          <p className="text-xs text-slate-500">{wishlist.length} item{wishlist.length === 1 ? "" : "s"} saved for later</p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
        >
          Clear Wishlist
        </button>
      </div>

      {/* Grid of Wishlist Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {wishlist.map((prod) => (
          <ProductCard key={prod.product_id} product={prod} />
        ))}
      </div>
    </div>
  );
}
