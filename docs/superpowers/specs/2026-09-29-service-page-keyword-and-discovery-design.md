# Service-page keyword and discovery design

## Status

Proposed. This document is a design for review before implementation.

## Problem

The current core-service template repeats generic headings such as “services we
discuss” and “the details we can discuss”. Its copy provides too little
service-specific expertise, does not consistently map the supplied Perth keyword
groups to a clear page intent, and exposes no consistent service-level structured
data. The existing news RSS feed is valid but is only advertised on the news index.

The supplied keyword workbook/PDF contains useful intent groups, including broad
roof repairs, leak investigation, tile and metal roof repairs, ridge capping,
valleys and flashings, gutters and downpipes, emergency/storm work, inspections
and maintenance. It must not become a hidden keyword list.

## Goals

1. Give each core service page one primary, visible search intent in its `<title>`,
   H1, lead, first explanatory H2 and contextual internal links.
2. Replace the two generic sections with specific, useful, technically grounded
   service guidance that a Perth homeowner can use to prepare an enquiry.
3. Use secondary keyword variants only where they genuinely describe a component,
   symptom or related service—not as a repeated list.
4. Add accurate, maintainable JSON-LD that reflects visible page content.
5. Make the existing RSS feed discoverable as a public resource, without using it
   as a hidden SEO mechanism.
6. Preserve the current documented case galleries and contextual internal links.

## Non-goals and guardrails

- Do not hide text, links, keywords, JSON claims or feeds from users to manipulate
  crawlers.
- Do not claim licensing, manufacturer approval, 24/7 attendance, fixed pricing,
  guarantees, years of experience or job outcomes unless the business has supplied
  verifiable evidence for each claim.
- Do not create near-duplicate suburb/keyword doorway pages. Existing local pages
  remain location-navigation pages and must continue to provide distinct utility.
- Do not mark up reviews, ratings, FAQs, prices, service areas or qualifications
  that are not displayed and supportable on the corresponding page.
- JSON-LD is machine-readable metadata, not a promise of a Google rich result.

## Options considered

### A. Minimal copy refresh

Change the two generic headings and paragraphs per page; keep the current template
and add `Service` JSON-LD.

- Benefit: small, low-risk edit.
- Cost: the page still lacks a durable professional-information pattern and a
  clear way to use the detailed keyword clusters.

### B. Recommended: service-intent template with evidence and discovery

Replace each generic pair of sections with a service-specific “what the work
considers” section and a three-card “common components / symptoms / assessment
context” section. Retain the concise related-service rail and case gallery. Add
per-page `Service`, `WebPage` and `BreadcrumbList` JSON-LD derived from the same
service object, plus public RSS discovery links.

- Benefit: users, Google and AI systems receive the same clear, useful content;
  one source object controls copy, links and metadata.
- Cost: requires a careful rewrite of each core service object and new regression
  tests.

### C. Separate landing page for every secondary keyword

Build pages for every phrase, such as individual gutter, downpipe, valley and
flashing variants.

- Benefit: maximum keyword coverage on paper.
- Cost: high risk of thin or doorway-like pages and large long-term maintenance
  burden. Not recommended without distinct service evidence and original content
  for each page.

## Recommended information architecture

### Page order (all core service pages)

1. **Hero** — exact primary service term in the title and H1; one concise service
   promise limited to what can be substantiated.
2. **Professional service scope** — replaces “services we discuss”. H2 uses the
   primary term, followed by two short paragraphs explaining the material/water
   path, assessment context, and what information distinguishes a local repair
   discussion from a broad replacement assumption.
3. **What we assess for this service** — replaces “details we can discuss”. Three
   visible cards specific to the page: component, symptom and surrounding context.
4. **Practical enquiry notes** — a visible, short checklist of safe observations
   and the information that helps describe the job; this is not a remote diagnosis.
5. **Documented case record** — retain the existing supplied work images, captions
   and scope qualifiers.
6. **Related services** — only 3–4 links that are technically relevant. Anchor
   text uses the destination page’s primary term.
7. **Optional genuine FAQs** — only when the questions and answers are visible and
   materially useful. No FAQ structured data unless the markup matches supported
   Google usage and visible answers.

### Keyword mapping

| Service route | Primary term / H1 | Visible secondary coverage |
| --- | --- | --- |
| `/roof-repairs/` | Roof Repairs Perth | roof repair Perth, small/minor roof repairs, roof repair company Perth |
| `/roof-leak-repairs/` | Roof Leak Repairs Perth | leaking roof repairs, leak detection/investigation, leak inspection |
| `/tile-roof-repairs/` | Tile Roof Repairs Perth | broken/cracked/missing tile replacement, concrete and terracotta tile repair |
| `/metal-roof-repairs/` | Metal Roof Repairs Perth | Colorbond, corrugated/tin roofs, sheets, screws, washers and leak context |
| `/ridge-capping-repointing/` | Ridge Capping Repairs Perth | repointing, rebedding, bedding and pointing |
| `/flashing-repairs/` | Roof Valley & Flashing Repairs Perth | valley repair/replacement, valley iron, chimney/skylight/roof-to-wall flashing |
| `/gutter-repairs/` | Gutter Repairs Perth | leaking gutters, box gutters, outlets, downpipe connection context |
| `/roof-inspection/` | Roof Inspection & Maintenance Perth | roof inspection Perth, maintenance services, seasonal checks |
| `/roof-maintenance/` | Roof Maintenance Perth | maintenance services, drainage/roofline preparation and records |
| `/storm-damage-roof-repairs/` | Storm Damage Roof Repairs Perth | wind damage, urgent roof leaks and safe response conditions |

Terms such as “24 hour roof repairs” and “after hours roof repairs” will not be
claimed unless the business explicitly confirms the operating policy. Storm copy
will continue to state that attendance depends on weather, access and safety.

## Content standard

Each service object will own:

- `title`, `h1`, `lead`, `scopeHeading`, `scopeParagraphs`;
- a concrete `assessmentHeading` and exactly three assessment cards;
- a `prepareHeading` with a safety-focused preparation checklist;
- 3–4 related, crawlable links;
- links to the relevant documented case record where available; and
- an explicit `serviceType` for structured data.

Content will describe inspection/repair context and materials honestly. It will not
present a photo, symptom or keyword as an automatic diagnosis, scope or price.

## Structured data and feed

### JSON-LD per core service page

Emit one JSON-LD graph generated from the service object:

- `WebPage` with canonical URL, visible title/description and `inLanguage: en-AU`;
- `Service` with the visible service name, canonical URL, provider reference to
  `https://www.perthroofcare.com.au/#business`, `areaServed` Perth/WA, and only
  service-type data shown on the page;
- `BreadcrumbList` reflecting the visible Home → Services → Service path.

The existing LocalBusiness entity remains the common provider identity. Schema will
be serialised safely, validated as JSON, and tested against rendered HTML. It will
not add false aggregate rating, offer, price, availability or certification fields.

### Feed discovery

- Keep `/news/feed.xml` as the public RSS feed for guides.
- Add a standard `<link rel="alternate" type="application/rss+xml">` element to
  service pages and the resource/news index, with an accurate English title.
- Add one visible “Roof repair guides RSS” link in the resources/news area (and no
  hidden feed-only content).
- Keep the sitemap as the canonical URL-discovery mechanism; include only real,
  indexable pages.

## Verification and acceptance criteria

1. Every core service page has one exact visible primary H1 and no generic
   “services we discuss / details we can discuss” headings.
2. Each page exposes page-specific, user-visible professional content and three
   non-duplicated assessment cards.
3. Every related link is an ordinary crawlable `<a href>` and is relevant to the
   destination intent.
4. Each service source and rendered HTML contains one valid JSON-LD graph with
   `WebPage`, `Service` and `BreadcrumbList`; its key terms match visible content.
5. The RSS alternate link is present and `/news/feed.xml` remains valid XML.
6. Smoke tests cover the content/template, JSON-LD, RSS link and absence of the
   retired generic headings; `npm test` passes.
7. Desktop and mobile visual checks confirm the new sections have no overlap and
   retain existing case galleries and enquiry CTA.

## Implementation boundary

This proposal covers the ten core service pages and their common generator only.
It does not rewrite all news articles, location pages or legacy service routes in
this pass. Those can be handled as follow-on work after the new service pattern is
validated.
