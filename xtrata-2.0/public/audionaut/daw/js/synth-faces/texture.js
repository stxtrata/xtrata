import { Kit } from "./runtime.js";
/* texture.js - noise / grain / impact texture synth: three faces (FUD, Mempool, Strata) */
(function () {
  const MODELS = ['wind', 'riser', 'drone', 'cloud', 'impact'];
  const CHORDS = ['free', 'octaves', 'fifths', 'major', 'minor', 'cluster'];
  const TW = Math.PI * 2;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const pct = v => Math.round(v * 100) + '%';
  const secs = v => v < 1 ? Math.round(v * 1000) + ' ms' : v.toFixed(2) + ' s';
  const R = (id, label, min, max, def, step, fmt, log) => ({ id, label, min, max, def, step, fmt, log });
  const PARAMS = [
    { id: 'model', label: 'Model', options: MODELS.map(s => s.toUpperCase()), def: 0 },
    R('tone', 'Tone (filter position)', 0, 1, 0.5, 0.01, pct), R('res', 'Resonance', 0, 1, 0.3, 0.01, pct), R('track', 'Key Tracking', 0, 1, 0.8, 0.01, pct),
    R('color', 'Noise Colour (white-pink-brown)', 0, 1, 0.4, 0.01, v => v < 0.2 ? 'white' : v < 0.45 ? 'w-pink' : v < 0.7 ? 'pink' : v < 0.9 ? 'p-brown' : 'brown'),
    R('tonal', 'Tonal (noise -> pitched)', 0, 1, 0.3, 0.01, pct), R('motion', 'Motion', 0, 1, 0.5, 0.01, pct),
    R('rate', 'Motion Rate', 0.05, 12, 0.6, 0.05, v => v.toFixed(2) + ' Hz', true), R('sweep', 'Sweep / Drop', 0, 6, 3, 0.1, v => v.toFixed(1) + ' oct'),
    R('spread', 'Spread', 0, 1, 0.5, 0.01, pct), R('density', 'Grain Density', 2, 120, 30, 1, v => Math.round(v) + '/s'),
    R('grain', 'Grain Length', 0.01, 0.4, 0.09, 0.005, v => Math.round(v * 1000) + ' ms'),
    { id: 'chord', label: 'Grain Pitches', options: CHORDS.map(s => s.toUpperCase()), def: 2 },
    R('decay', 'Impact Decay', 0.2, 6, 1.8, 0.05, secs, true), R('attack', 'Attack', 0.005, 4, 0.4, 0.005, secs, true), R('release', 'Release', 0.02, 6, 0.8, 0.01, secs, true),
    R('level', 'Output Level', 0, 1.5, 1, 0.01, v => Math.round(v / 1.5 * 100) + '%')
  ];
  const mk = (name, o) => { const v = {}; for (const k in o) v[k] = k === 'model' ? MODELS.indexOf(o[k]) : k === 'chord' ? CHORDS.indexOf(o[k]) : o[k]; return { name, values: v }; };
  const PRESETS = [
    mk('Init (Wind)', {}),
    mk('Desert Wind', { model: 'wind', tone: 0.35, res: 0.55, track: 0.5, color: 0.65, tonal: 0.05, motion: 0.75, rate: 0.35, spread: 0.85, attack: 0.9, release: 1.5 }),
    mk('Whistling Gale', { model: 'wind', tone: 0.55, res: 0.9, track: 1, color: 0.25, tonal: 0.4, motion: 0.55, rate: 0.8, spread: 0.7, attack: 0.5, release: 1.2 }),
    mk('Tension Riser', { model: 'riser', tone: 0.5, res: 0.45, track: 0.7, color: 0.25, tonal: 0.45, motion: 0.7, rate: 2, sweep: 4, spread: 0.5, release: 0.5 }),
    mk('White Noise Sweep', { model: 'riser', tone: 0.55, res: 0.2, track: 0.3, color: 0, tonal: 0, motion: 0.2, rate: 1, sweep: 5, spread: 0.3, release: 0.35 }),
    mk('Dark Drone', { model: 'drone', tone: 0.3, res: 0.3, track: 1, color: 0.8, tonal: 0.8, motion: 0.55, rate: 0.15, spread: 0.55, attack: 1.2, release: 2.2 }),
    mk('Glass Cloud', { model: 'cloud', tone: 0.7, res: 0.6, track: 1, tonal: 0.92, density: 55, grain: 0.12, chord: 'fifths', spread: 0.5, attack: 0.5, release: 1.6 }),
    mk('Grain Dust', { model: 'cloud', tone: 0.55, res: 0.7, track: 0.8, tonal: 0.1, density: 90, grain: 0.03, chord: 'free', spread: 0.6, attack: 0.15, release: 0.8 }),
    mk('Sub Impact', { model: 'impact', tone: 0.3, res: 0.2, track: 1, color: 0.9, tonal: 0.85, motion: 0.8, sweep: 2.5, decay: 3.2 })
  ];
  const hash = i => ((i + 5) * 2654435761 >>> 0).toString(16).slice(0, 4);
  const rng = seed => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };

  /* note-driven energy envelope (attack / release / impact decay) */
  function energy(P) {
    let v = 0, held = 0, last = performance.now(), t0 = -1e9, nid = 0;
    P.onNote(e => { if (e.type === 'on') { held++; t0 = performance.now(); nid++; if (P.get('model') === 4) v = 1; } else held = Math.max(0, held - 1); });
    return () => {
      const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now;
      const at = Math.max(0.01, P.get('attack')), rl = Math.max(0.05, P.get('release')), dc = P.get('decay');
      if (P.get('model') === 4) v *= Math.exp(-dt / (dc * 0.5)); else if (held > 0) v += (1 - v) * (1 - Math.exp(-dt / (at * 0.5))); else v *= Math.exp(-dt / (rl * 0.5));
      return { e: Math.max(v, 0.14 + 0.05 * Math.sin(now / 1500)), v, held, age: (now - t0) / 1000, nid, now, dt };
    };
  }
  function presetMenu(P, o) {
    const n = P.presets.length; let cur = -1;
    o.list.innerHTML = P.presets.map((p, i) => '<div class="it" data-i="' + i + '">' + o.item(p.name, i) + '</div>').join('');
    o.prev && (o.prev.onclick = () => P.loadPreset((Math.max(cur, 0) - 1 + n) % n));
    o.next && (o.next.onclick = () => P.loadPreset((cur + 1) % n));
    o.list.addEventListener('click', e => { const it = e.target.closest('.it'); if (it) { P.loadPreset(+it.dataset.i); if (o.pop) o.list.classList.remove('open'); } });
    if (o.pop && o.name) o.name.addEventListener('click', () => o.list.classList.toggle('open'));
    P.onPreset((i, nm) => { cur = i; if (o.name) o.name.innerHTML = i < 0 ? o.none : o.title(nm, i); o.list.querySelectorAll('.it').forEach(el => el.classList.toggle('cur', +el.dataset.i === i)); });
  }
  function wire(root, P) {
    root.querySelectorAll('[data-p]').forEach(el => {
      const id = el.dataset.p, o = el.dataset.o ? JSON.parse(el.dataset.o) : undefined; P.bind(el, id, o);
      const h = el.closest('[data-c]') || el, v = h.querySelector('.val'); if (v) P.text(v, id);
    });
  }
  /* multi-option select as a row of buttons: reflect value, click sets */
  function seg(root, P, id, sel) {
    const btns = [...root.querySelectorAll(sel)];
    btns.forEach((b, i) => b.addEventListener('click', () => P.set(id, i)));
    P.sub(id, v => btns.forEach((b, i) => b.classList.toggle('on', i === v)));
  }
  const NOTE_FOOT = (arr, i) => arr[i % arr.length];

  /* ============================== A: FUD ============================== */
  

  /* ============================== B: MEMPOOL ============================== */
  const mempool = {
    key: 'B', name: 'Mempool', accent: '#b79cff',
    build(root, P) {
      const GR = [['filter', [['tone', 'Tone'], ['res', 'Res'], ['track', 'Key']]], ['noise', [['color', 'Colour'], ['tonal', 'Tonal']]], ['motion', [['motion', 'Motion'], ['rate', 'Rate'], ['sweep', 'Sweep'], ['spread', 'Spread']]], ['grains', [['density', 'Density'], ['grain', 'Length']]], ['envelope', [['decay', 'Decay'], ['attack', 'Attack'], ['release', 'Release'], ['level', 'Output']]]];
      const orb = ([id, l]) => '<div class="ob" data-c><span class="lb">' + l + '</span><div class="orb" data-p="' + id + '"><i class="liq"></i><i class="gl"></i></div><b class="val"></b></div>';
      root.innerHTML = `<style>
.mp{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 0%,#f7f9ff,#e6ecff 45%,#ddd3fb);color:#3b3566;font-family:Manrope,'Segoe UI',system-ui,sans-serif}.mp *{box-sizing:border-box}
.logo{position:absolute;left:28px;top:14px;font-weight:800;font-size:32px;letter-spacing:-.02em;color:#463c80;display:flex;align-items:center;gap:10px}.logo svg{width:34px;height:34px}.logo small{display:block;font-size:10px;font-weight:600;letter-spacing:.04em;color:#8a82b8;margin-top:-2px}
.pm{position:absolute;left:300px;top:16px;width:350px;height:44px;border-radius:22px;background:#fffc;border:1.5px solid #cfc3f7;display:flex;align-items:center;box-shadow:0 4px 14px #a290e033}
.pm button{width:44px;height:100%;background:none;border:0;color:#7d65d6;font-size:15px;cursor:pointer;border-radius:22px}.pm button:hover{background:#b79cff33}
.pm .nm{flex:1;text-align:center;font-weight:700;font-size:15px;cursor:pointer;white-space:nowrap}.pm .nm i{font-style:normal;font-weight:600;font-size:11px;color:#9a8fd0;margin-right:8px}
.pl{display:none;position:absolute;left:0;top:50px;width:350px;background:#fffffff2;border:1.5px solid #cfc3f7;border-radius:18px;z-index:30;padding:6px;box-shadow:0 12px 30px #6a52c040}.pl.open{display:block}.pl .it{padding:6px 14px;border-radius:12px;font-weight:600;font-size:13px;cursor:pointer;display:flex;justify-content:space-between}.pl .it:hover{background:#ece6ff}.pl .it.cur{background:#b79cff;color:#fff}.pl .it i{font-style:normal;opacity:.6;font-size:11px}
.stat{position:absolute;left:672px;top:16px;width:260px;height:44px;font-size:11px;font-weight:600;color:#8a82b8;line-height:1.35;text-align:right}.stat b{color:#5c46c6;font-size:15px;font-weight:800}
.pool{position:absolute;left:28px;top:70px;width:620px;height:262px;border-radius:30px;border:2px solid #fff;box-shadow:0 10px 30px #8c78e033,inset 0 0 40px #ffffff88;background:#eaf0ff}
.side{position:absolute;left:664px;top:70px;width:268px;height:262px}.pan{position:absolute;left:0;width:268px;border-radius:22px;background:#ffffffaa;border:1.5px solid #fff;box-shadow:0 4px 16px #8c78e022}.pan h6{margin:0;position:absolute;left:16px;top:8px;font-size:10px;font-weight:800;letter-spacing:.12em;color:#9a8fd0;text-transform:uppercase}
.pills{position:absolute;left:12px;right:12px;top:26px;display:flex;flex-wrap:wrap;gap:5px}.pill{flex:1 0 auto;height:28px;border-radius:14px;border:1.5px solid #cfc3f7;background:#fff;color:#6b5cb8;font:700 11px Manrope,system-ui,sans-serif;cursor:pointer;padding:0 10px}.pill:hover{border-color:#b79cff}.pill.on{background:linear-gradient(135deg,#9ec5ff,#b79cff);color:#fff;border-color:transparent;box-shadow:0 3px 10px #8c78e055}
.spc{position:absolute;left:12px;top:26px;width:244px;height:60px;border-radius:14px;background:#2d2760}.spc canvas{width:100%;height:100%;border-radius:14px}
.bank{position:absolute;left:28px;top:342px;width:904px;height:136px;display:flex;gap:8px}.gp{position:relative;border-radius:20px;background:#ffffff88;border:1.5px solid #fff;padding:20px 4px 0;display:flex;justify-content:space-around}.gp h6{margin:0;position:absolute;left:0;right:0;top:5px;text-align:center;font-size:9.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#9a8fd0}
.ob{display:flex;flex-direction:column;align-items:center;width:54px;cursor:ns-resize}.ob .lb{font-size:10px;font-weight:700;color:#6b5cb8;white-space:nowrap}.ob .val{font-size:10.5px;font-weight:800;color:#463c80;white-space:nowrap;margin-top:3px}
.orb{width:46px;height:46px;border-radius:50%;margin-top:4px;position:relative;overflow:hidden;background:#fff;border:2px solid #cfc3f7;box-shadow:inset 0 3px 8px #8c78e033,0 3px 8px #8c78e022}.orb .liq{position:absolute;left:-10%;right:-10%;bottom:0;height:calc(var(--v,0)*100%);background:linear-gradient(180deg,#b79cff,#8ab6ff);transition:none}.orb .liq:before{content:'';position:absolute;left:0;right:0;top:-4px;height:8px;border-radius:50%;background:#c9b6ff;opacity:.9}
.orb .gl{position:absolute;left:8px;top:5px;width:14px;height:8px;border-radius:50%;background:#ffffffb0;transform:rotate(-30deg)}.ob:hover .orb,.orb.drag{border-color:#b79cff}
.keys{position:absolute;left:28px;top:488px;width:904px;height:60px;border-radius:0 0 18px 18px;padding:0 2px;overflow:visible}.keys .kb-w{background:linear-gradient(#fff,#eee8ff);border:1.5px solid #cfc3f7;border-top:0;border-radius:0 0 12px 12px}.keys .kb-w.on{background:linear-gradient(#cdbcff,#a999f0)}.keys .kb-b{background:linear-gradient(#6a58bf,#463c80);border:0;border-radius:0 0 8px 8px}.keys .kb-b.on{background:linear-gradient(#9ec5ff,#7d65d6)}
</style><div class="mp">
<div class="logo"><svg viewBox="0 0 34 34"><g fill="#b79cff"><rect x="3" y="3" width="9" height="9" rx="3"/><rect x="14" y="5" width="7" height="7" rx="2.5" fill="#9ec5ff"/><rect x="23" y="3" width="8" height="8" rx="3"/><rect x="5" y="15" width="7" height="7" rx="2.5" fill="#9ec5ff"/><rect x="15" y="14" width="10" height="10" rx="3.5"/><rect x="8" y="25" width="8" height="8" rx="3"/><rect x="21" y="26" width="7" height="7" rx="2.5" fill="#9ec5ff"/></g></svg><div>Mempool<small>pending sounds, waiting for a block</small></div></div>
<div class="pm"><button class="pv">&#9664;</button><div class="nm"></div><button class="nx">&#9654;</button><div class="pl"></div></div>
<div class="stat"><b id=pn>0</b> pending<br><span id=pb></span></div>
<canvas class="pool" width="1240" height="524"></canvas>
<div class="side"><div class="pan" style="top:0;height:94px"><h6>Model</h6><div class="pills">${MODELS.map(m => '<button class="pill md">' + m + '</button>').join('')}</div></div>
<div class="pan" style="top:102px;height:90px"><h6>Grain pitches</h6><div class="pills">${CHORDS.map(m => '<button class="pill ch2">' + m + '</button>').join('')}</div></div>
<div class="pan" style="top:200px;height:62px"><h6 style="top:5px;left:14px">Pending spectrum</h6><div class="spc" style="top:20px;left:12px;height:36px;width:244px"><canvas id=sp width=488 height=72></canvas></div></div></div>
<div class="bank">${GR.map(([t, a]) => '<div class="gp" style="width:' + (a.length * 56 + 4) + 'px"><h6>' + t + '</h6>' + a.map(orb).join('') + '</div>').join('')}</div>
<div class="keys"></div></div>`;
      const $ = s => root.querySelector(s);
      wire(root, P); seg(root, P, 'model', '.md'); seg(root, P, 'chord', '.ch2');
      presetMenu(P, { prev: $('.pv'), next: $('.nx'), name: $('.nm'), list: $('.pl'), pop: 1, none: '<i>queue</i>unconfirmed', item: (n, i) => n + '<i>#' + (i + 1) + '</i>', title: (n, i) => '<i>#' + (i + 1) + '</i>' + n });
      P.keyboard($('.keys'), { from: 48, octaves: 3 }); P.spectrum($('#sp'), { color: '#b79cff', color2: '#9ec5ff', bars: 30, gap: 2 });
      const cv = $('.pool'), c = cv.getContext('2d'), en = energy(P), rnd = rng(11), W = 620, H = 262, CX = W / 2, CY = 118;
      const MAXP = 380, ps = Array.from({ length: MAXP }, () => ({ a: rnd() * TW, r: 20 + rnd() * 110, s: 0.6 + rnd() * 0.8, h: rnd(), j: rnd() * TW, f: 0 }));
      const blocks = []; const ripples = []; let lastN = 0, bn = 800000 + (Date.now() % 1000);
      P.onNote(e => { if (e.type === 'on') { ripples.push({ t: performance.now(), v: e.vel || 0.8 }); blocks.push({ t: performance.now(), n: ++bn, v: e.vel || 0.8 }); if (blocks.length > 9) blocks.shift(); ps.forEach(p => { if (rnd() < 0.2) p.f = 1; }); } });
      const lerp = (a, b, t) => a + (b - a) * t, cl = [[158, 197, 255], [183, 156, 255], [110, 86, 200]];
      const colAt = t => { t = clamp(t, 0, 1) * 2; const i = Math.min(1, Math.floor(t)), f = t - i, A = cl[i], B = cl[i + 1]; return [lerp(A[0], B[0], f), lerp(A[1], B[1], f), lerp(A[2], B[2], f)].map(Math.round); };
      const rr = (x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
      let tt = 0;
      P.raf(() => {
        const E = en(), dt = E.dt, now = performance.now(); tt += dt;
        const n = Math.round(80 + (P.get('density') - 2) / 118 * (MAXP - 80)), tonal = P.get('tonal'), mot = P.get('motion'), col = P.get('color'), sw = P.get('sweep') / 6, spr = P.get('spread'), m = P.get('model');
        c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, W, H);
        c.save(); rr(0, 0, W, H, 28); c.clip();
        const bg = c.createRadialGradient(CX, CY, 10, CX, CY, 330); bg.addColorStop(0, '#fbfaff'); bg.addColorStop(0.5, '#e4e9ff'); bg.addColorStop(1, '#cdbffb'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
        /* vortex halo */
        const hg = c.createRadialGradient(CX, CY, 0, CX, CY, 60 + 50 * E.e); hg.addColorStop(0, 'rgba(183,156,255,' + (0.35 + 0.35 * E.e) + ')'); hg.addColorStop(1, 'rgba(183,156,255,0)'); c.fillStyle = hg; c.fillRect(0, 0, W, H);
        /* ripples */
        for (let i = ripples.length - 1; i >= 0; i--) { const age = (now - ripples[i].t) / 1000, life = 0.8 + P.get('decay') * 0.5; if (age > life) { ripples.splice(i, 1); continue; } const u = age / life; c.strokeStyle = 'rgba(122,98,214,' + (0.5 * (1 - u)) + ')'; c.lineWidth = 3 * (1 - u) + 1; c.beginPath(); c.ellipse(CX, CY, 20 + u * 280, (20 + u * 280) * 0.5, 0, 0, TW); c.stroke(); }
        const sizeBase = 3.5 + P.get('grain') * 26, wsp = 0.1 + P.get('rate') * 0.16;
        for (let i = 0; i < n; i++) {
          const p = ps[i], rn = p.r / 130;
          p.a += dt * wsp * (1 + 2.2 * (1 - rn)) * p.s * (1 + E.e * 1.2) * (m === 2 ? 0.5 : m === 0 ? 1.4 : 1);
          p.r -= dt * (sw * 10 + (m === 1 ? 16 * E.e : 0)) * (0.3 + rn) ; if (m === 1 && E.held) p.r -= dt * 8;
          if (p.r < 8) { p.r = 120 + rnd() * 24; p.a = rnd() * TW; }
          let r = p.r + Math.sin(p.a * 3 + tt * 2 + p.j) * mot * 14; if (tonal > 0) { const q = Math.round(r / 22) * 22; r = lerp(r, q, tonal * 0.9); }
          const x = CX + Math.cos(p.a) * r * (1.9 + spr * 0.6), y = CY + Math.sin(p.a) * r * (0.78 + 0.1 * spr);
          const sz = (sizeBase * (0.6 + p.s * 0.6)) * (1 + p.f * 0.8); p.f *= 0.96;
          const t = clamp(col * 0.75 + (p.h - 0.5) * 0.5 + 0.12, 0, 1), k = colAt(t), al = 0.5 + 0.4 * p.s * 0.6 + p.f * 0.4;
          c.fillStyle = 'rgba(' + k.join(',') + ',' + clamp(al, 0, 1) + ')'; c.shadowColor = 'rgba(' + k.join(',') + ',.6)'; c.shadowBlur = 4 + p.f * 10;
          rr(x - sz / 2, y - sz / 2, sz, sz, sz * (m === 3 ? 0.5 : 0.32)); c.fill();
        }
        c.shadowBlur = 0;
        /* confirmed blocks lane */
        c.fillStyle = 'rgba(255,255,255,.55)'; rr(12, H - 46, W - 24, 34, 17); c.fill();
        c.font = '800 10px Manrope,system-ui,sans-serif'; c.textAlign = 'left'; c.fillStyle = '#9a8fd0'; c.fillText('CONFIRMED', 28, H - 25);
        blocks.forEach((b, i) => { const age = (now - b.t) / 1000, x = W - 52 - age * 26 - (blocks.length - 1 - i) * 0; if (x < 100) return; const s = 20 + 6 * b.v; c.fillStyle = 'rgba(122,98,214,' + clamp(1 - age / 14, 0.15, 1) + ')'; rr(x - s / 2, H - 29 - s / 2 + 0, s, s, 7); c.fill(); c.fillStyle = '#fff'; c.font = '800 8px Manrope,system-ui,sans-serif'; c.textAlign = 'center'; c.fillText(String(b.n).slice(-3), x, H - 26); });
        c.restore();
        $('#pn').textContent = Math.round(n * 1.4 + E.e * 30); $('#pb').textContent = 'next block in ~' + (P.get('attack') * 1.5 + 0.3).toFixed(1) + ' s \u00b7 ' + MODELS[m] + ' pool';
      });
    }
  };

  /* ============================== C: STRATA ============================== */
  

  Kit.register('texture', {
    fonts: 'family=Oswald:wght@400;500;700&family=Manrope:wght@500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600',
    w: 960, h: 560, params: PARAMS, presets: PRESETS, faces: [undefined, mempool, undefined].filter(Boolean)
  });
})();
