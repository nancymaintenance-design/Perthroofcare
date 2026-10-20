import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
import {createNavigationMap,priorityServices} from '../content/service-navigation.mjs';
const origin='https://www.perthroofcare.com.au';
const routes=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
const pages=new Map(routes.map(path=>[path,{$:load(readFileSync('public'+path+'index.html','utf8'))}]));
const mapping=createNavigationMap(pages,origin);
const before=JSON.parse(readFileSync(process.argv[2],'utf8'));
const after=routes.map(path=>{
 const $=pages.get(path).$;
 return {url:origin+path,language:$('html').attr('lang'),h1:$('h1').text(),canonical:$('link[rel=canonical]').attr('href'),hreflang:$('link[hreflang]').map((_,e)=>({lang:$(e).attr('hreflang'),url:$(e).attr('href')})).get(),noindex:$('meta[name=robots]').attr('content')||'',breadcrumb:$('.breadcrumbs').text(),links:$('a[href]').map((_,a)=>({href:$(a).attr('href'),label:$(a).text().replace(/\s+/g,' ').trim(),kind:$(a).closest('.breadcrumbs').length?'breadcrumb':$(a).closest('header,footer').length?'navigation':'content'})).get()};
});
function metrics(rows,prefix){
 const local=rows.filter(r=>new URL(r.url).pathname.startsWith('/zh/')===(prefix==='/zh/'));
 const paths=new Map(local.map(r=>[r.url,r]));
 const edges=new Map(local.map(r=>[r.url,[...new Set(r.links.map(l=>new URL(l.href,r.url)).filter(u=>u.origin===origin).map(u=>u.origin+u.pathname).filter(u=>paths.has(u)&&u!==r.url))]]));
 const distances=new Map([[origin+prefix,0]]),queue=[origin+prefix];
 while(queue.length){const u=queue.shift();for(const v of edges.get(u)||[])if(!distances.has(v)){distances.set(v,distances.get(u)+1);queue.push(v);}}
 return ['',...priorityServices].map(route=>{
  const url=origin+prefix+(route?route+'/':''),sources={};
  for(const kind of ['navigation','breadcrumb','content'])sources[kind]=local.filter(r=>r.url!==url&&r.links.some(l=>l.kind===kind&&new URL(l.href,r.url).origin+new URL(l.href,r.url).pathname===url)).map(r=>r.url);
  return {url,clickDistance:distances.get(url)??null,sources,uniqueSources:[...new Set(Object.values(sources).flat())].length};
 });
}
const issues=[];
for(const row of after){
 const old=before.find(r=>r.url===row.url);
 for(const key of ['canonical','hreflang','noindex','h1'])if(JSON.stringify(row[key])!==JSON.stringify(old?.[key]))issues.push({url:row.url,issue:key+' changed'});
 const $=pages.get(new URL(row.url).pathname).$;
 for(const a of $('main .breadcrumbs a,main [data-service-handoff] a,main [data-service-resources] a').toArray()){
  const target=$(a).attr('href'),u=new URL(target,row.url);
  if(u.origin!==origin||!pages.has(u.pathname)||u.search||u.hash||u.pathname.startsWith('/zh/')!==new URL(row.url).pathname.startsWith('/zh/'))issues.push({url:row.url,issue:'invalid navigation target',target});
 }
}
console.log(JSON.stringify({checkedAt:new Date().toISOString(),mapping:[...mapping.values()].map(({definition,...record})=>({...record,evidence:{title:pages.get(record.path).$('h1').text(),intro:pages.get(record.path).$('main p:not(.eyebrow,.article-byline)').first().text().slice(0,650)}})),before:metrics(before,'/').concat(metrics(before,'/zh/')),after:metrics(after,'/').concat(metrics(after,'/zh/')),issues,exclusions:['English and Chinese homepages: no one-item breadcrumb','Two noindex 404 documents, editor, API, non-HTML feeds/assets: not commercial hierarchy pages'],analytics:{gsc:'No current authorized data: Ahrefs project access returned Insufficient plan. Historical Sep 30 snapshot is not a 28-day baseline.',ga4:'Existing gtag reused; no reporting connector or verified current export. Delivery and property event configuration not verified.',leads:'No authorized lead inbox/delivery audit performed; clicks are not confirmed enquiries.'}},null,2));
if(issues.length)process.exitCode=1;
