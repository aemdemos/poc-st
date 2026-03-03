# British Army Jobs Site - Migration Plan

## Site: https://jobs.army.mod.uk/

---

## 1. Sitemap Summary

**Total URLs in sitemap: ~535**

| Category | URL Pattern | Count | Notes |
|----------|-------------|-------|-------|
| Homepage | `/` | 1 | Unique bespoke layout |
| Regular Army | `/regular-army/...` | ~40 | Landing + sub-pages (army-life, entry-options, types-of-roles, what-you-get, events, inclusion-values, FAQs, find-a-role) |
| Army Reserve | `/army-reserve/...` | ~250 | Landing + sub-pages + ~240 reserve centre location pages |
| How to Join | `/how-to-join/...` | ~20 | Landing + sub-pages (application-process, can-i-apply, army-assessment, training, find-your-fit) |
| Roles | `/roles/...` | ~60 | ~15 corps category pages + ~45 individual role detail pages |
| Careers Centres | `/army-careers-centre-finder/...` | ~70 | Finder landing + ~69 individual centre pages |
| Blog | `/blog/...` | ~75 | Blog index + ~74 individual blog posts |
| Utility/Legal | `/contact-us/`, `/privacy-policy/`, `/cookies/`, etc. | ~15 | Contact, policies, forms, sitemap, search results |

---

## 2. Page Template Analysis

### 9 Distinct Templates Identified

---

### Template 1: Homepage (1 page)

**URL:** `/`

**Layout:**
- Full-width hero with headline "You Belong Here", split Regular Army / Army Reserve CTAs
- Video promo banner ("Do You Have the Instincts?")
- Numbered card carousel ("5 Reasons to Join")
- "Find Your Fit" + "Explore Army Roles" dual feature blocks
- "Be the Best" CTA section
- Events carousel
- "Explore Army Roles" CTA

**Migration approach:** One-off manual migration. Heavily bespoke.

---

### Template 2: Section Landing Pages (3 pages)

**URLs:** `/regular-army/`, `/army-reserve/`, `/how-to-join/`

**Shared layout pattern:**
- Full-width hero with heading + CTA(s)
- Quick-nav link bar (in-section navigation)
- Mix of carousels, card grids, quote banners
- Promo/marketing content sections
- Full-width CTA banner at bottom

**Key variations:**
| Page | Unique Elements |
|------|----------------|
| Regular Army | Tabbed content (Soldiers/Officers), quiz widget, 2 quote banners |
| Army Reserve | Video hero, parallax cards, interactive map, multiple carousels, "Ways to Join" slider |
| How to Join | Dual-CTA hero, 2-column text+image block, "What to Expect" cards |

**Migration approach:** Flexible composable template. ~70% shared component vocabulary.

---

### Template 3: Content Sub-Pages (~45 pages)

**URL patterns:**
- `/regular-army/army-life/adventure-training/`
- `/regular-army/army-life/day-to-day/`
- `/how-to-join/can-i-apply/fitness/`
- `/army-reserve/life-in-the-army-reserve/commitment/`
- `/regular-army/what-you-get/pay-benefits/`
- And many more across all sections

**Consistent layout:**
1. Hero image + heading
2. Breadcrumb trail
3. Body sections: text blocks, embedded videos, bullet lists
4. Optional: quote banners, card grids, accordion steps, audio player
5. Previous/Next sibling page navigation
6. Dual CTA bar (How to Join + Apply Now)

**Migration approach:** Standard content page template. Highest-volume template with most reused blocks.

---

### Template 4: FAQ Pages (~2 pages)

**URLs:** `/regular-army/faqs/`, `/army-reserve/faqs/`

**Layout:**
- Hero image + heading
- Accordion-style grouped FAQ sections (4 groups, 5-9 questions each)
- Some answers include embedded video thumbnails

**Migration approach:** Simple FAQ template with accordion block.

---

### Template 5: Blog Posts (~74 pages)

**URL pattern:** `/blog/{slug}/`

**Consistent layout:**
1. Breadcrumb (Blog > Article Title)
2. Article title + duration badge ("1 minute watch")
3. Rich text body: paragraphs, bullet lists, inline links, bold text
4. Embedded YouTube video
5. CTA bar ("Find Your Role" or similar)
6. Related articles grid (2-3 cards with thumbnails + duration badges)

**Migration approach:** Blog article template. High volume, consistent structure.

---

### Template 6: Listing/Index Pages (2-3 pages)

**URLs:** `/blog/`, `/regular-army/find-a-role/`, `/army-reserve/available-roles/`

**Layout:**
- Featured item hero card at top
- Filterable/paginated card grid
- "Load more" pagination
- CTA block at bottom

**Variations:**
| Page | Card Type | Filters |
|------|-----------|---------|
| Blog Index | Article cards (thumbnail, headline, teaser, duration badge) | Content type |
| Roles Index | Role cards (thumbnail, corps, title, salary, CTA) | Featured toggle, category |
| Available Roles | Role cards (similar to roles index) | Category |

**Migration approach:** Listing template with variant card schemas. These are dynamic/filterable pages - may need custom block JS.

---

### Template 7a: Role Category Pages (~15 pages)

**URL pattern:** `/roles/{corps-name}/`

**Layout:**
1. Hero with corps badge overlay (300x300 emblem)
2. Tagline text block
3. Orange CTA bar (featured role highlight)
4. Description text + embedded video
5. "Why Join Us" bullet list
6. Map image (UK distribution)
7. Role card grids organized by sub-category
8. Dual CTA section (Apply + Reserve)

**Migration approach:** Role category template. Moderate volume.

---

### Template 7b: Role Detail Pages (~45 pages)

**URL pattern:** `/roles/{corps-name}/{role-name}/`

**Consistent layout:**
1. Hero image + role title + category tags (Featured, Soldier/Officer, Combat/Engineering/etc.)
2. Dual CTAs: "Apply now" + "Find your local careers centre"
3. At-a-glance metrics panel: salary, age range, qualifications
4. Introductory description
5. Image carousel/gallery
6. Key responsibilities (bullet list)
7. Entry requirements (age, qualifications, fitness)
8. Training pathway (numbered steps)
9. Qualifications gained
10. Pay and benefits
11. Engagement CTAs ("Ask a Soldier" + recruiter contact)
12. Embedded video
13. Related roles card grid (3 cards)

**Migration approach:** Structured role detail template. High volume, data-driven.

---

### Template 8a: Careers Centre Pages (~69 pages)

**URL pattern:** `/army-careers-centre-finder/{centre-name}/`

**Layout:** Minimal single-column
- Office name heading
- Address, phone, operating hours
- Map directions link
- Officer recruitment contacts (role-specific emails)

**Migration approach:** Simple location detail template. Data-driven, high volume.

---

### Template 8b: Reserve Centre Pages (~240 pages)

**URL pattern:** `/army-reserve/find-a-reserve-centre/{region}/{centre-name}/`

**Layout:**
1. Breadcrumb
2. Location header: "Army Reserve Centre", address, "Get directions" link
3. Repeating unit cards (1-3 per page):
   - Unit crest image
   - Unit name
   - Contact: phone + email
   - Description paragraph
   - Meeting times
   - Available roles (linked list)
   - "Get in touch" CTA button

**Migration approach:** Reserve centre template with repeating unit card block. Highest volume single template (~240 pages). Data-driven - strong candidate for bulk/automated migration.

---

### Template 9: Utility/Legal Pages (~10 pages)

**URLs:** `/contact-us/`, `/privacy-policy/`, `/cookies/`, `/communication-policy/`, `/safeguarding-policy/`, `/complaints-policy/`, `/terms-conditions/`, `/useful-links/`, `/login-help/`, `/covid19/`

**Layout variations:**
- Contact Us: Hero + repeating 2-column CTA bars + text blocks
- Legal pages: Simple text content (terms, privacy, cookies)
- Forms pages: Embedded form components

**Migration approach:** Simple utility templates. Low volume.

---

## 3. Reusable Block Library

### Blocks Needed (18 distinct blocks — consolidated from original 26)

> **Consolidation note:** Role-card-grid and article-card-grid are now CSS variants of the `cards` block. Image-gallery is a variant of `carousel`. Training-pathway uses `accordion` or default content. Data-table uses the existing `table` block. Unit-card and location-card merged into one block. Audio-player handled by `embed`.

| # | Block Name | Description | Frequency | Priority | Status |
|---|-----------|-------------|-----------|----------|--------|
| 1 | **hero** | Full-width image/video with heading + CTAs. Variants: default, campaign (video modal), events | ~100+ pages | P0 | ✅ Built |
| 2 | **breadcrumb** | Hierarchical path navigation (handled by header block) | ~400+ pages | P0 | ✅ Built (in header) |
| 3 | **embed** | YouTube/Vimeo/Twitter embed with thumbnail + lazy load. Also handles audio embeds | ~60+ pages | P0 | ✅ Built |
| 4 | **cards** | Responsive card grid. CSS variants: `.role` (role listings), `.article` (blog cards) | ~50+ pages | P0 | ✅ Built + variants added |
| 5 | **columns** | 2/3-column layout. Variants: text+image, CTA pairs | ~40+ pages | P0 | ✅ Built |
| 6 | **cta-banner** | Full-width CTA bar. Variants: single-column, dual-column. BG via section metadata (accent, dark-green, dark) | ~200+ pages | P0 | ✅ Built |
| 7 | **prev-next-nav** | Previous/Next sibling page links bar | ~45 pages | P1 | ✅ Built |
| 8 | **accordion** | Collapsible sections (native details/summary). Also used for FAQ and step-lists | ~10+ pages | P1 | ✅ Built |
| 9 | **quote** | Full-width testimonial banner. Variants: green-bg, grey-bg via section metadata | ~15+ pages | P1 | ✅ Built |
| 10 | **carousel** | Horizontal scrolling card/slide set. Also serves as image-gallery variant | ~10+ pages | P1 | ✅ Built |
| 11 | **at-a-glance** | Key-value metrics display (salary, age, qualifications) | ~45 pages | P1 | To Do |
| 12 | **location-card** | Location detail card. Variants: reserve-centre (unit details), careers-centre (simple) | ~309 pages | P1 | To Do |
| 13 | **quick-nav** | In-section horizontal link bar | ~5 pages | P2 | To Do |
| 14 | **promo-banner** | Image/GIF + text + CTA horizontal layout | ~5 pages | P2 | To Do |
| 15 | **filter-bar** | Toggle/filter controls for listing pages | ~3 pages | P2 | To Do |
| 16 | **map** | Embedded interactive map with location markers | ~3 pages | P3 | To Do |
| 17 | **parallax-cards** | Vertical stacked cards with scroll effect | ~1 page | P3 | To Do |
| 18 | **quiz-widget** | Interactive questionnaire | ~1 page | P3 | To Do |

### Additional Blocks (already in project, not migration-specific)
- **tabs** — Tabbed content panels (✅ Built)
- **video** — Video player with placeholder (✅ Built)
- **table** — Data tables (✅ Built, replaces planned data-table block)
- **form** — Form rendering (✅ Built)
- **feature-cards** — Homepage numbered card carousel (✅ Built, homepage-specific)
- **header** / **footer** — Site chrome (✅ Built)
- **fragment** / **modal** / **search** — Utility blocks (✅ Built)

### Priority Legend
- **P0** = Used on nearly every page, must build first
- **P1** = Used on many pages, build during template development
- **P2** = Used on moderate number of pages, build as needed
- **P3** = Used on few pages, can be deferred

---

## 4. Migration Execution Plan

### Phase 1: Foundation (Global + Design System)

**Objective:** Establish the global design system, header, footer, and navigation that all pages depend on.

**Status:** COMPLETE

| Task | Status | Pages Affected |
|------|--------|---------------|
| Header/navigation migration | ✅ Done | All |
| Footer migration | ✅ Done | All |
| Design token extraction (colors, fonts, spacing) | ✅ Done | All |
| Global styles (styles.css) | ✅ Done | All |
| P0 blocks: hero, embed, cards, columns | ✅ Done | All |
| Section metadata themes (dark, light, beige, olive, green, accent, bronze, dark-green, full-bleed) | ✅ Done | All |
| Design tokens: `--dark-green`, `--card-border-radius`, `--content-max-width`, `--section-spacing` | ✅ Done | All |

---

### Phase 1b: Shared Components (NEW — cross-template blocks)

**Objective:** Build blocks that are used across 4+ templates BEFORE any page migration begins, so bulk imports produce complete pages.

**Status:** PARTIALLY COMPLETE

| Task | Status | Pages Affected |
|------|--------|---------------|
| cta-banner block (single + dual variants) | ✅ Done | ~200+ pages across 7 templates |
| prev-next-nav block | ✅ Done | ~45 content sub-pages |
| Cards variant CSS (.role, .article) | ✅ Done | ~100 pages (role + blog listings) |
| Button CSS consolidation (removed duplicates from columns.css) | ✅ Done | All |
| at-a-glance block | To Do | ~45 role detail pages |
| location-card block (reserve + careers variants) | To Do | ~309 centre pages |

---

### Phase 2: High-Volume Data-Driven Pages

**Objective:** Migrate the largest page groups using templated/bulk approaches.

| Template | Page Count | Approach | Blocks Needed |
|----------|-----------|----------|---------------|
| Reserve Centre (8b) | ~240 | Bulk import with template | unit-card, location-card, breadcrumb |
| Careers Centre (8a) | ~69 | Bulk import with template | location-card |
| Blog Posts (5) | ~74 | Bulk import with template | breadcrumb, embed, cards, cta-banner |

**Estimated pages:** ~383

**Strategy:** Build one representative page per template manually, validate it, then use bulk import tooling to process remaining pages.

---

### Phase 3: Role Pages

**Objective:** Migrate all role-related pages.

| Template | Page Count | Approach | Blocks Needed |
|----------|-----------|----------|---------------|
| Role Detail (7b) | ~45 | Semi-automated with template | hero, at-a-glance, image-gallery, training-pathway, embed, role-card-grid |
| Role Category (7a) | ~15 | Manual with template | hero, embed, role-card-grid, cta-banner |

**Estimated pages:** ~60

**Strategy:** Build the role detail template first (highest volume), then role category. Many blocks overlap with Phase 2.

---

### Phase 4: Content Sub-Pages

**Objective:** Migrate the content-rich sub-pages across all sections.

| Template | Page Count | Approach | Blocks Needed |
|----------|-----------|----------|---------------|
| Content Sub-Page (3) | ~45 | Manual with template | hero, breadcrumb, embed, quote, accordion, prev-next-nav, columns |

**Estimated pages:** ~45

**Strategy:** Many blocks already built in prior phases. Group by section (Regular Army, Army Reserve, How to Join) for consistent batch migration.

---

### Phase 5: Landing Pages + Remaining

**Objective:** Migrate the complex marketing landing pages and utility pages.

| Template | Page Count | Approach | Blocks Needed |
|----------|-----------|----------|---------------|
| Section Landings (2) | 3 | Manual (complex) | carousel, tabs, parallax-cards, promo-banner, quick-nav, map, quiz-widget |
| Homepage (1) | 1 | Manual (bespoke) | All custom sections |
| Listing Pages (6) | 3 | Manual + custom JS | filter-bar, article-card-grid, role-card-grid |
| FAQ Pages (4) | 2 | Manual with template | accordion |
| Utility Pages (9) | ~10 | Manual (simple) | columns, text blocks |

**Estimated pages:** ~19

**Strategy:** These are low-volume but high-complexity pages. The landing pages require the most custom block development. Tackle last since they benefit from the full block library built in prior phases.

---

## 5. Execution Timeline Summary

| Phase | Description | Page Count | Dependency |
|-------|-------------|-----------|------------|
| **Phase 1** | Foundation (Design + Global + P0 Blocks) | 0 (infrastructure) | None |
| **Phase 2** | High-Volume Data Pages (Centres + Blog) | ~383 | Phase 1 |
| **Phase 3** | Role Pages (Detail + Category) | ~60 | Phase 1 |
| **Phase 4** | Content Sub-Pages | ~45 | Phase 1, partial Phase 2 |
| **Phase 5** | Landing Pages + Homepage + Utility | ~19 | All prior phases |
| **Total** | | **~507 pages** | |

---

## 6. Bulk Migration Candidates

These page groups are ideal for automated/bulk import due to consistent structure:

| Group | Count | Template Consistency | Data Fields |
|-------|-------|---------------------|-------------|
| **Reserve Centres** | ~240 | Very High | Address, units[], contact, roles[], meeting times |
| **Careers Centres** | ~69 | Very High | Name, address, phone, hours, contacts[] |
| **Blog Posts** | ~74 | High | Title, duration, body, video URL, related[] |
| **Role Details** | ~45 | High | Title, tags[], salary, age, qualifications, requirements, training steps, video |

**Total bulk-importable: ~428 pages (80% of entire site)**

---

## 7. Risk Factors and Considerations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Interactive components (quiz, map, filters) | These require custom JS beyond standard EDS blocks | Build as custom blocks in Phase 5; may require external API integration |
| Dynamic content (role finder, events) | Roles and events may be API-driven, not static content | Investigate data source; may need integration with external systems |
| Video embeds | ~60+ pages have YouTube embeds; need consistent embed block | Build robust embed block early (P0) with thumbnail + lazy loading |
| Form pages (`/forms/...`) | 3 form pages with custom form logic | May need form service integration (Adobe Forms, external) |
| SEO metadata | Each page has unique meta tags, OG images | Extract during scraping phase; map to EDS metadata block |
| Image assets | Hundreds of unique images across pages | Reference source URLs initially; asset migration is a separate phase |
| Mobile responsiveness | Original site has complex responsive behavior | Test each template at mobile/tablet/desktop breakpoints |

---

## 8. Recommended First Actions

1. **Extract design tokens** from the original site (colors, fonts, spacing, breakpoints) and update `styles/styles.css`
2. **Build P0 blocks:** hero, breadcrumb, embed, cards, columns - these cover ~80% of all pages
3. **Migrate one representative page** from each of the 3 highest-volume templates:
   - One reserve centre page (Template 8b)
   - One careers centre page (Template 8a)
   - One blog post (Template 5)
4. **Validate the templates** visually against the originals
5. **Run bulk import** for reserve centres (240 pages), careers centres (69 pages), and blog posts (74 pages)
6. **Continue with role pages and content sub-pages**

This approach delivers the maximum number of migrated pages in the shortest time by front-loading the data-driven, high-consistency templates.
