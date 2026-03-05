/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel block
 *
 * Source: https://jobs.army.mod.uk/army-reserve/
 * Base Block: carousel
 *
 * Handles two carousel types:
 * 1. CenteredCarousel (Meet/Learn/Grow/Explore) - image + title + description
 * 2. SocialCarousel (Our Reservists) - portrait image + video link
 *
 * Source HTML Pattern (CenteredCarousel):
 * <section class="CenteredCarousel_centeredCarousel__...">
 *   <div class="CenteredCarouselCard_card__...">
 *     <div class="CenteredCarouselCard_videoContainer__...">
 *       <picture>...<img src="..." alt="..."></picture>
 *     </div>
 *     <div class="CenteredCarouselCard_content__...">
 *       <h3 class="CenteredCarouselCard_title__...">Meet</h3>
 *       <p>Description text...</p>
 *     </div>
 *   </div>
 * </section>
 *
 * Source HTML Pattern (SocialCarousel):
 * <section class="SocialCarousel_centeredCarousel__...">
 *   <div class="SocialCarouselCard_card__...">
 *     <div class="SocialCarouselCard_videoContainer__...">
 *       <picture>...<img src="..." alt="..."></picture>
 *     </div>
 *   </div>
 * </section>
 *
 * Block Structure (per slide):
 * - Column 1: Image
 * - Column 2: Content (title + description + optional CTA/link)
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect carousel type
  const isSocialCarousel = element.querySelector('[class*="SocialCarousel"]') !== null
    || element.className.includes('SocialCarousel');

  // Get all slide cards (excluding slick clones)
  const cardSelector = isSocialCarousel
    ? '[class*="SocialCarouselCard_card"]:not(.slick-cloned *)'
    : '[class*="CenteredCarouselCard_card"]:not(.slick-cloned *)';

  let cards = Array.from(element.querySelectorAll(cardSelector));

  // Deduplicate by checking for slick-cloned parent
  cards = cards.filter((card) => !card.closest('.slick-cloned'));

  // Remove duplicates by content (slick creates clones)
  const seen = new Set();
  cards = cards.filter((card) => {
    const key = card.textContent.trim().substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  cards.forEach((card) => {
    // Extract image
    const picture = card.querySelector('picture');
    const img = picture ? picture.querySelector('img') : card.querySelector('img');

    // Extract content
    const title = card.querySelector(
      '[class*="title"], h3, h4'
    );
    const description = card.querySelector(
      '[class*="content"] p, [class*="description"]'
    );

    // Extract CTA/link
    const cta = card.querySelector('a[href]');

    // Build image cell
    const imageCell = document.createElement('div');
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src || img.getAttribute('src');
      imgEl.alt = img.alt || '';
      imageCell.appendChild(imgEl);
    }

    // Build content cell
    const contentCell = document.createElement('div');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      contentCell.appendChild(h3);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      contentCell.appendChild(p);
    }
    if (cta) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href || cta.getAttribute('href');
      a.textContent = cta.textContent.trim() || 'Play Video';
      p.appendChild(a);
      contentCell.appendChild(p);
    }

    cells.push([imageCell, contentCell]);
  });

  const variantName = isSocialCarousel ? 'Carousel (social)' : 'Carousel (slick)';
  const block = WebImporter.Blocks.createBlock(document, { name: variantName, cells });
  element.replaceWith(block);
}
