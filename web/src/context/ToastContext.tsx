"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ToastMessage } from "@/types";

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type?: "success" | "info" | "error" | "warning") => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: string, type: "success" | "info" | "error" | "warning" = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => {
        // Keep at most 1 previous toast so at most 2 ever show simultaneously, eliminating giant stacks
        const trimmed = prev.slice(-1);
        return [...trimmed, { id, message, type }];
      });
      setTimeout(() => {
        removeToast(id);
      }, 2500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, clearToasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
