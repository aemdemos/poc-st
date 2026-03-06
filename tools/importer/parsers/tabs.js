/* global WebImporter */

/**
 * Parser for tabs block
 *
 * Source: https://jobs.army.mod.uk/regular-army/
 * Base Block: tabs
 *
 * Handles tabbed content sections. In the source site, these appear as
 * vertically stacked tab panels (e.g., "Regular Soldiers" / "Regular Officers").
 *
 * Source HTML Pattern:
 * <section class="Tabs_tabContainer__...">
 *   <div class="Tabs_tabButtons__...">
 *     <button class="Tabs_tabButton__...">Regular Soldiers</button>
 *     <button class="Tabs_tabButton__...">Regular Officers</button>
 *   </div>
 *   <div class="Tabs_tabContent__...">
 *     <div class="Tabs_tabPanel__...">
 *       <h3>Title</h3>
 *       <p>Description...</p>
 *       <ul><li>Item 1</li></ul>
 *       <a href="...">CTA</a>
 *     </div>
 *     <div class="Tabs_tabPanel__...">
 *       ...
 *     </div>
 *   </div>
 * </section>
 *
 * Block Structure:
 * Each row = one tab.
 *   - Column 1: Tab label (plain text or heading)
 *   - Column 2: Tab content (heading + paragraphs + lists + CTAs)
 *
 * Generated: 2026-03-06
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract tab buttons/labels
  const tabButtons = Array.from(
    element.querySelectorAll(
      '[class*="Tabs_tabButton"], [class*="TabButton"], [role="tab"], .tab-button',
    ),
  );

  // Extract tab panels
  const tabPanels = Array.from(
    element.querySelectorAll(
      '[class*="Tabs_tabPanel"], [class*="TabPanel"], [role="tabpanel"], .tab-panel',
    ),
  );

  // Match buttons to panels
  const tabCount = Math.min(tabButtons.length, tabPanels.length);

  for (let i = 0; i < tabCount; i += 1) {
    const label = tabButtons[i];
    const panel = tabPanels[i];

    // Build label cell
    const labelCell = document.createElement('div');
    const labelText = label.textContent.trim();
    labelCell.textContent = labelText;

    // Build content cell - preserve semantic structure
    const contentCell = document.createElement('div');

    // Extract headings
    const headings = panel.querySelectorAll('h2, h3, h4');
    headings.forEach((h) => {
      const heading = document.createElement(h.tagName.toLowerCase());
      heading.textContent = h.textContent.trim();
      contentCell.appendChild(heading);
    });

    // Extract paragraphs
    const paragraphs = panel.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const para = document.createElement('p');
      para.textContent = p.textContent.trim();
      if (para.textContent) contentCell.appendChild(para);
    });

    // Extract lists
    const lists = panel.querySelectorAll('ul, ol');
    lists.forEach((list) => {
      const newList = document.createElement(list.tagName.toLowerCase());
      list.querySelectorAll('li').forEach((li) => {
        const newLi = document.createElement('li');
        newLi.textContent = li.textContent.trim();
        newList.appendChild(newLi);
      });
      if (newList.children.length > 0) contentCell.appendChild(newList);
    });

    // Extract video links (YouTube)
    const videoLinks = panel.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]');
    videoLinks.forEach((link) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href || link.getAttribute('href');
      a.textContent = link.textContent.trim() || 'Watch video';
      p.appendChild(a);
      contentCell.appendChild(p);
    });

    // Extract CTA links (non-video)
    const ctaLinks = panel.querySelectorAll('a[href]:not([href*="youtube.com"]):not([href*="youtu.be"])');
    ctaLinks.forEach((link) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href || link.getAttribute('href');
      a.textContent = link.textContent.trim();
      if (a.textContent) {
        p.appendChild(a);
        contentCell.appendChild(p);
      }
    });

    cells.push([labelCell, contentCell]);
  }

  // Fallback: if no structured tabs found, try generic content sections
  if (cells.length === 0) {
    const sections = Array.from(element.children);
    sections.forEach((section) => {
      const heading = section.querySelector('h2, h3, h4');
      if (heading) {
        const labelCell = document.createElement('div');
        labelCell.textContent = heading.textContent.trim();

        const contentCell = document.createElement('div');
        const clone = section.cloneNode(true);
        const headingClone = clone.querySelector('h2, h3, h4');
        if (headingClone) headingClone.remove();
        contentCell.innerHTML = clone.innerHTML;

        cells.push([labelCell, contentCell]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs', cells });
  element.replaceWith(block);
}
