# British Army Design Migration Report

**Source:** https://jobs.army.mod.uk/
**Target:** AEM Edge Delivery Services project
**Date:** 2026-02-25

---

## Summary

Complete design system migration from the British Army Jobs website to Edge Delivery Services.
Two phases were executed:

- **Phase 1:** Site-wide design system (colors, typography, spacing, buttons, sections)
- **Phase 2:** Block-level design (hero, columns, feature-cards)

All CSS files pass stylelint with zero errors.

---

## Files Changed

| File | Phase | Description |
|------|-------|-------------|
| `styles/styles.css` | 1 | Global design tokens and base styles |
| `styles/fonts.css` | 1 | Font loading (Inter + Bebas Neue Pro) |
| `head.html` | 1 | Google Fonts preconnect |
| `fonts/bebas-neue-pro-bold.woff2` | 1 | Self-hosted heading font (bold, 19KB) |
| `fonts/bebas-neue-pro.woff` | 1 | Self-hosted heading font (fallback, 20KB) |
| `blocks/hero/hero.css` | 2 | Full-bleed hero with gradient overlay |
| `blocks/columns/columns.css` | 2 | Side-by-side columns with border separators |
| `blocks/feature-cards/feature-cards.css` | 2 | Dark carousel with portrait cards |

---

## Phase 1: Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background-color` | `#e5e2da` | Warm beige page background |
| `--light-color` | `#f7f7f7` | Light section backgrounds |
| `--dark-color` | `#15171a` | Dark section backgrounds |
| `--text-color` | `#15171a` | Body text |
| `--link-color` | `#15171a` | Link color |
| `--accent-color` | `#ff661c` | Primary orange accent |
| `--accent-hover-color` | `#e5550f` | Orange hover state |
| `--white` | `#fff` | White |
| `--overlay-background-color` | `rgb(0 0 0 / 50%)` | Modal overlays |
| `--olive-accent` | `#a19f7a` | Olive section background |
| `--green-accent` | `#b6b7a8` | Green section background |

### Typography

| Token | Value |
|-------|-------|
| `--body-font-family` | `'Inter', inter-fallback, sans-serif` |
| `--heading-font-family` | `'Bebas Neue Pro', bebas-neue-pro-fallback, sans-serif` |
| `--body-font-size-m` | `20px` |
| `--body-font-size-s` | `18px` |
| `--body-font-size-xs` | `16px` |

### Heading Sizes

| Token | Mobile | Desktop (>=900px) |
|-------|--------|-------------------|
| `--heading-font-size-xxl` | 60px | 120px |
| `--heading-font-size-xl` | 42px | 54px |
| `--heading-font-size-l` | 32px | 42px |
| `--heading-font-size-m` | 28px | 32px |
| `--heading-font-size-s` | 24px | 28px |
| `--heading-font-size-xs` | 20px | 24px |

### Spacing

| Token | Value |
|-------|-------|
| `--spacing-xs` | `8px` |
| `--spacing-s` | `16px` |
| `--spacing-m` | `24px` |
| `--spacing-l` | `40px` |
| `--spacing-xl` | `60px` |
| `--spacing-xxl` | `80px` |

### Button Tokens

| Token | Value |
|-------|-------|
| `--button-font-family` | `var(--heading-font-family)` |
| `--button-font-size` | `20px` |
| `--button-font-weight` | `400` |
| `--button-letter-spacing` | `1px` |
| `--button-text-transform` | `uppercase` |
| `--button-padding` | `20px` |
| `--button-border-radius` | `0` |
| `--button-transition` | `0.2s linear` |

### Button Variants

| Variant | Background | Border | Text Color |
|---------|-----------|--------|------------|
| Primary (default) | `--accent-color` | `--accent-color` | `--text-color` |
| Secondary | `--white` | `--white` | `--text-color` |
| Tertiary | `transparent` | `--white` | `--white` |

### Section Variants

| Class | Background |
|-------|-----------|
| `.section.light` / `.section.highlight` | `--light-color` (#f7f7f7) |
| `.section.dark` | `--dark-color` (#15171a) |
| `.section.olive` | `--olive-accent` (#a19f7a) |
| `.section.green` | `--green-accent` (#b6b7a8) |
| `.section.accent` | `--accent-color` (#ff661c) |

### Fallback Fonts

| Font | Fallback | Size Adjust |
|------|----------|-------------|
| Bebas Neue Pro | Arial Narrow, Arial | 110%, ascent-override 95% |
| Inter | Arial | 107% |

---

## Phase 2: Block Styles

### Hero Block (`blocks/hero/hero.css`)

- Full-bleed background image with absolute positioning
- Dark gradient overlay: `linear-gradient(to top, rgb(0 0 0 / 60%) 0%, transparent 60%)`
- Content positioned at bottom with z-index layering
- CTA buttons: primary orange + secondary outline (white on dark)
- Responsive min-heights: 400px (mobile) -> 500px (tablet) -> 600px (desktop)

### Columns Block (`blocks/columns/columns.css`)

- Mobile: stacked with top border separators
- Desktop (>=900px): side-by-side with left border separators and 40px gap
- Heading size: `--heading-font-size-m`
- Button links styled with accent color tokens

### Feature Cards Block (`blocks/feature-cards/feature-cards.css`)

- Dark carousel (#3f3f3f container, #15171a cards)
- Horizontal scroll with snap points
- Portrait card layout with rounded bottom corners (30px)
- Numbered overlay effect using `-webkit-text-stroke`
- Featured first card with larger heading and white accent bar
- Navigation: arrow buttons + dot indicators
- Responsive card counts: 1 (mobile) -> 2 (600px) -> 3 (900px) -> 4 (1200px)

---

## Complete File Contents

### `head.html`

```html
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<script src="/scripts/aem.js" type="module"></script>
<script src="/scripts/scripts.js" type="module"></script>
<link rel="stylesheet" href="/styles/styles.css"/>
```

### `styles/fonts.css`

```css
/* stylelint-disable max-line-length */

/* Body Font — Inter (Google Fonts, variable weight) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Heading Font — Bebas Neue Pro (self-hosted from original site) */
@font-face {
  font-family: 'Bebas Neue Pro';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('../fonts/bebas-neue-pro-bold.woff2') format('woff2'),
    url('../fonts/bebas-neue-pro.woff') format('woff');
}
```

### `styles/styles.css`

```css
/*
 * British Army Jobs — Edge Delivery Services
 * Design system migrated from jobs.army.mod.uk
 */

:root {
  /* colors */
  --background-color: #e5e2da;
  --light-color: #f7f7f7;
  --dark-color: #15171a;
  --text-color: #15171a;
  --link-color: #15171a;
  --link-hover-color: #15171a;
  --accent-color: #ff661c;
  --accent-hover-color: #e5550f;
  --white: #fff;
  --overlay-background-color: rgb(0 0 0 / 50%);
  --olive-accent: #a19f7a;
  --green-accent: #b6b7a8;

  /* fonts */
  --body-font-family: 'Inter', inter-fallback, sans-serif;
  --heading-font-family: 'Bebas Neue Pro', bebas-neue-pro-fallback, sans-serif;

  /* body sizes */
  --body-font-size-m: 20px;
  --body-font-size-s: 18px;
  --body-font-size-xs: 16px;

  /* heading sizes (mobile-first) */
  --heading-font-size-xxl: 60px;
  --heading-font-size-xl: 42px;
  --heading-font-size-l: 32px;
  --heading-font-size-m: 28px;
  --heading-font-size-s: 24px;
  --heading-font-size-xs: 20px;

  /* nav heights */
  --nav-height: 64px;
  --util-bar-height: 32px;
  --breadcrumbs-height: 34px;
  --header-height: var(--nav-height);

  /* spacing */
  --spacing-xs: 8px;
  --spacing-s: 16px;
  --spacing-m: 24px;
  --spacing-l: 40px;
  --spacing-xl: 60px;
  --spacing-xxl: 80px;

  /* buttons */
  --button-font-family: var(--heading-font-family);
  --button-font-size: 20px;
  --button-font-weight: 400;
  --button-letter-spacing: 1px;
  --button-text-transform: uppercase;
  --button-padding: 20px;
  --button-border-radius: 0;
  --button-transition: 0.2s linear;
}

/* fallback fonts */
@font-face {
  font-family: bebas-neue-pro-fallback;
  size-adjust: 110%;
  ascent-override: 95%;
  src: local('Arial Narrow'), local('Arial');
}

@font-face {
  font-family: inter-fallback;
  size-adjust: 107%;
  src: local('Arial');
}

@media (width >= 900px) {
  :root {
    /* heading sizes (desktop) */
    --heading-font-size-xxl: 120px;
    --heading-font-size-xl: 54px;
    --heading-font-size-l: 42px;
    --heading-font-size-m: 32px;
    --heading-font-size-s: 28px;
    --heading-font-size-xs: 24px;
  }
}

body {
  display: none;
  margin: 0;
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: var(--body-font-family);
  font-size: var(--body-font-size-m);
  line-height: 1.3;
}

body.appear {
  display: block;
}

header {
  height: var(--header-height);
}

header .header,
footer .footer {
  visibility: hidden;
}

header .header[data-block-status="loaded"],
footer .footer[data-block-status="loaded"] {
  visibility: visible;
}

@media (width >= 900px) {
  :root {
    --header-height: calc(var(--nav-height) + var(--util-bar-height));
  }

  body[data-breadcrumbs] {
    --header-height: calc(var(--nav-height) + var(--util-bar-height) + var(--breadcrumbs-height));
  }
}

/* headings */
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  margin-bottom: 0.25em;
  font-family: var(--heading-font-family);
  font-weight: 700;
  line-height: 0.8;
  scroll-margin: 40px;
  text-transform: uppercase;
}

h1 { font-size: var(--heading-font-size-xxl); }
h2 { font-size: var(--heading-font-size-xl); }
h3 { font-size: var(--heading-font-size-l); }
h4 { font-size: var(--heading-font-size-m); }
h5 { font-size: var(--heading-font-size-s); }
h6 { font-size: var(--heading-font-size-xs); }

p,
dl,
ol,
ul,
pre,
blockquote {
  margin-top: 0;
  margin-bottom: 20px;
}

code,
pre {
  font-size: var(--body-font-size-s);
}

pre {
  padding: 16px;
  border-radius: 0;
  background-color: var(--light-color);
  overflow-x: auto;
  white-space: pre;
}

main > div {
  margin: 40px 16px;
}

input,
textarea,
select,
button {
  font: inherit;
}

/* links */
a:any-link {
  color: var(--link-color);
  text-decoration: underline;
  overflow-wrap: break-word;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--link-hover-color);
}

/* buttons */
a.button:any-link,
button {
  box-sizing: border-box;
  display: inline-block;
  max-width: 100%;
  margin: 12px 0;
  border: 2px solid var(--accent-color);
  border-radius: var(--button-border-radius);
  padding: var(--button-padding);
  font-family: var(--button-font-family);
  font-style: normal;
  font-weight: var(--button-font-weight);
  font-size: var(--button-font-size);
  line-height: 1;
  letter-spacing: var(--button-letter-spacing);
  text-align: center;
  text-decoration: none;
  text-transform: var(--button-text-transform);
  background-color: var(--accent-color);
  color: var(--text-color);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: var(--button-transition);
}

a.button:hover,
a.button:focus,
button:hover,
button:focus {
  background-color: var(--accent-hover-color);
  border-color: var(--accent-hover-color);
  cursor: pointer;
}

a.button:focus-visible,
button:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

button:disabled,
button:disabled:hover {
  background-color: var(--light-color);
  border-color: var(--light-color);
  color: #999;
  cursor: unset;
}

/* secondary button — white filled */
a.button.secondary,
button.secondary {
  background-color: var(--white);
  border-color: var(--white);
  color: var(--text-color);
}

a.button.secondary:hover,
a.button.secondary:focus,
button.secondary:hover,
button.secondary:focus {
  background-color: var(--background-color);
  border-color: var(--background-color);
}

/* tertiary button — outline/ghost on dark */
a.button.tertiary,
button.tertiary {
  background-color: transparent;
  border-color: var(--white);
  color: var(--white);
}

a.button.tertiary:hover,
a.button.tertiary:focus,
button.tertiary:hover,
button.tertiary:focus {
  background-color: var(--white);
  color: var(--text-color);
}

main img {
  max-width: 100%;
  width: auto;
  height: auto;
}

.icon {
  display: inline-block;
  height: 24px;
  width: 24px;
}

.icon img {
  height: 100%;
  width: 100%;
}

/* sections */
main > .section {
  margin: 40px 0;
}

main > .section > div {
  max-width: 1200px;
  margin: auto;
  padding: 0 24px;
}

main > .section:first-of-type {
  margin-top: 0;
}

@media (width >= 900px) {
  main > .section > div {
    padding: 0 32px;
  }
}

/* section metadata — light */
main .section.light,
main .section.highlight {
  background-color: var(--light-color);
  margin: 0;
  padding: 40px 0;
}

/* section metadata — dark */
main .section.dark {
  background-color: var(--dark-color);
  color: var(--white);
  margin: 0;
  padding: 40px 0;
}

main .section.dark h1,
main .section.dark h2,
main .section.dark h3,
main .section.dark h4,
main .section.dark h5,
main .section.dark h6 {
  color: var(--white);
}

main .section.dark a:any-link {
  color: var(--white);
}

main .section.dark a.button:any-link {
  color: var(--text-color);
}

/* section metadata — olive/green */
main .section.olive {
  background-color: var(--olive-accent);
  margin: 0;
  padding: 40px 0;
}

main .section.green {
  background-color: var(--green-accent);
  margin: 0;
  padding: 40px 0;
}

/* section metadata — accent (orange) */
main .section.accent {
  background-color: var(--accent-color);
  margin: 0;
  padding: 40px 0;
}
```

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
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px 24px;
  overflow: hidden;
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

/* Desktop */
@media (width >= 900px) {
  .hero {
    min-height: 500px;
    padding: 60px 32px;
  }
}

@media (width >= 1200px) {
  .hero {
    min-height: 600px;
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
```

### `blocks/feature-cards/feature-cards.css`

```css
/* Feature Cards Block - Dark carousel with portrait cards */

/* Section-level dark background */
.feature-cards-container {
  background-color: #3f3f3f;
  padding: 40px 0;
}

/* Block wrapper */
.feature-cards {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
}

/* Card list - horizontal scroll */
.feature-cards ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.feature-cards ul::-webkit-scrollbar {
  display: none;
}

/* Individual card */
.feature-cards li {
  flex: 0 0 280px;
  scroll-snap-align: start;
  background: #15171a;
  border-radius: 0 0 30px 30px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Card image */
.feature-cards .feature-cards-image {
  margin: 0;
  padding: 0;
  line-height: 0;
}

.feature-cards .feature-cards-image picture {
  display: block;
  width: 100%;
}

.feature-cards .feature-cards-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

/* Card body text */
.feature-cards .feature-cards-body {
  padding: 20px;
  color: #fff;
  flex: 1;
}

.feature-cards .feature-cards-body h2 {
  font-size: 32px;
  line-height: 1.1;
  margin: 0 0 10px;
  color: #fff;
}

.feature-cards .feature-cards-body p {
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  color: #ccc;
}

/* Featured card - first card */
.feature-cards .feature-cards-featured .feature-cards-body {
  position: relative;
}

.feature-cards .feature-cards-featured .feature-cards-body::before {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: #fff;
  margin-bottom: 15px;
}

.feature-cards .feature-cards-featured .feature-cards-body h2 {
  font-size: 42px;
}

/* Numbered cards - overlay numbers */
.feature-cards li[data-number]::before {
  content: attr(data-number);
  position: absolute;
  bottom: 60px;
  right: 10px;
  font-size: 150px;
  font-weight: 900;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 2px rgb(255 255 255 / 15%);
  pointer-events: none;
  z-index: 0;
}

/* Navigation row */
.feature-cards-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

/* Arrow buttons */
.feature-cards-arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgb(255 255 255 / 50%);
  background: transparent;
  color: rgb(255 255 255 / 70%);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0;
  flex-shrink: 0;
}

.feature-cards-arrow:hover {
  border-color: #fff;
  color: #fff;
}

/* Dot indicators */
.feature-cards-dots {
  display: flex;
  gap: 10px;
  align-items: center;
}

.feature-cards-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgb(255 255 255 / 50%);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
}

.feature-cards-dot.active {
  background: #fff;
  border-color: #fff;
}

.feature-cards-dot:hover {
  border-color: #fff;
}

/* Tablet breakpoint - 2 cards visible */
@media (width >= 600px) {
  .feature-cards li {
    flex: 0 0 calc(50% - 10px);
  }

  .feature-cards .feature-cards-image img {
    height: 350px;
  }
}

/* Medium breakpoint - 3 cards visible */
@media (width >= 900px) {
  .feature-cards li {
    flex: 0 0 calc(33.333% - 14px);
  }

  .feature-cards .feature-cards-image img {
    height: 400px;
  }
}

/* Desktop breakpoint - 4 cards visible */
@media (width >= 1200px) {
  .feature-cards li {
    flex: 0 0 calc(25% - 15px);
  }

  .feature-cards .feature-cards-featured .feature-cards-body h2 {
    font-size: 54px;
  }

  .feature-cards li[data-number]::before {
    font-size: 200px;
  }
}
```

---

## Lint Status

All files pass `stylelint` with zero errors.

### Fixes Applied

| File | Issue | Fix |
|------|-------|-----|
| `styles/styles.css` | `color-function-alias-notation` | `rgba()` -> `rgb()` |
| `styles/fonts.css` | `no-invalid-position-at-import-rule` | Moved `@import` before `@font-face` |
| `blocks/hero/hero.css` | `no-descending-specificity` | Reordered `.hero p a:hover` after `.hero p a + a` |
| `blocks/feature-cards/feature-cards.css` | `color-function-alias-notation` (x4) | `rgba()` -> `rgb()` |
| `blocks/feature-cards/feature-cards.css` | `media-feature-range-notation` (x3) | `min-width:` -> `width >=` |
