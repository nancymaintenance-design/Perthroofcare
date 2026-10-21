import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';

test('UI changes preserve all 138 reviewed pages except explicit navigation and layout wrappers',()=>{
 const paths=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).sort();
 const pages=paths.map(path=>{const $=load(readFileSync('public'+path+'index.html','utf8'));$('link[rel=stylesheet],style').remove();$('.guide-index-topics').remove();$('.guide-index h2[id^="guide-topic-"]').removeAttr('id');$('.guide-introduction,.guide-reading-body').each((_,e)=>$(e).replaceWith($(e).contents()));$('.guide-workspace').each((_,e)=>$(e).replaceWith($(e).contents()));return {path,hash:createHash('sha256').update($.html()).digest('hex')};});
 assert.equal(pages.length,138);assert.equal(createHash('sha256').update(JSON.stringify(pages)).digest('hex'),'64bd7d602dae9f0b57560699f4c41d182f882d6644cefe5a24a14211132a658f');
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
