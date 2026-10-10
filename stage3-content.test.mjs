import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { load } from 'cheerio';
const html=readFileSync('public/news/gutter-warning-signs/index.html','utf8');
test('renamed gutter guide synchronizes visible breadcrumb and machine breadcrumb with its heading',()=>{
  const $=load(html),heading=$('main h1').text();
  const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
  assert.equal($('[aria-current="page"]').text(),heading);
  assert.equal(graph.find(n=>n['@type']==='BreadcrumbList').itemListElement.at(-1).name,heading);
  assert.equal(graph.find(n=>n['@type']==='Article').headline,heading);
});
// Removing the decision module from the rendered page must fail this contract.
test('rendered gutter guide explains clearing, local repairs and recurring overflow',()=>{
  for(const topic of [/Clearing leaves and outlets/i,/Repairing joints and local components/i,/When overflow returns after cleaning/i,/What to send for a gutter repair quote/i]) assert.match(html,topic);
});
test('gutter guide offers five working service, drainage and contact destinations',()=>{
  for(const path of ['gutter-repairs','downpipe-repairs','gutters-downpipes','news/drainage-after-rain','contact']){
    assert.ok(html.includes(`href="/${path}/"`),path);
    assert.ok(existsSync(`public/${path}/index.html`),path);
  }
  assert.match(readFileSync('public/gutter-repairs/index.html','utf8'),/href="\/news\/gutter-warning-signs\/"/);
});
test('gutter guide retains its canonical and safety boundary',()=>{
  assert.match(html,/rel="canonical" href="https:\/\/www.perthroofcare.com.au\/news\/gutter-warning-signs\/"/);
  assert.match(html,/Do not work from a roof/);
});
test('gutter guide publishes Perth decision metadata and removes generic article boilerplate',()=>{
  assert.ok(html.includes('<title>Gutter Overflow Perth: Cleaning or Repair? | Ellis</title>'));
  assert.ok(html.includes('<h1>GUTTER OVERFLOW AND WARNING SIGNS IN PERTH.</h1>'));
  assert.ok(html.includes('name="description" content="Gutter overflow in Perth: see how Ellis checks leaves, joints, outlets and downpipes, then plans cleaning, local repairs or a damaged-section replacement."'));
  for(const heading of ['Start with the visible detail','Trace the relationship','Use material context carefully','Continue the reading']) assert.ok(!html.includes(`<h2>${heading}</h2>`),heading);
});
