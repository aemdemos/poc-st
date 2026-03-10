# Bulk Import Approach — Careers Centre Pages

**Date:** 2026-03-10
**Template:** careers-centre-page
**Total pages:** 67
**Result:** 67/67 imported successfully

---

## Import Path Used

**AEM Browser Importer** (`import-careers-centre-page.bundle.js`) — a self-contained IIFE that runs inside a headless browser via the `run-bulk-import.js` script.

This approach was chosen over the Node.js engine path (`bulk-import.js` → `import-engine.js`) because:

- The bundle includes all parsers, transformers, and template config inline
- It's URL-agnostic — it applies the same transform pipeline to any page it receives, regardless of URL
- No template matching by URL is needed (the Node.js engine requires all URLs to be listed in `page-templates.json` for matching)

---

## Architecture

### Two Import Paths Available

```
Path A: Node.js Engine (NOT used)
  bulk-import.js → import-engine.js → template-matcher.js → parsers/index.js
  ⚠️ Requires URL-based template matching — only works for URLs listed in page-templates.json

Path B: AEM Browser Importer (USED)
  run-bulk-import.js → headless browser → import-careers-centre-page.bundle.js
  ✅ URL-agnostic — applies same template to any page via DOM selectors
```

### Bundle Structure

The bundle (`import-careers-centre-page.bundle.js`) is compiled from:

| Source file | Purpose |
|---|---|
| `import-careers-centre-page.js` | Main entry, wires parsers + transformers + template config |
| `parsers/columns-location.js` | Parses centre details into two-column block |
| `transformers/army-cleanup.js` | Removes cookie consent, chat, header, footer, overlays, scripts |
| `transformers/army-sections.js` | Adds section breaks and section-metadata tables |

All are inlined into a single IIFE via `aem-import-bundle.sh` (uses `aem-import-helper`).

### Transform Pipeline (per page)

```
1. Browser navigates to source URL
2. beforeTransform  → army-cleanup removes unwanted DOM elements
3. findBlocksOnPage → finds elements matching DOM selectors from PAGE_TEMPLATE
4. parse            → columns-location parser extracts location details + map
5. afterTransform   → army-sections adds section breaks + section-metadata
                    → army-cleanup removes remaining iframes
6. WebImporter      → createMetadata, transformBackgroundImages, adjustImageUrls
7. generatePath     → derives content path from URL pathname
8. Output           → .plain.html written to content/
```

### Block Parser: `columns-location`

Extracts from original DOM (`div[class*='CentreDetails_centreDetailsContainer']`):

- **Left column:** heading, address, opening times, phone numbers, directions link, officer info + email contacts
- **Right column:** Google Maps embed URL (converted to iframe by block JS at render time)

### Template Config (embedded in bundle)

```json
{
  "name": "careers-centre-page",
  "blocks": [
    { "name": "columns-location",
      "instances": ["div[class*='CentreDetails_centreDetailsContainer']"] }
  ],
  "sections": [
    { "id": "section-1", "name": "Breadcrumb Banner",
      "selector": "main > div[class*='Breadcrumbs_breadcrumbsContainer']",
      "style": "textured-beige" },
    { "id": "section-2", "name": "Centre Details",
      "selector": "div[class*='CentreDetails_centreDetailsContainer']",
      "style": "dark" }
  ]
}
```

---

## Execution Steps

### Step 1: Populate URL file

Added 67 URLs to `tools/importer/urls-careers-centre-page.txt`, one per line.

### Step 2: Validate infrastructure

```bash
node <scripts>/validate-bulk-import.js
```

Confirmed: page-templates.json valid, parsers directory valid, helix-importer available.

### Step 3: Bundle the import script

```bash
<scripts>/aem-import-bundle.sh --importjs tools/importer/import-careers-centre-page.js
```

Output: `tools/importer/import-careers-centre-page.bundle.js` (14.7kb)

### Step 4: Run bulk import

```bash
node <scripts>/run-bulk-import.js \
  --import-script tools/importer/import-careers-centre-page.bundle.js \
  --urls tools/importer/urls-careers-centre-page.txt
```

The script launches a headless browser per URL, loads the page, executes the bundle's `transform()` function, and writes the output `.plain.html` to `content/`.

**Note:** Processing ~20 pages per 10-minute window. Import was run in 4 batches due to timeout limits, resuming from where each batch left off.

### Step 5: Update page-templates.json

```bash
node <scripts>/add-urls-to-template.js \
  --template careers-centre-page \
  --urls tools/importer/urls-careers-centre-page.txt
```

Added all 67 URLs to the `careers-centre-page` template's `urls` array (66 new, 1 existing deduplicated).

### Step 6: Verify results

- 67 content files in `content/army-careers-centre-finder/`
- 67 report JSON files in `tools/importer/reports/army-careers-centre-finder/`
- Consolidated Excel report at `tools/importer/reports/import-careers-centre-page.report.xlsx`

### Step 7: Post-import cleanup

Spot-checking revealed that 55 of 67 pages contained browser-injected artifacts (the 12 unchanged pages were either imported via a different method or didn't trigger the artifacts). A post-processing cleanup script was created and run to fix these.

```bash
node tools/importer/post-import-cleanup.js --dry-run   # Preview changes
node tools/importer/post-import-cleanup.js              # Execute cleanup
```

**Script:** `tools/importer/post-import-cleanup.js`
**Library:** Uses `linkedom` for DOM parsing

**What it removes:**

1. **Overseas visitor banner** — geolocation-based popup injected during headless browser rendering:
   ```html
   <p>!</p>
   <h2>It looks like you're visiting our site from overseas</h2>
   <p>Please read the guidance on <a href="...">Nationalities and Commonwealth</a>...</p>
   <p>×</p>
   ```

2. **Tracking pixel images** — analytics pixels injected by scripts during browser rendering:
   ```html
   <img src="https://t.co/i/adsct?..." alt="">
   <img src="https://analytics.twitter.com/i/adsct?..." alt="">
   ```
   Also covers: Snapchat, Bing, Facebook, DoubleClick, Google Analytics tracking pixels.

3. **Empty paragraphs** — left behind after removing the above elements.

**Result:** 55 files cleaned, 12 unchanged. All 67 files now match the clean Swindon reference structure.

---

## Known Issues (Remaining)

### ~~1. Overseas Visitor Banner~~ — FIXED (Step 7)

### ~~2. Twitter Tracking Pixel Images~~ — FIXED (Step 7)

### 3. Google Maps API Key Restriction

The embedded map URLs use the original site's API key which is restricted to `jobs.army.mod.uk`. Maps render on the local preview but show "API key not authorized" on `*.aem.page` domains.

**Fix needed:** New Google Maps API key with `*.aem.page` and `*.aem.live` as allowed referrers.

---

## File Outputs

```
content/army-careers-centre-finder/
├── armed-forces-careers-office-aberdeen.plain.html
├── armed-forces-careers-office-belfast.plain.html
├── ... (34 AFCO pages)
├── army-careers-centre-bangor.plain.html
├── army-careers-centre-birmingham.plain.html
├── ... (28 ACC pages)
├── army-careers-office-aldershot.plain.html
├── army-careers-office-chester.plain.html
├── ... (5 ACO pages)
└── (67 total)
```
