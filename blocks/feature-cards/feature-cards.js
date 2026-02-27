import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function getVisibleCount() {
  const vw = window.innerWidth;
  if (vw >= 1200) return 4;
  if (vw >= 900) return 3;
  if (vw >= 600) return 2;
  return 1;
}

function getCardStep(items) {
  if (items.length < 2) return items[0].offsetWidth;
  return items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left;
}

function buildCarouselNav(block, ul) {
  const items = ul.querySelectorAll('li');
  const totalItems = items.length;
  const abortController = new AbortController();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', 'Featured cards');
  ul.setAttribute('aria-label', 'Cards');

  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'feature-cards-live-region';
  block.append(liveRegion);

  const prevBtn = document.createElement('button');
  prevBtn.className = 'feature-cards-arrow feature-cards-arrow-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'feature-cards-arrow feature-cards-arrow-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '&#10095;';

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'feature-cards-dots';
  dotsContainer.setAttribute('role', 'tablist');
  dotsContainer.setAttribute('aria-label', 'Card position');

  function buildDots() {
    dotsContainer.innerHTML = '';
    const visibleCount = getVisibleCount();
    const dotCount = Math.max(1, totalItems - visibleCount + 1);
    for (let i = 0; i < dotCount; i += 1) {
      const dot = document.createElement('button');
      dot.className = 'feature-cards-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to position ${i + 1}`);
      dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        const cardWidth = getCardStep(items);
        ul.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
      });
      dotsContainer.append(dot);
    }
  }

  buildDots();

  const updateDots = () => {
    const { scrollLeft } = ul;
    const cardWidth = getCardStep(items);
    const activeIndex = Math.round(scrollLeft / cardWidth);
    const visibleCount = getVisibleCount();
    dotsContainer.querySelectorAll('.feature-cards-dot').forEach((dot, i) => {
      const isActive = i === activeIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
    liveRegion.textContent = `Showing cards ${activeIndex + 1} to ${Math.min(activeIndex + visibleCount, totalItems)} of ${totalItems}`;
  };
  ul.addEventListener('scroll', updateDots, { passive: true, signal: abortController.signal });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      updateDots();
    }, 150);
  }, { signal: abortController.signal });

  prevBtn.addEventListener('click', () => {
    ul.scrollBy({ left: -getCardStep(items), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    ul.scrollBy({ left: getCardStep(items), behavior: 'smooth' });
  });

  const nav = document.createElement('div');
  nav.className = 'feature-cards-nav';
  nav.append(prevBtn, dotsContainer, nextBtn);
  block.append(nav);
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    if (index === 0) {
      li.classList.add('feature-cards-featured');
    } else {
      li.dataset.number = String(index).padStart(2, '0');
    }
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'feature-cards-image';
      } else {
        div.className = 'feature-cards-body';
      }
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
  buildCarouselNav(block, ul);
}
