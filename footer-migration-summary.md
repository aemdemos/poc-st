# Footer Migration Summary

## Overview

Migrated the footer from the original British Army recruitment site (jobs.army.mod.uk) to Adobe Edge Delivery Services. The footer consists of two main visual sections: an upper area with three sub-sections and a lower bar.

---

## Footer Structure

### Upper Section (lighter dark background `rgb(255 255 255 / 10%)`)

1. **Home Breadcrumb** — House outline icon + dot separator + "Home" text
2. **Navigation Links** — 4-column grid: How to Join, Find a Recruitment Centre, Apply Now, Contact Us
3. **Social Media Icons** — 5 circular bordered buttons: Facebook, YouTube, Instagram, LinkedIn, Snapchat

### Lower Section (dark background `#15171a`)

- "Main Army Website" outlined button (links to army.mod.uk)
- Legal links row: Freedom of Information, Privacy Policy, Cookies, Communications Policy, Safeguarding Policy
- Copyright text: © 2026 Crown Copyright

---

## Files Created

### 1. `/icons/home.svg`

House outline SVG icon used in the footer breadcrumb. White stroke on transparent background (27x26px). Extracted from the original site's footer.

### 2. `/icons/facebook.svg`

Facebook "f" logo SVG (10x21px) with `fill="white"`. Path data extracted from the original site.

### 3. `/icons/youtube.svg`

YouTube play button logo SVG (22x16px) with `fill="white"`. Path data extracted from the original site.

### 4. `/icons/instagram.svg`

Instagram camera outline logo SVG (21x21px) with `fill="white"`. Multi-path icon extracted from the original site.

### 5. `/icons/linkedin.svg`

LinkedIn "in" logo SVG (18x19px) with `fill="white"`. Three-path icon (dot, vertical bar, curved connection) extracted from the original site.

### 6. `/icons/snapchat.svg`

Snapchat ghost logo SVG (21x21px) with `fill="white"`. Single complex path extracted from the original site.

> **Note on SVG fill color:** All social icons use `fill="white"` instead of `fill="currentColor"` because these SVGs are loaded via `<img>` tags in EDS, which cannot inherit CSS `color` properties. The white fill ensures visibility on the dark footer background.

---

## Files Modified

### 7. `/footer.md` (Content — Markdown)

The footer content authored in EDS markdown format. Uses `---` (horizontal rules) to create 4 section dividers:

```markdown
[![Home](/icons/home.svg)Home](/)        ← Section 0: Breadcrumb

---

- [How to Join](/how-to-join/)            ← Section 1: Nav links
- [Find a Recruitment Centre](...)
- [Apply Now](/apply/)
- [Contact Us](/contact-us/)

---

- [![Facebook](/icons/facebook.svg)Facebook](https://www.facebook.com/armyjobs)
- [![YouTube](/icons/youtube.svg)YouTube](...)    ← Section 2: Social icons
- [![Instagram](/icons/instagram.svg)Instagram](...)
- [![LinkedIn](/icons/linkedin.svg)LinkedIn](...)
- [![Snapchat](/icons/snapchat.svg)Snapchat](...)

---

[Main Army Website](https://www.army.mod.uk/)    ← Section 3: Lower bar

- [Freedom of Information](...)
- [Privacy Policy](/privacy-policy/)
- [Cookies](/cookies/)
- [Communications Policy](/communication-policy/)
- [Safeguarding Policy](/safeguarding-policy/)

© 2026 Crown Copyright
```

Each `---` produces a `<div>` section boundary in the rendered HTML, which the footer JS uses to identify and decorate each section.

### 8. `/footer.plain.html` (Generated HTML for local preview)

Auto-generated from `footer.md` by the EDS content pipeline. This is the file fetched by `loadFragment('/footer')` at runtime. Contains 4 `<div>` sections matching the markdown structure, with `<picture>` elements wrapping icon images.

### 9. `/content/footer.html` (Document Authoring HTML)

DA-compliant HTML wrapped in `<body><main>` tags for deployment to aem.page. Same content structure as `footer.plain.html` but with the DA wrapper.

### 10. `/blocks/footer/footer.js` (Block JavaScript)

Complete rewrite of the footer decoration logic. Key responsibilities:

**Fragment Loading (lines 9-17):**
- Loads footer content as a fragment from `/footer.plain.html`
- Moves all fragment children into a new wrapper div

**Section Identification (lines 24-30):**
- Queries all direct child `<div>` elements (the 4 sections from markdown `---` separators)
- Saves references to each section wrapper **before** any DOM mutations to avoid detached-node bugs

**Section 0 — Home Breadcrumb (lines 32-58):**
- Finds the `<a>` link in the first section
- Extracts the icon element, handling both `<span class="icon">` (production EDS) and `<picture>` (local preview) formats
- Creates a `.footer-breadcrumb` div with:
  - `.footer-home-icon` link wrapping the house icon
  - `.footer-breadcrumb-text` span with ". Home" text
- Replaces section content with the decorated breadcrumb

**Section 1 — Navigation Links (lines 60-66):**
- Adds `footer-nav` class to the `<ul>` element

**Section 2 — Social Media Icons (lines 68-91):**
- Adds `footer-social` class to the `<ul>` element
- For each social link:
  - Sets `target="_blank"` and `rel="noreferrer"`
  - Extracts icon element (handles both `.icon` span and `<picture>`)
  - Restructures link to show only the icon visually
  - Adds a `.social-label` span with screen-reader-only text
  - Sets `aria-label` for accessibility

**Section Grouping (lines 93-100):**
- Creates `.footer-upper` container
- Moves children from sections 0, 1, 2 into it
- Removes empty section wrappers

**Section 3 — Lower Bar (lines 102-137):**
- Creates `.footer-lower` container
- Extracts "Main Army Website" link into `.footer-main-site` div
- Moves legal links `<ul>` with `.footer-legal` class
- Finds copyright paragraph (containing © or "Copyright") with `.footer-copyright` class

**Final Assembly (lines 139-142):**
- Prepends upper div to the footer
- Appends entire footer to the block

**Key Bug Fix:** Section wrapper references are saved before DOM mutations. An earlier version tried to re-query wrappers after `textContent = ''` which detached the original elements, causing null references and misplaced DOM nodes.

**Icon Handling:** The JS handles both `<span class="icon">` elements (created by production EDS pipeline from `:icon:` notation) and `<picture>` elements (created from `![alt](/icons/name.svg)` markdown in local preview). This dual handling ensures the footer works in both environments.

### 11. `/blocks/footer/footer.css` (Block Stylesheet)

Full footer styling with dark theme. Organized by section:

**Base styles (lines 1-15):**
- Dark background (`#15171a`), white text
- Max-width 1200px container
- Reset paragraph margins

**Upper section (lines 17-21):**
- Slightly lighter background via `rgb(255 255 255 / 10%)` overlay
- 30px top padding, 24px horizontal padding (mobile)

**Breadcrumb (lines 23-66):**
- Flexbox row with 8px gap
- Home icon sized 27x26px
- Handles both `.icon` and `<picture>` elements for icon display
- Text: 14px, uppercase, bold, heading font family
- Dot separator with 50% opacity white

**Navigation links (lines 68-95):**
- Single column grid (mobile), 4-column (desktop at 900px+)
- Each item separated by 1px white/20% border-top
- Links: 20px, uppercase, bold, heading font, white
- Hover: underline

**Social icons (lines 97-154):**
- Centered flexbox row with 32px gap
- Each icon: 44x44px circle with 1.5px white/50% border
- Icon images: 20x20px inside the circle
- Handles both `.icon` and `<picture>` elements
- Text labels hidden with screen-reader-only positioning (clip-path: inset(50%))
- Hover: border becomes fully white

**Lower section (lines 156-213):**
- Column layout (mobile), row layout (desktop)
- "Main Army Website" button: outlined white border, uppercase, bold
  - Hover: inverts to white background with dark text
- Legal links: flex-wrap row, underlined white text
- Copyright: 16px, centered

**Desktop breakpoint at 900px (lines 215-239):**
- Upper section: wider 80px horizontal padding
- Nav links: 4-column grid
- Lower section: horizontal flex with space-between

**Stylelint:** Uses `stylelint-disable-next-line` and `stylelint-disable-line` comments to suppress `no-descending-specificity` warnings caused by dual `.icon`/`picture` selector patterns and the nested footer selector structure.

---

## Design Tokens Used

| Token | Value | Usage |
|-------|-------|-------|
| Background (footer) | `#15171a` | Main footer background |
| Background (upper) | `rgb(255 255 255 / 10%)` | Upper section overlay |
| Text color | `#fff` | All footer text |
| Border color | `rgb(255 255 255 / 20%)` | Nav link separators |
| Social border | `rgb(255 255 255 / 50%)` | Social icon circles |
| Font family | `var(--heading-font-family)` | Nav links, legal links, breadcrumb |
| Font size (nav) | `20px` | Navigation links |
| Font size (legal) | `16px` | Legal links, copyright, button |
| Font size (breadcrumb) | `14px` | Breadcrumb text |
| Max width | `1200px` | Footer content container |
| Breakpoint | `900px` | Desktop layout switch |

---

## Accessibility

- Social links have `aria-label` attributes with descriptive text
- Social icon text is visually hidden but available to screen readers via `.social-label` spans
- Home breadcrumb link has `aria-label="Homepage"`
- External links have `target="_blank"` and `rel="noreferrer"`
- All SVG icons have `alt` attributes on their `<img>` tags

---

## Known Considerations

1. **Icon rendering:** SVG icons use `fill="white"` because `<img>` tags cannot inherit CSS color. If the footer background color changes, the SVG fills would need to be updated.

2. **Dual icon handling:** The JS handles both `<span class="icon">` (production) and `<picture>` (local preview) formats. This is necessary because the EDS content pipeline renders icon images differently in production vs local development.

3. **Stylelint suppressions:** Several `no-descending-specificity` warnings are suppressed with inline comments. These are unavoidable due to the dual `.icon`/`picture` selector patterns needed for cross-environment compatibility.
