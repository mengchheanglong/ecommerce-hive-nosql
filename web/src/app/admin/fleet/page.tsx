"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  fetchSandboxVehicles,
  fetchSandboxState,
  fetchSandboxStats,
} from "@/lib/api";
import { SandboxVehicle, SandboxSimState, SandboxSimStats, RiderTelemetry } from "@/types";
import { useToast } from "@/context/ToastContext";
import {
  Truck,
  Radio,
  MapPin,
  Battery,
  Gauge,
  Navigation,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Zap,
  Cpu,
} from "lucide-react";

// Dynamically import AdminFleetMap without SSR
const AdminFleetMap = dynamic(
  () =>
    import("@/components/admin/AdminFleetMap").then((mod) => mod.AdminFleetMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[640px] rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono">Initializing High-Definition Road Network Vector Map...</p>
      </div>
    ),
  }
);

export default function AdminFleetPage() {
  const [vehicles, setVehicles] = useState<SandboxVehicle[]>([]);
  const [simState, setSimState] = useState<SandboxSimState | null>(null);
  const [simStats, setSimStats] = useState<SandboxSimStats | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [vehData, stateData, statsData] = await Promise.all([
        fetchSandboxVehicles(),
        fetchSandboxState(),
        fetchSandboxStats(),
      ]);

      if (vehData) {
        setVehicles(vehData);
      }
      setSimState(stateData);
      setSimStats(statsData);
    } catch {
      // Retain state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    showToast("Fleet telemetry refreshed", "info");
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "delivering" && (v.status === "delivering" || v.status === "en_route")) ||
      (filterStatus === "idle" && v.status === "idle") ||
      (filterStatus === "returning" && v.status === "returning");

    const matchesSearch =
      searchQuery === "" ||
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driverName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Platform Admin</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">Fleet Operations</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
              <Truck className="w-6 h-6 text-blue-600" />
              <span>Simulated Fleet & Road-Network Command Center</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulation positions from the logistics sandbox · in-memory history · no observed GPS or Cassandra sink
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
              <span>Refresh</span>
            </button>

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <span>Launch 3D Control Room</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Couriers</p>
            <p className="text-xl font-black text-slate-900 font-mono">{vehicles.length} Active</p>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Phnom Penh Roads</span>
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Truck className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Distance</p>
            <p className="text-xl font-black text-slate-900 font-mono">
              {simStats ? `${Math.round(simStats.totalDistanceKm)} km` : "Unavailable"}
            </p>
            <p className="text-[10px] text-slate-500">Road graph traversed</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Gauge className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sim Status</p>
            <p className="text-xl font-black text-slate-900 font-mono uppercase">
              {simState?.status ?? "Unavailable"}
            </p>
            <p className="text-[10px] text-blue-600 font-semibold">
              Speed: {simState?.speed ?? "—"}x
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Telemetry storage</p>
            <p className="text-xl font-black text-slate-900 font-mono">Volatile</p>
            <p className="text-[10px] text-emerald-600 font-semibold">Sandbox memory only</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Interactive Fleet Map */}
      <AdminFleetMap
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={(veh) => setSelectedVehicleId(veh ? veh.id : null)}
        simState={simState}
        onRefresh={loadData}
      />

      {/* Vehicle Filter Strip & Roster Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            {[
              { id: "all", label: `All (${vehicles.length})` },
              {
                id: "delivering",
                label: `In Transit (${vehicles.filter((v) => v.status === "delivering" || v.status === "en_route").length})`,
              },
              {
                id: "idle",
                label: `Idle (${vehicles.filter((v) => v.status === "idle").length})`,
              },
              {
                id: "returning",
                label: `Returning (${vehicles.filter((v) => v.status === "returning").length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterStatus === tab.id
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vehicle or driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Courier Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVehicles.map((vehicle) => {
            const isSelected = vehicle.id === selectedVehicleId;
            return (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicleId(vehicle.id)}
                className={`bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "border-sky-500 shadow-md ring-2 ring-sky-500/20"
                    : "border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{vehicle.name || vehicle.id}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Driver: <strong className="text-slate-700">{vehicle.driverName || "Courier"}</strong>
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        vehicle.status === "delivering" || vehicle.status === "en_route"
                          ? "bg-sky-50 text-sky-700 border border-sky-200"
                          : vehicle.status === "idle"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-3">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60 flex items-center space-x-1.5">
                      <Gauge className="w-3.5 h-3.5 text-sky-600" />
                      <span className="font-semibold text-slate-800">
                        {Math.round(vehicle.speed_kmh || 0)} km/h
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60 flex items-center space-x-1.5">
                      <Battery className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold text-slate-800">
                        {vehicle.battery ?? "—"}%
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{vehicle.position?.lat?.toFixed(4)}° N</span>
                    </span>
                    <span>{vehicle.position?.lon?.toFixed(4)}° E</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVehicleId(vehicle.id);
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold transition-all flex items-center justify-center space-x-1"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Track on Map</span>
                  </button>


                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
