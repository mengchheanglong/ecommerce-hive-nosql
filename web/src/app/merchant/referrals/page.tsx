"use client";

import React from "react";
import { ReferralGraph } from "@/components/merchant/ReferralGraph";

export default function MerchantReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium mb-1">
          <span>Merchant Console</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Social Referrals</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Neo4j 3-Level Referral Reward Network</h1>
        <p className="text-xs text-slate-500">
          Index-free adjacency social graph with 3-tier commission rewards (Tier 1: 5%, Tier 2: 3%, Tier 3: 1%)
        </p>
      </div>

      <ReferralGraph />
    </div>
  );
}
