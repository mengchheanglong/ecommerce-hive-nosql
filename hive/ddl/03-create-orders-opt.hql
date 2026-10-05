-- KhmerCart Data Warehouse
-- Optimized analytics layer for order data
-- Stored as ORC, partitioned by month for pruning, bucketed by customer for join performance

USE khmercart;

CREATE TABLE IF NOT EXISTS orders_opt (
    order_id STRING,
    customer_id STRING,
    product_id STRING,
    category STRING,
    province STRING,
    quantity INT,
    unit_price DOUBLE,
    order_date STRING,
    payment_method STRING
)
PARTITIONED BY (order_month STRING)
CLUSTERED BY (customer_id) INTO 8 BUCKETS
STORED AS ORC;

-- Set before inserting data to ensure bucketing is applied correctly
-- SET hive.enforce.bucketing = true;
