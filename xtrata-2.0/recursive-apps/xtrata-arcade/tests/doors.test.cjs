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

// the latch: while a door is being closed the handle stays down (the latch bolt is pulled in) until the leaf is home, and then it is let go
// so the bolt snaps into the frame. It never lets the bolt hit the frame and leave the door ajar.
test('closing: the handle is held down until the leaf is home, then released so the latch snaps in', () => {
  const r = rec(), m = new D.DoorModel({ style: 'rect', locked: false }, r.sfx);
  m.open(); run(m, 3.5); r.ev.length = 0; m.close();
  let heldWhileSwinging = true, homeAt = -1, releasedAt = -1;
  for (let i = 0; i < 60 * 4; i++) {
    m.update(1 / 60);
    if (m.angle > 0.6 && i > 6 && m.handle.a < 22 * 0.8) heldWhileSwinging = false;
    if (homeAt < 0 && m.angle <= 0.4) homeAt = i;
    if (releasedAt < 0 && i > 6 && m.handle.a < 22 * 0.5) releasedAt = i;
  }
  assert.ok(heldWhileSwinging, 'the latch stayed pulled in the whole way round');
  assert.ok(homeAt >= 0 && releasedAt >= homeAt - 1, 'the handle was let go only once the leaf was home (home ' + homeAt + ', let go ' + releasedAt + ')');
  assert.ok(m.angle < 0.3 && m.handle.a < 1 && !m.handle.carry, 'shut with the latch out: leaf ' + m.angle.toFixed(2) + ', handle ' + m.handle.a.toFixed(2));
  assert.ok(r.ev.includes('handleReturn'), 'the handle springs back: ' + r.ev.join(','));
});

test('closing always ends shut and latched: any start angle, any style, pushed or driven, no ajar rest', () => {
  Object.keys(D.STYLES).forEach((style) => {
    [4, 9, 25, 60, 105].forEach((from) => {
      const m = new D.DoorModel({ style, locked: false }, rec().sfx);
      m.angle = from; m.mode = 'free'; m.wake(); m.close(); let peakAfter = 0, shutAt = -1;
      for (let i = 0; i < 60 * 5; i++) { m.update(1 / 60); if (shutAt < 0 && m.angle <= 0.4) shutAt = i; if (shutAt >= 0) peakAfter = Math.max(peakAfter, m.angle); }
      assert.ok(m.angle < 0.3, style + ' from ' + from + ' shut (' + m.angle.toFixed(2) + ')');
      assert.ok(peakAfter < 2.5, style + ' from ' + from + ' does not bounce back open (peak ' + peakAfter.toFixed(2) + ')');
      assert.ok(m.handle.a < 1, style + ' from ' + from + ' latch out again (' + m.handle.a.toFixed(2) + ')');
    });
  });
});

test('a door pushed shut by hand: the strike pulls the latch in on the way and it catches, never resting ajar', () => {
  [3.9, 3.2, 2.2, 1.2].forEach((from) => [-3, -12, -40, -90].forEach((v) => {
    const m = new D.DoorModel({ style: 'rect', locked: false }, rec().sfx);
    m.angle = from; m.vel = v; m.mode = 'free'; m.wake(); let pulledIn = false;
    for (let i = 0; i < 60 * 4; i++) { m.update(1 / 60); if (m.angle > 0.6 && m.handle.a > 22 * 0.8) pulledIn = true; }
    assert.ok(m.angle < 0.3, 'from ' + from + ' at ' + v + ': shut (' + m.angle.toFixed(2) + ')');
    assert.ok(m.handle.a < 1, 'latch out (' + m.handle.a.toFixed(2) + ')');
    if (from > 1.5 && v >= -12) assert.ok(pulledIn, 'from ' + from + ' at ' + v + ': the latch was pulled in while the leaf swung through the strike');
  }));
});

test('a door opened again while it is closing lets go of the close: it opens, the handle is not stuck down', () => {
  const m = new D.DoorModel({ style: 'rect', locked: false }, rec().sfx);
  m.open(); run(m, 3.5); m.close(); run(m, 0.35); m.open(); run(m, 3);
  assert.ok(Math.abs(m.angle - 105) < 0.8, 'opened again (' + m.angle.toFixed(1) + ')');
  assert.ok(m.handle.a < 1 && !m.handle.carry && !m.handle.hold, 'handle let go (' + m.handle.a.toFixed(2) + ')');
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

test('sounds: a skin can choose the sound profile (wood, metal, tech, glass), whatever the style says', () => {
  const near = { x: -2, z: -8 };
  ['wood', 'metal', 'tech', 'glass'].forEach((kind) => {
    const g = fakeEnv(), s = D.createSfx(() => g.env, () => near), m = new D.DoorModel({ style: 'rect', sound: kind }); m.pos = { x: -4.6, y: 1.2, z: -8 };
    assert.equal(m.cfg.sound, kind);
    ['handleDown', 'latchRetract', 'handleReturn', 'latch', 'rattle', 'thud', 'slam', 'stop', 'seal', 'knock'].forEach((k) => s[k](m, k === 'rattle' ? 1 : 0.7));
    s.bolt(m, true); s.bolt(m, false);
    assert.ok(s._log().length >= 10, kind);
    m._snd = null; s.creak(m, 60); assert.ok(m._snd, kind + ' creak voice');
  });
  assert.equal(new D.DoorModel({ style: 'rect', sound: 'nonsense' }).cfg.sound, '', 'unknown sound names are ignored');
  assert.equal(new D.DoorModel({ style: 'rect' }).cfg.sound, '', 'no sound set: the style decides');
  // glass knocks make more sound sources than the same knock on wood (the chime)
  const count = (kind) => { const g = fakeEnv(), s = D.createSfx(() => g.env, () => near), m = new D.DoorModel({ style: 'rect', sound: kind }); m.pos = { x: -4.6, y: 1.2, z: -8 }; s.knock(m); return g.made.sources; };
  assert.ok(count('glass') > count('wood'), 'glass rings');
});

test('sounds: a burst of events is capped by the voice budget', () => {
  const g = fakeEnv(), s = D.createSfx(() => g.env, () => ({ x: -2, z: -8 })), d = dm(-4.6, -8);
  for (let i = 0; i < 60; i++) s.latch(d, 1);
  assert.ok(s._log().length <= 16, 'at most 16 in a hundred milliseconds, got ' + s._log().length);
});

test('every handle lies inside its leaf: its hardware never reaches the leaf edge or the top or foot of the door, for every style at several sizes', () => {
  for (const n of D.STYLE_NAMES) {
    for (const [w, h] of [[undefined, undefined], [60, 140], [90, 200], [200, 260], [320, 360]]) {
      const G = D.layoutOf(n, w, h);
      if (G.nL > 1 && G.W < 120) continue;   // a pair of leaves under 60 units each is not a door anyone builds
      const type = D.HW.of(G.S), sc = D.HW.scale(G.S), E = D.HW.EXTENT[type];
      for (const L of G.leaves) {
        // the handle's own extent: toward the hinge, away from it, below and above the spindle (the neon lever keeps its old rule)
        const toward = E[1] * sc, away = E[0] * sc;
        const lo = L.hinge === 'R' ? L.hx - away : L.hx - toward, hi = L.hinge === 'R' ? L.hx + toward : L.hx + away;
        assert.ok(lo >= L.x0 + 3 && hi <= L.x1 - 3, `${n} ${w}x${h} leaf ${L.i} (${type}): handle spans ${lo.toFixed(1)}..${hi.toFixed(1)} but the leaf is ${L.x0.toFixed(1)}..${L.x1.toFixed(1)}`);
        assert.ok(G.hy - E[3] * sc >= 3 && G.hy + E[2] * sc <= G.H - 3, `${n} ${w}x${h} (${type}): the handle fits between the top and the foot (${(G.hy - E[3] * sc).toFixed(1)}..${(G.hy + E[2] * sc).toFixed(1)} of ${G.H})`);
        const mult = G.S.handle === 'bar' ? 1.25 : 1, len = L.Lh * mult, a = L.hx, b = L.hinge === 'R' ? L.hx + len : L.hx - len;   // the neon wireframe lever, as before
        const lo2 = Math.min(a, b) - 9, hi2 = Math.max(a, b) + 9;
        assert.ok(lo2 >= L.x0 + 3 && hi2 <= L.x1 - 3, `${n} ${w}x${h} leaf ${L.i}: neon handle spans ${lo2.toFixed(1)}..${hi2.toFixed(1)}`);
      }
    }
  }
});

test('hardware: every door style has a handle type, each type is used, and the table is consistent', () => {
  assert.deepEqual(Object.keys(D.HW.HANDLE_OF).sort(), D.STYLE_NAMES.slice().sort(), 'every style is mapped, and nothing else');
  const used = new Set(D.STYLE_NAMES.map((n) => D.HW.of(D.STYLES[n])));
  D.HW.TYPES.forEach((t) => assert.ok(used.has(t), 'handle type ' + t + ' is used by some door style'));
  used.forEach((t) => assert.ok(D.HW.EXTENT[t] && D.HW.EXTENT[t].length === 4 && D.HW.EXTENT[t].every((v) => v > 0), t + ' has an extent'));
  assert.equal(D.HW.of({ name: 'no-such-style' }), 'lever', 'an unknown style gets the classic lever');
  assert.equal(D.HW.of({ name: 'rect', hw: 'wheel' }), 'wheel', 'a style can name its own hardware');
  assert.equal(D.HW.of({ name: 'rect', hw: 'nonsense' }), 'lever', 'an unknown hardware name falls back');
  const want = { rect: 'lever', tall: 'plate', wide: 'barn', arch: 'cranked', gothic: 'ring', circle: 'wheel', oval: 'tee', industrial: 'heavy', vintage: 'knob', scifi: 'touch' };
  Object.keys(want).forEach((n) => assert.equal(D.HW.of(D.STYLES[n]), want[n], n + ' hardware'));
});
