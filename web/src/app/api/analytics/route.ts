import { NextResponse } from "next/server";

export async function GET() {
  const analyticsData = {
    overview: {
      totalMonthlyOrders: 2000000,
      activeCustomers: 200000,
      deliveryRiders: 800,
      septemberRevenue: 9027.0, // calculated from sample
    },
    revenueByProvince: [
      { province: "Siem Reap", revenue: 5175.0, percentage: 57.3, orders: 28 },
      { province: "Phnom Penh", revenue: 2989.5, percentage: 33.1, orders: 17 },
      { province: "Battambang", revenue: 862.5, percentage: 9.6, orders: 6 },
    ],
    topCustomers: [
      { rank: 1, name: "Chenda Som", city: "Siem Reap", spend: 2625.0, tier: "VIP Platinum" },
      { rank: 2, name: "Sokha Meas", city: "Phnom Penh", spend: 1980.0, tier: "VIP Gold" },
      { rank: 3, name: "Piseth Seng", city: "Siem Reap", spend: 1800.0, tier: "VIP Gold" },
      { rank: 4, name: "Dara Sam", city: "Siem Reap", spend: 750.0, tier: "Silver" },
      { rank: 5, name: "Sreypov Keo", city: "Battambang", spend: 510.0, tier: "Silver" },
    ],
    orderTiers: {
      high: { count: 18, label: "High Tier (> $100)", percentage: 35.3 },
      normal: { count: 33, label: "Normal Tier (≤ $100)", percentage: 64.7 },
    },
    hivePipeline: [
      { step: "1. Staging", tech: "HDFS CSV", desc: "/staging/orders/2026-09.csv (2M rows/mo)" },
      { step: "2. Raw Layer", tech: "Hive TextFile", desc: "orders_raw with schema-on-read" },
      { step: "3. ETL Optimization", tech: "Dynamic Partitioning", desc: "Partitioned by month, 8 customer buckets" },
      { step: "4. Columnar Storage", tech: "ORC Format", desc: "Predicate pushdown, lightweight ZLIB compression" },
      { step: "5. Query Acceleration", tech: "Partition Pruning", desc: "Skips non-target months, 10x - 100x speedup" },
    ],
  };

  return NextResponse.json({ success: true, data: analyticsData });
}
