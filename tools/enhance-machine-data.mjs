import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {load} from 'cheerio';

const site='https://www.perthroofcare.com.au';
const text=node=>node.text().replace(/\s+/gu,' ').trim();
const hasType=(node,type)=>[node['@type']].flat().includes(type);
const ref=node=>({'@id':node['@id']});
const xml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const serialize=value=>JSON.stringify(value).replaceAll('<','\\u003c');

// Final localized HTML is the source of truth. No new public copy, dates or
// credentials are invented here; existing entity and feed identities survive.
export function enhanceMachineData(root){
 const routes=[...readFileSync(join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 const pages=new Map(routes.map(route=>{
  const $=load(readFileSync(join(root,route,'index.html'),'utf8'));
  const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
  // Normalize legacy service nodes before any article or directory references
  // them; sitemap order must never produce an empty relationship object.
  for(const node of graph)if(hasType(node,'Service')&&node.url===site+route)node['@id']??=site+route+'#service';
  return [route,{$,graph,url:site+route,language:$('html').attr('lang')}];
 }));
 for(const prefix of ['/','/zh/']){
  const local=[...pages.entries()].filter(([route])=>route.startsWith('/zh/')===(prefix==='/zh/'));
  const home=pages.get(prefix);
  const websiteId=site+prefix+'#website';
  const businessId=site+'/#business';
  const business=home.graph.find(n=>hasType(n,'LocalBusiness'));
  const services=new Map(local.filter(([route,p])=>route.slice(prefix.length).split('/').filter(Boolean).length===1&&p.graph.some(n=>hasType(n,'Service')&&n.url===p.url)));
  const summary=p=>{
   const paragraphs=p.$('main p').filter((_,el)=>!p.$(el).is('.eyebrow,.article-byline,.utility')&&!p.$(el).closest('nav,aside,form,figure,details').length);
   const lead=paragraphs.filter('.article-lead').first();
   return text(lead.length?lead:paragraphs.first());
  };
  const related=p=>{
   const urls=new Set(p.$('main a[href]').map((_,el)=>{
    const u=new URL(p.$(el).attr('href'),p.url);return u.origin===site?u.pathname:'';
   }).get());
   return [...urls].filter(url=>services.has(url)).map(url=>{
    const target=services.get(url),node=target.graph.find(n=>hasType(n,'Service')&&n.url===target.url);
    return {node,page:target};
   });
  };
  const feeds=[['news/feed.xml','application/rss+xml'],['news/feed.json','application/feed+json'],['case-studies.json','application/feed+json']].map(([path,format])=>({
   '@type':'DataFeed','@id':site+prefix+path+'#feed',url:site+prefix+path,
   name:text(pages.get(prefix+(path.startsWith('news/')?'news/':'gallery/')).$('main h1').first()),
   encodingFormat:format,inLanguage:home.language,publisher:{'@id':businessId},
   isPartOf:{'@id':websiteId}
  }));
  for(const [route,p] of local){
   const {$,graph,url,language}=p;
   let website=graph.find(n=>hasType(n,'WebSite'));
   if(!website){website={'@type':'WebSite','@id':websiteId,name:'Perth Roof Care',url:site+prefix,inLanguage:language,publisher:{'@id':businessId}};graph.push(website);}
   website.hasPart=feeds.map(ref);
   // The same small feed identities are resolvable from every page's graph.
   for(const feed of feeds)if(!graph.some(n=>n['@id']===feed['@id']))graph.push(structuredClone(feed));
   const organization=graph.find(n=>n['@id']===site+'/#ellis-services-group');
   if(organization){organization.url=site+'/';organization.description=business.description;}
   const web=graph.find(n=>hasType(n,'WebPage'));
   if(!web)throw new Error('Missing WebPage: '+route);
   web.isPartOf={'@id':websiteId};
   const service=graph.find(n=>hasType(n,'Service')&&n.url===url);
   if(service){service.description=summary(p);service.mainEntityOfPage=ref(web);web.mainEntity=ref(service);}
   const article=graph.find(n=>hasType(n,'Article'));
   const topics=related(p);
   if(article){
    article['@id']??=url+'#article';article.url=url;article.mainEntityOfPage=ref(web);web.mainEntity=ref(article);
    article.about=[...([article.about].flat().filter(Boolean)),...topics.map(({node})=>ref(node))].filter((n,i,a)=>a.findIndex(v=>JSON.stringify(v)===JSON.stringify(n))===i);
    article.keywords=topics.slice(0,6).map(({node})=>node.name);
   }
   if(route===prefix+'about/'){
    const about=graph.find(n=>hasType(n,'AboutPage'));
    if(about){about.isPartOf={'@id':websiteId};about.mainEntity={'@id':site+'/#ellis-services-group'};web.mainEntity=ref(about);}
   }
   if(route===prefix+'contact/')web['@type']=['WebPage','ContactPage'];
   if([prefix+'services/',prefix+'news/',prefix+'gallery/'].includes(route)){
    const linked=[...new Set($('main a[href]').map((_,el)=>new URL($(el).attr('href'),url).href.split('#')[0]).get())].map(link=>pages.get(new URL(link).origin===site?new URL(link).pathname:'' )).filter(Boolean);
    const wanted=linked.filter(target=>route.endsWith('/services/')?services.has(new URL(target.url).pathname):route.endsWith('/news/')?target.url.includes('/news/')&&target.url!==url:target.url.includes('/projects/'));
    const list={'@type':'ItemList','@id':url+'#content-list',itemListElement:wanted.map((target,index)=>({'@type':'ListItem',position:index+1,name:text(target.$('main h1').first()),url:target.url}))};
    const index=graph.findIndex(n=>n['@id']===list['@id']);
    if(index<0)graph.push(list);else graph[index]=list;
    web.mainEntity=ref(list);
   }
   $('script[type="application/ld+json"]').text(serialize({'@context':'https://schema.org','@graph':graph}));
   writeFileSync(join(root,route,'index.html'),$.html());
  }
  for(const path of ['news/feed.json','case-studies.json']){
   const file=join(root,prefix,path),feed=JSON.parse(readFileSync(file,'utf8'));
   feed.items=feed.items.map(item=>{
    const p=pages.get(new URL(item.url).pathname);
    if(!p)throw new Error('Feed page missing: '+item.url);
    const body=p.$('main').clone();
    body.find('script,style,nav,form,iframe,aside,.article-byline').remove();
    // Expand relative URLs for standalone feed readers, without changing pages.
    body.find('[href],[src]').each((_,el)=>{for(const key of ['href','src']){const value=p.$(el).attr(key);if(value)p.$(el).attr(key,new URL(value,p.url).href);}});
    const topics=related(p).slice(0,6).map(({node})=>node.name);
    return {...item,content_html:body.html(),tags:topics.length?topics:[text(p.$('main h1').first())],authors:[{name:business.name,url:site+prefix+'about/'}]};
   });
   writeFileSync(file,JSON.stringify(feed,null,2)+'\n');
   if(path==='news/feed.json')writeFileSync(join(root,prefix,'news/feed.xml'),rss(feed));
  }
 }
 return {pages:pages.size};
}

function rss(feed){
 return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>${xml(feed.title)}</title><link>${xml(feed.home_page_url)}</link><description>${xml(feed.description)}</description><language>${xml(feed.language)}</language><atom:link href="${xml(feed.feed_url.replace(/\.json$/,'.xml'))}" rel="self" type="application/rss+xml"/>${feed.items.map(item=>`<item><title>${xml(item.title)}</title><link>${xml(item.url)}</link><guid isPermaLink="${item.id===item.url}">${xml(item.id)}</guid><description>${xml(item.summary)}</description><content:encoded>${xml(item.content_html)}</content:encoded>${item.authors.map(a=>`<dc:creator>${xml(a.name)}</dc:creator>`).join('')}${item.tags.map(tag=>`<category>${xml(tag)}</category>`).join('')}${item.date_published?`<pubDate>${new Date(item.date_published).toUTCString()}</pubDate>`:''}</item>`).join('')}</channel></rss>`;
}
