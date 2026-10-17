import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
export const sourceRoot=fileURLToPath(new URL('../../',import.meta.url));
export const publicRoot=fileURLToPath(new URL('../../public/',import.meta.url));
export const pages=[...readFileSync(new URL('../../public/sitemap.xml',import.meta.url),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).filter(p=>!p.startsWith('/zh/')).map(route=>({route,pageId:route==='/'?'index.html':route.slice(1,-1).replaceAll('/','~')+'.html'}));
export const pageIds=pages.map(p=>p.pageId);
