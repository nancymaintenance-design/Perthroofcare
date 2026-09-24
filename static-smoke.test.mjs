import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { spawn } from 'node:child_process';

const root = new URL('.', import.meta.url).pathname.replace(/^\/(.:)/, '$1');
const routes = ['', 'services', 'roof-repairs', 'roof-leak-repairs', 'tile-roof-repairs', 'metal-roof-repairs', 'ridge-capping-repointing', 'flashing-repairs', 'gutter-repairs', 'gutters-downpipes', 'downpipe-repairs', 'roof-maintenance', 'storm-damage-roof-repairs', 'roof-restoration', 'roof-inspection', 'repair-options', 'service-areas', 'gallery', 'faq', 'news', 'news/metal-roofing-perth', 'news/gutter-warning-signs', 'news/roof-leak-inspection', 'news/roof-maintenance-basics', 'news/roof-flashing-explained', 'news/drainage-after-rain', 'about', 'contact', 'privacy', 'legal'];
const fileFor = (route) => join(root, route || '.', 'index.html');
const contact = ['0405878406', 'ellisservicesgroup3@outlook.com', '140 St Georges Terrace, Perth WA 6000'];
const forbidden = /candidate|to be confirmed|local demo|placeholder|AI-generated/iu;
const allHtmlFiles = (folder) => readdirSync(folder, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? allHtmlFiles(join(folder, entry.name)) : entry.name.endsWith('.html') ? [join(folder, entry.name)] : []);

test('publishes at least 24 independent HTML routes with SEO metadata and one H1 each', () => {
  assert.ok(routes.length >= 24);
  const titles = new Set();
  for (const route of routes) {
    const file = fileFor(route); assert.ok(existsSync(file), `missing ${route || '/'}`);
    const html = readFileSync(file, 'utf8'); const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
    assert.ok(title, `${route} needs title`); assert.ok(!titles.has(title), `${route} title must be unique`); titles.add(title);
    assert.match(html, /<meta name="description" content=".{80,160}">/i, `${route} needs an 80–160 character description`);
    assert.match(html, /<link rel="canonical" href="https:\/\/www\.perthroofcare\.com\.au\/[^"]*">/i, `${route} needs canonical`);
    assert.equal((html.match(/<h1[\s>]/gi) ?? []).length, 1, `${route} needs one H1`);
  }
});

test('public copy has no release-internal or generated-content language', () => {
  for (const file of allHtmlFiles(root)) assert.doesNotMatch(readFileSync(file, 'utf8'), forbidden, file);
});

test('service pages publish distinct route-specific main content', () => {
  const pages = ['roof-repairs', 'roof-leak-repairs', 'tile-roof-repairs', 'metal-roof-repairs', 'ridge-capping-repointing', 'flashing-repairs', 'gutter-repairs', 'gutters-downpipes', 'downpipe-repairs', 'roof-maintenance', 'storm-damage-roof-repairs', 'roof-restoration', 'roof-inspection', 'repair-options'];
  const bodies = pages.map((route) => readFileSync(fileFor(route), 'utf8').match(/<main[\s\S]*?<\/main>/i)?.[0]);
  assert.equal(new Set(bodies).size, pages.length, 'each service route needs its own main content');
  for (const body of bodies) {
    assert.match(body, /What to note/i, 'service page needs visible signs');
    assert.match(body, /Useful context/i, 'service page needs useful context');
    assert.match(body, /Next step/i, 'service page needs a next step');
    assert.match(body, /Read the guide/i, 'service page needs a related guide');
  }
});

test('all pages repeat the confirmed contact facts without per-image visual labels', () => {
  for (const route of routes) { const html = readFileSync(fileFor(route), 'utf8'); for (const fact of contact) assert.match(html, new RegExp(fact), `${route} missing ${fact}`); }
  for (const file of allHtmlFiles(root)) assert.doesNotMatch(readFileSync(file, 'utf8'), /Illustrative visual/, file);
  assert.match(readFileSync(fileFor('legal'), 'utf8'), /Website imagery is illustrative and does not depict client work\./);
});

test('contact, privacy, sitemap and robots have safe public-facing details', () => {
  const contactHtml = readFileSync(fileFor('contact'), 'utf8'); assert.match(contactHtml, /href="tel:\+61405878406"/i); assert.match(contactHtml, /href="mailto:ellisservicesgroup3@outlook\.com"/i); assert.match(contactHtml, /<form[\s>]/i);
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8'); for (const route of routes) assert.match(sitemap, new RegExp(`https://www\\.perthroofcare\\.com\\.au/${route}`)); assert.match(readFileSync(join(root, 'robots.txt'), 'utf8'), /Allow: \//);
});

test('local browser can load the supplied company logo as its favicon', () => {
  assert.ok(existsSync(join(root, 'favicon.ico')), 'site root needs a browser favicon');
  const server = readFileSync(join(root, 'local-server.mjs'), 'utf8');
  assert.match(server, /'\.ico':\s*'image\/x-icon'/i, 'local server must provide the favicon with an icon content type');
});

test('homepage publishes a standard PNG favicon from the root', async (t) => {
  const home = readFileSync(fileFor(''), 'utf8');
  assert.match(home, /<link(?=[^>]*\brel="icon")(?=[^>]*\bhref="\/favicon\.png")(?=[^>]*\btype="image\/png")[^>]*>/i, 'homepage needs a stable PNG favicon declaration');
  assert.match(home, /<link(?=[^>]*\brel="apple-touch-icon")(?=[^>]*\bhref="\/favicon\.png")[^>]*>/i, 'homepage needs an Apple touch icon declaration');
  const favicon = join(root, 'favicon.png');
  const png = readFileSync(favicon);
  assert.deepEqual(png.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), 'favicon must be a PNG');
  assert.equal(png.readUInt32BE(16), 512, 'favicon must use the standard 512px height');
  assert.equal(png.readUInt32BE(20), 512, 'favicon must use the standard 512px width');
  assert.ok(existsSync(join(root, 'public', 'favicon.png')), 'Vercel build must package the PNG favicon');

  const port = 4802;
  const child = spawn(process.execPath, ['local-server.mjs'], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  t.after(() => child.kill());
  let response;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try { response = await fetch(`http://127.0.0.1:${port}/favicon.png`); break; } catch { await new Promise((resolve) => setTimeout(resolve, 100)); }
  }
  assert.equal(response?.status, 200, 'local server should serve /favicon.png');
  assert.match(response?.headers.get('content-type') ?? '', /^image\/png\b/i, 'favicon response must be PNG');
});

test('local server serves a generated roof repairs route from the project root', async (t) => {
  const port = 4801;
  const child = spawn(process.execPath, ['local-server.mjs'], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  t.after(() => child.kill());
  let response;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try { response = await fetch(`http://127.0.0.1:${port}/roof-repairs/`); break; } catch { await new Promise((resolve) => setTimeout(resolve, 100)); }
  }
  assert.equal(response?.status, 200, 'local server should serve the generated roof repairs route');
  assert.match(await response.text(), /<h1>ROOF REPAIRS(?: IN PERTH)?\.<\/h1>/i);
});

test('local server maps published office map styles to their source file', async (t) => {
  const port = 4803;
  const child = spawn(process.execPath, ['local-server.mjs'], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  t.after(() => child.kill());
  let response;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try { response = await fetch(`http://127.0.0.1:${port}/assets/css/office-location.css`); break; } catch { await new Promise((resolve) => setTimeout(resolve, 100)); }
  }
  assert.equal(response?.status, 200, 'local server should serve the published office map stylesheet');
  assert.match(await response.text(), /\.office-map-frame/);
});

test('JSON-LD contains only confirmed organization facts', () => {
  const json = readFileSync(fileFor(''), 'utf8').match(/<script type="application\/ld\+json">(.*?)<\/script>/i)?.[1]; assert.ok(json); const data = JSON.parse(json);
  assert.equal(data.name, 'Ellis Services Group'); assert.equal(data.telephone, '0405878406'); assert.equal(data.email, 'ellisservicesgroup3@outlook.com'); assert.equal(data.foundingDate, '2020-11-11'); assert.doesNotMatch(json, /"(?:aggregateRating|review|ABN|openingHours|geo)"/i);
});

test('homepage provides an accessible three-slide hero carousel with one H1', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  assert.match(home, /class="[^"]*hero-carousel[^"]*"[^>]*aria-roledescription="carousel"/i);
  assert.equal((home.match(/class="hero-slide/g) ?? []).length, 3);
  assert.equal((home.match(/<h1[\s>]/gi) ?? []).length, 1);
  assert.ok((home.match(/<h2[\s>]/gi) ?? []).length >= 2);
  for (const action of ['previous', 'next', 'pause']) assert.match(home, new RegExp(`data-carousel-action="${action}"`));
  assert.match(home, /aria-live="polite"/);
  const script = readFileSync(join(root, 'site.js'), 'utf8');
  for (const contract of [/prefers-reduced-motion/, /event\.key === 'ArrowLeft'/, /event\.key === 'ArrowRight'/, /event\.key === ' '/]) assert.match(script, contract);
  assert.doesNotMatch(script, /setInterval/, 'the Atlas carousel must never advance without a visitor action');
});

test('homepage moves the unused visual-band images into the second and third carousel slides', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  const heroCss = readFileSync(join(root, 'brand-hero.css'), 'utf8');
  const builder = readFileSync(join(root, 'build.mjs'), 'utf8');
  assert.match(home, /class="[^\"]*atlas-hero[^\"]*"/i, 'homepage needs the Atlas hero landmark');
  assert.match(home, /rel="preload" as="image" href="\/assets\/images\/hero-australian-roofer-v2\.png" fetchpriority="high"/i, 'opening slide needs a high-priority visual preload');
  assert.doesNotMatch(home, /class="hero-roofer-media"/i, 'the CSS hero must not also create a hidden duplicate image request');
  assert.ok(existsSync(join(root, 'hero-australian-roofer-v2.png')), 'opening hero image asset must exist');
  assert.match(heroCss, /\.hero-roofer-media::after[\s\S]*?linear-gradient/i, 'opening image needs a softened reading overlay');
  assert.match(heroCss, /\.hero-roofer-media img[\s\S]*?filter:\s*brightness/i, 'opening image needs a reduced-brightness treatment');
  assert.match(heroCss, /\.atlas-visual-band\s*\{[^}]*display:\s*none/i, 'the unused visual band must not render');
  assert.match(heroCss, /\.hero-slide:nth-child\(2\)::before[\s\S]*?hero-roof\.png/i, 'second slide needs the first relocated image as its background');
  assert.match(heroCss, /\.hero-slide:nth-child\(3\)::before[\s\S]*?metal-roof\.png/i, 'third slide needs the second relocated image as its background');
  assert.match(builder, /hero-carousel-media[\s\S]*?hero-roof\.png/i, 'a future build must write the second slide image into the carousel');
  assert.match(builder, /hero-carousel-media[\s\S]*?metal-roof\.png/i, 'a future build must write the third slide image into the carousel');
  assert.match(home, /class="[^\"]*atlas-index[^\"]*"/i, 'homepage needs the Atlas service index');
});

test('homepage can hold one roof-repair image while three text panels scroll in sequence', () => {
  const heroCss = readFileSync(join(root, 'brand-hero.css'), 'utf8');
  const script = readFileSync(join(root, 'site.js'), 'utf8');
  assert.match(heroCss, /\.atlas-hero\.home[\s\S]*?background-image:\s*url\("\/assets\/images\/hero-australian-roofer-v2\.png"\)/i, 'the reading mode uses one roof-repair image');
  assert.match(heroCss, /\.atlas-hero\.home[\s\S]*?background-attachment:\s*fixed/i, 'desktop image remains fixed while reading');
  assert.match(heroCss, /\.atlas-hero\.home\s+\.hero-slide\[hidden\]\s*\{[^}]*display:\s*grid\s*!important/i, 'the remaining text panels remain visible in reading order');
  assert.match(heroCss, /\.atlas-hero\.home\s+\.carousel-controls\s*\{[^}]*display:\s*none/i, 'carousel controls do not appear in reading mode');
  assert.match(heroCss, /@media\s*\(max-width:\s*560px\)[\s\S]*?\.atlas-hero\.home\s*\{[^}]*background-attachment:\s*scroll/i, 'mobile uses stable normal background scrolling');
  assert.match(script, /fixedReadingHero/, 'the reading mode must expose every text panel to assistive technology');
  assert.match(script, /slide\.hidden\s*=\s*false/, 'the reading mode must remove hidden panel state');
});

test('fixed reading panels use compact desktop and mobile spacing', () => {
  const heroCss = readFileSync(join(root, 'brand-hero.css'), 'utf8');
  assert.match(heroCss, /\.atlas-hero\.home\s+\.hero-slide,\s*\.atlas-hero\.home\s+\.hero-slide\[hidden\]\s*\{[^}]*min-height:\s*clamp\(24rem,\s*58svh,\s*33rem\)/i, 'each desktop reading panel has a compact height ceiling');
  assert.match(heroCss, /\.atlas-hero\.home\s+\.hero-copy[\s\S]*?margin:\s*clamp\(1\.25rem,\s*4vh,\s*2\.5rem\)/i, 'content cards use restrained vertical margins');
  assert.match(heroCss, /\.atlas-hero\.home\s+\.hero-slide\s+h1\s*\{[^}]*font-size:\s*clamp\(2\.7rem,\s*5\.2vw,\s*5\.4rem\)/i, 'opening headline uses a compact scale');
  assert.match(heroCss, /@media\s*\(max-width:\s*560px\)[\s\S]*?\.atlas-hero\.home\s+\.hero-slide,\s*\.atlas-hero\.home\s+\.hero-slide\[hidden\]\s*\{[^}]*padding:\s*1\.5rem\s+0/i, 'mobile panels keep compact outer spacing');
});

test('homepage publishes a fixed-roofline scroll story', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  const css = readFileSync(join(root, 'site.css'), 'utf8');
  assert.match(home, /<section class="fixed-roofline-story"/i, 'homepage needs the roofline story landmark');
  assert.ok((home.match(/class="[^"]*\bstory-panel\b[^"]*"/g) ?? []).length >= 3, 'story needs three reading panels');
  for (const href of ['/services/', '/service-areas/', '/contact/']) assert.match(home, new RegExp(`href="${href}"`), `story links to ${href}`);
  assert.match(css, /position:\s*sticky/i, 'desktop story media stays sticky');
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i, 'story respects reduced motion');
  assert.match(css, /@media\s*\(max-width:\s*560px\)[\s\S]*?\.story-media\s*\{[^}]*position:\s*relative/i, 'mobile story returns media to normal flow');
});

test('homepage provides a confirmed Perth office map before the footer', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  const section = home.match(/<section[^>]+class="[^"]*\boffice-location\b[^"]*"[\s\S]*?<\/section>/i)?.[0] ?? '';
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

test('homepage service overview and Perth area groups complete their desktop grids with useful existing links', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  const areas = readFileSync(fileFor('service-areas'), 'utf8');
  const serviceGrid = home.match(/<div class="homepage-service-links">([\s\S]*?)<\/div>/i)?.[1] ?? '';
  const areaGrid = areas.match(/<div class="cards area-groups">([\s\S]*?)<\/div>/i)?.[1] ?? '';
  assert.equal((serviceGrid.match(/<a\s/gi) ?? []).length, 16, 'service overview fills all sixteen desktop grid positions');
  assert.match(serviceGrid, /href="\/news\/roof-leak-inspection\/"[^>]*>ROOF LEAK GUIDE<\/a>/i);
  assert.match(serviceGrid, /href="\/news\/drainage-after-rain\/"[^>]*>DRAINAGE GUIDE<\/a>/i);
  assert.equal((areaGrid.match(/<article\s/gi) ?? []).length, 6, 'area overview fills both desktop rows');
  assert.match(areaGrid, /<h2>Enquiry &amp; Coverage<\/h2>/i);
  assert.match(areaGrid, /href="\/contact\/"/i);
});

test('office map frame has responsive dimensions', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  const css = readFileSync(join(root, 'office-location.css'), 'utf8');
  assert.match(home, /<link rel="stylesheet" href="\/assets\/css\/office-location\.css">/i);
  assert.match(css, /\.office-map-frame\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/i);
  assert.match(css, /\.office-map-frame iframe\s*\{[^}]*width:\s*100%/i);
});

test('FAQ gives every published question a specific, non-empty answer', () => {
  const faq = readFileSync(fileFor('faq'), 'utf8');
  const entries = [...faq.matchAll(/<details>\s*<summary>([^<]+)<\/summary>\s*<p>([^<]+)<\/p>\s*<\/details>/gi)]
    .map(([, question, answer]) => ({ question: question.trim(), answer: answer.trim() }));
  assert.equal(entries.length, 26, 'FAQ must publish all 26 question-and-answer pairs');
  assert.ok(entries.every(({ question, answer }) => question && answer), 'each FAQ entry needs a question and answer');
  assert.equal(new Set(entries.map(({ answer }) => answer)).size, entries.length, 'each FAQ answer must be specific to its question');
});

test('primary navigation provides a grouped, keyboard-operable services panel', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  assert.match(home, /<a href="\/">Home<\/a>/);
  assert.match(home, /class="services-toggle services-trigger"[^>]*aria-expanded="false"[^>]*aria-controls="services-submenu"/);
  assert.match(home, /id="services-submenu"[^>]*role="region"[^>]*aria-label="Services"/);
  assert.match(home, /Start with the roof or drainage detail you can see./i);
  assert.match(home, /href="\/services\/"[^>]*>View all services/i);
  for (const heading of ['Roof repairs &amp; leaks', 'Roofline details', 'Gutters, maintenance &amp; inspection']) assert.match(home, new RegExp(`<h2>${heading}<\\/h2>`));
  for (const label of ['Roof Repairs', 'Roof Leak Repairs', 'Tile Roof Repairs', 'Metal Roof Repairs', 'Ridge Capping &amp; Repointing', 'Flashing Repairs', 'Gutters &amp; Downpipes', 'Roof Maintenance', 'Storm Damage Roof Repairs', 'Roof Inspection']) assert.match(home, new RegExp(`>${label}<`));
  const script = readFileSync(join(root, 'site.js'), 'utf8');
  const css = readFileSync(join(root, 'site.css'), 'utf8');
  assert.match(script, /servicesToggle/); assert.match(script, /event\.key === 'Escape'/); assert.match(script, /servicesToggle\.focus\(\)/);
  assert.match(css, /\.services-menu-groups\s*\{[^}]*grid-template-columns:\s*repeat\(3/i);
});

test('about page presents confirmed company information and a detailed Perth enquiry path', () => {
  const about = readFileSync(fileFor('about'), 'utf8');
  const text = about.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  assert.ok(text.split(' ').length >= 700, 'about page needs a substantial company, service and enquiry guide');
  assert.equal((about.match(/<h1[\s>]/gi) ?? []).length, 1);
  assert.match(about, /ELLIS SERVICES GROUP PTY LTD/i);
  assert.match(about, /ABN 96 645 821 745/i);
  assert.match(about, /ACN 645 821 745/i);
  assert.match(about, /Active from 11 November 2020/i);
  assert.match(about, /GST registered from 11 November 2020/i);
  assert.match(about, /https:\/\/abr\.business\.gov\.au\/ABN\/View\?id=645821745/i);
  assert.match(about, /How an enquiry is arranged/i);
  assert.match(about, /Questions people often ask/i);
  assert.match(about, /140 St Georges Terrace, Perth WA 6000/i);
  assert.match(about, /0405878406/i);
  assert.match(about, /ellisservicesgroup3@outlook\.com/i);
  assert.doesNotMatch(about, /\b(?:2011|long-term cooperation|experienced tradespeople|advanced equipment|familiar with Australian housing and maintenance standards)\b/i);
  assert.doesNotMatch(about, /\b(?:fully insured|public liability|licen[cs]ed contractor|insurance policy number|warranty terms|within \d+|#1|best in Perth)\b/i);
});

test('homepage brand marks use the supplied logo without causing layout shift', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  const logo = '/assets/images/ellis-logo.png';
  assert.ok(existsSync(join(root, 'ellis-logo.png')), 'supplied logo asset is present');
  const header = home.match(/<header>[\s\S]*?<\/header>/i)?.[0] ?? '';
  const footer = home.match(/<footer>[\s\S]*?<\/footer>/i)?.[0] ?? '';
  for (const landmark of [header, footer]) {
    assert.match(landmark, new RegExp(`<img[^>]+src="${logo}"[^>]+alt="Ellis Services Group logo"[^>]+(?:width="\\d+"|height="\\d+")`, 'i'));
    assert.match(landmark, /ELLIS\s*<i>SERVICES GROUP<\/i>/i, 'brand text remains available beside the logo');
  }
});

test('homepage footer provides an accessible Instagram link to Ellis Services Group', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  const css = readFileSync(join(root, 'site.css'), 'utf8');
  const footer = home.match(/<footer>[\s\S]*?<\/footer>/i)?.[0] ?? '';
  assert.match(footer, /<a[^>]+class="instagram-link"[^>]+href="https:\/\/www\.instagram\.com\/elliservices_group\/"/i);
  assert.match(footer, /target="_blank"[^>]+rel="noopener noreferrer"/i);
  assert.match(footer, /aria-label="Visit Ellis Services Group on Instagram"/i);
  assert.match(footer, /<img[^>]+class="instagram-icon"[^>]+src="\/assets\/images\/instagram-icon\.png"[^>]+width="16"[^>]+height="16"[^>]+alt=""/i, 'Instagram link uses the supplied icon at a text-sized intrinsic dimension');
  assert.ok(existsSync(join(root, 'instagram-icon.png')), 'supplied Instagram icon must remain a source asset');
  assert.match(css, /footer\s+\.instagram-link\s+\.instagram-icon\s*\{[^}]*width:\s*1em[^}]*height:\s*1em/i, 'Instagram icon remains the same size as its text');
});

test('Atlas CSS uses a warm paper reading surface with responsive gutters', () => {
  const css = `${readFileSync(join(root, 'brand-hero.css'), 'utf8')}\n${readFileSync(join(root, 'contact-form.css'), 'utf8')}`;
  assert.match(css, /\.atlas-hero\s*\{[^}]*background:\s*var\(--paper\)/, 'Atlas hero uses the paper surface');
  assert.match(css, /\.atlas-visual-band\s*\{[^}]*grid-template-columns:/, 'visual band has an explicit desktop layout');
  assert.match(css, /@media\s*\(max-width:\s*560px\)[\s\S]*?\.atlas-visual-band\s*\{[^}]*grid-template-columns:\s*1fr/i, 'visual band stacks on mobile');
});

test('Atlas layout keeps controls in flow and protects reading widths from overflow', () => {
  const siteCss = readFileSync(join(root, 'site.css'), 'utf8');
  const atlasCss = readFileSync(join(root, 'brand-hero.css'), 'utf8');
  const css = `${siteCss}\n${atlasCss}`;
  assert.match(atlasCss, /\.atlas-hero\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/i, 'Atlas hero must explicitly use one grid column');
  assert.match(atlasCss, /\.atlas-hero\s+\.carousel-controls\s*\{[^}]*position:\s*static/i, 'Atlas carousel controls must remain in document flow');
  assert.match(atlasCss, /\.atlas-hero\s+h1\s*\{[^}]*font-size:\s*clamp\(/i, 'Atlas desktop headline needs its own readable scale');
  assert.match(atlasCss, /@media\s*\(max-width:\s*560px\)[\s\S]*?\.hero-copy\s*\{[^}]*width:\s*min\(100%,\s*70rem\)/i, 'mobile hero copy must not subtract width twice');
  assert.match(css, /overflow-wrap:\s*anywhere/i, 'long navigation, headings and body copy need an emergency wrapping guard');
  assert.match(css, /nav\s*\{[^}]*white-space:\s*normal/i, 'navigation must be allowed to wrap when space is constrained');
});

test('Atlas stylesheet removes the old dark-orange hero grammar', () => {
  const css = `${readFileSync(join(root, 'site.css'), 'utf8')}\n${readFileSync(join(root, 'brand-hero.css'), 'utf8')}`;
  for (const token of ['--paper', '--coastal-ink', '--eucalyptus', '--sand-line', '--sky-wash']) assert.match(css, new RegExp(token));
  assert.doesNotMatch(css, /56vw|skewY|max-width:\s*0px/i);
  assert.match(css, /\.atlas-index-item\s*\{[^}]*border-bottom:/, 'service index uses reading lines rather than a card top stripe');
});

test('services publish the Atlas index instead of a dark card grid', () => {
  const services = readFileSync(fileFor('services'), 'utf8');
  assert.match(services, /class="[^\"]*atlas-index[^\"]*"/i);
  assert.doesNotMatch(services, /class="cards"/i);
});

test('resources and every guide use its dedicated supplied resource image', () => {
  const assets = ['resources-metal-project.jpg', 'resources-gutter-project.jpg', 'resources-tile-project.jpg', 'resources-downpipe.png', 'resources-tools.png', 'resources-dusk.png'];
  for (const asset of assets) assert.ok(existsSync(join(root, asset)), `missing ${asset}`);
  const news = readFileSync(fileFor('news'), 'utf8');
  for (const asset of assets) assert.match(news, new RegExp(`/assets/images/${asset}`));
  assert.match(news, /<img[^>]+src="\/assets\/images\/resources-metal-project\.jpg"[^>]+alt="Grey metal roof sheets viewed across a Perth roofline"[^>]*>[\s\S]*?<h2>Metal Roofing in Perth<\/h2>/i);
  assert.match(news, /<img[^>]+src="\/assets\/images\/resources-gutter-project\.jpg"[^>]+alt="Covered patio roof edge and gutter line"[^>]*>[\s\S]*?<h2>Gutter Warning Signs<\/h2>/i);
  assert.match(news, /<img[^>]+src="\/assets\/images\/resources-tile-project\.jpg"[^>]+alt="Red tiled roof with visible weathering and ridge detail"[^>]*>[\s\S]*?<h2>Roof Leak Inspection Guide<\/h2>/i);
  const guides = routes.filter((route) => route.startsWith('news/'));
  for (let index = 0; index < guides.length; index += 1) {
    const html = readFileSync(fileFor(guides[index]), 'utf8');
    assert.match(html, new RegExp(`/assets/images/${assets[index]}`));
    assert.doesNotMatch(html, /<img[^>]+src="\/assets\/images\/(?:hero-roof|metal-roof|inspection|gutter)\.png"/i);
  }
});

test('service areas remain a single Perth metropolitan grouped page with visible site links', () => {
  const home = readFileSync(fileFor(''), 'utf8');
  const services = readFileSync(fileFor('services'), 'utf8');
  const areas = readFileSync(fileFor('service-areas'), 'utf8');
  for (const html of [home, services]) assert.match(html, /href="\/service-areas\/"[^>]*>[^<]*(?:Perth service areas|Service areas|Areas)/i);
  for (const label of ['Perth CBD & Inner', 'Western Suburbs', 'Northern Corridor', 'Eastern & Hills', 'Southern & Fremantle']) assert.match(areas, new RegExp(label));
  assert.match(areas, /no separate suburb pages/i);
  assert.match(areas, /<title>Perth Metropolitan Service Areas \| Ellis Services Group<\/title>/i);
  assert.doesNotMatch(areas, /#1|best in Perth|rank/i);
});

test('contact form owns validation and gives accessible inline status feedback', () => {
  const html = readFileSync(fileFor('contact'), 'utf8');
  for (const label of ['Name', 'Phone', 'Email', 'Enquiry']) assert.match(html, new RegExp(`<label[^>]*>${label}\\*`));
  assert.match(html, /<form[^>]*action="\/api\/enquiry"[^>]*novalidate/i);
  assert.match(html, /type="checkbox"[^>]*required/i);
  assert.match(html, /aria-live="polite"/i);
  assert.match(html, /Send Enquiry/i);
  const script = readFileSync(join(root, 'site.js'), 'utf8');
  assert.match(script, /fetch\('\/api\/enquiry'/);
  assert.match(script, /aria-invalid/);
});

test('enquiry endpoint refuses email delivery without Resend configuration', async (t) => {
  const port = 4799;
  const child = spawn(process.execPath, ['local-server.mjs'], { cwd: root, env: { ...process.env, PORT: String(port), RESEND_API_KEY: '', RESEND_FROM: '' }, stdio: 'ignore' });
  t.after(() => child.kill());
  const request = () => fetch(`http://127.0.0.1:${port}/api/enquiry`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Ada', phone: '0400000000', email: 'ada@example.com', enquiry: 'Please contact me.', privacy: true }) });
  let response;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try { response = await request(); break; } catch { await new Promise((resolve) => setTimeout(resolve, 100)); }
  }
  assert.ok(response, 'local server should accept the enquiry request after startup');
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'Enquiry email is not configured.' });
});

test('Vercel enquiry function keeps email delivery disabled until Resend is configured', async () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.RESEND_FROM;
  process.env.RESEND_API_KEY = '';
  process.env.RESEND_FROM = '';
  try {
    const { default: enquiry } = await import('./enquiry.js');
    const response = {
      code: null,
      payload: null,
      status(code) { this.code = code; return this; },
      json(payload) { this.payload = payload; return this; },
      setHeader() {}
    };
    await enquiry({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { name: 'Ada', phone: '0400000000', email: 'ada@example.com', enquiry: 'Please contact me.', privacy: true }
    }, response);
    assert.equal(response.code, 503);
    assert.deepEqual(response.payload, { error: 'Enquiry email is not configured.' });
  } finally {
    if (previousKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = previousKey;
    if (previousFrom === undefined) delete process.env.RESEND_FROM; else process.env.RESEND_FROM = previousFrom;
  }
});

test('Vercel build stages the complete static site in public', () => {
  const config = readFileSync(join(root, 'vercel.json'), 'utf8');
  assert.match(config, /"outputDirectory"\s*:\s*"public"/);
  for (const file of ['index.html', 'robots.txt', 'sitemap.xml', 'favicon.ico']) assert.ok(existsSync(join(root, 'public', file)), `public output misses ${file}`);
  for (const folder of ['assets', 'about', 'services', 'contact', 'news']) assert.ok(existsSync(join(root, 'public', folder)), `public output misses ${folder}`);
  assert.ok(existsSync(join(root, 'public', 'assets', 'css', 'office-location.css')), 'public output misses the homepage office map stylesheet');
});

test('resources list uses one fixed landscape image frame for every guide card', () => {
  const news = readFileSync(fileFor('news'), 'utf8');
  const css = readFileSync(join(root, 'site.css'), 'utf8');
  assert.match(news, /class="container cards news-guide-grid"/i);
  assert.match(news, /<link rel="stylesheet" href="\/assets\/css\/site\.css\?v=[^"]+">/i, 'published pages version the stylesheet so layout fixes bypass stale CSS caches');
  assert.match(css, /\.news-guide-grid\s+\.card\s+\.media-frame\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/i);
  assert.match(css, /\.news-guide-grid\s+\.card\s+\.media-frame\s+img\s*\{[^}]*height:\s*100%[^}]*min-height:\s*0[^}]*object-fit:\s*cover/i);
});

test('resource guides provide substantial safety-bounded Perth reading with internal and primary-source references', () => {
  const guides = ['metal-roofing-perth', 'gutter-warning-signs', 'roof-leak-inspection', 'roof-maintenance-basics', 'roof-flashing-explained', 'drainage-after-rain'];
  for (const guide of guides) {
    const html = readFileSync(fileFor(`news/${guide}`), 'utf8');
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    assert.ok(text.split(' ').length >= 700, `${guide} needs substantial, topic-specific guidance`);
    assert.match(html, /What you can safely observe/i, `${guide} includes a safe observation section`);
    assert.match(html, /When to stop and seek help/i, `${guide} gives a safety boundary`);
    assert.match(html, /Sources and further reading/i, `${guide} includes a source section`);
    assert.match(html, /safeworkaustralia\.gov\.au|bom\.gov\.au/i, `${guide} links to a primary safety or weather source`);
    assert.match(html, /href="\/(?:services|roof-repairs|roof-leak-repairs|gutters-downpipes|roof-maintenance|flashing-repairs|contact)\//i, `${guide} links to a related internal page`);
    assert.doesNotMatch(html, /guarantee|always fixes|definitely means|DIY repair instructions/i, `${guide} avoids unverified repair claims and DIY instructions`);
  }
});

test('generated PRC pages load the first-party Speed Insights client', () => {
  for (const route of ['', 'roof-repairs', 'contact']) {
    const html = readFileSync(join(root, 'public', route, 'index.html'), 'utf8');
    assert.match(
      html,
      /<script>window\.si=window\.si\|\|function\(\)\{\(window\.siq=window\.siq\|\|\[\]\)\.push\(arguments\)\};<\/script><script defer src="\/_vercel\/speed-insights\/script\.js"><\/script>/,
      `${route || 'home'} must initialize and load the first-party Speed Insights client`,
    );
  }
});
