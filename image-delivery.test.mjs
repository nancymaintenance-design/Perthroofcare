import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { load } from 'cheerio';
import sharp from 'sharp';
import { optimizeImages } from './tools/optimize-images.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const targets = [
  { name: 'resources-tile-project.jpg', width: 1280, height: 1707, widths: [400, 640, 800, 1280] },
  { name: 'roof-maintenance-case-01-tile-edge.jpg', width: 1707, height: 1280, widths: [400, 640, 800, 1280, 1707] },
  { name: 'wa6121-tile-valley-gutter-04.jpg', width: 1280, height: 1707, widths: [400, 640, 800, 1280] },
  { name: 'roof-maintenance-case-03-broken-tile-detail.jpg', width: 1280, height: 1707, widths: [400, 640, 800, 1280] }
];
const untargeted = ['resources-metal-project.jpg', 'hero-australian-roofer-v2.png', 'roof-maintenance-case-04-ridge-junction.jpg'];
const digest = buffer => createHash('sha256').update(buffer).digest('hex');

test('selective delivery preserves details, responsive contracts and cache correctness', async t => {
  const reports = join(root, '..', 'reports');
  mkdirSync(reports, { recursive: true });
  const fixture = mkdtempSync(join(reports, 'image-delivery-test-'));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  const cache = join(fixture, '.image-cache');
  mkdirSync(cache);
  mkdirSync(join(fixture, 'roof'));
  writeFileSync(join(fixture, 'sitemap.xml'), '<urlset><url><loc>https://example.test/</loc></url><url><loc>https://example.test/roof/</loc></url></urlset>');
  for (const css of ['site.css', 'brand-hero.css', 'refinement.css']) writeFileSync(join(fixture, css), '');
  writeFileSync(join(fixture, 'brand-hero.css'), ".home-hero-backdrop{background-image:url('/assets/images/hero-australian-roofer-v2.png')}");
  const imageMarkup = [...targets.map(({ name }) => name), untargeted[0]].map(name => `<img src="/assets/images/${name}" alt="Recorded roof detail" loading="lazy" decoding="async">`).join('');
  writeFileSync(join(fixture, 'index.html'), `<html><head></head><body><main>${imageMarkup}</main></body></html>`);
  writeFileSync(join(fixture, 'roof/index.html'), `<html><head></head><body><section class="service-hero" style="--service-hero-image:url('/assets/images/${untargeted[2]}')"></section></body></html>`);

  // Seed a real legacy quality-82 cache. A policy change must replace its bytes,
  // even though the source size, mtime, output filenames and widths still match.
  const legacy = {}, baseline = new Map(), originalHashes = new Map();
  for (const name of [...targets.map(target => target.name), ...untargeted]) {
    cpSync(join(root, name), join(fixture, name));
    originalHashes.set(name, digest(readFileSync(join(root, name))));
    const source = join(fixture, name), metadata = await sharp(source).metadata();
    const widths = [400, 640, 800, 1280, 1920].filter(width => width < metadata.width);
    widths.push(Math.min(metadata.width, 1920));
    const variants = [];
    for (const width of [...new Set(widths)]) {
      const file = `${basename(name, extname(name))}-${width}.webp`;
      const buffer = await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toBuffer();
      writeFileSync(join(cache, file), buffer);
      baseline.set(file, buffer);
      variants.push({ file, width, bytes: buffer.length });
    }
    const stat = statSync(source);
    legacy[name] = { stamp: `${stat.size}:${stat.mtimeMs}:webp82-v2-1920`, width: metadata.width, height: metadata.height, variants };
  }
  writeFileSync(join(cache, 'manifest.json'), JSON.stringify(legacy));
  await optimizeImages(fixture);
  const manifest = JSON.parse(readFileSync(join(cache, 'manifest.json')));

  await t.test('the four costly delivered variants improve by at least ten percent at the same dimensions', async () => {
    for (const target of targets) {
      const file = `${basename(target.name, '.jpg')}-${target.width}.webp`;
      const buffer = readFileSync(join(cache, file)), metadata = await sharp(buffer).metadata();
      assert.equal(metadata.format, 'webp');
      assert.equal(metadata.width, target.width);
      assert.equal(metadata.height, target.height);
      assert.ok(buffer.length <= baseline.get(file).length * 0.9, `${file}: meaningful improvement over quality 82`);
      assert.equal(manifest[target.name].variants.find(variant => variant.file === file).bytes, buffer.length);
      assert.deepEqual(manifest[target.name].variants.map(variant => variant.width), target.widths);
    }
  });

  await t.test('policy changes invalidate legacy target cache entries without reencoding unrelated photos or heroes', () => {
    for (const { name } of targets) assert.notEqual(manifest[name].stamp, legacy[name].stamp, `${name}: quality policy belongs in the cache key`);
    for (const name of untargeted) {
      assert.deepEqual(manifest[name], legacy[name], `${name}: retain the existing quality and cache key`);
      for (const variant of manifest[name].variants) assert.deepEqual(readFileSync(join(cache, variant.file)), baseline.get(variant.file));
    }
    for (const [name, hash] of originalHashes) {
      assert.equal(digest(readFileSync(join(fixture, name))), hash, `${name}: fixture original remains unchanged`);
      assert.equal(digest(readFileSync(join(root, name))), hash, `${name}: source original remains unchanged`);
    }
  });

  await t.test('image attributes, srcsets and both hero preload choices remain compatible', () => {
    const home = load(readFileSync(join(fixture, 'index.html'), 'utf8'));
    for (const target of targets) {
      const image = home(`img[src="/assets/images/${target.name}"]`);
      assert.equal(image.attr('alt'), 'Recorded roof detail');
      assert.equal(image.attr('loading'), 'lazy');
      assert.equal(image.attr('decoding'), 'async');
      assert.equal(Number(image.attr('width')), target.width);
      assert.equal(Number(image.attr('height')), target.height);
      assert.deepEqual([...image.attr('srcset').matchAll(/ (\d+)w/g)].map(match => Number(match[1])), target.widths);
      assert.equal(image.attr('sizes'), '(max-width: 600px) calc(100vw - 40px), (max-width: 960px) 45vw, 620px');
    }
    for (const [route, files] of [
      ['index.html', ['hero-australian-roofer-v2-1672.webp', 'hero-australian-roofer-v2-640.webp']],
      ['roof/index.html', ['roof-maintenance-case-04-ridge-junction-1707.webp', 'roof-maintenance-case-04-ridge-junction-640.webp']]
    ]) {
      const dom = load(readFileSync(join(fixture, route), 'utf8'));
      const preloads = dom('link[rel="preload"][as="image"]');
      assert.deepEqual(preloads.toArray().map(element => dom(element).attr('href')), files.map(file => `/assets/images/${file}`));
      assert.deepEqual(preloads.toArray().map(element => dom(element).attr('media')), ['(min-width:601px)', '(max-width:600px)']);
      assert.ok(preloads.toArray().every(element => dom(element).attr('fetchpriority') === 'high'));
    }
  });

  await t.test('an unchanged policy reuses deterministic cache files on the next run', async () => {
    const before = new Map(Object.values(manifest).flatMap(record => record.variants).map(({ file }) => [file, { hash: digest(readFileSync(join(cache, file))), mtime: statSync(join(cache, file)).mtimeMs }]));
    await optimizeImages(fixture);
    assert.deepEqual(JSON.parse(readFileSync(join(cache, 'manifest.json'))), manifest);
    for (const [file, previous] of before) {
      assert.equal(digest(readFileSync(join(cache, file))), previous.hash);
      assert.equal(statSync(join(cache, file)).mtimeMs, previous.mtime, `${file}: cache hit must not reencode`);
    }
  });
});
