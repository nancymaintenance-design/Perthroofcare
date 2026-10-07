import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const collect = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? collect(join(dir, entry.name)) : entry.name.endsWith('.html') ? [join(dir, entry.name)] : []);
const visible = (html) => html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
test('generated commercial pages keep the enquiry with Ellis and explain assessment and quoting', () => {
  const bad = /general language for preparing an enquiry|cannot prescribe a program|imagery may be illustrative|practical reading guide, not a diagnosis|reading room.*does not replace an assessment|AI answer tools|search engines and AI|Editorial note|not a universal repair specification/i;
  const failures = collect('public').filter((path) => !/[/\\](privacy|legal)[/\\]/.test(path)).filter((path) => bad.test(visible(readFileSync(path, 'utf8'))));
  assert.deepEqual(failures, [], 'Customer-facing referral or generic-reference copy returned');
  for (const path of ['repair-options', 'roof-maintenance', 'roof-inspection']) {
    const html = readFileSync(`public/${path}/index.html`, 'utf8');
    assert.match(visible(html), /on-site|on site/i, path);
    assert.match(visible(html), /quote/i, path);
    assert.match(html, /href="\/contact\/"/);
  }
});
test('roof access safety and company contact identity survive the cleanup', () => {
  const html = readFileSync('public/news/drainage-after-rain/index.html', 'utf8');
  assert.match(visible(html), /Do not climb ladders, access roofs/);
  assert.match(html, /tel:\+61405878406/);
  assert.match(html, /ellisservicesgroup3@outlook\.com/);
});
