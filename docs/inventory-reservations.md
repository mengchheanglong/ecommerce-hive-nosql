# Inventory reservation policy — version 1

This policy applies to new orders in the reference marketplace. It is independent of
`supply-chain-platform` and does not connect to its operational database.

## Quantities and lifecycle

`products.stock` is **available** quantity. `reserved_stock` is quantity held for accepted
orders. Physical on-hand is `stock + reserved_stock`; missing legacy `reserved_stock`
is interpreted as zero for new reservations. Both counters are nonnegative safe integers
in units of individual items (`each`). SKU lines are aggregated before checking stock.

| Action | Order state | Available delta | Reserved delta | Physical delta |
|---|---|---:|---:|---:|
| Accept checkout | Pending / Preparing | -quantity | +quantity | 0 |
| Begin shipment | Out for Delivery | 0 | -quantity | -quantity |
| Confirm delivery | Delivered | 0 | 0 | 0 |
| Cancel before shipment | Cancelled | +quantity | -quantity | 0 |

Preparing retains the reservation. Cancellation after shipment is rejected; physically
returned goods need an explicit returns/receiving workflow, which is not implemented.
Cancelled and Delivered are terminal. New orders cannot start as shipped or delivered.

## Atomicity and retries

Products, order state, reservation metadata, and the `inventory_events` ledger are changed
in one MongoDB transaction using snapshot reads and majority writes. Conditional counter
updates and transaction conflict retries prevent concurrent overselling. Unique indexes
protect product IDs, order IDs, and `(order_id, operation)` ledger entries. Ledger records
carry schema version, source, a fixed demo tenant identity, units, lines and UTC creation time.
The fixed identity is provenance for this single-demo application, not tenant authorization.

Every checkout must supply a stable `order_id`. An identical retry returns the existing
order, including its current fulfillment state. A different normalized payload using that
ID returns 409. Repeated status requests return the current order without moving stock or
changing its timestamps. A repeated status request cannot change the assigned courier.
Use the same order ID after a timeout or lost response; never substitute an offline order.

Order `total_minor` and line `price_minor` are authoritative integer USD cents. Compatibility
`total`/`price` fields are projections. Inputs with more than two decimal places are rejected.
This task does not implement server-issued price quotes, discount/payment verification,
identity authorization, inventory replenishment, or an enterprise inventory ledger.

## Legacy data and failures

No existing order or stock balance is automatically migrated. Old orders have ambiguous
stock semantics. A stock-changing transition without version-1 reservation metadata returns
409 and requires explicit reconciliation; an identical status retry does no work.
Duplicate/missing product or order IDs can prevent unique-index creation, causing writes to
fail. Review and reconcile those records rather than deleting or resetting stock automatically.

Unknown orders/products return 404, malformed requests return 400, stock or lifecycle
conflicts return 409, and unavailable/unsupported transactions return 503. Order and catalog mutation errors
are never converted into successful fallback writes. Fixture reads remain legacy behavior.
Unscoped `/api/products/adjust-stock` is disabled. Catalog updates cannot edit inventory
counters or product identity, and products with active reservations cannot be deleted.

## Local transaction support

MongoDB transactions require a replica set. The original standalone Compose configuration
can serve reads but cannot accept transactional checkout. An opt-in overlay configures a
single-node local replica set without recreating the existing volume:

```powershell
docker compose -f docker-compose.yml -f compose.inventory.yaml up -d
```

The init service refuses an unexpected existing replica-set identity. This overlay changes
the MongoDB startup configuration; it has been structurally validated, not applied to the
existing database during P0-02 work. Reconcile legacy records before accepting writes.
For a host-run backend against this replica set:

```powershell
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/?directConnection=true&replicaSet=marketplace_inventory'
```

## Verification

From `backend`, run `pnpm test` for unit/web write-boundary checks, or
`pnpm test:inventory` for all checks against a disposable MongoDB 8 replica set.
The latter requires Docker and PowerShell. It binds a random loopback port, mounts no
existing volumes, uses a unique test database, and removes its container on completion.

Final maintenance evidence: 23 tests pass, including concurrent overselling prevention, duplicate create/
ship/cancel retries, competing ship/cancel decisions, multi-SKU rollback, injected ledger
failures, legacy-order rejection, catalog counter protections, real HTTP validation and
browser API failure handling, fixture telemetry provenance and disabled GPS ingestion. Backend build and web TypeScript checks pass. No existing
marketplace data or container configuration was changed by the tests.
