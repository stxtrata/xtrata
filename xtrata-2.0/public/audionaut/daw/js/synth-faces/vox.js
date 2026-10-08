import { Kit } from "./runtime.js";
/* vox — formant / vowel voice. Real params from synths-voices.js (jiVOX). Faces: Quorum / Cypherpunk / Gm */
(function () {
  const VN = ['A', 'E', 'I', 'O', 'U'];
  const VOW = [[800, 1150, 2900], [400, 1600, 2700], [270, 2140, 2950], [450, 800, 2830], [325, 700, 2530]];
  const VG = [[1, 0.5, 0.15], [1, 0.45, 0.2], [1, 0.35, 0.2], [1, 0.4, 0.15], [1, 0.3, 0.1]];
  const BW = [80, 90, 120];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const sec = v => (v < 1 ? Math.round(v * 1000) + ' ms' : v.toFixed(2) + ' s');
  const pct = v => Math.round(v * 100) + '%';
  const vf = v => { const i = Math.min(4, Math.round(v)); return VN[i] + (Math.abs(v - i) < 0.05 ? '' : (v < i ? '−' : '+')) + ' ' + v.toFixed(2); };
  function formants(x, shift, sharp) {
    x = clamp(x, 0, 4); const i = Math.min(3, Math.floor(x)), t = x - i;
    return [0, 1, 2].map(k => { const f = Math.exp(Math.log(VOW[i][k]) * (1 - t) + Math.log(VOW[i + 1][k]) * t) * shift; const g = VG[i][k] * (1 - t) + VG[i + 1][k] * t; return { f, g, q: Math.max(1, (f / BW[k]) * sharp) }; });
  }
  const fOf = (P, x) => formants(x, P.get('shift'), P.get('sharp'));

  const params = [
    { id: 'vowel', label: 'Vowel (A–U)', min: 0, max: 4, step: 0.01, def: 0, fmt: vf },
    { id: 'vowelTo', label: 'Morph To', min: 0, max: 4, step: 0.01, def: 3, fmt: vf },
    { id: 'morph', label: 'Morph Time', min: 0, max: 2, step: 0.01, def: 0, fmt: v => (v < 0.005 ? 'off' : sec(v)) },
    { id: 'shift', label: 'Voice Size', min: 0.7, max: 1.4, step: 0.01, def: 1, fmt: v => v.toFixed(2) + '×' },
    { id: 'sharp', label: 'Formant Sharpness', min: 0.5, max: 2, step: 0.01, def: 1, fmt: v => v.toFixed(2) + '×' },
    { id: 'bright', label: 'Source Brightness', min: 800, max: 9000, step: 50, def: 4500, fmt: v => Math.round(v) + ' Hz' },
    { id: 'choir', label: 'Choir Detune', min: 0, max: 40, step: 1, def: 12, fmt: v => Math.round(v) + ' ct' },
    { id: 'vibRate', label: 'Vibrato Rate', min: 0.5, max: 9, step: 0.1, def: 5.2, fmt: v => v.toFixed(1) + ' Hz' },
    { id: 'vibDepth', label: 'Vibrato Depth', min: 0, max: 60, step: 1, def: 14, fmt: v => Math.round(v) + ' ct' },
    { id: 'breath', label: 'Breath', min: 0, max: 1, step: 0.01, def: 0.12, fmt: pct },
    { id: 'attack', label: 'Attack', min: 0.01, max: 1.5, step: 0.01, def: 0.12, fmt: sec },
    { id: 'release', label: 'Release', min: 0.05, max: 3, step: 0.01, def: 0.6, fmt: sec },
    { id: 'level', label: 'Output Level', min: 0, max: 1.5, step: 0.01, def: 1, fmt: pct }
  ];
  const presets = [
    { name: 'Ahh Choir', values: {} },
    { name: 'Ooo Pad', values: { vowel: 4, morph: 0, shift: 0.92, choir: 20, breath: 0.2, attack: 0.5, release: 1.2, vibDepth: 10 } },
    { name: 'Wah Lead', values: { vowel: 0, vowelTo: 4, morph: 0.45, choir: 4, breath: 0.05, attack: 0.03, release: 0.25, vibDepth: 22, bright: 6500 } },
    { name: 'Whisper', values: { vowel: 1, choir: 0, breath: 0.95, bright: 2500, attack: 0.15, release: 0.5, vibDepth: 0 } },
    { name: 'Robot Vox', values: { vowel: 2, vowelTo: 1, morph: 0, shift: 1.1, sharp: 1.9, choir: 0, vibDepth: 0, breath: 0, attack: 0.01, release: 0.1, bright: 7000 } },
    { name: 'Yoy Talker', values: { vowel: 2, vowelTo: 3, morph: 0.3, choir: 6, vibDepth: 8, attack: 0.02, release: 0.2 } },
    { name: 'Cathedral', values: { vowel: 3, vowelTo: 0, morph: 1.2, shift: 0.85, sharp: 0.8, choir: 32, vibRate: 4.6, vibDepth: 18, breath: 0.15, attack: 0.9, release: 2.4, bright: 3200 } },
    { name: 'Child Choir', values: { vowel: 1, vowelTo: 2, morph: 0.6, shift: 1.35, sharp: 1.2, choir: 16, vibDepth: 8, breath: 0.1, attack: 0.2, release: 0.8, bright: 6000 } }
  ];

  const wire = (root, P) => {
    root.querySelectorAll('[data-p]').forEach(el => { const o = {}; if (el.dataset.abs) { o.abs = true; o.axis = el.dataset.abs; } if (el.dataset.ax) o.axis = el.dataset.ax; if (el.dataset.rng) o.range = +el.dataset.rng; P.bind(el, el.dataset.p, o); });
    root.querySelectorAll('[data-t]').forEach(el => P.text(el, el.dataset.t));
    root.querySelectorAll('[data-setv]').forEach(b => b.addEventListener('click', () => P.set('vowel', +b.dataset.setv)));
    P.sub('vowel', v => root.querySelectorAll('[data-setv]').forEach(b => b.classList.toggle('on', Math.round(v) === +b.dataset.setv)));
    const n = P.presets.length; let idx = -1;
    P.onPreset((i, nm) => {
      idx = i;
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = nm || '—'; });
      root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = String(Math.max(i, 0) + 1).padStart(2, '0') + '/' + String(n).padStart(2, '0'); });
      root.querySelectorAll('[data-pip]').forEach(e => e.classList.toggle('on', +e.dataset.pip === i));
    });
    root.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx - 1 + n) % n)));
    root.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx + 1) % n)));
    root.querySelectorAll('[data-pip]').forEach(b => b.addEventListener('click', () => P.loadPreset(+b.dataset.pip)));
    if (idx < 0 && n) P.loadPreset(0);
  };
  const LO = 80, HI = 8000;
  const fx = (f, W) => Math.log(f / LO) / Math.log(HI / LO) * W;
  function curve(fm, bright, W, H, base) { // response path of three formants x source low-pass
    let d = '';
    for (let i = 0; i <= 120; i++) {
      const f = LO * Math.pow(HI / LO, i / 120); let m = 0;
      fm.forEach(o => { const r = f / o.f - o.f / f; m += o.g / Math.sqrt(1 + o.q * o.q * r * r); });
      m *= 1 / Math.sqrt(1 + Math.pow(f / bright, 4));
      const y = base - Math.min(1, Math.pow(m / 1.3, 0.8)) * (H * 0.88);
      d += (i ? 'L' : 'M') + (i / 120 * W).toFixed(1) + ' ' + y.toFixed(1);
    }
    return d;
  }
  const pips = P => P.presets.map((p, i) => `<i data-pip="${i}" title="${p.name}"></i>`).join('');
  const dial = (id, lab, s, cls) => `<div class="dc ${cls || ''}"><div class="dl" data-p="${id}" style="--s:${s}px"></div><div class="dn">${lab}</div><div class="dv" data-t="${id}"></div></div>`;
  const pitchTxt = () => 'A3';

  /* =====================================================================
     FACE A — QUORUM (paper & ink)
     ===================================================================== */
  

  /* =====================================================================
     FACE B — CYPHERPUNK (magenta zine terminal)
     ===================================================================== */
  

  /* =====================================================================
     FACE C — GM (friendly sunrise)
     ===================================================================== */
  function buildGm(root, P) {
    const Y = '#ffd84d', BR = '#7a2e12';
    const knob = (id, lab, s) => `<div class="kc"><div class="kn" data-p="${id}" style="--s:${s}px"></div><div class="kl">${lab}</div><div class="kv" data-t="${id}"></div></div>`;
    const pill = (id, lab) => `<div class="pr"><span class="pl">${lab}</span><div class="pill" data-p="${id}" data-abs="x"></div><span class="pv" data-t="${id}"></span></div>`;
    root.innerHTML = `<style>
 .m{position:absolute;inset:0;background:linear-gradient(#ff9e6b 0,#ffc16b 22%,#ffe27a 44%,#fff3b0 58%,#ffd0a0 78%,#ffb98a 100%);font-family:'Fredoka','Nunito','Trebuchet MS',system-ui,sans-serif;color:${BR};font-weight:500}
 .m>*{position:absolute}
 .hd{left:20px;top:10px;width:920px;height:48px;display:flex;align-items:center;gap:14px}
 .lg{font-size:46px;font-weight:700;color:#fff;letter-spacing:-.02em;text-shadow:0 3px 0 ${BR},0 0 0 ${BR};-webkit-text-stroke:0;line-height:1}
 .sb{font-size:14px;opacity:.85}
 .pb{margin-left:auto;display:flex;align-items:center;gap:8px}.pb button{border:0;background:#fff;color:${BR};width:32px;height:32px;border-radius:50%;font:700 17px 'Fredoka',sans-serif;cursor:pointer;box-shadow:0 3px 0 ${BR}55}
 .pb .nm{min-width:150px;text-align:center;font-size:20px;font-weight:700;background:#ffffffaa;border-radius:20px;padding:3px 10px}.pb .ix{font-size:11px}
 .bb{background:#fffaf0;border-radius:30px;box-shadow:0 4px 0 ${BR}33;padding:12px 16px;border:3px solid #fff}
 .bb:after{content:"";position:absolute;bottom:-14px;width:22px;height:22px;background:#fffaf0;transform:rotate(45deg);border-right:3px solid #fff;border-bottom:3px solid #fff;border-radius:0 0 6px 0}
 .bb.l:after{right:46px}.bb.r:after{left:46px}.bb.n:after{display:none}
 .bt{font-size:15px;font-weight:700;margin-bottom:6px}.bt small{font-weight:400;opacity:.7;font-size:12px}
 .pr{display:grid;grid-template-columns:58px 1fr 62px;align-items:center;gap:6px;height:34px;font-size:13px}.pv{font-weight:700;text-align:right;font-size:13px;white-space:nowrap}
 .pill{position:relative;height:18px;border-radius:12px;background:#ffe9a6;box-shadow:inset 0 2px 3px #0002;cursor:ew-resize}
 .pill:before{content:"";position:absolute;left:0;top:0;bottom:0;width:calc(2px + var(--v)*(100% - 2px));border-radius:12px;background:linear-gradient(90deg,#ffb347,#ff7a45)}
 .pill:after{content:"";position:absolute;top:-3px;width:24px;height:24px;border-radius:50%;left:calc(var(--v)*(100% - 24px));background:#fff;border:3px solid ${BR};box-shadow:0 2px 0 ${BR}66}
 .kr{display:flex;justify-content:space-around;margin-top:2px}
 .kc{display:flex;flex-direction:column;align-items:center}.kl{font-size:12px;margin-top:3px}.kv{font-size:12px;font-weight:700;white-space:nowrap}
 .kn{position:relative;width:var(--s,54px);height:var(--s,54px);border-radius:50%;cursor:ns-resize;background:radial-gradient(circle at 35% 28%,#ffe9a6,#ffb347 55%,#ff7a45);box-shadow:0 4px 0 ${BR}66,inset 0 -3px 5px #ff7a4588}
 .kn:after{content:"";position:absolute;left:calc(50% - 3.5px);top:6px;width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px ${BR};transform-origin:50% calc(var(--s)/2 - 6px + 3.5px);transform:rotate(calc(-135deg + var(--v)*270deg))}
 .kn:before{content:"";position:absolute;inset:-5px;border-radius:50%;background:conic-gradient(from 225deg,${BR}55 0,${BR}55 calc(var(--v)*270deg),transparent calc(var(--v)*270deg));-webkit-mask:radial-gradient(circle,transparent 62%,#000 64%);mask:radial-gradient(circle,transparent 62%,#000 64%);z-index:-1}
 .kn.drag{transform:scale(1.05)}
 .lt{display:flex;gap:6px;margin:2px 0 0}.lt button{width:34px;height:34px;border-radius:50%;border:3px solid #fff;background:#ffe9a6;color:${BR};font:700 17px 'Fredoka',sans-serif;cursor:pointer;box-shadow:0 3px 0 ${BR}44}.lt button.on{background:#ff7a45;color:#fff;border-color:${BR}}
 .chips{left:20px;top:442px;width:920px;display:flex;gap:6px;justify-content:center}.chips i{font-style:normal;background:#ffffffbb;border-radius:16px;padding:3px 11px;font-size:13px;cursor:pointer;box-shadow:0 2px 0 ${BR}33}.chips i.on{background:${BR};color:#fff}
 .kbw{left:20px;top:476px;width:920px;height:72px;border-radius:0 0 22px 22px;background:${BR};padding:4px 6px 0}
 .kbw .kb-w{background:linear-gradient(#fffdf5,#fff1c4);border:1px solid #d9a44a;border-top:0;border-radius:0 0 12px 12px}.kbw .kb-w.on{background:linear-gradient(#ffe27a,#ffb347)}
 .kbw .kb-b{background:#4a1a0a;border:0;border-radius:0 0 8px 8px}.kbw .kb-b.on{background:#ff7a45}
 .fb{width:104px;height:62px;border-radius:26px;background:#fff;border:3px solid #fff;box-shadow:0 4px 0 ${BR}33;text-align:center;padding-top:7px}.fb b{display:block;font-size:11px;color:#ff7a45}.fb span{font-size:20px;font-weight:700}.fb:after{content:"";position:absolute;bottom:-9px;left:40px;width:14px;height:14px;background:#fff;transform:rotate(45deg)}
 #sun{left:330px;top:58px}
 canvas{display:block;border-radius:12px}
 </style><div class="m">
 <div class="hd"><span class="lg">gm</span><span class="sb">jiVOX · good morning, voices ☀</span>
  <div class="pb"><button data-prev>‹</button><div class="nm" data-pname></div><span class="ix"><span data-pidx></span></span><button data-next>›</button></div></div>
 <svg id="sun" width="300" height="372" viewBox="0 0 300 372"></svg>
 <div class="bb l" style="left:20px;top:64px;width:300px;height:204px"><div class="bt">gm! pick a vowel <small>tap or slide</small></div>
   <div class="lt">${VN.map((n, i) => `<button data-setv="${i}">${n}</button>`).join('')}</div>
   ${pill('vowel', 'vowel')}${pill('vowelTo', 'morph to')}${pill('morph', 'how long')}</div>
 <div class="bb n" style="left:20px;top:296px;width:300px;height:132px"><div class="bt">your voice <small>who is waking up</small></div><div class="kr">${knob('shift', 'size', 56)}${knob('sharp', 'sharpness', 56)}${knob('bright', 'brightness', 56)}</div></div>
 <div class="bb r" style="left:640px;top:64px;width:300px;height:172px"><div class="bt">the whole choir <small>gm gm gm</small></div><div class="kr">${knob('choir', 'choir', 50)}${knob('vibRate', 'wobble', 50)}${knob('vibDepth', 'wobble amt', 50)}${knob('breath', 'breath', 50)}</div></div>
 <div class="bb n" style="left:640px;top:262px;width:300px;height:166px"><div class="bt">wake-up routine</div><div class="kr">${knob('attack', 'rise', 50)}${knob('release', 'fade', 50)}${knob('level', 'volume', 50)}</div><canvas id="sc" width="536" height="56" style="width:268px;height:28px;margin-top:8px;background:#fff1c4"></canvas></div>
 <div class="chips">${P.presets.map((p, i) => `<i data-pip="${i}">${p.name}</i>`).join('')}</div>
 <div class="kbw" id="kb"></div></div>`;
    wire(root, P);
    const $ = s => root.querySelector(s);
    const sun = $('#sun'); const CX = 150, CY = 150;
    let rays = ''; for (let i = 0; i < 16; i++) { const a = i * 22.5; rays += `<rect class="ray" x="-7" y="-148" width="14" height="${i % 2 ? 26 : 38}" rx="7" fill="#fff" fill-opacity=".85" transform="rotate(${a})"/>`; }
    sun.innerHTML = `<defs><radialGradient id="sg" cx="40%" cy="32%" r="80%"><stop offset="0" stop-color="#fffbd0"/><stop offset=".5" stop-color="${Y}"/><stop offset="1" stop-color="#ffab3a"/></radialGradient></defs>
      <g id="rays" transform="translate(${CX} ${CY})">${rays}</g>
      <circle cx="${CX}" cy="${CY}" r="104" fill="url(#sg)" stroke="#fff" stroke-width="5"/>
      <ellipse cx="86" cy="164" rx="16" ry="10" fill="#ff7a45" fill-opacity=".45"/><ellipse cx="214" cy="164" rx="16" ry="10" fill="#ff7a45" fill-opacity=".45"/>
      <path d="M92 124q12 -18 24 0" fill="none" stroke="${BR}" stroke-width="6" stroke-linecap="round"/><path d="M184 124q12 -18 24 0" fill="none" stroke="${BR}" stroke-width="6" stroke-linecap="round"/>
      <g id="mouth"><ellipse id="mo" cx="${CX}" cy="190" rx="23" ry="17" fill="${BR}" stroke="${BR}" stroke-width="5"/><ellipse id="tg" cx="${CX}" cy="198" rx="12" ry="6" fill="#ff7a8a"/></g>
      <g id="gmb" transform="translate(196 18)"><path d="M0 0h84a14 14 0 0 1 14 14v22a14 14 0 0 1-14 14H30l-14 14 2-14H0a14 14 0 0 1-14-14V14A14 14 0 0 1 0 0z" fill="#fff" stroke="${BR}" stroke-width="3"/><text x="42" y="36" text-anchor="middle" font-size="30" font-weight="700" fill="#ff7a45" font-family="Fredoka,sans-serif">gm</text></g>
      ${[0, 1, 2].map(k => `<g transform="translate(${6 + k * 98} 292)"><rect width="88" height="52" rx="22" fill="#fff" stroke="${BR}" stroke-width="2.5"/><path d="M${30 + k * 0} 52l-6 12 16 -12z" fill="#fff" stroke="${BR}" stroke-width="2.5"/><rect x="26" y="49" width="20" height="5" fill="#fff"/><text x="44" y="19" text-anchor="middle" font-size="11" font-weight="700" fill="#ff7a45" font-family="Fredoka,sans-serif">F${k + 1}</text><text id="fq${k}" x="44" y="40" text-anchor="middle" font-size="19" font-weight="700" fill="${BR}" font-family="Fredoka,sans-serif"></text></g>`).join('')}
      <text x="150" y="364" text-anchor="middle" font-size="12" fill="${BR}" font-family="Fredoka,sans-serif" opacity=".75">the sun says: <tspan id="say"></tspan></text>`;
    const MOUTH = [[26, 22, 0.9], [30, 13, 0.7], [34, 5, 0.3], [14, 20, 0.8], [8, 8, 0.5]]; // rx, ry, tongue per vowel A E I O U
    const mix = v => { v = clamp(v, 0, 4); const i = Math.min(3, Math.floor(v)), t = v - i; return MOUTH[i].map((x, k) => x * (1 - t) + MOUTH[i + 1][k] * t); };
    let phase = 0;
    const SAY = ['aaah, gm!', 'eh? gm!', 'iii, gm gm', 'ooh, gm', 'uuu... gm'];
    const upd = () => {
      const m = mix(P.get('vowel')); const mo = $('#mo'), tg = $('#tg');
      mo.setAttribute('rx', m[0]); mo.setAttribute('ry', m[1]); tg.setAttribute('rx', m[0] * 0.55); tg.setAttribute('ry', m[1] * 0.4 + 0.5); tg.setAttribute('cy', 190 + m[1] * 0.55); tg.setAttribute('opacity', m[2]);
      fOf(P, P.get('vowel')).forEach((o, k) => { $('#fq' + k).textContent = Math.round(o.f); });
      $('#say').textContent = SAY[Math.round(P.get('vowel'))];
    };
    P.subAll(upd);
    const rg = $('#rays'), gb = $('#gmb'); let pulse = 0;
    P.onNote(ev => { if (ev.type === 'on') pulse = 1; });
    P.raf(t => { phase = t / 1000; const lv = P.level(); pulse *= 0.93; rg.setAttribute('transform', `translate(${CX} ${CY}) rotate(${phase * 6}) scale(${1 + lv * 0.12})`); gb.setAttribute('transform', `translate(196 ${18 - pulse * 8}) scale(${1 + pulse * 0.1})`); });
    P.scope($('#sc'), { color: '#ff7a45', width: 3, gain: 2.4 });
    P.keyboard($('#kb'), { from: 48, octaves: 3 });
  }

  Kit.register('vox', {
    fonts: 'family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500;1,9..144,700&family=Share+Tech+Mono&family=Fredoka:wght@500;700',
    w: 960, h: 560, params, presets,
    faces: [
      undefined,
      undefined,
      { key: 'C', name: 'Gm', accent: '#ffd84d', build: buildGm }
    ].filter(Boolean)
  });
})();
