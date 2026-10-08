require('reflect-metadata');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Module } = require('@nestjs/common');
const { NestFactory } = require('@nestjs/core');
const { TelemetryService } = require('../dist/telemetry/telemetry.service');
const { TelemetryController } = require('../dist/telemetry/telemetry.controller');

test('fixture reads disclose provenance, omit invented ingest measurements and cannot mutate the source', async () => {
  const service = new TelemetryService();
  const snapshot = await service.getFleetTelemetry();
  assert.equal(snapshot.source, 'fixture');
  assert.equal(snapshot.durable, false);
  assert.equal(snapshot.sinkOwner, 'none');
  assert.equal(snapshot.observedAt, null);
  assert.equal(snapshot.metrics.totalRiders, snapshot.riders.length);
  assert.equal(snapshot.metrics.ingestRatePerSec, null);
  assert.equal(snapshot.metrics.sandboxSynced, false);
  snapshot.riders[0].lat = 90;
  assert.notEqual((await service.getFleetTelemetry()).riders[0].lat, 90);
  const empty = await service.getFleetTelemetry('Unknown');
  assert.equal(empty.metrics.totalRiders, 0);
  assert.equal(empty.metrics.activeRiders, 0);
});

test('HTTP refuses every GPS write without a sink and fixture reads make no datastore or sandbox request', async () => {
  class TestModule {}
  Module({ controllers: [TelemetryController], providers: [TelemetryService] })(TestModule);
  const app = await NestFactory.create(TestModule, { logger: false });
  await app.listen(0, '127.0.0.1');
  const fetchOriginal = global.fetch;
  let outbound = 0;
  global.fetch = async () => { outbound++; throw new Error('All databases unavailable'); };
  try {
    const url = await app.getUrl();
    const before = await (await fetchOriginal(`${url}/api/riders`)).json();
    for (let i = 0; i < 2; i++) {
      const response = await fetchOriginal(`${url}/api/riders/ping`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rider_id: 'R-101', lat: 90, lng: 180, battery: 0 }),
      });
      assert.equal(response.status, 503);
      const ack = await response.json();
      assert.equal(ack.success, false);
      assert.equal(ack.stored, false);
      assert.equal(ack.durable, false);
    }
    assert.deepEqual(await (await fetchOriginal(`${url}/api/riders`)).json(), before);
    assert.equal(outbound, 0);
  } finally {
    global.fetch = fetchOriginal;
    await app.close();
  }
});
