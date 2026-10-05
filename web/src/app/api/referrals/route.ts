import { NextResponse } from "next/server";

export async function GET() {
  // Neo4j Graph Data Model: 3-tier deep social network
  const referralTree = {
    rootCustomer: {
      id: "C0457",
      name: "Sokha Meas",
      city: "Phnom Penh",
      totalEarnedRewards: "$184.50",
      totalNetworkUsers: 8,
    },
    levels: [
      {
        tier: 1,
        label: "Direct Referrals (Level 1)",
        rewardRate: "5% Payout",
        users: [
          { id: "C1001", name: "Vireak Chan", city: "Phnom Penh", date: "2026-07-10", spend: "$420.00", earned: "$21.00" },
          { id: "C1002", name: "Sophea Kim", city: "Siem Reap", date: "2026-07-15", spend: "$650.00", earned: "$32.50" },
        ],
      },
      {
        tier: 2,
        label: "Second-Degree Friends (Level 2)",
        rewardRate: "3% Payout",
        users: [
          { id: "C1003", name: "Rithy Pen", city: "Battambang", date: "2026-08-01", spend: "$810.00", earned: "$24.30" },
          { id: "C1005", name: "Kolab Heng", city: "Phnom Penh", date: "2026-08-12", spend: "$390.00", earned: "$11.70" },
          { id: "C1006", name: "Piseth Mao", city: "Siem Reap", date: "2026-08-18", spend: "$520.00", earned: "$15.60" },
        ],
      },
      {
        tier: 3,
        label: "Third-Degree Friends (Level 3)",
        rewardRate: "1% Payout",
        users: [
          { id: "C1004", name: "Bopha Nou", city: "Phnom Penh", date: "2026-08-20", spend: "$1,120.00", earned: "$11.20" },
          { id: "C1007", name: "Dara Kong", city: "Siem Reap", date: "2026-09-02", spend: "$780.00", earned: "$7.80" },
          { id: "C1008", name: "Chanthy Sam", city: "Battambang", date: "2026-09-10", spend: "$440.00", earned: "$4.40" },
        ],
      },
    ],
    graphStats: {
      engine: "Neo4j Graph Database (Bolt Protocol)",
      traversalType: "Index-Free Adjacency (O(1) memory pointer chasing)",
      cypherQuery: "MATCH (origin:Customer {id: 'C0457'})-[:REFERRED*1..3]->(ref:Customer)...",
    },
  };

  return NextResponse.json({ success: true, data: referralTree });
}
