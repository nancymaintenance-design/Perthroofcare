import {createRequire} from 'node:module';
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
const require=createRequire(import.meta.url);
const {chromium}=require(require.resolve('playwright',{paths:[process.argv[3]]}));
const reportDirectory=process.argv[2],base=process.env.NAV_TEST_BASE||'http://127.0.0.1:4184';
const browser=await chromium.launch({headless:true});
const report={checkedAt:new Date().toISOString(),base,viewports:[],requests:[],clicks:[],issues:[],screenshots:[]};
try{
 const routes=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 for(const path of routes){
  const response=await fetch(base+path),body=await response.text(),$=load(body);
  const expected=load(readFileSync('public'+path+'index.html','utf8'));
  const valid=response.status===200&&response.url===base+path&&$('main').text().trim().length>150&&$('link[rel=canonical]').attr('href')==='https://www.perthroofcare.com.au'+path&&$('h1').text()===expected('h1').text()&&$('html').attr('lang')===expected('html').attr('lang')&&!/captcha|<meta[^>]+noindex/i.test(body);
  report.requests.push({path,status:response.status,finalUrl:response.url,canonical:$('link[rel=canonical]').attr('href'),language:$('html').attr('lang'),mainCharacters:$('main').text().trim().length,valid});if(!valid)report.issues.push({path,issue:'local GET failed'});
 }
 const samples=['/roof-leak-repairs/','/downpipe-repairs/','/news/roof-leak-detection-perth/','/projects/tile-roof-chimney-flashing-repair-perth/','/projects/wa-6121-tile-roof-valley-gutter-cleaning/','/areas/cottesloe-roof-repairs/','/about/','/contact/','/services/'];
 const page=await browser.newPage({reducedMotion:'reduce'});
 // Keep every navigation in this test local; production canonical hrefs are
 // deliberately absolute, so rewrite only the test browser's transport.
 await page.route('https://www.perthroofcare.com.au/**',async route=>{
  const url=new URL(route.request().url());
  const response=await route.fetch({url:base+url.pathname+url.search});
  await route.fulfill({response});
 });
 for(const width of [360,390,768,1440])for(const prefix of ['','/zh'])for(const path of samples){
  await page.setViewportSize({width,height:900});
  await page.goto(base+prefix+path,{waitUntil:'networkidle'});
  const check=await page.evaluate(()=>{
   const nav=document.querySelector('main .breadcrumbs'),first=nav.querySelector('a');first.focus();
   const rect=nav.getBoundingClientRect(),style=getComputedStyle(first);
   const links=[...document.querySelectorAll('main .breadcrumbs a,main [data-service-handoff] a,main [data-service-resources] a')];
   return {pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,breadcrumbWidth:rect.width,breadcrumbHeight:rect.height,focus:document.activeElement===first,outline:style.outlineStyle,linkCount:links.length,emptyLinks:links.filter(a=>!a.textContent.trim()).length,heading:document.querySelector('h1').textContent,contact:!!document.querySelector('main a[href$="/contact/"], main form')};
  });
  report.viewports.push({width,path:prefix+path,...check});
  if(check.pageWidth>width+1||!check.focus||check.outline==='none'||check.emptyLinks||!check.contact)report.issues.push({width,path:prefix+path,issue:'overflow/focus/link/enquiry failure',check});
  if(path==='/news/roof-leak-detection-perth/'){
   const name=`guide-${prefix?'zh':'en'}-${width}.png`;
   await page.screenshot({path:join(reportDirectory,name),fullPage:false});report.screenshots.push(name);
  }
 }
 for(const prefix of ['','/zh']){
  await page.goto(base+prefix+'/news/roof-leak-detection-perth/');
  await page.locator('.breadcrumbs a').last().click();
  await page.waitForURL('**'+prefix+'/roof-leak-repairs/');
  assert.match(await page.locator('h1').innerText(),prefix?/(渗漏|漏水)/:/Roof leak repairs/i);
  report.clicks.push({source:prefix+'/news/roof-leak-detection-perth/',target:prefix+'/roof-leak-repairs/',passed:true});
  await page.goto(base+prefix+'/projects/tile-roof-chimney-flashing-repair-perth/');
  await page.locator('[data-enquiry-link]').click();await page.waitForURL('**'+prefix+'/contact/');
  assert.equal(await page.locator('.enquiry-form').count(),1);
  report.clicks.push({source:prefix+'/projects/tile-roof-chimney-flashing-repair-perth/',target:prefix+'/contact/',passed:true});
 }
 report.result=report.issues.length?'FAIL':'PASS';
}finally{await browser.close();writeFileSync(join(reportDirectory,'browser-results.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({result:report.result,requests:report.requests.length,viewports:report.viewports.length,clicks:report.clicks.length,issues:report.issues},null,2));
if(report.issues.length)process.exitCode=1;
