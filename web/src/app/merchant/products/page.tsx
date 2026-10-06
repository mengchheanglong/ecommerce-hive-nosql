"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchProducts, deleteProduct, updateProduct } from "@/lib/api";
import { Product } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/shared/Modal";
import {
  Package,
  Plus,
  Search,
  Trash2,
  ExternalLink,
  Edit2,
  Save,
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

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editScreenSize, setEditScreenSize] = useState("");
  const [editWarranty, setEditWarranty] = useState("");
  const [editSize, setEditSize] = useState("");
  const [editColours, setEditColours] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editExpiryDate, setEditExpiryDate] = useState("");
  const [editDimensions, setEditDimensions] = useState("");
  const [editMaterial, setEditMaterial] = useState("");
  const [editVolume, setEditVolume] = useState("");
  const [editSkinType, setEditSkinType] = useState("");
  const [editArtisan, setEditArtisan] = useState("");
  const [editOriginProvince, setEditOriginProvince] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditPrice(prod.price.toString());
    setEditStock((prod.stock ?? 25).toString());
    setEditDescription(prod.description || "");
    setEditScreenSize(prod.screen_size || "");
    setEditWarranty(prod.warranty || "");
    setEditSize(prod.size || "");
    setEditColours(prod.colours ? prod.colours.join(", ") : "");
    setEditWeight(prod.weight || "");
    setEditExpiryDate(prod.expiry_date || "");
    setEditDimensions(prod.dimensions || "");
    setEditMaterial(prod.material || "");
    setEditVolume(prod.volume || "");
    setEditSkinType(prod.skin_type || "");
    setEditArtisan(prod.artisan || "");
    setEditOriginProvince(prod.origin_province || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const priceNum = parseFloat(editPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("Price must be a positive number", "warning");
      return;
    }

    const stockNum = parseInt(editStock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      showToast("Stock cannot be negative", "warning");
      return;
    }

    setSavingEdit(true);

    const updates: Partial<Product> = {
      name: editName.trim(),
      price: priceNum,
      stock: stockNum,
      description: editDescription.trim() || undefined,
    };

    if (editingProduct.category === "Electronics") {
      updates.screen_size = editScreenSize.trim() || undefined;
      updates.warranty = editWarranty.trim() || undefined;
    } else if (editingProduct.category === "Clothing" || editingProduct.category === "Fashion & Accessories") {
      updates.size = editSize.trim() || undefined;
      updates.colours = editColours
        ? editColours.split(",").map((c) => c.trim()).filter(Boolean)
        : undefined;
    } else if (editingProduct.category === "Groceries" || editingProduct.category === "Food & Groceries") {
      updates.weight = editWeight.trim() || undefined;
      updates.expiry_date = editExpiryDate.trim() || undefined;
    } else if (editingProduct.category === "Home & Living") {
      updates.dimensions = editDimensions.trim() || undefined;
      updates.material = editMaterial.trim() || undefined;
    } else if (editingProduct.category === "Beauty & Wellness") {
      updates.volume = editVolume.trim() || undefined;
      updates.skin_type = editSkinType.trim() || undefined;
    } else if (editingProduct.category === "Arts & Culture") {
      updates.artisan = editArtisan.trim() || undefined;
      updates.origin_province = editOriginProvince.trim() || undefined;
    }

    const res = await updateProduct(editingProduct.product_id, updates);
    setSavingEdit(false);

    if (res.success) {
      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === editingProduct.product_id ? { ...p, ...updates } : p
        )
      );
      setEditingProduct(null);
      showToast(`Product "${editName}" updated successfully in MongoDB!`, "success");
    } else {
      showToast(res.error || "Failed to update product", "error");
    }
  };

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
      .filter((p) => {
        if (selectedCategory === "All") return true;
        if (p.category === selectedCategory) return true;
        if (p.category_slug && p.category_slug.toLowerCase() === selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-")) return true;
        if (p.category_aliases && p.category_aliases.some((a) => a.toLowerCase() === selectedCategory.toLowerCase())) return true;
        if ((selectedCategory === "Food & Groceries" || selectedCategory === "Groceries") && (p.category === "Groceries" || p.category === "Food & Groceries" || p.category === "Food")) return true;
        if ((selectedCategory === "Fashion & Accessories" || selectedCategory === "Clothing") && (p.category === "Clothing" || p.category === "Fashion & Accessories" || p.category === "Fashion")) return true;
        return false;
      })
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Product Catalog & Inventory</h1>
          <p className="text-xs text-slate-500">
            MongoDB polymorphic document storage with custom attributes per category
          </p>
        </div>

        <Link
          href="/merchant/products/new"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            "All",
            "Electronics",
            "Food & Groceries",
            "Fashion & Accessories",
            "Home & Living",
            "Beauty & Wellness",
            "Arts & Culture",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100/80 border border-slate-200/80 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Polymorphic Attributes</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Loading catalog documents...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.product_id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="p-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 relative">
                          {prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {prod.name}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                            SKU: {prod.product_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200/60">
                        {prod.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">{formatPrice(prod.price)}</td>
                    <td className="p-3.5 text-[11px] text-slate-500 max-w-xs">
                      {prod.category === "Electronics" && (
                        <span>
                          {prod.screen_size ? `Display: ${prod.screen_size}` : ""}{" "}
                          {prod.warranty ? `• Warranty: ${prod.warranty}` : ""}
                        </span>
                      )}
                      {(prod.category === "Clothing" || prod.category === "Fashion & Accessories") && (
                        <span>
                          {prod.size ? `Size: ${prod.size}` : ""}{" "}
                          {prod.colours ? `• Colors: ${prod.colours.join(", ")}` : ""}
                        </span>
                      )}
                      {(prod.category === "Groceries" || prod.category === "Food & Groceries") && (
                        <span>
                          {prod.weight ? `Net: ${prod.weight}` : ""}{" "}
                          {prod.expiry_date ? `• Exp: ${prod.expiry_date}` : ""}
                        </span>
                      )}
                      {prod.category === "Home & Living" && (
                        <span>
                          {prod.dimensions ? `Dim: ${prod.dimensions}` : ""}{" "}
                          {prod.material ? `• Mat: ${prod.material}` : (prod.subcategory_name ? `• ${prod.subcategory_name}` : "")}
                        </span>
                      )}
                      {prod.category === "Beauty & Wellness" && (
                        <span>
                          {prod.volume ? `Vol: ${prod.volume}` : ""}{" "}
                          {prod.skin_type ? `• Type: ${prod.skin_type}` : (prod.subcategory_name ? `• ${prod.subcategory_name}` : "")}
                        </span>
                      )}
                      {prod.category === "Arts & Culture" && (
                        <span>
                          {prod.artisan ? `Artisan: ${prod.artisan}` : ""}{" "}
                          {prod.origin_province ? `• Prov: ${prod.origin_province}` : (prod.subcategory_name ? `• ${prod.subcategory_name}` : "")}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {prod.stock ?? 25} in stock
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="inline-block p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/shop/${prod.product_id}`}
                        target="_blank"
                        className="inline-block p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        title="View on Storefront"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.product_id, prod.name)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          title={`Edit Product: ${editingProduct.product_id}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Category</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  disabled
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-500 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-900 font-mono focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Stock Units</label>
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Polymorphic Specs based on category */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-900 block">
                {editingProduct.category} Technical Specifications
              </span>

              {editingProduct.category === "Electronics" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Display Size</label>
                    <input
                      type="text"
                      value={editScreenSize}
                      onChange={(e) => setEditScreenSize(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Warranty Term</label>
                    <input
                      type="text"
                      value={editWarranty}
                      onChange={(e) => setEditWarranty(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200/80"
                    />
                  </div>
                </div>
              )}

              {(editingProduct.category === "Clothing" || editingProduct.category === "Fashion & Accessories") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Garment Size</label>
                    <input
                      type="text"
                      value={editSize}
                      onChange={(e) => setEditSize(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Colors (comma separated)</label>
                    <input
                      type="text"
                      value={editColours}
                      onChange={(e) => setEditColours(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200/80"
                    />
                  </div>
                </div>
              )}

              {(editingProduct.category === "Groceries" || editingProduct.category === "Food & Groceries") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Net Weight</label>
                    <input
                      type="text"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={editExpiryDate}
                      onChange={(e) => setEditExpiryDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200/80"
                    />
                  </div>
                </div>
              )}

              {editingProduct.category === "Home & Living" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Dimensions</label>
                    <input
                      type="text"
                      value={editDimensions}
                      onChange={(e) => setEditDimensions(e.target.value)}
                      placeholder="e.g. 24cm x 18cm x 12cm"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Material</label>
                    <input
                      type="text"
                      value={editMaterial}
                      onChange={(e) => setEditMaterial(e.target.value)}
                      placeholder="e.g. Terracotta / Woven Rattan"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200/80"
                    />
                  </div>
                </div>
              )}

              {editingProduct.category === "Beauty & Wellness" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Net Volume</label>
                    <input
                      type="text"
                      value={editVolume}
                      onChange={(e) => setEditVolume(e.target.value)}
                      placeholder="e.g. 50ml Dropper Bottle"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Skin / Treatment Type</label>
                    <input
                      type="text"
                      value={editSkinType}
                      onChange={(e) => setEditSkinType(e.target.value)}
                      placeholder="e.g. Sensitive / Dry / All Skin"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200/80"
                    />
                  </div>
                </div>
              )}

              {editingProduct.category === "Arts & Culture" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Master Artisan / Cooperative</label>
                    <input
                      type="text"
                      value={editArtisan}
                      onChange={(e) => setEditArtisan(e.target.value)}
                      placeholder="e.g. Angkor Heritage Guild"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200/80"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Origin Province</label>
                    <input
                      type="text"
                      value={editOriginProvince}
                      onChange={(e) => setEditOriginProvince(e.target.value)}
                      placeholder="e.g. Siem Reap, Kampong Chhnang"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200/80"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Description</label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center space-x-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-white" />
                <span>{savingEdit ? "Updating MongoDB..." : "Save Product Changes"}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
