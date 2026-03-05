/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://jobs.army.mod.uk/army-reserve/
 * Base Block: cards
 *
 * Handles VerticalParallaxCards section (simplified to cards):
 * 5 cards with image + title + description + CTA
 *
 * Source HTML Pattern:
 * <section class="VerticalParallaxCards_carouselContainer__...">
 *   <div class="VerticalParallaxCard_card__...">
 *     <div class="VerticalParallaxCard_cardImage__...">
 *       <picture>...<img src="..." alt="..."></picture>
 *     </div>
 *     <div class="VerticalParallaxCard_cardCopy__...">
 *       <h3>Your Time</h3>
 *       <p>Description...</p>
 *     </div>
 *     <div class="VerticalParallaxCard_cardCTA__...">
 *       <a href="...">CTA text</a>
 *     </div>
 *   </div>
 * </section>
 *
 * Block Structure (per card):
 * - Column 1: Image
 * - Column 2: Title + description + CTA link
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all card elements
  const cards = Array.from(element.querySelectorAll(
    '[class*="VerticalParallaxCard_card"]:not([class*="Container"]):not([class*="cards"])'
  ));

  cards.forEach((card) => {
    // Extract image
    const picture = card.querySelector('[class*="cardImage"] picture');
    const img = picture
      ? picture.querySelector('img')
      : card.querySelector('img');

    // Extract title
    const title = card.querySelector('[class*="cardCopy"] h3, h3');

    // Extract description
    const desc = card.querySelector('[class*="cardCopy"] p, [class*="cardCopy"] div');

    // Extract CTA
    const cta = card.querySelector('[class*="cardCTA"] a, a[href]');

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

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
  element.replaceWith(block);
}
