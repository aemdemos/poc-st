/* eslint-disable */
/* global WebImporter */

/**
 * Columns-Reserve Block Parser
 *
 * Extracts a two-column layout with location sidebar on the left
 * and expandable unit cards on the right.
 *
 * Instance (div[class*='ReserveUnitCentre_gridContainer']):
 *   LEFT sidebar: centre name (h1), address label, address lines,
 *                 "Get directions" link, static Mapbox map image
 *   RIGHT main:  "Units at this location" heading, accordion-style unit cards
 *                 (badge + name + contact + about + schedule + roles + CTA)
 *
 * Source: https://jobs.army.mod.uk/army-reserve/find-a-reserve-centre/south-east/abingdon-cholswell-road/
 * Base block: columns
 * Generated: 2026-03-11
 */

export default function parse(element, { document }) {
  // --- Left column: sidebar with address and map ---
  const leftCell = document.createElement('div');

  // Centre name heading
  const title = element.querySelector('[class*="Sidebar_title"], [class*="sidebar"] h1');
  if (title) {
    const h1 = document.createElement('h1');
    h1.textContent = title.textContent.trim();
    leftCell.appendChild(h1);
  }

  // Address label ("Address:")
  const addressTitle = element.querySelector('[class*="Sidebar_addressTitle"], [class*="addressTitle"]');
  if (addressTitle) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = addressTitle.textContent.trim();
    p.appendChild(strong);
    leftCell.appendChild(p);
  }

  // Address lines
  const addressBlock = element.querySelector('[class*="Sidebar_address"]:not([class*="addressTitle"])');
  if (addressBlock) {
    const lines = addressBlock.querySelectorAll('p');
    lines.forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line.textContent.trim();
      if (p.textContent) leftCell.appendChild(p);
    });
  }

  // "Get directions" link
  const dirLink = element.querySelector(
    'a[class*="Sidebar_directionLink"], a[href*="google.co.uk/maps"], a[href*="google.com/maps/dir"]',
  );
  if (dirLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = dirLink.getAttribute('href');
    // Strip inline SVG text from link text
    a.textContent = 'Get directions';
    p.appendChild(a);
    leftCell.appendChild(p);
  }

  // Static map image
  const mapContainer = element.querySelector('[class*="Sidebar_dropShadowImage"], [class*="dropShadow"]');
  if (mapContainer) {
    const mapImg = mapContainer.querySelector('img');
    if (mapImg) {
      const p = document.createElement('p');
      const img = document.createElement('img');
      img.src = mapImg.getAttribute('src');
      img.alt = mapImg.getAttribute('alt') || 'Map';
      p.appendChild(img);
      leftCell.appendChild(p);
    }
  }

  // --- Right column: units at this location ---
  const rightCell = document.createElement('div');

  // "Units at this location" heading
  const unitsHeading = element.querySelector(
    '[class*="UnitsAtLocation_heading"], [class*="unitsContainer"] > h1, [class*="unitsContainer"] > h2',
  );
  if (unitsHeading) {
    const h2 = document.createElement('h2');
    h2.textContent = unitsHeading.textContent.trim();
    rightCell.appendChild(h2);
  }

  // Unit cards (accordion items)
  const unitCards = element.querySelectorAll('[class*="UnitCard_cardContainer"]');
  unitCards.forEach((card) => {
    const cardDiv = document.createElement('div');

    // Header paragraph: badge image + unit name (p as first-child for accordion JS)
    const headerP = document.createElement('p');
    const cardButton = card.querySelector('[class*="UnitCard_cardButton"], button');
    if (cardButton) {
      // Badge image (skip inline SVG chevrons)
      const badgeImg = cardButton.querySelector('img[alt]:not([src^="data:"])');
      if (badgeImg) {
        const img = document.createElement('img');
        img.src = badgeImg.getAttribute('src');
        img.alt = badgeImg.getAttribute('alt') || '';
        headerP.appendChild(img);
      }
      // Unit name
      const unitName = cardButton.querySelector('h1, h2, h3, [class*="UnitCard_text"]');
      if (unitName) {
        headerP.appendChild(document.createTextNode(unitName.textContent.trim()));
      }
    }
    cardDiv.appendChild(headerP);

    // Content div (expandable accordion body)
    const contentDiv = document.createElement('div');
    const cardContent = card.querySelector('[class*="UnitCard_cardContent"]');

    if (cardContent) {
      const children = Array.from(cardContent.children);
      children.forEach((child) => {
        const cls = child.className || '';
        const tag = child.tagName;

        // Section headings ("Contact:", "About Us:", "When we meet:")
        if (cls.includes('UnitCard_heading')) {
          const p = document.createElement('p');
          const strong = document.createElement('strong');
          strong.textContent = child.textContent.trim();
          p.appendChild(strong);
          contentDiv.appendChild(p);
          return;
        }

        // Contact info container (emails, phone numbers)
        if (cls.includes('UnitCard_contactInfo') || cls.includes('contactInfo')) {
          Array.from(child.children).forEach((cc) => {
            const p = document.createElement('p');
            if (cc.tagName === 'A') {
              const a = document.createElement('a');
              a.href = cc.getAttribute('href');
              a.textContent = cc.textContent.trim();
              p.appendChild(a);
            } else {
              p.textContent = cc.textContent.trim();
            }
            if (p.textContent) contentDiv.appendChild(p);
          });
          return;
        }

        // Plain text paragraphs (about text, schedule text)
        if (tag === 'P') {
          const p = document.createElement('p');
          p.textContent = child.textContent.trim();
          if (p.textContent) contentDiv.appendChild(p);
          return;
        }

        // Div containers (about text wrapper, available roles wrapper)
        if (tag === 'DIV') {
          // Inner heading (e.g. "Available roles:" inside a div)
          const innerHeading = child.querySelector('[class*="UnitCard_heading"]');
          if (innerHeading) {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = innerHeading.textContent.trim();
            p.appendChild(strong);
            contentDiv.appendChild(p);
          }

          // Inner paragraphs (excluding headings already handled)
          child.querySelectorAll(':scope > p:not([class*="UnitCard_heading"])').forEach((ip) => {
            const p = document.createElement('p');
            p.textContent = ip.textContent.trim();
            if (p.textContent) contentDiv.appendChild(p);
          });

          // Lists (available roles)
          child.querySelectorAll('ul, ol').forEach((list) => {
            const newList = document.createElement(list.tagName.toLowerCase());
            list.querySelectorAll(':scope > li').forEach((li) => {
              const newLi = document.createElement('li');
              const liLink = li.querySelector('a');
              if (liLink) {
                const a = document.createElement('a');
                a.href = liLink.getAttribute('href');
                a.textContent = liLink.textContent.trim();
                newLi.appendChild(a);
              } else {
                newLi.textContent = li.textContent.trim();
              }
              newList.appendChild(newLi);
            });
            if (newList.children.length > 0) contentDiv.appendChild(newList);
          });
          return;
        }

        // CTA button link ("Get in touch")
        if (tag === 'A') {
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.href = child.getAttribute('href');
          a.textContent = child.textContent.trim();
          p.appendChild(a);
          contentDiv.appendChild(p);
        }
      });
    }

    cardDiv.appendChild(contentDiv);
    rightCell.appendChild(cardDiv);
  });

  // Build block: single row with two columns (sidebar + units)
  const cells = [[leftCell, rightCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-reserve', cells });
  element.replaceWith(block);
}
