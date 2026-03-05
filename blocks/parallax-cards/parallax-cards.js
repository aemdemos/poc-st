import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const DESKTOP_BREAKPOINT = 900;
const CARD_GAP = 340;
const CARD_BODY_TRAVEL = 500;

function isDesktop() {
  return window.innerWidth >= DESKTOP_BREAKPOINT;
}

function createProgressBar(section) {
  const container = document.createElement('div');
  container.className = 'parallax-cards-progress';
  const bar = document.createElement('div');
  bar.className = 'parallax-cards-progress-bar';
  container.append(bar);
  section.append(container);
  return { container, bar };
}

function setupParallaxAnimation(block) {
  const section = block.closest('.section');
  if (!section) return;

  const ul = block.querySelector('ul');
  if (!ul) return;

  const cards = ul.querySelectorAll(':scope > li');
  if (cards.length === 0) return;

  const cardBodies = Array.from(cards).map(
    (card) => card.querySelector('.parallax-cards-card-body'),
  );

  const { container: progressContainer, bar: progressBar } = createProgressBar(section);

  function calculateLayout() {
    if (!isDesktop()) {
      section.style.minHeight = '';
      cardBodies.forEach((body) => {
        if (body) body.style.transform = '';
      });
      return;
    }

    const vh = window.innerHeight;
    const cardCount = cards.length;
    const totalHeight = vh + (cardCount * vh * 0.8) + ((cardCount - 1) * CARD_GAP);
    section.style.minHeight = `${totalHeight}px`;

    cardBodies.forEach((body) => {
      if (body) body.style.transform = `translate3d(0, ${CARD_BODY_TRAVEL}px, 0)`;
    });
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (!isDesktop()) return;

      const sectionRect = section.getBoundingClientRect();
      const sectionTop = -sectionRect.top;
      const sectionHeight = section.offsetHeight;
      const vh = window.innerHeight;
      const totalScrollable = sectionHeight - vh;

      // Overall progress for progress bar
      const overallProgress = Math.max(0, Math.min(1, sectionTop / totalScrollable));
      const bgPos = 100 - (overallProgress * 200);
      progressBar.style.backgroundPosition = `0% ${bgPos}%`;

      // Per-card body animation
      const animStart = vh;
      const animEnd = vh * 0.3;

      cards.forEach((card, i) => {
        const body = cardBodies[i];
        if (!body) return;

        const cardTop = card.getBoundingClientRect().top;

        if (cardTop >= animStart) {
          body.style.transform = `translate3d(0, ${CARD_BODY_TRAVEL}px, 0)`;
        } else if (cardTop <= animEnd) {
          body.style.transform = 'translate3d(0, 0, 0)';
        } else {
          const progress = 1 - ((cardTop - animEnd) / (animStart - animEnd));
          const yOffset = CARD_BODY_TRAVEL * (1 - progress);
          body.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        }
      });
    });
  }

  // Show/hide progress bar when section is in view
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      progressContainer.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: 0 });
  sectionObserver.observe(section);

  window.addEventListener('scroll', onScroll, { passive: true });
  calculateLayout();
  onScroll();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      calculateLayout();
      onScroll();
    }, 150);
  });
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'parallax-cards-card-image';
      else div.className = 'parallax-cards-card-body';
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

  // Initialize parallax animation on desktop
  if (isDesktop() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setupParallaxAnimation(block);
  }
}
