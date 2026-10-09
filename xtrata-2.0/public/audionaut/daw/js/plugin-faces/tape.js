import { Kit } from "./runtime.js";
/* tape — Tape Saturator. Faces: A Inscription (engraved stone plaque) / B Immutable (reel-to-reel in a glass vault) / C Timechain (tape loop of linked blocks) */
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const PI = Math.PI, TAU = PI * 2;
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mixc = (a, b, t, al) => { const x = hex(a), y = hex(b); return 'rgba(' + x.map((v, i) => Math.round(lerp(v, y[i], t))).join(',') + ',' + (al == null ? 1 : al) + ')'; };
  const SERIF = "Cinzel,'Cormorant Garamond',Georgia,'Times New Roman',serif";
  const BODY = "'Cormorant Garamond',Georgia,'Times New Roman',serif";
  const COND = "'Barlow Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif";
  const SANS = "Sora,'Helvetica Neue',Helvetica,Arial,sans-serif";
  const MONO = "'JetBrains Mono',ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace";
  const SPF = [0.7, 1, 1.4];

  const presets = [
    { name: 'Warm glue', values: { drive: 6, bias: 0.5, bump: 2.5, bumpFreq: '60', hfLoss: 14000, speed: '15', wow: 0, flutter: 0, hiss: 0, mix: 1, out: 0 } },
    { name: 'Master 30', values: { drive: 3, bias: 0.5, bump: 1.5, bumpFreq: '40', hfLoss: 18000, speed: '30', wow: 0, flutter: 0, hiss: 0, mix: 1, out: 0 } },
    { name: 'Slow cassette', values: { drive: 10, bias: 0.62, bump: 3, bumpFreq: '100', hfLoss: 7500, speed: '7.5', wow: 0.35, flutter: 0.25, hiss: 0.3, mix: 1, out: -1 } },
    { name: 'Drum crush', values: { drive: 16, bias: 0.35, bump: 4, bumpFreq: '100', hfLoss: 12000, speed: '15', wow: 0, flutter: 0, hiss: 0, mix: 0.7, out: -2 } },
    { name: 'Even bloom', values: { drive: 12, bias: 0.85, bump: 3.5, bumpFreq: '60', hfLoss: 11000, speed: '15', wow: 0.08, flutter: 0.05, hiss: 0.05, mix: 0.85, out: -1.5 } },
    { name: 'Worn loop', values: { drive: 8, bias: 0.55, bump: 2, bumpFreq: '60', hfLoss: 5000, speed: '7.5', wow: 0.7, flutter: 0.5, hiss: 0.5, mix: 1, out: 0 } },
    { name: 'Init', values: {} }
  ];

  /* ---------- shared helpers ---------- */
  function wire(root, P) {
    root.querySelectorAll('[data-p]').forEach(el => {
      const o = {}; if (el.dataset.abs) { o.abs = true; o.axis = el.dataset.abs; } if (el.dataset.ax) o.axis = el.dataset.ax; if (el.dataset.rng) o.range = +el.dataset.rng;
      P.bind(el, el.dataset.p, o);
    });
    root.querySelectorAll('[data-t]').forEach(el => P.text(el, el.dataset.t));
    root.querySelectorAll('[data-byp]').forEach(el => P.bind(el, '__bypass'));
    root.querySelectorAll('[data-seg]').forEach(el => {
      const id = el.dataset.seg;
      el.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => P.set(id, +b.dataset.i)));
      P.sub(id, v => el.querySelectorAll('[data-i]').forEach(b => b.classList.toggle('on', +b.dataset.i === Math.round(v))));
    });
    const n = P.presets.length; let idx = -1;
    P.onPreset((i, nm) => {
      idx = i;
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = nm || 'Custom'; });
      root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = i < 0 ? '--' : String(i + 1).padStart(2, '0'); });
      root.querySelectorAll('[data-pl]').forEach(e => e.classList.toggle('on', +e.dataset.pl === i));
    });
    root.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx - 1 + n) % n)));
    root.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx + 1) % n)));
    root.querySelectorAll('[data-pl]').forEach(b => b.addEventListener('click', () => P.loadPreset(+b.dataset.pl)));
    root.querySelectorAll('[data-live]').forEach(el => {
      const f = el.dataset.live;
      const upd = () => { el.textContent = LIVE[f](P); };
      P.subAll(upd); upd();
    });
  }
  const LIVE = {
    speed: P => P.real('speed') + ' ips',
    bf: P => P.real('bumpFreq') + ' Hz',
    bumpAt: P => Math.round((+P.real('bumpFreq')) * (+P.real('speed')) / 15) + ' Hz',
    hfAt: P => { const f = P.get('hfLoss') * SPF[P.get('speed')]; return f >= 1000 ? (f / 1000).toFixed(1) + ' kHz' : Math.round(f) + ' Hz'; },
    wowpct: P => (P.get('wow') * 1.2 * [1.6, 1, 0.6][P.get('speed')]).toFixed(2) + ' %',
    flpct: P => (P.get('flutter') * 0.7 * [1.6, 1, 0.6][P.get('speed')]).toFixed(2) + ' %',
    pitch: P => '±' + ((P.get('wow') * 1.2 + P.get('flutter') * 0.7) * [1.6, 1, 0.6][P.get('speed')]).toFixed(2) + ' %',
    dry: P => Math.round((1 - P.get('mix')) * 100) + '% dry',
    harm: P => (P.get('bias') === 0.5 ? 'odd harmonics' : P.get('bias') < 0.5 ? 'even + odd (low bias)' : 'even + odd (high bias)'),
    hissdb: P => P.get('hiss') < 0.005 ? 'silent' : (-46.6 + 20 * Math.log10(P.get('hiss')) + [1.5, 0, -1.5][P.get('speed')]).toFixed(0) + ' dBFS'
  };
  const cv = (el, w, h) => { el.width = w * 2; el.height = h * 2; el.style.width = w + 'px'; el.style.height = h + 'px'; const c = el.getContext('2d'); c.scale(2, 2); return c; };
  const now = () => performance.now() / 1000;

  function motion(P) {
    const o = { ang: 0, lvl: 0, wob: 0, rate: 0, sat: 0, inL: 0, outL: 0, tot: 0 };
    let last = now(), wph = 0, fph = 0;
    o.upd = () => {
      const t = now(), dt = Math.min(0.06, t - last); last = t;
      const m = P.meter() || {};
      const iL = clamp(m.inPeak || 0, 0, 1.5), oL = clamp(m.outPeak || 0, 0, 1.5);
      o.inL += (iL - o.inL) * (iL > o.inL ? 0.5 : 0.08);
      o.outL += (oL - o.outL) * (oL > o.outL ? 0.5 : 0.08);
      o.lvl += (clamp(Math.max(iL, oL) * 1.5, 0, 1) - o.lvl) * (Math.max(iL, oL) > o.lvl ? 0.3 : 0.05);
      const s = m.sat != null ? clamp(m.sat, 0, 1) : 0; o.sat += (s - o.sat) * (s > o.sat ? 0.4 : 0.06);
      const sp = SPF[P.get('speed')] || 1, d = [1.6, 1, 0.6][P.get('speed')] || 1;
      const wow = P.get('wow'), fl = P.get('flutter');
      wph += dt * TAU * 0.55; fph += dt * TAU * 9;
      o.wob = (wow * (Math.sin(wph) * 0.7 + Math.sin(wph * 2.55 + 1) * 0.3) * 0.8 + fl * (Math.sin(fph) * 0.6 + Math.sin(fph * 1.59) * 0.4) * 0.25) * d;
      o.rate = (0.5 + 5 * o.lvl) * (0.6 + 0.4 * sp) * (1 + o.wob * 0.9);
      o.ang += o.rate * dt; o.tot += o.rate * dt; return o;
    };
    return o;
  }
  function specTrack(P, n) {
    const a = new Float32Array(n), b = new Float32Array(n);
    return {
      a, b, n, upd() {
        const fi = P.freqData('in', n, 30, 18000), fo = P.freqData('out', n, 30, 18000);
        for (let i = 0; i < n; i++) {
          const x = clamp((fi[i] + 92) / 70, 0, 1), y = clamp((fo[i] + 92) / 70, 0, 1);
          a[i] = x > a[i] ? x : a[i] * 0.84 + x * 0.16; b[i] = y > b[i] ? y : b[i] * 0.84 + y * 0.16;
        }
      }
    };
  }
  const fx = (f, w) => Math.log(f / 30) / Math.log(600) * w;
  function curveFn(P) {
    const sp = SPF[P.get('speed')], fb = (+P.real('bumpFreq')) * [0.5, 1, 2][P.get('speed')], bump = P.get('bump'), fc = P.get('hfLoss') * sp;
    return f => bump / (1 + Math.pow(Math.log(f / fb) / 0.5, 2)) - 10 * Math.log10(1 + Math.pow(f / fc, 4));
  }
  const dbn = v => clamp((20 * Math.log10(Math.max(v, 1e-5)) + 48) / 48, 0, 1);
  const flab = f => f >= 1000 ? (f / 1000) + 'k' : String(f);

  const segBtns = (id, labels) => '<div class="seg" data-seg="' + id + '">' + labels.map((l, i) => '<button data-i="' + i + '">' + l + '</button>').join('') + '</div>';
  const presetBtns = () => presets.map((p, i) => '<button class="pc" data-pl="' + i + '"><i>' + String(i + 1).padStart(2, '0') + '</i>' + p.name + '</button>').join('');

  /* =====================================================================
     FACE A — INSCRIPTION : engraved tape on a stone plaque
     ===================================================================== */
  function knobA(id, label, sub) {
    let t = ''; for (let i = 0; i < 11; i++) { const a = (-135 + i * 27) * PI / 180; t += '<line x1="' + (36 + Math.sin(a) * 31).toFixed(1) + '" y1="' + (36 - Math.cos(a) * 31).toFixed(1) + '" x2="' + (36 + Math.sin(a) * (i % 5 === 0 ? 24.5 : 27.5)).toFixed(1) + '" y2="' + (36 - Math.cos(a) * (i % 5 === 0 ? 24.5 : 27.5)).toFixed(1) + '"/>'; }
    return '<div class="k"><div class="kw"><svg viewBox="0 0 72 72">' + t + '</svg><div class="kn" data-p="' + id + '"><i></i></div></div><b data-t="' + id + '"></b><span>' + label + '</span><em>' + (sub || '') + '</em></div>';
  }
  

  /* =====================================================================
     FACE B — IMMUTABLE : reel-to-reel sealed in a glass vault
     ===================================================================== */
  function buildB(root, P) {
    const fad = (id, label) => '<div class="fd"><b data-f="' + id + '"></b><div class="tr" data-p="' + id + '" data-abs="y"><div class="th"></div></div><span>' + label + '</span></div>';
    const hs = (id, label, ro) => '<div class="hs"><label>' + label + '<b data-t="' + id + '"></b></label><div class="ht" data-p="' + id + '" data-abs="x"><i></i><div class="hh"></div></div><small data-live="' + ro + '"></small></div>';
    root.innerHTML = `<style>
      *{box-sizing:border-box}
      .f{position:absolute;inset:0;overflow:hidden;background:radial-gradient(120% 90% at 30% 0%,#12333a 0%,#0a1c21 55%,#06100f 100%);color:#bfe8e2;font-family:${COND};user-select:none}
      .rv{position:absolute;width:7px;height:7px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#7fa6a8,#25444a 70%);box-shadow:0 1px 1px #000}
      h1{position:absolute;left:62px;top:14px;margin:0;font:700 34px/1 ${COND};letter-spacing:.16em;color:#e6fbf7;text-shadow:0 0 18px rgba(63,224,197,.35)}
      .lock{position:absolute;left:20px;top:14px;width:34px;height:38px}
      .lock .sh{transition:transform .3s;transform-origin:20px 14px}
      .off .lock .sh{transform:translate(0,-5px) rotate(-28deg)}
      .tag{position:absolute;left:64px;top:52px;font:600 10px ${MONO};letter-spacing:.18em;color:#5fa69c}
      .chips{position:absolute;left:372px;top:12px;width:420px;display:flex;flex-wrap:wrap;gap:4px}
      .pc{all:unset;cursor:pointer;height:24px;padding:0 9px 0 6px;border:1px solid #2b5a5c;border-radius:3px;background:linear-gradient(#0d2a2e,#0a1d21);font:600 12px/22px ${COND};letter-spacing:.06em;color:#78bdb3;display:flex;gap:6px;white-space:nowrap}
      .pc i{font:500 9px/24px ${MONO};color:#3d7e79}
      .pc.on{border-color:#3fe0c5;background:linear-gradient(#124b4a,#0c3535);color:#eafffa;box-shadow:0 0 10px rgba(63,224,197,.35)}
      .lever{all:unset;cursor:pointer;position:absolute;right:20px;top:10px;width:96px;height:52px}
      .lever .bs{position:absolute;left:6px;top:8px;width:84px;height:36px;border-radius:18px;background:#041012;border:1px solid #2b5a5c;box-shadow:inset 0 2px 6px #000}
      .lever .kn{position:absolute;top:11px;left:9px;width:38px;height:30px;border-radius:15px;background:linear-gradient(#4d6f72,#223b3e);box-shadow:0 2px 4px #000,inset 0 1px 0 rgba(255,255,255,.25);transition:left .18s}
      .lever.on .kn{left:49px;background:linear-gradient(#58f0d6,#1fa592);box-shadow:0 0 14px rgba(63,224,197,.6),0 2px 4px #000}
      .lever span{position:absolute;left:0;right:0;bottom:-4px;text-align:center;font:600 9px ${MONO};letter-spacing:.2em;color:#5fa69c}
      .vault{position:absolute;left:18px;top:74px;width:640px;height:398px;border-radius:26px;background:linear-gradient(145deg,#2c4448,#101e21 60%,#1b3135);padding:12px;box-shadow:0 8px 24px #000,inset 0 1px 0 rgba(255,255,255,.18)}
      .glass{position:relative;width:616px;height:374px;border-radius:16px;overflow:hidden;background:linear-gradient(#061519,#030b0d);box-shadow:inset 0 0 28px #000,inset 0 0 0 1px #2d5559}
      .glass::after{content:'';position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.13) 0%,rgba(255,255,255,.04) 22%,transparent 23%,transparent 60%,rgba(255,255,255,.05) 61%,transparent 70%);pointer-events:none}
      .seal{position:absolute;left:0;right:0;top:10px;text-align:center;font:600 9px ${MONO};letter-spacing:.14em;color:#3fe0c5;text-align:right;opacity:.85}
      .under{position:absolute;left:18px;top:478px;width:640px;height:72px;border-radius:12px;background:linear-gradient(#142a2e,#0b1a1d);border:1px solid #234a4d;display:flex;align-items:center;padding:0 14px;gap:16px}
      .rot{position:relative;width:64px;height:64px;flex:none}
      .rot svg{position:absolute;inset:0}
      .rot .kn{position:absolute;left:14px;top:14px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#6c9296,#1c3236);box-shadow:0 3px 6px #000;cursor:pointer}
      .rot .kn i{position:absolute;inset:0;transform:rotate(calc(-60deg + var(--v)*120deg))}
      .rot .kn i::after{content:'';position:absolute;left:16px;top:3px;width:4px;height:14px;border-radius:2px;background:#3fe0c5;box-shadow:0 0 6px #3fe0c5}
      .lab{font:600 10px ${MONO};letter-spacing:.16em;color:#5fa69c}
      .big{font:700 22px/1 ${COND};color:#eafffa;letter-spacing:.04em}
      .seg{display:flex;gap:3px}
      .seg button{all:unset;cursor:pointer;width:42px;height:28px;text-align:center;line-height:28px;border-radius:4px;border:1px solid #2b5a5c;background:linear-gradient(#0d2a2e,#071619);font:700 13px/26px ${COND};color:#78bdb3}
      .seg button.on{color:#06201d;background:linear-gradient(#69f5dc,#27b09b);box-shadow:0 0 10px rgba(63,224,197,.5);border-color:#9bffee}
      .hs{flex:1;min-width:0}
      .hs label{display:flex;justify-content:space-between;font:600 11px ${MONO};letter-spacing:.14em;color:#78bdb3;text-transform:uppercase}
      .hs label b{color:#eafffa;font-weight:600}
      .hs small{display:block;font:500 9px ${MONO};color:#3d7e79;margin-top:3px;letter-spacing:.1em;height:11px}
      .ht{position:relative;height:18px;cursor:ew-resize;margin-top:3px}
      .ht::before{content:'';position:absolute;left:0;right:0;top:7px;height:4px;border-radius:2px;background:#03090a;box-shadow:inset 0 1px 2px #000,0 1px 0 #25494c}
      .ht i{position:absolute;left:0;top:7px;height:4px;border-radius:2px;width:calc(var(--v)*100%);background:linear-gradient(90deg,#1f8e7e,#69f5dc)}
      .hh{position:absolute;top:1px;left:calc(var(--v)*(100% - 14px));width:14px;height:16px;border-radius:3px;background:linear-gradient(#dff,#6b9fa0);box-shadow:0 2px 3px #000}
      .panel{position:absolute;left:672px;top:74px;width:272px;height:476px;border-radius:14px;background:linear-gradient(#142a2e,#0b1a1d);border:1px solid #234a4d;padding:12px}
      .vus{display:flex;gap:8px}
      .vus div{position:relative}
      .vus em{position:absolute;left:8px;bottom:5px;font:600 9px ${MONO};letter-spacing:.14em;color:#78bdb3;font-style:normal}
      .fads{display:flex;justify-content:space-between;margin-top:10px}
      .fd{width:34px;text-align:center}
      .fd b{display:block;font:600 9px/12px ${MONO};color:#eafffa;height:12px;white-space:nowrap;margin:0 -4px;letter-spacing:-.04em}
      .tr{position:relative;height:286px;margin:6px auto 6px;width:10px;border-radius:5px;background:#03090a;box-shadow:inset 0 1px 3px #000,0 0 0 1px #25494c;cursor:ns-resize}
      .tr::before{content:'';position:absolute;left:-10px;right:-10px;top:0;bottom:0;background:repeating-linear-gradient(#2b5a5c 0 1px,transparent 1px 28.6px);opacity:.55;-webkit-mask:linear-gradient(90deg,#000 0 4px,transparent 4px 16px,#000 16px);mask:linear-gradient(90deg,#000 0 4px,transparent 4px 16px,#000 16px)}
      .tr::after{content:'';position:absolute;left:0;right:0;bottom:0;height:calc(var(--v)*100%);border-radius:5px;background:linear-gradient(#69f5dc,#1f8e7e);opacity:.8}
      .th{position:absolute;left:-10px;width:30px;height:16px;z-index:2;bottom:calc(var(--v)*(100% - 16px));border-radius:3px;background:linear-gradient(#e6fffb,#7ab0b0 50%,#3d6568);box-shadow:0 3px 5px #000;}
      .th::after{content:'';position:absolute;left:3px;right:3px;top:7px;height:2px;background:#0a1c21}
      .fd span{font:700 11px ${COND};letter-spacing:.02em;color:#78bdb3;text-transform:uppercase}
      .note{position:absolute;left:12px;right:12px;bottom:10px;font:500 9px/1.5 ${MONO};letter-spacing:.1em;color:#3d7e79;display:flex;justify-content:space-between}
      canvas{display:block}
    </style>
    <div class="f" id="root">
      <i class="rv" style="left:6px;top:6px"></i><i class="rv" style="right:6px;top:6px"></i><i class="rv" style="left:6px;bottom:6px"></i><i class="rv" style="right:6px;bottom:6px"></i>
      <svg class="lock" viewBox="0 0 34 38"><g class="sh"><path d="M9 17V11a8 8 0 0 1 16 0v6" fill="none" stroke="#3fe0c5" stroke-width="3.4" stroke-linecap="round"/></g><rect x="4" y="16" width="26" height="20" rx="4" fill="#3fe0c5"/><circle cx="17" cy="25" r="3" fill="#06201d"/><rect x="16" y="25" width="2" height="6" fill="#06201d"/></svg>
      <h1>IMMUTABLE</h1><div class="tag" id="tag">SEALED &middot; 15 IPS</div>
      <div class="chips">${presetBtns()}</div>
      <button class="lever" data-byp><div class="bs"></div><div class="kn"></div><span id="lv">SEALED</span></button>
      <div class="vault"><div class="glass"><canvas id="rl"></canvas><div class="seal" id="seal">SEALED<br>NO EDITS</div></div></div>
      <div class="under">
        <div class="rot"><svg viewBox="0 0 64 64"><g stroke="#3d7e79" stroke-width="2">
          <line x1="32" y1="32" x2="12" y2="12"/><line x1="32" y1="32" x2="32" y2="3"/><line x1="32" y1="32" x2="52" y2="12"/></g>
          <text x="2" y="12" font-size="9" fill="#78bdb3" font-family="monospace">7.5</text><text x="25" y="9" font-size="9" fill="#78bdb3" font-family="monospace">15</text><text x="44" y="12" font-size="9" fill="#78bdb3" font-family="monospace">30</text></svg>
          <div class="kn" data-p="speed"><i></i></div></div>
        <div><div class="lab">SPEED</div><div class="big" data-live="speed"></div><div class="lab" style="margin-top:2px;font-size:9px">CLICK TO STEP</div></div>
        <div><div class="lab" style="margin-bottom:4px">BUMP Hz</div>${segBtns('bumpFreq', ['40', '60', '100'])}</div>
        ${hs('wow', 'Wow', 'wowpct')}${hs('flutter', 'Flutter', 'flpct')}
      </div>
      <div class="panel">
        <div class="vus"><div><canvas id="v1"></canvas><em>IN</em></div><div><canvas id="v2"></canvas><em>OUT</em></div></div>
        <div class="fads">${fad('drive', 'Drive')}${fad('bias', 'Bias')}${fad('bump', 'Bump')}${fad('hfLoss', 'HF')}${fad('hiss', 'Hiss')}${fad('mix', 'Mix')}${fad('out', 'Out')}</div>
        <div class="note"><span data-live="harm"></span><span>SAT <b id="sv" style="color:#69f5dc;font-weight:600">0%</b></span></div>
      </div>
    </div>`;
    wire(root, P);
    const $ = s => root.querySelector(s);
    const SF = { drive: v => v.toFixed(1), bias: v => v.toFixed(2), bump: v => v.toFixed(1), hfLoss: v => (v / 1000).toFixed(1) + 'k', hiss: v => Math.round(v * 100) + '%', mix: v => Math.round(v * 100) + '%', out: v => (v > 0 ? '+' : '') + v.toFixed(1) };
    root.querySelectorAll('[data-f]').forEach(e => P.sub(e.dataset.f, v => { e.textContent = SF[e.dataset.f](+v); }));
    P.sub('__bypass', on => { $('#root').classList.toggle('off', !on); $('#lv').textContent = on ? 'SEALED' : 'OPEN · DRY'; });
    P.sub('speed', () => { $('#tag').textContent = 'SEALED · ' + P.real('speed') + ' IPS'; });
    // speed knob: click cycles (select), keep 3 detent look; click handled by P.bind
    const W = 616, H = 262, c = cv($('#rl'), W, 374), V = [cv($('#v1'), 120, 76), cv($('#v2'), 120, 76)];
    const mo = motion(P), sp = specTrack(P, 64); let sway = 0;
    const needle = [0, 0];
    const reel = (cx, cy, R, pack, ang) => {
      c.save(); c.translate(cx, cy);
      const g = c.createRadialGradient(0, 0, 4, 0, 0, R); g.addColorStop(0, '#9fb9b9'); g.addColorStop(1, '#40595c');
      c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fillStyle = 'rgba(150,210,205,.10)'; c.fill(); c.lineWidth = 5; c.strokeStyle = g; c.stroke();
      c.beginPath(); c.arc(0, 0, R * pack, 0, TAU); c.fillStyle = '#3b2a1e'; c.fill(); c.strokeStyle = '#6a4b32'; c.lineWidth = 1.5; c.stroke();
      for (let r = R * 0.34; r < R * pack - 2; r += 4) { c.beginPath(); c.arc(0, 0, r, 0, TAU); c.strokeStyle = 'rgba(255,200,150,.07)'; c.lineWidth = 1; c.stroke(); }
      for (let i = 0; i < 6; i++) { c.save(); c.rotate(ang + i * TAU / 6); c.beginPath(); c.arc(0, 0, R * 0.30, -0.33, 0.33); c.arc(0, 0, R * 0.9, 0.2, -0.2, true); c.closePath(); c.fillStyle = 'rgba(8,24,26,.85)'; c.fill(); c.strokeStyle = 'rgba(105,245,220,.5)'; c.lineWidth = 1; c.stroke(); c.restore(); }
      c.beginPath(); c.arc(0, 0, R * 0.3, 0, TAU); c.fillStyle = g; c.fill(); c.strokeStyle = '#0a1c21'; c.lineWidth = 2; c.stroke();
      for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(Math.cos(ang * 1 + i * TAU / 3) * R * .17, Math.sin(ang + i * TAU / 3) * R * .17, 3, 0, TAU); c.fillStyle = '#06201d'; c.fill(); }
      c.restore();
    };
    P.raf(() => {
      mo.upd(); sp.upd(); const ml = P.meter() || {};
      c.clearRect(0, 0, W, 374);
      // reels
      const p = Math.abs((mo.tot / 80) % 2 - 1), R = 112, cy = 118, rl = lerp(0.88, 0.42, p), rr = lerp(0.42, 0.88, p);
      sway += (mo.wob - sway) * 0.4;
      reel(138, cy, R, rl, -mo.ang); reel(478, cy, R, rr, -mo.ang * (rl / rr) * 0.85);
      // idlers + head path
      const hx = 308, hy = 232, ls = 40 * sway;
      c.strokeStyle = '#7a553a'; c.lineWidth = 3.2; c.lineCap = 'round';
      const idl = [[218, 200], [398, 200]];
      c.beginPath(); c.moveTo(138 - R * rl, cy); c.lineTo(138 - R * rl, 170); c.quadraticCurveTo(138 - R * rl, 200 + ls, idl[0][0], 205); c.lineTo(hx - 40, hy - 2 + ls * 0.3); c.lineTo(hx + 40, hy - 2 + ls * 0.3); c.lineTo(idl[1][0], 205); c.quadraticCurveTo(478 + R * rr, 200 - ls, 478 + R * rr, 170); c.lineTo(478 + R * rr, cy); c.stroke();
      idl.forEach(q => { c.beginPath(); c.arc(q[0], q[1] + 6, 9, 0, TAU); c.fillStyle = '#2e4a4d'; c.fill(); c.strokeStyle = '#8fb5b3'; c.lineWidth = 2; c.stroke(); c.beginPath(); c.arc(q[0], q[1] + 6, 2, 0, TAU); c.fillStyle = '#06201d'; c.fill(); });
      // heads
      const glow = clamp(mo.lvl * 1.4, 0, 1);
      [[hx - 28, 'ERASE'], [hx, 'REC'], [hx + 28, 'PLAY']].forEach((h, i) => { c.fillStyle = '#3d5a5d'; c.fillRect(h[0] - 9, hy, 18, 18); c.fillStyle = '#9fc2c0'; c.fillRect(h[0] - 9, hy, 18, 3); c.fillStyle = i === 1 ? 'rgba(255,170,70,' + (0.3 + glow * 0.7) + ')' : 'rgba(63,224,197,' + (0.25 + glow * 0.6 * (i / 2)) + ')'; c.fillRect(h[0] - 2, hy + 3, 4, 3); });
      c.font = '600 8px ' + MONO; c.textAlign = 'center'; c.fillStyle = '#3d7e79'; c.fillText('ERASE', hx - 28, hy + 30); c.fillText('REC', hx, hy + 30); c.fillText('PLAY', hx + 28, hy + 30);
      const sg = c.createRadialGradient(hx, hy, 2, hx, hy, 60); sg.addColorStop(0, 'rgba(255,170,70,' + (0.35 * mo.sat + 0.05 * glow) + ')'); sg.addColorStop(1, 'rgba(255,170,70,0)'); c.fillStyle = sg; c.fillRect(hx - 60, hy - 60, 120, 120);
      // spectrum shelf
      const SX = 14, SY = 270, SW = W - 28, SH = 92; c.fillStyle = 'rgba(0,10,12,.8)'; c.fillRect(SX, SY, SW, SH); c.strokeStyle = '#25494c'; c.lineWidth = 1; c.strokeRect(SX + .5, SY + .5, SW, SH);
      [50, 100, 1000, 10000].forEach(f => { const x = SX + fx(f, SW); c.strokeStyle = 'rgba(63,224,197,.12)'; c.beginPath(); c.moveTo(x, SY); c.lineTo(x, SY + SH); c.stroke(); c.fillStyle = '#3d7e79'; c.font = '500 8px ' + MONO; c.textAlign = 'left'; c.fillText(flab(f), x + 3, SY + SH - 3); });
      const bw = SW / sp.n; const gr = c.createLinearGradient(0, SY, 0, SY + SH); gr.addColorStop(0, 'rgba(105,245,220,.85)'); gr.addColorStop(1, 'rgba(31,142,126,.15)');
      c.beginPath(); c.moveTo(SX, SY + SH); for (let i = 0; i < sp.n; i++) c.lineTo(SX + (i + .5) * bw, SY + SH - sp.b[i] * (SH - 6)); c.lineTo(SX + SW, SY + SH); c.fillStyle = gr; c.fill();
      c.beginPath(); for (let i = 0; i < sp.n; i++) { const y = SY + SH - sp.a[i] * (SH - 6); i ? c.lineTo(SX + (i + .5) * bw, y) : c.moveTo(SX + bw / 2, y); } c.strokeStyle = '#ffb347'; c.lineWidth = 1.4; c.stroke();
      const cf = curveFn(P); c.beginPath(); c.setLineDash([4, 3]);
      for (let i = 0; i <= 120; i++) { const f = 30 * Math.pow(600, i / 120), y = SY + 30 - cf(f) * 3.2; i ? c.lineTo(SX + fx(f, SW), y) : c.moveTo(SX, y); } c.strokeStyle = '#fff'; c.lineWidth = 1.2; c.stroke(); c.setLineDash([]);
      c.font = '600 8px ' + MONO; c.fillStyle = '#ffb347'; c.textAlign = 'left'; c.fillText('IN', SX + 6, SY + 11); c.fillStyle = '#69f5dc'; c.fillText('OUT', SX + 22, SY + 11); c.fillStyle = '#fff'; c.fillText('HEAD BUMP + HF LOSS', SX + 48, SY + 11);
      c.textAlign = 'right'; c.fillStyle = '#ffb347'; c.fillText('SAT ' + Math.round(mo.sat * 100) + '%', SX + SW - 6, SY + 11);
      // VU needles
      [mo.inL, mo.outL].forEach((v, k) => {
        const x = V[k], t = dbn(v), tgt = clamp(t, 0, 1); needle[k] += (tgt - needle[k]) * 0.25;
        x.clearRect(0, 0, 120, 76); x.fillStyle = '#e9e0c4'; x.beginPath(); x.roundRect ? x.roundRect(0, 0, 120, 76, 6) : x.rect(0, 0, 120, 76); x.fill();
        const g = x.createLinearGradient(0, 0, 0, 76); g.addColorStop(0, 'rgba(255,255,255,.25)'); g.addColorStop(1, 'rgba(120,90,40,.2)'); x.fillStyle = g; x.fillRect(0, 0, 120, 76);
        x.strokeStyle = '#3a3426'; x.lineWidth = 1; x.fillStyle = '#3a3426'; x.font = '600 7px ' + MONO; x.textAlign = 'center';
        for (let i = 0; i <= 10; i++) { const a = (-50 + i * 10) * PI / 180, r0 = 52, r1 = i % 2 ? 56 : 59; x.strokeStyle = i >= 8 ? '#b3361b' : '#3a3426'; x.beginPath(); x.moveTo(60 + Math.sin(a) * r0, 70 - Math.cos(a) * r0); x.lineTo(60 + Math.sin(a) * r1, 70 - Math.cos(a) * r1); x.stroke(); }
        x.fillText('-20', 18, 26); x.fillText('0', 76, 14); x.fillText('+3', 100, 24);
        const a = (-50 + needle[k] * 100) * PI / 180; x.strokeStyle = '#1b1710'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(60 + Math.sin(a) * 6, 70 - Math.cos(a) * 6); x.lineTo(60 + Math.sin(a) * 56, 70 - Math.cos(a) * 56); x.stroke();
        x.fillStyle = '#1b1710'; x.fillRect(0, 66, 120, 10);
      });
      $('#sv').textContent = Math.round(mo.sat * 100) + '%';
    });
  }

  /* =====================================================================
     FACE C — TIMECHAIN : tape loop made of linked blocks
     ===================================================================== */
  

  Kit.register('tape', {
    fonts: 'family=Cinzel:wght@500;700&family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&family=Barlow+Condensed:wght@500;600;700&family=Sora:wght@400;600;800&family=JetBrains+Mono:wght@400;500;600',
    w: 960, h: 560,
    labels: { hfLoss: 'HF Loss', bumpFreq: 'Bump Freq' },
    fmts: { hfLoss: v => v >= 1000 ? (v / 1000).toFixed(1) + ' kHz' : Math.round(v) + ' Hz', drive: v => v.toFixed(1) + ' dB', bump: v => v.toFixed(1) + ' dB', out: v => (v > 0 ? '+' : '') + v.toFixed(1) + ' dB', bias: v => v.toFixed(2), wow: v => Math.round(v * 100) + '%', flutter: v => Math.round(v * 100) + '%', hiss: v => Math.round(v * 100) + '%', mix: v => Math.round(v * 100) + '%' },
    presets,
    faces: [
      undefined,
      { key: 'B', name: 'Immutable', accent: '#3fe0c5', w: 960, h: 560, build: buildB },
      undefined
    ].filter(Boolean)
  });
})();
