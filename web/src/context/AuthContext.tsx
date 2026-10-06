"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { INITIAL_CUSTOMER } from "@/lib/data";
import { useToast } from "./ToastContext";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  tier: string;
  loyalty_points: number;
  role: "customer" | "merchant";
  referral_code?: string;
  avatar?: string;
}

export const DEMO_CUSTOMER: AuthUser = {
  id: INITIAL_CUSTOMER._id,
  name: INITIAL_CUSTOMER.name,
  email: INITIAL_CUSTOMER.email,
  phone: INITIAL_CUSTOMER.phone,
  city: "Phnom Penh",
  tier: INITIAL_CUSTOMER.tier,
  loyalty_points: INITIAL_CUSTOMER.loyalty_points,
  role: "customer",
  referral_code: INITIAL_CUSTOMER.referral_code,
};

export const DEMO_MERCHANT: AuthUser = {
  id: "M-8891",
  name: "KhmerCart Merchant Admin",
  email: "seller@rentify.kh",
  phone: "+855 23 888 999",
  city: "Phnom Penh",
  tier: "Store Operator",
  loyalty_points: 5400,
  role: "merchant",
  referral_code: "MERCHANT-ADMIN",
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isSignInModalOpen: boolean;
  setIsSignInModalOpen: (open: boolean) => void;
  login: (identifier: string, role?: "customer" | "merchant") => Promise<{ success: boolean }>;
  loginAsDemoCustomer: () => void;
  loginAsDemoMerchant: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "rentify_authenticated_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(DEMO_CUSTOMER);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        if (stored === "guest" || stored === "") {
          setUser(null);
        } else {
          setUser(JSON.parse(stored));
        }
      }
    } catch (e) {
      console.warn("Failed to load auth user from storage", e);
    }
    setIsHydrated(true);
  }, []);

  const saveUserToStorage = (u: AuthUser | null) => {
    try {
      if (u) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } else {
        localStorage.setItem(STORAGE_KEY, "guest");
      }
    } catch (e) {
      console.warn("Failed to save auth user to storage", e);
    }
  };

  const login = async (identifier: string, role: "customer" | "merchant" = "customer") => {
    const loggedUser: AuthUser =
      role === "merchant"
        ? { ...DEMO_MERCHANT, email: identifier }
        : { ...DEMO_CUSTOMER, name: identifier.split("@")[0] || identifier };

    setUser(loggedUser);
    saveUserToStorage(loggedUser);
    setIsSignInModalOpen(false);
    showToast(`Signed in successfully as ${loggedUser.name}!`, "success");
    return { success: true };
  };

  const loginAsDemoCustomer = () => {
    setUser(DEMO_CUSTOMER);
    saveUserToStorage(DEMO_CUSTOMER);
    setIsSignInModalOpen(false);
    showToast("Welcome back, Sokha Meas (VIP Gold)!", "success");
  };

  const loginAsDemoMerchant = () => {
    setUser(DEMO_MERCHANT);
    saveUserToStorage(DEMO_MERCHANT);
    setIsSignInModalOpen(false);
    showToast("Switched to Merchant Operations Admin!", "info");
  };

  const logout = () => {
    setUser(null);
    saveUserToStorage(null);
    showToast("Signed out. You are now browsing as a Guest.", "info");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isSignInModalOpen,
        setIsSignInModalOpen,
        login,
        loginAsDemoCustomer,
        loginAsDemoMerchant,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
