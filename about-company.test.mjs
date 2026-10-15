import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {load} from 'cheerio';
import {applyAboutCompany,renderAboutCompany} from './content/about-company.mjs';

const root=fileURLToPath(new URL('./public/',import.meta.url));
const page=()=>load(readFileSync(join(root,'about/index.html'),'utf8'));

// Match the actual route CSS against rendered elements. This checks ownership
// and responsive declarations; browser geometry remains controller-owned QA.
function ownedStyle($,element,css,width){
 const result={};
 function visit(source){
  let offset=0;
  while(offset<source.length){
   const open=source.indexOf('{',offset);if(open<0)break;
   let end=open+1,depth=1;for(;depth&&end<source.length;end++){if(source[end]==='{')depth++;if(source[end]==='}')depth--;}
   const selector=source.slice(offset,open).trim(),body=source.slice(open+1,end-1);offset=end;
   if(selector.startsWith('@media')){const max=selector.match(/max-width:\s*(\d+)px/),min=selector.match(/min-width:\s*(\d+)px/);if((!max||width<=Number(max[1]))&&(!min||width>=Number(min[1])))visit(body);continue;}
   if(selector.startsWith('@')||selector.includes('::')||selector.includes(':focus-visible'))continue;
   if($(element).is(selector))for(const declaration of body.split(';')){const colon=declaration.indexOf(':');if(colon>0)result[declaration.slice(0,colon).trim()]=declaration.slice(colon+1).trim();}
  }
 }
 visit(css.replace(/\/\*[\s\S]*?\*\//g,''));return result;
}

test('About process uses a full-width heading and three balanced desktop steps that stack on phones',()=>{
 const $=load(renderAboutCompany()),css=readFileSync(new URL('./about-company.css',import.meta.url),'utf8');
 const section=$('[data-about-section="approach"]'),layout=section.children('.container'),steps=section.find('ol');
 assert.equal(ownedStyle($,layout,css,1280).display,'block','heading must not occupy an empty left column');
 assert.equal(ownedStyle($,steps,css,1280)['grid-template-columns'],'repeat(3,minmax(0,1fr))');
 assert.equal(ownedStyle($,steps,css,390)['grid-template-columns'],'1fr');
 assert.deepEqual(steps.find('h3').map((_,e)=>$(e).text()).get(),['Property and access details','Inspection scope and fee','Written repair quote']);
 const capabilities=$('[data-about-section="services"]>.container');
 assert.equal(capabilities.children('h2 + div').find('a[href="/services/"]').length,1,'capability copy and its action share the heading row');
});

test('compact FAQ image releases the legacy minimum height within its phone maximum',()=>{
 const $=load('<section class="hero inner index-hero"><div class="media-frame"><img alt="Roof inspection"></div></section>');
 const css='.hero.inner .media-frame img{min-height:230px}'+readFileSync(new URL('./refinement.css',import.meta.url),'utf8');
 const style=ownedStyle($,$('img'),css,390);
 assert.equal(style['min-height'],'0');assert.equal(style['max-height'],'180px');assert.equal(style['object-fit'],'contain');
});

test('Gallery index opening reserves at most 48 pixels for vertical hero padding and the grid gap',()=>{
 const $=load(readFileSync(join(root,'gallery/index.html'),'utf8')),css=readFileSync(new URL('./refinement.css',import.meta.url),'utf8');
 const pixels=(value,width)=>{
  const unit=s=>s.endsWith('rem')?parseFloat(s)*16:s.endsWith('vw')?parseFloat(s)*width/100:parseFloat(s);
  if(value.startsWith('clamp(')){const [min,preferred,max]=value.slice(6,-1).split(',').map(unit);return Math.max(min,Math.min(preferred,max));}
  return unit(value);
 };
 for(const width of [1280,390]){
  const hero=$('main > .index-hero > .container'),collection=$('.case-library');
  const padding=pixels(ownedStyle($,hero,css,width)['padding-block'],width),gap=pixels(ownedStyle($,collection,css,width)['padding-top'],width);
  assert.ok(padding>=16,'retain comfortable opening padding');
  assert.ok(padding*2+gap<=48,`${width}px opening adds ${padding*2+gap}px before project imagery`);
 }
});

test('About has one company identity heading with consistent company-intent metadata',()=>{
 const $=page();
 assert.equal($('main h1').length,1);
 assert.equal($('main h1').text(),'Ellis Services Group');
 assert.equal($('title').text(),'About Ellis Services Group | Perth Roof Care');
 for(const name of ['og:title','twitter:title'])assert.equal($(`meta[property="${name}"],meta[name="${name}"]`).attr('content'),$('title').text());
 assert.equal($('link[rel="canonical"]').attr('href'),'https://www.perthroofcare.com.au/about/');
});

test('About presents company introduction, registration, working process and a brief capability overview',()=>{
 const $=page(),main=$('main');
 assert.equal(main.find('details,summary').length,0);
 main.find('h1,h2,h3').each((_,e)=>assert.doesNotMatch($(e).text(),/\?|^(?:how|what|why|where|can|does)\b/i));
 assert.equal((main.text().match(/Perth Roof Care is operated by Ellis Services Group Pty Ltd/g)||[]).length,1);
 assert.match(main.find('.local-team-identity').text(),/Perth-based team/);
 const sections=main.find('[data-about-section]').map((_,e)=>$(e).attr('data-about-section')).get();
 assert.deepEqual(sections,['company','business','approach','services']);
 assert.match(main.find('[data-about-section="approach"]').text(),/assess.*findings.*written quote/s);
 assert.equal(main.find('[data-about-section="services"] a').length,1);
 assert.equal(main.find('[data-about-section="services"] a').attr('href'),'/services/');
 assert.doesNotMatch(main.text(),/Questions people often ask|HOW AN ENQUIRY IS ARRANGED|Registration and project-specific credentials/);
});

test('About is a company introduction without project photographs, captions or showcase links',()=>{
 const $=page();
 assert.equal($('main img,main figure,main figcaption,main a[href^="/projects/"],main a[href="/gallery/"]').length,0);
 assert.doesNotMatch($('main').text(),/fastener repair|photographed|same recorded project|completed roof views/i);
 assert.doesNotMatch($('meta[name="description"]').attr('content'),/photographed|project/i);
});

test('About registration facts retain only the hero assessment with its fee notice',()=>{
 const $=page(),facts=$('[data-about-section="business"]');
 for(const fact of ['Ellis Services Group Pty Ltd','96 645 821 745','645 821 745'])assert.ok(facts.text().includes(fact),fact);
 assert.equal(facts.find('a[href="https://abr.business.gov.au/ABN/View?id=645821745"]').length,1);
 assert.equal($('main a[href^="tel:"],main a[href^="mailto:"],main .business-hours').length,0);
 assert.doesNotMatch(facts.text(),/Perth office|Contact our team|140 St Georges Terrace|Monday–Sunday|Arrange an assessment/);
 assert.equal($('main a.button[href="/contact/"]').length,1);
 assert.equal($('.about-company-hero a.button[href="/contact/"]').length,1);
 assert.match($('.about-company-hero .inspection-charge-notice').text(),/Roof inspections are chargeable\. Confirm the fee and scope before booking\./);
 assert.doesNotMatch(facts.text(),/registered (?:office|address)/i);
});

test('About renderer exposes the registration fragment immediately after the company introduction',()=>{
 const $=load(renderAboutCompany());
 const registration=$('#business-registration');
 assert.equal(registration.length,1,'company links have one stable destination');
 assert.equal(registration.prev().attr('data-about-section'),'company');
 assert.equal(registration.find('h2').text(),'Company registration');
 assert.match(registration.text(),/96 645 821 745/);
 assert.match(registration.text(),/does not establish a trade licence or insurance/);
});

test('About omits the pre-footer contact band while preserving the actual shared footer',()=>{
 const $=page();
 assert.equal($('.contact-band').length,0);
 assert.equal($('footer').length,1);
 for(const route of ['','contact','tile-roof-repairs']){
  const sibling=load(readFileSync(join(root,route,'index.html'),'utf8'));
  assert.equal(sibling('.contact-band').length,route==='contact'?0:1,route||'Home');
  assert.equal(sibling('footer').length,1,route||'Home');
  assert.equal($('footer').toString(),sibling('footer').toString(),route||'Home');
 }
});

test('repeated final About transformation removes a reintroduced contact band and preserves the footer',()=>{
 const $=page(),footer=$('footer').toString();
 const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
 for(let pass=0;pass<2;pass++){
  $('footer').before('<section class="contact-band"><h2>Contact our team</h2></section>');
  applyAboutCompany($,graph,'https://www.perthroofcare.com.au/about/');
  assert.equal($('.contact-band').length,0);
  assert.equal($('footer').toString(),footer);
  assert.equal(graph.filter(n=>n['@type']==='AboutPage').length,1);
 }
});

test('About structured data describes the company and contains no removed FAQ',()=>{
 const $=page(),graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
 assert.ok(!graph.some(n=>n['@type']==='FAQPage'));
 const about=graph.find(n=>n['@type']==='AboutPage');
 assert.ok(about,'AboutPage entity');
 assert.equal(about.url,'https://www.perthroofcare.com.au/about/');
 assert.equal(about.name,$('title').text());
 assert.equal(about.description,$('meta[name="description"]').attr('content'));
 const knowledge=JSON.parse($('#page-knowledge').text());
 assert.equal(knowledge.pageType,'AboutPage');
 assert.equal(knowledge.summary,$('.about-company-statement').text());
 assert.ok(!knowledge.relatedUrls.some(url=>url.includes('/projects/')));
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
