# 🛍️ ecommerce-storefront

## Project status: Active Commercial Storefront & Demand Bridge

This project is the active commercial storefront, polyglot customer portal, and demand gateway for the supply chain workspace.
- **Storefront & Checkout:** Next.js 15 dual-portal application (Customer Storefront & Merchant Operations) backed by NestJS 10.
- **Supply Chain Bridge:** Customer orders placed on the storefront automatically route into `supply-chain-platform` (`http://127.0.0.1:3100`) via `SupplyChainBridgeService`, creating fulfillment orders and allocating double-entry inventory ledger stock across PostGIS regional facilities (`DC-PNH-01`, `DC-REP-01`, `DC-KOS-01`, `DC-BAT-01`).
- **Fleet Simulation Notification:** Successful orders notify `logistics-sandbox` (`http://localhost:3001`) for real-time delivery dispatch.
- **Unified Governance:** Administrative oversight, merchant store directories, settlements, and cross-platform health are monitored in `supply-chain-control-tower` (port 3300).

> A high-scale **polyglot persistence e-commerce platform** and interactive **Next.js 15 dual-portal application** powered by a dedicated **NestJS 10 backend API**, pairing specialized NoSQL engines (MongoDB, Redis, Cassandra, Neo4j) with an **Apache Hive on HDFS** data warehouse.

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

## Current inventory behavior (P0-02)

New orders reserve available stock, shipment consumes the reservation, delivery performs
no second deduction, and pre-shipment cancellation releases the hold. All changes use one
MongoDB transaction and an inventory event ledger. Stable order IDs make checkout retries
idempotent. Offline order mutations fail; the browser no longer reports local fallback writes
as confirmed orders. Legacy orders require reconciliation before inventory transitions.

MongoDB must run as a replica set. The original standalone Compose command does not satisfy
this requirement. Use the opt-in `compose.inventory.yaml` overlay described in the
[inventory policy](docs/inventory-reservations.md). Run `pnpm test:inventory` from `backend`
for isolated, disposable database tests. This is a reference/demo application; these changes
do not establish production authorization, tenant isolation or payment verification.

## 📌 System Architecture & Polyglot Persistence

### Current telemetry behavior (P0-03)

`GET /api/riders` returns labelled demo fixtures with no observed GPS, Cassandra driver,
durable sink or measured throughput. Ping writes return 503 with `stored: false`.
The UI removes fake CQL streams and write-success controls; unavailable reads clear the
roster. Simulated road-map positions and volatile history belong to logistics-sandbox.
See [telemetry policy](docs/telemetry-source.md). The design diagrams and datastore
selection examples below are lab proposals, not evidence of implemented telemetry scale.

**`ecommerce-hive-nosql`** resolves the scalability, latency, and schema bottlenecks of single monolithic databases by adopting a **domain-modular architecture** backed by **polyglot persistence**.

Each operational domain communicates with the optimal distributed datastore for its specific read/write characteristics, while large-scale batch analytics are processed by an Apache Hive columnar data warehouse on HDFS.

```
                              ┌──────────────────────────────────────────────┐
                              │            Next.js 15 Full-Stack UI          │
                              │ 🛍️ Customer Storefront  ⇄  💼 Merchant Portal│
                              └──────────────────────┬───────────────────────┘
                                                     │ (HTTP & Proxy Rewrites)
                                                     ▼
                              ┌──────────────────────────────────────────────┐
                              │        NestJS Enterprise Backend API         │
                              │   Swagger OpenAPI Explorer (/api/docs:4000)   │
                              └──────┬─────────────┬─────────────┬───────────┘
                                     │             │             │
        ┌────────────────────────────┼─────────────┴─────────────┼────────────────────────────┐
        ▼                            ▼                           ▼                            ▼
┌──────────────┐             ┌──────────────┐            ┌──────────────┐             ┌──────────────┐
│Catalog &     │             │Cart & Session│            │Telemetry     │             │Referral      │
│Orders Module │             │Module        │            │Module        │             │Module        │
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

## 🧩 Domain Modules & Architecture Boundaries

The platform organizes its business logic across modular domain services:

1. **`Catalog Module` (`/api/products`):** Powered by **MongoDB** document storage to manage polymorphic product specifications across Electronics, Clothing, and Groceries without schema migration overhead.
2. **`Cart & Session Module`:** Powered by **Redis** key-value caching to deliver sub-millisecond retrieval on every page load with 24-hour automatic TTL expiration.
3. **`Orders & Fulfillment Module` (`/api/orders`):** Orchestrates transactional checkout, Bakong KHQR dynamic payment reconciliation, and delivery state transitions (`Pending` → `Preparing` → `Out for Delivery` → `Delivered`).
4. **`Telemetry Module` (`/api/riders`):** Returns versioned demo fixtures. GPS ingestion is disabled because no durable sink or Cassandra driver exists. Cassandra schema/scale examples are proposed lab designs.
5. **`Referral Module` (`/api/referrals`):** Backed by **Neo4j** graph database utilizing index-free adjacency to traverse 3-tier deep invitation trees and calculate referral commission payouts in $O(1)$ memory pointer operations.
6. **`Warehouse Analytics Module` (`/api/analytics`):** Orchestrates the **Apache Hive on HDFS** batch analytics pipeline, querying ORC-compressed datasets using dynamic partition pruning and customer bucketing.

---

## 🏛️ Polyglot Database Selection Matrix

| Domain Service | Data Domain | Selected Datastore | Scale & Workload | Architectural Justification |
| :--- | :--- | :--- | :--- | :--- |
| **`catalog-service`** | Product Catalog | **MongoDB** (Document) | High-read, polymorphic specs | Dynamic JSON documents support polymorphic category fields (screens, fabric, expiration) without schema migrations. |
| **`cart-service`** | Active Carts & Sessions | **Redis** (Key-Value) | Sub-millisecond latency | In-memory key access guarantees < 1ms response latency on every page view with automated 24-hour TTL expiry. |
| **`telemetry-service`** | Demo Rider Fixtures | **No durable sink** | Seven illustrative rows | Cassandra is a proposed lab schema; measured throughput and device ingestion are not implemented. |
| **`referral-service`** | Referral Network | **Neo4j** (Graph) | Multi-tier hops (1 to 3) | Index-free adjacency traverses friend-of-a-friend relationships in O(1) memory pointer jumps instead of recursive SQL. |
| **`warehouse-service`**| Monthly Reporting | **Apache Hive on HDFS** | 2,000,000 orders/month | Columnar ORC compression, partition pruning by month, and bucketing by customer ID for fast aggregations. |

---

## ⚡ Dual-Portal User Interface

The platform provides a dedicated portal switch in the top navigation, completely separating the consumer experience from merchant operations across dedicated Next.js 15 App Router routes:

### 🛍️ 1. Consumer Storefront
- **Landing Page (`/`):** Hero showcase, real-time metrics, trust badges, category quick pills, and featured products grid.
- **Full Catalog Explorer (`/shop`):** Category filtering, search query input, price sorting (Low → High, High → Low), and Grid/List view toggle.
- **Product Details Page (`/shop/[id]`):** High-resolution product display, category-specific polymorphic specifications, stock counter, quantity stepper, Add to Cart, and Buy Now.
- **Shopping Bag (`/cart`):** Full itemized cart with quantity steppers, promo code discount engine (`VIP10`), express delivery calculator, and total conversion in USD and KHR (`1 USD = 4,100 KHR`).
- **Checkout & Settlement (`/checkout`):** Multi-step checkout with delivery address selection, interactive **Bakong KHQR** QR modal with 3-minute countdown timer and simulated ABA/Wing scan, and Cash on Delivery.
- **Order Tracking (`/orders` & `/orders/[id]`):** Live delivery progression timeline (`Pending` → `Preparing` → `Out for Delivery` → `Delivered`), itemized order receipts, and delivery coordinates.
- **Account & Addresses (`/account`):** Customer profile, VIP Gold loyalty points, saved delivery addresses CRUD, and Neo4j social referral code sharing.

### 💼 2. Merchant & Operations Portal (`/merchant`)
- **Executive Overview (`/merchant`):** Angkoro-style KPI metric cards (GMV, orders, active SKUs, courier fleet), polyglot datastore health matrix, and live order fulfillment queue.
- **Inventory & Stock Management (`/merchant/products`):** Full catalog management data table with category filter, search by SKU/name, and direct MongoDB document deletion.
- **Create Product Document (`/merchant/products/new`):** Dynamic form supporting category polymorphic specifications (Screen Size and Warranty for Electronics, Size and Colours for Clothing, Net Weight and Expiry for Groceries).
- **Fulfillment & Order State Machine (`/merchant/orders` & `/merchant/orders/[id]`):** Live order queue with state machine status updates advancing orders from Pending to Delivered.
- **Fleet Telemetry (`/merchant/fleet` → `/admin/fleet`):** Separate simulated road map; the admin cockpit shows labelled fixture riders with city filters. No CQL stream or manual GPS ingestion exists.
- **Social Referral Network (`/merchant/referrals`):** Neo4j 3-tier deep tree network visualizer calculating multi-tier commission rewards (Tier 1: 5%, Tier 2: 3%, Tier 3: 1%).
- **Warehouse Analytics Workbench (`/merchant/warehouse`):** Interactive Apache Hive console for analytical queries (D1 through D4), Tez execution time benchmark, and ORC optimization breakdown.

---

## 📂 Repository Layout

```
.
├── backend/                         # Enterprise NestJS Backend API (Port 4000)
│   ├── src/
│   │   ├── catalog/                 # MongoDB Catalog controller, service & DTOs
│   │   ├── orders/                  # MongoDB Orders & state machine controller & service
│   │   ├── telemetry/               # Versioned rider fixtures; GPS ingestion disabled (no sink)
│   │   ├── referral/                # Neo4j Graph referral service (3-tier social graph)
│   │   ├── warehouse/               # Apache Hive reporting service (OLAP batch)
│   │   ├── database/                # Native MongoDB connection module
│   │   └── main.ts                  # NestFactory bootstrap + Swagger OpenAPI setup (/api/docs)
│   ├── package.json
│   └── tsconfig.json
├── web/                             # Next.js 15 Full-Stack Application (Port 3001)
│   ├── src/
│   │   ├── types/                   # Unified TypeScript models
│   │   ├── context/                 # CartContext, CurrencyContext, ToastContext
│   │   ├── lib/                     # API client & resilient fallback stores
│   │   ├── components/
│   │   │   ├── shared/              # Header, Footer, Modal, QuickViewModal, ToastContainer, AppShell
│   │   │   ├── customer/            # ProductCard, CartDrawer, KhqrPaymentModal, OrderTimeline
│   │   │   └── merchant/            # MerchantSidebar, MerchantHeader, KpiCard, FleetConsole, ReferralGraph, HiveWorkbench
│   │   └── app/
│   │       ├── layout.tsx           # Global root layout wrapping providers
│   │       ├── page.tsx             # Customer Storefront Landing Page
│   │       ├── shop/                # Full Catalog Explorer & PDP (/shop/[id])
│   │       ├── cart/                # Dedicated Shopping Bag Page
│   │       ├── checkout/            # Multi-step Checkout with Bakong KHQR
│   │       ├── orders/              # Orders & Delivery Tracking (/orders/[id])
│   │       ├── account/             # Customer Profile, Addresses & Referral Link
│   │       ├── merchant/            # Merchant Portal Shell Layout & Overview
│   │       │   ├── products/        # Inventory Management Table & Create Form (/new)
│   │       │   ├── orders/          # Fulfillment Queue & State Machine (/orders/[id])
│   │       │   ├── fleet/           # Demo fleet fixtures and separate sandbox view
│   │       │   ├── referrals/       # Neo4j 3-Level Referral Reward Network
│   │       │   └── warehouse/       # Apache Hive OLAP Workbench (Queries D1-D4)
│   │       └── api/                 # Next.js API Routes (products, orders, riders, referrals, analytics)
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
│   ├── architecture.md              # System Architecture & Polyglot Data Flow
│   ├── cap-theorem-analysis.md      # Multi-DC Partition Analysis (AP vs CP)
│   ├── hive-warehouse-design.md     # Hive Partitioning, Bucketing & ORC
│   └── nosql-database-design.md     # NoSQL Engine Selection Rationale
├── run_lab.ps1                      # Automated pipeline runner
├── AGENTS.md
└── README.md
```

---

## 🚀 Quick Start

### 1. Run the NestJS Backend API
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

### 3. One-Command Full-Stack Docker Deployment (Recommended)
```bash
docker compose up -d
```
Spins up the **entire production stack in containers** with automated MongoDB seeding:
- **Customer Storefront & Merchant Portal:** [http://localhost:3001](http://localhost:3001)
- **NestJS Backend API:** [http://localhost:4000](http://localhost:4000)
- **Swagger OpenAPI Documentation:** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **MongoDB 8.0:** `localhost:27017` (auto-seeded with 51 authentic Cambodian products, customers, and orders)
- **Redis 7:** `localhost:6379`
- **Apache Cassandra 4.1:** `localhost:9042`
- **Neo4j 5.18:** `localhost:7474` (HTTP Browser) / `localhost:7687` (Bolt)

To rebuild after changes:
```bash
docker compose up -d --build
```

To stop all services:
```bash
docker compose down
```

### 4. Run the Hive Warehouse Pipeline (WSL2 / Linux)
```powershell
./run_lab.ps1
```

---

## 📄 License
MIT License. Built for distributed data platform practice and exploration.
