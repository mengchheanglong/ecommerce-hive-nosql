"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  icon: React.ReactNode;
}

export function KpiCard({ title, value, change, trend = "up", subtitle, icon }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{title}</span>
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/60">
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">{value}</h3>
        {(change || subtitle) && (
          <div className="flex items-center space-x-2 text-xs">
            {change && (
              <span
                className={`inline-flex items-center font-bold px-2 py-0.5 rounded-full text-[10px] ${
                  trend === "up"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    : trend === "down"
                    ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : trend === "down" ? (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                ) : null}
                {change}
              </span>
            )}
            {subtitle && <span className="text-slate-400 font-medium truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
