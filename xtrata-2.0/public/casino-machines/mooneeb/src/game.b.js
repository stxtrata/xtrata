
/* ---------- Canvas helpers ---------- */
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function round(ctx, x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
function text(ctx, s, x, y, size, color = '#fff', font = 'Arial', align = 'center', weight = 'bold') { ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function fitText(ctx, s, x, y, size, maxW, color, weight = '900', font = 'Arial') { let k = size; ctx.font = `${weight} ${k}px ${font}`; while (ctx.measureText(s).width > maxW && k > 8) { k -= 1; ctx.font = `${weight} ${k}px ${font}`; } text(ctx, s, x, y, k, color, font, 'center', weight); }
function spaced(ctx, s, x, y, size, gap, color, weight = '700') { ctx.font = `${weight} ${size}px Arial`; const ws = [...s].map(ch => ctx.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0) + gap * (s.length - 1); let cx = x - total / 2; ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; [...s].forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += ws[i] + gap; }); }
function lin(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
function rad(g, x, y, r0, r1, stops) { const gr = g.createRadialGradient(x, y, r0, x, y, r1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
function star(g, x, y, r, color = '#fff3a6') { g.save(); g.translate(x, y); g.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, rr = k % 2 ? r * .38 : r; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); g.fillStyle = color; g.fill(); g.restore(); }
const ease = t => t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3), easeIO = t => t < 0 ? 0 : t > 1 ? 1 : t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const backOut = t => { t = clamp(t); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
// An original crown drawn for the MOONEEB name card (no likeness of anyone).
function crown(g, cx, cy, w) { const h = w * .62; g.save(); g.translate(cx - w / 2, cy - h / 2); g.lineJoin = 'round'; g.beginPath(); g.moveTo(0, h); g.lineTo(0, h * .28); g.lineTo(w * .25, h * .58); g.lineTo(w * .5, 0); g.lineTo(w * .75, h * .58); g.lineTo(w, h * .28); g.lineTo(w, h); g.closePath(); g.fillStyle = lin(g, 0, 0, 0, h, ['#fff6c4', '#ffd23f', '#d9901a']); g.fill(); g.lineWidth = w * .05; g.strokeStyle = INK; g.stroke(); for (const [x, y, c] of [[0, h * .28, '#ff5c8a'], [w * .5, 0, '#6c5cff'], [w, h * .28, '#ff5c8a']]) { g.beginPath(); g.arc(x, y, w * .075, 0, 7); g.fillStyle = c; g.fill(); g.stroke(); } g.fillStyle = '#ffffff99'; g.fillRect(w * .1, h * .72, w * .8, h * .08); g.restore(); }

/* ---------- Art: the original ladder illustrations, the logos and the LEO Cats twins ---------- */
const ART = window.MOONEEB_ART || { ladder: {}, twins: [], logos: {}, muneeb: null };
const img = {}, logos = { stx: null, leo: null }, logoSrc = { stx: 'type tile (official file not bundled yet)', leo: 'type tile (official file not bundled yet)' };
function loadImage(url, ms = 20000) { return new Promise((res, rej) => { const im = new Image(); im.crossOrigin = 'anonymous'; im.decoding = 'async'; const timer = setTimeout(() => { im.src = ''; rej(Error('timeout')); }, ms); im.onload = () => { clearTimeout(timer); res(im); }; im.onerror = () => { clearTimeout(timer); rej(Error('image failed')); }; im.src = url; }); }
const TIER = { cherry: ['#8b7bff', '#1b0f3d'], lemon: ['#ff9ec0', '#26103e'], chip: ['#ffe08a', '#1d1240'], block: ['#ffc53d', '#24123e'], artifact: ['#ff8a1f', '#2a1230'], bitcoin: [GOLD, '#2a1408'], wild: ['#8f84ff', '#120a3a'], scatter: ['#6fe3ff', '#0d1240'], vault: [GOLD, '#24123e'], chain: ['#ffe23d', '#24123e'] };
const LABEL = { cherry: 'M', lemon: 'MOO', chip: 'MOON', block: 'MOONEY', artifact: 'LEOPOLD · $LEO', bitcoin: 'MOONEEB', wild: 'STX · WILD', scatter: 'MOONSHOT', vault: 'MOONEY BAG' };
function tileFrame(g, sym) {
  const [edge, bg] = TIER[sym], gold = sym === 'bitcoin';
  g.save(); g.shadowColor = edge; g.shadowBlur = gold ? 22 : 12; round(g, 14, 6, 212, 212, 26, rad(g, 120, 90, 10, 170, [bg === '#2a1408' ? '#4a2a0c' : '#3a1f78', bg]), edge, gold ? 8 : 4); g.restore();
  if (gold) { round(g, 24, 16, 192, 192, 20, null, '#fff3c0', 2); }
  g.fillStyle = '#ffffff22'; for (const [x, y, r] of [[44, 40, 2], [196, 52, 1.6], [60, 160, 1.4], [188, 150, 1.8], [120, 28, 1.2]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
}
function tileLabel(g, s, color = '#f4ecff', bg = '#0e0622cc') { round(g, 34, 180, 172, 28, 14, bg); fitText(g, s, 120, 195, 17, 156, color, '900'); }
function artTile(sym, image, label = LABEL[sym]) {
  const c = canvas(240, 240), g = c.getContext('2d'); tileFrame(g, sym);
  const raster = image && /^data:image\/(jpeg|png|webp)/.test(image.src || '');
  // Supplied pop-art pictures fill the tile; the original SVG illustrations sit on the starry tile ground.
  if (raster) { g.save(); g.beginPath(); g.roundRect(22, 14, 196, 196, 20); g.clip(); const k = Math.max(196 / image.width, 196 / image.height); g.drawImage(image, 120 - image.width * k / 2, 112 - image.height * k / 2, image.width * k, image.height * k); g.restore(); round(g, 22, 14, 196, 196, 20, null, TIER[sym][0], 3); }
  else if (image) g.drawImage(image, 36, 12, 168, 168);
  tileLabel(g, label, sym === 'bitcoin' ? '#2a1408' : '#f4ecff', sym === 'bitcoin' ? GOLD : '#0e0622dd'); return c;
}
// Until the official logo files are bundled, the bible's fallback: the name set in type on a tile in the project's colour.
function typeTile(sym) {
  const c = canvas(240, 240), g = c.getContext('2d'); tileFrame(g, sym);
  if (sym === 'wild') { round(g, 52, 30, 136, 136, 30, lin(g, 0, 30, 0, 166, ['#7a6dff', STX, '#3a2bd6']), '#d9d4ff', 4); g.save(); g.shadowColor = '#0008'; g.shadowBlur = 8; text(g, 'STX', 120, 92, 54, '#ffffff', 'Arial', 'center', '900'); g.restore(); text(g, 'STACKS', 120, 138, 15, '#d9d4ff', 'Arial', 'center', '800'); }
  else { round(g, 52, 30, 136, 136, 68, lin(g, 0, 30, 0, 166, ['#ffb36b', '#ff8a1f', '#d9620a']), '#ffe1c2', 4); text(g, '$LEO', 120, 90, 40, '#2a1150', 'Arial', 'center', '900'); text(g, 'LEOPOLD', 120, 128, 15, '#3b1a05', 'Arial', 'center', '800'); }
  tileLabel(g, LABEL[sym]); return c;
}
function logoTile(sym, image) { const c = canvas(240, 240), g = c.getContext('2d'); tileFrame(g, sym); g.save(); g.beginPath(); g.roundRect(46, 24, 148, 148, sym === 'artifact' ? 74 : 26); g.clip(); const k = Math.min(148 / image.width, 148 / image.height); g.drawImage(image, 120 - image.width * k / 2, 98 - image.height * k / 2, image.width * k, image.height * k); g.restore(); tileLabel(g, LABEL[sym]); return c; }
// The jackpot symbol: Muneeb's approved image in a gold frame once supplied, and until then the crowned MOONEEB name card.
// Drawn at twice the other tiles' resolution so the portrait stays sharp on the reels and in the jackpot show.
function mooneebTile() {
  const c = canvas(480, 480), g = c.getContext('2d'); g.scale(2, 2); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; tileFrame(g, 'bitcoin');
  if (img.muneeb) { g.save(); g.beginPath(); g.roundRect(22, 14, 196, 196, 20); g.clip(); const im = img.muneeb, k = Math.max(196 / im.width, 196 / im.height); g.drawImage(im, 120 - im.width * k / 2, 104 - im.height * k / 2, im.width * k, im.height * k); g.restore(); round(g, 22, 14, 196, 196, 20, null, GOLD, 4); }   // the approved image as supplied: nothing drawn over his face
  else { round(g, 40, 58, 160, 108, 14, lin(g, 0, 58, 0, 166, ['#3b1f7a', '#1a0b3a']), GOLD, 4); crown(g, 120, 44, 70); g.save(); g.shadowColor = '#ffd76a'; g.shadowBlur = 12; fitText(g, 'MOONEEB', 120, 104, 34, 146, '#fff3c0', '900'); g.restore(); text(g, 'TOP OF THE LADDER', 120, 140, 12, '#e9c97a', 'Arial', 'center', '800'); }
  tileLabel(g, 'MOONEEB', '#2a1408', GOLD); return c;
}
// Letter tiles for hold and respin: the letters of MOONEEB, styled to match the supplied pop-art M (yellow block letter,
// dark outline and a pink drop on halftone pink or blue). Drawn in code, so every letter matches.
function popGround(g, x, y, w, h, base, dot) { g.save(); g.beginPath(); g.roundRect(x, y, w, h, 20); g.clip(); g.fillStyle = base; g.fillRect(x, y, w, h); g.fillStyle = dot; for (let yy = y; yy < y + h; yy += 9) for (let xx = x + ((yy / 9) % 2) * 4.5; xx < x + w; xx += 9) { const r = 1.2 + 2.2 * ((xx - x) / w); g.beginPath(); g.arc(xx, yy, r, 0, 7); g.fill(); } g.restore(); }
function letterTile(ch, w = 240, withLabel = true) {
  const c = canvas(w, w), g = c.getContext('2d'), s = w / 240, pink = 'MNB'.includes(ch); g.scale(s, s); tileFrame(g, 'chain');
  popGround(g, 22, 14, 196, 196, pink ? '#ff3fa4' : '#2fb8f0', pink ? '#ff8fd0' : '#7fd8ff'); round(g, 22, 14, 196, 196, 20, null, '#1b1240', 4);
  g.font = '900 132px Arial Black, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.fillStyle = pink ? '#2fb8f0' : '#ff3fa4'; g.fillText(ch, 128, 116); g.lineWidth = 10; g.strokeStyle = '#1b1240'; g.strokeText(ch, 128, 116);
  g.fillStyle = '#ffe23d'; g.fillText(ch, 120, 108); g.lineWidth = 7; g.strokeText(ch, 120, 108);
  if (withLabel) tileLabel(g, 'LETTER TILE'); return c;
}
const symbolImages = {}, letterTiles = {}, letterTilesSmall = {};
let artReady = false;
async function buildArt() {
  const L = ART.ladder || {};
  await Promise.all(Object.entries(L).map(async ([k, src]) => { try { img[k] = await loadImage(src, 8000); } catch (e) {} }));
  if (ART.muneeb && ART.muneeb.src) { try { img.muneeb = await loadImage(ART.muneeb.src, 8000); } catch (e) {} }
  for (const [k, l] of Object.entries(ART.logos || {})) { if (l && l.src) { try { logos[k] = await loadImage(l.src, 8000); logoSrc[k] = l.source || 'bundled'; } catch (e) {} } }
  symbolImages.cherry = artTile('cherry', img.m); symbolImages.lemon = artTile('lemon', img.moo); symbolImages.chip = artTile('chip', img.moon); symbolImages.block = artTile('block', img.mooney);
  symbolImages.scatter = artTile('scatter', img.rocket); symbolImages.vault = artTile('vault', img.bag);
  symbolImages.artifact = logos.leo ? logoTile('artifact', logos.leo) : typeTile('artifact');
  symbolImages.wild = logos.stx ? logoTile('wild', logos.stx) : typeTile('wild');
  symbolImages.bitcoin = mooneebTile();
  for (const ch of 'MONEB') { letterTiles[ch] = letterTile(ch); letterTilesSmall[ch] = letterTile(ch, 240, false); }
  symbolImages.chain = letterTiles.M; artReady = true; iconURL.length = 0; screenDirty = true;
}
const iconURL = {};
// $LEO's official image, read live from the token's own metadata through xtrata.xyz's Hiro proxy. Drawn only if the host
// serves it with CORS (so the screen canvas stays clean); otherwise the type tile stays.
async function loadLiveLogos() {
  if (logos.leo) return;
  try {
    const meta = await getJSON(`${SRC.origin}/hiro/mainnet/metadata/v1/ft/SP1AY6K3PQV5MRT6R4S671NWW2FRVPKM0BR162CT6.leo-token`, 1);
    for (const url of [meta.image_canonical_uri, meta.image_uri, meta.metadata && meta.metadata.image].filter(Boolean)) {
      try { const im = await loadImage(url, 12000); const t = canvas(8, 8).getContext('2d'); t.drawImage(im, 0, 0, 8, 8); t.getImageData(0, 0, 1, 1); logos.leo = im; logoSrc.leo = url + ' (live, from the leo-token metadata)'; symbolImages.artifact = logoTile('artifact', im); screenDirty = true; return; } catch (e) {}
    }
  } catch (e) {}
}

/* ---------- Live twins: LEO Cats, read from the Forever Twins registry and helper, art from Xtrata ---------- */
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', hiro: 'https://api.hiro.so' };
const CACHE_KEY = 'xtrata.mooneeb.twins';
const LEO = { key: 'leo-cats', name: 'LEO Cats', itemNoun: 'LEO Cat', helper: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-fakfun-xtrata', accent: '#12b5a6' };
const twins = [], sources = { registry: 'pending', lists: 0, listFailures: 0, images: 0, imageFailures: 0, cached: false, done: false, bundled: 0, inscribed: null, countState: 'reading' };
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { const r = await fetch(url, { cache: 'default' }); if (r.ok) return await r.json(); last = Error(`HTTP ${r.status}`); } catch (e) { last = e; } await sleep(400 + i * 600); } throw last; }
function parseEvents(json) { const out = []; let count = 0; for (const e of (json && json.results) || []) { const repr = (e.contract_log && e.contract_log.value && e.contract_log.value.repr) || ''; const t = /\(token-id u(\d+)\)/.exec(repr), x = /\(xtrata-id u(\d+)\)/.exec(repr), n = /\(inscribed-count u(\d+)\)/.exec(repr); if (t && x) out.push({ tokenId: Number(t[1]), xtrataId: x[1] }); if (n) count = Math.max(count, Number(n[1])); } return { list: out, count, rows: ((json && json.results) || []).length }; }
async function eventsPage(helper, offset) { const q = `/extended/v1/contract/${helper}/events?limit=50&offset=${offset}`; try { return await getJSON(`${SRC.origin}/hiro/mainnet${q}`); } catch (e) { return await getJSON(`${SRC.hiro}${q}`, 1); } }
async function sampleTwins(col) {
  const first = parseEvents(await eventsPage(col.helper, 0)), found = new Map(first.list.map(t => [t.tokenId, t]));
  col.inscribed = first.count || found.size;
  if (first.rows === 50 && col.inscribed > 50) for (const o of [1, 2].map(() => 50 + Math.floor(Math.random() * Math.max(1, col.inscribed - 50)))) { try { parseEvents(await eventsPage(col.helper, o)).list.forEach(t => found.set(t.tokenId, t)); } catch (e) {} }
  return [...found.values()];
}
const twinUrl = xid => { const [a, n] = SRC.core.split('.'); return `${SRC.origin}/inscription/mainnet/${a}/${n}/${xid}`; };
function desaturate(c) { try { const g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height), p = d.data; for (let i = 0; i < p.length; i += 4) { const y = p[i] * .3 + p[i + 1] * .59 + p[i + 2] * .11; p[i] = p[i + 1] = p[i + 2] = y * .85 + 20; } g.putImageData(d, 0, 0); } catch (e) { const g = c.getContext('2d'); g.fillStyle = '#5558'; g.fillRect(0, 0, c.width, c.height); } return c; }
// A twin card for the Moonshot starfield: its art, token number, Xtrata ID and the ∞ badge in LEO Cats' colour.
function twinCard(t, forever) {
  const c = canvas(220, 260), g = c.getContext('2d'), acc = forever ? LEO.accent : '#8a8a96';
  g.save(); g.shadowColor = acc; g.shadowBlur = 16; round(g, 10, 10, 200, 240, 18, '#0b0418', acc, 5); g.restore();
  const art = canvas(184, 184), ag = art.getContext('2d'); ag.imageSmoothingEnabled = false; const im = t.img, k = Math.min(184 / im.width, 184 / im.height); ag.drawImage(im, (184 - im.width * k) / 2, (184 - im.height * k) / 2, im.width * k, im.height * k); if (!forever) desaturate(art);
  g.save(); g.beginPath(); g.roundRect(18, 18, 184, 184, 12); g.clip(); g.drawImage(art, 18, 18); g.restore();
  if (forever) { g.fillStyle = '#05080c'; g.beginPath(); g.arc(186, 34, 17, 0, 7); g.fill(); text(g, '∞', 186, 34, 26, LEO.accent, 'Arial', 'center', '900'); }
  else { g.save(); g.translate(110, 110); g.rotate(-.32); round(g, -96, -20, 192, 40, 6, '#00000099', '#ff5c8a', 4); text(g, 'NOT YET FOREVER', 0, 1, 19, '#ffb3c7', 'Arial', 'center', '900'); g.restore(); }
  text(g, `LEO CAT #${t.tokenId}`, 110, 218, 17, '#f4ecff', 'Arial', 'center', '900'); text(g, forever ? `XTRATA #${t.xtrataId}` : 'NO TWIN YET', 110, 238, 12, forever ? LEO.accent : '#ff9ec0', 'Arial', 'center', '800');
  return c;
}
// Which twins count as forevered. Real play: every twin read from the helper is forevered. The test panel can switch this
// to some / none to check the NOT YET FOREVER look; it never changes a result.
function isForever(t) { return twinsMode === 'live' || twinsMode === 'all' ? true : twinsMode === 'none' ? false : t.tokenId % 2 === 0; }
function twinCount() { if (twinsMode === 'none') return 0; if (twinsMode === 'some') return sources.inscribed == null ? null : Math.round(sources.inscribed / 2); return sources.inscribed; }
async function addTwin(t, im, bundled) { const twin = { ...t, img: im, bundled }; twin.cardF = twinCard(twin, true); twin.cardN = twinCard(twin, false); twins.push(twin); }
async function loadBundled() { await Promise.all((ART.twins || []).map(async a => { try { const im = await loadImage(a.src, 8000); await addTwin(a, im, true); sources.bundled++; } catch (e) {} })); screenDirty = true; }
async function loadTwins() {
  await loadBundled();
  let col = { ...LEO };
  try { const reg = await getJSON(SRC.origin + SRC.registry); if (reg && reg.core && reg.core.contract) SRC.core = reg.core.contract; const c = (reg.collections || []).find(x => x.key === 'leo-cats' && x.status === 'live' && x.helper); if (c) col = { ...col, helper: c.helper, name: c.name, accent: (c.theme && c.theme.accent) || col.accent }; sources.registry = 'live'; }
  catch (e) { sources.registry = 'fallback'; }
  let cache = null; try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  const fresh = cache && Date.now() - cache.time < 6 * 3600e3 && cache.core === SRC.core;
  let list = [];
  // Six-hour cache, as Forever Twins does. A failed read leaves the twin count unknown, never zero.
  try { list = fresh ? cache.list : await sampleTwins(col); sources.inscribed = fresh ? cache.count : (col.inscribed || list.length); sources.lists++; sources.countState = 'live'; }
  catch (e) { sources.listFailures++; sources.countState = 'unknown'; if (cache && cache.count) { sources.inscribed = cache.count; sources.countState = 'stale'; } }
  sources.cached = !!fresh;
  try { if (!fresh && list.length) localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), core: SRC.core, list, count: sources.inscribed })); } catch (e) {}
  const have = new Set(twins.map(t => t.tokenId)), queue = list.filter(t => !have.has(t.tokenId)).sort(() => Math.random() - .5).slice(0, 12);
  let i = 0; const worker = async () => { while (i < queue.length) { const item = queue[i++]; try { const im = await loadImage(twinUrl(item.xtrataId)); await addTwin({ key: 'leo-cats', ...item }, im, false); sources.images++; } catch (e) { sources.imageFailures++; } } };
  await Promise.all(Array.from({ length: 4 }, worker));
  sources.done = true; screenDirty = true;
}
