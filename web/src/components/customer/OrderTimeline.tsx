"use client";

import React from "react";
import { CheckCircle2, Clock, Truck, PackageCheck, AlertCircle } from "lucide-react";

interface OrderTimelineProps {
  status: string;
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  const steps = [
    { key: "Pending", label: "Order Placed", desc: "Received into MongoDB queue" },
    { key: "Preparing", label: "Warehouse Prep", desc: "Items picked and packaged" },
    { key: "Out for Delivery", label: "Rider Dispatched", desc: "Tracked in Cassandra fleet" },
    { key: "Delivered", label: "Completed", desc: "Delivered & settled" },
  ];

  const getStepIndex = (st: string) => {
    switch (st) {
      case "Pending":
        return 0;
      case "Preparing":
        return 1;
      case "Out for Delivery":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-4 gap-2 relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#e2eae5] -z-0">
          <div
            className="h-full bg-[#15c089] transition-all duration-500"
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
                    ? "bg-[#013326] text-white border-2 border-[#15c089]"
                    : isCurrent
                    ? "bg-[#15c089] text-[#013326] ring-4 ring-[#15c089]/20"
                    : "bg-white text-[#cad6cf] border-2 border-[#e2eae5]"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#15c089]" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#013326] animate-ping" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <p
                className={`text-xs font-bold mt-2 truncate w-full ${
                  isCurrent ? "text-[#013326]" : isDone ? "text-[#0c835c]" : "text-[#5c7167]"
                }`}
              >
                {step.label}
              </p>
              <p className="text-[10px] text-[#5c7167] hidden sm:block mt-0.5 truncate w-full">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
