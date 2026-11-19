const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const AUDIO_JS_PATH = path.join(ROOT_DIR, 'js', 'audio.js');
const TERMINAL_JS_PATH = path.join(ROOT_DIR, 'js', 'terminal.js');

/* =========================================================================
   1. Audio Sleep Timer API & Implementation Contract
   ========================================================================= */
test('js/audio.js exports startSleepTimer, stopSleepTimer, and stopAll methods', () => {
  const audio = require(AUDIO_JS_PATH);

  assert.strictEqual(typeof audio.startSleepTimer, 'function', 'startSleepTimer must be exported');
  assert.strictEqual(typeof audio.stopSleepTimer, 'function', 'stopSleepTimer must be exported');
  assert.strictEqual(typeof audio.stopAll, 'function', 'stopAll must be exported');
  assert.strictEqual(typeof audio.getSleepTimerRemaining, 'function', 'getSleepTimerRemaining must be exported');
  assert.strictEqual(typeof audio.isSleepTimerActive, 'function', 'isSleepTimerActive must be exported');
});

test('js/audio.js implements interval timer, exponential decay, stopAll, night mode, and toast', () => {
  const audioSrc = fs.readFileSync(AUDIO_JS_PATH, 'utf8');

  assert.match(audioSrc, /function\s+startSleepTimer\s*\(/, 'audio.js must define startSleepTimer');
  assert.match(audioSrc, /function\s+stopAll\s*\(/, 'audio.js must define stopAll');
  assert.match(audioSrc, /setValueAtTime\(/, 'audio.js must use setValueAtTime for audio gain');
  assert.match(audioSrc, /stopAll\(\)/, 'Timer expiration must invoke stopAll()');
  assert.match(audioSrc, /Pip fell fast asleep\.\s*Sweet dreams!/, 'Must trigger bedtime toast upon timer expiration');
});

test('audio.startSleepTimer sets active state and getSleepTimerRemaining tracks time', () => {
  const audio = require(AUDIO_JS_PATH);

  audio.stopSleepTimer();
  assert.strictEqual(audio.isSleepTimerActive(), false);

  const totalSec = audio.startSleepTimer(10);
  assert.strictEqual(totalSec, 600, '10 minutes must equate to 600 seconds');
  assert.strictEqual(audio.isSleepTimerActive(), true);

  const remaining = audio.getSleepTimerRemaining();
  assert.ok(remaining > 590 && remaining <= 600, `Remaining seconds (${remaining}) should be near 600`);

  audio.stopSleepTimer();
  assert.strictEqual(audio.isSleepTimerActive(), false);
  assert.strictEqual(audio.getSleepTimerRemaining(), 0);
});

test('audio.startSleepTimer expires, invokes stopAll, switches theme to night, and triggers toast', (t, done) => {
  const audio = require(AUDIO_JS_PATH);

  // Setup mock DOM environment
  global.PIP = global.PIP || {};
  let toastTriggered = '';
  global.PIP.toast = function (msg) {
    toastTriggered = msg;
  };

  const mockDoc = {
    documentElement: {
      attributes: {},
      setAttribute: function (k, v) { this.attributes[k] = v; },
      getAttribute: function (k) { return this.attributes[k] || null; }
    },
    getElementById: function () { return null; }
  };
  global.document = mockDoc;

  // Run a micro sleep timer (e.g. 0.002 minutes = 0.12s)
  audio.startSleepTimer(0.002, () => {
    try {
      assert.strictEqual(toastTriggered, 'Pip fell fast asleep. Sweet dreams!');
      assert.strictEqual(mockDoc.documentElement.getAttribute('data-theme'), 'night');
      assert.strictEqual(audio.isSleepTimerActive(), false);
      done();
    } catch (err) {
      done(err);
    }
  });
});

/* =========================================================================
   2. Terminal sleep Command Contract
   ========================================================================= */
test('js/terminal.js provides sleep [minutes] command and autocompletion', () => {
  const term = require(TERMINAL_JS_PATH);

  // Check help output
  const helpRes = term.executeCommand('help');
  assert.match(helpRes.output, /sleep\s+\[minutes\]/i, 'Terminal help must list sleep [minutes]');

  // Check sleep command without arguments
  const sleepNoArg = term.executeCommand('sleep');
  assert.match(sleepNoArg.output, /Usage:\s*sleep\s*\[minutes\]/i);

  // Check sleep command with minutes argument
  const sleepSet = term.executeCommand('sleep 20');
  assert.match(sleepSet.output, /Bedtime sleep timer set for 20 minutes/i);

  // Check sleep command status while running
  const sleepStatus = term.executeCommand('sleep');
  assert.match(sleepStatus.output, /Bedtime sleep timer is active/i);

  // Check sleep cancel command
  const sleepCancel = term.executeCommand('sleep cancel');
  assert.match(sleepCancel.output, /Bedtime sleep timer cancelled/i);

  // Check autocompletion for sleep
  const autoSleep = term.autocomplete('sl');
  assert.ok(autoSleep.includes('sleep'), 'autocomplete("sl") must suggest "sleep"');

  const autoSleepArgs = term.autocomplete('sleep ');
  assert.ok(autoSleepArgs.some(opt => opt.startsWith('sleep ')), 'autocomplete("sleep ") must suggest sleep durations');
});
