import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
import {runInNewContext} from 'node:vm';

test('home contains ten attributed reviews instead of duplicated company and project panels',()=>{
 const $=load(readFileSync('public/index.html','utf8'));
 assert.equal($('.google-review-card').length,10);
 assert.equal($('.home-proof,.home-company-relationship,.contact-band').length,0);
 assert.equal($('footer').length,1);
 assert.deepEqual($('.review-author').map((_,el)=>$(el).text()).get(),['Huan Yang','chan yuenkit','Matt','Ray Sun','うちむ','Management Team','Cristobal Severino','Benjamin Hanley','Aneuk Kreh','So Yeong Ha']);
 assert.match($('.home-reviews').text(),/property maintenance services in different locations/i);
 assert.match($('.google-review-card').eq(7).text(),/Living in Sydney/);
 assert.equal($('.home-reviews [data-review-prev],.home-reviews [data-review-next],.home-reviews [data-review-pause]').length,3);
 assert.equal($('.home-reviews script[type="application/ld+json"]').length,0);
});
function runtime({mobile=false,reduced=false}={}){
 const element=()=>({hidden:false,textContent:'',events:{},attrs:{},addEventListener(type,fn){this.events[type]=fn;},setAttribute(name,value){this.attrs[name]=value;},contains(node){return node===this;}});
 const cards=Array.from({length:10},element),prev=element(),next=element(),pause=element(),controls=element(),track=element(),carousel=element();
 carousel.querySelectorAll=()=>cards;carousel.querySelector=selector=>({'[data-review-prev]':prev,'[data-review-next]':next,'[data-review-pause]':pause,'.review-controls':controls,'.review-track':track}[selector]);
 const callbacks=new Map();let timerId=0;const win={addEventListener(){},matchMedia(query){return {matches:query.includes('reduced')?reduced:mobile,addEventListener(){}};}};
 const doc={hidden:false,documentElement:{lang:'en-AU'},querySelector(selector){return selector==='[data-review-carousel]'?carousel:null;},querySelectorAll(){return[];},addEventListener(){}};
 runInNewContext(readFileSync('site.js','utf8'),{document:doc,window:win,setInterval(fn){callbacks.set(++timerId,fn);return timerId;},clearInterval(id){callbacks.delete(id);}});
 return {cards,prev,next,pause,carousel,callbacks,visible:()=>cards.map((card,i)=>!card.hidden?i:null).filter(i=>i!==null)};
}
test('carousel advances and pauses without hiding focused reviews',()=>{
 const r=runtime();assert.deepEqual(r.visible(),[0,1,2]);
 r.next.events.click();assert.deepEqual(r.visible(),[1,2,3]);
 r.prev.events.click();assert.deepEqual(r.visible(),[0,1,2]);
 assert.equal(r.callbacks.size,1);r.pause.events.click();assert.equal(r.callbacks.size,0);
 r.pause.events.click();assert.equal(r.callbacks.size,1);
 r.carousel.events.focusin();assert.equal(r.callbacks.size,0);
 r.carousel.events.focusout({relatedTarget:null});assert.equal(r.callbacks.size,1);
 r.carousel.events.mouseenter();assert.equal(r.callbacks.size,0);
 r.carousel.events.mouseleave();assert.equal(r.callbacks.size,1);
});
test('phone shows one review and reduced-motion disables automatic rotation',()=>{
 const r=runtime({mobile:true,reduced:true});assert.deepEqual(r.visible(),[0]);assert.equal(r.callbacks.size,0);
 r.next.events.click();assert.deepEqual(r.visible(),[1]);
 r.prev.events.click();r.prev.events.click();assert.deepEqual(r.visible(),[9]);
});
test('desktop wraps to the last complete ordered group without reordering the reading sequence',()=>{
 const r=runtime();r.prev.events.click();assert.deepEqual(r.visible(),[7,8,9]);
 r.next.events.click();assert.deepEqual(r.visible(),[0,1,2]);
});
test('Chinese reviews mark translations and retain each original quote',()=>{
 const $=load(readFileSync('public/zh/index.html','utf8'));
 assert.equal($('.google-review-card').length,10);
 assert.equal($('.review-translation-label').filter((_,el)=>$(el).text()==='译文').length,10);
 assert.equal($('.review-original summary').filter((_,el)=>$(el).text()==='查看英文原文').length,10);
 assert.match($('.google-review-card').eq(7).text(),/Living in Sydney/);
 assert.equal($('.home-proof,.home-company-relationship,.contact-band').length,0);
});
test('the corresponding fastener case retains all five distinct project photographs',()=>{
 const $=load(readFileSync('public/projects/metal-roof-fastener-repair-sequence/index.html','utf8'));
 const sources=$('main img').filter((_,el)=>!$(el).closest('.project-hero-photo').length).map((_,el)=>$(el).attr('src')).get();
 for(const stage of ['01-overall-before','02-fastener-detail','03-ridge-detail','04-fastener-work','05-completed'])assert.equal(sources.filter(src=>src.includes(stage)).length,1,stage);
});
