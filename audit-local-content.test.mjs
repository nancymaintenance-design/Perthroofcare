import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';

const page=r=>load(readFileSync(`public/${r}/index.html`,'utf8'));
const notice='Roof inspections are chargeable. Confirm the fee and scope before booking.';
const services=['roof-cleaning','roof-painting','box-gutter-repairs','roof-replacement','flat-roof-repairs','strata-roof-repairs'];

// Catch a generation pass dropping the fee disclosure or putting it after commitment.
for(const route of [...services,'roof-inspection','contact']) test(`${route}: inspection fee is visible before the first booking action`,()=>{
 const $=page(route),hero=$('main > section').first();
 const container=route==='contact'?$('main'):hero;
 const action=container.find('a[href="/contact/"],a[href="#enquiry"],a[href^="tel:"]').first();
 assert.ok(hero.find('.inspection-charge-notice').length,route+' hero disclosure');
 assert.equal(hero.find('.inspection-charge-notice').text(),notice);
 assert.ok(action.length,route+' booking action');
 assert.ok(container.html().indexOf(notice)<container.html().indexOf($.html(action)),route+' disclosure order');
 if(route==='contact'){
  const form=$('main form').first();
  assert.equal(form.find('.inspection-charge-notice').text(),notice);
  assert.ok(form.html().indexOf(notice)<form.html().indexOf('<button'),route+' submit disclosure');
 }
});

test('six service scopes explain distinct component decisions without unconfirmed company methods',()=>{
 const expectations={
  'roof-cleaning':[/cleaning alone/i,/restoration/i,/surface deposits/i],
  'roof-painting':[/existing coating/i,/cleaning before spray painting/i,/product compatibility/i],
  'box-gutter-repairs':[/outlet/i,/joint/i,/overflow route/i],
  'roof-replacement':[/local repair/i,/retained/i,/concealed/i],
  'flat-roof-repairs':[/covering/i,/drainage/i,/penetrations/i],
  'strata-roof-repairs':[/permission/i,/authorised contact/i,/skylight/i]
 };
 const scopes=[];
 for(const [route,patterns] of Object.entries(expectations)){
  const $=page(route),scope=$('[id^="scope-"]').text();scopes.push(scope);
  assert.ok(scope.length>1050,route+' useful assessment and selection detail');
  patterns.forEach(pattern=>assert.match(scope,pattern,route));
  assert.doesNotMatch(scope,/we (?:test|flush|prime|coat|install|seal)|Dulux|guaranteed|\$\d/i);
 }
 assert.equal(new Set(scopes).size,6);
});

test('metadata is concise and cost guide promises quote factors, retaining original brand relationship',()=>{
 const about=page('about');
 assert.equal(about('title').text(),'About Perth Roof Care | Ellis Services Group');
 assert.match(about('main').text(),/Perth Roof Care is operated by Ellis Services Group Pty Ltd/);
 const cost=page('news/roof-repair-cost-perth');
 assert.match(cost('title').text(),/Roof Repair Cost Factors Perth/);
 assert.match(cost('.article-lead').text(),/compare.*quotes/i);
 for(const path of ['news/drainage-after-rain','news/metal-roof-repairs-perth-guide','news/roof-leak-inspection','projects/tile-roof-valley-chimney-flashing-repairs-perth','news/roof-maintenance-basics','projects/metal-roof-fastener-repair-sequence','projects/roleystone-metal-roof-fastener-leak-repair']){
  const $=page(path),title=$('title').text();assert.ok(title.length<=80,`${path}: ${title}`);
  assert.equal($('meta[property="og:title"]').attr('content'),title);
  assert.ok($('meta[name="description"]').attr('content').length<=160,path+' concise description');
 }
});

test('fifteen weak area pages offer matching guides without claiming local project evidence',()=>{
 for(const area of ['cottesloe','mosman-park','city-beach','scarborough','claremont','nedlands','subiaco','leederville','joondalup','hillarys','fremantle','rockingham','kalamunda','victoria-park','bayswater']){
  const $=page(`areas/${area}-roof-repairs`),context=$('[data-area-context]');
  assert.equal(context.length,1,area);
  assert.ok(context.find('a[href^="/news/"]').length,area+' matching guide');
  assert.doesNotMatch(context.text(),/our .*project in|completed .*in this suburb/i);
 }
});

test('project counts and factual construction-stage labels survive content refinement',()=>{
 for(const [route,id,count,pattern] of [
  ['roof-cleaning','perth-cleaning-painting-project',1,/Cleaning stage/],
  ['roof-painting','perth-cleaning-painting-project',3,/After spray painting/],
  ['box-gutter-repairs','perth-box-gutter-work',4,/Work in progress/],
  ['roof-replacement','perth-roof-replacement-project',3,/Removal stage/],
  ['flat-roof-repairs','perth-roof-drainage-work',2,/Drainage condition/],
  ['strata-roof-repairs','perth-strata-skylight-project',2,/Installation detail/]
 ]){const $=page(route),gallery=$('#'+id);assert.equal(gallery.find('img').length,count);assert.match(gallery.text(),pattern);}
});

test('all thirty educational questions retain final visible-answer schema parity',async()=>{
 const {educationalTopics}=await import('./content/keyword-map-content.mjs');
 const $=page('faq'),graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
 const schema=graph.find(n=>n['@type']==='FAQPage');assert.equal(educationalTopics.length,30);
 for(const topic of educationalTopics){
  assert.equal(page(topic.route)(`[data-topic="${topic.id}"]`).length,1);
  const detail=$(`#topic-${topic.id.toLowerCase()}`),entry=schema.mainEntity.find(q=>q.name===topic.q);
  assert.ok(entry,topic.id);assert.equal(entry.acceptedAnswer.text,detail.find('p').text());
 }
});

test('reapplying the local refinement preserves disclosure, sections and serialized output',async()=>{
 const {refineLocalContent}=await import('./content/audit-local-content.mjs');
 for(const route of [...services,'roof-inspection','contact','about','news/roof-repair-cost-perth']){
  const $=page(route);refineLocalContent($,route);const once=$.html();refineLocalContent($,route);
  assert.equal($.html(),once,route+' idempotence');
 }
});

test('About introduction consolidates the repeated defect list while retaining company and service information',()=>{
 const $=page('about'),intro=$('main > article').first();
 assert.doesNotMatch(intro.text(),/ceiling stains and rainwater entry/i,'intro must not repeat the detailed defect list');
 assert.match(intro.text(),/Perth Roof Care is operated by Ellis Services Group Pty Ltd/);
 assert.match(intro.text(),/roof repairs, leak investigation, tile and metal roof repairs, ridge capping, flashing, gutter and downpipe repairs, maintenance and inspections/i);
 assert.match($('main').text(),/140 St Georges Terrace, Perth WA 6000/);
 assert.ok($('main a[href^="https://abr.business.gov.au/"]').length,'company record retained');
 for(const route of ['roof-repairs','roof-leak-repairs','flashing-repairs','gutters-downpipes']){
  assert.ok($(`main a[href="/${route}/"]`).length,route+' essential service retained');
 }
});
