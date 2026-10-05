import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KhmerCart — Modern Marketplace & Big Data Platform",
  description: "E-Commerce platform powered by MongoDB, Redis, and Apache Hive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
