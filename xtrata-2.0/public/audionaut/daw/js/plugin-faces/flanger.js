import { Kit } from "./runtime.js";
/* flanger — Flanger. Faces: A Slippage (ghosted order lines, motion blur) / B Fomo (launch poster, speed lines) / C Washtrade (washing-machine porthole spiral) */
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const MONO = "ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace";
  const FMIN = 30, FMAX = 18000, LOOP_EXTRA = 2.67;
  const lx = f => Math.log(f / FMIN) / Math.log(FMAX / FMIN);          // freq -> 0..1
  const xl = u => FMIN * Math.pow(FMAX / FMIN, u);                     // 0..1 -> freq
  const fq = f => f >= 1000 ? (f / 1000).toFixed(f >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(Math.round(f));

  const presets = [
    { name: 'Jet Sweep', values: { rate: 0.15, depth: 3.5, feedback: 0.75, mix: 0.5, manual: 3, stereo: 0.3, polarity: 'pos' } },
    { name: 'Hollow Tube', values: { rate: 0.25, depth: 2, feedback: 0.8, mix: 0.5, manual: 4, stereo: 0, polarity: 'neg' } },
    { name: 'Slow Drift', values: { rate: 0.08, depth: 1.5, feedback: 0.3, mix: 0.4, manual: 5, stereo: 0.2, polarity: 'pos' } },
    { name: 'Wide Shimmer', values: { rate: 0.4, depth: 1, feedback: 0.5, mix: 0.5, manual: 2, stereo: 1, polarity: 'pos' } },
    { name: 'Metal Resonator', values: { rate: 0.05, depth: 0.4, feedback: 0.88, mix: 0.6, manual: 1.5, stereo: 0, polarity: 'pos' } },
    { name: 'Barber Pole', values: { rate: 1.2, depth: 2.5, feedback: 0.6, mix: 0.5, manual: 3, stereo: 0.6, polarity: 'neg' } },
    { name: 'Init', values: {} }
  ];

  /* exact comb from DSP_NOTES_B: wet = e^-jwd / (1 - s*fb*e^-jw(d+2.67)); out = (1-mix) + mix*wet */
  function comb(f, d, fb, neg, mix) {
    const w = 2 * Math.PI * f / 1000, s = neg ? -1 : 1, D = d + LOOP_EXTRA;
    const dr = 1 - s * fb * Math.cos(w * D), di = s * fb * Math.sin(w * D);
    const den = dr * dr + di * di;
    // wet = (cos(wd) - j sin(wd)) * (dr - j di)/den  (1/(dr + j di) = (dr - j di)/den)
    const c = Math.cos(w * d), sn = Math.sin(w * d);
    const wr = (c * dr - sn * di) / den, wi = (-c * di - sn * dr) / den;
    const re = (1 - mix) + mix * wr, im = mix * wi;
    return 10 * Math.log10(re * re + im * im + 1e-6);
  }
  function state(P) {
    const m = P.meter() || {};
    const manual = P.get('manual');
    const d = typeof m.delay === 'number' && isFinite(m.delay) ? m.delay : Math.max(LOOP_EXTRA, manual);
    return { m, d, lfo: typeof m.lfo === 'number' ? m.lfo : 0, fb: P.get('feedback'), neg: P.real('polarity') === 'neg', mix: P.get('mix'),
      manual, depth: P.get('depth'), rate: P.get('rate'), stereo: P.get('stereo'),
      inP: clamp(m.inPeak || 0, 0, 1.5), outP: clamp(m.outPeak || 0, 0, 1.5) };
  }
  function curve(S, n, d) {
    const a = new Float32Array(n);
    for (let i = 0; i < n; i++) a[i] = comb(xl(i / (n - 1)), d == null ? S.d : d, S.fb, S.neg, S.mix);
    return a;
  }
  const lvl = (x) => clamp((20 * Math.log10(x + 1e-5) + 60) / 60, 0, 1);

  function wire(root, P) {
    root.querySelectorAll('[data-p]').forEach(el => {
      const o = {}; if (el.dataset.abs) { o.abs = true; o.axis = el.dataset.abs; } if (el.dataset.ax) o.axis = el.dataset.ax; if (el.dataset.rng) o.range = +el.dataset.rng;
      P.bind(el, el.dataset.p, o);
    });
    root.querySelectorAll('[data-t]').forEach(el => P.text(el, el.dataset.t));
    root.querySelectorAll('[data-byp]').forEach(el => P.bind(el, '__bypass'));
    const n = P.presets.length; let idx = -1;
    P.onPreset((i, nm) => {
      idx = i;
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = nm || 'Custom'; });
      root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = i < 0 ? '--' : String(i + 1).padStart(2, '0'); });
      root.querySelectorAll('[data-pl]').forEach(e => e.classList.toggle('on', +e.dataset.pl === i));
    });
    root.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx - 1 + n) % n)));
    root.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx + 1) % n)));
    root.querySelectorAll('[data-pl]').forEach(b => b.addEventListener('click', () => P.loadPreset(+b.dataset.pl)));
  }
  const plist = (P, f) => P.presets.map((p, i) => f(p, i)).join('');
  function fit(cv) { // returns 2d ctx scaled so drawing coords = css px of declared w/h
    const g = cv.getContext('2d'); g.setTransform(cv.width / (cv.clientWidth || cv.width), 0, 0, cv.height / (cv.clientHeight || cv.height), 0, 0); return g;
  }

  /* ======================= A  SLIPPAGE ======================= */
  function buildA(root, P) {
    const W = 920, H = 540;
    const sl = (k, l, sub) => `<div class="sl"><div class="lb"><span>${l}</span><i>${sub}</i><b data-t="${k}"></b></div><div class="tr" data-p="${k}" data-abs="x"><u></u><u class="g2"></u><s></s><s class="g"></s></div></div>`;
    root.innerHTML = `<style>
      .f{position:absolute;inset:0;overflow:hidden;color:#1b1840;font-family:${SANS};
        background:repeating-linear-gradient(100deg,rgba(120,100,220,.045) 0 2px,transparent 2px 14px),linear-gradient(180deg,#f1effa,#dedaf0)}
      .wm{position:absolute;left:24px;top:14px;font:italic 900 40px/1 ${SANS};letter-spacing:-.02em;color:#1b1840;text-shadow:5px 0 0 rgba(255,45,140,.38),10px 0 0 rgba(255,45,140,.2),15px 0 0 rgba(255,45,140,.1),-5px 0 0 rgba(0,190,230,.35),-10px 0 0 rgba(0,190,230,.15)}
      .sub{position:absolute;left:28px;top:60px;font:600 10px ${MONO};letter-spacing:.18em;color:#6a62a8;text-transform:uppercase}
      .slip{position:absolute;left:330px;top:18px;font:700 11px ${MONO};color:#6a62a8;line-height:1.5}
      .slip b{font-size:22px;color:#1b1840;display:block;letter-spacing:-.02em}.slip em{font-style:normal;color:#ff2d8c}
      .byp{all:unset;position:absolute;right:24px;top:22px;cursor:pointer;font:800 12px ${MONO};letter-spacing:.14em;padding:8px 16px;border:2px solid #1b1840;border-radius:3px;color:#1b1840;background:#f1effa;
        box-shadow:4px 0 0 -0px rgba(255,45,140,.4),8px 0 0 rgba(255,45,140,.18),-4px 0 0 rgba(0,190,230,.4),-8px 0 0 rgba(0,190,230,.18)}
      .byp.on{background:#1b1840;color:#fff}
      .pol{position:absolute;right:168px;top:22px;display:flex;border:2px solid #1b1840;border-radius:3px;overflow:hidden;cursor:pointer;font:800 12px ${MONO};background:#f1effa;box-shadow:4px 0 0 rgba(255,45,140,.3),8px 0 0 rgba(255,45,140,.14)}
      .pol span{padding:8px 14px;letter-spacing:.1em}.pol[data-index="0"] span:first-child{background:#1b1840;color:#fff}.pol[data-index="1"] span:last-child{background:#ff2d8c;color:#fff}
      .polc{position:absolute;right:168px;top:0;font:600 9px ${MONO};letter-spacing:.14em;color:#6a62a8;top:8px;text-transform:uppercase}
      .rail{position:absolute;left:20px;top:92px;width:170px;display:flex;flex-direction:column;gap:7px}
      .rail h3{margin:0 0 2px;font:700 9px ${MONO};letter-spacing:.2em;color:#6a62a8}
      .tk{all:unset;cursor:pointer;display:block;position:relative;padding:8px 10px;font:700 12px ${SANS};background:#f8f7fd;border:1.5px solid #1b184055;border-radius:2px;color:#4a4580}
      .tk:before{content:'';position:absolute;inset:0;border:1.5px solid rgba(255,45,140,.45);transform:translate(4px,0);opacity:0;border-radius:2px;pointer-events:none}
      .tk:after{content:'';position:absolute;inset:0;border:1.5px solid rgba(0,190,230,.5);transform:translate(-4px,0);opacity:0;border-radius:2px;pointer-events:none}
      .tk.on{color:#1b1840;border-color:#1b1840;background:#fff}.tk.on:before,.tk.on:after{opacity:1}
      .tk small{float:right;font:600 9px ${MONO};opacity:.55;margin-top:2px}
      .nav{display:flex;gap:7px;margin-top:2px}.nav button{all:unset;cursor:pointer;flex:1;text-align:center;padding:5px;border:1.5px solid #1b1840;font:800 12px ${MONO};border-radius:2px}
      .nav button:hover{background:#1b1840;color:#fff}
      .disp{position:absolute;left:212px;top:92px;width:688px;height:252px;background:#fbfaff;border:2px solid #1b1840;border-radius:3px;box-shadow:6px 6px 0 rgba(255,45,140,.18),-6px -6px 0 rgba(0,190,230,.16)}
      .disp canvas{position:absolute;inset:0;width:100%;height:100%}
      .mt{position:absolute;left:212px;top:358px;width:688px;display:grid;grid-template-columns:1fr 1fr;gap:24px}
      .mt div{position:relative;height:16px;background:#fbfaff;border:1.5px solid #1b1840;border-radius:2px;overflow:hidden}
      .mt canvas{position:absolute;inset:0;width:100%;height:100%}
      .mt span{position:absolute;left:6px;top:1px;font:800 9px ${MONO};letter-spacing:.14em;color:#1b1840;z-index:2}
      .sls{position:absolute;left:212px;top:396px;width:688px;display:grid;grid-template-columns:repeat(3,1fr);gap:14px 26px}
      .sl .lb{display:flex;align-items:baseline;gap:6px;margin-bottom:4px;font:800 11px ${SANS};letter-spacing:.04em;text-transform:uppercase}
      .sl .lb i{font:500 9px ${MONO};font-style:normal;color:#8a83c0;text-transform:none;letter-spacing:0}.sl .lb b{margin-left:auto;font:700 12px ${MONO};color:#ff2d8c}
      .tr{position:relative;height:30px;cursor:ew-resize;touch-action:none}
      .tr u{position:absolute;left:0;right:0;top:13px;height:3px;background:#1b184033;border-radius:2px}
      .tr u.g2{background:repeating-linear-gradient(90deg,#1b1840 0 1px,transparent 1px 12px);height:8px;top:10px;opacity:.25}
      .tr s{position:absolute;top:3px;width:12px;height:24px;margin-left:-6px;left:calc(var(--v)*100%);background:#1b1840;border-radius:2px;text-decoration:none}
      .tr s.g{background:none;border:1.5px solid rgba(255,45,140,.6);width:12px;transform:translateX(-14px);box-shadow:-10px 0 0 -1px rgba(255,45,140,.3),-20px 0 0 -1px rgba(255,45,140,.15)}
      .tr s:not(.g){box-shadow:0 0 0 2px #f1effa,3px 0 0 2px rgba(0,190,230,.5)}
    </style>
    <div class="f">
      <div class="wm">SLIPPAGE</div><div class="sub">flanger · quoted vs filled</div>
      <div class="slip">quoted <em id="q">4.00 ms</em><b id="fill">4.00 ms</b>filled · slip <em id="sp">+0.00</em></div>
      <div class="sls">${sl('rate', 'Rate', 'sweep speed')}${sl('depth', 'Depth', 'slip range')}${sl('manual', 'Manual', 'quote price')}${sl('feedback', 'Feedback', 'echo of fills')}${sl('mix', 'Mix', 'fill / quote')}${sl('stereo', 'Stereo', 'L / R offset')}</div>
      <div class="polc">feedback sign</div>
      <div class="pol" data-p="polarity"><span>+ POS</span><span>&minus; NEG</span></div>
      <button class="byp" data-byp>LIVE</button>
      <div class="rail"><h3>ORDER BOOK / PRESETS</h3>${plist(P, (p, i) => `<button class="tk" data-pl="${i}">${p.name}<small>#${String(i + 1).padStart(2, '0')}</small></button>`)}
        <div class="nav"><button data-prev>&lsaquo;</button><button data-next>&rsaquo;</button></div></div>
      <div class="disp"><canvas id="cv" width="1376" height="504"></canvas></div>
      <div class="mt"><div><span>IN</span><canvas id="mi" width="688" height="32"></canvas></div><div><span>OUT</span><canvas id="mo" width="688" height="32"></canvas></div></div>
    </div>`;
    const $ = s => root.querySelector(s);
    wire(root, P);
    P.sub('__bypass', on => { $('.byp').textContent = on ? 'LIVE' : 'BYPASSED'; });
    const hist = [], cv = $('#cv'), mi = $('#mi'), mo = $('#mo');
    let lastPush = 0, trailI = 0, trailO = 0, pI = 0, pO = 0;
    P.raf(t => {
      const S = state(P), g = fit(cv), w = 688, h = 252;
      g.clearRect(0, 0, w, h);
      // grid
      const yDb = db => 28 + (1 - (db + 30) / 54) * (h - 56);   // -30..+24
      g.font = '600 9px ' + MONO; g.textBaseline = 'middle';
      for (const db of [-24, -12, 0, 12, 24]) { g.strokeStyle = db === 0 ? 'rgba(27,24,64,.35)' : 'rgba(27,24,64,.1)'; g.lineWidth = 1; g.beginPath(); g.moveTo(34, yDb(db)); g.lineTo(w - 8, yDb(db)); g.stroke(); g.fillStyle = '#8a83c0'; g.fillText((db > 0 ? '+' : '') + db, 6, yDb(db)); }
      g.textBaseline = 'alphabetic';
      for (const f of [50, 100, 200, 500, 1000, 2000, 5000, 10000]) { const x = 34 + lx(f) * (w - 44); g.strokeStyle = 'rgba(27,24,64,.08)'; g.beginPath(); g.moveTo(x, 10); g.lineTo(x, h - 20); g.stroke(); g.fillStyle = '#8a83c0'; g.fillText(fq(f), x - 6, h - 6); }
      // history ghosts
      if (t - lastPush > 55) { lastPush = t; hist.unshift(S.d); if (hist.length > 9) hist.pop(); }
      const N = 220, X = i => 34 + (i / (N - 1)) * (w - 44);
      for (let k = hist.length - 1; k >= 1; k--) {
        const c = curve(S, N, hist[k]), a = 0.5 * (1 - k / hist.length), off = k * 3.2;
        g.beginPath(); for (let i = 0; i < N; i++) { const y = yDb(clamp(c[i], -30, 24)); i ? g.lineTo(X(i) + off, y) : g.moveTo(X(i) + off, y); }
        g.strokeStyle = `rgba(255,45,140,${a * 0.55})`; g.lineWidth = 1.5; g.stroke();
        g.beginPath(); for (let i = 0; i < N; i++) { const y = yDb(clamp(c[i], -30, 24)); i ? g.lineTo(X(i) - off, y) : g.moveTo(X(i) - off, y); }
        g.strokeStyle = `rgba(0,190,230,${a * 0.5})`; g.stroke();
      }
      const c = curve(S, N);
      // motion-blur streak under main curve
      for (let k = 6; k >= 1; k--) { g.beginPath(); for (let i = 0; i < N; i++) { const y = yDb(clamp(c[i], -30, 24)); i ? g.lineTo(X(i) + k * 5 * S.lfo, y) : g.moveTo(X(i) + k * 5 * S.lfo, y); } g.strokeStyle = `rgba(27,24,64,${0.05 * (7 - k)})`; g.lineWidth = 3; g.stroke(); }
      g.beginPath(); for (let i = 0; i < N; i++) { const y = yDb(clamp(c[i], -30, 24)); i ? g.lineTo(X(i), y) : g.moveTo(X(i), y); }
      g.lineTo(X(N - 1), yDb(-30)); g.lineTo(X(0), yDb(-30)); g.closePath();
      const gr = g.createLinearGradient(0, 20, 0, h); gr.addColorStop(0, 'rgba(255,45,140,.16)'); gr.addColorStop(1, 'rgba(0,190,230,.04)'); g.fillStyle = gr; g.fill();
      g.beginPath(); for (let i = 0; i < N; i++) { const y = yDb(clamp(c[i], -30, 24)); i ? g.lineTo(X(i), y) : g.moveTo(X(i), y); }
      g.strokeStyle = '#1b1840'; g.lineWidth = 2.4; g.lineJoin = 'round'; g.stroke();
      // price line: first notch marker (jet streak)
      const fN = 1000 / (2 * S.d);
      if (fN > FMIN && fN < FMAX) { const x = 34 + lx(fN) * (w - 44);
        for (let k = 0; k < 14; k++) { g.fillStyle = `rgba(255,45,140,${0.35 * (1 - k / 14)})`; g.fillRect(x + 3 + k * 6 * (S.lfo >= 0 ? 1 : -1) * 0 + k * 5, 12 + ((k * 7) % 5), 3 + 9 * (1 - k / 14) * 3, 1.5); }
        g.strokeStyle = '#ff2d8c'; g.setLineDash([5, 4]); g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, 18); g.lineTo(x, h - 20); g.stroke(); g.setLineDash([]);
        g.fillStyle = '#ff2d8c'; g.font = '800 10px ' + MONO; g.fillText('N1 ' + fq(fN), clamp(x + 6, 40, w - 70), 30); }
      g.fillStyle = '#6a62a8'; g.font = '700 9px ' + MONO; g.fillText('ghost = last 0.5 s of slippage', w - 188, 18);
      // meters with trails
      const mk = (cvm, v, trail, col) => { const q = fit(cvm); q.clearRect(0, 0, 688, 16); const W2 = 340; // css width of cell
        for (let k = 5; k >= 1; k--) { q.fillStyle = col.replace('A', (0.08 * (6 - k)).toFixed(2)); q.fillRect(0, 0, clamp(trail - k * 0.012, 0, 1) * W2, 16); }
        q.fillStyle = '#1b1840'; q.fillRect(0, 0, v * W2, 16); q.fillStyle = '#ff2d8c'; q.fillRect(trail * W2 - 2, 0, 2, 16); };
      pI = lvl(S.inP); pO = lvl(S.outP); trailI = Math.max(pI, trailI - 0.012); trailO = Math.max(pO, trailO - 0.012);
      mk(mi, pI, trailI, 'rgba(255,45,140,A)'); mk(mo, pO, trailO, 'rgba(0,190,230,A)');
      const slip = S.d - S.manual;
      $('#q').textContent = S.manual.toFixed(2) + ' ms'; $('#fill').textContent = S.d.toFixed(2) + ' ms'; $('#sp').textContent = (slip >= 0 ? '+' : '') + slip.toFixed(2);
    });
  }

  /* ======================= B  FOMO ======================= */
  

  /* ======================= C  WASHTRADE ======================= */
  

  Kit.register('flanger', {
    fonts: '',
    w: 920, h: 540,
    presets,
    faces: [
      { key: 'A', name: 'Slippage', accent: '#ff2d8c', w: 920, h: 540, build: buildA },
      undefined,
      undefined
    ].filter(Boolean)
  });
})();
