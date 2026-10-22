import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,cpSync,rmSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {enhanceMachineData} from './tools/enhance-machine-data.mjs';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {load} from 'cheerio';

const site='https://www.perthroofcare.com.au';
const page=route=>load(readFileSync(join('public',route,'index.html'),'utf8'));
const graph=$=>JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
const types=n=>[n['@type']].flat();

test('each homepage statically discovers exactly its own language RSS in the head',()=>{
 for(const prefix of ['/','/zh/']){
  const $=page(prefix),links=$('head link[rel="alternate"][type="application/rss+xml"]');
  assert.equal(links.length,1,prefix+' has one RSS discovery link');
  assert.equal(links.attr('href'),site+prefix+'news/feed.xml');
  assert.equal($('body link[type="application/rss+xml"]').length,0);
  const rss=load(readFileSync('public'+prefix+'news/feed.xml','utf8'),{xmlMode:true});
  assert.equal(rss('channel > language').text(),prefix==='/zh/'?'zh-Hans':'en-AU');
  assert.equal(rss('channel > atom\\:link[rel="self"]').attr('href'),links.attr('href'));
 }
});

test('service mainEntity and description identify the visible repair scope in both languages',()=>{
 for(const prefix of ['/','/zh/']){
  const $=page(prefix+'roof-leak-repairs/'),g=graph($),s=g.find(n=>types(n).includes('Service'));
  const web=g.find(n=>types(n).includes('WebPage'));
  assert.equal(web.mainEntity?.['@id'],site+prefix+'roof-leak-repairs/#service');
  assert.ok(s.description?.length>30);
  assert.ok($('main').text().includes(s.description));
  assert.equal(web.isPartOf?.['@id'],site+prefix+'#website');
  assert.equal(s.mainEntityOfPage?.['@id'],web['@id']);
 }
});

test('article graph carries stable identity and references real related services',()=>{
 for(const prefix of ['/','/zh/']){
  const $=page(prefix+'news/roof-leak-detection-perth/'),g=graph($);
  const article=g.find(n=>types(n).includes('Article'));
  assert.equal(article['@id'],site+prefix+'news/roof-leak-detection-perth/#article');
  const web=g.find(n=>types(n).includes('WebPage'));
  assert.equal(web.mainEntity?.['@id'],article['@id']);
  assert.ok([article.about].flat().some(n=>n['@id']===site+prefix+'roof-leak-repairs/#service'));
  assert.ok(article.keywords?.length);
 }
});

test('RSS exposes independent summary, full structured body, authors, topics and its self URL',()=>{
 for(const prefix of ['','zh/']){
  const feed=JSON.parse(readFileSync('public/'+prefix+'news/feed.json','utf8'));
  const $=load(readFileSync('public/'+prefix+'news/feed.xml','utf8'),{xmlMode:true});
  assert.equal($('channel > atom\\:link').attr('href'),site+'/'+prefix+'news/feed.xml');
  const entries=$('item').toArray();assert.equal(entries.length,13);
  feed.items.forEach((item,i)=>{
   const node=$(entries[i]);assert.equal(node.find('guid').text(),item.id);
   assert.equal(node.find('description').text(),item.summary);
   assert.equal(node.find('content\\:encoded').text(),item.content_html);
   assert.equal(node.find('dc\\:creator').text(),item.authors[0].name);
   assert.deepEqual(node.find('category').map((_,el)=>$(el).text()).get(),item.tags);
   assert.match(item.content_html,/<h[23][ >]/);
   const body=load(item.content_html);assert.equal(body('script,style,form,nav').length,0);
   assert.ok(item.tags.length>0&&item.tags.length<=6);
   if(prefix)for(const tag of item.tags)assert.match(tag,/\p{Script=Han}/u);
  });
 }
});

test('JSON-LD discovers RSS and JSON feeds without visible widgets or fabricated dates',()=>{
 for(const prefix of ['/','/zh/']){
  const g=graph(page(prefix)),web=g.find(n=>types(n).includes('WebSite'));
  const rss=g.find(n=>n.url===site+prefix+'news/feed.xml');
  assert.equal(rss?.['@type'],'DataFeed');
  assert.equal(rss.encodingFormat,'application/rss+xml');
  assert.ok(web.hasPart.some(n=>n['@id']===rss['@id']));
  assert.equal(rss.dateModified,undefined);
 }
});

test('service collection lists service pages, not photographed project service entities',()=>{
 const g=graph(page('/services/'));
 const list=g.find(n=>n['@id']===site+'/services/#content-list');
 assert.ok(list.itemListElement.length>=20);
 for(const item of list.itemListElement)assert.doesNotMatch(item.url,/\/projects\//);
});

test('all service references have stable identities, including older restoration and project records',()=>{
 const routes=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 const documents=routes.map(route=>({route,g:graph(page(route))}));
 const known=new Set(documents.flatMap(({g})=>g.map(n=>n['@id']).filter(Boolean)));
 for(const {route,g} of documents){
  for(const service of g.filter(n=>types(n).includes('Service'))){assert.ok(service['@id'],route+' service ID');assert.ok(known.has(service['@id']));}
  for(const n of g)for(const key of ['mainEntity','mainEntityOfPage','about','isPartOf'])for(const relation of [n[key]].flat().filter(Boolean)){
   if(typeof relation!=='object')continue;
   assert.ok(Object.keys(relation).length,route+' empty '+key);
   if(relation['@id'])assert.ok(known.has(relation['@id']),route+' unresolved '+relation['@id']);
  }
 }
});

test('enhancement is repeatable and preserves arbitrary feed IDs and XML-sensitive text',()=>{
 const root=mkdtempSync(join('.local-editor','machine-data-test-'));
 try{
  const sitemap=readFileSync('public/sitemap.xml','utf8');
  const routes=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
  const files=['sitemap.xml','news/feed.json','zh/news/feed.json','case-studies.json','zh/case-studies.json',...routes.map(route=>join(route,'index.html'))];
  for(const file of files){const target=join(root,file);mkdirSync(dirname(target),{recursive:true});cpSync(join('public',file),target);}
  const feedPath=join(root,'news/feed.json'),input=JSON.parse(readFileSync(feedPath,'utf8'));
  input.items[0].id='urn:ellis:original-entry';input.items[0].summary='Tiles & flashing <checks> "quoted"';
  writeFileSync(feedPath,JSON.stringify(input));
  // Re-running on already enhanced output must not duplicate graph entities.
  enhanceMachineData(root);
  const rss=load(readFileSync(join(root,'news/feed.xml'),'utf8'),{xmlMode:true});
  assert.equal(rss('item').first().find('guid').text(),'urn:ellis:original-entry');
  assert.equal(rss('item').first().find('guid').attr('isPermaLink'),'false');
  assert.equal(rss('item').first().find('description').text(),'Tiles & flashing <checks> "quoted"');
  for(const route of routes){const $=load(readFileSync(join(root,route,'index.html'),'utf8'));const ids=graph($).map(n=>n['@id']).filter(Boolean);assert.equal(ids.length,new Set(ids).size,route);}
  const original=readFileSync(feedPath,'utf8');enhanceMachineData(root);
  assert.equal(readFileSync(feedPath,'utf8'),original);
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('local GET responses identify RSS separately from the sitemap and serve both languages',async()=>{
 const socket=createServer();await new Promise(resolve=>socket.listen(0,'127.0.0.1',resolve));
 const port=socket.address().port;await new Promise(resolve=>socket.close(resolve));
 const child=spawn(process.execPath,['local-server.mjs'],{env:{...process.env,PORT:String(port),PREVIEW_ONLY:'1'},stdio:['ignore','pipe','pipe']});
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('preview start timeout')),10000);child.stdout.once('data',()=>{clearTimeout(timer);resolve();});child.once('error',reject);});
  for(const path of ['/news/feed.xml','/zh/news/feed.xml','/news/feed.json','/zh/news/feed.json','/sitemap.xml']){
   const response=await fetch('http://127.0.0.1:'+port+path);
   assert.equal(response.status,200,path);
   const expected=path.endsWith('feed.xml')?'application/rss+xml':path.endsWith('.json')?'application/feed+json':'application/xml';
   assert.ok(response.headers.get('content-type').startsWith(expected),path);
   await response.text();
  }
 }finally{child.kill();}
});
