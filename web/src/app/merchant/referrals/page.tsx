"use client";

import React from "react";
import Link from "next/link";
import { Share2, ShieldCheck, ArrowRight } from "lucide-react";

export default function MerchantReferralsRedirect() {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs max-w-2xl mx-auto text-center space-y-6 my-8">
      <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
        <Share2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Promoted to Platform HQ
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Neo4j 3-Level Referral Reward Network
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
          The platform-wide social referral tree, index-free adjacency graph traversals, and multi-tier commission governance have been relocated to the <strong>Platform Administration HQ</strong>.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/admin/referrals"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Open Platform Admin Referral Graph</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
