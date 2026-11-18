const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const CI_YML_PATH = path.join(ROOT, '.github', 'workflows', 'ci.yml');
const LHCI_CONFIG_PATH = path.join(ROOT, '.lighthouserc.json');
const CHECK_LINKS_SCRIPT = path.join(ROOT, 'scripts', 'check-links.js');

test('.github/workflows/ci.yml configures HTML validation, link checks, and Lighthouse CI', () => {
  assert.ok(fs.existsSync(CI_YML_PATH), 'ci.yml must exist in .github/workflows/');
  const yml = fs.readFileSync(CI_YML_PATH, 'utf8');

  // Must trigger on pull requests and pushes
  assert.match(yml, /pull_request:/, 'ci.yml must trigger on pull_request');
  assert.match(yml, /branches:\s*\[\s*main\s*\]/, 'ci.yml must target main branch');

  // Must include HTML validation
  assert.match(yml, /html-validate/, 'ci.yml must run HTML validation');

  // Must include Broken Links check
  assert.match(yml, /check-links\.js/, 'ci.yml must run broken-link checker');

  // Must include Lighthouse CI
  assert.match(yml, /@lhci\/cli/, 'ci.yml must run Lighthouse CI via @lhci/cli');
});

test('.lighthouserc.json configures audits and score assertions', () => {
  assert.ok(fs.existsSync(LHCI_CONFIG_PATH), '.lighthouserc.json must exist in project root');
  const raw = fs.readFileSync(LHCI_CONFIG_PATH, 'utf8');
  const config = JSON.parse(raw);

  assert.ok(config.ci, 'Lighthouse config must declare ci block');
  assert.strictEqual(config.ci.collect.staticDistDir, '.', 'Lighthouse must serve static root');
  assert.ok(config.ci.assert && config.ci.assert.assertions, 'Lighthouse must specify score assertions');
  assert.ok(config.ci.assert.assertions['categories:accessibility'], 'Must assert accessibility threshold');
  assert.ok(config.ci.assert.assertions['categories:best-practices'], 'Must assert best-practices threshold');
  assert.ok(config.ci.assert.assertions['categories:seo'], 'Must assert SEO threshold');
});

test('scripts/check-links.js validates all internal anchors and assets successfully', () => {
  assert.ok(fs.existsSync(CHECK_LINKS_SCRIPT), 'scripts/check-links.js must exist');
  const output = execSync(`node "${CHECK_LINKS_SCRIPT}"`, { cwd: ROOT, encoding: 'utf8' });
  assert.match(output, /Link check passed/, 'scripts/check-links.js must pass cleanly');
});
