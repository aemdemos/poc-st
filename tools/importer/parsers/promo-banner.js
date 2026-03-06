/* global WebImporter */

/**
 * Parser for promo-banner block
 *
 * Source: https://jobs.army.mod.uk/how-to-join/, /regular-army/
 * Base Block: promo-banner
 *
 * Handles promotional banner sections with an image/GIF and text content.
 * Typically a horizontal layout: image on the left, dark text panel on the right.
 *
 * Source HTML Pattern:
 * <section class="PromoBanner_container__..." | class*="AnimatedBanner">
 *   <div class="PromoBanner_imageContainer__...">
 *     <picture>...<img src="promo.gif" alt="..."></picture>
 *   </div>
 *   <div class="PromoBanner_textContainer__...">
 *     <h2>Find your fit</h2>
 *     <p>Description text...</p>
 *     <a href="/how-to-join/find-your-fit/">Take the quiz</a>
 *   </div>
 * </section>
 *
 * Block Structure:
 * - Single row, two columns: image | text (heading + description + CTA)
 *
 * Generated: 2026-03-06
 */
export default function parse(element, { document }) {
  // Find the image
  const picture = element.querySelector('picture');
  const img = picture ? picture.querySelector('img') : element.querySelector('img');

  // Find text container
  const textContainer = element.querySelector(
    '[class*="PromoBanner_text"], [class*="textContainer"], [class*="AnimatedBanner_text"]',
  );
  const fallbackContainer = textContainer || element;

  // Extract heading
  const heading = fallbackContainer.querySelector('h2, h3, h4');

  // Extract description
  const desc = fallbackContainer.querySelector('p');

  // Extract CTA link
  const cta = fallbackContainer.querySelector('a[href]');

  // Build image cell
  const imageCell = document.createElement('div');
  if (img) {
    const imgEl = document.createElement('img');
    imgEl.src = img.src || img.getAttribute('src');
    imgEl.alt = img.alt || '';
    imageCell.appendChild(imgEl);
  }

  // Build text cell
  const textCell = document.createElement('div');
  if (heading) {
    const h = document.createElement(heading.tagName.toLowerCase());
    h.textContent = heading.textContent.trim();
    textCell.appendChild(h);
  }
  if (desc) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    textCell.appendChild(p);
  }
  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.href || cta.getAttribute('href');
    a.textContent = cta.textContent.trim();
    p.appendChild(a);
    textCell.appendChild(p);
  }

  const cells = [[imageCell, textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Promo Banner', cells });
  element.replaceWith(block);
}
