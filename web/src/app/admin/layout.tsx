"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Platform Admin Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Ecosystem Administration Merged into Platform HQ
                </p>
                <p className="text-[11px] text-slate-500">
                  Unified governance across stores, PostGIS supply chain, Neo4j graphs, and OSM routing is live on Port 3300.
                </p>
              </div>
            </div>
            <a
              href="http://localhost:3300"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <span>Launch Platform HQ (:3300)</span>
              <span className="text-xs">→</span>
            </a>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
