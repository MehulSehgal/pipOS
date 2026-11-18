const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const MAIN_JS_PATH = path.resolve(__dirname, 'main.js');
const AUDIO_JS_PATH = path.resolve(__dirname, 'audio.js');
const TOYS_JS_PATH = path.resolve(__dirname, 'toys.js');
const CSS_PATH = path.resolve(__dirname, '..', 'css', 'style.css');

test('Bedtime storybook dot handlers have no undefined stickyTop/range references (Safari/Firefox/Chrome)', () => {
  const mainSrc = fs.readFileSync(MAIN_JS_PATH, 'utf8');

  // Verify stickyTop and range were removed from initStory dot click handlers
  assert.doesNotMatch(mainSrc, /stickyTop\(\)/, 'main.js must not call undefined stickyTop()');
  assert.doesNotMatch(mainSrc, /range\(\)/, 'main.js must not call undefined range()');

  // Verify touch swipe handlers guard against undefined changedTouches
  assert.match(mainSrc, /!e\.changedTouches\s*\|\|\s*!e\.changedTouches\[0\]/,
    'initStory swipe handlers must safely guard changedTouches');
});

test('Web Audio API schedules notes safely clamped to current time (Safari WebKit fix)', () => {
  const audioSrc = fs.readFileSync(AUDIO_JS_PATH, 'utf8');

  // Verify Web Audio note scheduling clamps time against ctx.currentTime
  assert.match(audioSrc, /Math\.max\(now,\s*now\s*\+\s*\(when\s*\|\|\s*0\)\)/,
    'audio.js note() must clamp scheduled time to prevent WebKit InvalidStateError');
});

test('Darkroom mask element includes will-change and hardware acceleration for WebKit mask rendering', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert.match(css, /\.dr-hidden\s*\{[^}]*will-change:\s*mask-image,\s*-webkit-mask-image/,
    '.dr-hidden must specify will-change for mask repainting');
  assert.match(css, /\.dr-hidden\s*\{[^}]*transform:\s*translateZ\(0\)/,
    '.dr-hidden must specify transform: translateZ(0) for GPU layer promotion');
});

test('Rattle & Blocks canvas dynamically updates DPR on mobile zoom/orientation change', () => {
  const toysSrc = fs.readFileSync(TOYS_JS_PATH, 'utf8');

  assert.match(toysSrc, /function\s+updateDpr\s*\(/, 'toys.js must define updateDpr');
  assert.match(toysSrc, /window\.addEventListener\(['"]resize['"],\s*updateDpr\)/,
    'toys.js must update canvas resolution on resize/orientation events');
});

test('Toast notification manages and clears entry timer to prevent race condition overwrite', () => {
  const utilSrc = fs.readFileSync(path.resolve(__dirname, 'util.js'), 'utf8');
  assert.match(utilSrc, /toastShowTimer/, 'util.js must declare and manage toastShowTimer');
  assert.match(utilSrc, /clearTimeout\(\s*toastShowTimer\s*\)/, 'util.js must clear toastShowTimer before setting a new toast');
});
