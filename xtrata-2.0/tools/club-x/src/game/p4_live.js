
/* ---------- Live reads: Chemical X's works from the chain (Hiro metadata API, then the token's own image through an IPFS gateway)
   and the Forever Twins register for the Holder Pot. A failed read shows the last known value, never a guess. ---------- */
const SRC = { origin: 'https://xtrata.xyz', registry: '/forever-twins/data/registry.v2.json', hiro: 'https://api.hiro.so' };
const GATEWAYS = ['https://ipfs.io/ipfs/', 'https://cloudflare-ipfs.com/ipfs/', 'https://dweb.link/ipfs/'];
const ipfsPath = u => { const m = /^ipfs:\/\/(?:ipfs\/)?(.+)$/.exec(String(u || '')) || /\/ipfs\/(.+)$/.exec(String(u || '')); return m ? m[1] : null; };
const imageCandidates = u => { const p = ipfsPath(u); return p ? GATEWAYS.map(g => g + p) : (u ? [u] : []); };
function loadImage(url, ms = 9000) { return new Promise((res, rej) => { const im = new Image(); im.crossOrigin = 'anonymous'; const t = setTimeout(() => { im.src = ''; rej(Error('timeout')); }, ms); im.onload = () => { clearTimeout(t); res(im); }; im.onerror = () => { clearTimeout(t); rej(Error('image')); }; im.src = url; }); }
// Art loading. Bundled art (window.CLUBX_ART, written by tools/club-x/fetch_art.py) is used first, so the reels show real art offline.
async function readMeta(tok) {
  const path = `/metadata/v1/nft/${tok.work.contract}/${tok.id}`;
  for (const base of [`${SRC.origin}/hiro/mainnet`, SRC.hiro]) { try { const j = await getJSON(base + path, 1); if (j && j.metadata) return j; } catch (e) {} }
  return null;
}
async function loadToken(tok) {
  const bundle = window.CLUBX_ART && window.CLUBX_ART[tok.key];
  try {
    if (bundle) { tok.img = await loadImage(bundle.data); tok.meta = { name: bundle.name || '', image: bundle.source || '' }; tok.state = 'ok'; art.loaded++; return; }
    const j = await readMeta(tok); if (!j) throw Error('metadata'); tok.meta = j.metadata;
    const urls = [...imageCandidates(j.metadata.cached_image), ...imageCandidates(j.metadata.image)];
    let last = null; for (const u of urls) { try { tok.img = await loadImage(u); break; } catch (e) { last = e; } }
    if (!tok.img) throw last || Error('no image'); tok.state = 'ok'; art.loaded++;
  } catch (e) { tok.state = 'fail'; art.failed++; } finally { refreshArtTiles(); }
}
let artStarted = false;
async function loadArt() {
  if (artStarted) return; artStarted = true; const todo = art.tokens.filter(t => t.state === 'pending');
  const lanes = Array.from({ length: 3 }, async () => { while (todo.length) await loadToken(todo.shift()); }); await Promise.all(lanes);
}
function parseEvents(json) { const out = []; let count = 0; for (const e of (json && json.results) || []) { const repr = (e.contract_log && e.contract_log.value && e.contract_log.value.repr) || ''; const t = /\(token-id u(\d+)\)/.exec(repr), x = /\(xtrata-id u(\d+)\)/.exec(repr), n = /\(inscribed-count u(\d+)\)/.exec(repr); if (t && x) out.push({ tokenId: Number(t[1]), xtrataId: x[1] }); if (n) count = Math.max(count, Number(n[1])); } return { list: out, count, rows: ((json && json.results) || []).length }; }
async function eventsPage(helper, offset) { const q = `/extended/v1/contract/${helper}/events?limit=50&offset=${offset}`; try { return await getJSON(`${SRC.origin}/hiro/mainnet${q}`); } catch (e) { return await getJSON(`${SRC.hiro}${q}`, 1); } }
// Checked read of one helper contract: a count that cannot be read is "unknown" (null), never "no twins".
async function readHelper(col) {
  const list = []; let count = 0;
  for (let off = 0; off < 500; off += 50) { const p = parseEvents(await eventsPage(col.helper, off)); list.push(...p.list); count = Math.max(count, p.count); if (p.rows < 50) break; }
  return { list, count: count || new Set(list.map(t => t.tokenId)).size };
}
const mentions = (c, work) => JSON.stringify(c).toLowerCase().includes(String(work.contract || '\u0000').toLowerCase()) || String(c.key || '').toLowerCase() === work.key;
function liveLabel() {
  const n = art.tokens.filter(t => t.state !== 'none').length, ok = art.tokens.filter(t => t.state === 'ok').length;
  const artTxt = n ? `${ok}/${n} WORKS LOADED${art.failed ? ` · ${art.failed} NOT REACHED (NAME TILES)` : ''}` : 'NO ON-CHAIN WORKS LISTED';
  const potTxt = sources.test ? `TEST · ${sources.test.toUpperCase()} TWINS · ${poolText()}` : sources.registry === 'live' ? poolText() : sources.registry === 'unreachable' ? 'XTRATA UNREACHABLE · TWIN COUNT UNKNOWN' : 'READING THE FOREVER TWINS REGISTER…';
  $('liveSrc').textContent = `${artTxt} · HOLDER POT · ${potTxt}`; $('twinsSmall').textContent = `${pools.artifact.length} works on the reels · week ${periodKey()} · ${leftText()} left`; screenDirty = true; drawTopper();
}
async function loadPool() {
  let cols = null;
  try { const reg = await getJSON(SRC.origin + SRC.registry); cols = (reg.collections || []).filter(c => c.helper && (!c.status || c.status === 'live')); sources.registry = 'live'; }
  catch (e) { sources.registry = 'unreachable'; sources.done = true; liveLabel(); return; }
  if (sources.test) { sources.done = true; return; }   // a test twins state is active; keep it
  // Only collections that are one of Chemical X's works count. There is no This Is Number One helper in the register yet, so by default none match.
  const mine = []; for (const w of WORKS.works || []) for (const c of cols) if (w.contract && mentions(c, w) && !mine.some(m => m.col === c)) mine.push({ col: c, work: w });
  sources.noHelper = !mine.length; sources.collections = []; sources.forever = new Map(); sources.unknown = 0;
  if (!mine.length) { sources.twins = 0; sources.done = true; refreshArtTiles(); liveLabel(); return; }
  let total = 0, unknown = 0;
  for (const m of mine) { try { const r = await readHelper(m.col); total += r.count; r.list.forEach(t => sources.forever.set(`${m.work.key}:${t.tokenId}`, t.xtrataId)); sources.collections.push({ key: m.col.key, name: m.col.name, helper: m.col.helper, twins: r.count }); } catch (e) { unknown++; sources.collections.push({ key: m.col.key, name: m.col.name, helper: m.col.helper, twins: null }); } }
  sources.unknown = unknown; sources.twins = unknown && !total ? null : total; sources.done = true; refreshArtTiles(); liveLabel();
}
let liveTimer = 0;
function startLive() { clearInterval(liveTimer); loadArt(); liveTimer = setInterval(() => { if (!document.hidden && pxEngineActive) { ensureExtras(); drawTopper(); save(); } }, 60000); }

/* ---------- The topper marquee: the Holder Pot on split flaps, the week and its countdown, and last week's pay per twin.
   A canvas of its own (PX_CASINO_ENGINE.topper): the test page maps it onto the cabinet's marquee (the flapBoard part). ---------- */
const topper = canvas(1024, 320), tg = topper.getContext('2d'); let topperRev = 0, topperShown = '', topperFlipAt = 0;
function potLines() {
  const sh = potShare(), tw = potTwins();
  return { share: sh != null ? `≈ ${fmt(sh)} LAYR PER TWIN · ${fmt(tw)} TWINS` : sources.registry === 'pending' ? 'COUNTING TWINS…' : sources.noHelper ? 'NO FOREVER TWINS HELPER YET · THE POT BUILDS' : 'TWIN COUNT UNKNOWN',
    last: state.lastPot ? `LAST WEEK: ${state.lastPot.perTwin != null ? fmt(state.lastPot.perTwin) + ' LAYR PER TWIN' : fmt(state.lastPot.share) + ' LAYR (NO TWINS TO SHARE IT YET)'} · ${fmt(state.lastPot.cause)} TO THE CAUSE` : 'PAID PER TWIN EVERY MONDAY · 10% TO THE CAUSE' };
}
function drawTopper(now = performance.now()) {
  const jp = !!(pres && pres.bonus === 'jackpot'), s = jp ? '1' : fmt(Math.round(state.pot * 100) / 100);
  if (s !== topperShown) { topperShown = s; topperFlipAt = now; }
  const g = tg; g.fillStyle = '#0b0c0e'; g.fillRect(0, 0, 1024, 320); brushed(g, 0, 0, 1024, 320, '#16181b', 9); hazard(g, 0, 0, 1024, 14);
  g.fillStyle = '#000'; g.fillRect(24, 30, 976, 268); g.strokeStyle = '#3b4047'; g.lineWidth = 4; g.strokeRect(24, 30, 976, 268);
  spaced(g, jp ? 'NUMBER ONE · JACKPOT' : 'THIS IS NUMBER ONE · HOLDER POT', 512, 62, 28, 6, ACID, '800');
  const shown = jp ? 'NUMBER 1' : s, flipT = now - topperFlipAt;
  if (jp) { glowTextOn(g, 'NUMBER ONE', 512, 168, 120, ACID, ACID); } else flapCells(g, shown, 512, 160, 112, { w: .6, col: '#fff', scramble: true, flip: i => (flipT - i * 60) / 380 });
  const L = potLines(); text(g, `WEEK ${periodKey()} · ${leftText()} LEFT · LAYR`, 512, 238, 23, '#cfd5dc', COND, 'center', '700'); text(g, L.share, 512, 264, 18, PINK2, MONO, 'center', '700'); text(g, L.last, 512, 284, 13, SMOKE, MONO, 'center', '700');
  topperRev++;
}
function glowTextOn(g, s, x, y, size, color, glow) { g.save(); g.shadowColor = glow; g.shadowBlur = size * .35; text(g, s, x, y, size, color, COND, 'center', '800'); g.restore(); }
const topperBusy = now => !!(pres && pres.bonus === 'jackpot') || now - topperFlipAt < 1400;
