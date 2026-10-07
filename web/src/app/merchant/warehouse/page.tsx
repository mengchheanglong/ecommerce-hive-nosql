"use client";

import React from "react";
import Link from "next/link";
import { Database, ShieldCheck, ArrowRight } from "lucide-react";

export default function MerchantWarehouseRedirect() {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs max-w-2xl mx-auto text-center space-y-6 my-8">
      <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
        <Database className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Promoted to Platform HQ
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Apache Hive 3.1 Big Data OLAP Warehouse
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
          The 1,000,000+ orders batch reporting pipeline, HDFS partition pruning queries (D1–D5), and Tez DAG execution engine are now orchestrated inside the dedicated <strong>Platform Administration HQ</strong>.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/admin/warehouse"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Open Platform Admin Hive Workbench</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
