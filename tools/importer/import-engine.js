/**
 * Import Engine
 *
 * Core pipeline that converts a fetched HTML page into EDS-compatible
 * content HTML. Orchestrates: fetch → clean → match → parse → assemble → write.
 *
 * Works in Node.js using linkedom for DOM parsing.
 *
 * Usage:
 *   import { importPage } from './import-engine.js';
 *   const result = await importPage('https://jobs.army.mod.uk/army-reserve/');
 */

import { parseHTML } from 'linkedom';
import WebImporter from './utils/web-importer.js';
import { runAllCleanup } from './utils/cleanup.js';
import { matchTemplate, findBlockElements } from './utils/template-matcher.js';
import { getParser } from './parsers/index.js';
import {
  createSectionMetadata,
  createMetadataBlock,
  extractPageMetadata,
} from './utils/dom-utils.js';

// Make WebImporter available globally for parsers that reference it
globalThis.WebImporter = WebImporter;

/**
 * Section style mappings: maps source CSS class patterns to EDS section styles.
 * Used to detect background colors / visual treatments in source HTML and
 * translate them to section-metadata style values.
 */
const SECTION_STYLE_MAP = [
  { match: /breadcrumb/i, style: 'textured-beige' },
  { match: /campaign/i, style: 'campaign' },
  { match: /beige|sand|cream/i, style: 'beige' },
  { match: /olive|khaki/i, style: 'olive' },
  { match: /accent|orange|highlight/i, style: 'accent' },
  { match: /dark-green|darkgreen/i, style: 'dark-green' },
  { match: /dark(?!-green)/i, style: 'dark' },
  { match: /events?/i, style: 'events' },
  { match: /bronze|brown/i, style: 'bronze' },
  { match: /green(?!-)/i, style: 'green' },
  { match: /light|gray|grey/i, style: 'light' },
];

/**
 * Detect section style from element's class or parent classes.
 * @param {Element} element
 * @returns {string|null}
 */
function detectSectionStyle(element) {
  const classes = (element.className || '') + ' '
    + (element.parentElement ? element.parentElement.className || '' : '');

  for (const { match, style } of SECTION_STYLE_MAP) {
    if (match.test(classes)) return style;
  }

  // Check for inline background-color styles
  const bgStyle = element.getAttribute('style') || '';
  if (bgStyle.includes('background')) {
    // Simple heuristic — could be extended
    if (bgStyle.includes('#a19f7a') || bgStyle.includes('olive')) return 'olive';
    if (bgStyle.includes('#154228')) return 'dark-green';
    if (bgStyle.includes('#ff661c')) return 'accent';
    if (bgStyle.includes('#e5e2da')) return 'beige';
    if (bgStyle.includes('#15171a')) return 'dark';
  }

  return null;
}

/**
 * Detect if a section should be centered from class names.
 * @param {Element} element
 * @returns {boolean}
 */
function detectCentered(element) {
  const classes = (element.className || '').toLowerCase();
  return classes.includes('center') || classes.includes('align-center');
}

/**
 * Fetch a page's HTML content.
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchPage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; AEM-Importer/1.0)',
      Accept: 'text/html',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

/**
 * Parse HTML string into a DOM document.
 * @param {string} html
 * @returns {Document}
 */
function parseHtml(html) {
  const { document } = parseHTML(html);
  return document;
}

/**
 * Run block parsers on matched elements.
 *
 * @param {Document} document
 * @param {Array} blockMatches - from findBlockElements()
 */
function parseBlocks(document, blockMatches) {
  // Sort by DOM order (top to bottom) for consistent section assembly
  blockMatches.sort((a, b) => {
    const pos = a.element.compareDocumentPosition(b.element);
    // eslint-disable-next-line no-bitwise
    if (pos & 4) return -1; // a before b
    // eslint-disable-next-line no-bitwise
    if (pos & 2) return 1; // a after b
    return 0;
  });

  blockMatches.forEach(({ name, element, section }) => {
    const parser = getParser(name);

    try {
      const isDefaultContent = section === 'default-content' || name.startsWith('section-');
      if (isDefaultContent) {
        // Use a specific parser if registered (e.g. section-breadcrumb),
        // otherwise fall back to the generic default-content parser.
        const defaultParser = getParser('default-content');
        const chosen = parser !== defaultParser ? parser : defaultParser;
        chosen(element, { document });
      } else {
        // Run the block parser
        const result = parser(element, { document });
        // Legacy parsers return the block instead of replacing in-place
        if (result && result.nodeType && element.parentNode) {
          element.replaceWith(result);
        }
      }
    } catch (err) {
      console.error(`Parser error for block "${name}":`, err.message);
    }
  });
}

/**
 * Assemble the final EDS content HTML from parsed blocks.
 *
 * Creates the section structure with section-metadata and page metadata.
 *
 * @param {Document} document
 * @param {Array} blockMatches
 * @param {Object} pageMetadata
 * @returns {string} final HTML content
 */
function assembleContent(document, blockMatches, pageMetadata) {
  const output = document.createElement('div');

  // Group block matches by their parent section (closest containing element)
  const sections = [];
  const processedElements = new Set();

  blockMatches.forEach(({ name, element, section }) => {
    if (processedElements.has(element)) return;
    processedElements.add(element);

    // Detect section styling from the original element context
    const style = detectSectionStyle(element);
    const centered = detectCentered(element);

    let styleValue = style || '';
    if (centered && styleValue) {
      styleValue += ', centered';
    } else if (centered) {
      styleValue = 'centered';
    }

    sections.push({
      name,
      element,
      section,
      style: styleValue,
    });
  });

  // Build output: each block match becomes a section
  sections.forEach(({ element, style }) => {
    const sectionDiv = document.createElement('div');

    // The element has already been transformed by the parser in-place.
    // Clone only the matched element's children into the section
    // (not the parent's siblings, which may belong to other sections).
    Array.from(element.childNodes).forEach((node) => {
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        sectionDiv.appendChild(node.cloneNode(true));
      }
    });

    // Add section-metadata if there's a style
    if (style) {
      const meta = createSectionMetadata(document, { style });
      sectionDiv.appendChild(meta);
    }

    output.appendChild(sectionDiv);
  });

  // Add page metadata block as the final section
  if (pageMetadata && (pageMetadata.title || pageMetadata.description)) {
    const metaSection = document.createElement('div');
    const metaBlock = createMetadataBlock(document, pageMetadata);
    metaSection.appendChild(metaBlock);
    output.appendChild(metaSection);
  }

  return output.innerHTML;
}

/**
 * Import a single page and return EDS-compatible HTML.
 *
 * @param {string} url - the page URL to import
 * @param {Object} [options]
 * @param {string} [options.html] - pre-fetched HTML (skip fetch step)
 * @param {string} [options.sourceDomain] - source domain for URL normalization
 * @param {string} [options.templateName] - force a specific template instead of auto-matching
 * @returns {Promise<{html: string, metadata: Object, template: string|null, url: string}>}
 */
export async function importPage(url, options = {}) {
  const sourceDomain = options.sourceDomain || new URL(url).origin;

  // Step 1: Fetch or use provided HTML
  const rawHtml = options.html || await fetchPage(url);

  // Step 2: Parse into DOM
  const document = parseHtml(rawHtml);

  // Step 3: Extract page metadata BEFORE cleanup removes <head>
  const pageMetadata = extractPageMetadata(document);

  // Step 4: Run cleanup transformers
  runAllCleanup(document, { sourceDomain });

  // Step 5: Match template
  const template = options.templateName
    ? { name: options.templateName, blocks: [] }
    : matchTemplate(url);

  if (!template) {
    console.warn(`No template matched for URL: ${url}`);
    return {
      html: document.body ? document.body.innerHTML : '',
      metadata: pageMetadata,
      template: null,
      url,
    };
  }

  // Step 6: Find block elements using template selectors
  const blockMatches = findBlockElements(document, template);

  // Step 7: Run block parsers
  parseBlocks(document, blockMatches);

  // Step 8: Assemble final output
  const outputHtml = assembleContent(document, blockMatches, pageMetadata);

  return {
    html: outputHtml,
    metadata: pageMetadata,
    template: template.name,
    url,
  };
}

/**
 * Import a page and return just the HTML string (simplified API).
 *
 * @param {string} url
 * @param {Object} [options]
 * @returns {Promise<string>}
 */
export async function importPageHtml(url, options = {}) {
  const result = await importPage(url, options);
  return result.html;
}

export default { importPage, importPageHtml };
