# Visual Fixes Summary — Complete Changelog

**Page:** British Army Homepage
**Original:** https://jobs.army.mod.uk/
**Migrated:** /content/index

---

## Fix 1: Hero Block Full-Bleed

**Issue:** Hero images were constrained to 1200px instead of spanning the full viewport width.

**Root Cause:** Global section wrapper rule `main > .section > div { max-width: 1200px }` was constraining the hero block.

**File Changed:** `blocks/hero/hero.css`

**Changes Applied:**
```css
main > .section.hero-container {
  margin: 0;
  padding: 0;
}

main > .section.hero-container > div {
  max-width: unset;
  padding: 0;
}
```

---

## Fix 2: Columns CTA Section Full-Width

**Issue:** The orange CTA bar below the hero was constrained to 1200px instead of spanning the full viewport (1920px on original).

**Root Cause:** Same global section wrapper `max-width: 1200px` constraint. Required a full-bleed override with inner content re-constrained.

**File Changed:** `blocks/columns/columns.css`

**Changes Applied:**
```css
/* Full-width orange CTA bar */
.hero-container + .columns-container > .columns-wrapper {
  max-width: unset;
  margin-top: -40px;
  background-color: var(--accent-color);
  border-radius: 0 0 30px 30px;
}

/* Remove section constraints for full-bleed */
main > .section.hero-container + .section.columns-container {
  margin: 0;
  padding: 0;
}

main > .section.hero-container + .section.columns-container > div {
  max-width: unset;
  padding: 80px 30px 60px;
}

/* Re-constrain inner content */
main > .section.hero-container + .section.columns-container .columns {
  max-width: 1200px;
  margin: 0 auto;
}
```

---

## Fix 3: "Be the Best" Background Color

**Issue:** Section had a brown/saddlebrown background (`#8b4513`) instead of the orange accent color (`#ff661c`).

**Root Cause:** Section metadata incorrectly set to `bronze, centered` instead of `accent, centered`.

**Files Changed:**
- `content/index.plain.html` — Changed section metadata from `bronze, centered` to `accent, centered`
- `styles/styles.css` — Added white button styling for `.section.accent`

**Changes Applied:**

Content metadata update:
```
style: accent, centered
```

CSS addition in `styles/styles.css`:
```css
main .section.accent a.button:any-link {
  background-color: var(--white);
  border-color: var(--white);
  color: var(--text-color);
  min-width: 280px;
}
```

---

## Fix 4: Feature Cards Width

**Issue:** Cards were 275px wide instead of 455px as on the original site.

**Root Cause:** `.feature-cards` block had `max-width: 1200px` constraining the card container, while the section wrapper was already unconstrained.

**File Changed:** `blocks/feature-cards/feature-cards.css`

**Change Applied:**
```css
.feature-cards {
  max-width: unset;  /* was: max-width: 1200px */
}
```

**Result:** Cards expanded from 275px to 455px, matching the original.

---

## Fix 5: "Explore Army Roles" Background Color

**Issue:** Section had a transparent background instead of the olive/khaki color (`rgb(161, 159, 122)`) used on the original site.

**Root Cause:** Section metadata was `centered` only, missing the `olive` style class. The `.section.olive` CSS variant also needed button styling.

**Files Changed:**
- `content/index.plain.html` — Changed section metadata from `centered` to `olive, centered`
- `styles/styles.css` — Added `.section.olive` variant with button styles

**Changes Applied:**

Content metadata update:
```
style: olive, centered
```

CSS addition in `styles/styles.css`:
```css
main .section.olive {
  background-color: var(--olive-accent);
  margin: 0;
  padding: 40px 0;
}

main .section.olive a.button:any-link {
  background-color: var(--white);
  border-color: var(--white);
  color: var(--text-color);
  min-width: 280px;
}
```

---

## Fix 6: Duplicate Selector Lint Error

**Issue:** `main .section.olive` appeared twice in `styles/styles.css`.

**File Changed:** `styles/styles.css`

**Change Applied:** Merged both rules into a single `.section.olive` block using `var(--olive-accent)` for consistency with the design token system. Removed the redundant original rule.

---

## Fix 7: Hero Image Heights

**Issue:** Hero sections were too tall compared to the original (700px vs 570px at 900px, 800px vs 650px at 1200px).

**File Changed:** `blocks/hero/hero.css`

**Changes Applied:**
```css
@media (width >= 900px) {
  .hero {
    min-height: 570px;  /* was 700px */
  }
}

@media (width >= 1200px) {
  .hero {
    min-height: 650px;  /* was 800px */
  }
}
```

---

## Fix 8: Section Heights — Find Your Fit & Explore Army Roles

**Issue:** "Find Your Fit" and "Explore Army Roles" sections were too short compared to the original (needed min-height: 800px).

**Files Changed:** `styles/styles.css`

**Changes Applied:**
```css
main .section.beige {
  min-height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
}

main .section.olive {
  min-height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## Fix 9: "Be the Best" Section Compact Padding

**Issue:** Section was too tall with excessive padding.

**File Changed:** `styles/styles.css`

**Changes Applied:**
```css
main .section.accent.centered {
  padding: 0;
}

main .section.accent.centered > div {
  padding: 50px 30px;
}
```

---

## Fix 10: Font Sizes — Hero Headings

**Issue:** Hero heading font sizes didn't match the original (H1 needed 160px/200px, H2 needed 80px/120px at desktop breakpoints).

**File Changed:** `blocks/hero/hero.css`

**Changes Applied:**
```css
@media (width >= 900px) {
  .hero h1 { font-size: 160px; }
  .hero h2 { font-size: 80px; }
}

@media (width >= 1200px) {
  .hero h1 { font-size: 200px; }
  .hero h2 { font-size: 120px; }
}
```

---

## Fix 11: Font Sizes — Beige & Olive Section Headings

**Issue:** "Find Your Fit" and "Explore Army Roles" H2 headings were too small compared to the original (100px mobile, 160px desktop).

**File Changed:** `styles/styles.css`

**Changes Applied:**
```css
main .section.beige h2,
main .section.olive h2 {
  font-size: 100px;
  letter-spacing: -1px;
}

@media (width >= 1200px) {
  main .section.beige h2,
  main .section.olive h2 {
    font-size: 160px;
    letter-spacing: -1.6px;
  }
}
```

---

## Fix 12: Font Size — "Be the Best" Accent Section H3

**Issue:** H3 in the accent section was using default heading size instead of `--heading-font-size-xl` (54px).

**File Changed:** `styles/styles.css`

**Changes Applied:**
```css
main .section.accent h3 {
  font-size: var(--heading-font-size-xl);
}
```

---

## Fix 13: Events Hero Heading Size

**Issue:** "Army Officer Insight Day" hero H2 was 120px (from global hero H2 override), but original uses 80px for event-style hero sections.

**Root Cause:** No differentiation between standard hero H2 and event hero H2.

**Files Changed:**
- `content/index.plain.html` — Added `style: events` section-metadata to the events hero
- `blocks/hero/hero.css` — Added scoped override for `.events .hero h2`

**Changes Applied:**

Content metadata:
```
style: events
```

CSS in `blocks/hero/hero.css`:
```css
@media (width >= 1200px) {
  .events .hero h2 {
    font-size: 80px;
  }
}
```

---

## Fix 14: Campaign Hero — Play Button & Two-Column Layout

**Issue:** "Do You Have The Instincts?" hero was missing the play button and two-column layout (play button left, text right) present on the original.

**Root Cause:** hero.js was empty (0 bytes). No campaign variant existed.

**Files Changed:**
- `content/index.plain.html` — Added `style: campaign` section-metadata
- `blocks/hero/hero.js` — Created full campaign variant decoration
- `blocks/hero/hero.css` — Added campaign variant CSS

**Changes Applied:**

Content metadata:
```
style: campaign
```

JavaScript (`blocks/hero/hero.js`):
- Detects `campaign` class on parent section
- Adds `hero-campaign` class to block for two-column layout
- Creates play button (orange circle with CSS triangle icon)
- Creates video area wrapper positioned before content
- Opens video modal on click with close button, ESC key, and backdrop click dismissal

CSS (`blocks/hero/hero.css`):
```css
/* Two-column layout */
.hero-campaign {
  justify-content: center;
  align-items: center;
}

/* Play button: 80px mobile, 120px desktop */
.hero-play-button {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--accent-color);
}

/* Desktop: side-by-side 50/50 split */
@media (width >= 900px) {
  .hero-campaign { flex-direction: row; }
  .hero-video-area { width: 50%; }
  .hero-campaign > div:last-child { width: 50%; }
  .hero-play-button { width: 120px; height: 120px; }
}

/* Full-screen video modal overlay */
.hero-video-modal { ... }
```

---

## Fix 15: "Find Your Fit" Downward Arrow

**Issue:** Missing decorative downward arrow (orange SVG, 125x157px) at the bottom of the "Find Your Fit" section, present on the original.

**File Changed:** `styles/styles.css`

**Changes Applied:**
```css
main .section.beige {
  position: relative;
}

main .section.beige::after {
  content: '';
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 125px;
  height: 157px;
  background-image: url("data:image/svg+xml,..."); /* Inline SVG arrow */
  background-repeat: no-repeat;
  background-size: contain;
  pointer-events: none;
}
```

SVG path matches the original: vertical line with V-shaped arrowhead, `#FF661C` orange stroke.

---

## Fix 16: "Find Your Fit" Background Image & Gradient

**Issue:** Section had a flat beige background instead of the grunge texture visible on the original site.

**File Changed:** `styles/styles.css`

**Changes Applied:**
```css
main .section.beige {
  background-image:
    linear-gradient(to bottom, rgb(229 226 218 / 40%) 0%, rgb(229 226 218 / 50%) 100%),
    url('https://jobs.army.mod.uk/assets/images/background-grunge.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

The `linear-gradient` overlay uses the beige color at 40-50% opacity to soften the grunge texture, matching the original's subtler appearance.

---

## Fix 17: "Explore Army Roles" Background Image & Gradient

**Issue:** Section had a flat olive background instead of the grunge texture visible on the original site.

**File Changed:** `styles/styles.css`

**Changes Applied:**
```css
main .section.olive {
  background-image:
    linear-gradient(to bottom, rgb(161 159 122 / 60%) 0%, rgb(161 159 122 / 70%) 100%),
    url('https://jobs.army.mod.uk/assets/images/background-grunge.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

The `linear-gradient` overlay uses the olive color at 60-70% opacity to maintain the olive tint while letting the grunge texture show through subtly.

---

## Files Modified (Complete List)

| File | Changes |
|------|---------|
| `blocks/hero/hero.css` | Full-bleed container overrides, responsive hero heights, hero heading font sizes, events hero H2 override, full campaign variant CSS (play button, two-column layout, video modal) |
| `blocks/hero/hero.js` | Created campaign variant decoration (play button, video area, modal with close/ESC/backdrop) |
| `blocks/columns/columns.css` | Full-width orange CTA bar with inner content constraint |
| `blocks/feature-cards/feature-cards.css` | Removed max-width constraint on block wrapper |
| `styles/styles.css` | Accent button styles, accent section compact padding, beige section (min-height, background image, gradient, downward arrow, heading sizes), olive section (background color, background image, gradient, min-height, button styles, heading sizes), large heading desktop overrides |
| `content/index.plain.html` | Updated section metadata: bronze→accent, added olive, added campaign, added events |

---

## Section Metadata Summary

| Section | Style Value | Purpose |
|---------|------------|---------|
| "You Belong Here" hero | *(none)* | Default hero styling |
| Columns CTA bar | *(none)* | Styled via adjacent sibling selector from hero |
| "Do You Have The Instincts?" hero | `campaign` | Enables play button + two-column layout |
| "Find Your Fit" | `beige, centered` | Beige background with grunge texture, centered text, downward arrow |
| "Be the Best" | `accent, centered` | Orange accent background, compact padding |
| Feature Cards | *(none)* | Dark carousel section |
| "Army Officer Insight Day" hero | `events` | Smaller H2 font size for event-style hero |
| "Explore Army Roles" | `olive, centered` | Olive background with grunge texture, centered text |
