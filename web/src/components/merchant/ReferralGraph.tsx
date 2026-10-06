"use client";

import React from "react";
import { INITIAL_REFERRALS } from "@/lib/data";
import { Share2, Users, DollarSign, Award, ArrowRight } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export function ReferralGraph() {
  const { formatPrice } = useCurrency();

  const tier1 = INITIAL_REFERRALS.filter((r) => r.level === 1);
  const tier2 = INITIAL_REFERRALS.filter((r) => r.level === 2);
  const tier3 = INITIAL_REFERRALS.filter((r) => r.level === 3);

  const totalRewardsUSD = INITIAL_REFERRALS.reduce((acc, cur) => acc + cur.earned, 0);
  const totalVolumeUSD = INITIAL_REFERRALS.reduce((acc, cur) => acc + cur.spend, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-card">
          <span className="text-[11px] font-bold text-[#5c7167] uppercase tracking-wider block">
            Referral Network Depth
          </span>
          <p className="text-2xl font-black text-[#013326] mt-1">3 Hops (Index-Free)</p>
          <p className="text-xs text-[#0c835c] mt-1 font-semibold">Traversed in &lt;1.8ms</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-card">
          <span className="text-[11px] font-bold text-[#5c7167] uppercase tracking-wider block">
            Referred Gross Spend
          </span>
          <p className="text-2xl font-black text-[#013326] mt-1">{formatPrice(totalVolumeUSD)}</p>
          <p className="text-xs text-[#5c7167] mt-1">{INITIAL_REFERRALS.length} active customer nodes</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-card">
          <span className="text-[11px] font-bold text-[#5c7167] uppercase tracking-wider block">
            Total Commission Paid
          </span>
          <p className="text-2xl font-black text-[#0c835c] mt-1">{formatPrice(totalRewardsUSD)}</p>
          <p className="text-xs text-[#5c7167] mt-1">Multi-tier commission distributed</p>
        </div>
      </div>

      {/* Tier Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level 1 */}
        <div className="bg-white rounded-3xl p-6 border border-[#e2eae5] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2eae5]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#15c089]" />
              <h4 className="text-sm font-extrabold text-[#013326]">Tier 1: Direct Invites</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#eafaf4] text-[#0c835c] font-bold text-xs">
              5% Reward
            </span>
          </div>
          <p className="text-xs text-[#5c7167]">Directly referred by anchor customer Sokha Meas (C0457)</p>

          <div className="space-y-3">
            {tier1.map((node) => (
              <div key={node.id} className="p-4 rounded-2xl bg-[#fafcfb] border border-[#e2eae5] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#013326]">{node.name}</span>
                  <span className="text-[11px] font-mono font-bold text-[#0c835c]">+{formatPrice(node.earned)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#5c7167]">
                  <span>ID: {node.id} • {node.city}</span>
                  <span>Spend: {formatPrice(node.spend)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 2 */}
        <div className="bg-white rounded-3xl p-6 border border-[#e2eae5] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2eae5]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h4 className="text-sm font-extrabold text-[#013326]">Tier 2: 2nd-Degree Friends</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
              3% Reward
            </span>
          </div>
          <p className="text-xs text-[#5c7167]">Invited by Tier 1 nodes via social referral links</p>

          <div className="space-y-3">
            {tier2.map((node) => (
              <div key={node.id} className="p-4 rounded-2xl bg-[#fafcfb] border border-[#e2eae5] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#013326]">{node.name}</span>
                  <span className="text-[11px] font-mono font-bold text-blue-700">+{formatPrice(node.earned)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#5c7167]">
                  <span>ID: {node.id} • {node.city}</span>
                  <span>Spend: {formatPrice(node.spend)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 3 */}
        <div className="bg-white rounded-3xl p-6 border border-[#e2eae5] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2eae5]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h4 className="text-sm font-extrabold text-[#013326]">Tier 3: 3rd-Degree Friends</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-xs">
              1% Reward
            </span>
          </div>
          <p className="text-xs text-[#5c7167]">Extended social graph connections (Hop 3 in Cypher traversal)</p>

          <div className="space-y-3">
            {tier3.map((node) => (
              <div key={node.id} className="p-4 rounded-2xl bg-[#fafcfb] border border-[#e2eae5] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#013326]">{node.name}</span>
                  <span className="text-[11px] font-mono font-bold text-amber-700">+{formatPrice(node.earned)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#5c7167]">
                  <span>ID: {node.id} • {node.city}</span>
                  <span>Spend: {formatPrice(node.spend)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
