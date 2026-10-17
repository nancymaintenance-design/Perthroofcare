import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
import {applyServiceLabels} from './content/service-labels.mjs';

const labels={
 'roof-repairs':'Roof repairs','roof-leak-repairs':'Roof leak repairs','tile-roof-repairs':'Tile roof repairs','metal-roof-repairs':'Metal roof repairs',
 'ridge-capping-repointing':'Ridge capping & repointing','flashing-repairs':'Roof valleys & flashing repairs','gutter-repairs':'Gutter repairs','gutters-downpipes':'Gutters & downpipes',
 'downpipe-repairs':'Downpipe repairs','roof-maintenance':'Roof maintenance','roof-cleaning-painting':'Roof cleaning & painting','commercial-roof-repairs':'Commercial roof repairs',
 'storm-damage-roof-repairs':'Storm damage roof repairs','roof-restoration':'Roof restoration','roof-inspection':'Roof inspection','repair-options':'Repair options',
 'roof-cleaning':'Roof cleaning','roof-painting':'Roof painting','box-gutter-repairs':'Box gutter repairs','roof-replacement':'Roof replacement','flat-roof-repairs':'Flat roof repairs','strata-roof-repairs':'Strata roof repairs'
};
const routes=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).filter(r=>!r.startsWith('/zh/'));
const page=route=>load(readFileSync('public'+route+'index.html','utf8'));

test('all 22 service headings, breadcrumbs, schema and knowledge use the core service name',()=>{
 assert.equal(Object.keys(labels).length,22);
 for(const [route,label] of Object.entries(labels)){
  const $=page('/'+route+'/'),graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
  assert.equal($('main h1').text(),label,route);
  assert.equal($('[aria-current="page"]').first().text(),label,route+' visible breadcrumb');
  assert.equal($('main h1').closest('section').find('.eyebrow').first().text(),label,route+' hero eyebrow');
  assert.ok(($('title').text().match(/Perth/g)||[]).length<=1,route+' title location repetition');
  const service=graph.find(n=>n['@type']==='Service'&&n.url==='https://www.perthroofcare.com.au/'+route+'/');
  assert.equal(service?.name,label,route+' Service name');
  assert.ok([service.areaServed].flat().some(n=>n.name==='Perth'),route+' geographic scope');
  assert.equal(graph.find(n=>n['@type']==='BreadcrumbList').itemListElement.at(-1).name,label,route+' breadcrumb graph');
  assert.equal(JSON.parse($('#page-knowledge').text()).summary,$('main p').not('.eyebrow,.article-byline,.inspection-charge-notice').first().text(),route+' knowledge summary');
 }
});

test('all 69 routes use concise service-link labels while retaining geographic project and area names',()=>{
 assert.equal(routes.length,69);
 for(const route of routes){const $=page(route);
  $('a[href]').each((_,e)=>{const a=$(e),href=a.attr('href');if(!href.startsWith('/'))return;
   const target=href.split(/[?#]/)[0].replace(/^\/|\/$/g,''),label=labels[target];if(!label)return;
   if(route==='/faq/'&&a.closest('details').length)return; // The 58 original answer payloads are immutable.
   if(/[a-z]/i.test(a.closest('p,li').clone().find('a').remove().end().text()))return; // Preserve linked phrases that complete a sentence.
   // In-sentence labels use lower case; arrows remain separate navigation cues.
   const text=a.text().replace(/[→↗]/g,'').trim();
   assert.equal(text.toLowerCase(),label.toLowerCase(),route+' '+href+' '+text);
  });
 }
 const $=page('/roof-repairs/');
 assert.match($('a[href="/projects/tile-roof-valley-chimney-flashing-repairs-perth/"]').text(),/Perth/i);
 assert.match(page('/areas/hillarys-roof-repairs/')('main h1').text(),/Hillarys/i);
 assert.match(page('/')('.brand-name').first().text(),/ELLIS/);
});

test('linked factual phrases and the actual FAQ answers retain their original wording',()=>{
 const $=load('<main><p>Learn <a href="/roof-leak-repairs/">how roof leaks are investigated</a> before discussing repairs.</p><details><summary>A question?</summary><p>An original answer.</p><p><a href="/roof-leak-repairs/">Read the related service explanation</a></p></details></main>');
 applyServiceLabels($,'faq',[]);
 assert.equal($('main>p').text(),'Learn how roof leaks are investigated before discussing repairs.');
 assert.equal($('details').text(),'A question?An original answer.Read the related service explanation');
});

test('production parser entity spelling does not prevent recognised inline service names from shortening',()=>{
 const $=load('<main><p>See <a href="/flashing-repairs/#service-overview"><strong>Roof Valleys &amp; Flashing Repairs Perth</strong></a> before assessment.</p><p>See <a href="/gutters-downpipes/#service-overview">Gutters &amp; Downpipes Perth</a> before assessment.</p><p>See <a href="/gutters-downpipes/">Gutters &#38; Downpipes Perth</a>.</p><p>See <a href="/flashing-repairs/">Roof Valleys &#x26; Flashing Repairs Perth</a>.</p><p>Learn <a href="/flashing-repairs/">how valleys &amp; flashing carry rainwater</a> before discussing repairs.</p><details><summary>Original question?</summary><p>Original answer with <a href="/flashing-repairs/">Roof Valleys &amp; Flashing Repairs Perth</a>.</p></details></main>',{xml:{xmlMode:false,decodeEntities:false}});
 const originalFacts=$('main>p').last().html(),originalFaq=$('details').html();
 applyServiceLabels($,'faq',[]);
 const browser=load($.html());
 assert.deepEqual(browser('main>p').slice(0,4).map((_,e)=>browser(e).text()).get(),[
  'See roof valleys & flashing repairs before assessment.',
  'See gutters & downpipes before assessment.',
  'See gutters & downpipes.',
  'See roof valleys & flashing repairs.'
 ]);
 assert.equal(browser('strong').text(),'roof valleys & flashing repairs');
 assert.equal(browser('main>p a').first().attr('href'),'/flashing-repairs/#service-overview');
 assert.equal($('main>p').last().html(),originalFacts,'factual linked clause retains entity spelling and wording');
 assert.equal($('details').html(),originalFaq,'FAQ answer payload remains untouched');
 const once=$.html();applyServiceLabels($,'faq',[]);assert.equal($.html(),once);
});

test('home and directory service cards use core headings without place-stacked service eyebrows',()=>{
 for(const route of ['/','/services/']){const $=page(route);
  $('.home-service-map article').each((_,e)=>{const card=$(e),href=card.find('a[href]').first().attr('href'),label=labels[href?.replace(/^\/|\/$/g,'')];
   if(!label)return;
   const homeOverrides={'/ridge-capping-repointing/':'Ridge capping repairs','/gutters-downpipes/':'Gutter and downpipe repairs','/roof-cleaning-painting/':'Roof cleaning services'};
   assert.equal(card.find('h3').text(),route==='/'?homeOverrides[href]??label:label,route+' '+href);
   assert.doesNotMatch(card.find('.eyebrow').text(),/Perth/i,route+' '+href+' eyebrow');
  });
 }
});

test('service labels preserve inline grammar, arrow and icon children, exact destinations and idempotence',()=>{
 const $=load('<main><p>Read about <a href="/roof-inspection/#service-overview"><strong>Roof Inspection Perth</strong></a> before booking.</p><nav><a href="/metal-roof-repairs/"><img src="/icon.svg" alt=""><span>Metal Roof Repairs Perth</span><span aria-hidden="true">→</span></a><a href="https://www.perthroofcare.com.au/roof-cleaning/">Roof Cleaning Perth ↗</a><a href="https://elsewhere.example/roof-cleaning/">Elsewhere Perth</a><a href="/projects/metal-roof-ridge-capping-repair-perth/">Metal ridge repairs Perth</a></nav></main>');
 applyServiceLabels($,'example',[]);
 assert.equal($('p').text(),'Read about roof inspection before booking.');
 assert.equal($('strong').text(),'roof inspection');
 assert.equal($('p a').attr('href'),'/roof-inspection/#service-overview');
 const metal=$('a[href="/metal-roof-repairs/"]');
 assert.equal(metal.find('span').first().text(),'Metal roof repairs');
 assert.equal(metal.find('[aria-hidden="true"]').text(),'→');assert.equal(metal.find('img').attr('src'),'/icon.svg');
 assert.equal($('a[href^="https://www.perthroofcare"]').text(),'Roof cleaning ↗');
 assert.equal($('a[href^="https://elsewhere"]').text(),'Elsewhere Perth');
 assert.equal($('a[href^="/projects/"]').text(),'Metal ridge repairs Perth');
 const once=$.html();applyServiceLabels($,'example',[]);assert.equal($.html(),once);
});
