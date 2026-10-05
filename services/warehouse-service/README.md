# Data Warehouse & Analytics Service

## Overview
The **Warehouse Service** coordinates big data ingestion, ETL transformation, and Power BI / analytical querying over monthly sales batches.

- **Storage Layer:** Hadoop Distributed File System (HDFS)
- **Staging Directory:** `/staging/orders/*.csv` (~2,000,000 orders / month)
- **Query & Analytics Engine:** Apache Hive 3.1.3 on Tez / MapReduce
- **Optimization Strategy:**
  1. `orders_raw`: External TextFile staging table reading raw CSV dumps.
  2. `orders_opt`: Optimized ORC table partitioned by `order_month` (pruning) and bucketed by `customer_id` into 8 buckets (map-side join optimization).
  3. Metastore: Embedded Derby / Hive Metastore Service mapping tabular schemas onto HDFS blocks.
