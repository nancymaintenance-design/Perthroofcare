import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';

const site='https://www.perthroofcare.com.au';
const page=path=>load(readFileSync('public'+path+'index.html','utf8'));
const routes=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const nodes=$=>$('script[type="application/ld+json"]').toArray().flatMap(e=>{const n=JSON.parse($(e).text());return n['@graph']||[n];});

test('every public non-home page has one semantic localized breadcrumb matching its single schema',()=>{
 for(const path of routes){
  const $=page(path),graph=nodes($),crumbs=graph.filter(n=>[n['@type']].flat().includes('BreadcrumbList'));
  if(['/','/zh/'].includes(path)){assert.equal(crumbs.length,0);assert.equal($('.breadcrumbs').length,0);continue;}
  const nav=$('main nav.breadcrumbs');assert.equal(nav.length,1,path);
  assert.equal(nav.attr('aria-label'),path.startsWith('/zh/')?'面包屑导航':'Breadcrumb',path);
  const items=nav.find('ol > li');assert.ok(items.length>=2,path+' ordered list');
  assert.equal(crumbs.length,1,path);assert.equal(crumbs[0].itemListElement.length,items.length,path);
  items.each((i,el)=>{const item=crumbs[0].itemListElement[i],entry=$(el).clone();entry.find('[aria-hidden]').remove();assert.equal(item.position,i+1);assert.equal(item.name,entry.text().trim());assert.equal(item.item,i===items.length-1?site+path:$(el).find('a').attr('href'));});
  assert.equal(nav.find('[aria-current="page"]').length,1);assert.equal(nav.find('[aria-current="page"]').is('a'),false);
  assert.equal(nav.find('a[rel~=nofollow],a[target],a[href="#"]').length,0);
  const web=graph.find(n=>[n['@type']].flat().includes('WebPage'));
  assert.equal(web.breadcrumb['@id'],site+path+'#breadcrumb');
 }
});

test('service-specific guides and cases return to the right commercial scope, not a generic directory',()=>{
 for(const [path,parent] of [
  ['/roof-leak-repairs/','/'],
  ['/downpipe-repairs/','/gutters-downpipes/'],
  ['/news/roof-leak-detection-perth/','/roof-leak-repairs/'],
  ['/news/roof-flashing-explained/','/flashing-repairs/'],
  ['/projects/metal-roof-ridge-capping-repair-perth/','/metal-roof-repairs/'],
  ['/projects/tile-roof-chimney-flashing-repair-perth/','/flashing-repairs/'],
  ['/projects/wa-6121-tile-roof-valley-gutter-cleaning/','/gallery/'],
  ['/areas/cottesloe-roof-repairs/','/service-areas/']
 ])for(const prefix of ['','/zh']){
  const $=page(prefix+path),href=$('.breadcrumbs a').last().attr('href');
  assert.equal(href,site+prefix+parent,prefix+path);
  const parentPage=page(prefix+parent);
  assert.ok(parentPage('main a[href]').toArray().some(a=>new URL(parentPage(a).attr('href'),site+prefix+parent).href===site+prefix+path),'parent must expose child '+prefix+path);
 }
});

test('guides, cases and areas expose a service and enquiry path near their opening',()=>{
 for(const path of routes.filter(p=>/\/(news|projects|areas)\/[^/]+\/$/.test(p))){
  const $=page(path),handoff=$('main [data-service-handoff]');
  assert.equal(handoff.length,1,path);assert.ok(handoff.find('a[data-service-link]').length,path);
  assert.equal(handoff.find('a[data-enquiry-link]').attr('href'),site+(path.startsWith('/zh/')?'/zh':'')+'/contact/');
 }
});

test('mapping validator rejects missing parents, loops and mixed-language destinations',async()=>{
 const {validateNavigationMap}=await import('./content/service-navigation.mjs');
 const home={url:site+'/',locale:'en-AU',primary_parent_url:null,commercial_owner_url:site+'/'};
 const child={url:site+'/example/',locale:'en-AU',primary_parent_url:site+'/',commercial_owner_url:site+'/'};
 const map=(h,c)=>new Map([['/',h],['/example/',c]]);
 assert.doesNotThrow(()=>validateNavigationMap(map(home,child)));
 assert.throws(()=>validateNavigationMap(map(home,{...child,primary_parent_url:site+'/missing/'})),/Missing parent/);
 assert.throws(()=>validateNavigationMap(map({...home,primary_parent_url:child.url},child)),/cycle/);
 assert.throws(()=>validateNavigationMap(map(home,{...child,locale:'zh-Hans'})),/Cross-language/);
 assert.throws(()=>validateNavigationMap(map(home,{...child,commercial_owner_url:site+'/missing/'})),/Missing service/);
});

test('all mapped service ancestors retain their actual localized service names and real return links',async()=>{
 const {createNavigationMap}=await import('./content/service-navigation.mjs');
 const pages=new Map(routes.map(path=>[path,{$:page(path)}]));
 const mapping=createNavigationMap(pages,site);
 assert.equal(mapping.size,138);
 for(const record of mapping.values()){
  if(['service','subservice'].includes(record.page_type))assert.equal(record.breadcrumb_label,pages.get(record.path).$('h1').text(),record.path+' stable service name');
  if(!record.primary_parent_url)continue;
  const parent=pages.get(new URL(record.primary_parent_url).pathname).$;
  const selector=['/','/zh/'].includes(new URL(record.primary_parent_url).pathname)?'a[href]':'main a[href]';
  assert.ok(parent(selector).toArray().some(a=>new URL(parent(a).attr('href'),record.primary_parent_url).href===record.url),'real parent entry '+record.path);
 }
});
