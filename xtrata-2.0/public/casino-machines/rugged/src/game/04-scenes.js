
/* ---------- Bonus presentation: every bonus, the jackpot and the gamble in four stages ----------
   trigger → intro → play → outro. The engine has already dealt every result before a scene starts; scenes only reveal.
   Skip jumps to the outro with the same total. Turbo shortens every animation; reduced motion swaps movement for fades. */
const TITLES = { free: '404', vault: 'UNROLL', chain: 'FULLY WOVEN', jackpot: 'MAGIC CARPET RIDE', gamble: 'PULL OR HOLD' };
const RULES = { free: 'Eight free spins. The art link is dead, so every spin weaves a rescued rug back in. All wins pay 2×; more broken frames add four.', vault: 'Nine rolled rugs in the stall. Unroll three: each is a rescued rug with a prize.', chain: 'Each knot ties a band into the loom. Any new knot resets your three respins. Weave all 15 bands to finish the rug and ride the Magic Carpet.', jackpot: 'Five Flying Carpets on the centre row. The rug lifts off and takes you round the bazaar.', gamble: '' };
const TRIGGER_SYM = { free: 'scatter', vault: 'vault', chain: 'chain' };
const motionOK = () => !state.reduced && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const speed = () => state.turbo ? .4 : 1;
const ease = t => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
let sceneQueue = [], hits = [], airdrop = null;
// Stings for the scenes, all from the bazaar's own voices: the pluck, the darbuka, the loom and the crowd.
function sfx(kind, i = 0) { audioInit(); if (!ac || state.muted) return;
  if (kind === 'sting-free') { tone(880, .12, 'square', .05); tone(440, .22, 'square', .05, .13); for (let k = 0; k < 6; k++) noise(.04, 2000 + k * 900, 4, .14, .3 + k * .05); phrase([7, 6, 4, 2, 1, 0], .08, .3, .05, .65); } // an error chime, static, then the loom takes over
  if (kind === 'sting-vault') { hubbub(1.4, 1); phrase([0, 2, 3, 4, 6, 7], .09, .4, .06, .2); dum(.2); tek(.4); }
  if (kind === 'sting-chain') { clack(0, 1); clack(.16, 3); clack(.32, 5); thud(.5, 1); phrase([0, 3, 4, 7], .08, .45, .05, .5); }
  if (kind === 'sting-jackpot') { whoosh(1.4, 1.2); phrase([0, 2, 3, 4, 6, 7, 9, 11], .09, .6, .07, .3); for (let k = 0; k < 8; k++) (k % 3 ? tek : dum)(.3 + k * .12); coins(30, .6); hubbub(2.2, 1.3, .5); }
  if (kind === 'sting-gamble') { thud(0, .6); noise(.3, 900, 1.2, .1, .1, 2.4); }
  if (kind === 'whoosh') whoosh(.6, .8);
  if (kind === 'crack') { noise(.5, 260, 1, .16, 0, 7); tek(.05, .08); tone(220 + i * 20, .25, 'triangle', .05, .1); } // a rug unrolling: a long swish
  if (kind === 'reveal-big') { phrase([4, 6, 7, 9, 11], .06, .5, .07); coins(14, .1); hubbub(1, .8, .1); }
  if (kind === 'stamp') { thud(0, .9); pluck(392, .3, .05, .02); } // a knot tied tight
  if (kind === 'reset') { pluck(1174.7, .2, .05); pluck(1479.98, .25, .04, .08); }
  if (kind === 'tick') pluck(880 + (i % 6) * 40, .06, .02);
  if (kind === 'roll') noise(.025, 2600, 5, .07); // the shuttle running through the shed
  if (kind === 'land') { thud(0, .7); tek(.08); }
  if (kind === 'summary') phrase([4, 6, 7], .08, .45, .06);
  if (kind === 'miss') { noise(.12, 700, 1.5, .1, 0, .6); tone(150 - i * 4, .14, 'triangle', .05); } // the shuttle passes and nothing catches
  if (kind === 'beat') dum(0, .14);
  if (kind === 'charge') { for (let k = 0; k < 3 + 3 * (i > 0); k++) tek(k * .07, .05 + k * .01); noise(.3 + .12 * i, 600, 1.5, .05, 0, 2); }
  if (kind === 'tug') { thud(0, .5); noise(.12, 1400, 2, .12, .02); }
  if (kind === 'slide') { whoosh(.7, 1); }
}
let musicTimer = 0;
// The ride's music: a Hijaz line over a darbuka pattern (dum tek tek dum tek).
function jackpotMusic(on) { clearInterval(musicTimer); musicTimer = 0; if (!on) return; let k = 0; const seq = [0, 1, 2, 3, 4, 3, 2, 1, 2, 4, 6, 7, 6, 4, 3, 2], beat = 'dttdt-t-';
  musicTimer = setInterval(() => { if (!ac || state.muted) return; const n = seq[k % seq.length], b = beat[k % beat.length]; pluck(HIJAZ[n] * 2, .3, .05); if (k % 4 === 0) pluck(HIJAZ[n] / 2, .6, .05); if (b === 'd') dum(0, .14); if (b === 't') tek(0, .07); k++; }, state.turbo ? 100 : 160); }

// The triggering cells, read from the settled grid.
function cellsOf(sym, centreOnly = false) { const out = []; state.grid.forEach((col, c) => col.forEach((s, r) => { if (s === sym && (!centreOnly || r === 1)) out.push([c, r]); })); return out; }
function startScene(kind, data = {}, stage = 'trigger') {
  stopAuto(); hideBar(); scene = { kind, stage, t0: performance.now(), data, reveal: {}, stampAt: {}, resetAt: 0, lastLeft: 3 };
  if (kind === 'jackpot' && !scene.data.bird) scene.data.bird = jackpotBird();
  if (stage === 'trigger') { sfx(`sting-${kind}`); if (motionOK() && kind !== 'gamble') particles(kind === 'jackpot' ? 90 : 30); }
  if (kind === 'jackpot' && stage !== 'outro') jackpotMusic(false);
  labSeen(kind, stage); status(`${TITLES[kind]}${stage === 'trigger' ? '!' : ''}`); renderBar(); update();
}
function nextScene() { scene = null; jackpotMusic(false); hideBar(); const n = sceneQueue.shift(); if (n) { startScene(n.kind, n.data || {}, n.stage || 'trigger'); return; }
  if (feature()) { startScene(feature().type, {}, 'intro'); return; }
  // A spin still pending ends the 404 feature itself in finishSpin; ending it here would race the engine.
  if (state.freeActive && !state.free) { if (spinning || state.pending) { update(); return; } airdropOutro(); return; }
  if (state.free > 0) { status(`${state.free} 404 SPINS · ALL WINS 2×`); renderBar(); update(); scheduleFree(); return; }
  update(); scheduleAuto();
}
function setStage(stage) { if (!scene) return; scene.stage = stage; scene.t0 = performance.now(); labSeen(scene.kind, stage); if (stage === 'intro') sfx('whoosh'); if (stage === 'outro') sfx('summary'); if (scene.kind === 'jackpot') jackpotMusic(stage === 'play'); renderBar(); update(); }
const TRIGGER_MS = () => (motionOK() ? 2300 : 1400) * speed();
// The primary action: one button drives every stage (Spin, Space, the cabinet's WEAVE, the fullscreen bar).
function primaryAction() {
  if (!scene) { if (feature()) { startScene(feature().type, {}, 'intro'); return; } if (state.freeActive && !state.free) { airdropOutro(); return; } spin(); return; }
  const { kind, stage } = scene;
  if (stage === 'trigger') { setStage('intro'); return; }
  if (stage === 'intro') { if (kind === 'gamble') return; if (kind === 'free') { airdrop = { t0: performance.now(), retriggers: 0, best: 0, woven: [], spinAt: 0 }; scene = null; renderBar(); update(); spin(); return; } setStage('play'); return; }
  if (stage === 'play') { if (kind === 'vault') { const f = feature(); if (f && E.featureDone(f)) collectScene(); else toast('Unroll three rugs.'); return; } if (kind === 'chain') { featureAction(); return; } if (kind === 'jackpot') { setStage('outro'); return; } if (kind === 'gamble' && scene.data.landed) setStage('outro'); return; }
  if (stage === 'outro') nextScene();
}
function primaryLabel(broke) {
  if (!scene) { if (feature()) return 'CONTINUE'; if (state.freeActive && !state.free) return 'SUMMARY'; return state.free ? 'WEAVE 404' : broke ? 'GET LAYR' : 'WEAVE'; }
  const { kind, stage } = scene, f = feature();
  if (stage === 'trigger') return 'CONTINUE'; if (stage === 'intro') return kind === 'gamble' ? 'CALL IT' : kind === 'jackpot' ? 'RIDE' : 'START';
  if (stage === 'play') { if (kind === 'vault') return f && E.featureDone(f) ? 'COLLECT' : `UNROLL ${f ? 3 - f.picks.length : 0}`; if (kind === 'chain') return chainBusy() ? 'WEAVING…' : f && E.featureDone(f) ? 'COLLECT' : 'RESPIN'; if (kind === 'jackpot') return 'SUMMARY'; return scene.data.landed ? 'CONTINUE' : 'TUGGING'; }
  return 'CONTINUE';
}
const canSkip = () => (!scene && state.freeActive && !spinning) || !!scene && scene.stage !== 'outro' && !(scene.kind === 'gamble' && scene.stage === 'play' && !scene.data.result);
// Skip: resolve everything the engine already dealt, instantly, and land on the outro with the same total.
function skipScene() {
  if (!scene && state.freeActive && !spinning && !locked()) { clearTimeout(scheduleFree.t); runFreeInstantly(); airdropOutro(true); return; }
  if (!scene || locked()) return; const { kind, stage } = scene;
  if (kind === 'gamble') { if (stage !== 'play') { keepWin(); return; } scene.t0 -= 99999; setStage('outro'); return; }
  if (kind === 'jackpot') { setStage('outro'); return; }
  if (kind === 'free') { if (spinning || state.pending) return; runFreeInstantly(); airdropOutro(true); return; }
  const f = feature(); if (!f) { nextScene(); return; }
  if (kind === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) if (!f.picks.includes(i)) { E.pick(state, i); scene.reveal[i] = 0; } save(); }
  if (kind === 'chain') { scene.spin = null; while (!E.featureDone(f)) E.respin(state); save(); }
  collectScene(true);
}
// Free spins played with no animation: each one is still a full engine round (start, settle, features), committed one by one.
function runFreeInstantly() {
  airdrop = airdrop || { t0: performance.now(), retriggers: 0, best: 0, woven: [], spinAt: 0 };
  for (let guard = 0; guard < 200 && (state.free > 0 || feature()); guard++) {
    if (feature()) { const f = feature(); if (f.type === 'vault') { for (let i = 0; i < 9 && f.picks.length < 3; i++) if (!f.picks.includes(i)) E.pick(state, i); } else while (!E.featureDone(f)) E.respin(state); const c = E.collect(state); if (c && c.jackpotWin) sceneQueue.push({ kind: 'jackpot', data: { amount: c.jackpotWin }, stage: 'outro' }); continue; }
    const p = E.start(state, lab.on ? labRng() : undefined); faces = p.grid.map(col => col.map(pickFace)); const r = E.settle(state); recordCameos(r); weaveBack();
    if (r.triggers.free) airdrop.retriggers++; airdrop.best = Math.max(airdrop.best, r.total); if (r.jackpotWin) sceneQueue.push({ kind: 'jackpot', data: { amount: r.jackpotWin }, stage: 'outro' });
  }
  lastResult = null; save();
}
// Each 404 spin weaves one rescued rug back in (cosmetic: which rug is chosen with Math.random, after the spin is dealt).
function weaveBack() { if (!airdrop) return; const l = birdList(); if (l.length) airdrop.woven.push(l[Math.floor(Math.random() * l.length)]); airdrop.spinAt = performance.now(); }
function airdropOutro(skipped = false) { const r = E.endFree(state); if (!r) { if (spinning || state.pending) { update(); return; } if (sceneQueue.length || feature()) nextScene(); else { scene = null; update(); } return; } save(); startScene('free', { total: r.total, count: r.count, retriggers: airdrop ? airdrop.retriggers : 0, best: airdrop ? airdrop.best : 0, woven: airdrop ? airdrop.woven.slice(-24) : [], skipped }, 'outro'); sfx('summary'); airdrop = null; }
function collectScene(skipped = false) {
  const f = feature(); if (!f) return; const picks = f.type === 'vault' ? f.picks.map(i => f.awards[i]) : null, cells = f.type === 'chain' ? f.frames[f.index].cells.filter(Boolean).length : 0, respins = f.type === 'chain' ? f.frames.length - 1 : 0, bird = f.type === 'chain' ? loomBird(f) : null;
  const c = E.collect(state); if (!c) return; save(); winUntil = performance.now() + 4000;
  if (!skipped) { sound(c.amount >= f.bet * 20 ? 'big' : 'win'); particles(c.amount >= f.bet * 25 ? 70 : 30); }
  if (c.jackpotWin) sceneQueue.unshift({ kind: 'jackpot', data: { amount: c.jackpotWin, fromGrab: true, bird } });
  if (!scene || scene.kind !== f.type) startScene(f.type, {}, 'outro');
  scene.data = { ...scene.data, total: c.amount - c.jackpotWin, jackpot: c.jackpotWin, picks, cells, respins, bet: f.bet, skipped, bird, roundId: f.roundId }; setStage('outro');
  status(`${TITLES[f.type]} · ${fmt(c.amount)} LAYR`);
}
// ---------- Fully Woven: every respin is an event, not just a result ----------
// The engine has already dealt the respin. The scene then plays it out: the shuttle runs through every bare band, stopping one by one
// (a hit ties its knots in with a thud, a miss leaves the warp bare), the last band holds longer when it matters, and the respin lamps follow.
const chainBusy = () => !!(scene && scene.spin && performance.now() < scene.spin.end);
function startRespin(f, prevCells, before, fr) {
  const now = performance.now(), sp = speed(), mo = motionOK(), added = new Set(fr.added), empties = prevCells.map((v, i) => v ? -1 : i).filter(i => i >= 0);
  const after = empties.length - added.size, tense = mo && (before === 1 || empties.length <= 2), fill = after === 0 && added.size > 0;
  const base = (mo ? 760 : 240) * sp, gap = (mo ? 85 : 0) * sp, landAt = {};
  empties.forEach((i, k) => { landAt[i] = now + base + k * gap; });
  if (tense && empties.length) landAt[empties[empties.length - 1]] += (empties.length === 1 ? 1000 : 650) * sp; // the last band holds its shuttle
  const lastLand = Math.max(...Object.values(landAt), now), hitTimes = [...added].map(i => landAt[i]), firstHit = hitTimes.length ? Math.min(...hitTimes) : 0;
  const RS = { t0: now, landAt, added, prevCells, before, n: f.frames.length - 1, tense, fill, firstHit, lastLand, end: lastLand + (mo ? (fill ? 900 : 480) : 200) * sp, left: fr.left };
  scene.spin = RS; scene.resetAt = added.size ? firstHit : scene.resetAt; added.forEach(i => { scene.stampAt[i] = landAt[i]; });
  const later = fn => (delay) => setTimeout(() => { if (scene && scene.spin === RS) fn(); }, Math.max(0, delay));
  sound('respin'); if (tense) later(() => sound('antic'))(80);
  empties.forEach((i, k) => later(() => sfx(added.has(i) ? 'stamp' : 'miss', k))(landAt[i] - now));
  if (tense && mo) for (let t = base * .7; now + t < lastLand; t += 260 * sp) later(() => sfx('beat'))(t);
  if (added.size) { if (before < 3) later(() => sfx('reset'))(firstHit - now + 220 * sp); if (mo) later(() => particles(added.size * 5))(firstHit - now); }
  if (fill) later(() => { sfx('reveal-big'); if (mo) particles(60); })(lastLand - now + 120 * sp);
  later(() => { renderBar(); update(); })(RS.end - now + 30);
}
function chainMsg(f, now) { const RS = scene.spin, fr = f.frames[f.index];
  const lb = loomBird(f); if (!RS) return `ON THE LOOM: BITCOIN BIRD #${lb ? lb.id : '?'} · ${fr.left} RESPIN${fr.left === 1 ? '' : 'S'} LEFT`;
  if (now < RS.lastLand) return RS.before === 1 ? 'FINAL RESPIN · HOLD ON…' : `RESPIN ${RS.n} · THE SHUTTLE RUNS…`;
  if (RS.fill) return 'FULLY WOVEN · THE CARPET LIFTS!';
  if (RS.added.size) return `+${RS.added.size} BAND${RS.added.size > 1 ? 'S' : ''} TIED${RS.before < 3 ? ' · RESPINS RESET TO 3' : ''}`;
  return E.featureDone(f) ? 'NO NEW KNOT · OFF THE LOOM' : `NO NEW KNOT · ${fr.left} RESPIN${fr.left === 1 ? '' : 'S'} LEFT`; }
// Bonus actions (also used by the feature bar, the screen and the keyboard).
function featureAction() { const f = feature(); if (!f || spinning || locked()) return; if (!scene) { startScene(f.type, {}, 'intro'); return; } if (scene.stage !== 'play') { primaryAction(); return; }
  if (E.featureDone(f)) { collectScene(); return; }
  if (f.type === 'chain') { if (chainBusy()) return; const prev = f.frames[f.index], before = prev.left, prevCells = prev.cells.slice(); const fr = E.respin(state); save(); chainFlash = performance.now(); startRespin(f, prevCells, before, fr); renderBar(); update(); }
  else toast('Unroll three rugs first.'); }
const vaultCharge = m => motionOK() ? (m >= 8 ? 650 : 280) * speed() : 0; // a rug shakes before it unrolls; the big ones hold longer
function pickVault(i) { if (locked() || !scene || scene.kind !== 'vault' || scene.stage !== 'play') { if (scene && scene.kind === 'vault' && scene.stage === 'intro') setStage('play'); else return; } const f = feature(); if (!f) return; const r = E.pick(state, i); if (!r) return; save(); scene.reveal[i] = performance.now(); const ch = vaultCharge(r.multiple); if (ch) sfx('charge', r.multiple >= 8 ? 1 : 0); setTimeout(() => sfx('crack', i), ch); if (r.multiple >= 8) setTimeout(() => sfx('reveal-big'), ch + 620 * speed()); else setTimeout(() => sound('pick', i), ch + 560 * speed()); renderBar(); update(); }
function keepWin() { state.gamble = 0; save(); scene = null; hideBar(); toast('Win kept in your balance.'); update(); }
// PULL is a call on the engine's odd draw, HOLD on its even draw, so the engine's own 50/50 decides.
function callGamble(choice) { if (!scene || scene.kind !== 'gamble' || scene.stage !== 'intro' || locked()) return; const r = E.gamble(state, choice, lab.on ? labGambleRng(choice) : undefined); if (!r) { scene = null; update(); return; } save(); scene.data.result = { ...r, choice }; setStage('play'); }
function openGamble() { if (locked() || !state.gamble || busy()) return; if (state.gamble > state.balance) { toast('Insufficient LAYR in the shared account.'); return; } startScene('gamble', { stake: state.gamble, bird: birdBySeed(hashStr('g' + state.spins)) }); }
const callName = c => c === 'odd' ? 'PULL' : 'HOLD';

/* ---------- Scene drawing (all inside the cabinet screen, so the room, the screen view and fullscreen all show it) ---------- */
function button(label, x, y, w, h, fn, primary = true) { round(sg, x, y, w, h, 14, primary ? lin(sg, x, y, x, y + h, [BRASS_HI, BRASS, '#8a5a14']) : '#2a1408e8', primary ? '#3a2306' : BRASS, 3); text(sg, label, x + w / 2, y + h / 2 + 1, primary ? 28 : 22, primary ? '#2a1404' : WOOL, 'Arial', 'center', '900'); hits.push({ x, y, w, h, fn }); }
// On the full-width grids (the stall and the loom) the chip sits just under the screen so it never covers a rug.
function skipChip() { if (!canSkip()) return; const low = scene && scene.stage === 'play' && (scene.kind === 'vault' || scene.kind === 'chain'); button('SKIP ›', RX + RW - 150, low ? RY + RH + 8 : RY + 14, 136, low ? 48 : 50, skipScene, false); }
const cameoLabel = it => !it ? '' : it.bird ? `BITCOIN BIRDS #${it.id} · XTRATA ${it.xtrataId}` : it.num;
// The jackpot's carpet: the Flying Carpet on the centre row (its bird), else a bird chosen for the show.
function jackpotBird() { const c = cellsOf('bitcoin', true)[0], it = c ? itemFor('bitcoin', faces[c[0]][c[1]]) : null; return (it && it.bird) || birds.get(0) || birdList()[0] || null; }
// The dead page the 404 opens on: a browser window showing the real art link from the collection's contract.
function deadPage(x, y, w, h, glitch = 0, now = 0) { sg.save(); sg.beginPath(); sg.rect(x, y, w, h); sg.clip();
  sg.fillStyle = '#ece8df'; sg.fillRect(x, y, w, h); sg.fillStyle = '#d6d0c4'; sg.fillRect(x, y, w, 46); for (let i = 0; i < 3; i++) { sg.fillStyle = ['#c9533f', '#d9a441', '#6a9a5a'][i]; sg.beginPath(); sg.arc(x + 22 + i * 20, y + 23, 7, 0, 7); sg.fill(); }
  round(sg, x + 90, y + 10, w - 110, 26, 13, '#fff'); text(sg, DEAD.uri, x + 106, y + 24, fitSize(sg, DEAD.uri, w - 140, 17, 9, '700', 'Courier New'), '#4a4540', 'Courier New', 'left', '700');
  const s = Math.min(w / 6, h / 3.4); text(sg, '404', x + w / 2, y + 46 + (h - 46) * .4, s, '#4a4540', 'Georgia, serif', 'center', '900'); text(sg, 'Not Found', x + w / 2, y + 46 + (h - 46) * .4 + s * .62, s * .24, '#6b645a', 'Courier New', 'center', '700');
  text(sg, 'the art link Bitcoin Birds’ contract still returns', x + w / 2, y + h - 26, Math.max(11, s * .13), '#8a8274', 'Arial', 'center', '700');
  if (glitch > 0) for (let k = 0; k < 9; k++) { const hh = 4 + (hashStr(`g${k}${Math.floor(now / 70)}`) % 26), yy = y + (hashStr(`y${k}${Math.floor(now / 90)}`) % h), dx = ((hashStr(`d${k}${Math.floor(now / 60)}`) % 80) - 40) * glitch; sg.drawImage(screen, (x + 0) * 2, yy * 2, w * 2, hh * 2, x + dx, yy, w, hh); sg.fillStyle = k % 2 ? `rgba(201,83,63,${.25 * glitch})` : `rgba(74,144,192,${.25 * glitch})`; sg.fillRect(x, yy, w, 2); }
  sg.restore(); }
function backdrop(kind, now, dim = 1) { const g = sg; g.save(); if (kind !== 'jackpot' || !scene || scene.stage !== 'play') { g.beginPath(); g.rect(RX, RY, RW, RH); g.clip(); }
  if (kind === 'free') { g.fillStyle = '#d9d4ca'; g.fillRect(RX, RY, RW, RH); g.globalAlpha = .12 * dim; for (let k = 0; k < 6; k++) text(g, '404', RX + 110 + (k % 3) * 440, RY + 140 + Math.floor(k / 3) * 290, 200, '#4a4540', 'Georgia, serif', 'center', '900'); g.globalAlpha = 1;
    if (motionOK()) { g.fillStyle = '#0000000c'; for (let y = RY + (now / 20) % 6; y < RY + RH; y += 6) g.fillRect(RX, y, RW, 2); } }
  if (kind === 'vault') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#2a160c', '#3a1f10', '#1d0f08']); g.fillRect(RX, RY, RW, RH); g.globalAlpha = .5 * dim; for (let r = 1; r < 3; r++) { const y = RY + r * (RH + 22) / 3 - 14; g.fillStyle = lin(g, 0, y, 0, y + 10, ['#6b4422', '#3a2010']); g.fillRect(RX, y, RW, 10); } g.globalAlpha = 1;
    for (let x = RX - 40; x < RX + RW; x += 90) { g.fillStyle = (x / 90) % 2 ? '#7c1d1440' : '#d9a44126'; g.beginPath(); g.moveTo(x, RY); g.lineTo(x + 90, RY); g.lineTo(x + 45, RY + 26); g.closePath(); g.fill(); } } // the stall's awning edge
  if (kind === 'chain') { g.fillStyle = '#1a0e08'; g.fillRect(RX, RY, RW, RH); g.globalAlpha = .45 * dim; g.strokeStyle = WOOL; g.lineWidth = 1.2; for (let x = RX + 4; x < RX + RW; x += 9) { g.beginPath(); g.moveTo(x, RY); g.lineTo(x, RY + RH); g.stroke(); } g.globalAlpha = 1; }
  if (kind === 'jackpot') { g.fillStyle = lin(g, 0, 0, 0, 960, ['#060a1e', '#141a40', '#2a1a3a', '#3a1d14']); g.fillRect(0, 0, 1400, 960); g.globalAlpha = dim;
    for (let k = 0; k < 120; k++) { const h = hashStr('st' + k), tw = motionOK() ? .5 + .5 * Math.sin(now / 300 + k) : 1; g.fillStyle = `rgba(255,246,208,${.25 + .6 * tw * ((h >>> 20) % 10) / 10})`; g.fillRect(h % 1400, (h >>> 11) % 520, 2, 2); }
    g.fillStyle = '#f6eccf'; g.beginPath(); g.arc(1180, 130, 54, 0, 7); g.fill(); g.fillStyle = '#141a40'; g.beginPath(); g.arc(1204, 116, 50, 0, 7); g.fill(); // the crescent
    g.fillStyle = '#0b0710'; let x = 0; while (x < 1400) { const h = hashStr('roof' + x), w = 60 + h % 110, top = 700 + (h >>> 8) % 120; g.fillRect(x, top, w, 960 - top); if (h % 3 === 0) { g.beginPath(); g.arc(x + w / 2, top, w * .36, Math.PI, 0); g.fill(); g.fillRect(x + w / 2 - 2, top - w * .36 - 26, 4, 26); } if (h % 7 === 0) { g.fillRect(x + w - 16, top - 140, 14, 140); g.beginPath(); g.moveTo(x + w - 18, top - 140); g.lineTo(x + w - 9, top - 170); g.lineTo(x + w, top - 140); g.fill(); } x += w; } // bazaar rooftops
    for (let k = 0; k < 30; k++) { const h = hashStr('win' + k); g.fillStyle = '#f2c14e88'; g.fillRect(h % 1400, 760 + (h >>> 10) % 160, 6, 9); } }
  if (kind === 'gamble') { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#2a160c', '#4a2a14']); g.fillRect(RX, RY, RW, RH); for (let y = RY + 30; y < RY + RH; y += 46) { g.fillStyle = '#0000002a'; g.fillRect(RX, y, RW, 3); } } // floorboards
  g.restore(); }
function titleCard(title, sub, now, t) { const k = motionOK() ? ease(t * 2.2) : Math.min(1, t * 4); sg.save(); sg.globalAlpha = Math.min(1, t * 4); const y = RY + RH / 2 - 60 + (1 - k) * -140;
  sg.fillStyle = '#4e120ce8'; sg.fillRect(RX, y - 78, RW, 156); kilimBand(sg, RX, y - 84, RW, 12); kilimBand(sg, RX, y + 72, RW, 12);
  sg.shadowColor = GOLD; sg.shadowBlur = 30; text(sg, title, 700, y - 12, 76, WOOL, 'Georgia, serif', 'center', '900'); sg.shadowBlur = 0; text(sg, sub, 700, y + 46, 22, BRASS_HI, 'Arial', 'center', '800'); sg.restore(); }
function drawTrigger(now) { const { kind } = scene, t = (now - scene.t0) / TRIGGER_MS();
  const cells = kind === 'jackpot' ? cellsOf('bitcoin', true) : kind === 'gamble' ? [] : cellsOf(TRIGGER_SYM[kind] || 'scatter');
  drawReels(now); sg.fillStyle = `rgba(0,0,0,${Math.min(.62, t * 1.6)})`; sg.fillRect(RX, RY, RW, RH);
  if (kind === 'free' && motionOK() && t > .2 && t < .55) { sg.save(); sg.globalAlpha = (t - .2) / .35 * .8; deadPage(RX, RY, RW, RH, 1, now); sg.restore(); } // a flash of the dead page
  cells.forEach(([c, r], k) => { const lift = motionOK() ? Math.sin(Math.min(1, t * 1.4) * Math.PI / 2) : 1, bob = motionOK() ? Math.sin(now / 160 + k) * 6 : 0, s = 176 * (1 + .14 * lift);
    sg.save(); sg.shadowColor = kind === 'jackpot' ? GOLD : BRASS_HI; sg.shadowBlur = 20 + 25 * Math.abs(Math.sin(now / 200 + k)); sg.drawImage(tileFor(state.grid[c][r], faces[c][r]), RX + c * CW + CW / 2 - s / 2, RY + r * RHT + RHT / 2 - s / 2 - 16 * lift + bob, s, s); sg.restore(); });
  if (kind === 'gamble' && scene.data.bird) { const k = ease(t * 2), body = bigRug(scene.data.bird, 3, { land: true, dye: ACCENT, ext: 10 }); sg.save(); sg.globalAlpha = k; sg.translate(700, RY + RH / 2); sg.scale(k, k * .6); drawRug(sg, body, -body.w / 2, -body.h / 2, { land: true, wave: 0, seed: 'g' }); sg.restore(); }
  if (kind === 'jackpot' && !cells.length && scene.data.bird) { const k = ease(t * 2), body = bigRug(scene.data.bird, 3, { land: true, dye: '#b8860b', dark: '#3a2306', ext: 10 }); sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 40; sg.translate(700, RY + RH / 2); sg.scale(k, k * .62); drawRug(sg, body, -body.w / 2, -body.h / 2, { land: true, wave: 6, phase: now / 300, seed: 'j', fringeColor: BRASS_HI }); sg.restore(); }
  const sub = kind === 'jackpot' ? (cells.length ? 'FIVE FLYING CARPETS ON THE CENTRE ROW' : 'THE RUG IS FULLY WOVEN · ALL 15 BANDS') : kind === 'gamble' ? `${fmt(scene.data.stake)} LAYR RIDES ON ONE TUG` : `${cells.length} ${kind === 'free' ? 'BROKEN FRAMES' : kind === 'vault' ? 'ROLLED RUGS' : 'KNOTS'}`;
  if (t > .5) titleCard(TITLES[kind], sub, now, (t - .5) * 1.4);
  if (t >= 1) setStage('intro'); }
function wrapText(s, x, y, maxW, lh, color, size) { sg.font = `700 ${size}px Arial`; const words = s.split(' '); let line = '', yy = y; for (const w of words) { const t = line ? line + ' ' + w : w; if (sg.measureText(t).width > maxW && line) { text(sg, line, x, yy, size, color, 'Arial', 'center', '700'); line = w; yy += lh; } else line = t; } if (line) text(sg, line, x, yy, size, color, 'Arial', 'center', '700'); }
// A small loom for the Fully Woven intro: the warp strung, the bird's rug woven part way up.
function drawLoom(x, y, w, h, b, frac, now) { sg.save(); round(sg, x - 14, y - 18, w + 28, 18, 4, lin(sg, 0, y - 18, 0, y, ['#7a4f2a', '#4a2a14'])); round(sg, x - 14, y + h, w + 28, 18, 4, lin(sg, 0, y + h, 0, y + h + 18, ['#7a4f2a', '#4a2a14']));
  sg.fillStyle = '#1a0e08'; sg.fillRect(x, y, w, h); sg.strokeStyle = WOOL; sg.lineWidth = 1; for (let xx = x + 3; xx < x + w; xx += 6) { sg.beginPath(); sg.moveTo(xx, y); sg.lineTo(xx, y + h); sg.stroke(); }
  if (b) { const body = bigRug(b, Math.min(w / 70, h / 84), { dye: ACCENT, ext: 7 }), wh = body.h * frac; sg.save(); sg.beginPath(); sg.rect(x + (w - body.w) / 2, y + h - wh, body.w, wh); sg.clip(); sg.imageSmoothingEnabled = false; sg.drawImage(body.c, x + (w - body.w) / 2, y + (h - body.h) / 2); sg.restore();
    const sy = y + h - wh, sx = x + (motionOK() ? (Math.sin(now / 300) * .5 + .5) * w : w / 2); sg.fillStyle = lin(sg, sx - 40, 0, sx + 40, 0, ['#7a5212', BRASS_HI, '#7a5212']); sg.beginPath(); sg.ellipse(sx, sy, 40, 7, 0, 0, 7); sg.fill(); } // the shuttle
  sg.restore(); }
function drawIntro(now) { const { kind } = scene, t = (now - scene.t0) / (600 * speed()), a = Math.min(1, t);
  backdrop(kind, now); sg.save(); sg.globalAlpha = a; const yIn = motionOK() ? (1 - ease(t)) * 40 : 0;
  if (kind === 'free') { deadPage(110, RY + 70 + yIn, 450, 340, motionOK() ? Math.max(0, 1 - t * 1.4) : 0, now); round(sg, 110, RY + 70 + yIn, 450, 340, 4, null, '#4a4540', 3); }
  if (kind === 'vault') { const l = birdList(); [[230, 300], [430, 300], [330, 210]].forEach(([cx, cy], i) => { const b = l[(hashStr('st' + i)) % Math.max(1, l.length)]; if (b) drawRoll(sg, bigRug(b, 2.4, { land: true, dye: ACCENT, ext: 10 }), cx, RY + cy - 80 + yIn, 210, 70, b.id, i === 2 ? 20 : 0); }); }
  if (kind === 'chain') drawLoom(170, RY + 90 + yIn, 300, 330, loomBird(feature() || { roundId: 'intro' }), motionOK() ? .25 + .2 * Math.sin(now / 900) : .35, now);
  if (kind === 'jackpot' && scene.data.bird) { const body = bigRug(scene.data.bird, 3.2, { land: true, dye: '#b8860b', dark: '#3a2306', ext: 10 }); sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 40; sg.translate(330, RY + 250 + yIn + (motionOK() ? Math.sin(now / 400) * 12 : 0)); sg.transform(1, -.06, -.3, .6, 0, 0); drawRug(sg, body, -body.w / 2, -body.h / 2, { land: true, wave: 7, phase: now / 260, seed: 'ji', fringeColor: BRASS_HI }); sg.restore(); }
  if (kind === 'gamble' && scene.data.bird) { const body = bigRug(scene.data.bird, 3, { land: true, dye: ACCENT, ext: 10 }); sg.save(); sg.translate(330, RY + 250 + yIn); sg.transform(1, 0, -.35, .55, 0, 0); drawRug(sg, body, -body.w / 2, -body.h / 2, { land: true, wave: 0, seed: 'gi' }); sg.restore(); }
  sg.shadowColor = kind === 'free' ? 'rgba(0,0,0,0)' : GOLD; sg.shadowBlur = kind === 'free' ? 0 : 24; text(sg, TITLES[kind], 890, RY + 150 + yIn, kind === 'jackpot' ? 56 : kind === 'free' ? 96 : 66, kind === 'free' ? '#4a4540' : WOOL, 'Georgia, serif', 'center', '900'); sg.shadowBlur = 0;
  const rule = kind === 'gamble' ? `Someone tugs the rug. Call PULL (it slides away) or HOLD (it stays put). Right doubles your ${fmt(scene.data.stake)} LAYR win; wrong loses it.` : RULES[kind];
  wrapText(rule, 890, RY + 232 + yIn, 640, 30, kind === 'free' ? '#2a2622' : '#f1e4c6', 26);
  sg.restore();
  if (kind === 'gamble') { button('PULL', 600, RY + 380, 180, 84, () => callGamble('odd')); button('HOLD', 800, RY + 380, 180, 84, () => callGamble('even')); button('KEEP WIN', 1000, RY + 390, 170, 64, keepWin, false); }
  else button(kind === 'jackpot' ? 'RIDE' : 'START', 760, RY + 380, 260, 88, primaryAction);
  skipChip(); }
function drawVaultPlay(f, now) {
  backdrop('vault', now, .6); const done = f.picks.length === 3, doneAt = done ? Math.max(...f.picks.map(i => scene.reveal[i] || 0)) : 0, doneDelay = 1000 * speed() + (done ? Math.max(...f.picks.map(i => vaultCharge(f.awards[i]))) : 0);
  for (let i = 0; i < 9; i++) { const [x, y, w, h] = capsuleRect(i), picked = f.picks.includes(i), m = f.awards[i], at = scene.reveal[i], rv = revealRug(m, f.roundId || 'stall', i), b = rv.b;
    const rugW = 250, infoX = x + rugW + 24 + (w - rugW - 24) / 2;
    if (!b) { round(sg, x, y, w, h, 14, '#2a1408', BRASS, 2); continue; }
    const body = bigRug(b, 2, { land: true, dye: rv.dye, dark: m >= 15 ? '#3a2306' : WOOD, ext: 10 });
    if (picked) { const ch = vaultCharge(m), el = at ? now - at : 1e9;
      if (el < ch) { const k = el / ch, jit = Math.sin(el / 22) * (1.5 + 5 * k), big = m >= 8; sg.save(); sg.shadowColor = big ? GOLD : BRASS; sg.shadowBlur = (big ? 30 : 14) + 26 * k; round(sg, x, y, w, h, 14, '#2a1408', big ? GOLD : BRASS, 3 + 2 * k); sg.restore(); drawRoll(sg, body, x + 20 + rugW / 2 + jit, y + h / 2 - k * 4, rugW - 20, 62, b.id); text(sg, big ? 'SOMETHING BIG…' : 'UNTYING…', infoX, y + h / 2, 17, big ? BRASS_HI : WOOL, 'Arial', 'center', '900'); continue; }
      const t = at ? (el - ch) / (900 * speed()) : 9, p = motionOK() ? ease(t) : 1, big = m >= 8;
      sg.save(); if (big) { sg.shadowColor = GOLD; sg.shadowBlur = 30 + 20 * Math.sin(now / 150); } round(sg, x, y, w, h, 14, big ? '#3a2306' : '#2a1408', big ? GOLD : BRASS, big ? 6 : 4); sg.restore();
      // Unrolling: the flat rug is revealed from the left as the roll travels right and thins.
      const rx = x + 16, ry = y + (h - body.h) / 2, vis = body.w * p; sg.save(); sg.beginPath(); sg.rect(rx - 20, y, vis + 20, h); sg.clip(); drawRug(sg, body, rx, ry, { land: true, wave: motionOK() && p < 1 ? 3 * (1 - p) : 0, phase: now / 120, seed: b.id, fringe: 10 }); sg.restore();
      if (p < 1) drawRoll(sg, body, rx + vis + 10, y + h / 2, 34, 62 * (1 - .55 * p), b.id);
      const shown = Math.round(m * Math.min(1, p * 1.2)); sg.save(); sg.globalAlpha = Math.min(1, p * 1.5);
      text(sg, TIER_OF[m] || '', infoX, y + h / 2 - 46, 18, big ? BRASS_HI : '#e8cfa6'); text(sg, `${Math.max(1, shown)}×`, infoX, y + h / 2 - 6, 46, '#ffffff', 'Arial'); text(sg, `${fmt(Math.max(1, shown) * f.bet)} LAYR`, infoX, y + h / 2 + 34, 18, BRASS_HI); text(sg, `BITCOIN BIRD #${b.id}`, infoX, y + h / 2 + 58, 13, '#c9a77a', 'Arial', 'center', '800'); sg.restore(); }
    else if (done && now - doneAt > doneDelay) { round(sg, x, y, w, h, 14, '#1d0f08', '#4a2a14', 2); sg.save(); sg.globalAlpha = .4; drawRug(sg, body, x + 16, y + (h - body.h) / 2, { land: true, wave: 0, seed: b.id, fringe: 8 }); sg.restore(); text(sg, TIER_OF[m] || '', infoX, y + h / 2 - 16, 15, '#8a6a4a'); text(sg, `${m}×`, infoX, y + h / 2 + 14, 30, '#8a6a4a'); }
    else { const hover = motionOK() ? Math.sin(now / 400 + i) * 3 : 0; round(sg, x, y + hover, w, h, 14, '#2a1408', '#6b4422', 2); drawRoll(sg, body, x + 20 + rugW / 2, y + h / 2 + hover - 6, rugW - 20, 62, b.id, 16); text(sg, `RUG ${i + 1}`, infoX, y + h / 2 - 18 + hover, 22, WOOL); text(sg, 'TAP TO UNROLL', infoX, y + h / 2 + 16 + hover, 15, '#c9a77a', 'Arial', 'center', '700'); if (!done) hits.push({ x, y, w, h, fn: () => pickVault(i) }); } }
  if (done && now - doneAt > doneDelay) button('COLLECT', 570, RY + RH + 8, 260, 64, collectScene);
  skipChip(); }
// ---------- The loom ----------
// The full rug for this round: one real bird, landscape, sized so the loom's 15 bands (the 5 × 3 grid) cover it.
const loomRug = b => bigRug(b, 8.1, { land: true, dye: ACCENT, ext: 12, border: 32 });
const bandRect = i => [RX + (i % 5) * CW + 6, RY + Math.floor(i / 5) * RHT + 6, CW - 15, RHT - 12];
// One band while the shuttle runs: bare warp, flickering weft in the bird's colours, the brass shuttle sweeping across and slowing.
function drawShuttleBand(f, i, x, y, w, h, now, S, hit) {
  const lb = loomBird(f), p = Math.min(1, (now - S.t0) / Math.max(1, S.landAt[i] - S.t0)), pal = lb ? birdPalette(lb) : { cols: [ACCENT, BRASS, WOOL] }, sx = x + w * (.5 + .5 * Math.sin((1 - ease(p)) * 18 + i));
  sg.save(); sg.beginPath(); sg.roundRect(x, y, w, h, 10); sg.clip(); sg.fillStyle = '#1a0e08'; sg.fillRect(x, y, w, h);
  sg.strokeStyle = '#f1e4c699'; sg.lineWidth = 1.2; for (let xx = x + 4; xx < x + w; xx += 9) { sg.beginPath(); sg.moveTo(xx, y); sg.lineTo(xx, y + h); sg.stroke(); }
  for (let k = 0; k < 6; k++) { if ((hashStr(`${i}:${k}:${Math.floor(now / 70)}`) & 3) === 0) { sg.fillStyle = pal.cols[k % pal.cols.length] || ACCENT; sg.globalAlpha = .35 * (1 - p * .7); sg.fillRect(x, y + 8 + k * (h - 16) / 6, w, 4); } } sg.globalAlpha = 1;
  sg.fillStyle = lin(sg, sx - 44, 0, sx + 44, 0, ['#5a3a0c', BRASS_HI, '#5a3a0c']); sg.beginPath(); sg.ellipse(sx, y + h / 2, 44, 9, 0, 0, 7); sg.fill(); sg.fillStyle = WOOL; sg.fillRect(sx - 10, y + h / 2 - 2, 20, 4);
  sg.restore();
  const hold = S.tense && now > S.t0 + 700 * speed() && p < 1, pulse = hold ? .55 + .45 * Math.sin(now / 90) : 0;
  sg.save(); if (hold) { sg.shadowColor = GOLD; sg.shadowBlur = 24 * pulse; } round(sg, x, y, w, h, 10, null, hold ? GOLD : BRASS, hold ? 4 : 2); sg.restore(); }
function drawGrabPlay(f, now) {
  backdrop('chain', now, .5); const fr = f.frames[f.index], S = scene.spin, mo = motionOK(), b = loomBird(f), rug = b ? loomRug(b) : null, rx = RX + (RW - (rug ? rug.w : 0)) / 2, ry = RY + (RH - (rug ? rug.h : 0)) / 2;
  const landed = i => !(S && S.landAt[i] !== undefined && now < S.landAt[i]), tot = fr.cells.reduce((a, v, i) => a + (landed(i) ? v : 0), 0);
  if (S && now < S.lastLand && mo && Math.floor(now / 80) !== Math.floor((now - 17) / 80)) sfx('roll');
  // Loom beams top and bottom.
  for (const yy of [RY - 4, RY + RH - 10]) { sg.fillStyle = lin(sg, 0, yy, 0, yy + 14, ['#8a5a2a', '#4a2a14']); sg.fillRect(RX, yy, RW, 14); }
  const full = fr.cells.every(Boolean) && (!S || now > S.lastLand);
  if (full && rug) { const k = S && S.fill ? Math.min(1, (now - S.lastLand) / (800 * speed())) : 1; sg.save(); sg.globalAlpha = .35 + .65 * k; drawRug(sg, rug, rx, ry, { land: true, wave: mo ? 4 * k : 0, phase: now / 300, seed: 'loom', fringe: 22 }); sg.restore(); }
  fr.cells.forEach((v, i) => { const [x0, y, w, h] = bandRect(i), at = scene.stampAt[i];
    if (!landed(i)) { drawShuttleBand(f, i, x0, y, w, h, now, S, !!v); return; }
    const miss = !v && S && S.landAt[i] !== undefined ? (now - S.landAt[i]) / (520 * speed()) : 9, x = x0 + (mo && miss < 1 ? Math.sin(miss * 38) * 5 * (1 - miss) : 0);
    if (v) { const t = at ? (now - at) / (360 * speed()) : 9;
      if (!full && rug) { sg.save(); sg.beginPath(); sg.roundRect(x, y, w, h, 10); sg.clip(); sg.globalAlpha = Math.min(1, .3 + t * 2.5); sg.imageSmoothingEnabled = false; sg.drawImage(rug.c, rx, ry); sg.restore(); } // the band's knots, tied in
      if (t < 1.5) { sg.save(); sg.globalAlpha = (1.5 - Math.min(1.5, t)) / 1.5; sg.shadowColor = GOLD; sg.shadowBlur = 30; round(sg, x, y, w, h, 10, null, BRASS_HI, 5); sg.restore(); }
      if (mo && at && t >= 0 && t < 1.6) { const k = t / 1.6; sg.save(); sg.globalAlpha = (1 - k) * .9; sg.strokeStyle = BRASS_HI; sg.lineWidth = 6 * (1 - k) + 1; sg.beginPath(); sg.roundRect(x - k * 22, y - k * 22, w + k * 44, h + k * 44, 10 + k * 18); sg.stroke(); sg.restore(); }
      if (!full) round(sg, x, y, w, h, 10, null, '#3a2306', 2);
      if (t > .6) { round(sg, x + w - 82, y + h - 34, 78, 30, 8, '#1d0f08d8', BRASS, 2); text(sg, `${v}× ${fmt(v * f.bet)}`, x + w - 43, y + h - 19, 14, BRASS_HI, 'Arial', 'center', '900'); } }
    else { sg.save(); sg.beginPath(); sg.roundRect(x, y, w, h, 10); sg.clip(); sg.fillStyle = '#1a0e08f0'; sg.fillRect(x, y, w, h); sg.strokeStyle = '#f1e4c655'; sg.lineWidth = 1.2; for (let xx = x + 4; xx < x + w; xx += 9) { sg.beginPath(); sg.moveTo(xx, y); sg.lineTo(xx, y + h); sg.stroke(); } sg.restore();
      round(sg, x, y, w, h, 10, null, miss < 1 ? `rgba(224,150,70,${1 - miss})` : '#6b4422', miss < 1 ? 4 : 2);
      text(sg, miss < 1 ? 'NO KNOT' : 'BARE WARP', x + w / 2, y + h / 2 - 10, miss < 1 ? 18 : 15, miss < 1 ? `rgba(240,170,90,${1 - miss})` : '#8a6a4a', 'Arial', 'center', '900'); text(sg, `BAND ${i + 1}`, x + w / 2, y + h / 2 + 12, 13, '#6b4a2a'); } });
  // Respin banner sweeping over the loom as the shuttle starts to run.
  if (S && mo && now - S.t0 < 520 * speed()) { const k = (now - S.t0) / (520 * speed()); sg.save(); sg.globalAlpha = Math.sin(Math.min(1, k) * Math.PI) * .9; round(sg, 470, RY + RH / 2 - 44, 460, 88, 18, '#2a1408f0', GOLD, 4); text(sg, S.before === 1 ? 'FINAL RESPIN' : `RESPIN ${S.n}`, 700, RY + RH / 2 + 1, 46, BRASS_HI, 'Arial', 'center', '900'); sg.restore(); }
  // Fully woven: the whole rug flashes gold as it comes off the loom.
  if (S && S.fill && mo && now > S.lastLand && now - S.lastLand < 700) { sg.save(); sg.globalAlpha = (1 - (now - S.lastLand) / 700) * .5; sg.fillStyle = BRASS_HI; sg.fillRect(RX, RY, RW, RH); sg.restore(); }
  // Respins left: three brass lamps. The one just spent goes out as the shuttle runs; a new knot refills them one by one.
  const rs = scene.resetAt && now >= scene.resetAt && now - scene.resetAt < 900 ? 1 : 0, by = RY + RH + 8; sg.save(); round(sg, RX + 14, by, 290, 48, 12, '#1d0f08e6', rs ? WOOL : BRASS, rs ? 4 : 2); text(sg, 'RESPINS', RX + 80, by + 25, 20, WOOL, 'Arial', 'center', '900');
  for (let k = 0; k < 3; k++) { const spent = S && now < S.end && !(S.added.size && now >= S.firstHit) ? S.before - 1 : fr.left, refill = S && S.added.size && now >= S.firstHit && k >= S.before - 1 ? now >= S.firstHit + (k - (S.before - 1) + 1) * 130 * speed() : true;
    const on = k < (S && S.added.size && now >= S.firstHit ? fr.left : spent) && refill, used = S && now < S.lastLand && k === S.before - 1 && !(S.added.size && now >= S.firstHit);
    sg.beginPath(); sg.arc(RX + 170 + k * 44, by + 24, 14, 0, 7); sg.fillStyle = on ? (rs ? '#fff6d0' : BRASS_HI) : used ? (Math.floor(now / 110) % 2 ? '#e0964a' : '#4a2c12') : '#2a1a12'; if (on && rs) { sg.shadowColor = GOLD; sg.shadowBlur = 20; } sg.fill(); sg.shadowBlur = 0; } sg.restore();
  round(sg, RX + RW - 440, by, 280, 48, 12, '#1d0f08e6', BRASS, 2); text(sg, `WOVEN ${fmt(tot * f.bet)} LAYR`, RX + RW - 300, by + 25, 21, WOOL, 'Arial', 'center', '900');
  const busyNow = chainBusy();
  if (E.featureDone(f) && !busyNow && now - chainFlash > 700) button('COLLECT', 570, RY + RH / 2 - 37, 260, 74, collectScene);
  else if (!E.featureDone(f) && !busyNow) hits.push({ x: RX, y: RY, w: RW, h: RH, fn: featureAction });
  skipChip(); }
// Magic Carpet Ride: the carpet lifts off the reels and loops round the bazaar under the stars while the meter counts up.
function drawJackpotPlay(now) { backdrop('jackpot', now); const t = Math.min(1, (now - scene.t0) / (4200 * speed())), amt = scene.data.amount * ease(t), b = scene.data.bird, mo = motionOK();
  // Lamps chasing round the whole screen.
  for (let k = 0; k < 56; k++) { const p = k / 56, x = p < .25 ? 30 + p * 4 * 1340 : p < .5 ? 1370 : p < .75 ? 1370 - (p - .5) * 4 * 1340 : 30, y = p < .25 ? 22 : p < .5 ? 22 + (p - .25) * 4 * 916 : p < .75 ? 938 : 938 - (p - .75) * 4 * 916, on = mo ? (k + Math.floor(now / 90)) % 3 === 0 : k % 2 === 0; sg.beginPath(); sg.arc(x, y, 8, 0, 7); sg.fillStyle = on ? BRASS_HI : '#4a2a14'; sg.fill(); }
  if (b) { const body = bigRug(b, 3.4, { land: true, dye: '#b8860b', dark: '#3a2306', ext: 10 }), el = (now - scene.t0) / 1000 / speed(), lift = mo ? Math.min(1, el / 1.2) : 1;
    // A figure-of-eight round the bazaar, rising from where the reels were; the carpet banks into each turn.
    const a = el * .9, px = 700 + (mo ? 430 * Math.sin(a) : 0) * lift, py = (RY + RH / 2) * (1 - lift) + (300 + (mo ? 90 * Math.sin(2 * a) : 0)) * lift, bank = mo ? Math.cos(a) * .25 : 0, sc = .7 + .25 * lift + (mo ? .08 * Math.cos(a) : 0);
    if (mo) for (let k = 1; k < 14; k++) { const a2 = a - k * .07, tx = 700 + 430 * Math.sin(a2) * lift, ty = (RY + RH / 2) * (1 - lift) + (300 + 90 * Math.sin(2 * a2)) * lift; sg.fillStyle = `rgba(246,220,148,${.5 - k * .035})`; sg.beginPath(); sg.arc(tx + (hashStr('sp' + k) % 30 - 15), ty + 40 + (hashStr('sq' + k) % 20), 3 + (k % 3), 0, 7); sg.fill(); } // sparkle trail
    sg.save(); sg.fillStyle = '#0006'; sg.beginPath(); sg.ellipse(px, 690, 150 * sc, 14, 0, 0, 7); sg.fill(); sg.restore();
    sg.save(); sg.translate(px, py); sg.rotate(bank * .4); sg.scale(sc, sc); sg.transform(1, -.05, -.3 + bank, .58, 0, 0); sg.shadowColor = GOLD; sg.shadowBlur = 50; drawRug(sg, body, -body.w / 2, -body.h / 2, { land: true, wave: mo ? 9 : 0, freq: 1.4, phase: now / 160, seed: 'ride', fringeColor: BRASS_HI, fringe: 18 }); sg.restore(); }
  sg.save(); sg.shadowColor = GOLD; sg.shadowBlur = 30; text(sg, 'MAGIC CARPET RIDE', 700, 520, 66, WOOL, 'Georgia, serif', 'center', '900'); sg.restore();
  text(sg, `${fmt(Math.round(amt))} LAYR`, 700, 612, 90, '#ffffff', 'Arial', 'center', '900'); text(sg, b ? `BITCOIN BIRD #${b.id} · RESCUED · FOREVER ON XTRATA (#${b.xtrataId})` : 'RESCUED · FOREVER ON XTRATA', 700, 680, 20, BRASS_HI, 'Arial', 'center', '800');
  if (t < 1 && Math.floor(now / 70) !== Math.floor((now - 17) / 70)) sfx('tick', Math.floor(now / 70));
  if (t >= 1) button('SUMMARY', 570, 740, 260, 80, () => setStage('outro')); hits.push({ x: 0, y: 0, w: 1400, h: 960, fn: () => setStage('outro') }); skipChip(); }
// Pull or Hold: a rescued rug on the floorboards, three tugs, then it either whips away (PULL) or holds fast (HOLD).
function drawGamblePlay(now) { backdrop('gamble', now); const r = scene.data.result, t = (now - scene.t0) / (1800 * speed()), mo = motionOK(), landed = t >= .95 || !mo, b = scene.data.bird, pulled = r.parity === 'odd';
  text(sg, 'THE RUG', 700, RY + 50, 24, '#e8cfa6', 'Arial', 'center', '900');
  let dx = 0, lift = 0; if (mo && !landed) { const tug = Math.floor(t / .2); if (tug < 3) { const u = (t % .2) / .2; dx = Math.sin(u * Math.PI) * 26; if (Math.floor(now / 17) % 12 === 0 && u < .1) sfx('tug'); } else { const u = (t - .6) / .35; if (pulled) dx = ease(u) * 1400; else { dx = Math.sin(Math.min(1, u) * Math.PI) * 40; lift = 0; } } }
  else if (landed && pulled) dx = 1400;
  if (b) { const body = bigRug(b, 3.6, { land: true, dye: ACCENT, ext: 10 }); sg.save(); sg.beginPath(); sg.rect(RX, RY, RW, RH); sg.clip(); sg.translate(700 + dx, RY + 210 - lift); sg.transform(1, 0, -.35, .5, 0, 0); sg.shadowColor = '#000'; sg.shadowBlur = 20; drawRug(sg, body, -body.w / 2, -body.h / 2, { land: true, wave: mo && dx > 0 && !landed ? 6 : 0, phase: now / 80, seed: 'gp' }); sg.restore(); }
  if (landed && !pulled) { sg.save(); sg.translate(700, RY + 210); sg.rotate(-.12); round(sg, -110, -34, 220, 68, 10, '#1d0f08d8', BRASS_HI, 5); text(sg, 'HELD', 0, 2, 46, BRASS_HI, 'Georgia, serif', 'center', '900'); sg.restore(); }
  if (landed && pulled) { sg.save(); sg.translate(700, RY + 210); sg.rotate(-.12); round(sg, -130, -34, 260, 68, 10, '#1d0f08d8', '#e0964a', 5); text(sg, 'PULLED', 0, 2, 46, '#e0964a', 'Georgia, serif', 'center', '900'); sg.restore(); }
  // The proof: the last digit of the hash decides pull (odd) or hold (even).
  const tail = r.hash.slice(-14, -1), last = r.hash.slice(-1); sg.font = '900 30px Courier New'; const tw = sg.measureText('…' + tail).width, lw = 40, x0 = 700 - (tw + lw + 6) / 2;
  text(sg, 'PROOF', 700, RY + 338, 15, '#c9a77a', 'Arial', 'center', '900'); text(sg, '…' + tail, x0, RY + 372, 30, '#e8cfa6', 'Courier New', 'left', '900'); round(sg, x0 + tw + 6, RY + 350, lw, 44, 8, landed ? (r.win ? BRASS : '#3a1d14') : '#2a1408', WOOL, 3); text(sg, landed ? last : '?', x0 + tw + 6 + lw / 2, RY + 373, 30, landed ? '#1d0f08' : WOOL, 'Courier New', 'center', '900');
  if (landed) { if (!scene.data.landed) { scene.data.landed = true; sfx(pulled ? 'slide' : 'land'); setTimeout(() => sound(r.win ? 'win' : 'lose'), 150); if (r.win) particles(25); } text(sg, `${pulled ? 'PULLED' : 'HELD'} · YOU CALLED ${callName(r.choice)}`, 700, RY + 428, 26, r.win ? WOOL : '#a08a72', 'Arial', 'center', '900'); button('CONTINUE', 570, RY + 462, 260, 66, () => setStage('outro')); }
  skipChip(); }
function drawOutro(now) { const { kind, data } = scene, t = Math.min(1, (now - scene.t0) / (1300 * speed()));
  backdrop(kind, now, .4); sg.fillStyle = kind === 'free' ? '#2a1408d8' : '#000000a0'; sg.fillRect(RX, RY, RW, RH);
  let title = '', total = 0, lines = [];
  if (kind === 'free') { title = 'ART BACK ON CHAIN'; total = data.total; lines = [`${data.count} free spins at 2× · ${data.count} rug${data.count === 1 ? '' : 's'} rewoven${data.retriggers ? ` · ${data.retriggers} retrigger${data.retriggers > 1 ? 's' : ''}` : ''}`, data.best ? `Biggest spin ${fmt(data.best)} LAYR` : 'Includes any Unroll or loom won during the 404', data.skipped ? 'Skipped: same total, no animation' : ''];
    (data.woven || []).slice(-12).forEach((b, i) => { const body = bigRug(b, 1, { dye: ACCENT, ext: 4 }); drawRug(sg, body, 700 - 6 * 46 + i * 46 + 6, RY + RH - 150, { wave: 0, fringe: 5, seed: b.id }); }); }
  if (kind === 'vault') { title = 'RUGS UNROLLED'; total = data.total; lines = [`3 rugs unrolled: ${(data.picks || []).map(m => `${TIER_OF[m]} ${m}×`).join(' · ')}`, `${(data.picks || []).reduce((a, b) => a + b, 0)}× your ${fmt(data.bet || 0)} LAYR bet`] }
  if (kind === 'chain') { title = data.cells === 15 ? 'FULLY WOVEN' : 'OFF THE LOOM'; total = data.total; lines = [`${data.cells}/15 bands woven · ${data.respins} respins${data.bird ? ` · Bitcoin Bird #${data.bird.id}` : ''}`, data.jackpot ? `Rug finished: the Magic Carpet Ride +${fmt(data.jackpot)} next` : 'Weave all 15 bands to ride the Magic Carpet'] }
  if (kind === 'jackpot') { title = 'MAGIC CARPET RIDE'; total = data.amount; lines = ['The jackpot meter for this bet level paid in full', 'The meter restarts at 500× your bet'] }
  if (kind === 'gamble') { const r = data.result; title = r ? (r.win ? 'DOUBLED' : 'RUGGED!') : 'WIN KEPT'; total = r ? r.amount : data.stake; lines = r ? [`The rug was ${r.parity === 'odd' ? 'PULLED' : 'HELD'}; you called ${callName(r.choice)}`, r.win ? `Your ${fmt(r.stake)} LAYR win doubled` : `Your ${fmt(r.stake)} LAYR win is lost; nothing on-chain gets rugged, and your other LAYR is untouched`] : [] }
  const k = ease(t); if (t < 1 && Math.floor(now / 60) !== Math.floor((now - 17) / 60)) sfx('tick', Math.floor(now / 60));
  sg.save(); sg.globalAlpha = Math.min(1, t * 3); sg.shadowColor = GOLD; sg.shadowBlur = 24; text(sg, title, 700, RY + 100, 64, WOOL, 'Georgia, serif', 'center', '900'); sg.shadowBlur = 0;
  text(sg, `${fmt(Math.round(total * k * 100) / 100)} LAYR`, 700, RY + 200, 84, '#ffffff', 'Arial', 'center', '900');
  lines.filter(Boolean).forEach((l, i) => text(sg, l, 700, RY + 278 + i * 34, 22, '#efd9b6', 'Arial', 'center', '700')); sg.restore();
  if (t >= 1) button('CONTINUE', 570, RY + RH - 92, 260, 74, nextScene); }
// The 404: the reels on the dead page; each spin a rescued rug weaves back in over it, knot row by knot row.
function drawRainPlay(now) {
  backdrop('free', now); const w = drawReels(now);
  if (airdrop && airdrop.spinAt && motionOK()) { const p = (now - airdrop.spinAt) / (900 * speed()); if (p < 1) { // the dead page dissolving into weave, top row first
    sg.save(); sg.beginPath(); sg.rect(RX, RY, RW, RH); sg.clip(); const rows = 19, cols = 44, cw = RW / cols, ch = RH / rows; sg.beginPath(); for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const th = r / rows * .8 + (hashStr(`${r}:${c}`) % 100) / 500; if (th > p) sg.rect(RX + c * cw, RY + r * ch, cw + .5, ch + .5); } sg.clip(); deadPage(RX, RY, RW, RH, .4, now); sg.restore(); } }
  round(sg, 260, RY - 30, 880, 46, 12, '#1d0f08', BRASS, 3); text(sg, `404 · ${state.free} SPIN${state.free === 1 ? '' : 'S'} LEFT · ${airdrop ? airdrop.woven.length : 0} REWOVEN · ${fmt(state.freeTotal)} LAYR · ALL WINS 2×`, 700, RY - 6, 19, WOOL, 'Arial', 'center', '900');
  return w; }
function drawScreen(now) {
  hits = []; sg.drawImage(baseLayer, 0, 0);
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet, hs = holderState(), led = rescueLedger(), tw = linkedTest.on ? linkedTest.value : twinCount.value;
  text(sg, `ART SAVED  ${led.saved.toLocaleString('en-GB')}`, 216, 108, 30, MADDER, 'Georgia, serif', 'center', '900'); text(sg, `STILL AT RISK  ${led.risk.toLocaleString('en-GB')}`, 216, 144, 22, '#4a2a14', 'Georgia, serif', 'center', '900');
  text(sg, twinCount.live ? 'TWINS READ LIVE FROM THE HELPER' : twinCount.failed ? `HELPER READ FAILED · LAST KNOWN, STALE` : `TWINS AS OF ${new Date(twinCount.at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()} · STALE`, 216, 174, 12, '#8a6a4a', 'Arial', 'center', '800');
  text(sg, fmt(E.meter(state, shownBet)), 700, 124, 62, '#ffffff', 'Arial', 'center', '300'); text(sg, `LAYR PROGRESSIVE  ·  ${fmt(shownBet)} BET LEVEL`, 700, 172, 17, BRASS_HI);
  text(sg, fmt(hs.pot), 1184, 106, 38, MADDER, 'Arial', 'center', '800'); text(sg, `${hs.period.replace('-W', ' · WEEK ')}  ·  1% OF PAID BETS`, 1184, 140, 13, '#4a2a14');
  text(sg, Number.isFinite(tw) && tw > 0 ? `½ ≈ ${fmt(hs.pot * TWIN_SHARE / tw)} PER TWIN${linkedTest.on ? ' (TEST)' : ''} · ½ FOREVER FUND` : 'SHARE PER TWIN: COUNT UNKNOWN · ½ FOREVER FUND', 1184, 168, 12, '#6b4a2a', 'Arial', 'center', '800');
  let msg, msgColor = WOOL;
  if (scene && scene.kind === 'jackpot' && scene.stage === 'play') { drawJackpotPlay(now); labBanner(); screenTexture.needsUpdate = true; screenDirty = false; return; }
  if (scene) { const st = scene.stage, k = scene.kind;
    if (st === 'trigger') drawTrigger(now); else if (scene.stage === 'intro') drawIntro(now); else if (scene.stage === 'outro') drawOutro(now);
    else if (k === 'vault' && f) drawVaultPlay(f, now); else if (k === 'chain' && f) drawGrabPlay(f, now); else if (k === 'gamble' && scene.data.result) drawGamblePlay(now);
    if (scene) msg = scene.stage === 'trigger' ? `${TITLES[scene.kind]}!` : scene.stage === 'intro' ? (scene.kind === 'gamble' ? 'PULL OR HOLD? CALL THE TUG' : `${TITLES[scene.kind]} · PRESS ${primaryLabel()}`) : scene.stage === 'outro' ? `${TITLES[scene.kind]} · PRESS CONTINUE` : scene.kind === 'vault' ? (f && f.picks.length === 3 ? '' : `UNROLL · ${f ? 3 - f.picks.length : 0} MORE · TAP A RUG`) : scene.kind === 'chain' ? (f ? chainMsg(f, now) : 'FULLY WOVEN') : TITLES[scene.kind]; }
  else { const w = state.freeActive ? drawRainPlay(now) : drawReels(now); if (state.freeActive && !state.free && !spinning) button('SUMMARY', 570, RY + RH / 2 - 37, 260, 74, primaryAction); const it = w ? cameoFor(w) : null;
    msg = spinning ? 'WEAVING…' : w ? `LINE ${w.line + 1}  ·  ${NAMES[w.symbol].toUpperCase()} × ${w.count}  ·  +${fmt(w.amount)}${it ? `  ·  ${cameoLabel(it)}` : ''}` : state.free ? `${state.free} 404 SPINS  ·  ALL WINS 2×` : state.gamble ? `WIN ${fmt(state.gamble)} · PULL OR HOLD?` : state.lastWin ? `WIN  ${fmt(state.lastWin)}  LAYR` : 'NOTHING ON-CHAIN GETS RUGGED'; if (state.free && !spinning) msgColor = BRASS_HI; }
  text(sg, msg, 700, 822, 25, msgColor);
  drawBlocks();
  text(sg, `LAYR  ${fmt(state.balance)}`, 60, 896, 24, WOOL, 'Arial', 'left'); text(sg, `KNOTS  ${fmt(shownBet)}`, 700, 896, 24, WOOL); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1340, 896, 24, BRASS_HI, 'Arial', 'right');
  labBanner(); screenTexture.needsUpdate = true; screenDirty = false;
}
// The Bonus Lab says so on the screen itself, in every view.
function labBanner() { if (!lab.on) return; sg.save(); sg.fillStyle = GOLD; sg.fillRect(0, 0, 1400, 24); text(sg, `BONUS LAB · PRACTICE LAYR · NOTHING HERE IS REAL · YOUR REAL GAME IS UNTOUCHED${lab.seedShown != null ? ` · SEED ${lab.seedShown}` : ''}`, 700, 13, 15, '#2a1d00', 'Arial', 'center', '900'); sg.restore(); }
function screenTap(x, y) { if (spinning) return; for (let i = hits.length - 1; i >= 0; i--) { const h = hits[i]; if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { audioInit(); h.fn(); screenDirty = true; return; } } }
function particles(n = 35) { if (!motionOK()) return; for (let i = 0; i < n; i++) { const p = document.createElement('i'); p.className = 'coin'; p.style.left = `${15 + Math.random() * 70}%`; p.style.top = '-25px'; p.style.animationDelay = `${Math.random() * .8}s`; p.style.animationDuration = `${1.8 + Math.random() * 1.4}s`; $('celebration').appendChild(p); setTimeout(() => p.remove(), 4000); } }
