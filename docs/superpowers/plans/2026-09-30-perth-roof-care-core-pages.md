# Perth Roof Care core pages implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve seven existing core URLs, their mutual internal links and their evidence trail without changing production routing or making unverified commercial claims.

**Architecture:** `build.mjs` remains the sole public-page generator. The priority pages receive data-driven service definitions and explicit output checks in `static-smoke.test.mjs`; documentation and audit utilities live under `docs/seo/perth-roof-care` and `scripts`.

**Tech Stack:** Node.js static generator, Node test runner, Vercel static output.

**Spec:** `docs/superpowers/specs/2026-09-30-perth-roof-care-core-pages-design.md`

## Global Constraints

- Preserve all existing URL paths, public brand and confirmed contact information.
- Australian English on public pages; Chinese implementation records.
- No unverified commercial claims, fake cases, automatic release, Search Console submission or form submission.
- Sitemap contains canonical indexable routes only; local count is a check, not an indexing claim.

## Review Focus

- A change to shared page generation could accidentally alter an unmodified service page.
- A new service can lose its self-canonical or structured data if omitted from the generator mappings.
- Gutter/downpipe pages could drift into duplicate or unsupported underground-drainage claims.
- Article/service reciprocal links could be emitted only in source text rather than final HTML.
- A local build can pass while live production is stale; the audit records the two states separately.

### Task 1: Add owner-page output checks

**Files:**
- Modify: `static-smoke.test.mjs`

- [ ] **Step 1: Write failing tests** for the seven owner pages, reciprocal flashing and drainage links, canonical/indexability, and unique gutter/downpipe wording.
- [ ] **Step 2: Run `node --test static-smoke.test.mjs`** and verify expected assertion failures before changing the generator.
- [ ] **Step 3: Implement the smallest generator changes** that make those checks pass.
- [ ] **Step 4: Run `npm test`** and verify the complete suite passes.
- [ ] **Step 5: Commit** the test and generator changes.

### Task 2: Add reproducible sitemap and URL-audit evidence

**Files:**
- Create: `scripts/audit-sitemap.mjs`
- Create: `docs/seo/perth-roof-care/*.csv`
- Create: `docs/seo/perth-roof-care/*.md`
- Modify: `static-smoke.test.mjs`

- [ ] **Step 1: Write failing test** for canonical sitemap paths, noindex exclusion and the audit-script interface.
- [ ] **Step 2: Run the focused test** and verify it fails before the utility exists.
- [ ] **Step 3: Implement local sitemap validation and a read-only live HTTP audit utility**, then write the baseline, intent, change, validation, GSC follow-up and local-evidence records.
- [ ] **Step 4: Run `npm test` and the audit utility**; record its actual result and exceptions.
- [ ] **Step 5: Commit** source, tests and documentation.

### Task 3: Browser and final review

**Files:**
- Modify: `docs/seo/perth-roof-care/validation.md`

- [ ] **Step 1: Run production build and the full static suite.**
- [ ] **Step 2: Perform desktop and mobile visual checks on the local static build without form submission.**
- [ ] **Step 3: Record actual observations, review the branch diff, and update validation evidence.**
- [ ] **Step 4: Commit** final evidence only if it is not a generated artifact.
