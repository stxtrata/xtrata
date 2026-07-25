#!/usr/bin/env node
/* Local static server for reviewing the collection before inscription.
 * usage: node scripts/serve.mjs   ->  http://localhost:8190/apps/gallery/
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 8190;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' };

const APPS = [
  ['/apps/gallery/', 'Gallery', 'Review all 33 editions rendered by the engine'],
  ['/apps/canary/canary.html', 'Inscription canary', 'Inscribe the engine as a child of 2838, then the 33 editions'],
  ['/apps/drop-canary/', 'Free drop canary', 'Create the sponsored claim campaign and escrow all 33 editions'],
  ['/apps/wrapper-generator/', 'Wrapper generator', 'Generate wrappers for editions 34 and beyond'],
  ['/apps/campaign/runner.html', 'Campaign runner', 'Two-account post sequence with a live claim counter']
];
const INDEX = `<!doctype html><meta charset=utf-8><title>Proof of Free V3</title>
<style>html{background:#080808;color:#f5ede2;font:14px ui-monospace,SFMono-Regular,Menlo,monospace}
body{margin:0;padding:48px clamp(16px,5vw,64px);max-width:760px}
h1{font-size:clamp(20px,4vw,34px);text-transform:uppercase;letter-spacing:.08em;margin:0 0 4px}
p.sub{opacity:.55;margin:0 0 32px}
a{display:block;border:1px solid #2c2c36;border-radius:10px;padding:14px 16px;margin-bottom:10px;color:inherit;text-decoration:none}
a:hover{border-color:#ff6a00;background:#18120e}
b{display:block;font-size:15px;margin-bottom:3px}
span{opacity:.55;font-size:12px}</style>
<h1>Proof of Free V3</h1><p class=sub>One engine &middot; 33 seeds &middot; open tail</p>
${APPS.map(([href, name, desc]) => `<a href="${href}"><b>${name}</b><span>${desc}</span></a>`).join('\n')}`;

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(req.url.split('?')[0]);
    // The root used to jump straight to the gallery, which made every other app
    // look broken if you forgot its path. List them instead.
    if (path === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' });
      res.end(INDEX);
      return;
    }
    if (path.endsWith('/')) path += 'index.html';
    const file = normalize(join(ROOT, path));
    if (!file.startsWith(ROOT)) { res.writeHead(403).end('Forbidden'); return; }
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    });
    res.end(data);
  } catch (err) {
    res.writeHead(err.code === 'ENOENT' ? 404 : 500).end(String(err));
  }
}).listen(PORT, () => console.log(`Proof of Free v6 on http://localhost:${PORT}/apps/gallery/`));
