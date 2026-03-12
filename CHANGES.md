# Reserve Centre Page Migration — Change Summary

## Overview

Migration of the British Army **Reserve Centre Location** page template from `jobs.army.mod.uk` to AEM Edge Delivery Services. This includes a new accordion block, updated parsers, CSS styling, and import pipeline enhancements.

---

## New Files

### `blocks/accordion-reserve/accordion-reserve.js`
- Custom EDS block for displaying army units at a reserve centre
- Uses native `<details>`/`<summary>` for accessible expand/collapse
- Extracts badge images and unit names into a CSS grid layout (badge + name + chevron)
- Implements exclusive-open behaviour: opening one item closes others

### `blocks/accordion-reserve/accordion-reserve.css`
- Full styling for the accordion block matching the original site
- Heading row: 64px, uppercase, Bebas Neue Pro, line-height 0.8
- Items: white background, olive border, 70×70 badge images
- Chevron SVG rotates on open
- Contact links reset from EDS `.button` decoration back to plain underlined text
- "Get in touch" CTA: orange button, floated right, uppercase

### `tools/importer/parsers/breadcrumb.js`
- New parser for the breadcrumb navigation trail
- Extracts only linked items (skips current-page indicator and dot separators)
- Outputs a clean `<ul>` for EDS default content rendering

---

## Modified Files

### `styles/styles.css`
**New section styles added:**
- **`columns-reserve`** section: two-column grid layout (452px sidebar + fluid right column)
  - Sidebar (`.default-content-wrapper`): semi-transparent white background (`rgb(255 255 255 / 50%)`), H1 at 64px
  - Right column (`.accordion-reserve-wrapper`): `var(--background-color)` background
  - "Go Back" link: Bebas Neue Pro, 24px, uppercase, no decoration
  - "Get directions" link: bold, underlined, with external-link arrow SVG
  - Map image: full-width display
  - Sidebar `.button` links reset to plain text (transparent bg, no border)
  - Button hover: transparent background with `border: none`

**Breadcrumb bar (`textured-beige` section):**
- Dot separators via `li:not(:first-child)::before { content: '.'; padding: 0 10px; }`
- Border uses `var(--text-color)` instead of hardcoded `black`
- "Back to search" text styled in Bebas Neue Pro, uppercase

### `tools/importer/transformers/army-cleanup.js`
- **Added Cloudflare email decoding** to the browser-based import pipeline
- Decodes `/cdn-cgi/l/email-protection#HEX` links using XOR (first byte = key)
- Replaces `[email protected]` placeholder text with the decoded email address
- Now consistent with the Node.js pipeline (`utils/cleanup.js`)

### `tools/importer/utils/cleanup.js`
- **Added `decodeCloudflareEmails()`** function for the Node.js import pipeline
- Same XOR-based decoding logic as the transformer
- Integrated into `runAllCleanup()` so it runs automatically during import

### `tools/importer/parsers/columns-reserve.js`
- Updated to handle the reserve centre two-column layout
- Sidebar content: go-back link, H1 title, address, directions link, map image
- Right column: accordion block with unit cards
- Handles Google Maps URL extraction from iframes

### `tools/importer/parsers/default-content.js`
- Minor updates to work with reserve centre content structure

### `tools/importer/parsers/index.js`
- Registered the new `breadcrumb` parser in the parser index

### `tools/importer/page-templates.json`
- Added `reserve-centre-location` template definition
- Defines sections: textured-beige breadcrumb bar, columns-reserve content area
- Maps block instances to DOM selectors

### `tools/importer/import-reserve-centre-location.js`
- Import script for reserve centre location pages
- Combines breadcrumb parser, columns-reserve parser, and army-cleanup transformer

### `tools/importer/import-reserve-centre-location.bundle.js`
- Rebuilt IIFE bundle including all parsers, transformer, and Cloudflare email decoding

### `tools/importer/import-engine.js`
- Engine updates to support reserve centre import workflow

### `tools/importer/utils/web-importer.js`
- Minor utility updates for import compatibility

---

## Deleted Files

### `blocks/columns-reserve/columns-reserve.css`
- **Removed** — styling moved into `styles/styles.css` as section-level CSS since the two-column layout is a section style, not a standalone block

### `blocks/columns-reserve/columns-reserve.js`
- **Removed** — no JavaScript decoration needed; the layout is handled purely by CSS grid on the section

---

## Key Design Decisions

1. **Accordion as a block, layout as a section style**: The accordion-reserve is a proper EDS block (needs JS decoration), while the two-column layout uses CSS Grid on the `.columns-reserve` section — no block JS needed.

2. **Cloudflare email decoding in both pipelines**: Added to both `transformers/army-cleanup.js` (browser) and `utils/cleanup.js` (Node.js) to ensure emails decode correctly regardless of import method.

3. **Breadcrumb dots via CSS pseudo-elements**: Rather than importing dot characters into the content, dots are rendered via `::before` pseudo-elements — cleaner content, consistent rendering.

4. **CSS variables over hardcoded values**: All colours reference CSS custom properties (`var(--background-color)`, `var(--text-color)`) for maintainability and theming.
