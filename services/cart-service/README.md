# Cart & Session Microservice

## Overview
The **Cart & Session Service** maintains ephemeral shopping carts and active authenticated user sessions.

- **Primary Datastore:** Redis (In-Memory Key-Value)
- **Key Pattern:** `cart:{sessionId}` or `session:{token}`
- **TTL:** 24 Hours (`86400` seconds)
- **Key Characteristics:** Sub-millisecond latency (<1ms) required on every single page render. Employs AP (Availability-Partition tolerant) design during multi-DC network splits.

## Operations
- `GET /api/cart/:sessionId` - Instant O(1) hash retrieval of cart items
- `POST /api/cart/:sessionId/items` - Add or update item quantity with Redis `HSET`
- `DELETE /api/cart/:sessionId/items/:productId` - Remove item via `HDEL`
