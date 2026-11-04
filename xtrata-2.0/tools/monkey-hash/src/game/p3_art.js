/* ---------- Real Bitcoin Monkeys art: bundled tiles, stone and gold frames, serums, mutants, the typed logo tiles ---------- */
const ART = window.MH_ART || { items: [], tierString: '', serums: {} }, LOGOS = window.MH_LOGOS || {};
const items = [], byKey = new Map();
const pools = { cherry: [], lemon: [], chip: [], block: [], artifact: [], bitcoin: [], wild: [], chain: [] };
const FACE = s => Object.prototype.hasOwnProperty.call(pools, s) && s !== 'cherry';
const slotOfMonkey = tk => tk === '2' ? 'bitcoin' : 'artifact';
const tierOfId = id => ART.tierString ? ART.tierString[id - 1] : '0';
function greyOf(img) { // a Stacks NFT without a twin: desaturated
  const c = canvas(160, 160), g = c.getContext('2d'); g.drawImage(img, 0, 0, 160, 160);
  try { const d = g.getImageData(0, 0, 160, 160), p = d.data; for (let i = 0; i < p.length; i += 4) { const y = .3 * p[i] + .59 * p[i + 1] + .11 * p[i + 2]; p[i] = y * .86; p[i + 1] = y * .9; p[i + 2] = y * .84; } g.putImageData(d, 0, 0); } catch (e) { g.fillStyle = '#000a'; g.fillRect(0, 0, 160, 160); }
  return c;
}
// A record tile stands in until a monkey's picture has loaded: real token number and rarity from the collection, set in type. Nothing is drawn by hand.
function recordArt(g, it) { g.fillStyle = '#0a1a12'; g.fillRect(24, 16, 192, 160); g.fillStyle = '#ffffff0a'; for (let y = 18; y < 176; y += 8) g.fillRect(24, y, 192, 2);
  text(g, it.kind === 'serum' ? 'SERUM' : it.kind === 'mutant' ? 'MUTANT' : 'BITCOIN', 120, 40, 17, '#8fb59c', 'Arial', 'center', '800'); text(g, it.kind === 'serum' ? it.type : 'MONKEY', 120, 72, 30, '#d6e8dc', 'Arial', 'center', '900'); text(g, `#${it.id}`, 120, 112, 34, GOLD2, 'Courier New', 'center', '700'); }
function artArea(g, src, it) { g.save(); g.beginPath(); g.roundRect(24, 16, 192, 160, 10); g.clip(); if (!src) recordArt(g, it); else { g.fillStyle = '#07120d'; g.fillRect(24, 16, 192, 160); const fit = Math.min(192 / src.width, 160 / src.height); g.drawImage(src, 24 + (192 - src.width * fit) / 2, 16 + (160 - src.height * fit) / 2, src.width * fit, src.height * fit); } g.restore(); }
function stamp(g, y = 152, size = 16) { g.save(); g.translate(120, y); g.rotate(-.2); g.font = `900 ${size}px Arial`; const t = 'NOT YET FOREVER', w = g.measureText(t).width + 22; g.fillStyle = '#1a0a05cc'; g.fillRect(-w / 2, -size * .8, w, size * 1.6); g.strokeStyle = '#ff6a3d'; g.lineWidth = 3; g.strokeRect(-w / 2, -size * .8, w, size * 1.6); g.fillStyle = '#ff8a5c'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 1); g.restore(); }
function foreverBadge(g, col) { g.fillStyle = '#05100a'; g.beginPath(); g.arc(204, 30, 17, 0, 7); g.fill(); drawInfinity(g, 204, 30, 30, col, false); }
function seedRng(n) { let a = (n * 2654435761) >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// Carved temple stone: grey-green block, chipped corners, moss in the cracks. Gold: a thick beaten-gold bevel.
function stoneFrame(g, seed, col = '#a9bdb0', forever = false) {
  g.save(); g.shadowColor = forever ? '#8fe0b0' : '#000'; g.shadowBlur = forever ? 14 : 8; round(g, 12, 4, 216, 216, 18, lin(g, 0, 4, 0, 220, ['#46594d', '#2b3a32', '#1c2822']), col, 3); g.restore();
  const r = seedRng(seed); g.save(); g.beginPath(); g.roundRect(12, 4, 216, 216, 18); g.clip();
  for (let i = 0; i < 70; i++) { g.fillStyle = r() < .5 ? '#ffffff0b' : '#0000001a'; g.fillRect(12 + r() * 216, 4 + r() * 216, 3 + r() * 10, 1 + r() * 3); }
  g.fillStyle = '#4f8a52'; for (let i = 0; i < 22; i++) { const x = r() < .5 ? 12 + r() * 40 : 228 - r() * 40, y = 4 + r() * 216; g.globalAlpha = .55; g.beginPath(); g.arc(x, y, 2 + r() * 5, 0, 7); g.fill(); } g.globalAlpha = 1; g.restore();
  g.save(); g.strokeStyle = '#0a120d'; g.lineWidth = 2; g.beginPath(); g.roundRect(20, 12, 200, 168, 12); g.stroke(); g.restore();
}
function goldFrame(g, forever) {
  g.save(); g.shadowColor = '#ffc83d'; g.shadowBlur = 22; round(g, 12, 4, 216, 216, 18, lin(g, 0, 4, 0, 220, ['#fff0a8', '#e0a91c', '#8a5a08', '#d9a300']), '#fff3c4', 5); g.restore();
  g.save(); g.strokeStyle = '#6b4300'; g.lineWidth = 3; g.beginPath(); g.roundRect(19, 11, 202, 170, 13); g.stroke(); g.strokeStyle = '#ffe9a6aa'; g.lineWidth = 1.5; g.beginPath(); g.roundRect(17, 9, 206, 174, 15); g.stroke(); g.restore();
}
function caption(g, it, col, label) { round(g, 24, 182, 192, 30, 7, '#0c1a12'); text(g, `#${it.id}`, 74, 198, 19, '#fff'); text(g, label, 168, 198, 12, col); }
// A reel tile: the monkey in its stone or gold frame. Twins show in full colour with an ∞ badge; others are desaturated and stamped.
function monkeyTile(it) {
  const gold = it.slot === 'bitcoin', col = TIER[it.slot].col, c = canvas(240, 240), g = c.getContext('2d');
  if (gold) goldFrame(g, it.forever); else stoneFrame(g, it.id, col, it.forever);
  artArea(g, it.img ? (it.forever ? it.img : greyOf(it.img)) : null, it); if (!it.forever) stamp(g);
  caption(g, it, gold ? '#ffd34d' : '#b9cdbf', gold ? 'GOLD' : 'STONE'); if (it.forever) foreverBadge(g, gold ? '#ffd34d' : '#8fe0b0');
  return c;
}
// The Idol Monkey wild: any Bitcoin Monkey in a gold-leaf idol frame with carved glyph corners.
function idolTile(it) {
  const c = canvas(240, 240), g = c.getContext('2d');
  g.save(); g.shadowColor = GOLD2; g.shadowBlur = 24; round(g, 12, 4, 216, 216, 20, lin(g, 0, 4, 0, 220, ['#ffe9a6', '#c68a10', '#6a4204', '#e0a91c']), '#ffe9a6', 6); g.restore();
  g.fillStyle = '#5a3a06'; for (const [x, y] of [[26, 18], [214, 18], [26, 172], [214, 172]]) { g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); g.fillStyle = '#ffe9a6'; g.fillRect(x - 5, y - 1.5, 10, 3); g.fillRect(x - 1.5, y - 5, 3, 10); g.fillStyle = '#5a3a06'; }
  g.save(); g.beginPath(); g.roundRect(30, 22, 180, 150, 10); g.clip(); g.fillStyle = '#07120d'; g.fillRect(30, 22, 180, 150); g.restore();
  g.save(); g.beginPath(); g.roundRect(30, 22, 180, 150, 10); g.clip(); const src = it.img ? (it.forever ? it.img : greyOf(it.img)) : null; if (src) { const fit = Math.min(180 / src.width, 150 / src.height); g.drawImage(src, 30 + (180 - src.width * fit) / 2, 22 + (150 - src.height * fit) / 2, src.width * fit, src.height * fit); } else { text(g, 'IDOL', 120, 72, 30, '#8fb59c', 'Arial', 'center', '900'); text(g, `#${it.id}`, 120, 118, 40, GOLD2, 'Courier New', 'center', '700'); }
  g.globalCompositeOperation = 'screen'; g.fillStyle = '#ffd34d33'; g.fillRect(30, 22, 180, 150); g.restore();
  if (!it.forever) stamp(g, 150, 14);
  round(g, 24, 182, 192, 30, 7, GOLD); text(g, `WILD · #${it.id}`, 120, 198, 17, '#2a1a00'); if (it.forever) foreverBadge(g, GOLD3);
  return c;
}
// The forever vine: a monkey's Xtrata inscription ID, or its token number until it is twinned.
function chainTile(it) {
  const c = canvas(240, 240), g = c.getContext('2d'), col = it.forever ? MOSS : '#4a6b52';
  g.save(); g.shadowColor = col; g.shadowBlur = 14; round(g, 14, 6, 212, 212, 16, '#06110b', col, 4); g.restore();
  g.save(); g.globalAlpha = .26; g.strokeStyle = MOSS; g.lineWidth = 5; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(40 + k * 80, 8); g.bezierCurveTo(10 + k * 80, 70, 80 + k * 80, 120, 40 + k * 80, 214); g.stroke(); } g.restore();
  g.globalAlpha = .2; drawInfinity(g, 120, 96, 190, MOSS, false); g.globalAlpha = 1;
  spaced(g, 'FOREVER VINE', 120, 34, 15, 4, '#bfe6c4', '700');
  text(g, it.forever ? 'XTRATA ID' : 'TOKEN', 120, 70, 14, '#8fb59c');
  g.save(); g.shadowColor = GOLD; g.shadowBlur = 12; const v = it.forever ? it.xtrataId : it.id; text(g, `#${v}`, 120, 114, String(v).length > 5 ? 42 : 54, '#fff', 'Courier New', 'center', '700'); g.restore();
  round(g, 24, 156, 192, 26, 6, '#0d2016'); text(g, `MONKEY #${it.id} · ${it.slot === 'bitcoin' ? 'GOLD' : 'STONE'}`, 120, 169, 13, it.slot === 'bitcoin' ? GOLD2 : '#b9cdbf');
  round(g, 24, 188, 192, 24, 6, it.forever ? MOSS : '#2a1710'); text(g, it.forever ? 'ON-CHAIN FOREVER' : 'NOT YET FOREVER', 120, 200, 13, it.forever ? '#06210f' : '#ff8a5c');
  return c;
}
// Serums and Mutants have no twins yet, so they always show NOT YET FOREVER. A serum batch shares one picture; the token number is real.
function serumTile(it) {
  const col = TIER[it.slot].col, c = canvas(240, 240), g = c.getContext('2d'); g.save(); g.shadowColor = col; g.shadowBlur = 14; round(g, 14, 6, 212, 212, 16, '#06110b', col, 4); g.restore();
  artArea(g, it.img ? greyOf(it.img) : null, it); stamp(g, 152, 16);
  round(g, 24, 182, 192, 30, 7, '#0c1a12'); text(g, `#${it.id}`, 72, 198, 19, '#fff'); text(g, it.kind === 'mutant' ? 'MUTANT' : `SERUM ${it.type}`, 160, 198, 13, col);
  return c;
}
function typedTile(top, big, small, col, tag) { const c = canvas(240, 240), g = c.getContext('2d'); g.save(); g.shadowColor = col; g.shadowBlur = 18; round(g, 14, 6, 212, 212, 16, '#06110b', col, 5); g.restore(); g.fillStyle = '#ffffff0b'; for (let y = 16; y < 200; y += 7) g.fillRect(24, y, 192, 1.5);
  if (top) text(g, top, 120, 50, 17, '#9db8a4', 'Arial', 'center', '700'); g.save(); g.shadowColor = col; g.shadowBlur = 14; big.forEach((s, i) => text(g, s, 120, (big.length > 1 ? 92 + i * 46 : 108), big.length > 1 ? 42 : 52, i ? '#fff' : col, 'Arial', 'center', '900')); g.restore();
  if (small) text(g, small, 120, 170, 14, '#c3d6c9', 'Arial', 'center', '600'); if (tag) { round(g, 24, 184, 192, 28, 7, col); text(g, tag, 120, 198, 15, '#0a1a10', 'Arial', 'center', '900'); } return c; }
// Until a pool has art, each slot shows a typed record tile (never a drawn picture).
const placeholders = {};
placeholders.lemon = typedTile('BITCOIN MONKEYS LABS', ['SERUM', 'MM1'], 'NOT YET FOREVER', TIER.lemon.col, 'MONKEY STORE');
placeholders.chip = typedTile('BITCOIN MONKEYS LABS', ['SERUM', 'MM2'], 'NOT YET FOREVER', TIER.chip.col, 'MONKEY STORE');
placeholders.block = typedTile('MADE FROM A SERUM', ['MUTANT', 'MONKEY'], 'NOT YET FOREVER', TIER.block.col, 'BURN A SERUM');
placeholders.artifact = typedTile('BITCOIN MONKEYS', ['STONE', 'FRAME'], 'NOT YET FOREVER', TIER.artifact.col, 'MONKEY');
placeholders.bitcoin = typedTile('BITCOIN MONKEYS', ['GOLD', 'FRAME'], 'RAREST 5%', TIER.bitcoin.col, 'JACKPOT SYMBOL');
placeholders.wild = typedTile('IDOL MONKEY', ['WILD'], 'ANY MONKEY IN GOLD LEAF', GOLD2, 'SUBSTITUTES');
placeholders.chain = typedTile('FOREVER VINE', ['XTRATA', 'ID'], 'A TWINNED MONKEY', MOSS, 'HOLD & RESPIN');
// Logos. Official files are used exactly as supplied (never recoloured, stretched or cropped) when present in art/logos at build time;
// until then the project's name is set in type on a tile in its colour.
const fixed = {};
function logoOn(g, img, w, h) { const k = Math.min(w / img.naturalWidth, h / img.naturalHeight); g.drawImage(img, 120 - img.naturalWidth * k / 2, 100 - img.naturalHeight * k / 2, img.naturalWidth * k, img.naturalHeight * k); }
function bananaTile() { const c = canvas(240, 240), g = c.getContext('2d'); g.save(); g.shadowColor = '#ffd23f'; g.shadowBlur = 16; round(g, 14, 6, 212, 212, 16, '#14110a', '#ffd23f', 5); g.restore();
  if (LOGOS.banana && LOGOS.banana.complete && LOGOS.banana.naturalWidth) { logoOn(g, LOGOS.banana, 170, 130); } else { g.save(); g.shadowColor = '#ffd23f'; g.shadowBlur = 14; text(g, 'BANANA', 120, 86, 44, '#ffd23f', 'Arial', 'center', '900'); g.restore(); text(g, 'BAN', 120, 132, 30, '#fff3b0', 'Arial', 'center', '800'); }
  round(g, 24, 168, 192, 40, 8, '#241d08'); text(g, 'BANANA', 120, 181, 19, '#ffd23f'); text(g, 'BITCOIN MONKEYS TOKEN', 120, 198, 11, '#c9b25c'); return c; }
function scatterTile() { const c = canvas(240, 240), g = c.getContext('2d'); g.save(); g.shadowColor = GOLD; g.shadowBlur = 22; round(g, 14, 6, 212, 212, 16, '#0b1a10', GOLD, 5); g.restore();
  if (LOGOS.monkeys && LOGOS.monkeys.complete && LOGOS.monkeys.naturalWidth) logoOn(g, LOGOS.monkeys, 180, 120); else { g.save(); g.shadowColor = GOLD; g.shadowBlur = 16; text(g, 'BITCOIN', 120, 62, 40, GOLD2, 'Arial', 'center', '900'); text(g, 'MONKEYS', 120, 110, 40, '#fff', 'Arial', 'center', '900'); g.restore(); }
  round(g, 24, 160, 192, 28, 7, GOLD); text(g, 'JUNGLE DRUMS', 120, 174, 17, '#241600', 'Arial', 'center', '900'); text(g, '3+ = FREE SPINS', 120, 200, 12, '#c3d6c9'); return c; }
function vaultTile() { const c = canvas(240, 240), g = c.getContext('2d'); g.save(); g.shadowColor = '#ffffff'; g.shadowBlur = 10; round(g, 14, 6, 212, 212, 16, '#0b1a10', '#e9f4d8', 4); g.restore();
  g.fillStyle = '#07120d'; g.fillRect(22, 14, 196, 150);
  if (LOGOS.store && LOGOS.store.complete && LOGOS.store.naturalWidth) logoOn(g, LOGOS.store, 176, 130); else { text(g, 'MONKEY', 120, 62, 40, GOLD2, 'Arial', 'center', '900'); text(g, 'STORE', 120, 112, 46, '#fff', 'Arial', 'center', '900'); }
  round(g, 24, 168, 192, 40, 8, '#0f2216'); text(g, 'THE MONKEY STORE', 120, 181, 17, '#fff'); text(g, 'SERUMS FOR BANANA', 120, 198, 11, '#9db8a4'); return c; }
fixed.cherry = bananaTile(); fixed.scatter = scatterTile(); fixed.vault = vaultTile();
for (const [k, key, rebuild] of [['banana', 'bananaUri', () => { fixed.cherry = bananaTile(); }], ['monkeys', 'monkeysUri', () => { fixed.scatter = scatterTile(); }], ['store', 'storeUri', () => { fixed.vault = vaultTile(); }]]) if (window.MH_LOGOS && window.MH_LOGOS[key]) { const im = new Image(); im.onload = () => { LOGOS[k] = im; rebuild(); screenDirty = true; }; im.src = window.MH_LOGOS[key]; }
const tileFor = (s, f) => FACE(s) ? (f >= 0 && pools[s][f] ? pools[s][f].tile : placeholders[s]) : fixed[s];
const faceItem = (s, f) => { const e = FACE(s) && f >= 0 ? pools[s][f] : null; return e ? (e.item || e) : null; };
const pickFace = s => FACE(s) && pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1;
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 && pools[s] && pools[s][faces[c][r]] ? faces[c][r] : pickFace(s))); }
const tileOf = it => it.kind === 'monkey' ? monkeyTile(it) : serumTile(it);
function rebuildPools() {
  items.sort((a, b) => a.order - b.order);
  for (const s of ['lemon', 'chip', 'block', 'artifact', 'bitcoin']) pools[s] = items.filter(i => i.slot === s);
  items.forEach(i => { i.tile = tileOf(i); });
  const mk = items.filter(i => i.kind === 'monkey'), first = mk.filter(i => i.forever).concat(mk.filter(i => !i.forever));
  pools.wild = first.map(i => ({ item: i, tile: idolTile(i) }));
  pools.chain = first.map(i => ({ item: i, tile: chainTile(i) }));
}
// kind: monkey (slot from tier), serum (type MM1 or MM2), mutant. Existing items are updated, never duplicated.
function addItem(kind, id, o = {}) {
  const key = `${kind}:${o.type || ''}:${id}`;
  if (byKey.has(key)) { const it = byKey.get(key); if (o.forever && !it.forever) { it.forever = true; it.xtrataId = o.xtrataId; } if (o.img && !it.img) it.img = o.img; return it; }
  const slot = kind === 'monkey' ? slotOfMonkey(o.tier || tierOfId(id)) : kind === 'mutant' ? 'block' : (o.type === 'MM1' ? 'lemon' : 'chip');
  const it = { kind, id, type: o.type || null, slot, img: o.img || null, forever: !!o.forever, xtrataId: o.xtrataId || null, order: o.order ?? 1e6 + items.length, tile: null }; items.push(it); byKey.set(key, it); return it;
}
const monkeyItem = id => byKey.get(`monkey::${id}`);
async function loadBundled() {
  // Bundled pictures first (twins are real, bundled Xtrata art); record items carry only the real token number and tier.
  await Promise.all(ART.items.map(async ([id, tk, uri, forever, xid], k) => { let img = null; if (uri) { try { img = await loadImage(uri, 8000); sources.bundled++; } catch (e) { sources.imageFailures++; } } addItem('monkey', id, { tier: tk, img, forever: !!forever, xtrataId: xid, order: k }); }));
  for (const t of ['MM1', 'MM2']) { const sr = (ART.serums || {})[t]; if (!sr) continue; let img = null; if (sr.uri) { try { img = await loadImage(sr.uri, 8000); sources.bundled++; } catch (e) { sources.imageFailures++; } } sr.ids.forEach((id, k) => addItem('serum', id, { type: t, img, order: 5e5 + k })); }
  if (ART.mutants && ART.mutants.items) for (const [id, uri] of ART.mutants.items) { let img = null; if (uri) { try { img = await loadImage(uri, 8000); sources.bundled++; } catch (e) { sources.imageFailures++; } } if (img) addItem('mutant', id, { img, order: 6e5 + id }); }
  rebuildPools(); refaceIdle(); liveLabel();
}
function liveLabel() {
  const forever = items.filter(i => i.forever).length, shown = items.filter(i => i.img).length;
  const txt = sources.helper === 'live' ? `LIVE FROM XTRATA · ${fmt(sources.twins || 0)} MONKEY TWINS · ${forever} FOREVER ON THE REELS` : sources.helper === 'none' ? 'NO BITCOIN MONKEYS HELPER FOUND · ALL MONKEYS NOT YET FOREVER' : sources.helper === 'unknown' ? 'XTRATA UNREACHABLE · TWIN COUNT UNKNOWN' : 'CONNECTING TO XTRATA…';
  $('liveSrc').textContent = txt; $('twinsSmall').textContent = `${items.filter(i => i.kind === 'monkey').length} real monkeys · ${shown} pictures loaded`; screenDirty = true;
}
