#!/usr/bin/env node
// Local CROSS-ORIGIN-ISOLATED static server for testing the SUNO page.
// ffmpeg.wasm needs SharedArrayBuffer → which needs COOP/COEP headers that a plain
// `python -m http.server` does NOT send. This serves xtrata-agent-one/wizard with them.
// Dev/testing only (Cloudflare Pages serves the real headers from public/_headers).
//
//   node xtrata-agent-one/serve-coi.mjs        → http://localhost:4321
//   open http://localhost:4321/suno.html?mock=1   (SUNO, offline)
//   open http://localhost:4321/?mock=1            (wizard, offline)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'wizard');
const PORT = Number(process.env.PORT || 4321);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.wasm': 'application/wasm' };

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]); if (rel === '/' || rel === '') rel = '/index.html';
  const fp = path.join(DIR, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!fp.startsWith(DIR) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'content-type': TYPES[path.extname(fp)] || 'application/octet-stream',
  });
  fs.createReadStream(fp).pipe(res);
}).listen(PORT, () => console.log(`cross-origin-isolated static server → http://localhost:${PORT}  (serving ${DIR})`));
