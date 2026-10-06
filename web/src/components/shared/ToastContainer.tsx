"use client";

import React from "react";
import { useToast } from "@/context/ToastContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border text-xs font-semibold flex items-center justify-between transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === "error"
              ? "bg-rose-900 text-white border-rose-700"
              : toast.type === "warning"
              ? "bg-amber-900 text-white border-amber-700"
              : toast.type === "info"
              ? "bg-slate-900 text-white border-slate-700"
              : "bg-slate-950 text-white border-slate-800"
          }`}
        >
          <div className="flex items-center space-x-2.5 truncate">
            {toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            ) : toast.type === "info" ? (
              <Info className="w-4 h-4 text-sky-300 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
