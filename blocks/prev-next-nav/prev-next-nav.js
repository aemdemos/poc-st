/**
 * Prev-Next Navigation Block
 *
 * Displays previous/next sibling page links for content sub-pages.
 *
 * Authored as:
 *   | Prev Next Nav |                  |
 *   |---------------|------------------|
 *   | ← Previous    | Next →           |
 *   | /prev-page/   | /next-page/      |
 *
 * Row 1: Link labels (text)
 * Row 2: Link URLs (hrefs)
 *
 * Either column can be empty for first/last pages in a sequence.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const nav = document.createElement('nav');
  nav.className = 'prev-next-nav-links';
  nav.setAttribute('aria-label', 'Previous and next pages');

  const firstRow = rows[0];
  const cols = [...firstRow.children];

  // Previous link (left column)
  const prevCol = cols[0];
  const prevLink = prevCol?.querySelector('a');
  if (prevLink) {
    prevLink.classList.add('prev-next-nav-prev');
    const label = document.createElement('span');
    label.className = 'prev-next-nav-label';
    label.textContent = 'Previous';
    const title = document.createElement('span');
    title.className = 'prev-next-nav-title';
    title.textContent = prevLink.textContent;
    prevLink.textContent = '';
    prevLink.appendChild(label);
    prevLink.appendChild(title);
    nav.appendChild(prevLink);
  } else {
    // Empty spacer for alignment
    const spacer = document.createElement('div');
    spacer.className = 'prev-next-nav-spacer';
    nav.appendChild(spacer);
  }

  // Next link (right column)
  const nextCol = cols[1];
  const nextLink = nextCol?.querySelector('a');
  if (nextLink) {
    nextLink.classList.add('prev-next-nav-next');
    const label = document.createElement('span');
    label.className = 'prev-next-nav-label';
    label.textContent = 'Next';
    const title = document.createElement('span');
    title.className = 'prev-next-nav-title';
    title.textContent = nextLink.textContent;
    nextLink.textContent = '';
    nextLink.appendChild(label);
    nextLink.appendChild(title);
    nav.appendChild(nextLink);
  }

  block.textContent = '';
  block.appendChild(nav);
}
