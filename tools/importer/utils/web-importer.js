/**
 * WebImporter Polyfill for Node.js
 *
 * Provides the WebImporter.Blocks.createBlock() API that all parsers depend on,
 * adapted for use with jsdom or linkedom in a Node.js environment.
 *
 * In AEM's browser-based importer, WebImporter is a global. This module
 * exports an equivalent object so parsers work identically in Node.
 */

/**
 * Create an EDS-compatible block table element.
 *
 * Supports two calling conventions used across the existing parsers:
 *   1. createBlock(document, { name, cells })   – newer style
 *   2. createBlock(document, cellsWithHeader)    – legacy style where cells[0] = ['BlockName']
 *
 * Returns a <div> with the correct class names and row/cell structure expected
 * by the EDS rendering pipeline.
 */
function createBlock(document, configOrCells) {
  let name;
  let cells;

  if (Array.isArray(configOrCells)) {
    // Legacy style: first row is header with block name
    const header = configOrCells[0];
    name = Array.isArray(header) ? header[0] : header;
    cells = configOrCells.slice(1);
  } else {
    ({ name, cells } = configOrCells);
  }

  // Convert "Hero (video)" → class="hero video", "Cards (cta)" → class="cards cta"
  const className = name
    .toLowerCase()
    .replace(/\s*\(([^)]+)\)\s*/g, ' $1')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  const block = document.createElement('div');
  block.setAttribute('class', className);

  (cells || []).forEach((row) => {
    const rowDiv = document.createElement('div');
    const rowCells = Array.isArray(row) ? row : [row];

    rowCells.forEach((cell) => {
      const cellDiv = document.createElement('div');
      if (typeof cell === 'string') {
        cellDiv.textContent = cell;
      } else if (cell && cell.nodeType) {
        // DOM node – append children if it's a container, or the node itself
        if (cell.tagName === 'DIV' && cell.childNodes.length > 0) {
          while (cell.firstChild) cellDiv.appendChild(cell.firstChild);
        } else {
          cellDiv.appendChild(cell);
        }
      }
      rowDiv.appendChild(cellDiv);
    });

    block.appendChild(rowDiv);
  });

  return block;
}

const WebImporter = {
  Blocks: { createBlock },
};

export default WebImporter;
export { createBlock };
