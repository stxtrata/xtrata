
/* ---------- Live twins: read the Forever Twins registry; the LEO Cats helper turns cats full colour ---------- */
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', hiro: 'https://api.hiro.so', contract: 'SP2N959SER36FZ5QT1CX9BR63W3E8X35WQCMBYYWC.leo-cats', key: 'leo-cats',
  // The helper listed in the registry on 2 Nov 2026; used only if the registry cannot be read. It is one of the three original Fak.fun helpers (interface v1), read through its event log and getters.
  helperFallback: 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-fakfun-xtrata' };
// Untwinned cats are shown from the collection's own art: Hiro's cached thumbnail first, then two IPFS gateways. A cat that cannot load simply stays out of the pools.
const IPFS_IMG = 'QmaXmJEnvZ43WYgcEW3KS9E9w3XJgcuH34wdKSXjCMz4ZD';
const catImageUrls = id => [`https://assets.hiro.so/api/mainnet/token-metadata-api/${SRC.contract}/${id}-thumb.png`, `https://stxnft.mypinata.cloud/ipfs/${IPFS_IMG}/images/${id}.png`, `https://ipfs.filebase.io/ipfs/${IPFS_IMG}/images/${id}.png`];
async function loadCat(id) { for (const u of catImageUrls(id)) { try { return await loadImage(u, 12000); } catch (e) {} } throw Error('no gateway served cat ' + id); }
let helperCol = null;
async function loadTwins() {
  let cols = null;
  try { const reg = await getJSON(SRC.origin + SRC.registry); if (reg && reg.core && reg.core.contract) SRC.core = reg.core.contract; cols = reg.collections || []; sources.registry = 'live'; }
  catch (e) { sources.registry = 'unreachable'; }
  let col = cols && cols.find(c => c.key === SRC.key && c.helper && (!c.status || c.status === 'live'));
  if (!cols) { col = { key: SRC.key, name: 'LEO Cats', helper: SRC.helperFallback }; sources.registry = 'fallback'; }
  if (!col) { sources.helper = 'none'; sources.twins = 0; sources.done = true; liveLabel(); loadUntwinned(); return; }
  helperCol = { key: col.key, name: col.name, helper: col.helper, inscribed: 0 };
  // Twin lists are cached for six hours so a reload doesn't re-read the helper. A failed read is "unknown", never "no twins".
  let cache = null; try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  const fresh = cache && Date.now() - cache.time < 6 * 3600e3 && cache.core === SRC.core && cache.helper === col.helper;
  let list = null;
  try { list = fresh ? cache.list : await sampleTwins(helperCol); helperCol.inscribed = fresh ? cache.count : (helperCol.inscribed || list.length); sources.twins = helperCol.inscribed; sources.helper = 'live'; sources.cached = !!fresh; sources.stale = false; }
  catch (e) { sources.twinsFailed = true; sources.helper = 'unknown'; sources.stale = true; sources.done = true; liveLabel(); loadUntwinned(); return; }
  try { if (!fresh) localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), core: SRC.core, helper: col.helper, list, count: helperCol.inscribed })); } catch (e) {}
  // Twinned cats turn full colour; twins we hold no bundled art for are loaded from Xtrata (up to 18 per visit).
  const extra = [];
  for (const t of list) { const it = byId.get(t.tokenId); if (it) { it.forever = true; it.xtrataId = t.xtrataId; } else extra.push(t); }
  rebuildPools(); refaceIdle(); liveLabel();
  const queue = extra.sort(() => Math.random() - .5).slice(0, 18); let i = 0;
  const worker = async () => { while (i < queue.length) { const t = queue[i++]; try { const img = await loadImage(twinUrl(t.xtrataId)); const tk = ART.tierString[t.tokenId - 1]; if (addItem(t.tokenId, tk, img, true, t.xtrataId)) sources.images++; } catch (e) { sources.imageFailures++; } } };
  await Promise.all(Array.from({ length: 4 }, worker));
  rebuildPools(); refaceIdle(); sources.done = true; liveLabel();
  loadUntwinned();
}
// Real cats that have no twin yet: a few per tier so the NOT YET FOREVER look is on the reels, and so Gold and Silver have more faces than the twins alone. They earn no holder rewards.
async function loadUntwinned(per = 6) {
  if (sources.untwinnedStarted || lab.on) return; sources.untwinnedStarted = true;
  const ts = ART.tierString || ''; if (!ts) return; const want = [];
  for (const s of SLOT_ORDER) { const k = TIER[s].k, ids = []; for (let i = 0; i < ts.length; i++) if (ts[i] === k && !byId.has(i + 1)) ids.push(i + 1); ids.sort(() => Math.random() - .5); ids.slice(0, per).forEach(id => want.push([id, k])); }
  want.sort(() => Math.random() - .5); let i = 0;
  const worker = async () => { while (i < want.length) { const [id, k] = want[i++]; try { const img = await loadCat(id); if (addItem(id, k, img, false, null)) sources.untwinned = (sources.untwinned || 0) + 1; rebuildPools(); refaceIdle(); liveLabel(); } catch (e) { sources.imageFailures++; } } };
  await Promise.all(Array.from({ length: 3 }, worker));
}
