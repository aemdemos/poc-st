# Hero Block Critique Report

**Source:** https://jobs.army.mod.uk/
**Block:** Hero
**Date:** 2026-02-26
**Iterations:** 2
**Final Holistic Similarity:** ~85% (Good)

---

## Summary

The hero block was critiqued by comparing the migrated Edge Delivery Services version against the original British Army website. Two iterations of inspection, comparison, and CSS fixes were performed.

The original site packages the hero image, heading, and orange CTA section as one monolithic component. In Edge Delivery Services, this is decomposed into two modular blocks — `hero` (image + heading) and `columns` (CTA section) — connected visually via CSS adjacency selectors. This is the correct EDS pattern for author-friendly content.

---

## Differences Found (Initial)

| # | Issue | Priority | Status |
|---|-------|----------|--------|
| 1 | Hero missing rounded bottom corners | High | Fixed |
| 2 | Hero too short (400px vs original ~800px) | High | Fixed |
| 3 | No tablet breakpoint | Medium | Fixed |
| 4 | Orange CTA section not visually connected | High | Fixed |
| 5 | CTA buttons wrong style (orange instead of white) | High | Fixed |
| 6 | H1 font-size mismatch flagged by comparator | High | False positive (viewport mismatch) |

---

## Fixes Applied

### 1. Hero rounded bottom corners (`hero.css`)
```css
/* Before */
.hero {
  overflow: hidden;
}

/* After */
.hero {
  overflow: hidden;
  border-radius: 0 0 30px 30px;
}
```

### 2. Hero height increased (`hero.css`)
```css
/* Before */
.hero { min-height: 400px; }
@media (width >= 900px) { .hero { min-height: 500px; } }
@media (width >= 1200px) { .hero { min-height: 600px; } }

/* After */
.hero { min-height: 500px; }
@media (width >= 600px) { .hero { min-height: 600px; } }   /* NEW tablet */
@media (width >= 900px) { .hero { min-height: 700px; } }
@media (width >= 1200px) { .hero { min-height: 800px; } }
```

### 3. Orange CTA section on columns after hero (`columns.css`)
```css
/* NEW — Hero CTA variant */
.hero-container + .columns-container > .columns-wrapper {
  background-color: var(--accent-color);    /* #ff661c orange */
  border-radius: 0 0 30px 30px;
  padding: 60px 30px;
  margin-top: -20px;                        /* overlaps hero slightly */
}
```

### 4. CTA headings styled to match original (`columns.css`)
```css
.hero-container + .columns-container > .columns-wrapper .columns h2 {
  font-family: var(--heading-font-family);
  font-size: var(--heading-font-size-m);
  text-transform: none;                     /* Original uses sentence case */
}
```

### 5. CTA buttons as white-filled on orange (`columns.css`)
```css
.hero-container + .columns-container > .columns-wrapper .columns p a {
  background-color: var(--white);
  border-color: var(--white);
  color: var(--text-color);
  width: 100%;
  text-align: center;
}
```

### 6. Desktop adjustments for CTA section (`columns.css`)
```css
@media (width >= 900px) {
  .hero-container + .columns-container > .columns-wrapper {
    padding: 80px 30px 60px;
  }

  .hero-container + .columns-container > .columns-wrapper .columns > div > div + div {
    border-top: none;
    border-left: 1px solid rgb(0 0 0 / 15%);
    padding-left: 40px;
  }
}
```

---

## Verified CSS Properties

All key properties now match the original:

| Property | Original | Migrated | Match |
|----------|----------|----------|-------|
| H1 font-family | Bebas Neue Pro | Bebas Neue Pro | Yes |
| H1 font-size (desktop) | 120px | 120px | Yes |
| H1 font-weight | 700 | 700 | Yes |
| H1 text-transform | uppercase | uppercase | Yes |
| H1 color | white | white | Yes |
| Hero border-radius | 0 0 30px 30px | 0 0 30px 30px | Yes |
| Hero image height (desktop) | ~800px | 800px min | Yes |
| CTA background-color | rgb(255, 102, 28) | rgb(255, 102, 28) | Yes |
| CTA border-radius | 0 0 30px 30px | 0 0 30px 30px | Yes |
| CTA padding (desktop) | 80px 30px 60px | 80px 30px 60px | Yes |
| CTA button background | white | white | Yes |
| CTA button width | full-width | full-width | Yes |

---

## Files Changed

| File | Changes |
|------|---------|
| `blocks/hero/hero.css` | Added border-radius, increased min-heights, added tablet breakpoint |
| `blocks/columns/columns.css` | Added hero CTA variant section (lines 77–123) |

---

## Complete File Contents

### `blocks/hero/hero.css`

```css
/* Hero Block — Full-width background image with overlaid content */

/* Container: remove section constraints for full-bleed */
.hero-container {
  max-width: unset;
  padding: 0;
}

.hero-container > div {
  max-width: unset;
  padding: 0;
}

/* Block wrapper */
.hero {
  position: relative;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px 24px;
  overflow: hidden;
  border-radius: 0 0 30px 30px;
}

/* Background image layer */
.hero picture {
  position: absolute;
  z-index: 0;
  inset: 0;
}

.hero img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

/* Dark gradient overlay for text readability */
.hero > div:first-child {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero > div:first-child::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgb(0 0 0 / 60%) 0%, transparent 60%);
  z-index: 1;
}

/* Content layer */
.hero > div:last-child {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* Hero heading */
.hero h1,
.hero h2 {
  color: var(--white);
  margin-bottom: 16px;
  text-shadow: 0 2px 8px rgb(0 0 0 / 30%);
}

.hero h1 {
  font-size: var(--heading-font-size-xxl);
  line-height: 0.8;
}

.hero h2 {
  font-size: var(--heading-font-size-xl);
  line-height: 0.8;
}

/* Hero paragraph text */
.hero p {
  color: var(--white);
  max-width: 600px;
  margin-bottom: 16px;
}

/* Hero CTA buttons */
.hero a {
  color: var(--text-color);
  text-decoration: none;
}

.hero p a {
  display: inline-block;
  padding: var(--button-padding);
  font-family: var(--button-font-family);
  font-size: var(--button-font-size);
  font-weight: var(--button-font-weight);
  letter-spacing: var(--button-letter-spacing);
  text-transform: var(--button-text-transform);
  text-decoration: none;
  line-height: 1;
  border: 2px solid var(--accent-color);
  background-color: var(--accent-color);
  color: var(--text-color);
  transition: var(--button-transition);
}

/* Multiple CTAs in the same paragraph */
.hero p a + a {
  margin-left: 12px;
  background-color: transparent;
  border-color: var(--white);
  color: var(--white);
}

.hero p a:hover {
  background-color: var(--accent-hover-color);
  border-color: var(--accent-hover-color);
}

.hero p a + a:hover {
  background-color: var(--white);
  color: var(--text-color);
}

/* Tablet */
@media (width >= 600px) {
  .hero {
    min-height: 600px;
    padding: 60px 32px;
  }
}

/* Desktop */
@media (width >= 900px) {
  .hero {
    min-height: 700px;
    padding: 60px 32px;
  }
}

@media (width >= 1200px) {
  .hero {
    min-height: 800px;
    padding: 80px 60px;
  }
}
```

### `blocks/columns/columns.css`

```css
/* Columns Block */

.columns > div {
  display: flex;
  flex-direction: column;
}

.columns img {
  width: 100%;
}

.columns > div > div {
  order: 1;
  padding: 24px 0;
}

.columns > div > div + div {
  border-top: 1px solid rgb(0 0 0 / 10%);
}

.columns > div > .columns-img-col {
  order: 0;
}

.columns > div > .columns-img-col img {
  display: block;
}

/* Heading styling within columns */
.columns h2 {
  font-size: var(--heading-font-size-m);
  margin-bottom: 12px;
}

/* Button links within columns */
.columns p a {
  display: inline-block;
  padding: var(--button-padding);
  font-family: var(--button-font-family);
  font-size: var(--button-font-size);
  font-weight: var(--button-font-weight);
  letter-spacing: var(--button-letter-spacing);
  text-transform: var(--button-text-transform);
  text-decoration: none;
  line-height: 1;
  border: 2px solid var(--accent-color);
  background-color: var(--accent-color);
  color: var(--text-color);
  transition: var(--button-transition);
}

.columns p a:hover {
  background-color: var(--accent-hover-color);
  border-color: var(--accent-hover-color);
}

@media (width >= 900px) {
  .columns > div {
    align-items: flex-start;
    flex-direction: unset;
    gap: 40px;
  }

  .columns > div > div {
    flex: 1;
    order: unset;
    padding: 0;
  }

  .columns > div > div + div {
    border-top: none;
    border-left: 1px solid rgb(0 0 0 / 10%);
    padding-left: 40px;
  }
}

/* ============================================================
   Hero CTA variant — columns directly after hero
   The original site integrates an orange CTA section within
   the hero. In EDS this is a separate columns block, so we
   style it to visually connect with the hero above.
   ============================================================ */
.hero-container + .columns-container > .columns-wrapper {
  background-color: var(--accent-color);
  border-radius: 0 0 30px 30px;
  padding: 60px 30px;
  margin-top: -20px;
}

.hero-container + .columns-container > .columns-wrapper .columns > div > div + div {
  border-top-color: rgb(0 0 0 / 15%);
}

.hero-container + .columns-container > .columns-wrapper .columns h2 {
  font-family: var(--heading-font-family);
  font-size: var(--heading-font-size-m);
  text-transform: none;
}

.hero-container + .columns-container > .columns-wrapper .columns p a {
  background-color: var(--white);
  border-color: var(--white);
  color: var(--text-color);
  width: 100%;
  text-align: center;
}

.hero-container + .columns-container > .columns-wrapper .columns p a:hover {
  background-color: var(--background-color);
  border-color: var(--background-color);
}

@media (width >= 900px) {
  .hero-container + .columns-container > .columns-wrapper {
    padding: 80px 30px 60px;
  }

  .hero-container + .columns-container > .columns-wrapper .columns > div > div + div {
    border-top: none;
    border-left: 1px solid rgb(0 0 0 / 15%);
    padding-left: 40px;
  }
}
```

---

## Architectural Note

The original British Army site is built with Next.js and uses a single monolithic `Home_hero` React component that includes:
1. Background image with overflow-hidden rounded corners
2. Absolutely positioned h1 heading
3. An integrated orange CTA section with two columns and buttons

In Edge Delivery Services, content is modular and author-friendly. The same visual result is achieved with two separate blocks:
- **Hero block** — Background image + gradient overlay + heading
- **Columns block** — Two-column CTA with "A job like no other" / "Make a difference"

These are visually connected using the CSS adjacency selector:
```css
.hero-container + .columns-container > .columns-wrapper { ... }
```

This ensures the orange CTA section only appears when a columns block immediately follows a hero block, maintaining clean separation of concerns while preserving visual fidelity.

---

## Lint Status

All CSS files pass stylelint with zero errors.
