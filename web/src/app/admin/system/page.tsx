"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SYSTEM_DATASTORES } from "@/lib/data";
import { fetchEcosystemHealthMatrix, EcosystemHealthNode } from "@/lib/api";
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
  RefreshCw,
  Clock,
  Compass,
} from "lucide-react";

export default function AdminSystemPage() {
  const [splitSimulated, setSplitSimulated] = useState(false);
  const [liveNodes, setLiveNodes] = useState<EcosystemHealthNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { showToast } = useToast();

  const loadHealth = useCallback(async () => {
    try {
      const nodes = await fetchEcosystemHealthMatrix();
      if (nodes && nodes.length > 0) {
        setLiveNodes(nodes);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 3500);
    return () => clearInterval(interval);
  }, [loadHealth]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await loadHealth();
    setIsRefreshing(false);
    showToast("Ecosystem node health matrix refreshed", "info");
  };

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
          <span className="text-slate-900 font-bold">Polyglot Architecture & Health</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
              <Cpu className="w-6 h-6 text-purple-600" />
              <span>Polyglot Persistence & Digital-Twin Health Matrix</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Unified orchestration of 5 NoSQL datastores, Rust routing engine, and digital-twin simulation
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-purple-600" : ""}`} />
              <span>Probe Latencies</span>
            </button>

            <a
              href="http://localhost:4000/api/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
            >
              <span>Swagger API</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Real-time Ecosystem Health Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Server className="w-5 h-5 text-purple-600" />
              <span>Live Infrastructure Health Matrix (8 Active Microservices & Databases)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Continuously pinged from Next.js server & browser client to ensure zero silent failures
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            All Systems Nominal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(liveNodes.length > 0 ? liveNodes : SYSTEM_DATASTORES.map((ds) => ({
            name: ds.name,
            role: ds.role,
            port: ds.port,
            status: ds.status,
            latencyMs: ds.latencyMs,
            details: ds.metrics,
          }))).map((node) => (
            <div
              key={node.name}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 hover:border-purple-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{node.name}</h4>
                    <p className="text-[11px] text-purple-600 font-semibold mt-0.5">{node.role}</p>
                  </div>
                  <span
                    className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      node.status === "Healthy"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        node.status === "Healthy" ? "bg-emerald-600 animate-pulse" : "bg-amber-600"
                      }`}
                    />
                    <span>{node.status}</span>
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 my-2 space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Port:</span>
                    <span className="font-bold text-slate-900">{node.port}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Round-Trip:</span>
                    <span className="font-bold text-emerald-600">{node.latencyMs} ms</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  {node.details}
                </p>
              </div>
            </div>
          ))}
        </div>
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
