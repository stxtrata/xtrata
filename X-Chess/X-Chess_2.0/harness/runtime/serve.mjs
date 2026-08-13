#!/usr/bin/env node
// A local stand-in for the Xtrata runtime.
//
// There is no Xtrata testnet, so this is the only place the inscribed board can
// be exercised before it is permanent. It is therefore built to be FAITHFUL
// rather than convenient: it uses the REAL runtime scripts from xtrata-2.0,
// reproduces the same injections in the same order, the same
// document.open/write/close, and the same serve-time Hiro rewrite, and proxies
// /hiro/<network> so the rewrite's target actually exists.
//
//   node harness/runtime/serve.mjs
//   node harness/runtime/serve.mjs --framed                # with a bridge host
//   node harness/runtime/serve.mjs --framed --wallet=stub  # ...and a stand-in wallet
//
// FRAMED IS NOT AN EXTRA. Reading wallet-shim.js, an inscription can only make
// a contract call when it is framed by a host holding a bridge token. That is
// how the Xtrata site opens inscriptions, so it is how every move will be
// signed. Unframed, stx_callContract is refused with -32601, and that is the
// runtime behaving as written rather than a fault.
//
// What this deliberately does not fake: the wallet. Connect drives whatever
// extension the browser has, through the real shim.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const RUNTIME_DIR = resolve(ROOT, '..', '..', 'xtrata-2.0', 'public', 'runtime');
const PORT = Number(process.env.PORT || 4331);

/**
 * Proxy cache, and how long an answer is reused.
 *
 * Three seconds is chosen against the chain rather than plucked: it is under a
 * Nakamoto block, so nothing that has landed can be hidden by it, and it is
 * enough to collapse the repeated reads a five-second poll makes across several
 * open tabs into one upstream request.
 */
const PROXY_TTL_MS = 3_000;
const PROXY_CACHE = new Map();

/**
 * The Hiro API keys, if this machine has any.
 *
 * THE KEY BELONGS TO THE PROXY AND NEVER TO THE BOARD. The board is inscribed
 * and permanent: a key compiled into it would be published forever, to be spent
 * by anybody who reads the bytes. It cannot be rotated out of an inscription and
 * it cannot be removed. `tests/artifact/artifact.test.ts` asserts the built file
 * carries no key, so this cannot happen by accident.
 *
 * The board never needs one either. Under the runtime its API calls are
 * rewritten to `/hiro/<network>`, which is the proxy - so the proxy is exactly
 * where a key can be attached, which is what production does in
 * `xtrata-2.0/functions/lib/hiro-proxy.ts`. This reads the same names from the
 * same places so that the harness and production agree.
 */
const HIRO_KEYS = (() => {
  const found = [];
  const add = (value) => {
    for (const key of String(value ?? '').split(/[\s,]+/)) {
      const trimmed = key.trim();
      if (trimmed && !found.includes(trimmed)) found.push(trimmed);
    }
  };

  // The shell first, then xtrata-2.0/.env.local - which is where the key already
  // lives, and the same directory this harness takes the runtime scripts from.
  const numbered = Object.entries(process.env)
    .map(([name, value]) => [/^HIRO_API_KEY_(\d+)$/.exec(name), value])
    .filter(([match]) => match)
    .sort((a, b) => Number(a[0][1]) - Number(b[0][1]));
  for (const [, value] of numbered) add(value);
  for (const name of ['HIRO_API_KEYS', 'HIRO_API_KEY', 'VITE_HIRO_API_KEY']) add(process.env[name]);

  try {
    const file = readFileSync(resolve(ROOT, '..', '..', 'xtrata-2.0', '.env.local'), 'utf8');
    for (const line of file.split('\n')) {
      const match = /^\s*(HIRO_API_KEYS?|HIRO_API_KEY_\d+|VITE_HIRO_API_KEY)\s*=\s*(.*)$/.exec(line);
      if (match) add(match[2].trim().replace(/^["']|["']$/g, ''));
    }
  } catch {
    // No file, or not readable. Anonymous is a supported way to run this.
  }
  return found;
})();

/**
 * Which key to use next.
 *
 * Advanced past a key that has just been refused or throttled, so a second
 * request does not walk into the same wall. Production keeps a cooldown per key
 * for the same reason; this is the small version of it.
 */
let hiroKeyIndex = 0;

// A stand-in inscription number. Nothing depends on the value; it exists so the
// board is reached by the same SHAPE of path it will be inscribed at, rather
// than by a filename.
const BOARD_ID = 9002;

const NETWORK = process.env.XCHESS_NETWORK || 'mainnet';
const framed = process.argv.includes('--framed');

const WALLET_MODE = (() => {
  const flag = process.argv.find((a) => a.startsWith('--wallet='));
  const value = flag ? flag.slice('--wallet='.length) : 'real';
  const allowed = ['real', 'stub', 'refuse', 'silent'];
  if (!allowed.includes(value)) {
    console.error(`--wallet must be one of ${allowed.join(', ')}`);
    process.exit(1);
  }
  return value;
})();

const ARTIFACT = (() => {
  const at = process.argv.indexOf('--artifact');
  return at >= 0 ? process.argv[at + 1] : 'dist/xchess.html';
})();

// ---------------------------------------------------------------------------
// The serve-time rewrite, copied from the worker
//
// ONLY text/html is rewritten. That asymmetry is the entire reason the chain
// layer has to choose its own API base: anything inscribed as JavaScript never
// passes through here.
// ---------------------------------------------------------------------------

const PROXY_ORIGIN = 'https://xtrata.xyz';

// Copied from xtrata-2.0/functions/runtime/html-hiro-rewrite.ts. All FOUR rules,
// and an ABSOLUTE origin - the worker rewrites to `${origin}/hiro/<network>`
// because rewritten HTML can end up inside a blob: document, where a relative
// path cannot resolve. An emulator that dropped two rules and the origin is an
// emulator that cannot show you what the real one does, and this one did: the
// rewrite silently eating the board's primary fallback went unnoticed for that
// reason.
const HIRO_REWRITES = [
  [/https:\/\/api\.mainnet\.hiro\.so/g, '/hiro/mainnet'],
  [/https:\/\/api\.testnet\.hiro\.so/g, '/hiro/testnet'],
  [/https:\/\/stacks-node-api\.mainnet\.stacks\.co/g, '/hiro/mainnet'],
  [/https:\/\/stacks-node-api\.testnet\.stacks\.co/g, '/hiro/testnet']
];

function rewriteHiroBases(html) {
  let out = html;
  for (const [pattern, path] of HIRO_REWRITES) out = out.replace(pattern, `${PROXY_ORIGIN}${path}`);
  return out;
}

// ---------------------------------------------------------------------------
// The viewer, reproducing public/runtime/index.html
// ---------------------------------------------------------------------------

function viewerPage(bridgeToken) {
  const shimQuery = new URLSearchParams({ network: NETWORK, debug: '1' });
  if (bridgeToken) shimQuery.set('walletBridgeToken', bridgeToken);

  return `<!doctype html>
<meta charset="utf-8">
<title>Xtrata runtime harness</title>
<script>
(async function () {
  // Fetch the inscription's bytes, exactly as the runtime does.
  const response = await fetch('/i/${BOARD_ID}');
  const html = await response.text();

  // Inject what the runtime injects, in the order it injects it: a base tag,
  // url-support, module-bootstrap, then the wallet shim. All into <head>,
  // before the inscription's own content.
  const support = [
    '<base href="' + location.origin + '/">',
    '<script data-xtrata-runtime-url-support="true" src="/runtime/url-support.js"><\\/script>',
    '<script data-xtrata-runtime-module-bootstrap="true" src="/runtime/module-bootstrap.js"><\\/script>',
    '<script src="/runtime/wallet-shim.js?${shimQuery}"><\\/script>'
  ].join('\\n');

  const withSupport = /<head[^>]*>/i.test(html)
    ? html.replace(/<head[^>]*>/i, function (m) { return m + '\\n' + support; })
    : support + '\\n' + html;

  // And WRITE it into this document, rather than navigating to it.
  document.open();
  document.write(withSupport);
  document.close();
})();
</script>
`;
}

// The host side of the bridge.
//
// Not a convenience. `stx_callContract` is rejected with -32601 unless a host
// bridge exists, and one exists only when the page carries a walletBridgeToken
// and has a parent or an opener. So for an inscribed board, EVERY move goes
// through this path.
function framedHost(bridgeToken, mode) {
  return `<!doctype html>
<meta charset="utf-8">
<title>Xtrata runtime harness - framed</title>
<style>
  body { margin:0; background:#12100e; color:#e8e2d9; font:13px ui-sans-serif,system-ui; }
  header { padding:10px 14px; border-bottom:1px solid #2e2924; display:flex; gap:12px; flex-wrap:wrap; }
  code { font-family:ui-monospace,Menlo,monospace; color:#d8a24a; }
  iframe { width:100%; height:calc(100vh - 46px); border:0; }
  #host-log { position:fixed; right:10px; bottom:10px; width:46ch; max-height:52vh; overflow:auto;
              font-family:ui-monospace,monospace; font-size:11px; background:#1b1815;
              border:1px solid #2e2924; border-radius:8px; padding:8px; white-space:pre-wrap; }
</style>
<header>
  <strong>Framed</strong>
  <span>the board is in an iframe and can reach a wallet only through this page</span>
  <code>token ${bridgeToken}</code>
  <code>wallet ${mode}</code>
</header>
<iframe id="frame" src="/viewer?walletBridgeToken=${bridgeToken}"></iframe>
<div id="host-log">host bridge idle</div>
<script>
(function () {
  var TOKEN = ${JSON.stringify(bridgeToken)};
  var MODE = ${JSON.stringify(mode)};
  var el = document.getElementById('host-log');
  var log = (window.__hostBridgeLog = []);

  function render() {
    el.textContent = log.map(function (e) { return e.method + ' -> ' + e.outcome; }).join('\\n') || 'host bridge idle';
  }

  function describe(value) {
    if (value === null || value === undefined) return String(value);
    // NOT instanceof: an Error thrown inside the frame belongs to the frame's
    // realm and fails an instanceof check against ours, which would reduce a
    // perfectly good stack trace to "{}".
    if (typeof value === 'object' && (value.stack || value.message)) {
      return String(value.stack || value.message);
    }
    if (typeof value === 'object') {
      try { return JSON.stringify(value); } catch (e) { return String(value); }
    }
    return String(value);
  }

  function record(level, text) {
    if (level !== 'error' && level !== 'warn') return;
    try {
      // Straight to the terminal, where no DevTools filter can hide it.
      navigator.sendBeacon('/harness/console', JSON.stringify({ level: level, text: text }));
    } catch (e) {}
  }

  function onFrameError(event) {
    record('error', 'uncaught: ' + event.message + (event.filename ? ' at ' + event.filename + ':' + event.lineno : ''));
  }
  function onFrameRejection(event) { record('error', 'unhandled rejection: ' + describe(event.reason)); }

  function watchFrame(frame) {
    var view = frame.contentWindow;
    if (!view) return;
    try {
      // document.open/write/close removes every listener on the window as well
      // as on the document. It does NOT remove properties, so a bare "already
      // watching" flag would survive the wipe and stop the listeners ever
      // coming back. So: guard the console patch, which survives, and simply
      // re-add the listeners.
      if (!view.console.__harnessPatched) {
        ['error', 'warn', 'log', 'info', 'debug'].forEach(function (level) {
          var original = view.console[level];
          view.console[level] = function () {
            record(level, Array.prototype.map.call(arguments, describe).join(' '));
            return original.apply(view.console, arguments);
          };
        });
        view.console.__harnessPatched = true;
      }
      view.removeEventListener('error', onFrameError);
      view.addEventListener('error', onFrameError);
      view.removeEventListener('unhandledrejection', onFrameRejection);
      view.addEventListener('unhandledrejection', onFrameRejection);
    } catch (e) {
      // A frame mid-navigation throws on access. The next tick will get it.
    }
  }

  var frame = document.getElementById('frame');
  frame.addEventListener('load', function () { watchFrame(frame); });
  var attaching = setInterval(function () { watchFrame(frame); }, 250);
  setTimeout(function () { clearInterval(attaching); }, 8000);

  function realProvider() {
    return window.LeatherProvider
      || (window.XverseProviders && (window.XverseProviders.BitcoinProvider || window.XverseProviders.StacksProvider))
      || window.StacksProvider || null;
  }

  var STUB = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
  function stubProvider(refuse) {
    return {
      request: function (method) {
        if (refuse) {
          var denied = new Error('User rejected the request');
          denied.code = 4001;
          return Promise.reject(denied);
        }
        if (/connect|Accounts|Addresses|getAccount/i.test(method)) {
          return Promise.resolve({ addresses: [{ symbol: 'STX', address: STUB }] });
        }
        if (/callContract/i.test(method)) {
          // Not a real txid. Nothing is signed and nothing is broadcast; this
          // proves the payload arrived intact and the reply got back.
          return Promise.resolve({ txid: '0x' + '00'.repeat(32) });
        }
        return Promise.resolve({});
      }
    };
  }

  window.addEventListener('message', async function (event) {
    var data = event.data;
    if (!data || data.type !== 'xtrata:wallet:request') return;
    if (event.origin !== window.location.origin) return;

    var entry = { method: data.method, params: data.params, outcome: 'pending' };

    // The real host validates the token before touching a wallet. A frame that
    // did not come from us must not be able to ask for a signature.
    if (data.bridgeToken !== TOKEN) {
      entry.outcome = 'REJECTED: bad bridge token';
      log.push(entry); render();
      return;
    }

    log.push(entry); render();
    if (MODE === 'silent') { entry.outcome = 'ignored on purpose (silent mode)'; render(); return; }

    var reply = { type: 'xtrata:wallet:response', requestId: data.requestId };
    try {
      var provider = MODE === 'real' ? realProvider() : stubProvider(MODE === 'refuse');
      if (!provider) throw new Error('no wallet extension in the host either');
      reply.ok = true;
      reply.result = await provider.request(data.method, data.params);
      entry.outcome = 'ok';
      entry.result = reply.result;
    } catch (error) {
      reply.ok = false;
      reply.error = { message: String((error && error.message) || error), code: error && error.code };
      entry.outcome = 'error: ' + reply.error.message;
    }
    render();
    event.source.postMessage(reply, window.location.origin);
  });
})();
</script>
`;
}

// ---------------------------------------------------------------------------

const TYPES = {
  '.js': 'text/javascript; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const BRIDGE_TOKEN = 'harness-bridge-token';

function send(response, status, body, type = 'text/plain; charset=utf-8') {
  response.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  response.end(body);
}

function readBody(request) {
  return new Promise((done) => {
    let data = '';
    request.on('data', (chunk) => (data += chunk));
    request.on('end', () => done(data));
  });
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  try {
    if (path === `/i/${BOARD_ID}`) {
      // HTML, so it is rewritten on the way out, exactly as the worker does.
      const html = await readFile(resolve(ROOT, ARTIFACT), 'utf8');
      return send(response, 200, rewriteHiroBases(html), TYPES['.html']);
    }

    // Any other inscription: fetched from the live site. Recursion is a real
    // runtime feature, so a harness that 404s every id it does not itself serve
    // would hide exactly the kind of breakage it exists to catch.
    if (/^\/i\/\d+$/.test(path)) {
      const id = path.slice('/i/'.length);
      const upstream = await fetch(`https://xtrata.xyz/i/${id}`);
      const body = Buffer.from(await upstream.arrayBuffer());
      console.log(`  recursion /i/${id} -> ${upstream.status} (${body.length} bytes)`);
      response.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      return response.end(body);
    }

    // The REAL runtime support scripts, read from xtrata-2.0 so they cannot
    // drift from what the site actually serves.
    if (path.startsWith('/runtime/')) {
      const name = path.slice('/runtime/'.length) || 'index.html';
      try {
        const body = await readFile(join(RUNTIME_DIR, name), 'utf8');
        return send(response, 200, body, TYPES[extname(name)] || TYPES['.js']);
      } catch {
        return send(
          response,
          500,
          `Could not read ${name} from ${RUNTIME_DIR}.\n` +
            'This harness reads the real runtime scripts rather than copies, so it needs\n' +
            'xtrata-2.0 checked out beside the xtrata repository root.'
        );
      }
    }

    // The proxy the rewrite points at.
    //
    // It CACHES, and that is not an optimisation. The public Stacks hosts allow
    // an anonymous caller about fifty requests a minute, they all share one
    // bucket, and the WALLET spends from the same allowance for its nonce, its
    // fee estimate and the broadcast itself. A board polling every five seconds
    // can eat the lot, and then a move cannot be broadcast at all - which
    // surfaces in Xverse as "unable to parse node response" and looks like
    // anything but a rate limit.
    //
    // The real runtime's proxy caches so that every viewer shares one set of
    // answers. A harness that did not would be testing a different application
    // from the one that ships.
    if (path.startsWith('/hiro/')) {
      const [, , network, ...rest] = path.split('/');
      const upstream =
        network === 'testnet' ? 'https://api.testnet.hiro.so' : 'https://api.mainnet.hiro.so';
      const target = `${upstream}/${rest.join('/')}${url.search}`;
      const body = request.method === 'POST' ? await readBody(request) : undefined;

      // Keyed on everything that changes the answer, POST body included: two
      // read-only calls to the same function with different arguments are
      // different questions.
      const key = `${request.method} ${target} ${body ?? ''}`;
      const now = Date.now();
      const hit = PROXY_CACHE.get(key);
      if (hit && now - hit.at < PROXY_TTL_MS) {
        console.log(`  proxy ${request.method} ${path} -> ${hit.status} (cached)`);
        return send(response, hit.status, hit.text, hit.type);
      }

      const apiKey = HIRO_KEYS.length ? HIRO_KEYS[hiroKeyIndex % HIRO_KEYS.length] : null;
      const headers = {
        'Content-Type': request.headers['content-type'] || 'application/json'
      };
      // Both spellings, as production sends both.
      if (apiKey) {
        headers['x-hiro-api-key'] = apiKey;
        headers['x-api-key'] = apiKey;
      }

      const upstreamResponse = await fetch(target, { method: request.method, headers, body });
      const text = await upstreamResponse.text();
      const type = upstreamResponse.headers.get('content-type') || TYPES['.json'];
      const left = upstreamResponse.headers.get('x-ratelimit-remaining-minute');
      console.log(
        `  proxy ${request.method} ${path} -> ${upstreamResponse.status}` +
          (left ? ` (${left} left this minute)` : '') +
          (apiKey ? '' : ' [anonymous]')
      );
      // 401 and 403 belong here with 429: a key that is wrong or revoked fails
      // every request identically, and staying on it is the same stuck page.
      if ([401, 403, 429].includes(upstreamResponse.status) && HIRO_KEYS.length > 1) {
        hiroKeyIndex += 1;
        console.log(`  .. switching to Hiro key ${(hiroKeyIndex % HIRO_KEYS.length) + 1} of ${HIRO_KEYS.length}`);
      }
      if (upstreamResponse.status === 429) {
        console.log('  !! RATE LIMITED. The wallet shares this allowance, so a move may');
        console.log('  !! fail to broadcast until the minute rolls over.');
        if (!HIRO_KEYS.length) {
          console.log('  !! No Hiro API key found. Put HIRO_API_KEY in xtrata-2.0/.env.local');
          console.log('  !! and restart: an anonymous caller gets about fifty requests a minute.');
        }
      }
      // Only successes are cached. A 429 or a 5xx is a thing to retry, and
      // remembering one would turn a passing problem into a stuck page.
      if (upstreamResponse.status < 400) {
        PROXY_CACHE.set(key, { at: now, status: upstreamResponse.status, text, type });
      }
      return send(response, upstreamResponse.status, text, type);
    }

    if (path === '/harness/console' && request.method === 'POST') {
      try {
        const { level, text } = JSON.parse(await readBody(request));
        console.log(`  [board ${level === 'error' ? 'ERROR' : 'WARN '}] ${text}`);
      } catch {
        // A malformed beacon is not worth failing a request over.
      }
      return send(response, 204, '');
    }

    if (path === '/viewer') {
      return send(response, 200, viewerPage(url.searchParams.get('walletBridgeToken')), TYPES['.html']);
    }

    if (path === '/' || path === '/index.html') {
      return framed
        ? send(response, 200, framedHost(BRIDGE_TOKEN, WALLET_MODE), TYPES['.html'])
        : send(response, 200, viewerPage(null), TYPES['.html']);
    }

    return send(response, 404, 'not found');
  } catch (error) {
    console.error(error);
    return send(response, 500, String(error?.message || error));
  }
});

server.listen(PORT, () => {
  console.log(`\nXtrata runtime harness on http://localhost:${PORT}`);
  console.log(`  mode      ${framed ? `framed, wallet over the host bridge (${WALLET_MODE})` : 'top frame, no bridge'}`);
  console.log(`  artefact  ${ARTIFACT}  served as HTML, Hiro bases rewritten`);
  console.log(`  runtime   real scripts from ${RUNTIME_DIR}`);
  console.log(
    `  proxy     /hiro/<network> -> the public API, ` +
      (HIRO_KEYS.length
        ? `${HIRO_KEYS.length} Hiro key${HIRO_KEYS.length > 1 ? 's' : ''} attached AT THE PROXY`
        : 'anonymous (about fifty requests a minute, shared with your wallet)') +
      '\n'
  );
  console.log('Every API request the board makes is logged below. If any of them go');
  console.log('straight to api.mainnet.hiro.so rather than through the proxy, that is');
  console.log('the rate-limit problem showing itself.');
  if (!framed) {
    console.log('\nTop frame, so there is no bridge token and stx_callContract will be');
    console.log('refused by the shim with -32601. That is the runtime behaving as');
    console.log('written, not a fault. Use --framed to sign anything.');
  }
  console.log('');
});
