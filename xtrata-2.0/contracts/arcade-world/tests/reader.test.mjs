// The hall's world reader (recursive-apps/xtrata-arcade/src/parts/world.js) run against the REAL contracts
// on a simnet. fetch() is answered by simnet.callReadOnlyFn, so the reader's wire format, its Clarity
// decoding and the contracts' read-only functions are exercised together.
// Run: node --test tests/reader.test.mjs
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Cl, cvToHex, hexToCV } from '@stacks/transactions';
import { boot, btcDay, pp } from './helpers.mjs';

const PARTS = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'recursive-apps', 'xtrata-arcade', 'src', 'parts');

let simnet, deployer, W, win, calls, failing, store;
const S = (s) => Cl.stringAscii(s);

function makeWindow() {
  const w = { console, TextEncoder, TextDecoder, URL, crypto: globalThis.crypto, setTimeout, setInterval, clearInterval, Uint8Array, Date, Math, JSON,
    addEventListener() {}, removeEventListener() {}, postMessage() {}, document: { addEventListener() {}, createElement() { return {}; } },
    location: { protocol: 'https:', origin: 'https://example.test', hostname: 'example.test' } };
  w.window = w; w.globalThis = w; w.parent = w;
  // a tiny localStorage so the last-good snapshot can be checked
  store = {};
  w.localStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
  // read-only calls go to the simnet
  w.fetch = async (url, init) => {
    const m = /\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/([^/?]+)$/.exec(String(url));
    calls.push(m ? m[3] : String(url));
    if (failing) return { ok: false, status: 503, json: async () => ({}) };
    if (!m) return { ok: false, status: 404, json: async () => ({}) };
    const body = JSON.parse(init.body);
    const args = body.arguments.map((h) => hexToCV(h.replace(/^0x/, '')));
    const r = simnet.callReadOnlyFn(m[2], m[3], args, deployer);
    return { ok: true, status: 200, json: async () => ({ okay: true, result: '0x' + cvToHex(r.result).replace(/^0x/, '') }) };
  };
  vm.createContext(w);
  for (const f of ['score-client.js', 'world.js']) vm.runInContext(fs.readFileSync(path.join(PARTS, f), 'utf8'), w, { filename: f });
  return w;
}

const poster = (o = {}) => {
  const d = btcDay(simnet);
  const v = { set: 0, kind: 0, head: 'NEW GAME', sub: 'Now on the wall', foot: 'XTRATA', colour: 'gold', art: 'star', weight: 50, start: d + 1, end: d + 30, ...o };   // the contract only takes posters that start in the future
  return Cl.tuple({
    set: Cl.uint(v.set), kind: Cl.uint(v.kind), head: S(v.head), sub: S(v.sub), foot: S(v.foot), colour: S(v.colour), art: S(v.art),
    'image-id': Cl.uint(0), 'image-hash': Cl.buffer(new Uint8Array(0)), 'image-size': Cl.uint(0),
    cols: Cl.uint(0), frames: Cl.uint(0), fps: Cl.uint(0), 'act-kind': Cl.uint(0), 'act-id': Cl.uint(0), 'act-text': S(''),
    weight: Cl.uint(v.weight), 'start-day': Cl.uint(v.start), 'end-day': Cl.uint(v.end),
    scope: Cl.list([]), evergreen: Cl.bool(!!v.evergreen), payout: Cl.none(),
  });
};
const scene = (o = {}) => Cl.tuple({
  room: S('arcade-hall'), bay: Cl.uint(o.bay ?? 0), 'from-height': Cl.uint(0), base: Cl.uint(o.base ?? 0),
  'door-look': Cl.none(), layers: Cl.list([]), interaction: Cl.uint(0), link: Cl.none(),
});
const pcall = (name, fn, args, who = deployer) => simnet.callPublicFn(name, fn, args, who);
const gap = () => simnet.mineEmptyBurnBlocks(3);
const configure = () => {
  win.XAScores.configure({ apiBases: ['http://sim.test'], network: 'mainnet' });
  win.XAWorld.configure({ posters: `${deployer}.xtrata-posters-v1`, world: `${deployer}.xtrata-world-v1`, roomId: 'arcade-hall' });
};

before(async () => {
  ({ simnet, deployer, W } = await boot());
  calls = []; failing = false;
  win = makeWindow();
});

test('off by default: nothing configured means no reads and no snapshot (the hall stays as #3111)', async () => {
  assert.equal(win.XAWorld.enabled(), false);
  assert.equal(win.XAWorld.start(() => {}), false);
  const r = await win.XAWorld.refresh(true);
  assert.equal(r.ok, false);
  assert.equal(win.XAWorld.snapshot(), null);
  assert.equal(calls.length, 0, 'no network call was made');
});

test('reads posters, pins, suppressed and bays from the real contracts', async () => {
  assert.equal(pp(pcall('xtrata-world-v1', 'register-room', [S('arcade-hall'), S('Xtrata Arcade'), Cl.principal(deployer), Cl.uint(2)]).result), '(ok true)');
  assert.match(pp(pcall('xtrata-posters-v1', 'add-poster', [poster({ head: 'ONE', weight: 60 })]).result), /^\(ok u0\)$/);
  gap();
  assert.match(pp(pcall('xtrata-posters-v1', 'add-poster', [poster({ head: 'TWO', weight: 10 })]).result), /^\(ok u1\)$/);
  gap();
  assert.match(pp(pcall('xtrata-posters-v1', 'add-poster', [poster({ head: 'PINNED', colour: 'nonsense', weight: 1 })]).result), /^\(ok u2\)$/);
  const d = btcDay(simnet);
  assert.match(pp(pcall('xtrata-posters-v1', 'set-pin', [S('arcade-hall'), Cl.uint(1), Cl.uint(2), Cl.uint(d), Cl.uint(d + 5)]).result), /^\(ok/);
  assert.match(pp(pcall('xtrata-posters-v1', 'suppress-genesis', [Cl.uint(4)]).result), /^\(ok/);

  simnet.mineEmptyBurnBlocks(150);                     // a Bitcoin day passes: the posters are now in their window
  configure();
  assert.equal(win.XAWorld.enabled(), true);
  const r = await win.XAWorld.refresh(true);
  assert.deepEqual({ ok: r.ok, changed: r.changed }, { ok: true, changed: true });
  const snap = win.XAWorld.snapshot();
  assert.deepEqual(Array.from(snap.posters, (p) => p.head).sort(), ['ONE', 'PINNED', 'TWO']);
  const pinned = snap.posters.find((p) => p.head === 'PINNED');
  assert.equal(pinned.c, 'white', 'an unknown colour name falls back to white');
  assert.equal(snap.pins.length, 1);
  assert.equal(snap.pins[0].spot, 1);
  assert.equal(snap.pins[0].poster, 2);
  assert.ok(snap.pinned[2], 'the pinned poster record was read');
  assert.deepEqual(Array.from(snap.suppressed), [4]);
  assert.equal(snap.bays.length, 8);
  assert.equal(snap.bays[0] !== null && snap.bays[0].scene, null, 'a bay with no scene shows the default');
  assert.equal(snap.bays[2], null, 'bays beyond the room are none');
  assert.ok(store['xa-world-snap-v1'], 'last-good snapshot saved');
});

test('polling is by version: nothing changed means no second snapshot read', async () => {
  calls.length = 0;
  const r = await win.XAWorld.refresh(false);
  assert.deepEqual({ ok: r.ok, changed: r.changed }, { ok: true, changed: false });
  assert.deepEqual([...new Set(calls)].sort(), ['get-version'], 'only the two version counters were read');
  assert.equal(calls.length, 2);
  gap();
  pcall('xtrata-posters-v1', 'add-poster', [poster({ head: 'THREE' })]);
  const r2 = await win.XAWorld.refresh(false);
  assert.equal(r2.changed, true);
  assert.ok(win.XAWorld.snapshot().posters.some((p) => p.head === 'THREE'));
});

test('a bay scene change is read; the composed wall is the same for the other 25 slots', async () => {
  const day = btcDay(simnet);
  const base = Array.from({ length: 27 }, (_, i) => i * 3);
  const weights = Array.from({ length: 142 }, () => 1);
  const bayAreaSlots = [12, 13, 25, 26];
  const ctx = (snap) => ({ day, nEmbedded: 142, weights, snapshot: snap, pinSlots: [null, 0, 14, 1, 15],
    overlaySlots: base.map((_, i) => i).filter((i) => !bayAreaSlots.includes(i)) });
  const before = win.XAWorld.composeWall(base, ctx(win.XAWorld.snapshot()));

  assert.match(pp(pcall('xtrata-world-v1', 'add-scene', [scene({ bay: 0, base: 1 })]).result), /^\(ok/);
  const r = await win.XAWorld.refresh(false);
  assert.equal(r.changed, true);
  const snap = win.XAWorld.snapshot();
  assert.equal(snap.bays[0].scene.base, 'wall', 'bay 0 now shows plain wall');
  const after = win.XAWorld.composeWall(base, ctx(snap));
  assert.deepEqual(after, before, 'flipping a bay scene does not move any poster');
  bayAreaSlots.forEach((s) => assert.equal(after[s].src, 'e', 'bay slots always hold the embedded poster'));
  // back to posters: scene base 0
  gap();
  assert.match(pp(pcall('xtrata-world-v1', 'add-scene', [scene({ bay: 0, base: 0 })]).result), /^\(ok/);
  await win.XAWorld.refresh(false);
  assert.equal(win.XAWorld.snapshot().bays[0].scene.base, 'posters');
  assert.deepEqual(win.XAWorld.composeWall(base, ctx(win.XAWorld.snapshot())), before);
});

test('the chain poster on the wall comes from the contract, the pin wins slot 0', async () => {
  const day = btcDay(simnet);
  const snap = win.XAWorld.snapshot();
  const base = Array.from({ length: 27 }, (_, i) => i);
  const out = win.XAWorld.composeWall(base, { day, nEmbedded: 142, weights: Array(142).fill(1), snapshot: snap, pinSlots: [null, 0, 14, 1, 15] });
  assert.equal(out[0].src, 'c');
  assert.equal(out[0].entry.head, 'PINNED');
  assert.ok(out.filter((x) => x.src === 'c').length <= 8);
});

test('reads failing keeps the last good snapshot (never an empty wall)', async () => {
  const had = win.XAWorld.snapshot();
  failing = true;
  const r = await win.XAWorld.refresh(true);
  failing = false;
  assert.equal(r.ok, false);
  assert.equal(win.XAWorld.snapshot(), had, 'the previous snapshot is untouched');
});

test('a new page picks the cached snapshot up at once, before any chain read', async () => {
  const saved = store['xa-world-snap-v1'];
  const w2 = makeWindow();                              // a fresh page, with the saved snapshot in its storage
  w2.localStorage.setItem('xa-world-snap-v1', saved);
  w2.XAScores.configure({ apiBases: ['http://sim.test'], network: 'mainnet' });
  w2.XAWorld.configure({ posters: `${deployer}.xtrata-posters-v1`, world: `${deployer}.xtrata-world-v1` });
  failing = true;                                       // chain is down
  const seen = [];
  w2.XAWorld.start((s, why) => seen.push(why));
  await new Promise((r) => setTimeout(r, 50));
  w2.XAWorld.stop();
  failing = false;
  assert.ok(seen.includes('cache'), 'listener was told about the cached snapshot');
  assert.ok(w2.XAWorld.snapshot() && w2.XAWorld.snapshot().posters.length >= 3);
});
