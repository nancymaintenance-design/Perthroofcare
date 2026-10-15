import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {load} from 'cheerio';
import {spawnSync,execFileSync} from 'node:child_process';
import {serviceLabels} from './content/service-labels.mjs';
const routes=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const page=r=>load(readFileSync(`public${r}index.html`,'utf8'));
const nodes=$=>$('script[type="application/ld+json"]').toArray().flatMap(e=>{const n=JSON.parse($(e).text());return n['@graph']||[n];});

// Reintroducing question headings, a generic heading fallback or stale FAQ
// schema must fail on the generated publication output, not source strings.
test('all 69 routes publish declarative topic headings except the actual FAQ',()=>{
 assert.equal(routes.length,69);
 const generic=/^(?:Start with the roof detail you can see|Use the project detail to compare the work, not just the finish|A useful starting point for this property|Explore the related work|Questions before booking|Discuss your property and the next step|What to compare in a roof repair quote)\.?$/i;
 for(const r of routes){const $=page(r);assert.equal($('main h1').length,1,r);
  assert.equal($('link[rel="canonical"]').attr('href'),'https://www.perthroofcare.com.au'+r);
  for(const e of $('main h1,main h2,main h3,main summary').toArray())assert.doesNotMatch($(e).text(),generic,r+' '+$(e).text());
  if(r==='/faq/')continue;
  assert.doesNotMatch($('title').text(),/\?|^(?:what|why|how|can|does|do|is|are|when|which|who|should)\b/i,r+' declarative title');
  for(const e of $('main h1,main h2,main h3,main summary').toArray()){
   const t=$(e).text();assert.doesNotMatch(t,/\?|^(?:what|why|how|can|does|do|is|are|when|which|who|should)\b/i,r+' '+t);
   assert.doesNotMatch(t,generic,r+' '+t);
  }
  assert.ok(!nodes($).some(n=>n['@type']==='FAQPage'),r+' declarative disclosures are not FAQs');
  for(const e of $('main details').toArray())assert.ok($(e).find('p').text().length>30,r+' retained answer');
  const k=JSON.parse($('#page-knowledge').text());assert.deepEqual(k.questions,[],r+' no invented questions');
 }
});

test('FAQ related repair heading is descriptive while all questions, answers and publication dates survive',()=>{
 const $=page('/faq/'),before=load(execFileSync('git',['show','ab6ea8f:faq/index.html'],{encoding:'utf8',maxBuffer:4*1024*1024}));
 assert.ok($('main h2').toArray().some(e=>$(e).text()==='Roof repairs and inspections'));
 const disclosures=p=>p('main details').map((_,e)=>({question:p(e).find('summary').text(),answer:p(e).find('p').text()})).get();
 assert.equal(disclosures($).length,58);assert.deepEqual(disclosures($),disclosures(before));
 assert.deepEqual(nodes($).find(n=>n['@type']==='FAQPage'),nodes(before).find(n=>n['@type']==='FAQPage'));
 const current=nodes($).find(n=>n['@type']==='WebPage'),original=nodes(before).find(n=>n['@type']==='WebPage');
 assert.equal(current.dateModified,'2026-10-14');assert.equal(current.datePublished,original.datePublished);
});

test('all routes use concise component headings without assembled topic suffixes',()=>{
 const filler=/ — (?:causes and repair decisions|connected service scopes|service guidance|assessment arrangements|quote inclusions|inspection and work scope|practical guidance|repairs and assessment|components we assess|property details|enquiry information|inspection details)$| for another property$/i;
 for(const r of routes){const $=page(r);for(const e of $('main h1,main h2,main h3,main summary').toArray())assert.doesNotMatch($(e).text(),filler,r+' '+$(e).text());}
 // Independent, paragraph-reviewed examples catch replacement by empty labels.
 for(const [route,headings] of [
  ['/roof-leak-repairs/',['Rain patterns and indoor water marks','Our solution','Tiled-roof leak repair sequence']],
  ['/areas/hillarys-roof-repairs/',['Roof material and visible damage','Fixings, capping and rainwater drainage','Arrange a roof assessment']],
  ['/news/roof-inspection-perth-guide/',['Inspection findings and maintenance priorities','Roof inspection and drainage repair records','Inspection fees and agreed access']]
 ]){const $=page(route),actual=$('main h2,main h3').map((_,e)=>$(e).text()).get();for(const heading of headings)assert.ok(actual.includes(heading),route+' missing '+heading);}
});

test('consolidated services leave unrelated prose and existing guide bodies intact',()=>{
 const prose=($,selector)=>$(selector).map((_,e)=>{const copy=$(e).clone();copy.find('a').text('[link]');return copy.text();}).get();
 const extract=$=>({
  paragraphs:prose($,'main p:not(.topic-rail .eyebrow,.services-directory .eyebrow)'),
  answers:prose($,'main details'),
  images:$('main img').map((_,e)=>$(e).attr('src')).get(),
  links:$('main a').map((_,e)=>$(e).attr('href')).get(),
  anchors:$('main [id]').map((_,e)=>$(e).attr('id')).get(),
  topics:$('main [data-topic]').map((_,e)=>$(e).attr('data-topic')).get()
 });
 for(const r of routes){if(r==='/about/'||r==='/'||r==='/services/'||serviceLabels[r.slice(1,-1)])continue; // Approved compositions have independent evidence/anchor checks.
  const before=load(execFileSync('git',['show','ab6ea8f:'+(r==='/'?'':r.slice(1))+'index.html'],{encoding:'utf8',maxBuffer:4*1024*1024}));
  const current=page(r);current('.guide-education').remove();
  assert.deepEqual(extract(current),extract(before),r);
  if(!serviceLabels[r.slice(1,-1)])assert.equal(page(r)('main h1').text(),r==='/faq/'?'Roof repair FAQs':before('main h1').text(),r+' identity or approved compact FAQ heading');
 }
});

test('leak, tile, ridge, area and project guidance retains its particular decision',()=>{
 const leak=page('/news/roof-leak-detection-perth/');
 assert.match(leak('#education-q001 h3').text(),/heavy.rain.*leak|leak.*heavy.rain/i);
 assert.match(leak('#education-q007 h3').text(),/recurring.*leak|leak.*repair/i);
 assert.match(leak('#education-q007 p').text(),/earlier scope.*weather pattern/);
 assert.match(page('/tile-roof-repairs/')('[data-topic="Q010"] a').text(),/individual.*tile|local.*tile/i);
 assert.match(page('/ridge-capping-repointing/')('[data-topic="Q011"] a').text(),/repointing.*rebedding/i);
 assert.match(page('/areas/hillarys-roof-repairs/')('.content-intent h3').text(),/wind.driven.*rain/i);
 assert.match(page('/projects/metal-roof-ridge-capping-repair-perth/')('.content-intent h2').text(),/metal.*ridge.*capping/i);
});

test('generated leak navigation uses both concise ampersand service names',()=>{
 const $=page('/roof-leak-repairs/');
 for(const [href,label] of [
  ['/flashing-repairs/','Roof valleys & flashing repairs'],
  ['/gutters-downpipes/','Gutters & downpipes']
 ]){
  const links=$(`[data-service-section="solution"] .service-related li a[href="${href}"]`);
  assert.ok(links.length,href+' contextual link remains present');
  links.each((_,e)=>assert.equal($(e).text(),label,href+' generated navigation name'));
 }
});

test('all 30 educational answers survive the declarative pass with their FAQ originals',async()=>{
 const {educationalTopics}=await import('./content/keyword-map-content.mjs');assert.equal(educationalTopics.length,30);
 const faq=page('/faq/'),schema=nodes(faq).find(n=>n['@type']==='FAQPage');
 for(const t of educationalTopics){const $=page('/'+t.route+'/');
  const target=new URL($(`[data-topic="${t.id}"] a`).attr('href'),'https://www.perthroofcare.com.au');
  assert.equal(page(target.pathname)(target.hash).find('p').first().text(),t.body,t.id+' full explanation at linked guide');
  assert.equal(faq(`#topic-${t.id.toLowerCase()} summary`).text(),t.q,t.id+' FAQ retained');
  assert.ok(schema.mainEntity.some(n=>n.name===t.q&&n.acceptedAnswer.text.includes(t.a)),t.id+' schema parity');
 }
});

test('shared contact heading and menu present the roof repair service directly',()=>{
 for(const r of routes){const $=page(r);
  if(r==='/about/')assert.equal($('.contact-band').length,0,'About keeps registration above the actual footer');
  else assert.match($('.footer-cta h2,.contact-band h2,.cta-band h2').text()||$('h2').last().text(),/Perth roof repair enquir/i,r);
  assert.doesNotMatch($('.services-panel-intro').text(),/Need help choosing\?/);
 }
});

test('service hubs and regional copy explain our work without generic reader instructions',()=>{
 for(const r of ['/services/','/service-areas/','/roof-cleaning/','/repair-options/','/areas/cottesloe-roof-repairs/']){
  const $=page(r);
  const prose=$('main p').filter((_,e)=>!$(e).is('.eyebrow')&&!$(e).closest('form,details,[data-topic]').length&&$(e).clone().find('a').remove().end().text().trim().length>30).map((_,e)=>$(e).text()).get();
  for(const text of prose)assert.doesNotMatch(text,/^(?:Choose|Start with|Use the (?:linked|form|suburb)|Compare|Check that)\b/i,r+' '+text);
  assert.ok($('main a[href="/contact/"],main a[href="/roof-inspection/"]').length,r+' assessment path survives');
 }
});

test('heading inventory covers the approved baseline and every route with separated summaries',()=>{
 const generated=spawnSync(process.execPath,['tools/heading-inventory.mjs'],{encoding:'utf8'});
 assert.equal(generated.status,0,generated.stderr);
 const file='../reports/2026-10-14-content-ui-refresh/heading-changes.json';
 assert.ok(existsSync(file),'durable heading inventory missing');
 const inventory=JSON.parse(readFileSync(file,'utf8'));
 assert.equal(inventory.baselineCommit,'4b3e765');assert.equal(inventory.routes.length,69);
 for(const entry of inventory.routes){assert.ok(routes.includes(entry.route),entry.route);
  assert.ok(entry.before.title&&entry.after.title,entry.route+' title');
  assert.ok(entry.before.headings.length&&entry.after.headings.length,entry.route+' headings');
  assert.ok(Array.isArray(entry.before.summaries)&&Array.isArray(entry.after.summaries),entry.route+' summaries');
  if(entry.route!=='/faq/')assert.equal(entry.after.questionCounts.total,0,entry.route);
 }
 assert.ok(inventory.routes.filter(e=>e.route!=='/faq/').some(e=>e.before.questionCounts.total>0),'question baseline is recorded');
});

test('the 172 keyword records keep their canonical owners and condition boundaries',()=>{
 const map=readFileSync('docs/seo/perth-roof-care/2026-10-10-content-keyword-map.md','utf8');
 const records=[...map.matchAll(/^\| ([KIDSQ]\d{3}) \| (.*?) \| (.*?) \| (.*?) \|\r?$/gm)];
 assert.equal(records.length,172);assert.equal(new Set(records.map(r=>r[1])).size,172);
 for(const [,id,,rawOwner] of records){const owner=rawOwner.replaceAll('`','');if(owner.startsWith('/'))assert.ok(routes.includes(owner),id+' canonical owner '+owner);}
 assert.match(records.find(r=>r[1]==='K089')[4],/许可|不|专项/,'asbestos remains conditional');
});
