import { Kit } from "./runtime.js";
/* prism.js - jiPRISM: refracting glass-like tones. Three faces: Schnorr / Segwit / Multisig */
(function () {
  const hz = v => v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 1 : 2) + ' kHz' : Math.round(v) + ' Hz';
  const sec = v => v < 1 ? Math.round(v * 1000) + ' ms' : v.toFixed(2) + ' s';
  const pct = v => Math.round(v * 100) + '%';
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const NOTES = ['C', 'C\u266F', 'D', 'D\u266F', 'E', 'F', 'F\u266F', 'G', 'G\u266F', 'A', 'A\u266F', 'B'];
  const params = [
    { id: 'material', label: 'Material', options: ['Glass', 'Ceramic', 'Bronze'], def: 0 },
    { id: 'refraction', label: 'Refraction', min: 0, max: 1, def: 0.48, step: 0.01, fmt: pct },
    { id: 'bloom', label: 'Bloom', min: 0, max: 2, def: 0.42, step: 0.01, fmt: v => v.toFixed(2) + ' s' },
    { id: 'gravity', label: 'Gravity', min: 0, max: 1, def: 0.65, step: 0.01, fmt: pct },
    { id: 'strike', label: 'Strike', min: 0, max: 1, def: 0.32, step: 0.01, fmt: pct },
    { id: 'damping', label: 'Damping', min: 0, max: 1, def: 0.4, step: 0.01, fmt: pct },
    { id: 'orbit', label: 'Orbit', min: 0, max: 1, def: 0.24, step: 0.01, fmt: pct },
    { id: 'rate', label: 'Orbit Rate', min: 0.03, max: 6, def: 0.17, step: 0.01, log: true, fmt: v => v.toFixed(2) + ' Hz' },
    { id: 'width', label: 'Stereo Width', min: 0, max: 1, def: 0.72, step: 0.01, fmt: pct },
    { id: 'cutoff', label: 'Cutoff', min: 100, max: 14000, def: 7200, step: 10, log: true, fmt: hz },
    { id: 'attack', label: 'Attack', min: 0.002, max: 3, def: 0.006, step: 0.002, log: true, fmt: sec },
    { id: 'decay', label: 'Decay', min: 0.03, max: 4, def: 1.4, step: 0.01, fmt: sec },
    { id: 'sustain', label: 'Sustain', min: 0, max: 1, def: 0.2, step: 0.01, fmt: pct },
    { id: 'release', label: 'Release', min: 0.02, max: 6, def: 2.2, step: 0.01, fmt: sec },
    { id: 'level', label: 'Output', min: 0, max: 1.5, def: 0.9, step: 0.01, fmt: v => Math.round(v * 100) + '%' }
  ];
  const presets = [
    { name: 'Prism Garden', values: {} },
    { name: 'Pocket Planet', values: { material: 1, refraction: 0.22, bloom: 0.07, gravity: 0.86, strike: 0.18, damping: 0.75, decay: 0.58, sustain: 0, release: 0.85, cutoff: 4800, orbit: 0.1, level: 1.3 } },
    { name: 'Glass Cathedral', values: { refraction: 0.74, bloom: 1.25, gravity: 0.27, attack: 0.34, decay: 2.6, sustain: 0.55, release: 4.8, orbit: 0.56, rate: 0.08, width: 1, damping: 0.14, strike: 0.08, cutoff: 9200, level: 0.78 } },
    { name: 'Bronze Afterimage', values: { material: 2, refraction: 0.9, bloom: 0.16, gravity: 0.14, strike: 0.78, decay: 2.2, sustain: 0, release: 3.2, cutoff: 8900, damping: 0.25, width: 0.8 } },
    { name: 'Event Horizon', values: { material: 2, refraction: 0.82, bloom: 1.7, gravity: 1, attack: 0.16, decay: 3.4, sustain: 0.62, release: 4.6, strike: 0.06, orbit: 0.86, rate: 0.09, cutoff: 3900, damping: 0.08, width: 1, level: 0.8 } },
    { name: 'Ceramic Teeth', values: { material: 1, refraction: 0.8, bloom: 0, gravity: 0.1, strike: 0.9, decay: 0.19, sustain: 0, release: 0.25, damping: 0.8, orbit: 0, width: 0.3, cutoff: 6700, level: 1.5 } },
    { name: 'Velvet Satellite', values: { material: 1, refraction: 0.09, bloom: 0.85, gravity: 0.85, strike: 0, attack: 0.8, decay: 2.1, sustain: 0.64, release: 3.9, cutoff: 2400, orbit: 0.38, rate: 0.11, damping: 0.65, level: 0.82 } },
    { name: 'Unstable Jewellery', values: { material: 2, refraction: 1, bloom: 0.31, gravity: 0.52, strike: 0.68, decay: 1.05, sustain: 0.12, release: 1.9, orbit: 1, rate: 2.4, width: 1, cutoff: 10300, damping: 0.2, level: 0.8 } }
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
  const PAL = [[1, 2.01, 2.756, 4.08, 5.404, 6.71, 8.21], [1, 1.593, 2.135, 2.918, 4.167, 5.431, 6.789], [1, 2.32, 3.18, 4.76, 6.27, 7.91, 9.63]];
  const PW = [1, 0.46, 0.32, 0.23, 0.17, 0.12, 0.085];
  const HUE = ['#ff5e5e', '#ff9a4a', '#ffd95a', '#6df08a', '#4de0e0', '#5a8cff', '#b87dff'];
  function model(P) {
    const m = P.get('material'), rf = P.get('refraction'), g = P.get('gravity'), b = P.get('bloom');
    return PAL[m].map((p, i) => { const h = i + 1, r0 = h + (p - h) * rf, r1 = h + (r0 - h) * (1 - g); return { r: r1, w: PW[i], on: i ? b * Math.pow(i / 6, 1.15) : 0 }; });
  }
  function sig(P) {
    let h = 2166136261; P.params.forEach(p => { h ^= Math.round(P.norm(p.id) * 1000); h = Math.imul(h, 16777619) >>> 0; });
    const h2 = Math.imul(h ^ 0x9e3779b9, 2246822519) >>> 0; return h.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
  }
  const quad = (a, c, b, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };

  /* ============================================================ A  SCHNORR */
  const CSS_A = `
.sa{position:absolute;inset:0;background:#08080c;color:#e8e8f2;font-family:Syne,'Helvetica Neue',Arial,sans-serif;overflow:hidden}
.sa .hd{position:absolute;left:24px;right:24px;top:12px;height:42px;display:flex;align-items:center;gap:16px}
.sa .logo{display:flex;align-items:center;gap:12px;font-size:28px;font-weight:800;letter-spacing:-.03em;line-height:1}
.sa .logo svg{width:44px;height:26px}
.sa .tag{flex:1;font-size:9.5px;letter-spacing:.24em;text-transform:uppercase;color:#6c6c7e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sa .pre{display:flex;align-items:center;gap:10px;font-size:12px}
.sa .pre button{width:24px;height:24px;border:1px solid #34343f;color:#e8e8f2;font-size:14px;line-height:1}
.sa .pre button:hover{background:#e8e8f2;color:#08080c}
.sa .pre .i{color:#6c6c7e;font-size:10px;letter-spacing:.15em}
.sa .pre b{width:150px;font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sa [data-plist]{position:absolute;right:24px;top:50px;z-index:20;width:330px;grid-template-columns:1fr 1fr;background:#0c0c12;border:1px solid #e8e8f2}
.sa [data-plist] button{text-align:left;padding:7px 10px;font-size:11px;color:#a8a8b8;border-bottom:1px solid #1c1c24}
.sa [data-plist] button span{color:#55556a;margin-right:8px;font-size:9px}
.sa [data-plist] button:hover,.sa [data-plist] button.on{background:#e8e8f2;color:#08080c}
.sa .disp{position:absolute;left:24px;top:62px;width:912px;height:238px;border:1px solid #23232c;background:#0a0a10}
.sa .sec{position:absolute;top:310px;font-size:8.5px;letter-spacing:.3em;text-transform:uppercase;color:#6c6c7e;height:14px;border-bottom:1px solid #2c2c36;white-space:nowrap}
.sa .mat{position:absolute;left:24px;top:330px;width:76px}
.sa .mat button{display:block;width:100%;text-align:left;padding:7px 0 7px 10px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#6c6c7e;border-left:1px solid #2c2c36;margin-bottom:6px}
.sa .mat button.on{color:#08080c;background:#e8e8f2;border-left-color:#e8e8f2}
.sa .fd{position:absolute;top:326px;width:52px;text-align:center}
.sa .fd output{display:block;height:14px;font-size:9.5px;font-variant-numeric:tabular-nums;color:#e8e8f2;white-space:nowrap}
.sa .ft{position:relative;width:20px;height:96px;margin:2px auto 4px;cursor:ns-resize}
.sa .ft:before{content:"";position:absolute;left:9.5px;top:0;bottom:0;width:1px;background:#34343f}
.sa .ft i{position:absolute;left:9px;bottom:0;width:2px;height:calc(var(--v,0)*100%);background:#e8e8f2}
.sa .ft b{position:absolute;left:2px;width:16px;height:5px;bottom:calc(var(--v,0)*100% - 2.5px);background:#e8e8f2;box-shadow:0 0 12px #e8e8f2aa}
.sa .ft.drag b{box-shadow:0 0 18px #fff}
.sa .fd label{display:block;font-size:8px;letter-spacing:.06em;text-transform:uppercase;color:#8c8c9e;white-space:nowrap;margin-left:-6px;margin-right:-6px}
.sa .kbx{position:absolute;left:24px;top:462px;width:912px;height:76px;border:1px solid #23232c;background:#08080c}
.sa .kbx .kb-w{background:linear-gradient(#17171f,#0e0e14);border:1px solid #08080c;border-top:0}
.sa .kbx .kb-w.on{background:linear-gradient(#ffffff,#c4c4d6);box-shadow:0 0 24px #e8e8f288}
.sa .kbx .kb-b{background:#050507;border:1px solid #2c2c36;border-top:0}
.sa .kbx .kb-b.on{background:#e8e8f2}
`;

  function buildA(root, P) {
    const fd = (id, x, nm) => '<div class="fd" style="left:' + x + 'px"><output data-t="' + id + '"></output><div class="ft" data-b="' + id + '" data-abs="y"><i></i><b></b></div><label>' + (nm || lab(P, id)) + '</label></div>';
    const groups = [
      ['Lattice', ['refraction', 'bloom', 'gravity', 'strike', 'damping']],
      ['Orbit', ['orbit', 'rate', 'width']],
      ['Tone', ['cutoff']],
      ['Envelope', ['attack', 'decay', 'sustain', 'release']],
      ['Out', ['level']]
    ];
    let x = 116, html = '';
    groups.forEach(([t, ids], gi) => {
      html += '<div class="sec" style="left:' + (x + 4) + 'px;width:' + (ids.length * 52 - 6) + 'px">' + t + '</div>';
      ids.forEach(id => { html += fd(id, x + 2, id === 'rate' ? 'Rate' : id === 'width' ? 'Width' : null); x += 52; });
      x += 14;
    });
    root.innerHTML = '<style>' + BASE + CSS_A + '</style><div class="sa">' +
      '<div class="hd"><div class="logo"><svg viewBox="0 0 44 26"><g stroke-width="1.4" fill="none"><path d="M0 3L20 12" stroke="#ff5e5e"/><path d="M0 8L20 12" stroke="#ffd95a"/><path d="M0 13L20 13" stroke="#6df08a"/><path d="M0 18L20 14" stroke="#4de0e0"/><path d="M0 23L20 14" stroke="#b87dff"/></g><path d="M18 2L30 13L18 24Z" fill="#ffffff14" stroke="#e8e8f2" stroke-width="1"/><path d="M28 13H44" stroke="#fff" stroke-width="2.2"/></svg>Schnorr</div>' +
      '<div class="tag">Many beams \u00B7 one clean line \u00B7 aggregated in glass</div>' +
      '<div class="pre"><span class="i"><span data-pidx></span>/<span data-pn></span></span><button data-prev>\u2039</button><b data-pname></b><button data-next>\u203A</button><button data-tgl style="font-size:12px">\u2261</button></div></div>' +
      '<div data-plist></div><div class="disp"><canvas></canvas></div>' +
      '<div class="sec" style="left:24px;width:76px">Material</div>' +
      '<div class="mat"><button data-set="material:0">Glass</button><button data-set="material:1">Ceramic</button><button data-set="material:2">Bronze</button></div>' +
      html + '<div class="kbx"></div></div>';
    wire(root, P);
    const q = s => root.querySelector(s);
    P.keyboard(q('.kbx'), { from: 48, octaves: 3 });
    const W = 912, H = 238, cv = q('.disp canvas'), c = setupCanvas(cv, W, H);
    const E = [418, 116], X = [494, 116], pk = [[456, 32], [370, 182], [542, 182]];
    const pk2 = [[456, 32], [370, 182], [542, 182]];
    const pk0 = pk2; void pk0;
    const packets = []; let now = 0, last = 0, agg = 0, amb = 1.5, phase = 0, nact = 0, sg = '';
    const N = 7;
    function send(vel, amp) {
      const md = model(P), dm = P.get('damping');
      md.forEach((m, i) => packets.push({ i, at: now + m.on * 0.6, u: -1, amp: amp * (0.5 + 0.5 * vel) * (0.6 + 0.4 * m.w), tail: 0.08 + (1 - dm) * 0.3, dur: 0.75 }));
    }
    P.onNote(ev => { if (ev.type === 'on') send(ev.vel, 1); });
    let frame = 0;
    P.raf(t => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t; now += dt; frame++;
      const rf = P.get('refraction'), g = P.get('gravity'), strike = P.get('strike'), dm = P.get('damping'), orb = P.get('orbit'), rate = P.get('rate'), wid = P.get('width'), cn = P.norm('cutoff'), dec = P.get('decay'), lvl = P.get('level');
      amb -= dt; if (amb < 0) { amb = 3.2; send(0.6, 0.45); }
      phase += dt * Math.min(rate, 6) * 1.2; agg *= Math.exp(-dt / (0.25 + dec * 0.25));
      const md = model(P), sp = 10 + rf * 24;
      c.clearRect(0, 0, W, H); c.fillStyle = '#0a0a10'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#ffffff0b'; for (let x = 20; x < W; x += 24) for (let y = 14; y < H; y += 24) c.fillRect(x, y, 1, 1);
      const S = md.map((m, i) => [64, 116 + (i - 3) * sp]);
      const cps = S.map(s => [lerp(s[0] + (E[0] - s[0]) * 0.55, E[0] - 36, g), lerp(s[1], E[1], g * 0.92)]);
      // beams
      c.lineCap = 'round';
      S.forEach((s, i) => {
        c.strokeStyle = HUE[i]; c.globalAlpha = 0.16 + 0.16 * PW[i]; c.lineWidth = 1 + PW[i] * 1.6; c.beginPath(); c.moveTo(s[0], s[1]); c.quadraticCurveTo(cps[i][0], cps[i][1], E[0], E[1]); c.stroke();
        c.globalAlpha = 1; c.fillStyle = HUE[i]; c.beginPath(); c.arc(s[0], s[1], 2.4, 0, 6.2832); c.fill();
        c.fillStyle = '#8c8c9e'; c.font = '9px Syne,Arial,sans-serif'; c.textAlign = 'right'; c.fillText('\u00D7' + md[i].r.toFixed(2), s[0] - 8, s[1] + 3); c.textAlign = 'left'; c.fillStyle = '#55556a'; c.fillText('P' + (i + 1), 8, s[1] + 3);
      });
      // packets
      c.globalCompositeOperation = 'lighter';
      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k]; if (now < p.at) continue; p.u = (now - p.at) / p.dur;
        if (p.u >= 1) { agg = Math.min(1, agg + p.amp * PW[p.i] * 0.55 + p.amp * 0.07); packets.splice(k, 1); continue; }
        const tl = Math.min(p.u, p.tail + strike * 0.1), seg = 10;
        for (let j = 0; j < seg; j++) {
          const u0 = p.u - tl * (j + 1) / seg, u1 = p.u - tl * j / seg; if (u0 < 0) break;
          const a = quad(S[p.i], cps[p.i], E, u0), b = quad(S[p.i], cps[p.i], E, u1);
          c.strokeStyle = HUE[p.i]; c.globalAlpha = (1 - j / seg) * p.amp; c.lineWidth = 2 + strike * 3 * (1 - j / seg); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
        }
        const hd = quad(S[p.i], cps[p.i], E, p.u), gr = c.createRadialGradient(hd[0], hd[1], 0, hd[0], hd[1], 10 + strike * 8); gr.addColorStop(0, HUE[p.i]); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.globalAlpha = p.amp; c.fillStyle = gr; c.beginPath(); c.arc(hd[0], hd[1], 10 + strike * 8, 0, 6.2832); c.fill();
      }
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
      // prism
      const pg = c.createLinearGradient(370, 32, 542, 182); pg.addColorStop(0, 'rgba(255,255,255,.14)'); pg.addColorStop(0.5, 'rgba(255,255,255,.03)'); pg.addColorStop(1, 'rgba(255,255,255,.10)');
      c.beginPath(); c.moveTo(pk[0][0], pk[0][1]); c.lineTo(pk[1][0], pk[1][1]); c.lineTo(pk[2][0], pk[2][1]); c.closePath(); c.fillStyle = pg; c.fill(); c.strokeStyle = 'rgba(232,232,242,.75)'; c.lineWidth = 1.2; c.stroke();
      c.strokeStyle = 'rgba(232,232,242,.2)'; c.beginPath(); c.moveTo(456, 52); c.lineTo(390, 172); c.lineTo(522, 172); c.closePath(); c.stroke();
      // the one line
      const xEnd = 560 + (W - 600) * (0.35 + 0.65 * cn), oy = Math.sin(phase) * orb * 14, yEnd = X[1] + oy, th = 1.2 + agg * 3.2 + lvl;
      const lg = c.createLinearGradient(E[0], 0, xEnd, 0); lg.addColorStop(0, 'rgba(255,255,255,' + (0.35 + agg * 0.65) + ')'); lg.addColorStop(0.7, 'rgba(255,255,255,' + (0.3 + agg * 0.6) + ')'); lg.addColorStop(1, 'rgba(255,255,255,0)');
      c.shadowColor = '#fff'; c.shadowBlur = 6 + agg * 22; c.strokeStyle = lg; c.lineWidth = th; c.beginPath(); c.moveTo(E[0], E[1]); c.lineTo(X[0], X[1]); c.lineTo(xEnd, yEnd); c.stroke(); c.shadowBlur = 0;
      if (wid > 0.04) { [-1, 1].forEach(sgn => { c.strokeStyle = 'rgba(232,232,242,' + (0.1 + agg * 0.3) * wid + ')'; c.lineWidth = 1; c.beginPath(); c.moveTo(X[0], X[1]); c.lineTo(xEnd, yEnd + sgn * wid * 20); c.stroke(); }); }
      // orbiting signature dot
      const Ro = 6 + orb * 34; c.strokeStyle = 'rgba(232,232,242,.18)'; c.lineWidth = 1; c.beginPath(); c.ellipse(xEnd, yEnd, Ro, Ro * 0.42, 0, 0, 6.2832); c.stroke();
      [0, Math.PI].forEach((o, k) => { if (k && wid < 0.04) return; const a = phase * 2 + o, ox = xEnd + Math.cos(a) * Ro, oy2 = yEnd + Math.sin(a) * Ro * 0.42; c.fillStyle = 'rgba(255,255,255,' + (k ? 0.4 * wid : 1) + ')'; c.beginPath(); c.arc(ox, oy2, k ? 2 : 3, 0, 6.2832); c.fill(); });
      // text
      if (frame % 6 === 0) sg = sig(P);
      c.fillStyle = '#55556a'; c.font = '9px Syne,Arial,sans-serif'; c.textAlign = 'left'; c.fillText('7 BEAMS \u2192 1 SIGNATURE', 560, 26);
      c.fillStyle = '#e8e8f2'; c.font = '600 10px Syne,Arial,sans-serif'; c.fillText('\u03C3 ' + sg.slice(0, 8) + '\u2026' + sg.slice(-6), 560, 42);
      c.fillStyle = '#55556a'; c.font = '9px Syne,Arial,sans-serif'; c.fillText('AGGREGATE ' + Math.round(agg * 100) + '%', 560, H - 14); c.textAlign = 'right'; c.fillText('KEY-PATH SPEND \u00B7 NO SCRIPT REVEALED', W - 14, H - 14); c.textAlign = 'left';
      c.fillStyle = '#6c6c7e'; c.fillText('INPUTS', 8, 16);
    });
  }

  /* ============================================================ B  SEGWIT */
  const CSS_B = `
.sb{position:absolute;inset:0;background:#04070b;color:#bfe9ff;font-family:'DM Mono','SF Mono',Menlo,Consolas,monospace;font-size:10.5px;overflow:hidden}
.sb:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,#4dc3ff08 0 1px,transparent 1px 4px);pointer-events:none}
.sb .hd{position:absolute;left:24px;right:24px;top:12px;height:42px;display:flex;align-items:center;gap:16px}
.sb .logo{font-size:24px;font-weight:500;letter-spacing:.02em;color:#fff;line-height:1;white-space:nowrap}
.sb .logo em{font-style:normal;color:#4dc3ff}
.sb .wu{flex:1;display:flex;gap:18px;font-size:10px;color:#5d7f93;white-space:nowrap}
.sb .wu b{color:#4dc3ff;font-weight:500}
.sb .wu span.t b{color:#fff}
.sb .pre{display:flex;align-items:center;gap:0;border:1px solid #1e4660}
.sb .pre button{width:26px;height:26px;color:#4dc3ff;font-size:15px;line-height:1;background:#07111a}
.sb .pre button:hover{background:#4dc3ff;color:#04070b}
.sb .pre .n{width:176px;height:26px;display:flex;align-items:center;gap:8px;padding:0 8px;border-left:1px solid #1e4660;border-right:1px solid #1e4660}
.sb .pre .n small{color:#5d7f93}.sb .pre .n b{font-weight:500;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb [data-plist]{position:absolute;right:24px;top:42px;z-index:20;width:340px;grid-template-columns:1fr 1fr;background:#05101a;border:1px solid #4dc3ff}
.sb [data-plist] button{text-align:left;padding:6px 8px;color:#7fa6bb;border-bottom:1px solid #0e2433;font-size:10.5px}
.sb [data-plist] button span{color:#3d6178;margin-right:8px}
.sb [data-plist] button:hover,.sb [data-plist] button.on{background:#4dc3ff;color:#04070b}
.sb .disp{position:absolute;left:24px;top:60px;width:912px;height:180px;border:1px solid #14364a;background:#050b11}
.sb .blk{position:absolute;top:252px;height:200px;border:1px solid #14364a}
.sb .blk h3{position:absolute;left:10px;top:-7px;margin:0;padding:0 6px;background:#04070b;font-size:9.5px;font-weight:500;letter-spacing:.2em;color:#4dc3ff;text-transform:uppercase}
.sb .blk h3 i{font-style:normal;color:#5d7f93}
.sb .rows{position:absolute;left:12px;right:12px;top:14px}
.sb .rw{display:grid;align-items:center}
.sb .base .rw{grid-template-columns:96px 1fr 70px 30px;height:30px;gap:10px}
.sb .wit .rw{grid-template-columns:92px 1fr 62px 24px;height:19px;gap:8px}
.sb .rw .l{color:#9ec6da;white-space:nowrap}
.sb .rw .v{text-align:right;color:#fff;font-variant-numeric:tabular-nums;white-space:nowrap}
.sb .rw .w{color:#3d6178;font-size:9px;text-align:right}
.sb .sg{position:relative;height:12px;cursor:ew-resize;background:repeating-linear-gradient(90deg,#0f2433 0 6px,transparent 6px 8px)}
.sb .wit .sg{height:9px;background:repeating-linear-gradient(90deg,#0f2433 0 4px,transparent 4px 6px)}
.sb .sg i{position:absolute;inset:0;background:repeating-linear-gradient(90deg,#4dc3ff 0 6px,transparent 6px 8px);clip-path:inset(0 calc((1 - var(--v,0))*100%) 0 0)}
.sb .wit .sg i{background:repeating-linear-gradient(90deg,#4dc3ff 0 4px,transparent 4px 6px)}
.sb .sg.drag i{filter:drop-shadow(0 0 6px #4dc3ff)}
.sb .seg3{display:flex;gap:4px}
.sb .seg3 button{flex:1;height:18px;border:1px solid #1e4660;color:#5d7f93;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase}
.sb .seg3 button.on{background:#4dc3ff;color:#04070b;border-color:#4dc3ff}
.sb .kbx{position:absolute;left:24px;top:464px;width:912px;height:74px;border:1px solid #14364a;background:#04070b}
.sb .kbx .kb-w{background:linear-gradient(#0d2030,#081420);border:1px solid #04070b;border-top:0}
.sb .kbx .kb-w.on{background:repeating-linear-gradient(0deg,#4dc3ff 0 6px,#0d2030 6px 8px);box-shadow:0 0 18px #4dc3ff99}
.sb .kbx .kb-b{background:#020406;border:1px solid #14364a;border-top:0}
.sb .kbx .kb-b.on{background:#bfe9ff}
.sb .ft{position:absolute;left:24px;right:24px;bottom:4px;font-size:8.5px;letter-spacing:.14em;color:#3d6178;display:flex;justify-content:space-between;text-transform:uppercase}
`;

  

  /* ============================================================ C  MULTISIG */
  const CSS_C = `
.sc{position:absolute;inset:0;background:radial-gradient(100% 100% at 30% 20%,#1b1230 0%,#0e0a1a 55%,#08060f 100%);color:#e6dcff;font-family:Sora,'Segoe UI',system-ui,sans-serif;font-size:11px;overflow:hidden}
.sc .hd{position:absolute;left:24px;right:24px;top:12px;height:42px;display:flex;align-items:center;gap:16px}
.sc .logo{display:flex;align-items:center;gap:10px;font-size:25px;font-weight:700;letter-spacing:-.02em;color:#fff;white-space:nowrap}
.sc .logo svg{width:28px;height:28px}
.sc .logo em{font-style:normal;color:#b07dff}
.sc .tag{flex:1;font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:#7a68a8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sc .pre{display:flex;align-items:center;gap:8px}
.sc .pre button{width:28px;height:28px;border-radius:50%;border:1px solid #4a3a78;color:#b07dff;font-size:15px;line-height:1}
.sc .pre button:hover{background:#b07dff;color:#0e0a1a}
.sc .pre .n{width:190px;text-align:center;line-height:1.15}
.sc .pre small{display:block;font-size:8px;letter-spacing:.24em;color:#7a68a8}
.sc .pre b{font-size:13px;font-weight:600;white-space:nowrap}
.sc [data-plist]{position:absolute;right:24px;top:54px;z-index:20;width:340px;grid-template-columns:1fr 1fr;background:#120c22f5;border:1px solid #b07dff;border-radius:6px;overflow:hidden}
.sc [data-plist] button{text-align:left;padding:7px 10px;color:#bba9e6;border-bottom:1px solid #2a1f48}
.sc [data-plist] button span{color:#6a58a0;margin-right:8px;font-size:9px}
.sc [data-plist] button:hover,.sc [data-plist] button.on{background:#b07dff;color:#0e0a1a}
.sc .vault{position:absolute;left:24px;top:62px;width:330px;height:330px}
.sc .vault canvas{cursor:pointer}
.sc .cap{position:absolute;left:24px;top:398px;width:330px;display:flex;justify-content:space-between;align-items:baseline;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#7a68a8}
.sc .cap b{font-size:14px;letter-spacing:.04em;color:#fff;font-weight:600}
.sc .cap b.ok{color:#b07dff;text-shadow:0 0 12px #b07dff}
.sc .keys{position:absolute;left:24px;top:420px;width:330px;display:flex;gap:8px}
.sc .keyb{flex:1;height:30px;border:1px solid #4a3a78;border-radius:15px;display:flex;align-items:center;gap:7px;padding:0 10px;color:#9a88c8;font-size:10px;letter-spacing:.1em;text-transform:uppercase}
.sc .keyb svg{width:20px;height:10px;fill:none;stroke:currentColor;stroke-width:1.4}
.sc .keyb.on{background:#b07dff;color:#0e0a1a;border-color:#b07dff;box-shadow:0 0 16px #b07dff88}
.sc .grid{position:absolute;left:380px;top:62px;width:556px}
.sc .gt{position:absolute;left:0;font-size:8px;letter-spacing:.26em;text-transform:uppercase;color:#6a58a0}
.sc .ac{position:absolute;width:111px;text-align:center}
.sc .ad{position:relative;width:68px;height:68px;margin:0 auto}
.sc .ad svg{position:absolute;inset:0;width:68px;height:68px}
.sc .ad .t{fill:none;stroke:#241a40;stroke-width:6;stroke-linecap:round}
.sc .ad .a{fill:none;stroke:#b07dff;stroke-width:6;stroke-linecap:round;stroke-dasharray:calc(var(--v,0)*75) 100;filter:drop-shadow(0 0 4px #b07dff88)}
.sc .ad .dot{position:absolute;left:50%;top:0;width:0;height:34px;transform-origin:50% 34px;transform:rotate(calc(-135deg + var(--v,0)*270deg))}
.sc .ad .dot:after{content:"";position:absolute;left:-3px;top:4px;width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 6px #fff}
.sc .ad output{position:absolute;left:0;right:0;top:27px;font-size:10px;font-weight:600;color:#fff;font-variant-numeric:tabular-nums;white-space:nowrap}
.sc .ad.drag .a{stroke:#d7bcff}
.sc .ac label{display:block;margin-top:1px;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:#a894d8;white-space:nowrap}
.sc .quo{position:absolute;text-align:center;width:111px}
.sc .quo b{display:block;font-size:30px;font-weight:700;color:#4a3a78;line-height:1;margin-top:12px;transition:color .2s}
.sc .quo b.ok{color:#b07dff;text-shadow:0 0 18px #b07dff}
.sc .quo small{font-size:8.5px;letter-spacing:.18em;color:#7a68a8;text-transform:uppercase}
.sc .envp{position:absolute;left:380px;top:400px;width:556px;height:52px;border-top:1px solid #2a1f48}
.sc .envp svg{position:absolute;left:0;top:2px}
.sc .envp .t{position:absolute;right:0;top:4px;font-size:8px;letter-spacing:.26em;color:#6a58a0}
.sc .kbx{position:absolute;left:24px;top:462px;width:912px;height:76px;border:1px solid #2a1f48;border-radius:4px;background:#08060f;padding:2px}
.sc .kbx .kb-w{background:linear-gradient(#f3ecff,#c9b8ee);border:1px solid #7a68a8;border-top:0;border-radius:0 0 5px 5px}
.sc .kbx .kb-w.on{background:linear-gradient(#d7bcff,#b07dff);box-shadow:0 0 22px #b07dffaa}
.sc .kbx .kb-b{background:linear-gradient(#2b1f4a,#0c0818);border:1px solid #4a3a78;border-top:0;border-radius:0 0 4px 4px}
.sc .kbx .kb-b.on{background:#b07dff}
`;

  

  Kit.register('prism', {
    fonts: 'family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Sora:wght@300;400;600;700',
    w: 960, h: 560, params, presets,
    faces: [
      { key: 'A', name: 'Schnorr', accent: '#e8e8f2', build: buildA },
      undefined,
      undefined
    ].filter(Boolean)
  });
})();
