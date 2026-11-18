const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('Performance Audit: docs/AUDIT_PERFORMANCE.md exists and documents measurements', () => {
  const auditPath = path.join(__dirname, '..', 'docs', 'AUDIT_PERFORMANCE.md');
  assert.ok(fs.existsSync(auditPath), 'docs/AUDIT_PERFORMANCE.md must exist');

  const content = fs.readFileSync(auditPath, 'utf8');
  assert.match(content, /Before Remediation/i, 'Must contain before measurements');
  assert.match(content, /After Remediation/i, 'Must contain after measurements');
  assert.match(content, /AudioContext/i, 'Must document AudioContext lifecycle');
  assert.match(content, /visibilitychange|document\.hidden/i, 'Must document visibility lifecycle');
});

test('Performance Audit: js/audio.js suspends AudioContext when muted and hidden', () => {
  const audioCode = fs.readFileSync(path.join(__dirname, 'audio.js'), 'utf8');
  assert.match(audioCode, /ctx\.suspend/, 'audio.js must call ctx.suspend() when muting');
  assert.match(audioCode, /ctx\.resume/, 'audio.js must call ctx.resume() when unmuting');
  assert.match(audioCode, /visibilitychange/, 'audio.js must monitor document visibilitychange');
});

test('Performance Audit: js/pip.js pauses timers when hidden or offscreen', () => {
  const pipCode = fs.readFileSync(path.join(__dirname, 'pip.js'), 'utf8');
  assert.match(pipCode, /if\s*\(document\.hidden\s*\|\|\s*!svgInView\)\s*\{\s*idleTimer\s*=\s*0;\s*return;\s*\}/,
    'idleLoop must exit without scheduling when hidden or offscreen');
  assert.match(pipCode, /if\s*\(document\.hidden\s*\|\|\s*!svgInView\)\s*\{\s*blinkTimer\s*=\s*0;\s*return;\s*\}/,
    'blinkLoop must exit without scheduling when hidden or offscreen');
  assert.match(pipCode, /visibilitychange/, 'pip.js must listen for visibilitychange to resume loops');
});

test('Performance Audit: js/fx.js halts odometer timer loop when hidden or offscreen', () => {
  const fxCode = fs.readFileSync(path.join(__dirname, 'fx.js'), 'utf8');
  assert.match(fxCode, /if\s*\(document\.hidden\s*\|\|\s*!inView\)\s*\{\s*odoTimer\s*=\s*0;\s*return;\s*\}/,
    'scheduleTick must halt when hidden or offscreen');
  assert.match(fxCode, /visibilitychange/, 'fx.js must resume scheduleTick on visibilitychange');
});

test('Performance Audit: js/toys.js connects Nightlights drift rAF loop to visibilitychange', () => {
  const toysCode = fs.readFileSync(path.join(__dirname, 'toys.js'), 'utf8');
  assert.match(toysCode, /document\.addEventListener\('visibilitychange',[\s\S]*?requestAnimationFrame\(drift\)/,
    'toys.js must reconnect drift loop on visibilitychange');
});

test('Performance Audit: js/main.js guards clock updates when document is hidden', () => {
  const mainCode = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');
  assert.match(mainCode, /if\s*\(!document\.hidden\)\s*\{[\s\S]*?el\.textContent/,
    'initClock must skip DOM updates when document.hidden is true');
});
