"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type DeliveryProvince = "Phnom Penh" | "Siem Reap" | "Battambang";

interface LocationContextType {
  selectedProvince: DeliveryProvince;
  setSelectedProvince: (province: DeliveryProvince) => void;
  availableProvinces: DeliveryProvince[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedProvince, setSelectedProvinceState] = useState<DeliveryProvince>("Phnom Penh");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rentify_delivery_province");
      if (saved && (saved === "Phnom Penh" || saved === "Siem Reap" || saved === "Battambang")) {
        setSelectedProvinceState(saved as DeliveryProvince);
      }
    } catch {
      // Storage unavailable fallback
    }
  }, []);

  const setSelectedProvince = (prov: DeliveryProvince) => {
    setSelectedProvinceState(prov);
    try {
      localStorage.setItem("rentify_delivery_province", prov);
    } catch {
      // Storage unavailable fallback
    }
  };

  return (
    <LocationContext.Provider
      value={{
        selectedProvince,
        setSelectedProvince,
        availableProvinces: ["Phnom Penh", "Siem Reap", "Battambang"],
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    // Graceful fallback if invoked outside of provider
    return {
      selectedProvince: "Phnom Penh" as DeliveryProvince,
      setSelectedProvince: () => {},
      availableProvinces: ["Phnom Penh", "Siem Reap", "Battambang"] as DeliveryProvince[],
    };
  }
  return ctx;
}
