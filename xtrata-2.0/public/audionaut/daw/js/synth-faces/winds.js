import { Kit } from "./runtime.js";
/* winds — brass, reed and bowed sections. Real params from synths/reed/winds.js */
(function () {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const $ = (r, s) => r.querySelector(s), $$ = (r, s) => Array.from(r.querySelectorAll(s));
  const pct = v => Math.round(v * 100) + '%';
  const secs = v => (v < 1 ? Math.round(v * 1000) + ' ms' : v.toFixed(2) + ' s');
  const MODELS = ['brass', 'flute', 'reed', 'bowed'];
  const params = [
    { id: 'model', label: 'Model', options: MODELS, def: 0 },
    { id: 'brightness', label: 'Brightness', min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct },
    { id: 'swell', label: 'Bloom (filter swell)', min: 0, max: 1, step: 0.01, def: 0.6, fmt: pct },
    { id: 'accent', label: 'Attack Accent', min: 0, max: 1, step: 0.01, def: 0.35, fmt: pct },
    { id: 'attack', label: 'Attack', min: 0.005, max: 1.5, step: 0.005, def: 0.07, fmt: secs },
    { id: 'release', label: 'Release', min: 0.02, max: 2.5, step: 0.01, def: 0.18, fmt: secs },
    { id: 'breath', label: 'Breath / Bow Noise', min: 0, max: 1, step: 0.01, def: 0.25, fmt: pct },
    { id: 'nasal', label: 'Nasal (clarinet -> oboe)', min: 0, max: 1, step: 0.01, def: 0.3, fmt: pct },
    { id: 'body', label: 'Body Resonance', min: 0, max: 1, step: 0.01, def: 0.6, fmt: pct },
    { id: 'detune', label: 'Section Detune (cents)', min: 0, max: 30, step: 0.5, def: 7, fmt: v => v.toFixed(1) + ' ct' },
    { id: 'scoop', label: 'Pitch Scoop (st)', min: 0, max: 2, step: 0.05, def: 0.3, fmt: v => v.toFixed(2) + ' st' },
    { id: 'vibrato', label: 'Vibrato (cents)', min: 0, max: 60, step: 0.5, def: 10, fmt: v => v.toFixed(1) + ' ct' },
    { id: 'vibRate', label: 'Vibrato Rate (Hz)', min: 2, max: 8, step: 0.1, def: 5.2, fmt: v => v.toFixed(1) + ' Hz' },
    { id: 'vibDelay', label: 'Vibrato Delay (s)', min: 0, max: 1.5, step: 0.01, def: 0.25, fmt: secs },
    { id: 'level', label: 'Output Level', min: 0, max: 1.5, step: 0.01, def: 1, fmt: pct }
  ];
  const presets = [
    { name: 'Init (Brass Section)', values: {} },
    { name: 'Solo Trumpet', values: { model: 0, brightness: 0.68, swell: 0.85, accent: 0.6, attack: 0.035, release: 0.12, breath: 0.15, body: 0.75, detune: 0, scoop: 0.45, vibrato: 7, vibRate: 5.6, vibDelay: 0.35 } },
    { name: 'Mellow Horn', values: { model: 0, brightness: 0.22, swell: 0.45, accent: 0.1, attack: 0.14, release: 0.3, breath: 0.2, body: 0.5, detune: 4, scoop: 0.15, vibrato: 4, vibRate: 5, vibDelay: 0.5 } },
    { name: 'Concert Flute', values: { model: 1, brightness: 0.5, swell: 0.15, accent: 0.15, attack: 0.07, release: 0.12, breath: 0.45, body: 0.3, detune: 2, scoop: 0.05, vibrato: 16, vibRate: 5.4, vibDelay: 0.3 } },
    { name: 'Clarinet', values: { model: 2, nasal: 0, brightness: 0.4, swell: 0.3, accent: 0.2, attack: 0.04, release: 0.12, breath: 0.2, body: 0.5, detune: 2, scoop: 0.1, vibrato: 5, vibRate: 5, vibDelay: 0.5 } },
    { name: 'Oboe', values: { model: 2, nasal: 0.85, brightness: 0.55, swell: 0.35, accent: 0.25, attack: 0.05, release: 0.12, breath: 0.15, body: 0.8, detune: 2, scoop: 0.1, vibrato: 14, vibRate: 5.8, vibDelay: 0.25 } },
    { name: 'Solo Violin', values: { model: 3, brightness: 0.6, swell: 0.5, accent: 0.3, attack: 0.09, release: 0.2, breath: 0.35, body: 0.7, detune: 4, scoop: 0.25, vibrato: 22, vibRate: 5.8, vibDelay: 0.3 } },
    { name: 'Cello', values: { model: 3, brightness: 0.32, swell: 0.4, accent: 0.2, attack: 0.16, release: 0.3, breath: 0.3, body: 0.85, detune: 3, scoop: 0.12, vibrato: 14, vibRate: 5, vibDelay: 0.5 } }
  ];

  /* ---------- shared helpers ---------- */
  const G = 1.2; // display gate length (s)
  function hold(P, t) {
    const A = Math.max(0.005, P.get('attack')), ac = P.get('accent'), sus = 0.78;
    if (t < A) return Math.pow(t / A, 1.4);
    return sus + (1 + ac * 0.3 - sus) * Math.exp(-(t - A) / 0.12);
  }
  function envAmp(P, t, g) {
    g = g == null ? G : g;
    if (t <= g) return hold(P, t) / 1.3;
    return (hold(P, g) / 1.3) * Math.exp(-(t - g) * 5 / Math.max(0.02, P.get('release')));
  }
  function bloom(P, t, g) {
    g = g == null ? G : g;
    const b = P.get('brightness'), sw = P.get('swell'), A = P.get('attack');
    let v = b * ((1 - sw * 0.85) + sw * 0.85 * (1 - Math.exp(-t / (A + 0.25))));
    if (t > g) v *= Math.exp(-(t - g) * 3 / Math.max(0.02, P.get('release')));
    return v;
  }
  function tracker(P) {
    const S = { notes: new Map(), held: 0, t0: -99, tOff: -99, aRel: 0, last: 60 };
    P.onNote(e => {
      const now = performance.now() / 1000;
      if (e.type === 'on') { S.notes.set(e.midi, now); S.t0 = now; S.last = e.midi; }
      else {
        if (S.notes.has(e.midi)) { S.notes.delete(e.midi); if (!S.notes.size) { S.tOff = now; S.aRel = hold(P, Math.min(now - S.t0, 9)) / 1.3; } }
      }
      S.held = S.notes.size;
    });
    S.live = () => {
      const now = performance.now() / 1000;
      if (S.held) { const age = now - S.t0; return { tt: Math.min(age, G), age, amp: hold(P, age) / 1.3, on: true }; }
      const dt = now - S.tOff;
      if (S.tOff > 0 && dt < 4.2) return { tt: G + dt, age: now - S.t0, amp: S.aRel * Math.exp(-dt * 5 / Math.max(0.02, P.get('release'))), on: false, rel: true };
      return { tt: -1, age: 0, amp: 0, on: false };
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
    bs.forEach(b => b.addEventListener('click', () => P.set('model', +b.dataset.m)));
    P.sub('model', v => bs.forEach(b => b.classList.toggle('on', +b.dataset.m === v)));
  }
  function pnav(root, P, o) {
    o = o || {};
    const n = P.presets.length; let cur = 0;
    const lst = $(root, '[data-plist]');
    if (lst) {
      let lc = null;
      lst.innerHTML = P.presets.map((p, i) => {
        const h = p.cat && p.cat !== lc ? '<h5>' + p.cat + '</h5>' : ''; lc = p.cat || lc;
        return h + '<button data-i="' + i + '">' + (o.item ? o.item(p, i) : p.name) + '</button>';
      }).join('');
      lst.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) { P.loadPreset(+b.dataset.i); if (o.pick) o.pick(); } });
    }
    const pv = $(root, '[data-prev]'), nx = $(root, '[data-next]');
    if (pv) pv.addEventListener('click', () => P.loadPreset((cur + n - 1) % n));
    if (nx) nx.addEventListener('click', () => P.loadPreset((cur + 1) % n));
    let first = true;
    P.onPreset((i, name) => {
      if (first) { first = false; if (i < 0) { P.loadPreset(0); return; } }
      if (i >= 0) cur = i;
      $$(root, '[data-pname]').forEach(e => { e.textContent = name || 'Custom'; });
      $$(root, '[data-pidx]').forEach(e => { e.textContent = (i < 0 ? 1 : i + 1 + '').toString().padStart(2, '0') + '/' + String(n).padStart(2, '0'); });
      if (lst) $$(lst, '[data-i]').forEach(b => { b.classList.toggle('cur', +b.dataset.i === i); if (+b.dataset.i === i && lst.classList.contains('open')) b.scrollIntoView({ block: 'nearest' }); });
    });
  }
  const cell = (id, label, t, cls) => '<div class="' + (cls || 'kn') + '" data-k="' + id + '" data-t="' + (t || 'k') + '"><span class="vl"></span><div class="ctl ' + (t === 'f' ? 'fd' : t === 'h' ? 'trk' : 'dial') + '"></div><label>' + label + '</label></div>';
  const R = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  /* =========================================================== A — MUNEEB */
  function buildA(root, P) {
    root.innerHTML = '<style>' + `
.A{position:absolute;inset:0;font-family:'Playfair Display',Georgia,'Times New Roman',serif;color:#f1e4c0;background:radial-gradient(ellipse at 50% -20%,#34327e 0,#1a1850 42%,#0a0925 100%);overflow:hidden}
.A:before{content:"";position:absolute;inset:6px;border:1px solid #e0b24a66;border-radius:3px;pointer-events:none}
.A:after{content:"";position:absolute;inset:10px;border:1px solid #e0b24a22;pointer-events:none}
.A .hdr{position:absolute;left:24px;right:24px;top:12px;height:54px}
.A .logo{position:absolute;left:0;top:0}
.A .logo span{display:block;font-size:42px;line-height:44px;font-weight:700;font-style:italic;letter-spacing:.5px;background:linear-gradient(180deg,#fff0b8,#e0b24a 55%,#9c7424);-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:6px}
.A .logo small{display:block;font-size:8.5px;letter-spacing:3.2px;color:#e0b24acc;margin-top:0}
.A .plate{position:absolute;right:0;top:4px;height:44px;width:430px;display:flex;align-items:center;gap:6px;padding:0 8px;border:1px solid #e0b24a99;border-radius:3px;background:linear-gradient(180deg,#2a2870,#16143f);box-shadow:inset 0 0 0 3px #0a0925,inset 0 0 0 4px #e0b24a44}
.A .plate button{all:unset;cursor:pointer;color:#e0b24a;font-size:22px;width:26px;height:30px;text-align:center;line-height:28px;border-radius:2px}
.A .plate button:hover{background:#e0b24a22}
.A .pn{flex:1;text-align:center;min-width:0}
.A .pn i{display:block;font-style:normal;font-size:8px;letter-spacing:2.5px;color:#e0b24a99}
.A .pn b{display:block;font-size:17px;font-style:italic;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff3cf}
.A .plate .prog{width:auto;padding:0 10px;font-size:10px;letter-spacing:2px;border:1px solid #e0b24a88;height:26px;line-height:24px;text-transform:uppercase}
.A .plist{position:absolute;right:0;top:56px;width:340px;max-height:440px;overflow-y:auto;overscroll-behavior:contain;z-index:30;background:#12103a;border:1px solid #e0b24a;box-shadow:0 12px 30px #000c;padding:6px;display:none;scrollbar-color:#e0b24a66 #0a0925}
.A .plist.open{display:block}
.A .plist button{all:unset;display:block;box-sizing:border-box;width:100%;padding:5px 10px;cursor:pointer;font-size:14px;font-style:italic;color:#e8dcb8;border-bottom:1px solid #e0b24a22}
.A .plist h5{margin:6px 0 2px;padding:2px 10px;font:500 9px Georgia,serif;letter-spacing:3px;text-transform:uppercase;color:#e0b24a;border-bottom:1px solid #e0b24a66}
.A .plist button:hover{background:#e0b24a22}.A .plist button.cur{color:#14123a;background:#e0b24a;font-weight:700}
.A .stage{position:absolute;left:24px;top:76px;width:560px;height:226px;border:1px solid #e0b24a88;box-shadow:0 0 0 3px #0a0925,0 0 0 4px #e0b24a44;overflow:hidden}
.A .stage canvas{width:560px;height:226px;display:block}
.A .stage .cap{position:absolute;left:10px;top:7px;font-size:9px;letter-spacing:2.5px;color:#e0b24acc;text-transform:uppercase}
.A .stage .cap2{position:absolute;right:10px;bottom:6px;font-size:10px;font-style:italic;color:#e0b24aaa}
.A .rt{position:absolute;left:600px;top:76px;width:336px;height:226px}
.A .tabs{display:flex;height:34px;border:1px solid #e0b24a88}
.A .tabs button{all:unset;box-sizing:border-box;flex:1;text-align:center;cursor:pointer;font-size:12px;letter-spacing:2px;text-transform:uppercase;line-height:32px;color:#e0b24aaa;border-right:1px solid #e0b24a44}
.A .tabs button:last-child{border:0}
.A .tabs button.on{color:#14123a;background:linear-gradient(180deg,#f3d27a,#c4952f);font-weight:700}
.A .env{margin-top:6px;border:1px solid #e0b24a66;height:134px;position:relative;background:#0e0c33}
.A .env canvas{width:334px;height:132px;display:block}
.A .env em{position:absolute;left:8px;top:4px;font-size:8.5px;letter-spacing:2px;font-style:normal;color:#e0b24acc;text-transform:uppercase}
.A .scp{margin-top:6px;border:1px solid #e0b24a66;height:46px;background:#0e0c33;position:relative}
.A .scp canvas{width:334px;height:44px;display:block}
.A .rack{position:absolute;left:24px;top:312px;width:912px;height:124px;display:flex;gap:8px;justify-content:space-between}
.A .grp{position:relative;border:1px solid #e0b24a77;padding:16px 10px 6px;display:flex;gap:2px;background:linear-gradient(180deg,#201e5a55,#0e0c3355)}
.A .grp>h4{position:absolute;left:50%;top:-1px;transform:translate(-50%,-50%);margin:0;padding:0 8px;background:#16143f;font-size:9px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:#e0b24a}
.A .kn{width:56px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;height:100px}
.A .vl{font-size:10px;height:13px;color:#ffe9a8;font-variant-numeric:tabular-nums;white-space:nowrap}
.A label{font-size:9px;letter-spacing:.6px;text-align:center;line-height:1.05;color:#e0b24acc;margin-top:5px;text-transform:uppercase}
.A .dial{position:relative;width:40px;height:40px;margin-top:7px;margin-bottom:3px;border-radius:50%;background:conic-gradient(from 200deg,#f8e49c,#9a7222 22%,#f0cf78 48%,#7e5a18 74%,#f8e49c);box-shadow:0 3px 5px #000a,inset 0 0 0 2px #0007,inset 0 0 0 4px #ffffff22}
.A .dial:before{content:"";position:absolute;inset:-6px;border-radius:50%;background:conic-gradient(from -135deg,#ffd35c calc(var(--v)*270deg),#ffffff1c 0 270deg,transparent 0);-webkit-mask:radial-gradient(circle,transparent 23px,#000 24px);mask:radial-gradient(circle,transparent 23px,#000 24px)}
.A .dial:after{content:"";position:absolute;left:50%;top:3px;width:3px;height:14px;margin-left:-1.5px;border-radius:2px;background:#1a1030;transform-origin:50% 17px;transform:rotate(calc(-135deg + var(--v)*270deg))}
.A .dial.drag{filter:brightness(1.15)}
.A .fd{position:relative;width:22px;height:60px;margin:6px 0 0}
.A .fd:before{content:"";position:absolute;left:9px;top:0;bottom:0;width:4px;background:linear-gradient(90deg,#000,#1d1b52);border:1px solid #e0b24a66}
.A .fd:after{content:"";position:absolute;left:1px;width:20px;height:12px;bottom:calc(var(--v)*(100% - 12px));border-radius:2px;background:linear-gradient(180deg,#f8e49c,#a07a24 55%,#e0b24a);box-shadow:0 2px 3px #000a}
.A .keys{position:absolute;left:24px;top:446px;width:912px;height:84px;border:1px solid #e0b24a99;border-top:5px solid #7a1f33;background:#0a0925}
.A .keys .kb-w{background:linear-gradient(180deg,#fffaf0,#efe3c4 90%,#d8c898);border:1px solid #14123a;border-top:0;border-radius:0 0 3px 3px}
.A .keys .kb-w.on{background:linear-gradient(180deg,#f3d27a,#e0b24a)}
.A .keys .kb-b{background:linear-gradient(180deg,#05040f,#26244e);border-radius:0 0 3px 3px;box-shadow:0 2px 3px #000b}
.A .keys .kb-b.on{background:#e0b24a}
.A .foot{position:absolute;left:24px;right:24px;top:536px;height:16px;display:flex;justify-content:space-between;font-size:9.5px;font-style:italic;color:#e0b24a99;letter-spacing:.4px}
` + '</style>' +
      '<div class="A">' +
      '<div class="hdr"><div class="logo"><span>Muneeb</span><small>CONCERT HALL &middot; BRASS &middot; REED &middot; BOWED</small></div>' +
      '<div class="plate"><button data-prev title="Previous programme">&lsaquo;</button><div class="pn"><i data-pidx></i><b data-pname></b></div><button data-next title="Next programme">&rsaquo;</button><button class="prog" data-open>Programme</button></div>' +
      '<div class="plist" data-plist></div></div>' +
      '<div class="stage"><canvas id="st" width="1120" height="452"></canvas><div class="cap">Stage plan &middot; <span id="sec"></span></div><div class="cap2">Podium</div></div>' +
      '<div class="rt"><div class="tabs">' + MODELS.map((m, i) => '<button data-m="' + i + '">' + m + '</button>').join('') + '</div>' +
      '<div class="env"><canvas id="ev" width="668" height="264"></canvas><em>Dynamics &amp; bloom</em></div>' +
      '<div class="scp"><canvas id="sc" width="668" height="88"></canvas></div></div>' +
      '<div class="rack">' +
      '<div class="grp"><h4>Timbre</h4>' + cell('brightness', 'Brightness') + cell('swell', 'Bloom') + cell('nasal', 'Nasal') + cell('body', 'Body') + '</div>' +
      '<div class="grp"><h4>Breath</h4>' + cell('breath', 'Breath / Bow') + cell('accent', 'Attack Accent') + cell('scoop', 'Pitch Scoop') + cell('detune', 'Section Detune') + '</div>' +
      '<div class="grp"><h4>Vibrato</h4>' + cell('vibrato', 'Depth') + cell('vibRate', 'Rate') + cell('vibDelay', 'Delay') + '</div>' +
      '<div class="grp"><h4>Envelope</h4>' + cell('attack', 'Attack', 'f') + cell('release', 'Release', 'f') + cell('level', 'Output', 'f') + '</div>' +
      '</div>' +
      '<div class="keys" id="kb"></div>' +
      '<div class="foot"><span>House lights down &middot; silence your phones &middot; the section awaits the downbeat</span><span id="ft"></span></div>' +
      '</div>';
    wire(root, P); seg(root, P, '.tabs button');
    const pl = $(root, '.plist');
    $(root, '[data-open]').addEventListener('click', () => { pl.classList.toggle('open'); const c = $(pl, '.cur'); if (c && pl.classList.contains('open')) c.scrollIntoView({ block: 'nearest' }); });
    pnav(root, P, { pick: () => pl.classList.remove('open'), item: (p, i) => (i + 1) + '. ' + p.name });
    P.keyboard($(root, '#kb'), { from: 48, octaves: 3 });
    const S = tracker(P);
    P.sub('model', v => { $(root, '#sec').textContent = MODELS[v] + ' section · 24 players'; });
    P.onPreset((i, n) => { $(root, '#ft').textContent = 'Tonight’s programme: ' + (n || 'Custom'); });
    P.scope($(root, '#sc'), { color: '#ffd35c', glow: 6, width: 2, grid: '#e0b24a1c', gain: 2.4 });

    const rnd = R(11), rows = [[6, 62], [8, 102], [10, 142]], pls = [];
    rows.forEach(([n, r], ri) => { for (let i = 0; i < n; i++) pls.push({ a: Math.PI * (1.07 + 0.86 * (i / (n - 1))), r, ri, rnd: rnd() * 2 - 1, ph: rnd() * 6.28 }); });
    const cols = ['#e0b24a', '#d7dfee', '#b9774a', '#d98a4b'];
    const cs = $(root, '#st').getContext('2d'), ce = $(root, '#ev').getContext('2d');
    const CX = 280, CY = 196;
    P.raf(() => {
      const t = performance.now() / 1000, L = S.live(), m = P.get('model');
      const bri = P.get('brightness'), det = P.get('detune'), vib = P.get('vibrato'), vr = P.get('vibRate'), vd = P.get('vibDelay');
      const c = cs; c.setTransform(2, 0, 0, 2, 0, 0);
      let g = c.createLinearGradient(0, 0, 0, 226); g.addColorStop(0, '#1d1b58'); g.addColorStop(1, '#0a0927'); c.fillStyle = g; c.fillRect(0, 0, 560, 226);
      // hall arches
      c.strokeStyle = '#e0b24a22'; c.lineWidth = 1;
      for (let k = 0; k < 7; k++) { c.beginPath(); c.ellipse(CX, CY + 30, 120 + k * 26, 90 + k * 20, 0, Math.PI, 2 * Math.PI); c.stroke(); }
      for (let k = 0; k < 15; k++) { const a = Math.PI * (1.02 + 0.96 * k / 14); c.beginPath(); c.moveTo(CX + Math.cos(a) * 80, CY + 20 + Math.sin(a) * 60); c.lineTo(CX + Math.cos(a) * 300, CY + 20 + Math.sin(a) * 230); c.stroke(); }
      // spotlight
      const gl = 0.1 + L.amp * 0.35 + bri * 0.08;
      g = c.createRadialGradient(CX, CY - 40, 10, CX, CY - 40, 230); g.addColorStop(0, 'rgba(255,224,150,' + gl + ')'); g.addColorStop(1, 'rgba(255,224,150,0)'); c.fillStyle = g; c.fillRect(0, 0, 560, 226);
      // stage floor
      g = c.createRadialGradient(CX, CY, 20, CX, CY, 280); g.addColorStop(0, '#6a4a20'); g.addColorStop(1, '#241a16');
      c.fillStyle = g; c.beginPath(); c.ellipse(CX, CY + 8, 275, 126, 0, Math.PI * 0.96, Math.PI * 2.04); c.lineTo(CX + 275, 232); c.lineTo(CX - 275, 232); c.closePath(); c.fill();
      c.strokeStyle = '#e0b24a55'; c.stroke();
      // players
      const ramp = clamp((L.age - vd) / 0.6, 0, 1) * (L.on ? 1 : L.rel ? 0.6 : 0);
      pls.forEach(p => {
        const spread = p.rnd * det / 30 * 9;
        const px = CX + Math.cos(p.a) * (p.r * 1.9 + spread), py = CY + Math.sin(p.a) * (p.r * 0.92 + spread * 0.5);
        const face = Math.atan2(CY + 14 - py, CX - px);
        const sway = Math.sin(t * 2 * Math.PI * vr + p.ph) * (vib / 60) * 0.9 * ramp;
        const lit = clamp(L.amp * 1.15, 0, 1);
        if (lit > 0.02) { g = c.createRadialGradient(px, py, 1, px, py, 20); g.addColorStop(0, 'rgba(255,214,110,' + (0.55 * lit) + ')'); g.addColorStop(1, 'rgba(255,214,110,0)'); c.fillStyle = g; c.fillRect(px - 22, py - 22, 44, 44); }
        // chair
        c.fillStyle = '#0b0a24'; c.beginPath(); c.ellipse(px, py + 3, 9, 5, 0, 0, 7); c.fill();
        c.save(); c.translate(px, py); c.rotate(face + sway);
        c.strokeStyle = cols[m]; c.fillStyle = cols[m]; c.lineWidth = 2; c.lineCap = 'round';
        if (m === 0) { c.beginPath(); c.moveTo(4, 0); c.lineTo(13, 0); c.stroke(); c.beginPath(); c.moveTo(13, 0); c.lineTo(18, -4.5); c.lineTo(18, 4.5); c.closePath(); c.fill(); }
        else if (m === 1) { c.save(); c.rotate(-Math.PI / 2 + 0.25); c.lineWidth = 2.4; c.beginPath(); c.moveTo(-10, 0); c.lineTo(11, 0); c.stroke(); c.restore(); }
        else if (m === 2) { c.lineWidth = 2.6; c.beginPath(); c.moveTo(4, 0); c.lineTo(16, 0); c.stroke(); c.fillStyle = '#2a1608'; c.fillRect(14, -2, 4, 4); }
        else { c.beginPath(); c.ellipse(9, 0, 6, 4, 0, 0, 7); c.fill(); const bw = Math.sin(t * 7 + p.ph) * 4 * (L.on ? 1 : 0.2); c.strokeStyle = '#fff3cf'; c.lineWidth = 1; c.beginPath(); c.moveTo(6 + bw, -9); c.lineTo(11 + bw, 9); c.stroke(); }
        c.restore();
        c.fillStyle = p.ri === 0 ? '#2c2a78' : '#1d1b58'; c.strokeStyle = cols[m]; c.lineWidth = 1.5;
        c.beginPath(); c.arc(px, py, 6.5, 0, 7); c.fill(); c.stroke();
        if (Math.abs(spread) > 1.2) { c.strokeStyle = cols[m] + '55'; c.beginPath(); c.arc(px, py, 6.5 + Math.abs(spread) * 0.5, 0, 7); c.stroke(); }
      });
      // podium + baton
      c.fillStyle = '#3a0f1c'; c.strokeStyle = '#e0b24a'; c.lineWidth = 1.5;
      c.beginPath(); c.ellipse(CX, CY + 36, 24, 8, 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#5a1628'; c.fillRect(CX - 24, CY + 24, 48, 12); c.strokeRect(CX - 24, CY + 24, 48, 12);
      c.beginPath(); c.ellipse(CX, CY + 24, 24, 8, 0, 0, 7); c.fillStyle = '#7a1f33'; c.fill(); c.stroke();
      const swing = Math.sin(t * 5) * (L.on ? 0.5 : 0.08) - Math.PI / 2 + (L.on ? Math.sin(t * 2.5) * 0.25 : 0);
      c.fillStyle = '#e8dcb8'; c.beginPath(); c.arc(CX, CY + 6, 7, 0, 7); c.fill(); c.fillStyle = '#14123a'; c.fillRect(CX - 8, CY + 11, 16, 12);
      c.strokeStyle = '#fff3cf'; c.lineWidth = 2; c.beginPath(); c.moveTo(CX + 8, CY + 14); c.lineTo(CX + 8 + Math.cos(swing) * 22, CY + 14 + Math.sin(swing) * 22); c.stroke();

      // envelope panel
      const e = ce; e.setTransform(2, 0, 0, 2, 0, 0); e.clearRect(0, 0, 334, 132);
      const L0 = 26, W2 = 298, T0 = 16, H2 = 90;
      e.strokeStyle = '#e0b24a22'; e.lineWidth = 1; e.beginPath(); for (let i = 0; i <= 4; i++) { e.moveTo(L0, T0 + H2 * i / 4); e.lineTo(L0 + W2, T0 + H2 * i / 4); } e.stroke();
      const xs = tt => L0 + Math.sqrt(tt / 4) * W2;
      e.fillStyle = '#e0b24a99'; e.font = '8px Georgia,serif'; e.textAlign = 'center';
      [0.25, 0.5, 1, 2, 4].forEach(tt => { e.fillText(tt + 's', xs(tt), 124); e.strokeStyle = '#e0b24a18'; e.beginPath(); e.moveTo(xs(tt), T0); e.lineTo(xs(tt), T0 + H2); e.stroke(); });
      e.beginPath(); e.moveTo(L0, T0 + H2);
      for (let i = 0; i <= 120; i++) { const tt = 4 * (i / 120) * (i / 120); e.lineTo(xs(tt), T0 + H2 * (1 - clamp(envAmp(P, tt), 0, 1.05))); }
      e.lineTo(L0 + W2, T0 + H2); g = e.createLinearGradient(0, T0, 0, T0 + H2); g.addColorStop(0, 'rgba(255,211,92,.55)'); g.addColorStop(1, 'rgba(255,211,92,.04)'); e.fillStyle = g; e.fill();
      e.strokeStyle = '#ffd35c'; e.lineWidth = 2; e.beginPath();
      for (let i = 0; i <= 120; i++) { const tt = 4 * (i / 120) * (i / 120); const yy = T0 + H2 * (1 - clamp(envAmp(P, tt), 0, 1.05)); i ? e.lineTo(xs(tt), yy) : e.moveTo(xs(tt), yy); } e.stroke();
      e.strokeStyle = '#9fb6ff'; e.setLineDash([3, 3]); e.lineWidth = 1.4; e.beginPath();
      for (let i = 0; i <= 120; i++) { const tt = 4 * (i / 120) * (i / 120); const yy = T0 + H2 * (1 - clamp(bloom(P, tt), 0, 1.05)); i ? e.lineTo(xs(tt), yy) : e.moveTo(xs(tt), yy); } e.stroke(); e.setLineDash([]);
      e.textAlign = 'left'; e.fillStyle = '#ffd35c'; e.fillText('— dynamics', 160, 11); e.fillStyle = '#9fb6ff'; e.fillText('- - bloom', 224, 11);
      e.strokeStyle = '#e0b24a66'; e.beginPath(); e.moveTo(xs(G), T0); e.lineTo(xs(G), T0 + H2); e.stroke();
      if (L.tt >= 0) { const x = xs(L.tt); e.strokeStyle = '#fff'; e.lineWidth = 1.2; e.beginPath(); e.moveTo(x, T0); e.lineTo(x, T0 + H2); e.stroke(); e.fillStyle = '#fff'; e.beginPath(); e.arc(x, T0 + H2 * (1 - clamp(L.amp, 0, 1.05)), 3.4, 0, 7); e.fill(); }
    });
  }

  /* =========================================================== B — MAINNET */
  

  /* =========================================================== C — BULLRUN */
  

  Kit.register('winds', {
    fonts: 'family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Orbitron:wght@500;700;900&family=Alfa+Slab+One',
    w: 960, h: 560, params, presets,
    faces: [
      { key: 'A', name: 'Muneeb', accent: '#e0b24a', build: buildA },
      undefined,
      undefined
    ].filter(Boolean)
  });
})();
