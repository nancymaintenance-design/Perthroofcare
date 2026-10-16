import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';
const expected={ 'roof-repairs':6,'roof-leak-repairs':6,'tile-roof-repairs':7,'metal-roof-repairs':8,'ridge-capping-repointing':6,'flashing-repairs':6,'gutter-repairs':10,'gutters-downpipes':4,'downpipe-repairs':0,'roof-maintenance':6,'roof-cleaning-painting':4,'commercial-roof-repairs':0,'storm-damage-roof-repairs':6,'roof-restoration':0,'roof-inspection':6,'repair-options':0,'roof-cleaning':1,'roof-painting':3,'box-gutter-repairs':4,'roof-replacement':3,'flat-roof-repairs':2,'strata-roof-repairs':4};
const page=r=>load(readFileSync(`public/${r?`${r}/`:''}index.html`,'utf8'));
const baseline=r=>load(execFileSync('git',['show',`3b9fbbb:${r?`${r}/`:''}index.html`],{encoding:'utf8',maxBuffer:4*1024*1024}));
const words=$=>$('main').text().trim().split(/\s+/).length;
const approvedCaptions={
  "Recorded fastener work": "Fastener repair work",
  "Opened tile-area record": "Opened tile area",
  "Ridge-detail record": "Ridge repair detail",
  "Completed roof record": "Completed roof view",
  "Two-storey repair project: the supplied composite shows the home and a close-up of work at the ridge tile joint. These are context and work-in-progress views, not a before-and-after comparison.": "Two-storey home and ridge-joint repair: context and work-in-progress views, not a before-and-after comparison.",
  "Overall metal-roof record after work": "Overall metal roof after work",
  "Fastener work in progress in the same recorded project.": "Metal roof fastener work in progress.",
  "Completed roof view from the recorded fastener repair project.": "Completed roof after fastener repairs.",
  "Work-sequence record": "Valley and flashing work",
  "After-work record": "Valley and flashing after work",
  "Wider roof view from the supplied eaves tile repair records.": "Wider roof view of the eaves tile repair.",
  "Local repair record": "Local tile-junction repair",
  "Roof-void interior record": "Roof-void interior",
  "Overall roof record after maintenance": "Overall roof after maintenance",
  "Completed roof surface after the recorded work": "Completed roof surface after fastener work",
  "Work around metal roof fastener points during the recorded repair. Explore the project photographs.": "Metal roof fastener work in progress. Explore the project photographs.",
  "Flashing connection recorded during a roof inspection. Explore the project photographs.": "Flashing connection during roof inspection. Explore the project photographs."
};
test('22 service routes expose one compact flow with evidence only where it exists',()=>{
 for(const [route,count] of Object.entries(expected)){
  const $=page(route);
  assert.deepEqual($('main > section[data-service-section]').map((_,e)=>$(e).attr('data-service-section')).get(),['content','solution',...(count?['work']:[])],route);
  for(const h of $('main > section > .container > h2').toArray())assert.ok($(h).text().length>12,route+' substantive section name');
  assert.equal($('main > section').length,count?4:3,route+' compact hero plus approved sections');
  assert.equal($('main .service-brief-enquiry,main .audit-quote-scope,main .service-path').length,0,route+' repeated bands retired');
  assert.equal($('[data-service-section="work"] img').length,count,route+' unique matching evidence');
  assert.equal($('main .service-enquiry a[href="/contact/"]').length,1,route+' final action');
  assert.equal($('main a[href="/contact/"]').length,2,route+' opening shortcut and final enquiry only');
  assert.equal($('main .service-hero a[href="/contact/"]').length,1,route+' opening assessment shortcut');
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
   const original=before(img).closest('figure').find('figcaption').text();
   assert.equal(after.closest('figure').find('figcaption').text(),approvedCaptions[original]||original,route+' stage-preserving caption '+src);
  }
 }
});
test('full education remains at linked guide targets and owners keep the full guide reachable',async()=>{
 const {educationalTopics}=await import('./content/keyword-map-content.mjs');
 const {topicGuide}=await import('./content/service-structure-data.mjs');
 for(const t of educationalTopics){
  const owner=page(t.route),guide=topicGuide[t.route],link=owner(`.service-reading a[href="/news/${guide}/"]`);assert.equal(link.length,1,t.id+' full guide');
  const url=new URL(link.attr('href')+'#education-'+t.id.toLowerCase(),'https://www.perthroofcare.com.au');assert.ok(url.pathname.startsWith('/news/'),t.id+' existing guide');
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
  assert.equal($('main .home-service-map').length,1);assert.ok($(route===''?'main .google-review-card':'main .home-proof img').length);
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

test('ordinary repair boundaries omit inspection billing without inventing a credit policy',()=>{
 const text=page('roof-repairs')('.service-boundary').text();
 assert.doesNotMatch(text,/no[^.]*inspection credit is offered/i);
 assert.doesNotMatch(text,/inspection fee|inspection credit|confirm.*credit/i);
 assert.match(text,/warranty terms must be confirmed in writing/i);
});

test('solution navigation is curated, scannable and distinct from education and project records',()=>{
 for(const route of Object.keys(expected)){
  const $=page(route),group=$('[data-service-section="solution"] .service-related'),links=group.find('a');
  assert.equal(group.find('ul > li > a').length,links.length,route+' open list');
  assert.ok(links.length>0&&links.length<=5,route+' at most five related destinations');
  const paths=links.map((_,e)=>new URL($(e).attr('href'),'https://www.perthroofcare.com.au').pathname).get();
  assert.equal(new Set(paths).size,paths.length,route+' no root/fragment duplication');
  assert.equal($('[data-service-section="solution"] a[href^="/projects/"]').length,0,route+' projects stay with work');
  for(const a of links.toArray())assert.doesNotMatch($(a).text(),/→|Explore|Compare|Perth/i,route+' short labels');
 }
 const roof=page('roof-repairs');
 assert.deepEqual(roof('.service-related a').map((_,e)=>roof(e).attr('href')).get(),['/roof-leak-repairs/','/metal-roof-repairs/','/repair-options/#compare-repair-options','/roof-inspection/']);
 assert.equal(roof('.service-reading a[href="/news/roof-repair-cost-perth/"]').length,1,'quote guide in reading group');
 const downpipe=page('downpipe-repairs');
 assert.equal(downpipe('.service-related a[href="/gutter-repairs/#gutter-repair-or-replace"]').length,1,'useful decision fragment retained');
 assert.equal(page('metal-roof-repairs')('#metal-fastener-project a[href="/projects/metal-roof-fastener-repair-sequence/"]').length,1);
});

test('retained case links remove Contact separators without losing prose or genuine destinations',async()=>{
 const {applyServiceStructure}=await import('./content/service-structure.mjs');
 const $=baseline('tile-roof-repairs'),record=$('main #two-storey-access');
 record.append('<p data-check="mixed"><a href="/flashing-repairs/">Flashing details</a> · <a href="/contact/">Contact</a> · <a href="/roof-leak-repairs/">Leak repairs</a></p><p data-check="leading"><a href="/contact/">Contact</a> · <a href="/flashing-repairs/">Flashing details</a></p><p data-check="contact-only"> · <a href="/contact/">Contact</a> · </p><p data-check="narrative">The composite records roof access and ridge work. <a href="/flashing-repairs/">Flashing details</a> · <a href="/contact/">Contact</a></p>');
 applyServiceStructure($,'tile-roof-repairs');
 assert.equal($('[data-check="mixed"]').text(),'Flashing details · Leak repairs');
 assert.equal($('[data-check="leading"]').text(),'Flashing details');
 assert.equal($('[data-check="contact-only"]').length,0,'Contact-only separator row removed');
 assert.equal($('[data-check="narrative"]').text(),'The composite records roof access and ridge work. Flashing details');
 assert.deepEqual($('[data-check="mixed"] a').map((_,a)=>$(a).attr('href')).get(),['/flashing-repairs/','/roof-leak-repairs/']);
 for(const route of Object.keys(expected)){
  const published=page(route);
  for(const p of published('.service-case p').toArray()){
   const text=published(p).text().trim();assert.ok(text,route+' no empty case paragraph');
   assert.doesNotMatch(text,/^[·\s]|[·\s]$|·\s*·/,route+' no orphan separator');
  }
 }
});

test('component-related project references stay explicitly separate within matching work',()=>{
 const metal=page('metal-roof-repairs'),references=metal('.service-case').first().find('.service-project-references');
 assert.match(references.text(),/Related project records/);
 assert.equal(references.find('a[href="/projects/roleystone-metal-roof-fastener-leak-repair/"]').length,1);
 assert.match(references.text(),/Roleystone/);
 assert.equal(page('gutters-downpipes')('#perth-gutter-tile-project .service-project-references a[href="/projects/wa-6121-tile-roof-valley-gutter-cleaning/"]').length,1);
 assert.equal(page('tile-roof-repairs')('.service-case').first().find('.service-project-references a[href="/projects/tile-roof-valley-chimney-flashing-repairs-perth/"]').length,1);
 assert.equal(page('roof-cleaning-painting')('main a[href="/projects/wa-6121-tile-roof-valley-gutter-cleaning/"]').length,0,'separate drainage job does not imply a painting result');
});

// Apply the small route stylesheet to real DOM selectors at each width. This
// catches selectors missing appended class tokens without claiming rendering.
function routeStyle($,element,width){
 const result={};
 function visit(css){
  let offset=0;
  while(offset<css.length){
   const open=css.indexOf('{',offset);if(open<0)break;
   let end=open+1,depth=1;for(;depth&&end<css.length;end++){if(css[end]==='{')depth++;if(css[end]==='}')depth--;}
   const selector=css.slice(offset,open).trim(),body=css.slice(open+1,end-1);offset=end;
   if(selector.startsWith('@media')){const max=selector.match(/max-width:\s*(\d+)px/);if(max&&width<=Number(max[1]))visit(body);continue;}
   if(selector.startsWith('@')||selector.includes('::')||selector.includes(':focus-visible'))continue;
   if($(element).is(selector)){
    for(const declaration of body.split(';')){const colon=declaration.indexOf(':');if(colon>0)result[declaration.slice(0,colon).trim()]=declaration.slice(colon+1).trim();}
   }
  }
 }
 visit(readFileSync('service-layout.css','utf8').replace(/\/\*[\s\S]*?\*\//g,''));return result;
}
test('service gallery selectors own appended class lists at 800, 500 and 320 pixels',()=>{
 let oldGrids=0;
 for(const route of Object.keys(expected)){
  const $=page(route);
  for(const grid of $('.service-case-list .aligned-photo-grid,.service-case-list .project-case-grid').toArray()){
   const legacy=($(grid).attr('class')||'').split(/\s+/).some(c=>c.endsWith('-evidence-grid'));if(legacy)oldGrids++;
   const count=$(grid).children().length;
   for(const [width,columns] of [[800,count===1?1:count===2||count===4?2:3],[500,count===1?1:2],[320,1]]){
    const style=routeStyle($,grid,width);assert.equal(style.display,'grid',route+' canonical grid '+width);
    assert.equal(style['grid-template-columns'],columns===1?'minmax(0,1fr)':`repeat(${columns},minmax(0,1fr))`,route+' columns '+width);
    assert.equal(style.gap,'1rem',route+' shared spacing '+width);
   }
  }
 }
 assert.equal(oldGrids,10,'all ten original evidence grids checked');
 const strata=page('strata-roof-repairs'),portrait=strata('#perth-strata-skylight-project img')[0];
 assert.equal(routeStyle(strata,portrait,320)['aspect-ratio'],'3/4','portrait skylight remains complete');
 const tile=page('tile-roof-repairs'),composite=tile('.two-storey-project-photo img')[0];
 assert.equal(routeStyle(tile,composite,320)['object-fit'],'contain','composite remains complete');
 const nonservice=page('projects/metal-roof-fastener-repair-sequence');
 assert.deepEqual(routeStyle(nonservice,nonservice('.project-case-grid')[0],500),{},'route rules cannot own nonservice galleries');
});
