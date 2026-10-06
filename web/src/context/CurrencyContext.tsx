"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CurrencyContextType {
  currency: "USD" | "KHR";
  setCurrency: (c: "USD" | "KHR") => void;
  formatPrice: (usd: number) => string;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const KHR_RATE = 4100;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<"USD" | "KHR">("USD");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("marketplace_currency");
      if (saved === "USD" || saved === "KHR") {
        setCurrencyState(saved);
      }
    } catch {}
  }, []);

  const setCurrency = (c: "USD" | "KHR") => {
    setCurrencyState(c);
    try {
      localStorage.setItem("marketplace_currency", c);
    } catch {}
  };

  const formatPrice = (usd: number): string => {
    if (isNaN(usd) || usd === null || usd === undefined) return "$0.00";
    if (currency === "USD") {
      return `$${usd.toFixed(2)}`;
    }
    const khr = Math.round(usd * KHR_RATE);
    return `៛${khr.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        exchangeRate: KHR_RATE,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
