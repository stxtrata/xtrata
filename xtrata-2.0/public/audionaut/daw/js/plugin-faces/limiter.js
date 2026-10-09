import { Kit } from "./runtime.js";
/* limiter -- Brickwall Limiter. Three faces: A Hardcap / B Stoploss / C Twentyone.
 * Real params (from plugins.js): ceiling, release, input, safety (select -> face-native index 0/1).
 * Meter: {reduction (dB<=0), inPeak, outPeak}. Honest note: with Safety off the native limiter can overshoot the ceiling. */
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const dbf = x => 20 * Math.log10(Math.max(1e-6, x));
  const fd = (v, d) => (v <= -99 ? '−∞' : (v < -0.049 ? '−' : v > 0.049 ? '+' : '') + Math.abs(v).toFixed(d == null ? 1 : d));
  const setT = (el, s) => { if (el && el._s !== s) { el._s = s; el.textContent = s; } };
  const setup = (c, w, h) => { c.width = w * 2; c.height = h * 2; c.style.width = w + 'px'; c.style.height = h + 'px'; const g = c.getContext('2d'); g.setTransform(2, 0, 0, 2, 0, 0); return g; };

  /* rotary tick ring as inline SVG (viewBox 0 0 100 100) */
  const ticksSvg = (n, r1, r2, major, col, col2) => {
    let s = '';
    for (let i = 0; i <= n; i++) {
      const a = (-135 + 270 * i / n - 90) * Math.PI / 180, big = major && i % major === 0, rr = big ? r1 - 3 : r1;
      s += `<line x1="${(50 + Math.cos(a) * rr).toFixed(2)}" y1="${(50 + Math.sin(a) * rr).toFixed(2)}" x2="${(50 + Math.cos(a) * r2).toFixed(2)}" y2="${(50 + Math.sin(a) * r2).toFixed(2)}" stroke="${big ? (col2 || col) : col}" stroke-width="${big ? 1.8 : 1}" stroke-linecap="round"/>`;
    }
    return `<svg viewBox="0 0 100 100" class="tk">${s}</svg>`;
  };

  /* shared live-level model: smoothed readouts, holds, rolling history, hit counter */
  function Live(P, n, stepMs) {
    const L = {
      n, drv: new Float32Array(n).fill(-120), out: new Float32Array(n).fill(-120), gr: new Float32Array(n), pushed: 0,
      inD: -120, drvD: -120, outD: -120, grD: 0, holdIn: -120, holdOut: -120, holdGr: 0, hits: 0, overs: 0, worst: 0, ceil: -3, eng: true,
      _t: 0, _acc: 0, _d: -120, _o: -120, _g: 0, _on: false, _ht: 0
    };
    L.tick = t => {
      const dt = L._t ? Math.min(0.1, (t - L._t) / 1000) : 0.016; L._t = t;
      const m = P.meter(); L.eng = P.engaged(); L.ceil = P.get('ceiling');
      const inDb = dbf(m.inPeak), out = dbf(m.outPeak), drv = L.eng ? inDb + P.get('input') : inDb;
      let gr = L.eng ? (m.reduction != null ? Math.min(0, m.reduction) : Math.min(0, out - drv)) : 0;
      if (!isFinite(gr)) gr = 0;
      const dn = 46 * dt;
      L.inD = Math.max(inDb, L.inD - dn); L.drvD = Math.max(drv, L.drvD - dn); L.outD = Math.max(out, L.outD - dn);
      L.grD = Math.min(gr, L.grD + 26 * dt);
      L._ht -= dt;
      if (inDb >= L.holdIn || L._ht <= 0) { L.holdIn = Math.max(inDb, L._ht <= 0 ? inDb : L.holdIn); }
      if (out >= L.holdOut) { L.holdOut = out; L._ht = 1.6; } else if (L._ht <= 0) L.holdOut = Math.max(out, L.holdOut - 20 * dt);
      if (gr < L.holdGr) L.holdGr = gr; else if (L._ht <= 0) L.holdGr = Math.min(0, L.holdGr + 14 * dt);
      if (gr < L.worst) L.worst = gr;
      if (gr < -0.5 && !L._on) { L._on = true; L.hits++; } else if (gr > -0.2) L._on = false;
      if (L.eng && out > L.ceil + 0.4) L.overs++;
      L._d = Math.max(L._d, drv); L._o = Math.max(L._o, out); L._g = Math.min(L._g, gr);
      L._acc += dt * 1000;
      while (L._acc >= stepMs) {
        L._acc -= stepMs; L.drv.copyWithin(0, 1); L.out.copyWithin(0, 1); L.gr.copyWithin(0, 1);
        L.drv[n - 1] = L._d; L.out[n - 1] = L._o; L.gr[n - 1] = L._g; L._d = -120; L._o = -120; L._g = 0; L.pushed++;
      }
    };
    L.clear = () => { L.hits = 0; L.overs = 0; L.worst = 0; L.holdOut = -120; L.holdIn = -120; L.holdGr = 0; };
    return L;
  }

  /* generic wiring: [data-p] controls, [data-t] value text, preset browser pieces */
  function wire(root, P) {
    root.querySelectorAll('[data-p]').forEach(el => {
      const o = {}; if (el.dataset.abs) { o.abs = true; o.axis = el.dataset.abs; } if (el.dataset.ax) o.axis = el.dataset.ax;
      if (el.dataset.rng) o.range = +el.dataset.rng; if (el.dataset.inv) o.invert = true; P.bind(el, el.dataset.p, o);
    });
    root.querySelectorAll('[data-t]').forEach(el => P.text(el, el.dataset.t));
    const n = P.presets.length; let idx = -1;
    P.onPreset((i, nm) => {
      idx = i;
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = nm || 'Custom'; });
      root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = (i < 0 ? '--' : String(i + 1).padStart(2, '0')) + '/' + String(n).padStart(2, '0'); });
      root.querySelectorAll('[data-pip]').forEach(e => e.classList.toggle('on', +e.dataset.pip === i));
    });
    root.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx - 1 + n) % n)));
    root.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx + 1) % n)));
    root.querySelectorAll('[data-pip]').forEach(b => b.addEventListener('click', () => P.loadPreset(+b.dataset.pip)));
    if (idx < 0 && n) P.loadPreset(0);
  }

  /* segmented meter on canvas. o: {x,y,w,h,v 0..1,n,vert,rev,col(f)->css,off,gap} */
  function bar(g, o) {
    const gap = o.gap == null ? 1.5 : o.gap, lit = Math.round(clamp(o.v, 0, 1) * o.n);
    for (let i = 0; i < o.n; i++) {
      const f = (i + 0.5) / o.n, on = i < lit;
      g.fillStyle = on ? o.col(f) : (o.off || '#1c2026');
      if (o.vert) {
        const sh = o.h / o.n; const yy = o.rev ? o.y + i * sh : o.y + o.h - (i + 1) * sh;
        g.fillRect(o.x, yy + gap / 2, o.w, Math.max(1, sh - gap));
      } else {
        const sw = o.w / o.n; const xx = o.rev ? o.x + o.w - (i + 1) * sw : o.x + i * sw;
        g.fillRect(xx + gap / 2, o.y, Math.max(1, sw - gap), o.h);
      }
    }
  }

  const FACE_FONTS = {
    A: "'Oswald','Bebas Neue','Arial Narrow',Impact,sans-serif",
    Am: "'Space Mono','IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace",
    B: "'Barlow Condensed','Arial Narrow','Roboto Condensed',Impact,sans-serif",
    Bm: "'JetBrains Mono','IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace",
    C: "'Jost','Inter Tight','Helvetica Neue',Helvetica,Arial,sans-serif",
    Cm: "'IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace"
  };

  /* =====================================================================
     FACE A -- HARDCAP   (fixed-supply cap slab, issuance ledger, odometer)
     ===================================================================== */
  

  /* =====================================================================
     FACE B -- STOPLOSS   (red order line over a chart, e-stop, hazard tape)
     ===================================================================== */
  function buildStoploss(root, P) {
    const RD = '#ff4d4d';
    root.innerHTML = `<style>
      *{box-sizing:border-box;user-select:none;-webkit-user-select:none}
      .f{position:absolute;inset:0;overflow:hidden;background:#0a0b0e;color:#d7dbe3;font-family:${FACE_FONTS.Bm}}
      .tape{position:absolute;left:0;right:0;height:10px;background:repeating-linear-gradient(-45deg,#ffcc00 0 12px,#15161a 12px 24px)}
      .hd{position:absolute;left:18px;right:18px;top:20px;height:44px;display:flex;align-items:center;gap:16px}
      .wm{font:800 38px/1 ${FACE_FONTS.B};letter-spacing:.03em;text-transform:uppercase;color:#fff;white-space:nowrap;display:flex;align-items:center;gap:10px}
      .wm small{font:500 9px/1.3 ${FACE_FONTS.Bm};letter-spacing:.18em;color:#7b8190;display:block;white-space:nowrap}
      .tk{flex:1;font-size:10.5px;letter-spacing:.08em;color:#7b8190;text-align:center;white-space:nowrap;overflow:hidden}
      .tk b{color:${RD};font-weight:600}
      .pill{flex:none;width:150px;height:30px;border:1px solid #3a2022;display:flex;align-items:center;justify-content:center;gap:8px;font:700 13px/1 ${FACE_FONTS.B};letter-spacing:.2em;color:#7b8190;background:#13090a}
      .pill i{width:9px;height:9px;background:#4a2326}
      .pill.on{border-color:${RD};color:#fff;background:#2a0f10}.pill.on i{background:${RD};box-shadow:0 0 8px ${RD}}
      .pill::after{content:'TRIPPED'}.pill.on::after{content:'ARMED'}
      .lf{position:absolute;left:18px;top:74px;width:188px;height:296px;display:flex;flex-direction:column;gap:8px}
      .bx{background:#101217;border:1px solid #22262e;position:relative}
      .bx>h4{margin:0;padding:6px 8px;font:600 9.5px/1 ${FACE_FONTS.Bm};letter-spacing:.16em;color:#7b8190;border-bottom:1px solid #22262e}
      .lst{flex:1;display:flex;flex-direction:column}
      .lst div{flex:1;display:flex;align-items:center;gap:8px;padding:0 8px;font:600 13px/1 ${FACE_FONTS.B};letter-spacing:.03em;text-transform:uppercase;color:#8b91a0;cursor:pointer;border-bottom:1px solid #1a1d24;border-left:3px solid transparent;white-space:nowrap;overflow:hidden}
      .lst div em{font:400 9px/1 ${FACE_FONTS.Bm};font-style:normal;color:#505665;flex:none;width:18px}
      .lst div:hover{background:#171a21;color:#fff}
      .lst div.on{background:#220e10;color:#fff;border-left-color:${RD}}.lst div.on em{color:${RD}}
      .st{height:62px;padding:8px;display:grid;grid-template-columns:1fr auto;gap:3px 8px;font-size:10px;color:#7b8190;align-content:center}
      .st b{color:#fff;font-weight:600;text-align:right}
      .ch{position:absolute;left:218px;top:74px;width:472px;height:296px;background:#07080b;border:1px solid #22262e;overflow:hidden}
      .ch canvas{position:absolute;left:0;top:0}
      .ov{position:absolute;left:0;cursor:ns-resize;touch-action:none}
      .ov .tg{position:absolute;right:-46px;top:calc((1 - var(--v,.875)) * 100%);transform:translateY(-50%);width:44px;height:18px;background:${RD};color:#fff;font:700 10px/18px ${FACE_FONTS.Bm};text-align:center;clip-path:polygon(8px 0,100% 0,100% 100%,8px 100%,0 50%);padding-left:5px}
      .ov .hn{position:absolute;left:0;right:0;top:calc((1 - var(--v,.875)) * 100%);height:18px;transform:translateY(-50%)}
      .rt{position:absolute;left:702px;top:74px;width:180px;height:296px;display:flex;flex-direction:column;gap:8px}
      .rt canvas{display:block}
      .rd{display:grid;grid-template-columns:repeat(3,1fr);height:54px}
      .rd div{padding:8px 4px 0;text-align:center;font-size:9px;color:#7b8190;letter-spacing:.14em;border-right:1px solid #1a1d24}.rd div:last-child{border:0}
      .rd b{display:block;font:600 14px/1.5 ${FACE_FONTS.Bm};color:#fff;letter-spacing:0}
      .bt{position:absolute;left:18px;right:18px;top:382px;height:144px;display:grid;grid-template-columns:170px 1fr 1fr 110px 118px;gap:8px}
      .md{padding:30px 12px 10px;position:relative}
      .md>h4{position:absolute;left:0;right:0;top:0;margin:0;padding:7px 10px;white-space:nowrap;font:700 14px/1 ${FACE_FONTS.B};letter-spacing:.1em;color:#fff;border-bottom:1px solid #22262e;display:flex;justify-content:space-between;align-items:baseline;text-transform:uppercase}
      .md>h4 em{font:400 8.5px/1 ${FACE_FONTS.Bm};font-style:normal;letter-spacing:.12em;color:#505665}
      .stp{display:flex;flex-wrap:wrap;align-items:center;gap:6px;height:84px;align-content:flex-start}
      .stp button{all:unset;cursor:pointer;flex:1;height:34px;text-align:center;font:700 22px/34px ${FACE_FONTS.Bm};background:#181b22;border:1px solid #2c313b;color:#fff;order:2}
      .stp button:hover{background:${RD}}
      .stp .v{flex:0 0 100%;text-align:center;font:700 26px/36px ${FACE_FONTS.Bm};color:${RD};white-space:nowrap}
      .cap2{font-size:9px;color:#505665;letter-spacing:.1em;text-align:center;margin-top:-6px}
      .rdo{display:flex;justify-content:space-between;align-items:baseline;margin-top:2px}
      .rdo b{font:700 22px/1 ${FACE_FONTS.Bm};color:#fff;white-space:nowrap}
      .rdo span{font-size:8.5px;color:#505665;letter-spacing:.08em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-left:8px}
      .fd{position:relative;height:40px;margin-top:6px;cursor:ew-resize;touch-action:none}
      .fd .ln{position:absolute;left:0;right:0;top:19px;height:2px;background:#2c313b}
      .fd .fl{position:absolute;left:0;top:18px;height:4px;width:calc(var(--v,0) * 100%);background:${RD}}
      .fd .tc{position:absolute;inset:0;background:repeating-linear-gradient(90deg,#3a404c 0 1px,transparent 1px 10%);-webkit-mask:linear-gradient(transparent 10px,#000 10px,#000 14px,transparent 14px);mask:linear-gradient(transparent 10px,#000 10px,#000 14px,transparent 14px)}
      .fd .hd2{position:absolute;left:calc(var(--v,0) * 100%);top:5px;width:20px;height:30px;margin-left:-10px;background:linear-gradient(90deg,#e8eaee,#9aa0ad 50%,#e8eaee);border:1px solid #fff;box-shadow:0 3px 6px rgba(0,0,0,.6)}
      .fd .hd2::after{content:'';position:absolute;left:9px;top:3px;width:2px;height:22px;background:${RD}}
      .gs{display:flex;flex-direction:column;align-items:center;gap:6px}
      .lv{position:relative;width:52px;height:64px;cursor:pointer;touch-action:none;background:#0a0b0e;border:1px solid #2c313b}
      .lv::before{content:'';position:absolute;left:21px;top:6px;width:10px;height:52px;background:#1c1f26;border-radius:5px}
      .lv i{position:absolute;left:19px;width:14px;height:28px;background:linear-gradient(90deg,#b92a2a,${RD},#b92a2a);border-radius:5px;transition:top .12s;top:30px;box-shadow:0 2px 4px rgba(0,0,0,.6)}
      .lv[data-index="1"] i{top:5px}
      .lv span{position:absolute;right:3px;font-size:7.5px;letter-spacing:.06em;color:#505665}
      .lv span.a{top:5px}.lv span.b{bottom:5px}
      .gs p{margin:0;font-size:8.5px;line-height:1.4;letter-spacing:.06em;color:#7b8190;text-align:center}
      .es{display:flex;flex-direction:column;align-items:center;gap:6px;padding-top:34px;background:#101217}
      .base{width:84px;height:84px;background:repeating-linear-gradient(-45deg,#ffcc00 0 8px,#15161a 8px 16px);display:flex;align-items:center;justify-content:center;border:2px solid #0a0b0e}
      .mush{all:unset;cursor:pointer;width:66px;height:66px;border-radius:50%;background:radial-gradient(circle at 38% 30%,#ff8a8a,#e02a2a 45%,#8a0f0f 100%);box-shadow:0 7px 0 #5a0808,0 10px 12px rgba(0,0,0,.7);transform:translateY(-5px);transition:all .08s;border:2px solid #3a0505}
      .mush:not(.on){transform:translateY(1px);box-shadow:0 1px 0 #5a0808,0 2px 4px rgba(0,0,0,.7);filter:brightness(.55) saturate(.8)}
      .es em{font:600 9px/1 ${FACE_FONTS.Bm};font-style:normal;letter-spacing:.16em;color:#7b8190}
    </style>
    <div class="f">
      <div class="tape" style="top:0"></div><div class="tape" style="bottom:0"></div>
      <div class="hd">
        <div class="wm"><svg width="40" height="40" viewBox="0 0 40 40"><polygon points="12,1 28,1 39,12 39,28 28,39 12,39 1,28 1,12" fill="${RD}"/><rect x="8" y="17" width="24" height="6" fill="#fff"/></svg><div>Stoploss<small>PEAK EXIT ORDER &middot; NO FILL ABOVE THE LINE</small></div></div>
        <div class="tk" id="tk">STOP LEVEL <b>-3.0 dB</b></div>
        <div class="pill" data-p="__bypass" title="effect on / off"><i></i></div>
      </div>
      <div class="lf">
        <div class="bx lst" id="ls"><h4>ORDER TEMPLATES</h4></div>
        <div class="bx st"><span>STOPS TRIGGERED</span><b id="s1">0</b><span>WORST SLIP</span><b id="s2">0.0 dB</b><span>OVER THE LINE</span><b id="s3">0</b></div>
      </div>
      <div class="ch" id="ch"><canvas id="cv"></canvas><div class="ov" id="ov" data-p="ceiling" data-abs="y" title="drag the red stop line"><div class="hn"></div><div class="tg" id="tg">-3.0</div></div></div>
      <div class="rt">
        <div class="bx"><canvas id="mt"></canvas></div>
        <div class="bx rd"><div>IN<b id="r1">-</b></div><div>OUT<b id="r2">-</b></div><div>DRAWDOWN<b id="r3">0.0</b></div></div>
      </div>
      <div class="bt">
        <div class="bx md"><h4>STOP LEVEL<em>CEILING</em></h4>
          <div class="stp"><button id="m1" title="lower the stop">&minus;</button><div class="v" data-t="ceiling"></div><button id="p1" title="raise the stop">+</button></div>
          <div class="cap2">0.5 dB PER CLICK</div></div>
        <div class="bx md"><h4>POSITION SIZE<em>INPUT</em></h4>
          <div class="rdo"><b data-t="input"></b><span>INTO THE STOP</span></div>
          <div class="fd" data-p="input" data-abs="x"><div class="tc"></div><div class="ln"></div><div class="fl"></div><div class="hd2"></div></div></div>
        <div class="bx md"><h4>COOLDOWN<em>RELEASE</em></h4>
          <div class="rdo"><b data-t="release"></b><span>RE-ENTRY</span></div>
          <div class="fd" data-p="release" data-abs="x"><div class="tc"></div><div class="ln"></div><div class="fl"></div><div class="hd2"></div></div></div>
        <div class="bx md"><h4 style="font-size:12px;letter-spacing:.06em">GUARANTEED</h4>
          <div class="gs"><div class="lv" data-p="safety" title="safety clip after the limiter"><span class="a">ON</span><span class="b">OFF</span><i></i></div><p id="gp"></p></div></div>
        <div class="bx es"><div class="base"><button class="mush" data-p="__bypass" title="emergency bypass"></button></div><em>E-STOP / BYPASS</em></div>
      </div>
    </div>`;
    const $ = s => root.querySelector(s);
    wire(root, P);
    const ls = $('#ls');
    P.presets.forEach((p, i) => { const d = document.createElement('div'); d.dataset.pip = i; d.innerHTML = `<em>${String(i + 1).padStart(2, '0')}</em>${p.name}`; ls.appendChild(d); });
    ls.querySelectorAll('[data-pip]').forEach(b => b.addEventListener('click', () => P.loadPreset(+b.dataset.pip)));
    P.onPreset(i => ls.querySelectorAll('[data-pip]').forEach(e => e.classList.toggle('on', +e.dataset.pip === i)));
    $('#m1').addEventListener('click', () => P.set('ceiling', P.get('ceiling') - 0.5));
    $('#p1').addEventListener('click', () => P.set('ceiling', P.get('ceiling') + 0.5));
    P.sub('safety', v => setT($('#gp'), v ? 'NO SLIPPAGE\nHARD FLOOR ON' : 'STANDARD STOP\nMAY SLIP'));
    $('#gp').style.whiteSpace = 'pre';
    const CW = 472, CH = 296, PL = 428, PT = 14, PH = CH - 28, LO = -30, HI = 3;
    const yOf = db => PT + (HI - clamp(db, LO, HI)) / (HI - LO) * PH;
    const g = setup($('#cv'), CW, CH), L = Live(P, 214, 50);
    const ov = $('#ov'); ov.style.width = PL + 'px'; ov.style.top = yOf(0) + 'px'; ov.style.height = (yOf(-24) - yOf(0)) + 'px';
    const MW = 178, MH = 238, gm = setup($('#mt'), MW, MH);
    let marks = [];
    function chart() {
      const cl = yOf(L.ceil), cw = PL / L.n;
      g.clearRect(0, 0, CW, CH); g.fillStyle = '#07080b'; g.fillRect(0, 0, CW, CH);
      g.font = '9px monospace'; g.textBaseline = 'middle'; g.textAlign = 'left';
      for (let d = 0; d >= -30; d -= 6) { const y = yOf(d); g.strokeStyle = d === 0 ? '#3a404c' : '#14171d'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, y); g.lineTo(PL, y); g.stroke(); g.fillStyle = '#505665'; g.fillText(String(d), PL + 6, d === -30 ? y - 6 : y + 11); }
      const ph = (L.pushed % 36); g.strokeStyle = '#101319'; for (let x = PL - ph * cw; x > 0; x -= 36 * cw) { g.beginPath(); g.moveTo(x, PT); g.lineTo(x, PT + PH); g.stroke(); }
      g.fillStyle = 'rgba(255,77,77,.07)'; g.fillRect(0, PT, PL, cl - PT);
      for (let i = 0; i < L.n; i++) { const x = i * cw; if (L.drv[i] > L.ceil + 0.05) { const y1 = yOf(L.drv[i]); g.fillStyle = 'rgba(255,77,77,.38)'; g.fillRect(x, y1, cw + .5, cl - y1); } }
      g.lineWidth = 1.2; g.strokeStyle = '#5b6f9e'; g.beginPath(); for (let i = 0, pen = false; i < L.n; i++) { const x = i * cw, y = yOf(L.drv[i]); if (L.drv[i] < -60) { pen = false; continue; } pen ? g.lineTo(x, y) : g.moveTo(x, y); pen = true; } g.stroke();
      g.lineWidth = 2; g.strokeStyle = '#f2f4f8'; g.lineJoin = 'round'; g.beginPath(); for (let i = 0, pen = false; i < L.n; i++) { const x = i * cw, y = yOf(L.out[i]); if (L.out[i] < -60) { pen = false; continue; } pen ? g.lineTo(x, y) : g.moveTo(x, y); pen = true; } g.stroke();
      g.strokeStyle = RD; g.lineWidth = 2; g.shadowColor = RD; g.shadowBlur = 8; g.setLineDash([10, 5]); g.beginPath(); g.moveTo(0, cl); g.lineTo(PL, cl); g.stroke(); g.setLineDash([]); g.shadowBlur = 0;
      g.fillStyle = RD; g.font = '700 9px monospace'; g.fillText('STOP ORDER', 8, cl - 7);
      g.lineWidth = 1.6; g.strokeStyle = '#fff'; let last = -99;
      for (let i = 0; i < L.n; i++) if (L.gr[i] < -1.5 && i - last > 7) { last = i; const x = i * cw, y = cl + 9; g.beginPath(); g.moveTo(x - 3, y - 3); g.lineTo(x + 3, y + 3); g.moveTo(x + 3, y - 3); g.lineTo(x - 3, y + 3); g.stroke(); }
      if (!L.eng) { g.fillStyle = 'rgba(7,8,11,.72)'; g.fillRect(0, 0, CW, CH); g.fillStyle = RD; g.font = '700 16px monospace'; g.textAlign = 'center'; g.fillText('E-STOP PRESSED - NO ORDER ACTIVE', PL / 2, CH / 2); }
    }
    function meters() {
      gm.clearRect(0, 0, MW, MH); gm.fillStyle = '#101217'; gm.fillRect(0, 0, MW, MH);
      const f = db => clamp((db + 36) / 39, 0, 1), top = 24, hh = 196, xs = [12, 66, 120], w = 40;
      gm.font = '9px monospace'; gm.textAlign = 'center'; gm.fillStyle = '#7b8190';
      ['IN', 'OUT', 'DD'].forEach((s, i) => gm.fillText(s, xs[i] + w / 2, 12));
      const rails = (x) => { gm.fillStyle = '#07080b'; gm.fillRect(x, top, w, hh); };
      xs.forEach(rails);
      const grad = (x, v, c1, c2) => { const gg = gm.createLinearGradient(0, top + hh, 0, top); gg.addColorStop(0, c1); gg.addColorStop(1, c2); gm.fillStyle = gg; gm.fillRect(x, top + hh - v * hh, w, v * hh); };
      grad(xs[0], f(L.inD), '#2b3550', '#8fa3d6'); grad(xs[1], f(L.outD), '#6b7280', '#f2f4f8');
      gm.fillStyle = '#ff4d4d'; gm.fillRect(xs[2], top, w, clamp(-L.grD / 24, 0, 1) * hh);
      gm.strokeStyle = '#2c313b'; gm.lineWidth = 1; gm.fillStyle = '#505665'; gm.textAlign = 'right';
      [0, -6, -12, -24, -36].forEach(d => { const y = top + hh - f(d) * hh; gm.beginPath(); gm.moveTo(xs[0] - 4, y); gm.lineTo(xs[0] + 2, y); gm.moveTo(xs[1] - 4, y); gm.lineTo(xs[1] + 2, y); gm.stroke(); });
      const cy = top + hh - f(L.ceil) * hh; gm.fillStyle = RD; gm.fillRect(xs[0] - 6, cy - 1, w * 2 + 66 - 12, 2);
      gm.fillStyle = '#fff'; gm.fillRect(xs[1], top + hh - f(L.holdOut) * hh - 1, w, 2);
      gm.textAlign = 'center'; gm.fillStyle = '#505665'; [0, -6, -12, -18, -24].forEach(d => gm.fillText(String(d), xs[2] + w / 2, top + (-d / 24) * hh + (d === 0 ? 9 : -2)));
    }
    P.raf(t => {
      L.tick(t); chart(); meters();
      setT($('#tg'), fd(L.ceil, 1));
      setT($('#r1'), fd(L.inD, 1)); setT($('#r2'), fd(L.outD, 1)); setT($('#r3'), fd(L.grD, 1));
      setT($('#s1'), String(L.hits)); setT($('#s2'), fd(L.worst, 1) + ' dB'); setT($('#s3'), String(L.overs));
      setT($('#tk'), !L.eng ? 'E-STOP PRESSED · NOTHING IS PROTECTED' : L.drvD < -60 ? 'MARKET CLOSED · PLAY SOMETHING' : L.grD < -0.5 ? 'STOPPED OUT · CUT ' + (-L.grD).toFixed(1) + ' dB AT ' + fd(L.ceil, 1) : 'IN POSITION · STOP AT ' + fd(L.ceil, 1) + ' dB');
    });
    $('#ch').addEventListener('dblclick', () => L.clear());
  }

  /* =====================================================================
     FACE C -- TWENTYONE   (restrained mastering rack unit, loudness-style meters)
     ===================================================================== */
  

  Kit.register('limiter', {
    fonts: 'family=Oswald:wght@500;700&family=Space+Mono:wght@400;700&family=Barlow+Condensed:wght@500;700;800&family=JetBrains+Mono:wght@400;600;700&family=Jost:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500',
    w: 960, h: 560,
    labels: { ceiling: 'Ceiling', release: 'Release', input: 'Input', safety: 'Safety Clip' },
    fmts: { release: v => (v < 1 ? Math.round(v * 1000) + ' ms' : v.toFixed(2) + ' s'), ceiling: v => (v > -0.05 ? '0.0' : '−' + Math.abs(v).toFixed(1)) + ' dB', input: v => '+' + v.toFixed(1) + ' dB' },
    presets: [
      { name: 'Init', values: {} },
      { name: 'Final Master', values: { ceiling: -0.3, release: 0.3, input: 3, safety: 'off' } },
      { name: 'Streaming Ready', values: { ceiling: -1, release: 0.2, input: 5, safety: 'on' } },
      { name: 'Drum Bus Slam', values: { ceiling: -3, release: 0.04, input: 10, safety: 'on' } },
      { name: 'Vocal Guard', values: { ceiling: -4, release: 0.15, input: 2, safety: 'off' } },
      { name: 'Broadcast Wall', values: { ceiling: -6, release: 0.25, input: 8, safety: 'on' } },
      { name: 'Peak Catch', values: { ceiling: -1.5, release: 0.4, input: 1.5, safety: 'off' } }
    ],
    faces: [
      undefined,
      { key: 'B', name: 'Stoploss', accent: '#ff4d4d', w: 900, h: 540, build: buildStoploss },
      undefined
    ].filter(Boolean)
  });
})();
