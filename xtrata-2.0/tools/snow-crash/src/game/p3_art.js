
/* ---------- Real Crash Punks art: bundled tiles, tiers, frames, the standby and logo tiles ---------- */
const ART = window.SC_ART || { items: [], tierString: '' }, LOGOS = window.SC_LOGOS || {};
const items = [], byId = new Map();
const pools = { cherry: [], lemon: [], chip: [], block: [], artifact: [], bitcoin: [], wild: [], chain: [] };
const slotOfTier = k => SLOT_ORDER.find(s => TIER[s].k === k);
const FACE = s => Object.prototype.hasOwnProperty.call(pools, s);
function greyOf(img) { // a Stacks NFT without a twin: desaturated
  const c = canvas(160, 160), g = c.getContext('2d'); g.drawImage(img, 0, 0, 160, 160);
  try { const d = g.getImageData(0, 0, 160, 160), p = d.data; for (let i = 0; i < p.length; i += 4) { const y = .3 * p[i] + .59 * p[i + 1] + .11 * p[i + 2]; p[i] = y * .8; p[i + 1] = y * .82; p[i + 2] = y * .9; } g.putImageData(d, 0, 0); } catch (e) { g.fillStyle = '#000a'; g.fillRect(0, 0, 160, 160); }
  return c;
}
function artArea(g, src) { g.save(); g.beginPath(); g.roundRect(24, 16, 192, 160, 10); g.clip(); g.fillStyle = '#0a0614'; g.fillRect(24, 16, 192, 160); const fit = Math.min(192 / src.width, 160 / src.height); g.drawImage(src, 24 + (192 - src.width * fit) / 2, 16 + (160 - src.height * fit) / 2, src.width * fit, src.height * fit); g.restore(); }
function stamp(g, y = 96, size = 21) { g.save(); g.translate(120, y); g.rotate(-.2); g.font = `900 ${size}px Arial`; const t = 'NOT YET FOREVER', w = g.measureText(t).width + 22; g.fillStyle = '#14020ccc'; g.fillRect(-w / 2, -size * .8, w, size * 1.6); g.strokeStyle = '#ff3b6b'; g.lineWidth = 3; g.strokeRect(-w / 2, -size * .8, w, size * 1.6); g.fillStyle = '#ff5c86'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 1); g.restore(); }
function foreverBadge(g, col) { g.fillStyle = '#07040d'; g.beginPath(); g.arc(204, 30, 17, 0, 7); g.fill(); drawInfinity(g, 204, 30, 30, col, false); }
// A reel tile: the punk in its tier frame, token number and tier on the caption. Forever twins show in full colour with an ∞ badge.
function punkTile(it) {
  const col = TIER[it.slot].col, c = canvas(240, 240), g = c.getContext('2d');
  g.shadowColor = col; g.shadowBlur = 14; round(g, 14, 6, 212, 212, 16, '#07040d', col, it.forever ? 6 : 4); g.shadowBlur = 0;
  artArea(g, it.forever ? it.img : greyOf(it.img));
  if (!it.forever) stamp(g);
  round(g, 24, 180, 192, 30, 7, '#0d0716'); text(g, `#${it.id}`, 22 + 52, 196, 19, '#fff'); text(g, TIER[it.slot].name, 170, 196, 13, col);
  if (it.forever) foreverBadge(g, col);
  return c;
}
// The avatar wild: any Crash Punk in a magenta hologram frame.
function holoTile(it) {
  const c = canvas(240, 240), g = c.getContext('2d');
  g.shadowColor = MAG; g.shadowBlur = 20; round(g, 14, 6, 212, 212, 16, '#0b0414', MAG, 7); g.shadowBlur = 0;
  artArea(g, it.forever ? it.img : greyOf(it.img));
  g.save(); g.beginPath(); g.roundRect(24, 16, 192, 160, 10); g.clip(); g.globalCompositeOperation = 'screen'; g.fillStyle = '#ff3ea560'; g.fillRect(24, 16, 192, 160); g.globalCompositeOperation = 'source-over'; g.fillStyle = '#ffffff14'; for (let y = 16; y < 176; y += 5) g.fillRect(24, y, 192, 2); g.strokeStyle = '#39d8ff80'; g.lineWidth = 2; g.beginPath(); g.moveTo(24, 70); g.lineTo(216, 70); g.stroke(); g.restore();
  if (!it.forever) stamp(g, 150, 14);
  round(g, 24, 180, 192, 30, 7, MAG); text(g, `WILD · #${it.id}`, 120, 196, 17, '#1f0013');
  if (it.forever) foreverBadge(g, MAG2);
  return c;
}
// The forever tile: a punk's Xtrata inscription ID, or its token number until it is twinned.
function chainTile(it) {
  const c = canvas(240, 240), g = c.getContext('2d');
  g.shadowColor = MAG2; g.shadowBlur = 14; round(g, 14, 6, 212, 212, 16, '#07040d', it.forever ? MAG2 : '#7d3a62', 4); g.shadowBlur = 0;
  g.globalAlpha = .22; drawInfinity(g, 120, 96, 190, MAG, false); g.globalAlpha = 1;
  spaced(g, 'FOREVER', 120, 36, 17, 7, MAG3, '700');
  text(g, it.forever ? 'XTRATA ID' : 'TOKEN', 120, 74, 14, '#c9a0b8');
  g.save(); g.shadowColor = MAG; g.shadowBlur = 12; text(g, it.forever ? `#${it.xtrataId}` : `#${it.id}`, 120, 118, String(it.forever ? it.xtrataId : it.id).length > 5 ? 42 : 54, '#fff', 'Courier New', 'center', '700'); g.restore();
  round(g, 24, 160, 192, 24, 6, '#150a1c'); text(g, `PUNK #${it.id} · ${TIER[it.slot].name}`, 120, 172, 13, TIER[it.slot].col);
  round(g, 24, 188, 192, 22, 6, it.forever ? MAG : '#2a0f20'); text(g, it.forever ? 'ON-CHAIN FOREVER' : 'NOT YET FOREVER', 120, 199, 13, it.forever ? '#1f0013' : '#ff5c86');
  return c;
}
function loadingTile(label, col) { const c = canvas(240, 240), g = c.getContext('2d'); g.shadowColor = col; g.shadowBlur = 14; round(g, 14, 6, 212, 212, 16, '#07040d', col, 4); g.shadowBlur = 0; text(g, 'CRASH', 120, 80, 40, col, 'Arial', 'center', '900'); text(g, 'PUNK', 120, 124, 40, '#fff', 'Arial', 'center', '900'); text(g, label, 120, 170, 18, col); text(g, 'LOADING', 120, 196, 14, '#8d7a9a'); return c; }
const placeholders = {};
for (const s of SLOT_ORDER) placeholders[s] = loadingTile(TIER[s].name, TIER[s].col);
placeholders.wild = loadingTile('HOLO WILD', MAG); placeholders.chain = loadingTile('FOREVER', MAG2);
// Logos. The Crash Punks logo file could not be fetched, so its name is set in type on a tile in the project's colour until the
// official file is supplied. The This Is #1 mark is the platform's own SVG, drawn as supplied (never recoloured or cropped).
const fixed = {};
function scatterTile() { const c = canvas(240, 240), g = c.getContext('2d'); g.shadowColor = MAG; g.shadowBlur = 20; round(g, 14, 6, 212, 212, 16, '#0b0414', MAG, 5); g.shadowBlur = 0;
  g.save(); g.shadowColor = MAG; g.shadowBlur = 16; text(g, 'CRASH', 120, 70, 54, MAG, 'Arial', 'center', '900'); text(g, 'PUNKS', 120, 124, 54, CY, 'Arial', 'center', '900'); g.restore();
  g.fillStyle = '#ffffff10'; for (let y = 8; y < 216; y += 5) g.fillRect(16, y, 208, 1.5);
  round(g, 24, 160, 192, 28, 7, MAG); text(g, 'JACK IN', 120, 174, 18, '#1f0013', 'Arial', 'center', '900'); text(g, '3+ = JACKED IN', 120, 200, 12, '#c9a0b8'); return c; }
function vaultTile() { const c = canvas(240, 240), g = c.getContext('2d'); g.shadowColor = '#ffffff'; g.shadowBlur = 10; round(g, 14, 6, 212, 212, 16, '#0b0414', '#e9dcff', 4); g.shadowBlur = 0;
  g.fillStyle = '#0a0614'; g.fillRect(22, 14, 196, 150);
  const img = LOGOS.numberOne; if (img && img.complete && img.naturalWidth) { const k = Math.min(176 / img.naturalWidth, 130 / img.naturalHeight); g.drawImage(img, 120 - img.naturalWidth * k / 2, 88 - img.naturalHeight * k / 2, img.naturalWidth * k, img.naturalHeight * k); } else text(g, '#1', 120, 90, 80, '#fff', 'Arial', 'center', '900');
  round(g, 24, 168, 192, 40, 8, '#150a1c'); text(g, 'THE #1 CLUB', 120, 181, 19, '#fff'); text(g, 'THIS IS #1', 120, 198, 11, '#9c8aa9'); return c; }
fixed.scatter = scatterTile(); fixed.vault = vaultTile();
if (window.SC_LOGOS && window.SC_LOGOS.numberOneUri) { const im = new Image(); im.onload = () => { LOGOS.numberOne = im; fixed.vault = vaultTile(); screenDirty = true; }; im.src = window.SC_LOGOS.numberOneUri; }
const tileFor = (s, f) => FACE(s) ? (f >= 0 && pools[s][f] ? pools[s][f].tile : placeholders[s]) : fixed[s];
const faceItem = (s, f) => { const e = FACE(s) && f >= 0 ? pools[s][f] : null; return e ? (e.item || e) : null; };
const pickFace = s => FACE(s) && pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1;
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 && pools[s] && pools[s][faces[c][r]] ? faces[c][r] : pickFace(s))); }
function rebuildPools() {
  items.sort((a, b) => a.order - b.order);
  for (const s of SLOT_ORDER) pools[s] = items.filter(i => i.slot === s);
  items.forEach(i => { i.tile = punkTile(i); });
  const spread = (mod, off) => { const a = items.filter((i, k) => k % mod === off || i.forever); return a; };
  pools.wild = spread(4, 1).map(i => ({ item: i, tile: holoTile(i) }));
  pools.chain = spread(4, 3).map(i => ({ item: i, tile: chainTile(i) }));
}
function addItem(id, tierKey, img, forever, xtrataId, order) {
  if (byId.has(id)) { const it = byId.get(id); if (forever && !it.forever) { it.forever = true; it.xtrataId = xtrataId; if (img) it.img = img; } return it; }
  const slot = slotOfTier(tierKey); if (!slot) return null;
  const it = { id, slot, img, forever: !!forever, xtrataId: xtrataId || null, order: order ?? 1e6 + items.length, tile: null }; items.push(it); byId.set(id, it); return it;
}
async function loadBundled() {
  await Promise.all(ART.items.map(async ([id, tk, uri], k) => { try { const img = await loadImage(uri, 8000); addItem(id, tk, img, false, null, k); sources.bundled++; } catch (e) { sources.imageFailures++; } }));
  rebuildPools(); refaceIdle(); liveLabel();
}
function liveLabel() {
  const forever = items.filter(i => i.forever).length;
  const txt = sources.helper === 'live' ? `LIVE FROM XTRATA · ${fmt(sources.twins || 0)} PUNK TWINS · ${forever} FOREVER ON THE REELS` : sources.helper === 'none' ? 'NO CRASH PUNKS HELPER YET · ALL PUNKS NOT YET FOREVER' : sources.helper === 'unknown' ? 'XTRATA UNREACHABLE · TWIN COUNT UNKNOWN' : 'CONNECTING TO XTRATA…';
  $('liveSrc').textContent = txt; $('twinsSmall').textContent = `${items.length} real Crash Punks on the reels`; screenDirty = true;
}
