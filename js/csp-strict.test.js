'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

describe('Strict Content Security Policy (CSP) & Zero-Inline Directives', () => {
  const htmlPath = path.resolve(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const cspMatch = html.match(/<meta\s+http-equiv=["']Content-Security-Policy["']\s+content="([^"]+)"/i);

  test('index.html contains a valid Content-Security-Policy meta tag', () => {
    assert.ok(cspMatch, 'CSP meta tag must be present in index.html head');
  });

  const policy = cspMatch ? cspMatch[1] : '';

  test('CSP configures media-src to allow blob: for generated audio downloads', () => {
    assert.match(policy, /media-src\s+[^;]*blob:/, 'media-src must permit blob: for procedural audio');
  });

  test('CSP enforces upgrade-insecure-requests directive', () => {
    assert.match(policy, /upgrade-insecure-requests/, 'CSP must enforce HTTPS via upgrade-insecure-requests');
  });

  test('CSP blocks legacy plugins with object-src none', () => {
    assert.match(policy, /object-src\s+'none'/, 'object-src must be "none"');
  });

  test('CSP prevents base-tag hijacking with base-uri self', () => {
    assert.match(policy, /base-uri\s+'self'/, 'base-uri must be "self"');
  });

  test('shared star SVG uses CSS class instead of inline style attribute', () => {
    assert.ok(html.includes('class="sr-hidden-svg"'), 'SVG star symbol must use sr-hidden-svg class');
    assert.ok(!html.includes('<svg width="0" height="0" style="position:absolute"'), 'Inline style must be eliminated');
  });
});
