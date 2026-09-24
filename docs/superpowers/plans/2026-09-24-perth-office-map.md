# Perth Office Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible, responsive Perth office location section to the bottom of the generated homepage and verify it in a local-only preview.

**Architecture:** `build.mjs` remains the single source of generated route HTML and appends the homepage-only section before `</main>`. `site.css` supplies a focused visual frame, while `static-smoke.test.mjs` validates generated markup and CSS contracts after the build.

**Tech Stack:** Node.js ES modules, Node built-in test runner, static HTML/CSS, existing local Node server.

**Spec:** `docs/superpowers/specs/2026-09-24-perth-office-map-design.md`

## Global Constraints

- Address text is exactly `140 St Georges Terrace, Perth WA 6000, Australia` in the office section.
- Keep the section homepage-only and immediately before the existing footer/contact band.
- Use a Google Maps address-query iframe; preserve the user-provided Place URL as the external map link.
- Do not hand-edit generated route files or `public/`.
- Run locally only; do not deploy, publish, or alter Vercel/DNS.

## Review Focus

- Desktop width: the map remains inside the normal content container rather than overflowing the viewport.
- Mobile width: the iframe stays full-width and its readable aspect ratio is retained.
- Assistive technology: the iframe has a descriptive title and the external link states its destination.
- Scope: no route other than `/` receives the office-location marker.
- Build output: `npm test` regenerates the section consistently, rather than relying on a manually edited HTML artifact.

---

### Task 1: Homepage office-location contract

**Files:**
- Modify: `static-smoke.test.mjs`

**Interfaces:**
- Consumes: generated home HTML returned by `readFileSync(fileFor(''), 'utf8')`.
- Produces: a test that requires `data-office-location`, heading, confirmed address, iframe, map URL, homepage-only scope, and footer placement.

- [ ] **Step 1: Write the failing test**

```js
test('homepage provides a confirmed Perth office map before the footer', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  const section = home.match(/<section class="office-location"[\s\S]*?<\/section>/i)?.[0] ?? '';
  assert.match(section, /data-office-location/i);
  assert.match(section, /<h2>VISIT OUR PERTH OFFICE\.<\/h2>/i);
  assert.match(section, /140 St Georges Terrace, Perth WA 6000, Australia/i);
  assert.match(section, /<iframe[^>]+title="Map showing 140 St Georges Terrace, Perth"/i);
  assert.match(section, /google\.com\/maps\?q=140%20St%20Georges%20Terrace%2C%20Perth%20WA%206000%2C%20Australia&amp;output=embed/i);
  assert.match(section, /<a[^>]+href="https:\/\/www\.google\.com\/maps\/place\/140\+St\+Georges\+Terrace/i);
  assert.ok(home.indexOf(section) < home.indexOf('<footer>'));
  for (const route of routes) {
    if (route) assert.doesNotMatch(readFileSync(fileFor(route), 'utf8'), /data-office-location/i);
  }
});

test('office map frame has responsive dimensions', () => {
  const css = readFileSync(join(root, 'site.css'), 'utf8');
  assert.match(css, /\.office-map-frame\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/i);
  assert.match(css, /\.office-map-frame iframe\s*\{[^}]*width:\s*100%/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test static-smoke.test.mjs --test-name-pattern="office"`

Expected: FAIL because `data-office-location` and `.office-map-frame` do not exist.

### Task 2: Generate the office section

**Files:**
- Modify: `build.mjs`
- Modify: `site.css`

**Interfaces:**
- Consumes: home route HTML passed to `amendRoute('', amend)` and the existing design tokens in `site.css`.
- Produces: generated homepage markup with `.office-location` and `.office-map-frame` matching Task 1's contract.

- [ ] **Step 1: Add the homepage-only markup generator**

```js
const officeMap = `<section class="section office-location" data-office-location><div class="container"><p class="eyebrow">PERTH / OFFICE</p><h2>VISIT OUR PERTH OFFICE.</h2><p>140 St Georges Terrace, Perth WA 6000, Australia</p><p>Please contact Ellis Services Group before visiting our Perth office.</p><div class="office-map-frame"><iframe title="Map showing 140 St Georges Terrace, Perth" src="https://www.google.com/maps?q=140%20St%20Georges%20Terrace%2C%20Perth%20WA%206000%2C%20Australia&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div><p><a class="text-link" href="https://www.google.com/maps/place/140+St+Georges+Terrace,+Perth+WA+6000,+Australia/@-31.954352,115.853879,17z/data=!3m1!4b1!4m6!3m5!1s0x2a32bad5b711261f:0x12c77c0f1610d087!8m2!3d-31.954352!4d115.8564539!16s%2Fg%2F11c466pb_t?entry=ttu&amp;g_ep=EgoyMDI2MDkyMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">Open in Google Maps</a></p></div></section>`;
amendRoute('', (html) => html.replace('</main>', `${officeMap}</main>`));
```

- [ ] **Step 2: Add only the component CSS**

```css
.office-location{border-top:1px solid var(--sand-line);background:var(--sky-wash)}
.office-location> .container{max-width:960px}
.office-map-frame{aspect-ratio:16 / 9;border:1px solid var(--sand-line);background:var(--paper);overflow:hidden}
.office-map-frame iframe{display:block;width:100%;height:100%;border:0}
```

- [ ] **Step 3: Run focused test to verify it passes**

Run: `node --test static-smoke.test.mjs --test-name-pattern="office"`

Expected: PASS for both office tests.

### Task 3: Regenerate, validate, and preview locally

**Files:**
- Generated by command only: `index.html`, route folders, `public/`

**Interfaces:**
- Consumes: source and tests from Tasks 1–2.
- Produces: verified local static output served by `local-server.mjs`.

- [ ] **Step 1: Run the complete suite**

Run: `npm test`

Expected: `vercel-build.mjs` completes and every Node test passes.

- [ ] **Step 2: Start the local preview**

Run: `npm run dev`

Expected: the server reports a loopback URL and serves the generated homepage.

- [ ] **Step 3: Verify HTTP output**

Run: `curl.exe -I http://127.0.0.1:<reported-port>/`

Expected: `HTTP/1.1 200 OK`.

- [ ] **Step 4: Inspect the local homepage in a browser**

Expected: the section sits above the current contact band/footer, map is visible, address and Google Maps link match the confirmed office location, and no production state changes.

## Self-review

- Spec coverage: Tasks 1–3 cover the placement, copy, iframe/link, responsive styling, generated output, full test suite, and local-only verification requirements.
- Placeholder scan: no TODO/TBD values or unspecified interfaces remain.
- Type consistency: the test, generator, and CSS share `office-location` and `office-map-frame` names.
- Review focus coverage: Task 1 checks accessible markup and route scope; Task 2 checks responsive CSS; Task 3 checks generated output and local HTTP availability.
