const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT_DIR, 'index.html');
const CSS_PATH = path.join(ROOT_DIR, 'css', 'style.css');
const TOYS_PATH = path.join(ROOT_DIR, 'js', 'toys.js');

/* =========================================================================
   1. HTML Markup Contract for Dream Delivery Route Canvas
   ========================================================================= */
test('index.html contains #routeCanvas inside .route-stage with required attributes', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  // Verify .route-stage contains #routeCanvas
  const stageMatch = html.match(/<div\s+class=["'][^"']*\broute-stage\b[^"']*["']>([\s\S]*?)<\/div>/i);
  assert.ok(stageMatch, 'index.html must have a .route-stage element');

  const canvasMatch = html.match(/<canvas\s+[^>]*id=["']routeCanvas["'][^>]*>/i);
  assert.ok(canvasMatch, 'index.html must contain #routeCanvas element');

  const canvasTag = canvasMatch[0];
  assert.match(canvasTag, /class=["'][^"']*\broute-canvas\b[^"']*["']/i, 'Canvas must have class "route-canvas"');
  assert.match(canvasTag, /width=["']600["']/i, 'Canvas width must be 600');
  assert.match(canvasTag, /height=["']290["']/i, 'Canvas height must be 290');
  assert.match(canvasTag, /aria-hidden=["']true["']/i, 'Canvas must be hidden from screen readers with aria-hidden="true"');
});

/* =========================================================================
   2. CSS Contract for Route Canvas Overlay
   ========================================================================= */
test('css/style.css styles .route-canvas as absolute overlay with pointer-events: none', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert.match(css, /\.route-canvas\s*\{[^}]*\}/i, 'style.css must have .route-canvas rule');
  const canvasRule = css.match(/\.route-canvas\s*\{([^}]+)\}/i)[1];

  assert.match(canvasRule, /position:\s*absolute/i, '.route-canvas must be position: absolute');
  assert.match(canvasRule, /pointer-events:\s*none/i, '.route-canvas must set pointer-events: none');
  assert.match(canvasRule, /width:\s*100%/i, '.route-canvas must have width: 100%');
  assert.match(canvasRule, /height:\s*100%/i, '.route-canvas must have height: 100%');
});

/* =========================================================================
   3. JS Route Trail Implementation Contract
   ========================================================================= */
test('js/toys.js implements trail buffer, moving state, particle emission and decay in initRoute', () => {
  const toysSrc = fs.readFileSync(TOYS_PATH, 'utf8');

  // Check initRoute setup
  assert.match(toysSrc, /routeCanvas/, 'initRoute must reference #routeCanvas');
  assert.match(toysSrc, /trail\s*=\s*\[\]/, 'initRoute must initialize trail = []');
  assert.match(toysSrc, /moving\s*===\s*true/, 'initRoute must check moving === true');
  assert.match(toysSrc, /opacity/, 'Particles must define opacity');
  assert.match(toysSrc, /radius/, 'Particles must define radius');
  assert.match(toysSrc, /ctx\.arc\(/, 'Canvas rendering must use ctx.arc()');
  assert.match(toysSrc, /dt\s*\*\s*2|delta\s*\*\s*2/, 'Particles must fade opacity by dt * 2');
});

/* =========================================================================
   4. Functional Behavior Tests for Trail Helper Functions
   ========================================================================= */
test('toys.updateRouteTrail pushes particles with x, y, opacity, radius when moving === true', () => {
  const toys = require('./toys.js');
  assert.strictEqual(typeof toys.updateRouteTrail, 'function', 'toys.js must export updateRouteTrail');

  const trail = [];
  const cloudPt = { x: 120, y: 80 };

  // While moving is true, push particle
  toys.updateRouteTrail(trail, 0.016, true, cloudPt);
  assert.strictEqual(trail.length, 1, 'Trail must have 1 particle after update while moving');

  const p = trail[0];
  assert.strictEqual(typeof p.x, 'number', 'Particle must have numeric x');
  assert.strictEqual(typeof p.y, 'number', 'Particle must have numeric y');
  assert.strictEqual(typeof p.opacity, 'number', 'Particle must have numeric opacity');
  assert.strictEqual(typeof p.radius, 'number', 'Particle must have numeric radius');
  assert.ok(p.opacity > 0 && p.opacity <= 1, 'Particle opacity must be within (0, 1]');
  assert.ok(p.radius > 0, 'Particle radius must be positive');

  // Verify particle is spawned behind Pip's cloud (x < cloudPt.x)
  assert.ok(p.x < cloudPt.x, `Particle x (${p.x}) should be spawned behind Pip's cloud x (${cloudPt.x})`);
});

test('toys.updateRouteTrail does not push particles when moving === false', () => {
  const toys = require('./toys.js');
  const trail = [];
  const cloudPt = { x: 150, y: 90 };

  toys.updateRouteTrail(trail, 0.016, false, cloudPt);
  assert.strictEqual(trail.length, 0, 'Trail must not push particles when moving is false');
});

test('toys.updateRouteTrail fades opacity by dt * 2 and removes expired particles', () => {
  const toys = require('./toys.js');
  const trail = [
    { x: 100, y: 50, opacity: 0.5, radius: 2 },
    { x: 110, y: 55, opacity: 0.02, radius: 2.5 }
  ];

  // dt = 0.1s -> opacity decrement = 0.1 * 2 = 0.2
  // Particle 1: 0.5 - 0.2 = 0.3 (survives)
  // Particle 2: 0.02 - 0.2 = -0.18 <= 0 (expires)
  toys.updateRouteTrail(trail, 0.1, false, null);

  assert.strictEqual(trail.length, 1, 'Expired particle should have been removed from trail');
  assert.ok(Math.abs(trail[0].opacity - 0.3) < 0.001, `Particle opacity should fade by dt * 2 (expected ~0.3, got ${trail[0].opacity})`);

  // Further decay until complete expiration
  toys.updateRouteTrail(trail, 0.2, false, null);
  assert.strictEqual(trail.length, 0, 'All particles should expire when opacity drops to or below 0');
});

test('toys.renderRouteTrail renders particles using ctx.clearRect, ctx.arc, and ctx.fill', () => {
  const toys = require('./toys.js');
  assert.strictEqual(typeof toys.renderRouteTrail, 'function', 'toys.js must export renderRouteTrail');

  const calls = [];
  const mockCtx = {
    clearRect: (x, y, w, h) => calls.push({ method: 'clearRect', args: [x, y, w, h] }),
    beginPath: () => calls.push({ method: 'beginPath' }),
    arc: (x, y, r, s, e) => calls.push({ method: 'arc', args: [x, y, r, s, e] }),
    fill: () => calls.push({ method: 'fill' }),
    fillStyle: ''
  };

  const trail = [
    { x: 120, y: 80, opacity: 0.8, radius: 2.5 },
    { x: 115, y: 78, opacity: 0.4, radius: 1.8 }
  ];

  toys.renderRouteTrail(mockCtx, trail, 600, 290);

  // Check clearRect was called
  const clearCall = calls.find(c => c.method === 'clearRect');
  assert.ok(clearCall, 'renderRouteTrail must call ctx.clearRect');
  assert.deepStrictEqual(clearCall.args, [0, 0, 600, 290]);

  // Check arc calls
  const arcCalls = calls.filter(c => c.method === 'arc');
  assert.strictEqual(arcCalls.length, 2, 'Must call ctx.arc for each active particle');
  assert.strictEqual(arcCalls[0].args[0], 120);
  assert.strictEqual(arcCalls[0].args[1], 80);

  // Check fill calls
  const fillCalls = calls.filter(c => c.method === 'fill');
  assert.strictEqual(fillCalls.length, 2, 'Must call ctx.fill for each active particle');
});
