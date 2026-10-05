import { Injectable } from "@nestjs/common";

@Injectable()
export class WarehouseService {
  getWarehouseAnalytics() {
    return {
      success: true,
      warehouseEngine: "Apache Hive 3.1.3 on Tez/MapReduce",
      storageLayer: "Hadoop Distributed File System (HDFS)",
      stagingDir: "/staging/orders/*.csv",
      format: "ORC (Optimized Row Columnar)",
      metrics: {
        totalMonthlyOrders: 2000000,
        activeCustomers: 200000,
        customerBuckets: 8,
        septemberRevenue: 9027.0,
        queryLatencyMs: 142,
      },
      revenueByProvince: [
        { province: "Siem Reap", revenue: 5175.0, share: "57.3%" },
        { province: "Phnom Penh", revenue: 2989.5, share: "33.1%" },
        { province: "Battambang", revenue: 862.5, share: "9.6%" },
      ],
      topCustomers: [
        { rank: 1, name: "Chenda Som", city: "Siem Reap", spend: 2625.0, tier: "VIP Platinum" },
        { rank: 2, name: "Sokha Meas", city: "Phnom Penh", spend: 1980.0, tier: "VIP Gold" },
        { rank: 3, name: "Piseth Seng", city: "Siem Reap", spend: 1800.0, tier: "VIP Gold" },
        { rank: 4, name: "Dara Sam", city: "Siem Reap", spend: 750.0, tier: "Silver" },
        { rank: 5, name: "Sreypov Keo", city: "Battambang", spend: 510.0, tier: "Silver" },
      ],
      orderTiers: {
        highTier: { label: "> $100", count: 18, percentage: "35.3%" },
        normalTier: { label: "≤ $100", count: 33, percentage: "64.7%" },
      },
      pipelineStages: [
        { stage: 1, name: "HDFS Ingestion", desc: "Batch CSV dump at /staging/orders/2026-09.csv" },
        { stage: 2, name: "orders_raw", desc: "External TextFile schema-on-read table" },
        { stage: 3, name: "orders_opt", desc: "Dynamic partitioning by order_month, 8 customer buckets" },
        { stage: 4, name: "Columnar ORC", desc: "ZLIB compression, stripe index predicate pushdown" },
        { stage: 5, name: "BI Reporting", desc: "Partition pruning skips non-target HDFS splits" },
      ],
    };
  }

  executeSampleQuery(queryId: string) {
    const validQueries = ["D1", "D2", "D3", "D4"];
    if (!validQueries.includes(queryId.toUpperCase())) {
      return { success: false, error: "Invalid Query ID. Use D1, D2, D3, or D4." };
    }
    return {
      success: true,
      queryId: queryId.toUpperCase(),
      executionEngine: "Apache Hive 3.1.3 (Tez Engine)",
      status: "SUCCEEDED",
      latencyMs: 142,
      recordsScanned: 51,
      partitionsPruned: 1,
    };
  }
}
