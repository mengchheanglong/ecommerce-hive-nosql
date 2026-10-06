"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { ArrowLeft, Plus, Package, Layers, Sparkles } from "lucide-react";

export default function CreateProductPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [sku, setSku] = useState(`P${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("50");
  const [description, setDescription] = useState("");

  // Category polymorphic specs
  const [screenSize, setScreenSize] = useState("");
  const [warranty, setWarranty] = useState("");
  const [size, setSize] = useState("");
  const [colours, setColours] = useState("");
  const [weight, setWeight] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [material, setMaterial] = useState("");
  const [volume, setVolume] = useState("");
  const [skin_type, setSkinType] = useState("");
  const [artisan, setArtisan] = useState("");
  const [origin_province, setOriginProvince] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      showToast("Please provide product name and price", "warning");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("Price must be a valid positive number greater than $0", "warning");
      return;
    }

    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      showToast("Initial stock units cannot be negative", "warning");
      return;
    }

    setIsSubmitting(true);
    const payload: any = {
      product_id: sku.trim(),
      name: name.trim(),
      category,
      price: priceNum,
      stock: stockNum,
      description: description.trim() || undefined,
      status: "active",
    };

    if (category === "Electronics") {
      payload.category_slug = "electronics";
      payload.category_aliases = ["Electronics", "electronics"];
      if (screenSize.trim()) payload.screen_size = screenSize.trim();
      if (warranty.trim()) payload.warranty = warranty.trim();
    } else if (category === "Clothing" || category === "Fashion & Accessories") {
      payload.category_slug = "fashion";
      payload.category_aliases = ["Clothing", "Fashion", "Fashion & Accessories", "fashion"];
      if (size.trim()) payload.size = size.trim();
      if (colours.trim()) {
        payload.colours = colours
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
      }
    } else if (category === "Groceries" || category === "Food & Groceries") {
      payload.category_slug = "food-groceries";
      payload.category_aliases = ["Groceries", "Food", "Food & Groceries", "food-groceries"];
      if (weight.trim()) payload.weight = weight.trim();
      if (expiryDate.trim()) payload.expiry_date = expiryDate.trim();
    } else if (category === "Home & Living") {
      payload.category_slug = "home-living";
      payload.category_aliases = ["Home & Living", "Home", "home-living"];
      if (dimensions.trim()) payload.dimensions = dimensions.trim();
      if (material.trim()) payload.material = material.trim();
    } else if (category === "Beauty & Wellness") {
      payload.category_slug = "beauty-wellness";
      payload.category_aliases = ["Beauty & Wellness", "Beauty", "beauty-wellness"];
      if (volume.trim()) payload.volume = volume.trim();
      if (skin_type.trim()) payload.skin_type = skin_type.trim();
    } else if (category === "Arts & Culture") {
      payload.category_slug = "arts-culture";
      payload.category_aliases = ["Arts & Culture", "Arts", "arts-culture"];
      if (artisan.trim()) payload.artisan = artisan.trim();
      if (origin_province.trim()) payload.origin_province = origin_province.trim();
    }

    const res = await createProduct(payload);
    setIsSubmitting(false);

    if (res.success) {
      showToast(`Product "${name}" persisted into MongoDB catalog!`, "success");
      router.push("/merchant/products");
    } else {
      showToast(res.error || "Error creating product document", "error");
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/merchant" className="hover:text-slate-900 transition-colors">Merchant</Link>
        <span>/</span>
        <Link href="/merchant/products" className="hover:text-slate-900 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">New Product</span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Create New Product Document</h1>
            <p className="text-xs text-slate-500">MongoDB collection insert with category polymorphic validation</p>
          </div>
          <Link
            href="/merchant/products"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Base fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
              <input
                type="text"
                placeholder="e.g. Smart Watch Fitness Edition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SKU / Document ID</label>
              <input
                type="text"
                placeholder="P8812"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="Electronics">Electronics</option>
                <option value="Food & Groceries">Food & Groceries</option>
                <option value="Fashion & Accessories">Fashion & Accessories</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Beauty & Wellness">Beauty & Wellness</option>
                <option value="Arts & Culture">Arts & Culture</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                placeholder="49.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Initial Stock Units</label>
              <input
                type="number"
                placeholder="50"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Dynamic Polymorphic Category Fields */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              Category-Specific Document Fields ({category})
            </span>

            {category === "Electronics" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Screen / Display Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.4 inch AMOLED 454x454"
                    value={screenSize}
                    onChange={(e) => setScreenSize(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Warranty Term</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Year Official"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                </div>
              </div>
            )}

            {(category === "Clothing" || category === "Fashion & Accessories") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Size</label>
                  <input
                    type="text"
                    placeholder="e.g. M, L, XL or Free Size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Colours (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Black, Silver, Forest Green"
                    value={colours}
                    onChange={(e) => setColours(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                </div>
              </div>
            )}

            {(category === "Groceries" || category === "Food & Groceries") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Net Weight</label>
                  <input
                    type="text"
                    placeholder="e.g. 500g Glass Container"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                </div>
              </div>
            )}

            {category === "Home & Living" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Dimensions</label>
                  <input
                    type="text"
                    placeholder="e.g. 24cm x 18cm x 12cm"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Material</label>
                  <input
                    type="text"
                    placeholder="e.g. Terracotta / Woven Rattan"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                </div>
              </div>
            )}

            {category === "Beauty & Wellness" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Net Volume</label>
                  <input
                    type="text"
                    placeholder="e.g. 50ml Dropper Bottle"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Skin / Treatment Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Sensitive / Dry / All Skin"
                    value={skin_type}
                    onChange={(e) => setSkinType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                </div>
              </div>
            )}

            {category === "Arts & Culture" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Master Artisan / Cooperative</label>
                  <input
                    type="text"
                    placeholder="e.g. Angkor Heritage Guild"
                    value={artisan}
                    onChange={(e) => setArtisan(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Origin Province</label>
                  <input
                    type="text"
                    placeholder="e.g. Siem Reap, Kampong Chhnang"
                    value={origin_province}
                    onChange={(e) => setOriginProvince(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Product details, provenance, distributor inspection details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Link
              href="/merchant/products"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Persisting to MongoDB..." : "Save Product Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
