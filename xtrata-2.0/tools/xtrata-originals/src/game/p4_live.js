/* ---------- Live reads (Forever Twins pattern: registry read, checked reads, a six-hour cache, bundled art as the fallback) ---------- */
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', hiro: 'https://api.hiro.so',
  collection: 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX.xtrata-collection-audionauts-1-3c855746', wallets: { 'xtrata.btc': 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', 'jim.btc': 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7' } };
async function hiro(q) { try { return await getJSON(`${SRC.origin}/hiro/mainnet${q}`); } catch (e) { return await getJSON(`${SRC.hiro}${q}`, 1); } }
// Every Audionaut mint prints (event "collection-minted") (token-id uN) on the collection contract. Count them all.
async function readMints() {
  const found = new Map(); let off = 0;
  for (let page = 0; page < 10; page++) { const j = await hiro(`/extended/v1/contract/${SRC.collection}/events?limit=50&offset=${off}`), rows = (j && j.results) || [];
    for (const e of rows) { const r = (e.contract_log && e.contract_log.value && e.contract_log.value.repr) || ''; const t = /collection-minted/.test(r) && /\(token-id u(\d+)\)/.exec(r); if (t) found.set(Number(t[1]), true); }
    if (rows.length < 50) break; off += 50; }
  return [...found.keys()];
}
async function readLayers() {
  const out = []; for (const [name, addr] of Object.entries(SRC.wallets)) { const asset = encodeURIComponent(`${SRC.core}::xtrata-inscription`); const j = await hiro(`/extended/v1/tokens/nft/holdings?principal=${addr}&asset_identifiers=${asset}&limit=50&offset=0`);
    for (const r of (j && j.results) || []) { const m = /^u(\d+)$/.exec((r.value && r.value.repr) || ''); if (m) out.push({ id: Number(m[1]), wallet: name, block: r.block_height || null }); } }
  return out;
}
async function loadLive() {
  try { const reg = await getJSON(SRC.origin + SRC.registry); if (reg && reg.core && reg.core.contract) SRC.core = reg.core.contract; sources.registry = 'live'; } catch (e) { sources.registry = 'unreachable'; }
  // Cached for six hours so a reload doesn't re-read the chain. A failed read is "unknown", never "no Audionauts".
  let cache = null; try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  const fresh = cache && Date.now() - cache.time < 6 * 3600e3 && cache.core === SRC.core;
  let mints = null, layers = null;
  if (fresh) { mints = cache.mints; layers = cache.layers; sources.cached = true; }
  else { try { mints = await readMints(); } catch (e) { mints = null; } try { layers = await readLayers(); } catch (e) { layers = null; }
    if (mints && layers) try { localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), core: SRC.core, mints, layers })); } catch (e) {} }
  if (mints) { sources.minted = mints.length; sources.mintRead = fresh ? 'cached' : 'live'; } else { sources.minted = null; sources.mintRead = 'unknown'; }
  if (layers) { const have = new Set(pools.chain.map(l => l.id)); const add = layers.filter(l => !have.has(l.id)).sort(() => Math.random() - .5).slice(0, 24);
    add.forEach(l => { const it = Object.assign(l, { live: true, mime: null, bytes: null, img: null }); it.tile = layerTile(it); pools.chain.push(it); }); sources.liveLayers = add.length; sources.layers = 'live'; } else sources.layers = 'unknown';
  sources.done = true; refaceIdle(); liveLabel(); update();
}
