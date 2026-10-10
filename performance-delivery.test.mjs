import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import test from 'node:test';
import { load } from 'cheerio';
import { createHash } from 'node:crypto';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {bundleStylesheets} from './tools/bundle-stylesheets.mjs';
import sharp from 'sharp';

const root = new URL('.', import.meta.url).pathname.replace(/^\/(.:)/, '$1');
const home = readFileSync(`${root}/public/index.html`, 'utf8');

test('home preloads its LCP background and avoids a hidden duplicate image', () => {
  const dom=load(home),preloads=dom('link[rel="preload"][as="image"]');
  assert.equal(preloads.length,2);
  assert.ok(preloads.toArray().every(el=>dom(el).attr('href').endsWith('.webp')&&dom(el).attr('media')));
  assert.doesNotMatch(home, /class="hero-roofer-media"/i);
});

test('noninitial home imagery is deferred', () => {
  const dom=load(home);const images=dom('main img').toArray();
  assert.ok(images.length>=9,'current service cards and project evidence must be retained');
  for (const image of images) {assert.equal(dom(image).attr('loading'),'lazy');assert.equal(dom(image).attr('decoding'),'async');}
});

test('shared brand images use small delivered variants rather than full-resolution originals',()=>{
  const dom=load(home);
  for(const selector of ['.brand-logo','.instagram-icon']){
    const image=dom(selector).first(),src=image.attr('src');
    assert.ok(src.endsWith('.webp'),`${selector} should deliver an optimized asset`);
    assert.ok(statSync(`${root}/public${src}`).size<10_000,`${selector} exceeds its small-icon byte budget`);
    assert.ok(image.attr('srcset')&&image.attr('sizes'),`${selector} needs responsive density choices`);
  }
});

test('home project thumbnails describe their two-column mobile layout and have intermediate source widths',()=>{
  const dom=load(home);
  for(const el of dom('.home-proof-sequence img').toArray()){
    const image=dom(el);
    assert.match(image.attr('sizes'),/calc\(\(100vw - 52px\) \/ 2\)/);
    assert.match(image.attr('srcset'),/ 400w/);
  }
  for(const el of dom('.home-service-map img').toArray()){
    const image=dom(el),width=Number(image.attr('width'));
    const variants=[...image.attr('srcset').matchAll(/ (\d+)w/g)].map(m=>Number(m[1]));
    assert.ok(variants.includes(Math.min(width,800)),'offer an 800px source unless the original is smaller');
    assert.ok(variants.every(value=>value<=width),'do not upscale project photographs');
  }
});

test('published pages deliver one minified fingerprinted stylesheet without a blocking request chain',()=>{
  const routes=[...readFileSync(`${root}/public/sitemap.xml`,'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
  for(const route of routes){
    const dom=load(readFileSync(`${root}/public${route}index.html`,'utf8'));
    const styles=dom('link[rel="stylesheet"]');
    assert.equal(styles.length,1,`${route}: consolidate stylesheet requests`);
    const href=styles.attr('href'),css=readFileSync(`${root}/public${href}`);
    const digest=createHash('sha256').update(css).digest('hex').slice(0,16);
    assert.equal(href,`/assets/css/site-${digest}.css`,'cache key must change when delivered styles change');
    assert.ok(css.length<85_000,`${route}: stylesheet byte budget`);
    assert.ok(css.toString().includes('prefers-reduced-motion'),'retain accessibility rules');
    assert.ok(css.toString().includes('services-submenu'),'retain interactive menu styles');
  }
});

test('retired-only rules are omitted while live and mixed rules remain available',t=>{
  const directory=mkdtempSync(join(tmpdir(),'roof-css-test-'));
  t.after(()=>rmSync(directory,{recursive:true,force:true}));
  mkdirSync(join(directory,'assets/css'),{recursive:true});
  mkdirSync(join(directory,'other'),{recursive:true});
  writeFileSync(join(directory,'assets/css/a.css'),'.atlas-retired,nav{color:red}.atlas-live{padding:2px}.menu.open{display:flex}@media(max-width:600px){.atlas-retired{color:blue}.menu{width:100%}}');
  const link='<link rel="stylesheet" href="/assets/css/a.css">';
  writeFileSync(join(directory,'index.html'),`<html><head>${link}</head><body><nav class="menu"></nav></body></html>`);
  writeFileSync(join(directory,'other/index.html'),`<html><head>${link}</head><body><div class="atlas-live"></div></body></html>`);
  bundleStylesheets(directory,['','other']);
  const dom=load(readFileSync(join(directory,'index.html'),'utf8'));
  const css=readFileSync(join(directory,dom('link').attr('href')),'utf8');
  assert.doesNotMatch(css,/color:(blue|#00f)/,'retired-only rules must not be shipped');
  assert.match(css,/atlas-live/,'a class used on another page must survive');
  assert.match(css,/nav/,'mixed selector lists must retain their live branches');
  assert.match(css,/\.menu\.open/,'dynamic menu states must survive');
  assert.match(css,/@media/,'responsive live rules must survive');
});

test('published favicon avoids an oversized transfer while preserving every decoded pixel',async()=>{
  const source=await sharp(`${root}/favicon.png`).raw().toBuffer();
  const delivered=await sharp(`${root}/public/favicon.png`).raw().toBuffer();
  assert.equal(createHash('sha256').update(delivered).digest('hex'),createHash('sha256').update(source).digest('hex'),'every decoded favicon pixel must remain identical');
  assert.ok(statSync(`${root}/public/favicon.png`).size<160_000,'compress the PNG losslessly, without palette quantization');
});

test('inline overrides remain in their original position between linked stylesheets',t=>{
  const directory=mkdtempSync(join(tmpdir(),'roof-css-order-'));
  t.after(()=>rmSync(directory,{recursive:true,force:true}));
  mkdirSync(join(directory,'assets/css'),{recursive:true});
  writeFileSync(join(directory,'assets/css/a.css'),'.order{color:red}');
  writeFileSync(join(directory,'assets/css/b.css'),'.order{color:blue}');
  writeFileSync(join(directory,'index.html'),'<head><link rel="stylesheet" href="/assets/css/a.css"><style>.order{color:green}</style><link rel="stylesheet" href="/assets/css/b.css"></head><body class="order"></body>');
  bundleStylesheets(directory,['']);
  const dom=load(readFileSync(join(directory,'index.html'),'utf8'));
  assert.equal(dom('style').length,0,'inline styles join the ordered cascade');
  const css=readFileSync(join(directory,dom('link').attr('href')),'utf8');
  assert.ok(css.lastIndexOf('blue')>css.lastIndexOf('green')||css.endsWith('color:#00f}'),'last stylesheet must still win');
});

test('the one applicable hero preload competes at high priority rather than behind decorative resources',()=>{
  const dom=load(home);
  for(const el of dom('link[rel="preload"][as="image"]').toArray())assert.equal(dom(el).attr('fetchpriority'),'high');
});
