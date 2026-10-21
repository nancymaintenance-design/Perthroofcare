import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
import {execFileSync} from 'node:child_process';
const page=route=>load(readFileSync(`public/${route}/index.html`,'utf8'));

test('new guide sections preserve the meaning of established fragment links',()=>{
 for(const route of ['news/roof-leak-inspection','news/drainage-after-rain','news/roof-maintenance-basics']){
  const before=load(execFileSync('git',['show',`HEAD:${route}/index.html`],{encoding:'utf8',maxBuffer:4*1024*1024}));
  const current=page(route);
  for(const heading of before('h2[id^="guide-section-"]').toArray()){
   const id=before(heading).attr('id');assert.equal(current('#'+id).text(),before(heading).text(),route+' #'+id);
  }
 }
});

test('rain-related service copy answers scheduling, cleaning and component questions',()=>{
 assert.match(page('roof-leak-repairs')('.service-description').text(),/do not need to wait for another downpour/);
 assert.match(page('gutters-downpipes')('.service-description').text(),/cleaned but still overflows/);
 assert.match(page('downpipe-repairs')('.service-description').text(),/ground-level drain stays full/);
});

test('existing News guides contain distinct post-rain decisions rather than duplicate service pages',()=>{
 for(const [route,headings] of Object.entries({
  'news/roof-leak-inspection':['Booking leak investigation before repairs','Roof repairs before ceiling redecoration','Comparing roof leak repair quotes and keeping records'],
  'news/drainage-after-rain':['Gutters still overflow after cleaning','Roof drainage and underground stormwater boundaries'],
  'news/roof-maintenance-basics':['Next steps for a roof problem after rain']
 })){
  const $=page(route);for(const heading of headings)assert.ok($('main h2').toArray().some(e=>$(e).text()===heading),route+' '+heading);
 }
});

test('FAQ publishes six practical post-rain decisions in both languages and matching schema',()=>{
 const questions=['Should I book leak detection or roof repairs first?','Why do gutters still overflow after cleaning?','Is a full ground-level drain part of a downpipe repair?','When can ceiling repairs follow a roof leak repair?','Why can roof leak repair quotes differ?','What records should I keep before asking my insurer about a roof leak?'];
 for(const locale of ['', 'zh/']){
  const $=page(locale+'faq');
  assert.equal($('main details').length,49);
  const graph=JSON.parse($('script[type="application/ld+json"]').first().text())['@graph'];
  const visible=$('main details').map((_,e)=>({q:$(e).find('summary').text(),a:$(e).find('p').text()})).get();
  assert.deepEqual(graph.find(n=>n['@type']==='FAQPage').mainEntity.map(n=>({q:n.name,a:n.acceptedAnswer.text})),visible);
  if(!locale)for(const question of questions)assert.ok(visible.some(v=>v.q===question),question);
  else assert.match($('main').text(),/清理后.*溢水/);
 }
});
