"use client";

import React, { useState, useEffect } from "react";
import { FleetConsole } from "@/components/merchant/FleetConsole";
import { fetchRiders } from "@/lib/api";
import { RiderTelemetry } from "@/types";

export default function MerchantFleetPage() {
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
      <FleetConsole initialRiders={riders} />
    </div>
  );
}
