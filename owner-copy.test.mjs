import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
const page=route=>load(readFileSync('public/'+route+'/index.html','utf8'));

test('declarative service disclosures give standalone answers rather than orphan yes/no replies',()=>{
 for(const route of ['roof-leak-repairs','tile-roof-repairs','metal-roof-repairs','gutters-downpipes','roof-cleaning','roof-painting','box-gutter-repairs','roof-replacement','flat-roof-repairs','strata-roof-repairs']){
  const $=page(route);
  for(const e of $('main details').toArray())assert.doesNotMatch($(e).find('p').first().text(),/^(?:Yes\.|No\.|Not by itself\.)/,route);
 }
});
test('service explanation states our quote responsibility while retaining scope and exclusions',()=>{
 const $=page('roof-repairs'),body=$('main').text();
 assert.match(body,/Our written roof repair quote/);
 assert.match(body,/We explain exclusions and any further investigation before you approve/);
 assert.match(body,/warranty terms must be confirmed in writing/);
});
test('area enquiries explain contact before assessment confirmation',()=>{
 const $=page('areas/cottesloe-roof-repairs');
 assert.match($('main').text(),/We will contact you to discuss access and confirm the assessment arrangements/);
 assert.doesNotMatch($('main').text(),/A short form description is enough to arrange an on-site assessment/);
});
test('inspection FAQ states a chargeable scope without suggesting an unconfirmed credit policy',()=>{
 const $=page('faq'),body=$('main').text();
 assert.doesNotMatch(body,/credited against an accepted quote/);
 assert.match(body,/Our roof inspections are chargeable/);
 const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
 const faq=graph.find(n=>n['@type']==='FAQPage');
 assert.ok(faq.mainEntity.every(n=>body.includes(n.acceptedAnswer.text)));
});
test('flashing guide explains our work without deleting the service link embedded in its paragraph',()=>{
 const $=page('news/roof-flashing-explained');
 assert.doesNotMatch($('main').text(),/That service page explains the repair enquiry context/);
 assert.ok($('main a[href="/flashing-repairs/"]').filter((_,a)=>$(a).text().trim()).length);
});
test('reused guide answers and area introductions consistently address customers as our business',()=>{
 for(const route of ['news/metal-roofing-perth','news/roof-leak-inspection','news/roof-maintenance-basics','areas/city-beach-roof-repairs','areas/bayswater-roof-repairs']){
  const $=page(route);assert.doesNotMatch($('main').text(),/Ellis(?: Services Group)? (?:uses|provides|inspects|checks|explains)/,route);
 }
});
test('gallery alternatives describe the photographed roof details rather than service advertisements',()=>{
 const $=page('gallery');
 assert.match($('img[src$="roleystone-metal-fastener-rust-01.jpg"]').attr('alt'),/Corrosion.*fastener/);
 assert.match($('img[src$="wa6121-tile-valley-gutter-01.jpg"]').attr('alt'),/Tiled roof edge.*gutter/);
});
test('inspection booking agrees records available rather than claiming findings exist before inspection',()=>{
 const $=page('roof-inspection');
 assert.doesNotMatch($('main').text(),/confirm the accessible areas, written findings and inspection fee before booking/);
 assert.match($('main').text(),/Before booking, we confirm the areas to be inspected, fee and records we can provide/);
});
test('all three remaining guide leads describe our repair actions directly',()=>{
 for(const r of ['news/drainage-after-rain','news/tile-roof-repairs-perth-guide','news/roof-valleys-flashing-repairs-perth']){
  const $=page(r);assert.doesNotMatch($('.article-lead').text(),/Ellis Services Group (?:inspects|repairs)/,r);
  assert.match($('.article-lead').text(),/We (?:inspect|repair)/,r);
 }
});
