# Roof Leak SEO Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Publish a privacy-safe, first-party Roleystone metal-roof fastener leak case study and strengthen the roof-leak / metal-roof SEO cluster without unverified business claims.

**Architecture:** build.mjs remains the single source for routes, HTML, metadata, sitemap and JSON-LD. A small project data object supplies approved copy, images and links; generated output remains untracked. static-smoke.test.mjs checks public SEO, privacy and content requirements.

**Tech Stack:** Node.js static-site generator, static HTML/CSS/JavaScript, Node test runner, Vercel.

**Spec:** docs/superpowers/specs/2026-09-24-roof-leak-seo-case-study-design.md

## Global Constraints

- Show only Roleystone, WA; never show the Heath Road address.
- Use only supplied facts: aged/rusted metal-roof fastener or rivet points, structural adhesive, and renewed coating/spraying after a limited-budget discussion.
- Treat the four supplied photographs as site-detail images, not before/after evidence.
- Do not publish ratings, reviews, prices, licences, insurance, warranties, response-time promises or guaranteed results.
- Do not add GA4, Resend credentials, placeholder measurement IDs or tracking code.
- Stage only source files and approved image assets; do not stage generated routes, public, index.html, robots.txt or .vercel.

## Review Focus

- The precise property address must not appear in HTML, JSON-LD, alt text or sitemap data.
- Four unique image assets must keep repair details visible on desktop and mobile without distortion.
- Case-study copy must name the known scope but must not turn it into a universal repair recommendation.
- The route must have one H1, a unique title/description, canonical, sitemap entry and crawlable internal links.
- JSON-LD must exclude rating, review, price, licence, insurance and warranty fields.

---

### Task 1: Add approved project assets and route

**Files:**
- Create: assets/images/roleystone-metal-fastener-rust-01.jpg
- Create: assets/images/roleystone-metal-fastener-rust-02.jpg
- Create: assets/images/roleystone-metal-fastener-detail-03.jpg
- Create: assets/images/roleystone-metal-fastener-detail-04.jpg
- Modify: build.mjs
- Modify: site.css
- Modify: static-smoke.test.mjs

**Interfaces:**
- Consumes: the four user-supplied source images.
- Produces: /projects/roleystone-metal-roof-fastener-leak-repair/ and four public asset paths.

- [ ] **Step 1: Write the failing test**

Add to static-smoke.test.mjs:

~~~js
test('Roleystone project protects property privacy and documents the confirmed repair approach', () => {
  const html = readFileSync(fileFor('projects/roleystone-metal-roof-fastener-leak-repair'), 'utf8');
  assert.match(html, /<title>Metal Roof Leak Repair Roleystone WA \| Ellis Services Group<\/title>/);
  assert.match(html, /Roleystone, WA/);
  assert.doesNotMatch(html, /Heath Road|160-154/i);
  assert.match(html, /structural adhesive/i);
  assert.match(html, /renewed coating|recoating|spraying/i);
  for (const href of ['/roof-leak-repairs/', '/metal-roof-repairs/', '/flashing-repairs/', '/roof-inspection/', '/contact/']) assert.match(html, new RegExp('href="' + href + '"'));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  const images = [...html.matchAll(/\/assets\/images\/(roleystone-metal-fastener-[^"?]+\.jpg)/g)].map(([, value]) => value);
  assert.equal(new Set(images).size, 4);
  for (const image of images) assert.ok(existsSync(join(root, 'assets', 'images', image)));
});
~~~

- [ ] **Step 2: Run the test and verify RED**

Run: node vercel-build.mjs; node --test --test-name-pattern="Roleystone project protects" static-smoke.test.mjs

Expected: FAIL because the route and assets do not exist.

- [ ] **Step 3: Copy supplied images without altering originals**

Run:

~~~powershell
Copy-Item -LiteralPath 'E:\7. 真实案例图片、视频及项目说明\最新素材【屋顶室内外】\微信图片_2026-08-31_181813_366.jpg' -Destination 'assets\images\roleystone-metal-fastener-rust-01.jpg'
Copy-Item -LiteralPath 'E:\7. 真实案例图片、视频及项目说明\最新素材【屋顶室内外】\微信图片_2026-08-31_182210_606.jpg' -Destination 'assets\images\roleystone-metal-fastener-rust-02.jpg'
Copy-Item -LiteralPath 'E:\7. 真实案例图片、视频及项目说明\最新素材【屋顶室内外】\微信图片_2026-08-31_182213_175.jpg' -Destination 'assets\images\roleystone-metal-fastener-detail-03.jpg'
Copy-Item -LiteralPath 'E:\7. 真实案例图片、视频及项目说明\最新素材【屋顶室内外】\微信图片_2026-08-31_181733_694.jpg' -Destination 'assets\images\roleystone-metal-fastener-detail-04.jpg'
~~~

- [ ] **Step 4: Add a project data object and page renderer in build.mjs**

Append the project route to routes, add this unique description, and render the approved content:

~~~text
Roleystone metal roof fastener leak repair case study: rusted fixing points, a budget-aware structural-adhesive and coating repair approach.

METAL ROOF FASTENER LEAK REPAIR IN ROYLEYSTONE.

Observed condition
Ageing and rust around metal-roof fastener points were identified as part of the water-entry context.

Repair approach
For this property, the agreed scope used structural adhesive around affected fastener areas and renewed coating/spraying as a budget-aware repair approach.

Roof materials, corrosion, access and the wider water path differ from property to property, so a similar approach is not assumed to suit every roof.
~~~

Render four figure elements with copied assets, descriptive non-address alt text, and captions Site detail: metal-roof fastener condition. Link to roof-leak, metal-roof, flashing, roof-inspection and contact routes.

- [ ] **Step 5: Add responsive gallery CSS**

~~~css
.project-case-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:var(--sand-line)}
.project-case-grid figure{margin:0;background:var(--paper)}
.project-case-grid img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}
.project-case-grid figcaption{padding:.8rem 1rem;font-size:.86rem}
@media(max-width:640px){.project-case-grid{grid-template-columns:1fr}.project-case-grid img{aspect-ratio:16/11}}
~~~

- [ ] **Step 6: Run the test and verify GREEN**

Run: node vercel-build.mjs; node --test --test-name-pattern="Roleystone project protects" static-smoke.test.mjs

Expected: PASS.

- [ ] **Step 7: Commit**

~~~bash
git add build.mjs site.css static-smoke.test.mjs assets/images/roleystone-metal-fastener-rust-01.jpg assets/images/roleystone-metal-fastener-rust-02.jpg assets/images/roleystone-metal-fastener-detail-03.jpg assets/images/roleystone-metal-fastener-detail-04.jpg
git commit -m "feat: add Roleystone metal roof leak case study"
~~~

### Task 2: Strengthen roof-leak and metal-roof service hubs

**Files:**
- Modify: build.mjs
- Modify: static-smoke.test.mjs

**Interfaces:**
- Consumes: the Task 1 project route.
- Produces: two distinct commercial-intent service pages with reciprocal internal links.

- [ ] **Step 1: Write the failing test**

~~~js
test('roof leak and metal roof services form a focused cluster around the documented Roleystone project', () => {
  const project = '/projects/roleystone-metal-roof-fastener-leak-repair/';
  const leak = readFileSync(fileFor('roof-leak-repairs'), 'utf8');
  const metal = readFileSync(fileFor('metal-roof-repairs'), 'utf8');
  assert.match(leak, /<h1>ROOF LEAK REPAIRS IN PERTH\.<\/h1>/);
  assert.match(leak, /ceiling mark.*away from the point/i);
  assert.match(leak, /fastener|fixing/i);
  assert.match(leak, new RegExp('href="' + project + '"'));
  assert.match(metal, /aged fixing|fastener|corrosion/i);
  assert.match(metal, new RegExp('href="' + project + '"'));
  assert.match(metal, /href="\/roof-leak-repairs\/"/);
  assert.doesNotMatch(leak + metal, /lowest price|guaranteed|fully insured|licensed/i);
});
~~~

- [ ] **Step 2: Run the test and verify RED**

Run: node vercel-build.mjs; node --test --test-name-pattern="roof leak and metal roof services form" static-smoke.test.mjs

Expected: FAIL because the pages are generic.

- [ ] **Step 3: Implement focused service copy**

In build.mjs set the roof-leak title to Roof Leak Repairs Perth, description to Roof leak repairs in Perth: organise water-entry context around roof coverings, flashings, fasteners and drainage before an enquiry., and H1 to ROOF LEAK REPAIRS IN PERTH. State that a visible ceiling mark can be away from the entry point, list joins, valleys, penetrations, flashings, fasteners and drainage as context, and link to the Roleystone project.

For metal-roof-repairs, add a section on aged fixings, corrosion around fastener points and coating condition. Link it to the project and /roof-leak-repairs/; include: This documented approach is context for one project, not a universal repair specification.

- [ ] **Step 4: Run the test and verify GREEN**

Run: node vercel-build.mjs; node --test --test-name-pattern="roof leak and metal roof services form" static-smoke.test.mjs

Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add build.mjs static-smoke.test.mjs
git commit -m "feat: strengthen roof leak service cluster"
~~~

### Task 3: Add safe structured data and discovery links

**Files:**
- Modify: build.mjs
- Modify: static-smoke.test.mjs

**Interfaces:**
- Consumes: confirmed business identity and Task 1 project route.
- Produces: safe LocalBusiness, Service and BreadcrumbList nodes; homepage and Resources links.

- [ ] **Step 1: Write failing JSON-LD and discovery tests**

~~~js
test('local SEO markup uses confirmed facts and excludes unverified commercial claims', () => {
  const html = readFileSync(fileFor('projects/roleystone-metal-roof-fastener-leak-repair'), 'utf8');
  const json = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(([, value]) => value).join('');
  assert.match(json, /LocalBusiness/);
  assert.match(json, /Service/);
  assert.match(json, /BreadcrumbList/);
  assert.match(json, /140 St Georges Terrace/);
  assert.match(json, /Roleystone, WA/);
  assert.doesNotMatch(json, /Heath Road|160-154|AggregateRating|Review|price|license|insurance|warranty/i);
});
test('Roleystone project is discoverable from homepage and Resources', () => {
  const href = '/projects/roleystone-metal-roof-fastener-leak-repair/';
  for (const route of ['', 'news']) assert.match(readFileSync(fileFor(route), 'utf8'), new RegExp('href="' + href + '"'));
});
~~~

- [ ] **Step 2: Run the tests and verify RED**

Run: node vercel-build.mjs; node --test --test-name-pattern="(local SEO markup uses confirmed|Roleystone project is discoverable)" static-smoke.test.mjs

Expected: FAIL because JSON-LD nodes and discovery links are absent.

- [ ] **Step 3: Implement bounded JSON-LD and links**

For the project page generate a JSON-LD array with LocalBusiness facts already confirmed on the About page: Ellis Services Group Pty Ltd, website, +61405878406, ellisservicesgroup3@outlook.com, and 140 St Georges Terrace, Perth WA 6000. Include areaServed Perth. Add a Service node named Roof leak repair and metal roof repair for Perth, Western Australia, and a BreadcrumbList containing Home, Projects and this case study. Do not add geo, customer address, ratings, reviews, price, licence, insurance or warranty fields.

Add this card to homepage and Resources:

~~~html
<h3>Roleystone metal-roof fastener leak project</h3>
<p>A documented site-detail case study covering corrosion around metal-roof fasteners and a budget-aware repair discussion.</p>
<a href="/projects/roleystone-metal-roof-fastener-leak-repair/">Read the Roleystone project</a>
~~~

- [ ] **Step 4: Run the tests and verify GREEN**

Run: node vercel-build.mjs; node --test --test-name-pattern="(local SEO markup uses confirmed|Roleystone project is discoverable)" static-smoke.test.mjs

Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add build.mjs static-smoke.test.mjs
git commit -m "feat: add safe local service schema"
~~~

### Task 4: Full verification and production release

**Files:**
- Verify: build.mjs, site.css, static-smoke.test.mjs, and the four Roleystone image assets.

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: a tested main-branch release and verified public case-study page.

- [ ] **Step 1: Run the entire suite**

Run: npm test

Expected: exit code 0 and all static smoke tests pass.

- [ ] **Step 2: Verify commit scope**

Run:

~~~bash
git status --short
git diff --check HEAD
git diff --stat HEAD
~~~

Expected: source/docs/assets changes only; generated output remains untracked and unstaged.

- [ ] **Step 3: Push production**

Run: git push origin HEAD:main

Expected: GitHub accepts the new main revision.

- [ ] **Step 4: Verify production**

~~~powershell
Start-Sleep -Seconds 20
$page = Invoke-WebRequest -Uri 'https://www.perthroofcare.com.au/projects/roleystone-metal-roof-fastener-leak-repair/?seo-check=20260924' -UseBasicParsing
[pscustomobject]@{
  StatusCode = $page.StatusCode
  ProjectTitle = $page.Content.Contains('Metal Roof Leak Repair Roleystone WA | Ellis Services Group')
  RoleystoneOnly = $page.Content.Contains('Roleystone, WA') -and -not $page.Content.Contains('Heath Road')
  CaseLinks = $page.Content.Contains('/roof-leak-repairs/') -and $page.Content.Contains('/metal-roof-repairs/')
} | Format-List
~~~

Expected: HTTP 200 and every verification property is True.
