import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';
const expected={ 'roof-repairs':6,'roof-leak-repairs':6,'tile-roof-repairs':7,'metal-roof-repairs':8,'ridge-capping-repointing':6,'flashing-repairs':6,'gutter-repairs':10,'gutters-downpipes':4,'downpipe-repairs':0,'roof-maintenance':6,'roof-cleaning-painting':4,'commercial-roof-repairs':0,'storm-damage-roof-repairs':6,'roof-restoration':0,'roof-inspection':6,'repair-options':0,'roof-cleaning':1,'roof-painting':3,'box-gutter-repairs':4,'roof-replacement':3,'flat-roof-repairs':2,'strata-roof-repairs':4};
const page=r=>load(readFileSync(`public/${r?`${r}/`:''}index.html`,'utf8'));
const baseline=r=>load(execFileSync('git',['show',`3b9fbbb:${r?`${r}/`:''}index.html`],{encoding:'utf8',maxBuffer:4*1024*1024}));
const words=$=>$('main').text().trim().split(/\s+/).length;
test('22 service routes expose one compact flow with evidence only where it exists',()=>{
 for(const [route,count] of Object.entries(expected)){
  const $=page(route);
  assert.deepEqual($('main > section > .container > h2').map((_,e)=>$(e).text()).get(),['Service content','Our solution',...(count?['Our work']:[])],route);
  assert.equal($('main > section').length,count?4:3,route+' compact hero plus approved sections');
  assert.equal($('main .service-brief-enquiry,main .audit-quote-scope,main .service-path').length,0,route+' repeated bands retired');
  assert.equal($('[data-service-section="work"] img').length,count,route+' unique matching evidence');
  assert.equal($('main .service-enquiry a[href="/contact/"]').length,1,route+' final action');
  assert.equal($('main a[href="/contact/"]').length,1,route+' no repeated booking bands');
  assert.equal($('main h2').length,count?3:2,route+' no nested giant sections');
  for(const h of $('main h1,main h2,main h3').toArray())assert.doesNotMatch($(h).text(),/Perth/i,route);
  assert.ok(words($)<words(baseline(route))*.85,route+' actual prose consolidation');
 }
});
test('every original service anchor resolves to meaningful content and original photos keep captions',()=>{
 for(const route of Object.keys(expected)){
  const before=baseline(route),$=page(route);
  for(const e of before('main [id]').toArray()){
   const id=before(e).attr('id'),target=$(`[id="${id}"]`);
   assert.equal(target.length,1,route+' #'+id);assert.ok(target.text().trim().length>4,route+' meaningful #'+id);
   assert.equal(target.is('[hidden],[aria-hidden="true"]'),false,route+' exposed #'+id);
  }
  for(const img of before('main img').toArray()){
   const src=before(img).attr('src'),after=$(`main img[src="${src}"]`);
   assert.equal(after.length,1,route+' '+src);
   assert.equal(after.closest('figure').find('figcaption').text(),before(img).closest('figure').find('figcaption').text(),route+' caption '+src);
  }
 }
});
test('full education remains at linked public targets and owners retain exactly one topic link',async()=>{
 const {educationalTopics}=await import('./content/keyword-map-content.mjs');
 for(const t of educationalTopics){
  const owner=page(t.route),link=owner(`[data-topic="${t.id}"] a`);assert.equal(link.length,1,t.id);
  const url=new URL(link.attr('href'),'https://www.perthroofcare.com.au');assert.ok(url.pathname.startsWith('/news/'),t.id+' existing guide');
  const target=page(url.pathname.slice(1,-1))(url.hash);assert.equal(target.length,1,t.id+' target');
  assert.equal(target.find('p').first().text(),t.body,t.id+' original full authoritative text');
  assert.equal(target.closest('details').length,0,t.id+' visible explanation');
 }
});
test('fastener About handoff is a separate honest metal case and absent from About',()=>{
 const $=page('metal-roof-repairs'),story=$('#metal-fastener-project');
 assert.match(story.text(),/corroded fastener details.*repair work.*completed roof views/);
 for(const name of ['metal-fastener-sequence-04-fastener-work.png','metal-fastener-sequence-05-completed.png']){
  assert.equal(story.find(`img[src="/assets/images/${name}"]`).length,1);
  assert.equal(page('about')(`main img[src="/assets/images/${name}"]`).length,0);
 }
 assert.equal(story.find('a[href="/projects/metal-roof-fastener-repair-sequence/"]').length,1);
});
test('homepage and services index keep core navigation, real evidence and one short contact action',()=>{
 for(const route of ['','services']){
  const $=page(route);assert.equal($('main .home-enquiry').length,0);
  assert.equal($('main .home-service-map').length,1);assert.ok($('main .home-proof img').length);
  assert.equal($('main .hub-enquiry a[href="/contact/"]').length,1);
  assert.equal($('main .additional-service-paths').length,0);
 }
});

test('the terminal consolidation is idempotent with the production parser',async()=>{
 const {applyServiceStructure}=await import('./content/service-structure.mjs');
 for(const route of [...Object.keys(expected),'','services','news/roof-leak-detection-perth']){
  const $=load(readFileSync(`${route?`${route}/`:''}index.html`,'utf8'),{xml:{xmlMode:false,decodeEntities:false}});
  const before=$.html();applyServiceStructure($,route);assert.equal($.html(),before,route+' stable reapplication');
 }
});

test('inspection credit remains a booking question rather than an invented business policy',()=>{
 const text=page('roof-repairs')('.service-boundary').text();
 assert.doesNotMatch(text,/no[^.]*inspection credit is offered/i);
 assert.match(text,/credit.*confirm|confirm.*credit/i);
});
