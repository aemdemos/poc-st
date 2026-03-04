# Template 2: Section Landing Pages — Migration Sub-Task Plan

## Overview

**Template:** Section Landing Pages (Template 2)
**Pages (3):**
- `/regular-army/`
- `/army-reserve/`
- `/how-to-join/`

**Shared Layout Pattern:**
- Full-width hero with heading + CTA(s)
- Quick-nav link bar (in-section navigation)
- Mix of carousels, card grids, quote banners
- Promo/marketing content sections
- Full-width CTA banner at bottom

**Key Variations:**

| Page | Unique Elements |
|------|----------------|
| Regular Army | Tabbed content (Soldiers/Officers), quiz widget, 2 quote banners |
| Army Reserve | Video hero, parallax cards, interactive map, multiple carousels, "Ways to Join" slider |
| How to Join | Dual-CTA hero, 2-column text+image block, "What to Expect" cards |

**Migration approach:** Flexible composable template. ~70% shared component vocabulary.

---

## Block Inventory

### Existing Blocks (ready to reuse)

| Block | Status | Notes |
|-------|--------|-------|
| hero | Built | Supports default, campaign (video modal), events variants |
| carousel | Built | Sliding content with prev/next navigation |
| cards | Built | Standard card layout with image + text |
| quote | Built | Pull-quote / testimonial block |
| tabs | Built | Tabbed content panels |
| columns | Built | Multi-column layout |
| embed | Built | YouTube video embed |
| video | Built | Video player with placeholder image |

### New Blocks Required

| Block | Priority | Used On | Description |
|-------|----------|---------|-------------|
| `cta-banner` | P1 | All 3 pages + ~20 others site-wide | Full-width colored CTA with heading + button; variants: orange, green, black |
| `quick-nav` | P2 | All 3 landing pages | Horizontal in-section link bar |
| `promo-banner` | P2 | ~5 pages | Image/GIF + text + CTA horizontal layout |
| `parallax-cards` | P3 | Army Reserve only | Vertical stacked cards with scroll effect |
| `map` | P3 | Army Reserve only | Embedded interactive map with location markers |
| `quiz-widget` | P3 | Regular Army only | Interactive questionnaire |

---

## Sub-Tasks

### Phase A: Reconnaissance (All 3 Pages)

| # | Task | Description | Status |
|---|------|-------------|--------|
| A1 | Analyse `/regular-army/` | Scrape & screenshot the page. Identify all sections, blocks, and unique elements. | ✅ Done |
| A2 | Analyse `/army-reserve/` | Scrape & screenshot the page. Identify all sections, blocks, and unique elements. | ✅ Done |
| A3 | Analyse `/how-to-join/` | Scrape & screenshot the page. Identify all sections, blocks, and unique elements. | ✅ Done |
| A4 | Consolidated block mapping | Produce a mapping of which source sections map to which EDS blocks (existing vs. new). Confirm block variants needed. | ✅ Done |

### Phase B: New Block Development (Shared Blocks First)

| # | Task | Description | Status |
|---|------|-------------|--------|
| B1 | Build `cta-banner` block | JS + CSS. Full-width colored CTA with heading + button. Variants: orange, green, black. | ✅ Done (already built) |
| B2 | Build `quick-nav` block | JS + CSS. Horizontal in-section link bar for landing page navigation. | ✅ Done |
| B3 | Build `promo-banner` block | JS + CSS. Image/GIF + text + CTA horizontal layout. | ✅ Done |

### Phase C: Migrate Page 1 — `/how-to-join/`

_Simplest of the three. Establishes shared patterns for hero, quick-nav, and cta-banner._

| # | Task | Description | Status |
|---|------|-------------|--------|
| C1 | Migrate content | Extract content from source page and author EDS markdown with block tables. | ✅ Done |
| C2 | Convert & preview | Convert markdown to HTML. Preview locally and iterate on content accuracy. | ✅ Done |
| C3 | Visual QA | Compare rendered page against original. Refine CSS and block styling. | ✅ Done |

### Phase D: Migrate Page 2 — `/regular-army/`

_Adds tabbed content (Soldiers/Officers) and quiz widget complexity._

| # | Task | Description | Status |
|---|------|-------------|--------|
| D1 | Migrate content | Extract content from source page and author EDS markdown. | Done |
| D2 | Build additional variants | No new variants needed — reused hero, quick-nav, promo-banner, cards, quote, tabs, columns, cta-banner. Quiz widget simplified to columns+CTA. | Done |
| D3 | Convert & preview | Converted markdown to HTML. All 10 sections rendering correctly with proper block decoration. | Done |
| D4 | Visual QA | All sections verified: hero, quick-nav, beige content, columns, promo-banner, cards (3-col), quote (olive), tabs (2 panels working), quote (beige), cta-banner (accent). Zero console errors. | Done |

### Phase E: Migrate Page 3 — `/army-reserve/`

_Most complex page — video hero, parallax cards, interactive map, multiple carousels._

| # | Task | Description | Status |
|---|------|-------------|--------|
| E1 | Migrate content | Extract content from source page and author EDS markdown. | To Do |
| E2 | Build `parallax-cards` block | P3 — can be simplified to stacked cards if full parallax effect is not required. | To Do |
| E3 | Handle interactive map | P3 — may simplify to static image + link, or build a basic map embed. | To Do |
| E4 | Convert & preview | Convert markdown to HTML. Preview locally and iterate. | To Do |
| E5 | Visual QA | Compare against original. Refine CSS and block styling. | To Do |

### Phase F: Cross-Page QA

| # | Task | Description | Status |
|---|------|-------------|--------|
| F1 | Cross-page consistency | Verify shared blocks (hero, quick-nav, cta-banner) render consistently across all 3 pages. | To Do |
| F2 | Responsive testing | Test all 3 pages at mobile, tablet, and desktop breakpoints. | To Do |

---

## Execution Order Rationale

1. **Start with `/how-to-join/`** — Fewest unique elements. Validates shared patterns (hero, quick-nav, cta-banner) before tackling more complex pages.
2. **Then `/regular-army/`** — Adds tabs and quiz widget. Moderate complexity increase.
3. **Finish with `/army-reserve/`** — Most complex (video hero, parallax cards, interactive map, multiple carousels). Benefits from all shared blocks and patterns established earlier.

**P3 blocks** (parallax-cards, map, quiz-widget) can be simplified or deferred — decision will be made during each page's migration based on effort vs. fidelity trade-off.

---

## Dependencies

- **Phase 1 (Foundation)** must be complete: global styles, design tokens, header, footer — ✅ Done
- **P0 blocks** (hero, cards, columns, embed) — ✅ Already built
- **P1 blocks** (carousel, quote, tabs) — ✅ Already built
- **New blocks** (cta-banner, quick-nav, promo-banner) — Built in Phase B before page migrations

---

## Risk Factors

| Risk | Impact | Mitigation |
|------|--------|------------|
| Quiz widget requires custom JS + external API | High complexity for 1 page | Defer to P3; may use simplified static version |
| Interactive map requires mapping service | External dependency | Consider static image + link as fallback |
| Parallax scroll effect | Complex CSS/JS for 1 page | Simplify to stacked cards layout |
| Video hero on Army Reserve | Needs video embed in hero context | May need hero variant with video background |
| Multiple carousel instances on single page | Performance concern | Ensure lazy initialization; test scroll performance |

---

_Document generated as part of the British Army Jobs Site migration project._
_Reference: Template 2 of 9 identified templates (see site-migration-plan.md for full plan)._
