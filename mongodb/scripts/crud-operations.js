// Usage: mongosh khmercart crud-operations.js

print("\n========================================================");
print("KhmerCart MongoDB CRUD Operations (Task B2 Demonstration)");
print("========================================================\n");

// Ensure baseline customer Sokha Meas exists
db.customers.deleteMany({ name: "Sokha Meas" });
db.customers.insertOne({
  _id: "C0457",
  name: "Sokha Meas",
  phone: "+855-12-345-678",
  loyalty_points: 120,
  addresses: [
    {
      label: "Home",
      street: "Street 271",
      city: "Phnom Penh"
    }
  ],
  past_orders: ["100001", "99452"]
});

print("--- 1. Query: Find all Clothing products with 'Red' in colours (name and price only) ---");
const clothingQuery = db.products.find(
  { category: "Clothing", colours: "Red" },
  { _id: 0, name: 1, price: 1 }
).toArray();
printjson(clothingQuery);

print("\n--- 2. Update: Add new address to Sokha Meas and set loyalty_points to 150 ---");
const updateResult = db.customers.updateOne(
  { name: "Sokha Meas" },
  {
    $push: {
      addresses: {
        label: "Work",
        street: "Norodom Blvd",
        city: "Phnom Penh"
      }
    },
    $set: { loyalty_points: 150 }
  }
);
print("Update Result:", JSON.stringify(updateResult));
print("Updated Customer Document:");
printjson(db.customers.findOne({ name: "Sokha Meas" }));

print("\n--- 3. Delete: Remove every product whose status is 'discontinued' ---");
const deleteResult = db.products.deleteMany({ status: "discontinued" });
print("Delete Result:", JSON.stringify(deleteResult));
print(`Remaining products count: ${db.products.countDocuments()}`);

print("\nCRUD operations successfully verified!");
