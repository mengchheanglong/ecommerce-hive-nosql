# Catalog Microservice

## Overview
The **Catalog Service** manages product listings, categories, stock availability, and polymorphic item specifications across Electronics, Apparel, and Groceries.

- **Primary Datastore:** MongoDB (Document Store)
- **Collection:** `products`
- **Key Characteristics:** Flexible JSON schema allowing category-specific fields without NULL column overhead or schema migrations.

## Endpoints
- `GET /api/products` - List products with optional category and search filters
- `POST /api/products` - Create new product with polymorphic attributes
- `PUT /api/products/:id` - Update existing product specifications
- `DELETE /api/products/:id` - Mark product discontinued or soft-delete
