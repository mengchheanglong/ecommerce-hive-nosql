import { Injectable } from "@nestjs/common";

@Injectable()
export class ReferralService {
  getReferralNetwork(customerId: string = "C0457") {
    return {
      success: true,
      engine: "Neo4j Graph Database (Bolt Protocol)",
      traversalAlgorithm: "Index-Free Adjacency (O(1) memory pointer jumps)",
      cypherQuery:
        "MATCH (origin:Customer {id: $id})-[:REFERRED*1..3]->(ref:Customer) RETURN origin, ref, length(path)",
      rootCustomer: {
        id: customerId,
        name: "Sokha Meas",
        city: "Phnom Penh",
        totalEarnedRewards: "$184.50",
        networkDepth: 3,
        totalInvited: 8,
      },
      tiers: [
        {
          tier: 1,
          label: "Level 1: Direct Referrals",
          commissionRate: "5% Reward",
          members: [
            { id: "C1001", name: "Vireak Chan", city: "Phnom Penh", spend: "$420.00", earned: "$21.00" },
            { id: "C1002", name: "Sophea Kim", city: "Siem Reap", spend: "$650.00", earned: "$32.50" },
          ],
        },
        {
          tier: 2,
          label: "Level 2: 2nd-Degree Friends",
          commissionRate: "3% Reward",
          members: [
            { id: "C1003", name: "Rithy Pen", city: "Battambang", spend: "$810.00", earned: "$24.30" },
            { id: "C1005", name: "Kolab Heng", city: "Phnom Penh", spend: "$390.00", earned: "$11.70" },
          ],
        },
        {
          tier: 3,
          label: "Level 3: 3rd-Degree Friends",
          commissionRate: "1% Reward",
          members: [
            { id: "C1004", name: "Bopha Nou", city: "Phnom Penh", spend: "$1,120.00", earned: "$11.20" },
            { id: "C1007", name: "Dara Kong", city: "Siem Reap", spend: "$780.00", earned: "$7.80" },
          ],
        },
      ],
    };
  }
}
