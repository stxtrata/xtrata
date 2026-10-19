// Phase 3: the bay plan (what a scene may ask for) and the bay audio (range, mute, fades), in Node with no browser.
// Run: node --test tests/bays-plan.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const sb = { module: { exports: {} }, console, Math, JSON, Object, Array, Number, String, Date, setTimeout, clearTimeout };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'parts', 'bays.js'), 'utf8'), sb);
const B = sb.module.exports;
const plain = (x) => JSON.parse(JSON.stringify(x));

// the looks table as the reader builds it
const LOOKS = {
  1: { kind: 1, name: 'House curtain', tier: 0, builtin: 'curtain-house', hidden: false, approved: true },
  2: { kind: 2, name: 'Sign', tier: 0, builtin: 'sign-board', hidden: false, approved: true },
  3: { kind: 3, name: 'Work site', tier: 0, builtin: 'work-site', hidden: false, approved: true },
  4: { kind: 4, name: 'Flicker', tier: 0, builtin: 'light-flicker', hidden: false, approved: true },
  5: { kind: 2, name: 'Tape', tier: 0, builtin: 'caution-tape', hidden: false, approved: true },
  6: { kind: 1, name: 'Recipe curtain', tier: 1, builtin: '', hidden: false, approved: true },
  7: { kind: 1, name: 'Hidden curtain', tier: 0, builtin: 'curtain-house', hidden: true, approved: true },
  8: { kind: 3, name: 'Hum', tier: 0, builtin: 'hum', hidden: false, approved: true },
  9: { kind: 1, name: 'Unknown', tier: 0, builtin: 'velvet-9000', hidden: false, approved: true },
};
const layer = (slot, look, params = '{}', state = '') => ({ slot, look, params, state });
const bay = (layers, o = {}) => ({ scene: { base: 'door', baseId: 2, interaction: 0, doorLook: null, layers, link: null, fromHeight: 0, ...o }, nextHeight: null, height: 0 });

test('no scene, or no bay, means posters as always', () => {
  assert.equal(B.planBay(null, LOOKS), null);
  assert.equal(B.planBay({ scene: null }, LOOKS), null);
  assert.equal(B.planKey(null), '');
});

test('a posters scene with nothing added is a plan that shows posters', () => {
  const p = plain(B.planBay(bay([], { base: 'posters' }), LOOKS));
  assert.equal(p.base, 'posters'); assert.equal(p.cover, null); assert.deepEqual(p.overlays, []);
});

test('the launch story: curtain, sign, work sounds and a flickering lamp resolve to one plan', () => {
  const p = plain(B.planBay(bay([
    layer(1, 1, '{"color":"#7a1020","openness":0}', 'closed'),
    layer(2, 2, '{"text":"coming soon","sub":"back in three days","tone":"gold"}'),
    layer(3, 3, '{"kinds":"hammer,saw","volume":0.5,"radius":6}'),
    layer(4, 4, '{"tone":"orange","rate":2}'),
  ], { interaction: 1 }), LOOKS));
  assert.equal(p.base, 'door'); assert.equal(p.interaction, 1);
  assert.equal(p.cover.key, 'curtain-house'); assert.equal(p.cover.p.color, '#7a1020'); assert.equal(p.cover.p.openness, 0);
  assert.equal(p.overlays.length, 1); assert.equal(p.overlays[0].p.text, 'COMING SOON'); assert.equal(p.overlays[0].p.tone, 'gold');
  assert.deepEqual(p.sound.p.kinds, ['hammer', 'saw']); assert.equal(p.sound.p.radius, 6);
  assert.equal(p.light.key, 'light-flicker'); assert.equal(p.light.p.rate, 2);
});

test('the layer state drives the curtain: open, half, closed', () => {
  const o = (st) => plain(B.planBay(bay([layer(1, 1, '{"openness":0.3}', st)]), LOOKS)).cover.p.openness;
  assert.equal(o('open'), 1); assert.equal(o('half'), 0.5); assert.equal(o('closed'), 0); assert.equal(o(''), 0.3); assert.equal(o('whatever'), 0.3);
});

test('only usable built-in looks are drawn', () => {
  const p = plain(B.planBay(bay([layer(1, 6), layer(2, 7), layer(1, 9), layer(2, 99), layer(1, 2), layer(3, 1)]), LOOKS));
  assert.equal(p.cover, null, 'recipe (tier 1), hidden, unknown key, missing look and wrong kind are all ignored');
  assert.deepEqual(p.overlays, []); assert.equal(p.sound, null);
  // a layer whose slot disagrees with its look's kind is refused
  assert.equal(plain(B.planBay(bay([layer(2, 1)]), LOOKS)).cover, null);
});

test('params are clamped and cleaned; bad JSON falls back to defaults', () => {
  const c = (params) => plain(B.planBay(bay([layer(1, 1, params)]), LOOKS)).cover.p;
  assert.equal(c('{"openness":9}').openness, 1); assert.equal(c('{"openness":-3}').openness, 0); assert.equal(c('{"speed":99}').speed, 5);
  assert.equal(c('{"color":"red; background:url(x)"}').color, null); assert.equal(c('{"color":"#ABCDEF"}').color, '#abcdef');
  assert.deepEqual(c('not json'), { color: null, trim: null, openness: 0, speed: 1 });
  assert.deepEqual(c('[1,2]'), { color: null, trim: null, openness: 0, speed: 1 });
  assert.deepEqual(c('x'.repeat(300)), { color: null, trim: null, openness: 0, speed: 1 });
  const s = plain(B.planBay(bay([layer(2, 2, '{"text":"<img src=x onerror=1> HELLO \\u0000 world & co","tone":"purple","y":99}')]), LOOKS)).overlays[0].p;
  assert.equal(s.text, 'IMG SRCX ONERROR1 HELLO  WORLD & CO'.slice(0, 22)); assert.equal(s.tone, 'orange'); assert.equal(s.y, 2.9);
  const w = plain(B.planBay(bay([layer(3, 3, '{"kinds":["hammer","laser","hammer"],"radius":500,"gap":0,"volume":7}')]), LOOKS)).sound.p;
  assert.deepEqual(w.kinds, ['hammer']); assert.equal(w.radius, 12); assert.equal(w.gap, 0.3); assert.equal(w.volume, 1);
});

test('sound and light can be switched off by state; overlays are capped at four', () => {
  const p = plain(B.planBay(bay([layer(3, 3, '{}', 'off'), layer(4, 4, '{}', 'off'), layer(2, 2), layer(2, 2), layer(2, 5), layer(2, 5), layer(2, 2)]), LOOKS));
  assert.equal(p.sound, null); assert.equal(p.light, null); assert.equal(p.overlays.length, 4);
});

test('a visitor may pull the curtain only when the scene allows peeking, or it is already open', () => {
  const g = (o, st) => B.curtainGrabbable(B.planBay(bay([layer(1, 1, '{}', st)], { interaction: o }), LOOKS));
  assert.equal(g(0, 'closed'), false); assert.equal(g(1, 'closed'), false); assert.equal(g(3, 'closed'), false);
  assert.equal(g(2, 'closed'), true); assert.equal(g(3, 'open'), true); assert.equal(g(0, 'open'), true);
  assert.equal(B.curtainGrabbable(null), false);
  assert.equal(B.curtainGrabbable(B.planBay(bay([]), LOOKS)), false);
});

test('the plan key changes when, and only when, the plan changes', () => {
  const a = B.planBay(bay([layer(1, 1, '{"openness":0.2}')]), LOOKS), b = B.planBay(bay([layer(1, 1, '{"openness":0.2}')]), LOOKS), c = B.planBay(bay([layer(1, 1, '{"openness":0.4}')]), LOOKS);
  assert.equal(B.planKey(a), B.planKey(b)); assert.notEqual(B.planKey(a), B.planKey(c));
});

// ---------------------------------------------------------------------------------------------- audio, with a recording fake
function fakeAudio() {
  const made = { nodes: 0, sources: 0 };
  const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, cancelScheduledValues() {} });
  const node = () => {
    made.nodes++;
    const n = { connect() {}, disconnect() { n.gone = true; }, start() { made.sources++; }, stop() {}, setPosition() {}, gain: param(), frequency: param(), Q: param(), positionX: param(), positionY: param(), positionZ: param(), buffer: null, loop: false };
    return n;
  };
  const ctx = { currentTime: 10, sampleRate: 8000, createGain: node, createPanner: node, createBufferSource: node, createBiquadFilter: node, createOscillator: node,
    createBuffer: (c, n) => ({ sampleRate: 8000, getChannelData: () => new Float32Array(n) }) };
  return { ctx, made, master: node(), wet: node() };
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const WORK = { key: 'work-site', p: { kinds: ['hammer', 'saw', 'drill', 'clatter'], volume: 0.6, radius: 6, gap: 1 } };
const POS = { x: -4.6, y: 1.6, z: -8 };

test('audio: nothing starts before the room audio exists, or outside the reach radius', () => {
  const a = B.createAudio(); a.setBay(0, POS, WORK);
  a.update(0.016, { x: -4, z: -8 }, true);
  assert.deepEqual(a._voices(), [], 'no audio context yet');
  const f = fakeAudio(); a.attach({ ctx: f.ctx, master: f.master, wet: f.wet });
  a.update(0.016, { x: 0, z: 8 }, true);
  assert.deepEqual(a._voices(), [], 'listener 16 m away');
  assert.equal(f.made.sources, 0);
  a.update(0.016, { x: -4, z: -5 }, true);
  assert.deepEqual(a._voices(), [0], 'listener 3 m away: the voice starts');
  a.update(0.2, { x: -4, z: -5 }, true);              // the first burst follows a moment after the fade-in begins
  assert.ok(a._log().length >= 1 && ['hammer', 'saw', 'drill', 'clatter'].includes(a._log()[0].kind), 'and plays a work sound');
});

test('audio: muted or room music off silences it; leaving the radius fades it', async () => {
  const a = B.createAudio(), f = fakeAudio(); a.attach({ ctx: f.ctx, master: f.master, wet: f.wet }); a.setBay(0, POS, WORK);
  a.update(0.016, { x: -4, z: -5 }, true); assert.deepEqual(a._voices(), [0]);
  a.update(0.016, { x: -4, z: -5 }, false); assert.deepEqual(a._voices(), [], 'inactive (muted / room off): fading out');
  await wait(700);
  const before = a._log().length;
  a.update(0.016, { x: -4, z: -5 }, false); assert.deepEqual(a._voices(), []);
  assert.equal(a._log().length, before, 'no new bursts while silenced');
  a.update(0.016, { x: -4, z: -5 }, true); assert.deepEqual(a._voices(), [0], 'back on when allowed');
  a.update(0.016, { x: 4, z: 8 }, true); assert.deepEqual(a._voices(), [], 'walking away fades it');
});

test('audio: a scene change fades the old sound and clearing the scene silences the bay; bursts are spaced by the gap', async () => {
  const a = B.createAudio(), f = fakeAudio(); a.attach({ ctx: f.ctx, master: f.master, wet: f.wet });
  a.setBay(0, POS, WORK); a.update(0.016, { x: -4, z: -5 }, true); a.update(0.2, { x: -4, z: -5 }, true);
  const n0 = a._log().length; assert.equal(n0, 1, 'first burst');
  a.update(0.5, { x: -4, z: -5 }, true); assert.equal(a._log().length, n0, 'next burst not due yet');
  a.update(10, { x: -4, z: -5 }, true); assert.equal(a._log().length, n0 + 1, 'due after the burst and the gap');
  a.setBay(0, POS, { key: 'hum', p: { volume: 0.4, radius: 6, pitch: 110 } });
  assert.deepEqual(a._voices(), [], 'old voice is fading');
  await wait(750);
  a.update(0.016, { x: -4, z: -5 }, true); assert.deepEqual(a._voices(), [0], 'the new sound starts');
  a.setBay(0, POS, null); assert.deepEqual(a._voices(), []);
});

test('audio: a cloth sound only plays when the listener is close', () => {
  const a = B.createAudio(), f = fakeAudio(); a.attach({ ctx: f.ctx, master: f.master, wet: f.wet });
  assert.equal(a.oneShot('swish', POS, { x: 3, z: 8 }, 0.7, 9), false);
  assert.equal(a.oneShot('swish', POS, { x: -3, z: -6 }, 0.7, 9), true);
  assert.equal(B.createAudio().oneShot('swish', POS, { x: -3, z: -6 }, 0.7, 9), false, 'no audio context, no sound');
  const last = a._log().pop(); assert.equal(last.kind, 'swish');
});

test('audio: every work sound can be synthesised without throwing', () => {
  const a = B.createAudio(), f = fakeAudio();
  ['hammer', 'saw', 'drill', 'clatter', 'swish'].forEach((k) => { const len = a._syn[k](f.ctx, f.master, 10, 0.6); assert.ok(len > 0.1 && len < 3, k + ' lasts ' + len); });
});

/* ---- phase 3b: the door a scene asks for ---- */
const DLOOKS = Object.assign({}, LOOKS, {
  20: { kind: 0, name: 'Arch door', tier: 0, builtin: 'door-arch', hidden: false, approved: true },
  21: { kind: 0, name: 'Hidden door', tier: 0, builtin: 'door-gothic', hidden: true, approved: true },
  22: { kind: 0, name: 'Unapproved door', tier: 0, builtin: 'door-scifi', hidden: false, approved: false },
  23: { kind: 0, name: 'Recipe door', tier: 1, builtin: 'door-circle', hidden: false, approved: true },
  24: { kind: 0, name: 'Unknown style', tier: 0, builtin: 'door-lasergate', hidden: false, approved: true },
  25: { kind: 1, name: 'Not a door', tier: 0, builtin: 'door-arch', hidden: false, approved: true },
});

test('a door scene resolves its door look to a style; anything unusable falls back to the classic door', () => {
  const style = (doorLook) => plain(B.planBay(bay([], { doorLook }), DLOOKS)).door.style;
  assert.equal(style(20), 'arch');
  [null, 21, 22, 23, 24, 25, 999].forEach((id) => assert.equal(style(id), 'rect', 'look ' + id));
});

test('only a door base has a door; walls and posters have none', () => {
  assert.equal(B.planBay(bay([], { base: 'wall' }), DLOOKS).door, null);
  assert.equal(B.planBay(bay([], { base: 'posters' }), DLOOKS).door, null);
});

test('the plan key follows the door style and the interaction', () => {
  const k = (o) => B.planKey(B.planBay(bay([], o), DLOOKS));
  assert.notEqual(k({ doorLook: 20 }), k({ doorLook: null }));
  assert.notEqual(k({ interaction: 1 }), k({ interaction: 2 }));
  assert.equal(k({ doorLook: 20 }), k({ doorLook: 20 }));
});

test('the styles the plan accepts are exactly the styles doors.js can draw', () => {
  const sb2 = { module: { exports: {} }, console, Math, JSON, Object, Array, Number, String, Date, setTimeout, clearTimeout };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'parts', 'doors.js'), 'utf8'), sb2);
  assert.deepEqual(Array.from(B.DOOR_STYLES).sort(), Array.from(sb2.module.exports.STYLE_NAMES).sort());
});
