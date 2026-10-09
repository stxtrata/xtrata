import { Kit } from "./runtime.js";
/* eq3 — Parametric 6-band EQ. Faces: A Orderbook · B Fibonacci · C Chartist
 * Real keys: low lowFreq mid midFreq high highFreq lowCutSlope lowCut highCutSlope highCut midQ mid2 mid2Freq mid2Q out */
(function () {
  'use strict';
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const LF = Math.log(1000);
  const fx = f => Math.log(f / 20) / LF;            // 20 Hz..20 kHz -> 0..1
  const xf = n => 20 * Math.exp(clamp(n, 0, 1) * LF);
  const NF = 220, FREQS = new Float32Array(NF);
  for (let i = 0; i < NF; i++) FREQS[i] = xf(i / (NF - 1));
  const interp = (arr, n) => { const t = clamp(n, 0, 1) * (NF - 1), i = Math.floor(t), j = Math.min(NF - 1, i + 1); return arr[i] + (arr[j] - arr[i]) * (t - i); };
  const trim = s => (s.indexOf('.') >= 0 ? s.replace(/\.?0+$/, '') : s);
  const fq = v => (v >= 1000 ? trim((v / 1000).toFixed(v >= 10000 ? 1 : 2)) + 'k' : String(Math.round(v)));
  const sg = (v, d) => (v > 0.0001 ? '+' : v < -0.0001 ? '−' : '') + Math.abs(v).toFixed(d == null ? 1 : d);
  const pad2 = n => String(n).padStart(2, '0');
  const MONO = "ui-monospace,Menlo,Consolas,'DejaVu Sans Mono','Courier New',monospace";

  const BANDS = [
    { id: 'lc', name: 'Low cut', tag: 'LC', cut: true, f: 'lowCut', slope: 'lowCutSlope' },
    { id: 'lo', name: 'Low shelf', tag: 'LO', f: 'lowFreq', g: 'low' },
    { id: 'm1', name: 'Mid 1', tag: 'M1', f: 'midFreq', g: 'mid', q: 'midQ' },
    { id: 'm2', name: 'Mid 2', tag: 'M2', f: 'mid2Freq', g: 'mid2', q: 'mid2Q' },
    { id: 'hi', name: 'High shelf', tag: 'HI', f: 'highFreq', g: 'high' },
    { id: 'hc', name: 'High cut', tag: 'HC', cut: true, f: 'highCut', slope: 'highCutSlope' }
  ];

  /* pointer drag helper (pointer capture) */
  function drag(el, move, start, end) {
    let on = false;
    el.addEventListener('pointerdown', e => { if (e.button) return; try { el.setPointerCapture(e.pointerId); } catch (x) { /* synthetic */ } on = true; if (start) start(e); e.preventDefault(); e.stopPropagation(); });
    el.addEventListener('pointermove', e => { if (on) move(e); });
    const up = e => { if (!on) return; on = false; if (end) end(e); };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  }

  /* peak meters with hold, normalised 0..1 over -60..0 dB */
  function levels(P) {
    const s = { i: 0, o: 0, ih: 0, oh: 0, it: 0, ot: 0, di: -99, do: -99 };
    s.step = () => {
      const m = P.meter(); s.di = P.toDb(m.inPeak || 0); s.do = P.toDb(m.outPeak || 0);
      const ni = clamp((s.di + 60) / 60, 0, 1), no = clamp((s.do + 60) / 60, 0, 1);
      s.i = Math.max(ni, s.i - 0.03); s.o = Math.max(no, s.o - 0.03);
      if (ni >= s.ih) { s.ih = ni; s.it = 0; } else if (++s.it > 45) s.ih = Math.max(0, s.ih - 0.012);
      if (no >= s.oh) { s.oh = no; s.ot = 0; } else if (++s.ot > 45) s.oh = Math.max(0, s.oh - 0.012);
    };
    return s;
  }

  /* response curve cache */
  function curveKeeper(P) {
    let last = new Float32Array(NF);
    return () => { const r = P.response(FREQS); if (r) last = r; return last; };
  }

  /* Band handles: DOM elements over a display. geom = {x(f), y(db), f(px), db(py)} in the host's logical px */
  function eqEngine(P, host, W, H, geom, hk) {
    hk = hk || {};
    const els = {}, grips = {};
    const pt = e => { const r = host.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
    const snapF = (b, f) => (hk.snap ? hk.snap(b, f) : f);
    BANDS.forEach(b => {
      const el = document.createElement('div'); el.className = 'hd ' + b.id; el.dataset.band = b.id; el.tabIndex = 0;
      el.setAttribute('role', 'slider'); el.setAttribute('aria-label', b.name + ' handle');
      if (hk.build) hk.build(b, el);
      host.appendChild(el); els[b.id] = el;
      drag(el, e => {
        const [px, py] = pt(e);
        P.set(b.f, snapF(b, geom.f(px)));
        if (b.g) P.set(b.g, Math.round(geom.db(py) * 2) / 2);
        if (b.slope && P.get(b.slope) === 0) P.set(b.slope, 1);
      }, () => { el.classList.add('drag'); if (hk.select) hk.select(b); }, () => el.classList.remove('drag'));
      el.addEventListener('wheel', e => {
        e.preventDefault();
        if (b.q) P.setNorm(b.q, P.norm(b.q) - e.deltaY * 0.0015);
        else if (b.slope) P.set(b.slope, clamp(P.get(b.slope) + (e.deltaY > 0 ? -1 : 1), 0, 2));
        else P.set(b.g, P.get(b.g) - Math.sign(e.deltaY) * 0.5);
      }, { passive: false });
      el.addEventListener('dblclick', () => {
        const d = P.def(b.f); P.set(b.f, d.def);
        if (b.g) P.set(b.g, 0); if (b.q) P.set(b.q, P.def(b.q).def); if (b.slope) P.set(b.slope, 0);
      });
      el.addEventListener('keydown', e => {
        const k = e.key; const dx = k === 'ArrowRight' ? 1 : k === 'ArrowLeft' ? -1 : 0, dy = k === 'ArrowUp' ? 1 : k === 'ArrowDown' ? -1 : 0;
        if (!dx && !dy) return; e.preventDefault();
        if (dx) P.setNorm(b.f, P.norm(b.f) + dx * 0.012);
        if (dy && b.g) P.set(b.g, P.get(b.g) + dy * 0.5);
        if (dy && b.slope) P.set(b.slope, clamp(P.get(b.slope) + dy, 0, 2));
      });
      el.addEventListener('focus', () => { if (hk.select) hk.select(b); });
      if (hk.grips && b.q) {
        ['l', 'r'].forEach(side => {
          const gr = document.createElement('div'); gr.className = 'gr ' + side; gr.dataset.band = b.id; gr.tabIndex = 0;
          gr.setAttribute('role', 'slider'); gr.setAttribute('aria-label', b.name + ' width');
          if (hk.buildGrip) hk.buildGrip(b, gr, side);
          host.appendChild(gr); grips[b.id + side] = gr;
          drag(gr, e => {
            const [px] = pt(e); const f = P.get(b.f); const k = Math.abs(Math.log(clamp(geom.f(px), 20, 20000) / f));
            P.set(b.q, 1 / (2 * Math.sinh(Math.max(k, 0.02))));
          }, () => { gr.classList.add('drag'); if (hk.select) hk.select(b); }, () => gr.classList.remove('drag'));
          gr.addEventListener('dblclick', () => P.set(b.q, P.def(b.q).def));
        });
      }
    });
    function place(curve) {
      BANDS.forEach(b => {
        const el = els[b.id]; const f = P.get(b.f); const x = geom.x(f);
        let db, off = false;
        if (b.g) db = P.get(b.g); else { off = P.get(b.slope) === 0; db = clamp(interp(curve, fx(f)), -18, 18); }
        const y = geom.y(db);
        el.style.left = x + 'px'; el.style.top = y + 'px';
        el.classList.toggle('off', off);
        el.dataset.dir = db > 0.05 ? 'up' : db < -0.05 ? 'down' : 'flat';
        if (hk.place) hk.place(b, el, x, y, db, off);
        if (hk.grips && b.q) {
          const Q = P.get(b.q), h = 1 / (2 * Q), s = Math.sqrt(1 + h * h);
          const x1 = geom.x(clamp(f * (s - h), 20, 20000)), x2 = geom.x(clamp(f * (s + h), 20, 20000));
          grips[b.id + 'l'].style.left = x1 + 'px'; grips[b.id + 'l'].style.top = y + 'px';
          grips[b.id + 'r'].style.left = x2 + 'px'; grips[b.id + 'r'].style.top = y + 'px';
          const vis = Math.abs(db) > 0.05;
          grips[b.id + 'l'].style.display = grips[b.id + 'r'].style.display = vis ? '' : 'none';
        }
      });
    }
    function select(id) { BANDS.forEach(b => { els[b.id].classList.toggle('sel', b.id === id); els[b.id].style.zIndex = b.id === id ? 5 : 2; }); }
    return { els, grips, place, select };
  }

  const PRE = (name, values) => ({ name, values });
  const presets = [
    PRE('Flat Line', {}),
    PRE('Vocal Lift', { lowCutSlope: '12', lowCut: 90, low: -1.5, lowFreq: 200, mid: -2, midFreq: 400, midQ: 1.4, mid2: 3, mid2Freq: 3200, mid2Q: 1.2, high: 2.5, highFreq: 9000 }),
    PRE('Kick Punch', { lowCutSlope: '24', lowCut: 30, low: 4, lowFreq: 60, mid: -4, midFreq: 350, midQ: 1.6, mid2: 3, mid2Freq: 4000, mid2Q: 1.1, high: 1, highFreq: 8000 }),
    PRE('Bass Tighten', { lowCutSlope: '24', lowCut: 35, low: 2, lowFreq: 80, mid: -3, midFreq: 250, midQ: 1.2, mid2: 2, mid2Freq: 900, mid2Q: 1, highCutSlope: '12', highCut: 6000 }),
    PRE('Air & Sparkle', { lowCutSlope: '12', lowCut: 40, mid: -1, midFreq: 300, midQ: 0.9, mid2: 1.5, mid2Freq: 6000, mid2Q: 0.7, high: 5, highFreq: 10000 }),
    PRE('Telephone', { lowCutSlope: '24', lowCut: 400, highCutSlope: '24', highCut: 3200, mid: 4, midFreq: 1500, midQ: 1.5, mid2: 2, mid2Freq: 2500, mid2Q: 2 }),
    PRE('Warm Tape', { lowCutSlope: '12', lowCut: 25, low: 2, lowFreq: 100, mid: 1, midFreq: 600, midQ: 0.6, high: -3, highFreq: 7000, highCutSlope: '12', highCut: 14000, out: -0.5 })
  ];

  /* ============================================================================================
   *  FACE A — ORDERBOOK  (trading terminal, depth-chart response)
   * ============================================================================================ */
  function buildA(root, P) {
    const W = 960, H = 560;
    const SANS = "'IBM Plex Sans','Inter',system-ui,-apple-system,'Segoe UI',Arial,sans-serif";
    root.innerHTML = `<style>
      .a{position:absolute;inset:0;background:#0b0e11;color:#eaecef;font-family:${SANS};--g:#0ecb81;--r:#f6465d;--y:#f0b90b;--m:#848e9c;--ln:#1e2329;--pn:#12161c;overflow:hidden}
      .a *{box-sizing:border-box}
      .mono{font-family:'IBM Plex Mono',${MONO}}
      .a .pnl{position:absolute;background:var(--pn);border:1px solid var(--ln);border-radius:4px;overflow:hidden}
      .top{position:absolute;left:0;top:0;width:${W}px;height:46px;border-bottom:1px solid var(--ln);background:#0e1217}
      .logo{position:absolute;left:16px;top:8px;width:30px;height:30px}
      .wm{position:absolute;left:56px;top:6px;font-weight:700;font-size:19px;letter-spacing:.14em;line-height:22px;white-space:nowrap}
      .wm small{display:block;font:500 9px/12px 'IBM Plex Mono',${MONO};color:var(--m);letter-spacing:.14em}
      .tk{position:absolute;left:300px;top:0;width:480px;height:46px;display:flex;align-items:center;gap:18px;font:11px 'IBM Plex Mono',${MONO};color:var(--m);white-space:nowrap;overflow:hidden}
      .tk b{display:block;font-weight:600;font-size:13px;color:#eaecef}
      .tk span{display:flex;flex-direction:column;gap:1px;line-height:13px}
      .live{all:unset;cursor:pointer;position:absolute;right:16px;top:9px;width:132px;height:28px;border-radius:3px;border:1px solid #2b3139;background:#161a1f;color:var(--m);font:600 11px/26px 'IBM Plex Mono',${MONO};letter-spacing:.1em;text-align:center}
      .live::before{content:'';display:inline-block;width:8px;height:8px;border-radius:50%;background:#5e6673;margin-right:8px;vertical-align:0}
      .live.on{border-color:var(--g);color:var(--g);background:rgba(14,203,129,.1)}
      .live.on::before{background:var(--g);box-shadow:0 0 8px var(--g)}
      .wl{position:absolute;left:16px;top:54px;width:928px;height:26px;display:flex;gap:4px}
      .wl button{all:unset;cursor:pointer;flex:1;min-width:0;height:26px;border-radius:3px;background:var(--pn);border:1px solid var(--ln);padding:0 8px;display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:11px;color:#b7bdc6}
      .wl button em{font:normal 600 10px 'IBM Plex Mono',${MONO};flex:none}
      .wl button i{font-style:normal;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
      .wl button.up em{color:var(--g)}.wl button.dn em{color:var(--r)}.wl button.fl em{color:var(--m)}
      .wl button:hover{border-color:#3a4350}
      .wl button.on{background:#1b222b;border-color:var(--y);color:#fff}
      .ch{left:16px;top:88px;width:624px;height:296px}
      .ch canvas{position:absolute;left:0;top:0;width:624px;height:296px}
      .ch .host{position:absolute;inset:0}
      .hd{position:absolute;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;border:2px solid var(--m);background:#0b0e11;color:var(--m);font:700 8.5px/18px 'IBM Plex Mono',${MONO};text-align:center;cursor:grab;touch-action:none;z-index:2;outline:none;user-select:none}
      .hd[data-dir=up]{border-color:var(--g);color:var(--g);box-shadow:0 0 10px rgba(14,203,129,.35)}
      .hd[data-dir=down]{border-color:var(--r);color:var(--r);box-shadow:0 0 10px rgba(246,70,93,.35)}
      .hd.off{opacity:.5;border-style:dashed;box-shadow:none}
      .hd.sel,.hd:focus-visible{outline:1px solid #fff;outline-offset:3px}
      .hd.drag{cursor:grabbing;transform:scale(1.15)}
      .hd .fl{position:absolute;left:26px;top:-9px;white-space:nowrap;background:#1b222b;border:1px solid #2b3139;border-radius:2px;padding:1px 5px;font:600 9.5px/13px 'IBM Plex Mono',${MONO};color:#eaecef;pointer-events:none;display:none}
      .hd.sel .fl,.hd:hover .fl,.hd.drag .fl{display:block}
      .hd.rt .fl{left:auto;right:26px}
      .bk{left:652px;top:88px;width:292px;height:296px}
      .ph{height:28px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;font:600 10px 'IBM Plex Mono',${MONO};letter-spacing:.14em;color:var(--m);border-bottom:1px solid var(--ln);background:#0e1217}
      .ph b{color:#eaecef;font-weight:600}
      .cols,.row{display:grid;grid-template-columns:40px 70px 90px 1fr;align-items:center;padding:0 12px;column-gap:6px}
      .cols{height:22px;font:500 9.5px 'IBM Plex Mono',${MONO};color:var(--m);letter-spacing:.1em}
      .cols span:nth-child(n+2),.row .c{text-align:right}
      .row{position:relative;height:38px;font:12px 'IBM Plex Mono',${MONO};border-top:1px solid #171c22;cursor:default}
      .row .dep{position:absolute;right:0;top:3px;bottom:3px;width:0;background:rgba(14,203,129,.16);transition:width .06s}
      .row.dn .dep{background:rgba(246,70,93,.16)}
      .row .tag{position:relative;font-weight:700;font-size:11px;color:var(--m);cursor:pointer}
      .row.sel .tag{color:var(--y)}
      .row .c{position:relative;display:block;padding:7px 2px;border-radius:2px;color:#eaecef;font-variant-numeric:tabular-nums;white-space:nowrap}
      .row .c:hover{background:rgba(255,255,255,.07)}
      .row .c.drag{background:rgba(240,185,11,.2)}
      .row.up .gn{color:var(--g)}.row.dn .gn{color:var(--r)}
      .row .na{color:#4b5563}
      .row .sl{color:#b7bdc6;font-size:11px;cursor:pointer}
      .tp{left:16px;top:396px;width:300px;height:152px}
      .tp .ls{padding:4px 12px;font:11px/18px 'IBM Plex Mono',${MONO};color:#b7bdc6}
      .tp .ls div{display:grid;grid-template-columns:38px 14px 1fr auto;column-gap:6px;white-space:nowrap;height:18px;overflow:hidden}
      .tp .ls div span:nth-child(3){overflow:hidden;text-overflow:ellipsis}
      .tp .ls .u{color:var(--g)}.tp .ls .d{color:var(--r)}.tp .ls .t{color:#4b5563}
      .ps{left:328px;top:396px;width:300px;height:152px}
      .ps .st{display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;padding:8px 12px 0}
      .ps .st div{font:600 13px 'IBM Plex Mono',${MONO};display:flex;flex-direction:column;gap:1px}
      .ps .st small{font:500 9px 'IBM Plex Mono',${MONO};color:var(--m);letter-spacing:.12em}
      .ps .sz{position:absolute;left:12px;right:12px;bottom:12px;height:34px}
      .ps .sz label{position:absolute;left:0;top:0;font:500 9px 'IBM Plex Mono',${MONO};color:var(--m);letter-spacing:.12em}
      .ps .sz output{position:absolute;right:0;top:-2px;font:600 12px 'IBM Plex Mono',${MONO};color:#eaecef}
      .ps .trk{position:absolute;left:0;right:0;bottom:2px;height:14px;background:#0b0e11;border:1px solid #2b3139;border-radius:2px;cursor:ew-resize}
      .ps .trk::before{content:'';position:absolute;left:50%;top:-3px;bottom:-3px;width:1px;background:#4b5563}
      .ps .trk i{position:absolute;top:1px;bottom:1px;left:calc(min(var(--v,.5),.5)*100%);width:calc(max(var(--v,.5) - .5,.5 - var(--v,.5))*100%);background:var(--g);opacity:.55}
      .ps .trk.neg i{background:var(--r)}
      .ps .trk b{position:absolute;top:-3px;bottom:-3px;width:6px;margin-left:-3px;left:calc(var(--v,.5)*100%);background:#eaecef;border-radius:1px}
      .vl{left:640px;top:396px;width:304px;height:152px}
      .vl canvas{position:absolute;left:0;top:28px;width:304px;height:122px}
      .vl .ph{position:absolute;left:0;right:0;top:0}
    </style>
    <div class="a">
      <div class="top">
        <svg class="logo" viewBox="0 0 30 30"><rect width="30" height="30" rx="5" fill="#161a1f" stroke="#2b3139"/>
          <g fill="#0ecb81"><rect x="15.5" y="5" width="9" height="3"/><rect x="15.5" y="10" width="6" height="3"/><rect x="15.5" y="15" width="3" height="3"/></g>
          <g fill="#f6465d"><rect x="5.5" y="12" width="9" height="3"/><rect x="8.5" y="17" width="6" height="3"/><rect x="11.5" y="22" width="3" height="3"/></g></svg>
        <div class="wm">ORDERBOOK<small>6-BAND PARAMETRIC &middot; DEPTH VIEW</small></div>
        <div class="tk"><span><small>NET BID</small><b id="tkN">+0.0 dB</b></span><span><small>SPREAD</small><b id="tkS">0.0 dB</b></span><span><small>HIGH</small><b id="tkP">&mdash;</b></span><span><small>LOW</small><b id="tkL">&mdash;</b></span></div>
        <button class="live" id="byp"></button>
      </div>
      <div class="wl" id="wl"></div>
      <div class="pnl ch" id="chart"><canvas id="cv" width="1248" height="592"></canvas><div class="host" id="host"></div></div>
      <div class="pnl bk"><div class="ph"><b>ORDER BOOK</b><span id="selTxt">6 LEVELS</span></div>
        <div class="cols"><span>BAND</span><span>PRICE (HZ)</span><span>SIZE (dB)</span><span>Q</span></div><div id="rows"></div></div>
      <div class="pnl tp"><div class="ph"><b>TRADE TAPE</b><span id="tpN">LIVE</span></div><div class="ls" id="tape"></div></div>
      <div class="pnl ps"><div class="ph"><b>POSITION</b><span>OUTPUT SIZE</span></div>
        <div class="st"><div><small>BID DEPTH</small><span id="pB" style="color:var(--g)">+0.0 dB</span></div><div><small>ASK DEPTH</small><span id="pA" style="color:var(--r)">0.0 dB</span></div>
          <div><small>LOW SIDE</small><span id="pLo">&mdash;</span></div><div><small>HIGH SIDE</small><span id="pHi">&mdash;</span></div></div>
        <div class="sz"><label>OUT / SIZE</label><output id="oV"></output><div class="trk" id="oT"><i></i><b></b></div></div></div>
      <div class="pnl vl"><div class="ph"><b>VOLUME</b><span id="vlT">IN / OUT</span></div><canvas id="vc" width="608" height="244"></canvas></div>
    </div>`;
    const $ = s => root.querySelector(s);
    const KEY = { lc: 'LC', lo: 'LOW', m1: 'MID 1', m2: 'MID 2', hi: 'HIGH', hc: 'HC' };

    /* bypass */
    P.bind($('#byp'), '__bypass'); P.sub('__bypass', on => { $('#byp').textContent = on ? 'LIVE' : 'HALTED'; });

    /* watchlist = presets */
    const wl = $('#wl'); let curPre = -1;
    P.presets.forEach((pr, i) => {
      const net = ['low', 'mid', 'mid2', 'high'].reduce((a, k) => a + (pr.values[k] || 0), 0);
      const b = document.createElement('button'); b.className = net > 0.2 ? 'up' : net < -0.2 ? 'dn' : 'fl';
      b.innerHTML = `<i></i><em>${net > 0.2 ? '▲' : net < -0.2 ? '▼' : '▬'} ${Math.abs(net).toFixed(1)}</em>`; b.firstChild.textContent = pr.name;
      b.onclick = () => P.loadPreset(i); b.dataset.pip = i; wl.appendChild(b);
    });
    P.onPreset((i, nm) => { curPre = i; [...wl.children].forEach((b, k) => b.classList.toggle('on', k === i)); });

    /* order book rows */
    const rows = $('#rows'); const R = {};
    let selId = 'm1';
    BANDS.forEach(b => {
      const r = document.createElement('div'); r.className = 'row'; r.dataset.b = b.id;
      r.innerHTML = `<i class="dep"></i><span class="tag">${KEY[b.id]}</span><span class="c f"></span>` + (b.cut ? '<span class="c sl"></span><span class="c na">&mdash;</span>' : `<span class="c gn"></span>` + (b.q ? '<span class="c q"></span>' : '<span class="c na">shelf</span>'));
      rows.appendChild(r); R[b.id] = r;
      const fc = r.querySelector('.f'); P.bind(fc, b.f); P.text(fc, b.f);
      if (b.cut) { const s = r.querySelector('.sl'); P.bind(s, b.slope); P.sub(b.slope, v => { s.textContent = v ? ['', '12 dB/oct', '24 dB/oct'][v] : 'off'; r.classList.toggle('up', false); r.querySelector('.dep').style.width = v ? (v * 14) + '%' : '0'; r.classList.toggle('dn', v > 0); }); }
      else {
        const gc = r.querySelector('.gn'); P.bind(gc, b.g); P.text(gc, b.g);
        P.sub(b.g, v => { r.classList.toggle('up', v > 0.05); r.classList.toggle('dn', v < -0.05); r.querySelector('.dep').style.width = (Math.abs(v) / 18 * 100) + '%'; });
        if (b.q) { const qc = r.querySelector('.q'); P.bind(qc, b.q); P.text(qc, b.q); }
      }
      r.querySelector('.tag').onclick = () => select(b.id);
      r.addEventListener('pointerdown', () => select(b.id));
    });
    function select(id) { selId = id; BANDS.forEach(b => R[b.id].classList.toggle('sel', b.id === id)); eng.select(id); const b = BANDS.find(x => x.id === id); $('#selTxt').textContent = 'SELECTED ' + KEY[id]; }

    /* geometry */
    const CW = 624, CH = 296, PX0 = 10, PX1 = CW - 46, PY0 = 12, PY1 = CH - 22;
    const gx = f => PX0 + fx(f) * (PX1 - PX0), gy = db => PY0 + (18 - db) / 36 * (PY1 - PY0);
    const geom = { x: gx, y: gy, f: px => xf((px - PX0) / (PX1 - PX0)), db: py => clamp(18 - (py - PY0) / (PY1 - PY0) * 36, -18, 18) };
    const host = $('#host');
    const eng = eqEngine(P, host, CW, CH, geom, {
      build(b, el) { el.innerHTML = `${b.tag === 'M1' ? '1' : b.tag === 'M2' ? '2' : b.tag === 'LO' ? 'L' : b.tag === 'HI' ? 'H' : b.tag}<span class="fl"></span>`; },
      select: b => select(b.id),
      place(b, el, x) { el.classList.toggle('rt', x > CW - 170); }
    });
    P.subAll(() => {
      BANDS.forEach(b => {
        const fl = eng.els[b.id].querySelector('.fl');
        fl.textContent = b.cut ? (P.get(b.slope) ? (b.id === 'lc' ? 'HP ' : 'LP ') + ['', '12', '24'][P.get(b.slope)] + ' · ' + fq(P.get(b.f)) : 'CUT OFF') : sg(P.get(b.g)) + ' dB · ' + fq(P.get(b.f));
      });
    });
    select('m1');

    /* chart drawing */
    const cv = $('#cv'), g = cv.getContext('2d'); const cur = curveKeeper(P);
    let mx = -1, my = -1;
    $('#chart').addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width * CW; my = (e.clientY - r.top) / r.height * CH; });
    $('#chart').addEventListener('pointerleave', () => { mx = -1; });
    const VX = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    let frame = 0;
    P.raf(() => {
      frame++;
      const curve = cur();
      g.setTransform(2, 0, 0, 2, 0, 0); g.clearRect(0, 0, CW, CH);
      const bg = g.createLinearGradient(0, 0, 0, CH); bg.addColorStop(0, '#10151b'); bg.addColorStop(1, '#0c1015'); g.fillStyle = bg; g.fillRect(0, 0, CW, CH);
      /* grid */
      g.lineWidth = 1; g.font = `9.5px ${MONO}`; g.textBaseline = 'middle';
      [-18, -12, -6, 0, 6, 12, 18].forEach(d => {
        const y = Math.round(gy(d)) + 0.5; g.strokeStyle = d === 0 ? '#3a4350' : '#1a2027'; g.beginPath(); g.moveTo(PX0, y); g.lineTo(PX1, y); g.stroke();
        g.fillStyle = '#848e9c'; g.textAlign = 'left'; g.fillText(d === 0 ? '0.00' : sg(d, 0), PX1 + 8, y);
      });
      g.strokeStyle = '#161c23';
      VX.forEach(f => { const x = Math.round(gx(f)) + 0.5; g.beginPath(); g.moveTo(x, PY0); g.lineTo(x, PY1); g.stroke(); });
      g.textAlign = 'center'; g.fillStyle = '#848e9c';
      VX.forEach(f => { if (f === 20 || f === 20000) return; g.fillText(fq(f), gx(f), PY1 + 12); });
      /* volume histogram (spectrum) */
      const nb = 104, din = P.freqData('in', nb, 20, 20000), dout = P.freqData('out', nb, 20, 20000), bw = (PX1 - PX0) / nb, ph = PY1 - PY0;
      for (let i = 0; i < nb; i++) {
        const hi = clamp((din[i] + 92) / 74, 0, 1) * ph * 0.62, ho = clamp((dout[i] + 92) / 74, 0, 1) * ph * 0.62;
        g.fillStyle = 'rgba(132,142,156,.11)'; g.fillRect(PX0 + i * bw + 0.5, PY1 - hi, bw - 1, hi);
        g.fillStyle = 'rgba(132,142,156,.30)'; g.fillRect(PX0 + i * bw + 0.5, PY1 - ho, bw - 1, ho);
      }
      /* depth bars between curve and zero line */
      const y0 = gy(0);
      for (let x = PX0; x < PX1 - 1; x += 4) {
        const v = clamp(interp(curve, (x + 2 - PX0) / (PX1 - PX0)), -18, 18); const y = gy(v);
        g.fillStyle = v >= 0 ? 'rgba(14,203,129,.22)' : 'rgba(246,70,93,.22)'; g.fillRect(x, Math.min(y, y0), 3, Math.abs(y - y0));
      }
      /* band freq markers */
      g.setLineDash([3, 4]); g.lineWidth = 1;
      BANDS.forEach(b => {
        const f = P.get(b.f), x = Math.round(gx(f)) + 0.5; const v = b.g ? P.get(b.g) : (P.get(b.slope) ? -1 : 0);
        g.strokeStyle = b.id === selId ? '#f0b90b' : (v > 0 ? 'rgba(14,203,129,.45)' : v < 0 ? 'rgba(246,70,93,.45)' : 'rgba(132,142,156,.3)');
        g.beginPath(); g.moveTo(x, PY0); g.lineTo(x, PY1); g.stroke();
      });
      g.setLineDash([]);
      /* the curve, green above zero, red below */
      const path = () => { g.beginPath(); for (let i = 0; i < NF; i++) { const x = PX0 + i / (NF - 1) * (PX1 - PX0), y = gy(clamp(curve[i], -18.6, 18.6)); i ? g.lineTo(x, y) : g.moveTo(x, y); } };
      g.save(); g.beginPath(); g.rect(PX0, PY0 - 4, PX1 - PX0, y0 - PY0 + 4); g.clip(); path(); g.strokeStyle = '#0ecb81'; g.lineWidth = 2; g.shadowColor = '#0ecb81'; g.shadowBlur = 8; g.stroke(); g.restore();
      g.save(); g.beginPath(); g.rect(PX0, y0, PX1 - PX0, PY1 - y0 + 4); g.clip(); path(); g.strokeStyle = '#f6465d'; g.lineWidth = 2; g.shadowColor = '#f6465d'; g.shadowBlur = 8; g.stroke(); g.restore();
      g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 0.8; path(); g.stroke();
      /* last price tag */
      const lp = curve[Math.round(fx(1000) * (NF - 1))];
      /* crosshair */
      if (mx >= PX0 && mx <= PX1 && my >= PY0 && my <= PY1) {
        g.strokeStyle = 'rgba(234,236,239,.35)'; g.setLineDash([2, 3]); g.beginPath(); g.moveTo(mx, PY0); g.lineTo(mx, PY1); g.moveTo(PX0, my); g.lineTo(PX1, my); g.stroke(); g.setLineDash([]);
        const f = geom.f(mx), v = interp(curve, fx(f));
        g.fillStyle = '#eaecef'; g.fillRect(PX1 + 2, my - 8, 42, 16); g.fillStyle = '#0b0e11'; g.textAlign = 'center'; g.font = `600 9.5px ${MONO}`; g.fillText(sg(geom.db(my), 1), PX1 + 23, my);
        g.fillStyle = '#eaecef'; g.fillRect(mx - 24, PY1 + 3, 48, 15); g.fillStyle = '#0b0e11'; g.fillText(fq(f) + 'Hz', mx, PY1 + 11);
        g.fillStyle = v >= 0 ? '#0ecb81' : '#f6465d'; g.beginPath(); g.arc(mx, gy(clamp(v, -18, 18)), 3.5, 0, 6.3); g.fill();
      }
      /* header ticker + position (throttled) */
      if (frame % 6 === 0) {
        let mn = 99, mxv = -99, fi = 0, fl = 0; for (let i = 0; i < NF; i++) { if (curve[i] > mxv) { mxv = curve[i]; fi = i; } if (curve[i] < mn) { mn = curve[i]; fl = i; } }
        const gs = ['low', 'mid', 'mid2', 'high'].map(k => P.get(k)); const bid = gs.filter(v => v > 0).reduce((a, v) => a + v, 0), ask = gs.filter(v => v < 0).reduce((a, v) => a + v, 0);
        $('#tkN').textContent = sg(bid + ask) + ' dB'; $('#tkN').style.color = bid + ask > 0.05 ? '#0ecb81' : bid + ask < -0.05 ? '#f6465d' : '#eaecef';
        $('#tkS').textContent = (mxv - mn).toFixed(1) + ' dB';
        const flat = mxv - mn < 0.15; $('#tkP').textContent = flat ? '\u2014' : sg(mxv) + ' @ ' + fq(FREQS[fi]); $('#tkL').textContent = flat ? '\u2014' : sg(mn) + ' @ ' + fq(FREQS[fl]);
        $('#pB').textContent = sg(bid) + ' dB'; $('#pA').textContent = sg(ask) + ' dB';
        const lo = interp(curve, fx(100)), hi = interp(curve, fx(8000));
        $('#pLo').textContent = sg(lo) + ' @ 100'; $('#pHi').textContent = sg(hi) + ' @ 8k';
      }
      eng.place(curve);
    });

    /* output size slider */
    P.bind($('#oT'), 'out', { abs: true, axis: 'x' }); P.text($('#oV'), 'out');
    P.sub('out', v => $('#oT').classList.toggle('neg', v < 0));

    /* trade tape */
    const tape = []; let buf = {}, tmo = 0; const prev = {}; const t0 = performance.now(); const tp = $('#tape');
    const tstamp = () => { const s = Math.floor((performance.now() - t0) / 1000); return pad2(Math.floor(s / 60) % 100) + ':' + pad2(s % 60); };
    function renderTape() {
      tp.innerHTML = ''; tape.slice(-6).forEach(r => { const d = document.createElement('div'); d.innerHTML = `<span class="t">${r.t}</span><span class="${r.up ? 'u' : 'd'}">${r.up ? '▲' : '▼'}</span><span></span><span class="${r.up ? 'u' : 'd'}"></span>`; d.children[2].textContent = r.a; d.children[3].textContent = r.b; tp.appendChild(d); });
    }
    function flush() {
      const ev = Object.values(buf); buf = {};
      if (ev.length > 4) { tape.push({ t: tstamp(), up: true, a: 'PRESET LOADED', b: curPre >= 0 ? P.presets[curPre].name.slice(0, 12) : '' }); }
      else ev.forEach(e => tape.push({ t: tstamp(), up: e.up, a: e.label, b: P.fmt(e.id) }));
      while (tape.length > 12) tape.shift(); renderTape();
    }
    P.subAll((id, v, n) => {
      if (id === '__bypass') return; const first = !(id in prev), was = prev[id]; prev[id] = n; if (first || was === n) return;
      buf[id] = { id, up: n > was, label: P.def(id).label.toUpperCase() }; clearTimeout(tmo); tmo = setTimeout(flush, 40);
    });
    tape.push({ t: tstamp(), up: true, a: 'SESSION OPEN', b: 'READY' }); renderTape();

    /* volume panel: meters + history */
    const vc = $('#vc'), vg = vc.getContext('2d'), lv = levels(P); const hist = new Float32Array(76), histI = new Float32Array(76);
    let hf = 0;
    P.raf(() => {
      lv.step(); hf++;
      if (hf % 3 === 0) { hist.copyWithin(0, 1); histI.copyWithin(0, 1); hist[75] = lv.o; histI[75] = lv.i; }
      const w = 304, h = 122; vg.setTransform(2, 0, 0, 2, 0, 0); vg.clearRect(0, 0, w, h);
      [['IN', lv.i, lv.ih, lv.di], ['OUT', lv.o, lv.oh, lv.do]].forEach(([nm, v, hv, db], k) => {
        const y = 10 + k * 22; vg.fillStyle = '#848e9c'; vg.font = `600 9.5px ${MONO}`; vg.textAlign = 'left'; vg.textBaseline = 'middle'; vg.fillText(nm, 12, y + 6);
        vg.fillStyle = '#0b0e11'; vg.fillRect(42, y, 196, 12); vg.strokeStyle = '#2b3139'; vg.strokeRect(42.5, y + 0.5, 195, 11);
        const gr = vg.createLinearGradient(42, 0, 238, 0); gr.addColorStop(0, '#0ecb81'); gr.addColorStop(.75, '#0ecb81'); gr.addColorStop(.88, '#f0b90b'); gr.addColorStop(1, '#f6465d');
        vg.fillStyle = gr; vg.fillRect(43, y + 1, 194 * v, 10);
        vg.fillStyle = '#fff'; vg.fillRect(43 + 193 * hv, y + 1, 2, 10);
        vg.textAlign = 'right'; vg.fillStyle = '#eaecef'; vg.fillText(db < -90 ? '-inf' : db.toFixed(1), 292, y + 6);
      });
      /* history bars: green when out >= in, red when below */
      const by = 100, bh = 50; vg.fillStyle = '#0b0e11'; vg.fillRect(12, 56, 280, 62);
      for (let i = 0; i < 76; i++) {
        const o = hist[i], inn = histI[i]; vg.fillStyle = o >= inn - 0.002 ? 'rgba(14,203,129,.8)' : 'rgba(246,70,93,.8)';
        const hh = o * 56; vg.fillRect(13 + i * 3.65, 117 - hh, 2.6, hh);
      }
      vg.fillStyle = '#4b5563'; vg.font = `8.5px ${MONO}`; vg.textAlign = 'left'; vg.fillText('OUT LEVEL TAPE', 16, 64);
    });
  }


  /* ============================================================================================
   *  FACE B — FIBONACCI  (engineering blueprint, golden spiral, bands on Fibonacci frequencies)
   * ============================================================================================ */
  const FIBS = [21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711];
  const FIBN = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  const nearFib = f => { let bi = 0, bd = 1e9; FIBS.forEach((v, i) => { const d = Math.abs(Math.log(f / v)); if (d < bd) { bd = d; bi = i; } }); return bi; };
  const fibLab = v => (v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1) + 'k' : String(v));

  


  /* ============================================================================================
   *  FACE C — CHARTIST  (technical analysis on warm paper, candlestick spectrum, trendline handles)
   * ============================================================================================ */
  

  Kit.register('eq3', {
    fonts: 'family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Josefin+Sans:wght@300;400;600&family=Share+Tech+Mono&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400;1,700&family=Courier+Prime:wght@400;700',
    w: 960, h: 560, presets,
    faces: [
      { key: 'A', name: 'Orderbook', accent: '#0ecb81', w: 960, h: 560, build: buildA },
      undefined,
      undefined
    ].filter(Boolean)
  });
})();
