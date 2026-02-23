/**
 * Columns Block Parser
 *
 * Extracts multi-column content from the hero actions area.
 *
 * Instance (.Home_heroActions__S7X92):
 *   <div class="Home_heroActions__S7X92">
 *     <div class="Home_heroActionsInner__OvuR7">
 *       <div class="Home_heroActionsLeft__IvOa_">
 *         <h2>A job like no other</h2>
 *         <p>Description...</p>
 *         <a href="/regular-army/">Regular Army</a>
 *       </div>
 *       <div class="Home_heroActionsRight__E607O">
 *         <h2>Make a difference</h2>
 *         <p>Description...</p>
 *         <a href="/army-reserve/">Army Reserve</a>
 *       </div>
 *     </div>
 *   </div>
 */
export default function columnsParser(element, { document }) {
  const cells = [['Columns']];

  // Find the left and right column containers
  const left = element.querySelector('[class*="Left"], [class*="left"]');
  const right = element.querySelector('[class*="Right"], [class*="right"]');

  const columns = [left, right].filter(Boolean);

  if (columns.length > 0) {
    const row = columns.map((col) => {
      const cell = document.createElement('div');

      const heading = col.querySelector('h2, h3');
      if (heading) {
        const h = document.createElement('h2');
        h.textContent = heading.textContent.trim();
        cell.appendChild(h);
      }

      const paragraphs = col.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const newP = document.createElement('p');
        newP.textContent = p.textContent.trim();
        cell.appendChild(newP);
      });

      const cta = col.querySelector('a[href]');
      if (cta) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = cta.href;
        a.textContent = cta.textContent.trim();
        p.appendChild(a);
        cell.appendChild(p);
      }

      return cell;
    });
    cells.push(row);
  }

  return WebImporter.Blocks.createBlock(document, cells);
}
