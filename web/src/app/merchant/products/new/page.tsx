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
      if (screenSize.trim()) payload.screen_size = screenSize.trim();
      if (warranty.trim()) payload.warranty = warranty.trim();
    } else if (category === "Clothing") {
      if (size.trim()) payload.size = size.trim();
      if (colours.trim()) {
        payload.colours = colours
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
      }
    } else if (category === "Groceries") {
      if (weight.trim()) payload.weight = weight.trim();
      if (expiryDate.trim()) payload.expiry_date = expiryDate.trim();
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
      <div className="flex items-center space-x-2 text-xs text-[#5c7167]">
        <Link href="/merchant" className="hover:text-[#013326]">Merchant</Link>
        <span>/</span>
        <Link href="/merchant/products" className="hover:text-[#013326]">Products</Link>
        <span>/</span>
        <span className="text-[#013326] font-bold">New Product</span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eae5] shadow-card space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#f1f6f3]">
          <div>
            <h1 className="text-xl font-black text-[#013326]">Create New Product Document</h1>
            <p className="text-xs text-[#5c7167]">MongoDB collection insert with category polymorphic validation</p>
          </div>
          <Link
            href="/merchant/products"
            className="p-2 rounded-xl text-[#5c7167] hover:bg-[#f1f6f3] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Base fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#013326] mb-1">Product Name</label>
              <input
                type="text"
                placeholder="e.g. Smart Watch Fitness Edition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#013326] mb-1">SKU / Document ID</label>
              <input
                type="text"
                placeholder="P8812"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326] font-mono focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#013326] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326] focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Groceries">Groceries</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#013326] mb-1">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                placeholder="49.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326] font-mono focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#013326] mb-1">Initial Stock Units</label>
              <input
                type="number"
                placeholder="50"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic Polymorphic Category Fields */}
          <div className="p-4 rounded-2xl bg-[#f6faf8] border border-[#e2eae5] space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#013326] block">
              Category-Specific Document Fields ({category})
            </span>

            {category === "Electronics" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c7167] mb-1">Screen / Display Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.4 inch AMOLED 454x454"
                    value={screenSize}
                    onChange={(e) => setScreenSize(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#e2eae5]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c7167] mb-1">Warranty Term</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Year Official"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#e2eae5]"
                  />
                </div>
              </div>
            )}

            {category === "Clothing" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c7167] mb-1">Size</label>
                  <input
                    type="text"
                    placeholder="e.g. M, L, XL or Free Size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#e2eae5]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c7167] mb-1">Colours (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Black, Silver, Forest Green"
                    value={colours}
                    onChange={(e) => setColours(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#e2eae5]"
                  />
                </div>
              </div>
            )}

            {category === "Groceries" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c7167] mb-1">Net Weight</label>
                  <input
                    type="text"
                    placeholder="e.g. 500g Glass Container"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#e2eae5]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c7167] mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#e2eae5]"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#013326] mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Product details, provenance, distributor inspection details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Link
              href="/merchant/products"
              className="px-5 py-3 rounded-xl border border-[#e2eae5] text-xs font-bold text-[#5c7167] hover:bg-[#f1f6f3]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Persisting to MongoDB..." : "Save Product Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
