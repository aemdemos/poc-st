#!/usr/bin/env node

/**
 * Post-Import Cleanup Script
 *
 * Strips artifacts injected during browser-based bulk import:
 * 1. Overseas visitor banner (geolocation popup)
 * 2. Twitter/analytics tracking pixel images
 *
 * Usage:
 *   node tools/importer/post-import-cleanup.js
 *   node tools/importer/post-import-cleanup.js --dry-run
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { parseHTML } from 'linkedom';

const CONTENT_DIR = resolve('content/army-careers-centre-finder');
const dryRun = process.argv.includes('--dry-run');

function cleanHtml(html) {
  const { document } = parseHTML(`<html><body>${html}</body></html>`);
  let changed = false;

  // 1. Remove overseas visitor banner
  // Pattern: <p>!</p> <h2>It looks like you're visiting...</h2> <p>Please read...</p> <p>×</p>
  const bannerH2 = document.querySelector('h2#it-looks-like-youre-visiting-our-site-from-overseas');
  if (bannerH2) {
    const parent = bannerH2.parentElement;
    // Remove the "!" paragraph before the h2
    const prev = bannerH2.previousElementSibling;
    if (prev && prev.tagName === 'P' && prev.textContent.trim() === '!') {
      prev.remove();
    }
    // Remove the "Please read..." paragraph after the h2
    let next = bannerH2.nextElementSibling;
    if (next && next.tagName === 'P' && next.textContent.includes('Nationalities and Commonwealth')) {
      const afterThat = next.nextElementSibling;
      next.remove();
      next = afterThat;
    }
    // Remove the "×" close button paragraph
    if (next && next.tagName === 'P' && next.textContent.trim() === '×') {
      next.remove();
    }
    // Remove the h2 itself
    bannerH2.remove();
    changed = true;
  }

  // 2. Remove tracking pixel images (Twitter, analytics)
  const trackingSelectors = [
    'img[src*="t.co/i/adsct"]',
    'img[src*="analytics.twitter.com"]',
    'img[src*="tr.snapchat.com"]',
    'img[src*="bat.bing.com"]',
    'img[src*="facebook.com/tr"]',
    'img[src*="doubleclick.net"]',
    'img[src*="google-analytics.com"]',
  ];

  trackingSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.remove();
      changed = true;
    });
  });

  // 3. Remove empty paragraphs left behind (containing only whitespace or empty img remnants)
  document.querySelectorAll('p').forEach((p) => {
    const text = p.textContent.trim();
    const hasImages = p.querySelector('img');
    const hasLinks = p.querySelector('a');
    if (!text && !hasImages && !hasLinks) {
      p.remove();
      changed = true;
    }
    // Remove paragraphs that only contain tracking images (now empty after step 2)
    if (p.childNodes.length === 0) {
      p.remove();
      changed = true;
    }
  });

  // Also clean up paragraphs that just have whitespace text nodes and no meaningful content
  document.querySelectorAll('p').forEach((p) => {
    if (p.children.length === 0 && p.textContent.trim() === '"') {
      p.remove();
      changed = true;
    }
  });

  if (!changed) return null;

  // Extract the cleaned body content
  return document.body.innerHTML;
}

function main() {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.plain.html'));

  console.log(`\nPost-Import Cleanup`);
  console.log(`Directory: ${CONTENT_DIR}`);
  console.log(`Files: ${files.length}`);
  console.log(`Dry run: ${dryRun}\n`);

  let cleaned = 0;
  let skipped = 0;

  files.forEach((file) => {
    const filePath = resolve(CONTENT_DIR, file);
    const original = readFileSync(filePath, 'utf-8');
    const result = cleanHtml(original);

    if (result === null) {
      skipped += 1;
      return;
    }

    if (dryRun) {
      console.log(`[WOULD CLEAN] ${file}`);
    } else {
      writeFileSync(filePath, result, 'utf-8');
      console.log(`[CLEANED] ${file}`);
    }
    cleaned += 1;
  });

  console.log(`\nDone: ${cleaned} cleaned, ${skipped} unchanged`);
}

main();
