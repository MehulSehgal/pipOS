const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const CSS_PATH = path.resolve(__dirname, '..', 'css', 'style.css');

test('css/style.css contains @media print rules and @page declaration', () => {
  assert.ok(fs.existsSync(CSS_PATH), 'css/style.css must exist');
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert.match(css, /@page\s*\{[^}]*margin:[^}]*\}/i, 'style.css must declare @page with page margins');
  assert.match(css, /@media\s+print\s*\{/i, 'style.css must declare @media print block');
});

test('@media print hides taskbar, marquee, canvas, and desktop shortcuts', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');
  const printMatch = css.match(/@media\s+print\s*\{([\s\S]*)\}\s*$/);
  assert.ok(printMatch, 'Should extract @media print block');
  const printCss = printMatch[1];

  // Verify taskbar is hidden
  assert.match(printCss, /\.taskbar[\s\S]*?display:\s*none\s*!important/i, 'Taskbar must be hidden in print');

  // Verify marquee is hidden
  assert.match(printCss, /\.marquee[\s\S]*?display:\s*none\s*!important/i, 'Marquee must be hidden in print');

  // Verify canvases are hidden
  assert.match(printCss, /(?:canvas|#confetti|#blockCanvas)[\s\S]*?display:\s*none\s*!important/i,
    'Canvas elements must be hidden in print');

  // Verify desktop shortcuts and interactive elements are hidden
  assert.match(printCss, /\.desk-icons[\s\S]*?display:\s*none\s*!important/i,
    'Desktop shortcuts must be hidden in print');
});

test('@media print disables animations and enforces black on white styling', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');
  const printMatch = css.match(/@media\s+print\s*\{([\s\S]*)\}\s*$/);
  assert.ok(printMatch);
  const printCss = printMatch[1];

  // Verify animations and transitions are stripped
  assert.match(printCss, /animation:\s*none\s*!important/i, 'Animations must be disabled in print');
  assert.match(printCss, /transition:\s*none\s*!important/i, 'Transitions must be disabled in print');

  // Verify black-on-white text and background
  assert.match(printCss, /background:\s*#ffffff\s*!important|background:\s*#fff\s*!important/i,
    'Background must be white in print');
  assert.match(printCss, /color:\s*#000000\s*!important|color:\s*#000\s*!important/i,
    'Text color must be black in print');
});

test('@media print hides non-profile sections while keeping headings and project list', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');
  const printMatch = css.match(/@media\s+print\s*\{([\s\S]*)\}\s*$/);
  assert.ok(printMatch);
  const printCss = printMatch[1];

  // Non-essential sections hidden (#story, #wall, dialog)
  assert.match(printCss, /#story[\s\S]*?display:\s*none\s*!important/i, '#story must be hidden in print');
  assert.match(printCss, /#wall[\s\S]*?display:\s*none\s*!important/i, '#wall must be hidden in print');
  assert.match(printCss, /(?:dialog|#secret)[\s\S]*?display:\s*none\s*!important/i,
    'Dialog modals must be hidden in print');

  // Headings kept and styled in black
  assert.match(printCss, /\.win-title[\s\S]*?color:\s*#000/i, 'Window title headings must be styled for print');
  assert.match(printCss, /\.sec-head\s+h2[\s\S]*?color:\s*#000/i, 'Section headings must be styled for print');

  // Character sheet and project list forced visible and compact
  assert.match(printCss, /#about\s+\.win-body[\s\S]*?display:\s*block\s*!important/i,
    '#about win-body must be visible in print');
  assert.match(printCss, /#work\s+\.win-body[\s\S]*?display:\s*block\s*!important/i,
    '#work win-body must be visible in print');
  assert.match(printCss, /\.work\s*\{[\s\S]*?grid-template-columns:/i,
    '.work must be laid out in a compact grid for one-page printing');
});
