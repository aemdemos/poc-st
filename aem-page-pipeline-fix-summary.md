# Edge Delivery Services - Nav Promo Fix Summary

## Issue

The navigation promo panels (promotional content inside mega-menu dropdowns) were visible in local preview but **missing on the deployed aem.page site**.

---

## Root Cause

The **Edge Delivery Services rendering pipeline wraps inline elements in `<p>` tags** when content is served from aem.page. This is a known behavior of the EDS HTML pipeline.

### What happens

When the nav HTML is authored like this:

```html
<li>
  <strong>Regular Army</strong>
  <ul>...</ul>
</li>
```

**Local preview** renders it as-is:
```html
<li>
  <strong>Regular Army</strong>
  <ul>...</ul>
</li>
```

**aem.page pipeline** wraps the `<strong>` in a `<p>` tag:
```html
<li>
  <p><strong>Regular Army</strong></p>
  <ul>...</ul>
</li>
```

The same wrapping applies to `<a>` tags inside `<li>` elements:
- Local: `<li><a href="...">Army Life</a>`
- aem.page: `<li><p><a href="...">Army Life</a></p>`

### Why it broke the promo panels

The JavaScript code used strict child selectors:
- `:scope > strong` - looks for `<strong>` as a **direct child** of `<li>`
- `:scope > a` - looks for `<a>` as a **direct child** of `<li>`

On aem.page, the `<strong>` and `<a>` elements are wrapped in `<p>`, so they are no longer direct children. The selectors returned `null`, which meant:
1. The section label (e.g., "Regular Army") could not be matched to promo data
2. The category links could not be found for click event binding
3. Promo panels were never created

---

## Files Changed

### 1. `blocks/header/header.js` (2 lines changed)

**Purpose:** Added fallback selectors to handle both direct and `<p>`-wrapped elements.

**Change 1 - Section label selector (line ~249):**
```javascript
// BEFORE (only works locally):
const sectionLabel = navSection.querySelector(':scope > strong')?.textContent?.trim();

// AFTER (works both locally and on aem.page):
const sectionLabel = (navSection.querySelector(':scope > strong') || navSection.querySelector(':scope > p > strong'))?.textContent?.trim();
```
This fix ensures the promo panel data lookup works regardless of whether `<strong>` is a direct child or wrapped in `<p>`.

**Change 2 - Category link selector (line ~274):**
```javascript
// BEFORE (only works locally):
const categoryLink = category.querySelector(':scope > a');

// AFTER (works both locally and on aem.page):
const categoryLink = category.querySelector(':scope > a') || category.querySelector(':scope > p > a');
```
This fix ensures category click handlers and arrow icons are applied correctly on aem.page.

---

### 2. `blocks/header/header.css` (27 lines added/changed)

**Purpose:** Added duplicate CSS selectors to target both direct `<a>` children and `<p>`-wrapped `<a>` children. Also added stylelint suppression comments.

**Change 1 - Category link base styling:**
```css
/* BEFORE */
header nav .nav-sections .nav-mega-menu > ul > li > a { ... }

/* AFTER - added > p > a variant */
header nav .nav-sections .nav-mega-menu > ul > li > a,
header nav .nav-sections .nav-mega-menu > ul > li > p > a { ... }
```

**Change 2 - Reset `<p>` margin inside mega-menu categories:**
```css
/* NEW - prevents extra spacing from <p> wrapper */
header nav .nav-sections .nav-mega-menu > ul > li > p {
  margin: 0;
  line-height: 1;
}
```

**Change 3 - Hover/expanded state styling:**
```css
/* BEFORE */
header nav .nav-sections .nav-mega-menu > ul > li > a:hover,
header nav .nav-sections .nav-mega-menu > ul > li[aria-expanded='true'] > a { ... }

/* AFTER - added > p > a variants */
header nav .nav-sections .nav-mega-menu > ul > li > a:hover,
header nav .nav-sections .nav-mega-menu > ul > li > p > a:hover,
header nav .nav-sections .nav-mega-menu > ul > li[aria-expanded='true'] > a,
header nav .nav-sections .nav-mega-menu > ul > li[aria-expanded='true'] > p > a { ... }
```

**Change 4 - Arrow icon for expandable categories:**
```css
/* BEFORE */
header nav .nav-sections .nav-mega-menu > ul > li.has-children > a::after { ... }

/* AFTER - added > p > a variant */
header nav .nav-sections .nav-mega-menu > ul > li.has-children > a::after,
header nav .nav-sections .nav-mega-menu > ul > li.has-children > p > a::after { ... }
```

**Change 5 - Stylelint suppressions:**
Added `/* stylelint-disable no-descending-specificity */` block comments and `/* stylelint-disable-next-line no-descending-specificity */` inline comments to suppress false-positive linting errors caused by the additional selector variants.

---

### 3. `content/nav.html` (new file)

**Purpose:** Re-created the DA-compliant navigation HTML file that was previously deleted from the repository.

This file contains the full navigation structure with:
- Brand section (The British Army logo/link)
- Three mega-menu sections: Regular Army, Army Reserve, How to Join
- Utility/tools links: My Account, Contact Us, Blog, Ask a Soldier, Meet Your Army, Find a Recruiting Centre, Apply Now

---

## Summary of Changes

| File | Type | Lines Changed | Description |
|------|------|--------------|-------------|
| `blocks/header/header.js` | Modified | +4 / -2 | Fallback selectors for EDS `<p>` wrapping |
| `blocks/header/header.css` | Modified | +23 / -4 | Duplicate `> p > a` selectors + stylelint fixes |
| `content/nav.html` | New | +142 | Re-created navigation content file |

---

## Key Takeaway

When developing Edge Delivery Services blocks, always account for the EDS HTML pipeline behavior of wrapping inline elements in `<p>` tags. Use fallback selectors (try direct child first, then `> p > child`) to ensure blocks work consistently across both local preview and deployed aem.page environments.
