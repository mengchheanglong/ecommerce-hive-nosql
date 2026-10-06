"use client";

import React, { useState, useEffect } from "react";
import { RiderTelemetry } from "@/types";
import { INITIAL_RIDERS } from "@/lib/data";
import { sendRiderPing } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Truck, Terminal, Play, Pause, MapPin, Battery, Gauge, Zap, Send } from "lucide-react";

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
      const riderIds = ["R-101", "R-102", "R-103", "R-201", "R-202", "R-301", "R-302"];
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
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;
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
      return "bg-[#eafaf4] text-[#0c835c] border border-[#9cf0ce]";
    }
    if (s === "picked up") {
      return "bg-blue-50 text-blue-700 border border-blue-200";
    }
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-[#013326]">Cassandra Telemetry Fleet Command</h3>
          <p className="text-xs text-[#5c7167]">
            High-throughput time-series ingestion (160 writes / second • 13.8M rows / day)
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-white p-1.5 rounded-2xl border border-[#e2eae5] shadow-xs">
          {["All", "Phnom Penh", "Siem Reap", "Battambang"].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCity === city
                  ? "bg-[#013326] text-white shadow-xs"
                  : "text-[#5c7167] hover:text-[#013326]"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Live CQL Ingestion Feed Terminal */}
      <div className="bg-[#011c15] text-[#9cf0ce] p-5 rounded-2xl border border-[#0a4636] font-mono text-xs space-y-3 shadow-inner">
        <div className="flex items-center justify-between pb-2 border-b border-[#0a4636]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15c089] animate-pulse" />
            <span className="font-bold text-white">Live Cassandra CQL Ingestion Stream</span>
          </div>

          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="flex items-center space-x-1 text-xs text-[#15c089] hover:text-white cursor-pointer px-2 py-0.5 rounded bg-[#0a4636]/50"
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
            className="bg-white rounded-3xl p-5 border border-[#e2eae5] shadow-card hover:shadow-hover transition-all duration-200 space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-[#013326]">{rider.name}</h4>
                  <p className="text-[11px] font-mono text-[#5c7167]">{rider.id} • {rider.city}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusBadge(
                    rider.status
                  )}`}
                >
                  {rider.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-3">
                <div className="bg-[#f6faf8] p-2 rounded-xl border border-[#e2eae5] flex items-center space-x-1.5">
                  <Gauge className="w-3.5 h-3.5 text-[#0c835c]" />
                  <span>{rider.speed}</span>
                </div>
                <div className="bg-[#f6faf8] p-2 rounded-xl border border-[#e2eae5] flex items-center space-x-1.5">
                  <Battery className="w-3.5 h-3.5 text-[#0c835c]" />
                  <span>{rider.battery}%</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-[#5c7167] flex items-center justify-between pt-2 mt-2 border-t border-[#f1f6f3]">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-[#15c089]" />
                  <span>{rider.lat}</span>
                </span>
                <span>{rider.lng}</span>
              </div>
            </div>

            <button
              onClick={() => handleSimulatePing(rider.id)}
              disabled={pingingRiderId === rider.id}
              className="w-full py-2 rounded-xl bg-[#f1f6f3] hover:bg-[#013326] hover:text-white text-[#013326] text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3 text-[#15c089]" />
              <span>{pingingRiderId === rider.id ? "Writing..." : "Simulate CQL Ping"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
