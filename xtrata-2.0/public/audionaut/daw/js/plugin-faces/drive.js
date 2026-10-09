import { Kit } from "./runtime.js";
/* drive.js - Tube Drive saturation. Three faces: A Hotwallet / B Burn / C Smelter
 * Transfer curves are the exact shapers from plugins.js (driveCurveFor): soft tanh(kx)/tanh(k), tube asymmetric tanh, tape arctangent. */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const dl = d => Math.pow(10, d / 20);
  const ld = x => 20 * Math.log10(Math.max(1e-6, x));
  const FR = x => clamp((ld(x) + 48) / 54, 0, 1);
  const CHN = ['soft', 'tube', 'tape'];
  const sgn = v => (v > 0.05 ? '+' : '') + v.toFixed(1);

  function curveFor(ch, a) {
    if (ch === 'tube') {
      const k = 1 + a * 8, b = 0.3 * Math.min(1, a * 2), t0 = Math.tanh(k * b);
      const norm = (Math.tanh(k * (1 + b)) - Math.tanh(k * (-1 + b))) / 2, m = Math.min(1, a * 6);
      return x => (1 - m) * x + m * ((Math.tanh(k * (x + b)) - t0) / norm);
    }
    if (ch === 'tape') {
      const k = 1 + a * 6, norm = (2 / Math.PI) * Math.atan(k * Math.PI / 2), m = Math.min(1, a * 6);
      return x => (1 - m) * x + m * (((2 / Math.PI) * Math.atan(k * x * Math.PI / 2)) / norm);
    }
    const k = 1 + a * 12, n = Math.tanh(k);
    return x => (a > 0 ? Math.tanh(x * k) / n : x);
  }
  const acache = {};
  function autoGain(ch, a, f) {
    const key = ch + a.toFixed(3); if (acache[key] != null) return acache[key];
    let si = 0, so = 0; const M = 256;
    for (let i = 0; i < M; i++) { const x = 0.5 * Math.sin(2 * Math.PI * (i + 0.5) / M); si += x * x; const y = f(x); so += y * y; }
    const g = clamp(Math.sqrt(si / Math.max(so, 1e-12)), 0.25, 4); acache[key] = g; return g;
  }
  function model(P, chOv) {
    const a = P.get('amount'), ch = chOv || P.real('character'), f = curveFor(ch, a);
    const auto = P.real('auto') === 'on', mix = P.get('mix');
    const g = dl(P.get('level')) * (auto ? autoGain(ch, a, f) : 1);
    const eff = x => { x = clamp(x, -1, 1); return mix * f(x) * g + (1 - mix) * x; };
    return { a, ch, f, g, mix, eff, auto, slope: eff(0.002) / 0.002 };
  }
  const toneHz = t => t >= 0.999 ? 20000 : 400 * Math.pow(50, t);
  const hzTxt = h => h >= 19999 ? 'open' : h >= 1000 ? (h / 1000).toFixed(1) + ' kHz' : Math.round(h) + ' Hz';
  function feed(P) {
    const s = { i: 0, o: 0, h: 0, ih: 0, oh: 0, it: 0, ot: 0 };
    return function () {
      const m = P.meter(), now = performance.now(), i = m.inPeak || 0, o = m.outPeak || 0, h = m.harm || 0;
      s.i = Math.max(i, s.i * 0.9); s.o = Math.max(o, s.o * 0.9); s.h = Math.max(h, s.h * 0.95);
      if (i >= s.ih || now - s.it > 1400) { s.ih = i; s.it = now; }
      if (o >= s.oh || now - s.ot > 1400) { s.oh = o; s.ot = now; }
      return s;
    };
  }
  function samples(P, n, step) {
    const b = P.timeData('in'); if (!b) return []; const out = [];
    for (let i = b.length - n * step; i < b.length; i += step) out.push(b[i]);
    return out;
  }
  function setup(cv, w, h) { cv.width = w * 2; cv.height = h * 2; cv.style.width = w + 'px'; cv.style.height = h + 'px'; const c = cv.getContext('2d'); c.setTransform(2, 0, 0, 2, 0, 0); return c; }

  const BASE = '*{box-sizing:border-box}[data-plist]{display:none}[data-plist].open{display:grid}button{cursor:pointer;font-family:inherit;border:0;background:none;color:inherit;padding:0}canvas{display:block}[data-b],[data-tog]{outline:none;touch-action:none}:host,div,button,span,em,small,b,i,label,canvas,svg{user-select:none;-webkit-user-select:none}';
  function wire(root, P) {
    root.querySelectorAll('[data-b]').forEach(e => {
      const d = e.dataset, o = {};
      if (d.abs) { o.abs = true; o.axis = d.abs; }
      if (d.ax) o.axis = d.ax; if (d.inv) o.invert = true; if (d.rng) o.range = +d.rng;
      P.bind(e, d.b, o);
    });
    root.querySelectorAll('[data-t]').forEach(e => P.text(e, e.dataset.t));
    root.querySelectorAll('[data-set]').forEach(e => {
      const [id, val] = e.dataset.set.split(':'); const v = +val;
      e.addEventListener('click', () => P.set(id, v));
      P.sub(id, x => e.classList.toggle('on', x === v));
    });
    root.querySelectorAll('[data-tog]').forEach(e => {
      const id = e.dataset.tog;
      e.addEventListener('click', () => P.set(id, P.get(id) ? 0 : 1));
      P.sub(id, x => { e.classList.toggle('on', !!x); e.setAttribute('aria-pressed', !!x); });
    });
    const n = P.presets.length; let cur = -1;
    const plist = root.querySelector('[data-plist]'), led = root.querySelector('[data-ledger]');
    const host = plist || led;
    if (host) P.presets.forEach((p, i) => {
      const b = document.createElement('button'); b.dataset.pi = i; b.innerHTML = '<span>' + String(i + 1).padStart(2, '0') + '</span><em>' + p.name + '</em>';
      b.addEventListener('click', () => { P.loadPreset(i); if (plist) plist.classList.remove('open'); }); host.appendChild(b);
    });
    root.querySelectorAll('[data-prev]').forEach(e => e.addEventListener('click', () => P.loadPreset((cur - 1 + n) % n)));
    root.querySelectorAll('[data-next]').forEach(e => e.addEventListener('click', () => P.loadPreset((cur + 1) % n)));
    root.querySelectorAll('[data-tgl]').forEach(e => e.addEventListener('click', () => plist && plist.classList.toggle('open')));
    P.onPreset((i, name) => {
      cur = i;
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = name || 'Custom'; });
      root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = String(Math.max(i, 0) + 1).padStart(2, '0'); });
      root.querySelectorAll('[data-pn]').forEach(e => { e.textContent = String(n).padStart(2, '0'); });
      if (host) host.querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.pi === i));
    });
    root.querySelectorAll('[data-readtone]').forEach(e => P.sub('tone', t => { e.textContent = hzTxt(toneHz(t)); }));
  }
  const curvePath = (m, W, H, YR, N) => {
    const pts = []; for (let i = 0; i <= N; i++) { const x = i / N * 2 - 1; pts.push([(x + 1) / 2 * W, H / 2 - clamp(m.eff(x) / YR, -1, 1) * H / 2 * 0.94]); } return pts;
  };
  function ladder(c, W, H, v, hold, segs, cols) {
    c.clearRect(0, 0, W, H); const gap = 2, sh = (H - gap * (segs - 1)) / segs;
    for (let i = 0; i < segs; i++) {
      const f = (i + 1) / segs, y = H - (i + 1) * sh - i * gap, on = v >= f - 0.5 / segs;
      const col = f > 0.9 ? cols[2] : f > 0.7 ? cols[1] : cols[0];
      c.globalAlpha = on ? 1 : 0.16; c.fillStyle = col; c.fillRect(0, y, W, sh);
      if (Math.abs(hold - f) < 0.5 / segs) { c.globalAlpha = 1; c.fillStyle = cols[3] || '#fff'; c.fillRect(0, y, W, sh); }
    }
    c.globalAlpha = 1;
  }

  /* shared presets: real values (selects use the option VALUE) */
  const PRESETS = [
    { name: 'Warm Keys', values: { amount: 0.18, character: 'tube', tone: 1, level: 0, auto: 'on', mix: 1, hq: 'off' } },
    { name: 'Fireside Bass', values: { amount: 0.38, character: 'tube', tone: 0.62, level: -1.5, auto: 'on', mix: 0.85, hq: 'on' } },
    { name: 'Tape Glue', values: { amount: 0.3, character: 'tape', tone: 0.82, level: 0, auto: 'on', mix: 0.7, hq: 'off' } },
    { name: 'Crunch Pedal', values: { amount: 0.62, character: 'soft', tone: 0.7, level: -3, auto: 'off', mix: 1, hq: 'off' } },
    { name: 'Parallel Heat', values: { amount: 0.9, character: 'tube', tone: 0.55, level: -4, auto: 'on', mix: 0.35, hq: 'on' } },
    { name: 'Dark Ember', values: { amount: 0.55, character: 'tape', tone: 0.3, level: 2, auto: 'off', mix: 1, hq: 'off' } },
    { name: 'Full Melt', values: { amount: 1, character: 'soft', tone: 0.45, level: -6, auto: 'on', mix: 1, hq: 'on' } },
  ];

  /* ====================================================================== A  HOTWALLET  (valve amp head) */
  const CSS_A = `
.a{position:absolute;inset:0;overflow:hidden;color:#f3e6c4;font-family:'Cormorant Garamond',Georgia,'Times New Roman',serif;background:radial-gradient(ellipse at 50% 30%,#2a2119 0,#120d0a 75%);}
.a:before{content:"";position:absolute;inset:0;background-image:radial-gradient(circle at 2px 2px,#ffffff0d 1px,transparent 1.6px);background-size:5px 5px;pointer-events:none}
.a .hd{position:absolute;left:24px;right:24px;top:14px;height:56px;display:flex;align-items:center;gap:20px;z-index:5}
.a .wm{display:flex;align-items:center;gap:12px}
.a .wm svg{width:44px;height:44px;filter:drop-shadow(0 0 8px #ff8a1f88)}
.a .wm b{display:block;font-size:38px;font-weight:700;font-style:italic;letter-spacing:-.01em;line-height:.95;color:#f0c26a;text-shadow:0 0 14px #ff8a1f66,0 1px 0 #000}
.a .wm small{display:block;font:600 10px/1.2 'Trebuchet MS',Verdana,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#a98a58;margin-top:3px}
.a .sp{flex:1}
.a .pb{position:relative;display:flex;align-items:center;height:38px;border:1.5px solid #b8893a;border-radius:20px;background:#0c0806;box-shadow:inset 0 2px 8px #000}
.a .pb .ar{width:34px;height:100%;font-size:20px;color:#f0c26a}.a .pb .ar:hover{color:#fff}
.a .pb .cur{width:210px;height:100%;display:flex;align-items:center;gap:10px;padding:0 6px;border-left:1px solid #3a2c1a;border-right:1px solid #3a2c1a}
.a .pb .cur i{font:700 11px 'Trebuchet MS',Verdana,sans-serif;font-style:normal;color:#ff9a2e;text-shadow:0 0 8px #ff8a1f}
.a .pb .cur em{flex:1;font-style:italic;font-size:19px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.a .pb .cur small{font:10px 'Trebuchet MS',sans-serif;color:#8a7350}
.a [data-plist]{position:absolute;right:0;top:44px;z-index:30;width:250px;background:#120d09;border:1.5px solid #b8893a;border-radius:12px;padding:5px;box-shadow:0 12px 28px #000c}
.a [data-plist] button{display:flex;gap:10px;align-items:center;text-align:left;padding:6px 10px;border-radius:7px;font-size:17px;font-style:italic}
.a [data-plist] button span{font:700 10px 'Trebuchet MS',sans-serif;font-style:normal;color:#8a7350}
.a [data-plist] button:hover{background:#2b2015}
.a [data-plist] button.on{background:#ff8a1f;color:#1a0f05}.a [data-plist] button.on span{color:#5a2c00}
.a .pw{display:flex;align-items:center;gap:9px;height:38px;padding:0 16px 0 12px;border-radius:20px;border:1.5px solid #5a4528;background:linear-gradient(#2a2118,#15100b);font:700 10px 'Trebuchet MS',Verdana,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#8a7350}
.a .pw i{width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#5a3a1a,#2a1608);border:1px solid #000}
.a .pw.on{color:#ffd9a0;border-color:#b8893a}.a .pw.on i{background:radial-gradient(circle at 35% 30%,#fff3c8,#ff8a1f 55%,#a83a00);box-shadow:0 0 14px #ff8a1f,0 0 3px #fff8}
.a .cage{position:absolute;left:24px;top:82px;width:250px;height:236px;border-radius:14px;border:2px solid #b8893a;background:#0a0705;box-shadow:inset 0 0 30px #000,0 0 0 4px #1b140d,0 6px 18px #000a;overflow:hidden}
.a .cage canvas{position:absolute;left:0;top:0}
.a .cage .lb{position:absolute;left:0;right:0;bottom:7px;display:flex;justify-content:space-around;font:700 9px 'Trebuchet MS',sans-serif;letter-spacing:.2em;color:#a98a58}
.a .crt{position:absolute;left:290px;top:82px;width:350px;height:236px;border-radius:18px;background:linear-gradient(#2c231a,#16100b);border:2px solid #b8893a;padding:10px;box-shadow:0 6px 18px #000a,inset 0 1px 0 #ffffff22}
.a .crt .scr{position:relative;border-radius:12px;overflow:hidden;box-shadow:inset 0 0 22px #000,0 0 0 2px #000;height:188px;background:#0a0603}
.a .crt .scr:after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,#00000030 0 1px,transparent 1px 3px);pointer-events:none}
.a .crt .tg{position:absolute;left:10px;top:7px;z-index:2;font:700 9px 'Trebuchet MS',sans-serif;letter-spacing:.16em;color:#ffb257;text-shadow:0 0 6px #ff8a1f}
.a .crt .tg2{position:absolute;right:10px;top:7px;z-index:2;font:700 9px 'Trebuchet MS',sans-serif;letter-spacing:.16em;color:#c88a40}
.a .crt .ft{display:flex;justify-content:space-between;align-items:center;height:26px;padding:0 6px;font:700 9.5px 'Trebuchet MS',sans-serif;letter-spacing:.12em;color:#a98a58}
.a .crt .ft b{color:#ffcf8a;font-weight:700}
.a .sc{position:absolute;left:656px;width:220px;height:112px;border-radius:12px;border:2px solid #b8893a;background:#0a0705;padding:6px 8px;box-shadow:0 6px 18px #000a}
.a .sc.s1{top:82px}.a .sc.s2{top:206px}
.a .sc h5{margin:0 0 4px;font:700 9px 'Trebuchet MS',sans-serif;letter-spacing:.2em;color:#a98a58;display:flex;justify-content:space-between}
.a .sc h5 b{color:#ffb257;font-weight:700}
.a .sc canvas{border-radius:6px;box-shadow:inset 0 0 12px #000}
.a .plate{position:absolute;left:24px;top:334px;width:852px;height:192px;border-radius:16px;border:2px solid #7a5a22;background:linear-gradient(#f2e3bd,#dcc890 60%,#cdb77c);color:#2a1b0a;box-shadow:0 8px 24px #000b,inset 0 2px 0 #fff8,inset 0 -3px 6px #0003;display:flex;align-items:center;padding:0 16px;gap:8px}
.a .plate:before,.a .plate:after{content:"";position:absolute;top:8px;width:9px;height:9px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#8a6a2c);box-shadow:0 1px 1px #0006}
.a .plate:before{left:8px}.a .plate:after{right:8px}
.a .sec{display:flex;flex-direction:column;align-items:center;gap:3px}
.a .sec h6{margin:0 0 3px;font:700 9px 'Trebuchet MS',Verdana,sans-serif;letter-spacing:.22em;color:#6a4a18;text-transform:uppercase}
.a .vc{width:140px;gap:4px;align-items:stretch}
.a .vc button{display:flex;align-items:center;gap:9px;height:40px;padding:0 9px;border-radius:9px;border:1.5px solid #7a5a22;background:linear-gradient(#e9d8aa,#cdb77c);box-shadow:0 2px 0 #7a5a22;text-align:left}
.a .vc button i{width:12px;height:12px;border-radius:50%;background:#6a3b12;border:1px solid #3a1c00;flex:none}
.a .vc button b{display:block;font-size:19px;font-style:italic;font-weight:700;line-height:1}
.a .vc button small{display:block;font:600 8.5px 'Trebuchet MS',sans-serif;letter-spacing:.06em;color:#7a5a22;margin-top:2px}
.a .vc button.on{background:linear-gradient(#ffcf7a,#f1a23a);transform:translateY(2px);box-shadow:0 0 0 #7a5a22}
.a .vc button.on i{background:radial-gradient(circle at 35% 30%,#fff,#ff7a10 60%);box-shadow:0 0 10px #ff7a10}
.a .kn{position:relative;border-radius:50%;cursor:ns-resize;margin:6px 0 3px}
.a .kn:before{content:"";position:absolute;inset:-9px;border-radius:50%;background:conic-gradient(from 135deg,#dcc890 0 90deg,transparent 90deg),repeating-conic-gradient(from -137deg,#6a4a18 0 2.5deg,transparent 2.5deg 27deg)}
.a .kn:after{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 50% 50%,#1b130b 0 52%,transparent 53%),repeating-conic-gradient(#3a2a18 0 4deg,#1b130b 4deg 8deg);box-shadow:0 5px 8px #0007,inset 0 0 0 2px #0008}
.a .kn u{position:absolute;inset:0;transform:rotate(calc(-135deg + var(--v,0) * 270deg));z-index:2;pointer-events:none}
.a .kn u:before{content:"";position:absolute;left:calc(50% - 2.5px);top:3px;width:5px;height:38%;border-radius:3px;background:#ffe2a3;box-shadow:0 0 6px #ff8a1f}
.a .kn.drag:after{filter:brightness(1.4)}
.a .k1{width:84px;height:84px}.a .k2{width:56px;height:56px}
.a .sec .lab{font:700 11px 'Trebuchet MS',sans-serif;letter-spacing:.14em;text-transform:uppercase;margin-top:5px}
.a .sec .val{font:700 12px 'Trebuchet MS',sans-serif;color:#7a2d00;background:#00000012;border-radius:5px;padding:1px 7px;min-width:56px;text-align:center;font-variant-numeric:tabular-nums;white-space:nowrap}
.a .tgs{width:96px;gap:9px}
.a .tgs button{display:flex;align-items:center;gap:8px;width:100%;height:36px;padding:0 8px;border:1.5px solid #7a5a22;border-radius:18px;background:#c9b273;text-align:left;font:700 9.5px 'Trebuchet MS',sans-serif;letter-spacing:.1em;text-transform:uppercase}
.a .tgs button s{flex:none;width:30px;height:16px;border-radius:8px;background:#3a2a18;position:relative;box-shadow:inset 0 1px 3px #000}
.a .tgs button s:after{content:"";position:absolute;left:2px;top:2px;width:12px;height:12px;border-radius:50%;background:#a98a58;transition:all .12s}
.a .tgs button.on s{background:#8a3b00}.a .tgs button.on s:after{left:16px;background:#ffcf7a;box-shadow:0 0 8px #ff8a1f}
.a .mt{flex:1;display:flex;align-items:flex-end;justify-content:space-around;gap:6px;height:164px}
.a .mt .vu{position:relative;width:128px;height:104px;border-radius:8px;background:linear-gradient(#fff4d0,#f1dca0);border:2px solid #5a3e12;box-shadow:inset 0 0 10px #0004;overflow:hidden}
.a .mt .vu canvas{position:absolute;left:0;top:0}
.a .mt .vu span{position:absolute;left:30px;right:30px;bottom:4px;text-align:center;background:#f1dca0;border-radius:4px;font:700 8.5px 'Trebuchet MS',sans-serif;letter-spacing:.2em;color:#6a3b12}
.a .lad{display:flex;flex-direction:column;align-items:center;gap:3px;font:700 8.5px 'Trebuchet MS',sans-serif;letter-spacing:.12em;color:#6a4a18}
.a .lad canvas{background:#1b130b;padding:2px;border-radius:3px;box-shadow:inset 0 0 4px #000}
.a .lad em{font-style:normal;color:#7a2d00;font-variant-numeric:tabular-nums;font-size:9px;letter-spacing:0;min-width:32px;text-align:center}
`;
  function tubeSvg() {
    return '<svg viewBox="0 0 44 44"><defs><radialGradient id="hg" cx="50%" cy="55%" r="55%"><stop offset="0" stop-color="#fff0b8"/><stop offset=".5" stop-color="#ff9a2e"/><stop offset="1" stop-color="#a83a00"/></radialGradient></defs>' +
      '<rect x="3" y="3" width="38" height="38" rx="9" fill="#1b130b" stroke="#b8893a" stroke-width="2"/><path d="M15 33V19a7 7 0 0 1 14 0v14z" fill="url(#hg)" opacity=".92"/><path d="M15 33V19a7 7 0 0 1 14 0v14z" fill="none" stroke="#f3e6c4" stroke-width="1.4"/><path d="M19 33V20m3 13V17m3 16V20" stroke="#4a1c00" stroke-width="1.2"/><rect x="13" y="33" width="18" height="4" rx="1.5" fill="#f3e6c4"/></svg>';
  }
  function buildA(root, P) {
    root.innerHTML = '<style>' + BASE + CSS_A + '</style><div class="a">' +
      '<div class="hd"><div class="wm">' + tubeSvg() + '<div><b>Hotwallet</b><small>valve saturation &middot; keep your keys warm</small></div></div><div class="sp"></div>' +
      '<div class="pb"><button class="ar" data-prev>&lsaquo;</button><div class="cur" data-tgl><i data-pidx>01</i><em data-pname></em><small>&#9662;</small></div><button class="ar" data-next>&rsaquo;</button><div data-plist></div></div>' +
      '<button class="pw" data-b="__bypass"><i></i><span>Power</span></button></div>' +
      '<div class="cage"><canvas id="tb"></canvas><div class="lb"><span>V1 &middot; IN</span><span>V2 &middot; DRIVE</span><span>V3 &middot; OUT</span></div></div>' +
      '<div class="crt"><div class="scr"><div class="tg" id="tg">TRANSFER &middot; TUBE</div><div class="tg2" id="tg2"></div><canvas id="cv"></canvas></div>' +
      '<div class="ft"><span>SLOPE <b id="sl">1.00x</b></span><span>TONE LP <b data-readtone></b></span><span>HEAD GAIN <b id="hgv"></b></span></div></div>' +
      '<div class="sc s1"><h5><span>GRID IN</span><b>dry</b></h5><canvas id="s1"></canvas></div>' +
      '<div class="sc s2"><h5><span>PLATE OUT</span><b>cooked</b></h5><canvas id="s2"></canvas></div>' +
      '<div class="plate">' +
      '<div class="sec vc"><h6>Voicing</h6>' +
      '<button data-set="character:0"><i></i><span><b>Soft</b><small>clean glass</small></span></button>' +
      '<button data-set="character:1"><i></i><span><b>Tube</b><small>even + odd</small></span></button>' +
      '<button data-set="character:2"><i></i><span><b>Tape</b><small>long knee</small></span></button></div>' +
      '<div class="sec" style="width:108px"><h6>Heat</h6><div class="kn k1" data-b="amount"><u></u></div><div class="lab">Drive</div><div class="val" data-t="amount"></div></div>' +
      '<div class="sec" style="width:78px"><h6>Colour</h6><div class="kn k2" data-b="tone"><u></u></div><div class="lab">Tone</div><div class="val" data-t="tone"></div></div>' +
      '<div class="sec" style="width:78px"><h6>Trim</h6><div class="kn k2" data-b="level"><u></u></div><div class="lab">Level</div><div class="val" data-t="level"></div></div>' +
      '<div class="sec" style="width:78px"><h6>Blend</h6><div class="kn k2" data-b="mix"><u></u></div><div class="lab">Mix</div><div class="val" data-t="mix"></div></div>' +
      '<div class="sec tgs"><h6>Options</h6><button data-tog="auto"><s></s>Auto gain</button><button data-tog="hq"><s></s>4x HQ</button></div>' +
      '<div class="mt"><div class="lad"><canvas id="li" width="22" height="120"></canvas><span>IN</span><em id="lie"></em></div>' +
      '<div class="vu"><canvas id="vu"></canvas><span>HARMONICS</span></div>' +
      '<div class="lad"><canvas id="lo" width="22" height="120"></canvas><span>OUT</span><em id="loe"></em></div></div>' +
      '</div></div>';
    const $ = s => root.querySelector(s);
    wire(root, P);
    const tb = setup($('#tb'), 250, 236), cv = setup($('#cv'), 330, 188), s1 = setup($('#s1'), 204, 82), s2 = setup($('#s2'), 204, 82);
    const vu = setup($('#vu'), 128, 104), li = $('#li').getContext('2d'), lo = $('#lo').getContext('2d');
    P.scope($('#s1'), { tap: 'in', color: '#ffb257', bg: '#0a0603', grid: '#3a24101a', width: 2, glow: 6, gain: 1.4 });
    P.scope($('#s2'), { tap: 'out', color: '#ff7a1a', bg: '#0a0603', grid: '#3a241022', width: 2.4, glow: 10, gain: 1.4 });
    $('#s1').style.width = '204px'; $('#s1').style.height = '82px'; $('#s2').style.width = '204px'; $('#s2').style.height = '82px';
    $('#s1').width = 408; $('#s1').height = 164; $('#s2').width = 408; $('#s2').height = 164;
    const next = feed(P); let hv = 0, flick = 0;
    P.sub('character', () => { const c = P.real('character'); $('#tg').textContent = 'TRANSFER · ' + c.toUpperCase(); });
    function drawTube(c, cx, w, h, glow, fl) {
      const base = 178, top = base - h, g = clamp(glow + fl, 0, 1);
      const halo = c.createRadialGradient(cx, base - h * .45, 4, cx, base - h * .45, 90);
      halo.addColorStop(0, 'rgba(255,140,30,' + (0.55 * g) + ')'); halo.addColorStop(1, 'rgba(255,140,30,0)');
      c.fillStyle = halo; c.fillRect(cx - 100, top - 40, 200, h + 100);
      c.beginPath(); c.moveTo(cx - w / 2, base); c.lineTo(cx - w / 2, top + w / 2); c.arc(cx, top + w / 2, w / 2, Math.PI, 0); c.lineTo(cx + w / 2, base); c.closePath();
      const gl = c.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
      gl.addColorStop(0, 'rgba(255,255,255,.16)'); gl.addColorStop(.25, 'rgba(255,170,70,' + (.08 + .22 * g) + ')'); gl.addColorStop(.75, 'rgba(255,120,20,' + (.06 + .2 * g) + ')'); gl.addColorStop(1, 'rgba(255,255,255,.1)');
      c.fillStyle = '#120a05'; c.fill(); c.fillStyle = gl; c.fill(); c.strokeStyle = 'rgba(255,214,150,.45)'; c.lineWidth = 1.5; c.stroke();
      /* plates + filament */
      const pw = w * .5, pt = top + w * .55, ph = h - w * .8;
      c.fillStyle = '#2a2018'; c.fillRect(cx - pw / 2, pt, pw, ph);
      c.fillStyle = 'rgba(255,' + Math.round(80 + 100 * g) + ',20,' + (.15 + .6 * g) + ')'; c.fillRect(cx - pw / 2, pt, pw, ph);
      c.strokeStyle = 'rgba(255,230,160,' + (.3 + .7 * g) + ')'; c.lineWidth = 2; c.shadowColor = '#ff8a1f'; c.shadowBlur = 4 + 14 * g;
      c.beginPath(); c.moveTo(cx - 3, pt + 6); c.lineTo(cx - 3, pt + ph - 4); c.moveTo(cx + 3, pt + 6); c.lineTo(cx + 3, pt + ph - 4); c.stroke(); c.shadowBlur = 0;
      c.fillStyle = '#d9d2c0'; c.fillRect(cx - pw / 2 - 2, pt - 4, pw + 4, 3); c.fillStyle = 'rgba(210,210,210,.5)'; c.beginPath(); c.arc(cx, top + 8, 5, 0, 7); c.fill();
      /* base + pins */
      c.fillStyle = '#0c0805'; c.fillRect(cx - w / 2 - 3, base, w + 6, 14); c.strokeStyle = '#b8893a'; c.lineWidth = 1; c.strokeRect(cx - w / 2 - 3, base, w + 6, 14);
      c.fillStyle = '#c8a050'; for (let i = -2; i <= 2; i++) c.fillRect(cx + i * 6 - 1, base + 14, 2, 8);
    }
    function paintCage(s) {
      const c = tb, W = 250, H = 236; c.clearRect(0, 0, W, H);
      const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#120b06'); bg.addColorStop(1, '#241a10'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
      /* cage rails */
      c.strokeStyle = '#3a2c1a'; c.lineWidth = 1; for (let x = 8; x < W; x += 14) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 194); c.stroke(); }
      flick = flick * 0.9 + (Math.random() - .5) * 0.08;
      const gi = 0.18 + FR(s.i) * 0.6, gh = 0.16 + s.h * 0.84, go = 0.18 + FR(s.o) * 0.7;
      c.save(); c.translate(0, 8); drawTube(c, 46, 50, 128, gi, flick); drawTube(c, 125, 52, 150, gh, flick * 1.3); drawTube(c, 204, 50, 128, go, flick); c.restore();
      c.fillStyle = '#b8893a'; c.fillRect(0, 214, W, 1.5);
    }
    function paintCrt(s) {
      const c = cv, W = 330, H = 188, m = model(P), YR = 1.3;
      const X = x => (x + 1) / 2 * W, Y = y => H / 2 - clamp(y / YR, -1, 1) * H / 2 * 0.94;
      const bg = c.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W * .6); bg.addColorStop(0, '#2a1608'); bg.addColorStop(1, '#0a0603'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
      c.lineWidth = 1; c.strokeStyle = 'rgba(255,150,50,.13)'; c.beginPath();
      for (let i = -4; i <= 4; i++) { c.moveTo(X(i / 4), 0); c.lineTo(X(i / 4), H); } for (let j = -2; j <= 2; j++) { c.moveTo(0, Y(j / 2)); c.lineTo(W, Y(j / 2)); } c.stroke();
      c.strokeStyle = 'rgba(255,170,70,.4)'; c.beginPath(); c.moveTo(X(0), 0); c.lineTo(X(0), H); c.moveTo(0, Y(0)); c.lineTo(W, Y(0)); c.stroke();
      c.strokeStyle = 'rgba(255,90,40,.45)'; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(0, Y(1)); c.lineTo(W, Y(1)); c.moveTo(0, Y(-1)); c.lineTo(W, Y(-1)); c.stroke(); c.setLineDash([]);
      c.fillStyle = 'rgba(255,170,70,.5)'; c.font = '700 8px Trebuchet MS,Verdana,sans-serif'; c.fillText('FULL SCALE', 6, Y(1) + 10); c.fillText('IN →', W - 28, Y(0) - 4);
      /* identity + sister voicings */
      c.strokeStyle = 'rgba(255,200,120,.3)'; c.setLineDash([2, 5]); c.beginPath(); c.moveTo(X(-1), Y(-1)); c.lineTo(X(1), Y(1)); c.stroke(); c.setLineDash([]);
      CHN.forEach(ch => { if (ch === m.ch) return; const mm = model(P, ch); c.strokeStyle = 'rgba(255,170,70,.2)'; c.lineWidth = 1.2; c.beginPath(); curvePath(mm, W, H, YR, 72).forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); });
      /* live samples riding the curve */
      samples(P, 120, 4).forEach((x, i, a) => { c.fillStyle = 'rgba(255,225,160,' + (.12 + .4 * i / a.length) + ')'; c.beginPath(); c.arc(X(x), Y(m.eff(x)), 1.7, 0, 7); c.fill(); });
      /* curve */
      c.shadowColor = '#ff7a10'; c.shadowBlur = 12; c.strokeStyle = '#ffa23a'; c.lineWidth = 3; c.lineJoin = 'round'; c.beginPath();
      curvePath(m, W, H, YR, 110).forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.shadowBlur = 0;
      c.strokeStyle = '#fff1c8'; c.lineWidth = 1; c.beginPath(); curvePath(m, W, H, YR, 110).forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
      /* level dot */
      const x = clamp(s.i, 0, 1), y = m.eff(x);
      [[x, y, 1], [-x, -y, .4]].forEach(d => { c.fillStyle = 'rgba(255,120,20,' + (.35 * d[2]) + ')'; c.beginPath(); c.arc(X(d[0]), Y(d[1]), 11, 0, 7); c.fill(); c.fillStyle = 'rgba(255,248,220,' + d[2] + ')'; c.beginPath(); c.arc(X(d[0]), Y(d[1]), 4, 0, 7); c.fill(); });
      $('#sl').textContent = m.slope.toFixed(2) + 'x'; $('#hgv').textContent = sgn(ld(m.g)) + ' dB';
      $('#tg2').textContent = Math.round(P.get('amount') * 100) + '% · MIX ' + Math.round(m.mix * 100);
    }
    function paintVu(s) {
      const c = vu, W = 128, H = 104; c.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H + 6, R = 92, a0 = -2.35, a1 = -0.79;
      c.lineWidth = 2; c.strokeStyle = '#5a3e12'; c.beginPath(); c.arc(cx, cy, R, a0, a1); c.stroke();
      c.strokeStyle = '#c4301a'; c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, R - 6, a0 + (a1 - a0) * .72, a1); c.stroke();
      c.strokeStyle = '#5a3e12'; c.lineWidth = 1.4;
      for (let i = 0; i <= 10; i++) { const a = a0 + (a1 - a0) * i / 10, l = i % 5 ? 4 : 8; c.beginPath(); c.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); c.lineTo(cx + Math.cos(a) * (R - l), cy + Math.sin(a) * (R - l)); c.stroke(); }
      c.fillStyle = '#5a3e12'; c.font = '700 8px Trebuchet MS,Verdana,sans-serif'; c.fillText('0', 17, 40); c.fillText('1', 104, 40);
      hv += (s.h - hv) * 0.2; const a = a0 + (a1 - a0) * clamp(hv, 0, 1);
      c.strokeStyle = '#b02a10'; c.lineWidth = 2; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * (R - 4), cy + Math.sin(a) * (R - 4)); c.stroke();
      c.fillStyle = '#2a1b0a'; c.beginPath(); c.arc(cx, cy, 8, 0, 7); c.fill();
    }
    P.raf(() => {
      const s = next(); paintCage(s); paintCrt(s); paintVu(s);
      ladder(li, 22, 120, FR(s.i), FR(s.ih), 14, ['#e8a23a', '#ff7a1a', '#e02a10', '#fff2c8']);
      ladder(lo, 22, 120, FR(s.o), FR(s.oh), 14, ['#e8a23a', '#ff7a1a', '#e02a10', '#fff2c8']);
      $('#lie').textContent = ld(s.ih) <= -60 ? '-inf' : sgn(ld(s.ih)); $('#loe').textContent = ld(s.oh) <= -60 ? '-inf' : sgn(ld(s.oh));
    });
  }

  /* ====================================================================== B  BURN  (furnace / flame gauge) */
  const CSS_B = `
.b{position:absolute;inset:0;overflow:hidden;color:#f1dcc6;font-family:'Oswald','Arial Narrow','Helvetica Neue',Arial,sans-serif;background:radial-gradient(ellipse at 40% 110%,#5a1606 0,#1b0d0a 45%,#0d0807 100%)}
.b:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,#ffffff05 0 2px,transparent 2px 46px),repeating-linear-gradient(0deg,#00000030 0 1px,transparent 1px 46px);pointer-events:none}
.b .hd{position:absolute;left:16px;right:16px;top:10px;height:50px;display:flex;align-items:center;gap:14px}
.b .wm{display:flex;align-items:center;gap:10px}
.b .wm svg{width:34px;height:42px;filter:drop-shadow(0 0 8px #ff5a1f)}
.b .wm b{display:block;font-size:44px;font-weight:700;letter-spacing:.06em;line-height:.9;text-transform:uppercase;background:linear-gradient(#fff3b0,#ff9a1f 45%,#d12a0a);-webkit-background-clip:text;background-clip:text;color:transparent}
.b .wm small{display:block;font:500 9.5px 'Courier New',monospace;letter-spacing:.2em;color:#b8806a;text-transform:uppercase;margin-top:2px}
.b .sp{flex:1}
.b .nowp{display:flex;align-items:center;gap:0;height:34px;border:1.5px solid #5a2a1c;background:#0d0706;border-radius:3px}
.b .nowp button{width:30px;height:100%;font-size:17px;color:#ff9a4a}.b .nowp button:hover{background:#2a120c}
.b .nowp div{width:170px;padding:0 10px;font:500 15px 'Oswald','Arial Narrow',sans-serif;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-left:1px solid #3a1c12;border-right:1px solid #3a1c12;line-height:32px}
.b .nowp div i{font:700 10px 'Courier New',monospace;font-style:normal;color:#ff5a1f;margin-right:8px}
.b .dmp{display:flex;align-items:center;gap:9px;height:34px;padding:0 12px;border:1.5px solid #5a2a1c;background:#1a0d09;border-radius:3px;font:600 11px 'Oswald','Arial Narrow',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#8a5a4a}
.b .dmp s{display:block;width:34px;height:14px;border-radius:2px;background:#0a0504;position:relative;box-shadow:inset 0 1px 3px #000}
.b .dmp s:after{content:"";position:absolute;left:2px;top:2px;width:14px;height:10px;background:#7a5a4a;border-radius:1px;transition:left .1s}
.b .dmp.on{color:#ffb070}.b .dmp.on s:after{left:18px;background:linear-gradient(#ffd070,#ff5a1f);box-shadow:0 0 8px #ff5a1f}
.b .pan{position:absolute;border:1.5px solid #4a2418;background:#120908;border-radius:4px;overflow:hidden;box-shadow:inset 0 0 20px #000}
.b .pan h5{position:absolute;left:8px;top:5px;margin:0;z-index:3;font:500 9.5px 'Courier New',monospace;letter-spacing:.2em;color:#b8806a;text-transform:uppercase;pointer-events:none}
.b .gauge{left:16px;top:70px;width:150px;height:336px}
.b .door{left:178px;top:70px;width:384px;height:262px;border-radius:190px 190px 4px 4px;border-width:3px;border-color:#6a3020;background:#060302;box-shadow:inset 0 0 30px #000,0 0 28px #ff3a0a33}
.b .door canvas{position:absolute;left:0;top:0}
.b .door h5{left:50%;transform:translateX(-50%);top:22px}
.b .door .rd{position:absolute;left:0;right:0;bottom:6px;display:flex;justify-content:space-around;z-index:3;font:500 10px 'Courier New',monospace;color:#d08a6a;letter-spacing:.06em;pointer-events:none}
.b .door .rd b{color:#ffcf8a;font-weight:700}
.b .fl1{left:178px;top:342px;width:190px;height:64px}.b .fl2{left:372px;top:342px;width:190px;height:64px}
.b .fl1 canvas,.b .fl2 canvas{position:absolute;left:0;top:0}
.b .fuel{left:574px;top:70px;width:210px;height:200px;padding-top:20px}
.b .fuel [data-ledger]{display:flex;flex-direction:column}
.b .fuel [data-ledger] button{display:flex;align-items:center;gap:9px;padding:0 10px;height:25px;text-align:left;font:500 13px 'Oswald','Arial Narrow',sans-serif;letter-spacing:.06em;text-transform:uppercase;border-top:1px solid #2a140e}
.b .fuel [data-ledger] button span{font:700 9px 'Courier New',monospace;color:#8a4a3a}
.b .fuel [data-ledger] button:hover{background:#2a120c}
.b .fuel [data-ledger] button.on{background:linear-gradient(90deg,#d12a0a,#ff8a1f);color:#1a0805}.b .fuel [data-ledger] button.on span{color:#5a1a05}
.b .io{left:574px;top:280px;width:210px;height:126px;padding:22px 12px 0}
.b .io .ro{display:grid;grid-template-columns:30px 1fr 42px;gap:7px;align-items:center;margin-bottom:8px;font:500 10px 'Courier New',monospace;color:#b8806a;letter-spacing:.1em}
.b .io .ro canvas{width:100%;height:12px}
.b .io .ro em{font-style:normal;text-align:right;color:#ffcf8a;font-variant-numeric:tabular-nums}
.b .base{position:absolute;left:16px;right:16px;top:418px;height:110px;border:1.5px solid #4a2418;border-radius:4px;background:linear-gradient(#1c0e0a,#100807);display:flex;align-items:center;padding:0 14px;gap:14px;box-shadow:inset 0 0 18px #000}
.b .base .g{display:flex;flex-direction:column;align-items:center;gap:3px}
.b .base .lab{font:500 11px 'Oswald','Arial Narrow',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#d8a888}
.b .base .val{font:700 12px 'Courier New',monospace;color:#ffb070;min-width:56px;text-align:center;font-variant-numeric:tabular-nums;white-space:nowrap}
.b .dial{position:relative;width:88px;height:88px;border-radius:50%;cursor:ns-resize;background:conic-gradient(from -135deg,#ff6a1f 0 calc(var(--v,0)*270deg),#2a1610 calc(var(--v,0)*270deg) 270deg,transparent 270deg);box-shadow:0 0 0 2px #3a1c12}
.b .dial:before{content:"";position:absolute;inset:7px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#3a2018,#120806);box-shadow:inset 0 0 0 1px #5a2a1c}
.b .dial u{position:absolute;inset:0;transform:rotate(calc(-135deg + var(--v,0)*270deg));pointer-events:none}
.b .dial u:before{content:"";position:absolute;left:calc(50% - 2px);top:11px;width:4px;height:33px;background:linear-gradient(#fff3b0,#ff5a1f);border-radius:2px;box-shadow:0 0 8px #ff5a1f}
.b .dial u:after{content:"";position:absolute;left:calc(50% - 6px);top:calc(50% - 6px);width:12px;height:12px;border-radius:50%;background:#2a1610;border:2px solid #7a3a28}
.b .fch{display:flex;flex-direction:column;gap:4px;width:150px}
.b .fch button{display:flex;align-items:center;justify-content:space-between;height:26px;padding:0 9px;border:1.5px solid #4a2418;border-radius:3px;background:#1a0d09;font:500 12px 'Oswald','Arial Narrow',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a87a68}
.b .fch button small{font:700 8.5px 'Courier New',monospace;letter-spacing:.06em;color:#7a4a3a}
.b .fch button.on{background:linear-gradient(90deg,#ff5a1f,#ffb03a);color:#1a0805;border-color:#ffb03a}.b .fch button.on small{color:#5a1a05}
.b .sl{position:relative;width:34px;height:70px;cursor:ns-resize;margin:2px 0}
.b .sl:before{content:"";position:absolute;left:calc(50% - 3px);top:0;bottom:0;width:6px;border-radius:3px;background:#050202;box-shadow:inset 0 1px 3px #000,0 0 0 1px #4a2418}
.b .sl i{position:absolute;left:calc(50% - 3px);bottom:0;width:6px;height:calc(var(--v,0)*100%);border-radius:3px;background:linear-gradient(#ffd070,#ff5a1f 60%,#8a1a05);pointer-events:none}
.b .sl u{position:absolute;left:3px;right:3px;height:14px;bottom:calc(var(--v,0)*(100% - 14px));border-radius:2px;background:linear-gradient(#8a6a5a,#4a3028);border:1px solid #1a0a05;box-shadow:0 2px 3px #000a,inset 0 1px 0 #ffffff33;pointer-events:none}
.b .sl u:after{content:"";position:absolute;left:3px;right:3px;top:5px;height:2px;background:#1a0a05}
.b .sl.drag u{filter:brightness(1.35)}
.b .lv{display:flex;align-items:center;gap:8px;height:34px;width:122px;padding:0 8px;border:1.5px solid #4a2418;border-radius:3px;background:#1a0d09;font:600 10.5px 'Oswald','Arial Narrow',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a87a68;text-align:left}
.b .lv s{flex:none;width:12px;height:24px;border-radius:2px;background:#050202;position:relative;box-shadow:inset 0 1px 3px #000}
.b .lv s:after{content:"";position:absolute;left:1px;right:1px;top:13px;height:9px;background:#7a5a4a;border-radius:1px;transition:top .1s}
.b .lv.on{color:#ffcf8a}.b .lv.on s:after{top:2px;background:linear-gradient(#ffd070,#ff5a1f);box-shadow:0 0 6px #ff5a1f}
`;
  

  /* ====================================================================== C  SMELTER  (foundry: pour, ingot, steel) */
  const CSS_C = `
.c{position:absolute;inset:0;overflow:hidden;color:#1d2830;font-family:'Share Tech Mono','Courier New',ui-monospace,Menlo,monospace;background:linear-gradient(135deg,#b9c3cb,#8f9ba5 55%,#a7b2bb)}
.c:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,#ffffff14 0 1px,transparent 1px 3px),radial-gradient(circle at 20% 0,#ffffff55,transparent 50%);pointer-events:none}
.c .riv{position:absolute;width:9px;height:9px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#6a7680 70%);box-shadow:0 1px 1px #0005;z-index:4}
.c .hd{position:absolute;left:22px;right:22px;top:8px;height:46px;display:flex;align-items:center;gap:18px}
.c .wm{display:flex;align-items:center;gap:12px}
.c .wm svg{width:54px;height:36px}
.c .wm b{display:block;font:700 32px/1 'Share Tech Mono','Courier New',monospace;letter-spacing:.2em;text-transform:uppercase;color:#1d2830;text-shadow:0 1px 0 #fff8}
.c .wm small{display:block;font:400 10px 'Share Tech Mono','Courier New',monospace;letter-spacing:.14em;color:#4a5a66;text-transform:uppercase;margin-top:1px}
.c .sp{flex:1}
.c .heat{display:flex;align-items:center;height:36px;background:#1d2830;border-radius:3px;box-shadow:inset 0 2px 5px #000a,0 1px 0 #fff9;position:relative}
.c .heat button.ar{width:32px;height:100%;color:#ff9a3a;font-size:16px;font-weight:700}.c .heat button.ar:hover{background:#2c3a45}
.c .heat .cur{width:240px;display:flex;align-items:center;gap:10px;padding:0 10px;height:100%;border-left:1px solid #3a4852;border-right:1px solid #3a4852;color:#ffb066;font-size:15px;letter-spacing:.06em}
.c .heat .cur i{font-style:normal;font-size:10px;color:#8a98a4;letter-spacing:.14em}
.c .heat .cur em{font-style:normal;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 0 8px #ff7a1a88}
.c .heat .cur small{font-size:9px;color:#8a98a4}
.c [data-plist]{position:absolute;right:0;top:40px;z-index:30;width:270px;background:#1d2830;border-radius:4px;padding:4px;box-shadow:0 10px 24px #000a}
.c [data-plist] button{display:flex;gap:10px;align-items:center;text-align:left;padding:6px 9px;font-size:13px;color:#c8d2da;letter-spacing:.04em;border-radius:2px}
.c [data-plist] button span{font-size:9.5px;color:#ff9a3a}
.c [data-plist] button:hover{background:#2c3a45}
.c [data-plist] button.on{background:#ff7a1a;color:#1d1008}.c [data-plist] button.on span{color:#5a2a00}
.c .furn{display:flex;align-items:center;gap:10px;height:36px;padding:0 14px 0 10px;border-radius:3px;background:linear-gradient(#cfd8de,#9aa6b0);box-shadow:0 2px 0 #4a5a66,inset 0 1px 0 #fff;font:700 11px 'Share Tech Mono','Courier New',monospace;letter-spacing:.16em;text-transform:uppercase;color:#4a5a66}
.c .furn s{display:block;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#6a7680,#2c3a45);border:2px solid #1d2830}
.c .furn.on{color:#1d2830}.c .furn.on s{background:radial-gradient(circle at 35% 30%,#fff3c0,#ff7a1a 60%,#b03a00);box-shadow:0 0 12px #ff7a1a}
.c .pl{position:absolute;background:linear-gradient(#aab5be,#98a4ae);border:2px solid #5a6a76;border-radius:5px;box-shadow:inset 0 1px 0 #fff9,0 2px 0 #4a5a66;overflow:hidden}
.c .pl h5{position:absolute;left:8px;top:4px;margin:0;z-index:3;font:400 9.5px 'Share Tech Mono','Courier New',monospace;letter-spacing:.2em;text-transform:uppercase;color:#3a4a56;pointer-events:none}
.c .ing{left:22px;top:62px;width:182px;height:272px}
.c .ing canvas{position:absolute;left:0;top:0}
.c .cru{left:216px;top:62px;width:450px;height:272px;background:#1d2830;border-color:#3a4852;padding:0}
.c .cru canvas{position:absolute;left:0;top:0}
.c .cru h5{color:#8a98a4}
.c .cru .rd{position:absolute;left:0;right:0;bottom:5px;display:flex;justify-content:space-between;padding:0 12px;z-index:3;font-size:10px;color:#8a98a4;letter-spacing:.08em;pointer-events:none}
.c .cru .rd b{color:#ffb066;font-weight:400}
.c .as{left:678px;width:226px;height:131px;background:#1d2830;border-color:#3a4852}
.c .as h5{color:#8a98a4}.c .as canvas{position:absolute;left:0;top:0}
.c .a1{top:62px}.c .a2{top:203px}
.c .fd{left:22px;top:346px;width:572px;height:178px}
.c .fdr{position:absolute;left:14px;right:14px;display:grid;grid-template-columns:78px 1fr 80px;align-items:center;gap:12px;height:36px}
.c .fdr label{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#1d2830;line-height:1.1}
.c .fdr label small{display:block;font-size:8.5px;letter-spacing:.06em;color:#4a5a66;margin-top:2px}
.c .fdr .v{text-align:center;font-size:13px;color:#ffb066;background:#1d2830;border-radius:3px;padding:5px 0;box-shadow:inset 0 1px 4px #000;font-variant-numeric:tabular-nums;white-space:nowrap}
.c .tk{position:relative;height:30px;margin:0 8px;cursor:ew-resize}
.c .tk:before{content:"";position:absolute;left:0;right:0;top:11px;height:8px;border-radius:4px;background:#1d2830;box-shadow:inset 0 2px 4px #000,0 1px 0 #fff9}
.c .tk i{position:absolute;left:0;top:11px;height:8px;width:calc(var(--v,0)*100%);border-radius:4px;background:linear-gradient(90deg,#8a2a05,#ff7a1a 70%,#ffd070);pointer-events:none}
.c .tk b{position:absolute;left:0;right:0;top:22px;height:6px;background:repeating-linear-gradient(90deg,#4a5a66 0 1px,transparent 1px calc(10% - .1px));pointer-events:none;opacity:.8}
.c .tk u{position:absolute;top:2px;left:calc(var(--v,0)*100%);width:26px;height:26px;margin-left:-13px;background:linear-gradient(#e6ecf0,#8f9ba5);clip-path:polygon(12% 0,88% 0,100% 100%,0 100%);pointer-events:none;box-shadow:0 2px 3px #0008}
.c .tk u:after{content:"";position:absolute;left:25%;right:25%;top:8px;bottom:5px;background:linear-gradient(#ff9a3a,#b03a00);clip-path:polygon(8% 0,92% 0,100% 100%,0 100%)}
.c .tk.drag u{filter:brightness(1.2)}
.c .ctl{left:606px;top:346px;width:298px;height:178px}
.c .moulds{position:absolute;left:12px;top:20px;display:flex;gap:8px}
.c .mo{width:86px;height:80px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:6px 4px 5px;border-radius:3px;background:linear-gradient(#cfd8de,#9aa6b0);box-shadow:0 3px 0 #4a5a66,inset 0 1px 0 #fff;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#4a5a66}
.c .mo svg{width:60px;height:44px;background:#1d2830;border-radius:3px;color:#8a98a4;box-shadow:inset 0 1px 4px #000}
.c .mo small{font-size:8px;letter-spacing:.04em;color:#6a7a86}
.c .mo.on{background:linear-gradient(#ffd8a0,#ff9a3a);color:#1d1008;transform:translateY(2px);box-shadow:0 1px 0 #4a5a66}.c .mo.on svg{color:#ffb066}.c .mo.on small{color:#5a2a00}
.c .lvrs{position:absolute;left:12px;right:12px;bottom:10px;display:flex;gap:10px}
.c .lr{flex:1;display:flex;align-items:center;gap:10px;height:44px;padding:0 10px;border-radius:3px;background:linear-gradient(#cfd8de,#9aa6b0);box-shadow:0 2px 0 #4a5a66,inset 0 1px 0 #fff;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#4a5a66;text-align:left}
.c .lr s{flex:none;width:12px;height:30px;position:relative;border-radius:2px;background:#1d2830;box-shadow:inset 0 1px 3px #000}
.c .lr s:after{content:"";position:absolute;left:-4px;top:17px;width:20px;height:8px;border-radius:4px;background:linear-gradient(#e6ecf0,#6a7680);transition:top .1s;box-shadow:0 2px 2px #0006}
.c .lr.on{color:#1d2830}.c .lr.on s:after{top:2px;background:linear-gradient(#ffd8a0,#ff7a1a);box-shadow:0 0 8px #ff7a1a}
`;
  

  Kit.register('drive', {
    fonts: 'family=Cormorant+Garamond:ital,wght@500;700&family=Oswald:wght@500;700&family=Share+Tech+Mono',
    w: 900, h: 540,
    labels: { amount: 'Drive', character: 'Character', tone: 'Tone', level: 'Level', auto: 'Auto gain', mix: 'Mix', hq: 'HQ' },
    fmts: {
      amount: v => Math.round(v * 100) + '%',
      tone: v => hzTxt(toneHz(v)),
      level: v => sgn(v) + ' dB',
      mix: v => Math.round(v * 100) + '%',
    },
    presets: PRESETS,
    faces: [
      { key: 'A', name: 'Hotwallet', accent: '#ff8a1f', w: 900, h: 540, build: buildA },
      undefined,
      undefined,
    ].filter(Boolean),
  });
})();
