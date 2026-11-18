const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT_DIR, 'index.html');
const MONITOR_JS_PATH = path.join(ROOT_DIR, 'js', 'monitor.js');
const CSS_PATH = path.join(ROOT_DIR, 'css', 'style.css');

test('js/monitor.js exports valid monitor API with lifecycle and state functions', () => {
  assert.ok(fs.existsSync(MONITOR_JS_PATH), 'js/monitor.js must exist');
  const monitor = require(MONITOR_JS_PATH);

  assert.strictEqual(typeof monitor.getState, 'function', 'getState must be a function');
  assert.strictEqual(typeof monitor.calculateMemory, 'function', 'calculateMemory must be a function');
  assert.strictEqual(typeof monitor.flushMemory, 'function', 'flushMemory must be a function');
  assert.strictEqual(typeof monitor.toggleProcess, 'function', 'toggleProcess must be a function');
  assert.strictEqual(typeof monitor.calmAll, 'function', 'calmAll must be a function');

  const s = monitor.getState();
  assert.ok(s.processes && s.processes.length >= 5, 'Must track at least 5 nursery processes');
  assert.ok(typeof s.memoryMB === 'number', 'memoryMB must be a numeric value');
  assert.ok(typeof s.fps === 'number', 'fps must be a numeric value');
});

test('calculateMemory and process toggling dynamically update memory state', () => {
  const monitor = require(MONITOR_JS_PATH);
  const initialMem = monitor.calculateMemory();

  assert.ok(initialMem.used > 0, 'Memory used must be greater than 0');
  assert.ok(initialMem.percent >= 0 && initialMem.percent <= 100, 'Percent must be between 0 and 100');

  // Toggle first process
  monitor.toggleProcess(0);
  const updatedState = monitor.getState();
  assert.ok(['Awake', 'Sleeping'].includes(updatedState.processes[0].status), 'Status must toggle');

  // Test calmAll
  monitor.calmAll();
  const calmState = monitor.getState();
  const allSleeping = calmState.processes.every(p => p.status === 'Sleeping');
  assert.ok(allSleeping, 'calmAll must set all processes to Sleeping');
});

test('index.html contains #monitor article window in #work section with accessible controls', () => {
  assert.ok(fs.existsSync(HTML_PATH), 'index.html must exist');
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  assert.match(html, /<article\s+[^>]*id=["']monitor["'][^>]*>/i, '#monitor article must exist in index.html');
  assert.match(html, /class=["'][^"']*\bw-monitor\b[^"']*["']/i, '#monitor must have w-monitor class');
  assert.match(html, /data-foldable/, '#monitor must be foldable');
  assert.match(html, /id=["']monitorTitle["']>\s*pip-monitor\.exe/i, 'Window title must be pip-monitor.exe');

  assert.match(html, /id=["']monFlushBtn["']/, 'Must provide flush memory button');
  assert.match(html, /id=["']monCalmBtn["']/, 'Must provide calm all processes button');
  assert.match(html, /id=["']monSparkline["']/, 'Must provide real-time SVG sparkline graph');
  assert.match(html, /id=["']monProcTable["']/, 'Must provide processes table');

  // Check desktop icon link
  assert.match(html, /<a\s+[^>]*href=["']#monitor["'][^>]*>.*monitor\.exe/is, 'Must include desktop icon link for monitor.exe');
});

test('css/style.css defines styling for monitor window, sparkline, and process table', () => {
  assert.ok(fs.existsSync(CSS_PATH), 'css/style.css must exist');
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert.match(css, /\.w-monitor/, 'Must define .w-monitor styling');
  assert.match(css, /\.mon-grid/, 'Must define .mon-grid responsive layout');
  assert.match(css, /\.mon-card/, 'Must define .mon-card styles');
  assert.match(css, /\.spark-line/, 'Must define .spark-line SVG styles');
  assert.match(css, /\.proc-table/, 'Must define .proc-table styles');
});
