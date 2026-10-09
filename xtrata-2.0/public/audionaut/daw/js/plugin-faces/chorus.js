import { Kit } from "./runtime.js";
/* chorus — Chorus. Faces: A Fullnode (replicating peer network) / B Replica (misregistered photocopy stack) / C Airdrop (parachutes in a stereo sky) */
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const VB = [1, 1.12, 0.88];            // per-voice base-delay factors (DSP_NOTES_B)
  const TAU = Math.PI * 2;
  const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const MONO = "ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace";
  const hz = v => v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 1 : 2).replace(/0$/, '') + ' kHz' : Math.round(v) + ' Hz';

  const presets = [
    { name: 'Init', values: {} },
    { name: 'Silk Ensemble', values: { rate: 0.45, depth: 6, mix: 0.55, voices: '3', base: 22, width: 1, feedback: 0, tone: 150 } },
    { name: 'Slow Shimmer', values: { rate: 0.18, depth: 9, mix: 0.5, voices: '2', base: 26, width: 0.8, feedback: 0.15, tone: 400 } },
    { name: 'Vintage Double', values: { rate: 1.2, depth: 3, mix: 0.45, voices: '1', base: 14, width: 0.3, feedback: 0, tone: 100 } },
    { name: 'Wide Pad', values: { rate: 0.3, depth: 8, mix: 0.6, voices: '3', base: 28, width: 1, feedback: 0.25, tone: 250 } },
    { name: 'Thin Glass', values: { rate: 2.4, depth: 2, mix: 0.4, voices: '2', base: 8, width: 0.6, feedback: 0.4, tone: 1800 } },
    { name: 'Seasick', values: { rate: 5.2, depth: 11, mix: 0.7, voices: '3', base: 12, width: 1, feedback: 0.35, tone: 100 } }
  ];

  /* ---------- shared helpers ---------- */
  function wire(root, P) {
    root.querySelectorAll('[data-p]').forEach(el => {
      const o = {};
      if (el.dataset.abs) { o.abs = true; o.axis = el.dataset.abs; }
      if (el.dataset.ax) o.axis = el.dataset.ax;
      if (el.dataset.rng) o.range = +el.dataset.rng;
      P.bind(el, el.dataset.p, o);
    });
    root.querySelectorAll('[data-t]').forEach(el => P.text(el, el.dataset.t));
    root.querySelectorAll('[data-byp]').forEach(el => P.bind(el, '__bypass'));
    root.querySelectorAll('[data-vo]').forEach(el => el.addEventListener('click', () => P.set('voices', +el.dataset.vo)));
    P.sub('voices', i => root.querySelectorAll('[data-vo]').forEach(el => el.classList.toggle('on', +el.dataset.vo === i)));
    const n = P.presets.length; let idx = -1;
    P.onPreset((i, nm) => {
      idx = i;
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = nm || 'Custom'; });
      root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = i < 0 ? '--' : String(i + 1).padStart(2, '0'); });
      root.querySelectorAll('[data-pl]').forEach(e => e.classList.toggle('on', +e.dataset.pl === i));
    });
    root.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx - 1 + n) % n)));
    root.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx + 1 + n) % n)));
    root.querySelectorAll('[data-pl]').forEach(b => b.addEventListener('click', () => P.loadPreset(+b.dataset.pl)));
  }
  const nvOf = P => +P.real('voices') || 1;
  function arc(r, c, a0, a1) {
    const pt = a => [(c + r * Math.sin(a * Math.PI / 180)).toFixed(2), (c - r * Math.cos(a * Math.PI / 180)).toFixed(2)];
    const p0 = pt(a0), p1 = pt(a1);
    return 'M' + p0.join(' ') + ' A' + r + ' ' + r + ' 0 1 1 ' + p1.join(' ');
  }
  /* per-frame LFO history: real meter().lfo, with a synthetic fallback only if the meter is silent */
  function hist(P) {
    const H = { buf: [], cur: [0, 0, 0], t: 0, synth: false };
    let last = 0, phi = 0, zt = 0;
    P.raf(ts => {
      const dt = clamp((ts - last) / 1000 || 0.016, 0.001, 0.1); last = ts; H.t += dt;
      const m = P.meter() || {}; const l = m.lfo; let v = [0, 0, 0];
      if (l) for (let k = 0; k < 3; k++) v[k] = clamp(+l[k] || 0, -1, 1);
      if (Math.abs(v[0]) < 1e-5) zt += dt; else zt = 0;
      if (zt > 0.6) {
        const n = nvOf(P); phi += P.get('rate') * TAU * dt;
        const ph = n === 1 ? [0] : n === 2 ? [0, Math.PI] : [0, TAU / 3, 2 * TAU / 3];
        v = [0, 0, 0]; ph.forEach((p, k) => { v[k] = Math.sin(phi + p); }); H.synth = true;
      } else H.synth = false;
      H.cur = v; H.buf.push({ t: H.t, v });
      while (H.buf.length && H.t - H.buf[0].t > 12) H.buf.shift();
    });
    H.at = (k, back) => {
      const b = H.buf; if (!b.length) return 0; const tt = H.t - back;
      if (tt <= b[0].t) return b[0].v[k];
      for (let i = b.length - 1; i > 0; i--) if (b[i - 1].t <= tt) { const a = b[i - 1], c = b[i]; return lerp(a.v[k], c.v[k], (tt - a.t) / ((c.t - a.t) || 1)); }
      return b[0].v[k];
    };
    /* right channel value of voice k: the same LFO, width x 180 degrees later */
    H.right = (k, w, rate) => H.at(k, (w * 0.5) / Math.max(0.05, rate));
    return H;
  }
  function levels(P) {
    const L = { i: 0, o: 0 }; let last = 0;
    P.raf(ts => {
      const dt = clamp((ts - last) / 1000 || 0.016, 0.001, 0.1); last = ts;
      const m = P.meter() || {};
      const i = clamp((P.toDb(m.inPeak || 0) + 60) / 60, 0, 1), o = clamp((P.toDb(m.outPeak || 0) + 60) / 60, 0, 1);
      L.i = Math.max(i, L.i - dt * 1.4); L.o = Math.max(o, L.o - dt * 1.4);
    });
    return L;
  }
  const dly = (P, k, l) => Math.max(0, P.get('base') * VB[k] + P.get('depth') * l);   // ms, as the DSP does
  function crisp(cv, w, h) { cv.width = w * 2; cv.height = h * 2; cv.style.width = w + 'px'; cv.style.height = h + 'px'; const g = cv.getContext('2d'); g.setTransform(2, 0, 0, 2, 0, 0); return g; }
  function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

  /* =====================================================================================
     A  FULLNODE — a peer network. Voices are nodes that sway with the LFO and replicate.
     ===================================================================================== */
  

  /* =====================================================================================
     B  REPLICA — a copier light table: the real input trace, copied N times, misregistered.
     ===================================================================================== */
  const faceB = {
    key: 'B', name: 'Replica', accent: '#e4572e', w: 820, h: 520,
    build(root, P) {
      const CMY = ['#00a6d6', '#e6007e', '#f2c800'];
      const fader = (id, label, cap) => `<div class="fc"><div class="fd" data-p="${id}" data-abs="y"><i class="tk"></i><i class="fl"></i><i class="cp"></i></div><b data-t="${id}"></b><span>${label}</span><em>${cap}</em></div>`;
      root.innerHTML = `<style>
        *{box-sizing:border-box;user-select:none;-webkit-user-select:none}
        .f{position:absolute;inset:0;overflow:hidden;background:#e9e4d6;color:#1c1b19;font-family:'Barlow Condensed','Arial Narrow',Impact,${SANS}}
        .f::before{content:'';position:absolute;inset:0;opacity:.5;background-image:repeating-linear-gradient(0deg,#0000 0 3px,#00000008 3px 4px)}
        .top{position:absolute;left:0;right:0;top:0;height:68px;background:#f6f3ea;border-bottom:3px solid #1c1b19;display:flex;align-items:center;padding:0 18px;gap:14px}
        .wm{font-size:38px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;line-height:1;position:relative;color:#1c1b19;text-shadow:3px 2px 0 #00a6d6aa,-3px -2px 0 #e6007eaa}
        .wm-s{font:400 10px 'Special Elite',${MONO};letter-spacing:.05em;color:#5a564c;text-transform:none;display:block;margin-top:4px;text-shadow:none}
        .mem{display:flex;gap:4px;margin-left:2px}
        .mem button{all:unset;cursor:pointer;width:25px;height:27px;text-align:center;line-height:24px;font:700 15px 'Barlow Condensed',${SANS};background:#fffdf6;border:2px solid #1c1b19;border-radius:4px;box-shadow:0 3px 0 #1c1b19}
        .mem button.on{background:#1c1b19;color:#f6f3ea;box-shadow:0 1px 0 #1c1b19;transform:translateY(2px)}
        .lcd{margin-left:6px;min-width:132px;height:34px;border-radius:4px;border:2px solid #1c1b19;background:#cbd8a8;display:flex;align-items:center;justify-content:center;font:400 14px 'Special Elite',${MONO};color:#26301a;letter-spacing:.04em;box-shadow:inset 0 0 8px #0003}
        .go{all:unset;cursor:pointer;margin-left:auto;display:flex;align-items:center;gap:9px;background:#e4572e;color:#fffdf6;font:700 16px 'Barlow Condensed',${SANS};letter-spacing:.1em;text-transform:uppercase;padding:6px 12px;border-radius:5px;border:2px solid #1c1b19;box-shadow:0 4px 0 #1c1b19}
        .go::before{content:'';width:12px;height:12px;border-radius:50%;background:#7a2d17;border:2px solid #1c1b19}
        .go.on{background:#4f9d3a}.go.on::before{background:#d6ff9c;box-shadow:0 0 8px #d6ff9c}
        .go:active{transform:translateY(3px);box-shadow:0 1px 0 #1c1b19}
        .tbl{position:absolute;left:22px;top:84px;width:560px;height:268px;border:3px solid #1c1b19;border-radius:6px;background:#bfb9a6;overflow:hidden;box-shadow:inset 0 0 22px #0004}
        .rt{position:absolute;left:600px;top:84px;width:198px;height:268px;display:flex;flex-direction:column;gap:8px}
        .panel{background:#f6f3ea;border:3px solid #1c1b19;border-radius:6px;padding:6px 10px}
        .panel h4{margin:0 0 4px;font:700 13px 'Barlow Condensed',${SANS};letter-spacing:.14em;text-transform:uppercase;display:flex;justify-content:space-between}
        .cp-r{display:grid;grid-template-columns:20px 1fr auto;gap:2px 7px;font:400 12px 'Special Elite',${MONO};align-items:center;margin-bottom:1px}
        .cp-r i{width:14px;height:14px;border:2px solid #1c1b19;border-radius:2px}
        .cp-r.off{opacity:.22}
        .keys{display:flex;gap:7px}
        .keys button{all:unset;cursor:pointer;flex:1;height:36px;text-align:center;line-height:32px;font:700 22px 'Barlow Condensed',${SANS};background:#fffdf6;border:2px solid #1c1b19;border-radius:5px;box-shadow:0 4px 0 #1c1b19}
        .keys button.on{background:#1c1b19;color:#fffdf6;box-shadow:0 1px 0 #1c1b19;transform:translateY(3px)}
        .toner{display:grid;grid-template-columns:30px 1fr;gap:5px 8px;align-items:center;font:700 11px 'Barlow Condensed',${SANS};letter-spacing:.12em}
        .toner div{height:9px;border:2px solid #1c1b19;background:#fffdf6}.toner div i{display:block;height:100%;width:0;background:#1c1b19}
        .bay{position:absolute;left:22px;right:22px;top:364px;height:142px;background:#f6f3ea;border:3px solid #1c1b19;border-radius:6px;display:grid;grid-template-columns:repeat(7,1fr);padding:8px 4px 0}
        .fc{text-align:center;position:relative}
        .fd{position:relative;width:34px;height:60px;margin:2px auto 0;cursor:ns-resize;touch-action:none}
        .fd .tk{position:absolute;left:15px;top:0;bottom:0;width:4px;background:#1c1b19;border-radius:2px}
        .fd .fl{position:absolute;left:15px;bottom:0;width:4px;height:calc(var(--v,0)*100%);background:#e4572e;border-radius:2px}
        .fd .cp{position:absolute;left:1px;width:32px;height:16px;bottom:calc(var(--v,0)*(100% - 16px));background:#fffdf6;border:2px solid #1c1b19;border-radius:3px;box-shadow:0 2px 0 #1c1b19}
        .fd .cp::after{content:'';position:absolute;left:5px;right:5px;top:5px;height:2px;background:#1c1b19}
        .fd.drag .cp{background:#e4572e}
        .fc b{display:block;font:400 13px 'Special Elite',${MONO};margin-top:4px;color:#1c1b19}
        .fc span{display:block;font:700 15px 'Barlow Condensed',${SANS};letter-spacing:.06em;white-space:nowrap;text-transform:uppercase;line-height:1}
        .fc em{display:block;font:normal 400 9.5px 'Special Elite',${MONO};color:#6a6657;margin-top:2px}
        canvas{display:block}
        </style>
        <div class="f">
          <div class="top">
            <div class="wm">Replica<span class="wm-s">copy of a copy of a copy</span></div>
            <div class="mem">${P.presets.map((p, i) => `<button data-pl="${i}" title="${p.name}">${i + 1}</button>`).join('')}</div>
            <div class="lcd" data-pname></div>
            <button class="go" data-byp id="byp">Standby</button>
          </div>
          <canvas class="tbl" id="tbl"></canvas>
          <div class="rt">
            <div class="panel"><h4><span>Copy job</span><span id="jb">0 pages</span></h4>
              ${[0, 1, 2].map(k => `<div class="cp-r" id="cr${k}"><i style="background:${CMY[k]}"></i><span>copy ${k + 1}</span><span id="cd${k}">-</span></div>`).join('')}
              <div class="cp-r"><i style="background:#1c1b19"></i><span>original</span><span>0.0 ms</span></div>
            </div>
            <div class="panel"><h4><span>Copies</span><span data-t="voices"></span></h4>
              <div class="keys">${[0, 1, 2].map(i => `<button data-vo="${i}">${i + 1}</button>`).join('')}</div></div>
            <div class="panel" style="padding:8px 11px"><div class="toner"><span>IN</span><div><i id="mi"></i></div><span>OUT</span><div><i id="mo"></i></div></div></div>
          </div>
          <div class="bay">
            ${fader('rate', 'Speed', 'sheets / sec')}${fader('depth', 'Misregister', 'wobble depth')}${fader('base', 'Offset', 'base delay')}${fader('width', 'Spread', 'left | right tray')}
            ${fader('feedback', 'Gen. loss', 'copy the copy')}${fader('tone', 'Low-cut', 'toner thinning')}${fader('mix', 'Copy/Orig', 'mix')}
          </div>
        </div>`;
      wire(root, P);
      const $ = s => root.querySelector(s);
      P.sub('__bypass', on => { $('#byp').textContent = on ? 'Copying' : 'Standby'; });
      const cv = $('#tbl'), CW = 560, CH = 268, g = crisp(cv, CW, CH);
      const Hh = hist(P), L = levels(P);
      const PW = 330, PH = 210;       // sheet size
      function trace(color, ox, oy, rot, alpha, lw) {
        const d = P.timeData('in'); if (!d || !d.length) return;
        g.save(); g.translate(CW / 2 + ox, CH / 2 + oy); g.rotate(rot);
        g.beginPath(); g.rect(-PW / 2 + 10, -PH / 2 + 28, PW - 20, PH - 56); g.clip();
        g.strokeStyle = color; g.globalAlpha = alpha; g.lineWidth = lw; g.lineJoin = 'round'; g.beginPath();
        const n = 150, step = Math.floor(d.length / n);
        for (let i = 0; i < n; i++) { let m = 0; for (let j = 0; j < step; j += 3) { const v = d[i * step + j]; if (Math.abs(v) > Math.abs(m)) m = v; } const x = -PW / 2 + 12 + i / (n - 1) * (PW - 24), y = -clamp(m * 2.2, -1, 1) * (PH / 2 - 36); if (!i) g.moveTo(x, y); else g.lineTo(x, y); }
        g.stroke(); g.restore(); g.globalAlpha = 1;
      }
      function sheet(ox, oy, rot, alpha, tint) {
        g.save(); g.translate(CW / 2 + ox, CH / 2 + oy); g.rotate(rot);
        g.shadowColor = '#0006'; g.shadowBlur = 10; g.shadowOffsetY = 3; g.fillStyle = 'rgba(255,255,250,' + alpha + ')'; g.fillRect(-PW / 2, -PH / 2, PW, PH); g.shadowBlur = 0; g.shadowOffsetY = 0;
        g.strokeStyle = tint; g.globalAlpha = 0.5; g.lineWidth = 1; g.strokeRect(-PW / 2 + 0.5, -PH / 2 + 0.5, PW - 1, PH - 1); g.globalAlpha = 1;
        g.fillStyle = '#7d7968'; g.font = '400 9px "Special Elite",' + MONO; g.textAlign = 'left'; g.fillText('SHEET', -PW / 2 + 12, -PH / 2 + 17); g.restore();
      }
      P.raf(() => {
        const nv = nvOf(P), w = P.get('width'), fb = P.get('feedback'), mx = P.get('mix'), rate = P.get('rate'), tone = P.get('tone');
        g.clearRect(0, 0, CW, CH);
        g.fillStyle = '#bfb9a6'; g.fillRect(0, 0, CW, CH);
        g.fillStyle = '#b5af9b'; for (let x = 0; x < CW; x += 28) g.fillRect(x, 0, 1, CH);
        g.fillStyle = '#7d7968'; g.font = '700 11px "Barlow Condensed",' + SANS; g.textAlign = 'left'; g.fillText('PLATEN  /  LIVE INPUT TRACE', 10, 16);
        // sheets stack (copies beneath, drawn back to front)
        const toner = 0.35 + 0.65 * Math.min(1, mx * 1.4);      // copy density
        const thin = 1 - 0.7 * (Math.log(tone / 100) / Math.log(80));   // low-cut thins the toner
        const copies = [];
        for (let k = nv - 1; k >= 0; k--) {
          const lv = Hh.cur[k], rv = Hh.right(k, w, rate);
          const dL = dly(P, k, lv), dR = dly(P, k, rv);
          copies.push({ k, dL, dR, lv, rv });
          $('#cd' + k).textContent = dL.toFixed(1) + ' ms';
        }
        for (let k = 0; k < 3; k++) $('#cr' + k).classList.toggle('off', k >= nv);
        copies.forEach(c => {
          const sx = (c.dL - 12) * 1.6, sy = 6 + c.k * 5;
          sheet(sx * 0.6 - 30, sy - 12, c.lv * 0.025, 0.42, CMY[c.k]);
        });
        g.globalCompositeOperation = 'multiply';
        copies.forEach(c => {
          const px = 2.2;
          // generations (feedback): fading re-copies further along
          if (fb > 0.01) for (let n = 3; n >= 1; n--) {
            const gl = Math.pow(fb, n);
            trace(CMY[c.k], (c.dL * n + 2.67 * (n - 1)) * px - 40 - 12 * 2.2 + 40, -4 + c.k * 5, c.lv * 0.025, gl * 0.8 * toner * thin, 1.2);
          }
          trace(CMY[c.k], (c.dL - 12) * px * 1.0 - 30, -12 + c.k * 5 - w * 14, c.lv * 0.025, 0.95 * toner * thin, 1.7);
          if (w > 0.02) trace(CMY[c.k], (c.dR - 12) * px * 1.0 - 30, -12 + c.k * 5 + w * 14, c.rv * 0.025, 0.95 * toner * thin, 1.7);
        });
        g.globalCompositeOperation = 'source-over';
        // the original on top: tracing paper over the stack
        sheet(0, 0, 0, 0.3 + 0.3 * (1 - mx), '#1c1b19');
        trace('#1c1b19', -30 + 0, -12, 0, 0.55 + 0.4 * (1 - mx), 1.8);
        g.fillStyle = '#1c1b19'; g.font = '700 10px "Barlow Condensed",' + SANS; g.textAlign = 'left'; g.fillText('ORIGINAL', CW / 2 - PW / 2 + 16, CH / 2 + PH / 2 - 8);
        g.textAlign = 'right'; g.fillStyle = '#5a564c'; g.font = '400 10px "Special Elite",' + MONO;
        g.fillText(nv + (nv > 1 ? ' copies' : ' copy') + (w > 0.02 ? ' x L|R' : '') + (fb > 0.01 ? ' + ' + Math.min(3, Math.ceil(fb * 5)) + ' gen' : ''), CW - 12, 16);
        $('#jb').textContent = nv * (w > 0.02 ? 2 : 1) + ' pages';
        $('#mi').style.width = (L.i * 100) + '%'; $('#mo').style.width = (L.o * 100) + '%';
      });
    }
  };

  /* =====================================================================================
     C  AIRDROP — parachutes in a stereo sky: altitude = delay, sway = LFO, spread = width.
     ===================================================================================== */
  

  Kit.register('chorus', {
    fonts: 'family=Sora:wght@400;600;700&family=Barlow+Condensed:wght@500;700&family=Special+Elite&family=Nunito:wght@700;800',
    w: 960, h: 560, presets, faces: [undefined, faceB, undefined].filter(Boolean)
  });
})();
