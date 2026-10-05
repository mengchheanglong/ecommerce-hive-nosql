import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marketplace — Polyglot Data Platform & E-Commerce Engine",
  description: "High-scale distributed e-commerce architecture powered by MongoDB, Apache Cassandra, and Apache Hive on HDFS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6faf8] text-[#09211a] antialiased">
        {children}
      </body>
    </html>
  );
}
