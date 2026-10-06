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
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2eae5] shadow-card hover:shadow-hover transition-all duration-200 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#5c7167] tracking-wider uppercase">{title}</span>
        <div className="w-10 h-10 rounded-2xl bg-[#f1f6f3] flex items-center justify-center text-[#013326]">
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-[#013326] tracking-tight">{value}</h3>
        {(change || subtitle) && (
          <div className="flex items-center space-x-2 text-xs">
            {change && (
              <span
                className={`inline-flex items-center font-bold px-2 py-0.5 rounded-full text-[11px] ${
                  trend === "up"
                    ? "bg-[#eafaf4] text-[#0c835c]"
                    : trend === "down"
                    ? "bg-rose-50 text-rose-700"
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
            {subtitle && <span className="text-[#5c7167] truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
