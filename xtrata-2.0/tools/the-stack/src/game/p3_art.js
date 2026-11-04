
/* ---------- The reels: official logos (Leather, Xverse, Bitflow, Zest, sBTC, StackingDAO, Stacks), the Bitcoin mark, the real
   current stacking cycle and real recent Stacks blocks with the Bitcoin blocks they settled on. Each is drawn on a glass card. ---------- */
const pools = { cherry: [], lemon: [], chip: [], block: [], artifact: [], bitcoin: [], wild: [], scatter: [], vault: [], chain: [] };
const short = h => h ? `${h.slice(0, 8)}…${h.slice(-6)}` : '';
const stx = ustx => ustx / 1e6, mstx = ustx => `${(ustx / 1e12).toFixed(1)}M`;
const utc = iso => { const d = new Date(iso); return isNaN(d) ? '' : `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`; };
const dayUtc = iso => { const d = new Date(iso); return isNaN(d) ? '' : `${String(d.getUTCDate()).padStart(2, '0')} ${d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase()} · ${utc(iso)}`; };
function card(g, edge = LINE, glow = '', lw = 2) {
  g.save(); g.shadowColor = glow || '#000'; g.shadowBlur = glow ? 18 : 10; g.shadowOffsetY = glow ? 0 : 4; round(g, 12, 10, 216, 216, 18, GLASS); g.restore();
  round(g, 12, 10, 216, 216, 18, lin(g, 0, 10, 0, 226, ['#1a1a2a', '#0e0e17', '#08080d']));
  g.save(); g.beginPath(); g.roundRect(12, 10, 216, 216, 18); g.clip(); g.fillStyle = lin(g, 12, 10, 160, 140, ['#ffffff14', '#ffffff00']); g.fillRect(12, 10, 216, 108); g.restore();
  round(g, 12, 10, 216, 216, 18, null, edge, lw);
}
function chip(g, s, cx, cy, col, w) { g.font = `800 13px ${SANS}`; const tw = Math.min(w || 999, g.measureText(s).width + 34); round(g, cx - tw / 2, cy - 12, tw, 24, 12, '#0b0b12', col + 'aa', 1.5); g.fillStyle = col; g.beginPath(); g.arc(cx - tw / 2 + 13, cy, 4, 0, 7); g.fill(); fitText(g, s, cx + 6, cy + 1, 13, tw - 30, TXT, SANS, 'center', '800'); }
// A project's official logo, as supplied, on a glass card with its pay-tier stripe (variant 1 shows what the project is).
function logoTile(sym, v = 0) {
  const c = canvas(240, 240), g = c.getContext('2d'), key = LOGO_OF[sym];
  card(g, TAB[sym] + '88', '', 2);
  chip(g, NAMES[sym].toUpperCase(), 120, 34, TAB[sym], 196);
  drawLogo(g, key, 120, v ? 118 : 116, v ? 104 : 116);
  if (v) { fitText(g, WHAT[sym], 120, 188, 12, 196, MUTED, MONO, 'center', '700'); }
  round(g, 40, 206, 160, 6, 3, TAB[sym]);
  return c;
}
// Bitcoin ₿, the jackpot symbol: the public-domain mark from Bitcoin.org, in a Bitcoin-orange frame.
function btcTile() {
  const c = canvas(240, 240), g = c.getContext('2d');
  g.save(); g.shadowColor = BTC; g.shadowBlur = 20; round(g, 12, 10, 216, 216, 18, lin(g, 0, 10, 0, 226, ['#2a1a08', '#120b04']), BTC, 4); g.restore();
  const gr = g.createRadialGradient(120, 100, 10, 120, 100, 110); gr.addColorStop(0, '#f7931a44'); gr.addColorStop(1, '#f7931a00'); g.fillStyle = gr; g.fillRect(12, 10, 216, 216);
  btcLogo(g, 120, 98, 128);
  round(g, 28, 178, 184, 36, 18, lin(g, 0, 178, 0, 214, ['#ffc061', BTC, '#a85d00'])); spaced(g, 'FINALITY', 120, 196, 17, 5, INK, '800');
  return c;
}
// Stacks (STX), the wild: the official Stacks logo in a purple frame.
function wildTile() {
  const c = canvas(240, 240), g = c.getContext('2d');
  g.save(); g.shadowColor = PURPLE; g.shadowBlur = 22; round(g, 12, 10, 216, 216, 18, lin(g, 0, 10, 0, 226, ['#1a1550', '#0a0820']), PURPLE2, 4); g.restore();
  const gr = g.createRadialGradient(120, 100, 10, 120, 100, 110); gr.addColorStop(0, '#5546ff55'); gr.addColorStop(1, '#5546ff00'); g.fillStyle = gr; g.fillRect(12, 10, 216, 216);
  drawLogo(g, 'stacks', 120, 98, 124);
  round(g, 36, 178, 168, 36, 18, lin(g, 0, 178, 0, 214, [PURPLE2, PURPLE, PURPLE3])); spaced(g, 'WILD', 120, 196, 18, 8, '#fff', '800');
  return c;
}
// The stacking cycle, the scatter: the real current cycle number, its progress through 2,100 Bitcoin blocks (read live),
// the STX stacked in it and the signers who secure it (the cycle record from the Hiro API).
function cycleRec(c) { return (REC.cycles || []).find(x => x.cycle === c) || null; }
function ring(g, cx, cy, r, w, p, colA = PURPLE, colB = ORANGE) {
  g.lineCap = 'round'; g.lineWidth = w; g.strokeStyle = '#ffffff14'; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke();
  if (Number.isFinite(p) && p > 0) { const gr = g.createConicGradient ? g.createConicGradient(-Math.PI / 2, cx, cy) : null; if (gr) { gr.addColorStop(0, colA); gr.addColorStop(Math.min(.99, Math.max(.02, p)), colB); gr.addColorStop(1, colB); } g.strokeStyle = gr || colB; g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, p)); g.stroke(); }
  g.lineCap = 'butt';
}
function cycleTile(v = 0) {
  const c = canvas(240, 240), g = c.getContext('2d'), cy = cycleNow(), rec = cycleRec(cy), pox = chain.pox, p = cycleDone(), left = cycleLeft();
  card(g, ORANGE2 + 'aa', '', 2.5);
  ring(g, 120, 104, 70, 12, p);
  for (let k = 0; k < 21; k++) { const a = -Math.PI / 2 + k / 21 * Math.PI * 2; g.fillStyle = k / 21 <= (p || 0) ? '#ffffffaa' : '#ffffff22'; g.beginPath(); g.arc(120 + Math.cos(a) * 88, 104 + Math.sin(a) * 88, 2, 0, 7); g.fill(); }
  text(g, 'STACKING CYCLE', 120, 82, 11, MUTED, MONO, 'center', '700');
  fitText(g, Number.isFinite(cy) ? String(cy) : '—', 120, 112, 50, 110, '#fff', COND, 'center', '800');
  text(g, staleTag(), 120, 140, 9, chain.stale ? RED : GREEN2, MONO, 'center', '700');
  let line = '';
  if (v === 0) line = Number.isFinite(left) ? `${fmt(left)} BTC BLOCKS LEFT` : 'TIP UNKNOWN';
  else if (v === 1) { const u = pox && pox.cycle === cy ? pox.stackedUstx : rec && rec.stackedUstx; line = u ? `${mstx(u)} STX STACKED` : '2,100 BITCOIN BLOCKS'; }
  else line = rec ? `${rec.signers} SIGNERS · FROM #${fmt(rec.startBlock)}` : '2,100 BITCOIN BLOCKS';
  round(g, 26, 184, 188, 30, 15, '#0b0b12', ORANGE + '99', 1.5); fitText(g, line, 120, 199, 13, 176, ORANGE2, MONO, 'center', '700');
  return c;
}
// StackingDAO, the pick symbol: its official logo with a sealed reward envelope behind it.
function vaultTile(v = 0) {
  const c = canvas(240, 240), g = c.getContext('2d');
  card(g, '#3fa98aaa', '', 2);
  if (v) { g.save(); g.translate(120, 120); g.rotate(-.08); round(g, -78, -46, 156, 100, 8, '#efe7d6'); g.strokeStyle = '#c8bca4'; g.lineWidth = 2; g.beginPath(); g.moveTo(-78, -46); g.lineTo(0, 10); g.lineTo(78, -46); g.stroke(); g.restore(); }
  drawLogo(g, 'stackingdao', 120, v ? 98 : 112, v ? 92 : 118);
  chip(g, 'STACKINGDAO', 120, v ? 186 : 34, '#3fa98a', 196);
  if (!v) fitText(g, 'REWARD SLOTS', 120, 194, 13, 196, MUTED, MONO, 'center', '700');
  round(g, 40, 206, 160, 6, 3, '#3fa98a');
  return c;
}
// An isometric slab: a Stacks block (purple) or a Bitcoin block (orange), the machine's building block.
function slab(g, cx, cy, w, h, top, left, right, edgeCol = '#00000066') {
  const d = w * .28; g.fillStyle = top; g.beginPath(); g.moveTo(cx - w / 2, cy); g.lineTo(cx, cy - d); g.lineTo(cx + w / 2, cy); g.lineTo(cx, cy + d); g.closePath(); g.fill();
  g.fillStyle = left; g.beginPath(); g.moveTo(cx - w / 2, cy); g.lineTo(cx, cy + d); g.lineTo(cx, cy + d + h); g.lineTo(cx - w / 2, cy + h); g.closePath(); g.fill();
  g.fillStyle = right; g.beginPath(); g.moveTo(cx + w / 2, cy); g.lineTo(cx, cy + d); g.lineTo(cx, cy + d + h); g.lineTo(cx + w / 2, cy + h); g.closePath(); g.fill();
  g.strokeStyle = edgeCol; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - w / 2, cy); g.lineTo(cx, cy - d); g.lineTo(cx + w / 2, cy); g.lineTo(cx, cy + d); g.closePath(); g.stroke();
}
const stxSlab = (g, cx, cy, w, h = w * .16) => slab(g, cx, cy, w, h, '#8f84ff', '#5546ff', '#3a2fc0');
const btcSlab = (g, cx, cy, w, h = w * .2) => slab(g, cx, cy, w, h, '#ffb35c', '#f7931a', '#b8650a');
// A fast block: a real recent Stacks block height, settled on the Bitcoin block it anchored to (refreshed from the live chain).
function fastTile(b) {
  const c = canvas(240, 240), g = c.getContext('2d');
  card(g, PURPLE + 'aa', '', 2);
  btcSlab(g, 120, 72, 104); stxSlab(g, 120, 50, 84);
  text(g, 'FAST BLOCK', 120, 26, 11, MUTED, MONO, 'center', '700');
  fitText(g, `#${fmt(b.height)}`, 120, 124, 38, 200, '#fff', COND, 'center', '800');
  round(g, 30, 146, 180, 28, 14, '#0b0b12', BTC + 'aa', 1.5); fitText(g, `₿ ANCHOR #${fmt(b.burn)}`, 120, 160, 15, 168, '#ffcf8f', COND, 'center', '800');
  text(g, `${fmt(b.txs || 0)} TX · ${utc(b.time)}`, 120, 190, 11, TXT, MONO, 'center', '700');
  text(g, short(b.hash), 120, 209, 10, DIM, MONO, 'center', '400');
  return c;
}
function rebuildPools() {
  for (const s of ['cherry', 'lemon', 'chip', 'block', 'artifact']) pools[s] = [0, 1].map(v => ({ v, tile: logoTile(s, v) }));
  pools.bitcoin = [{ v: 0, tile: btcTile() }];
  pools.wild = [{ v: 0, tile: wildTile() }];
  pools.scatter = [0, 1, 2].map(v => ({ v, tile: cycleTile(v) }));
  pools.vault = [0, 1].map(v => ({ v, tile: vaultTile(v) }));
  pools.chain = (chain.recent.length ? chain.recent : REC.blocks || []).slice(0, 30).map(b => ({ block: b, tile: fastTile(b) }));
  for (const k of Object.keys(pools)) if (!pools[k].length) pools[k] = [{ tile: btcTile() }];
  for (const k in iconURL) delete iconURL[k];
}
const iconURL = {};
rebuildPools();
function refreshLiveTiles() { pools.scatter = [0, 1, 2].map(v => ({ v, tile: cycleTile(v) })); pools.chain = (chain.recent.length ? chain.recent : REC.blocks || []).slice(0, 30).map(b => ({ block: b, tile: fastTile(b) })); delete iconURL.scatter; delete iconURL.chain; refaceIdle(); screenDirty = true; }
const tileFor = (s, f) => { const p = pools[s]; return p[f >= 0 && f < p.length ? f : 0].tile; };
const faceItem = (s, f) => { const p = pools[s]; return p ? p[f >= 0 && f < p.length ? f : 0] : null; };
// Which logo variant or block shows in a cell is chosen with Math.random AFTER the engine has fixed the result.
const pickFace = s => pools[s] && pools[s].length ? Math.floor(Math.random() * pools[s].length) : 0;
let faces = state.grid.map(col => col.map(s => pickFace(s)));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c] && faces[c][r] >= 0 && faces[c][r] < pools[s].length ? faces[c][r] : pickFace(s))); }
// A round's own little generator (FNV hash of its id): used only to choose which record a bonus shows, never a prize.
function roundHash(id, salt = '') { let h = 2166136261; for (const ch of String(id || 'stack') + salt) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }
function permFor(id, n) { const a = [...Array(n).keys()]; let s = roundHash(id, 'perm') || 1; const r = () => (s = Math.imul(s ^ s >>> 15, 2246822507) + 1 >>> 0) / 4294967296; for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
