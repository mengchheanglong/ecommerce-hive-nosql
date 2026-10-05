-- KhmerCart Data Warehouse
-- Customer dimension table

USE khmercart;

CREATE TABLE IF NOT EXISTS customers (
    customer_id STRING,
    name STRING,
    city STRING
)
STORED AS ORC;
