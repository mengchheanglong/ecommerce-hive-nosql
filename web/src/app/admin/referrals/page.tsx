"use client";

import React from "react";
import { ReferralGraph } from "@/components/merchant/ReferralGraph";
import { Share2, Network, ShieldCheck } from "lucide-react";

export default function AdminReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Platform Admin</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">Social Referral Network</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
              <Share2 className="w-6 h-6 text-purple-600" />
              <span>Neo4j 3-Level Social Graph & Referral Rewards</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Index-free adjacency graph on Bolt protocol (Port 7687) • Multi-tier commission ledger (5% / 2% / 1%)
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
            <Network className="w-3.5 h-3.5 text-blue-600" />
            <span>Cypher Traversal O(1) Per Pointer Jump</span>
          </div>
        </div>
      </div>

      <ReferralGraph />
    </div>
  );
}
