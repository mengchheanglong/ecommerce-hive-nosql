"use client";

import React from "react";
import { HiveWorkbench } from "@/components/merchant/HiveWorkbench";
import { Database, Zap, Cpu, Layers, Sparkles } from "lucide-react";

export default function AdminWarehousePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Platform Admin</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">Data Warehouse Analytics</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
              <Database className="w-6 h-6 text-purple-600" />
              <span>Apache Hive 3.1 Big Data OLAP Workbench</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Batch processing over 1,000,000+ orders staged in HDFS • Vectorized Tez DAG query execution
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Partition Pruned: 50.8ms (8.3x Faster than CSV)</span>
          </div>
        </div>
      </div>

      {/* Interactive HiveQL Console */}
      <HiveWorkbench />

      {/* Pipeline Architecture Deep-Dive */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <Layers className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-bold text-slate-900">
            Hive Warehouse & Query Optimization Architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Stage 1
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-2">HDFS CSV Staging</h4>
            <p className="text-[11px] text-slate-500">
              Monthly CSV dumps placed directly into /staging/orders/ in HDFS (74.4 MB).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Stage 2
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-2">orders_raw Table</h4>
            <p className="text-[11px] text-slate-500">
              External TextFile schema-on-read table without data movement.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Stage 3
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-2">Partition & Bucket</h4>
            <p className="text-[11px] text-slate-500">
              Partitioned by order_month, clustered into 8 customer hash buckets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Stage 4
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-2">Columnar ORC</h4>
            <p className="text-[11px] text-slate-500">
              Snappy/ZLIB compression (21.2 MB, 3.5x ratio), stripe index predicate pushdown.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Stage 5
            </span>
            <h4 className="text-xs font-bold text-slate-900 mt-2">Tez BI Reporting</h4>
            <p className="text-[11px] text-slate-500">
              Partition pruning skips 60% of folders for sub-second executive BI queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
