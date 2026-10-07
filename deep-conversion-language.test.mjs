import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const collect = dir => readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? collect(join(dir,e.name)) : e.name.endsWith('.html') ? [join(dir,e.name)] : []);
const visible = html => html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();

test('all generated public pages avoid enquiry-only, reader-work and editorial positioning', () => {
 const bad = /Request (?:a roof repair enquiry|an enquiry)|primary roof repair intent|disconnected project hub|gather related terms|frame (?:the discussion|a repair conversation)|provides information across|organise water-entry context|information paths|popular local roof repair search|Those details make the related service links|WHAT THIS CONVERSATION CAN COVER/i;
 const failures=collect('public').filter(p=>bad.test(visible(readFileSync(p,'utf8'))+' '+readFileSync(p,'utf8').match(/<meta[^>]+description[^>]+>/g)?.join(' ')));
 assert.deepEqual(failures,[]);
});
test('every service FAQ answers its own question and matches structured data', () => {
 for (const route of ['roof-repairs','roof-leak-repairs','tile-roof-repairs','metal-roof-repairs','ridge-capping-repointing','flashing-repairs','gutters-downpipes','downpipe-repairs','roof-inspection','gutter-repairs','roof-maintenance','storm-damage-roof-repairs']) {
  const html=readFileSync('public/'+route+'/index.html','utf8');
  const faqSection=html.match(/<section class="section focus-faq">([\s\S]*?)<\/section>/)[1];
  const answers=[...faqSection.matchAll(/<details><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)].map(m=>[visible(m[1]),visible(m[2])]);
  assert.equal(new Set(answers.map(a=>a[1])).size,answers.length,route+' repeats one generic answer');
  assert.doesNotMatch(answers.map(a=>a[1]).join(' '),/assesses the visible condition, surrounding roofline, access and drainage path/);
  const graphs=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>{const j=JSON.parse(m[1]);return j['@graph']||[j]});
  const schema=graphs.find(j=>j['@type']==='FAQPage');
  assert.deepEqual(schema.mainEntity.map(q=>[q.name,q.acceptedAnswer.text]),answers);
 }
 const ridge=visible(readFileSync('public/ridge-capping-repointing/index.html','utf8'));
 assert.match(ridge,/Bedding supports.*pointing is/i);
});
test('contact offers assessment, written quote and optional email photos without upload promise',()=> {
 const txt=visible(readFileSync('public/contact/index.html','utf8'));
 assert.match(txt,/on-site|on site/); assert.match(txt,/written quote/); assert.match(txt,/optional/i);
 assert.match(txt,/ellisservicesgroup3@outlook.com/); assert.doesNotMatch(txt,/attach|upload/i);
});

test('deep guide and area content offers company assessment rather than conversation or search instructions',()=>{
 const bad=/Roof inspection Perth searches|Visitors often search for ridge repointing|begin the next conversation|let the next conversation|broader home-maintenance conversation|help organise the relevant repair conversation|Organise visible roofline information before making an enquiry/;
 assert.deepEqual(collect('public').filter(p=>bad.test(visible(readFileSync(p,'utf8')))),[]);
});

test('metadata describes its service or information page instead of a title-spliced fallback',()=>{
 assert.deepEqual(collect('public').filter(p=>/ services from Ellis Services Group for Perth roof repairs, leaks, tiles, flashing, gutters and/.test(readFileSync(p,'utf8').match(/<meta name="description"[^>]*>/)?.[0]||'')),[]);
});

test('general FAQ explains components and distinguishes optional photos from assessment',()=>{
 const html=readFileSync('public/faq/index.html','utf8'), txt=visible(html);
 assert.doesNotMatch(txt,/Flashing is discussed|guidance for reading that part|replace discussing/);
 assert.match(txt,/Flashing.*direct.*water/i);
 assert.match(txt,/Ridge capping.*cover.*junction/i);
 assert.match(txt,/photograph.*on-site assessment/i);
 for(const entry of [...html.matchAll(/"acceptedAnswer":\{"@type":"Answer","text":"([^"]+)"/g)]) assert.ok(txt.includes(entry[1]));
});

test('four practical guides have substantive individual openings instead of reader-language work',()=>{
 const intros=[];
 for(const route of ['drainage-after-rain','metal-roofing-perth','roof-leak-inspection','roof-maintenance-basics']){
  const txt=visible(readFileSync('public/news/'+route+'/index.html','utf8'));
  assert.doesNotMatch(txt,/A closer reading|identify the language|conversation grounded|Continue the reading/);
  intros.push(txt.match(/GUIDE \/ ROOF REPAIRS.*?\. (.*?) Start/)[1]);
 }
 assert.equal(new Set(intros).size,4);
});

test('drainage preparation photos are locally optional and restoration describes actual assessment',()=>{
 for(const route of ['downpipe-repairs','gutter-repairs']){
  const txt=visible(readFileSync('public/'+route+'/index.html','utf8'));
  assert.match(txt,/If .*photos.*ellisservicesgroup3@outlook.com/i);
  assert.match(txt,/No photos are needed to request an assessment/);
 }
 const txt=visible(readFileSync('public/roof-restoration/index.html','utf8'));
 assert.doesNotMatch(txt,/can be discussed separately before a scope|DETAILS THAT HELP FRAME AN ENQUIRY/);
 assert.match(txt,/materials, deterioration.*preparation/i);
});

