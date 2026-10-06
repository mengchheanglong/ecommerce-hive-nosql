import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartProvider } from "@/context/CartContext";
import { AppShell } from "@/components/shared/AppShell";

export const metadata: Metadata = {
  title: "Marketplace — Polyglot Data Platform & E-Commerce Engine",
  description:
    "Production-grade distributed e-commerce architecture powered by MongoDB 8.0, Apache Cassandra, Neo4j, and Apache Hive on HDFS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6faf8] text-[#09211a] antialiased">
        <ToastProvider>
          <CurrencyProvider>
            <CartProvider>
              <AppShell>{children}</AppShell>
            </CartProvider>
          </CurrencyProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
