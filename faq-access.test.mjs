import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
test('every bilingual page exposes FAQ in primary navigation',()=>{
 const paths=[...readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 for(const path of paths){const $=load(readFileSync('public'+path+'index.html','utf8'));const prefix=path.startsWith('/zh/')?'/zh/':'/';const link=$(`header #site-nav > a[href="${prefix}faq/"]`);
  assert.equal(link.length,1,path);assert.equal(link.text(),prefix==='/zh/'?'常见问题':'FAQ',path);
  if(path===prefix+'faq/')assert.equal(link.attr('aria-current'),'page');
 }
});
test('FAQ keeps topics and related services in a sidebar beside answers, with search above',()=>{
 for(const prefix of ['', 'zh/']){const $=load(readFileSync('public/'+prefix+'faq/index.html','utf8'));const shortcuts=$('.faq-service-shortcuts');
  assert.equal(shortcuts.length,1);assert.equal(shortcuts.closest('.faq-sidebar').length,1);
  assert.equal($('.faq-sidebar .faq-topic-nav').length,1);
  assert.equal($('.faq-results > .faq-category').length,7);
  assert.deepEqual(shortcuts.find('a').map((_,e)=>$(e).attr('href')).get(),['roof-leak-repairs','gutters-downpipes','roof-inspection','repair-options'].map(route=>'/'+prefix+route+'/'));
  assert.equal($('.faq-search label').attr('for'),$('.faq-search input').attr('id'));
  assert.equal($('.faq-search input').attr('type'),'search');
  assert.equal($('.faq-category[hidden]').length,0,'all answers accessible without JavaScript');
  assert.equal($('script[src="/assets/js/faq.js"]').length,1);
  assert.deepEqual($('.faq-count').map((_,el)=>Number($(el).text())).get(),[9,3,10,7,5,11,4]);
  assert.equal($('main details').length,49);
 }
});
