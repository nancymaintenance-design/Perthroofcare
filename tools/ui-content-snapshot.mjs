import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';

export function uiContentSnapshot(root='public'){
 const paths=[...readFileSync(root+'/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).sort();
 const pages=paths.map(path=>{
  const $=load(readFileSync(root+path+'index.html','utf8'));
  $('link[rel=stylesheet],style').remove();
  return {path,hash:createHash('sha256').update($.html()).digest('hex')};
 });
 return {pageCount:pages.length,hash:createHash('sha256').update(JSON.stringify(pages)).digest('hex'),pages};
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/ui-content-snapshot.mjs'))console.log(JSON.stringify(uiContentSnapshot(),null,2));
