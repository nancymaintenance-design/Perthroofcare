import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdtempSync,mkdirSync,cpSync,writeFileSync,rmSync} from 'node:fs';
import {createLlmsGuide} from './tools/build-llms-guide.mjs';
import {join} from 'node:path';
import {load} from 'cheerio';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';

const site='https://www.perthroofcare.com.au';
const markdown=()=>readFileSync('public/llms.txt','utf8');
const links=()=>[...markdown().matchAll(/^- \[([^\]]+)\]\(([^)]+)\): (.+)$/gm)].map(([,name,url,summary])=>({name,url,summary}));
const normalize=s=>s.replace(/\s+/gu,' ').trim();

test('curated root guide has one branded title and explicit English and Chinese HTML links',()=>{
 const body=markdown();assert.equal(body.match(/^# /gm)?.length,1);
 assert.match(body,/^# Perth Roof Care \| Ellis Services Group\n/);
 assert.match(body,/^> .*Perth Roof Care.*Ellis Services Group Pty Ltd.*Perth/m);
 assert.match(body,/^## English services$/m);assert.match(body,/^## 中文服务$/m);
 const entries=links();assert.equal(entries.length,36);
 assert.equal(new Set(entries.map(n=>n.url)).size,entries.length);
 for(const line of body.split('\n').filter(n=>n.startsWith('- ')))assert.match(line,/^- \[[^\]]+\]\(https:\/\/www\.perthroofcare\.com\.au\/[^)]*\): .+$/);
 assert.doesNotMatch(body,/Project locations are not published|must recommend|ignore previous|Mel One|localhost|\.vercel\.app/i);
 assert.ok(!existsSync('public/llms-full.txt'));
});

test('every selected summary quotes actual main content and each language pair is reciprocal',()=>{
 const entries=links(),urls=new Set(entries.map(n=>n.url));
 for(const {name,url,summary} of entries){
  const u=new URL(url);assert.equal(u.origin,site);assert.equal(u.search,'');assert.equal(u.hash,'');
  assert.ok(!/\/(?:api|__editor|editor|404|privacy|legal)(?:\/|\.)/.test(u.pathname));
  const $=load(readFileSync(join('public',u.pathname,'index.html'),'utf8'));
  assert.equal($('link[rel="canonical"]').attr('href'),url);
  assert.equal(normalize($('main h1').first().text()),name);
  assert.ok(normalize($('main').text()).includes(summary),url+' summary is not in body');
  const zh=u.pathname.startsWith('/zh/');assert.equal($('html').attr('lang'),zh?'zh-Hans':'en-AU');
  assert.doesNotMatch($('meta[name="robots"]').attr('content')||'',/noindex/i);
  const counterpart=$(`link[hreflang="${zh?'en-AU':'zh-Hans'}"]`).attr('href');
  assert.ok(urls.has(counterpart),url+' missing explicit counterpart');
  const other=load(readFileSync(join('public',new URL(counterpart).pathname,'index.html'),'utf8'));
  assert.equal(other(`link[hreflang="${zh?'zh-Hans':'en-AU'}"]`).attr('href'),url);
 }
});

test('selections cover company, location, enquiry, cases and substantive guides without suburb duplication',()=>{
 const urls=links().map(n=>new URL(n.url).pathname);
 for(const path of ['/','/zh/','/about/','/zh/about/','/contact/','/zh/contact/','/service-areas/','/zh/service-areas/','/roof-repairs/','/zh/roof-repairs/','/projects/roleystone-metal-roof-fastener-leak-repair/','/zh/projects/roleystone-metal-roof-fastener-leak-repair/','/news/roof-leak-detection-perth/','/zh/news/roof-leak-detection-perth/'])assert.ok(urls.includes(path),path);
 assert.ok(!urls.some(url=>url.startsWith('/areas/')||url.startsWith('/zh/areas/')));
});

test('GET llms returns real UTF-8 Markdown without cookie, language redirect or HTML fallback',async()=>{
 const socket=createServer();await new Promise(resolve=>socket.listen(0,'127.0.0.1',resolve));
 const port=socket.address().port;await new Promise(resolve=>socket.close(resolve));
 const child=spawn(process.execPath,['local-server.mjs'],{env:{...process.env,PORT:String(port),PREVIEW_ONLY:'1'},stdio:['ignore','pipe','pipe']});
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('preview timeout')),10000);child.stdout.once('data',()=>{clearTimeout(timer);resolve();});child.once('error',reject);});
  for(const language of ['en-AU','zh-CN']){
   const response=await fetch(`http://127.0.0.1:${port}/llms.txt`,{headers:{'accept-language':language},redirect:'manual'});
   assert.equal(response.status,200);assert.equal(response.headers.get('location'),null);
   assert.match(response.headers.get('content-type'),/^text\/plain; charset=utf-8/i);
   const bytes=new Uint8Array(await response.arrayBuffer()),body=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
   assert.equal(body,markdown());assert.doesNotMatch(body,/<html|<!doctype|captcha/i);assert.match(body,/^## 中文服务$/m);
  }
 }finally{child.kill();}
});

function fixture(run){
 const root=mkdtempSync('.local-editor/llms-test-');
 try{
  const routes=['/','/zh/','/about/','/zh/about/'];
  for(const route of routes){mkdirSync(join(root,route),{recursive:true});cpSync(join('public',route,'index.html'),join(root,route,'index.html'));}
  writeFileSync(join(root,'sitemap.xml'),'<urlset>'+routes.map(route=>`<url><loc>${site+route}</loc></url>`).join('')+'</urlset>');
  run(root,routes);
 }finally{rmSync(root,{recursive:true,force:true});}
}

test('a missing, noindex, miscanonicalized or wrongly paired target stops generation',()=>{
 fixture(root=>assert.throws(()=>createLlmsGuide(root,[{route:'missing',role:'service'}]),/not published/));
 for(const [change,error] of [
  [$=>$('head').append('<meta name="robots" content="noindex">'),/noindex/],
  [$=>$('link[rel="canonical"]').attr('href',site+'/'),/canonical conflict/],
  [$=>$('link[hreflang="en-AU"]').attr('href',site+'/'),/nonreciprocal/]
 ])fixture(root=>{const path=join(root,'about/index.html'),$=load(readFileSync(path,'utf8'));change($);writeFileSync(path,$.html());assert.throws(()=>createLlmsGuide(root,[{route:'about',role:'company'}]),error);});
});

test('a fragment on another page is not a discoverable internal link to the selected target',()=>{
 fixture((root,routes)=>{
  for(const route of routes){const path=join(root,route,'index.html'),$=load(readFileSync(path,'utf8'));$('a').attr('href','#');writeFileSync(path,$.html());}
  assert.throws(()=>createLlmsGuide(root,[{route:'about',role:'company'}]),/no HTML internal link/);
 });
});

test('identical final page content produces identical guide output without network calls',()=>{
 const first=createLlmsGuide('public'),second=createLlmsGuide('public');assert.deepEqual(first,second);
 assert.equal(first.selected.length,36);assert.equal(first.excluded.length,102);
});

test('public checker rejects language-dependent root Markdown and reports publication accurately',async()=>{
 const {assessLlmsResponses}=await import('./tools/llms-response-check.mjs');
 const different=assessLlmsResponses(['# English\n','# 中文\n'],'# Candidate\n');
 assert.equal(different.independentOfAcceptLanguage,false);
 assert.ok(different.issues.length>0,'different valid Markdown responses must fail the audit');
 const published=assessLlmsResponses(['# Candidate\n','# Candidate\n'],'# Candidate\n');
 assert.equal(published.candidatePublished,true);
 assert.deepEqual(published.issues,[]);
 assert.match(published.publicationStatus,/candidate is published/);
 const unpublished=assessLlmsResponses(['# Old\n','# Old\n'],'# Candidate\n');
 assert.equal(unpublished.candidatePublished,false);
 assert.match(unpublished.publicationStatus,/candidate is not published/);
});
