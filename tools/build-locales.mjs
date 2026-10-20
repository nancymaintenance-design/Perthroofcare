import {readFileSync,writeFileSync,readdirSync,mkdirSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {load} from 'cheerio';
import {localizePage,MissingTranslationError} from '../content/i18n/localize.mjs';
import {normalizeSource,sourceId} from '../content/i18n/catalog.mjs';
import {localizeHomeReviews} from '../content/home-reviews.mjs';

const site='https://www.perthroofcare.com.au';
const serialize=value=>JSON.stringify(value).replace(/</g,'\\u003c');
const text=node=>normalizeSource(node.text());
const feedPaths=['/news/feed.json','/news/feed.xml','/case-studies.json'];
const localeFeed=value=>feedPaths.reduce((result,path)=>result===path||result===site+path?result.replace(path,'/zh'+path):result,value);

function synchronizeChinese(html,route){
 const $=load(html,{scriptingEnabled:false});
 if(route==='/')localizeHomeReviews($);
 const disclosures=$('main details').map((_,el)=>{const node=$(el).clone(),question=text(node.find('summary'));node.find('summary').remove();return {question,answer:text(node)};}).get();
 const paragraphs=$('main p').filter((_,el)=>!$(el).is('.eyebrow,.article-byline,.utility')&&!$(el).closest('nav,aside,footer,form,details,figure,.utility').length);
 const lead=paragraphs.filter('.article-lead').first();
 const summary=text(lead.length?lead:paragraphs.first());
 const align=value=>{
  if(Array.isArray(value))return value.map(align);
  if(!value||typeof value!=='object')return typeof value==='string'?localeFeed(value):value;
  if(value['@type']==='Question'){
   const answer=disclosures.find(d=>d.question===normalizeSource(value.name));
   if(!answer)throw new Error(`Chinese FAQ has no visible question: ${route} ${value.name}`);
   value.acceptedAnswer.text=answer.answer;
  }
  if(value['@type']==='Article'&&value.articleBody)value.articleBody=text($('main article').first());
  return Object.fromEntries(Object.entries(value).map(([key,child])=>[key,align(child)]));
 };
 $('script[type="application/ld+json"]').each((_,el)=>$(el).text(serialize(align(JSON.parse($(el).text())))));
 const knowledge=$('#page-knowledge');if(knowledge.length){const data=align(JSON.parse(knowledge.text()));data.inLanguage='zh-Hans';data.summary=summary;data.questions=route==='/faq/'?disclosures:[];data.guidance=route==='/faq/'?[]:disclosures.map(d=>({heading:d.question,body:d.answer}));knowledge.text(serialize(data));}
 $('a[href],link[href]').each((_,el)=>{const node=$(el);node.attr('href',localeFeed(node.attr('href')));});
 return $.html();
}

function chineseFeed(root,path,pages,dictionary){
 const english=JSON.parse(readFileSync(join(root,path),'utf8'));
 const news=path.startsWith('news/');
 return {...english,title:news?'屋面维修指南 | Ellis Services Group':'Perth Roof Care 屋面维修案例记录',description:news?'Ellis Services Group 屋面维修与保养指南。':'Ellis Services Group 屋面维修项目的现场照片与施工记录。',home_page_url:english.home_page_url.replace(site,site+'/zh'),feed_url:english.feed_url.replace(site,site+'/zh'),language:'zh-Hans',items:english.items.map((item,index)=>{
  const route=new URL(item.url).pathname,$=load(pages.get(route),{scriptingEnabled:false});
  const title=text($('h1').first());
  const body=$('main p,main h2,main h3,main li,main figcaption').filter((_,el)=>!$(el).closest('form,nav,aside').length).map((_,el)=>text($(el))).get().filter(Boolean).join('\n\n');
  const attachments=item.attachments?.map((attachment,attachmentIndex)=>{
   if(!Object.hasOwn(attachment,'title'))return attachment;
   const source=normalizeSource(attachment.title),id=sourceId(source),translated=Object.hasOwn(dictionary,id)?dictionary[id]:undefined;
   if(typeof translated!=='string'||!translated.trim()||normalizeSource(translated)===source||!/\p{Script=Han}/u.test(translated))throw new MissingTranslationError(source,{route,location:`${path}.items[${index}].attachments[${attachmentIndex}].title`});
   return {...attachment,title:translated.trim()};
  });
  return {...item,id:item.id===item.url?item.id.replace(site,site+'/zh'):item.id,url:item.url.replace(site,site+'/zh'),title,summary:$('meta[name="description"]').attr('content'),content_text:body,...(item.tags?{tags:[title]}:{}),...(attachments?{attachments}:{})};
 })};
}

const xml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function rss(feed){return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${xml(feed.title)}</title><link>${xml(feed.home_page_url)}</link><description>${xml(feed.description)}</description><language>zh-Hans</language>${feed.items.map(item=>`<item><title>${xml(item.title)}</title><link>${xml(item.url)}</link><guid isPermaLink="true">${xml(item.url)}</guid><description>${xml(item.content_text)}</description>${item.date_published?`<pubDate>${new Date(item.date_published).toUTCString()}</pubDate>`:''}</item>`).join('')}</channel></rss>`;}

export function buildLocales(root){
 const sitemapFile=join(root,'sitemap.xml'),sitemap=load(readFileSync(sitemapFile,'utf8'),{xmlMode:true});
 const entries=sitemap('url').toArray().filter(el=>!new URL(sitemap(el).find('loc').text()).pathname.startsWith('/zh/'));
 const routes=entries.map(el=>new URL(sitemap(el).find('loc').text()).pathname);
 const dictionary={};
 for(const file of readdirSync(join(root,'content/i18n/zh')).filter(name=>/^batch-\d+\.json$/.test(name)).sort())for(const [id,value] of Object.entries(JSON.parse(readFileSync(join(root,'content/i18n/zh',file),'utf8')))){
  if(Object.hasOwn(dictionary,id))throw new Error(`Duplicate translation ID: ${id}`);dictionary[id]=value;
 }
 // Validate every source before publishing any locale page. Missing copy fails the build.
 const chinese=new Map(),english=new Map();
 for(const route of routes){const html=readFileSync(join(root,route,'index.html'),'utf8'),options={route,englishRoutes:routes,siteBase:site,translations:dictionary};chinese.set(route,synchronizeChinese(localizePage(html,{...options,language:'zh-Hans'}),route));english.set(route,localizePage(html,{...options,language:'en-AU'}));}
 const news=chineseFeed(root,'news/feed.json',chinese,dictionary),cases=chineseFeed(root,'case-studies.json',chinese,dictionary);
 const write=(path,body)=>{const file=join(root,path);mkdirSync(dirname(file),{recursive:true});writeFileSync(file,body);};
 for(const route of routes){write(join(route,'index.html'),english.get(route));write(join('zh',route,'index.html'),chinese.get(route));}
 write('zh/news/feed.json',JSON.stringify(news,null,2)+'\n');write('zh/news/feed.xml',rss(news));write('zh/case-studies.json',JSON.stringify(cases,null,2)+'\n');
 sitemap('url').remove();for(const entry of entries)sitemap('urlset').append(entry);for(const entry of entries){const localized=sitemap(entry).clone();localized.find('loc').text(site+'/zh'+new URL(localized.find('loc').text()).pathname);sitemap('urlset').append(localized);}writeFileSync(sitemapFile,sitemap.xml());
 for(const [path,lang,title,body,home,label] of [['404.html','en-AU','Page not found','The page could not be found. Return to the homepage to find a roof repair service.','/','Return home'],['zh/404.html','zh-Hans','找不到此页面','此页面不存在。请返回首页查找屋面维修服务。','/zh/','返回首页']])write(path,`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} | Perth Roof Care</title></head><body><main><h1>${title}</h1><p>${body}</p><a href="${home}">${label}</a></main></body></html>`);
 console.log(`Languages: ${routes.length} English + ${chinese.size} Chinese pages; strict translations.`);
 return {englishRoutes:routes,chineseRoutes:routes.map(route=>'/zh'+route)};
}
