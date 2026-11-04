/* ---------- Frame loop (idle frames are capped near 30 fps; spins draw at ~60) ---------- */
let lastIdleFrame = 0, lastHl = -1, lastPoolSize = 0;
const perf = { frames: 0, rendered: 0, drawn: 0, avgMs: 0 };
function animate(now) {
  if (!pxEngineActive) { requestAnimationFrame(animate); return; }
  requestAnimationFrame(animate);
  const raw = now - (animate.last || now); animate.last = now; perf.frames++;
  if (spinning) spinPhysical.position.z = .18 - (1 + Math.sin(now / 170)) * .006; else if (spinPhysical.position.z !== .18) spinPhysical.position.z = .18;
  if (spinning && animations.every(a => now >= a.start + a.duration)) { drawScreen(now); finishSpin(); }
  const hl = highlightIndex(now); if (hl !== lastHl) { lastHl = hl; screenDirty = true; }
  const pulse = now - chainFlash < 1000 || now < countdownUntil || ((state.free || state.freeActive) && !spinning);
  // As art arrives, cells still showing a placeholder pick it up while the reels are at rest.
  const ps = SLOTS.reduce((a, s) => a + pools[s].length, 0); if (ps !== lastPoolSize && !spinning) { lastPoolSize = ps; refaceIdle(); screenDirty = true; }
  if (spinning ? now - lastDraw > 16 : (screenDirty || (pulse && now - lastDraw >= 33))) { drawScreen(now); lastDraw = now; perf.drawn++; }
  if (raw > 0 && raw < 1000) perf.avgMs = perf.avgMs ? perf.avgMs * .9 + raw * .1 : raw;
}

/* ---------- Holder Pot (version 1: meters and display only) ---------- */
function periodNow() { const d = new Date(), t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y = t.getUTCFullYear(), wk = Math.ceil(((t - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7); return { id: `${y}-W${String(wk).padStart(2, '0')}`, label: `WEEK ${wk}` }; }
function holderInit() {
  const cur = periodNow();
  if (!state.holder || typeof state.holder.pot !== 'number') state.holder = { pot: 0, period: cur.id, label: cur.label, last: null };
  if (state.holder.period !== cur.id) { const t = twinCount(); state.holder.last = { period: state.holder.period, label: state.holder.label, pot: state.holder.pot, perTwin: t.n ? state.holder.pot / t.n : null }; state.holder.pot = 0; state.holder.period = cur.id; state.holder.label = cur.label; }
}
// 1% of every PAID bet (never a free spin) goes into the pot. It is funded from the house edge: no player win is ever reduced.
function holderAdd(bet) { holderInit(); state.holder.pot = Math.round((state.holder.pot + bet * .01) * 1e4) / 1e4; }
// TODO(server): at each period's snapshot, read every twin from its Forever Twins helper contract (checked read: a failed read is
// "unknown", never "no twins"), divide the pot by the twin count and credit each holder. Not part of version 1.
function snapshotAndPayHolders() { /* TODO: needs a server or contract */ }
// TODO(server): cameo royalty, the holder of a twin shown on a winning line earns 1% of that line win. Version 1 only records it.
function recordCameos(r) {
  const out = []; for (const w of r.wins) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) { const s = state.grid[c][line[c]], it = faceItem(s, faces[c][line[c]]); if (it && it.twinned && it.tokenId != null) out.push({ tokenId: it.tokenId, collection: it.key, lineWin: w.amount }); } }
  if (state.history[0]) state.history[0].cameos = out; return out;
}

/* ---------- Boot ---------- */
function resume() {
  state = LAYR.openGame(GAME_ID, E); holderInit();
  if (state.pending) { lastResult = E.settle(state); setTimeout(() => toast('Your interrupted spin has been restored and settled.'), 900); }
  save(); update();
  if (feature()) { beginFeature(true); status('YOUR BONUS IS SAVED · CARRY ON'); }
  else if (state.free) { showFreeBar(false); status(`${state.free} SAVED LAUNCH SPINS · ALL WINS 2×`); }
  else if (state.freeActive) setTimeout(showFreeSummary, 800);
}
holderInit(); update(); liveLabel(); drawScreen(0);
/* Start the live art only after the page has loaded, so slow network art can never hold up the page's load event (the room waits for it). */
const startArt = () => { loadTwins().catch(() => { sources.done = true; liveLabel(); }); loadNfts().catch(() => {}); loadThisIs1().catch(() => {}); };
if (document.readyState === 'complete') setTimeout(startArt, 0); else addEventListener('load', () => setTimeout(startArt, 0));
requestAnimationFrame(() => { requestAnimationFrame(animate); window.__bfReady = true; if ($('loading')) $('loading').style.opacity = 0; setTimeout(() => $('loading') && $('loading').remove(), 550); });
// Test hooks: only with localStorage g21.test=1. arm('free'|'vault'|'chain'|'jackpot') forces the next paid spin's reel stops,
// using the engine's own rng argument (the maths is untouched). Used to reach every bonus without waiting for one.
let testRng = null;
const TEST_STOPS = window.G21_TEST_STOPS || {};
function seqRng(stops) { let i = 0; return n => { if (i < stops.length) return stops[i++] % n; return Math.floor(Math.random() * n); }; }
// Test hooks exist only when the host page says it is the test build (window.G21_TEST_BUILD), or when this page is opened on its own with g21.test=1.
// Inside the casino the host sets neither, so the hooks are off.
let testOn = false; try { testOn = window.parent !== window ? window.parent.G21_TEST_BUILD === true : localStorage.getItem('g21.test') === '1'; } catch (e) {}
window.Genesis21 = Object.freeze({ version: '1.0.0', machine: 'genesis-21',
  sources: () => ({ ...sources, core: SRC.core, collections: COLS.map(c => ({ key: c.key, slot: c.slot, twinned: c.twinned, inscribed: c.inscribed, loaded: c.loaded })) }),
  pools: () => Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.map(t => ({ key: t.key, tokenId: t.tokenId, xtrataId: t.xtrataId, twinned: !!t.twinned, art: !!t.img || !!t.data }))])),
  faces: () => faces.map(c => c.slice()), reels: () => animations.map(a => ({ landAt: a.start + a.land, endAt: a.start + a.duration })),
  soundLog: () => soundLog.map(e => ({ ...e })), clearSoundLog: () => { soundLog.length = 0; },
  holder: () => JSON.parse(JSON.stringify(state.holder)), perf: () => ({ avgFrameMs: +perf.avgMs.toFixed(1), frames: perf.frames, screenDraws: perf.drawn }),
  snapshot: () => JSON.parse(JSON.stringify({ state, spinning, autoLeft, view, sessionLock })), rules: { lines: E.lines, pays: E.pays, strips: E.stripCodes },
  test: Object.freeze({ enabled: testOn, slow: n => { if (testOn) TEST_SLOW = Math.max(1, Number(n) || 1); return TEST_SLOW; }, arm: kind => { if (!testOn || !TEST_STOPS[kind]) return false; testRng = seqRng(TEST_STOPS[kind]); return true; } }) });
