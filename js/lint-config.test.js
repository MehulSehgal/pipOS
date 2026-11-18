const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PKG_PATH = path.join(ROOT, 'package.json');
const ESLINT_PATH = path.join(ROOT, 'eslint.config.js');
const PRETTIER_PATH = path.join(ROOT, '.prettierrc');

test('package.json exists with dev-only tooling and zero runtime dependencies', () => {
  assert.ok(fs.existsSync(PKG_PATH), 'package.json must exist in project root');
  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));

  assert.strictEqual(pkg.private, true, 'package.json must be private');
  assert.strictEqual(pkg.dependencies, undefined, 'Must not declare runtime dependencies');

  // Verify scripts
  assert.ok(pkg.scripts, 'package.json must define scripts');
  assert.ok(pkg.scripts.lint, 'package.json must define lint script');
  assert.ok(pkg.scripts.format, 'package.json must define format script');
  assert.ok(pkg.scripts.test, 'package.json must define test script');

  // Verify devDependencies
  assert.ok(pkg.devDependencies, 'package.json must define devDependencies');
  assert.ok(pkg.devDependencies.eslint, 'Must include eslint in devDependencies');
  assert.ok(pkg.devDependencies.prettier, 'Must include prettier in devDependencies');
});

test('eslint.config.js exists and exports valid configuration with browser globals', () => {
  assert.ok(fs.existsSync(ESLINT_PATH), 'eslint.config.js must exist in root');
  const config = require(ESLINT_PATH);

  assert.ok(Array.isArray(config), 'eslint.config.js must export flat config array');
  assert.ok(config[0].languageOptions, 'Config must declare languageOptions');
  assert.ok(config[0].languageOptions.globals.window, 'Must declare window global');
  assert.ok(config[0].languageOptions.globals.document, 'Must declare document global');
  assert.ok(config[0].rules, 'Config must declare rules');
});

test('.prettierrc exists and defines shared style rules', () => {
  assert.ok(fs.existsSync(PRETTIER_PATH), '.prettierrc must exist in root');
  const prettierConf = JSON.parse(fs.readFileSync(PRETTIER_PATH, 'utf8'));

  assert.strictEqual(prettierConf.semi, true, 'Must enforce semicolons');
  assert.strictEqual(prettierConf.singleQuote, true, 'Must enforce single quotes');
  assert.strictEqual(prettierConf.tabWidth, 2, 'Must specify 2-space indentation');
});
