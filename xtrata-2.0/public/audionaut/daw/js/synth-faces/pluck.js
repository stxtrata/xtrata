import { Kit } from "./runtime.js";
/* pluck.js - jiPLUCK (Karplus-Strong strings) : Taproot / Inscribe / Lightning */
(function () {
  const TAU = Math.PI * 2;
  const pct = v => Math.round(v * 100) + '%';
  const secs = v => v.toFixed(2) + ' s';

  const params = [
    { id: 'decay', label: 'String Decay', min: 0.2, max: 8, step: 0.05, def: 2.4, fmt: secs },
    { id: 'tone', label: 'Tone', min: 0, max: 1, step: 0.01, def: 0.55, fmt: pct },
    { id: 'pick', label: 'Pick Softness', min: 0, max: 1, step: 0.01, def: 0.35, fmt: pct },
    { id: 'pos', label: 'Pick Position', min: 0.05, max: 0.5, step: 0.01, def: 0.2, fmt: pct },
    { id: 'snap', label: 'Pick Snap', min: 0, max: 1, step: 0.01, def: 0.25, fmt: pct },
    { id: 'damp', label: 'Note-off Damping', min: 0.03, max: 3, step: 0.01, def: 0.6, fmt: secs },
    { id: 'twin', label: 'Twin String', min: 0, max: 1, step: 0.01, def: 0.3, fmt: pct },
    { id: 'body', label: 'Body Resonance', min: 0, max: 12, step: 0.5, def: 5, fmt: v => '+' + v.toFixed(1) + ' dB' },
    { id: 'bodyFreq', label: 'Body Frequency', min: 80, max: 1200, step: 5, def: 220, log: true, fmt: v => Math.round(v) + ' Hz' },
    { id: 'level', label: 'Output Level', min: 0, max: 1.5, step: 0.01, def: 1, fmt: pct }
  ];
  const presets = [
    { name: 'Nylon Guitar', values: {} },
    { name: 'Steel Harp', values: { decay: 4, tone: 0.82, pick: 0.2, pos: 0.12, snap: 0.2, twin: 0.45, body: 3, bodyFreq: 300, damp: 1.2 } },
    { name: 'Koto', values: { decay: 1.8, tone: 0.65, pick: 0.15, pos: 0.08, snap: 0.5, twin: 0.1, body: 6, bodyFreq: 420, damp: 0.5 } },
    { name: 'Soft Mallet', values: { decay: 1.5, tone: 0.28, pick: 1, pos: 0.3, snap: 0, twin: 0.15, body: 4, bodyFreq: 160, damp: 0.4 } },
    { name: 'Muted Bass', values: { decay: 0.7, tone: 0.3, pick: 0.5, pos: 0.25, snap: 0.2, twin: 0, body: 8, bodyFreq: 110, damp: 0.08 } },
    { name: 'Dulcimer Shimmer', values: { decay: 5.5, tone: 0.9, pick: 0, pos: 0.15, snap: 0.15, twin: 0.8, body: 2, bodyFreq: 520, damp: 1.8 } }
  ];

  /* ---------- shared wiring ---------- */
  function wire(root, P) {
    root.querySelectorAll('[data-p]').forEach(el => {
      const o = {}; const a = el.dataset.abs;
      if (a) { o.abs = true; o.axis = a; } else { if (el.dataset.ax) o.axis = el.dataset.ax; if (el.dataset.rg) o.range = +el.dataset.rg; }
      P.bind(el, el.dataset.p, o);
    });
    root.querySelectorAll('[data-r]').forEach(el => P.text(el, el.dataset.r));
    root.querySelectorAll('[data-xy]').forEach(el => { const [x, y] = el.dataset.xy.split(','); P.bindXY(el, x, y); });
    const n = P.presets.length; let cur = 0;
    const lists = [...root.querySelectorAll('[data-plist]')];
    lists.forEach(l => {
      const tag = l.dataset.plist || 'div';
      P.presets.forEach((p, i) => {
        const e = document.createElement(tag); e.className = 'pi'; e.dataset.i = i; e.title = p.name;
        e.innerHTML = (l.dataset.tpl != null && l.dataset.tpl !== '' ? l.dataset.tpl : '{n}').replace('{n}', p.name).replace('{i}', String(i + 1).padStart(2, '0')).replace('{x}', String(i + 1).padStart(4, '0'));
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

  /* ---------- visual string model (shared by all faces) ---------- */
  function strModel(P) {
    const S = { t0: performance.now(), user: -1e9, amp: 0.9, midi: 52, offAt: null, hits: 0 };
    const hold = new Set();
    P.onNote(e => {
      if (e.type === 'on') { S.t0 = performance.now(); S.user = S.t0; S.amp = 0.55 + 0.45 * e.vel; S.midi = e.midi; S.offAt = null; S.hits++; hold.add(e.midi); if (S.onhit) S.onhit(); }
      else { hold.delete(e.midi); if (e.midi === S.midi && !hold.size) S.offAt = performance.now(); }
    });
    S.frame = () => {
      const now = performance.now();
      if (now - S.t0 > 4800 && now - S.user > 6500) { S.t0 = now; S.offAt = null; S.amp = 0.9; }
      const d = P.get('decay'), tone = P.norm('tone'), pick = P.get('pick'), pos = P.get('pos'), twin = P.get('twin');
      const N = 14, a = [0], r = [0], w = [0];
      S.t = (now - S.t0) / 1000;
      const w0 = TAU * (0.7 + (S.midi - 36) / 30);
      for (let n = 1; n <= N; n++) {
        a[n] = Math.sin(n * Math.PI * pos) / Math.pow(n, 2.3 - 1.6 * tone) * Math.exp(-n * pick * 0.32);
        r[n] = (1 + n * (1.15 - tone) * 0.55) / (d * 0.9); w[n] = w0 * n;
      }
      let mx = 1e-6;
      for (let i = 0; i <= 40; i++) { let y = 0; for (let n = 1; n <= N; n++) y += a[n] * Math.sin(n * Math.PI * i / 40); mx = Math.max(mx, Math.abs(y)); }
      S.a = a; S.r = r; S.w = w; S.N = N; S.k = S.amp / mx; S.twin = twin;
      S.off = S.offAt ? Math.exp(-6.9 * ((now - S.offAt) / 1000) / P.get('damp')) : 1;
      S.env = Math.exp(-r[1] * S.t) * S.off;
      return S;
    };
    S.y = (x, tw) => {
      let y = 0, y2 = 0; const t = S.t, f = tw ? 1.006 : 1;
      for (let n = 1; n <= S.N; n++) y += S.a[n] * Math.exp(-S.r[n] * t) * Math.cos(S.w[n] * t * f + (tw ? 0.7 : 0)) * Math.sin(n * Math.PI * x);
      return y * S.k * S.off;
    };
    return S;
  }
  function bodyCurve(P, c, W, H, o) {
    const fc = P.get('bodyFreq'), g = P.get('body');
    c.beginPath();
    for (let i = 0; i <= W; i += 2) {
      const f = 60 * Math.pow(40, i / W), l = Math.log(f / fc);
      const db = g * Math.exp(-l * l / (2 * 0.42 * 0.42));
      const y = H - 6 - (db / 12) * (H - 20) * 0.95;
      i ? c.lineTo(i, y) : c.moveTo(i, y);
    }
    return fc;
  }
  function hash(P) { let s = 7; P.params.forEach(p => { s = (Math.imul(s, 31) + Math.round(P.norm(p.id) * 1000)) >>> 0; }); return s; }
  function K(id, label, cls) {
    return '<div class="kw ' + (cls || '') + '"><div class="kn" data-p="' + id + '"><i class="ring"></i><i class="cap"><b class="pt"></b></i></div><span class="kl">' + label + '</span><span class="kv" data-r="' + id + '"></span></div>';
  }

  /* =====================================================================
   * A  TAPROOT
   * ===================================================================== */
  function buildA(root, P) {
    const grp = (x0, title, ids) => {
      let h = '<div class="gt" style="left:' + x0 + 'px">' + title + '</div>';
      ids.forEach((it, i) => { h += '<div class="slot" style="left:' + (x0 + i * 92) + 'px">' + K(it[0], it[1]) + '</div>'; });
      return h;
    };
    root.innerHTML = `<style>
.tp{position:absolute;inset:0;font-family:'Fraunces',Georgia,'Times New Roman',serif;color:#e8d9bd;overflow:hidden;
 background:radial-gradient(ellipse at 50% 40%,#3a2816 0,#241709 75%,#170f06 100%);}
.tp:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90.6deg,#0000 0 9px,#00000016 9px 10px,#ffffff05 10px 12px,#0000 12px 23px,#0000001c 23px 24px);pointer-events:none}
.tp:after{content:"";position:absolute;inset:6px;border:2px solid #4a331b;border-radius:6px;box-shadow:inset 0 0 0 1px #0007,0 0 0 1px #0007;pointer-events:none}
.tp *{position:relative}
.hd{position:absolute;left:0;top:0;width:960px;height:56px}
.logo{position:absolute;left:30px;top:6px;font-size:36px;font-weight:700;color:#a7d27a;letter-spacing:.01em;text-shadow:0 2px 0 #0008,0 0 18px #a7d27a44;font-variation-settings:'opsz' 144}
.logo small{font-size:11px;font-weight:500;letter-spacing:.2em;color:#b59c72;margin-left:14px;text-shadow:none;vertical-align:6px}
.pb{position:absolute;right:30px;top:11px;height:34px;display:flex;align-items:center;gap:8px}
.pb button{width:30px;height:30px;border-radius:50%;border:2px solid #8a6a42;background:#4a331b;color:#a7d27a;font-size:14px;cursor:pointer;padding:0}
.pb button:hover{background:#5d4224}
.pn{min-width:170px;text-align:center;font-size:17px;font-style:italic;color:#e8d9bd;padding:3px 10px;background:#160e06;border:1px solid #5a4128;border-radius:3px;box-shadow:inset 0 2px 5px #000a}
.pnum{font-size:10px;letter-spacing:.14em;color:#b59c72;width:38px;text-align:right}
.seeds{display:flex;gap:5px;margin-left:6px}
.seeds .pi{width:12px;height:12px;border-radius:50% 0 50% 0;background:#4a331b;border:1px solid #8a6a42;cursor:pointer;transform:rotate(-45deg)}
.seeds .pi.on{background:#a7d27a;box-shadow:0 0 8px #a7d27a}
.disp{position:absolute;left:24px;top:60px;width:912px;height:108px}
.inl{position:absolute;top:0;height:108px;background:#150d06;border:2px solid #4a331b;border-radius:4px;box-shadow:inset 0 3px 10px #000c,0 1px 0 #6b4a2a}
.inl canvas{position:absolute;inset:0;width:100%;height:100%}
.inl .lb{position:absolute;left:8px;top:4px;font-size:9px;letter-spacing:.2em;color:#b59c72;z-index:2}
.inl .rd{position:absolute;right:8px;top:4px;font-size:9px;letter-spacing:.14em;color:#a7d27a;z-index:2}
.tree{position:absolute;left:0;top:172px;width:960px;height:252px}
.tree svg{position:absolute;left:0;top:0}
.gt{position:absolute;top:6px;width:276px;font-size:11px;letter-spacing:.22em;color:#a7d27a;text-transform:uppercase;font-style:italic}
.slot{position:absolute;top:30px;width:92px;height:96px}
.kw{display:flex;flex-direction:column;align-items:center;width:92px}
.kn{width:54px;height:54px;border-radius:50%;cursor:ns-resize}
.kn .ring{position:absolute;inset:-5px;border-radius:50%;background:conic-gradient(from -135deg,#a7d27a calc(var(--v)*270deg),#3a2816 0 270deg,#0000 0);-webkit-mask:radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 calc(100% - 3px));mask:radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 calc(100% - 3px))}
.kn .cap{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 36% 30%,#8a6a42,#5a4128 55%,#2e1f10);border:2px solid #9b7a4d;box-shadow:0 4px 7px #000a,inset 0 1px 2px #fff3;transform:rotate(calc(-135deg + var(--v)*270deg))}
.kn .cap:after{content:"";position:absolute;inset:9px;border-radius:50%;border:1px dashed #0006}
.kn .pt{position:absolute;left:50%;top:3px;width:8px;height:17px;margin-left:-4px;background:#a7d27a;border-radius:50% 0 50% 0;transform:rotate(45deg) scale(.7,1.2);transform-origin:50% 50%;box-shadow:0 0 6px #a7d27a88}
.kn.drag .ring,.kn:focus-visible .ring{filter:brightness(1.4)}
.kl{margin-top:8px;font-size:11px;letter-spacing:.08em;color:#e8d9bd;white-space:nowrap}
.kv{font-size:11px;color:#a7d27a;font-style:italic;margin-top:1px;white-space:nowrap}
.rootk{position:absolute;left:434px;top:164px}
.rootk .tag{position:absolute;left:62px;top:2px;width:104px;background:#2b1d11;border:1px solid #6b4a2a;border-radius:2px 10px 10px 2px;padding:4px 8px 4px 10px;line-height:1.25;white-space:nowrap}
.rootk .tag b{display:block;font-size:10px;letter-spacing:.2em;color:#b59c72;font-weight:500}
.rootk .tag span{font-size:13px;font-style:italic;color:#a7d27a}
.rootk .kn{width:46px;height:46px}
.keys{position:absolute;left:24px;top:428px;width:912px;height:96px;border-top:6px solid #4a2e18;border-radius:3px;box-shadow:0 -2px 10px #000a}
.keys .kb-w{background:linear-gradient(#efe3c8,#d9c7a1);border:1px solid #5a4128;border-top:0}
.keys .kb-w.on{background:linear-gradient(#cfe8a8,#a7d27a)}
.keys .kb-b{background:linear-gradient(#3a2512,#1a0f06);border-radius:0 0 3px 3px;box-shadow:inset 0 -3px 0 #5a4128}
.keys .kb-b.on{background:#6d8f3e}
.ft{position:absolute;left:30px;right:30px;top:531px;height:20px;display:flex;justify-content:space-between;font-size:10px;letter-spacing:.16em;color:#b59c72;font-style:italic}
.ft b{color:#a7d27a;font-weight:500}
</style>
<div class="tp">
 <div class="hd"><div class="logo">Taproot<small>ONE ROOT · THREE BRANCHES</small></div>
  <div class="pb"><div class="seeds" data-plist="i" data-tpl="&nbsp;"></div><button data-prev>&#9664;</button><div class="pn" data-pname></div><button data-next>&#9654;</button><div class="pnum" data-pnum></div></div></div>
 <div class="disp">
  <div class="inl" style="left:0;width:580px"><canvas id="cs" width="1160" height="216"></canvas><span class="lb">THE STRING · HARMONICS GROW FROM THE PICK</span><span class="rd" id="rs"></span></div>
  <div class="inl" style="left:592px;width:160px"><canvas id="cb" width="320" height="216"></canvas><span class="lb">BODY</span><span class="rd" id="rb"></span></div>
  <div class="inl" style="left:764px;width:148px"><canvas id="cc" width="296" height="216"></canvas><span class="lb">GROWTH RINGS</span></div>
 </div>
 <div class="tree">
  <svg width="960" height="252" viewBox="0 0 960 252">
   <defs><linearGradient id="bk" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="960" y2="0"><stop offset="0" stop-color="#4a331b"/><stop offset=".5" stop-color="#8a6a42"/><stop offset="1" stop-color="#4a331b"/></linearGradient></defs>
   <g fill="none" stroke-linecap="round" stroke="url(#bk)">
    <path d="M174 140 C174 200 410 190 480 232" stroke-width="8"/><path d="M786 140 C786 200 550 190 480 232" stroke-width="8"/>
    <path d="M480 140 V232" stroke-width="11"/><path d="M480 232 C470 246 440 250 400 252 M480 232 C490 246 520 250 560 252 M480 232 V252" stroke-width="6"/>
    <path d="M52 140 H296 M358 140 H602 M664 140 H908" stroke-width="5"/>
   </g>
   <g stroke="#6b4a2a" stroke-width="2.5" stroke-linecap="round">
    <path d="M82 128V140M174 128V140M266 128V140M388 128V140M480 128V140M572 128V140M694 128V140M786 128V140M878 128V140"/></g>
   <g fill="#a7d27a" opacity=".85"><circle cx="174" cy="140" r="4"/><circle cx="480" cy="140" r="4"/><circle cx="786" cy="140" r="4"/></g>
  </svg>
  ${grp(36, 'Branch I · String', [['decay', 'Decay'], ['tone', 'Tone'], ['damp', 'Damping']])}
  ${grp(342, 'Branch II · Pick', [['pos', 'Position'], ['pick', 'Softness'], ['snap', 'Snap']])}
  ${grp(648, 'Branch III · Body', [['body', 'Resonance'], ['bodyFreq', 'Body Freq'], ['twin', 'Twin String']])}
  <div class="rootk"><div class="kw" style="width:46px"><div class="kn" data-p="level"><i class="ring"></i><i class="cap"><b class="pt"></b></i></div></div>
   <div class="tag"><b>THE ROOT</b>Level <span data-r="level"></span></div></div>
 </div>
 <div class="keys" id="keys"></div>
 <div class="ft"><span id="f1"></span><span>press <b>A S D F G H J K</b> to pluck · double-click a knob to reset to seed</span></div>
</div>`;
    wire(root, P);
    P.keyboard(root.querySelector('#keys'), { from: 48, octaves: 3 });
    const S = strModel(P);
    const $ = s => root.querySelector(s);
    const cs = $('#cs').getContext('2d'), cb = $('#cb').getContext('2d'), cc = $('#cc').getContext('2d');
    let flash = 0; S.onhit = () => { flash = 1; };
    P.raf(() => {
      S.frame(); flash *= 0.94;
      let W = 1160, H = 216, c = cs; c.clearRect(0, 0, W, H);
      // faint tree rings
      c.strokeStyle = '#2a1b0d'; c.lineWidth = 2;
      for (let i = 1; i < 9; i++) { c.beginPath(); c.ellipse(W * 0.5, H * 0.5, i * 70, i * 14, 0, 0, TAU); c.stroke(); }
      c.strokeStyle = '#3a2816'; c.lineWidth = 1; c.beginPath(); c.moveTo(40, H / 2); c.lineTo(W - 40, H / 2); c.stroke();
      const x0 = 40, x1 = W - 40, amp = H * 0.4;
      const pk = x0 + (x1 - x0) * P.get('pos');
      const draw = (tw, col, lw) => {
        c.strokeStyle = col; c.lineWidth = lw; c.beginPath();
        for (let i = 0; i <= 120; i++) { const x = i / 120, y = H / 2 - S.y(x, tw) * amp; i ? c.lineTo(x0 + (x1 - x0) * x, y) : c.moveTo(x0, y); }
        c.stroke();
      };
      c.shadowColor = '#a7d27a'; c.shadowBlur = 10 + flash * 14;
      if (S.twin > 0.02) draw(true, 'rgba(167,210,122,' + (0.15 + S.twin * 0.5) + ')', 2);
      draw(false, '#a7d27a', 3.5);
      c.shadowBlur = 0;
      // nut + bridge pegs and pick marker
      c.fillStyle = '#8a6a42'; c.fillRect(30, H / 2 - 30, 10, 60); c.fillRect(W - 40, H / 2 - 30, 10, 60);
      c.fillStyle = '#e8d9bd'; c.beginPath(); c.moveTo(pk, H - 22); c.lineTo(pk - 7, H - 8); c.lineTo(pk + 7, H - 8); c.closePath(); c.fill();
      c.font = '18px serif'; c.fillStyle = '#b59c72'; c.fillText('pick', pk + 12, H - 10);
      $('#rs').textContent = 'f ' + (440 * Math.pow(2, (S.midi - 69) / 12)).toFixed(1) + ' HZ · ' + Math.round(S.env * 100) + '%';
      // body
      W = 320; c = cb; c.clearRect(0, 0, W, H);
      c.strokeStyle = '#2a1b0d'; c.lineWidth = 1; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(W * i / 6, 0); c.lineTo(W * i / 6, H); c.stroke(); }
      const fc = bodyCurve(P, c, W, H); c.strokeStyle = '#a7d27a'; c.lineWidth = 3; c.stroke();
      c.lineTo(W, H); c.lineTo(0, H); c.closePath(); c.fillStyle = 'rgba(167,210,122,.16)'; c.fill();
      $('#rb').textContent = Math.round(fc) + ' HZ';
      // growth rings: radius = decay time, rings fade with tone
      W = 296; c = cc; c.clearRect(0, 0, W, H);
      const d = P.get('decay'), n = Math.max(2, Math.round(d * 1.6)), cx = W / 2, cy = H / 2 + 6;
      for (let i = n; i >= 1; i--) {
        const rr = (i / n) * Math.min(120, 22 + d * 15);
        c.beginPath(); c.ellipse(cx, cy, rr * 1.15, rr * 0.8, 0, 0, TAU);
        c.strokeStyle = 'rgba(' + (120 + 47 * P.norm('tone')) + ',' + (170 + 40 * P.norm('tone')) + ',90,' + (0.9 - 0.7 * i / n) + ')'; c.lineWidth = 2.5; c.stroke();
      }
      c.beginPath(); c.arc(cx, cy, 5 + 10 * S.env, 0, TAU); c.fillStyle = '#a7d27a'; c.fill();
    });
    P.sub('pos', () => { $('#f1').textContent = 'plucked ' + Math.round(P.get('pos') * 100) + '% from the bridge · ' + S.hits + ' seeds sown'; });
    P.onNote(() => { $('#f1').textContent = 'plucked ' + Math.round(P.get('pos') * 100) + '% from the bridge · ' + S.hits + ' seeds sown'; });
  }

  /* =====================================================================
   * B  INSCRIBE
   * ===================================================================== */
  

  /* =====================================================================
   * C  LIGHTNING
   * ===================================================================== */
  

  Kit.register('pluck', {
    fonts: 'family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500&family=Special+Elite&family=Audiowide',
    w: 960, h: 560, params, presets,
    faces: [
      { key: 'A', name: 'Taproot', accent: '#a7d27a', build: buildA },
      undefined,
      undefined
    ].filter(Boolean)
  });
})();
