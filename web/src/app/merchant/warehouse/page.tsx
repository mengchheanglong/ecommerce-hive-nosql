"use client";

import React from "react";
import { HiveWorkbench } from "@/components/merchant/HiveWorkbench";
import { Database, Zap, Cpu, Layers } from "lucide-react";

export default function MerchantWarehousePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#013326]">Apache Hive 3.1 Warehouse Analytics</h1>
        <p className="text-xs text-[#5c7167]">
          Batch analytics over 2,000,000 monthly orders staged at /staging/orders/ in HDFS
        </p>
      </div>

      {/* Interactive HiveQL Console */}
      <HiveWorkbench />

      {/* Pipeline Architecture Deep-Dive */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eae5] shadow-card space-y-6">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-[#f1f6f3]">
          <Layers className="w-5 h-5 text-[#15c089]" />
          <h3 className="text-base font-extrabold text-[#013326]">
            Hive Warehouse & Query Optimization Architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-[#fafcfb] border border-[#e2eae5] space-y-1">
            <span className="text-[10px] font-bold text-[#0c835c] bg-[#eafaf4] px-2 py-0.5 rounded-full border border-[#9cf0ce]">
              Stage 1
            </span>
            <h4 className="text-xs font-bold text-[#013326] mt-2">HDFS CSV Dump</h4>
            <p className="text-[11px] text-[#5c7167]">
              Raw staging files deposited into HDFS distributed directory.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fafcfb] border border-[#e2eae5] space-y-1">
            <span className="text-[10px] font-bold text-[#0c835c] bg-[#eafaf4] px-2 py-0.5 rounded-full border border-[#9cf0ce]">
              Stage 2
            </span>
            <h4 className="text-xs font-bold text-[#013326] mt-2">orders_raw Table</h4>
            <p className="text-[11px] text-[#5c7167]">
              External TextFile schema-on-read table without data movement.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fafcfb] border border-[#e2eae5] space-y-1">
            <span className="text-[10px] font-bold text-[#0c835c] bg-[#eafaf4] px-2 py-0.5 rounded-full border border-[#9cf0ce]">
              Stage 3
            </span>
            <h4 className="text-xs font-bold text-[#013326] mt-2">Partition & Bucket</h4>
            <p className="text-[11px] text-[#5c7167]">
              Partitioned by order_month, clustered into 8 customer hash buckets.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fafcfb] border border-[#e2eae5] space-y-1">
            <span className="text-[10px] font-bold text-[#0c835c] bg-[#eafaf4] px-2 py-0.5 rounded-full border border-[#9cf0ce]">
              Stage 4
            </span>
            <h4 className="text-xs font-bold text-[#013326] mt-2">Columnar ORC</h4>
            <p className="text-[11px] text-[#5c7167]">
              ZLIB compression, stripe indexing, predicate pushdown skips blocks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fafcfb] border border-[#e2eae5] space-y-1">
            <span className="text-[10px] font-bold text-[#0c835c] bg-[#eafaf4] px-2 py-0.5 rounded-full border border-[#9cf0ce]">
              Stage 5
            </span>
            <h4 className="text-xs font-bold text-[#013326] mt-2">Tez BI Reporting</h4>
            <p className="text-[11px] text-[#5c7167]">
              Partition pruning skips &gt;90% of data for sub-second analytical reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
