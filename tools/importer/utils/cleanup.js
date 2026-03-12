/**
 * DOM Cleanup Utilities
 *
 * Pre-parsing cleanup functions that run before block parsers.
 * These are called by the import pipeline, NOT placed in the
 * transformers/ directory (which has its own validation).
 */

const SOURCE_DOMAIN = 'https://jobs.army.mod.uk';

/**
 * Remove unwanted elements from the DOM.
 * Mirrors the logic in transformers/army-cleanup.js but usable
 * directly in the Node.js import pipeline.
 *
 * @param {Document} document
 */
export function removeUnwantedElements(document) {
  const selectorsToRemove = [
    // Cookie consent
    '#onetrust-consent-sdk',
    '#onetrust-banner-sdk',
    '[class*="OneTrust"]',
    // Chat widget
    '[class*="AmiChat"]',
    '[id*="ami-chat"]',
    // Navigation / Header
    'header',
    'nav',
    '[class*="Header_header"]',
    '[class*="Navigation"]',
    // Footer
    'footer',
    '[class*="Footer"]',
    // Page overlay / loading
    '[class*="PageOverlay"]',
    '[class*="pageOverlay"]',
    // Next.js internals
    '#__next-route-announcer__',
    '[aria-live="assertive"]',
    // Scripts / iframes / noscript
    'iframe:not([src*="youtube"])',
    'script',
    'noscript',
    // Slick cloned slides (duplicates)
    '.slick-cloned',
    // Hidden elements
    '[aria-hidden="true"][class*="skip"]',
    '[style*="display: none"]',
    '[style*="display:none"]',
  ];

  selectorsToRemove.forEach((selector) => {
    try {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    } catch {
      // Selector might not be valid in all DOM implementations
    }
  });
}

/**
 * Normalize URLs: convert absolute source-domain URLs to relative paths.
 *
 * @param {Document} document
 * @param {string} [domain] - source domain to relativize
 */
export function normalizeUrls(document, domain = SOURCE_DOMAIN) {
  // Links
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith(domain)) {
      link.setAttribute('href', href.replace(domain, ''));
    }
  });

  // Images
  document.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (src.startsWith(domain)) {
      img.setAttribute('src', src.replace(domain, ''));
    }
  });

  // Source elements
  document.querySelectorAll('source[srcset]').forEach((source) => {
    const srcset = source.getAttribute('srcset') || '';
    if (srcset.startsWith(domain)) {
      source.setAttribute('srcset', srcset.replace(domain, ''));
    }
  });
}

/**
 * Normalize images: ensure all images have alt text and clean up
 * data attributes. Convert background images to inline where detectable.
 *
 * @param {Document} document
 */
export function normalizeImages(document) {
  document.querySelectorAll('img').forEach((img) => {
    // Ensure alt attribute exists
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
    }
    // Set lazy loading
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    // Remove data-* attributes that aren't needed
    Array.from(img.attributes).forEach((attr) => {
      if (attr.name.startsWith('data-') && attr.name !== 'data-src') {
        img.removeAttribute(attr.name);
      }
    });
  });
}

/**
 * Decode Cloudflare email-protected links.
 * Cloudflare encodes emails as /cdn-cgi/l/email-protection#HEX where the
 * first byte is the XOR key and subsequent bytes are the encoded email.
 *
 * @param {Document} document
 */
export function decodeCloudflareEmails(document) {
  document.querySelectorAll('a[href*="/cdn-cgi/l/email-protection"]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const hashIdx = href.indexOf('#');
    if (hashIdx === -1) return;

    const hex = href.slice(hashIdx + 1);
    if (hex.length < 4) return;

    const key = parseInt(hex.substring(0, 2), 16);
    let email = '';
    for (let i = 2; i < hex.length; i += 2) {
      email += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16) ^ key);
    }

    if (email.includes('@')) {
      link.setAttribute('href', `mailto:${email}`);
      // Replace placeholder text like "[email protected]"
      const text = link.textContent || '';
      if (text.includes('[email') || text.includes('email\u00a0protected')) {
        link.textContent = email;
      }
    }
  });
}

/**
 * Remove empty elements that add no value.
 *
 * @param {Document} document
 */
export function removeEmptyElements(document) {
  document.querySelectorAll('div, span, p').forEach((el) => {
    if (
      el.children.length === 0
      && !el.textContent.trim()
      && !el.querySelector('img, picture, video, iframe')
    ) {
      el.remove();
    }
  });
}

/**
 * Run all cleanup steps in the correct order.
 *
 * @param {Document} document
 * @param {Object} [options]
 * @param {string} [options.sourceDomain]
 */
export function runAllCleanup(document, options = {}) {
  const domain = options.sourceDomain || SOURCE_DOMAIN;
  removeUnwantedElements(document);
  decodeCloudflareEmails(document);
  normalizeUrls(document, domain);
  normalizeImages(document);
  removeEmptyElements(document);
}
