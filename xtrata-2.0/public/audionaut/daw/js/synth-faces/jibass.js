import { Kit } from "./runtime.js";
/* jibass.js - jiBASS (twin detuned saws + sub, drive into resonant filter) : Halving / Whale / Hodl */
(function () {
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const pct = v => Math.round(v * 100) + '%';
  const tm = v => v < 1 ? Math.round(v * 1000) + ' ms' : v.toFixed(2) + ' s';
  const hz = v => v >= 1000 ? (v / 1000).toFixed(2) + ' kHz' : Math.round(v) + ' Hz';
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  const params = [
    { id: 'wave', label: 'Main Wave', options: ['sawtooth', 'square'], def: 0 },
    { id: 'subWave', label: 'Sub Wave (-12 st)', options: ['square', 'sine', 'triangle'], def: 0 },
    { id: 'root', label: 'Note = (pitch reference)', options: ['sub', 'main'], def: 0 },
    { id: 'subLevel', label: 'Sub Mix', min: 0, max: 1, step: 0.01, def: 0.8, fmt: pct },
    { id: 'detune', label: 'Thicken (cents)', min: 0, max: 50, step: 1, def: 15, fmt: v => v + ' ct' },
    { id: 'punch', label: 'Punch (pitch drop, st)', min: 0, max: 12, step: 0.5, def: 0, fmt: v => v.toFixed(1) + ' st' },
    { id: 'cutoff', label: 'Cutoff', min: 40, max: 8000, step: 10, def: 150, log: true, fmt: hz },
    { id: 'reso', label: 'Resonance', min: 0, max: 20, step: 0.1, def: 6, fmt: v => 'Q ' + v.toFixed(1) },
    { id: 'envMod', label: 'Env Mod Amount', min: 0, max: 8000, step: 10, def: 3500, fmt: hz },
    { id: 'fAttack', label: 'Filter Attack', min: 0.002, max: 1, step: 0.002, def: 0.02, fmt: tm },
    { id: 'fDecay', label: 'Filter Decay', min: 0.01, max: 2, step: 0.01, def: 0.35, fmt: tm },
    { id: 'keyTrack', label: 'Key Track', min: 0, max: 1, step: 0.01, def: 0.4, fmt: pct },
    { id: 'attack', label: 'Amp Attack', min: 0.002, max: 1, step: 0.002, def: 0.01, fmt: tm },
    { id: 'decay', label: 'Amp Decay', min: 0.01, max: 2, step: 0.01, def: 0.4, fmt: tm },
    { id: 'sustain', label: 'Amp Sustain', min: 0, max: 1, step: 0.01, def: 0.3, fmt: pct },
    { id: 'release', label: 'Amp Release', min: 0.01, max: 2, step: 0.01, def: 0.15, fmt: tm },
    { id: 'drive', label: 'Drive', min: 0, max: 1, step: 0.01, def: 0.6, fmt: pct },
    { id: 'driveAt', label: 'Drive Position', options: ['pre', 'post'], def: 0 },
    { id: 'level', label: 'Output Level', min: 0, max: 1.5, step: 0.01, def: 1, fmt: pct }
  ];
  // presets come from the synth def (P.presets); the face keeps no copy of its own

  function wire(root, P) {
    root.querySelectorAll('[data-p]').forEach(el => {
      const o = {}; const a = el.dataset.abs;
      if (a) { o.abs = true; o.axis = a; } else { if (el.dataset.ax) o.axis = el.dataset.ax; if (el.dataset.rg) o.range = +el.dataset.rg; }
      P.bind(el, el.dataset.p, o);
    });
    root.querySelectorAll('[data-r]').forEach(el => P.text(el, el.dataset.r));
    root.querySelectorAll('[data-set]').forEach(el => {
      const [id, v] = el.dataset.set.split(':'); el.addEventListener('click', () => P.set(id, +v)); el.tabIndex = 0; el.setAttribute('role', 'button');
      P.sub(id, val => el.classList.toggle('on', val === +v));
    });
    const n = P.presets.length; let cur = 0;
    const lists = [...root.querySelectorAll('[data-plist]')];
    lists.forEach(l => {
      const tag = l.dataset.plist || 'div';
      P.presets.forEach((p, i) => {
        const e = document.createElement(tag); e.className = 'pi'; e.dataset.i = i; e.title = p.name;
        e.innerHTML = (l.dataset.tpl ? l.dataset.tpl : '').replace('{n}', p.name).replace('{i}', String(i + 1).padStart(2, '0'));
        e.addEventListener('click', () => P.loadPreset(i)); l.appendChild(e);
      });
    });
    root.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => P.loadPreset((cur + n - 1) % n)));
    root.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => P.loadPreset((cur + 1) % n)));
    P.onPreset((i, name) => {
      if (i < 0 && !wire.once) { wire.once = 1; P.loadPreset(0); return; }
      cur = i < 0 ? 0 : i;
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = i < 0 ? 'Edited' : name; });
      root.querySelectorAll('[data-pnum]').forEach(e => { e.textContent = String(cur + 1).padStart(2, '0') + '/' + String(n).padStart(2, '0'); });
      lists.forEach(l => [...l.children].forEach(c => c.classList.toggle('on', +c.dataset.i === i)));
    });
  }

  /* shared note/envelope tracker */
  function tracker(P) {
    const J = { midi: 36, t0: performance.now() - 200, user: -1e9, held: new Set(), offAt: null, hits: 0, pings: [] };
    P.onNote(e => {
      if (e.type === 'on') { J.midi = e.midi; J.t0 = performance.now(); J.user = J.t0; J.offAt = null; J.held.add(e.midi); J.hits++; J.pings.push(J.t0); if (J.pings.length > 6) J.pings.shift(); if (J.onhit) J.onhit(); }
      else { J.held.delete(e.midi); if (e.midi === J.midi) J.offAt = performance.now(); }
    });
    J.frame = () => {
      const now = performance.now();
      if (now - J.t0 > 4200 && now - J.user > 7000) { J.t0 = now; J.offAt = now + 900; J.pings.push(now); if (J.pings.length > 6) J.pings.shift(); J.demo = true; } else if (now - J.user < 7000) J.demo = false;
      const kt = Math.pow(2, ((J.midi - 36) / 12) * P.get('keyTrack'));
      const b = clamp(P.get('cutoff') * kt, 20, 18000), pk = clamp(b + P.get('envMod') * kt * 0.9, b, 20000);
      const t = (now - J.t0) / 1000, A = P.get('fAttack'), D = P.get('fDecay');
      let f = b; if (t < A) f = b * Math.pow(pk / b, t / A); else if (t < A + D) f = pk * Math.pow(b / pk, (t - A) / D);
      J.b = b; J.pk = pk; J.f = f;
      // amp level 0..1 (relative)
      const a = P.get('attack'), d = P.get('decay'), s = Math.max(0.0001, P.get('sustain')), r = P.get('release');
      let lv = t < a ? t / a : t < a + d ? Math.pow(s, (t - a) / d) : s;
      const gateOn = J.offAt == null || now < J.offAt;
      if (!gateOn) { const to = (J.offAt - J.t0) / 1000; const lo = to < a ? to / a : to < a + d ? Math.pow(s, (to - a) / d) : s; lv = lo * Math.exp(-6.9 * ((now - J.offAt) / 1000) / r); }
      J.amp = lv; J.t = t; J.gate = gateOn && J.t < 30;
      return J;
    };
    return J;
  }
  /* band spectrum model: 'n' log bands 30Hz..12kHz -> 0..~1.3 */
  function spectrumModel(P, J, n, fcOverride) {
    const f0 = mtof(J.midi), main = P.get('root') ? f0 : f0 * 2, sub = main / 2;
    const fc = fcOverride || J.f, Q = 0.6 + P.get('reso') * 0.55, drv = P.get('drive'), post = P.get('driveAt') === 1;
    const sq = P.get('wave') === 1, out = [];
    for (let i = 0; i < n; i++) {
      const f = 30 * Math.pow(400, (i + 0.5) / n);
      let a = f < main * 0.7 ? 0 : Math.min(1, main / f) * (sq ? 0.75 : 1);
      a += P.get('subLevel') * 0.95 * Math.exp(-Math.pow(Math.log2(f / sub), 2) / 0.2);
      a += P.get('detune') / 50 * 0.15 * Math.exp(-Math.pow(Math.log2(f / main), 2) / 0.25);
      const dr = x => Math.pow(Math.min(1.5, x), 1 - 0.55 * drv) * (1 + 0.1 * drv);
      const r = f / fc, h = 1 / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(r / Q, 2));
      if (!post) { a = dr(a); a *= Math.min(h, 3.2) / 1.0; } else { a *= Math.min(h, 3.2); a = dr(a); }
      out.push(Math.min(1.35, a));
    }
    return out;
  }
  function envPlots(P) { // returns {filt:[[t,v]..], amp:[...]} normalised x 0..1, y 0..1
    const A = P.get('fAttack'), D = P.get('fDecay'), em = P.get('envMod'), b = P.get('cutoff');
    const fa = [], tot = (A + D) * 1.25; const top = Math.log(b + em) , bot = Math.log(40), lo = Math.log(b);
    const ny = f => (Math.log(f) - bot) / (Math.log(8000 + 8000) - bot);
    for (let i = 0; i <= 60; i++) { const t = i / 60 * tot; let f = b; if (t < A) f = b * Math.pow((b + em) / b, t / A); else if (t < A + D) f = (b + em) * Math.pow(b / (b + em), (t - A) / D); fa.push([i / 60, ny(f)]); }
    const a = P.get('attack'), d = P.get('decay'), s = P.get('sustain'), r = P.get('release'), hold = 0.35, T = a + d + hold + r, pa = [];
    pa.push([0, 0]); pa.push([a / T, 1]); pa.push([(a + d) / T, s]); pa.push([(a + d + hold) / T, s]); pa.push([1, 0]);
    return { filt: fa, amp: pa };
  }
  function K(id, label, cls) {
    return '<div class="kw ' + (cls || '') + '"><div class="kn" data-p="' + id + '"><i class="ring"></i><i class="cap"><b class="pt"></b></i></div><span class="kl">' + label + '</span><span class="kv" data-r="' + id + '"></span></div>';
  }
  function F(id, label, cls) {
    return '<div class="fw ' + (cls || '') + '"><div class="fd" data-p="' + id + '" data-abs="y"><i class="fill"></i><i class="th"></i></div><span class="kl">' + label + '</span><span class="kv" data-r="' + id + '"></span></div>';
  }
  const SEG = (id, labels) => '<div class="seg">' + labels.map((l, i) => '<button data-set="' + id + ':' + i + '">' + l + '</button>').join('') + '</div>';

  /* =====================================================================
   * A  HALVING
   * ===================================================================== */
  

  /* =====================================================================
   * B  WHALE
   * ===================================================================== */
  function buildB(root, P) {
    const pill = (id, labels) => '<div class="pills">' + labels.map((l, i) => '<button data-set="' + id + ':' + i + '">' + l + '</button>').join('') + '</div>';
    root.innerHTML = `<style>
.wh{position:absolute;inset:0;font-family:Rubik,'Segoe UI',Helvetica,Arial,sans-serif;color:#bdeaf5;overflow:hidden;
 background:radial-gradient(ellipse at 30% 35%,#0d4466 0,#072a40 45%,#031521 100%);border-radius:18px}
.wh *{position:relative}
.wh:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 90%,#5ad1e610 0 40px,#0000 41px),radial-gradient(circle at 70% 85%,#5ad1e60c 0 70px,#0000 71px),radial-gradient(circle at 88% 20%,#5ad1e60a 0 30px,#0000 31px);pointer-events:none}
.wh:after{content:"";position:absolute;inset:3px;border:2px solid #0e4a6b;border-radius:16px;pointer-events:none}
.logo{position:absolute;left:30px;top:14px;font-size:42px;font-weight:800;letter-spacing:-.02em;color:#5ad1e6;line-height:1;text-shadow:0 0 22px #5ad1e655}
.logo small{display:block;margin-top:5px;font-size:10px;font-weight:500;letter-spacing:.24em;color:#3f8ca3;text-shadow:none}
.dep{position:absolute;left:300px;top:20px;font-size:10px;letter-spacing:.2em;color:#3f8ca3;line-height:1.5}
.dep b{display:block;font-size:22px;font-weight:600;letter-spacing:.02em;color:#bdeaf5}
.pb{position:absolute;right:30px;top:16px;display:flex;align-items:center;gap:8px}
.pb button{width:32px;height:32px;border-radius:50%;background:#072a40;border:2px solid #5ad1e6;color:#5ad1e6;font-size:12px;cursor:pointer;padding:0}
.pb button:hover{background:#5ad1e6;color:#072a40}
.pn{width:180px;height:34px;border-radius:17px;background:#041c2c;border:1px solid #0e4a6b;text-align:center;line-height:32px;font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden}
.pnum{font-size:11px;color:#3f8ca3;width:38px}
.pn{cursor:pointer}.pn:hover{border-color:#5ad1e6}
.wh .plst{position:absolute;right:30px;top:56px;width:270px;max-height:350px;overflow-y:auto;z-index:20;display:none;padding:4px;background:#041c2c;border:1px solid #0e4a6b;border-radius:10px;box-shadow:0 12px 30px #000c;scrollbar-width:thin;scrollbar-color:#0e4a6b #041c2c}
.wh .plst.open{display:block}
.plst .pi{display:flex;gap:8px;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:500;color:#7fc4d6;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.plst .pi i{font-style:normal;color:#3f8ca3;width:18px;flex:none}
.plst .pi:hover{background:#0b3b57}.plst .pi.on{background:#5ad1e6;color:#021019}.plst .pi.on i{color:#021019}
.sn{position:absolute;left:26px;top:84px;width:336px;height:336px;border-radius:50%;border:2px solid #0e4a6b;box-shadow:0 0 30px #5ad1e622,inset 0 0 30px #000a;overflow:hidden;background:#021019}
.sn canvas{position:absolute;inset:0;width:100%;height:100%}
.gauge{position:absolute;left:378px;top:84px;width:44px;height:336px;border-radius:6px;border:1px solid #0e4a6b;background:linear-gradient(#2aa5c4,#0e5a7a 30%,#06293b 65%,#020f17);cursor:ns-resize;overflow:visible}
.gauge:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,#0000 0 29px,#bdeaf566 29px 30px);background-size:100% 33.6px;border-radius:6px}
.gauge .mk{position:absolute;left:-7px;right:-7px;top:calc((1 - var(--v))*100%);height:0;border-top:3px solid #fff;filter:drop-shadow(0 0 5px #5ad1e6)}
.gauge .mk:after{content:"";position:absolute;right:-6px;top:-8px;border:6px solid #0000;border-left:9px solid #fff}
.gauge .pk{position:absolute;left:0;right:0;border-top:2px dashed #ffffffaa;transition:none}
.gt{position:absolute;left:428px;font-size:10px;letter-spacing:.2em;color:#3f8ca3;white-space:nowrap}
.gl{position:absolute;left:424px;top:78px;font-size:9px;color:#3f8ca3;line-height:1}
.sec{position:absolute;left:446px;width:490px;border-top:1px solid #0e4a6b}
.sec>h{position:absolute;left:0;top:-7px;background:#06273c;padding:0 8px 0 0;font-size:10px;font-weight:500;letter-spacing:.22em;color:#5ad1e6}
.sec>h i{font-style:normal;color:#3f8ca3;margin-left:8px;letter-spacing:.12em}
.abs{position:absolute}
.kw{display:flex;flex-direction:column;align-items:center;width:80px}
.kn{width:46px;height:46px;border-radius:50%;cursor:ns-resize}
.kn .ring{position:absolute;inset:-6px;border-radius:50%;background:conic-gradient(from -135deg,#5ad1e6 calc(var(--v)*270deg),#0e4a6b66 0 270deg,#0000 0);-webkit-mask:radial-gradient(farthest-side,#0000 calc(100% - 3px),#000 calc(100% - 2px));mask:radial-gradient(farthest-side,#0000 calc(100% - 3px),#000 calc(100% - 2px));filter:drop-shadow(0 0 3px #5ad1e6)}
.kn .cap{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 28%,#1a6f94,#0b3b57 60%,#05202f);border:2px solid #0e4a6b;box-shadow:0 4px 8px #0009,inset 0 1px 2px #5ad1e655;transform:rotate(calc(-135deg + var(--v)*270deg))}
.kn .pt{position:absolute;left:50%;top:3px;width:4px;height:12px;margin-left:-2px;border-radius:2px;background:#bdeaf5;box-shadow:0 0 6px #5ad1e6}
.kn.drag .cap,.kn:focus-visible .cap{border-color:#5ad1e6}
.kl{margin-top:8px;font-size:10px;font-weight:500;letter-spacing:.1em;color:#7fc4d6;white-space:nowrap;text-transform:uppercase}
.kv{font-size:12px;font-weight:500;color:#bdeaf5;white-space:nowrap;margin-top:1px}
.pills{display:flex;gap:4px}
.pills button{height:22px;padding:0 9px;border-radius:11px;background:#041c2c;border:1px solid #0e4a6b;color:#7fc4d6;font-family:inherit;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
.pills button.on{background:#5ad1e6;color:#021019;border-color:#5ad1e6;box-shadow:0 0 10px #5ad1e688}
.pl{font-size:9px;letter-spacing:.18em;color:#3f8ca3;margin-bottom:4px;white-space:nowrap}
.keys{position:absolute;left:26px;top:432px;width:908px;height:90px;border-radius:0 0 10px 10px;border-top:3px solid #5ad1e6;background:#021019;box-shadow:0 -4px 18px #5ad1e622}
.keys .kb-w{background:linear-gradient(#d9f4fa,#8fcfe0);border:1px solid #06293b;border-top:0}
.keys .kb-w.on{background:linear-gradient(#5ad1e6,#2a93ab)}
.keys .kb-b{background:linear-gradient(#0b3b57,#021019);border-radius:0 0 4px 4px}
.keys .kb-b.on{background:#2aa5c4}
.ft{position:absolute;left:30px;right:30px;top:531px;display:flex;justify-content:space-between;font-size:10px;letter-spacing:.18em;color:#3f8ca3}
.ft b{font-weight:500;color:#5ad1e6}
</style>
<div class="wh">
 <div class="logo">Whale<small>SLOW AND HEAVY · LOW-END SONAR</small></div>
 <div class="dep">CURRENT DEPTH<b id="dep">11,000 m</b></div>
 <div class="pb"><button data-prev title="Previous preset">&#9664;</button><div class="pn" data-pname title="Browse presets"></div><button data-next title="Next preset">&#9654;</button><div class="pnum" data-pnum></div><button id="plt" title="Preset list">&#9776;</button></div>
 <div class="plst" id="plst" data-plist="div" data-tpl="<i>{i}</i>{n}"></div>
 <div class="sn"><canvas id="cs" width="672" height="672"></canvas></div>
 <div class="gauge" data-p="cutoff" data-abs="y"><i class="mk"></i><i class="pk" id="pk"></i></div>
  <div class="sec" style="top:94px;height:100px"><h>SOURCE<i>TWIN SAWS + SUB</i></h>
  <div class="abs" style="left:0;top:14px;width:136px"><div class="pl">MAIN WAVE</div>${pill('wave', ['SAW', 'SQR'])}<div class="pl" style="margin-top:6px">SUB WAVE</div>${pill('subWave', ['SQR', 'SIN', 'TRI'])}</div>
  <div class="abs" style="left:140px;top:16px;display:flex">${K('subLevel', 'Sub Mix')}${K('detune', 'Thicken')}${K('punch', 'Punch')}</div>
  <div class="abs" style="left:390px;top:14px;width:100px"><div class="pl">NOTE =</div>${pill('root', ['SUB', 'MAIN'])}<div class="pl" style="margin-top:6px">DRIVE AT</div>${pill('driveAt', ['PRE', 'POST'])}</div></div>
 <div class="sec" style="top:210px;height:100px"><h>SONAR<i>RESONANT LOW-PASS</i></h>
  <div class="abs" style="left:0;top:18px;display:flex;width:490px;justify-content:space-between">${K('cutoff', 'Cutoff')}${K('reso', 'Resonance')}${K('envMod', 'Env Mod')}${K('fAttack', 'F Attack')}${K('fDecay', 'F Decay')}${K('keyTrack', 'Key Track')}</div></div>
 <div class="sec" style="top:326px;height:90px"><h>CURRENT<i>AMP ENVELOPE</i></h><h style="left:330px">PRESSURE<i>DRIVE</i></h>
  <div class="abs" style="left:0;top:18px;display:flex">${K('attack', 'Attack')}${K('decay', 'Decay')}${K('sustain', 'Sustain')}${K('release', 'Release')}</div>
  <div class="abs" style="left:330px;top:18px;display:flex">${K('drive', 'Drive')}${K('level', 'Level')}</div></div>
 <div class="keys" id="keys"></div>
 <div class="ft"><span id="f1"></span><span><b>A S D F G H J K</b> TO PING · DRAG THE GAUGE TO DIVE · PRE = DRIVE BEFORE FILTER</span></div>
</div>`;
    wire(root, P);
    P.keyboard(root.querySelector('#keys'), { from: 36, octaves: 3 });
    const J = tracker(P); const $ = s => root.querySelector(s);
    // preset browser: a scrollable drop-down list (copes with any number of presets)
    const pl = $('#plst'), shut = () => pl.classList.remove('open');
    const tog = e => { e.stopPropagation(); if (pl.classList.toggle('open')) { const on = pl.querySelector('.on'); pl.scrollTop = on ? on.offsetTop - 140 : 0; } };
    $('#plt').addEventListener('click', tog); $('.pn').addEventListener('click', tog);
    pl.addEventListener('click', e => { e.stopPropagation(); if (e.target.closest('.pi')) shut(); });
    root.addEventListener('pointerdown', e => { if (!pl.contains(e.target) && !e.target.closest('.pb')) shut(); });
    root.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
    const c = $('#cs').getContext('2d');
    const whale = new Path2D('M34 62 C34 44 60 38 84 42 C102 45 112 56 124 52 C122 60 124 68 130 72 C118 70 110 70 100 72 C80 78 50 80 34 62 Z');
    const foot = () => { $('#f1').textContent = 'PINGS SENT ' + String(J.hits).padStart(3, '0') + ' · ' + (440 * Math.pow(2, (J.midi - 69) / 12)).toFixed(1) + ' HZ'; }; foot(); P.onNote(foot);
    P.sub('cutoff', (v, n) => { $('#dep').textContent = Math.round(11000 * (1 - n)).toLocaleString('en-US') + ' m'; });
    P.raf(() => {
      J.frame(); const W = 672, cx = W / 2, cy = W / 2, R = 330, now = performance.now() / 1000;
      c.clearRect(0, 0, W, W);
      const bg = c.createRadialGradient(cx, cy, 10, cx, cy, R); bg.addColorStop(0, '#0a3550'); bg.addColorStop(1, '#021019'); c.fillStyle = bg; c.fillRect(0, 0, W, W);
      const nrm = f => Math.log(f / 40) / Math.log(8000 / 40);
      c.strokeStyle = '#0e4a6b'; c.lineWidth = 2; for (let i = 1; i <= 4; i++) { c.beginPath(); c.arc(cx, cy, R * i / 4, 0, TAU); c.stroke(); }
      c.beginPath(); c.moveTo(cx, cy - R); c.lineTo(cx, cy + R); c.moveTo(cx - R, cy); c.lineTo(cx + R, cy); c.lineWidth = 1; c.stroke();
      // sweep
      const ang = now * 1.1; c.save(); c.translate(cx, cy); c.rotate(ang);
      const sw = c.createLinearGradient(0, 0, -150, 150); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, R, -0.7, 0); c.closePath();
      const gg = c.createConicGradient(-0.7, 0, 0); gg.addColorStop(0, 'rgba(90,209,230,0)'); gg.addColorStop(0.11, 'rgba(90,209,230,.28)'); gg.addColorStop(1, 'rgba(90,209,230,0)'); c.fillStyle = gg; c.fill();
      c.strokeStyle = '#5ad1e6'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(R, 0); c.stroke(); c.restore();
      // filter rings: base (solid), current (bright), peak (dashed)
      const ring = (f, col, lw, dash, glow) => { c.beginPath(); c.arc(cx, cy, R * 0.94 * (1 - nrm(clamp(f, 40, 8000))) + 14, 0, TAU); c.setLineDash(dash || []); c.strokeStyle = col; c.lineWidth = lw; c.shadowColor = '#5ad1e6'; c.shadowBlur = glow || 0; c.stroke(); c.setLineDash([]); c.shadowBlur = 0; };
      const q = P.norm('reso'), det = P.get('detune') / 50;
      ring(J.pk, 'rgba(189,234,245,.5)', 3, [10, 10]);
      ring(J.b, 'rgba(90,209,230,.55)', 3 + q * 4, null, 0);
      if (det > 0.02) ring(J.f * (1 + det * 0.08), 'rgba(90,209,230,' + (0.25 + 0.3 * det) + ')', 3, null, 0);
      ring(J.f, '#5ad1e6', 3 + q * 9, null, 12 + q * 24);
      // pings
      const rel = 0.6 + P.get('release') * 1.6;
      J.pings.forEach(t0 => { const a = (performance.now() - t0) / 1000 / (rel + 0.8); if (a < 1) { c.beginPath(); c.arc(cx, cy, 20 + a * R, 0, TAU); c.strokeStyle = 'rgba(189,234,245,' + (0.8 * (1 - a)) + ')'; c.lineWidth = 3 + 4 * P.get('drive') * (1 - a); c.stroke(); } });
      // whale
      const sc = 1.15 + P.get('subLevel') * 1.2; c.save(); c.translate(cx + 6 * Math.sin(now * 0.5), cy + 14 + 10 * Math.sin(now * 0.8)); c.rotate(0.05 * Math.sin(now * 0.8)); c.scale(sc * 1.5, sc * 1.5); c.translate(-80, -60);
      c.shadowColor = '#5ad1e6'; c.shadowBlur = 8 + 40 * P.get('drive') * (0.4 + J.amp); c.fillStyle = 'rgba(90,209,230,' + (0.62 + 0.3 * J.amp) + ')'; c.fill(whale); c.shadowBlur = 0;
      c.beginPath(); c.arc(48, 58, 2.4, 0, TAU); c.fillStyle = '#021019'; c.fill();
      c.strokeStyle = '#021019'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(52, 66); c.quadraticCurveTo(80, 72, 104, 66); c.stroke();
      c.restore();
      c.font = '500 20px Rubik,sans-serif'; c.fillStyle = '#7fc4d6'; c.textAlign = 'left'; c.fillText('FC ' + hz(J.f), 40, 60); c.fillText('Q ' + P.get('reso').toFixed(1), 40, 86);
      c.textAlign = 'right'; c.fillStyle = '#3f8ca3'; c.fillText('PEAK ' + hz(J.pk), W - 40, W - 40);
      $('#pk').style.top = ((1 - clamp(nrm(J.pk), 0, 1)) * 100) + '%';
    });
  }

  /* =====================================================================
   * C  HODL
   * ===================================================================== */
  

  Kit.register('jibass', {
    fonts: 'family=Bebas+Neue&family=Rubik:wght@400;500;600;800&family=Rubik+Mono+One',
    w: 960, h: 560, params,
    faces: [
      undefined,
      { key: 'B', name: 'Whale', accent: '#5ad1e6', build: buildB },
      undefined
    ].filter(Boolean)
  });
})();
