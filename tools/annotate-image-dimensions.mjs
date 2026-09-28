import fs from 'node:fs';

const dimensions = new Map([
  ['hero-australian-roofer-v2.png', [1672, 941, 'fetchpriority="high"']],
  ['hero-roof.png', [1536, 1024, 'loading="lazy"']],
  ['metal-roof.png', [1536, 1024, 'loading="lazy"']],
  ['inspection.png', [1672, 941, 'loading="lazy"']],
  ['gutter.png', [1536, 1024, 'loading="lazy"']],
  ['resources-downpipe.png', [1672, 941, 'loading="lazy"']],
  ['metal-fastener-sequence-04-fastener-work.png', [1536, 1024, 'loading="lazy"']],
]);

const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
for (const [name, [width, height, loading]] of dimensions) {
  const expression = new RegExp(`<img(?=[^>]*src="/assets/images/${name.replace('.', '\\.')}")[^>]*>`, 'g');
  html = html.replace(expression, (tag) => /\bwidth="\d+"/i.test(tag) ? tag : tag.replace('>', ` width="${width}" height="${height}" ${loading}>`));
}
fs.writeFileSync(file, html);
