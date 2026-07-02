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
const ENGINE = process.env.ENGINE || path.resolve(__dirname, '../agent-large-inscribe.mjs');
const WIZARD_DIR = process.env.WIZARD_DIR || path.resolve(__dirname, '../wizard');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(__dirname, '../svc/uploads');
const MAX_UPLOAD = Number(process.env.MAX_UPLOAD_BYTES || 40 * 1024 * 1024);
const RECEIPTS_DIR = process.env.RECEIPTS_DIR || path.resolve(__dirname, '../svc/receipts');
const STARTED_AT = new Date().toISOString();

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
// SECURITY: no CORS headers. The wizard is served same-origin by this server; a wildcard here would
// let ANY website open in the user's browser drive this money-controlling API (create/run jobs, probe
// server files). Cross-origin callers are intentionally blocked by the browser.
const send = (res, code, obj) => { const b = JSON.stringify(obj); res.writeHead(code, { 'content-type': 'application/json' }); res.end(b); };
const body = (req) => new Promise((resolve) => { let s = ''; req.on('data', (d) => (s += d)); req.on('end', () => { try { resolve(s ? JSON.parse(s) : {}); } catch { resolve({}); } }); });

const PROCESSING = new Set();
// AUTO-RESUME: transient failures (network, timeout, estimator, rate limit) park the job back at
// FUNDED/INSCRIBED for the watcher to resume where it left off — resume is safe because the protocol is
// idempotent end-to-end (begin-or-get, on-chain upload index, hash-checked mint pre-check). Only
// deterministic failures or exhausted retries (4) fall through to the refund failsafe.
const FATAL_ERR = /TX abort|not funded|locked to|unrecoverable|file bytes|empty file|exceeds single-tx|could not determine/i;
const MAX_RETRIES = Number(process.env.AGENT_MAX_RETRIES || '4');
function startBackground(id, phase, fn) {
  PROCESSING.add(id);
  try { const j = core.readJob(JOB_DIR, id); j.status = phase; j.error = null; core.writeJob(JOB_DIR, j); } catch {}
  const job = core.readJob(JOB_DIR, id);
  Promise.resolve().then(() => fn(job))
    .then(() => {
      try { const j = core.readJob(JOB_DIR, id); if (j.retryCount && j.status === 'COMPLETE') { delete j.retryCount; core.writeJob(JOB_DIR, j); } } catch {}
      PROCESSING.delete(id);
    })
    .catch(async (e) => {
      const msg = String((e && e.message) || e);
      try {
        const j = core.readJob(JOB_DIR, id); j.error = msg;
        if (!FATAL_ERR.test(msg) && j.status !== 'AWAITING_DEPOSIT' && (j.retryCount = (j.retryCount || 0) + 1) <= MAX_RETRIES) {
          j.status = j.tokenId ? 'INSCRIBED' : 'FUNDED';
          j.progress = `recovered from a hiccup — resuming where it left off (attempt ${j.retryCount}/${MAX_RETRIES})`;
          j.progressAt = new Date().toISOString(); core.writeJob(JOB_DIR, j);
          console.warn(`job ${id}: transient error — auto-resume scheduled (${j.retryCount}/${MAX_RETRIES}): ${msg}`);
          PROCESSING.delete(id); return;
        }
        core.writeJob(JOB_DIR, j);
      } catch {}
      console.error(`job ${id} failed: ${msg} — returning funds`);
      try { const j = core.readJob(JOB_DIR, id); await core.refundAndClose({ job: j, hiroKey: HIRO_KEY, jobDir: JOB_DIR, receiptsDir: RECEIPTS_DIR, reason: 'error: ' + msg }); } catch (e2) { console.error(`job ${id} auto-refund failed:`, e2); }
      PROCESSING.delete(id);
    });
}
// Failsafe reaper: return funds + close any job that doesn't commence/progress within the window.
async function reapTick() {
  let jobs; try { jobs = core.listJobs(JOB_DIR); } catch { return; }
  const now = Date.now();
  for (const j of jobs) {
    if (PROCESSING.has(j.jobId)) continue;
    if (['COMPLETE', 'CANCELLED', 'NEEDS_RECOVERY'].includes(j.status)) continue;
    // EXPIRED = never-funded job parked with its key kept (see refundAndClose's never-strand guard).
    // Long-grace pass: after EXPIRE_GRACE_MS, one final close — sweeps any late-arriving funds back to
    // the payer, or (confirmed empty + no mempool inbound) finally discards the key.
    if (j.status === 'EXPIRED') {
      const since = Date.parse(j.expiredAt || j.createdAt || '') || 0;
      if (since && (now - since) < core.EXPIRE_GRACE_MS) {
        // During grace: poll ~every 10 min; if a late payment landed, refund it right away.
        const lastCheck = Date.parse(j.expiredCheckAt || '') || 0;
        if ((now - lastCheck) < 600000) continue;
        PROCESSING.add(j.jobId);
        (async () => {
          try {
            const jj = core.readJob(JOB_DIR, j.jobId); jj.expiredCheckAt = new Date().toISOString(); core.writeJob(JOB_DIR, jj);
            const s = await core.statusJob({ job: jj, hiroKey: HIRO_KEY });
            if (BigInt(s.balanceUstx || '0') > 0n) {
              console.log(`reaper: ${j.jobId} EXPIRED but funds arrived late → refunding to payer`);
              await core.refundAndClose({ job: jj, hiroKey: HIRO_KEY, jobDir: JOB_DIR, receiptsDir: RECEIPTS_DIR, reason: 'payment arrived after expiry — returned to sender' });
            }
          } catch (e) { console.error(`reaper ${j.jobId} grace check failed:`, e); }
          PROCESSING.delete(j.jobId);
        })();
        continue;
      }
      if (!since) continue;
      PROCESSING.add(j.jobId);
      console.log(`reaper: ${j.jobId} EXPIRED past grace → final close`);
      core.refundAndClose({ job: j, hiroKey: HIRO_KEY, jobDir: JOB_DIR, receiptsDir: RECEIPTS_DIR, reason: 'expired — grace period over', final: true })
        .then(() => PROCESSING.delete(j.jobId))
        .catch((e) => { console.error(`reaper ${j.jobId} final close failed:`, e); PROCESSING.delete(j.jobId); });
      continue;
    }
    const last = Date.parse(j.progressAt || j.createdAt || '') || 0;
    if (!last || (now - last) < core.JOB_WINDOW_MS) continue;
    PROCESSING.add(j.jobId);
    console.log(`reaper: ${j.jobId} (${j.status}) past window → return funds + close`);
    core.refundAndClose({ job: j, hiroKey: HIRO_KEY, jobDir: JOB_DIR, receiptsDir: RECEIPTS_DIR, reason: 'expired — no progress within window' })
      .then(() => PROCESSING.delete(j.jobId))
      .catch((e) => { console.error(`reaper ${j.jobId} failed:`, e); PROCESSING.delete(j.jobId); });
  }
}
setInterval(reapTick, 20000);
async function fastTrackTick() {
  let jobs; try { jobs = core.listJobs(JOB_DIR); } catch { return; }
  for (const j of jobs) {
    if (!j.fastTrack || PROCESSING.has(j.jobId)) continue;
    // Backoff between auto-resume attempts: 15 s × attempt number.
    if (j.retryCount && j.status !== 'AWAITING_DEPOSIT' && Date.now() - (Date.parse(j.progressAt || '') || 0) < 15000 * j.retryCount) continue;
    // Deliver-only resume: already inscribed, delivery was interrupted → finish delivery, never re-mint.
    if (j.status === 'INSCRIBED' && j.tokenId) {
      console.log(`fast-track ${j.jobId}: inscribed but undelivered → resuming delivery`);
      startBackground(j.jobId, 'DELIVERING', (job) => core.deliverJob({ job, hiroKey: HIRO_KEY, jobDir: JOB_DIR, receiptsDir: RECEIPTS_DIR }));
      continue;
    }
    if (j.status !== 'AWAITING_DEPOSIT' && j.status !== 'FUNDED') continue;   // also resume jobs stuck at FUNDED (e.g. after a restart)
    // A job that was funded once counts as funded — mid-flight resumes have already spent part of the deposit.
    let funded = !!j.depositReceivedUstx;
    if (!funded) { try { funded = (await core.statusJob({ job: j, hiroKey: HIRO_KEY })).funded; } catch { continue; } }
    if (!funded) continue;
    console.log(`fast-track ${j.jobId}: funded → auto-processing`);
    startBackground(j.jobId, 'FUNDED', (job) => core.autoRunJob({ job, enginePath: ENGINE, hiroKey: HIRO_KEY, jobDir: JOB_DIR, receiptsDir: RECEIPTS_DIR, onPhase: (s) => console.log(`  ${j.jobId} → ${s}`) }));
  }
}
setInterval(fastTrackTick, 5000);

function serveStatic(req, res) {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/' || rel === '') rel = '/index.html';
  const fp = path.join(WIZARD_DIR, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!(fp === path.join(WIZARD_DIR, 'index.html') || fp.startsWith(WIZARD_DIR + path.sep)) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('Not found'); }
  res.writeHead(200, { 'content-type': MIME[path.extname(fp)] || 'application/octet-stream' });
  fs.createReadStream(fp).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}:${PORT}`);
    const p = url.pathname;
    if (req.method === 'OPTIONS') return send(res, 204, {});

    if (!p.startsWith('/api/')) return serveStatic(req, res);

    if (p === '/api/health') return send(res, 200, { ok: true, core: CORE, net: NET, mock: MOCK, startedAt: STARTED_AT, windowMs: core.JOB_WINDOW_MS, jobDir: JOB_DIR });

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
        if (j.status === 'AWAITING_DEPOSIT') { try { const s = await core.statusJob({ job: j, hiroKey: HIRO_KEY }); funded = s.funded; balanceUstx = s.balanceUstx; } catch {} }
        return { ...core.publicJob(j), funded, balanceUstx };
      }));
      return send(res, 200, { jobs });
    }

    if (p === '/api/jobs' && req.method === 'POST') {
      const b = await body(req);
      if (!b.file || !fs.existsSync(b.file)) return send(res, 400, { error: 'file not found on server: ' + (b.file || '(none)') });
      const job = await core.createJob({ coreName: CORE, net: NET, file: b.file, uri: b.uri, mime: b.mime || 'application/octet-stream', deps: b.deps || [], user: b.user, expectedFunder: b.expectedFunder || null, marginUstx: b.marginUstx || '0', jobDir: JOB_DIR, mock: MOCK, fastTrack: !!b.fastTrack, suno: !!b.suno });
      return send(res, 200, { job: core.publicJob(job) });
    }

    const m = p.match(/^\/api\/jobs\/([^/]+)(\/run|\/deliver|\/receipt|\/delete)?$/);
    if (m) {
      const id = m[1]; let job;
      try { job = core.readJob(JOB_DIR, id); } catch { return send(res, 404, { error: 'job not found: ' + id }); }
      if (m[2] === '/receipt' && req.method === 'GET') {
        const fp = path.join(RECEIPTS_DIR, `${id}.html`);
        if (!fs.existsSync(fp)) return send(res, 404, { error: 'receipt not generated yet' });
        res.writeHead(200, { 'content-type': 'text/html' });
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
      if (m[2] === '/delete' && req.method === 'POST') {
        if (PROCESSING.has(id)) return send(res, 409, { error: 'job is processing — try again once it settles' });
        try { return send(res, 200, core.deleteJob({ jobDir: JOB_DIR, id, receiptsDir: RECEIPTS_DIR })); }
        catch (e) { return send(res, 400, { error: String((e && e.message) || e) }); }
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
