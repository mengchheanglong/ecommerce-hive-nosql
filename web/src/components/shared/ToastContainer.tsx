"use client";

import React from "react";
import { useToast } from "@/context/ToastContext";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const { isCartDrawerOpen } = useCart();

  // If cart drawer is active, suppress toasts so they never obstruct checkout or drawer actions
  if (isCartDrawerOpen || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3 rounded-xl shadow-lg border text-xs font-medium flex items-center justify-between transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === "error"
              ? "bg-rose-950/95 text-rose-100 border-rose-800 backdrop-blur-md"
              : toast.type === "warning"
              ? "bg-amber-950/95 text-amber-100 border-amber-800 backdrop-blur-md"
              : toast.type === "info"
              ? "bg-slate-900/95 text-slate-100 border-slate-700 backdrop-blur-md"
              : "bg-slate-950/95 text-slate-100 border-slate-800 backdrop-blur-md"
          }`}
        >
          <div className="flex items-center space-x-2.5 truncate">
            {toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toast.type === "info" ? (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors ml-2 cursor-pointer shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
