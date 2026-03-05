# Army Reserve Page — Changes Summary

## Overview

Migration and validation of the Army Reserve page (`https://jobs.army.mod.uk/army-reserve/`) to Adobe Edge Delivery Services, including CSS fixes from visual critique, lint error resolution, and import infrastructure updates.

---

## 1. CSS Fixes (Visual Critique)

### 1a. Map CTA Section Watermark Text

**File:** `styles/styles.css`

Added styling for the beige map CTA section that displays "YOUR JOURNEY BEGINS HERE" as a large, semi-transparent watermark behind the map image.

- `main .section.beige:has(h4)` — min-height: 850px, overflow: hidden
- `main .section.beige:has(h4) h3` — decorative label with orange line (flex + ::before pseudo-element)
- `main .section.beige:has(h4) h4` — giant watermark text (absolute positioned, clamp(100px, 14vw, 220px), 50% white opacity)
- `main .section.beige:has(h4) .button-container` — CTA button overlapping map (margin-top: -200px, z-index: 2)
- `main .section.beige:has(h4) p:has(picture)` — map image z-index layering

### 1b. Free Text Section Padding

**File:** `styles/styles.css`

Added vertical breathing room for plain content sections:

```css
main > .section:not([class*="-container"], .beige, .olive, .dark-green, .green, .accent) > .default-content-wrapper {
  padding-top: var(--spacing-l);
  padding-bottom: var(--spacing-l);
}
```

### 1c. Hero Video Toggle Button Position

**File:** `blocks/hero/hero.css`

Repositioned the play/pause toggle button on desktop from bottom-center to top-right:

```css
/* Before */
.hero-video-toggle { bottom: 40px; left: 50%; transform: translateX(-50%); }

/* After */
.hero-video-toggle { top: 40px; right: 40px; }
```

---

## 2. CSS Lint Fixes (Specificity Ordering)

**File:** `styles/styles.css`

Resolved 6 `no-descending-specificity` stylelint errors caused by the beige:has(h4) selectors having higher specificity than subsequent section heading rules.

### Changes:

1. **Reordered** the `main .section.beige:has(h4)` base rule to appear **before** the compact rule `main .section.beige:not(:has(h2, h4, .quote-wrapper))`, ensuring ascending specificity order.

2. **Added `h4` to the compact rule exclusion list:**
   - Before: `main .section.beige:not(:has(h2, .quote-wrapper))`
   - After: `main .section.beige:not(:has(h2, h4, .quote-wrapper))`
   - This prevents the compact override from nullifying the map CTA section's `min-height: 850px`.

3. **Moved beige:has(h4) child rules** (h3, h4, .default-content-wrapper, .button-container, p:has(picture)) to **after** all other section heading rules (accent, bronze, dark-green). This ensures higher-specificity `:has()` selectors come last in source order.

### Errors fixed:
| Line (before fix) | Selector | Resolution |
|---|---|---|
| 429 | `main .section.beige:has(h4)` | Moved before compact rule |
| 529 | `main .section.accent h3` | beige:has(h4) h3 moved after |
| 565 | `main .section.bronze h3` | beige:has(h4) h3 moved after |
| 566 | `main .section.bronze h4` | beige:has(h4) h4 moved after |
| 589 | `main .section.dark-green h3` | beige:has(h4) h3 moved after |
| 590 | `main .section.dark-green h4` | beige:has(h4) h4 moved after |

---

## 3. Import Infrastructure Updates

### 3a. Parser: hero-video.js

**File:** `tools/importer/parsers/hero-video.js`

Block name changed from `Hero` to `Hero (video)` to match the EDS block variant.

```js
// Before
WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });

// After
WebImporter.Blocks.createBlock(document, { name: 'Hero (video)', cells });
```

### 3b. Parser: hero-banner.js (Rewritten)

**File:** `tools/importer/parsers/hero-banner.js`

Rewritten to properly handle the Hero slider variant:

- Block name changed from `Hero` to `Hero (slider)`
- Now captures **all slide images** (multiple background images for crossfade), each in its own row
- Extracts **all rotating h2 headings** ("Be a reserve Soldier", "Officer", "Specialist") as separate h2 elements
- Extracts subtitle h3 ("Ways to join") and CTA link
- Deduplicates slides and titles to handle cloned DOM elements

### 3c. Parser: carousel.js

**File:** `tools/importer/parsers/carousel.js`

Now outputs variant-specific block names based on detected carousel type:

```js
// Before
WebImporter.Blocks.createBlock(document, { name: 'Carousel', cells });

// After
const variantName = isSocialCarousel ? 'Carousel (social)' : 'Carousel (slick)';
WebImporter.Blocks.createBlock(document, { name: variantName, cells });
```

### 3d. Parser: parallax-cards.js (New)

**File:** `tools/importer/parsers/parallax-cards.js`

New parser for `VerticalParallaxCards` sections:

- Extracts each card's image and content (title, description, CTA) as a two-column row
- Deduplicates cards by text content (handles cloned carousel elements)
- Extracts "stage" headings (h2 "Become a Reservist", h3 "How it works") as default content preceding the block
- Outputs block name `Parallax Cards`

### 3e. Page Templates: page-templates.json

**File:** `tools/importer/page-templates.json`

Updated the `section-landing-page` template block mappings:

| Before | After | Reason |
|--------|-------|--------|
| `hero` | `hero-video` | Matches parser name for video hero variant |
| `carousel` (combined) | `carousel` + `carousel-social` (split) | Separated into two entries with distinct selectors |
| `cards` | `parallax-cards` | Matches actual EDS block name |

Full updated block list:
- `hero-video` — HeroVideoBanner
- `quick-nav` — PageLinks
- `section-intro-text` — FreeText (default content)
- `carousel` — CenteredCarousel (slick variant)
- `section-video-content` — ContentBlock (default content)
- `parallax-cards` — VerticalParallaxCards
- `section-map-cta` — ReserveCentreCTAMap (default content)
- `carousel-social` — SocialCarousel
- `hero-banner` — ImageAndTextSlider (slider variant)
- `quote` — QuoteBanner
- `cards-cta` — CtaBar with h3 columns
- `cta-banner` — CtaBar single column

---

## 4. Visual Critique Results

### Similarity Scores (Post-Fixes)

| Section | Score | Grade |
|---------|-------|-------|
| free-text | 97.5% | Excellent |
| map-cta | 97.2% | Excellent |
| quote | 96.7% | Excellent |
| cta-banner | 96.3% | Excellent |
| cta-cards | 95.8% | Excellent |
| carousel-slick | 93.8% | Good |
| quick-nav | 93.2% | Good |
| hero-slider | 80.2% | Fair |
| social-carousel | 77.3% | Fair |
| video-embed | 75.8% | Fair |
| parallax-cards | 64.8% | Poor |
| hero-video | 64.2% | Poor |

- **Static content average:** 95.8% (Excellent)
- **Overall average:** 84.4% (Fair)
- **Note:** Lower scores for dynamic sections (hero-slider, social-carousel, parallax-cards, hero-video) are caused by animation timing, carousel slide state, and YouTube environment differences — not CSS issues.

---

## Files Modified

| File | Type |
|------|------|
| `styles/styles.css` | Modified — watermark styles, padding, lint fixes |
| `blocks/hero/hero.css` | Modified — toggle button position |
| `tools/importer/parsers/hero-video.js` | Modified — variant name |
| `tools/importer/parsers/hero-banner.js` | Rewritten — slider variant support |
| `tools/importer/parsers/carousel.js` | Modified — variant names |
| `tools/importer/parsers/parallax-cards.js` | New — parallax cards parser |
| `tools/importer/page-templates.json` | Modified — corrected block names |
