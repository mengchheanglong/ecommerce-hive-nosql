import { NextResponse } from "next/server";
import { INITIAL_REFERRALS } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("customerId") || "C0457";

  const tier1 = INITIAL_REFERRALS.filter((r) => r.level === 1);
  const tier2 = INITIAL_REFERRALS.filter((r) => r.level === 2);
  const tier3 = INITIAL_REFERRALS.filter((r) => r.level === 3);

  const totalRewardsUSD = INITIAL_REFERRALS.reduce((acc, cur) => acc + cur.earned, 0);
  const totalVolumeUSD = INITIAL_REFERRALS.reduce((acc, cur) => acc + cur.spend, 0);

  const referralTree = {
    rootCustomer: {
      id: customerId,
      name: "Sokha Meas",
      city: "Phnom Penh",
      totalEarnedRewards: `$${totalRewardsUSD.toFixed(2)}`,
      totalNetworkSpend: `$${totalVolumeUSD.toFixed(2)}`,
      totalNetworkUsers: INITIAL_REFERRALS.length,
      networkDepth: 3,
    },
    network: INITIAL_REFERRALS,
    tiers: [
      {
        tier: 1,
        label: "Direct Referrals (Level 1)",
        rewardRate: "5% Reward",
        members: tier1,
      },
      {
        tier: 2,
        label: "Second-Degree Friends (Level 2)",
        rewardRate: "3% Reward",
        members: tier2,
      },
      {
        tier: 3,
        label: "Third-Degree Friends (Level 3)",
        rewardRate: "1% Reward",
        members: tier3,
      },
    ],
    graphStats: {
      engine: "Neo4j Graph Database (Bolt Protocol)",
      traversalType: "Index-Free Adjacency (O(1) memory pointer jumps)",
      cypherQuery:
        "MATCH (origin:Customer {id: $id})-[:REFERRED*1..3]->(ref:Customer) RETURN origin, ref, length(path)",
      traversalLatencyMs: 1.4,
    },
  };

  return NextResponse.json({
    success: true,
    ...referralTree,
    data: referralTree,
  });
}
