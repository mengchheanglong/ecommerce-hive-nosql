"use client";

import React, { useState, useEffect } from "react";
import { FleetConsole } from "@/components/merchant/FleetConsole";
import { fetchRiders } from "@/lib/api";
import { RiderTelemetry } from "@/types";
import { Radio, Truck, Server, Cpu } from "lucide-react";

export default function AdminFleetPage() {
  const [riders, setRiders] = useState<RiderTelemetry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchRiders();
      setRiders(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Platform Admin</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">Cassandra Fleet Telemetry</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
              <Truck className="w-6 h-6 text-purple-600" />
              <span>800-Rider Fleet Telemetry Console</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Cassandra 4.1 Masterless Cluster (Port 9042) • 13.8M pings/day (160 writes/sec node throughput)
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
            <Radio className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span>Phnom Penh • Siem Reap • Battambang Ring Active</span>
          </div>
        </div>
      </div>

      <FleetConsole initialRiders={riders} />
    </div>
  );
}
