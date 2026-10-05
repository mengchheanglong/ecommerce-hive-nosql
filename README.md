# 🛍️ ecommerce-hive-nosql

> A high-scale **polyglot microservices e-commerce platform** and interactive **Next.js 15 dual-portal application** powered by a dedicated **NestJS 10 microservices backend**, pairing specialized NoSQL engines (MongoDB, Redis, Cassandra, Neo4j) with an **Apache Hive on HDFS** data warehouse.

![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10.4-E0234E?style=flat-square&logo=nestjs)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?style=flat-square&logo=mongodb)
![Apache Cassandra](https://img.shields.io/badge/Cassandra-4.1-1287B1?style=flat-square&logo=apachecassandra)
![Redis](https://img.shields.io/badge/Redis-7-red?style=flat-square&logo=redis)
![Neo4j](https://img.shields.io/badge/Neo4j-5.18-008CC1?style=flat-square&logo=neo4j)
![Apache Hive](https://img.shields.io/badge/Apache_Hive-3.1.3-yellow?style=flat-square&logo=apachehive)
![Apache Hadoop](https://img.shields.io/badge/Apache_Hadoop-3.3.6-orange?style=flat-square&logo=apachehadoop)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?style=flat-square&logo=swagger)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)

---

## 📌 Microservices Architectural Overview

**`ecommerce-hive-nosql`** resolves the scalability, latency, and schema bottlenecks of monolithic databases by decomposing the marketplace into **autonomous microservices** backed by **polyglot persistence**.

Each operational domain communicates with the optimal distributed datastore for its specific read/write characteristics, while large-scale batch analytics are processed by an Apache Hive columnar data warehouse on HDFS.

```
                              ┌──────────────────────────────────────────────┐
                              │            Next.js 15 Full-Stack UI          │
                              │ 🛍️ Customer Storefront  ⇄  💼 Merchant Portal│
                              └──────────────────────┬───────────────────────┘
                                                     │ (HTTP & Proxy Rewrites)
                                                     ▼
                              ┌──────────────────────────────────────────────┐
                              │     NestJS Enterprise Microservices API      │
                              │   Swagger OpenAPI Explorer (/api/docs:4000)   │
                              └──────┬─────────────┬─────────────┬───────────┘
                                     │             │             │
        ┌────────────────────────────┼─────────────┴─────────────┼────────────────────────────┐
        ▼                            ▼                           ▼                            ▼
┌──────────────┐             ┌──────────────┐            ┌──────────────┐             ┌──────────────┐
│Catalog &     │             │Cart & Session│            │Telemetry Svc │             │Referral Svc  │
│Orders Svc    │             │Microservice  │            │Microservice  │             │Microservice  │
├──────────────┤             ├──────────────┤            ├──────────────┤             ├──────────────┤
│ MongoDB 8.0  │             │ Redis 7.x    │            │ Cassandra    │             │ Neo4j 5.x    │
│ Products &   │             │ In-Memory    │            │ 160 pings/s  │             │ 3-Level Graph│
│ Orders CRUD  │             │ < 1ms TTL    │            │ 13.8M/day    │             │ Cypher Traver│
└──────────────┘             └──────────────┘            └──────────────┘             └──────────────┘
                                     │
                                     ▼ (Nightly Batch Extract to HDFS)
                             ┌──────────────────────────────────────────────┐
                             │       Apache Hive 3.1.3 Warehouse (OLAP)     │
                             │  Partitioned by month, 8 customer buckets   │
                             │   ORC Columnar Format • 2M orders/month      │
                             └──────────────────────────────────────────────┘
```

---

## 🧩 Microservices Domain Boundaries

The platform organizes its business logic across isolated microservice domains:

1. **`Catalog Microservice` (`/api/products`):** Powered by **MongoDB** document storage to manage polymorphic product specifications across Electronics, Clothing, and Groceries without schema migration overhead.
2. **`Cart & Session Microservice`:** Powered by **Redis** key-value caching to deliver sub-millisecond retrieval on every page load with 24-hour automatic TTL expiration.
3. **`Orders & Fulfillment Microservice` (`/api/orders`):** Orchestrates transactional checkout, Bakong KHQR dynamic payment reconciliation, and delivery state transitions (`Pending` → `Preparing` → `Out for Delivery` → `Delivered`).
4. **`Telemetry Microservice` (`/api/riders`):** Backed by **Apache Cassandra** to ingest 13.8M location pings per day (160 writes/sec) from 800 riders with `TimeWindowCompactionStrategy` and automated TTL.
5. **`Referral Microservice` (`/api/referrals`):** Backed by **Neo4j** graph database utilizing index-free adjacency to traverse 3-tier deep invitation trees and calculate referral commission payouts in $O(1)$ memory pointer operations.
6. **`Warehouse Analytics Microservice` (`/api/analytics`):** Orchestrates the **Apache Hive on HDFS** batch analytics pipeline, querying ORC-compressed datasets using dynamic partition pruning and customer bucketing.

---

## 🏛️ Polyglot Database Selection Matrix

| Microservice Domain | Data Domain | Selected Datastore | Scale & Workload | Architectural Justification |
| :--- | :--- | :--- | :--- | :--- |
| **`catalog-service`** | Product Catalog | **MongoDB** (Document) | High-read, polymorphic specs | Dynamic JSON documents support polymorphic category fields (screens, fabric, expiration) without schema migrations. |
| **`cart-service`** | Active Carts & Sessions | **Redis** (Key-Value) | Sub-millisecond latency | In-memory key access guarantees < 1ms response latency on every page view with automated 24-hour TTL expiry. |
| **`telemetry-service`** | Rider GPS Fleet | **Cassandra** (Column-Family)| 160 writes/sec (13.8M/day) | Masterless peer-to-peer ring with LSM sequential commit logs absorbs heavy time-series writes without row locks. |
| **`referral-service`** | Referral Network | **Neo4j** (Graph) | Multi-tier hops (1 to 3) | Index-free adjacency traverses friend-of-a-friend relationships in O(1) memory pointer jumps instead of recursive SQL. |
| **`warehouse-service`**| Monthly Reporting | **Apache Hive on HDFS** | 2,000,000 orders/month | Columnar ORC compression, partition pruning by month, and bucketing by customer ID for fast aggregations. |

---

## ⚡ Dual-Portal User Interface

The platform provides a dedicated portal switch in the top navigation, completely separating the consumer experience from merchant operations:

### 🛍️ 1. Consumer Storefront (`/`)
- **Live Catalog & Quick View:** Instant category filters, keyword search, price sorting, and detailed product modal with polymorphic attributes.
- **Dual-Currency Conversion:** Instant toggle between **USD ($)** and **Khmer Riel (៛)** with real exchange rates (`1 USD = 4,100 KHR`).
- **Cart Drawer & Multi-Step Checkout:** Slide-over cart, authentic Bakong KHQR QR card with 3-minute timer, and Cash on Delivery.
- **Customer Account:** View active orders, delivery tracking, and manage saved delivery addresses.

### 💼 2. Merchant & Operations Portal (`/merchant`)
- **Inventory CRUD (MongoDB):** Add new products with dynamic category-specific fields, edit pricing, and delete items with instant MongoDB persistence.
- **Orders & Fulfillment State Machine:** Review incoming orders and update delivery progression (`Pending` → `Preparing` → `Out for Delivery` → `Delivered`).
- **Fleet Command (Cassandra):** Live Cassandra CQL INSERT terminal stream, battery gauges, speedometers, and city dispatch filters.
- **Referral Graph (Neo4j):** 3-tier deep invitation network visualizer with commission tier payouts (Level 1: 5%, Level 2: 3%, Level 3: 1%).
- **Data Warehouse BI (Apache Hive):** 2M monthly orders dashboard, provincial revenue charts, top spenders leaderboard, and interactive HiveQL console.

---

## 📂 Repository Layout

```
.
├── backend/                         # Enterprise NestJS Microservices Backend (Port 4000)
│   ├── src/
│   │   ├── catalog/                 # MongoDB Catalog controller & service
│   │   ├── orders/                  # MongoDB Orders & state machine
│   │   ├── telemetry/               # Cassandra Rider GPS telemetry service
│   │   ├── referral/                # Neo4j Graph referral service
│   │   ├── warehouse/               # Apache Hive reporting service
│   │   ├── database/                # Native MongoDB connection module
│   │   └── main.ts                  # NestFactory bootstrap + Swagger OpenAPI setup
│   ├── package.json
│   └── tsconfig.json
├── web/                             # Next.js 15 Full-Stack Application (Port 3001)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/                 # Endpoints (products, orders, riders, referrals, analytics)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx             # Dual-Mode Storefront & Merchant UI
│   │   └── lib/
│   │       └── mongodb.ts           # Native MongoDB connection pool
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── cassandra/                       # Apache Cassandra CQL Schemas & Compaction Config
│   └── schema.cql
├── neo4j/                           # Neo4j Graph Cypher Schema & Traversal Queries
│   └── queries.cypher
├── mongodb/                         # MongoDB Schemas & Standalone Scripts
├── hive/                            # Apache Hive Warehouse DDL, ETL & Queries
├── docker-compose.yml               # Multi-container orchestration (Mongo, Redis, Cassandra, Neo4j, Web)
├── docs/                            # Deep-dive Architecture & Design Guides
│   ├── architecture.md              # System Architecture & Microservices Flow
│   ├── cap-theorem-analysis.md      # Multi-DC Partition Analysis (AP vs CP)
│   ├── hive-warehouse-design.md     # Hive Partitioning, Bucketing & ORC
│   └── nosql-database-design.md     # NoSQL Engine Selection Rationale
├── hive/                            # Apache Hive Warehouse DDL, ETL & Queries
├── mongodb/                         # MongoDB Schemas & Standalone Scripts
├── run_lab.ps1                      # Automated pipeline runner
├── AGENTS.md
└── README.md
```

---

## 🚀 Quick Start

### 1. Run the NestJS Microservices Backend
```powershell
cd backend
pnpm install
pnpm build
pnpm start
```
- API Base: **[http://localhost:4000](http://localhost:4000)**
- Interactive Swagger OpenAPI Docs: **[http://localhost:4000/api/docs](http://localhost:4000/api/docs)**

### 2. Run the Next.js Storefront & Merchant Web App
```powershell
cd web
pnpm install
pnpm dev
```
Open **[http://localhost:3001](http://localhost:3001)** in your browser. (All `/nest-api/*` paths automatically proxy to the NestJS backend).

### 3. Multi-Container Orchestration (Docker)
```bash
docker compose up -d
```
Spins up MongoDB, Redis, Apache Cassandra, and Neo4j.

### 4. Run the Hive Warehouse Pipeline (WSL2 / Linux)
```powershell
./run_lab.ps1
```

---

## 📄 License
MIT License. Built for distributed data platform practice and exploration.
