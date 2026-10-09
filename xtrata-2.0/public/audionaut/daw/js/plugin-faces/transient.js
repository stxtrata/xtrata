import { Kit } from "./runtime.js";
/* transient.js - Transient Shaper. Three faces: A Breakout / B Flashcrash / C Spike */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const MINUS = '−';
  const sgn = (v, d) => (v > 0.0499 ? '+' : v < -0.0499 ? MINUS : '') + Math.abs(v).toFixed(d == null ? 0 : d);
  const pctS = v => sgn(Math.round(v), 0) + ' %';
  const dbS = (v, d) => sgn(v, d == null ? 1 : d) + ' dB';
  const lv = a => Math.sqrt(clamp(a, 0, 1));           // display scale for amplitudes (sqrt keeps tails visible)
  const DB = x => 20 * Math.log10(Math.max(1e-6, x));
  const holdV = (prev, nv, k) => (Math.abs(nv) >= Math.abs(prev) ? nv : prev * k);
  const SANS = "'Space Grotesk','Helvetica Neue',Arial,sans-serif";
  const MONO = "'Share Tech Mono','IBM Plex Mono','Courier New',monospace";
  const BASE = 'button{cursor:pointer;font-family:inherit;border:0;background:none;color:inherit;padding:0}canvas{display:block}[data-plist]{display:none}[data-plist].open{display:grid}';

  const presets = [
    { name: 'Snap', values: { attack: 72, sustain: -22, speed: 0.62, mix: 1, out: 0 } },
    { name: 'Fat sustain', values: { attack: 0, sustain: 68, speed: 0.4, mix: 1, out: -1.5 } },
    { name: 'Dry room', values: { attack: 18, sustain: -72, speed: 0.5, mix: 1, out: 0.5 } },
    { name: 'Tight kick', values: { attack: 46, sustain: -48, speed: 0.72, mix: 1, out: -0.5 } },
    { name: 'Soften', values: { attack: -58, sustain: 12, speed: 0.38, mix: 1, out: 1 } },
    { name: 'Parallel crack', values: { attack: 100, sustain: -34, speed: 0.8, mix: 0.5, out: -1 } },
    { name: 'Bloom bus', values: { attack: -14, sustain: 44, speed: 0.3, mix: 0.7, out: -0.5 } }
  ];

  /* ---------------------------------------------------------------- shared helpers */
  function wire(root, P) {
    root.querySelectorAll('[data-b]').forEach(e => {
      const d = e.dataset, o = {};
      if (d.abs) { o.abs = true; o.axis = d.abs; }
      if (d.ax) o.axis = d.ax; if (d.inv) o.invert = true; if (d.rng) o.range = +d.rng;
      P.bind(e, d.b, o);
    });
    root.querySelectorAll('[data-t]').forEach(e => P.text(e, e.dataset.t));
    const n = P.presets.length; let cur = -1;
    const plist = root.querySelector('[data-plist]');
    if (plist) P.presets.forEach((p, i) => {
      const b = document.createElement('button'); b.dataset.pi = i; b.innerHTML = '<span>' + String(i + 1).padStart(2, '0') + '</span>' + p.name;
      b.addEventListener('click', () => { P.loadPreset(i); plist.classList.remove('open'); }); plist.appendChild(b);
    });
    root.querySelectorAll('[data-prev]').forEach(e => e.addEventListener('click', () => P.loadPreset((cur - 1 + n) % n)));
    root.querySelectorAll('[data-next]').forEach(e => e.addEventListener('click', () => P.loadPreset((cur + 1) % n)));
    root.querySelectorAll('[data-tgl]').forEach(e => e.addEventListener('click', () => plist && plist.classList.toggle('open')));
    P.onPreset((i, name) => {
      cur = i;
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = name || 'Init'; });
      root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = String(Math.max(i, 0) + 1).padStart(2, '0'); });
      if (plist) plist.querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.pi === i));
      root.querySelectorAll('[data-pbtn]').forEach(b => b.classList.toggle('on', +b.dataset.pbtn === i));
    });
  }
  function cvs(cv, w, h) { cv.width = w * 2; cv.height = h * 2; cv.style.width = w + 'px'; cv.style.height = h + 'px'; const c = cv.getContext('2d'); c.setTransform(2, 0, 0, 2, 0, 0); return c; }

  /* rolling history of the real signal: input / output peak per tick plus applied gains */
  function Hist(P, n) {
    const h = { n, i: new Float32Array(n), o: new Float32Array(n), ag: new Float32Array(n), sg: new Float32Array(n), last: 0, live: 0, dIn: 0, dOut: 0, ag0: 0, sg0: 0 };
    const sh = a => { a.copyWithin(0, 1); };
    h.tick = function (now) {
      const dt = now - h.last; if (dt < 15) return false; h.last = now;
      const a = P.timeData('in'), b = P.timeData('out');
      let pi = 0, po = 0;
      if (a && b) {
        const cnt = clamp(Math.round(P.sampleRate() * Math.min(dt, 60) / 1000), 64, 4096), L = a.length;
        for (let k = L - cnt; k < L; k++) { const x = Math.abs(a[k]), y = Math.abs(b[k]); if (x > pi) pi = x; if (y > po) po = y; }
      }
      const m = P.meter() || {};
      sh(h.i); sh(h.o); sh(h.ag); sh(h.sg);
      h.i[n - 1] = pi; h.o[n - 1] = po; h.ag[n - 1] = m.attackGain || 0; h.sg[n - 1] = m.sustainGain || 0;
      h.live = pi > 2e-4 ? 1 : h.live * 0.97;
      h.ag0 = holdV(h.ag0, m.attackGain || 0, 0.9); h.sg0 = holdV(h.sg0, m.sustainGain || 0, 0.9);
      h.dIn = Math.max(P.toDb(pi), h.dIn - 1.1); h.dOut = Math.max(P.toDb(po), h.dOut - 1.1);
      return true;
    };
    return h;
  }

  /* what the settings do to a typical drum hit (no audio needed): returns {i,o} at t in 0..1 */
  function ghostFn(P) {
    const a = P.get('attack') / 100, s = P.get('sustain') / 100, k = 2 * Math.pow(0.25, P.get('speed'));
    const mix = P.get('mix'), og = Math.pow(10, P.get('out') / 20);
    return t => {
      const e = 0.2 * Math.exp(-t * 3.6) + 0.8 * Math.exp(-t * 17);
      const ga = a * 12 * Math.exp(-Math.pow(t / (0.075 * k), 2));
      const gs = s * 12 * (1 - Math.exp(-t / (0.09 * k))) * Math.exp(-t * 0.9);
      const sh = e * Math.pow(10, (ga + gs) / 20);
      return { i: e, o: (e + (sh - e) * mix) * og };
    };
  }
  function drawGhost(c, x0, y0, w, h, P, o) {
    const f = ghostFn(P), N = 90, top = o.top || 1.7, base = y0 + h - (o.pad || 3), span = h - (o.pad || 3) * 2;
    const Y = v => base - clamp(v / top, 0, 1) * span;
    c.save();
    c.beginPath(); c.moveTo(x0, base);
    for (let k = 0; k <= N; k++) { const t = k / N; c.lineTo(x0 + t * w, Y(f(t).o)); }
    c.lineTo(x0 + w, base); c.closePath(); c.fillStyle = o.fill; c.fill();
    c.beginPath();
    for (let k = 0; k <= N; k++) { const t = k / N, g = f(t); k ? c.lineTo(x0 + t * w, Y(g.o)) : c.moveTo(x0, Y(g.o)); }
    c.strokeStyle = o.line; c.lineWidth = o.lw || 1.6; c.stroke();
    c.beginPath(); c.setLineDash([3, 3]);
    for (let k = 0; k <= N; k++) { const t = k / N, g = f(t); k ? c.lineTo(x0 + t * w, Y(g.i)) : c.moveTo(x0, Y(g.i)); }
    c.strokeStyle = o.ref; c.lineWidth = 1; c.stroke(); c.setLineDash([]);
    c.restore();
  }

  /* SVG ring knob. o: size, w (ring width), bi (bipolar), up/dn (colours), track, cap, ptr, pad */
  function ringKnob(el, P, id, o) {
    const S = o.size, c = S / 2, w = o.w || 6, r = c - w / 2 - (o.pad == null ? 2 : o.pad);
    const pt = (a, rr) => { const t = a * Math.PI / 180; return [c + rr * Math.sin(t), c - rr * Math.cos(t)]; };
    const arc = (a, b) => {
      if (Math.abs(b - a) < 0.6) return '';
      const p0 = pt(a, r), p1 = pt(b, r);
      return 'M' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + 'A' + r + ' ' + r + ' 0 ' + (Math.abs(b - a) > 180 ? 1 : 0) + ' ' + (b > a ? 1 : 0) + ' ' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2);
    };
    const cr = r - w / 2 - (o.gap == null ? 5 : o.gap);
    const gid = 'g' + Math.random().toString(36).slice(2, 7);
    el.innerHTML = '<svg width="' + S + '" height="' + S + '" viewBox="0 0 ' + S + ' ' + S + '" style="display:block;overflow:visible">' +
      '<defs><radialGradient id="' + gid + '" cx="35%" cy="28%" r="90%"><stop offset="0" stop-color="' + (o.cap1 || '#2a3552') + '"/><stop offset="1" stop-color="' + (o.cap2 || '#0e1424') + '"/></radialGradient></defs>' +
      '<path d="' + arc(-135, 135) + '" fill="none" stroke="' + (o.track || '#1c2740') + '" stroke-width="' + w + '" stroke-linecap="' + (o.cap_ || 'round') + '"/>' +
      '<path class="v" fill="none" stroke-width="' + w + '" stroke-linecap="' + (o.cap_ || 'round') + '"/>' +
      '<circle cx="' + c + '" cy="' + c + '" r="' + cr + '" fill="url(#' + gid + ')" stroke="' + (o.rim || '#33436b') + '" stroke-width="1.5"/>' +
      '<line class="p" x1="' + c + '" y1="' + (c - cr * 0.28) + '" x2="' + c + '" y2="' + (c - cr * 0.86) + '" stroke="' + (o.ptr || '#fff') + '" stroke-width="' + (o.pw || 3) + '" stroke-linecap="round"/></svg>';
    const v = el.querySelector('.v'), p = el.querySelector('.p');
    P.sub(id, (val, n) => {
      const a = -135 + n * 270;
      v.setAttribute('d', o.bi ? arc(0, a) : arc(-135, a));
      v.setAttribute('stroke', o.bi ? (a >= 0 ? (o.up || '#19e68c') : (o.dn || '#ff5a6e')) : (o.up || '#19e68c'));
      p.setAttribute('transform', 'rotate(' + a.toFixed(1) + ' ' + c + ' ' + c + ')');
    });
    P.bind(el, id);
  }

  /* ============================================================ A  BREAKOUT */
  const CSS_A = BASE + `
.a{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,#101a33 0,#070b14 62%);color:#d7e1f5;font-family:${SANS};overflow:hidden}
.a *{box-sizing:border-box}
.a .hd{position:absolute;left:24px;right:24px;top:14px;height:42px;display:flex;align-items:center;gap:14px}
.a .logo svg{width:40px;height:34px;display:block}
.a .wm{font-size:28px;font-weight:800;letter-spacing:.02em;line-height:1;font-family:${SANS}}
.a .wm i{font-style:normal;color:#19e68c}
.a .tg{flex:1;font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:#5d6f93;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.a .pre{display:flex;align-items:center;gap:8px;font-size:12px;background:#0d1424;border:1px solid #1f2d4d;border-radius:8px;padding:4px 6px}
.a .pre button{width:24px;height:24px;border-radius:5px;color:#8ea2cc;font-size:15px;line-height:1}
.a .pre button:hover{background:#19e68c;color:#06100c}
.a .pre .i{color:#5d6f93;font-size:10px;letter-spacing:.12em}
.a .pre b{width:120px;font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.a [data-plist]{position:absolute;right:158px;top:54px;z-index:30;width:250px;grid-template-columns:1fr;background:#0b1222;border:1px solid #2a3c66;border-radius:8px;overflow:hidden;box-shadow:0 14px 30px #000a}
.a [data-plist] button{text-align:left;padding:7px 12px;font-size:12px;color:#9fb1d6;border-bottom:1px solid #16213a}
.a [data-plist] button span{color:#4b5c80;margin-right:10px;font-size:10px}
.a [data-plist] button:hover,.a [data-plist] button.on{background:#19e68c;color:#06100c}
.a .live{display:flex;align-items:center;gap:8px;height:34px;padding:0 14px;border-radius:17px;border:1px solid #2a3c66;background:#0d1424;font-size:11px;font-weight:700;letter-spacing:.16em;color:#6d7fa3}
.a .live i{width:10px;height:10px;border-radius:50%;background:#3a2530}
.a .live.on{border-color:#19e68c;color:#19e68c;background:#0a1d17}
.a .live.on i{background:#19e68c;box-shadow:0 0 10px #19e68c}
.a .rail{position:absolute;top:70px;width:170px;height:372px;border:1px solid #1a2745;border-radius:14px;background:linear-gradient(#0d1424,#090e1b);text-align:center}
.a .rail.l{left:24px}.a .rail.r{left:766px}
.a .rail h3{margin:14px 0 0;font-size:15px;font-weight:800;letter-spacing:.2em}
.a .rail h3+p{margin:3px 0 0;font-size:9px;letter-spacing:.2em;color:#5d6f93;text-transform:uppercase}
.a .kn{width:140px;height:140px;margin:14px auto 0;position:relative}
.a .kn:focus-visible{outline:none}
.a .big{font-size:34px;font-weight:700;margin-top:6px;letter-spacing:-.01em;font-variant-numeric:tabular-nums;line-height:1.1}
.a .rail.l .big{color:#19e68c}.a .rail.r .big{color:#4cc3ff}
.a .bd{display:inline-block;margin-top:12px;padding:5px 12px;border-radius:14px;font-size:10px;font-weight:700;letter-spacing:.14em;border:1px solid #23335a;color:#5d6f93;background:#0a1020;min-width:120px}
.a .bd.up{color:#06100c;background:#19e68c;border-color:#19e68c}
.a .bd.dn{color:#fff;background:#ff5a6e;border-color:#ff5a6e}
.a .bd.pop{animation:pop .45s cubic-bezier(.2,1.6,.4,1)}
@keyframes pop{0%{transform:scale(.7);box-shadow:0 0 0 0 #19e68c88}60%{transform:scale(1.18)}100%{transform:scale(1);box-shadow:0 0 0 18px #19e68c00}}
.a .cap{margin:12px 14px 0;font-size:10.5px;line-height:1.4;color:#6d7fa3;min-height:30px}
.a .chart{position:absolute;left:206px;top:70px;width:548px;height:292px;border:1px solid #1a2745;border-radius:14px;background:#080d19;overflow:hidden}
.a .chart canvas{position:absolute;left:0;top:0}
.a .strip{position:absolute;left:206px;top:372px;width:548px;height:70px;border:1px solid #1a2745;border-radius:14px;background:#080d19;overflow:hidden}
.a .strip canvas{position:absolute;top:0}
.a .bot{position:absolute;left:24px;right:24px;top:454px;height:84px;border:1px solid #1a2745;border-radius:14px;background:linear-gradient(#0d1424,#090e1b);display:flex;align-items:center;padding:0 22px;gap:26px}
.a .mod{display:flex;align-items:center;gap:12px;flex:1}
.a .mod label{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#8ea2cc;width:78px;line-height:1.35}
.a .mod label small{display:block;font-size:8.5px;color:#4f6086;letter-spacing:.12em}
.a .sl{position:relative;flex:1;height:30px;cursor:ew-resize}
.a .sl:before{content:'';position:absolute;left:0;right:0;top:13px;height:4px;border-radius:2px;background:#16213a}
.a .sl:after{content:'';position:absolute;left:0;top:13px;height:4px;border-radius:2px;width:calc(var(--v)*100%);background:#19e68c}
.a .sl.s:after{background:#4cc3ff}
.a .sl i{position:absolute;top:5px;left:calc(var(--v)*(100% - 14px));width:14px;height:20px;border-radius:4px;background:#e9f0ff;box-shadow:0 2px 6px #000a;z-index:2}
.a .sl u{position:absolute;top:22px;width:1px;height:6px;background:#2a3c66}
.a .val{width:64px;text-align:right;font-size:14px;font-weight:600;font-variant-numeric:tabular-nums}
.a .ok{width:56px;height:56px;position:relative}
.a .ft{position:absolute;right:26px;bottom:3px;font-size:8.5px;letter-spacing:.2em;color:#3f4f73;text-transform:uppercase}
`;
  function faceA(root, P) {
    root.innerHTML = `<style>${CSS_A}</style><div class="a">
      <div class="hd">
        <div class="logo"><svg viewBox="0 0 40 34"><rect x="2" y="12" width="36" height="14" rx="2" fill="none" stroke="#ffc247" stroke-width="1.4" stroke-dasharray="3 3"/><line x1="12" y1="5" x2="12" y2="31" stroke="#ff5a6e" stroke-width="2"/><rect x="9" y="15" width="6" height="10" fill="#ff5a6e"/><line x1="22" y1="3" x2="22" y2="25" stroke="#19e68c" stroke-width="2"/><rect x="19" y="6" width="6" height="14" fill="#19e68c"/><path d="M29 22L36 4M36 4l-6 1.5M36 4l-1 6" stroke="#19e68c" stroke-width="2" fill="none" stroke-linecap="round"/></svg></div>
        <div class="wm">BREAK<i>OUT</i></div>
        <div class="tg">Transient shaper · range, break, hold</div>
        <div class="pre"><button data-prev>‹</button><span class="i" data-pidx>01</span><b data-pname>Init</b><button data-next>›</button><button data-tgl>▾</button></div>
        <button class="live" data-b="__bypass"><i></i><span class="lt">LIVE</span></button>
        <div data-plist></div>
      </div>
      <div class="rail l"><h3>ATTACK</h3><p>the breakout</p><div class="kn" id="ka"></div><div class="big" data-t="attack"></div><div class="bd" id="ba">IN RANGE</div><div class="cap" id="ca"></div></div>
      <div class="rail r"><h3>SUSTAIN</h3><p>holding the range</p><div class="kn" id="ks"></div><div class="big" data-t="sustain"></div><div class="bd" id="bs">FLAT</div><div class="cap" id="cs"></div></div>
      <div class="chart"><canvas id="ch"></canvas></div>
      <div class="strip"><canvas id="gs"></canvas><canvas id="gh"></canvas></div>
      <div class="bot">
        <div class="mod"><label>Speed<small>timeframe</small></label><div class="sl" data-b="speed" data-abs="x"><u style="left:0"></u><u style="left:25%"></u><u style="left:50%"></u><u style="left:75%"></u><u style="left:calc(100% - 1px)"></u><i></i></div><div class="val" data-t="speed"></div></div>
        <div class="mod"><label>Mix<small>position size</small></label><div class="sl s" data-b="mix" data-abs="x"><u style="left:0"></u><u style="left:50%"></u><u style="left:calc(100% - 1px)"></u><i></i></div><div class="val" data-t="mix"></div></div>
        <div class="mod" style="flex:.62"><label>Output<small>take profit</small></label><div class="ok" id="ko"></div><div class="val" data-t="out" style="width:70px"></div></div>
        <div class="ft">Levels are ratios — a breakout reads the same at any volume</div>
      </div></div>`;
    const $ = s => root.querySelector(s);
    wire(root, P);
    ringKnob($('#ka'), P, 'attack', { size: 140, w: 9, bi: true, up: '#19e68c', dn: '#ff5a6e', ptr: '#e9f0ff', pw: 4 });
    ringKnob($('#ks'), P, 'sustain', { size: 140, w: 9, bi: true, up: '#4cc3ff', dn: '#ffc247', ptr: '#e9f0ff', pw: 4 });
    ringKnob($('#ko'), P, 'out', { size: 56, w: 5, bi: true, up: '#e9f0ff', dn: '#8ea2cc', ptr: '#e9f0ff', pw: 3, gap: 3 });
    P.sub('__bypass', on => { $('.lt').textContent = on ? 'LIVE' : 'FLAT'; });
    P.sub('attack', v => { $('#ca').textContent = v > 12 ? 'Pushing price through resistance.' : v < -12 ? 'Capping the wick, rejecting the spike.' : 'Range-bound. Nothing breaks out.'; });
    P.sub('sustain', v => { $('#cs').textContent = v > 12 ? 'Support rebuilt under every tail.' : v < -12 ? 'Tails bleed out, the range dries up.' : 'Tails left where they trade.'; });

    const CW = 548, CH = 292, cch = cvs($('#ch'), CW, CH), cg = cvs($('#gs'), 330, 70), cp = cvs($('#gh'), 218, 70);
    $('#gh').style.left = '330px';
    const H = Hist(P, 240); const BK = 4;
    let stA = '', stS = '';
    const setBadge = (el, cls, txt, key, prev) => {
      if (key !== prev) { el.className = 'bd ' + cls; el.textContent = txt; void el.offsetWidth; if (cls) el.classList.add('pop'); }
      return key;
    };
    const PL = 8, PR = 466, PT = 16, PB = 212, VT = 228, VB = 272;
    const Y = a => PT + (1 - lv(a)) * (PB - PT);
    function drawChart() {
      const c = cch; c.clearRect(0, 0, CW, CH);
      // grid and axis
      c.font = '9px ' + MONO; c.textAlign = 'left'; c.textBaseline = 'middle';
      [0, -6, -12, -24, -40].forEach(db => {
        const y = Y(Math.pow(10, db / 20));
        c.strokeStyle = '#121c33'; c.lineWidth = 1; c.beginPath(); c.moveTo(PL, y); c.lineTo(PR, y); c.stroke();
        c.fillStyle = '#4b5c80'; c.fillText(db + '', PR + 6, y);
      });
      for (let x = PL; x < PR; x += 47) { c.strokeStyle = '#0f182d'; c.beginPath(); c.moveTo(x, PT); c.lineTo(x, PB); c.stroke(); }
      const nC = H.n / BK, cw = (PR - PL) / nC;
      // range band from the input envelope quantiles
      const sorted = Array.from(H.i).sort((a, b) => a - b);
      const resA = sorted[Math.floor(H.n * 0.9)], supA = sorted[Math.floor(H.n * 0.5)];
      const live = H.live > 0.2;
      if (live) {
        c.fillStyle = 'rgba(255,194,71,.07)'; c.fillRect(PL, Y(resA), PR - PL, Y(supA) - Y(resA));
        c.setLineDash([4, 4]); c.strokeStyle = 'rgba(255,194,71,.7)'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(PL, Y(resA)); c.lineTo(PR, Y(resA)); c.moveTo(PL, Y(supA)); c.lineTo(PR, Y(supA)); c.stroke(); c.setLineDash([]);
        c.fillStyle = '#ffc247'; c.fillText('RES', PR - 24, Y(resA) - 7); c.fillText('SUP', PR - 24, Y(supA) + 8);
      }
      // volume = applied gain
      c.strokeStyle = '#121c33'; c.beginPath(); c.moveTo(PL, VB); c.lineTo(PR, VB); c.moveTo(PL, (VT + VB) / 2); c.lineTo(PR, (VT + VB) / 2); c.stroke();
      c.fillStyle = '#3f4f73'; c.fillText('GAIN', PL + 2, VT - 4); c.fillText('+12', PR + 6, VT + 4); c.fillText('0', PR + 6, (VT + VB) / 2); c.fillText(MINUS + '12', PR + 6, VB - 4);
      for (let k = 0; k < nC; k++) {
        let iS = 0, oS = 0, hi = 0, lo = 9, g = 0;
        for (let j = 0; j < BK; j++) {
          const ii = H.i[k * BK + j], oo = H.o[k * BK + j]; iS += ii; oS += oo;
          hi = Math.max(hi, ii, oo); lo = Math.min(lo, ii, oo);
          const gg = H.ag[k * BK + j] + H.sg[k * BK + j]; if (Math.abs(gg) > Math.abs(g)) g = gg;
        }
        iS /= BK; oS /= BK;
        const x = PL + k * cw + cw / 2;
        if (iS < 1e-4 && oS < 1e-4) { c.fillStyle = '#16213a'; c.fillRect(x - cw * 0.3, (PB + PT) / 2 + 40, cw * 0.6, 1.2); continue; }
        const up = oS > iS * 1.03, dn = oS < iS * 0.97;
        const col = up ? '#19e68c' : dn ? '#ff5a6e' : '#8ea2cc';
        c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 1;
        c.beginPath(); c.moveTo(x, Y(hi)); c.lineTo(x, Y(lo)); c.stroke();
        const yt = Y(Math.max(iS, oS)), yb = Y(Math.min(iS, oS));
        c.fillRect(x - cw * 0.34, yt, cw * 0.68, Math.max(1.5, yb - yt));
        if (up && live && hi > resA * 1.04 && iS < resA * 1.1) {   // broke the range
          c.beginPath(); c.moveTo(x, Y(hi) - 12); c.lineTo(x - 3.5, Y(hi) - 6); c.lineTo(x + 3.5, Y(hi) - 6); c.closePath(); c.fillStyle = '#e9f0ff'; c.fill();
        }
        const gh = clamp(g / 12, -1, 1) * (VB - VT) / 2, mid = (VT + VB) / 2;
        c.fillStyle = g >= 0 ? 'rgba(25,230,140,.75)' : 'rgba(255,90,110,.75)';
        c.fillRect(x - cw * 0.34, gh >= 0 ? mid - gh : mid, cw * 0.68, Math.max(0.8, Math.abs(gh)));
      }
      if (!live) {
        c.fillStyle = '#4b5c80'; c.font = '600 12px ' + SANS; c.textAlign = 'center'; c.fillText('MARKET CLOSED  —  press play to open the feed', (PL + PR) / 2, (PT + PB) / 2 - 6);
        c.font = '9px ' + MONO; c.textAlign = 'left';
      }
      // meters IN / OUT
      [['IN', H.dIn, 514, '#8ea2cc'], ['OUT', H.dOut, 528, '#19e68c']].forEach(m => {
        const f = clamp((m[1] + 60) / 60, 0, 1);
        c.fillStyle = '#101a30'; c.fillRect(m[2], PT, 8, VB - PT);
        const g = c.createLinearGradient(0, VB, 0, PT); g.addColorStop(0, m[3]); g.addColorStop(0.8, m[3]); g.addColorStop(1, '#ff5a6e');
        c.fillStyle = g; c.fillRect(m[2], VB - f * (VB - PT), 8, f * (VB - PT));
        c.fillStyle = '#4b5c80'; c.font = '8px ' + MONO; c.textAlign = 'center'; c.fillText(m[0], m[2] + 4, VB + 8); c.textAlign = 'left';
      });
      c.fillStyle = '#4b5c80'; c.font = '8px ' + MONO; c.fillText('candle = input → output · green boosts, red cuts', PL + 2, CH - 8);
    }
    function drawStrip(ag, sg) {
      const c = cg; c.clearRect(0, 0, 330, 70);
      [['ATTACK GAIN', ag, '#19e68c', '#ff5a6e', 8], ['SUSTAIN GAIN', sg, '#4cc3ff', '#ffc247', 40]].forEach(r => {
        const y = r[4], x0 = 108, x1 = 250, mid = (x0 + x1) / 2;
        c.fillStyle = '#8ea2cc'; c.font = '700 9px ' + SANS; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(r[0], 12, y + 10);
        c.fillStyle = '#101a30'; c.fillRect(x0, y + 4, x1 - x0, 12);
        const w = clamp(Math.abs(r[1]) / 12, 0, 1) * (x1 - x0) / 2;
        c.fillStyle = r[1] >= 0 ? r[2] : r[3]; c.fillRect(r[1] >= 0 ? mid : mid - w, y + 4, w, 12);
        c.fillStyle = '#2a3c66'; c.fillRect(mid - 0.5, y + 1, 1, 18);
        c.fillStyle = '#e9f0ff'; c.font = '600 11px ' + MONO; c.textAlign = 'right'; c.fillText(dbS(r[1]), 322, y + 10);
      });
      const q = cp; q.clearRect(0, 0, 218, 70);
      q.strokeStyle = '#1a2745'; q.strokeRect(0.5, 0.5, 217, 69); q.beginPath(); q.moveTo(0.5, 0); q.lineTo(0.5, 70); q.stroke();
      drawGhost(q, 10, 6, 198, 58, P, { top: 1.7, fill: 'rgba(25,230,140,.14)', line: '#19e68c', ref: '#5d6f93', pad: 3 });
      q.fillStyle = '#4b5c80'; q.font = '8px ' + MONO; q.textAlign = 'right'; q.fillText('PROJECTED MOVE', 210, 10);
    }
    P.raf(t => {
      H.tick(t); drawChart(); drawStrip(H.ag0, H.sg0);
      const a = H.ag0, s = H.sg0;
      stA = setBadge($('#ba'), a > 2.5 ? 'up' : a < -2.5 ? 'dn' : '', a > 2.5 ? 'BREAKOUT ▲' : a < -2.5 ? 'REJECTED ▼' : 'IN RANGE', a > 2.5 ? 1 : a < -2.5 ? 2 : 0, stA);
      stS = setBadge($('#bs'), s > 2.5 ? 'up' : s < -2.5 ? 'dn' : '', s > 2.5 ? 'HOLDING ▲' : s < -2.5 ? 'FADING ▼' : 'FLAT', s > 2.5 ? 1 : s < -2.5 ? 2 : 0, stS);
    });
  }

  /* ============================================================ B  FLASHCRASH */
  const CSS_B = BASE + `
.b{position:absolute;inset:0;background:#0f0607;color:#ffd9d0;font-family:${MONO};overflow:hidden}
.b *{box-sizing:border-box}
.b:before,.b:after{content:'';position:absolute;left:0;right:0;height:12px;background:repeating-linear-gradient(-45deg,#ffb020 0 14px,#1a0a0b 14px 28px);z-index:5}
.b:before{top:0}.b:after{bottom:0}
.b .hd{position:absolute;left:20px;right:20px;top:22px;height:44px;display:flex;align-items:center;gap:14px}
.b .wm{font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:42px;line-height:1;letter-spacing:.04em;color:#ff2d2d;text-shadow:0 0 18px #ff2d2d66}
.b .wm small{font-family:${MONO};font-size:10px;letter-spacing:.2em;color:#a05a52;margin-left:12px;text-shadow:none;vertical-align:middle}
.b .sp{flex:1}
.b .stat{font-size:11px;letter-spacing:.16em;color:#ffb020;border:1px solid #4a1519;padding:6px 10px;background:#180a0b;min-width:210px;text-align:center}
.b .stat.al{color:#fff;background:#ff2d2d;border-color:#ff2d2d;animation:bl .5s steps(2) infinite}
@keyframes bl{50%{background:#7a1010}}
.b .log{position:absolute;left:20px;top:78px;width:156px;height:420px;border:1px solid #4a1519;background:#150a0b}
.b .log h4{margin:0;padding:8px 10px;font-size:10px;letter-spacing:.2em;color:#ff2d2d;border-bottom:1px solid #4a1519;background:#1d0c0e}
.b .log button{display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:10px 10px;font-size:12px;color:#a05a52;border-bottom:1px solid #2a1214;letter-spacing:.04em}
.b .log button i{width:8px;height:8px;border-radius:50%;background:#3a1518;flex:none}
.b .log button span{color:#6d3a36;font-size:10px}
.b .log button:hover{color:#ffd9d0;background:#1d0c0e}
.b .log button.on{color:#fff;background:#2a0f12}
.b .log button.on i{background:#ff2d2d;box-shadow:0 0 8px #ff2d2d}
.b .log .ar{display:flex;border-top:0}
.b .log .nv{display:flex;position:absolute;left:0;right:0;bottom:0;border-top:1px solid #4a1519}
.b .log .nv button{justify-content:center;border-bottom:0;font-size:14px;padding:9px 0;flex:1;border-right:1px solid #2a1214}
.b .log .tick{position:absolute;left:10px;right:10px;bottom:46px;font-size:9px;line-height:1.5;color:#6d3a36;letter-spacing:.1em}
.b .disp{position:absolute;left:196px;top:78px;width:464px;height:230px;border:1px solid #4a1519;background:#0a0405;overflow:hidden}
.b .disp canvas{position:absolute;left:0;top:0}
.b .disp.al{border-color:#ff2d2d;box-shadow:inset 0 0 30px #ff2d2d55}
.b .rd{position:absolute;left:680px;top:78px;width:200px;height:230px;border:1px solid #4a1519;background:#150a0b;padding:10px 12px}
.b .rd h4{margin:8px 0 4px;font-size:10px;letter-spacing:.2em;color:#a05a52;font-weight:400}
.b .seg{font-size:34px;line-height:1.05;color:#ffb020;text-shadow:0 0 12px #ffb02088;letter-spacing:.02em;font-variant-numeric:tabular-nums;white-space:nowrap}
.b .seg small{font-size:13px;color:#a06a10;text-shadow:none;margin-left:4px}
.b .ev{font-size:12px;color:#ffd9d0;letter-spacing:.08em}
.b .lamps{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:8px 0 2px}
.b .lamp{font-size:9.5px;letter-spacing:.1em;padding:5px 0 5px 22px;position:relative;color:#6d3a36;border:1px solid #2a1214;background:#100607}
.b .lamp:before{content:'';position:absolute;left:7px;top:7px;width:8px;height:8px;border-radius:50%;background:#2a1214}
.b .lamp.on{color:#ffd9d0;border-color:#7a1010;background:#2a0f12}
.b .lamp.on:before{background:#ff2d2d;box-shadow:0 0 9px #ff2d2d}
.b .lamp.up.on:before{background:#ffb020;box-shadow:0 0 9px #ffb020}
.b .ctl{position:absolute;left:196px;top:320px;width:464px;height:178px;border:1px solid #4a1519;background:#150a0b;display:flex}
.b .fm{width:118px;border-right:1px solid #2a1214;padding:8px 0 0;text-align:center;position:relative}
.b .fm h5{margin:0;font-size:12px;letter-spacing:.24em;color:#ffd9d0;font-weight:400}
.b .fm h5+div.d{font-size:9px;color:#6d3a36;letter-spacing:.14em;margin-top:2px}
.b .fd{position:absolute;left:34px;top:54px;width:50px;height:96px;cursor:ns-resize}
.b .fd .rl{position:absolute;left:23px;top:-6px;bottom:-6px;width:4px;background:#2a1214;border-radius:2px;box-shadow:inset 0 0 0 1px #4a1519}
.b .fd .fl{position:absolute;left:23px;width:4px;background:#ff2d2d;box-shadow:0 0 8px #ff2d2d}
.b .fd .tk{position:absolute;left:4px;width:42px;height:1px;background:#4a1519}
.b .fd .tk.z{background:#a05a52;height:2px}
.b .fd .tkl{position:absolute;font-size:8px;color:#6d3a36;left:50px}
.b .fd .th{position:absolute;left:8px;width:34px;height:20px;bottom:calc(var(--v)*100% - 10px);background:linear-gradient(#5b2326,#2d1113);border:1px solid #a05a52;border-radius:2px;box-shadow:0 3px 6px #000c}
.b .fd .th:after{content:'';position:absolute;left:3px;right:3px;top:9px;height:2px;background:#ffd9d0}
.b .fv{position:absolute;left:0;right:0;bottom:5px;font-size:14px;color:#ffd9d0;font-variant-numeric:tabular-nums}
.b .sm{flex:1;display:grid;grid-template-columns:1fr 1fr 1fr;align-items:start;padding-top:8px}
.b .sm div.k{text-align:center}
.b .sm h5{margin:0;font-size:10px;letter-spacing:.16em;color:#a05a52;font-weight:400;white-space:nowrap}
.b .kb{width:62px;height:62px;margin:12px auto 0;position:relative}
.b .kb svg{overflow:visible}
.b .sm .kv{margin-top:10px;font-size:12px;color:#ffd9d0;font-variant-numeric:tabular-nums}
.b .sm .ks{font-size:8.5px;color:#6d3a36;letter-spacing:.1em;margin-top:3px}
.b .io{position:absolute;left:680px;top:320px;width:200px;height:178px;border:1px solid #4a1519;background:#150a0b}
.b .io canvas{position:absolute;left:8px;top:8px}
.b .hl{position:absolute;right:12px;top:14px;width:98px;text-align:center}
.b .hb{width:84px;height:84px;border-radius:50%;margin:0 auto;border:4px solid #2a1214;background:radial-gradient(circle at 35% 30%,#ff6b5a,#c01818 55%,#6a0a0a);box-shadow:0 5px 0 #4a0808,0 8px 14px #000c,inset 0 -4px 8px #0006;position:relative;cursor:pointer}
.b .hb:after{content:'';position:absolute;inset:-9px;border-radius:50%;border:2px dashed #4a1519}
.b .hb.on{transform:translateY(0)}
.b .hb:not(.on){transform:translateY(4px);box-shadow:0 1px 0 #4a0808,0 3px 8px #000c,inset 0 -4px 8px #0006;filter:saturate(.25) brightness(.6)}
.b .hl p{margin:14px 0 0;font-size:10px;letter-spacing:.16em;color:#a05a52;line-height:1.5}
.b .hl p b{display:block;color:#ffd9d0;font-weight:400;font-size:12px}
.b .ft{position:absolute;left:196px;top:502px;right:20px;height:12px;font-size:8.5px;letter-spacing:.2em;color:#6d3a36;text-transform:uppercase;white-space:nowrap}
`;
  

  /* ============================================================ C  SPIKE */
  const CSS_C = BASE + `
.c{position:absolute;inset:0;background:#c9c3b1;font-family:'Nunito','Trebuchet MS',Verdana,sans-serif;color:#2b2f2c;overflow:hidden}
.c *{box-sizing:border-box}
.c .body{position:absolute;left:10px;top:10px;right:10px;bottom:10px;border-radius:28px;background:linear-gradient(#ddd8c7,#cfc9b6);box-shadow:inset 0 2px 0 #fff8,inset 0 -3px 0 #0002,0 2px 8px #0003}
.c .plate{position:absolute;left:28px;top:24px;right:28px;height:52px;display:flex;align-items:center;gap:14px}
.c .wm{font-size:38px;font-weight:800;letter-spacing:-.01em;line-height:1;color:#2b2f2c;display:flex;align-items:center;gap:10px}
.c .wm svg{width:46px;height:34px}
.c .wm small{font-size:10px;font-weight:700;letter-spacing:.16em;color:#7b786a;text-transform:uppercase;line-height:1.35;padding-left:12px;border-left:2px solid #b3ad98}
.c .sp{flex:1}
.c .lcd{width:240px;height:40px;border-radius:10px;background:#a9c79a;border:2px solid #7c8f72;box-shadow:inset 0 2px 5px #0005;display:flex;align-items:center;padding:0 12px;gap:10px;font-family:${MONO};color:#1c3a22;font-size:15px}
.c .lcd i{font-style:normal;opacity:.55;font-size:12px}
.c .lcd b{font-weight:400;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c .pb{display:flex;gap:5px}
.c .pb button{width:26px;height:26px;border-radius:50%;font-size:11px;font-weight:800;color:#5a574b;background:linear-gradient(#f2eedf,#c4bea9);box-shadow:0 2px 0 #9b9580,0 3px 4px #0003}
.c .pb button.on{background:linear-gradient(#ffb08a,#ff6b35);color:#fff;box-shadow:0 0 0 #0000,inset 0 2px 3px #0004;transform:translateY(2px)}
.c .crt{position:absolute;left:28px;top:90px;width:540px;height:278px;border-radius:24px;background:#20262a;box-shadow:inset 0 3px 8px #000b,0 1px 0 #fff9;padding:20px}
.c .scr{position:absolute;left:20px;top:20px;width:500px;height:216px;border-radius:14px;background:radial-gradient(ellipse at center,#0f2a1f 0,#07140f 80%);overflow:hidden;box-shadow:inset 0 0 28px #000}
.c .scr canvas{position:absolute;left:0;top:0}
.c .crtl{position:absolute;left:24px;right:24px;bottom:9px;height:20px;display:flex;align-items:center;gap:16px;font-size:9px;font-weight:800;letter-spacing:.14em;color:#8d9b93}
.c .crtl span i{display:inline-block;width:18px;height:3px;border-radius:2px;margin-right:6px;vertical-align:middle}
.c .crtl em{font-style:normal;margin-left:auto;color:#6f8379}
.c .paper{position:absolute;left:28px;top:380px;width:540px;height:150px;border-radius:16px;background:#bdb7a2;padding:10px;box-shadow:inset 0 2px 5px #0003}
.c .paper .sheet{position:absolute;left:10px;top:10px;width:520px;height:130px;border-radius:6px;background:#f4eed8;overflow:hidden;box-shadow:0 1px 3px #0004}
.c .paper canvas{position:absolute;left:0;top:0}
.c .gal{position:absolute;top:90px;width:114px;height:100px;border-radius:16px;background:#f1ecda;border:2px solid #b3ad98;box-shadow:inset 0 2px 4px #0002}
.c .gal canvas{position:absolute;left:0;top:0}
.c .grp{position:absolute;left:588px;width:226px}
.c .tt{font-size:9px;font-weight:800;letter-spacing:.2em;color:#7b786a;text-transform:uppercase;text-align:center}
.c .kk{position:absolute;text-align:center}
.c .kk .kb{margin:0 auto;position:relative}
.c .kk .nm{font-size:13px;font-weight:800;letter-spacing:.14em;margin-top:-2px}
.c .kk .nm small{display:block;font-size:8.5px;font-weight:700;letter-spacing:.14em;color:#8a8672}
.c .kk .rv{margin-top:3px;font-family:${MONO};font-size:14px;background:#2b2f2c;color:#9dffc4;border-radius:6px;display:inline-block;padding:2px 8px;min-width:78px;font-variant-numeric:tabular-nums}
.c .pw{position:absolute;left:590px;top:488px;width:230px;height:46px;display:flex;align-items:center;gap:14px}
.c .tog{width:58px;height:32px;border-radius:16px;background:#8e8978;box-shadow:inset 0 3px 6px #0005;position:relative;flex:none}
.c .tog:after{content:'';position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:50%;background:linear-gradient(#fbf8ec,#c3bda8);box-shadow:0 2px 4px #0006;transition:left .12s}
.c .tog.on{background:#ff6b35}.c .tog.on:after{left:29px}
.c .pw b{font-size:11px;font-weight:800;letter-spacing:.14em;display:block}
.c .pw span{font-size:9px;font-weight:700;letter-spacing:.14em;color:#7b786a;text-transform:uppercase}
.c .led{display:flex;gap:3px;margin-left:auto;align-items:flex-end}
.c .led canvas{display:block}
`;
  function labKnob(el, P, id, o) {
    const S = o.size, c = S / 2, bodyR = o.body, ticks = o.ticks || 11;
    const gid = 'k' + Math.random().toString(36).slice(2, 7);
    let tk = '';
    for (let i = 0; i < ticks; i++) {
      const a = (-135 + i * 270 / (ticks - 1)) * Math.PI / 180, big = i === 0 || i === ticks - 1 || (o.bi && i === (ticks - 1) / 2);
      const r0 = bodyR + 4, r1 = bodyR + (big ? 11 : 8);
      tk += '<line x1="' + (c + r0 * Math.sin(a)).toFixed(1) + '" y1="' + (c - r0 * Math.cos(a)).toFixed(1) + '" x2="' + (c + r1 * Math.sin(a)).toFixed(1) + '" y2="' + (c - r1 * Math.cos(a)).toFixed(1) + '" stroke="#5a574b" stroke-width="' + (big ? 2 : 1.2) + '" stroke-linecap="round"/>';
    }
    el.style.width = S + 'px'; el.style.height = S + 'px';
    el.innerHTML = '<svg width="' + S + '" height="' + S + '" viewBox="0 0 ' + S + ' ' + S + '" style="display:block;overflow:visible"><defs><radialGradient id="' + gid + '" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="#fffdf2"/><stop offset="1" stop-color="#b6b09a"/></radialGradient></defs>' + tk +
      '<circle cx="' + c + '" cy="' + (c + 3) + '" r="' + bodyR + '" fill="#0003"/>' +
      '<g class="g"><circle cx="' + c + '" cy="' + c + '" r="' + bodyR + '" fill="url(#' + gid + ')" stroke="#8d8772" stroke-width="1.5"/>' +
      '<circle cx="' + c + '" cy="' + c + '" r="' + (bodyR * 0.62) + '" fill="none" stroke="#0001" stroke-width="2"/>' +
      '<rect x="' + (c - 3) + '" y="' + (c - bodyR + 5) + '" width="6" height="' + (bodyR * 0.46) + '" rx="3" fill="' + (o.ptr || '#ff6b35') + '"/></g></svg>';
    const g = el.querySelector('.g');
    P.sub(id, (v, n) => { g.setAttribute('transform', 'rotate(' + (-135 + n * 270).toFixed(1) + ' ' + c + ' ' + c + ')'); });
    P.bind(el, id);
  }
  

  Kit.register('transient', {
    fonts: 'family=Space+Grotesk:wght@500;700&family=Share+Tech+Mono&family=Bebas+Neue&family=Nunito:wght@600;800',
    w: 960, h: 560,
    labels: { attack: 'Attack', sustain: 'Sustain', speed: 'Speed', mix: 'Mix', out: 'Output' },
    fmts: {
      attack: pctS, sustain: pctS,
      speed: v => Math.round(v * 100) + ' %', mix: v => Math.round(v * 100) + ' %', out: v => dbS(v, 1)
    },
    presets,
    faces: [
      { key: 'A', name: 'Breakout', accent: '#19e68c', w: 960, h: 560, build: faceA },
      undefined,
      undefined
    ].filter(Boolean)
  });
})();
