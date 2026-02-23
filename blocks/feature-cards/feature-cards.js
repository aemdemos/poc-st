import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function getVisibleCount() {
  const vw = window.innerWidth;
  if (vw >= 1200) return 4;
  if (vw >= 900) return 3;
  if (vw >= 600) return 2;
  return 1;
}

function buildCarouselNav(block, ul) {
  const items = ul.querySelectorAll('li');
  const totalItems = items.length;

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

  function buildDots() {
    dotsContainer.innerHTML = '';
    const visibleCount = getVisibleCount();
    const dotCount = Math.max(1, totalItems - visibleCount + 1);
    for (let i = 0; i < dotCount; i += 1) {
      const dot = document.createElement('button');
      dot.className = 'feature-cards-dot';
      dot.setAttribute('aria-label', `Go to position ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        const cardWidth = items[0].offsetWidth + 20;
        ul.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
      });
      dotsContainer.append(dot);
    }
  }

  buildDots();

  const updateDots = () => {
    const { scrollLeft } = ul;
    const cardWidth = items[0].offsetWidth + 20;
    const activeIndex = Math.round(scrollLeft / cardWidth);
    dotsContainer.querySelectorAll('.feature-cards-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  };
  ul.addEventListener('scroll', updateDots, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      updateDots();
    }, 150);
  });

  prevBtn.addEventListener('click', () => {
    const cardWidth = items[0].offsetWidth + 20;
    ul.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    const cardWidth = items[0].offsetWidth + 20;
    ul.scrollBy({ left: cardWidth, behavior: 'smooth' });
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
