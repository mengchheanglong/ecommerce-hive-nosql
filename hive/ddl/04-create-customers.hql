-- ecommerce Data Warehouse
-- Customer dimension table

USE ecommerce;

CREATE TABLE IF NOT EXISTS customers (
    customer_id STRING,
    name STRING,
    city STRING
)
STORED AS ORC;
