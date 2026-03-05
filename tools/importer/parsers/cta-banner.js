/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cta-banner block
 *
 * Source: https://jobs.army.mod.uk/army-reserve/
 * Base Block: cta-banner
 *
 * Handles single-column CtaBar sections (full-width CTA banner)
 *
 * Source HTML Pattern:
 * <section class="CtaBar_ctaBar__...">
 *   <div class="Keyline_keyline__...">
 *     <h3 class="Keyline_text__...">Ready for the next step?</h3>
 *   </div>
 *   <div class="CtaBar_inner__...">
 *     <div class="CtaBar_column__...">
 *       <p>Start your application today</p>
 *       <div class="CtaBar_ctas__...">
 *         <a class="CtaBar_cta__..." href="/apply/">Apply now</a>
 *       </div>
 *     </div>
 *   </div>
 * </section>
 *
 * Block Structure:
 * - Single row: Heading/text + CTA link
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  // Extract heading from column content or keyline
  const columnTitle = element.querySelector('[class*="CtaBar_column"] h3, [class*="CtaBar_column"] p');
  const keylineTitle = element.querySelector('[class*="Keyline_text"]');

  // Extract CTA link
  const cta = element.querySelector('[class*="CtaBar_cta"] a, [class*="CtaBar_ctas"] a, a[href]');

  // Build content cell
  const contentCell = document.createElement('div');

  // Use column text as heading, or fall back to keyline title
  const headingText = columnTitle
    ? columnTitle.textContent.trim()
    : keylineTitle
      ? keylineTitle.textContent.trim()
      : '';

  if (headingText) {
    const h3 = document.createElement('h3');
    h3.textContent = headingText;
    contentCell.appendChild(h3);
  }

  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.href || cta.getAttribute('href');
    a.textContent = cta.textContent.trim();
    p.appendChild(a);
    contentCell.appendChild(p);
  }

  const cells = [[contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'CTA Banner', cells });
  element.replaceWith(block);
}
