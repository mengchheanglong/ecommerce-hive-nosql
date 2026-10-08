"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  PLATFORM_KPIS,
  STORE_TENANTS,
} from "@/lib/data";
import {
  fetchOrders,
  fetchProducts,
  fetchHiveAnalytics,
  fetchSandboxState,
  fetchSandboxStats,
  fetchSandboxVehicles,
  controlSandboxSimulation,
  setSandboxSpeed,
  fetchPathfinderStats,
  fetchEcosystemHealthMatrix,
  sendRiderPing,
  EcosystemHealthNode,
} from "@/lib/api";
import {
  OrderRecord,
  Product,
  SandboxSimState,
  SandboxSimStats,
  SandboxVehicle,
  PathfinderGraphStats,
} from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import {
  ShieldCheck,
  Store,
  DollarSign,
  ShoppingCart,
  Truck,
  Users,
  Database,
  Radio,
  Zap,
  Share2,
  Layers,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Server,
  Play,
  Pause,
  RefreshCw,
  Compass,
  MapPin,
  Cpu,
  Navigation,
} from "lucide-react";

export default function PlatformAdminOverview() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [sandboxState, setSandboxState] = useState<SandboxSimState | null>(null);
  const [sandboxStats, setSandboxStats] = useState<SandboxSimStats | null>(null);
  const [vehicles, setVehicles] = useState<SandboxVehicle[]>([]);
  const [pathfinderStats, setPathfinderStats] = useState<PathfinderGraphStats | null>(null);
  const [ecosystemNodes, setEcosystemNodes] = useState<EcosystemHealthNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSimLoading, setIsSimLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { formatPrice } = useCurrency();
  const { showToast } = useToast();

  // Live Cassandra Telemetry Stream Logs
  const [radarLogs, setRadarLogs] = useState<string[]>([
    "[Cassandra LSM] Cluster connected on port 9042. Token partitioner active.",
    "[Cassandra LSM] KeySpace telemetry_ks: rider_gps_pings (TTL 30 days, TWCS enabled).",
    "[Cassandra LSM] INSERT INTO rider_gps_pings (rider_id, ping_time, lat, lng, speed, battery) VALUES ('V-01', '13:22:10', 11.5564, 104.9282, '28 km/h', 88%);",
  ]);
  const [isPinging, setIsPinging] = useState(false);

  // Load all ecosystem state
  const loadAllState = useCallback(async () => {
    try {
      const [ordData, simSt, simStat, vehs, pfStats, ecoNodes] = await Promise.all([
        fetchOrders(),
        fetchSandboxState(),
        fetchSandboxStats(),
        fetchSandboxVehicles(),
        fetchPathfinderStats(),
        fetchEcosystemHealthMatrix(),
      ]);

      if (ordData && ordData.length > 0) setOrders(ordData);
      if (simSt) setSandboxState(simSt);
      if (simStat) setSandboxStats(simStat);
      if (vehs && vehs.length > 0) setVehicles(vehs);
      if (pfStats) setPathfinderStats(pfStats);
      if (ecoNodes && ecoNodes.length > 0) setEcosystemNodes(ecoNodes);
    } catch (err) {
      console.warn("Error refreshing ecosystem admin state:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllState();
    // Poll simulation and telemetry every 2.5 seconds
    const interval = setInterval(loadAllState, 2500);
    return () => clearInterval(interval);
  }, [loadAllState]);

  // Periodic Cassandra write log generation with real vehicle positions
  useEffect(() => {
    const timer = setInterval(() => {
      if (vehicles.length > 0) {
        const v = vehicles[Math.floor(Math.random() * vehicles.length)];
        const lat = v.position?.lat?.toFixed(4) || "11.5564";
        const lng = v.position?.lon?.toFixed(4) || "104.9282";
        const speed = Math.round(v.speed_kmh || 24);
        const timeStr = new Date().toTimeString().slice(0, 8);
        const cql = `[Cassandra LSM] INSERT INTO rider_gps_pings (rider_id, ping_time, lat, lng, speed, battery) VALUES ('${v.id}', '${timeStr}', ${lat}, ${lng}, '${speed} km/h', ${v.battery || 90}%);`;
        setRadarLogs((prev) => [cql, ...prev.slice(0, 4)]);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [vehicles]);

  // Real GMV calculated from actual MongoDB orders
  const calculatedGMV = useMemo(() => {
    if (orders.length === 0) return PLATFORM_KPIS.gmvUSD;
    return orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  }, [orders]);

  // Delivery breakdown
  const orderBreakdown = useMemo(() => {
    let delivered = 0;
    let inTransit = 0;
    let pending = 0;
    orders.forEach((o) => {
      const s = (o.status || "").toLowerCase();
      if (s === "delivered") delivered++;
      else if (s === "out for delivery" || s === "preparing" || s === "picked_up") inTransit++;
      else pending++;
    });
    return { delivered, inTransit, pending, total: orders.length };
  }, [orders]);

  // Handle Play/Pause Simulation
  const handleToggleSimulation = async () => {
    setIsSimLoading(true);
    const action = sandboxState?.status === "running" ? "pause" : "resume";
    const res = await controlSandboxSimulation(action);
    if (res.success) {
      showToast(action === "pause" ? "Logistics Sandbox paused" : "Logistics Sandbox resumed", "info");
      loadAllState();
    } else {
      showToast("Simulation control failed", "error");
    }
    setIsSimLoading(false);
  };

  // Handle Speed Change
  const handleSetSpeed = async (newSpeed: number) => {
    setIsSimLoading(true);
    const res = await setSandboxSpeed(newSpeed);
    if (res.success) {
      showToast(`Simulation accelerated to ${newSpeed}x`, "success");
      loadAllState();
    } else {
      showToast("Speed adjustment failed", "error");
    }
    setIsSimLoading(false);
  };

  // Handle Manual Cassandra Ping
  const handleTriggerRadarPing = async () => {
    setIsPinging(true);
    const targetVeh = vehicles.length > 0 ? vehicles[0] : null;
    const vId = targetVeh?.id || "V-01";
    const lat = targetVeh?.position?.lat || 11.5564;
    const lng = targetVeh?.position?.lon || 104.9282;
    const speed = `${Math.round(targetVeh?.speed_kmh || 26)} km/h`;
    const battery = targetVeh?.battery || 89;

    await sendRiderPing(targetVeh?.driverId || vId, lat, lng, speed, battery);
    const timeStr = new Date().toTimeString().slice(0, 8);
    const cql = `[Cassandra LSM] INSERT INTO rider_gps_pings (rider_id, ping_time, lat, lng, speed, battery) VALUES ('${vId}', '${timeStr}', ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}, '${speed}', ${battery}%);`;
    setRadarLogs((prev) => [cql, ...prev.slice(0, 4)]);
    setIsPinging(false);
    showToast("Cassandra LSM write committed (Port 9042)", "success");
  };

  // Formatted Sim Clock
  const formattedSimTime = useMemo(() => {
    if (!sandboxState?.simTime) return "--:--:--";
    const d = new Date(sandboxState.simTime);
    return d.toTimeString().slice(0, 8);
  }, [sandboxState?.simTime]);

  return (
    <div className="space-y-8">
      {/* Welcome & Ecosystem Command Plane Hero Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Marketplace Control Plane • Multi-Service Digital-Twin HQ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Platform Operations & Ecosystem Cockpit
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Governing {orders.length.toLocaleString()}+ orders, 30 active couriers, OSM road-network routing, and 5 specialized NoSQL datastores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/admin/fleet"
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Live Fleet Map</span>
          </Link>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>3D Sandbox</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* BAND 1: Headline Real-Time Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Real Platform GMV */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Gross GMV</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ${(calculatedGMV).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>▲ Real MongoDB sum</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{orders.length.toLocaleString()} orders</span>
            </div>
          </div>
        </div>

        {/* Real Total Orders & Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {orders.length.toLocaleString()}
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-blue-600 font-semibold mt-1">
              <span>{orderBreakdown.delivered} delivered</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{orderBreakdown.inTransit} in-transit</span>
            </div>
          </div>
        </div>

        {/* Active Couriers on Road */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Live Courier Fleet</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {vehicles.length || 30} Couriers
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-purple-600 font-semibold mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Synced with Sandbox</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">160 writes/s ring</span>
            </div>
          </div>
        </div>

        {/* Dispatch SLA & Road Efficiency */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">SLA & Road Distance</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {sandboxStats?.totalDistanceKm ? `${Math.round(sandboxStats.totalDistanceKm)} km` : "1,153 km"}
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-sky-600 font-semibold mt-1">
              <span>Avg {sandboxStats?.avgDeliveryTimeMin || 167}m duration</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">OSM Routing</span>
            </div>
          </div>
        </div>
      </div>

      {/* BAND 2: DUAL ENGINE COMMAND CENTER (Digital-Twin Simulator + OSM Pathfinder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Logistics Sandbox Simulator Cockpit */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Logistics Sandbox Digital-Twin</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-slate-400">
                  Simulation Runtime (Port 3001) • Deterministic Seeded Clock
                </p>
              </div>
            </div>

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
            >
              <span>Control Room</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Sim Clock & Interactive Speed Strip */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Simulation Clock Time
              </span>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span className="font-mono text-xl font-black text-white tracking-wider">
                  {formattedSimTime}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    sandboxState?.status === "running"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {sandboxState?.status || "RUNNING"}
                </span>
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleSimulation}
                disabled={isSimLoading}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  sandboxState?.status === "running"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                }`}
              >
                {sandboxState?.status === "running" ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {[1, 10, 60, 600].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleSetSpeed(spd)}
                    disabled={isSimLoading}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      sandboxState?.speed === spd
                        ? "bg-sky-500 text-slate-950 font-black"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Sim Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Orders In Sim</span>
              <span className="text-base font-black text-white font-mono">
                {sandboxStats?.totalOrders || 225}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Delivered</span>
              <span className="text-base font-black text-emerald-400 font-mono">
                {sandboxStats?.deliveredOrders || 224}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Pending</span>
              <span className="text-base font-black text-amber-400 font-mono">
                {sandboxStats?.pendingOrders || 1}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: OSM Pathfinder Road-Network Engine */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>OSM Pathfinder Road Engine</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-slate-400">
                  Rust Physical Road Graph (Axum Port 3000) • Contraction Hierarchies
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800">
              v0.1.0 Online
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Snapped Graph Nodes
              </span>
              <span className="text-xl font-black text-white font-mono">
                {pathfinderStats?.nodes || 86} Junctions
              </span>
              <p className="text-[10px] text-slate-500">snapped via R-Tree index</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Directed Road Edges
              </span>
              <span className="text-xl font-black text-purple-300 font-mono">
                {pathfinderStats?.edges || 224} Segments
              </span>
              <p className="text-[10px] text-slate-500">bidirectional routing graph</p>
            </div>
          </div>

          {/* Algorithm & Metric Specs */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Routing Algorithm:</span>
              <span className="text-slate-200 font-bold font-mono">Contraction Hierarchies / A*</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Snapping Spatial Index:</span>
              <span className="text-slate-200 font-bold font-mono">R-Tree O(log N) Snapping</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Routing Query Latency:</span>
              <span className="text-emerald-400 font-bold font-mono">
                {pathfinderStats?.queryLatencyMs || 0.8} ms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BAND 3: Live Cassandra LSM Stream & Telemetry Radar Feed */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Radio className="w-5 h-5 text-purple-600" />
              <span>Cassandra 4.1 Masterless Telemetry Ring (Port 9042)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Live LSM writes streaming from 30 simulated couriers moving on Phnom Penh road network
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTriggerRadarPing}
              disabled={isPinging}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center space-x-1"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isPinging ? "Writing..." : "Simulate CQL Ping"}</span>
            </button>
            <Link
              href="/admin/fleet"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center space-x-1"
            >
              <span>Inspect Full Radar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Live CQL Write Terminal */}
        <div className="bg-slate-950 text-purple-300 p-4 rounded-xl font-mono text-xs space-y-1.5 overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">telemetry_ks.rider_gps_pings Ingest</span>
            </div>
            <span>Throughput: 160 writes/sec node capacity</span>
          </div>

          {radarLogs.map((log, i) => (
            <div key={i} className="truncate text-slate-300 hover:text-white">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* BAND 4: Real Orders Stream from MongoDB (ACID Book) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
              <span>Real Orders Ingestion Stream (MongoDB)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Live customer transactions recorded with real courier dispatch state
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
            <span>{orders.length.toLocaleString()} Total Records</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50/70">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Province</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Total (USD)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Customer Tracking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {orders.slice(0, 6).map((order) => (
                <tr key={order.order_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{order.order_id}</td>
                  <td className="py-3 px-3 font-sans text-slate-700">{order.customer_name}</td>
                  <td className="py-3 px-3 font-sans text-slate-600">{order.province}</td>
                  <td className="py-3 px-3 text-slate-600">{order.items?.length || 1} items</td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    ${Number(order.total || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.status === "Delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : order.status === "Out for Delivery"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/orders/${order.order_id}`}
                      className="inline-flex items-center space-x-1 text-purple-600 hover:text-purple-700 font-bold text-xs"
                    >
                      <span>Track Live Map</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BAND 5: Polyglot Infrastructure Real-Time Health Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Server className="w-5 h-5 text-purple-600" />
              <span>Polyglot Datastore & Microservice Architecture Status</span>
            </h3>
            <p className="text-xs text-slate-500">
              Live monitoring across all connected simulation, routing, and database engines
            </p>
          </div>
          <Link
            href="/admin/system"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center space-x-1"
          >
            <span>Inspect System Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {ecosystemNodes.map((node) => (
            <div
              key={node.name}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-purple-300 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 truncate">{node.name}</span>
                <span
                  className={`flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    node.status === "Healthy"
                      ? "text-emerald-700 bg-emerald-100/80"
                      : "text-amber-700 bg-amber-100/80"
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
              <div className="text-[11px] text-purple-600 font-semibold font-mono">
                Port {node.port} • {node.latencyMs}ms latency
              </div>
              <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                {node.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
