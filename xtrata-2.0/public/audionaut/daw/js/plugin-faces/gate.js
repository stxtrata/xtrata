import { Kit } from "./runtime.js";
/* gate — Noise Gate. Faces: A Whitelist (velvet rope + door) / B Gatekeep (portcullis + winch) / C Permission (keycard reader + access log) */
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const x = hex(a), y = hex(b); return 'rgb(' + x.map((v, i) => Math.round(lerp(v, y[i], t))).join(',') + ')'; };
  const ms = v => v < 0.01 ? (v * 1000).toFixed(1).replace(/\.0$/, '') + ' ms' : v < 1 ? Math.round(v * 1000) + ' ms' : v.toFixed(2).replace(/0$/, '') + ' s';
  const gdb = g => g > 0.0001 ? 20 * Math.log10(g) : -80;
  const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const MONO = "ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace";

  const presets = [
    { name: 'Tight drums', values: { threshold: -36, attack: 0.001, hold: 0.04, release: 0.09, hysteresis: 4, range: -70, detHp: 120, detLp: 9000 } },
    { name: 'Hum killer', values: { threshold: -50, attack: 0.01, hold: 0.1, release: 0.25, hysteresis: 6, range: -45, detHp: 220, detLp: 5000 } },
    { name: 'Gentle expander', values: { threshold: -40, attack: 0.02, hold: 0.05, release: 0.4, hysteresis: 3, range: -16, detHp: 40, detLp: 12000 } },
    { name: 'Chop', values: { threshold: -24, attack: 0.001, hold: 0, release: 0.02, hysteresis: 0, range: -80, detHp: 20, detLp: 20000 } },
    { name: 'Vocal breaths', values: { threshold: -46, attack: 0.006, hold: 0.08, release: 0.18, hysteresis: 5, range: -24, detHp: 100, detLp: 9000 } },
    { name: 'Amp hiss', values: { threshold: -52, attack: 0.003, hold: 0.15, release: 0.6, hysteresis: 8, range: -70, detHp: 90, detLp: 6000 } },
    { name: 'Init', values: {} }
  ];

  /* ---------- shared: control wiring, presets, live tracker, timeline ---------- */
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

  function track(P) {
    const N = 240, STEP = 0.025;
    const T = { n: N, L: new Float32Array(N).fill(-90), O: new Uint8Array(N), G: new Float32Array(N), i: 0, count: 0, lvl: -90, open: false, gain: 0, g: 0, dir: 0, inDb: -90, outDb: -90, ev: [], t: 0 };
    let last = 0, acc = 0, was = null;
    P.raf(t => {
      const dt = clamp((t - last) / 1000 || 0.016, 0.001, 0.1); last = t; T.t += dt;
      const m = P.meter() || {};
      T.lvl = clamp(typeof m.level === 'number' && isFinite(m.level) ? m.level : -90, -90, 0);
      T.open = !!m.open; T.gain = clamp(+m.gain || 0, 0, 1);
      const prev = T.g; T.g += (T.gain - T.g) * (1 - Math.exp(-dt / 0.02)); T.dir = lerp(T.dir, (T.g - prev) / dt, 0.3);
      const idb = clamp(P.toDb(m.inPeak || 0), -90, 6), odb = clamp(P.toDb(m.outPeak || 0), -90, 6);
      T.inDb = Math.max(idb, T.inDb - 45 * dt); T.outDb = Math.max(odb, T.outDb - 45 * dt);
      if (was !== null && was !== T.open) { T.ev.unshift({ open: T.open, t: T.t, lvl: T.lvl }); if (T.ev.length > 12) T.ev.pop(); }
      was = T.open;
      acc += dt;
      while (acc >= STEP) { acc -= STEP; const k = T.i; T.L[k] = T.lvl; T.O[k] = T.open ? 1 : 0; T.G[k] = T.g; T.i = (k + 1) % N; T.count++; }
    });
    return T;
  }
  const mval = db => clamp((db + 60) / 60, 0, 1);

  function drawTL(cv, T, P, o) {
    const c = cv.getContext('2d'), W = cv.width, H = cv.height, s = 2;
    const L = (o.left == null ? 34 : o.left) * s, R = (o.right == null ? 62 : o.right) * s, Tp = (o.top == null ? 8 : o.top) * s, B = (o.bottom == null ? 8 : o.bottom) * s;
    const pw = W - L - R, ph = H - Tp - B, n = T.n, dx = pw / (n - 1);
    const Y = db => Tp + ph * (-clamp(db, -80, 0) / 80), X = k => L + k * dx;
    const thr = P.get('threshold'), cls = thr - P.get('hysteresis');
    c.clearRect(0, 0, W, H); o.bg(c, W, H);
    c.font = '500 ' + 9 * s + 'px ' + o.font; c.textBaseline = 'middle';
    c.lineWidth = s * 0.6;
    for (let k = 0; k < n; k++) { const age = T.count - (n - 1 - k); if (age > 0 && age % 40 === 0) { c.strokeStyle = o.grid2 || o.grid; c.beginPath(); c.moveTo(X(k), Tp); c.lineTo(X(k), Tp + ph); c.stroke(); } }
    [0, -20, -40, -60, -80].forEach(db => { const y = Y(db); c.strokeStyle = o.grid; c.beginPath(); c.moveTo(L, y); c.lineTo(L + pw, y); c.stroke(); c.fillStyle = o.ink; c.textAlign = 'right'; c.fillText(String(db), L - 6 * s, clamp(y, Tp + 5 * s, Tp + ph - 5 * s)); });
    // hysteresis band
    if (cls < thr - 0.1) { c.fillStyle = o.band; c.fillRect(L, Y(thr), pw, Y(cls) - Y(thr)); }
    // open shading
    c.fillStyle = o.shade;
    let run = -1;
    for (let k = 0; k <= n; k++) {
      const op = k < n ? T.O[(T.i + k) % n] : 0;
      if (op && run < 0) run = k;
      if (!op && run >= 0) { c.fillRect(X(run), Tp, X(k - 1) - X(run) + dx * 0.6, ph); if (o.edge) { c.fillStyle = o.edge; c.fillRect(X(run), Tp, X(k - 1) - X(run) + dx * 0.6, 3 * s); c.fillStyle = o.shade; } run = -1; }
    }
    c.lineJoin = 'round';
    // gate gain
    if (o.gainLine) {
      c.strokeStyle = o.gainLine; c.lineWidth = (o.gainW || 1.4) * s; c.beginPath();
      for (let k = 0; k < n; k++) { const x = X(k), y = Tp + ph * (1 - T.G[(T.i + k) % n]); if (k) { if (o.step) c.lineTo(x, c._py); c.lineTo(x, y); } else c.moveTo(x, y); c._py = y; }
      c.stroke();
    }
    // level trace
    c.beginPath();
    for (let k = 0; k < n; k++) { const x = X(k), y = Y(T.L[(T.i + k) % n]); if (k) { if (o.step) c.lineTo(x, c._py); c.lineTo(x, y); } else c.moveTo(x, y); c._py = y; }
    if (o.fill) { c.save(); c.lineTo(X(n - 1), Tp + ph); c.lineTo(X(0), Tp + ph); c.closePath(); c.fillStyle = o.fill(c, Tp, ph); c.fill(); c.restore(); c.beginPath(); for (let k = 0; k < n; k++) { const x = X(k), y = Y(T.L[(T.i + k) % n]); k ? c.lineTo(x, y) : c.moveTo(x, y); } }
    c.strokeStyle = o.trace; c.lineWidth = (o.traceW || 2) * s; if (o.glow) { c.shadowColor = o.trace; c.shadowBlur = o.glow * s; } c.stroke(); c.shadowBlur = 0;
    if (o.pen) { const y = Y(T.L[(T.i + n - 1) % n]); c.fillStyle = o.pen; c.beginPath(); c.arc(X(n - 1), y, 4 * s, 0, 7); c.fill(); }
    // threshold lines
    const line = (db, col, w, dash) => { const y = Y(db); c.strokeStyle = col; c.lineWidth = w * s; c.setLineDash(dash ? dash.map(v => v * s) : []); c.beginPath(); c.moveTo(L, y); c.lineTo(L + pw + 4 * s, y); c.stroke(); c.setLineDash([]); return y; };
    const yT = line(thr, o.thr, o.thrW || 2), yC = line(cls, o.cls, o.clsW || 1.6, [6, 4]);
    c.textAlign = 'left'; c.font = '700 ' + 9 * s + 'px ' + o.font;
    const lx = L + pw + 8 * s; let ly = yT, ly2 = yC; if (Math.abs(ly2 - ly) < 11 * s) { ly = yT - 6 * s; ly2 = yC + 6 * s; }
    c.fillStyle = o.thr; c.fillText(o.lblT, lx, clamp(ly, Tp + 6 * s, Tp + ph - 6 * s));
    c.fillStyle = o.cls; c.fillText(o.lblC, lx, clamp(ly2, Tp + 6 * s, Tp + ph - 6 * s));
    // grab handles
    [[yT, o.thr], [yC, o.cls]].forEach(([y, col]) => { c.fillStyle = col; c.beginPath(); c.moveTo(L, y - 5 * s); c.lineTo(L + 7 * s, y); c.lineTo(L, y + 5 * s); c.closePath(); c.fill(); });
    cv._g = { L, Tp, pw, ph, s, yT, yC };
  }
  function dragLines(cv, P) {
    let mode = null;
    const pt = e => { const r = cv.getBoundingClientRect(), k = cv.height / r.height; return (e.clientY - r.top) * k; };
    const near = y => { const g = cv._g; if (!g) return null; const dT = Math.abs(y - g.yT), dC = Math.abs(y - g.yC); if (Math.min(dT, dC) > 16 * g.s) return null; return dT <= dC ? 'thr' : 'cls'; };
    const db = y => { const g = cv._g; return -80 * (y - g.Tp) / g.ph; };
    cv.style.touchAction = 'none';
    cv.addEventListener('pointermove', e => { if (!mode) { cv.style.cursor = near(pt(e)) ? 'ns-resize' : 'default'; return; } const d = db(pt(e)); if (mode === 'thr') P.set('threshold', d); else P.set('hysteresis', P.get('threshold') - d); });
    cv.addEventListener('pointerdown', e => { mode = near(pt(e)); if (mode) { cv.setPointerCapture(e.pointerId); e.preventDefault(); } });
    const up = () => { mode = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('dblclick', e => { const m = near(pt(e)); if (m === 'thr') P.set('threshold', P.def('threshold').def); else if (m === 'cls') P.set('hysteresis', 0); });
  }
  const setT = (el, s) => { if (el && el._s !== s) { el._s = s; el.textContent = s; } };
  const dbs = v => (v <= -89 ? '-inf' : (v > 0 ? '+' : '') + v.toFixed(1)) + ' dB';

  /* =====================================================================
     FACE A  WHITELIST — velvet rope, guest list, door that opens
     ===================================================================== */
  

  /* =====================================================================
     FACE B  GATEKEEP — portcullis, winch, chart recorder, throw levers
     ===================================================================== */
  function buildGatekeep(root, P) {
    const OR = '#e8801f', IRON = '#1a1c1e';
    const fader = (id, lab, tag) => `<div class="fc"><div class="fd" data-p="${id}" data-abs="y"><span class="tk"></span><i></i></div><b data-t="${id}"></b><span class="lb">${lab}</span><em>${tag}</em></div>`;
    const bars = Array.from({ length: 8 }, (_, i) => 44 + 12 + i * 20.5);
    root.innerHTML = `<style>
 .b{position:absolute;inset:0;background:linear-gradient(#2a2d30,#181a1c);color:#d7d2c4;font-family:'Roboto Mono',${MONO};overflow:hidden}
 .b:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,#ffffff06 0 1px,transparent 1px 3px);pointer-events:none}
 .b>*{position:absolute}
 .cn{font-family:'Big Shoulders Display','Oswald','Arial Narrow',Impact,sans-serif}
 .pan{background:linear-gradient(#303438,#232629);border:1px solid #0c0d0e;box-shadow:inset 0 1px 0 #ffffff14,inset 0 0 0 3px #1c1e20,0 2px 0 #00000088}
 .rv{position:absolute;width:7px;height:7px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#8a8f94,#3a3e42 70%);box-shadow:0 1px 0 #000}
 header{left:0;top:0;width:880px;height:56px;background:linear-gradient(#34383c,#222528);border-bottom:2px solid #0a0b0c;display:flex;align-items:center;gap:16px;padding:0 14px}
 .hz{width:12px;height:56px;background:repeating-linear-gradient(-45deg,#f2c200 0 8px,#111 8px 16px);margin-left:-14px}
 .wm b{display:block;font:900 34px/1 'Big Shoulders Display','Oswald','Arial Narrow',Impact,sans-serif;letter-spacing:.07em;color:${OR};text-shadow:0 2px 0 #000,0 -1px 0 #ffb86a66}
 .wm small{display:block;font-size:8.5px;letter-spacing:.16em;color:#8c887c;margin-top:3px}
 .sel{display:flex;gap:4px;margin-left:12px}
 .sel button{all:unset;cursor:pointer;width:26px;height:26px;text-align:center;line-height:26px;font:700 11px 'Roboto Mono',monospace;color:#c8c3b4;background:linear-gradient(#3e4246,#26292c);border:1px solid #0a0b0c;border-radius:3px;box-shadow:inset 0 1px 0 #ffffff22,0 2px 0 #000}
 .sel button:active{transform:translateY(2px);box-shadow:none}
 .sel button.on{color:#1a1c1e;background:linear-gradient(#ffb25a,${OR});box-shadow:0 0 12px #e8801f88,0 2px 0 #000}
 .lcd{min-width:158px;height:28px;padding:0 9px;display:flex;align-items:center;justify-content:space-between;gap:8px;font:500 12px 'Roboto Mono',monospace;color:#ffd08a;background:#120d07;border:1px solid #000;box-shadow:inset 0 0 8px #000,0 1px 0 #ffffff18;text-shadow:0 0 6px #e8801f}
 .lcd small{font-size:8px;color:#8a6a3a}
 .sp{flex:1}
 .thr{all:unset;cursor:pointer;display:flex;align-items:center;gap:9px;font:700 10px 'Roboto Mono',monospace;letter-spacing:.1em;color:#a9a597}
 .thr .sl{position:relative;width:56px;height:26px;border-radius:3px;background:#0b0c0d;border:1px solid #000;box-shadow:inset 0 2px 5px #000}
 .thr .sl i{position:absolute;left:3px;top:3px;width:24px;height:18px;border-radius:2px;background:linear-gradient(#8d9399,#4a4f54);box-shadow:0 2px 0 #000,inset 0 1px 0 #fff5;transition:left .12s}
 .thr .sl:after{content:"";position:absolute;right:6px;top:9px;width:8px;height:8px;border-radius:50%;background:#2a2e30}
 .thr.on .sl i{left:27px;background:linear-gradient(#ffb25a,${OR})}.thr.on .sl:after{left:6px;right:auto;background:#5dff8a;box-shadow:0 0 8px #5dff8a}
 .thr.on{color:#f2eadb}
 .sc{left:14px;top:68px;width:262px;height:344px;overflow:hidden}
 .sc svg{position:absolute;left:0;top:0}
 .st{left:14px;top:420px;width:262px;height:90px}
 .st .row{position:absolute;left:12px;right:12px;display:flex;justify-content:space-between;align-items:baseline}
 .st .big{font:900 26px/1 'Big Shoulders Display','Oswald','Arial Narrow',Impact,sans-serif;letter-spacing:.08em;color:${OR}}
 .st small{font-size:8px;letter-spacing:.16em;color:#7e7a6e}
 .st canvas{position:absolute;left:12px;right:12px;top:36px;width:238px;height:44px;background:#0b0c0d;border:1px solid #000;box-shadow:inset 0 0 8px #000}
 .mt{left:286px;top:68px;width:50px;height:238px}
 .mt .col{position:absolute;top:28px;bottom:30px;width:16px;background:#0a0b0c;border:1px solid #000;box-shadow:inset 0 0 6px #000;overflow:hidden}
 .mt .col i{position:absolute;left:0;right:0;bottom:0;height:calc(var(--m,0)*100%);background:linear-gradient(#ff5a3c 0,#ffb13c 18%,#8dd45a 45%,#4aa83a)}
 .mt .col:after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 5px,#0a0b0c 5px 6px)}
 .mt h6{position:absolute;margin:0;top:12px;font-size:8px;letter-spacing:.12em;color:#9a968a;font-weight:500}
 .mt output{position:absolute;bottom:10px;font:500 8.5px 'Roboto Mono',monospace;color:#d7d2c4;letter-spacing:-.02em}
 .rec{left:346px;top:68px;width:520px;height:238px;background:linear-gradient(#2c2f33,#202326);overflow:hidden}
 .rec .hd{position:absolute;left:12px;right:12px;top:7px;height:16px;display:flex;justify-content:space-between;align-items:baseline;font-size:8.5px;letter-spacing:.14em;color:#8c887c}
 .rec .hd b{font:900 17px 'Big Shoulders Display','Oswald','Arial Narrow',Impact,sans-serif;letter-spacing:.1em;color:#d7d2c4}
 .rec .hd em{font-style:normal;color:${OR}}
 .rec canvas{position:absolute;left:10px;top:28px;width:500px;height:176px;border:2px solid #0a0b0c;box-shadow:0 0 0 1px #3b3f43}
 .rec .ft{position:absolute;left:12px;right:12px;bottom:6px;height:22px;display:flex;align-items:center;justify-content:space-between;font-size:9px;letter-spacing:.1em;color:#8c887c}
 .rec .ft b{font:500 12px 'Roboto Mono',monospace;color:#ffd08a;margin-left:6px;text-shadow:0 0 6px #e8801f66}
 .bank{left:286px;top:316px;width:580px;height:194px}
 .bank>h5{position:absolute;margin:0;top:7px;font:900 13px 'Big Shoulders Display','Oswald','Arial Narrow',Impact,sans-serif;letter-spacing:.16em;color:#8c887c}
 .whl{position:absolute;left:14px;top:20px;width:136px;display:flex;flex-direction:column;align-items:center}
 .whl .wh{position:relative;width:108px;height:108px;cursor:ns-resize;border-radius:50%}
 .whl .wh svg{position:absolute;inset:0;transform:rotate(calc(-150deg + var(--v)*300deg))}
 .whl .wh.drag svg{filter:brightness(1.25)}
 .whl .mk{position:absolute;inset:-6px;pointer-events:none}
 .whl b{font:500 14px 'Roboto Mono',monospace;color:#ffd08a;text-shadow:0 0 6px #e8801f66;margin-top:4px}
 .lb{font:700 9px 'Roboto Mono',monospace;letter-spacing:.14em;color:#d7d2c4;text-transform:uppercase}
 .whl em,.fc em,.fl em{font-style:normal;font-size:8px;letter-spacing:.1em;color:#7e7a6e;text-transform:uppercase}
 .fcs{position:absolute;left:158px;top:22px;width:330px;display:flex;justify-content:space-between}
 .fc{width:62px;display:flex;flex-direction:column;align-items:center}
 .fc b{font:500 11px 'Roboto Mono',monospace;color:#ffd08a;margin-top:5px;text-shadow:0 0 6px #e8801f55}
 .fc .lb{margin-top:3px;letter-spacing:.04em;font-size:8.5px}
 .fd{position:relative;width:34px;height:112px;cursor:ns-resize}
 .fd:before{content:"";position:absolute;left:14px;top:0;bottom:0;width:6px;border-radius:3px;background:#07080a;box-shadow:inset 0 1px 4px #000,0 1px 0 #ffffff18}
 .fd .tk{position:absolute;left:0;top:10px;bottom:10px;width:34px;background:repeating-linear-gradient(0deg,#6e6a60 0 1px,transparent 1px 10%);-webkit-mask:linear-gradient(90deg,#000 0 8px,transparent 8px 26px,#000 26px);mask:linear-gradient(90deg,#000 0 8px,transparent 8px 26px,#000 26px)}
 .fd i{position:absolute;left:3px;width:28px;height:22px;bottom:calc(var(--v)*(100% - 22px));border-radius:3px;background:linear-gradient(#a1a7ad,#5d6368 48%,#3c4044 52%,#2b2e31);box-shadow:0 3px 0 #000,inset 0 1px 0 #fff7}
 .fd i:after{content:"";position:absolute;left:3px;right:3px;top:10px;height:2px;background:${OR};box-shadow:0 0 6px ${OR}}
 .fd.drag i{filter:brightness(1.25)}
 .fl{position:absolute;left:496px;top:22px;width:76px;display:flex;flex-direction:column;align-items:center;gap:7px}
 .fl .one{display:flex;flex-direction:column;align-items:center}
 .dial{position:relative;width:44px;height:44px;border-radius:50%;cursor:ns-resize;background:repeating-conic-gradient(#4a4f54 0 5deg,#20232 5deg 10deg);box-shadow:0 3px 0 #000,0 0 0 2px #0b0c0d}
 .dial:before{content:"";position:absolute;inset:6px;border-radius:50%;background:radial-gradient(circle at 35% 28%,#9aa0a6,#53585d 60%,#2c2f33);box-shadow:inset 0 1px 0 #fff6}
 .dial:after{content:"";position:absolute;left:calc(50% - 1.5px);top:3px;width:3px;height:14px;border-radius:1px;background:${OR};box-shadow:0 0 5px ${OR};transform-origin:50% 19px;transform:rotate(calc(-135deg + var(--v)*270deg))}
 .dial.drag{filter:brightness(1.25)}
 .fl .one b{font:500 10.5px 'Roboto Mono',monospace;color:#ffd08a;margin-top:4px}
 .fl .one .lb{margin-top:1px;font-size:8px}
 </style><div class="b">
 <header><div class="hz"></div>
  <div class="wm"><b>GATEKEEP</b><small>WINCH-DRIVEN NOISE GATE</small></div>
  <div class="sel">${plist(P, (p, i) => `<button data-pl="${i}" title="${p.name}">${i + 1}</button>`)}</div>
  <div class="lcd"><span data-pname></span><small>PRESET <span data-pidx></span></small></div>
  <div class="sp"></div>
  <button class="thr" data-byp><span id="bt">GATE ENGAGED</span><span class="sl"><i></i></span></button>
 </header>
 <div class="sc pan"><svg width="262" height="344" viewBox="0 0 262 344">
  <defs><linearGradient id="yd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdc9a"/><stop offset=".6" stop-color="#e8801f"/><stop offset="1" stop-color="#5a2a0c"/></linearGradient>
  <linearGradient id="st" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2e3236"/><stop offset=".5" stop-color="#3c4146"/><stop offset="1" stop-color="#2a2d30"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b1816"/><stop offset=".4" stop-color="#4b4540"/><stop offset="1" stop-color="#1b1816"/></linearGradient>
  <pattern id="hz" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="11" height="22" fill="#f2c200"/><rect x="11" width="11" height="22" fill="#111"/></pattern><clipPath id="op"><path d="M44 316V140A86 86 0 0 1 216 140V316Z"/></clipPath></defs>
  <rect width="262" height="344" fill="url(#st)"/>
  <g stroke="#1a1c1e" stroke-width="1.2" opacity=".8">${Array.from({ length: 14 }, (_, r) => `<path d="M0 ${r * 26 + 4}H262"/>`).join('')}${Array.from({ length: 14 }, (_, r) => Array.from({ length: 6 }, (_, c) => `<path d="M${c * 52 + (r % 2) * 26} ${r * 26 + 4}v26"/>`).join('')).join('')}</g>
  <g clip-path="url(#op)"><rect x="40" y="40" width="180" height="280" fill="url(#yd)" id="lt" opacity=".15"/>
   <path d="M44 316V270L70 250L96 262L130 236L164 258L196 244L216 262V316Z" fill="#17120d" opacity=".85"/>
   <g id="gt">${bars.map(x => `<rect x="${x - 4}" y="-300" width="8" height="590" fill="url(#br)"/><path d="M${x - 4} 290L${x} 306L${x + 4} 290Z" fill="#2c2825"/>`).join('')}
    ${[-60, 20, 100, 180, 250].map(y => `<rect x="40" y="${y}" width="180" height="9" fill="url(#br)"/>`).join('')}<rect x="40" y="262" width="180" height="14" fill="url(#hz)"/>
    </g></g>
  
  <path d="M0 0H262V344H0Z M44 316V140A86 86 0 0 1 216 140V316Z" fill="url(#st)" fill-rule="evenodd"/>
  <path d="M44 316V140A86 86 0 0 1 216 140V316" fill="none" stroke="#101214" stroke-width="5"/><path d="M38 316V140A92 92 0 0 1 222 140V316" fill="none" stroke="#4d5358" stroke-width="2"/>
  <g stroke="#17191b" stroke-width="1.5" fill="none" opacity=".9">${Array.from({ length: 9 }, (_, i) => { const a = Math.PI + (i / 8) * Math.PI; return `<path d="M${130 + 92 * Math.cos(a)} ${140 + 92 * Math.sin(a)}L${130 + 112 * Math.cos(a)} ${140 + 112 * Math.sin(a)}"/>`; }).join('')}</g>
  <rect x="0" y="316" width="262" height="28" fill="#1a1c1e"/><rect x="0" y="322" width="262" height="22" fill="url(#hz)"/>
  <rect x="0" y="314" width="262" height="6" fill="#0d0e0f"/>
  <g id="rule" font-family="Roboto Mono,monospace" font-size="7" fill="#7e7a6e">${[0, 25, 50, 75, 100].map(p => `<path d="M236 ${300 - p * 1.7}h8" stroke="#8c887c"/><text x="246" y="${302 - p * 1.7}">${p}</text>`).join('')}</g>
  <path id="lbar" d="M232 300V300" stroke="${OR}" stroke-width="3"/>
  <rect x="0" y="0" width="262" height="40" fill="#25282b"/><path d="M0 40H262" stroke="#0a0b0c" stroke-width="2"/>
  <g id="cwl"><rect x="8" y="0" width="20" height="30" fill="#3a3e42" stroke="#0a0b0c"/><path d="M18 0V-40" stroke="#6e6a60" stroke-width="3" stroke-dasharray="4 3"/><text x="18" y="19" font-size="8" fill="#ffd08a" text-anchor="middle" font-family="Roboto Mono,monospace">kg</text></g>
  <g id="cwr"><rect x="234" y="0" width="20" height="30" fill="#3a3e42" stroke="#0a0b0c"/><path d="M244 0V-40" stroke="#6e6a60" stroke-width="3" stroke-dasharray="4 3"/><text x="244" y="19" font-size="8" fill="#ffd08a" text-anchor="middle" font-family="Roboto Mono,monospace">kg</text></g>
  <g id="pl1"><circle cx="18" cy="22" r="11" fill="#202326" stroke="#6e6a60" stroke-width="2"/><path d="M18 11V33M7 22H29" stroke="#6e6a60" stroke-width="2"/></g>
  <g id="pl2"><circle cx="244" cy="22" r="11" fill="#202326" stroke="#6e6a60" stroke-width="2"/><path d="M244 11V33M233 22H255" stroke="#6e6a60" stroke-width="2"/></g>
  <g id="dr"><circle cx="131" cy="22" r="16" fill="#2c3034" stroke="${OR}" stroke-width="3"/><path d="M131 8V36M117 22H145M121 12L141 32M141 12L121 32" stroke="${OR}" stroke-width="2.5"/><circle cx="131" cy="22" r="4" fill="#0a0b0c"/></g>
  <path d="M34 22H115M147 22H228" stroke="#6e6a60" stroke-width="3" stroke-dasharray="5 3" id="belt"/>
  <circle cx="8" cy="8" r="2.5" fill="#6e6a60"/><circle cx="254" cy="8" r="2.5" fill="#6e6a60"/><circle cx="8" cy="332" r="2.5" fill="#6e6a60"/><circle cx="254" cy="332" r="2.5" fill="#6e6a60"/>
 </svg></div>
 <div class="st pan"><div class="row" style="top:9px"><span class="big" id="gs">LOWERED</span><small id="gl">LIFT 0%</small></div><canvas id="sc" width="476" height="88"></canvas></div>
 <div class="mt pan"><h6 style="left:4px">IN</h6><h6 style="left:30px">OUT</h6><div class="col" style="left:6px"><i id="mi"></i></div><div class="col" style="left:28px"><i id="mo"></i></div><output id="vi" style="left:0;font-size:7px"></output><output id="vo" style="left:25px;font-size:7px"></output></div>
 <div class="rec pan"><div class="hd"><b>LEVEL RECORDER</b><span>CHART 6 s &middot; <em>DRAG THE RED LINES</em></span></div><canvas id="tl" width="1000" height="352"></canvas>
  <div class="ft"><span>LEVEL<b id="rl"></b></span><span>LIFT<b id="rg"></b></span><span>GAIN<b id="rd"></b></span><span>STATE<b id="rs"></b></span></div></div>
 <div class="bank pan"><h5 style="left:14px">RAISE LEVEL</h5><h5 style="left:158px">WINCH TIMING &amp; DEPTH</h5><h5 style="left:496px">SENSE</h5>
  <div class="whl"><div class="wh" data-p="threshold"><svg viewBox="0 0 108 108"><circle cx="54" cy="54" r="46" fill="none" stroke="#141617" stroke-width="0"/><circle cx="54" cy="54" r="44" fill="none" stroke="#6e747a" stroke-width="9"/><circle cx="54" cy="54" r="44" fill="none" stroke="#a7adb3" stroke-width="2" stroke-dasharray="3 5" opacity=".6"/>${[0, 60, 120, 180, 240, 300].map(a => `<path d="M54 54L${54 + 42 * Math.sin(a * Math.PI / 180)} ${54 - 42 * Math.cos(a * Math.PI / 180)}" stroke="#555b61" stroke-width="5" stroke-linecap="round"/>`).join('')}<circle cx="54" cy="54" r="12" fill="#7d838a" stroke="#202326" stroke-width="2"/><circle cx="54" cy="54" r="4" fill="#202326"/><circle cx="54" cy="12" r="5" fill="${OR}"/></svg></div><b data-t="threshold"></b><span class="lb">Threshold</span><em>hand wheel</em></div>
  <div class="fcs">${fader('attack', 'Attack', 'lift speed')}${fader('hold', 'Hold', 'dwell up')}${fader('release', 'Release', 'drop speed')}${fader('hysteresis', 'Hysteresis', 'drop margin')}${fader('range', 'Range', 'stays open')}</div>
  <div class="fl"><div class="one"><div class="dial" data-p="detHp"></div><b data-t="detHp"></b><span class="lb">Sense HP</span></div><div class="one"><div class="dial" data-p="detLp"></div><b data-t="detLp"></b><span class="lb">Sense LP</span></div></div></div>
 </div>`;
    wire(root, P);
    const $ = s => root.querySelector(s);
    root.querySelectorAll('.pan').forEach(p => { [[4, 4], [null, 4], [4, null], [null, null]].forEach(([l, t], i) => { const r = document.createElement('i'); r.className = 'rv'; r.style.cssText = (l == null ? 'right:4px;' : 'left:4px;') + (t == null ? 'bottom:4px' : 'top:4px'); p.appendChild(r); }); });
    P.sub('__bypass', on => { $('#bt').textContent = on ? 'GATE ENGAGED' : 'GATE BYPASSED'; });
    const T = track(P);
    const tl = $('#tl'); dragLines(tl, P);
    // hatch pattern for the open shading
    const hp = document.createElement('canvas'); hp.width = hp.height = 16; { const x = hp.getContext('2d'); x.strokeStyle = '#e8801f77'; x.lineWidth = 2; x.beginPath(); x.moveTo(-2, 18); x.lineTo(18, -2); x.moveTo(-2, 2); x.lineTo(2, -2); x.moveTo(14, 18); x.lineTo(18, 14); x.stroke(); }
    const hs = { font: MONO, ink: '#6b6a60', grid: '#9c917622', grid2: '#9c91762e', band: '#b8442a22', trace: '#101214', traceW: 2.4, gainLine: '#2c5fa8', gainW: 1.6, thr: '#c8321f', cls: '#a8321f', thrW: 2.4, lblT: 'RAISE', lblC: 'DROP', left: 28, right: 52, pen: '#c8321f', edge: '#e8801f',
      bg: (c, W, H) => { c.fillStyle = '#e6dcc0'; c.fillRect(0, 0, W, H); c.fillStyle = '#d6cba9'; c.fillRect(0, 0, 56, H); const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffffff22'); g.addColorStop(1, '#00000018'); c.fillStyle = g; c.fillRect(0, 0, W, H); } };
    hs.shade = c => c; // replaced below
    P.scope($('#sc'), { tap: 'out', color: '#ffb25a', bg: '#0b0c0d', grid: '#e8801f18', width: 2.5, glow: 5, gain: 1.8 });
    const gt = $('#gt'), lt = $('#lt'), dr = $('#dr'), cwl = $('#cwl'), cwr = $('#cwr'), belt = $('#belt'), lbar = $('#lbar');
    let rot = 0, lastT = 0;
    P.raf(t => {
      const dt = clamp((t - lastT) / 1000 || 0.016, 0, 0.1); lastT = t;
      const c0 = tl.getContext('2d'); hs.shade = c0.createPattern(hp, 'repeat');
      drawTL(tl, T, P, hs);
      const g = T.g, lift = g * 232;
      gt.setAttribute('transform', `translate(0 ${(-lift).toFixed(1)})`); lt.setAttribute('opacity', (0.12 + 0.88 * g).toFixed(3));
      rot += T.dir * dt * 14; dr.setAttribute('transform', `rotate(${(g * 540).toFixed(1)} 131 22)`);
      const cy = 52 + g * 196; cwl.setAttribute('transform', `translate(0 ${cy.toFixed(1)})`); cwr.setAttribute('transform', `translate(0 ${cy.toFixed(1)})`);
      cwl.querySelector('path').setAttribute('d', `M18 0V${(-cy + 24).toFixed(1)}`); cwr.querySelector('path').setAttribute('d', `M244 0V${(-cy + 24).toFixed(1)}`);
      belt.setAttribute('stroke-dashoffset', (g * 160).toFixed(1));
      lbar.setAttribute('d', `M232 300V${(300 - g * 170).toFixed(1)}`);
      $('#mi').style.setProperty('--m', mval(T.inDb)); $('#mo').style.setProperty('--m', mval(T.outDb));
      setT($('#vi'), Math.round(T.inDb) + ''); setT($('#vo'), Math.round(T.outDb) + '');
      setT($('#rl'), dbs(T.lvl)); setT($('#rg'), Math.round(g * 100) + '%'); setT($('#rd'), dbs(gdb(g)));
      const mov = Math.abs(T.dir) > 0.8, state = !P.bypass.get() ? 'BYPASS' : g > 0.92 ? 'RAISED' : g < 0.08 ? 'LOWERED' : (T.dir >= 0 ? 'RAISING' : 'DROPPING');
      setT($('#rs'), state); setT($('#gs'), !P.bypass.get() ? 'BYPASSED' : state); setT($('#gl'), 'LIFT ' + Math.round(g * 100) + '%');
    });
  }

  /* =====================================================================
     FACE C  PERMISSION — keycard reader, padlock, access log
     ===================================================================== */
  

  Kit.register('gate', {
    fonts: 'family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500;1,600;1,700&family=Jost:wght@400;500&family=Big+Shoulders+Display:wght@700;900&family=Roboto+Mono:wght@400;500;700&family=Inter:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700',
    w: 960, h: 560,
    labels: { detHp: 'Detector HP', detLp: 'Detector LP' },
    fmts: {
      threshold: v => v.toFixed(0) + ' dB', range: v => (v <= -79.5 ? '-inf dB' : v.toFixed(0) + ' dB'), hysteresis: v => v.toFixed(1) + ' dB',
      attack: ms, release: ms, hold: v => (v <= 0 ? 'off' : ms(v)),
      detHp: v => (v <= 20.5 ? 'off' : v >= 1000 ? (v / 1000).toFixed(2).replace(/0$/, '') + ' kHz' : Math.round(v) + ' Hz'),
      detLp: v => (v >= 19999 ? 'off' : v >= 1000 ? (v / 1000).toFixed(1).replace(/\.0$/, '') + ' kHz' : Math.round(v) + ' Hz')
    },
    presets,
    faces: [
      undefined,
      { key: 'B', name: 'Gatekeep', accent: '#e8801f', w: 880, h: 520, build: buildGatekeep },
      undefined
    ].filter(Boolean)
  });
})();
