import { Kit } from "./runtime.js";
/* crush — Bitcrusher. Faces: A Dust (stippled sand strata) / B Sats (pocket LCD counter) / C Fractional (pie + fraction graph paper) */
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const SERIF = "Georgia,'Times New Roman',serif";
  const MONO = "ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace";
  const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const hz = v => v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 1 : 2).replace(/\.?0+$/, '') + ' kHz' : Math.round(v) + ' Hz';
  const dbf = (v, d) => (v > 0 ? '+' : '') + v.toFixed(d == null ? 1 : d) + ' dB';
  const dbOf = x => x > 1e-5 ? 20 * Math.log10(x) : -100;
  const meterPct = x => clamp((dbOf(x) + 54) / 60, 0, 1);
  const rng = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  const presets = [
    { name: 'Init', values: {} },
    { name: 'Gentle grit', values: { bits: 10, tone: 9500, mix: 0.45, downsample: 1, jitter: 0, dither: 'off', out: 0 } },
    { name: 'Sampler 12', values: { bits: 8, tone: 9000, mix: 1, downsample: 3, jitter: 0, dither: 'on', out: -1 } },
    { name: 'Handheld', values: { bits: 4, tone: 6000, mix: 1, downsample: 6, jitter: 0, dither: 'off', out: -3 } },
    { name: 'Dust bowl', values: { bits: 5, tone: 3500, mix: 0.8, downsample: 12, jitter: 0.35, dither: 'on', out: -2 } },
    { name: 'Broken radio', values: { bits: 3, tone: 2500, mix: 1, downsample: 24, jitter: 0.6, dither: 'off', out: -4 } },
    { name: 'Half a bit', values: { bits: 5.5, tone: 8000, mix: 0.7, downsample: 2, jitter: 0.1, dither: 'on', out: -1 } }
  ];

  /* ---------- shared wiring ---------- */
  function wire(root, P) {
    root.querySelectorAll('[data-p]').forEach(el => {
      const o = {}; if (el.dataset.abs) { o.abs = true; o.axis = el.dataset.abs; } if (el.dataset.ax) o.axis = el.dataset.ax; if (el.dataset.rng) o.range = +el.dataset.rng;
      P.bind(el, el.dataset.p, o);
    });
    root.querySelectorAll('[data-t]').forEach(el => P.text(el, el.dataset.t));
    root.querySelectorAll('[data-byp]').forEach(el => P.bind(el, '__bypass'));
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
  }
  const plist = (P, f) => P.presets.map((p, i) => f(p, i)).join('');

  /* live state: parameters + meter + a triggered window of the real signal */
  function live(P, n) {
    const S = { g: 1, n, o: null, a: null, s: 0, pk: 0, idle: true, rate: 48000, act: false, inP: 0, outP: 0, hi: 0, ho: 0, bits: 6, ds: 1, jit: 0, dith: 0, mixv: 1 };
    S.step = () => {
      const m = P.meter() || {};
      S.rate = m.rate != null ? m.rate : P.sampleRate();
      S.act = !!m.active;
      S.inP = m.inPeak || 0; S.outP = m.outPeak || 0;
      S.hi = Math.max(S.inP, S.hi * 0.94); S.ho = Math.max(S.outP, S.ho * 0.94);
      S.bits = P.get('bits'); S.ds = P.get('downsample'); S.jit = P.get('jitter'); S.dith = P.get('dither'); S.mixv = P.get('mix');
      const o = P.timeData('out'), a = P.timeData('in'), N = o.length;
      let start = N - n - 1;
      for (let i = Math.max(1, N - n - 1800); i < N - n; i++) if (a[i - 1] < -0.005 && a[i] >= 0) { start = i; break; }
      let pk = 0; for (let i = start; i < start + n; i++) { const v = Math.max(Math.abs(o[i]), Math.abs(a[i])); if (v > pk) pk = v; }
      S.o = o; S.a = a; S.s = start; S.pk = pk; S.idle = pk < 0.004;
      const target = pk > 0.02 ? clamp(0.8 / pk, 0.6, 6) : 1;
      S.g += (target - S.g) * 0.12;
      S.levels = Math.pow(2, S.bits);
      // effective hold in samples: only when the worklet carries the signal
      S.hold = S.act ? Math.max(1, Math.round(S.ds)) : 1;
      return S;
    };
    return S;
  }
  const lvText = L => L >= 1000 ? Math.round(L) + '' : L >= 100 ? Math.round(L) + '' : (Math.round(L * 10) / 10).toString();
  function setMeter(fill, x) { fill.style.height = (meterPct(x) * 100).toFixed(1) + '%'; }

  /* knob / fader / meter widgets are written per face (different products) */

  /* ====================================================================== */
  /* A  DUST — stippled sand strata, soot-brown card, serif italic          */
  /* ====================================================================== */
  function faceA(root, P) {
    const AC = '#e0a458', SAND = '#ecd7ab', DIM = '#8f7756';
    const knob = (id, lab, sz, cls) => `<div class="kc ${cls || ''}"><div class="kn" data-p="${id}" style="--sz:${sz}px"><i class="arc"></i><i class="cap"><b></b></i></div><div class="kv" data-t="${id}"></div><div class="kl">${lab}</div></div>`;
    root.innerHTML = `<style>
      *{box-sizing:border-box}
      .f{position:absolute;inset:0;overflow:hidden;color:${SAND};font-family:${SANS};
        background:
          radial-gradient(circle at 18% 22%,rgba(255,214,150,.09) 1px,transparent 1.6px) 0 0/19px 23px,
          radial-gradient(circle at 70% 60%,rgba(255,214,150,.07) 1px,transparent 1.5px) 0 0/29px 17px,
          radial-gradient(circle at 40% 80%,rgba(0,0,0,.35) 1px,transparent 1.5px) 0 0/13px 21px,
          linear-gradient(170deg,#2b2117,#181109)}
      .top{position:absolute;left:28px;right:28px;top:16px;height:56px;display:flex;align-items:center;gap:22px}
      .mark{display:flex;align-items:center;gap:12px}
      .mark svg{width:46px;height:42px}
      .mark h1{margin:0;font:italic 600 40px/1 ${SERIF};letter-spacing:-.01em;color:${SAND}}
      .mark small{display:block;font:11px ${SANS};letter-spacing:.2em;text-transform:uppercase;color:${DIM};margin-top:2px}
      .pb{margin-left:auto;display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.28);border:1px solid #4a3a28;border-radius:30px;padding:6px 8px}
      .pb button{all:unset;cursor:pointer;width:26px;height:26px;border-radius:50%;text-align:center;line-height:26px;color:${AC};font-size:15px}
      .pb button:hover{background:rgba(224,164,88,.18)}
      .pb .nm{min-width:150px;text-align:center;font:italic 18px ${SERIF}}
      .pb .ix{font:11px ${MONO};color:${DIM}}
      .sw{all:unset;cursor:pointer;display:flex;align-items:center;gap:9px;font:11px ${SANS};letter-spacing:.14em;text-transform:uppercase;color:${DIM};padding:6px 12px;border:1px solid #4a3a28;border-radius:30px}
      .sw i{width:30px;height:16px;border-radius:9px;background:#120d08;border:1px solid #4a3a28;position:relative}
      .sw i::after{content:'';position:absolute;left:2px;top:2px;width:10px;height:10px;border-radius:50%;background:#6b5439;transition:all .15s}
      .sw.on{color:${SAND}} .sw.on i::after{left:16px;background:${AC};box-shadow:0 0 8px ${AC}}
      .disp{position:absolute;left:28px;top:82px;width:584px;height:240px;border-radius:14px;border:1px solid #54402b;overflow:hidden;background:#120d08;box-shadow:inset 0 0 40px rgba(0,0,0,.7)}
      .disp canvas{width:100%;height:100%;display:block}
      .disp .tag{position:absolute;left:12px;top:9px;font:italic 13px ${SERIF};color:${DIM};pointer-events:none}
      .disp .tag2{position:absolute;right:12px;top:9px;font:11px ${MONO};color:${AC};pointer-events:none;letter-spacing:.06em}
      .disp .idle{position:absolute;left:0;right:0;bottom:12px;text-align:center;font:italic 13px ${SERIF};color:${DIM};pointer-events:none;opacity:0;transition:opacity .3s}
      .disp.quiet .idle{opacity:1}
      .stats{position:absolute;left:28px;top:330px;width:584px;display:flex;gap:10px}
      .stat{flex:1;background:rgba(0,0,0,.25);border:1px solid #3e301f;border-radius:10px;padding:7px 12px}
      .stat b{display:block;font:italic 20px ${SERIF};color:${SAND}} .stat span{font:10px ${SANS};letter-spacing:.16em;text-transform:uppercase;color:${DIM}}
      .big{position:absolute;left:28px;top:392px;width:584px;display:flex;justify-content:space-around;align-items:flex-start}
      .kc{display:flex;flex-direction:column;align-items:center;gap:4px;width:150px}
      .kn{width:var(--sz);height:var(--sz);position:relative;cursor:ns-resize;touch-action:none;border-radius:50%}
      .kn .arc{position:absolute;inset:0;border-radius:50%;
        background:conic-gradient(from -135deg,${AC} 0,${AC} calc(var(--v)*270deg),#40301f calc(var(--v)*270deg),#40301f 270deg,transparent 270deg);
        -webkit-mask:radial-gradient(circle,transparent calc(50% - 6px),#000 calc(50% - 5px));mask:radial-gradient(circle,transparent calc(50% - 6px),#000 calc(50% - 5px))}
      .kn .cap{position:absolute;inset:9px;border-radius:50%;background:
        radial-gradient(circle at 30% 26%,rgba(255,225,170,.22) 1px,transparent 1.6px) 0 0/7px 6px,
        radial-gradient(circle at 34% 28%,#5a4631,#2c2217 70%);border:1px solid #6b5439;box-shadow:0 5px 10px rgba(0,0,0,.55);transform:rotate(calc(-135deg + var(--v)*270deg))}
      .kn .cap b{position:absolute;left:calc(50% - 3px);top:5px;width:6px;height:6px;border-radius:50%;background:${SAND};box-shadow:0 0 6px ${AC}}
      .kn:focus-visible{outline:1px dashed ${AC};outline-offset:3px}
      .kn.drag .cap{border-color:${AC}}
      .kv{font:italic 17px ${SERIF};color:${SAND};min-height:20px} .kl{font:10px ${SANS};letter-spacing:.18em;text-transform:uppercase;color:${DIM}}
      .rt{position:absolute;left:640px;top:82px;width:232px}
      .rt h4{margin:0 0 8px;font:italic 14px ${SERIF};color:${DIM};font-weight:400}
      .jar{display:flex;flex-direction:column;gap:4px}
      .jar button{all:unset;cursor:pointer;display:flex;align-items:center;gap:9px;padding:3px 10px;border-radius:8px;border:1px solid #3e301f;background:rgba(0,0,0,.2);font:15px ${SERIF};font-style:italic;color:${SAND}}
      .jar button em{font:10px ${MONO};color:${DIM};font-style:normal;width:16px}
      .jar button:hover{border-color:#6b5439}
      .jar button.on{background:rgba(224,164,88,.16);border-color:${AC};color:#fff3d6}
      .jar button.on em{color:${AC}}
      .mt{position:absolute;left:640px;top:340px;width:232px;height:54px;display:flex;gap:10px;align-items:stretch}
      .mt .m{flex:1;display:flex;flex-direction:column;gap:4px;font:10px ${SANS};letter-spacing:.16em;text-transform:uppercase;color:${DIM}}
      .mt .bar{flex:1;border:1px solid #3e301f;border-radius:6px;background:#120d08;position:relative;overflow:hidden}
      .mt .bar i{position:absolute;left:0;right:0;bottom:0;height:0;background:repeating-linear-gradient(0deg,${AC} 0 3px,transparent 3px 5px);opacity:.95}
      .mt .m:last-child .bar i{background:repeating-linear-gradient(0deg,#e8c88a 0 3px,transparent 3px 5px)}
      .sp{all:unset;cursor:pointer;position:absolute;left:640px;top:352px;display:none}
      .small{position:absolute;left:640px;top:402px;width:232px;display:flex;justify-content:space-between}
      .small .kc{width:76px}
      .dith{all:unset;cursor:pointer;position:absolute;left:640px;top:352px;opacity:0}
      .foot{position:absolute;left:28px;right:28px;bottom:5px;font:italic 11px ${SERIF};color:#6b5439;display:flex;justify-content:space-between;pointer-events:none}
    </style>
    <div class="f">
      <div class="top">
        <div class="mark">
          <svg viewBox="0 0 46 42"><g fill="${AC}">${Array.from({ length: 36 }, (_, i) => { const r = Math.floor((Math.sqrt(8 * i + 1) - 1) / 2), c = i - r * (r + 1) / 2; return r > 7 ? '' : `<circle cx="${23 + (c - r / 2) * 5.6 + (rng(i) - .5) * 1.4}" cy="${38 - r * 4.4 + (rng(i + 9) - .5)}" r="${1.2 + rng(i + 3) * .7}" opacity="${.45 + rng(i + 5) * .55}"/>`; }).join('')}</g></svg>
          <div><h1>Dust</h1><small>sample-rate &amp; bit-depth crumbler</small></div>
        </div>
        <div class="pb"><button data-prev>&#8249;</button><span class="ix" data-pidx>--</span><span class="nm" data-pname>Init</span><button data-next>&#8250;</button></div>
        <button class="sw" data-byp><span data-bl>Sifting</span><i></i></button>
      </div>
      <div class="disp" id="disp"><canvas id="cv" width="1168" height="516"></canvas><div class="tag">what is left of the signal</div><div class="tag2" id="tag2"></div><div class="idle">nothing falling yet &mdash; press play on the source strip</div></div>
      <div class="stats">
        <div class="stat"><b id="sLv">64</b><span>grain layers</span></div>
        <div class="stat"><b id="sRate">48 kHz</b><span>effective rate</span></div>
        <div class="stat"><b id="sHold">1 &times;</b><span>grains held</span></div>
        <div class="stat"><b id="sEng">dry path</b><span>engine</span></div>
      </div>
      <div class="big">${knob('bits', 'Depth &middot; bits', 78)}${knob('downsample', 'Grain &middot; hold', 78)}${knob('jitter', 'Scatter &middot; jitter', 78)}</div>
      <div class="rt"><h4>Jars</h4><div class="jar">${plist(P, (p, i) => `<button data-pl="${i}"><em>${String(i + 1).padStart(2, '0')}</em>${p.name}</button>`)}</div></div>
      <div class="mt"><div class="m">in<div class="bar"><i id="mi"></i></div></div><div class="m">out<div class="bar"><i id="mo"></i></div></div>
        <button class="sw" data-p="dither" id="dth" style="align-self:center;flex-direction:column;gap:6px;padding:6px 8px"><span>Sprinkle</span><i></i></button></div>
      <div class="small">${knob('tone', 'Tone', 58)}${knob('mix', 'Mix', 58)}${knob('out', 'Output', 58)}</div>
      <div class="foot"><span>everything above the fine print is rounded down to the nearest grain</span><span>dither = a pinch of sprinkle</span></div>
    </div>`;
    const $ = s => root.querySelector(s);
    wire(root, P);
    P.sub('__bypass', on => { $('[data-bl]').textContent = on ? 'Sifting' : 'Bypassed'; });
    // dither toggle: the select cycles; style by data-index
    const dth = $('#dth'); const ds = document.createElement('style');
    ds.textContent = `#dth[data-index="1"]{color:${SAND}} #dth[data-index="1"] i::after{left:16px;background:${AC};box-shadow:0 0 8px ${AC}}`;
    root.querySelector('.f').appendChild(ds);
    const cv = $('#cv'), ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
    const S = live(P, 480);
    const specks = Array.from({ length: 46 }, (_, i) => ({ x: rng(i) * W, y: rng(i + 50) * H, v: .4 + rng(i + 99), r: 1 + rng(i + 7) * 1.6 }));
    P.raf(() => {
      S.step();
      $('#disp').classList.toggle('quiet', S.idle);
      const L = S.levels, g = S.g, mid = H / 2, amp = H / 2 - 36;
      ctx.clearRect(0, 0, W, H);
      const bgG = ctx.createLinearGradient(0, 0, 0, H); bgG.addColorStop(0, '#171008'); bgG.addColorStop(1, '#0d0905'); ctx.fillStyle = bgG; ctx.fillRect(0, 0, W, H);
      // strata
      const step = 2 / L;
      if (L <= 72) {
        for (let k = -L / 2; k <= L / 2 + 0.001; k++) {
          const y = mid - k * step * g * amp;
          if (y < 4 || y > H - 4) continue;
          ctx.fillStyle = k === 0 ? 'rgba(236,215,171,.28)' : 'rgba(224,164,88,.13)';
          ctx.fillRect(0, y, W, k === 0 ? 2 : 1);
        }
      } else { ctx.fillStyle = 'rgba(224,164,88,.06)'; for (let y = mid % 6; y < H; y += 6) ctx.fillRect(0, y, W, 1); }
      // in ghost
      const n = S.n, px = W / n;
      ctx.strokeStyle = 'rgba(236,215,171,.22)'; ctx.lineWidth = 2; ctx.beginPath();
      for (let i = 0; i < n; i++) { const v = S.a[S.s + i] * g; const y = mid - clamp(v, -1.2, 1.2) * amp; i ? ctx.lineTo(i * px, y) : ctx.moveTo(0, y); }
      ctx.stroke();
      // piles of grains, one column per sample; scatter shows as x wobble
      const sc = S.jit * 3.2;
      const hold = S.hold;
      for (let i = 0; i < n; i++) {
        const v = S.o[S.s + i] * g, h = clamp(Math.abs(v), 0, 1.2) * amp, sg = v >= 0 ? -1 : 1;
        const cnt = Math.min(30, Math.ceil(h / 5));
        ctx.fillStyle = (i % (hold * 2) < hold) ? 'rgba(224,164,88,.8)' : 'rgba(236,215,171,.72)';
        const x0 = i * px;
        for (let k = 0; k < cnt; k++) {
          const gy = (k + rng(i * 3 + k)) * (h / cnt);
          ctx.fillRect(x0 + (rng(i + k * 5) - .5) * px * (0.9 + sc), mid + sg * gy, 2, 2);
        }
      }
      // crisp stepped edge
      ctx.strokeStyle = AC; ctx.lineWidth = 2.5; ctx.shadowColor = AC; ctx.shadowBlur = 10; ctx.beginPath();
      let py = null;
      for (let i = 0; i < n; i++) {
        const y = mid - clamp(S.o[S.s + i] * g, -1.2, 1.2) * amp;
        if (py == null) ctx.moveTo(0, y); else { ctx.lineTo(i * px, py); ctx.lineTo(i * px, y); }
        py = y;
      }
      ctx.stroke(); ctx.shadowBlur = 0;
      // drifting specks, lifted by level
      const lv = P.level('out');
      for (const s of specks) {
        s.y += (0.4 + s.v) * (1 + lv * 6); s.x += Math.sin(s.y * .02 + s.v * 9) * .4;
        if (s.y > H) { s.y = -4; s.x = Math.random() * W; }
        ctx.fillStyle = `rgba(236,215,171,${.15 + s.v * .25})`; ctx.fillRect(s.x, s.y, s.r, s.r);
      }
      $('#tag2').textContent = (S.act ? 'held ' + S.hold + '×' : 'native') + ' · ' + hz(S.rate);
      $('#sLv').textContent = lvText(L);
      $('#sRate').textContent = hz(S.rate);
      $('#sHold').textContent = S.hold + ' ×' + (S.jit > 0 && S.act ? ' ~' : '');
      $('#sEng').textContent = S.act ? 'worklet' : (S.ds > 1 || S.jit > 0 || S.dith ? 'warming up' : 'dry path');
      setMeter($('#mi'), S.hi); setMeter($('#mo'), S.ho);
    });
  }

  /* ====================================================================== */
  /* B  SATS — pocket handheld, green LCD, pixel waveform, chunky plastics  */
  /* ====================================================================== */
  

  /* ====================================================================== */
  /* C  FRACTIONAL — paper, ink and a pie that splits into 2^bits parts     */
  /* ====================================================================== */
  

  Kit.register('crush', {
    fonts: 'family=Silkscreen:wght@400;700',
    w: 900, h: 540,
    labels: { bits: 'Bits', tone: 'Tone', mix: 'Mix', downsample: 'Downsample', jitter: 'Jitter', dither: 'Dither', out: 'Output' },
    fmts: {
      bits: v => (Math.round(v * 10) / 10) + ' bit',
      tone: v => hz(v),
      mix: v => Math.round(v * 100) + '%',
      downsample: v => v + '×',
      jitter: v => Math.round(v * 100) + '%',
      out: v => dbf(v)
    },
    presets,
    faces: [
      { key: 'A', name: 'Dust', accent: '#e0a458', w: 900, h: 540, build: faceA },
      undefined,
      undefined
    ].filter(Boolean)
  });
})();
