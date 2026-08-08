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
    const body = await readFile(join(DIST, name), 'utf8');
    return send(response, 200, body, TYPES[extname(name)] || 'text/plain; charset=utf-8');
  } catch {
    return send(response, 404, 'not found');
  }
});

function send(response, status, body, type = 'text/plain; charset=utf-8') {
  response.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  response.end(body);
}

server.listen(PORT, () => {
  console.log(`\ndist/ on http://localhost:${PORT}\n`);
  console.log('  /xchess.html         the board');
  console.log('  /xchess-gates.html   the deployment and inscription gates');
  console.log('\nA plain static server. It proves nothing about the Xtrata runtime;');
  console.log('for that, use npm run serve:runtime.\n');
});
