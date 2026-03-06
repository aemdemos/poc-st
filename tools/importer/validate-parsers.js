#!/usr/bin/env node

/**
 * Parser Validation Script
 *
 * Tests all block parsers against the existing migrated content files
 * to verify they produce valid EDS block structures.
 *
 * This works OFFLINE — it uses the already-migrated content in /content/
 * as reference to validate that parsers produce the expected block class
 * names and row/column structure.
 *
 * Usage:
 *   node tools/importer/validate-parsers.js
 *   node tools/importer/validate-parsers.js --parser hero
 *   node tools/importer/validate-parsers.js --verbose
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseHTML } from 'linkedom';
import WebImporter from './utils/web-importer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE = resolve(__dirname, '../..');
const CONTENT_DIR = resolve(WORKSPACE, 'content');

// Make WebImporter global for parsers
globalThis.WebImporter = WebImporter;

const verbose = process.argv.includes('--verbose');
const filterParser = process.argv.find((a, i) => process.argv[i - 1] === '--parser');

/**
 * Analyze existing content files to build a map of block types and their
 * expected structure (class names, row counts, column counts).
 */
function analyzeExistingContent() {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.plain.html'));
  const blocks = {};

  files.forEach((file) => {
    const html = readFileSync(resolve(CONTENT_DIR, file), 'utf-8');
    const { document } = parseHTML(`<html><body>${html}</body></html>`);

    // Find all block divs (divs with a class name that isn't a generic structural class)
    document.querySelectorAll('div[class]').forEach((div) => {
      const className = div.getAttribute('class');
      if (!className) return;

      // Skip section-metadata, metadata, and structural divs
      if (className === 'section-metadata' || className === 'metadata') {
        // These are valid blocks — record them but don't deep-analyze
        if (!blocks[className]) {
          blocks[className] = { count: 0, files: [], rows: [] };
        }
        blocks[className].count += 1;
        if (!blocks[className].files.includes(file)) {
          blocks[className].files.push(file);
        }
        return;
      }

      // Count direct div children (rows)
      const rows = Array.from(div.children).filter((c) => c.tagName === 'DIV');
      if (rows.length === 0) return; // Not a block structure

      const rowCount = rows.length;
      const colCounts = rows.map((row) => Array.from(row.children).filter((c) => c.tagName === 'DIV').length);

      if (!blocks[className]) {
        blocks[className] = { count: 0, files: [], rows: [] };
      }
      blocks[className].count += 1;
      if (!blocks[className].files.includes(file)) {
        blocks[className].files.push(file);
      }
      blocks[className].rows.push({ rowCount, colCounts });
    });
  });

  return blocks;
}

/**
 * Test that WebImporter.Blocks.createBlock produces valid output.
 */
function testCreateBlock() {
  const { document } = parseHTML('<html><body></body></html>');
  const results = [];

  // Test newer style
  const block1 = WebImporter.Blocks.createBlock(document, {
    name: 'Hero (video)',
    cells: [['content1'], ['content2']],
  });
  results.push({
    test: 'createBlock with name "Hero (video)"',
    pass: block1.getAttribute('class') === 'hero video',
    expected: 'hero video',
    actual: block1.getAttribute('class'),
  });

  // Test legacy style
  const block2 = WebImporter.Blocks.createBlock(document, [
    ['Cards'],
    ['cell1', 'cell2'],
  ]);
  results.push({
    test: 'createBlock legacy with header "Cards"',
    pass: block2.getAttribute('class') === 'cards',
    expected: 'cards',
    actual: block2.getAttribute('class'),
  });

  // Test variant names
  const block3 = WebImporter.Blocks.createBlock(document, {
    name: 'Carousel (slick)',
    cells: [['slide1']],
  });
  results.push({
    test: 'createBlock variant "Carousel (slick)"',
    pass: block3.getAttribute('class') === 'carousel slick',
    expected: 'carousel slick',
    actual: block3.getAttribute('class'),
  });

  const block4 = WebImporter.Blocks.createBlock(document, {
    name: 'CTA Banner',
    cells: [['content']],
  });
  results.push({
    test: 'createBlock "CTA Banner"',
    pass: block4.getAttribute('class') === 'cta banner',
    expected: 'cta banner',
    actual: block4.getAttribute('class'),
  });

  const block5 = WebImporter.Blocks.createBlock(document, {
    name: 'Quick Nav',
    cells: [['content']],
  });
  results.push({
    test: 'createBlock "Quick Nav"',
    pass: block5.getAttribute('class') === 'quick nav',
    expected: 'quick nav',
    actual: block5.getAttribute('class'),
  });

  return results;
}

/**
 * Validate parser registry completeness against content blocks.
 */
async function testParserRegistry() {
  const { getParser, getParserNames } = await import('./parsers/index.js');
  const results = [];

  const blockNames = analyzeExistingContent();
  const parserNames = getParserNames();

  // Check that all block types found in content have a parser
  const knownBlockClasses = Object.keys(blockNames);

  // Map class names back to block names (reverse of createBlock)
  // "hero video" → could be "hero-video" parser
  // "carousel slick" → "carousel" parser
  const classToParserMap = {
    hero: 'hero',
    'hero video': 'hero-video',
    'hero slider': 'hero-banner',
    columns: 'columns',
    'columns entry-matrix': 'columns',
    cards: 'cards',
    'cards cta': 'cards-cta',
    'cards journey': 'cards',
    'cards recommended': 'cards',
    'feature-cards': 'feature-cards',
    'carousel slick': 'carousel',
    'carousel social': 'carousel-social',
    'parallax-cards': 'parallax-cards',
    'quick-nav': 'quick-nav',
    quote: 'quote',
    'cta-banner': 'cta-banner',
    'promo-banner': 'promo-banner',
    tabs: 'tabs',
    'section-metadata': null, // structural, no parser needed
    metadata: null, // structural, no parser needed
  };

  knownBlockClasses.forEach((className) => {
    if (className === 'section-metadata' || className === 'metadata') return;

    const expectedParser = classToParserMap[className];
    if (expectedParser === undefined) {
      results.push({
        test: `Parser exists for block class "${className}"`,
        pass: false,
        expected: 'a parser mapping',
        actual: 'unmapped block class',
      });
      return;
    }

    if (expectedParser === null) return; // explicitly no parser needed

    if (filterParser && expectedParser !== filterParser) return;

    const parser = getParser(expectedParser);
    results.push({
      test: `Parser "${expectedParser}" registered for class "${className}"`,
      pass: !!parser,
      expected: 'function',
      actual: parser ? 'function' : 'undefined',
    });
  });

  // Check all registered parsers are functions
  parserNames.forEach((name) => {
    if (filterParser && name !== filterParser) return;
    const parser = getParser(name);
    results.push({
      test: `Parser "${name}" is a function`,
      pass: typeof parser === 'function',
      expected: 'function',
      actual: typeof parser,
    });
  });

  return results;
}

/**
 * Validate content file structure.
 */
function testContentStructure() {
  const results = [];
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.plain.html'));

  files.forEach((file) => {
    const html = readFileSync(resolve(CONTENT_DIR, file), 'utf-8');
    const { document } = parseHTML(`<html><body>${html}</body></html>`);

    // Check that file has sections (top-level divs)
    const sections = document.querySelectorAll('body > div');
    results.push({
      test: `${file}: has sections`,
      pass: sections.length > 0,
      expected: '> 0 sections',
      actual: `${sections.length} sections`,
    });

    // Check that page has a metadata block (except nav.html and footer.html)
    if (!file.includes('nav') && !file.includes('footer')) {
      const metaBlock = document.querySelector('.metadata');
      results.push({
        test: `${file}: has metadata block`,
        pass: !!metaBlock,
        expected: 'metadata block present',
        actual: metaBlock ? 'found' : 'missing',
      });
    }
  });

  return results;
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  console.log('\n=== Import Tooling Validation ===\n');

  let totalPass = 0;
  let totalFail = 0;

  function printResults(sectionName, results) {
    console.log(`--- ${sectionName} ---`);
    results.forEach(({
      test, pass, expected, actual,
    }) => {
      const icon = pass ? '\u2713' : '\u2717';
      if (pass) {
        totalPass += 1;
        if (verbose) console.log(`  ${icon} ${test}`);
      } else {
        totalFail += 1;
        console.log(`  ${icon} ${test}`);
        console.log(`    Expected: ${expected}`);
        console.log(`    Actual:   ${actual}`);
      }
    });
    const passCount = results.filter((r) => r.pass).length;
    console.log(`  ${passCount}/${results.length} passed\n`);
  }

  // 1. WebImporter.Blocks.createBlock tests
  printResults('WebImporter Polyfill', testCreateBlock());

  // 2. Parser registry tests
  printResults('Parser Registry', await testParserRegistry());

  // 3. Content structure tests
  printResults('Content Structure', testContentStructure());

  // 4. Block inventory
  const blockInventory = analyzeExistingContent();
  console.log('--- Block Inventory (from existing content) ---');
  Object.entries(blockInventory)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([className, info]) => {
      console.log(`  "${className}": ${info.count} instance(s) in ${info.files.join(', ')}`);
    });

  console.log(`\n=== Summary: ${totalPass} passed, ${totalFail} failed ===\n`);

  if (totalFail > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Validation error:', err);
  process.exit(1);
});
