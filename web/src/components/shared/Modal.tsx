"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />
      <div
        className={`relative bg-white rounded-3xl ${maxWidth} w-full p-6 sm:p-8 shadow-2xl border border-[#e2eae5] space-y-4 z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200`}
      >
        {title && (
          <div className="flex justify-between items-center pb-3 border-b border-[#e2eae5]">
            <h3 className="text-lg font-bold text-[#013326] tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#5c7167] hover:bg-[#f1f6f3] hover:text-[#013326] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
