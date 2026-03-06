/**
 * DOM Utility Functions for Import Scripts
 *
 * Shared helpers used by parsers, transformers, and the import pipeline.
 * Works with both browser DOM and jsdom/linkedom.
 */

/**
 * Create a section-metadata block with key/value pairs.
 * @param {Document} document
 * @param {Object} meta - e.g. { style: 'olive' }
 * @returns {Element}
 */
export function createSectionMetadata(document, meta) {
  const block = document.createElement('div');
  block.setAttribute('class', 'section-metadata');

  Object.entries(meta).forEach(([key, value]) => {
    const row = document.createElement('div');
    const keyCell = document.createElement('div');
    keyCell.textContent = key;
    const valCell = document.createElement('div');
    valCell.textContent = value;
    row.appendChild(keyCell);
    row.appendChild(valCell);
    block.appendChild(row);
  });

  return block;
}

/**
 * Create a page metadata block.
 * @param {Document} document
 * @param {Object} meta - e.g. { title: '...', description: '...', image: '...' }
 * @returns {Element}
 */
export function createMetadataBlock(document, meta) {
  const block = document.createElement('div');
  block.setAttribute('class', 'metadata');

  Object.entries(meta).forEach(([key, value]) => {
    if (!value) return;
    const row = document.createElement('div');
    const keyCell = document.createElement('div');
    keyCell.textContent = key;
    const valCell = document.createElement('div');
    valCell.textContent = value;
    row.appendChild(keyCell);
    row.appendChild(valCell);
    block.appendChild(row);
  });

  return block;
}

/**
 * Create a section wrapper <div> that can hold blocks and section-metadata.
 * @param {Document} document
 * @returns {Element}
 */
export function createSection(document) {
  return document.createElement('div');
}

/**
 * Extract text content from an element, trimmed.
 * @param {Element|null} el
 * @returns {string}
 */
export function getText(el) {
  return el ? el.textContent.trim() : '';
}

/**
 * Create an image element from a source img, preserving src and alt.
 * @param {Document} document
 * @param {Element} img - source <img> element
 * @returns {Element|null}
 */
export function createImg(document, img) {
  if (!img) return null;
  const el = document.createElement('img');
  el.src = img.src || img.getAttribute('src') || '';
  el.alt = img.alt || img.getAttribute('alt') || '';
  return el;
}

/**
 * Create a <picture> element with <source> and <img>.
 * @param {Document} document
 * @param {string} src - image URL
 * @param {string} alt - alt text
 * @returns {Element}
 */
export function createPicture(document, src, alt = '') {
  const picture = document.createElement('picture');

  const source1 = document.createElement('source');
  source1.setAttribute('srcset', src);
  picture.appendChild(source1);

  const source2 = document.createElement('source');
  source2.setAttribute('srcset', src);
  source2.setAttribute('media', '(min-width: 600px)');
  picture.appendChild(source2);

  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.setAttribute('loading', 'lazy');
  picture.appendChild(img);

  return picture;
}

/**
 * Create a link wrapped in a paragraph (EDS button pattern).
 * @param {Document} document
 * @param {string} href
 * @param {string} text
 * @param {'default'|'primary'|'secondary'} variant
 * @returns {Element}
 */
export function createButtonLink(document, href, text, variant = 'default') {
  const p = document.createElement('p');
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;

  if (variant === 'primary') {
    const strong = document.createElement('strong');
    strong.appendChild(a);
    p.appendChild(strong);
  } else if (variant === 'secondary') {
    const em = document.createElement('em');
    em.appendChild(a);
    p.appendChild(em);
  } else {
    p.appendChild(a);
  }

  return p;
}

/**
 * Extract page metadata from <head> meta tags.
 * @param {Document} document
 * @returns {Object}
 */
export function extractPageMetadata(document) {
  const get = (name) => {
    const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return el ? el.getAttribute('content') || '' : '';
  };

  return {
    title: get('title') || get('og:title') || document.title || '',
    description: get('description') || get('og:description') || '',
    image: get('og:image') || '',
  };
}

/**
 * Resolve a relative URL against a base URL.
 * @param {string} url
 * @param {string} base
 * @returns {string}
 */
export function resolveUrl(url, base) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }
  try {
    return new URL(url, base).href;
  } catch {
    return url;
  }
}

/**
 * Convert absolute URLs from the source domain to relative paths.
 * @param {string} html - HTML string
 * @param {string} sourceDomain - e.g. 'https://jobs.army.mod.uk'
 * @returns {string}
 */
export function relativizeUrls(html, sourceDomain) {
  if (!sourceDomain) return html;
  const escaped = sourceDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(escaped, 'g'), '');
}
