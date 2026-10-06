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
const popularAreaRoutes = {
  'areas/cottesloe-roof-repairs': 'COTTESLOE ROOF REPAIRS.',
  'areas/mosman-park-roof-repairs': 'MOSMAN PARK ROOF REPAIRS.',
  'areas/city-beach-roof-repairs': 'CITY BEACH ROOF REPAIRS.',
  'areas/scarborough-roof-repairs': 'SCARBOROUGH ROOF REPAIRS.',
  'areas/claremont-roof-repairs': 'CLAREMONT ROOF REPAIRS.',
  'areas/nedlands-roof-repairs': 'NEDLANDS ROOF REPAIRS.',
  'areas/subiaco-roof-repairs': 'SUBIACO ROOF REPAIRS.',
  'areas/perth-roof-repairs': 'PERTH ROOF REPAIRS.',
  'areas/leederville-roof-repairs': 'LEEDERVILLE ROOF REPAIRS.',
  'areas/joondalup-roof-repairs': 'JOONDALUP ROOF REPAIRS.',
  'areas/hillarys-roof-repairs': 'HILLARYS ROOF REPAIRS.',
  'areas/fremantle-roof-repairs': 'FREMANTLE ROOF REPAIRS.',
  'areas/rockingham-roof-repairs': 'ROCKINGHAM ROOF REPAIRS.',
  'areas/kalamunda-roof-repairs': 'KALAMUNDA ROOF REPAIRS.',
  'areas/victoria-park-roof-repairs': 'VICTORIA PARK ROOF REPAIRS.',
  'areas/bayswater-roof-repairs': 'BAYSWATER ROOF REPAIRS.'
};

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
  assert.equal((home.match(/class="card"/g) ?? []).length, 10, 'home uses seven service and three enquiry cards only');
  for (const href of ['/roof-leak-repairs/', '/tile-roof-repairs/', '/metal-roof-repairs/', '/ridge-capping-repointing/', '/flashing-repairs/', '/gutters-downpipes/', '/roof-inspection/', '/projects/metal-roof-fastener-repair-sequence/', '/service-areas/', '/contact/']) assert.match(home, new RegExp(`href="${href}"`));
  assert.match(home, /REAL FASTENER WORK RECORD/i);
  assert.doesNotMatch(home, /hero-carousel|fixed-roofline-story|atlas-index|office-location/i);
  assert.match(home, /class="home-topic-rail home-hero-backdrop"/);
  assert.match(css, /\.home-topic-rail\.home-hero-backdrop\{[^}]*hero-australian-roofer-v2\.png[^}]*fixed/i);
  assert.match(css, /\.home-topic-rail\.home-hero-backdrop::before\{[^}]*linear-gradient/i);
});

test('priority owner pages use distinct service roles with crawlable supporting links', () => {
  const expected = {
    'roof-repairs': ['ROOF REPAIRS PERTH.', 'WHAT WE ASSESS FOR ROOF REPAIRS PERTH.', ['/roof-leak-repairs/', '/flashing-repairs/', '/gutters-downpipes/']],
    'roof-leak-repairs': ['ROOF LEAK REPAIRS PERTH.', 'WHAT WE ASSESS FOR ROOF LEAK REPAIRS PERTH.', ['/roof-repairs/', '/flashing-repairs/', '/projects/roleystone-metal-roof-fastener-leak-repair/']],
    'flashing-repairs': ['ROOF VALLEYS & FLASHING REPAIRS PERTH.', 'WHAT WE ASSESS FOR ROOF VALLEY & FLASHING REPAIRS PERTH.', ['/roof-leak-repairs/', '/news/roof-flashing-explained/']],
    'gutters-downpipes': ['GUTTERS & DOWNPIPES PERTH.', 'GUTTERS & DOWNPIPES PERTH — ROOF-EDGE DRAINAGE AS ONE SYSTEM.', ['/gutter-repairs/', '/downpipe-repairs/', '/projects/wa-6121-tile-roof-valley-gutter-cleaning/']],
    'downpipe-repairs': ['DOWNPIPE REPAIRS PERTH.', 'DOWNPIPE REPAIRS PERTH — THE VERTICAL PART OF THE ROOF DRAINAGE ROUTE.', ['/gutters-downpipes/', '/gutter-repairs/']]
  };
  for (const [route, [h1, section, links]] of Object.entries(expected)) {
    const html = readFileSync(fileFor(route), 'utf8');
    assert.match(html, new RegExp(`<h1>${h1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/h1>`));
    assert.match(html, new RegExp(section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    for (const href of links) assert.match(html, new RegExp(`href="${href}"`), `${route} needs ${href}`);
    assert.match(html, /<link rel="canonical" href="https:\/\/www\.perthroofcare\.com\.au\//i);
    assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+noindex/i);
  }
});

test('roof flashing guide stays informational and links naturally to flashing repairs', () => {
  const article = readFileSync(fileFor('news/roof-flashing-explained'), 'utf8');
  assert.match(article, /WHAT ROOF FLASHING DOES AT A JUNCTION/i);
  assert.match(article, /WHEN A FLASHING DETAIL NEEDS A PROFESSIONAL REPAIR DISCUSSION/i);
  assert.match(article, /href="\/flashing-repairs\/"/i);
  assert.match(article, /href="\/roof-leak-repairs\/"/i);
  assert.doesNotMatch(article, /24\s*\/\s*7|guaranteed|same-day/i);
});

test('gutter and downpipe pages distinguish their own service questions', () => {
  const gutters = readFileSync(fileFor('gutters-downpipes'), 'utf8');
  const downpipes = readFileSync(fileFor('downpipe-repairs'), 'utf8');
  assert.match(gutters, /Gutters collect roof water; downpipes carry it from the outlet toward the ground-level connection/i);
  assert.match(downpipes, /brackets, pipe sections, joints, bends and the (?:lower visible connection|connection below the gutter outlet)/i);
  assert.match(downpipes, /does not represent underground stormwater work/i);
  assert.notEqual(gutters.match(/<main[\s\S]*<\/main>/)?.[0], downpipes.match(/<main[\s\S]*<\/main>/)?.[0]);
});

test('service areas provide six rounded regional entry points, specific local repair pages and the real enquiry form', () => {
  const areas = readFileSync(fileFor('service-areas'), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8'); const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  assert.match(areas, /POPULAR PERTH ROOF REPAIR SEARCHES/i);
  assert.equal((areas.match(/class="card area-region-card"/g) ?? []).length, 6, 'six regional cards must leave no empty grid tile');
  assert.match(areas, /WESTERN COASTAL ROOF SERVICES/i);
  assert.match(areas, /WESTERN INNER ROOF SERVICES/i);
  assert.match(areas, /Cottesloe Roof Repairs/i);
  assert.match(css, /\.area-directory \.cards[^}]*gap:1rem/i);
  assert.match(css, /\.area-directory \.card[^}]*border-radius:/i);
  assert.match(areas, /class="enquiry-form" action="\/api\/enquiry"/i, 'service areas must end with the working contact form');
  for (const [route, heading] of Object.entries(popularAreaRoutes)) {
    assert.match(areas, new RegExp(`href="/${route}/"`), `service areas must link to ${route}`);
    assert.ok(existsSync(fileFor(route)), `${route} needs a crawlable local service page`);
    assert.match(sitemap, new RegExp(`/${route}/`), `${route} needs a sitemap entry`);
    const html = readFileSync(fileFor(route), 'utf8');
    assert.match(html, new RegExp(`<h1>${heading}<\\/h1>`));
    for (const href of ['/roof-repairs/', '/roof-leak-repairs/', '/tile-roof-repairs/', '/gutter-repairs/']) assert.match(html, new RegExp(`href="${href}"`));
    assert.match(html, /class="enquiry-form" action="\/api\/enquiry"/i, `${route} must keep the working contact form`);
  }
});

test('service pages present Ellis as a roof-repair provider and local pages add distinct area value', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  const about = readFileSync(fileFor('about'), 'utf8');
  const storm = readFileSync(fileFor('storm-damage-roof-repairs'), 'utf8');
  const cottesloe = readFileSync(fileFor('areas/cottesloe-roof-repairs'), 'utf8');
  const kalamunda = readFileSync(fileFor('areas/kalamunda-roof-repairs'), 'utf8');

  assert.match(home, /PERTH ROOF CARE IS OPERATED BY ELLIS SERVICES GROUP PTY LTD/i);
  assert.match(about, /Perth Roof Care is operated by Ellis Services Group Pty Ltd\./i);
  assert.match(storm, /Urgent storm-related roof repair enquiries are prioritised\. Attendance is arranged promptly when weather, site access and safety conditions allow\./i);

  for (const route of ['', 'services', 'roof-repairs', 'roof-leak-repairs', 'tile-roof-repairs', 'metal-roof-repairs', 'storm-damage-roof-repairs']) {
    const html = readFileSync(fileFor(route), 'utf8');
    assert.doesNotMatch(html, /reading room|clear enquiry|not a diagnosis/i, `${route || 'home'} must not use passive information-site wording`);
  }

  assert.match(cottesloe, /COASTAL ROOF REPAIR PRIORITIES/i);
  assert.match(kalamunda, /HILLS PROPERTY ROOF REPAIR PRIORITIES/i);
  assert.notEqual(cottesloe.match(/<main[\s\S]*<\/main>/)?.[0], kalamunda.match(/<main[\s\S]*<\/main>/)?.[0]);
  assert.match(cottesloe, /Roof leak repairs Perth/i);
  assert.match(kalamunda, /Gutter repairs Perth/i);
});

test('sitemap lists each canonical service URL once and news indexes the flashing guide', () => {
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  const news = readFileSync(fileFor('news'), 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, location]) => location);
  const required = [
    'https://www.perthroofcare.com.au/',
    'https://www.perthroofcare.com.au/roof-leak-repairs/',
    'https://www.perthroofcare.com.au/flashing-repairs/',
    'https://www.perthroofcare.com.au/news/roof-flashing-explained/'
  ];
  for (const location of required) {
    assert.ok(locations.includes(location), `sitemap needs ${location}`);
    assert.equal(locations.filter((entry) => entry === location).length, 1, `sitemap must list ${location} once`);
  }
  assert.match(news, /href="\/news\/roof-flashing-explained\/"/i, 'news index needs a direct link to the flashing guide');
});

test('sitemap audit utility classifies every generated canonical URL without treating it as index status', async () => {
  const { auditLocalSitemap } = await import('./scripts/audit-sitemap.mjs');
  const rows = auditLocalSitemap(root);
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, location]) => location);
  assert.equal(rows.length, locations.length);
  assert.equal(new Set(rows.map((row) => row.url)).size, locations.length);
  for (const row of rows) {
    assert.equal(row.sitemap_member, 'yes');
    assert.equal(row.local_http_status, '200');
    assert.equal(row.canonical_matches_url, 'yes');
    assert.equal(row.indexability, 'indexable');
    assert.equal(row.gsc_status, 'unknown');
  }
});

test('sitemap audit utility reads canonical, robots and X-Robots-Tag from an HTTP document separately', async () => {
  const { inspectHttpDocument } = await import('./scripts/audit-sitemap.mjs');
  assert.deepEqual(
    inspectHttpDocument('<link rel="canonical" href="https://www.perthroofcare.com.au/roof-repairs/"><meta name="robots" content="index,follow">', 'index, follow'),
    { live_canonical: 'https://www.perthroofcare.com.au/roof-repairs/', live_meta_robots: 'index,follow', live_x_robots_tag: 'index, follow' }
  );
});

test('local area enquiry panels keep their copy readable without a full-height blank side column', () => {
  const html = readFileSync(fileFor('areas/cottesloe-roof-repairs'), 'utf8');
  assert.match(html, /\.area-enquiry\{background:var\(--sky-wash\)!important;color:var\(--coastal-ink\)!important\}/i);
  assert.match(html, /\.area-enquiry \.contact-layout>div:first-child\{[^}]*border-radius:[^}]*background:var\(--coastal-ink\)/i);
});

test('local area service links remain in normal flow on mobile', () => {
  const html = readFileSync(fileFor('areas/cottesloe-roof-repairs'), 'utf8');
  assert.match(html, /@media\(max-width:900px\)\{\.area-service-links\{position:static!important/i);
});

test('every core service page publishes professional keyword-led scope and assessment content', () => {
  const heroImages = {
    'roof-repairs': 'roof-repairs-case-05-roof-overview.jpg',
    'roof-leak-repairs': 'roof-leak-case-01-overall.png',
    'tile-roof-repairs': 'tile-roof-case-01-overall.png',
    'metal-roof-repairs': 'metal-roof-case-06-overview-after.png',
    'ridge-capping-repointing': 'ridge-case-01-overview-before.png',
    'flashing-repairs': 'valley-flashing-case-01-overall.png',
    'gutter-repairs': 'gutter-case-01-overall.png',
    'roof-inspection': 'roof-inspection-case-01-overview.png',
    'roof-maintenance': 'roof-maintenance-case-04-ridge-junction.jpg'
  };
  for (const route of coreRoutes) {
    const html = readFileSync(fileFor(route), 'utf8');
    const css = readFileSync(join(root, 'site.css'), 'utf8');
    assert.ok(html.includes(`<section class="topic-rail service-hero" style="--service-hero-image:url('/assets/images/${heroImages[route]}')">`), `${route} needs its own documented-case title image`);
    assert.match(css, /\.topic-rail\.service-hero\{[^}]*background-image:var\(--service-hero-image\)/i, `${route} needs the shared title treatment to use its selected case image`);
    assert.match(css, /\.topic-rail\.service-hero::before\{[^}]*linear-gradient/i, `${route} needs a readable dark image overlay`);
    assert.match(html, /class="[^"]*\bfocus-professional\b[^"]*"/i, `${route} needs a professional service-scope section`);
    assert.match(html, /class="[^"]*\bfocus-assessment\b[^"]*"/i, `${route} needs a service-specific assessment section`);
    assert.match(html, /class="[^"]*\bfocus-preparation\b[^"]*"/i, `${route} needs safe enquiry preparation`);
    assert.equal((html.match(/class="card assessment-card"/g) ?? []).length, 3, `${route} needs three service-specific assessment cards`);
    assert.doesNotMatch(html, /SERVICES WE DISCUSS|THE DETAILS WE CAN DISCUSS/i, `${route} must not retain generic service headings`);
    assert.match(html, /<nav aria-label="Related roof repair services">[\s\S]*?<a /, `${route} needs crawlable related links`);
    const linkSection = html.match(/<section class="section focus-links">[\s\S]*?<\/section>/)?.[0] ?? '';
    assert.ok((linkSection.match(/<a href="\//g) ?? []).length >= 3, `${route} needs at least three contextual internal links`);
    assert.equal((html.match(/<details>/g) ?? []).length, 3, `${route} needs three service-specific FAQs`);
    assert.doesNotMatch(html, /SERVICE DISCUSSION|PROPERTY CONTEXT|COMMON QUESTIONS|FIELD GUIDE \/ PRACTICAL CONTEXT/i, `${route} must not retain generic filler sections`);
    assert.match(html, /case-evidence[\s\S]*?<section class="section focus-links">/i, `${route} must place the documented case before related links`);
  }
});

test('storm damage repairs uses the same professional service structure with safe response conditions', () => {
  const html = readFileSync(fileFor('storm-damage-roof-repairs'), 'utf8');
  assert.match(html, /<h1>STORM DAMAGE ROOF REPAIRS PERTH\.<\/h1>/);
  assert.match(html, /class="[^"]*\bfocus-professional\b[^"]*"/i);
  assert.match(html, /class="[^"]*\bfocus-assessment\b[^"]*"/i);
  assert.match(html, /class="[^"]*\bfocus-preparation\b[^"]*"/i);
  assert.equal((html.match(/class="card assessment-card"/g) ?? []).length, 3);
  assert.match(html, /weather, site access and safety conditions allow/i);
  assert.doesNotMatch(html, /24-hour or unconditional attendance/i);
  assert.doesNotMatch(html, /SERVICES WE DISCUSS|THE DETAILS WE CAN DISCUSS/i);
});

test('service metadata mirrors visible service content and publishes RSS discovery', () => {
  for (const route of [...coreRoutes, 'storm-damage-roof-repairs']) {
    const html = readFileSync(fileFor(route), 'utf8');
    const graphs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]))
      .filter((entry) => Array.isArray(entry['@graph']));
    assert.equal(graphs.length, 1, `${route} needs one service metadata graph`);
    const entries = graphs[0]['@graph'];
    const webPage = entries.find((entry) => entry['@type'] === 'WebPage');
    const service = entries.find((entry) => entry['@type'] === 'Service');
    const breadcrumb = entries.find((entry) => entry['@type'] === 'BreadcrumbList');
    const faq = entries.find((entry) => entry['@type'] === 'FAQPage');
    const h1 = html.match(/<h1>([^<]+)<\/h1>/)?.[1];
    assert.ok(webPage && service && breadcrumb && faq, `${route} needs WebPage, Service, FAQPage and BreadcrumbList metadata`);
    assert.equal(service.name, h1?.replace(/\.$/, ''), `${route} service metadata must use the visible H1`);
    assert.equal(faq.mainEntity.length, 3, `${route} needs three visible FAQ entries in metadata`);
    assert.equal(service.url, `https://www.perthroofcare.com.au/${route}/`);
    assert.equal(service.provider['@id'], 'https://www.perthroofcare.com.au/#business');
    assert.match(html, /rel="alternate" type="application\/rss\+xml" href="\/news\/feed\.xml"/i, `${route} needs RSS discovery`);
  }
  const news = readFileSync(fileFor('news'), 'utf8');
  const feed = readFileSync(join(root, 'news', 'feed.xml'), 'utf8');
  assert.match(news, /rel="alternate" type="application\/rss\+xml" href="\/news\/feed\.xml"/i);
  assert.match(news, /Roof repair guides RSS/i);
  assert.match(feed, /<rss version="2\.0">/);
});

test('homepage identity graph and llms guide contain only visible, supportable facts', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  const graphs = [...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const identity = graphs.find((entry) => Array.isArray(entry['@graph']));
  assert.ok(identity, 'homepage needs an identity graph');
  const business = identity['@graph'].find((entry) => entry['@type'] === 'LocalBusiness');
  const website = identity['@graph'].find((entry) => entry['@type'] === 'WebSite');
  assert.equal(business.name, 'Ellis Services Group');
  assert.equal(business.alternateName, 'Perth Roof Care');
  assert.equal(website.url, 'https://www.perthroofcare.com.au');
  assert.equal('foundingDate' in business, false, 'do not publish an unverified founding date');
  const llms = readFileSync(join(root, 'llms.txt'), 'utf8');
  assert.match(llms, /^# Ellis Services Group/m);
  assert.match(llms, /Perth Roof Care is operated by Ellis Services Group Pty Ltd\./);
  assert.match(llms, /https:\/\/www\.perthroofcare\.com\.au\/roof-repairs\//);
  assert.match(llms, /No price, licence, insurance, warranty or rating claim is made here\./);
  assert.match(llms, /Urgent storm-related roof repair enquiries are prioritised; attendance is arranged promptly when weather, site access and safety conditions allow\./);
});

test('documented case records appear directly in their relevant services rather than a disconnected hub', () => {
  assert.match(readFileSync(fileFor('roof-leak-repairs'), 'utf8'), /class="section roof-leak-case-evidence"/);
  assert.match(readFileSync(fileFor('tile-roof-repairs'), 'utf8'), /class="section tile-roof-case-evidence"/);
  assert.match(readFileSync(fileFor('metal-roof-repairs'), 'utf8'), /class="section metal-roof-case-evidence"/);
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

test('metal roof repairs presents the supplied six-image case record in title order', () => {
  const html = readFileSync(fileFor('metal-roof-repairs'), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8');
  const images = ['metal-roof-case-01-overview-before.png', 'metal-roof-case-02-fastener-sheet-detail.png', 'metal-roof-case-03-penetration-detail.png', 'metal-roof-case-04-roof-edge-detail.png', 'metal-roof-case-05-repair-in-progress.png', 'metal-roof-case-06-overview-after.png'];
  assert.match(html, new RegExp('REAL CASE RECORD / LOCATION NOT PUBLISHED', 'i'));
  assert.equal((html.match(/class="metal-roof-evidence-item"/g) ?? []).length, 6, 'six supplied photos must form one complete gallery');
  for (const image of images) assert.match(html, new RegExp(`/assets/images/${image}`));
  assert.match(css, /\.metal-roof-evidence-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/i);
});

test('roof inspection presents the supplied six-image maintenance record in title order', () => {
  const html = readFileSync(fileFor('roof-inspection'), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8');
  const images = ['roof-inspection-case-01-overview.png', 'roof-inspection-case-02-ridge-detail.png', 'roof-inspection-case-03-flashing-detail.png', 'roof-inspection-case-04-maintenance-point.png', 'roof-inspection-case-05-maintenance-in-progress.png', 'roof-inspection-case-06-overview-after.png'];
  assert.match(html, new RegExp('REAL CASE RECORD / LOCATION NOT PUBLISHED', 'i'));
  assert.equal((html.match(/class="roof-inspection-evidence-item"/g) ?? []).length, 6, 'six supplied photos must form one complete gallery');
  for (const image of images) assert.match(html, new RegExp(`/assets/images/${image}`));
  assert.match(css, /\.roof-inspection-evidence-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/i);
});

test('roof maintenance presents the supplied six-image tile-detail record in title order', () => {
  const html = readFileSync(fileFor('roof-maintenance'), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8');
  const images = ['roof-maintenance-case-01-tile-edge.jpg', 'roof-maintenance-case-02-cracked-tile.jpg', 'roof-maintenance-case-03-broken-tile-detail.jpg', 'roof-maintenance-case-04-ridge-junction.jpg', 'roof-maintenance-case-05-valley-edge.jpg', 'roof-maintenance-case-06-local-seal-record.jpg'];
  assert.match(html, new RegExp('REAL CASE RECORD / LOCATION NOT PUBLISHED', 'i'));
  assert.equal((html.match(/class="roof-maintenance-evidence-item"/g) ?? []).length, 6, 'six supplied photos must form one complete gallery');
  for (const image of images) assert.match(html, new RegExp(`/assets/images/${image}`));
  assert.match(css, /\.roof-maintenance-evidence-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/i);
});

test('roof repairs presents the supplied six-image tile-repair record in title order', () => {
  const html = readFileSync(fileFor('roof-repairs'), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8');
  const images = ['roof-repairs-case-01-opened-tile-area.jpg', 'roof-repairs-case-02-ridge-repair-detail.jpg', 'roof-repairs-case-03-under-tile-detail.jpg', 'roof-repairs-case-04-flashing-detail.jpg', 'roof-repairs-case-05-roof-overview.jpg', 'roof-repairs-case-06-ridge-detail.jpg'];
  assert.match(html, new RegExp('REAL CASE RECORD / LOCATION NOT PUBLISHED', 'i'));
  assert.equal((html.match(/class="roof-repairs-evidence-item"/g) ?? []).length, 6, 'six supplied photos must form one complete gallery');
  for (const image of images) assert.match(html, new RegExp(`/assets/images/${image}`));
  assert.match(css, /\.roof-repairs-evidence-grid\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/i);
});

test('privacy is compact, useful and directly contactable', () => {
  const html = readFileSync(fileFor('privacy'), 'utf8');
  assert.match(html, /<h1>PRIVACY FOR ROOF REPAIR ENQUIRIES\.<\/h1>/); assert.match(html, /Information you choose to send/i); assert.match(html, /How enquiry information is used/i); assert.match(html, /Questions about privacy/i); assert.match(html, /href="\/legal\/"/); assert.doesNotMatch(html, /class="hero inner"/i);
});

test('legal information is useful, bounded and linked to the relevant roof-repair paths', () => {
  const html = readFileSync(fileFor('legal'), 'utf8');
  assert.match(html, /<h1>ROOF REPAIR WEBSITE INFORMATION\.<\/h1>/); assert.match(html, /final repair scope is confirmed from the property, access and roofline condition/i); assert.match(html, /Images and documented projects/i);
  for (const href of ['/services/', '/news/', '/privacy/', '/contact/']) assert.match(html, new RegExp(`href="${href}"`));
  assert.doesNotMatch(html, /class="hero inner"/i);
});

test('public copy uses direct service language and keeps machine-readable storm wording consistent', () => {
  const routes = ['', 'service-areas', 'roof-inspection', 'roof-restoration', 'repair-options', 'news', 'news/roof-flashing-explained', 'projects/roleystone-metal-roof-fastener-leak-repair'];
  const retiredPhrases = /website office|static local roof repair page|rather than repeating generic area copy|budget-aware|clear enquiry|not a remote diagnosis|not a property-specific diagnosis|not a diagnosis|emergency-response claim/i;
  for (const route of routes) assert.doesNotMatch(readFileSync(fileFor(route), 'utf8'), retiredPhrases, `${route || 'home'} retains retired wording`);
  const llms = readFileSync(join(root, 'llms.txt'), 'utf8');
  assert.doesNotMatch(llms, /website office|not a remote diagnosis|emergency-response claim/i);
  assert.match(llms, /Urgent storm-related roof repair enquiries are prioritised; attendance is arranged promptly when weather, site access and safety conditions allow\./i);
  assert.match(readFileSync(fileFor('news/roof-leak-detection-perth'), 'utf8'), /Perth office: 140 St Georges Terrace, Perth WA 6000/i);
});

test('homepage keeps confirmed structured data and favicon declarations', () => {
  const home = readFileSync(fileFor(''), 'utf8'); const json = home.match(/<script type="application\/ld\+json">(.*?)<\/script>/i)?.[1]; assert.ok(json);
  const identity = JSON.parse(json); const organization = identity['@graph'].find((entry) => entry['@type'] === 'LocalBusiness'); assert.equal(organization.name, 'Ellis Services Group'); assert.equal(organization.telephone, '0405878406');
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
    assert.match(html, /clear communication, practical roofline context and direct follow-up/i, `${slug} should present the service approach`);
  }
  assert.match(readFileSync(fileFor('news'), 'utf8'), /Roof Leak Detection Perth/i);
  assert.match(readFileSync(fileFor('news'), 'utf8'), /rel="alternate" type="application\/rss\+xml" href="\/news\/feed\.xml"/i);
});

test('storm damage repairs presents the supplied six-image urgent-response record with safety conditions', () => {
  const html = readFileSync(fileFor('storm-damage-roof-repairs'), 'utf8'); const css = readFileSync(join(root, 'site.css'), 'utf8');
  assert.ok(html.includes(`<section class="topic-rail service-hero" style="--service-hero-image:url('/assets/images/storm-damage-case-06-roof-void-inspection.jpg')">`), 'storm damage needs its own documented-case title image');
  const images = ['storm-damage-case-01-roof-void-overview.jpg', 'storm-damage-case-02-roof-void-opening.jpg', 'storm-damage-case-03-under-tile-detail.jpg', 'storm-damage-case-04-roof-void-junction.jpg', 'storm-damage-case-05-roof-void-work-record.jpg', 'storm-damage-case-06-roof-void-inspection.jpg'];
  assert.match(html, /URGENT ROOF-RESPONSE RECORD \/ LOCATION NOT PUBLISHED/i);
  assert.match(html, /Urgent storm-related roof repair enquiries are prioritised/i);
  assert.match(html, /weather, site access and safety conditions allow/i);
  assert.match(html, /class="[^"]*\bfocus-professional\b[^"]*"/i, 'storm damage needs the same professional service-content structure');
  assert.doesNotMatch(html, /SERVICES WE DISCUSS|THE DETAILS WE CAN DISCUSS/i, 'storm damage must not retain generic service headings');
  assert.doesNotMatch(html, /service-route-detail|FIELD GUIDE \/ PRACTICAL CONTEXT/i, 'storm damage must not retain the old generic route template');
  const linkSection = html.match(/<section class="section focus-links">[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.equal((linkSection.match(/<a href="\//g) ?? []).length, 3, 'storm damage needs exactly three contextual internal links');
  assert.ok(
    html.indexOf('storm-damage-case-evidence') < html.indexOf('focus-links'),
    'the urgent-response gallery should appear before the related-links section',
  );
  assert.equal((html.match(/class="storm-damage-evidence-item"/g) ?? []).length, 6, 'six supplied photos must form one complete gallery');
  for (const image of images) assert.match(html, new RegExp(image.replaceAll('.', '\\.'), 'i'));
  assert.match(css, /\.storm-damage-evidence-grid\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css, /@media\(max-width:900px\)\{\.storm-damage-evidence-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}\}/);
  assert.match(css, /@media\(max-width:560px\)\{\.storm-damage-evidence-grid\{grid-template-columns:1fr\}/);
  assert.doesNotMatch(
    css,
    /main:has\(\.service-route-detail\)\s*>\s*\.section:not\(\.service-route-detail\)\{display:none\}/,
    'the route-level visibility rule must not hide the urgent-response gallery',
  );
  assert.match(
    css,
    /main:has\(\.service-route-detail\)\s*>\s*\.section:not\(\.service-route-detail\):not\(\.storm-damage-case-evidence\)\{display:none\}/,
    'the urgent-response gallery must be explicitly exempt from route-level hiding',
  );
});

test('the production build runs the Vercel staging step before publishing the public directory', () => {
  const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const vercelJson = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
  assert.equal(packageJson.scripts.build, 'node vercel-build.mjs');
  assert.equal(vercelJson.buildCommand, 'node vercel-build.mjs');
});

test('the generated enquiry function uses the supported Node 24 Vercel runtime', () => {
  const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const functionConfig = JSON.parse(readFileSync(join(root, '.vercel', 'output', 'functions', 'api', 'enquiry.func', '.vc-config.json'), 'utf8'));
  assert.equal(packageJson.engines?.node, '24.x');
  assert.equal(functionConfig.runtime, 'nodejs24.x');
});
