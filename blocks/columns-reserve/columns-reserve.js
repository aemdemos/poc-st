export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-reserve-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col, index) => {
      // Left column: sidebar with map image
      if (index === 0) {
        col.classList.add('columns-reserve-sidebar');
        const pic = col.querySelector('picture');
        if (pic) {
          const picWrapper = pic.closest('div') || pic.parentElement;
          if (picWrapper) {
            picWrapper.classList.add('columns-reserve-map');
          }
        }
        // Style directions link
        const dirLink = col.querySelector('a[href*="google.co.uk/maps"], a[href*="google.com/maps"]');
        if (dirLink) {
          dirLink.classList.add('columns-reserve-directions');
        }
      }

      // Right column: unit cards
      if (index === 1) {
        col.classList.add('columns-reserve-units');

        // EDS flattens nested divs, so card content arrives flat.
        // Rebuild card structure by finding card header paragraphs
        // (paragraphs that contain a badge image = start of a new card).
        const children = [...col.children];
        const cardGroups = [];
        let currentGroup = null;

        children.forEach((child) => {
          const isCardHeader = child.tagName === 'P'
            && child.querySelector('img')
            && child.textContent.trim().length > 0;

          if (isCardHeader) {
            // Start a new card group
            currentGroup = { header: child, content: [] };
            cardGroups.push(currentGroup);
          } else if (currentGroup) {
            // Add to current card's content
            currentGroup.content.push(child);
          }
          // Elements before the first card header (e.g. <h2>) stay in place
        });

        // Wrap each card group into the structure the CSS expects
        cardGroups.forEach((group) => {
          const card = document.createElement('div');
          card.classList.add('columns-reserve-unit-card');

          // Header (clickable)
          group.header.classList.add('columns-reserve-unit-header');
          card.appendChild(group.header);

          // Content (expandable)
          const contentDiv = document.createElement('div');
          contentDiv.classList.add('columns-reserve-unit-content');
          group.content.forEach((el) => contentDiv.appendChild(el));
          card.appendChild(contentDiv);

          col.appendChild(card);

          // Accordion toggle
          group.header.addEventListener('click', () => {
            const isOpen = card.classList.contains('columns-reserve-unit-open');
            // Close all others
            col.querySelectorAll('.columns-reserve-unit-open').forEach((c) => {
              c.classList.remove('columns-reserve-unit-open');
            });
            if (!isOpen) {
              card.classList.add('columns-reserve-unit-open');
            }
          });
        });
      }
    });
  });
}
