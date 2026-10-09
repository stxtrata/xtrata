import { Kit } from "./runtime.js";
/* phaser — Phaser. Faces: A Epoch (almanac clock dial) / B Difficulty (LCD + dip-switch retarget unit) / C Retarget (range-card reticle) */
(function () {
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const LF0 = 20, LF1 = 20000, LR = Math.log(LF1 / LF0);
  const fAt = u => LF0 * Math.exp(u * LR);
  const uOf = f => Math.log(clamp(f, LF0, LF1) / LF0) / LR;
  const SR = 48000, QAP = 0.6;
  const hz = f => f >= 1000 ? (f / 1000).toFixed(f >= 10000 ? 1 : 2) + ' kHz' : Math.round(f) + ' Hz';
  const set = (el, t) => { if (el && el._t !== t) { el._t = t; el.textContent = t; } };
  const SERIF = "'Cormorant Garamond','EB Garamond',Georgia,'Times New Roman',serif";
  const CHUNK = "'Rubik Mono One','Arial Black','Helvetica Neue',Impact,sans-serif";
  const PIX = "'DotGothic16','Courier New',ui-monospace,monospace";
  const COND = "'Barlow Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif";
  const MONO = "'Roboto Mono',ui-monospace,Menlo,Consolas,monospace";

  const FREQ_CACHE = {};
  function freqs(n) { return FREQ_CACHE[n] || (FREQ_CACHE[n] = Float32Array.from({ length: n }, (_, i) => fAt(i / (n - 1)))); }

  // magnitude (dB) of  (1-mix) + mix * wet, wet = sqrt(1-fb^2) * A / (1 - fb*A*D), A = all-pass chain (N stages, Q 0.6, all at centre c)
  function resp(out, fr, c, N, fb, mix) {
    const d = 128 / SR, k = Math.sqrt(1 - fb * fb);
    for (let i = 0; i < fr.length; i++) {
      const w = fr[i] / c;
      const ph = -2 * Math.atan2(w / QAP, 1 - w * w) * N;
      const ar = Math.cos(ph), ai = Math.sin(ph);
      const dp = -TAU * fr[i] * d;
      const lr = fb * (ar * Math.cos(dp) - ai * Math.sin(dp)), li = fb * (ar * Math.sin(dp) + ai * Math.cos(dp));
      const dr = 1 - lr, di = -li, dd = dr * dr + di * di;
      const wr = k * (ar * dr + ai * di) / dd, wi = k * (ai * dr - ar * di) / dd;
      const hr = (1 - mix) + mix * wr, hi = mix * wi;
      out[i] = clamp(10 * Math.log10(hr * hr + hi * hi + 1e-9), -42, 14);
    }
    return out;
  }
  // notch frequencies of an N-stage chain at centre c
  function notches(c, N) {
    const r = [];
    for (let k = 0; k < N; k++) {
      const al = (2 * k + 1) * Math.PI / N / 2, s = Math.sin(al), co = Math.cos(al);
      const w = (-co / QAP + Math.sqrt(co * co / (QAP * QAP) + 4 * s * s)) / (2 * s);
      const f = w * c; if (f < LF1 * 1.02) r.push(f);
    }
    return r;
  }
  function cvs(el, w, h) { el.width = w * 2; el.height = h * 2; el.style.width = w + 'px'; el.style.height = h + 'px'; const c = el.getContext('2d'); c.scale(2, 2); return c; }
  function roman(n) { return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][n] || String(n + 1); }

  // shared live-state: LFO phase (resynced to the real meter), centres, peaks
  function live(P) {
    let th = 0, prevL = 0, lastMove = -9, dir = 1, t0 = performance.now() / 1000, io = 0, oo = 0;
    const nm = x => clamp((P.toDb(x) + 60) / 60, 0, 1);
    return function tick() {
      const now = performance.now() / 1000, dt = Math.min(0.1, now - t0); t0 = now;
      let m = {}; try { m = P.meter() || {}; } catch (e) { }
      th += TAU * P.get('rate') * dt;
      let synced = false;
      if (m.lfo != null) {
        const l = clamp(m.lfo, -1, 1);
        if (Math.abs(l - prevL) > 2e-4) { dir = l > prevL ? 1 : -1; lastMove = now; }
        prevL = l;
        if (now - lastMove < 0.35) { const a = Math.asin(l); th = dir > 0 ? a : Math.PI - a; synced = true; }
      }
      th = ((th % TAU) + TAU) % TAU;
      const base = P.get('base'), depth = P.get('depth'), s = P.get('stereo');
      const lfoL = Math.sin(th), lfoR = Math.sin(th + s * Math.PI);
      let cL = synced && m.centre != null ? m.centre : base + depth * lfoL;
      cL = clamp(cL, 25, 19000);
      const cR = clamp(base + depth * lfoR, 25, 19000);
      io = Math.max(io * 0.9, nm(m.inPeak || 0)); oo = Math.max(oo * 0.9, nm(m.outPeak || 0));
      return { m, th, synced, lfoL, lfoR, cL, cR, base, depth, s, N: Number(P.real('stages')) || 4, fb: P.get('feedback'), mix: P.get('mix'), i: io, o: oo };
    };
  }

  const presets = [
    { name: 'Genesis Sweep', values: { rate: 0.35, depth: 900, base: 400, mix: 0.5, stages: '4', feedback: 0, stereo: 0 } },
    { name: 'Halving', values: { rate: 0.1, depth: 1400, base: 300, mix: 0.6, stages: '8', feedback: 0.45, stereo: 0.3 } },
    { name: 'Slow Drift', values: { rate: 0.15, depth: 600, base: 600, mix: 0.5, stages: '6', feedback: 0.2, stereo: 0.6 } },
    { name: 'Jet Stream', values: { rate: 0.25, depth: 1800, base: 250, mix: 0.55, stages: '12', feedback: 0.75, stereo: 0.2 } },
    { name: 'Hash Rate', values: { rate: 3.2, depth: 500, base: 900, mix: 0.45, stages: '4', feedback: -0.35, stereo: 0.8 } },
    { name: 'Wide Ledger', values: { rate: 0.6, depth: 1000, base: 500, mix: 0.5, stages: '2', feedback: 0, stereo: 1 } },
    { name: 'Deep Twelve', values: { rate: 0.08, depth: 1200, base: 350, mix: 0.7, stages: '12', feedback: -0.6, stereo: 0.5 } },
  ];
  const fmts = {
    rate: v => v.toFixed(2) + ' Hz', depth: v => Math.round(v) + ' Hz', base: v => Math.round(v) + ' Hz',
    mix: v => Math.round(v * 100) + '%', feedback: v => (v > 0.005 ? '+' : '') + Math.round(v * 100) + '%',
    stereo: v => Math.round(v * 180) + '°'
  };

  /* ================= FACE A : EPOCH ================= */
  

  /* ================= FACE B : DIFFICULTY ================= */
  

  /* ================= FACE C : RETARGET ================= */
  function buildC(root, P) {
    root.innerHTML = `<style>
    *{box-sizing:border-box}
    .f{position:absolute;inset:0;overflow:hidden;font-family:${COND};color:#15191c;background:#d8dcde;
      background-image:linear-gradient(rgba(21,25,28,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(21,25,28,.05) 1px,transparent 1px);background-size:20px 20px}
    .tb{position:absolute;left:0;right:0;top:0;height:58px;background:#15191c;color:#e9ecee;display:flex;align-items:center;padding:0 22px;gap:14px}
    .tb svg{width:34px;height:34px}
    .tb h1{margin:0;font:700 36px/1 ${COND};letter-spacing:.08em;text-transform:uppercase}
    .tb h1 small{display:block;font:500 11px/1 ${MONO};letter-spacing:.2em;color:#ff4a2e;margin-top:3px}
    .tb .sp{flex:1}
    .tb .tg{all:unset;cursor:pointer;height:34px;padding:0 16px;border:2px solid #e9ecee;font:700 15px/30px ${COND};letter-spacing:.18em;text-transform:uppercase;position:relative}
    .tb .tg.on{background:#ff4a2e;border-color:#ff4a2e;color:#15191c}
    .chips{position:absolute;left:24px;top:66px;display:flex;gap:6px;width:912px}
    .chips button{all:unset;cursor:pointer;flex:1;height:26px;text-align:center;border:1.5px solid #15191c;font:700 12px/23px ${COND};letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;overflow:hidden;background:#e6e9ea}
    .chips button b{color:#ff4a2e;margin-right:5px}
    .chips button.on{background:#15191c;color:#e9ecee}
    .chips button:not(.on):hover{background:#fff}
    #tg{position:absolute;left:24px;top:104px}
    #rs{position:absolute;left:432px;top:104px}
    .plbl{position:absolute;font:700 11px ${MONO};letter-spacing:.15em;text-transform:uppercase;color:#15191c}
    .pad{position:absolute;left:432px;top:296px;width:190px;height:170px;border:2px solid #15191c;background:#eef0f1;cursor:crosshair;
      background-image:radial-gradient(circle at 50% 50%,transparent 0 22%,rgba(21,25,28,.35) 22% 22.8%,transparent 22.8% 44%,rgba(21,25,28,.35) 44% 44.8%,transparent 44.8% 66%,rgba(21,25,28,.35) 66% 66.8%,transparent 66.8%)}
    .pad .vx{position:absolute;top:0;bottom:0;width:0;border-left:1.5px solid #ff4a2e;left:calc(var(--x)*100%)}
    .pad .hy{position:absolute;left:0;right:0;height:0;border-top:1.5px solid #ff4a2e;top:calc((1 - var(--y))*100%)}
    .pad .dot{position:absolute;width:16px;height:16px;border:2.5px solid #ff4a2e;border-radius:50%;background:rgba(255,74,46,.18);left:calc(var(--x)*100% - 8px);top:calc((1 - var(--y))*100% - 8px)}
    .pad.drag .dot{background:#ff4a2e}
    .pad small{position:absolute;font:700 9.5px ${MONO};letter-spacing:.14em;color:#15191c;opacity:.7}
    .pv{position:absolute;left:432px;top:468px;width:190px;display:flex;justify-content:space-between;font:700 12px ${MONO}}
    .pv span{color:#ff4a2e}
    .fd{position:absolute;top:296px;width:52px;text-align:center}
    .fd label{display:block;font:700 12px ${COND};letter-spacing:.16em;text-transform:uppercase;height:15px}
    .fd .ft{position:relative;margin:3px auto 0;width:22px;height:152px;background:#15191c;cursor:ns-resize;border-radius:2px}
    .fd .ft:before{content:'';position:absolute;left:10px;width:2px;top:6px;bottom:6px;background:#566068}
    .fd .ft i{position:absolute;left:8px;width:6px;bottom:6px;height:calc(var(--v)*140px);background:#ff4a2e}
    .fd .ft.bi i{bottom:calc(6px + min(var(--v),.5)*140px);height:calc((max(var(--v),.5) - min(var(--v),.5))*140px)}
    .fd .ft u{position:absolute;left:-5px;right:-5px;height:12px;bottom:calc(var(--v)*140px + 0px);background:#e9ecee;border:2px solid #15191c;box-shadow:0 0 0 2px #e9ecee,0 2px 0 2px #15191c}
    .fd .ft.drag u{background:#ff4a2e}
    .fd b{display:block;margin-top:6px;font:700 11px ${MONO};white-space:nowrap}
    .rot{position:absolute;left:846px;top:298px;width:90px;text-align:center}
    .rot label{display:block;font:700 12px ${COND};letter-spacing:.16em;text-transform:uppercase}
    .rsw{position:relative;width:90px;height:90px;margin-top:6px;cursor:pointer}
    .rsw .dl{position:absolute;inset:16px;border-radius:50%;background:#15191c;border:3px solid #15191c;box-shadow:0 0 0 2px #e9ecee,0 0 0 4px #15191c;transform:rotate(calc(-80deg + var(--si,1)*40deg));transition:transform .15s}
    .rsw .dl:after{content:'';position:absolute;left:calc(50% - 3px);top:-1px;width:6px;height:22px;background:#ff4a2e}
    .rsw span{position:absolute;font:700 12px ${MONO};width:24px;margin-left:-12px;margin-top:-7px;text-align:center}
    .rsw span.on{color:#ff4a2e;font-size:14px}
    .rot b{display:block;margin-top:4px;font:700 12px ${MONO}}
    .rot .mm{margin-top:8px;font:700 10px/1.55 ${MONO};letter-spacing:0;text-align:left;border-top:2px solid #15191c;padding-top:5px;white-space:pre}
    .bars{position:absolute;left:432px;top:264px;width:504px;display:flex;gap:22px}
    .mr{flex:1;display:flex;align-items:center;gap:7px;font:700 11px ${MONO};letter-spacing:.14em;height:18px}
    .mr span{width:26px}.mr div{flex:1;height:10px;border:1.5px solid #15191c;position:relative;background:repeating-linear-gradient(90deg,transparent 0 6px,rgba(21,25,28,.18) 6px 7px)}
    .mr div i{position:absolute;left:0;top:0;bottom:0;background:#15191c;width:0}
    .mr em{width:28px;font-style:normal;text-align:right;font-size:10px}
    .ft2{position:absolute;left:24px;right:24px;bottom:10px;height:14px;font:700 10.5px ${MONO};letter-spacing:.14em;color:#15191c;display:flex;justify-content:space-between;opacity:.75}
    </style>
    <div class="f">
      <div class="tb">
        <svg viewBox="0 0 34 34" fill="none" stroke="#ff4a2e" stroke-width="2.4"><circle cx="17" cy="17" r="12"/><circle cx="17" cy="17" r="5.5"/><path d="M17 1v9M17 24v9M1 17h9M24 17h9"/></svg>
        <h1>Retarget<small>NOTCH ACQUISITION &middot; SWEEP RE-AIM</small></h1><div class="sp"></div>
        <button class="tg" id="tg2">Effect <span id="tgt">locked</span></button>
      </div>
      <div class="chips" id="chips"></div>
      <canvas id="tg"></canvas>
      <canvas id="rs"></canvas>
      <div class="pad" id="pad"><div class="vx"></div><div class="hy"></div><div class="dot"></div><small style="left:5px;bottom:4px">BASE &rarr;</small><small style="left:5px;top:4px">&uarr; REACH</small></div>
      <div class="pv"><span>BASE <b id="v_base" style="color:#15191c"></b></span><span>REACH <b id="v_depth" style="color:#15191c"></b></span></div>
      <div id="fds"></div>
      <div class="rot"><label>Stages</label><div class="rsw" id="rsw"><div class="dl"></div></div><b id="v_n"></b>
        <div class="mm" id="rd"></div></div>
      <div class="bars"><div class="mr"><span>IN</span><div><i id="bi"></i></div><em id="bit"></em></div><div class="mr"><span>OUT</span><div><i id="bo"></i></div><em id="bot"></em></div></div>
      <div class="ft2"><span id="f1"></span><span>RINGS = NOTCH FREQUENCIES &middot; INNER = 20 Hz &middot; OUTER = 20 kHz</span></div>
    </div>`;
    const $ = s => root.querySelector(s);
    // preset chips
    const chips = $('#chips');
    P.presets.forEach((p, i) => { const b = document.createElement('button'); b.innerHTML = '<b>' + (i + 1) + '</b>' + p.name; b.onclick = () => P.loadPreset(i); chips.appendChild(b); });
    P.onPreset(i => [...chips.children].forEach((b, j) => b.classList.toggle('on', j === i)));
    P.bind($('#tg2'), '__bypass'); P.sub('__bypass', on => set($('#tgt'), on ? 'engaged' : 'locked'));
    // pad
    P.bindXY($('#pad'), 'base', 'depth'); P.text($('#v_base'), 'base'); P.text($('#v_depth'), 'depth');
    // faders
    const FD = [['rate', 'Rate', 0], ['mix', 'Mix', 0], ['feedback', 'Fdbk', 1], ['stereo', 'Wide', 0]];
    FD.forEach(([k, lab, bi], i) => {
      const d = document.createElement('div'); d.className = 'fd'; d.style.left = (640 + i * 51) + 'px';
      d.innerHTML = '<label>' + lab + '</label><div class="ft' + (bi ? ' bi' : '') + '"><i></i><u></u></div><b></b>';
      $('#fds').appendChild(d); P.bind(d.querySelector('.ft'), k, { abs: true, axis: 'y' }); P.text(d.querySelector('b'), k);
    });
    // rotary stages
    const rsw = $('#rsw'), sp = [];
    ['2', '4', '6', '8', '12'].forEach((o, i) => {
      const a = (-80 + i * 40 - 90) * Math.PI / 180, s = document.createElement('span'); s.textContent = o;
      s.style.left = (45 + Math.cos(a) * 41) + 'px'; s.style.top = (45 + Math.sin(a) * 41) + 'px';
      s.onclick = e => { e.stopPropagation(); P.set('stages', i); }; rsw.appendChild(s); sp.push(s);
    });
    P.bind(rsw, 'stages');
    P.sub('stages', i => { rsw.style.setProperty('--si', Math.round(i)); sp.forEach((s, j) => s.classList.toggle('on', j === Math.round(i))); set($('#v_n'), P.real('stages') + ' STAGES'); });

    const TW = 380, tx = cvs($('#tg'), TW, TW), CX = TW / 2, CY = TW / 2, RMAX = 178;
    const RW = 504, RH = 152, rx = cvs($('#rs'), RW, RH);
    const FR = freqs(260), buf = new Float32Array(260), tick = live(P);
    const hist = [], rad = f => 14 + (RMAX - 14) * uOf(f);
    let frame = 0;
    P.raf(() => {
      const L = tick(); frame++;
      /* ---- target ---- */
      tx.clearRect(0, 0, TW, TW);
      tx.fillStyle = '#eef0f1'; tx.beginPath(); tx.arc(CX, CY, RMAX + 6, 0, TAU); tx.fill();
      tx.lineWidth = 3; tx.strokeStyle = '#15191c'; tx.stroke();
      // scoring decades
      [[100, '100'], [1000, '1k'], [10000, '10k']].forEach(([f, t]) => {
        tx.beginPath(); tx.arc(CX, CY, rad(f), 0, TAU); tx.lineWidth = 1.2; tx.strokeStyle = 'rgba(21,25,28,.55)'; tx.stroke();
        tx.fillStyle = '#15191c'; tx.font = '700 10px ' + MONO; tx.textAlign = 'center'; tx.fillText(t, CX + 14, CY - rad(f) + 11 - 0);
      });
      for (let k = 0; k < 24; k++) { const f = fAt(k / 23); tx.beginPath(); tx.arc(CX, CY, rad(f), 0, TAU); tx.lineWidth = 0.4; tx.strokeStyle = 'rgba(21,25,28,.25)'; tx.stroke(); }
      // sweep range band
      const lo = clamp(L.base - L.depth, 25, 19000), hi = clamp(L.base + L.depth, 25, 19000);
      tx.beginPath(); tx.arc(CX, CY, rad(hi), 0, TAU); tx.arc(CX, CY, rad(lo), 0, TAU, true); tx.fillStyle = 'rgba(255,74,46,.12)'; tx.fill('evenodd');
      // crosshair
      tx.strokeStyle = '#15191c'; tx.lineWidth = 1; tx.beginPath(); tx.moveTo(CX, CY - RMAX - 6); tx.lineTo(CX, CY + RMAX + 6); tx.moveTo(CX - RMAX - 6, CY); tx.lineTo(CX + RMAX + 6, CY); tx.stroke();
      // echo history of notch radii
      const ns = notches(L.cL, L.N), nr = L.s > 0.02 ? notches(L.cR, L.N) : [];
      if (frame % 3 === 0) { hist.push(ns.map(rad)); if (hist.length > 14) hist.shift(); }
      hist.forEach((h, hi2) => { const a = (hi2 + 1) / (hist.length + 1); h.forEach(r => { tx.beginPath(); tx.arc(CX, CY, r, 0, TAU); tx.lineWidth = 1; tx.strokeStyle = 'rgba(255,74,46,' + (a * 0.28) + ')'; tx.stroke(); }); });
      ns.forEach((f, i) => { tx.beginPath(); tx.arc(CX, CY, rad(f), 0, TAU); tx.lineWidth = 4.5 * (0.35 + L.mix * 0.65) + 0.5; tx.strokeStyle = '#ff4a2e'; tx.stroke(); });
      nr.forEach(f => { tx.beginPath(); tx.setLineDash([6, 4]); tx.arc(CX, CY, rad(f), 0, TAU); tx.lineWidth = 2; tx.strokeStyle = '#15191c'; tx.stroke(); tx.setLineDash([]); });
      // centre-frequency pip on the vertical axis, tick marks
      tx.beginPath(); tx.arc(CX, CY - rad(L.cL), 6, 0, TAU); tx.fillStyle = '#15191c'; tx.fill();
      tx.beginPath(); tx.arc(CX, CY, 5, 0, TAU); tx.fillStyle = '#ff4a2e'; tx.fill();
      // reticle corner brackets
      tx.strokeStyle = '#15191c'; tx.lineWidth = 3; [[0, 0, 1, 1], [TW, 0, -1, 1], [0, TW, 1, -1], [TW, TW, -1, -1]].forEach(([x, y, a, b]) => { tx.beginPath(); tx.moveTo(x + a * 26, y + b * 1.5); tx.lineTo(x + a * 1.5, y + b * 1.5); tx.lineTo(x + a * 1.5, y + b * 26); tx.stroke(); });

      /* ---- response strip ---- */
      rx.clearRect(0, 0, RW, RH);
      rx.fillStyle = '#eef0f1'; rx.fillRect(0, 0, RW, RH); rx.lineWidth = 2; rx.strokeStyle = '#15191c'; rx.strokeRect(1, 1, RW - 2, RH - 2);
      const px = f => 8 + (RW - 16) * uOf(f), py = d => 14 + (14 - d) / 56 * (RH - 34);
      rx.lineWidth = 0.6; rx.strokeStyle = 'rgba(21,25,28,.3)'; rx.fillStyle = '#15191c'; rx.font = '700 9px ' + MONO; rx.textAlign = 'center';
      [[20, '20'], [100, '100'], [1000, '1k'], [10000, '10k']].forEach(([f, t]) => { rx.beginPath(); rx.moveTo(px(f), 6); rx.lineTo(px(f), RH - 16); rx.stroke(); rx.fillText(t, clamp(px(f), 14, RW - 14), RH - 5); });
      [0, -20, -40].forEach(d => { rx.beginPath(); rx.moveTo(8, py(d)); rx.lineTo(RW - 8, py(d)); rx.setLineDash(d ? [2, 4] : []); rx.stroke(); rx.setLineDash([]); rx.textAlign = 'left'; rx.fillText(d + 'dB', 11, py(d) - 2); });
      rx.fillStyle = 'rgba(255,74,46,.14)'; rx.fillRect(px(lo), 6, px(hi) - px(lo), RH - 22);
      rx.strokeStyle = '#ff4a2e'; rx.lineWidth = 1.5; [lo, hi].forEach(f => { rx.beginPath(); rx.moveTo(px(f), 6); rx.lineTo(px(f), RH - 16); rx.stroke(); });
      const plot = (c, col, wd, dash) => { resp(buf, FR, c, L.N, L.fb, L.mix); rx.beginPath(); for (let i = 0; i < FR.length; i++) { const x = px(FR[i]), y = py(buf[i]); i ? rx.lineTo(x, y) : rx.moveTo(x, y); } rx.setLineDash(dash || []); rx.lineWidth = wd; rx.strokeStyle = col; rx.lineJoin = 'round'; rx.stroke(); rx.setLineDash([]); };
      if (L.s > 0.02) plot(L.cR, '#15191c', 1.4, [5, 3]);
      plot(L.cL, '#15191c', 2.6);
      // crosshair on current centre
      rx.strokeStyle = '#ff4a2e'; rx.lineWidth = 1.2; rx.beginPath(); rx.moveTo(px(L.cL), 4); rx.lineTo(px(L.cL), RH - 16); rx.stroke();
      rx.beginPath(); rx.arc(px(L.cL), py(0), 7, 0, TAU); rx.stroke(); rx.beginPath(); rx.arc(px(L.cL), py(0), 2, 0, TAU); rx.fillStyle = '#ff4a2e'; rx.fill();
      rx.fillStyle = '#ff4a2e'; rx.font = '700 11px ' + MONO; rx.textAlign = px(L.cL) > RW - 80 ? 'right' : 'left'; rx.fillText(hz(L.cL), px(L.cL) + (px(L.cL) > RW - 80 ? -10 : 10), 20);

      $('#bi').style.width = (L.i * 100) + '%'; $('#bo').style.width = (L.o * 100) + '%';
      set($('#bit'), L.m.inPeak > 1e-4 ? P.toDb(L.m.inPeak).toFixed(0) : '--'); set($('#bot'), L.m.outPeak > 1e-4 ? P.toDb(L.m.outPeak).toFixed(0) : '--');
      set($('#rd'), ['LOCK ' + hz(L.cL), 'RINGS ' + ns.length + (nr.length ? '+' + nr.length + 'R' : ''), 'LFO ' + (L.lfoL >= 0 ? '+' : '') + L.lfoL.toFixed(2)].join('\n'));
      set($('#f1'), 'TARGET LOCKED ' + hz(L.cL).toUpperCase() + ' / ' + L.N + ' STAGES');
    });
  }

  Kit.register('phaser', {
    fonts: 'family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Rubik+Mono+One&family=DotGothic16&family=Barlow+Condensed:wght@500;700&family=Roboto+Mono:wght@500;700',
    w: 900, h: 540, fmts, presets,
    faces: [
      undefined,
      undefined,
      { key: 'C', name: 'Retarget', accent: '#ff4a2e', w: 960, h: 520, build: buildC }
    ].filter(Boolean)
  });
})();
