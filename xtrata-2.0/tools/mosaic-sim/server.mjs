// Mosaic simulator — a fake chain served from folders.
//
//   node tools/mosaic-sim/server.mjs        then open http://localhost:8123
//
// Answers the SAME endpoints the real mosaic calls, with properly Clarity-encoded
// responses, so the mosaic under test is byte-identical to the one that gets inscribed.
// Nothing about the mosaic is stubbed or injected; only the chain beneath it is fake.
//
// Endpoints mirrored:
//   POST /v2/contracts/call-read/<addr>/<contract>/<fn>   collection + core read-onlys
//   GET  /i/<tokenId>                                     item content, as the runtime serves it
//   GET  /                                                the mosaic under test
//
// State lives in ./state — see README.md. Every request re-reads it, so moving a file
// between folders takes effect on the next reload with no restart.

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  cvToHex, responseOkCV, uintCV, someCV, noneCV, listCV, boolCV,
  standardPrincipalCV, stringAsciiCV, tupleCV
} from '@stacks/transactions';
import { readState, ownerOf, contentOf, tokenIdFor } from './state.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, 'state');
const PORT = Number(process.env.PORT || 8123);

const hex = (cv) => cvToHex(cv);
const okUint = (n) => hex(responseOkCV(uintCV(BigInt(n))));
const okBool = (b) => hex(responseOkCV(boolCV(b)));

// The collection contract's read surface, as far as a mosaic needs it. Names match
// xtrata-collection-mint-v1.4 exactly — if the mosaic calls something absent here, that
// is a finding, not a bug in the harness, so unknown functions answer 404 loudly.
function collectionRead(fn, args, state) {
  switch (fn) {
    case 'get-max-supply':          return okUint(state.maxSupply);
    case 'get-minted-count':        return okUint(state.mintedCount);
    case 'get-minted-index-count':  return okUint(state.mintOrder.length);
    case 'get-finalized':           return okBool(state.finalized);
    case 'get-default-dependencies':
      return hex(responseOkCV(listCV(state.defaultDependencies.map((d) => uintCV(BigInt(d))))));
    case 'get-minted-id': {
      // BY MINT ORDER, not collection index — the trap this harness exists to expose.
      const i = Number(args[0]);
      const index = state.mintOrder[i];
      return hex(responseOkCV(index == null ? noneCV() : someCV(uintCV(BigInt(tokenIdFor(index))))));
    }
    case 'get-collection-metadata':
      return hex(responseOkCV(tupleCV({
        name: stringAsciiCV(state.slug),
        'max-supply': uintCV(BigInt(state.maxSupply))
      })));
    default: return null;
  }
}

function coreRead(fn, args, state) {
  switch (fn) {
    case 'get-owner': {
      const owner = ownerOf(state, Number(args[0]));
      return hex(responseOkCV(owner ? someCV(standardPrincipalCV(owner)) : noneCV()));
    }
    default: return null;
  }
}

// Clarity hex arguments arrive in the POST body; decode just enough for uints.
const decodeUintArgs = (body) => {
  try {
    const parsed = JSON.parse(body || '{}');
    return (parsed.arguments || []).map((a) => {
      // uint is 0x01 followed by 16 bytes big-endian
      const h = String(a).replace(/^0x/, '');
      return h.startsWith('01') ? Number(BigInt('0x' + h.slice(2))) : null;
    });
  } catch { return []; }
};

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const send = (code, body, type = 'application/json') => {
    res.writeHead(code, { 'content-type': type, 'access-control-allow-origin': '*' });
    res.end(body);
  };

  let state;
  try { state = readState(ROOT); }
  catch (e) { return send(500, JSON.stringify({ error: `state unreadable: ${e.message}` })); }

  // The mosaic under test.
  if (url.pathname === '/' || url.pathname === '/mosaic.html') {
    const f = join(HERE, 'mosaic.html');
    if (!existsSync(f)) return send(404, 'no mosaic.html to test', 'text/plain');
    return send(200, readFileSync(f, 'utf8'), 'text/html; charset=utf-8');
  }

  // What the harness thinks the world looks like — for debugging and for the tests.
  if (url.pathname === '/__state') {
    return send(200, JSON.stringify({
      slug: state.slug, maxSupply: state.maxSupply, mintedCount: state.mintedCount,
      mintOrder: state.mintOrder, mintOrderExplicit: state.mintOrderExplicit,
      treasury: [...state.items.values()].filter((i) => i.holder === 'treasury').map((i) => i.index),
      released: [...state.items.values()].filter((i) => i.holder === 'collector').map((i) => i.index),
      anomalies: state.anomalies
    }, null, 2));
  }

  // Item content, exactly as /i/<id> serves it in production.
  let m = /^\/i\/(\d+)$/.exec(url.pathname);
  if (m) {
    const content = contentOf(state, Number(m[1]));
    if (content == null) return send(404, 'not inscribed', 'text/plain');
    return send(200, content, 'text/plain; charset=utf-8');
  }

  m = /^\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(url.pathname);
  if (m && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      const [, , contract, fn] = m;
      const args = decodeUintArgs(body);
      const result = contract.includes('collection')
        ? collectionRead(fn, args, state)
        : coreRead(fn, args, state);
      if (result == null) {
        // Loud on purpose: a mosaic calling something the harness does not model is
        // something to know about, not to paper over with a plausible default.
        return send(404, JSON.stringify({ error: `harness does not model ${contract}.${fn}` }));
      }
      send(200, JSON.stringify({ okay: true, result }));
    });
    return;
  }

  send(404, JSON.stringify({ error: `no route: ${url.pathname}` }));
});

server.listen(PORT, () => {
  const s = readState(ROOT);
  console.log(`mosaic-sim on http://localhost:${PORT}`);
  console.log(`  ${s.mintedCount}/${s.maxSupply} minted · ` +
    `${[...s.items.values()].filter((i) => i.holder === 'treasury').length} in treasury · ` +
    `${[...s.items.values()].filter((i) => i.holder === 'collector').length} released`);
  if (!s.mintOrderExplicit) console.log('  note: no mint-order.json, using collection order (the EASY case)');
  for (const a of s.anomalies) console.log(`  anomaly: ${a}`);
});
