# CAP Theorem Analysis — ecommerce Multi-DC Deployment

## Context
ecommerce operates out of two primary data centers (DCs): Phnom Penh and Siem Reap. This dual-DC strategy is essential for geographic redundancy and low latency for regional users. However, distributed systems spanning multiple locations are susceptible to network partitions.

## The CAP Theorem
The CAP theorem states that a distributed data store can guarantee at most two of the following three properties simultaneously:
- **Consistency (C):** Every read receives the most recent write or an error.
- **Availability (A):** Every request receives a non-error response, without the guarantee that it contains the most recent write.
- **Partition Tolerance (P):** The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network between nodes.

In any networked distributed system, Partition Tolerance (P) is a given—network failures will happen. Therefore, engineers must choose between Consistency (CP) and Availability (AP) during a network partition.

## Analysis: Shopping Cart Service
**CAP Choice:** AP (Availability and Partition Tolerance)

**Rationale:**
For an e-commerce platform, the primary goal of the shopping cart is to capture user intent. If the network between Phnom Penh and Siem Reap fails, blocking a user from adding items to their cart directly translates to lost revenue. By choosing an AP system, both DCs can continue to accept cart updates independently during a partition.

**Trade-offs and Mitigation:**
The trade-off is temporary inconsistency. A user might add an item via a mobile app routed to Phnom Penh, and shortly after, view their cart on a desktop routed to Siem Reap, not seeing the updated item immediately. We accept this temporary staleness. Once the partition resolves, the system uses Eventual Consistency (e.g., CRDTs or timestamp-based reconciliation) to merge the divergent cart states.

## Analysis: Customer Wallet Service
**CAP Choice:** CP (Consistency and Partition Tolerance)

**Rationale:**
The Customer Wallet manages digital currency balances used for purchases. This is strict financial data. If we chose AP for the wallet, a partition would allow a user to spend their balance in Phnom Penh, and then spend the identical balance again in Siem Reap before the DCs synchronize.

**Risks of AP (Double-Spending) and Mitigation:**
An AP approach here introduces catastrophic financial risk (double-spending). Therefore, the wallet must be CP. During a partition, one or both DCs might refuse write operations (transactions) if they cannot achieve quorum to guarantee consistency. The trade-off is that users may temporarily be unable to make purchases using their wallet balance until the partition heals. To mitigate the poor user experience, the UI must gracefully handle these errors, perhaps falling back to standard payment gateways (credit cards) while clearly communicating the temporary wallet outage.

## Summary Table

| Service | CAP Choice | Rationale | Risk if Wrong Choice |
|---------|------------|-----------|----------------------|
| Shopping Cart | AP | Maximizes revenue; users can always add items. | If CP, carts become locked during partitions, causing cart abandonment and direct revenue loss. |
| Customer Wallet | CP | Strict financial consistency required to prevent fraud. | If AP, high risk of double-spending and irreconcilable financial discrepancies. |

## Recommendations
1. **Service Isolation:** Ensure that the AP datastore for carts (e.g., Redis Cluster in AP mode) is physically and logically separated from the CP datastore for wallets (e.g., a properly tuned consensus-based RDBMS or NoSQL CP configuration).
2. **Graceful Degradation:** Implement circuit breakers in the application layer for the CP wallet service. If the service becomes unavailable due to a partition, fail fast and offer alternative payment methods to the user.
3. **Reconciliation Monitoring:** For the AP cart service, monitor the conflict resolution metrics post-partition to ensure the eventual consistency mechanisms are functioning correctly without corrupting user data.
