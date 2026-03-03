/**
 * CTA Banner Block
 *
 * Variants (controlled by block class name):
 *   cta-banner           — single column: heading + optional paragraph + button(s)
 *   cta-banner (dual)    — dual column: two side-by-side CTA columns
 *
 * Background colour is controlled via section metadata (accent, dark-green, dark, light, beige).
 *
 * Authored as a standard EDS block table:
 *   | CTA Banner |          |
 *   |------------|----------|
 *   | col-1      | col-2    |   ← one row = single CTA; two columns = dual CTA
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Detect dual-column layout: first row has 2+ children
  const firstRow = rows[0];
  const cols = firstRow ? [...firstRow.children] : [];

  if (cols.length >= 2) {
    block.classList.add('cta-banner-dual');
    cols.forEach((col) => col.classList.add('cta-banner-column'));
  } else {
    block.classList.add('cta-banner-single');
  }
}
