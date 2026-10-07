"use client";

import React, { useState } from "react";
import { STORE_TENANTS, getStoreTenants } from "@/lib/data";
import { StoreTenant } from "@/types";
import { useToast } from "@/context/ToastContext";
import {
  Store,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Plus,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
} from "lucide-react";

export default function AdminStoresPage() {
  const [stores, setStores] = useState<StoreTenant[]>(STORE_TENANTS);
  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const { showToast } = useToast();

  const filteredStores = stores.filter((s) => {
    const matchesProvince = provinceFilter === "All" || s.province === provinceFilter;
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    const matchesSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.owner.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchesProvince && matchesStatus && matchesSearch;
  });

  const handleApproveStore = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, status: "Active" } : s))
    );
    showToast(`Store ${storeId} verified and activated!`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Platform Admin</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Stores Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Multi-Tenant Store Directory
          </h1>
          <p className="text-xs text-slate-500">
            Governing {stores.length} merchant stores and their catalog operations across Cambodia
          </p>
        </div>

        <button
          onClick={() => showToast("Tenant onboarding portal link generated", "info")}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Invite New Store</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search stores, owners, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* Province Filter */}
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-medium outline-none cursor-pointer"
          >
            <option value="All">All Provinces</option>
            <option value="Phnom Penh">Phnom Penh</option>
            <option value="Siem Reap">Siem Reap</option>
            <option value="Battambang">Battambang</option>
            <option value="Kandal">Kandal</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-medium outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending KYC">Pending KYC</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50/70">
                <th className="py-3 px-4 font-bold">Store & Category</th>
                <th className="py-3 px-4 font-bold">Location</th>
                <th className="py-3 px-4 font-bold">Merchant Contact</th>
                <th className="py-3 px-4 font-bold">Catalog Size</th>
                <th className="py-3 px-4 font-bold">Total Sales</th>
                <th className="py-3 px-4 font-bold">KYC Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Store Name & Category */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block">{store.name}</span>
                      <span className="text-[11px] text-slate-500">{store.category}</span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{store.province}</span>
                    </div>
                  </td>

                  {/* Merchant Contact */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-900 block">{store.owner}</span>
                      <span className="text-[11px] text-slate-500 font-mono block">{store.phone}</span>
                    </div>
                  </td>

                  {/* Catalog Size */}
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-slate-900">{store.products_count}</span>
                    <span className="text-slate-400 text-[11px]"> items</span>
                  </td>

                  {/* Total Sales */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ${store.revenue_usd.toLocaleString()}
                  </td>

                  {/* KYC Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        store.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : store.status === "Pending KYC"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {store.status === "Active" ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{store.status}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    {store.status === "Pending KYC" ? (
                      <button
                        onClick={() => handleApproveStore(store.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Approve KYC
                      </button>
                    ) : (
                      <button
                        onClick={() => showToast(`Audit log opened for ${store.name}`, "info")}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Inspect Store
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
