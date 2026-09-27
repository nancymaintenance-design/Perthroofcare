import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicDirectory = join(root, 'public');
const outputDirectory = join(root, '.vercel', 'output');
const build = spawnSync(process.execPath, ['build.mjs'], { cwd: root, stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);

// Publish one brand-owned PNG icon path for browsers and search crawlers.
const faviconMarkup = '<link rel="icon" type="image/png" sizes="512x512" href="/favicon.png"><link rel="apple-touch-icon" sizes="512x512" href="/favicon.png"><link rel="manifest" href="/site.webmanifest">';
const stampFavicon = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = join(directory, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && !['node_modules', 'public'].includes(entry.name)) stampFavicon(target);
    if (entry.isFile() && entry.name === 'index.html') {
      const html = readFileSync(target, 'utf8').replace(/<link rel="icon" href="\/favicon\.ico" sizes="any"><link rel="icon" type="image\/png" href="\/(?:assets\/images\/ellis-logo|favicon)\.png"><link rel="apple-touch-icon" href="\/(?:assets\/images\/ellis-logo|favicon)\.png">/, faviconMarkup);
      writeFileSync(target, html);
    }
  }
};
stampFavicon(root);

rmSync(publicDirectory, { recursive: true, force: true });
mkdirSync(publicDirectory, { recursive: true });

const excludedDirectories = new Set(['api', 'node_modules', 'public', 'tests', 'tools', '.vercel', '.git']);
for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (entry.isDirectory() && !entry.name.startsWith('.') && !excludedDirectories.has(entry.name)) {
    cpSync(join(root, entry.name), join(publicDirectory, entry.name), { recursive: true });
  }
}

const stagedFiles = [
  ['favicon.ico', 'favicon.ico'],
  ['favicon.png', 'favicon.png'],
  ['site.webmanifest', 'site.webmanifest'],
  ['index.html', 'index.html'],
  ['robots.txt', 'robots.txt'],
  ['sitemap.xml', 'sitemap.xml'],
  ['site.css', 'assets/css/site.css'],
  ['office-location.css', 'assets/css/office-location.css'],
  ['brand-hero.css', 'assets/css/brand-hero.css'],
  ['contact-form.css', 'assets/css/contact-form.css'],
  ['price-guide.css', 'assets/css/price-guide.css'],
  ['site.js', 'assets/js/site.js'],
  ['ellis-logo.png', 'assets/images/ellis-logo.png'],
  ['gutter.png', 'assets/images/gutter.png'],
  ['hero-australian-roofer-v2.png', 'assets/images/hero-australian-roofer-v2.png'],
  ['hero-roof.png', 'assets/images/hero-roof.png'],
  ['inspection.png', 'assets/images/inspection.png'],
  ['instagram-icon.png', 'assets/images/instagram-icon.png'],
  ['metal-roof.png', 'assets/images/metal-roof.png'],
  ['resources-downpipe.png', 'assets/images/resources-downpipe.png'],
  ['resources-dusk.png', 'assets/images/resources-dusk.png'],
  ['resources-gutter.png', 'assets/images/resources-gutter.png'],
  ['resources-gutter-project.jpg', 'assets/images/resources-gutter-project.jpg'],
  ['resources-metal.png', 'assets/images/resources-metal.png'],
  ['resources-metal-project.jpg', 'assets/images/resources-metal-project.jpg'],
  ['resources-tile.png', 'assets/images/resources-tile.png'],
  ['resources-tile-project.jpg', 'assets/images/resources-tile-project.jpg'],
  ['resources-tools.png', 'assets/images/resources-tools.png'],
  ['roleystone-metal-fastener-rust-01.jpg', 'assets/images/roleystone-metal-fastener-rust-01.jpg'],
  ['roleystone-metal-fastener-rust-02.jpg', 'assets/images/roleystone-metal-fastener-rust-02.jpg'],
  ['roleystone-metal-fastener-detail-03.jpg', 'assets/images/roleystone-metal-fastener-detail-03.jpg'],
  ['roleystone-metal-fastener-detail-04.jpg', 'assets/images/roleystone-metal-fastener-detail-04.jpg'],
  ['metal-fastener-sequence-01-overall-before.png', 'assets/images/metal-fastener-sequence-01-overall-before.png'],
  ['metal-fastener-sequence-02-fastener-detail.png', 'assets/images/metal-fastener-sequence-02-fastener-detail.png'],
  ['metal-fastener-sequence-03-ridge-detail.png', 'assets/images/metal-fastener-sequence-03-ridge-detail.png'],
  ['metal-fastener-sequence-04-fastener-work.png', 'assets/images/metal-fastener-sequence-04-fastener-work.png'],
  ['metal-fastener-sequence-05-completed.png', 'assets/images/metal-fastener-sequence-05-completed.png'],
  ['wa6121-tile-valley-gutter-01.jpg', 'assets/images/wa6121-tile-valley-gutter-01.jpg'],
  ['wa6121-tile-valley-gutter-02.jpg', 'assets/images/wa6121-tile-valley-gutter-02.jpg'],
  ['wa6121-tile-valley-gutter-03.jpg', 'assets/images/wa6121-tile-valley-gutter-03.jpg'],
  ['wa6121-tile-valley-gutter-04.jpg', 'assets/images/wa6121-tile-valley-gutter-04.jpg'],
  ['roof-leak-case-01-overall.png', 'assets/images/roof-leak-case-01-overall.png'],
  ['roof-leak-case-02-roof-context.png', 'assets/images/roof-leak-case-02-roof-context.png'],
  ['roof-leak-case-03-junction-detail.png', 'assets/images/roof-leak-case-03-junction-detail.png'],
  ['roof-leak-case-04-interior-mark.png', 'assets/images/roof-leak-case-04-interior-mark.png'],
  ['roof-leak-case-05-work-in-progress.png', 'assets/images/roof-leak-case-05-work-in-progress.png'],
  ['roof-leak-case-06-completed.png', 'assets/images/roof-leak-case-06-completed.png'],
  ['tile-roof-case-01-overall.png', 'assets/images/tile-roof-case-01-overall.png'],
  ['tile-roof-case-02-damaged-tiles.png', 'assets/images/tile-roof-case-02-damaged-tiles.png'],
  ['tile-roof-case-03-valley-gutter.png', 'assets/images/tile-roof-case-03-valley-gutter.png'],
  ['tile-roof-case-04-ridge-detail.png', 'assets/images/tile-roof-case-04-ridge-detail.png'],
  ['tile-roof-case-05-work-in-progress.png', 'assets/images/tile-roof-case-05-work-in-progress.png'],
  ['tile-roof-case-06-completed.png', 'assets/images/tile-roof-case-06-completed.png'],
  ['ridge-case-01-overview-before.png', 'assets/images/ridge-case-01-overview-before.png'],
  ['ridge-case-02-damaged-closeup.png', 'assets/images/ridge-case-02-damaged-closeup.png'],
  ['ridge-case-03-bedding-detail.png', 'assets/images/ridge-case-03-bedding-detail.png'],
  ['ridge-case-04-interior-water-stain.png', 'assets/images/ridge-case-04-interior-water-stain.png'],
  ['ridge-case-05-repair-in-progress.png', 'assets/images/ridge-case-05-repair-in-progress.png'],
  ['ridge-case-06-overview-after.png', 'assets/images/ridge-case-06-overview-after.png'],
  ['valley-flashing-case-01-overall.png', 'assets/images/valley-flashing-case-01-overall.png'],
  ['valley-flashing-case-02-valley-closeup.png', 'assets/images/valley-flashing-case-02-valley-closeup.png'],
  ['valley-flashing-case-03-chimney-flashing.png', 'assets/images/valley-flashing-case-03-chimney-flashing.png'],
  ['valley-flashing-case-04-roofline-detail.png', 'assets/images/valley-flashing-case-04-roofline-detail.png'],
  ['valley-flashing-case-05-work-record.png', 'assets/images/valley-flashing-case-05-work-record.png'],
  ['valley-flashing-case-06-after-record.png', 'assets/images/valley-flashing-case-06-after-record.png']
];

for (const [source, destination] of stagedFiles) {
  const sourcePath = join(root, source);
  if (!existsSync(sourcePath)) throw new Error(`Missing static file: ${source}`);
  const destinationPath = join(publicDirectory, destination);
  mkdirSync(dirname(destinationPath), { recursive: true });
  cpSync(sourcePath, destinationPath);
}

rmSync(outputDirectory, { recursive: true, force: true });
const staticDirectory = join(outputDirectory, 'static');
mkdirSync(staticDirectory, { recursive: true });
cpSync(publicDirectory, staticDirectory, { recursive: true });

const enquirySource = join(root, 'enquiry.js');
if (!existsSync(enquirySource)) throw new Error('Missing enquiry handler.');
const functionDirectory = join(outputDirectory, 'functions', 'api', 'enquiry.func');
mkdirSync(functionDirectory, { recursive: true });
cpSync(enquirySource, join(functionDirectory, 'index.js'));
writeFileSync(join(functionDirectory, 'package.json'), JSON.stringify({ type: 'module' }));
writeFileSync(join(functionDirectory, '.vc-config.json'), JSON.stringify({
  runtime: 'nodejs20.x',
  handler: 'index.js',
  launcherType: 'Nodejs',
  shouldAddHelpers: true
}));
writeFileSync(join(outputDirectory, 'config.json'), JSON.stringify({ version: 3 }));
