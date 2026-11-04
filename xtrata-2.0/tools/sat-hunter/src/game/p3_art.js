
/* ---------- The records on the reels: every symbol is a real sat (number, block, rarity, degree, name) or a real fact (the pizza
   transaction), engraved on a coin and set in a specimen card with a brass tag. Tiles are drawn on demand and kept in a small cache. ---------- */
const pools = { cherry: [], lemon: [], chip: [], block: [], artifact: [], bitcoin: [], wild: [], scatter: [], vault: [], chain: [] };
// Engine slot -> the rarity kind that slot shows (the coin takes the colour of its slot's own type).
const SLOT_KEY = { cherry: 'uncommon', lemon: 'black', chip: 'palindrome', block: 'vintage', artifact: 'pizza', bitcoin: 'epic', wild: 'rare', scatter: 'nakamoto', vault: 'block9', chain: 'range' };
const NOTE = (SAT_RECORDS.notes && SAT_RECORDS.notes.tiers) || {}, NOTED = (SAT_RECORDS.notes && SAT_RECORDS.notes.definitions) || {};
// The rarity table: name on the brass tag, colour (col, with hi/lo for the coin shading, ink for type on it, edge for the rim, eng for the engraving),
// the engraving on the coin, and the plain definition from the records' own notes.
const RAR = {
  mythic: { name: 'MYTHIC', col: '#ffffff', hi: '#ffffff', lo: '#bfe9ff', ink: '#06202e', edge: '#bfe9ff', eng: '#5fa6c8', pulse: true, engraving: 'eight-ray star, double rim', def: NOTE.mythic || 'sat 0 only' },
  legendary: { name: 'LEGENDARY', col: '#ff9bd2', hi: '#ffd6ec', lo: '#b04c86', ink: '#2a0a1c', edge: '#ffc2e3', eng: '#a8447d', engraving: 'rays and a ring of dots', def: NOTE.legendary || 'first sat of a cycle (block divisible by 1,260,000)' },
  epic: { name: 'EPIC', col: '#ffd23f', hi: '#fff0a8', lo: '#a67c00', ink: '#2a1c00', edge: '#ffe27a', eng: '#9a7000', engraving: 'gold sunburst', def: NOTE.epic || 'first sat of a halving epoch (block divisible by 210,000)' },
  rare: { name: 'RARE', col: '#5fd0ff', hi: '#c4efff', lo: '#1d6f99', ink: '#03202f', edge: '#a6e6ff', eng: '#1d6f99', engraving: 'diamond lattice', def: NOTE.rare || 'first sat of a difficulty adjustment period (block divisible by 2,016)' },
  uncommon: { name: 'UNCOMMON', col: '#8be28b', hi: '#d3f7d3', lo: '#3c8a3c', ink: '#06220a', edge: '#b8f0b8', eng: '#2f7a2f', engraving: 'single ring, fine tick marks', def: NOTE.uncommon || 'first sat of a block' },
  black: { name: 'BLACK', col: '#1c1f24', hi: '#3a3f47', lo: '#0b0c0e', ink: '#e9eef5', edge: '#9fb3c8', eng: '#9fb3c8', matte: true, engraving: 'cut corner, matte', def: NOTED.black || 'the last sat of a block (a community term, not one of ord\'s rarities)' },
  palindrome: { name: 'PALINDROME', col: '#c79bff', hi: '#e8d6ff', lo: '#6a3fb0', ink: '#1a0a33', edge: '#dcc2ff', eng: '#5a2f9a', engraving: 'centre mirror line, digits mirrored', def: NOTED.palindrome || 'a sat whose decimal number reads the same both ways' },
  vintage: { name: 'VINTAGE', col: '#d8b07a', hi: '#f0d9ae', lo: '#8a6330', ink: '#2b1a07', edge: '#ecd0a0', eng: '#7a5524', engraving: 'sepia, crackle', def: NOTED.vintage || 'a sat from the first 1,000 blocks' },
  nakamoto: { name: 'NAKAMOTO', col: '#e8e3d3', hi: '#ffffff', lo: '#9c9680', ink: '#1d1a10', edge: '#fffbe8', eng: '#7a745e', engraving: 'quill-cut rim', def: NOTED.nakamoto || 'a sat from a block mined by Satoshi (Patoshi pattern)' },
  pizza: { name: 'PIZZA', col: '#ff8a3d', hi: '#ffc999', lo: '#b04a0e', ink: '#2b1000', edge: '#ffb27a', eng: '#a8420a', engraving: 'slice wedges', def: NOTED.pizza || 'the sats spent in the 22 May 2010 pizza purchase' },
  block9: { name: 'BLOCK 9', col: '#7fe3d0', hi: '#c9f6ee', lo: '#2f8f80', ink: '#032520', edge: '#b0f2e6', eng: '#2a7d70', engraving: 'nine dots', def: NOTED.block9 || 'a sat from block 9, the oldest sats known to have moved' },
  range: { name: 'SAT RANGE', col: '#00a6fb', hi: '#8fd9ff', lo: '#05689c', ink: '#021a2a', edge: '#6fd3ff', eng: '#04557f', engraving: 'ruler ticks', def: 'every sat of one block, first to last' }
};
const RAR_ORDER = ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'black', 'palindrome', 'vintage', 'nakamoto', 'pizza', 'block9', 'range'];
const hexA = (hex, a) => { const n = parseInt(String(hex).slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
const ord = n => ['1ST', '2ND', '3RD', '4TH', '5TH'][n] || `${n + 1}TH`;
const short = h => h ? `${h.slice(0, 6)}…${h.slice(-6)}` : '';
const amt = v => String(v).replace(/\.0+$/, '');
const isPal = s => { s = String(s || ''); return s.length > 1 && s === [...s].reverse().join(''); };
// Which rarity a record shows as: its slot's own type when it came from a slot, else its highest tag.
function rarityKey(rec, slot) {
  if (slot && SLOT_KEY[slot]) return SLOT_KEY[slot];
  if (!rec) return 'uncommon'; if (rec.kind === 'mythic') return 'mythic';
  if (rec.kind === 'chain' && rec.first != null) return 'range';
  if (rec.kind && rec.kind !== 'chain' && rec.kind !== 'exotic' && SLOT_KEY[rec.kind]) return SLOT_KEY[rec.kind];
  const have = [rec.rarity, ...(rec.tags || [])]; return RAR_ORDER.find(k => have.includes(k)) || 'vintage';
}
function extraTags(rec, key) { const have = [rec && rec.rarity, ...((rec && rec.tags) || [])]; return RAR_ORDER.filter(k => k !== key && have.includes(k)); }
// How a sat sits in its block: first, last or the nth.
function satLine(rec) { if (!rec || rec.block == null) return ''; const b = fmt(rec.block); if (rec.n === 0) return 'SAT ZERO OF THE GENESIS BLOCK'; if (rec.offset === 0) return `FIRST SAT OF BLOCK ${b}`; if (rec.subsidy && rec.offset === rec.subsidy - 1) return `LAST SAT OF BLOCK ${b}`; return `SAT ${fmt(rec.offset)} OF BLOCK ${b}`; }
const coinSub = rec => !rec ? '' : rec.n === 0 ? 'SAT ZERO' : rec.offset === 0 ? 'FIRST SAT' : (rec.subsidy && rec.offset === rec.subsidy - 1) ? 'LAST SAT' : rec.date ? String(rec.date).toUpperCase() : `+${fmt(rec.offset || 0)}`;
const seedOf = rec => { const s = String((rec && (rec.str || rec.tx || rec.first)) || 7); let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 2147483629; return h + 11; };
const lcg = seed => { let s = seed % 2147483629 || 5; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
function haloText(g, s, x, y, size, ink, halo, font = COND, weight = '800') { g.font = `${weight} ${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = Math.max(2, size * .22); g.strokeStyle = halo; g.strokeText(s, x, y); g.fillStyle = ink; g.fillText(s, x, y); }
function fitHalo(g, s, x, y, size, maxW, ink, halo, font = COND, weight = '800') { g.font = `${weight} ${size}px ${font}`; const k = Math.min(1, maxW / Math.max(1, g.measureText(s).width)); haloText(g, s, x, y, Math.max(5, size * k), ink, halo, font, weight); }

/* ---------- The coin: engraved per rarity, with the sat number round the rim ---------- */
function engrave(g, key, cx, cy, R, rec, A, pulse) {
  g.strokeStyle = A.eng; g.fillStyle = A.eng; g.lineWidth = Math.max(.8, R * .028); g.lineCap = 'round'; g.lineJoin = 'round';
  const ring = (rr, lw) => { g.lineWidth = lw || R * .028; g.beginPath(); g.arc(cx, cy, rr, 0, 7); g.stroke(); };
  if (key === 'mythic') { // eight-ray star
    const star = (n, ro, ri, rot, fill) => { g.beginPath(); for (let k = 0; k < n * 2; k++) { const a = rot + k * Math.PI / n, rr = k % 2 ? ri : ro; g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.closePath(); fill ? g.fill() : g.stroke(); };
    g.globalAlpha = .18 + .2 * pulse; star(8, R * 1.02, R * .27, -Math.PI / 2, true); g.globalAlpha = .9; star(8, R * 1.02, R * .27, -Math.PI / 2, false); g.globalAlpha = .5; star(8, R * .6, R * .2, -Math.PI / 2 + Math.PI / 8, false); g.globalAlpha = 1;
  } else if (key === 'legendary') { // rays and a ring of dots
    for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * R * .3, cy + Math.sin(a) * R * .3); g.lineTo(cx + Math.cos(a) * R * (k % 2 ? .66 : .86), cy + Math.sin(a) * R * (k % 2 ? .66 : .86)); g.stroke(); }
    for (let k = 0; k < 28; k++) { const a = k / 28 * Math.PI * 2; g.beginPath(); g.arc(cx + Math.cos(a) * R * .94, cy + Math.sin(a) * R * .94, Math.max(.9, R * .035), 0, 7); g.fill(); } ring(R * .5, R * .02);
  } else if (key === 'epic') { // sunburst
    g.save(); g.fillStyle = hexA(A.hi, .55); for (let k = 0; k < 24; k += 2) { const a0 = k / 24 * Math.PI * 2, a1 = (k + 1) / 24 * Math.PI * 2; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R * 1.05, a0, a1); g.closePath(); g.fill(); } g.restore();
    for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * R * .22, cy + Math.sin(a) * R * .22); g.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.lineWidth = R * .014; g.stroke(); } ring(R * .96, R * .03);
  } else if (key === 'rare') { // diamond lattice
    const s = R * .34; g.lineWidth = R * .022; g.globalAlpha = .75;
    for (let k = -7; k <= 7; k++) { g.beginPath(); g.moveTo(cx + k * s - R * 1.6, cy - R * 1.6); g.lineTo(cx + k * s + R * 1.6, cy + R * 1.6); g.stroke(); g.beginPath(); g.moveTo(cx + k * s + R * 1.6, cy - R * 1.6); g.lineTo(cx + k * s - R * 1.6, cy + R * 1.6); g.stroke(); }
    g.globalAlpha = 1; g.fillStyle = A.hi; for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if ((i + j) % 2 === 0) { g.beginPath(); g.arc(cx + i * s, cy + j * s, R * .03, 0, 7); g.fill(); }
  } else if (key === 'uncommon') { // single ring, fine tick marks
    ring(R * .62, R * .026); for (let k = 0; k < 72; k++) { const a = k / 72 * Math.PI * 2, l = k % 6 === 0 ? .14 : .07; g.beginPath(); g.moveTo(cx + Math.cos(a) * R * (1 - l), cy + Math.sin(a) * R * (1 - l)); g.lineTo(cx + Math.cos(a) * R * .99, cy + Math.sin(a) * R * .99); g.lineWidth = R * .016; g.stroke(); }
  } else if (key === 'black') { // cut corner, matte
    const h = R * .8, cut = R * .38; g.globalAlpha = .75; g.lineWidth = R * .03; g.beginPath(); g.moveTo(cx - h, cy - h); g.lineTo(cx + h - cut, cy - h); g.lineTo(cx + h, cy - h + cut); g.lineTo(cx + h, cy + h); g.lineTo(cx - h, cy + h); g.closePath(); g.stroke();
    g.globalAlpha = .35; g.lineWidth = R * .014; g.beginPath(); g.moveTo(cx - h * .86, cy - h * .86); g.lineTo(cx + h * .86 - cut, cy - h * .86); g.lineTo(cx + h * .86, cy - h * .86 + cut); g.lineTo(cx + h * .86, cy + h * .86); g.lineTo(cx - h * .86, cy + h * .86); g.closePath(); g.stroke(); g.globalAlpha = 1;
  } else if (key === 'palindrome') { // centre mirror line
    g.lineWidth = R * .022; g.beginPath(); g.moveTo(cx, cy - R * .78); g.lineTo(cx, cy + R * .78); g.stroke();
    [-1, 1].forEach(sy => { g.beginPath(); g.moveTo(cx, cy + sy * R * .86); g.lineTo(cx + R * .09, cy + sy * R * .78); g.lineTo(cx, cy + sy * R * .7); g.lineTo(cx - R * .09, cy + sy * R * .78); g.closePath(); g.fill(); });
    [-1, 1].forEach(sx => { g.globalAlpha = .55; g.beginPath(); g.moveTo(cx + sx * R * .74, cy - R * .22); g.lineTo(cx + sx * R * .56, cy); g.lineTo(cx + sx * R * .74, cy + R * .22); g.stroke(); g.globalAlpha = 1; });
  } else if (key === 'vintage') { // sepia crackle
    const r = lcg(seedOf(rec)); g.globalAlpha = .55; g.lineWidth = R * .018;
    for (let k = 0; k < 8; k++) { let x = cx + (r() - .5) * R * 2, y = cy + (r() - .5) * R * 2, a = r() * 6.28; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 7; s++) { a += (r() - .5) * 1.3; x += Math.cos(a) * R * .17; y += Math.sin(a) * R * .17; g.lineTo(x, y); if (r() < .3) { const bx = x + Math.cos(a + 1) * R * .15, by = y + Math.sin(a + 1) * R * .15; g.moveTo(x, y); g.lineTo(bx, by); g.moveTo(x, y); } } g.stroke(); }
    g.globalAlpha = .16; for (let k = 0; k < 14; k++) { g.beginPath(); g.arc(cx + (r() - .5) * R * 1.8, cy + (r() - .5) * R * 1.8, R * (.02 + r() * .05), 0, 7); g.fill(); } g.globalAlpha = 1;
  } else if (key === 'nakamoto') { // quill-cut rim and a quill
    g.lineWidth = R * .03; for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * R * .8, cy + Math.sin(a) * R * .8); g.lineTo(cx + Math.cos(a + .14) * R * .99, cy + Math.sin(a + .14) * R * .99); g.stroke(); }
    g.globalAlpha = .42; const P = (t) => [cx - R * .55 + t * R * 1.05 + Math.sin(t * Math.PI) * R * .12, cy + R * .62 - t * R * 1.2 - Math.sin(t * Math.PI) * R * .12];
    g.lineWidth = R * .035; g.beginPath(); for (let i = 0; i <= 12; i++) { const [x, y] = P(i / 12); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.lineWidth = R * .02; for (let i = 2; i <= 11; i++) { const t = i / 12, [x, y] = P(t), len = R * .34 * (1 - Math.abs(t - .55) * .9); g.beginPath(); g.moveTo(x, y); g.lineTo(x + len * .8, y + len * .45); g.moveTo(x, y); g.lineTo(x - len * .45, y - len * .8); g.stroke(); } g.globalAlpha = 1;
  } else if (key === 'pizza') { // slice wedges, a crust, pepperoni
    g.lineWidth = R * .028; for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 + Math.PI / 8; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.stroke(); }
    g.globalAlpha = .55; for (let k = 0; k < 8; k += 2) { const a = (k + 1) / 8 * Math.PI * 2; [[.62, 0], [.34, .22]].forEach(([d, o]) => { g.beginPath(); g.arc(cx + Math.cos(a + o * .5) * R * d, cy + Math.sin(a + o * .5) * R * d, R * .09, 0, 7); g.fill(); }); } g.globalAlpha = 1; ring(R * .93, R * .05); ring(R * .83, R * .016);
  } else if (key === 'block9') { // nine dots
    g.globalAlpha = .6; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { g.beginPath(); g.arc(cx + i * R * .56, cy + j * R * .56, R * .1, 0, 7); g.fill(); } g.globalAlpha = 1; ring(R * .96, R * .02);
  } else if (key === 'range') { // ruler ticks
    g.lineWidth = R * .02; const y0 = cy + R * .5; g.beginPath(); g.moveTo(cx - R * .95, y0); g.lineTo(cx + R * .95, y0); g.stroke();
    for (let k = -10; k <= 10; k++) { const x = cx + k * R * .09, major = k % 5 === 0; g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y0 - R * (major ? .24 : .12)); g.stroke(); }
    g.globalAlpha = .5; g.beginPath(); g.moveTo(cx - R * .95, cy - R * .62); g.lineTo(cx + R * .95, cy - R * .62); g.stroke(); g.globalAlpha = 1;
  }
}
// A coin of any rarity at any size. `what` is a record, a rarity key ('epic'), a slot ('wild') or an old era number (shown as an uncommon coin).
// opts: key / slot to force the colour; glow (px, default 14, 0 for none); t (ms, pulses the Mythic); center:false and rim:false to leave the type off;
// bottom: text for the lower rim (default: the sat's name on coins of radius 70 and up).
function coinFace(g, cx, cy, r, what, opts = {}) {
  const rec = what && typeof what === 'object' ? what : null;
  let key = opts.key || (opts.slot && SLOT_KEY[opts.slot]) || (rec ? rarityKey(rec) : typeof what === 'string' ? (RAR[what] ? what : SLOT_KEY[what]) : 'uncommon'); if (!RAR[key]) key = 'uncommon';
  const A = RAR[key], pulse = A.pulse ? .5 + .5 * Math.sin((opts.t || 0) / 380) : .6, glow = opts.glow == null ? 14 : opts.glow;
  g.save(); if (glow) { g.shadowColor = A.matte ? A.edge : A.col; g.shadowBlur = glow * (A.pulse ? .6 + pulse * .9 : 1); }
  g.beginPath(); g.arc(cx, cy, r, 0, 7);
  if (A.matte) g.fillStyle = lin(g, cx - r, cy - r, cx + r, cy + r, [A.hi, A.col, A.lo]); else { const rg = g.createRadialGradient(cx - r * .3, cy - r * .35, r * .1, cx, cy, r); rg.addColorStop(0, A.hi); rg.addColorStop(.55, A.col); rg.addColorStop(1, A.lo); g.fillStyle = rg; }
  g.fill(); g.restore();
  g.lineWidth = Math.max(1, r * .05); g.strokeStyle = A.edge; g.beginPath(); g.arc(cx, cy, r * .97, 0, 7); g.stroke();
  g.lineWidth = Math.max(.8, r * .02); g.strokeStyle = A.matte ? A.edge : A.lo; g.beginPath(); g.arc(cx, cy, r * .8, 0, 7); g.stroke();
  if (key === 'mythic') { g.lineWidth = Math.max(.8, r * .025); g.strokeStyle = A.eng; g.beginPath(); g.arc(cx, cy, r * .91, 0, 7); g.stroke(); g.lineWidth = Math.max(.6, r * .012); g.beginPath(); g.arc(cx, cy, r * .86, 0, 7); g.stroke(); }
  const OFF = opts.official === false ? null : officialImg(key);
  if (OFF) officialFace(g, cx, cy, r, key, OFF, rec, A, opts); else { g.save(); g.beginPath(); g.arc(cx, cy, r * .79, 0, 7); g.clip(); engrave(g, key, cx, cy, r * .79, rec, A, pulse); g.restore(); }
  const ink = A.ink, halo = A.matte ? 'rgba(28,31,36,.85)' : hexA(A.col, .8);
  if (opts.rim !== false && rec && r >= 30) {
    const top = rec.str != null ? String(rec.str) : rec.tx ? 'TX ' + short(rec.tx) : '', size = r * (top.length > 14 ? .15 : .18);
    if (top && key !== 'range') arcText(g, top, cx, cy, r * .885, size, ink, true, MONO, '800', r * .012);
    const bot = opts.bottom != null ? opts.bottom : r >= 70 && rec.name ? rec.name : ''; if (bot) arcText(g, bot, cx, cy, r * .885, r * .14, ink, false, MONO, '700', r * .02);
  }
  if (!OFF && opts.center !== false && rec && r >= 30) coinCentre(g, cx, cy, r, rec, key, A, ink, halo);
  g.lineCap = 'butt';
}
// The type in the middle of a coin: the block, and how the sat sits in it. A palindrome shows its digits mirrored about the centre line.
function coinCentre(g, cx, cy, r, rec, key, A, ink, halo) {
  if (key === 'range' && rec.first == null) return;
  const blk = rec.block != null ? fmt(rec.block) : '';
  if (key === 'palindrome' && isPal(rec.str)) {
    const s = String(rec.str), half = Math.floor(s.length / 2), left = s.slice(0, half), mid = s.length % 2 ? s[half] : '', size = Math.min(r * .34, (r * .66) / Math.max(1, half) / .62);
    text(g, 'BLOCK ' + blk, cx, cy - r * .4, r * .14, ink, MONO, 'center', '800');
    g.font = `800 ${size}px ${MONO}`; g.textBaseline = 'middle'; g.fillStyle = ink; g.textAlign = 'right'; g.fillText(left, cx - r * .07, cy);
    g.save(); g.translate(cx, 0); g.scale(-1, 1); g.textAlign = 'right'; g.fillText(left, -r * .07, cy); g.restore();
    if (mid) { haloText(g, mid, cx, cy, size, ink, halo, MONO, '800'); }
    g.strokeStyle = ink; g.lineWidth = Math.max(1, r * .025); g.beginPath(); g.moveTo(cx, cy - r * .26); g.lineTo(cx, cy + r * .26); g.stroke();
    text(g, 'MIRRORED', cx, cy + r * .42, r * .13, ink, MONO, 'center', '800'); return;
  }
  text(g, rec.n === 0 ? 'GENESIS' : 'BLOCK', cx, cy - r * .36, r * .15, ink, MONO, 'center', '800');
  fitHalo(g, blk, cx, cy + r * .02, r * .44, r * 1.1, ink, halo, COND, '800');
  const sub = key === 'pizza' && rec.satStatus === 'pending' ? 'PIZZA DAY' : coinSub(rec); if (sub) fitHalo(g, sub, cx, cy + r * .4, r * .15, r * 1.0, ink, halo, MONO, '800');
}

/* ---------- The specimen card: felt under glass in a brass frame, a coin, and an engraved brass tag ---------- */
const TS = 1.5, TILE_MAX = 96, tileCache = new Map();
/* ---------- Official rarity art (window.SAT_OFFICIAL: key -> PNG data URI) ----------
   The Xverse rare-sat badges, and the Magic Eden Black-sats tile for black sats, supplied by the owner as the reference set.
   They are loaded once; until a picture has decoded the coin draws its own engraving, and the tile and icon caches are cleared when it has. */
const OFFICIAL_ART = (typeof window !== 'undefined' && window.SAT_OFFICIAL) || {}, offImg = {};
function officialImg(key) {
  let e = offImg[key];
  if (e === undefined) {
    const src = OFFICIAL_ART[key]; if (!src) { offImg[key] = null; return null; }
    e = new Image(); e.onload = () => { e._ok = true; tileCache.clear(); if (typeof iconURL === 'object') for (const k in iconURL) delete iconURL[k]; if (typeof topperRev === 'number') topperRev++; };
    e.src = src; offImg[key] = e;
  }
  return e && e._ok ? e : null;
}
Object.keys(OFFICIAL_ART).forEach(officialImg);
// The coin face for a sat that has official art: a dark specimen-glass disc with the badge, and the block under it. (Black sats show the Magic Eden tile, cropped round.)
function officialFace(g, cx, cy, r, key, im, rec, A, opts) {
  const R = r * .79, withText = !!rec && r >= 30 && opts.center !== false;
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.clip();
  const rg = g.createRadialGradient(cx, cy - R * .25, R * .05, cx, cy, R); rg.addColorStop(0, '#193446'); rg.addColorStop(1, '#050b11'); g.fillStyle = rg; g.fillRect(cx - R, cy - R, R * 2, R * 2);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  if (key === 'black') g.drawImage(im, cx - R, cy - R, R * 2, R * 2);
  else { const box = R * (withText ? 1.34 : 1.6), k = Math.min(box / im.width, box / im.height), w = im.width * k, h = im.height * k, oy = withText ? -R * .14 : 0; g.drawImage(im, cx - w / 2, cy + oy - h / 2, w, h); }
  g.fillStyle = lin(g, cx - R, cy - R, cx + R * .2, cy + R * .2, ['rgba(255,255,255,.16)', 'rgba(255,255,255,0)']); g.beginPath(); g.moveTo(cx - R, cy - R * .2); g.arc(cx, cy, R, Math.PI * 1.1, Math.PI * 1.62); g.lineTo(cx, cy); g.fill();
  g.restore();
  g.lineWidth = Math.max(.8, r * .03); g.strokeStyle = hexA(A.edge, .85); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
  if (withText) {
    const blk = rec.block != null ? fmt(rec.block) : '', lab = rec.n === 0 ? 'GENESIS' : blk ? 'BLOCK ' + blk : coinSub(rec);
    if (lab) { g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.clip(); fitHalo(g, lab, cx, cy + R * .7, r * .15, R * 1.5, '#f1e9d6', 'rgba(0,0,0,.9)', MONO, '800'); g.restore(); }
  }
}
function plate(g, col = BRASS, seed = 1, lw = 3, glow = '') {
  g.save(); g.shadowColor = glow || '#000'; g.shadowBlur = glow ? 18 : 10; g.shadowOffsetY = glow ? 0 : 4; round(g, 12, 10, 216, 216, 12, GLASS); g.restore();
  g.save(); g.beginPath(); g.roundRect(12, 10, 216, 216, 12); g.clip();
  const rg = g.createRadialGradient(120, 92, 10, 120, 112, 150); rg.addColorStop(0, '#1b3a4a'); rg.addColorStop(1, '#091620'); g.fillStyle = rg; g.fillRect(12, 10, 216, 216);
  const r = lcg(seed * 9301 + 7); for (let i = 0; i < 520; i++) { g.fillStyle = r() < .5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.09)'; g.fillRect(12 + r() * 216, 10 + r() * 216, 1 + r() * 1.4, 1); }
  g.fillStyle = lin(g, 12, 10, 150, 140, ['rgba(255,255,255,.11)', 'rgba(255,255,255,0)']); g.beginPath(); g.moveTo(12, 10); g.lineTo(150, 10); g.lineTo(12, 140); g.closePath(); g.fill();
  g.restore();
  round(g, 12, 10, 216, 216, 12, null, BRASS, lw); round(g, 16, 14, 208, 208, 9, null, hexA(col, .55), 1.4); round(g, 11, 9, 218, 218, 13, null, BRASS4, 1);
  [[18, 16], [222, 16], [18, 220], [222, 220]].forEach(([x, y]) => rivet(g, x, y, 2.6));
}
// An engraved brass tag: lines of {s, size, font, weight, col} set into brass, with a pale edge under each letter.
function brassTag(g, x, y, w, h, lines) {
  g.save(); g.shadowColor = '#000a'; g.shadowBlur = 6; g.shadowOffsetY = 2; round(g, x, y, w, h, 6, lin(g, x, y, x, y + h, [BRASS2, BRASS, BRASS3])); g.restore();
  g.save(); g.beginPath(); g.roundRect(x, y, w, h, 6); g.clip(); brushed(g, x, y, w, h, 'rgba(0,0,0,0)', Math.round(x + y)); g.fillStyle = lin(g, x, y, x, y + h, ['rgba(255,255,255,.35)', 'rgba(255,255,255,0)', 'rgba(0,0,0,.22)']); g.fillRect(x, y, w, h); g.restore();
  round(g, x, y, w, h, 6, null, BRASS4, 1.4); rivet(g, x + 7, y + h / 2, 2.4); rivet(g, x + w - 7, y + h / 2, 2.4);
  lines.forEach(l => { if (!l || !l.s) return; const font = l.font || COND, weight = l.weight || '800', maxW = l.maxW || w - 30; g.font = `${weight} ${l.size}px ${font}`; const k = Math.min(1, maxW / Math.max(1, g.measureText(l.s).width)), sz = Math.max(6, l.size * k);
    text(g, l.s, x + w / 2, l.y + .9, sz, 'rgba(255,238,180,.65)', font, 'center', weight); text(g, l.s, x + w / 2, l.y, sz, l.col || '#2b1a05', font, 'center', weight); });
}
function chipRow(g, tags, x, y, maxX) {
  tags.forEach(k => { const A = RAR[k]; g.font = `800 9px ${COND}`; const w = Math.ceil(g.measureText(A.name).width) + 12; if (x + w > maxX) return; round(g, x, y, w, 15, 7, A.matte ? A.col : A.col, A.matte ? A.edge : A.lo, 1); text(g, A.name, x + w / 2, y + 8, 9, A.ink, COND, 'center', '800'); x += w + 4; });
}
const BANNER = { bitcoin: 'JACKPOT', wild: 'WILD', scatter: 'SCATTER', vault: 'BONUS', chain: 'BONUS' };
function banner(g, label, xr, y) {
  g.font = `900 10px ${SERIF}`; const w = Math.ceil(g.measureText(label).width) + 20, x = xr - w;
  g.save(); g.shadowColor = '#0009'; g.shadowBlur = 4; g.shadowOffsetY = 1; g.beginPath(); g.moveTo(x - 5, y); g.lineTo(xr, y); g.lineTo(xr, y + 16); g.lineTo(x - 5, y + 16); g.lineTo(x + 2, y + 8); g.closePath(); g.fillStyle = lin(g, x, y, x, y + 16, [BRASS2, BRASS, BRASS3]); g.fill(); g.restore();
  text(g, label, x + w / 2 + 1, y + 8.5, 10, '#2b1a05', SERIF, 'center', '900'); return x - 5;
}
function sash(g, rec) {
  g.save(); g.translate(120, 128); g.rotate(-.09); const w = 206, h = 24; g.shadowColor = '#000b'; g.shadowBlur = 7; g.shadowOffsetY = 2;
  g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2, -h / 2); g.lineTo(w / 2 - 9, 0); g.lineTo(w / 2, h / 2); g.lineTo(-w / 2, h / 2); g.lineTo(-w / 2 + 9, 0); g.closePath(); g.fillStyle = lin(g, 0, -h / 2, 0, h / 2, ['#a42a22', '#5e1210']); g.fill(); g.shadowColor = 'transparent'; g.strokeStyle = BRASS2; g.lineWidth = 1.2; g.stroke();
  fitText(g, `NOT YET MINED · ${String(rec.when || 'DUE LATER').toUpperCase()}`, 0, 1, 11, w - 40, PAPER, COND, 'center', '800'); g.restore();
}
// A range tile's coin is a loupe over a ruler: the block in the lens, the first and last sat under it.
function rangeLens(g, cx, cy, r, rec, A) {
  g.save(); g.translate(cx, cy); g.rotate(Math.PI / 4);
  g.fillStyle = lin(g, 0, -r * .13, 0, r * .13, [BRASS2, BRASS3]); g.beginPath(); g.roundRect(r * .9, -r * .12, r * .7, r * .24, r * .08); g.fill();
  g.fillStyle = lin(g, 0, -r * .2, 0, r * .2, [OAK3, OAK]); g.beginPath(); g.roundRect(r * 1.45, -r * .2, r * .62, r * .4, r * .18); g.fill(); g.strokeStyle = '#000a'; g.lineWidth = 1; g.stroke(); g.restore();
  g.save(); g.shadowColor = A.col; g.shadowBlur = 12; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fillStyle = BRASS; g.fill(); g.restore();
  g.beginPath(); g.arc(cx, cy, r, 0, 7); g.strokeStyle = lin(g, cx - r, cy - r, cx + r, cy + r, [BRASS2, BRASS3, BRASS2]); g.lineWidth = r * .22; g.stroke();
  for (let k = 0; k < 36; k++) { const a = k / 36 * Math.PI * 2; g.strokeStyle = BRASS4; g.lineWidth = 1; g.beginPath(); g.moveTo(cx + Math.cos(a) * r * 1.02, cy + Math.sin(a) * r * 1.02); g.lineTo(cx + Math.cos(a) * r * 1.1, cy + Math.sin(a) * r * 1.1); g.stroke(); }
  g.save(); g.beginPath(); g.arc(cx, cy, r * .9, 0, 7); g.clip(); const rg = g.createRadialGradient(cx - r * .3, cy - r * .3, r * .1, cx, cy, r); rg.addColorStop(0, '#1d5a78'); rg.addColorStop(1, '#06202e'); g.fillStyle = rg; g.fillRect(cx - r, cy - r, r * 2, r * 2);
  engrave(g, 'range', cx, cy, r * .9, rec, { eng: A.hi }, 1);
  text(g, 'BLOCK', cx, cy - r * .5, r * .2, A.edge, MONO, 'center', '800'); fitText(g, fmt(rec.block), cx, cy - r * .12, r * .6, r * 1.5, '#fff', COND, 'center', '800');
  g.fillStyle = lin(g, cx - r, cy - r, cx + r * .2, cy + r * .2, ['rgba(255,255,255,.28)', 'rgba(255,255,255,0)']); g.beginPath(); g.ellipse(cx - r * .28, cy - r * .42, r * .5, r * .26, -.6, 0, 7); g.fill(); g.restore();
}
const BIGHASH = /^[0-9a-f]{40,}$/i;
function tagLines(slot, rec, key) {
  const nm = RAR[key].name;
  if (key === 'range') { const n = rec.last - rec.first + 1; return [{ s: nm, size: 21, font: SERIF, y: 174 }, { s: `BLOCK ${fmt(rec.block)} · ${fmt(n)} SATS`, size: 12, y: 192 }, { s: `${amt((rec.subsidy || 0) / 1e8)} BTC SUBSIDY`, size: 10.5, font: MONO, weight: '700', col: '#4d3612', y: 207 }]; }
  if (key === 'pizza') { const f = rec.fact || '', head = [{ s: nm, size: 21, font: SERIF, y: 174 }, { s: rec.label || 'THE PURCHASE', size: 12, y: 192 }];
    if (rec.n == null && !BIGHASH.test(f) && f.length > 27) { const mid = f.lastIndexOf(' ', Math.ceil(f.length / 2) + 4), cut = mid > 8 ? mid : Math.floor(f.length / 2); return head.concat([{ s: f.slice(0, cut), size: 9.5, font: MONO, weight: '700', col: '#4d3612', y: 203 }, { s: f.slice(cut).trim(), size: 9.5, font: MONO, weight: '700', col: '#4d3612', y: 213 }]); }
    return head.concat([{ s: rec.n != null ? rec.degree : BIGHASH.test(f) ? short(f) : f, size: 10.5, font: MONO, weight: '700', col: '#4d3612', y: 207 }]); }
  const A = key === 'black' && rec.blackName ? rec.blackName.toUpperCase() : slot === 'wild' ? 'RARE · WILD' : nm;
  return [{ s: A, size: 21, font: SERIF, y: 174 }, { s: satLine(rec), size: 12, y: 192 }, { s: rec.degree || '', size: 11, font: MONO, weight: '700', col: '#4d3612', y: 207 }];
}
function buildTile(slot, e) {
  const rec = e.rec, key = e.key, A = RAR[key], c = canvas(Math.round(240 * TS), Math.round(240 * TS)), g = c.getContext('2d'); g.scale(TS, TS);
  plate(g, A.col, (e.i || 0) + 3, 3, key === 'epic' ? hexA(A.col, .55) : '');
  if (!rec) { glowText0(g, 'NO RECORD', 120, 112, 26, BRASS2); text(g, 'records not loaded', 120, 140, 12, SMOKE, MONO, 'center', '700'); return c; }
  const bn = BANNER[slot], left = bn ? banner(g, bn, 222, 15) - 6 : 222; chipRow(g, extraTags(rec, key).slice(0, bn ? 2 : 3), 24, 15, left);
  if (key === 'range' && rec.first != null) rangeLens(g, 112, 94, 42, rec, A); else coinFace(g, 120, 94, 52, rec, { key, glow: 10 });
  if (key === 'epic' && rec.mined === false) sash(g, rec);
  const pend = key === 'pizza' && rec.satStatus === 'pending', nl = pend ? 'SAT RANGE: PENDING INDEX' : key === 'range' ? `${rec.first} → ${rec.last}` : rec.name ? [...rec.name].join(' ') : '';
  if (nl) fitText(g, nl, 120, 153, 10.5, 196, pend ? BRASS2 : ACCENT2, MONO, 'center', '700');
  brassTag(g, 22, 160, 196, 58, tagLines(slot, rec, key));
  return c;
}
function glowText0(g, s, x, y, size, color) { g.save(); g.shadowColor = color; g.shadowBlur = size * .4; text(g, s, x, y, size, color, SERIF, 'center', '800'); g.restore(); }
function tileGet(slot, i) {
  const k = slot + ':' + i; let c = tileCache.get(k); if (c) { tileCache.delete(k); tileCache.set(k, c); return c; }
  c = buildTile(slot, pools[slot][i]); tileCache.set(k, c); if (tileCache.size > TILE_MAX) tileCache.delete(tileCache.keys().next().value); return c;
}

/* ---------- Brass-and-oak counters, sample tubes ---------- */
// Counter cells (the old split-flap name stays): one numeral per brass-framed cell, tumbling when flip(i) is below 1.
function flapCells(g, s, cx, cy, h, opts = {}) {
  const chars = [...s], cw = h * (opts.w || .64), gap = h * .08, isSep = ch => ch === ',' || ch === '.', ww = chars.map(ch => isSep(ch) ? cw * .32 : cw), total = ww.reduce((a, b) => a + b, 0) + gap * (chars.length - 1); let x = cx - total / 2;
  chars.forEach((ch, i) => {
    const w = ww[i];
    if (isSep(ch)) { text(g, ch, x + w / 2, cy + h * .28, h * .5, opts.col || BRASS2, COND, 'center', '800'); x += w + gap; return; }
    const u = opts.flip ? clampF(opts.flip(i)) : 1, shown = u < 1 && opts.scramble ? String(Math.floor(Math.random() * 10)) : ch;
    round(g, x, cy - h / 2, w, h, h * .08, lin(g, 0, cy - h / 2, 0, cy + h / 2, ['#2c1a0e', '#150b05', '#0c0603', '#1e1209']), BRASS3, 1.5);
    g.save(); g.beginPath(); g.rect(x, cy - h / 2, w, h); g.clip(); text(g, shown, x + w / 2, cy + h * .04, h * .82, opts.col || BRASS2, COND, 'center', '800');
    if (u < 1) { const k = Math.abs(Math.cos(u * Math.PI)); g.fillStyle = '#0c0603'; g.fillRect(x, cy - h / 2 + (u < .5 ? 0 : h / 2), w, h / 2 * (1 - k)); }
    g.restore(); g.fillStyle = '#000'; g.fillRect(x, cy - 1.2, w, 2.4); g.fillStyle = hexA(BRASS2, .18); g.fillRect(x, cy + 1.2, w, 1);
    x += w + gap;
  });
  return total;
}
const clampF = x => Math.max(0, Math.min(1, x));
// A sealed sample tube lying in its rack cell (x, y, w, h): glass body, brass collar, cork and a wax seal. open (0 to 1) lifts the cork and breaks the seal.
function sealedBlock(g, x, y, w, h, open = 0, glow = 0) {
  const T = Math.min(h * .62, 100), L = Math.min(w * .88, T * 4.6), cy = y + h / 2, x0 = x + (w - L) / 2, lift = Math.max(0, Math.min(1, open)), cw = T * .3;
  g.save(); g.shadowColor = glow ? ACCENT : '#000'; g.shadowBlur = 8 + glow * 22; g.shadowOffsetY = glow ? 0 : 4;
  g.beginPath(); g.moveTo(x0 + cw, cy - T / 2); g.lineTo(x0 + L - T / 2, cy - T / 2); g.arc(x0 + L - T / 2, cy, T / 2, -Math.PI / 2, Math.PI / 2); g.lineTo(x0 + cw, cy + T / 2); g.closePath(); g.fillStyle = lin(g, 0, cy - T / 2, 0, cy + T / 2, ['rgba(120,200,235,.5)', 'rgba(20,70,95,.65)', 'rgba(10,40,58,.85)']); g.fill(); g.restore();
  g.strokeStyle = 'rgba(190,235,255,.55)'; g.lineWidth = 2; g.stroke();
  g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.roundRect(x0 + cw + T * .3, cy - T / 2 + T * .09, L - cw - T * 1.2, T * .1, T * .05); g.fill();
  const lab = lin(g, 0, cy - T * .26, 0, cy + T * .26, [PAPER, '#d8cdb0']); round(g, x0 + L * .38, cy - T * .26, L * .32, T * .52, 3, lab, '#7a6a48', 1);
  for (let k = 0; k < 3; k++) { g.fillStyle = '#7a6a48'; g.fillRect(x0 + L * .38 + 8, cy - T * .15 + k * T * .15, L * .32 - 16, 1.5); }
  g.save(); g.translate(-lift * T * .5, -lift * T * .12); g.rotate(-lift * .18); // the collar and cork
  g.fillStyle = lin(g, 0, cy - T * .56, 0, cy + T * .56, [BRASS2, BRASS3, BRASS]); g.beginPath(); g.roundRect(x0, cy - T * .56, cw, T * 1.12, 4); g.fill(); g.strokeStyle = BRASS4; g.lineWidth = 1; g.stroke();
  g.fillStyle = lin(g, 0, cy - T * .34, 0, cy + T * .34, ['#c9965a', '#9a6a36', '#b4814a']); g.beginPath(); g.roundRect(x0 - T * .38, cy - T * .34, T * .42, T * .68, 5); g.fill(); g.strokeStyle = '#5a3a1a'; g.lineWidth = 1; g.stroke();
  const r = lcg(Math.round(x + y) + 3); g.fillStyle = 'rgba(60,35,15,.35)'; for (let k = 0; k < 10; k++) g.fillRect(x0 - T * .38 + r() * T * .4, cy - T * .32 + r() * T * .64, 1.5, 1.5);
  if (lift < .5) { g.fillStyle = lin(g, 0, cy - T * .6, 0, cy + T * .6, ['#b8322a', '#7e1d18']); g.beginPath(); g.roundRect(x0 + cw * .3, cy - T * .62, cw * .4, T * 1.24, 3); g.fill(); }
  g.restore();
}
function drawLoupe(g, cx, cy, r, ang = -Math.PI / 4) { // a brass jeweller's loupe with a handle, lens left clear for the caller to draw through
  g.save(); g.translate(cx, cy); g.rotate(ang + Math.PI); g.fillStyle = lin(g, 0, -r * .1, 0, r * .1, [BRASS2, BRASS3]); g.beginPath(); g.roundRect(r * .95, -r * .1, r * .6, r * .2, r * .07); g.fill();
  g.fillStyle = lin(g, 0, -r * .17, 0, r * .17, [OAK3, OAK]); g.beginPath(); g.roundRect(r * 1.45, -r * .17, r * .62, r * .34, r * .16); g.fill(); g.restore();
  g.save(); g.shadowColor = ACCENT; g.shadowBlur = r * .3; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.strokeStyle = lin(g, cx - r, cy - r, cx + r, cy + r, [BRASS2, BRASS3, BRASS2]); g.lineWidth = r * .16; g.stroke(); g.restore();
  g.beginPath(); g.arc(cx, cy, r * .92, 0, 7); g.strokeStyle = BRASS4; g.lineWidth = 1.2; g.stroke();
}
function glassLens(g, cx, cy, r) { const rg = g.createRadialGradient(cx - r * .35, cy - r * .4, r * .05, cx, cy, r); rg.addColorStop(0, 'rgba(180,235,255,.22)'); rg.addColorStop(1, 'rgba(0,70,110,.18)'); g.fillStyle = rg; g.beginPath(); g.arc(cx, cy, r * .92, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.ellipse(cx - r * .3, cy - r * .42, r * .42, r * .2, -.6, 0, 7); g.fill(); }

/* ---------- Pools: the records behind each symbol ---------- */
const iconURL = {};
function rebuildPools() {
  tileCache.clear();
  for (const s of Object.keys(pools)) { const list = (SAT_RECORDS.types && SAT_RECORDS.types[s]) || []; pools[s] = (list.length ? list : [null]).map((rec, i) => ({ rec, i, key: rarityKey(rec, s), get tile() { return tileGet(s, i); } })); }
  for (const k in iconURL) delete iconURL[k];
}
rebuildPools();
function refreshLiveTiles() { for (const k in iconURL) delete iconURL[k]; refaceIdle(); screenDirty = true; }
const tileFor = (s, f) => tileGet(s, f >= 0 && f < pools[s].length ? f : 0);
const faceItem = (s, f) => { const p = pools[s]; return p ? p[f >= 0 && f < p.length ? f : 0] : null; };
const cellRecord = (c, r) => { const it = faceItem(state.grid[c][r], faces[c][r]); return it ? it.rec : null; }; // the real record showing in a cell
// Which record shows in a cell is chosen with Math.random AFTER the engine has fixed the result (never the engine's rng).
const pickFace = s => pools[s] && pools[s].length ? Math.floor(Math.random() * pools[s].length) : 0;
let faces = state.grid.map(col => col.map(s => pickFace(s)));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c] && faces[c][r] >= 0 && faces[c][r] < pools[s].length ? faces[c][r] : pickFace(s))); }
// A round's own little generator (FNV hash of its id): used only to choose which record a bonus shows, never a prize.
function roundHash(id, salt = '') { let h = 2166136261; for (const ch of String(id || 'sat-hunter') + salt) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }
function permFor(id, n) { const a = [...Array(n).keys()]; let s = roundHash(id, 'perm') || 1; const r = () => (s = Math.imul(s ^ s >>> 15, 2246822507) + 1 >>> 0) / 4294967296; for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// A record of a slot's type: random with no seed (Math.random), or the same one every time for a given seed (permFor). Never the engine's rng.
function symbolRecord(slot, seed) { const list = (SAT_RECORDS.types && SAT_RECORDS.types[slot]) || []; if (!list.length) return null; if (seed == null) return list[Math.floor(Math.random() * list.length)]; return list[permFor(String(seed) + ':' + slot, list.length)[0]]; }
function symbolRecords(slot, seed, n) { const list = (SAT_RECORDS.types && SAT_RECORDS.types[slot]) || []; return permFor(String(seed) + ':' + slot, list.length).slice(0, n).map(i => list[i]); }
// Every real sat with a number, once each, in one fixed order (the tape, the topper and the ticker draw from it).
let satListMemo = null;
function allSats() { if (satListMemo) return satListMemo; const seen = new Set(), out = []; for (const s of Object.keys(SAT_RECORDS.types || {})) for (const rec of SAT_RECORDS.types[s]) if (rec && rec.str != null && !seen.has(rec.str)) { seen.add(rec.str); out.push(rec); } satListMemo = permFor('sat-list', out.length).map(i => out[i]); return satListMemo; }
