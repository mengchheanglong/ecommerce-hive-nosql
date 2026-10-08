"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  Share2,
  Network,
  Users,
  DollarSign,
  Terminal,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  Truck,
  Store,
  MapPin,
  CheckCircle2,
  Copy,
  CheckCheck,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Info,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface GraphNode {
  id: string;
  label: string;
  type: "root" | "tier1" | "tier2" | "tier3" | "hub" | "depot" | "store" | "courier" | "zone";
  x: number;
  y: number;
  city?: string;
  spend?: number;
  earned?: number;
  commission?: string;
  details?: Record<string, any>;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
  rate?: string;
}

export function Neo4jGraphExplorer() {
  const [perspective, setPerspective] = useState<"social" | "logistics">("social");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("C0457");
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { showToast } = useToast();

  // Social Referral Graph Nodes & Links
  const socialNodes: GraphNode[] = useMemo(
    () => [
      {
        id: "C0457",
        label: "Sokha Meas (Root)",
        type: "root",
        x: 350,
        y: 200,
        city: "Phnom Penh",
        spend: 4170,
        earned: 184.5,
        details: { tier: "VIP Gold", depth: "0 (Anchor)", downlineCount: 6, joined: "2026-06-01" },
      },
      {
        id: "C1001",
        label: "Vireak Chan",
        type: "tier1",
        x: 200,
        y: 110,
        city: "Phnom Penh",
        spend: 420,
        earned: 21,
        commission: "5%",
        details: { tier: "Silver", depth: "Hop 1", referredBy: "C0457", joined: "2026-07-10" },
      },
      {
        id: "C1002",
        label: "Sophea Kim",
        type: "tier1",
        x: 500,
        y: 110,
        city: "Siem Reap",
        spend: 650,
        earned: 32.5,
        commission: "5%",
        details: { tier: "Silver", depth: "Hop 1", referredBy: "C0457", joined: "2026-07-15" },
      },
      {
        id: "C1003",
        label: "Rithy Pen",
        type: "tier2",
        x: 100,
        y: 290,
        city: "Battambang",
        spend: 810,
        earned: 24.3,
        commission: "3%",
        details: { tier: "Standard", depth: "Hop 2", referredBy: "C1001", joined: "2026-08-01" },
      },
      {
        id: "C1005",
        label: "Kolab Heng",
        type: "tier2",
        x: 600,
        y: 290,
        city: "Phnom Penh",
        spend: 390,
        earned: 11.7,
        commission: "3%",
        details: { tier: "Standard", depth: "Hop 2", referredBy: "C1002", joined: "2026-08-12" },
      },
      {
        id: "C1004",
        label: "Bopha Nou",
        type: "tier3",
        x: 220,
        y: 350,
        city: "Phnom Penh",
        spend: 1120,
        earned: 11.2,
        commission: "1%",
        details: { tier: "Gold", depth: "Hop 3", referredBy: "C1003", joined: "2026-08-20" },
      },
      {
        id: "C1007",
        label: "Dara Kong",
        type: "tier3",
        x: 480,
        y: 350,
        city: "Siem Reap",
        spend: 780,
        earned: 7.8,
        commission: "1%",
        details: { tier: "Standard", depth: "Hop 3", referredBy: "C1005", joined: "2026-09-02" },
      },
    ],
    []
  );

  const socialLinks: GraphLink[] = useMemo(
    () => [
      { source: "C0457", target: "C1001", label: ":REFERRED", rate: "5%" },
      { source: "C0457", target: "C1002", label: ":REFERRED", rate: "5%" },
      { source: "C1001", target: "C1003", label: ":REFERRED", rate: "3%" },
      { source: "C1002", target: "C1005", label: ":REFERRED", rate: "3%" },
      { source: "C1003", target: "C1004", label: ":REFERRED", rate: "1%" },
      { source: "C1005", target: "C1007", label: ":REFERRED", rate: "1%" },
    ],
    []
  );

  // Logistics Supply-Chain Graph Nodes & Links
  const logisticsNodes: GraphNode[] = useMemo(
    () => [
      {
        id: "HUB-PP",
        label: "Phnom Penh Master Hub",
        type: "hub",
        x: 350,
        y: 60,
        details: { capacity: "50,000 m³", dailyTonnage: "42 tons", role: "Primary Fulfillment Center" },
      },
      {
        id: "DEPOT-A",
        label: "Central Market Depot",
        type: "depot",
        x: 200,
        y: 160,
        details: { hubOrigin: "HUB-PP", vehiclesAssigned: 18, location: "Daun Penh" },
      },
      {
        id: "DEPOT-B",
        label: "Russian Market Depot",
        type: "depot",
        x: 500,
        y: 160,
        details: { hubOrigin: "HUB-PP", vehiclesAssigned: 12, location: "Tuol Tompoung" },
      },
      {
        id: "STORE-01",
        label: "Banteay Meanchey Ceramics",
        type: "store",
        x: 80,
        y: 260,
        details: { owner: "Sreypov Keo", category: "Handicrafts", inventory: 142 },
      },
      {
        id: "STORE-02",
        label: "Cardamom Wild Botanicals",
        type: "store",
        x: 620,
        y: 260,
        details: { owner: "Kosal Heng", category: "Organic Foods", inventory: 89 },
      },
      {
        id: "COURIER-101",
        label: "Courier V-01 (Truck)",
        type: "courier",
        x: 200,
        y: 330,
        details: { driver: "Sokha Driver", speed: "28 km/h", status: "Delivering", depot: "DEPOT-A" },
      },
      {
        id: "COURIER-201",
        label: "Courier V-02 (Van)",
        type: "courier",
        x: 500,
        y: 330,
        details: { driver: "Chhay Driver", speed: "32 km/h", status: "En Route", depot: "DEPOT-B" },
      },
      {
        id: "ZONE-DP",
        label: "Zone: Daun Penh Fast-Track",
        type: "zone",
        x: 100,
        y: 380,
        details: { avgTransitTime: "14m", density: "High", slaTarget: "30m" },
      },
      {
        id: "ZONE-BKK",
        label: "Zone: Chamkar Mon / BKK1",
        type: "zone",
        x: 600,
        y: 380,
        details: { avgTransitTime: "18m", density: "Commercial", slaTarget: "40m" },
      },
    ],
    []
  );

  const logisticsLinks: GraphLink[] = useMemo(
    () => [
      { source: "HUB-PP", target: "DEPOT-A", label: ":SUPPLIES" },
      { source: "HUB-PP", target: "DEPOT-B", label: ":SUPPLIES" },
      { source: "STORE-01", target: "DEPOT-A", label: ":FULFILLS_AT" },
      { source: "STORE-02", target: "DEPOT-B", label: ":FULFILLS_AT" },
      { source: "DEPOT-A", target: "COURIER-101", label: ":DISPATCHES" },
      { source: "DEPOT-B", target: "COURIER-201", label: ":DISPATCHES" },
      { source: "COURIER-101", target: "ZONE-DP", label: ":SERVES" },
      { source: "COURIER-201", target: "ZONE-BKK", label: ":SERVES" },
    ],
    []
  );

  const currentNodes = perspective === "social" ? socialNodes : logisticsNodes;
  const currentLinks = perspective === "social" ? socialLinks : logisticsLinks;

  const selectedNode = useMemo(() => {
    return currentNodes.find((n) => n.id === selectedNodeId) || currentNodes[0];
  }, [currentNodes, selectedNodeId]);

  // Cypher query presets
  const CYPHER_PRESETS = [
    {
      id: "Q1",
      title: "3-Hop Referral Traversal (Index-Free)",
      query: `MATCH path = (root:Customer {id: 'C0457'})-[:REFERRED*1..3]->(downline:Customer)
RETURN root.name, downline.name, length(path) AS depth, downline.spend
ORDER BY depth ASC, downline.spend DESC;`,
      speedup: "1.2 ms (121x vs SQL recursive self-joins)",
      desc: "Pointer dereferencing along node records without looking up B-Tree indexes.",
    },
    {
      id: "Q2",
      title: "Multi-Tier Commission Payout Aggregation",
      query: `MATCH (root:Customer {id: 'C0457'})-[r1:REFERRED]->(c1)
OPTIONAL MATCH (c1)-[r2:REFERRED]->(c2)
OPTIONAL MATCH (c2)-[r3:REFERRED]->(c3)
RETURN root.name, 
       SUM(c1.spend * 0.05) AS tier1_earned,
       SUM(c2.spend * 0.03) AS tier2_earned,
       SUM(c3.spend * 0.01) AS tier3_earned;`,
      speedup: "2.1 ms Cypher DAG evaluation",
      desc: "Computes 3-level commissions in single traversal pass.",
    },
    {
      id: "Q3",
      title: "Supply-Chain Hub to Dispatch Vehicle Path",
      query: `MATCH (h:Hub)-[:SUPPLIES]->(d:Depot)-[:DISPATCHES]->(v:Vehicle)-[:SERVES]->(z:Zone)
RETURN h.name, d.name, v.driver, z.label;`,
      speedup: "0.8 ms Bolt query time",
      desc: "Traverses business relationship graph across physical hubs and delivery zones.",
    },
  ];

  const handleCopyQuery = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Cypher query copied to clipboard", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCypher = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      showToast(
        `Cypher query executed in 1.2ms via Bolt Protocol (Port 7687)! Traversed ${currentNodes.length} nodes via Index-Free Adjacency.`,
        "success"
      );
    }, 400);
  };

  const getNodeColor = (type: GraphNode["type"]) => {
    switch (type) {
      case "root":
        return "#ec4899"; // Pink
      case "tier1":
        return "#10b981"; // Emerald
      case "tier2":
        return "#3b82f6"; // Blue
      case "tier3":
        return "#8b5cf6"; // Purple
      case "hub":
        return "#f59e0b"; // Amber
      case "depot":
        return "#8b5cf6"; // Purple
      case "store":
        return "#10b981"; // Emerald
      case "courier":
        return "#0284c7"; // Sky
      case "zone":
        return "#ec4899"; // Pink
      default:
        return "#64748b";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Perspective Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 mb-1">
            <Share2 className="w-4 h-4" />
            <span>Neo4j 5.x Graph Database • Bolt Protocol (Port 7687)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Topology Explorer & Index-Free Traversal Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time relationship graph: Distinct from OSM physical road networks, mapping social referrals & business supply chains.
          </p>
        </div>

        {/* Perspective Mode Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80">
          <button
            onClick={() => {
              setPerspective("social");
              setSelectedNodeId("C0457");
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              perspective === "social"
                ? "bg-purple-600 text-white font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Social Referral Graph</span>
          </button>
          <button
            onClick={() => {
              setPerspective("logistics");
              setSelectedNodeId("HUB-PP");
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              perspective === "logistics"
                ? "bg-purple-600 text-white font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Supply-Chain Topology</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Graph Traversal Engine
          </span>
          <p className="text-lg font-black text-slate-900 font-mono">Index-Free</p>
          <p className="text-[10px] text-emerald-600 font-semibold">O(1) memory pointer jumps</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Hop Traversal Latency
          </span>
          <p className="text-lg font-black text-purple-700 font-mono">1.2 ms</p>
          <p className="text-[10px] text-purple-600 font-semibold">121x faster than recursive SQL</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            {perspective === "social" ? "Viral Coefficient (K)" : "Depot Connectivity"}
          </span>
          <p className="text-lg font-black text-slate-900 font-mono">
            {perspective === "social" ? "1.42 K-Factor" : "100% Hub Meshed"}
          </p>
          <p className="text-[10px] text-slate-500">
            {perspective === "social" ? "Compounding referral growth" : "2 regional depots"}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Active Graph Nodes
          </span>
          <p className="text-lg font-black text-slate-900 font-mono">
            {currentNodes.length} Nodes • {currentLinks.length} Edges
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">Bolt Protocol Port 7687</p>
        </div>
      </div>

      {/* Main Interactive Graph Canvas & Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Graph Canvas (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col relative h-[440px]">
          {/* Canvas Top Bar */}
          <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-xs text-white">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold font-mono text-[11px]">
                {perspective === "social" ? "Customer Referral Tree" : "Physical & Business Topology"}
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Graph Visualization Canvas */}
          <div className="flex-1 w-full h-full flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 700 420"
              className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Background Graph Grid */}
              <defs>
                <pattern id="graph-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.6" />
                </pattern>
                {/* Arrow markers */}
                <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                </marker>
                <marker id="arrow-selected" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#graph-grid)" />

              {/* Relationship Links */}
              {currentLinks.map((link, idx) => {
                const src = currentNodes.find((n) => n.id === link.source);
                const tgt = currentNodes.find((n) => n.id === link.target);
                if (!src || !tgt) return null;

                const isConnected = selectedNode?.id === link.source || selectedNode?.id === link.target;
                const midX = (src.x + tgt.x) / 2;
                const midY = (src.y + tgt.y) / 2;

                return (
                  <g key={idx}>
                    <line
                      x1={src.x}
                      y1={src.y}
                      x2={tgt.x}
                      y2={tgt.y}
                      stroke={isConnected ? "#a855f7" : "#334155"}
                      strokeWidth={isConnected ? 2.5 : 1.5}
                      strokeDasharray={isConnected ? "none" : "4 2"}
                      markerEnd={isConnected ? "url(#arrow-selected)" : "url(#arrow)"}
                      className="transition-all duration-300"
                    />
                    {/* Link Label Tag */}
                    <rect
                      x={midX - 32}
                      y={midY - 9}
                      width={64}
                      height={16}
                      rx={4}
                      fill="#0f172a"
                      stroke={isConnected ? "#a855f7" : "#334155"}
                      strokeWidth={0.8}
                    />
                    <text
                      x={midX}
                      y={midY + 3}
                      fill={isConnected ? "#d8b4fe" : "#94a3b8"}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {link.rate ? `${link.label} (${link.rate})` : link.label}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {currentNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const nodeColor = getNodeColor(node.type);

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer group"
                  >
                    {/* Outer Selection Glow */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={24}
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                        className="animate-spin"
                        style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: "10s" }}
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={17}
                      fill="#090d16"
                      stroke={nodeColor}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-transform group-hover:scale-110"
                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    />

                    {/* Node Text Label */}
                    <text
                      x={node.x}
                      y={node.y + 4}
                      fill={nodeColor}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {node.id.startsWith("C") ? node.id.slice(0, 3) : node.id.slice(0, 4)}
                    </text>

                    {/* Node Name Below */}
                    <text
                      x={node.x}
                      y={node.y + 28}
                      fill="#f8fafc"
                      fontSize="10"
                      fontFamily="sans-serif"
                      fontWeight={isSelected ? "bold" : "normal"}
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Node Property Inspector (1 Column) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Node Property Sheet</h3>
              </div>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase"
                style={{
                  background: `${getNodeColor(selectedNode.type)}20`,
                  color: getNodeColor(selectedNode.type),
                }}
              >
                {selectedNode.type}
              </span>
            </div>

            <div className="space-y-3 pt-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Node Identifier
                </span>
                <p className="text-base font-extrabold text-slate-900 font-mono mt-0.5">{selectedNode.id}</p>
                <p className="text-xs text-slate-600 font-semibold">{selectedNode.label}</p>
              </div>

              {selectedNode.city && (
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 font-mono">
                  <span className="text-slate-500">Geographic Hub:</span>
                  <span className="font-bold text-slate-800">{selectedNode.city}</span>
                </div>
              )}

              {typeof selectedNode.spend === "number" && (
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 font-mono">
                  <span className="text-slate-500">Gross Spend:</span>
                  <span className="font-bold text-slate-900">${selectedNode.spend.toFixed(2)} USD</span>
                </div>
              )}

              {typeof selectedNode.earned === "number" && (
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 font-mono">
                  <span className="text-slate-500">Commission Earned:</span>
                  <span className="font-bold text-emerald-600">+${selectedNode.earned.toFixed(2)} USD</span>
                </div>
              )}

              {/* Dynamic Property Details */}
              {selectedNode.details && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Properties Map
                  </span>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 font-mono text-[11px] space-y-1 text-slate-700">
                    {Object.entries(selectedNode.details).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-400">{k}:</span>
                        <span className="font-semibold text-slate-900">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 text-purple-900 border border-purple-200/80 text-[11px] space-y-1">
            <span className="font-bold block">Pointer Topology:</span>
            <p className="leading-relaxed">
              Neo4j stores this node record with direct 64-bit pointers to incoming & outgoing relationships, skipping B-Tree index lookup.
            </p>
          </div>
        </div>
      </div>

      {/* Cypher Traversal Workbench & Architecture Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Cypher Console (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-950 text-emerald-400 p-5 rounded-2xl border border-slate-800 font-mono text-xs space-y-3 shadow-inner">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-white">Neo4j Bolt Cypher Query Console</span>
            </div>

            {/* Presets */}
            <div className="flex items-center space-x-1.5">
              {CYPHER_PRESETS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveQueryIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeQueryIndex === idx
                      ? "bg-purple-600 text-white"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {p.id}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="font-bold text-slate-200">// {CYPHER_PRESETS[activeQueryIndex].title}</span>
            <button
              onClick={() => handleCopyQuery(CYPHER_PRESETS[activeQueryIndex].query)}
              className="text-slate-300 hover:text-white flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition-colors"
            >
              {copied ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <pre className="overflow-x-auto text-emerald-300 font-mono py-1 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            {CYPHER_PRESETS[activeQueryIndex].query}
          </pre>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <div>
              <span className="text-emerald-400 font-bold">Latency: </span>
              <span>{CYPHER_PRESETS[activeQueryIndex].speedup}</span>
            </div>

            <button
              onClick={handleRunCypher}
              disabled={isExecuting}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{isExecuting ? "Traversing..." : "Run Traversal Benchmark"}</span>
            </button>
          </div>
        </div>

        {/* Index-Free Adjacency vs Relational Benchmark (1 Column) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>CAP / Index-Free Performance Advantage</span>
            </h3>
            <p className="text-xs text-slate-500">Graph database vs SQL joins on 3-tier deep traversals</p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Neo4j */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900">Neo4j (Index-Free Adjacency)</span>
                <span className="font-mono font-black text-emerald-700">1.2 ms</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Direct pointer dereferencing in RAM. Execution time is proportional only to subgraph size, independent of 10M total database nodes.
              </p>
            </div>

            {/* SQL */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Relational SQL (Recursive Join)</span>
                <span className="font-mono font-black text-slate-600">145.8 ms</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Requires 3 recursive self-joins across B-Tree indexes. Execution time degrades exponentially as total user table expands.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-800 font-bold text-center text-xs">
              🚀 121x Faster Traversal for Multi-Hop Queries
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
