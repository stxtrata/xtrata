
/* ---------- Satoshi's Gift pool: read the Forever Twins registry and count the twins of every live collection ---------- */
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', hiro: 'https://api.hiro.so' };
function parseEvents(json) { const out = []; let count = 0; for (const e of (json && json.results) || []) { const repr = (e.contract_log && e.contract_log.value && e.contract_log.value.repr) || ''; const t = /\(token-id u(\d+)\)/.exec(repr), x = /\(xtrata-id u(\d+)\)/.exec(repr), n = /\(inscribed-count u(\d+)\)/.exec(repr); if (t && x) out.push({ tokenId: Number(t[1]), xtrataId: x[1] }); if (n) count = Math.max(count, Number(n[1])); } return { list: out, count, rows: ((json && json.results) || []).length }; }
async function eventsPage(helper, offset) { const q = `/extended/v1/contract/${helper}/events?limit=50&offset=${offset}`; try { return await getJSON(`${SRC.origin}/hiro/mainnet${q}`); } catch (e) { return await getJSON(`${SRC.hiro}${q}`, 1); } }
// Checked read: a collection whose count cannot be read is "unknown", never "no twins".
async function countTwins(col) { const p = parseEvents(await eventsPage(col.helper, 0)); if (p.count) return p.count; if (p.rows < 50) return new Set(p.list.map(t => t.tokenId)).size; return null; }
function liveLabel() {
  const n = sources.collections.length, txt = sources.test ? `TEST · ${sources.test.toUpperCase()} TWINS · ${poolText()}` : sources.registry === 'live' ? `SATOSHI'S GIFT · ${n} LIVE COLLECTIONS · ${poolText()}` : sources.registry === 'unreachable' ? "XTRATA UNREACHABLE · SATOSHI'S GIFT POOL UNKNOWN" : 'READING THE FOREVER TWINS REGISTER…';
  $('liveSrc').textContent = txt; $('twinsSmall').textContent = `${(REC.posts || []).length} posts · ${(REC.patoshi.heights || []).length} Patoshi blocks on the reels`; screenDirty = true;
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
// Satoshi's Gift draw: the snapshot block's hash, read as a number, picks one twin. Anyone can repeat it.
function giftIndex(hash, n) { if (!n) return null; let r = 0n; try { r = BigInt('0x' + String(hash).replace(/^0x/, '')) % BigInt(n); } catch (e) { return null; } return Number(r); }
