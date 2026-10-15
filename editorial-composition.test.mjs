import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';
import {serviceLabels} from './content/service-labels.mjs';
const page=r=>load(readFileSync(`public/${r?r+'/':''}index.html`,'utf8'));
const baseline=r=>load(execFileSync('git',['show',`c832b94:${r?r+'/':''}index.html`],{encoding:'utf8',maxBuffer:4*1024*1024}));
const routes=[...readFileSync('sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname.slice(1,-1));
test('service sections name their work and guide choices are limited without losing education',async()=>{
 const {educationalTopics}=await import('./content/keyword-map-content.mjs');
 const {topicGuide}=await import('./content/service-structure-data.mjs');
 for(const route of Object.keys(serviceLabels)){
  const $=page(route);for(const h of $('main h2,main h3').toArray())assert.doesNotMatch($(h).text(),/^(Service content|Our solution|Our work|Scope details|Further reading)$/i,route);
  assert.equal($('.service-description h3').length,0,route+' no repeated wrapper heading');
  assert.ok($('.service-reading a').length<=5,route+' at most four choices and full guide');
  assert.equal($('.service-related a[href^="/news/"]').length,0,route+' guides separate from related services');
 }
 for(const t of educationalTopics){const $=page('news/'+topicGuide[t.route]);assert.equal($(`#education-${t.id.toLowerCase()} p`).first().text(),t.body,t.id+' full original education');}
});
test('FAQ has one topic directory, merged questions, all meaningful aliases and synchronized schema',()=>{
 const $=page('faq'),old=baseline('faq');
 assert.ok($('main details').length<58,'overlapping questions consolidated');
 assert.equal($('.faq-topic-nav').length,1);assert.equal($('.faq-category').length,$('.faq-topic-nav a').length);
 const questions=$('main summary').map((_,e)=>$(e).text()).get();assert.equal(new Set(questions).size,questions.length);
 for(const e of old('main [id]').toArray()){const id=old(e).attr('id'),target=$(`[id="${id}"]`);assert.equal(target.length,1,id);assert.ok(target.text().trim().length>10,id+' meaningful alias');}
 // Literal facts reviewed independently against the original 58 answers.
 // Merged wording must retain these distinctions; all other answers stay verbatim.
 const merged=[
  [[2,3],'topic-q003',[/rain-related/i,/mark alone cannot identify/,/plumbing, equipment or condensation/,/when and where/]],
  [[4,5],'topic-q005',[/travel along connected materials/,/entry point and stain can differ/,/rather than.*directly above/]],
  [[6,7],'topic-q007',[/unresolved source.*connected defect.*changed conditions/,/Sealant cannot substitute/,/previous work records.*new leak timing/]],
  [[8,9,33],'topic-q009',[/Cracked, broken or displaced/,/water-entry path/,/replacement or repositioning/,/surrounding covering remains serviceable/,/profiles, fit and availability/]],
  [[18,55],'topic-q019',[/skylight unit, flashing, adjoining roof/,/indoor mark does not distinguish/,/separate specialist/,/not automatically include skylight replacement/]],
  [[19,36],'topic-q020',[/eaves and roof-space/,/Debris, restricted outlets, damaged joints, support problems and corrosion/,/gutter, outlet and downpipe/,/clearing alone may not resolve/]],
  [[20,57],'topic-q021',[/undertake box gutter repairs/,/Blockages, outlet restrictions, damaged material or drainage limitations/,/overflow route/,/scope and access are agreed/]],
  [[21,50,54],'topic-q022',[/cannot confirm or exclude/,/dry weather.*recent rain.*previous repairs/,/Condensation, plumbing and equipment/,/separate assessment/,/damaged electrical equipment/,/Do not enter a roof space/]],
  [[22,40],'topic-q023',[/Repair targets identified defects/,/Cleaning and coating preparation are separate/,/not automatically necessary for a local leak/,/before a finish/]],
  [[23,51],'topic-q024',[/covering a ceiling stain does not identify or correct/,/Investigate and repair/,/cleaning, preparation and spray-painting/]],
  [[28,39],'topic-q029',[/Record previous leaks/,/before winter/,/drainage clearing.*tiles, fixings, ridges and flashings/,/property condition determines/,/ground level/]],
  [[41,43],null,[/Photographs are optional/,/do not replace an on-site assessment/,/nearby section/,/do not climb/,/actual material and connections/]],
  [[44,45],null,[/supplied site photographs.*metal fasteners, ridge capping, chimney flashing.*drainage/,/completed work or project sequences/,/General guide imagery/,/not evidence of a job at your property/]]
 ];
 const mergedIndexes=new Set(merged.flatMap(([indexes])=>indexes));
 old('main details').each((i,e)=>{if(mergedIndexes.has(i))return;const q=old(e).find('summary').text(),answer=$('main details').filter((_,n)=>$(n).find('summary').text()===q);assert.equal(answer.length,1,q);old(e).find('p').each((_,p)=>{const copy=old(p).clone();copy.find('a').remove();assert.ok(answer.text().includes(copy.text().trim()),q+' original fact');});});
 for(const [indexes,id,facts] of merged){const answer=id?$(`[id="${id}"]`).closest('details'):$('main details').filter((_,n)=>facts[0].test($(n).text()));assert.equal(answer.length,1,'merged '+indexes);for(const fact of facts)assert.match(answer.text(),fact,'retained fact '+indexes);}
 const graph=JSON.parse($('script[type="application/ld+json"]').first().text())['@graph'];
 assert.deepEqual(graph.find(n=>n['@type']==='FAQPage').mainEntity.map(n=>({q:n.name,a:n.acceptedAnswer.text})),$('main details').map((_,e)=>({q:$(e).find('summary').text(),a:$(e).find('p').text()})).get());
});
test('News presents thirteen unique guides in one grouped directory',()=>{
 const $=page('news'),links=$('main a[href^="/news/"]').filter((_,e)=>!$(e).attr('href').includes('/feed.'));
 assert.equal(links.length,13);assert.equal(new Set(links.map((_,e)=>$(e).attr('href')).get()).size,13);
 assert.equal($('.guide-index').length,1);assert.ok($('.guide-index h2').length>=3);assert.equal($('main > .content-intent,main > #related-work-options').length,0);
 for(const a of links.toArray())assert.ok($(a).closest('article').find('p').text().length>40,'task-specific summary');
});

test('Gallery opens directly into project images with dates and every project record preserved',()=>{
 const $=page('gallery'),hero=$('main > section').first(),library=$('.case-library > .container');
 assert.equal(hero.find('h1').text(),'Roof repair projects');
 assert.equal(hero.find('p:not(.eyebrow)').length,1,'one concise introduction includes the existing project period');
 assert.match(hero.find('.project-period').text(),/Most of the projects in this collection were completed during 2025 and early 2026\./);
 assert.equal(library.children().first().hasClass('case-library-grid'),true,'no repeated title and introduction before the photographs');
 assert.match(library.find('.case-library-intro').text(),/not a price guide.*guarantee.*material, condition and access/);
 const old=load(execFileSync('git',['show','a33fb0c:gallery/index.html'],{encoding:'utf8',maxBuffer:4*1024*1024}));
 for(const selector of ['.case-library-card','title','meta[name="description"]','main [id]']){
  const collect=d=>d(selector).map((_,e)=>selector==='main [id]'?d(e).attr('id'):d.html(e)).get();
  assert.deepEqual(collect($),collect(old),selector+' facts, dates, images, URLs and identifiers stay intact');
 }
 for(const detail of ['tile and metal','ridge and hip capping','chimney flashing','fastener work','drainage maintenance'])assert.ok(hero.text().includes(detail),detail);
});

test('News reuses the compact index opening without changing guide records or metadata',()=>{
 const $=page('news'),hero=$('main > section').first();
 assert.equal(hero.hasClass('index-hero'),true);assert.equal(hero.find('h1').text(),'Roof repair guides');
 const old=load(execFileSync('git',['show','a33fb0c:news/index.html'],{encoding:'utf8',maxBuffer:4*1024*1024}));
 for(const selector of ['.guide-index article','title','meta[name="description"]','main [id]']){
  const collect=d=>d(selector).map((_,e)=>selector==='main [id]'?d(e).attr('id'):d.html(e)).get();
  assert.deepEqual(collect($),collect(old),selector+' preserved');
 }
 assert.equal(hero.find('p:not(.eyebrow)').text(),old('main > section').first().find('p:not(.eyebrow)').text(),'existing guide scope preserved');
});

test('service work sections and nested sequence headings have distinct labels',()=>{
 const normalize=text=>text.trim().toLowerCase().replace(/[.!?]+$/,'');
 for(const route of Object.keys(serviceLabels)){
  const $=page(route);
  $('main section').each((_,section)=>{
   const heading=$(section).find('h2').first();if(!heading.length)return;
   $(section).find('h3').each((_,child)=>assert.notEqual(normalize($(child).text()),normalize(heading.text()),route+' section and sequence: '+heading.text()));
  });
 }
});

test('final News cards contain one task summary and no service lead in an eyebrow',()=>{
 const $=page('news'),cards=$('.guide-index article');assert.equal(cards.length,13);
 cards.each((_,element)=>{
  const card=$(element),route=card.find('a').attr('href');
  assert.equal(card.find('p:not(.eyebrow)').length,1,route+' one summary');
  card.find('.eyebrow').each((_,label)=>{
   assert.ok($(label).text().trim().split(/\s+/).length<=6,route+' concise topic label');
   assert.ok($(label).text().length<=60,route+' short eyebrow');
  });
  assert.doesNotMatch(card.text(),/We trace roof leaks|completes (?:the )?required roof repairs|We inspect roof/i,route+' no duplicated service introduction');
 });
 assert.equal(new Set(cards.map((_,e)=>$(e).find('a').attr('href')).get()).size,13);
});
test('all routes have factual reviewed headings and decoded case names',()=>{
 assert.equal(routes.length,69);
 for(const route of routes){const $=page(route);for(const h of $('main h1,main h2,main h3,main summary').toArray()){
  const text=$(h).text();assert.doesNotMatch(text,/ROYLEYSTONE|&amp;|Service content|Our solution|Our work$|Scope details|A defined repair with a clear service connection|Practical answers from our roofing team|Need an answer for your particular roof|DIRECT LINKS TO/i,route+' '+text);
 }}
 assert.equal(page('')('main h1').text(),'Roof repairs in Perth');
 for(const route of ['news','gallery','services'])assert.equal(page(route)('main > section.content-intent').length,0,route+' no appended filler');
});
test('final editorial composition is idempotent with the production parser',async()=>{
 const {applyEditorialComposition}=await import('./content/editorial-composition.mjs');
 for(const route of routes){const $=load(readFileSync(`${route?route+'/':''}index.html`,'utf8'),{xml:{xmlMode:false,decodeEntities:false}});const before=$.html();applyEditorialComposition($,route);assert.equal($.html(),before,route);}
});
test('project labels describe the material and stage without repeated provenance framing',()=>{
 for(const route of routes){const $=page(route);for(const e of $('main .eyebrow,main figcaption').toArray())assert.doesNotMatch($(e).text(),/supplied composite|location not published|documented|record(?:ed|s)?\b/i,route+' '+$(e).text());}
 const tile=page('tile-roof-repairs')('#two-storey-access figcaption').text();assert.match(tile,/home.*ridge.*work-in-progress/i);assert.match(tile,/not a before-and-after comparison/);
});
test('directory assessment actions follow the inspection fee explanation',()=>{
 for(const route of ['services','news','gallery']){const main=page(route)('main').html();assert.ok(main.indexOf('Roof inspections are chargeable.')<main.indexOf('href="/contact/"'),route);}
});
