// Phase 3b: the doors (src/parts/doors.js) without a browser: style data, drawing ops, the door physics, and the sounds
// against a recording fake audio context.
// Run: node --test tests/doors.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const sb = { module: { exports: {} }, console, Math, JSON, Object, Array, Number, String, Date, setTimeout, clearTimeout, Float64Array };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'parts', 'doors.js'), 'utf8'), sb);
const D = sb.module.exports;
const num = (n) => Number.isFinite(n);

test('the draft constants are unchanged', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(D.CONST)), { HMAX: 22, MAXA: 108, DEF_OPEN: 105, KH: 900, CH: 37, KD: 150, CD: 17.6 });
});

test('all 14 styles of the draft are here, with the draft sizes', () => {
  assert.deepEqual(Array.from(D.STYLE_NAMES), ['rect', 'tall', 'wide', 'arch', 'gothic', 'double', 'cathedral', 'circle', 'oval', 'hexagon', 'octagon', 'industrial', 'vintage', 'scifi']);
  const size = (n) => { const s = D.STYLES[n]; return [s.w, s.h, s.leaves, s.sfx]; };
  assert.deepEqual(size('rect'), [120, 220, 1, 'wood']); assert.deepEqual(size('tall'), [82, 300, 1, 'wood']); assert.deepEqual(size('wide'), [250, 168, 1, 'wood']);
  assert.deepEqual(size('double'), [230, 236, 2, 'wood']); assert.deepEqual(size('cathedral'), [240, 310, 2, 'wood']);
  assert.deepEqual(size('industrial'), [190, 232, 1, 'metal']); assert.deepEqual(size('scifi'), [160, 262, 1, 'tech']); assert.deepEqual(size('circle'), [190, 190, 1, 'metal']);
});

test('every style: a sane outline, an edge function inside it, and clean drawing ops for every leaf', () => {
  D.STYLE_NAMES.forEach((n) => {
    const G = D.layoutOf(n), { W, H, shape } = G;
    assert.ok(shape.pts.length >= 4, n + ' outline'); shape.pts.forEach((p) => { assert.ok(num(p[0]) && num(p[1]) && p[0] >= -0.01 && p[0] <= W + 0.01 && p[1] >= -0.01 && p[1] <= H + 0.01, n + ' point ' + p); });
    for (let y = 0.1 * H; y < H; y += 0.2 * H) { const e = shape.edge(y); assert.ok(e[0] >= -0.01 && e[1] <= W + 0.01 && e[1] > e[0], n + ' edge at ' + y + ' ' + e); }
    assert.equal(G.leaves.length, D.STYLES[n].leaves);
    G.leaves.forEach((L) => {
      assert.ok(L.hx >= L.x0 - 1 && L.hx <= L.x1 + 1 && num(L.latch) && num(L.axis), n + ' hinge and latch positions');
      const ops = D.faceOps(G, L, 0).split('\n').filter(Boolean);
      assert.ok(ops.length > 8, n + ' has decoration');
      ops.forEach((line) => {
        const f = line.split('\t'); assert.ok(['P', 'R', 'C', 'K', 'E'].includes(f[0]), n + ' op kind ' + f[0]);
        if (f[0] !== 'P' && f[0] !== 'E') f[2].split(' ').forEach((v) => assert.ok(num(Number(v)), n + ' op number ' + line));
        if (f[0] === 'P') assert.ok(!/NaN|undefined|Infinity/.test(f[2]), n + ' path ' + f[2]);
      });
      assert.equal(ops.filter((l) => l[0] === 'K').length, ops.filter((l) => l[0] === 'E').length, n + ' clips are balanced');
    });
    ['lever', 'knob', 'bar'].forEach((t) => assert.ok(D.leverArt(t, 30).length > 20));
  });
});

test('a double door splits its outline into two strips that add back up to the whole', () => {
  const area = (pts) => { let a = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; } return Math.abs(a / 2); };
  ['double', 'cathedral', 'rect'].forEach((n) => {
    const G = D.layoutOf(n), whole = area(G.shape.pts), parts = G.leaves.map((L) => area(D.clipStrip(G.shape.pts, L.x0, L.x1)));
    assert.ok(Math.abs(parts.reduce((a, b) => a + b, 0) - whole) < whole * 0.002, n + ' strips ' + parts + ' vs ' + whole);
  });
});

// a recording 2D context and a stub Path2D
sb.Path2D = function (d) { this.d = d; }; ['moveTo', 'lineTo', 'arcTo', 'arc', 'closePath'].forEach((k) => { sb.Path2D.prototype[k] = function () {}; });
function recCtx() {
  const calls = [], depth = { n: 0, bad: false };
  const c = new Proxy({}, { get: (t, k) => {
    if (k === 'calls') return calls; if (k === 'depth') return depth;
    if (k in t) return t[k];
    return (...a) => { if (k === 'save') depth.n++; if (k === 'restore') { depth.n--; if (depth.n < 0) depth.bad = true; } calls.push(k); };
  }, set: (t, k, v) => { t[k] = v; return true; } });
  return c;
}
test('the ops paint onto a 2D context without leaving it unbalanced', () => {
  vm.runInNewContext('this.Path2D = Path2D', sb, {});
  D.STYLE_NAMES.forEach((n) => {
    const G = D.layoutOf(n), ctx = recCtx(), run = vm.runInNewContext('(function(D,ctx,ops){D.drawOps(ctx,ops,{line:"#62dcff",fill:"#000",lw:1.5})})', Object.assign(sb));
    G.leaves.forEach((L) => run(D, ctx, D.faceOps(G, L, 0)));
    assert.ok(ctx.calls.filter((c) => c === 'stroke').length > 5, n + ' strokes'); assert.equal(ctx.depth.n, 0, n + ' save/restore balanced'); assert.equal(ctx.depth.bad, false);
  });
});

// ---------------------------------------------------------------------------------------------- the physics
function rec() { const ev = []; const sfx = {}; ['handleDown', 'latchRetract', 'handleReturn', 'latch', 'rattle', 'bolt', 'slam', 'stop', 'seal', 'knock'].forEach((k) => { sfx[k] = (d, a) => ev.push(k + (a !== undefined && k === 'bolt' ? (a ? ':lock' : ':unlock') : '')); }); sfx.creak = () => {}; return { ev, sfx }; }
function run(m, secs, dt = 1 / 60) { let n = Math.round(secs / dt), peak = 0; while (n--) { m.update(dt); peak = Math.max(peak, m.angle); } return peak; }

test('an unlocked door: the handle goes down first, then the leaf swings to its open angle and rests there', () => {
  const r = rec(), m = new D.DoorModel({ style: 'rect', locked: false }, r.sfx);
  assert.equal(m.open(), true); assert.equal(m.angle, 0, 'the leaf waits for the handle');
  run(m, 0.12); assert.ok(m.handle.a > 15 && m.angle < 3, 'handle pulled (' + m.handle.a.toFixed(1) + '), leaf not yet moving (' + m.angle.toFixed(2) + ')');
  run(m, 3);
  assert.ok(Math.abs(m.angle - 105) < 0.5, 'open at ' + m.angle); assert.equal(m.isOpen(), true); assert.ok(r.ev.indexOf('handleDown') < r.ev.indexOf('latchRetract') && r.ev.includes('seal'));
  run(m, 2); assert.equal(m.settled(), true, 'it goes to sleep once nothing moves');
  assert.equal(m.open(), true, 'opening an open door is a no-op');
});

test('closing: it swings back, slams against the stop, the latch clicks, and it settles shut', () => {
  const r = rec(), m = new D.DoorModel({ style: 'industrial', locked: false }, r.sfx);
  m.open(); run(m, 3.5); r.ev.length = 0;
  m.close(); run(m, 3);
  assert.ok(m.angle < 0.3 && !m.isOpen(), 'shut at ' + m.angle);
  assert.ok(r.ev.includes('slam') || r.ev.includes('latch'), 'heard it close: ' + r.ev.join(','));
  run(m, 1); assert.equal(m.settled(), true);
});

test('a locked door rattles at the handle stop, trembles, never opens, and settles', () => {
  const r = rec(), m = new D.DoorModel({ style: 'rect' }, r.sfx);
  assert.equal(m.cfg.locked, true, 'doors are locked unless told otherwise');
  assert.equal(m.open(), false); assert.equal(m.rattle.active, true);
  let shook = 0, peak = 0;
  for (let i = 0; i < 60; i++) { m.update(1 / 60); shook = Math.max(shook, Math.abs(m.shakeX) + Math.abs(m.shakeR)); peak = Math.max(peak, m.handle.a); }
  assert.ok(shook > 0.05, 'the leaf trembles (' + shook.toFixed(2) + ')'); assert.ok(peak > 10 && peak < 16, 'the handle stops at its stop (' + peak.toFixed(1) + ')');
  run(m, 1); assert.equal(m.angle, 0); assert.equal(m.rattle.active, false); assert.equal(m.shakeX, 0); assert.equal(m.settled(), true);
  assert.deepEqual(r.ev.filter((e) => e === 'rattle'), ['rattle']);
  assert.equal(m.open(true), true, 'force opens even a locked door (an admin or story beat)'); run(m, 3); assert.ok(m.angle > 100);
});

test('locking and unlocking make the bolt sound, unless quiet', () => {
  const r = rec(), m = new D.DoorModel({ style: 'scifi', locked: false }, r.sfx);
  m.lock(); m.lock(); m.unlock(); m.unlock(true); m.lock(true); m.unlock();
  assert.deepEqual(r.ev, ['bolt:lock', 'bolt:unlock', 'bolt:unlock']);
  m.knock(); assert.equal(r.ev.pop(), 'knock');
});

test('the physics is deterministic and frame-rate independent enough to open at 30 or 144 fps', () => {
  const end = (fps) => { const m = new D.DoorModel({ style: 'rect', locked: false }); m.open(); run(m, 4, 1 / fps); return m.angle; };
  [30, 60, 144].forEach((f) => assert.ok(Math.abs(end(f) - 105) < 0.6, f + ' fps ended at ' + end(f)));
  const a = new D.DoorModel({ style: 'tall', locked: false }), b = new D.DoorModel({ style: 'tall', locked: false }); a.open(); b.open(); run(a, 2); run(b, 2); assert.equal(a.angle, b.angle);
});

test('unknown style falls back to the classic door; the open angle is clamped', () => {
  assert.equal(new D.DoorModel({ style: 'velvet' }).cfg.style, 'rect');
  assert.equal(new D.DoorModel({ style: 'rect', openAngle: 500 }).cfg.openAngle, 105); assert.equal(new D.DoorModel({ style: 'rect', openAngle: -4 }).cfg.openAngle, 20);
});

// ---------------------------------------------------------------------------------------------- the sounds
function fakeEnv(state = 'running') {
  const made = { sources: 0, panners: 0 };
  const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {}, cancelScheduledValues() {} });
  const node = (extra = {}) => Object.assign({ connect() {}, disconnect() {}, start() { made.sources++; }, stop() {}, gain: param(), frequency: param(), Q: param(), detune: param(), positionX: param(), positionY: param(), positionZ: param() }, extra);
  const ctx = { state, currentTime: 5, sampleRate: 8000, createGain: () => node(), createPanner: () => { made.panners++; return node(); }, createBufferSource: () => node(), createBiquadFilter: () => node(), createOscillator: () => node(),
    createBuffer: (c, n) => ({ getChannelData: () => new Float32Array(n) }) };
  return { env: { ctx, master: node(), wet: node() }, made };
}
const dm = (x, z) => { const m = new D.DoorModel({ style: 'rect' }); m.pos = { x, y: 1.2, z }; return m; };

test('sounds: nothing without a running audio context, nothing out of reach, and each one when near', () => {
  const near = { x: -2, z: -8 };
  let env = null; const s = D.createSfx(() => env, () => near);
  const d = dm(-4.6, -8);
  s.rattle(d, 1); assert.equal(s._log().length, 0, 'no audio yet');
  const f = fakeEnv('suspended'); env = f.env; s.rattle(d, 1); assert.equal(s._log().length, 0, 'suspended context');
  const g = fakeEnv('running'); env = g.env; s.rattle(d, 1); assert.deepEqual(Array.from(s._log(), (e) => e.name), ['rattle']); assert.ok(g.made.sources > 5 && g.made.panners === 1, 'one positional voice');
  s.rattle(dm(4.6, 8), 1); assert.equal(s._log().length, 1, 'a door across the hall is out of reach');
});

test('sounds: every door sound synthesises for every material without throwing', () => {
  const near = { x: -2, z: -8 }; let calls = 0;
  ['rect', 'industrial', 'scifi'].forEach((style) => {
    const g = fakeEnv(), s = D.createSfx(() => g.env, () => near), d = dm(-4.6, -8); d.style = D.STYLES[style];
    ['handleDown', 'latchRetract', 'handleReturn', 'latch', 'rattle', 'thud', 'slam', 'stop', 'seal', 'knock'].forEach((k) => { s[k](d, k === 'rattle' ? 1 : 0.7); calls++; });
    s.bolt(d, true); s.bolt(d, false);
    assert.ok(s._log().length >= 10, style + ' ' + s._log().length);
    // the continuous creak: starts when moving briskly, stops when slow, never when far
    d._snd = null; s.creak(d, 5); assert.equal(d._snd, null); s.creak(d, 60); assert.ok(d._snd, 'voice started'); s.creak(d, 1); assert.equal(d._snd, null, 'voice ended');
  });
  assert.ok(calls > 25);
});

test('sounds: a burst of events is capped by the voice budget', () => {
  const g = fakeEnv(), s = D.createSfx(() => g.env, () => ({ x: -2, z: -8 })), d = dm(-4.6, -8);
  for (let i = 0; i < 60; i++) s.latch(d, 1);
  assert.ok(s._log().length <= 16, 'at most 16 in a hundred milliseconds, got ' + s._log().length);
});
