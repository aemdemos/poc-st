/**
 * Template Matcher
 *
 * Matches a URL to the correct page template from page-templates.json,
 * then identifies which DOM elements correspond to each block.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let templatesCache = null;

/**
 * Load page templates from the JSON configuration.
 * @returns {Object} parsed templates
 */
export function loadTemplates() {
  if (templatesCache) return templatesCache;
  const path = resolve(__dirname, '..', 'page-templates.json');
  const raw = readFileSync(path, 'utf-8');
  templatesCache = JSON.parse(raw);
  return templatesCache;
}

/**
 * Match a URL to a template.
 *
 * @param {string} url - the page URL to match
 * @returns {Object|null} the matching template, or null
 */
export function matchTemplate(url) {
  const { templates } = loadTemplates();

  // Normalize URL for comparison
  const normalized = url.replace(/\/$/, '').replace(/^https?:\/\//, '');

  for (const template of templates) {
    for (const templateUrl of template.urls) {
      const normalizedTemplate = templateUrl.replace(/\/$/, '').replace(/^https?:\/\//, '');
      if (normalized === normalizedTemplate || normalized.endsWith(normalizedTemplate)) {
        return template;
      }
    }
  }

  // Partial match: check if the URL path matches any template URL path
  const urlPath = new URL(url).pathname.replace(/\/$/, '');
  for (const template of templates) {
    for (const templateUrl of template.urls) {
      try {
        const templatePath = new URL(templateUrl).pathname.replace(/\/$/, '');
        if (urlPath === templatePath) return template;
      } catch {
        // templateUrl might be a path, not a full URL
        const templatePath = templateUrl.replace(/\/$/, '');
        if (urlPath === templatePath) return template;
      }
    }
  }

  return null;
}

/**
 * Find DOM elements matching a template's block selectors.
 *
 * @param {Document} document - the parsed DOM document
 * @param {Object} template - template from page-templates.json
 * @returns {Array<{name: string, element: Element, section: string|undefined}>}
 */
export function findBlockElements(document, template) {
  const results = [];

  if (!template || !template.blocks) return results;

  for (const block of template.blocks) {
    for (const selector of block.instances) {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          results.push({
            name: block.name,
            element,
            section: block.section || null,
          });
        });
      } catch {
        // Invalid selector for this DOM implementation
        console.warn(`Selector failed: ${selector} for block ${block.name}`);
      }
    }
  }

  return results;
}
