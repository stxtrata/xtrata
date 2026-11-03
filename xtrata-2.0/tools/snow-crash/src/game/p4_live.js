
/* ---------- Live twins: read the Forever Twins registry; a Crash Punks helper turns punks full colour ---------- */
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', hiro: 'https://api.hiro.so', contract: 'SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ.crashpunks-v2' };
const isCrashPunks = c => /crash[-_ ]?punks?/i.test(String(c.key || '')) || /crash\s*punks?/i.test(String(c.name || ''));
let helperCol = null;
async function loadTwins() {
  let cols = null;
  try { const reg = await getJSON(SRC.origin + SRC.registry); if (reg && reg.core && reg.core.contract) SRC.core = reg.core.contract; cols = reg.collections || []; sources.registry = 'live'; }
  catch (e) { sources.registry = 'unreachable'; }
  if (!cols) { sources.helper = 'unknown'; sources.done = true; liveLabel(); return; }
  const col = cols.find(c => isCrashPunks(c) && c.helper && (!c.status || c.status === 'live'));
  if (!col) { sources.helper = 'none'; sources.twins = 0; sources.done = true; liveLabel(); return; }
  helperCol = { key: col.key, name: col.name, helper: col.helper, inscribed: 0 };
  // Twin lists are cached for six hours so a reload doesn't re-read the helper. A failed read is "unknown", never "no twins".
  let cache = null; try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  const fresh = cache && Date.now() - cache.time < 6 * 3600e3 && cache.core === SRC.core && cache.helper === col.helper;
  let list = null;
  try { list = fresh ? cache.list : await sampleTwins(helperCol); helperCol.inscribed = fresh ? cache.count : (helperCol.inscribed || list.length); sources.twins = helperCol.inscribed; sources.helper = 'live'; sources.cached = !!fresh; }
  catch (e) { sources.twinsFailed = true; sources.helper = 'unknown'; sources.done = true; liveLabel(); return; }
  try { if (!fresh) localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), core: SRC.core, helper: col.helper, list, count: helperCol.inscribed })); } catch (e) {}
  // Twinned punks turn full colour; twins we hold no bundled art for are loaded from Xtrata (up to 18 per visit).
  const extra = [];
  for (const t of list) { const it = byId.get(t.tokenId); if (it) { it.forever = true; it.xtrataId = t.xtrataId; } else extra.push(t); }
  rebuildPools(); refaceIdle(); liveLabel();
  const queue = extra.sort(() => Math.random() - .5).slice(0, 18); let i = 0;
  const worker = async () => { while (i < queue.length) { const t = queue[i++]; try { const img = await loadImage(twinUrl(t.xtrataId)); const tk = ART.tierString[t.tokenId - 1]; if (addItem(t.tokenId, tk, img, true, t.xtrataId)) sources.images++; } catch (e) { sources.imageFailures++; } } };
  await Promise.all(Array.from({ length: 4 }, worker));
  rebuildPools(); refaceIdle(); sources.done = true; liveLabel();
}
