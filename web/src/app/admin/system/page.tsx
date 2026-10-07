"use client";

import React, { useState } from "react";
import { SYSTEM_DATASTORES } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import {
  Server,
  Cpu,
  Database,
  Radio,
  Zap,
  Share2,
  Layers,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Wifi,
  WifiOff,
} from "lucide-react";

export default function AdminSystemPage() {
  const [splitSimulated, setSplitSimulated] = useState(false);
  const { showToast } = useToast();

  const handleToggleSplit = () => {
    setSplitSimulated((prev) => {
      const next = !prev;
      if (next) {
        showToast(
          "Network Split Active! AP Carts operating locally; CP Wallets locked to prevent double-spending.",
          "warning"
        );
      } else {
        showToast("Network link restored. Eventual consistency sync completed.", "success");
      }
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Platform Admin</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">Polyglot Architecture</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
              <Cpu className="w-6 h-6 text-purple-600" />
              <span>Polyglot Persistence & CAP Theorem Monitor</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              5 specialized database engines deployed in unified orchestration across Cambodia
            </p>
          </div>

          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
          >
            <span>Swagger API Health</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* The 5 Polyglot Engines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SYSTEM_DATASTORES.map((ds) => {
          const iconMap: Record<string, any> = {
            Database,
            Zap,
            Radio,
            Share2,
            Layers,
          };
          const Icon = iconMap[ds.iconName] || Database;

          return (
            <div
              key={ds.name}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{ds.name}</h3>
                      <span className="text-[11px] text-purple-600 font-semibold">{ds.type}</span>
                    </div>
                  </div>

                  <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>{ds.status}</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Port / Protocol:</span>
                    <span className="font-bold text-slate-900">{ds.port}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Latency:</span>
                    <span className="font-bold text-emerald-600">{ds.latencyMs} ms</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Platform Role
                  </span>
                  <p className="text-xs font-medium text-slate-800 leading-relaxed">{ds.role}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <strong className="text-slate-700">Metrics: </strong>
                <span>{ds.metrics}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CAP Theorem Architecture Interactive Breakdown */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <span>CAP Theorem: Multi-Datacenter Network Partition Analysis</span>
            </h3>
            <p className="text-xs text-slate-500">
              Evaluating architectural trade-offs during a network split between Phnom Penh and Siem Reap
            </p>
          </div>

          <button
            onClick={handleToggleSplit}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs ${
              splitSimulated
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-amber-100 text-amber-900 hover:bg-amber-200"
            }`}
          >
            {splitSimulated ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{splitSimulated ? "Restore Network Link" : "Simulate 10-Min Split"}</span>
          </button>
        </div>

        {/* Dynamic Alert Banner */}
        {splitSimulated && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="block font-bold">
                CRITICAL: Fiber link between Phnom Penh (Primary) and Siem Reap (Secondary) is DOWN!
              </strong>
              <p>
                • <strong>Shopping Cart (AP):</strong> Accepted local writes. Carts stay available to shoppers; synchronizes via vector clocks when link heals.
              </p>
              <p>
                • <strong>Customer Wallet (CP):</strong> Locked in read-only mode. Transactions rejected to prevent double-spending across partitions.
              </p>
            </div>
          </div>
        )}

        {/* 2-Column CAP Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shopping Cart: AP System */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                AP System (Availability + Partition Tolerance)
              </span>
              <span className="text-xs font-bold text-slate-900">Shopping Cart Service</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              If a customer in Siem Reap cannot reach the Phnom Penh primary server, they must still be able to add items to their cart. A temporary cart discrepancy is completely acceptable because the user can reconcile it at checkout.
            </p>

            <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] space-y-1 text-slate-700">
              <div className="font-semibold text-blue-900">Why AP was chosen:</div>
              <p>
                Choosing Consistency (CP) here would mean showing an error screen whenever someone taps "Add to Cart", losing thousands of dollars in abandoned checkouts.
              </p>
            </div>
          </div>

          {/* Customer Wallet: CP System */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                CP System (Consistency + Partition Tolerance)
              </span>
              <span className="text-xs font-bold text-slate-900">Prepaid Wallet Service</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              The customer wallet stores real prepaid balances. If the network between Phnom Penh and Siem Reap splits, the wallet must sacrifice availability to guarantee strict balance consistency.
            </p>

            <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] space-y-1 text-slate-700">
              <div className="font-semibold text-purple-900">Why CP is mandatory (Double-Spending Risk):</div>
              <p>
                If we chose Availability (AP), a customer with $50 could spend $50 in Phnom Penh and simultaneously spend $50 in Siem Reap during the split, stealing $50 from KhmerCart.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
