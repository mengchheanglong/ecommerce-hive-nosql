"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { ToastContainer } from "./ToastContainer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMerchant = pathname?.startsWith("/merchant");

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-950">
      {!isMerchant && <Header />}
      <div className="flex-1 flex flex-col">{children}</div>
      {!isMerchant && <Footer />}
      <CartDrawer />
      <ToastContainer />
    </div>
  );
}
