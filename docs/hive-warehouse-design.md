# Hive Warehouse Design

## Overview
Monthly sales data (~2M orders/month) lands as CSV files in HDFS. The primary goal of this data warehouse is to support high-performance analytical queries and power the Power BI reporting dashboards for business stakeholders.

## Data Pipeline Architecture
The data pipeline follows a multi-stage architecture to transform raw data into an optimized format for analytics:
1. **Staging Layer**: Raw CSV files arrive directly in HDFS.
2. **Raw Layer (TextFile)**: Hive external tables map over the raw CSVs, allowing for immediate querying without data movement.
3. **Optimized Layer (ORC)**: Data is transformed into ORC format, partitioned by month, and bucketed by customer ID for high performance analytics.

## Raw Layer Design
The `orders_raw` table serves as the entry point into the Hive ecosystem.
- **Format**: TextFile (CSV)
- **Rationale**: The raw layer must exactly match the format of the incoming staging files in HDFS. TextFile is ideal here because it avoids immediate costly ETL transformations during data ingestion. We simply point Hive to the HDFS directory and use `skip.header.line.count=1` to ignore the CSV headers.

## Optimized Layer Design
The `orders_opt` table is designed to power the reporting dashboards.
- **Format**: ORC (Optimized Row Columnar)
  - *Rationale*: ORC provides excellent columnar storage efficiency. It heavily compresses the data and supports predicate pushdown (skipping entire blocks of data if the WHERE clause evaluates to false based on block metadata).
- **Partitioning**: `order_month`
  - *Rationale*: Most reporting queries from Power BI filter by a specific month (e.g., month-to-date sales, monthly comparisons). Partitioning by `order_month` ensures that queries only scan data for the relevant month (Partition Pruning), drastically reducing I/O.
- **Bucketing**: `customer_id` into 8 buckets
  - *Rationale*: Bucketing evenly distributes the data based on a hash of the `customer_id`. This optimization dramatically speeds up queries that aggregate by customer or join orders with the `customers` dimension table (via Map-Side Joins or Sort-Merge Bucket Joins).

## Anti-patterns Avoided
### Why NOT Partition by `customer_id`
Partitioning by `customer_id` is a classic Hive anti-pattern. With hundreds of thousands of distinct customers, this approach would create hundreds of thousands of directories, each containing very small files. This is known as the "Small Files Problem." It severely degrades HDFS performance by exhausting the NameNode's heap memory (which tracks file metadata) and slows down Hive query planning. Bucketing is the correct approach for high-cardinality columns.

## Query Execution Deep Dive
When a user submits a query against the Hive warehouse, it follows this lifecycle:
1. **Driver**: Receives the query and creates a session handle.
2. **Compiler**: Parses the query, performs semantic analysis, and checks types.
3. **Metastore**: The Compiler consults the Metastore database to retrieve table schemas, partition locations, and storage formats.
4. **Optimizer**: Generates the logical and physical execution plan. It applies rules like partition pruning and predicate pushdown.
5. **Execution Engine**: Translates the physical plan into distributed tasks (MapReduce, Tez, or Spark) and executes them across the Hadoop cluster to produce the final result.

## Performance Comparison
### `orders_opt` vs `orders_raw`
- **I/O Efficiency**: `orders_opt` queries read significantly less data from disk due to ORC compression and columnar reads (only reading necessary columns), unlike `orders_raw` which reads the entire row text.
- **Scan Reduction**: A query for September 2026 sales on `orders_opt` only scans the September partition directory. On `orders_raw`, it scans the entire table history.
- **Join Performance**: Joining `orders_opt` with the `customers` table utilizes bucket optimization, minimizing network shuffling, whereas `orders_raw` requires expensive, full data shuffles.
