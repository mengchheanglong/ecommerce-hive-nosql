"use client";

import React, { useState, useEffect } from "react";
import { RiderTelemetry } from "@/types";
import { INITIAL_RIDERS } from "@/lib/data";
import { sendRiderPing, fetchRiders } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Truck, Terminal, Play, Pause, MapPin, Battery, Gauge, Zap, Send, Radio, Cpu } from "lucide-react";

interface FleetConsoleProps {
  initialRiders?: RiderTelemetry[];
}

export function FleetConsole({ initialRiders = INITIAL_RIDERS }: FleetConsoleProps) {
  const [riders, setRiders] = useState<RiderTelemetry[]>(initialRiders);
  const [selectedCity, setSelectedCity] = useState("All");
  const [isStreaming, setIsStreaming] = useState(true);
  const [pingingRiderId, setPingingRiderId] = useState<string | null>(null);
  const { showToast } = useToast();

  const [logs, setLogs] = useState<string[]>([
    "[Cassandra LSM] Cluster connected on port 9042. Token partitioner active.",
    "[Cassandra LSM] Table telemetry_ks.rider_gps_pings initialized (TTL 30 days, TWCS enabled).",
    "[Cassandra LSM] INSERT INTO rider_gps_pings (rider_id, ping_time, speed) VALUES ('R-101', '10:14:02', '28 km/h');",
  ]);

  useEffect(() => {
    setRiders(initialRiders);
  }, [initialRiders]);

  // Live polling: automatically sync riders and real-time positions from sandbox/backend
  useEffect(() => {
    let active = true;
    const pollRiders = async () => {
      try {
        const fresh = await fetchRiders(selectedCity);
        if (active && fresh && fresh.length > 0) {
          setRiders(fresh);
        }
      } catch {
        // gracefully retain existing
      }
    };

    pollRiders();
    const interval = setInterval(pollRiders, 2500);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [selectedCity]);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const riderIds = ["R-101", "R-102", "R-103", "R-104", "R-201", "R-202", "R-301", "R-302"];
      const randomRider = riderIds[Math.floor(Math.random() * riderIds.length)];
      const speed = Math.floor(18 + Math.random() * 22);
      const timeStr = new Date().toTimeString().slice(0, 8);
      const log = `[Cassandra LSM] INSERT INTO rider_gps_pings (rider_id, ping_time, speed) VALUES ('${randomRider}', '${timeStr}', '${speed} km/h');`;
      setLogs((prev) => [log, ...prev.slice(0, 6)]);
    }, 2800);
    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleSimulatePing = async (riderId: string) => {
    setPingingRiderId(riderId);
    const speed = `${Math.floor(20 + Math.random() * 20)} km/h`;
    const battery = Math.floor(60 + Math.random() * 35);
    const newLat = `11.${Math.floor(5400 + Math.random() * 400)}° N`;
    const newLng = `104.${Math.floor(9100 + Math.random() * 300)}° E`;

    await sendRiderPing(riderId, newLat, newLng, speed, battery);

    setRiders((prev) =>
      prev.map((r) =>
        r.id === riderId
          ? {
              ...r,
              speed,
              battery,
              lat: newLat,
              lng: newLng,
            }
          : r
      )
    );

    const timeStr = new Date().toTimeString().slice(0, 8);
    const log = `[Cassandra LSM] INSERT INTO rider_gps_pings (rider_id, ping_time, speed) VALUES ('${riderId}', '${timeStr}', '${speed}');`;
    setLogs((prev) => [log, ...prev.slice(0, 6)]);

    setPingingRiderId(null);
    showToast(`Cassandra write committed for courier ${riderId}`, "success");
  };

  const filteredRiders =
    selectedCity === "All"
      ? riders
      : riders.filter((r) => r.city.toLowerCase() === selectedCity.toLowerCase());

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase().replace("_", " ");
    if (s === "delivering") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }
    if (s === "picked up") {
      return "bg-blue-50 text-blue-700 border border-blue-200";
    }
    return "bg-slate-100 text-slate-700 border border-slate-200";
  };

  return (
    <div className="space-y-6">
      {/* Fleet Region & Ring Filter Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
          <MapPin className="w-4 h-4 text-purple-600" />
          <span>Active Telemetry Ring:</span>
          <span className="text-slate-400 font-normal">Filter couriers by geographic cluster</span>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80">
          {["All", "Phnom Penh", "Siem Reap", "Battambang"].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCity === city
                  ? "bg-purple-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Cassandra Architecture Scale & Live Sync Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cassandra Benchmark Scale</p>
            <p className="text-xl font-black text-slate-900 font-mono mt-0.5">800 Riders</p>
            <p className="text-[10px] text-slate-500 mt-0.5">160 writes/s • 13.8M pings/day capacity</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Synchronized Fleet</p>
            <p className="text-xl font-black text-purple-700 font-mono mt-0.5">{riders.length} Active Couriers</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced with Logistics Sandbox (Port 3001)
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time-Series Table</p>
            <p className="text-xs font-mono font-bold text-slate-900 mt-1 truncate max-w-[200px]">
              telemetry_ks.rider_gps_pings
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">TTL: 30 days • TWCS Compaction</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Live CQL Ingestion Feed Terminal */}
      <div className="bg-slate-950 text-emerald-400 p-5 rounded-2xl border border-slate-800 font-mono text-xs space-y-3 shadow-inner">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">Live Cassandra CQL Ingestion Stream</span>
          </div>

          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-white cursor-pointer px-2.5 py-1 rounded bg-slate-900 border border-slate-800 transition-colors"
          >
            {isStreaming ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause Ingest</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>Resume Ingest</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-1">
          {logs.map((l, i) => (
            <div key={i} className="truncate text-emerald-300">
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* Active Rider Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRiders.map((rider) => (
          <div
            key={rider.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{rider.name}</h4>
                  <p className="text-[11px] font-mono text-slate-400">{rider.id} • {rider.city}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(
                    rider.status
                  )}`}
                >
                  {rider.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-3">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60 flex items-center space-x-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold text-slate-800">{rider.speed}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60 flex items-center space-x-1.5">
                  <Battery className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold text-slate-800">{rider.battery}%</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-purple-600" />
                  <span>
                    {typeof rider.lat === "number"
                      ? `${rider.lat.toFixed(4)}° N`
                      : rider.lat}
                  </span>
                </span>
                <span>
                  {typeof rider.lng === "number"
                    ? `${rider.lng.toFixed(4)}° E`
                    : rider.lng}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleSimulatePing(rider.id)}
              disabled={pingingRiderId === rider.id}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-[11px] font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3 text-blue-500" />
              <span>{pingingRiderId === rider.id ? "Writing to Cassandra..." : "Simulate CQL Ping"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
