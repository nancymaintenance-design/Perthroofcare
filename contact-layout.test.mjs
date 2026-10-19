import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';

const page=route=>load(readFileSync(`public/${route}/index.html`,'utf8'));

test('Contact puts all direct contact information above a standalone centred enquiry form',()=>{
 const $=page('contact'),main=$('main'),band=main.find('.contact-details-band'),form=main.find('.contact-enquiry-box');
 assert.equal(band.length,1,'direct information has one top band');
 assert.equal(form.length,1,'form has one separate bounded container');
 assert.equal(main.find('.contact-layout').length,0,'no short left rail beside the form');
 assert.equal(band.find('a[href="tel:+61405878406"]').length,1);
 assert.equal(band.find('a[href="mailto:ellisservicesgroup3@outlook.com"]').length,1);
 assert.match(band.text(),/140 St Georges Terrace, Perth WA 6000/);
 assert.match(band.find('.business-hours').text(),/Monday–Sunday, 9am–9pm.*Perth local time/);
 assert.ok(main.html().indexOf('contact-details-band')<main.html().indexOf('contact-enquiry-box'));
 assert.equal(main.find('h1').length,1);
 assert.equal($('title').text(),'Perth Roof Repair Enquiries | Ellis Services Group');
 for(const name of ['og:title','twitter:title'])assert.equal($(`meta[property="${name}"],meta[name="${name}"]`).attr('content'),$('title').text());
 const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
 assert.equal(graph.find(n=>[n['@type']].flat().includes('WebPage')).name,$('title').text());
 assert.equal($('link[rel="canonical"]').attr('href'),'https://www.perthroofcare.com.au/contact/');
 main.find('h1,h2,h3').each((_,e)=>assert.doesNotMatch($(e).text(),/\?|^(?:what|how|why|can|does)\b/i));
});

test('Contact retains the enquiry contract and full-width message, privacy and action rows',()=>{
 const $=page('contact'),form=$('.contact-enquiry-box form');
 assert.equal(form.attr('action'),'/api/enquiry');
 assert.equal(form.attr('method'),'post');
 assert.ok(form.is('[novalidate]'));
 for(const [name,id,type,maxlength,autocomplete] of [['name','name','text','100','name'],['phone','phone','tel','40','tel'],['email','email','email','254','email']]){
  const input=form.find(`input[name="${name}"]`);
  assert.equal(input.attr('id'),id);assert.equal(input.attr('type'),type);assert.equal(input.attr('maxlength'),maxlength);assert.equal(input.attr('autocomplete'),autocomplete);assert.ok(input.is('[required]'));
  assert.equal(form.find(`label[for="${id}"]`).length,1);
 }
 const message=form.find('textarea[name="enquiry"]');
 assert.equal(message.attr('id'),'enquiry');assert.equal(message.attr('maxlength'),'4000');assert.equal(message.attr('rows'),'7');assert.ok(message.is('[required]'));
 assert.ok(message.parent().is('.contact-form-wide'));
 assert.ok(form.find('input[name="email"]').parent().is('.contact-form-wide'),'odd short field spans the row without an empty cell');
 assert.equal(form.find('.honeypot[aria-hidden="true"] input#website[name="website"][tabindex="-1"][autocomplete="off"]').length,1);
 assert.equal(form.find('.privacy-check input[name="privacy"][type="checkbox"][required]').length,1);
 assert.equal(form.find('.privacy-check a[href="/privacy/"]').length,1);
 assert.equal(form.find('.form-status[aria-live="polite"][aria-atomic="true"][role="status"]').length,1);
 assert.equal(form.find('button.form-submit[type="submit"]').length,1);
 assert.equal(form.find('.inspection-charge-notice').length,0);
});

test('Contact keeps concise safe photo guidance and coherent knowledge without repeated billing',()=>{
 const $=page('contact'),main=$('main'),graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'],knowledge=JSON.parse($('#page-knowledge').text());
 assert.equal(main.find('.inspection-charge-notice').length,0,'no repeated billing notice');
 assert.match(main.text(),/on-site assessment/);assert.match(main.text(),/written quote/);assert.match(main.text(),/photographs are optional/);assert.match(main.text(),/ground-level/);
 assert.doesNotMatch(main.text(),/upload|attach|What happens next|Before you send/i);
 assert.equal(knowledge.summary,main.find('.contact-intro').text());
 assert.deepEqual(knowledge.questions,[]);assert.deepEqual(knowledge.guidance,[]);
 assert.ok(!graph.some(n=>n['@type']==='FAQPage'));
 assert.ok(knowledge.relatedUrls.includes('https://www.perthroofcare.com.au/roof-inspection/'));
});

test('Contact delivers a small isolated responsive layout layer within existing stylesheet budgets',()=>{
 const $=page('contact'),links=$('link[rel="stylesheet"]');
 assert.equal(links.length,2);
 const parts=links.map((_,e)=>readFileSync(`public${$(e).attr('href')}`,'utf8')).get(),css=parts[1];
 assert.ok(Buffer.byteLength(css)<4000);assert.ok(parts.reduce((sum,p)=>sum+Buffer.byteLength(p),0)<90000);
 for(const part of parts){assert.ok(Buffer.byteLength(part)<85000);assert.doesNotMatch(part,/@import/);}
 assert.match(css,/contact-details-band[^{}]*\{[^}]*grid-template-columns/);
 assert.match(css,/contact-enquiry-box[^{}]*\{[^}]*max-width/);
 assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(css,/grid-column:1\/-1/);
 assert.match(css,/@media[^{}]*\((?:max-width:720px|width<=720px)\)/,'phone breakpoint survives CSS minification');
 assert.match(css,/grid-template-columns:(?:minmax\(0,1fr\)|1fr)/);
 for(const route of ['','service-areas','areas/perth-roof-repairs']){
  const sibling=page(route),siblingCss=sibling('link[rel="stylesheet"]').map((_,e)=>readFileSync(`public${sibling(e).attr('href')}`,'utf8')).get().join('\n');
  assert.doesNotMatch(siblingCss,/contact-details-band|contact-enquiry-box/,'Contact styles cannot change area enquiry layout');
 }
});
