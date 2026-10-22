// The hall's reader for xtrata-world-v2 (src/parts/world2.js, wired into world.js), in a vm with a fake node.
// The "node" replays real read-only results recorded from a simnet registry seeded with the four-doorways demo
// (tests/fixtures/hall-v2-demo.json, made by contracts/arcade-world/scripts/make-hall-v2-fixture.mjs).
//   1. through XAWorld: the snapshot has the bay shape the engine reads, polling is cheap, a failed read keeps the last good snapshot
//   2. with no `registry` configured nothing about the v1 path changes
//   3. malformed / oversized / unknown objects never break the hall
// Run: node --test tests/world2.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = path.join(__dirname, '..', 'src', 'parts');
const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'hall-v2-demo.json'), 'utf8'));
const REG = 'ST16K3GFJ2QNXGBQFGRZ4XCSN7NPEWQ1QN48MZW0E.xtrata-world-v2';
const POSTERS = 'ST16K3GFJ2QNXGBQFGRZ4XCSN7NPEWQ1QN48MZW0E.xtrata-posters-v1';
const plain = (x) => JSON.parse(JSON.stringify(x));

function load(parts) {
  const win = { console, Math, Date, JSON, Object, Array, Number, String, Uint8Array, BigInt, TextDecoder, TextEncoder, Promise, setTimeout, clearTimeout,
    setInterval() { return 1; }, clearInterval() {}, addEventListener() {}, removeEventListener() {}, postMessage() {},
    location: { search: '', protocol: 'about:', origin: 'null', hostname: '' }, navigator: {} };
  win.window = win; win.globalThis = win; win.parent = win;
  const store = {};
  win.localStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } };
  vm.createContext(win);
  for (const f of parts) vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), win, { filename: f });
  win._store = store;
  return win;
}
const ALL = ['score-client.js', 'world.js', 'world2.js', 'bays.js'];

// A fake node. `scenario` picks the recorded results; `over(fn, argsKey)` may replace one; `fail` makes every read fail.
function node(win, scenario, opts = {}) {
  const C = win.XAScores._codec, log = [];
  const api = {
    log, scenario, fail: !!opts.fail, over: opts.over || null, postersVersion: 1,
    fetch: async (url, init) => {
      const m = /\/call-read\/([^/]+)\/([^/]+)\/([^/?]+)/.exec(url);
      const body = JSON.parse(init.body), fn = m[3], key = fn + '|' + body.arguments.join(',');
      log.push({ contract: m[2], fn, key });
      if (api.fail) return { ok: false, status: 503, json: async () => ({}) };
      let hex = null;
      if (m[2] === 'xtrata-posters-v1') {
        hex = fn === 'get-version' ? C.cvUint(api.postersVersion) : '0x0b00000000';
      } else {
        const cur = FIX.scenarios[api.scenario];
        const i = cur.calls[key];
        if (api.over) hex = api.over(fn, key, cur.calls, FIX.blobs);
        if (hex == null) { if (i === undefined) return { ok: true, status: 200, json: async () => ({ okay: false, cause: 'no recorded result for ' + key }) }; hex = FIX.blobs[i]; }
      }
      return { ok: true, status: 200, json: async () => ({ okay: true, result: hex }) };
    },
  };
  win.fetch = api.fetch;
  return api;
}
function configured(scenario, opts) {
  const win = load(ALL);
  const n = node(win, scenario, opts);
  win.XAWorld.configure({ posters: POSTERS, registry: REG });
  return { win, n, W: win.XAWorld };
}

test('through XAWorld: the registry is read into the bay snapshot the engine expects (same as the recording)', async () => {
  const { W, n } = configured('active');
  assert.equal(W.mode(), 2); assert.equal(W.enabled(), true);
  const r = await W.refresh(true);
  assert.deepEqual(plain(r), { ok: true, changed: true });
  const snap = plain(W.snapshot());
  const want = FIX.scenarios.active.expect;
  assert.deepEqual(snap.bays, want.bays);
  assert.deepEqual(snap.rooms.lobby.bays, want.lobbyBays);
  assert.deepEqual(snap.looks, want.looks);
  assert.equal(snap.src, REG);
  assert.equal(snap.versions.world, want.sig);
  // the four hall bays always come as four entries (the lobby's go after them in the engine's order)
  assert.equal(snap.bays.length, 4); assert.equal(snap.rooms.lobby.bays.length, 2);
  assert.ok(n.log.every((l) => l.contract === 'xtrata-posters-v1' || l.contract === 'xtrata-world-v2'));
  assert.ok(n.log.filter((l) => l.contract === 'xtrata-world-v2').length <= 40, 'bounded reads: ' + n.log.length);
  assert.ok(n.log.every((l) => !/get-bays|get-looks|get-scenes/.test(l.fn)), 'the v1 scene contract is not read');
});

test('the snapshot says what the demo shows', async () => {
  const { W } = configured('active');
  await W.refresh(true);
  const s = plain(W.snapshot()), L = s.looks, B = s.bays;
  assert.deepEqual(B.map((b) => b.scene.base), ['wall', 'door', 'door', 'wall']);
  assert.deepEqual(B.map((b) => b.scene.interaction), [2, 1, 3, 0]);
  assert.equal(L[B[1].scene.doorLook].builtin, 'door-arch'); assert.equal(L[B[2].scene.doorLook].builtin, 'door-gothic');
  assert.equal(B[2].scene.link['target-room'], 'lobby');
  assert.equal(B[0].scene.layers[0].state, 'closed');
  assert.deepEqual(B[3].scene.layers.map((l) => [l.slot, L[l.look].builtin]), [[2, 'sign-board'], [4, 'light-pulse']]);
});

test('the bay engine plans the v2 snapshot: curtain, door style, link, sign text, lamp', async () => {
  const { win, W } = configured('active');
  await W.refresh(true);
  const s = W.snapshot(), P = (i) => plain(win.XABays.planBay(s.bays[i], s.looks));
  const p0 = P(0), p1 = P(1), p2 = P(2), p3 = P(3);
  assert.equal(p0.base, 'wall'); assert.equal(p0.cover.p.openness, 0); assert.equal(p0.cover.p.color, '#7a1020'); assert.equal(p0.overlays[0].p.text, 'COMING SOON');
  assert.equal(p1.door.style, 'arch'); assert.equal(p1.interaction, 1); assert.equal(p1.overlays[0].p.text, 'STAFF ONLY');
  assert.equal(p2.door.style, 'gothic'); assert.equal(p2.interaction, 3); assert.equal(p2.link['target-room'], 'lobby');
  assert.equal(p3.light.key, 'light-pulse'); assert.equal(p3.light.p.rate, 2); assert.equal(p3.overlays[0].p.text, 'NEW ROOM');
});

test('polling: one cheap read while nothing moved; a change elsewhere in the world is checked, not re-read; a change in the hall reloads', async () => {
  const { W, n } = configured('active');
  await W.refresh(true);
  n.log.length = 0;
  let r = plain(await W.refresh(false));
  assert.deepEqual(r, { ok: true, changed: false });
  assert.deepEqual(n.log.map((l) => l.contract + '.' + l.fn), ['xtrata-posters-v1.get-version', 'xtrata-world-v2.get-version']);
  // the global version moves (some other space was written to) but the hall's spaces and kinds did not change: a few reads, no reload
  const g = FIX.scenarios.active.calls['get-version|'];
  n.over = (fn) => (fn === 'get-version' ? '0x01' + (BigInt('0x' + FIX.blobs[g].slice(4)) + 5n).toString(16).padStart(32, '0') : null);
  n.log.length = 0;
  r = plain(await W.refresh(false));
  assert.deepEqual(r, { ok: true, changed: false });
  assert.ok(n.log.length <= 9, 'checked with ' + n.log.length + ' reads');
  assert.ok(!n.log.some((l) => l.fn === 'get-object-view' || l.fn === 'get-objects'));
  // the hall itself changed (the recorded "updated" moment): reload
  n.over = null; n.scenario = 'updated';
  r = plain(await W.refresh(false));
  assert.deepEqual(r, { ok: true, changed: true });
  const t = (l) => JSON.parse(l.params).text;
  assert.equal(t(W.snapshot().bays[1].scene.layers.find((l) => l.slot === 2)), 'NEW TEXT');
  assert.deepEqual(plain(W.snapshot().bays[3].scene.layers.filter((l) => l.slot === 2).map(t)), ['new room', 'SECOND']);
});

test('a scheduled change is noticed from the chain height (nextHeight), at most every 30 seconds', async () => {
  const { W, n } = configured('pending');
  await W.refresh(true);
  const s = plain(W.snapshot());
  assert.ok(s.bays.every((b) => b.scene === null), 'before the scenes start: posters');
  const next = s.bays[0].nextHeight;
  assert.equal(next, FIX.scenarios.pending.burnHeight + 4);
  n.log.length = 0;
  assert.equal(W.onHeight(next - 1), false);
  assert.equal(n.log.length, 0);
  n.scenario = 'active';
  assert.equal(W.onHeight(next), true);
  await new Promise((r) => setTimeout(r, 50));
  for (let i = 0; i < 100 && !W.snapshot().bays[0].scene; i++) await new Promise((r) => setTimeout(r, 20));
  assert.equal(W.snapshot().bays[0].scene.base, 'wall');
});

test('a failed read keeps the last good snapshot; with nothing cached there is no snapshot (the hall shows its posters)', async () => {
  const { W, n } = configured('active');
  n.fail = true;
  let r = plain(await W.refresh(true));
  assert.equal(r.ok, false); assert.equal(W.snapshot(), null);
  n.fail = false;
  await W.refresh(true);
  assert.ok(W.snapshot().bays[0].scene);
  n.fail = true;
  r = plain(await W.refresh(true));
  assert.equal(r.ok, false);
  assert.equal(W.snapshot().bays[0].scene.base, 'wall', 'last good snapshot kept');
  // a half-failed read (the registry answers, an object read does not) fails as a whole, it does not blank a bay
  n.fail = false; n.over = (fn) => { if (fn === 'get-object-view') throw new Error('boom'); return null; };
  r = plain(await W.refresh(true));
  assert.equal(r.ok, false);
  assert.equal(W.snapshot().bays[2].scene.interaction, 3);
});

test('the cached snapshot is used at start; a cache from the other bay source is ignored', async () => {
  const a = configured('active');
  await a.W.refresh(true);
  const saved = a.win._store['xa-world-snap-v1'];
  assert.ok(saved && JSON.parse(saved).src === REG);
  // new page, same registry, node down: the cache shows
  const b = configured('active', { fail: true });
  b.win._store['xa-world-snap-v1'] = saved;
  const seen = [];
  b.W.start((s, why) => seen.push(why));
  assert.deepEqual(seen, ['cache']);
  assert.equal(plain(b.W.snapshot()).bays[1].scene.base, 'door');
  b.W.stop();
  // a v1 snapshot (no src) is not shown while the registry is configured
  const c = configured('active', { fail: true });
  const v1 = JSON.parse(saved); delete v1.src; delete v1.v2;
  c.win._store['xa-world-snap-v1'] = JSON.stringify(v1);
  c.W.start(() => {});
  assert.equal(c.W.snapshot(), null);
  c.W.stop();
  // and the other way round: no registry, a v2 cache is not shown
  const d = load(ALL); node(d, 'active', { fail: true });
  d.XAWorld.configure({ posters: POSTERS, world: 'ST1.xtrata-world-v1' });
  d._store['xa-world-snap-v1'] = saved;
  d.XAWorld.start(() => {});
  assert.equal(d.XAWorld.snapshot(), null); assert.equal(d.XAWorld.mode(), 1);
  d.XAWorld.stop();
});

test('an empty registry (the hall path does not resolve) gives four posters bays and reads no objects', async () => {
  const { W, n } = configured('active', { over: (fn) => (fn === 'resolve-path' ? '0x09' : null) });
  await W.refresh(true);
  let s = plain(W.snapshot());
  assert.deepEqual(s.bays, [null, null, null, null]); assert.deepEqual(s.rooms.lobby.bays, [null, null]);
  assert.ok(n.log.every((l) => l.fn !== 'get-object-view'));
});

test('with no registry configured the v1 path is untouched: mode 1, world reads only, snapshot shape as before', async () => {
  const win = load(ALL), log = [];
  const C = win.XAScores._codec;
  win.fetch = async (url, init) => {
    const m = /\/call-read\/([^/]+)\/([^/]+)\/([^/?]+)/.exec(url); log.push(m[2] + '.' + m[3]);
    const fn = m[3];
    const hex = fn === 'get-version' ? C.cvUint(1) : fn === 'get-bays' ? '0x0b00000000' : fn === 'get-looks' ? '0x0b00000000' : '0x0b00000000';
    return { ok: true, status: 200, json: async () => ({ okay: true, result: hex }) };
  };
  win.XAWorld.configure({ posters: POSTERS, world: 'ST1.xtrata-world-v1' });
  assert.equal(win.XAWorld.mode(), 1);
  assert.deepEqual(plain(await win.XAWorld.refresh(true)), { ok: true, changed: true });
  const s = plain(win.XAWorld.snapshot());
  assert.equal(s.src, undefined); assert.equal(s.v2, undefined);
  assert.deepEqual(s.bays, []);
  assert.ok(log.some((l) => l === 'xtrata-world-v1.get-bays'));
  assert.ok(!log.some((l) => /world-v2/.test(l)));
  // registry configured but world2.js missing from the pack (an older release): back to v1, or off
  const old = load(['score-client.js', 'world.js', 'bays.js']);
  old.XAWorld.configure({ posters: POSTERS, registry: REG });
  assert.equal(old.XAWorld.mode(), 0); assert.equal(old.XAWorld.enabled(), false);
  old.XAWorld.configure({ world: 'ST1.xtrata-world-v1' });
  assert.equal(old.XAWorld.mode(), 1);
});

/* ---------------------------------------------------------------- the pure assembler: hostile and odd input */
const win2 = load(ALL), T = win2.XAWorld2._t, LIM = win2.XAWorld2.LIMITS;
const kind = (builtin, o = {}) => ({ category: 0, name: builtin, tier: 0, builtin, hidden: false, approved: true, ...o });
const KINDS = { 0: kind('bay'), 1: kind('sign-board'), 2: kind('curtain-house'), 3: kind('door-gothic'), 4: kind('light-pulse'), 5: kind('work-site'), 6: kind('caution-tape'), 7: kind('door-skin'),
  8: kind('sign-board', { hidden: true }), 9: kind('sign-board', { tier: 1 }), 10: kind('sign-board', { approved: false }), 11: kind('mystery'), 12: kind('door-skin') };
const view = (id, o = {}) => ({ id, object: { space: 3, parent: 0, kind: 1, name: 'x', params: '{}', portal: null, state: 0, ...(o.object || {}) },
  'active-seq': o.active ? 0 : null, active: o.active ? { 'from-height': 5, retracted: false, patch: '{}', visibility: 0, interaction: 0, ...o.active } : null,
  'next-height': o.next === undefined ? null : o.next, height: 100 });
const bay = (kids, bayView, extra = {}) => {
  const views = { 5: bayView || view(5, { object: { kind: 0, name: 'bay-0', ...(extra.object || {}) }, active: { patch: '{"base":"wall"}', ...(extra.active || {}) } }) };
  const sel = { id: 5, children: [] };
  kids.forEach((k, i) => { const id = 10 + i; views[id] = view(id, { ...k, object: { parent: 5, ...(k.object || {}) } }); sel.children.push({ id, kind: views[id].object.kind }); });
  return plain(T.assembleBay(sel, views, KINDS, (to) => ({ 4: 'lobby' }[to] || '')));
};

test('assemble: no active state or a hidden one is posters; the base must be a known one', () => {
  assert.equal(bay([], view(5, { object: { kind: 0, name: 'bay-0' } })).scene, null);
  assert.equal(bay([], view(5, { object: { kind: 0 }, active: { patch: '{"base":"wall"}', visibility: 1 } })).scene, null);
  assert.equal(bay([], null, { active: { patch: '{"base":"<script>"}' } }).scene.base, 'posters');
  assert.equal(bay([], null, { active: { patch: 'not json' } }).scene.base, 'posters');
  assert.equal(bay([], null, { active: { patch: '[1,2]' } }).scene.base, 'posters');
});

test('assemble: params are cleaned (keys, types, lengths), a null patch value removes a key, merged long params go as an object', () => {
  const b = bay([{ object: { kind: 1, params: JSON.stringify({ text: 'HI', sub: 'x', nested: { a: 1 }, 'bad key!': 1, __proto__: 'x', n: NaN, big: 'y'.repeat(300), arr: ['a', 2, 'b'] }) },
    active: { patch: '{"sub":null,"text":"Yo"}' } }]);
  const p = JSON.parse(b.scene.layers[0].params);
  assert.equal(p.text, 'Yo'); assert.equal('sub' in p, false); assert.equal('nested' in p, false); assert.equal('bad key!' in p, false);
  assert.equal(p.big.length, LIM.text); assert.deepEqual(p.arr, ['a', 'b']);
  assert.equal(Object.prototype.hasOwnProperty.call(p, '__proto__'), false);
  // more than 256 characters once merged: handed over as an object, which the engine accepts
  const long = bay([{ object: { kind: 1, params: JSON.stringify({ a: 'x'.repeat(120), b: 'y'.repeat(120) }) }, active: { patch: JSON.stringify({ c: 'z'.repeat(100) }) } }]);
  assert.equal(typeof long.scene.layers[0].params, 'object');
  const pl = win2.XABays.planBay({ scene: plain(long.scene) }, plain({ 1: { kind: 2, tier: 0, builtin: 'sign-board', approved: true, hidden: false } }));
  assert.ok(pl && pl.overlays.length === 1);
});

test('assemble: hidden kinds, non-built-in kinds, unapproved kinds, unknown keys, retired or hidden objects are left out', () => {
  const b = bay([{ object: { kind: 8 } }, { object: { kind: 9 } }, { object: { kind: 10 } }, { object: { kind: 11 } }, { object: { kind: 1, state: 1 } },
    { object: { kind: 1 }, active: { visibility: 1 } }, { object: { kind: 1, params: '{"text":"OK"}' } }]);
  assert.deepEqual(b.scene.layers.map((l) => JSON.parse(l.params).text), ['OK']);
  assert.equal(T.kindUsable(KINDS[11]), false);
  assert.equal(T.kindUsable(undefined), false);
});

test('assemble: enter needs a link; a door base uses the newest visible door child; its skin keys become a door-skin layer', () => {
  const noLink = bay([], null, { active: { interaction: 3 } });
  assert.equal(noLink.scene.interaction, 0);
  const linked = bay([{ object: { kind: 3 } }], null, { object: { portal: { 'to-space': 4, arrival: 0, path: '' } }, active: { patch: '{"base":"door"}', interaction: 3 } });
  assert.equal(linked.scene.interaction, 3); assert.equal(linked.scene.link['target-room'], 'lobby'); assert.equal(linked.scene.doorLook, 3);
  const unknownTarget = bay([], null, { object: { portal: { 'to-space': 99, arrival: 0, path: '' } }, active: { interaction: 3 } });
  assert.equal(unknownTarget.scene.link, null); assert.equal(unknownTarget.scene.interaction, 0);
  const web = bay([], null, { object: { portal: { 'to-space': 0, arrival: 0, path: '/arcade' } }, active: { patch: '{"base":"door"}', interaction: 3 } });
  assert.deepEqual(plain(web.scene.link), { 'target-room': '', 'arrival-bay': 0, path: '/arcade' });
  const evil = bay([], null, { object: { portal: { 'to-space': 0, arrival: 0, path: '//evil.example' } }, active: { patch: '{"base":"door"}', interaction: 3 } });
  assert.equal(evil.scene.link, null);
  const two = bay([{ object: { kind: 3, params: '{"skin":"oak"}' } }, { object: { kind: 3, params: '{"skin":"steel","tint":"#112233"}' } }, { object: { kind: 7, params: '{"skin":"neon"}' } }], null, { active: { patch: '{"base":"door"}' } });
  assert.equal(two.scene.doorLook, 3);
  assert.deepEqual(two.scene.layers.map((l) => [l.slot, l.look === T.SKIN_LOOK ? 'skin' : 'kind', JSON.parse(l.params).skin]), [[2, 'skin', 'steel'], [2, 'kind', 'neon']]);
  // a wall has no door even if a door child exists
  assert.equal(bay([{ object: { kind: 3 } }]).scene.doorLook, null);
});

test('assemble: nextHeight is the earliest change anywhere in the bay (its own states or any child)', () => {
  const b = bay([{ next: 140, object: { kind: 1 } }, { next: 120, object: { kind: 4 } }], view(5, { object: { kind: 0 }, active: { patch: '{"base":"wall"}' }, next: 130 }));
  assert.equal(b.nextHeight, 120);
  assert.equal(bay([], view(5, { object: { kind: 0 } , next: 99 })).nextHeight, 99);
});

test('select: bay-0..3 by name and kind; others, duplicates and over-limit children are ignored; at most 32 children', () => {
  const items = [];
  const o = (id, name, kindId, parent) => items.push({ id, o: { name, kind: kindId, parent: parent || 0, state: 0 } });
  o(5, 'bay-0', 0); o(6, 'bay-1', 0); o(7, 'bay-9', 0); o(8, 'bay-1', 0); o(9, 'bay-2', 1); o(20, 'bay-3', 0);
  for (let i = 0; i < 40; i++) o(100 + i, 'sign', 1, 5);
  o(200, 'orphan', 1, 777);
  const sel = plain(T.selectBays(items, KINDS, 4));
  assert.deepEqual(sel.map((s) => s && s.id), [5, 6, null, 20]);
  assert.equal(sel[0].children.length, LIM.children);
  assert.equal(sel[0].children[0].id, 100);
  assert.equal(T.selectBays(items, KINDS, 2).length, 2);
});

test('the slot table matches the bay engine and every door style is a door', () => {
  const B = win2.XABays;
  for (const [key, def] of Object.entries(B.BUILTIN)) assert.equal(T.slotOf(key), def.kind, key);
  for (const s of B.DOOR_STYLES) assert.equal(T.slotOf('door-' + s), 0, s);
  assert.equal(T.slotOf('door-skin'), 2); assert.equal(T.slotOf('bay'), -1); assert.equal(T.slotOf('nope'), -1); assert.equal(T.slotOf(5), -1);
  assert.deepEqual(plain(win2.XAWorld2.SLOT), plain(Object.fromEntries(Object.entries(win2.XAWorld2.SLOT))));
});

test('limits: a hall space claiming a huge number of object slots is read in at most 8 pages', async () => {
  // rewrite get-space for the hall to claim 5000 object slots: the reader must not ask for 313 pages
  const none16 = '0x0b00000010' + '09'.repeat(16);
  const { win, W, n } = configured('active', { over: (fn, key, calls) => (fn === 'get-objects' && !(key in calls) ? none16 : null) });
  const codec = win.XAScores._codec, real = n.fetch;
  win.fetch = async (url, init) => {
    const res = await real(url, init), body = await res.json();
    if (/get-space$/.test(url) && JSON.parse(init.body).arguments[0] === codec.cvUint(FIX.scenarios.active.expect.meta.hall)) {
      // re-encode is not available in the browser codec, so patch the hex: the uint after the "object-slots" key
      const hex = body.result, key = Buffer.from('object-slots').toString('hex');
      const at = hex.indexOf(key) + key.length;                      // 01 + 16 bytes follow
      body.result = hex.slice(0, at + 2) + (5000).toString(16).padStart(32, '0') + hex.slice(at + 34);
    }
    return { ok: true, status: 200, json: async () => body };
  };
  n.log.length = 0;
  await W.refresh(true);
  const pages = n.log.filter((l) => l.fn === 'get-objects' && l.key.includes(codec.cvUint(FIX.scenarios.active.expect.meta.hall).slice(2)));
  assert.equal(pages.length, LIM.pages);
  assert.ok(W.snapshot().bays[0].scene, 'and the hall still reads');
});
