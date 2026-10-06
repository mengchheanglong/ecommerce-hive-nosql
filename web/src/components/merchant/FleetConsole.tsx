"use client";

import React, { useState, useEffect } from "react";
import { RiderTelemetry } from "@/types";
import { INITIAL_RIDERS } from "@/lib/data";
import { sendRiderPing } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Truck, Terminal, Play, Pause, MapPin, Battery, Gauge, Zap, Send, Radio } from "lucide-react";

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
      {/* Top Banner & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium mb-1">
            <span>Merchant Console</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Delivery Telemetry</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Cassandra Telemetry Fleet Command</h3>
          <p className="text-xs text-slate-500">
            High-throughput time-series ingestion (160 writes / second • 13.8M rows / day across 800 riders)
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80">
          {["All", "Phnom Penh", "Siem Reap", "Battambang"].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCity === city
                  ? "bg-slate-900 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {city}
            </button>
          ))}
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
                  <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-slate-800">{rider.speed}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60 flex items-center space-x-1.5">
                  <Battery className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-slate-800">{rider.battery}%</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{rider.lat}</span>
                </span>
                <span>{rider.lng}</span>
              </div>
            </div>

            <button
              onClick={() => handleSimulatePing(rider.id)}
              disabled={pingingRiderId === rider.id}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-[11px] font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3 text-emerald-500" />
              <span>{pingingRiderId === rider.id ? "Writing to Cassandra..." : "Simulate CQL Ping"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
