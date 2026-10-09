import { Kit } from "./runtime.js";
/* tine.js \u2014 jiTINE: electric piano / Rhodes tine, Wurli reed, piano, clav. Faces: Laszlo, Privkey, Orangepill */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const pad2 = n => String(n).padStart(2, '0');

  /* ---------- shared helpers ---------- */
  function wire(root, P) {
    root.querySelectorAll('[data-k]').forEach(e => P.bind(e, e.dataset.k, e.dataset.o ? JSON.parse(e.dataset.o) : {}));
    root.querySelectorAll('[data-t]').forEach(e => P.text(e, e.dataset.t));
  }
  function presetUI(root, P) {
    const n = P.presets.length; let idx = -1;
    const list = root.querySelector('[data-pl]');
    if (list) list.innerHTML = P.presets.map((p, j) => `<button data-pj="${j}"><span>${pad2(j + 1)}</span><em>${MODELS[p.values.model] || ''}</em>${p.name}</button>`).join('');
    const menu = root.querySelector('[data-pmenu]');
    P.onPreset((i, name) => {
      idx = i;
      root.querySelectorAll('[data-pn]').forEach(e => e.textContent = i < 0 ? 'Init' : name);
      root.querySelectorAll('[data-pi]').forEach(e => e.textContent = (i < 0 ? '--' : pad2(i + 1)) + '/' + n);
      root.querySelectorAll('[data-pj]').forEach(b => b.classList.toggle('on', +b.dataset.pj === i));
    });
    root.querySelectorAll('[data-pp]').forEach(b => b.addEventListener('click', () => P.loadPreset(idx <= 0 ? n - 1 : idx - 1)));
    root.querySelectorAll('[data-pnx]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx + 1) % n)));
    root.querySelectorAll('[data-pj]').forEach(b => b.addEventListener('click', () => { P.loadPreset(+b.dataset.pj); if (menu) menu.classList.remove('open'); }));
    root.querySelectorAll('[data-ptog]').forEach(b => b.addEventListener('click', () => {
      if (!menu) return;
      menu.classList.toggle('open');
      const on = menu.querySelector('button.on');
      if (on && menu.classList.contains('open')) menu.scrollTop = on.offsetTop - menu.clientHeight / 2;
    }));
  }
  // approximate partial spectrum for the display (not the real engine)
  function harm(P, N) {
    const m = P.get('model'), b = P.get('brightness'), t = P.get('touch'), bark = P.get('bark'), ping = P.get('ping'), ham = P.get('hammer'), pk = P.get('pickup'), st = P.get('stretch');
    const out = []; let mx = 0.0001;
    for (let n = 1; n <= N; n++) {
      let a = Math.pow(n, -(2.1 - 1.5 * b)) * (1 + t * 0.7 * Math.min(1, (n - 1) / 6));
      let pos = n;
      if (m === 0) { a *= 1 + (n === 2 || n === 3 ? bark * 0.9 : 0) + (n >= 6 && n <= 8 ? ping * 1.3 : 0) * (0.6 + t * 0.6); a *= 0.5 + 0.5 * Math.abs(Math.sin(Math.PI * n * pk * 1.6 + 0.4)) + 0.2; }
      else if (m === 1) { a *= (n % 2 ? 1 : 0.4) * (1 + (n === 2 ? bark * 1.2 : 0)); a *= 0.6 + 0.4 * Math.abs(Math.sin(Math.PI * n * pk * 2)); }
      else if (m === 2) { pos = n * Math.sqrt(1 + st * 0.004 * n * n); a *= (0.35 + 0.65 * Math.abs(Math.sin(Math.PI * n / 8))) * (1 + ham * (n > 6 ? 0.5 : 0) * t); }
      else { a *= (0.15 + 0.85 * Math.abs(Math.sin(Math.PI * n * pk * 2))) * (1 + bark * 0.8 * (n > 3 ? 1 : 0)) * (1 + ham * 0.4); }
      mx = Math.max(mx, a); out.push({ a, pos });
    }
    return out.map(o => ({ a: o.a / mx, pos: o.pos }));
  }
  function decayD(P, W, H, pad) {
    const dec = P.get('decay'), rel = P.get('release'), tr = P.get('tremolo'), trr = P.get('tremRate');
    const T = 3.2, tr0 = 2.0; let d = '';
    for (let i = 0; i <= 120; i++) {
      const t = i / 120 * T; let a = Math.exp(-t / (0.5 * dec + 0.15));
      if (t > tr0) { a *= Math.exp(-(t - tr0) / (rel * 0.35 + 0.02)); }
      a *= 1 - tr * 0.45 * (0.5 + 0.5 * Math.sin(2 * Math.PI * trr * t * 0.5));
      d += (i ? 'L' : 'M') + (i / 120 * W).toFixed(1) + ' ' + (H - pad - a * (H - 2 * pad)).toFixed(1);
    }
    return { d, kx: tr0 / T * W };
  }

  /* ---------- params ---------- */
  const pct = v => Math.round(v * 100) + '%';
  const params = [
    { id: 'model', label: 'Model', options: ['tine', 'reed', 'piano', 'clav'], def: 0 },
    { id: 'brightness', label: 'Brightness', min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct },
    { id: 'touch', label: 'Touch (velocity -> timbre)', min: 0, max: 1, step: 0.01, def: 0.6, fmt: pct },
    { id: 'decay', label: 'Sustain Length', min: 0.2, max: 2.5, step: 0.01, def: 1, fmt: v => v.toFixed(2) + 'x' },
    { id: 'release', label: 'Release (damper)', min: 0.03, max: 2.5, step: 0.01, def: 0.35, log: true, fmt: v => v.toFixed(2) + ' s' },
    { id: 'bark', label: 'Bark / Pickup Growl', min: 0, max: 1, step: 0.01, def: 0.45, fmt: pct },
    { id: 'ping', label: 'Tine Ping', min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct },
    { id: 'hammer', label: 'Hammer / Click', min: 0, max: 1, step: 0.01, def: 0.4, fmt: pct },
    { id: 'pickup', label: 'Pickup Position', min: 0.06, max: 0.5, step: 0.01, def: 0.2, fmt: v => v.toFixed(2) },
    { id: 'stretch', label: 'Stretch (piano inharmonicity)', min: 0, max: 1, step: 0.01, def: 0.5, fmt: pct },
    { id: 'beat', label: 'String Beat (piano)', min: 0, max: 1, step: 0.01, def: 0.4, fmt: pct },
    { id: 'tremolo', label: 'Tremolo Depth', min: 0, max: 1, step: 0.01, def: 0, fmt: pct },
    { id: 'tremRate', label: 'Tremolo Rate (Hz)', min: 0.5, max: 9, step: 0.1, def: 4.8, fmt: v => v.toFixed(1) + ' Hz' },
    { id: 'level', label: 'Output Level', min: 0, max: 1.5, step: 0.01, def: 1, fmt: v => Math.round(v * 100) + '%' }
  ];
  const MODELS = ['TINE', 'REED', 'PIANO', 'CLAV'];
  const ICON = [
    '<path d="M12 3 V16 M9 16 H15 M12 16 V21 M6 8 C9 6 15 6 18 8"/>',
    '<path d="M3 17 H21 M4 17 C6 8 12 5 20 6 M8 17 V12 M12 17 V9"/>',
    '<path d="M3 6 H21 V18 H3 Z M8 6 V18 M13 6 V18 M18 6 V18 M6 6 V12 M11 6 V12 M16 6 V12"/>',
    '<path d="M3 8 H21 M3 12 H21 M3 16 H21 M7 5 V19 M17 5 V19"/>'
  ];

  /* ============================================================
     A \u2014 LASZLO : red-checker pizza box
     ============================================================ */
  

  /* ============================================================
     B \u2014 PRIVKEY : brass vault door
     ============================================================ */
  function faceB(root, P) {
    const WORDS = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance'];
    const lever = (id, l) => `<div class="lv"><span class="ll">${l}</span><div class="tk" data-k="${id}" data-o='{"abs":true,"axis":"y"}'><i></i><b></b></div><span class="lvv" data-t="${id}"></span></div>`;
    const seed = (id, l, n) => `<div class="sd" data-k="${id}"><span class="sn">${pad2(n)}</span><span class="sw" data-w="${id}"></span><span class="sl">${l}</span><span class="sv" data-t="${id}"></span><i></i></div>`;
    let ticks = '';
    for (let i = 0; i < 100; i++) { const a = i * 3.6 - 90, big = i % 5 === 0, r1 = 150, r2 = big ? 140 : 145; const x1 = 170 + r1 * Math.cos(a * Math.PI / 180), y1 = 170 + r1 * Math.sin(a * Math.PI / 180), x2 = 170 + r2 * Math.cos(a * Math.PI / 180), y2 = 170 + r2 * Math.sin(a * Math.PI / 180); ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#2a1d0a" stroke-width="${big ? 1.6 : .8}"/>`; if (i % 10 === 0) { const tx = 170 + 130 * Math.cos(a * Math.PI / 180), ty = 170 + 130 * Math.sin(a * Math.PI / 180) + 3; ticks += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-size="8" fill="#2a1d0a" font-weight="700">${i}</text>`; } }
    let bolts = '';
    for (let i = 0; i < 12; i++) { const a = (i * 30 + 15) * Math.PI / 180; bolts += `<g class="bolt"><circle cx="${170 + 160 * Math.cos(a)}" cy="${170 + 160 * Math.sin(a)}" r="7" fill="url(#bg)" stroke="#2a1d0a" stroke-width="1.5"/><circle cx="${170 + 160 * Math.cos(a)}" cy="${170 + 160 * Math.sin(a)}" r="2.2" fill="#2a1d0a"/></g>`; }
    root.innerHTML = `<style>
.b{position:absolute;inset:0;background:radial-gradient(120% 100% at 30% 10%,#2a2114 0%,#14110c 55%,#0b0905 100%);color:#e8d6ae;font-family:'IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace;font-size:10px}
.b button{background:none;border:0;padding:0;color:inherit;font:inherit;cursor:pointer}
.b:before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,#ffffff05 0 1px,transparent 1px 3px);pointer-events:none}
.door{position:absolute;left:16px;top:42px}
.dial[data-bind]{position:absolute;left:100px;top:100px;width:140px;height:140px;border-radius:50%;cursor:pointer;transform:rotate(calc(-135deg + var(--v)*270deg));transition:transform .35s cubic-bezier(.3,1.3,.5,1);
background:conic-gradient(from 0deg,#d9b872,#8a6a2e,#e8d09a,#7a5a22,#d9b872,#8a6a2e,#e8d09a,#7a5a22,#d9b872);box-shadow:0 6px 14px #000a,inset 0 0 0 4px #2a1d0a}
.dial:before{content:'';position:absolute;inset:10px;border-radius:50%;background:repeating-conic-gradient(#0003 0 4deg,transparent 4deg 10deg),radial-gradient(circle at 35% 30%,#e8d09a,#a88438 70%);box-shadow:inset 0 0 0 2px #2a1d0a}
.dial:after{content:'';position:absolute;left:50%;top:5px;width:8px;height:26px;margin-left:-4px;background:#c8341f;border:1.5px solid #2a1d0a;border-radius:2px}
.kh{position:absolute;left:50%;top:50%;width:26px;height:40px;margin:-20px 0 0 -13px}
.logo{position:absolute;left:372px;top:14px;font-size:30px;font-weight:700;letter-spacing:.14em;background:linear-gradient(#f4dfa4,#b08d57 60%,#7a5a22);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 #000a)}
.logo small{font-size:10px;letter-spacing:.2em;color:#b08d57;-webkit-text-fill-color:#b08d57;margin-left:12px;font-weight:400}
.wl{position:absolute;right:18px;top:14px;width:290px;display:flex;align-items:center;gap:6px;border:1px solid #b08d57;background:#0b0905;padding:5px 7px}
.wl .pi{color:#b08d57;font-weight:700;font-size:10px}.wl .pn{flex:1;text-align:center;font-weight:700;font-size:12px;color:#f4dfa4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wl button{width:22px;height:22px;border:1px solid #b08d57;color:#f4dfa4;font-size:13px;line-height:1}.wl button:hover{background:#b08d57;color:#0b0905}
.wl .mn{font-size:8.5px;letter-spacing:.14em;color:#b08d57;border:0}
.menu{display:none;position:absolute;right:18px;top:48px;width:290px;max-height:480px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#6b5530 #0b0905;background:#0b0905;border:1px solid #f4dfa4;z-index:9;padding:4px 0;box-shadow:0 10px 30px #000}
.menu.open{display:block}.menu button{display:flex;align-items:baseline;gap:8px;width:100%;text-align:left;padding:4px 12px;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.menu button span{color:#b08d57;width:18px;flex:none}.menu button em{font-style:normal;font-size:8px;letter-spacing:.12em;color:#6b5530;width:36px;flex:none}.menu button:hover em,.menu button.on em{color:#2a1d0a}.menu button:hover,.menu button.on{background:#b08d57;color:#0b0905}.menu button:hover span,.menu button.on span{color:#0b0905}
.box{position:absolute;border:1px solid #6b5530;background:#0d0b07cc}
.box h6{position:absolute;left:10px;top:-6px;margin:0;font-size:8.5px;letter-spacing:.2em;font-weight:500;color:#b08d57;background:#12100a;padding:0 5px}
canvas{display:block}
.lv{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1}
.ll{font-size:8.5px;letter-spacing:.16em;color:#b08d57}.lvv{font-size:10px;color:#f4dfa4;font-variant-numeric:tabular-nums}
.tk[data-bind]{position:relative;width:34px;height:80px;cursor:ns-resize}
.tk:before{content:'';position:absolute;left:50%;top:0;bottom:0;width:6px;margin-left:-3px;background:#050403;border:1px solid #6b5530;border-radius:3px;box-shadow:inset 0 2px 3px #000}
.tk i{position:absolute;left:50%;bottom:0;width:2px;margin-left:-1px;height:calc(var(--v)*100%);background:#f4dfa4;box-shadow:0 0 6px #f4dfa4}
.tk:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,#6b5530 0 1px,transparent 1px 12px);opacity:.5;-webkit-mask:linear-gradient(90deg,transparent 0 3px,#000 3px 8px,transparent 8px 26px,#000 26px 31px,transparent 31px);mask:linear-gradient(90deg,transparent 0 3px,#000 3px 8px,transparent 8px 26px,#000 26px 31px,transparent 31px)}
.tk b{position:absolute;left:3px;right:3px;bottom:calc(var(--v)*100% - 8px);height:16px;border-radius:3px;background:linear-gradient(#f4dfa4,#b08d57 55%,#7a5a22);border:1px solid #2a1d0a;box-shadow:0 2px 3px #000a}
.tk b:after{content:'';position:absolute;left:4px;right:4px;top:50%;height:2px;background:#2a1d0a;margin-top:-1px}
.seeds{position:absolute;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;left:10px;right:10px;top:14px}
.sd[data-bind]{position:relative;height:38px;border:1px solid #6b5530;background:#14110c;padding:3px 6px;display:grid;grid-template-columns:18px 1fr auto;grid-template-rows:1fr 1fr;align-items:center;cursor:ns-resize;overflow:hidden}
.sd:hover{border-color:#b08d57}.sd.drag{border-color:#f4dfa4;background:#241c0e}
.sn{grid-row:1/3;color:#6b5530;font-size:9px}.sw{font-size:12px;font-weight:700;color:#f4dfa4}.sl{font-size:8px;letter-spacing:.12em;color:#b08d57;text-transform:uppercase}.sv{grid-row:1/3;grid-column:3;font-size:9.5px;color:#e8d6ae;font-variant-numeric:tabular-nums}
.sd i{position:absolute;left:0;bottom:0;height:2px;width:calc(var(--v)*100%);background:#b08d57}
.keys{position:absolute;left:372px;right:18px;top:404px;height:108px}
.keys .kb{border:2px solid #2a1d0a;background:#2a1d0a}
.keys .kb-w{background:linear-gradient(#f4ead2,#cdb98a);border:0;border-right:1px solid #8a7040;border-radius:0 0 2px 2px}
.keys .kb-w.on{background:linear-gradient(#f4dfa4,#b08d57)}
.keys .kb-b{background:linear-gradient(#2a2014,#050403);border-radius:0 0 2px 2px;height:60%}
.keys .kb-b.on{background:#b08d57}
.ft{position:absolute;left:18px;right:18px;top:530px;display:flex;justify-content:space-between;font-size:8.5px;letter-spacing:.16em;color:#6b5530}
.st{position:absolute;left:22px;top:398px;width:340px;font-size:9px;line-height:1.5;color:#b08d57}
.st b{color:#f4dfa4;font-weight:500}
</style>
<div class="b">
<div class="logo">PRIVKEY</div>
<div class="wl"><span class="mn">WALLET</span><span class="pi" data-pi></span><button data-pp>\u2039</button><button class="pn" data-ptog data-pn></button><button data-pnx>\u203a</button></div>
<div class="menu" data-pmenu><div data-pl></div></div>
<div class="door"><svg width="340" height="340" viewBox="0 0 340 340" id="door">
<defs><radialGradient id="bg" cx=".35" cy=".3"><stop offset="0" stop-color="#f4dfa4"/><stop offset="1" stop-color="#7a5a22"/></radialGradient><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8d09a"/><stop offset=".5" stop-color="#8a6a2e"/><stop offset="1" stop-color="#d9b872"/></linearGradient></defs>
<circle cx="170" cy="170" r="168" fill="#1c150a" stroke="#6b5530" stroke-width="2"/>
<circle cx="170" cy="170" r="164" fill="url(#rg)" stroke="#2a1d0a" stroke-width="3"/>
<circle cx="170" cy="170" r="152" fill="#c4a468" stroke="#2a1d0a" stroke-width="1.5"/>
${bolts}${ticks}
<circle cx="170" cy="170" r="118" fill="#1a1308" stroke="#2a1d0a" stroke-width="3"/>
<circle cx="170" cy="170" r="114" fill="none" stroke="#b08d57" stroke-width="1" stroke-dasharray="2 4"/>
<g id="lbl" font-weight="700" font-size="11" fill="#e8d6ae" text-anchor="middle"></g>
<path d="M170 44 l-8 -12 h16z" fill="#c8341f" stroke="#2a1d0a" stroke-width="1.2"/>
</svg>
<div class="dial" id="dl" data-k="model"><svg class="kh" viewBox="0 0 26 40"><circle cx="13" cy="14" r="8" fill="#14110c" stroke="#2a1d0a" stroke-width="2"/><path d="M9 20 L17 20 L19 36 L7 36Z" fill="#14110c" stroke="#2a1d0a" stroke-width="2"/></svg></div></div>
<div class="st" id="st"></div>
<div class="box" style="left:372px;top:62px;width:280px;height:104px"><h6>OSCILLOSCOPE \u00b7 LIVE KEY</h6><canvas id="sc" width="560" height="208" style="width:268px;height:92px;margin:6px"></canvas></div>
<div class="box" style="left:664px;top:62px;width:278px;height:104px"><h6>SIGNATURE</h6><svg id="ep" width="268" height="52" viewBox="0 0 268 52" style="margin:4px 5px 0"></svg><div id="sig" style="margin:0 8px;font-size:9px;line-height:1.35;color:#f4dfa4;word-break:break-all;height:26px;overflow:hidden"></div></div>
<div class="box" style="left:372px;top:182px;width:570px;height:130px"><h6>TUMBLERS \u00b7 SET THE PINS</h6><div style="display:flex;padding:22px 14px 0">${lever('brightness', 'BRIGHT')}${lever('touch', 'TOUCH')}${lever('decay', 'SUSTAIN')}${lever('release', 'RELEASE')}${lever('level', 'OUTPUT')}</div></div>
<div class="box" style="left:372px;top:324px;width:570px;height:70px"><h6>SEED WORDS \u00b7 DRAG A WORD</h6><div class="seeds" style="grid-template-columns:repeat(4,1fr)"></div></div>
<div class="keys" id="keys"></div>
<div class="ft"><span id="msg">DO NOT SHARE THE SEED \u00b7 KEYS A\u2013K ALSO PLAY</span><span>SIGN \u00b7 VERIFY \u00b7 LOCK</span></div></div>`;
    // seed grid: 8 secondary params, 2 rows of 4 (box taller)
    const seedBox = root.querySelectorAll('.box')[3]; seedBox.style.height = '100px'; seedBox.style.top = '326px';
    const sg = seedBox.querySelector('.seeds'); sg.style.gridTemplateRows = 'repeat(2,38px)';
    const sids = [['bark', 'bark growl'], ['ping', 'tine ping'], ['hammer', 'hammer'], ['pickup', 'pickup pos'], ['stretch', 'stretch'], ['beat', 'string beat'], ['tremolo', 'tremolo'], ['tremRate', 'trem rate']];
    sg.innerHTML = sids.map((s, i) => seed(s[0], s[1], i + 1)).join('');
    root.querySelector('.keys').style.top = '440px'; root.querySelector('.keys').style.height = '82px'; root.querySelector('.keys').style.left = '18px';
    wire(root, P); presetUI(root, P);
    sids.forEach(([id]) => P.sub(id, (v, n) => { root.querySelector(`[data-w="${id}"]`).textContent = WORDS[Math.min(31, Math.floor(n * 32))]; }));
    P.keyboard(root.querySelector('#keys'), { from: 48, octaves: 3 });
    P.scope(root.querySelector('#sc'), { color: '#f4dfa4', bg: '#050403', width: 3, glow: 8, grid: '#b08d5722', gain: 2.6 });
    // door labels (clickable)
    const lbl = root.querySelector('#lbl');
    lbl.innerHTML = MODELS.map((m, i) => { const a = (-135 + i * 90 - 90) * Math.PI / 180, x = 170 + 94 * Math.cos(a), y = 170 + 94 * Math.sin(a); return `<g class="ml" data-m="${i}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="17" fill="#2a1d0a" stroke="#6b5530"/><text x="${x}" y="${y + 3}">${m}</text></g>`; }).join('');
    lbl.querySelectorAll('.ml').forEach(g => g.addEventListener('click', () => P.set('model', +g.dataset.m)));
    P.sub('model', v => { lbl.querySelectorAll('.ml').forEach((g, i) => { g.querySelector('circle').setAttribute('fill', i === v ? '#b08d57' : '#2a1d0a'); g.querySelector('text').setAttribute('fill', i === v ? '#14110c' : '#e8d6ae'); }); });
    // bolts flash on note
    const bEls = [...root.querySelectorAll('.bolt circle:first-child')];
    P.onNote(e => { if (e.type === 'on') { root.querySelector('#msg').textContent = 'SIGNED NOTE ' + e.midi + ' \u00b7 SIG OK'; bEls.forEach((b, i) => { b.setAttribute('stroke', '#f4dfa4'); setTimeout(() => b.setAttribute('stroke', '#2a1d0a'), 60 + i * 25); }); } });
    // signature + envelope + status
    const ep = root.querySelector('#ep'), sig = root.querySelector('#sig'), st = root.querySelector('#st');
    P.subAll(() => {
      const o = decayD(P, 268, 52, 4); ep.innerHTML = `<path d="${o.d} L268 52 L0 52Z" fill="#b08d5733"/><path d="${o.d}" fill="none" stroke="#f4dfa4" stroke-width="2"/><line x1="${o.kx}" y1="2" x2="${o.kx}" y2="52" stroke="#6b5530" stroke-dasharray="3 3"/>`;
      let hsh = 2166136261; params.forEach(p => { hsh ^= Math.round(P.norm(p.id) * 1000) + 7; hsh = Math.imul(hsh, 16777619) >>> 0; });
      let s = '', x = hsh; for (let i = 0; i < 32; i++) { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; s += (x & 15).toString(16); }
      sig.textContent = 'SIG 3045022100' + s + ' \u00b7 ' + params.length + '/' + params.length + ' PINS SET';
      st.innerHTML = '<b>MODEL</b> ' + P.fmt('model').toUpperCase() + ' \u00b7 <b>BRIGHT</b> ' + P.fmt('brightness') + '<br>SEED: 8 WORDS \u00b7 COMBINATION SET \u00b7 KEYS AT REST';
    });
  }

  /* ============================================================
     C \u2014 ORANGEPILL : pop-art capsule
     ============================================================ */
  

  Kit.register('tine', {
    fonts: 'family=Shrikhand&family=Rubik:wght@500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;700',
    w: 960, h: 560, params,
    faces: [
      undefined,
      { key: 'B', name: 'Privkey', accent: '#b08d57', build: faceB },
      undefined
    ].filter(Boolean)
  });
})();
