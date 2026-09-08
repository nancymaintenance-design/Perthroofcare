import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.ico': 'image/x-icon', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const port = Number(process.env.PORT || 4173);
const maxBodyBytes = 12_000;
const requestWindowMs = 10 * 60 * 1000;
const requestLimit = 5;
const requestLog = new Map();

const json = (res, status, body) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); res.end(JSON.stringify(body)); };
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const cleanText = (value, max) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const readJson = async (req) => new Promise((resolve, reject) => {
  let bytes = 0; let body = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => { bytes += Buffer.byteLength(chunk); if (bytes > maxBodyBytes) { reject(new Error('too-large')); req.destroy(); } else body += chunk; });
  req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('invalid-json')); } });
  req.on('error', reject);
});
const isRateLimited = (ip) => {
  const now = Date.now(); const recent = (requestLog.get(ip) ?? []).filter((time) => now - time < requestWindowMs);
  recent.push(now); requestLog.set(ip, recent); return recent.length > requestLimit;
};
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleEnquiry = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return json(res, 415, { error: 'Use application/json.' });
  if (Number(req.headers['content-length'] || 0) > maxBodyBytes) return json(res, 413, { error: 'Enquiry is too large.' });
  const ip = req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip)) return json(res, 429, { error: 'Too many enquiries. Please try again later.' });
  let data;
  try { data = await readJson(req); } catch (error) { return json(res, error.message === 'too-large' ? 413 : 400, { error: error.message === 'too-large' ? 'Enquiry is too large.' : 'Invalid enquiry data.' }); }
  if (!data || Array.isArray(data) || typeof data !== 'object') return json(res, 400, { error: 'Invalid enquiry data.' });
  if (cleanText(data.website, 200)) return json(res, 200, { ok: true });
  const name = cleanText(data.name, 100); const phone = cleanText(data.phone, 40); const email = cleanText(data.email, 254); const enquiry = cleanText(data.enquiry, 4000);
  if (!name || !phone || !email || !enquiry || data.privacy !== true || !validEmail(email)) return json(res, 400, { error: 'Please complete the required fields with a valid email address and accept the privacy information.' });
  const apiKey = process.env.RESEND_API_KEY; const from = process.env.RESEND_FROM;
  if (!apiKey || !from) return json(res, 503, { error: 'Enquiry email is not configured.' });
  const text = `New Ellis Services Group website enquiry\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nEnquiry:\n${enquiry}`;
  const html = `<h1>New Ellis Services Group website enquiry</h1><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Enquiry:</strong><br>${escapeHtml(enquiry).replace(/\n/g, '<br>')}</p>`;
  try {
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' }, body: JSON.stringify({ from, to: ['ellisservicesgroup3@outlook.com'], subject: 'New website enquiry — Ellis Services Group', text, html }) });
    if (!response.ok) return json(res, 502, { error: 'We could not send your enquiry. Please try again or use the direct contact details.' });
    return json(res, 200, { ok: true });
  } catch { return json(res, 502, { error: 'We could not send your enquiry. Please try again or use the direct contact details.' }); }
};

createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/api/enquiry') return handleEnquiry(req, res);
    if (pathname.includes('..')) throw new Error('invalid-path');
    let file = join(root, normalize(pathname).replace(/^[/\\]+/, ''));
    if (pathname.endsWith('/')) file = join(file, 'index.html');
    try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch {}
    const data = await readFile(file); res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }); res.end(data);
  } catch { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); res.end('Not found'); }
}).listen(port, () => console.log(`Static site: http://localhost:${port}`));
