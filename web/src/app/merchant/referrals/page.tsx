"use client";

import React from "react";
import { ReferralGraph } from "@/components/merchant/ReferralGraph";

export default function MerchantReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#013326]">Neo4j 3-Level Referral Reward Network</h1>
        <p className="text-xs text-[#5c7167]">
          Index-free adjacency social graph with 3-tier commission rewards (Tier 1: 5%, Tier 2: 3%, Tier 3: 1%)
        </p>
      </div>

      <ReferralGraph />
    </div>
  );
}
