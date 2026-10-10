import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
const routes=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const pages=new Map(routes.map(r=>[r,load(readFileSync(`public${r}index.html`,'utf8'))]));
test('content revision provides contextual next steps on every published page',()=>{
 assert.equal(pages.size,62);
 for(const [r,$] of pages){assert.ok($('main .content-intent').length,r);assert.ok($('main .content-intent a[href^="/"]').length,r);}
});
test('questions in schema and page knowledge match final visible answers',()=>{
 for(const [r,$] of pages){const questions=$('main details').map((_,e)=>({question:$(e).find('summary').text(),answer:$(e).find('p').text()})).get();
 const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];const faq=graph.find(n=>n['@type']==='FAQPage');
 if(questions.length)assert.deepEqual(faq.mainEntity.map(q=>({question:q.name,answer:q.acceptedAnswer.text})),questions,r);
 const k=JSON.parse($('#page-knowledge').text());assert.deepEqual(k.questions,questions,r);
 for(const link of $('main .content-intent a[href^="/"]').toArray()){const path=$(link).attr('href').split('#')[0];assert.ok(pages.has(path),r+' -> '+path);assert.ok(k.relatedUrls.includes('https://www.perthroofcare.com.au'+path),r+' missing knowledge link '+path);}
 }
});
test('long guides expose working descriptive contents links and linked publisher',()=>{
 for(const [r,$] of pages){if(!r.startsWith('/news/')||r==='/news/')continue;
 assert.ok($('.content-toc a[href^="#"]').length>=4,r);
 for(const a of $('.content-toc a').toArray())assert.equal($($(a).attr('href')).length,1,r);
 assert.ok($('.article-byline a[href="/about/"]').length,r);
 }
});
test('service questions explain fees and scope without invented offers',()=>{
 assert.match(pages.get('/roof-inspection/')('.content-intent').text(),/fee.*before.*book/i);
 assert.match(pages.get('/roof-leak-repairs/')('.content-intent').text(),/solar.*cause/i);
 assert.match(pages.get('/repair-options/')('.content-intent').text(),/replacement.*separate/i);
 for(const [r,$] of pages)assert.doesNotMatch($('.content-intent').text(),/24\/7|free inspection|guaranteed same.day|fully licensed|five.star/i,r);
});
test('published headings retain one H1 and never skip a level',()=>{
 for(const [r,$] of pages){assert.equal($('main h1').length,1,r);let previous=0;
 for(const e of $('main h1,main h2,main h3,main h4,main h5,main h6').toArray()){const level=Number(e.tagName.slice(1));assert.ok(!previous||level<=previous+1,r+' '+$(e).text());previous=level;}}
});
test('Roleystone project evidence links use the same place spelling as the project',()=>{
 for(const [r,$] of pages)for(const e of $('main a[href="/projects/roleystone-metal-roof-fastener-leak-repair/"]').toArray())assert.doesNotMatch($(e).text(),/ROYLEYSTONE/i,r);
});
