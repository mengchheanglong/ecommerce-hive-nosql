# 🛍️ ecommerce-hive-nosql

> A high-scale **polyglot microservices e-commerce platform** and interactive **Next.js 15 dual-portal application** pairing specialized NoSQL engines with an Apache Hive data warehouse.

![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?style=flat-square&logo=mongodb)
![Apache Cassandra](https://img.shields.io/badge/Cassandra-4.1-1287B1?style=flat-square&logo=apachecassandra)
![Redis](https://img.shields.io/badge/Redis-7-red?style=flat-square&logo=redis)
![Neo4j](https://img.shields.io/badge/Neo4j-5.18-008CC1?style=flat-square&logo=neo4j)
![Apache Hive](https://img.shields.io/badge/Apache_Hive-3.1.3-yellow?style=flat-square&logo=apachehive)
![Apache Hadoop](https://img.shields.io/badge/Apache_Hadoop-3.3.6-orange?style=flat-square&logo=apachehadoop)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)

---

## 📌 Architectural Overview

**`ecommerce-hive-nosql`** resolves the limitations of monolithic relational databases for high-throughput marketplaces by applying **polyglot persistence** and **microservice isolation**.

Each operational domain communicates with the optimal distributed datastore for its read/write characteristics, while batch analytics are routed to an Apache Hive columnar data warehouse on HDFS.

```
                              ┌──────────────────────────────────────────────┐
                              │            Next.js 15 Full-Stack UI          │
                              │ 🛍️ Customer Storefront  ⇄  💼 Merchant Portal│
                              └───────┬──────────────────────────────┬───────┘
                                      │                              │
         Operational OLTP Microservices                              │  Analytical OLAP Pipeline
    ┌───────────────────┬─────────────┴─────┬──────────────────┐     │
    ▼                   ▼                   ▼                  ▼     ▼
┌──────────────┐ ┌──────────────┐    ┌──────────────┐   ┌──────────────┐    ┌──────────────┐
│Catalog Svc   │ │Cart/Sess Svc │    │Telemetry Svc │   │Referral Svc  │    │HDFS & Hive   │
├──────────────┤ ├──────────────┤    ├──────────────┤   ├──────────────┤    ├──────────────┤
│ MongoDB      │ │ Redis        │    │ Cassandra    │   │ Neo4j        │    │ Apache Hive  │
│ Products     │ │ In-Memory    │    │ 160 pings/s  │   │ 3-Level Graph│    │ ORC Storage  │
│ Rich Specs   │ │ < 1ms TTL    │    │ 13.8M/day    │   │ Cypher Traver│    │ 2M orders/mo │
└──────────────┘ └──────────────┘    └──────────────┘   └──────────────┘    └──────────────┘
```

---

## 🏛️ Polyglot Database Selection Matrix

| Microservice | Data Domain | Selected Datastore | Scale & Characteristic | Architectural Justification |
| :--- | :--- | :--- | :--- | :--- |
| **`catalog-service`** | Product Catalog | **MongoDB** (Document) | High-read, varied specs | Dynamic JSON documents support polymorphic category fields (screens, fabric, expiration) without schema migrations. |
| **`cart-service`** | Active Carts & Sessions | **Redis** (Key-Value) | Sub-millisecond latency | In-memory key access guarantees < 1ms response latency on every page view with automated 24-hour TTL expiry. |
| **`telemetry-service`** | Rider GPS Fleet | **Cassandra** (Column-Family)| 160 writes/sec (13.8M/day) | Masterless peer-to-peer ring with LSM sequential commit logs absorbs heavy time-series writes without row locks. |
| **`referral-service`** | Invitation Programme | **Neo4j** (Graph) | Multi-tier hops (1 to 3) | Index-free adjacency traverses friend-of-a-friend relationships in O(1) memory pointer jumps instead of recursive SQL. |
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
├── services/                        # Decoupled Microservices
│   ├── catalog-service/             # MongoDB Product Catalog CRUD
│   ├── cart-service/                # Redis Active Cart & Session Cache
│   ├── order-service/               # Order Processing & State Machine
│   ├── telemetry-service/           # Cassandra 13.8M/day Rider GPS Ingest
│   ├── referral-service/            # Neo4j 3-Level Referral Tree & Cypher
│   └── warehouse-service/           # Apache Hive HDFS Ingestion & ETL
├── web/                             # Next.js 15 Full-Stack Application
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

### 1. Run the Web Application
```powershell
cd web
pnpm install
pnpm dev
```
Open **[http://localhost:3001](http://localhost:3001)** in your browser.

### 2. Multi-Container Orchestration (Docker)
```bash
docker compose up -d
```
Spins up MongoDB, Redis, Apache Cassandra, and Neo4j.

### 3. Run the Hive Warehouse Pipeline (WSL2 / Linux)
```powershell
./run_lab.ps1
```

---

## 📄 License
MIT License. Built for distributed data platform practice and exploration.
