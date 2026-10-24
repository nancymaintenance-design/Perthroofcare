import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {load} from 'cheerio';
import {bundleStylesheets} from './tools/bundle-stylesheets.mjs';
import {uiContentSnapshot} from './tools/ui-content-snapshot.mjs';

test('published pages retain the reviewed 138-page content baseline',()=>{
  // Post-rain content review, 2026-10-21. All 138 routes were
  // rechecked; H1s, destinations, forms, reviews and protected legal copy remain.
  const snapshot=uiContentSnapshot();
  assert.equal(snapshot.pageCount,138);
  // 2026-10-24: the remaining 20 services use reviewed Chinese and Australian English.
  // reports/2026-10-24-service-language-review verifies all 845 changed text slots,
  // unchanged DOM/links/assets/H1s, 98 unchanged pages and matching machine content.
  // Selected UI 2 snapshot reviewed against content-protection.json, 2026-10-24.
  assert.equal(snapshot.hash,'96a216d80b6cb39f242c9be0b51ab3ea6b4c2a96406fc6db31e08cb091a980ee');
});

test('visual layer joins the existing route request after original styles',t=>{
  const directory=mkdtempSync(join(tmpdir(),'roof-ui-'));
  t.after(()=>rmSync(directory,{recursive:true,force:true}));
  mkdirSync(join(directory,'assets/css'),{recursive:true});
  writeFileSync(join(directory,'assets/css/a.css'),'.fixture{margin:0}');
  writeFileSync(join(directory,'index.html'),'<head><link rel="stylesheet" href="/assets/css/a.css"></head><body class="fixture"><h1>Unchanged content</h1></body>');
  bundleStylesheets(directory,[''],()=>'.fixture{margin:24px}');
  const $=load(readFileSync(join(directory,'index.html'),'utf8'));
  assert.equal($('link[rel=stylesheet]').length,2);
  assert.match(readFileSync(join(directory,$('link').last().attr('href')),'utf8'),/margin:24px/);
  assert.equal($('h1').text(),'Unchanged content');
});
