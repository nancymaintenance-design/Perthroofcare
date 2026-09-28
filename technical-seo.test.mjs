import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const html = fs.readFileSync('index.html', 'utf8');
const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);

test('content images reserve layout space and defer below-fold loading', () => {
  assert.ok(images.length > 0, 'expected page images');
  for (const image of images) {
    assert.match(image, /\bwidth="\d+"/i, image);
    assert.match(image, /\bheight="\d+"/i, image);
  }
  for (const image of images) {
    if (/\bclass="brand-logo"/i.test(image)) continue;
    if (/\bclass="instagram-icon"/i.test(image)) continue;
    if (/\bfetchpriority="high"/i.test(image)) continue;
    assert.match(image, /\bloading="lazy"/i, image);
  }
});
