import { Kit } from "./runtime.js";
/* morph.js - wavetable morph synth: three faces (Szabo, Bitgold, Fork) */
(function () {
  const TN = ['sine', 'saw', 'pulse', 'square', 'pdLow', 'pdMid', 'pdHigh', 'ah', 'oo', 'organ', 'comb', 'random'];
  const TL = n => ({ pdLow: 'PD LOW', pdMid: 'PD MID', pdHigh: 'PD HIGH' }[n] || n.toUpperCase());
  const RATIOS = ['0.5', '1', '2', '3', '4', '7'];
  const TW = Math.PI * 2, NS = 128, HM = 32;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const gauss = (n, c, w) => Math.exp(-0.5 * Math.pow((n - c) / w, 2));
  const pd = k => ph => (1 - ph) * Math.cos(TW * k * ph);
  const rr = (() => { let s = 9137; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; })();
  const RA = Array.from({ length: HM + 1 }, (_, n) => n === 1 ? 1 : (0.25 + 0.75 * rr()) / Math.pow(Math.max(1, n), 0.8));
  const DEF = {
    sine: { td: ph => Math.sin(TW * ph) }, saw: { h: n => 1 / n }, pulse: { td: ph => ph < 0.25 ? 1 : -1 },
    square: { h: n => n % 2 ? 1 / n : 0 }, pdLow: { td: pd(2.6) }, pdMid: { td: pd(6.4) }, pdHigh: { td: pd(13.5) },
    ah: { h: n => (n === 1 ? 0.8 : 0) + 1.1 * gauss(n, 5, 1.6) + 0.8 * gauss(n, 9, 2) + 0.3 / n },
    oo: { h: n => (n === 1 ? 1 : 0) + gauss(n, 2, 0.9) + 0.35 * gauss(n, 4, 1.2) },
    organ: { h: n => ({ 1: 1, 2: 0.8, 3: 0.65, 4: 0.5, 6: 0.4, 8: 0.3 }[n] || 0) },
    comb: { h: n => n === 1 ? 1 : n % 3 === 0 ? 0.9 / Math.sqrt(n) : 0.12 / n },
    random: { h: n => RA[n] || 0 }
  };
  const cache = {};
  function tab(i) {
    const nm = TN[i]; if (cache[nm]) return cache[nm];
    const d = DEF[nm], a = new Float32Array(NS); let pk = 1e-6;
    for (let k = 0; k < NS; k++) {
      const ph = k / NS; let y = 0;
      if (d.td) y = d.td(ph); else for (let n = 1; n <= HM; n++) y += d.h(n) * Math.sin(TW * n * ph);
      a[k] = y; pk = Math.max(pk, Math.abs(y));
    }
    for (let k = 0; k < NS; k++) a[k] /= pk;
    return cache[nm] = a;
  }
  function at(a, ph) { ph = ph - Math.floor(ph); const f = ph * NS, i = Math.floor(f), j = (i + 1) % NS, t = f - i; return a[i] + (a[j] - a[i]) * t; }
  /* the morphed, folded, FM-ed single cycle: m 0..1, mod 0..1 (strike envelope) */
  function render(P, m, mod, N, out) {
    const A = tab(P.get('tableA')), B = tab(P.get('tableB'));
    const ratio = +RATIOS[P.get('fmRatio')], idx = P.get('fmIndex') * (0.4 + 0.6 * mod);
    const f = clamp(P.get('fold') + P.get('foldEnv') * 0.6 * mod, 0, 1);
    out = out || new Float32Array(N);
    for (let k = 0; k < N; k++) {
      const ph = k / N, p2 = ph + idx * 0.18 * Math.sin(TW * ratio * ph);
      let y = at(A, p2) * (1 - m) + at(B, p2) * m;
      if (f > 0) y = (1 - f) * y + f * Math.sin(y * (1 + f * 3) * 1.9);
      out[k] = y;
    }
    return out;
  }
  /* morph runtime: animated morph position, demo-loops when idle */
  function runtime(P) {
    let t0 = -1e9;
    P.onNote(e => { if (e.type === 'on') t0 = performance.now(); });
    return () => {
      const now = performance.now(), mt = Math.max(0.02, P.get('morphTime')) * 1000;
      let age = now - t0, live = true;
      if (age > mt + 2500) { live = false; age = now % (mt + 1100); }
      const s = P.get('morph'), e = P.get('morphEnd'), u = clamp(age / mt, 0, 1);
      const wob = P.get('wobble') * 0.3 * Math.sin(TW * P.get('wobbleRate') * now / 1000);
      const mod = Math.exp(-(age / 1000) / Math.max(0.03, P.get('modDecay')));
      return { m: clamp(s + (e - s) * u + wob, 0, 1), u, mod, live, age };
    };
  }
  function presetMenu(P, o) {
    const n = P.presets.length; let cur = -1;
    o.list.innerHTML = P.presets.map((p, i) => '<div class="it" data-i="' + i + '">' + o.item(p.name, i) + (p.cat ? '<em>' + p.cat.toUpperCase() + '</em>' : '') + '</div>').join('');
    o.prev && (o.prev.onclick = () => P.loadPreset((Math.max(cur, 0) - 1 + n) % n));
    o.next && (o.next.onclick = () => P.loadPreset((cur + 1) % n));
    o.list.addEventListener('click', e => { const it = e.target.closest('.it'); if (it) { P.loadPreset(+it.dataset.i); if (o.pop) o.list.classList.remove('open'); } });
    if (o.pop && o.name) o.name.addEventListener('click', () => { o.list.classList.toggle('open'); const c = o.list.querySelector('.cur'); if (c) o.list.scrollTop = Math.max(0, c.offsetTop - 120); });
    P.onPreset((i, nm) => {
      cur = i; if (o.name) o.name.innerHTML = i < 0 ? o.none : o.title(nm, i);
      o.list.querySelectorAll('.it').forEach(el => { const on = +el.dataset.i === i; el.classList.toggle('cur', on); if (on) o.list.scrollTop = Math.max(0, el.offsetTop - 120); });
      o.after && o.after(i, nm);
    });
  }
  function thumb(cv, arr, col, bg, grid) {
    const c = cv.getContext('2d'), W = cv.width, H = cv.height;
    c.clearRect(0, 0, W, H); if (bg) { c.fillStyle = bg; c.fillRect(0, 0, W, H); }
    c.strokeStyle = grid || 'transparent'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, H / 2); c.lineTo(W, H / 2); c.stroke();
    c.strokeStyle = col; c.lineWidth = 2; c.lineJoin = 'round'; c.beginPath();
    for (let i = 0; i <= 96; i++) { const y = H / 2 - at(arr, i / 96) * H * 0.4; i ? c.lineTo(i / 96 * W, y) : c.moveTo(0, y); }
    c.stroke();
  }
  const fcell = (cls, id, lab, inner) => '<div class="' + cls + '" data-p="' + id + '">' + (inner || '') + '<span class="lb">' + lab + '</span><b class="val"></b></div>';
  function wire(root, P, sel) {
    root.querySelectorAll(sel || '[data-p]').forEach(el => {
      const id = el.dataset.p; const o = el.dataset.o ? JSON.parse(el.dataset.o) : undefined;
      P.bind(el, id, o); const v = el.querySelector('.val'); if (v) P.text(v, id);
    });
  }
  const T = (id, label, def) => ({ id, label, options: TN.map(TL), def: TN.indexOf(def) });
  const pct = v => Math.round(v * 100) + '%';
  const secs = v => v < 1 ? Math.round(v * 1000) + ' ms' : v.toFixed(2) + ' s';
  const R = (id, label, min, max, def, step, fmt, log) => ({ id, label, min, max, def, step, fmt, log });
  const PARAMS = [
    T('tableA', 'Table A', 'pdMid'), T('tableB', 'Table B', 'saw'),
    R('morph', 'Morph Start (A -> B)', 0, 1, 0, 0.01, pct), R('morphEnd', 'Morph End', 0, 1, 1, 0.01, pct),
    R('morphTime', 'Morph Time', 0.02, 4, 0.9, 0.01, secs, true), R('wobble', 'Morph Wobble', 0, 1, 0, 0.01, pct),
    R('wobbleRate', 'Wobble Rate', 0.1, 12, 3, 0.1, v => v.toFixed(1) + ' Hz', true),
    R('fold', 'Fold', 0, 1, 0.25, 0.01, pct), R('foldEnv', 'Fold Env (strike)', 0, 1, 0.5, 0.01, pct),
    { id: 'fmRatio', label: 'FM Ratio', options: RATIOS.map(r => '\u00d7' + r), def: 2 },
    R('fmIndex', 'FM Index', 0, 1, 0, 0.01, pct), R('modDecay', 'Mod Decay (fold / FM / LPG)', 0.03, 3, 0.5, 0.01, secs, true),
    R('unison', 'Unison Detune', 0, 40, 8, 0.5, v => v.toFixed(1) + ' c'),
    R('cutoff', 'Cutoff', 150, 16000, 3000, 10, v => v >= 1000 ? (v / 1000).toFixed(1) + ' kHz' : Math.round(v) + ' Hz', true),
    R('reso', 'Resonance', 0, 14, 1.5, 0.1, v => v.toFixed(1)), R('lpg', 'LPG Amount', 0, 1, 0.6, 0.01, pct),
    R('attack', 'Attack', 0.002, 2, 0.01, 0.002, secs, true), R('decay', 'Decay', 0.02, 3, 0.6, 0.01, secs, true),
    R('sustain', 'Sustain', 0, 1, 0.55, 0.01, pct), R('release', 'Release', 0.02, 3, 0.35, 0.01, secs, true),
    R('level', 'Output Level', 0, 3, 1, 0.01, v => Math.round(v * 100) + '%')
  ];
  const hash = i => ((i + 3) * 2654435761 >>> 0).toString(16).slice(0, 7).padStart(7, '0');

  /* ============================== A: SZABO ============================== */
  const szabo = {
    key: 'A', name: 'Szabo', accent: '#7fb2ff',
    build(root, P) {
      const KN = [['morph', 'START'], ['morphEnd', 'END'], ['morphTime', 'TIME'], ['wobble', 'WOBBLE'], ['wobbleRate', 'W.RATE'], ['fold', 'FOLD'], ['foldEnv', 'STRIKE'], ['fmRatio', 'RATIO'], ['fmIndex', 'INDEX'], ['modDecay', 'MOD DEC'], ['unison', 'UNISON'], ['cutoff', 'CUTOFF'], ['reso', 'RESO'], ['lpg', 'LPG'], ['attack', 'ATTACK'], ['decay', 'DECAY'], ['sustain', 'SUSTAIN'], ['release', 'RELEASE'], ['level', 'OUTPUT']];
      const grp = (t, a, b, w) => '<div class="grp" style="width:' + w + 'px"><div class="gh"><span>' + t + '</span></div><div class="gr" style="grid-template-columns:repeat(' + (b - a) + ',1fr)">' + KN.slice(a, b).map(k => fcell('kn', k[0], k[1], '<div class="dial"><div class="ring"></div><i></i></div>')).join('') + '</div></div>';
      root.innerHTML = `<style>
.sz{position:absolute;inset:0;background-color:#0f3a73;background-image:linear-gradient(#7fb2ff22 1px,transparent 1px),linear-gradient(90deg,#7fb2ff22 1px,transparent 1px),linear-gradient(#7fb2ff0e 1px,transparent 1px),linear-gradient(90deg,#7fb2ff0e 1px,transparent 1px);background-size:80px 80px,80px 80px,16px 16px,16px 16px;color:#cfe3ff;font-family:'Share Tech Mono',ui-monospace,Consolas,monospace}
.sz *{box-sizing:border-box}.frame{position:absolute;inset:7px;border:1.5px solid #7fb2ff;pointer-events:none}.frame:after{content:'';position:absolute;inset:3px;border:1px solid #7fb2ff55}
.logo{position:absolute;left:26px;top:16px;font-size:34px;letter-spacing:.2em;line-height:1;color:#e6f0ff}.logo small{display:block;font-size:9.5px;letter-spacing:.14em;color:#9cc3ff;margin-top:5px}
.pm{position:absolute;left:300px;top:16px;width:330px;height:42px;border:1px solid #7fb2ff;display:flex;align-items:center;background:#0c2f5e99}.pm .lab{position:absolute;top:-7px;left:10px;background:#0f3a73;font-size:9px;color:#ffd84d;padding:0 4px;letter-spacing:.12em}
.pm button{width:34px;height:100%;background:none;border:0;color:#ffd84d;font:inherit;font-size:18px;cursor:pointer}.pm button:hover{background:#7fb2ff22}
.pm .nm{flex:1;text-align:center;cursor:pointer;font-size:14px;letter-spacing:.06em;color:#fff;white-space:nowrap;overflow:hidden}.pm .nm i{color:#9cc3ff;font-style:normal;margin-right:8px}
.pl{display:none;position:absolute;left:-1px;top:41px;width:332px;max-height:380px;overflow-y:auto;overscroll-behavior:contain;background:#0b2a55;border:1px solid #7fb2ff;z-index:30;scrollbar-width:thin;scrollbar-color:#7fb2ff #0b2a55}.pl.open{display:block}.pl .it{padding:5px 12px;font-size:12px;cursor:pointer;display:flex;gap:10px}.pl .it:hover{background:#7fb2ff33}.pl .it.cur{color:#ffd84d}.pl .it i{color:#7fb2ff;font-style:normal}.pl .it em{margin-left:auto;font-style:normal;font-size:9px;color:#7fb2ffaa;letter-spacing:.08em}
.tb{position:absolute;left:660px;top:14px;width:276px;border:1px solid #7fb2ff;font-size:9.5px;letter-spacing:.08em;display:grid;grid-template-columns:1fr 1fr;background:#0c2f5e99}
.tb div{padding:3px 7px;border:0 solid #7fb2ff88;border-width:0 1px 1px 0;white-space:nowrap}.tb div:nth-child(2n){border-right:0}.tb div:nth-last-child(-n+2){border-bottom:0}.tb b{color:#ffd84d;font-weight:400}
.plot{position:absolute;left:24px;top:70px;width:600px;height:262px;border:1px solid #7fb2ff99;background:#0f3a73}
.side{position:absolute;left:640px;width:296px;border:1px solid #7fb2ff99;background:#0f3a73cc}.side .t{position:absolute;top:-6px;left:8px;background:#0f3a73;color:#ffd84d;font-size:9px;padding:0 4px;letter-spacing:.12em}
.side canvas{position:absolute;left:8px;top:10px;width:150px;height:60px;border:1px solid #7fb2ff66}.side .nm{position:absolute;left:170px;top:12px;font-size:16px;color:#fff;letter-spacing:.06em}.side .sb{position:absolute;left:170px;top:36px;font-size:9.5px;color:#9cc3ff}
.arr{position:absolute;top:50px;width:26px;height:20px;background:none;border:1px solid #7fb2ff;color:#ffd84d;font:inherit;cursor:pointer;padding:0}.arr:hover{background:#7fb2ff33}
.grp{display:inline-block;vertical-align:top}.gh{display:flex;align-items:center;font-size:9.5px;color:#ffd84d;letter-spacing:.14em;height:16px}.gh:before,.gh:after{content:'';flex:1;height:0;border-top:1px solid #ffd84d99}.gh:before{margin-right:6px}.gh:after{margin-left:6px}.gh span:before{content:'\\25C2 ';opacity:.8}.gh span:after{content:' \\25B8';opacity:.8}
.ctl{position:absolute;left:24px;top:344px;width:912px;height:134px;display:flex;gap:8px}.gr{display:grid;margin-top:4px}
.kn{display:flex;flex-direction:column;align-items:center;cursor:ns-resize}.dial{width:42px;height:42px;border:1.5px solid #cfe3ff;border-radius:50%;position:relative;margin:6px 0 4px;background:radial-gradient(circle,#0f3a73 55%,#17509a)}
.dial i{position:absolute;left:calc(50% - 1px);top:3px;width:2px;height:calc(50% - 3px);background:#ffd84d;transform-origin:50% 100%;transform:rotate(calc(-135deg + var(--v,0)*270deg))}.dial:after{content:'';position:absolute;left:calc(50% - 2.5px);top:calc(50% - 2.5px);width:5px;height:5px;border-radius:50%;background:#ffd84d}
.ring{position:absolute;inset:-6px;border-radius:50%;background:conic-gradient(from -135deg,#ffd84d calc(var(--v,0)*270deg),#7fb2ff33 0 270deg,transparent 0);-webkit-mask:radial-gradient(circle,transparent 24px,#000 25px,#000 27px,transparent 28px);mask:radial-gradient(circle,transparent 24px,#000 25px,#000 27px,transparent 28px)}
.kn .lb{font-size:9px;letter-spacing:.06em;color:#9cc3ff;white-space:nowrap}.kn .val{font-weight:400;font-size:10.5px;color:#fff;white-space:nowrap}.kn:hover .dial,.kn.drag .dial{border-color:#ffd84d}
.keys{position:absolute;left:24px;top:486px;width:912px;height:62px;border:1px solid #7fb2ff}.keys .kb-w{background:#dce9ff;border:1px solid #0f3a73;border-top:0;border-radius:0}.keys .kb-w.on{background:#ffd84d}.keys .kb-b{background:#0a2a57;border:1px solid #7fb2ff;border-top:0;border-radius:0}.keys .kb-b.on{background:#ffd84d}
.kl{position:absolute;right:30px;top:489px;font-size:8.5px;color:#0f3a73;letter-spacing:.1em;z-index:3}
</style><div class="sz"><div class="frame"></div>
<div class="logo">SZABO<small>WAVETABLE MORPH OSCILLATOR \u00b7 SHEET 1 OF 1</small></div>
<div class="pm"><span class="lab">DRAWING INDEX</span><button class="pv">\u25c0</button><div class="nm"></div><button class="nx">\u25b6</button><div class="pl"></div></div>
<div class="tb"><div>DWG NO <b>0001</b></div><div>REV <b>B</b></div><div>SCALE <b>1:1</b></div><div>TOL <b>\u00b1<span id=tu></span></b></div><div>TABLE A <b id=ta></b></div><div>TABLE B <b id=tb></b></div></div>
<canvas class="plot" width="1200" height="524"></canvas>
<div class="side" style="top:70px;height:78px"><span class="t">DETAIL A</span><canvas id=cA width=300 height=120></canvas><div class="nm" id=nA></div><div class="sb">START TABLE</div><button class="arr" style="left:170px" data-d="-1" data-t="tableA">\u25c0</button><button class="arr" style="left:200px" data-d="1" data-t="tableA">\u25b6</button></div>
<div class="side" style="top:160px;height:78px"><span class="t">DETAIL B</span><canvas id=cB width=300 height=120></canvas><div class="nm" id=nB></div><div class="sb">END TABLE</div><button class="arr" style="left:170px" data-d="-1" data-t="tableB">\u25c0</button><button class="arr" style="left:200px" data-d="1" data-t="tableB">\u25b6</button></div>
<div class="side" style="top:250px;height:82px"><span class="t">SECTION X-X \u00b7 OUTPUT</span><canvas id=sc style="width:276px;height:60px;top:10px" width=552 height=120></canvas><div class="sb" style="left:10px;top:68px;font-size:8.5px" id=rd></div></div>
<div class="ctl">${grp('MORPH', 0, 5, 232)}${grp('FOLD \u00b7 FM', 5, 10, 232)}${grp('VOICE \u00b7 FILTER \u00b7 LPG', 10, 14, 186)}${grp('ENVELOPE \u00b7 OUT', 14, 19, 232)}</div>
<div class="keys"></div></div>`;
      const $ = s => root.querySelector(s);
      wire(root, P);
      /* table pickers */
      ['A', 'B'].forEach(k => {
        const id = 'table' + k, cv = $('#c' + k);
        P.sub(id, v => { thumb(cv, tab(v), '#cfe3ff', '#0f3a73', '#7fb2ff55'); $('#n' + k).textContent = TL(TN[v]); $('#t' + k.toLowerCase()).textContent = TL(TN[v]); });
        P.bind(cv, id);
      });
      $('#tb').textContent; root.querySelectorAll('.arr').forEach(b => b.onclick = () => { const id = b.dataset.t, n = TN.length; P.set(id, (P.get(id) + +b.dataset.d + n) % n); });
      P.sub('unison', v => { $('#tu').textContent = v.toFixed(1) + 'c'; });
      presetMenu(P, { prev: $('.pv'), next: $('.nx'), name: $('.nm'), list: $('.pl'), pop: 1, none: '<i>--</i>CUSTOM', item: (n, i) => '<i>' + String(i + 1).padStart(2, '0') + '</i>' + n.toUpperCase(), title: (n, i) => '<i>' + String(i + 1).padStart(2, '0') + '</i>' + n.toUpperCase() });
      P.keyboard($('.keys'), { from: 48, octaves: 3 });
      P.scope($('#sc'), { color: '#ffd84d', width: 2, grid: '#7fb2ff33' });
      /* ribbon plot */
      const cv = $('.plot'), c = cv.getContext('2d'), rt = runtime(P), buf = new Float32Array(96);
      const S = 22, ox = 46, oy = 196, W = 350, AM = 32, dx = 6.4, dy = 5.2;
      const arrow = (x1, y1, x2, y2) => { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); const a = Math.atan2(y2 - y1, x2 - x1); [[x2, y2, a + Math.PI], [x1, y1, a]].forEach(([x, y, b]) => { c.beginPath(); c.moveTo(x, y); c.lineTo(x + 7 * Math.cos(b - 0.35), y + 7 * Math.sin(b - 0.35)); c.moveTo(x, y); c.lineTo(x + 7 * Math.cos(b + 0.35), y + 7 * Math.sin(b + 0.35)); c.stroke(); }); };
      P.raf(() => {
        const R = rt(); c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 600, 262);
        const s = P.get('morph'), e = P.get('morphEnd');
        c.lineJoin = 'round'; c.font = '10px "Share Tech Mono",monospace';
        for (let k = S - 1; k >= 0; k--) {
          const mk_ = k / (S - 1); render(P, mk_, R.mod, 96, buf);
          const bx = ox + k * dx, by = oy - k * dy;
          c.beginPath(); for (let i = 0; i < 96; i++) { const x = bx + i / 95 * W, y = by - buf[i] * AM; i ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.lineTo(bx + W, by + AM + 7); c.lineTo(bx, by + AM + 7); c.closePath(); c.fillStyle = '#0f3a73'; c.fill();
          const inr = mk_ >= Math.min(s, e) - 0.03 && mk_ <= Math.max(s, e) + 0.03;
          c.strokeStyle = inr ? 'rgba(207,227,255,.9)' : 'rgba(127,178,255,.38)'; c.lineWidth = 1.1;
          c.beginPath(); for (let i = 0; i < 96; i++) { const x = bx + i / 95 * W, y = by - buf[i] * AM; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
        }
        /* cutting plane = live morph */
        const kk = R.m * (S - 1); render(P, R.m, R.mod, 96, buf); const bx = ox + kk * dx, by = oy - kk * dy;
        c.strokeStyle = '#ffd84d'; c.lineWidth = 2.2; c.shadowColor = '#ffd84d'; c.shadowBlur = R.live ? 8 : 3;
        c.beginPath(); for (let i = 0; i < 96; i++) { const x = bx + i / 95 * W, y = by - buf[i] * AM; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.shadowBlur = 0;
        c.setLineDash([3, 3]); c.lineWidth = 1; c.strokeStyle = '#ffd84d99'; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, by + AM + 4); c.moveTo(bx + W, by); c.lineTo(bx + W, by + AM + 4); c.stroke(); c.setLineDash([]);
        /* dimension lines */
        c.strokeStyle = '#9cc3ff'; c.fillStyle = '#9cc3ff'; c.lineWidth = 1;
        arrow(ox, oy + AM + 17, ox + W, oy + AM + 17); c.textAlign = 'center'; c.fillStyle = '#0f3a73'; c.fillRect(ox + W / 2 - 38, oy + AM + 11, 76, 12); c.fillStyle = '#cfe3ff'; c.fillText('1 CYCLE \u00b7 2\u03c0', ox + W / 2, oy + AM + 21);
        c.textAlign = 'left'; c.strokeStyle = '#9cc3ff'; arrow(ox - 14, oy - AM, ox - 14, oy + AM); c.save(); c.translate(ox - 18, oy + 1); c.rotate(-Math.PI / 2); c.textAlign = 'center'; c.fillStyle = '#cfe3ff'; c.fillText('\u00b11.0', 0, 0); c.restore();
        const ex = ox + W + 12; arrow(ex, oy, ex + (S - 1) * dx, oy - (S - 1) * dy);
        c.fillStyle = '#9cc3ff'; c.textAlign = 'left'; c.fillText('B', ex + (S - 1) * dx + 6, oy - (S - 1) * dy - 9); c.fillText('A', ex - 4, oy + 14);
        [[s, 'S'], [e, 'E']].forEach(([m, t]) => { const px = ex + m * (S - 1) * dx, py = oy - m * (S - 1) * dy; c.strokeStyle = '#ffd84d'; c.beginPath(); c.moveTo(px - 4, py - 4); c.lineTo(px + 4, py + 4); c.stroke(); c.fillStyle = '#ffd84d'; c.fillText(t + (m * 100).toFixed(0), px + 7, py + 3); });
        c.fillStyle = '#cfe3ff'; c.textAlign = 'right'; c.fillText('MORPH ' + (R.m * 100).toFixed(0) + '%', 590, 256);
        /* callouts */
        c.textAlign = 'left'; c.fillStyle = '#9cc3ff'; const ff = clamp(P.get('fold') + P.get('foldEnv') * 0.6 * R.mod, 0, 1);
        const L = ['FOLD   ' + ff.toFixed(2) + (P.get('foldEnv') > 0 ? '  (strike)' : ''), 'FM     ' + P.fmt('fmRatio') + ' / ' + P.fmt('fmIndex'), 'UNISON ' + P.fmt('unison'), 'LPG    ' + P.fmt('lpg'), R.live ? 'MORPH  RUNNING' : 'MORPH  PREVIEW'];
        L.forEach((t, i) => { c.fillStyle = i === 4 ? (R.live ? '#ffd84d' : '#9cc3ff') : '#cfe3ff'; c.fillText(t, 12, 20 + i * 13); });
        c.strokeStyle = '#7fb2ff66'; c.beginPath(); c.moveTo(8, 12); c.lineTo(8, 20 + 4 * 13 + 4); c.stroke();
        const rd = $('#rd'); if (rd) rd.textContent = 'CUTOFF ' + P.fmt('cutoff') + ' \u00b7 Q ' + P.fmt('reso') + ' \u00b7 OUT ' + P.fmt('level');
      });
    }
  };

  /* ============================== B: BITGOLD ============================== */
  

  /* ============================== C: FORK ============================== */
  

  Kit.register('morph', {
    fonts: 'family=Share+Tech+Mono&family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,500&family=Space+Grotesk:wght@500;600&family=JetBrains+Mono:wght@400;700',
    w: 960, h: 560, params: PARAMS, faces: [szabo, undefined, undefined].filter(Boolean)
  });
})();
