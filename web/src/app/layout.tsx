import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AppShell } from "@/components/shared/AppShell";

import { LocationProvider } from "@/context/LocationContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Rentify Marketplace — High-Scale Polyglot E-Commerce Platform",
  description:
    "Reference marketplace with MongoDB inventory transactions, demo telemetry fixtures and data platform examples",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-500/20 selection:text-blue-950">
        <ToastProvider>
          <AuthProvider>
            <CurrencyProvider>
              <LocationProvider>
                <CartProvider>
                  <WishlistProvider>
                    <AppShell>{children}</AppShell>
                  </WishlistProvider>
                </CartProvider>
              </LocationProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
