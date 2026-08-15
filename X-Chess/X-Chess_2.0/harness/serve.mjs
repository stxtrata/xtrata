#!/usr/bin/env node
// A plain static server for dist/, so you can open the built artefacts.
//
//   node harness/serve.mjs            then http://localhost:4330
//
// This is NOT the runtime harness. It serves the files as an ordinary web
// server would, which is enough to click around the board and to open the gates
// page with a wallet.
//
// It is deliberately not enough to prove anything about an inscription. Under
// the Xtrata runtime the document is assembled with document.write, support
// scripts are injected, API bases are rewritten at serve time, and signing
// needs a host bridge. For any of that, use harness/runtime/serve.mjs.
//
// Serving rather than opening file:// matters: a page opened from the
// filesystem has a null origin, and every API request it makes is refused by
// CORS before it leaves the browser.

import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DIST = resolve(ROOT, 'dist');
const PORT = Number(process.env.PORT || 4330);

/**
 * The keyed proxy the served page is pointed at. See `withApiOverride`.
 *
 * `XCHESS_API` overrides the host; `--no-proxy` serves the artefact untouched,
 * which is the anonymous public path an inscribed board falls back to.
 */
const DEFAULT_PROXY = 'https://xtrata.xyz/hiro/mainnet';
const API_BASE = process.argv.includes('--no-proxy')
  ? null
  : process.env.XCHESS_API || DEFAULT_PROXY;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const server = createServer(async (request, response) => {
  const path = new URL(request.url, `http://localhost:${PORT}`).pathname;

  if (path === '/') {
    let files = [];
    try {
      files = await readdir(DIST);
    } catch {
      return send(response, 500, 'dist/ does not exist yet. Run: npm run build');
    }
    const links = files
      .filter((f) => f.endsWith('.html'))
      .map((f) => `<li><a href="/${f}">${f}</a></li>`)
      .join('');
    return send(
      response,
      200,
      `<!doctype html><meta charset="utf-8"><title>X Chess 2 dist</title>
       <body style="font:15px system-ui;max-width:40em;margin:3em auto;padding:0 1em">
       <h1>X Chess 2</h1><ul>${links || '<li>nothing built yet</li>'}</ul>
       <p style="color:#666">A plain static server. For anything about the Xtrata runtime,
       use <code>npm run serve:runtime</code>.</p>`,
      TYPES['.html']
    );
  }

  try {
    // Only from dist/, and only the basename, so no path escapes it.
    const name = path.replace(/^\/+/, '').split('/').pop();
    let body = await readFile(join(DIST, name), 'utf8');
    if (extname(name) === '.html') body = withApiOverride(body);
    return send(response, 200, body, TYPES[extname(name)] || 'text/plain; charset=utf-8');
  } catch {
    return send(response, 404, 'not found');
  }
});

/**
 * Point the served page at the keyed proxy, AT SERVE TIME.
 *
 * WHY NOT IN THE ARTEFACT. The file in dist/ is what gets inscribed, and an
 * inscription naming one host would make that host a permanent dependency of a
 * permanent page - the exact thing the fallback list in `endpoint.ts` exists to
 * prevent. So the override is injected by the server and never written to disk;
 * the built file is byte-identical with or without this.
 *
 * WHY IT IS NEEDED AT ALL. A browser cannot send an API key to Hiro: the
 * `access-control-allow-headers` Hiro returns is `origin, content-type`, so a
 * key header fails preflight before the request leaves the machine. Every
 * anonymous read therefore lands on a per-IP allowance of fifty a minute -
 * measured - and a board watching one live game spends about eighteen of them.
 * One spectator, one game, and the allowance is most of the way gone.
 *
 * Worse, Hiro's 429 carries no CORS header at all, so the refusal is blocked
 * before the page can read its status: a rate limit arrives disguised as the
 * network being down.
 *
 * The proxy fixes both. It attaches the key server-side where CORS does not
 * apply, and it sets its own CORS headers on every response including
 * refusals - so a 429 keeps its status and the board can say what is actually
 * wrong. Measured through it: 899 remaining rather than 46.
 *
 * DEFAULT ON, because it is what an inscribed page gets - `endpointsFor` puts
 * the runtime proxy first whenever the runtime is serving. A local board
 * without this is testing a path production does not take.
 *
 * `--no-proxy` turns it off, which is how you test the path production DOES
 * take when the proxy is unavailable: the public hosts, anonymous, with every
 * degradation that implies. That path is real and worth being able to reach.
 */
function withApiOverride(html) {
  if (!API_BASE) return html;
  const tag =
    `<script>window.__XCHESS_API__=${JSON.stringify(API_BASE)};</script>`;
  // Before anything else runs. The bundle reads the global when it builds its
  // endpoint list, which happens on first import.
  return html.includes('<head>') ? html.replace('<head>', `<head>${tag}`) : tag + html;
}

function send(response, status, body, type = 'text/plain; charset=utf-8') {
  response.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  response.end(body);
}

server.listen(PORT, () => {
  console.log(`\ndist/ on http://localhost:${PORT}\n`);
  console.log(
    API_BASE
      ? `  reads via ${API_BASE}  (keyed; --no-proxy for the anonymous path)`
      : '  reads go straight to the public hosts, anonymously — about 50/min per IP'
  );
  console.log('  /xchess.html         the board');
  console.log('  /xchess-gates.html   the deployment and inscription gates');
  console.log('\nA plain static server. It proves nothing about the Xtrata runtime;');
  console.log('for that, use npm run serve:runtime.\n');
});
