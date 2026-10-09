import { Kit } from "./runtime.js";
/* fm4 — 4-operator FM. Real params from synths-voices.js (jiFM4). Faces: Merkle / Nonce / Coinbase */
(function () {
  const ALG = ['stack', 'twin', 'fork', 'organ'];
  const MOD = [[[1], [2], [3], []], [[1], [], [3], []], [[1, 2, 3], [], [], []], [[], [], [], []]]; // MOD[a][k] = ops modulating op k
  const CAR = [[0], [0, 2], [0], [0, 1, 2, 3]];
  const A = n => ALG.indexOf(n);
  const sec = v => (v < 1 ? Math.round(v * 1000) + ' ms' : v.toFixed(2) + ' s');
  const pct = v => Math.round(v * 100) + '%';
  const rat = v => v.toFixed(2) + '×';
  const params = [{ id: 'algo', label: 'Algorithm', options: ALG, def: 1 }, { id: 'fb', label: 'Op4 Feedback', min: 0, max: 1, step: 0.01, def: 0.05, fmt: pct }];
  [1, 2, 3, 4].forEach(n => {
    const d = [[1, 0.85, 2.2], [14, 0.22, 0.15], [1, 0.55, 1.4], [1, 0.35, 0.9]][n - 1];
    params.push({ id: 'r' + n, label: 'Op' + n + ' Ratio', min: 0.25, max: 16, step: 0.25, def: d[0], fmt: rat });
    params.push({ id: 'l' + n, label: 'Op' + n + ' Level', min: 0, max: 1, step: 0.01, def: d[1], fmt: pct });
    params.push({ id: 'd' + n, label: 'Op' + n + ' Decay', min: 0.05, max: 4, step: 0.01, def: d[2], fmt: sec });
  });
  params.push({ id: 'sustain', label: 'Sustain', min: 0, max: 1, step: 0.01, def: 0.2, fmt: pct },
    { id: 'attack', label: 'Attack', min: 0.002, max: 0.5, step: 0.002, def: 0.003, fmt: sec },
    { id: 'release', label: 'Release', min: 0.02, max: 2.5, step: 0.01, def: 0.35, fmt: sec },
    { id: 'vel', label: 'Velocity→Index', min: 0, max: 1, step: 0.01, def: 0.6, fmt: pct },
    { id: 'level', label: 'Output Level', min: 0, max: 1.5, step: 0.01, def: 1, fmt: pct });

  const presets = [
    { name: 'Glass Keys', values: {} },
    { name: 'Tubular Bell', values: { algo: A('twin'), fb: 0, r1: 1, l1: 0.8, d1: 3.5, r2: 3.5, l2: 0.55, d2: 2.5, r3: 2.75, l3: 0.45, d3: 2.4, r4: 5.5, l4: 0.3, d4: 1.2, sustain: 0, release: 1.4, vel: 0.5 } },
    { name: 'FM Bass', values: { algo: A('stack'), fb: 0.35, r1: 1, l1: 0.9, d1: 0.7, r2: 1, l2: 0.7, d2: 0.25, r3: 2, l3: 0.3, d3: 0.15, r4: 1, l4: 0.2, d4: 0.2, sustain: 0.6, attack: 0.004, release: 0.12, vel: 0.5 } },
    { name: 'Brass Section', values: { algo: A('fork'), fb: 0.1, r1: 1, l1: 0.9, d1: 1.4, r2: 1, l2: 0.5, d2: 0.9, r3: 2, l3: 0.25, d3: 0.5, r4: 3, l4: 0.15, d4: 0.4, sustain: 0.7, attack: 0.04, release: 0.2, vel: 0.7 } },
    { name: 'Drawbar Organ', values: { algo: A('organ'), fb: 0.12, r1: 0.5, l1: 0.7, d1: 4, r2: 1, l2: 0.8, d2: 4, r3: 2, l3: 0.5, d3: 4, r4: 4, l4: 0.3, d4: 4, sustain: 1, attack: 0.012, release: 0.08, vel: 0.2 } },
    { name: 'Metal Hit', values: { algo: A('stack'), fb: 0.7, r1: 1, l1: 0.8, d1: 0.9, r2: 1.5, l2: 0.8, d2: 0.5, r3: 3.5, l3: 0.6, d3: 0.3, r4: 7, l4: 0.5, d4: 0.2, sustain: 0, attack: 0.002, release: 0.5, vel: 0.8 } },
    { name: 'Marimba Wood', values: { algo: A('twin'), fb: 0, r1: 1, l1: 0.9, d1: 0.9, r2: 4, l2: 0.35, d2: 0.1, r3: 1, l3: 0.3, d3: 0.35, r4: 10, l4: 0.15, d4: 0.06, sustain: 0, attack: 0.002, release: 0.3, vel: 0.6 } },
    { name: 'Rhodes Dream', values: { algo: A('twin'), fb: 0.08, r1: 1, l1: 0.85, d1: 3, r2: 14, l2: 0.12, d2: 0.1, r3: 1, l3: 0.4, d3: 2, r4: 1, l4: 0.25, d4: 1.2, sustain: 0.25, attack: 0.004, release: 0.6, vel: 0.75 } }
  ];

  /* ---------- shared helpers ---------- */
  const hx = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).padStart(8, '0'); };
  const opKey = (P, n) => [P.get('r' + n), P.get('l' + n), P.get('d' + n)].map(x => x.toFixed(2)).join('|');
  const roles = P => { const a = P.get('algo'); return [0, 1, 2, 3].map(k => CAR[a].includes(k)); };
  const wire = (root, P) => {
    root.querySelectorAll('[data-p]').forEach(el => { const o = {}; if (el.dataset.abs) { o.abs = true; o.axis = el.dataset.abs; } if (el.dataset.ax) o.axis = el.dataset.ax; if (el.dataset.rng) o.range = +el.dataset.rng; if (el.dataset.inv) o.invert = true; P.bind(el, el.dataset.p, o); });
    root.querySelectorAll('[data-t]').forEach(el => P.text(el, el.dataset.t));
    root.querySelectorAll('[data-algo]').forEach(b => { b.addEventListener('click', () => P.set('algo', +b.dataset.algo)); });
    P.sub('algo', v => root.querySelectorAll('[data-algo]').forEach(b => b.classList.toggle('on', +b.dataset.algo === v)));
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
  const pips = P => P.presets.map((p, i) => `<i data-pip="${i}" title="${p.name}"></i>`).join('');
  const ICON = {
    stack: '<path d="M6 22h6M20 22h6M34 22h6" /><path d="M9 18V8" /><rect x="3" y="18" width="8" height="8"/><rect x="16" y="18" width="8" height="8"/><rect x="29" y="18" width="8" height="8"/><rect x="42" y="18" width="3" height="8" opacity=".0"/>',
    twin: '<rect x="6" y="18" width="8" height="8"/><rect x="6" y="3" width="8" height="8"/><rect x="32" y="18" width="8" height="8"/><rect x="32" y="3" width="8" height="8"/><path d="M10 11v7M36 11v7"/>',
    fork: '<rect x="19" y="19" width="8" height="8"/><rect x="4" y="3" width="8" height="8"/><rect x="19" y="3" width="8" height="8"/><rect x="34" y="3" width="8" height="8"/><path d="M8 11l12 8M23 11v8M38 11L26 19"/>',
    organ: '<rect x="3" y="10" width="8" height="8"/><rect x="15" y="10" width="8" height="8"/><rect x="27" y="10" width="8" height="8"/><rect x="39" y="10" width="8" height="8"/>'
  };
  const icon = a => `<svg viewBox="0 0 50 30" width="50" height="30" fill="none" stroke="currentColor" stroke-width="1.6">${ICON[ALG[a]]}</svg>`;
  const envPath = (P, w, h, pad) => { // ADSR plot from attack / op1 decay / sustain / release
    const a = P.norm('attack'), d = P.norm('d1'), s = P.get('sustain'), r = P.norm('release');
    const W = w - pad * 2, H = h - pad * 2, x0 = pad, yb = h - pad;
    const xa = x0 + W * (0.04 + a * 0.22), xd = xa + W * (0.1 + d * 0.3), xs = xd + W * 0.16, xr = Math.min(x0 + W, xs + W * (0.06 + r * 0.3));
    const ys = yb - H * (0.12 + 0.88 * s);
    return `M${x0},${yb} L${xa},${pad} L${xd},${ys} L${xs},${ys} L${xr},${yb}`;
  };

  /* =====================================================================
     FACE A  — MERKLE
     ===================================================================== */
  

  /* =====================================================================
     FACE B  — NONCE  (phosphor mining rig)
     ===================================================================== */
  

  /* =====================================================================
     FACE C  — COINBASE  (gold medal, operators on the rim)
     ===================================================================== */
  function buildCoinbase(root, P) {
    const GD = '#e0b24a';
    const CX = 480, CY = 262, R = 196;
    const rim = [[-135, 1], [-45, 2], [45, 3], [135, 4]]; // NW NE SE SW
    const pos = a => [CX + Math.cos(a * Math.PI / 180) * (R - 38), CY + Math.sin(a * Math.PI / 180) * (R - 38)];
    const rn = ['I', 'II', 'III', 'IV'];
    const rimKnobs = rim.map(([a, n]) => { const [x, y] = pos(a); return `<div class="rk" style="left:${x - 31}px;top:${y - 31}px"><div class="kn gold" data-p="r${n}" style="--s:62px"></div><div class="rl">${rn[n - 1]}</div></div>`; }).join('');
    const corner = (n, style) => `<div class="cn" style="${style}" data-op="${n}"><div class="ct">OPERATOR ${rn[n - 1]}<span data-role="${n}"></span></div><div class="cr"><div class="kc"><div class="kn gold" data-p="l${n}" style="--s:50px"></div><div class="cl">LEVEL</div><div class="cv" data-t="l${n}"></div></div><div class="kc"><div class="kn gold" data-p="d${n}" style="--s:50px"></div><div class="cl">DECAY</div><div class="cv" data-t="d${n}"></div></div><div class="kc"><div class="cl" style="margin:0">RATIO</div><div class="cv big" data-t="r${n}"></div></div></div></div>`;
    const k = (id, lab, s) => `<div class="kc"><div class="kn gold" data-p="${id}" style="--s:${s || 46}px"></div><div class="cl">${lab}</div><div class="cv" data-t="${id}"></div></div>`;
    const ticks = Array.from({ length: 120 }, (_, i) => { const a = i * 3 * Math.PI / 180; const r1 = R - 2, r2 = R - (i % 5 ? 7 : 11); return `M${CX + Math.cos(a) * r1} ${CY + Math.sin(a) * r1}L${CX + Math.cos(a) * r2} ${CY + Math.sin(a) * r2}`; }).join('');
    root.innerHTML = `<style>
 .m{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,#2a2113 0,#15110a 60%,#0c0a06 100%);font-family:'Cinzel','Trajan Pro',Georgia,serif;color:#e8d9ae;--ac:${GD}}
 .m>*{position:absolute}
 .hd{left:0;top:0;width:960px;height:50px;display:flex;align-items:center;padding:0 22px;border-bottom:1px solid #5b4721;background:linear-gradient(#1d1710,#120e08)}
 .hd .lg{font-size:26px;font-weight:700;letter-spacing:.3em;color:transparent;background:linear-gradient(#fff2bf,#e0b24a 45%,#8f6a22);-webkit-background-clip:text;background-clip:text}
 .hd .sb{margin-left:14px;font-size:10px;letter-spacing:.2em;color:#a58640}
 .pb{margin-left:auto;display:flex;align-items:center;gap:8px}.pb button{background:linear-gradient(#e8c66a,#9a7428);border:0;border-radius:50%;width:24px;height:24px;color:#2a1d07;font-weight:700;cursor:pointer}
 .pb .nm{min-width:170px;text-align:center;font-size:14px;font-weight:700;color:#fff2bf}.pb .ix{font-size:10px;letter-spacing:.15em;color:#a58640}
 .pips{display:flex;gap:4px}.pips i{width:9px;height:9px;border-radius:50%;border:1px solid #a58640;cursor:pointer}.pips i.on{background:radial-gradient(circle at 35% 30%,#fff2bf,#e0b24a);box-shadow:0 0 8px #e0b24a}
 .coin{left:${CX - R - 6}px;top:${CY - R - 6}px}
 .rk{position:absolute;width:62px;text-align:center}.rl{font-size:11px;font-weight:700;color:#2a1d07;letter-spacing:.1em;margin-top:-4px;text-shadow:0 1px 0 #ffffff55;position:relative;z-index:2}
 .rk .rl{position:absolute;left:0;right:0;top:-12px;color:#e0b24a;text-shadow:none;margin:0}
 .kn{position:relative;width:var(--s,48px);height:var(--s,48px);border-radius:50%;cursor:ns-resize}
 .kn.gold{background:conic-gradient(from 225deg,#fff2bf 0,#e0b24a calc(var(--v)*270deg),#3a2d14 calc(var(--v)*270deg),#3a2d14 270deg,transparent 270deg);filter:drop-shadow(0 2px 3px #000a)}
 .kn.gold:before{content:"";position:absolute;inset:5px;border-radius:50%;background:radial-gradient(circle at 35% 28%,#fff2bf,#d9a93f 45%,#7b5a1a);box-shadow:inset 0 0 0 2px #b88a2a,inset 0 -3px 6px #0006}
 .kn.gold:after{content:"";position:absolute;left:calc(50% - 1.5px);top:8px;width:3px;height:calc(50% - 8px);background:#2a1d07;border-radius:2px;transform-origin:50% 100%;transform:rotate(calc(-135deg + var(--v)*270deg))}
 .kn.drag:before{box-shadow:inset 0 0 0 2px #fff2bf,0 0 12px #e0b24a}
 .kc{display:flex;flex-direction:column;align-items:center}.cl{font-size:8px;letter-spacing:.2em;color:#a58640;margin-top:3px}.cv{font-size:11px;font-weight:700;color:#fff2bf;font-family:'Cinzel',Georgia,serif}.cv.big{font-size:22px;margin-top:2px}
 .cn{position:absolute;width:214px;height:128px;border:1px solid #5b4721;background:linear-gradient(#1a140b,#100c06);box-shadow:inset 0 0 0 3px #100c06,inset 0 0 0 4px #3d2f15}
 .ct{font-size:10px;letter-spacing:.22em;text-align:center;padding:7px 0 0;color:#e0b24a;display:flex;flex-direction:column;gap:2px;align-items:center}.ct span{font-size:8px;color:#8a7036;letter-spacing:.2em}
 .cn.car .ct span{color:#2a1d07;background:#e0b24a;padding:0 6px}
 .cr{display:flex;justify-content:space-around;align-items:center;padding:6px 6px 0}
 .mid{position:absolute;width:150px}.mid .st{font-size:9px;letter-spacing:.2em;color:#a58640;text-align:center;margin-bottom:6px}
 .mid .kr{display:flex;justify-content:space-around}
 .al{position:absolute;left:${CX - 112}px;top:${CY + 2}px;width:224px;display:flex;gap:5px;justify-content:center}
 .al button{width:50px;height:36px;border-radius:6px;border:1px solid #7b5a1a;background:linear-gradient(#2a2011,#17110a);color:#a58640;cursor:pointer;font:700 7.5px 'Cinzel',Georgia,serif;letter-spacing:.06em;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px}
 .al button.on{background:linear-gradient(#f5d77f,#b98a2c);color:#2a1d07;box-shadow:0 0 12px #e0b24a99}
 .cap{position:absolute;left:${CX - 120}px;top:${CY - 122}px;width:240px;text-align:center;font-size:9px;letter-spacing:.26em;color:#7b5a1a}
 .scp{position:absolute;left:${CX - 78}px;top:${CY - 104}px;border-radius:50%;overflow:hidden;width:156px;height:156px}
 .kbw{left:16px;top:476px;width:928px;height:74px;border:2px solid #7b5a1a;border-radius:3px;background:#0c0a06;padding:3px}
 .kbw .kb-w{background:linear-gradient(#fff4cf,#d8bd78);border:1px solid #6e5320;border-top:0}.kbw .kb-w.on{background:linear-gradient(#e0b24a,#9a7428);box-shadow:0 0 14px #e0b24a}
 .kbw .kb-b{background:linear-gradient(#3a2d14,#0c0a06);border:1px solid #7b5a1a;border-top:0}.kbw .kb-b.on{background:#e0b24a}
 </style><div class="m">
 <div class="hd"><span class="lg">COINBASE</span><span class="sb">FOUR-OPERATOR FM · MINTED ON THE RIM</span>
  <div class="pb"><button data-prev>‹</button><div><div class="nm" data-pname></div><div style="text-align:center" class="ix">STRIKE <span data-pidx></span></div></div><button data-next>›</button><div class="pips">${pips(P)}</div></div></div>
 <svg class="coin" width="${2 * R + 12}" height="${2 * R + 12}" viewBox="${CX - R - 6} ${CY - R - 6} ${2 * R + 12} ${2 * R + 12}">
  <defs><radialGradient id="gold" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="#fff2bf"/><stop offset=".35" stop-color="#e0b24a"/><stop offset=".8" stop-color="#8f6a22"/><stop offset="1" stop-color="#5b4018"/></radialGradient>
  <radialGradient id="gold2" cx="60%" cy="70%" r="80%"><stop offset="0" stop-color="#f1cf74"/><stop offset=".6" stop-color="#b88a2c"/><stop offset="1" stop-color="#6b4d17"/></radialGradient>
  <path id="tp" d="M${CX + Math.cos(-0.75*Math.PI)*(R-20)} ${CY + Math.sin(-0.75*Math.PI)*(R-20)}A${R-20} ${R-20} 0 1 1 ${CX - Math.cos(-0.75*Math.PI)*(R-20)} ${CY - Math.sin(-0.75*Math.PI)*(R-20)}A${R-20} ${R-20} 0 1 1 ${CX + Math.cos(-0.75*Math.PI)*(R-20)} ${CY + Math.sin(-0.75*Math.PI)*(R-20)}"/>
  <filter id="eng"><feOffset dx="0" dy="1"/><feGaussianBlur stdDeviation=".4"/></filter></defs>
  <circle cx="${CX}" cy="${CY}" r="${R + 3}" fill="#000" opacity=".5"/><circle cx="${CX}" cy="${CY}" r="${R}" fill="url(#gold)" stroke="#5b4018" stroke-width="2"/>
  <path d="${ticks}" stroke="#5b4018" stroke-width="1.2" opacity=".8"/>
  <circle cx="${CX}" cy="${CY}" r="${R - 16}" fill="none" stroke="#fff2bf" stroke-opacity=".7" stroke-width="1"/><circle cx="${CX}" cy="${CY}" r="${R - 18}" fill="none" stroke="#5b4018" stroke-width="1"/>
  <text font-family="Cinzel,Georgia,serif" font-size="10.5" font-weight="700" letter-spacing="2.4" fill="#4d3510" text-anchor="middle"><textPath href="#tp" startOffset="12.5%">\u2726 4-OPERATOR FM \u2726</textPath><textPath href="#tp" startOffset="37.5%">\u2726 PROOF OF PHASE \u2726</textPath><textPath href="#tp" startOffset="62.5%">\u2726 FOUR HANDS \u2726</textPath><textPath href="#tp" startOffset="87.5%">\u2726 BLOCK REWARD \u2726</textPath></text>
  <circle cx="${CX}" cy="${CY}" r="${R - 58}" fill="url(#gold2)" stroke="#5b4018" stroke-width="1.5"/><circle cx="${CX}" cy="${CY}" r="${R - 64}" fill="none" stroke="#fff2bf" stroke-opacity=".6"/>
  <g id="route" stroke="#3b2a0c" fill="none" stroke-width="1.6"></g>
  <circle id="glow" cx="${CX}" cy="${CY}" r="${R - 58}" fill="#fff2bf" opacity="0"/>
 </svg>
 ${rimKnobs}
 <div class="al">${ALG.map((a, i) => `<button data-algo="${i}">${icon(i)}${a.toUpperCase()}</button>`).join('')}</div>
 ${corner(1, 'left:20px;top:64px')}${corner(2, 'left:726px;top:64px')}${corner(4, 'left:20px;top:340px')}${corner(3, 'left:726px;top:340px')}
 <div class="mid" style="left:20px;top:212px;width:214px"><div class="st">— THE ENVELOPE —</div><div class="kr">${k('attack', 'ATTACK', 50)}${k('sustain', 'SUSTAIN', 50)}${k('release', 'RELEASE', 50)}</div></div>
 <div class="mid" style="left:726px;top:212px;width:214px"><div class="st">— THE STRIKE —</div><div class="kr">${k('fb', 'FEEDBACK', 50)}${k('vel', 'VEL→IDX', 50)}${k('level', 'OUTPUT', 50)}</div></div>
 <canvas class="scp" id="sc" width="312" height="312" style="display:none"></canvas>
 <div class="kbw" id="kb"></div></div>`;
    wire(root, P);
    const $ = s => root.querySelector(s);
    // engraved routing diagram in the centre medal
    const route = $('#route');
    const NP = [[CX - 42, CY - 78], [CX + 42, CY - 78], [CX + 42, CY - 34], [CX - 42, CY - 34]]; // ops 1,2,3,4 at the four corners (matching the rim)
    const draw = () => {
      const a = P.get('algo'), car = roles(P); let s = '';
      MOD[a].forEach((srcs, t) => srcs.forEach(sx => { s += `<path d="M${NP[sx][0]} ${NP[sx][1]}L${NP[t][0]} ${NP[t][1]}" stroke-dasharray="${sx < t ? '' : ''}"/>`; }));
      NP.forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="${car[i] ? 14 : 10}" fill="${car[i] ? '#f5d77f' : '#b88a2c'}" stroke="#3b2a0c" stroke-width="1.6"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-family="Cinzel,Georgia,serif" font-size="${car[i] ? 12 : 10}" font-weight="700" fill="#3b2a0c" stroke="none">${rn[i]}</text>`; });
      s += `<text x="${CX}" y="${CY - 10}" text-anchor="middle" font-family="Cinzel,Georgia,serif" font-size="9" letter-spacing="3" fill="#3b2a0c" stroke="none">${ALG[a].toUpperCase()}</text>`;
      route.innerHTML = s;
      root.querySelectorAll('.cn').forEach(c => { const n = +c.dataset.op, cr = car[n - 1]; c.classList.toggle('car', cr); c.querySelector('[data-role]').textContent = cr ? 'CARRIER' : 'MODULATOR'; });
    };
    P.sub('algo', draw);
    // fb loop on op IV
    const fbPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fbPath.setAttribute('d', `M${NP[3][0] - 8} ${NP[3][1] + 10}c-18 14 -22 -10 -10 -12`); fbPath.setAttribute('fill', 'none'); fbPath.setAttribute('stroke', '#3b2a0c');
    route.appendChild(fbPath);
    P.sub('fb', v => { fbPath.style.opacity = 0.1 + v * 0.9; fbPath.setAttribute('stroke-width', 1 + v * 2); });
    // scope drawn inside the medal's lower half
    const sc = $('#sc'); sc.style.display = 'block'; sc.style.top = (CY + 52) + 'px'; sc.style.left = (CX - 70) + 'px'; sc.style.width = '140px'; sc.style.height = '46px'; sc.style.borderRadius = '0'; sc.width = 280; sc.height = 92;
    sc.style.opacity = .95; sc.style.mixBlendMode = 'multiply';
    P.scope(sc, { color: '#3b2a0c', width: 2.5, gain: 2.6 });
    const glow = $('#glow'); P.raf(() => { glow.setAttribute('opacity', Math.min(0.5, P.level() * 0.6)); });
    P.keyboard($('#kb'), { from: 48, octaves: 3 });
  }

  Kit.register('fm4', {
    fonts: 'family=Space+Mono:wght@400;700&family=VT323&family=Cinzel:wght@500;700',
    w: 960, h: 560, params, presets,
    faces: [
      undefined,
      undefined,
      { key: 'C', name: 'Coinbase', accent: '#e0b24a', build: buildCoinbase }
    ].filter(Boolean)
  });
})();
