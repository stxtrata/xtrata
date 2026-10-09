import { Kit } from "./runtime.js";
/* lantern.js - jiLANTERN "Harmonic Bloom": glowing struck metal. Three faces: Lightnode / Beacon / Proof */
(function () {
  const hz = v => v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 1 : 2) + ' kHz' : Math.round(v) + ' Hz';
  const sec = v => v < 1 ? Math.round(v * 1000) + ' ms' : v.toFixed(2) + ' s';
  const pct = v => Math.round(v * 100) + '%';
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const NOTES = ['C', 'C\u266F', 'D', 'D\u266F', 'E', 'F', 'F\u266F', 'G', 'G\u266F', 'A', 'A\u266F', 'B'];

  const params = [
    { id: 'material', label: 'Material', options: ['Glass', 'Reed', 'Prism'], def: 0 },
    { id: 'strike', label: 'Strike', min: 0, max: 1, def: 0.58, step: 0.01, fmt: pct },
    { id: 'tension', label: 'Tension', min: 0, max: 1, def: 0.36, step: 0.01, fmt: pct },
    { id: 'cutoff', label: 'Brightness', min: 180, max: 16000, def: 6400, step: 10, log: true, fmt: hz },
    { id: 'touch', label: 'Velocity \u2192 Brightness', min: 0, max: 1, def: 0.35, step: 0.01, fmt: pct },
    { id: 'bloom', label: 'Bloom Time', min: 0.04, max: 4, def: 1.15, step: 0.01, fmt: sec },
    { id: 'halo', label: 'Halo', min: 0, max: 1, def: 0.64, step: 0.01, fmt: pct },
    { id: 'drift', label: 'Drift', min: 0, max: 1, def: 0.24, step: 0.01, fmt: pct },
    { id: 'width', label: 'Stereo Width', min: 0, max: 1, def: 0.78, step: 0.01, fmt: pct },
    { id: 'space', label: 'Space', min: 0, max: 1, def: 0.32, step: 0.01, fmt: pct },
    { id: 'attack', label: 'Attack', min: 0.002, max: 3, def: 0.008, step: 0.002, log: true, fmt: sec },
    { id: 'decay', label: 'Decay', min: 0.01, max: 3, def: 0.8, step: 0.01, fmt: sec },
    { id: 'sustain', label: 'Sustain', min: 0, max: 1, def: 0.68, step: 0.01, fmt: pct },
    { id: 'release', label: 'Release', min: 0.02, max: 6, def: 1.9, step: 0.01, fmt: sec },
    { id: 'level', label: 'Output', min: 0, max: 1.5, def: 0.85, step: 0.01, fmt: v => Math.round(v * 100) + '%' }
  ];
  const presets = [
    { name: 'Amber Glass', values: {} },
    { name: 'Paper Sun', values: { material: 1, strike: 0.18, tension: 0.21, cutoff: 3700, bloom: 1.75, halo: 0.9, drift: 0.37, width: 0.74, space: 0.36, attack: 0.38, decay: 1.4, sustain: 0.82, release: 3.1 } },
    { name: 'Rain in Reverse', values: { material: 2, strike: 0.08, tension: 0.83, bloom: 2.75, halo: 0.94, cutoff: 10500, drift: 0.43, width: 1, space: 0.64, attack: 0.08, decay: 2.2, sustain: 0.9, release: 3.8 } },
    { name: 'Midnight Bells', values: { level: 1.2, strike: 0.94, tension: 0.72, cutoff: 4100, bloom: 1.4, halo: 0.24, drift: 0.08, width: 0.92, space: 0.68, attack: 0.004, decay: 1.8, sustain: 0.22, release: 2.8 } },
    { name: 'Orbit Seeds', values: { level: 1.3, material: 2, strike: 0.88, tension: 0.9, bloom: 0.17, halo: 0.48, cutoff: 12000, drift: 0.18, width: 0.96, space: 0.38, attack: 0.002, decay: 0.26, sustain: 0.18, release: 0.62 } },
    { name: 'Unstruck Light', values: { strike: 0, tension: 0.68, bloom: 3.2, halo: 1, cutoff: 8500, drift: 0.65, width: 1, space: 0.58, attack: 0.2, decay: 2.1, sustain: 0.95, release: 4.6 } },
    { name: 'Low Embers', values: { material: 1, strike: 0.86, tension: 0.15, bloom: 0.12, halo: 0.58, cutoff: 1350, drift: 0.06, width: 0.15, space: 0.06, attack: 0.004, decay: 0.3, sustain: 0.48, release: 0.48 } },
    { name: 'Prism Weather', values: { material: 2, strike: 0.72, tension: 1, bloom: 1.9, halo: 0.78, cutoff: 11500, drift: 0.9, width: 1, space: 0.7, attack: 0.006, decay: 0.9, sustain: 0.64, release: 3.2 } }
  ];

  const BASE = '[data-plist]{display:none}[data-plist].open{display:grid}button{cursor:pointer;font-family:inherit;border:0;background:none;color:inherit;padding:0}canvas{display:block}';

  /* wires generic data-attributes: data-b (bind), data-abs/ax/inv, data-t (text), data-set="id:val", preset controls */
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
    const plist = root.querySelector('[data-plist]');
    if (plist) P.presets.forEach((p, i) => {
      const b = document.createElement('button'); b.dataset.pi = i; b.innerHTML = '<span>' + String(i + 1).padStart(2, '0') + '</span>' + p.name;
      b.addEventListener('click', () => { P.loadPreset(i); plist.classList.remove('open'); }); plist.appendChild(b);
    });
    root.querySelectorAll('[data-prev]').forEach(e => e.addEventListener('click', () => P.loadPreset((cur - 1 + n) % n)));
    root.querySelectorAll('[data-next]').forEach(e => e.addEventListener('click', () => P.loadPreset((cur + 1) % n)));
    root.querySelectorAll('[data-tgl]').forEach(e => e.addEventListener('click', () => plist && plist.classList.toggle('open')));
    P.onPreset((i, name) => {
      cur = i;
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = name || 'Init'; });
      root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = String(Math.max(i, 0) + 1).padStart(2, '0'); });
      root.querySelectorAll('[data-pn]').forEach(e => { e.textContent = String(n).padStart(2, '0'); });
      if (plist) plist.querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.pi === i));
    });
  }

  /* ADSR plot geometry. returns {line, fill, pts:[[x,y]...]} in a W x H box. time axis is sqrt-scaled */
  function envGeom(P, W, H, pad) {
    pad = pad == null ? 6 : pad;
    const a = Math.sqrt(P.get('attack')), d = Math.sqrt(P.get('decay')), r = Math.sqrt(P.get('release')), s = P.get('sustain');
    const hold = Math.max(0.35, (a + d + r) * 0.3), tot = a + d + hold + r;
    const iw = W - pad * 2, ih = H - pad * 2, x0 = pad, yb = H - pad, yp = pad, ys = yb - s * ih;
    const x1 = x0 + iw * a / tot, x2 = x1 + iw * d / tot, x3 = x2 + iw * hold / tot, x4 = x3 + iw * r / tot;
    const line = 'M' + x0 + ' ' + yb + 'L' + x1 + ' ' + yp + 'Q' + (x1 + (x2 - x1) * 0.35) + ' ' + ys + ' ' + x2 + ' ' + ys + 'L' + x3 + ' ' + ys + 'Q' + (x3 + (x4 - x3) * 0.3) + ' ' + yb + ' ' + x4 + ' ' + yb;
    return { line, fill: line + 'L' + x4 + ' ' + yb + 'L' + x0 + ' ' + yb + 'Z', pts: [[x1, yp], [x2, ys], [x3, ys], [x4, yb]] };
  }
  function bindEnv(P, pathLine, pathFill, W, H, pad, dots) {
    const upd = () => {
      const g = envGeom(P, W, H, pad);
      if (pathLine) pathLine.setAttribute('d', g.line); if (pathFill) pathFill.setAttribute('d', g.fill);
      if (dots) dots.forEach((c, i) => { c.setAttribute('cx', g.pts[i][0]); c.setAttribute('cy', g.pts[i][1]); });
    };
    ['attack', 'decay', 'sustain', 'release'].forEach(id => P.sub(id, upd));
  }
  function setupCanvas(cv, w, h) { cv.width = w * 2; cv.height = h * 2; cv.style.width = w + 'px'; cv.style.height = h + 'px'; const c = cv.getContext('2d'); c.setTransform(2, 0, 0, 2, 0, 0); return c; }
  const lab = (P, id) => P.def(id).label;

  /* ============================================================ A  LIGHTNODE */
  const CSS_A = `
.la{position:absolute;inset:0;background:radial-gradient(120% 90% at 28% 0%,#2b1a06 0%,#140e07 46%,#0b0703 100%);color:#f6dca4;font-family:Sora,'Segoe UI',system-ui,sans-serif;font-size:11px;overflow:hidden}
.la:before{content:"";position:absolute;inset:7px;border:1px solid #4a341066;pointer-events:none}
.la .hd{position:absolute;left:24px;right:24px;top:12px;height:42px;display:flex;align-items:center;gap:16px}
.la .logo{display:flex;align-items:center;gap:10px;font-size:27px;font-weight:700;letter-spacing:-.025em;color:#ffb347;text-shadow:0 0 18px #ffb34788}
.la .logo svg{width:30px;height:30px}
.la .stat{flex:1;font-size:9.5px;letter-spacing:.18em;color:#9a6a1f;white-space:nowrap}
.la .stat b{color:#ffb347;font-weight:600}
.la .pre{display:flex;align-items:center;gap:6px}
.la .pre button{width:26px;height:32px;border:1px solid #6b4a14;color:#ffb347;font-size:15px;line-height:1;background:#1c1308}
.la .pre button:hover{background:#2c1d09;box-shadow:0 0 10px #ffb34755}
.la .pn{width:184px;height:32px;border:1px solid #6b4a14;background:#0e0904;padding:3px 9px;display:flex;flex-direction:column;justify-content:center}
.la .pn small{font-size:7.5px;letter-spacing:.2em;color:#8a5f1b}
.la .pn b{font-size:12px;font-weight:600;color:#ffd27a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.la [data-plist]{position:absolute;right:24px;top:52px;z-index:20;grid-template-columns:1fr 1fr;width:330px;background:#120c05f2;border:1px solid #8a5f1b;box-shadow:0 12px 40px #000c}
.la [data-plist] button{padding:7px 10px;text-align:left;font-size:11px;color:#e8c682;border-bottom:1px solid #2a1c0a}
.la [data-plist] button span{color:#7a5517;margin-right:8px;font-size:9px}
.la [data-plist] button:hover,.la [data-plist] button.on{background:#2a1b08;color:#ffd27a}
.la .map{position:absolute;left:24px;top:64px;width:544px;height:258px;border:1px solid #4a3410;background:#0d0905}
.la .map .cap{position:absolute;left:10px;top:7px;font-size:8px;letter-spacing:.2em;color:#7a5517;pointer-events:none}
.la .map .cap2{position:absolute;right:10px;top:7px;font-size:8px;letter-spacing:.2em;color:#7a5517;pointer-events:none}
.la .map .log{position:absolute;left:10px;bottom:6px;font-size:8.5px;line-height:1.5;color:#a97a2c;pointer-events:none;white-space:pre}
.la .envp{position:absolute;left:24px;top:332px;width:544px;height:116px;border:1px solid #3a2a0e;background:#0f0a05}
.la .envp svg{position:absolute;left:10px;top:12px}
.la .envp .t{position:absolute;left:10px;top:3px;font-size:8px;letter-spacing:.2em;color:#7a5517}
.la .envp .adsr{position:absolute;left:268px;top:8px;width:266px}
.la .ctl{position:absolute;left:588px;top:64px;width:348px}
.la .chips{display:flex;gap:6px;height:30px;margin-bottom:8px}
.la .chip{flex:1;border:1px solid #5a3f12;background:#150f06;color:#b88a3a;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:8px}
.la .chip svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6}
.la .chip.on{color:#1a1004;background:#ffb347;border-color:#ffb347;box-shadow:0 0 16px #ffb34766}
.la .r{display:grid;grid-template-columns:112px 1fr 56px;align-items:center;height:27.5px;gap:10px}
.la .r .l{color:#c9a15a;font-size:10px;letter-spacing:.02em;white-space:nowrap}
.la .r .v{color:#ffd27a;font-size:10.5px;text-align:right;font-variant-numeric:tabular-nums}
.la .sl{position:relative;height:22px;cursor:ew-resize}
.la .sl:before{content:"";position:absolute;left:0;right:0;top:50%;height:2px;margin-top:-1px;background:#4a3410}
.la .sl i{position:absolute;left:0;top:50%;height:2px;margin-top:-1px;width:calc(var(--v,0)*100%);background:linear-gradient(90deg,#9a5a10,#ffb347);box-shadow:0 0 8px #ffb347aa}
.la .sl b{position:absolute;top:50%;left:calc(var(--v,0)*100%);width:11px;height:11px;margin:-5.5px 0 0 -5.5px;border-radius:50%;background:#ffd27a;box-shadow:0 0 0 3px #ffb34733,0 0 12px 2px #ffb347}
.la .sl.drag b,.la .sl:hover b{box-shadow:0 0 0 5px #ffb34744,0 0 16px 4px #ffb347}
.la .out{margin-top:6px;padding-top:8px;border-top:1px solid #3a2a0e}
.la .out .sl i{background:linear-gradient(90deg,#b5701a,#ffe2a0)}
.la .meter{height:5px;margin:6px 0 0 122px;background:#241808;position:relative}
.la .meter i{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,#b5701a,#ffb347,#fff0c8)}
.la .kbx{position:absolute;left:24px;top:456px;width:912px;height:80px;border:1px solid #4a3410;background:#0a0603;padding:0 0 0 0}
.la .kbx .kb-w{background:linear-gradient(#2a1c0a,#1a1207);border:1px solid #0a0603;border-radius:0 0 3px 3px;transition:background .08s}
.la .kbx .kb-w.on{background:linear-gradient(#ffd27a,#ffb347);box-shadow:inset 0 -10px 18px #fff3,0 0 22px #ffb347aa}
.la .kbx .kb-b{background:#050302;border:1px solid #3a2a0e;border-top:0}
.la .kbx .kb-b.on{background:#ffb347;box-shadow:0 0 16px #ffb347}
.la .ft{position:absolute;left:24px;right:24px;bottom:9px;font-size:8px;letter-spacing:.2em;color:#6d4d17;display:flex;justify-content:space-between}
`;

  function buildA(root, P) {
    const sl = id => '<div class="r"><span class="l">' + lab(P, id) + '</span><div class="sl" data-b="' + id + '" data-abs="x"><i></i><b></b></div><span class="v" data-t="' + id + '"></span></div>';
    root.innerHTML = '<style>' + BASE + CSS_A + '</style><div class="la">' +
      '<div class="hd"><div class="logo"><svg viewBox="0 0 30 30"><g stroke="#ffb347" stroke-width="1.4" opacity=".8"><path d="M15 15L4 6M15 15L26 8M15 15L5 24M15 15L25 23M4 6L5 24M26 8L25 23"/></g><circle cx="15" cy="15" r="7" fill="#ffb34733"/><circle cx="15" cy="15" r="4.2" fill="#ffb347"/><g fill="#ffd27a"><circle cx="4" cy="6" r="2.2"/><circle cx="26" cy="8" r="2.6"/><circle cx="5" cy="24" r="2"/><circle cx="25" cy="23" r="2.4"/></g></svg>Lightnode</div>' +
      '<div class="stat"><b data-ch>0</b> CHANNELS OPEN &nbsp;/&nbsp; 12 PEERS &nbsp;/&nbsp; HARMONIC BLOOM</div>' +
      '<div class="pre"><button data-prev>\u2039</button><div class="pn"><small>PEER SET <span data-pidx></span>/<span data-pn></span></small><b data-pname></b></div><button data-next>\u203A</button><button data-tgl style="font-size:12px">\u2261</button></div></div>' +
      '<div data-plist></div>' +
      '<div class="map"><canvas></canvas><div class="cap">MESH VIEW \u00B7 KEYS ARE PEERS</div><div class="cap2">ECHO \u00D7<span data-echo>4</span></div><div class="log" data-log></div></div>' +
      '<div class="envp"><div class="t">ENVELOPE \u00B7 PULSE LIFETIME</div><svg width="250" height="96" viewBox="0 0 250 96"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb347" stop-opacity=".5"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></linearGradient></defs><path class="f" fill="url(#lg)"/><path class="l" fill="none" stroke="#ffb347" stroke-width="1.8" style="filter:drop-shadow(0 0 4px #ffb347)"/><g fill="#ffd27a"><circle r="3.2"/><circle r="3.2"/><circle r="3.2"/><circle r="3.2"/></g></svg>' +
      '<div class="adsr">' + ['attack', 'decay', 'sustain', 'release'].map(sl).join('') + '</div></div>' +
      '<div class="ctl"><div class="chips">' +
      '<button class="chip" data-set="material:0"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="6"/></svg>Glass</button>' +
      '<button class="chip" data-set="material:1"><svg viewBox="0 0 20 20"><polygon points="10,3 17,10 10,17 3,10"/></svg>Reed</button>' +
      '<button class="chip" data-set="material:2"><svg viewBox="0 0 20 20"><polygon points="10,3 16,6.5 16,13.5 10,17 4,13.5 4,6.5"/></svg>Prism</button></div>' +
      ['strike', 'tension', 'cutoff', 'touch', 'bloom', 'halo', 'drift', 'width', 'space'].map(sl).join('') +
      '<div class="out">' + sl('level') + '<div class="meter"><i></i></div></div></div>' +
      '<div class="kbx"></div>' +
      '<div class="ft"><span>NO CENTRAL SERVER \u00B7 EVERY NOTE IS A PEER</span><span>STRUCK METAL, GOSSIPED ALONG THE CHANNELS</span></div></div>';
    wire(root, P);
    const q = s => root.querySelector(s);
    P.keyboard(q('.kbx'), { from: 48, octaves: 3 });
    // envelope
    const es = q('.envp svg'); bindEnv(P, es.querySelector('.l'), es.querySelector('.f'), 250, 96, 8, [...es.querySelectorAll('circle')]);
    P.sub('space', v => { q('[data-echo]').textContent = v > 0.04 ? 1 + Math.round(v * 3) : 0; });

    // mesh
    const W = 544, H = 258, cv = q('.map canvas'), c = setupCanvas(cv, W, H);
    const NP = [[.1, .24], [.28, .1], [.5, .22], [.72, .1], [.9, .26], [.18, .52], [.4, .46], [.62, .54], [.84, .56], [.12, .8], [.45, .84], [.76, .82]];
    const NE = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 6], [2, 6], [2, 7], [3, 7], [4, 8], [5, 6], [6, 7], [7, 8], [5, 9], [6, 10], [7, 11], [8, 11], [9, 10], [10, 11], [1, 5], [5, 10], [4, 3]];
    const adj = NP.map(() => []); NE.forEach((e, k) => { adj[e[0]].push(k); adj[e[1]].push(k); });
    const env = new Array(12).fill(0), flash = new Array(12).fill(0), ph = new Array(12).fill(1), held = new Array(12).fill(0), peak = new Array(12).fill(0);
    const pulses = [], rings = [], echoes = [], logL = []; let now = 0, last = 0, amb = 1.2, frame = 0;
    const logEl = q('[data-log]'), chEl = q('[data-ch]');
    function pushLog(s) { logL.push(s); if (logL.length > 3) logL.shift(); logEl.textContent = logL.join('\n'); }
    function fire(i, amp, gen) { adj[i].forEach(e => pulses.push({ e, from: i, t: 0, amp, gen: gen || 0 })); }
    function trigger(i, vel, gate) {
      const touch = P.get('touch'), amp = clamp((1 - touch) * 0.75 + touch * vel, 0.2, 1);
      if (gate) { held[i]++; peak[i] = amp; ph[i] = 0; }
      flash[i] = Math.max(flash[i], amp); rings.push({ i, t: 0, amp: amp * (0.35 + P.get('strike') * 0.65) });
      fire(i, amp, 0);
      const sp = P.get('space'); if (sp > 0.04) for (let k = 1; k <= 1 + Math.round(sp * 3); k++) echoes.push({ at: now + k * 0.34, i, amp: amp * sp * Math.pow(0.66, k - 1) });
      pushLog('NODE ' + NOTES[i] + ' lit  \u00B7  ' + adj[i].length + ' peers notified  \u00B7  v' + vel.toFixed(2));
    }
    P.onNote(ev => { const i = ev.midi % 12; if (ev.type === 'on') trigger(i, ev.vel, true); else held[i] = Math.max(0, held[i] - 1); });
    pushLog('mesh online \u00B7 awaiting first block');
    const shape = (x, y, r, m) => {
      c.beginPath();
      if (m === 0) c.arc(x, y, r, 0, 6.2832);
      else if (m === 1) { c.moveTo(x, y - r * 1.2); c.lineTo(x + r * 1.1, y); c.lineTo(x, y + r * 1.2); c.lineTo(x - r * 1.1, y); c.closePath(); }
      else { for (let k = 0; k < 6; k++) { const a = k * 1.0472 - 1.5708; k ? c.lineTo(x + Math.cos(a) * r * 1.1, y + Math.sin(a) * r * 1.1) : c.moveTo(x + Math.cos(a) * r * 1.1, y + Math.sin(a) * r * 1.1); } c.closePath(); }
    };
    let pos = NP.map(() => [0, 0]);
    function place(t) {
      const dr = P.get('drift'), wd = 0.4 + 0.6 * P.get('width');
      NP.forEach((p, i) => { pos[i][0] = W * (0.5 + (p[0] - 0.5) * wd * 0.94) + dr * 16 * Math.sin(t * 0.0005 + i * 1.7); pos[i][1] = H * (0.08 + p[1] * 0.86) + dr * 12 * Math.cos(t * 0.00043 + i * 2.3); });
    }
    function bez(e, ten, k) { // control point for edge k
      const a = pos[e[0]], b = pos[e[1]], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, s = (k % 2 ? 1 : -1) * (1 - ten) * len * 0.3;
      return [mx - dy / len * s, my + dx / len * s];
    }
    P.raf(t => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t; now += dt; frame++;
      const att = P.get('attack'), dec = P.get('decay'), sus = P.get('sustain'), rel = P.get('release'), ten = P.get('tension'), halo = P.get('halo'), strike = P.get('strike'), mat = P.get('material');
      const cn = P.norm('cutoff'), col = [Math.round(lerp(255, 255, cn)), Math.round(lerp(150, 236, cn)), Math.round(lerp(40, 190, cn))];
      const rgb = a => 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + a + ')';
      amb -= dt; if (amb < 0) { amb = 2.2 + Math.random() * 2.6; if (!held.some(x => x)) { const i = Math.floor(Math.random() * 12); flash[i] = Math.max(flash[i], 0.45); fire(i, 0.4, 1); } }
      for (let i = 0; i < 12; i++) {
        if (held[i] > 0) { if (ph[i] === 0) { env[i] += dt / Math.max(0.03, att * 0.8); if (env[i] >= peak[i]) { env[i] = peak[i]; ph[i] = 1; } } else env[i] += (sus * peak[i] - env[i]) * (1 - Math.exp(-dt / (dec * 0.5 + 0.05))); }
        else env[i] *= Math.exp(-dt / (rel * 0.45 + 0.05));
        flash[i] *= Math.exp(-dt / (0.25 + rel * 0.18));
      }
      for (let k = echoes.length - 1; k >= 0; k--) { const e = echoes[k]; if (now >= e.at) { flash[e.i] = Math.max(flash[e.i], e.amp * 0.8); fire(e.i, e.amp, 1); echoes.splice(k, 1); } }
      const dur = 0.35 + P.get('bloom') * 0.5;
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k]; p.t += dt / dur;
        if (p.t >= 1) {
          const e = NE[p.e], to = e[0] === p.from ? e[1] : e[0]; flash[to] = Math.max(flash[to], p.amp * 0.8);
          if (p.gen < 2 && p.amp > 0.2) { const opts = adj[to].filter(x => x !== p.e); if (opts.length) pulses.push({ e: opts[Math.floor(Math.random() * opts.length)], from: to, t: 0, amp: p.amp * 0.6, gen: p.gen + 1 }); }
          pulses.splice(k, 1);
        }
      }
      for (let k = rings.length - 1; k >= 0; k--) { rings[k].t += dt / 0.9; if (rings[k].t >= 1) rings.splice(k, 1); }
      place(t);
      c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, W, H);
      const bg = c.createRadialGradient(W * 0.5, H * 0.5, 10, W * 0.5, H * 0.5, W * 0.6); bg.addColorStop(0, '#1d1307'); bg.addColorStop(1, '#0a0603'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
      c.strokeStyle = '#ffb34710'; c.lineWidth = 1; c.beginPath(); for (let x = 0; x < W; x += 34) { c.moveTo(x, 0); c.lineTo(x, H); } for (let y = 0; y < H; y += 34) { c.moveTo(0, y); c.lineTo(W, y); } c.stroke();
      let open = 0;
      NE.forEach((e, k) => {
        const lv = Math.max(Math.max(env[e[0]], flash[e[0]]), Math.max(env[e[1]], flash[e[1]])); if (lv > 0.08) open++;
        const a = pos[e[0]], b = pos[e[1]], cp = bez(e, ten, k);
        c.strokeStyle = rgb(0.2 + lv * 0.55); c.lineWidth = 1 + lv * 1.2; c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(cp[0], cp[1], b[0], b[1]); c.stroke();
      });
      c.globalCompositeOperation = 'lighter';
      pulses.forEach(p => {
        const e = NE[p.e], k = p.e, from = e[0] === p.from ? e[0] : e[1], to = from === e[0] ? e[1] : e[0], a = pos[from], b = pos[to], cp = bez(e, ten, k), u = p.t, v = 1 - u;
        const x = v * v * a[0] + 2 * v * u * cp[0] + u * u * b[0], y = v * v * a[1] + 2 * v * u * cp[1] + u * u * b[1], r = (5 + strike * 7) * p.amp;
        const g = c.createRadialGradient(x, y, 0, x, y, r * 2.4); g.addColorStop(0, rgb(0.95 * p.amp)); g.addColorStop(1, rgb(0)); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 2.4, 0, 6.2832); c.fill();
      });
      rings.forEach(r => { const p = pos[r.i]; c.strokeStyle = rgb((1 - r.t) * r.amp * 0.6); c.lineWidth = 1.5; c.beginPath(); c.arc(p[0], p[1], 8 + r.t * (30 + strike * 50), 0, 6.2832); c.stroke(); });
      for (let i = 0; i < 12; i++) {
        const b = Math.max(env[i], flash[i]), p = pos[i], hr = 14 + halo * 64 * (0.3 + b), ha = halo * (0.1 + 0.55 * b);
        const g = c.createRadialGradient(p[0], p[1], 0, p[0], p[1], hr); g.addColorStop(0, rgb(ha)); g.addColorStop(1, rgb(0)); c.fillStyle = g; c.beginPath(); c.arc(p[0], p[1], hr, 0, 6.2832); c.fill();
      }
      c.globalCompositeOperation = 'source-over';
      for (let i = 0; i < 12; i++) {
        const b = Math.max(env[i], flash[i]), p = pos[i], r = (4.5 + strike * 2) * (1 + b * 0.7);
        shape(p[0], p[1], r + 3.5, mat); c.fillStyle = '#0d0905'; c.fill(); c.strokeStyle = rgb(0.35 + b * 0.65); c.lineWidth = 1.4; c.stroke();
        shape(p[0], p[1], r * (0.4 + b * 0.6), mat); c.fillStyle = rgb(0.4 + b * 0.6); c.fill();
        c.fillStyle = 'rgba(201,161,90,' + (0.45 + b * 0.5) + ')'; c.font = '8px Sora,sans-serif'; c.textAlign = 'center'; c.fillText(NOTES[i], p[0], p[1] + r + 14);
      }
      if (frame % 6 === 0) { chEl.textContent = open + (pulses.length ? 0 : 0); }
    });
    // output meter
    const mt = q('.meter i'); let ml = 0; P.raf(() => { ml = Math.max(P.level(), ml * 0.92); mt.style.width = Math.min(100, ml * 100 * P.get('level') / 0.85) + '%'; });
  }

  /* ============================================================ B  BEACON */
  const CSS_B = `
.lb{position:absolute;inset:0;background:linear-gradient(180deg,#0a1226 0%,#07101f 60%,#050a16 100%);color:#e9eef9;font-family:'Barlow Condensed','Arial Narrow',Impact,sans-serif;overflow:hidden}
.lb:before{content:"";position:absolute;left:0;right:0;top:0;height:5px;background:repeating-linear-gradient(90deg,#ff4a4a 0 26px,#f2f5fb 26px 52px)}
.lb:after{content:"";position:absolute;left:0;right:0;bottom:0;height:5px;background:repeating-linear-gradient(90deg,#f2f5fb 0 26px,#ff4a4a 26px 52px)}
.lb .hd{position:absolute;left:24px;right:24px;top:14px;height:42px;display:flex;align-items:center;gap:14px}
.lb .logo{display:flex;align-items:center;gap:10px;font-size:32px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#fff;line-height:1}
.lb .logo svg{width:24px;height:36px}
.lb .logo em{font-style:normal;color:#ff4a4a}
.lb .tag{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;font-size:12px;letter-spacing:.2em;color:#6f82a8;text-transform:uppercase;white-space:nowrap}
.lb .pre{display:flex;align-items:center;gap:0}
.lb .pre button{width:30px;height:30px;background:#0f1b38;border:1px solid #2a3c66;color:#ff4a4a;font-size:20px;line-height:1}
.lb .pre button:hover{background:#17274d}
.lb .pn{width:190px;height:30px;border-top:1px solid #2a3c66;border-bottom:1px solid #2a3c66;background:#050a16;display:flex;align-items:center;gap:8px;padding:0 10px}
.lb .pn small{font-size:11px;letter-spacing:.2em;color:#ff4a4a}
.lb .pn b{font-size:17px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lb [data-plist]{position:absolute;right:24px;top:50px;z-index:20;grid-template-columns:1fr 1fr;width:340px;background:#050a16f5;border:1px solid #ff4a4a;box-shadow:0 14px 40px #000d}
.lb [data-plist] button{padding:6px 10px;text-align:left;font-size:15px;letter-spacing:.1em;text-transform:uppercase;color:#aebbd6;border-bottom:1px solid #162244}
.lb [data-plist] button span{color:#ff4a4a;margin-right:8px;font-size:12px}
.lb [data-plist] button:hover,.lb [data-plist] button.on{background:#14214a;color:#fff}
.lb .disp{overflow:hidden;position:absolute;left:24px;top:64px;width:360px;height:360px;border:1px solid #2a3c66;background:#040918}
.lb .disp canvas{position:absolute;left:0;top:0}
.lb .chr{position:absolute;left:24px;top:430px;width:360px;height:24px;display:flex;align-items:center;justify-content:space-between;font-size:13px;letter-spacing:.05em;white-space:nowrap;text-transform:uppercase;color:#aebbd6;border-top:2px solid #ff4a4a}
.lb .chr b{color:#fff;font-weight:600}.lb .chr em{font-style:normal;color:#ff4a4a}
.lb .sec{position:absolute;font-size:12px;letter-spacing:.3em;color:#6f82a8;text-transform:uppercase}
.lb .sec:after{content:"";display:inline-block;width:60px;height:1px;background:#2a3c66;vertical-align:middle;margin-left:10px}
.lb .lamps{position:absolute;left:408px;top:64px;display:flex;gap:10px;align-items:center}
.lb .lamp{display:flex;align-items:center;gap:8px;height:30px;padding:0 14px 0 10px;border:1px solid #2a3c66;background:#0a1430;font-size:16px;letter-spacing:.16em;text-transform:uppercase;color:#6f82a8}
.lb .lamp i{width:12px;height:12px;border-radius:50%;background:#2a1216;border:1px solid #5a2a30}
.lb .lamp.on{color:#fff;border-color:#ff4a4a}
.lb .lamp.on i{background:#ff4a4a;box-shadow:0 0 12px 3px #ff4a4acc}
.lb .kn{position:absolute;width:100px;text-align:center}
.lb .dial{position:relative;width:60px;height:60px;margin:0 auto}
.lb .dial svg{position:absolute;inset:0;width:60px;height:60px}
.lb .dial .trk{fill:none;stroke:#1b2a52;stroke-width:4}
.lb .dial .arc{fill:none;stroke:#ff4a4a;stroke-width:4;stroke-dasharray:calc(var(--v,0)*75) 100;filter:drop-shadow(0 0 3px #ff4a4a99)}
.lb .dial .body{position:absolute;left:11px;top:11px;width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#3b4c78,#101a38 70%);border:1px solid #4a5d8d;box-shadow:0 3px 6px #000a}
.lb .dial .body i{position:absolute;left:50%;top:3px;width:3px;height:13px;margin-left:-1.5px;background:#fff;border-radius:1px;transform-origin:50% 16px;transform:rotate(calc(-135deg + var(--v,0)*270deg))}
.lb .dial.drag .body{border-color:#ff4a4a}
.lb .kn label{display:block;margin-top:2px;font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#aebbd6;white-space:nowrap}
.lb .kn output{display:block;font-size:15px;font-weight:600;letter-spacing:.04em;color:#fff;font-variant-numeric:tabular-nums}
.lb .envp{position:absolute;left:408px;top:316px;width:226px;height:130px;border:1px solid #2a3c66;background:#050a16}
.lb .envp svg{position:absolute;left:0;top:0}
.lb .envp .t{position:absolute;left:8px;top:3px;font-size:11px;letter-spacing:.24em;color:#6f82a8}
.lb .td{position:absolute;top:312px;width:50px;text-align:center}
.lb .tide{position:relative;width:26px;height:86px;margin:0 auto;background:#050a16;border:1px solid #2a3c66;cursor:ns-resize}
.lb .tide i{position:absolute;left:0;right:0;bottom:0;height:calc(var(--v,0)*100%);background:repeating-linear-gradient(0deg,#ff4a4a 0 3px,transparent 3px 5px);opacity:.85}
.lb .tide b{position:absolute;left:-5px;right:-5px;bottom:calc(var(--v,0)*100% - 4px);height:8px;background:#f2f5fb;border-radius:1px;box-shadow:0 0 8px #fff8}
.lb .td label{display:block;margin-top:4px;font-size:14px;letter-spacing:.16em;text-transform:uppercase;color:#aebbd6}
.lb .td output{display:block;font-size:14px;color:#fff;font-weight:600;white-space:nowrap}
.lb .vu{position:absolute;left:920px;top:0}
.lb .kbx{position:absolute;left:24px;top:462px;width:912px;height:74px;border:1px solid #2a3c66;background:#040918}
.lb .kbx .kb-w{background:linear-gradient(#f4f7fc,#cdd6e8);border:1px solid #8a98b8;border-top:0;border-radius:0 0 2px 2px}
.lb .kbx .kb-w.on{background:linear-gradient(#ffb4b4,#ff4a4a);box-shadow:0 0 18px #ff4a4acc}
.lb .kbx .kb-b{background:linear-gradient(#0d1630,#030612);border:1px solid #2a3c66;border-top:0}
.lb .kbx .kb-b.on{background:#ff4a4a;box-shadow:0 0 14px #ff4a4a}
`;

  

  /* ============================================================ C  PROOF */
  const CSS_C = `
.lc{position:absolute;inset:0;background:radial-gradient(90% 90% at 50% 40%,#f6eed8 0%,#efe3c2 70%,#e2d2a8 100%);color:#3a2b14;font-family:'EB Garamond',Garamond,'Times New Roman',serif;overflow:hidden}
.lc .bd{position:absolute;inset:0;pointer-events:none}
.lc .ttl{position:absolute;left:0;right:0;top:30px;text-align:center}
.lc .ttl h1{margin:0;font-size:40px;font-weight:500;letter-spacing:.42em;padding-left:.42em;line-height:1;color:#2d2110}
.lc .ttl p{margin:3px 0 0;font-size:11.5px;font-style:italic;letter-spacing:.12em;color:#7a6335}
.lc .pre{position:absolute;left:44px;top:34px;width:210px}
.lc .pre small,.lc .ser small{display:block;font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:#8a7240}
.lc .pre .row{display:flex;align-items:center;border-bottom:1px solid #8a7240;height:24px;margin-top:2px}
.lc .pre button{width:20px;font-size:20px;line-height:1;color:#8a6a1c}
.lc .pre button:hover{color:#2d2110}
.lc .pre b{flex:1;font-size:15px;font-style:italic;font-weight:500;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lc [data-plist]{position:absolute;left:44px;top:84px;z-index:30;grid-template-columns:1fr 1fr;width:320px;background:#f7efd8;border:1px solid #8a6a1c;box-shadow:0 10px 30px #3a2b1466}
.lc [data-plist] button{padding:5px 10px;text-align:left;font-size:14px;font-style:italic;border-bottom:1px solid #d9c998}
.lc [data-plist] button span{font-style:normal;font-size:10px;color:#9a8040;margin-right:8px;letter-spacing:.1em}
.lc [data-plist] button:hover,.lc [data-plist] button.on{background:#e8d9ab}
.lc .ser{position:absolute;right:44px;top:34px;width:200px;text-align:right}
.lc .ser b{display:block;font-size:20px;font-weight:500;letter-spacing:.14em;color:#a8322a;font-variant-numeric:lining-nums;margin-top:1px}
.lc .med{position:absolute;left:345px;top:104px;width:270px;height:270px}
.lc .med svg{position:absolute;inset:0}
.lc .col{position:absolute;top:112px;width:290px}
.lc .cl{display:grid;grid-template-columns:22px 104px 1fr 64px;align-items:center;height:36px;gap:6px;border-bottom:1px dotted #b9a469}
.lc .cl .n{font-size:11px;font-style:italic;color:#9a8040}
.lc .cl .l{font-size:15px;font-weight:500;white-space:nowrap}
.lc .cl .v{white-space:nowrap;font-size:13px;text-align:right;border:1px solid #b9a469;padding:1px 3px;background:#f9f2de;font-variant-numeric:lining-nums;letter-spacing:.02em}
.lc .rule{position:relative;height:24px;cursor:ew-resize}
.lc .rule:before{content:"";position:absolute;left:0;right:0;top:11px;height:9px;background:repeating-linear-gradient(90deg,#6a5428 0 1px,transparent 1px 6px)}
.lc .rule:after{content:"";position:absolute;left:0;right:0;top:20px;height:1px;background:#6a5428}
.lc .rule i{position:absolute;left:0;top:20px;height:1px;width:calc(var(--v,0)*100%);background:#a8322a;box-shadow:0 0 0 .5px #a8322a}
.lc .rule b{position:absolute;top:1px;left:calc(var(--v,0)*100%);width:0;height:0;margin-left:-6px;border:6px solid transparent;border-top:11px solid #a8322a}
.lc .rule.drag b,.lc .rule:hover b{border-top-color:#2d2110}
.lc .stamps{display:flex;gap:8px;height:34px;align-items:center;margin-bottom:2px}
.lc .stamps span{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#8a7240;width:54px}
.lc .stamp{flex:1;height:30px;border:1.5px solid #8a6a1c;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#7a6335;background:transparent;position:relative}
.lc .stamp.on{background:#a8322a;color:#fbf2dc;border-color:#a8322a;box-shadow:inset 0 0 0 2px #f4e9ca,inset 0 0 0 3px #a8322a}
.lc .band{position:absolute;left:44px;right:44px;top:382px;height:72px;display:grid;grid-template-columns:230px 1fr;align-items:center;gap:14px;border-top:1px solid #8a7240;border-bottom:1px solid #8a7240}
.lc .band .ep{position:relative;height:64px}
.lc .band .ep small{position:absolute;left:0;top:-1px;font-size:8.5px;letter-spacing:.22em;text-transform:uppercase;color:#8a7240}
.lc .dials{display:flex;justify-content:space-around}
.lc .dl{width:62px;text-align:center}
.lc .dd{position:relative;width:46px;height:46px;margin:0 auto}
.lc .dd svg{position:absolute;inset:0}
.lc .dd .tk{stroke:#6a5428;stroke-width:1}
.lc .dd .pt{position:absolute;left:50%;top:5px;width:2px;height:18px;margin-left:-1px;background:#a8322a;transform-origin:50% 18px;transform:rotate(calc(-135deg + var(--v,0)*270deg))}
.lc .dd.drag circle.ring{stroke:#a8322a}
.lc .dl label{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;line-height:1}
.lc .dl output{display:block;font-size:12px;font-style:italic;color:#7a6335;line-height:1.1}
.lc .sealdial{text-align:center}
.lc .sealdial .dd{width:52px;height:52px}
.lc .kbx{position:absolute;left:44px;top:464px;width:872px;height:68px;border:1px solid #8a6a1c;background:#3a2b14;padding:3px}
.lc .kbx .kb-w{background:linear-gradient(#fbf4de,#e9dcb4);border:1px solid #b09a5a;border-top:0;border-radius:0 0 2px 2px}
.lc .kbx .kb-w.on{background:linear-gradient(#e8c96b,#c89c34);box-shadow:inset 0 0 12px #8a6a1c88}
.lc .kbx .kb-b{background:linear-gradient(#4a3818,#241a08);border:1px solid #1a1206;border-top:0}
.lc .kbx .kb-b.on{background:#a8322a}
.lc .ft{position:absolute;left:0;right:0;bottom:21px;text-align:center;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:#7a6335;display:none}
`;

  function rosePath(cx, cy, E, k, d, n, steps, rot) {
    // hypotrochoid family with R/r = k, scaled so max extent = E
    const r = 1, Rr = k, ext = (Rr - r) + d, sc = E / ext; let s = '';
    for (let j = 0; j < n; j++) {
      const ro = rot + j * Math.PI * 2 / (n * k);
      for (let i = 0; i <= steps; i++) {
        const t = i / steps * Math.PI * 2, x = (Rr - r) * Math.cos(t) + d * Math.cos((Rr - r) / r * t), y = (Rr - r) * Math.sin(t) - d * Math.sin((Rr - r) / r * t);
        const xr = x * Math.cos(ro) - y * Math.sin(ro), yr = x * Math.sin(ro) + y * Math.cos(ro);
        s += (i ? 'L' : 'M') + (cx + xr * sc).toFixed(1) + ' ' + (cy + yr * sc).toFixed(1);
      }
    }
    return s;
  }
  function waveBand(x0, y0, x1, y1, amp, lam, phase, vertical) {
    let s = ''; const len = vertical ? y1 - y0 : x1 - x0; const steps = Math.round(len / 3);
    for (let i = 0; i <= steps; i++) { const u = i / steps * len, w = amp * Math.sin(u / lam * 6.2832 + phase); s += (i ? 'L' : 'M') + (vertical ? (x0 + w).toFixed(1) + ' ' + (y0 + u).toFixed(1) : (x0 + u).toFixed(1) + ' ' + (y0 + w).toFixed(1)); }
    return s;
  }

  

  Kit.register('lantern', {
    fonts: 'family=Sora:wght@300;400;600;700&family=Barlow+Condensed:wght@500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,700;1,400;1,500',
    w: 960, h: 560, params, presets,
    faces: [
      { key: 'A', name: 'Lightnode', accent: '#ffb347', build: buildA },
      undefined,
      undefined
    ].filter(Boolean)
  });
})();
