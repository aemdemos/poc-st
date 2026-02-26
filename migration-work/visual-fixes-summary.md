# Visual Fixes Summary

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

**Issue:** `main .section.olive` appeared twice in `styles/styles.css` — once from the original olive/green section and once added for the olive/khaki fix.

**File Changed:** `styles/styles.css`

**Change Applied:** Merged both rules into a single `.section.olive` block using `var(--olive-accent)` for consistency with the design token system. Removed the redundant original rule.

---

## Files Modified (Complete List)

| File | Changes |
|------|---------|
| `blocks/hero/hero.css` | Full-bleed container overrides |
| `blocks/columns/columns.css` | Full-width orange CTA bar with inner content constraint |
| `blocks/feature-cards/feature-cards.css` | Removed max-width constraint on block wrapper |
| `styles/styles.css` | Added accent button styles, olive section variant, removed duplicate selector |
| `content/index.plain.html` | Updated section metadata (bronze to accent, added olive) |
