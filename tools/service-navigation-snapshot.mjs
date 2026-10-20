import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
const rows=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>{
 const url=m[1],$=load(readFileSync('public'+new URL(url).pathname+'index.html','utf8'));
 return {url,language:$('html').attr('lang'),h1:$('h1').text(),canonical:$('link[rel=canonical]').attr('href'),hreflang:$('link[hreflang]').map((_,e)=>({lang:$(e).attr('hreflang'),url:$(e).attr('href')})).get(),noindex:$('meta[name=robots]').attr('content')||'',breadcrumb:$('.breadcrumbs').first().text(),graph:$('script[type="application/ld+json"]').toArray().flatMap(e=>{const n=JSON.parse($(e).text());return n['@graph']||[n];}),links:$('a[href]').map((_,a)=>({href:$(a).attr('href'),label:$(a).text().replace(/\s+/g,' ').trim(),kind:$(a).closest('.breadcrumbs').length?'breadcrumb':$(a).closest('header,footer').length?'navigation':'content'})).get()};
});
console.log(JSON.stringify(rows,null,2));
