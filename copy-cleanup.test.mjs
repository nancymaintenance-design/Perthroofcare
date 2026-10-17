import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
import {applyCopyCleanup} from './content/copy-cleanup.mjs';

test('combined explanatory clauses are removed in one pass and cleanup is idempotent',()=>{
 const $=load('<main><p>A roof assessment is not a whole-building engineering report or an insurance determination; photographs do not establish approvals or liability.</p><p>Keep clear of electrical hazards.</p></main>');
 applyCopyCleanup($,'strata-roof-repairs');
 assert.equal($('main p').length,1);
 assert.equal($('main p').text(),'Keep clear of electrical hazards.');
 const once=$.html();applyCopyCleanup($,'strata-roof-repairs');assert.equal($.html(),once);
});

test('published bilingual pages omit redundant credential and project meta disclaimers',()=>{
 const sitemap=load(readFileSync('public/sitemap.xml','utf8'),{xmlMode:true});
 let count=0;
 for(const el of sitemap('loc').toArray()){
  const route=new URL(sitemap(el).text()).pathname;
  const $=load(readFileSync('public'+route+'index.html','utf8'));
  const body=$('main').text();
  assert.doesNotMatch(body,/ABR company-registration record does not establish|not evidence of a completed job|not a price guide or a guarantee|not a live Google feed|cannot establish coating life|They cannot establish another roof|Maintenance (?:does not|cannot) guarantee|公司注册记录.*(?:不能证明|不代表|并不证明|不等同)/i,route);
  assert.equal($('.review-source-note,.about-company-registration-note').length,0,route);
  count++;
 }
 assert.equal(count,138);
});

test('cleanup retains registration facts, technical cautions, safety and original reviews',()=>{
 const about=load(readFileSync('public/about/index.html','utf8'));
 assert.match(about('main').text(),/96 645 821 745/);
 assert.match(about('main').text(),/645 821 745/);
 assert.equal(about('a[href="https://abr.business.gov.au/ABN/View?id=645821745"]').length,1);
 const leak=load(readFileSync('public/roof-leak-repairs/index.html','utf8'));
 assert.match(leak('main').text(),/Electrical equipment must be handled by the appropriate specialist/);
 assert.match(leak('main').text(),/visible stain or fresh patch does not establish the source/);
 const replacement=load(readFileSync('public/roof-replacement/index.html','utf8'));
 assert.match(replacement('main').text(),/Suspected asbestos requires separate identification and specialist arrangements/);
 const home=load(readFileSync('public/index.html','utf8'));
 assert.equal(home('.google-review-card').length,10);
 assert.match(home('.google-review-card').eq(7).text(),/Living in Sydney/);
 for(const language of ['','zh/']){
  const contact=load(readFileSync('public/'+language+'contact/index.html','utf8'));
  assert.ok(contact('form [aria-live="polite"]').length,'empty status live region must survive deletion sweep');
 }
});
