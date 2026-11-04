
/* ---------- The records on the reels: real halving blocks, the subsidy schedule, coinbase messages decoded from the
   coinbase scripts, live mined blocks, the supply cap and the Bitcoin mark. Each is drawn as a data tile. ---------- */
const pools = { cherry: [], lemon: [], chip: [], block: [], artifact: [], bitcoin: [], wild: [], scatter: [], vault: [], chain: [] };
const HALV_IDX = { cherry: 0, lemon: 1, chip: 2, block: 3 };
const ord = n => ['1ST', '2ND', '3RD', '4TH', '5TH'][n] || `${n + 1}TH`;
const short = h => h ? `${h.slice(0, 6)}…${h.slice(-6)}` : '';
const amt = v => String(v).replace(/\.0+$/, '');
function plate(g, tab, seed = 1, lw = 3, glow = '') {
  g.save(); g.shadowColor = glow || '#000'; g.shadowBlur = glow ? 18 : 10; g.shadowOffsetY = glow ? 0 : 4; round(g, 12, 10, 216, 216, 12, STEEL); g.restore();
  g.save(); g.beginPath(); g.roundRect(12, 10, 216, 216, 12); g.clip(); brushed(g, 12, 10, 216, 216, STEEL2, seed); g.fillStyle = lin(g, 0, 10, 0, 226, ['#ffffff14', '#00000000', '#00000033']); g.fillRect(12, 10, 216, 216); g.restore();
  round(g, 12, 10, 216, 34, [12, 12, 0, 0], tab); round(g, 12, 10, 216, 216, 12, null, glow || '#000', lw);
  [[24, 56], [216, 56], [24, 214], [216, 214]].forEach(([x, y]) => rivet(g, x, y, 3.2));
}
// A halving block: height, date, the subsidy change, and the block's own hash (variant 1 shows its coinbase text instead).
function halvingTile(sym, v = 0) {
  const i = HALV_IDX[sym], H = REC.halvings[i] || { height: (i + 1) * 210000, from: 50 / 2 ** i, to: 25 / 2 ** i, when: '', hash: '', coinbase: '' }, c = canvas(240, 240), g = c.getContext('2d');
  plate(g, TAB[sym], 3 + i + v * 7);
  text(g, `${ord(i)} HALVING · ${(H.date || '').slice(0, 4)}`, 120, 28, 17, INK, COND, 'center', '800');
  text(g, 'BLOCK', 120, 64, 13, SMOKE, MONO, 'center', '700');
  fitText(g, fmt(H.height), 120, 100, 56, 196, '#fff', COND, 'center', '800');
  if (!v) { round(g, 36, 134, 168, 40, 20, '#0b0c0e', TAB[sym], 2); text(g, `${amt(H.from)} → ${amt(H.to)} BTC`, 120, 155, 22, AMBER2, COND, 'center', '800'); }
  else { round(g, 26, 132, 188, 44, 6, '#0b0c0e', TAB[sym], 1.5); const ls = wrapLines(g, H.coinbase || '', 176, 13, MONO, '700'); ls.slice(0, 2).forEach((l, k) => text(g, l, 120, 146 + k * 16 - (ls.length > 1 ? 0 : -8), 13, '#cfe9d8', MONO, 'center', '700')); }
  text(g, (H.when || '').toUpperCase(), 120, 190, 15, PAPER, COND, 'center', '700'); text(g, short(H.hash), 120, 210, 11, SMOKE, MONO, 'center', '400');
  return c;
}
// The next halving: block 1,050,000 with the live count of blocks still to go (re-drawn when the tip is read).
function nextTile(v = 0) {
  const c = canvas(240, 240), g = c.getContext('2d'), left = blocksLeft();
  plate(g, AMBER, 41 + v, 3, '#ffd23f88'); hazard(g, 12, 10, 216, 34); round(g, 52, 15, 136, 24, 4, INK); text(g, 'NEXT HALVING', 120, 28, 16, AMBER, COND, 'center', '800');
  text(g, 'BLOCK', 120, 64, 13, SMOKE, MONO, 'center', '700'); fitText(g, fmt(REC.next.height || 1050000), 120, 98, 52, 200, '#fff', COND, 'center', '800');
  round(g, 30, 128, 180, 46, 6, '#0b0c0e', AMBER3, 2);
  if (Number.isFinite(left)) { fitText(g, `${fmt(left)} TO GO`, 120, 146, 26, 168, AMBER2, COND, 'center', '800'); text(g, staleTag(), 120, 166, 10, chain.stale ? RED2 : GREEN2, MONO, 'center', '700'); }
  else text(g, 'TIP UNKNOWN', 120, 151, 20, RED2, COND, 'center', '800');
  text(g, `3.125 → ${REC.next.subsidyAfter || 1.5625} BTC`, 120, 192, 17, PAPER, COND, 'center', '700');
  const est = Number.isFinite(left) ? new Date(Date.now() + left * 600e3) : null; text(g, est ? `EST. ${est.toLocaleString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase()} · AT 10 MIN A BLOCK` : '', 120, 211, 10, SMOKE, MONO, 'center', '400');
  return c;
}
// Split-flap cells: one character per flap, a hinge line across the middle. flipOf(i) gives 0..1 flip progress for cell i.
function flapCells(g, s, cx, cy, h, opts = {}) {
  const chars = [...s], cw = h * (opts.w || .64), gap = h * .08, isSep = ch => ch === ',' || ch === '.', ww = chars.map(ch => isSep(ch) ? cw * .32 : cw), total = ww.reduce((a, b) => a + b, 0) + gap * (chars.length - 1); let x = cx - total / 2;
  chars.forEach((ch, i) => {
    const w = ww[i];
    if (isSep(ch)) { text(g, ch, x + w / 2, cy + h * .28, h * .5, opts.col || AMBER2, COND, 'center', '800'); x += w + gap; return; }
    const u = opts.flip ? clampF(opts.flip(i)) : 1, shown = u < 1 && opts.scramble ? String(Math.floor(Math.random() * 10)) : ch;
    round(g, x, cy - h / 2, w, h, h * .08, lin(g, 0, cy - h / 2, 0, cy + h / 2, ['#2a2d33', '#141619', '#0d0e10', '#1d2025']), '#000', 1.5);
    g.save(); g.beginPath(); g.rect(x, cy - h / 2, w, h); g.clip(); text(g, shown, x + w / 2, cy + h * .04, h * .82, opts.col || AMBER2, COND, 'center', '800');
    if (u < 1) { const k = Math.abs(Math.cos(u * Math.PI)); g.fillStyle = '#0d0e10'; g.fillRect(x, cy - h / 2 + (u < .5 ? 0 : h / 2), w, h / 2 * (1 - k)); }
    g.restore(); g.fillStyle = '#000'; g.fillRect(x, cy - 1.5, w, 3); g.fillStyle = '#ffffff10'; g.fillRect(x, cy + 1.5, w, 1);
    x += w + gap;
  });
  return total;
}
const clampF = x => Math.max(0, Math.min(1, x));
// The supply cap, 21,000,000: the jackpot symbol, on a gold-framed split-flap board.
function capTile(v = 0) {
  const c = canvas(240, 240), g = c.getContext('2d');
  g.save(); g.shadowColor = AMBER; g.shadowBlur = 18; round(g, 12, 10, 216, 216, 12, lin(g, 0, 10, 0, 226, ['#2b2410', '#0d0c08']), AMBER, 5); g.restore();
  round(g, 22, 20, 196, 196, 8, null, '#ffd23f66', 1.5);
  spaced(g, 'SUPPLY CAP', 120, 46, 16, 3, AMBER2, '800'); flapCells(g, '21,000,000', 120, 110, 44, { w: .5 });
  text(g, 'BTC · EVER', 120, 156, 20, '#fff', COND, 'center', '800');
  round(g, 22, 178, 196, 30, 6, lin(g, 0, 178, 0, 208, [AMBER2, AMBER, AMBER3])); spaced(g, 'JACKPOT', 120, 193, 16, 4, INK, '800');
  return c;
}
// ₿, the wild: the public-domain Bitcoin mark from Bitcoin.org, as supplied.
function wildTile(v = 0) {
  const c = canvas(240, 240), g = c.getContext('2d');
  g.save(); g.shadowColor = ORANGE; g.shadowBlur = 20; round(g, 12, 10, 216, 216, 12, lin(g, 0, 10, 0, 226, ['#2a1c0a', '#100b05']), ORANGE, 4); g.restore();
  const gr = g.createRadialGradient(120, 108, 10, 120, 108, 110); gr.addColorStop(0, '#f7931a55'); gr.addColorStop(1, '#f7931a00'); g.fillStyle = gr; g.fillRect(12, 10, 216, 216);
  btcLogo(g, 120, 104, 138);
  round(g, 30, 182, 180, 30, 6, lin(g, 0, 182, 0, 212, ['#ffc061', ORANGE, '#a85d00'])); spaced(g, 'WILD', 120, 197, 17, 6, INK, '800');
  return c;
}
// The subsidy coin: 50, 25, 12.5, 6.25 or 3.125 BTC, one per era of the schedule (the scatter).
const ERA_COL = [['#fff1b8', '#ffd23f', '#a07a08'], ['#f2f4f7', '#c3c9d1', '#6f7781'], ['#ffd9b0', '#e3913f', '#8a4c12'], ['#d9f2e3', '#7fc79c', '#2f6b48'], ['#d8ecff', '#7fb3e6', '#2f5c8a']];
function coinFace(g, cx, cy, r, era, opts = {}) {
  const S = REC.subsidies[era] || { btc: 50 / 2 ** era, from: era * 210000, to: (era + 1) * 210000 - 1 }, col = ERA_COL[era % 5];
  g.save(); g.shadowColor = col[1]; g.shadowBlur = opts.glow == null ? 16 : opts.glow; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fillStyle = lin(g, cx - r, cy - r, cx + r, cy + r, col); g.fill(); g.restore();
  g.lineWidth = r * .06; g.strokeStyle = col[0]; g.beginPath(); g.arc(cx, cy, r * .97, 0, 7); g.stroke(); g.lineWidth = r * .02; g.strokeStyle = col[2]; g.beginPath(); g.arc(cx, cy, r * .8, 0, 7); g.stroke();
  // reeded edge ticks
  g.save(); g.strokeStyle = col[2] + '88'; g.lineWidth = Math.max(1, r * .012); for (let k = 0; k < 72; k++) { const a = k / 72 * Math.PI * 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * r * .86, cy + Math.sin(a) * r * .86); g.lineTo(cx + Math.cos(a) * r * .93, cy + Math.sin(a) * r * .93); g.stroke(); } g.restore();
  const s = amt(S.btc); fitText(g, s, cx, cy - r * .06, r * (s.length > 3 ? .62 : .82), r * 1.35, '#1a1406', COND, 'center', '800');
  text(g, 'BTC', cx, cy + r * .42, r * .2, '#1a1406', COND, 'center', '800');
  if (opts.label !== false) { text(g, `ERA ${era + 1}`, cx, cy - r * .58, r * .15, col[2], MONO, 'center', '700'); }
}
function coinTile(era) {
  const c = canvas(240, 240), g = c.getContext('2d'), S = REC.subsidies[era] || { from: era * 210000, to: (era + 1) * 210000 - 1 };
  round(g, 12, 10, 216, 216, 12, lin(g, 0, 10, 0, 226, ['#1d2025', '#0e1012']), '#000', 2);
  coinFace(g, 120, 104, 82, era);
  round(g, 28, 192, 184, 26, 5, '#0b0c0e', ERA_COL[era % 5][1], 1.5); text(g, `BLOCK SUBSIDY · ${fmt(S.from)}–${fmt(S.to)}`, 120, 205, 11, PAPER, MONO, 'center', '700');
  return c;
}
// A coinbase message: text a miner wrote into a historic block's coinbase, decoded from the block data, with its height.
function sealedBlock(g, x, y, w, h, open = 0, glow = 0) {
  g.save(); g.shadowColor = glow ? AMBER : '#000'; g.shadowBlur = 8 + glow * 18; g.shadowOffsetY = glow ? 0 : 4; round(g, x, y, w, h, 8, lin(g, x, y, x, y + h, ['#30343a', '#1a1c20'])); g.restore();
  brushed(g, x + 3, y + 3, w - 6, h - 6, '#24272c', Math.round(x + y));
  g.strokeStyle = '#000'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, w - 6, h - 6);
  // the block's cross bands and its amber seal
  g.fillStyle = '#ffd23f22'; g.fillRect(x + w * .46, y + 3, w * .08, h - 6); g.fillRect(x + 3, y + h * .44, w - 6, h * .12);
  if (open < .5) { const sx = x + w / 2, sy = y + h / 2, r = Math.min(w, h) * .16; g.save(); g.shadowColor = AMBER; g.shadowBlur = 10 + glow * 12; g.fillStyle = lin(g, sx - r, sy - r, sx + r, sy + r, [AMBER2, AMBER, AMBER3]); g.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + Math.PI / 6; g.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); } g.closePath(); g.fill(); g.restore(); text(g, 'CB', sx, sy + 1, r * .78, INK, COND, 'center', '800'); }
  [[x + 10, y + 10], [x + w - 10, y + 10], [x + 10, y + h - 10], [x + w - 10, y + h - 10]].forEach(([a, b]) => rivet(g, a, b, 3));
}
function messageTile(m, i) {
  const c = canvas(240, 240), g = c.getContext('2d');
  round(g, 12, 10, 216, 216, 10, '#06120c', AMBER3, 3);
  round(g, 12, 10, 216, 34, [10, 10, 0, 0], lin(g, 0, 10, 0, 44, [AMBER2, AMBER])); text(g, `COINBASE · #${fmt(m.height)}`, 120, 28, 16, INK, COND, 'center', '800');
  g.save(); g.globalAlpha = .08; g.fillStyle = GREEN2; for (let y = 48; y < 226; y += 4) g.fillRect(14, y, 212, 1.4); g.restore();
  const t = m.text.length > 96 ? m.text.slice(0, 93) + '…' : m.text, size = t.length > 60 ? 13 : t.length > 30 ? 15 : 19, ls = wrapLines(g, '“' + t + '”', 188, size, MONO, '700'), top = 118 - (Math.min(ls.length, 6) - 1) * (size + 5) / 2;
  ls.slice(0, 6).forEach((l, k) => text(g, l, 120, top + k * (size + 5), size, '#c9f5d9', MONO, 'center', '700'));
  round(g, 12, 194, 216, 32, [0, 0, 10, 10], '#0b1f15'); text(g, `${m.pool.toUpperCase()} · ${m.when.toUpperCase()}`, 120, 210, 11, GREEN2, MONO, 'center', '700');
  return c;
}
// A mined block: a real recent block height with the pool that mined it (refreshed from the live chain).
function cube(g, cx, cy, s, top = AMBER, left = '#9c7a0c', right = '#6b5308') {
  const h = s * .5; g.fillStyle = top; g.beginPath(); g.moveTo(cx, cy - s); g.lineTo(cx + s, cy - h); g.lineTo(cx, cy); g.lineTo(cx - s, cy - h); g.closePath(); g.fill();
  g.fillStyle = left; g.beginPath(); g.moveTo(cx - s, cy - h); g.lineTo(cx, cy); g.lineTo(cx, cy + s); g.lineTo(cx - s, cy + h); g.closePath(); g.fill();
  g.fillStyle = right; g.beginPath(); g.moveTo(cx + s, cy - h); g.lineTo(cx, cy); g.lineTo(cx, cy + s); g.lineTo(cx + s, cy + h); g.closePath(); g.fill();
  g.strokeStyle = '#00000088'; g.lineWidth = 1.5; g.stroke();
}
const utc = t => { const d = new Date(t * 1000); return `${String(d.getUTCDate()).padStart(2, '0')} ${d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase()} ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`; };
function minedTile(b) {
  const c = canvas(240, 240), g = c.getContext('2d');
  round(g, 12, 10, 216, 216, 10, lin(g, 0, 10, 0, 226, ['#14251b', '#0a120d']), '#2f7a4f', 3);
  g.save(); g.globalAlpha = .1; g.strokeStyle = GREEN2; g.lineWidth = 1; for (let x = 24; x < 226; x += 16) { g.beginPath(); g.moveTo(x, 14); g.lineTo(x, 222); g.stroke(); } g.restore();
  cube(g, 120, 62, 34);
  text(g, `#${fmt(b.height)}`, 120, 128, 36, '#fff', COND, 'center', '800');
  round(g, 30, 148, 180, 28, 14, '#0b0c0e', GREEN, 1.5); fitText(g, (b.pool || 'UNKNOWN POOL').toUpperCase(), 120, 162, 17, 164, GREEN2, COND, 'center', '800');
  text(g, `${fmt(b.txs || 0)} TX · ${b.time ? utc(b.time) : ''}`, 120, 192, 11, PAPER, MONO, 'center', '700');
  text(g, 'MINED BLOCK', 120, 211, 11, '#7fc79c', MONO, 'center', '700');
  return c;
}
function rebuildPools() {
  for (const s of ['cherry', 'lemon', 'chip', 'block']) pools[s] = [0, 1].map(v => ({ v, tile: halvingTile(s, v) }));
  pools.artifact = [{ v: 0, tile: nextTile(0) }];
  pools.bitcoin = [{ v: 0, tile: capTile(0) }];
  pools.wild = [{ v: 0, tile: wildTile(0) }];
  pools.scatter = [0, 1, 2, 3, 4].map(era => ({ era, tile: coinTile(era) }));
  pools.vault = (REC.messages || []).map((m, i) => ({ msg: m, i, tile: messageTile(m, i) }));
  pools.chain = (chain.recent.length ? chain.recent : REC.recent || []).slice(0, 30).map(b => ({ block: b, tile: minedTile(b) }));
  for (const k of Object.keys(pools)) if (!pools[k].length) pools[k] = [{ tile: capTile(0) }];
  for (const k in iconURL) delete iconURL[k];
}
const iconURL = {};
rebuildPools();
function refreshLiveTiles() { pools.artifact = [{ v: 0, tile: nextTile(0) }]; pools.chain = (chain.recent.length ? chain.recent : REC.recent || []).slice(0, 30).map(b => ({ block: b, tile: minedTile(b) })); delete iconURL.artifact; delete iconURL.chain; refaceIdle(); screenDirty = true; }
const tileFor = (s, f) => { const p = pools[s]; return p[f >= 0 && f < p.length ? f : 0].tile; };
const faceItem = (s, f) => { const p = pools[s]; return p ? p[f >= 0 && f < p.length ? f : 0] : null; };
// Which record shows in a cell is chosen with Math.random AFTER the engine has fixed the result.
const pickFace = s => pools[s] && pools[s].length ? Math.floor(Math.random() * pools[s].length) : 0;
let faces = state.grid.map(col => col.map(s => pickFace(s)));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c] && faces[c][r] >= 0 && faces[c][r] < pools[s].length ? faces[c][r] : pickFace(s))); }
// A round's own little generator (FNV hash of its id): used only to choose which record a bonus shows, never a prize.
function roundHash(id, salt = '') { let h = 2166136261; for (const ch of String(id || 'halving') + salt) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }
function permFor(id, n) { const a = [...Array(n).keys()]; let s = roundHash(id, 'perm') || 1; const r = () => (s = Math.imul(s ^ s >>> 15, 2246822507) + 1 >>> 0) / 4294967296; for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
