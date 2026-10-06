"use client";

import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { User, Lock, Mail, ShieldCheck, ArrowRight, Sparkles, Building2, CheckCircle2 } from "lucide-react";

export function SignInModal() {
  const { isSignInModalOpen, setIsSignInModalOpen, login, loginAsDemoCustomer, loginAsDemoMerchant } = useAuth();
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "merchant">("customer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  if (!isSignInModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      showToast("Please enter your email or phone number", "warning");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    await login(identifier.trim(), role);
    setIsSubmitting(false);
    setIdentifier("");
    setPassword("");
  };

  return (
    <Modal
      isOpen={isSignInModalOpen}
      onClose={() => setIsSignInModalOpen(false)}
      title={tab === "signin" ? "Sign In to Rentify Marketplace" : "Create Marketplace Account"}
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setTab("signin")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "signin" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === "register" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            New Customer
          </button>
        </div>

        {/* Quick Demo One-Click Access */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-blue-900 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>One-Click Instant Demo Authentication:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={loginAsDemoCustomer}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-blue-200/80 text-blue-900 text-xs font-bold text-center transition-all shadow-2xs cursor-pointer group"
            >
              <span className="block text-[11px] font-extrabold group-hover:text-white">Sokha Meas</span>
              <span className="block text-[9.5px] text-slate-500 font-normal group-hover:text-blue-100">Customer (VIP Gold)</span>
            </button>
            <button
              type="button"
              onClick={loginAsDemoMerchant}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-900 text-xs font-bold text-center transition-all shadow-2xs cursor-pointer group"
            >
              <span className="block text-[11px] font-extrabold group-hover:text-white">Admin Merchant</span>
              <span className="block text-[9.5px] text-slate-500 font-normal group-hover:text-slate-300">Operations Console</span>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Phone Number or Email</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. +855 12 345 678 or user@email.kh"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{tab === "signin" ? "Sign In Securely" : "Create My Account"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Trust Footnote */}
        <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>Protected by NBC Bakong & 256-bit TLS encryption</span>
        </div>
      </div>
    </Modal>
  );
}
