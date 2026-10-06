"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_CUSTOMER } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/shared/Modal";
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
} from "lucide-react";

export default function AccountProfilePage() {
  const [customer, setCustomer] = useState(INITIAL_CUSTOMER);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("Phnom Penh");
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

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
    setIsAddModalOpen(false);
    setNewLabel("");
    setNewStreet("");
    showToast("Address added to your account profile", "success");
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://marketplace.kh/ref/${customer.referral_code}`);
    setCopied(true);
    showToast("Referral link copied to clipboard", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eae5] shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-3xl bg-[#013326] text-white flex items-center justify-center font-black text-xl shadow-md">
            SM
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#013326]">{customer.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eafaf4] text-[#0c835c] border border-[#9cf0ce]">
                {customer.tier}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5c7167]">
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

        <div className="flex items-center space-x-3 bg-[#f6faf8] p-4 rounded-2xl border border-[#e2eae5] self-stretch md:self-auto justify-between md:justify-start">
          <div className="w-10 h-10 rounded-xl bg-[#eafaf4] text-[#0c835c] flex items-center justify-center">
            <Award className="w-5 h-5 text-[#15c089]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#5c7167] uppercase tracking-wider">Loyalty Points</p>
            <p className="text-xl font-black text-[#013326]">{customer.loyalty_points} Points</p>
          </div>
        </div>
      </div>

      {/* Grid: Saved Addresses & Social Referral Program */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Saved Addresses Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#e2eae5] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f6f3]">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#15c089]" />
              <h3 className="text-base font-extrabold text-[#013326]">Saved Delivery Locations</h3>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#013326] text-white text-xs font-bold hover:bg-[#0a4636] flex items-center space-x-1 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#15c089]" />
              <span>Add Address</span>
            </button>
          </div>

          <div className="space-y-3">
            {customer.addresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-[#e2eae5] bg-[#fafcfb] flex items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#013326]">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-[#0c835c] bg-[#eafaf4] px-2 py-0.5 rounded-full border border-[#9cf0ce]">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5c7167]">{addr.street}</p>
                  <p className="text-xs font-semibold text-[#013326]">{addr.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Neo4j Referral Network Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#e2eae5] shadow-card space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#f1f6f3]">
            <Share2 className="w-5 h-5 text-[#15c089]" />
            <h3 className="text-base font-extrabold text-[#013326]">Neo4j Referral Rewards</h3>
          </div>

          <p className="text-xs text-[#5c7167] leading-relaxed">
            Invite friends to shop and earn up to 5% commission on their purchases through our Neo4j graph social network.
          </p>

          <div className="p-4 bg-[#f6faf8] rounded-2xl border border-[#e2eae5] space-y-2">
            <span className="text-[11px] font-bold text-[#5c7167] uppercase tracking-wider block">
              Your Referral Code
            </span>
            <div className="flex items-center justify-between">
              <span className="text-base font-black font-mono text-[#013326]">{customer.referral_code}</span>
              <button
                onClick={copyReferralCode}
                className="px-3 py-1.5 rounded-xl bg-[#013326] text-white text-xs font-bold hover:bg-[#0a4636] flex items-center space-x-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#15c089]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#f1f6f3]">
              <span className="text-[#5c7167]">Level 1 (Direct Friends)</span>
              <span className="font-bold text-[#0c835c]">5% Commission</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#f1f6f3]">
              <span className="text-[#5c7167]">Level 2 (Friends of Friends)</span>
              <span className="font-bold text-[#0c835c]">3% Commission</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#5c7167]">Level 3 (Extended Circle)</span>
              <span className="font-bold text-[#0c835c]">1% Commission</span>
            </div>
          </div>

          <Link
            href="/orders"
            className="w-full py-3 rounded-2xl bg-[#f1f6f3] text-[#013326] text-xs font-bold text-center block hover:bg-[#e2eae5] transition-colors"
          >
            View My Order History →
          </Link>
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
            <label className="block text-xs font-bold text-[#013326] mb-1">Location Label</label>
            <input
              type="text"
              placeholder="e.g. Vacation Villa, Warehouse"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#013326] mb-1">Province / City</label>
            <select
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326]"
            >
              <option value="Phnom Penh">Phnom Penh</option>
              <option value="Siem Reap">Siem Reap</option>
              <option value="Battambang">Battambang</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#013326] mb-1">Street Address</label>
            <input
              type="text"
              placeholder="e.g. Street 310, Sangkat Boeung Keng Kang"
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#f1f6f3] border border-[#e2eae5] text-[#013326]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#013326] hover:bg-[#0a4636] text-white text-xs font-bold transition-all"
          >
            Save Address
          </button>
        </form>
      </Modal>
    </div>
  );
}
