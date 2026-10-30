// An in-memory chain for the hall's tests: a small xtrata-world-v2 registry (spaces, kinds, objects, states, approved contracts),
// the Xtrata core's inscriptions (get-inscription-meta, get-chunk-batch, chained hash) and the xtrata.xyz gateway (/i/<id>?raw=1).
// Results are real Clarity wire values with the same shapes as the contracts return them (contracts/arcade-world/contracts/
// xtrata-world-v2.clar), so the hall's own decoder reads them. No dependencies: it runs in node:test and behind Playwright routes.
//
//   const chain = createChain({ spaces, objects, kinds, approved, inscriptions })
//   chain.call(contractName, fn, argsHex[])  -> result hex | null (null: no such function: answer like a node would, okay:false)
//   chain.gateway(id)                        -> Buffer | null
//   chain.log                                -> [{ contract, fn, args }]
//
// get-object-ids and get-objects-8 are the registry's light reads (16 ids, or 8 rows, a page), modelled with the contract's exact
// signatures; get-objects is answered too, though the hall never calls it.
'use strict';
const crypto = require('crypto');

/* ------------------------------------------------------------ Clarity encoding */
const C32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const hex = (b) => Buffer.from(b).toString('hex');
const u32 = (n) => n.toString(16).padStart(8, '0');
const cv = {
  uint: (n) => '01' + BigInt(n).toString(16).padStart(32, '0'),
  int: (n) => '00' + BigInt.asUintN(128, BigInt(n)).toString(16).padStart(32, '0'),
  bool: (b) => (b ? '03' : '04'),
  ascii: (s) => '0d' + u32(Buffer.byteLength(s, 'latin1')) + hex(Buffer.from(s, 'latin1')),
  buff: (b) => { b = Buffer.isBuffer(b) ? b : Buffer.from(String(b).replace(/^0x/, ''), 'hex'); return '02' + u32(b.length) + hex(b); },
  none: () => '09',
  some: (v) => '0a' + v,
  opt: (v, f) => (v === null || v === undefined ? '09' : '0a' + f(v)),
  list: (items) => '0b' + u32(items.length) + items.join(''),
  tuple: (o) => { const keys = Object.keys(o).sort(); return '0c' + u32(keys.length) + keys.map((k) => k.length.toString(16).padStart(2, '0') + hex(Buffer.from(k, 'latin1')) + o[k]).join(''); },
  ok: (v) => '07' + v,
  principal: (addr) => { const d = c32decode(addr); return '05' + d.version.toString(16).padStart(2, '0') + d.hash160; },
};
function c32decode(addr) {
  const m = /^S([0-9A-Z])([0-9A-Z]+)$/.exec(addr);
  if (!m) throw new Error('bad address ' + addr);
  let n = 0n;
  for (const ch of m[2]) { const i = C32.indexOf(ch); if (i < 0) throw new Error('bad c32 ' + addr); n = n * 32n + BigInt(i); }
  return { version: C32.indexOf(m[1]), hash160: n.toString(16).padStart(48, '0').slice(0, 40) };
}
const NOBODY = '051a' + '00'.repeat(20);

/* ------------------------------------------------------------ Clarity decoding (arguments) */
function decode(h) {
  const b = Buffer.from(String(h).replace(/^0x/, ''), 'hex'); let p = 0;
  const rd = () => {
    const t = b[p++];
    if (t === 0x01) { const v = BigInt('0x' + hex(b.subarray(p, p + 16))); p += 16; return Number(v); }
    if (t === 0x0d) { const n = b.readUInt32BE(p); p += 4; const s = b.subarray(p, p + n).toString('latin1'); p += n; return s; }
    if (t === 0x0b) { const n = b.readUInt32BE(p); p += 4; const out = []; for (let i = 0; i < n; i++) out.push(rd()); return out; }
    if (t === 0x05) { const v = b[p]; const h160 = hex(b.subarray(p + 1, p + 21)); p += 21; return { version: v, hash160: h160 }; }
    if (t === 0x06) { const v = b[p]; const h160 = hex(b.subarray(p + 1, p + 21)); p += 21; const n = b[p++]; const name = b.subarray(p, p + n).toString('latin1'); p += n; return { version: v, hash160: h160, name }; }
    if (t === 0x00) { const v = BigInt.asIntN(128, BigInt('0x' + hex(b.subarray(p, p + 16)))); p += 16; return Number(v); }
    if (t === 0x02) { const n = b.readUInt32BE(p); p += 4; const v = Buffer.from(b.subarray(p, p + n)); p += n; return v; }
    if (t === 0x03 || t === 0x04) return t === 0x03;
    if (t === 0x07 || t === 0x08 || t === 0x0a) return { $: t === 0x0a ? 'some' : t === 0x07 ? 'ok' : 'err', v: rd() };
    if (t === 0x09) return null;
    if (t === 0x0c) { const n = b.readUInt32BE(p); p += 4; const o = {}; for (let i = 0; i < n; i++) { const kl = b[p++]; const k = b.subarray(p, p + kl).toString('latin1'); p += kl; o[k] = rd(); } return o; }
    throw new Error('mock chain: Clarity type 0x' + t.toString(16));
  };
  return rd();
}


/* ------------------------------------------------------------ the Xtrata core's chained hash */
const CHUNK = 16384;
function chainHash(bytes) {
  let h = Buffer.alloc(32);
  for (let i = 0; i < bytes.length; i += CHUNK) h = crypto.createHash('sha256').update(Buffer.concat([h, bytes.subarray(i, i + CHUNK)])).digest();
  return h;
}

/* ------------------------------------------------------------ the registry */
// spaces: { id: { parent, slug, title, kind, state, runtime, entry: { id, hash: hex | Buffer, size } | null } }
// objects: { id: { space, parent, kind, name, params, portal: { to, arrival, path } | null, state, active: { patch, visibility, interaction, from } | null, next } }
// kinds: { id: { builtin, category, name, tier, hidden, approved } }
function createChain(world) {
  const W = { version: 1, height: 1000, spaces: {}, objects: {}, kinds: {}, approved: [], inscriptions: {}, ...world };
  const log = [];
  const slotsOf = (sid) => Object.keys(W.objects).filter((k) => W.objects[k].space === Number(sid)).map(Number).sort((a, b) => a - b);
  const spaceCv = (id) => {
    const s = W.spaces[id]; if (!s) return cv.none();
    const objs = slotsOf(id);
    const entry = s.entry ? cv.some(cv.tuple({ id: cv.uint(s.entry.id), hash: cv.buff(s.entry.hash), size: cv.uint(s.entry.size) })) : cv.none();
    const pol = cv.tuple({ 'max-children': cv.uint(64), 'max-descendants': cv.uint(10000), 'max-objects': cv.uint(128), 'max-depth': cv.uint(6), runtimes: cv.uint(15), tiers: cv.uint(15),
      interfaces: cv.uint(15), 'approved-only': cv.bool(false), 'portals-in': cv.uint(0), 'portals-out': cv.uint(0), review: cv.bool(false), 'create-fee': cv.uint(0) });
    return cv.some(cv.tuple({ parent: cv.uint(s.parent || 0), slug: cv.ascii(s.slug || ''), title: cv.ascii(s.title || ''), kind: cv.uint(s.kind == null ? 1 : s.kind),
      owner: NOBODY, 'pending-owner': cv.none(), transferable: cv.bool(false), epoch: cv.uint(0), state: cv.uint(s.state == null ? 1 : s.state), paused: cv.uint(0),
      runtime: cv.uint(s.runtime || 0), entry, policy: pol, depth: cv.uint(2), children: cv.uint(0), 'child-slots': cv.uint(0), descendants: cv.uint(0),
      objects: cv.uint(objs.length), 'object-slots': cv.uint(s.objectSlots == null ? objs.length : s.objectSlots), idx: cv.uint(0),
      'created-at': cv.uint(1), 'updated-at': cv.uint(1), version: cv.uint(s.version || 1) }));
  };
  const objectTuple = (id) => {
    const o = W.objects[id];
    const portal = o.portal ? cv.some(cv.tuple({ 'to-space': cv.uint(o.portal.to || 0), arrival: cv.uint(o.portal.arrival || 0), path: cv.ascii(o.portal.path || '') })) : cv.none();
    return cv.tuple({ space: cv.uint(o.space), parent: cv.uint(o.parent || 0), kind: cv.uint(o.kind), name: cv.ascii(o.name || ''),
      transform: cv.tuple({ x: cv.int(0), y: cv.int(0), z: cv.int(0), yaw: cv.uint(0), scale: cv.uint(100) }), params: cv.ascii(o.params || '{}'),
      bindings: cv.list([]), portal, state: cv.uint(o.state || 0), idx: cv.uint(0), depth: cv.uint(o.parent ? 2 : 1), children: cv.uint(0),
      author: NOBODY, 'created-at': cv.uint(1), 'updated-at': cv.uint(1) });
  };
  const viewCv = (id) => {
    const o = W.objects[id]; if (!o) return cv.none();
    const a = o.active;
    const st = a ? cv.some(cv.tuple({ 'from-height': cv.uint(a.from || 1), retracted: cv.bool(!!a.retracted), patch: cv.ascii(a.patch || '{}'), visibility: cv.uint(a.visibility || 0),
      interaction: cv.uint(a.interaction || 0), author: NOBODY, 'added-at': cv.uint(1) })) : cv.none();
    return cv.some(cv.tuple({ id: cv.uint(id), object: objectTuple(id), 'active-seq': a ? cv.some(cv.uint(0)) : cv.none(), active: st,
      'next-height': o.next ? cv.some(cv.uint(o.next)) : cv.none(), height: cv.uint(W.height) }));
  };
  const kindCv = (id) => {
    const k = W.kinds[id]; if (!k) return cv.none();
    return cv.some(cv.tuple({ category: cv.uint(k.category || 0), name: cv.ascii(k.name || k.builtin), tier: cv.uint(k.tier || 0), builtin: cv.ascii(k.builtin || ''),
      'src-id': cv.uint(0), 'src-hash': cv.buff(Buffer.alloc(0)), 'src-size': cv.uint(0), 'by-space': cv.uint(1), hidden: cv.bool(!!k.hidden),
      approved: cv.bool(k.approved !== false), owner: NOBODY, 'added-at': cv.uint(1) }));
  };
  const page = (sid, pg, n, row) => { const ids = slotsOf(sid), out = []; for (let i = 0; i < n; i++) { const id = ids[pg * n + i]; out.push(id ? row(id) : cv.none()); } return cv.list(out); };
  const approvedSet = () => new Set((W.approved || []).map((c) => { const [a, n] = c.split('.'); const d = c32decode(a); return d.version + ':' + d.hash160 + ':' + n; }));

  const registry = {
    'get-version': () => cv.uint(W.version),
    'get-height': () => cv.uint(W.height),
    'get-interface': () => cv.ascii('xws-1'),
    'resolve-path': ([slugs]) => {
      let cur = 1;
      for (const s of slugs) { const hit = Object.keys(W.spaces).find((k) => W.spaces[k].parent === cur && W.spaces[k].slug === s); if (!hit) return cv.none(); cur = Number(hit); }
      return cv.some(cv.uint(cur));
    },
    'get-space': ([id]) => spaceCv(id),
    'get-object-ids': ([sid, pg]) => page(sid, pg, 16, (id) => cv.some(cv.uint(id))),
    'get-objects': ([sid, pg]) => page(sid, pg, 16, (id) => cv.some(cv.tuple({ id: cv.uint(id), object: cv.some(objectTuple(id)) }))),
    'get-objects-8': ([sid, pg]) => page(sid, pg, 8, (id) => cv.some(cv.tuple({ id: cv.uint(id), object: cv.some(objectTuple(id)) }))),
    'get-object-view': ([id]) => viewCv(id),
    'get-object': ([id]) => (W.objects[id] ? cv.some(objectTuple(id)) : cv.none()),
    'get-kinds': ([ids]) => cv.list(ids.map(kindCv)),
    'is-approved': ([p]) => cv.bool(!!p.name && approvedSet().has(p.version + ':' + p.hash160 + ':' + p.name)),
  };
  const insc = (id) => { const b = W.inscriptions[id]; return b ? (Buffer.isBuffer(b) ? b : Buffer.from(b)) : null; };
  const core = {
    'get-inscription-meta': ([id]) => {
      const b = insc(id); if (!b) return cv.ok(cv.none());
      return cv.ok(cv.some(cv.tuple({ 'total-chunks': cv.uint(Math.ceil(b.length / CHUNK)), 'total-size': cv.uint(b.length), sealed: cv.bool(true), creator: NOBODY, 'final-hash': cv.buff(chainHash(b)) })));
    },
    'get-chunk-batch': ([id, idxs]) => { const b = insc(id) || Buffer.alloc(0); return cv.ok(cv.list(idxs.map((i) => { const c = b.subarray(i * CHUNK, (i + 1) * CHUNK); return c.length ? cv.some(cv.buff(c)) : cv.none(); }))); },
  };
  // The games contract (xtrata-games-v1): world.games = { height, items: [{ id, title, index, kind, engineMin, codeId, hash?, size?, liveAt, hidden }] }.
  // hash / size default to the inscription's real chain hash and length (set them to lie about it).
  const gameCv = (n) => {
    const it = ((W.games && W.games.items) || [])[n]; if (!it) return cv.none();
    const b = insc(it.codeId);
    return cv.some(cv.tuple({ id: cv.ascii(it.id), title: cv.ascii(it.title || it.id), index: cv.uint(it.index), kind: cv.uint(it.kind == null ? 1 : it.kind),
      'engine-min': cv.uint(it.engineMin || 1), 'code-id': cv.uint(it.codeId), 'code-hash': cv.buff(it.hash || (b ? chainHash(b) : Buffer.alloc(32))),
      'code-size': cv.uint(it.size == null ? (b ? b.length : 0) : it.size), 'added-at': cv.uint(1), 'live-at': cv.uint(it.liveAt || 1), hidden: cv.bool(!!it.hidden) }));
  };
  const games = {
    'get-version': () => cv.uint(1),
    'get-count': () => cv.uint(((W.games && W.games.items) || []).length),
    'get-height': () => cv.uint((W.games && W.games.height) || W.height),
    'get-games': ([ns]) => cv.list(ns.map(gameCv)),
  };
  const posters = { 'get-version': () => cv.uint(1), 'get-live': () => cv.list([]), 'get-pins': () => cv.list([]), 'get-suppressed': () => cv.list([]) };

  function call(contract, fn, args) {
    const name = String(contract).split('.').pop();
    log.push({ contract: name, fn, args });
    const table = /world-v2/.test(name) ? registry : /posters/.test(name) ? posters : /games/.test(name) ? games : /^xtrata-v\d/.test(name) ? core : null;
    const f = table && table[fn];
    if (!f) return null;
    if (W.fail && W.fail(name, fn, args)) throw new Error('mock chain: refused');
    return '0x' + f((args || []).map(decode));
  }
  return { world: W, log, call, gateway: (id) => (W.gatewayTamper && W.gatewayTamper[id] ? Buffer.concat([insc(id), Buffer.from('<!-- x -->')]) : insc(id)) };
}

// A Playwright route handler: Hiro call-read for every contract, plus the xtrata.xyz gateway. Anything else fails.
// opts.down(fn, contract) -> true makes that read fail with HTTP 503 (a node that is down or throttled).
function routeFor(chain, opts = {}) {
  const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST, GET, OPTIONS' };
  return async (route) => {
    const req = route.request(), url = req.url();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    const g = /^https:\/\/xtrata\.xyz\/i\/(\d+)/.exec(url);
    if (g) {
      const b = opts.gateway === false ? null : chain.gateway(Number(g[1]));
      return b ? route.fulfill({ status: 200, headers: { ...CORS, 'content-type': 'text/plain', 'cache-control': 'no-store' }, body: b }) : route.fulfill({ status: 404, headers: CORS, body: '' });
    }
    const m = /\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/([^/?]+)/.exec(url);
    if (!m) return route.abort('failed');
    const args = (JSON.parse(req.postData() || '{}').arguments) || [];
    if (opts.down && opts.down(m[3], m[2], args)) return route.fulfill({ status: 503, headers: CORS, body: 'down' });
    let hexOut = null;
    try { hexOut = chain.call(m[1] + '.' + m[2], m[3], args); } catch (e) { return route.fulfill({ status: 503, headers: CORS, body: 'down' }); }
    const body = hexOut ? { okay: true, result: hexOut } : { okay: false, cause: 'no such function ' + m[3] };
    return route.fulfill({ status: 200, headers: { ...CORS, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  };
}

// The demo world the room tests use: arcade/hall (one door to the lobby), arcade/lobby (doors to rooms), rooms as pages.
const KINDS = { 0: { builtin: 'bay', category: 7 }, 1: { builtin: 'sign-board', category: 6 }, 2: { builtin: 'door-arch', category: 7 }, 3: { builtin: 'door-gothic', category: 7 } };

module.exports = { createChain, routeFor, cv, decode, c32decode, chainHash, KINDS, CHUNK };
