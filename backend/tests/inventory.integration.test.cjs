const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { MongoClient } = require("mongodb");
const { InventoryService } = require("../dist/inventory/inventory.service");
const { OrdersService } = require("../dist/orders/orders.service");
const { CatalogService } = require("../dist/catalog/catalog.service");

let client, db, inventory, orders, catalog;
const base = {
  customer_name: "Customer",
  province: "Phnom Penh",
  payment_method: "Cash",
  total: 2,
};
const order = (id, lines = [{ product_id: "A", quantity: 2 }]) => ({
  ...base,
  order_id: id,
  items: lines.map((line) => ({ name: line.product_id, price: 1, ...line })),
});
const counters = async (id) => {
  const p = await db.collection("products").findOne({ product_id: id });
  return [p.stock, p.reserved_stock ?? 0];
};
const snapshot = async () =>
  Promise.all(
    ["products", "orders", "inventory_events"].map((name) =>
      db.collection(name).find().sort({ _id: 1 }).toArray(),
    ),
  );

before(async () => {
  assert.ok(
    process.env.TEST_MONGODB_URI,
    "Run pnpm test:inventory to start an isolated replica set",
  );
  client = new MongoClient(process.env.TEST_MONGODB_URI, {
    serverSelectionTimeoutMS: 3000,
  });
  await client.connect();
  db = client.db("p0_inventory_" + randomUUID().replaceAll("-", ""));
  inventory = new InventoryService(db);
  orders = new OrdersService(db, inventory);
  catalog = new CatalogService(db, inventory);
  // No webhook or operational network side effects in the fixture.
  orders.notifyLogisticsSandbox = async () => {};
  await inventory.ensureReady();
});
after(async () => {
  if (db) await db.dropDatabase();
  if (client) await client.close();
});
beforeEach(async () => {
  await db.command({
    collMod: "inventory_events",
    validator: {},
    validationLevel: "off",
  });
  await Promise.all(
    ["products", "orders", "inventory_events"].map((name) =>
      db.collection(name).deleteMany({}),
    ),
  );
  await db.collection("products").insertMany(
    ["A", "B"].map((product_id) => ({
      product_id,
      name: product_id,
      stock: 10,
      status: "active",
    })),
  );
});

test("reserve, ship, deliver and repeat each step never consume twice", async () => {
  const payload = order("lifecycle");
  const created = await orders.create(payload);
  assert.equal(created.order.inventory.state, "reserved");
  assert.equal(created.order.total_minor, 200);
  assert.deepEqual(await counters("A"), [8, 2]);
  assert.equal((await orders.create(payload)).replayed, true);
  assert.deepEqual(await counters("A"), [8, 2]);
  await orders.updateStatus({
    order_id: payload.order_id,
    status: "Preparing",
  });
  for (let i = 0; i < 2; i++)
    await orders.updateStatus({
      order_id: payload.order_id,
      status: "Out for Delivery",
      courier_id: "R-101",
    });
  assert.deepEqual(await counters("A"), [8, 0]);
  for (let i = 0; i < 2; i++)
    await orders.updateStatus({
      order_id: payload.order_id,
      status: "Delivered",
    });
  assert.deepEqual(await counters("A"), [8, 0]);
  assert.equal(
    await db
      .collection("inventory_events")
      .countDocuments({ order_id: payload.order_id }),
    2,
  );
  assert.equal((await orders.create(payload)).order.status, "Delivered");
  await assert.rejects(
    () =>
      orders.updateStatus({ order_id: payload.order_id, status: "Cancelled" }),
    (error) => error.getStatus() === 409,
  );
});

test("cancellation releases exactly once and cannot resurrect a terminal order", async () => {
  await orders.create(order("cancel"));
  await Promise.all(
    Array.from({ length: 8 }, () =>
      orders.updateStatus({ order_id: "cancel", status: "Cancelled" }),
    ),
  );
  assert.deepEqual(await counters("A"), [10, 0]);
  assert.equal(
    await db
      .collection("inventory_events")
      .countDocuments({ operation: "release" }),
    1,
  );
  assert.equal(
    (await orders.create(order("cancel"))).order.status,
    "Cancelled",
  );
  await assert.rejects(() =>
    orders.updateStatus({ order_id: "cancel", status: "Preparing" }),
  );
});

test("concurrent checkouts cannot oversell a SKU", async () => {
  const results = await Promise.allSettled(
    Array.from({ length: 20 }, (_, i) => orders.create(order("race-" + i))),
  );
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 5);
  assert.deepEqual(await counters("A"), [0, 10]);
  assert.equal(await db.collection("orders").countDocuments(), 5);
  assert.equal(await db.collection("inventory_events").countDocuments(), 5);
});

test("concurrent identical creates and shipment retries reserve/ship only once", async () => {
  const payload = order("same");
  await Promise.all(Array.from({ length: 10 }, () => orders.create(payload)));
  assert.deepEqual(await counters("A"), [8, 2]);
  assert.equal(await db.collection("orders").countDocuments(), 1);
  await Promise.all(
    Array.from({ length: 10 }, () =>
      orders.updateStatus({
        order_id: "same",
        status: "Out for Delivery",
        courier_id: "R-101",
      }),
    ),
  );
  assert.deepEqual(await counters("A"), [8, 0]);
  assert.equal(await db.collection("inventory_events").countDocuments(), 2);
  await assert.rejects(
    () => orders.create({ ...payload, total: 3 }),
    (error) => error.getStatus() === 409,
  );
  await assert.rejects(
    () =>
      orders.updateStatus({
        order_id: "same",
        status: "Out for Delivery",
        courier_id: "R-102",
      }),
    (error) => error.getStatus() === 409,
  );
});

test("multi-SKU shortage or unknown SKU rolls back the earlier reservation", async () => {
  const before = await snapshot();
  await assert.rejects(() =>
    orders.create(
      order("shortage", [
        { product_id: "A", quantity: 2 },
        { product_id: "B", quantity: 11 },
      ]),
    ),
  );
  assert.deepEqual(await snapshot(), before);
  await assert.rejects(() =>
    orders.create(
      order("unknown", [
        { product_id: "A", quantity: 2 },
        { product_id: "UNKNOWN", quantity: 1 },
      ]),
    ),
  );
  assert.deepEqual(await snapshot(), before);
});

test("duplicate SKU lines are aggregated and cannot bypass stock availability", async () => {
  const before = await snapshot();
  await assert.rejects(() =>
    orders.create(
      order("duplicates", [
        { product_id: "A", quantity: 6 },
        { product_id: "A", quantity: 6 },
      ]),
    ),
  );
  assert.deepEqual(await snapshot(), before);
  const result = await orders.create(
    order("aggregate", [
      { product_id: "A", quantity: 2 },
      { product_id: "A", quantity: 3 },
    ]),
  );
  assert.deepEqual(result.order.inventory.lines, [
    { product_id: "A", quantity: 5 },
  ]);
  assert.deepEqual(await counters("A"), [5, 5]);
});

test("ledger insertion failure rolls back product and order writes", async () => {
  await db.command({
    collMod: "inventory_events",
    validator: { must_never_exist: { $exists: true } },
    validationLevel: "strict",
    validationAction: "error",
  });
  const before = await snapshot();
  await assert.rejects(
    () => orders.create(order("failed-ledger")),
    (error) => error.getStatus() === 503,
  );
  assert.deepEqual(await snapshot(), before);
});

test("shipment and release failures roll back counters and order state", async () => {
  await orders.create(order("failed-status"));
  await db.command({
    collMod: "inventory_events",
    validator: { operation: "reserve" },
    validationLevel: "strict",
    validationAction: "error",
  });
  const before = await snapshot();
  for (const status of ["Out for Delivery", "Cancelled"]) {
    await assert.rejects(
      () => orders.updateStatus({ order_id: "failed-status", status }),
      (error) => error.getStatus() === 503,
    );
    assert.deepEqual(await snapshot(), before);
  }
});

test("competing cancellation and shipment have exactly one winner", async () => {
  await orders.create(order("competing"));
  const result = await Promise.allSettled(
    ["Cancelled", "Out for Delivery"].map((status) =>
      orders.updateStatus({ order_id: "competing", status }),
    ),
  );
  assert.equal(result.filter((r) => r.status === "fulfilled").length, 1);
  const current = await orders.findOne("competing");
  assert.deepEqual(
    await counters("A"),
    current.order.status === "Cancelled" ? [10, 0] : [8, 0],
  );
  assert.equal(await db.collection("inventory_events").countDocuments(), 2);
});

test("unknown and legacy orders fail without changing inventory", async () => {
  await assert.rejects(
    () => orders.updateStatus({ order_id: "missing", status: "Cancelled" }),
    (error) => error.getStatus() === 404,
  );
  await db.collection("orders").insertOne({
    order_id: "legacy",
    status: "Pending",
    items: [{ product_id: "A", quantity: 2 }],
  });
  const before = await snapshot();
  await assert.rejects(
    () => orders.updateStatus({ order_id: "legacy", status: "Cancelled" }),
    (error) => error.getStatus() === 409,
  );
  assert.deepEqual(await snapshot(), before);
});

test("catalog counters and deletion cannot bypass live reservations", async () => {
  await orders.create(order("held"));
  await assert.rejects(
    () => catalog.update("A", { stock: 1000 }),
    (error) => error.getStatus() === 400,
  );
  await assert.rejects(
    () => catalog.update("A", { reserved_stock: 0 }),
    (error) => error.getStatus() === 400,
  );
  await assert.rejects(
    () => catalog.delete("A"),
    (error) => error.getStatus() === 409,
  );
  await assert.rejects(
    () => catalog.adjustStock([{ product_id: "A", quantity: 1 }]),
    (error) => error.getStatus() === 409,
  );
  assert.deepEqual(await counters("A"), [8, 2]);
});

test("HTTP controllers enforce the inventory lifecycle and return honest failure statuses", async () => {
  const { NestFactory } = require("@nestjs/core");
  const { ValidationPipe } = require("@nestjs/common");
  const { OrdersController } = require("../dist/orders/orders.controller");
  const { CatalogController } = require("../dist/catalog/catalog.controller");
  const app = await NestFactory.create(
    {
      module: class InventoryHttpTest {},
      controllers: [OrdersController, CatalogController],
      providers: [
        { provide: "MONGODB_CONNECTION", useValue: db },
        InventoryService,
        OrdersService,
        CatalogService,
      ],
    },
    { logger: false },
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.get(OrdersService).notifyLogisticsSandbox = async () => {};
  await app.listen(0, "127.0.0.1");
  const url = await app.getUrl();
  const request = async (path, body, method = "POST") => {
    const response = await fetch(url + path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await response.arrayBuffer(); // Drain each body so shutdown cannot wait on pending streams.
    return response;
  };
  try {
    assert.equal(
      (
        await request("/api/orders", {
          ...order("invalid"),
          order_id: undefined,
        })
      ).status,
      400,
    );
    assert.equal((await request("/api/orders", order("http"))).status, 201);
    assert.equal((await request("/api/orders", order("http"))).status, 201);
    assert.deepEqual(await counters("A"), [8, 2]);
    assert.equal(
      (await request("/api/orders", { ...order("http"), total: 3 })).status,
      409,
    );
    assert.equal(
      (
        await request("/api/products/adjust-stock", {
          items: [{ product_id: "A", quantity: 1 }],
        })
      ).status,
      409,
    );
    assert.equal(
      (await request("/api/orders/http", { status: "Out for Delivery" }, "PUT"))
        .status,
      200,
    );
    assert.equal(
      (await request("/api/orders/http", { status: "Delivered" }, "PUT"))
        .status,
      200,
    );
    assert.equal(
      (await request("/api/orders/http", { status: "Delivered" }, "PUT"))
        .status,
      200,
    );
    assert.equal(
      (await request("/api/orders/missing", { status: "Cancelled" }, "PUT"))
        .status,
      404,
    );
    assert.deepEqual(await counters("A"), [8, 0]);
  } finally {
    await app.close();
  }
});

test("corrupt counters or reservation states fail without further changes", async () => {
  await orders.create(order("corrupt"));
  await db
    .collection("products")
    .updateOne({ product_id: "A" }, { $set: { stock: -1 } });
  let before = await snapshot();
  await assert.rejects(
    () => orders.updateStatus({ order_id: "corrupt", status: "Cancelled" }),
    (error) => error.getStatus() === 409,
  );
  assert.deepEqual(await snapshot(), before);
  await db
    .collection("products")
    .updateOne({ product_id: "A" }, { $set: { stock: 8 } });
  await db
    .collection("orders")
    .updateOne(
      { order_id: "corrupt" },
      { $set: { "inventory.state": "released" } },
    );
  before = await snapshot();
  await assert.rejects(
    () => orders.updateStatus({ order_id: "corrupt", status: "Preparing" }),
    (error) => error.getStatus() === 409,
  );
  assert.deepEqual(await snapshot(), before);
});
