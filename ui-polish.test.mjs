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
  assert.equal(snapshot.hash,'2f8379806b0ff9da36c60d22ab6fe940579a51adb8bc11a5e510fb54001d0b42');
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
