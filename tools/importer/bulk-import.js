#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Bulk Import Runner
 *
 * Imports multiple pages from the source site and writes them as
 * EDS-compatible HTML content files to /workspace/content/.
 *
 * Usage:
 *   node tools/importer/bulk-import.js
 *   node tools/importer/bulk-import.js --url URL
 *   node tools/importer/bulk-import.js --urls URL1 URL2
 *   node tools/importer/bulk-import.js --file urls.txt
 *   node tools/importer/bulk-import.js --dry-run
 *   node tools/importer/bulk-import.js --concurrency 3
 *
 * Options:
 *   --url URL            Single URL to import
 *   --urls URL1 URL2     Multiple URLs to import
 *   --file FILE          File with URLs (one per line)
 *   --output DIR         Output directory (default: ./content)
 *   --dry-run            Preview without writing files
 *   --concurrency N      Max parallel fetches (default: 2)
 *   --source-domain URL  Source domain for URL normalization
 *   --verbose            Show detailed output
 */

import {
  writeFileSync,
  mkdirSync,
  readFileSync,
} from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { importPage } from './import-engine.js';
import { loadTemplates } from './utils/template-matcher.js';

const importerDir = dirname(fileURLToPath(import.meta.url));
const WORKSPACE = resolve(importerDir, '../..');

// ── Argument Parsing ──────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {
    urls: [],
    output: resolve(WORKSPACE, 'content'),
    dryRun: false,
    concurrency: 2,
    sourceDomain: 'https://jobs.army.mod.uk',
    verbose: false,
  };

  let i = 2; // skip node and script path
  while (i < argv.length) {
    const arg = argv[i];
    switch (arg) {
      case '--url':
        args.urls.push(argv[i + 1]);
        i += 2;
        break;
      case '--urls':
        i += 1;
        while (i < argv.length && !argv[i].startsWith('--')) {
          args.urls.push(argv[i]);
          i += 1;
        }
        break;
      case '--file': {
        const filePath = resolve(argv[i + 1]);
        const content = readFileSync(filePath, 'utf-8');
        content.split('\n').forEach((line) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) args.urls.push(trimmed);
        });
        i += 2;
        break;
      }
      case '--output':
        args.output = resolve(argv[i + 1]);
        i += 2;
        break;
      case '--dry-run':
        args.dryRun = true;
        i += 1;
        break;
      case '--concurrency':
        args.concurrency = parseInt(argv[i + 1], 10) || 2;
        i += 2;
        break;
      case '--source-domain':
        args.sourceDomain = argv[i + 1];
        i += 2;
        break;
      case '--verbose':
        args.verbose = true;
        i += 1;
        break;
      default:
        // Treat bare arguments as URLs
        if (arg.startsWith('http')) {
          args.urls.push(arg);
        }
        i += 1;
    }
  }

  return args;
}

// ── URL → File Path ───────────────────────────────────────────────────

/**
 * Convert a URL to a local file path within the content directory.
 *
 * Examples:
 *   https://jobs.army.mod.uk/            → content/index.plain.html
 *   https://jobs.army.mod.uk/army-reserve/ → content/army-reserve.plain.html
 *   https://jobs.army.mod.uk/how-to-join/ → content/how-to-join.plain.html
 *
 * @param {string} url
 * @param {string} outputDir
 * @returns {string} absolute file path
 */
function urlToFilePath(url, outputDir) {
  const urlObj = new URL(url);
  let pathname = urlObj.pathname.replace(/\/$/, '') || '/index';

  // Remove leading slash
  pathname = pathname.replace(/^\//, '');

  // If empty after cleanup, it's the homepage
  if (!pathname) pathname = 'index';

  // Remove .html extension if present
  pathname = pathname.replace(/\.html$/, '');

  // Convert path segments to filename
  // e.g., "army-reserve" stays "army-reserve"
  // e.g., "how-to-join/step-1" becomes "how-to-join/step-1"
  const filePath = resolve(outputDir, `${pathname}.plain.html`);

  return filePath;
}

// ── Concurrent Task Runner ────────────────────────────────────────────

function runConcurrent(tasks, concurrency) {
  const results = [];
  let idx = 0;

  const run = () => {
    if (idx >= tasks.length) return Promise.resolve();
    const current = idx;
    idx += 1;
    const p = tasks[current]().then((val) => {
      results[current] = { status: 'fulfilled', value: val };
    }).catch((err) => {
      results[current] = { status: 'rejected', reason: err };
    });
    return p.then(() => run());
  };

  const workers = Array.from(
    { length: Math.min(concurrency, tasks.length) },
    () => run(),
  );

  return Promise.all(workers).then(() => results);
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv);

  // If no URLs specified, use all URLs from page-templates.json
  if (args.urls.length === 0) {
    const { templates } = loadTemplates();
    templates.forEach((template) => {
      template.urls.forEach((url) => {
        // Ensure full URL
        const fullUrl = url.startsWith('http') ? url : `${args.sourceDomain}${url}`;
        args.urls.push(fullUrl);
      });
    });
  }

  const uniqueUrls = [...new Set(args.urls)];

  console.log('\n=== Bulk Import ===');
  console.log(`URLs to import: ${uniqueUrls.length}`);
  console.log(`Output directory: ${args.output}`);
  console.log(`Concurrency: ${args.concurrency}`);
  console.log(`Dry run: ${args.dryRun}\n`);

  if (args.dryRun) {
    console.log('Would import:');
    uniqueUrls.forEach((url) => {
      const filePath = urlToFilePath(url, args.output);
      console.log(`  ${url} → ${filePath}`);
    });
    return;
  }

  // Ensure output directory exists
  mkdirSync(args.output, { recursive: true });

  const tasks = uniqueUrls.map((url) => async () => {
    const startTime = Date.now();
    try {
      console.log(`[IMPORTING] ${url}`);

      const result = await importPage(url, {
        sourceDomain: args.sourceDomain,
      });

      const filePath = urlToFilePath(url, args.output);
      const fileDir = dirname(filePath);
      mkdirSync(fileDir, { recursive: true });

      writeFileSync(filePath, result.html, 'utf-8');

      const elapsed = Date.now() - startTime;
      console.log(`[OK] ${url} → ${filePath} (${elapsed}ms, template: ${result.template || 'none'})`);

      return {
        url, filePath, template: result.template, success: true,
      };
    } catch (err) {
      const elapsed = Date.now() - startTime;
      console.error(`[FAIL] ${url} (${elapsed}ms): ${err.message}`);
      if (args.verbose) console.error(err.stack);
      return { url, success: false, error: err.message };
    }
  });

  const results = await runConcurrent(tasks, args.concurrency);

  // Summary
  const succeeded = results.filter(
    (r) => r.status === 'fulfilled' && r.value.success,
  );
  const failed = results.filter(
    (r) => r.status === 'rejected'
      || (r.status === 'fulfilled' && !r.value.success),
  );

  console.log('\n=== Import Summary ===');
  console.log(`Succeeded: ${succeeded.length}/${uniqueUrls.length}`);
  if (failed.length > 0) {
    console.log(`Failed: ${failed.length}`);
    failed.forEach((r) => {
      const val = r.status === 'fulfilled'
        ? r.value
        : { url: 'unknown', error: r.reason?.message };
      console.log(`  - ${val.url}: ${val.error}`);
    });
  }
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
