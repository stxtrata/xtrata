(() => {
'use strict';
/* ================================================================
   CURTAIN — the house curtain for arcade bays (phase 3a).
   Port of "Curtains 1.html" (Jim's draft). Two halves of hanging-chain cloth on a
   passive rail, with a weight bar in the hem. The physics constants and the
   step() maths are the draft's, unchanged.

   Split in two so the cloth can be tested without a browser:
     createCurtainSim(params)       pure maths, no DOM. Works in a W x H pixel space.
     createCurtainRenderer(sim,ctx) draws the sim onto any 2D canvas context
                                    (transparent background), so the hall can wrap
                                    that canvas in a THREE.CanvasTexture.

   Scene params (all optional, all clamped; bad values fall back to defaults):
     width, height   pixel size of the cloth canvas          (64..4096, default 512 x 580)
     color           cloth colour, '#rrggbb' or [r,g,b]       (default velvet red)
     trim            gold trim colour, same formats           (default gold)
     openness        0 = closed .. 1 = fully gathered         (default 0)
     speed           open/close animation rate multiplier     (0.1..5, default 1)
     ui              scale of the pixel-sized furniture: pelmet, rings, hem, fringe (0.25..4, default 1)

   Loop for the hall:
     const sim = XACurtain.createCurtainSim(params);
     const r   = XACurtain.createCurtainRenderer(sim, canvas.getContext('2d'));
     each frame:  if (sim.update(dt)) { r.draw(); texture.needsUpdate = true; }
     ray hit on the plane, uv in 0..1 (u left to right, v top to bottom of the cloth):
       sim.grabUV(u, v) -> bool;  sim.moveGrabUV(u);  sim.release();
   ================================================================ */

/* ---------------- the draft's constants (unchanged) ---------------- */
const CFG = Object.freeze({
  rows: 20,
  fullness: 1.3,       // fabric width / rail spacing when fully closed (pleat depth)
  gather: 0.075,       // tightest pleat spacing, as a fraction of fabric width
  gravity: 3.2,        // x viewport height per second^2
  damping: 2.5,        // 1/s, air drag on heavy cloth
  linkDamping: 6,      // internal friction along a thread (no whip, no spring-back)
  hemWeight: 2,        // weight bar in the hem, in units of one row of cloth
  bend: 500,           // bending stiffness along a thread (1/s^2)
  airDrag: 5,          // quadratic air drag, extra 1/s at one viewport height per second
  dryFriction: 0.003,  // fabric friction, x viewport height per second^2
  step: 1 / 240,
  pleatIters: 4,
  holdFriction: 0.11,  // a ring slides once the held point is dragged past this slope
  railFollow: 0.5,     // how quickly a freed ring catches up (per step)
  grab: 0.7,           // how tightly the pointer holds the fabric (per step)
  reach: 0.985         // max sideways offset of a link, as a fraction of its length
});
const QUIET_MOTION = 0.003;   // px moved per step below which the cloth counts as still
const QUIET_STEPS = 240;      // that many still steps in a row (1 s of sim time) = asleep
const MAX_FRAME_STEPS = 24;   // the draft's per-frame step cap
const MAX_FRAME_DT = 0.05;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function num(v, lo, hi, def) {
  v = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof v === 'number' && isFinite(v) ? clamp(v, lo, hi) : def;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FROZEN = 0, DRAG = 1, AUTO = 2;

/* ---------------- one curtain half (the draft's Panel) ---------------- */
class Panel {
  /* dir: +1 hangs from a left wall, -1 from a right wall.
     closedEdge: x of the leading edge when fully closed. */
  constructor(o) {
    const N = this.N = o.cols, M = this.M = CFG.rows;
    this.dir = o.dir; this.wall = o.wall; this.lo = o.lo; this.hi = o.hi;
    this.railY = o.railY; this.hemY = o.hemY;
    this.L = (o.hemY - o.railY) / (M - 1);
    this.G = CFG.gravity * o.viewH; this.H = o.viewH;
    // row masses (1 each, the hem row carries the weight bar) and the tension in the link above each row
    this.T = new Float64Array(M + 1); this.im = new Float64Array(M);
    for (let j = M - 1; j >= 0; j--) { const m = 1 + (j === M - 1 ? CFG.hemWeight : 0); this.im[j] = 1 / m; this.T[j] = this.T[j + 1] + m; }
    this.kap = new Float64Array(M + 1);
    this.mode = FROZEN; this.grab = null;

    const rnd = mulberry32(o.seed);
    const span = o.dir * (o.closedEdge - o.wall);
    const raw = [], n1 = N - 1; let sum = 0;
    for (let i = 0; i < n1; i++) { const r = 0.8 + 0.4 * rnd(); raw.push(r); sum += r; }
    this.maxS = new Float64Array(n1); this.minS = new Float64Array(n1);
    this.rest = new Float64Array(n1); this.sign = new Int8Array(n1);
    this.cumMin = new Float64Array(N); this.cumMax = new Float64Array(N);
    for (let i = 0; i < n1; i++) {
      this.maxS[i] = span * raw[i] / sum;
      this.rest[i] = this.maxS[i] * CFG.fullness;
      this.minS[i] = this.rest[i] * CFG.gather;
      this.sign[i] = i % 2 ? 1 : -1;
      this.cumMin[i + 1] = this.cumMin[i] + this.minS[i];
      this.cumMax[i + 1] = this.cumMax[i] + this.maxS[i];
    }
    const n = N * M;
    this.x = new Float64Array(n); this.y = new Float64Array(n);
    this.vx = new Float64Array(n); this.x0 = new Float64Array(n);
    this.motion = 0;
  }

  /* rail ring positions for openness u (0 = closed, 1 = fully gathered) */
  railAt(u) {
    const r = new Float64Array(this.N); r[0] = this.wall;
    for (let i = 1; i < this.N; i++) r[i] = this.wall + this.dir * lerp(this.cumMax[i], this.cumMin[i], u);
    return r;
  }
  setOpenness(u) {
    const r = this.railAt(u), N = this.N;
    for (let j = 0; j < this.M; j++) for (let i = 0; i < N; i++) {
      const k = j * N + i;
      this.x[k] = this.x0[k] = r[i]; this.vx[k] = 0;
      this.y[k] = this.railY + j * this.L;
    }
  }
  openness() {
    const N = this.N, D = this.dir * (this.x[N - 1] - this.wall);
    return clamp((this.cumMax[N - 1] - D) / (this.cumMax[N - 1] - this.cumMin[N - 1]), 0, 1);
  }

  beginGrab(ptrX, ptrY) {
    let best = -1, bd = Infinity;
    for (let k = 0; k < this.x.length; k++) {
      const dx = this.x[k] - ptrX, dy = this.y[k] - ptrY, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = k; }
    }
    this.grab = { k: best, ox: this.x[best] - ptrX, tx: this.x[best] };
    this.mode = DRAG;
    return best;
  }
  moveGrab(ptrX) { if (this.grab) this.grab.tx = ptrX + this.grab.ox; }
  endGrab() { this.grab = null; this.mode = FROZEN; }

  /* ---- one fixed physics step ---- */
  step(dt) {
    const N = this.N, M = this.M, x = this.x, y = this.y, vx = this.vx, x0 = this.x0;
    const dir = this.dir, wall = this.wall, L = this.L, G = this.G, size = N * M;
    const minS = this.minS, maxS = this.maxS;
    const drag = this.mode === DRAG, gr = this.grab, gk = gr ? gr.k : -1;
    const damp = Math.exp(-CFG.damping * dt), cs = CFG.linkDamping * dt, GL = G / L;

    for (let k = 0; k < size; k++) x0[k] = x[k];

    // 1. forces on every thread: gravity (pendulum chain, tension = weight below each link),
    //    bending stiffness, internal friction, air drag, dry friction
    const T = this.T, im = this.im, kap = this.kap, kb = CFG.bend;
    const air = CFG.airDrag / this.H, fr = CFG.dryFriction * this.H * dt;
    for (let i = 0; i < N; i++) {
      // curvature of the thread; the ghost node above the ring hangs straight down (upright header)
      for (let j = 0; j < M - 1; j++) kap[j] = (j ? x[(j - 1) * N + i] : x[i]) - 2 * x[j * N + i] + x[(j + 1) * N + i];
      kap[M - 1] = 0; kap[M] = 0;
      for (let j = 1; j < M; j++) {
        const k = j * N + i, tu = T[j], td = T[j + 1], m1 = im[j];
        let a = tu * (x[k - N] - x[k]), rel = tu * (vx[k - N] - vx[k]);
        if (td > 0) { a += td * (x[k + N] - x[k]); rel += td * (vx[k + N] - vx[k]); }
        const bend = kap[j - 1] - 2 * kap[j] + (j + 1 < M - 1 ? kap[j + 1] : 0);
        const lc = Math.min(cs, 0.9 / (tu + td));
        let v = (vx[k] + (a * m1 * GL - kb * bend) * dt + rel * m1 * lc) * damp;
        const s = Math.abs(v);
        v /= 1 + air * s * dt;
        const s2 = s / (1 + air * s * dt);
        vx[k] = s2 > fr ? (v > 0 ? v - fr : v + fr) : 0;
      }
    }
    // 2. predict
    for (let k = N; k < size; k++) x[k] += vx[k] * dt;

    // 3. the pointer holds the fabric
    if (gr) {
      if (gk < N) {                                       // holding a ring itself
        const nx = x[gk] + (gr.tx - x[gk]) * CFG.grab;
        x[gk] = wall + dir * clamp(dir * (nx - wall), this.cumMin[gk], this.cumMax[gk]);
      } else x[gk] += (gr.tx - x[gk]) * CFG.grab;
    }

    // 4. pleat spacing between neighbouring threads (1D per row, alternating sweeps)
    for (let it = 0; it < CFG.pleatIters; it++) {
      const fwd = (it & 1) === 0;
      for (let j = 1; j < M; j++) {
        const base = j * N;
        for (let ii = 0; ii < N - 1; ii++) {
          const i = fwd ? ii : N - 2 - ii, a = base + i, b = a + 1;
          const d = dir * (x[b] - x[a]);
          if (d >= minS[i] && d <= maxS[i]) continue;
          const c = (d - (d > maxS[i] ? maxS[i] : minS[i])) * dir;
          const wa = a === gk ? 0 : 1, wb = b === gk ? 0 : 1, s = c / (wa + wb);
          x[a] += s * wa; x[b] -= s * wb;
        }
      }
    }

    // 5. rail rings: friction, then exact 1D ordering/spacing
    const lim = CFG.reach * L, L2 = L * L;
    if (drag && gr) {
      let lead = gk;
      if (gk >= N) {
        lead = gk % N;
        // the pull travels up the held thread (taut thread cannot be longer than it is)
        for (let j = (gk / N) | 0; j >= 1; j--) {
          const k = j * N + lead; const dx = x[k] - x[k - N];
          if (dx > lim) x[k - N] = x[k] - lim; else if (dx < -lim) x[k - N] = x[k] + lim;
        }
        // The held thread's ring slides only when the HAND drags it past the friction angle.
        // It depends on the hand position alone, so a still hand can never keep the rail creeping.
        if (lead > 0) {
          const h = Math.max(((gk / N) | 0) * L, 1), off = x[gk] - x[lead], free = CFG.holdFriction * h;
          if (Math.abs(off) > free) x[lead] += (off - Math.sign(off) * free) * CFG.railFollow;
        }
      }
      for (let i = lead - 1; i >= 1; i--) {
        const D = dir * (x[i] - wall), Dn = dir * (x[i + 1] - wall);
        x[i] = wall + dir * clamp(D, Dn - maxS[i], Dn - minS[i]);
      }
      for (let i = 1; i < N; i++) {
        const Dp = dir * (x[i - 1] - wall), D = dir * (x[i] - wall);
        x[i] = wall + dir * clamp(D, Dp + minS[i - 1], Dp + maxS[i - 1]);
      }
    }
    for (let i = 1; i < N; i++) x[i] = wall + dir * clamp(dir * (x[i] - wall), this.cumMin[i], this.cumMax[i]);

    // 6. links keep their length: limit sideways offset, then lift y accordingly
    for (let i = 0; i < N; i++) {
      y[i] = this.railY;
      for (let j = 1; j < M; j++) {
        const k = j * N + i; let dx = x[k] - x[k - N];
        if (dx > lim) x[k] = x[k - N] + (dx = lim); else if (dx < -lim) x[k] = x[k - N] + (dx = -lim);
        y[k] = y[k - N] + Math.sqrt(L2 - dx * dx);
      }
    }

    // the cloth never leaves the picture the hall draws it on (only matters when a reach limit is set)
    if (this.lo > -Infinity) for (let k = N; k < size; k++) { if (x[k] < this.lo) x[k] = this.lo; else if (x[k] > this.hi) x[k] = this.hi; }

    // 7. velocities from what actually happened
    let m = 0;
    for (let k = N; k < size; k++) {
      const d = x[k] - x0[k]; vx[k] = d / dt;
      const a = Math.abs(d); if (a > m) m = a;
    }
    for (let i = 0; i < N; i++) { vx[i] = 0; const a = Math.abs(x[i] - x0[i]); if (a > m) m = a; }
    this.motion = m;
  }

  sleep() { this.vx.fill(0); this.x0.set(this.x); this.motion = 0; }
}

/* ---------------- colour helpers ---------------- */
const DEFAULT_COLOR = [150, 18, 40];       // velvet red (the draft's BASE)
const DEFAULT_TRIM = [201, 154, 69];       // the draft's GOLD, #c99a45
function parseColor(v, def) {
  if (Array.isArray(v) && v.length >= 3) {
    const a = v.slice(0, 3).map(Number);
    if (a.every(isFinite)) return a.map(c => clamp(Math.round(c), 0, 255));
    return def.slice();
  }
  if (typeof v === 'string') {
    const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v.trim());
    if (m) {
      let h = m[1]; if (h.length === 3) h = h.replace(/./g, '$&$&');
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
  }
  return def.slice();
}
const same = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
const rgb = c => 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')';
const mix = (c, d, t) => [lerp(c[0], d[0], t), lerp(c[1], d[1], t), lerp(c[2], d[2], t)];
const mul = (c, f) => [clamp(c[0] * f, 0, 255), clamp(c[1] * f, 0, 255), clamp(c[2] * f, 0, 255)];

/* The default colours are the draft's literals, so the default look is the draft exactly.
   A custom colour or trim derives the same roles from the given colour. */
function makePalette(color, trim) {
  const p = {
    base: color,
    pelmet: ['#2b0912', '#5c1527', '#3a0d1a'],
    gold: '#c99a45', goldLight: '#f0cd82', goldDark: '#8a6425',
    fringe: 'rgba(214,170,82,.9)', pelmetLine: 'rgba(240,205,130,.55)', ringEdge: '#6b4a14'
  };
  if (!same(color, DEFAULT_COLOR)) p.pelmet = [rgb(mul(color, 0.29)), rgb(mul(color, 0.62)), rgb(mul(color, 0.4))];
  if (!same(trim, DEFAULT_TRIM)) {
    const l = mix(trim, [255, 255, 255], 0.35);
    p.gold = rgb(trim); p.goldLight = rgb(l); p.goldDark = rgb(mul(trim, 0.69));
    p.fringe = 'rgba(' + (mix(trim, [255, 255, 255], 0.1).map(c => c | 0).join(',')) + ',.9)';
    p.pelmetLine = 'rgba(' + (l.map(c => c | 0).join(',')) + ',.55)';
    p.ringEdge = rgb(mul(trim, 0.53));
  }
  return p;
}

/* ---------------- clamp scene params ---------------- */
function readParams(p) {
  p = p && typeof p === 'object' ? p : {};
  return {
    width: Math.round(num(p.width, 64, 4096, 512)),
    height: Math.round(num(p.height, 64, 4096, 580)),
    color: parseColor(p.color, DEFAULT_COLOR),
    trim: parseColor(p.trim, DEFAULT_TRIM),
    openness: num(p.openness, 0, 1, 0),
    speed: num(p.speed, 0.1, 5, 1),
    ui: num(p.ui, 0.25, 4, 1),
    reach: num(p.reach, 0, 4096, 0)     // px the cloth may swing past each rail end (0 = no limit); the hall draws that much margin
  };
}

/* ================================================================
   THE SIM — no DOM, no canvas
   ================================================================ */
function createCurtainSim(params) {
  const prm = readParams(params);
  let W = 0, H = 0, pelmetH = 40, railY = 36, hemY = 0;
  let panels = [];
  let drag = null;        // active manual grab { p }
  let anim = null;        // OPEN/CLOSE driver: a separate path, never mixed with dragging
  let asleep = false, quiet = 0, acc = 0;

  function build(w, h, openness) {
    const prev = openness ? [openness, openness] : (panels.length ? panels.map(p => p.openness()) : [0, 0]);
    W = w; H = h;
    pelmetH = clamp(H * 0.06, 32 * prm.ui, 54 * prm.ui);
    railY = pelmetH - 4 * prm.ui;
    hemY = H - clamp(H * 0.035, 14 * prm.ui, 28 * prm.ui);
    const cols = clamp(Math.round(W / 2 / 24), 9, 34);
    const ov = Math.min(W * 0.015, 16);
    panels = [
      new Panel({ dir: 1, wall: 0, closedEdge: W / 2 + ov, railY, hemY, cols, seed: 11, viewH: H, lo: prm.reach ? -prm.reach : -Infinity, hi: prm.reach ? W + prm.reach : Infinity }),
      new Panel({ dir: -1, wall: W, closedEdge: W / 2 - ov, railY, hemY, cols, seed: 23, viewH: H, lo: prm.reach ? -prm.reach : -Infinity, hi: prm.reach ? W + prm.reach : Infinity })
    ];
    panels.forEach((p, i) => p.setOpenness(prev[i]));
    drag = null; anim = null; acc = 0;
    wake();
  }
  const wake = () => { asleep = false; quiet = 0; };
  const avgOpen = () => panels.reduce((s, p) => s + p.openness(), 0) / panels.length;

  /* ---------- OPEN / CLOSE (automatic; entirely separate from dragging) ---------- */
  function startAuto(target, speed) {
    if (drag) return;
    const du = Math.max(...panels.map(p => Math.abs(p.openness() - target)));
    const sp = num(speed, 0.1, 5, prm.speed);
    anim = {
      t: 0, target, dur: (0.7 + 1.7 * du) / sp,
      from: panels.map(p => Float64Array.from(p.x.subarray(0, p.N))),
      to: panels.map(p => p.railAt(target))
    };
    panels.forEach(p => { p.grab = null; p.mode = AUTO; });
    wake();
  }
  function driveAuto() {
    anim.t += CFG.step;
    const k = Math.min(1, anim.t / anim.dur);
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    panels.forEach((p, i) => {
      const f = anim.from[i], t = anim.to[i];
      for (let r = 1; r < p.N; r++) p.x[r] = f[r] + (t[r] - f[r]) * e;
    });
    if (k >= 1) { anim = null; panels.forEach(p => { p.mode = FROZEN; }); }
  }

  /* one fixed physics step (the draft's simStep) */
  function simStep() {
    if (anim) driveAuto();
    let m = 0;
    for (const p of panels) { p.step(CFG.step); if (p.motion > m) m = p.motion; }
    if (!drag && !anim && m < QUIET_MOTION) {
      if (++quiet > QUIET_STEPS) { panels.forEach(p => p.sleep()); asleep = true; }   // settled: freeze exactly
    } else quiet = 0;
  }

  /* ---------- picking (the draft's hitPanel / pick; px,py in cloth pixels) ---------- */
  function hitPanel(p, px, py) {
    if (py < pelmetH * 0.85 || p.dir * (px - p.wall) < -4) return false;
    const N = p.N, M = p.M;
    for (let j = 0; j < M - 1; j++) {
      const a = j * N + N - 1, b = a + N;
      if (py >= p.y[a] && py <= p.y[b]) {
        const t = (py - p.y[a]) / (p.y[b] - p.y[a] || 1);
        return p.dir * (px - (p.x[a] + (p.x[b] - p.x[a]) * t)) <= 3;   // between the wall and the leading edge
      }
    }
    return false;
  }
  const pick = (px, py) => (hitPanel(panels[1], px, py) ? panels[1] : hitPanel(panels[0], px, py) ? panels[0] : null);

  build(prm.width, prm.height, prm.openness);

  const sim = {
    params: prm,
    get width() { return W; },
    get height() { return H; },
    get pelmetH() { return pelmetH; },
    get railY() { return railY; },
    get panels() { return panels; },

    /* Advance by dt seconds (frame time). Returns true if the cloth was simulated,
       i.e. the canvas needs redrawing. Once asleep it does nothing and returns false. */
    update(dt) {
      if (asleep) return false;
      dt = num(dt, 0, MAX_FRAME_DT, 0.016);       // the draft caps a frame at 50 ms
      acc += dt; let n = 0;
      while (acc >= CFG.step && n < MAX_FRAME_STEPS) { simStep(); acc -= CFG.step; n++; if (asleep) break; }
      if (n === MAX_FRAME_STEPS) acc = 0;
      return true;
    },
    /* One fixed 1/240 s step. Returns false if asleep. For tests and offline settling. */
    stepFixed() { if (asleep) return false; simStep(); return true; },
    /* Run for `seconds` of sim time (stops early when the cloth goes to sleep). */
    advance(seconds) {
      const n = Math.round(num(seconds, 0, 600, 0) / CFG.step);
      for (let i = 0; i < n && !asleep; i++) simStep();
      return this;
    },
    isAsleep() { return asleep; },
    wake,

    /* openness 0 (closed) .. 1 (fully gathered). With animate the rings glide there at the
       draft's open/close pace (x speed); without, the cloth is placed there at rest. */
    setOpenAmount(u, animate, speed) {
      u = num(u, 0, 1, 0);
      if (animate) { startAuto(u, speed); return sim; }
      anim = null; drag = null;
      panels.forEach(p => { p.grab = null; p.mode = FROZEN; p.setOpenness(u); });
      wake();
      return sim;
    },
    getOpenAmount() { return avgOpen(); },
    open(speed) { return sim.setOpenAmount(1, true, speed); },
    close(speed) { return sim.setOpenAmount(0, true, speed); },
    toggle(speed) { return sim.setOpenAmount(anim ? (anim.target ? 0 : 1) : (avgOpen() > 0.5 ? 0 : 1), true, speed); },
    isAnimating() { return !!anim; },
    isDragging() { return !!drag; },

    /* Grab by cloth pixel (the draft's pointerdown). Returns true if fabric was under the point. */
    grab(px, py) {
      if (drag) return false;
      px = num(px, -1e6, 1e6, NaN); py = num(py, -1e6, 1e6, NaN);
      if (px !== px || py !== py) return false;
      const p = pick(px, py);
      if (!p) return false;
      anim = null;                                       // a manual grab always takes over from OPEN/CLOSE
      panels.forEach(q => { q.mode = FROZEN; q.grab = null; });
      p.beginGrab(px, py);
      drag = { p };
      wake();
      return true;
    },
    moveGrab(px) {
      if (!drag) return;
      px = num(px, -1e6, 1e6, NaN); if (px !== px) return;
      drag.p.moveGrab(px); wake();
    },
    release() {
      if (!drag) return;
      drag.p.endGrab();                                  // rail locks; nothing keeps moving it
      drag = null; wake();
    },

    /* Ray-to-cloth helpers. A raycast against the plane that carries the canvas texture gives a
       uv; u runs left to right and v TOP to bottom of the cloth (use 1 - uv.y for a Three.js
       PlaneGeometry uv with flipY off, or uv.y as-is with the default texture flip). */
    uvToPx(u, v) { return { x: num(u, -1e3, 1e3, 0) * W, y: num(v, -1e3, 1e3, 0) * H }; },
    hitTestUV(u, v) { const q = sim.uvToPx(u, v); return !!pick(q.x, q.y); },
    grabUV(u, v) { const q = sim.uvToPx(u, v); return sim.grab(q.x, q.y); },
    moveGrabUV(u) { sim.moveGrab(num(u, -1e3, 1e3, 0) * W); },

    /* Rebuild at a new canvas size, keeping how open each half is. */
    resize(w, h) {
      build(Math.round(num(w, 64, 4096, W)), Math.round(num(h, 64, 4096, H)), 0);
      return sim;
    },
    /* Leading edge of each half in cloth px (x of the last thread, hem row removed). Handy for layout/tests. */
    edges() { return panels.map(p => p.x[p.N - 1]); }
  };
  return sim;
}

/* ================================================================
   THE RENDERER — draws the sim to a 2D context (transparent background)
   ================================================================ */
function createCurtainRenderer(sim, ctx, opts) {
  opts = opts || {};
  const pal = makePalette(sim.params.color, sim.params.trim), ui = sim.params.ui;
  let dpr = num(opts.dpr, 0.25, 4, 1);
  // margin: px of canvas on each side of the cloth's own width, so cloth pulled past the rail ends is still drawn
  // (the canvas is then sim.width + 2 * margin wide and the cloth sits in the middle of it)
  const margin = Math.round(num(opts.margin, 0, 4096, 0));
  let overlay = null, overlayFor = '';
  const PI = Math.PI;

  /* light falloff over the whole cloth (draft: built once per size) */
  function makeOverlay() {
    const W = sim.width, H = sim.height, pelmetH = sim.pelmetH;
    const key = W + 'x' + H + ':' + pelmetH;
    if (overlay && overlayFor === key) return;
    const hemY = H - clamp(H * 0.035, 14 * ui, 28 * ui);
    overlay = ctx.createLinearGradient(0, 0, 0, H);
    const f = v => clamp(v / H, 0, 1);
    overlay.addColorStop(0, 'rgba(0,0,0,.78)');
    overlay.addColorStop(f(pelmetH + 6), 'rgba(0,0,0,.62)');
    overlay.addColorStop(f(pelmetH + H * 0.34), 'rgba(0,0,0,0)');
    overlay.addColorStop(f(hemY - H * 0.12), 'rgba(0,0,0,0)');
    overlay.addColorStop(1, 'rgba(0,0,0,.34)');
    overlayFor = key;
  }

  function edgeShadow(p) {
    const N = p.N, M = p.M, FAR = 6000;            // stroke far off-screen; only its shadow lands on the stage
    ctx.save();
    ctx.beginPath();
    for (let j = 0; j < M; j++) { const k = j * N + N - 1; j ? ctx.lineTo(p.x[k] - FAR, p.y[k]) : ctx.moveTo(p.x[k] - FAR, p.y[k]); }
    ctx.lineWidth = 6 * ui; ctx.lineJoin = 'round'; ctx.strokeStyle = '#000';
    ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 36 * ui * dpr; ctx.shadowOffsetX = (FAR + 12 * ui * p.dir) * dpr;
    ctx.stroke();
    ctx.restore();
  }

  /* brightness of the cloth averaged over [t0,t1] across a pleat (0 = left edge, 1 = right edge).
     Using the exact average means any subdivision gives the same colours, so nothing steps. */
  function foldF(w, rest, sg, wb, t0, t1) {
    let cc = w / rest; cc = cc > 1 ? 1 : cc < 0.04 ? 0.04 : cc;           // how flat this pleat is pulled
    const s = Math.sqrt(1 - cc * cc), dt = t1 - t0;                        // s = fold depth
    const att = w < 1.5 ? 0.25 : w < 6 ? 0.25 + 0.75 * (w - 1.5) / 4.5 : 1;   // calm very thin pleats
    const u0 = 1 - t0, u1 = 1 - t1;
    const sinAvg = (Math.cos(PI * t0) - Math.cos(PI * t1)) / (PI * dt);
    const edgeAvg = ((t1 * t1 * t1 * t1 - t0 * t0 * t0 * t0) + (u1 * u1 * u1 * u1 - u0 * u0 * u0 * u0)) / (4 * dt);
    // rounded fold: tilt is strongest mid-pleat and neutral at crest/valley; valleys occlude, crests catch light
    let lit = 0.8 * cc + s * wb * sg * (0.55 * sinAvg + 0.22 * edgeAvg);
    lit = 0.62 + (lit - 0.62) * att;
    const f = (0.3 + 0.95 * lit) * (0.72 + 0.28 * Math.min(cc / 0.5, 1));
    return f < 0.1 ? 0.1 : f > 1.25 ? 1.25 : f;
  }
  const BASE = pal.base;
  function setFill(f) {
    const hl = f > 0.95 ? (f - 0.95) * 70 : 0;                              // velvet sheen
    ctx.fillStyle = 'rgb(' + Math.min(255, BASE[0] * f + hl | 0) + ',' + Math.min(255, BASE[1] * f + hl * 0.35 | 0) + ',' + Math.min(255, BASE[2] * f + hl * 0.4 | 0) + ')';
  }
  function fabric(p) {
    const { N, M, x, y, rest, sign, dir } = p, ex = 1.0 * dir, ey = 1.2;   // overlap hides anti-alias seams
    for (let j = 0; j < M - 1; j++) {
      const r0 = j * N, r1 = r0 + N;
      for (let i = 0; i < N - 1; i++) {
        const a = r0 + i, b = a + 1, c = r1 + i + 1, d = r1 + i;
        const xa = x[a], ya = y[a], xb = x[b], yb = y[b], xc = x[c], yc = y[c], xd = x[d], yd = y[d];
        const wt = dir * (xb - xa), wd = dir * (xc - xd), w = (wt + wd) * 0.5;
        const sg = sign[i], rs = rest[i], wobA = 0.9 + 0.1 * Math.sin(j * 0.6 + i * 2.3), wobB = 0.9 + 0.1 * Math.sin((j + 1) * 0.6 + i * 2.3);
        const K = w > 18 ? 5 : w > 9 ? 3 : 1;
        for (let q = 0; q < K; q++) {
          const t0 = q / K, t1 = (q + 1) / K;
          const f0 = foldF(wt, rs, sg, wobA, t0, t1), f1 = foldF(wd, rs, sg, wobB, t0, t1);
          const V = (f0 - f1 > 0.04 || f1 - f0 > 0.04) ? 4 : 1;               // blend between rows where it changes fast
          const tlx = xa + (xb - xa) * t0, tly = ya + (yb - ya) * t0, trx = xa + (xb - xa) * t1, try_ = ya + (yb - ya) * t1;
          const blx = xd + (xc - xd) * t0, bly = yd + (yc - yd) * t0, brx = xd + (xc - xd) * t1, bry = yd + (yc - yd) * t1;
          for (let v = 0; v < V; v++) {
            const v0 = v / V, v1 = (v + 1) / V, last = v === V - 1 ? ey : 0.6;
            setFill(V === 1 ? (f0 + f1) * 0.5 : f0 + (f1 - f0) * (v0 + v1) * 0.5);
            ctx.beginPath();
            ctx.moveTo(tlx + (blx - tlx) * v0, tly + (bly - tly) * v0);
            ctx.lineTo(trx + (brx - trx) * v0 + ex, try_ + (bry - try_) * v0);
            ctx.lineTo(trx + (brx - trx) * v1 + ex, try_ + (bry - try_) * v1 + last);
            ctx.lineTo(tlx + (blx - tlx) * v1, tly + (bly - tly) * v1 + last);
            ctx.fill();
          }
        }
      }
    }
  }

  function hem(p) {
    const { N, M, x, y } = p, base = (M - 1) * N;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x[base], y[base]);
    for (let i = 1; i < N; i++) ctx.lineTo(x[base + i], y[base + i]);
    ctx.strokeStyle = pal.gold; ctx.lineWidth = 5 * ui; ctx.stroke();
    ctx.strokeStyle = pal.goldLight; ctx.lineWidth = 1.5 * ui; ctx.translate(0, -1 * ui); ctx.stroke(); ctx.translate(0, 1 * ui);
    ctx.lineWidth = 1.2 * ui; ctx.strokeStyle = pal.fringe;   // fringe
    ctx.beginPath();
    for (let i = 0; i < N; i++) { ctx.moveTo(x[base + i], y[base + i] + 2 * ui); ctx.lineTo(x[base + i], y[base + i] + 8 * ui); }
    ctx.stroke();
    ctx.restore();
  }

  function pelmet() {
    const W = sim.width, pelmetH = sim.pelmetH;
    const g = ctx.createLinearGradient(0, 0, 0, pelmetH);
    g.addColorStop(0, pal.pelmet[0]); g.addColorStop(0.55, pal.pelmet[1]); g.addColorStop(1, pal.pelmet[2]);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.65)'; ctx.shadowBlur = 18 * ui * dpr; ctx.shadowOffsetY = 5 * ui * dpr;
    ctx.fillStyle = g; ctx.fillRect(-4, -4, W + 8, pelmetH + 4);
    ctx.restore();
    const t = ctx.createLinearGradient(0, pelmetH - 7 * ui, 0, pelmetH);
    t.addColorStop(0, pal.goldLight); t.addColorStop(0.5, pal.gold); t.addColorStop(1, pal.goldDark);
    ctx.fillStyle = t; ctx.fillRect(0, pelmetH - 7 * ui, W, 7 * ui);
    ctx.fillStyle = pal.pelmetLine; ctx.fillRect(0, pelmetH - 14 * ui, W, 1.5 * ui);
    ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(0, 0, W, 2 * ui);
  }

  function rings(p) {
    ctx.fillStyle = pal.goldLight; ctx.strokeStyle = pal.ringEdge; ctx.lineWidth = 1 * ui;
    for (let i = 0; i < p.N; i++) {
      ctx.beginPath(); ctx.arc(p.x[i], sim.railY, 3.4 * ui, 0, 6.2832); ctx.fill(); ctx.stroke();
    }
  }

  return {
    /* Redraw the whole cloth. The canvas should be (sim.width + 2*margin)*dpr by sim.height*dpr pixels. */
    draw() {
      makeOverlay();
      const W = sim.width, H = sim.height, panels = sim.panels;
      ctx.setTransform(dpr, 0, 0, dpr, margin * dpr, 0);
      ctx.clearRect(-margin, 0, W + 2 * margin, H);
      for (const p of panels) edgeShadow(p);
      for (const p of panels) fabric(p);
      ctx.globalCompositeOperation = 'source-atop';  // light falloff, only where there is cloth
      ctx.fillStyle = overlay; ctx.fillRect(-margin, 0, W + 2 * margin, H);
      ctx.globalCompositeOperation = 'source-over';
      for (const p of panels) hem(p);
      pelmet();
      for (const p of panels) rings(p);
    },
    setDpr(d) { dpr = num(d, 0.25, 4, dpr); overlay = null; }
  };
}

const API = { CFG, createCurtainSim, createCurtainRenderer, readParams };
if (typeof window !== 'undefined') window.XACurtain = API;
if (typeof module !== 'undefined' && module.exports) module.exports = API;
})();
