import { Kit } from "./runtime.js";
/* filter — Multimode Filter. Faces: A Coinjoin (pipes merging into one trunk, mixing-board faders) / B Sybil (a crowd of identical masks through a sieve) / C Blocklist (brutalist deny-list table, red strikes) */
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const MONO = "ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace";
  const N = 180;
  const FREQS = new Float32Array(N); for (let i = 0; i < N; i++) FREQS[i] = 20 * Math.pow(1000, i / (N - 1));
  const xOf = f => Math.log(clamp(f, 20, 20000) / 20) / Math.log(1000);
  const fOf = x => 20 * Math.pow(1000, clamp(x, 0, 1));
  const hz = v => v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 1 : 2).replace(/\.?0+$/, '') + ' kHz' : Math.round(v) + ' Hz';
  const dbOf = x => (x > 1e-5 ? 20 * Math.log10(x) : -90);
  const sgn = (v, d) => (v > 0 ? '+' : '') + v.toFixed(d == null ? 1 : d);
  const setT = (el, s) => { if (el && el._s !== s) { el._s = s; el.textContent = s; } };
  const respAt = (r, f) => { const p = xOf(f) * (N - 1), i = Math.min(N - 2, Math.floor(p)); return lerp(r[i], r[i + 1], p - i); };

  const presets = [
    { name: 'Open Door', values: {} },
    { name: 'Telephone', values: { mode: 'bp', cutoff: 1400, q: 1.4, slope: '24', drive: 0.35, out: 1 } },
    { name: 'Auto-Wah', values: { mode: 'bp', cutoff: 650, q: 6, slope: '12', drive: 0.2, follow: 0.7, lfoDepth: 0, out: 0 } },
    { name: 'Slow Sweep', values: { mode: 'lp', cutoff: 900, q: 8, slope: '24', drive: 0.1, lfoRate: 0.2, lfoDepth: 0.55, out: -2 } },
    { name: 'Dub Squelch', values: { mode: 'lp', cutoff: 420, q: 14, slope: '24', drive: 0.5, follow: 0.6, lfoDepth: 0.1, lfoRate: 0.6, out: -3 } },
    { name: 'Rumble Cut', values: { mode: 'hp', cutoff: 90, q: 0.7, slope: '24', drive: 0, out: 0 } },
    { name: 'Vowel Notch', values: { mode: 'notch', cutoff: 2400, q: 3, slope: '12', lfoRate: 3.5, lfoDepth: 0.3, out: 0 } }
  ];

  /* ---------- shared plumbing ---------- */
  function wire(root, P) {
    root.querySelectorAll('[data-p]').forEach(el => {
      const o = {}; if (el.dataset.abs) { o.abs = true; o.axis = el.dataset.abs; } if (el.dataset.ax) o.axis = el.dataset.ax; if (el.dataset.rng) o.range = +el.dataset.rng; if (el.dataset.inv) o.invert = true;
      P.bind(el, el.dataset.p, o);
    });
    root.querySelectorAll('[data-t]').forEach(el => P.text(el, el.dataset.t));
    root.querySelectorAll('[data-byp]').forEach(el => P.bind(el, '__bypass'));
    root.querySelectorAll('[data-sel]').forEach(el => {
      const id = el.dataset.sel, i = +el.dataset.i; el.tabIndex = 0; el.setAttribute('role', 'radio');
      el.addEventListener('click', () => P.set(id, i));
      el.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); P.set(id, i); } });
      P.sub(id, v => { el.classList.toggle('on', v === i); el.setAttribute('aria-checked', v === i); });
    });
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
  function live(P, nIn) {
    const L = { cut: P.get('cutoff'), inDb: -90, outDb: -90, inHold: -90, outHold: -90, si: new Float32Array(nIn).fill(-100), so: new Float32Array(nIn).fill(-100), resp: new Float32Array(N), dt: 0.016, t: 0, last: 0, m: {} };
    L.update = t => {
      const dt = clamp((t - L.last) / 1000 || 0.016, 0.001, 0.1); L.last = t; L.dt = dt; L.t += dt;
      const m = P.meter() || {}; L.m = m;
      L.cut = m.cutoffNow > 0 ? m.cutoffNow : P.get('cutoff');
      const i = clamp(dbOf(m.inPeak || 0), -90, 6), o = clamp(dbOf(m.outPeak || 0), -90, 6);
      L.inDb = Math.max(i, L.inDb - 40 * dt); L.outDb = Math.max(o, L.outDb - 40 * dt);
      L.inHold = Math.max(i, L.inHold - 12 * dt); L.outHold = Math.max(o, L.outHold - 12 * dt);
      const fi = P.freqData('in', nIn, 20, 20000), fo = P.freqData('out', nIn, 20, 20000);
      for (let k = 0; k < nIn; k++) { const a = fi ? fi[k] : -100, b = fo ? fo[k] : -100; L.si[k] = Math.max(a, L.si[k] - 55 * dt); L.so[k] = Math.max(b, L.so[k] - 55 * dt); }
      const r = P.response(FREQS); if (r) L.resp.set(r); else L.resp.fill(0);
    };
    return L;
  }
  const MODE_ICON = {
    lp: 'M1 4 H11 C15 4 16 10 21 12', hp: 'M1 12 C6 10 7 4 11 4 H21', bp: 'M1 12 C6 12 7 3 11 3 C15 3 16 12 21 12',
    notch: 'M1 4 H7 C9 4 9.5 12 11 12 C12.5 12 13 4 15 4 H21', peak: 'M1 9 H6 C9 9 9 2 11 2 C13 2 13 9 16 9 H21'
  };
  const MODES = ['lp', 'hp', 'bp', 'notch', 'peak'], MODE_NAME = ['Low-pass', 'High-pass', 'Band-pass', 'Notch', 'Peak'];
  const icon = (m, w, h, sw) => `<svg viewBox="0 0 22 14" width="${w || 22}" height="${h || 14}" fill="none" stroke="currentColor" stroke-width="${sw || 1.8}" stroke-linecap="round" stroke-linejoin="round"><path d="${MODE_ICON[m]}"/></svg>`;
  const maskSvg = (w, fill, ink) => `<svg viewBox="0 0 20 24" width="${w}" height="${w * 1.2}"><path d="M10 1 C16 1 19 5 19 11 C19 18 15 23 10 23 C5 23 1 18 1 11 C1 5 4 1 10 1Z" fill="${fill}"/><path d="M4 9 Q6.5 7 8.5 10 Q6.5 12 4 9Z M15.5 9 Q13.5 7 11.5 10 Q13.5 12 16 9Z" fill="${ink}"/><path d="M6.5 16 Q10 19.5 13.5 16" stroke="${ink}" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`;
  const pxy = (cv, e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };

  /* =====================================================================
     FACE A  COINJOIN — six streams merge into a single trunk; mixing-board faders
     ===================================================================== */
  function buildCoinjoin(root, P) {
    const INK = '#12303b', COL = ['#ff5a5f', '#ff9f1c', '#f2c70f', '#2ec4b6', '#3a86ff', '#a66cff'];
    const BANDS = ['SUB', 'LOW', 'MID', 'UPPER', 'PRES', 'AIR'];
    const strip = (id, lab, sub, ci, extra) => `<div class="st"><label>${lab}</label><div class="fd" data-p="${id}" data-abs="y" style="--c:${COL[ci]}">${extra || ''}<i class="tk"></i><i class="cap"></i></div><b data-t="${id}"></b><em>${sub}</em></div>`;
    root.innerHTML = `<style>
 .a{position:absolute;inset:0;background:#e9f0ea;color:${INK};font-family:'Nunito','Varela Round','Trebuchet MS',${SANS};overflow:hidden}
 .a:before{content:"";position:absolute;inset:0;background:radial-gradient(#12303b14 1.2px,transparent 1.4px) 0 0/16px 16px;pointer-events:none}
 .a>*{position:absolute}
 .hd{left:16px;top:10px;width:928px;height:58px}
 .hd>*{position:absolute}
 .wm{left:0;top:2px;display:flex;align-items:center;gap:10px}
 .wm b{font:800 34px/1 'Nunito','Varela Round',${SANS};letter-spacing:-.02em}
 .wm small{display:block;font:700 9.5px/1.3 ${SANS};letter-spacing:.2em;text-transform:uppercase;color:#4d6a73;margin-top:2px}
 .metro{left:262px;top:0;width:430px;height:58px}
 .metro .ln{position:absolute;left:34px;right:34px;top:15px;height:6px;border-radius:3px;background:linear-gradient(90deg,${COL.join(',')})}
 .metro .stp{position:absolute;top:8px;width:20px;height:20px;margin-left:-10px;border-radius:50%;background:#fff;border:3.5px solid ${INK};cursor:pointer;transition:transform .15s}
 .metro .stp:hover{transform:scale(1.2)}
 .metro .stp.on{background:${INK};box-shadow:0 0 0 4px #fff,0 0 0 6px ${INK}}
 .metro .pn{position:absolute;left:34px;right:34px;top:34px;text-align:center;font:800 15px/1 'Nunito',${SANS};white-space:nowrap}
 .metro .pn i{font:700 10px ${MONO};font-style:normal;color:#4d6a73;margin-right:8px;letter-spacing:.05em}
 .ar{position:absolute;top:6px;width:24px;height:24px;border-radius:50%;border:2.5px solid ${INK};background:#fff;cursor:pointer;display:grid;place-items:center;font:800 14px/1 ${SANS};padding:0;color:${INK}}
 .ar:hover{background:${INK};color:#fff}
 .valve{all:unset;position:absolute;right:0;top:4px;cursor:pointer;display:flex;align-items:center;gap:10px;padding:7px 16px 7px 8px;border-radius:30px;background:#fff;border:3px solid ${INK};font:800 11px/1.15 ${SANS};letter-spacing:.14em;text-transform:uppercase}
 .valve i{width:30px;height:30px;border-radius:50%;background:#cbd8d0;border:3px solid ${INK};position:relative;transition:transform .35s,background .2s}
 .valve i:before,.valve i:after{content:"";position:absolute;left:50%;top:50%;width:18px;height:3.5px;margin:-1.75px 0 0 -9px;background:${INK};border-radius:2px}
 .valve i:after{transform:rotate(90deg)}
 .valve.on i{background:#2ec4b6;transform:rotate(90deg)}
 .valve span:after{content:"CLOSED"}.valve.on span:after{content:"FLOWING"}
 .pipes{left:16px;top:76px;width:236px;height:250px;background:#fbfdfb;border:3px solid ${INK};border-radius:16px;overflow:hidden;box-sizing:border-box}
 .pipes canvas,.disp canvas{display:block;width:100%;height:100%}
 .pipes h5,.disp h5{position:absolute;margin:0;font:800 9px/1 ${SANS};letter-spacing:.2em;text-transform:uppercase;color:#4d6a73;z-index:1}
 .disp{left:264px;top:76px;width:680px;height:250px;background:#fbfdfb;border:3px solid ${INK};border-radius:16px;overflow:hidden;box-sizing:border-box}
 .disp canvas{cursor:crosshair;touch-action:none}
 .bd{left:16px;top:338px;width:928px;height:208px;background:#fbfdfb;border:3px solid ${INK};border-radius:16px;box-sizing:border-box}
 .bd>*{position:absolute}
 .md{left:14px;top:10px;width:128px}
 .md h6,.mt h6{margin:0 0 6px;font:800 9px/1 ${SANS};letter-spacing:.2em;text-transform:uppercase;color:#4d6a73}
 .mb{display:flex;align-items:center;gap:8px;width:100%;height:24px;margin:0 0 3px;border:2.5px solid ${INK};border-radius:12px;background:#fff;cursor:pointer;font:800 11px/1 ${SANS};letter-spacing:.06em;padding:0 8px;color:${INK};box-sizing:border-box;outline:none}
 .mb:hover{background:#e3efe8}
 .mb.on{background:${INK};color:#fff}
 .mb.on svg{color:#ffd23f}
 .sl{display:flex;gap:4px;margin-top:6px}.sl .mb{justify-content:center;width:auto;flex:1;margin:0}
 .sg{left:154px;top:10px;width:610px;height:188px}
 .st{position:absolute;top:0;width:84px;text-align:center}
 .st label{display:block;font:800 10px/1 ${SANS};letter-spacing:.14em;text-transform:uppercase;height:12px}
 .fd{position:relative;height:118px;width:34px;margin:8px auto 8px;cursor:ns-resize;touch-action:none;outline:none}
 .fd:before{content:"";position:absolute;left:50%;top:0;bottom:0;width:8px;margin-left:-4px;border-radius:5px;background:#dfe8e2;border:2px solid ${INK};box-sizing:border-box}
 .fd:after{content:"";position:absolute;left:50%;bottom:0;width:8px;margin-left:-4px;border-radius:5px;background:var(--c);height:calc(var(--v)*100%);border:2px solid ${INK};border-top:0;box-sizing:border-box;opacity:.9}
 .fd .tk{position:absolute;left:0;right:0;top:0;bottom:0;background:repeating-linear-gradient(180deg,${INK}55 0 1.5px,transparent 1.5px calc(100%/10));z-index:0;-webkit-mask:linear-gradient(90deg,#000 0 22%,transparent 22% 78%,#000 78%);mask:linear-gradient(90deg,#000 0 22%,transparent 22% 78%,#000 78%)}
 .fd .cap{position:absolute;left:0;width:34px;height:20px;top:calc((1 - var(--v))*(100% - 20px));border-radius:7px;background:#fff;border:2.5px solid ${INK};box-sizing:border-box;z-index:2;box-shadow:0 2px 0 ${INK}}
 .fd .cap:after{content:"";position:absolute;left:5px;right:5px;top:6.5px;height:3.5px;background:var(--c);border-radius:2px}
 .fd.drag .cap{background:#ffd23f}
 .fd .gh{position:absolute;left:-2px;width:38px;height:0;border-top:3px dashed ${COL[0]};top:calc(var(--g,0)*100%);z-index:3;pointer-events:none}
 .fd .gh:after{content:"";position:absolute;right:-8px;top:-7px;border:5px solid transparent;border-left-color:${COL[0]};border-right:0}
 .st b{display:block;font:800 13px/1 ${MONO};letter-spacing:-.02em;white-space:nowrap}
 .st em{display:block;font:700 9px/1.2 ${SANS};font-style:normal;color:#4d6a73;margin-top:4px;white-space:nowrap;letter-spacing:.04em}
 .mt{left:784px;top:10px;width:128px;height:188px}
 .mt .cols{display:flex;gap:10px;justify-content:center}
 .mt .col{width:26px;text-align:center;font:800 8.5px/1 ${SANS};letter-spacing:.14em}
 .mt .bar{position:relative;width:20px;height:116px;margin:0 auto 6px;border-radius:10px;border:2.5px solid ${INK};background:#dfe8e2;overflow:hidden;box-sizing:border-box}
 .mt .bar i{position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(0deg,#2ec4b6 0,#2ec4b6 55%,#f2c70f 75%,#ff5a5f 100%);background-size:100% 114px;background-position:bottom}
 .mt .bar u{position:absolute;left:0;right:0;height:3px;background:${INK};bottom:0}
 .mt .col b{display:block;font:800 10px/1 ${MONO};letter-spacing:-.04em;margin-top:2px;white-space:nowrap;margin-left:-8px;margin-right:-8px}
 </style>
 <div class="a">
  <div class="hd">
   <div class="wm"><svg viewBox="0 0 54 38" width="54" height="38" fill="none" stroke-width="4" stroke-linecap="round">${COL.map((c, i) => `<path d="M2 ${4 + i * 6} C20 ${4 + i * 6} 22 19 34 19 H52" stroke="${c}"/>`).join('')}</svg><div><b>coinjoin</b><small>six streams in &middot; one out</small></div></div>
   <div class="metro"><button class="ar" style="left:0" data-prev aria-label="previous preset">&lsaquo;</button><button class="ar" style="right:0" data-next aria-label="next preset">&rsaquo;</button><div class="ln"></div>
    ${P.presets.map((p, i) => `<div class="stp" data-pl="${i}" style="left:${34 + (430 - 68) * i / (P.presets.length - 1)}px" title="${p.name}"></div>`).join('')}
    <div class="pn"><i data-pidx></i><span data-pname></span></div></div>
   <button class="valve" data-byp><i></i><span></span></button>
  </div>
  <div class="pipes"><h5 style="left:12px;top:10px">inputs</h5><h5 style="right:12px;top:10px">1 trunk</h5><canvas id="pc" width="460" height="488"></canvas></div>
  <div class="disp"><h5 style="left:48px;top:10px">the merge &middot; exact response + what comes out</h5><canvas id="dc" width="1348" height="488"></canvas></div>
  <div class="bd">
   <div class="md"><h6>route</h6>${MODES.map((m, i) => `<button class="mb" data-sel="mode" data-i="${i}">${icon(m, 24, 14)}${MODE_NAME[i].toUpperCase().replace('-', '')}</button>`).join('')}
    <div class="sl"><button class="mb" data-sel="slope" data-i="0">12</button><button class="mb" data-sel="slope" data-i="1">24</button></div></div>
   <div class="sg">
    <div class="st" style="left:0">${strip('cutoff', 'Cutoff', '<span id="live">live</span>', 0, '<i class="gh" id="gh"></i>').replace('<label>Cutoff', '<label>Cutoff')}</div>
    <div class="st" style="left:86px">${strip('q', 'Reso', 'pressure', 1)}</div>
    <div class="st" style="left:172px">${strip('drive', 'Drive', 'heat in', 2)}</div>
    <div class="st" style="left:258px">${strip('follow', 'Follow', '&minus; shut &middot; open +', 3)}</div>
    <div class="st" style="left:344px">${strip('lfoRate', 'LFO rate', 'cycles', 4)}</div>
    <div class="st" style="left:430px">${strip('lfoDepth', 'LFO depth', 'octaves &plusmn;2', 5)}</div>
    <div class="st" style="left:516px">${strip('out', 'Out', 'trunk gain', 0)}</div>
   </div>
   <div class="mt"><h6 style="text-align:center">in &nbsp;&rarr;&nbsp; out</h6><div class="cols"><div class="col"><div class="bar"><i id="mi"></i><u id="mih"></u></div>IN<b id="ti"></b></div><div class="col"><div class="bar"><i id="mo"></i><u id="moh"></u></div>OUT<b id="to"></b></div></div></div>
  </div>
 </div>`;
    const $ = s => root.querySelector(s);
    wire(root, P);
    // fix the cutoff strip's live tag (strip 'sub' holds a span we fill)
    const livetag = $('#live');
    P.sub('__bypass', on => { $('.valve').classList.toggle('on', !!on); });
    const L = live(P, 96), pc = $('#pc'), dc = $('#dc'), ghEl = $('#gh');
    const lvl = d => clamp((d + 78) / 62, 0, 1);

    function drawPipes(c) {
      c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 230, 244);
      const W = 230, H = 244, mx = W * 0.58, ty = H / 2 + 6, t = L.t * 1000;
      const bi = P.freqData('in', 6, 40, 16000), bo = P.freqData('out', 6, 40, 16000);
      c.lineCap = 'round'; c.lineJoin = 'round';
      const ys = []; for (let i = 0; i < 6; i++) ys.push(46 + i * (H - 76) / 5);
      const path = i => { c.beginPath(); c.moveTo(14, ys[i]); c.lineTo(34, ys[i]); c.bezierCurveTo(mx * 0.62, ys[i], mx * 0.55, ty, mx, ty); };
      for (let i = 0; i < 6; i++) { path(i); c.strokeStyle = '#dfe8e2'; c.lineWidth = 13; c.stroke(); path(i); c.strokeStyle = INK; c.lineWidth = 15.5; c.globalCompositeOperation = 'destination-over'; c.stroke(); c.globalCompositeOperation = 'source-over'; }
      c.beginPath(); c.moveTo(mx - 2, ty); c.lineTo(W - 6, ty); c.strokeStyle = INK; c.lineWidth = 25; c.stroke(); c.strokeStyle = '#dfe8e2'; c.lineWidth = 20; c.stroke();
      for (let i = 0; i < 6; i++) {
        const lev = lvl(L.si[0] > -200 && bi ? bi[i] : -100); L.bl = L.bl || []; L.bl[i] = lerp(L.bl[i] || 0, lev, 0.25);
        const lo = lvl(bo ? bo[i] : -100); L.bo = L.bo || []; L.bo[i] = lerp(L.bo[i] || 0, lo, 0.25);
        path(i); c.strokeStyle = COL[i]; c.lineWidth = 1.5 + L.bl[i] * 8; c.setLineDash([8, 9]); c.lineDashOffset = -t * (0.012 + L.bl[i] * 0.03); c.stroke();
        c.beginPath(); const yy = ty + (i - 2.5) * 3.1; c.moveTo(mx, yy); c.lineTo(W - 8, yy); c.lineWidth = 0.8 + L.bo[i] * 3.4; c.setLineDash([6, 24]); c.lineDashOffset = -t * (0.02 + L.bo[i] * 0.03) + i * 5; c.stroke();
      }
      c.setLineDash([]);
      for (let i = 0; i < 6; i++) { c.fillStyle = COL[i]; c.beginPath(); c.arc(14, ys[i], 6.5, 0, 7); c.fill(); c.lineWidth = 2.5; c.strokeStyle = INK; c.stroke(); c.fillStyle = INK; c.font = '800 8px ' + SANS; c.textAlign = 'left'; c.textBaseline = 'middle'; if (i % 1 === 0) c.fillText(BANDS[i], 24, ys[i] - 11); }
      // junction node
      c.fillStyle = '#fff'; c.beginPath(); c.arc(mx, ty, 9, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke(); c.fillStyle = INK; c.beginPath(); c.arc(mx, ty, 3.2, 0, 7); c.fill();
      c.fillStyle = INK; c.beginPath(); c.moveTo(W - 5, ty - 10); c.lineTo(W + 3, ty); c.lineTo(W - 5, ty + 10); c.fill();
      c.fillStyle = '#4d6a73'; c.font = '800 8px ' + SANS; c.textAlign = 'center'; c.fillText('JOIN', mx, ty + 24);
    }
    const D = { ML: 42, MR: 14, MT: 14, MB: 24, W: 674, H: 244 };
    const dpw = D.W - D.ML - D.MR, dph = D.H - D.MT - D.MB;
    const DX = f => D.ML + dpw * xOf(f), DY = d => D.MT + dph * (24 - clamp(d, -48, 24)) / 72;
    function drawDisp(c) {
      c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, D.W, D.H);
      c.lineJoin = 'round'; c.lineCap = 'round';
      c.font = '700 8.5px ' + SANS; c.textBaseline = 'middle';
      [24, 12, 0, -12, -24, -36, -48].forEach(d => { const y = DY(d); c.strokeStyle = d === 0 ? INK + '66' : INK + '1c'; c.lineWidth = d === 0 ? 1.3 : 1; c.setLineDash(d === 0 ? [4, 4] : []); c.beginPath(); c.moveTo(D.ML, y); c.lineTo(D.ML + dpw, y); c.stroke(); c.setLineDash([]); c.fillStyle = '#4d6a73'; c.textAlign = 'right'; c.fillText(sgn(d, 0), D.ML - 6, y); });
      [30, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000].forEach(f => { const x = DX(f), big = f === 100 || f === 1000 || f === 10000; c.strokeStyle = INK + (big ? '30' : '14'); c.lineWidth = 1; c.beginPath(); c.moveTo(x, D.MT); c.lineTo(x, D.MT + dph); c.stroke(); if (big || f === 20000 || f === 30) { c.fillStyle = '#4d6a73'; c.textAlign = 'center'; c.fillText(f >= 1000 ? f / 1000 + 'k' : f, x, D.H - 11); } });
      const base = P.get('cutoff'), dep = P.get('lfoDepth');
      if (dep > 0.004) { const x1 = DX(base * Math.pow(2, -2 * dep)), x2 = DX(base * Math.pow(2, 2 * dep)); c.fillStyle = 'rgba(255,159,28,.16)'; c.fillRect(x1, D.MT, x2 - x1, dph); c.strokeStyle = '#ff9f1c'; c.lineWidth = 1.2; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x1, D.MT); c.lineTo(x1, D.MT + dph); c.moveTo(x2, D.MT); c.lineTo(x2, D.MT + dph); c.stroke(); c.setLineDash([]); }
      // spectra
      const n = L.si.length, area = (arr, fill, stroke) => {
        c.beginPath(); c.moveTo(D.ML, D.MT + dph);
        for (let k = 0; k < n; k++) { const x = D.ML + dpw * (k + 0.5) / n, y = D.MT + dph * (1 - clamp((arr[k] + 92) / 92, 0, 1) * 0.86); c.lineTo(x, y); }
        c.lineTo(D.ML + dpw, D.MT + dph); c.closePath(); c.fillStyle = fill; c.fill();
        if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.5; c.beginPath(); for (let k = 0; k < n; k++) { const x = D.ML + dpw * (k + 0.5) / n, y = D.MT + dph * (1 - clamp((arr[k] + 92) / 92, 0, 1) * 0.86); k ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
      };
      area(L.si, 'rgba(18,48,59,.10)', 'rgba(18,48,59,.28)');
      const g = c.createLinearGradient(D.ML, 0, D.ML + dpw, 0); COL.forEach((col, i) => g.addColorStop(i / 5, col + 'aa'));
      area(L.so, g, null);
      // response curve
      const R = L.resp; c.beginPath();
      for (let i = 0; i < N; i++) { const x = DX(FREQS[i]), y = DY(R[i]); i ? c.lineTo(x, y) : c.moveTo(x, y); }
      c.strokeStyle = '#fbfdfb'; c.lineWidth = 7; c.stroke();
      c.strokeStyle = INK; c.lineWidth = 3.4; c.stroke();
      // live cutoff
      const cx = DX(L.cut), cy = DY(respAt(R, L.cut));
      c.strokeStyle = COL[0]; c.lineWidth = 1.8; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(cx, D.MT); c.lineTo(cx, D.MT + dph); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#fff'; c.beginPath(); c.arc(cx, cy, 7, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke(); c.fillStyle = COL[0]; c.beginPath(); c.arc(cx, cy, 2.8, 0, 7); c.fill();
      const tag = hz(L.cut), tw = 56, tx = clamp(cx - tw / 2, D.ML + 2, D.ML + dpw - tw - 2), ty = D.MT + 2;
      c.fillStyle = INK; c.beginPath(); c.roundRect ? c.roundRect(tx, ty, tw, 17, 8) : c.rect(tx, ty, tw, 17); c.fill(); c.fillStyle = '#fff'; c.font = '800 10px ' + MONO; c.textAlign = 'center'; c.fillText(tag, tx + tw / 2, ty + 9);
    }
    // canvas drag: x = cutoff, y = resonance
    { let down = false; const mv = e => { const [x, y] = pxy(dc, e); const px = x * D.W; P.set('cutoff', fOf((px - D.ML) / dpw)); P.setNorm('q', 1 - clamp((y * D.H - D.MT) / dph, 0, 1)); };
      dc.addEventListener('pointerdown', e => { down = true; dc.setPointerCapture(e.pointerId); mv(e); e.preventDefault(); }); dc.addEventListener('pointermove', e => { if (down) mv(e); }); dc.addEventListener('pointerup', () => { down = false; }); dc.addEventListener('pointercancel', () => { down = false; }); }
    const mi = $('#mi'), mo = $('#mo'), mih = $('#mih'), moh = $('#moh'), ti = $('#ti'), to = $('#to');
    const pcx = pc.getContext('2d'), dcx = dc.getContext('2d');
    P.raf(t => {
      L.update(t); drawPipes(pcx); drawDisp(dcx);
      const f = d => clamp((d + 60) / 66, 0, 1) * 100 + '%';
      mi.style.height = f(L.inDb); mo.style.height = f(L.outDb); mih.style.bottom = f(L.inHold); moh.style.bottom = f(L.outHold);
      setT(ti, L.inHold < -80 ? '-inf' : L.inHold.toFixed(1)); setT(to, L.outHold < -80 ? '-inf' : L.outHold.toFixed(1));
      ghEl.style.setProperty('--g', 1 - xOf(L.cut));
      setT(livetag, 'now ' + hz(L.cut));
    });
  }

  /* =====================================================================
     FACE B  SYBIL — a crowd of identical masks falls through a sieve (the response curve)
     ===================================================================== */
  

  /* =====================================================================
     FACE C  BLOCKLIST — brutalist deny-list: every band listed, allowed / restricted / struck out
     ===================================================================== */
  

  Kit.register('filter', {
    fonts: 'family=Nunito:wght@600;800&family=Fraunces:ital,wght@1,600&family=Archivo+Narrow:wght@500;600;700&family=Space+Mono:wght@400;700&family=Archivo+Black',
    w: 960, h: 560,
    labels: { q: 'Resonance', lfoRate: 'LFO rate', lfoDepth: 'LFO depth', out: 'Output' },
    fmts: {
      q: v => v.toFixed(1), follow: v => (v > 0 ? '+' : '') + v.toFixed(2), lfoRate: v => (v < 1 ? v.toFixed(2) : v.toFixed(1)) + ' Hz',
      lfoDepth: v => (v * 2).toFixed(2) + ' oct', drive: v => Math.round(v * 100) + '%', out: v => (v > 0 ? '+' : '') + v.toFixed(1) + ' dB',
      slope: (i, v) => v + ' dB/oct'
    },
    presets,
    faces: [
      { key: 'A', name: 'Coinjoin', accent: '#2ec4b6', w: 960, h: 560, build: buildCoinjoin },
      undefined,
      undefined
    ].filter(Boolean)
  });
})();
