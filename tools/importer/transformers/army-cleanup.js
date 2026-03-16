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

      // Overseas visitor geo-notification banner
      '[class*="GeoNotification"]',
      '[class*="geoNotification"]',
      '[class*="InternationalBanner"]',
      '[class*="internationalBanner"]',
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

    // Decode Cloudflare email-protected links
    // Cloudflare encodes emails as /cdn-cgi/l/email-protection#HEX where the
    // first byte is the XOR key and subsequent bytes are the encoded email.
    element.querySelectorAll('a[href*="/cdn-cgi/l/email-protection"]').forEach((link) => {
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
        const text = link.textContent || '';
        if (text.includes('[email') || text.includes('email\u00a0protected')) {
          link.textContent = email;
        }
      }
    });
  }

  if (hookName === 'afterTransform') {
    // Remove iframes after parsers have extracted needed data (e.g., Google Maps URLs)
    element.querySelectorAll('iframe').forEach((el) => {
      el.remove();
    });

    // Remove overseas visitor banner content by text pattern
    // The geo-banner produces: <p>!</p> <h2>It looks like you're visiting...</h2> <p>guidance text</p> <p>×</p>
    // Class-based removal in beforeTransform may not catch it if classes vary.
    element.querySelectorAll('h2').forEach((h2) => {
      const text = h2.textContent.trim().toLowerCase();
      if (text.includes('visiting our site from overseas') || text.includes('visiting from overseas')) {
        // Remove the guidance paragraph that follows the heading
        let next = h2.nextElementSibling;
        while (next && next.tagName === 'P') {
          const toRemove = next;
          next = next.nextElementSibling;
          toRemove.remove();
        }
        h2.remove();
      }
    });

    // Remove stray single-character paragraphs (artifacts from cookie consent / geo-banner dismiss)
    element.querySelectorAll('p').forEach((p) => {
      const text = p.textContent.trim();
      if (text === '"' || text === '×' || text === '!') {
        p.remove();
      }
    });

    // Remove tracking pixel images (Twitter, DoubleClick, analytics, etc.)
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (
        src.includes('t.co/i/adsct')
        || src.includes('analytics.twitter.com')
        || src.includes('doubleclick.net')
        || src.includes('facebook.com/tr')
        || src.includes('google-analytics.com')
        || src.includes('sc-static.net')
        || src.includes('tr.snapchat.com')
      ) {
        const parent = img.parentNode;
        img.remove();
        // Remove parent <p> if it's now empty (only whitespace)
        if (parent && parent.tagName === 'P' && !parent.textContent.trim()) {
          parent.remove();
        }
      }
    });
  }
}
