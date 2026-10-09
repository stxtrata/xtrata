import { Kit } from "./runtime.js";
/* clipper.js - Soft Clipper / Maximiser. Three faces: A Softfork / B Moon / C Wick
 * Shared: transfer curve computed exactly as in DSP_NOTES (u = x*drive/ceiling -> shape(u) -> * ceiling, mixed with the raw dry). */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const dl = d => Math.pow(10, d / 20);
  const ld = x => 20 * Math.log10(Math.max(1e-6, x));
  const SHAPES = ['soft', 'cubic', 'hard', 'fold'];
  const SHAPE_LABEL = ['Soft', 'Cubic', 'Hard', 'Fold'];
  const dbS = v => (v <= -90 ? '-inf' : (v > 0.05 ? '+' : '') + v.toFixed(1));
  const FR = x => clamp((ld(x) + 48) / 54, 0, 1);          // meter fraction -48..+6 dB

  /* same maths as clipShape in plugins.js (odd-symmetric, input is |u|) */
  function clipShape(shape, knee) {
    const k = clamp(knee, 0, 1), a = 1 - 0.85 * k, d = 1 - a;
    const soft = u => d < 1e-6 ? Math.min(u, 1) : u <= a ? u : a + d * Math.tanh((u - a) / d);
    if (shape === 'cubic') {
      const L = 1.5 * d;
      return u => { if (L < 1e-6) return Math.min(u, 1); if (u <= a) return u; if (u >= a + L) return 1; const z = (u - a) / L; return a + d * (1.5 * z - 0.5 * z * z * z); };
    }
    if (shape === 'hard') {
      const w = k * 0.5;
      return u => { if (w < 1e-6) return Math.min(u, 1); if (u <= 1 - w) return u; if (u >= 1 + w) return 1; return u - (u - 1 + w) * (u - 1 + w) / (4 * w); };
    }
    if (shape === 'fold') {
      return u => { const m = ((u + 1) % 4 + 4) % 4, t = 1 - Math.abs(m - 2); return Math.sign(t) * soft(Math.abs(t)); };
    }
    return soft;
  }
  /* live model of the current params */
  function mdl(P) {
    const drive = dl(P.get('drive')), ceil = dl(P.get('ceiling')), mix = P.get('mix'), knee = P.get('knee'), shape = P.real('shape');
    const fn = clipShape(shape, knee);
    const wet = x => { const u = Math.abs(x) * drive / ceil; return Math.sign(x) * fn(u) * ceil; };
    const eff = x => mix * wet(x) + (1 - mix) * x;
    return { drive, ceil, mix, knee, shape, fn, wet, eff, g0: mix * drive + (1 - mix) };
  }
  function effFor(P, shape) {
    const drive = dl(P.get('drive')), ceil = dl(P.get('ceiling')), mix = P.get('mix'), fn = clipShape(shape, P.get('knee'));
    return x => mix * (Math.sign(x) * fn(Math.abs(x) * drive / ceil) * ceil) + (1 - mix) * x;
  }
  function shapeIcon(s, w, h, sw) {
    const fn = clipShape(s, 0.5); let d = '';
    for (let i = 0; i <= 48; i++) { const u = i / 48 * 2.6; const y = fn(u); d += (i ? 'L' : 'M') + (i / 48 * w).toFixed(1) + ' ' + (h - 2 - Math.max(0, y) * (h - 5)).toFixed(1); }
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function setup(cv, w, h) { cv.width = w * 2; cv.height = h * 2; cv.style.width = w + 'px'; cv.style.height = h + 'px'; return cv.getContext('2d'); }
  /* meter feed with decay + peak hold */
  function feed(P) {
    const s = { i: 0, o: 0, c: 0, oh: 0, ih: 0, ot: 0, it: 0 };
    return function () {
      const m = P.meter(), now = performance.now(), i = m.inPeak || 0, o = m.outPeak || 0, c = m.clip || 0;
      s.i = Math.max(i, s.i * 0.9); s.o = Math.max(o, s.o * 0.9); s.c = Math.max(c, s.c * 0.93);
      if (o >= s.oh || now - s.ot > 1400) { s.oh = o; s.ot = now; }
      if (i >= s.ih || now - s.it > 1400) { s.ih = i; s.it = now; }
      return s;
    };
  }
  function recent(P, n, span) {
    const b = P.timeData('in'); if (!b) return null; const out = [], len = b.length, st = Math.max(1, Math.floor(span / n));
    for (let i = len - span; i < len; i += st) out.push(b[i]);
    return out;
  }

  const BASE = '*{box-sizing:border-box}[data-plist]{display:none}[data-plist].open{display:grid}button{cursor:pointer;font-family:inherit;border:0;background:none;color:inherit;padding:0}canvas{display:block}[data-b]{outline:none;touch-action:none}:host,div,button,span,em,small,b,label,canvas{user-select:none;-webkit-user-select:none}';

  /* generic data-attribute wiring: data-b (bind) [data-abs data-ax data-inv data-rng], data-t, data-set="id:val", preset controls */
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
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = name || 'Init'; });
      root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = String(Math.max(i, 0) + 1).padStart(2, '0'); });
      root.querySelectorAll('[data-pn]').forEach(e => { e.textContent = String(n).padStart(2, '0'); });
      if (host) host.querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.pi === i));
    });
  }

  /* ====================================================================== A  SOFTFORK */
  const CSS_A = `
.a{position:absolute;inset:0;background:#e6ece8;color:#12262b;font-family:'DM Sans',system-ui,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;overflow:hidden;--ink:#12262b;--mut:#5d7378;--line:#c3cfc9;--teal:#0e8a8c;--org:#ea5a1f}
.a:before{content:"";position:absolute;inset:0;background-image:linear-gradient(#d5dfd9 1px,transparent 1px),linear-gradient(90deg,#d5dfd9 1px,transparent 1px);background-size:32px 32px;opacity:.55;pointer-events:none}
.a .hd{position:absolute;left:24px;right:24px;top:12px;height:50px;display:flex;align-items:center;gap:18px}
.a .wm{display:flex;align-items:center;gap:10px}
.a .wm svg{width:36px;height:36px}
.a .wm b{font-size:31px;font-weight:800;letter-spacing:-.045em;line-height:1}
.a .wm b i{font-style:normal;color:var(--org)}
.a .wm small{display:block;font:500 9.5px/1.2 'DM Mono',ui-monospace,Menlo,Consolas,monospace;color:var(--mut);letter-spacing:.04em;margin-top:3px}
.a .sp{flex:1}
.a .br{position:relative;display:flex;align-items:center;gap:0;background:#fff;border:1.5px solid var(--ink);border-radius:10px;height:38px}
.a .br button.ar{width:30px;height:100%;font-size:17px;font-weight:700}
.a .br button.ar:hover{background:#dff1ee}
.a .br .cur{width:200px;height:100%;display:flex;align-items:center;gap:8px;padding:0 8px;border-left:1.5px solid var(--line);border-right:1.5px solid var(--line);text-align:left}
.a .br .cur .g{font:700 11px 'DM Mono',monospace;color:#fff;background:var(--teal);border-radius:5px;padding:2px 5px}
.a .br .cur em{font-style:normal;font-weight:600;font-size:13px;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.a .br .cur small{font:500 9.5px 'DM Mono',monospace;color:var(--mut)}
.a [data-plist]{position:absolute;right:0;top:44px;z-index:30;width:250px;background:#fff;border:1.5px solid var(--ink);border-radius:10px;padding:4px;box-shadow:6px 8px 0 #12262b22}
.a [data-plist] button{display:flex;gap:8px;align-items:center;text-align:left;padding:6px 8px;border-radius:6px;font-size:12.5px}
.a [data-plist] button span{font:500 9.5px 'DM Mono',monospace;color:var(--mut)}
.a [data-plist] button em{font-style:normal;font-weight:500}
.a [data-plist] button:hover{background:#e6f3f0}
.a [data-plist] button.on{background:var(--ink);color:#fff}.a [data-plist] button.on span{color:#9fd}
.a .byp{display:flex;align-items:center;gap:8px;height:38px;padding:0 13px 0 11px;border:1.5px solid var(--ink);border-radius:10px;background:#fff;font:600 11px 'DM Mono',ui-monospace,monospace;letter-spacing:.03em}
.a .byp .d{width:12px;height:12px;border-radius:50%;border:2.5px solid var(--mut);background:#fff}
.a .byp.on{background:var(--ink);color:#fff}.a .byp.on .d{border-color:#5ee0c3;background:#5ee0c3;box-shadow:0 0 0 3px #5ee0c344}
.a .map{position:absolute;left:24px;top:74px;width:560px;height:300px;background:#f8fbf8;border:1.5px solid var(--ink);border-radius:14px;overflow:hidden;box-shadow:5px 6px 0 #12262b1f}
.a .map .tg{position:absolute;left:12px;top:8px;font:500 9px 'DM Mono',monospace;color:var(--mut);letter-spacing:.08em;pointer-events:none}
.a .map .bd{position:absolute;right:12px;top:7px;font:600 10px 'DM Mono',monospace;background:var(--org);color:#fff;border-radius:5px;padding:2px 7px;pointer-events:none}
.a .mt{position:absolute;left:24px;top:388px;width:560px;height:68px;display:grid;grid-template-columns:1fr 168px;gap:16px}
.a .bars{display:flex;flex-direction:column;gap:7px;justify-content:center}
.a .bar{display:grid;grid-template-columns:34px 1fr 54px;align-items:center;gap:8px;font:500 10px 'DM Mono',monospace}
.a .bar label{color:var(--mut);letter-spacing:.06em}
.a .bar .tr{position:relative;height:11px;background:#cfdad4;border-radius:6px;overflow:hidden;border:1px solid #b5c4bc}
.a .bar .tr i{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:linear-gradient(90deg,var(--teal),#33b9a8)}
.a .bar.o .tr i{background:linear-gradient(90deg,#e58a2a,var(--org))}
.a .bar.c .tr i{background:repeating-linear-gradient(90deg,#8a63d2 0 6px,#a98ae6 6px 9px)}
.a .bar .tr u{position:absolute;top:0;bottom:0;width:2px;background:var(--ink)}
.a .bar .tr s{position:absolute;top:0;bottom:0;width:2px;background:#fff;opacity:.9}
.a .bar span{text-align:right;color:var(--ink);font-variant-numeric:tabular-nums}
.a .stn{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:4px 12px;align-content:center;font:500 9px 'DM Mono',monospace;color:var(--mut)}
.a .stn div{position:relative;padding-left:14px;line-height:1.15}
.a .stn div:before{content:"";position:absolute;left:0;top:3px;width:8px;height:8px;border-radius:50%;border:2px solid var(--teal);background:#fff}
.a .stn b{display:block;font:700 13px 'DM Sans',system-ui,sans-serif;color:var(--ink);font-variant-numeric:tabular-nums}
.a .stn .w{grid-column:1/3}
.a .stn .w:before{border-color:var(--org)}
.a .sg{position:absolute;left:24px;top:466px;width:560px}
.a .sg .cap{font:500 9px 'DM Mono',monospace;color:var(--mut);letter-spacing:.08em;margin-bottom:5px}
.a .sgrow{display:flex;gap:7px}
.a .sp1{position:relative;width:104px;height:54px;background:#fff;border:1.5px solid var(--ink);clip-path:polygon(0 0,86% 0,100% 50%,86% 100%,0 100%);display:flex;align-items:center;gap:6px;padding:0 20px 0 10px;text-align:left}
.a .sp1 svg{flex:none;color:var(--teal)}
.a .sp1 strong{display:block;font-size:13px;font-weight:700;line-height:1.1}
.a .sp1 small{font:500 8.5px 'DM Mono',monospace;color:var(--mut);white-space:nowrap}
.a .sp1:hover{background:#e2f3ef}
.a .sp1.on{background:var(--org);color:#fff}.a .sp1.on svg,.a .sp1.on small{color:#fff}
.a .hq{margin-left:auto;width:122px;height:54px;border:1.5px solid var(--ink);border-radius:10px;background:#fff;display:flex;flex-direction:column;justify-content:center;gap:5px;padding:0 11px;text-align:left}
.a .hq .l{font:500 9px 'DM Mono',monospace;color:var(--mut);letter-spacing:.06em}
.a .hqr{display:flex;align-items:center;gap:8px}.a .hq .sw{position:relative;width:46px;height:20px;border-radius:10px;background:#cfdad4;border:1.5px solid var(--ink)}
.a .hq .sw:after{content:"";position:absolute;left:2px;top:2px;width:13px;height:13px;border-radius:50%;background:var(--ink);transition:left .12s}
.a .hq[data-index="1"] .sw{background:#5ee0c3}.a .hq[data-index="1"] .sw:after{left:27px}
.a .hq b{font:700 11px 'DM Mono',monospace}
.a .sc{position:absolute;left:608px;top:74px;width:328px;height:148px;background:#0f2428;border:1.5px solid var(--ink);border-radius:14px;overflow:hidden;box-shadow:5px 6px 0 #12262b1f}
.a .sc .t{position:absolute;left:12px;top:7px;font:500 9px 'DM Mono',monospace;color:#7fa6a8;letter-spacing:.08em;white-space:nowrap}
.a .sc .t i{font-style:normal;color:#ff8a4f}
.a .scw{position:absolute;left:8px;right:8px;top:24px;bottom:8px}
.a .scw canvas{position:absolute;left:0;top:0;width:100%;height:100%}
.a .scw .g{position:absolute;left:0;right:0;border-top:1px dashed #ff8a4f88;pointer-events:none}
.a .rails{position:absolute;left:608px;top:236px;width:328px}
.a .rw{height:60px;padding-top:3px}
.a .rl{display:flex;align-items:baseline;justify-content:space-between;font-weight:700;font-size:13px}
.a .rl small{font:500 9px 'DM Mono',monospace;color:var(--mut);margin-left:7px;letter-spacing:.02em}
.a .rl em{font:600 12px 'DM Mono',monospace;font-style:normal;background:#fff;border:1.5px solid var(--ink);border-radius:6px;padding:1px 6px;min-width:62px;text-align:center}
.a .rail{position:relative;height:28px;margin:6px 10px 0;cursor:ew-resize}
.a .rail:before{content:"";position:absolute;left:0;right:0;top:13px;height:4px;border-radius:2px;background:var(--line)}
.a .rail .fl{position:absolute;left:0;top:13px;height:4px;border-radius:2px;width:calc(var(--v,0)*100%);background:var(--teal)}
.a .rail .tk{position:absolute;top:10px;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:#fff;border:2px solid var(--line)}
.a .rail b{position:absolute;top:6px;left:calc(var(--v,0)*100%);width:20px;height:20px;margin-left:-10px;border-radius:50%;background:#fff;border:4px solid var(--org);box-shadow:0 2px 0 #12262b33}
.a .rail.drag b,.a .rail:hover b{box-shadow:0 0 0 5px #ea5a1f33}
.a .rail:focus-visible b{box-shadow:0 0 0 4px #0e8a8c66}
`;
  

  /* ====================================================================== B  MOON */
  const CSS_B = `
.b{position:absolute;inset:0;background:radial-gradient(120% 100% at 30% 0%,#141a45 0%,#0a0e2c 48%,#05071a 100%);color:#dfe5ff;font-family:'Space Grotesk','Avenir Next',system-ui,-apple-system,'Segoe UI',sans-serif;overflow:hidden;--ac:#9fb4ff;--am:#ffcf6b;--dim:#7b86b8}
.b .hd{position:absolute;left:28px;right:28px;top:14px;height:50px;display:flex;align-items:center;gap:20px}
.b .wm{display:flex;align-items:center;gap:12px}
.b .wm .cr{width:34px;height:34px;border-radius:50%;box-shadow:inset -11px -3px 0 0 #e8ecff,0 0 22px #9fb4ff66;transform:rotate(-18deg)}
.b .wm b{font-size:28px;font-weight:300;letter-spacing:.42em;margin-right:-.42em;color:#f2f4ff}
.b .wm small{display:block;font:400 8.5px/1 'Space Mono',ui-monospace,Menlo,monospace;letter-spacing:.22em;color:var(--dim);margin-top:5px;text-transform:uppercase}
.b .sp{flex:1}
.b .fp{position:relative;display:flex;align-items:center;gap:8px}
.b .fp .lb{font:400 8.5px 'Space Mono',monospace;letter-spacing:.2em;color:var(--dim)}
.b .fp button.ar{width:30px;height:30px;border-radius:50%;border:1px solid #3a4585;color:var(--ac);font-size:16px}
.b .fp button.ar:hover{background:#1c2559;box-shadow:0 0 14px #9fb4ff44}
.b .fp .cur{width:190px;height:34px;border-radius:17px;border:1px solid #3a4585;background:#0b1030;padding:0 16px;display:flex;align-items:center;justify-content:space-between;gap:8px}
.b .fp .cur em{font-style:normal;font-size:13px;font-weight:500;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.b .fp .cur small{font:400 9px 'Space Mono',monospace;color:var(--dim)}
.b [data-plist]{position:absolute;right:0;top:44px;z-index:30;width:236px;background:#0b1030f5;border:1px solid #3a4585;border-radius:14px;padding:6px;box-shadow:0 18px 50px #000b}
.b [data-plist] button{display:flex;gap:10px;align-items:center;text-align:left;padding:7px 10px;border-radius:8px;font-size:12.5px;color:#c9d2ff}
.b [data-plist] button span{font:400 9px 'Space Mono',monospace;color:var(--dim)}
.b [data-plist] button em{font-style:normal}
.b [data-plist] button:hover{background:#1a2250}
.b [data-plist] button.on{background:#2a3578;color:#fff}
.b .ig{height:34px;border-radius:17px;border:1px solid #3a4585;padding:0 16px 0 12px;display:flex;align-items:center;gap:9px;font:400 10px 'Space Mono',monospace;letter-spacing:.16em;color:var(--dim);background:#0b1030}
.b .ig .l{width:10px;height:10px;border-radius:50%;background:#2c3566}
.b .ig.on{color:#fff;border-color:var(--am)}.b .ig.on .l{background:var(--am);box-shadow:0 0 12px 2px var(--am)}
.b .sky{position:absolute;left:28px;top:78px;width:560px;height:344px;border-radius:18px;overflow:hidden;border:1px solid #2a3470;box-shadow:0 0 40px #4f63d422,inset 0 0 40px #00000066}
.b .tel{position:absolute;left:28px;top:434px;width:560px;height:108px;border-radius:18px;border:1px solid #2a3470;background:#070a22;overflow:hidden}
.b .tel .t{position:absolute;left:14px;top:7px;font:400 8.5px 'Space Mono',monospace;letter-spacing:.2em;color:var(--dim);z-index:3;white-space:nowrap}
.b .tel .t i{font-style:normal;color:var(--am)}
.b .scw{position:absolute;left:10px;top:24px;width:394px;height:76px}
.b .scw canvas{position:absolute;left:0;top:0;width:100%;height:100%}
.b .scw .g{position:absolute;left:0;right:0;border-top:1px dashed #ffcf6b77;pointer-events:none}
.b .vm{position:absolute;top:24px;bottom:20px;width:12px;border-radius:6px;background:#12183f;overflow:hidden}
.b .vm i{position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(0deg,#4d63d6,#9fb4ff,#fff)}
.b .vm.o i{background:linear-gradient(0deg,#e08a2c,#ffcf6b,#fff6d6)}
.b .vm s{position:absolute;left:0;right:0;height:2px;background:#fff}
.b .vl{position:absolute;bottom:6px;font:400 7.5px 'Space Mono',monospace;color:var(--dim);letter-spacing:.1em;width:30px;text-align:center}
.b .ring{position:absolute;right:12px;top:22px;width:70px;height:70px;border-radius:50%;background:conic-gradient(from -135deg,var(--am) 0 calc(var(--c,0)*270deg),#171e4d calc(var(--c,0)*270deg) 270deg,transparent 270deg)}
.b .ring:before{content:"";position:absolute;inset:7px;border-radius:50%;background:#070a22}
.b .ring div{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font:500 15px 'Space Grotesk',sans-serif;color:#fff;line-height:1}
.b .ring small{font:400 7px 'Space Mono',monospace;letter-spacing:.18em;color:var(--dim);margin-top:3px}
.b .kn{position:absolute;left:612px;top:80px;width:300px;display:grid;grid-template-columns:repeat(3,100px);grid-template-rows:repeat(2,142px)}
.b .kc{display:flex;flex-direction:column;align-items:center;font-size:10px}
.b .kw{position:relative;width:88px;height:88px;border-radius:50%;cursor:ns-resize}
.b .kw:before,.b .kw:after{content:"";position:absolute;inset:0;border-radius:50%}
.b .kw:before{background:repeating-conic-gradient(from -135deg,#46529a 0 2deg,transparent 2deg 27deg);-webkit-mask:radial-gradient(circle,transparent 0 37px,#000 38px 43px,transparent 44px),conic-gradient(from -135deg,#000 0 271deg,transparent 0);-webkit-mask-composite:source-in;mask:radial-gradient(circle,transparent 0 37px,#000 38px 43px,transparent 44px),conic-gradient(from -135deg,#000 0 271deg,transparent 0);mask-composite:intersect}
.b .kw:after{background:repeating-conic-gradient(from -135deg,var(--ac) 0 2deg,transparent 2deg 27deg);-webkit-mask:radial-gradient(circle,transparent 0 37px,#000 38px 43px,transparent 44px),conic-gradient(from -135deg,#000 0 calc(var(--v,0)*270deg + 1deg),transparent 0);-webkit-mask-composite:source-in;mask:radial-gradient(circle,transparent 0 37px,#000 38px 43px,transparent 44px),conic-gradient(from -135deg,#000 0 calc(var(--v,0)*270deg + 1deg),transparent 0);mask-composite:intersect;filter:drop-shadow(0 0 3px var(--ac))}
.b .kb{position:absolute;inset:12px;border-radius:50%;background:radial-gradient(circle at 34% 28%,#2b3578,#0e1338 70%);border:1px solid #4455a8;box-shadow:0 6px 14px #0009,inset 0 0 12px #0008;transform:rotate(calc(-135deg + var(--v,0)*270deg))}
.b .kb:before{content:"";position:absolute;left:calc(50% - 2px);top:5px;width:4px;height:15px;border-radius:2px;background:var(--am);box-shadow:0 0 8px var(--am)}
.b .kw.drag .kb{border-color:var(--ac)}
.b .kc label{margin-top:6px;font-weight:500;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#e8ecff}
.b .kc em{font:400 11px 'Space Mono',monospace;font-style:normal;color:var(--am);margin-top:2px;font-variant-numeric:tabular-nums}
.b .kc small{font:400 8px 'Space Mono',monospace;color:var(--dim);letter-spacing:.12em;text-transform:uppercase;margin-top:2px}
.b .port{position:relative;width:88px;height:88px;border-radius:50%;border:5px solid #28326f;background:radial-gradient(circle at 50% 60%,#0c1236,#04061a);display:flex;align-items:center;justify-content:center;font:500 17px 'Space Grotesk',sans-serif;color:#566099;box-shadow:inset 0 0 18px #000}
.b .port[data-index="1"]{border-color:#7f94ff;color:#fff;box-shadow:inset 0 0 20px #3b4ec277,0 0 18px #9fb4ff55}
.b .stg{position:absolute;left:612px;top:372px;width:300px}
.b .stg .cap{font:400 8.5px 'Space Mono',monospace;letter-spacing:.2em;color:var(--dim);margin-bottom:6px}
.b .stgr{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.b .st1{height:62px;border:1px solid #2f3a7d;border-radius:12px;background:#0b1030;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--dim);font-size:10px;letter-spacing:.12em;text-transform:uppercase}
.b .st1 svg{color:#8e9be0}
.b .st1:hover{border-color:#5668c7}
.b .st1.on{background:#1b2562;border-color:var(--ac);color:#fff;box-shadow:0 0 18px #9fb4ff44}.b .st1.on svg{color:var(--am)}
.b .stat{position:absolute;left:612px;top:482px;width:300px;height:60px;border-radius:14px;background:#0b1030;border:1px solid #2a3470;padding:9px 14px}
.b .stat small{font:400 8px 'Space Mono',monospace;letter-spacing:.2em;color:var(--dim)}
.b .stat b{display:block;font:500 13px 'Space Grotesk',sans-serif;letter-spacing:.06em;color:#fff;margin:3px 0 2px}
.b .stat span{font:400 9.5px 'Space Mono',monospace;color:var(--am);white-space:nowrap}
`;
  

  /* ====================================================================== C  WICK */
  const CSS_C = `
.c{position:absolute;inset:0;background:radial-gradient(100% 90% at 70% 20%,#2a1d12 0%,#18110b 55%,#0f0a06 100%);color:#e9dcc3;font-family:'IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace;overflow:hidden;--wax:#f1e4c8;--amb:#ffb347;--emb:#ff5a36;--dim:#8d7a5e;--ln:#3a2b1d}
.c .lf{position:absolute;left:0;top:0;bottom:0;width:178px;border-right:1px solid var(--ln);background:#120c07;padding:16px 14px}
.c .wm{font:italic 600 44px/0.9 'Fraunces',Georgia,'Times New Roman',serif;color:var(--wax);letter-spacing:-.03em;position:relative;padding-top:20px}
.c .wm svg{position:absolute;left:0;top:-6px}
.c .wm+small{display:block;margin:7px 0 14px;font:400 9px/1.35 'IBM Plex Mono',monospace;color:var(--dim);letter-spacing:.04em}
.c .lh{display:flex;align-items:center;justify-content:space-between;font-size:9px;letter-spacing:.2em;color:var(--dim);border-bottom:1px solid var(--ln);padding-bottom:6px}
.c .lh button{width:22px;height:20px;border:1px solid var(--ln);color:var(--amb);font-size:13px;line-height:1}
.c .lh button:hover{border-color:var(--amb)}
.c .lh span.n{flex:1;text-align:center;letter-spacing:.1em}
.c [data-ledger]{display:flex;flex-direction:column;margin-top:4px}
.c [data-ledger] button{display:flex;gap:8px;align-items:center;text-align:left;padding:7px 4px 7px 6px;border-bottom:1px dotted var(--ln);font-size:11.5px;color:#bba98b;position:relative}
.c [data-ledger] button span{font-size:9px;color:#6f5e47;width:16px}
.c [data-ledger] button em{font-style:normal;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c [data-ledger] button:hover{color:var(--wax)}
.c [data-ledger] button.on{color:#1a1006;background:var(--amb);border-bottom-color:var(--amb)}.c [data-ledger] button.on span{color:#6a4310}
.c .blurb{position:absolute;left:14px;right:14px;bottom:76px;font-size:9px;line-height:1.5;color:#7a6850;letter-spacing:.03em;border-top:1px solid var(--ln);padding-top:9px}.c .blurb b{color:var(--amb);font-weight:600}.c .snuff{position:absolute;left:14px;right:14px;bottom:16px;height:44px;border:1px solid #5a432b;display:flex;align-items:center;gap:10px;padding:0 12px;font-size:10.5px;letter-spacing:.16em;color:var(--dim);background:#1a1109}
.c .snuff .fl{width:12px;height:18px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:#3a2b1d;transition:all .15s}
.c .snuff.on{color:#1a1006;background:var(--amb);border-color:var(--amb)}
.c .snuff.on .fl{background:#fff4c8;box-shadow:0 0 12px 3px #fff1}
.c .main{position:absolute;left:178px;top:0;right:0;bottom:0}
.c .pn{position:absolute;background:#120c07;border:1px solid var(--ln)}
.c .pn .t{position:absolute;left:10px;top:7px;font-size:8.5px;letter-spacing:.2em;color:var(--dim);z-index:2;pointer-events:none;white-space:nowrap}
.c .pn .t i{font-style:normal;color:var(--emb)}
.c .chart{left:16px;top:16px;width:466px;height:276px}
.c .tp{left:494px;top:16px;width:232px;height:276px}
.c .scp{left:16px;top:302px;width:710px;height:66px}
.c .scp .scw{position:absolute;left:92px;right:8px;top:6px;bottom:6px}
.c .scp canvas{position:absolute;left:0;top:0;width:100%;height:100%}
.c .scp .g{position:absolute;left:0;right:0;border-top:1px dashed #ff5a3677;pointer-events:none}
.c .scp .t{top:26px;line-height:1.5;white-space:normal;width:80px}
.c .cf{position:absolute;left:16px;top:380px;width:420px;height:154px;display:flex;gap:0;justify-content:space-between}
.c .cd{width:78px;display:flex;flex-direction:column;align-items:center}
.c .tr{position:relative;width:40px;height:104px;cursor:ns-resize;margin-top:14px}
.c .tr .dish{position:absolute;left:3px;right:3px;bottom:-2px;height:8px;border-radius:2px 2px 6px 6px;background:#3a2b1d;border-top:2px solid #5a432b}
.c .tr .guide{position:absolute;left:19px;width:2px;top:0;bottom:4px;background:repeating-linear-gradient(0deg,#2c2016 0 3px,transparent 3px 8px)}
.c .tr .wx{position:absolute;left:8px;width:24px;bottom:5px;height:max(5px,calc(var(--v,0)*92px));background:linear-gradient(90deg,#c9b891,var(--wax) 40%,#d8c8a2);border-radius:2px 2px 0 0;box-shadow:0 0 14px #ffb34722}
.c .tr .wx:before{content:"";position:absolute;left:1px;right:1px;top:-2px;height:5px;border-radius:50%;background:#fff6dc}
.c .tr .wk{position:absolute;left:19.5px;width:1.5px;height:7px;background:#1a1006;bottom:calc(5px + max(5px,var(--v,0)*92px) + 1px)}
.c .tr .fm{position:absolute;left:14px;width:12px;height:20px;border-radius:50% 50% 50% 50%/65% 65% 35% 35%;background:radial-gradient(ellipse at 50% 75%,#fff7d6 0 28%,#ffb347 62%,#ff5a36);bottom:calc(5px + max(5px,var(--v,0)*92px) + 7px);filter:drop-shadow(0 0 7px #ffb347);transform-origin:50% 100%;animation:fk .22s infinite alternate ease-in-out}
.c.off .fm{opacity:0}
.c .tr.drag .wx{box-shadow:0 0 22px #ffb34766}
@keyframes fk{0%{transform:scale(1,1) rotate(-2deg)}100%{transform:scale(.92,1.1) rotate(2.5deg)}}
.c .cd label{margin-top:7px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--wax)}
.c .cd em{font-style:normal;font-size:11px;color:var(--amb);margin-top:2px;font-variant-numeric:tabular-nums}
.c .cd small{font-size:7.5px;color:var(--dim);letter-spacing:.1em;margin-top:2px;text-transform:uppercase}
.c .rt{position:absolute;left:446px;top:380px;width:280px;height:154px}
.c .rt .cap{font-size:8.5px;letter-spacing:.2em;color:var(--dim);margin-bottom:5px}
.c .tools{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}
.c .tl{height:52px;border:1px solid var(--ln);background:#160f09;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim)}
.c .tl svg{color:#a89270}
.c .tl:hover{border-color:#6b4f30}
.c .tl.on{background:var(--wax);color:#1a1006;border-color:var(--wax)}.c .tl.on svg{color:var(--emb)}
.c .hq2{margin-top:6px;height:26px;border:1px solid var(--ln);background:#160f09;display:flex;align-items:center;justify-content:space-between;padding:0 10px;font-size:9.5px;letter-spacing:.14em;color:var(--dim);width:100%;text-align:left}
.c .hq2 b{font-weight:600;color:var(--wax)}
.c .hq2[data-index="1"]{border-color:var(--amb)}.c .hq2[data-index="1"] b{color:var(--amb)}
.c .mrow{margin-top:7px;display:grid;grid-template-columns:30px 1fr 52px;align-items:center;gap:6px;font-size:9.5px;color:var(--dim);height:13px}
.c .mrow .b{position:relative;height:7px;background:#241911;overflow:hidden}
.c .mrow .b i{position:absolute;left:0;top:0;bottom:0;background:var(--wax)}
.c .mrow.o .b i{background:var(--amb)}.c .mrow.t .b i{background:repeating-linear-gradient(90deg,var(--emb) 0 5px,#c23c1e 5px 7px)}
.c .mrow .b s{position:absolute;top:0;bottom:0;width:2px;background:#fff}
.c .mrow span{text-align:right;color:var(--wax);font-variant-numeric:tabular-nums}
`;
  function faceC(root, P) {
    const fader = (id, label, sub) => '<div class="cd"><div class="tr" data-b="' + id + '" data-abs="y"><div class="guide"></div><div class="dish"></div><div class="wx"></div><div class="wk"></div><div class="fm"></div></div><label>' + label + '</label><em data-t="' + id + '"></em><small>' + sub + '</small></div>';
    const wickIcon = i => '<svg width="30" height="20" viewBox="0 0 30 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + [
      '<path d="M3 17H27M15 17V9"/><path d="M9 8Q15 -1 21 8" />',
      '<path d="M3 17H27M15 17V8"/><path d="M8 9L15 3L22 9"/>',
      '<path d="M3 17H27M15 17V8"/><path d="M8 5H22"/>',
      '<path d="M3 17H27M15 17V9"/><path d="M10 4L15 9L20 4L24 8"/>'][i] + '</svg>';
    root.innerHTML = '<style>' + BASE + CSS_C + '</style><div class="c" id="root"><div class="lf">' +
      '<div class="wm"><svg width="26" height="30" viewBox="0 0 26 30"><path d="M13 1C17 8 20 11 18.5 15.5 17.5 18.5 15 19.5 13 19.5S8.5 18.5 7.5 15.5C6 11 10 8 13 1Z" fill="#ffb347"/><path d="M13 9C15 12 16 14 14.8 16.5 14.3 17.6 13.6 18 13 18S11.7 17.6 11.2 16.5C10 14 12 12 13 9Z" fill="#fff4c8"/></svg>Wick</div>' +
      '<small>trim the tall wicks.<br>keep the flame.</small>' +
      '<div class="lh"><button data-prev>&lsaquo;</button><span class="n">LEDGER <span data-pidx></span>/<span data-pn></span></span><button data-next>&rsaquo;</button></div>' +
      '<div data-ledger></div><div class="blurb">Whatever grows past the <b>trim line</b> is cut. The soft shoulder decides how kindly.<br><br>Trimmed now: <b id="btx">0%</b></div><button class="snuff" data-b="__bypass"><span class="fl"></span><span class="tx">LIT</span></button></div>' +
      '<div class="main">' +
      '<div class="pn chart"><div class="t">TRIMMING BOARD &middot; <i>dashed = trimmed</i></div><canvas id="ch"></canvas></div>' +
      '<div class="pn tp"><div class="t">TRIM PROFILE &middot; in &rarr; out</div><canvas id="tp"></canvas></div>' +
      '<div class="pn scp"><div class="t">OUT WAVE<br><i>over</i> dim in</div><div class="scw"><canvas id="sci"></canvas><canvas id="sco"></canvas><div class="g" id="g1"></div><div class="g" id="g2"></div></div></div>' +
      '<div class="cf">' + fader('drive', 'Drive', 'melt the wax') + fader('ceiling', 'Ceiling', 'trim line') + fader('knee', 'Knee', 'soft shoulder') + fader('mix', 'Mix', 'wet / dry') + fader('tone', 'Tone', 'smoke filter') + '</div>' +
      '<div class="rt"><div class="cap">TRIM STYLE &middot; shape of the cut</div><div class="tools">' +
      SHAPES.map((s, i) => '<button class="tl" data-set="shape:' + i + '">' + wickIcon(i) + SHAPE_LABEL[i] + '</button>').join('') + '</div>' +
      '<button class="hq2" data-b="hq"><span>OVERSAMPLING</span><b data-t="hq"></b></button>' +
      '<div class="mrow"><label>IN</label><div class="b"><i id="bi"></i><s id="bih"></s></div><span id="vi"></span></div>' +
      '<div class="mrow o"><label>OUT</label><div class="b"><i id="bo"></i><s id="boh"></s></div><span id="vo"></span></div>' +
      '<div class="mrow t"><label>TRIM</label><div class="b"><i id="bt"></i></div><span id="vt"></span></div>' +
      '</div></div></div>';
    wire(root, P);
    const $ = s => root.querySelector(s), R = $('#root');
    P.sub('__bypass', on => { $('.snuff .tx').textContent = on ? 'LIT' : 'SNUFFED'; R.classList.toggle('off', !on); });
    const si = $('#sci'), so = $('#sco'); [si, so].forEach(cv => { cv.width = 1220; cv.height = 108; });
    P.scope(si, { tap: 'in', color: 'rgba(160,140,110,.45)', width: 3, gain: 1 });
    P.scope(so, { tap: 'out', color: '#ffb347', width: 3.5, glow: 8, gain: 1 });
    P.sub('ceiling', db => { const c = dl(db); $('#g1').style.top = (50 - c * 48) + '%'; $('#g2').style.top = (50 + c * 48) + '%'; });
    // candle chart
    const CW = 466, CH = 276, cc = setup($('#ch'), CW, CH);
    const TW = 232, TH = 276, tc = setup($('#tp'), TW, TH);
    const NC = 36, hist = []; for (let i = 0; i < NC; i++) hist.push({ hi: 0, lo: 0, rp: 0, rn: 0 });
    let last = 0; const mf = feed(P);
    const cx0 = 46, cy0 = 26, cpw = CW - cx0 - 12, cph = CH - cy0 - 20, VM = 1.2;
    const CY = v => cy0 + cph / 2 - clamp(v, -VM, VM) / VM * (cph / 2);
    const scissors = (c, x, y) => { c.save(); c.translate(x, y); c.strokeStyle = '#ff5a36'; c.lineWidth = 1.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(-6, -4); c.lineTo(5, 4); c.moveTo(-6, 4); c.lineTo(5, -4); c.stroke(); c.beginPath(); c.arc(7, -3.5, 2, 0, 7); c.arc(7, 3.5, 2, 0, 7); c.stroke(); c.restore(); };
    P.raf(t => {
      const m = mdl(P), s = mf(), now = performance.now();
      const b = P.timeData('in');
      if (b && now - last > 45) {
        last = now; const n = 2048, len = b.length; let hi = -1, lo = 1, sp = 0, sn = 0, cp = 0, cn = 0;
        for (let i = len - n; i < len; i++) { const v = b[i]; if (v > hi) hi = v; if (v < lo) lo = v; if (v > 0) { sp += v * v; cp++; } else if (v < 0) { sn += v * v; cn++; } }
        hist.push({ hi: Math.max(0, hi), lo: Math.min(0, lo), rp: cp ? Math.sqrt(sp / cp) : 0, rn: cn ? Math.sqrt(sn / cn) : 0 }); if (hist.length > NC) hist.shift();
      }
      const live = s.i > 0.0025;
      // ---- candle chart
      cc.setTransform(2, 0, 0, 2, 0, 0); cc.clearRect(0, 0, CW, CH);
      cc.font = '400 9px "IBM Plex Mono",ui-monospace,monospace'; cc.textBaseline = 'middle'; cc.lineWidth = 1;
      cc.strokeStyle = '#2a1e14'; cc.fillStyle = '#6f5e47'; cc.textAlign = 'right';
      [-1, -0.5, 0, 0.5, 1].forEach(v => { cc.beginPath(); cc.moveTo(cx0, CY(v)); cc.lineTo(cx0 + cpw, CY(v)); cc.stroke(); cc.fillText(v === 0 ? '0' : (v > 0 ? '+' : '') + v.toFixed(1), cx0 - 6, CY(v)); });
      // trim lines
      cc.strokeStyle = '#ff5a36'; cc.lineWidth = 1.3; cc.setLineDash([7, 4]);
      [m.ceil, -m.ceil].forEach(v => { cc.beginPath(); cc.moveTo(cx0, CY(v)); cc.lineTo(cx0 + cpw, CY(v)); cc.stroke(); }); cc.setLineDash([]);
      scissors(cc, cx0 + 14, CY(m.ceil) - (m.ceil > 1.0 ? -10 : 9)); scissors(cc, cx0 + 14, CY(-m.ceil) + 9);
      cc.fillStyle = '#ff5a36'; cc.textAlign = 'right'; cc.fillText('trim line ' + dbS(P.get('ceiling')) + ' dB', cx0 + cpw + 8, 13);
      const cw = cpw / NC, bw = cw * 0.5;
      hist.forEach((h, i) => {
        const xc = cx0 + cw * (i + 0.5), newest = i === hist.length - 1;
        const dHi = h.hi * m.drive, dLo = h.lo * m.drive, kHi = m.eff(h.hi), kLo = m.eff(h.lo);
        const bt = m.eff(h.rp), bb = m.eff(-h.rn);
        const trimmed = dHi - kHi > 0.02 || kLo - dLo > 0.02;
        // trimmed (lost) wick: dashed ember
        cc.strokeStyle = '#ff5a36'; cc.lineWidth = 1.3; cc.setLineDash([2, 3]);
        if (dHi - kHi > 0.01) { cc.beginPath(); cc.moveTo(xc, CY(kHi)); cc.lineTo(xc, CY(Math.min(dHi, VM))); cc.stroke(); }
        if (kLo - dLo > 0.01) { cc.beginPath(); cc.moveTo(xc, CY(kLo)); cc.lineTo(xc, CY(Math.max(dLo, -VM))); cc.stroke(); }
        cc.setLineDash([]);
        if (dHi > VM) { cc.fillStyle = '#ff5a36'; cc.beginPath(); cc.moveTo(xc - 3, CY(VM) + 4); cc.lineTo(xc, CY(VM)); cc.lineTo(xc + 3, CY(VM) + 4); cc.fill(); }
        if (dLo < -VM) { cc.fillStyle = '#ff5a36'; cc.beginPath(); cc.moveTo(xc - 3, CY(-VM) - 4); cc.lineTo(xc, CY(-VM)); cc.lineTo(xc + 3, CY(-VM) - 4); cc.fill(); }
        // kept wick
        cc.strokeStyle = trimmed ? '#ffd8a0' : '#cdbb97'; cc.lineWidth = 1.4; cc.beginPath(); cc.moveTo(xc, CY(kHi)); cc.lineTo(xc, CY(kLo)); cc.stroke();
        // body
        const y1 = CY(bt), y2 = CY(bb);
        cc.fillStyle = trimmed ? '#ffb347' : '#f1e4c8'; cc.fillRect(xc - bw / 2, Math.min(y1, y2), bw, Math.max(1.5, Math.abs(y2 - y1)));
        if (newest && live) { cc.save(); cc.shadowColor = '#ffb347'; cc.shadowBlur = 12; cc.fillStyle = '#fff4c8'; cc.beginPath(); cc.arc(xc, CY(kHi) - 4, 2.6, 0, 7); cc.fill(); cc.restore(); }
      });
      cc.fillStyle = '#6f5e47'; cc.textAlign = 'left'; cc.fillText('older', cx0, CH - 9); cc.textAlign = 'right'; cc.fillText('now', cx0 + cpw, CH - 9);
      if (!live) { cc.fillStyle = '#8d7a5e'; cc.textAlign = 'center'; cc.font = 'italic 600 15px Fraunces,Georgia,serif'; cc.fillText('no flame yet — press play', cx0 + cpw / 2, CY(0) - 20); }
      // ---- transfer panel (bipolar, sqrt axis on x)
      tc.setTransform(2, 0, 0, 2, 0, 0); tc.clearRect(0, 0, TW, TH);
      const tx0 = 30, ty0 = 30, ts = 192, tcx = tx0 + ts / 2, tcy = ty0 + ts / 2, half = ts / 2;
      const TX = x => tcx + Math.sign(x) * Math.sqrt(Math.min(1, Math.abs(x))) * half, TY = y => tcy - clamp(y, -1.1, 1.1) / 1.1 * half;
      tc.strokeStyle = '#2a1e14'; tc.lineWidth = 1; tc.strokeRect(tx0, ty0, ts, ts);
      tc.beginPath(); tc.moveTo(tcx, ty0); tc.lineTo(tcx, ty0 + ts); tc.moveTo(tx0, tcy); tc.lineTo(tx0 + ts, tcy); tc.stroke();
      tc.font = '400 8.5px "IBM Plex Mono",ui-monospace,monospace'; tc.fillStyle = '#6f5e47'; tc.textBaseline = 'middle'; tc.textAlign = 'center';
      [-20, -6].forEach(d => { const x = TX(dl(d)); tc.fillText(d, x, ty0 + ts + 10); tc.beginPath(); tc.moveTo(x, tcy - 3); tc.lineTo(x, tcy + 3); tc.stroke(); const xn = TX(-dl(d)); tc.beginPath(); tc.moveTo(xn, tcy - 3); tc.lineTo(xn, tcy + 3); tc.stroke(); });
      tc.fillText('0', tcx, ty0 + ts + 10); tc.fillText('IN dB', tx0 + ts - 14, ty0 + ts + 22); tc.textAlign = 'right'; tc.fillText('+1', tx0 - 5, ty0 + 3); tc.fillText('-1', tx0 - 5, ty0 + ts - 3);
      tc.save(); tc.beginPath(); tc.rect(tx0, ty0, ts, ts); tc.clip();
      // trimmed region between straight gain line and curve
      const ncv = 120;
      tc.fillStyle = 'rgba(255,90,54,.2)'; tc.beginPath();
      for (let i = 0; i <= ncv; i++) { const px = i / ncv, xl = px * px; const X = TX(xl), Y = TY(Math.abs(xl) * m.g0); i ? tc.lineTo(X, Y) : tc.moveTo(X, Y); }
      for (let i = ncv; i >= 0; i--) { const px = i / ncv, xl = px * px; tc.lineTo(TX(xl), TY(m.eff(xl))); } tc.closePath(); tc.fill();
      for (let i = 0; i <= ncv; i++) { const px = i / ncv, xl = px * px; /* mirrored */ }
      tc.fillStyle = 'rgba(255,90,54,.2)'; tc.beginPath();
      for (let i = 0; i <= ncv; i++) { const px = i / ncv, xl = px * px; const X = TX(-xl), Y = TY(-Math.abs(xl) * m.g0); i ? tc.lineTo(X, Y) : tc.moveTo(X, Y); }
      for (let i = ncv; i >= 0; i--) { const px = i / ncv, xl = px * px; tc.lineTo(TX(-xl), TY(-m.eff(xl))); } tc.closePath(); tc.fill();
      tc.setLineDash([2, 4]); tc.strokeStyle = '#8d7a5e'; tc.lineWidth = 1.2; tc.beginPath(); tc.moveTo(TX(-1), TY(-m.g0)); tc.lineTo(TX(0), tcy); tc.lineTo(TX(1), TY(m.g0)); tc.stroke();
      tc.beginPath(); for (let i = 0; i <= 80; i++) { const xl = Math.pow(i / 80, 2); const X = TX(xl), Y = TY(xl * m.g0); i ? tc.lineTo(X, Y) : tc.moveTo(X, Y); } tc.stroke();
      tc.setLineDash([6, 4]); tc.strokeStyle = '#ff5a36'; tc.lineWidth = 1.2;
      [m.ceil, -m.ceil].forEach(v => { tc.beginPath(); tc.moveTo(tx0, TY(v)); tc.lineTo(tx0 + ts, TY(v)); tc.stroke(); }); tc.setLineDash([]);
      tc.strokeStyle = '#ffb347'; tc.lineWidth = 3; tc.lineJoin = 'round'; tc.shadowColor = '#ffb347'; tc.shadowBlur = 8;
      tc.beginPath(); for (let i = -ncv; i <= ncv; i++) { const px = i / ncv, xl = Math.sign(px) * px * px; const X = TX(xl), Y = TY(m.eff(xl)); i > -ncv ? tc.lineTo(X, Y) : tc.moveTo(X, Y); } tc.stroke(); tc.shadowBlur = 0;
      const rs = recent(P, 80, 1024);
      if (rs) rs.forEach(v => { if (Math.abs(v) > 0.003) { tc.fillStyle = 'rgba(255,244,200,.3)'; tc.beginPath(); tc.arc(TX(v), TY(m.eff(v)), 1.5, 0, 7); tc.fill(); } });
      tc.restore();
      // flame dot
      const xi = live ? s.i : 0, yi = m.eff(xi), fx = TX(xi), fy = TY(yi);
      tc.save(); tc.translate(fx, fy); tc.shadowColor = '#ffb347'; tc.shadowBlur = live ? 14 : 0;
      tc.fillStyle = live ? '#ffb347' : '#5a432b'; tc.beginPath(); tc.moveTo(0, -11); tc.bezierCurveTo(6, -4, 6, 4, 0, 5); tc.bezierCurveTo(-6, 4, -6, -4, 0, -11); tc.fill();
      tc.shadowBlur = 0; tc.fillStyle = live ? '#fff4c8' : '#8d7a5e'; tc.beginPath(); tc.arc(0, 0, 2.4, 0, 7); tc.fill(); tc.restore();
      tc.font = '400 9.5px "IBM Plex Mono",ui-monospace,monospace'; tc.fillStyle = '#e9dcc3'; tc.textAlign = 'left'; tc.textBaseline = 'middle';
      tc.fillText(live ? dbS(ld(s.i)) + ' dB in > ' + dbS(ld(Math.abs(yi))) + ' out' : 'wick at rest', tx0, TH - 12);
      // ---- meters
      $('#bi').style.width = FR(s.i) * 100 + '%'; $('#bo').style.width = FR(s.o) * 100 + '%'; $('#bt').style.width = clamp(s.c, 0, 1) * 100 + '%';
      $('#bih').style.left = FR(s.ih) * 100 + '%'; $('#boh').style.left = FR(s.oh) * 100 + '%';
      $('#vi').textContent = dbS(ld(s.i)) + ' dB'; $('#vo').textContent = dbS(ld(s.o)) + ' dB'; $('#vt').textContent = Math.round(s.c * 100) + '%'; $('#btx').textContent = Math.round(s.c * 100) + '%';
    });
  }

  Kit.register('clipper', {
    fonts: 'family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500&family=Space+Mono:wght@400&family=Fraunces:ital,wght@1,600&family=IBM+Plex+Mono:wght@400;600',
    w: 960, h: 560,
    labels: { hq: 'Oversampling' },
    fmts: { hq: v => (v ? '4×' : 'Off') },
    presets: [
      { name: 'Init', values: {} },
      { name: 'Drum Bus Tame', values: { drive: 4, ceiling: -3, knee: 0.7, shape: 'soft', mix: 0.8, tone: 16000, hq: 'on' } },
      { name: 'Loudness Wall', values: { drive: 12, ceiling: -0.3, knee: 0.35, shape: 'cubic', mix: 1, tone: 18000, hq: 'on' } },
      { name: 'Warm Tape-ish', values: { drive: 8, ceiling: -4, knee: 1, shape: 'soft', mix: 0.6, tone: 9000, hq: 'on' } },
      { name: 'Hard Parallel', values: { drive: 14, ceiling: -6, knee: 0.1, shape: 'hard', mix: 0.35, tone: 12000, hq: 'on' } },
      { name: 'Fold Mangle', values: { drive: 18, ceiling: -8, knee: 0.6, shape: 'fold', mix: 0.5, tone: 6000, hq: 'on' } },
      { name: 'Lo-Fi Crunch', values: { drive: 20, ceiling: -5, knee: 0, shape: 'hard', mix: 1, tone: 4000, hq: 'off' } },
    ],
    faces: [
      undefined,
      undefined,
      { key: 'C', name: 'Wick', accent: '#ffb347', w: 904, h: 548, build: faceC },
    ].filter(Boolean),
  });
})();
