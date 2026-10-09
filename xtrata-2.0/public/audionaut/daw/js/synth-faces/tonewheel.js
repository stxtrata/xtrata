import { Kit } from "./runtime.js";
/* faces/tonewheel.js — drawbar organ (real params from synths/organ/tonewheel.js) with three faces */
(function () {
  const pct = v => Math.round(v * 100) + '%';
  const R = (id, label, min, max, def, step, fmt, extra) => Object.assign({ id, label, min, max, def, step, fmt }, extra || {});
  const DB = [['d16', "16' Sub", 4, "16'", 'SUB'], ['d513', "5 1/3' Quint", 0, "5⅓'", 'QNT'], ['d8', "8' Fundamental", 8, "8'", 'FND'], ['d4', "4' Octave", 6, "4'", 'OCT'], ['d223', "2 2/3' Nazard", 0, "2⅔'", 'NZD'], ['d2', "2' Super Octave", 4, "2'", 'SUP'], ['d135', "1 3/5' Tierce", 0, "1⅗'", 'TRC'], ['d113', "1 1/3' Larigot", 0, "1⅓'", 'LRG'], ['d1', "1' Fife", 0, "1'", 'FIF']];
  const HARM = [1, 3, 2, 4, 6, 8, 10, 12, 16];
  const params = DB.map(d => R(d[0], d[1], 0, 8, d[2], 1, v => String(Math.round(v)))).concat([
    { id: 'perc', label: 'Percussion', options: ['off', '2nd', '3rd'], def: 0 },
    R('percDecay', 'Perc Decay', 0.05, 1, 0.16, 0.01, v => v.toFixed(2) + ' s'),
    R('percLevel', 'Perc Level', 0, 1, 0.6, 0.01, pct),
    R('keyClick', 'Key Click', 0, 1, 0.35, 0.01, pct),
    { id: 'scanner', label: 'Scanner', options: ['off', 'v1', 'v2', 'v3', 'c1', 'c2', 'c3'], def: 0 },
    { id: 'rotary', label: 'Rotary Speaker', options: ['off', 'slow', 'fast'], def: 0 },
    R('rotaryDepth', 'Rotary Depth', 0, 1, 0.6, 0.01, pct),
    R('cutoff', 'Tone (low-pass)', 600, 16000, 9000, 50, v => v >= 1000 ? (v / 1000).toFixed(1) + ' kHz' : Math.round(v) + ' Hz', { log: true }),
    R('drive', 'Overdrive', 0, 1, 0.15, 0.01, pct),
    R('attack', 'Attack', 0.002, 0.4, 0.005, 0.001, v => (v * 1000).toFixed(0) + ' ms'),
    R('release', 'Release', 0.01, 1.5, 0.07, 0.01, v => v.toFixed(2) + ' s'),
    R('level', 'Output Level', 0, 1.5, 1, 0.01, v => Math.round(v * 100) + '%')
  ]);
  /* presets come from the synth def (P.presets, 58 registrations); the hymn board lists them all */

  /* ---------- helpers ---------- */
  const amp = n => n <= 0 ? 0 : Math.pow(10, -(8 - n) * 3 / 20);
  function sums(P) { let s = 0; DB.forEach(d => { s += Math.round(P.get(d[0])); }); return s; }
  function regStr(P) { const g = i => Math.round(P.get(DB[i][0])); return '' + g(0) + g(1) + ' ' + g(2) + g(3) + g(4) + g(5) + ' ' + g(6) + g(7) + g(8); }
  function wave(P, n) {
    const out = new Float32Array(n); let e = 0; const a = DB.map(d => { const v = amp(Math.round(P.get(d[0]))); e += v * v; return v; });
    const sc = e > 0 ? 0.7 / Math.sqrt(e) : 0, dr = 1 + P.get('drive') * 3;
    for (let i = 0; i < n; i++) { const t = i / n * 2; let y = 0; for (let k = 0; k < 9; k++) y += a[k] * Math.sin(2 * Math.PI * HARM[k] * t); out[i] = Math.tanh(y * sc * 1.1 * dr) / Math.tanh(dr); }
    return out;
  }
  const SEG = (id, labels, c) => `<div class="seg ${c || ''}">${labels.map((l, i) => `<button type="button" data-sel="${id}" data-v="${i}">${l}</button>`).join('')}</div>`;
  const HS = (id, label, c) => `<div class="hs ${c || ''}"><label>${label}</label><b data-t="${id}"></b><div class="ht" data-h="${id}"><div class="hfill"></div><div class="hcap"></div></div></div>`;
  const KNOB = (id, label, c) => `<div class="kn ${c || ''}"><div class="kbn" data-k="${id}"><i></i></div><label>${label}</label><b data-t="${id}"></b></div>`;

  function wire(root, P) {
    root.querySelectorAll('[data-k]').forEach(e => P.bind(e, e.dataset.k, { range: 160 }));
    root.querySelectorAll('[data-f]').forEach(e => P.bind(e, e.dataset.f, { abs: true, axis: 'y' }));
    root.querySelectorAll('[data-h]').forEach(e => P.bind(e, e.dataset.h, { abs: true, axis: 'x' }));
    root.querySelectorAll('[data-t]').forEach(e => P.text(e, e.dataset.t));
    const sels = [...root.querySelectorAll('[data-sel]')];
    sels.forEach(b => b.addEventListener('click', () => P.set(b.dataset.sel, +b.dataset.v)));
    [...new Set(sels.map(b => b.dataset.sel))].forEach(id => P.sub(id, v => sels.forEach(b => { if (b.dataset.sel === id) b.classList.toggle('on', +b.dataset.v === v); })));
    const pn = root.querySelectorAll('[data-pn]'), pi = root.querySelectorAll('[data-pi]'), pl = root.querySelector('[data-plist]'), npr = P.presets.length;
    if (pl) {
      pl.innerHTML = P.presets.map((p, i) => `<button type="button" class="pit" data-pl="${i}" title="${p.name}"><span>${String(i + 1).padStart(2, '0')}</span><em>${p.name}</em></button>`).join('');
      pl.querySelectorAll('[data-pl]').forEach(b => b.addEventListener('click', () => { P.loadPreset(+b.dataset.pl); if (pl.classList.contains('pop')) pl.classList.remove('open'); }));
    }
    root.querySelectorAll('[data-pt]').forEach(b => b.addEventListener('click', () => { if (pl) pl.classList.toggle('open'); }));
    let cur = 0, first = true;
    root.querySelectorAll('[data-pp]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); P.loadPreset((cur + +b.dataset.pp + npr) % npr); }));
    P.onPreset((i, name) => {
      if (first) { first = false; if (i < 0) setTimeout(() => P.loadPreset(0), 0); }
      if (i >= 0) cur = i;
      pn.forEach(e => { e.textContent = i >= 0 ? name : 'Custom'; }); pi.forEach(e => { e.textContent = (i >= 0 ? String(i + 1).padStart(2, '0') : '--') + '/' + String(npr).padStart(2, '0'); });
      if (pl) pl.querySelectorAll('[data-pl]').forEach(b => {
        const on = +b.dataset.pl === i; b.classList.toggle('on', on);
        if (on && (b.offsetTop < pl.scrollTop || b.offsetTop + b.offsetHeight > pl.scrollTop + pl.clientHeight)) pl.scrollTop = b.offsetTop - 4;
      });
    });
  }
  const keys = (el, P) => P.keyboard(el, { from: 36, octaves: 4 });
  function onSum(root, P, fn) { const run = () => fn(sums(P), regStr(P)); DB.forEach(d => P.sub(d[0], run)); }

  /* ============================== FACE A : Nakamoto ============================== */
  

  /* ============================== FACE B : Ledger ============================== */
  

  /* ============================== FACE C : Cathedral ============================== */
  function buildC(root, P) {
    const CX = 210, CY = 196, R0 = 46, R1 = 152, COL = ['#d12f46', '#e0842a', '#e8c53c', '#3aab5e', '#2ab0ae', '#3b73e0', '#6a48cf', '#b13fb0', '#e0587f'];
    let svg = '<defs>' + DB.map((d, i) => `<clipPath id="cp${i}"><rect id="cr${i}" x="-60" y="-150" width="120" height="100"/></clipPath>`).join('') + '<radialGradient id="gl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".5"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>';
    svg += `<circle cx="${CX}" cy="${CY}" r="${R1 + 20}" fill="#120a24" stroke="#c9a24a" stroke-width="3"/><circle cx="${CX}" cy="${CY}" r="${R1 + 14}" fill="none" stroke="#c9a24a" stroke-width="1" stroke-dasharray="2 5"/><circle cx="${CX}" cy="${CY}" r="${R1 + 28}" fill="none" stroke="#c9a24a55" stroke-width="1"/>`;
    svg += `<g id="rays" transform="translate(${CX},${CY})">${Array.from({ length: 36 }, (_, i) => `<line x1="0" y1="${-R0}" x2="0" y2="${-(R1 + 6)}" stroke="#9a82d6" stroke-opacity=".28" stroke-width="1" transform="rotate(${i * 10})"/>`).join('')}</g>`;
    svg += `<circle cx="${CX}" cy="${CY}" r="${R1 + 8}" fill="url(#gl)" id="halo" opacity=".3"/>`;
    DB.forEach((d, i) => {
      const a = i * 40, path = 'M0,-46 C28,-62 36,-108 0,-152 C-36,-108 -28,-62 0,-46Z';
      const rad = (a - 90) * Math.PI / 180, lx = CX + Math.cos(rad) * (R1 + 40), ly = CY + Math.sin(rad) * (R1 + 40);
      svg += `<g transform="translate(${CX},${CY}) rotate(${a})"><g class="petal" data-pe="${d[0]}" style="cursor:ns-resize"><path d="${path}" fill="#1c1033" stroke="#c9a24a" stroke-width="2.5"/><path class="gl" d="${path}" fill="${COL[i]}" clip-path="url(#cp${i})" opacity=".9"/><path d="M0,-52 L0,-142" stroke="#1c1033" stroke-width="1.2" opacity=".55"/><path d="${path}" fill="none" stroke="#c9a24a" stroke-width="1.5"/><path class="hot" d="M0,-46 L0,-152" stroke="#fff" stroke-width="0" /><g transform="translate(0,-92) rotate(${-a})"><text text-anchor="middle" y="5" class="pv" data-t2="${d[0]}" fill="#fff" font-size="15" font-weight="700" style="paint-order:stroke;stroke:#1c1033;stroke-width:3px">0</text></g></g></g>`;
      svg += `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="middle" fill="#c9a24a" font-size="13" font-weight="600">${d[3]}</text>`;
    });
    svg += `<circle cx="${CX}" cy="${CY}" r="42" fill="#1c1033" stroke="#c9a24a" stroke-width="3"/><circle cx="${CX}" cy="${CY}" r="35" fill="none" stroke="#c9a24a" stroke-width="1"/><text x="${CX}" y="${CY - 12}" text-anchor="middle" fill="#9a82d6" font-size="9" letter-spacing="2">SUM</text><text id="sm" x="${CX}" y="${CY + 14}" text-anchor="middle" fill="#e9dcc0" font-size="30" font-weight="700">0</text><text x="${CX}" y="${CY + 28}" text-anchor="middle" fill="#9a82d6" font-size="8" letter-spacing="1.5">OF 72</text>`;
    const knobs = [['percDecay', 'Perc Decay'], ['percLevel', 'Perc Level'], ['keyClick', 'Key Click'], ['rotaryDepth', 'Rotary Depth'], ['cutoff', 'Tone'], ['drive', 'Overdrive'], ['attack', 'Attack'], ['release', 'Release'], ['level', 'Output']].map(k => KNOB(k[0], k[1])).join('');
    root.innerHTML = `<style>
.c{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 25%,#2e1a56,#1c1033 55%,#120a24);font-family:'Cinzel','Trajan Pro','Times New Roman',serif;color:#e9dcc0;overflow:hidden}
.c *{box-sizing:border-box}
.c>*{position:absolute}
.fr{left:10px;top:10px;right:10px;bottom:10px;border:2px solid #c9a24a;border-radius:8px 8px 0 0;pointer-events:none}.fr:after{content:'';position:absolute;inset:4px;border:1px solid #c9a24a66;border-radius:5px 5px 0 0}
.ttl{left:30px;top:18px;font-size:28px;font-weight:700;letter-spacing:.2em;color:#c9a24a;line-height:1}.ttl small{display:block;font-size:9px;letter-spacing:.24em;color:#9a82d6;margin-top:6px;font-weight:400}
.win{left:30px;top:66px;width:400px;height:362px}.win svg{width:400px;height:362px;display:block;overflow:visible}.win g.petal{outline:none}.win text{font-family:'Cinzel','Trajan Pro',serif}
.hymn{left:466px;top:20px;width:466px}
.hn{display:flex;align-items:center;gap:10px;height:34px;border-bottom:1px solid #c9a24a}.hn button.ar{width:28px;height:28px;border:1px solid #c9a24a;background:none;color:#c9a24a;font:600 14px 'Cinzel';cursor:pointer;border-radius:50%}.hn button.ar:hover{background:#c9a24a;color:#1c1033}
.hn .lbl{font-size:9px;letter-spacing:.24em;color:#9a82d6}.hn .nm{flex:1;text-align:center;font-size:17px;font-weight:600;letter-spacing:.1em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hn .no{font-size:11px;letter-spacing:.14em;color:#c9a24a}
.board{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:22px;gap:4px;margin-top:6px;height:86px;overflow-y:auto;overscroll-behavior:contain;padding-right:4px;scrollbar-width:thin;scrollbar-color:#c9a24a #120a24}
.board::-webkit-scrollbar{width:6px}.board::-webkit-scrollbar-thumb{background:#c9a24a;border-radius:3px}.board::-webkit-scrollbar-track{background:#120a24}
.pit{display:flex;align-items:center;gap:6px;min-width:0;height:22px;background:#120a24;border:1px solid #c9a24a66;color:#e9dcc0;cursor:pointer;padding:0 6px;font-family:'Cinzel',serif;text-align:left}.pit span{flex:none;font-size:10px;font-weight:700;color:#c9a24a;line-height:1}.pit em{flex:1;min-width:0;font-style:normal;font-size:9px;letter-spacing:.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pit:hover{border-color:#c9a24a}.pit.on{background:#c9a24a}.pit.on span,.pit.on em{color:#1c1033}
.ctl{left:466px;top:150px;width:466px}
.grpt{font-size:9px;letter-spacing:.24em;color:#c9a24a;display:flex;align-items:center;gap:8px;margin-bottom:6px}.grpt:after{content:'';flex:1;height:1px;background:#c9a24a66}
.row{display:flex;gap:16px;margin-bottom:10px}.row>div{flex:1}
.seg{display:flex;gap:3px}.seg button{flex:1;height:26px;border:1px solid #c9a24a;background:#120a24;color:#e9dcc0;font:600 10px 'Cinzel',serif;letter-spacing:.06em;border-radius:13px;cursor:pointer;padding:0;text-transform:uppercase}.seg button.on{background:#c9a24a;color:#1c1033;box-shadow:0 0 10px #c9a24a88}
.kg{display:grid;grid-template-columns:repeat(9,1fr);margin-top:2px}
.kn{display:flex;flex-direction:column;align-items:center}
.kbn{width:36px;height:36px;border-radius:50%;position:relative;margin:7px 0 6px;background:radial-gradient(circle at 35% 30%,#4a2f80,#2a1a4d 70%);border:2px solid #c9a24a;box-shadow:0 3px 8px #000a}
.kbn:before{content:'';position:absolute;inset:-9px;border-radius:50%;background:conic-gradient(from -135deg,#c9a24a 0,#c9a24a calc(var(--v)*270deg),#3a2a62 calc(var(--v)*270deg),#3a2a62 270deg,transparent 270deg);-webkit-mask:radial-gradient(circle,transparent 62%,#000 64%,#000 74%,transparent 76%);mask:radial-gradient(circle,transparent 62%,#000 64%,#000 74%,transparent 76%)}
.kbn i{position:absolute;inset:0;transform:rotate(calc(-135deg + var(--v)*270deg))}.kbn i:after{content:'';position:absolute;left:50%;top:3px;width:3px;height:12px;margin-left:-1.5px;background:#e9dcc0;border-radius:2px}
.kbn.drag{box-shadow:0 0 12px #c9a24a}
.kn label{font-size:7.5px;letter-spacing:.06em;color:#9a82d6;text-transform:uppercase;text-align:center;line-height:1.15;height:18px;width:50px}.kn b{font:600 9px 'Cinzel',serif;color:#e9dcc0;margin-top:2px;letter-spacing:0;white-space:nowrap}
.sc{left:466px;top:376px;width:466px;height:52px;border-top:1px solid #c9a24a66;border-bottom:1px solid #c9a24a66}.sc canvas{position:absolute;inset:0;width:100%;height:100%}.sc span{position:absolute;right:4px;top:2px;font-size:7.5px;letter-spacing:.2em;color:#9a82d6}
.kbw{left:22px;right:22px;top:452px;height:92px;border:2px solid #c9a24a;border-bottom:0;background:#120a24;padding:4px 4px 0}
.kbw .kb-w{background:linear-gradient(#f4ecd8,#e0d4b4);border:1px solid #5a4a2a;border-top:0;border-radius:0 0 3px 3px}.kbw .kb-w.on{background:#c9a24a}.kbw .kb-b{background:linear-gradient(#2a1a4d,#120a24);border:1px solid #000;border-radius:0 0 2px 2px;height:60%}.kbw .kb-b.on{background:#7a5ad6}
.mic{left:30px;top:432px;font-size:8px;letter-spacing:.3em;color:#9a82d6}.mic2{right:30px;top:432px;font-size:8px;letter-spacing:.3em;color:#c9a24a}
</style>
<div class="c">
 <div class="fr"></div>
 <div class="ttl">CATHEDRAL<small>BLOCK BY BLOCK</small></div>
 <div class="win"><svg viewBox="0 0 420 380">${svg}</svg></div>
 <div class="hymn"><div class="hn"><button class="ar" data-pp="-1" type="button">&#8249;</button><span class="lbl">HYMN</span><span class="no" data-pi></span><span class="nm" data-pn></span><button class="ar" data-pp="1" type="button">&#8250;</button></div><div class="board" data-plist></div></div>
 <div class="ctl">
  <div class="row"><div><div class="grpt">PERCUSSION</div>${SEG('perc', ['off', '2nd', '3rd'])}</div><div><div class="grpt">ROTARY</div>${SEG('rotary', ['off', 'slow', 'fast'])}</div></div>
  <div class="grpt">SCANNER</div><div class="seg" style="margin-bottom:10px">${['off', 'v1', 'v2', 'v3', 'c1', 'c2', 'c3'].map((l, i) => `<button type="button" data-sel="scanner" data-v="${i}">${l}</button>`).join('')}</div>
  <div class="grpt">VOICING</div><div class="kg">${knobs}</div>
 </div>
 <div class="sc"><canvas id="cv" width="932" height="88"></canvas><span>THE ORGAN, FROM ABOVE</span></div>
 <div class="mic">PLAY THE ROSE · DRAG A PETAL</div><div class="mic2" id="mic2">REGISTRATION 40 8604 000</div>
 <div class="kbw" id="kbw"></div>
</div>`;
    wire(root, P); keys(root.querySelector('#kbw'), P);
    root.querySelectorAll('[data-pe]').forEach(g => P.bind(g, g.dataset.pe, { range: 110 }));
    DB.forEach((d, i) => P.sub(d[0], v => {
      const cr = root.querySelector('#cr' + i), h = Math.max(0.0001, v / 8 * 112); cr.setAttribute('y', -46 - h); cr.setAttribute('height', h + 2);
      const t = root.querySelector('[data-t2="' + d[0] + '"]'); if (t) t.textContent = Math.round(v);
    }));
    const sm = root.querySelector('#sm'), m2 = root.querySelector('#mic2');
    onSum(root, P, (s, r) => { sm.textContent = s; m2.textContent = 'REGISTRATION ' + r; });
    const gls = [...root.querySelectorAll('.gl')], rays = root.querySelector('#rays'), halo = root.querySelector('#halo');
    let ang = 0, lv = 0;
    const cv = root.querySelector('#cv'), cx = cv.getContext('2d'), buf = new Float32Array(1024);
    P.raf(() => {
      lv += (P.level() - lv) * 0.18; const rot = P.get('rotary'); ang += rot === 2 ? 1.8 : rot === 1 ? 0.28 : 0.04;
      rays.setAttribute('transform', `translate(${CX},${CY}) rotate(${ang})`); halo.setAttribute('opacity', (0.2 + lv * 1.4).toFixed(2));
      gls.forEach((g, i) => g.setAttribute('opacity', (0.78 + Math.min(0.22, lv * 0.9)).toFixed(2)));
      const W = cv.width, H = cv.height; cx.clearRect(0, 0, W, H); const w = wave(P, 600);
      cx.strokeStyle = '#c9a24a'; cx.lineWidth = 2.5; cx.beginPath(); for (let i = 0; i < 600; i++) { const x = i / 599 * W, y = H / 2 - w[i] * H * 0.4; i ? cx.lineTo(x, y) : cx.moveTo(x, y); } cx.stroke();
      const an = Kit.audio.analyser(); if (an && lv > 0.02) { an.getFloatTimeDomainData(buf); cx.strokeStyle = '#9a82d6'; cx.lineWidth = 2; cx.beginPath(); for (let i = 0; i < 512; i++) { const x = i / 511 * W, y = H / 2 - buf[i] * H * 0.9; i ? cx.lineTo(x, y) : cx.moveTo(x, y); } cx.stroke(); }
    });
  }

  Kit.register('tonewheel', {
    fonts: 'family=Manrope:wght@300;400;600;800&family=DM+Sans:wght@400;600&family=Courier+Prime:wght@400;700&family=Cinzel:wght@400;600;700',
    w: 960, h: 560, params,
    faces: [
      undefined,
      undefined,
      { key: 'C', name: 'Cathedral', accent: '#c9a24a', build: buildC }
    ].filter(Boolean)
  });
})();
