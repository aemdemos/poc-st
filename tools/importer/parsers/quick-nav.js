/* eslint-disable */
/* global WebImporter */

/**
 * Parser for quick-nav block
 *
 * Source: https://jobs.army.mod.uk/army-reserve/
 * Base Block: quick-nav
 *
 * Source HTML Pattern:
 * <section class="PageLinks_pageLinks__...">
 *   <h3 class="PageLinks_title__...">Explore the Army Reserve</h3>
 *   <ul class="PageLinks_links__...">
 *     <li><a href="/army-reserve/life-in-the-army-reserve/">Life in the Army Reserve</a></li>
 *     ...
 *   </ul>
 * </section>
 *
 * Block Structure:
 * - Single row: heading + unordered list of links
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  // Extract section title
  const title = element.querySelector(
    '[class*="PageLinks_title"], h3, h2'
  );

  // Extract navigation links
  const linkList = element.querySelector(
    '[class*="PageLinks_links"], ul'
  );
  const links = linkList
    ? Array.from(linkList.querySelectorAll('a[href]'))
    : Array.from(element.querySelectorAll('a[href]'));

  // Build content cell with heading + link list
  const contentCell = document.createElement('div');

  if (title) {
    const h3 = document.createElement('h3');
    h3.textContent = title.textContent.trim();
    contentCell.appendChild(h3);
  }

  if (links.length > 0) {
    const ul = document.createElement('ul');
    links.forEach((link) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = link.href || link.getAttribute('href');
      a.textContent = link.textContent.trim();
      li.appendChild(a);
      ul.appendChild(li);
    });
    contentCell.appendChild(ul);
  }

  const cells = [[contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Quick Nav', cells });
  element.replaceWith(block);
}
