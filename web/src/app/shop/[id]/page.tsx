"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/types";
import { fetchProductById, fetchProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ProductCard } from "@/components/customer/ProductCard";
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Truck,
  CreditCard,
  Star,
  ArrowRight,
  ArrowLeft,
  Share2,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function load() {
      if (!productId) return;
      setLoading(true);
      const data = await fetchProductById(productId);
      setProduct(data);
      if (data) {
        const all = await fetchProducts(data.category);
        setRelated(all.filter((p) => p.product_id !== productId).slice(0, 3));
      }
      setLoading(false);
    }
    load();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#15c089] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#5c7167] mt-3">Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#013326]">Product not found</h2>
        <p className="text-xs text-[#5c7167]">The requested item could not be retrieved from the catalog.</p>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#013326] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product, qty);
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-[#5c7167]">
        <Link href="/" className="hover:text-[#013326]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#013326]">Catalog</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-[#013326]">{product.category}</Link>
        <span>/</span>
        <span className="text-[#013326] font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Showcase Placeholder */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[#e2eae5] shadow-card flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-40 h-40 rounded-3xl bg-[#f1f6f3] flex items-center justify-center text-[#013326] border border-[#e2eae5]">
            <ShoppingBag className="w-16 h-16 text-[#15c089]" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f1f6f3] text-[#013326]">
              {product.category}
            </span>
            <p className="text-xs font-mono text-[#5c7167] mt-2">SKU: {product.product_id}</p>
          </div>
          <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating ?? 4.8} Stars</span>
            <span className="text-[10px] text-amber-600 font-normal">({product.reviews_count ?? 45} customer ratings)</span>
          </div>
        </div>

        {/* Right Column: Details & Purchasing Controls */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eae5] shadow-card space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1 text-[11px] font-semibold text-[#0c835c] bg-[#eafaf4] px-2.5 py-0.5 rounded-full border border-[#9cf0ce]">
                <Check className="w-3 h-3" />
                <span>In Stock ({product.stock ?? 25} available)</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#013326] tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl font-black text-[#0c835c] font-mono pt-1">
              {formatPrice(product.price)}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#5c7167] leading-relaxed">
            {product.description ||
              "Authentic top-tier e-commerce product distributed with verified distributor documentation, rapid courier tracking, and instant Bakong KHQR checkout."}
          </p>

          {/* Dynamic Polymorphic Attributes */}
          <div className="bg-[#f6faf8] p-5 rounded-2xl border border-[#e2eae5] space-y-2 text-xs">
            <h4 className="font-extrabold text-[#013326] text-[11px] uppercase tracking-wider mb-2">
              MongoDB Document Technical Specs
            </h4>

            {product.screen_size && (
              <div className="flex justify-between py-1 border-b border-[#e2eae5]/60">
                <span className="text-[#5c7167]">Display / Screen</span>
                <span className="font-bold text-[#013326]">{product.screen_size}</span>
              </div>
            )}
            {product.warranty && (
              <div className="flex justify-between py-1 border-b border-[#e2eae5]/60">
                <span className="text-[#5c7167]">Warranty Coverage</span>
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
                <span className="text-[#5c7167]">Available Colours</span>
                <span className="font-bold text-[#013326]">{product.colours.join(", ")}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between py-1 border-b border-[#e2eae5]/60">
                <span className="text-[#5c7167]">Net Package Weight</span>
                <span className="font-bold text-[#013326]">{product.weight}</span>
              </div>
            )}
            {product.expiry_date && (
              <div className="flex justify-between py-1 border-b border-[#e2eae5]/60">
                <span className="text-[#5c7167]">Batch Expiry Date</span>
                <span className="font-bold text-[#013326]">{product.expiry_date}</span>
              </div>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center space-x-2 bg-[#f1f6f3] p-1.5 rounded-2xl border border-[#e2eae5] self-start sm:self-auto">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#013326] shadow-xs hover:bg-[#e2eae5]"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-[#013326]">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#013326] shadow-xs hover:bg-[#e2eae5]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 flex gap-3">
              <button
                onClick={() => addToCart(product, qty)}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#15c089]" />
                <span>Add to Cart ({formatPrice(product.price * qty)})</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-5 rounded-2xl bg-[#15c089] hover:bg-[#10a374] text-[#011c15] text-xs font-black transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Delivery & Payment Notice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#f1f6f3] text-xs text-[#5c7167]">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#15c089]" />
              <span>Same-day in Phnom Penh, next-day in Siem Reap</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-[#15c089]" />
              <span>Instant Bakong KHQR & Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[#e2eae5]">
          <h3 className="text-lg font-extrabold text-[#013326]">Related Items in {product.category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((rel) => (
              <ProductCard key={rel.product_id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
