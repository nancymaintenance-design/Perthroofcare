import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicDirectory = join(root, 'public');
const build = spawnSync(process.execPath, ['build.mjs'], { cwd: root, stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);

rmSync(publicDirectory, { recursive: true, force: true });
mkdirSync(publicDirectory, { recursive: true });

const excludedDirectories = new Set(['api', 'node_modules', 'public', 'tests', 'tools', '.vercel']);
for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (entry.isDirectory() && !excludedDirectories.has(entry.name)) {
    cpSync(join(root, entry.name), join(publicDirectory, entry.name), { recursive: true });
  }
}
for (const file of ['favicon.ico', 'index.html', 'robots.txt', 'sitemap.xml']) {
  if (!existsSync(join(root, file))) throw new Error(`Missing static file: ${file}`);
  cpSync(join(root, file), join(publicDirectory, file));
}
