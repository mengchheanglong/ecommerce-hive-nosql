"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { OrderRecord, RiderTelemetry } from "@/types";
import {
  Truck,
  MapPin,
  Radio,
  Gauge,
  Battery,
  Phone,
  ExternalLink,
  Navigation,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Compass,
} from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

interface LiveOrderTrackingMapProps {
  order: OrderRecord;
  riders: RiderTelemetry[];
}

const DEPOT_COORDS: [number, number] = [104.9223, 11.5680]; // Central Market Depot [lon, lat]

// High-definition vector basemaps (clean road graphs, zero watermarks, zero API keys required)
const THEMES = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  liberty: "https://tiles.openfreemap.org/styles/liberty",
};

function getDestinationCoords(address?: string, province?: string): [number, number] {
  const addr = (address || "").toLowerCase();
  if (addr.includes("boeung tumpun") || addr.includes("meanchey") || addr.includes("271")) {
    return [104.9085, 11.5305];
  }
  if (addr.includes("pasteur") || addr.includes("bkk1") || addr.includes("keng kang")) {
    return [104.9248, 11.5520];
  }
  if (addr.includes("tuol kork") || addr.includes("tk")) {
    return [104.8970, 11.5750];
  }
  if (addr.includes("norodom") || addr.includes("tonle bassac") || addr.includes("bassac")) {
    return [104.9350, 11.5450];
  }
  if (addr.includes("teuk thla") || addr.includes("sen sok") || addr.includes("russian federation")) {
    return [104.8780, 11.5620];
  }
  if (addr.includes("chroy changvar") || addr.includes("ocic")) {
    return [104.9380, 11.5950];
  }
  if (addr.includes("riverside") || addr.includes("daun penh") || addr.includes("wat phnom")) {
    return [104.9310, 11.5750];
  }
  if (province === "Siem Reap") {
    return [103.8564, 13.3633];
  }
  if (province === "Battambang") {
    return [103.2022, 13.0957];
  }
  return [104.9282, 11.5564]; // Central Phnom Penh
}

function parseCoord(val: number | string | undefined, defaultVal: number): number {
  if (typeof val === "number") return val;
  if (!val) return defaultVal;
  const num = parseFloat(String(val).replace(/[^\d.-]/g, ""));
  return isNaN(num) ? defaultVal : num;
}

function calculateDistanceKm(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function LiveOrderTrackingMap({ order, riders }: LiveOrderTrackingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const maplibreglRef = useRef<any>(null);
  const courierMarkerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapTheme, setMapTheme] = useState<"dark" | "liberty">("dark");
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | null>(null);
  const routeGeometryRef = useRef<[number, number][] | null>(null);

  // Match the assigned courier
  const assignedRider = useMemo(() => {
    return (
      riders.find((r) => r.id === order.assigned_courier_id) ||
      riders.find((r) => r.name.toLowerCase() === (order.assigned_courier_name || "").toLowerCase()) ||
      riders.find((r) => r.city.toLowerCase() === order.province.toLowerCase()) ||
      riders[0]
    );
  }, [riders, order.assigned_courier_id, order.assigned_courier_name, order.province]);

  const [sandboxVehicle, setSandboxVehicle] = useState<any | null>(null);
  const [isSandboxConnected, setIsSandboxConnected] = useState(false);

  // Poll Logistics Sandbox backend (port 8500) for direct real-time digital-twin synchronization
  useEffect(() => {
    let active = true;
    async function pollSandboxTelemetry() {
      try {
        const res = await fetch("/sandbox-api/vehicles", {
          signal: AbortSignal.timeout(1500),
        }).catch(() => fetch("http://localhost:8500/api/vehicles", { signal: AbortSignal.timeout(1500) }));
        if (res.ok) {
          const vehicles = await res.json();
          if (active && Array.isArray(vehicles) && vehicles.length > 0) {
            setIsSandboxConnected(true);
            const matched =
              vehicles.find((v: any) => v.assignedOrderIds?.includes(order.order_id)) ||
              vehicles.find((v: any) => v.driverId === order.assigned_courier_id) ||
              vehicles.find((v: any) => v.id === order.assigned_courier_id) ||
              vehicles.find(
                (v: any) =>
                  v.driverName &&
                  order.assigned_courier_name &&
                  v.driverName.toLowerCase() === order.assigned_courier_name.toLowerCase()
              ) ||
              vehicles[0];

            if (matched) {
              setSandboxVehicle(matched);
              if (matched.routeGeometry && Array.isArray(matched.routeGeometry) && matched.routeGeometry.length > 1) {
                setRouteGeometry(matched.routeGeometry);
              }
            }
            return;
          }
        }
      } catch {
        if (active) setIsSandboxConnected(false);
      }
    }

    pollSandboxTelemetry();
    const interval = setInterval(pollSandboxTelemetry, 1500);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [order.order_id, order.assigned_courier_id, order.assigned_courier_name]);

  const destCoords = useMemo(
    () => getDestinationCoords(order.delivery_address, order.province),
    [order.delivery_address, order.province]
  );

  const riderCoords = useMemo<[number, number]>(() => {
    if (order.status === "Delivered") return destCoords;
    if (sandboxVehicle?.position?.lat && sandboxVehicle?.position?.lon) {
      return [sandboxVehicle.position.lon, sandboxVehicle.position.lat];
    }
    if (!assignedRider) return DEPOT_COORDS;
    const lat = parseCoord(assignedRider.lat, DEPOT_COORDS[1]);
    const lon = parseCoord(assignedRider.lng, DEPOT_COORDS[0]);
    return [lon, lat];
  }, [sandboxVehicle, assignedRider, order.status, destCoords]);

  const riderPhone =
    order.courier_phone ||
    (assignedRider?.city === "Siem Reap"
      ? "+855 15 777 666"
      : assignedRider?.city === "Battambang"
      ? "+855 17 444 333"
      : "+855 12 999 888");

  // Fetch real OSM road network route from osm-pathfinder (port 3000)
  useEffect(() => {
    let active = true;
    async function fetchRoadRoute() {
      try {
        const res = await fetch("http://localhost:3000/api/route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            start_lat: DEPOT_COORDS[1],
            start_lon: DEPOT_COORDS[0],
            end_lat: destCoords[1],
            end_lon: destCoords[0],
            algorithm: "astar",
            metric: "time",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (active && data.path && Array.isArray(data.path) && data.path.length > 0) {
            setRouteGeometry(data.path);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not query osm-pathfinder route, using direct vector:", err);
      }
      if (active) {
        setRouteGeometry([DEPOT_COORDS, destCoords]);
      }
    }

    fetchRoadRoute();
    return () => {
      active = false;
    };
  }, [destCoords]);

  // Keep route ref in sync for event listeners
  useEffect(() => {
    routeGeometryRef.current = routeGeometry;
  }, [routeGeometry]);

  // Robust route polyline layer applier
  const applyRouteToMap = useCallback((map: any, geom: [number, number][] | null) => {
    if (!map || !geom || geom.length < 2) return;
    if (!map.isStyleLoaded()) return;

    const geojsonData: any = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: geom,
      },
    };

    try {
      if (map.getSource("osm-route")) {
        map.getSource("osm-route").setData(geojsonData);
      } else {
        map.addSource("osm-route", {
          type: "geojson",
          data: geojsonData,
        });

        // Glowing cyan outer halo
        map.addLayer({
          id: "osm-route-glow",
          type: "line",
          source: "osm-route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#38bdf8",
            "line-width": 8,
            "line-opacity": 0.5,
          },
        });

        // Sharp electric cyan delivery core
        map.addLayer({
          id: "osm-route-core",
          type: "line",
          source: "osm-route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#0ea5e9",
            "line-width": 4,
            "line-opacity": 1.0,
          },
        });
      }
    } catch (err) {
      console.warn("Could not render osm-route layer:", err);
    }
  }, []);

  // Initialize MapLibre GL map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let mapInstance: any = null;
    let isDisposed = false;

    import("maplibre-gl").then((mapModule) => {
      if (isDisposed || !mapContainerRef.current) return;
      const maplibregl = (mapModule as any).Map ? mapModule : (mapModule as any).default || mapModule;
      maplibreglRef.current = maplibregl;

      // Explicitly configure absolute worker URL to prevent Next.js relative subroute resolution errors
      const setWorker = (mapModule as any).setWorkerUrl || (maplibregl as any).setWorkerUrl;
      if (typeof setWorker === "function") {
        setWorker(`${window.location.origin}/maplibre-gl-worker.mjs`);
      }

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: THEMES[mapTheme],
        center: [
          (DEPOT_COORDS[0] + destCoords[0]) / 2,
          (DEPOT_COORDS[1] + destCoords[1]) / 2,
        ],
        zoom: 13,
        pitch: 35,
        bearing: 10,
        attributionControl: false,
      });

      mapInstance = map;
      mapRef.current = map;

      const setupElements = () => {
        if (isDisposed) return;
        setMapLoaded(true);
        try {
          map.resize();
        } catch {}

        if (!courierMarkerRef.current) {
          // 1. Central Depot Pin
          const depotEl = document.createElement("div");
          depotEl.className = "flex items-center justify-center cursor-pointer";
          depotEl.innerHTML = `
            <div style="background: #0f172a; border: 2px solid #10b981; border-radius: 9999px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16,185,129,0.4);">
              <span style="font-size: 16px;">🏢</span>
            </div>
          `;
          new maplibregl.Marker({ element: depotEl })
            .setLngLat(DEPOT_COORDS)
            .setPopup(
              new maplibregl.Popup({ offset: 25 }).setHTML(`
                <div style="padding: 6px; font-family: sans-serif; font-size: 12px;">
                  <b style="color: #0f172a;">Rentify Central Depot</b><br/>
                  <span style="color: #64748b;">Phnom Penh Hub (Origin)</span>
                </div>
              `)
            )
            .addTo(map);

          // 2. Customer Destination Pin
          const destEl = document.createElement("div");
          destEl.className = "flex items-center justify-center cursor-pointer";
          destEl.innerHTML = `
            <div style="background: #f43f5e; border: 2px solid #ffffff; border-radius: 9999px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(244,63,94,0.5);">
              <span style="font-size: 16px;">📍</span>
            </div>
          `;
          new maplibregl.Marker({ element: destEl })
            .setLngLat(destCoords)
            .setPopup(
              new maplibregl.Popup({ offset: 25 }).setHTML(`
                <div style="padding: 6px; font-family: sans-serif; font-size: 12px;">
                  <b style="color: #0f172a;">Delivery Destination</b><br/>
                  <span style="color: #64748b;">${order.delivery_address || "Customer Address"}</span>
                </div>
              `)
            )
            .addTo(map);

          // 3. Live Courier Marker (Pulsing Radar Beacon)
          const courierEl = document.createElement("div");
          courierEl.className = "flex items-center justify-center cursor-pointer relative";
          courierEl.innerHTML = `
            <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(59,130,246,0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; background: #2563eb; border: 2px solid #ffffff; border-radius: 9999px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(37,99,235,0.6); z-index: 10;">
              <span style="font-size: 15px;">🚚</span>
            </div>
          `;

          const courierMarker = new maplibregl.Marker({ element: courierEl })
            .setLngLat(riderCoords)
            .setPopup(
              new maplibregl.Popup({ offset: 25 }).setHTML(`
                <div style="padding: 6px; font-family: sans-serif; font-size: 12px;">
                  <b style="color: #2563eb;">Courier: ${assignedRider?.name || "Driver"}</b><br/>
                  <span style="color: #64748b;">Status: ${order.status}</span>
                </div>
              `)
            )
            .addTo(map);

          courierMarkerRef.current = courierMarker;

          // Auto-fit camera bounds to encompass Depot, Courier, Destination, and Route
          try {
            const bounds = new maplibregl.LngLatBounds();
            bounds.extend(DEPOT_COORDS);
            bounds.extend(destCoords);
            bounds.extend(riderCoords);
            if (routeGeometryRef.current && routeGeometryRef.current.length > 0) {
              routeGeometryRef.current.forEach((pt) => bounds.extend(pt));
            }
            map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
          } catch {}
        }

        applyRouteToMap(map, routeGeometryRef.current);
      };

      map.on("load", () => {
        setupElements();
      });

      map.on("idle", () => {
        if (!mapLoaded) setMapLoaded(true);
        applyRouteToMap(map, routeGeometryRef.current);
      });

      if (map.loaded()) {
        setupElements();
      }

      // Fallback timer: ensure overlay is dismissed and UI elements exist within 800ms
      const safetyTimer = setTimeout(() => {
        if (!isDisposed) {
          setupElements();
        }
      }, 800);

      map.on("error", (e: any) => {
        console.warn("MapLibre notice:", e);
      });
    });

    return () => {
      isDisposed = true;
      if (mapInstance) {
        mapInstance.remove();
        mapRef.current = null;
        courierMarkerRef.current = null;
      }
    };
  }, [destCoords]);

  // Update Courier Marker live when rider telemetry changes
  useEffect(() => {
    if (courierMarkerRef.current && riderCoords) {
      courierMarkerRef.current.setLngLat(riderCoords);
    }
  }, [riderCoords]);

  // Update Route Polyline when geometry arrives
  useEffect(() => {
    routeGeometryRef.current = routeGeometry;
    if (mapRef.current && routeGeometry) {
      applyRouteToMap(mapRef.current, routeGeometry);

      if (maplibreglRef.current) {
        try {
          const bounds = new maplibreglRef.current.LngLatBounds();
          bounds.extend(DEPOT_COORDS);
          bounds.extend(destCoords);
          bounds.extend(riderCoords);
          routeGeometry.forEach((pt: [number, number]) => bounds.extend(pt));
          mapRef.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
        } catch {}
      }
    }
  }, [routeGeometry, destCoords, riderCoords, applyRouteToMap]);

  // Distance remaining and dynamic ETA
  const distanceRemainingKm = useMemo(() => {
    return calculateDistanceKm(
      riderCoords[0],
      riderCoords[1],
      destCoords[0],
      destCoords[1]
    );
  }, [riderCoords, destCoords]);

  const etaMinutes = useMemo(() => {
    if (order.status === "Delivered") return 0;
    const speedNum = parseCoord(assignedRider?.speed, 28);
    const effectiveSpeed = Math.max(15, speedNum);
    const hours = distanceRemainingKm / effectiveSpeed;
    return Math.max(1, Math.round(hours * 60));
  }, [distanceRemainingKm, assignedRider?.speed, order.status]);

  const isDelivered = order.status === "Delivered";
  const isEnRoute = order.status === "Out for Delivery";

  return (
    <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden relative">
      {/* Top Telemetry Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-sm ${
              isDelivered
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : isEnRoute
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}
          >
            {isDelivered ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Truck className="w-5 h-5 text-blue-400 animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold text-white tracking-tight">
                {isDelivered
                  ? "Order Successfully Delivered"
                  : isEnRoute
                  ? "Live Delivery Courier Tracking"
                  : "Order Preparing at Central Hub"}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isDelivered
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : isEnRoute
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Demo tracking: simulated positions or fixtures · no observed GPS</span>
            </p>
          </div>
        </div>

        {/* 1-Click Link to Logistics Sandbox Control Room */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-sm hover:text-white"
        >
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Inspect in Logistics Sandbox Control Room</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>

      {/* Map Canvas with Overlays */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-900 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full" />

        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm z-10 text-slate-400 font-mono text-xs gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span>Connecting to Digital-Twin Telemetry Map...</span>
          </div>
        )}

        {/* Floating Live Telemetry HUD Strip */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* ETA / Distance Pill */}
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 shadow-lg flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {isDelivered
                  ? "Arrived"
                  : `Estimated Arrival: ~${etaMinutes} min${etaMinutes > 1 ? "s" : ""}`}
              </span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center space-x-1.5 text-slate-300 font-mono">
              <Navigation className="w-3 h-3 text-blue-400" />
              <span>
                {isDelivered ? "0.0 km" : `${distanceRemainingKm.toFixed(2)} km away`}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Basemap Style Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextTheme = mapTheme === "dark" ? "liberty" : "dark";
                setMapTheme(nextTheme);
                if (mapRef.current) {
                  mapRef.current.setStyle(THEMES[nextTheme]);
                  mapRef.current.once("idle", () => {
                    applyRouteToMap(mapRef.current, routeGeometryRef.current);
                  });
                }
              }}
              className="pointer-events-auto bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/80 text-[11px] text-slate-300 font-medium transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg hover:text-white"
              title="Toggle between Dark Matter and Streets basemap"
            >
              <span>{mapTheme === "dark" ? "🌙 Dark" : "🗺️ Streets"}</span>
            </button>

            {/* Live Telemetry Source Indicator */}
            {isSandboxConnected ? (
              <div className="pointer-events-auto flex items-center space-x-1.5 bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-emerald-500/50 text-[10px] text-emerald-300 font-mono shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Port 8500 • Sandbox Synced</span>
              </div>
            ) : (
              <div className="pointer-events-auto hidden sm:flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/80 text-[10px] text-slate-400 font-mono">
                <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
                <span>Demo positions · no durable GPS sink</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="p-4 sm:p-5 bg-slate-900/95 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Courier Identity */}
        <div className="flex items-center space-x-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-white truncate">
                {sandboxVehicle?.driverName || assignedRider?.name || "Assigned Driver"}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                {sandboxVehicle?.driverId || sandboxVehicle?.id || assignedRider?.id || "DRV-001"}
              </span>
            </div>
            <a
              href={`tel:${riderPhone.replace(/\s+/g, "")}`}
              className="text-[11px] text-blue-400 hover:underline flex items-center space-x-1 mt-0.5"
            >
              <Phone className="w-3 h-3" />
              <span>{riderPhone}</span>
            </a>
          </div>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center justify-around bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold flex items-center justify-center gap-1">
              <Gauge className="w-3 h-3 text-blue-400" />
              <span>Speed</span>
            </p>
            <p className="font-mono font-bold text-white mt-0.5">
              {isDelivered
                ? "0.0 km/h"
                : sandboxVehicle?.speed_kmh !== undefined
                ? `${sandboxVehicle.speed_kmh.toFixed(1)} km/h`
                : assignedRider?.speed || "28.4 km/h"}
            </p>
          </div>
          <div className="w-[1px] h-6 bg-slate-800" />
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold flex items-center justify-center gap-1">
              <Battery className="w-3 h-3 text-emerald-400" />
              <span>Battery</span>
            </p>
            <p className="font-mono font-bold text-emerald-400 mt-0.5">
              {assignedRider?.battery || 92}%
            </p>
          </div>
        </div>

        {/* Origin & Destination Hubs */}
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-[11px] flex flex-col justify-center space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Central Market Hub → Destination</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300 font-mono text-[10px]">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">
              GPS: {riderCoords[1].toFixed(4)}° N, {riderCoords[0].toFixed(4)}° E
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
