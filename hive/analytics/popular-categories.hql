-- Categories with more than 1000 orders
-- High-level overview of popular product categories

USE khmercart;

SELECT 
    category, 
    COUNT(*) AS total_orders
FROM orders_opt 
GROUP BY category 
HAVING COUNT(*) > 1000
ORDER BY total_orders DESC;
