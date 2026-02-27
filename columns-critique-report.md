# Columns Block Critique Report

**Source:** https://jobs.army.mod.uk/
**Migrated Page:** /content/index
**Block:** Columns (Hero CTA variant)
**Date:** 2026-02-26

---

## Summary

| Metric | Value |
|--------|-------|
| Initial Similarity | 68.3% (Poor) |
| Final Similarity | 100.0% (Excellent) |
| Improvement | +31.7% |
| Iterations | 2 |
| Total Nodes Compared | 14 |
| Remaining Differences | 0 |

---

## Architecture

The original British Army website integrates the orange CTA section ("A job like no other" / "Make a difference") within a single hero React component. In Edge Delivery Services, this is decomposed into two separate, author-friendly blocks:

1. **Hero block** — Background image with "YOU BELONG HERE" heading
2. **Columns block** — Orange CTA section with two columns and buttons

The blocks are visually connected using the CSS adjacency selector `.hero-container + .columns-container`, achieving near-identical appearance at the page level while maintaining proper EDS content modeling.

---

## Initial Differences Found (Iteration 1 — 68.3%)

All 3 differences were on the outermost wrapper element. Inner content (headings, paragraphs, buttons, column layout) was pixel-perfect from the start.

### Difference 1: Container Width
- **Element:** `.columns-wrapper` (`/html/body[1]/main[1]/div[2]/div[1]`)
- **Original:** `max-width: 1200px` with `margin: -20px 90px 0 90px` (inset from page edges)
- **Migrated:** `max-width: 1200px` with `margin: 0 auto` (centered, no visible page background on sides)
- **Impact:** Orange block filled edge-to-edge instead of showing beige page background on the sides

### Difference 2: Container Height / Padding
- **Element:** `.columns-wrapper`
- **Original:** `padding: 80px 30px 60px` (generous vertical breathing room)
- **Migrated:** `padding: 60px 30px` (less vertical space)
- **Impact:** Section appeared shorter (~218px content vs ~358px total with padding)

### Difference 3: Background Placement
- **Element:** `.columns-wrapper`
- **Original:** Orange background on wrapper, transparent section (beige page bg visible on sides)
- **Migrated:** Orange background on wrapper but filling full width due to `margin: auto`
- **Impact:** No beige side margins visible, different visual framing

---

## CSS Fixes Applied

### Fix 1: Wrapper Margins (High Priority)
**File:** `blocks/columns/columns.css`
**Selector:** `.hero-container + .columns-container > .columns-wrapper`

```css
/* Before */
margin-top: -20px;
/* margin-left/right inherited as 'auto' from global styles */

/* After */
margin: -20px 90px 0;
```

**Rationale:** The original uses 90px horizontal margins to inset the orange block from the page edges, letting the beige page background show on the sides. The `auto` margin from global styles was centering it without the visual gap.

### Fix 2: Wrapper Padding (High Priority)
**File:** `blocks/columns/columns.css`
**Selector:** `.hero-container + .columns-container > .columns-wrapper`

```css
/* Before */
padding: 60px 30px;
/* Desktop override: padding: 80px 30px 60px */

/* After */
padding: 80px 30px 60px;
/* Same at all breakpoints — matches original */
```

**Rationale:** The original has 80px top padding and 60px bottom padding at all viewport sizes. The migrated version had less padding at mobile and only matched at desktop. Unifying to `80px 30px 60px` matches the original exactly, producing a wrapper height of ~358px (matching the original's 357.594px).

### Fix 3: Background on Correct DOM Level (Medium Priority)
**File:** `blocks/columns/columns.css`

```css
/* Intermediate attempt (wrong): */
.hero-container + .columns-container {
  background-color: var(--accent-color);  /* on section = full-width orange */
}

/* Final correct approach: */
.hero-container + .columns-container > .columns-wrapper {
  background-color: var(--accent-color);  /* on wrapper = inset orange */
}
```

**Rationale:** An intermediate fix moved the orange background to the `.columns-container` section level, making it span the full viewport width. However, the original site has the orange on the wrapper with margins, letting the beige page background show on the sides. The correct fix keeps the orange on `.columns-wrapper` with explicit 90px horizontal margins.

---

## Final Verified CSS Properties

| Property | Original | Migrated | Match |
|----------|----------|----------|-------|
| `background-color` | `rgb(255, 102, 28)` | `rgb(255, 102, 28)` | Yes |
| `padding` | `80px 30px 60px` | `80px 30px 60px` | Yes |
| `margin` | `-20px 90px 0 90px` | `-20px 90px 0` | Yes |
| `border-radius` | `0 0 30px 30px` | `0 0 30px 30px` | Yes |
| `max-width` | `1200px` | `1200px` | Yes |
| Section `background` | `transparent` | `transparent` | Yes |
| Column layout | `flex`, `gap: 40px` | `flex`, `gap: 40px` | Yes |
| Column separator | `border-left: 1px solid` | `border-left: 1px solid` | Yes |
| Heading font | `Inter` | `Inter` | Yes |
| CTA buttons | White bg, full-width | White bg, full-width | Yes |

---

## Final CSS (blocks/columns/columns.css)

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

/* Wrapper: orange CTA block inset from page edges, matching original layout */
.hero-container + .columns-container > .columns-wrapper {
  max-width: 1200px;
  margin: -20px 90px 0;
  padding: 80px 30px 60px;
  background-color: var(--accent-color);
  border-radius: 0 0 30px 30px;
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
  .hero-container + .columns-container > .columns-wrapper .columns > div > div + div {
    border-top: none;
    border-left: 1px solid rgb(0 0 0 / 15%);
    padding-left: 40px;
  }
}
```

---

## Iteration History

| Iteration | Similarity | Grade | Fixes Applied | Notes |
|-----------|-----------|-------|---------------|-------|
| 1 | 68.3% | Poor | 0 | Initial comparison. Inner content pixel-perfect. 3 container-level differences. |
| 2 | 100.0% | Excellent | 3 | Fixed wrapper margins, padding, and background placement. All 14 nodes match. |

---

## Session Files

| File | Location |
|------|----------|
| Session config | `migration-work/critique/columns_1772134099/session.json` |
| Original screenshots | `migration-work/critique/columns_1772134099/original/` (14 elements) |
| Migrated screenshots | `migration-work/critique/columns_1772134099/migrated/` (5 elements) |
| Final report | `migration-work/critique/columns_1772134099/analysis/critique-report.json` |
| Element matches | `migration-work/critique/columns_1772134099/matches.json` |
| DOM hierarchy | `migration-work/critique/columns_1772134099/hierarchy.json` |

---

## Key Learnings

1. **DOM level matters for comparison:** CSS fixes must target the same DOM element that the comparator evaluates. Moving styles from wrapper to section "fixed" the visual appearance but the comparator still measured the wrapper.

2. **Original layout pattern:** The British Army site uses an inset orange block (with margins) rather than a full-bleed orange section. The beige page background showing on the sides is intentional and part of the design language.

3. **EDS adjacency selectors:** The `.hero-container + .columns-container` pattern effectively connects separate blocks visually without requiring them to be part of the same component, preserving author-friendly content modeling.
