# Microservices & Polyglot Persistence Architecture

## 1. Architectural Vision
The e-commerce data platform is built around **independent microservices** coupled with a **polyglot persistence layer**. Rather than funneling all application traffic through a monolithic database, each domain bounded context communicates with a dedicated datastore designed for its specific query patterns, read/write ratios, and consistency requirements.

Furthermore, the frontend strictly separates consumer-facing e-commerce shopping from merchant and operations management.

```
                                  ┌──────────────────────────────┐
                                  │      Client Gateway / UI     │
                                  │ (Customer Store vs Merchant) │
                                  └──────────────┬───────────────┘
                                                 │
            ┌──────────────────┬─────────────────┼─────────────────┬──────────────────┐
            ▼                  ▼                 ▼                 ▼                  ▼
     ┌──────────────┐   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   ┌──────────────┐
     │   Catalog    │   │ Cart/Session │  │    Order     │  │  Telemetry   │   │   Referral   │
     │   Service    │   │   Service    │  │   Service    │  │   Service    │   │   Service    │
     └──────┬───────┘   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   └──────┬───────┘
            │                  │                 │                 │                  │
            ▼                  ▼                 ▼                 ▼                  ▼
     ┌──────────────┐   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   ┌──────────────┐
     │   MongoDB    │   │    Redis     │  │   MongoDB    │  │  Cassandra   │   │    Neo4j     │
     │  (Document)  │   │ (Key-Value)  │  │   (Orders)   │  │ (Column-LSM) │   │   (Graph)    │
     └──────────────┘   └──────────────┘  └──────┬───────┘  └──────────────┘   └──────────────┘
                                                 │
                                                 │ Periodic Batch Dumps
                                                 ▼
                                          ┌──────────────┐
                                          │ HDFS Staging │
                                          └──────┬───────┘
                                                 ▼
                                          ┌──────────────┐
                                          │ Apache Hive  │
                                          │ (Warehouse)  │
                                          └──────────────┘
```

---

## 2. Microservice Bounded Contexts

| Microservice | Bounded Context | Datastore | Scaling / Ingest Profile | Key Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **`catalog-service`** | Product catalog & polymorphic specs | **MongoDB** | High read, dynamic attributes | Dynamic JSON documents allow distinct attributes per category (OLED screens, fabric sizes, organic expiry dates). |
| **`cart-service`** | Ephemeral shopping carts & sessions | **Redis** | Sub-millisecond reads/writes | In-memory key-value with 24h TTL guarantees instant cart renders on every page view. |
| **`order-service`** | Checkout, payment & order state machine | **MongoDB** | Transactional writes | Reliable document persistence tracking order lifecycle (`Pending` → `Preparing` → `Out for Delivery` → `Delivered`). |
| **`telemetry-service`**| 800 rider GPS pings | **Apache Cassandra** | 160 writes/sec (~13.8M rows/day) | Masterless peer-to-peer ring with LSM storage engine absorbs high-throughput sequential writes without page locks. |
| **`referral-service`** | 3-tier deep social referral network | **Neo4j** | Graph traversals | Index-free adjacency navigates friend-of-a-friend relationships in O(1) pointer hops rather than costly SQL recursive joins. |
| **`warehouse-service`**| Monthly sales batch aggregation | **Apache Hive (HDFS)**| 2M rows/batch, OLAP analytics | Columnar ORC storage with partition pruning by month and customer bucketing for Power BI reporting. |

---

## 3. Separation of Concerns in UI

The web portal enforces a clean separation between consumer and merchant domains:

1. **Customer Storefront (`Customer Mode`):**
   - **Catalog & Shop:** Polymorphic product cards, category filtering, search, quick view modal, and live dual-currency conversion ($ USD / ៛ KHR).
   - **Cart Drawer & Checkout:** Slide-over cart panel, authentic Bakong KHQR QR code card with countdown timer, and simulated instant settlement.
   - **Order Tracking:** Track active and delivered purchases.
   - **Customer Profile:** Manage embedded delivery addresses and loyalty rewards.

2. **Merchant Operations Portal (`Merchant Mode`):**
   - **Inventory Management:** Full MongoDB CRUD interface for adding new products with dynamic category attributes, editing, and deleting items.
   - **Order Fulfillment:** Live order queue with state machine progression controls (`Pending` → `Preparing` → `Out for Delivery` → `Delivered`).
   - **Fleet Command:** Real-time Cassandra telemetry terminal displaying live GPS pings at 160 writes/sec, with battery gauges and speed meters.
   - **Referral Network:** Interactive 3-tier deep tree visualizer showing commission payouts (Level 1: 5%, Level 2: 3%, Level 3: 1%).
   - **Hive Warehouse BI:** Interactive HiveQL console allowing users to inspect and execute big data queries with performance metrics.

---

## 4. Multi-Container Orchestration (`docker-compose.yml`)

The complete polyglot ecosystem can be spun up using Docker Compose:

```bash
docker compose up -d
```

Containers initialized:
- `marketplace-mongodb` (port 27017)
- `marketplace-redis` (port 6379)
- `marketplace-cassandra` (port 9042)
- `marketplace-neo4j` (port 7474 / 7687)
- `marketplace-web` (port 3001)
