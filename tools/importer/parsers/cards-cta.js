/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards (cta) block
 *
 * Source: https://jobs.army.mod.uk/army-reserve/
 * Base Block: cards (cta variant)
 *
 * Handles CtaBar sections with multiple columns (3-column "Need to know" cards)
 *
 * Source HTML Pattern:
 * <section class="CtaBar_ctaBar__...">
 *   <div class="Keyline_keyline__...">
 *     <h3 class="Keyline_text__...">Need to know</h3>
 *   </div>
 *   <div class="CtaBar_inner__...">
 *     <div class="CtaBar_column__...">
 *       <h3>Available Roles</h3>
 *       <p>Description...</p>
 *       <div class="CtaBar_ctas__...">
 *         <a class="CtaBar_cta__..." href="...">Reservist Roles</a>
 *       </div>
 *     </div>
 *     <!-- more columns -->
 *   </div>
 * </section>
 *
 * Block Structure (per card):
 * - Column 1: Empty (no image for CTA cards)
 * - Column 2: Title + description + CTA link
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all column entries
  const columns = Array.from(element.querySelectorAll('[class*="CtaBar_column"]'));

  columns.forEach((col) => {
    // Extract title
    const title = col.querySelector('h3, h2');

    // Extract description (first p that isn't inside ctas)
    const desc = col.querySelector('p:not([class*="cta"])');

    // Extract CTA link
    const cta = col.querySelector('[class*="CtaBar_cta"] a, [class*="CtaBar_ctas"] a, a[href]');

    // Build empty image cell (CTA cards have no image)
    const imageCell = document.createElement('div');

    // Build content cell
    const contentCell = document.createElement('div');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      contentCell.appendChild(h3);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentCell.appendChild(p);
    }
    if (cta) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href || cta.getAttribute('href');
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      contentCell.appendChild(p);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards (cta)', cells });
  element.replaceWith(block);
}
