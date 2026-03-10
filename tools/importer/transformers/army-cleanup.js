/**
 * Army Cleanup Transformer
 *
 * DOM transformer for site-wide cleanup during import.
 * Uses standard transformer hook pattern (beforeTransform / afterTransform).
 *
 * beforeTransform:
 * - Removes cookie consent, chat widget, header/nav, footer, overlays,
 *   Next.js internals, scripts, and slick duplicates
 * - Preserves iframes so block parsers can extract embedded content (maps, etc.)
 *
 * afterTransform:
 * - Removes remaining iframes after parsers have extracted needed data
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    const selectorsToRemove = [
      // Cookie consent
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '[class*="OneTrust"]',

      // Chat widget (Meetami)
      '[class*="AmiChat"]',
      '[id*="ami-chat"]',
      '#callbackCover',
      '#srLaunch',
      '#srUnreadCount',
      '#srContent',
      '#srRecordMobileUx',
      '#srCloseOverlay',
      '#srCloseTrigger',
      '#srChatter',
      '.ami-icon',
      '[href*="meetami"]',
      '[src*="meetami.ai"]',
      '[href="#min"]',
      '[href="#chat"]',
      '[href="#close"]',
      'audio',

      // Navigation / Header
      'header',
      'nav',
      '[class*="Header_header"]',
      '[class*="Navigation"]',

      // Footer
      'footer',
      '[class*="Footer"]',

      // Page overlay / loading / mobile menu portal
      '[class*="PageOverlay"]',
      '[class*="pageOverlay"]',
      '[class*="MobileMenuPortal"]',

      // Next.js internals
      '#__next-route-announcer__',
      '[aria-live="assertive"]',

      // Scripts (but NOT iframes — parsers may need them)
      'script',
      'noscript',

      // Breadcrumb decorators (visual dot separators)
      '[class*="navDecorator"]',

      // Slick cloned slides (duplicates)
      '.slick-cloned',
    ];

    selectorsToRemove.forEach((selector) => {
      element.querySelectorAll(selector).forEach((el) => {
        el.remove();
      });
    });

    // Remove breadcrumb list items that don't contain a link (current-page indicators)
    // Original site only displays linked breadcrumb items
    element.querySelectorAll('[class*="Breadcrumbs_breadcrumbs"] li').forEach((li) => {
      if (!li.querySelector('a')) {
        li.remove();
      }
    });
  }

  if (hookName === 'afterTransform') {
    // Remove iframes after parsers have extracted needed data (e.g., Google Maps URLs)
    element.querySelectorAll('iframe').forEach((el) => {
      el.remove();
    });
  }
}
