/**
 * Hero Block Parser
 *
 * Extracts hero/banner content from source HTML elements.
 * Handles 3 source instances:
 *
 * Instance 1 (.Home_hero__0PjU_): Main hero
 *   - <picture> with responsive <source> elements → background image
 *   - <h1> → hero title
 *
 * Instance 2 (.Home_campaignBanner__hPAws): Campaign banner
 *   - <picture> → background image
 *   - <h2> → campaign title
 *   - <p class="Home_campaignDescription__RmMab"> → description
 *   - <a> → CTA link
 *
 * Instance 3 (.Home_eventCarouselBanner__DfR_P): Events hero
 *   - <picture> within EventCarouselCard → background image
 *   - <h4> → event title
 *   - EventDateAndTime div → date/time/location details
 *   - <a> links → CTA links (View Event Details, View All Events)
 */
export default function heroParser(element, { document }) {
  // Extract the main image
  const picture = element.querySelector('picture');
  const img = picture ? picture.querySelector('img') : null;

  // Extract heading (h1, h2, or h4 depending on instance)
  const heading = element.querySelector('h1, h2, h4, [class*="Title"]');

  // Extract description text
  const description = element.querySelector(
    '[class*="Description"], [class*="campaignText"] p, [class*="eventDateAndTime"]',
  );

  // Extract CTA links
  const ctas = element.querySelectorAll('a[href]');

  // Build the block cells
  const cells = [['Hero']];

  // Row 1: Image
  if (img) {
    const imgEl = document.createElement('img');
    imgEl.src = img.src || img.getAttribute('src');
    imgEl.alt = img.alt || '';
    cells.push([imgEl]);
  }

  // Row 2: Text content (heading + description + CTAs)
  const contentCell = document.createElement('div');
  if (heading) {
    const h = document.createElement(heading.tagName.toLowerCase() === 'h1' ? 'h1' : 'h2');
    h.textContent = heading.textContent.trim();
    contentCell.appendChild(h);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    contentCell.appendChild(p);
  }
  if (ctas.length > 0) {
    const p = document.createElement('p');
    ctas.forEach((cta) => {
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      p.appendChild(document.createTextNode(' '));
    });
    contentCell.appendChild(p);
  }
  cells.push([contentCell]);

  return WebImporter.Blocks.createBlock(document, cells);
}
