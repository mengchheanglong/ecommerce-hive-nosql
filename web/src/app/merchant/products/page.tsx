"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchProducts, deleteProduct } from "@/lib/api";
import { Product } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import {
  Package,
  Plus,
  Search,
  Trash2,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Filter,
} from "lucide-react";

export default function MerchantProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (productId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from MongoDB catalog?`)) return;
    const res = await deleteProduct(productId);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.product_id !== productId));
      showToast(`Product "${name}" deleted from MongoDB`, "info");
    } else {
      showToast("Error deleting product", "error");
    }
  };

  const filtered = useMemo(() => {
    return products
      .filter((p) => (selectedCategory === "All" ? true : p.category === selectedCategory))
      .filter((p) =>
        searchQuery === ""
          ? true
          : p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.product_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#013326]">Product Catalog & Inventory</h1>
          <p className="text-xs text-[#5c7167]">
            MongoDB polymorphic document storage with custom attributes per category
          </p>
        </div>

        <Link
          href="/merchant/products/new"
          className="px-4 py-2.5 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#15c089]" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e2eae5] shadow-card">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Electronics", "Clothing", "Groceries"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#013326] text-white"
                  : "bg-[#f1f6f3] text-[#5c7167] hover:text-[#013326]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#5c7167] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#e2eae5] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6faf8] text-[#5c7167] font-bold border-b border-[#e2eae5]">
              <tr>
                <th className="p-4">SKU / ID</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Polymorphic Attributes</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f6f3]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#5c7167]">
                    Loading catalog documents...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#5c7167]">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.product_id} className="hover:bg-[#fafcfb] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#013326]">{prod.product_id}</td>
                    <td className="p-4 font-extrabold text-[#013326]">{prod.name}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f1f6f3] text-[#013326] font-semibold text-[11px]">
                        {prod.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#013326]">{formatPrice(prod.price)}</td>
                    <td className="p-4 text-[11px] text-[#5c7167]">
                      {prod.category === "Electronics" && (
                        <span>
                          {prod.screen_size ? `Display: ${prod.screen_size}` : ""}{" "}
                          {prod.warranty ? `• Warranty: ${prod.warranty}` : ""}
                        </span>
                      )}
                      {prod.category === "Clothing" && (
                        <span>
                          {prod.size ? `Size: ${prod.size}` : ""}{" "}
                          {prod.colours ? `• Colors: ${prod.colours.join(", ")}` : ""}
                        </span>
                      )}
                      {prod.category === "Groceries" && (
                        <span>
                          {prod.weight ? `Net: ${prod.weight}` : ""}{" "}
                          {prod.expiry_date ? `• Exp: ${prod.expiry_date}` : ""}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eafaf4] text-[#0c835c]">
                        {prod.stock ?? 25} units
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/shop/${prod.product_id}`}
                        target="_blank"
                        className="inline-block p-1.5 rounded-lg text-[#5c7167] hover:bg-[#f1f6f3] hover:text-[#013326]"
                        title="View on Storefront"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.product_id, prod.name)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete from MongoDB"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
