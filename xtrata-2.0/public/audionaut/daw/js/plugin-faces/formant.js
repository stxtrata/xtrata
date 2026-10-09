import { Kit } from "./runtime.js";
/* formant — Formant / Vowel filter. Faces: A Oracle (constellation pad + eye) / B Anon (pixel hooded voice scrambler) / C Shill (megaphone billboard) */
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const SERIF = "'Cinzel','Cormorant Garamond','Palatino Linotype',Palatino,Georgia,'Times New Roman',serif";
  const BODY = "'Cormorant Garamond','Palatino Linotype',Palatino,Georgia,serif";
  const PIX = "'Press Start 2P','Courier New',Courier,ui-monospace,monospace";
  const MONO = "ui-monospace,'SFMono-Regular',Menlo,Consolas,'Courier New',monospace";
  const LOUD = "'Anton',Impact,'Haettenschweiler','Arial Narrow Bold','Arial Black',sans-serif";
  const VN = ['A', 'E', 'I', 'O', 'U'];
  const VNL = ['AH', 'EH', 'EE', 'OH', 'OO'];
  // vowel tables (same as the voice synth): freqs, gains, bandwidths
  const TAB = [[800, 1150, 2900], [400, 1600, 2700], [270, 2140, 2950], [450, 800, 2830], [325, 700, 2530]];
  const BW = [80, 90, 120], GN = [1, 0.5, 0.15];
  const tabAt = (v, k) => { v = clamp(v, 0, 4); const i = Math.min(3, Math.floor(v)), t = v - i; return Math.exp(lerp(Math.log(TAB[i][k]), Math.log(TAB[i + 1][k]), t)); };
  const hz = v => v >= 1000 ? (v / 1000).toFixed(2) + 'k' : String(Math.round(v));
  const hzU = v => v >= 1000 ? (v / 1000).toFixed(2) + ' kHz' : Math.round(v) + ' Hz';
  const st = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1) + ' st';
  const dbf = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1) + ' dB';
  const pct = v => Math.round(v * 100) + '%';
  const vtxt = v => { const i = Math.round(clamp(v, 0, 4)); return VN[i]; };
  const dbOf = x => x > 1e-5 ? 20 * Math.log10(x) : -100;

  const presets = [
    { name: 'Init', values: {} },
    { name: 'Wah wah', values: { vowel: 3, vowelTo: 0, sweep: 1, rate: 1.6, shift: 0, reso: 1.6, mix: 1, out: 0 } },
    { name: 'Talking pad', values: { vowel: 0, vowelTo: 4, sweep: 0.8, rate: 0.35, shift: 0, reso: 1.2, mix: 0.85, out: -2 } },
    { name: 'Choir ooh', values: { vowel: 4, vowelTo: 3, sweep: 0.15, rate: 0.2, shift: 0, reso: 1.4, mix: 0.8, out: -1 } },
    { name: 'Munchkin', values: { vowel: 2, vowelTo: 1, sweep: 0.1, rate: 0.5, shift: 7, reso: 1.3, mix: 1, out: -3 } },
    { name: 'Giant', values: { vowel: 3, vowelTo: 4, sweep: 0.1, rate: 0.3, shift: -9, reso: 1.8, mix: 1, out: -2 } },
    { name: 'Robot mouth', values: { vowel: 1, vowelTo: 3, sweep: 1, rate: 6, shift: 3, reso: 2.6, mix: 0.9, out: -4 } }
  ];

  /* ---------- shared: live tracker, wiring, drawing helpers ---------- */
  function live(P) {
    const S = { f1: 800, f2: 1150, f3: 2900, vn: 0, inDb: -100, outDb: -100, inPk: 0, outPk: 0, t: 0, lvl: 0 };
    let last = 0;
    P.raf(t => {
      const dt = clamp((t - last) / 1000 || 0.016, 0.001, 0.1); last = t; S.t += dt;
      const m = P.meter() || {};
      const sh = Math.pow(2, (P.get('shift') || 0) / 12);
      const vn = typeof m.vowelNow === 'number' && isFinite(m.vowelNow) ? m.vowelNow : P.get('vowel');
      const f1 = typeof m.f1 === 'number' && m.f1 > 0 ? m.f1 : tabAt(vn, 0) * sh;
      const f2 = typeof m.f2 === 'number' && m.f2 > 0 ? m.f2 : tabAt(vn, 1) * sh;
      const f3 = typeof m.f3 === 'number' && m.f3 > 0 ? m.f3 : tabAt(vn, 2) * sh;
      const k = 1 - Math.exp(-dt / 0.05);
      S.vn = vn; S.f1 = lerp(S.f1, f1, k); S.f2 = lerp(S.f2, f2, k); S.f3 = lerp(S.f3, f3, k);
      S.inPk = m.inPeak || 0; S.outPk = m.outPeak || 0;
      S.inDb = Math.max(clamp(dbOf(S.inPk), -80, 6), S.inDb - 40 * dt);
      S.outDb = Math.max(clamp(dbOf(S.outPk), -80, 6), S.outDb - 40 * dt);
      S.lvl = Math.max(clamp((S.outDb + 50) / 50, 0, 1), S.lvl - 2.5 * dt);
    });
    return S;
  }
  // analytic envelope (dB, relative) of the 3 band-passes at current f1..f3 and reso
  function env(S, P, f) {
    const r = P.get('reso') || 1; let a = 0;
    const F = [S.f1, S.f2, S.f3];
    for (let i = 0; i < 3; i++) { const q = (F[i] / BW[i]) * r * 0.5; const x = f / F[i] - F[i] / f; a += GN[i] / Math.sqrt(1 + q * q * x * x * 0.25 * 4); }
    return 20 * Math.log10(a * 3 + 1e-4);
  }
  const lx = (f, fMin, fMax) => Math.log(f / fMin) / Math.log(fMax / fMin);

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
  // custom value readouts (own formatting) : data-x="key:fmt"
  function readouts(root, P, fm) {
    root.querySelectorAll('[data-x]').forEach(el => {
      const [k, f] = el.dataset.x.split(':'); P.sub(k, v => { el.textContent = fm[f](v); });
    });
  }
  const FM = {
    v: v => vtxt(v) + ' ' + (+v).toFixed(2), hz: v => (+v).toFixed(2) + ' Hz', st, db: dbf, pct, q: v => '×' + (+v).toFixed(2)
  };
  // segmented vowel strip (custom pointer logic -> P.set): el has 5 children
  function vowelStrip(el, P, key) {
    const set = e => { const r = el.getBoundingClientRect(); P.set(key, clamp((e.clientX - r.left) / r.width * 5 - 0.5, 0, 4)); };
    let drag = false;
    el.addEventListener('pointerdown', e => { drag = true; try { el.setPointerCapture(e.pointerId); } catch (x) { } set(e); e.preventDefault(); });
    el.addEventListener('pointermove', e => { if (drag) set(e); });
    el.addEventListener('pointerup', () => { drag = false; }); el.addEventListener('pointercancel', () => { drag = false; });
    el.addEventListener('dblclick', () => P.set(key, P.def(key).def));
    el.addEventListener('wheel', e => { e.preventDefault(); P.set(key, clamp(P.get(key) + (e.deltaY < 0 ? 0.25 : -0.25), 0, 4)); }, { passive: false });
    el.setAttribute('data-vs', key);
    return P.sub(key, v => { el.style.setProperty('--v', v / 4); [...el.children].forEach((c, i) => { c.style.setProperty('--d', clamp(1 - Math.abs(v - i), 0, 1)); c.classList.toggle('on', Math.round(v) === i); }); });
  }

  /* =====================================================================
     FACE A — ORACLE : violet night, gold lines, constellation pad, eye
     ===================================================================== */
  

  /* =====================================================================
     FACE B — ANON : bone-white scrambler box, pixel hooded avatar, LCD pad
     ===================================================================== */
  function buildB(root, P) {
    root.innerHTML = `<style>
      *{box-sizing:border-box}
      .f{position:absolute;inset:0;overflow:hidden;background:#e4e0d2;color:#16141c;font-family:${MONO}}
      .f::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,#0000 0 3px,#0000000a 3px 4px);pointer-events:none;z-index:5}
      .top{position:absolute;left:0;right:0;top:0;height:54px;background:#16141c;color:#e4e0d2;display:flex;align-items:center;padding:0 18px;gap:16px}
      .top h1{margin:0;font:400 22px ${PIX};letter-spacing:.06em;color:#ff2e88;text-shadow:2px 2px 0 #17c3d6}
      .top small{font:400 8px ${PIX};color:#9a96a8;line-height:1.6}
      .pb{margin-left:auto;display:flex;align-items:center;gap:6px}
      .pb button{all:unset;cursor:pointer;width:26px;height:26px;text-align:center;line-height:26px;background:#e4e0d2;color:#16141c;font:400 12px ${PIX}}
      .pb button:active{transform:translateY(2px)}
      .lcd{background:#0f2f31;color:#4ff0e0;font:400 10px ${PIX};padding:0 10px;height:26px;line-height:26px;min-width:178px;text-align:center;box-shadow:inset 0 0 0 2px #0a1f20;text-shadow:0 0 6px #17c3d6;white-space:nowrap;overflow:hidden}
      .pw{all:unset;cursor:pointer;width:68px;height:30px;line-height:30px;text-align:center;font:400 9px ${PIX};background:#555062;color:#e4e0d2;box-shadow:0 4px 0 #2b2833;margin-left:8px}
      .pw.on{background:#ff2e88;color:#fff;box-shadow:0 4px 0 #a01856}
      .pw:active{transform:translateY(3px);box-shadow:0 1px 0 #000}
      .box{position:absolute;background:#d4cfbf;border:3px solid #16141c;box-shadow:4px 4px 0 #16141c}
      .tag{position:absolute;top:-10px;left:8px;background:#e4e0d2;padding:0 6px;font:400 8px ${PIX};color:#16141c}
      #av{position:absolute;left:20px;top:72px;width:230px;height:230px;background:#0f2f31;display:block}
      #pad{position:absolute;left:270px;top:72px;width:320px;height:250px;background:#0f2f31;display:block;cursor:crosshair;touch-action:none}
      #lcd2{position:absolute;left:270px;top:340px;width:320px;height:84px;background:#0f2f31;display:block}
      .pm{position:absolute;left:20px;top:318px;width:230px;display:grid;grid-template-columns:1fr 1fr;gap:6px}
      .pm button{all:unset;cursor:pointer;background:#e4e0d2;border:2px solid #16141c;box-shadow:0 2px 0 #16141c;padding:2px 4px;font:400 7px ${PIX};text-align:center;line-height:1.2;color:#16141c;height:22px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;overflow:hidden}
      .pm button:active{transform:translateY(3px);box-shadow:none}
      .pm button.on{background:#17c3d6}
      .fd{position:absolute;left:610px;top:72px;width:170px;height:250px;display:flex;justify-content:space-around;padding:14px 4px 8px}
      .fdr{width:46px;text-align:center;display:flex;flex-direction:column;align-items:center}
      .trk{width:14px;flex:1;background:#16141c;position:relative;cursor:ns-resize;touch-action:none;margin:4px 0}
      .trk::before{content:'';position:absolute;left:-8px;right:-8px;top:0;bottom:0;background:repeating-linear-gradient(180deg,#16141c55 0 1px,#0000 1px 12px)}
      .trk i{position:absolute;left:0;right:0;bottom:0;height:calc(var(--v)*100%);background:#ff2e88}
      .trk u{position:absolute;left:-12px;right:-12px;bottom:calc(var(--v)*100% - 8px);height:16px;background:#e4e0d2;border:2px solid #16141c;box-shadow:0 3px 0 #16141c}
      .trk.drag u{background:#17c3d6}
      .fdr span{font:400 7px ${PIX};margin-top:4px}.fdr em{font:700 10px ${MONO};font-style:normal;height:14px;white-space:nowrap}
      .mt{position:absolute;left:610px;top:340px;width:170px;height:84px;padding:14px 10px 6px}
      .mt div{display:flex;align-items:center;gap:6px;margin-bottom:8px;font:400 7px ${PIX}}
      .mt div b{display:block;flex:1;height:14px;background:#16141c;background-image:repeating-linear-gradient(90deg,#0000 0 10px,#d4cfbf 10px 12px);position:relative;overflow:hidden}
      .mt div b i{position:absolute;left:0;top:2px;bottom:2px;width:0;background:#17c3d6}
      .mt div:last-child b i{background:#ff2e88}
      .dl{position:absolute;left:20px;right:20px;top:440px;height:62px;display:flex;align-items:center;gap:28px}
      .dd{display:flex;align-items:center;gap:10px;width:150px}
      .dial{width:46px;height:46px;position:relative;border-radius:50%;background:#e4e0d2;border:3px solid #16141c;box-shadow:0 3px 0 #16141c;cursor:ns-resize;touch-action:none;flex:none}
      .dial::before{content:'';position:absolute;left:calc(50% - 3px);top:3px;width:6px;height:15px;background:#ff2e88;transform-origin:3px 17px;transform:rotate(calc(-135deg + var(--v)*270deg))}
      .dial.drag{background:#17c3d6}
      .dd span{font:400 7px ${PIX};display:block;line-height:1.5}.dd em{font:700 11px ${MONO};font-style:normal}
      .mono{margin-left:auto;font:400 7px ${PIX};line-height:2;text-align:right;color:#555062}
      .mono b{color:#ff2e88;font-weight:400}
    </style>
    <div class="f">
      <div class="top"><h1>ANON</h1><small>VOICE<br>SCRAMBLER</small>
        <div class="pb"><button data-prev>&lt;</button><div class="lcd"><span data-pidx>--</span> <span data-pname>Init</span></div><button data-next>&gt;</button></div>
        <button class="pw" data-byp>MASK</button></div>
      <div class="box" style="left:20px;top:72px;width:230px;height:230px"><span class="tag">WHO?</span></div><canvas id="av" width="460" height="460"></canvas>
      <div class="pm">${plist(P, (p, i) => `<button data-pl="${i}">${p.name}</button>`)}</div>
      <div class="box" style="left:270px;top:72px;width:320px;height:250px"><span class="tag">VOWEL x SHIFT</span></div>
      <canvas id="pad" width="640" height="500"></canvas>
      <div class="box" style="left:270px;top:340px;width:320px;height:84px"><span class="tag">FORMANTS</span></div>
      <canvas id="lcd2" width="640" height="168"></canvas>
      <div class="box fd"><span class="tag">LEVELS</span>
        <div class="fdr"><em data-x="reso:q"></em><div class="trk" data-p="reso" data-abs="y"><i></i><u></u></div><span>RESO</span></div>
        <div class="fdr"><em data-t="mix"></em><div class="trk" data-p="mix" data-abs="y"><i></i><u></u></div><span>MIX</span></div>
        <div class="fdr"><em data-x="out:db"></em><div class="trk" data-p="out" data-abs="y"><i></i><u></u></div><span>OUT</span></div></div>
      <div class="box mt"><span class="tag">SIGNAL</span><div>IN<b><i id="mi"></i></b></div><div>OUT<b><i id="mo"></i></b></div></div>
      <div class="dl">
        <div class="dd"><div class="dial" data-p="vowelTo"></div><div><span>TARGET</span><em data-x="vowelTo:v"></em></div></div>
        <div class="dd"><div class="dial" data-p="sweep"></div><div><span>WARBLE</span><em data-t="sweep"></em></div></div>
        <div class="dd"><div class="dial" data-p="rate"></div><div><span>SPEED</span><em data-x="rate:hz"></em></div></div>
        <div class="mono">NO NAME<br>NO FACE<br><b>NO LOGS</b></div>
      </div>
    </div>`;
    const $ = s => root.querySelector(s);
    wire(root, P); readouts(root, P, FM);
    const S = live(P);
    P.bindXY($('#pad'), 'vowel', 'shift');
    const av = $('#av').getContext('2d'), pd = $('#pad').getContext('2d'), l2 = $('#lcd2').getContext('2d');
    const INK = '#0f2f31', C1 = '#4ff0e0', C2 = '#ff2e88', DIM = '#1f6a68';
    const mi = $('#mi'), mo = $('#mo');
    let frame = 0, blink = 0, seed = 1;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    P.raf(t => {
      const tt = t / 1000; frame++;
      mi.style.width = clamp((S.inDb + 60) / 60, 0, 1) * 100 + '%'; mo.style.width = clamp((S.outDb + 60) / 60, 0, 1) * 100 + '%';
      const on = P.bypass.get();
      // ---------- avatar : 24x23 pixel grid ----------
      av.fillStyle = INK; av.fillRect(0, 0, 460, 460);
      const C = 19;
      const cell = (x, y, c) => { av.fillStyle = c; av.fillRect(x * C + 1, y * C + 1, C - 2, C - 2); };
      if (frame % 3 === 0) seed = 11 + Math.floor(tt * 6);
      for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
        const dx = (x - 11.5) / 10.2, dy = (y - 9.5) / 10.2;
        const inHood = dx * dx + dy * dy < 1 && y < 20;
        const body = y >= 17 && Math.abs(x - 11.5) < 3 + (y - 17) * 2.6;
        const fx = (x - 11.5) / 6.2, fy = (y - 10.5) / 7.2, inFace = fx * fx + fy * fy < 1 && y < 19;
        if (inFace) { if (on && rnd() < .05 + S.lvl * .22) cell(x, y, rnd() < .5 ? DIM : '#0a2224'); continue; }
        if (inHood || body) cell(x, y, (x + y) % 2 && (dx < -0.4 || y > 14) ? '#272333' : '#16141c');
      }
      // hood rim highlight
      for (let x = 7; x <= 16; x++) if (x !== 11 && x !== 12) cell(x, 1 + Math.abs(x - 11.5) * .55 | 0, '#3a3548');
      if (on) {
        blink = (tt % 4.2) < .14 ? 1 : 0;
        const ey = 8, ex = [8, 14];
        ex.forEach(x => { cell(x, ey, blink ? DIM : C1); cell(x + 1, ey, blink ? DIM : C1); if (!blink) { cell(x, ey + 1, DIM); cell(x + 1, ey + 1, DIM); } });
        // mouth: width from F2, height from F1 (voice -> mouth)
        const mw = Math.round(lerp(2, 9, clamp((S.f2 - 700) / 2000, 0, 1))), mh = Math.round(lerp(1, 4, clamp((S.f1 - 250) / 600, 0, 1)));
        const mx0 = Math.round(11.5 - mw / 2 + .5);
        for (let j = 0; j < mh; j++) for (let i = 0; i < mw; i++) cell(mx0 + i, 13 + j, j === 0 || j === mh - 1 ? C2 : '#7a1048');
        // F3 sparkle line under the chin
        const k = Math.round(lerp(2, 9, clamp((S.f3 - 2200) / 1400, 0, 1)));
        for (let i = 0; i < k; i++) cell(Math.round(11.5 - k / 2 + .5) + i, 18, i % 2 ? C1 : DIM);
      } else {
        av.fillStyle = '#4ff0e055'; av.fillRect(8 * C, 8 * C + 6, 3 * C, 4); av.fillRect(14 * C, 8 * C + 6, 3 * C, 4);
      }
      // ---------- XY pad ----------
      const PW = 640, PH = 500, m = 36;
      pd.fillStyle = INK; pd.fillRect(0, 0, PW, PH);
      pd.fillStyle = DIM;
      for (let gx = 0; gx <= 20; gx++) for (let gy = 0; gy <= 12; gy++) { const x = m + gx / 20 * (PW - 2 * m), y = m + gy / 12 * (PH - 2 * m - 20); pd.fillRect(x - 1.5, y - 1.5, 3, 3); }
      pd.fillStyle = C1; pd.font = '700 16px ' + MONO; pd.textAlign = 'center';
      for (let i = 0; i < 5; i++) { const x = m + i / 4 * (PW - 2 * m); pd.fillStyle = C1; pd.fillRect(x - 3, PH - 40, 6, 12); pd.fillText(VN[i], x, PH - 12); }
      const cy0 = m + 0.5 * (PH - 2 * m - 20); pd.fillStyle = '#ffffff44'; pd.fillRect(m, cy0 - 1, PW - 2 * m, 2);
      const vx = P.norm('vowel'), sy = P.norm('shift');
      const cx = m + vx * (PW - 2 * m), cy = m + (1 - sy) * (PH - 2 * m - 20);
      pd.fillStyle = C1; pd.textAlign = 'left'; pd.font = '700 14px ' + MONO; pd.fillText('+12', 4, m + 4); pd.fillText('-12', 4, PH - m - 14); pd.fillText('0', 12, cy0 + 5);
      pd.fillStyle = '#4ff0e066'; pd.fillRect(cx - 1, m - 10, 2, PH - 2 * m); pd.fillRect(m - 10, cy - 1, PW - 2 * m + 20, 2);
      // live vowelNow marker rides the bottom rail
      const vnx = m + clamp(S.vn, 0, 4) / 4 * (PW - 2 * m); pd.fillStyle = C2; pd.fillRect(vnx - 8, PH - 50, 16, 8);
      // pixel cursor: 3x3 block target
      pd.fillStyle = C2; pd.fillRect(cx - 12, cy - 12, 24, 24); pd.fillStyle = INK; pd.fillRect(cx - 6, cy - 6, 12, 12); pd.fillStyle = C1; pd.fillRect(cx - 3, cy - 3, 6, 6);
      pd.fillStyle = C2; pd.textAlign = 'right'; pd.fillText(vtxt(P.get('vowel')) + ' ' + st(P.get('shift')), PW - 10, 22);
      // ---------- formant LCD : pixel columns ----------
      l2.fillStyle = INK; l2.fillRect(0, 0, 640, 168);
      const cols = 64, fMin = 80, fMax = 6000, d = P.freqData('out', cols, fMin, fMax);
      for (let i = 0; i < cols; i++) {
        const f = fMin * Math.pow(fMax / fMin, (i + .5) / cols), e = clamp((env(S, P, f) + 34) / 50, 0, 1), a = d ? clamp((d[i] + 85) / 75, 0, 1) : 0;
        const rows = 12, hE = Math.round(e * rows), hA = Math.round(a * rows);
        for (let r = 0; r < rows; r++) { const x = 8 + i * 9.8, y = 160 - (r + 1) * 12; l2.fillStyle = r < hA ? C1 : r < hE ? DIM : '#0c2527'; l2.fillRect(x, y, 7, 9); }
      }
      [[S.f1, 'F1'], [S.f2, 'F2'], [S.f3, 'F3']].forEach(([f, n]) => { const x = 8 + lx(clamp(f, fMin, fMax), fMin, fMax) * 628; l2.fillStyle = C2; l2.fillRect(x - 1, 4, 3, 12); l2.font = '700 13px ' + MONO; l2.textAlign = 'center'; l2.fillText(n, x, 30); });
    });
  }

  /* =====================================================================
     FACE C — SHILL : yellow poster, red marquee, megaphone mouth
     ===================================================================== */
  

  Kit.register('formant', {
    fonts: 'family=Cinzel:wght@500;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Press+Start+2P&family=Anton',
    w: 960, h: 560,
    labels: { vowel: 'Vowel', vowelTo: 'Vowel to', sweep: 'Sweep', rate: 'Rate', shift: 'Shift', reso: 'Reso', mix: 'Mix', out: 'Out' },
    presets,
    faces: [
      undefined,
      { key: 'B', name: 'Anon', accent: '#ff2e88', w: 800, h: 520, build: buildB },
      undefined
    ].filter(Boolean)
  });
})();
