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

### Blocks Needed (26 distinct blocks)

| # | Block Name | Description | Frequency | Priority |
|---|-----------|-------------|-----------|----------|
| 1 | **hero** | Full-width image/video with heading + CTAs. Variants: image-only, video-bg, split-CTA, badge-overlay | ~100+ pages | P0 |
| 2 | **breadcrumb** | Hierarchical path navigation | ~400+ pages | P0 |
| 3 | **embed** | YouTube video embed with thumbnail + duration | ~60+ pages | P0 |
| 4 | **cards** | Responsive card grid. Variants: role-card, article-card, feature-card, numbered-card | ~50+ pages | P0 |
| 5 | **columns** | 2/3-column layout. Variants: text+image, CTA pairs, CTA triples | ~40+ pages | P0 |
| 6 | **accordion** | Collapsible sections. Variants: FAQ-grouped, step-list | ~10+ pages | P1 |
| 7 | **quote** | Full-width testimonial banner. Variants: green-bg, grey-bg | ~15+ pages | P1 |
| 8 | **cta-banner** | Full-width coloured CTA with heading + button. Variants: orange, green, black | ~20+ pages | P1 |
| 9 | **prev-next-nav** | Previous/Next sibling page links bar | ~40+ pages | P1 |
| 10 | **at-a-glance** | Key-value metrics display (salary, age, qualifications) | ~45 pages | P1 |
| 11 | **carousel** | Horizontal scrolling card/slide set. Variants: card, image, testimonial | ~10 pages | P1 |
| 12 | **quick-nav** | In-section horizontal link bar | ~5 pages | P2 |
| 13 | **promo-banner** | Image/GIF + text + CTA horizontal layout | ~5 pages | P2 |
| 14 | **tabs** | Tab switcher with content panels | ~2 pages | P2 |
| 15 | **role-card-grid** | Specialized card grid for role listings (thumbnail, corps, title, salary) | ~20 pages | P1 |
| 16 | **article-card-grid** | Card grid for blog listings (thumbnail, headline, teaser, badge) | ~5 pages | P2 |
| 17 | **unit-card** | Reserve centre unit detail (crest, contact, description, roles) | ~240 pages | P1 |
| 18 | **location-card** | Careers centre detail (address, phone, hours) | ~69 pages | P1 |
| 19 | **image-gallery** | Scrollable image set | ~45 pages | P2 |
| 20 | **training-pathway** | Numbered step progression | ~45 pages | P2 |
| 21 | **filter-bar** | Toggle/filter controls for listing pages | ~3 pages | P2 |
| 22 | **map** | Embedded interactive map with location markers | ~3 pages | P3 |
| 23 | **parallax-cards** | Vertical stacked cards with scroll effect | ~1 page | P3 |
| 24 | **quiz-widget** | Interactive questionnaire | ~1 page | P3 |
| 25 | **audio-player** | Embedded audio/soundbite component | ~2 pages | P3 |
| 26 | **data-table** | Structured bulleted data (e.g., fitness times by role) | ~5 pages | P3 |

### Priority Legend
- **P0** = Used on nearly every page, must build first
- **P1** = Used on many pages, build during template development
- **P2** = Used on moderate number of pages, build as needed
- **P3** = Used on few pages, can be deferred

---

## 4. Migration Execution Plan

### Phase 1: Foundation (Global + Design System)

**Objective:** Establish the global design system, header, footer, and navigation that all pages depend on.

**Status:** PARTIALLY COMPLETE (header and footer already migrated)

| Task | Status | Pages Affected |
|------|--------|---------------|
| Header/navigation migration | Done | All |
| Footer migration | Done | All |
| Design token extraction (colors, fonts, spacing) | To Do | All |
| Global styles (styles.css) | To Do | All |
| P0 blocks: hero, breadcrumb, embed, cards, columns | To Do | All |

**Key design tokens to extract:**
- Primary colors: Dark (#15171a), Orange (CTA), Green (secondary CTA), White
- Typography: Heading font family, body font family, sizes
- Spacing: Section padding, grid gaps, container max-widths
- Breakpoints: Mobile, tablet, desktop transitions

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
