# NoSQL Database Design

## Introduction
As KhmerCart scales to accommodate growing user traffic and diverse business requirements, a single relational database management system is no longer sufficient. To optimize performance, scalability, and developer velocity, KhmerCart has adopted a polyglot persistence architecture. This approach leverages the distinct strengths of various NoSQL databases tailored to specific domain workloads, ensuring that each microservice uses the most appropriate data store for its access patterns.

## Database Technologies and Workload Rationale

### MongoDB for Product Catalogue
The product catalogue requires a highly flexible schema to support heterogeneous product types. A washing machine has vastly different attributes than fresh produce or clothing. MongoDB's document model allows us to store these diverse entities within a single collection without the overhead of complex joins or sparse tables (EAV patterns) typical in relational databases. The ability to index on flexible JSON structures ensures fast read performance for catalog browsing and search.

### Redis for Shopping Carts & Sessions
Shopping carts and user sessions dictate ultra-low latency requirements and transient data lifecycles. Redis, as an in-memory key-value store, provides sub-millisecond response times essential for a seamless checkout experience. Its native support for Time-To-Live (TTL) automatically handles session expiration and cart abandonment, offloading garbage collection from application logic and persisting only active sessions in memory.

### Neo4j for Referral Programme
Our referral program introduces a multi-level reward system where users are compensated for referrals up to three degrees of separation. Querying hierarchical or graph-like relationships in a relational or document database leads to deep, expensive recursive queries. Neo4j, a native graph database, excels at traversing complex relationships. Using Cypher, we can efficiently execute deep graph traversals (e.g., finding a user's 3rd-level network) in milliseconds, allowing real-time reward calculation.

### Cassandra for Rider GPS Tracking
The logistics and delivery fleet generates immense volumes of time-series data, peaking at an estimated 13.8 million GPS pings daily. This workload is highly write-intensive. Apache Cassandra's distributed, masterless architecture is engineered for exactly this profile. Its append-only storage engine provides linear write scalability, allowing us to ingest high-frequency telemetry data without write bottlenecks while supporting efficient time-based range queries for tracking riders.

## MongoDB Schema Design

### Customers Collection
The `customers` collection manages core user identity and account details. A key engineering decision is the treatment of related entities: addresses and past orders.
- **Embedded Addresses:** A customer's addresses (home, work) are embedded as an array of sub-documents. Since addresses are tightly bound to the customer, rarely accessed independently, and limited in number, embedding avoids additional read queries and provides atomic updates when modifying user profiles.
- **Referenced Orders:** Conversely, `past_orders` is implemented as an array of order IDs (references). Orders are distinct, unbounded transactional entities that grow infinitely over time. Embedding orders would lead to massive document sizes, eventually exceeding MongoDB's 16MB document limit and severely degrading performance.

### Products Collection
The `products` collection utilizes the polymorphic document pattern to manage diverse categories. Every document contains a set of common base fields (`product_id`, `name`, `category`, `price`, `status`). Beyond this, the schema enforces category-specific sub-schemas:
- **Electronics:** Requires `screen_size` and `warranty`.
- **Clothing:** Requires `size` and an array of `colours`.
- **Groceries:** Requires `weight` and `expiry_date`.
This pattern allows the application to query across all products seamlessly while maintaining data integrity for specialized fields.
