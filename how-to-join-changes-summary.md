# How to Join — Styling Refinement Summary

## Overview

Four-phase styling refinement of the migrated `/how-to-join/` page to match the original British Army Jobs site (`https://jobs.army.mod.uk/how-to-join/`).

---

## Phase 1: Fix Broken External Images

### Problem

`createOptimizedPicture()` in `scripts/aem.js` appends AEM optimization params (`?width=750&format=webply&optimize=medium`) to **all** image URLs. External images (e.g. Storyblok CDN) don't support these params and return 404.

### Files Changed

**`blocks/cards/cards.js`** — Added external URL guard (lines 17–24)

```js
ul.querySelectorAll('picture > img').forEach((img) => {
  const isExternal = img.src && !img.src.startsWith(window.location.origin);
  if (!isExternal) {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  }
});
```

**`blocks/search/search.js`** — Added external URL guard with fallback (lines 90–105)

```js
const isExternal = result.image && !result.image.startsWith(window.location.origin);
if (!isExternal) {
  const pic = createOptimizedPicture(result.image, '', false, [{ width: '375' }]);
  wrapper.append(pic);
} else {
  const pic = document.createElement('picture');
  const img = document.createElement('img');
  img.src = result.image;
  img.loading = 'lazy';
  pic.append(img);
  wrapper.append(pic);
}
```

### Note

Journey card images still show 404 because the Storyblok CDN removed them (the original site no longer has those sections). The guard is working correctly — this is a source-data issue, not a code issue. The `aspect-ratio` on wrapper divs maintains correct card proportions with a dark background placeholder.

---

## Phase 2: Quote Section Styling Overhaul

### Problem

Quote sections in olive/beige backgrounds rendered with default body font, centered, with curly-quote marks — not matching the original site's bold display treatment with a large SVG quotation icon.

### File Changed

**`blocks/quote/quote.css`** — Complete overhaul of olive/beige banner quote variant (lines 43–158)

### Changes

| Property | Before | After |
|----------|--------|-------|
| Layout | Centered blockquote | Flex-row: SVG icon left, text right |
| Font | Body font, italic | Bebas Neue Pro (`--heading-font-family`), normal weight 400 |
| Icon | Curly-quote text marks `"…"` | SVG double-quotation-mark via `::before` pseudo-element |
| Alignment | Center | Left (`text-align: start`) |
| Decoration | None | 154×1px line below quote text via `::after` |

### Responsive Breakpoints

| Viewport | Icon Size | Gap | Font Size |
|----------|-----------|-----|-----------|
| Base (< 600px) | 60×52px | 16px | `--heading-font-size-s` (24px) |
| 600px+ | 100×87px | 24px | `--heading-font-size-l` (32–42px) |
| 900px+ | 164×143px | 34px | `--heading-font-size-xl` (54px) |

### Additional

- Suppressed default curly-quote `::before`/`::after` marks for banner quotes
- Section padding: `60px 24px 80px` mobile → `80px 30px 120px` desktop
- Max-width constrained to 720px

---

## Phase 3: Mobile Responsive QA (375px)

### Problem

Promo banner CTA button with `min-width: 330px` nearly overflowed the 375px viewport.

### File Changed

**`blocks/promo-banner/promo-banner.css`** — Line 81

```css
/* Before */
min-width: 330px;

/* After */
min-width: min(330px, 100%);
```

### Verification

- Document width = viewport width (375px) — no horizontal scroll
- All sections stack cleanly on mobile
- Quote icon scales down properly at small viewports
- Known issue: `.nav-tools` header overflow (616px) — separate navigation concern

---

## Phase 4: Section Spacing Fine-Tuning

### Problem

CTA banner (accent) and beige columns section spacing didn't match the original site's proportions.

### Files Changed

**`blocks/cta-banner/cta-banner.css`** — Accent variant padding (lines 100–103, 118–120)

```css
/* Mobile */
.accent .cta-banner {
  padding: 80px 24px 30px;
}

/* Desktop (900px+) */
.accent .cta-banner {
  padding: 80px 50px 30px;
}
```

**`blocks/columns/columns.css`** — Beige section bottom padding (line 60)

```css
/* Before */
padding: var(--spacing-xl) 0;

/* After */
padding: var(--spacing-xl) 0 80px;
```

---

## Cards Variants (from prior session, confirmed working)

**`blocks/cards/cards.css`** — Two new card variants for the how-to-join page:

### Journey Cards (`.cards.journey`)

- Dark background cards with 3:5 portrait aspect-ratio
- White headings in Bebas Neue Pro, white body text at 80% opacity
- Outlined white CTA buttons with hover inversion
- Grid: `repeat(auto-fill, minmax(240px, 1fr))`, 16px gap

### Recommended Cards (`.cards.recommended`)

- White cards with 16:9 landscape aspect-ratio image
- Heading in Bebas Neue Pro, dark text
- Outlined dark CTA buttons with hover inversion
- Grid: `repeat(auto-fill, minmax(280px, 1fr))`, 20px gap

---

## All Modified Files

| File | Change Type | Purpose |
|------|-------------|---------|
| `blocks/cards/cards.js` | Bug fix | External URL guard for `createOptimizedPicture()` |
| `blocks/search/search.js` | Bug fix | External URL guard with fallback `<picture>` |
| `blocks/quote/quote.css` | Overhaul | SVG icon, heading font, flex layout, responsive |
| `blocks/promo-banner/promo-banner.css` | Bug fix | Mobile button overflow prevention |
| `blocks/cta-banner/cta-banner.css` | Refinement | Accent variant padding to match original |
| `blocks/columns/columns.css` | Refinement | Beige section bottom spacing |
| `blocks/cards/cards.css` | New variants | Journey + recommended card styles |

---

## Verification Results

- **Desktop (1440px)**: All 10 sections render correctly
- **Mobile (375px)**: No page-level horizontal overflow, all sections responsive
- **Console errors**: 4 expected 404s from Storyblok CDN (removed source images)
- **No regressions**: All changes scoped to specific variants/contexts
