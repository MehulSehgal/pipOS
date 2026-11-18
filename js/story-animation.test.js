const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('Story Scene Animations: css/style.css defines active-scene animations', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

  // Verify keyframe definitions
  assert.match(css, /@keyframes\s+scene-twinkle\s*\{/, 'Must define scene-twinkle keyframes');
  assert.match(css, /@keyframes\s+scene-rock\s*\{/, 'Must define scene-rock keyframes');
  assert.match(css, /@keyframes\s+scene-float\s*\{/, 'Must define scene-float keyframes');
  assert.match(css, /@keyframes\s+scene-zzz\s*\{/, 'Must define scene-zzz keyframes');
  assert.match(css, /@keyframes\s+scene-lid\s*\{/, 'Must define scene-lid keyframes');
  assert.match(css, /@keyframes\s+scene-drift\s*\{/, 'Must define scene-drift keyframes');

  // Animations apply only when scene is active
  assert.match(css, /\.scene\.is-active\s+\.s-star\s*\{[^}]*animation:\s*scene-twinkle/,
    'Twinkling stars must be scoped to .scene.is-active');
  assert.match(css, /\.scene\.is-active\s+\.s-basket[\s\S]*?animation:\s*scene-rock/,
    'Rocking basket must be scoped to .scene.is-active');
  assert.match(css, /\.scene\.is-active\s+\.s-ghost\s*\{[^}]*animation:\s*scene-float/,
    'Floating ghosts must be scoped to .scene.is-active');
  assert.match(css, /\.scene\.is-active\s+\.s-z\s*\{[^}]*animation:\s*scene-zzz/,
    'Rising zzz must be scoped to .scene.is-active');
  assert.match(css, /\.scene\.is-active\s+\.s-cloud[\s\S]*?animation:\s*scene-drift/,
    'Drifting cloud must be scoped to .scene.is-active');
});

test('Story Scene Animations: layout shift prevention (composite properties only)', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

  // Check keyframe blocks to ensure no width, height, top, left, or margin mutations
  const keyframeSection = css.match(/@keyframes\s+scene-[^}]+}[^}]+}/g) || [];
  assert.ok(keyframeSection.length > 0, 'Keyframe definitions must exist');

  keyframeSection.forEach(kf => {
    assert.doesNotMatch(kf, /\b(width|height|top|bottom|left|right|margin|padding):\s*[^;]+;/i,
      'Scene animations must avoid layout shift by using only transform, opacity, or filter');
  });
});

test('Story Scene Animations: prefers-reduced-motion fully disables animations', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.scene\.is-active\s+\.s-star/,
    'Reduced motion must disable .s-star animation');
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.scene\.is-active\s+\.s-basket/,
    'Reduced motion must disable .s-basket animation');
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.scene\.is-active\s+\.s-ghost/,
    'Reduced motion must disable .s-ghost animation');
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.scene\.is-active\s+\.s-cloud/,
    'Reduced motion must disable .s-cloud animation');
});
