
/* ---------- The evidence: every symbol is a real record (court record, published works, a key fingerprint, dated posts, block heights).
   The people appear as Jim's own pop-art prints (art/prints, made for this machine), each beside the record it stands for. ---------- */
const PRINT_SRC = window.WIS_PRINTS || {}, printImg = {};
const printOf = k => { const im = printImg[k]; return im && im.complete && im.naturalWidth ? im : null; };
// Who each print stands for: the author of each published work, Satoshi for the whitepaper (wild), the court case for the Forgery.
const PEOPLE = { lemon: ['finney-a', 'finney-b'], chip: ['szabo-a', 'szabo-b'], block: ['dai-a', 'dai-b'], artifact: ['back-a', 'back-b'], wild: ['satoshi-a', 'satoshi-b'], cherry: ['wright', 'mellor'], credits: ['lerner-a', 'lopp-a'] };
const pools = { cherry: [], lemon: [], chip: [], block: [], artifact: [], bitcoin: [], wild: [], scatter: [], vault: [], chain: [] };
function stains(g, seed, n = 4, a = .07) { let s = seed * 9301 + 49297; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < n; i++) { const x = 30 + r() * 180, y = 20 + r() * 190, rad = 8 + r() * 26; const gr = g.createRadialGradient(x, y, rad * .2, x, y, rad); gr.addColorStop(0, `rgba(120,80,30,${a * .4})`); gr.addColorStop(.85, `rgba(120,80,30,${a})`); gr.addColorStop(1, 'rgba(120,80,30,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill(); } }
function paper(g, col = PAPER, edge = '#5a4528', seed = 1, lw = 3) {
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 12; g.shadowOffsetY = 4; round(g, 14, 8, 212, 212, 10, col); g.restore();
  g.save(); g.beginPath(); g.roundRect(14, 8, 212, 212, 10); g.clip(); g.fillStyle = lin(g, 0, 8, 0, 220, ['#ffffff22', '#00000000', '#0000001c']); g.fillRect(14, 8, 212, 212); stains(g, seed); g.restore();
  round(g, 14, 8, 212, 212, 10, null, edge, lw);
}
// The five published works: title, author line and year only, set in period type on a case-file card.
function docTile(sym, v = 0) {
  const d = REC.documents[sym] || { title: NAMES[sym], author: '', year: '' }, c = canvas(240, 240), g = c.getContext('2d'), wild = sym === 'wild', tab = TAB[sym];
  paper(g, wild ? '#f7ecd0' : (v ? '#efe2c0' : PAPER), wild ? BRASS3 : '#6b5534', 7 + v, wild ? 5 : 3);
  round(g, 14, 8, 212, 34, [10, 10, 0, 0], tab); text(g, wild ? 'WILD · THE WHITEPAPER' : 'EXHIBIT · PUBLISHED WORK', 120, 26, wild ? 13 : 12, wild ? INK : '#fffaf0', TYPE, 'center', '700');
  if (wild) { g.save(); g.strokeStyle = BRASS; g.lineWidth = 2; g.strokeRect(22, 48, 196, 164); g.restore(); fitText(g, d.title, 120, 80, 40, 180, INK, SERIF, 'center', '700'); const ls = wrapLines(g, d.subtitle, 180, 16, SERIF, 'italic 400'); ls.forEach((l, i) => text(g, l, 120, 112 + i * 20, 16, '#3b2f20', SERIF, 'center', 'italic 400')); text(g, d.author, 120, 168, 16, INK, TYPE, 'center', '700'); text(g, d.year.toUpperCase(), 120, 194, 15, RED, TYPE, 'center', '700'); return c; }
  const long = d.title.length > 9; fitText(g, d.title, 120, d.subtitle ? 78 : 92, long ? 34 : 46, 186, INK, SERIF, 'center', '700');
  if (d.subtitle) wrapLines(g, d.subtitle, 180, 15, SERIF, 'italic 400').forEach((l, i) => text(g, l, 120, 108 + i * 18, 15, '#3b2f20', SERIF, 'center', 'italic 400'));
  g.fillStyle = '#6b553455'; g.fillRect(40, 140, 160, 1.5);
  text(g, d.author, 120, 160, 17, INK, TYPE, 'center', '700'); text(g, d.year, 120, 192, 30, RED, TYPE, 'center', '700');
  if (d.note) rubberStamp(g, 'CITED', 190, 112, 13, RED, .3, .8, d.note.replace(/.*\[/, '[').replace(/\].*/, ']'));
  return c;
}
// A print tile: one of Jim's pop-art prints on the reel card, with the record's year in a small chip (and, for the
// Forgery, the court's finding stamped in the corner, clear of the face).
function printTile(sym, key, v = 0) {
  const im = printOf(key); if (!im) return null;
  const c = canvas(240, 240), g = c.getContext('2d'), wild = sym === 'wild', d = REC.documents[sym] || {};
  g.save(); g.shadowColor = wild ? BRASS : '#000'; g.shadowBlur = wild ? 18 : 12; g.shadowOffsetY = wild ? 0 : 4; round(g, 14, 8, 212, 212, 10, '#0c0a08'); g.restore();
  g.save(); g.beginPath(); g.roundRect(14, 8, 212, 212, 10); g.clip(); g.drawImage(im, 14, 8, 212, 212); g.fillStyle = lin(g, 0, 8, 0, 220, ['#ffffff14', '#00000000', '#00000014']); g.fillRect(14, 8, 212, 212); g.restore();
  round(g, 14, 8, 212, 212, 10, null, wild ? BRASS2 : '#14100c', wild ? 5 : 3);
  if (wild) round(g, 19, 13, 202, 202, 7, null, '#e0b04a88', 1.5);
  const year = sym === 'wild' ? '2008' : sym === 'cherry' ? '2024' : (d.year || '');
  if (year) { round(g, 168, 14, 52, 22, 5, '#f4ead2e6', '#14100c', 1.5); text(g, year, 194, 25, 14, sym === 'cherry' ? RED : INK, TYPE, 'center', '700'); }
  if (sym === 'cherry' && key === 'wright') rubberStamp(g, 'NOT SATOSHI', 66, 34, 11, RED, -.18, .92, 'HIGH COURT');
  return c;
}
// The Forgery: a case file stamped NOT SATOSHI, with the court's finding as reported (the third Forgery face, beside the two prints).
function forgeryTile(v = 0) {
  const F = REC.forgery, c = canvas(240, 240), g = c.getContext('2d');
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 12; g.shadowOffsetY = 4; round(g, 14, 22, 212, 198, 8, MANILA); g.restore();
  round(g, 22, 8, 92, 24, [8, 8, 0, 0], '#c9ab70'); text(g, 'CASE FILE', 68, 21, 12, '#4a3818', TYPE, 'center', '700');
  g.save(); g.beginPath(); g.roundRect(14, 22, 212, 198, 8); g.clip(); stains(g, 40 + v, 3, .09); g.restore(); round(g, 14, 22, 212, 198, 8, null, '#6b5126', 3);
  text(g, F.case || 'COPA v WRIGHT', 120, 50, 19, INK, TYPE, 'center', '700'); text(g, F.citation || '', 120, 72, 13, '#4a3818', TYPE, 'center', '700');
  const lines = wrapLines(g, (F.findings || [])[v % Math.max(1, (F.findings || []).length)] || '', 184, 13, TYPE, '700'); lines.slice(0, 3).forEach((l, i) => text(g, l, 120, 176 + i * 15, 13, '#3d2f17', TYPE, 'center', '700'));
  rubberStamp(g, F.stamp || 'NOT SATOSHI', 120, 122, 24, RED, -.2, .92, F.court || '');
  return c;
}
// Satoshi's Key: the fingerprint of the PGP key published on bitcoin.org, on green baize in a brass frame.
function keyShape(g, cx, cy, s, col = BRASS, glyph = true) {
  g.save(); g.translate(cx, cy); g.scale(s, s); g.fillStyle = lin(g, -60, -30, 60, 30, [BRASS2, col, BRASS3]); g.strokeStyle = '#3a2808'; g.lineWidth = 2;
  g.beginPath(); g.arc(-38, 0, 30, 0, 7); g.arc(-38, 0, 19, 0, 7, true); g.fill('evenodd'); g.stroke();
  g.beginPath(); g.rect(-9, -6, 74, 12); g.rect(44, 6, 8, 14); g.rect(56, 6, 8, 10); g.rect(30, 6, 6, 9); g.fill(); g.stroke();
  if (glyph) btcGlyph(g, -38, 2, 26, BRASS2);
  g.restore();
}
function keyTile(v = 0) {
  const K = REC.key, c = canvas(240, 240), g = c.getContext('2d');
  g.save(); g.shadowColor = BRASS; g.shadowBlur = 16; round(g, 14, 8, 212, 212, 12, lin(g, 0, 8, 0, 220, ['#1d3a2a', '#0f2318']), BRASS, 5); g.restore();
  round(g, 22, 16, 196, 196, 8, null, '#e0b04a66', 1.5);
  keyShape(g, 120, 72, 1.25);
  const fp = (K.fingerprint || '').split(' '), a = fp.slice(0, 5).join(' '), b = fp.slice(5).join(' ');
  text(g, a, 120, 128, 15, BRASS2, TYPE, 'center', '700'); text(g, b, 120, 148, 15, BRASS2, TYPE, 'center', '700');
  text(g, `KEY ID ${K.keyId || ''} · bitcoin.org`, 120, 168, 11, '#c8b886', TYPE, 'center', '700');
  round(g, 22, 182, 196, 30, 6, lin(g, 0, 182, 0, 212, [BRASS2, BRASS, BRASS3])); spaced(g, "SATOSHI'S KEY", 120, 197, 16, 2, INK, '700');
  return c;
}
// A forum post: a real short quote from Satoshi's posts, with its date and where it was posted.
function postTile(p, i) {
  const c = canvas(240, 240), g = c.getContext('2d');
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 12; g.shadowOffsetY = 4; round(g, 14, 8, 212, 212, 8, '#f4f0e6'); g.restore();
  round(g, 14, 8, 212, 36, [8, 8, 0, 0], lin(g, 0, 8, 0, 44, ['#46607f', '#2b3d55']));
  text(g, 'satoshi', 26, 26, 15, '#fff', TYPE, 'left', '700'); text(g, p.date.toUpperCase(), 214, 26, 11, '#cfe0f5', TYPE, 'right', '700');
  text(g, '“', 34, 66, 52, '#46607f88', SERIF, 'center', '700');
  const ls = wrapLines(g, p.text, 176, 16, SERIF, 'italic 400'), size = ls.length > 5 ? 13 : 16, ls2 = size === 16 ? ls : wrapLines(g, p.text, 180, 13, SERIF, 'italic 400'), top = 120 - (ls2.length - 1) * (size + 4) / 2;
  ls2.slice(0, 7).forEach((l, k) => text(g, l, 124, top + k * (size + 4), size, '#1f2a36', SERIF, 'center', 'italic 400'));
  round(g, 14, 192, 212, 28, [0, 0, 8, 8], '#e3dccb'); text(g, p.where.toUpperCase(), 120, 206, 11, '#46607f', TYPE, 'center', '700');
  round(g, 14, 8, 212, 212, 8, null, '#2b3d55', 3);
  return c;
}
// The sealed envelope: a prop holding real evidence (the pick bonus).
function envelopeShape(g, x, y, w, h, open = 0, label = true) {
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 14; g.shadowOffsetY = 5; round(g, x, y, w, h, 6, lin(g, x, y, x, y + h, ['#c79d63', '#a87a43'])); g.restore();
  g.strokeStyle = '#6b4a22'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + w * .5, y + h * .55); g.lineTo(x + w, y + h); g.stroke();
  const fy = y + h * .55 * (1 - 2 * open); g.fillStyle = open > .5 ? '#94683a' : '#b88b51'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w * .5, fy); g.lineTo(x + w, y); g.closePath(); g.fill(); g.stroke();
  if (open < .5) { const sx = x + w * .5, sy = y + h * .55 - 4, r = Math.min(w, h) * .14; g.fillStyle = lin(g, sx - r, sy - r, sx + r, sy + r, ['#e04a3c', '#9b1d14']); g.beginPath(); for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2, rr = r * (k % 2 ? .9 : 1.05); g.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr); } g.closePath(); g.fill(); btcGlyph(g, sx, sy + 2, r * 1.2, '#ffd7c9cc'); }
  if (label) { g.save(); g.translate(x + w * .5, y + h * .86); text(g, 'EVIDENCE · SEALED', 0, 0, Math.max(10, w * .065), '#3b2710', TYPE, 'center', '700'); g.restore(); }
}
function envelopeTile() { const c = canvas(240, 240), g = c.getContext('2d'); envelopeShape(g, 14, 40, 212, 150); round(g, 30, 12, 180, 26, 6, '#1c1712e6'); spaced(g, 'UNMASK SATOSHI', 120, 26, 13, 1.5, BRASS2, '700', TYPE); text(g, '3+ OPENS THE FILE', 120, 212, 12, '#d8c49b', TYPE, 'center', '700'); return c; }
// A Patoshi block: a real early block height from the Patoshi mining pattern, on green-bar printout paper.
function patoshiTile(h) {
  const c = canvas(240, 240), g = c.getContext('2d');
  g.save(); g.shadowColor = '#000'; g.shadowBlur = 12; g.shadowOffsetY = 4; round(g, 14, 8, 212, 212, 6, '#f2f5ea'); g.restore();
  g.save(); g.beginPath(); g.roundRect(14, 8, 212, 212, 6); g.clip(); for (let y = 8; y < 220; y += 28) { g.fillStyle = '#cfe6cf'; g.fillRect(14, y, 212, 14); } for (let y = 16; y < 220; y += 16) { g.fillStyle = '#9db59c'; g.beginPath(); g.arc(22, y, 3, 0, 7); g.arc(218, y, 3, 0, 7); g.fill(); } g.restore();
  round(g, 14, 8, 212, 212, 6, null, '#3c5a3c', 3);
  text(g, 'BITCOIN BLOCK', 120, 34, 15, '#2a3d2a', TYPE, 'center', '700');
  const hs = '#' + Number(h).toLocaleString('en-GB'); text(g, hs, 120, 86, hs.length > 6 ? 42 : 50, INK, TYPE, 'center', '700');
  text(g, 'COINBASE  50 BTC', 120, 130, 15, '#2a3d2a', TYPE, 'center', '700'); text(g, 'MINED 2009–10', 120, 152, 13, '#4b634b', TYPE, 'center', '700');
  round(g, 22, 176, 196, 34, 4, '#1f2d1f'); spaced(g, 'PATOSHI PATTERN', 120, 193, 14, 1.5, GREEN2, '700', TYPE);
  return c;
}
function rebuildPools() {
  const pr = (s, i) => printTile(s, PEOPLE[s][i], i);
  const fp = [0, 1].map(v => ({ v, tile: pr('cherry', v), print: PEOPLE.cherry[v] })).filter(x => x.tile);
  pools.cherry = fp.length ? fp.concat([{ v: 2, tile: forgeryTile(0) }]) : [0, 1, 2].map(v => ({ v, tile: forgeryTile(v) }));
  for (const s of ['lemon', 'chip', 'block', 'artifact']) pools[s] = [0, 1].map(v => ({ v, tile: pr(s, v) || docTile(s, v), print: printOf(PEOPLE[s][v]) ? PEOPLE[s][v] : null }));
  pools.wild = [0, 1].map(v => ({ v, tile: pr('wild', v) || docTile('wild', 0), print: printOf(PEOPLE.wild[v]) ? PEOPLE.wild[v] : null }));
  pools.bitcoin = [{ v: 0, tile: keyTile(0) }];
  pools.scatter = (REC.posts || []).map((p, i) => ({ post: p, i, tile: postTile(p, i) }));
  pools.vault = [{ tile: envelopeTile() }];
  pools.chain = (REC.patoshi.heights || []).map(h => ({ height: h, tile: patoshiTile(h) }));
  for (const k of Object.keys(pools)) if (!pools[k].length) pools[k] = [{ tile: docTile('wild') }];
}
rebuildPools();
const tileFor = (s, f) => { const p = pools[s]; return p[f >= 0 && f < p.length ? f : 0].tile; };
const faceItem = (s, f) => { const p = pools[s]; return p ? p[f >= 0 && f < p.length ? f : 0] : null; };
// Which record shows in a cell is chosen with Math.random AFTER the engine has fixed the result.
const pickFace = s => pools[s] && pools[s].length ? Math.floor(Math.random() * pools[s].length) : 0;
let faces = state.grid.map(col => col.map(s => pickFace(s)));
// The prints are data URIs inside the game; they decode in a moment, then the tiles are repainted with them.
(function loadPrints() {
  const keys = Object.keys(PRINT_SRC); let left = keys.length; if (!left) return;
  const done = () => { if (--left) return; rebuildPools(); try { for (const k in iconURL) delete iconURL[k]; } catch (e) {} refaceIdle(); screenDirty = true; };
  for (const k of keys) { const im = new Image(); im.onload = im.onerror = done; im.src = PRINT_SRC[k]; printImg[k] = im; }
})();
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c] && faces[c][r] >= 0 && faces[c][r] < pools[s].length ? faces[c][r] : pickFace(s))); }
