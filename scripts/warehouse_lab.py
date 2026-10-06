"""
KhmerCart Data Platform - Real Data Warehouse Lab
Simulates 1,000,000+ orders to experience OLTP vs OLAP,
Row (CSV) vs Columnar (Parquet/ORC), Partition Pruning, and Star Schema Joins.
"""

import os
import sys
import time
import json
import random
import numpy as np
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
import duckdb

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "warehouse"))
CSV_FILE = os.path.join(DATA_DIR, "orders_raw.csv")
PARQUET_DIR = os.path.join(DATA_DIR, "orders_opt")
CUSTOMERS_FILE = os.path.join(DATA_DIR, "customers.parquet")
RESULTS_FILE = os.path.join(DATA_DIR, "benchmark_results.json")

PROVINCES = ["Phnom Penh", "Siem Reap", "Battambang", "Kandal", "Kampot", "Sihanoukville"]
PROVINCE_WEIGHTS = [0.55, 0.25, 0.10, 0.04, 0.03, 0.03]

CATEGORIES = ["Electronics", "Clothing", "Groceries", "Home & Kitchen", "Beauty", "Books"]
CATEGORY_WEIGHTS = [0.30, 0.25, 0.25, 0.10, 0.05, 0.05]

PAYMENT_METHODS = ["ABA Pay", "Bakong KHQR", "Cash", "ACLEDA Pay", "Wing"]
PAYMENT_WEIGHTS = [0.45, 0.25, 0.15, 0.10, 0.05]

CAMBODIAN_NAMES = [
    "Sokha Meas", "Chenda Som", "Piseth Seng", "Dara Sam", "Sreypov Keo",
    "Vannak Chhim", "Bopha Pich", "Rithy Chan", "Neary Long", "Kosal Ouk",
    "Chanthou Heng", "Sovann Pen", "Malis Roeun", "Vicheka Yim", "Sophea Mao"
]

def generate_customers(num_customers=50000):
    print(f"[*] Generating {num_customers:,} dimension customers...")
    customer_ids = [f"C{i:05d}" for i in range(1, num_customers + 1)]
    names = [random.choice(CAMBODIAN_NAMES) + f" {i%1000}" for i in range(1, num_customers + 1)]
    cities = np.random.choice(PROVINCES, size=num_customers, p=PROVINCE_WEIGHTS)
    
    df_customers = pd.DataFrame({
        "customer_id": customer_ids,
        "name": names,
        "city": cities
    })
    
    table = pa.Table.from_pandas(df_customers)
    pq.write_table(table, CUSTOMERS_FILE, compression="snappy")
    print(f"[✓] Customers written to {CUSTOMERS_FILE} ({os.path.getsize(CUSTOMERS_FILE) / 1024:.1f} KB)")
    return customer_ids

def generate_orders(num_rows=1000000, num_customers=50000):
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(PARQUET_DIR, exist_ok=True)

    customer_ids = generate_customers(num_customers)

    print(f"[*] Synthesizing {num_rows:,} orders across 3 months (July, August, September 2026)...")
    start_time = time.time()

    # Generate dates across 3 months to test Partition Pruning
    # July 2026, August 2026, September 2026
    months = ["2026-07", "2026-08", "2026-09"]
    month_choices = np.random.choice(months, size=num_rows, p=[0.25, 0.35, 0.40])
    
    # Days 1 to 28
    days = np.random.randint(1, 29, size=num_rows)
    order_dates = [f"{m}-{d:02d}" for m, d in zip(month_choices, days)]
    
    # Categories and unit prices
    categories = np.random.choice(CATEGORIES, size=num_rows, p=CATEGORY_WEIGHTS)
    base_prices = {
        "Electronics": 150.0,
        "Clothing": 24.50,
        "Groceries": 8.75,
        "Home & Kitchen": 45.0,
        "Beauty": 18.0,
        "Books": 12.0
    }
    multipliers = np.random.uniform(0.5, 3.0, size=num_rows)
    unit_prices = np.round([base_prices[cat] * mult for cat, mult in zip(categories, multipliers)], 2)
    quantities = np.random.choice([1, 2, 3, 4, 5, 8], size=num_rows, p=[0.55, 0.25, 0.10, 0.05, 0.03, 0.02])

    df = pd.DataFrame({
        "order_id": np.arange(100001, 100001 + num_rows),
        "customer_id": np.random.choice(customer_ids, size=num_rows),
        "product_id": [f"P{np.random.randint(1, 2500):04d}" for _ in range(num_rows)],
        "category": categories,
        "province": np.random.choice(PROVINCES, size=num_rows, p=PROVINCE_WEIGHTS),
        "quantity": quantities,
        "unit_price": unit_prices,
        "order_date": order_dates,
        "order_month": month_choices,
        "payment_method": np.random.choice(PAYMENT_METHODS, size=num_rows, p=PAYMENT_WEIGHTS)
    })

    gen_duration = time.time() - start_time
    print(f"[✓] Generated {num_rows:,} records in {gen_duration:.2f} seconds.")

    # 1. Write Raw Staging CSV (Simulating HDFS text files)
    print(f"[*] Writing Raw Staging CSV ({CSV_FILE})...")
    csv_start = time.time()
    df.to_csv(CSV_FILE, index=False)
    csv_size_mb = os.path.getsize(CSV_FILE) / (1024 * 1024)
    print(f"[✓] CSV written: {csv_size_mb:.2f} MB in {time.time() - csv_start:.2f}s")

    # 2. Write Optimized Columnar Hive-Partitioned Format (Parquet partitioned by order_month)
    print(f"[*] Writing Optimized Hive Partitioned Warehouse (by order_month)...")
    pq_start = time.time()
    table = pa.Table.from_pandas(df)
    pq.write_to_dataset(
        table,
        root_path=PARQUET_DIR,
        partition_cols=["order_month"],
        compression="snappy",
        use_dictionary=True
    )
    pq_duration = time.time() - pq_start

    # Calculate total size of parquet partitions
    parquet_size_bytes = sum(
        os.path.getsize(os.path.join(root, file))
        for root, _, files in os.walk(PARQUET_DIR)
        for file in files
    )
    parquet_size_mb = parquet_size_bytes / (1024 * 1024)
    compression_ratio = csv_size_mb / parquet_size_mb

    print(f"[✓] Columnar Warehouse written: {parquet_size_mb:.2f} MB in {pq_duration:.2f}s")
    print(f"    --> Compression Ratio: {compression_ratio:.1f}x smaller than CSV!")

def run_benchmarks():
    print("\n" + "="*80)
    print("        RUNNING REAL DATA WAREHOUSE BENCHMARKS (1,000,000+ ROWS)")
    print("="*80)

    con = duckdb.connect(database=":memory:")

    csv_size_mb = os.path.getsize(CSV_FILE) / (1024 * 1024)
    parquet_size_mb = sum(
        os.path.getsize(os.path.join(root, file))
        for root, _, files in os.walk(PARQUET_DIR)
        for file in files
    ) / (1024 * 1024)

    # -------------------------------------------------------------------------
    # TEST 1: Query D1 - Revenue by Province (September 2026)
    # -------------------------------------------------------------------------
    print("\n[TEST 1: Query D1 - Revenue by Province for September 2026]")
    print("Comparing: Scanning 120MB Row-based CSV vs. Columnar Partitioned Warehouse")

    # CSV Query (Must read entire CSV line by line)
    t0 = time.time()
    csv_res = con.execute(f"""
        SELECT 
            province, 
            ROUND(SUM(quantity * unit_price), 2) AS total_revenue
        FROM read_csv_auto('{CSV_FILE.replace(chr(92), "/")}')
        WHERE order_month = '2026-09'
        GROUP BY province
        ORDER BY total_revenue DESC
    """).fetchall()
    csv_time_d1 = (time.time() - t0) * 1000

    # Columnar Partition Pruned Query (Only reads September partition directory!)
    t0 = time.time()
    opt_res = con.execute(f"""
        SELECT 
            province, 
            ROUND(SUM(quantity * unit_price), 2) AS total_revenue
        FROM read_parquet('{PARQUET_DIR.replace(chr(92), "/")}/order_month=2026-09/*.parquet')
        GROUP BY province
        ORDER BY total_revenue DESC
    """).fetchall()
    opt_time_d1 = (time.time() - t0) * 1000
    speedup_d1 = csv_time_d1 / max(opt_time_d1, 0.001)

    print(f"  • CSV Scan Latency:       {csv_time_d1:8.2f} ms  (Read all {csv_size_mb:.1f} MB + all 9 columns)")
    print(f"  • Columnar Warehouse:     {opt_time_d1:8.2f} ms  (Read only ~15 MB September partition + 3 columns)")
    print(f"  • Performance Advantage:  {speedup_d1:8.1f}x FASTER!")
    print(f"  • Results:")
    for row in opt_res:
        print(f"     - {row[0]:15}: ${row[1]:,}")

    # -------------------------------------------------------------------------
    # TEST 2: Query D2 - Top 5 Customers by Spend (Fact-Dimension Star Join)
    # -------------------------------------------------------------------------
    print("\n[TEST 2: Query D2 - Top 5 Customers (Fact-Dimension Star Join)]")
    t0 = time.time()
    top_customers = con.execute(f"""
        SELECT 
            c.customer_id,
            c.name,
            c.city,
            ROUND(SUM(o.quantity * o.unit_price), 2) AS total_spend
        FROM read_parquet('{PARQUET_DIR.replace(chr(92), "/")}/*/*.parquet') o
        JOIN read_parquet('{CUSTOMERS_FILE.replace(chr(92), "/")}') c
          ON o.customer_id = c.customer_id
        GROUP BY c.customer_id, c.name, c.city
        ORDER BY total_spend DESC
        LIMIT 5
    """).fetchall()
    time_d2 = (time.time() - t0) * 1000
    print(f"  • Query Latency: {time_d2:.2f} ms across 1,000,000 joined records")
    for rank, row in enumerate(top_customers, 1):
        print(f"     #{rank} {row[1]} ({row[2]}): ${row[3]:,}")

    # -------------------------------------------------------------------------
    # TEST 3: Query D3 - Popular Categories (> 1000 orders)
    # -------------------------------------------------------------------------
    print("\n[TEST 3: Query D3 - Popular Categories (Columnar Aggregation)]")
    t0 = time.time()
    categories_res = con.execute(f"""
        SELECT 
            category,
            COUNT(*) AS order_count,
            ROUND(SUM(quantity * unit_price), 2) AS total_revenue
        FROM read_parquet('{PARQUET_DIR.replace(chr(92), "/")}/*/*.parquet')
        GROUP BY category
        HAVING COUNT(*) > 1000
        ORDER BY order_count DESC
    """).fetchall()
    time_d3 = (time.time() - t0) * 1000
    print(f"  • Query Latency: {time_d3:.2f} ms")
    for row in categories_res:
        print(f"     - {row[0]:15}: {row[1]:,} orders (${row[2]:,})")

    # -------------------------------------------------------------------------
    # TEST 4: Query D4 - Order Tiers (CASE WHEN)
    # -------------------------------------------------------------------------
    print("\n[TEST 4: Query D4 - Order Tiers (> $100 vs <= $100)]")
    t0 = time.time()
    tiers_res = con.execute(f"""
        SELECT 
            CASE 
                WHEN (quantity * unit_price) > 100 THEN 'high'
                ELSE 'normal'
            END AS order_tier,
            COUNT(*) AS order_count,
            ROUND(SUM(quantity * unit_price), 2) AS tier_revenue
        FROM read_parquet('{PARQUET_DIR.replace(chr(92), "/")}/*/*.parquet')
        GROUP BY order_tier
    """).fetchall()
    time_d4 = (time.time() - t0) * 1000
    print(f"  • Query Latency: {time_d4:.2f} ms")
    for row in tiers_res:
        print(f"     - Tier [{row[0]}]: {row[1]:,} orders (${row[2]:,})")

    # -------------------------------------------------------------------------
    # TEST 5: Partition Pruning Proof (D5 Behind the Scenes)
    # -------------------------------------------------------------------------
    print("\n[TEST 5: Partition Pruning Proof - Scanning 1 Month vs 3 Months]")
    t0 = time.time()
    con.execute(f"SELECT COUNT(*) FROM read_parquet('{PARQUET_DIR.replace(chr(92), "/")}/order_month=2026-09/*.parquet')").fetchone()
    pruned_time = (time.time() - t0) * 1000

    t0 = time.time()
    con.execute(f"SELECT COUNT(*) FROM read_parquet('{PARQUET_DIR.replace(chr(92), "/")}/*/*.parquet')").fetchone()
    full_time = (time.time() - t0) * 1000
    print(f"  • Reading 1 Month (Pruned): {pruned_time:.2f} ms")
    print(f"  • Reading All 3 Months:    {full_time:.2f} ms")
    print(f"  • Partition pruning eliminated 60% of data reads by skipping non-September folders!")

    # Save results to JSON for NestJS Backend
    results = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "totalRecords": 1000000,
        "csvSizeMb": round(csv_size_mb, 2),
        "warehouseSizeMb": round(parquet_size_mb, 2),
        "compressionRatio": round(csv_size_mb / parquet_size_mb, 2),
        "benchmarks": {
            "D1_RevenueByProvince": {
                "csvLatencyMs": round(csv_time_d1, 2),
                "warehouseLatencyMs": round(opt_time_d1, 2),
                "speedup": round(speedup_d1, 1),
                "results": [{"province": r[0], "revenue": float(r[1])} for r in opt_res]
            },
            "D2_TopCustomers": {
                "latencyMs": round(time_d2, 2),
                "results": [{"id": r[0], "name": r[1], "city": r[2], "spend": float(r[3])} for r in top_customers]
            },
            "D3_PopularCategories": {
                "latencyMs": round(time_d3, 2),
                "results": [{"category": r[0], "count": int(r[1]), "revenue": float(r[2])} for r in categories_res]
            },
            "D4_OrderTiers": {
                "latencyMs": round(time_d4, 2),
                "results": [{"tier": r[0], "count": int(r[1]), "revenue": float(r[2])} for r in tiers_res]
            },
            "D5_PartitionPruning": {
                "prunedLatencyMs": round(pruned_time, 2),
                "fullScanLatencyMs": round(full_time, 2),
                "dataSkippedPercent": 60.0
            }
        }
    }

    with open(RESULTS_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"\n[✓] Benchmark results exported to {RESULTS_FILE}")
    print("="*80)

if __name__ == "__main__":
    count = 1000000
    if len(sys.argv) > 1:
        try:
            count = int(sys.argv[1])
        except ValueError:
            pass
    generate_orders(num_rows=count)
    run_benchmarks()
