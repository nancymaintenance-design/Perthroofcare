import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {load} from 'cheerio';

const root=fileURLToPath(new URL('./public/',import.meta.url));
const page=()=>load(readFileSync(join(root,'about/index.html'),'utf8'));

test('About has one company identity heading with consistent company-intent metadata',()=>{
 const $=page();
 assert.equal($('main h1').length,1);
 assert.equal($('main h1').text(),'Perth Roof Repair Company — Ellis Services Group');
 assert.equal($('title').text(),'Roof Repair Company Perth | Ellis Services Group');
 for(const name of ['og:title','twitter:title'])assert.equal($(`meta[property="${name}"],meta[name="${name}"]`).attr('content'),$('title').text());
 assert.equal($('link[rel="canonical"]').attr('href'),'https://www.perthroofcare.com.au/about/');
});

test('About presents the team, services, genuine project and business facts without a second tutorial or FAQ',()=>{
 const $=page(),main=$('main');
 assert.equal(main.find('details,summary').length,0);
 main.find('h1,h2,h3').each((_,e)=>assert.doesNotMatch($(e).text(),/\?|^(?:how|what|why|where|can|does)\b/i));
 assert.equal((main.text().match(/Perth Roof Care is operated by Ellis Services Group Pty Ltd/g)||[]).length,1);
 assert.match(main.find('.local-team-identity').text(),/Perth-based team/);
 const sections=main.find('[data-about-section]').map((_,e)=>$(e).attr('data-about-section')).get();
 assert.deepEqual(sections,['company','services','project','business']);
 for(const route of ['roof-repairs','roof-leak-repairs','tile-roof-repairs','metal-roof-repairs','ridge-capping-repointing','flashing-repairs','gutters-downpipes','roof-inspection']){
  assert.ok(main.find(`[data-about-section="services"] a[href="/${route}/"]`).length,route);
 }
 assert.doesNotMatch(main.text(),/Questions people often ask|HOW AN ENQUIRY IS ARRANGED|Registration and project-specific credentials/);
});

test('About project images are real assets with reserved dimensions and linked recorded context',()=>{
 const $=page(),images=$('main .about-company img');
 assert.equal(images.length,2);
 images.each((_,e)=>{const img=$(e);assert.ok(existsSync(join(root,img.attr('src'))));assert.ok(Number(img.attr('width'))>0);assert.ok(Number(img.attr('height'))>0);assert.ok(img.attr('alt').length>20);});
 assert.ok($('[data-about-section="project"] a[href="/projects/metal-roof-fastener-repair-sequence/"]').length);
});

test('About retains direct verified facts and a chargeable inspection notice at each booking CTA',()=>{
 const $=page(),facts=$('[data-about-section="business"]');
 for(const fact of ['96 645 821 745','645 821 745','140 St Georges Terrace, Perth WA 6000','Monday–Sunday, 9am–9pm'])assert.ok(facts.text().includes(fact),fact);
 assert.equal(facts.find('a[href="https://abr.business.gov.au/ABN/View?id=645821745"]').length,1);
 assert.ok(facts.find('a[href="tel:+61405878406"]').length);
 assert.ok(facts.find('a[href="mailto:ellisservicesgroup3@outlook.com"]').length);
 $('main a.button[href="/contact/"]').each((_,e)=>assert.match($(e).closest('[data-about-section]').text(),/Roof inspections are chargeable\. Confirm the fee and scope before booking\./));
 assert.doesNotMatch(facts.text(),/registered (?:office|address)/i);
});

test('About structured data describes the company and contains no removed FAQ',()=>{
 const $=page(),graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
 assert.ok(!graph.some(n=>n['@type']==='FAQPage'));
 const about=graph.find(n=>n['@type']==='AboutPage');
 assert.ok(about,'AboutPage entity');
 assert.equal(about.url,'https://www.perthroofcare.com.au/about/');
 const company=graph.find(n=>n['@id']===about.about['@id']);
 assert.equal(company.legalName,'Ellis Services Group Pty Ltd');
 assert.deepEqual(company.identifier.map(n=>n.value),['96645821745','645821745']);
});

test('About layout styles are delivered only with their page and preserve the shared CSS budget',()=>{
 for(const route of ['about','']){
  const $=load(readFileSync(join(root,route,'index.html'),'utf8'));
  const styles=$('link[rel="stylesheet"]');
  assert.equal(styles.length,route==='about'?2:1,'About has a small additional fingerprinted layout bundle');
  const parts=styles.map((_,e)=>readFileSync(join(root,$(e).attr('href')),'utf8')).get();
  const css=parts.join('\n');
  if(route==='about')assert.ok(Buffer.byteLength(css)<90000,'About shared and route CSS total stays below 90KB');
  assert.equal(css.includes('.about-company-hero'),route==='about','About namespace must not add weight to other routes');
  for(const part of parts)assert.ok(Buffer.byteLength(part)<85000,'existing stylesheet budget per bundle');
  assert.ok(css.includes('services-submenu'),'interactive navigation rules survive');
 }
});
