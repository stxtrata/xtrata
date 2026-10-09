import { Kit } from "./runtime.js";
/* comp — Bus Glue compressor (VCA). Faces: A Consensus / B Hashpool / C Tether.
 * Real params from plugins.js: threshold ratio attack release makeup(linear gain) knee mix autoMakeup(off|on).
 * Meter: {reduction (dB<=0), inPeak, outPeak}. */
(function () {
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const dbf = x => 20 * Math.log10(Math.max(1e-6, x));
  const TWO = Math.PI * 2;
  const mkdb = m => (m > 0.001 ? 20 * Math.log10(m) : -60);
  const sgn = (v, d) => (v >= 0 ? '+' : '-') + Math.abs(v).toFixed(d == null ? 1 : d);

  /* static transfer curve (hard / soft knee) + manual makeup, in dB */
  function curve(x, T, R, W) {
    const d = x - T;
    if (W < 0.05) return d <= 0 ? x : T + d / R;
    if (2 * d < -W) return x;
    if (2 * Math.abs(d) <= W) return x + (1 / R - 1) * Math.pow(d + W / 2, 2) / (2 * W);
    return T + d / R;
  }
  const tfn = P => { const T = P.get('threshold'), R = P.get('ratio'), W = P.get('knee'), M = mkdb(P.get('makeup')); return x => curve(x, T, R, W) + M; };

  /* hi-dpi canvas: logical size from data-w/data-h */
  function cx(el) { const w = +el.dataset.w, h = +el.dataset.h; el.width = w * 2; el.height = h * 2; el.style.width = w + 'px'; el.style.height = h + 'px'; const c = el.getContext('2d'); c.scale(2, 2); c.W = w; c.H = h; return c; }

  /* smoothed live values from P.meter(), one call per frame */
  function mkLive(P) {
    const s = { g: 0, gPeak: 0, inDb: -60, outDb: -60, inHold: -60, outHold: -60, raw: 0 };
    return function () {
      const m = P.meter() || {};
      const r = -Math.min(0, m.reduction || 0); s.raw = r;
      s.g += (r > s.g ? 0.55 : 0.1) * (r - s.g);
      s.gPeak = Math.max(s.g, s.gPeak - 0.07);
      const i = dbf(m.inPeak || 0), o = dbf(m.outPeak || 0);
      s.inDb += (i > s.inDb ? 0.7 : 0.1) * (i - s.inDb); s.outDb += (o > s.outDb ? 0.7 : 0.1) * (o - s.outDb);
      s.inHold = Math.max(i, s.inHold - 0.3); s.outHold = Math.max(o, s.outHold - 0.3);
      return s;
    };
  }

  /* common wiring: [data-p] controls, [data-t] readouts, [data-xy], [data-byp], preset browser, auto lamp */
  function wire(root, P) {
    root.querySelectorAll('[data-p]').forEach(el => { const o = {}; if (el.dataset.abs) { o.abs = true; o.axis = el.dataset.abs; } if (el.dataset.rng) o.range = +el.dataset.rng; P.bind(el, el.dataset.p, o); });
    root.querySelectorAll('[data-t]').forEach(el => P.text(el, el.dataset.t));
    root.querySelectorAll('[data-xy]').forEach(el => { const a = el.dataset.xy.split(','); P.bindXY(el, a[0], a[1]); });
    root.querySelectorAll('[data-byp]').forEach(el => P.bind(el, '__bypass'));
    const top = root.firstElementChild;
    P.sub('__bypass', on => { if (top) top.classList.toggle('off', !on); });
    const n = P.presets.length; let idx = -1;
    P.onPreset((i, nm) => {
      idx = i;
      root.querySelectorAll('[data-pname]').forEach(e => { e.textContent = nm || '-'; e.title = nm || ''; });
      root.querySelectorAll('[data-pidx]').forEach(e => { e.textContent = String(Math.max(i, 0) + 1).padStart(2, '0') + '/' + String(n).padStart(2, '0'); });
      root.querySelectorAll('[data-pip]').forEach(e => e.classList.toggle('on', +e.dataset.pip === i));
    });
    root.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx - 1 + n) % n)));
    root.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => P.loadPreset((idx + 1) % n)));
    root.querySelectorAll('[data-pip]').forEach(b => b.addEventListener('click', () => P.loadPreset(+b.dataset.pip)));
    if (idx < 0 && n) P.loadPreset(0);
  }
  const pips = P => P.presets.map((p, i) => `<i data-pip="${i}" title="${p.name}"></i>`).join('');
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };

  const presets = [
    { name: 'Glue', values: { threshold: -20, ratio: 2, attack: 0.03, release: 0.2, makeup: 1.3, knee: 10, mix: 1, autoMakeup: 'off' } },
    { name: 'Punch', values: { threshold: -18, ratio: 4, attack: 0.03, release: 0.12, makeup: 1.4, knee: 4, mix: 1, autoMakeup: 'off' } },
    { name: 'Drum bus', values: { threshold: -26, ratio: 4, attack: 0.01, release: 0.1, makeup: 1.6, knee: 6, mix: 1, autoMakeup: 'off' } },
    { name: 'Gentle', values: { threshold: -14, ratio: 1.5, attack: 0.02, release: 0.4, makeup: 1.1, knee: 14, mix: 1, autoMakeup: 'off' } },
    { name: 'Parallel smash', values: { threshold: -42, ratio: 12, attack: 0.003, release: 0.12, makeup: 2.2, knee: 3, mix: 0.4, autoMakeup: 'on' } },
    { name: 'Vocal', values: { threshold: -22, ratio: 3, attack: 0.012, release: 0.25, makeup: 1.5, knee: 10, mix: 1, autoMakeup: 'off' } },
    { name: 'Mix bus 2:1', values: { threshold: -12, ratio: 2, attack: 0.05, release: 0.3, makeup: 1.1, knee: 8, mix: 1, autoMakeup: 'on' } },
  ];

  /* =====================================================================
     FACE A — CONSENSUS : a round table, sixteen seats, the gain reduction is a show of hands
     ===================================================================== */
  

  /* =====================================================================
     FACE B — HASHPOOL : a rack of mining units; the load is a hash-rate, a fan spins up
     ===================================================================== */
  function buildHashpool(root, P) {
    const AC = '#8dff4a';
    const sl = (id, lab, sub) => `<div class="sr"><div class="sk"><b>${lab}</b><small>${sub}</small></div><div class="sl" data-p="${id}" data-abs="x"><i></i></div><div class="sv" data-t="${id}"></div></div>`;
    root.innerHTML = `<style>
 .m{position:absolute;inset:0;overflow:hidden;background:#07090a;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace;color:#c6d1c9;--ac:${AC}}
 .m{user-select:none;-webkit-user-select:none}
 .m>*{position:absolute}
 header{left:0;top:0;width:960px;height:54px;background:linear-gradient(#1b2024,#101315);border-bottom:2px solid #000;display:flex;align-items:center;padding:0 16px;gap:14px;box-shadow:0 1px 0 #2f373d}
 .logo{display:flex;align-items:center;gap:12px;width:430px}
 .logo b{display:block;font:800 27px/1 'Chakra Petch','Arial Narrow',Impact,sans-serif;letter-spacing:.12em;color:#fff;white-space:nowrap;text-transform:uppercase}.logo b em{font-style:normal;color:var(--ac)}
 .logo small{display:block;font-size:9px;letter-spacing:.16em;color:#69776e;margin-top:4px;white-space:nowrap}
 .hs{margin-left:auto;display:flex;gap:18px;font-size:10px;letter-spacing:.1em;color:#69776e;white-space:nowrap}.hs b{color:var(--ac);font-weight:600}
 .led{width:9px;height:9px;background:#233028;border-radius:1px;display:inline-block;margin-right:6px;vertical-align:middle}.led.on{background:var(--ac);box-shadow:0 0 8px var(--ac)}.led.r.on{background:#ff4b3a;box-shadow:0 0 8px #ff4b3a}
 .u{left:16px;width:724px;background:linear-gradient(#262c31,#181c1f);border:1px solid #3a444b;border-radius:3px;box-shadow:0 2px 0 #000,inset 0 1px 0 #ffffff12}
 .u:before{content:"";position:absolute;left:0;right:0;top:0;height:5px;background:repeating-linear-gradient(-45deg,#e8c21a 0 7px,#14110a 7px 14px);opacity:.85;border-radius:3px 3px 0 0}
 .u .h{position:absolute;left:34px;right:34px;top:9px;height:14px;display:flex;align-items:center;font-size:9.5px;letter-spacing:.2em;color:#7e8d84;white-space:nowrap}.h span{margin-left:auto}
 .u .scw{position:absolute;width:9px;height:9px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#8c969c,#2b3135);box-shadow:inset 0 0 0 1px #0008}
 .u .in{position:absolute;left:34px;right:34px;top:28px;bottom:10px}
 .vent{position:absolute;right:6px;top:26px;bottom:8px;width:16px;background:radial-gradient(circle,#05070800 0,#050708 2px,transparent 2.5px) 0 0/8px 8px;opacity:.9}
 .vent.l{left:6px;right:auto}
 .lcd{position:absolute;left:0;top:0;border:2px solid #0a0e0c;border-radius:3px;background:#06100a;box-shadow:inset 0 0 14px #000,0 1px 0 #3a444b}
 .sr{display:grid;grid-template-columns:96px 1fr 72px;align-items:center;gap:12px;height:40px}
 .sk b{display:block;font:700 12px/1 'Chakra Petch',Arial,sans-serif;letter-spacing:.14em;color:#e3ece6}.sk small{display:block;font-size:8.5px;letter-spacing:.12em;color:#5d6b63;margin-top:3px;white-space:nowrap}
 .sv{font:600 12.5px/1 'JetBrains Mono',monospace;color:var(--ac);text-align:right;background:#06100a;border:1px solid #0a0e0c;box-shadow:inset 0 0 6px #000;padding:5px 6px;border-radius:2px;white-space:nowrap;font-variant-numeric:tabular-nums}
 .sl{position:relative;height:26px;cursor:ew-resize}
 .sl:before{content:"";position:absolute;left:0;right:0;top:9px;height:8px;background:#05080a;border:1px solid #000;border-radius:2px;box-shadow:inset 0 1px 3px #000,0 1px 0 #3a444b}
 .sl:after{content:"";position:absolute;left:2px;top:11px;height:4px;width:calc(var(--v)*(100% - 4px));background:var(--ac);-webkit-mask-image:repeating-linear-gradient(90deg,#000 0 5px,transparent 5px 7px);mask-image:repeating-linear-gradient(90deg,#000 0 5px,transparent 5px 7px);filter:drop-shadow(0 0 3px var(--ac))}
 .sl i{position:absolute;top:2px;width:16px;height:22px;left:calc(var(--v)*(100% - 16px));border-radius:2px;background:repeating-linear-gradient(90deg,#3a4349 0 2px,#262c31 2px 4px);border:1px solid #556068;box-shadow:0 2px 4px #000c;z-index:2}
 .sl i:after{content:"";position:absolute;left:6px;top:3px;width:2px;height:14px;background:var(--ac);box-shadow:0 0 6px var(--ac)}
 .sl.drag i{border-color:var(--ac)}
 .fan{position:absolute;left:0;top:0}
 .big{position:absolute;right:0;top:0;width:128px;height:100px;background:#06100a;border:2px solid #0a0e0c;border-radius:3px;box-shadow:inset 0 0 14px #000;text-align:center}
 .big .k{font-size:8.5px;letter-spacing:.2em;color:#4f7a52;margin-top:9px}
 .big .n{font:700 34px/1 'Chakra Petch','Arial Narrow',sans-serif;color:var(--ac);margin-top:8px;text-shadow:0 0 12px #8dff4a88;white-space:nowrap}.big .n small{font-size:12px;margin-left:3px}
 .big .t{font-size:10px;color:#9bd493;margin-top:8px;white-space:nowrap}
 .abtn{all:unset;cursor:pointer;display:block;width:100%;box-sizing:border-box;border:1px solid #556068;background:linear-gradient(#2f363b,#1b2024);border-radius:3px;text-align:center;font:700 11px/1 'Chakra Petch',Arial,sans-serif;letter-spacing:.14em;color:#7e8d84;box-shadow:0 2px 0 #000}
 .abtn.on{color:#06100a;background:var(--ac);border-color:var(--ac);box-shadow:0 0 12px #8dff4a66,0 2px 0 #000}
 .rc{left:752px;width:192px}
 .pn{background:linear-gradient(#262c31,#181c1f);border:1px solid #3a444b;border-radius:3px;box-shadow:0 2px 0 #000,inset 0 1px 0 #ffffff12;box-sizing:border-box}
 .pn .t{height:22px;line-height:22px;padding:0 10px;font-size:9.5px;letter-spacing:.2em;color:#7e8d84;border-bottom:1px solid #0a0e0c;display:flex}.pn .t span{margin-left:auto;color:var(--ac)}
 .pr{display:grid;grid-template-columns:22px 1fr 46px;align-items:center;height:30px;padding:0 10px;cursor:pointer;border-bottom:1px solid #0e1214;font-size:11px;color:#a5b3aa}
 .pr:hover{background:#ffffff0a}.pr b{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pr i{font-style:normal;font-size:9px;color:#4d5a52;text-align:right}.pr em{font-style:normal;color:#4d5a52;font-size:9px}
 .pr.on{background:#8dff4a18;color:#fff}.pr.on em,.pr.on i{color:var(--ac)}.pr.on b:before{content:"> ";color:var(--ac)}
 .ft{left:0;top:534px;width:960px;height:26px;background:#0b0e10;border-top:1px solid #20282d;display:flex;align-items:center;padding:0 16px;font-size:10px;letter-spacing:.08em;color:#69776e;white-space:nowrap;overflow:hidden}.ft b{color:var(--ac);font-weight:600}
 .m.off .lcd,.m.off .fan,.m.off .big,.m.off .hr{opacity:.4}
 </style><div class="m">
 <header><div class="logo"><svg width="40" height="36" viewBox="0 0 40 36" fill="none" stroke="${AC}" stroke-width="1.6"><rect x="2" y="3" width="36" height="8"/><rect x="2" y="14" width="36" height="8"/><rect x="2" y="25" width="36" height="8"/><path d="M7 7h4M7 18h4M7 29h4" /><circle cx="31" cy="7" r="1.6" fill="${AC}"/><circle cx="31" cy="18" r="1.6" fill="${AC}"/><circle cx="31" cy="29" r="1.6" fill="#ff4b3a" stroke="none"/></svg><div><b>HASH<em>POOL</em></b><small>BUS GLUE COMPRESSOR &middot; EVERY HIT MINES A LITTLE GAIN REDUCTION</small></div></div>
  <div class="hs"><span><i class="led on"></i><b id="hw">3</b>/3 UNITS</span><span><i class="led r" id="hl"></i>LOAD <b id="hlv">0%</b></span><span>BLOCKS <b id="hb">0</b></span></div></header>

 <div class="u" style="top:62px;height:172px"><i class="scw" style="left:10px;top:9px"></i><i class="scw" style="right:10px;top:9px"></i><i class="scw" style="left:10px;bottom:9px"></i><i class="scw" style="right:10px;bottom:9px"></i>
  <div class="h">UNIT 01 &middot; DETECTOR <span>TARGET / DIFFICULTY / SLACK</span></div>
  <div class="in"><canvas class="lcd" id="lcd" data-w="204" data-h="134"></canvas>
   <div style="position:absolute;left:224px;right:0;top:0">${sl('threshold', 'TARGET', 'threshold')}${sl('ratio', 'DIFFICULTY', 'ratio')}${sl('knee', 'SLACK', 'knee')}</div></div></div>

 <div class="u" style="top:242px;height:140px"><i class="scw" style="left:10px;top:9px"></i><i class="scw" style="right:10px;top:9px"></i><i class="scw" style="left:10px;bottom:9px"></i><i class="scw" style="right:10px;bottom:9px"></i>
  <div class="h">UNIT 02 &middot; TIMING &amp; HASHRATE <span>NONCE WINDOW / EPOCH</span></div>
  <div class="in"><canvas class="fan" id="fan" data-w="100" data-h="100"></canvas>
   <div style="position:absolute;left:116px;top:-2px;width:400px">
    <div class="sr" style="height:34px">${'<div class="sk"><b>NONCE</b><small>attack</small></div><div class="sl" data-p="attack" data-abs="x"><i></i></div><div class="sv" data-t="attack"></div>'}</div>
    <div class="sr" style="height:34px">${'<div class="sk"><b>EPOCH</b><small>release</small></div><div class="sl" data-p="release" data-abs="x"><i></i></div><div class="sv" data-t="release"></div>'}</div>
    <canvas class="lcd hr" id="hr" data-w="400" data-h="38" style="top:72px"></canvas></div>
   <div class="big"><div class="k">HASHRATE</div><div class="n"><span id="hn">0</span><small>TH/s</small></div><div class="t" id="hg">GR 0.0 dB</div></div></div></div>

 <div class="u" style="top:390px;height:140px"><i class="scw" style="left:10px;top:9px"></i><i class="scw" style="right:10px;top:9px"></i><i class="scw" style="left:10px;bottom:9px"></i><i class="scw" style="right:10px;bottom:9px"></i>
  <div class="h">UNIT 03 &middot; PAYOUT <span>REWARD / SHARE / SCOPES</span></div>
  <div class="in">
   <div class="lcd" style="width:204px;height:48px;overflow:hidden"><canvas id="sci" width="408" height="96" style="width:204px;height:48px"></canvas><b style="position:absolute;left:5px;top:3px;font-size:8px;letter-spacing:.2em;color:#4f7a52">IN</b></div>
   <div class="lcd" style="width:204px;height:48px;top:56px;overflow:hidden"><canvas id="sco" width="408" height="96" style="width:204px;height:48px"></canvas><b style="position:absolute;left:5px;top:3px;font-size:8px;letter-spacing:.2em;color:#4f7a52">OUT</b></div>
   <div style="position:absolute;left:224px;width:300px;top:0">${sl('makeup', 'REWARD', 'makeup')}${sl('mix', 'SHARE', 'mix')}</div>
   <div style="position:absolute;right:0;top:0;width:128px"><button class="abtn" data-p="autoMakeup" style="height:46px;line-height:44px">AUTO-REWARD</button><div style="margin-top:8px;font-size:9px;letter-spacing:.14em;color:#5d6b63;text-align:center;white-space:nowrap">IN <b style="color:var(--ac)" id="pi">-</b> &middot; OUT <b style="color:var(--ac)" id="po">-</b></div><div style="margin-top:4px;font-size:9px;letter-spacing:.14em;color:#5d6b63;text-align:center">PEAK dBFS</div></div></div></div>

 <div class="rc pn" style="top:62px;height:258px"><div class="t">POOLS<span data-pidx></span></div>${P.presets.map((p, i) => `<div class="pr" data-pip="${i}"><em>${String(i + 1).padStart(2, '0')}</em><b>${p.name}</b><i>${((i + 1) * 2654435761 >>> 0).toString(16).slice(0, 4)}</i></div>`).join('')}</div>
 <div class="rc pn" style="top:328px;height:64px;padding:10px"><button class="abtn" data-byp style="height:42px;line-height:40px;font-size:13px;letter-spacing:.2em" id="pw">POWER</button></div>
 <div class="rc pn" style="top:400px;height:130px"><div class="t">IN / OUT<span>dBFS</span></div><canvas id="vm" data-w="190" data-h="104" style="position:absolute;left:0;top:23px"></canvas></div>
 <div class="ft"><span id="tk"></span></div></div>`;
    wire(root, P);
    const $ = s => root.querySelector(s);
    P.sub('__bypass', on => { $('#pw').textContent = on ? 'POWER ON' : 'POWER OFF'; });
    const L = cx($('#lcd')), F = cx($('#fan')), H = cx($('#hr')), V = cx($('#vm')), live = mkLive(P);
    let ang = 0, last = 0, blocks = 0, armed = true;
    function lcd(s) {
      const c = L, x0 = 26, y0 = 8, w = 172, h = 108, LO = -60, HI = 6;
      c.clearRect(0, 0, 204, 134);
      const px = x => x0 + (x - LO) / (HI - LO) * w, py = y => y0 + h - (y - LO) / (HI - LO) * h;
      c.font = "500 8px 'JetBrains Mono',monospace"; c.fillStyle = '#3f6a45'; c.textAlign = 'center';
      c.strokeStyle = '#123a1c'; c.lineWidth = 1; c.beginPath();
      for (let d = -60; d <= 0; d += 12) { c.moveTo(px(d), y0); c.lineTo(px(d), y0 + h); c.moveTo(x0, py(d)); c.lineTo(x0 + w, py(d)); } c.stroke();
      for (let d = -48; d <= 0; d += 24) { c.fillText(String(d), px(d), y0 + h + 12); }
      c.textAlign = 'right'; for (let d = -48; d <= 0; d += 24) c.fillText(String(d), x0 - 4, py(d) + 3);
      const Th = P.get('threshold'), W = P.get('knee'), f = tfn(P);
      c.save(); c.beginPath(); c.rect(x0, y0, w, h); c.clip();
      c.fillStyle = 'rgba(141,255,74,.1)'; c.fillRect(px(Th - W / 2), y0, Math.max(1, px(Th + W / 2) - px(Th - W / 2)), h);
      c.strokeStyle = '#2f6a3a'; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(px(LO), py(LO)); c.lineTo(px(HI), py(HI)); c.stroke();
      c.strokeStyle = '#b6ff8a'; c.beginPath(); c.moveTo(px(Th), y0); c.lineTo(px(Th), y0 + h); c.stroke(); c.setLineDash([]);
      c.beginPath(); for (let x = LO; x <= HI; x += 0.5) { const X = px(x), Y = py(f(x)); x === LO ? c.moveTo(X, Y) : c.lineTo(X, Y); }
      c.lineTo(px(HI), y0 + h); c.lineTo(px(LO), y0 + h); c.closePath(); c.fillStyle = 'rgba(141,255,74,.1)'; c.fill();
      c.beginPath(); for (let x = LO; x <= HI; x += 0.5) { const X = px(x), Y = py(f(x)); x === LO ? c.moveTo(X, Y) : c.lineTo(X, Y); }
      c.strokeStyle = AC; c.lineWidth = 2; c.shadowColor = AC; c.shadowBlur = 6; c.stroke(); c.shadowBlur = 0;
      const lx = px(clamp(s.inDb, LO, HI)), ly = py(clamp(s.outDb, LO, HI));
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1; c.beginPath(); c.moveTo(lx, y0 + h); c.lineTo(lx, ly); c.lineTo(x0, ly); c.stroke();
      c.fillStyle = '#fff'; c.fillRect(lx - 3, ly - 3, 6, 6);
      c.restore();
    }
    function fan(s) {
      const c = F, C = 50; c.clearRect(0, 0, 100, 100);
      rr(c, 1, 1, 98, 98, 6); c.fillStyle = '#0a0e0c'; c.fill(); c.strokeStyle = '#3a444b'; c.lineWidth = 1.5; c.stroke();
      [[8, 8], [92, 8], [8, 92], [92, 92]].forEach(p => { c.beginPath(); c.arc(p[0], p[1], 2.4, 0, TWO); c.fillStyle = '#2b3135'; c.fill(); });
      c.beginPath(); c.arc(C, C, 40, 0, TWO); c.fillStyle = '#05080a'; c.fill(); c.strokeStyle = '#1b2226'; c.lineWidth = 3; c.stroke();
      const col = s.g > 12 ? '#ff6a4a' : s.g > 5 ? '#e8e04a' : AC;
      c.save(); c.translate(C, C); c.rotate(ang);
      for (let i = 0; i < 7; i++) { c.rotate(TWO / 7); c.beginPath(); c.moveTo(7, 0); c.quadraticCurveTo(24, -16, 38, -4); c.quadraticCurveTo(26, 4, 7, 6); c.closePath(); c.fillStyle = '#20282d'; c.fill(); c.strokeStyle = col; c.globalAlpha = 0.35 + clamp(s.g / 14, 0, 0.65); c.lineWidth = 1; c.stroke(); c.globalAlpha = 1; }
      c.restore();
      c.beginPath(); c.arc(C, C, 8, 0, TWO); c.fillStyle = '#2f373d'; c.fill(); c.beginPath(); c.arc(C, C, 3, 0, TWO); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 8; c.fill(); c.shadowBlur = 0;
    }
    function hashbar(s) {
      const c = H; c.clearRect(0, 0, 400, 38);
      const n = 48, x0 = 8, w = 384, sw = w / n, fr = s.g / 24, pk = s.gPeak / 24;
      c.font = "500 8px 'JetBrains Mono',monospace"; c.fillStyle = '#3f6a45'; c.textAlign = 'center';
      for (let d = 0; d <= 24; d += 4) c.fillText(d === 0 ? '0' : '-' + d, x0 + d / 24 * (w - sw) + sw / 2, 9);
      for (let i = 0; i < n; i++) {
        const on = (i + 0.5) / n <= fr, pkOn = Math.abs((i + 0.5) / n - pk) < 0.6 / n;
        const col = i / n > 0.7 ? '#ff4b3a' : i / n > 0.4 ? '#e8e04a' : AC;
        c.fillStyle = on || pkOn ? col : '#0e2214'; if (on || pkOn) { c.shadowColor = col; c.shadowBlur = 5; } c.fillRect(x0 + i * sw, 14, sw - 2, 18); c.shadowBlur = 0;
      }
    }
    function vmeters(s) {
      const c = V; c.clearRect(0, 0, 190, 104);
      const bars = [['IN', s.inDb, s.inHold, 20], ['OUT', s.outDb, s.outHold, 108]];
      const n = 26, top = 6, hh = 82;
      bars.forEach(([lab, v, hold, x]) => {
        const fr = clamp((v + 60) / 60, 0, 1), sh = hh / n;
        for (let i = 0; i < n; i++) { const q = (n - 1 - i) / n; const on = q + 0.5 / n <= fr; const col = q > 0.9 ? '#ff4b3a' : q > 0.72 ? '#e8e04a' : AC; c.fillStyle = on ? col : '#0e2214'; c.fillRect(x, top + i * sh, 50, sh - 1.5); }
        const hy = top + (1 - clamp((hold + 60) / 60, 0, 1)) * (hh - 2); c.fillStyle = '#fff'; c.fillRect(x - 2, hy, 54, 1.5);
        c.fillStyle = '#69776e'; c.font = "600 9px 'JetBrains Mono',monospace"; c.textAlign = 'center'; c.fillText(lab, x + 25, 100);
      });
      c.fillStyle = '#4d5a52'; c.font = "500 8px 'JetBrains Mono',monospace"; c.textAlign = 'center';
      [[0, '0'], [-24, '-24'], [-48, '-48']].forEach(([d, t]) => c.fillText(t, 95, top + (1 - (d + 60) / 60) * (hh - 2) + 7));
    }
    P.scope($('#sci'), { tap: 'in', color: '#9bd493', bg: '#06100a', width: 1.6, glow: 3, grid: '#0e2a16' });
    P.scope($('#sco'), { tap: 'out', color: AC, bg: '#06100a', width: 1.6, glow: 6, grid: '#0e2a16' });
    const hn = $('#hn'), hg = $('#hg'), hl = $('#hl'), hlv = $('#hlv'), hb = $('#hb'), pi = $('#pi'), po = $('#po'), hw = $('#hw');
    P.raf(t => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
      const s = live(); ang += dt * (1.2 + s.g * 1.5);
      lcd(s); fan(s); hashbar(s); vmeters(s);
      hn.textContent = (96 + s.g * 11.7).toFixed(1); hg.textContent = 'GR -' + s.g.toFixed(1) + ' dB';
      hlv.textContent = Math.round(clamp(s.g / 24, 0, 1) * 100) + '%'; hl.classList.toggle('on', s.g > 8);
      if (s.g > 3 && armed) { blocks++; armed = false; hb.textContent = blocks; } else if (s.g < 1.5) armed = true;
      pi.textContent = s.inHold > -59 ? s.inHold.toFixed(1) : '-inf'; po.textContent = s.outHold > -59 ? s.outHold.toFixed(1) : '-inf';
    });
    const tick = () => {
      $('#tk').innerHTML = 'POOL <b>' + (root.querySelector('.pr.on b') ? root.querySelector('.pr.on b').textContent : '-') + '</b> &nbsp;|&nbsp; DIFFICULTY <b>' + P.fmt('ratio') + '</b> &nbsp;|&nbsp; TARGET <b>' + P.fmt('threshold') + '</b> &nbsp;|&nbsp; NONCE <b>' + P.fmt('attack') + '</b> &nbsp;|&nbsp; EPOCH <b>' + P.fmt('release') + '</b> &nbsp;|&nbsp; SHARE <b>' + P.fmt('mix') + '</b> &nbsp;|&nbsp; ALL SHARES ACCEPTED';
    };
    P.subAll(tick); P.onPreset(tick);
  }

  /* =====================================================================
     FACE C — TETHER : a rope hauled taut; the transfer curve is the rope, a tension dial reads the load
     ===================================================================== */
  

  Kit.register('comp', {
    fonts: 'family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500&family=Jost:wght@400;500;600&family=JetBrains+Mono:wght@400;600&family=Chakra+Petch:wght@500;700&family=Oswald:wght@400;500;600&family=Zilla+Slab:ital,wght@0,500;0,700;1,500',
    w: 960, h: 560,
    fmts: {
      makeup: v => (v <= 0.001 ? '-inf dB' : sgn(20 * Math.log10(v)) + ' dB'),
    },
    presets,
    faces: [
      undefined,
      { key: 'B', name: 'Hashpool', accent: '#8dff4a', w: 960, h: 560, build: buildHashpool },
      undefined,
    ].filter(Boolean),
  });
})();
