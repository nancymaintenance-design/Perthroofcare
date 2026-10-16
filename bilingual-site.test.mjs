import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync,mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {load} from 'cheerio';
import {runInNewContext} from 'node:vm';
import {collectPageStrings,normalizeSource,sourceId} from './content/i18n/catalog.mjs';

const site='https://www.perthroofcare.com.au';
const routes=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const english=routes.filter(r=>!r.startsWith('/zh/'));
const page=r=>load(readFileSync(join('public',r,'index.html'),'utf8'),{scriptingEnabled:false});
const clean=text=>normalizeSource(text);

test('publication includes exactly 69 complete reciprocal language pairs',()=>{
 assert.equal(english.length,69);assert.equal(routes.length,138);assert.equal(new Set(routes).size,138);
 for(const route of english)for(const [path,language] of [[route,'en-AU'],['/zh'+route,'zh-Hans']]){
  const $=page(path);assert.equal($('html').attr('lang'),language,path);
  assert.equal($('link[rel="canonical"]').attr('href'),site+path,path);
  for(const [lang,target] of [['en-AU',route],['zh-Hans','/zh'+route],['x-default',route]])assert.equal($(`link[hreflang="${lang}"]`).attr('href'),site+target,path);
  assert.equal($('[data-language-switch]').length,1);assert.equal($('[data-language-switch]').attr('href'),language==='en-AU'?'/zh'+route:route);
  if(language==='zh-Hans')assert.match($('main').text(),/\p{Script=Han}/u,path);
 }
});

test('curated dictionary covers every meaningful final English source without fallback',()=>{
 const dictionary={};for(const file of readdirSync('content/i18n/zh').filter(f=>f.endsWith('.json')))for(const [id,value] of Object.entries(JSON.parse(readFileSync(join('content/i18n/zh',file),'utf8')))){assert.ok(!Object.hasOwn(dictionary,id),id);dictionary[id]=value;}
 for(const route of english)for(const [id,source] of collectPageStrings(readFileSync(join('.',route,'index.html'),'utf8'))){assert.equal(typeof dictionary[id],'string',`${route} ${id} ${source}`);assert.notEqual(clean(dictionary[id]),source);assert.match(dictionary[id],/\p{Script=Han}/u);}
});

test('Chinese links resolve and assets, API and contact identities remain shared',()=>{
 const known=new Set(routes);
 for(const route of english){const en=page(route),zh=page('/zh'+route);
  assert.deepEqual(zh('img').map((_,e)=>zh(e).attr('src')).get(),en('img').map((_,e)=>en(e).attr('src')).get(),route);
  assert.deepEqual(zh('script[src]').map((_,e)=>zh(e).attr('src')).get(),en('script[src]').map((_,e)=>en(e).attr('src')).get(),route);
  zh('a[href],link[rel="alternate"]').each((_,e)=>{const href=zh(e).attr('href');if(/^(#|mailto:|tel:)/.test(href))return;const url=new URL(href,site+'/zh'+route);if(url.origin!==site)return;if(url.pathname.endsWith('/')){assert.ok(known.has(url.pathname),`${route} ${href}`);if(zh(e).is('a')&&!zh(e).is('[data-language-switch]'))assert.ok(url.pathname.startsWith('/zh/'),`${route} ${href}`);}else assert.ok(existsSync(join('public',url.pathname)),href);});
  assert.equal(zh('.enquiry-form').attr('action'),en('.enquiry-form').attr('action'));
 }
});

test('Chinese FAQ and knowledge bodies match visible translated content',()=>{
 for(const route of english){const $=page('/zh'+route),visible=new Map();$('details').each((_,e)=>{const node=$(e).clone();const question=clean(node.find('summary').first().text());node.find('summary').remove();visible.set(question,clean(node.text()));});
  const walk=value=>{if(Array.isArray(value))return value.forEach(walk);if(!value||typeof value!=='object')return;if(value.inLanguage)assert.equal(value.inLanguage,'zh-Hans',route);if(value['@type']==='Question')assert.equal(clean(value.acceptedAnswer.text),visible.get(clean(value.name)),route);for(const child of Object.values(value))walk(child);};
  $('script[type="application/ld+json"]').each((_,e)=>walk(JSON.parse($(e).text())));
  const knowledge=$('#page-knowledge');if(knowledge.length){const data=JSON.parse(knowledge.text());for(const section of data.sections||[])assert.ok(clean($('main').text()).includes(clean(section.body)),`${route} knowledge body`);}
 }
});

test('Chinese feeds use real counterpart URLs and translated text with unchanged media and dates',()=>{
 for(const file of ['news/feed.json','case-studies.json']){const en=JSON.parse(readFileSync(join('public',file),'utf8')),zh=JSON.parse(readFileSync(join('public/zh',file),'utf8'));assert.equal(zh.language,'zh-Hans');assert.equal(zh.items.length,en.items.length);assert.match(zh.title,/\p{Script=Han}/u);
  zh.items.forEach((item,i)=>{assert.equal(item.url,en.items[i].url.replace(site,site+'/zh'));const $=page(new URL(item.url).pathname);assert.equal(item.title,clean($('h1').first().text()));assert.match(item.summary,/\p{Script=Han}/u);assert.match(item.content_text,/\p{Script=Han}/u);assert.equal(item.image,en.items[i].image);assert.equal(item.date_published,en.items[i].date_published);assert.equal(item.date_modified,en.items[i].date_modified);});
 }
 const $=load(readFileSync('public/zh/news/feed.xml','utf8'),{xmlMode:true});assert.equal($('channel > language').text(),'zh-Hans');assert.equal($('item').length,JSON.parse(readFileSync('public/zh/news/feed.json','utf8')).items.length);
});

test('locale builder is an explicit strict build module',async()=>{assert.ok(existsSync('tools/build-locales.mjs'));const {buildLocales}=await import('./tools/build-locales.mjs');assert.equal(typeof buildLocales,'function');});

test('locale build fails before writing on missing translation, and repeat locale passes are idempotent',async t=>{
 const {buildLocales}=await import('./tools/build-locales.mjs'),root=mkdtempSync(join(tmpdir(),'roof-locales-'));t.after(()=>rmSync(root,{recursive:true,force:true}));
 mkdirSync(join(root,'content/i18n/zh'),{recursive:true});mkdirSync(join(root,'news'));
 writeFileSync(join(root,'sitemap.xml'),`<urlset><url><loc>${site}/</loc><lastmod>2026-10-14</lastmod></url></urlset>`);
 writeFileSync(join(root,'index.html'),'<html><head><title>Roof repairs</title></head><body><header><nav><a class="button" href="/">Roof repairs</a></nav></header><main><h1>Roof repairs</h1></main></body></html>');
 writeFileSync(join(root,'llms.txt'),'# Company');
 for(const file of ['news/feed.json','case-studies.json'])writeFileSync(join(root,file),JSON.stringify({home_page_url:site+'/',feed_url:site+'/'+file,items:[]}));
 const dictionary=join(root,'content/i18n/zh/batch-001.json');writeFileSync(dictionary,'{}');
 assert.throws(()=>buildLocales(root),/Missing Chinese translation/);assert.equal(existsSync(join(root,'zh')),false);
 writeFileSync(dictionary,JSON.stringify({[sourceId('Roof repairs')]:'屋面维修'}));buildLocales(root);
 const files=['index.html','zh/index.html','sitemap.xml','llms.txt','zh/news/feed.json','zh/news/feed.xml','zh/case-studies.json'];const before=files.map(f=>readFileSync(join(root,f),'utf8'));buildLocales(root);assert.deepEqual(files.map(f=>readFileSync(join(root,f),'utf8')),before);
});

test('Chinese pages retain structure and all 18 working form contracts and no-JavaScript alternatives',()=>{
 let forms=0;
 for(const route of english){const en=page(route),zh=page('/zh'+route);for(const selector of ['main h1','main h2','main h3','main section','main details','main figure','main img'])assert.equal(zh(selector).length,en(selector).length,route+' '+selector);
  const form=zh('.enquiry-form');if(!form.length)continue;forms++;assert.equal(form.attr('action'),'/api/enquiry');assert.equal(form.attr('method'),'post');assert.ok(form.is('[novalidate]'));for(const name of ['name','phone','email','enquiry','privacy'])assert.equal(form.find(`[name="${name}"][required]`).length,1,route);
  assert.equal(form.find('.form-status[role="status"][aria-live="polite"][aria-atomic="true"]').length,1);assert.match(zh('noscript .enquiry-no-js').text(),/\p{Script=Han}/u);
 }assert.equal(forms,18);
 for(const [file,lang,href] of [['404.html','en-AU','/'],['zh/404.html','zh-Hans','/zh/']]){const $=load(readFileSync(join('public',file),'utf8'));assert.equal($('html').attr('lang'),lang);assert.equal($('meta[name="robots"]').attr('content'),'noindex');assert.equal($('main a').attr('href'),href);}
});

function runtime({language='zh-Hans',response={ok:true,json:async()=>({ok:true})},failure}={}){
 const ids=new Map(),handlers={},events={},calls=[];
 const node=(id,value='',type='text')=>{const n={id,value,type,checked:type==='checkbox',attributes:{},dataset:{},handlers:{},textContent:'',setAttribute(k,v){this.attributes[k]=v;},getAttribute(k){return this.attributes[k];},removeAttribute(k){delete this.attributes[k];},focus(){this.focused=true;},closest(){return {append(e){ids.set(e.id,e);}};},remove(){ids.delete(this.id);},addEventListener(k,v){this.handlers[k]=v;}};ids.set(id,n);return n;};
 const fields=['name','phone','email','enquiry','privacy'].map(id=>node(id,id==='email'?'fixture@example.invalid':id==='name'?'中文测试':'测试内容',id==='privacy'?'checkbox':'text'));
 const submit=node('submit');submit.textContent='发送咨询';const status=node('status');const switcher=node('language');switcher.setAttribute('href','/contact/');
 const form={elements:Object.fromEntries(fields.map(f=>[f.id,f])),querySelector:s=>s==='.form-submit'?submit:status,querySelectorAll:()=>fields,addEventListener:(k,v)=>handlers[k]=v,reset(){this.resetCalled=true;}};
 const window={location:{hostname:'127.0.0.1',pathname:'/zh/contact/',search:'?topic=roof',hash:'#enquiry'},addEventListener:(k,v)=>events[k]=v};
 const document={documentElement:{lang:language},querySelector:s=>s==='.enquiry-form'?form:s==='[data-language-switch]'?switcher:null,addEventListener(){},getElementById:id=>id==='enquiry'?form:ids.get(id),createElement:()=>node('')};
 runInNewContext(readFileSync('site.js','utf8'),{window,document,URL,FormData:class {constructor(){return fields.map(f=>[f.id,f.value])[Symbol.iterator]();}},fetch:async(url,options)=>{calls.push({url,options});if(failure)throw new Error(failure);return typeof response==='function'?await response():response;}});
 return {fields,form,submit,status,switcher,handlers,calls,events,window,async send(){await handlers.submit({preventDefault(){}});}};
}

test('language switch preserves active query and valid fragment without storage',()=>{const h=runtime();assert.equal(h.switcher.getAttribute('href'),'/contact/?topic=roof#enquiry');h.window.location.hash='#absent';h.events.hashchange();assert.equal(h.switcher.getAttribute('href'),'/contact/?topic=roof');});
test('Chinese blank and invalid forms focus and describe errors without sending',async()=>{const h=runtime();h.fields[0].value='';h.fields[4].checked=false;await h.send();assert.equal(h.calls.length,0);assert.match(h.status.textContent,/请/);assert.equal(h.fields[0].focused,true);assert.equal(h.fields[0].attributes['aria-invalid'],'true');assert.equal(h.fields[4].attributes['aria-invalid'],'true');h.fields[0].value='中文姓名';h.fields[4].checked=true;h.fields[2].value='invalid';await h.send();assert.equal(h.calls.length,0);assert.equal(h.fields[2].focused,true);});
test('Chinese pending success and duplicate prevention keep transport unchanged',async()=>{let resolve;const pending=new Promise(r=>resolve=r),h=runtime({response:()=>pending});const sending=h.send();assert.equal(h.submit.disabled,true);assert.match(h.submit.textContent,/发送/);assert.match(h.status.textContent,/发送/);await h.send();assert.equal(h.calls.length,1);resolve({ok:true,json:async()=>({ok:true})});await sending;assert.equal(h.submit.disabled,false);assert.equal(h.submit.textContent,'发送咨询');assert.equal(h.form.resetCalled,true);assert.match(h.status.textContent,/已发送/);assert.equal(h.calls[0].url,'/api/enquiry');assert.equal(JSON.parse(h.calls[0].options.body).privacy,true);assert.equal(JSON.parse(h.calls[0].options.body).name,'中文测试');});
for(const error of ['This local preview does not send enquiries. Please review the form without submitting personal details.','Enquiry email is not configured.','We could not send your enquiry. Please try again or use the direct contact details.','Enquiry is too large.','Invalid enquiry data.','Too many enquiries. Please try again later.','Unknown upstream error'])test(`Chinese server failure recovers and retains values: ${error}`,async()=>{const h=runtime({response:{ok:false,json:async()=>({error})}});await h.send();assert.equal(h.form.resetCalled,undefined);assert.equal(h.fields[0].value,'中文测试');assert.equal(h.submit.disabled,false);assert.match(h.status.textContent,/\p{Script=Han}/u);assert.doesNotMatch(h.status.textContent,/[A-Za-z]{3,}/);});
test('Chinese network failure and composition retain inputs and re-enable',async()=>{const h=runtime({failure:'Failed to fetch'});h.handlers.compositionstart();await h.send();assert.equal(h.calls.length,0);h.handlers.compositionend();await h.send();assert.equal(h.calls.length,1);assert.match(h.status.textContent,/网络/);assert.equal(h.submit.disabled,false);assert.equal(h.form.resetCalled,undefined);});
