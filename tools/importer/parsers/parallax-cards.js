/* eslint-disable */
/* global WebImporter */

/**
 * Parser for parallax-cards block
 *
 * Source: https://jobs.army.mod.uk/army-reserve/
 * Base Block: parallax-cards
 *
 * Handles VerticalParallaxCards sections with scroll-driven card reveal animation.
 * Each card has an image and a content body (title + description + CTA).
 * The section also contains a "stage" heading area ("Become a Reservist" / "How it works").
 *
 * Source HTML Pattern:
 * <section class="VerticalParallaxCards_carouselContainer__...">
 *   <div class="VerticalParallaxCards_content__...">
 *     <h2 class="...">Become a Reservist</h2>
 *     <h3 class="...">HOW IT WORKS</h3>
 *   </div>
 *   <div class="VerticalParallaxCards_cards__...">
 *     <div class="VerticalParallaxCards_card__...">
 *       <picture>...<img src="card-image.jpg" alt="..."></picture>
 *       <div class="VerticalParallaxCards_cardContent__...">
 *         <h3>THERE'S NOTHING LIKE IT</h3>
 *         <p>Description text...</p>
 *         <a href="...">Learn more</a>
 *       </div>
 *     </div>
 *     <!-- more cards -->
 *   </div>
 * </section>
 *
 * Block Structure (per card):
 * - Column 1: Card image
 * - Column 2: Title + description + CTA link
 *
 * Section metadata: olive (applied via section metadata block)
 * Default content before block: h2 "Become a Reservist" + h3 "HOW IT WORKS"
 *
 * Generated: 2026-03-05
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract cards
  const cards = Array.from(
    element.querySelectorAll('[class*="VerticalParallaxCards_card"]')
  );

  // Deduplicate cards (some carousels clone elements)
  const seen = new Set();
  const uniqueCards = cards.filter((card) => {
    const key = card.textContent.trim().substring(0, 80);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  uniqueCards.forEach((card) => {
    // Extract card image
    const img = card.querySelector('img');

    // Extract card content
    const title = card.querySelector(
      '[class*="cardContent"] h3, [class*="CardContent"] h3, h3'
    );
    const description = card.querySelector(
      '[class*="cardContent"] p, [class*="CardContent"] p, p'
    );
    const cta = card.querySelector(
      '[class*="cardContent"] a[href], [class*="CardContent"] a[href], a[href]'
    );

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
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      contentCell.appendChild(p);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Parallax Cards', cells });

  // Extract stage headings (h2 "Become a Reservist", h3 "How it works")
  // These become default content before the block
  const stageContent = element.querySelector('[class*="VerticalParallaxCards_content"]');
  const stageH2 = stageContent ? stageContent.querySelector('h2') : element.querySelector(':scope > div:first-child h2');
  const stageH3 = stageContent ? stageContent.querySelector('h3') : null;

  const fragment = document.createDocumentFragment();

  if (stageH2) {
    const h2 = document.createElement('h2');
    h2.textContent = stageH2.textContent.trim();
    fragment.appendChild(h2);
  }

  if (stageH3) {
    const h3 = document.createElement('h3');
    h3.textContent = stageH3.textContent.trim();
    fragment.appendChild(h3);
  }

  fragment.appendChild(block);
  element.replaceWith(fragment);
}
