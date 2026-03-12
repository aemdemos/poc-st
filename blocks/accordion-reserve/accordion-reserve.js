export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cols = [...row.children];

    // Single-column row with heading → block heading, not an accordion item
    if (cols.length === 1 && cols[0].querySelector('h1, h2, h3')) {
      row.classList.add('accordion-heading');
      return;
    }

    if (cols.length < 2) return;

    const label = cols[0];
    const body = cols[1];

    // Restructure header: if it contains a <p> with both an <img> and text,
    // extract them as separate elements for CSS grid layout (badge + name)
    const headerP = label.querySelector('p');
    if (headerP && headerP.querySelector('img') && headerP.textContent.trim()) {
      const img = headerP.querySelector('img');
      const text = headerP.textContent.trim();
      headerP.remove();
      if (img) label.appendChild(img);
      const nameSpan = document.createElement('span');
      nameSpan.classList.add('accordion-item-name');
      nameSpan.textContent = text;
      label.appendChild(nameSpan);
    }

    // Build accessible details/summary structure
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    body.className = 'accordion-item-body';

    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);
    row.replaceWith(details);
  });

  // Exclusive open: close other items when one is opened
  block.addEventListener('toggle', (e) => {
    if (e.target.open) {
      block.querySelectorAll('details.accordion-item[open]').forEach((item) => {
        if (item !== e.target) item.open = false;
      });
    }
  }, true);
}
