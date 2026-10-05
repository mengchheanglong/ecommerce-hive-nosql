# Rider Telemetry Microservice

## Overview
The **Rider Telemetry Service** ingests high-frequency GPS location pings from 800 delivery riders every 5 seconds.

- **Primary Datastore:** Apache Cassandra (Column-Family / LSM Tree)
- **Keyspace:** `telemetry_ks`
- **Table:** `rider_gps_pings`
- **Workload Scale:**
  - 800 riders × 12 pings/minute = 9,600 pings/minute = **160 writes / second**
  - Continuous 24h intake: **~13,824,000 writes / day**
- **Why Cassandra:** Masterless peer-to-peer ring with sequential write path (CommitLog + Memtable + SSTables). Handles write-heavy time-series workloads without table-level row lock contention.
