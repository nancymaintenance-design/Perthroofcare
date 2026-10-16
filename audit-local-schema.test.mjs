import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';

const site='https://www.perthroofcare.com.au';
const page=r=>load(readFileSync(`public/${r}/index.html`,'utf8'));
const graph=$=>JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
const services={
 'roof-cleaning':'Roof cleaning', 'roof-painting':'Roof painting',
 'box-gutter-repairs':'Box gutter repair', 'roof-replacement':'Whole-roof replacement',
 'flat-roof-repairs':'Flat roof repair', 'strata-roof-repairs':'Strata roof repair'
};
const sitemap=load(readFileSync('public/sitemap.xml','utf8'),{xmlMode:true});
const routes=sitemap('loc').map((_,e)=>new URL(sitemap(e).text()).pathname).get().filter(r=>!r.startsWith('/zh/')).map(r=>r.replace(/^\/|\/$/g,''));

// Missing Service, stale canonical, wrong provider or a disconnected mainEntity
// would make these consumer-visible graph contracts fail.
for(const [route,serviceType] of Object.entries(services))test(`${route}: page identifies its own service and existing local provider`,()=>{
 const $=page(route),nodes=graph($),canonical=$('link[rel="canonical"]').attr('href');
 const service=nodes.filter(n=>n['@type']==='Service');assert.equal(service.length,1);
 assert.equal(canonical,`${site}/${route}/`);assert.equal(service[0]['@id'],canonical+'#service');
 assert.equal(service[0].url,canonical);assert.equal(service[0].serviceType,serviceType);
 assert.equal(service[0].name,$('main h1').text().trim().replace(/\.$/,''));
 assert.deepEqual(service[0].provider,{'@id':site+'/#business'});
 assert.equal(nodes.find(n=>n['@id']===service[0].provider['@id'])?.['@type'],'LocalBusiness');
 assert.deepEqual(nodes.find(n=>n['@type']==='WebPage').mainEntity,{'@id':canonical+'#service'});
 const ids=nodes.map(n=>n['@id']).filter(Boolean);assert.equal(new Set(ids).size,ids.length);
 for(const id of ids)assert.equal(new URL(id).origin,site);
});

test('all services keep Perth and evidenced local places without promising state-wide coverage',()=>{
 let count=0;
 for(const route of routes){const nodes=graph(page(route));
  for(const service of nodes.filter(n=>n['@type']==='Service')){
   count++;const areas=[service.areaServed].flat();
   assert.ok(areas.some(a=>a['@type']==='City'&&a.name==='Perth'),route);
   assert.ok(areas.every(a=>!['WA','Western Australia'].includes(a.name)),route);
   assert.ok(areas.every(a=>['Perth','Roleystone, WA'].includes(a.name)||(a['@type']==='Place'&&a.name==='WA 6121'&&a.address?.postalCode==='6121'&&a.address?.addressRegion==='Western Australia'&&a.address?.addressCountry==='AU')),route+' evidenced scope');
   if(route==='projects/roleystone-metal-roof-fastener-leak-repair')assert.ok(areas.some(a=>a.name==='Roleystone, WA'));
   if(route==='projects/wa-6121-tile-roof-valley-gutter-cleaning')assert.ok(areas.some(a=>a.address?.postalCode==='6121'));
  }
  assert.equal(nodes.find(n=>n['@type']==='LocalBusiness').address.addressRegion,'WA');
 }
 assert.equal(count,29);
});

test('reapplying the graph refinement preserves identifiers and emits one service per new page',async()=>{
 const {refineLocalServiceGraph}=await import('./content/audit-local-schema.mjs');
 for(const route of Object.keys(services)){
  const $=page(route),nodes=graph($),canonical=$('link[rel="canonical"]').attr('href');
  refineLocalServiceGraph($,nodes,route,canonical);const once=JSON.stringify(nodes);
  refineLocalServiceGraph($,nodes,route,canonical);assert.equal(JSON.stringify(nodes),once,route);
  assert.equal(nodes.filter(n=>n['@type']==='Service').length,1);
  const ids=new Set(nodes.map(n=>n['@id']).filter(Boolean));
  const references=value=>{
   if(!value||typeof value!=='object')return;
   if(value['@id'])assert.ok(ids.has(value['@id']),route+' resolves '+value['@id']);
   Object.values(value).forEach(references);
  };
  references(nodes);
 }
});

test('declarative route edits and the FAQ heading update advance modification dates',()=>{
 assert.equal(routes.length,69);
 for(const route of routes){
  const expected='2026-10-14';
  const entry=sitemap('url').filter((_,e)=>sitemap(e).find('loc').text()===`${site}/${route?route+'/':''}`);
  assert.equal(entry.find('lastmod').text(),expected,route);
 }
});

test('article dates agree across the visible byline, graph and feed while publication dates stay intact',()=>{
 const feed=JSON.parse(readFileSync('public/news/feed.json','utf8'));
 for(const item of feed.items){const route=new URL(item.url).pathname.replace(/^\/|\/$/g,''),$=page(route);
  const expected='2026-10-14';
  assert.equal(graph($).find(n=>n['@type']==='Article').dateModified,expected,route);
  assert.ok($('.article-byline').text().includes('Updated '+expected),route);
  assert.equal(item.date_modified,expected+'T00:00:00+08:00',route);
 }
 assert.equal(feed.items.find(i=>i.url.endsWith('/roof-repair-cost-perth/')).date_published,'2026-10-12T00:00:00+08:00');
 const projects=JSON.parse(readFileSync('public/case-studies.json','utf8'));
 for(const item of projects.items){const route=new URL(item.url).pathname.replace(/^\/|\/$/g,'');
  assert.equal(item.date_modified,'2026-10-14T00:00:00+08:00',route);
 }
});

test('machine-readable navigation links all six service scopes and the quote-comparison guide once',()=>{
 const text=readFileSync('public/llms.txt','utf8');
 for(const route of [...Object.keys(services),'news/roof-repair-cost-perth']){
  assert.equal(text.split(`](${site}/${route}/)`).length-1,1,route);
  assert.ok(routes.includes(route),route+' canonical target exists');
 }
 assert.doesNotMatch(text,/guarantee.*(?:rank|citation)|boost.*(?:rank|citation)/i);
});
