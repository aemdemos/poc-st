/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block (slider variant)
 *
 * Source: https://jobs.army.mod.uk/army-reserve/
 * Base Block: hero (slider)
 *
 * Handles ImageAndTextSlider sections with multiple crossfading background
 * images and rotating text headings.
 *
 * Source HTML Pattern:
 * <section class="ImageAndTextSlider_banner__...">
 *   <div class="ImageAndTextSlider_slides__...">
 *     <div class="ImageAndTextSlider_slide__...">
 *       <picture>...<img src="slide1.jpg" alt="..."></picture>
 *     </div>
 *     <div class="ImageAndTextSlider_slide__...">
 *       <picture>...<img src="slide2.jpg" alt="..."></picture>
 *     </div>
 *   </div>
 *   <div class="ImageAndTextSlider_overlay__...">
 *     <h3 class="Keyline_text__...">Ways to join</h3>
 *     <h2 class="ImageAndTextSlider_title__...">Be a reserve Soldier</h2>
 *     <h2 class="ImageAndTextSlider_title__...">Officer</h2>
 *     <h2 class="ImageAndTextSlider_title__...">Specialist</h2>
 *     <a class="ImageAndTextSlider_cta__..." href="...">Ways to join</a>
 *   </div>
 * </section>
 *
 * Block Structure:
 * - Rows 1..N: One background image per slide (each in its own row)
 * - Last row: Content cell with subtitle h3 + multiple h2 headings + CTA
 *
 * Generated: 2026-03-04, Updated: 2026-03-05
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract ALL slide images (multiple background images for crossfade)
  const slideContainers = Array.from(
    element.querySelectorAll('[class*="ImageAndTextSlider_slide"]')
  );

  // Deduplicate slides (source may have cloned elements)
  const seenSrcs = new Set();
  const slideImages = [];

  if (slideContainers.length > 0) {
    slideContainers.forEach((slide) => {
      const img = slide.querySelector('img');
      if (img) {
        const src = img.src || img.getAttribute('src');
        if (!seenSrcs.has(src)) {
          seenSrcs.add(src);
          slideImages.push(img);
        }
      }
    });
  } else {
    // Fallback: grab all pictures directly
    const pictures = Array.from(element.querySelectorAll('picture'));
    pictures.forEach((pic) => {
      const img = pic.querySelector('img');
      if (img) {
        const src = img.src || img.getAttribute('src');
        if (!seenSrcs.has(src)) {
          seenSrcs.add(src);
          slideImages.push(img);
        }
      }
    });
  }

  // Each slide image becomes its own row
  slideImages.forEach((img) => {
    const imgEl = document.createElement('img');
    imgEl.src = img.src || img.getAttribute('src');
    imgEl.alt = img.alt || '';
    cells.push([imgEl]);
  });

  // Extract subtitle/keyline heading
  const keyline = element.querySelector(
    '[class*="Keyline_text"], [class*="keyline"] h3, [class*="ImageAndTextSlider_overlay"] h3'
  );

  // Extract ALL title headings (rotating words: "Be a reserve Soldier", "Officer", "Specialist")
  const titles = Array.from(
    element.querySelectorAll('[class*="ImageAndTextSlider_title"], [class*="ImageAndTextSlider_overlay"] h2')
  );

  // Deduplicate titles by text content
  const seenTitles = new Set();
  const uniqueTitles = titles.filter((t) => {
    const text = t.textContent.trim();
    if (seenTitles.has(text)) return false;
    seenTitles.add(text);
    return true;
  });

  // Extract CTA link
  const cta = element.querySelector(
    '[class*="ImageAndTextSlider_cta"], [class*="ImageAndTextSlider_overlay"] a[href]'
  );

  // Build content cell with all headings
  const contentCell = document.createElement('div');

  if (keyline) {
    const h3 = document.createElement('h3');
    h3.textContent = keyline.textContent.trim();
    contentCell.appendChild(h3);
  }

  // Each rotating title gets its own h2
  uniqueTitles.forEach((title) => {
    const h2 = document.createElement('h2');
    h2.textContent = title.textContent.trim();
    contentCell.appendChild(h2);
  });

  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.href || cta.getAttribute('href');
    a.textContent = cta.textContent.trim();
    p.appendChild(a);
    contentCell.appendChild(p);
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero (slider)', cells });
  element.replaceWith(block);
}
