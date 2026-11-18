const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const i18n = require('./i18n.js');

test('TRANSLATIONS provides complete dictionaries for en and hi', () => {
  assert.ok(i18n.TRANSLATIONS, 'TRANSLATIONS should exist');
  assert.ok(i18n.TRANSLATIONS.en, 'English dictionary should exist');
  assert.ok(i18n.TRANSLATIONS.hi, 'Hindi dictionary should exist');
});

test('Hindi translation dictionary maintains 100% key parity with English', () => {
  const enKeys = Object.keys(i18n.TRANSLATIONS.en);
  const hiKeys = Object.keys(i18n.TRANSLATIONS.hi);

  assert.ok(enKeys.length > 20, 'Should have rich set of translation keys');
  for (const key of enKeys) {
    assert.ok(key in i18n.TRANSLATIONS.hi, `Key "${key}" missing from Hindi dictionary`);
    assert.ok(i18n.TRANSLATIONS.hi[key].length > 0, `Key "${key}" in Hindi dictionary must not be empty`);
  }
});

test('Story scenes in Hindi are concise and under 150 words per scene', () => {
  const storyKeys = ['story_p1', 'story_p2', 'story_p3', 'story_p4'];
  for (const key of storyKeys) {
    const text = i18n.TRANSLATIONS.hi[key];
    const words = text.trim().split(/\s+/).length;
    assert.ok(words > 5 && words < 150, `Story scene ${key} length (${words} words) should be under 150 words`);
  }
});

test('index.html contains data-i18n attributes matching translations', () => {
  const htmlPath = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Verify taskbar language button
  assert.match(html, /id=["']langBtn["']/, 'index.html must include #langBtn in taskbar');
  assert.match(html, /<script[^>]*src=["']js\/i18n\.js["']/, 'index.html must include js/i18n.js script');

  // Verify key data-i18n markers exist
  const sampleKeys = ['nav_pip', 'nav_work', 'hero_title', 'work_title', 'story_h1', 'wall_title'];
  for (const key of sampleKeys) {
    assert.match(html, new RegExp(`data-i18n=["']${key}["']`), `index.html must include data-i18n="${key}"`);
  }
});
