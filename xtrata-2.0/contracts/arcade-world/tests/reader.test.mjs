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

test('looks: the reader gets every look a bay scene uses, and the hall plan resolves them (real contracts, real bays.js)', async () => {
  const look = (kind, name, key) => pcall('xtrata-world-v1', 'register-look', [Cl.uint(kind), S(name), Cl.uint(0), S(key), Cl.uint(0), Cl.buffer(new Uint8Array(0)), Cl.uint(0)]);
  const ids = {};
  for (const [kind, name, key] of [[1, 'House curtain', 'curtain-house'], [2, 'Sign board', 'sign-board'], [3, 'Work site', 'work-site'], [4, 'Flicker', 'light-flicker'], [2, 'Retired sign', 'sign-board'], [0, 'Plain door', 'door-plain']]) {
    const r = pp(look(kind, name, key).result); const m = /^\(ok u(\d+)\)$/.exec(r); assert.ok(m, r); ids[name] = Number(m[1]);
  }
  const layer = (slot, id, params, state = '') => Cl.tuple({ slot: Cl.uint(slot), look: Cl.uint(id), params: S(params), state: S(state) });
  gap();
  const sc = Cl.tuple({
    room: S('arcade-hall'), bay: Cl.uint(0), 'from-height': Cl.uint(0), base: Cl.uint(2), 'door-look': Cl.some(Cl.uint(ids['Plain door'])),
    layers: Cl.list([layer(1, ids['House curtain'], '{"color":"#7a1020"}', 'closed'), layer(2, ids['Sign board'], '{"text":"coming soon"}'),
      layer(2, ids['Retired sign'], '{"text":"old"}'), layer(3, ids['Work site'], '{"kinds":"hammer"}'), layer(4, ids['Flicker'], '{"rate":2}')]),
    interaction: Cl.uint(1), link: Cl.none(),
  });
  assert.match(pp(pcall('xtrata-world-v1', 'add-scene', [sc]).result), /^\(ok/);
  // a look hidden after a scene used it stays on that scene; the hall must skip it
  assert.equal(pp(pcall('xtrata-world-v1', 'set-look-hidden', [Cl.uint(ids['Retired sign']), Cl.bool(true)]).result), '(ok true)');

  calls.length = 0;
  const r = await win.XAWorld.refresh(false);
  assert.equal(r.changed, true);
  assert.equal(calls.filter((c) => c === 'get-looks').length, 1, 'all six looks (door and layers) came in one get-looks read');
  const snap = win.XAWorld.snapshot();
  assert.deepEqual(Object.keys(snap.looks).map(Number).sort((a, b) => a - b), Object.values(ids).sort((a, b) => a - b));
  assert.deepEqual(JSON.parse(JSON.stringify(snap.looks[ids['House curtain']])), { kind: 1, name: 'House curtain', tier: 0, builtin: 'curtain-house', hidden: false, approved: true });
  assert.equal(snap.looks[ids['Retired sign']].hidden, true);

  // hand the snapshot (as JSON, the way the hall's cache holds it) to the hall's own bay planner
  const sandbox = { module: { exports: {} }, console, Math, JSON, Object, Array, Number, String, Date, setTimeout, clearTimeout };
  vm.runInNewContext(fs.readFileSync(path.join(PARTS, 'bays.js'), 'utf8'), sandbox);
  const plan = JSON.parse(JSON.stringify(sandbox.module.exports.planBay(JSON.parse(JSON.stringify(snap.bays[0])), JSON.parse(JSON.stringify(snap.looks)))));
  assert.equal(plan.base, 'door'); assert.equal(plan.interaction, 1);
  assert.equal(plan.cover.key, 'curtain-house'); assert.equal(plan.cover.p.openness, 0); assert.equal(plan.cover.p.color, '#7a1020');
  assert.equal(plan.overlays.length, 1, 'the hidden sign is skipped'); assert.equal(plan.overlays[0].p.text, 'COMING SOON');
  assert.deepEqual(plan.sound.p.kinds, ['hammer']); assert.equal(plan.light.key, 'light-flicker'); assert.equal(plan.light.p.rate, 2);
});

test('looks: a scene with no layers needs no look read at all', async () => {
  gap();
  assert.match(pp(pcall('xtrata-world-v1', 'add-scene', [scene({ bay: 0, base: 0 })]).result), /^\(ok/);
  calls.length = 0;
  await win.XAWorld.refresh(false);
  assert.equal(calls.includes('get-looks'), false);
  assert.deepEqual(JSON.parse(JSON.stringify(win.XAWorld.snapshot().looks)), {});
});

test('a scripted launch story: scenes start at block heights, the hall re-reads when the chain passes the next one', async () => {
  const look = (kind, key) => Number(/u(\d+)/.exec(pp(pcall('xtrata-world-v1', 'register-look', [Cl.uint(kind), S('x ' + key), Cl.uint(0), S(key), Cl.uint(0), Cl.buffer(new Uint8Array(0)), Cl.uint(0)]).result))[1]);
  const cover = look(1, 'curtain-house'), sign = look(2, 'sign-board');
  const layer = (slot, id, params, state = '') => Cl.tuple({ slot: Cl.uint(slot), look: Cl.uint(id), params: S(params), state: S(state) });
  const sc = (from, layers, base = 1) => Cl.tuple({ room: S('arcade-hall'), bay: Cl.uint(1), 'from-height': Cl.uint(from), base: Cl.uint(base), 'door-look': Cl.none(), layers: Cl.list(layers), interaction: Cl.uint(1), link: Cl.none() });
  gap();
  const h0 = simnet.burnBlockHeight, t1 = h0 + 20, t2 = h0 + 40;
  const r = pp(pcall('xtrata-world-v1', 'add-scenes', [Cl.list([
    sc(h0, [layer(1, cover, '{}', 'closed'), layer(2, sign, '{"text":"coming soon"}')]),
    sc(t1, [layer(1, cover, '{}', 'open'), layer(2, sign, '{"text":"open day"}')]),
    sc(t2, [], 0),
  ])]).result);
  assert.match(r, /^\(ok/, r);
  await win.XAWorld.refresh(false);
  const bayNow = () => win.XAWorld.snapshot().bays[1];
  const coverState = () => (bayNow().scene.layers.find((l) => l.slot === 1) || {}).state;
  assert.equal(coverState(), 'closed');
  assert.equal(bayNow().nextHeight, t1, 'the reader knows when the next scene starts');

  calls.length = 0;
  assert.equal(win.XAWorld.onHeight(t1 - 1), false, 'before the start: no read');
  assert.equal(calls.length, 0);

  simnet.mineEmptyBurnBlocks(21);                       // the chain passes the first start, with no write at all
  assert.equal(win.XAWorld.onHeight(simnet.burnBlockHeight), true, 'at the start height: read again');
  await new Promise((res) => setTimeout(res, 150));
  assert.equal(coverState(), 'open', 'the second scene is now the active one');
  assert.equal(bayNow().nextHeight, t2);
  assert.equal(win.XAWorld.onHeight(simnet.burnBlockHeight), false, 'a second trigger within 30 s does not read again');

  simnet.mineEmptyBurnBlocks(21);
  win.XAWorld._t.state.lastHeightRead = 0;              // (stands in for 30 s passing)
  assert.equal(win.XAWorld.onHeight(simnet.burnBlockHeight), true);
  await new Promise((res) => setTimeout(res, 150));
  assert.equal(bayNow().scene.base, 'posters', 'the third scene (back to posters) is active');
  assert.equal(bayNow().nextHeight, null, 'nothing further is scheduled');
});
