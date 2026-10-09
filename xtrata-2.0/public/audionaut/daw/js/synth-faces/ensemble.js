import { Kit } from "./runtime.js";
/* ensemble.js \u2014 jiENSEMBLE: string machine / pad / choir. Faces: Satoshi, Stacking, Layers */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const pad2 = n => String(n).padStart(2, '0');

  /* ---------- shared helpers ---------- */
  function wire(root, P) {
    root.querySelectorAll('[data-k]').forEach(e => P.bind(e, e.dataset.k, e.dataset.o ? JSON.parse(e.dataset.o) : {}));
    root.querySelectorAll('[data-t]').forEach(e => P.text(e, e.dataset.t));
    root.querySelectorAll('[data-r]').forEach(g => {
      const id = g.dataset.r;
      g.querySelectorAll('[data-i]').forEach(b => {
        b.tabIndex = 0;
        b.addEventListener('click', () => P.set(id, +b.dataset.i));
        b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); P.set(id, +b.dataset.i); } });
      });
      P.sub(id, v => g.querySelectorAll('[data-i]').forEach(b => b.classList.toggle('on', +b.dataset.i === v)));
    });
  }
  function presetUI(root, P) {
    const n = P.presets.length; let idx = -1;
    const list = root.querySelector('[data-pl]');
    if (list) list.innerHTML = P.presets.map((p, j) => (p.cat && p.cat !== (P.presets[j - 1] || {}).cat ? `<b>${p.cat.toUpperCase()}</b>` : '') + `<button data-pj="${j}"><span>${pad2(j + 1)}</span>${p.name}</button>`).join('');
    const menu = root.querySelector('[data-pmenu]');
    P.onPreset((i, name) => {
      idx = i;
      root.querySelectorAll('[data-pn]').forEach(e => e.textContent = i < 0 ? '\u2014 init \u2014' : name);
      root.querySelectorAll('[data-pi]').forEach(e => e.textContent = i < 0 ? '--' : pad2(i + 1));
      root.querySelectorAll('[data-pj]').forEach(b => { const on = +b.dataset.pj === i; b.classList.toggle('on', on); if (on && list) list.scrollTop = b.offsetTop - list.offsetTop - 40; });
    });
    root.querySelectorAll('[data-pp]').forEach(b => b.addEventListener('click', () => P.loadPreset(idx <= 0 ? n - 1 : idx - 1)));
    root.querySelectorAll('[data-pnx]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx + 1) % n)));
    root.querySelectorAll('[data-pj]').forEach(b => b.addEventListener('click', () => { P.loadPreset(+b.dataset.pj); if (menu) menu.classList.remove('open'); }));
    root.querySelectorAll('[data-ptog]').forEach(b => b.addEventListener('click', () => { if (menu) menu.classList.toggle('open'); }));
  }
  const lp = (fc, q, f) => { const r = f / fc, a = 1 - r * r; return 1 / Math.sqrt(a * a + (r / q) * (r / q)); };
  const respN = (fc, q, f) => clamp((20 * Math.log10(lp(fc, q, f) + 1e-9) + 36) / 48, 0, 1); // 0..1
  function curveD(fc, q, W, H, pad) {
    let d = '';
    for (let i = 0; i <= 60; i++) {
      const f = 40 * Math.pow(400, i / 60);
      d += (i ? 'L' : 'M') + (i / 60 * W).toFixed(1) + ' ' + (H - pad - respN(fc, q, f) * (H - 2 * pad)).toFixed(1);
    }
    return d;
  }
  function envD(P, W, H, pad) {
    const a = P.get('attack'), d = P.get('decay'), s = P.get('sustain'), r = P.get('release');
    const hold = Math.max(0.4, (a + d + r) * 0.25), T = a + d + hold + r;
    const x = t => (t / T * W).toFixed(1), y = l => (H - pad - l * (H - 2 * pad)).toFixed(1);
    return `M0 ${y(0)}L${x(a)} ${y(1)}L${x(a + d)} ${y(s)}L${x(a + d + hold)} ${y(s)}L${W} ${y(0)}`;
  }
  const fcOf = P => ({ rest: clamp(P.get('cutoff') + P.get('sweep') * 0.35, 60, 16000), open: clamp(P.get('cutoff') + P.get('sweep'), 60, 16000), base: P.get('cutoff'), q: 0.7 + P.get('reso') });
  const hz = v => v >= 1000 ? (v / 1000).toFixed(2) + ' kHz' : Math.round(v) + ' Hz';
  const sec = v => v.toFixed(v < 1 ? 3 : 2) + ' s';
  const pct = v => Math.round(v * 100) + '%';

  /* ---------- params ---------- */
  const params = [
    { id: 'tone', label: 'Tone', options: ['strings', 'pad', 'choir'], def: 0 },
    { id: 'wave', label: 'Wave', options: ['sawtooth', 'square', 'triangle'], def: 0 },
    { id: 'reg16', label: "16' Register", min: 0, max: 1, step: 0.01, def: 0.45, fmt: pct },
    { id: 'reg8', label: "8' Register", min: 0, max: 1, step: 0.01, def: 1, fmt: pct },
    { id: 'reg4', label: "4' Register", min: 0, max: 1, step: 0.01, def: 0.55, fmt: pct },
    { id: 'detune', label: 'Detune (cents)', min: 0, max: 40, step: 0.5, def: 11, fmt: v => v.toFixed(1) + ' ct' },
    { id: 'cutoff', label: 'Cutoff', min: 200, max: 12000, step: 10, def: 3200, log: true, fmt: hz },
    { id: 'reso', label: 'Resonance', min: 0, max: 12, step: 0.1, def: 1.2, fmt: v => v.toFixed(1) },
    { id: 'sweep', label: 'Sweep Amount', min: 0, max: 8000, step: 10, def: 2200, fmt: v => '+' + hz(v) },
    { id: 'sweepIn', label: 'Sweep In', min: 0.02, max: 4, step: 0.01, def: 0.9, log: true, fmt: sec },
    { id: 'sweepOut', label: 'Sweep Settle', min: 0.05, max: 6, step: 0.01, def: 2.2, log: true, fmt: sec },
    { id: 'vowel', label: 'Choir Vowel', options: ['ah', 'oh', 'ee', 'oo'], def: 0 },
    { id: 'ensemble', label: 'Ensemble Depth', min: 0, max: 1, step: 0.01, def: 0.75, fmt: pct },
    { id: 'ensRate', label: 'Ensemble Rate (Hz)', min: 0.1, max: 2.5, step: 0.01, def: 0.62, fmt: v => v.toFixed(2) + ' Hz' },
    { id: 'vibrato', label: 'Vibrato (cents)', min: 0, max: 40, step: 0.5, def: 5, fmt: v => v.toFixed(1) + ' ct' },
    { id: 'vibRate', label: 'Vibrato Rate (Hz)', min: 2, max: 9, step: 0.1, def: 5.4, fmt: v => v.toFixed(1) + ' Hz' },
    { id: 'attack', label: 'Attack', min: 0.005, max: 4, step: 0.005, def: 0.45, log: true, fmt: sec },
    { id: 'decay', label: 'Decay', min: 0.01, max: 4, step: 0.01, def: 0.8, log: true, fmt: sec },
    { id: 'sustain', label: 'Sustain', min: 0, max: 1, step: 0.01, def: 0.85, fmt: pct },
    { id: 'release', label: 'Release', min: 0.02, max: 6, step: 0.01, def: 1.1, log: true, fmt: sec },
    { id: 'level', label: 'Output Level', min: 0, max: 1.5, step: 0.01, def: 1, fmt: v => Math.round(v * 100) + '%' }
  ];
  const pr = (name, o) => ({ name, values: o });
  const presets = [
    pr('Init (String Machine)', {}),
    pr('Solina Strings', { tone: 0, wave: 0, reg16: .35, reg8: 1, reg4: .8, detune: 9, cutoff: 4200, reso: .8, sweep: 1200, sweepIn: .5, sweepOut: 1.5, ensemble: 1, ensRate: .55, vibrato: 4, vibRate: 5.6, attack: .32, decay: .6, sustain: .9, release: .7 }),
    pr('Warm Analog Pad', { tone: 1, wave: 0, reg16: .7, reg8: 1, reg4: .2, detune: 18, cutoff: 1100, reso: 2.5, sweep: 3800, sweepIn: 2.2, sweepOut: 3.5, ensemble: .55, ensRate: .35, vibrato: 0, vibRate: 5, attack: 1.1, decay: 1.5, sustain: .85, release: 2.2 }),
    pr('Choir Ah', { tone: 2, vowel: 0, wave: 0, reg16: .3, reg8: 1, reg4: .35, detune: 7, cutoff: 3600, reso: 1, sweep: 800, sweepIn: .6, sweepOut: 1.2, ensemble: .7, ensRate: .5, vibrato: 10, vibRate: 5.2, attack: .55, decay: .8, sustain: .85, release: 1.2 }),
    pr('Hollow Oo Choir', { tone: 2, vowel: 3, wave: 1, reg16: .5, reg8: 1, reg4: .1, detune: 10, cutoff: 2400, reso: .5, sweep: 600, sweepIn: 1.4, sweepOut: 2, ensemble: .8, ensRate: .42, vibrato: 14, vibRate: 5, attack: .8, decay: 1, sustain: .8, release: 1.6 }),
    pr('Slow Swell Drone', { tone: 1, wave: 0, reg16: 1, reg8: .7, reg4: 0, detune: 26, cutoff: 500, reso: 4, sweep: 5200, sweepIn: 3.5, sweepOut: 5, ensemble: .4, ensRate: .2, vibrato: 3, vibRate: 3.5, attack: 2.4, decay: 2, sustain: 1, release: 3.5 }),
    pr('Bright Ensemble Stab', { tone: 0, wave: 0, reg16: .15, reg8: 1, reg4: 1, detune: 14, cutoff: 6500, reso: 1.8, sweep: 3800, sweepIn: .05, sweepOut: .35, ensemble: .9, ensRate: .9, vibrato: 0, vibRate: 5, attack: .012, decay: .28, sustain: .35, release: .28 }),
    pr('Triangle Glow', { tone: 1, wave: 2, reg16: .5, reg8: 1, reg4: .6, detune: 12, cutoff: 5200, reso: .5, sweep: 0, sweepIn: .5, sweepOut: 1, ensemble: .6, ensRate: .7, vibrato: 6, vibRate: 5.8, attack: .7, decay: 1, sustain: .9, release: 1.4 })
  ];

  /* ============================================================
     A \u2014 SATOSHI : paper page, hairlines, concentric registers
     ============================================================ */
  

  /* ============================================================
     B \u2014 STACKING : indigo, towers of blocks, lock-up
     ============================================================ */
  

  /* ============================================================
     C \u2014 LAYERS : core sample strata, one band per control group
     ============================================================ */
  function faceC(root, P) {
    const bar = (id, l) => `<div class="cell"><div class="cl"><span>${l}</span><span data-t="${id}"></span></div><div class="hb" data-k="${id}" data-o='{"abs":true,"axis":"x"}'><i></i></div></div>`;
    const vf = (id, l) => `<div class="cell vc"><div class="vf" data-k="${id}" data-o='{"abs":true,"axis":"y"}'><i></i><b></b></div><div class="cl2"><span>${l}</span><em data-t="${id}"></em></div></div>`;
    const dial = (id, l) => `<div class="cell vc"><div class="dl" data-k="${id}"></div><div class="cl2"><span>${l}</span><em data-t="${id}"></em></div></div>`;
    const sg = (id, l, opts) => `<div class="sgw" data-sg="${id}"><span class="sl">${l}</span><div class="sg" data-r="${id}">${opts.map((o, i) => `<button data-i="${i}">${o}</button>`).join('')}</div></div>`;
    const band = (cls, no, name, sub, inner, top) => `<section class="band ${cls}" style="top:${top}px"><div class="bt"><small>STRATUM ${no}</small><b>${name}</b><span>${sub}</span></div><div class="bc">${inner}</div></section>`;
    root.innerHTML = `<style>
.c{position:absolute;inset:0;background:#15100c;color:#f1e0c8;font-family:'Syne','Helvetica Neue',Arial,sans-serif;font-size:11px}
.c button{background:none;border:0;padding:0;color:inherit;font:inherit;cursor:pointer}
.hd{position:absolute;left:24px;right:24px;top:12px;height:46px;display:flex;align-items:baseline;gap:16px}
.logo{font-size:38px;font-weight:800;letter-spacing:-.03em;line-height:1;color:#f6e7d0}
.logo i{color:#d58a4a;font-style:normal}
.meta{font-size:9.5px;letter-spacing:.2em;color:#a58a6c;font-weight:500}
.ruler{position:absolute;left:24px;top:68px;width:30px;height:372px;border-right:1px solid #5a4430;font-size:8.5px;color:#a58a6c}
.ruler span{position:absolute;right:5px;transform:translateY(-50%)}.ruler span:after{content:'';position:absolute;right:-6px;top:50%;width:5px;height:1px;background:#a58a6c}
.band{position:absolute;left:60px;width:664px;height:70px;border-radius:2px;display:grid;grid-template-columns:100px 1fr;overflow:hidden;border-top:1px solid #ffffff14;border-bottom:1px solid #00000066}
.bt{padding:10px 8px 0 12px;display:flex;flex-direction:column;gap:1px;background:linear-gradient(90deg,#0004,transparent)}
.bt small{font-size:7.5px;letter-spacing:.2em;color:#e9b27c;font-weight:500}.bt b{font-size:14px;font-weight:800;letter-spacing:-.01em;color:#fff3df}.bt span{font-size:9px;color:#d7bd9f;font-family:'Syne',sans-serif}
.bc{display:flex;align-items:center;gap:10px;padding:0 14px 0 6px}
.b1{background:radial-gradient(circle at 12% 30%,#5a3f2a 1px,transparent 2px) 0 0/22px 18px,radial-gradient(circle at 60% 70%,#2a1c12 1.5px,transparent 2.5px) 0 0/31px 23px,#3b281a}
.b2{background:repeating-linear-gradient(176deg,#4b3123 0 6px,#563826 6px 9px,#4b3123 9px 16px)}
.b3{background:radial-gradient(circle at 30% 50%,#7a5636 2px,transparent 3px) 0 0/27px 17px,#5d4029}
.b4{background:repeating-linear-gradient(180deg,#6b4a30 0 3px,#765337 3px 4px),#6b4a30}
.b5{background:radial-gradient(circle at 50% 50%,#3a2e27 2px,transparent 3px) 0 0/40px 28px,#241b15}
.cell{flex:1;min-width:0}
.cl{display:flex;justify-content:space-between;font-size:10px;font-weight:700;margin-bottom:4px;color:#fff3df}.cl span:last-child{color:#f3c797;font-weight:500;font-variant-numeric:tabular-nums}
.hb[data-bind]{height:17px;background:#150f0b;border:1px solid #0009;position:relative;cursor:ew-resize;box-shadow:inset 0 1px 3px #000a}
.hb i{position:absolute;left:0;top:0;bottom:0;width:calc(var(--v)*100%);background:linear-gradient(#e69a5a,#c27a3c);border-right:2px solid #fff3df}
.vc{display:flex;align-items:center;gap:8px}
.vf[data-bind]{width:16px;height:52px;background:#150f0b;border:1px solid #0009;position:relative;cursor:ns-resize;flex:none;box-shadow:inset 0 1px 3px #000a}
.vf i{position:absolute;left:0;right:0;bottom:0;height:calc(var(--v)*100%);background:linear-gradient(90deg,#c27a3c,#e69a5a)}
.vf b{position:absolute;left:-3px;right:-3px;bottom:calc(var(--v)*100% - 3px);height:6px;background:#fff3df;border-radius:1px;box-shadow:0 1px 2px #000}
.cl2{display:flex;flex-direction:column;gap:1px;min-width:0}.cl2 span{font-weight:700;font-size:10px;color:#fff3df;white-space:nowrap}.cl2 em{font-style:normal;color:#f3c797;font-size:10px;font-variant-numeric:tabular-nums;white-space:nowrap}
.dl[data-bind]{width:42px;height:42px;border-radius:50%;flex:none;background:radial-gradient(circle at 38% 30%,#6b4a30,#1d140e);border:2px solid #0b0705;box-shadow:0 0 0 2px #e69a5a55,inset 0 2px 3px #fff2;position:relative;cursor:ns-resize}
.dl::after{content:'';position:absolute;left:50%;top:3px;width:3px;height:13px;margin-left:-1.5px;background:#e69a5a;border-radius:2px;transform-origin:50% 18px;transform:rotate(calc(-135deg + var(--v)*270deg))}
.dl::before{content:'';position:absolute;inset:-6px;border-radius:50%;background:conic-gradient(from -135deg,#e69a5a calc(var(--v)*270deg),transparent 0);-webkit-mask:radial-gradient(circle,transparent 24px,#000 25px,#000 27px,transparent 28px);mask:radial-gradient(circle,transparent 24px,#000 25px,#000 27px,transparent 28px)}
.sgw{display:flex;flex-direction:column;gap:4px;flex:none}.sl{font-size:8.5px;letter-spacing:.16em;font-weight:700;color:#e9b27c}
.sg{display:flex;border:1px solid #0009;background:#150f0b}.sg button{padding:5px 9px;font-weight:700;font-size:10px;color:#a58a6c;border-right:1px solid #0009}.sg button:last-child{border-right:0}.sg button.on{background:#d58a4a;color:#1b1209}
.sgw.dim{opacity:.35}
.cr{position:absolute;left:738px;width:198px}
.cr h5{margin:0 0 4px;font-size:8.5px;letter-spacing:.2em;font-weight:700;color:#e9b27c}
.pr{display:flex;align-items:center;gap:6px;background:#241a12;border:1px solid #5a4430;padding:5px 6px}
.pr .pn{flex:1;text-align:center;font-weight:700;font-size:11.5px;color:#fff3df;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pr button{width:20px;height:20px;background:#3a291b;font-size:13px;line-height:1}.pr button:hover{background:#d58a4a;color:#1b1209}
.pr .pi{font-size:9px;color:#d58a4a;font-weight:700}
.core{display:block;margin-top:6px;border:1px solid #5a4430;background:#0e0a07}
.log{margin-top:6px;border-top:1px solid #5a4430;max-height:150px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#5a4430 #0e0a07}
.log b{display:block;padding:4px 4px 2px;font-size:8px;letter-spacing:.18em;color:#e9b27c;font-weight:700;background:#15100c;position:sticky;top:0}
.log button{display:flex;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;gap:8px;width:100%;text-align:left;padding:2.5px 4px;font-size:10px;font-weight:500;color:#c9ac8a;border-bottom:1px solid #2a1f16}
.log button span{color:#8a6f52;font-size:9px;width:20px}
.log button.on{background:#d58a4a;color:#1b1209;font-weight:700}.log button.on span{color:#1b1209}
.log button:hover:not(.on){background:#241a12}
.keys{position:absolute;left:24px;right:24px;top:450px;height:80px}
.keys .kb{border:2px solid #0b0705;background:#0b0705}
.keys .kb-w{background:linear-gradient(#f6e7d0,#d9bf9c);border:0;border-right:1px solid #8a6f52;border-radius:0}
.keys .kb-w.on{background:linear-gradient(#e69a5a,#c27a3c)}
.keys .kb-b{background:linear-gradient(#4b3123,#150f0b);border-radius:0 0 2px 2px;height:60%}
.keys .kb-b.on{background:#d58a4a}
.ft{position:absolute;left:24px;right:24px;top:536px;display:flex;justify-content:space-between;font-size:9px;letter-spacing:.18em;color:#8a6f52;font-weight:500}
.lvl{position:absolute;right:24px;top:20px;font-size:9px;letter-spacing:.16em;color:#a58a6c}
</style>
<div class="c">
<div class="hd"><div class="logo">Layers<i>.</i></div><div class="meta">CORE SAMPLE No. 0042 \u00b7 STRING MACHINE / PAD / CHOIR \u00b7 DRILLED TO 14 m</div></div>
<div class="ruler" id="ruler"></div>
${band('b1', 'I', 'Registers', "16\u2032 \u00b7 8\u2032 \u00b7 4\u2032", bar('reg16', "16\u2032") + bar('reg8', "8\u2032") + bar('reg4', "4\u2032") + bar('detune', 'Detune'), 68)}
${band('b2', 'II', 'Swell', 'filter bow', vf('cutoff', 'Cutoff') + vf('reso', 'Reso') + vf('sweep', 'Sweep') + vf('sweepIn', 'In') + vf('sweepOut', 'Settle'), 141)}
${band('b3', 'III', 'Ensemble', '3-phase chorus', dial('ensemble', 'Depth') + dial('ensRate', 'Rate') + dial('vibrato', 'Vibrato') + dial('vibRate', 'Vib rate'), 214)}
${band('b4', 'IV', 'Envelope', 'time', '<svg id="ep" width="132" height="54" viewBox="0 0 132 54" style="flex:none;background:#150f0b;border:1px solid #0009"></svg><div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:6px 14px">' + bar('attack', 'Attack') + bar('decay', 'Decay') + bar('sustain', 'Sustain') + bar('release', 'Release') + '</div>', 287)}
${band('b5', 'V', 'Bedrock', 'voice', sg('tone', 'TONE', ['strings', 'pad', 'choir']) + sg('wave', 'WAVE', ['saw', 'square', 'tri']) + sg('vowel', 'VOWEL', ['ah', 'oh', 'ee', 'oo']) + '<div style="flex:1;min-width:100px">' + bar('level', 'Output') + '</div>', 360)}
<div class="cr" style="top:68px"><h5>CORE LOG</h5>
<div class="pr"><span class="pi" data-pi></span><button data-pp>\u2039</button><span class="pn" data-pn></span><button data-pnx>\u203a</button></div>
<svg id="core" class="core" width="198" height="150" viewBox="0 0 198 150"></svg>
<div class="log" data-pl></div></div>
<div class="keys" id="keys"></div>
<div class="ft"><span id="msg">SEDIMENT: STRINGS ON TOP, BASS AT DEPTH</span><span>LAYER THICKNESS = REGISTER LEVEL</span></div></div>`;
    wire(root, P); presetUI(root, P);
    P.keyboard(root.querySelector('#keys'), { from: 48, octaves: 3 });
    const rl = root.querySelector('#ruler'); for (let i = 0; i <= 5; i++) { const s = document.createElement('span'); s.style.top = (i * 100 / 5 * .93 + 3) + '%'; s.textContent = (i * 3) + ' m'; rl.appendChild(s); }
    P.sub('tone', v => root.querySelector('[data-sg=vowel]').classList.toggle('dim', v !== 2));
    const ep = root.querySelector('#ep');
    P.subAll(() => { ep.innerHTML = `<path d="${envD(P, 132, 54, 5)} L132 54 L0 54Z" fill="#d58a4a44"/><path d="${envD(P, 132, 54, 5)}" fill="none" stroke="#e69a5a" stroke-width="2"/>`; });
    // core column
    const core = root.querySelector('#core'); let ph = 0, last = 0, hit = -1e9;
    P.onNote(e => { if (e.type === 'on') { hit = performance.now(); root.querySelector('#msg').textContent = 'DRILL HIT AT NOTE ' + e.midi; } });
    const names = ["4\u2032", "8\u2032", "16\u2032"], cols = ['#c49a6a', '#9a6a3c', '#5e3b22'], ids = ['reg4', 'reg8', 'reg16'];
    P.raf(t => {
      const dt = Math.min(.1, (t - last) / 1000); last = t; ph += dt * P.get('ensRate') * 2.2;
      const amp = 1 + P.get('ensemble') * 5, tot = ids.reduce((s, id) => s + P.get(id), 0.0001), X0 = 50, X1 = 190, H = 150;
      const fl = clamp(1 - (performance.now() - hit) / 700, 0, 1);
      let y = 4, out = '', pebbles = '';
      const wave = (yy, k) => { let d = ''; for (let x = X0; x <= X1; x += 7) d += (x === X0 ? 'M' : 'L') + x + ' ' + (yy + Math.sin(x * .09 + ph + k * 2) * amp).toFixed(1); return d; };
      const th = ids.map(id => 6 + (P.get(id) / tot) * (H - 8 - 18));
      const sumTh = th.reduce((a, b) => a + b, 0), sc = (H - 8) / sumTh;
      ids.forEach((id, i) => {
        const h = th[i] * sc, y2 = y + h;
        out += `<path d="${wave(y, i)} L${X1} ${y2} L${X0} ${y2}Z" fill="${cols[i]}" opacity="${.85 + fl * .15}"/>`;
        out += `<text x="${X0 - 6}" y="${y + h / 2 + 3}" text-anchor="end" font-size="10" font-weight="700" fill="#e9b27c">${names[i]}</text><text x="${X1 - 6}" y="${y + h / 2 + 3}" text-anchor="end" font-size="9" fill="#150f0b" font-weight="700">${Math.round(P.get(id) * 100)}%</text>`;
        const n = Math.round(P.get('detune') / 2);
        for (let k = 0; k < n; k++) { const px = X0 + 6 + ((k * 37 + i * 13) % (X1 - X0 - 12)), py = y + 6 + ((k * 23 + i * 7) % Math.max(6, h - 10)); out += `<circle cx="${px}" cy="${py}" r="1.5" fill="#00000044"/>`; }
        y = y2;
      });
      out += `<rect x="${X0 - 1}" y="3" width="${X1 - X0 + 2}" height="${H - 6}" fill="none" stroke="#f1e0c8" stroke-width="1" opacity=".5"/>`;
      out += `<path d="M${X0 - 24} ${4 + fl * 120} l8 -4 v8z" fill="#fff3df"/>`;
      core.innerHTML = out;
    });
  }

  Kit.register('ensemble', {
    fonts: 'family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300;1,400;1,500&family=Manrope:wght@500;700;800&family=Sora:wght@500;700&family=Syne:wght@500;700;800',
    w: 960, h: 560, params, presets,
    faces: [
      undefined,
      undefined,
      { key: 'C', name: 'Layers', accent: '#d58a4a', build: faceC }
    ].filter(Boolean)
  });
})();
