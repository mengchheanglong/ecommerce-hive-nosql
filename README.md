# 🛍️ ecommerce-hive-nosql

> A high-throughput **polyglot persistence data platform** and interactive **Next.js full-stack web application** designed for modern distributed e-commerce workloads.

![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?style=flat-square&logo=mongodb)
![Apache Hive](https://img.shields.io/badge/Apache_Hive-3.1.3-yellow?style=flat-square&logo=apachehive)
![Apache Hadoop](https://img.shields.io/badge/Apache_Hadoop-3.3.6-orange?style=flat-square&logo=apachehadoop)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)

---

## 📌 Overview

**`ecommerce-hive-nosql`** demonstrates how a high-volume e-commerce marketplace (modeled after **Marketplace**, serving 200,000 customers and 800 delivery riders) transitions from a bottlenecked monolithic SQL database to a **polyglot persistence architecture** paired with a distributed big data warehouse and an interactive web portal.

Instead of forcing all workloads into a single database, each operational domain is routed to the database engine engineered specifically for its data structure and read/write characteristics.

---

## 🏛️ System Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │       Next.js 15 Full-Stack Application      │
                    │   (Storefront • Analytics • Fleet • Profile) │
                    └───────┬──────────────────────────────┬───────┘
                            │                              │
         Operational OLTP   │                              │  Analytical OLAP
    ┌───────────────────────┴───────────────┐     ┌────────┴───────────────────────────┐
    │                                       │     │                                    │
    ▼                                       ▼     ▼                                    ▼
┌──────────────┐                     ┌──────────────┐    ┌──────────────┐     ┌──────────────┐
│   MongoDB    │                     │  Cassandra   │    │  HDFS Layer  │     │ Apache Hive  │
│  (Document)  │                     │(Column-Store)│    │(Staging CSV) │     │ (Warehouse)  │
├──────────────┤                     ├──────────────┤    ├──────────────┤     ├──────────────┤
│ Products     │                     │ 800 Riders   │    │ 2M orders/mo │     │ ORC format   │
│ Customer IDs │                     │ 160 pings/sec│    │ Staged batch │     │ Partitioned  │
│ Rich specs   │                     │ 13.8M/day    │    │ Raw TextFile │     │ Bucketed     │
└──────────────┘                     └──────────────┘    └──────────────┘     └──────────────┘
```

### Polyglot Database Selection Matrix

| Domain | Scale & Workload | Database Type | Selected Engine | Architectural Justification |
| :--- | :--- | :--- | :--- | :--- |
| **Product Catalog** | Varied polymorphic attributes (Electronics, Apparel, Food) | Document Store | **MongoDB** | Dynamic JSON documents allow category-specific schemas without `NULL` columns or costly joins. |
| **Carts & Sessions** | Sub-millisecond lookups on every page view | Key-Value Store | **Redis** | In-memory key access guarantees < 1ms response latency with automatic TTL expiration. |
| **Referral Network** | Up to 3 levels deep ("friend-of-a-friend-of-a-friend") | Graph Database | **Neo4j** | Index-free adjacency traverses multi-hop referral graphs without expensive recursive SQL queries. |
| **Rider GPS Telemetry**| 800 delivery riders pinging every 5s (~13.8M rows/day) | Column-Family | **Apache Cassandra** | Masterless, log-structured merge-tree engine optimized for non-stop sequential write throughput. |
| **Sales & BI Reporting**| 2,000,000 orders/month exported to HDFS | Data Warehouse | **Apache Hive on HDFS** | Columnar ORC compression, partition pruning by month, and bucketing by customer ID for fast aggregations. |

---

## ⚡ Full-Stack Web Application (`web/`)

The repository includes a modern Next.js 15 application running on `http://localhost:3001` that ties the entire platform together:

1. **🛍️ Live Storefront:**
   - Real-time product catalog loaded directly from MongoDB.
   - Dynamic category filtering with polymorphic specifications (screen size, warranty, size, colours, expiry date).
   - Interactive cart drawer and checkout modal with **ABA Pay KHQR** and Cash on Delivery.
2. **📊 Hive Analytics Dashboard:**
   - Live visual cards for monthly orders, active users, and fleet size.
   - Visual breakdown of the HDFS ETL pipeline.
   - Charts for Revenue by Province, Top Customers spend leaderboard, and High/Normal order classification tiers.
3. **🛵 Delivery Fleet Telemetry:**
   - Real-time simulated telemetry for 800 riders across Phnom Penh, Siem Reap, and Battambang.
   - Dynamic status feeds, battery indicators, speed, and Cassandra ingest metrics (160 writes/second).
4. **👤 MongoDB Customer Profiles:**
   - Document model inspection displaying embedded delivery addresses and referenced order histories.

---

## 📂 Repository Structure

```
.
├── docs/                            # Architectural design documents
│   ├── architecture.md              # System architecture & polyglot data flow
│   ├── cap-theorem-analysis.md      # Multi-DC partition analysis (AP vs CP)
│   ├── hive-warehouse-design.md     # Hive warehouse partitioning, bucketing & ORC
│   └── nosql-database-design.md     # Detailed NoSQL selection & schema decisions
├── data/
│   └── sample/
│       └── orders-2026-09-sample.csv# Realistic sample order dataset
├── hive/                            # Apache Hive Warehouse DDL, ETL & Queries
│   ├── ddl/
│   │   ├── 01-create-database.hql   # Database creation
│   │   ├── 02-create-orders-raw.hql # Raw staging table (TextFile)
│   │   ├── 03-create-orders-opt.hql # Optimized table (ORC, Partitioned, Bucketed)
│   │   └── 04-create-customers.hql  # Dimension table
│   ├── etl/
│   │   └── load-orders.hql          # End-to-end HDFS ETL pipeline
│   └── analytics/
│       ├── revenue-by-province.hql  # Provincial revenue breakdown
│       ├── top-customers.hql        # Top spenders joined with customer dimension
│       ├── popular-categories.hql   # High-volume category filtering
│       └── order-tiers.hql          # CASE WHEN order tier segmentation
├── mongodb/                         # MongoDB Schemas & Scripts
│   ├── schemas/
│   │   ├── customers.json           # JSON Schema for customer documents
│   │   └── products.json            # JSON Schema for product catalog
│   └── scripts/
│       ├── seed-products.js         # Sample seed script
│       └── crud-operations.js       # Complete CRUD operations demo
├── web/                             # Next.js 15 Full-Stack Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/                 # API endpoints for MongoDB, Hive & Riders
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx             # Interactive dashboard UI
│   │   └── lib/
│   │       └── mongodb.ts           # MongoDB client connection pool
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── run_lab.ps1                      # Automated pipeline runner
├── AGENTS.md                        # Project guidelines & conventions
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and **pnpm**
- **MongoDB 7+** running locally on port `27017`
- *(Optional)* **Hadoop 3+** and **Apache Hive 3+** (or WSL2 Ubuntu) for executing HiveQL scripts

### 1. Launch the Next.js Web App
```powershell
cd web
pnpm install
pnpm dev
```
Visit **[http://localhost:3001](http://localhost:3001)** in your browser.

### 2. Seed MongoDB
```powershell
mongosh Marketplace mongodb/scripts/seed-products.js
mongosh Marketplace mongodb/scripts/crud-operations.js
```

### 3. Run the Hive Pipeline (WSL2 / Linux)
```powershell
./run_lab.ps1
```
Or execute Hive DDL scripts individually:
```bash
hive -f hive/ddl/01-create-database.hql
hive -f hive/ddl/02-create-orders-raw.hql
hive -f hive/ddl/03-create-orders-opt.hql
hive -f hive/ddl/04-create-customers.hql
hive -f hive/etl/load-orders.hql
```

---

## 📊 Hive Warehouse Optimization Strategy

The analytics engine uses a two-tier warehouse approach:
1. **Raw Staging Layer (`orders_raw`):** Stored as comma-delimited `TextFile` matching raw CSV dumps landed in HDFS `/staging/orders/`.
2. **Optimized Analytics Layer (`orders_opt`):**
   - **Partitioned by `order_month`:** Enables partition pruning so queries filter exclusively the requested month, bypassing terabytes of unrelated data.
   - **Clustered by `customer_id` into 8 Buckets:** Facilitates map-side bucketed joins with the `customers` dimension table and avoids skew.
   - **Stored as `ORC`:** Columnar storage with built-in lightweight compression and min/max index statistics for high-speed predicate pushdown.

---

## 📄 License
MIT License. Built for distributed data platform practice and exploration.
