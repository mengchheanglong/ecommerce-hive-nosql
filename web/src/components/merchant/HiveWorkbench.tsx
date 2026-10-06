"use client";

import React, { useState } from "react";
import { HIVE_QUERIES } from "@/lib/data";
import { Terminal, Copy, CheckCheck, Play, RefreshCw, Zap, Cpu } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export function HiveWorkbench() {
  const [activeQuery, setActiveQuery] = useState<"D1" | "D2" | "D3" | "D4">("D1");
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const current = HIVE_QUERIES[activeQuery];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.hql);
    setCopied(true);
    showToast("HiveQL query copied to clipboard", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      showToast(`HiveQL Query ${activeQuery} executed successfully in 142ms via Tez Engine!`, "success");
    }, 500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e2eae5] shadow-card space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#011c15] text-[#15c089] flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#013326]">Apache Hive 3.1 Analytics Console</h3>
            <p className="text-xs text-[#5c7167]">Interactive OLAP batch processing on HDFS ORC tables</p>
          </div>
        </div>

        {/* Query selection buttons */}
        <div className="flex items-center space-x-1.5 bg-[#f1f6f3] p-1.5 rounded-2xl border border-[#e2eae5]">
          {(["D1", "D2", "D3", "D4"] as const).map((qId) => (
            <button
              key={qId}
              onClick={() => setActiveQuery(qId)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeQuery === qId
                  ? "bg-[#013326] text-white shadow-xs"
                  : "text-[#5c7167] hover:text-[#013326]"
              }`}
            >
              Query {qId}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Results Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Code Editor */}
        <div className="bg-[#011c15] text-[#9cf0ce] p-5 sm:p-6 rounded-2xl border border-[#0a4636] font-mono text-xs flex flex-col justify-between space-y-5 shadow-inner">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[#cad6cf] pb-3 border-b border-[#0a4636]">
              <span className="font-bold text-white">// {current.title}</span>
              <button
                onClick={handleCopy}
                className="text-[#15c089] hover:text-white flex items-center space-x-1 px-2 py-1 rounded bg-[#0a4636]/40 cursor-pointer"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="overflow-x-auto text-emerald-300 font-mono leading-relaxed py-2">
              {current.hql}
            </pre>
          </div>

          <div className="pt-3 border-t border-[#0a4636] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-[11px] text-[#cad6cf]">
              <Cpu className="w-3.5 h-3.5 text-[#15c089]" />
              <span>Tez Engine • 8 Buckets Hash-Partitioned</span>
            </div>

            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="px-4 py-2 rounded-xl bg-[#15c089] hover:bg-[#10a374] text-[#011c15] font-black text-xs flex items-center space-x-1.5 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isExecuting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>Execute on Tez</span>
            </button>
          </div>
        </div>

        {/* Right: Results Display */}
        <div className="bg-[#fafcfb] p-5 sm:p-6 rounded-2xl border border-[#e2eae5] flex flex-col justify-between space-y-4 shadow-card">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#e2eae5]">
              <span className="text-xs font-bold text-[#013326] uppercase tracking-wider">
                Execution Results Output
              </span>
              <span className="text-[11px] text-[#0c835c] font-mono font-bold bg-[#eafaf4] px-2.5 py-0.5 rounded-full border border-[#9cf0ce]">
                142 ms • 0 shuffle spill
              </span>
            </div>

            <div className="divide-y divide-[#e2eae5] text-xs">
              {current.results.map((r, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <span className="font-bold text-[#013326]">{r.col1}</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#013326] block">{r.col2}</span>
                    <span className="text-[11px] text-[#5c7167] block">{r.col3}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Speedup banner */}
          <div className="p-3.5 bg-[#eafaf4] rounded-2xl border border-[#9cf0ce] text-xs text-[#0c835c] flex items-start space-x-2.5">
            <Zap className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#013326]">Optimization Mechanics:</strong>
              <p className="mt-0.5">{current.speedup}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
