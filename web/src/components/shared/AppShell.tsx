"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { SignInModal } from "@/components/customer/SignInModal";
import { ToastContainer } from "./ToastContainer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMerchant = pathname?.startsWith("/merchant");
  const isAdmin = pathname?.startsWith("/admin");
  const isDashboard = isMerchant || isAdmin;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-950">
      {!isDashboard && <Header />}
      <div className="flex-1 flex flex-col">{children}</div>
      {!isDashboard && <Footer />}
      {!isDashboard && <CartDrawer />}
      <SignInModal />
      <ToastContainer />
    </div>
  );
}
