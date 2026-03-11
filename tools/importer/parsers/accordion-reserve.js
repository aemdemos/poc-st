/* eslint-disable */
/* global WebImporter */

/**
 * Reserve Centre Parser
 *
 * Extracts a reserve centre detail page into:
 *   - Default content (sidebar): centre name, address, directions link, map image
 *   - Accordion-reserve block: unit cards with contact, about, schedule, roles, CTA
 *   - Section metadata: columns-reserve style for 2-column layout
 *
 * The parser also inserts an <hr> section break before the content, separating
 * the breadcrumb section from the reserve centre section.
 *
 * Instance: div[class*='ReserveUnitCentre_gridContainer']
 * Source: https://jobs.army.mod.uk/army-reserve/find-a-reserve-centre/south-east/abingdon-cholswell-road/
 * Generated: 2026-03-11
 */

function createBlockTable(document, name, cells) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  // Header row with block name
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('td');
  const maxCols = cells.reduce((max, row) => Math.max(max, row.length), 1);
  headerCell.setAttribute('colspan', String(maxCols));
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  tbody.appendChild(headerRow);

  // Data rows
  cells.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
      const td = document.createElement('td');
      if (typeof cell === 'string') {
        td.textContent = cell;
      } else if (cell && cell.nodeType) {
        while (cell.firstChild) {
          td.appendChild(cell.firstChild);
        }
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  return table;
}

function createSectionMetadataDiv(document, style) {
  const block = document.createElement('div');
  block.setAttribute('class', 'section-metadata');
  const row = document.createElement('div');
  const keyCell = document.createElement('div');
  keyCell.textContent = 'style';
  const valCell = document.createElement('div');
  valCell.textContent = style;
  row.appendChild(keyCell);
  row.appendChild(valCell);
  block.appendChild(row);
  return block;
}

export default function parse(element, { document }) {
  // --- Sidebar: default content elements ---
  const sidebarElements = [];

  // "< Go Back" link (navigates back to reserve centre search)
  // Always included — the original renders this client-side so it's absent from SSR HTML
  {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = '/army-reserve/find-a-reserve-centre/';
    a.textContent = '< Go Back';
    p.appendChild(a);
    sidebarElements.push(p);
  }

  // Centre name heading
  const title = element.querySelector('[class*="Sidebar_title"], [class*="sidebar"] h1');
  if (title) {
    const h1 = document.createElement('h1');
    h1.textContent = title.textContent.trim();
    sidebarElements.push(h1);
  }

  // Address label ("Address:")
  const addressTitle = element.querySelector('[class*="Sidebar_addressTitle"], [class*="addressTitle"]');
  if (addressTitle) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = addressTitle.textContent.trim();
    p.appendChild(strong);
    sidebarElements.push(p);
  }

  // Address lines
  const addressBlock = element.querySelector('[class*="Sidebar_address"]:not([class*="addressTitle"])');
  if (addressBlock) {
    const lines = addressBlock.querySelectorAll('p');
    lines.forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line.textContent.trim();
      if (p.textContent) sidebarElements.push(p);
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
    a.textContent = 'Get directions';
    p.appendChild(a);
    sidebarElements.push(p);
  }

  // Static map image — try DOM first, then construct from coordinates
  // (Next.js loads the image client-side, so it may be absent from SSR HTML)
  let mapImgSrc = null;
  const mapContainer = element.querySelector('[class*="Sidebar_dropShadowImage"], [class*="dropShadow"]');
  if (mapContainer) {
    const mapImg = mapContainer.querySelector('img');
    if (mapImg) mapImgSrc = mapImg.getAttribute('src');
  }

  // Fallback: extract lat/lng from directions link and build Mapbox static map URL
  if (!mapImgSrc && dirLink) {
    const href = dirLink.getAttribute('href') || '';
    const coordMatch = href.match(/([-\d.]+)[,\s+]+([-\d.]+)/);
    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      const pin = encodeURIComponent('https://a.storyblok.com/f/88791/56x56/7b21c76b1e/map_pin_static.png');
      mapImgSrc = `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/url-${pin}(${lng},${lat})/${lng},${lat},14/375x375?access_token=pk.eyJ1IjoieWV4dCIsImEiOiJqNzVybUhnIn0.hTOO5A1yqfpN42-_z_GuLw&logo=false`;
    }
  }

  if (mapImgSrc) {
    const p = document.createElement('p');
    const img = document.createElement('img');
    img.src = mapImgSrc;
    img.alt = 'Map';
    p.appendChild(img);
    sidebarElements.push(p);
  }

  // --- Accordion block: unit cards ---
  const cells = [];

  // First row: heading (single column)
  const unitsHeading = element.querySelector(
    '[class*="UnitsAtLocation_heading"], [class*="unitsContainer"] > h1, [class*="unitsContainer"] > h2',
  );
  if (unitsHeading) {
    const headingCell = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = unitsHeading.textContent.trim();
    headingCell.appendChild(h2);
    cells.push([headingCell]);
  }

  // Unit card rows (two columns: header | content)
  const unitCards = element.querySelectorAll('[class*="UnitCard_cardContainer"]');
  unitCards.forEach((card) => {
    // Column 1: badge image + unit name
    const headerCell = document.createElement('div');
    const headerP = document.createElement('p');
    const cardButton = card.querySelector('[class*="UnitCard_cardButton"], button');
    if (cardButton) {
      const badgeImg = cardButton.querySelector('img[alt]:not([src^="data:"])');
      if (badgeImg) {
        const img = document.createElement('img');
        img.src = badgeImg.getAttribute('src');
        img.alt = badgeImg.getAttribute('alt') || '';
        headerP.appendChild(img);
      }
      const unitName = cardButton.querySelector('h1, h2, h3, [class*="UnitCard_text"]');
      if (unitName) {
        headerP.appendChild(document.createTextNode(unitName.textContent.trim()));
      }
    }
    headerCell.appendChild(headerP);

    // Column 2: expandable content
    const contentCell = document.createElement('div');
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
          contentCell.appendChild(p);
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
            if (p.textContent) contentCell.appendChild(p);
          });
          return;
        }

        // Plain text paragraphs
        if (tag === 'P') {
          const p = document.createElement('p');
          p.textContent = child.textContent.trim();
          if (p.textContent) contentCell.appendChild(p);
          return;
        }

        // Div containers (about text wrapper, available roles wrapper)
        if (tag === 'DIV') {
          const innerHeading = child.querySelector('[class*="UnitCard_heading"]');
          if (innerHeading) {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = innerHeading.textContent.trim();
            p.appendChild(strong);
            contentCell.appendChild(p);
          }

          child.querySelectorAll(':scope > p:not([class*="UnitCard_heading"])').forEach((ip) => {
            const p = document.createElement('p');
            p.textContent = ip.textContent.trim();
            if (p.textContent) contentCell.appendChild(p);
          });

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
            if (newList.children.length > 0) contentCell.appendChild(newList);
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
          contentCell.appendChild(p);
        }
      });
    }

    cells.push([headerCell, contentCell]);
  });

  // Build Accordion-reserve block table (use WebImporter if available, custom fallback otherwise)
  let accordionBlock;
  try {
    accordionBlock = WebImporter.Blocks.createBlock(document, { name: 'Accordion-reserve', cells });
  } catch (e) {
    accordionBlock = createBlockTable(document, 'Accordion-reserve', cells);
  }

  // Build Section Metadata table for columns-reserve style
  const sectionMetadata = createSectionMetadataDiv(document, 'columns-reserve');

  // Modify the element in-place so the import engine's assembleContent()
  // can still reference it (replaceWith detaches the element from the DOM,
  // making the stored reference stale).
  while (element.firstChild) element.removeChild(element.firstChild);
  sidebarElements.forEach((el) => element.appendChild(el));
  element.appendChild(accordionBlock);
  element.appendChild(sectionMetadata);
}
