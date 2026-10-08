import { Kit } from "./runtime.js";
/* modal — struck bars, bells and plates. Real params from synths/mallet/modal.js */
(function () {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const $ = (r, s) => r.querySelector(s), $$ = (r, s) => Array.from(r.querySelectorAll(s));
  const pct = v => Math.round(v * 100) + '%';
  const secs = v => (v < 1 ? Math.round(v * 1000) + ' ms' : v.toFixed(2) + ' s');
  const BN = ['marimba', 'xylophone', 'vibes', 'glock', 'kalimba', 'bell', 'bowl', 'pan', 'wood'];
  const BODIES = {
    marimba: { T0: 0.3, res: 0.9, modes: [[1, 1], [3.99, 0.48], [9.9, 0.2], [18.4, 0.07]] },
    xylophone: { T0: 0.11, res: 0.3, modes: [[1, 1], [3, 0.58], [6, 0.3], [10, 0.13]] },
    vibes: { T0: 1.1, res: 0.6, modes: [[1, 1], [3.99, 0.42], [10, 0.15], [17.9, 0.05]] },
    glock: { T0: 0.55, res: 0, modes: [[1, 1], [2.756, 0.55], [5.404, 0.36], [8.933, 0.2], [13.34, 0.1]] },
    kalimba: { T0: 0.36, res: 0.8, modes: [[1, 1], [6.27, 0.36], [17.55, 0.1]] },
    bell: { T0: 1.4, res: 0, modes: [[1, 1], [2, 0.7], [2.4, 0.5], [3, 0.45], [4.07, 0.3], [5.4, 0.2], [6.8, 0.12]] },
    bowl: { T0: 1.6, res: 0, modes: [[1, 1], [2.71, 0.7], [5.15, 0.4], [8.4, 0.22]] },
    pan: { T0: 0.46, res: 0.4, modes: [[1, 1], [2, 0.75], [3, 0.4], [4.01, 0.22], [5, 0.1]] },
    wood: { T0: 0.035, res: 0.5, modes: [[1, 1], [2.4, 0.55], [3.9, 0.3]] }
  };
  const params = [
    { id: 'body', label: 'Body', options: BN, def: 0 },
    { id: 'hardness', label: 'Mallet Hardness', min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct },
    { id: 'strike', label: 'Strike Position', min: 0, max: 1, step: 0.01, def: 0.4, fmt: pct },
    { id: 'damping', label: 'Damping (material)', min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct },
    { id: 'decay', label: 'Ring Length', min: 0.2, max: 3, step: 0.01, def: 1, fmt: v => v.toFixed(2) + 'x' },
    { id: 'purity', label: 'Purity (inharmonic -> tuned)', min: 0, max: 1, step: 0.01, def: 0, fmt: pct },
    { id: 'resonator', label: 'Resonator', min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct },
    { id: 'beat', label: 'Shimmer (mode beating)', min: 0, max: 1, step: 0.01, def: 0, fmt: pct },
    { id: 'noise', label: 'Mallet Noise', min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct },
    { id: 'tremolo', label: 'Tremolo (motor)', min: 0, max: 1, step: 0.01, def: 0, fmt: pct },
    { id: 'tremRate', label: 'Tremolo Rate (Hz)', min: 0.5, max: 9, step: 0.1, def: 5.2, fmt: v => v.toFixed(1) + ' Hz' },
    { id: 'release', label: 'Damper Release', min: 0.03, max: 4, step: 0.01, def: 3, fmt: secs },
    { id: 'level', label: 'Output Level', min: 0, max: 1.5, step: 0.01, def: 1, fmt: pct }
  ];
  const presets = [
    { name: 'Init (Marimba)', values: {} },
    { name: 'Soft Vibes', values: { body: 2, hardness: 0.3, strike: 0.35, damping: 0.35, decay: 1.1, purity: 0, resonator: 0.6, beat: 0.1, noise: 0.35, tremolo: 0.55, tremRate: 5.1, release: 3 } },
    { name: 'Bright Xylophone', values: { body: 1, hardness: 0.85, strike: 0.6, damping: 0.55, decay: 1, purity: 0.2, resonator: 0.3, noise: 0.7, release: 0.5 } },
    { name: 'Glockenspiel', values: { body: 3, hardness: 0.8, strike: 0.5, damping: 0.4, decay: 1.1, resonator: 0, beat: 0.15, noise: 0.45, release: 2.5 } },
    { name: 'Kalimba Box', values: { body: 4, hardness: 0.45, strike: 0.3, damping: 0.5, decay: 1.2, resonator: 0.85, beat: 0.1, noise: 0.35, release: 1.5 } },
    { name: 'Tubular Bell', values: { body: 5, hardness: 0.65, strike: 0.5, damping: 0.3, decay: 1.2, purity: 0.15, resonator: 0, beat: 0.25, noise: 0.5, release: 4 } },
    { name: 'Singing Bowl', values: { body: 6, hardness: 0.35, strike: 0.3, damping: 0.25, decay: 1.4, resonator: 0, beat: 0.75, noise: 0.15, release: 4 } },
    { name: 'Steel Pan', values: { body: 7, hardness: 0.55, strike: 0.45, damping: 0.55, decay: 1, resonator: 0.4, beat: 0.5, noise: 0.5, release: 1.5 } }
  ];

  /* ---------- shared helpers ---------- */
  const NOTES = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84];
  const NN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const nname = m => NN[m % 12] + (Math.floor(m / 12) - 1);
  function modes(P) {
    const b = BODIES[BN[P.get('body')]], h = P.get('hardness'), st = P.get('strike'), pu = P.get('purity'), dm = P.get('damping'), dc = P.get('decay');
    const fc = 650 * Math.pow(2, h * 5.4) * 2;
    const arr = b.modes.map(([r, a], k) => {
      const ratio = r + (Math.max(1, Math.round(r)) - r) * pu;
      let amp = a / Math.sqrt(1 + Math.pow(ratio * 440 / fc, 2)) * (0.3 + 0.7 * Math.abs(Math.sin(Math.PI * (k + 1) * (0.1 + 0.8 * st))));
      if (k === 0) amp = Math.max(amp, 0.25 * a);
      return { ratio, amp, tau: b.T0 * dc * (1 - 0.7 * dm) / (1 + k * dm * 1.3) * 1.6 + 0.02, k };
    });
    const mx = Math.max.apply(null, arr.map(m => m.amp)) || 1; arr.forEach(m => { m.amp /= mx; });
    return arr;
  }
  function ringOf(n, now, tau, rel) {
    if (n.on) return Math.exp(-(now - n.t0) / Math.max(0.05, tau));
    return Math.exp(-(n.tOff - n.t0) / Math.max(0.05, tau)) * Math.exp(-(now - n.tOff) / Math.max(0.05, rel * 0.25));
  }
  function tracker(P) {
    const S = { notes: new Map(), last: 60, hits: 0 };
    P.onNote(e => {
      const now = performance.now() / 1000;
      if (e.type === 'on') { S.notes.set(e.midi, { on: true, t0: now, vel: e.vel || 0.8, tOff: 0 }); S.last = e.midi; S.hits++; }
      else { const n = S.notes.get(e.midi); if (n && n.on) { n.on = false; n.tOff = now; } }
    });
    S.ring = (tau) => {
      const now = performance.now() / 1000, rel = P.get('release'); let mx = 0, age = 99;
      S.notes.forEach((n, k) => { const r = ringOf(n, now, tau, rel) * n.vel; if (r < 0.004 && !n.on) { S.notes.delete(k); return; } if (r > mx) { mx = r; age = now - n.t0; } });
      return { r: mx, age };
    };
    return S;
  }
  function wire(root, P) {
    $$(root, '[data-k]').forEach(c => {
      const id = c.dataset.k, t = $(c, '.ctl'), ty = c.dataset.t;
      if (!t) return;
      P.bind(t, id, ty === 'f' ? { abs: true, axis: 'y' } : ty === 'h' ? { abs: true, axis: 'x' } : { range: 170 });
      t.title = P.def(id).label;
      const v = $(c, '.vl'); if (v) P.text(v, id);
    });
  }
  function seg(root, P, sel) {
    const bs = $$(root, sel);
    bs.forEach(b => b.addEventListener('click', () => P.set('body', +b.dataset.m)));
    P.sub('body', v => bs.forEach(b => b.classList.toggle('on', +b.dataset.m === v)));
  }
  function pnav(root, P, o) {
    o = o || {};
    const n = P.presets.length; let cur = 0;
    const lst = $(root, '[data-plist]');
    if (lst) {
      lst.innerHTML = P.presets.map((p, i) => '<button data-i="' + i + '">' + (o.item ? o.item(p, i) : p.name) + '</button>').join('');
      lst.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) P.loadPreset(+b.dataset.i); });
    }
    const pv = $(root, '[data-prev]'), nx = $(root, '[data-next]');
    if (pv) pv.addEventListener('click', () => P.loadPreset((cur + n - 1) % n));
    if (nx) nx.addEventListener('click', () => P.loadPreset((cur + 1) % n));
    let first = true;
    P.onPreset((i, name) => {
      if (first) { first = false; if (i < 0) { P.loadPreset(0); return; } }
      if (i >= 0) cur = i;
      $$(root, '[data-pname]').forEach(e => { e.textContent = name || 'Custom'; });
      $$(root, '[data-pidx]').forEach(e => { e.textContent = String(i < 0 ? 1 : i + 1).padStart(2, '0') + '/' + String(n).padStart(2, '0'); });
      if (lst) $$(lst, '[data-i]').forEach(b => b.classList.toggle('cur', +b.dataset.i === i));
    });
  }
  const cell = (id, label, t, cls) => '<div class="' + (cls || 'kn') + '" data-k="' + id + '" data-t="' + (t || 'k') + '"><span class="vl"></span><div class="ctl ' + (t === 'f' ? 'fd' : 'dial') + '"></div><label>' + label + '</label></div>';
  const R = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  /* =========================================================== A — ORDINAL */
  function buildA(root, P) {
    const PAL = [['#1f8f89', '#35c4ba'], ['#1b7770', '#2aa39b'], ['#3a9fa0', '#8ee3de'], ['#4fb7b8', '#bdf4f0'], ['#177a6b', '#41c9a3'], ['#2a7f8f', '#58c2d3'], ['#1c8d94', '#6fe0d0'], ['#2f8f7e', '#58d2b6'], ['#25756d', '#3fb9ad']];
    const NUMS = NOTES.map((m, i) => String((i * 1371 + 421) % 9973).padStart(4, '0'));
    const L = i => 150 - i * 3.3;
    root.innerHTML = '<style>' + `
.A{position:absolute;inset:0;font-family:'Space Mono',ui-monospace,Menlo,Consolas,monospace;color:#d6f4f0;background:#0c1716;overflow:hidden}
.A:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,#ffffff05 0 1px,transparent 1px 4px)}
.A .hdr{position:absolute;left:24px;right:24px;top:10px;height:50px;display:flex;align-items:center;justify-content:space-between}
.A .logo{font-weight:700;font-size:34px;letter-spacing:2px;color:#2aa39b;display:flex;align-items:baseline;gap:10px;text-shadow:0 0 18px #2aa39b55}
.A .logo i{font-style:normal;font-size:34px;color:#d6f4f0;font-weight:400;opacity:.9}
.A .logo small{font-size:9px;letter-spacing:2px;color:#2aa39baa;font-weight:400;text-transform:uppercase;max-width:150px;line-height:1.3;margin-left:6px}
.A .pb{display:flex;align-items:center;gap:8px}
.A .pb button{all:unset;cursor:pointer;width:30px;height:30px;line-height:28px;text-align:center;border:1px solid #2aa39b;color:#2aa39b;font-size:16px}
.A .pb button:hover{background:#2aa39b33}
.A .pb .nm{width:330px;height:34px;border:1px solid #2aa39b88;background:#0a1110;padding:3px 10px;display:flex;flex-direction:column;justify-content:center}
.A .pb .nm i{font-style:normal;font-size:9px;letter-spacing:2px;color:#2aa39bcc}
.A .pb .nm b{font-size:14px;font-weight:700;color:#e8fbf8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.A .chips{position:absolute;left:24px;top:64px;width:912px;height:24px;display:flex;gap:4px}
.A .chips button{all:unset;box-sizing:border-box;cursor:pointer;flex:1;min-width:0;height:24px;line-height:22px;padding:0 6px;border:1px solid #2aa39b55;font-size:9px;color:#8bc9c4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.A .chips button i{font-style:normal;color:#2aa39b;margin-right:4px}
.A .chips button:hover{background:#2aa39b22}.A .chips button.cur{background:#2aa39b;color:#06100f;border-color:#2aa39b}.A .chips button.cur i{color:#06100f}
.A .frame{position:absolute;left:24px;top:96px;width:912px;height:246px;padding:10px;border-radius:6px;background:repeating-linear-gradient(92deg,#00000018 0 2px,transparent 2px 7px),repeating-linear-gradient(88deg,#ffffff0d 0 1px,transparent 1px 11px),linear-gradient(180deg,#a8733f,#7a4a26 50%,#8e5b30);box-shadow:inset 0 2px 0 #ffcf9a55,inset 0 -3px 0 #0006,0 6px 18px #0009}
.A .field{position:relative;width:892px;height:226px;background:linear-gradient(180deg,#0b1514,#122322);border-radius:3px;box-shadow:inset 0 0 0 2px #00000088,inset 0 6px 14px #000a}
.A .field svg{position:absolute;left:0;top:0}
.A .col{position:absolute;top:0;width:50px;height:226px;touch-action:none;cursor:pointer}
.A .bar{position:absolute;left:0;top:calc(80px - var(--L)/2);width:50px;height:var(--L);border-radius:4px;background:linear-gradient(90deg,var(--c1) 0,var(--c2) 22%,var(--c2) 50%,var(--c1) 100%);box-shadow:inset 0 0 0 1px #ffffff33,inset 0 -8px 12px #00000040,0 3px 5px #000a,0 0 calc(var(--g,0)*26px) calc(var(--g,0)*6px) #35e6d6aa;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:7px 0 5px;overflow:hidden;will-change:transform}
.A .bar:before{content:"";position:absolute;left:0;right:0;top:22.4%;height:1px;background:#0006;box-shadow:0 1px 0 #fff3}
.A .bar:after{content:"";position:absolute;left:0;right:0;bottom:22.4%;height:1px;background:#0006;box-shadow:0 1px 0 #fff3}
.A .num{writing-mode:vertical-rl;text-orientation:upright;font-size:9.5px;font-weight:700;letter-spacing:-1px;color:#04201e;text-shadow:0 1px 0 #fff4;line-height:1;white-space:nowrap;margin-top:2px}
.A .nt{font-size:10px;font-weight:700;color:#04201e;background:#ffffff40;padding:0 4px;border-radius:2px;position:relative;z-index:1}
.A .dot{position:absolute;left:50%;top:calc(10% + var(--sp)*80%);width:calc(8px + (1 - var(--hd))*10px);height:calc(8px + (1 - var(--hd))*10px);margin:-6px 0 0 -6px;border-radius:50%;background:radial-gradient(circle,#fff,#ffffff00 70%);opacity:.8;pointer-events:none;z-index:2}
.A .tube{position:absolute;left:11px;top:162px;width:28px;height:calc(14px + var(--tl)*46px);border-radius:0 0 14px 14px;background:linear-gradient(90deg,#0b3a37,#2aa39b 35%,#0d4a46 70%,#052321);opacity:calc(.1 + var(--rs)*.9);box-shadow:inset 0 0 0 1px #ffffff22}
.A .tube:before{content:"";position:absolute;left:0;right:0;top:-3px;height:7px;border-radius:50%;background:#031211;box-shadow:0 0 0 1px #2aa39b}
.A .mode{position:absolute;left:24px;top:350px;width:276px}
.A .panel{overflow:hidden;border:1px solid #2aa39b66;background:#0a1312;position:relative}
.A .panel>h4{margin:0;font-size:8.5px;font-weight:400;letter-spacing:2px;color:#2aa39b;padding:3px 8px;border-bottom:1px solid #2aa39b44;text-transform:uppercase}
.A .bodies{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;padding:5px}
.A .bodies button{all:unset;box-sizing:border-box;text-align:center;cursor:pointer;height:19px;line-height:17px;border:1px solid #2aa39b66;font-size:9px;letter-spacing:.5px;color:#8bc9c4;text-transform:uppercase}
.A .bodies button.on{background:#2aa39b;color:#04100f;font-weight:700}
.A .mode canvas{display:block;width:274px;height:76px}
.A .knobs{position:absolute;left:312px;top:350px;width:624px;display:flex;flex-direction:column;gap:6px}
.A .krow{display:flex;gap:6px}
.A .grp{border:1px solid #2aa39b55;background:#0a1312;position:relative;padding:17px 4px 3px;display:flex;justify-content:center;flex:var(--n)}
.A .grp>h4{position:absolute;left:0;top:0;margin:0;padding:2px 7px;font-size:8px;font-weight:400;letter-spacing:2px;background:#2aa39b;color:#04100f}
.A .kn{width:92px;display:flex;flex-direction:column;align-items:center;height:72px}
.A .vl{font-size:10px;font-weight:700;color:#7ff0e4;height:13px;white-space:nowrap}
.A label{font-size:8px;color:#8bc9c4;text-transform:uppercase;letter-spacing:.6px;margin-top:2px;text-align:center;line-height:1.1}
.A .dial{position:relative;width:34px;height:34px;margin:6px 0 2px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#2b4a48,#0b1a19);box-shadow:inset 0 0 0 2px #2aa39b,0 2px 4px #000a}
.A .dial:before{content:"";position:absolute;inset:-6px;border-radius:50%;background:conic-gradient(from -135deg,#35e6d6 calc(var(--v)*270deg),#2aa39b2a 0 270deg,transparent 0);-webkit-mask:radial-gradient(circle,transparent 20px,#000 21px);mask:radial-gradient(circle,transparent 20px,#000 21px)}
.A .dial:after{content:"";position:absolute;left:50%;top:3px;width:3px;height:12px;margin-left:-1.5px;background:#d6f4f0;transform-origin:50% 14px;transform:rotate(calc(-135deg + var(--v)*270deg))}
.A .foot{position:absolute;left:24px;right:24px;top:542px;height:14px;display:flex;justify-content:space-between;font-size:8.5px;letter-spacing:1.5px;color:#2aa39b99;text-transform:uppercase}
` + '</style><div class="A">' +
      '<div class="hdr"><div class="logo">ORDINAL<i>#</i><small>every bar carries its number</small></div>' +
      '<div class="pb"><button data-prev title="Previous">&lsaquo;</button><div class="nm"><i>INSCRIPTION <span data-pidx></span></i><b data-pname></b></div><button data-next title="Next">&rsaquo;</button></div></div>' +
      '<div class="chips" data-plist></div>' +
      '<div class="frame"><div class="field" id="fld"></div></div>' +
      '<div class="mode"><div class="panel"><h4>Body &middot; <span id="bn"></span></h4><div class="bodies">' + BN.map((b, i) => '<button data-m="' + i + '">' + b + '</button>').join('') + '</div></div>' +
      '<div class="panel" style="margin-top:6px"><h4>Partials &middot; ratio / ring</h4><canvas id="pc" width="548" height="152"></canvas></div></div>' +
      '<div class="knobs"><div class="krow">' +
      '<div class="grp" style="--n:3"><h4>&sect;1 MALLET</h4>' + cell('hardness', 'Hardness') + cell('strike', 'Strike Pos') + cell('noise', 'Mallet Noise') + '</div>' +
      '<div class="grp" style="--n:3"><h4>&sect;2 BAR</h4>' + cell('damping', 'Damping') + cell('decay', 'Ring Length') + cell('purity', 'Purity') + '</div></div>' +
      '<div class="krow"><div class="grp" style="--n:2"><h4>&sect;3 RESONATOR</h4>' + cell('resonator', 'Resonator') + cell('beat', 'Shimmer') + '</div>' +
      '<div class="grp" style="--n:2"><h4>&sect;4 MOTOR</h4>' + cell('tremolo', 'Tremolo') + cell('tremRate', 'Trem Rate') + '</div>' +
      '<div class="grp" style="--n:2"><h4>&sect;5 OUTPUT</h4>' + cell('release', 'Damper Rel') + cell('level', 'Level') + '</div></div></div>' +
      '<div class="foot"><span>strike a bar &middot; it is numbered, ordered, ringing</span><span id="ft"></span></div></div>';
    wire(root, P); seg(root, P, '.bodies button');
    pnav(root, P, { item: (p, i) => '<i>' + String(i + 1).padStart(4, '0') + '</i>' + p.name });
    P.onPreset((i, n) => { $(root, '#ft').textContent = 'inscription ' + String(Math.max(0, i) + 1).padStart(4, '0') + ' · ' + (n || 'custom'); });
    P.sub('body', v => { $(root, '#bn').textContent = BN[v]; });
    const fld = $(root, '#fld'), cols = [], X0 = (892 - (NOTES.length * 56 - 6)) / 2;
    let svg = '<svg width="892" height="226"><g stroke-linecap="round">';
    const cx0 = X0 + 25, cx1 = X0 + (NOTES.length - 1) * 56 + 25;
    [-0.2758, 0.2758].forEach(k => { svg += '<line x1="' + (X0 - 8) + '" y1="' + (80 + k * L(0) - (cx0 - X0 + 8) * (k * 3.3 / 56)) + '" x2="' + (cx1 + 33) + '" y2="' + (80 + k * L(14) + 33 * (k * 3.3 / 56) * 0) + '" stroke="#3a2412" stroke-width="5"/><line x1="' + (X0 - 8) + '" y1="' + (80 + k * L(0)) + '" x2="' + (cx1 + 33) + '" y2="' + (80 + k * L(14)) + '" stroke="#b07a46" stroke-width="2" opacity=".8"/>'; });
    svg += '</g></svg>';
    fld.innerHTML = svg;
    NOTES.forEach((m, i) => {
      const c = document.createElement('div'); c.className = 'col'; c.style.left = (X0 + i * 56) + 'px'; c.dataset.midi = m;
      c.style.setProperty('--L', L(i) + 'px'); c.style.setProperty('--tl', (L(i) / 150).toFixed(3));
      c.innerHTML = '<div class="tube"></div><div class="bar"><span class="nt">' + nname(m) + '</span><span class="num">#' + NUMS[i] + '</span><i class="dot"></i></div>';
      fld.appendChild(c); cols.push({ el: c, bar: c.firstChild.nextSibling, m });
      const held = new Map();
      c.addEventListener('pointerdown', e => { c.setPointerCapture(e.pointerId); const r = c.getBoundingClientRect(); const f = clamp((e.clientY - r.top) / r.height, 0, 1); held.set(e.pointerId, 1); P.noteOn(m, 0.45 + 0.5 * (1 - Math.abs(f - 0.4) * 1.4)); e.preventDefault(); });
      const up = e => { if (held.delete(e.pointerId)) P.noteOff(m); };
      c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
    });
    const sub = () => { const b = P.get('body'), pl = PAL[b]; fld.style.setProperty('--rs', Math.min(1, P.get('resonator') * (0.25 + 0.75 * BODIES[BN[b]].res / 0.9 + (BODIES[BN[b]].res === 0 ? 0.0 : 0)))); cols.forEach(o => { o.bar.style.setProperty('--c1', pl[0]); o.bar.style.setProperty('--c2', pl[1]); o.bar.style.setProperty('--hd', P.get('hardness')); o.bar.style.setProperty('--sp', P.get('strike')); o.el.firstChild.style.setProperty('--rs', fld.style.getPropertyValue('--rs')); }); };
    ['body', 'resonator', 'hardness', 'strike'].forEach(id => P.sub(id, sub));
    const S = tracker(P), pc = $(root, '#pc').getContext('2d');
    P.raf(t0 => {
      const now = performance.now() / 1000, ms = modes(P), tau = ms[0].tau, rel = P.get('release'), trem = P.get('tremolo'), tr = P.get('tremRate'), beat = P.get('beat');
      cols.forEach(o => {
        const n = S.notes.get(o.m); let g = 0;
        if (n) g = ringOf(n, now, tau, rel) * n.vel * (1 - trem * 0.5 * (0.5 - 0.5 * Math.cos(now * 2 * Math.PI * tr)));
        o.bar.style.setProperty('--g', g.toFixed(3)); o.bar.style.transform = g > 0.01 ? 'translateY(' + (Math.sin(now * 110) * g * 1.8).toFixed(2) + 'px)' : '';
        o.bar.style.filter = g > 0.01 ? 'brightness(' + (1 + g * 0.45).toFixed(2) + ')' : '';
      });
      const c = pc, W = 274, H = 76, rg = S.ring(tau).r;
      c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, W, H);
      c.strokeStyle = '#2aa39b22'; c.lineWidth = 1; c.beginPath(); for (let i = 1; i < 4; i++) { c.moveTo(0, H * i / 4); c.lineTo(W, H * i / 4); } c.stroke();
      const xr = r => 14 + Math.log2(r) / 4.4 * (W - 30);
      c.font = '8px "Space Mono",monospace'; c.textAlign = 'center';
      ms.forEach((m, i) => {
        const x = xr(m.ratio), h = (8 + m.amp * 40) * (0.55 + 0.45 * (rg > 0.01 ? rg : 0.55));
        const g = c.createLinearGradient(0, H - 16 - h, 0, H - 16); g.addColorStop(0, '#7ff0e4'); g.addColorStop(1, '#1f8f89'); c.fillStyle = g; c.fillRect(x - 3, H - 16 - h, 6, h);
        if (beat > 0.02) { const o = 3 + beat * 5 * (0.5 + 0.5 * Math.sin(now * 5 + i)); c.fillStyle = '#7ff0e455'; c.fillRect(x - 3 + o, H - 16 - h * 0.9, 3, h * 0.9); }
        c.fillStyle = '#2aa39b'; c.fillRect(x - 7, H - 15, 14 * Math.min(1, m.tau / 1.2) + 2, 3);
        c.fillStyle = '#8bc9c4'; c.fillText(m.ratio.toFixed(2), x, H - 3);
      });
    });
  }

  /* =========================================================== B — RODARMOR */
  

  /* =========================================================== C — MINTBELL */
  

  Kit.register('modal', {
    fonts: 'family=Space+Mono:wght@400;700&family=Cinzel:wght@500;700&family=Fredoka:wght@400;500;600;700',
    w: 960, h: 560, params, presets,
    faces: [
      { key: 'A', name: 'Ordinal', accent: '#2aa39b', build: buildA },
      undefined,
      undefined
    ].filter(Boolean)
  });
})();
