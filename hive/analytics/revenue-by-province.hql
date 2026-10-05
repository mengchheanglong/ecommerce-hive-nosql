-- Monthly revenue breakdown by province
-- Uses partition pruning to only scan 2026-09 data

USE khmercart;

SELECT 
    province, 
    SUM(quantity * unit_price) AS total_revenue 
FROM orders_opt 
WHERE order_month = '2026-09' 
GROUP BY province 
ORDER BY total_revenue DESC;
