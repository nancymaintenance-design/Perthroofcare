import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';

const page=r=>load(readFileSync(`public/${r}/index.html`,'utf8'));
const services=['roof-cleaning','roof-painting','box-gutter-repairs','roof-replacement','flat-roof-repairs','strata-roof-repairs'];

// Booking links remain available without shared inspection billing boilerplate.
for(const route of [...services,'roof-inspection','contact']) test(`${route}: booking remains available without repeated inspection billing`,()=>{
 const $=page(route),container=$('main');
 assert.equal(container.find('.inspection-charge-notice').length,0,route);
 assert.ok(container.find('a[href="/contact/"],a[href="#enquiry"],a[href^="tel:"]').length,route+' booking action');
 if(route==='contact')assert.equal(container.find('form button[type="submit"]').length,1);
});

test('six service scopes explain distinct component decisions without unconfirmed company methods',()=>{
 const expectations={
  'roof-cleaning':[/Cleaning removes dirt, deposits and debris/i,/does not repair broken tiles/i,/painting is also agreed/i],
  'roof-painting':[/old coating/i,/clean.*before spray painting/i,/roof material.*previous coating.*paint products/i],
  'box-gutter-repairs':[/outlet/i,/joint/i,/overflow route/i],
  'roof-replacement':[/local repair|replacing a few damaged sheets/i,/retained|which can stay/i,/concealed|damage that was hidden/i],
  'flat-roof-repairs':[/covering/i,/drainage/i,/roof openings/i],
  'strata-roof-repairs':[/permission/i,/authorised contact/i,/who can approve repairs/i]
 };
 const scopes=[];
 for(const [route,patterns] of Object.entries(expectations)){
  const $=page(route),scope=$('[id^="scope-"]').text();scopes.push(scope);
  assert.ok(scope.length>650,route+' consolidated assessment and selection detail');
  patterns.forEach(pattern=>assert.match(scope,pattern,route));
  assert.doesNotMatch(scope,/we (?:test|flush|prime|coat|install|seal)|Dulux|guaranteed|\$\d/i);
 }
 assert.equal(new Set(scopes).size,6);
});

test('metadata is concise and cost guide promises quote factors, retaining original brand relationship',()=>{
 const about=page('about');
 assert.equal(about('title').text(),'About Ellis Services Group | Perth Roof Care');
 assert.match(about('main').text(),/Perth Roof Care is operated by Ellis Services Group Pty Ltd/);
 const cost=page('news/roof-repair-cost-perth');
 assert.match(cost('title').text(),/Roof Repair Cost Factors Perth/);
 assert.match(cost('.article-lead').text(),/quote.*assessment.*defect.*materials.*access/i);
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
  assert.doesNotMatch(context.text(),/the guide explains the component and decision|does not establish the condition of this property/i,area+' focused component link');
 }
});

test('refined service copy names work and photo stages directly while retaining their limits',()=>{
 for(const route of services){
  const scope=page(route)('[id^="scope-"]').text();
  assert.doesNotMatch(scope,/our confirmed sequence|read the finished-roof photographs accurately|supplied (?:gallery|photographs|set|finished-roof|Perth strata project)|one confirmed Perth project|this confirms the work shown/i,route+' customer-facing wording');
 }
 assert.match(page('roof-cleaning')('#scope-1').text(),/spray painting is also agreed, we clean the roof first/i);
 assert.match(page('roof-painting')('#scope-2').text(),/we clean.*before spray painting/i);
 assert.match(page('roof-painting')('#scope-3').text(),/after spray painting/i);
 assert.match(page('roof-replacement')('#scope-3').text(),/construction.stage|work in progress, not the finished roof/i);
 assert.match(page('strata-roof-repairs')('#perth-strata-skylight-project').text(),/added a skylight.*existing metal roof/i);
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
 const {topicGuide}=await import('./content/service-structure-data.mjs');
 const $=page('faq'),graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
 const schema=graph.find(n=>n['@type']==='FAQPage');assert.equal(educationalTopics.length,30);
 for(const topic of educationalTopics){
  assert.equal(page(topic.route)(`.service-reading a[href="/news/${topicGuide[topic.route]}/"]`).length,1);
  assert.equal(page('news/'+topicGuide[topic.route])(`#education-${topic.id.toLowerCase()} p`).first().text(),topic.body);
  const detail=$(`#topic-${topic.id.toLowerCase()}`).closest('details'),entry=schema.mainEntity.find(q=>q.name===detail.find('summary').text());
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
 const $=page('about'),intro=$('.about-company-hero');
 assert.doesNotMatch(intro.text(),/ceiling stains and rainwater entry/i,'intro must not repeat the detailed defect list');
 assert.match(intro.text(),/Perth Roof Care is operated by Ellis Services Group Pty Ltd/);
 assert.match(intro.text(),/roof leaks, damaged tiles, metal sheets and fixings, ridge capping, flashing, gutters and downpipes/i);
 assert.match($('footer').text(),/140 St Georges Terrace, Perth WA 6000/,'shared footer retains the confirmed office');
 assert.ok($('main a[href^="https://abr.business.gov.au/"]').length,'company record retained');
 assert.equal($('main [data-about-section="services"] a[href="/services/"]').length,1,'brief company capability overview links to the services directory');
});
