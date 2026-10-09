import { Kit } from "./runtime.js";
/* tilt — Tilt / Shelf tone EQ. Faces: A Bullbear / B Hal / C Rugpull.
 * Real params come from PLUGIN_TYPES.tilt (kit derives them). Selects are face-native indices; presets use option VALUES (strings). */
(function () {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const FMIN = 20, FMAX = 20000, LR = Math.log(FMAX / FMIN);
  const mkFreqs = n => { const a = new Float32Array(n); for (let i = 0; i < n; i++) a[i] = FMIN * Math.pow(FMAX / FMIN, i / (n - 1)); return a; };
  const fxp = (f, W) => Math.log(f / FMIN) / LR * W;                    // log freq -> x
  const hidpi = (cv, w, h) => { cv.width = w * 2; cv.height = h * 2; cv.style.width = w + 'px'; cv.style.height = h + 'px'; return cv.getContext('2d'); };
  const sgn = (v, d) => (v > 0.04 ? '+' : v < -0.04 ? '-' : '') + Math.abs(v).toFixed(d == null ? 1 : d);
  const fHz = f => (f >= 1000 ? (f / 1000).toFixed(f >= 10000 || f % 1000 === 0 ? 0 : 1) + ' kHz' : Math.round(f) + ' Hz');

  const presets = [
    { name: 'Flat', values: {} },
    { name: 'Bright Mix', values: { tilt: 3, pivot: 900, bandwidth: 0.6, out: -1 } },
    { name: 'Warm Tape', values: { tilt: -3.5, pivot: 700, highAtten: 2, attFreq: '10000', bandwidth: 0.7, out: 0.5 } },
    { name: 'Kick Thump', values: { lowBoost: 6, lowAtten: 3, lowFreq: '60', bandwidth: 0.35 } },
    { name: 'Air Lift', values: { tilt: 1.5, pivot: 1500, highBoost: 5, highFreq: '12000', bandwidth: 0.5 } },
    { name: 'Bus Silk', values: { tilt: -1.5, pivot: 1200, lowBoost: 2, lowFreq: '100', highBoost: 2, highFreq: '10000', highAtten: 1.5, attFreq: '5000', bandwidth: 0.8 } },
    { name: 'Lo-Fi Radio', values: { tilt: -6, pivot: 2000, lowAtten: 5, lowFreq: '100', highBoost: 4, highFreq: '3000', highAtten: 6, attFreq: '5000', bandwidth: 0.25, out: -1 } }
  ];

  /* ---------- shared wiring ---------- */
  const wire = (root, P) => {
    root.querySelectorAll('[data-p]').forEach(el => {
      const o = {}; if (el.dataset.abs) { o.abs = true; o.axis = el.dataset.abs; } if (el.dataset.ax) o.axis = el.dataset.ax;
      if (el.dataset.rng) o.range = +el.dataset.rng; if (el.dataset.inv) o.invert = true; P.bind(el, el.dataset.p, o);
    });
    root.querySelectorAll('[data-t]').forEach(el => P.text(el, el.dataset.t));
    const byId = {};
    root.querySelectorAll('[data-sel]').forEach(b => { (byId[b.dataset.sel] = byId[b.dataset.sel] || []).push(b); b.addEventListener('click', () => P.set(b.dataset.sel, +b.dataset.i)); });
    Object.keys(byId).forEach(id => P.sub(id, v => byId[id].forEach(b => b.classList.toggle('on', +b.dataset.i === v))));
    const n = P.presets.length; let idx = -1;
    P.onPreset((i, nm) => {
      idx = i;
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = nm || '-'; });
      root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = String(Math.max(i, 0) + 1).padStart(2, '0') + '/' + String(n).padStart(2, '0'); });
      root.querySelectorAll('[data-pip]').forEach(e => e.classList.toggle('on', +e.dataset.pip === i));
      root.querySelectorAll('[data-pcap]').forEach(e => { e.dataset.pi = i; e.style.setProperty('--pi', String(Math.max(i, 0))); });
    });
    root.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx - 1 + n) % n)));
    root.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx + 1) % n)));
    root.querySelectorAll('[data-pip]').forEach(b => b.addEventListener('click', () => P.loadPreset(+b.dataset.pip)));
    root.querySelectorAll('[data-byp]').forEach(b => P.bind(b, '__bypass'));
    P.sub('__bypass', on => root.querySelectorAll('[data-bypt]').forEach(e => { e.textContent = on ? e.dataset.on : e.dataset.off; }));
    if (idx < 0 && n) P.loadPreset(0);
  };
  const levels = P => {
    const s = { i: 0, o: 0, ih: 0, oh: 0 };
    const f = x => clamp((P.toDb(x) + 60) / 63, 0, 1);
    return () => {
      const m = P.meter(); const i = f(m.inPeak), o = f(m.outPeak);
      s.i = Math.max(i, s.i - 0.03); s.o = Math.max(o, s.o - 0.03); s.ih = Math.max(i, s.ih - 0.006); s.oh = Math.max(o, s.oh - 0.006);
      s.iDb = P.toDb(m.inPeak); s.oDb = P.toDb(m.outPeak); return s;
    };
  };
  const pips = P => P.presets.map((p, i) => `<i data-pip="${i}" title="${p.name}"></i>`).join('');

  /* =====================================================================
     FACE A  - BULLBEAR   (trading desk, see-saw lever)
     ===================================================================== */
  

  /* =====================================================================
     FACE B  - HAL   (hand-built brushed-metal box, stepped rotary switches, phosphor screen)
     ===================================================================== */
  

  /* =====================================================================
     FACE C  - RUGPULL   (a rug on strings: playful tilting plane, pull-cord controls)
     ===================================================================== */
  function buildC(root, P) {
    const knob = (id, lab, s) => `<div class="sp" data-p="${id}" style="--s:${s}px"></div><div class="cv" data-t="${id}"></div><div class="cl">${lab}</div>`;
    const cord = (id, lab, inv) => `<div class="ct ${inv ? 'dwn' : 'upw'}" data-p="${id}" data-abs="y"${inv ? ' data-inv="1"' : ''}><i class="rp"></i><b class="ts"></b></div><div class="cv" data-t="${id}"></div><div class="cl">${lab}</div>`;
    const tacks = (id, vals) => `<div class="tks">${vals.map((l, i) => `<button class="tk" data-sel="${id}" data-i="${i}">${l}</button>`).join('')}</div>`;
    const sw = [
      'repeating-linear-gradient(45deg,#a02c3a 0 5px,#e0a82e 5px 8px)', 'linear-gradient(90deg,#1f7a78 0 50%,#f0e0be 50%)', 'repeating-linear-gradient(90deg,#3a2130 0 4px,#d9683f 4px 8px)',
      'radial-gradient(circle,#e0a82e 0 4px,#1f7a78 4px)', 'repeating-linear-gradient(0deg,#f0e0be 0 4px,#a02c3a 4px 8px)', 'linear-gradient(135deg,#3a2130 25%,#e0a82e 25% 50%,#3a2130 50% 75%,#e0a82e 75%)', 'repeating-linear-gradient(-45deg,#1f7a78 0 5px,#f0e0be 5px 7px,#a02c3a 7px 12px)'];
    root.innerHTML = `<style>
 .c{position:absolute;inset:0;color:#3a2130;font-family:'Fredoka','Trebuchet MS','Segoe UI',Arial,sans-serif;font-size:12px;background:radial-gradient(circle at 20% 10%,#f9eed7,#f0dfbd 70%);--rg:#a02c3a;--mu:#e0a82e;--te:#1f7a78;--ink:#3a2130}
 .c:before{content:"";position:absolute;inset:0;background:radial-gradient(circle,#3a213011 1.2px,transparent 1.6px) 0 0/16px 16px;pointer-events:none}
 .c>*{position:absolute}
 .stitch{border:2px dashed #3a213066;border-radius:10px}
 header{left:16px;top:10px;width:848px;height:48px}
 .patch{position:absolute;left:0;top:0;width:200px;height:46px;background:var(--rg);border-radius:9px;box-shadow:0 0 0 3px var(--rg),0 0 0 5px #f9eed7,0 0 0 7px #3a2130,0 3px 0 7px #0002;transform:rotate(-1.2deg);color:#f9eed7}
 .patch:before{content:"";position:absolute;inset:4px;border:2px dashed #f9eed7aa;border-radius:6px}
 .patch b{position:absolute;left:0;right:0;top:6px;text-align:center;font:700 25px/1 'Fredoka','Trebuchet MS',Arial,sans-serif;letter-spacing:.04em}
 .patch small{position:absolute;left:0;right:0;bottom:6px;text-align:center;font-size:7.5px;letter-spacing:.22em;font-weight:600;color:#f6d99a}
 .swb{position:absolute;left:230px;top:0;width:470px;height:48px}
 .sws{position:absolute;left:0;top:0;display:flex;gap:7px;align-items:flex-end;height:30px}
 .sws i{width:46px;height:26px;border-radius:3px;cursor:pointer;border:2px solid #3a2130;box-shadow:0 2px 0 #3a213055;transition:transform .12s;position:relative}
 .sws i:hover{transform:translateY(-2px)}.sws i.on{transform:translateY(-6px) scale(1.06);box-shadow:0 6px 0 #3a213044,0 0 0 3px #e0a82e}
 .tag{position:absolute;left:0;top:32px;height:16px;line-height:16px;display:flex;gap:8px;align-items:center;font-size:11px;white-space:nowrap}
 .tag button{all:unset;cursor:pointer;color:#a02c3a;font-weight:700;padding:0 4px}
 .tag b{background:#fff7e3;border:2px solid #3a2130;border-radius:3px;padding:0 8px;min-width:112px;text-align:center;line-height:13px;display:inline-block;height:15px;font-weight:600}
 .tag span{color:#3a213099;font-size:10px}
 .pull{position:absolute;right:0;top:0;width:136px;height:46px;cursor:pointer;border-radius:23px;background:#fff7e3;border:3px solid #3a2130;box-shadow:0 3px 0 #3a213077;text-align:center;font:700 13px/40px 'Fredoka','Trebuchet MS',Arial,sans-serif;letter-spacing:.06em;color:#1f7a78;overflow:hidden}
 .pull:after{content:"";position:absolute;left:4px;top:4px;width:30px;height:30px;border-radius:50%;background:var(--te);box-shadow:inset 0 0 0 4px #fff7e3,inset 0 0 0 6px var(--te);transition:left .18s}
 .pull{padding-left:28px}.pull:not(.on){color:#a02c3a;padding:0 34px 0 0}.pull:not(.on):after{left:98px;background:var(--rg);box-shadow:inset 0 0 0 4px #fff7e3,inset 0 0 0 6px var(--rg)}
 .scene{left:20px;top:72px;width:640px;height:300px;border-radius:12px;border:3px solid #3a2130;box-shadow:0 4px 0 #3a213055;overflow:hidden;background:#f6e7c8}
 .scene canvas{position:absolute;left:0;top:0}
 .rail{position:absolute;top:2px;height:24px;cursor:ew-resize}
 .rail:after{content:"";position:absolute;left:calc(var(--v,.5)*100%);top:2px;width:22px;height:22px;margin-left:-11px;border-radius:50%;border:4px solid #3a2130;background:#e0a82e;box-shadow:0 2px 0 #0003}
 .rail:before{content:"pivot hook: slide me";position:absolute;left:8px;top:6px;font-size:9px;color:#3a213088;letter-spacing:.06em;white-space:nowrap}
 .tiltc{left:680px;top:72px;width:184px;height:300px;border-radius:12px;background:#fff7e3;border:3px solid #3a2130;box-shadow:0 4px 0 #3a213055}
 .tiltc h4{position:absolute;left:0;right:0;top:8px;margin:0;text-align:center;font:700 15px/1 'Fredoka','Trebuchet MS',Arial,sans-serif;letter-spacing:.14em;color:var(--rg)}
 .tiltc .ct{position:absolute;left:50px;top:34px;width:84px;height:198px}
 .tiltc .sc{position:absolute;font-size:9px;font-weight:600;letter-spacing:.1em;color:#3a213099}
 .tiltc .big{position:absolute;left:0;right:0;top:238px;text-align:center;font:700 24px/1 'Fredoka','Trebuchet MS',Arial,sans-serif}
 .tiltc .st{position:absolute;left:0;right:0;top:268px;text-align:center;font-size:10px;letter-spacing:.12em;color:#3a2130aa}
 .ct{position:relative;cursor:ns-resize}
 .ct:before{content:"";position:absolute;left:calc(50% - 14px);top:0;width:28px;height:7px;border-radius:3px 3px 0 0;background:#3a2130}
 .ct .rp{position:absolute;left:calc(50% - 3px);top:6px;bottom:0;width:6px;border-radius:3px;background:repeating-linear-gradient(60deg,#c28a3d 0 3px,#8a5a22 3px 6px);box-shadow:0 0 0 1px #3a213077}
 .ct .ts{position:absolute;left:calc(50% - 17px);width:34px;height:46px;margin-top:-10px;z-index:2;transition:none}
 .ct .ts:before{content:"";position:absolute;left:9px;top:0;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e86a5a,#a02c3a);border:2px solid #3a2130}
 .ct .ts:after{content:"";position:absolute;left:3px;top:14px;width:28px;height:30px;border-radius:3px 3px 12px 12px;background:repeating-linear-gradient(90deg,#e0a82e 0 3px,#b9811b 3px 5px);border:2px solid #3a2130;border-top:0;clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}
 .ct.upw .ts{top:calc((1 - var(--v,0))*(100% - 46px))}
 .ct.dwn .ts{top:calc(var(--v,0)*(100% - 46px))}
 .ct.drag .ts:before{background:radial-gradient(circle at 35% 30%,#ffd0c8,#d6402f)}
 .grp{top:384px;height:164px;border-radius:12px;background:#fff7e3;border:3px solid #3a2130;box-shadow:0 4px 0 #3a213055}
 .grp h5{position:absolute;left:12px;top:7px;margin:0;font:700 11px/1 'Fredoka','Trebuchet MS',Arial,sans-serif;letter-spacing:.16em;color:var(--te)}
 .grp h5 span{color:#3a213077;font-weight:500;letter-spacing:.08em;margin-left:6px}
 .cd{position:absolute;top:26px;width:62px;text-align:center}
 .cd .ct{width:46px;height:78px;margin:0 auto}
 .cd .ct .ts{transform:scale(.8);transform-origin:50% 0}
 .cd .ct.dwn .ts{top:calc(var(--v,0)*(100% - 40px))}
 .cv{font-size:11px;font-weight:600;color:#3a2130;margin-top:3px;white-space:nowrap}
 .cd .cv{margin-top:4px}
 .cl{font-size:9px;letter-spacing:.1em;color:#3a213099;font-weight:600;text-transform:uppercase;white-space:nowrap}
 .tks{display:flex;flex-wrap:wrap;gap:5px;width:172px}
 .tk{all:unset;cursor:pointer;box-sizing:border-box;width:36px;height:30px;border-radius:50%;text-align:center;line-height:26px;font-size:11px;font-weight:600;color:#3a2130;background:#f0e0be;border:2px dashed #3a2130aa;box-shadow:0 2px 0 #3a213044;transition:transform .1s}
 .tk:hover{transform:translateY(-1px)}.tk.on{background:var(--mu);border:2px solid #3a2130;box-shadow:0 3px 0 #3a2130aa;color:#3a2130}
 .tl{position:absolute;font-size:9px;letter-spacing:.12em;font-weight:700;color:#3a213099}
 .kc{position:absolute;text-align:center;width:56px}
 .sp{position:relative;width:var(--s);height:var(--s);margin:0 auto;border-radius:50%;background:repeating-radial-gradient(circle,#1f7a78 0 3px,#2e9a95 3px 6px);border:3px solid #3a2130;box-shadow:0 3px 0 #3a213077}
 .sp:before{content:"";position:absolute;inset:26%;border-radius:50%;background:#f0e0be;border:2px solid #3a2130}
 .sp:after{content:"";position:absolute;left:calc(50% - 2px);top:2px;width:4px;height:calc(50% - 2px);background:var(--mu);border:1.5px solid #3a2130;border-radius:3px;transform-origin:50% 100%;transform:rotate(calc(-135deg + var(--v)*270deg))}
 .sp.drag{filter:brightness(1.12)}
 .mb{position:absolute;height:9px;border:2px solid #3a2130;border-radius:5px;background:#f0e0be;overflow:hidden}
 .mb i{display:block;height:100%;width:0;background:repeating-linear-gradient(90deg,var(--te) 0 6px,#2e9a95 6px 8px)}
 .mb.o i{background:repeating-linear-gradient(90deg,var(--rg) 0 6px,#c24a58 6px 8px)}
 </style><div class="c">
 <header><div class="patch"><b>Rugpull</b><small>TILT &middot; SHELF &middot; TONE &middot; HAND WOVEN</small></div>
  <div class="swb"><div class="sws">${P.presets.map((p, i) => `<i data-pip="${i}" title="${p.name}" style="background:${sw[i % sw.length]}"></i>`).join('')}</div>
   <div class="tag"><button data-prev title="previous swatch">&lt;&lt;</button><b data-pname></b><button data-next title="next swatch">&gt;&gt;</button><span>SWATCH <span data-pidx></span></span></div></div>
  <div class="pull on" data-byp title="rug laid / rug pulled"><span data-bypt data-on="RUG LAID" data-off="PULLED!"></span></div></header>
 <div class="scene"><canvas id="sc"></canvas><div class="rail" id="rail" data-p="pivot" data-abs="x" title="slide the pivot hook along the rail"></div></div>
 <div class="tiltc"><h4>THE PULL</h4><div class="ct upw" data-p="tilt" data-abs="y"><i class="rp"></i><b class="ts"></b></div>
  <div class="sc" style="left:8px;top:40px">BRIGHT</div><div class="sc" style="left:12px;top:216px">DARK</div><div class="sc" style="right:8px;top:40px">+12</div><div class="sc" style="right:8px;top:216px">-12</div>
  <div class="big" data-t="tilt"></div><div class="st" id="st"></div></div>
 <div class="grp" style="left:20px;width:250px"><h5>LOW END<span>shelves</span></h5>
  <div class="cd" style="left:12px">${cord('lowBoost', 'boost', true)}</div>
  <div class="cd" style="left:78px">${cord('lowAtten', 'atten', true)}</div>
  <div style="position:absolute;left:148px;top:40px"><div class="tl" style="left:0;top:-14px">LOW FREQ Hz</div><div class="tks" style="width:96px">${[20, 30, 60, 100].map((l, i) => `<button class="tk" data-sel="lowFreq" data-i="${i}">${l}</button>`).join('')}</div></div></div>
 <div class="grp" style="left:280px;width:380px"><h5>HIGH END<span>bell + shelf</span></h5>
  <div class="cd" style="left:12px">${cord('highBoost', 'boost', true)}</div>
  <div class="cd" style="left:78px">${cord('highAtten', 'atten', true)}</div>
  <div style="position:absolute;left:156px;top:36px"><div class="tl" style="left:0;top:-14px">BOOST BELL kHz</div>${tacks('highFreq', [3, 4, 5, 8, 10, 12, 16])}<div class="tl" style="left:0;top:78px;display:none"></div></div>
  <div style="position:absolute;left:156px;top:124px"><div class="tl" style="left:0;top:-14px">ATTEN SHELF kHz</div>${tacks('attFreq', [5, 10, 20])}</div></div>
 <div class="grp" style="left:680px;width:184px"><h5>THE FINE PRINT</h5>
  <div class="kc" style="left:6px;top:26px">${knob('pivot', 'pivot', 40)}</div>
  <div class="kc" style="left:64px;top:26px">${knob('bandwidth', 'pile', 40)}</div>
  <div class="kc" style="left:122px;top:26px">${knob('out', 'out', 40)}</div>
  <div class="tl" style="left:14px;top:107px">IN</div><div class="mb" style="left:42px;top:107px;width:128px"><i id="mi"></i></div>
  <div class="tl" style="left:14px;top:128px">OUT</div><div class="mb o" style="left:42px;top:128px;width:128px"><i id="mo"></i></div></div>
 </div>`;
    wire(root, P);
    const $ = s => root.querySelector(s);
    const W = 640, H = 300, rl = $('#rail'), PL = 50, PW = 540;
    rl.style.left = (PL + fxp(200, PW)) + 'px'; rl.style.width = (fxp(4000, PW) - fxp(200, PW)) + 'px';
    const c = hidpi($('#sc'), W, H);
    const N = 200, FR = mkFreqs(N), ZERO = new Float32Array(N);
    let eng = true, pulled = 0; P.bypass.sub(v => { eng = v; });
    P.sub('tilt', v => { $('#st').textContent = v > 0.4 ? 'rug tips bright' : v < -0.4 ? 'rug tips dark' : 'rug is level'; });
    const lv = levels(P);
    const PX = f => PL + fxp(f, PW);
    const BASE = 132, TH = 62;
    const rugColors = ['#e0a82e', '#1f7a78', '#f0e0be', '#d9683f'];
    P.raf(t => {
      c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, W, H);
      pulled += ((eng ? 0 : 1) - pulled) * 0.12;
      // wall + floor
      c.fillStyle = '#f6e7c8'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#ecd6ac'; for (let x = 0; x < W; x += 40) c.fillRect(x, 30, 20, 200);
      const fy = 236; c.fillStyle = '#c98f54'; c.fillRect(0, fy, W, H - fy);
      c.strokeStyle = '#a8713b'; c.lineWidth = 1.5; for (let x = -30; x < W + 60; x += 62) { c.beginPath(); c.moveTo(x, fy); c.lineTo(x - 18, H); c.stroke(); } c.beginPath(); c.moveTo(0, fy); c.lineTo(W, fy); c.stroke();
      c.fillStyle = '#3a2130'; c.fillRect(0, 0, W, 26); c.fillStyle = '#6b4a3d'; c.fillRect(0, 22, W, 4);
      // live dust bunnies = output spectrum
      const sp = P.freqData('out', 54, 20, 20000);
      for (let i = 0; i < 54; i++) { const k = Math.round(clamp((sp[i] + 80) / 62, 0, 1) * 6), x = PL + (i + .5) / 54 * PW; for (let j = 0; j < k; j++) { c.fillStyle = j % 2 ? '#b99568' : '#8c6a45'; c.beginPath(); c.arc(x + ((i * 7 + j * 3) % 5 - 2), fy + 9 + j * 8 - (j % 2 ? 0 : 2), 3.2 - j * .15, 0, 6.3); c.fill(); } }
      const R = (eng && P.response(FR)) || ZERO;
      const ox = -pulled * 760;      // pulled: the rug shoots off to the left
      const yT = i => BASE - Math.tanh(R[i] / 9) * 78, xI = i => PL + i / (N - 1) * PW + ox;
      const pivx = PX(P.real('pivot')), hookY = 26;
      // strings
      c.strokeStyle = '#6b4a3d'; c.lineWidth = 1.8;
      const ends = [[34, 0], [W - 34, N - 1]];
      if (pulled < 0.5) {
        ends.forEach(([hx, i]) => { c.beginPath(); c.moveTo(hx, hookY); c.lineTo(xI(i) + (i ? -4 : 4), yT(i) + 6); c.stroke(); });
        const ip = Math.round(clamp(Math.log(P.real('pivot') / FMIN) / LR, 0, 1) * (N - 1));
        c.beginPath(); c.moveTo(pivx, hookY); c.lineTo(xI(ip), yT(ip)); c.stroke();
      } else { ends.forEach(([hx]) => { c.beginPath(); c.moveTo(hx, hookY); c.lineTo(hx + (hx < 100 ? 10 : -10), 74); c.stroke(); c.fillStyle = '#a02c3a'; c.beginPath(); c.arc(hx + (hx < 100 ? 10 : -10), 78, 4, 0, 6.3); c.fill(); }); c.beginPath(); c.moveTo(pivx, hookY); c.lineTo(pivx, 70); c.stroke(); }
      // hooks
      c.fillStyle = '#e0a82e'; c.strokeStyle = '#3a2130'; c.lineWidth = 2; [34, pivx, W - 34].forEach(x => { c.beginPath(); c.arc(x, hookY, 5, 0, 6.3); c.fill(); c.stroke(); });
      // rug body (top edge = response curve, bottom = top + thickness)
      const poly = () => { c.beginPath(); for (let i = 0; i < N; i++) i ? c.lineTo(xI(i), yT(i)) : c.moveTo(xI(i), yT(i)); for (let i = N - 1; i >= 0; i--) c.lineTo(xI(i), yT(i) + TH); c.closePath(); };
      // fringe
      c.strokeStyle = '#f0e0be'; c.lineWidth = 2.2; [[0, -1], [N - 1, 1]].forEach(([i, d]) => { for (let k = 0; k < 9; k++) { const y = yT(i) + 3 + k * (TH - 6) / 8; c.beginPath(); c.moveTo(xI(i), y); c.lineTo(xI(i) + d * 15, y + (k - 4) * .9 + Math.sin(t / 400 + k) * 1.2); c.stroke(); } });
      poly(); c.fillStyle = '#a02c3a'; c.fill();
      c.save(); poly(); c.clip();
      // woven diamonds that light up with the live spectrum
      const cols = 26;
      for (let j = 0; j < cols; j++) {
        const i = Math.round((j + .5) / cols * (N - 1)), x = xI(i), y = yT(i) + TH / 2, e = clamp((sp[Math.min(53, Math.floor((j + .5) / cols * 54))] + 80) / 62, 0, 1);
        const s = 12 + e * 5; c.fillStyle = rugColors[j % 4]; c.globalAlpha = .75 + e * .25; c.beginPath(); c.moveTo(x, y - s); c.lineTo(x + s, y); c.lineTo(x, y + s); c.lineTo(x - s, y); c.closePath(); c.fill();
        c.fillStyle = '#3a2130'; c.beginPath(); c.arc(x, y, 2.5, 0, 6.3); c.fill(); c.globalAlpha = 1;
      }
      c.strokeStyle = '#f0e0be'; c.lineWidth = 2; c.setLineDash([5, 4]);
      [7, TH - 7].forEach(o => { c.beginPath(); for (let i = 0; i < N; i++) i ? c.lineTo(xI(i), yT(i) + o) : c.moveTo(xI(i), yT(i) + o); c.stroke(); }); c.setLineDash([]);
      c.restore();
      poly(); c.strokeStyle = '#3a2130'; c.lineWidth = 3; c.stroke();
      // 0 dB marker + axis
      c.strokeStyle = '#3a213055'; c.setLineDash([3, 5]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(PL, BASE); c.lineTo(PL + PW, BASE); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#3a2130'; c.font = "600 10px 'Fredoka','Trebuchet MS',Arial,sans-serif"; c.textAlign = 'center';
      [[50, '50'], [100, '100'], [500, '500'], [1000, '1k'], [5000, '5k'], [10000, '10k']].forEach(([f, l]) => c.fillText(l, PX(f), 227));
      if (pulled > 0.6) { c.font = "700 20px 'Fredoka','Trebuchet MS',Arial,sans-serif"; c.fillStyle = '#3a2130'; c.fillText('the rug has been pulled.', W / 2, 150); c.font = "600 11px 'Fredoka',Arial,sans-serif"; c.fillText('(flick it back on)', W / 2, 170); }
      const L = lv(); $('#mi').style.width = L.i * 100 + '%'; $('#mo').style.width = L.o * 100 + '%';
    });
  }

  Kit.register('tilt', {
    fonts: 'family=IBM+Plex+Mono:wght@400;600&family=Chakra+Petch:wght@600;700&family=Share+Tech+Mono&family=Special+Elite&family=VT323&family=Fredoka:wght@500;600;700',
    labels: { lowFreq: 'Low Freq', highFreq: 'High Boost Freq', attFreq: 'High Atten Freq', bandwidth: 'Bandwidth', out: 'Output' },
    presets,
    faces: [
      undefined,
      undefined,
      { key: 'C', name: 'Rugpull', accent: '#a02c3a', w: 880, h: 560, build: buildC }
    ].filter(Boolean)
  });
})();
