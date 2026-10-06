"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_CUSTOMER } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Modal } from "@/components/shared/Modal";
import { useLocation, DeliveryProvince } from "@/context/LocationContext";
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
} from "lucide-react";

export default function AccountProfilePage() {
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-xl shadow-md border border-slate-800">
            SM
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {customer.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                ⭐ {customer.tier}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{customer.phone}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{customer.email}</span>
              </span>
              <span>•</span>
              <span className="font-mono">ID: {customer._id}</span>
            </div>
          </div>
        </div>

        {/* Loyalty Points Progress Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 self-stretch md:self-auto min-w-[240px] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Loyalty Tier Status</span>
            </div>
            <span className="font-mono font-bold text-slate-900">{customer.loyalty_points} pts</span>
          </div>

          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${loyaltyProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>Current: VIP Gold</span>
            <span>Next: VIP Platinum ({nextTierPoints - customer.loyalty_points} pts left)</span>
          </div>
        </div>
      </div>

      {/* Grid: Saved Addresses & Social Referral Program */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Saved Addresses Column */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Saved Delivery Locations</h3>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add Address</span>
            </button>
          </div>

          <div className="space-y-3">
            {customer.addresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{addr.label}</span>
                    {selectedProvince === addr.city ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Active Delivery Hub
                      </span>
                    ) : addr.isDefault ? (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-600">{addr.street}</p>
                  <p className="text-xs font-semibold text-slate-900">{addr.city}, Cambodia</p>
                </div>
                {selectedProvince !== addr.city &&
                  (addr.city === "Phnom Penh" || addr.city === "Siem Reap" || addr.city === "Battambang") && (
                    <button
                      onClick={() => {
                        setSelectedProvince(addr.city as DeliveryProvince);
                        showToast(`Active delivery hub switched to ${addr.city}`, "success");
                      }}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer shrink-0 transition-colors"
                    >
                      Set Active
                    </button>
                  )}
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
              <Share2 className="w-5 h-5 text-emerald-600" />
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
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center space-x-1 cursor-pointer transition-colors shadow-xs active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          {/* INTERACTIVE MULTI-TIER COMMISSION CALCULATOR */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Multi-Tier Earnings Simulator
                </h4>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {formatPrice(totalEstimatedMonthlyRewards)} / month
              </span>
            </div>

            {/* Spending Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Network Spend / Month:</span>
                <span className="font-mono font-bold text-emerald-400">{formatPrice(calcSpend)}</span>
              </div>
              <input
                type="range"
                min={200}
                max={10000}
                step={100}
                value={calcSpend}
                onChange={(e) => setCalcSpend(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
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
                <p className="font-mono font-bold text-emerald-400">{formatPrice(tier1Earned)}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Tier 2 (3%)</span>
                <span className="font-bold text-white text-[11px]">2nd Degree</span>
                <p className="font-mono font-bold text-emerald-400">{formatPrice(tier2Earned)}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Tier 3 (1%)</span>
                <span className="font-bold text-white text-[11px]">Extended Circle</span>
                <p className="font-mono font-bold text-emerald-400">{formatPrice(tier3Earned)}</p>
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
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Save Address
          </button>
        </form>
      </Modal>
    </div>
  );
}
