import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { load } from 'cheerio';
const root=fileURLToPath(new URL('./public/',import.meta.url));
const routes=[...readFileSync(join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const pages=new Map(routes.map(r=>[r,load(readFileSync(join(root,r,'index.html'),'utf8'))]));
const guides=['roof-leak-detection-perth','tile-roof-repairs-perth-guide','metal-roof-repairs-perth-guide','ridge-capping-repairs-perth-guide','roof-valleys-flashing-repairs-perth','roof-inspection-perth-guide'];
test('project service links sit in a full-width section instead of a nested split grid',()=>{
 for(const [route,d] of pages){if(!route.startsWith('/projects/'))continue;
  assert.equal(d('main.project-page').length,1,route);
  const related=d('.project-services');assert.equal(related.length,1,route);
  assert.equal(related.find('.container.grid').length,0,route);
  assert.ok(related.find('a[href="/contact/"]').length,route);
  assert.ok(related.find('a[href$="-repairs/"]').length,route);
  assert.equal(related.find('nav').length,1,route);
  assert.ok(d('.project-photos figure').length>=4,route);
 }
});
test('revised guide feed modification dates agree with visible updates',()=>{
 const feed=JSON.parse(readFileSync(join(root,'news/feed.json'),'utf8'));
 for(const slug of guides){const item=feed.items.find(i=>i.url.endsWith('/news/'+slug+'/'));assert.equal(item.date_modified?.slice(0,10),'2026-10-10',slug);}
});
test('revised guides have matching feed summaries and reciprocal service paths',()=>{
 const feed=JSON.parse(readFileSync(join(root,'news/feed.json'),'utf8'));
 const services=['roof-leak-repairs','tile-roof-repairs','metal-roof-repairs','ridge-capping-repointing','flashing-repairs','roof-inspection'];
 guides.forEach((slug,i)=>{const d=pages.get('/news/'+slug+'/');const item=feed.items.find(i=>i.url.endsWith('/news/'+slug+'/'));assert.equal(item.summary,d('meta[name="description"]').attr('content'),slug);assert.ok(pages.get('/'+services[i]+'/')('main a[href="/news/'+slug+'/"]').length,slug);});
 assert.ok(pages.get('/news/roof-inspection-perth-guide/')('main a[href="/roof-maintenance/"]').length);
});
test('service hub includes urgent repairs and does not publish internal SEO planning',()=>{
 const d=pages.get('/services/');assert.ok(d('main a[href="/storm-damage-roof-repairs/"]').length);
 assert.ok(d('.home-proof a[href^="/projects/"]').length,'service directory evidence keeps its project link');
 assert.doesNotMatch(d('main').text(),/Six focused|PRIMARY ROOF REPAIR INTENT|disconnected project hub/i);
 assert.doesNotMatch(pages.get('/roof-repairs/')('main').text(),/page compete|broad search term/i);
});
test('FAQ provides service-linked answers rather than an unlinked reading directory',()=>{
 const d=pages.get('/faq/');assert.match(d('h1').text(),/Roof Repairs Perth/i);
 for(const r of ['/roof-leak-repairs/','/tile-roof-repairs/','/metal-roof-repairs/','/storm-damage-roof-repairs/','/roof-inspection/','/roof-maintenance/'])assert.ok(d('details a[href="'+r+'"]').length,r);
 assert.doesNotMatch(d('main').text(),/general reading resource|not to diagnose|clearer reading/i);
});
test('six guides have topic-specific multi-paragraph sections, evidence links and no false feedback headings',()=>{
 const headings=[];
 for(const slug of guides){const d=pages.get('/news/'+slug+'/');
  assert.ok(d('.guide-topic').length>=4,slug);assert.ok(d('.guide-topic').toArray().every(e=>d(e).children('p').length>=2),slug);
  assert.ok(d('main a[href^="/projects/"]').length,slug);
  assert.doesNotMatch(d('main').text(),/Customer feedback and returning clients|What to record before a repair enquiry/i);
  for(const s of d('.guide-topic').toArray()){const h=d(s).find('h2').text();headings.push(h);if(!h.endsWith('?'))assert.doesNotMatch(d(s).children('p').first().text(),/^Yes[,.]/);}
 }
 assert.equal(new Set(headings).size,headings.length,'guide topics should not be generic repeated headings');
});
test('descriptions are globally unique complete summaries',()=>{
 const seen=new Map();for(const [r,d] of pages){const t=d('meta[name="description"]').attr('content');assert.ok(t,r);assert.ok(!seen.has(t),r+' duplicates '+seen.get(t));seen.set(t,r);assert.doesNotMatch(t,/Contact Ellis S(?:e|er)$/);}
});
test('inspection and CBD titles declare their distinct service area roles',()=>{
 assert.doesNotMatch(pages.get('/roof-inspection/')('h1').text(),/maintenance/i);
 assert.match(pages.get('/areas/perth-roof-repairs/')('h1').text(),/CBD/i);
});
test('core repairs explain work and completion in addition to enquiry preparation',()=>{
 for(const r of ['/roof-repairs/','/roof-leak-repairs/','/tile-roof-repairs/','/metal-roof-repairs/','/storm-damage-roof-repairs/']){
 const d=pages.get(r);assert.ok(d('.repair-delivery').length,r);assert.ok(d('.repair-delivery li').length>=3,r);assert.doesNotMatch(d('.service-brief-copy').text(),/should be discussed|repair question|repair conversation/i);
 }
});
test('FAQ machine answers and article metadata follow the revised visible content',()=>{
 for(const [r,d] of pages){const graph=JSON.parse(d('script[type="application/ld+json"]').text())['@graph'];const faqs=d('main details').toArray();const node=graph.find(n=>n['@type']==='FAQPage');
 if(faqs.length)assert.deepEqual(node.mainEntity.map(q=>q.acceptedAnswer.text),faqs.map(e=>d(e).find('p').text()));
 if(r.startsWith('/news/')&&r!=='/news/'){const a=graph.find(n=>n['@type']==='Article');assert.equal(a.description,d('meta[name="description"]').attr('content'),r);}
 }
});
test('case pages preserve images and describe components without malformed warranty boilerplate',()=>{
 for(const [r,d] of pages){if(!r.startsWith('/projects/'))continue;assert.ok(d('main img').length>=4,r);assert.doesNotMatch(d('main').text(),/tailored to the property, price, warranty|FOUR PHOTOGRAPHS OF ONE|LOCATION NOT PUBLISHED/i);}
});
test('every project publishes a substantial distinct story while preserving its photo sequence',()=>{
 const seen=new Set();for(const [r,d] of pages){if(!r.startsWith('/projects/'))continue;
 const story=d('.project-story');assert.equal(story.length,1,r);assert.equal(story.find('.project-story-topic').length,4,r);
 const text=story.find('p').map((i,e)=>d(e).text()).get().join(' ');assert.ok(text.split(/\s+/).length>=180,r);assert.ok(!seen.has(text),r);seen.add(text);
 assert.ok(d('main img').length>=4,r);assert.doesNotMatch(d('main').text(),/The project location is not published|not a template|organise a clear question/i);
 }
});
test('case-story machine data and feed reproduce visible narratives without assigning guessed construction dates',()=>{
 const feed=JSON.parse(readFileSync(join(root,'case-studies.json'),'utf8'));
 for(const [r,d] of pages){if(!r.startsWith('/projects/'))continue;const graph=JSON.parse(d('script[type="application/ld+json"]').text())['@graph'];const story=graph.find(n=>n['@type']==='CreativeWork'&&n['@id'].endsWith('#project-story'));assert.ok(story,r);
 assert.equal(story.text,d('.project-story-topic p').map((i,e)=>d(e).text()).get().join('\n\n'),r);
 assert.equal(story.description,d('meta[name="description"]').attr('content'),r);assert.equal(story.dateCreated,undefined,r);
 const item=feed.items.find(i=>new URL(i.url).pathname===r);assert.ok(item.content_text.includes(d('.project-story-topic p').first().text()),r);assert.equal(item.summary,story.description,r);assert.equal(item.date_modified.slice(0,10),'2026-10-09',r);
 }
 assert.match(pages.get('/gallery/')('main').text(),/Most of the projects.*2025.*early 2026/i);
});
