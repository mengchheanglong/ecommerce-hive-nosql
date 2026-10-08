# AI Agent Instructions: ecommerce-hive-nosql

This is a retired e-commerce reference. Preserve its e-commerce scope. Do not implement
warehouse/distribution platform features here; those belong to supply-chain-platform.
Further changes require a specific user request.

## Project Overview
- **Project Name:** ecommerce-hive-nosql
- **Description:** A polyglot persistence data platform and interactive Next.js full-stack marketplace for high-scale e-commerce workloads, combining MongoDB, Apache Cassandra, Redis, Neo4j, and Apache Hive on HDFS, featuring fully separated Customer Storefront and Merchant Operations portals.

## Project Structure
```
.
├── AGENTS.md
├── README.md
├── run_lab.ps1                      # End-to-end data pipeline automation script
├── docs/
│   ├── architecture.md              # System architecture & polyglot data flow
│   ├── cap-theorem-analysis.md      # Multi-DC network partition CAP analysis
│   ├── hive-warehouse-design.md     # Hive warehouse & query engine design
│   └── nosql-database-design.md     # NoSQL database selection & schema design
├── data/
│   └── sample/
│       └── orders-2026-09-sample.csv
├── hive/
│   ├── ddl/
│   │   ├── 01-create-database.hql   # Database creation
│   │   ├── 02-create-orders-raw.hql # Raw staging table (TextFile)
│   │   ├── 03-create-orders-opt.hql # Optimized analytics table (ORC)
│   │   └── 04-create-customers.hql  # Customers dimension table
│   ├── etl/
│   │   └── load-orders.hql          # CSV → Raw → Optimized ETL pipeline
│   └── analytics/
│       ├── revenue-by-province.hql
│       ├── top-customers.hql
│       ├── popular-categories.hql
│       └── order-tiers.hql
├── mongodb/
│   ├── schemas/
│   │   ├── customers.json           # JSON Schema for customers collection
│   │   └── products.json            # JSON Schema for products collection
│   └── scripts/
│       ├── seed-products.js         # Insert sample products
│       └── crud-operations.js       # Full CRUD demo script
├── backend/                         # Enterprise NestJS Backend API (Port 4000)
│   ├── src/
│   │   ├── catalog/                 # MongoDB Catalog module (GET, POST, PUT, DELETE)
│   │   ├── orders/                  # MongoDB Orders & state machine (GET, GET :id, POST, PUT)
│   │   ├── telemetry/               # Versioned rider fixtures; GPS ingestion disabled (no sink)
│   │   ├── referral/                # Neo4j Graph referral service (3-tier social graph)
│   │   ├── warehouse/               # Apache Hive reporting service (OLAP batch)
│   │   ├── database/                # Native MongoDB connection module
│   │   └── main.ts                  # NestFactory bootstrap + Swagger OpenAPI setup (/api/docs)
│   ├── package.json
│   └── tsconfig.json
├── cassandra/                       # Apache Cassandra CQL Schemas & Compaction Config
│   └── schema.cql
├── neo4j/                           # Neo4j Graph Cypher Schema & Traversal Queries
│   └── queries.cypher
└── web/                             # Next.js 15 Full-Stack Web Application (Port 3001)
    ├── src/
    │   ├── types/                   # Unified TypeScript models
    │   ├── context/                 # CartContext, CurrencyContext, ToastContext
    │   ├── lib/                     # API client & resilient fallback stores
    │   ├── components/
    │   │   ├── shared/              # Header, Footer, Modal, QuickViewModal, ToastContainer
    │   │   ├── customer/            # ProductCard, CartDrawer, KhqrPaymentModal, OrderTimeline
    │   │   └── merchant/            # MerchantSidebar, MerchantHeader, KpiCard, FleetConsole, ReferralGraph, HiveWorkbench
    │   └── app/
    │       ├── layout.tsx           # Global root layout wrapping providers
    │       ├── page.tsx             # Customer Storefront Landing Page
    │       ├── shop/                # Customer Full Catalog Explorer
    │       │   └── [id]/            # Detailed Product Page (PDP)
    │       ├── cart/                # Dedicated Shopping Cart Page
    │       ├── checkout/            # Multi-step Checkout (Bakong KHQR, COD)
    │       ├── orders/              # Customer My Orders & Delivery Tracking
    │       │   └── [id]/            # Order Timeline & Details Inspection
    │       ├── account/             # Customer Profile, Addresses & Referral Link
    │       ├── merchant/            # Merchant Portal Shell Layout
    │       │   ├── page.tsx         # Merchant Executive Overview Dashboard
    │       │   ├── products/        # Inventory Management Data Table
    │       │   │   └── new/         # Add Product Form with Polymorphic Specs
    │       │   ├── orders/          # Fulfillment Queue & State Machine
    │       │   │   └── [id]/        # Order Fulfillment Inspector
    │       │   ├── fleet/           # Demo fleet fixtures and separate sandbox view
    │       │   ├── referrals/       # Neo4j 3-Level Referral Reward Network
    │       │   └── warehouse/       # Apache Hive OLAP Workbench (Queries D1-D4)
    │       └── api/                 # Next.js API Routes (/api/products, orders, riders, referrals, analytics)
    ├── package.json
    ├── tailwind.config.ts
    └── tsconfig.json
```

## Key Conventions
- **Hive:** HiveQL files use the `.hql` extension. SQL keywords should be UPPERCASE.
- **MongoDB:** MongoDB scripts use the `.js` extension, meant to be run via `mongosh`.
- **Schemas:** Defined in JSON Schema (draft-07) format.
- **DDL ordering:** Hive DDL files are prefixed with numbers (`01-`, `02-`, ...) to indicate execution order.
- **Backend:** NestJS 10 with Swagger OpenAPI documentation on `http://localhost:4000/api/docs`.
- **Web App:** Next.js 15 App Router with separated Customer and Merchant experiences, TypeScript, and Tailwind CSS on port 3001.

## Testing & Running
- **Full Stack via Docker (One Command):** `docker compose up -d` (starts MongoDB, Redis, Cassandra, Neo4j, NestJS backend, and Next.js frontend with auto-seeding)
- **NestJS Backend (Standalone):** `cd backend && pnpm start` (accessible on `http://localhost:4000`, Swagger docs at `/api/docs`)
- **Web App (Standalone):** `cd web && pnpm dev` (accessible on `http://localhost:3001`)
- **MongoDB Scripts:** `mongosh ecommerce mongodb/scripts/seed-products.js`
- **Hive Pipeline:** Run sequentially or via `./run_lab.ps1`
