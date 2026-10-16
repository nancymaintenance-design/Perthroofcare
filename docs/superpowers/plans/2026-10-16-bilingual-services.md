# Bilingual Services Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Deliver 69 English/Chinese page pairs with navigation language switching and localized content, metadata and form feedback.

**Architecture:** Final English DOM remains authoritative; a dedicated build-time translator creates `/zh/` pages with curated Simplified Chinese strings. A stable keyed catalog detects untranslated changes. One final build integration owns publication, hreflang, feeds and shared interactive locale messages.

**Tech Stack:** Existing Node24, Cheerio, static HTML, plain JS, CSS and node:test; no new runtime dependencies.

**Spec:** ../specs/2026-10-16-bilingual-services-design.md

## Global Constraints

- Sole source: E:/Ellis-Services/Perth Roof Care/source. Reports: ../reports. No archive/old-worktree changes; no push or deployment.
- Preserve the preceding inspection-copy cleanup and all unrelated changes. Original tel:+61405878406, mailto:ellisservicesgroup3@outlook.com and /api/enquiry remain operational.
- English en-AU keeps its URL; Simplified Chinese zh-Hans uses /zh/ and the same route suffix. 69 pairs / 138 pages.
- Switch labels: English page 中文服务; Chinese page English. Matching route, query and fragment are preserved. No automatic redirects or preference storage.
- Translate readable content and accessibility/SEO/form copy. Keep legal company name, identifiers, media, dates and facts accurate. No generic repeated inspection billing notices, no new promises, slogans or empty sections.
- Missing translations fail the build. English fallback is not a complete Chinese page.
- Only existing dependencies, font assets and brand palette; preserve route CSS/image and API ownership.

## Review Focus

- Rebuild twice: derived Chinese routes never enter the base route source or become /zh/zh/.
- Inline links, whitespace and entities remain valid after translation; URLs, identifiers and JS JSON keys are not translated.
- A service's anchor links and query survive English→Chinese→English switching.
- Chinese network/server errors and validation remain readable, preserve input, and allow retry.
- About/Contact route CSS and long navigation remain usable at 390px and 1280px.

### Task 1: Translation foundation and source catalog

**Files:** Create content/i18n/catalog.mjs, content/i18n/localize.mjs, tools/translation-catalog.mjs, bilingual-foundation.test.mjs. No build wiring yet.

**Interfaces:** collectPageStrings(html:string) returns Map<string,string> keyed by stable 12+ character SHA256 of normalized source; translated strings maps are id→Chinese. localizePage(html, options) returns translated HTML, consumes route/known English route set/dictionary/site base. Options distinguish English decoration from Chinese transformation. Unknown meaningful strings raise an explicit missing-translation error; neutral brand/identifier strings have documented passthrough rules.

- [ ] Write/run fixture tests RED for text and attributes, metadata and readable JSON, inline links, URL rewrites, idempotent EN language link, canonical/hreflang, missing translations, preserve contacts/assets/API.
- [ ] Implement extraction and localization with deterministic stable keys and strict coverage; translate only human-readable JSON values, never structural keys/types/URLs. Match the spec's language pair. Feed/helper interfaces can be deferred to Task3 but must be described in the report.
- [ ] Generate the full current69-page source catalog in the plan workspace, split into manageable batches (roughly 150–250 source strings), alongside route provenance and neutral exclusions. This is the input to Task2, not a third-party export.
- [ ] Run focused tests and existing suite once. Commit only owned source/test files. Record commands, RED/GREEN, catalog paths and dictionary contract in task report.

### Task 2: Full Simplified Chinese content

**Files:** Create content/i18n/zh/*.json only; report in this plan workspace. Read the generated catalog from Task1.

**Interfaces:** Each JSON file exports a plain object of stable source ID→Chinese translation. The union covers every meaningful catalog string once, including meta/ARIA/JSON human text, while documented neutral values may remain unchanged.

- [ ] Read each catalog batch and translate every entry to natural, accurate Simplified Chinese with the spec's roofing vocabulary. Preserve original facts, named companies, addresses, dates and stage distinctions. Do not omit/rewrite sections or introduce assertions.
- [ ] Keep translations concise and cohesive around inline links. Brand names/ABN/ACN, safe raw identifiers may remain English according to the catalog exclusions. Never translate URL, type identifier or code strings.
- [ ] Validate JSON parsing, IDs, nonempty values and total coverage against all catalog batches with a real dictionary union check. Check translated HTML fixtures using the foundation helper. Commit only translation files. Report completeness and uncertainties.

### Task 3: Build integration, interaction and verification

**Files:** Modify vercel-build.mjs, tools/bundle-stylesheets.mjs, site.js, refinement.css, DESIGN.md, package.json and exact affected legacy test helpers; create tools/build-locales.mjs and bilingual-site.test.mjs. Update generated publish artifacts normally. Refine foundation only if integration reveals a concrete need.

**Interfaces:** buildLocales(root) consumes final English page files + base sitemap and the Task2 dictionary. It writes Chinese counterpart files, decorates English counterparts with language links/hreflang, generates locale feeds and extends canonical sitemap to138; invoked after English build, before image optimization and copying. Base English route tests derive English-only pages; bilingual-site tests inspect all138.

- [ ] Add/run RED integration checks for69 counterparts, strict catalog completeness, all canonical/hreflang reciprocal pairs, internal links, shared media/API, Chinese JSON-LD parity, feeds and build idempotence.
- [ ] Wire the final locale pass once into the current pipeline. Resolve About/Contact CSS ownership for zh/ routes without duplicating style declarations. Preserve all original image processing/publication logic. Add Chinese font/word spacing only where required.
- [ ] Add locale-aware shared JS messages and dynamic switch query/hash preservation. Verify Chinese blank/invalid form, sending, success, known server errors, network failure and re-enable; retain inputs on failures. Keep actual API calls unchanged.
- [ ] Update only English-only test inventories/count expectations to preserve their original assertions on69 English pages. Add Chinese-specific checks rather than weakening existing intent/content rules.
- [ ] Run full npm test once on final code, build twice to prove idempotence, and focused relevant tests after fixes. Verify browser desktop/mobile language menu and counterpart flow, Contact validation and preview failure without real email submission. Save screenshots and write a short final report in ../reports/2026-10-16-bilingual.
- [ ] Review own diff, commit scoped feature and generated files, report tests and concerns. No external writes.

## Execution record

User approved the presented69-page scheme and execution continues under that authorization. Execution uses the sole source checkout on codex/bilingual-services-20261016; the preceding fee cleanup is preserved in a separate local commit. The skill's extra artifact review handoffs are treated as satisfied by the confirmed concrete scheme and the current instruction to complete authorized reversible work; no repeated approval request for the same feature. Publishing remains excluded until explicitly requested.
