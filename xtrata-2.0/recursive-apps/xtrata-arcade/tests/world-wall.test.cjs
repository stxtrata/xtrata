// Phase 2 parity and safety tests for the poster wall.
//   1. The embedded rotation (wallForDay and its pools) is exactly what #3111 computes. The golden values below were
//      taken from the pristine hall.js before any world-contract change.
//   2. composeWall: with no chain data the wall is the embedded wall; chain data only ever overlays it.
// Run: NODE_PATH=/opt/npm-tools/node_modules node --test tests/world-wall.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const loadRotation = require('./lib/hall-rotation.cjs');

const SRC = path.join(__dirname, '..', 'src', 'parts');
const GOLDEN_WALLS = '4cfcc57051ef9411875ef887f9aa51f59bd81a7667a15062b82df15047bd4a2b';   // days 6690..7400, 27 slots
const GOLDEN_POOL = 'ab879041d9233e93a943897cba5ba6e7ee20d36a5b3b20d555eb9ccbac240e8a';    // 142 posters + their weights

const { api: rot } = loadRotation(path.join(SRC, 'hall.js'));

test('the embedded poster pool and weights are unchanged from #3111', () => {
  assert.equal(rot.ROTATION_POOL.length, 142);
  const h = crypto.createHash('sha256')
    .update(JSON.stringify(rot.ROTATION_POOL.map((p) => [p.head, p.sub, p.foot, p.c || null, p.art || null])))
    .update(JSON.stringify(rot.ROTATION_W)).digest('hex');
  assert.equal(h, GOLDEN_POOL);
});

test('wallForDay gives the same wall as #3111 for 711 days', () => {
  const h = crypto.createHash('sha256');
  for (let d = 6690; d <= 7400; d++) { const r = rot.wallForDay(d, 27); h.update(d + ':' + r.wall.join(',') + ':' + r.fresh + ';'); }
  assert.equal(h.digest('hex'), GOLDEN_WALLS);
});

// ---------------------------------------------------------------------------------------------- composeWall
const win = { console, Math, Date, JSON, Object, Array, Number, String, Uint8Array, setInterval, clearInterval };
win.window = win; win.globalThis = win;
vm.createContext(win);
vm.runInContext(fs.readFileSync(path.join(SRC, 'world.js'), 'utf8'), win, { filename: 'world.js' });
const W = win.XAWorld;
const plain = (x) => JSON.parse(JSON.stringify(x));       // vm objects -> this realm

const BAY_SLOTS = [12, 13, 25, 26];
const PIN_SLOTS = [null, 0, 14, 1, 15];
const OVERLAY = Array.from({ length: 27 }, (_, i) => i).filter((i) => !BAY_SLOTS.includes(i));
const entry = (id, o = {}) => ({ id, set: 0, kind: 0, head: 'P' + id, sub: '', foot: '', c: 'gold', art: 'star', weight: 10,
  start: 0, end: 99999, evergreen: false, scope: [], hidden: false, ...o });
const ctx = (day, snapshot, extra = {}) => ({ day, nEmbedded: 142, weights: rot.ROTATION_W, snapshot, overlaySlots: OVERLAY, pinSlots: PIN_SLOTS, ...extra });
const embeddedIdx = (out) => out.map((x) => (x.src === 'e' ? x.idx : null));

test('no snapshot, or an empty one, gives exactly the embedded wall (every day)', () => {
  for (let d = 6700; d < 7300; d += 7) {
    const base = rot.wallForDay(d, 27).wall;
    const want = base.map((idx) => ({ src: 'e', idx }));
    assert.deepEqual(plain(W.composeWall(base, ctx(d, null))), want);
    assert.deepEqual(plain(W.composeWall(base, ctx(d, { posters: [], pins: [], pinned: {}, suppressed: [], bays: [] }))), want);
  }
});

test('chain posters overlay at most 8 slots, never a bay slot, and leave every other slot embedded', () => {
  const posters = Array.from({ length: 20 }, (_, i) => entry(i));
  for (let d = 6900; d < 6960; d++) {
    const base = rot.wallForDay(d, 27).wall;
    const out = plain(W.composeWall(base, ctx(d, { posters, pins: [], pinned: {}, suppressed: [] })));
    const chain = out.map((x, i) => (x.src === 'c' ? i : -1)).filter((i) => i >= 0);
    assert.ok(chain.length > 0 && chain.length <= 8, 'overlay count ' + chain.length);
    chain.forEach((i) => assert.ok(!BAY_SLOTS.includes(i), 'slot ' + i + ' is a bay slot'));
    out.forEach((x, i) => { if (x.src === 'e') assert.equal(x.idx, base[i]); });
    assert.equal(new Set(chain).size, chain.length, 'no two chain posters share a slot');
  }
});

test('composing is deterministic and does not depend on the snapshot bays', () => {
  const posters = Array.from({ length: 6 }, (_, i) => entry(i));
  const base = rot.wallForDay(7000, 27).wall;
  const a = plain(W.composeWall(base, ctx(7000, { posters, bays: [null, null] })));
  const b = plain(W.composeWall(base, ctx(7000, { posters, bays: [{ scene: { base: 'wall' } }, { scene: { base: 'door' } }] })));
  assert.deepEqual(a, b);
  assert.deepEqual(a, plain(W.composeWall(base, ctx(7000, { posters, bays: [] }))));
});

test('poster windows, hidden flag and room scope are respected', () => {
  const base = rot.wallForDay(7000, 27).wall;
  const run = (e) => plain(W.composeWall(base, ctx(7000, { posters: [e] }))).some((x) => x.src === 'c');
  assert.equal(run(entry(1)), true);
  assert.equal(run(entry(1, { start: 7001 })), false, 'not started');
  assert.equal(run(entry(1, { end: 7000 })), false, 'ended (end day is exclusive)');
  assert.equal(run(entry(1, { end: 7001 })), true);
  assert.equal(run(entry(1, { end: 1, evergreen: true })), true, 'evergreen ignores the end day');
  assert.equal(run(entry(1, { hidden: true })), false);
  assert.equal(run(entry(1, { scope: ['other-room'] })), false);
  assert.equal(run(entry(1, { scope: ['arcade-hall'] })), true);
});

test('suppressing embedded posters swaps only those, with a poster not already on the wall', () => {
  const base = rot.wallForDay(7000, 27).wall;
  const sup = [base[3], base[20]];
  const out = plain(W.composeWall(base, ctx(7000, { posters: [], suppressed: sup })));
  const idx = embeddedIdx(out);
  out.forEach((x, i) => { if (!sup.includes(base[i])) assert.equal(x.idx, base[i], 'slot ' + i + ' moved'); });
  assert.ok(!idx.some((v) => sup.includes(v)), 'suppressed posters are gone');
  assert.equal(new Set(idx).size, 27, 'no embedded poster appears twice');
  assert.deepEqual(plain(W.composeWall(base, ctx(7000, { posters: [], suppressed: sup }))), out, 'same every time');
});

test('a pin takes its slot inside its window and releases it outside', () => {
  const base = rot.wallForDay(7000, 27).wall;
  const pinned = entry(9, { head: 'PIN' });
  const snap = (from, to) => ({ posters: [], pins: [{ spot: 2, poster: 9, from, to }], pinned: { 9: pinned } });
  const inside = plain(W.composeWall(base, ctx(7000, snap(6999, 7003))));
  assert.equal(inside[14].src, 'c'); assert.equal(inside[14].entry.head, 'PIN');
  const outside = plain(W.composeWall(base, ctx(7000, snap(7001, 7003))));
  assert.equal(outside[14].src, 'e');
  assert.equal(plain(W.composeWall(base, ctx(7000, { ...snap(6999, 7003), pins: [{ spot: 9, poster: 9, from: 6999, to: 7003 }] }))).filter((x) => x.src === 'c').length, 0, 'an unknown spot is ignored');
  // a pinned poster already chosen by the pool is not on the wall twice
  const dup = plain(W.composeWall(base, ctx(7000, { posters: [pinned], pins: [{ spot: 1, poster: 9, from: 6999, to: 7003 }], pinned: { 9: pinned } })));
  assert.equal(dup.filter((x) => x.src === 'c' && x.entry.id === 9).length, 1);
  assert.equal(dup[0].src, 'c');
});

test('off by default: no contract ids means disabled, even with a codec present', () => {
  assert.equal(W.enabled(), false);
  W.configure({ posters: 'SP1.a', world: 'SP1.b' });
  assert.equal(W.enabled(), false, 'still off without the score client codec');
});
