const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  InventoryService,
  moneyMinor,
  normalizeOrder,
} = require("../dist/inventory/inventory.service");
const { CatalogService } = require("../dist/catalog/catalog.service");
const { OrdersService } = require("../dist/orders/orders.service");

const dto = {
  order_id: "test",
  customer_name: "Customer",
  province: "Phnom Penh",
  payment_method: "Cash",
  items: [{ product_id: "A", name: "A", quantity: 1, price: 4.8 }],
  total: 4.8,
};

test("money is stored as safe integer cents and malformed amounts are rejected", () => {
  assert.equal(moneyMinor(4.8), 480);
  assert.equal(moneyMinor(0), 0);
  for (const value of [NaN, Infinity, -1, 1.001, "1", Number.MAX_SAFE_INTEGER])
    assert.throws(() => moneyMinor(value));
});

test("quantities aggregate before validation and reject invalid inputs", () => {
  const input = {
    ...dto,
    items: [...dto.items, { ...dto.items[0], quantity: 2 }],
  };
  assert.equal(normalizeOrder(input).payload.items[0].quantity, 3);
  for (const quantity of [
    0,
    -1,
    0.5,
    "1",
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
  ])
    assert.throws(() =>
      normalizeOrder({ ...dto, items: [{ ...dto.items[0], quantity }] }),
    );
  assert.throws(() => normalizeOrder({ ...dto, items: [] }));
  assert.throws(() => normalizeOrder({ ...dto, order_id: "" }));
  assert.throws(() => normalizeOrder({ ...dto, status: "Delivered" }));
});

test("offline writes fail instead of creating fallback orders or products", async () => {
  const inventory = new InventoryService(null);
  const orders = new OrdersService(null, inventory);
  const catalog = new CatalogService(null, inventory);
  for (const action of [
    () => orders.create(dto),
    () => orders.updateStatus({ order_id: "test", status: "Cancelled" }),
    () =>
      catalog.create({
        product_id: "A",
        name: "A",
        category: "Groceries",
        price: 1,
        stock: 1,
      }),
    () => catalog.update("A", { name: "Changed" }),
    () => catalog.delete("A"),
  ]) {
    await assert.rejects(action, (error) => error.getStatus() === 503);
  }
  await assert.rejects(
    () => catalog.adjustStock([{ product_id: "A", quantity: 1 }]),
    (error) => error.getStatus() === 409,
  );
});
