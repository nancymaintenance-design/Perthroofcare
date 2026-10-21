import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {load} from 'cheerio';

// Reuse the reviewed topic-rail pattern without rewriting article text or anchors.
export function buildGuideLayouts(root){
 const paths=[...readFileSync(join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 let count=0;
 for(const path of paths.filter(p=>/^\/(?:zh\/)?news\/[^/]+\/$/.test(p))){
  const file=join(root,path,'index.html'),$=load(readFileSync(file,'utf8'));
  const reading=$('.article-reading'),toc=reading.children('.content-toc');
  if(!toc.length||reading.children('.guide-workspace').length)continue;
  const intro=toc.prevAll().toArray().reverse(),body=toc.nextAll();
  toc.before('<div class="guide-workspace"><div class="guide-introduction"></div><div class="guide-reading-body"></div></div>');
  reading.find('.guide-introduction').append(intro);
  reading.find('.guide-reading-body').before(toc);
  reading.find('.guide-reading-body').append(body);
  writeFileSync(file,$.html());count++;
 }
 return count;
}
