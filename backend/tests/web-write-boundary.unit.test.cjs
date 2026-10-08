const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const ts = require("typescript");

function loadApi(fetch) {
  const writes = [];
  const exports = {};
  const source = fs.readFileSync(
    path.resolve(__dirname, "../../web/src/lib/api.ts"),
    "utf8",
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2021,
    },
  }).outputText;
  vm.runInNewContext(compiled, {
    exports,
    fetch,
    console,
    URLSearchParams,
    require: (name) => {
      assert.equal(name, "./data");
      return {
        addOrderToStore: (order) => writes.push(order),
        updateOrderStatusInStore: (...args) => writes.push(args),
      };
    },
  });
  return { api: exports, writes };
}

test("web checkout and status updates fail on network loss without local success or secondary requests", async () => {
  const calls = [];
  const { api, writes } = loadApi(async (url) => {
    calls.push(url);
    throw new Error("Response lost");
  });
  assert.equal(
    (await api.createOrder({ order_id: "stable-id" })).success,
    false,
  );
  assert.equal(
    (await api.updateOrderStatus("stable-id", "Delivered")).success,
    false,
  );
  assert.deepEqual(writes, []);
  assert.deepEqual(calls, ["/nest-api/orders", "/nest-api/orders/stable-id"]);
});

test("web preserves backend shortage/conflict errors and updates its cache only after acknowledgement", async () => {
  const { api, writes } = loadApi(async () =>
    Response.json({ message: "Insufficient stock" }, { status: 409 }),
  );
  assert.equal(
    (await api.createOrder({ order_id: "same" })).error,
    "Insufficient stock",
  );
  assert.deepEqual(writes, []);
  const confirmed = loadApi(async () =>
    Response.json({ success: true, order: { order_id: "same" } }),
  );
  assert.equal(
    (await confirmed.api.createOrder({ order_id: "same" })).success,
    true,
  );
  assert.equal(confirmed.writes.length, 1);
});

test("catalog mutation failure cannot substitute fake local stock or delete products", async () => {
  for (const fetch of [async () => { throw new Error("Offline"); }, async () => Response.json({ message: "Inventory counters cannot be edited" }, { status: 400 })]) {
    const { api, writes } = loadApi(fetch);
    assert.equal((await api.createProduct({ product_id: "A", stock: 100 })).success, false);
    assert.equal((await api.updateProduct("A", { stock: 1000 })).success, false);
    assert.equal((await api.deleteProduct("A")).success, false);
    assert.deepEqual(writes, []);
  }
});

test('telemetry read failure is unavailable with no local fallback and disabled writes make no network requests', async () => {
  for (const response of [null, { riders: [{ id: 'fake' }] }, { schemaVersion: 1, source: 'observed', riders: [] }]) {
    const calls = [];
    const { api } = loadApi(async url => {
      calls.push(url);
      if (!response) throw new Error('Offline');
      return Response.json(response);
    });
    const snapshot = await api.fetchFleetTelemetry();
    assert.equal(snapshot.source, 'unavailable');
    assert.equal(snapshot.riders.length, 0);
    assert.equal((await api.sendRiderPing('R-101', 0, 0)).success, false);
    assert.deepEqual(calls, ['/nest-api/riders']);
  }
});

test('labelled fixture response passes the web contract including an empty city result', async () => {
  const { TelemetryService } = require('../dist/telemetry/telemetry.service');
  for (const city of ['Unknown', 'Phnom Penh']) {
    const fixture = await new TelemetryService().getFleetTelemetry(city);
    const { api } = loadApi(async () => Response.json(fixture));
    const snapshot = await api.fetchFleetTelemetry(city);
    assert.equal(snapshot.source, 'fixture');
    assert.equal(snapshot.riders.length, city === 'Unknown' ? 0 : 3);
    assert.equal(snapshot.durable, false);
  }
});
