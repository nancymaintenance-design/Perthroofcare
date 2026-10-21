import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';

// Run the real CLI against the built site, with transport fixtures that cannot
// send enquiries or reach the network. Public files themselves are not edited.
function runReleaseCheck(scenario) {
 const preload=`
 import {readFileSync} from 'node:fs';
 import {createRequire} from 'node:module';
 const {load}=createRequire(process.cwd()+'/package.json')('cheerio');
 const scenario=${JSON.stringify(scenario)};
 const origin='https://www.perthroofcare.com.au';
 const home=load(readFileSync('public/index.html','utf8'));
 const secondCss=home('link[rel="stylesheet"]').eq(1).attr('href');
 globalThis.fetch=async(input,options={})=>{
  const url=new URL(input);
  if(url.origin!==origin||(options.method&&options.method!=='GET'))throw new Error('Only same-origin GET is allowed');
  if(url.pathname==='/index.html')return new Response(null,{status:308,headers:{location:'/'+url.search}});
  if(url.pathname==='/api/enquiry')return new Response(null,{status:405});
  if(url.pathname==='/seo-release-nonexistent-20261010')return new Response(null,{status:404});
  const path=url.pathname;
  let body=readFileSync('public'+path+(path.endsWith('/')?'index.html':''));
  let type=path.endsWith('.css')?'text/css; charset=utf-8':path.endsWith('.xml')?'application/xml':path.endsWith('.txt')?'text/plain':'text/html';
  if(path==='/zh/news/drainage-after-rain/'&&(scenario==='omit-style'||scenario==='reverse-styles')){
   const $=load(body.toString());const links=$('link[rel="stylesheet"]');
   if(scenario==='omit-style')links.eq(1).remove();else links.first().before(links.eq(1));
   body=$.html();
  }
  if(path===secondCss){
   if(scenario==='missing-css')return new Response('Missing',{status:404});
   if(scenario==='html-css')type='text/html';
   if(scenario==='changed-css')body=Buffer.from('body{display:none}');
  }
  return new Response(body,{status:200,headers:{'content-type':type,'cache-control':'public, max-age=3600'}});
 };
 `;
 return new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['--import','data:text/javascript,'+encodeURIComponent(preload),'tools/verify-release.mjs','https://www.perthroofcare.com.au'],{cwd:process.cwd(),stdio:['ignore','pipe','pipe']});
  let output='';child.stdout.on('data',data=>output+=data);child.stderr.on('data',data=>output+=data);
  child.on('error',reject);child.on('close',code=>resolve({code,output}));
 });
}

test('release check accepts current bilingual pages with both stylesheet layers',async()=>{
 const result=await runReleaseCheck('valid');
 assert.equal(result.code,0,result.output);
 const summary=JSON.parse(result.output);
 assert.equal(summary.pages,138);
 assert.ok(summary.stylesheets.length>1);
 assert.ok(summary.stylesheets.every(css=>css.status===200&&css.matchesLocal));
});

for(const [scenario,message] of [
 ['omit-style',/stylesheet order/],
 ['reverse-styles',/stylesheet order/],
 ['missing-css',/stylesheet status/],
 ['html-css',/stylesheet content type/],
 ['changed-css',/stylesheet content/]
])test('release check rejects '+scenario,async()=>{
 const result=await runReleaseCheck(scenario);
 assert.notEqual(result.code,0,result.output);
 assert.match(result.output,message);
});
