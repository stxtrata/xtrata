
/* ---------- Spinning ---------- */
function anticipation(g) { const first = g.slice(0, 3).flat(), n = s => first.filter(x => x === s).length; return n('scatter') >= 2 || n('vault') >= 2 || n('chain') >= 4; }
function spinInputBusy(){return spinning;}
function spinClick() { markPress('spin'); if(spinInputBusy())return;audioInit(); if ($('modal').open || locked()) return; if (scene) { primaryAction(); return; } if (feature()) { flow(); return; } if (freeMode && state.free > 0) { clearTimeout(freeTimer); spin(); return; } if (!labRun && !state.free && state.balance < state.bet) { openAccount(); return; } spin(); }
function scheduleStop(a, c) { if (a.nodes) a.nodes.forEach(o => { try { o.stop(); } catch (e) {} }); a.nodes = sound('stop', c, Math.max(0, (a.start + a.land - performance.now()) / 1000 - audioLatency())) || null; }
let nextFaces = null;
function spin() {
  if (spinning || scene || $('modal').open || locked()) return;
  if (feature()) { flow(); return; }
  const prev = state.grid.map((c, ci) => c.map((s, r) => [s, faces[ci][r]])); let p;
  const rng = labStartRng();
  // The engine fixes the whole round here: reels, bonus prizes and hold-and-respin frames. Nothing after this can change it.
  try { p = rng ? G.start(state, rng) : G.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message) && !labRun) openAccount(); return; }
  if (!p.free) addHolder(p.bet);
  spinning = true; lastResult = null; save(); sound('spin'); leverStart = performance.now(); hideBar();
  status(p.free ? 'AIRDROP SPIN · ALL WINS 2×' : 'MARCHING…');
  // The result is already fixed; now choose the cosmetic faces (which Runestone, transfer or milestone a tile shows) with Math.random.
  nextFaces = p.grid.map(col => col.map(pickFace));
  const now = performance.now(), q = quick(), antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (q ? 350 : 900) : 0; const land = (q ? 380 + c * 90 : 1350 + c * 260) + extra, bounce = q ? 110 : 210; const travel = Math.max(6, Math.round(land * (q ? .034 : .0098))), n = travel - 3; const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] - n + i + L * 8) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] + 3) % L]; const sequence = [...prev[c], ...fill, ...p.grid[c].map((s, r) => [s, nextFaces[c][r]]), [after, pickFace(after)]]; return { sequence, travel, start: now + c * (q ? 18 : 65), land, bounce, duration: land + bounce, kick: q ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, q ? 450 : 1900);
  update();
}
// A Runestone on a winning line: its inscription number goes in the win message, and a cameo record is kept for the future royalty.
function runestoneCameo(r) {
  for (const w of r.wins) { if (w.symbol !== 'artifact') continue; const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) { const row = line[c]; if (state.grid[c][row] !== 'artifact') continue; const fi = faces[c][row]; if (fi >= 0 && RS[fi]) return { rs: RS[fi], lineWin: w.amount, line: w.line }; } }
  return null;
}
const runeName = rs => rs.number != null ? '#' + rs.number : String(rs.id).slice(0, 10) + '…';
function finishSpin() {
  spinning = false; lastResult = G.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null;
  const r = lastResult, bet = r.round.bet, h = state.history[0];
  if (h && labRun) h.lab = true;
  if (labRun && !labRun.gamble) state.gamble = 0;   // a Lab item that isn't about the gamble never waits on one
  // Holder layer: a Runestone on a winning line earns its holder a cameo record. The "tokenId" field name stays for the future royalty code.
  const cam = runestoneCameo(r);
  if (h && cam && isHeld(cam.rs)) h.cameo = { tokenId: cam.rs.id, collection: 'runestone', number: cam.rs.number, lineWin: cam.lineWin };
  if (labRun) labLog(h); save(); update();
  const now = performance.now(); winPower = r.total >= bet * 10 ? 1 : .6;
  if (r.total >= bet * 10 && !(r.triggers && (r.triggers.free || r.triggers.vault || r.triggers.chain)) && !r.jackpotWin) burstAt = now;   // the bonus scenes celebrate on their own; the stamp would cover their title
  if (r.total) { winStart = now; sound(r.total >= bet * 10 ? 'big' : 'win'); winUntil = now + 4000; excite = Math.max(excite, r.total >= bet * 10 ? 1 : .5); if (r.total >= bet * 5) burst(700, 480, r.total >= bet * 25 ? 60 : 26, 'dog', 1.2); }
  if (r.round.free) spawnDrops(r.total ? Math.min(4, 1 + Math.floor(r.total / bet)) : 1, now);
  const runeNote = cam ? ` · RUNESTONE ${runeName(cam.rs)} ON THE LINE` : '';
  let msg = r.total ? `${r.jackpotWin ? 'TO THE MOON · ' : ''}${fmt(r.total)} LAYR WON${r.wins.length ? ` · ${r.wins.length} LINE${r.wins.length === 1 ? '' : 'S'}` : ''}${r.scatterPay ? ' · SNAPSHOT PAY' : ''}${runeNote}` : (r.round.free ? 'AIRDROP SPIN COMPLETE' : 'NO WIN · MARCH AGAIN');
  if (state.gamble) msg += ' · MOON OR DOOM?';
  status(msg);
  if (r.jackpotWin) sceneQueue.push({ kind: 'jackpot', amount: r.jackpotWin, source: 'line' });
  if (r.triggers.free) { if (!r.round.free) sceneQueue.push({ kind: 'free', award: r.freeAward, scatters: r.scatters, pay: r.scatterPay }); else if (r.freeAward) sceneQueue.push({ kind: 'retrigger', award: r.freeAward, scatters: r.scatters }); else toast('Airdrop cap reached: 24 spins awarded this feature.'); }
  if (sceneQueue.length || feature()) stopAuto();
  if (labRun && labRun.gamble && state.gamble && !sceneQueue.length && !feature()) { setTimeout(() => openGamble(), quick() ? 300 : 900); return; }
  flow();
}
// One dispatcher decides what plays next: the jackpot celebration, a bonus, the next Airdrop spin, or back to the reels.
function flow() {
  if (scene || spinning) return;
  if (sceneQueue[0] && sceneQueue[0].kind === 'jackpot') { startScene('jackpot', sceneQueue.shift()); return; }
  const f = feature(); if (f) { startScene(f.type, {}); return; }
  if (sceneQueue.length) { const q = sceneQueue.shift(); startScene(q.kind, q); return; }
  if (freeMode || state.free > 0 || state.freeActive) {
    if (state.free > 0) { if (!freeMode) { startScene('free', { resumed: true }); return; } clearTimeout(freeTimer); freeTimer = setTimeout(() => { if (!scene && !spinning && freeMode && !$('modal').open) spin(); }, quick() ? 320 : 950); return; }
    if (state.freeActive) { const r = G.endFree(state); save(); startScene('free', { outroOnly: true, summary: r }); return; }
    freeMode = false; music(false);
  }
  update(); renderBar();
  if (labRun && !state.gamble) { labStep(); return; }
  scheduleAuto();
}
function changeBet(dir, max = false) { markPress(dir > 0 ? 'betUp' : 'betDown'); if (busy() || locked() || labRun) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !$('modal').open && !document.hidden) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || scene || $('modal').open || feature() || labRun) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('AUTO-MARCH stopped: not enough LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() { markPress('auto'); if (autoLeft) { stopAuto(); status('AUTO-MARCH STOPPED'); return; } if (busy() || locked() || labRun) { toast('Finish this spin or bonus first.'); return; } showModal('auto', 'AUTO-MARCH.', `<p>Autoplay marches at your current bet. It stops when any bonus triggers, your LAYR run low, you open a panel or you leave the tab.</p><div class="stat-cards"><div><span>BET PER SPIN</span><strong>${fmt(state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO-MARCH again at any time to stop.</p>`, 'AUTO-MARCH'); document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); }); }

/* ---------- Bonus scenes: trigger → intro → play → outro, every one in the machine's theme ---------- */
const SCENE = {
  free: { tag: 'FEATURE 01 · FREE SPINS', title: 'The Airdrop', sym: 'scatter', color: '#b9c47a', rule: 'Crates drop for 8 spins. Every win pays 2×.' },
  retrigger: { tag: 'FEATURE 01 · FREE SPINS', title: 'More Crates', sym: 'scatter', color: '#b9c47a' },
  vault: { tag: 'FEATURE 02 · PICK', title: 'Dog Tags', sym: 'vault', color: '#d3d5d6', rule: 'Flip three tags. Each holds a prize.' },
  chain: { tag: 'FEATURE 03 · HOLD AND RESPIN', title: 'March of the Army', sym: 'chain', color: '#e3cf98', rule: 'Every rank that joins resets your respins to 3. Fill all 15 for the jackpot.' },
  jackpot: { tag: 'JACKPOT', title: 'To the Moon', sym: 'bitcoin', color: BRASS, rule: 'The army looks up as the moon fills the sky.' },
  gamble: { tag: 'GAMBLE', title: 'Moon or Doom', sym: null, color: BRASS, rule: 'Call the coin. Right doubles your win, wrong loses it.' }
};
const DUR = { trigger: 1900, retrigger: 1500, jackpotPlay: 5200, flip: 1700, respin: 1150, outroCount: 1600 };
const dur = k => quick() ? DUR[k] * .35 : DUR[k];
const shuffle = n => { const a = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function startScene(kind, data = {}) {
  stopAuto(); clearTimeout(freeTimer);
  const now = performance.now();
  scene = { kind, stage: data.outroOnly ? 'outro' : data.resumed ? 'intro' : 'trigger', t0: now, data, picks: [], hover: '', mile: shuffle(Math.max(9, MILES.length)), stamps: new Map(), banners: [], tOff: TRANSFERS.length ? Math.floor(Math.random() * TRANSFERS.length) : 0 };
  if (kind === 'vault' || kind === 'chain') { const f = feature(); scene.f = f; if (kind === 'vault' && scene.stage !== 'trigger') scene.stage = G.featureDone(f) ? 'outro' : f.picks.length ? 'play' : 'intro'; if (kind === 'chain' && f.index > 0) scene.stage = G.featureDone(f) ? 'outro' : 'play'; (f.picks || []).forEach(i => scene.picks.push({ i, t: now - 5000 })); scene.lastStep = now; scene.nextAt = now + dur('respin'); }
  if (scene.stage === 'trigger') { const st = { free: 'airdrop', retrigger: 'airdrop', vault: 'bonus', chain: 'bonus', jackpot: 'crescendo' }[kind]; sound(st || 'bonus'); excite = 1; }
  if (scene.stage === 'outro') scene.count0 = now;
  if (kind === 'free' && scene.stage !== 'outro') music(false);
  if (view === 'cabinet' && innerWidth < 1000) view = 'play';
  renderBar(); update(); screenDirty = true;
}
function setStage(stage) {
  if (!scene) return; const now = performance.now(); scene.stage = stage; scene.t0 = now; screenDirty = true;
  if (stage === 'outro') { scene.count0 = now; sound(scene.kind === 'gamble' ? (scene.result && scene.result.win ? 'win' : 'lose') : 'big'); if (scene.kind !== 'gamble' || (scene.result && scene.result.win)) burst(700, 420, 40, 'confetti', 1.1); }
  if (stage === 'play' && scene.kind === 'jackpot') { excite = 1; sound('howl'); }
  if (stage === 'play' && scene.kind === 'chain') { scene.lastStep = now; scene.nextAt = now + dur('respin'); }
  renderBar(); update();
}
function endScene() { const k = scene && scene.kind; scene = null; hideBar(); update(); if (k === 'free' && !freeMode) music(false); flow(); }
// The one action that is waiting: Start, Respin, Collect or Continue. Space, the big spin button, the screen and the bars all call it.
function primaryAction() {
  if (!scene || locked()) return; const s = scene, k = s.kind;
  if (s.stage === 'trigger') { if (k === 'retrigger') { scene = null; hideBar(); flow(); } else setStage('intro'); return; }
  if (s.stage === 'intro') {
    if (k === 'gamble') { keepWin(); return; }
    if (k === 'free') { freeMode = true; music(true); scene = null; hideBar(); toast(`${state.free} Airdrop spins · every win pays 2×`); flow(); return; }
    setStage('play'); return;
  }
  if (s.stage === 'play') {
    if (k === 'chain') { doRespin(); return; }
    if (k === 'vault') { if (s.f.picks.length < 3) { toast('Tap three dog tags to flip them.'); return; } setStage('outro'); return; }
    if (k === 'jackpot') { setStage('outro'); return; }
    return;
  }
  if (s.stage === 'outro') {
    if (k === 'vault' || k === 'chain') { const c = G.collect(state); if (!c) { endScene(); return; } save(); if (labRun) labCollect(c); winUntil = performance.now() + 4000; winStart = performance.now(); if (c.jackpotWin) sceneQueue.unshift({ kind: 'jackpot', amount: c.jackpotWin, source: 'chain' }); status(`${k === 'vault' ? 'DOG TAGS' : 'MARCH OF THE ARMY'} · ${fmt(c.amount)} LAYR COLLECTED`); endScene(); return; }
    if (k === 'free') { freeMode = false; music(false); status(`THE AIRDROP LANDED · ${fmt(s.data.summary ? s.data.summary.total : 0)} LAYR`); endScene(); return; }
    endScene(); return;
  }
}
function pickTag(i) {
  const s = scene; if (!s || s.kind !== 'vault' || locked()) return; if (s.stage === 'intro' || s.stage === 'trigger') setStage('play');
  if (s.f.picks.length >= 3) return; const r = G.pick(state, i); if (!r) return; save(); s.picks.push({ i, t: performance.now() }); sound('pick', s.f.picks.length);
  const [x, y, w] = tagCell(i); setTimeout(() => { burst(x + w / 2, y + 90, 22, 'dog', .9); if (r.multiple >= 8) [BUGLE.g4, BUGLE.c5, BUGLE.e5, BUGLE.g5].forEach((n, k) => brass(n, .2, k * .08, .05)); }, quick() ? 60 : 380);
  if (s.f.picks.length === 3) setTimeout(() => { if (scene === s && s.stage === 'play') setStage('outro'); }, quick() ? 700 : 2400);
  renderBar(); update();
}
// March of the Army: each lock sends a banner marching across the screen; the rank stamps in as the banner passes its column.
function doRespin() {
  const s = scene; if (!s || s.kind !== 'chain' || s.stage !== 'play') return; const f = s.f;
  if (G.featureDone(f)) { setStage('outro'); return; }
  const prevLeft = f.frames[f.index].left, prevCells = f.frames[f.index].cells, fr = G.respin(state); if (!fr) return; save(); const now = performance.now(); chainFlash = now; s.lastStep = now;
  // The respin: every empty rank spins like a reel (the result below is already dealt; this only reveals it). The last respin spins longer and builds tension.
  const qk = quick(), last = prevLeft === 1, spinT = qk ? 0 : RM() ? 450 : last ? 1500 : 1000;
  s.spinStart = now; s.spinEnd = now + spinT; s.lastRespin = last && !qk; s.stops = new Map(); s.pipUse = { t: now, i: Math.max(0, prevLeft - 1) };
  if (spinT) { sound(s.lastRespin ? 'tension' : 'spinCells', spinT); let ord = 0; prevCells.forEach((v, i) => { if (!v && !fr.added.includes(i)) { const st = s.spinEnd + ord * 55; ord++; s.stops.set(i, st); setTimeout(() => { if (scene === s) sound('celltap', i); }, Math.max(0, st - now)); } }); }
  if (fr.added.length) {
    const q = quick(), dr = q ? 520 : MARCH_DUR, gap = q ? 90 : MARCH_GAP, xs = RX - 230, xe = RX + RW + 230; setTimeout(() => { if (scene === s) sound('march'); }, spinT);
    fr.added.forEach((cell, k) => { const t0 = now + spinT + k * gap, cx = RX + (cell % 5) * CW + CW / 2, stampAt = t0 + dr * ((cx - xs) / (xe - xs)); s.banners.push({ cell, t0, dur: dr, tr: TRANSFERS.length && cell < MARCH_CELLS ? TRANSFERS[chainFace(cell)] : null, val: fr.cells[cell] }); s.stamps.set(cell, stampAt); if (spinT) s.stops.set(cell, stampAt);
      setTimeout(() => { if (scene !== s) return; sound('lock', 0); const px = RX + (cell % 5) * CW + CW / 2, py = RY + Math.floor(cell / 5) * RHT + RHT / 2, tn = performance.now(); burst(px, py, cell === MARCH_CELLS ? 30 : 14, cell === MARCH_CELLS ? 'star' : 'dog', .9); (s.shakes = s.shakes || []).push({ t: tn, amp: fr.cells[cell] >= 5 ? 10 : 6 }); s.totBump = tn; }, Math.max(0, stampAt - now)); });
    const firstStamp = Math.min(...fr.added.map(c => s.stamps.get(c))); s.prevLeft = prevLeft; s.resetFlash = firstStamp; setTimeout(() => { if (scene === s) sound('reset'); }, Math.max(0, firstStamp - now + 120));
    s.nextAt = now + spinT + marchTime(fr.added.length) + (q ? 200 : 500);
    if (fr.cells.every(Boolean)) setTimeout(() => { if (scene === s) sound('big'); }, spinT + marchTime(fr.added.length) - 200);
  } else { setTimeout(() => { if (scene === s) sound('respin'); }, spinT); s.nextAt = now + Math.max(dur('respin'), spinT + 450); }
  if (G.featureDone(f)) setTimeout(() => { if (scene === s && s.stage === 'play') setStage('outro'); }, (s.nextAt - now) + (quick() ? 300 : 900));
  renderBar(); update();
}
// Skip: jump to the outro with exactly the same total. Results were dealt by the engine before any of this.
function skipScene() {
  if (locked()) return;
  if (freeMode && !scene) { runFreeInstantly(); return; }
  const s = scene; if (!s) return; const k = s.kind;
  if (k === 'free' && s.stage !== 'outro') { freeMode = true; scene = null; runFreeInstantly(); return; }
  if (k === 'retrigger') { scene = null; hideBar(); runFreeInstantly(); return; }
  if (k === 'vault') { let i = 0; while (s.f.picks.length < 3) { if (!s.f.picks.includes(i) && G.pick(state, i)) s.picks.push({ i, t: performance.now() - 5000 }); i++; } save(); }
  if (k === 'chain') { while (G.respin(state)); save(); s.stamps.clear(); s.banners.length = 0; s.resetFlash = 0; s.stops = new Map(); s.spinEnd = 0; s.lastRespin = false; }
  if (k === 'gamble' && s.stage === 'intro') { keepWin(); return; }
  if (s.stage !== 'outro') { s.skipped = true; setStage('outro'); s.count0 = performance.now() - 5000; }
}
// Plays out the remaining Airdrop spins at once, collecting any bonus they land, then shows the Airdrop summary.
function runFreeInstantly() {
  clearTimeout(freeTimer); freeMode = true;
  let guard = 0;
  while (guard++ < 200) {
    const f = feature();
    if (f) { if (f.type === 'vault') { let i = 0; while (f.picks.length < 3) { G.pick(state, i++); } } else { while (G.respin(state)); } const c = G.collect(state); if (labRun && c) labCollect(c); continue; }
    if (state.free > 0) { const rng = labStartRng(); rng ? G.start(state, rng) : G.start(state); const r = G.settle(state); if (labRun) { state.history[0].lab = true; labLog(state.history[0]); } lastResult = r; faces = state.grid.map(col => col.map(pickFace)); continue; }
    break;
  }
  sceneQueue = sceneQueue.filter(q => q.kind === 'jackpot');
  save(); scene = null; flow();
}

/* ---------- Gamble: Moon or Doom ---------- */
function openGamble() { if (locked()) return; if (!state.gamble || spinning || scene || feature() || state.free) return; if (!labRun && state.gamble > state.balance) { toast('Not enough LAYR in the shared account.'); return; } closeModal(); startScene('gamble', { stake: state.gamble }); }
function callGamble(choice) {
  const s = scene; if (!s || s.kind !== 'gamble' || s.stage !== 'intro' || locked()) return;
  const rng = labGambleRng(choice), r = rng ? G.gamble(state, choice === 'moon' ? 'odd' : 'even', rng) : G.gamble(state, choice === 'moon' ? 'odd' : 'even');   // the side is the last hash character: odd is Moon, even is Doom
  if (!r) { endScene(); return; } save(); if (labRun) labGambleLog(r);
  s.result = r; s.choice = choice; sound('flip'); setStage('play');
  setTimeout(() => { if (scene === s && s.stage === 'play') { setStage('outro'); } }, dur('flip'));
}
function keepWin() { if (scene && scene.kind === 'gamble') { state.gamble = 0; save(); scene = null; hideBar(); toast('Win kept in your balance.'); update(); flow(); } }

/* ---------- Scene drawing ---------- */
function liftFor(kind) {
  if (kind === 'jackpot') return (c, r) => r === 1 && state.grid[c][1] === 'bitcoin';
  const sym = (SCENE[kind] || {}).sym; return sym ? (c, r) => state.grid[c][r] === sym : null;
}
function drawFreeOverlay(now) {
  // Crates drift down over the parade ground, and one more is released now and then; each bursts into DOG where it lands.
  if (!RM() && !spinning && now > (drawFreeOverlay.next || 0) && drops.length < 3) { spawnDrops(1, now); drawFreeOverlay.next = now + 2600; }
  drawDrops(now);
  const left = state.free, tot = state.freeTotal;
  sg.save(); sg.shadowColor = '#b9c47a'; sg.shadowBlur = 16; round(sg, 410, RY - 30, 580, 52, 26, '#12150af2', '#b9c47a', 3); sg.restore();
  text(sg, `THE AIRDROP · ${left} LEFT · ALL WINS 2× · ${fmt(tot)} LAYR`, 700, RY - 4, 21, '#eef3d4', 'Arial', 'center', '900');
}
const PRIZE_SYM = { 1: 'cherry', 2: 'lemon', 3: 'chip', 4: 'chip', 5: 'block', 8: 'artifact', 10: 'wild', 15: 'bitcoin' };
function drawOutro(now) {
  const s = scene, k = s.kind, a = clamp((now - s.t0) / 300), cnt = ease(clamp((now - s.count0) / dur('outroCount')));
  let title = '', total = 0, lines = [], color = (SCENE[k] || {}).color || BRASS;
  if (k === 'free') { const r = s.data.summary || { total: state.freeTotal, count: state.freeCount }; title = 'THE AIRDROP LANDED'; total = r.total; lines = [`${r.count} AIRDROP SPINS PLAYED · ALL WINS 2×`, 'INCLUDES ANY DOG TAGS OR MARCH WON ON THE WAY']; }
  if (k === 'vault') { const f = s.f; total = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; title = 'DOG TAGS FLIPPED'; lines = [`3 TAGS FLIPPED: ${f.picks.map(i => f.awards[i] + '×').join(' + ')} TOTAL BET`]; }
  if (k === 'chain') { const f = s.f; total = f.sum * f.bet; const n = f.frames[f.frames.length - 1].cells.filter(Boolean).length; title = f.full ? 'ALL 15 RANKS! PARADE COMPLETE' : 'THE MARCH IS COMPLETE'; lines = [`${n}/15 RANKS · ${f.frames.length - 1} RESPINS PLAYED`, f.full ? 'FULL PARADE: THE TO THE MOON JACKPOT FOLLOWS' : `${fmt(f.sum)}× TOTAL BET`]; }
  if (k === 'jackpot') { title = 'TO THE MOON!'; total = s.data.amount; lines = [s.data.source === 'chain' ? 'ALL 15 RANKS ON PARADE' : 'FIVE $DOG ON THE CENTRE ROW', 'THE METER RESETS TO 500× THIS BET']; color = BRASS; }
  if (k === 'gamble') { const r = s.result, side = r.parity === 'odd' ? 'MOON' : 'DOOM'; title = r.win ? `${s.choice.toUpperCase()}! DOUBLED` : `${side}. NOT THIS TIME`; total = r.amount; lines = [r.win ? `YOUR ${fmt(r.stake)} WIN IS NOW ${fmt(r.amount)}` : `THE ${fmt(r.stake)} WIN IS LOST · THE REST OF YOUR LAYR IS UNTOUCHED`, `HASH ENDS IN ${r.hash.at(-1)}: ${side}`]; }
  sg.save(); sg.globalAlpha = a; if (k !== 'jackpot') { sg.fillStyle = 'rgba(4,4,3,.62)'; sg.fillRect(RX, RY, RW, RH); }
  drawPanel(250, RY + 40, 900, 400, color);
  sg.save(); sg.shadowColor = color; sg.shadowBlur = 20; fitText(sg, title, 700, RY + 110, 56, 820, '#fff8e0', '900', HEAD); sg.restore();
  text(sg, `${fmt(cnt >= 1 ? total : Math.floor(total * cnt))} LAYR`, 700, RY + 210, 74, BRASS, 'Arial', 'center', '900');
  lines.forEach((l, i) => fitText(sg, l, 700, RY + 290 + i * 34, 20, 820, '#d8d1b6', '800'));
  sg.restore();
  const label = k === 'vault' || k === 'chain' ? 'COLLECT' : 'BACK TO THE REELS';
  if (a >= 1) screenButton('primary', label, 520, RY + 470, 360, 78, primaryAction, 'gold');
}
function drawScene(now) {
  const s = scene, k = s.kind, t = (now - s.t0) / 1000, cfg = SCENE[k] || {};
  if (s.stage === 'trigger') {
    if (k === 'chain' || k === 'vault' || k === 'free' || k === 'retrigger' || (k === 'jackpot' && s.data.source === 'line')) {
      if (freeMode) { drawNight(now); } const lf = liftFor(k), up = RM() ? 0 : 14 + Math.sin(now / 120) * 8, sc = RM() ? 1 : 1.08 + Math.sin(now / 160) * .05;
      drawReels(now, { lift: lf ? (c, r) => lf(c, r) ? { up, scale: sc, color: cfg.color } : null : null, dim: .55 });
    } else if (k !== 'gamble') drawReels(now, { dim: .4 });
    const sub = k === 'free' ? `${s.data.scatters || 3} SNAPSHOTS · ${s.data.award || 8} FREE SPINS · ALL WINS 2×` : k === 'retrigger' ? `+${s.data.award} CRATES · UP TO 24` : k === 'vault' ? 'NINE DOG TAGS · FLIP THREE' : k === 'chain' ? `${s.f.frames[0].cells.filter(Boolean).length} RANKS FORM · FILL THE PARADE` : k === 'jackpot' ? (s.data.source === 'chain' ? 'ALL 15 RANKS ON PARADE' : 'FIVE $DOG ON THE CENTRE ROW') : 'CALL THE COIN';
    if (k === 'gamble') { drawReels(now, { dim: .6 }); const u = RM() ? 1 : ease(clamp((now - s.t0) / 650)); sg.save(); sg.translate((1 - u) * 760, 0); sg.translate(700, RY + 250); sg.rotate((1 - u) * 6); sg.translate(-700, -(RY + 250)); drawCoin(now, 'moon', null); sg.restore(); }
    else drawTitleCard(now, cfg.title.toUpperCase() + '!', sub, cfg.color, t);
    if (k === 'gamble') text(sg, 'MOON OR DOOM?', 700, RY + 470, 54, '#fff8e0', HEAD, 'center', '900');
    const d = k === 'retrigger' ? dur('retrigger') : k === 'gamble' ? 700 : dur('trigger');
    if (now - s.t0 > d) { if (k === 'retrigger') { scene = null; hideBar(); flow(); } else setStage('intro'); }
    else screenButton('skipTrig', 'CONTINUE', 1110, RY + RH - 70, 220, 56, primaryAction, 'ghost');
    return;
  }
  if (k === 'free') {
    if (s.stage === 'intro') { const it = clamp(t / (RM() ? .3 : 1.6)); drawNight(now, { alpha: it }); if (!RM()) { sg.save(); sg.globalAlpha = 1 - it; sg.translate(0, -it * 200); drawReels(now); sg.restore(); }
      const u = RM() ? .3 : clamp(t / 3.4), px = RX - 230 + u * (RW + 460), py = RY + 112 + Math.sin(now / 500) * 7;
      if (!RM()) { const want = Math.min(4, Math.floor(t / .6)); while ((s.dropped || 0) < want && px > RX + 60 && px < RX + RW - 60) { s.dropped = (s.dropped || 0) + 1; spawnDrops(1, now, 0, { x: px, y: py + 24 }); } }
      sg.save(); sg.globalAlpha = it; cargoPlane(sg, px, py, .9, now); sg.restore(); drawDrops(now);
      drawRuleCard(now, s.data.resumed ? 'The Airdrop · carry on' : 'The Airdrop', `${state.free} free spins. Every win pays 2×. Crates burst into DOG.`, t, '#b9c47a');
      if (t > .5) screenButton('primary', s.data.resumed ? 'CARRY ON' : 'START DROP', 520, RY + RH - 10 - 64, 360, 72, primaryAction, 'gold'); }
    else if (s.stage === 'outro') { drawNight(now); drawDrops(now); drawReels(now); drawOutro(now); }
    return;
  }
  if (k === 'vault') {
    const f = s.f;
    if (s.stage === 'intro') { const it = clamp(t / 1.2); drawBarracks(now, it); drawTagBoard(now, f, it); drawRuleCard(now, 'Dog Tags', cfg.rule, t, '#d3d5d6'); if (t > .5) screenButton('primary', 'FLIP THE TAGS', 520, RY + RH - 82, 360, 72, primaryAction, 'gold'); }
    else if (s.stage === 'play') { drawBarracks(now); drawTagBoard(now, f); round(sg, 500, RY - 30, 400, 52, 26, '#14120ef2', '#d3d5d6', 3); const tot = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; text(sg, f.picks.length < 3 ? `FLIP ${3 - f.picks.length} · ${fmt(tot)} LAYR` : `${fmt(tot)} LAYR`, 700, RY - 4, 21, '#fff3c0', 'Arial', 'center', '900'); }
    else { drawBarracks(now); drawTagBoard(now, f); drawOutro(now); }
    return;
  }
  if (k === 'chain') {
    const f = s.f;
    if (s.stage === 'intro') { drawMarchBoard(now, f, clamp(t / 1.2)); drawRuleCard(now, 'March of the Army', cfg.rule, t, '#e3cf98'); if (t > .5) screenButton('primary', 'START THE MARCH', 520, RY + RH - 82, 360, 72, primaryAction, 'gold'); }
    else if (s.stage === 'play') { drawMarchBoard(now, f); if (!G.featureDone(f)) { screenButton('primary', 'RESPIN', 1130, RY + RH - 66, 200, 56, primaryAction, 'gold'); if (now >= s.nextAt) doRespin(); } }
    else { drawMarchBoard(now, f); drawOutro(now); }
    return;
  }
  if (k === 'jackpot') {
    if (s.stage === 'intro') { drawReels(now, { dim: .5 }); drawTitleCard(now, 'TO THE MOON', 'THE ARMY LOOKS UP · THE MOON FILLS THE SKY', BRASS, 1); round(sg, 380, RY + 424, 640, 50, 25, '#0b0a07f0', '#dcb95e88', 2); text(sg, cfg.rule, 700, RY + 449, 22, '#f4efe0', 'Arial', 'center', '800'); if (t > .4) screenButton('primary', 'LOOK UP', 500, RY + RH - 86, 400, 74, primaryAction, 'gold'); }
    else if (s.stage === 'play') { drawJackpotShow(now, t, s.data.amount); if (now - s.t0 > dur('jackpotPlay')) setStage('outro'); }
    else { drawJackpotShow(now, t, s.data.amount); drawOutro(now); }
    return;
  }
  if (k === 'gamble') {
    drawReels(now, { dim: .72 });
    if (s.stage === 'intro') { drawCoin(now, 'moon', null); text(sg, 'MOON OR DOOM?', 700, RY + 420, 44, '#fff8e0', HEAD, 'center', '900'); fitText(sg, `${fmt(s.data.stake)} LAYR RIDES ON ONE CALL`, 700, RY + 458, 20, 800, BRASS, '800');
      screenButton('callMoon', 'MOON', 330, RY + RH - 72, 240, 64, () => callGamble('moon'), 'moon', 'FULL MOON'); screenButton('callDoom', 'DOOM', 830, RY + RH - 72, 240, 64, () => callGamble('doom'), 'doom', 'ECLIPSE'); screenButton('keep', 'KEEP', 600, RY + RH - 69, 200, 58, keepWin, 'ghost'); }
    else if (s.stage === 'play') { const u = clamp((now - s.t0) / dur('flip')); drawCoin(now, s.result.parity === 'odd' ? 'moon' : 'doom', RM() ? 1 : u); text(sg, `YOU CALLED ${s.choice.toUpperCase()}`, 700, RY + 470, 30, '#e6dfc4', HEAD, 'center', '900'); }
    else { const face = s.result.parity === 'odd' ? 'moon' : 'doom'; if (face === 'doom') { sg.fillStyle = 'rgba(40,6,4,.35)'; sg.fillRect(RX, RY, RW, RH); } else { sg.save(); sg.globalCompositeOperation = 'lighter'; sg.fillStyle = rad(sg, 700, RY + 250, 120, 560, ['rgba(255,244,205,.35)', 'rgba(255,244,205,0)']); sg.fillRect(RX, RY, RW, RH); sg.restore(); } drawCoin(now, face, 1); drawOutro(now); }
  }
}
