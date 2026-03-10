/* global WebImporter */

/**
 * Columns-Location Block Parser
 *
 * Extracts a two-column layout with location details on the left
 * and an embedded Google Maps iframe on the right.
 *
 * Instance (div[class*='CentreDetails_centreDetailsContainer']):
 *   <div class="CentreDetails_centreDetailsContainer__50Ima">
 *     <div class="CentreDetails_centreDetailsTextContent__sw8Ih">
 *       <h2>Army Careers Centre</h2>
 *       <div class="CentreDetails_address__v2FuL">...</div>
 *       <div class="CentreDetails_openingTimes__MGRfB">...</div>
 *       <div class="CentreDetails_contactNumberContainer__Uxx9I">...</div>
 *       <a href="..."><button>Get directions</button></a>
 *       <div class="CentreDetails_about__6_3Rh">...</div>
 *     </div>
 *     <div class="CentreDetails_centreDetailsMap__AN0ro">
 *       <iframe title="map" src="https://www.google.com/maps/embed/v1/place?..."></iframe>
 *     </div>
 *   </div>
 *
 * Generated: 2026-03-09
 */

function createBlockTable(document, blockName, rows) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  // Header row with block name
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('td');
  headerCell.setAttribute('colspan', String(rows[0] ? rows[0].length : 1));
  headerCell.textContent = blockName;
  headerRow.appendChild(headerCell);
  tbody.appendChild(headerRow);

  // Data rows
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((cellContent) => {
      const td = document.createElement('td');
      if (typeof cellContent === 'string') {
        td.textContent = cellContent;
      } else if (cellContent instanceof document.defaultView.Node) {
        td.appendChild(cellContent);
      } else if (cellContent && cellContent.nodeType) {
        td.appendChild(cellContent);
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  return table;
}

export default function parse(element, { document }) {
  // --- Left column: location details ---
  const leftCell = document.createElement('div');

  // Heading
  const heading = element.querySelector('[class*="heading"], h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    leftCell.appendChild(h2);
  }

  // Address
  const addressBlock = element.querySelector('[class*="address"]');
  if (addressBlock) {
    const addressLines = addressBlock.querySelectorAll('p');
    addressLines.forEach((line) => {
      const p = document.createElement('p');
      p.textContent = line.textContent.trim();
      if (p.textContent) leftCell.appendChild(p);
    });
  }

  // Opening times
  const timesBlock = element.querySelector('[class*="openingTimes"], [class*="OpeningTimes"]');
  if (timesBlock) {
    const allP = timesBlock.querySelectorAll('p');
    allP.forEach((p) => {
      const newP = document.createElement('p');
      const text = p.textContent.trim();
      if (p.className && p.className.includes('Title')) {
        const strong = document.createElement('strong');
        strong.textContent = text;
        newP.appendChild(strong);
      } else {
        newP.textContent = text;
      }
      if (text) leftCell.appendChild(newP);
    });
  }

  // Contact numbers
  const contactBlock = element.querySelector('[class*="contactNumber"], [class*="ContactNumber"]');
  if (contactBlock) {
    const prefix = contactBlock.querySelector('[class*="prefix"]');
    const numbers = contactBlock.querySelectorAll('a[href^="tel:"]');
    if (prefix || numbers.length > 0) {
      const p = document.createElement('p');
      if (prefix) {
        const strong = document.createElement('strong');
        strong.textContent = prefix.textContent.trim();
        p.appendChild(strong);
        p.appendChild(document.createTextNode(' '));
      }
      numbers.forEach((num, idx) => {
        if (idx > 0) p.appendChild(document.createTextNode(' | '));
        const a = document.createElement('a');
        a.href = num.getAttribute('href');
        a.textContent = num.textContent.trim();
        p.appendChild(a);
      });
      leftCell.appendChild(p);
    }
  }

  // Get directions button
  const directionsLink = element.querySelector('a[href*="maps"]');
  if (directionsLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = directionsLink.getAttribute('href');
    const btn = directionsLink.querySelector('button');
    a.textContent = btn ? btn.textContent.trim() : directionsLink.textContent.trim();
    p.appendChild(a);
    leftCell.appendChild(p);
  }

  // About section
  const aboutBlock = element.querySelector('[class*="about"]');
  if (aboutBlock) {
    // Only select direct child paragraphs (not those inside list items)
    const aboutPs = aboutBlock.querySelectorAll(':scope > p');
    aboutPs.forEach((ap) => {
      const p = document.createElement('p');
      p.innerHTML = ap.innerHTML;
      leftCell.appendChild(p);
    });
    const aboutLists = aboutBlock.querySelectorAll('ul, ol');
    aboutLists.forEach((list) => {
      const newList = document.createElement(list.tagName.toLowerCase());
      list.querySelectorAll(':scope > li').forEach((li) => {
        const newLi = document.createElement('li');
        newLi.innerHTML = li.innerHTML;
        newList.appendChild(newLi);
      });
      if (newList.children.length > 0) leftCell.appendChild(newList);
    });
  }

  // --- Right column: map embed ---
  const rightCell = document.createElement('div');
  const iframe = element.querySelector('iframe[src*="google.com/maps"]');

  if (iframe) {
    const mapSrc = iframe.getAttribute('src');
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = mapSrc;
    a.textContent = mapSrc;
    p.appendChild(a);
    rightCell.appendChild(p);
  } else {
    const p = document.createElement('p');
    p.textContent = '[Map placeholder]';
    rightCell.appendChild(p);
  }

  // --- Build Columns-Location block table ---
  const block = createBlockTable(document, 'Columns-Location', [[leftCell, rightCell]]);
  element.replaceWith(block);
}
