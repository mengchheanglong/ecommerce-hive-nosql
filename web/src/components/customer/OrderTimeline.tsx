"use client";

import React from "react";
import { CheckCircle2, Clock, Truck, PackageCheck, AlertCircle } from "lucide-react";

interface OrderTimelineProps {
  status: string;
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  const steps = [
    { key: "Pending", label: "Order Placed", desc: "Logged in MongoDB" },
    { key: "Preparing", label: "Warehouse Prep", desc: "Picking & packing" },
    { key: "Out for Delivery", label: "Rider Dispatched", desc: "Cassandra GPS active" },
    { key: "Delivered", label: "Delivered", desc: "Confirmed & settled" },
  ];

  const getStepIndex = (st: string) => {
    switch (st) {
      case "Pending":
        return 0;
      case "Preparing":
        return 1;
      case "Out for Delivery":
      case "Dispatched":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  if (status === "Cancelled") {
    return (
      <div className="w-full py-3 px-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5 text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold block text-rose-900">Order Cancelled</span>
            <span className="text-[11px] text-rose-600">Fulfillment halted • Refund settlement released</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
          Cancelled
        </span>
      </div>
    );
  }

  if (status === "Return Requested" || status === "Returned") {
    return (
      <div className="w-full py-3 px-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5 text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold block text-amber-900">Return & Refund Under Review</span>
            <span className="text-[11px] text-amber-700">7-Day Guarantee active • Merchant review guaranteed within 24 hours</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
          Review In Progress
        </span>
      </div>
    );
  }

  const currentIndex = getStepIndex(status);

  return (
    <div className="w-full py-3">
      <div className="grid grid-cols-4 gap-2 relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(currentIndex / 3) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div key={step.key} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-xs ${
                  isDone
                    ? "bg-slate-900 text-white border-2 border-blue-600"
                    : isCurrent
                    ? "bg-blue-600 text-white ring-4 ring-blue-500/20"
                    : "bg-white text-slate-400 border-2 border-slate-200"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <p
                className={`text-xs font-bold mt-2 truncate w-full ${
                  isCurrent ? "text-slate-900" : isDone ? "text-blue-700" : "text-slate-500"
                }`}
              >
                {step.label}
              </p>
              <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5 truncate w-full">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
