const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const perf = require('./perf.js');

describe('Real-Time FPS Telemetry HUD & Battery Saver Power Mode (pip-perf-hud)', () => {
  beforeEach(() => {
    perf.load();
  });

  test('recordFrame calculates delta frame time and FPS from timestamps', () => {
    perf.recordFrame(1000);
    const frame2 = perf.recordFrame(1016.6); // 16.6ms elapsed -> ~60 FPS
    assert.ok(frame2.fps >= 58 && frame2.fps <= 62);
    assert.ok(frame2.frameTimeMs >= 16 && frame2.frameTimeMs <= 17);
  });

  test('toggleEcoMode toggles power saving mode state', () => {
    const initial = perf.isEcoMode();
    const toggled = perf.toggleEcoMode();
    assert.strictEqual(toggled, !initial);
    assert.strictEqual(perf.isEcoMode(), toggled);

    perf.toggleEcoMode(); // restore
  });

  test('toggleHud manages floating telemetry overlay visibility state', () => {
    const vis1 = perf.toggleHud();
    assert.strictEqual(typeof vis1, 'boolean');
    const vis2 = perf.toggleHud();
    assert.strictEqual(vis2, !vis1);
  });

  test('index.html contains #perfWin window, #perfHud widget, and script tag', () => {
    const htmlPath = path.resolve(__dirname, '../index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    assert.ok(html.includes('id="perfWin"'), 'index.html must include #perfWin window');
    assert.ok(html.includes('id="perfFpsVal"'), 'index.html must include #perfFpsVal');
    assert.ok(html.includes('id="perfAvgVal"'), 'index.html must include #perfAvgVal');
    assert.ok(html.includes('id="perfEcoBtn"'), 'index.html must include #perfEcoBtn');
    assert.ok(html.includes('id="perfHud"'), 'index.html must include #perfHud floating widget');
    assert.ok(html.includes('src="js/perf.js"'), 'index.html must include js/perf.js script tag');
  });
});
