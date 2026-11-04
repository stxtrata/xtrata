/* ---------- Genesis 21 reel art: nine 2021 collections plus real records from Stacks' first blocks ----------
   Nothing here is drawn by hand. A forevered twin loads from Xtrata (full colour, ∞ badge, token number).
   A Stacks NFT with no twin yet shows its own art desaturated with a NOT YET FOREVER stamp. Genesis block and
   Bitcoin anchor tiles are data tiles built from real Stacks blocks read from the Hiro API at build time. */
const BLOCKS = ((window.G21_CHAIN && window.G21_CHAIN.blocks) || []).map(([h, hx, bh, t]) => ({ h, hx, bh, t }));
const dateOf = t => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase();
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', hiro: 'https://api.hiro.so' };
const NFTDATA = window.G21_NFT || {};
// The nine collections. `slot` is the engine symbol they fill; `alias` lets a Forever Twins helper that goes live later switch them on.
const COLS = [
  { key: 'arties', slot: 'cherry', name: 'Arties', sub: 'Open Art Source', alias: ['arties', 'openartsource'] },
  { key: 'satoshe', slot: 'lemon', name: 'SatoSHE', alias: ['satoshe'] },
  { key: 'satoshibles', slot: 'chip', name: 'Satoshibles', alias: ['satoshibles'] },
  { key: 'stacks-punks', slot: 'block', name: 'Stacks Punks', alias: ['stackspunks', 'stackspunksv3'] },
  { key: 'bitcoin-birds', slot: 'artifact', name: 'Bitcoin Birds', alias: ['bitcoinbirds'], accent: '#1c7ed6', itemNoun: 'Bitcoin Bird', helper: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-bitcoin-birds' },
  { key: 'this-is-1', slot: 'bitcoin', name: 'This Is #1', alias: ['thisis1', 'thisisnumberone'], gold: true },
  { key: 'megapont-ape-club', slot: 'wild', name: 'Megapont Ape Club', alias: ['megapontapeclub'], accent: '#7048e8', itemNoun: 'Megapont Ape', helper: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-megapont-ape-club' },
  { key: 'bitcoin-monkeys', slot: 'wild', name: 'Bitcoin Monkeys', alias: ['bitcoinmonkeys'], accent: '#d9a300', itemNoun: 'Bitcoin Monkey', helper: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.forever-twin-bitcoin-monkeys' },
  { key: 'boomboxes', slot: 'vault', name: 'Boomboxes', alias: ['boomboxes', 'boombox'] }];
// Collections that already have a Forever Twins helper (used if the registry cannot be read).
const TWINNED_AT_LAUNCH = ['bitcoin-birds', 'megapont-ape-club', 'bitcoin-monkeys'];
COLS.forEach(c => { Object.assign(c, { twinned: TWINNED_AT_LAUNCH.includes(c.key), inscribed: null, inscribedLive: false, loaded: 0, bundled: 0, list: [] }); });
const colByKey = key => COLS.find(c => c.key === key);
const SLOTS = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin', 'wild', 'scatter', 'vault', 'chain'];
const pools = Object.fromEntries(SLOTS.map(s => [s, []]));
const sources = { registry: 'pending', lists: 0, listFailures: 0, images: 0, imageFailures: 0, nftImages: 0, nftFailures: 0, cached: false, done: false, bundled: 0 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const shortName = col => col.name.replace(/^Bitcoin /, '').replace(/ Ape Club$/, '').toUpperCase();
function wrapLines(g, s, maxW) { const words = s.split(' '), lines = []; let cur = ''; for (const w of words) { const t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; }
function stampMark(g, cx, cy, w, size) { g.save(); g.translate(cx, cy); g.rotate(-.2); g.font = `900 ${size}px Arial`; const tw = Math.min(w, g.measureText('NOT YET FOREVER').width + 22); round(g, -tw / 2, -size * .8, tw, size * 1.6, 7, '#14102ee6', '#f3ead6', 3); text(g, 'NOT YET FOREVER', 0, 0, size, '#f3ead6', 'Arial', 'center', '900'); g.restore(); }
function greyOut(g, x, y, w, h) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.globalCompositeOperation = 'saturation'; g.fillStyle = 'hsl(0,0%,50%)'; g.fillRect(x, y, w, h); g.globalCompositeOperation = 'source-over'; g.fillStyle = 'rgba(20,16,50,.28)'; g.fillRect(x, y, w, h); g.restore(); }
/* The #1 logo (a This Is #1 brand asset, used exactly as published, never redrawn): the face of the This Is #1 symbol until real token art arrives. */
const t1Logo = new Image(); let t1LogoReady = false;
t1Logo.onload = () => { t1LogoReady = true; try { placeholders.bitcoin = nameTileFor('bitcoin'); screenDirty = true; } catch (e) {} };
t1Logo.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(T1_LOGO_SVG);
// A reel tile for one NFT: twinned = full colour with ∞ badge and token number; not yet forevered = desaturated and stamped.
function nftTile(img, col, item) {
  const c = canvas(240, 240), g = c.getContext('2d'), tw = !!item.twinned, wild = col.slot === 'wild', logoFace = !img && col.slot === 'bitcoin' && t1LogoReady;
  const frame = tw ? (col.accent || '#6a5bff') : col.gold ? '#f0b429' : '#8f86c9';
  g.shadowColor = col.gold ? '#f0b429' : tw ? frame : '#5546ff'; g.shadowBlur = col.gold ? 22 : 12; round(g, 14, 6, 212, 212, 16, '#100b2c', frame, col.gold ? 7 : tw ? 5 : 4); g.shadowBlur = 0;
  g.save(); g.beginPath(); g.roundRect(24, 16, 192, 160, 10); g.clip(); g.fillStyle = '#1b1450'; g.fillRect(24, 16, 192, 160);
  if (img) { const fit = Math.min(192 / img.width, 160 / img.height), k = img.width <= 200 && fit >= 1 ? Math.floor(fit) : fit, w = img.width * k, h = img.height * k; g.imageSmoothingEnabled = img.width > 200; g.drawImage(img, 24 + (192 - w) / 2, 16 + (160 - h) / 2, w, h); }
  else if (logoFace) { g.drawImage(t1Logo, 24 + (192 - 168) / 2, 16 + (160 - 105) / 2 - 4, 168, 105); }
  else { let fs = 30; g.font = `800 ${fs}px Arial`; while (fs > 16 && col.name.toUpperCase().split(' ').some(w => g.measureText(w).width > 170)) { fs -= 2; g.font = `800 ${fs}px Arial`; } const ls = wrapLines(g, col.name.toUpperCase(), 170); ls.forEach((l, i) => text(g, l, 120, 96 + (i - (ls.length - 1) / 2) * (fs + 6), fs, '#cfc8ff', 'Arial', 'center', '800')); }
  if (!tw && !logoFace) greyOut(g, 24, 16, 192, 160);
  g.restore();
  const label = wild ? `OG WILD · ${shortName(col)}` : item.tokenId != null ? `#${item.tokenId}` : (item.name || col.name).toUpperCase();
  let lfs = wild ? 15 : 19; g.font = `700 ${lfs}px Arial`; while (lfs > 10 && g.measureText(label).width > 180) { lfs--; g.font = `700 ${lfs}px Arial`; }
  round(g, 24, 180, 192, 30, 7, tw ? (wild ? '#f0b429' : '#100b2c') : '#2a2260'); text(g, label, 120, 196, lfs, tw ? (wild ? '#2a1f00' : '#f3ead6') : '#b9b2e8');
  if (tw) { g.fillStyle = '#14102e'; g.beginPath(); g.arc(204, 30, 17, 0, 7); g.fill(); drawInfinity(g, 204, 30, 30, wild ? '#f6c453' : '#b9adff', false); }
  else if (!logoFace) stampMark(g, 120, 146, 200, 17);
  return c;
}
// Real records from Stacks' first blocks, drawn as cream data tiles.
function dataTile(kind, b) {
  const c = canvas(240, 240), g = c.getContext('2d'), gen = kind === 'scatter', col = gen ? '#f0b429' : '#5546ff';
  g.shadowColor = col; g.shadowBlur = 16; round(g, 14, 6, 212, 212, 16, '#f3ead6', col, gen ? 7 : 5); g.shadowBlur = 0;
  round(g, 24, 16, 192, 36, 9, gen ? '#2a1f7a' : '#5546ff'); text(g, gen ? 'GENESIS BLOCK' : 'BITCOIN ANCHOR', 120, 34, gen ? 19 : 18, '#f3ead6', 'Arial', 'center', '900');
  text(g, 'STACKS', 120, 76, 15, '#7a6e57', 'Arial', 'center', '700'); text(g, `#${b.h}`, 120, 108, gen ? 44 : 38, '#2a1f7a', 'Arial', 'center', '900');
  text(g, b.hx.slice(0, 12) + '…', 120, 140, 17, '#5546ff', 'Courier New', 'center', '700');
  g.fillStyle = '#5546ff44'; g.fillRect(40, 152, 160, 2);
  text(g, 'ANCHORED TO BITCOIN', 120, 168, 12, '#7a6e57', 'Arial', 'center', '700'); text(g, `BTC ${b.bh.toLocaleString('en-GB')}`, 120, 187, 24, '#c2680a', 'Arial', 'center', '900');
  text(g, dateOf(b.t), 120, 206, 12, '#7a6e57', 'Arial', 'center', '700');
  return c;
}
function nameTileFor(slot) { const cols = COLS.filter(c => c.slot === slot); return nftTile(null, cols[0], { twinned: cols[0].twinned, tokenId: null }); }
const placeholders = {};
function fillDataPools() {
  if (!BLOCKS.length) { const fake = { h: 1, hx: '0x6b2c80962', bh: 666053, t: '2021-01-14T17:28:24Z' }; pools.scatter.push({ key: 'genesis', tile: dataTile('scatter', fake), data: true }); pools.chain.push({ key: 'anchor', tile: dataTile('chain', fake), data: true }); return; }
  pools.scatter.push({ key: 'genesis', tokenId: 1, tile: dataTile('scatter', BLOCKS[0]), data: true });
  const picks = Array.from({ length: 18 }, (_, i) => BLOCKS[Math.min(BLOCKS.length - 1, 1 + i * 6)]);
  picks.forEach(b => pools.chain.push({ key: 'anchor', tokenId: b.h, tile: dataTile('chain', b), data: true, block: b }));
}
fillDataPools();
SLOTS.forEach(s => { placeholders[s] = (s === 'scatter' || s === 'chain') ? pools[s][0].tile : nameTileFor(s); });
for (const id of ['brandmark']) { const el = $(id); if (el) xtrataLogo(el.getContext('2d'), el.width / 2, el.height / 2, el.width * .9); }
(function () { const el = $('loaderMark'); if (!el) return; const g = el.getContext('2d'); const w = el.width, h = el.height; g.save(); g.shadowColor = '#8d83ff'; g.shadowBlur = 20; spaced(g, 'GENESIS', w / 2, h * .38, w * .13, w * .03, '#fff4d8', '700'); g.restore(); g.save(); g.shadowColor = '#f0b429'; g.shadowBlur = 24; text(g, '21', w / 2, h * .72, h * .38, '#f6c453', 'Arial', 'center', '900'); g.restore(); })();

const getJSONraw = async (url, ms) => { const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), ms || 12000); try { const r = await fetch(url, { cache: 'default', signal: ctl.signal }); if (!r.ok) throw Error(`HTTP ${r.status}`); return await r.json(); } finally { clearTimeout(t); } };
async function getJSON(url, tries = 2) { let last; for (let i = 0; i < tries; i++) { try { return await getJSONraw(url); } catch (e) { last = e; } await sleep(400 + i * 600); } throw last; }
function parseEvents(json) { const out = []; let count = 0; for (const e of (json && json.results) || []) { const repr = (e.contract_log && e.contract_log.value && e.contract_log.value.repr) || ''; const t = /\(token-id u(\d+)\)/.exec(repr), x = /\(xtrata-id u(\d+)\)/.exec(repr), n = /\(inscribed-count u(\d+)\)/.exec(repr); if (t && x) out.push({ tokenId: Number(t[1]), xtrataId: x[1] }); if (n) count = Math.max(count, Number(n[1])); } return { list: out, count, rows: ((json && json.results) || []).length }; }
async function eventsPage(helper, offset) { const q = `/extended/v1/contract/${helper}/events?limit=50&offset=${offset}`; try { return await getJSON(`${SRC.origin}/hiro/mainnet${q}`); } catch (e) { return await getJSON(`${SRC.hiro}${q}`, 1); } }
// A random sample of each helper's twins: the newest page, plus two pages from random points in its history.
async function sampleTwins(col) {
  const first = parseEvents(await eventsPage(col.helper, 0)), found = new Map(first.list.map(t => [t.tokenId, t]));
  col.inscribed = first.count || found.size; col.inscribedLive = true;
  if (first.rows === 50 && col.inscribed > 50) for (const o of [1, 2].map(() => 50 + Math.floor(Math.random() * Math.max(1, col.inscribed - 50)))) { try { parseEvents(await eventsPage(col.helper, o)).list.forEach(t => found.set(t.tokenId, t)); } catch (e) {} }
  return [...found.values()];
}
function loadImage(url, ms = 20000) { return new Promise((res, rej) => { const img = new Image(); img.crossOrigin = 'anonymous'; img.decoding = 'async'; const timer = setTimeout(() => { img.src = ''; rej(Error('timeout')); }, ms); img.onload = () => { clearTimeout(timer); res(img); }; img.onerror = () => { clearTimeout(timer); rej(Error('image failed')); }; img.src = url; }); }
const twinUrl = xid => { const [a, n] = SRC.core.split('.'); return `${SRC.origin}/inscription/mainnet/${a}/${n}/${xid}`; };
function addToPool(col, item, img) {
  const pool = pools[col.slot];
  if (item.twinned) { for (let i = pool.length - 1; i >= 0; i--) if (pool[i].key === col.key && !pool[i].twinned) pool.splice(i, 1); }
  pool.push({ ...item, key: col.key, name: item.name || col.itemNoun || col.name, collection: item.collection || col.name, tile: nftTile(img, col, item), img });
}
function liveLabel() {
  const n = SLOTS.reduce((a, s) => a + pools[s].filter(t => t.twinned).length, 0), m = SLOTS.reduce((a, s) => a + pools[s].filter(t => t.img && !t.twinned).length, 0);
  const txt = sources.images ? `LIVE FROM XTRATA · ${n} TWINS ON THE REELS` : sources.done ? `XTRATA UNREACHABLE · ${n} BUNDLED TWINS` : 'CONNECTING TO XTRATA…';
  if ($('liveSrc')) $('liveSrc').textContent = txt; if ($('twinsSmall')) $('twinsSmall').textContent = `${n} forevered twins · ${m} not yet forever`; screenDirty = true;
}
// Real art bundled in the file: genuine twins (and any NFT art bundled at build time) on the reels from the first frame, even offline.
async function loadBundled() {
  const art = window.G21_ART || [];
  await Promise.all(art.map(async a => { const col = colByKey(a.key); if (!col) return; try { const img = await loadImage(a.src, 8000); addToPool(col, { tokenId: a.tokenId, xtrataId: a.xtrataId, twinned: !!a.xtrataId && col.twinned, bundled: true }, img); col.bundled++; sources.bundled++; } catch (e) {} }));
  liveLabel();
}
async function loadTwins() {
  await loadBundled();
  let cols = null;
  try { const reg = await getJSON(SRC.origin + SRC.registry); if (reg && reg.core && reg.core.contract) SRC.core = reg.core.contract; cols = (reg.collections || []).filter(c => c.status === 'live' && c.helper); sources.registry = 'live'; }
  catch (e) { sources.registry = 'fallback'; }
  // A helper that appears in the registry for one of our nine switches that collection on.
  const live = [];
  for (const rc of cols || []) { const col = COLS.find(c => c.alias.includes(norm(rc.key)) || c.alias.includes(norm(rc.name))); if (!col) continue; col.twinned = true; col.helper = rc.helper; col.itemNoun = rc.itemNoun || rc.name; col.accent = (rc.theme && rc.theme.accent) || col.accent || '#6a5bff'; live.push(col); }
  const useCols = live.length ? live : COLS.filter(c => c.twinned && c.helper);
  let cache = null; try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  const fresh = cache && Date.now() - cache.time < 6 * 3600e3 && cache.core === SRC.core;
  await Promise.all(useCols.map(async col => {
    try { const list = fresh && cache.lists[col.key] ? cache.lists[col.key] : await sampleTwins(col); col.list = list; if (fresh && cache.counts && cache.counts[col.key] != null && !col.inscribedLive) { col.inscribed = cache.counts[col.key]; col.inscribedLive = true; } if (col.inscribed == null) col.inscribed = list.length; sources.lists++; }
    catch (e) { sources.listFailures++; col.list = []; }   // a failed read is "unknown", never "no twins"
  }));
  sources.cached = !!fresh;
  try { if (!fresh) localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), core: SRC.core, lists: Object.fromEntries(useCols.map(c => [c.key, c.list])), counts: Object.fromEntries(useCols.map(c => [c.key, c.inscribed])) })); } catch (e) {}
  screenDirty = true;
  const queue = [];
  for (const c of useCols) { const have = new Set(pools[c.slot].filter(t => t.key === c.key && t.twinned).map(t => t.tokenId)); const quota = c.slot === 'wild' ? 9 : 18; c.list.filter(t => !have.has(t.tokenId)).sort(() => Math.random() - .5).slice(0, quota).forEach(item => queue.push({ c, item })); }
  queue.sort(() => Math.random() - .5);
  let i = 0; const worker = async () => { while (i < queue.length) { const { c, item } = queue[i++]; try { const img = await loadImage(twinUrl(item.xtrataId)); addToPool(c, { tokenId: item.tokenId, xtrataId: item.xtrataId, twinned: true }, img); c.loaded++; sources.images++; liveLabel(); } catch (e) { sources.imageFailures++; } } };
  await Promise.all(Array.from({ length: 6 }, worker));
  sources.done = true; liveLabel();
}
// Stacks NFTs without a twin: the token's own art, resolved from its source contract, shown grey with a NOT YET FOREVER stamp.
const GATEWAYS = ['https://cloudflare-ipfs.com/ipfs/', 'https://ipfs.io/ipfs/', 'https://dweb.link/ipfs/', 'https://w3s.link/ipfs/'];
const ipfsPath = u => { const m = /^ipfs:\/\/(?:ipfs\/)?(.+)$/.exec(u || ''); if (m) return m[1]; const n = /\/ipfs\/(.+)$/.exec(u || ''); return n ? n[1] : null; };
const urlsFor = u => { const p = ipfsPath(u); return p ? GATEWAYS.map(g => g + p) : (u ? [u] : []); };
async function nftImage(t) {
  const direct = []; if (t.hiro) direct.push(t.hiro); if (t.img && !/punks\.png$/.test(t.img)) direct.push(...urlsFor(t.img));
  for (const u of direct) { try { return await loadImage(u, 12000); } catch (e) {} }
  if (t.uri && !/thisisnumberone\.com\/nfts\/$/.test(t.uri)) for (const u of urlsFor(String(t.uri).replace('{id}', t.id).replace('$TOKEN_ID', t.id))) { try { const j = await getJSONraw(u, 10000), im = j.image || j.image_url || j.imageUrl; if (im) for (const v of urlsFor(im)) { try { return await loadImage(v, 12000); } catch (e) {} } break; } catch (e) {} }
  throw Error('no art');
}
async function loadNfts() {
  const queue = [];
  for (const c of COLS) { const d = NFTDATA[c.key]; if (!d || c.twinned || c.key === 'this-is-1') continue; const have = pools[c.slot].filter(t => t.key === c.key && t.img).length; (d.tokens || []).slice(0, Math.max(0, 18 - have)).forEach(t => queue.push({ c, t })); }
  let i = 0; const worker = async () => { while (i < queue.length) { const { c, t } = queue[i++]; if (c.twinned) continue; try { const img = await nftImage(t); addToPool(c, { tokenId: t.id, twinned: false }, img); sources.nftImages++; liveLabel(); } catch (e) { sources.nftFailures++; } } };
  await Promise.all(Array.from({ length: 4 }, worker)); liveLabel();
}

// This Is #1: real art from thisisnumberone.com (its collection pages), loaded live. The five Genesis NFTs are the power symbols; the other
// collections (No.1 Smiley, Hash One, NarcotiX, Love Hirsts MDMA, Zoom, Face Your Head, Feel Up, $€X¥, BrandX, XLove, Game On, Crash Punks, Singularity)
// share the reels. Small files first; the one multi-megabyte animation (NarcotiX) last. Shown grey with the stamp, like any Stacks NFT without a twin.
async function loadThisIs1() {
  const col = colByKey('this-is-1'), list = (window.G21_T1 && window.G21_T1.items) || [];
  const order = [...list.filter(i => i.power), ...list.filter(i => !i.power && i.kb < 1000), ...list.filter(i => !i.power && i.kb >= 1000)];
  let i = 0; const worker = async () => { while (i < order.length) { const it = order[i++]; try { const img = await loadImage(it.url, it.kb >= 1000 ? 90000 : 25000); addToPool(col, { tokenId: null, name: it.name, collection: it.collectionTitle, power: !!it.power, twinned: false }, img); sources.nftImages++; liveLabel(); } catch (e) { sources.nftFailures++; } } };
  await Promise.all(Array.from({ length: 3 }, worker));
}

/* ---------- Faces: which piece of art a reel cell shows. Chosen after the result, cosmetic only. ---------- */
const hasArt = s => pools[s] && pools[s].length > 0;
// The five Genesis NFTs are the This Is #1 power symbols: they come up far more often than the other #1 collections.
const faceWeight = t => t.power ? 8 : 1;
function pickFace(s, powerOnly) {
  if (!hasArt(s)) return -1; const p = pools[s], pw = p.some(t => t.power);
  if (!pw) return Math.floor(Math.random() * p.length);
  let tot = 0; p.forEach(t => { if (!powerOnly || t.power) tot += faceWeight(t); }); let r = Math.random() * tot;
  for (let i = 0; i < p.length; i++) { if (powerOnly && !p[i].power) continue; r -= faceWeight(p[i]); if (r < 0) return i; } return p.length - 1;
}
const tileFor = (s, f) => (f >= 0 && pools[s][f]) ? pools[s][f].tile : placeholders[s];
const faceItem = (s, f) => (f >= 0 && pools[s] && pools[s][f]) || null;
let faces = state.grid.map(col => col.map(() => -1));
function refaceIdle() { faces = state.grid.map((col, c) => col.map((s, r) => faces[c][r] >= 0 ? faces[c][r] : pickFace(s))); }
// Twins counted for the Holder Pot share: live helper reads only; a failed read is "unknown", never zero.
function twinCount() {
  const twinned = COLS.filter(c => c.twinned && c.helper); if (!twinned.length) return { n: null, stale: false };
  if (twinned.every(c => c.inscribedLive)) return { n: twinned.reduce((a, c) => a + c.inscribed, 0), stale: false };
  const known = window.G21_TWINS || {}; if (twinned.every(c => known[c.key] != null)) return { n: twinned.reduce((a, c) => a + known[c.key], 0), stale: true };
  return { n: null, stale: false };
}
