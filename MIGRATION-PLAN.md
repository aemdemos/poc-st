# British Army Jobs Site — Migration Plan

**Source:** [https://jobs.army.mod.uk/](https://jobs.army.mod.uk/)  
**Artifacts:** `site-catalog.json`, `cataloged-blocks.json`  
**Generated:** 2026-03-09

---

## 1. Executive Summary

This document is the migration plan for moving the British Army jobs and recruitment site (jobs.army.mod.uk) to a target platform (e.g. DA Live / Document Authoring). The plan is derived from:

- **site-catalog.json** — Template-based site planning: template names, template-defining pages (`averagePages` + `coverageSet`), and bulk-import URL lists per template.
- **cataloged-blocks.json** — Block recommendations: 42 block variants (hero, carousel, columns, video, cards, accordion, form, embed, search, tabs, quote, etc.) with usage counts and descriptions.

**Scope:** 14 templates, ~610 pages analyzed, 2336 blocks processed. Template quality is **HIGH** (“Page templates are clearly defined — expect clean clusters”).

---

## 2. Catalog Structure Reference

### 2.1 site-catalog.json

| Field | Meaning |
|-------|--------|
| **name** | Template identifier (e.g. `homepage`, `role-detail`, `role-category`). |
| **averagePages** | Sample pages used to derive the “average” structure of the template. |
| **coverageSet** | Additional pages that belong to this template (combined with averagePages to define the template). |
| **urls** | Full list of URLs to bulk-import **after** the template is migrated. Assumption: these pages share the same template structure and blocks. |
| **description** | Short description of the template’s purpose and content. |

**Template pages** = unique union of `averagePages` and `coverageSet`. Use these pages to design and build each template; then use `urls` for bulk import.

### 2.2 cataloged-blocks.json

| Field | Meaning |
|-------|--------|
| **blockVariants** | Map of block variant ID → metadata. |
| **blockVariantId** | Unique ID (e.g. `hero-minimal-dark-withimg`). |
| **baseBlock** | Base type: hero, carousel, columns, video, cards, accordion, form, embed, search, tabs, quote, unknown. |
| **description** | Content pattern (e.g. “heading + text + 2 CTAs + image”). |
| **pagesFound** | Number of pages where this variant was detected. |
| **screenshots** | Paths to block screenshots for reference. |

Use this to choose which block variants each template should support and to implement or map blocks during migration.

---

## 3. Template-by-Template Plan

For each template below:

- **Template pages** = de-duplicated list of `averagePages` ∪ `coverageSet` (the pages that define the template).
- **Bulk import** = count of `urls` and a short sample; full list is in `site-catalog.json`.

Recommended blocks are inferred from template description and from the block inventory in Section 4; adjust per actual page inspection.

---

### 3.1 homepage

- **Description:** Main landing page with hero, carousel, feature cards, and multiple CTA sections.
- **Template pages:** 1  
  - `https://jobs.army.mod.uk/`
- **Bulk import:** 1 URL (homepage only).
- **Recommended blocks:** hero (minimal light/medium/dark with image), carousel (minimal dark/light with image), cards (minimal/moderate dark), search (minimal dark), CTA/unknown sections as needed.

---

### 3.2 role-detail

- **Description:** Detailed role information page with hero video, requirements table, and multiple content sections.
- **Template pages (combined, de-duplicated):** 11  
  - From averagePages: legal-officer, religion, gunner-artillery-command-systems, how-to-survive-in-the-wild, radiographer, adventure-training.  
  - From coverageSet: the-british-army-and-unifrog-collaborate…, regular-army/, intelligence-officer, meet-your-army/.
- **Bulk import:** **235 URLs** (roles, blog, how-to-join, reserve, policies, contact, etc.).  
  - Sample: `apply/`, `army-reserve/faqs/`, `blog/*`, `how-to-join/*`, `roles/*`, `regular-army/*`, `contact-us/`, `cookies/`, …
- **Recommended blocks:** hero (minimal dark with image), video (minimal/moderate dark with image), columns (minimal light/dark, content), accordion (minimal/moderate dark), quote, cards, unknown (content sections). High use of hero-minimal-dark-withimg (435 pages), video variants, columns, accordion, quote.

---

### 3.3 role-category

- **Description:** Minimal role category listing page with header and simple content area.
- **Template pages:** 5  
  - hr-finance-support, royal-engineers/, army-careers-office-lancaster, army-reserve/available-roles/, music/, army-careers-office-lancaster.
- **Bulk import:** 14 URLs (careers centre finder, reserve available roles, find-a-role, types-of-roles/*, royal-engineers/).
- **Recommended blocks:** hero (minimal dark with image), columns (minimal light/dark), cards or list-style blocks for role listing.

---

### 3.4 careers-centre-location

- **Description:** 2-column careers centre page with address details and map embed.
- **Template pages:** 1  
  - `army-careers-centre-finder/army-careers-centre-swindon/`
- **Bulk import:** **55 URLs** (all careers centre and AFCO location pages).
- **Recommended blocks:** hero-minimal-dark-withimg, embed (map + details), columns (minimal dark/light) for address and content.

---

### 3.5 army-reserve-landing

- **Description:** Army Reserve section landing page.
- **Template pages:** 1  
  - `https://jobs.army.mod.uk/army-reserve/`
- **Bulk import:** 1 URL.
- **Recommended blocks:** hero, carousel or cards, CTAs (unknown/carousel variants).

---

### 3.6 reserve-centre-finder

- **Description:** Reserve centre search/finder page.
- **Template pages:** 1  
  - `army-reserve/find-a-reserve-centre/`
- **Bulk import:** 1 URL.
- **Recommended blocks:** hero, search (minimal dark/medium), optional embed or list for results.

---

### 3.7 reserve-centre-location

- **Description:** 2-column reserve centre detail page with address info and map.
- **Template pages:** 5 (averagePages) + 1 (coverageSet) → 6 sample pages; same pattern as careers-centre-location.
- **Bulk import:** **~200+ URLs** (all reserve centre location pages by region).
- **Recommended blocks:** hero-minimal-dark-withimg (very high usage), embed (map), columns for address and content.

---

### 3.8 benefits-landing

- **Description:** Benefits and rewards information page with feature sections.
- **Template pages:** 5 (what-you-get/, apprenticeships/, junior-soldier-training, reservists-qa-dms, fitness).
- **Bulk import:** 6 URLs (reservists-qa-dms, fitness, junior-soldier-training, what-you-get/, apprenticeships/, pay-benefits/).
- **Recommended blocks:** hero, columns (minimal light with image), cards, accordion (minimal light).

---

### 3.9 reserve-join-options

- **Description:** Army Reserve joining options landing page.
- **Template pages:** 1  
  - `army-reserve/ways-to-join/`
- **Bulk import:** 1 URL.
- **Recommended blocks:** hero, carousel or columns, CTAs.

---

### 3.10 content-page

- **Description:** General content page with hero, expandable lists, and image sections.
- **Template pages:** 2 (base/, whats-in-it-for-me/).
- **Bulk import:** 2 URLs.
- **Recommended blocks:** hero, accordion (minimal dark/light with image), columns (minimal light with image), unknown content blocks.

---

### 3.11 assessment-info

- **Description:** Army assessment and eligibility information pages.
- **Template pages:** 4 (army-assessment/, army-life/, events/, training/).
- **Bulk import:** 7 URLs (communication-policy, army-assessment/, can-i-apply/, training/, army-life/, entry-options/, events/).
- **Recommended blocks:** hero, accordion, tabs (minimal dark), columns, CTAs.

---

### 3.12 form-page

- **Description:** Form submission pages with embedded forms.
- **Template pages:** 1  
  - `forms/enshort/`
- **Bulk import:** 2 URLs (enshort, rgshort).
- **Recommended blocks:** form (minimal dark, with/without image), hero if present.

---

### 3.13 alternate-homepage

- **Description:** Alternative homepage variant.
- **Template pages:** 1  
  - `homepage/`
- **Bulk import:** 1 URL.
- **Recommended blocks:** Same as homepage; treat as variant (hero, carousel, cards, search).

---

### 3.14 recruitment-guide

- **Description:** Army recruitment guide page.
- **Template pages:** 1  
  - `recruit/army-guide/`
- **Bulk import:** 1 URL.
- **Recommended blocks:** hero, columns or accordion, content/unknown blocks.

---

## 4. Block Inventory (Recommended Blocks per Template)

The following block variants were cataloged. Use them when building or mapping content for each template.

### 4.1 High-usage block variants (priority)

| Block variant ID | Base | Description | Pages found |
|------------------|------|-------------|-------------|
| hero-minimal-dark-withimg | hero | image | 435 |
| unknown-minimal-light | unknown | heading + text + 4 CTAs | 285 |
| unknown-minimal-dark | unknown | text + 1 CTAs | 210 |
| unknown-minimal-dark-withimg | unknown | heading + text + 1 CTAs + image | 252 |
| columns-minimal-light-withimg | columns | heading + text + 1 CTAs + image | 182 |
| carousel-minimal-dark | carousel | heading + text + 5 CTAs + list | 59 |
| embed-minimal-dark | embed | heading + text + 2 CTAs + list | 57 |
| cards-moderate-dark | cards | content | 133 |
| video-minimal-light-withimg | video | 1 CTAs + image | 98 |
| video-minimal-dark-withimg | video | heading + 2 CTAs + image | 91 |
| quote-minimal-medium | quote | text + 3 CTAs + image + list | 113 |
| cards-minimal-dark | cards | content | 48 |

### 4.2 Full block variant list (42 variants)

| Block variant ID | Base | Description | Pages |
|------------------|------|-------------|-------|
| hero-minimal-dark-withimg | hero | image | 435 |
| hero-minimal-light-withimg | hero | heading + text + 12 CTAs + 7 images + list | 2 |
| hero-minimal-medium-withimg | hero | heading + 1 CTAs + image | 12 |
| hero-moderate-dark-withimg | hero | heading + 3 CTAs + image | 4 |
| carousel-minimal-dark | carousel | heading + text + 5 CTAs + list | 59 |
| carousel-minimal-dark-withimg | carousel | heading + text + 2 CTAs + image | 147 |
| carousel-minimal-light-withimg | carousel | heading + text + 1 CTAs + image | 1 |
| carousel-minimal-medium-withimg | carousel | heading + text + 1 CTAs + image | 1 |
| carousel-moderate-dark-withimg | carousel | heading + text + 26 CTAs + 18 images + list | 2 |
| carousel-moderate-light-withimg | carousel | heading + 1 CTAs + image | 2 |
| carousel-moderate-medium | carousel | heading + text + 2 CTAs + list | 7 |
| columns-minimal-dark | columns | content | 23 |
| columns-minimal-light | columns | heading + text + 1 CTAs | 6 |
| columns-minimal-light-withimg | columns | heading + text + 1 CTAs + image | 182 |
| columns-minimal-medium | columns | heading + text + 4 CTAs + list | 2 |
| columns-minimal-dark-withimg | columns | heading + text + 2 CTAs + 2 images | 9 |
| columns-moderate-dark | columns | content | 9 |
| video-minimal-dark-withimg | video | heading + 2 CTAs + image | 91 |
| video-minimal-light-withimg | video | 1 CTAs + image | 98 |
| video-minimal-medium-withimg | video | heading + text + 1 CTAs + image | 1 |
| video-moderate-dark-withimg | video | heading + text + 12 CTAs + 3 images | 2 |
| cards-minimal-dark | cards | content | 48 |
| cards-moderate-dark | cards | content | 133 |
| accordion-minimal-dark | accordion | heading + text + 2 CTAs | 3 |
| accordion-minimal-dark-withimg | accordion | text + 2 CTAs + image | 13 |
| accordion-minimal-light | accordion | text + 1 CTAs + list | 25 |
| accordion-moderate-dark | accordion | heading + text + 10 CTAs | 26 |
| form-minimal-dark | form | content | 8 |
| form-minimal-dark-withimg | form | heading + text + 16 CTAs + image + list | 1 |
| embed-minimal-dark | embed | heading + text + 2 CTAs + list | 57 |
| embed-minimal-light | embed | heading + text + 1 CTAs + list | 10 |
| search-minimal-dark | search | heading + text + 1 CTAs | 1 |
| search-minimal-medium | search | heading + text + 3 CTAs | 2 |
| tabs-minimal-dark | tabs | heading + text + 2 CTAs + list | 8 |
| quote-minimal-medium | quote | text + 3 CTAs + image + list | 113 |
| unknown-minimal-medium | unknown | heading + text + 2 CTAs | 27 |
| unknown-minimal-dark | unknown | text + 1 CTAs | 210 |
| unknown-minimal-light | unknown | heading + text + 4 CTAs | 285 |
| unknown-minimal-dark-withimg | unknown | heading + text + 1 CTAs + image | 252 |
| unknown-minimal-light-withimg | unknown | image | 4 |
| unknown-moderate-dark | unknown | text + 1 CTAs | 14 |
| unknown-moderate-dark-withimg | unknown | text + 1 CTAs + image | 1 |

---

## 5. Migration Phases and Order

1. **Block library**  
   Implement or map the 42 block variants (prioritise hero, columns, video, cards, accordion, embed, form, search, tabs, quote; then “unknown” content sections).

2. **Templates (design & build)**  
   - **Phase 2a — High impact:** homepage, role-detail (template pages first, then bulk import for 235 URLs).  
   - **Phase 2b — Location pages:** careers-centre-location (55 URLs), reserve-centre-location (200+ URLs).  
   - **Phase 2c — Section landings:** role-category (14), army-reserve-landing, reserve-centre-finder, reserve-join-options, benefits-landing, assessment-info.  
   - **Phase 2d — Supporting:** content-page, form-page, alternate-homepage, recruitment-guide.

3. **Bulk import**  
   For each template, run bulk import for the `urls` list in `site-catalog.json` after the template and blocks are ready.

4. **QA and redirects**  
   Validate template pages and a sample of bulk-import URLs; define URL/redirect mapping from jobs.army.mod.uk to target.

---

## 6. Assumptions and Risks

- **Templates:** Pages in `urls` are assumed to follow the same structure as the template pages (`averagePages` ∪ `coverageSet`). Validate with spot-checks (e.g. role-detail vs blog vs policy pages).
- **Blocks:** “unknown” variants are generic content sections; they may need to be reclassified or merged into named blocks (e.g. CTA strip, text+image) during implementation.
- **Forms:** Form pages (form-page) may require server-side or third-party form handling; confirm form submission and data handling on target platform.
- **Embed/maps:** Careers and reserve centre pages use embeds (e.g. maps); ensure embed block supports the same sources/APIs on the target platform.
- **Analytics and tracking:** Plan migration of any existing analytics, tags, or consent (e.g. cookies) to the new site.

---

## 7. Summary Statistics

| Metric | Value |
|--------|--------|
| Templates | 14 |
| Total bulk-import URLs (approx.) | ~540+ |
| Largest template (URLs) | role-detail (235) |
| Block variants | 42 |
| Blocks processed (cataloged-blocks) | 2336 |
| Pages analyzed | 610 |
| Template quality | HIGH |

---

*End of migration plan. Use `site-catalog.json` for exact URL lists and `cataloged-blocks.json` for block screenshots and detailed variant metadata.*
