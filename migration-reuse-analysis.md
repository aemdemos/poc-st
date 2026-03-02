# Migration Plan Review: Cross-Site Reuse Analysis

## Site: https://jobs.army.mod.uk/ (~535 pages, 9 templates)

---

## Executive Summary

After reviewing the migration plan against the existing codebase (17 blocks, design system, homepage migration) and the original site's visual patterns, this analysis identifies **significant reuse opportunities** that the current plan underestimates. Several blocks listed as distinct (#15-18 in the block library) are variants of existing blocks rather than new blocks. The plan also has a **phasing concern**: Template 2 (Section Landing Pages) is scheduled last in Phase 5, but it contains patterns that would inform and improve all earlier phases.

### Key Findings

1. **The 26-block library can be reduced to ~18 actual blocks** by consolidating card and CTA variants
2. **The `cta-banner` block is the single highest-reuse new block** — appears across 7 of 9 templates
3. **Section metadata (background themes) is already 70% complete** and covers most template needs
4. **The current phase ordering should be reconsidered** — building a few shared blocks before bulk import would improve all 428 bulk-importable pages
5. **Button styling is duplicated** between hero and columns CSS — should be unified globally

---

## 1. Block Consolidation Opportunities

The migration plan lists 26 blocks. Several can be consolidated:

### Blocks that should be MERGED into existing blocks

| Planned Block | Merge Into | Rationale |
|---------------|-----------|-----------|
| **role-card-grid** (#15) | `cards` variant | Same card grid pattern with different content schema. Add `.cards.role` variant class |
| **article-card-grid** (#16) | `cards` variant | Same card grid with blog content. Add `.cards.article` variant class |
| **image-gallery** (#19) | `carousel` variant | Horizontal scrolling images = carousel with image-only slides |
| **training-pathway** (#20) | `accordion` or default content | Numbered steps can be an ordered list or accordion variant |
| **data-table** (#26) | `table` (already exists) | Structured data display — the existing table block covers this |

### Blocks that should be a SINGLE component with variants

| Planned as Separate | Consolidate As | Variants Needed |
|---------------------|---------------|-----------------|
| **cta-banner** (#8) + **columns** hero-CTA variant | `cta-banner` block | single-column (orange/green/dark), dual-column (beige), heading-only (no button) |
| **unit-card** (#17) + **location-card** (#18) | `location-card` block | reserve-centre variant (with unit details), careers-centre variant (simple) |

### Revised Block Count

| Category | Count | Blocks |
|----------|-------|--------|
| Already built | 9 | hero, cards, columns, carousel, embed, quote, accordion, tabs, video |
| Standard EDS (already in project) | 4 | table, form, fragment, modal |
| Custom already built | 2 | header, footer, feature-cards |
| New blocks needed | 5 | **cta-banner**, **quick-nav**, **promo-banner**, **prev-next-nav**, **location-card** |
| Deferred P3 | 3 | parallax-cards, map, quiz-widget |
| Likely unnecessary | 1 | audio-player (use embed block) |
| **Total actual blocks** | **~18** | vs. 26 originally planned |

---

## 2. Cross-Template Reuse Matrix

This matrix shows which blocks appear across which templates. Blocks used in 4+ templates are the highest-value investments.

| Block | T1 Home | T2 Landing | T3 Content | T4 FAQ | T5 Blog | T6 Listing | T7a Role Cat | T7b Role Detail | T8a Career | T8b Reserve | T9 Utility | **Templates** | **Pages** |
|-------|---------|-----------|------------|--------|---------|-----------|-------------|----------------|-----------|------------|------------|--------------|-----------|
| hero | x | x | x | x | | | x | x | | | | **6** | ~200 |
| cta-banner | x | x | x | | x | x | x | x | | | x | **7** | ~200+ |
| cards (all variants) | x | x | x | | x | x | x | x | | | | **7** | ~150+ |
| columns | x | x | x | | | | | | | | x | **4** | ~50 |
| embed/video | x | x | x | x | x | | x | x | | | | **7** | ~120+ |
| quote | | x | x | | | | | | | | | **2** | ~20 |
| carousel | x | x | | | | | | x | | | | **3** | ~15 |
| accordion | | | x | x | | | | | | | | **2** | ~12 |
| tabs | | x | | | | | | | | | | **1** | ~2 |
| prev-next-nav | | | x | | | | | | | | | **1** | ~45 |
| quick-nav | | x | | | | | | | | | | **1** | ~3 |
| promo-banner | | x | x | | | | x | | | | | **3** | ~10 |
| location-card | | | | | | | | | x | x | | **2** | ~309 |
| breadcrumb | | | x | | x | | | | | x | | **3** | ~400 |

### Highest-Value Blocks (by template coverage)

1. **cta-banner** — 7 templates, ~200+ pages. This is the single most important new block to build.
2. **hero** — 6 templates, ~200 pages. Already built with 3 variants. May need 1-2 more variants.
3. **cards** — 7 templates, ~150+ pages. Already built but needs variant CSS for role-cards, article-cards, and numbered-cards.
4. **embed/video** — 7 templates, ~120+ pages. Already built. Working well.

---

## 3. Section Metadata / Background Theme Reuse

The current `styles.css` already defines 7 section background themes. Here's how they map across the site:

| Section Theme | CSS Class | Already Built? | Used On |
|---------------|-----------|---------------|---------|
| Dark (black bg, white text) | `.dark` | Yes | Hero overlays, dark content sections across all templates |
| Light (off-white bg) | `.light` | Yes | Content sections, card backgrounds |
| Beige (grunge texture) | `.beige` | Yes | "Find Your Fit" homepage section, dual-CTA sections |
| Olive (khaki grunge) | `.olive` | Yes | "Explore Army Roles" section |
| Green (sage bg) | `.green` | Yes | Quote banners |
| Accent (orange bg) | `.accent` | Yes | "Be the Best" CTA, single-column CTA bars |
| Bronze (brown bg) | `.bronze` | Yes | Homepage-specific |
| Centered layout | `.centered` | Yes | CTA sections, feature headings |
| **Dark green bg** | Missing | **No** | CTA banners with dark green (`#154228`), motivational quote dividers |
| **Full-bleed (no max-width)** | Partial | Hero only | Needed for CTA banners, promo banners |

### Recommendation

Add one more section theme for dark green:
```css
main .section.dark-green {
  background-color: #154228;
  color: var(--white);
  margin: 0;
  padding: 40px 0;
}
```

The existing section themes cover ~90% of the site's visual sections. This is a strong foundation — the plan should explicitly call out that most visual variation is achieved through section metadata, not new blocks.

---

## 4. CTA Pattern Analysis (Critical Finding)

The original site uses a single `CtaBar` React component with 3 configurations. The migration plan treats CTAs inconsistently:

### Current State (Problems)
- The **columns block** has a hero-CTA variant (CSS sibling selector hack: `.hero-container + .columns-container`)
- The plan lists a separate **cta-banner** block (#8)
- The homepage uses section metadata (`.accent.centered`) for its "Be the Best" CTA
- There's no unified approach

### Recommended Unified Approach

Build **one `cta-banner` block** that handles all CTA patterns:

| Variant | Content Pattern | Section Metadata | Pages |
|---------|----------------|------------------|-------|
| **Single CTA (orange)** | Heading + 1 button | `.accent` | ~20 pages |
| **Single CTA (green)** | Heading + 1 button | `.dark-green` | ~10 pages |
| **Single CTA (dark)** | Heading + 1 button | `.dark` | ~5 pages |
| **Heading only (no button)** | Heading only | `.dark-green` | ~10 pages (motivational dividers) |
| **Dual CTA** | 2-column: heading + para + button each | `.light` or `.beige` | ~40 pages (content sub-pages bottom) |

The current columns hero-CTA variant CSS should be migrated into this new block and the sibling selector hack removed from `columns.css`.

---

## 5. Cards Variant Strategy

The plan lists 4 separate card blocks (#4, #15, #16, #11). These should all be CSS variants of the single `cards` block:

| Variant Class | Content Differences | CSS Differences | Used On |
|---------------|-------------------|-----------------|---------|
| `.cards` (default) | Image + heading + text | Grid layout, 4:3 images | General use |
| `.cards.role` | Image + corps + title + salary + CTA | Badge overlay, salary styling | Role listing/category pages (~20) |
| `.cards.article` | Image + headline + teaser + duration badge | Duration badge styling | Blog listing, related articles (~80) |
| `.cards.numbered` | Number + heading + text | Large number overlay (like feature-cards) | Homepage "5 Reasons" |
| `.cards.feature` | Large image + heading + text | Larger card, dark bg | Homepage, landing pages |

The existing `feature-cards` custom block duplicates significant carousel logic. Consider whether it can be refactored into a `cards` variant with carousel behaviour, or kept separate.

---

## 6. Phase Ordering Concerns

### Current plan order:
1. Foundation (global + P0 blocks)
2. High-Volume Data Pages (centres + blog) — 383 pages
3. Role Pages — 60 pages
4. Content Sub-Pages — 45 pages
5. Landing Pages + Homepage + Utility — 19 pages

### Issues with this ordering:

**Problem 1: `cta-banner` needed before bulk import but not scheduled until Phase 5**
The CTA banner appears on blog posts (Phase 2), role pages (Phase 3), and content sub-pages (Phase 4). If it's not built until Phase 5 (landing pages), all earlier phases either skip it or need rework.

**Problem 2: Card variants needed across all phases**
Role-card and article-card variants are needed in Phase 2 (blog) and Phase 3 (roles) but aren't explicit dependencies in the plan.

**Problem 3: `prev-next-nav` needed in Phase 4 but not listed in Phase 1**
The ~45 content sub-pages all need prev-next-nav, which is a P1 block. It should be built in Phase 1.

### Recommended Adjustment

**Add a "Phase 1b: Shared Components" step** after the foundation:
- Build `cta-banner` (used in 7 templates)
- Build `prev-next-nav` (used in ~45 pages)
- Add card variants CSS (role, article)
- Add dark-green section theme

This small addition means all subsequent phases can use these patterns without rework.

---

## 7. Breadcrumb Strategy

The plan lists breadcrumb as a P0 block used on ~400 pages, but it's **not yet built**. The current header block appears to include breadcrumb rendering (the header.js is 14KB with breadcrumb logic).

### Questions to resolve:
- Is the breadcrumb part of the header block or a separate block?
- Should it be a standalone block for content pages?
- The current header CSS references `--breadcrumbs-height: 34px` — this suggests it's integrated into the header

### Recommendation
If the breadcrumb is already handled by the header, remove it from the block library list. If it needs to be a separate block (for pages where the header doesn't render breadcrumbs), build it in Phase 1.

---

## 8. Bulk Import Optimisation

The plan correctly identifies 428 pages (80%) as bulk-importable. To maximise reuse during bulk import:

### Build import infrastructure that generates consistent markdown patterns:

| Template | Page Count | Shared Blocks Pattern (markdown) |
|----------|-----------|----------------------------------|
| Reserve Centre (8b) | 240 | hero → location-card (reserve variant) → cta-banner |
| Careers Centre (8a) | 69 | hero → location-card (careers variant) → cta-banner |
| Blog Posts (5) | 74 | hero → default content → embed → cta-banner (dual) → cards (article variant) |
| Role Details (7b) | 45 | hero → columns (metrics) → carousel → default content → embed → cards (role variant) → cta-banner |

### Key insight:
All 4 bulk-importable templates end with a CTA pattern. Building `cta-banner` first means the import scripts generate complete pages from day one, rather than producing pages that need CTA blocks added later.

---

## 9. Design Token Gaps

The current `styles.css` design tokens are solid but missing a few values needed for full site coverage:

| Token | Current | Needed | Used By |
|-------|---------|--------|---------|
| Dark green | Missing | `--dark-green: #154228` | CTA banners, quote section backgrounds |
| Olive quote bg | `--olive-accent: #a19f7a` | Already exists | Quote banners — already covered |
| Card border radius | Not defined | `--card-border-radius: 0 0 30px 30px` | Cards, feature-cards, hero (consistent rounded bottom corners) |
| Max content width | Inline `1200px` | `--content-max-width: 1200px` | Section containers, block alignment |
| Section spacing mobile | Inline `40px` | `--section-spacing: 40px` | Section margins — used everywhere |

---

## 10. Duplicated CSS Patterns to Consolidate

### Button styling duplication
Both `hero.css` and `columns.css` define identical CTA button styling (primary + secondary patterns). This should be in `styles.css` as utility classes:

```css
/* Standardise across all blocks */
.cta-primary { /* orange filled button */ }
.cta-secondary { /* white filled button */ }
.cta-tertiary { /* ghost/outline button */ }
```

Currently these are already partially defined as `.button`, `.button.secondary`, `.button.tertiary` in `styles.css` — but hero and columns both override them. Consolidating would prevent drift as more blocks are added.

### Full-bleed section pattern
Hero, feature-cards, and the columns hero-CTA variant all use similar CSS to break out of the 1200px max-width container. This should be a reusable section metadata class:

```css
main .section.full-bleed > div {
  max-width: none;
  padding: 0;
}
```

---

## Summary: Recommended Changes to Migration Plan

| # | Change | Impact |
|---|--------|--------|
| 1 | **Reduce block library from 26 to ~18** by consolidating card variants, location-card variants, and removing duplicate concepts | Less code to build and maintain |
| 2 | **Add Phase 1b: Shared Components** — build cta-banner, prev-next-nav, card variants, dark-green theme before any page migration | All 428 bulk-import pages are complete on first pass |
| 3 | **Build `cta-banner` as the first new block** — it touches 7 of 9 templates | Highest-leverage single block |
| 4 | **Unify CTA approach** — remove columns hero-CTA hack, consolidate into cta-banner block | Consistent CTA pattern site-wide |
| 5 | **Add `full-bleed` section metadata class** | Eliminates per-block full-width hacks |
| 6 | **Add `--dark-green` and `--card-border-radius` design tokens** | Consistent theming across templates |
| 7 | **Consolidate button CSS** in styles.css — remove duplicates from hero.css and columns.css | Single source of truth for buttons |
| 8 | **Clarify breadcrumb strategy** — is it in header or a separate block? | Affects 400+ pages |
| 9 | **Use cards variants** instead of separate role-card-grid, article-card-grid, and image-gallery blocks | Simpler block library, consistent card pattern |
| 10 | **Consider `audio-player` as an embed variant** | One less block to build |

---

_Analysis performed against site-migration-plan.md and the existing /workspace codebase._
_17 existing blocks, 7 section themes, 3 content pages analysed._
