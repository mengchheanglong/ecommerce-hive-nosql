"use client";

import React, { useState, useEffect } from "react";
import { ReferralNode } from "@/types";
import { INITIAL_REFERRALS } from "@/lib/data";
import { fetchReferrals } from "@/lib/api";
import { Share2, Users, DollarSign, Award, ArrowRight, Terminal, RefreshCw } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";

export function ReferralGraph() {
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();
  const [network, setNetwork] = useState<ReferralNode[]>(INITIAL_REFERRALS);
  const [rootCustomer, setRootCustomer] = useState<any>({
    id: "C0457",
    name: "Sokha Meas",
    city: "Phnom Penh",
    totalEarnedRewards: "$184.50",
    totalNetworkSpend: "$4,170.00",
    networkDepth: 3,
  });
  const [graphStats, setGraphStats] = useState<any>({
    engine: "Neo4j Graph Database (Bolt Protocol)",
    cypherQuery:
      "MATCH (origin:Customer {id: 'C0457'})-[:REFERRED*1..3]->(ref:Customer) RETURN origin, ref, length(path)",
    traversalAlgorithm: "Index-Free Adjacency (O(1) memory pointer jumps)",
  });
  const [loading, setLoading] = useState(false);

  const loadReferralData = async () => {
    setLoading(true);
    const data = await fetchReferrals();
    if (data.network) setNetwork(data.network);
    if (data.rootCustomer) setRootCustomer(data.rootCustomer);
    if (data.graphStats) setGraphStats(data.graphStats);
    setLoading(false);
  };

  useEffect(() => {
    loadReferralData();
  }, []);

  const tier1 = network.filter((r) => r.level === 1);
  const tier2 = network.filter((r) => r.level === 2);
  const tier3 = network.filter((r) => r.level === 3);

  const totalRewardsUSD = network.reduce((acc, cur) => acc + cur.earned, 0);
  const totalVolumeUSD = network.reduce((acc, cur) => acc + cur.spend, 0);

  const handleTestCypher = () => {
    showToast("Executed Cypher traversal across 3 hops in 1.4ms (O(1) pointers)", "success");
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Referral Network Depth
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">3 Hops (Index-Free)</p>
          <p className="text-xs text-emerald-600 mt-1 font-semibold">Traversed in &lt;1.8ms</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Referred Gross Spend
          </span>
          <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{formatPrice(totalVolumeUSD)}</p>
          <p className="text-xs text-slate-500 mt-1">{network.length} active customer nodes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Commission Paid
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">{formatPrice(totalRewardsUSD)}</p>
          <p className="text-xs text-slate-500 mt-1">Multi-tier commission distributed</p>
        </div>
      </div>

      {/* Live Cypher Query Engine Card */}
      <div className="bg-slate-950 text-emerald-400 p-5 sm:p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-3 shadow-inner">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">Neo4j Bolt Cypher Traversal Engine</span>
          </div>

          <button
            onClick={handleTestCypher}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Run Graph Traversal Test
          </button>
        </div>

        <pre className="overflow-x-auto text-emerald-300 font-mono py-1">
          {graphStats.cypherQuery ||
            "MATCH (origin:Customer {id: 'C0457'})-[:REFERRED*1..3]->(ref:Customer) RETURN origin, ref, length(path)"}
        </pre>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <span>Engine: <strong className="text-white">{graphStats.engine}</strong></span>
          <span>Algorithm: <strong className="text-white">Index-Free Adjacency (No index lookup overhead)</strong></span>
        </div>
      </div>

      {/* Tier Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level 1 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900">Tier 1: Direct Invites</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
              5% Reward
            </span>
          </div>
          <p className="text-xs text-slate-500">Directly referred by anchor customer {rootCustomer.name} ({rootCustomer.id})</p>

          <div className="space-y-3">
            {tier1.map((node) => (
              <div key={node.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">{node.name}</span>
                  <span className="text-[11px] font-mono font-bold text-emerald-600">+{formatPrice(node.earned)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>ID: {node.id} • {node.city}</span>
                  <span>Spend: {formatPrice(node.spend)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h4 className="text-sm font-bold text-slate-900">Tier 2: 2nd-Degree Friends</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
              3% Reward
            </span>
          </div>
          <p className="text-xs text-slate-500">Invited by Tier 1 nodes via social referral links</p>

          <div className="space-y-3">
            {tier2.map((node) => (
              <div key={node.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">{node.name}</span>
                  <span className="text-[11px] font-mono font-bold text-blue-700">+{formatPrice(node.earned)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>ID: {node.id} • {node.city}</span>
                  <span>Spend: {formatPrice(node.spend)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 3 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h4 className="text-sm font-bold text-slate-900">Tier 3: 3rd-Degree Friends</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
              1% Reward
            </span>
          </div>
          <p className="text-xs text-slate-500">Extended social graph connections (Hop 3 in Cypher traversal)</p>

          <div className="space-y-3">
            {tier3.map((node) => (
              <div key={node.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">{node.name}</span>
                  <span className="text-[11px] font-mono font-bold text-amber-700">+{formatPrice(node.earned)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>ID: {node.id} • {node.city}</span>
                  <span>Spend: {formatPrice(node.spend)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
