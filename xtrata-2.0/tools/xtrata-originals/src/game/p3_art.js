/* ---------- Real Xtrata work on the reels: bundled tiles (data URIs), frames and captions ---------- */
const ART = window.XO_ART || { audionauts: [], cicadas: [], calls: [], astro: [], layers: [], logos: {} }, LOGOS = {};
const CICADA_TIER = { Mythic: '#ff7ad9', Legendary: OR2, Epic: '#b18cff', Rare: BLUE2, Uncommon: '#9bcf6a', Common: '#c8ccd2' };
const pools = { cherry: [], chip: [], artifact: [], wild: [], vault: [], chain: [] };
const FACE = s => Object.prototype.hasOwnProperty.call(pools, s);
const pad3 = n => String(n).padStart(3, '0');
// The tile frame: matte black, a fine blue and orange edge like the strokes of the mark, a soft glow in the symbol's colour.
function frame(g, col, lw = 4, glow = 14) { g.shadowColor = col; g.shadowBlur = glow; round(g, 14, 6, 212, 212, 14, '#07090d', col, lw); g.shadowBlur = 0; g.strokeStyle = '#4675b680'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(26, 12); g.lineTo(214, 12); g.stroke(); g.strokeStyle = '#e28c3b80'; g.beginPath(); g.moveTo(26, 212); g.lineTo(214, 212); g.stroke(); }
function artArea(g, src, x = 24, y = 16, w = 192, h = 160, bg = '#05070b', cover = false) { g.save(); g.beginPath(); g.roundRect(x, y, w, h, 9); g.clip(); g.fillStyle = bg; g.fillRect(x, y, w, h); const sw = src.naturalWidth || src.width, sh = src.naturalHeight || src.height, k = cover ? Math.max(w / sw, h / sh) : Math.min(w / sw, h / sh); g.drawImage(src, x + (w - sw * k) / 2, y + (h - sh * k) / 2, sw * k, sh * k); g.restore(); }
function caption(g, left, right, col, bg = '#0b0f16') { round(g, 24, 180, 192, 28, 7, bg); if (right) { fitText(g, left, 30, 194, 15, 112, '#eef2f6', 'Arial', 'left', '800'); fitText(g, right, 210, 194, 14, 74, col, 'Arial', 'right', '800'); } else fitText(g, left, 120, 194, 15, 180, col, 'Arial', 'center', '800'); }
function astroTile(it) { const c = canvas(240, 240), g = c.getContext('2d'); frame(g, FRAME.cherry); artArea(g, it.img, 24, 16, 192, 160, '#050a1c', true); caption(g, 'ASTRO BLASTER 3', '#3074', FRAME.cherry); return c; }
function cicadaTile(it) { const c = canvas(240, 240), g = c.getContext('2d'), col = CICADA_TIER[it.tier] || FRAME.chip; frame(g, FRAME.chip); artArea(g, it.img, 24, 16, 192, 160, '#1a1510', true); caption(g, `SEED ${it.seed}`, it.tier.toUpperCase(), col); return c; }
function audionautTile(it) { const c = canvas(240, 240), g = c.getContext('2d'); frame(g, FRAME.artifact); artArea(g, it.img, 24, 16, 192, 160, '#080d10', true); caption(g, `${pad3(it.edition)} ${String(it.name || '').toUpperCase()}`, `#${it.tokenId}`, BLUE3); return c; }
// CALLISTO, Jim's own Audionaut, as the wild: its portrait inside a starfield frame.
function callistoTile(it) {
  const c = canvas(240, 240), g = c.getContext('2d'); g.shadowColor = '#b9a4ff'; g.shadowBlur = 22; round(g, 12, 4, 216, 216, 16, '#04030c', '#c9b6ff', 6); g.shadowBlur = 0;
  let s = 29; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; g.save(); g.beginPath(); g.roundRect(16, 8, 208, 208, 13); g.clip(); g.fillStyle = lin(g, 0, 8, 0, 216, ['#0b0726', '#170b3a', '#05030f']); g.fillRect(16, 8, 208, 208);
  for (let i = 0; i < 90; i++) { const x = 16 + rnd() * 208, y = 8 + rnd() * 208, r = rnd() < .1 ? 1.8 : .9; g.fillStyle = `rgba(${200 + rnd() * 55},${200 + rnd() * 55},255,${.4 + rnd() * .6})`; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  g.strokeStyle = '#c9b6ff40'; g.lineWidth = 1; g.beginPath(); g.ellipse(120, 96, 100, 34, -.35, 0, 7); g.stroke(); g.restore();
  g.save(); g.shadowColor = '#c9b6ff'; g.shadowBlur = 16; artArea(g, it.img, 40, 22, 160, 150, '#080d10', true); g.restore();
  round(g, 24, 180, 192, 30, 7, lin(g, 24, 0, 216, 0, ['#8f74ff', '#c9b6ff', '#8f74ff'])); text(g, 'WILD · CALLISTO', 120, 196, 17, '#0b0620', 'Arial', 'center', '900');
  return c;
}
function audionalsTile() { // the official Audionals logo file was not found: its name in type, in the Audional orange, until the file arrives
  const c = canvas(240, 240), g = c.getContext('2d'); frame(g, FRAME.lemon); g.fillStyle = lin(g, 0, 16, 0, 176, ['#1d0f04', '#0b0602']); g.beginPath(); g.roundRect(24, 16, 192, 160, 9); g.fill();
  g.save(); g.shadowColor = '#ef7410'; g.shadowBlur = 18; fitText(g, 'AUDIONALS', 120, 92, 40, 178, '#ffb23c', 'Arial', 'center', '900'); g.restore(); spaced(g, 'ON BITCOIN · ON STACKS', 120, 132, 10, 1.2, '#c98a4a', '700');
  caption(g, 'AUDIONALS', null, '#ffb23c'); return c;
}
function ftTile() { const c = canvas(240, 240), g = c.getContext('2d'); frame(g, FRAME.block); g.fillStyle = '#000'; g.beginPath(); g.roundRect(24, 16, 192, 160, 9); g.fill(); if (LOGOS.ft) artArea(g, LOGOS.ft, 30, 20, 180, 152, '#000'); else fitText(g, 'FOREVER TWINS', 120, 96, 26, 180, FRAME.block); caption(g, 'FOREVER TWINS ∞', null, FRAME.block); return c; }
function xTile() { const c = canvas(240, 240), g = c.getContext('2d'); g.shadowColor = OR; g.shadowBlur = 20; round(g, 14, 6, 212, 212, 14, '#06070a', OR2, 5); g.shadowBlur = 0; g.fillStyle = lin(g, 0, 16, 0, 176, ['#0d1422', '#05070b']); g.beginPath(); g.roundRect(24, 16, 192, 160, 9); g.fill();
  if (LOGOS.x) g.drawImage(LOGOS.x, 36, 14, 168, 168); else xtrataLogo(g, 120, 96, 168); round(g, 24, 180, 192, 30, 7, lin(g, 24, 0, 216, 0, [OR, OR2, OR])); text(g, 'XTRATA', 120, 196, 18, '#1b0d02', 'Arial', 'center', '900'); return c; }
function scatterTile() { const c = canvas(240, 240), g = c.getContext('2d'); g.shadowColor = OR; g.shadowBlur = 22; round(g, 14, 6, 212, 212, 14, '#0b1113', OR2, 5); g.shadowBlur = 0;
  g.fillStyle = lin(g, 0, 16, 0, 176, ['#1e2d30', '#090e10']); g.beginPath(); g.roundRect(24, 16, 192, 160, 9); g.fill();
  if (LOGOS.lockup) { const k = 184 / LOGOS.lockup.naturalWidth; g.drawImage(LOGOS.lockup, 28, 96 - LOGOS.lockup.naturalHeight * k / 2, 184, LOGOS.lockup.naturalHeight * k); } else fitText(g, 'THE AUDIONAUT', 120, 96, 28, 180, WHITE);
  round(g, 24, 180, 192, 30, 7, OR); text(g, 'SESSION MODE', 120, 195, 17, '#1b0d02', 'Arial', 'center', '900'); return c; }
// A cicada call: the specimen with the real envelope of its seed-fingerprinted signature call underneath.
function callTile(it) {
  const c = canvas(240, 240), g = c.getContext('2d'); frame(g, FRAME.vault, 4, 18); artArea(g, it.img, 24, 16, 192, 116, '#1a1510', true);
  g.fillStyle = '#081006'; g.beginPath(); g.roundRect(24, 134, 192, 44, 7); g.fill(); const n = it.env.length, w = 186 / n;
  it.env.forEach((v, i) => { const h = Math.max(2, v * 38); g.fillStyle = i % 2 ? '#b6e07a' : '#d8f5a8'; g.fillRect(27 + i * w, 156 - h / 2, Math.max(1, w - .8), h); });
  caption(g, `CALL · SEED ${it.seed}`, it.tier.toUpperCase(), CICADA_TIER[it.tier] || FRAME.vault, '#0a1206'); return c;
}
// A layer: a real inscription ID held by xtrata.btc or jim.btc, drawn as a data tile.
function layerTile(it) {
  const c = canvas(240, 240), g = c.getContext('2d'); frame(g, FRAME.chain, 4, 12); g.save(); g.beginPath(); g.roundRect(24, 16, 192, 160, 9); g.clip(); g.fillStyle = '#060a12'; g.fillRect(24, 16, 192, 160);
  if (it.img) { g.globalAlpha = .28; artArea(g, it.img, 24, 16, 192, 160, '#060a12', true); g.globalAlpha = 1; }
  for (let k = 0; k < 9; k++) { g.fillStyle = [BLUE + '55', OR + '40', '#e2e3e125'][k % 3]; g.fillRect(24, 34 + k * 16, 192, 3); } g.restore();
  spaced(g, 'LAYER', 120, 34, 15, 8, BLUE3, '800'); g.save(); g.shadowColor = BLUE2; g.shadowBlur = 12; fitText(g, `#${it.id}`, 120, 92, 56, 180, '#fff', 'Courier New', 'center', '700'); g.restore();
  fitText(g, `${(it.mime || 'data').replace('application/', '').replace('text/', '').toUpperCase()}${it.bytes ? ' · ' + (it.bytes > 1024 ? Math.round(it.bytes / 1024) + ' KB' : it.bytes + ' B') : ''}`, 120, 134, 14, 180, OR2, 'Arial', 'center', '700');
  fitText(g, it.block ? `BLOCK ${Number(it.block).toLocaleString('en-GB')}` : 'XTRATA CORE', 120, 156, 12, 180, MUTE, 'Arial', 'center', '700');
  caption(g, String(it.wallet || 'xtrata.btc').toUpperCase(), it.live ? 'LIVE' : 'ON CHAIN', it.live ? '#7dffb0' : BLUE3); return c;
}
function loadingTile(label, col) { const c = canvas(240, 240), g = c.getContext('2d'); frame(g, col); xtrataLogo(g, 120, 84, 120); fitText(g, label, 120, 168, 18, 180, col); text(g, 'LOADING', 120, 196, 13, MUTE); return c; }
const placeholders = {}; for (const s of Object.keys(pools)) placeholders[s] = loadingTile(SHORT[s], FRAME[s]);
const fixed = {}; const rebuildFixed = () => { fixed.lemon = audionalsTile(); fixed.block = ftTile(); fixed.bitcoin = xTile(); fixed.scatter = scatterTile(); screenDirty = true; }; rebuildFixed();
// Brand and project files, used as supplied: the Xtrata mark (series bible part 5), the Forever Twins logo, The Audionaut lockup.
for (const [k, u] of [['x', window.XO_XMARK_URI], ['ft', ART.logos.foreverTwins], ['lockup', ART.logos.audionaut]]) if (u) { const im = new Image(); im.onload = () => { LOGOS[k] = im; rebuildFixed(); }; im.src = u; }
const tileFor = (s, f) => FACE(s) ? (f >= 0 && pools[s][f] ? pools[s][f].tile : placeholders[s]) : fixed[s];
const faceItem = (s, f) => FACE(s) && f >= 0 && pools[s][f] ? pools[s][f] : null;
const pickFace = s => FACE(s) && pools[s].length ? Math.floor(Math.random() * pools[s].length) : -1; // art only: Math.random, never the engine's rng
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 && pools[s] && pools[s][faces[c][r]] ? faces[c][r] : pickFace(s))); }
async function loadBundled() {
  const load = async (list, make, pool, extra = {}) => { const out = await Promise.all(list.map(async x => { try { const img = await loadImage(x.uri || x.thumb, 8000); sources.bundled++; return Object.assign({}, x, extra, { img }); } catch (e) { sources.imageFailures++; return null; } })); out.filter(Boolean).forEach(it => { it.tile = make(it); pools[pool].push(it); }); };
  const seedOf = new Map(ART.cicadas.map(c => [c.seed, c]));
  await Promise.all([load(ART.astro, astroTile, 'cherry'), load(ART.cicadas, cicadaTile, 'chip'), load(ART.audionauts, audionautTile, 'artifact', { kind: 'audionaut' }),
    load(ART.audionauts.filter(a => a.edition === 29), callistoTile, 'wild', { kind: 'audionaut' }), load(ART.calls.map(c => Object.assign({}, c, { uri: (seedOf.get(c.seed) || {}).uri })), callTile, 'vault')]);
  for (const l of ART.layers) { let img = null; if (l.thumb) { try { img = await loadImage(l.thumb, 8000); } catch (e) {} } const it = Object.assign({}, l, { img }); it.tile = layerTile(it); pools.chain.push(it); }
  pools.artifact.sort((a, b) => a.edition - b.edition); refaceIdle(); liveLabel(); screenDirty = true;
}
function liveLabel() {
  const m = sources.mintRead === 'live' ? `${fmt(sources.minted)} AUDIONAUTS MINTED · LIVE` : sources.mintRead === 'unknown' ? 'AUDIONAUT COUNT UNKNOWN' : sources.mintRead === 'cached' ? `${fmt(sources.minted)} AUDIONAUTS · CACHED` : 'READING XTRATA…';
  $('liveSrc').textContent = `${m} · ${pools.chain.length} LAYERS${sources.liveLayers ? ` (${sources.liveLayers} LIVE)` : ''}`; $('twinsSmall').textContent = `${pools.artifact.length} Audionauts · ${pools.chip.length} cicadas on the reels`; screenDirty = true;
}
