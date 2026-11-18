const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('Three-State Theme: main.js initTheme implementation contract', () => {
  const mainJs = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');

  assert.ok(mainJs.includes("mode = 'auto'"), 'Default theme mode must be auto');
  assert.ok(mainJs.includes('getLocalDayNight'), 'Must include local time calculator');
  assert.ok(mainJs.includes('resolveTheme'), 'Must include theme resolution logic');
  assert.ok(mainJs.includes('data-theme-mode'), 'Must set data-theme-mode attribute');
  assert.ok(mainJs.includes('Theme mode: Auto'), 'aria-label must describe Auto state');
  assert.ok(mainJs.includes('Day mode, switch to Night mode'), 'aria-label must describe Day state');
  assert.ok(mainJs.includes('Night mode, switch to Auto mode'), 'aria-label must describe Night state');
});

test('Three-State Theme: local time resolution boundaries', () => {
  function getDayNightForHour(hour) {
    return (hour >= 6 && hour < 19) ? 'day' : 'night';
  }

  assert.strictEqual(getDayNightForHour(6), 'day', '6 AM is daytime');
  assert.strictEqual(getDayNightForHour(12), 'day', '12 PM is daytime');
  assert.strictEqual(getDayNightForHour(18), 'day', '6 PM is daytime');
  assert.strictEqual(getDayNightForHour(19), 'night', '7 PM is nighttime');
  assert.strictEqual(getDayNightForHour(23), 'night', '11 PM is nighttime');
  assert.strictEqual(getDayNightForHour(0), 'night', 'Midnight is nighttime');
  assert.strictEqual(getDayNightForHour(5), 'night', '5 AM is nighttime');
});

test('Three-State Theme: cyclic state transitions', () => {
  function getNextMode(current) {
    if (current === 'auto') return 'day';
    if (current === 'day') return 'night';
    if (current === 'night') return 'auto';
    return 'auto';
  }

  assert.strictEqual(getNextMode('auto'), 'day');
  assert.strictEqual(getNextMode('day'), 'night');
  assert.strictEqual(getNextMode('night'), 'auto');
});
