import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const measurementId = 'G-35M6VYNBDV';

function pages(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = join(directory, entry.name);
    return entry.isDirectory() ? pages(target) : entry.name === 'index.html' ? [target] : [];
  });
}

test('production build emits one Perth Roof Care GA4 tag per public page', () => {
  for (const page of pages(join(root, 'public'))) {
    const html = readFileSync(page, 'utf8');
    assert.match(html, new RegExp(`https://www\\.googletagmanager\\.com/gtag/js\\?id=${measurementId}`), page);
    assert.equal((html.match(new RegExp(`gtag\\('config', '${measurementId}'\\);`, 'g')) || []).length, 1, page);
  }
});
