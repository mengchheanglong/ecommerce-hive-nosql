# Order Processing Microservice

## Overview
The **Order Service** coordinates order placement, state transitions, checkout settlement (Bakong KHQR, Cash on Delivery), and batch event export to the analytics staging pipeline.

- **Primary Datastore:** MongoDB (Document Store)
- **Collection:** `orders`
- **Analytics Pipeline:** Batched nightly/monthly exports into HDFS `/staging/orders/YYYY-MM.csv` for Apache Hive warehouse ingestion.

## Order Lifecycle
1. `CREATED` - Customer initiates checkout
2. `PAID` - Settlement verified via Bakong KHQR webhook
3. `DISPATCHED` - Assigned to a delivery rider via Cassandra fleet service
4. `DELIVERED` - Handed off to customer
