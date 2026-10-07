"use client";

import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, ArrowRight } from "lucide-react";

export default function MerchantFleetRedirect() {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs max-w-2xl mx-auto text-center space-y-6 my-8">
      <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
        <Truck className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Promoted to Platform HQ
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Cassandra 800-Rider Fleet Telemetry
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
          The 800-courier live telemetry console and Cassandra LSM ring (160 writes/sec) have been segregated into the dedicated <strong>Platform Administration HQ</strong> to reflect realistic marketplace operations.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/admin/fleet"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Open Platform Admin Fleet Console</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
