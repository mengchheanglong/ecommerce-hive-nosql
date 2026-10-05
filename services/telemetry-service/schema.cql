-- Apache Cassandra Keyspace and Table for High-Throughput Rider GPS Telemetry
-- 800 riders pinging every 5 seconds = 160 writes/sec = ~13.8 Million rows/day

CREATE KEYSPACE IF NOT EXISTS telemetry_ks
WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 3
};

USE telemetry_ks;

-- Time-Series Table: Partitioned by rider_id and date for efficient sequential range queries
CREATE TABLE IF NOT EXISTS rider_gps_pings (
    rider_id text,
    ping_date date,
    ping_timestamp timestamp,
    latitude double,
    longitude double,
    speed_kmh double,
    battery_level int,
    status text,
    PRIMARY KEY ((rider_id, ping_date), ping_timestamp)
) WITH CLUSTERING ORDER BY (ping_timestamp DESC)
AND default_time_to_live = 2592000 -- Auto-expire pings after 30 days (2,592,000 seconds)
AND compaction = {
    'class': 'TimeWindowCompactionStrategy',
    'compaction_window_unit': 'DAYS',
    'compaction_window_size': '1'
};

-- Secondary query support for fleet dispatch lookup
CREATE TABLE IF NOT EXISTS rider_current_status (
    rider_id text PRIMARY KEY,
    name text,
    city text,
    last_ping_timestamp timestamp,
    last_latitude double,
    last_longitude double,
    current_speed double,
    battery_level int,
    status text
);
