/**
 * Quick Nav Block
 *
 * Horizontal in-section link bar with heading + list of links.
 * Each link has a chevron bullet icon.
 *
 * Authored as:
 *   | Quick Nav |
 *   |-----------|
 *   | heading   |
 *   | ul > li links |
 */
export default function decorate(block) {
  // The block already contains the heading and list from EDS auto-decoration.
  // Add semantic wrapper for accessibility.
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'In-page navigation');
  while (block.firstChild) {
    nav.append(block.firstChild);
  }
  block.append(nav);
}
