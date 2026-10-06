"use client";

import React from "react";
import { HiveWorkbench } from "@/components/merchant/HiveWorkbench";
import { Database, Zap, Cpu, Layers } from "lucide-react";

export default function MerchantWarehousePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium mb-1">
          <span>Merchant Console</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Warehouse Analytics</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Apache Hive 3.1 Warehouse Analytics</h1>
        <p className="text-xs text-slate-500">
          Batch analytics over 2,000,000 monthly orders staged at /staging/orders/ in HDFS
        </p>
      </div>

      {/* Interactive HiveQL Console */}
      <HiveWorkbench />

      {/* Pipeline Architecture Deep-Dive */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <Layers className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            Hive Warehouse & Query Optimization Architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Stage 1
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-2">HDFS CSV Staging</h4>
            <p className="text-[11px] text-slate-500">
              Monthly CSV dumps placed directly into /staging/orders/ in HDFS.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Stage 2
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-2">orders_raw Table</h4>
            <p className="text-[11px] text-slate-500">
              External TextFile schema-on-read table without data movement.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Stage 3
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-2">Partition & Bucket</h4>
            <p className="text-[11px] text-slate-500">
              Partitioned by order_month, clustered into 8 customer hash buckets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Stage 4
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-2">Columnar ORC</h4>
            <p className="text-[11px] text-slate-500">
              ZLIB compression, stripe indexing, predicate pushdown skips blocks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Stage 5
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-2">Tez BI Reporting</h4>
            <p className="text-[11px] text-slate-500">
              Partition pruning skips &gt;90% of data for sub-second Power BI queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
