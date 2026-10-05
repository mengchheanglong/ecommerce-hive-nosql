# AI Agent Instructions: ecommerce-hive-nosql

## Project Overview
- **Project Name:** ecommerce-hive-nosql
- **Description:** A polyglot persistence data platform and interactive Next.js full-stack marketplace for high-scale e-commerce workloads, combining MongoDB, Apache Cassandra, Redis, Neo4j, and Apache Hive on HDFS.

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
├── backend/                         # Enterprise NestJS Microservices Backend (Port 4000)
│   ├── src/
│   │   ├── catalog/                 # MongoDB Catalog microservice
│   │   ├── orders/                  # MongoDB Orders & state machine
│   │   ├── telemetry/               # Cassandra Rider GPS telemetry service
│   │   ├── referral/                # Neo4j Graph referral service
│   │   ├── warehouse/               # Apache Hive reporting service
│   │   ├── database/                # Native MongoDB connection module
│   │   └── main.ts                  # NestFactory bootstrap + Swagger OpenAPI setup
│   ├── package.json
├── cassandra/                       # Apache Cassandra CQL Schemas & Compaction Config
│   └── schema.cql
├── neo4j/                           # Neo4j Graph Cypher Schema & Traversal Queries
│   └── queries.cypher
└── web/                             # Next.js 15 Full-Stack Web Application (Port 3001)
    ├── src/
    │   ├── app/
    │   │   ├── api/                 # API routes (products, analytics, riders)
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx             # Interactive dashboard & marketplace
    │   └── lib/
    │       └── mongodb.ts           # Native MongoDB connection driver
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
- **Web App:** Next.js 15 with App Router, TypeScript, and Tailwind CSS. Runs on port 3001.

## Testing & Running
- **NestJS Backend:** `cd backend && pnpm start` (accessible on `http://localhost:4000`, Swagger docs at `/api/docs`)
- **Web App:** `cd web && pnpm dev` (accessible on `http://localhost:3001`)
- **MongoDB Scripts:** `mongosh ecommerce mongodb/scripts/seed-products.js`
- **Hive Pipeline:** Run sequentially or via `./run_lab.ps1`

