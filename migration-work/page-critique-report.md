# Page Critique Report — content/index

**Original:** https://jobs.army.mod.uk/
**Migrated:** http://localhost:3000/content/index
**Date:** 2026-02-26

---

## Summary

| Metric | Iteration 1 | Iteration 2 |
|--------|-------------|-------------|
| **Overall Similarity** | 85.73% | **88.71%** |
| **Grade** | Good | **Good** |
| **Improvement** | — | +2.98% |
| **Fixes Applied** | 0 | 7 (3 CSS + 3 content + 1 columns overlap) |

---

## Section Similarity Scores

| Section | Iteration 1 | Iteration 2 | Change |
|---------|-------------|-------------|--------|
| Be the Best | 90.00% | **96.11%** | **+6.11%** |
| Events / Officer Insight Day | 95.48% | 95.49% | — |
| Hero — You Belong Here | 94.34% | 94.34% | — |
| Campaign — Do You Have The Instincts? | 93.01% | 93.00% | — |
| Feature Cards carousel | 92.67% | 92.67% | — |
| Find Your Fit / Explore | 78.79% | 79.52% | +0.73% |
| Explore Army Roles (cross-match) | 74.93% | 75.60% | +0.67% |

---

## What's Working Well

- Hero blocks (3 instances) render with full-bleed images, dark gradient overlays, and white text at 93–95% similarity
- Columns CTA section ("A job like no other" / "Make a difference") has correct orange background, white buttons, and connects visually to the hero via negative margin
- Feature cards carousel matches original at 92.67% — dark background, 4-card desktop layout, featured card differentiation, numbered overlays, carousel navigation all working
- Typography system correct — Bebas Neue Pro headings with uppercase transform, Inter body text
- Orange accent color (#ff661c) consistent across all buttons and interactive elements
- Button styling (primary orange, secondary white, tertiary outline) matches original design language
- Responsive breakpoints handle mobile/tablet/desktop transitions for hero and feature-cards blocks

---

## Fixes Applied

### CSS Fixes

#### 1. `styles/styles.css` — Added `.section.bronze` styles

New section metadata variant for the brown/bronze background used on "Be the Best":

```css
main .section.bronze {
  background-color: #8b4513;
  color: var(--white);
  margin: 0;
  padding: 40px 0;
}

main .section.bronze h1,
main .section.bronze h2,
main .section.bronze h3,
main .section.bronze h4,
main .section.bronze h5,
main .section.bronze h6 {
  color: var(--white);
}

main .section.bronze a.button:any-link {
  background-color: rgb(128 128 128 / 70%);
  border-color: rgb(128 128 128 / 70%);
  color: var(--text-color);
  min-width: 280px;
}
```

#### 2. `styles/styles.css` — Added `.section.centered` styles

New section metadata variant for centered text sections (Find Your Fit, Explore Army Roles):

```css
main .section.centered {
  text-align: center;
}

main .section.centered > div {
  padding-top: 60px;
  padding-bottom: 60px;
}

main .section.centered a.button:any-link {
  min-width: 280px;
}
```

#### 3. `blocks/columns/columns.css` — Increased hero-to-columns overlap

```css
/* Changed from margin-top: -20px to -40px */
.hero-container + .columns-container > .columns-wrapper {
  margin: -40px 90px 0;
}
```

### Content Fixes (`content/index.plain.html`)

#### 4. Find Your Fit — Added `centered` section metadata

```html
<div class="section-metadata">
  <div><div>style</div><div>centered</div></div>
</div>
```

#### 5. Be the Best — Added `bronze, centered` section metadata

```html
<div class="section-metadata">
  <div><div>style</div><div>bronze, centered</div></div>
</div>
```

#### 6. Explore Army Roles — Added `centered` section metadata

```html
<div class="section-metadata">
  <div><div>style</div><div>centered</div></div>
</div>
```

---

## Remaining Differences

| # | Section | Severity | Type | Description |
|---|---------|----------|------|-------------|
| 1 | Find Your Fit | MEDIUM | Content | Original has full-width background image (camo pattern). Migrated has plain beige. Requires adding a background image via a custom block or section background support. |
| 2 | Explore Army Roles | MEDIUM | Content | Same issue — original has full-width background image. Migrated has plain beige. |
| 3 | Campaign hero | LOW | Content | Original has video play button overlay not present in migrated. Would need video embed support in hero block. |
| 4 | Find Your Fit heading | LOW | CSS | Original heading is ~150px+. Migrated uses standard h2 sizing (54px desktop). Could increase but would diverge from design token system. |

---

## Files Changed

| File | Changes |
|------|---------|
| `styles/styles.css` | Added `.section.bronze` and `.section.centered` style variants |
| `blocks/columns/columns.css` | Increased hero→columns negative margin overlap (-20px → -40px) |
| `content/index.plain.html` | Added section-metadata to 3 default content sections |

---

## Previously Applied (Feature Cards Block Critique)

These fixes were applied in an earlier session focused specifically on the feature-cards block:

| # | Severity | File | Fix |
|---|----------|------|-----|
| 1 | HIGH | `blocks/feature-cards/feature-cards.css` | Removed double padding via section-level overrides |
| 2 | HIGH | `blocks/feature-cards/feature-cards.css` | Added `box-sizing: border-box` |
| 3 | LOW | `blocks/feature-cards/feature-cards.css` | Removed container margin gap |
| 4 | LOW | `blocks/feature-cards/feature-cards.css` | Replaced deprecated `clip` with `clip-path: inset(50%)` |
| 5 | MEDIUM | `blocks/feature-cards/feature-cards.js` | Replaced hardcoded 20px gap with dynamic `getCardStep()` helper |
| 6 | MEDIUM | `blocks/feature-cards/feature-cards.js` | Added full ARIA carousel pattern (region, tablist, tabs, live region) |
| 7 | LOW | `blocks/feature-cards/feature-cards.js` | Added AbortController for event listener cleanup |
