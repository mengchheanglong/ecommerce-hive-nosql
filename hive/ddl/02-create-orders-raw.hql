-- ecommerce Data Warehouse
-- Staging/Raw layer for order data
-- Reads CSV files directly as they land in HDFS

USE ecommerce;

CREATE EXTERNAL TABLE IF NOT EXISTS orders_raw (
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
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
TBLPROPERTIES ('skip.header.line.count'='1');
