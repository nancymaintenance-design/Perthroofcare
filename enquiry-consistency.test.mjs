import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';

const localities=['cottesloe','mosman-park','city-beach','scarborough','claremont','nedlands','subiaco','perth','leederville','joondalup','hillarys','fremantle','rockingham','kalamunda','victoria-park','bayswater'];
const formRoutes=['contact','service-areas',...localities.map(name=>`areas/${name}-roof-repairs`)];
const fee='Roof inspections are chargeable. Confirm the fee and scope before booking.';
const html=route=>readFileSync(`public/${route}/index.html`,'utf8');

test('service areas offers every locality once in one complete regional directory',()=>{
 const $=load(html('service-areas'));
 assert.equal($('main .area-directory').length,1);
 assert.equal($('.area-directory .area-region-card').length,6);
 for(const name of localities)assert.equal($(`main a[href="/areas/${name}-roof-repairs/"]`).length,1,`${name} has one directory destination`);
 assert.match($('main').text(),/affected roof level/);
 assert.match($('main').text(),/access and current availability/);
 for(const [route,detail] of [['scarborough',/coordinate access with the site contact/],['kalamunda',/Property slope, roof height and access routes/],['subiaco',/access/i]]){
  const page=load(html(`areas/${route}-roof-repairs`));
  assert.match(page('main').text(),detail,`${route} retains unique access guidance`);
  assert.equal(page('#enquiry').length,1);
 }
});

test('all 18 forms disclose chargeable inspection terms immediately before submit and retain field hooks',()=>{
 for(const route of formRoutes){
  const $=load(html(route)),form=$('main form.enquiry-form');
  assert.equal(form.length,1,route);
  assert.equal(form.find('button[type="submit"]').prev('.inspection-charge-notice').text(),fee,route);
  assert.equal(form.find('.inspection-charge-notice').length,1,route);
  assert.equal(form.attr('action'),'/api/enquiry');assert.equal(form.attr('method'),'post');assert.ok(form.is('[novalidate]'));
  for(const name of ['name','phone','email','enquiry','privacy'])assert.equal(form.find(`[name="${name}"][required]`).length,1,`${route}: ${name}`);
  assert.equal(form.find('.form-status[aria-live="polite"][aria-atomic="true"][role="status"]').length,1);
 }
});

test('all 18 published forms provide an explicit no-JavaScript alternative and hide inoperable controls',()=>{
 for(const route of formRoutes){
  const $=load(html(route),{scriptingEnabled:false}),fallback=$('main noscript .enquiry-no-js');
  assert.equal(fallback.length,1,route);
  assert.equal(fallback.closest('form').length,0,'fallback cannot disappear with hidden form controls');
  assert.match(fallback.text(),/JavaScript/i);
  assert.equal(fallback.find('a[href="tel:+611300838722"]').length,1);
  assert.equal(fallback.find('a[href="mailto:ellisservicesgroup3@outlook.com"]').length,1);
  assert.equal(fallback.find('.inspection-charge-notice').text(),fee);
  assert.match($('main noscript style').text(),/\.enquiry-form\s*\{\s*display:\s*none\s*!important\s*;?\s*\}/);
 }
});

test('Contact and About omit their pre-footer contact band while other routes retain it and every footer remains intact',()=>{
 for(const route of ['contact','about','service-areas','areas/perth-roof-repairs','roof-repairs']){
  const $=load(html(route));
  assert.equal($('.contact-band').length,['contact','about'].includes(route)?0:1,route);
  assert.equal($('footer').length,1);
  for(const href of ['tel:+611300838722','mailto:ellisservicesgroup3@outlook.com','/contact/','/privacy/'])assert.ok($(`footer a[href="${href}"]`).length,`${route}: intact footer ${href}`);
 }
});
