# British Army Header Migration - Change Summary

**Source Site:** https://jobs.army.mod.uk/
**Branch:** aem-20260219-1407
**Date:** 2026-02-23

---

## Overview

This document covers all file changes made during the migration of the British Army website header to Adobe Edge Delivery Services. The work involved building a navigation structure, implementing a two-row header layout with mega-menu dropdowns, utility bar, CTA buttons, search icon, and promo panels — all matching the original site's design.

---

## File Change Summary

| # | File | Status | Lines Changed |
|---|------|--------|---------------|
| 1 | `blocks/header/header.css` | Modified | +326 / -3 |
| 2 | `blocks/header/header.js` | Modified | +125 / -1 |
| 3 | `icons/search.svg` | Modified | +5 / -5 |
| 4 | `styles/styles.css` | Modified | +7 / -1 |
| 5 | `nav.md` | New (untracked) | Navigation content |
| 6 | `nav.html` | New (untracked) | DA-compliant nav HTML |
| 7 | `content/nav.md` | New (untracked) | Copy for content view |
| 8 | `content/nav.html` | New (untracked) | Copy for content view |

---

## Detailed File Changes

### 1. `blocks/header/header.css`

**Purpose:** Complete CSS for the migrated header, including two-row grid layout, mega-menu, utility bar, CTA buttons, search icon, and promo panels.

**Key Changes:**

#### a) Two-Row Grid Layout (Desktop)
- Changed from single-row flex layout to a two-row CSS grid on desktop (900px+)
- **Row 1 (Utility Bar):** Spans full width, contains utility links (My Account, Contact Us, Blog, Ask a Soldier, Meet Your Army) with pipe `|` separators and a search icon
- **Row 2 (Main Nav):** Logo/brand on left, dropdown sections in center, CTA buttons on right
- Grid template: `'tools tools tools' auto / 'brand sections cta' var(--nav-height) / auto 1fr auto`
- The `aria-expanded='true'` state on desktop preserves the same grid template to prevent layout collapse when mega-menu opens

#### b) Mega-Menu (`.nav-mega-menu`)
- Three-column layout inside each dropdown: categories list (250px) | sub-items panel (240px) | promo panel (280px)
- Absolutely positioned below dropdown trigger with arrow pointer on top
- Categories show expand/collapse arrows for items with children
- Sub-items appear to the right of the selected category via `position: absolute; left: 100%`
- Box shadow for depth effect

#### c) Promo Panel (`.nav-promo`)
- Fixed 280px width panel on right side of mega-menu
- Background image with dark gradient overlay (`linear-gradient`) for text readability
- Contains title, description, and orange CTA link button
- Content sits above overlay via `z-index: 2`
- Hidden on mobile (`display: none`)

#### d) Utility Bar (`.nav-tools`)
- Utility links displayed as horizontal list with pipe `|` separators (`::before` pseudo-elements)
- Font: 14px, bold (700)
- Right-aligned in the top row of the grid
- Search icon (last item) has no pipe separator before it

#### e) Search Icon (`.nav-search-btn`)
- Pill-shaped button with 1px solid #ccc border and 16px border-radius
- Contains 20x20px magnifying glass icon
- No background, cursor pointer

#### f) CTA Buttons (`.nav-cta`)
- "Find a Recruiting Centre": transparent background, 2px solid dark border, uppercase, 14px, 1px letter-spacing
- "Apply Now": #ff661c (orange) background, 2px solid matching border, uppercase
- Hover states: outline fills dark, orange darkens to #e55a16
- Hidden on mobile (`display: none`)

#### g) Breadcrumbs
- Positioned below the header
- Uses ordered list with `/` separators
- Hidden on mobile, visible at 900px+

---

### 2. `blocks/header/header.js`

**Purpose:** JavaScript decoration for the header block, including mega-menu behavior, category expand/collapse, utility bar splitting, and CTA button extraction.

**Key Changes:**

#### a) Promo Data Configuration (lines 202-224)
- Static promo content object for three dropdown sections:
  - **Regular Army:** "Explore an Army Base" with base tour image
  - **Army Reserve:** "What's it like?" with reserve screenshot image
  - **How to Join:** "Find your fit" with soldier image
- Each entry has: title, description, CTA text, URL, and background image URL

#### b) Mega-Menu DOM Construction (lines 238-264)
- For each nav section with child `<ul>`, creates a `.nav-mega-menu` wrapper div
- Moves the category list inside the mega-menu wrapper
- Looks up promo data by matching the section's `<strong>` label text
- If promo data exists, creates a `.nav-promo` div with background-image, title, description, and CTA link

#### c) Two-Level Category Expand/Collapse (lines 267-289)
- Categories with sub-lists get `.has-children` class and `aria-expanded="false"`
- Click handler on desktop: toggles `aria-expanded`, collapses sibling categories first
- Clicking the category header link toggles expand (prevents navigation); clicking sub-links navigates normally

#### d) Utility Bar / CTA Split (lines 297-343)
- Iterates all `<li>` items in the tools section
- Separates items into two groups based on text content:
  - **Utility links:** My Account, Contact Us, Blog, Ask a Soldier, Meet Your Army
  - **CTA items:** "Find a Recruiting Centre" and "Apply Now"
- Appends a search icon `<li>` with a `<button>` element to the utility links
- Rebuilds the tools `<ul>` with only utility items
- Creates a new `.nav-cta` div with the CTA links, applying appropriate CSS classes:
  - "Apply Now" gets `.nav-cta-btn .nav-cta-apply`
  - "Find a Recruiting Centre" gets `.nav-cta-btn .nav-cta-outline`
- Inserts the CTA div before `.nav-tools` in the nav element

---

### 3. `icons/search.svg`

**Purpose:** Magnifying glass search icon extracted from the original site header.

**Change:** Replaced placeholder SVG with the original site's search icon design.

**Details:**
- 26x27px viewBox, `fill="none"` (outline style)
- Two paths: diagonal line (search handle) + circle (lens)
- Uses `stroke="currentColor"` so it inherits text color from parent
- Stroke width: 2.2px, round/square line caps

---

### 4. `styles/styles.css`

**Purpose:** Global styles including header height calculation for two-row layout.

**Key Changes:**

#### a) New CSS Custom Property (line 42)
```css
--util-bar-height: 32px;
```
Added to `:root` to define the height of the utility bar row.

#### b) Updated Desktop Header Height (lines 105-113)
```css
@media (width >= 900px) {
  :root {
    --header-height: calc(var(--nav-height) + var(--util-bar-height));
  }
  body[data-breadcrumbs] {
    --header-height: calc(var(--nav-height) + var(--util-bar-height) + var(--breadcrumbs-height));
  }
}
```
- On desktop, `--header-height` now accounts for both the utility bar (32px) and main nav (64px) = 96px total
- When breadcrumbs are enabled, adds `--breadcrumbs-height` (34px) for a total of 130px
- On mobile, `--header-height` remains `var(--nav-height)` (64px) since utility bar is inside mobile menu

---

### 5. `nav.md` (New File)

**Purpose:** Navigation content in Edge Delivery Services markdown format, consumed by the header block.

**Structure:**
Three sections separated by `---` horizontal rules:

1. **Brand Section:** Single list item linking to homepage with "The British Army" text
2. **Navigation Sections:** Three top-level dropdown menus:
   - **Regular Army** — 10 categories (Army Life, Types of Roles, Ways to Join, Inclusion & Values, What You Get, Find a Role, Find a Recruitment Centre, Events, FAQs), each with sub-links
   - **Army Reserve** — 6 categories (Life in the Army Reserve, Ways to Join, Find a Reserve Centre, FAQs, Available Roles, Reservists Q&A Chats)
   - **How to Join** — 5 categories (Application Process, Can I Apply, Army Assessment, Training, Find Your Fit)
3. **Tools Section:** 7 utility/action links (My Account, Contact Us, Blog, Ask a Soldier, Meet Your Army, Find a Recruiting Centre, Apply Now)

---

### 6. `nav.html` (New File)

**Purpose:** Document Authoring (DA) compliant HTML version of the navigation, used by the Edge Delivery Services rendering pipeline.

**Structure:** Same content as `nav.md` but in HTML format wrapped in `<body><main>` tags with three `<div>` sections (brand, sections, tools).

---

### 7. `content/nav.md` and `content/nav.html` (New Files)

**Purpose:** Copies of nav.md and nav.html placed in the `/content/` directory so they appear in the AEM Coder content view at https://aemcoder.adobe.io/chat/content.

**Content:** Identical to the root-level nav.md and nav.html files.

---

## Architecture Summary

### Header Layout (Desktop)

```
+------------------------------------------------------------------+
|  [Utility Bar]  My Account | Contact Us | Blog | ...  [Search]   |
+------------------------------------------------------------------+
|  [Logo]   Regular Army  Army Reserve  How to Join    [CTAs]       |
+------------------------------------------------------------------+
```

### Header Layout (Mobile)

```
+----------------------------------+
|  [Hamburger]  [Brand]  [Tools]   |
+----------------------------------+
|  (Expandable menu below)         |
+----------------------------------+
```

### Mega-Menu Structure (Desktop)

```
+--------------------------------------------------+
| Categories (250px) | Sub-items (240px) | Promo    |
|                    |                   | (280px)  |
| > Army Life        | Explore Base      |          |
|   Types of Roles   | Army vs Civvy     | [image]  |
|   Ways to Join     | Day to Day        |          |
|   ...              | ...               | Title    |
|                    |                   | Desc     |
|                    |                   | [CTA]    |
+--------------------------------------------------+
```

---

## Pending Items

1. **British Army Logo SVG** — The logo SVG has been extracted from the original site but has not yet been saved to `/icons/` or wired into the header brand section. Currently "The British Army" displays as text.

---

## Notes

- All navigation links and URLs match the original site structure
- Promo panel background images reference Storyblok CDN URLs from the original site
- The search icon is visual only (no search logic implemented yet)
- CTA buttons are hidden on mobile — they appear in the mobile menu as regular links
- The `metadata` block and `footer` block produce console errors (404) as they have not been migrated yet — this is expected and does not affect header functionality
