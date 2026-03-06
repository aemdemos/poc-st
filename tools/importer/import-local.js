#!/usr/bin/env node

/**
 * Local HTML Import Script
 *
 * Imports from local HTML files instead of fetching from the web.
 * Useful for development, testing, and when the source site is unreachable.
 *
 * Usage:
 *   node tools/importer/import-local.js scraped/army-reserve.html --url https://jobs.army.mod.uk/army-reserve/
 *   node tools/importer/import-local.js scraped/*.html --url-prefix https://jobs.army.mod.uk
 *
 * Options:
 *   --url URL               The original URL (for template matching)
 *   --url-prefix PREFIX     Base URL to prepend to filenames for matching
 *   --output DIR            Output directory (default: ./content)
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { importPage } from './import-engine.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE = resolve(__dirname, '../..');

function parseArgs(argv) {
  const args = {
    files: [],
    url: null,
    urlPrefix: 'https://jobs.army.mod.uk',
    output: resolve(WORKSPACE, 'content'),
  };

  let i = 2;
  while (i < argv.length) {
    const arg = argv[i];
    switch (arg) {
      case '--url':
        args.url = argv[i + 1];
        i += 2;
        break;
      case '--url-prefix':
        args.urlPrefix = argv[i + 1];
        i += 2;
        break;
      case '--output':
        args.output = resolve(argv[i + 1]);
        i += 2;
        break;
      default:
        if (!arg.startsWith('--')) {
          args.files.push(resolve(arg));
        }
        i += 1;
    }
  }

  return args;
}

function fileToUrl(filePath, urlPrefix) {
  const name = basename(filePath, extname(filePath));
  const slug = name === 'index' ? '' : name;
  return `${urlPrefix.replace(/\/$/, '')}/${slug}${slug ? '/' : ''}`;
}

function urlToOutputPath(url, outputDir) {
  const urlObj = new URL(url);
  let pathname = urlObj.pathname.replace(/\/$/, '') || '/index';
  pathname = pathname.replace(/^\//, '').replace(/\.html$/, '');
  if (!pathname) pathname = 'index';
  return resolve(outputDir, `${pathname}.plain.html`);
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.files.length === 0) {
    console.error('Usage: node import-local.js <html-file(s)> [--url URL] [--output DIR]');
    process.exit(1);
  }

  // Expand directories
  const htmlFiles = [];
  args.files.forEach((f) => {
    try {
      if (statSync(f).isDirectory()) {
        readdirSync(f)
          .filter((name) => name.endsWith('.html'))
          .forEach((name) => htmlFiles.push(resolve(f, name)));
      } else {
        htmlFiles.push(f);
      }
    } catch {
      htmlFiles.push(f);
    }
  });

  mkdirSync(args.output, { recursive: true });

  let successCount = 0;
  let failCount = 0;

  for (const file of htmlFiles) {
    const url = args.url || fileToUrl(file, args.urlPrefix);
    const html = readFileSync(file, 'utf-8');

    try {
      console.log(`[IMPORTING] ${file} (as ${url})`);

      const result = await importPage(url, {
        html,
        sourceDomain: new URL(url).origin,
      });

      const outputPath = urlToOutputPath(url, args.output);
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, result.html, 'utf-8');

      console.log(`[OK] → ${outputPath} (template: ${result.template || 'none'})`);
      successCount += 1;
    } catch (err) {
      console.error(`[FAIL] ${file}: ${err.message}`);
      failCount += 1;
    }
  }

  console.log(`\nDone: ${successCount} succeeded, ${failCount} failed`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
