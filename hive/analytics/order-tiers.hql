-- Order classification by revenue tier
-- Segments orders into value tiers using CASE statements

USE ecommerce;

SELECT 
    CASE 
        WHEN (quantity * unit_price) > 100 THEN 'high' 
        ELSE 'normal' 
    END AS order_tier,
    COUNT(*) AS order_count
FROM orders_opt 
GROUP BY 
    CASE 
        WHEN (quantity * unit_price) > 100 THEN 'high' 
        ELSE 'normal' 
    END;
