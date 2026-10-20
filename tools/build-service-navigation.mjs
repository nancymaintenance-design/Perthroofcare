import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {load} from 'cheerio';
import {createNavigationMap,breadcrumbTrail} from '../content/service-navigation.mjs';

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const serialize=value=>JSON.stringify(value).replaceAll('<','\\u003c');
const hasType=(node,type)=>[node['@type']].flat().includes(type);

export function buildServiceNavigation(root){
 const urls=[...readFileSync(join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 const origin=new URL(urls[0]).origin;
 const pages=new Map(urls.map(url=>[new URL(url).pathname,{$:load(readFileSync(join(root,new URL(url).pathname,'index.html'),'utf8'))}]));
 const records=createNavigationMap(pages,origin);
 const byUrl=new Map([...records.values()].map(r=>[r.url,r]));
 const link=(record,attrs='')=>`<a href="${esc(record.url)}"${attrs}>${esc(record.breadcrumb_label)}</a>`;
 for(const record of records.values()){
  const $=pages.get(record.path).$,zh=record.locale==='zh-Hans',prefix=zh?'/zh/':'/';
  $('main .breadcrumbs').each((_,el)=>{const parent=$(el).parent();$(el).remove();if(parent.is('div.container')&&!parent.text().trim()&&!parent.children().length)parent.remove();});
  const graph=$('script[type="application/ld+json"]').toArray().flatMap(el=>{const data=JSON.parse($(el).text());return data['@graph']||[data];}).filter(n=>!hasType(n,'BreadcrumbList'));
  if(record.page_type!=='home'){
   $('style[data-service-navigation]').remove();
   $('head').append(`<style data-service-navigation>${readFileSync(join(root,'service-navigation.css'),'utf8')}</style>`);
   const trail=breadcrumbTrail(record,records);
   const nav=`<nav class="breadcrumbs" aria-label="${zh?'面包屑导航':'Breadcrumb'}" data-owner-id="${esc(record.definition.owner??'')}" data-locale="${record.locale}"><ol>${trail.map((part,i)=>`<li>${i?'<span aria-hidden="true" class="breadcrumb-separator">/</span>':''}${i===trail.length-1?`<span aria-current="page">${esc(part.breadcrumb_label)}</span>`:link(part,` data-breadcrumb-position="${i+1}"`)}</li>`).join('')}</ol></nav>`;
   $('main h1').first().parent().prepend(nav);
   graph.push({'@type':'BreadcrumbList','@id':record.url+'#breadcrumb',itemListElement:trail.map((part,i)=>({'@type':'ListItem',position:i+1,name:part.breadcrumb_label,item:part.url}))});
   for(const node of graph)if(hasType(node,'WebPage'))node.breadcrumb={'@id':record.url+'#breadcrumb'};
  }else for(const node of graph)if(hasType(node,'WebPage'))delete node.breadcrumb;

  if(['guide','case','location'].includes(record.page_type)){
   const serviceRoutes=record.definition.related||[record.definition.owner];
   const targets=serviceRoutes.filter(r=>r!==null).map(r=>records.get(prefix+(r?r+'/':'')));
   const contact=records.get(prefix+'contact/');
   const handoff=`<p class="service-handoff" data-service-handoff>${zh?'我们提供：':'We provide: '}${targets.map(t=>link(t,' data-service-link')).join(zh?'、':' · ')}<span class="handoff-divider" aria-hidden="true"> · </span>${link({...contact,breadcrumb_label:zh?'咨询屋面维修':'Discuss your roof repair'},' data-enquiry-link')}</p>`;
   $('main [data-service-handoff]').remove();
   const lead=$('main .article-lead').first();
   const intro=lead.length?lead:$('main p').filter((_,e)=>!$(e).is('.eyebrow,.article-byline')&&!$(e).closest('nav,aside,figure,form').length).first();
   intro.after(handoff);
   // Reuse existing related-service and enquiry rows, replacing vague destination labels only.
   $('main a[href]').each((_,el)=>{
    const a=$(el);if(a.closest('.breadcrumbs,[data-service-handoff],details').length)return;
    const target=new URL(a.attr('href'),record.url);
    const destination=byUrl.get(target.origin+target.pathname);
    if(destination&&['service','subservice'].includes(destination.page_type)&&/^(?:see the related|review the (?:corresponding|relevant)|read the related|查看相关|了解相关|查看对应)/i.test(a.text().trim()))a.text(destination.breadcrumb_label);
   });
  }

  if(['service','subservice'].includes(record.page_type)){
   const children=[...records.values()].filter(r=>r.primary_parent_url===record.url);
   $('main [data-service-resources]').remove();
   const groups=[['subservice',zh?'相关服务':'Related services'],['case',zh?'相关施工案例':'Related repair projects'],['guide',zh?'相关维修指南':'Repair guides']];
   const lists=groups.map(([type,title])=>{
    const selected=children.filter(r=>r.page_type===type);if(!selected.length)return '';
    return `<div><h3>${title}</h3><ul>${selected.map(r=>`<li>${link(r)}</li>`).join('')}</ul></div>`;
   }).filter(Boolean).join('');
   if(lists){
    const resources=`<nav class="service-resources" data-service-resources aria-label="${zh?'维修案例与指南':'Repair projects and guides'}">${lists}</nav>`;
    const enquiry=$('main .service-enquiry').first();
    if(enquiry.length)enquiry.before(resources);else $('main > section:last-child .container').last().append(resources);
   }
  }
  $('script[type="application/ld+json"]').remove();
  $('head').append(`<script type="application/ld+json">${serialize({'@context':'https://schema.org','@graph':graph})}</script>`);
  writeFileSync(join(root,record.path,'index.html'),$.html().replace(/^[\t ]+$/gm,''));
 }
 return [...records.values()].map(({definition,...record})=>record);
}
