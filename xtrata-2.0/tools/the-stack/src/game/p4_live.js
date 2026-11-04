
/* ---------- Live reads from the Hiro API (through xtrata.xyz's proxy first, then direct): the Bitcoin tip, the latest Stacks
   blocks and the PoX state; and the Forever Twins register for the Floor Pot. A failed read leaves the last known value,
   marked STALE. Every real new Stacks block that arrives while the player is at the machine plays a soft chime. ---------- */
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', hiro: 'https://api.hiro.so', mempool: 'https://mempool.space' };
const hiro = async (q, tries = 1) => { try { return await getJSON(`${SRC.origin}/hiro/mainnet${q}`, tries); } catch (e) { return await getJSON(`${SRC.hiro}${q}`, tries); } };
function parseEvents(json) { const out = []; let count = 0; for (const e of (json && json.results) || []) { const repr = (e.contract_log && e.contract_log.value && e.contract_log.value.repr) || ''; const t = /\(token-id u(\d+)\)/.exec(repr), x = /\(xtrata-id u(\d+)\)/.exec(repr), n = /\(inscribed-count u(\d+)\)/.exec(repr); if (t && x) out.push({ tokenId: Number(t[1]), xtrataId: x[1] }); if (n) count = Math.max(count, Number(n[1])); } return { list: out, count, rows: ((json && json.results) || []).length }; }
async function eventsPage(helper, offset) { return hiro(`/extended/v1/contract/${helper}/events?limit=50&offset=${offset}`); }
// Checked read: a collection whose count cannot be read is "unknown", never "no twins".
async function countTwins(col) { const p = parseEvents(await eventsPage(col.helper, 0)); if (p.count) return p.count; if (p.rows < 50) return new Set(p.list.map(t => t.tokenId)).size; return null; }
function liveLabel() {
  const n = sources.collections.length, c = cycleNow();
  const tipTxt = Number.isFinite(burnNow()) ? `${staleTag()} · BITCOIN #${fmt(burnNow())} · STACKS #${Number.isFinite(stacksNow()) ? fmt(stacksNow()) : '—'} · CYCLE ${c} ENDS IN ${endsIn()}` : 'CHAIN UNREACHABLE · TIP UNKNOWN';
  const potTxt = sources.test ? `TEST · ${sources.test.toUpperCase()} TWINS · ${poolText()}` : sources.registry === 'live' ? `FLOOR POT · ${n} LIVE COLLECTIONS · ${poolText()}` : sources.registry === 'unreachable' ? 'XTRATA UNREACHABLE · TWIN COUNT UNKNOWN' : 'READING THE FOREVER TWINS REGISTER…';
  $('liveSrc').textContent = `${tipTxt} · ${potTxt}`; $('twinsSmall').textContent = `${pools.chain.length} fast blocks on the reels · ${(REC.cycles || []).length} cycles in the reward slots`; screenDirty = true; drawTopper(); drawSideTicker();
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
// The Bitcoin tip: Hiro's burn blocks (which also list the Stacks blocks each one anchored), then mempool.space.
async function readBurn() {
  try { const j = await hiro('/extended/v2/burn-blocks?limit=6'); const rs = (j.results || []).filter(b => Number.isInteger(b.burn_block_height)); if (rs.length) return { tip: rs[0].burn_block_height, list: rs.map(b => ({ height: b.burn_block_height, hash: b.burn_block_hash, time: b.burn_block_time_iso, txs: b.total_tx_count, stacks: (b.stacks_blocks || []).length })) }; } catch (e) {}
  try { const h = Number(await getText(`${SRC.mempool}/api/blocks/tip/height`)); if (Number.isInteger(h) && h > 800000) return { tip: h, list: null }; } catch (e) {}
  return null;
}
async function readStacks() { try { const j = await hiro('/extended/v1/block?limit=20'); return (j.results || []).map(b => ({ height: b.height, hash: b.hash, burn: b.burn_block_height, time: b.burn_block_time_iso, txs: (b.txs || []).length })).filter(b => Number.isInteger(b.height)); } catch (e) { return null; } }
async function readPox() { try { const j = await hiro('/v2/pox'); if (j && j.current_cycle) return { cycle: j.current_cycle.id, stackedUstx: j.current_cycle.stacked_ustx, burn: j.current_burnchain_block_height, nextRewardStart: j.next_cycle && j.next_cycle.reward_phase_start_block_height, readAt: Date.now() }; } catch (e) {} return null; }
let liveTimer = 0, liveBusy = false, poxAt = 0;
async function readChain() {
  if (liveBusy) return; liveBusy = true;
  try {
    const wantPox = Date.now() - poxAt > 300e3;
    const [burn, recent, pox] = await Promise.all([readBurn(), readStacks(), wantPox ? readPox() : Promise.resolve(null)]);
    const before = chain.recent.length ? chain.recent[0].height : null;
    if (pox) { chain.pox = pox; poxAt = Date.now(); }
    if (burn) { chain.burn = burn.tip; chain.stale = false; chain.status = 'live'; chain.readAt = Date.now(); if (burn.list) chain.burnRecent = burn.list; } else { chain.stale = true; if (chain.status === 'live') chain.status = 'stale'; }
    if (recent && recent.length) {
      const seen = new Set(recent.map(b => b.height)); chain.recent = recent.concat(chain.recent.filter(b => !seen.has(b.height))).sort((a, b) => b.height - a.height).slice(0, 30); chain.recentLive = true; chain.stacks = chain.recent[0].height;
      const fresh = Number.isFinite(before) ? chain.recent.filter(b => b.height > before).length : 0;
      if (fresh && pxEngineActive && !chain.test) { chain.newAt = performance.now(); chain.newCount = fresh; tickKick = chain.newAt; for (let k = 0; k < Math.min(4, fresh); k++) sound('block', k, k * .32); }
    }
    try { localStorage.setItem(LIVE_KEY, JSON.stringify({ burn: chain.burn, stacks: chain.stacks, readAt: chain.readAt, recent: chain.recent, burnRecent: chain.burnRecent })); } catch (e) {}
    refreshLiveTiles(); ensureExtras(); liveLabel(); if (pxEngineActive) save();
  } finally { liveBusy = false; }
}
function startLive() { clearInterval(liveTimer); readChain(); liveTimer = setInterval(() => { if (!document.hidden && pxEngineActive) readChain(); }, 20000); }

/* ---------- The topper display: CYCLE <n> · ENDS IN 3d 4h · <pot> LAYR, and last cycle's pay per twin. A canvas of its own
   (PX_CASINO_ENGINE.topper): the test page maps it onto the cabinet part named potBoard. ---------- */
const topper = canvas(1024, 256), tg = topper.getContext('2d'); let topperRev = 0;
function drawTopper(now = performance.now()) {
  const g = tg, jp = !!(pres && pres.bonus === 'jackpot'), c = cycleNow(), p = cycleDone();
  g.fillStyle = '#040406'; g.fillRect(0, 0, 1024, 256); round(g, 8, 8, 1008, 240, 14, null, jp ? BTC : PURPLE, 5);
  if (jp) { const k = .5 + .5 * Math.sin(now / 160); g.fillStyle = `rgba(247,147,26,${.08 + .1 * k})`; g.fillRect(12, 12, 1000, 232); spaced(g, 'BITCOIN FINALITY', 512, 82, 54, 8, '#ffcf8f', '800'); text(g, 'JACKPOT', 512, 170, 92, '#fff', SANS, 'center', '800'); topperRev++; return; }
  text(g, `CYCLE ${Number.isFinite(c) ? c : '—'}  ·  ENDS IN ${endsIn()}  ·  ${fmt(state.pot)} LAYR`, 512, 70, 50, '#fff', SANS, 'center', '800');
  // the cycle's 2,100 Bitcoin blocks as a bar of 21 slabs, lit up to the tip
  for (let k = 0; k < 21; k++) { const on = Number.isFinite(p) && k / 21 < p, x = 70 + k * 42.5; round(g, x, 120, 36, 26, 6, on ? (k < 14 ? PURPLE : ORANGE) : '#16162a', on ? null : '#2a2a3d', 1.5); }
  const sh = potShare();
  text(g, state.lastPot && state.lastPot.perTwin != null ? `LAST CYCLE: ${fmt(state.lastPot.perTwin)} LAYR PER TWIN` : sh != null ? `THE FLOOR POT · ≈ ${fmt(sh)} LAYR PER TWIN SO FAR` : 'THE FLOOR POT · SHARED BY EVERY FOREVER TWIN', 512, 196, 30, ORANGE2, SANS, 'center', '800');
  text(g, `${staleTag()} · BITCOIN #${Number.isFinite(burnNow()) ? fmt(burnNow()) : '—'}`, 512, 230, 18, chain.stale ? '#ff9aa6' : MUTED, MONO, 'center', '700');
  topperRev++;
}
const topperBusy = now => !!(pres && pres.bonus === 'jackpot') || !!turnover;
/* ---------- The side-panel tickers: the latest Bitcoin and Stacks heights, pulsing softly on each new block
   (PX_CASINO_ENGINE.ticker; the test page maps it onto both tickerPanel parts) ---------- */
const ticker = canvas(512, 1024), kg = ticker.getContext('2d'); let tickerRev = 0;
function drawSideTicker(now = performance.now()) {
  const g = kg, pulse = Math.max(0, 1 - (now - tickKick) / 1600), list = chain.recent.length ? chain.recent : REC.blocks || [], b0 = list[0];
  g.fillStyle = '#07070b'; g.fillRect(0, 0, 512, 1024); round(g, 10, 10, 492, 1004, 18, null, PURPLE, 5);
  text(g, 'LATEST BLOCKS', 256, 66, 36, TXT, SANS, 'center', '800'); text(g, staleTag(), 256, 104, 22, chain.stale ? RED : GREEN2, MONO, 'center', '700');
  round(g, 36, 136, 440, 220, 18, '#100a04', BTC, 4); text(g, 'BITCOIN', 256, 182, 34, BTC, SANS, 'center', '800'); fitText(g, Number.isFinite(burnNow()) ? fmt(burnNow()) : '—', 256, 262, 86, 400, '#fff', COND, 'center', '800'); text(g, 'ANCHORS EVERY STACKS BLOCK', 256, 324, 18, MUTED, MONO, 'center', '700');
  g.save(); if (pulse > 0) { g.shadowColor = PURPLE2; g.shadowBlur = 40 * pulse; } round(g, 36, 384, 440, 220, 18, '#0c0a24', PURPLE2, 4 + 4 * pulse); g.restore();
  text(g, 'STACKS', 256, 430, 34, PURPLE2, SANS, 'center', '800'); fitText(g, b0 ? fmt(b0.height) : '—', 256, 510, 86, 400, '#fff', COND, 'center', '800'); text(g, pulse > .05 ? `+${chain.newCount || 1} NEW BLOCK${(chain.newCount || 1) > 1 ? 'S' : ''}` : 'FAST BLOCKS · SECONDS APART', 256, 572, 18, pulse > .05 ? GREEN2 : MUTED, MONO, 'center', '700');
  // the last few Stacks blocks as stacked slabs on their Bitcoin block
  const rows = list.slice(0, 6); rows.forEach((b, i) => { const y = 650 + i * 52; round(g, 60, y, 392, 42, 10, i ? '#12122a' : '#1d1850', i ? '#2a2a3d' : PURPLE2, 2); text(g, `#${fmt(b.height)}`, 80, y + 21, 22, i ? TXT : '#fff', COND, 'left', '800'); text(g, `₿ ${fmt(b.burn)}`, 432, y + 21, 18, '#ffcf8f', MONO, 'right', '700'); });
  text(g, 'READ FROM THE HIRO API', 256, 990, 18, DIM, MONO, 'center', '700');
  tickerRev++;
}
