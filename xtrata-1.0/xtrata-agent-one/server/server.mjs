#!/usr/bin/env node
/**
 * Xtrata Agent One — local API server for the Inscription Wizard.
 * Wraps svc/core.mjs and serves the static wizard same-origin.
 * Binds 127.0.0.1 only. Ephemeral keys never leave the process (publicJob strips them).
 *
 * Run:  node server/server.mjs           (live, talks to mainnet via Hiro)
 *       XTRATA_MOCK=1 node server/server.mjs   (offline demo: fake quote/funding/txids)
 * Env:  XAO_PORT(=8787) XTRATA_CORE(=xtrata-v3-2-3) XTRATA_NETWORK(=mainnet)
 *       HIRO_API_KEY  JOB_DIR  ENGINE  WIZARD_DIR
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as core from '../svc/core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.XAO_PORT || 8787);
const HOST = '127.0.0.1';
const CORE = process.env.XTRATA_CORE || 'xtrata-v3-2-3';
const NET = (process.env.XTRATA_NETWORK || 'mainnet').toLowerCase();
const MOCK = process.env.XTRATA_MOCK === '1';
const HIRO_KEY = process.env.HIRO_API_KEY || '';
const JOB_DIR = process.env.JOB_DIR || path.resolve(__dirname, '../svc/job-state');
const ENGINE = process.env.ENGINE || path.resolve(__dirname, '../../agent-large-inscribe.mjs');
const WIZARD_DIR = process.env.WIZARD_DIR || path.resolve(__dirname, '../wizard');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(__dirname, '../svc/uploads');
const MAX_UPLOAD = Number(process.env.MAX_UPLOAD_BYTES || 40 * 1024 * 1024);
const RECEIPTS_DIR = process.env.RECEIPTS_DIR || path.resolve(__dirname, '../svc/receipts');
const STARTED_AT = new Date().toISOString();

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
const send = (res, code, obj) => { const b = JSON.stringify(obj); res.writeHead(code, { 'content-type': 'application/json', 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'GET,POST,OPTIONS' }); res.end(b); };
const body = (req) => new Promise((resolve) => { let s = ''; req.on('data', (d) => (s += d)); req.on('end', () => { try { resolve(s ? JSON.parse(s) : {}); } catch { resolve({}); } }); });

const PROCESSING = new Set();
function startBackground(id, phase, fn) {
  PROCESSING.add(id);
  try { const j = core.readJob(JOB_DIR, id); j.status = phase; j.error = null; core.writeJob(JOB_DIR, j); } catch {}
  const job = core.readJob(JOB_DIR, id);
  Promise.resolve().then(() => fn(job))
    .then(() => PROCESSING.delete(id))
    .catch((e) => { try { const j = core.readJob(JOB_DIR, id); j.error = String((e && e.message) || e); j.status = 'ERROR'; core.writeJob(JOB_DIR, j); } catch {} PROCESSING.delete(id); console.error(`job ${id} failed: ${e}`); });
}
async function fastTrackTick() {
  let jobs; try { jobs = core.listJobs(JOB_DIR); } catch { return; }
  for (const j of jobs) {
    if (!j.fastTrack || PROCESSING.has(j.jobId) || j.status !== 'AWAITING_DEPOSIT') continue;
    let funded = false; try { funded = (await core.statusJob({ job: j, hiroKey: HIRO_KEY })).funded; } catch { continue; }
    if (!funded) continue;
    console.log(`fast-track ${j.jobId}: funded → auto-processing`);
    startBackground(j.jobId, 'FUNDED', (job) => core.autoRunJob({ job, enginePath: ENGINE, hiroKey: HIRO_KEY, jobDir: JOB_DIR, receiptsDir: RECEIPTS_DIR, onPhase: (s) => console.log(`  ${j.jobId} → ${s}`) }));
  }
}
setInterval(fastTrackTick, 8000);

function serveStatic(req, res) {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/' || rel === '') rel = '/index.html';
  const fp = path.join(WIZARD_DIR, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!fp.startsWith(WIZARD_DIR) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('Not found'); }
  res.writeHead(200, { 'content-type': MIME[path.extname(fp)] || 'application/octet-stream' });
  fs.createReadStream(fp).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}:${PORT}`);
    const p = url.pathname;
    if (req.method === 'OPTIONS') return send(res, 204, {});

    if (!p.startsWith('/api/')) return serveStatic(req, res);

    if (p === '/api/health') return send(res, 200, { ok: true, core: CORE, net: NET, mock: MOCK, startedAt: STARTED_AT, jobDir: JOB_DIR });

    if (p === '/api/estimate' && req.method === 'POST') {
      const b = await body(req);
      let bytes = b.bytes;
      if (!bytes && b.file) { if (!fs.existsSync(b.file)) return send(res, 400, { error: 'file not found on server: ' + b.file }); bytes = fs.statSync(b.file).size; }
      if (!bytes) return send(res, 400, { error: 'provide bytes or a server file path' });
      return send(res, 200, await core.estimate({ coreName: CORE, net: NET, bytes, marginUstx: b.marginUstx || '0', mock: MOCK }));
    }

    if (p === '/api/upload' && req.method === 'POST') {
      const name = (url.searchParams.get('name') || 'upload.bin').replace(/[^\w.\-]+/g, '_').slice(-120);
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      const dest = path.join(UPLOAD_DIR, Date.now() + '-' + name);
      const len = Number(req.headers['content-length'] || 0);
      if (len && len > MAX_UPLOAD) return send(res, 413, { error: `file too large (> ${(MAX_UPLOAD / 1048576) | 0} MiB)` });
      const ws = fs.createWriteStream(dest); let bytes = 0, done = false;
      req.on('data', (c) => { if (done) return; bytes += c.length; if (bytes > MAX_UPLOAD) { done = true; ws.destroy(); try { fs.unlinkSync(dest); } catch {} req.destroy(); send(res, 413, { error: 'file too large' }); } else ws.write(c); });
      req.on('end', () => { if (done) return; done = true; ws.end(() => send(res, 200, { path: dest, bytes })); });
      req.on('error', () => { if (!done) { done = true; try { ws.destroy(); } catch {} send(res, 500, { error: 'upload error' }); } });
      return;
    }

    if (p === '/api/jobs' && req.method === 'GET') {
      const list = core.listJobs(JOB_DIR).sort((a, b) => (b.jobId > a.jobId ? 1 : -1));
      const jobs = await Promise.all(list.map(async (j) => {
        let funded = false, balanceUstx = '0';
        try { const s = await core.statusJob({ job: j, hiroKey: HIRO_KEY }); funded = s.funded; balanceUstx = s.balanceUstx; } catch {}
        return { ...core.publicJob(j), funded, balanceUstx };
      }));
      return send(res, 200, { jobs });
    }

    if (p === '/api/jobs' && req.method === 'POST') {
      const b = await body(req);
      if (!b.file || !fs.existsSync(b.file)) return send(res, 400, { error: 'file not found on server: ' + (b.file || '(none)') });
      const job = await core.createJob({ coreName: CORE, net: NET, file: b.file, uri: b.uri, mime: b.mime || 'application/octet-stream', deps: b.deps || [], user: b.user, marginUstx: b.marginUstx || '0', jobDir: JOB_DIR, mock: MOCK, fastTrack: !!b.fastTrack });
      return send(res, 200, { job: core.publicJob(job) });
    }

    const m = p.match(/^\/api\/jobs\/([^/]+)(\/run|\/deliver|\/receipt)?$/);
    if (m) {
      const id = m[1]; let job;
      try { job = core.readJob(JOB_DIR, id); } catch { return send(res, 404, { error: 'job not found: ' + id }); }
      if (m[2] === '/receipt' && req.method === 'GET') {
        const fp = path.join(RECEIPTS_DIR, `${id}.html`);
        if (!fs.existsSync(fp)) return send(res, 404, { error: 'receipt not generated yet' });
        res.writeHead(200, { 'content-type': 'text/html', 'access-control-allow-origin': '*' });
        return fs.createReadStream(fp).pipe(res);
      }
      if (!m[2] && req.method === 'GET') return send(res, 200, { job: core.publicJob(job), status: await core.statusJob({ job, hiroKey: HIRO_KEY }) });
      if (m[2] === '/run' && req.method === 'POST') {
        if (PROCESSING.has(id)) return send(res, 200, { started: true, already: true });
        if (job.tokenId) return send(res, 400, { error: 'already inscribed' });
        const s = await core.statusJob({ job, hiroKey: HIRO_KEY });
        if (!s.funded) return send(res, 400, { error: 'not funded yet' });
        startBackground(id, 'INSCRIBING', (j) => core.runJob({ job: j, enginePath: ENGINE, hiroKey: HIRO_KEY, jobDir: JOB_DIR }));
        return send(res, 200, { started: true });
      }
      if (m[2] === '/deliver' && req.method === 'POST') {
        if (PROCESSING.has(id)) return send(res, 200, { started: true, already: true });
        if (!job.tokenId) return send(res, 400, { error: 'nothing to deliver yet' });
        startBackground(id, 'DELIVERING', (j) => core.deliverJob({ job: j, hiroKey: HIRO_KEY, jobDir: JOB_DIR, receiptsDir: RECEIPTS_DIR }));
        return send(res, 200, { started: true });
      }
    }

    return send(res, 404, { error: 'no route: ' + req.method + ' ' + p });
  } catch (e) { return send(res, 500, { error: String(e && e.message || e) }); }
});

server.listen(PORT, HOST, () => {
  console.log(`Xtrata Agent One server  http://${HOST}:${PORT}/   core=${CORE} net=${NET} mock=${MOCK}`);
  console.log(`  jobs: ${JOB_DIR}`);
  console.log(`  open the wizard at http://${HOST}:${PORT}/`);
});
