import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('.', import.meta.url).pathname.replace(/^\/(.:)/, '$1');
const home = readFileSync(`${root}/index.html`, 'utf8');

test('home preloads its LCP background and avoids a hidden duplicate image', () => {
  assert.match(home, /<link rel="preload" as="image" href="\/assets\/images\/hero-australian-roofer-v2\.png" fetchpriority="high">/i);
  assert.doesNotMatch(home, /class="hero-roofer-media"/i);
});

test('noninitial home imagery is deferred', () => {
  for (const asset of ['hero-roof.png', 'metal-roof.png', 'inspection.png', 'gutter.png', 'resources-downpipe.png']) {
    assert.match(home, new RegExp(`<img[^>]+${asset.replace('.', '\\.') }[^>]+loading="lazy"[^>]+decoding="async"`, 'i'));
  }
});
