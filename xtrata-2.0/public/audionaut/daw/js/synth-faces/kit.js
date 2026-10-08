import { Kit } from "./runtime.js";
/* faces/kit.js — analog drum kit (real params from synths/drums/kit.js) with three faces */
(function () {
  const pct = v => Math.round(v * 100) + '%';
  const sec = v => v.toFixed(2) + ' s';
  const R = (id, label, min, max, def, step, fmt, extra) => Object.assign({ id, label, min, max, def, step, fmt }, extra || {});
  const params = [
    { id: 'kit', label: 'Kit', options: ['808', '909', 'Lo-Fi'], def: 0 },
    R('kickTune', 'Kick Tune (Hz)', 32, 100, 50, 1, v => Math.round(v) + ' Hz'),
    R('kickDecay', 'Kick Decay', 0.08, 1.4, 0.5, 0.01, sec),
    R('kickPunch', 'Kick Punch (pitch drop)', 0, 1, 0.6, 0.01, pct),
    R('kickClick', 'Kick Click', 0, 1, 0.4, 0.01, pct),
    R('snareTune', 'Snare Tune (Hz)', 120, 320, 185, 1, v => Math.round(v) + ' Hz'),
    R('snareSnap', 'Snare Snap (noise)', 0, 1, 0.6, 0.01, pct),
    R('snareDecay', 'Snare Decay', 0.05, 0.6, 0.2, 0.01, sec),
    R('hatTone', 'Hat Tone', 0, 1, 0.5, 0.01, pct),
    R('hatDecay', 'Closed Hat Decay', 0.02, 0.3, 0.06, 0.005, v => v.toFixed(3) + ' s'),
    R('openDecay', 'Open Hat Decay', 0.15, 1.4, 0.45, 0.01, sec),
    R('clapDecay', 'Clap Decay', 0.06, 0.7, 0.22, 0.01, sec),
    R('clapSpread', 'Clap Spread', 0, 1, 0.5, 0.01, pct),
    R('tomTune', 'Tom Tune (st)', -12, 12, 0, 0.5, v => (v > 0 ? '+' : '') + v.toFixed(1) + ' st'),
    R('tomDecay', 'Tom Decay', 0.12, 1, 0.4, 0.01, sec),
    R('cymDecay', 'Cymbal Decay', 0.4, 3.2, 1.6, 0.05, v => v.toFixed(2) + ' s'),
    R('drive', 'Drive', 0, 1, 0.2, 0.01, pct),
    R('tone', 'Tone (low-pass)', 800, 18000, 16000, 50, v => v >= 1000 ? (v / 1000).toFixed(1) + ' kHz' : Math.round(v) + ' Hz', { log: true }),
    R('level', 'Output Level', 0, 1.5, 1, 0.01, v => Math.round(v * 100) + '%')
  ];
  const KN = { '808': 0, '909': 1, lofi: 2 };
  const pr = (name, kit, o) => ({ name, values: Object.assign({ kit: KN[kit] }, o) });
  const presets = [
    pr('Init (808 Kit)', '808', {}),
    pr('909 Punch', '909', { kickTune: 56, kickDecay: 0.38, kickPunch: 0.7, kickClick: 0.6, snareTune: 200, snareSnap: 0.75, snareDecay: 0.19, hatTone: 0.6, hatDecay: 0.05, openDecay: 0.38, clapDecay: 0.2, clapSpread: 0.35, tomDecay: 0.33, cymDecay: 1.9, drive: 0.35 }),
    pr('Lo-Fi Dust', 'lofi', { kickTune: 46, kickDecay: 0.42, kickPunch: 0.4, kickClick: 0.2, snareTune: 170, snareSnap: 0.5, snareDecay: 0.24, hatTone: 0.3, hatDecay: 0.07, openDecay: 0.3, clapDecay: 0.26, clapSpread: 0.7, tomDecay: 0.45, cymDecay: 1.3, drive: 0.3, tone: 5200 }),
    pr('Deep Sub Kit', '808', { kickTune: 38, kickDecay: 1.1, kickPunch: 0.35, kickClick: 0.15, snareTune: 160, snareSnap: 0.35, snareDecay: 0.28, hatTone: 0.35, hatDecay: 0.05, openDecay: 0.5, clapDecay: 0.3, clapSpread: 0.6, tomTune: -4, tomDecay: 0.7, cymDecay: 2.2, drive: 0.15, tone: 9000 }),
    pr('Tight Trap', '808', { kickTune: 44, kickDecay: 0.9, kickPunch: 0.5, kickClick: 0.3, snareTune: 210, snareSnap: 0.85, snareDecay: 0.14, hatTone: 0.8, hatDecay: 0.035, openDecay: 0.25, clapDecay: 0.16, clapSpread: 0.25, tomDecay: 0.25, cymDecay: 1.4, drive: 0.25 }),
    pr('House Machine', '909', { kickTune: 52, kickDecay: 0.3, kickPunch: 0.55, kickClick: 0.5, snareTune: 190, snareSnap: 0.55, snareDecay: 0.17, hatTone: 0.7, hatDecay: 0.04, openDecay: 0.55, clapDecay: 0.28, clapSpread: 0.5, tomDecay: 0.3, cymDecay: 2.4, drive: 0.4 }),
    pr('Boom Bap Break', 'lofi', { kickTune: 54, kickDecay: 0.3, kickPunch: 0.55, kickClick: 0.35, snareTune: 190, snareSnap: 0.7, snareDecay: 0.22, hatTone: 0.4, hatDecay: 0.06, openDecay: 0.28, clapDecay: 0.2, clapSpread: 0.5, tomDecay: 0.35, cymDecay: 1.1, drive: 0.5, tone: 6800 }),
    pr('Dub Toms & Rims', '808', { kickTune: 60, kickDecay: 0.3, kickPunch: 0.8, kickClick: 0.2, snareTune: 150, snareSnap: 0.25, snareDecay: 0.12, hatTone: 0.2, hatDecay: 0.06, openDecay: 0.7, clapDecay: 0.4, clapSpread: 0.8, tomTune: 3, tomDecay: 0.95, cymDecay: 2.8, drive: 0.1, tone: 7500 })
  ];

  /* ---------- shared helpers ---------- */
  const PADROWS = [[48, 49, 50, 51], [44, 45, 46, 47], [40, 41, 42, 43], [36, 37, 38, 39]];
  const PADN = { 36: 'KICK', 37: 'RIM', 38: 'SNARE', 39: 'CLAP', 40: 'SNARE 2', 41: 'TOM L', 42: 'HAT C', 43: 'TOM L2', 44: 'HAT P', 45: 'TOM M', 46: 'HAT O', 47: 'TOM M2', 48: 'TOM H', 49: 'CRASH', 50: 'TOM H2', 51: 'RIDE' };
  const KT = [{ r: 3, d: 0.05, l: 1 }, { r: 4.6, d: 0.032, l: 0.8 }, { r: 2.1, d: 0.06, l: 0.7 }];

  function kickModel(P, N) {
    const K = KT[P.get('kit')] || KT[0], sr = 4000, n = N || 1600, out = new Float32Array(n);
    const f0 = P.get('kickTune'), pun = P.get('kickPunch'), dr = P.get('drive');
    const sf = f0 * (1 + (K.r - 1) * (0.12 + 0.88 * pun)), drop = K.d * (0.7 + 0.6 * pun);
    const dec = Math.max(0.05, P.get('kickDecay') * K.l), k = 1 + dr * 6; let ph = 0;
    for (let i = 0; i < n; i++) {
      const t = i / sr, f = t < drop ? sf * Math.pow(f0 / sf, t / drop) : f0;
      ph += 2 * Math.PI * f / sr;
      out[i] = Math.tanh(Math.sin(ph) * Math.min(1, t / 0.001) * Math.exp(-t / dec * 4.6) * k) / Math.tanh(k);
    }
    return out;
  }

  /* knob / fader html: data-k bound with drag, data-f vertical abs, data-h horizontal abs */
  const KNOB = (id, label, o) => { o = o || {}; return `<div class="kn ${o.c || ''}"><div class="kb" data-k="${id}"><i></i></div><label>${label}</label><b data-t="${id}"></b></div>`; };
  const VF = (id, label, o) => { o = o || {}; return `<div class="vf ${o.c || ''}"><label>${label}</label><div class="vt" data-f="${id}"><div class="vfill"></div><div class="vcap"></div></div><b data-t="${id}"></b></div>`; };
  const HS = (id, label, o) => { o = o || {}; return `<div class="hs ${o.c || ''}"><label>${label}</label><div class="ht" data-h="${id}"><div class="hfill"></div><div class="hcap"></div></div><b data-t="${id}"></b></div>`; };
  const SEG = (id, labels, c) => `<div class="seg ${c || ''}">${labels.map((l, i) => `<button type="button" data-sel="${id}" data-v="${i}">${l}</button>`).join('')}</div>`;
  const STEPS = (inner) => Array.from({ length: 16 }, (_, i) => `<div class="st" data-step="${i}">${inner ? inner(i) : ''}</div>`).join('');
  const LANES = c => ['KICK', 'SNARE', 'HAT', 'CLAP'].map((n, i) => `<button type="button" class="ln ${c || ''}" data-lane="${i}">${n}</button>`).join('');

  function wire(root, P) {
    root.querySelectorAll('[data-k]').forEach(e => P.bind(e, e.dataset.k, { range: 160 }));
    root.querySelectorAll('[data-f]').forEach(e => P.bind(e, e.dataset.f, { abs: true, axis: 'y' }));
    root.querySelectorAll('[data-h]').forEach(e => P.bind(e, e.dataset.h, { abs: true, axis: 'x' }));
    root.querySelectorAll('[data-t]').forEach(e => P.text(e, e.dataset.t));
    const sels = [...root.querySelectorAll('[data-sel]')];
    sels.forEach(b => b.addEventListener('click', () => P.set(b.dataset.sel, +b.dataset.v)));
    [...new Set(sels.map(b => b.dataset.sel))].forEach(id => P.sub(id, v => sels.forEach(b => { if (b.dataset.sel === id) b.classList.toggle('on', +b.dataset.v === v); })));
    const pn = root.querySelectorAll('[data-pn]'), pi = root.querySelectorAll('[data-pi]'), pl = root.querySelector('[data-plist]');
    const npr = P.presets.length;
    if (pl) {
      pl.innerHTML = P.presets.map((p, i) => `<button type="button" class="pit" data-pl="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${p.name}</button>`).join('');
      pl.querySelectorAll('[data-pl]').forEach(b => b.addEventListener('click', () => { P.loadPreset(+b.dataset.pl); pl.classList.remove('open'); }));
    }
    root.querySelectorAll('[data-pt]').forEach(b => b.addEventListener('click', () => { pl && pl.classList.toggle('open'); }));
    let cur = 0;
    root.querySelectorAll('[data-pp]').forEach(b => b.addEventListener('click', () => P.loadPreset((cur + +b.dataset.pp + npr) % npr)));
    let first = true;
    P.onPreset((i, name) => {
      if (first) { first = false; if (i < 0) { setTimeout(() => P.loadPreset(0), 0); } }
      if (i >= 0) cur = i; const nm = i >= 0 ? name : 'Custom';
      pn.forEach(e => { e.textContent = nm; }); pi.forEach(e => { e.textContent = (i >= 0 ? String(i + 1).padStart(2, '0') : '--') + '/' + String(npr).padStart(2, '0'); });
      if (pl) pl.querySelectorAll('[data-pl]').forEach(b => b.classList.toggle('on', +b.dataset.pl === i));
    });
  }

  function pads(el, P, fmtLabel) {
    el.innerHTML = PADROWS.map(r => r.map(m => `<div class="pad" data-midi="${m}"><span class="pn">${fmtLabel ? fmtLabel(m) : PADN[m]}</span><span class="pm">${m}</span></div>`).join('')).join('');
    P.baseNote = 36;
    const held = new Map();
    el.addEventListener('pointerdown', e => {
      const n = e.target.closest('[data-midi]'); if (!n) return; el.setPointerCapture(e.pointerId);
      const r = n.getBoundingClientRect(); const m = +n.dataset.midi; held.set(e.pointerId, m);
      P.noteOn(m, 0.55 + 0.4 * Math.min(1, Math.max(0, (e.clientY - r.top) / (r.height || 1)))); e.preventDefault();
    });
    const up = e => { const m = held.get(e.pointerId); if (m == null) return; held.delete(e.pointerId); P.noteOff(m); };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    const pe = [...el.querySelectorAll('.pad')];
    P.onNote(ev => { pe.forEach(p => { if (+p.dataset.midi === ev.midi) { p.classList.toggle('on', ev.type === 'on'); if (ev.type === 'on') { p.classList.remove('hit'); void p.offsetWidth; p.classList.add('hit'); } } }); });
  }

  function seq(root, P, cb) {
    const L = [{ n: 'KICK', m: 36, v: 0.9, p: '1000100010001000' }, { n: 'SNARE', m: 38, v: 0.85, p: '0000100000001001' }, { n: 'HAT', m: 42, v: 0.55, p: '1010101010101011' }, { n: 'CLAP', m: 39, v: 0.8, p: '0000000000001000' }];
    L.forEach(l => { l.p = l.p.split('').map(c => c === '1'); });
    let lane = 0, bpm = 112, play = false, step = -1, acc = 0, last = 0;
    const se = [...root.querySelectorAll('[data-step]')], le = [...root.querySelectorAll('[data-lane]')];
    const bv = root.querySelectorAll('[data-bpmv]'), pb = root.querySelectorAll('[data-play]');
    const paint = () => {
      se.forEach((e, i) => { const c = L.filter(l => l.p[i]).length; e.classList.toggle('on', L[lane].p[i]); e.classList.toggle('any', c > 0); e.dataset.cnt = c; e.classList.toggle('now', i === step); const tx = e.querySelector('.tx'); if (tx) tx.textContent = c + ' tx'; });
      le.forEach((e, i) => e.classList.toggle('on', i === lane)); bv.forEach(e => { e.textContent = bpm; }); pb.forEach(e => e.classList.toggle('on', play));
    };
    se.forEach((e, i) => e.addEventListener('click', () => { L[lane].p[i] = !L[lane].p[i]; paint(); }));
    le.forEach((e, i) => e.addEventListener('click', () => { lane = i; paint(); }));
    pb.forEach(e => e.addEventListener('click', () => { play = !play; if (!play) step = -1; last = 0; acc = 0; paint(); }));
    root.querySelectorAll('[data-bpm]').forEach(e => e.addEventListener('click', () => { bpm = Math.min(200, Math.max(60, bpm + +e.dataset.bpm)); paint(); }));
    P.raf(t => {
      if (!play) return; if (!last) last = t; acc += t - last; last = t; const dur = 15000 / bpm; let moved = false;
      while (acc >= dur) { acc -= dur; step = (step + 1) % 16; moved = true; L.forEach(l => { if (l.p[step]) { P.noteOn(l.m, l.v); setTimeout(() => P.noteOff(l.m), 70); } }); if (cb) cb(step); }
      if (moved) paint();
    });
    paint();
    return { get step() { return step; }, get playing() { return play; } };
  }

  /* ============================== FACE A : ASIC ============================== */
  function buildA(root, P) {
    const fins = Array.from({ length: 96 }, () => '<i></i>').join('');
    root.innerHTML = `<style>
.a{position:absolute;inset:0;background:linear-gradient(180deg,#24272c,#17191d 60%,#121316);font-family:'Chakra Petch','Eurostile','Arial Narrow',sans-serif;color:#c9ced4;overflow:hidden}
.a *{box-sizing:border-box}
.a:before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,#ffffff05 0 1px,transparent 1px 4px);pointer-events:none}
.hd{position:absolute;left:0;top:0;right:0;height:58px;border-bottom:2px solid #3a3e45;background:linear-gradient(#2c3036,#1c1f23);display:flex;align-items:center;padding:0 16px;gap:18px}
.logo{font-weight:700;font-size:38px;letter-spacing:.2em;color:#fff;line-height:1;text-shadow:0 2px 0 #000}
.logo small{display:block;font-size:8.5px;font-weight:500;letter-spacing:.2em;color:#7a8088;margin-top:2px;text-shadow:none}
.pb{display:flex;align-items:center;gap:6px;margin-left:10px}
.pb button{width:26px;height:30px;background:#2a2d33;border:1px solid #4a4f57;color:#c9ced4;cursor:pointer;font:700 14px 'Chakra Petch';border-radius:2px}
.pb button:hover{background:#3a3e45}
.lcd{width:230px;height:34px;background:#07110a;border:2px inset #3a3e45;border-radius:2px;padding:3px 8px;font-family:'Space Mono',monospace;color:#7dffa1;text-shadow:0 0 6px #3dff7a88;position:relative}
.lcd .pi{font-size:8px;opacity:.7;letter-spacing:.1em}.lcd .pnm{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
.ro{margin-left:auto;display:flex;gap:18px}
.ro div{text-align:right;font-size:8px;letter-spacing:.18em;color:#7a8088}.ro b{display:block;white-space:nowrap;font:500 17px 'Space Mono',monospace;color:#e6e9ec;letter-spacing:0;margin-top:1px}.ro b.hot{color:#ff7a45}
.fins{position:absolute;left:0;right:0;top:58px;height:22px;display:flex;gap:2px;padding:0 6px;background:#0e0f11;border-bottom:1px solid #000}
.fins i{flex:1;background:linear-gradient(#5a6068,#2a2d32);margin-top:3px;border-radius:1px 1px 0 0;transition:filter .1s}
.board{position:absolute;background:linear-gradient(#1d2024,#16181b);border:1px solid #3b4047;border-radius:3px;box-shadow:inset 0 0 0 3px #1a1c20,inset 0 0 0 4px #2b2f35}
.board h3{margin:0;position:absolute;left:12px;top:8px;font-size:9.5px;font-weight:700;letter-spacing:.22em;color:#8d949c}
.board h3 em{font-style:normal;color:#ff3b30;margin-right:6px}
.board:after,.board:before{content:'';position:absolute;width:6px;height:6px;border-radius:50%;background:radial-gradient(#8a9099,#3a3f46);top:6px;right:8px}
.board:before{top:auto;bottom:6px}
.krow{position:absolute;left:8px;right:8px;top:26px;bottom:8px;display:flex;justify-content:space-around;align-items:center}
.kn{display:flex;flex-direction:column;align-items:center;width:62px}
.kb{width:46px;height:46px;border-radius:50%;position:relative;margin:7px 0 5px;background:conic-gradient(from 20deg,#3a3f46,#9aa1a9,#3a3f46,#6c727a,#262930,#8a9099,#3a3f46);border:2px solid #0e0f11;box-shadow:0 0 0 2px #454a51,0 4px 6px #000a}
.kb:before{content:'';position:absolute;inset:-9px;border-radius:50%;background:conic-gradient(from -135deg,#ff3b30 0,#ff3b30 calc(var(--v)*270deg),#33373d calc(var(--v)*270deg),#33373d 270deg,transparent 270deg);-webkit-mask:radial-gradient(circle,transparent 62%,#000 64%,#000 72%,transparent 74%);mask:radial-gradient(circle,transparent 62%,#000 64%,#000 72%,transparent 74%)}
.kb:after{content:'';position:absolute;inset:7px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#4b5159,#14161a)}
.kb i{position:absolute;inset:0;transform:rotate(calc(-135deg + var(--v)*270deg));z-index:2}.kb i:after{content:'';position:absolute;left:50%;top:3px;width:3px;height:13px;margin-left:-1.5px;background:#ff3b30;border-radius:1px;box-shadow:0 0 5px #ff3b30}
.kb.drag{box-shadow:0 0 0 2px #ff3b30,0 4px 6px #000a}
.kn label{font-size:8px;letter-spacing:.14em;color:#98a0a8;text-transform:uppercase;white-space:nowrap}.kn b{font:400 9.5px 'Space Mono',monospace;color:#e6e9ec;margin-top:2px;min-width:54px;text-align:center}
.algo{display:flex;flex-direction:column;gap:5px;align-items:stretch;width:84px}
.seg button{display:block;width:100%;margin-bottom:4px;height:26px;background:#22252a;border:1px solid #454a51;color:#98a0a8;font:700 11px 'Chakra Petch';letter-spacing:.14em;cursor:pointer;border-radius:2px;text-align:left;padding-left:26px;position:relative}
.seg button:before{content:'';position:absolute;left:9px;top:9px;width:8px;height:8px;border-radius:50%;background:#2a1411;border:1px solid #5a2a24}
.seg button.on{color:#fff;background:#2e3238}.seg button.on:before{background:#ff3b30;box-shadow:0 0 8px #ff3b30}
.fan{position:absolute;width:104px;height:104px}
.fan svg{width:100%;height:100%;display:block}
.fanl{position:absolute;font-size:8px;letter-spacing:.18em;color:#7a8088;text-align:center;font-family:'Space Mono',monospace}
.rd{position:absolute;left:636px;top:236px;width:308px;height:58px;background:#0e0f11;border:1px solid #3b4047;display:grid;grid-template-columns:1fr 1fr 1fr;font-size:8px;letter-spacing:.16em;color:#6c727a}
.rd div{padding:8px 10px;border-right:1px solid #24272c}.rd div:last-child{border:0}.rd b{display:block;font:500 15px 'Space Mono',monospace;color:#e6e9ec;letter-spacing:0;margin-top:4px}.rd b.hot{color:#ff7a45}
.pg{position:absolute;left:636px;top:302px;width:308px;height:244px;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr);gap:6px;touch-action:none}
.pad{background:linear-gradient(#2d3137,#202328);border:1px solid #454a51;border-radius:3px;position:relative;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;user-select:none;box-shadow:0 3px 0 #0c0d0f}
.pad .pn{font-size:9.5px;font-weight:700;letter-spacing:.12em;color:#c9ced4;pointer-events:none}.pad .pm{font:8px 'Space Mono',monospace;color:#6c727a;pointer-events:none}
.pad:before{content:'';position:absolute;left:6px;top:6px;width:7px;height:7px;border-radius:50%;background:#2a1411;border:1px solid #5a2a24}
.pad.on{background:linear-gradient(#3a3f46,#2a2d33);transform:translateY(2px);box-shadow:0 1px 0 #0c0d0f}.pad.on:before{background:#ff3b30;box-shadow:0 0 10px #ff3b30}
.pad.hit:after{content:'';position:absolute;inset:0;border:2px solid #ff3b30;border-radius:3px;animation:fl .4s ease-out forwards;pointer-events:none}
@keyframes fl{from{opacity:.9}to{opacity:0;transform:scale(1.08)}}
.seqb{position:absolute;left:16px;top:392px;width:424px;height:154px}
.lanes{position:absolute;left:12px;top:26px;display:flex;gap:4px}
.ln{height:22px;padding:0 9px;background:#22252a;border:1px solid #454a51;color:#98a0a8;font:700 9px 'Chakra Petch';letter-spacing:.14em;cursor:pointer;border-radius:2px}
.ln.on{background:#ff3b30;color:#fff;border-color:#ff3b30}
.srow{position:absolute;left:12px;right:12px;top:58px;display:grid;grid-template-columns:repeat(16,1fr);gap:3px}
.st{height:34px;background:#0e0f11;border:1px solid #3b4047;border-radius:2px;cursor:pointer;position:relative}
.st:nth-child(4n+1){border-color:#5a6068}
.st.any:after{content:'';position:absolute;left:50%;bottom:4px;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:#6c727a}
.st.on{background:linear-gradient(#ffb09a,#ff3b30);border-color:#ff7a62;box-shadow:0 0 8px #ff3b3088}.st.on:after{background:#fff}
.st.now{outline:2px solid #7dffa1;outline-offset:1px}
.tr{position:absolute;left:12px;right:12px;top:106px;display:flex;align-items:center;gap:6px;font-size:9px;letter-spacing:.14em;color:#98a0a8}
.tr button{height:26px;padding:0 10px;background:#22252a;border:1px solid #454a51;color:#c9ced4;font:700 10px 'Chakra Petch';letter-spacing:.14em;cursor:pointer;border-radius:2px}
.tr button.on{background:#7dffa1;color:#06210f;border-color:#7dffa1}
.tr b{font:500 14px 'Space Mono',monospace;color:#e6e9ec;min-width:34px;text-align:center}
.scb{position:absolute;left:452px;top:392px;width:168px;height:154px}
.scb canvas{position:absolute;left:10px;top:26px;width:148px;height:100px;background:#07110a;border:2px inset #3a3e45}
.scb .cap{position:absolute;left:12px;bottom:8px;font:8px 'Space Mono',monospace;color:#6c727a;letter-spacing:.08em}
.foot{position:absolute;left:0;right:0;bottom:0;height:0}
</style>
<div class="a">
 <div class="hd">
  <div class="logo">ASIC<small>ANALOG DRUM HASHER · 16 CHIPS</small></div>
  <div class="pb"><button data-pp="-1" type="button">&#9664;</button><div class="lcd"><span class="pi" data-pi></span><span class="pnm" data-pn></span></div><button data-pp="1" type="button">&#9654;</button></div>
  <div class="ro"><div>HASHRATE<b id="hr">0.0 TH/s</b></div><div>CORE TEMP<b id="tp">38 °C</b></div><div>POWER<b id="pw">3250 W</b></div></div>
 </div>
 <div class="fins">${fins}</div>
 <div class="board" style="left:16px;top:90px;width:276px;height:146px"><h3><em>01</em>KICK CHIP</h3><div class="krow">${KNOB('kickTune', 'Tune')}${KNOB('kickDecay', 'Decay')}${KNOB('kickPunch', 'Punch')}${KNOB('kickClick', 'Click')}</div></div>
 <div class="board" style="left:300px;top:90px;width:320px;height:146px"><h3><em>02</em>SNARE · CLAP CHIP</h3><div class="krow">${KNOB('snareTune', 'Snare Tune')}${KNOB('snareSnap', 'Snap')}${KNOB('snareDecay', 'Decay')}${KNOB('clapDecay', 'Clap Dec')}${KNOB('clapSpread', 'Spread')}</div></div>
 <div class="board" style="left:16px;top:244px;width:276px;height:140px"><h3><em>03</em>METAL CHIP · HATS / CYMBALS</h3><div class="krow">${KNOB('hatTone', 'Hat Tone')}${KNOB('hatDecay', 'Closed')}${KNOB('openDecay', 'Open')}${KNOB('cymDecay', 'Cymbal')}</div></div>
 <div class="board" style="left:300px;top:244px;width:132px;height:140px"><h3><em>04</em>TOMS</h3><div class="krow">${KNOB('tomTune', 'Tune')}${KNOB('tomDecay', 'Decay')}</div></div>
 <div class="board" style="left:440px;top:244px;width:180px;height:140px"><h3><em>05</em>ALGO</h3><div class="krow" style="justify-content:center"><div class="algo">${SEG('kit', ['808', '909', 'LO-FI'])}</div><div style="width:6px"></div><div style="font-size:8px;letter-spacing:.14em;line-height:1.6;color:#6c727a;width:70px">SHA-<b style="color:#e6e9ec" id="alg">808</b><br>HASH FN<br>PARALLEL<br>16 CHIPS</div></div></div>
 <div class="board seqb"><h3><em>06</em>NONCE SEQUENCER</h3>
  <div class="lanes">${LANES()}</div><div class="srow">${STEPS()}</div>
  <div class="tr"><button data-play type="button">&#9654; MINE</button><button data-bpm="-4" type="button">&minus;</button><b data-bpmv>112</b><button data-bpm="4" type="button">+</button><span>BPM</span><span style="margin-left:auto">STEP 16 / BLOCK</span></div></div>
 <div class="board scb"><h3><em>07</em>OSC</h3><canvas id="osc" width="296" height="200"></canvas><div class="cap">KICK PROFILE · LIVE</div></div>
 <div class="board" style="left:628px;top:90px;width:316px;height:140px;background:#0e0f11"><h3 style="left:12px;top:6px"><em>FAN</em>A / B</h3></div>
 <div class="fan" style="left:660px;top:102px" id="fa"></div><div class="fan" style="left:832px;top:102px" id="fb"></div>
 <div class="fanl" style="left:660px;top:212px;width:108px" id="fra">0 RPM</div><div class="fanl" style="left:832px;top:212px;width:108px" id="frb">0 RPM</div>
 <div class="rd"><div>LEVEL<b data-t="level"></b></div><div>DRIVE<b data-t="drive"></b></div><div>TONE LPF<b data-t="tone"></b></div></div>
 <div class="pg" id="pg"></div>
</div>`;
    const q = s => root.querySelector(s);
    // two fans
    const fanSvg = n => `<svg viewBox="0 0 128 128"><circle cx="64" cy="64" r="62" fill="#0b0c0e" stroke="#4a4f57" stroke-width="3"/><circle cx="64" cy="64" r="56" fill="none" stroke="#24272c" stroke-width="2"/>${[[10, 10], [118, 10], [10, 118], [118, 118]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#3a3f46"/>`).join('')}<g class="rot" id="rot${n}" style="transform-origin:64px 64px">${Array.from({ length: 7 }, (_, i) => `<path d="M64 64 L64 10 C84 12 96 28 92 46 C84 38 74 38 64 64Z" fill="#6c727a" stroke="#14161a" stroke-width="1.2" transform="rotate(${i * 360 / 7} 64 64)"/>`).join('')}</g><circle cx="64" cy="64" r="13" fill="#14161a" stroke="#5a6068" stroke-width="2"/><circle cx="64" cy="64" r="4" fill="#ff3b30"/></svg>`;
    q('#fa').innerHTML = fanSvg('a'); q('#fb').innerHTML = fanSvg('b');
    pads(q('#pg'), P, m => PADN[m]);
    wire(root, P);
    P.sub('kit', v => { q('#alg').textContent = ['808', '909', 'LOFI'][v]; });
    seq(root, P, () => bump());
    const finEls = [...root.querySelectorAll('.fins i')];
    let angA = 0, angB = 0, lv = 0, boost = 0;
    const bump = () => { boost = 1; };
    P.onNote(ev => { if (ev.type === 'on') bump(); });
    const ra = q('#rot' + 'a'), rb = q('#rotb'), hr = q('#hr'), tp = q('#tp'), pw = q('#pw'), fra = q('#fra'), frb = q('#frb');
    const cv = q('#osc'), cx = cv.getContext('2d'), buf = new Float32Array(1024);
    P.raf(() => {
      lv += (P.level() - lv) * 0.2; boost *= 0.94;
      const act = Math.min(1, lv * 1.4 + boost * 0.8), lvl = P.get('level') / 1.5;
      const sp = 1.2 + act * 22 + lvl * 3;
      angA += sp; angB -= sp * 0.93; ra.style.transform = `rotate(${angA % 360}deg)`; rb.style.transform = `rotate(${angB % 360}deg)`;
      const rate = 14 + lvl * 60 + act * 70 + P.get('drive') * 20;
      hr.textContent = rate.toFixed(1) + ' TH/s';
      const temp = 38 + P.get('drive') * 22 + act * 24 + lvl * 8; tp.textContent = Math.round(temp) + ' °C'; tp.className = temp > 62 ? 'hot' : '';
      pw.textContent = Math.round(2400 + rate * 9) + ' W';
      fra.textContent = Math.round(900 + sp * 180) + ' RPM'; frb.textContent = Math.round(880 + sp * 175) + ' RPM';
      finEls.forEach((f, i) => { const k = Math.max(0, act * 1.2 - Math.abs(Math.sin(i * 0.37)) * 0.35 + (temp - 40) / 120); f.style.filter = k > 0.15 ? `brightness(${1 + k * 0.9}) sepia(${Math.min(1, k)}) hue-rotate(-30deg) saturate(${1 + k * 2})` : 'none'; });
      // osc: static kick profile (dim) + live scope
      const W = cv.width, H = cv.height; cx.clearRect(0, 0, W, H); cx.strokeStyle = '#143a20'; cx.lineWidth = 1; cx.beginPath();
      for (let i = 1; i < 6; i++) { cx.moveTo(W * i / 6, 0); cx.lineTo(W * i / 6, H); } cx.moveTo(0, H / 2); cx.lineTo(W, H / 2); cx.stroke();
      const km = kickModel(P, 1600); cx.strokeStyle = '#3dff7a55'; cx.lineWidth = 2; cx.beginPath();
      for (let i = 0; i < W; i++) { const y = H / 2 - km[Math.floor(i / W * 1600)] * H * 0.42; i ? cx.lineTo(i, y) : cx.moveTo(i, y); } cx.stroke();
      const an = Kit.audio.analyser();
      if (an) { an.getFloatTimeDomainData(buf); cx.strokeStyle = '#7dffa1'; cx.shadowColor = '#3dff7a'; cx.shadowBlur = 6; cx.lineWidth = 2; cx.beginPath(); for (let i = 0; i < 512; i++) { const x = i / 511 * W, y = H / 2 - buf[i] * H * 0.9; i ? cx.lineTo(x, y) : cx.moveTo(x, y); } cx.stroke(); cx.shadowBlur = 0; }
    });
  }

  /* ============================== FACE B : Blocktime ============================== */
  

  /* ============================== FACE C : Rekt ============================== */
  

  Kit.register('kit', {
    fonts: 'family=Chakra+Petch:wght@400;500;700&family=Sora:wght@300;400;500;600;700&family=Anton&family=Space+Mono:wght@400;700',
    w: 960, h: 560, params, presets,
    faces: [
      { key: 'A', name: 'ASIC', accent: '#c9ced4', build: buildA },
      undefined,
      undefined
    ].filter(Boolean)
  });
})();
