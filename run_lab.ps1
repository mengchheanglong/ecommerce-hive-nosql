# ecommerce Data Platform - End-to-End Pipeline Runner
# Executes MongoDB seed/CRUD scripts and Apache Hive DDL, ETL, and Analytics

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "1. EXECUTING MONGODB SEED & CRUD SCRIPTS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

mongosh ecommerce "$PSScriptRoot\mongodb\scripts\seed-products.js"
mongosh ecommerce "$PSScriptRoot\mongodb\scripts\crud-operations.js"

Write-Host "`n==========================================" -ForegroundColor Yellow
Write-Host "2. EXECUTING HIVE DATA WAREHOUSE PIPELINE" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

$wslHive = {
    param($scriptPath)
    wsl -u root -d Ubuntu su - hdoop -c "run-hive -f $scriptPath"
}

Write-Host "`n-> Running 01-create-database.hql..." -ForegroundColor Green
& $wslHive "/mnt/c/Users/User/Downloads/hive-nosql-data-platform/hive/ddl/01-create-database.hql"

Write-Host "`n-> Running 02-create-orders-raw.hql..." -ForegroundColor Green
& $wslHive "/mnt/c/Users/User/Downloads/hive-nosql-data-platform/hive/ddl/02-create-orders-raw.hql"

Write-Host "`n-> Running 03-create-orders-opt.hql..." -ForegroundColor Green
& $wslHive "/mnt/c/Users/User/Downloads/hive-nosql-data-platform/hive/ddl/03-create-orders-opt.hql"

Write-Host "`n-> Running 04-create-customers.hql..." -ForegroundColor Green
& $wslHive "/mnt/c/Users/User/Downloads/hive-nosql-data-platform/hive/ddl/04-create-customers.hql"

Write-Host "`n-> Running load-orders.hql (ETL)..." -ForegroundColor Green
& $wslHive "/mnt/c/Users/User/Downloads/hive-nosql-data-platform/hive/etl/load-orders.hql"

Write-Host "`n-> Running revenue-by-province.hql..." -ForegroundColor Green
& $wslHive "/mnt/c/Users/User/Downloads/hive-nosql-data-platform/hive/analytics/revenue-by-province.hql"

Write-Host "`n-> Running top-customers.hql..." -ForegroundColor Green
& $wslHive "/mnt/c/Users/User/Downloads/hive-nosql-data-platform/hive/analytics/top-customers.hql"

Write-Host "`n-> Running popular-categories.hql..." -ForegroundColor Green
& $wslHive "/mnt/c/Users/User/Downloads/hive-nosql-data-platform/hive/analytics/popular-categories.hql"

Write-Host "`n-> Running order-tiers.hql..." -ForegroundColor Green
& $wslHive "/mnt/c/Users/User/Downloads/hive-nosql-data-platform/hive/analytics/order-tiers.hql"

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "DATA PIPELINE EXECUTION COMPLETED!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
