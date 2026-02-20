/**
 * Army Cleanup Transformer
 *
 * DOM transformer for site-wide cleanup during import.
 * Runs before block parsing to remove unwanted elements
 * and normalize the DOM structure.
 *
 * Removes:
 * - OneTrust cookie consent banner
 * - Ami chat widget
 * - Header/Navigation
 * - Footer
 * - Page overlay/loading elements
 * - Next.js route announcer
 * - Iframes
 * - Script/noscript elements
 * - Empty spacer elements
 */
export default function armyCleanup(document) {
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

    // Scripts / iframes
    'iframe',
    'script',
    'noscript',

    // Slick cloned slides (duplicates)
    '.slick-cloned',
  ];

  selectorsToRemove.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.remove();
    });
  });
}
