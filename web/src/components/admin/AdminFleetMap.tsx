"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { SandboxVehicle, SandboxSimState } from "@/types";
import { controlSandboxSimulation, setSandboxSpeed } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import {
  Truck,
  Play,
  Pause,
  Clock,
  Compass,
  Navigation,
  Battery,
  Gauge,
  Radio,
  Layers,
  Search,
  Maximize2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

interface AdminFleetMapProps {
  vehicles: SandboxVehicle[];
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicle: SandboxVehicle | null) => void;
  onSimulatePing?: (vehicle: SandboxVehicle) => void;
  simState?: SandboxSimState | null;
  onRefresh?: () => void;
}

const DEPOTS: Array<{ id: string; name: string; coords: [number, number]; area: string }> = [
  {
    id: "depot-central",
    name: "Central Market Depot (Hub A)",
    coords: [104.9223, 11.5680],
    area: "Daun Penh, Phnom Penh",
  },
  {
    id: "depot-russian",
    name: "Russian Market Depot (Hub B)",
    coords: [104.9280, 11.5490],
    area: "Tuol Tompoung, Phnom Penh",
  },
];

const THEMES = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  liberty: "https://tiles.openfreemap.org/styles/liberty",
};

export function AdminFleetMap({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  onSimulatePing,
  simState,
  onRefresh,
}: AdminFleetMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const maplibreglRef = useRef<any>(null);
  const vehicleMarkersRef = useRef<Map<string, any>>(new Map());
  const depotMarkersRef = useRef<any[]>([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapTheme, setMapTheme] = useState<"dark" | "liberty">("dark");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoFollow, setAutoFollow] = useState(false);
  const [isChangingSim, setIsChangingSim] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { showToast } = useToast();

  const selectedVehicle = useMemo(() => {
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  // Status badge styling
  const getVehicleColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivering":
      case "en_route":
        return "#38bdf8"; // Sky blue
      case "returning":
        return "#f59e0b"; // Amber
      case "idle":
        return "#10b981"; // Emerald
      case "broken_down":
        return "#ef4444"; // Red
      default:
        return "#8b5cf6"; // Purple
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "motorcycle":
        return "🛵";
      case "van":
        return "🚐";
      case "truck":
      default:
        return "🚚";
    }
  };

  // Format Sim Clock
  const formattedSimTime = useMemo(() => {
    if (!simState?.simTime) return "--:--:--";
    const d = new Date(simState.simTime);
    return d.toTimeString().slice(0, 8);
  }, [simState?.simTime]);

  // Handle Simulation Play/Pause
  const handleToggleSimulation = async () => {
    setIsChangingSim(true);
    const action = simState?.status === "running" ? "pause" : "resume";
    const res = await controlSandboxSimulation(action);
    if (res.success) {
      showToast(
        action === "pause" ? "Simulation paused" : "Simulation running",
        "info"
      );
      if (onRefresh) onRefresh();
    } else {
      showToast("Failed to toggle simulation state", "error");
    }
    setIsChangingSim(false);
  };

  // Handle Speed Change
  const handleChangeSpeed = async (newSpeed: number) => {
    setIsChangingSim(true);
    const res = await setSandboxSpeed(newSpeed);
    if (res.success) {
      showToast(`Simulation speed set to ${newSpeed}x`, "success");
      if (onRefresh) onRefresh();
    } else {
      showToast("Failed to update simulation speed", "error");
    }
    setIsChangingSim(false);
  };

  // Draw or update Route Polyline for selected vehicle
  const updateRoutePolyline = useCallback(
    (map: any, geom?: [number, number][]) => {
      if (!map || !map.isStyleLoaded()) return;

      const hasGeom = geom && Array.isArray(geom) && geom.length >= 2;
      const geojsonData: any = hasGeom
        ? {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: geom,
            },
          }
        : {
            type: "FeatureCollection",
            features: [],
          };

      try {
        if (map.getSource("active-vehicle-route")) {
          map.getSource("active-vehicle-route").setData(geojsonData);
        } else if (hasGeom) {
          map.addSource("active-vehicle-route", {
            type: "geojson",
            data: geojsonData,
          });

          // Outer glowing trail
          map.addLayer({
            id: "active-route-glow",
            type: "line",
            source: "active-vehicle-route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#0284c7",
              "line-width": 8,
              "line-opacity": 0.5,
            },
          });

          // Inner high-visibility laser line
          map.addLayer({
            id: "active-route-line",
            type: "line",
            source: "active-vehicle-route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#38bdf8",
              "line-width": 3.5,
              "line-opacity": 0.95,
            },
          });
        }
      } catch (err) {
        console.warn("Could not render active vehicle route polyline:", err);
      }
    },
    []
  );

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let mapInstance: any = null;
    let isDisposed = false;

    import("maplibre-gl").then((mapModule) => {
      if (isDisposed || !mapContainerRef.current) return;

      const maplibregl =
        (mapModule as any).Map ? mapModule : (mapModule as any).default || mapModule;
      maplibreglRef.current = maplibregl;

      // Configure worker URL for Next.js App Router
      const setWorker =
        (mapModule as any).setWorkerUrl || (maplibregl as any).setWorkerUrl;
      if (typeof setWorker === "function") {
        setWorker(`${window.location.origin}/maplibre-gl-worker.mjs`);
      }

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: THEMES[mapTheme],
        center: [104.9223, 11.5580], // Central Phnom Penh
        zoom: 12.8,
        pitch: 32,
        bearing: 0,
        attributionControl: false,
      });

      mapInstance = map;
      mapRef.current = map;

      map.on("load", () => {
        if (isDisposed) return;
        setMapLoaded(true);

        // Add Depots
        DEPOTS.forEach((depot) => {
          const depotEl = document.createElement("div");
          depotEl.className = "flex items-center justify-center cursor-pointer group";
          depotEl.innerHTML = `
            <div style="background: #1e1b4b; border: 2px solid #818cf8; border-radius: 9999px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(129,140,248,0.5);">
              <span style="font-size: 15px;">🏢</span>
            </div>
          `;

          const popup = new maplibregl.Popup({ offset: 20 }).setHTML(`
            <div style="padding: 6px; font-family: sans-serif; font-size: 12px; color: #0f172a;">
              <b style="color: #4338ca;">${depot.name}</b><br/>
              <span style="color: #64748b; font-size: 11px;">${depot.area}</span>
            </div>
          `);

          const marker = new maplibregl.Marker({ element: depotEl })
            .setLngLat(depot.coords)
            .setPopup(popup)
            .addTo(map);

          depotMarkersRef.current.push(marker);
        });
      });
    });

    return () => {
      isDisposed = true;
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch {}
      }
      mapRef.current = null;
      setMapLoaded(false);
      vehicleMarkersRef.current.clear();
      depotMarkersRef.current = [];
    };
  }, [mapTheme]);

  // Update vehicle markers and positions
  useEffect(() => {
    const map = mapRef.current;
    const maplibregl = maplibreglRef.current;
    if (!map || !maplibregl || !mapLoaded) return;

    const currentMap = vehicleMarkersRef.current;
    const activeIds = new Set<string>();

    vehicles.forEach((vehicle) => {
      const lat = vehicle.position?.lat;
      const lon = vehicle.position?.lon;
      if (
        typeof lat !== "number" ||
        typeof lon !== "number" ||
        isNaN(lat) ||
        isNaN(lon) ||
        lat < 10.0 ||
        lat > 15.0 ||
        lon < 102.0 ||
        lon > 108.0
      ) {
        return;
      }

      activeIds.add(vehicle.id);
      const isSelected = vehicle.id === selectedVehicleId;
      const color = getVehicleColor(vehicle.status);
      const icon = getVehicleIcon(vehicle.type);

      if (currentMap.has(vehicle.id)) {
        // Update existing marker position
        const marker = currentMap.get(vehicle.id);
        marker.setLngLat([lon, lat]);

        // Update styling if selection changed
        const el = marker.getElement();
        if (el) {
          el.style.transform = isSelected ? "scale(1.25)" : "scale(1)";
          el.style.zIndex = isSelected ? "99" : "10";
        }
      } else {
        // Create new marker element
        const el = document.createElement("div");
        el.className = "flex items-center justify-center cursor-pointer transition-transform duration-200";
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.zIndex = isSelected ? "99" : "10";
        el.innerHTML = `
          <div style="background: #0f172a; border: 2px solid ${color}; border-radius: 9999px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 10px ${color}80;">
            <span style="font-size: 13px;">${icon}</span>
          </div>
        `;

        el.addEventListener("click", () => {
          if (onSelectVehicle) {
            onSelectVehicle(vehicle);
          }
        });

        const popup = new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML(`
          <div style="padding: 6px; font-family: monospace; font-size: 11px; color: #0f172a;">
            <b>${vehicle.name || vehicle.id}</b> • <span style="color: ${color}; text-transform: uppercase;">${vehicle.status}</span><br/>
            <span>Driver: ${vehicle.driverName || "Assigned Courier"}</span><br/>
            <span>Speed: ${Math.round(vehicle.speed_kmh || 0)} km/h • Bat: ${vehicle.battery || 88}%</span>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lon, lat])
          .setPopup(popup)
          .addTo(map);

        currentMap.set(vehicle.id, marker);
      }
    });

    // Remove obsolete markers
    currentMap.forEach((marker, id) => {
      if (!activeIds.has(id)) {
        marker.remove();
        currentMap.delete(id);
      }
    });

    // Handle Auto Follow
    if (autoFollow && selectedVehicle?.position) {
      map.easeTo({
        center: [selectedVehicle.position.lon, selectedVehicle.position.lat],
        duration: 800,
      });
    }
  }, [vehicles, selectedVehicleId, mapLoaded, autoFollow, onSelectVehicle, selectedVehicle]);

  // Handle Selected Vehicle Route geometry
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (selectedVehicle?.routeGeometry && selectedVehicle.routeGeometry.length > 1) {
      updateRoutePolyline(map, selectedVehicle.routeGeometry);
    } else {
      updateRoutePolyline(map, undefined);
    }
  }, [selectedVehicle, mapLoaded, updateRoutePolyline]);

  // Fly to selected vehicle
  const handleFlyToVehicle = (vehicle: SandboxVehicle) => {
    const map = mapRef.current;
    if (!map || !vehicle.position) return;
    map.flyTo({
      center: [vehicle.position.lon, vehicle.position.lat],
      zoom: 14.5,
      pitch: 45,
      duration: 1200,
    });
  };

  // Reset Map View
  const handleResetView = () => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [104.9223, 11.5580],
      zoom: 12.8,
      pitch: 32,
      bearing: 0,
      duration: 1000,
    });
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl flex flex-col transition-all duration-300 ${
        isExpanded ? "h-[560px]" : "h-[380px] sm:h-[420px]"
      }`}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md p-2 sm:p-2.5 rounded-xl border border-slate-700/80 shadow-lg text-xs text-white">
        {/* Left: Simulation Clock & State */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 font-mono">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold text-white tracking-wide">{formattedSimTime}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleToggleSimulation}
              disabled={isChangingSim}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                simState?.status === "running"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
              }`}
            >
              {simState?.status === "running" ? (
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

            {/* Speed Multipliers */}
            <div className="hidden sm:flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {[1, 10, 60, 600].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleChangeSpeed(spd)}
                  disabled={isChangingSim}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    simState?.speed === spd
                      ? "bg-sky-500 text-slate-950 shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center / Right: Active Vehicles & Tools */}
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">{vehicles.length} Couriers</span>
          </div>

          <button
            onClick={() => setAutoFollow(!autoFollow)}
            className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-all cursor-pointer ${
              autoFollow
                ? "bg-sky-500/20 text-sky-300 border-sky-400/50"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span className="hidden md:inline">Auto-Follow</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center space-x-1 text-xs"
            title={isExpanded ? "Switch to Compact View" : "Expand Height"}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isExpanded ? "Compact" : "Expand"}</span>
          </button>

          <button
            onClick={handleResetView}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Reset Map to Phnom Penh Overview"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>

          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-sm"
          >
            <span>3D Sandbox</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full flex-1 relative bg-slate-950" />

      {/* Bottom Floating Vehicle Telemetry Drawer (when selected) */}
      {selectedVehicle && (
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-900/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-sky-500/40 shadow-2xl text-white animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                style={{
                  background: `${getVehicleColor(selectedVehicle.status)}20`,
                  border: `2px solid ${getVehicleColor(selectedVehicle.status)}`,
                }}
              >
                {getVehicleIcon(selectedVehicle.type)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                    {selectedVehicle.name || selectedVehicle.id}
                  </h4>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono tracking-wider"
                    style={{
                      background: `${getVehicleColor(selectedVehicle.status)}20`,
                      color: getVehicleColor(selectedVehicle.status),
                      border: `1px solid ${getVehicleColor(selectedVehicle.status)}50`,
                    }}
                  >
                    {selectedVehicle.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Driver: <strong className="text-slate-200">{selectedVehicle.driverName || "Courier"}</strong> • ID:{" "}
                  <span className="font-mono text-slate-300">{selectedVehicle.driverId}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-xs font-mono">
              <div className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Speed</span>
                <span className="font-bold text-sky-400">
                  {Math.round(selectedVehicle.speed_kmh || 0)} km/h
                </span>
              </div>
              <div className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Battery</span>
                <span className="font-bold text-emerald-400">
                  {selectedVehicle.battery || 92}%
                </span>
              </div>
              <div className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Orders</span>
                <span className="font-bold text-purple-400">
                  {selectedVehicle.assignedOrderIds?.length || 0} Assigned
                </span>
              </div>
              <div className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Coords</span>
                <span className="font-bold text-slate-300 text-[10px]">
                  {selectedVehicle.position?.lat?.toFixed(3)}, {selectedVehicle.position?.lon?.toFixed(3)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => handleFlyToVehicle(selectedVehicle)}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Fly To</span>
              </button>

              {onSimulatePing && (
                <button
                  onClick={() => onSimulatePing(selectedVehicle)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Cassandra Ping</span>
                </button>
              )}

              <button
                onClick={() => onSelectVehicle && onSelectVehicle(null)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
