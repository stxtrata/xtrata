import { Kit } from "./runtime.js";
/* dist — Distortion. Faces: A Degen (neon casino pedal) / B Liquidation (margin-call slips + leverage ladders) / C Leverage (yellow lifting-beam machine) */
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const MONO = "ui-monospace,'SFMono-Regular',Menlo,Consolas,'Courier New',monospace";
  const IMPACT = "Impact,'Haettenschweiler','Arial Narrow Bold','Arial Black',sans-serif";
  const TNAMES = ['Overdrive', 'Fuzz', 'Hard clip', 'Rectify', 'Fold'];

  /* exact shapers from DSP_NOTES_B.md (fuzz: top hard, bottom 4x softer) */
  function shape(t, x, d) {
    const k = 1 + 20 * d;
    switch (t) {
      case 0: return Math.tanh(k * x) / Math.tanh(k);
      case 1: return x >= 0 ? Math.tanh(k * x) / Math.tanh(k) : Math.tanh(k * x / 4) / Math.tanh(k / 4) * 0.8;
      case 2: return clamp(x * (1 + 30 * d), -1, 1);
      case 3: { const a = Math.tanh(k * x) / Math.tanh(k); return (1 - d) * a + d * Math.abs(a); }
      default: return Math.sin(x * (1 + 7 * d) * Math.PI / 2);
    }
  }
  function glyph(t, w, h, col, sw) {
    let p = ''; const N = 48;
    for (let i = 0; i <= N; i++) { const x = -1 + 2 * i / N; const y = shape(t, x, 0.55); p += (i ? 'L' : 'M') + (w / 2 + x * (w / 2 - 3)).toFixed(1) + ' ' + (h / 2 - y * (h / 2 - 3)).toFixed(1); }
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${p}" fill="none" stroke="${col}" stroke-width="${sw || 2}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  const presets = [
    { name: 'Warm crunch', values: { type: 'overdrive', drive: 0.35, tone: 4500, level: 0.85, mid: 0.2, mix: 1 } },
    { name: 'Amp stack', values: { type: 'overdrive', drive: 0.75, tone: 3400, level: 0.6, mid: 0.55, mix: 1 } },
    { name: 'Fuzz face', values: { type: 'fuzz', drive: 0.6, tone: 3000, level: 0.5, mid: 0.3, mix: 1 } },
    { name: 'Brick wall', values: { type: 'hard', drive: 0.5, tone: 6500, level: 0.55, mid: 0, mix: 1 } },
    { name: 'Octave grit', values: { type: 'rectify', drive: 0.8, tone: 4000, level: 0.6, mid: 0.1, mix: 0.8 } },
    { name: 'Wave folder', values: { type: 'fold', drive: 0.45, tone: 9000, level: 0.7, mid: 0, mix: 0.75 } },
    { name: 'Parallel bite', values: { type: 'overdrive', drive: 0.95, tone: 7000, level: 0.8, mid: 0.35, mix: 0.35 } }
  ];

  /* ---------- shared plumbing ---------- */
  function wire(root, P) {
    root.querySelectorAll('[data-p]').forEach(el => {
      const o = {}; if (el.dataset.abs) { o.abs = true; o.axis = el.dataset.abs; } if (el.dataset.ax) o.axis = el.dataset.ax; if (el.dataset.rng) o.range = +el.dataset.rng;
      P.bind(el, el.dataset.p, o);
    });
    root.querySelectorAll('[data-t]').forEach(el => P.text(el, el.dataset.t));
    root.querySelectorAll('[data-byp]').forEach(el => P.bind(el, '__bypass'));
    root.querySelectorAll('[data-ty]').forEach(el => el.addEventListener('click', () => P.set('type', +el.dataset.ty)));
    P.sub('type', i => root.querySelectorAll('[data-ty]').forEach(e => e.classList.toggle('on', +e.dataset.ty === i)));
    P.sub('type', i => root.querySelectorAll('[data-tname]').forEach(e => { e.textContent = TNAMES[i]; }));
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
  function live(P) {
    const S = { i: 0, o: 0, clip: 0, inLin: 0, outLin: 0, inDb: -90, outDb: -90 };
    P.raf(() => {
      const m = P.meter() || {};
      const f = (a, k) => { const db = clamp(P.toDb(a || 0), -90, 6); const d = clamp((db + 48) / 48, 0, 1); S[k] = Math.max(d, S[k] - 0.025); return db; };
      S.inDb = f(m.inPeak, 'i'); S.outDb = f(m.outPeak, 'o');
      S.inLin = lerp(S.inLin, clamp(m.inPeak || 0, 0, 1.2), 0.35); S.outLin = lerp(S.outLin, clamp(m.outPeak || 0, 0, 1.5), 0.35);
      const c = clamp(+m.clip || 0, 0, 1); S.clip = c > S.clip ? c : lerp(S.clip, c, 0.08);
    });
    return S;
  }
  function transfer(cv, P, S, o) {
    const g = cv.getContext('2d'), W = cv.width, H = cv.height;
    const t = P.get('type'), d = P.get('drive');
    g.fillStyle = o.bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = o.grid; g.lineWidth = o.gw || 1;
    for (let i = 0; i <= 8; i++) { const x = Math.round(i * W / 8) + .5, y = Math.round(i * H / 8) + .5; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    g.strokeStyle = o.axis; g.lineWidth = 1.5; g.beginPath(); g.moveTo(W / 2, 0); g.lineTo(W / 2, H); g.moveTo(0, H / 2); g.lineTo(W, H / 2); g.stroke();
    const px = x => W / 2 + x * (W / 2 - 6), py = y => H / 2 - clamp(y, -1.15, 1.15) * (H / 2 - 6);
    g.setLineDash([5, 5]); g.strokeStyle = o.ident; g.lineWidth = 1.5; g.beginPath(); g.moveTo(px(-1), py(-1)); g.lineTo(px(1), py(1)); g.stroke(); g.setLineDash([]);
    const N = 160;
    if (o.fill) { g.fillStyle = o.fill; g.beginPath(); g.moveTo(px(-1), py(-1)); for (let i = 0; i <= N; i++) { const x = -1 + 2 * i / N; g.lineTo(px(x), py(shape(t, x, d))); } g.lineTo(px(1), py(1)); g.closePath(); g.fill(); }
    g.lineJoin = 'round'; g.lineCap = 'round';
    for (let pass = 0; pass < (o.glow ? 2 : 1); pass++) {
      g.beginPath(); for (let i = 0; i <= N; i++) { const x = -1 + 2 * i / N; const y = shape(t, x, d); i ? g.lineTo(px(x), py(y)) : g.moveTo(px(x), py(y)); }
      if (o.glow && pass === 0) { g.strokeStyle = o.glow; g.lineWidth = (o.lw || 3) + 6; g.globalAlpha = .35; } else { g.strokeStyle = o.line; g.lineWidth = o.lw || 3; g.globalAlpha = 1; }
      g.stroke();
    }
    g.globalAlpha = 1;
    if (o.hot) { /* part of the curve that is flat-topped / pinned */
      g.strokeStyle = o.hot; g.lineWidth = (o.lw || 3) + 0.5; g.beginPath(); let on = false;
      for (let i = 0; i <= N; i++) { const x = -1 + 2 * i / N; const y = shape(t, x, d); const pin = Math.abs(y) > 0.97 && Math.abs(x) < 0.98; if (pin) { on ? g.lineTo(px(x), py(y)) : g.moveTo(px(x), py(y)); on = true; } else on = false; }
      g.stroke();
    }
    const x = clamp(S.inLin, 0, 1), y = shape(t, x, d);
    g.fillStyle = o.dot; g.strokeStyle = o.bg; g.lineWidth = 2;
    [[x, y], [-x, -shape(t, x, d)]].forEach(([a, b], k) => { g.beginPath(); g.arc(px(a), py(b), k ? 3.5 : 5.5, 0, 7); g.fill(); if (!k) g.stroke(); });
    g.strokeStyle = o.dot; g.globalAlpha = .45; g.lineWidth = 1; g.beginPath(); g.moveTo(px(x), py(0)); g.lineTo(px(x), py(y)); g.lineTo(px(0), py(y)); g.stroke(); g.globalAlpha = 1;
  }
  const fmtK = v => v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0) + ' kHz' : Math.round(v) + ' Hz';
  const fmtDb = v => v <= 0.001 ? '-inf' : (20 * Math.log10(v) >= 0 ? '+' : '') + (20 * Math.log10(v)).toFixed(1) + ' dB';
  const dbs = d => d <= -60 ? '-inf' : d.toFixed(1);

  /* =====================================================================
     A — DEGEN: neon casino pedal, 560x560
     ===================================================================== */
  function buildA(root, P) {
    const BUL = 26, MB = 22;
    const knob = (p, lab, sub, big) => `<div class="kc"><div class="kn${big ? ' big' : ''}" data-p="${p}"><span class="kt"></span><i></i></div><b data-t="${p}"></b><u>${lab}</u><em>${sub}</em></div>`;
    root.innerHTML = `<style>
    .f{position:absolute;inset:0;overflow:hidden;user-select:none;-webkit-user-select:none;background:radial-gradient(ellipse at 50% 30%,#3b1260 0,#1d0a35 55%,#0e0420 100%);color:#ffe9ff;font-family:${SANS}}
    .f:before{content:'';position:absolute;inset:0;opacity:.18;background:repeating-linear-gradient(45deg,#fff 0 1px,transparent 1px 14px),repeating-linear-gradient(-45deg,#fff 0 1px,transparent 1px 14px)}
    .frame{position:absolute;inset:7px;border:3px solid #ff2fb3;border-radius:22px;box-shadow:0 0 12px #ff2fb3,inset 0 0 14px #ff2fb388}
    .bulbs{position:absolute;left:24px;right:24px;top:16px;height:14px;display:flex;justify-content:space-between}
    .bulbs i{width:10px;height:10px;border-radius:50%;background:#4a1a55;transition:background .1s,box-shadow .1s}
    .bulbs i.on{background:#ffe14a;box-shadow:0 0 8px #ffe14a,0 0 14px #ff9d00}
    h1{position:absolute;left:30px;top:36px;margin:0;font:italic 900 56px/1 ${IMPACT};letter-spacing:2px;color:#fff;transform:skewX(-8deg);text-shadow:0 0 6px #fff,0 0 14px #ff2fb3,0 0 28px #ff2fb3,0 0 46px #ff2fb3}
    h1 s{text-decoration:none;color:#35f3ff;text-shadow:0 0 6px #fff,0 0 14px #35f3ff,0 0 30px #35f3ff;font-size:.62em;margin-left:2px}
    .tag{position:absolute;left:34px;top:92px;font:700 10px ${MONO};letter-spacing:3px;color:#35f3ff;text-shadow:0 0 6px #35f3ff}
    .pre{position:absolute;left:330px;top:40px;width:158px;height:50px;border:2px solid #ffe14a;border-radius:8px;background:#12041f;box-shadow:0 0 10px #ffe14a77,inset 0 0 10px #000;display:flex;align-items:center;justify-content:space-between;padding:0 6px}
    .pre button{all:unset;cursor:pointer;color:#ffe14a;font:900 18px ${SANS};padding:6px;text-shadow:0 0 8px #ffe14a}
    .pre button:hover{color:#fff}
    .pre div{text-align:center;line-height:1.1}.pre small{display:block;white-space:nowrap;font:700 9px ${MONO};color:#ff2fb3;letter-spacing:2px}
    .pre b{font:900 15px ${IMPACT};letter-spacing:1px;color:#fff;text-shadow:0 0 8px #ffe14a;white-space:nowrap}
    .byp{all:unset;cursor:pointer;position:absolute;left:498px;top:36px;width:50px;height:58px;text-align:center}
    .byp:before{content:'';display:block;width:42px;height:42px;margin:0 auto;border-radius:50%;background:radial-gradient(circle at 35% 30%,#7a3a8a,#2a0c3a);border:3px solid #6b2a7c;box-shadow:0 4px 0 #14041f}
    .byp.on:before{background:radial-gradient(circle at 35% 30%,#fff 0,#59ff9a 25%,#00b85a 70%);border-color:#b8ffd6;box-shadow:0 0 18px #3dff8c,0 2px 0 #14041f}
    .byp span{display:block;font:800 8px ${MONO};letter-spacing:1px;color:#d9b8ff;margin-top:3px}
    .scr{position:absolute;left:28px;top:114px;width:284px;height:204px;border-radius:10px;border:3px solid #35f3ff;box-shadow:0 0 12px #35f3ff,inset 0 0 16px #35f3ff55;background:#08021a;overflow:hidden}
    .scr canvas{display:block;width:100%;height:100%}
    .scr em{position:absolute;left:8px;top:6px;font:800 9px ${MONO};color:#35f3ff;letter-spacing:2px;font-style:normal}
    .scr b{position:absolute;right:8px;top:6px;font:900 11px ${IMPACT};letter-spacing:1px;color:#ff2fb3;text-shadow:0 0 6px #ff2fb3}
    .sc{position:absolute;left:324px;width:208px;height:96px;border-radius:10px;border:3px solid #ffe14a;box-shadow:0 0 10px #ffe14a88,inset 0 0 12px #ffe14a33;background:#0a0318;overflow:hidden}
    .sc canvas{display:block;width:100%;height:100%}
    .sc em{position:absolute;left:8px;top:4px;font:800 9px ${MONO};letter-spacing:2px;font-style:normal;color:#ffe14a;text-shadow:0 0 6px #000}
    .mrow{position:absolute;left:28px;width:504px;display:flex;align-items:center;gap:8px}
    .mrow u{width:34px;text-decoration:none;font:800 10px ${MONO};letter-spacing:1px;color:#d9b8ff}
    .mrow .bb{flex:1;display:flex;gap:3px}
    .mrow .bb i{flex:1;height:13px;border-radius:3px;background:#2b0f40;transition:background .06s}
    .mrow .bb i.on{background:var(--c);box-shadow:0 0 7px var(--c)}
    .mrow s{width:50px;text-decoration:none;text-align:right;font:700 10px ${MONO};color:#fff}
    .types{position:absolute;left:28px;top:366px;width:504px;display:flex;gap:8px}
    .types button{all:unset;cursor:pointer;flex:1;height:62px;border-radius:10px;border:2px solid #6b2a7c;background:linear-gradient(#2c0f45,#190733);text-align:center;color:#c9a5ee;position:relative}
    .types button svg{display:block;margin:5px auto 0}
    .types button b{display:block;font:800 9px ${MONO};letter-spacing:1px;text-transform:uppercase;margin-top:1px}
    .types button small{position:absolute;top:-1px;left:5px;font:900 8px ${MONO};color:#6b2a7c}
    .types button:hover{border-color:#ff2fb3}
    .types button.on{color:#fff;border-color:#ff2fb3;background:linear-gradient(#5a1580,#2d0a4a);box-shadow:0 0 14px #ff2fb3,inset 0 0 14px #ff2fb388}
    .types button.on b{text-shadow:0 0 8px #ff2fb3}
    .knobs{position:absolute;left:20px;right:20px;top:440px;display:flex;justify-content:space-between}
    .kc{width:82px;text-align:center}
    .kn{position:relative;width:54px;height:54px;margin:0 auto;border-radius:50%;cursor:ns-resize;background:radial-gradient(circle at 35% 28%,#ffd6f6,#ff2fb3 38%,#7a0f5c 100%);border:3px solid #fff3;box-shadow:0 4px 0 #14041f,0 0 14px #ff2fb388;touch-action:none}
    .kn.big{background:radial-gradient(circle at 35% 28%,#fff6b0,#ffc400 38%,#a35a00 100%);box-shadow:0 4px 0 #14041f,0 0 16px #ffc400aa}
    .kn i{position:absolute;left:calc(50% - 2.5px);top:3px;width:5px;height:19px;border-radius:3px;background:#fff;box-shadow:0 0 6px #fff;transform-origin:50% 24px;transform:rotate(calc(-135deg + var(--v,0) * 270deg))}
    .kn.drag{box-shadow:0 2px 0 #14041f,0 0 22px #fff}
    .kc b{display:block;margin-top:5px;font:800 11px ${MONO};color:#35f3ff;text-shadow:0 0 6px #35f3ff}
    .kc u{display:block;text-decoration:none;font:900 12px ${IMPACT};letter-spacing:1.5px;color:#fff;margin-top:2px}
    .kc em{display:block;font:600 8px ${MONO};letter-spacing:1px;font-style:normal;color:#ff9be0;margin-top:1px;text-transform:uppercase}
    </style>
    <div class="f"><div class="frame"></div>
    <div class="bulbs">${'<i></i>'.repeat(BUL)}</div>
    <h1>DEGEN<s>drive</s></h1><div class="tag">APE IN. SEND IT. NO STOP-LOSS.</div>
    <div class="pre"><button data-prev>&#9664;</button><div><small>PRESET <span data-pidx></span>/0${presets.length}</small><b data-pname></b></div><button data-next>&#9654;</button></div>
    <button class="byp" data-byp title="Effect on / off"><span class="bl">LIVE</span></button>
    <div class="scr"><canvas id="cv" width="568" height="408"></canvas><em>TRANSFER / <span data-tname></span></em><b id="clip">REKT 0%</b></div>
    <div class="sc" style="top:114px"><canvas id="s1" width="416" height="192"></canvas><em>BEFORE: PAPER HANDS</em></div>
    <div class="sc" style="top:222px"><canvas id="s2" width="416" height="192"></canvas><em>AFTER: DIAMOND HANDS</em></div>
    <div class="mrow" style="top:326px"><u>IN</u><div class="bb" id="bi"></div><s id="ri">-inf</s></div>
    <div class="mrow" style="top:345px"><u>OUT</u><div class="bb" id="bo"></div><s id="ro">-inf</s></div>
    <div class="types">${TNAMES.map((n, i) => `<button data-ty="${i}"><small>${i + 1}</small>${glyph(i, 54, 30, 'currentColor', 2.4)}<b>${n}</b></button>`).join('')}</div>
    <div class="knobs">
      ${knob('drive', 'Drive', 'send it', 1)}${knob('tone', 'Tone', 'cope / hope')}${knob('mid', 'Mid hump', 'the hump')}${knob('level', 'Level', 'bag size')}${knob('mix', 'Mix', 'dry / wet')}
    </div></div>`;
    const $ = s => root.querySelector(s);
    wire(root, P);
    P.sub('__bypass', on => { $('.bl').textContent = on ? 'LIVE' : 'FLAT'; });
    const mk = (id, n) => { const el = $(id); el.innerHTML = '<i></i>'.repeat(n); return [...el.children].map((e, k) => { const f = k / (n - 1); e.style.setProperty('--c', f < .6 ? '#35f3ff' : f < .85 ? '#ffe14a' : '#ff2fb3'); return e; }); };
    const bi = mk('#bi', MB), bo = mk('#bo', MB), bulbs = [...root.querySelectorAll('.bulbs i')];
    const S = live(P);
    P.scope($('#s1'), { tap: 'in', color: '#35f3ff', bg: '#0a0318', grid: '#2a1550', glow: 6, width: 2.5 });
    P.scope($('#s2'), { tap: 'out', color: '#ff2fb3', bg: '#0a0318', grid: '#2a1550', glow: 8, width: 2.5 });
    let ph = 0;
    P.raf(t => {
      transfer($('#cv'), P, S, { bg: '#08021a', grid: '#1d0d3c', axis: '#4a2a80', ident: '#6b5a9a', line: '#ff2fb3', glow: '#ff2fb3', hot: '#ffe14a', dot: '#35f3ff', lw: 3.5, gw: 1 });
      bi.forEach((e, k) => e.classList.toggle('on', k / MB < S.i)); bo.forEach((e, k) => e.classList.toggle('on', k / MB < S.o));
      $('#ri').textContent = dbs(S.inDb); $('#ro').textContent = dbs(S.outDb);
      $('#clip').textContent = 'REKT ' + Math.round(S.clip * 100) + '%';
      ph = t / 90 | 0; const spd = 1 + Math.round(S.o * 3);
      bulbs.forEach((e, k) => e.classList.toggle('on', ((k + (ph * spd >> 0)) % 3) === 0));
    });
  }

  /* =====================================================================
     B — LIQUIDATION: margin-call slip + leverage ladders, 960x540
     ===================================================================== */
  

  /* =====================================================================
     C — LEVERAGE: yellow lifting-beam machine, 800x540
     ===================================================================== */
  

  Kit.register('dist', {
    fonts: '',
    w: 960, h: 560,
    labels: { mid: 'Mid hump' },
    fmts: {
      drive: v => Math.round(v * 100) + '%',
      tone: fmtK,
      level: fmtDb,
      mid: v => Math.round(v * 100) + '%',
      mix: v => Math.round(v * 100) + '%'
    },
    presets,
    faces: [
      { key: 'A', name: 'Degen', accent: '#ff2fb3', w: 560, h: 560, build: buildA },
      undefined,
      undefined
    ].filter(Boolean)
  });
})();
