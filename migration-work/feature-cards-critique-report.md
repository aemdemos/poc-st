# Feature-Cards Block Critique Report

**Block:** `feature-cards`
**Page:** `content/index`
**Source:** https://jobs.army.mod.uk/ (original section no longer present on live site)
**Date:** 2026-02-26

---

## What's Working Well

- Dark carousel layout renders correctly at all breakpoints (mobile 1 card / tablet 2 / medium 3 / desktop 4)
- Featured card differentiation (white accent line, larger heading) works
- Numbered overlay cards (01-05) display with correct transparent stroke effect
- Carousel navigation (arrows + dots) functions correctly with scroll-snap
- Images load from Storyblok CDN with proper `object-fit: cover`
- Bebas Neue Pro heading font renders with proper uppercase transformation
- 6 cards total, all with images loaded and alt text present

---

## Issues Found and Fixed

### CSS Fixes (`blocks/feature-cards/feature-cards.css`)

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | HIGH | **Double padding** — Section wrapper div applied 24-32px padding, block added another 20px, wasting 44-52px per side | Override wrapper: `main > .section.feature-cards-container > div { max-width: none; padding: 0; }` |
| 2 | HIGH | **box-sizing: content-box with max-width + padding** — Total visual width could exceed max-width at edge viewports | Added `box-sizing: border-box` to `.feature-cards` |
| 3 | LOW | **Container margin gap** — Global `main > .section { margin: 40px 0 }` created beige gaps around the dark section | Override: `main > .section.feature-cards-container { margin: 0; }` |
| 4 | LOW | **Deprecated `clip` property** — Used `clip: rect(0 0 0 0)` in screen-reader-only class | Replaced with `clip-path: inset(50%)` |

### JS Fixes (`blocks/feature-cards/feature-cards.js`)

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 5 | MEDIUM | **Hardcoded 20px gap** — `items[0].offsetWidth + 20` used in 4 places for scroll calculations; breaks if CSS gap changes | New `getCardStep(items)` helper computes step dynamically from DOM positions |
| 6 | MEDIUM | **Missing ARIA carousel pattern** — No semantic carousel markup for screen readers | Added `role="region"`, `aria-roledescription="carousel"`, `aria-label` on block; `role="tablist"` on dots container; `role="tab"` + `aria-current` on each dot; `aria-live="polite"` region announcing "Showing cards X to Y of Z" |
| 7 | LOW | **No event listener cleanup** — `window.resize` and `ul.scroll` listeners never removed | Added `AbortController` with `{ signal }` option on all window/ul event listeners |

---

## Files Changed

### `blocks/feature-cards/feature-cards.css`

**Added** (lines 4-14) — Section-level overrides with sufficient specificity:
```css
main > .section.feature-cards-container {
  background-color: #3f3f3f;
  margin: 0;
  padding: 40px 0;
}

main > .section.feature-cards-container > div {
  max-width: none;
  padding: 0;
}
```

**Changed** (line 21) — Added `box-sizing: border-box` to `.feature-cards`

**Added** (lines 25-36) — Visually-hidden live region for screen readers:
```css
.feature-cards-live-region {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

### `blocks/feature-cards/feature-cards.js`

**Added** (lines 12-15) — Dynamic card step calculation:
```js
function getCardStep(items) {
  if (items.length < 2) return items[0].offsetWidth;
  return items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().left;
}
```

**Added** (lines 20-31) — AbortController and ARIA attributes:
```js
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
```

**Changed** — Dots container and individual dots now have ARIA roles:
```js
dotsContainer.setAttribute('role', 'tablist');
dotsContainer.setAttribute('aria-label', 'Card position');

// Each dot:
dot.setAttribute('role', 'tab');
dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
```

**Changed** — `updateDots()` now updates `aria-current` and the live region:
```js
dot.setAttribute('aria-current', isActive ? 'true' : 'false');
liveRegion.textContent = `Showing cards ${activeIndex + 1} to ${Math.min(activeIndex + visibleCount, totalItems)} of ${totalItems}`;
```

**Changed** — All event listeners use `{ signal: abortController.signal }` for cleanup

---

## Verification

Tested at three viewport widths:
- **Desktop (1400px):** 4 cards visible, carousel scrolls correctly, dots update
- **Tablet (768px):** 2 cards visible, responsive breakpoint works
- **Mobile (390px):** 1 card visible with peek of next card, 6 dots shown

All ARIA attributes confirmed in accessibility snapshot:
- Block renders as `region "Featured cards"`
- Dots render as `tablist "Card position"` with `tab` items
- Live region announces position on scroll (e.g., "Showing cards 2 to 5 of 6")
