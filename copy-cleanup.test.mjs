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
test('removed reference blocks become useful internal routes without empty citations',()=>{
 const $=load('<main><section class="article-references"><h2 id="guide-section-7">Safety and weather resources</h2><p>Consult these resources.</p><ul><li><a href="https://www.bom.gov.au/wa/warnings/">Weather warnings</a></li></ul></section><section class="audit-technical-sources"><h2 id="materials">Manufacturer guidance</h2><p>Lysaght explains the roof.</p><ul><li><a href="https://lysaght.com/support-technical/support/maintenance">Maintenance</a></li></ul><p><a href="/flashing-repairs/">Flashing repairs</a></p></section><div id="education-q022"><p>Condensation and leaks require investigation.</p><p>For background, see <a href="https://www.yourhome.gov.au/passive-design/condensation">Your Home</a>.</p><p><a href="/roof-leak-repairs/">Roof leak repairs</a></p></div></main>');
 applyCopyCleanup($,'news/roof-leak-detection-perth');
 assert.equal($('a[href^="https:"]').length,0);
 assert.ok($('.article-references a[href="/roof-leak-repairs/"]').length);
 assert.ok($('.article-references a[href="/contact/"]').length);
 assert.ok($('.audit-technical-sources a[href="/flashing-repairs/"]').length);
 assert.equal($('#guide-section-7').length,1);
 assert.equal($('#materials').length,1);
 assert.doesNotMatch($('main').text(),/Lysaght|Your Home|Consult these resources|For background/);
 assert.match($('#education-q022').text(),/Condensation and leaks require investigation/);
 assert.equal($('p,ul,li').filter((_,e)=>!$(e).text().trim()).length,0);
 const first=$.html();applyCopyCleanup($,'news/roof-leak-detection-perth');assert.equal($.html(),first);
});

test('published bilingual links and feeds exclude removed references while retaining approved external destinations',()=>{
 const routes=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 const allowed=new Set(['www.instagram.com','www.facebook.com','www.linkedin.com','maps.app.goo.gl','abr.business.gov.au','www.google.com','search.google.com']);
 const removed=/safeworkaustralia\.gov\.au|bom\.gov\.au|lysaght\.com|yourhome\.gov\.au/i;
 for(const route of routes){
  const html=readFileSync('public'+route+'index.html','utf8'),$=load(html);
  assert.doesNotMatch(html,removed,route+' no stale reference in HTML or JSON-LD');
  for(const el of $('a[href]').toArray()){
   const url=new URL($(el).attr('href'),'https://www.perthroofcare.com.au');
   if(!['https:','http:'].includes(url.protocol)||['www.perthroofcare.com.au','perthroofcare.com.au'].includes(url.hostname))continue;
   assert.ok(allowed.has(url.hostname),route+' unexpected external destination '+url.href);
  }
  assert.equal($('footer a[href^="https://www.instagram.com/"]').length,1,route+' social link retained');
  if(route.endsWith('/about/'))assert.equal($('a[href^="https://abr.business.gov.au/ABN/View"]').length,1,route+' ABN retained');
 }
 for(const path of ['news/feed.json','news/feed.xml','zh/news/feed.json','zh/news/feed.xml','case-studies.json','zh/case-studies.json'])assert.doesNotMatch(readFileSync('public/'+path,'utf8'),removed,path);
});
