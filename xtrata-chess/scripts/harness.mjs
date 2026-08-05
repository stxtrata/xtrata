#!/usr/bin/env node
// A local stand-in for the Xtrata runtime.
//
// There is no Xtrata testnet, so this is the only place the inscribed board can
// be exercised before it is permanent. It is therefore built to be faithful
// rather than convenient: it uses the real runtime scripts from xtrata-2.0,
// reproduces the same injection, the same document.write, and the same
// serve-time Hiro rewrite, and proxies /hiro/<network> so the rewrite's target
// actually exists.
//
// What it deliberately does not fake: the wallet. Connect drives whatever
// extension the browser has, through the real shim.
//
//   node scripts/harness.mjs
//   node scripts/harness.mjs --framed                  # in an iframe, with a bridge host
//   node scripts/harness.mjs --framed --wallet=stub    # ...and a stand-in wallet
//
// Framed is not an extra: reading wallet-shim.js, an inscription can only make a
// contract call when it is framed by a host holding a bridge token. That is how
// the Xtrata site opens inscriptions, so it is how every move will be signed.
//
// Then open http://localhost:4331
//
// Anything this harness cannot reach is listed in TESTING-INSCRIPTION.md.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const RUNTIME_DIR = resolve(ROOT, '..', 'xtrata-2.0', 'public', 'runtime');
const PORT = Number(process.env.PORT || 4331);

// Stand-in inscription numbers. Nothing depends on the values; they exist so the
// board and engine are reached by the same shape of path they will be inscribed
// at, rather than by a filename.
const ENGINE_ID = 9001;
const BOARD_ID = 9002;

const CONTRACT = process.env.XTRATA_CHESS_CONTRACT
  || 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-chess-log-v2';
const NETWORK = process.env.XTRATA_CHESS_NETWORK || 'mainnet';

const framed = process.argv.includes('--framed');

// What plays the wallet on the host side. See framedHost().
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

// ---------------------------------------------------------------------------
// The serve-time rewrite, copied from functions/runtime/html-hiro-rewrite.ts
// ---------------------------------------------------------------------------

const HIRO_REWRITES = [
  [/https:\/\/api\.mainnet\.hiro\.so/g, '/hiro/mainnet'],
  [/https:\/\/api\.testnet\.hiro\.so/g, '/hiro/testnet']
];

// Only text/html is rewritten. That is the whole reason the engine has to choose
// its own API base: it is inscribed as JavaScript and never passes through here.
function rewriteHiroBases(html) {
  let out = html;
  for (const [pattern, replacement] of HIRO_REWRITES) out = out.replace(pattern, replacement);
  return out;
}

// ---------------------------------------------------------------------------
// Artifacts
// ---------------------------------------------------------------------------

async function engineSource() {
  return readFile(resolve(ROOT, 'dist', 'xtrata-chess-engine.js'), 'utf8');
}

// The thin board, exactly as `--board` produces it.
function boardHtml() {
  return `<!doctype html>
<meta charset="utf-8">
<title>Xtrata Open Board</title>
<script>window.__XTRATA_CHESS_BOARD__ = ${JSON.stringify({ contract: CONTRACT, network: NETWORK })};</script>
<script src="/i/${ENGINE_ID}"></script>
`;
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
    ? html.replace(/<head[^>]*>/i, (m) => m + '\\n' + support)
    : support + '\\n' + html;

  // And write it into this document, rather than navigating to it.
  document.open();
  document.write(withSupport);
  document.close();
})();
</script>
`;
}

// The host side of the bridge.
//
// This is not a convenience. Reading wallet-shim.js: `stx_callContract` is
// rejected outright with -32601 unless a host bridge exists, and a host bridge
// exists only when the page carries a walletBridgeToken and has a parent or an
// opener. So for an inscribed board, every move goes through this path. It is
// the single most important thing on this harness and it is the part that has
// never run.
//
// The host mints the token, validates it on the way back, and drives a wallet.
// The Xtrata site does exactly this in src/App.tsx and TokenContentPreview.tsx.
//
// `mode` decides what plays the wallet:
//   real    — whatever extension this browser has, which is the honest test
//   stub    — a recording stand-in that approves, so the path can be exercised
//             with no extension installed and the payload can be inspected
//   refuse  — a stand-in that rejects, to see how the board reports a refusal
//   silent  — never answers, to prove the board does not hang forever
function framedHost(bridgeToken, mode) {
  return `<!doctype html>
<meta charset="utf-8">
<title>Xtrata runtime harness · framed</title>
<style>
  body { margin:0; background:#12100e; color:#e8e2d9; font:13px ui-sans-serif,system-ui; }
  header { padding:10px 14px; border-bottom:1px solid #2e2924; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
  code { font-family:ui-monospace,Menlo,monospace; color:#d8a24a; }
  iframe { width:100%; height:calc(100vh - 46px); border:0; }
  #host-log { position:fixed; right:10px; bottom:10px; width:46ch; max-height:52vh; overflow:auto;
              font-family:ui-monospace,monospace; font-size:11px; background:#1b1815;
              border:1px solid #2e2924; border-radius:8px; padding:8px; white-space:pre-wrap; }
  .warn { color:#e0733f; }
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

  // Everything the frame asked for, kept so the payload can be inspected after
  // the fact rather than only watched going past.
  var log = (window.__hostBridgeLog = []);

  function render() {
    el.textContent = log.map(function (entry) {
      return entry.method + ' -> ' + entry.outcome;
    }).join('\\n') || 'host bridge idle';
  }

  // Everything the framed board logs, mirrored out of the frame.
  //
  // DevTools hides a lot by default: the level filter starts above debug, and
  // the Issues panel tucks whole categories behind "N hidden". An inscribed
  // page's console is the only diagnostic channel it has, so the harness
  // reports it rather than leaving it to be found.
  //
  // Same origin, so the frame's console and errors are reachable from here.
  var captured = (window.__frameConsole = { error: [], warn: [], log: [], info: [], debug: [] });

  function describe(value) {
    if (value === null || value === undefined) return String(value);
    // Not instanceof: an Error thrown inside the frame belongs to the frame's
    // realm and fails an instanceof check against ours, which would reduce a
    // perfectly good stack trace to "{}".
    if (typeof value === 'object' && (value.stack || value.message)) {
      return String(value.stack || value.message);
    }
    if (typeof value === 'object') {
      try { return JSON.stringify(value); } catch (error) { return String(value); }
    }
    return String(value);
  }

  function record(level, text) {
    captured[level].push(text);
    if (level !== 'error' && level !== 'warn') return;
    try {
      // Straight to the terminal, where nothing can filter it away.
      navigator.sendBeacon('/harness/console', JSON.stringify({ level: level, text: text }));
    } catch (error) {}
  }

  // Stable references, so re-registering cannot pile up duplicates.
  function onFrameError(event) {
    var where = event.filename ? ' at ' + event.filename + ':' + event.lineno : '';
    record('error', 'uncaught: ' + event.message + where);
  }

  function onFrameRejection(event) {
    record('error', 'unhandled rejection: ' + describe(event.reason));
  }

  function watchFrameConsole(frame) {
    var view = frame.contentWindow;
    if (!view) return;

    // The runtime replaces the document with document.open/write/close, and
    // that removes every listener on the window as well as on the document.
    // It does not remove properties, so a "already watching" flag would survive
    // the wipe and stop the listeners ever coming back. Hence: guard the
    // console patch, which does survive, and simply re-add the listeners.
    try {
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
    } catch (error) {
      // A frame mid-navigation can throw on access. The next tick will get it.
    }
  }

  function realProvider() {
    var w = window;
    return w.LeatherProvider
      || (w.XverseProviders && (w.XverseProviders.BitcoinProvider || w.XverseProviders.StacksProvider))
      || w.StacksProvider
      || null;
  }

  // A stand-in wallet. It answers in the shapes real wallets answer in, so the
  // shim's own address extraction is exercised rather than bypassed.
  var STUB_ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
  function stubProvider(refuse) {
    return {
      request: function (method, params) {
        if (refuse) {
          var denied = new Error('User rejected the request');
          denied.code = 4001;
          return Promise.reject(denied);
        }
        if (/connect|Accounts|Addresses|getAccount/i.test(method)) {
          return Promise.resolve({
            addresses: [{ symbol: 'STX', address: STUB_ADDRESS }]
          });
        }
        if (/callContract/i.test(method)) {
          // Not a real txid. Nothing is signed and nothing is broadcast; this
          // exists to prove the payload arrived intact and the reply gets back.
          return Promise.resolve({ txid: '0x' + '00'.repeat(32) });
        }
        return Promise.resolve({});
      }
    };
  }

  // The board is written into the frame after load, so watch on load and again
  // shortly after, the same way the shim reinstalls itself.
  // Re-attach for a while rather than once: the document write lands after
  // load, and the shim itself reinstalls on a schedule for the same reason.
  var frame = document.getElementById('frame');
  frame.addEventListener('load', function () { watchFrameConsole(frame); });
  var attaching = setInterval(function () { watchFrameConsole(frame); }, 250);
  setTimeout(function () { clearInterval(attaching); }, 8000);

  window.addEventListener('message', async function (event) {
    var data = event.data;
    if (!data || data.type !== 'xtrata:wallet:request') return;
    if (event.origin !== window.location.origin) return;

    var entry = { method: data.method, params: data.params, outcome: 'pending' };

    // The real host validates the token before touching a wallet. A frame that
    // did not come from us must not be able to ask for a signature.
    if (data.bridgeToken !== TOKEN) {
      entry.outcome = 'REJECTED: bad bridge token';
      log.push(entry);
      render();
      return;
    }

    log.push(entry);
    render();

    if (MODE === 'silent') {
      entry.outcome = 'ignored on purpose (silent mode)';
      render();
      return;
    }

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
// Server
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

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  try {
    // The inscription content routes.
    if (path === `/i/${ENGINE_ID}`) {
      // JavaScript, so the Hiro rewrite does not apply. That asymmetry is the
      // entire reason the engine picks its own API base.
      return send(response, 200, await engineSource(), TYPES['.js']);
    }

    if (path === `/i/${BOARD_ID}`) {
      // HTML, so it is rewritten on the way out, exactly as the worker does.
      return send(response, 200, rewriteHiroBases(boardHtml()), TYPES['.html']);
    }

    // The real runtime support scripts, read from xtrata-2.0 so they cannot
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
            'The harness reads the real runtime scripts rather than copies, so it needs\n' +
            'xtrata-2.0 checked out beside xtrata-chess.'
        );
      }
    }

    // The proxy the rewrite points at.
    if (path.startsWith('/hiro/')) {
      const [, , network, ...rest] = path.split('/');
      const upstream = network === 'testnet'
        ? 'https://api.testnet.hiro.so'
        : 'https://api.mainnet.hiro.so';
      const target = `${upstream}/${rest.join('/')}${url.search}`;

      const body = request.method === 'POST' ? await readBody(request) : undefined;
      const upstreamResponse = await fetch(target, {
        method: request.method,
        headers: { 'Content-Type': request.headers['content-type'] || 'application/json' },
        body
      });
      const text = await upstreamResponse.text();
      console.log(`  proxy ${request.method} ${path} -> ${upstreamResponse.status}`);
      return send(
        response,
        upstreamResponse.status,
        text,
        upstreamResponse.headers.get('content-type') || TYPES['.json']
      );
    }

    // Console traffic from the framed board, so it lands in the terminal
    // instead of behind a DevTools filter.
    if (path === '/harness/console' && request.method === 'POST') {
      try {
        const { level, text } = JSON.parse(await readBody(request));
        const mark = level === 'error' ? 'ERROR' : 'WARN ';
        console.log(`  [board ${mark}] ${text}`);
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

function readBody(request) {
  return new Promise((done) => {
    let data = '';
    request.on('data', (chunk) => (data += chunk));
    request.on('end', () => done(data));
  });
}

server.listen(PORT, () => {
  console.log(`\nXtrata runtime harness on http://localhost:${PORT}`);
  console.log(`  mode      ${framed ? `framed, wallet over the host bridge (${WALLET_MODE})` : 'top frame, no bridge'}`);
  console.log(`  contract  ${CONTRACT} (${NETWORK})`);
  console.log(`  engine    /i/${ENGINE_ID}   served as JavaScript, not rewritten`);
  console.log(`  board     /i/${BOARD_ID}   served as HTML, Hiro bases rewritten`);
  console.log(`  runtime   real scripts from ${RUNTIME_DIR}`);
  console.log(`  proxy     /hiro/<network> -> the public API\n`);
  console.log('Every API request the board makes is logged below. If any of them');
  console.log('go straight to api.mainnet.hiro.so rather than through the proxy,');
  console.log('that is the rate-limit problem showing itself.');
  if (!framed) {
    console.log('\nTop frame, so there is no bridge token and stx_callContract will be');
    console.log('refused by the shim with -32601. That is the runtime behaving as');
    console.log('written, not a fault. Use --framed to sign anything.');
  }
  console.log('');
});
