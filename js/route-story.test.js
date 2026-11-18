const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT_DIR, 'index.html');
const TOYS_JS_PATH = path.join(ROOT_DIR, 'js', 'toys.js');
const CSS_PATH = path.join(ROOT_DIR, 'css', 'style.css');

/* =========================================================================
   1. Story Text & Word Count Constraints (< 25 words & exactly 1 sentence)
   ========================================================================= */
test('all 7 houses in index.html have 1-sentence resident stories under 25 words', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  // Match all 7 houses in route SVG
  const houseMatches = [...html.matchAll(/<g\s+[^>]*class=["'][^"']*\bhouse\b[^"']*["'][^>]*>/gi)];
  assert.strictEqual(houseMatches.length, 7, 'Route SVG must contain exactly 7 houses');

  const residentNames = [
    "Boo-ton's attic",
    "The Mittens twins",
    "Mrs. Hoot's nest",
    "Little Wisp's crib",
    "Fern the sleepy fox",
    "The puddle pond",
    "Moth Lamp Lane"
  ];

  houseMatches.forEach((match, idx) => {
    const tag = match[0];

    // Check data-name
    assert.match(tag, new RegExp(`data-name=["']${residentNames[idx].replace(/'/g, "['’]")}["']`, 'i'),
      `House ${idx + 1} must have name "${residentNames[idx]}"`);

    // Extract data-story
    const storyMatch = tag.match(/data-story=["']([^"']+)["']/i);
    assert.ok(storyMatch, `House ${idx + 1} (${residentNames[idx]}) must have data-story attribute`);

    const story = storyMatch[1].trim();
    assert.ok(story.length > 10, `House ${idx + 1} story must not be empty`);

    // Check sentence structure: exactly 1 sentence (ends with a single punctuation mark, no intermediate periods)
    assert.match(story, /^[A-Z].*\.$/, `Story for ${residentNames[idx]} must start with capital letter and end with a period`);
    const sentenceCount = story.split(/(?<=[.!?])\s+/).filter(Boolean).length;
    assert.strictEqual(sentenceCount, 1, `Story for ${residentNames[idx]} must be exactly 1 sentence`);

    // Word count constraint: strictly under 25 words
    const words = story.split(/\s+/).filter(Boolean);
    assert.ok(words.length < 25,
      `Story for ${residentNames[idx]} must be under 25 words (was ${words.length} words: "${story}")`);
    assert.ok(words.length >= 8, `Story for ${residentNames[idx]} should be meaningful (at least 8 words)`);
  });
});

test('js/toys.js exports HOUSE_STORIES with word counts strictly under 25 words', () => {
  const toys = require('./toys.js');
  assert.ok(Array.isArray(toys.HOUSE_STORIES), 'toys.js must export HOUSE_STORIES array');
  assert.strictEqual(toys.HOUSE_STORIES.length, 7, 'HOUSE_STORIES must have exactly 7 entries');

  toys.HOUSE_STORIES.forEach((story, idx) => {
    const words = story.trim().split(/\s+/).filter(Boolean);
    assert.ok(words.length < 25, `HOUSE_STORIES[${idx}] must be under 25 words (was ${words.length})`);
    assert.match(story, /\.$/, `HOUSE_STORIES[${idx}] must end with a period`);
  });
});

/* =========================================================================
   2. Accessibility & Keyboard Attributes in index.html
   ========================================================================= */
test('all 7 houses have tabindex, role, and ARIA attributes for keyboard accessibility', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');
  const houseMatches = [...html.matchAll(/<g\s+[^>]*class=["'][^"']*\bhouse\b[^"']*["'][^>]*>/gi)];

  houseMatches.forEach((match, idx) => {
    const tag = match[0];
    assert.match(tag, /tabindex=["']0["']/, `House ${idx + 1} must be keyboard-focusable with tabindex="0"`);
    assert.match(tag, /role=["']button["']/, `House ${idx + 1} must have role="button"`);
    assert.match(tag, /aria-label=["'][^"']+["']/, `House ${idx + 1} must have an accessible aria-label`);
  });
});

test('index.html contains #houseStory panel with title, text, and close button', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  assert.match(html, /<div[^>]*id=["']houseStory["'][^>]*class=["'][^"']*\bhouse-story\b[^"']*["']/i,
    'index.html must contain #houseStory panel with .house-story class');
  assert.match(html, /<div[^>]*id=["']houseStory["'][^>]*class=["'][^"']*\bhouse-tooltip\b[^"']*["']/i,
    '#houseStory must include .house-tooltip class');
  assert.match(html, /<div[^>]*id=["']houseStory["'][^>]*\bhidden\b/i,
    '#houseStory must start with hidden attribute');
  assert.match(html, /id=["']houseStoryTitle["']/i, 'Story title element #houseStoryTitle must exist');
  assert.match(html, /id=["']houseStoryText["']/i, 'Story text paragraph #houseStoryText must exist');
  assert.match(html, /<button[^>]*id=["']houseStoryClose["'][^>]*aria-label=["']Close story["']/i,
    '#houseStoryClose button must exist with aria-label="Close story"');
});

/* =========================================================================
   3. JS Route Logic & Interaction Implementation
   ========================================================================= */
test('js/toys.js implements house click, touch, and keyboard listeners with passed check', () => {
  const toysSrc = fs.readFileSync(TOYS_JS_PATH, 'utf8');

  // Must check if house has been passed before opening resident story
  assert.match(toysSrc, /is-lit|data-passed/,
    'toys.js must check if Pip has passed the house before opening resident story');
  assert.match(toysSrc, /addEventListener\(['"]click['"]/, 'Must register click event listener on houses');
  assert.match(toysSrc, /addEventListener\(['"]keydown['"]/, 'Must register keydown event listener on houses');
  assert.match(toysSrc, /Enter|' '/, 'Must support Enter and Space keys to open house story');
  assert.match(toysSrc, /Escape/, 'Must support Escape key to close house story');
  assert.match(toysSrc, /houseStory/, 'Must control #houseStory panel visibility');
  assert.match(toysSrc, /prevHouse\.focus/, 'Must restore focus to invoking house upon closing house story');
});

/* =========================================================================
   4. CSS Styling for Tooltip, Focus Ring, and Lit Houses
   ========================================================================= */
test('css/style.css defines styling for .route-stage, .house-story, and .house:focus-visible', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert.match(css, /\.route-stage\s*\{/, 'style.css must define .route-stage container');
  assert.match(css, /\.house-story\s*\{/, 'style.css must define .house-story tooltip/panel');
  assert.match(css, /\.house-story\[hidden\]\s*\{\s*display:\s*none;\s*\}/,
    'style.css must hide .house-story when [hidden]');
  assert.match(css, /\.route-svg\s+\.house\.is-lit\s*\{\s*cursor:\s*pointer;\s*\}/,
    'style.css must set cursor: pointer for lit houses');
  assert.match(css, /\.route-svg\s+\.house:focus-visible/,
    'style.css must define focus-visible styling for houses');
});
