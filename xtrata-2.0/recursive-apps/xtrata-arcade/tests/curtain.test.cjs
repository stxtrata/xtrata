// Tests for src/parts/curtain.js (phase 3a: the house curtain). No browser and no canvas needed
// for the cloth maths; the renderer is checked with a recording stub context.
// Run: node --test tests/curtain.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const vm = require('vm');
// Load curtain.js the way the hall does: as a plain script (the repo's package.json makes .js files ES modules,
// so require() cannot be used). It exposes window.XACurtain, and module.exports when a CommonJS module exists.
const sandbox = { module: { exports: {} }, Math, Float64Array, Int8Array, Number, Array, Object, isFinite };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'parts', 'curtain.js'), 'utf8'), sandbox);
const { CFG, createCurtainSim, createCurtainRenderer, readParams } = sandbox.module.exports;

const W = 512, H = 580;
const approx = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg || ''} expected ${b} +/- ${tol}, got ${a}`);
// Run until asleep (bounded). Returns the sim-seconds it took.
function settle(sim, maxSeconds = 20) {
  let n = 0; const max = Math.round(maxSeconds / CFG.step);
  while (!sim.isAsleep() && n < max) { sim.stepFixed(); n++; }
  return n * CFG.step;
}
const finite = (sim) => sim.panels.every((p) => [p.x, p.y, p.vx].every((a) => a.every(Number.isFinite)));

test('draft constants are unchanged', () => {
  assert.equal(CFG.rows, 20); assert.equal(CFG.fullness, 1.3); assert.equal(CFG.gather, 0.075);
  assert.equal(CFG.gravity, 3.2); assert.equal(CFG.damping, 2.5); assert.equal(CFG.linkDamping, 6);
  assert.equal(CFG.hemWeight, 2); assert.equal(CFG.bend, 500); assert.equal(CFG.airDrag, 5);
  assert.equal(CFG.dryFriction, 0.003); assert.equal(CFG.step, 1 / 240); assert.equal(CFG.pleatIters, 4);
  assert.equal(CFG.holdFriction, 0.11); assert.equal(CFG.railFollow, 0.5); assert.equal(CFG.grab, 0.7); assert.equal(CFG.reach, 0.985);
  assert.ok(Object.isFrozen(CFG));
});

test('closed curtain settles, sleeps, and meets in the middle', () => {
  const sim = createCurtainSim({ width: W, height: H, openness: 0 });
  assert.equal(sim.isAsleep(), false);
  const t = settle(sim);
  assert.ok(sim.isAsleep(), 'went to sleep');
  assert.ok(t < 10, 'slept within 10 s of sim time, took ' + t);
  assert.ok(finite(sim));
  approx(sim.getOpenAmount(), 0, 0.001, 'closed');
  // leading edges overlap the centre line by the draft's overlap (min(W*0.015,16) = 7.68)
  const [l, r] = sim.edges();
  approx(l, W / 2 + 7.68, 0.5, 'left half edge'); approx(r, W / 2 - 7.68, 0.5, 'right half edge');
  assert.ok(l > r, 'halves overlap');
  // asleep: update does nothing and says no redraw is needed
  assert.equal(sim.update(0.016), false);
  assert.equal(sim.stepFixed(), false);
});

test('open and half-open settle at their extents', () => {
  const open = createCurtainSim({ width: W, height: H, openness: 1 });
  settle(open); assert.ok(open.isAsleep());
  approx(open.getOpenAmount(), 1, 0.001, 'open');
  for (const p of open.panels) approx(p.dir * (p.x[p.N - 1] - p.wall), p.cumMin[p.N - 1], 0.5, 'gathered at the wall');
  const [l, r] = open.edges();
  assert.ok(l < W * 0.15 && r > W * 0.85, `fully gathered to the sides, got ${l.toFixed(1)} / ${r.toFixed(1)}`);

  const half = createCurtainSim({ width: W, height: H, openness: 0.5 });
  settle(half); assert.ok(half.isAsleep());
  approx(half.getOpenAmount(), 0.5, 0.005, 'half');
  assert.ok(finite(half));
  const [hl, hr] = half.edges();
  assert.ok(hl > l && hl < W / 2 && hr < r && hr > W / 2, 'half sits between open and closed');
});

test('open/close animation reaches the target and sleeps', () => {
  const sim = createCurtainSim({ width: W, height: H });
  settle(sim);
  sim.open();
  assert.ok(sim.isAnimating() && !sim.isAsleep());
  settle(sim);
  assert.ok(sim.isAsleep() && !sim.isAnimating());
  approx(sim.getOpenAmount(), 1, 0.005, 'opened');
  sim.toggle(); settle(sim);
  approx(sim.getOpenAmount(), 0, 0.005, 'toggled shut');
  // speed scales the animation: a faster curtain finishes sooner
  const slow = createCurtainSim({ width: W, height: H, speed: 0.5 }), fast = createCurtainSim({ width: W, height: H, speed: 4 });
  slow.open(); fast.open();
  const count = (s) => { let n = 0; while (s.isAnimating() && n < 20 / CFG.step) { s.stepFixed(); n++; } return n; };
  assert.ok(count(fast) < count(slow) / 3, 'speed 4 is much quicker than speed 0.5');
});

test('grab, pull and release: the cloth follows, then comes to rest and sleeps', () => {
  const sim = createCurtainSim({ width: W, height: H, openness: 0 });
  settle(sim);
  // grab the right half's leading edge (uv near the middle, low down), pull right 40%... then release
  const [, redge] = sim.edges();
  const gy = sim.height * 0.55;
  assert.equal(sim.hitTestUV(0.5, 0.55), true, 'fabric under the middle');
  assert.equal(sim.grab(redge + 2, gy), true);
  assert.ok(sim.isDragging());
  const x0 = redge;
  for (let i = 0; i < 360; i++) { sim.moveGrab(x0 + 140 * Math.min(1, i / 240)); sim.stepFixed(); }
  const pulled = sim.getOpenAmount();
  assert.ok(pulled > 0.1, 'pulling opened it, openness ' + pulled);
  assert.ok(!sim.isAsleep(), 'does not sleep while held');
  sim.release();
  assert.ok(!sim.isDragging());
  settle(sim);
  assert.ok(sim.isAsleep(), 'sleeps after release');
  assert.ok(finite(sim));
  // the rail stays where the hand left it: no creeping back
  const rest = sim.getOpenAmount();
  sim.advance(2);
  approx(sim.getOpenAmount(), rest, 1e-9, 'rail locked once released');
  assert.ok(rest > 0.05 && rest <= pulled + 0.02, `stays opened by the pull (${rest.toFixed(3)} vs ${pulled.toFixed(3)})`);
});

test('grabbing the empty gap grabs nothing; a grab takes over from open/close', () => {
  const sim = createCurtainSim({ width: W, height: H, openness: 1 });
  settle(sim);
  assert.equal(sim.hitTestUV(0.5, 0.5), false, 'the open middle is empty');
  assert.equal(sim.grabUV(0.5, 0.5), false);
  assert.equal(sim.isDragging(), false);
  assert.equal(sim.grab(5, 0), false, 'the pelmet is not fabric');
  sim.close();
  for (let i = 0; i < 100; i++) sim.stepFixed();
  const [l] = sim.edges();
  assert.equal(sim.grab(l - 4, sim.height * 0.6), true, 'grabbed a half while it was closing');
  assert.equal(sim.isAnimating(), false, 'manual grab cancels the animation');
  sim.release();
  settle(sim); assert.ok(sim.isAsleep());
});

test('setOpenAmount without animation places the cloth at rest and wakes it', () => {
  const sim = createCurtainSim({ width: W, height: H });
  settle(sim); assert.ok(sim.isAsleep());
  sim.setOpenAmount(0.75);
  assert.equal(sim.isAsleep(), false, 'woken');
  approx(sim.getOpenAmount(), 0.75, 1e-6);
  settle(sim); assert.ok(sim.isAsleep());
  approx(sim.getOpenAmount(), 0.75, 0.005);
});

test('invalid params clamp or fall back without throwing', () => {
  const bad = [undefined, null, 5, 'x', [], {}, { width: NaN, height: Infinity, openness: 'abc', speed: -3, ui: 0, color: 'red', trim: 12 },
    { width: -50, height: 1e9, openness: 7, speed: 1e9, ui: 99, color: [999, -5, 'z'], trim: '#12' }];
  for (const b of bad) {
    const sim = createCurtainSim(b);
    sim.advance(0.5);
    assert.ok(finite(sim), 'finite for ' + JSON.stringify(b));
    const pr = sim.params;
    assert.ok(pr.width >= 64 && pr.width <= 4096 && pr.height >= 64 && pr.height <= 4096);
    assert.ok(pr.openness >= 0 && pr.openness <= 1 && pr.speed >= 0.1 && pr.speed <= 5 && pr.ui >= 0.25 && pr.ui <= 4);
    assert.ok(pr.color.length === 3 && pr.color.every((c) => c >= 0 && c <= 255 && Number.isInteger(c)));
    assert.ok(pr.trim.length === 3 && pr.trim.every((c) => c >= 0 && c <= 255 && Number.isInteger(c)));
  }
  // specific clamps
  const p = readParams({ width: -50, height: 1e9, openness: 7, speed: 1e9, color: '#0af', trim: [1, 2, 3] });
  assert.deepEqual([p.width, p.height, p.openness, p.speed], [64, 4096, 1, 5]);
  assert.deepEqual(Array.from(p.color), [0, 170, 255]); assert.deepEqual(Array.from(p.trim), [1, 2, 3]);
  // defaults
  const d = readParams();
  assert.deepEqual([d.width, d.height, d.openness, d.speed, d.ui], [512, 580, 0, 1, 1]);
  assert.deepEqual(Array.from(d.color), [150, 18, 40]);
  // calls with junk do not throw or corrupt state
  const sim = createCurtainSim({ width: W, height: H });
  sim.setOpenAmount('junk'); sim.setOpenAmount(NaN, true); sim.update(NaN); sim.update(-1); sim.update(1e9);
  sim.grab(NaN, 0); sim.grab('a', 'b'); sim.moveGrab(NaN); sim.release(); sim.grabUV(undefined, null); sim.moveGrabUV(NaN);
  sim.resize(NaN, -3); sim.open(NaN); sim.advance(NaN);
  settle(sim); assert.ok(finite(sim));
});

test('resize keeps how open each half is', () => {
  const sim = createCurtainSim({ width: 512, height: 580, openness: 0.6 });
  settle(sim);
  const before = sim.getOpenAmount();
  sim.resize(768, 700);
  assert.equal(sim.width, 768); assert.equal(sim.height, 700);
  approx(sim.getOpenAmount(), before, 0.01);
  settle(sim); assert.ok(sim.isAsleep());
});

test('the sim is deterministic', () => {
  const run = () => {
    const s = createCurtainSim({ width: W, height: H, openness: 0.3 });
    s.open(); s.advance(1.5); s.close(); s.advance(1.2);
    return Array.from(s.panels[0].x.slice(0, 40)).concat(Array.from(s.panels[1].y.slice(-10)));
  };
  assert.deepEqual(run(), run());
});

test('update(dt) at frame rate reaches sleep like fixed stepping', () => {
  const sim = createCurtainSim({ width: W, height: H, openness: 0.4 });
  let frames = 0, redraws = 0;
  while (!sim.isAsleep() && frames < 60 * 30) { if (sim.update(1 / 60)) redraws++; frames++; }
  assert.ok(sim.isAsleep(), 'asleep at frame rate');
  assert.ok(redraws > 0 && redraws === frames, 'every awake frame asks for a redraw (incl. the one that falls asleep)');
  approx(sim.getOpenAmount(), 0.4, 0.005);
});

test('renderer draws through a 2D context stub without throwing, for every state', () => {
  const calls = {};
  const grad = { addColorStop() { } };
  const ctx = new Proxy({}, {
    get(t, k) {
      if (k === 'createLinearGradient') return () => grad;
      return (...a) => { calls[k] = (calls[k] || 0) + 1; };
    },
    set() { return true; }
  });
  for (const o of [0, 0.5, 1]) {
    for (const pal of [{}, { color: '#2a6a3a', trim: '#aab0c0' }]) {
      const sim = createCurtainSim(Object.assign({ width: W, height: H, openness: o }, pal));
      const r = createCurtainRenderer(sim, ctx, { dpr: 2 });
      sim.advance(0.5);
      r.draw();
    }
  }
  assert.ok(calls.fill > 100 && calls.clearRect === 6 && calls.fillRect > 6, JSON.stringify(calls));
});

test('renderer margin: the cloth is drawn offset into a wider picture and the whole picture is cleared', () => {
  const log = [];
  const grad = { addColorStop() { } };
  const ctx = new Proxy({}, {
    get(t, k) { if (k === 'createLinearGradient') return () => grad; return (...a) => { if (k === 'setTransform' || k === 'clearRect') log.push([k, ...a]); }; },
    set() { return true; }
  });
  const sim = createCreatesim();
  function createCreatesim() { return createCurtainSim({ width: W, height: H, openness: 1 }); }
  createCurtainRenderer(sim, ctx, { margin: 100 }).draw();
  assert.deepEqual(log.find((l) => l[0] === 'setTransform'), ['setTransform', 1, 0, 0, 1, 100, 0], 'shifted right by the margin');
  assert.deepEqual(log.find((l) => l[0] === 'clearRect'), ['clearRect', -100, 0, W + 200, H], 'clears margin, cloth and margin');
  log.length = 0; createCurtainRenderer(sim, ctx, {}).draw();
  assert.deepEqual(log.find((l) => l[0] === 'setTransform'), ['setTransform', 1, 0, 0, 1, 0, 0], 'no margin: as before');
});

test('cloth held past a rail end hangs outside the cloth width (so a margin is needed) and stays within the reach of its threads', () => {
  const sim = createCurtainSim({ width: W, height: H, openness: 1 });
  sim.advance(1);
  const q = sim.uvToPx(0.05, 0.8);
  assert.ok(sim.grab(q.x, q.y), 'grabbed the open cloth near the left stack');
  sim.moveGrabUV(-0.2); sim.advance(2);
  const min = Math.min(...Array.from(sim.panels[0].x));
  assert.ok(min < 0, 'some cloth is left of the rail end: ' + min.toFixed(1));
  assert.ok(min > -0.5 * W, 'but not further than half the cloth width (' + (min / W).toFixed(2) + ' of the width)');
});
