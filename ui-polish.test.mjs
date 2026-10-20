import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {load} from 'cheerio';
import {bundleStylesheets} from './tools/bundle-stylesheets.mjs';
import {uiContentSnapshot} from './tools/ui-content-snapshot.mjs';

test('published pages retain the reviewed 138-page content baseline',()=>{
  // Owner-approved removal of five external references affects exactly 14 guides.
  // The other 124 pages were checked against the pre-UI baseline unchanged.
  const snapshot=uiContentSnapshot();
  assert.equal(snapshot.pageCount,138);
  assert.equal(snapshot.hash,'c7e7535417e12c37b1bcd85259c2ad9b797d4ec75965947b62f52db8aed2f68f');
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
