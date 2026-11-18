'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// Mock localStorage store
let storage = {};
global.window = {
  addEventListener: () => {},
  dispatchEvent: () => {}
};
global.document = {
  querySelector: () => null,
  addEventListener: () => {}
};

// Mock PIP store
global.window.PIP = {
  store: {
    get: (k, d) => (storage[k] !== undefined ? storage[k] : d),
    set: (k, v) => { storage[k] = String(v); }
  }
};

const pwa = require('./pwa.js');

describe('PWA 2.0 Offline Sync Queue & Pre-cache', () => {
  test('enqueueOfflineAction appends unique items to queue', () => {
    storage = {};
    const item1 = pwa.enqueueOfflineAction('wish', { name: 'Alice', text: 'Sweet dreams' });
    const item2 = pwa.enqueueOfflineAction('wish', { name: 'Bob', text: 'Sleep tight' });

    assert.ok(item1.id);
    assert.ok(item2.id);
    assert.notStrictEqual(item1.id, item2.id);

    const queue = pwa.loadQueue();
    assert.strictEqual(queue.length, 2);
    assert.strictEqual(queue[0].payload.name, 'Alice');
    assert.strictEqual(queue[1].payload.name, 'Bob');
  });

  test('dequeueAction removes specific action by ID', () => {
    storage = {};
    const item1 = pwa.enqueueOfflineAction('wish', { name: 'A' });
    const item2 = pwa.enqueueOfflineAction('wish', { name: 'B' });

    pwa.dequeueAction(item1.id);
    const queue = pwa.loadQueue();
    assert.strictEqual(queue.length, 1);
    assert.strictEqual(queue[0].id, item2.id);
  });

  test('flushQueue processes and clears queue sequentially', () => {
    storage = {};
    pwa.enqueueOfflineAction('wish', { name: 'Alice' });
    pwa.enqueueOfflineAction('wish', { name: 'Bob' });

    const processed = [];
    pwa.flushQueue((item, done) => {
      processed.push(item.payload.name);
      done(true);
    }, (count) => {
      assert.strictEqual(count, 2);
    });

    assert.deepStrictEqual(processed, ['Alice', 'Bob']);
    assert.strictEqual(pwa.loadQueue().length, 0);
  });

  test('sw.js specifies CACHE_NAME v3 and precaches rattle and stars', () => {
    const swPath = path.join(__dirname, '..', 'sw.js');
    const swContent = fs.readFileSync(swPath, 'utf8');

    assert.ok(swContent.includes("CACHE_NAME = 'pipos-v3'"), 'Must update cache to v3');
    assert.ok(swContent.includes("'js/rattle.js'"), 'Must precache rattle.js');
    assert.ok(swContent.includes("'js/stars.js'"), 'Must precache stars.js');
    assert.ok(swContent.includes("'js/pwa.js'"), 'Must precache pwa.js');
  });
});
