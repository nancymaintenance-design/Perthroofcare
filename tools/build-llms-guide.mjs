import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {load} from 'cheerio';
import {llmsSelection} from '../content/llms-selection.mjs';

const normalize=value=>value.replace(/\s+/gu,' ').trim();
const label=value=>value.replace(/\\/g,'\\\\').replace(/\[/g,'\\[').replace(/\]/g,'\\]');
const groups=[
 ['service','en-AU','English services'],['service','zh-Hans','中文服务'],
 ['company','en-AU','Company, service areas and enquiries'],['company','zh-Hans','公司、服务区域与咨询'],
 ['case','en-AU','Case studies'],['case','zh-Hans','施工案例'],
 ['guide','en-AU','Guides'],['guide','zh-Hans','指南']
];

// Deterministic, offline build only. Returned evidence is internal; only Markdown
// is staged publicly. Page body, metadata and crawler permissions are never edited.
export function createLlmsGuide(root,selection=llmsSelection){
 const urls=[...readFileSync(join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 const documents=new Map(urls.map(url=>[url,load(readFileSync(join(root,new URL(url).pathname,'index.html'),'utf8'))]));
 const home=[...documents.entries()].find(([url])=>new URL(url).pathname==='/');
 if(!home)throw new Error('llms: canonical homepage missing');
 const [homeUrl,homePage]=home,origin=new URL(homeUrl).origin;
 if(urls.some(url=>new URL(url).origin!==origin))throw new Error('llms: mixed production domains');
 const graph=JSON.parse(homePage('script[type="application/ld+json"]').text())['@graph'];
 const website=graph.find(n=>n['@type']==='WebSite'),business=graph.find(n=>n['@type']==='LocalBusiness');
 if(!website?.name||!business?.legalName||!business?.name)throw new Error('llms: business identity missing');
 const backlinks=new Map(urls.map(url=>[url,new Set()]));
 for(const [source,doc] of documents)doc('a[href]').each((_,el)=>{
  try{const target=new URL(doc(el).attr('href'),source).href.split('#')[0];if(target!==source)backlinks.get(target)?.add(source);}catch{}
 });
 const selected=[],seen=new Set();
 for(const item of selection){
  const english=origin+'/'+(item.route?item.route+'/':'');
  const en=documents.get(english);if(!en)throw new Error('llms: selected route is not published: '+english);
  const chinese=en('link[hreflang="zh-Hans"]').attr('href');
  if(!documents.has(chinese))throw new Error('llms: Chinese counterpart missing: '+english);
  for(const [url,language,counterpart] of [[english,'en-AU',chinese],[chinese,'zh-Hans',english]]){
   const $=documents.get(url);if(seen.has(url))throw new Error('llms: duplicate selection: '+url);seen.add(url);
   if(new URL(url).search||new URL(url).hash||/\/(?:api|editor|__editor|404)(?:\/|\.)/.test(new URL(url).pathname))throw new Error('llms: private or parameterized target: '+url);
   if($('link[rel="canonical"]').attr('href')!==url)throw new Error('llms: canonical conflict: '+url);
   if($('html').attr('lang')!==language)throw new Error('llms: wrong page language: '+url);
   if(/noindex|none/i.test($('meta[name="robots"],meta[name="googlebot"]').map((_,e)=>$(e).attr('content')).get().join(',')))throw new Error('llms: noindex target: '+url);
   for(const [lang,target] of [['en-AU',english],['zh-Hans',chinese]])if($(`link[hreflang="${lang}"]`).attr('href')!==target)throw new Error('llms: nonreciprocal language pair: '+url);
   const title=normalize($('main h1').first().text());
   const paragraphs=$('main p').filter((_,e)=>!$(e).is('.eyebrow,.article-byline,.utility')&&!$(e).closest('nav,aside,form,figure,details').length);
   const lead=paragraphs.filter('.article-lead').first();
   const evidence=normalize((lead.length?lead:paragraphs.first()).text());
   const summary=evidence.match(/^.*?(?:[。！？]|[.!?](?=\s|$))/u)?.[0]||evidence;
   if(!title||summary.length<20||summary.length>420)throw new Error('llms: insufficient concise body evidence: '+url);
   const body=normalize($('main').text());
   if(!body.includes(summary)||body.length<250)throw new Error('llms: unreadable main content: '+url);
   const incoming=[...backlinks.get(url)];
   if(!incoming.length)throw new Error('llms: no HTML internal link: '+url);
   selected.push({url,language,role:item.role,intent:title,ownerUrl:item.role==='service'?url:null,counterpart,title,summary,evidence,mainCharacters:body.length,incoming,inSitemap:true,canonical:url,metaNoindex:false,reason:item.role==='service'?'Existing core service Owner route':'Selected '+item.role+' page with substantive visible content'});
  }
 }
 const about=documents.get(origin+'/about/');
 if(!about||!normalize(about('main').text()).includes(`${website.name} is operated by ${business.legalName}.`))throw new Error('llms: operating-company fact not visible');
 const intro=`${website.name} is operated by ${business.legalName}. Roof repairs and drainage services in Perth. Available in English and 简体中文.`;
 const markdown=`# ${website.name} | ${business.name}\n\n> ${intro}\n\n`+groups.map(([role,language,heading])=>{
  const entries=selected.filter(item=>item.role===role&&item.language===language);
  return entries.length?`## ${heading}\n\n${entries.map(item=>`- [${label(item.title)}](${item.url}): ${item.summary}`).join('\n')}\n`:'';
 }).filter(Boolean).join('\n');
 const excluded=urls.filter(url=>!seen.has(url)).map(url=>({url,reason:/\/areas\//.test(url)?'Suburb detail omitted; selected service-area overview is the navigation entry':/\/(privacy|legal)\//.test(url)?'Policy page is reachable from site navigation, not a core service answer':/\/projects\//.test(url)?'Additional case omitted from curated shortlist':/\/news\//.test(url)?'Additional guide/directory omitted from curated shortlist':'Supporting or overlapping intent; existing route retained but not selected'}));
 return {markdown,origin,selected,excluded};
}

export function buildLlmsGuide(root){
 const result=createLlmsGuide(root);writeFileSync(join(root,'llms.txt'),result.markdown,'utf8');return result;
}
