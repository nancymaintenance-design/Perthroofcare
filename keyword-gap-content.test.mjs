import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';

const paths=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).filter(r=>!r.startsWith('/zh/'));
const pages=new Map(paths.map(path=>[path,load(readFileSync(`public${path}index.html`,'utf8'))]));

// Catch a missing content-pass call or a section attached outside the published main.
test('priority gap answers render in the relevant existing pages',()=>{
 const targets=[
  ['/roof-repairs/','repair-quote-factors'],['/roof-restoration/','restoration-quote-factors'],
  ['/news/ridge-capping-repairs-perth-guide/','repointing-quote-factors'],
  ['/roof-cleaning-painting/','roof-cleaning-scope'],['/roof-cleaning-painting/','roof-painting-scope'],
  ['/gutter-repairs/','gutter-repair-or-replace'],['/downpipe-repairs/','downpipe-repair-or-replace'],
  ['/areas/leederville-roof-repairs/','leederville-maintenance'],
  ['/repair-options/','compare-repair-options'],['/faq/','leak-or-condensation']
 ];
 for(const [path,id] of targets){const $=pages.get(path);assert.equal($(`main #${id}`).length,1,`${path} #${id}`);assert.ok($(`main #${id}`).text().trim().length>0,path);}
});

// Catch links that send a cost/cleaning visitor to missing pages or broken fragments.
test('new contextual links resolve to published paths and valid fragments',()=>{
 let count=0;
 for(const [path,$] of pages) for(const a of $('main .keyword-gap-content a[href^="/"]').toArray()){
  const url=new URL($(a).attr('href'),'https://www.perthroofcare.com.au');
  assert.ok(pages.has(url.pathname),path+' -> '+url.pathname);
  if(url.hash)assert.equal(pages.get(url.pathname)(url.hash).length,1,path+' -> '+url.hash);
  assert.ok($(a).text().trim().length>8,path);count++;
 }
 assert.ok(count>=20,'content pass must expose the planned contextual paths');
});

// Catch a one-way regional/service relationship or lost guide contents integration.
test('maintenance and region links are bidirectional, and new guide topics enter its TOC',()=>{
 assert.ok(pages.get('/areas/leederville-roof-repairs/')('main .keyword-gap-content a[href="/roof-maintenance/"]').length);
 assert.ok(pages.get('/roof-maintenance/')('main .keyword-gap-content a[href="/areas/leederville-roof-repairs/#leederville-maintenance"]').length);
 const $=pages.get('/news/ridge-capping-repairs-perth-guide/');
 const headings=$('.keyword-gap-content h2').toArray();assert.ok(headings.length);
 for(const h of headings)assert.equal($(`.content-toc a[href="#${$(h).attr('id')}"]`).length,1);
});

// Catch a shared selector inserting long answers into the service brief's sidebar grid.
test('new reading sections do not become nested service sidebar grid cells',()=>{
 for(const [path,$] of pages) for(const section of $('main .keyword-gap-content').toArray()){
  const parent=$(section).parent();
  assert.ok(parent.is('main, .article-reading, .service-solution-body')||(path.includes('/news/')&&parent.is('.guide-reading-body')&&parent.parent().is('.guide-workspace')),path+' content nested in '+parent.attr('class'));
  assert.equal($(section).closest('.service-brief-enquiry').length,0,path+' no preparation sidebar');
 }
});

// Catch metadata/schema left stale after the urgent-page title or answers change.
test('urgent title and added answers remain consistent with structured data',()=>{
 const storm=pages.get('/storm-damage-roof-repairs/');assert.equal(storm('main h1').text(),'Storm damage roof repairs');
 for(const [path,$] of pages){
  const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
  const crumb=graph.find(n=>n['@type']==='BreadcrumbList');
  if(path==='/storm-damage-roof-repairs/')assert.equal(crumb.itemListElement.at(-1).name,$('main h1').text().replace(/\.$/,''));
  if(!$('main .keyword-gap-content details').length)continue;
  const faqs=graph.find(n=>n['@type']==='FAQPage');
  for(const d of $('main .keyword-gap-content details').toArray()){
   const question=$(d).find('summary').text(),answer=$(d).find('p').text();
   if(path==='/faq/')assert.ok(faqs.mainEntity.some(q=>q.name===question&&q.acceptedAnswer.text===answer),path+' FAQ mismatch');
   else {assert.equal(faqs,undefined,path);assert.ok(JSON.parse($('#page-knowledge').text()).guidance.some(g=>g.heading===question&&g.body===answer),path+' guidance mismatch');}
  }
 }
});
