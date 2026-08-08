#!/usr/bin/env node
// A plain static file server for the board.
//
// Deliberately not a bundler dev server. The inscribed page is static files
// with native ES modules and no build step at runtime, so serving it any other
// way would be testing something we are not going to ship.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.env.PORT || 4321);

// How many ports to try past the first one before giving up. A stale server
// from an earlier session should not stop this one starting.
const PORT_ATTEMPTS = 20;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

async function handle(request, response) {
  const url = new URL(request.url, 'http://localhost');
  const relative = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  const target = join(ROOT, relative === '/' ? 'index.html' : relative);

  if (!target.startsWith(ROOT)) {
    response.writeHead(403).end('forbidden');
    return;
  }

  try {
    const body = await readFile(target);
    response.writeHead(200, {
      'Content-Type': TYPES[extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found');
  }
}

// Walk up from the requested port until one is free, so a stale server from an
// earlier session does not stop this one starting. Each attempt gets its own
// server: a failed listen() leaves its 'listening' callback attached, and
// reusing one instance makes it fire again on every later attempt.
function listen(port, attemptsLeft) {
  const server = createServer(handle);

  server.once('error', (error) => {
    if (error.code !== 'EADDRINUSE' || attemptsLeft <= 0) {
      console.error(error.message);
      process.exit(1);
    }
    console.log(`port ${port} is busy, trying ${port + 1}`);
    server.close();
    listen(port + 1, attemptsLeft - 1);
  });

  server.once('listening', () => {
    console.log(`xtrata-chess board on http://localhost:${port}`);
  });

  server.listen(port);
}

listen(PORT, PORT_ATTEMPTS);
