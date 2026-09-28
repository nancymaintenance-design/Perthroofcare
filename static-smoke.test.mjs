import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { spawn } from 'node:child_process';

const root = new URL('.', import.meta.url).pathname.replace(/^\/(.:)/, '$1');
const fileFor = (route) => join(root, route || '.', 'index.html');
const coreRoutes = ['roof-repairs', 'roof-leak-repairs', 'tile-roof-repairs', 'metal-roof-repairs', 'ridge-capping-repointing', 'flashing-repairs', 'roof-inspection', 'gutter-repairs', 'roof-maintenance'];
const publishedRoutes = ['', 'services', ...coreRoutes, 'service-areas', 'news', 'about', 'contact', 'privacy', 'legal'];
const contactFacts = ['0405878406', 'ellisservicesgroup3@outlook.com', '140 St Georges Terrace, Perth WA 6000'];
const forbidden = /candidate|to be confirmed|local demo|placeholder|AI-generated|24\s*\/\s*7|fully insured|licensed|guaranteed/iu;

test('focused information architecture publishes one primary roof-repair destination per confirmed intent', () => {
  const headings = {
    '': 'ROOF REPAIRS PERTH.', services: 'ROOF REPAIR SERVICES PERTH.', 'roof-repairs': 'ROOF REPAIRS PERTH.',
    'roof-leak-repairs': 'ROOF LEAK REPAIRS PERTH.', 'tile-roof-repairs': 'TILE ROOF REPAIRS PERTH.',
    'metal-roof-repairs': 'METAL ROOF REPAIRS PERTH.', 'ridge-capping-repointing': 'RIDGE CAPPING REPAIRS PERTH.',
    'flashing-repairs': 'ROOF VALLEYS & FLASHING REPAIRS PERTH.', 'roof-inspection': 'ROOF INSPECTION & MAINTENANCE PERTH.',
    'gutter-repairs': 'GUTTER REPAIRS PERTH.', 'roof-maintenance': 'ROOF MAINTENANCE PERTH.'
  };
  for (const route of publishedRoutes) {
    const html = readFileSync(fileFor(route), 'utf8');
    assert.equal((html.match(/<h1[\s>]/gi) ?? []).length, 1, `${route || '/'} needs one H1`);
    assert.match(html, /<meta name="description" content=".{80,160}">/i, `${route || '/'} needs concise metadata`);
    assert.match(html, /<link rel="canonical" href="https:\/\/www\.perthroofcare\.com\.au\//i, `${route || '/'} needs canonical`);
    for (const fact of contactFacts) assert.match(html, new RegExp(fact), `${route || '/'} needs confirmed contact data`);
    assert.doesNotMatch(html, forbidden, `${route || '/'} must not publish unconfirmed commercial claims`);
  }
  for (const [route, heading] of Object.entries(headings)) assert.match(readFileSync(fileFor(route), 'utf8'), new RegExp(`<h1>${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/h1>`));
});

test('services navigation is viewport-contained, concise and has no projects hub', () => {
  const home = readFileSync(fileFor(''), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8'); const script = readFileSync(join(root, 'site.js'), 'utf8');
  assert.doesNotMatch(home, /<a href="\/projects\/">Projects<\/a>/i);
  assert.match(home, /id="services-submenu"[^>]*role="region"[^>]*aria-label="Services"/i);
  assert.match(home, /Choose one clear service topic rather than browsing a long list\./i);
  for (const label of ['Core roof repairs', 'Roofline details', 'Roof Repairs Perth', 'Roof Valleys &amp; Flashing Repairs', 'Gutter Repairs Perth', 'Roof Maintenance Perth']) assert.match(home, new RegExp(label));
  assert.match(css, /\.services-submenu\{[^}]*overflow:auto[^}]*max-height:calc\(100vh - 7rem\)/i);
  assert.match(script, /const menuWidth = Math\.min\(896, Math\.max\(280, window\.innerWidth - sideGap \* 2\)\)/);
  assert.match(script, /window\.innerWidth - menuWidth - sideGap/);
});

test('homepage carries the Roof Repairs Perth theme, focused paths and real work evidence', () => {
  const home = readFileSync(fileFor(''), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8');
  assert.match(home, /<h1>ROOF REPAIRS PERTH\.<\/h1>/);
  assert.match(home, /ROOF REPAIRS PERTH — START WITH THE PROBLEM YOU CAN SEE\./);
  assert.equal((home.match(/class="card"/g) ?? []).length, 9, 'home uses six service and three enquiry cards only');
  for (const href of ['/roof-leak-repairs/', '/tile-roof-repairs/', '/metal-roof-repairs/', '/ridge-capping-repointing/', '/flashing-repairs/', '/roof-inspection/', '/projects/metal-roof-fastener-repair-sequence/', '/service-areas/', '/contact/']) assert.match(home, new RegExp(`href="${href}"`));
  assert.match(home, /REAL FASTENER WORK RECORD/i);
  assert.doesNotMatch(home, /hero-carousel|fixed-roofline-story|atlas-index|office-location/i);
  assert.match(home, /class="home-topic-rail home-hero-backdrop"/);
  assert.match(css, /\.home-topic-rail\.home-hero-backdrop\{[^}]*hero-australian-roofer-v2\.png[^}]*fixed/i);
  assert.match(css, /\.home-topic-rail\.home-hero-backdrop::before\{[^}]*linear-gradient/i);
});

test('every core service page is keyword-led, substantial, practical and internally connected', () => {
  for (const route of coreRoutes) {
    const html = readFileSync(fileFor(route), 'utf8');
    assert.match(html, /SERVICE FOCUS/i); assert.match(html, /USEFUL ENQUIRY NOTES/i); assert.match(html, /SERVICE DISCUSSION/i); assert.match(html, /COMMON QUESTIONS/i); assert.match(html, /RELATED SERVICES/i);
    assert.equal((html.match(/<details>/g) ?? []).length, 5, `${route} needs five focused questions`);
    assert.match(html, /PROPERTY CONTEXT/i, `${route} needs a substantial property-context section`);
    assert.match(html, /<nav aria-label="Related roof repair services">[\s\S]*?<a /, `${route} needs related links`);
    assert.doesNotMatch(html, /FIELD GUIDE \/ PRACTICAL CONTEXT|service-route-detail/i);
  }
});

test('documented projects appear in their relevant services rather than a disconnected hub', () => {
  assert.match(readFileSync(fileFor('roof-leak-repairs'), 'utf8'), /href="\/projects\/roleystone-metal-roof-fastener-leak-repair\/"/);
  assert.match(readFileSync(fileFor('tile-roof-repairs'), 'utf8'), /href="\/projects\/wa-6121-tile-roof-valley-gutter-cleaning\/"/);
  assert.match(readFileSync(fileFor('metal-roof-repairs'), 'utf8'), /href="\/projects\/metal-roof-fastener-repair-sequence\/"/);
  assert.ok(!existsSync(join(root, 'projects', 'index.html')), 'there must be no published projects index');
});

test('roof leak repairs presents the supplied six-image case record in a complete grid', () => {
  const html = readFileSync(fileFor('roof-leak-repairs'), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8');
  const images = ['roof-leak-case-01-overall.png', 'roof-leak-case-02-roof-context.png', 'roof-leak-case-03-junction-detail.png', 'roof-leak-case-04-interior-mark.png', 'roof-leak-case-05-work-in-progress.png', 'roof-leak-case-06-completed.png'];
  assert.match(html, new RegExp('REAL CASE RECORD / LOCATION NOT PUBLISHED', 'i'));
  assert.equal((html.match(/class="roof-leak-evidence-item"/g) ?? []).length, 6, 'six supplied photos must form one complete gallery');
  for (const image of images) assert.match(html, new RegExp(`/assets/images/${image}`));
  assert.match(css, /\.roof-leak-evidence-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/i);
});

test('tile roof repairs presents the supplied six-image case record in a complete grid', () => {
  const html = readFileSync(fileFor('tile-roof-repairs'), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8');
  const images = ['tile-roof-case-01-overall.png', 'tile-roof-case-02-damaged-tiles.png', 'tile-roof-case-03-valley-gutter.png', 'tile-roof-case-04-ridge-detail.png', 'tile-roof-case-05-work-in-progress.png', 'tile-roof-case-06-completed.png'];
  assert.match(html, new RegExp('REAL CASE RECORD / LOCATION NOT PUBLISHED', 'i'));
  assert.equal((html.match(/class="tile-roof-evidence-item"/g) ?? []).length, 6, 'six supplied photos must form one complete gallery');
  for (const image of images) assert.match(html, new RegExp(`/assets/images/${image}`));
  assert.match(css, /\.tile-roof-evidence-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/i);
});

test('ridge capping repairs presents the supplied six-image case record in title order', () => {
  const html = readFileSync(fileFor('ridge-capping-repointing'), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8');
  const images = ['ridge-case-01-overview-before.png', 'ridge-case-02-damaged-closeup.png', 'ridge-case-03-bedding-detail.png', 'ridge-case-04-interior-water-stain.png', 'ridge-case-05-repair-in-progress.png', 'ridge-case-06-overview-after.png'];
  assert.match(html, new RegExp('REAL CASE RECORD / LOCATION NOT PUBLISHED', 'i'));
  assert.equal((html.match(/class="ridge-evidence-item"/g) ?? []).length, 6, 'six supplied photos must form one complete gallery');
  for (const image of images) assert.match(html, new RegExp(`/assets/images/${image}`));
  assert.match(css, /\.ridge-evidence-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/i);
});

test('roof valleys and flashing repairs presents the supplied six-image case record in title order', () => {
  const html = readFileSync(fileFor('flashing-repairs'), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8');
  const images = ['valley-flashing-case-01-overall.png', 'valley-flashing-case-02-valley-closeup.png', 'valley-flashing-case-03-chimney-flashing.png', 'valley-flashing-case-04-roofline-detail.png', 'valley-flashing-case-05-work-record.png', 'valley-flashing-case-06-after-record.png'];
  assert.match(html, new RegExp('REAL CASE RECORD / LOCATION NOT PUBLISHED', 'i'));
  assert.equal((html.match(/class="valley-flashing-evidence-item"/g) ?? []).length, 6, 'six supplied photos must form one complete gallery');
  for (const image of images) assert.match(html, new RegExp(`/assets/images/${image}`));
  assert.match(css, /\.valley-flashing-evidence-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/i);
});

test('gutter repairs presents the supplied six-image case record in title order', () => {
  const html = readFileSync(fileFor('gutter-repairs'), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8');
  const images = ['gutter-case-01-overall.png', 'gutter-case-02-problem-closeup.png', 'gutter-case-03-connection-detail.png', 'gutter-case-04-downpipe-detail.png', 'gutter-case-05-work-in-progress.png', 'gutter-case-06-completed.png'];
  assert.match(html, new RegExp('REAL CASE RECORD / LOCATION NOT PUBLISHED', 'i'));
  assert.equal((html.match(/class="gutter-evidence-item"/g) ?? []).length, 6, 'six supplied photos must form one complete gallery');
  for (const image of images) assert.match(html, new RegExp(`/assets/images/${image}`));
  assert.match(css, /\.gutter-evidence-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/i);
});

test('privacy is compact, useful and directly contactable', () => {
  const html = readFileSync(fileFor('privacy'), 'utf8');
  assert.match(html, /<h1>PRIVACY FOR ROOF REPAIR ENQUIRIES\.<\/h1>/); assert.match(html, /Information you choose to send/i); assert.match(html, /How enquiry information is used/i); assert.match(html, /Questions about privacy/i); assert.match(html, /href="\/legal\/"/); assert.doesNotMatch(html, /class="hero inner"/i);
});

test('legal information is useful, bounded and linked to the relevant roof-repair paths', () => {
  const html = readFileSync(fileFor('legal'), 'utf8');
  assert.match(html, /<h1>ROOF REPAIR WEBSITE INFORMATION\.<\/h1>/); assert.match(html, /not a property-specific diagnosis, quote or repair specification/i); assert.match(html, /Images and documented projects/i);
  for (const href of ['/services/', '/news/', '/privacy/', '/contact/']) assert.match(html, new RegExp(`href="${href}"`));
  assert.doesNotMatch(html, /class="hero inner"/i);
});

test('homepage keeps confirmed structured data and favicon declarations', () => {
  const home = readFileSync(fileFor(''), 'utf8'); const json = home.match(/<script type="application\/ld\+json">(.*?)<\/script>/i)?.[1]; assert.ok(json);
  const organization = JSON.parse(json); assert.equal(organization.name, 'Ellis Services Group'); assert.equal(organization.foundingDate, '2020-11-11'); assert.equal(organization.telephone, '0405878406');
  assert.match(home, /rel="icon" type="image\/png" sizes="512x512" href="\/favicon\.png"/); assert.match(home, /rel="apple-touch-icon" sizes="512x512" href="\/favicon\.png"/);
});

test('contact form and enquiry endpoint remain safely configured', async (t) => {
  const html = readFileSync(fileFor('contact'), 'utf8'); assert.match(html, /<form[^>]*action="\/api\/enquiry"[^>]*novalidate/i); assert.match(html, /type="checkbox"[^>]*required/i); assert.match(html, /aria-live="polite"/i);
  const port = 4799; const child = spawn(process.execPath, ['local-server.mjs'], { cwd: root, env: { ...process.env, PORT: String(port), RESEND_API_KEY: '', RESEND_FROM: '' }, stdio: 'ignore' }); t.after(() => child.kill());
  let response; for (let attempt = 0; attempt < 20; attempt += 1) { try { response = await fetch(`http://127.0.0.1:${port}/api/enquiry`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Ada', phone: '0400000000', email: 'ada@example.com', enquiry: 'Please contact me.', privacy: true }) }); break; } catch { await new Promise((resolve) => setTimeout(resolve, 100)); } }
  assert.equal(response?.status, 503); assert.deepEqual(await response.json(), { error: 'Enquiry email is not configured.' });
});

test('the local server and Vercel build publish the focused routes and assets', async (t) => {
  const port = 4801; const child = spawn(process.execPath, ['local-server.mjs'], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' }); t.after(() => child.kill());
  let response; for (let attempt = 0; attempt < 20; attempt += 1) { try { response = await fetch(`http://127.0.0.1:${port}/metal-roof-repairs/`); break; } catch { await new Promise((resolve) => setTimeout(resolve, 100)); } }
  assert.equal(response?.status, 200); assert.match(await response.text(), /METAL ROOF REPAIRS PERTH/);
  assert.ok(existsSync(join(root, 'public', 'roof-leak-repairs', 'index.html'))); assert.ok(existsSync(join(root, 'public', 'assets', 'css', 'site.css'))); assert.ok(existsSync(join(root, 'public', 'favicon.png')));
});

test('documented project pages preserve privacy and supplied evidence', () => {
  const roleystone = readFileSync(fileFor('projects/roleystone-metal-roof-fastener-leak-repair'), 'utf8'); const sequence = readFileSync(fileFor('projects/metal-roof-fastener-repair-sequence'), 'utf8'); const wa6121 = readFileSync(fileFor('projects/wa-6121-tile-roof-valley-gutter-cleaning'), 'utf8');
  assert.doesNotMatch(roleystone, /Heath Road|160-154/i); assert.match(roleystone, /structural adhesive/i); assert.match(sequence, /DOCUMENTED PROJECT \/ LOCATION NOT PUBLISHED/); assert.match(sequence, /metal-fastener-sequence-05-completed\.png/); assert.match(wa6121, /Western Australia 6121, Australia/); assert.match(wa6121, /valley gutter cleaning/i);
});

test('keyword-led news articles publish useful English guidance, schema and an RSS feed', () => {
  const articles = [
    'roof-leak-detection-perth', 'tile-roof-repairs-perth-guide', 'metal-roof-repairs-perth-guide',
    'ridge-capping-repairs-perth-guide', 'roof-valleys-flashing-repairs-perth', 'roof-inspection-perth-guide'
  ];
  const feed = readFileSync(join(root, 'news', 'feed.xml'), 'utf8');
  assert.match(feed, /<rss version="2\.0">/); assert.match(feed, /Roof Repairs Perth News/i);
  for (const slug of articles) {
    const html = readFileSync(fileFor(`news/${slug}`), 'utf8');
    assert.equal((html.match(/<h1[\s>]/gi) ?? []).length, 1, `${slug} needs one H1`);
    assert.match(html, /<script type="application\/ld\+json">[\s\S]*?"@type":"Article"/i, `${slug} needs Article JSON-LD`);
    assert.match(html, /Ellis Services Group|0405 878 406/i, `${slug} needs editorial accountability or contact details`);
    assert.match(html, /href="\/(?:roof-repairs|roof-leak-repairs|tile-roof-repairs|metal-roof-repairs|ridge-capping-repointing|flashing-repairs|roof-inspection)\//i, `${slug} needs a related service link`);
    assert.match(feed, new RegExp(`/news/${slug}/`), `${slug} needs an RSS item`);
    assert.match(html, /strong Google review feedback/i, `${slug} should present the confirmed Google-review signal`);
    assert.match(html, /high level of repeat customer enquiries/i, `${slug} should present the confirmed returning-customer signal`);
  }
  assert.match(readFileSync(fileFor('news'), 'utf8'), /Roof Leak Detection Perth/i);
  assert.match(readFileSync(fileFor('news'), 'utf8'), /rel="alternate" type="application\/rss\+xml" href="\/news\/feed\.xml"/i);
});
