const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('Documentation: docs/FIRST_PR.md exists and contains complete newcomer guide', () => {
  const firstPrPath = path.join(__dirname, '..', 'docs', 'FIRST_PR.md');
  assert.ok(fs.existsSync(firstPrPath), 'docs/FIRST_PR.md must exist');

  const content = fs.readFileSync(firstPrPath, 'utf8');
  assert.match(content, /git clone/i, 'Must include git clone command');
  assert.match(content, /http\.server|serve/i, 'Must explain how to run local server');
  assert.match(content, /upstream\/main/i, 'Must instruct branching from upstream/main');
  assert.match(content, /node --test/i, 'Must instruct running tests');
  assert.match(content, /git commit/i, 'Must explain committing changes');
  assert.match(content, /Pull Request|gh pr create/i, 'Must explain opening PR');
});

test('Documentation: docs/ARCHITECTURE.md exists and documents window.PIP and eye tracking', () => {
  const archPath = path.join(__dirname, '..', 'docs', 'ARCHITECTURE.md');
  assert.ok(fs.existsSync(archPath), 'docs/ARCHITECTURE.md must exist');

  const content = fs.readFileSync(archPath, 'utf8');
  assert.match(content, /window\.PIP/i, 'Must document window.PIP namespace');
  assert.match(content, /PIP\.audio/i, 'Must document PIP.audio');
  assert.match(content, /PIP\.pip/i, 'Must document PIP.pip');
  assert.match(content, /PIP\.toys/i, 'Must document PIP.toys');
  assert.match(content, /clipPath|socket/i, 'Must explain SVG eye sockets and clipping');
  assert.match(content, /look\(x,\s*y\)|tracking/i, 'Must explain pupil tracking mathematics');
  assert.match(content, /music-box|darkroom|stacker|growth/i, 'Must document where each toy lives');
});

test('Documentation: README.md links both FIRST_PR.md and ARCHITECTURE.md', () => {
  const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
  assert.match(readme, /docs\/FIRST_PR\.md/, 'README must link docs/FIRST_PR.md');
  assert.match(readme, /docs\/ARCHITECTURE\.md/, 'README must link docs/ARCHITECTURE.md');
});
