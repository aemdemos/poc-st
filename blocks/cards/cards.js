import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const isMobile = window.matchMedia('(max-width: 599.98px)');

function getCardStep(items) {
  if (items.length < 2) return items[0].offsetWidth;
  return items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left;
}

function buildCarouselNav(block, ul) {
  const items = ul.querySelectorAll('li');
  if (items.length < 2) return null;

  const totalItems = items.length;
  const abortController = new AbortController();

  const variantName = block.classList.contains('journey') ? 'Journey cards' : 'Recommended cards';
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', variantName);
  ul.setAttribute('aria-label', 'Cards');

  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'cards-carousel-live-region';
  block.append(liveRegion);

  const prevBtn = document.createElement('button');
  prevBtn.className = 'cards-carousel-arrow cards-carousel-arrow-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'cards-carousel-arrow cards-carousel-arrow-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '&#10095;';

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'cards-carousel-dots';
  dotsContainer.setAttribute('role', 'tablist');
  dotsContainer.setAttribute('aria-label', 'Card position');

  for (let i = 0; i < totalItems; i += 1) {
    const dot = document.createElement('button');
    dot.className = 'cards-carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to card ${i + 1}`);
    dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      const cardWidth = getCardStep(items);
      ul.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
    });
    dotsContainer.append(dot);
  }

  const updateDots = () => {
    const { scrollLeft } = ul;
    const cardWidth = getCardStep(items);
    const activeIndex = Math.round(scrollLeft / cardWidth);
    dotsContainer.querySelectorAll('.cards-carousel-dot').forEach((dot, i) => {
      const isActive = i === activeIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
    liveRegion.textContent = `Showing card ${activeIndex + 1} of ${totalItems}`;
  };
  ul.addEventListener('scroll', updateDots, { passive: true, signal: abortController.signal });

  prevBtn.addEventListener('click', () => {
    ul.scrollBy({ left: -getCardStep(items), behavior: 'smooth' });
  }, { signal: abortController.signal });

  nextBtn.addEventListener('click', () => {
    ul.scrollBy({ left: getCardStep(items), behavior: 'smooth' });
  }, { signal: abortController.signal });

  const nav = document.createElement('div');
  nav.className = 'cards-carousel-nav';
  nav.append(prevBtn, dotsContainer, nextBtn);
  block.append(nav);

  return abortController;
}

function destroyCarouselNav(block) {
  const nav = block.querySelector('.cards-carousel-nav');
  if (nav) nav.remove();
  const liveRegion = block.querySelector('.cards-carousel-live-region');
  if (liveRegion) liveRegion.remove();

  block.removeAttribute('role');
  block.removeAttribute('aria-roledescription');
  block.removeAttribute('aria-label');
  const ul = block.querySelector('ul');
  if (ul) {
    ul.removeAttribute('aria-label');
    ul.scrollTo({ left: 0 });
  }
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const isExternal = img.src && !img.src.startsWith(window.location.origin);
    if (!isExternal) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
  block.textContent = '';
  block.append(ul);

  /* Mobile carousel for journey & recommended variants */
  const hasCarouselVariant = block.classList.contains('journey')
    || block.classList.contains('recommended');

  if (hasCarouselVariant) {
    let abortController = null;

    const enableCarousel = () => {
      block.classList.add('cards-carousel');
      abortController = buildCarouselNav(block, ul);
    };

    const disableCarousel = () => {
      block.classList.remove('cards-carousel');
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
      destroyCarouselNav(block);
    };

    if (isMobile.matches) enableCarousel();

    isMobile.addEventListener('change', (e) => {
      if (e.matches) enableCarousel();
      else disableCarousel();
    });
  }
}
