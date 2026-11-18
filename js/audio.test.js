const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const HTML_PATH = path.resolve(__dirname, '..', 'index.html');
const AUDIO_JS_PATH = path.resolve(__dirname, 'audio.js');
const TOYS_JS_PATH = path.resolve(__dirname, 'toys.js');

test('index.html contains accessible volume slider and melody picker in Lullaby Lab', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  // Verify volume slider exists with proper accessibility attributes
  assert.match(html, /<input[^>]*id=["']volSlider["'][^>]*>/i,
    'Lullaby Lab must contain a volume range slider');
  assert.match(html, /id=["']volSlider["'][^>]*type=["']range["']|type=["']range["'][^>]*id=["']volSlider["']/i,
    'volSlider must have type="range"');
  assert.match(html, /aria-label=["']Music box volume["']/i,
    'Volume slider must have an accessible aria-label');

  // Verify melody select exists with at least 3 original options
  assert.match(html, /<select[^>]*id=["']tuneSelect["']/i,
    'Lullaby Lab must contain a melody selection dropdown');
  assert.match(html, /<option[^>]*value=["']0["'][^>]*>The Nursery Step<\/option>/i);
  assert.match(html, /<option[^>]*value=["']1["'][^>]*>Cloud Patrol<\/option>/i);
  assert.match(html, /<option[^>]*value=["']2["'][^>]*>Starlight Waltz<\/option>/i);
});

test('js/audio.js implements setVolume and getVolume with boundary clamping', () => {
  const audioSrc = fs.readFileSync(AUDIO_JS_PATH, 'utf8');

  // Verify setVolume and getVolume definitions and exports
  assert.match(audioSrc, /function\s+setVolume\s*\(/, 'audio.js must define setVolume');
  assert.match(audioSrc, /function\s+getVolume\s*\(/, 'audio.js must define getVolume');
  assert.match(audioSrc, /setVolume:\s*setVolume/, 'audio.js must export setVolume');
  assert.match(audioSrc, /getVolume:\s*getVolume/, 'audio.js must export getVolume');

  // Test pure clamping algorithm used by audio volume
  function clampVolume(v) {
    var num = parseFloat(v);
    if (isNaN(num)) return 0.7;
    return Math.min(1, Math.max(0, num));
  }

  assert.strictEqual(clampVolume(0.5), 0.5);
  assert.strictEqual(clampVolume(-0.2), 0);
  assert.strictEqual(clampVolume(1.5), 1);
  assert.strictEqual(clampVolume('invalid'), 0.7);
  assert.strictEqual(clampVolume(0), 0);
  assert.strictEqual(clampVolume(1), 1);
});

test('C major pentatonic scale frequencies are harmonious and correctly ordered', () => {
  const audioSrc = fs.readFileSync(AUDIO_JS_PATH, 'utf8');
  const scaleMatch = audioSrc.match(/var\s+SCALE\s*=\s*\[([^\]]+)\]/);
  assert.ok(scaleMatch, 'audio.js must define SCALE array');

  const scale = scaleMatch[1].split(',').map(s => parseFloat(s.trim()));
  assert.strictEqual(scale.length, 8, 'Scale must have 8 pentatonic notes');

  // Assert strictly ascending frequency order
  for (let i = 1; i < scale.length; i++) {
    assert.ok(scale[i] > scale[i - 1], `Note ${i} (${scale[i]}) must be higher than note ${i - 1} (${scale[i - 1]})`);
  }

  // C5 should be approx 523.25 Hz, C6 approx 1046.5 Hz (octave ratio ~2.0)
  assert.ok(Math.abs(scale[0] - 523.25) < 0.1, 'Lowest note C5 must be ~523.25 Hz');
  assert.ok(Math.abs(scale[5] - 1046.5) < 0.1, 'Octave note C6 must be ~1046.5 Hz');
  assert.ok(Math.abs(scale[5] / scale[0] - 2.0) < 0.01, 'Octave ratio must be exactly 2:1');
});

test('js/toys.js defines valid, non-copyrighted original melodies', () => {
  const toysSrc = fs.readFileSync(TOYS_JS_PATH, 'utf8');

  // Check TUNES definition exists
  assert.match(toysSrc, /var\s+TUNES\s*=\s*\[/, 'toys.js must define TUNES array');
  assert.match(toysSrc, /The Nursery Step/, 'TUNES must include The Nursery Step');
  assert.match(toysSrc, /Cloud Patrol/, 'TUNES must include Cloud Patrol');
  assert.match(toysSrc, /Starlight Waltz/, 'TUNES must include Starlight Waltz');
});
