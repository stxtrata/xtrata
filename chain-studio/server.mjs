import http from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { resolve, join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { Engine } from './lib/engine.mjs';
import { cachedCatalog, discoverCatalog } from './lib/catalog.mjs';
import { safePath } from './lib/workspace.mjs';
import { runProcess } from './lib/process.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain', '.md': 'text/plain' };
const json = (res, value, code = 200) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };
async function body(req) {
  let value = ''; for await (const chunk of req) { value += chunk; if (value.length > 200000) throw new Error('Request is too large.'); }
  return JSON.parse(value || '{}');
}

export async function createStudio({ port = 4317, previewPort = 4318, dataDir = join(root, '.data'), execute } = {}) {
  const engine = new Engine(dataDir, { execute }); await engine.init();
  const token = randomBytes(32).toString('hex'); let catalog = await cachedCatalog(); const clients = new Set();
  let mainOrigin, previewOrigin;
  const update = run => { for (const res of clients) res.write(`event: run\ndata: ${JSON.stringify(run)}\n\n`); };
  engine.on('update', update);
  const server = http.createServer(async (req, res) => {
    try {
      if (!['127.0.0.1', 'localhost'].includes((req.headers.host || '').split(':')[0])) return json(res, { error: 'Invalid host.' }, 403);
      const url = new URL(req.url, mainOrigin);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Referrer-Policy', 'no-referrer');
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (req.headers.origin !== mainOrigin || req.headers['x-chain-token'] !== token) return json(res, { error: 'Reload Chain Studio before making this change.' }, 403);
        if (!req.headers['content-type']?.startsWith('application/json')) return json(res, { error: 'JSON request required.' }, 415);
      }
      if (url.pathname === '/api/bootstrap' && req.method === 'GET') return json(res, { token, catalog, previewOrigin, cwd: dirname(root), platform: process.platform });
      if (url.pathname === '/api/models/refresh' && req.method === 'POST') {
        try {
          const live = await discoverCatalog(); const cached = await cachedCatalog();
          const additional = cached.models.filter(m => !live.models.some(v => v.id === m.id));
          catalog = { ...live, models: [...live.models, ...additional] };
          if (additional.length) { catalog.source = 'Live + desktop catalog'; catalog.warning = 'Some desktop models are absent from the CLI list. Their availability will be checked when the stage starts.'; }
        } catch (e) { catalog = { ...await cachedCatalog(), warning: e.message }; }
        return json(res, catalog);
      }
      if (url.pathname === '/api/runs' && req.method === 'GET') return json(res, [...engine.runs.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      if (url.pathname === '/api/runs' && req.method === 'POST') return json(res, await engine.create(await body(req), catalog), 201);
      if (url.pathname === '/api/events' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
        res.write(': connected\n\n'); clients.add(res); req.on('close', () => clients.delete(res)); return;
      }
      const match = url.pathname.match(/^\/api\/runs\/([a-f0-9-]+)(?:\/(.*))?$/);
      if (match) {
        const [, id, action] = match;
        if (!action && req.method === 'GET') return json(res, engine.get(id));
        if (req.method === 'POST') {
          const data = await body(req);
          if (action === 'pause') return json(res, engine.pause(id));
          if (action === 'cancel') return json(res, engine.cancel(id));
          if (action === 'resume') return json(res, engine.resume(id, data.tokenBudget));
          if (action === 'feedback') return json(res, engine.feedback(id, data.stage, data.text));
          const test = action?.match(/^stages\/(\d+)\/test$/);
          if (test) {
            const index = Number(test[1]); engine.snapshot(id, index);
            if (!String(data.command || '').trim()) throw new Error('Enter a test command.');
            if (engine.tests.size >= 3 || engine.get(id).stages[index].tests.some(t => t.status === 'running')) throw new Error('A test is already running. Wait for it to finish.');
            engine.test(id, index, String(data.command)).catch(e => engine.emit('test-error', e));
            return json(res, { started: true }, 202);
          }
        }
        const file = action?.match(/^stages\/(\d+)\/file$/);
        if (file && req.method === 'GET') {
          const path = await safePath(engine.snapshot(id, Number(file[1])), url.searchParams.get('path') || '');
          const info = await stat(path); if (!info.isFile() || info.size > 2_000_000) throw new Error('Select a text file smaller than 2 MB.');
          return json(res, { content: await readFile(path, 'utf8') });
        }
        const download = action?.match(/^stages\/(\d+)\/download$/);
        if (download && req.method === 'GET') {
          const snapshot = engine.snapshot(id, Number(download[1]));
          const archive = join(engine.stageDir(id, Number(download[1])), 'snapshot.tar.gz');
          const packed = await runProcess('/usr/bin/tar', ['-czf', archive, '-C', snapshot, '.'], { timeout: 30000 });
          if (packed.code !== 0) throw new Error('Could not package the snapshot.');
          res.writeHead(200, { 'Content-Type': 'application/gzip', 'Content-Disposition': `attachment; filename="chain-${id.slice(0, 8)}-stage-${Number(download[1]) + 1}.tar.gz"` });
          return res.end(await readFile(archive));
        }
        return json(res, { error: 'Not found.' }, 404);
      }
      if (url.pathname.startsWith('/api/')) return json(res, { error: 'Not found.' }, 404);
      if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, { error: 'Method not allowed.' }, 405);
      const path = await safePath(join(root, 'public'), url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1)));
      res.setHeader('Content-Security-Policy', `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-src ${previewOrigin}; object-src 'none'; base-uri 'none'; frame-ancestors 'none'`);
      res.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream'); res.end(await readFile(path));
    } catch (error) { if (!res.headersSent) json(res, { error: error.message }, error.code === 'ENOENT' ? 404 : 400); else res.end(); }
  });
  const preview = http.createServer(async (req, res) => {
    try {
      if (!['127.0.0.1', 'localhost'].includes((req.headers.host || '').split(':')[0]) || req.method !== 'GET') throw new Error('Invalid preview request.');
      const url = new URL(req.url, previewOrigin); const match = url.pathname.match(/^\/([a-f0-9-]+)\/(\d+)\/(.*)$/);
      if (!match) throw new Error('Preview not found.');
      const snapshot = engine.snapshot(match[1], Number(match[2])); let relativePath = decodeURIComponent(match[3]) || 'index.html';
      let path = await safePath(snapshot, relativePath); if ((await stat(path)).isDirectory()) path = await safePath(snapshot, relativePath + '/index.html');
      res.setHeader('Content-Security-Policy', `sandbox allow-scripts allow-forms; default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' ${previewOrigin}; style-src 'unsafe-inline' ${previewOrigin}; img-src data: blob: ${previewOrigin}; font-src data: ${previewOrigin}; media-src blob: data: ${previewOrigin}; connect-src 'none'; form-action 'none'; base-uri 'none'`);
      res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Cache-Control', 'no-store'); res.setHeader('Referrer-Policy', 'no-referrer');
      res.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream'); res.end(await readFile(path));
    } catch (error) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Preview unavailable. Select a completed stage with an HTML entry file.'); }
  });
  const listen = (s, p) => new Promise((ok, no) => { s.once('error', no); s.listen(p, '127.0.0.1', () => { s.off('error', no); ok(); }); });
  await listen(server, port); mainOrigin = `http://127.0.0.1:${server.address().port}`;
  try { await listen(preview, previewPort); } catch (e) { server.close(); throw e; }
  previewOrigin = `http://127.0.0.1:${preview.address().port}`;
  const heartbeat = setInterval(() => { for (const res of clients) res.write(': heartbeat\n\n'); }, 15000); heartbeat.unref();
  return { engine, server, preview, origin: mainOrigin, previewOrigin, close: async () => { engine.stop(); clearInterval(heartbeat); clients.forEach(res => res.end()); await Promise.all([new Promise(r => server.close(r)), new Promise(r => preview.close(r))]); } };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const studio = await createStudio({ port: Number(process.env.PORT || 4317), previewPort: Number(process.env.PREVIEW_PORT || 4318), dataDir: process.env.CHAIN_DATA_DIR || join(root, '.data') });
  console.log(`Chain Studio: ${studio.origin}\nSnapshot previews: ${studio.previewOrigin}`);
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await studio.close(); process.exit(0); });
}
