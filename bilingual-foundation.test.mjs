import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import * as catalog from './content/i18n/catalog.mjs';
import * as localizer from './content/i18n/localize.mjs';
const fixture = `<!doctype html><html lang="en"><head><title>Roof repairs</title>
<link rel="canonical" href="https://www.perthroofcare.com.au/contact/">
<meta name="description" content="Arrange roof repairs"><meta property="og:url" content="https://www.perthroofcare.com.au/contact/">
<meta name="twitter:card" content="summary_large_image"><meta property="og:image:alt" content="Roof detail">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"LocalBusiness","@id":"https://www.perthroofcare.com.au/#business","name":"Ellis Services Group","address":{"@type":"PostalAddress","streetAddress":"140 St Georges Terrace","addressLocality":"Perth","addressRegion":"WA"},"opens":"09:00"},{"@type":"WebPage","@id":"https://www.perthroofcare.com.au/contact/#webpage","name":"Roof repairs","description":"Arrange roof repairs","inLanguage":"en-AU","dateModified":"2026-10-14"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Can you repair tiles?","acceptedAnswer":{"@type":"Answer","text":"We repair tiles."}}]}]}</script>
<script id="page-knowledge" type="application/json">{"schemaVersion":"1.0","pageType":"ServicePage","canonicalUrl":"https://www.perthroofcare.com.au/contact/","publicBrand":"Perth Roof Care","summary":"Arrange roof repairs","guidance":[{"heading":"Repair scope","body":"We repair tiles."}],"relatedUrls":["https://www.perthroofcare.com.au/privacy/"],"contact":{"officeAddress":"140 St Georges Terrace, Perth WA 6000"}}</script>
<style>.roof:after{content:'Leave styles alone'}</style></head><body>
<header><nav aria-label="Main navigation"><a href="/">Home</a><a href="/contact/">Contact</a><a class="button" href="/contact/">Make an enquiry</a></nav></header>
<main><h1>Roof repairs</h1><p>Arrange <a href="../privacy/?from=contact#consent">roof repairs</a> today.</p>
<img src="/assets/roof.jpg" alt="Roof detail"><input name="name" placeholder="Your name" aria-label="Name"><button title="Send enquiry">Send</button>
<noscript><p>Email our team</p></noscript><code>Leave code alone</code><pre>Leave pre alone</pre>
<a href="tel:+61405878406">0405 878 406</a><a href="mailto:ellis@example.com">ellis@example.com</a>
<a href="https://example.com/contact/">External</a><a href="/news/feed.xml">RSS</a><a href="#local">Jump</a><form action="/api/enquiry"></form>
<time datetime="2026-10-14">2026-10-14</time><script>const message='Leave scripts alone';</script></main></body></html>`;
const sources = {
  'Roof repairs':'屋面维修', 'Arrange roof repairs':'安排屋面维修', 'Roof detail':'屋面细节',
  'Can you repair tiles?':'能维修屋面瓦片吗？', 'We repair tiles.':'我们维修屋面瓦片。', 'Repair scope':'维修范围',
  'Main navigation':'主导航', Home:'首页', Contact:'联系', 'Make an enquiry':'提交咨询',
  Arrange:'安排', 'roof repairs':'屋面维修', 'today.':'今天。', 'Your name':'您的姓名', Name:'姓名',
  'Send enquiry':'发送咨询', Send:'发送', 'Email our team':'给团队发邮件', External:'外部链接', RSS:'订阅', Jump:'跳转',
};
const options = translations => ({ language:'zh-Hans', route:'/contact/', englishRoutes:new Set(['/','/contact/','/privacy/']), translations, siteBase:'https://www.perthroofcare.com.au' });
function dictionary() { return Object.fromEntries(Object.entries(sources).map(([s,t])=>[catalog.sourceId(s),t])); }

test('foundation modules expose extraction and localization APIs', () => {
  assert.equal(typeof catalog.collectPageStrings, 'function');
  assert.equal(typeof localizer.localizePage, 'function');
});

test('catalog deduplicates normalized source with deterministic collision-safe IDs', () => {
  const strings = catalog.collectPageStrings('<p>Roof\n repairs</p><p> Roof repairs </p><p>Different roof</p>');
  assert.equal(strings.size, 2);
  assert.equal(strings.get(catalog.sourceId('Roof repairs')), 'Roof repairs');
  assert.equal(catalog.sourceId('Roof\t repairs'),catalog.sourceId('Roof repairs'));
  assert.match(catalog.sourceId('Roof repairs'),/^[a-f0-9]{20}$/);
  assert.throws(()=>catalog.addCatalogString(new Map([[catalog.sourceId('Roof repairs'),'Other text']]),'Roof repairs'),/collision/i);
});

test('catalog covers text, accessible attributes, head metadata and readable JSON with provenance', () => {
  const strings = [...catalog.collectPageStrings(fixture).values()];
  for (const source of Object.keys(sources)) assert.ok(strings.includes(source),source);
  for (const source of ['Leave code alone','Leave pre alone','Leave scripts alone','summary_large_image','ServicePage','en-AU','2026-10-14','09:00','Ellis Services Group','140 St Georges Terrace','Perth']) assert.ok(!strings.includes(source),source);
  const {entries, exclusions} = catalog.collectPageEntries(fixture);
  assert.ok(entries.some(e=>e.source==='We repair tiles.'&&e.location.includes('json')));
  assert.ok(entries.some(e=>e.source==='Roof detail'&&e.location.includes('@alt')));
  assert.ok(exclusions.some(e=>e.source==='Ellis Services Group'&&e.reason==='proper-name'));
});

test('Chinese localizes inline text while preserving nodes, form identifiers, assets and code', () => {
  const $ = load(localizer.localizePage(fixture,options(dictionary())),{scriptingEnabled:false});
  assert.equal($('main p').first().text(),'安排 屋面维修 今天。');
  assert.equal($('main p a').length,1);
  assert.equal($('img').attr('alt'),'屋面细节');
  assert.equal($('input').attr('placeholder'),'您的姓名');
  assert.equal($('input').attr('aria-label'),'姓名');
  assert.equal($('input').attr('name'),'name');
  assert.equal($('button').attr('title'),'发送咨询');
  assert.equal($('noscript').text(),'给团队发邮件');
  assert.equal($('code').text(),'Leave code alone');
  assert.equal($('form').attr('action'),'/api/enquiry');
  assert.equal($('img').attr('src'),'/assets/roof.jpg');
  assert.equal($('a[href^="tel:"]').attr('href'),'tel:+61405878406');
  assert.equal($('a[href^="mailto:"]').attr('href'),'mailto:ellis@example.com');
  assert.equal($('time').text(),'2026-10-14');
});

test('Chinese metadata and readable JSON translate while structural values, business IDs and dates survive', () => {
  const $ = load(localizer.localizePage(fixture,options(dictionary())));
  assert.equal($('title').text(),'屋面维修');
  assert.equal($('meta[name="description"]').attr('content'),'安排屋面维修');
  assert.equal($('meta[property="og:image:alt"]').attr('content'),'屋面细节');
  const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
  assert.equal(graph[0]['@id'],'https://www.perthroofcare.com.au/#business');
  assert.equal(graph[0].address.addressLocality,'Perth');
  assert.equal(graph[1]['@id'],'https://www.perthroofcare.com.au/zh/contact/#webpage');
  assert.equal(graph[1].inLanguage,'zh-Hans');
  assert.equal(graph[1].dateModified,'2026-10-14');
  assert.equal(graph[2].mainEntity[0].acceptedAnswer.text,'我们维修屋面瓦片。');
  const knowledge=JSON.parse($('#page-knowledge').text());
  assert.equal(knowledge.pageType,'ServicePage');
  assert.equal(knowledge.summary,'安排屋面维修');
  assert.equal(knowledge.relatedUrls[0],'https://www.perthroofcare.com.au/zh/privacy/');
});

test('route rewrite handles known local pages, relative paths, queries and fragments without touching endpoints', () => {
  const rewrite = value=>localizer.rewritePageUrl(value,options({}));
  assert.equal(rewrite('../privacy/?from=contact#consent'),'/zh/privacy/?from=contact#consent');
  assert.equal(rewrite('/zh/privacy/?a=1#consent'),'/zh/privacy/?a=1#consent');
  for(const url of ['/api/enquiry','/assets/roof.jpg','/news/feed.xml','#local','tel:0405878406','mailto:ellis@example.com','https://example.com/privacy/','/unknown/']) assert.equal(rewrite(url),url);
});

test('language decoration is idempotent, paired, and positions the switch before the primary enquiry', () => {
  const opts={...options({}),language:'en-AU'};
  const first=localizer.localizePage(fixture,opts);
  const $=load(localizer.localizePage(first,opts));
  assert.equal($('html').attr('lang'),'en-AU');
  assert.equal($('[data-language-switch]').length,1);
  assert.equal($('[data-language-switch]').text(),'中文服务');
  assert.equal($('[data-language-switch]').attr('href'),'/zh/contact/');
  assert.equal($('[data-language-switch]').next().text(),'Make an enquiry');
  assert.equal($('link[rel="canonical"]').attr('href'),'https://www.perthroofcare.com.au/contact/');
  assert.deepEqual($('link[rel="alternate"][hreflang]').map((i,e)=>[$(e).attr('hreflang')]).get(),['en-AU','zh-Hans','x-default']);
  assert.equal($('h1').text(),'Roof repairs');
  const zh=load(localizer.localizePage(fixture,options(dictionary())));
  assert.equal(zh('[data-language-switch]').text(),'English');
  assert.equal(zh('[data-language-switch]').attr('href'),'/contact/');
  assert.equal(zh('link[rel="canonical"]').attr('href'),'https://www.perthroofcare.com.au/zh/contact/');
});

test('missing, blank or untranslated meaningful strings fail explicitly instead of falling back', () => {
  for(const value of [undefined,'','Roof repairs']) {
    const translations=dictionary(); translations[catalog.sourceId('Roof repairs')]=value;
    assert.throws(()=>localizer.localizePage(fixture,options(translations)),error=>error.name==='MissingTranslationError'&&error.message.includes('Roof repairs')&&error.message.includes('/contact/'));
  }
});

test('unknown JSON readable fields require translation and malformed recognized JSON fails', () => {
  assert.throws(()=>localizer.localizePage('<script id="page-knowledge" type="application/json">{"newReadableField":"A new useful explanation"}</script>',options({})),/A new useful explanation/);
  assert.throws(()=>catalog.collectPageStrings('<script type="application/ld+json">{bad}</script>'),/Invalid.*JSON/i);
});

test('structural JSON arrays retain machine identifiers while symbol-prefixed human text still requires translation', () => {
  const html='<p># Roof details</p><p>/ Repair options</p><script type="application/ld+json">{"@type":["WebPage","CreativeWork"],"identifier":["raw-business-id"],"name":"Roof repairs"}</script>';
  const strings=[...catalog.collectPageStrings(html).values()];
  assert.ok(strings.includes('# Roof details'));
  assert.ok(strings.includes('/ Repair options'));
  for(const value of ['WebPage','CreativeWork','raw-business-id']) assert.ok(!strings.includes(value),value);
  assert.throws(()=>localizer.localizePage(html,options(dictionary())),/# Roof details/);
});
