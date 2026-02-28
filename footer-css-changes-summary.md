# Footer CSS Changes Summary

**Date:** February 27-28, 2026
**File Modified:** `blocks/footer/footer.css`
**Original Site:** https://jobs.army.mod.uk/
**Repository:** aemdemos/poc-st

---

## Overview

Iterative CSS fixes applied to the migrated footer block to match the original site's footer styling. All changes were verified by comparing computed styles and visual screenshots between the original and migrated pages.

---

## Changes Applied

### 1. Nav Link Spacing

**Issue:** Nav links had padding on the `<li>` element instead of the `<a>` link, and lacked the gap between link text and border-bottom.

| Selector | Property | Before | After |
|----------|----------|--------|-------|
| `.footer-nav li` | padding | `16px 0` | `0` |
| `.footer-nav li a` | display | *(not set)* | `flex` |
| `.footer-nav li a` | padding | *(not set)* | `20px 0` |
| `.footer-nav li a` | margin-bottom | *(not set)* | `20px` |

### 2. Nav Grid Gap (Desktop)

**Issue:** Missing gap between nav columns in the 4-column desktop grid layout.

| Selector | Property | Before | After |
|----------|----------|--------|-------|
| `.footer-nav` (desktop) | gap | *(not set)* | `2rem` |

### 3. Nav Border Styling

**Issue:** Borders needed to match the original: `border-top` on individual `<li>` items (gaps between columns via grid gap), `border-bottom` on the `<ul>` container (continuous solid line).

| Selector | Property | Before | After |
|----------|----------|--------|-------|
| `.footer-nav` | border-bottom | *(not set)* | `1px solid rgb(255 255 255)` |
| `.footer-nav li` | border-top | *(not set)* | `1px solid rgb(255 255 255)` |

### 4. Nav Margin Bottom

**Issue:** Excess space between nav border-bottom and social icons section.

| Selector | Property | Before | After |
|----------|----------|--------|-------|
| `.footer-nav` | margin | `0 0 2rem` (32px) | `0 0 20px` |

### 5. Social Icons Padding

**Issue:** Too much padding above social icons, creating excess gap from nav border-bottom.

| Selector | Property | Before | After |
|----------|----------|--------|-------|
| `.footer-social` | padding-top | `24px` | `0` |

### 6. Breadcrumb "Home" Text

**Issue:** Text displayed as "HOME" (uppercase) instead of "Home" (natural case). Font properties didn't match original.

| Selector | Property | Before | After |
|----------|----------|--------|-------|
| `.footer-breadcrumb-text` | text-transform | `uppercase` | `none` |
| `.footer-breadcrumb-text` | font-family | `var(--heading-font-family)` | `var(--body-font-family)` |
| `.footer-breadcrumb-text` | font-weight | `700` | `400` |
| `.footer-breadcrumb-text` | font-size | `14px` | `20px` |
| `.footer-breadcrumb-text` | letter-spacing | `0.3px` | `normal` |

### 7. Breadcrumb Dot

**Issue:** Dot was same size as text and semi-transparent; original uses smaller white dot.

| Selector | Property | Before | After |
|----------|----------|--------|-------|
| `.footer-breadcrumb-dot` | color | `rgb(255 255 255 / 50%)` | `#fff` |
| `.footer-breadcrumb-dot` | font-size | *(inherited 20px)* | `16px` |

### 8. Legal Links Underline

**Issue:** Legal links in the lower bar had no visible underline. Original uses a `::after` pseudo-element technique.

**Added rules:**
```css
footer .footer .footer-legal li a {
  display: inline-block;
}

footer .footer .footer-legal li a::after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background: #fff;
}

footer .footer .footer-legal li a:hover::after {
  background: #ccc;
}
```

### 9. Legal Links Alignment

**Issue:** Legal links were centered instead of right-aligned on desktop.

| Selector | Property | Before | After |
|----------|----------|--------|-------|
| `.footer-legal` | flex | *(not set)* | `1` |
| `.footer-legal` | justify-content | `center` | `flex-end` |

### 10. Main Army Website Button

**Issue:** Button size calculation didn't account for padding and border.

| Selector | Property | Before | After |
|----------|----------|--------|-------|
| `.footer-main-site a` | box-sizing | *(not set)* | `border-box` |
| `.footer-main-site a` | min-width | `330px` | `330px` (with box-sizing) |

### 11. Social Icons Sizing

**Issue:** Social icon circles and inner icons matched to original dimensions.

| Selector | Property | Value |
|----------|----------|-------|
| `.footer-social li a` | width/height | `40px` (circle) |
| `.footer-social li a .icon` | width/height | `20px` (inner icon) |

---

## Verification

- All changes verified by comparing computed styles between original (jobs.army.mod.uk) and migrated (localhost:3000) using `window.getComputedStyle()`
- Visual screenshots taken at each step to confirm fixes match the original
- Final side-by-side comparison confirms footer layout, spacing, typography, and interactions match the original site
