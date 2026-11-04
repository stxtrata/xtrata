
/* ---------- Live reads: the Bitcoin tip and latest blocks (mempool.space, with Hiro via xtrata.xyz as a fallback for the
   tip), and the Forever Twins register for the Epoch Pot. A failed read leaves the last known value, marked STALE. ---------- */
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', hiro: 'https://api.hiro.so', mempool: 'https://mempool.space' };
function parseEvents(json) { const out = []; let count = 0; for (const e of (json && json.results) || []) { const repr = (e.contract_log && e.contract_log.value && e.contract_log.value.repr) || ''; const t = /\(token-id u(\d+)\)/.exec(repr), x = /\(xtrata-id u(\d+)\)/.exec(repr), n = /\(inscribed-count u(\d+)\)/.exec(repr); if (t && x) out.push({ tokenId: Number(t[1]), xtrataId: x[1] }); if (n) count = Math.max(count, Number(n[1])); } return { list: out, count, rows: ((json && json.results) || []).length }; }
async function eventsPage(helper, offset) { const q = `/extended/v1/contract/${helper}/events?limit=50&offset=${offset}`; try { return await getJSON(`${SRC.origin}/hiro/mainnet${q}`); } catch (e) { return await getJSON(`${SRC.hiro}${q}`, 1); } }
// Checked read: a collection whose count cannot be read is "unknown", never "no twins".
async function countTwins(col) { const p = parseEvents(await eventsPage(col.helper, 0)); if (p.count) return p.count; if (p.rows < 50) return new Set(p.list.map(t => t.tokenId)).size; return null; }
function liveLabel() {
  const left = blocksLeft(), n = sources.collections.length;
  const tipTxt = Number.isFinite(tipNow()) ? `${staleTag()} · TIP #${fmt(tipNow())} · ${fmt(left)} BLOCKS TO THE HALVING` : 'CHAIN UNREACHABLE · TIP UNKNOWN';
  const potTxt = sources.test ? `TEST · ${sources.test.toUpperCase()} TWINS · ${poolText()}` : sources.registry === 'live' ? `EPOCH POT · ${n} LIVE COLLECTIONS · ${poolText()}` : sources.registry === 'unreachable' ? 'XTRATA UNREACHABLE · TWIN COUNT UNKNOWN' : 'READING THE FOREVER TWINS REGISTER…';
  $('liveSrc').textContent = `${tipTxt} · ${potTxt}`; $('twinsSmall').textContent = `${(REC.messages || []).length} coinbase messages · ${pools.chain.length} mined blocks on the reels`; screenDirty = true; drawTopper();
}
async function loadPool() {
  let cols = null;
  try { const reg = await getJSON(SRC.origin + SRC.registry); cols = (reg.collections || []).filter(c => c.helper && (!c.status || c.status === 'live')); sources.registry = 'live'; }
  catch (e) { sources.registry = 'unreachable'; sources.done = true; liveLabel(); return; }
  let cache = null; try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  const fresh = cache && Date.now() - cache.time < 6 * 3600e3 && cache.helpers === cols.map(c => c.helper).join(',');
  const counts = fresh ? cache.counts : await Promise.all(cols.map(c => countTwins(c).catch(() => null)));
  if (!fresh) try { localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), helpers: cols.map(c => c.helper).join(','), counts })); } catch (e) {}
  if (sources.test) { sources.done = true; return; } // a test twins state is active; keep it
  sources.collections = cols.map((c, i) => ({ key: c.key, name: c.name, helper: c.helper, twins: counts[i] }));
  const known = counts.filter(Number.isFinite); sources.unknown = counts.length - known.length;
  sources.twins = known.length ? known.reduce((a, b) => a + b, 0) : null; sources.done = true; liveLabel();
}
// The tip height: mempool.space first, then the Hiro API (Bitcoin burn blocks) through xtrata.xyz, then Hiro direct.
async function readTip() {
  const tries = [async () => Number(await getText(`${SRC.mempool}/api/blocks/tip/height`)),
    async () => (await getJSON(`${SRC.origin}/hiro/mainnet/extended/v2/burn-blocks?limit=1`, 1)).results[0].burn_block_height,
    async () => (await getJSON(`${SRC.hiro}/extended/v2/burn-blocks?limit=1`, 1)).results[0].burn_block_height];
  for (const t of tries) { try { const h = await t(); if (Number.isInteger(h) && h > 800000) return h; } catch (e) {} }
  return null;
}
async function readRecent() { try { const a = await getJSON(`${SRC.mempool}/api/v1/blocks`, 1); return a.map(b => ({ height: b.height, hash: b.id, time: b.timestamp, pool: (b.extras && b.extras.pool && b.extras.pool.name) || 'Unknown', txs: b.tx_count })).filter(b => Number.isInteger(b.height)); } catch (e) { return null; } }
let liveTimer = 0, liveBusy = false;
async function readChain() {
  if (liveBusy) return; liveBusy = true;
  try {
    const [tip, recent] = await Promise.all([readTip(), readRecent()]);
    const before = tipNow();
    if (Number.isFinite(tip)) { chain.tip = tip; chain.stale = false; chain.status = 'live'; chain.readAt = Date.now(); } else { chain.stale = true; if (chain.status === 'live') chain.status = 'stale'; }
    if (recent && recent.length) { const seen = new Set(recent.map(b => b.height)); chain.recent = recent.concat(chain.recent.filter(b => !seen.has(b.height))).sort((a, b) => b.height - a.height).slice(0, 30); chain.recentLive = true; }
    try { localStorage.setItem(LIVE_KEY, JSON.stringify({ tip: chain.tip, readAt: chain.readAt, recent: chain.recent })); } catch (e) {}
    if (tipNow() !== before && Number.isFinite(before)) flapKick = performance.now();
    refreshLiveTiles(); ensureExtras(); liveLabel(); if (pxEngineActive) save();
  } finally { liveBusy = false; }
}
function startLive() { clearInterval(liveTimer); readChain(); liveTimer = setInterval(() => { if (!document.hidden && pxEngineActive) readChain(); }, 60000); }

/* ---------- The topper: a split-flap board counting the real blocks left to the next halving, and the Epoch Pot.
   A canvas of its own (PX_CASINO_ENGINE.topper): the test page maps it onto the cabinet's flap board. ---------- */
const topper = canvas(1024, 320), tg = topper.getContext('2d'); let topperRev = 0, topperShown = '', topperFlipAt = 0;
function drawTopper(now = performance.now()) {
  const left = blocksLeft(), jp = !!(pres && pres.bonus === 'jackpot'), hd = halvingDay, s = hd ? String(hd.n).padStart(6, '0') : Number.isFinite(left) ? String(left).padStart(6, '0') : '------';
  if (s !== topperShown) { topperShown = s; topperFlipAt = now; }
  const g = tg; g.fillStyle = '#0b0c0e'; g.fillRect(0, 0, 1024, 320); brushed(g, 0, 0, 1024, 320, '#16181b', 9);
  g.fillStyle = '#000'; g.fillRect(24, 22, 976, 276); g.strokeStyle = '#3b4047'; g.lineWidth = 4; g.strokeRect(24, 22, 976, 276);
  spaced(g, jp ? '21 MILLION · JACKPOT' : 'BLOCKS TO THE NEXT HALVING', 512, 56, 30, 6, jp ? AMBER2 : AMBER, '800');
  const digits = jp ? '21000000'.split('') : s.split(''), shown = jp ? '21,000,000' : `${digits.slice(0, 3).join('')},${digits.slice(3).join('')}`, flipT = now - Math.max(topperFlipAt, flapKick);
  flapCells(g, shown, 512, 162, 150, { w: jp ? .5 : .62, col: jp ? AMBER2 : '#fff6d0', scramble: true, flip: i => jp ? ((now / 380 + i * .37) % 1.6) / 1.2 : (flipT - i * 70) / 420 });
  const ep = epochLeft(); text(g, Number.isFinite(ep) ? `EPOCH POT ${fmt(state.pot)} LAYR · ${fmt(ep)} BLOCKS LEFT IN THE EPOCH · ${staleTag()}` : 'EPOCH POT · TIP UNKNOWN', 512, 270, 26, chain.stale ? '#ff9a8e' : '#cfd5dc', COND, 'center', '700');
  topperRev++;
}
const topperBusy = now => !!(pres && pres.bonus === 'jackpot') || now - Math.max(topperFlipAt, flapKick) < 1400 || !!halvingDay;
