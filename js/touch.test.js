const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const cssPath = path.join(__dirname, '..', 'css', 'style.css');
const css = fs.readFileSync(cssPath, 'utf8');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

test('darkroom and handle configure scoped touch actions', () => {
  assert.match(css, /\.darkroom\s*\{[^}]*touch-action:\s*pan-y/, 'Darkroom must allow vertical page scrolling');
  assert.match(css, /\.dr-handle\s*\{[^}]*touch-action:\s*none/, 'Darkroom handle must disable native touch actions for dragging');
});

test('interactive controls declare touch-action manipulation or none to avoid mobile tap delay', () => {
  assert.match(css, /\.btn\s*\{[^}]*touch-action:\s*manipulation/, '.btn must declare touch-action: manipulation');
  assert.match(css, /\.key\s*\{[^}]*touch-action:\s*manipulation/, '.key must declare touch-action: manipulation');
  assert.match(css, /\.lantern\s*\{[^}]*touch-action:\s*manipulation/, '.lantern must declare touch-action: manipulation');
  assert.match(css, /\.block-canvas\s*\{[^}]*touch-action:\s*manipulation/, '.block-canvas must declare touch-action: manipulation');
});

test('mobile breakpoint enforces WCAG 44x44px touch targets on taskbar buttons', () => {
  assert.match(css, /\.tb-btn\s*\{[^}]*min-width:\s*44px;[^}]*min-height:\s*44px/, 'Mobile .tb-btn must be at least 44x44px');
});

test('font loading prevents FOIT and viewport is mobile-optimized', () => {
  assert.match(html, /fonts\.googleapis\.com\/css2\?[^"']*display=swap/, 'Google Fonts must include display=swap');
  assert.match(html, /<meta\s+name=["']viewport["'][^>]*viewport-fit=cover/, 'Viewport must configure viewport-fit=cover');
});
