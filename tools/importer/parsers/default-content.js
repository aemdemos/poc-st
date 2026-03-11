/* global WebImporter */

/**
 * Parser for default (non-block) content sections
 *
 * Handles content sections that are NOT wrapped in a named block.
 * These appear as plain headings, paragraphs, images, and CTA links
 * within a section, styled via section-metadata.
 *
 * Examples from source site:
 * - "Find Your Fit" section (beige, centered)
 * - "Be the Best" section (accent, centered)
 * - "Explore Army Roles" section (olive, centered)
 * - Free text / intro paragraphs
 * - Map CTA sections
 * - Video content blocks
 *
 * This parser extracts semantic content (headings, paragraphs, images,
 * links) and returns them as clean default content without a block wrapper.
 *
 * Generated: 2026-03-06
 */
export default function parse(element, { document }) {
  const fragment = document.createDocumentFragment();

  // Extract images/pictures
  const pictures = element.querySelectorAll('picture');
  pictures.forEach((pic) => {
    const img = pic.querySelector('img');
    if (img) {
      const newPic = document.createElement('picture');
      const source1 = document.createElement('source');
      source1.setAttribute('srcset', img.src || img.getAttribute('src'));
      newPic.appendChild(source1);
      const source2 = document.createElement('source');
      source2.setAttribute('srcset', img.src || img.getAttribute('src'));
      source2.setAttribute('media', '(min-width: 600px)');
      newPic.appendChild(source2);
      const newImg = document.createElement('img');
      newImg.src = img.src || img.getAttribute('src');
      newImg.alt = img.alt || '';
      newImg.setAttribute('loading', 'lazy');
      newPic.appendChild(newImg);

      const p = document.createElement('p');
      p.appendChild(newPic);
      fragment.appendChild(p);
    }
  });

  // Extract headings (h1-h6)
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((h) => {
    const heading = document.createElement(h.tagName.toLowerCase());
    heading.textContent = h.textContent.trim();
    if (heading.textContent) fragment.appendChild(heading);
  });

  // Extract paragraphs (not inside links or headings)
  const paragraphs = element.querySelectorAll('p');
  paragraphs.forEach((p) => {
    // Skip if it's just wrapping an image we already extracted
    if (p.querySelector('picture') || p.querySelector('img')) return;
    // Skip if it's just wrapping a link (we handle those below)
    const text = p.textContent.trim();
    if (!text) return;

    const newP = document.createElement('p');

    // Check if paragraph contains inline links
    const links = p.querySelectorAll('a[href]');
    if (links.length > 0 && p.children.length === links.length) {
      // Paragraph is just links - create button-style links
      links.forEach((link) => {
        const a = document.createElement('a');
        a.href = link.href || link.getAttribute('href');
        a.textContent = link.textContent.trim();
        newP.appendChild(a);
        newP.appendChild(document.createTextNode(' '));
      });
    } else if (links.length > 0) {
      // Mixed content - preserve as rich text
      newP.innerHTML = p.innerHTML;
    } else {
      newP.textContent = text;
    }

    fragment.appendChild(newP);
  });

  // If no paragraphs found but there are standalone links, extract those
  if (paragraphs.length === 0) {
    const links = element.querySelectorAll('a[href]');
    links.forEach((link) => {
      // Skip links inside lists (already handled by list extraction)
      if (link.closest('ul') || link.closest('ol')) return;
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href || link.getAttribute('href');
      a.textContent = link.textContent.trim();
      if (a.textContent) {
        p.appendChild(a);
        fragment.appendChild(p);
      }
    });
  }

  // Extract lists
  const lists = element.querySelectorAll('ul, ol');
  lists.forEach((list) => {
    const newList = document.createElement(list.tagName.toLowerCase());
    list.querySelectorAll(':scope > li').forEach((li) => {
      const newLi = document.createElement('li');
      const link = li.querySelector('a[href]');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href || link.getAttribute('href');
        a.textContent = link.textContent.trim();
        newLi.appendChild(a);
      } else {
        newLi.textContent = li.textContent.trim();
      }
      newList.appendChild(newLi);
    });
    if (newList.children.length > 0) fragment.appendChild(newList);
  });

  if (fragment.childNodes.length > 0) {
    // Modify element in-place so the import engine's assembleContent()
    // can still reference it (replaceWith detaches the element).
    while (element.firstChild) element.removeChild(element.firstChild);
    while (fragment.firstChild) element.appendChild(fragment.firstChild);
  }
}
