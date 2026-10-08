"use client";

import { useEffect, useState } from "react";
import { fetchFleetTelemetry } from "@/lib/api";
import { FleetTelemetrySnapshot, RiderTelemetry } from "@/types";

export function FleetConsole(_props: { initialRiders?: RiderTelemetry[] }) {
  const [snapshot, setSnapshot] = useState<FleetTelemetrySnapshot | null>(null);
  const [city, setCity] = useState("All");
  useEffect(() => {
    let cancelled = false;
    setSnapshot(null);
    async function refresh() {
      const data = await fetchFleetTelemetry(city);
      if (!cancelled) setSnapshot(data);
    }
    void refresh();
    const timer = setInterval(refresh, 2500);
    return () => { cancelled = true; clearInterval(timer); };
  }, [city]);
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-bold text-slate-900">Demo fleet telemetry</h2>
      <p className="text-sm text-slate-600" role="status">
        {snapshot?.source === "fixture" ? "Fixture data · illustrative positions · no observed GPS" :
         snapshot ? "Telemetry unavailable" : "Loading telemetry source…"}
      </p>
      <p className="text-xs text-slate-500">Storage: none · Cassandra sink not configured · GPS ingestion disabled.
        Simulated ping history belongs to the logistics sandbox and is lost when its process exits.</p>
      <label className="block text-sm">Fixture city
        <select value={city} onChange={event => setCity(event.target.value)} className="ml-3 rounded border p-2">
          {["All", "Phnom Penh", "Siem Reap", "Battambang"].map(value => <option key={value}>{value}</option>)}
        </select>
      </label>
      <p className="text-sm">{snapshot?.riders.length ?? 0} fixture riders</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {snapshot?.riders.map(rider => (
          <article key={rider.id} className="rounded-xl border p-3 text-sm">
            <h3 className="font-semibold">{rider.name} · {rider.id}</h3>
            <p>{rider.city} · {rider.status}</p>
            <p>{rider.lat}, {rider.lng} · {rider.speed} · {rider.battery}%</p>
            <span className="text-xs text-amber-700">Fixture — not a device reading</span>
          </article>
        ))}
      </div>
    </section>
  );
}
