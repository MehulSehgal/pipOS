#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const htmlPath = path.join(ROOT, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Extract all ids in index.html
const idMatches = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
const ids = new Set(idMatches);

// Extract all href and non-optional src attributes
const hrefMatches = [...html.matchAll(/\bhref=["']([^"']+)["']/g)].map(m => m[1]);
const tagMatches = [...html.matchAll(/<([a-zA-Z0-9-]+)([^>]*)>/g)];
const srcMatches = [];

tagMatches.forEach(tag => {
  const fullTag = tag[0];
  const attrs = tag[2];
  if (attrs.includes('data-optional')) return; // Explicitly optional assets
  const srcMatch = attrs.match(/\b(?:src)=["']([^"']+)["']/);
  if (srcMatch) srcMatches.push(srcMatch[1]);
});

const errors = [];

// Check anchor and local file links
hrefMatches.forEach(href => {
  if (href.startsWith('#')) {
    const id = href.slice(1);
    if (!id) return;
    if (!ids.has(id)) {
      errors.push(`Broken internal anchor: href="${href}" (no element with id="${id}" found)`);
    }
  } else if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:')) {
    const filePath = path.join(ROOT, href.split('#')[0].split('?')[0]);
    if (!fs.existsSync(filePath)) {
      errors.push(`Broken local link: href="${href}" (file not found on disk: ${filePath})`);
    }
  }
});

// Check src and data-src assets
srcMatches.forEach(src => {
  if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:')) {
    const filePath = path.join(ROOT, src.split('?')[0]);
    if (!fs.existsSync(filePath)) {
      errors.push(`Broken asset path: src="${src}" (file not found on disk: ${filePath})`);
    }
  }
});

if (errors.length > 0) {
  console.error(`Link check failed with ${errors.length} broken reference(s):`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
} else {
  console.log('Link check passed: all internal anchors and local assets exist.');
}
