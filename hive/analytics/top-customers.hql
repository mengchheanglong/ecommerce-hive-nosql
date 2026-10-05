-- Top 5 customers by total spend
-- Leverages bucketing on customer_id for optimized JOIN and GROUP BY performance
-- Report shows customer name, city, and total spend

USE ecommerce;

SELECT 
    c.name,
    c.city,
    SUM(o.quantity * o.unit_price) AS total_spend
FROM orders_opt o
JOIN customers c ON o.customer_id = c.customer_id
GROUP BY 
    c.customer_id,
    c.name, 
    c.city
ORDER BY total_spend DESC
LIMIT 5;
