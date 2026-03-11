/**
 * Breadcrumb Parser
 *
 * Extracts the breadcrumb trail as a simple <ul> with only linked items.
 * Skips the current-page item (no link) and dot-separator decorator spans.
 *
 * Instance: div[class*='Breadcrumbs_breadcrumbsContainer']
 * Source: https://jobs.army.mod.uk/army-reserve/find-a-reserve-centre/south-east/abingdon-cholswell-road/
 * Generated: 2026-03-11
 */
export default function parse(element, { document }) {
  const fragment = document.createDocumentFragment();

  const list = element.querySelector('ul, ol');
  if (list) {
    const newList = document.createElement('ul');
    list.querySelectorAll(':scope > li').forEach((li) => {
      const link = li.querySelector('a[href]');
      // Only include list items that have a link (skip current-page text items)
      if (link) {
        const newLi = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = link.textContent.trim();
        newLi.appendChild(a);
        newList.appendChild(newLi);
      }
    });
    if (newList.children.length > 0) fragment.appendChild(newList);
  }

  if (fragment.childNodes.length > 0) {
    while (element.firstChild) element.removeChild(element.firstChild);
    while (fragment.firstChild) element.appendChild(fragment.firstChild);
  }
}
