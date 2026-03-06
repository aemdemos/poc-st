#!/usr/bin/env node

/**
 * Single Page Import Script
 *
 * Quick import of a single URL to EDS content.
 *
 * Usage:
 *   node tools/importer/import-single.js https://jobs.army.mod.uk/army-reserve/
 *   node tools/importer/import-single.js https://jobs.army.mod.uk/ --output content/index.plain.html
 *   node tools/importer/import-single.js URL --stdout    # Print HTML to stdout instead of writing
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { importPage } from './import-engine.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE = resolve(__dirname, '../..');

function main() {
  const url = process.argv[2];
  if (!url || url.startsWith('--')) {
    console.error('Usage: node import-single.js <URL> [--output FILE] [--stdout]');
    process.exit(1);
  }

  const toStdout = process.argv.includes('--stdout');
  const outputIdx = process.argv.indexOf('--output');
  let outputPath = null;

  if (outputIdx !== -1 && process.argv[outputIdx + 1]) {
    outputPath = resolve(process.argv[outputIdx + 1]);
  }

  // Derive output path from URL if not specified
  if (!outputPath && !toStdout) {
    const urlObj = new URL(url);
    let pathname = urlObj.pathname.replace(/\/$/, '') || '/index';
    pathname = pathname.replace(/^\//, '').replace(/\.html$/, '');
    if (!pathname) pathname = 'index';
    outputPath = resolve(WORKSPACE, 'content', `${pathname}.plain.html`);
  }

  importPage(url, {
    sourceDomain: new URL(url).origin,
  }).then((result) => {
    if (toStdout) {
      process.stdout.write(result.html);
    } else {
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, result.html, 'utf-8');
      console.log(`Imported: ${url}`);
      console.log(`Template: ${result.template || '(no match)'}`);
      console.log(`Output:   ${outputPath}`);
      console.log(`Metadata: ${JSON.stringify(result.metadata, null, 2)}`);
    }
  }).catch((err) => {
    console.error(`Import failed: ${err.message}`);
    process.exit(1);
  });
}

main();
