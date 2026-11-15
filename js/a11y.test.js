const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const HTML_PATH = path.resolve(__dirname, '..', 'index.html');
const CSS_PATH = path.resolve(__dirname, '..', 'css', 'style.css');

test('index.html skip link points to focusable main landmark', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  assert.match(html, /<a\s+class=["']skip["']\s+href=["']#main["']>/i, 'Skip link must target #main');
  assert.match(html, /<main\s+id=["']main["']\s+tabindex=["']-1["']>/i,
    'Main landmark must have tabindex="-1" so focus moves reliably on skip');
});

test('index.html Pip SVG illustration has accessible labels and descriptions', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  assert.match(html, /<svg[^>]*id=["']pipSvg["'][^>]*aria-labelledby=["']pipT\s+pipD["']/i,
    'Pip SVG must link title and description via aria-labelledby');
  assert.match(html, /<title\s+id=["']pipT["']>/i, 'pipT title element must exist');
  assert.match(html, /<desc\s+id=["']pipD["']>/i, 'pipD desc element must exist');
});

test('index.html inactive story scenes have inert and aria-hidden attributes', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  assert.match(html, /<article\s+class=["']scene is-active["']\s+aria-labelledby=["']sc1["']\s+tabindex=["']-1["']>/i,
    'Active scene must be focusable');
  assert.match(html, /<article\s+class=["']scene["']\s+aria-labelledby=["']sc2["']\s+aria-hidden=["']true["']\s+inert\s+tabindex=["']-1["']>/i,
    'Inactive scene 2 must have inert and aria-hidden');
  assert.match(html, /<article\s+class=["']scene["']\s+aria-labelledby=["']sc3["']\s+aria-hidden=["']true["']\s+inert\s+tabindex=["']-1["']>/i,
    'Inactive scene 3 must have inert and aria-hidden');
  assert.match(html, /<article\s+class=["']scene["']\s+aria-labelledby=["']sc4["']\s+aria-hidden=["']true["']\s+inert\s+tabindex=["']-1["']>/i,
    'Inactive scene 4 must have inert and aria-hidden');
});

test('index.html darkroom hidden items have descriptive names for screen readers', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  assert.match(html, /data-item\s+data-name=["']starlight wisp["']/i);
  assert.match(html, /data-item\s+data-name=["']moon honey["']/i);
  assert.match(html, /data-item\s+data-name=["']warm soup dream["']/i);
  assert.match(html, /data-item\s+data-name=["']cloud pillow["']/i);
  assert.match(html, /data-item\s+data-name=["']spare sock["']/i);
});

test('css/style.css prevents outline rectangle on programmatic main focus while keeping focus-visible', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');
  assert.match(css, /#main:focus\s*\{\s*outline:\s*none;\s*\}/,
    '#main:focus must remove container outline while preserving :focus-visible');
});
