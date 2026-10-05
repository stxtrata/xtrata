// Forever Twins registry v2 + shared collection page: unit tests and cross-list consistency.
// Pure Node, no chain access, no keys. Run from ft-harness: npm run test:registry-v2
//
//  A. schema validator accepts the real registry and rejects broken ones
//  B. route parsing for /forever-twins/collection/<key> and ?key=
//  C. the v1/v3 adapter against a fake chain (shapes taken from the helper templates)
//  D. hashing/chunking agrees with the manifest builder, token-URI resolution
//  E. drift check: registry.v2.json vs every other place the collections are listed
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));
const FT = resolve(here, '../..');            // .../forever-twins
const SRC = resolve(FT, '..', 'src');
const reg = JSON.parse(readFileSync(resolve(FT, 'data/registry.v2.json'), 'utf8'));

const R = await import(resolve(FT, 'assets/ft-registry.js'));
const A = await import(resolve(FT, 'assets/ft-adapter.js'));
const M = await import(resolve(FT, 'assets/ft-media.js'));
const L = await import(resolve(FT, 'ft-harness/manifest/lib.mjs'));

let pass = 0, fail = 0;
const out = [];
async function check(name, fn) {
  try { await fn(); pass++; out.push(`  ok   ${name}`); }
  catch (e) { fail++; out.push(`  FAIL ${name}\n       ${String(e.message).split('\n')[0]}`); }
}
const section = (t) => out.push(`\n${t}`);
const clone = (o) => JSON.parse(JSON.stringify(o));

// ---------------------------------------------------------------- A. schema
section('A. registry schema');
await check('real registry is valid', () => assert.deepEqual(R.validateRegistry(reg), []));
const bad = (mut, expect) => () => { const r = clone(reg); mut(r); const e = R.validateRegistry(r); assert.ok(e.some((m) => m.includes(expect)), `wanted "${expect}", got ${JSON.stringify(e)}`); };
await check('rejects duplicate key', bad((r) => { r.collections.push(clone(r.collections[0])); }, 'duplicate key'));
await check('rejects a second helper for the same source', bad((r) => { const c = clone(r.collections[0]); c.key = 'dup-source'; c.helper = 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.other-helper'; r.collections.push(c); }, 'one helper per source'));
await check('rejects a helper reused by two collections', bad((r) => { r.collections[1].helper = r.collections[0].helper; }, 'helper already used'));
await check('rejects live without helper', bad((r) => { r.collections[0].helper = null; }, 'needs a helper'));
await check('rejects planned with a helper', bad((r) => { r.collections.find((c) => c.key === 'megapont-ape-club').helper = 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.mega-x'; }, 'status is "planned"'));
await check('rejects live v1 without legacyPage', bad((r) => { r.collections[0].legacyPage = null; }, 'legacyPage'));
await check('rejects unknown status', bad((r) => { r.collections[0].status = 'launched'; }, 'unknown status'));
await check('rejects bad principal', bad((r) => { r.collections[0].source = 'not-a-principal'; }, 'valid principal'));
await check('rejects unknown community', bad((r) => { r.collections[0].community = 'nope'; }, 'unknown community'));
await check('rejects community/collection disagreement', bad((r) => { r.communities[0].collections.pop(); }, 'not in its list'));
await check('rejects live community with no live collection', bad((r) => { const n = r.collections.find((c) => c.key === 'nyc-degens'); n.status = 'planned'; n.helper = null; r.communities[1].status = 'live'; }, 'no live collection'));
await check('rejects v3 twinTokenUri without {id}', bad((r) => { r.collections.find((c) => c.key === 'nyc-degens').twinTokenUri = 'https://xtrata.xyz/ft/x.json'; }, '{id}'));

// ---------------------------------------------------------------- B. routes
section('B. routes');
await check('path key', () => assert.equal(R.routeKey('/forever-twins/collection/nyc-degens', ''), 'nyc-degens'));
await check('path key, trailing slash', () => assert.equal(R.routeKey('/forever-twins/collection/nyc-degens/', ''), 'nyc-degens'));
await check('?key= fallback on the static file', () => assert.equal(R.routeKey('/forever-twins/collection/view.html', '?key=leo-cats'), 'leo-cats'));
await check('view page name is never read as a key', () => { assert.equal(R.routeKey('/forever-twins/collection/view', ''), null); assert.equal(R.routeKey('/forever-twins/community/view.html', '', 'community'), null); });
await check('?key= on bare folder', () => assert.equal(R.routeKey('/forever-twins/collection/', '?key=leo-cats'), 'leo-cats'));
await check('no key -> null', () => assert.equal(R.routeKey('/forever-twins/collection/', ''), null));
await check('rejects path traversal / odd keys', () => { assert.equal(R.routeKey('/forever-twins/collection/..%2Fx', ''), null); assert.equal(R.routeKey('/x', '?key=A_B'), null); });
await check('community route', () => { assert.equal(R.routeKey('/forever-twins/community/nyc-dgens', '', 'community'), 'nyc-dgens'); assert.equal(R.routeKey('/forever-twins/community/', '?c=fakfun', 'community'), 'fakfun'); });

// ---------------------------------------------------------------- C. adapter
section('C. adapter against a fake chain');
const CORE = { contract: reg.core.contract, assetName: reg.core.assetName };
const cl = { uint: (n) => ({ t: 'uint', v: String(n) }), principal: (p) => ({ t: 'p', v: p }), buffer: (b) => ({ t: 'buf', v: b }), list: (l) => ({ t: 'list', v: l }) };
const v3 = (over = {}) => ({ ...R.getCollection(reg, 'nyc-degens'), helper: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.ft3-nyc-degens', status: 'live', ...over });
const ME = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const OTHER = 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';
function fakeChain(h, s) {
  const calls = [];
  const read = async (contract, fn, args) => {
    calls.push([contract, fn]);
    const id = args[0] && args[0].v;
    if (contract === s.source) {
      if (fn === 'get-owner') return s.owner[id] === undefined ? { ok: null } : { ok: { some: s.owner[id] } };
      if (fn === 'get-last-token-id') return { ok: String(s.last) };
    }
    if (contract === CORE.contract) {
      if (fn === 'get-owner') return { ok: { some: s.twinOwner[id] } };
      if (fn === 'quote-single-tx-fee') return { ok: { 'total-fee': '260000' } };
    }
    if (contract === h) {
      if (fn === 'get-twin-interface') return s.iface;
      if (fn === 'get-binding') return s.bindings[id] ? { some: s.bindings[id] } : null;
      if (fn === 'get-canonical') return s.canon[id] ? { some: s.canon[id] } : null;
      if (fn === 'get-canonical-hash') return s.canon[id] ? { some: s.canon[id] } : null;
      if (fn === 'is-source-listed') return { ok: !!s.listed[id] };
      if (fn === 'fee-for') return { ok: '1000000' };
      if (fn === 'get-inscribed-count') return { ok: '7' };
      if (fn === 'is-finalized') return { ok: true };
      if (fn === 'get-fee') return { ok: '3000000' };
      if (fn === 'get-free-threshold') return { ok: '87' };
      if (fn === 'get-payouts') return { ok: { a: ME, b: OTHER } };
    }
    throw new Error(`unexpected read ${contract} ${fn}`);
  };
  return { read, calls };
}
const iface = (coll, over = {}) => ({ 'interface-version': '3', 'collection-key': coll.key, master: CORE.contract, source: coll.source, 'source-asset': coll.sourceAsset, group: coll.group,
  'canonical-finalized': true, 'canonical-count': '420', 'manifest-hash': '0x' + 'ab'.repeat(32), 'inscribed-count': '5', 'swaps-enabled': true, 'large-unbound': '0',
  fee: '1000000', 'max-fee': '5000000', 'payee-a': ME, 'payee-b': OTHER, owner: ME, ...over });
const baseState = (coll, h) => ({ source: coll.source, last: 420, owner: { 1: ME, 2: ME, 3: h, 4: OTHER }, twinOwner: { 10: h, 11: ME, 12: h }, listed: {}, iface: iface(coll),
  bindings: { 1: { 'xtrata-id': '10', 'content-hash': '0x01', inscriber: OTHER, 'xtrata-escrowed': true, at: '100' },
              3: { 'xtrata-id': '11', 'content-hash': '0x03', inscriber: OTHER, 'xtrata-escrowed': false, at: '101' },
              4: { 'xtrata-id': '12', 'content-hash': '0x04', inscriber: OTHER, 'xtrata-escrowed': true, at: '102' } },
  canon: { 1: { 'content-hash': '0x01', mime: 'image/png', 'total-size': '9000', 'token-uri': 'u' }, 2: { 'content-hash': '0x02', mime: 'image/png', 'total-size': '9100', 'token-uri': 'u' },
           9: { 'content-hash': '0x09', mime: 'image/gif', 'total-size': '700000', 'token-uri': 'u' } } });

await check('v3 helperState parses get-twin-interface', async () => {
  const c = v3(), s = baseState(c, c.helper); const a = A.createAdapter({ ...fakeChain(c.helper, s), cl, core: CORE });
  const st = await a.helperState(c);
  assert.equal(st.interface, 'v3'); assert.equal(st.version, 3); assert.equal(st.finalized, true); assert.equal(st.canonicalCount, 420);
  assert.equal(st.inscribedCount, 5); assert.equal(st.fee, 1000000n); assert.deepEqual(st.payees, [ME, OTHER]); assert.deepEqual(st.mismatches, []);
});
await check('v3 helper that disagrees with the registry is flagged and blocks writes', async () => {
  const c = v3(); const s = baseState(c, c.helper); s.iface = iface(c, { source: 'SP1SCEXE6PMGPAC6B4N5P2MDKX8V4GF9QDE1FNNGJ.miami-degens', 'collection-key': 'someone-else', group: 'G2' });
  const a = A.createAdapter({ ...fakeChain(c.helper, s), cl, core: CORE }); const st = await a.helperState(c);
  assert.equal(st.mismatches.length, 3); assert.match(a.writeBlock(c, st, null), /does not match the registry/);
});
await check('wrong core in helper is flagged', async () => {
  const c = v3(); const s = baseState(c, c.helper); s.iface = iface(c, { master: 'SP000000000000000000002Q6VF78.evil-core' });
  const a = A.createAdapter({ ...fakeChain(c.helper, s), cl, core: CORE }); assert.ok((await a.helperState(c)).mismatches.some((m) => /core/.test(m)));
});
await check('v1 helperState uses the original getters', async () => {
  const c = R.getCollection(reg, 'miami-degens'); const a = A.createAdapter({ ...fakeChain(c.helper, baseState(c, c.helper)), cl, core: CORE });
  const st = await a.helperState(c); assert.equal(st.interface, 'v1'); assert.equal(st.inscribedCount, 7); assert.equal(st.fee, 3000000n); assert.equal(st.freeThreshold, 87); assert.equal(st.canonicalCount, null);
});
await check('no helper -> no state, source-only token view', async () => {
  const c = R.getCollection(reg, 'megapont-ape-club'); const s = baseState(c, 'x.y'); const f = fakeChain('x.y', s); const a = A.createAdapter({ ...f, cl, core: CORE });
  assert.equal(await a.helperState(c), null); const v = await a.tokenView(c, 1); assert.equal(v.sourceOwner, ME); assert.equal(v.binding, null);
  assert.ok(f.calls.every(([ct]) => ct === c.source), 'must only read the source');
});
await check('token with escrowed twin: original liquid, custody consistent', async () => {
  const c = v3(); const a = A.createAdapter({ ...fakeChain(c.helper, baseState(c, c.helper)), cl, core: CORE }); const v = await a.tokenView(c, 1);
  assert.equal(v.side, 'original-liquid'); assert.equal(v.liquidOwner, ME); assert.equal(v.custody.consistent, true); assert.equal(a.validSwap(v), 'original-to-twin');
});
await check('token with swapped-in original: twin liquid', async () => {
  const c = v3(); const a = A.createAdapter({ ...fakeChain(c.helper, baseState(c, c.helper)), cl, core: CORE }); const v = await a.tokenView(c, 3);
  assert.equal(v.side, 'twin-liquid'); assert.equal(v.liquidOwner, ME); assert.equal(v.custody.consistent, true); assert.equal(a.validSwap(v), 'twin-to-original');
});
await check('stored flag disagreeing with real ownership is not trusted', async () => {
  const c = v3(); const s = baseState(c, c.helper); s.owner[1] = c.helper; // original left holder but flag says escrowed twin
  const a = A.createAdapter({ ...fakeChain(c.helper, s), cl, core: CORE }); const v = await a.tokenView(c, 1);
  assert.equal(v.custody.consistent, false); assert.equal(v.custody.stranded, true);
});
await check('token with no binding but a record is inscribable', async () => {
  const c = v3(); const a = A.createAdapter({ ...fakeChain(c.helper, baseState(c, c.helper)), cl, core: CORE }); const v = await a.tokenView(c, 2);
  assert.equal(v.binding, null); assert.equal(v.canonical.totalSize, 9100); assert.equal(a.validSwap(v), null);
});
await check('G2 listing flag is read; G1 never asks', async () => {
  const g2 = v3({ group: 'G2' }); const s = baseState(g2, g2.helper); s.iface = iface(g2); s.listed[1] = true;
  const f2 = fakeChain(g2.helper, s); const a2 = A.createAdapter({ ...f2, cl, core: CORE }); assert.equal((await a2.tokenView(g2, 1)).listed, true);
  const g1 = v3(); const f1 = fakeChain(g1.helper, baseState(g1, g1.helper)); const a1 = A.createAdapter({ ...f1, cl, core: CORE }); await a1.tokenView(g1, 1);
  assert.ok(!f1.calls.some(([, fn]) => fn === 'is-source-listed'));
});
await check('swap function names per interface', () => {
  const a = A.createAdapter({ read: async () => null, cl, core: CORE });
  assert.equal(a.buildSwap(v3(), 1, 'original-to-twin').fn, 'swap-original-for-twin'); assert.equal(a.buildSwap(v3(), 1, 'twin-to-original').fn, 'swap-twin-for-original');
  const v1 = R.getCollection(reg, 'leo-cats'); assert.equal(a.buildSwap(v1, 1, 'original-to-twin').fn, 'swap-nft-for-xtrata'); assert.equal(a.buildSwap(v1, 1, 'twin-to-original').fn, 'swap-xtrata-for-nft');
  assert.throws(() => a.buildSwap(v3(), 1, 'sideways'));
});
await check('inscribe: v3 takes only token id + chunks; v1 and bad chunk counts are refused', () => {
  const a = A.createAdapter({ read: async () => null, cl, core: CORE }); const call = a.buildInscribe(v3(), 2, [new Uint8Array(3)]);
  assert.equal(call.fn, 'inscribe'); assert.equal(call.args.length, 2);
  assert.throws(() => a.buildInscribe(R.getCollection(reg, 'leo-cats'), 1, [new Uint8Array(1)]), /v3 helper/);
  assert.throws(() => a.buildInscribe(v3(), 1, []), /Chunk count/); assert.throws(() => a.buildInscribe(v3(), 1, Array(33).fill(new Uint8Array(1))), /Chunk count/);
  assert.throws(() => a.buildInscribe(R.getCollection(reg, 'megapont-ape-club'), 1, [new Uint8Array(1)]), /no helper/);
});
await check('writeBlock: not live / v1 / unfinalised / planned', async () => {
  const a = A.createAdapter({ read: async () => null, cl, core: CORE });
  assert.match(a.writeBlock(R.getCollection(reg, 'megapont-ape-club'), null, null), /No helper/);
  assert.match(a.writeBlock(R.getCollection(reg, 'leo-cats'), { mismatches: [] }, null), /original page/);
  assert.match(a.writeBlock(v3({ status: 'deploying' }), { mismatches: [], finalized: true }, null), /not live/);
  assert.match(a.writeBlock(v3(), { mismatches: [], finalized: false }, null), /not finalised/);
  assert.equal(a.writeBlock(v3(), { mismatches: [], finalized: true }, null), null);
});
await check('fee quote adds helper fee and core fee', async () => {
  const c = v3(); const a = A.createAdapter({ ...fakeChain(c.helper, baseState(c, c.helper)), cl, core: CORE }); const q = await a.quoteInscribeFee(c, ME, 9000, 1);
  assert.equal(q.app, 1000000n); assert.equal(q.master, 260000n); assert.equal(q.total, 1260000n);
});
await check('error codes are explained; large threshold is 512 KB', () => {
  assert.match(A.explainError(217), /Unlist/); assert.match(A.explainError(210), /directly/); assert.match(A.explainError(999), /u999/);
  assert.equal(A.isLargeTotal(524288), false); assert.equal(A.isLargeTotal(524289), true);
});

// ---------------------------------------------------------------- D. hashing / media
section('D. hashing, chunking, token URIs');
const sample = (n) => Uint8Array.from({ length: n }, (_, i) => (i * 31 + 7) & 255);
for (const n of [1, 16384, 16385, 40000, 524288]) {
  await check(`rolling hash matches the manifest builder (${n} bytes)`, async () => {
    const b = sample(n); assert.equal(await A.rollingHash(A.chunkBytes(b)), '0x' + await L.xtrataHashHex(b));
  });
}
await check('chunking splits on 16,384 bytes and reassembles', () => {
  const b = sample(40000), ch = A.chunkBytes(b); assert.equal(ch.length, 3); assert.equal(ch[0].length, 16384); assert.equal(ch[2].length, 40000 - 32768);
  assert.deepEqual(Uint8Array.from(ch.flatMap((c) => [...c])), b);
});
await check('different bytes of the same length give a different hash', async () => {
  const a = sample(9000), b = sample(9000); b[4000] ^= 1; assert.notEqual(await A.rollingHash(A.chunkBytes(a)), await A.rollingHash(A.chunkBytes(b)));
});
await check('sameHash ignores 0x and case but never matches empty', () => { assert.ok(A.sameHash('0xAB', 'ab')); assert.ok(!A.sameHash('', '')); assert.ok(!A.sameHash(null, 'ab')); });
await check('token URI placeholders resolve', () => {
  assert.equal(M.resolveUriTemplate('ipfs://Qm/$TOKEN_ID.json', 7), 'ipfs://Qm/7.json'); assert.equal(M.resolveUriTemplate('https://x/{id}.json', 7), 'https://x/7.json');
  assert.equal(M.resolveUriTemplate('ipfs://ipfs/Qm/{id}', 7), 'ipfs://Qm/7');
});
await check('ipfs URIs become gateway candidates; http stays first', () => {
  const c = M.uriCandidates('ipfs://ipfs/QmAbc/json/5.json', 5); assert.ok(c[0].includes('/ipfs/QmAbc/json/5.json')); assert.equal(c.length, 5);
  assert.equal(M.uriCandidates('https://a.b/5.json', 5)[0], 'https://a.b/5.json');
});
await check('image field is found under common names', () => { assert.equal(M.imageFrom({ image: 'a' }), 'a'); assert.equal(M.imageFrom({ properties: { files: [{ uri: 'b' }] } }), 'b'); assert.equal(M.imageFrom({}), null); });
await check('fetchArt returns bytes via metadata then image', async () => {
  const bytes = sample(500);
  const f = async (url) => url.endsWith('.json') ? { ok: true, text: async () => JSON.stringify({ image: 'https://img.test/a.png' }), headers: new Headers() } : { ok: true, arrayBuffer: async () => bytes.buffer, headers: new Headers({ 'content-type': 'image/png' }) };
  const r = await M.fetchArt('https://meta.test/{id}.json', 3, f); assert.equal(r.bytes.length, 500); assert.equal(r.contentType, 'image/png');
});
await check('fetchArt fails clearly when no image field', async () => {
  const f = async () => ({ ok: true, text: async () => '{}', headers: new Headers() }); await assert.rejects(M.fetchArt('https://meta.test/1.json', 1, f), /no image/);
});

// ---------------------------------------------------------------- E. drift
section('E. drift against the other lists');
const read = (p) => readFileSync(p, 'utf8');
const v1 = JSON.parse(read(resolve(FT, 'ft-harness/registry/registry.v1.json')));
await check('every v1 helper in registry.v1.json is in v2 with the same helper, source and group', () => {
  for (const h of v1.helpers) { const c = R.getCollection(reg, h.key); assert.ok(c, `${h.key} missing from v2`); assert.equal(c.helper, h.helper, `${h.key} helper`); assert.equal(c.source, h.source, `${h.key} source`); assert.equal(c.group, h.group, `${h.key} group`); assert.equal(c.interface, h.interface, `${h.key} interface`); }
});
await check('every live v2 collection is in registry.v1.json (no live collection is unverified)', () => {
  for (const c of reg.collections.filter((x) => x.status === 'live')) assert.ok(v1.helpers.some((h) => h.key === c.key), `${c.key} is live in v2 but not in registry.v1.json`);
});
const tsPath = resolve(SRC, 'lib/twins/registry.ts');
await check('src/lib/twins/registry.ts lists the same helper, source and asset for each live collection', () => {
  const ts = read(tsPath);
  for (const c of reg.collections.filter((x) => x.status === 'live')) {
    const i = ts.indexOf(`key: '${c.key}'`); assert.ok(i >= 0, `${c.key} missing from registry.ts`);
    const block = ts.slice(i, ts.indexOf('}', i + 20) + 200);
    assert.ok(block.replace(/\s+/g, '').includes(`helperContractId:'${c.helper}'`), `${c.key} helper differs in registry.ts`);
    assert.ok(block.includes(c.source), `${c.key} source differs in registry.ts`);
    assert.ok(block.includes(`sourceAssetName: '${c.sourceAsset}'`), `${c.key} asset differs in registry.ts`);
  }
});
await check('registry.ts has no live collection that v2 does not know', () => {
  const keys = [...read(tsPath).matchAll(/^\s+key: '([a-z0-9-]+)'/gm)].map((m) => m[1]);
  for (const k of keys) assert.ok(R.getCollection(reg, k), `${k} is in registry.ts but not in registry.v2.json`);
});
const hub = read(resolve(FT, 'index.html'));
await check('hub COLLECTIONS entries match v2 (helper address+name, source address+name)', () => {
  const entries = [...hub.matchAll(/addr:\s*"([A-Z0-9]+)",\s*name:\s*"([a-z0-9-]+)",\s*sourceAddr:\s*"([A-Z0-9]+)",\s*sourceName:\s*"([a-z0-9-]+)"/g)];
  assert.ok(entries.length >= 3, 'could not parse hub COLLECTIONS');
  for (const [, addr, name, sAddr, sName] of entries) {
    const c = reg.collections.find((x) => x.helper === `${addr}.${name}`); assert.ok(c, `hub lists ${addr}.${name}, not in v2`);
    assert.equal(c.source, `${sAddr}.${sName}`, `${c.key} source in hub`);
  }
  for (const c of reg.collections.filter((x) => x.status === 'live')) assert.ok(entries.some((e) => `${e[1]}.${e[2]}` === c.helper), `${c.key} is live but missing from the hub`);
});
await check('each legacy page exists and its contract inputs match v2', () => {
  for (const c of reg.collections.filter((x) => x.legacyPage)) {
    const p = resolve(FT, c.legacyPage.replace('/forever-twins/', ''), 'index.html'); assert.ok(existsSync(p), `${c.legacyPage} has no index.html`);
    const html = read(p);
    const val = (id) => (html.match(new RegExp(`id="${id}"[^>]*value="([^"]+)"`)) || [])[1];
    if (c.key === 'bitcoin-pepes') { assert.ok(html.includes(c.helper) || html.includes(c.helper.split('.')[1]), `${c.key} page does not mention its helper`); continue; }
    assert.equal(val('helperContract'), c.helper, `${c.key} helperContract input`); assert.equal(val('sourceContract'), c.source, `${c.key} sourceContract input`); assert.equal(val('masterContract'), reg.core.contract, `${c.key} masterContract input`);
  }
});
await check('data/contracts.json lists the same helpers and sources', () => {
  const j = JSON.parse(read(resolve(FT, 'data/contracts.json')));
  for (const e of j.collections) { const c = R.getCollection(reg, e.key); assert.ok(c, `${e.key} not in v2`); assert.equal(e.helperContractId, c.helper, `${e.key} helper`); assert.equal(e.sourceContractId, c.source, `${e.key} source`); assert.equal(e.sourceAssetName, c.sourceAsset, `${e.key} asset`); assert.equal(e.xtrataMasterContractId, reg.core.contract, `${e.key} core`); }
});
await check('core contract matches registry.v1.json and registry.ts', () => { assert.equal(reg.core.contract, v1.core); assert.ok(read(tsPath).includes(reg.core.contract)); });
await check('every logo referenced by the registry exists', () => {
  for (const c of reg.collections) if (c.theme && c.theme.logo) assert.ok(existsSync(resolve(FT, c.theme.logo.replace('/forever-twins/', ''))), `${c.key} logo ${c.theme.logo} missing`);
});
await check('manifest configs for planned v3 collections agree with v2 (source, asset, token URI)', () => {
  for (const c of reg.collections.filter((x) => x.interface === 'v3')) {
    const p = resolve(FT, 'ft-harness/manifest/configs', `${c.key}.json`); if (!existsSync(p)) continue;
    const cfg = JSON.parse(read(p)); assert.equal(cfg.source, c.source, `${c.key} source`); assert.equal(cfg.sourceAsset, c.sourceAsset, `${c.key} asset`); assert.equal(cfg.twinTokenUri, c.twinTokenUri, `${c.key} twinTokenUri`);
  }
});
await check('page files the registry-driven pages depend on exist', () => {
  for (const f of ['collection/view.html', 'collection/index.html', 'collections/index.html', 'community/view.html', 'community/index.html', 'assets/ft-registry.js', 'assets/ft-adapter.js', 'assets/ft-media.js', 'assets/ft-shared.css', 'assets/xtrata-forever-twins.js']) assert.ok(existsSync(resolve(FT, f)), `${f} missing`);
});


// ---------------------------------------------------------------- F. page decoder (collection/view.html plainCV)
// Regression: a tuple whose type string mentions "(optional none)" (get-twin-interface has pending-owner) was
// decoded as an optional, so every field read as missing and the page said "not finalised".
await check('view.html decodes the real get-twin-interface tuple (optional field inside a tuple)', async () => {
  const T = await import('@stacks/transactions');
  const html = read(resolve(FT, 'collection/view.html'));
  const a = html.indexOf('const toHex'), b = html.indexOf('async function read(');
  assert.ok(a > 0 && b > a, 'could not find plainCV in view.html');
  const plainCV = new Function('chain', html.slice(a, b) + '; return plainCV;')(T);
  const t = plainCV(T.hexToCV('0c000000150f63616e6f6e6963616c2d636f756e7401000000000000000000000000000001a41363616e6f6e6963616c2d66696e616c697a6564030e636f6c6c656374696f6e2d6b65790d0000000a6e79632d646567656e730366656501000000000000000000000000000186a00567726f75700d0000000247310f696e736372696265642d636f756e74010000000000000000000000000000000111696e746572666163652d76657273696f6e01000000000000000000000000000000030d6c617267652d756e626f756e6401000000000000000000000000000000000d6d616e69666573742d68617368020000002030dbd4313a969c56dacc075da7f2f1ef4c685accaa53e58bea5450dc6e4faf9b066d61737465720616e55cbbaafd88b6e63b036a3a2303b029e039cbbd0d7874726174612d76332d322d33076d61782d66656501000000000000000000000000004c4b40056f776e65720516e55cbbaafd88b6e63b036a3a2303b029e039cbbd0770617965652d61051641c139d4394e910afadb7ff2b32ee14b273eb5180770617965652d6205163699883a5bd5324eb8975e56bec8a9f843409b4e0d70656e64696e672d6f776e6572090c7265736375652d64656c617901000000000000000000000000000001b00e7265736375652d656e61626c65640305726f7574650d000000087374616e6461726406736f75726365061672c775c6b5216530cb254b6151b3ea36483d376b0a6e79632d646567656e730c736f757263652d61737365740d0000000a6e79632d646567656e730d73776170732d656e61626c656403'));
  assert.equal(t['canonical-finalized'], true); assert.equal(t.fee, '100000'); assert.equal(t['canonical-count'], '420');
  assert.equal(t['pending-owner'], null); assert.equal(t['collection-key'], 'nyc-degens');
  assert.deepEqual(plainCV(T.responseOkCV(T.someCV(T.uintCV(5)))), { ok: { some: '5' } });
  assert.deepEqual(plainCV(T.responseErrorCV(T.uintCV(206))), { err: '206' });
});

console.log(out.join('\n'));
console.log(`\nregistry-v2: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
