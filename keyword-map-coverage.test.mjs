import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
const page=r=>load(readFileSync(`public/${r}/index.html`,'utf8'));
test('all 30 educational topics have a service owner, full linked explanation and visible FAQ answer',async()=>{
 const {educationalTopics}=await import('./content/keyword-map-content.mjs');
 const {topicGuide}=await import('./content/service-structure-data.mjs');
 assert.equal(educationalTopics.length,30);
 const faq=page('faq');
 for(const t of educationalTopics){
  const $=page(t.route),prose=$(`.service-reading a[href="/news/${topicGuide[t.route]}/"]`);
  assert.equal(prose.length,1,t.id+' complete guide from service');
  assert.equal(prose.closest('details').length,0,t.id+' must not be FAQ-only');
  const target=new URL(prose.attr('href')+'#education-'+t.id.toLowerCase(),'https://www.perthroofcare.com.au');
  assert.equal(page(target.pathname.slice(1,-1))(target.hash).find('p').first().text(),t.body,t.id+' substantive explanation');
  assert.equal(faq(`#topic-${t.id.toLowerCase()}`).closest('details').length,1,t.id+' related surviving answer');
  assert.ok(faq(`#topic-${t.id.toLowerCase()} p`).text().length>60,t.id);
 }
});
test('cost guide is a separate, discoverable information page, not a price promise',()=>{
 const r='news/roof-repair-cost-perth', $=page(r);
 assert.equal($('main h1').length,1);
 assert.match($('title').text(),/roof repair cost/i);
 assert.match($('main').text(),/inspection fee/i);
 assert.doesNotMatch($('main').text(),/\$\s*\d|free inspection|24\/7/i);
 const sitemap=readFileSync('public/sitemap.xml','utf8');assert.ok(sitemap.includes(`/${r}/`));
 const feed=JSON.parse(readFileSync('public/news/feed.json','utf8'));assert.ok(feed.items.some(i=>i.url.endsWith(`/${r}/`)));
 for(const owner of ['roof-repairs','roof-leak-repairs','repair-options','news'])assert.ok(page(owner)(`main a[href="/${r}/"]`).length,owner);
});
test('content navigation is distinct from the collapsible mobile header menu',()=>{
 assert.equal(page('faq')('main nav.faq-topic-nav a').length,7);
 assert.match(readFileSync('refinement.css','utf8'),/main nav\.content-toc,main nav\.faq-topic-nav\{display:block\}/);
});
test('two-storey tile repair uses one complete composite rather than fabricated before and after',()=>{
 const $=page('tile-roof-repairs'),section=$('#two-storey-access');
 assert.equal(section.find('figure img').length,1);
 assert.match(section.find('figcaption').text(),/not a before-and-after comparison/);
 assert.match(section.find('img').attr('alt'),/Two-storey.*ridge joint/);
 assert.match(section.find('img').attr('srcset'),/\.webp/);
 assert.equal(section.find('img').attr('loading'),'lazy');
 assert.ok(section.find('a[href="/ridge-capping-repointing/"]').length);
});
test('Perth drainage photographs are allocated by visible components without completion claims',()=>{
 const used=[];
 for(const [route,id,count] of [['box-gutter-repairs','perth-box-gutter-work',4],['flat-roof-repairs','perth-roof-drainage-work',2],['strata-roof-repairs','perth-strata-drainage-work',2]]){
  const $=page(route),section=$(`#${id}`);
  assert.equal(section.find('img').length,count);
  assert.match(section.text(),/Perth/);
  assert.doesNotMatch(section.text(),/guaranteed|approved contractor|Dulux|10.year|fully waterproof/i);
  for(const img of section.find('img').toArray()){
   used.push($(img).attr('src'));
   assert.ok($(img).attr('alt').length>20);
   assert.match($(img).attr('srcset'),/\.webp/);
   assert.equal($(img).attr('loading'),'lazy');
  }
 }
 assert.equal(new Set(used).size,8);
 assert.match(page('flat-roof-repairs')('#perth-roof-drainage-work').text(),/Drainage condition/);
 assert.match(page('strata-roof-repairs')('#perth-strata-drainage-work').text(),/Confirm the authorised contact, access and scope/);
});
test('Perth strata gallery describes skylight addition and preserves original-photo display',()=>{
 const $=page('strata-roof-repairs'),section=$('#perth-strata-skylight-project');
 assert.equal(section.find('img').length,2);
 assert.match(section.text(),/adding a skylight.*existing metal roof/);
 assert.match(section.text(),/authorised contact, access and agreed work scope/);
 for(const img of section.find('img').toArray()){
  assert.match($(img).attr('srcset'),/\.webp/);
  assert.ok($(img).attr('alt').length>20);
  assert.equal($(img).attr('loading'),'lazy');
 }
 assert.match(readFileSync('refinement.css','utf8'),/#perth-strata-skylight-project .project-case-grid img\{aspect-ratio:3\/4;object-position:center\}/);
});
test('Perth whole-roof replacement gallery distinguishes construction from completion',()=>{
 const $=page('roof-replacement'),section=$('#perth-roof-replacement-project');
 assert.equal(section.find('img').length,3);
 assert.equal(new Set(section.find('img').map((_,e)=>$(e).attr('src')).get()).size,3);
 assert.match(section.find('h3').text(),/roof replacement.*(?:construction|work in progress)/i);
 assert.match(section.text(),/construction-stage records|photos were taken during the work/i);
 assert.match($('main').text(),/work in progress, not the finished roof/i);
 for(const img of section.find('img').toArray()){
  assert.ok($(img).attr('alt').length>20);
  assert.match($(img).attr('srcset'),/\.webp/);
  assert.equal($(img).attr('loading'),'lazy');
  assert.ok(Number($(img).attr('width'))>0&&Number($(img).attr('height'))>0);
 }
 assert.ok($('main .service-enquiry a[href="/contact/"]').length);
});
test('confirmed Perth gutter photographs retain accurate component captions',()=>{
 for(const route of ['gutter-repairs','gutters-downpipes']){
  const $=page(route),section=$('#perth-gutter-tile-project');
  assert.equal(section.find('img').length,4);
  assert.equal(new Set(section.find('img').map((_,e)=>$(e).attr('src')).get()).size,4);
  assert.match(section.text(),/roof tiles at the eaves/);
  assert.doesNotMatch(section.text(),/box gutter|before.and.after|same property|guaranteed/i);
  for(const img of section.find('img').toArray()){
   assert.ok($(img).attr('alt').length>20);
   assert.match($(img).attr('srcset'),/\.webp/);
   assert.equal($(img).attr('loading'),'lazy');
  }
 }
 assert.equal(page('box-gutter-repairs')('#perth-gutter-tile-project').length,0);
});
test('confirmed Perth cleaning and painting photos are distinct and accurately labelled',()=>{
 for(const [route,count] of [['roof-cleaning',1],['roof-painting',3],['roof-cleaning-painting',4]]){
  const $=page(route),section=$('#perth-cleaning-painting-project');
  assert.equal(section.find('img').length,count,route);
  assert.equal(new Set(section.find('img').map((_,e)=>$(e).attr('src')).get()).size,count);
  assert.match(section.text(),/Perth/);
  assert.doesNotMatch(section.text(),/before.and.after|spray painting in progress|guaranteed/i);
  for(const img of section.find('img').toArray()){
   assert.ok($(img).attr('alt').length>20);assert.ok($(img).attr('width'));assert.ok($(img).attr('height'));
   assert.match($(img).attr('srcset'),/\.webp/);assert.equal($(img).attr('loading'),'lazy');
  }
 }
});
