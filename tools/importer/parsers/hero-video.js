/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block (video hero variant)
 *
 * Source: https://jobs.army.mod.uk/army-reserve/
 * Base Block: hero
 *
 * Source HTML Pattern:
 * <div class="HeroVideoBanner_heroContainer__...">
 *   <div class="HeroVideoBanner_imageBackground__...">
 *     <picture>...<img src="poster.jpg" alt="..."></picture>
 *   </div>
 *   <div class="HeroVideoBanner_overlay__...">
 *     <a class="HeroVideoBanner_ctaButton__...">Find a local unit</a>
 *     <h1 class="HeroVideoBanner_title__...">Army Reserve</h1>
 *   </div>
 * </div>
 *
 * Block Structure:
 * - Row 1: Background/poster image
 * - Row 2: Heading + CTAs (including YouTube video link for campaign variant)
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  // Extract poster image from HeroVideoBanner
  const picture = element.querySelector('picture');
  const img = picture ? picture.querySelector('img') : null;

  // Extract heading (h1 in video hero)
  const heading = element.querySelector(
    '[class*="HeroVideoBanner_title"] h1, [class*="HeroVideoBanner_title"], h1'
  );

  // Extract CTA links
  const ctaLink = element.querySelector(
    '[class*="HeroVideoBanner_ctaButton"], [class*="overlay"] a[href]'
  );

  // Check for YouTube video link (for campaign hero variant)
  const videoIframe = element.querySelector('iframe[src*="youtube"]');
  const videoId = videoIframe
    ? videoIframe.src.match(/embed\/([^?]+)/)?.[1]
    : null;

  // Build cells array
  const cells = [];

  // Row 1: Poster/background image
  if (img) {
    const imgEl = document.createElement('img');
    imgEl.src = img.src || img.getAttribute('src');
    imgEl.alt = img.alt || '';
    cells.push([imgEl]);
  }

  // Row 2: Content (heading + CTAs + optional video link)
  const contentCell = document.createElement('div');

  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.appendChild(h1);
  }

  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href || ctaLink.getAttribute('href');
    a.textContent = ctaLink.textContent.trim();
    p.appendChild(a);
    contentCell.appendChild(p);
  }

  // Add YouTube video link if present (triggers campaign hero variant)
  if (videoId) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = `https://www.youtube.com/watch?v=${videoId}`;
    a.textContent = 'Watch video';
    p.appendChild(a);
    contentCell.appendChild(p);
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero (video)', cells });
  element.replaceWith(block);
}
