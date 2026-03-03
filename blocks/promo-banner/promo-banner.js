/**
 * Promo Banner Block
 *
 * Image/GIF + text + CTA horizontal layout.
 * Dark background text panel with white heading, description, and outlined button.
 *
 * Authored as:
 *   | Promo Banner |
 *   |--------------|
 *   | image | text |
 *
 * Row 1: two columns — left = image, right = heading + paragraph + link/button
 */
export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cols = [...row.children];
  if (cols.length >= 2) {
    cols[0].classList.add('promo-banner-image');
    cols[1].classList.add('promo-banner-text');
  } else if (cols.length === 1) {
    // Single column: check if it contains an image
    const img = cols[0].querySelector('img');
    if (img) {
      cols[0].classList.add('promo-banner-image');
    } else {
      cols[0].classList.add('promo-banner-text');
    }
  }
}
