import { load } from 'cheerio';
import { normalizeSource, sourceId, visitPageStrings } from './catalog.mjs';

export class MissingTranslationError extends Error {
  constructor(source,{route,location}) {
    super(`Missing Chinese translation ${sourceId(source)} at ${route} (${location}): ${source}`);
    this.name='MissingTranslationError'; this.id=sourceId(source); this.source=source; this.route=route; this.location=location;
  }
}

export function normalizeRoute(route) {
  const pathname=new URL(route||'/', 'https://routes.invalid').pathname.replace(/^\/zh(?=\/|$)/,'').replace(/\/index\.html$/,'/');
  return pathname==='/'?'/':`/${pathname.replace(/^\/+|\/+$/g,'')}/`;
}

function settings(options) {
  if(!['en-AU','zh-Hans'].includes(options?.language)) throw new TypeError('language must be en-AU or zh-Hans');
  if(!options.siteBase) throw new TypeError('siteBase is required');
  const siteBase=new URL(options.siteBase).origin;
  if(!options.englishRoutes||typeof options.englishRoutes[Symbol.iterator]!=='function') throw new TypeError('englishRoutes must be an iterable of canonical English routes');
  const englishRoutes=new Set([...options.englishRoutes].map(normalizeRoute));
  const route=normalizeRoute(options.route);
  if(!englishRoutes.has(route)) throw new Error(`Unknown English route: ${route}`);
  return {...options,route,siteBase,englishRoutes};
}

function rewrite(value,opts) {
  if(!value||/^(?:#|tel:|mailto:|data:|javascript:)/i.test(value)) return value;
  let url;
  try { url=new URL(value,opts.siteBase+opts.route); } catch { return value; }
  if(url.origin!==opts.siteBase) return value;
  const route=normalizeRoute(url.pathname);
  if(!opts.englishRoutes.has(route)) return value;
  const path=opts.language==='zh-Hans'?`/zh${route}`:route;
  return `${/^(?:https?:)?\/\//i.test(value)?opts.siteBase:''}${path}${url.search}${url.hash}`;
}

export function rewritePageUrl(value,options) { return rewrite(value,settings(options)); }

function transformJson(value,opts,key='') {
  if(Array.isArray(value)) return value.map(item=>transformJson(item,opts,key));
  if(value&&typeof value==='object') return Object.fromEntries(Object.entries(value).map(([childKey,child])=>[childKey,transformJson(child,opts,childKey)]));
  if(typeof value!=='string') return value;
  if(key==='inLanguage') return opts.language;
  if(opts.language==='en-AU') return value;
  if(key==='@context'||(key==='@id'&&/#(?:business|ellis-services-group)$/.test(value))) return value;
  if(/^(?:https?:\/\/|\/)/i.test(value)) return rewrite(value,opts);
  return value;
}

function decorate($,opts) {
  $('html').attr('lang',opts.language);
  const englishUrl=opts.siteBase+opts.route;
  const chineseUrl=opts.siteBase+'/zh'+opts.route;
  $('link[rel="canonical"],link[rel="alternate"][hreflang]').remove();
  $('<link>').attr({rel:'canonical',href:opts.language==='zh-Hans'?chineseUrl:englishUrl}).appendTo('head');
  for(const [hreflang,href] of [['en-AU',englishUrl],['zh-Hans',chineseUrl],['x-default',englishUrl]]) $('<link>').attr({rel:'alternate',hreflang,href}).appendTo('head');
  $('meta[property="og:url"],meta[name="twitter:url"]').attr('content',opts.language==='zh-Hans'?chineseUrl:englishUrl);
  $('meta[property="og:locale"]').attr('content',opts.language==='zh-Hans'?'zh_CN':'en_AU');
  $('[data-language-switch]').remove();
  const nav=$('header nav').first();
  if(nav.length) {
    const link=$('<a>').attr({'class':'language-switch','data-language-switch':'',lang:opts.language==='zh-Hans'?'en-AU':'zh-Hans',hreflang:opts.language==='zh-Hans'?'en-AU':'zh-Hans',href:opts.language==='zh-Hans'?opts.route:'/zh'+opts.route}).text(opts.language==='zh-Hans'?'English':'中文服务');
    const primary=nav.children('a.button').last();
    if(primary.length) primary.before(link); else nav.append(link);
  }
}

// Call after all English content transforms and before image/output optimization.
// The dictionary is a Map or plain object of stable source IDs to Chinese strings.
export function localizePage(html,options) {
  const opts=settings(options);
  const $=load(html,{scriptingEnabled:false});
  const jsonDocuments=visitPageStrings($,({source,raw,location,reason,set})=>{
    if(opts.language!=='zh-Hans'||reason) return;
    const id=sourceId(source);
    const translated=opts.translations instanceof Map?opts.translations.get(id):Object.hasOwn(opts.translations??{},id)?opts.translations[id]:undefined;
    if(typeof translated!=='string'||!translated.trim()||normalizeSource(translated)===source||!/[\p{Script=Han}]/u.test(translated)) throw new MissingTranslationError(source,{route:opts.route,location});
    // Preserve boundaries around inline anchors/emphasis; only the text node changes.
    const leading=raw.match(/^\s*/u)[0],trailing=raw.match(/\s*$/u)[0];
    set(leading+translated.trim()+trailing);
  });
  if(opts.language==='zh-Hans') {
    $('a[href],area[href]').each((_,node)=>$(node).attr('href',rewrite($(node).attr('href'),opts)));
  }
  for(const {node,data} of jsonDocuments) {
    // Escape less-than to keep translator-supplied text inside the data script.
    $(node).text(JSON.stringify(transformJson(data,opts)).replace(/</g,'\\u003c'));
  }
  decorate($,opts);
  return $.html();
}
