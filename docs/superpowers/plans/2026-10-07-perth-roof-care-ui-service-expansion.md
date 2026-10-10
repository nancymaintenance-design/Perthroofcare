# Perth Roof Care UI Refresh and Service Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public visual system, complete the home service grid with two crawlable services, and add truthful FAQ/article feed discovery without deploying production.

**Architecture:** `build.mjs` remains the single source of generated public pages, schema and feeds. Shared visual rules stay in `public/assets/css/site.css` and `public/assets/css/brand-hero.css`; `static-smoke.test.mjs` verifies generated HTML, feeds, metadata and shared markup after each build.

**Tech Stack:** Node.js 24, static HTML generator, CSS, Node test runner, local Node preview server.

**Spec:** `docs/superpowers/specs/2026-10-07-perth-roof-care-ui-service-expansion-design.md`

## Global Constraints

- Preserve every existing public route, image asset, page copy, project record, sitemap entry, RSS output and machine-readable file unless a source-of-truth update adds a replacement.
- Do not infer price, product, rating, review, licence, certification, warranty, response-time, inventory or performance claims. When the user supplies verifiable source material, add matching visible copy and then the applicable structured-data fields.
- Structured data and JSON feeds must map to visible, canonical page facts.
- Use only `LocalBusiness` / `Organization`, `WebSite`, `WebPage`, `Service`, `Article`, `FAQPage` and applicable breadcrumb schema.
- Keep `/news/feed.xml`; add `/news/feed.json` rather than replacing RSS.
- Do not deploy or promote through Vercel. The final delivery is a local preview URL only.

## Review Focus

- Mobile hero: one overlay remains legible without reintroducing multiple pseudo-element image layers.
- Home grid: nine service cards appear with no empty slot and each destination is a canonical local page.
- Footer: Facebook and Instagram are present on every generated route, use the supplied URL, and open safely in a new tab.
- Feed discovery: JSON Feed and RSS links resolve from the news index and articles, with valid JSON and canonical URLs.
- FAQ parity: every `FAQPage` question and answer is visible in the matching HTML, including new service pages.

---

### Task 1: Lock in the changed public-contract tests

**Files:**
- Modify: `static-smoke.test.mjs`

**Interfaces:**
- Consumes: generated static site from `node vercel-build.mjs`.
- Produces: assertions that protect the nine-card grid, new routes, social row, overlay contract and feed/schema parity.

- [ ] **Step 1: Write failing homepage and visual-contract assertions**

Assert that the generated homepage has nine `.home-service-map .card` service cards, links to `/roof-cleaning-painting/` and `/commercial-roof-repairs/`, and uses exactly one declared background/overlay path for the home hero.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node --test static-smoke.test.mjs --test-name-pattern "homepage"`

Expected: FAIL because the homepage only contains seven service cards and the new links do not yet exist.

- [ ] **Step 3: Write failing route, footer and machine-readable assertions**

Add tests asserting both new route files have one H1, canonical URL, service schema and visible three-question FAQ; generated footer markup includes both Instagram and `https://share.google/FPWKvdrPRx3yeK9gp`; `/news/feed.json` parses as JSON Feed 1.1; news index and all generated articles advertise `application/feed+json`; and `FAQPage` JSON-LD matches visible `details` content.

- [ ] **Step 4: Run the focused tests to verify they fail**

Run: `node --test static-smoke.test.mjs --test-name-pattern "feed|Facebook|commercial|cleaning"`

Expected: FAIL because the new routes, feed output and Facebook markup are absent.

- [ ] **Step 5: Commit the test contract**

```bash
git add static-smoke.test.mjs
git commit -m "test: define UI and structured feed contract"
```

### Task 2: Add the service data and crawlable routes

**Files:**
- Modify: `build.mjs: focusedServices, serviceHeroImages, focusedHomeRoutes, service navigation, footer service links, finalSitemapRoutes`
- Modify: `static-smoke.test.mjs`

**Interfaces:**
- Consumes: `focusedServices[route]` fields used by `conciseFocusedServicePage(service, heroImage)` and `servicePageSchema(route, service)`.
- Produces: `focusedServices['roof-cleaning-painting']` and `focusedServices['commercial-roof-repairs']`, each with title, H1, description, scope, assessment cards, FAQ questions, related service links and a selected existing image.

- [ ] **Step 1: Add `roof-cleaning-painting` service data and route**

Use existing supplied roof imagery; write factual copy covering surface preparation, roof cleaning, roof painting/coating appearance, adjacent drainage and condition-dependent scope. Include three visible FAQs and related links to maintenance, tile, metal, restoration, gutters and contact.

- [ ] **Step 2: Add `commercial-roof-repairs` service data and route**

Use an existing metal-roof project image; write factual copy covering commercial roof sheets, penetrations, flashings, gutters, drainage paths, access planning and staged work. Include three visible FAQs and related links to metal, leak, flashing, gutter, storm and contact pages.

- [ ] **Step 3: Extend global discovery paths**

Add both routes to the header service menu, footer core-service links, `/services/`, `focusedHomeRoutes`, `finalSitemapRoutes`, `robots.txt`-referenced sitemap output and the generator’s canonical route list. Do not remove existing service links.

- [ ] **Step 4: Run the service and sitemap tests**

Run: `npm test`

Expected: PASS, including new route, internal-link and sitemap assertions.

- [ ] **Step 5: Commit the service expansion**

```bash
git add build.mjs static-smoke.test.mjs sitemap.xml robots.txt services index.html roof-cleaning-painting commercial-roof-repairs
git commit -m "feat: add cleaning and commercial roof repair services"
```

### Task 3: Implement the shared visual system and home composition

**Files:**
- Modify: `public/assets/css/site.css`
- Modify: `public/assets/css/brand-hero.css`
- Modify: `build.mjs: focusedHome markup and global shared markup classes`
- Modify: `static-smoke.test.mjs`

**Interfaces:**
- Consumes: generated semantic classes `.home-topic-rail`, `.home-service-map`, `.card`, `.case-library-card`, `.area-region-card`, `.contact-band`, `footer`.
- Produces: CSS custom properties `--ink`, `--slate`, `--roof-grey`, `--sand`, `--porcelain`, `--clay` and a shared rounded-card treatment.

- [ ] **Step 1: Apply the six-token visual system at `:root`**

Replace green-heavy background, divider and CTA assignments with the specified graphite, warm-white, roof-grey, sand and clay tokens. Preserve contrast and add visible keyboard focus styles using the clay accent.

- [ ] **Step 2: Create shared rounded landscape-card rules**

Apply a common radius, border, surface, hover and spacing treatment to generic cards, service cards, case cards and area cards. Keep card content in normal document flow; set desktop grids to equal rows and responsive grids to two then one columns.

- [ ] **Step 3: Simplify the homepage hero**

Make `.home-topic-rail.home-hero-backdrop` use one hero image and a single linear-gradient pseudo-element. Remove the additional visual layer responsible for the current mask misalignment. At narrow widths, change only the gradient direction/opacity, not the number of image layers.

- [ ] **Step 4: Refine shared navigation, buttons, enquiry band and footer**

Use the new palette and roofline-rule motif for these shared components. Keep existing content, contact facts, accessibility labels and responsive menu behavior.

- [ ] **Step 5: Build and run all visual-structure tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 6: Commit the visual refresh**

```bash
git add public/assets/css/site.css public/assets/css/brand-hero.css build.mjs static-smoke.test.mjs
git commit -m "feat: refresh Perth Roof Care visual system"
```

### Task 4: Add visible social parity and safe organization metadata

**Files:**
- Modify: `build.mjs: footer(), organization/local-business schema construction`
- Modify: `public/assets/css/site.css`
- Modify: `static-smoke.test.mjs`

**Interfaces:**
- Consumes: existing `instagramLink` and footer builder.
- Produces: a matching `facebookLink` and organisation `sameAs` array containing only visible social destinations.

- [ ] **Step 1: Add the Facebook footer link beside Instagram**

Create a link with the exact supplied URL, an accessible label, matching text/icon alignment, `target="_blank"` and `rel="noopener noreferrer"`. Do not add a false platform icon if no supplied Facebook asset exists; use a text monogram or accessible inline SVG styled consistently.

- [ ] **Step 2: Add Facebook to organisation schema only after footer visibility exists**

Include the exact URL in `sameAs` in the site-wide Organisation/LocalBusiness JSON-LD. Preserve existing business identity and contact data.

- [ ] **Step 3: Run social and schema parity tests**

Run: `node --test static-smoke.test.mjs --test-name-pattern "Facebook|organization|footer"`

Expected: PASS.

- [ ] **Step 4: Commit the social update**

```bash
git add build.mjs public/assets/css/site.css static-smoke.test.mjs
git commit -m "feat: add Facebook footer and organization link"
```

### Task 5: Publish truthful JSON Feed and FAQ/article structured mappings

**Files:**
- Modify: `build.mjs: head(), article schema helper, FAQ generation, news feed output`
- Modify: `static-smoke.test.mjs`
- Create (generated): `news/feed.json`

**Interfaces:**
- Consumes: `newsArticleRecords`, article visible title/lead/description/questions and existing site constants.
- Produces: `newsJsonFeed(records) -> JSON.stringify(feed)`, `pageKnowledgeBlock(route, pageType, relatedUrls) -> script markup`, and visible-content-matched `FAQPage` entries.

- [ ] **Step 1: Generate a standards-compliant JSON Feed 1.1 document**

Implement `newsJsonFeed(records)` in `build.mjs`. Use only existing article IDs/slugs, canonical URLs, titles, descriptions/leads and publication dates. Write it to `/news/feed.json`; retain `/news/feed.xml` unchanged.

- [ ] **Step 2: Add feed discovery links**

Extend the shared document head so `/news/` and article routes expose both RSS (`application/rss+xml`) and JSON Feed (`application/feed+json`) alternate links with canonical absolute URLs.

- [ ] **Step 3: Add compact page knowledge blocks**

Implement `pageKnowledgeBlock()` as an `application/json` script. Emit only public, visible facts: Ellis Services Group identity, Perth Roof Care alternate name, operator relationship, canonical URL, page type, service region and contextual internal links. Add it to service, FAQ and article routes without hiding content or adding keyword-only fields.

- [ ] **Step 4: Align FAQPage schema with visible questions and answers**

Refactor the FAQ rendering data so service pages, article pages and `/faq/` use the same question/answer arrays for visible `<details>` and JSON-LD. Never output a FAQ schema question that is not visible to users.

- [ ] **Step 5: Validate feeds, JSON-LD and tests**

Run: `npm test`

Expected: PASS. Add a direct Node parse assertion for `news/feed.json`, and assert that any structured claim type is only emitted when it has matching visible, sourced content.

- [ ] **Step 6: Commit the feed and schema work**

```bash
git add build.mjs static-smoke.test.mjs news/feed.json news/feed.xml llms.txt
git commit -m "feat: add truthful JSON feed and FAQ discovery"
```

### Task 6: Local build, responsive review and preview handoff

**Files:**
- Verify: `build.mjs`, `public/assets/css/site.css`, `public/assets/css/brand-hero.css`, generated routes, `news/feed.json`, `static-smoke.test.mjs`
- Run: `local-server.mjs`

**Interfaces:**
- Consumes: final generated static files from `npm test`.
- Produces: a running local preview URL; no Vercel deployment or promotion.

- [ ] **Step 1: Execute final verification**

Run: `node --check build.mjs; npm test`

Expected: both commands succeed with all test cases passing.

- [ ] **Step 2: Inspect generated output**

Confirm homepage contains exactly nine service cards and no blank grid tile; verify both new routes, `news/feed.json`, JSON-LD, FAQ parity, sitemap entries and both footer social links in generated files.

- [ ] **Step 3: Start the local server**

Run: `npm run dev`

Expected: the server prints a localhost URL. Keep this process running.

- [ ] **Step 4: Perform desktop and mobile browser checks**

Check `/`, `/services/`, both new routes, `/news/`, one article, `/faq/` and `/service-areas/`. Verify the single hero overlay, rounded rectangular cards, full grid, social alignment and responsive reflow.

- [ ] **Step 5: Handoff without deployment**

Report the local URL and test result to the user. Explicitly state that Vercel production has not been changed and wait for approval before any deployment.
