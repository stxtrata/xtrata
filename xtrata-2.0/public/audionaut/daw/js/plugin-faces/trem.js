import { Kit } from "./runtime.js";
/* trem — Tremolo / AutoPan. Faces: A Volatility (fear gauge + wobbling line) / B Heartbeat (patient monitor) / C Whipsaw (riso saw blade + crack) */
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const TAU = Math.PI * 2;
  const SANS = "'Space Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif";
  const MONO = "'IBM Plex Mono',ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace";
  const SHAPE_NAMES = ['Sine', 'Triangle', 'Square', 'Saw'];
  const hz = v => (v < 10 ? v.toFixed(1) : v.toFixed(1)) + ' Hz';

  const presets = [
    { name: 'Init', values: {} },
    { name: 'Vintage amp', values: { rate: 5.5, depth: 0.55, pan: 0, shape: 'sine', stereo: 0, smooth: 0.2 } },
    { name: 'Slow swell', values: { rate: 0.7, depth: 0.45, pan: 0.25, shape: 'triangle', stereo: 0.3, smooth: 0.2 } },
    { name: 'Wide auto-pan', values: { rate: 1.3, depth: 0.12, pan: 1, shape: 'sine', stereo: 1, smooth: 0.2 } },
    { name: 'Helicopter', values: { rate: 11, depth: 1, pan: 0, shape: 'square', stereo: 0, smooth: 0.35 } },
    { name: 'Gate chop', values: { rate: 7.5, depth: 1, pan: 0, shape: 'square', stereo: 0, smooth: 0.02 } },
    { name: 'Saw swoop', values: { rate: 2.4, depth: 0.9, pan: 0.4, shape: 'saw', stereo: 0.5, smooth: 0.55 } }
  ];

  /* ---------- shared model: one LFO cycle, history, phase tracking ---------- */
  const cycCache = {};
  function cycle(shape, smooth) {
    const N = 256, key = shape + ':' + (shape >= 2 ? smooth.toFixed(3) : 0);
    if (cycCache[key]) return cycCache[key];
    const raw = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const p = i / N;
      raw[i] = shape === 0 ? Math.sin(TAU * p) : shape === 1 ? (p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : 4 * p - 4) : shape === 2 ? (p < 0.5 ? 1 : -1) : 2 * p - 1;
    }
    let out = raw;
    if (shape >= 2) {
      const fc = 90 * Math.pow(1.5 / 90, smooth);            // cycles of the LFO: 90x rate ... 1.5x rate
      const a = 1 - Math.exp(-TAU * fc / N);
      let y = raw[N - 1]; const buf = new Float32Array(N);
      for (let c = 0; c < 4; c++) for (let i = 0; i < N; i++) { y += a * (raw[i] - y); if (c === 3) buf[i] = y; }
      out = buf;
    }
    return (cycCache[key] = out);
  }
  function model(P, extra) {
    const S = { rate: 5, depth: 0.6, pan: 0, shape: 0, stereo: 0, smooth: 0.2, cyc: cycle(0, 0.2), lfo: 0, ph: 0, dl: 0, live: false, hist: new Float32Array(2000), hi: 0, acc: 0, last: 0, T: 0 };
    ['rate', 'depth', 'pan', 'stereo', 'smooth'].forEach(k => P.sub(k, v => { S[k] = +v; S.cyc = cycle(S.shape, S.smooth); }));
    P.sub('shape', v => { S.shape = v | 0; S.cyc = cycle(S.shape, S.smooth); });
    S.at = ph => { ph = ((ph % 1) + 1) % 1; const f = ph * 256, i = f | 0, c = S.cyc; return lerp(c[i], c[(i + 1) & 255], f - i); };
    S.gain = l => 1 - S.depth * (0.5 - 0.5 * l);               // tremolo gain 1..1-depth
    S.lag = sec => { const k = Math.round(sec / 0.005); return S.hist[((S.hi - 1 - k) % 2000 + 2000) % 2000]; };
    S.step = t => {
      const dt = clamp((t - S.last) / 1000 || 0.016, 0.001, 0.1); S.last = t; S.T += dt;
      const m = P.meter() || {};
      S.inPeak = m.inPeak || 0; S.outPeak = m.outPeak || 0;
      const l = typeof m.lfo === 'number' && isFinite(m.lfo) ? clamp(m.lfo, -1, 1) : null;
      S.live = l !== null;
      const prev = S.lfo; if (l !== null) S.lfo = l; else S.lfo = S.at(S.ph);
      S.dl = S.lfo - prev;
      S.ph = (S.ph + S.rate * dt) % 1;
      if (l !== null && S.shape !== 2 && Math.abs(S.dl) > 0.004) {     // nudge phase toward the real LFO (matching slope)
        const sl = Math.sign(S.dl), c = S.cyc; let best = 9, bi = -1;
        for (let i = 0; i < 256; i++) { const e = Math.abs(c[i] - l); if (e < best && Math.sign(c[(i + 1) & 255] - c[i]) === sl) { const d = Math.abs(((i / 256 - S.ph + 1.5) % 1) - 0.5); if (d < 0.35) { best = e; bi = i; } } }
        if (bi >= 0 && best < 0.2) { let d = bi / 256 - S.ph; d -= Math.round(d); S.ph = (S.ph + d * 0.12 + 1) % 1; }
      }
      S.acc += dt; const nT = Math.max(1, Math.floor(S.acc / 0.005)); let kk = 0; while (S.acc >= 0.005) { S.acc -= 0.005; kk++; S.hist[S.hi] = lerp(prev, S.lfo, kk / nT); S.hi = (S.hi + 1) % 2000; }
      if (extra) extra(S, dt);
      return dt;
    };
    return S;
  }
  const dbOf = x => x > 0.00001 ? 20 * Math.log10(x) : -90;
  function cv(el) { const w = +el.getAttribute('width') / 2, h = +el.getAttribute('height') / 2, c = el.getContext('2d'); c.setTransform(2, 0, 0, 2, 0, 0); return { c, w, h }; }

  function wire(root, P) {
    root.querySelectorAll('[data-p]').forEach(el => {
      const o = {}; if (el.dataset.abs) { o.abs = true; o.axis = el.dataset.abs; } if (el.dataset.ax) o.axis = el.dataset.ax; if (el.dataset.rng) o.range = +el.dataset.rng;
      P.bind(el, el.dataset.p, o);
    });
    root.querySelectorAll('[data-t]').forEach(el => P.text(el, el.dataset.t));
    root.querySelectorAll('[data-byp]').forEach(el => P.bind(el, '__bypass'));
    root.querySelectorAll('[data-shape]').forEach(b => b.addEventListener('click', () => P.set('shape', +b.dataset.shape)));
    P.sub('shape', i => root.querySelectorAll('[data-shape]').forEach(b => b.classList.toggle('on', +b.dataset.shape === (i | 0))));
    const n = P.presets.length; let idx = -1;
    P.onPreset((i, nm) => {
      idx = i;
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = nm || 'Custom'; });
      root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = i < 0 ? '--' : String(i + 1).padStart(2, '0'); });
      root.querySelectorAll('[data-pl]').forEach(e => e.classList.toggle('on', +e.dataset.pl === i));
    });
    root.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx - 1 + n) % n)));
    root.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx + 1) % n)));
    root.querySelectorAll('[data-pl]').forEach(b => b.addEventListener('click', () => { P.loadPreset(+b.dataset.pl); const pop = b.closest('.pop'); if (pop) pop.classList.remove('open'); }));
    root.querySelectorAll('[data-popbtn]').forEach(b => b.addEventListener('click', () => { const pop = root.querySelector(b.dataset.popbtn); pop && pop.classList.toggle('open'); }));
  }
  const plist = (P, f) => P.presets.map((p, i) => f(p, i)).join('');
  const shapeGlyph = (s, c, w, h, sw) => {     // tiny svg of the shape
    let d = '';
    const N = 40; const cy = cycle(s, 0.2);
    for (let i = 0; i <= N; i++) { const v = cy[Math.min(255, Math.round(i / N * 255))]; d += (i ? 'L' : 'M') + (i / N * w).toFixed(1) + ' ' + ((1 - (v + 1) / 2) * (h - 4) + 2).toFixed(1); }
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}" fill="none" stroke="${c}" stroke-width="${sw || 2}" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  };

  /* =====================================================================
   * A  VOLATILITY — light, fear-gauge + wobbling line
   * ===================================================================== */
  

  /* =====================================================================
   * B  HEARTBEAT — bedside patient monitor, phosphor ECG sweep
   * ===================================================================== */
  

  /* =====================================================================
   * C  WHIPSAW — riso-print poster: saw blade, cut line, CRACK
   * ===================================================================== */
  function buildC(root, P) {
    const INK = '#1b1a1f', PINK = '#ff3e80', CYAN = '#1fb6c9', YEL = '#ffcb2e', PAPER = '#f4ecd6';
    const faders = [['rate', 'RATE'], ['depth', 'BITE'], ['pan', 'THROW'], ['stereo', 'OFFSET'], ['smooth', 'SANDING']];
    root.innerHTML = `<style>
      *{box-sizing:border-box}
      .f{position:absolute;inset:0;background:${PAPER};color:${INK};font-family:'Archivo Black','Arial Black',Impact,${SANS};overflow:hidden}
      .f::before{content:'';position:absolute;inset:0;background:radial-gradient(rgba(27,26,31,.13) 1px,transparent 1.4px) 0 0/7px 7px;pointer-events:none}
      .logo{position:absolute;left:24px;top:14px;line-height:.86}
      .logo b{font-size:54px;letter-spacing:-.02em;text-shadow:3px 3px 0 ${PINK},6px 6px 0 ${CYAN};text-transform:uppercase;font-weight:900;font-family:'Archivo Black','Arial Black',Impact,sans-serif}
      .logo small{display:block;margin-top:12px;font-family:${MONO};font-size:10px;font-weight:600;letter-spacing:.2em}
      .tag{position:absolute;left:376px;top:16px;display:flex;align-items:center;gap:6px}
      .tb{all:unset;cursor:pointer;width:34px;height:34px;background:${YEL};border:3px solid ${INK};box-shadow:3px 3px 0 ${INK};display:grid;place-items:center;font-size:13px}
      .tb:active{transform:translate(3px,3px);box-shadow:0 0 0 ${INK}}
      .tn{all:unset;cursor:pointer;width:220px;height:34px;background:#fff;border:3px solid ${INK};box-shadow:3px 3px 0 ${INK};display:flex;align-items:center;gap:10px;padding:0 12px;font-family:${MONO};font-weight:700;font-size:13px;text-transform:uppercase}
      .tn i{font-style:normal;background:${INK};color:${PAPER};padding:1px 5px;font-size:11px}
      .pop{display:none;position:absolute;left:40px;top:44px;width:230px;background:#fff;border:3px solid ${INK};box-shadow:5px 5px 0 ${INK};z-index:9}
      .pop.open{display:block}.pop button{all:unset;cursor:pointer;display:block;width:100%;padding:7px 12px;font-family:${MONO};font-size:12px;font-weight:700;text-transform:uppercase;box-sizing:border-box;border-bottom:2px dashed #ccc}
      .pop button:hover{background:${YEL}}.pop button.on{background:${INK};color:${PAPER}}
      .lev{position:absolute;right:26px;top:12px;width:130px;height:46px;cursor:pointer;display:block;background:none;border:0;padding:0}
      .lev .slot{position:absolute;left:0;right:0;top:12px;height:22px;background:#fff;border:3px solid ${INK};box-shadow:3px 3px 0 ${INK}}
      .lev .knob{position:absolute;top:4px;left:6px;width:58px;height:38px;background:${PINK};border:3px solid ${INK};box-shadow:3px 3px 0 ${INK};display:grid;place-items:center;color:${INK};font-size:12px;transition:left .12s}
      .lev.on .knob{left:62px;background:${CYAN}}
      .lev .knob::after{content:'OFF'}.lev.on .knob::after{content:'CUT'}
      .blade{position:absolute;left:18px;top:98px;width:300px;height:300px}
      .shot{position:absolute;left:336px;top:84px;width:598px;height:318px;background:#fff;border:4px solid ${INK};box-shadow:7px 7px 0 ${INK}}
      .shot canvas{position:absolute;left:0;top:0}
      .rv{position:absolute;right:14px;top:10px;font-family:${MONO};font-size:11px;font-weight:700;text-align:right;line-height:1.5}
      .rv b{background:${INK};color:${PAPER};padding:0 5px}
      .crack{position:absolute;left:30px;top:30px;pointer-events:none;opacity:0;transform:rotate(-8deg) scale(.7);transition:opacity .25s,transform .25s}
      .crack.go{opacity:1;transform:rotate(-8deg) scale(1);transition:none}
      .deck{position:absolute;left:20px;right:20px;top:420px;height:122px;display:flex;gap:14px;align-items:flex-start}
      .fd{width:92px;text-align:center}
      .fd .tr{position:relative;width:34px;height:84px;margin:0 auto;background:${INK};border:3px solid ${INK};cursor:ns-resize;touch-action:none;box-shadow:3px 3px 0 ${PINK}}
      .fd .tr::before{content:'';position:absolute;left:50%;top:6px;bottom:6px;width:4px;margin-left:-2px;background:repeating-linear-gradient(0deg,${PAPER} 0 3px,transparent 3px 7px)}
      .fd .tr i{position:absolute;left:0;right:0;bottom:0;height:calc(var(--v)*100%);background:${YEL};opacity:.0}
      .fd .tr b{position:absolute;left:-9px;right:-9px;height:20px;bottom:calc(var(--v)*(100% - 20px));background:${CYAN};border:3px solid ${INK};box-shadow:2px 2px 0 ${INK}}
      .fd .tr b::after{content:'';position:absolute;left:3px;right:3px;top:5px;height:3px;background:${INK}}
      .fd .tr.drag b{background:${PINK}}
      .fd label{display:block;margin-top:5px;font-size:11px;letter-spacing:.06em}
      .fd output{display:block;font-family:${MONO};font-size:11px;font-weight:700}
      .shp{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;width:312px;margin-left:6px}
      .shp button{all:unset;white-space:nowrap;cursor:pointer;height:84px;background:#fff;border:3px solid ${INK};box-shadow:3px 3px 0 ${INK};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;font-size:9px;letter-spacing:.04em;text-transform:uppercase}
      .shp button svg{width:50px;height:30px}
      .shp button.on{background:${PINK};transform:translate(3px,3px);box-shadow:0 0 0 ${INK};color:${INK}}
      .mtr{display:flex;gap:10px;margin-left:auto}
      .mtr .c{width:36px;text-align:center;font-size:10px}
      .mtr .seg{height:84px;display:flex;flex-direction:column-reverse;gap:2px;margin-bottom:5px}
      .mtr .seg i{height:6px;border:2px solid ${INK};background:#fff;display:block}
      .mtr .seg i.on{background:${CYAN}}.mtr .seg i.on.y{background:${YEL}}.mtr .seg i.on.r{background:${PINK}}
      .mtr output{font-family:${MONO};font-size:9px;font-weight:700;display:block}
    </style>
    <div class="f">
      <div class="logo"><b>Whipsaw</b><small>TREMOLO / AUTO-PAN &middot; CUT THE LEVEL, CRACK THE EDGE</small></div>
      <div class="tag"><button class="tb" data-prev>&#9664;</button><button class="tn" data-popbtn=".pop"><i data-pidx>01</i><span data-pname>Init</span></button><button class="tb" data-next>&#9654;</button>
        <div class="pop">${plist(P, (p, i) => `<button data-pl="${i}">${p.name}</button>`)}</div></div>
      <button class="lev" data-byp title="Effect on / off"><span class="slot"></span><span class="knob"></span></button>
      <canvas class="blade" id="bl" width="600" height="600"></canvas>
      <div class="shot"><canvas id="sc" width="1180" height="620" style="width:590px;height:310px"></canvas>
        <div class="rv"><b id="rs">SINE</b> <b id="rr">5.0 Hz</b><br>cutting <span id="rc">2 cycles</span></div>
        <svg class="crack" id="ck" width="170" height="96" viewBox="0 0 170 96"><polygon points="85,2 100,28 132,10 122,40 166,44 128,58 150,88 108,72 90,94 72,70 30,86 50,56 4,48 48,36 28,8 66,26" fill="${YEL}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><text x="85" y="56" text-anchor="middle" font-size="22" font-family="Archivo Black,Arial Black,Impact,sans-serif" fill="${INK}">CRACK!</text></svg></div>
      <div class="deck">${faders.map(k => `<div class="fd"><div class="tr" data-p="${k[0]}" data-abs="y"><i></i><b></b></div><label>${k[1]}</label><output data-t="${k[0]}"></output></div>`).join('')}
        <div class="shp">${SHAPE_NAMES.map((n, i) => `<button data-shape="${i}">${shapeGlyph(i, INK, 50, 30, 3)}${['Smooth', 'Zigzag', 'Chop', 'Ripsaw'][i]}</button>`).join('')}</div>
        <div class="mtr"><div class="c">IN<div class="seg" id="li"></div><output id="lio">-inf</output></div><div class="c">OUT<div class="seg" id="lo"></div><output id="loo">-inf</output></div></div></div>
    </div>`;
    const $ = s => root.querySelector(s);
    wire(root, P);
    ['li', 'lo'].forEach(id => { const e = $('#' + id); for (let i = 0; i < 12; i++) { const s = document.createElement('i'); if (i >= 11) s.className = 'r'; else if (i >= 8) s.className = 'y'; e.appendChild(s); } });
    const segs = { i: [...$('#li').children], o: [...$('#lo').children] };
    P.sub('shape', i => { $('#rs').textContent = SHAPE_NAMES[i | 0].toUpperCase(); });
    P.sub('rate', v => { $('#rr').textContent = hz(v); });
    const SC = cv($('#sc')), BL = cv($('#bl'));
    let crackT = 0, spin = 0, pk = [-90, -90], dust = [];
    const S = model(P);
    function drawBlade() {
      const { c, w, h } = BL; c.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2 - 10, R = 128, N = 28, kerf = S.depth;
      const tooth = (off, col, stroke) => {
        c.save(); c.translate(cx + off, cy + off); c.rotate(spin);
        c.beginPath();
        for (let i = 0; i < N; i++) { const a0 = i / N * TAU, a1 = (i + 0.92) / N * TAU; const r1 = R - 14 - 12 * kerf; c.lineTo(Math.cos(a0) * R, Math.sin(a0) * R); c.lineTo(Math.cos(a1) * r1, Math.sin(a1) * r1); }
        c.closePath(); c.fillStyle = col; c.fill(); if (stroke) { c.lineWidth = 4; c.strokeStyle = INK; c.lineJoin = 'round'; c.stroke(); }
        c.restore();
      };
      tooth(9, CYAN, false); tooth(0, '#fff', true);
      c.save(); c.translate(cx, cy); c.rotate(spin);
      c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 76, 0, TAU); c.stroke();
      for (let i = 0; i < 6; i++) { c.save(); c.rotate(i / 6 * TAU); c.fillStyle = PAPER; c.lineWidth = 3; c.beginPath(); c.ellipse(0, -98, 10, 18, 0, 0, TAU); c.fill(); c.stroke(); c.restore(); }
      c.fillStyle = PINK; c.beginPath(); c.arc(0, 0, 42, 0, TAU); c.fill(); c.lineWidth = 4; c.stroke();
      c.fillStyle = INK; c.beginPath(); c.arc(0, 0, 9, 0, TAU); c.fill();
      // single marker tooth = LFO phase 0
      c.fillStyle = YEL; c.beginPath(); c.moveTo(R + 4, 0); c.lineTo(R - 22, -10); c.lineTo(R - 22, 10); c.closePath(); c.fill(); c.stroke();
      c.restore();
      // guard / cut line under blade
      c.fillStyle = INK; c.font = '700 11px ' + MONO; c.textAlign = 'center'; c.fillText('1 TURN = 1 CYCLE', cx, h - 6);
    }
    function drawCut() {
      const { c, w, h } = SC; c.clearRect(0, 0, w, h);
      const X0 = 16, X1 = w - 16, Y0 = 52, Y1 = h - 28;
      c.strokeStyle = '#d9d3c0'; c.lineWidth = 1.2; c.setLineDash([]);
      for (let i = 0; i <= 8; i++) { const x = lerp(X0, X1, i / 8); c.beginPath(); c.moveTo(x, Y0 - 10); c.lineTo(x, Y1 + 6); c.stroke(); if (i < 8) { c.fillStyle = '#b2ab95'; c.font = '9px ' + MONO; c.textAlign = 'center'; c.fillText(i % 4 === 0 ? '|' : '.', x, Y1 + 18); } }
      c.beginPath(); c.moveTo(X0, Y1); c.lineTo(X1, Y1); c.stroke();
      const Y = g => lerp(Y1, Y0, g);
      const path = off => { c.beginPath(); for (let i = 0; i <= 320; i++) { const x = lerp(X0, X1, i / 320), y = Y(S.gain(S.at(i / 320 * 2 - off))); i ? c.lineTo(x, y) : c.moveTo(x, y); } };
      // R (cyan) offset print then L (pink) over with ink edge
      const off = S.stereo * 0.5;
      path(off); c.lineJoin = 'miter'; c.lineWidth = 9; c.strokeStyle = CYAN; c.save(); c.translate(5, 5); c.stroke(); c.restore();
      path(0); c.lineWidth = 11; c.strokeStyle = INK; c.stroke(); c.lineWidth = 6; c.strokeStyle = PINK; c.stroke();
      // sawdust
      dust.forEach(d => { c.fillStyle = d.c; c.globalAlpha = clamp(d.l, 0, 1); c.fillRect(d.x, d.y, 4, 4); }); c.globalAlpha = 1;
      // playhead blade
      const hx = lerp(X0, X1, S.ph / 2), hy = Y(S.gain(S.lfo));
      c.strokeStyle = INK; c.lineWidth = 3; c.setLineDash([8, 5]); c.beginPath(); c.moveTo(hx, Y0 - 24); c.lineTo(hx, Y1); c.stroke(); c.setLineDash([]);
      c.fillStyle = YEL; c.lineWidth = 4; c.beginPath(); c.moveTo(hx, hy + 2); c.lineTo(hx - 12, hy - 20); c.lineTo(hx + 12, hy - 20); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = INK; c.font = '700 12px ' + MONO; c.textAlign = 'left'; c.fillText('LEVEL ' + Math.round(S.gain(S.lfo) * 100) + '%', 18, 24);
      c.fillStyle = PINK; c.fillRect(18, h - 12, 22, 5); c.fillStyle = INK; c.font = '10px ' + MONO; c.fillText('L', 44, h - 6); c.fillStyle = CYAN; c.fillRect(66, h - 12, 22, 5); c.fillStyle = INK; c.fillText('R' + (S.stereo > 0.01 ? ' +' + Math.round(S.stereo * 180) + '°' : ''), 92, h - 6);
      const pt = S.pan; if (pt > 0.01) { c.fillText('PAN THROW ' + Math.round(pt * 100) + '%  ' + (S.lfo < -0.1 ? '<< LEFT' : S.lfo > 0.1 ? 'RIGHT >>' : 'CENTRE'), w - 190, h - 6); }
    }
    P.raf(t => {
      const dt = S.step(t);
      spin = S.ph * TAU;
      if (S.shape >= 2 && Math.abs(S.dl) > 0.5 && S.depth > 0.25) { crackT = 0.35; const ck = $('#ck'); ck.classList.add('go'); const ang = S.lfo; for (let i = 0; i < 8; i++) dust.push({ x: 300 + Math.random() * 600, y: 140 + Math.random() * 80, vx: (Math.random() - .5) * 120, vy: -40 - Math.random() * 90, l: 1, c: Math.random() < .5 ? PINK : INK }); void ang; }
      if (crackT > 0) { crackT -= dt; if (crackT <= 0) $('#ck').classList.remove('go'); }
      dust.forEach(d => { d.x += d.vx * dt; d.y += d.vy * dt; d.vy += 300 * dt; d.l -= dt * 1.6; }); dust = dust.filter(d => d.l > 0).slice(-60);
      drawBlade(); drawCut();
      const di = clamp(dbOf(S.inPeak), -90, 6), dO = clamp(dbOf(S.outPeak), -90, 6);
      pk[0] = Math.max(di, pk[0] - 40 * dt); pk[1] = Math.max(dO, pk[1] - 40 * dt);
      [[segs.i, pk[0], '#lio'], [segs.o, pk[1], '#loo']].forEach(([sg, d, id]) => { const n = Math.round(clamp((d + 48) / 48, 0, 1) * 12); sg.forEach((s, i) => s.classList.toggle('on', i < n)); $(id).textContent = d <= -89 ? '-inf' : d.toFixed(0); });
    });
  }

  Kit.register('trem', {
    fonts: 'family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;600&family=Archivo+Black',
    w: 940, h: 540,
    labels: { rate: 'Rate', depth: 'Depth', pan: 'Pan', stereo: 'Stereo', smooth: 'Smooth' },
    fmts: {
      rate: v => v.toFixed(1) + ' Hz', depth: v => Math.round(v * 100) + '%', pan: v => Math.round(v * 100) + '%',
      stereo: v => Math.round(v * 180) + '°', smooth: v => Math.round(v * 100) + '%'
    },
    presets,
    faces: [
      undefined,
      undefined,
      { key: 'C', name: 'Whipsaw', accent: '#ff3e80', w: 960, h: 540, build: buildC }
    ].filter(Boolean)
  });
})();
