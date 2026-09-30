import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const csvEscape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const ownerIntentByPath = {
  '/': 'Broad Roof Repairs Perth entry',
  '/roof-repairs/': 'Roof repairs diagnostic hub',
  '/roof-leak-repairs/': 'Roof leak repairs Perth commercial intent',
  '/flashing-repairs/': 'Roof valleys and flashing repairs Perth commercial intent',
  '/gutters-downpipes/': 'Combined roof-edge drainage service',
  '/downpipe-repairs/': 'Downpipe repair commercial intent',
  '/news/roof-flashing-explained/': 'Informational roof flashing explanation'
};
const locationsFrom = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, value]) => value.trim());
const fileForUrl = (root, url) => {
  const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
  return join(root, pathname || '.', 'index.html');
};
const metaRobots = (html) => html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? 'absent';
const canonical = (html) => html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ?? 'missing';

export const inspectHttpDocument = (html, xRobotsTag = 'absent') => ({
  live_canonical: canonical(html),
  live_meta_robots: metaRobots(html),
  live_x_robots_tag: xRobotsTag
});

/**
 * Read generated files only. It intentionally records GSC as unknown: a sitemap
 * entry and a locally indexable document never prove that Google has crawled or indexed it.
 */
export const auditLocalSitemap = (root = defaultRoot) => {
  const sitemapPath = join(root, 'sitemap.xml');
  const locations = locationsFrom(readFileSync(sitemapPath, 'utf8'));
  return locations.map((url) => {
    const outputPath = fileForUrl(root, url);
    const exists = existsSync(outputPath);
    const html = exists ? readFileSync(outputPath, 'utf8') : '';
    const robots = exists ? metaRobots(html) : 'unknown';
    const isNoindex = /(?:^|[,\s])noindex(?:$|[,\s])/i.test(robots);
    const finalCanonical = exists ? canonical(html) : 'missing';
    return {
      url,
      source_date: new Date().toISOString().slice(0, 10),
      page_type: url.includes('/news/') ? 'article' : url.includes('/areas/') ? 'area service' : 'site page',
      sitemap_member: 'yes',
      local_http_status: exists ? '200' : '404',
      redirect_target: 'none',
      canonical: finalCanonical,
      canonical_matches_url: finalCanonical === url ? 'yes' : 'no',
      meta_robots: robots,
      x_robots_tag: 'unknown (static output check)',
      gsc_status: 'unknown',
      indexability: exists && !isNoindex && finalCanonical === url ? 'indexable' : 'review required',
      owner_intent: ownerIntentByPath[new URL(url).pathname] ?? 'Existing route — see intent-map.csv',
      issue_action: exists && !isNoindex && finalCanonical === url ? 'No local technical exception found; verify production and GSC separately.' : 'Investigate generated output before release.'
    };
  });
};

export const auditLiveUrls = async (urls) => Promise.all(urls.map(async (url) => {
  try {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    const document = response.headers.get('content-type')?.includes('text/html') ? await response.text() : '';
    return {
      url,
      live_http_status: String(response.status),
      live_redirect_target: response.headers.get('location') ?? 'none',
      ...inspectHttpDocument(document, response.headers.get('x-robots-tag') ?? 'absent')
    };
  } catch (error) {
    return { url, live_http_status: 'network-error', live_redirect_target: `unknown: ${error.name}`, live_canonical: 'unknown', live_meta_robots: 'unknown', live_x_robots_tag: 'unknown' };
  }
}));

const writeCsv = (path, rows) => {
  const headers = Object.keys(rows[0] ?? {});
  const body = [headers.join(','), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(','))].join('\n');
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${body}\n`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const valueAfter = (flag) => args[args.indexOf(flag) + 1];
  const root = resolve(valueAfter('--root') ?? defaultRoot);
  const output = valueAfter('--output');
  const live = args.includes('--live');
  const rows = auditLocalSitemap(root);
  const liveRows = live ? await auditLiveUrls(rows.map((item) => item.url)) : [];
  const completeRows = live ? rows.map((row, index) => ({ ...row, ...liveRows[index] })) : rows;
  if (output) writeCsv(resolve(output), completeRows);
  process.stdout.write(`Audited ${completeRows.length} sitemap URLs (${live ? 'local + live HTTP' : 'local generated output'}).\n`);
}
