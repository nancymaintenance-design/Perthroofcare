import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicDirectory = join(root, 'public');
const outputDirectory = join(root, '.vercel', 'output');
const build = spawnSync(process.execPath, ['build.mjs'], { cwd: root, stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);

rmSync(publicDirectory, { recursive: true, force: true });
mkdirSync(publicDirectory, { recursive: true });

const excludedDirectories = new Set(['api', 'node_modules', 'public', 'tests', 'tools', '.vercel', '.git']);
for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (entry.isDirectory() && !excludedDirectories.has(entry.name)) {
    cpSync(join(root, entry.name), join(publicDirectory, entry.name), { recursive: true });
  }
}

const stagedFiles = [
  ['favicon.ico', 'favicon.ico'],
  ['favicon.png', 'favicon.png'],
  ['index.html', 'index.html'],
  ['robots.txt', 'robots.txt'],
  ['sitemap.xml', 'sitemap.xml'],
  ['site.css', 'assets/css/site.css'],
  ['brand-hero.css', 'assets/css/brand-hero.css'],
  ['contact-form.css', 'assets/css/contact-form.css'],
  ['site.js', 'assets/js/site.js'],
  ['ellis-logo.png', 'assets/images/ellis-logo.png'],
  ['gutter.png', 'assets/images/gutter.png'],
  ['hero-australian-roofer-v2.png', 'assets/images/hero-australian-roofer-v2.png'],
  ['hero-roof.png', 'assets/images/hero-roof.png'],
  ['inspection.png', 'assets/images/inspection.png'],
  ['metal-roof.png', 'assets/images/metal-roof.png'],
  ['resources-downpipe.png', 'assets/images/resources-downpipe.png'],
  ['resources-dusk.png', 'assets/images/resources-dusk.png'],
  ['resources-gutter.png', 'assets/images/resources-gutter.png'],
  ['resources-metal.png', 'assets/images/resources-metal.png'],
  ['resources-tile.png', 'assets/images/resources-tile.png'],
  ['resources-tools.png', 'assets/images/resources-tools.png']
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
