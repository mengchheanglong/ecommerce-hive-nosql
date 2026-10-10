"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchProducts, deleteProduct, updateProduct, syncCatalogWithSupplyChain } from "@/lib/api";
import { SUPPLY_CHAIN_WAREHOUSE_SKUS } from "@/lib/supply-chain-sync";
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
  Boxes,
  RefreshCw,
  ShieldCheck,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

export default function MerchantProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterMode, setFilterMode] = useState<"all" | "needs_image" | "published">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isReconciling, setIsReconciling] = useState(false);
  const [lastReconciled, setLastReconciled] = useState("Just now");
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleReconcileWithSupplyChain = async () => {
    setIsReconciling(true);
    const syncRes = await syncCatalogWithSupplyChain();
    await loadData();
    setLastReconciled(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    setIsReconciling(false);

    if (syncRes.newCount > 0) {
      showToast(`Imported ${syncRes.newCount} new warehouse items from Supply Chain Platform (:3100)! Awaiting storefront imagery.`, "success");
    } else {
      showToast(`Synchronized ${syncRes.syncedCount} warehouse SKUs from Supply Chain Platform (:3100) ledger.`, "success");
    }
  };

  useEffect(() => {
    const init = async () => {
      await syncCatalogWithSupplyChain();
      await loadData();
    };
    init();
  }, []);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editImage, setEditImage] = useState("");
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

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditPrice(prod.price.toString());
    setEditStock((prod.stock ?? 25).toString());
    setEditImage(prod.image || "");
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

  const matchingWhSku = useMemo(() => {
    if (!editingProduct) return null;
    return SUPPLY_CHAIN_WAREHOUSE_SKUS.find((s) => s.product_id === editingProduct.product_id) || null;
  }, [editingProduct]);

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

    const hasNewImage = !!editImage.trim();

    const updates: Partial<Product> = {
      name: editName.trim(),
      price: priceNum,
      stock: stockNum,
      image: editImage.trim() || undefined,
      status: hasNewImage ? "active" : editingProduct.status,
      needs_image: !hasNewImage,
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

      if (!editingProduct.image && hasNewImage) {
        showToast(`Product "${editName}" is now PUBLISHED live on the storefront with image!`, "success");
      } else {
        showToast(`Product "${editName}" updated successfully!`, "success");
      }
    } else {
      showToast(res.error || "Failed to update product", "error");
    }
  };

  const handleDelete = async (productId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from catalog?`)) return;
    const res = await deleteProduct(productId);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.product_id !== productId));
      showToast(`Product "${name}" removed from catalog`, "info");
    } else {
      showToast("Error deleting product", "error");
    }
  };

  // Metrics
  const totalCount = products.length;
  const needsImageCount = useMemo(() => products.filter((p) => !p.image || p.image.trim() === "").length, [products]);
  const publishedCount = useMemo(() => products.filter((p) => !!p.image && p.image.trim() !== "").length, [products]);
  const totalLedgerStock = useMemo(() => products.reduce((acc, p) => acc + (p.stock || 0), 0), [products]);

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        if (filterMode === "needs_image") return !p.image || p.image.trim() === "";
        if (filterMode === "published") return !!p.image && p.image.trim() !== "";
        return true;
      })
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
  }, [products, filterMode, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Product Catalog & Merchandising</h1>
          <p className="text-xs text-slate-500">
            Physical items and ledger inventory synced with Supply Chain Platform (:3100)
          </p>
        </div>

        <Link
          href="/merchant/products/new"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Custom Product</span>
        </Link>
      </div>

      {/* Supply Chain Integration Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-white">Supply Chain Platform Ledger Sync</span>
              <span className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>CONNECTED :3100</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Physical inventory is governed by the PostGIS warehouse ledger at <strong className="text-emerald-400">WH-PP-01 (Daun Penh Hub)</strong>. Warehouse items import automatically; add storefront photos and retail prices to publish. Last sync: {lastReconciled}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleReconcileWithSupplyChain}
            disabled={isReconciling}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isReconciling ? "animate-spin" : ""}`} />
            <span>Sync Warehouse Items (:3100)</span>
          </button>

          <a
            href="http://localhost:3101"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
          >
            <span>Supply Chain Ops (:3101)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Stat Cards & Quick Filter Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterMode("all")}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterMode === "all"
              ? "bg-white border-blue-500 shadow-xs ring-1 ring-blue-500"
              : "bg-white border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Catalog</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-black text-slate-900">{totalCount}</span>
            <span className="text-xs text-slate-500">items</span>
          </div>
        </button>

        <button
          onClick={() => setFilterMode("needs_image")}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterMode === "needs_image"
              ? "bg-amber-50/80 border-amber-500 shadow-xs ring-1 ring-amber-500"
              : "bg-white border-slate-200/80 hover:border-amber-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Needs Storefront Photo</span>
            {needsImageCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-black text-amber-900">{needsImageCount}</span>
            <span className="text-xs text-amber-700 font-semibold">awaiting image</span>
          </div>
        </button>

        <button
          onClick={() => setFilterMode("published")}
          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
            filterMode === "published"
              ? "bg-emerald-50/80 border-emerald-500 shadow-xs ring-1 ring-emerald-500"
              : "bg-white border-slate-200/80 hover:border-emerald-300"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Live on Storefront</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-black text-emerald-900">{publishedCount}</span>
            <span className="text-xs text-emerald-700 font-semibold">ready & imaged</span>
          </div>
        </button>

        <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Warehouse ATP Stock</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-black text-slate-900 font-mono">{totalLedgerStock.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-medium">ledger units</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center space-x-1 pr-2 border-r border-slate-200">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterMode === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilterMode("needs_image")}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
                filterMode === "needs_image"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60"
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span>Needs Photo ({needsImageCount})</span>
            </button>
            <button
              onClick={() => setFilterMode("published")}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
                filterMode === "published"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60"
              }`}
            >
              <Check className="w-3 h-3" />
              <span>Live ({publishedCount})</span>
            </button>
          </div>

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

        <div className="relative md:w-64">
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
                <th className="p-3.5">Retail Price</th>
                <th className="p-3.5">Merchandising Status</th>
                <th className="p-3.5">
                  <div className="flex items-center space-x-1">
                    <span>Warehouse Stock</span>
                    <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      ATP
                    </span>
                  </div>
                </th>
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
                  <tr
                    key={prod.product_id}
                    className={`hover:bg-slate-50/70 transition-colors group ${
                      !prod.image ? "bg-amber-50/20" : ""
                    }`}
                  >
                    <td className="p-3.5">
                      <div className="flex items-center space-x-3">
                        {prod.image ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 relative">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openEditModal(prod)}
                            className="w-12 h-12 rounded-xl border border-dashed border-amber-300 bg-amber-50 hover:bg-amber-100 flex flex-col items-center justify-center text-amber-700 transition cursor-pointer group/img shrink-0"
                            title="Click to add storefront photo"
                          >
                            <ImageIcon className="w-4 h-4 text-amber-600 group-hover/img:scale-110 transition" />
                            <span className="text-[8px] font-bold text-amber-800 mt-0.5">+ Photo</span>
                          </button>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {prod.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-mono text-slate-400">
                              SKU: {prod.product_id}
                            </span>
                            {prod.synced_from_supply_chain && (
                              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                📦 Synced from {prod.warehouse_facility || "WH-PP-01"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200/60">
                        {prod.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">{formatPrice(prod.price)}</td>
                    <td className="p-3.5">
                      {!prod.image ? (
                        <button
                          type="button"
                          onClick={() => openEditModal(prod)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-300 transition cursor-pointer"
                        >
                          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Needs Photo</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Published</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{prod.stock ?? 25} in stock</span>
                        </span>
                        <span className="block text-[10px] font-mono text-slate-400">
                          {prod.warehouse_facility || "WH-PP-01 • Zone A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {!prod.image ? (
                        <button
                          type="button"
                          onClick={() => openEditModal(prod)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs inline-flex items-center space-x-1.5 shadow-xs cursor-pointer transition"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-white" />
                          <span>Add Image</span>
                        </button>
                      ) : (
                        <>
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
                            title="Delete from Catalog"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product & Add Image Modal */}
      {editingProduct && (
        <Modal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          title={!editingProduct.image ? `Add Storefront Image: ${editingProduct.product_id}` : `Edit Product: ${editingProduct.product_id}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            {/* Informational Callout for Warehouse-Synced SKU */}
            {!editingProduct.image && (
              <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200/90 flex items-start space-x-2.5 text-xs text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-amber-900">Warehouse SKU Synced from Supply Chain Platform (:3100)</span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Physical inventory ({editingProduct.stock} units at {editingProduct.warehouse_facility || "WH-PP-01"}) is governed by the PostGIS ledger. Add a marketing photo URL and adjust retail price below to publish this item live to your storefront.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Product Title</label>
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
                <label className="block font-bold text-slate-900 mb-1">Retail Selling Price (USD)</label>
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-900">Physical Stock (ATP)</label>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200/80">
                    PostGIS Ledger
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs">
                  <span>Available:</span>
                  <span className="font-bold text-slate-900">{editStock} units</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Governed by {editingProduct.warehouse_facility || "WH-PP-01"}.
                </p>
              </div>
            </div>

            {/* Storefront Marketing Image Asset */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-900">Storefront Product Image URL</label>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-bold border border-blue-200/80">
                  Merchant Asset
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
                  {editImage.trim() ? (
                    <img
                      src={editImage.trim()}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-7 h-7 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or CDN image URL"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200/80 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    High-res marketing photo for customer storefront. Physical SKU dimensions & weight are tracked in warehouse inventory.
                  </p>
                </div>
              </div>

              {/* Sample Photo Suggestion */}
              {matchingWhSku && !editImage.trim() && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Recommended photo for this SKU:</span>
                  <button
                    type="button"
                    onClick={() => setEditImage(matchingWhSku.sample_image)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Use Sample Photo ({matchingWhSku.sample_image_label})</span>
                  </button>
                </div>
              )}
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
              <label className="block font-bold text-slate-900 mb-1">Storefront Description</label>
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
                className={`px-5 py-2 rounded-xl text-white font-bold flex items-center space-x-1.5 shadow-sm cursor-pointer disabled:opacity-50 transition ${
                  !editingProduct.image && editImage.trim()
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {!editingProduct.image && editImage.trim() ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>{savingEdit ? "Publishing to Storefront..." : "Publish to Storefront"}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-white" />
                    <span>{savingEdit ? "Saving..." : "Save Product Changes"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
