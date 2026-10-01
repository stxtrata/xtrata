#!/usr/bin/env node
// Look at the revised Audionauts files yourself, locally, loading the real
// inscriptions recursively: every request the files make for /i/<id> (engine
// #3060, helmets #3059, songs such as #2983 LIQUIDEZ) is passed through to
// https://xtrata.xyz, exactly as they would resolve once minted.
//   node canaries/audionauts-replacement/serve.mjs [originalsDir] [revisedDir]
// then open http://localhost:8787
import http from 'node:http';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const originals = resolve(process.argv[2] ?? join(root, '_claude_scratch/audionauts-v1-recursive'));
const revised = resolve(process.argv[3] ?? join(root, '_claude_scratch/audionauts-v1-recursive-revisions'));
const port = Number(process.env.PORT ?? 8787);
const UPSTREAM = 'https://xtrata.xyz';

const revisedFiles = existsSync(revised) ? readdirSync(revised).filter((name) => name.endsWith('.html')).sort() : [];
const index = `<!doctype html><meta charset="utf-8"><title>Audionauts revisions</title>
<body style="font-family:system-ui;background:#080d10;color:#e6eee9;padding:24px">
<h1>Audionauts revisions</h1>
<p>Each file loads engine #3060 and its songs live from xtrata.xyz. Open the star (secret song) and check the title reads
<b>LIQUIDEZ · Χ₮¡₪¢₮</b> and the song plays. Compare with the original.</p>
<ul>${revisedFiles.map((name) => `<li>${name}: <a style="color:#9fe" href="/revised/${name}">revised</a> · <a style="color:#9fe" href="/original/${name}">original</a></li>`).join('')}</ul>
${revisedFiles.length ? '' : `<p>No revised files in ${revised}. Run make-revisions.mjs first.</p>`}`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${port}`);
  try {
    if (url.pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(index);
    }
    const local = /^\/(original|revised)\/([^/]+\.html)$/.exec(url.pathname);
    if (local) {
      const file = join(local[1] === 'original' ? originals : revised, basename(local[2]));
      if (!existsSync(file)) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      return res.end(readFileSync(file));
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    // Everything else (/i/<id>, runtime assets) comes from the live site, as after minting.
    const upstream = await fetch(UPSTREAM + url.pathname + url.search, { headers: { range: req.headers.range ?? '' } });
    const headers = {};
    for (const name of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag']) {
      const value = upstream.headers.get(name);
      if (value) headers[name] = value;
    }
    res.writeHead(upstream.status, headers);
    res.end(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    res.writeHead(502, { 'content-type': 'text/plain' });
    res.end(`Could not load ${url.pathname} from ${UPSTREAM}: ${error instanceof Error ? error.message : error}`);
  }
});
server.listen(port, () => {
  console.log(`Audionauts revisions: http://localhost:${port}`);
  for (const name of revisedFiles) console.log(`  ${name}: http://localhost:${port}/revised/${name}  (original: /original/${name})`);
  console.log('Press Ctrl+C to stop.');
});
