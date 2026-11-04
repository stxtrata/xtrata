
/* ---------- Spinning ---------- */
function anticipation(g) { const first = g.slice(0, 3).flat(), n = s => first.filter(x => x === s).length; return n('scatter') >= 2 || n('vault') >= 2 || n('chain') >= 4; }
function spinInputBusy(){return spinning;}
function spinClick() { if(spinInputBusy())return;audioInit(); if ($('modal').open || locked()) return; if (scene) { primaryAction(); return; } if (feature()) { flow(); return; } if (freeMode && state.free > 0) { clearTimeout(freeTimer); spin(); return; } if (!labRun && !state.free && state.balance < state.bet) { openAccount(); return; } spin(); }
function scheduleStop(a, c) { if (a.nodes) a.nodes.forEach(o => { try { o.stop(); } catch (e) {} }); a.nodes = sound('stop', c, Math.max(0, (a.start + a.land - performance.now()) / 1000 - audioLatency())) || null; }
let nextFaces = null, cameo = null;
function spin() {
  if (spinning || scene || $('modal').open || locked()) return;
  if (feature()) { flow(); return; }
  const prev = state.grid.map((c, ci) => c.map((s, r) => [s, faces[ci][r]])); let p;
  const rng = labStartRng();
  // The engine fixes the whole round here: reels, bonus prizes and hold-and-respin frames. Nothing after this can change it.
  try { p = rng ? G.start(state, rng) : G.start(state); } catch (e) { stopAuto(); toast(e.message); if (/LAYR/.test(e.message) && !labRun) openAccount(); return; }
  if (!p.free) addHolder(p.bet);
  spinning = true; lastResult = null; save(); sound('spin'); leverStart = performance.now(); hideBar();
  status(p.free ? 'MOONSHOT SPIN · ALL WINS 2×' : 'MOO…');
  // The result is already fixed; now choose the cosmetic faces (which letter a tile shows, which twin floats by).
  nextFaces = p.grid.map(col => col.map(pickFace));
  cameo = p.free && twins.length ? twins[Math.floor(Math.random() * twins.length)] : null; if (cameo) cameo.t0 = performance.now();
  const now = performance.now(), q = quick(), antic = anticipation(p.grid);
  animations = Array.from({ length: 5 }, (_, c) => { const strip = E.strips[c], L = strip.length; const extra = antic && c >= 3 ? (c - 2) * (q ? 350 : 900) : 0; const land = (q ? 380 + c * 90 : 1350 + c * 260) + extra, bounce = q ? 110 : 210; const travel = Math.max(6, Math.round(land * (q ? .034 : .0098))), n = travel - 3; const fill = Array.from({ length: n }, (_, i) => { const s = strip[(p.stops[c] - n + i + L * 8) % L]; return [s, pickFace(s)]; }); const after = strip[(p.stops[c] + 3) % L]; const sequence = [...prev[c], ...fill, ...p.grid[c].map((s, r) => [s, nextFaces[c][r]]), [after, pickFace(after)]]; return { sequence, travel, start: now + c * (q ? 18 : 65), land, bounce, duration: land + bounce, kick: q ? .16 : .26, nodes: null, antic: antic && c >= 3 }; });
  animations.forEach(scheduleStop);
  if (antic) setTimeout(() => { if (spinning) sound('antic'); }, q ? 450 : 1900);
  update();
}
function lightRungs(r) { for (const w of r.wins) { const k = RUNG[w.symbol]; if (k != null) ladderGlow[k] = 1; } }
function finishSpin() {
  spinning = false; lastResult = G.settle(state); if (nextFaces) faces = nextFaces; nextFaces = null;
  const r = lastResult, bet = r.round.bet, h = state.history[0];
  if (h && labRun) h.lab = true;
  if (labRun && !labRun.gamble) state.gamble = 0;   // a Lab item that isn't about the gamble never waits on one
  // Holder layer: a forevered twin floating through the Moonshot starfield on a winning spin earns its holder a cameo record.
  if (h && r.round.free && cameo && r.lineTotal > 0 && isForever(cameo)) h.cameo = { tokenId: cameo.tokenId, collection: 'leo-cats', xtrataId: cameo.xtrataId, lineWin: r.lineTotal };
  if (labRun) labLog(h); save(); update(); lightRungs(r);
  if (r.total >= bet * 10) mooBurstAt = performance.now();
  if (r.total) { sound(r.total >= bet * 10 ? 'big' : 'win', r.wins.some(w => w.symbol === 'lemon' || w.symbol === 'block') ? 1 : 0); winUntil = performance.now() + 4000; excite = Math.max(excite, r.total >= bet * 10 ? 1 : .5); if (r.total >= bet * 5) burst(700, 480, r.total >= bet * 25 ? 60 : 26, 'coin', 1.2); }
  const twinNote = h && h.cameo ? ` · LEO CAT #${h.cameo.tokenId} · XTRATA #${h.cameo.xtrataId} FLEW BY` : '';
  let msg = r.total ? `${r.jackpotWin ? 'FULL MOONEEB · ' : ''}${fmt(r.total)} LAYR WON${r.wins.length ? ` · ${r.wins.length} LINE${r.wins.length === 1 ? '' : 'S'}` : ''}${r.scatterPay ? ' · MOONSHOT PAY' : ''}${twinNote}` : (r.round.free ? 'MOONSHOT SPIN COMPLETE' : 'NO WIN · MOO AGAIN');
  if (state.gamble) msg += ' · MOO OR MOON?';
  status(msg);
  if (r.jackpotWin) sceneQueue.push({ kind: 'jackpot', amount: r.jackpotWin, source: 'line' });
  if (r.triggers.free) { if (!r.round.free) sceneQueue.push({ kind: 'free', award: r.freeAward, scatters: r.scatters, pay: r.scatterPay }); else if (r.freeAward) sceneQueue.push({ kind: 'retrigger', award: r.freeAward, scatters: r.scatters }); else toast('Moonshot cap reached: 24 spins awarded this feature.'); }
  if (sceneQueue.length || feature()) stopAuto();
  if (labRun && labRun.gamble && state.gamble && !sceneQueue.length && !feature()) { setTimeout(() => openGamble(), quick() ? 300 : 900); return; }
  flow();
}
// One dispatcher decides what plays next: the jackpot celebration, a bonus, the next Moonshot spin, or back to the reels.
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
function changeBet(dir, max = false) { if (busy() || locked() || labRun) return; stopAuto(); state.bet = max ? bets.at(-1) : bets[Math.max(0, Math.min(bets.length - 1, bets.indexOf(state.bet) + dir))]; state.gamble = 0; save(); update(); sound('click'); }
function stopAuto() { autoLeft = 0; clearTimeout(autoTimer); update(); }
function scheduleAuto() { if (autoLeft > 0 && !$('modal').open && !document.hidden) { autoTimer = setTimeout(() => { if (autoLeft <= 0 || spinning || scene || $('modal').open || feature() || labRun) return; if (!state.free && state.balance < state.bet) { stopAuto(); toast('AUTO-MOO stopped: not enough LAYR in the shared account.'); return; } autoLeft--; update(); spin(); }, state.turbo ? 400 : 1000); } }
function autoClick() { if (autoLeft) { stopAuto(); status('AUTO-MOO STOPPED'); return; } if (busy() || locked() || labRun) { toast('Finish this spin or bonus first.'); return; } showModal('auto', 'AUTO-MOO.', `<p>Autoplay spins at your current bet. It stops when any bonus triggers, your LAYR run low, you open a panel or you leave the tab.</p><div class="stat-cards"><div><span>BET PER SPIN</span><strong>${fmt(state.bet)}</strong></div><div><span>AVAILABLE LAYR</span><strong>${fmt(state.balance)}</strong></div></div><button class="cta" data-auto="10">10 spins</button><button class="cta" data-auto="25">25 spins</button><button class="cta" data-auto="50">50 spins</button><p class="fine">Press AUTO-MOO again at any time to stop.</p>`, 'AUTO-MOO'); document.querySelectorAll('[data-auto]').forEach(b => b.onclick = () => { const n = Number(b.dataset.auto); closeModal(); autoLeft = n - 1; update(); spin(); }); }

/* ---------- Bonus scenes: trigger → intro → play → outro, every one in the machine's theme ---------- */
const SCENE = {
  free: { tag: 'FEATURE 01 · FREE SPINS', title: 'Moonshot', sym: 'scatter', color: '#6fe3ff', rule: 'Free spins in the starfield. Every win pays 2×.' },
  retrigger: { tag: 'FEATURE 01 · FREE SPINS', title: 'More Moonshots', sym: 'scatter', color: '#6fe3ff' },
  vault: { tag: 'FEATURE 02 · PICK', title: 'Mooney Bags', sym: 'vault', color: GOLD, rule: 'Open three bags. Each holds a prize.' },
  chain: { tag: 'FEATURE 03 · HOLD AND RESPIN', title: 'Spell It', sym: 'chain', color: '#f4e3b8', rule: 'Letters lock in. Any new letter resets your respins to 3. Spell it all for the jackpot.' },
  jackpot: { tag: 'JACKPOT', title: 'Full Mooneeb', sym: 'bitcoin', color: GOLD, rule: 'The whole ladder lights, M to Mooneeb.' },
  gamble: { tag: 'GAMBLE', title: 'Moo or Moon', sym: null, color: GOLD, rule: 'Call the coin. Right doubles your win, wrong loses it.' }
};
const DUR = { trigger: 1900, retrigger: 1500, jackpotPlay: 4600, flip: 1700, respin: 1150, outroCount: 1600 };
const dur = k => quick() ? DUR[k] * .35 : DUR[k];
function startScene(kind, data = {}) {
  stopAuto(); clearTimeout(freeTimer);
  const now = performance.now();
  scene = { kind, stage: data.outroOnly ? 'outro' : data.resumed ? 'intro' : 'trigger', t0: now, data, picks: [], hover: '' };
  if (kind === 'vault' || kind === 'chain') { const f = feature(); scene.f = f; if (kind === 'vault' && scene.stage !== 'trigger') scene.stage = G.featureDone(f) ? 'outro' : f.picks.length ? 'play' : 'intro'; if (kind === 'chain' && f.index > 0) scene.stage = G.featureDone(f) ? 'outro' : 'play'; (f.picks || []).forEach(i => scene.picks.push({ i, t: now - 5000 })); scene.lastStep = now; }
  if (scene.stage === 'trigger') { const st = { free: 'roar', retrigger: 'roar', vault: 'bonus', chain: 'letters', jackpot: 'crescendo' }[kind]; sound(st || 'bonus'); excite = 1; }
  if (scene.stage === 'outro') scene.count0 = now;
  if (kind === 'free' && scene.stage !== 'outro') music(false);
  if (view === 'cabinet' && innerWidth < 1000) view = 'play';
  renderBar(); update(); screenDirty = true;
}
function setStage(stage) {
  if (!scene) return; const now = performance.now(); scene.stage = stage; scene.t0 = now; screenDirty = true;
  if (stage === 'outro') { scene.count0 = now; sound(scene.kind === 'gamble' ? (scene.result && scene.result.win ? 'win' : 'lose') : 'big'); if (scene.kind !== 'gamble' || (scene.result && scene.result.win)) burst(700, 420, 40, 'confetti', 1.1); }
  if (stage === 'play' && scene.kind === 'jackpot') { excite = 1; }
  if (stage === 'play' && scene.kind === 'chain') scene.lastStep = now;
  renderBar(); update();
}
function endScene() { const k = scene && scene.kind; scene = null; hideBar(); update(); if (k === 'free' && !freeMode) music(false); flow(); }
// The one action that is waiting: Start, Respin, Collect or Continue. Space, the big spin button, the screen and the bars all call it.
function primaryAction() {
  if (!scene || locked()) return; const s = scene, k = s.kind;
  if (s.stage === 'trigger') { if (k === 'retrigger') { scene = null; hideBar(); flow(); } else setStage('intro'); return; }
  if (s.stage === 'intro') {
    if (k === 'gamble') { keepWin(); return; }
    if (k === 'free') { freeMode = true; music(true); scene = null; hideBar(); toast(`${state.free} Moonshots · every win pays 2×`); flow(); return; }
    setStage('play'); return;
  }
  if (s.stage === 'play') {
    if (k === 'chain') { doRespin(); return; }
    if (k === 'vault') { if (s.f.picks.length < 3) { toast('Tap three bags to open them.'); return; } setStage('outro'); return; }
    if (k === 'jackpot') { setStage('outro'); return; }
    return;
  }
  if (s.stage === 'outro') {
    if (k === 'vault' || k === 'chain') { const f = feature(); const c = G.collect(state); if (!c) { endScene(); return; } save(); if (labRun) labCollect(c); winUntil = performance.now() + 4000; if (c.jackpotWin) sceneQueue.unshift({ kind: 'jackpot', amount: c.jackpotWin, source: 'chain' }); status(`${k === 'vault' ? 'MOONEY BAGS' : 'SPELL IT'} · ${fmt(c.amount)} LAYR COLLECTED`); endScene(); return; }
    if (k === 'free') { freeMode = false; music(false); status(`MOONSHOT LANDED · ${fmt(s.data.summary ? s.data.summary.total : 0)} LAYR`); endScene(); return; }
    endScene(); return;
  }
}
function pickBag(i) {
  const s = scene; if (!s || s.kind !== 'vault' || locked()) return; if (s.stage === 'intro' || s.stage === 'trigger') setStage('play');
  if (s.f.picks.length >= 3) return; const r = G.pick(state, i); if (!r) return; save(); s.picks.push({ i, t: performance.now() }); sound('pick', s.f.picks.length);
  const [x, y, w, h] = bagRect(i); setTimeout(() => { burst(x + w / 2, y + h / 2, 24, 'coin', .9); if (r.multiple >= 8) [1046.5, 1318.5, 1568].forEach((n, k) => tone(n, .22, 'square', .04, k * .06, 1, 3000)); }, quick() ? 60 : 320);
  if (s.f.picks.length === 3) setTimeout(() => { if (scene === s && s.stage === 'play') setStage('outro'); }, quick() ? 700 : 2200);
  renderBar(); update();
}
function doRespin() {
  const s = scene; if (!s || s.kind !== 'chain' || s.stage !== 'play') return; const f = s.f;
  if (G.featureDone(f)) { setStage('outro'); return; }
  const fr = G.respin(state); if (!fr) return; save(); chainFlash = performance.now(); s.lastStep = chainFlash;
  if (fr.added.length) { fr.added.forEach((_, k) => sound('lock', k)); setTimeout(() => sound('reset'), 200); s.resetFlash = chainFlash; } else sound('respin');
  if (G.featureDone(f)) setTimeout(() => { if (scene === s && s.stage === 'play') setStage('outro'); }, quick() ? 500 : 1500);
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
  if (k === 'chain') { while (G.respin(state)); save(); }
  if (k === 'gamble' && s.stage === 'intro') { keepWin(); return; }
  if (s.stage !== 'outro') { s.skipped = true; setStage('outro'); s.count0 = performance.now() - 5000; }
}
// Plays out the remaining Moonshot spins at once, collecting any bonus they land, then shows the Moonshot summary.
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

/* ---------- Gamble: Moo or Moon ---------- */
function openGamble() { if (locked()) return; if (!state.gamble || spinning || scene || feature() || state.free) return; if (!labRun && state.gamble > state.balance) { toast('Not enough LAYR in the shared account.'); return; } closeModal(); startScene('gamble', { stake: state.gamble }); }
function callGamble(choice) {
  const s = scene; if (!s || s.kind !== 'gamble' || s.stage !== 'intro' || locked()) return;
  const rng = labGambleRng(choice), r = rng ? G.gamble(state, choice === 'moo' ? 'odd' : 'even', rng) : G.gamble(state, choice === 'moo' ? 'odd' : 'even');
  if (!r) { endScene(); return; } save(); if (labRun) labGambleLog(r);
  s.result = r; s.choice = choice; sound('flip'); setStage('play');
  setTimeout(() => { if (scene === s && s.stage === 'play') { if (r.win) { if (r.parity === 'odd') mooBurstAt = performance.now(); } setStage('outro'); } }, dur('flip'));
}
function keepWin() { if (scene && scene.kind === 'gamble') { state.gamble = 0; save(); scene = null; hideBar(); toast('Win kept in your balance.'); update(); flow(); } }

/* ---------- Scene drawing ---------- */
function liftFor(kind) {
  if (kind === 'jackpot') return (c, r) => r === 1 && state.grid[c][1] === 'bitcoin';
  const sym = (SCENE[kind] || {}).sym; return sym ? (c, r) => state.grid[c][r] === sym : null;
}
function drawTitleCard(now, title, sub, color, t) {
  const k = RM() ? 1 : backOut(t * 2.2), y = RY + RH / 2 - 10;
  sg.save(); sg.globalAlpha = clamp(t * 4); sg.translate(700, y); sg.scale(k, k);
  sg.shadowColor = color; sg.shadowBlur = 40; round(sg, -380, -86, 760, 172, 40, lin(sg, 0, -86, 0, 86, ['#3b1f7af2', '#170736f2']), color, 6); sg.shadowBlur = 0;
  sg.save(); sg.shadowColor = color; sg.shadowBlur = 24; fitText(sg, title, 0, -18, 78, 700, '#fff8e0', '900'); sg.restore();
  fitText(sg, sub, 0, 46, 24, 700, color, '800'); sg.restore();
}
function drawPanel(x, y, w, h, color = ACCENT) { sg.save(); sg.shadowColor = color; sg.shadowBlur = 30; round(sg, x, y, w, h, 32, lin(sg, 0, y, 0, y + h, ['#2f1866f4', '#12062cf4']), color, 5); sg.restore(); }
function drawRuleCard(now, title, rule, t, color) {
  const a = clamp(t * 3); sg.save(); sg.globalAlpha = a; drawPanel(300, RY + 300, 800, 220, color);
  fitText(sg, title.toUpperCase(), 700, RY + 350, 46, 740, '#fff8e0', '900'); fitText(sg, rule, 700, RY + 402, 22, 740, '#e3d4ff', '700'); sg.restore();
}
function drawCowHelmet(x, y, s, rot) { if (!img.moo) return; sg.save(); sg.translate(x, y); sg.rotate(rot); sg.scale(s, s); sg.save(); sg.beginPath(); sg.arc(0, -4, 88, 0, 7); sg.clip(); sg.drawImage(img.moo, -92, -96, 184, 184); sg.restore(); sg.beginPath(); sg.arc(0, -4, 92, 0, 7); sg.fillStyle = 'rgba(180,230,255,.16)'; sg.fill(); sg.lineWidth = 8; sg.strokeStyle = '#e6f6ff'; sg.stroke(); sg.lineWidth = 4; sg.strokeStyle = INK; sg.stroke(); sg.beginPath(); sg.arc(-30, -40, 30, Math.PI * 1.1, Math.PI * 1.45); sg.lineWidth = 8; sg.strokeStyle = '#ffffffaa'; sg.stroke(); round(sg, -56, 80, 112, 26, 10, '#d9d4ff', INK, 4); sg.restore(); }
function drawFreeOverlay(now) {
  // The cow floats by in a space helmet, and one real LEO Cats twin drifts through the starfield each spin.
  const t = (now / 9000) % 1, x = RX - 120 + t * (RW + 240), y = RY + 130 + Math.sin(now / 900) * 40;
  sg.save(); sg.globalAlpha = .9; drawCowHelmet(x, y, .55, Math.sin(now / 1300) * .25); sg.restore();
  if (cameo) { const u = clamp((now - cameo.t0) / 5200), cx = RX + RW + 120 - u * (RW + 260), cy = RY + RH - 140 - Math.sin(u * Math.PI) * 120, card = isForever(cameo) ? cameo.cardF : cameo.cardN; if (u < 1) { sg.save(); sg.globalAlpha = .92; sg.translate(cx, cy); sg.rotate(Math.sin(now / 700) * .12); sg.drawImage(card, -66, -78, 132, 156); sg.restore(); } }
  const left = state.free, tot = state.freeTotal;
  sg.save(); sg.shadowColor = '#6fe3ff'; sg.shadowBlur = 16; round(sg, 430, RY - 30, 540, 52, 26, '#0b1f3af2', '#6fe3ff', 3); sg.restore();
  text(sg, `MOONSHOT · ${left} LEFT · ALL WINS 2× · ${fmt(tot)} LAYR`, 700, RY - 4, 21, '#e6fbff', 'Arial', 'center', '900');
}
const PRIZE_SYM = { 1: 'cherry', 2: 'lemon', 3: 'chip', 4: 'chip', 5: 'block', 8: 'artifact', 10: 'wild', 15: 'bitcoin' };
function bagRect(i) { const gx = 330, gy = 182, cols = 3, x = RX + 190 + (i % cols) * gx, y = RY + 14 + Math.floor(i / cols) * gy; return [x, y, 250, 170]; }
// The Mooney Bags field: a map of Mooney Mooney, NSW (supplied by Jim), dimmed to moonlight, with the crescent moon above.
function drawMoonlitField(now, a = 1) {
  sg.save(); sg.globalAlpha = a; sg.beginPath(); sg.rect(RX, RY, RW, RH); sg.clip();
  if (img.field) { const im = img.field, k = Math.max(RW / im.width, RH / im.height), dy = Math.sin(now / 9000) * 18; sg.drawImage(im, RX + RW / 2 - im.width * k / 2, RY + RH / 2 - im.height * k / 2 + dy, im.width * k, im.height * k); sg.fillStyle = lin(sg, 0, RY, 0, RY + RH, ['rgba(14,6,48,.72)', 'rgba(20,8,60,.5)', 'rgba(14,6,48,.62)']); sg.fillRect(RX, RY, RW, RH); }
  else { sg.fillStyle = lin(sg, 0, RY, 0, RY + RH, ['#120a3e', '#2a1666', '#3b2a7a']); sg.fillRect(RX, RY, RW, RH); sg.fillStyle = '#1d4a3a'; sg.beginPath(); sg.moveTo(RX, RY + RH); sg.quadraticCurveTo(RX + 300, RY + RH - 170, RX + 700, RY + RH - 120); sg.quadraticCurveTo(RX + 1050, RY + RH - 80, RX + RW, RY + RH - 160); sg.lineTo(RX + RW, RY + RH); sg.fill(); }
  for (const s of starField.slice(0, 60)) { sg.globalAlpha = a * (.3 + .5 * Math.abs(Math.sin(now / 700 + s.tw))); sg.fillStyle = '#fff'; sg.beginPath(); sg.arc(RX + s.x * RW / 1400, RY + (s.y % 260), s.r, 0, 7); sg.fill(); }
  sg.globalAlpha = a; const moonImg = img.crescent || img.moon; if (moonImg) { const mx = RX + RW - 130, my = RY + 100; sg.save(); sg.shadowColor = '#ffe9a8'; sg.shadowBlur = 40; sg.beginPath(); sg.arc(mx, my, 92, 0, 7); sg.fillStyle = '#ffe9a8'; sg.fill(); sg.restore(); sg.save(); sg.beginPath(); sg.arc(mx, my, 88, 0, 7); sg.clip(); sg.drawImage(moonImg, mx - 88, my - 88, 176, 176); sg.restore(); }
  if (img.field) { round(sg, RX + 14, RY + RH - 40, 330, 28, 14, '#0e0622cc'); text(sg, 'MOONEY MOONEY · HAWKESBURY RIVER, NSW', RX + 179, RY + RH - 26, 13, '#f4ecff', 'Arial', 'center', '800'); }
  sg.restore();
}
function drawBags(now, f, introT = 1) {
  for (let i = 0; i < 9; i++) {
    const [x, y, w, h] = bagRect(i), pk = scene.picks.find(p => p.i === i), drop = RM() ? 1 : backOut(clamp(introT * 2 - i * .08));
    const yy = y - (1 - drop) * 300;
    if (!pk) {
      const done = f.picks.length >= 3, bob = done || RM() ? 0 : Math.sin(now / 500 + i) * 4, hot = scene.hover === 'bag' + i;
      sg.save(); sg.globalAlpha = done ? .45 : 1; sg.translate(x + w / 2, yy + h / 2 + bob); if (hot) sg.scale(1.06, 1.06); if (img.bag) sg.drawImage(img.bag, -78, -86, 156, 156); sg.restore();
      if (!done) { round(sg, x + w / 2 - 22, yy + h - 30, 44, 30, 15, '#170736', GOLD, 3); text(sg, String(i + 1), x + w / 2, yy + h - 15, 18, GOLD, 'Arial', 'center', '900'); sbtn.push({ id: 'bag' + i, x, y: yy, w, h, act: () => pickBag(i) }); }
      else { const v = f.awards[i]; text(sg, `${v}×`, x + w / 2, yy + h / 2 + 30, 30, '#cdbbef', 'Arial', 'center', '900'); }
    } else {
      const age = now - pk.t, open = quick() ? clamp(age / 200) : clamp((age - 300) / 500), shake = !RM() && age < 300 && !quick() ? Math.sin(age / 18) * 8 : 0, v = f.awards[i], sym = PRIZE_SYM[v];
      sg.save(); sg.translate(x + w / 2 + shake, yy + h / 2);
      if (open < 1) { if (img.bag) { sg.globalAlpha = 1 - open; sg.drawImage(img.bag, -78, -86, 156, 156); sg.globalAlpha = 1; } }
      if (open > 0) { const s = RM() ? 1 : backOut(open); sg.scale(s, s); sg.shadowColor = GOLD; sg.shadowBlur = 26; round(sg, -118, -80, 236, 160, 26, lin(sg, 0, -80, 0, 80, ['#3b1f7a', '#1a0b3a']), GOLD, 5); sg.shadowBlur = 0; const t = symbolImages[sym]; if (t) sg.drawImage(t, -110, -72, 116, 116); text(sg, `${v}×`, 50, -22, 50, '#fff8e0', 'Arial', 'center', '900'); text(sg, `${fmt(v * f.bet)} LAYR`, 50, 22, 17, GOLD, 'Arial', 'center', '800'); text(sg, NAMES[sym].toUpperCase(), 0, 62, 13, '#cdbbef', 'Arial', 'center', '800'); }
      sg.restore();
    }
  }
}
function drawSpellBoard(now, f, introT = 1) {
  const fr = f.frames[f.index], fresh = now - chainFlash < 900 ? fr.added : [];
  sg.save(); sg.fillStyle = '#0d0526f0'; sg.fillRect(RX, RY, RW, RH); sg.restore();
  fr.cells.forEach((v, i) => {
    const c = i % 5, r = Math.floor(i / 5), x = RX + c * CW + 10, y = RY + r * RHT + 8, w = CW - 23, h = RHT - 16, ch = i < 14 ? SPELL[i] : null, appear = RM() ? 1 : clamp(introT * 2.5 - i * .05);
    if (v) {
      const isNew = fresh.includes(i), age = now - chainFlash, s = isNew && !RM() ? 1 + .45 * (1 - ease(age / 350)) : 1, dy = isNew && !RM() ? -120 * (1 - ease(age / 300)) : 0;
      sg.save(); sg.globalAlpha = appear; sg.translate(x + w / 2, y + h / 2 + dy); sg.scale(s, s); sg.shadowColor = GOLD; sg.shadowBlur = isNew ? 34 : 12;
      const tile = ch ? letterTilesSmall[ch] : symbolImages.wild; if (tile) sg.drawImage(tile, -84, -84, 168, 168); sg.shadowBlur = 0;
      round(sg, 34, 36, 70, 40, 14, GOLD, INK, 3); text(sg, `${v}×`, 69, 56, 22, INK, 'Arial', 'center', '900');
      if (isNew && age < 500 && !RM()) { sg.globalAlpha = 1 - age / 500; sg.lineWidth = 6; sg.strokeStyle = GOLD; sg.beginPath(); sg.arc(0, 0, 90 + age / 4, 0, 7); sg.stroke(); }
      sg.restore();
    } else {
      sg.save(); sg.globalAlpha = appear * .9; round(sg, x, y, w, h, 18, '#1a0b38', '#c084fc44', 2); text(sg, ch || '★', x + w / 2, y + h / 2, 72, '#c084fc2e', 'Arial Black, Arial', 'center', '900'); sg.restore();
    }
  });
  const k = fr.cells.filter(Boolean).length, left = fr.left, flash = scene.resetFlash && now - scene.resetFlash < 900 && left === 3;
  sg.save(); sg.shadowColor = flash ? GOLD : ACCENT; sg.shadowBlur = flash ? 30 : 12; round(sg, 470, RY - 30, 460, 52, 26, '#1a0b38f2', flash ? GOLD : ACCENT, 3); sg.restore();
  text(sg, `SPELL IT · ${k}/15 · RESPINS`, 655, RY - 4, 20, '#f4ecff', 'Arial', 'center', '900');
  for (let d = 0; d < 3; d++) { sg.beginPath(); sg.arc(840 + d * 28, RY - 4, 10, 0, 7); sg.fillStyle = d < left ? (flash ? '#fff' : GOLD) : '#3a2366'; sg.fill(); }
}
function drawJackpotShow(now, t, amount) {
  sg.save(); sg.fillStyle = 'rgba(8,2,20,.88)'; sg.fillRect(0, 0, 1400, 960);
  if (!RM()) { sg.translate(700, 470); sg.rotate(now / 3000); for (let k = 0; k < 16; k++) { sg.rotate(Math.PI / 8); sg.fillStyle = k % 2 ? '#ffd76a14' : '#c084fc14'; sg.beginPath(); sg.moveTo(0, 0); sg.lineTo(-90, -900); sg.lineTo(90, -900); sg.fill(); } }
  sg.restore();
  if (img.herd) { sg.save(); sg.globalAlpha = .26; sg.beginPath(); sg.roundRect(250, 250, 900, 560, 40); sg.clip(); const im = img.herd, k = Math.max(900 / im.width, 560 / im.height); sg.drawImage(im, 700 - im.width * k / 2, 530 - im.height * k / 2, im.width * k, im.height * k); sg.restore(); }
  if (scene.stage === 'outro') { if (!RM() && Math.random() < .08) burst(200 + Math.random() * 1000, 120 + Math.random() * 200, 14, 'confetti', 1); return; }
  sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 40; crown(sg, 700, 120, 150); fitText(sg, 'FULL MOONEEB', 700, 230, 96, 1200, '#fff3c0', '900'); sg.restore();
  const per = quick() ? 180 : 650;
  for (let i = 0; i < 5; i++) { const on = (now - scene.t0) > 300 + i * per || scene.stage === 'outro', y = 330 + i * 72, w = 300 + i * 110;
    if (on && !scene['rung' + i]) { scene['rung' + i] = true; ladderGlow[i] = 1; if (scene.stage === 'play') { stab([392 * (1 + i * .12), 493.88 * (1 + i * .12), 587.33 * (1 + i * .12)], 0, .05 + i * .01); burst(700, y, 18, i === 4 ? 'coin' : 'star', 1); } }
    sg.save(); sg.shadowColor = i === 4 ? GOLD : ACCENT; sg.shadowBlur = on ? 34 : 0; round(sg, 700 - w / 2, y - 28, w, 56, 28, on ? (i === 4 ? lin(sg, 0, y - 28, 0, y + 28, ['#fff1a8', '#f5a524']) : '#7b5cff') : '#1a0b38', on ? '#fff' : '#c084fc44', 3); sg.restore();
    text(sg, RUNGS[i], 700, y + 1, 32, on ? (i === 4 ? INK : '#fff') : '#6b5a94', 'Arial', 'center', '900'); }
  const shown = amount * ease(clamp((now - scene.t0 - 400) / (quick() ? 900 : 3200)));
  sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 30; text(sg, `${fmt(Math.floor(shown))} LAYR`, 700, 740, 64, '#ffffff', 'Arial', 'center', '900'); sg.restore();
  if (!RM() && Math.random() < .12) burst(200 + Math.random() * 1000, 150 + Math.random() * 300, 20, Math.random() < .5 ? 'confetti' : 'star', 1);
}
function drawCoin(now, face, spinT) {
  const cx = 700, cy = RY + 250, r = 120, flip = spinT == null ? Math.sin(now / 600) * .2 + 1 : Math.cos(spinT * Math.PI * 10) , sx = Math.max(.05, Math.abs(flip)), show = spinT == null ? 'moo' : flip >= 0 ? face : (face === 'moo' ? 'moon' : 'moo');
  sg.save(); sg.translate(cx, cy - (spinT != null && !RM() ? Math.sin(clamp(spinT) * Math.PI) * 120 : 0)); sg.scale(sx, 1);
  sg.shadowColor = GOLD; sg.shadowBlur = 30; sg.beginPath(); sg.arc(0, 0, r, 0, 7); sg.fillStyle = rad(sg, -30, -40, 10, 160, ['#fff4b0', '#ffcd3c', '#c98418']); sg.fill(); sg.lineWidth = 10; sg.strokeStyle = INK; sg.stroke(); sg.shadowBlur = 0;
  sg.beginPath(); sg.arc(0, 0, r - 18, 0, 7); sg.setLineDash([4, 9]); sg.lineWidth = 4; sg.strokeStyle = '#9a5f12'; sg.stroke(); sg.setLineDash([]);
  const im = show === 'moo' ? img.moo : img.moon; if (im) { sg.save(); sg.beginPath(); sg.arc(0, 0, r - 22, 0, 7); sg.clip(); sg.drawImage(im, -(r - 22), -(r - 22), 2 * (r - 22), 2 * (r - 22)); sg.restore(); }
  sg.restore();
}
function drawOutro(now) {
  const s = scene, k = s.kind, a = clamp((now - s.t0) / 300), cnt = ease(clamp((now - s.count0) / dur('outroCount')));
  let title = '', total = 0, lines = [], color = (SCENE[k] || {}).color || GOLD;
  if (k === 'free') { const r = s.data.summary || { total: state.freeTotal, count: state.freeCount }; title = 'MOONSHOT LANDED'; total = r.total; lines = [`${r.count} MOONSHOT SPINS PLAYED · ALL WINS 2×`, 'INCLUDES ANY BAGS OR SPELL IT WON ON THE WAY']; }
  if (k === 'vault') { const f = s.f; total = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; title = 'MOONEY BAGS OPENED'; lines = [`3 BAGS OPENED: ${f.picks.map(i => f.awards[i] + '×').join(' + ')} TOTAL BET`]; }
  if (k === 'chain') { const f = s.f; total = f.sum * f.bet; const n = f.frames[f.frames.length - 1].cells.filter(Boolean).length; title = f.full ? 'SPELLED IT! ALL 15' : 'SPELL IT COMPLETE'; lines = [`${n}/15 CELLS LOCKED · ${f.frames.length - 1} RESPINS PLAYED`, f.full ? 'FULL BOARD: THE FULL MOONEEB JACKPOT FOLLOWS' : `${fmt(f.sum)}× TOTAL BET`]; }
  if (k === 'jackpot') { title = 'FULL MOONEEB!'; total = s.data.amount; lines = [s.data.source === 'chain' ? 'SPELLED ALL 15 LETTERS' : 'FIVE MOONEEBS ON THE CENTRE ROW', 'THE METER RESETS TO 500× THIS BET']; color = GOLD; }
  if (k === 'gamble') { const r = s.result; title = r.win ? `${s.choice === 'moo' ? 'MOO' : 'MOON'}! DOUBLED` : `${r.parity === 'odd' ? 'MOO' : 'MOON'}. NOT THIS TIME`; total = r.amount; lines = [r.win ? `YOUR ${fmt(r.stake)} WIN IS NOW ${fmt(r.amount)}` : `THE ${fmt(r.stake)} WIN IS LOST · THE REST OF YOUR LAYR IS UNTOUCHED`, `HASH ENDS IN ${r.hash.at(-1)}: ${r.parity === 'odd' ? 'MOO' : 'MOON'}`]; }
  sg.save(); sg.globalAlpha = a; sg.fillStyle = 'rgba(8,2,20,.6)'; sg.fillRect(RX, RY, RW, RH);
  drawPanel(250, RY + 40, 900, 400, color);
  sg.save(); sg.shadowColor = color; sg.shadowBlur = 20; fitText(sg, title, 700, RY + 110, 54, 820, '#fff8e0', '900'); sg.restore();
  text(sg, `${fmt(Math.floor(total * cnt * 100) / 100)} LAYR`, 700, RY + 210, 74, GOLD, 'Arial', 'center', '900');
  lines.forEach((l, i) => fitText(sg, l, 700, RY + 290 + i * 34, 20, 820, '#d6c8ee', '800'));
  sg.restore();
  const label = k === 'vault' || k === 'chain' ? 'COLLECT' : 'BACK TO THE REELS';
  if (a >= 1) screenButton('primary', label, 520, RY + 470, 360, 78, primaryAction, 'gold');
}
function drawScene(now) {
  const s = scene, k = s.kind, t = (now - s.t0) / 1000, cfg = SCENE[k] || {};
  if (s.stage === 'trigger') {
    if (k === 'chain' || k === 'vault' || k === 'free' || k === 'retrigger' || (k === 'jackpot' && s.data.source === 'line')) {
      if (freeMode) drawStarfield(now); const lf = liftFor(k), up = RM() ? 0 : 14 + Math.sin(now / 120) * 8, sc = RM() ? 1 : 1.08 + Math.sin(now / 160) * .05;
      drawReels(now, { lift: lf ? (c, r) => lf(c, r) ? { up, scale: sc, color: cfg.color } : null : null, dim: .55 });
    } else if (k !== 'gamble') drawReels(now, { dim: .4 });
    const sub = k === 'free' ? `${s.data.scatters || 3} ROCKETS · ${s.data.award || 8} FREE SPINS · ALL WINS 2×` : k === 'retrigger' ? `+${s.data.award} MOONSHOTS · UP TO 24` : k === 'vault' ? 'NINE MOONEY BAGS · OPEN THREE' : k === 'chain' ? `${s.f.frames[0].cells.filter(Boolean).length} LETTERS LOCKED · SPELL MOONEEB` : k === 'jackpot' ? 'THE WHOLE LADDER LIGHTS UP' : 'CALL THE COIN';
    if (k === 'gamble') { drawReels(now, { dim: .6 }); const u = RM() ? 1 : ease(clamp((now - s.t0) / 650)); sg.save(); sg.translate((1 - u) * 760, 0); sg.translate(700, RY + 250); sg.rotate((1 - u) * 6); sg.translate(-700, -(RY + 250)); drawCoin(now, 'moo', null); sg.restore(); }
    else drawTitleCard(now, cfg.title.toUpperCase() + '!', sub, cfg.color, t);
    if (k === 'gamble') text(sg, 'MOO OR MOON?', 700, RY + 470, 54, '#fff8e0', 'Arial', 'center', '900');
    const d = k === 'retrigger' ? dur('retrigger') : k === 'gamble' ? 700 : dur('trigger');
    if (now - s.t0 > d) { if (k === 'retrigger') { scene = null; hideBar(); flow(); } else setStage('intro'); }
    else screenButton('skipTrig', 'CONTINUE', 1110, RY + RH - 70, 220, 56, primaryAction, 'ghost');
    return;
  }
  if (k === 'free') {
    if (s.stage === 'intro') { const it = clamp(t / (RM() ? .3 : 1.6)); drawStarfield(now, it, 2.5); if (!RM()) { sg.save(); sg.globalAlpha = 1 - it; sg.translate(0, -it * 200); drawReels(now); sg.restore(); }
      if (img.rocket) { const u = clamp(t / 2), rx = RX + 60 + u * (RW - 200), ry = RY + RH - 80 - u * (RH - 120); sg.drawImage(img.rocket, rx - 70, ry - 70, 140, 140); }
      drawRuleCard(now, s.data.resumed ? 'Moonshot · carry on' : 'Moonshot', `${state.free} free spins. Every win pays 2×. Twins float by.`, t, '#6fe3ff');
      if (t > .5) screenButton('primary', s.data.resumed ? 'CARRY ON' : 'LIFT OFF', 520, RY + RH - 10 - 64, 360, 72, primaryAction, 'gold'); if (img.astronaut) { const ax = RX + 180 + Math.sin(now / 1500) * 20, ay = RY + 150 + Math.cos(now / 1300) * 14; sg.save(); sg.translate(ax, ay); sg.rotate(Math.sin(now / 1700) * .12); sg.shadowColor = '#6fe3ff'; sg.shadowBlur = 30; sg.beginPath(); sg.arc(0, 0, 112, 0, 7); sg.fillStyle = '#0b1f3a'; sg.fill(); sg.shadowBlur = 0; sg.beginPath(); sg.arc(0, 0, 106, 0, 7); sg.clip(); sg.drawImage(img.astronaut, -106, -106, 212, 212); sg.restore(); } else drawCowHelmet(RX + 170, RY + 150, .6, Math.sin(now / 900) * .2); }
    else if (s.stage === 'outro') { drawStarfield(now); drawReels(now); drawOutro(now); }
    return;
  }
  if (k === 'vault') {
    const f = s.f;
    if (s.stage === 'intro') { const it = clamp(t / 1.2); drawMoonlitField(now, it); drawBags(now, f, it); drawRuleCard(now, 'Mooney Bags', cfg.rule, t, GOLD); if (t > .5) screenButton('primary', 'OPEN THE BAGS', 520, RY + RH - 82, 360, 72, primaryAction, 'gold'); }
    else if (s.stage === 'play') { drawMoonlitField(now); drawBags(now, f); round(sg, 500, RY - 30, 400, 52, 26, '#1a0b38f2', GOLD, 3); const tot = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; text(sg, f.picks.length < 3 ? `OPEN ${3 - f.picks.length} · ${fmt(tot)} LAYR` : `${fmt(tot)} LAYR`, 700, RY - 4, 21, '#fff3c0', 'Arial', 'center', '900'); }
    else { drawMoonlitField(now); drawBags(now, f); drawOutro(now); }
    return;
  }
  if (k === 'chain') {
    const f = s.f;
    if (s.stage === 'intro') { drawSpellBoard(now, f, clamp(t / 1.2)); drawRuleCard(now, 'Spell It', cfg.rule, t, '#f4e3b8'); if (t > .5) screenButton('primary', 'START SPELLING', 520, RY + RH - 82, 360, 72, primaryAction, 'gold'); }
    else if (s.stage === 'play') { drawSpellBoard(now, f); if (!G.featureDone(f)) { screenButton('primary', 'RESPIN', 1130, RY + RH - 66, 200, 56, primaryAction, 'gold'); if (now - s.lastStep > dur('respin')) doRespin(); } }
    else { drawSpellBoard(now, f); drawOutro(now); }
    return;
  }
  if (k === 'jackpot') {
    if (s.stage === 'intro') { drawReels(now, { dim: .5 }); drawTitleCard(now, 'FULL MOONEEB', 'THE WHOLE LADDER LIGHTS, M TO MOONEEB', GOLD, 1); round(sg, 380, RY + 424, 640, 50, 25, '#12062cf0', '#ffd76a88', 2); text(sg, cfg.rule, 700, RY + 449, 22, '#f4ecff', 'Arial', 'center', '800'); if (t > .4) screenButton('primary', 'LIGHT THE LADDER', 500, RY + RH - 86, 400, 74, primaryAction, 'gold'); }
    else if (s.stage === 'play') { drawJackpotShow(now, t, s.data.amount); if (now - s.t0 > dur('jackpotPlay')) setStage('outro'); }
    else { drawJackpotShow(now, t, s.data.amount); drawOutro(now); }
    return;
  }
  if (k === 'gamble') {
    drawReels(now, { dim: .7 });
    if (s.stage === 'intro') { drawCoin(now, 'moo', null); text(sg, 'MOO OR MOON?', 700, RY + 432, 50, '#fff8e0', 'Arial', 'center', '900'); fitText(sg, `${fmt(s.data.stake)} LAYR RIDES ON ONE CALL`, 700, RY + 478, 22, 800, GOLD, '800');
      screenButton('callMoo', 'MOO', 330, RY + RH - 80, 240, 70, () => callGamble('moo'), 'gold', 'COW SIDE'); screenButton('callMoon', 'MOON', 830, RY + RH - 80, 240, 70, () => callGamble('moon'), 'moon', 'MOON SIDE'); screenButton('keep', 'KEEP', 600, RY + RH - 74, 200, 58, keepWin, 'ghost'); }
    else if (s.stage === 'play') { const u = clamp((now - s.t0) / dur('flip')); drawCoin(now, s.result.parity === 'odd' ? 'moo' : 'moon', RM() ? 1 : u); text(sg, `YOU CALLED ${s.choice.toUpperCase()}`, 700, RY + 470, 30, '#e3d4ff', 'Arial', 'center', '900'); }
    else { drawCoin(now, s.result.parity === 'odd' ? 'moo' : 'moon', 1); drawOutro(now); }
  }
}
