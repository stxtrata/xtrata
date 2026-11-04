
/* ---------- Real LEO Cats art: bundled twins, tiers, frames, the standby and logo tiles ---------- */
const ART = window.NL_ART || { items: [], tierString: '' }, LOGOS = window.NL_LOGOS || {};
const items = [], byId = new Map();
// Five cat pools by tier. Wild (Full Moon) and chain (lit window) are built from the same cats. The $LEO token, Fak.fun and the Forever Twin logo are fixed logo tiles.
const pools = { lemon: [], chip: [], block: [], artifact: [], bitcoin: [], wild: [], chain: [] };
const slotOfTier = k => SLOT_ORDER.find(s => TIER[s].k === k);
const FACE = s => Object.prototype.hasOwnProperty.call(pools, s);
function greyOf(img) { // a Stacks NFT without a twin: desaturated
  const c = canvas(160, 170), g = c.getContext('2d'); g.drawImage(img, 0, 0, 160, 170);
  try { const d = g.getImageData(0, 0, 160, 170), p = d.data; for (let i = 0; i < p.length; i += 4) { const y = .3 * p[i] + .59 * p[i + 1] + .11 * p[i + 2]; p[i] = y * .8; p[i + 1] = y * .84; p[i + 2] = y * .92; } g.putImageData(d, 0, 0); } catch (e) { g.fillStyle = '#000a'; g.fillRect(0, 0, 160, 170); }
  return c;
}
// Cat art is a flat colour background with the cat in the middle, so the background colour is sampled from the corner and used to widen the picture without bars.
function bgOf(src) { try { const c = canvas(4, 4), g = c.getContext('2d'); g.drawImage(src, 0, 0, 4, 4); const d = g.getImageData(0, 0, 1, 1).data; return `rgb(${d[0]},${d[1]},${d[2]})`; } catch (e) { return '#0b1330'; } }
function artArea(g, src, bg) { g.save(); g.beginPath(); g.roundRect(24, 16, 192, 160, 10); g.clip(); g.fillStyle = bg || bgOf(src); g.fillRect(24, 16, 192, 160); const fit = 160 / src.height, w = src.width * fit; g.drawImage(src, 120 - w / 2, 16, w, 160); g.restore(); }
function stamp(g, y = 96, size = 21) { g.save(); g.translate(120, y); g.rotate(-.2); g.font = `900 ${size}px Arial`; const t = 'NOT YET FOREVER', w = g.measureText(t).width + 22; g.fillStyle = '#05101ccc'; g.fillRect(-w / 2, -size * .8, w, size * 1.6); g.strokeStyle = '#ff7a59'; g.lineWidth = 3; g.strokeRect(-w / 2, -size * .8, w, size * 1.6); g.fillStyle = '#ff9a7a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 1); g.restore(); }
function foreverBadge(g, col) { g.fillStyle = '#050a14'; g.beginPath(); g.arc(204, 30, 17, 0, 7); g.fill(); drawInfinity(g, 204, 30, 30, col, false); }
function tierFrame(g, col, slot, forever) { // gold and silver get a metallic, glinting frame; the three lower tiers a plain neon one
  const gold = slot === 'bitcoin', silver = slot === 'artifact';
  g.shadowColor = col; g.shadowBlur = gold ? 22 : silver ? 16 : 14;
  round(g, 14, 6, 212, 212, 16, '#050a14', gold ? lin(g, 14, 6, 226, 218, ['#fff1b0', '#d99a12', '#ffe28a', '#a86d00']) : silver ? lin(g, 14, 6, 226, 218, ['#ffffff', '#8f9bab', '#e9eef5', '#6b7684']) : col, gold || silver ? 8 : forever ? 6 : 4); g.shadowBlur = 0;
  if (gold || silver) { g.save(); g.fillStyle = '#ffffffcc'; for (const [x, y] of [[26, 18], [214, 18], [26, 206], [214, 206]]) { g.beginPath(); g.moveTo(x, y - 7); g.lineTo(x + 2, y - 2); g.lineTo(x + 7, y); g.lineTo(x + 2, y + 2); g.lineTo(x, y + 7); g.lineTo(x - 2, y + 2); g.lineTo(x - 7, y); g.lineTo(x - 2, y - 2); g.closePath(); g.fill(); } g.restore(); }
}
// A reel tile: the cat in its tier frame, token number and tier on the caption. Forever twins show in full colour with an ∞ badge.
function catTile(it) {
  const col = TIER[it.slot].col, c = canvas(240, 240), g = c.getContext('2d');
  tierFrame(g, col, it.slot, it.forever);
  artArea(g, it.forever ? it.img : greyOf(it.img), it.forever ? null : '#2b3340');
  if (!it.forever) stamp(g);
  round(g, 24, 180, 192, 30, 7, '#0a1224'); text(g, `#${it.id}`, 22 + 52, 196, 19, '#fff'); text(g, TIER[it.slot].name, 170, 196, 13, col);
  if (it.forever) foreverBadge(g, col);
  return c;
}
// The Full Moon wild: any twinned cat silhouetted in a full-moon frame. The cat's flat background is flooded away from the edges, so only the cat is left as a shadow.
function silhouetteOf(it) {
  if (it.sil) return it.sil;
  const W = 188, H = 200, c = canvas(W, H), g = c.getContext('2d'); g.drawImage(it.img, 0, 0, W, H);
  try {
    const d = g.getImageData(0, 0, W, H), p = d.data, ref = [p[0], p[1], p[2]], near = i => Math.abs(p[i] - ref[0]) + Math.abs(p[i + 1] - ref[1]) + Math.abs(p[i + 2] - ref[2]) < 54, seen = new Uint8Array(W * H), st = [];
    for (let x = 0; x < W; x++) { st.push(x, x + (H - 1) * W); } for (let y = 0; y < H; y++) { st.push(y * W, y * W + W - 1); }
    while (st.length) { const k = st.pop(); if (seen[k]) continue; const i = k * 4; if (!near(i)) continue; seen[k] = 1; const x = k % W, y = (k / W) | 0; if (x > 0) st.push(k - 1); if (x < W - 1) st.push(k + 1); if (y > 0) st.push(k - W); if (y < H - 1) st.push(k + W); }
    for (let k = 0; k < W * H; k++) { const i = k * 4; if (seen[k]) p[i + 3] = 0; else { p[i] = 7; p[i + 1] = 11; p[i + 2] = 24; p[i + 3] = 255; } }
    g.putImageData(d, 0, 0);
  } catch (e) { g.globalCompositeOperation = 'source-in'; g.fillStyle = '#070b18'; g.fillRect(0, 0, W, H); }
  return (it.sil = c);
}
function moonTile(it) {
  const c = canvas(240, 240), g = c.getContext('2d');
  g.shadowColor = MOON; g.shadowBlur = 22; round(g, 14, 6, 212, 212, 16, '#050a1c', MOON, 7); g.shadowBlur = 0;
  g.save(); g.beginPath(); g.roundRect(24, 16, 192, 160, 10); g.clip(); g.fillStyle = lin(g, 0, 16, 0, 176, ['#081231', '#0d2145', '#12305a']); g.fillRect(24, 16, 192, 160);
  g.fillStyle = '#ffffffaa'; for (const [x, y, r] of [[46, 34, 1.4], [190, 40, 1.8], [60, 150, 1.2], [200, 130, 1.5], [150, 28, 1.1], [36, 90, 1.2]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  const mx = 120, my = 92, mr = 66; g.save(); g.shadowColor = '#fff6c8'; g.shadowBlur = 36; g.beginPath(); g.arc(mx, my, mr, 0, 7); g.fillStyle = lin(g, mx - mr, my - mr, mx + mr, my + mr, ['#fffbe6', '#f6e7b0', '#d9c88a']); g.fill(); g.restore();
  g.fillStyle = '#c9b97455'; for (const [x, y, r] of [[-20, -18, 12], [18, 8, 16], [-10, 30, 9], [30, -28, 7], [-34, 8, 6]]) { g.beginPath(); g.arc(mx + x, my + y, r, 0, 7); g.fill(); }
  if (it) { const s = silhouetteOf(it), k = 150 / s.height; g.drawImage(s, mx - s.width * k / 2, 176 - 150, s.width * k, 150); }
  g.restore();
  round(g, 24, 180, 192, 30, 7, MOON); text(g, it ? `FULL MOON · #${it.id}` : 'FULL MOON', 120, 196, 16, '#1c1500');
  if (it && it.forever) foreverBadge(g, MOON);
  return c;
}
// The lit window: a twinned cat's Xtrata inscription ID, or its token number until it is twinned.
function windowTile(it) {
  const c = canvas(240, 240), g = c.getContext('2d'), fv = it.forever, glow = fv ? '#ffd27a' : '#6b5a3a';
  g.shadowColor = fv ? '#ffb347' : '#233', g.shadowBlur = fv ? 20 : 6; round(g, 14, 6, 212, 212, 16, '#050a14', fv ? MAG2 : '#2e6f6a', 4); g.shadowBlur = 0;
  g.save(); g.beginPath(); g.roundRect(30, 16, 180, 118, 8); g.clip(); g.fillStyle = lin(g, 0, 16, 0, 134, fv ? ['#ffe9a8', '#ffc45c', '#e68a2e'] : ['#2a3140', '#1b2230', '#141a26']); g.fillRect(30, 16, 180, 118);
  if (fv) { const s = silhouetteOf(it), k = 100 / s.height; g.globalAlpha = .9; g.drawImage(s, 120 - s.width * k / 2, 134 - 100, s.width * k, 100); g.globalAlpha = 1; }
  g.restore(); g.strokeStyle = '#2b1d12'; g.lineWidth = 7; g.strokeRect(30, 16, 180, 118); g.lineWidth = 5; g.beginPath(); g.moveTo(120, 16); g.lineTo(120, 134); g.moveTo(30, 75); g.lineTo(210, 75); g.stroke();
  round(g, 22, 134, 196, 11, 3, '#5a3b22');
  text(g, fv ? 'XTRATA ID' : 'TOKEN', 120, 160, 13, '#a6f3ec'); g.save(); g.shadowColor = glow; g.shadowBlur = 10; text(g, fv ? `#${it.xtrataId}` : `#${it.id}`, 120, 184, String(fv ? it.xtrataId : it.id).length > 5 ? 34 : 40, '#fff', 'Courier New', 'center', '700'); g.restore();
  round(g, 24, 196, 192, 18, 5, fv ? MAG : '#1b2a33'); text(g, fv ? `CAT #${it.id} · ON-CHAIN FOREVER` : `CAT #${it.id} · NOT YET FOREVER`, 120, 205, 11, fv ? '#02201d' : '#ff9a7a');
  return c;
}
function loadingTile(label, col) { const c = canvas(240, 240), g = c.getContext('2d'); g.shadowColor = col; g.shadowBlur = 14; round(g, 14, 6, 212, 212, 16, '#050a14', col, 4); g.shadowBlur = 0; text(g, 'LEO', 120, 80, 44, col, 'Arial', 'center', '900'); text(g, 'CAT', 120, 124, 44, '#fff', 'Arial', 'center', '900'); text(g, label, 120, 170, 18, col); text(g, 'LOADING', 120, 196, 14, '#6e8296'); return c; }
const placeholders = {};
for (const s of SLOT_ORDER) placeholders[s] = loadingTile(TIER[s].name, TIER[s].col);
placeholders.wild = loadingTile('FULL MOON', MOON); placeholders.chain = loadingTile('LIT WINDOW', MAG2);
// Logo tiles. All three logo files are bundled (NL_LOGOS): $LEO from its token metadata, Fak.fun and the LEO Cats Forever Twin logo from the Forever Twins assets. They are drawn as supplied, never recoloured or cropped; until a file loads the name is set in type.
const fixed = {}, logoImg = {};
function logoTile(key) {
  const c = canvas(240, 240), g = c.getContext('2d'), img = logoImg[key];
  if (key === 'cherry') { g.shadowColor = '#c26bff'; g.shadowBlur = 16; round(g, 14, 6, 212, 212, 16, '#0a0716', '#a455e8', 4); g.shadowBlur = 0; g.fillStyle = '#120a22'; g.fillRect(22, 14, 196, 156);
    if (img) g.drawImage(img, 120 - 74, 92 - 74, 148, 148); else text(g, '$LEO', 120, 92, 56, '#e0b8ff', 'Arial', 'center', '900');
    round(g, 24, 176, 192, 34, 8, '#150d28'); text(g, '$LEO', 120, 193, 22, '#fff', 'Arial', 'center', '900'); }
  if (key === 'scatter') { g.shadowColor = '#ff7a1a'; g.shadowBlur = 20; round(g, 14, 6, 212, 212, 16, '#060b14', '#ff7a1a', 5); g.shadowBlur = 0; g.fillStyle = '#0a1220'; g.fillRect(22, 14, 196, 130);
    if (img) g.drawImage(img, 120 - 66, 79 - 66, 132, 132); else text(g, 'FAK.FUN', 120, 80, 40, '#ff7a1a', 'Arial', 'center', '900');
    round(g, 24, 150, 192, 28, 7, '#ff7a1a'); text(g, 'NIGHT PROWL', 120, 164, 19, '#1b0a00', 'Arial', 'center', '900'); text(g, '3+ = 8 FREE SPINS · 2×', 120, 196, 12, '#9db2c6', 'Arial', 'center', '700'); }
  if (key === 'vault') { g.shadowColor = '#ffffff'; g.shadowBlur = 10; round(g, 14, 6, 212, 212, 16, '#050a14', '#cfe9e6', 4); g.shadowBlur = 0; g.fillStyle = '#000'; g.fillRect(22, 14, 196, 150);
    if (img) g.drawImage(img, 120 - 74, 89 - 74, 148, 148); else text(g, 'LEO CATS', 120, 90, 38, '#fff', 'Arial', 'center', '900');
    round(g, 24, 168, 192, 40, 8, '#0a1224'); text(g, 'IF IT FITS', 120, 181, 20, '#fff'); text(g, 'FOREVER TWINS · 3+ = 9 BOXES', 120, 198, 10, '#8fb0b8'); }
  return c;
}
for (const k of ['cherry', 'scatter', 'vault']) fixed[k] = logoTile(k);
for (const [k, key] of [['cherry', 'leo'], ['scatter', 'fakfun'], ['vault', 'foreverTwin']]) if (LOGOS[key]) { const im = new Image(); im.onload = () => { logoImg[k] = im; fixed[k] = logoTile(k); screenDirty = true; }; im.src = LOGOS[key]; }
const tileFor = (s, f) => FACE(s) ? (f >= 0 && pools[s][f] ? pools[s][f].tile : placeholders[s]) : fixed[s];
const faceItem = (s, f) => { const e = FACE(s) && f >= 0 ? pools[s][f] : null; return e ? (e.item || e) : null; };
const pickFace = s => FACE(s) && pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1;
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 && pools[s] && pools[s][faces[c][r]] ? faces[c][r] : pickFace(s))); }
function rebuildPools() {
  items.sort((a, b) => a.order - b.order);
  for (const s of SLOT_ORDER) pools[s] = items.filter(i => i.slot === s);
  items.forEach(i => { i.tile = catTile(i); });
  // Wild and window faces come from the whole set, twinned cats first, so a Full Moon or a lit window is usually a real twin.
  const fv = items.filter(i => i.forever), rest = items.filter(i => !i.forever);
  pools.wild = [...fv, ...rest.filter((i, k) => k % 6 === 1)].map(i => ({ item: i, tile: moonTile(i) }));
  pools.chain = [...fv, ...rest.filter((i, k) => k % 6 === 3)].map(i => ({ item: i, tile: windowTile(i) }));
}
function addItem(id, tierKey, img, forever, xtrataId, order) {
  if (byId.has(id)) { const it = byId.get(id); if (forever && !it.forever) { it.forever = true; it.xtrataId = xtrataId; if (img) it.img = img; } return it; }
  const slot = slotOfTier(tierKey); if (!slot) return null;
  const it = { id, slot, img, forever: !!forever, xtrataId: xtrataId || null, order: order ?? 1e6 + items.length, tile: null }; items.push(it); byId.set(id, it); return it;
}
// The bundled art is the 101 twins that existed on ART.generated: real inscribed art, so the reels are in full colour from the first frame even offline.
async function loadBundled() {
  await Promise.all(ART.items.map(async ([id, xid, uri], k) => { try { const img = await loadImage(uri, 8000); addItem(id, ART.tierString[id - 1], img, true, String(xid), k); sources.bundled++; } catch (e) { sources.imageFailures++; } }));
  rebuildPools(); refaceIdle(); liveLabel();
}
function liveLabel() {
  const forever = items.filter(i => i.forever).length, st = sources.stale ? ' (STALE)' : '';
  const txt = sources.helper === 'live' ? `LIVE FROM XTRATA · ${fmt(sources.twins || 0)} CAT TWINS · ${forever} FOREVER ON THE REELS` : sources.helper === 'none' ? 'NO LEO CATS HELPER FOUND · ALL CATS NOT YET FOREVER' : sources.helper === 'unknown' ? `XTRATA UNREACHABLE · LAST KNOWN ${ART.twinCount || '?'} TWINS${st} · ${forever} ON THE REELS` : 'CONNECTING TO XTRATA…';
  $('liveSrc').textContent = txt; $('twinsSmall').textContent = `${items.length} real LEO Cats on the reels`; screenDirty = true; try { update(); } catch (e) {}
}
