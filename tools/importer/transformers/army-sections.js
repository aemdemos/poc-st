/**
 * Army Sections Transformer
 *
 * Adds section breaks (<hr>) and section-metadata blocks between sections.
 * Runs in afterTransform hook (after block parsing, before final metadata).
 *
 * Uses template.sections from the import script's PAGE_TEMPLATE to determine
 * section boundaries and styling.
 */

function createSectionMetadataTable(document, style) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  // Header row
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('td');
  headerCell.setAttribute('colspan', '2');
  headerCell.textContent = 'Section Metadata';
  headerRow.appendChild(headerCell);
  tbody.appendChild(headerRow);

  // Style row
  const styleRow = document.createElement('tr');
  const keyCell = document.createElement('td');
  keyCell.textContent = 'style';
  const valueCell = document.createElement('td');
  valueCell.textContent = style;
  styleRow.appendChild(keyCell);
  styleRow.appendChild(valueCell);
  tbody.appendChild(styleRow);

  table.appendChild(tbody);
  return table;
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const { document, template } = payload;
  if (!template || !template.sections || template.sections.length < 2) return;

  const sections = template.sections;

  // Process sections in reverse order to avoid offset issues when inserting elements
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    if (!section.style) continue;

    // Find the section container in the DOM
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    let sectionEl = null;
    for (const sel of selectors) {
      sectionEl = element.querySelector(sel);
      if (sectionEl) break;
    }

    if (!sectionEl) continue;

    // Create section-metadata table after the section content
    const sectionMetadata = createSectionMetadataTable(document, section.style);

    // Insert section-metadata after the section element
    if (sectionEl.nextSibling) {
      sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
    } else {
      sectionEl.parentNode.appendChild(sectionMetadata);
    }

    // Add section break (hr) before the section if it's not the first section
    if (i > 0) {
      const hr = document.createElement('hr');
      sectionEl.parentNode.insertBefore(hr, sectionEl);
    }
  }
}
