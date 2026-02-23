/**
 * Feature Cards Block Parser
 *
 * Extracts carousel card content from the "5 Reasons" section.
 *
 * Instance (.CarouselCards_carouselCards__F5Ozh):
 *   <section class="CarouselCards_carouselCards__F5Ozh">
 *     <div class="slick-slider">
 *       <div class="slick-track">
 *         <div class="slick-slide"> (multiple, some cloned)
 *           <div class="CarouselCard_carouselCard__PR7VX">
 *             <img src="..." alt="..." />
 *             <h3>Card Title</h3>
 *             <p>Card description</p>
 *           </div>
 *         </div>
 *       </div>
 *     </div>
 *   </section>
 *
 * Note: Filters out slick-cloned slides to avoid duplicates.
 */
export default function featureCardsParser(element, { document }) {
  const cells = [['Feature Cards']];

  // Find all non-cloned slides
  const slides = element.querySelectorAll(
    '.slick-slide:not(.slick-cloned) [class*="carouselCard"]',
  );

  slides.forEach((card) => {
    const img = card.querySelector('img');
    const title = card.querySelector('h3, h4');
    const desc = card.querySelector('p');

    // Image cell
    const imgCell = document.createElement('div');
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src || img.getAttribute('src');
      imgEl.alt = img.alt || '';
      imgCell.appendChild(imgEl);
    }

    // Text cell
    const textCell = document.createElement('div');
    if (title) {
      const h = document.createElement('h2');
      h.textContent = title.textContent.trim();
      textCell.appendChild(h);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCell.appendChild(p);
    }

    cells.push([imgCell, textCell]);
  });

  return WebImporter.Blocks.createBlock(document, cells);
}
