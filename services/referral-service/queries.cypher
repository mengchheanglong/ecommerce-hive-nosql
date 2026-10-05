// Neo4j Cypher Queries for 3-Level Deep Referral Programme Network

// 1. Create Constraints
CREATE CONSTRAINT IF NOT EXISTS FOR (c:Customer) REQUIRE c.id IS UNIQUE;

// 2. Sample Data: Seed Referral Graph (3 Levels Deep)
MERGE (c1:Customer {id: 'C0457', name: 'Sokha Meas', city: 'Phnom Penh'})
MERGE (c2:Customer {id: 'C1001', name: 'Vireak Chan', city: 'Phnom Penh'})
MERGE (c3:Customer {id: 'C1002', name: 'Sophea Kim', city: 'Siem Reap'})
MERGE (c4:Customer {id: 'C1003', name: 'Rithy Pen', city: 'Battambang'})
MERGE (c5:Customer {id: 'C1004', name: 'Bopha Nou', city: 'Phnom Penh'})

// Relationships: Sokha referred Vireak & Sophea (L1) -> Vireak referred Rithy (L2) -> Rithy referred Bopha (L3)
MERGE (c1)-[:REFERRED {date: '2026-07-10'}]->(c2)
MERGE (c1)-[:REFERRED {date: '2026-07-15'}]->(c3)
MERGE (c2)-[:REFERRED {date: '2026-08-01'}]->(c4)
MERGE (c4)-[:REFERRED {date: '2026-08-20'}]->(c5);

// 3. Query: Compute 3-Level Deep Network and Multi-Tier Reward Payouts
// Level 1: 5% reward | Level 2: 3% reward | Level 3: 1% reward
MATCH (origin:Customer {id: 'C0457'})
MATCH path = (origin)-[:REFERRED*1..3]->(ref:Customer)
WITH origin, ref, length(path) AS level
RETURN origin.name AS Referrer,
       ref.name AS ReferredCustomer,
       level AS ReferralTier,
       CASE level
         WHEN 1 THEN '5% Payout'
         WHEN 2 THEN '3% Payout'
         WHEN 3 THEN '1% Payout'
         ELSE '0%'
       END AS RewardRate
ORDER BY ReferralTier ASC;
