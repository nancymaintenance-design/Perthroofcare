import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'cheerio';
import { serviceAnswers } from './content/service-faqs.mjs';
const root = new URL('./public/', import.meta.url).pathname.replace(/^\/([A-Z]:)/i,'$1');
const routes = [...readFileSync(join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const pages = new Map(routes.map(r=>[r,load(readFileSync(join(root,r,'index.html'),'utf8'))]));
test('42 service answers are specific, unique and match visible FAQ schema',()=>{
  const answers=Object.values(serviceAnswers).flat();
  assert.equal(answers.length,42);assert.equal(new Set(answers).size,42);
  for(const [slug,expected] of Object.entries(serviceAnswers)){
    const dom=pages.get(`/${slug}/`);
    assert.deepEqual(dom('.focus-faq details p').map((_,e)=>dom(e).text()).get(),expected);
    const graph=JSON.parse(dom('script[type="application/ld+json"]').text())['@graph'];
    assert.deepEqual(graph.find(n=>n['@type']==='FAQPage').mainEntity.map(q=>q.acceptedAnswer.text),expected);
  }
});
test('all canonical pages are reachable within three clicks and local assets exist',()=>{
  const depths=new Map([['/',0]]), queue=['/'];
  while(queue.length){const r=queue.shift(),dom=pages.get(r);dom('a[href^="/"]').each((_,e)=>{const p=new URL(dom(e).attr('href'),'https://example.test').pathname;if(pages.has(p)&&!depths.has(p)){depths.set(p,depths.get(r)+1);queue.push(p);}});}
  assert.equal(depths.size,pages.size);assert.ok(Math.max(...depths.values())<=3);
  for(const dom of pages.values())for(const selector of ['img[src^="/"]','link[href^="/"]','script[src^="/"]'])dom(selector).each((_,e)=>{const uri=dom(e).attr('src')||dom(e).attr('href');if(uri.startsWith('/_vercel/'))return;assert.ok(existsSync(join(root,new URL(uri,'https://example.test').pathname)),uri);});
});
test('internal source files are not published',()=>{
  for(const path of ['docs','scripts','tools','content','node_modules','seo-ui.test.mjs','build.mjs','DESIGN.md'])assert.equal(existsSync(join(root,path)),false,path);
});
test('gallery and feeds cover every project and guide',()=>{
  const gallery=pages.get('/gallery/');assert.equal(gallery('.case-library-grid article').length,8);
  for(const [file,prefix] of [['news/feed.json','/news/'],['case-studies.json','/projects/']]){
    const feed=JSON.parse(readFileSync(join(root,file),'utf8'));
    for(const route of routes.filter(r=>r.startsWith(prefix)&&r!==prefix))assert.ok(feed.items.some(i=>new URL(i.url).pathname===route),route);
  }
});
test('home and core service have distinct metadata and all nine service cards have responsive images',()=>{
  assert.notEqual(pages.get('/')('title').text(),pages.get('/roof-repairs/')('title').text());
  assert.notEqual(pages.get('/')('meta[name="description"]').attr('content'),pages.get('/roof-repairs/')('meta[name="description"]').attr('content'));
  assert.equal(pages.get('/')('.home-service-map article img[srcset]').length,9);
});
test('every gallery entry uses the same image and padded content structure',()=>{
  const d=pages.get('/gallery/');
  for(const card of d('.case-library-grid article').toArray()){
    assert.equal(d(card).children('img').length,1);
    assert.equal(d(card).children('.case-library-copy').length,1,'card copy needs a shared padded wrapper');
    assert.equal(d(card).find('.case-library-copy > a').length,1);
  }
});
test('all news bodies use one bounded reading layout without appended legacy sections',()=>{
  for(const [route,d] of pages){if(!route.startsWith('/news/')||route==='/news/')continue;
    assert.equal(d('main > article.news-article').length,1,route);
    assert.equal(d('main > section').length,0,route+' has disconnected appended content');
    assert.equal(d('main > article > .article-reading').length,1,route);
  }
});
test('project related-service sections retain the shared page gutter',()=>{
  for(const [route,d] of pages){if(!route.startsWith('/projects/'))continue;
    assert.equal(d('main section.grid').filter((_,e)=>!d(e).closest('.container').length).length,0,route+' leaves grid text against the viewport edge');
  }
});
test('news feed titles match their revised visible article headings',()=>{
  const feed=JSON.parse(readFileSync(join(root,'news/feed.json'),'utf8'));
  for(const item of feed.items){
    const route=new URL(item.url).pathname;
    assert.equal(item.title,pages.get(route)('h1').text().trim(),route);
  }
});
test('metal roofing article requests an image large enough for its full reading column',()=>{
  const image=pages.get('/news/metal-roofing-perth/')('.guide-photo img');
  assert.equal(image.attr('src'),'/assets/images/metal-roof-perth-grey-roof-overview.png');
  assert.ok(image.attr('sizes').includes('840px'),'desktop photo needs an 840px source rather than 620px');
});
