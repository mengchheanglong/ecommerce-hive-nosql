-- KhmerCart Data Warehouse
-- ETL Flow: Load from staging CSV -> Raw Layer -> Optimized ORC Layer

USE khmercart;

-- 1. Load CSV data from HDFS staging directly into the raw text table
LOAD DATA INPATH '/staging/orders/2026-09.csv' INTO TABLE orders_raw;

-- 2. Verify row count (Task C1 confirmation)
SELECT COUNT(*) AS total_orders_raw FROM orders_raw;

-- 3. Configure Hive for dynamic partitioning and bucketing execution
SET hive.enforce.bucketing = true;
SET hive.exec.dynamic.partition = true;
SET hive.exec.dynamic.partition.mode = nonstrict;

-- 4. Transform and load into the optimized analytics table
INSERT OVERWRITE TABLE orders_opt PARTITION (order_month)
SELECT 
    order_id,
    customer_id,
    product_id,
    category,
    province,
    quantity,
    unit_price,
    order_date,
    payment_method,
    SUBSTR(order_date, 1, 7) AS order_month
FROM orders_raw;

-- 5. Seed customers dimension table for analytical queries
INSERT OVERWRITE TABLE customers VALUES
('CUST-901', 'Sokha Meas', 'Phnom Penh'),
('CUST-213', 'Dara Sam', 'Siem Reap'),
('CUST-844', 'Bopha Chan', 'Battambang'),
('CUST-102', 'Vannak Lim', 'Phnom Penh'),
('CUST-555', 'Chenda Som', 'Siem Reap'),
('CUST-777', 'Kosal Heng', 'Phnom Penh'),
('CUST-403', 'Sreypov Keo', 'Battambang'),
('CUST-604', 'Rithy Ouk', 'Phnom Penh'),
('CUST-333', 'Piseth Seng', 'Siem Reap');

SELECT COUNT(*) AS total_orders_opt FROM orders_opt;
