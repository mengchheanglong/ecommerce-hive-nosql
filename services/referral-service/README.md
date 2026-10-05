# Referral Programme Microservice

## Overview
The **Referral Service** maps and evaluates multi-tier social invitation trees up to 3 levels deep ("friend of a friend of a friend").

- **Primary Datastore:** Neo4j (Graph Database)
- **Model:** `(:Customer)-[:REFERRED {date}]->(:Customer)`
- **Payout Rules:**
  - Level 1 (Direct Invite): 5% commission
  - Level 2 (2nd Degree): 3% commission
  - Level 3 (3rd Degree): 1% commission
- **Why Neo4j:** Graph engine uses index-free adjacency to traverse relationship pointers directly in memory, avoiding expensive recursive self-joins common in relational SQL.
