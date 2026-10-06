"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_CUSTOMER } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Modal } from "@/components/shared/Modal";
import { useLocation, DeliveryProvince } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";
import { DeliveryAddress } from "@/types";
import {
  User,
  MapPin,
  Plus,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Award,
  Package,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  Calculator,
  TrendingUp,
  Sparkles,
  Zap,
  LogOut,
  Store,
  Pencil,
  Trash2,
} from "lucide-react";

export default function AccountProfilePage() {
  const { user, isAuthenticated, setIsSignInModalOpen, loginAsDemoCustomer, loginAsDemoMerchant, logout } = useAuth();
  const [customer, setCustomer] = useState(INITIAL_CUSTOMER);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("Phnom Penh");
  const [copied, setCopied] = useState(false);

  // Commission calculator state (network monthly spending estimate)
  const [calcSpend, setCalcSpend] = useState(2500);

  const { showToast } = useToast();
  const { formatPrice } = useCurrency();
  const { selectedProvince, setSelectedProvince } = useLocation();

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newStreet) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      street: newStreet,
      city: newCity,
      isDefault: false,
    };
    setCustomer((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddr],
    }));
    if (newCity === "Phnom Penh" || newCity === "Siem Reap" || newCity === "Battambang") {
      setSelectedProvince(newCity as DeliveryProvince);
    }
    setIsAddModalOpen(false);
    setNewLabel("");
    setNewStreet("");
    showToast(`Address added and switched delivery hub to ${newCity}`, "success");
  };

  // Edit address state & handlers for complete CRUD
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editCity, setEditCity] = useState("Phnom Penh");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const startEditAddress = (addr: DeliveryAddress) => {
    setEditingAddress(addr);
    setEditLabel(addr.label);
    setEditStreet(addr.street);
    setEditCity(addr.city);
    setIsEditModalOpen(true);
  };

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress || !editLabel || !editStreet) return;

    setCustomer((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) =>
        (a.id && a.id === editingAddress.id) ||
        (a.label === editingAddress.label && a.street === editingAddress.street)
          ? { ...a, label: editLabel, street: editStreet, city: editCity }
          : a
      ),
    }));

    if (
      selectedProvince === editingAddress.city &&
      (editCity === "Phnom Penh" || editCity === "Siem Reap" || editCity === "Battambang")
    ) {
      setSelectedProvince(editCity as DeliveryProvince);
    }

    setIsEditModalOpen(false);
    setEditingAddress(null);
    showToast(`Updated address "${editLabel}"`, "success");
  };

  const handleDeleteAddress = (addr: DeliveryAddress) => {
    if (customer.addresses.length <= 1) {
      showToast("Cannot delete your primary address", "warning");
      return;
    }
    setCustomer((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) =>
        a.id ? a.id !== addr.id : a.label !== addr.label || a.street !== addr.street
      ),
    }));
    showToast(`Deleted address "${addr.label}"`, "info");
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://rentify.kh/ref/${customer.referral_code}`);
    setCopied(true);
    showToast("Referral link copied to clipboard", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  // Loyalty calculations
  const nextTierPoints = 1000;
  const loyaltyProgress = Math.min(100, Math.round((customer.loyalty_points / nextTierPoints) * 100));

  // Commission calculator metrics
  const tier1Earned = calcSpend * 0.05;
  const tier2Earned = calcSpend * 1.5 * 0.03;
  const tier3Earned = calcSpend * 2.5 * 0.01;
  const totalEstimatedMonthlyRewards = tier1Earned + tier2Earned + tier3Earned;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Profile Header Card */}
      {!isAuthenticated || !user ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-2xl border border-slate-200">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome, Guest Shopper
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  Guest Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-lg">
                Sign in to manage your addresses, accumulate VIP Gold loyalty points, and unlock instant Neo4j referral cash payouts.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
            <button
              onClick={loginAsDemoCustomer}
              className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Demo Customer (Sokha)</span>
            </button>
            <button
              onClick={loginAsDemoMerchant}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
            >
              <Store className="w-3.5 h-3.5 text-blue-400" />
              <span>Demo Merchant</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-xl shadow-md border border-slate-800">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  ⭐ {user.tier}
                </span>
                {user.role === "merchant" && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    Store Admin
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{user.phone}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user.email}</span>
                </span>
                <span>•</span>
                <span className="font-mono">ID: {user.id}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Loyalty Points Progress Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 min-w-[240px] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Loyalty Tier Status</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{user.loyalty_points} pts</span>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${loyaltyProgress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>Current: {user.tier}</span>
                <span>Next: Platinum ({Math.max(0, nextTierPoints - user.loyalty_points)} pts left)</span>
              </div>
            </div>

            {/* Actions: Sign Out / Merchant Hub */}
            <div className="flex flex-col gap-2 shrink-0">
              {user.role === "merchant" && (
                <Link
                  href="/merchant"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center space-x-1 shadow-xs"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Open Merchant Hub</span>
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-semibold transition-all border border-slate-200 cursor-pointer flex items-center justify-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Saved Addresses & Social Referral Program */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Saved Addresses Column */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Saved Delivery Locations</h3>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Add Address</span>
            </button>
          </div>

          <div className="space-y-3">
            {customer.addresses.map((addr, idx) => (
              <div
                key={addr.id || idx}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-start justify-between gap-3 group hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{addr.label}</span>
                    {selectedProvince === addr.city ? (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Active Hub
                      </span>
                    ) : addr.isDefault ? (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-600 truncate">{addr.street}</p>
                  <p className="text-xs font-semibold text-slate-900">{addr.city}, Cambodia</p>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  {selectedProvince !== addr.city &&
                    (addr.city === "Phnom Penh" || addr.city === "Siem Reap" || addr.city === "Battambang") && (
                      <button
                        onClick={() => {
                          setSelectedProvince(addr.city as DeliveryProvince);
                          showToast(`Active delivery hub switched to ${addr.city}`, "success");
                        }}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer transition-colors"
                      >
                        Set Active
                      </button>
                    )}
                  <button
                    onClick={() => startEditAddress(addr)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Edit address"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/orders"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold text-center block transition-colors"
            >
              View Order Tracking History →
            </Link>
          </div>
        </div>

        {/* Neo4j Referral Network & Interactive Commission Calculator */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Neo4j Social Referral Network</h3>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
              Index-Free Graph
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Invite friends to shop on Rentify. When they purchase, our Neo4j graph engine traverses your multi-tier network with sub-millisecond latency to deposit instant passive rewards.
          </p>

          {/* Referral Code Copy Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Your Universal Referral Link
            </span>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold font-mono text-slate-900">{customer.referral_code}</span>
              <button
                onClick={copyReferralCode}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center space-x-1 cursor-pointer transition-colors shadow-xs active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          {/* INTERACTIVE MULTI-TIER COMMISSION CALCULATOR */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Multi-Tier Earnings Simulator
                </h4>
              </div>
              <span className="text-[11px] font-mono text-blue-400 font-bold">
                {formatPrice(totalEstimatedMonthlyRewards)} / month
              </span>
            </div>

            {/* Spending Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Network Spend / Month:</span>
                <span className="font-mono font-bold text-blue-400">{formatPrice(calcSpend)}</span>
              </div>
              <input
                type="range"
                min={200}
                max={10000}
                step={100}
                value={calcSpend}
                onChange={(e) => setCalcSpend(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$200</span>
                <span>$5,000</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Multi-Tier Graph Breakdown */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Tier 1 (5%)</span>
                <span className="font-bold text-white text-[11px]">Direct Friends</span>
                <p className="font-mono font-bold text-blue-400">{formatPrice(tier1Earned)}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Tier 2 (3%)</span>
                <span className="font-bold text-white text-[11px]">2nd Degree</span>
                <p className="font-mono font-bold text-blue-400">{formatPrice(tier2Earned)}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Tier 3 (1%)</span>
                <span className="font-bold text-white text-[11px]">Extended Circle</span>
                <p className="font-mono font-bold text-blue-400">{formatPrice(tier3Earned)}</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              ⚡ Powered by Neo4j index-free adjacency graph traversals across customer nodes with zero SQL table joins.
            </p>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Delivery Location"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Location Label</label>
            <input
              type="text"
              placeholder="e.g. Vacation Villa, Warehouse"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Province / City</label>
            <select
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
            >
              <option value="Phnom Penh">Phnom Penh</option>
              <option value="Siem Reap">Siem Reap</option>
              <option value="Battambang">Battambang</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              placeholder="e.g. Street 310, Sangkat Boeung Keng Kang"
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Save Address
          </button>
        </form>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAddress(null);
        }}
        title="Edit Delivery Address"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleUpdateAddress} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Location Label</label>
            <input
              type="text"
              placeholder="e.g. Vacation Villa, Warehouse"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Province / City</label>
            <select
              value={editCity}
              onChange={(e) => setEditCity(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none"
            >
              <option value="Phnom Penh">Phnom Penh</option>
              <option value="Siem Reap">Siem Reap</option>
              <option value="Battambang">Battambang</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              placeholder="e.g. Street 310, Sangkat Boeung Keng Kang"
              value={editStreet}
              onChange={(e) => setEditStreet(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingAddress(null);
              }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Update Address
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
