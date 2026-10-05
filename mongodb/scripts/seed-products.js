// Usage: mongosh ecommerce seed-products.js

print("=== Task B2.1: Inserting products into products collection ===");

// Clear previous products for clean run
db.products.deleteMany({});

const seedResult = db.products.insertMany([
  {
    product_id: "P2210",
    name: "Smartphone X",
    category: "Electronics",
    price: 289.00,
    status: "active",
    screen_size: "6.5 inches",
    warranty: "1 year"
  },
  {
    product_id: "P3314",
    name: "Cotton T-Shirt",
    category: "Clothing",
    price: 15.00,
    status: "active",
    size: "M",
    colours: ["Red", "Blue"]
  },
  {
    product_id: "P0874",
    name: "Jasmine Rice 5kg",
    category: "Groceries",
    price: 3.50,
    status: "active",
    weight: "5kg",
    expiry_date: "2027-09-01"
  },
  {
    product_id: "P9999",
    name: "Old Keyboard Model 1",
    category: "Electronics",
    price: 10.00,
    status: "discontinued",
    screen_size: "N/A",
    warranty: "Expired"
  }
]);

print(`Seeding complete. Inserted ${Object.keys(seedResult.insertedIds).length} products.`);
print("Inserted Products:");
printjson(db.products.find().toArray());
