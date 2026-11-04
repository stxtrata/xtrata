/* ---------- Live twins: read the Forever Twins registry; the Bitcoin Monkeys helper (live, all 2,500 records sealed) turns twinned monkeys full colour ---------- */
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', core: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3', hiro: 'https://api.hiro.so', contract: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys',
  art: 'QmYCnfeseno5cLpC75rmy6LQhsNYQCJabiuwqNUXMaA3Fo', // every monkey is <id>.png in this one IPFS folder (checked against all 2,500 manifest records)
  serumContract: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys-labs', serumArt: { MM1: 'QmaELQUAgrcjvokrKmH6ns5QvbipfWGNEWPV57GbSS3N34', MM2: 'Qmd5b6m7N9FQatcLBipDXd1b2E2tBwTY7z9fWBirry4KSJ' }, serumRange: { MM1: [1, 3500], MM2: [3501, 5000] },
  mutantContract: window.MH_MUTANT_CONTRACT || 'SP125J1ADVYWGWB9NQRCVGKYAG73R17ZNMV17XEJ7.mutant-monkeys' }; // Mutant Monkeys (5,000 max). Hiro returns only a token_uri for it, so the picture is best-effort: if the metadata host will not serve a browser, the typed MUTANT tile stays.
const isMonkeys = c => String(c.key || '') === 'bitcoin-monkeys' || /bitcoin\s*monkeys/i.test(String(c.name || ''));
let helperCol = null;
// Pictures come from the browser's own network: a resizing CDN first, then public IPFS gateways. A picture that cannot load keeps its typed record tile.
const gw = (cid, path = '') => [`https://images.gamma.io/cdn-cgi/image/width=160,height=160,format=auto/https://stxnft.mypinata.cloud/ipfs/${cid}${path}`, `https://stxnft.mypinata.cloud/ipfs/${cid}${path}`, `https://ipfs.io/ipfs/${cid}${path}`, `https://cloudflare-ipfs.com/ipfs/${cid}${path}`];
async function loadAny(urls, ms = 12000) { for (const u of urls) { try { return await loadImage(u, ms); } catch (e) {} } throw Error('no gateway served it'); }
async function loadTwins() {
  let cols = null;
  try { const reg = await getJSON(SRC.origin + SRC.registry); if (reg && reg.core && reg.core.contract) SRC.core = reg.core.contract; cols = reg.collections || []; sources.registry = 'live'; }
  catch (e) { sources.registry = 'unreachable'; }
  if (!cols) { sources.helper = 'unknown'; sources.done = true; liveLabel(); topUp(); return; }
  const col = cols.find(c => isMonkeys(c) && c.helper && (!c.status || c.status === 'live'));
  if (!col) { sources.helper = 'none'; sources.twins = 0; sources.done = true; liveLabel(); topUp(); return; }
  helperCol = { key: col.key, name: col.name, helper: col.helper, inscribed: 0 };
  // Twin lists are cached for six hours so a reload doesn't re-read the helper. A failed read is "unknown", never "no twins".
  let cache = null; try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  const fresh = cache && Date.now() - cache.time < 6 * 3600e3 && cache.core === SRC.core && cache.helper === col.helper;
  let list = null;
  try { list = fresh ? cache.list : await sampleTwins(helperCol); helperCol.inscribed = fresh ? cache.count : (helperCol.inscribed || list.length); sources.twins = helperCol.inscribed; sources.helper = 'live'; sources.cached = !!fresh; }
  catch (e) { sources.twinsFailed = true; sources.helper = 'unknown'; sources.done = true; liveLabel(); topUp(); return; }
  try { if (!fresh) localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), core: SRC.core, helper: col.helper, list, count: helperCol.inscribed })); } catch (e) {}
  // Twinned monkeys turn full colour; twins we hold no bundled art for are loaded from Xtrata (up to 18 per visit).
  const extra = [];
  for (const t of list) { const it = monkeyItem(t.tokenId); if (it) { it.forever = true; it.xtrataId = t.xtrataId; } if (!it || !it.img) extra.push(t); }
  rebuildPools(); refaceIdle(); liveLabel();
  const queue = extra.sort(() => Math.random() - .5).slice(0, 18); let i = 0;
  const worker = async () => { while (i < queue.length) { const t = queue[i++]; try { const img = await loadImage(twinUrl(t.xtrataId)); if (addItem('monkey', t.tokenId, { img, forever: true, xtrataId: t.xtrataId })) sources.images++; } catch (e) { sources.imageFailures++; } } };
  await Promise.all(Array.from({ length: 4 }, worker));
  rebuildPools(); refaceIdle(); sources.done = true; liveLabel(); topUp();
}
// Top up the reels with the originals' real pictures (these are the NOT YET FOREVER monkeys) and the Serum batches.
let toppedUp = false;
async function topUp() {
  if (toppedUp) return; toppedUp = true;
  const need = items.filter(i => i.kind === 'monkey' && !i.img && !i.forever).sort(() => Math.random() - .5).slice(0, 30); let i = 0;
  const worker = async () => { while (i < need.length) { const it = need[i++]; try { it.img = await loadAny(gw(SRC.art, `/${it.id}.png`)); sources.images++; } catch (e) { sources.imageFailures++; } } };
  const serums = async () => { for (const t of ['MM1', 'MM2']) { const have = items.filter(x => x.kind === 'serum' && x.type === t); let img = (have.find(x => x.img) || {}).img || null; if (!img) { try { img = await loadAny(gw(SRC.serumArt[t])); sources.images++; } catch (e) { sources.imageFailures++; } } if (!img) continue; if (!have.length) { const [a, b] = SRC.serumRange[t]; for (let k = 0; k < 18; k++) addItem('serum', a + Math.floor(Math.random() * (b - a + 1)), { type: t, img, order: 5e5 + k }); } else have.forEach(x => { x.img = img; }); } };
  const mutants = async () => { if (!SRC.mutantContract || items.some(x => x.kind === 'mutant' && x.img)) return; const got = []; for (let id = 1; id <= 12 && got.length < 6; id++) { try { const j = await (await fetch(`${SRC.hiro}/metadata/v1/nft/${SRC.mutantContract}/${id}`)).json(); let m = j.metadata || null; if (!m && j.token_uri) m = await (await fetch(j.token_uri)).json(); let u = m && (m.image || m.image_url || ''); if (!u) continue; if (u.startsWith('ipfs://')) u = `https://ipfs.io/ipfs/${u.slice(7)}`; got.push(addItem('mutant', id, { img: await loadAny([u]), order: 6e5 + id })); sources.images++; } catch (e) { sources.imageFailures++; if (id >= 3 && !got.length) break; } } };
  await Promise.all([serums(), mutants(), ...Array.from({ length: 4 }, worker)]);
  rebuildPools(); refaceIdle(); liveLabel();
}
