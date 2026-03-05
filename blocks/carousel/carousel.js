import { moveInstrumentation } from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/placeholders.js';

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.classList.toggle('active', idx === slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

export function showSlide(block, slideIndex = 0, behavior = 'smooth') {
  const slides = block.querySelectorAll('.carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  activeSlide.scrollIntoView({ behavior, inline: 'center', block: 'nearest' });
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.6 });
  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

/* ---- Slick mode: transform-based track with cloned slides for infinite loop ---- */

function initSlickMode(block) {
  const container = block.querySelector('.carousel-slides-container');
  const slidesWrapper = block.querySelector('.carousel-slides');
  const originalSlides = [...slidesWrapper.querySelectorAll('.carousel-slide')];
  const totalSlides = originalSlides.length;
  if (totalSlides < 2) return;

  // Clone slides on each side for infinite loop and peek fill
  const clonesPerSide = Math.min(totalSlides, 3);

  // Prepend clones of the last N slides (insertBefore preserves left-to-right order)
  const firstRealSlide = originalSlides[0];
  for (let i = 0; i < clonesPerSide; i += 1) {
    const srcIndex = totalSlides - clonesPerSide + i;
    const clone = originalSlides[srcIndex].cloneNode(true);
    clone.classList.add('carousel-slide-clone');
    clone.removeAttribute('id');
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
    slidesWrapper.insertBefore(clone, firstRealSlide);
  }

  // Append clones of the first N slides
  for (let i = 0; i < clonesPerSide; i += 1) {
    const clone = originalSlides[i].cloneNode(true);
    clone.classList.add('carousel-slide-clone');
    clone.removeAttribute('id');
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
    slidesWrapper.append(clone);
  }

  let currentIndex = 0;
  let isTransitioning = false;

  function getSlideWidth() {
    return originalSlides[0].offsetWidth;
  }

  function getTrackOffset(index) {
    const slideWidth = getSlideWidth();
    const containerWidth = container.offsetWidth;
    const domIndex = index + clonesPerSide;
    return -(domIndex * slideWidth) + (containerWidth - slideWidth) / 2;
  }

  function setTrackPosition(offset, animate) {
    slidesWrapper.style.transition = animate ? 'transform 0.4s ease' : 'none';
    slidesWrapper.style.transform = `translate3d(${offset}px, 0, 0)`;
  }

  function updateActiveState(index) {
    const norm = ((index % totalSlides) + totalSlides) % totalSlides;

    // Clear all slides (real + clones)
    slidesWrapper.querySelectorAll('.carousel-slide').forEach((slide) => {
      slide.classList.remove('active');
      slide.setAttribute('aria-hidden', 'true');
      slide.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
    });

    // Activate the real slide
    originalSlides[norm].classList.add('active');
    originalSlides[norm].setAttribute('aria-hidden', 'false');
    originalSlides[norm].querySelectorAll('a').forEach((a) => a.removeAttribute('tabindex'));

    // Update dot indicators
    block.querySelectorAll('.carousel-slide-indicator').forEach((ind, idx) => {
      const btn = ind.querySelector('button');
      if (idx === norm) btn.setAttribute('disabled', 'true');
      else btn.removeAttribute('disabled');
    });

    block.dataset.activeSlide = norm;
  }

  function goToSlide(index, animate = true) {
    if (isTransitioning && animate) return;
    currentIndex = index;
    if (animate) isTransitioning = true;
    setTrackPosition(getTrackOffset(index), animate);
    updateActiveState(index);
  }

  // Seamless wrap: after animating to a clone, jump instantly to the real slide
  slidesWrapper.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (currentIndex < 0) {
      currentIndex = totalSlides + currentIndex;
      goToSlide(currentIndex, false);
    } else if (currentIndex >= totalSlides) {
      currentIndex -= totalSlides;
      goToSlide(currentIndex, false);
    }
  });

  // Arrow navigation
  const prevBtn = block.querySelector('.slide-prev');
  const nextBtn = block.querySelector('.slide-next');
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Dot navigation
  block.querySelectorAll('.carousel-slide-indicator button').forEach((button) => {
    button.addEventListener('click', () => {
      const idx = parseInt(button.closest('.carousel-slide-indicator').dataset.targetSlide, 10);
      goToSlide(idx);
    });
  });

  // Touch / drag support
  let startX = 0;
  let dragDelta = 0;
  let isDragging = false;
  let baseOffset = 0;
  let wasDragged = false;

  slidesWrapper.addEventListener('pointerdown', (e) => {
    if (isTransitioning) return;
    isDragging = true;
    wasDragged = false;
    startX = e.clientX;
    dragDelta = 0;
    baseOffset = getTrackOffset(currentIndex);
    slidesWrapper.style.transition = 'none';
    slidesWrapper.setPointerCapture(e.pointerId);
    slidesWrapper.classList.add('dragging');
  });

  slidesWrapper.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    dragDelta = e.clientX - startX;
    if (Math.abs(dragDelta) > 5) wasDragged = true;
    slidesWrapper.style.transform = `translate3d(${baseOffset + dragDelta}px, 0, 0)`;
  });

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    slidesWrapper.classList.remove('dragging');
    const threshold = getSlideWidth() * 0.15;
    if (dragDelta > threshold) goToSlide(currentIndex - 1);
    else if (dragDelta < -threshold) goToSlide(currentIndex + 1);
    else goToSlide(currentIndex);
    dragDelta = 0;
  }

  slidesWrapper.addEventListener('pointerup', endDrag);
  slidesWrapper.addEventListener('pointercancel', endDrag);

  // Prevent accidental link clicks after a drag gesture
  slidesWrapper.addEventListener('click', (e) => {
    if (wasDragged) {
      e.preventDefault();
      e.stopPropagation();
      wasDragged = false;
    }
  }, true);

  // Initial position after layout is ready
  requestAnimationFrame(() => goToSlide(0, false));

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goToSlide(currentIndex, false), 150);
  });
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class= "slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;

    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    if (block.classList.contains('slick')) {
      initSlickMode(block);
    } else {
      bindEvents(block);
    }
  }
}
