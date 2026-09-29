# Service Page Keyword and Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace generic core-service copy with keyword-led, service-specific guidance and publish accurate structured-data/RSS discovery signals.

**Architecture:** `build.mjs` remains the static-site source of truth. Each `focusedServices` record becomes the source for visible content, contextual links and metadata. The renderer derives JSON-LD and feed discovery from this same record to prevent claims drifting from user-visible content.

**Tech Stack:** Node.js static generator (`build.mjs`), Node built-in test runner (`static-smoke.test.mjs`), HTML, JSON-LD, RSS XML.

**Spec:** `docs/superpowers/specs/2026-09-29-service-page-keyword-and-discovery-design.md`

## Global Constraints

- Do not hide text, links, keywords, JSON claims or feeds from users to manipulate crawlers.
- Do not make unverified claims about licensing, approval, attendance, pricing, guarantees, years of experience or outcomes.
- Do not introduce duplicate local-keyword doorway pages.
- JSON-LD must describe visible, current page content only.
- Keep existing documented galleries and related-service routes intact.
- Run `npm test` after every task; stage only named source/test/doc files, never generated site output.

## Review Focus

- JSON-LD service name, URL and title must match rendered HTML; Task 2 tests representative routes.
- Secondary phrases must appear as useful context, not a keyword list; Task 1 tests unique page-specific assessment copy and retired heading removal.
- Storm content must qualify attendance by weather, access and safety; Task 1 tests that wording.
- RSS discovery must be a standard link and point to an existing feed; Task 2 tests it.
- Case galleries and crawlable related links must survive the rewrite; Task 3 tests generated routes and checks responsive layout.

---

### Task 1: Service-intent content model and visible template

**Files:**
- Modify: `build.mjs: focusedServices through conciseFocusedServicePage`
- Modify: `static-smoke.test.mjs: core-service tests near 119-129`

**Interfaces:**
- Consumes: route-keyed `focusedServices` records and `serviceHeroImages`.
- Produces: a shared service renderer accepting `scopeHeading`, `scopeParagraphs`, `assessmentHeading`, three `assessmentCards`, `prepareHeading`, `prepareItems`, `links`, and `serviceType`.

- [ ] **Step 1: Write the failing content-template test**

Cover `roof-repairs`, `roof-leak-repairs`, `tile-roof-repairs`, `metal-roof-repairs`, `ridge-capping-repointing`, `flashing-repairs`, `gutter-repairs`, `roof-inspection`, `roof-maintenance`, and `storm-damage-roof-repairs`. Assert each output has its exact H1, a service-specific scope heading, three assessment cards, a safety/preparation section, and neither retired generic heading. Assert storm copy contains `weather`, `access`, and `safety`.

- [ ] **Step 2: Run the test and observe the expected failure**

Run `node --test static-smoke.test.mjs --test-name-pattern "core service"`. Expect failure because the generic headings and professional assessment/preparation fields do not yet exist.

- [ ] **Step 3: Add the service-specific data and renderer**

Implement the approved keyword map in the ten service records. Render: professional scope, three material/symptom/context cards, safe enquiry preparation, existing documented case record where available, and three or four technical related links. Do not add claims beyond supplied business information.

- [ ] **Step 4: Verify green and commit**

Run the focused test and then `npm test`; both must pass. Commit only `build.mjs` and `static-smoke.test.mjs` with `feat: expand professional service content`.

### Task 2: Service JSON-LD and RSS discovery

**Files:**
- Modify: `build.mjs: head/layout helpers, core-service generation, news feed discovery`
- Modify: `static-smoke.test.mjs: structured-data and RSS assertions`

**Interfaces:**
- Consumes: Task 1 `title`, `h1`, `serviceType`, route and visible content fields.
- Produces: `servicePageSchema(route, service)` yielding one JSON-LD `@graph` with `WebPage`, `Service`, `BreadcrumbList`; a shared RSS alternate link to `/news/feed.xml`.

- [ ] **Step 1: Write failing metadata tests**

For gutter, leak and storm routes, parse each JSON-LD script. Require one graph with `WebPage`, `Service`, `BreadcrumbList`, a service name/URL matching visible output, and provider `https://www.perthroofcare.com.au/#business`. Require RSS alternate links on all ten core service routes and `/news/`, plus valid RSS root in `news/feed.xml`.

- [ ] **Step 2: Run the metadata tests and observe failure**

Run `node --test static-smoke.test.mjs --test-name-pattern "service metadata|RSS discovery"`. Expect failure because core service routes currently have neither graph nor feed discovery.

- [ ] **Step 3: Implement metadata from the service record**

Generate only provider identity already on the site, canonical URL, visible service name, `areaServed` Perth/WA and visible breadcrumb hierarchy. Add the standard RSS alternate link to every service page and retain it on news. Add one visible RSS resource link in the news/resources path; do not use fake schema fields or invisible feed content.

- [ ] **Step 4: Verify green and commit**

Run focused metadata tests then `npm test`; both must pass. Commit only `build.mjs` and `static-smoke.test.mjs` with `feat: add service schema and feed discovery`.

### Task 3: Build-output preservation and responsive verification

**Files:**
- Modify only if required: `build.mjs`, `static-smoke.test.mjs`
- Generated during verification only: service routes and `news/feed.xml`

**Interfaces:**
- Consumes: Task 1 rendered content and Task 2 JSON-LD/RSS artifacts.
- Produces: verified output retaining case galleries and crawlable relevant links at desktop and mobile widths.

- [ ] **Step 1: Write a failing preservation test if an equivalent one does not already exist**

Assert all ten service routes include a related-service navigation with at least three ordinary anchors and every previously documented case gallery remains. If the existing test already proves precisely this rendered behavior, record that no duplicate test is needed and run it instead.

- [ ] **Step 2: Verify the preservation behavior**

Run `node --test static-smoke.test.mjs --test-name-pattern "service links|documented case"`. If a test was added, first observe failure, then make the smallest `build.mjs` change necessary and observe success.

- [ ] **Step 3: Run final build and visual checks**

Run `npm test`; expect all tests pass. Inspect `/gutter-repairs/` and `/storm-damage-roof-repairs/` at desktop and 531px widths: readable headings, no overlap, galleries after information, and unobtrusive metadata/feed changes.

- [ ] **Step 4: Commit only if Task 3 changes source or tests**

If a change was required, stage only its named source/test files and commit `test: preserve service information paths`. Do not create an empty commit.

## Self-review

- Spec coverage: Task 1 implements useful visible content; Task 2 implements truthful discovery data; Task 3 preserves user-facing evidence and responsive presentation.
- Step scan: every task follows RED → expected failure → minimal implementation → green verification → full suite and commit.
- Type consistency: Task 1 creates fields Task 2 consumes; Task 2 creates artifacts Task 3 verifies.
- Review Focus: each risk has a named owning task and test.
- Proportion: three independent deliverables avoid both a monolithic change and implementation transcript.
