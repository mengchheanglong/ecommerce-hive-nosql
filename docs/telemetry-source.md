# Telemetry source and sink policy

The implemented marketplace telemetry API is **fixture-only**. Its versioned response
labels source/status, demo tenant, units and absence of durable storage. No Cassandra
driver is installed. A successful GET is not a database health probe.

GPS writes return HTTP 503 and `stored: false`. The web application exposes no manual
ping control, simulated CQL feed or optimistic write acknowledgement. API loss clears
the fixture roster and displays unavailable; no browser write/read fallback is used.
The admin road map is a separate read-only view of **simulated** sandbox positions.
The simulator alone owns its bounded, volatile ping history.

Run `pnpm test` from backend for fixture, HTTP refusal and web failure-contract tests.
The historical cassandra/schema.cql file and optional Cassandra container describe a
possible lab design; they do not activate persistence in the application.

The GET response includes schemaVersion 1, source/status fixture, sourceId
marketplace-demo-riders-v1, tenantId demo, observedAt null, storage none, durable false
and sinkOwner none. Units are degrees, km/h and percent. Throughput/volume/TTL are
null; fixture counts describe the returned rows. These changes establish neither
observed courier GPS, production authorization nor tenant isolation.
