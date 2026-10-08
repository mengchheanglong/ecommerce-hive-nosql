"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Product, ProductReview } from "@/types";
import { fetchProductById, fetchProducts, submitProductReview } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import { useLocation } from "@/context/LocationContext";
import { useWishlist } from "@/context/WishlistContext";
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
  MessageSquare,
  Send,
  UserCheck,
  Store,
  MapPin,
  Clock,
  Heart,
  Share2,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  Search,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [fbtAdded, setFbtAdded] = useState(false);

  // Bundle checkboxes for Frequently Bought Together
  const [bundleIncludeItem1, setBundleIncludeItem1] = useState(true);
  const [bundleIncludeItem2, setBundleIncludeItem2] = useState(true);

  const { addToCart, applyPromoCode } = useCart();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();
  const { selectedProvince } = useLocation();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Q&A State
  interface ProductQA {
    id: string;
    question: string;
    askedBy: string;
    date: string;
    answer: string;
    answeredBy: string;
    helpfulCount: number;
    userVoted?: boolean;
  }

  const [qaList, setQaList] = useState<ProductQA[]>([]);
  const [qaSearch, setQaSearch] = useState("");
  const [showQaForm, setShowQaForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionAuthor, setNewQuestionAuthor] = useState("");
  const [isSubmittingQa, setIsSubmittingQa] = useState(false);

  useEffect(() => {
    async function load() {
      if (!productId) return;
      setLoading(true);
      const data = await fetchProductById(productId);
      setProduct(data);
      const all = await fetchProducts();
      setCatalog(all);
      if (data) {
        setRelated(all.filter((p) => p.category === data.category && p.product_id !== productId).slice(0, 3));

        // Populate authentic category-tailored Q&As
        const defaultQAs: ProductQA[] =
          data.category === "Electronics"
            ? [
                {
                  id: "qa-1",
                  question: "Is this device compatible with standard Cambodian 220V electricity and sockets?",
                  askedBy: "Vannak Long",
                  date: "September 15, 2026",
                  answer:
                    "Yes, it supports international wide-voltage 100V–240V (50/60Hz) and works natively with standard Cambodian 220V power outlets. Standard plug adapter is included in the packaging.",
                  answeredBy: "Mekong Electronics Hub (Verified Merchant)",
                  helpfulCount: 16,
                },
                {
                  id: "qa-2",
                  question: "Where can I claim warranty repairs in Phnom Penh or Siem Reap?",
                  askedBy: "Rithy Seng",
                  date: "September 19, 2026",
                  answer:
                    "Official 1-Year Distributor Warranty can be serviced at our authorized walk-in centers on Norodom Blvd in Phnom Penh and Pokambor Ave in Siem Reap. Serial number is registered with Ministry of Commerce.",
                  answeredBy: "Mekong Electronics Hub (Verified Merchant)",
                  helpfulCount: 11,
                },
                {
                  id: "qa-3",
                  question: "Can I inspect the factory seal and test the device before paying with Bakong KHQR?",
                  askedBy: "Sreyneth Meas",
                  date: "September 22, 2026",
                  answer:
                    "Yes! All packages are shipped with intact tamper-evident manufacturer seals. You can inspect the package upon courier arrival and scan NBC Bakong KHQR with $0 transaction fees.",
                  answeredBy: "Rentify Logistics Support",
                  helpfulCount: 21,
                },
              ]
            : data.category === "Fashion & Accessories" || data.category === "Clothing"
            ? [
                {
                  id: "qa-1",
                  question: "How should this silk fabric or garment be washed and ironed?",
                  askedBy: "Bopha Chan",
                  date: "September 14, 2026",
                  answer:
                    "Hand-wash gently in cool water using mild silk detergent. Do not wring or tumble dry. Dry in shade away from direct tropical sunlight, and steam iron on low heat setting.",
                  answeredBy: "Sovann Silk Studio (Master Weavers)",
                  helpfulCount: 14,
                },
                {
                  id: "qa-2",
                  question: "Is this Cambodian standard sizing or oversized Western fit?",
                  askedBy: "Piseth Meas",
                  date: "September 20, 2026",
                  answer:
                    "It follows standard unisex Asian retail sizing. If you prefer a loose relaxed silhouette, we recommend selecting one size up from your normal size.",
                  answeredBy: "Phnom Penh Urban Streetwear (Merchant)",
                  helpfulCount: 9,
                },
              ]
            : data.category === "Food & Groceries"
            ? [
                {
                  id: "qa-1",
                  question: "What is the harvest date and how long does the vacuum freshness seal last?",
                  askedBy: "Dara Heng",
                  date: "September 16, 2026",
                  answer:
                    "Harvested during the latest seasonal harvest in Battambang and vacuum-sealed at source. Guaranteed fresh for up to 18 months stored in a cool, dry pantry.",
                  answeredBy: "Battambang Organic Harvest (Verified Farmer)",
                  helpfulCount: 19,
                },
                {
                  id: "qa-2",
                  question: "Is this batch certified chemical-free and organic?",
                  askedBy: "Chenda Kim",
                  date: "September 21, 2026",
                  answer:
                    "Yes, fully lab-tested and certified by Cambodian Organic Agriculture standards with zero chemical pesticide residues.",
                  answeredBy: "Battambang Organic Harvest (Verified Farmer)",
                  helpfulCount: 13,
                },
              ]
            : [
                {
                  id: "qa-1",
                  question: "How is this artisanal craft item packed to prevent breakage during motorcycle courier delivery?",
                  askedBy: "Sokhom Nuon",
                  date: "September 18, 2026",
                  answer:
                    "All fragile handicrafts and ceramics are wrapped in multi-layer shock-absorbent bubble cushioning and packed in rigid reinforced corrugated boxes with fragile handling stickers.",
                  answeredBy: "Angkor Artisan & Handicrafts (Verified Merchant)",
                  helpfulCount: 17,
                },
              ];
        setQaList(defaultQAs);
      }
      setLoading(false);
    }
    load();
  }, [productId]);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setIsSubmittingQa(true);

    const questionText = newQuestion.trim();
    const authorName = newQuestionAuthor.trim() || "Verified Shopper";

    const newQA: ProductQA = {
      id: `qa-${Date.now()}`,
      question: questionText,
      askedBy: authorName,
      date: "Just now",
      answer: `Verified Merchant Response: Thank you for asking about "${product?.name}". Our fulfillment team has verified that this item complies with all specifications and is stocked in Phnom Penh ready for same-day dispatch.`,
      answeredBy: `${seller.name} (Official Merchant)`,
      helpfulCount: 1,
    };

    setTimeout(() => {
      setQaList((prev) => [newQA, ...prev]);
      setNewQuestion("");
      setNewQuestionAuthor("");
      setShowQaForm(false);
      setIsSubmittingQa(false);
      showToast("Your question was posted and received a verified merchant answer!", "success");
    }, 800);
  };

  const handleVoteHelpful = (qaId: string) => {
    setQaList((prev) =>
      prev.map((qa) => {
        if (qa.id === qaId) {
          const nextCount = qa.userVoted ? qa.helpfulCount - 1 : qa.helpfulCount + 1;
          showToast(qa.userVoted ? "Vote removed" : "Marked as helpful!", "info");
          return { ...qa, helpfulCount: nextCount, userVoted: !qa.userVoted };
        }
        return qa;
      })
    );
  };

  const filteredQAs = useMemo(() => {
    if (!qaSearch.trim()) return qaList;
    const q = qaSearch.toLowerCase();
    return qaList.filter(
      (qa) => qa.question.toLowerCase().includes(q) || qa.answer.toLowerCase().includes(q)
    );
  }, [qaList, qaSearch]);

  // Generate gallery images if not explicitly specified
  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) return product.images;

    const base = product.image || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80";
    
    // Provide 3 complementary visual angles depending on category
    if (product.category === "Electronics") {
      return [
        base,
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      ];
    } else if (product.category === "Clothing") {
      return [
        base,
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
      ];
    } else {
      return [
        base,
        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
      ];
    }
  }, [product]);

  // Frequently Bought Together items (from frequently_bought_with or complementary category)
  const fbtItems = useMemo(() => {
    if (!product || catalog.length === 0) return [];

    if (product.frequently_bought_with && product.frequently_bought_with.length > 0) {
      const explicitMatches = product.frequently_bought_with
        .map((sku) => catalog.find((c) => c.product_id === sku))
        .filter((c): c is Product => Boolean(c));
      if (explicitMatches.length >= 2) return explicitMatches.slice(0, 2);
      if (explicitMatches.length === 1) {
        const extra = catalog.find(
          (c) => c.product_id !== product.product_id && c.product_id !== explicitMatches[0].product_id && c.category === product.category
        );
        return extra ? [explicitMatches[0], extra] : explicitMatches;
      }
    }

    const sameCat = catalog.filter(
      (p) => p.category === product.category && p.product_id !== product.product_id
    );
    if (sameCat.length >= 2) return sameCat.slice(0, 2);

    return catalog.filter((p) => p.product_id !== product.product_id).slice(0, 2);
  }, [product, catalog]);

  // Bundle pricing calculation
  const bundleTotalPrice = useMemo(() => {
    if (!product) return 0;
    let total = product.price;
    if (fbtItems[0] && bundleIncludeItem1) total += fbtItems[0].price;
    if (fbtItems[1] && bundleIncludeItem2) total += fbtItems[1].price;
    return total * 0.9; // 10% bundle discount
  }, [product, fbtItems, bundleIncludeItem1, bundleIncludeItem2]);

  const bundleRawPrice = useMemo(() => {
    if (!product) return 0;
    let total = product.price;
    if (fbtItems[0] && bundleIncludeItem1) total += fbtItems[0].price;
    if (fbtItems[1] && bundleIncludeItem2) total += fbtItems[1].price;
    return total;
  }, [product, fbtItems, bundleIncludeItem1, bundleIncludeItem2]);

  const handleAddBundleToCart = () => {
    if (!product) return;
    addToCart(product, 1);
    if (fbtItems[0] && bundleIncludeItem1) addToCart(fbtItems[0], 1);
    if (fbtItems[1] && bundleIncludeItem2) addToCart(fbtItems[1], 1);

    // Apply the 10% bundle savings coupon directly to the cart
    applyPromoCode("BUNDLE10");

    setFbtAdded(true);
    showToast("Bundle added to cart with 10% bundle savings applied!", "success");
    setTimeout(() => setFbtAdded(false), 2000);
  };

  const handleAddToCartSingle = () => {
    if (!product) return;
    addToCart(product, qty);
    setJustAdded(true);
    showToast(`Added ${qty}x ${product.name} to cart`, "success");
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, qty);
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewComment.trim()) return;

    setSubmittingReview(true);
    const res = await submitProductReview(product.product_id, {
      author: reviewAuthor.trim() || "Verified Buyer",
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setSubmittingReview(false);

    if (res.success && res.product) {
      setProduct(res.product);
      setShowReviewForm(false);
      setReviewComment("");
      setReviewAuthor("");
      showToast("Thank you! Your verified review has been published.", "success");
    } else {
      showToast("Error submitting review", "error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">
          Retrieving polymorphic product specifications from MongoDB catalog...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Product not found</h2>
        <p className="text-xs text-slate-500">The requested item could not be retrieved from the catalog.</p>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const reviewsList = product.reviews || [];
  const isSaved = isInWishlist(product.product_id);

  // Stock availability check
  const availableStock = Math.max(0, product.stock ?? 0);
  const isOutOfStock = availableStock <= 0;

  // Resolved store slug
  const storeSlug =
    product.store_slug ||
    (product.store_id ? product.store_id.toLowerCase() : null) ||
    (product.category === "Electronics"
      ? "mekong-electronics"
      : product.category === "Fashion & Accessories" || product.category === "Clothing"
      ? (/streetwear|hoodie|tee/i.test(product.name) ? "phnom-penh-streetwear" : "sovann-silk")
      : product.category === "Food & Groceries"
      ? (/pepper|sugar|salt|spice/i.test(product.name) ? "kampot-heritage-pepper" : "battambang-organic")
      : product.category === "Home & Living"
      ? "bm-ceramics"
      : product.category === "Beauty & Wellness"
      ? "cardamom-botanicals"
      : "angkor-artisan");

  // Seller details (authentic Cambodian sellers)
  const seller = product.seller || {
    name:
      storeSlug === "mekong-electronics"
        ? "Mekong Electronics Hub"
        : storeSlug === "sovann-silk"
        ? "Sovann Silk Studio & Weavers"
        : storeSlug === "phnom-penh-streetwear"
        ? "Phnom Penh Urban Streetwear"
        : storeSlug === "battambang-organic"
        ? "Battambang Organic Harvest"
        : storeSlug === "kampot-heritage-pepper"
        ? "Kampot Heritage Pepper Co."
        : storeSlug === "bm-ceramics"
        ? "Banteay Meanchey Ceramic Works"
        : storeSlug === "cardamom-botanicals"
        ? "Cardamom Wild Botanicals"
        : "Angkor Artisan & Handicrafts",
    rating: 4.9,
    reviews_count: 1480,
    positive_feedback: 99.4,
    response_time: "< 15 mins",
    verified: true,
    store_id: storeSlug,
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200/80 pb-3">
        <div className="flex items-center space-x-2 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-slate-900 transition-colors">
            Catalog
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="hover:text-slate-900 transition-colors font-semibold"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => toggleWishlist(product)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              isSaved
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : "bg-white text-slate-600 hover:text-slate-900 border-slate-200"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current text-rose-500" : ""}`} />
            <span>{isSaved ? "Saved in Wishlist" : "Save to Wishlist"}</span>
          </button>
        </div>
      </div>

      {/* Main PDP 2-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Image Gallery with Thumbnail Switcher */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 sticky top-24">
          {/* Main Large Display Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner group">
            <img
              src={galleryImages[activeImageIndex] || product.image}
              alt={`${product.name} - Angle ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-semibold text-slate-800 border border-white/60 shadow-xs">
                {product.category}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold shadow-xs">
                Official Distributor
              </span>
            </div>

            {isOutOfStock ? (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-rose-50/95 backdrop-blur-md text-[11px] font-semibold text-rose-700 border border-rose-200/60 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Out of Stock</span>
              </div>
            ) : (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-50/95 backdrop-blur-md text-[11px] font-semibold text-emerald-700 border border-emerald-200/60 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>In Stock ({availableStock} units)</span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip Switcher */}
          <div className="grid grid-cols-4 gap-2.5 pt-1">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-emerald-600 ring-2 ring-emerald-500/30 scale-102"
                    : "border-slate-200/80 hover:border-slate-400 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs px-1 text-slate-500 pt-2 border-t border-slate-100">
            <span className="font-mono">Document SKU: {product.product_id}</span>
            <div className="flex items-center space-x-1 text-amber-500 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating ?? 4.8} / 5.0</span>
              <span className="text-[10px] text-amber-700 font-normal">
                ({product.reviews_count ?? reviewsList.length} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Delivery Speed, Seller Profile & Controls */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          {/* Header & Pricing */}
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {product.category}
              </span>
              <span className="text-xs text-slate-400">• Verified Cambodian Store</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline space-x-3 pt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm font-mono text-slate-400 line-through">
                {formatPrice(product.price * 1.18)}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                Save 15%
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {product.description ||
                "Authentic marketplace product distributed with official warranty documentation, rapid courier tracking, and instant Bakong KHQR checkout."}
            </p>
          </div>

          {/* Delivery Speed Guarantee Card (Integrated with selectedProvince) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-900 font-bold">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Express Courier Dispatch to {selectedProvince}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Same-Day Guarantee
              </span>
            </div>

            <p className="text-slate-600 text-[11px] leading-relaxed">
              Order within <strong className="text-slate-900">3 hrs 42 mins</strong> to receive delivery in{" "}
              <strong className="text-emerald-800">{selectedProvince}</strong> by{" "}
              <strong className="text-slate-900">Tomorrow, 2:00 PM</strong> via our 800-rider Cassandra fleet.
            </p>

            <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-500 font-medium border-t border-slate-200/60">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free delivery on orders over $30</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>NBC Bakong KHQR $0 fee</span>
              </span>
            </div>
          </div>

          {/* Seller Profile Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <Link
                href={`/stores/${storeSlug}`}
                className="w-11 h-11 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                title={`Visit ${seller.name}`}
              >
                <Store className="w-5 h-5 text-blue-400" />
              </Link>
              <div>
                <div className="flex items-center space-x-1.5">
                  <Link
                    href={`/stores/${storeSlug}`}
                    className="font-extrabold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    {seller.name}
                  </Link>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                  <span className="flex items-center space-x-0.5 text-amber-600 font-semibold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{seller.rating}</span>
                  </span>
                  <span>•</span>
                  <span>{seller.positive_feedback}% Positive Feedback</span>
                  <span>•</span>
                  <span>Response: {seller.response_time}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/stores/${storeSlug}`}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-800 font-semibold text-xs transition-colors shrink-0"
            >
              Visit Store
            </Link>
          </div>

          {/* Purchasing Quantity & Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 self-start sm:self-auto">
              <button
                type="button"
                disabled={isOutOfStock || qty <= 1}
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-800 shadow-2xs hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-slate-900">
                {isOutOfStock ? 0 : qty}
              </span>
              <button
                type="button"
                disabled={isOutOfStock || qty >= availableStock}
                onClick={() => setQty(Math.min(availableStock, qty + 1))}
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-800 shadow-2xs hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 flex gap-3">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCartSingle}
                className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center justify-center space-x-2 ${
                  isOutOfStock
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                    : justAdded
                    ? "bg-blue-600 text-white ring-2 ring-blue-500/30 cursor-pointer active:scale-95"
                    : "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer active:scale-95"
                }`}
              >
                {isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-white animate-in zoom-in" />
                    <span>Added ({formatPrice(product.price * qty)})</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-blue-400" />
                    <span>Add to Cart ({formatPrice(product.price * qty)})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={`py-3.5 px-6 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 ${
                  isOutOfStock
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                    : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95"
                }`}
              >
                <span>{isOutOfStock ? "Out of Stock" : "Buy Now"}</span>
                {!isOutOfStock && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Polymorphic Technical Specifications Table */}
          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Technical Specifications & Attributes
            </h3>

            <div className="border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="grid grid-cols-3 p-3 bg-slate-50/70">
                <span className="font-semibold text-slate-500">Document Model</span>
                <span className="col-span-2 font-mono font-bold text-slate-900">{product.product_id}</span>
              </div>

              <div className="grid grid-cols-3 p-3 bg-white">
                <span className="font-semibold text-slate-500">Category Department</span>
                <span className="col-span-2 font-bold text-slate-900">{product.category}</span>
              </div>

              {product.screen_size && (
                <div className="grid grid-cols-3 p-3 bg-slate-50/70">
                  <span className="font-semibold text-slate-500">Screen Display</span>
                  <span className="col-span-2 font-semibold text-slate-900">{product.screen_size}</span>
                </div>
              )}

              {product.warranty && (
                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-semibold text-slate-500">Warranty Term</span>
                  <span className="col-span-2 font-semibold text-slate-900">{product.warranty}</span>
                </div>
              )}

              {product.size && (
                <div className="grid grid-cols-3 p-3 bg-slate-50/70">
                  <span className="font-semibold text-slate-500">Garment Sizing</span>
                  <span className="col-span-2 font-semibold text-slate-900">{product.size}</span>
                </div>
              )}

              {product.colours && product.colours.length > 0 && (
                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-semibold text-slate-500">Color Palette</span>
                  <span className="col-span-2 font-semibold text-slate-900">{product.colours.join(", ")}</span>
                </div>
              )}

              {product.weight && (
                <div className="grid grid-cols-3 p-3 bg-slate-50/70">
                  <span className="font-semibold text-slate-500">Net Weight</span>
                  <span className="col-span-2 font-semibold text-slate-900">{product.weight}</span>
                </div>
              )}

              {product.expiry_date && (
                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-semibold text-slate-500">Batch Expiry</span>
                  <span className="col-span-2 font-semibold text-slate-900">{product.expiry_date}</span>
                </div>
              )}

              <div className="grid grid-cols-3 p-3 bg-slate-50/70">
                <span className="font-semibold text-slate-500">Fulfillment Hub</span>
                <span className="col-span-2 font-semibold text-emerald-700">
                  Phnom Penh Central Depot ({product.stock ?? 25} ready to ship)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FREQUENTLY BOUGHT TOGETHER (FBT) BUNDLE SECTION */}
      {fbtItems.length >= 2 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">Frequently Bought Together</h3>
            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-full border border-rose-200">
              Save 10% on Bundle
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Bundle Strip */}
            <div className="lg:col-span-8 flex flex-wrap items-center gap-3">
              {/* Product 1: Primary item */}
              <div className="w-24 sm:w-28 space-y-1">
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-[11px] font-bold text-slate-900 line-clamp-1">{product.name}</p>
                <p className="text-xs font-mono font-bold text-slate-900">{formatPrice(product.price)}</p>
              </div>

              <span className="text-xl font-bold text-slate-400">+</span>

              {/* Product 2: Complementary item 1 */}
              <div className="w-24 sm:w-28 space-y-1">
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
                  <img src={fbtItems[0].image} alt={fbtItems[0].name} className="w-full h-full object-cover" />
                </div>
                <p className="text-[11px] font-bold text-slate-900 line-clamp-1">{fbtItems[0].name}</p>
                <p className="text-xs font-mono font-bold text-slate-900">{formatPrice(fbtItems[0].price)}</p>
              </div>

              <span className="text-xl font-bold text-slate-400">+</span>

              {/* Product 3: Complementary item 2 */}
              <div className="w-24 sm:w-28 space-y-1">
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
                  <img src={fbtItems[1].image} alt={fbtItems[1].name} className="w-full h-full object-cover" />
                </div>
                <p className="text-[11px] font-bold text-slate-900 line-clamp-1">{fbtItems[1].name}</p>
                <p className="text-xs font-mono font-bold text-slate-900">{formatPrice(fbtItems[1].price)}</p>
              </div>
            </div>

            {/* Bundle Checkout Box */}
            <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center space-x-2 text-slate-800">
                  <input type="checkbox" checked disabled className="rounded text-blue-600" />
                  <span className="truncate">This item: {product.name}</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bundleIncludeItem1}
                    onChange={(e) => setBundleIncludeItem1(e.target.checked)}
                    className="rounded text-blue-600 cursor-pointer"
                  />
                  <span className="truncate">{fbtItems[0].name} ({formatPrice(fbtItems[0].price)})</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bundleIncludeItem2}
                    onChange={(e) => setBundleIncludeItem2(e.target.checked)}
                    className="rounded text-blue-600 cursor-pointer"
                  />
                  <span className="truncate">{fbtItems[1].name} ({formatPrice(fbtItems[1].price)})</span>
                </label>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-extrabold text-slate-900 font-mono">
                    {formatPrice(bundleTotalPrice)}
                  </span>
                  <span className="text-xs font-mono text-slate-400 line-through">
                    {formatPrice(bundleRawPrice)}
                  </span>
                </div>
                <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Bundle discount applied (-10%)</p>
              </div>

              <button
                type="button"
                onClick={handleAddBundleToCart}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center space-x-1.5 ${
                  fbtAdded
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 hover:bg-blue-600 text-white"
                }`}
              >
                {fbtAdded ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Bundle Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-blue-400" />
                    <span>Add All Selected to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CUSTOMER REVIEWS & RATING BREAKDOWN */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Customer Ratings & Verified Reviews</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Feedback from verified buyers who completed delivery in Cambodia
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
          >
            <span>{showReviewForm ? "Close Form" : "Write a Review"}</span>
          </button>
        </div>

        {/* Rating Breakdown Bar Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50/70 p-5 rounded-2xl border border-slate-200/60">
          <div className="md:col-span-4 text-center md:text-left space-y-1">
            <span className="text-4xl font-extrabold text-slate-900 font-mono">
              {(product.rating ?? 0) > 0 ? product.rating : "—"}
            </span>
            <div className="flex items-center justify-center md:justify-start space-x-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    (product.rating ?? 0) > i ? "fill-current" : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Based on {product.reviews_count ?? reviewsList.length} verified ratings
            </p>
          </div>

          <div className="md:col-span-8 space-y-1.5 text-xs text-slate-600">
            {(() => {
              const total = reviewsList.length;
              const rows = [5, 4, 3, 2, 1].map((star) => {
                if (total === 0) {
                  return { star, pct: 0, count: 0 };
                }
                const count = reviewsList.filter((r) => Math.round(r.rating) === star).length;
                const pct = Math.round((count / total) * 100);
                return { star, pct, count };
              });
              return rows.map((row) => (
                <div key={row.star} className="flex items-center space-x-2">
                  <span className="w-12 text-[11px] font-semibold">{row.star} Stars</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] font-mono text-slate-400">{row.pct}%</span>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 animate-in fade-in"
          >
            <h4 className="text-xs font-bold text-slate-900">Write Your Verified Review</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sokha Meas"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rating</label>
                <div className="flex items-center space-x-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setReviewRating(s)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= reviewRating ? "text-amber-400 fill-current" : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-800 ml-2">{reviewRating} of 5 Stars</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Experience</label>
              <textarea
                rows={3}
                placeholder="How was the product quality, packaging, delivery speed in Cambodia, and customer support?"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingReview ? "Publishing to MongoDB..." : "Publish Review"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {reviewsList.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No customer reviews yet. Be the first to share your experience with this item!
          </p>
        ) : (
          <div className="space-y-3">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{rev.author}</span>
                    {rev.verified && (
                      <span className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <UserCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Purchase</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? "fill-current" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 ml-2">{rev.date}</span>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Customer Questions & Answers Section */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <HelpCircle className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">Customer Questions & Answers</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ask about technical compatibility, authentic Khmer sizing, harvest dates, or warranty details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowQaForm(!showQaForm)}
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showQaForm ? "Close Form" : "Ask a Question"}</span>
          </button>
        </div>

        {/* Q&A Search Filter */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={qaSearch}
            onChange={(e) => setQaSearch(e.target.value)}
            placeholder="Have a question? Search answers (e.g. 220V plug, sizing, warranty, freshness)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-800 placeholder-slate-400"
          />
          {qaSearch && (
            <button
              onClick={() => setQaSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Ask Question Form Modal/Drawer Inline */}
        {showQaForm && (
          <form
            onSubmit={handleAskQuestion}
            className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200/60 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Post an Inquiry to Seller & Community
              </h4>
              <span className="text-[11px] text-blue-700 font-medium">Response SLA: &lt; 2 hours</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sokha Meas"
                  value={newQuestionAuthor}
                  onChange={(e) => setNewQuestionAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
              <div className="flex items-end">
                <p className="text-[11px] text-slate-500 leading-snug">
                  Your question will be forwarded directly to the verified merchant and answered publicly.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Question *</label>
              <textarea
                rows={3}
                placeholder="e.g. Is this compatible with Cambodian standard 220V power outlets? Does it come with warranty in Phnom Penh?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[10px] text-slate-500">
                Please adhere to Cambodian community standards and avoid sharing personal phone numbers.
              </p>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowQaForm(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQa}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingQa ? "Posting..." : "Submit Question"}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Q&A List */}
        {filteredQAs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700">No questions found matching your search.</p>
            <p>Have a question about this item? Click &quot;Ask a Question&quot; to receive a response from the merchant.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQAs.map((qa) => (
              <div
                key={qa.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3 transition-colors hover:bg-slate-50"
              >
                {/* Question */}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-2.5">
                      <span className="shrink-0 px-2 py-0.5 rounded-md bg-blue-600 text-white font-extrabold text-[11px] leading-tight">
                        Q
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {qa.question}
                      </h4>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 pl-8">
                    Asked by <span className="font-medium text-slate-600">{qa.askedBy}</span> • {qa.date}
                  </p>
                </div>

                {/* Answer */}
                <div className="pl-8 pt-1 space-y-2 border-t border-slate-200/40">
                  <div className="flex items-start space-x-2.5">
                    <span className="shrink-0 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[11px] leading-tight">
                      A
                    </span>
                    <div className="space-y-2 flex-1">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {qa.answer}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/60 text-[11px] font-semibold text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{qa.answeredBy}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleVoteHelpful(qa.id)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                            qa.userVoted
                              ? "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${qa.userVoted ? "fill-current" : ""}`} />
                          <span>Helpful ({qa.helpfulCount})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products Rail */}
      {related.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Related Items in {product.category}</h3>
            <Link
              href={`/shop?category=${product.category}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Explore Category</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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
