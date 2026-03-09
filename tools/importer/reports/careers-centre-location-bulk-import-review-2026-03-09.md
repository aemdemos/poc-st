# Bulk Import Review — Careers Centre Page

**Date:** 2026-03-09
**Template:** careers-centre-page
**Reference page:** Army Careers Centre Swindon

---

## Block Implementation (ready)

### `blocks/columns-location/columns-location.css`

All styles match the original site:

- Container: `padding: var(--spacing-l)`, `background-color: var(--background-color)`, `border-radius: 0 0 40px 40px`, `margin-bottom: 30px`
- H2: 32px / 700 weight
- Paragraphs: 20px / 1.3 line-height
- Phone links: `text-decoration: none` (no underline)
- Email links: `text-decoration: underline`
- "Get directions" button: outline style with proper button variables
- Group spacing via `:has()` selectors in correct specificity order
- Map iframe: 350px height, 100% width

### `blocks/columns-location/columns-location.js`

Converts Google Maps embed links to iframes and adds column classes. Working correctly.

---

## Import Infrastructure (ready)

### `tools/importer/import-careers-centre-page.js`

Main import script:

- Imports `columns-location` parser and both transformers (army-cleanup, army-sections)
- PAGE_TEMPLATE correctly defines the `columns-location` block selector and two sections (breadcrumb banner with `textured-beige` style, centre details with `dark` style)
- Transform pipeline runs in correct order: beforeTransform → find blocks → parse → afterTransform → WebImporter rules → generate path

### `tools/importer/parsers/columns-location.js`

Block parser:

- Extracts heading, address, opening times, contact numbers, directions link, about section (with officer info + list), and map embed URL
- Creates proper two-column block table
- Handles all content variations found in the Swindon page

### `tools/importer/transformers/army-cleanup.js`

DOM cleanup:

- Removes cookie consent, chat widgets, header/nav, footer, overlays, Next.js internals, scripts, slick cloned slides
- Preserves iframes in beforeTransform (so parser can extract map URLs)
- Removes iframes in afterTransform (after parser has extracted data)
- Removes non-linked breadcrumb items

### `tools/importer/transformers/army-sections.js`

Section structure:

- Adds `<hr>` section breaks and section-metadata tables based on template sections config
- Processes in reverse order to avoid offset issues
- Only adds section-metadata for sections with a style defined

### `tools/importer/page-templates.json`

Template registered correctly with proper block and section definitions.

---

## Import Output (verified)

### `content/army-careers-centre-finder/army-careers-centre-swindon.plain.html`

Content is complete:

- Breadcrumb section with `textured-beige` section-metadata
- Columns-location block with all location details and map embed URL
- Metadata block with title, description, and OG image

### Import Report

Shows successful import with correct path and template.

### Bundle File

`import-careers-centre-page.bundle.js` already exists from the previous import run.

---

## URLs File (needs update)

### `tools/importer/urls-careers-centre-page.txt`

Currently contains only one URL:

```
https://jobs.army.mod.uk/army-careers-centre-finder/army-careers-centre-swindon/
```

For bulk import, the remaining Army Careers Centre URLs need to be added to this file. All other centres on the site follow the same DOM structure (`CentreDetails_centreDetailsContainer`), so the parser and transformers should handle them without changes.

---

## Verdict

All import infrastructure, block code, and styling are ready for bulk import. The only step remaining is populating the URLs file with the additional Army Careers Centre page URLs.
