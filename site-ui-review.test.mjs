import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';

test('UI changes preserve all 138 reviewed pages except explicit navigation and layout wrappers',()=>{
 const paths=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).sort();
 const pages=paths.map(path=>{const $=load(readFileSync('public'+path+'index.html','utf8'));$('link[rel=stylesheet],style').remove();if(path==='/'||path==='/zh/')$('head link[rel=alternate][type="application/rss+xml"]').filter((_,e)=>$(e).attr('href')==='https://www.perthroofcare.com.au'+path+'news/feed.xml').remove();$('.guide-index-topics').remove();$('.guide-index h2[id^="guide-topic-"]').removeAttr('id');$('.guide-introduction,.guide-reading-body').each((_,e)=>$(e).replaceWith($(e).contents()));$('.guide-workspace').each((_,e)=>$(e).replaceWith($(e).contents()));return {path,hash:createHash('sha256').update($.html()).digest('hex')};});
 // 2026-10-23: bilingual service copy reviewed for natural customer language;
 // exact text and structure delta verified in the bilingual-copy-review report.
 assert.equal(pages.length,138);assert.equal(createHash('sha256').update(JSON.stringify(pages)).digest('hex'),'286a6537dddf715aef08fab42781d2bc8bcf077ea8bd8b05b592c123ce5501a0');
});

test('guide outlines retain all real destinations and both language directory topics work',()=>{
 for(const prefix of ['', 'zh/']){
  const $=load(readFileSync('public/'+prefix+'news/index.html','utf8'));assert.equal($('.guide-index-topics a').length,4);
  $('.guide-index-topics a').each((_,a)=>{assert.equal($($(a).attr('href')).text(),$(a).text());});
  const paths=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).filter(p=>p.startsWith('/'+prefix+'news/')&&p!=='/'+prefix+'news/');
  assert.equal(paths.length,13);
  for(const path of paths){const dom=load(readFileSync('public'+path+'index.html','utf8'));assert.equal(dom('.guide-workspace>.content-toc').length,1,path);assert.ok(dom('.guide-reading-body>section').length>3,path);dom('.content-toc a').each((_,a)=>assert.equal(dom(dom(a).attr('href')).length,1,path+' '+dom(a).attr('href')));}
 }
});
