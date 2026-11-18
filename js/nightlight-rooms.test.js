const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const HTML_PATH = path.resolve(__dirname, '..', 'index.html');
const TOYS_JS_PATH = path.resolve(__dirname, 'toys.js');
const CSS_PATH = path.resolve(__dirname, '..', 'css', 'style.css');

test('index.html contains 3 room tabs (Nursery, Attic, Garden) in nightlight collection', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  assert.match(html, /id=["']drRooms["'][^>]*role=["']tablist["']/i, 'Room tablist must exist with role="tablist"');
  assert.match(html, /<button[^>]*data-room=["']nursery["'][^>]*id=["']roomBtnNursery["']/i, 'Nursery button must exist');
  assert.match(html, /<button[^>]*data-room=["']attic["'][^>]*id=["']roomBtnAttic["']/i, 'Attic button must exist');
  assert.match(html, /<button[^>]*data-room=["']garden["'][^>]*id=["']roomBtnGarden["']/i, 'Garden button must exist');

  assert.match(html, /id=["']roomCountNursery["']/i, 'Nursery count badge must exist');
  assert.match(html, /id=["']roomCountAttic["']/i, 'Attic count badge must exist');
  assert.match(html, /id=["']roomCountGarden["']/i, 'Garden count badge must exist');
  assert.match(html, /id=["']drResetRoom["']/i, 'Reset room button must exist');
});

test('index.html defines 3 room containers with 5 hidden dreams each (15 total items)', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  // Verify room containers
  assert.match(html, /<div[^>]*class=["'][^"']*dr-room[^"']*["'][^>]*data-room=["']nursery["']/i);
  assert.match(html, /<div[^>]*class=["'][^"']*dr-room[^"']*["'][^>]*data-room=["']attic["']/i);
  assert.match(html, /<div[^>]*class=["'][^"']*dr-room[^"']*["'][^>]*data-room=["']garden["']/i);

  // Verify nursery items
  assert.match(html, /data-name=["']starlight wisp["']/i);
  assert.match(html, /data-name=["']moon honey["']/i);
  assert.match(html, /data-name=["']warm soup dream["']/i);
  assert.match(html, /data-name=["']cloud pillow["']/i);
  assert.match(html, /data-name=["']spare sock["']/i);

  // Verify attic items
  assert.match(html, /data-name=["']forgotten music box["']/i);
  assert.match(html, /data-name=["']dusty constellation globe["']/i);
  assert.match(html, /data-name=["']creaky floorboard star["']/i);
  assert.match(html, /data-name=["']moth-eaten lullaby book["']/i);
  assert.match(html, /data-name=["']brass pocket watch["']/i);

  // Verify garden items
  assert.match(html, /data-name=["']dewdrop pearl["']/i);
  assert.match(html, /data-name=["']glowing night-lily["']/i);
  assert.match(html, /data-name=["']mossy pebble["']/i);
  assert.match(html, /data-name=["']sleeping firefly["']/i);
  assert.match(html, /data-name=["']snail's silver trail["']/i);

  // Total data-item count must be 15
  const items = html.match(/class=["']dr-item["']\s+data-item/g);
  assert.ok(items && items.length === 15, `Expected 15 total items across 3 rooms, found ${items ? items.length : 0}`);
});

test('css/style.css defines styles for multi-room darkroom tabs, badges, and themes', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert.match(css, /\.dr-rooms\s*\{/, 'Must define .dr-rooms container');
  assert.match(css, /\.dr-room-btn\s*\{/, 'Must define .dr-room-btn tab styling');
  assert.match(css, /\.dr-room-badge\s*\{/, 'Must define .dr-room-badge styling');
  assert.match(css, /\.dr-room\[hidden\]\s*\{/, 'Must hide inactive room containers');
  assert.match(css, /\.darkroom\[data-current-room=["']attic["']\]/, 'Must style attic room theme');
  assert.match(css, /\.darkroom\[data-current-room=["']garden["']\]/, 'Must style garden room theme');
  assert.match(css, /\.dr-reset-room-btn/, 'Must style reset room button');
});

test('js/toys.js implements room switching, PIP.store persistence, and room resets in initLights', () => {
  const toysSrc = fs.readFileSync(TOYS_JS_PATH, 'utf8');

  assert.match(toysSrc, /store\.get\(['"]dr_room['"]/, 'Must load current room from store');
  assert.match(toysSrc, /store\.get\(['"]dr_found['"]/, 'Must load found items from store');
  assert.match(toysSrc, /store\.set\(['"]dr_found['"]/, 'Must persist found items to store');
  assert.match(toysSrc, /store\.set\(['"]dr_counts['"]/, 'Must persist found counts to store');
  assert.match(toysSrc, /setRoom\(/, 'Must define setRoom function');
  assert.match(toysSrc, /syncRoomElements\(/, 'Must define syncRoomElements function');
  assert.match(toysSrc, /updateRoomView\(/, 'Must define updateRoomView function');
  assert.match(toysSrc, /drResetRoom/, 'Must support room resetting');
  assert.match(toysSrc, /data-current-room/, 'Must update current room attribute on darkroom');
});
