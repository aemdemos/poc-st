# Migration Summary: British Army Homepage

**Source URL:** https://jobs.army.mod.uk
**Target Path:** content/index
**Date:** 2026-02-19

---

## Page Overview

| Property | Value |
|----------|-------|
| Page Title | The British Army \| Army Jobs and Recruitment |
| Total Sections | 8 |
| Blocks Used | 5 (3 Hero, 1 Columns, 1 Feature Cards) |
| Default Content Sections | 3 |
| Custom Blocks Created | 1 (Feature Cards) |
| Images | 9 (all external Storyblok CDN) |

---

## Section-by-Section Breakdown

### Section 1 — Main Hero

| Property | Detail |
|----------|--------|
| Decision | Block |
| Block Name | `hero` |
| Variant | `hero` (vanilla) |
| Content | Full-width background image + H1 "You Belong Here" |
| Image | Skier on slalom course (1920x760) |

### Section 2 — Two-Column CTA

| Property | Detail |
|----------|--------|
| Decision | Block |
| Block Name | `columns` |
| Variant | `columns` (vanilla) |
| Content | Two columns, each with heading + paragraph + CTA link |
| Column 1 | "A job like no other" → Regular Army |
| Column 2 | "Make a difference" → Army Reserve |

### Section 3 — Campaign Hero

| Property | Detail |
|----------|--------|
| Decision | Block |
| Block Name | `hero` |
| Variant | `hero` (vanilla) |
| Content | Background image + H2 "Do You Have The Instincts?" + description + CTA |
| CTA | "What's your gut saying?" → /youbelonghere/ |

### Section 4 — Find Your Fit

| Property | Detail |
|----------|--------|
| Decision | Default Content |
| Content | H2 heading + paragraph + CTA link |
| CTA | "Find your fit" → /how-to-join/find-your-fit/ |

### Section 5 — Be the Best

| Property | Detail |
|----------|--------|
| Decision | Default Content |
| Content | H3 heading + CTA link |
| CTA | "How to join" → /how-to-join/ |

### Section 6 — Feature Cards Carousel

| Property | Detail |
|----------|--------|
| Decision | Block |
| Block Name | `feature-cards` |
| Variant | `feature-cards` (custom) |
| Custom Block | Yes — standard Cards block lacks carousel, overlay numbers, featured card, and dark theme |
| Total Cards | 6 (1 featured + 5 numbered) |
| Visible at Desktop | 4 cards, 2 hidden (scroll to reveal) |

**Cards:**

| # | Title | Type |
|---|-------|------|
| — | 5 Reasons to Join the Army | Featured (larger title, white accent line) |
| 01 | It's exciting | Numbered |
| 02 | Great opportunities | Numbered |
| 03 | Serve your country | Numbered |
| 04 | Be part of something bigger | Numbered |
| 05 | Make a difference | Numbered |

**Responsive Breakpoints:**

| Viewport | Cards Visible | Dots |
|----------|--------------|------|
| < 600px | 1 | 6 |
| >= 600px | 2 | 5 |
| >= 900px | 3 | 4 |
| >= 1200px | 4 | 3 |

### Section 7 — Events Hero

| Property | Detail |
|----------|--------|
| Decision | Block |
| Block Name | `hero` |
| Variant | `hero` (vanilla) |
| Content | Background image + H2 "Army Officer Insight Day — RMAS" + date/time/location + 2 CTAs |
| CTA 1 | "View Event Details" → /meet-your-army/100029/ |
| CTA 2 | "View All Events" → /meet-your-army/ |

### Section 8 — Explore Army Roles

| Property | Detail |
|----------|--------|
| Decision | Default Content |
| Content | H2 heading + paragraph + CTA link |
| CTA | "Army role finder" → /regular-army/find-a-role/ |

---

## Blocks Summary

### Vanilla Blocks (from boilerplate)

| Block | Variant | Instances | Notes |
|-------|---------|-----------|-------|
| Hero | hero | 3 (Sections 1, 3, 7) | Standard full-width hero with background image, heading, description, CTAs |
| Columns | columns | 1 (Section 2) | Standard two-column layout with heading, text, and CTA per column |

### Custom Blocks (created during migration)

| Block | Variant | Instances | Notes |
|-------|---------|-----------|-------|
| Feature Cards | feature-cards | 1 (Section 6) | Horizontal scroll carousel with dark theme, featured card, overlay numbers, responsive dot navigation |

**Why Feature Cards is custom:**
1. Featured card variant with larger title and white accent line
2. Large semi-transparent overlay numbers (01-05) via CSS `::before` pseudo-element
3. Horizontal scroll carousel with CSS `scroll-snap`
4. Dark theme (`#3f3f3f` section background, `#15171a` card background)
5. Prev/next arrows + responsive dot indicators navigation
6. Responsive card count matching original site breakpoints

---

## Page Metadata

| Key | Value |
|-----|-------|
| title | The British Army \| Army Jobs and Recruitment |
| description | Considering joining the Army? Explore our career centres and hundreds of various Army roles. Find your ideal job and start your application today. |
| image | https://jobs.army.mod.uk/assets/images/british-army-logo-opengraph.png |

---

## Files Changed / Created

### Content Files

| File | Type | Description |
|------|------|-------------|
| `content/index.md` | Created | Edge Delivery Services markdown source with all 8 sections, block tables, image references, and metadata block |
| `content/index.html` | Auto-generated | HTML output generated from markdown via conversion hook. Serves as the preview file at localhost:3000 |

### Custom Block Files

| File | Type | Description |
|------|------|-------------|
| `blocks/feature-cards/feature-cards.js` | Created | Block decoration JS — converts table rows to `<ul>/<li>` card list, adds featured class to first card, sets `data-number` attributes (01-05) on remaining cards, builds responsive carousel navigation (prev/next arrows + dots). Dots are calculated dynamically: `totalCards - visibleCards + 1`. Rebuilds dots on window resize. Skips `createOptimizedPicture` for external image URLs. |
| `blocks/feature-cards/feature-cards.css` | Created | Block styles — dark theme (`#3f3f3f`/`#15171a`), flex carousel with `scroll-snap`, rounded bottom corners on cards, featured card with 42-54px title and white accent line, numbered cards with large semi-transparent overlay numbers via `::before`, navigation row with circular arrow buttons and dot indicators. Responsive breakpoints at 600px (2 cards), 900px (3 cards), 1200px (4 cards). |

### Import Infrastructure Files

| File | Type | Description |
|------|------|-------------|
| `tools/importer/page-templates.json` | Created | Page template definition mapping source CSS selectors to Edge Delivery Services blocks. Defines the `army-homepage` template with 6 block mappings (3 hero instances, 1 columns, 1 feature-cards, 3 default-content sections). |
| `tools/importer/parsers/hero.js` | Created | Hero block parser for bulk import. Handles 3 source instances (main hero, campaign banner, events hero). Extracts `<picture>` images, headings (h1/h2/h4), description text, and CTA links. |
| `tools/importer/parsers/columns.js` | Created | Columns block parser for bulk import. Extracts left/right column containers with headings, paragraphs, and CTA links from the hero actions area. |
| `tools/importer/parsers/feature-cards.js` | Created | Feature Cards block parser for bulk import. Extracts carousel card content from slick slider. Filters out `.slick-cloned` slides to avoid duplicates. Converts h3/h4 titles to h2 for Edge Delivery Services output. |
| `tools/importer/transformers/army-cleanup.js` | Created | DOM cleanup transformer that runs before block parsing. Removes OneTrust cookie banners, Ami chat widget, header/navigation, footer, page overlays, Next.js internals, iframes, scripts, and slick-cloned slide duplicates. |

### Analysis Files (working artifacts)

| File | Type | Description |
|------|------|-------------|
| `migration-work/authoring-analysis.json` | Created | Complete authoring analysis with per-section decisions (block vs default content), block names, variant names, rationales, and structured content data for all 8 sections + metadata. |
| `migration-work/page-structure.json` | Created | Page structure analysis with section boundaries, CSS selectors, and content sequences. |
| `migration-work/metadata.json` | Created | Scraping output with document paths, image mapping (23 captured images), and extracted page metadata. |
| `migration-work/screenshot.png` | Created | Full-page screenshot of the original source site for visual reference. |
| `migration-work/cleaned.html` | Created | Cleaned source HTML with scripts, styles, and non-content elements removed. |

---

## Image References

All images are referenced from the Storyblok CDN (external URLs, not downloaded locally).

| Reference | Alt Text | Used In |
|-----------|----------|---------|
| hero-image | A skier in red and white gear navigates a slalom course on a snowy slope | Section 1 (Main Hero) |
| campaign-image | Soldier looking directly at you | Section 3 (Campaign Hero) |
| reasons-01 | 5 Reasons to Join the Army | Section 6 (Featured Card) |
| reasons-02 | Exciting moment | Section 6 (Card 01) |
| reasons-03 | Army home carousel | Section 6 (Card 02) |
| reasons-04 | Guard on duty | Section 6 (Card 03) |
| reasons-05 | Be part of something bigger | Section 6 (Card 04) |
| reasons-06 | Make a difference | Section 6 (Card 05) |
| event-image | Officer training at Sandhurst | Section 7 (Events Hero) |
