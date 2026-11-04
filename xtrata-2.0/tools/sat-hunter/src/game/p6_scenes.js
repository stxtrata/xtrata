
/* ---------- Scenes: Block 9 Vault, The Hunt, the Mythic jackpot, Odd Sat or Even Sat, Satoshi's Stash and two Lab events
   (Rare find, Period snapshot). The engine has dealt every result before any of this is drawn; the scenes only reveal.
   Every sat shown comes from window.SAT_RECORDS. Which record shows where is chosen with permFor (a fixed shuffle per round id)
   or Math.random, never the engine's generator, so a reload can never re-roll or double-credit anything. ---------- */
const HN = SAT_RECORDS;
const hnList = k => (HN.types && HN.types[k]) || [];
const hnGroup = s => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const hnSat = rec => rec && rec.str != null ? hnGroup(rec.str) : null;
const hnRgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const hnMix = (a, b, k) => { const A = hnRgb(a), B = hnRgb(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };
const hnLum = h => { const [r, g, b] = hnRgb(h); return (r * .299 + g * .587 + b * .114) / 255; };
// The rarity table (RAR, p3) in the short form the brass tags and chips here use: n = name on the tag, c = colour, c2 = highlight.
const HN_RAR = Object.fromEntries(Object.entries(RAR).map(([k, A]) => [k, { n: A.name, c: A.col, c2: A.hi }]));
const hnKey = (rec, slot) => rarityKey(rec, slot);
const hnTagName = (rec, key) => key === 'black' && rec && rec.blackName ? rec.blackName.toUpperCase() : (RAR[key] || RAR.vintage).name;
const hnChips = (rec, key) => rec ? extraTags(rec, key).slice(0, 2) : [];
// A deterministic stand-in for "a sat somewhere in this range" used only for the numbers streaming past the glass (decoration).
function hnNum(a, b, hunt) { const h = (Math.imul((a | 0) * 7919 + b, 2654435761) >>> 0) / 4294967296; return hunt ? hunt.first + Math.floor(h * (hunt.last - hunt.first)) : Math.floor(h * 1e10); }
const hnCache = {};
function hnTile(key, w, h, draw) { let c = hnCache[key]; if (!c) { c = hnCache[key] = canvas(w, h); draw(c.getContext('2d'), w, h); } return c; }

/* ---- surfaces: oak grain, brushed brass, specimen glass, screws, engraving ---- */
function hnOak(g, x, y, w, h, seed = 1, shade = 0) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = lin(g, x, y, x, y + h, [OAK2, OAK, OAK2, OAK]); g.fillRect(x, y, w, h);
  let s = seed * 9301 + 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < h / 2.2; i++) { const yy = y + r() * h, a = .05 + r() * .11, k = (r() - .5) * 18; g.strokeStyle = r() < .55 ? `rgba(0,0,0,${a})` : `rgba(255,196,130,${a * .5})`; g.lineWidth = .6 + r() * 1.7; g.beginPath(); g.moveTo(x, yy); g.bezierCurveTo(x + w * .3, yy + k, x + w * .62, yy - k, x + w, yy + (r() - .5) * 10); g.stroke(); }
  for (let n = 0; n < 3; n++) { const kx = x + r() * w, ky = y + r() * h; for (let q = 1; q < 6; q++) { g.strokeStyle = `rgba(0,0,0,${.05 + q * .008})`; g.lineWidth = 1; g.beginPath(); g.ellipse(kx, ky, q * 6, q * 2.6, 0, 0, 7); g.stroke(); } }
  if (shade) { g.fillStyle = `rgba(4,6,8,${shade})`; g.fillRect(x, y, w, h); } g.restore();
}
const hnWall = () => hnTile('wall', 1400, 960, (g, w, h) => {
  hnOak(g, 0, 0, w, h, 4, .5);
  for (let x = 0; x < w; x += 175) { g.fillStyle = 'rgba(0,0,0,.42)'; g.fillRect(x, 0, 3, h); g.fillStyle = 'rgba(255,200,140,.07)'; g.fillRect(x + 3, 0, 1, h); }
  const lamp = g.createRadialGradient(700, -60, 40, 700, 260, 940); lamp.addColorStop(0, 'rgba(0,166,251,.30)'); lamp.addColorStop(.5, 'rgba(5,104,156,.10)'); lamp.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = lamp; g.fillRect(0, 0, w, h);
  const v = g.createRadialGradient(700, 480, 340, 700, 480, 930); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.62)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
});
// the same oak from a cache (wood is drawn once per size, not every frame)
function hnOakImg(g, x, y, w, h, seed = 1, shade = 0) { const W = Math.ceil(w), H = Math.ceil(h); g.drawImage(hnTile(`oak|${W}|${H}|${seed}|${shade}`, W, H, c => hnOak(c, 0, 0, W, H, seed, shade)), x, y, w, h); }
// a felt tray the sample slides sit on (glass-blue baize)
const hnTray = () => hnTile('tray', 1340, 604, (g, w, h) => {
  g.fillStyle = lin(g, 0, 0, 0, h, ['#0e2a3a', '#0a1d29', '#0e2a3a']); g.fillRect(0, 0, w, h); let s = 77; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 9000; i++) { g.fillStyle = r() < .5 ? 'rgba(0,0,0,.18)' : 'rgba(111,211,255,.05)'; g.fillRect(r() * w, r() * h, 1.2, 1.2); }
  const v = g.createRadialGradient(w / 2, h / 2, 120, w / 2, h / 2, w * .6); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
});
function hnBrass(g, x, y, w, h, r = 6, lw = 2) {
  g.save(); round(g, x, y, w, h, r, lin(g, x, y, x, y + h, [BRASS2, BRASS, BRASS3, BRASS]), BRASS4, lw); g.beginPath(); g.roundRect(x, y, w, h, r); g.clip();
  let s = Math.round(x * 3 + y) + 5; const rn = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < h; i += 2) { g.fillStyle = `rgba(255,255,255,${rn() * .06})`; g.fillRect(x, y + i, w, 1); } g.restore();
}
function hnScrew(g, x, y, r = 4, a = .6) {
  g.fillStyle = lin(g, x - r, y - r, x + r, y + r, [BRASS2, BRASS3]); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  g.strokeStyle = BRASS4; g.lineWidth = Math.max(1, r * .3); g.beginPath(); g.moveTo(x - Math.cos(a) * r * .7, y - Math.sin(a) * r * .7); g.lineTo(x + Math.cos(a) * r * .7, y + Math.sin(a) * r * .7); g.stroke();
}
function hnEngrave(g, s, x, y, size, maxW = 9999, align = 'center', font = SERIF, weight = '700', col = '#35230a') { fitText(g, s, x, y + 1, size, maxW, 'rgba(255,240,190,.5)', font, align, weight); fitText(g, s, x, y, size, maxW, col, font, align, weight); }
// A brass plate with four screws; the engraving goes on top of it.
function hnPlate(g, x, y, w, h, dim = 0) { hnBrass(g, x, y, w, h, 6, 2); [[x + 9, y + 9], [x + w - 9, y + 9], [x + 9, y + h - 9], [x + w - 9, y + h - 9]].forEach(([a, b], i) => hnScrew(g, a, b, 3.2, i * 1.3)); if (dim) { g.fillStyle = `rgba(20,12,4,${dim})`; g.beginPath(); g.roundRect(x, y, w, h, 6); g.fill(); } }
function hnGlass(g, x, y, w, h, a = 1) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.globalAlpha = a; const gr = g.createLinearGradient(x, y, x + w, y + h);
  [[0, 0], [.16, .11], [.24, 0], [.6, 0], [.68, .07], [.76, 0]].forEach(([o, al]) => gr.addColorStop(o, `rgba(190,230,255,${al})`)); gr.addColorStop(1, 'rgba(190,230,255,0)'); g.fillStyle = gr; g.fillRect(x, y, w, h); g.restore();
}
function floodlight(g, cx, cy, r, a = .22, col = '0,166,251') { const gr = g.createRadialGradient(cx, cy, 10, cx, cy, r); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(.6, `rgba(${col},${a * .35})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(cx - r, cy - r, r * 2, r * 2); }
function darkRoom(g, a = .5) { g.drawImage(hnWall(), 0, 0); g.fillStyle = `rgba(3,5,8,${a * .6})`; g.fillRect(0, 0, 1400, 960); }
function hnMiniDisc(g, x, y, r, col, a = 1) { g.save(); g.globalAlpha = a; g.fillStyle = lin(g, x - r, y - r, x + r, y + r, [hnMix(col, '#ffffff', .4), col, hnMix(col, '#000000', .5)]); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = Math.max(1, r * .08); g.beginPath(); g.arc(x, y, r * .86, 0, 7); g.stroke(); g.restore(); }
// A rarity tag: a coloured chip with a brass rim, as hung on a sample.
function hnChip(g, s, cx, cy, key, size = 11, rec = null) {
  const R = HN_RAR[key] || HN_RAR.vintage, label = rec ? hnTagName(rec, key) : R.n; g.font = `800 ${size}px ${COND}`; const tw = g.measureText(label).width, w = tw + size * 1.9, h = size + 9, x = cx - w / 2, y = cy - h / 2, fill = key === 'black' ? '#14171b' : R.c;
  g.save(); round(g, x, y, w, h, h / 2, fill, key === 'black' ? R.c2 : BRASS, 1.6); g.fillStyle = BRASS4; g.beginPath(); g.arc(x + h * .5, cy, 1.9, 0, 7); g.fill();
  text(g, label, cx + h * .22, cy + .5, size, key === 'black' ? R.c2 : hnLum(R.c) > .5 ? '#12100a' : PAPER, COND, 'center', '800'); g.restore();
}

function hnChipRow(g, x, y, rec, key, size = 12) { let cx = x; [key, ...hnChips(rec, key)].forEach((k, n) => { const label = n === 0 ? hnTagName(rec, k) : HN_RAR[k].n; g.font = `800 ${size}px ${COND}`; const w = g.measureText(label).width + size * 1.9; hnChip(g, '', cx + w / 2, y, k, size, n === 0 ? rec : null); cx += w + 6; }); return cx; }

/* ---- the sat coin: engraved by rarity, the sat number round its rim ---- */
function hnCoin(g, cx, cy, r, rec, o = {}) { coinFace(g, cx, cy, r, rec, { key: o.key, slot: o.slot, glow: o.glow, t: o.now || 0 }); }
// The same coin from a 2x cache (art only; the glow is added when it is drawn).
function hnDrawCoin(g, cx, cy, r, rec, o = {}) {
  if (o.nocache || (o.key || hnKey(rec, o.slot)) === 'mythic') { hnCoin(g, cx, cy, r, rec, o); return; }
  const key = o.key || hnKey(rec, o.slot), rr = Math.max(4, Math.round(r)), id = [key, rec ? (rec.str || rec.tx || '') : '', rr].join('|'), pad = 4, size = rr * 2 + pad * 2;
  let c = hnCache[id]; if (!c) { if (Object.keys(hnCache).length > 500) for (const k in hnCache) if (k.includes('|')) delete hnCache[k]; c = hnCache[id] = canvas(size * 2, size * 2); const cg = c.getContext('2d'); cg.scale(2, 2); hnCoin(cg, size / 2, size / 2, rr, rec, { key, glow: 0 }); }
  g.save(); if (o.glow) { g.shadowColor = (HN_RAR[key] || HN_RAR.vintage).c; g.shadowBlur = o.glow; } if (o.alpha != null) g.globalAlpha = o.alpha; g.drawImage(c, cx - size / 2, cy - size / 2, size, size); g.restore();
}

/* ---- the loupe: a brass jeweller's glass with a turned oak handle; content() is drawn magnified inside the lens ---- */
function hnLoupe(g, cx, cy, r, ang = -.6, content = null, o = {}) {
  g.save(); g.save(); g.globalAlpha = .38; g.fillStyle = '#000'; g.beginPath(); g.ellipse(cx + r * .16, cy + r * .24, r * 1.04, r * 1.0, 0, 0, 7); g.fill(); g.restore();
  g.save(); g.translate(cx, cy); g.rotate(ang); const h0 = r * .95, h1 = r * (o.len || 2.1), hw = r * .12; round(g, h0, -hw, h1 - h0, hw * 2, hw, lin(g, h0, -hw, h0, hw, [OAK3, OAK, OAK3])); hnBrass(g, h0 - r * .02, -hw * 1.45, r * .28, hw * 2.9, 3, 1); hnBrass(g, h1 - r * .1, -hw * 1.1, r * .1, hw * 2.2, 3, 1); g.restore();
  g.save(); g.beginPath(); g.arc(cx, cy, r * .9, 0, 7); g.clip(); g.fillStyle = o.bg || GLASS; g.fillRect(cx - r, cy - r, r * 2, r * 2);
  if (content) { g.save(); content(g, cx, cy, r * .9); g.restore(); }
  const ed = g.createRadialGradient(cx, cy, r * .5, cx, cy, r * .9); ed.addColorStop(0, 'rgba(0,0,0,0)'); ed.addColorStop(1, 'rgba(0,12,24,.6)'); g.fillStyle = ed; g.fillRect(cx - r, cy - r, r * 2, r * 2);
  g.fillStyle = 'rgba(111,211,255,.07)'; g.fillRect(cx - r, cy - r, r * 2, r * 2); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = Math.max(1.5, r * .045); g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, r * .72, Math.PI * 1.1, Math.PI * 1.42); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = Math.max(1, r * .025); g.beginPath(); g.arc(cx, cy, r * .6, Math.PI * .1, Math.PI * .22); g.stroke(); g.restore();
  g.lineWidth = r * .15; g.strokeStyle = lin(g, cx - r, cy - r, cx + r, cy + r, [BRASS2, BRASS, BRASS3, BRASS2]); g.beginPath(); g.arc(cx, cy, r * .98, 0, 7); g.stroke();
  g.lineWidth = Math.max(1, r * .02); g.strokeStyle = BRASS4; g.beginPath(); g.arc(cx, cy, r * 1.06, 0, 7); g.stroke(); g.beginPath(); g.arc(cx, cy, r * .9, 0, 7); g.stroke(); g.restore();
}

/* ---- the sample tube: cork, brass collar, glass body ---- */
function hnTube(g, x, y, w, h, o = {}) {
  const cx = x + w / 2, bw = w * .6, ty = y + h * .2, by = y + h - bw / 2, cork = o.cork || 0, glow = o.glow || 0;
  g.save(); if (glow) { g.shadowColor = ACCENT; g.shadowBlur = 8 + glow * 26; }
  g.beginPath(); g.moveTo(cx - bw / 2, ty); g.lineTo(cx - bw / 2, by); g.arc(cx, by, bw / 2, Math.PI, 0, true); g.lineTo(cx + bw / 2, ty); g.closePath();
  const gl = g.createLinearGradient(cx - bw / 2, 0, cx + bw / 2, 0); gl.addColorStop(0, 'rgba(150,200,225,.20)'); gl.addColorStop(.28, 'rgba(225,246,255,.34)'); gl.addColorStop(.7, 'rgba(120,180,210,.13)'); gl.addColorStop(1, 'rgba(180,225,245,.24)'); g.fillStyle = gl; g.fill(); g.restore();
  g.save(); g.beginPath(); g.moveTo(cx - bw / 2, ty); g.lineTo(cx - bw / 2, by); g.arc(cx, by, bw / 2, Math.PI, 0, true); g.lineTo(cx + bw / 2, ty); g.closePath(); g.clip();
  const lv = o.liquid == null ? .5 : o.liquid, ly = y + h - (y + h - ty) * lv; g.fillStyle = 'rgba(0,166,251,.26)'; g.fillRect(cx - bw / 2, ly, bw, y + h - ly); g.fillStyle = 'rgba(111,211,255,.5)'; g.fillRect(cx - bw / 2, ly, bw, 2);
  g.fillStyle = 'rgba(255,255,255,.34)'; g.fillRect(cx - bw * .32, ty + 6, bw * .1, (by - ty) * .78);
  if (o.grain) { const gp = o.grain; g.shadowColor = ACCENT2; g.shadowBlur = 10; hnMiniDisc(g, cx + Math.sin(gp.t || 0) * 2, y + h - bw * .4, Math.max(4, bw * .12), ACCENT2, gp.a == null ? 1 : gp.a); }
  g.restore();
  g.strokeStyle = 'rgba(200,232,248,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - bw / 2, ty); g.lineTo(cx - bw / 2, by); g.arc(cx, by, bw / 2, Math.PI, 0, true); g.lineTo(cx + bw / 2, ty); g.stroke();
  // the paper label with its number
  if (o.label != null) { g.fillStyle = PAPER; g.fillRect(cx - bw / 2 + 1, y + h * .5, bw - 2, h * .17); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(cx - bw / 2 + 1, y + h * .5, bw - 2, 2); text(g, o.label, cx, y + h * .585, Math.min(24, bw * .36), INK, SERIF, 'center', '700'); }
  // the brass collar, then the cork (which lifts and fades as the tube unseals)
  hnBrass(g, cx - bw * .58, ty - h * .045, bw * 1.16, h * .075, 3, 1.2);
  if (cork < 1) { g.save(); const lift = ease(cork) * h * .22; g.globalAlpha = 1 - clamp01(cork * 1.25); g.translate(0, -lift); g.translate(cx, ty - h * .06); g.rotate(cork * .5); g.translate(-cx, -(ty - h * .06));
    const ck = g.createLinearGradient(cx - bw * .45, 0, cx + bw * .45, 0); ck.addColorStop(0, '#8d6a38'); ck.addColorStop(.45, '#c9a06a'); ck.addColorStop(1, '#7f5c2c'); g.fillStyle = ck; g.beginPath(); g.moveTo(cx - bw * .4, ty - h * .05); g.lineTo(cx - bw * .5, ty - h * .15); g.lineTo(cx + bw * .5, ty - h * .15); g.lineTo(cx + bw * .4, ty - h * .05); g.closePath(); g.fill();
    let s = Math.round(x) + 3; const rn = () => (s = (s * 16807) % 2147483647) / 2147483647; g.fillStyle = 'rgba(60,35,10,.5)'; for (let i = 0; i < 14; i++) g.fillRect(cx - bw * .45 + rn() * bw * .9, ty - h * .15 + rn() * h * .09, 1.6, 1.2); g.restore(); }
}
// the sat for tube i: a fixed shuffle per round of the Block 9 sats and the story sats (art only; the prize is already dealt)
let hnTubeC = { id: null, list: [] };
function hnTubeRec(f, i) {
  const id = f.roundId || 'vault'; if (hnTubeC.id !== id) { const seen = new Set(), pool = [...hnList('vault'), ...(HN.exotic || [])].filter(r => r.n != null && !seen.has(r.n) && seen.add(r.n)); hnTubeC = { id, list: permFor(id + 'tubes', pool.length).map(k => pool[k]) }; }
  return hnTubeC.list.length ? hnTubeC.list[i % hnTubeC.list.length] : null;
}

/* ---------- Block 9 Vault: nine sealed sample tubes in a rack; each one opened lifts its sat into a loupe ---------- */
const tubeRect = i => { const pitch = RW / 9; return [RX + i * pitch + (pitch - 100) / 2, 206, 100, 250]; };
function hnRack(g) {
  // the specimen case behind the tubes, and the oak rack board they stand in
  round(g, RX - 14, 176, RW + 28, 320, 10, lin(g, 0, 176, 0, 496, ['#0a1a24', '#06101a', '#0a1a24']), BRASS3, 3);
  g.save(); g.beginPath(); g.roundRect(RX - 14, 176, RW + 28, 320, 10); g.clip(); floodlight(g, 700, 190, 700, .16); g.restore();
}
function hnRackBoard(g, f) {
  hnOakImg(g, RX - 14, 430, RW + 28, 70, 9, .1); hnBrass(g, RX - 14, 426, RW + 28, 12, 3, 1.2); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(RX - 14, 492, RW + 28, 8);
  for (let i = 0; i < 9; i++) { const [x, y, w] = tubeRect(i), picked = f.picks.includes(i), cx = x + w / 2;
    hnPlate(g, cx - 38, 446, 76, 38); const lab = picked ? `${f.awards[i]}×` : String(i + 1); hnEngrave(g, lab, cx, 466, 24, 64, 'center', SERIF, '700', picked ? '#0a3a52' : BRASS4); }
}
function drawCoinbase(f, now) {
  const g = sg, R = reduced(), done = f.picks.length === 3;
  g.drawImage(hnWall(), 0, 0); floodlight(g, 700, 300, 800, .1);
  glowText(g, 'BLOCK 9 VAULT', 700, 62, 54, BRASS2, ACCENT, '800', 'center', COND);
  text(g, done ? 'THREE TUBES OPENED · EVERY SAT HAS A STORY' : `OPEN ${3 - f.picks.length} OF NINE SAMPLE TUBES · EACH TUBE HOLDS A SAT`, 700, 108, 19, PAPER, MONO, 'center', '700');
  text(g, `LAYR ${fmt(state.balance)}  ·  ${fmt(f.bet)} SATS BET`, 700, 140, 14, hnMix(PAPER, '#000000', .35), MONO, 'center', '700');
  hnRack(g);
  // once all three are open, the other six tubes unseal one after another to show what was left behind
  const doneT = done ? Math.max(0, ...f.picks.map(i => (pres.reveal && pres.reveal[i]) || 0)) + 1500 : 0, rest = [...Array(9).keys()].filter(i => !f.picks.includes(i));
  const flights = [];
  for (let i = 0; i < 9; i++) {
    const [x, y, w, h] = tubeRect(i), picked = f.picks.includes(i), u = pres.reveal && pres.reveal[i] !== undefined ? (now - pres.reveal[i]) / (R ? 1 : 1500) : (picked ? 1 : -1);
    const ra = done && !picked ? (R ? 1 : clamp01((now - doneT - rest.indexOf(i) * 170) / 520)) : 0, hv = pres.stage === 'play' && !done && !picked ? .5 + .5 * Math.sin(now / 520 + i) : 0;
    const cork = picked ? clamp01(u / .22) : ra, grain = !picked && ra === 0 ? { t: now / 600 + i, a: 1 } : picked && u < .18 ? { t: now / 300, a: 1 - u / .18 } : null;
    g.save(); if (!picked && ra > .01) g.globalAlpha = 1 - .55 * ra; hnTube(g, x, y, w, h, { cork, glow: picked ? (u < 1 ? .8 : .25) : hv, grain, liquid: .42 }); g.restore();
    if (picked && u >= .12 && u < 1.0 && !R) { const fl = ease((u - .12) / .5); flights.push({ i, u, fl }); }
    if (pres.stage === 'play' && !done && !picked) hits.push({ id: 'blk' + i, x: x - 8, y: y - 10, w: w + 16, h: h + 30, fn: () => pickBind(i) });
  }
  hnRackBoard(g, f);
  hnGlass(g, RX - 14, 176, RW + 28, 320, .9);
  // the three specimen stations: a loupe, the prize, and a brass plate engraved with the sat that came out of the tube
  const cw = 425, gap = 17.5;
  for (let k = 0; k < 3; k++) {
    const x = RX + k * (cw + gap), y = 506, h = 288, i = f.picks[k], u = i !== undefined && pres.reveal && pres.reveal[i] !== undefined ? (now - pres.reveal[i]) / (R ? 1 : 1500) : (i !== undefined ? 1 : -1), rec = i !== undefined ? hnTubeRec(f, i) : null;
    g.save(); g.shadowColor = '#000'; g.shadowBlur = 18; round(g, x, y, cw, h, 10, '#0a1219'); g.restore(); g.save(); g.beginPath(); g.roundRect(x, y, cw, h, 10); g.clip(); hnOakImg(g, x, y, cw, h, 20 + k, .38); g.restore(); round(g, x, y, cw, h, 10, null, BRASS3, 3);
    const lx = x + 116, ly = y + 82, lr = 64, mag = u >= 0 ? 1 + .3 * ease((u - .62) / .25) : 1;
    hnLoupe(g, lx, ly, lr, -.55, (gg, cx, cy, rr) => { if (rec && u >= (R ? 0 : .6)) { const bob = R ? 0 : Math.sin(now / 700 + k) * 2; hnDrawCoin(gg, cx, cy + bob, rr * .8 * mag, rec, { slot: rec.kind === 'vault' ? 'vault' : null, glow: 0, nocache: false }); const sw = (now / 1800 + k * .3) % 1; if (!R && sw < .3) { gg.fillStyle = `rgba(255,255,255,${.18 * Math.sin(sw / .3 * Math.PI)})`; gg.fillRect(cx - rr + sw / .3 * rr * 2 - 14, cy - rr, 28, rr * 2); } }
      else { gg.fillStyle = 'rgba(111,211,255,.07)'; gg.beginPath(); gg.arc(cx, cy, rr * .55, 0, 7); gg.fill(); text(gg, `${k + 1}`, cx, cy + 2, rr * .7, 'rgba(111,211,255,.28)', SERIF, 'center', '700'); } });
    hnPlate(g, x + 12, y + 158, cw - 24, 124, rec && u >= .62 ? 0 : .35);
    if (rec && u >= 0) {
      const key = hnKey(rec, rec.kind === 'vault' ? 'vault' : null), tp = R ? 1 : clamp01((u - .62) / .3), px = x + 28, ty0 = y + 176;
      // the prize (already dealt by the engine) stamps in beside the loupe
      if (u >= .66 || R) { const pk = R ? 1 : ease((u - .66) / .2); text(g, 'PRIZE', x + 330, y + 38, 13, hnMix(PAPER, '#000000', .3), MONO, 'center', '700'); g.save(); g.translate(x + 330, y + 90); g.scale(1 + .4 * (1 - pk), 1 + .4 * (1 - pk)); g.globalAlpha = pk; glowText(g, `${f.awards[i]}×`, 0, 0, 62, '#fff', ACCENT, '800', 'center', COND); g.restore(); text(g, `${fmt(f.awards[i] * f.bet)} LAYR`, x + 330, y + 138, 18, BRASS2, COND, 'center', '800'); }
      if (tp > 0) {
        hnChipRow(g, px, ty0, rec, key, 12);
        const num = hnSat(rec) || '', shown = num.slice(0, Math.ceil(num.length * clamp01(tp * 1.5)));
        hnEngrave(g, `SAT ${shown}`, x + cw / 2, ty0 + 27, 25, cw - 60, 'center', SERIF, '700');
        if (tp > .4) { hnEngrave(g, `BLOCK ${hnGroup(rec.block)}  ·  ${rec.name}  ·  ${rec.degree}`, x + cw / 2, ty0 + 49, 12.5, cw - 54, 'center', MONO, '700'); }
        if (tp > .6) { const all = wrapLines(g, rec.story || '', cw - 64, 12.5, SANS, '600'); all.slice(0, 3).forEach((l, n) => hnEngrave(g, l + (n === 2 && all.length > 3 ? '…' : ''), x + cw / 2, ty0 + 69 + n * 14, 12.5, cw - 56, 'center', SANS, '600')); }
      }
    } else { hnEngrave(g, 'AWAITING SAMPLE', x + cw / 2, y + 220, 20, cw - 80, 'center', SERIF, '700', '#6b4d18'); }
  }
  // each sat rises from its tube to its loupe
  flights.forEach(({ i, u, fl }) => { const k = f.picks.indexOf(i), rec = hnTubeRec(f, i), [x, y, w] = tubeRect(i), sx = x + w / 2, sy = y + 70, ex = RX + k * (cw + gap) + 116, ey = 588, px = sx + (ex - sx) * fl, py = sy + (ey - sy) * fl - Math.sin(fl * Math.PI) * 90; if (fl < 1 && rec) { hnDrawCoin(g, px, py, 14 + 44 * fl, rec, { slot: rec.kind === 'vault' ? 'vault' : null, glow: 26 }); } });
}

/* ---------- The Hunt: one real range of sats scrolls under the loupe; every find locks a real sat into its slide ---------- */
// Which sat locks where: a fixed assignment per round from the range's own finds (the first sat for a 10, the last for a 5, then
// the palindromes inside the range), never repeating a sat in one round. Art only: the values were dealt by the engine.
let hnHuntC = { key: null, hunt: null, map: {} };
function hnHuntFor(f) {
  const id = f.roundId || 'hunt', key = id + ':' + f.frames.length + ':' + f.sum; if (hnHuntC.key === key) return hnHuntC;
  const H = HN.hunts || [], hunt = H.length ? H[permFor(id + 'hunt', H.length)[0]] : null, map = {};
  if (hunt && hunt.finds && hunt.finds.length) {
    const fin = hunt.finds, first = fin[0], last = fin[1] || fin[0], pal = permFor(id + 'pal', Math.max(0, fin.length - 2)).map(k => fin[k + 2]), fin_ = f.frames[f.frames.length - 1].cells; let uf = false, ul = false, pi = 0;
    f.frames.forEach((fr, k) => { const add = k === 0 ? fr.cells.map((v, i) => v ? i : -1).filter(i => i >= 0) : fr.added; add.forEach(i => { if (i in map) return; const v = fin_[i]; let rec;
      if (v === 10 && !uf) { rec = first; uf = true; } else if (v === 5 && !ul) { rec = last; ul = true; } else if (pi < pal.length) rec = pal[pi++]; else if (!uf) { rec = first; uf = true; } else if (!ul) { rec = last; ul = true; }
      map[i] = rec; }); });
  }
  hnHuntC = { key, hunt, map }; return hnHuntC;
}
const blockFor = (f, i) => hnHuntFor(f).map[i] || null;
function lockOrder(f) { const order = []; f.frames.slice(0, f.index + 1).forEach((fr, k) => { const add = k === 0 ? fr.cells.map((v, i) => v ? i : -1).filter(i => i >= 0) : fr.added; add.forEach(i => { if (!order.includes(i)) order.push(i); }); }); return order; }
const cellRect = i => [RX + (i % 5) * CW + 8, RY + Math.floor(i / 5) * RHT + 8, CW - 19, RHT - 16];
function hnRibbon(g, now, x0, x1, cy, scale, col, a, hunt) {
  const R = reduced(), step = 200 * scale, t = R ? 0 : now * .07, off = (t * scale) % step, base = Math.floor(t / 200);
  g.save(); g.font = `700 ${Math.round(19 * scale)}px ${MONO}`; g.fillStyle = col; g.globalAlpha = a; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let k = -1; x0 + k * step - off < x1 + step; k++) g.fillText(hnGroup(hnNum(base + k + 4000, 7, hunt)), x0 + k * step - off + step / 2, cy); g.restore();
}
function drawHashBackdrop(now, f) {
  const g = sg, H = f ? hnHuntFor(f).hunt : hnHuntC.hunt; g.drawImage(hnWall(), 0, 0);
  // the felt tray and its brass frame
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 26; round(g, RX - 18, RY - 20, RW + 36, RH + 40, 10, '#0a1219'); g.restore(); g.drawImage(hnTray(), RX - 8, RY - 10, RW + 16, RH + 20); round(g, RX - 18, RY - 20, RW + 36, RH + 40, 10, null, BRASS, 4); round(g, RX - 8, RY - 10, RW + 16, RH + 20, 6, null, BRASS4, 2);
  [[RX - 8, RY - 8], [RX + RW + 8, RY - 8], [RX - 8, RY + RH + 8], [RX + RW + 8, RY + RH + 8]].forEach(([a, b], i) => hnScrew(g, a, b, 5, i));
  // the ribbon of sats under the big loupe
  const by = 68, bh = 64; hnOakImg(g, RX - 18, by, RW + 36, bh, 14, .15); hnBrass(g, RX - 18, by - 5, RW + 36, 8, 2, 1); hnBrass(g, RX - 18, by + bh - 3, RW + 36, 8, 2, 1);
  g.save(); g.beginPath(); g.rect(RX - 18, by + 3, RW + 36, bh - 6); g.clip(); g.fillStyle = 'rgba(2,10,16,.78)'; g.fillRect(RX - 18, by, RW + 36, bh); hnRibbon(g, now, RX - 18, RX + RW + 18, by + bh / 2, 1, 'rgba(111,211,255,.55)', 1, H); g.restore();
  const R = reduced(), lx = R ? 700 : 700 + Math.sin(now / 2300) * 420, ly = by + bh / 2;
  hnLoupe(g, lx, ly, 46, -.62, (gg, cx, cy, rr) => { gg.fillStyle = 'rgba(0,12,22,.92)'; gg.fillRect(cx - rr, cy - rr, rr * 2, rr * 2); gg.translate(cx, cy); gg.scale(1.75, 1.75); gg.translate(-cx, -cy); hnRibbon(gg, now, cx - rr, cx + rr, cy, 1, '#ffffff', 1, H); }, { len: 1.9 });
}
/* Hunt respins are animated: every empty slide scans (sat numbers streaming under the glass) and stops in turn, left to right.
   The engine has already dealt the respin (E.respin) before any of this is drawn, so the show can never change it;
   pres.hash only says when each slide stops, and which of them land a find. Intro: the trigger's finds lock one by one. */
function hashBusy(now = performance.now()) { return !!(pres && pres.hash && now < pres.hash.end); }
function startHashAnim(prev, prevLeft, fr, intro = false) {
  const now = performance.now(), R = reduced(), q = state.turbo, base = R ? 140 : q ? 380 : 760, step = R ? 0 : q ? 45 : 95;
  const spin = intro ? [] : prev.map((v, i) => v ? -1 : i).filter(i => i >= 0), stopAt = {}, landAt = {};
  spin.forEach(i => { stopAt[i] = now + base + (i % 5) * step + Math.floor(i / 5) * step * .35; });
  if (intro) fr.cells.map((v, i) => v ? i : -1).filter(i => i >= 0).forEach((i, k) => { landAt[i] = now + (R ? 0 : 350 + k * 200); });
  else fr.added.forEach(i => { landAt[i] = stopAt[i]; });
  const times = [...Object.values(stopAt), ...Object.values(landAt)], end = (times.length ? Math.max(...times) : now) + (R ? 0 : 160), F = feature();
  pres.hash = { t0: now, prev, prevLeft, spin, stopAt, landAt, end, intro };
  chainFlash = now; ledPulse = now;
  // sound: the relays chatter while the slides scan, each column clicks as it stops, every find stamps, and a rare one zooms
  if (!intro) sound('respin');
  const cols = {}; spin.forEach(i => { if (!(i in landAt)) cols[i % 5] = Math.max(cols[i % 5] || 0, stopAt[i]); });
  Object.entries(cols).forEach(([c, t]) => setTimeout(() => { if (pres && pres.hash) relay(0, Number(c)); }, t - now));
  Object.entries(landAt).sort((a, b) => a[1] - b[1]).forEach(([i, t]) => setTimeout(() => { if (pres && pres.hash) { sound('lock', 0); const rec = F ? blockFor(F, Number(i)) : null; if (rec && rec.rarity && rec.rarity !== 'common') setTimeout(() => sound('zoom'), 90); ledPulse = performance.now(); } }, Math.max(0, t - now)));
  setTimeout(() => { if (pres && pres.bonus === 'chain') { renderBar(); update(); } }, Math.max(0, end - now) + 20);
}
function hnLamp(g, x, y, r, on, flash = 1) { g.save(); g.shadowColor = on ? ACCENT2 : '#000'; g.shadowBlur = on ? 14 * flash : 0; g.fillStyle = on ? lin(g, x - r, y - r, x + r, y + r, ['#ffffff', ACCENT2, ACCENT3]) : '#10202b'; g.globalAlpha = on ? Math.max(.3, Math.min(1, on)) : 1; g.beginPath(); g.arc(x, y, r * (on ? Math.min(1.25, flash) : 1), 0, 7); g.fill(); g.restore(); g.strokeStyle = BRASS3; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r + 2.5, 0, 7); g.stroke(); }
function drawSpinCell(i, now, stopAt) {
  const [x, y, w, h] = cellRect(i), R = reduced(), left = stopAt - now, hunt = hnHuntC.hunt;
  round(sg, x, y, w, h, 8, '#06131c', ACCENT3, 2);
  sg.save(); sg.beginPath(); sg.rect(x + 2, y + 2, w - 4, h - 4); sg.clip();
  if (!R) { // sat numbers streaming down behind the glass, slowing a little just before the slide stops
    const speed = left < 220 ? .5 + 1.2 * left / 220 : 1.7, pos = now * speed * .16 + i * 53, rowH = 24, n = Math.ceil(h / rowH) + 1;
    sg.font = `700 12px ${MONO}`; sg.textAlign = 'center'; sg.textBaseline = 'middle';
    for (let r = 0; r < n; r++) { const yy = y + ((r * rowH + pos) % (n * rowH)) - rowH / 2, seq = Math.floor((r * rowH + pos) / (n * rowH)); sg.fillStyle = `rgba(111,211,255,${.14 + .18 * ((r + seq) % 3 === 0)})`; sg.fillText(hnGroup(hnNum(seq * 31 + r + i * 977, 3, hunt)), x + w / 2, yy); }
    const sy = y + ((now / 5 + i * 41) % (h + 40)) - 20, gr = sg.createLinearGradient(0, sy - 20, 0, sy + 20); gr.addColorStop(0, 'rgba(111,211,255,0)'); gr.addColorStop(.5, 'rgba(111,211,255,.38)'); gr.addColorStop(1, 'rgba(111,211,255,0)'); sg.fillStyle = gr; sg.fillRect(x, sy - 20, w, 40);
    const vg = sg.createLinearGradient(0, y, 0, y + h); vg.addColorStop(0, 'rgba(6,19,28,.9)'); vg.addColorStop(.3, 'rgba(6,19,28,.1)'); vg.addColorStop(.7, 'rgba(6,19,28,.1)'); vg.addColorStop(1, 'rgba(6,19,28,.9)'); sg.fillStyle = vg; sg.fillRect(x, y, w, h);
  }
  sg.restore();
  const pulse = R ? 1 : .6 + .4 * Math.sin(now / 70 + i);
  round(sg, x + w / 2 - 86, y + h / 2 - 34, 172, 66, 6, 'rgba(3,10,16,.86)', BRASS3, 1.5); // a readout plate over the streaming numbers
  sg.save(); sg.globalAlpha = pulse; text(sg, 'SCANNING', x + w / 2, y + h / 2 - 10, 22, ACCENT2, COND, 'center', '800'); sg.restore();
  text(sg, hnGroup(hnNum(Math.floor(now / 45) * 31 + i, 9, hunt)), x + w / 2, y + h / 2 + 18, 13, PAPER, MONO, 'center', '700');
}
function drawHashrate(f, now) {
  drawHashBackdrop(now, f);
  const R = reduced(), fr = f.frames[f.index], A = pres && pres.hash && now < pres.hash.end + 1200 ? pres.hash : null, HU = hnHuntFor(f), H = HU.hunt;
  // what each slide shows right now: a sat that has landed, a slide still scanning, or an empty slide
  const landed = i => !!fr.cells[i] && !(A && A.landAt[i] != null && now < A.landAt[i]);
  const spinningAt = i => !!(A && A.stopAt[i] != null && now < A.stopAt[i]);
  const ageOf = i => A && A.landAt[i] != null ? (now - A.landAt[i]) / 900 : 9;
  const vis = fr.cells.map((v, i) => landed(i) ? v : 0), n = vis.filter(Boolean).length;
  glowText(sg, 'THE HUNT', 45, 38, 38, BRASS2, ACCENT, '800', 'left', COND);
  text(sg, H ? `BLOCK ${hnGroup(H.block)} · SATS ${hnGroup(H.first)} TO ${hnGroup(H.last)}` : 'A RANGE OF SATS', 330, 28, 13, PAPER, MONO, 'left', '700');
  if (H && H.event) text(sg, H.event.toUpperCase(), 330, 49, 11, hnMix(PAPER, '#000000', .35), MONO, 'left', '700');
  fitText(sg, `${n} OF 15 SATS FOUND  ·  ${fmt(vis.reduce((a, v) => a + (v || 0), 0))}× YOUR BET ON THE TRAY`, 700, 152, 20, 1100, PAPER, MONO, 'center', '700');
  text(sg, 'EVERY NEW FIND RESETS THE RESPINS · FIND ALL 15 FOR THE MYTHIC JACKPOT', 700, 173, 12, hnMix(PAPER, '#000000', .3), MONO, 'center', '700');
  // respin lamps: the respin being played goes out as the slides start, and all three relight the moment a new sat is found
  let left = fr.left, fading = -1, relit = 0;
  if (A && !A.intro && now < A.end) { const firstLand = Math.min(...Object.values(A.landAt), Infinity); if (now < firstLand) { left = Math.max(0, A.prevLeft - 1); fading = left; } else relit = now - firstLand; }
  else if (A && !A.intro && A.spin.length && Object.keys(A.landAt).length) relit = now - Math.min(...Object.values(A.landAt));
  hnPlate(sg, 1000, 14, 355, 46); hnEngrave(sg, 'RESPINS LEFT', 1085, 38, 17, 130, 'center', COND, '800');
  for (let k = 0; k < 3; k++) { let on = k < left ? 1 : 0; if (k === fading && !R) on = Math.max(0, 1 - (now - A.t0) / 320); const flash = relit > 0 && relit < 700 && !R ? 1 + .5 * (1 - relit / 700) : 1; hnLamp(sg, 1200 + k * 40, 37, 11, on, flash); }
  // the brass chain between the finds, in the order they were found, the newest drawn as it lands
  const order = lockOrder(f).filter(landed), pts = order.map(i => { const [x, y, w, h] = cellRect(i); return [x + w / 2, y + h / 2]; });
  sg.save(); sg.lineCap = 'round'; for (let k = 1; k < pts.length; k++) { const age = ageOf(order[k]), isNew = age < 1, u = isNew && !R ? ease(age * 1.5) : 1, [x0, y0] = pts[k - 1], [x1, y1] = pts[k], xe = x0 + (x1 - x0) * u, ye = y0 + (y1 - y0) * u;
    sg.strokeStyle = '#0008'; sg.lineWidth = 12; sg.beginPath(); sg.moveTo(x0, y0); sg.lineTo(xe, ye); sg.stroke(); sg.strokeStyle = isNew ? BRASS2 : hexA(BRASS, .55); sg.lineWidth = 5; sg.setLineDash([14, 7]); sg.lineDashOffset = R ? 0 : -now / 40; sg.beginPath(); sg.moveTo(x0, y0); sg.lineTo(xe, ye); sg.stroke(); sg.setLineDash([]); }
  sg.restore();
  // empty slides: still scanning; a slide that has just stopped empty says so briefly
  fr.cells.forEach((v, i) => { if (landed(i) || spinningAt(i)) return;
    const [x, y, w, h] = cellRect(i); round(sg, x, y, w, h, 8, 'rgba(4,14,22,.8)', '#16465f', 2); sg.save(); sg.setLineDash([6, 6]); sg.strokeStyle = '#1b5a78'; sg.strokeRect(x + 10, y + 10, w - 20, h - 20); sg.restore();
    const missed = A && A.stopAt[i] != null && now - A.stopAt[i] < 520 && !R;
    if (missed) { const a = 1 - (now - A.stopAt[i]) / 520; sg.save(); sg.globalAlpha = a; round(sg, x, y, w, h, 8, null, RED, 3); sg.restore(); text(sg, 'NOT IN RANGE', x + w / 2, y + h / 2 - 8, 21, `rgba(255,140,120,${.35 + .65 * a})`, COND, 'center', '800'); }
    else text(sg, 'EMPTY SLIDE', x + w / 2, y + h / 2 - 8, 18, '#2b6a8a', COND, 'center', '800');
    text(sg, '1 IN 25 PER RESPIN', x + w / 2, y + h / 2 + 18, 11, '#245670', MONO, 'center', '700');
    text(sg, hnGroup(hnNum(R ? i : Math.floor(now / 140) + i * 977, 5, H)), x + w / 2, y + h - 22, 10, '#1f5772', MONO, 'center', '700'); });
  fr.cells.forEach((v, i) => { if (spinningAt(i)) drawSpinCell(i, now, A.stopAt[i]); });
  fr.cells.forEach((v, i) => { if (!landed(i)) return; const [x, y, w, h] = cellRect(i), age = ageOf(i), isNew = age < 1, rec = blockFor(f, i), k0 = order.indexOf(i), key = hnKey(rec);
    sg.save(); if (isNew && !R) { const k = 1 + .26 * (1 - ease(age * 1.6)); sg.translate(x + w / 2, y + h / 2); sg.scale(k, k); sg.translate(-x - w / 2, -y - h / 2); }
    round(sg, x, y, w, h, 8, lin(sg, x, y, x, y + h, ['#0b1c28', '#06121b']), isNew ? ACCENT2 : BRASS3, isNew ? 4 : 2);
    hnDrawCoin(sg, x + 66, y + 66, 50, rec, { glow: isNew ? 22 : 0 });
    if (rec) { hnPlate(sg, x + 10, y + h - 40, w - 20, 30); hnEngrave(sg, hnSat(rec), x + w / 2, y + h - 25, 16, w - 52, 'center', SERIF, '700'); }
    const tx = x + 130 + (w - 138) / 2; glowText(sg, `${v}×`, tx, y + 36, 36, '#fff', ACCENT, '800', 'center', COND); text(sg, fmt(v * f.bet), tx, y + 66, 13, ACCENT2, MONO, 'center', '700'); hnChip(sg, '', tx, y + 92, key, 11, rec); text(sg, `FIND ${k0 + 1}`, tx, y + 112, 10, hnMix(PAPER, '#000000', .35), MONO, 'center', '700');
    if (isNew) { sg.fillStyle = `rgba(190,235,255,${.55 * (1 - age)})`; sg.fillRect(x, y, w, h); } else if (!R) { const glint = (now / 2600 + k0 * .13) % 1; if (glint < .12) { sg.fillStyle = `rgba(190,235,255,${.12 * Math.sin(glint / .12 * Math.PI)})`; sg.fillRect(x, y, w, h); } }
    sg.restore(); hnGlass(sg, x, y, w, h, .8); if (isNew) rubberStamp(sg, 'FOUND', x + w * .62, y + h * .45, 22, ACCENT2, -.12, 1 - age * .45); });
}

/* ---------- Jackpot: Mythic. The loupe settles on sat 0, the first sat of the genesis block, and the meter counts up ---------- */
function drawJackpot(now) {
  const p = pres, t = now - p.t0, R = reduced(), M = HN.mythic || {}, G = M.genesis || {}, k = ease((t - (R ? 200 : 1600)) / (R ? 800 : 2400)), g = sg, show = t > (R ? 150 : 1700);
  g.fillStyle = lin(g, 0, 0, 0, 960, ['#02060a', '#071724', '#02060a']); g.fillRect(0, 0, 1400, 960);
  if (!R) { g.save(); g.translate(700, 345); for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12 + t / 3600; g.fillStyle = i % 2 ? 'rgba(111,211,255,.08)' : 'rgba(255,255,255,.035)'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1100, a, a + Math.PI / 24); g.closePath(); g.fill(); } g.restore(); }
  floodlight(g, 700, 345, 520, .26, '191,233,255');
  if (!R) { g.save(); for (let i = 0; i < 26; i++) { const ph = (t / 1000 + i * .37) % 3, x = (i * 173) % 1400, y = -40 + ph * 360; hnMiniDisc(g, x, y, 10 + (i % 3) * 4, ['#bfe9ff', '#ffffff', '#6fd3ff', BRASS2, '#ffd23f'][i % 5], .85); } g.restore(); }
  glowText(g, 'THE MYTHIC SAT', 700, 70, 76, '#ffffff', ACCENT2);
  text(g, `SAT ${M.str || '0'} · THE FIRST SAT OF THE GENESIS BLOCK`, 700, 124, 18, '#bfe9ff', MONO, 'center', '700');
  // the loupe sweeps across the lab bench, then settles on the sat
  const sw = R ? 0 : 1 - ease(t / 1700), lx = 700 + sw * Math.sin(t / 210) * 360, ly = 345 + sw * Math.cos(t / 290) * 36, lr = 170 * (R ? 1 : .72 + .28 * ease(t / 1100));
  hnLoupe(g, lx, ly, lr, 2.35, (gg, cx, cy, rr) => { const gl = gg.createRadialGradient(cx, cy, 10, cx, cy, rr); gl.addColorStop(0, 'rgba(191,233,255,.30)'); gl.addColorStop(1, 'rgba(0,10,20,.9)'); gg.fillStyle = gl; gg.fillRect(cx - rr, cy - rr, rr * 2, rr * 2); hnCoin(gg, cx, cy, rr * .8 * (1 + .04 * (R ? 0 : Math.sin(t / 500))), M, { key: 'mythic', now, glow: 30, nocache: true }); });
  // two engraved plates: what the sat is called, and the block it came from
  if (show) {
    const tp = R ? 1 : clamp01((t - 1700) / 1500), ty = s => s.slice(0, Math.ceil(s.length * clamp01(tp * 1.4)));
    hnPlate(g, 50, 190, 400, 300); hnChip(g, '', 150, 222, 'mythic', 14, M); hnEngrave(g, 'THE SAT', 232, 222, 17, 150, 'left', COND, '800');
    [['NAME', M.name || ''], ['DEGREE', M.degree || ''], ['BLOCK', hnGroup(M.block != null ? M.block : 0)], ['DECIMAL', M.decimal || '']].forEach(([a, b], n) => { hnEngrave(g, a, 76, 276 + n * 54, 13, 90, 'left', MONO, '700'); hnEngrave(g, ty(b), 76, 302 + n * 54, 26, 340, 'left', SERIF, '700'); });
    hnPlate(g, 950, 190, 400, 300); hnEngrave(g, 'THE GENESIS BLOCK', 1150, 222, 17, 340, 'center', COND, '800');
    const ls = wrapLines(g, '“' + (G.headline || '') + '”', 330, 20, SERIF, 'italic 700'); ls.slice(0, 4).forEach((l, n) => hnEngrave(g, ty(l), 1150, 270 + n * 26, 20, 340, 'center', SERIF, 'italic 700'));
    hnEngrave(g, G.timeUtc ? `MINED ${G.timeUtc} UTC` : '', 1150, 400, 13, 350, 'center', MONO, '700'); hnEngrave(g, G.hash ? G.hash.slice(0, 12) + '…' + G.hash.slice(-10) : '', 1150, 426, 12, 350, 'center', MONO, '700');
    hnEngrave(g, 'BLOCK 0 · THE FIRST BITCOIN BLOCK', 1150, 462, 12, 350, 'center', MONO, '700');
  }
  if (t > (R ? 250 : 2600)) glowText(g, 'THE MYTHIC SAT. IT CAN NEVER BE SPENT.', 700, 590, 38, '#ffffff', ACCENT2);
  text(g, 'JACKPOT PAID', 700, 648, 22, '#bfe9ff', COND, 'center', '800');
  if (t > (R ? 100 : 1500)) flapCells(g, fmt(Math.round(p.amount * k)), 700, 730, 100, { w: .56, col: '#fff' });
  text(g, `LAYR · ${fmt(p.bet)} BET LEVEL · THE METER RESETS TO ITS SEED`, 700, 826, 22, BRASS2, COND, 'center', '800');
}

/* ---------- Odd Sat or Even Sat: the gamble. The engine has already decided; a real sat with that parity is shown ---------- */
function hnGambleSat(parity) { const pool = (HN.gamble || []).filter(x => x.parity === parity); return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null; }
function gambleFace(g, r, side) { // a brass medallion for ODD SAT or EVEN SAT
  const odd = side === 'odd'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = lin(g, 0, -r, 0, r, odd ? ['#d7f2ff', ACCENT2, ACCENT3] : [BRASS2, BRASS, BRASS3]); g.fill(); g.lineWidth = 8; g.strokeStyle = odd ? '#e9f8ff' : '#fff1c4'; g.stroke();
  g.beginPath(); g.arc(0, 0, r - 16, 0, 7); g.lineWidth = 2; g.strokeStyle = odd ? '#03405e' : BRASS4; g.stroke();
  text(g, odd ? 'ODD' : 'EVEN', 0, -r * .06, r * .5, INK, COND, 'center', '800'); text(g, 'SAT', 0, r * .42, r * .22, INK, COND, 'center', '800');
}
function hnFlapH(s, maxW) { const d = (s.match(/\d/g) || []).length, c = s.length - d; return Math.min(112, maxW / (.6 * d + .25 * c + .2)); }
function hnFlapEnd(s, cx, h, w = .52) { const cw = h * w, gap = h * .08, ww = [...s].map(ch => ch === ',' || ch === '.' ? cw * .32 : cw), total = ww.reduce((a, b) => a + b, 0) + gap * (ww.length - 1); return cx + total / 2 - ww[ww.length - 1] / 2; }
function drawGamble(now) {
  const g = sg, p = pres, t = now - p.t0, R = reduced(), res = p.result, sat = p.sat; darkRoom(g, .45); floodlight(g, 700, 400, 620, .2);
  glowText(g, 'ODD SAT OR EVEN SAT', 700, 62, 56, BRASS2, ACCENT);
  const par = res ? res.parity : null, tgt = par === 'odd' ? -.15 : par === 'even' ? .15 : 0;
  let th = Math.sin(now / 760) * .045; if (p.stage === 'play') { const u = clamp01(t / (R ? 600 : 2100)); th = R ? (u > .5 ? tgt : 0) : tgt * ease(u) + (1 - u) * Math.sin(u * 22) * .2; } else if (p.stage === 'summary') th = tgt;
  // the assay balance: an oak pedestal, a brass column, a beam and two pans
  const px = 700, py = 360, L = 330; hnOakImg(g, 560, 700, 280, 46, 5, .1); hnBrass(g, 556, 694, 288, 12, 3, 1.2); const col = g.createLinearGradient(px - 14, 0, px + 14, 0); col.addColorStop(0, BRASS3); col.addColorStop(.4, BRASS2); col.addColorStop(1, BRASS3); g.fillStyle = col; g.fillRect(px - 14, py, 28, 340);
  g.save(); g.translate(px, py); g.rotate(th); hnBrass(g, -L, -9, L * 2, 18, 9, 1.5); g.restore();
  hnLamp(g, px, py, 10, 1, 1);
  [-1, 1].forEach(sd => { const ex = px + Math.cos(th) * L * sd, ey = py + Math.sin(th) * L * sd, py2 = ey + 190, picked = (sd < 0 ? 'odd' : 'even') === p.choice, won = res && par === (sd < 0 ? 'odd' : 'even');
    g.strokeStyle = BRASS3; g.lineWidth = 2; g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex - 78, py2 - 6); g.moveTo(ex, ey); g.lineTo(ex + 78, py2 - 6); g.stroke();
    g.save(); if (won && p.stage !== 'trigger') { g.shadowColor = ACCENT2; g.shadowBlur = 30; } g.beginPath(); g.ellipse(ex, py2 - 6, 96, 12, 0, 0, 7); g.fillStyle = lin(g, ex - 96, 0, ex + 96, 0, [BRASS3, BRASS2, BRASS3]); g.fill(); g.beginPath(); g.ellipse(ex, py2 - 6, 96, 40, 0, 0, Math.PI); g.fillStyle = lin(g, 0, py2, 0, py2 + 36, [BRASS, BRASS3, BRASS4]); g.fill(); g.restore();
    gambleFace2(g, ex, py2 - 56, 34, sd < 0 ? 'odd' : 'even', won ? 1 : picked ? .8 : .45); fitText(g, sd < 0 ? 'ODD SAT' : 'EVEN SAT', ex, py2 + 56, 24, 170, picked ? BRASS2 : PAPER, SERIF, 'center', '700'); });
  // the number: split flaps turning to a real sat, then its last digit is picked out
  const str = sat ? hnSat(sat) : '', show = (p.stage === 'play' || p.stage === 'summary') && str, label = show ? str : '?,???,???,???', fh = hnFlapH(label, 1100);
  hnPlate(g, 150, 108, 1100, 150, .0); flapCells(g, label, 700, 183, fh, { w: .52, col: show ? PAPER : hnMix(PAPER, '#000000', .6), scramble: p.stage === 'play', flip: i => !show ? 1 : R ? 1 : (t - 300 - i * 110) / 420 });
  if (show && p.stage === 'summary' && sat) { const ex = hnFlapEnd(str, 700, fh); g.strokeStyle = ACCENT2; g.lineWidth = 3; g.beginPath(); g.moveTo(ex - fh * .26, 183 + fh * .56); g.lineTo(ex + fh * .26, 183 + fh * .56); g.stroke(); text(g, `LAST DIGIT ${sat.str.slice(-1)} · ${par.toUpperCase()}`, ex, 183 + fh * .56 + 18, 13, ACCENT2, MONO, 'center', '700'); }
  if (p.stage === 'play' || p.stage === 'summary') { text(g, `YOU CALLED ${p.choice === 'odd' ? 'ODD SAT' : 'EVEN SAT'}`, 700, 806, 26, PAPER, COND, 'center', '800'); if (show && sat) text(g, `ordinals.com/sat/${sat.str}`, 700, 840, 14, hnMix(PAPER, '#000000', .3), MONO, 'center', '700'); }
  if (p.stage === 'summary' && res && !R) rubberStamp(g, par.toUpperCase(), 700, 330, 46, res.win ? GREEN : RED, -.1, .9 * ease(t / 400));
  else if (p.stage === 'summary' && res) rubberStamp(g, par.toUpperCase(), 700, 330, 46, res.win ? GREEN : RED, -.1, .9);
}
function gambleFace2(g, x, y, r, side, a = 1) { g.save(); g.globalAlpha = a; g.translate(x, y); gambleFace(g, r, side); g.restore(); }

/* ---------- Rare find (Lab event): the side counter pauses and glows as a rare sat passes under the loupe. Nothing is paid ---------- */
// the same rare sat the side counter (p4) eases to during the lab's Rare find
function hnRareSat() { return symbolRecord('wild', 'rare-find'); }
function drawHalvingDay(now) {
  const p = pres, t = now - p.t0, R = reduced(), g = sg; darkRoom(g, .6); floodlight(g, 700, 330, 700, .18);
  const hd = halvingDay || { n: 0, at: p.t0 - 5000 }, n = hd.n, rare = p.rare || (p.rare = hnRareSat()), H0 = (HN.hunts || [])[0] || null, done = n === 0, since = now - hd.at;
  glowText(g, 'RARE FIND', 700, 66, 62, BRASS2, ACCENT); text(g, 'THE SIDE COUNTER PAUSES AND GLOWS AS A RARE SAT PASSES · NO LAYR CHANGES HANDS', 700, 112, 15, PAPER, MONO, 'center', '700');
  // the side counter: sats ticking past on split flaps; it stops on the rare one
  const label = done && rare ? hnSat(rare) : hnGroup(hnNum(n * 977 + 13, 21, H0)), fh = hnFlapH(label, 900);
  g.save(); if (done) { g.shadowColor = ACCENT2; g.shadowBlur = R ? 14 : 22 + 12 * Math.sin(now / 160); } hnPlate(g, 200, 140, 1000, 190); g.restore();
  hnEngrave(g, done ? 'COUNTER PAUSED' : 'SATS PASSING THE LOUPE', 700, 170, 17, 500, 'center', COND, '800', done ? '#0a3a52' : BRASS4);
  flapCells(g, label, 700, 246, fh, { w: .52, col: done ? '#fff' : PAPER, scramble: true, flip: i => R ? 1 : (since - i * 50) / 380 });
  hnEngrave(g, done ? 'A RARE SAT PASSED' : `${n} TO GO`, 700, 312, 14, 400, 'center', MONO, '700');
  // the loupe: sats drift past; the last one stops, glows and magnifies
  const lx = 420, ly = 600, lr = 150, zk = done ? (R ? 1 : ease(since / 900)) : 0;
  hnLoupe(g, lx, ly, lr, 2.3, (gg, cx, cy, rr) => {
    if (done && rare) { hnCoin(gg, cx, cy, rr * (.55 + .27 * zk), rare, { slot: 'wild', glow: 28 * zk, nocache: true, now }); if (!R && since < 900) { gg.fillStyle = `rgba(190,235,255,${.4 * (1 - since / 900)})`; gg.fillRect(cx - rr, cy - rr, rr * 2, rr * 2); } }
    else for (let k = 0; k < 3; k++) { const u = (((R ? 0 : since) / 1000 + k / 3) % 1), x = cx + rr * 1.1 - u * rr * 2.2; hnMiniDisc(gg, x, cy + Math.sin(k * 2 + u * 3) * rr * .22, rr * .24, ['#7a8794', '#6b7783', '#8793a0'][k], .85); }
  });
  if (done && rare) {
    const tp = R ? 1 : clamp01((since - 700) / 1500), ty = s => s.slice(0, Math.ceil(s.length * clamp01(tp * 1.5))), key = hnKey(rare, 'wild'), px = 700, py = 410, pw = 520, ph = 330;
    hnPlate(g, px, py, pw, ph); hnChip(g, '', px + 80, py + 38, key, 15, rare); hnEngrave(g, ty(`SAT ${hnSat(rare)}`), px + pw / 2 + 36, py + 84, 30, pw - 60, 'center', SERIF, '700');
    [['NAME', rare.name], ['DEGREE', rare.degree], ['BLOCK', hnGroup(rare.block)]].forEach(([a, b], n2) => { hnEngrave(g, a, px + 34, py + 134 + n2 * 38, 12, 80, 'left', MONO, '700'); hnEngrave(g, ty(String(b)), px + 120, py + 134 + n2 * 38, 22, pw - 160, 'left', SERIF, '700'); });
    wrapLines(g, rare.story || '', pw - 70, 14, SANS, '600').slice(0, 3).forEach((l, n2) => hnEngrave(g, ty(l), px + pw / 2, py + 262 + n2 * 20, 14, pw - 60, 'center', SANS, '600'));
    if (!R && since > 500 && since < 1500) rubberStamp(g, 'RARE', px + pw - 80, py - 6, 26, ACCENT2, .14, clamp01((since - 500) / 200));
  }
}

/* ---------- Period snapshot (Lab event): the week closes and the Holder Pot is divided among linked wallets (display only) ---------- */
function hnPeriod(now = Date.now()) {
  const d = new Date(now), day = (d.getUTCDay() + 6) % 7, start = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day), end = start + 7 * 864e5, f = ms => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase();
  return { from: f(start), to: f(end) };
}
function drawEpoch(now) {
  const p = pres, t = now - p.t0, R = reduced(), g = sg, per = hnPeriod(), pot = Number.isFinite(p.pot) ? p.pot : 0; darkRoom(g, .6); floodlight(g, 700, 300, 700, .15);
  glowText(g, 'PERIOD SNAPSHOT', 700, 66, 58, BRASS2, ACCENT); text(g, 'THE WEEK CLOSES ON MONDAY 00:00 UTC · THE HOLDER POT IS SHARED, ONE SHARE PER LINKED WALLET', 700, 110, 14, PAPER, MONO, 'center', '700');
  text(g, `PERIOD ${per.from} TO ${per.to} · UTC`, 700, 138, 15, ACCENT2, MONO, 'center', '700');
  // seven drawers, one per day, slide shut in turn and light a lamp
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  days.forEach((d, i) => { const x = 130 + i * 164, y = 170, w = 148, h = 92, shut = R ? 1 : ease((t - 200 - i * 170) / 360), off = (1 - shut) * 22; g.save(); g.shadowColor = '#000'; g.shadowBlur = 12; round(g, x, y + off, w, h, 6, '#0a0a0a'); g.restore();
    g.save(); g.beginPath(); g.roundRect(x, y + off, w, h, 6); g.clip(); hnOakImg(g, x, y + off, w, h, 30 + i, .12); g.restore(); round(g, x, y + off, w, h, 6, null, BRASS, 2.5); hnBrass(g, x + w / 2 - 26, y + off + 52, 52, 12, 6, 1.2); hnEngrave(g, d, x + w / 2, y + off + 28, 26, 100, 'center', SERIF, '700', PAPER); hnLamp(g, x + w - 18, y + off + 17, 6, shut >= 1 ? 1 : 0); });
  const cu = R ? 1 : ease((t - 1700) / 1200);
  if (t > (R ? 0 : 1600)) {
    hnPlate(g, 200, 300, 1000, 330);
    hnEngrave(g, 'HOLDER POT', 700, 338, 20, 300, 'center', COND, '800'); flapCells(g, fmt(Math.round(pot * cu)), 700, 410, 84, { w: .56, col: '#fff', scramble: false });
    hnEngrave(g, 'LAYR · 1% OF EVERY PAID BET · DIVIDED AMONG LINKED WALLETS HOLDING UNCOMMON OR RARER SATS', 700, 478, 14, 900, 'center', MONO, '700');
    const w = Number.isFinite(p.wallets) ? p.wallets : Number.isFinite(p.twins) ? p.twins : null;
    hnEngrave(g, w > 0 ? `= ${fmt(cu < 1 ? r2(pot / w * cu) : r2(pot / w))} LAYR PER WALLET  ·  ${fmt(w)} SAMPLE WALLETS` : 'SHARE PER WALLET: UNKNOWN', 700, 538, w > 0 ? 36 : 34, 900, 'center', SERIF, '700');
    hnEngrave(g, 'WALLET LINKING: NOT LIVE YET', 700, 588, 17, 600, 'center', COND, '800', '#6b1d18');
    if (!R && t > 1700 && t < 2700) rubberStamp(g, 'PERIOD CLOSED', 1030, 330, 28, GREEN, .1, clamp01((t - 1700) / 220));
    text(g, 'Display only: the snapshot service, wallet linking and claims need a server.', 700, 676, 17, hnMix(PAPER, '#000000', .25), SANS, 'center', 'italic 400');
  }
}
