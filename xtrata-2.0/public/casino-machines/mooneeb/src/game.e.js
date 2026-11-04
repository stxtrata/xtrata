
/* ---------- The feature bar (also ported into the casino's UI) ---------- */
function setBar(tagText, title, info, html) { $('fbTag').textContent = tagText; $('fbTitle').textContent = title; $('fbInfo').textContent = info; $('fbBody').innerHTML = html; $('featureBar').hidden = false; document.body.classList.add('feature-on'); }
function hideBar() { if (scene || freeMode) { renderBar(); return; } $('featureBar').hidden = true; document.body.classList.remove('feature-on'); }
const skipBtn = '<button class="bar-skip" id="fbSkip">Skip ↠</button>';
function primaryLabel() {
  if (spinning) return 'SPINNING…';
  if (scene) { const s = scene, k = s.kind;
    if (s.stage === 'trigger') return 'CONTINUE';
    if (s.stage === 'intro') return k === 'free' ? (s.data.resumed ? 'CARRY ON' : 'LIFT OFF') : k === 'vault' ? 'OPEN THE BAGS' : k === 'chain' ? 'START SPELLING' : k === 'jackpot' ? 'LIGHT THE LADDER' : 'KEEP WIN';
    if (s.stage === 'play') return k === 'chain' ? 'RESPIN' : k === 'vault' ? `OPEN ${3 - s.f.picks.length}` : k === 'jackpot' ? 'CONTINUE' : 'FLIPPING…';
    return k === 'vault' || k === 'chain' ? 'COLLECT' : 'CONTINUE'; }
  if (freeMode || state.free) return 'MOONSHOT';
  if (!labRun && !state.free && state.balance < state.bet) return 'GET LAYR';
  return 'MOO';
}
function renderBar() {
  if (!scene && !freeMode) { $('featureBar').hidden = true; document.body.classList.remove('feature-on'); syncFs(); return; }
  if (!scene && freeMode) { setBar(SCENE.free.tag, 'Moonshot', `${state.free} left · all wins 2× · ${fmt(state.freeTotal)} LAYR so far`, skipBtn); bindBar(); return; }
  const s = scene, k = s.kind, cfg = SCENE[k], f = s.f;
  let info = cfg.rule || '', body = '';
  if (s.stage === 'trigger') { info = k === 'retrigger' ? `+${s.data.award} Moonshots` : 'Bonus triggered'; body = `<button class="bar-cta" id="fbGo">Continue ↗</button>` + skipBtn; }
  else if (s.stage === 'intro') {
    if (k === 'gamble') { info = `${fmt(s.data.stake)} LAYR rides on one call`; body = `<button class="call" data-call="moo">MOO</button><button class="call moon" data-call="moon">MOON</button><button class="bar-skip" id="fbKeep">Keep win</button>`; }
    else body = `<button class="bar-cta" id="fbGo">${primaryLabel()} ↗</button>` + skipBtn;
  } else if (s.stage === 'play') {
    if (k === 'vault') { const tot = f.picks.reduce((a, i) => a + f.awards[i], 0) * f.bet; info = f.picks.length < 3 ? `Open ${3 - f.picks.length} of 9 · tap a bag · ${fmt(tot)} LAYR` : `${fmt(tot)} LAYR`; body = Array.from({ length: 9 }, (_, i) => `<button class="pick${f.picks.includes(i) ? ' picked' : ''}" data-pick="${i}" ${f.picks.includes(i) || f.picks.length >= 3 ? 'disabled' : ''} aria-label="Mooney bag ${i + 1}${f.picks.includes(i) ? `, ${f.awards[i]} times bet` : ''}">${f.picks.includes(i) ? f.awards[i] + '×' : i + 1}</button>`).join('') + skipBtn; }
    else if (k === 'chain') { const fr = f.frames[f.index], n = fr.cells.filter(Boolean).length; info = `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${n}/15 letters · ${fmt(f.sum * f.bet)} so far`; body = G.featureDone(f) ? '' : `<button class="bar-cta" id="fbGo">Respin ↻</button>` + skipBtn; }
    else if (k === 'jackpot') { info = `${fmt(s.data.amount)} LAYR`; body = `<button class="bar-cta" id="fbGo">Continue ↗</button>` + skipBtn; }
    else { info = 'The coin is in the air…'; }
  } else { info = 'Summary'; body = `<button class="bar-cta" id="fbGo">${k === 'vault' || k === 'chain' ? 'Collect ↗' : 'Back to the reels ↗'}</button>`; }
  setBar(cfg.tag, cfg.title, info, body); bindBar();
}
function bindBar() {
  const go = $('fbGo'); if (go) go.onclick = primaryAction; const sk = $('fbSkip'); if (sk) sk.onclick = skipScene; const kp = $('fbKeep'); if (kp) kp.onclick = keepWin;
  document.querySelectorAll('#fbBody [data-pick]').forEach(b => b.onclick = () => pickBag(Number(b.dataset.pick)));
  document.querySelectorAll('#fbBody [data-call]').forEach(b => b.onclick = () => callGamble(b.dataset.call));
  screenDirty = true; syncFs();
}
function update() {
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet, canGamble = state.gamble > 0 && !busy();
  $('balance').textContent = fmt(state.balance); $('bet').textContent = fmt(shownBet);
  const showFree = state.freeActive && state.freeCount > 0;
  $('lastWin').textContent = fmt(showFree ? state.freeTotal : state.lastWin); $('winLabel').textContent = showFree ? 'MOONSHOT WIN' : 'LAST WIN';
  $('freeCount').textContent = state.free ? `${state.free} MOONSHOTS · 2×` : 'LAYR';
  $('gamble').hidden = !canGamble;
  const label = primaryLabel(); $('spinText').textContent = label; $('spin').classList.toggle('small', label.length > 7);
  $('spin').disabled = (!labRun && (sessionLock || !LAYR.ready())) || spinInputBusy() || (scene && scene.kind === 'gamble' && scene.stage === 'play'); $('spin').setAttribute('aria-busy', String(spinInputBusy())); $('turbo').disabled = spinInputBusy();
  const lockBet = busy() || sessionLock || !!labRun;
  $('minus').disabled = lockBet || state.bet === bets[0]; $('plus').disabled = lockBet || state.bet === bets.at(-1); $('maxBet').disabled = lockBet || state.bet === bets.at(-1);
  $('account').disabled = spinning || sessionLock;
  $('turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('auto').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-MOO';
  $('sound').textContent = state.muted ? '♪̸' : '♫'; $('sound').setAttribute('aria-pressed', String(!state.muted)); $('sound').setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  $('labBtn').hidden = !DEV; $('testBtn').hidden = !DEV;
  screenDirty = true; syncFs();
}

/* ---------- Panels ---------- */
function showModal(type, title, html, tagText = 'MOONEEB') { stopAuto(); $('modalTag').textContent = tagText; $('modalContent').innerHTML = `<h2>${title}</h2>${html}`; if (!$('modal').open) $('modal').showModal(); syncFs(); }
function closeModal() { if ($('modal').open) $('modal').close(); update(); }
$('close').onclick = closeModal; $('modal').addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
$('modal').addEventListener('click', e => { if (e.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal(); } });
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const icon = s => iconURL[s] || (iconURL[s] = symbolImages[s] ? symbolImages[s].toDataURL() : '');
const FAIR = `<p>Mooneeb runs on the same engine as Forever Twins, The Drop and Block Fortune: five weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and every bonus prize dealt at that same moment. Only after the result is fixed does the machine choose which letter a tile shows or which LEO Cats twin floats by, so loaded art can never change a result.</p>
<table class="paytable"><thead><tr><th>PART</th><th>SHARE OF RETURN</th></tr></thead><tbody><tr><td>Line wins</td><td>59.7%</td></tr><tr><td>Moonshot scatter pays</td><td>1.5%</td></tr><tr><td>Moonshot free spins</td><td>8.5%</td></tr><tr><td>Mooney Bags (pick)</td><td>11.9%</td></tr><tr><td>Spell It (hold and respin)</td><td>10.3%</td></tr><tr><td>Full Mooneeb jackpot</td><td>2.4%</td></tr><tr><td><b>Total return to player</b></td><td><b>94.38%</b></td></tr></tbody></table>
<p>Moonshot and Mooney Bags each arrive about <b>1 in 140</b> spins, Spell It about <b>1 in 290</b>, and the Full Mooneeb jackpot about <b>1 in 113,000</b>. Moo or Moon is an even bet (50/50, double or nothing) and doesn't change the return. <b>This is a mathematical design estimate, not an independently certified RTP.</b></p>
<p class="fine">The LEO Cats Holder Pot takes 1% of each paid bet from the house edge (5.62%); it never reduces a player's win.</p>`;
function openFairPlay() { showModal('fair', 'Fair play.', FAIR + `<p class="fine">Uses the shared casino LAYR balance on this browser origin. On-chain verification and settlement are not connected.</p>`, 'FAIR PLAY'); }
function openRules() {
  const counts = E.symbols.map((s, i) => `${NAMES[s]} ${E.weights[i].join('/')}`).join(' · ');
  showModal('rules', 'The Moonmap.', `<p>Climb the word ladder: <b>M → MOO → MOON → MOONEY → MOONEEB</b>. Match 3, 4 or 5 symbols from the leftmost reel on any of 20 fixed paylines. Each line pays its best award; line wins add up. Line bet = total bet ÷ 20. <b>STX is wild</b>: it stands in for every ladder symbol and $LEO, and has its own pays, but never for Moonshot, Mooney bags or letter tiles.</p>
  <table class="paytable"><thead><tr><th>SYMBOL</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>${Object.entries(E.pays).reverse().map(([s, p]) => `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${NAMES[s]}</td>${p.map(v => `<td>${v}×</td>`).join('')}</tr>`).join('')}</tbody></table>
  <p class="fine">Multiples of the line bet. Five Mooneebs on one line at a 100 total bet pays 700 × 5 = 3,500 LAYR.</p>
  <h3><img class="pay-icon" src="${icon('scatter')}" alt="">MOONSHOT · FREE SPINS</h3><p>3, 4 or 5 rockets anywhere pay 2×, 5× or 10× your total bet and launch <b>8 free spins</b> into the starfield. Every win pays <b>2×</b>. More rockets add 4 spins, up to 24 per feature. Your bet is locked for the feature. Mooney Bags and Spell It can land during it and pay at 1×.</p>
  <h3><img class="pay-icon" src="${icon('vault')}" alt="">MOONEY BAGS · PICK</h3><p>3 or more Mooney bags anywhere put nine bags on a moonlit field. Each holds ${E.vaultPrizes.join(', ')} × your total bet, drawn with equal chance and sealed before you open any. Open three.</p>
  <h3><img class="pay-icon" src="${icon('chain')}" alt="">SPELL IT · HOLD AND RESPIN</h3><p>5 or more letter tiles start Spell It. Each locks with ${E.chainValues.join(', ')} × total bet (equal chance). You get 3 respins; each empty cell has a 1 in ${E.CHAIN_ODDS} (4%) chance to lock per respin, and any new letter resets the count to 3. The 15 cells spell MOONEEB twice and end with the Stacks wild. <b>Spell it all</b> for the Full Mooneeb jackpot as well.</p>
  <h3><img class="pay-icon" src="${icon('bitcoin')}" alt="">FULL MOONEEB · JACKPOT</h3><p>Five Mooneebs on the centre row (wilds don't count), or all 15 letters in Spell It, win the meter on top of your other wins. Each bet level has its own meter: it starts at ${E.JACKPOT_SEED}× that bet, grows by ${E.JACKPOT_RATE * 100}% of every paid bet at that level and resets after a win.</p>
  <h3>MOO OR MOON</h3><p>After a paid base-game win with no bonus, you may stake that win on one call: will the coin land cow side (<b>Moo</b>) or moon side (<b>Moon</b>)? The side is the last character of a fresh random hash: odd is Moo, even is Moon. Right doubles the win; wrong loses that win only.</p>
  <h3>20 FIXED PAYLINES</h3><div class="rule-grid">${E.lines.map((line, i) => `<div class="line-card"><svg viewBox="0 0 100 50"><path d="${line.map((y, x) => `${x ? 'L' : 'M'}${x * 22 + 6},${y * 18 + 7}`).join(' ')}" fill="none" stroke="#c084fc" stroke-width="2"/></svg>${String(i + 1).padStart(2, '0')}</div>`).join('')}</div>
  <h3>FAIR PLAY</h3>${FAIR}
  <h3>THE ART</h3><p>The ladder pictures (M, the cow, the moon, the leaping cow, the rocket, the MOO! burst) are pop art made for this machine, and the Mooney Bags are dropped across a map of Mooney Mooney, New South Wales; the cow jumping over the moon is from the traditional nursery rhyme. ${logos.leo ? '$LEO shows its official token image.' : '$LEO and STX show their names on a tile until their official files are added.'} The Mooneeb card waits for an image Muneeb has approved.</p>
  <p class="fine">Symbols per strip, reels 1 to 5: ${counts}. Uses the shared casino LAYR balance on this browser origin; on-chain settlement is not connected.</p><button class="outline" id="rulesTwins">The LEO Cats Holder Pot ↗</button>`, 'MOONMAP');
  $('rulesTwins').onclick = openTwins;
}
function openTwins() {
  const hl = holderLines(), sample = twins.slice(0, 12).map(t => `<img src="${(isForever(t) ? t.cardF : t.cardN).toDataURL()}" alt="LEO Cat #${t.tokenId}" style="width:72px;border-radius:8px;margin:3px">`).join('');
  showModal('twins', 'The LEO Cats Holder Pot.', `<p>Leopold, $LEO, is named after Muneeb's cat, so this machine's Holder Pot goes to the <b>LEO Cats</b> who have been made permanent as Forever Twins on Xtrata. 1% of every paid bet goes into the pot, paid from the house edge, and at the end of each week it is split equally per forevered twin.</p>
  <div class="stat-cards"><div><span>THIS WEEK'S POT</span><strong>${hl.pot} LAYR</strong></div><div><span>PERIOD</span><strong style="font-size:15px">${esc(hl.period)}</strong></div><div><span>PER TWIN</span><strong style="font-size:15px">${esc(hl.count)}</strong></div></div>
  <p><b>Cameos.</b> During Moonshot a real LEO Cats twin floats through the starfield on every spin. When that spin wins, the twin's token number and Xtrata ID go into the spin history, ready for the 1% cameo royalty. A LEO Cat that hasn't been twinned shows grey with a NOT YET FOREVER stamp and earns nothing until it is.</p>
  <div>${sample || '<p class="fine">Twins are still loading.</p>'}</div>
  <a class="cta" href="https://xtrata.xyz/forever-twins/collection/leo-cats" target="_blank" rel="noopener">Forever your LEO Cat ↗</a>
  <p class="fine">Version 1 shows the meter and records cameos only: payouts, holder spins and the Forever Fund need a snapshot service that isn't built yet. Twin data: ${esc(SRC.origin)} (registry ${esc(sources.registry)}, ${fmt(sources.bundled)} bundled, ${fmt(sources.images)} loaded live, count ${esc(sources.countState)}). Artwork belongs to the LEO Cats collection.</p>`, 'HOLDER POT');
}
function openHistory() {
  const rows = [...state.history.map(h => ({ ...h })), ...(labRun ? [] : labHistory)].sort((a, b) => b.time - a.time).slice(0, 60);
  const body = `<div class="stat-cards"><div><span>WAGERED · LAYR</span><strong>${fmt((realState || state).wagered)}</strong></div><div><span>PAID OUT · LAYR</span><strong>${fmt((realState || state).paidOut)}</strong></div></div><p>Latest rounds. Real rounds use the shared LAYR account; rounds marked <span class="tag-lab">LAB</span> ran on the separate lab balance and never touched it.</p><div style="max-height:340px;overflow:auto"><table class="paytable"><thead><tr><th>ROUND</th><th>BET</th><th>WIN</th><th>FEATURE · CAMEO</th></tr></thead><tbody>${rows.map(h => `<tr><td>${h.lab ? '<span class="tag-lab">LAB</span>' : ''}${new Date(h.time).toLocaleTimeString()} · ${esc(h.kind === 'Free spin' ? 'Moonshot spin' : h.kind || 'Spin')}</td><td>${fmt(h.bet)}</td><td>${fmt(h.win)}</td><td>${esc(featName(h.feature))}${h.cameo ? ` · LEO Cat #${h.cameo.tokenId} (Xtrata #${esc(h.cameo.xtrataId)}) on a ${fmt(h.cameo.lineWin)} win` : ''}</td></tr>`).join('')}</tbody></table></div><button class="cta" id="exportHistory">Export session JSON</button>`;
  showModal('history', 'Your LAYR session.', body, 'HISTORY');
  $('exportHistory').onclick = () => { const a = document.createElement('a'), url = URL.createObjectURL(new Blob([JSON.stringify({ game: GAME_ID, currency: 'LAYR', wagered: state.wagered, paidOut: state.paidOut, holder: state.holder, history: state.history, lab: labHistory }, null, 2)], { type: 'application/json' })); a.href = url; a.download = GAME_ID + '-layr-history.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
}
const featName = s => String(s || '').replace('GENESIS BLOCK', 'FULL MOONEEB').replace('CHAIN', 'SPELL IT').replace('VAULT', 'MOONEY BAGS').replace('RETRIGGER', 'MORE MOONSHOTS').replace('FREE SPINS', 'MOONSHOT');
function openAccount() { if (spinning) return; showModal('account', 'Your LAYR account.', `<div class="stat-cards"><div><span>AVAILABLE LAYR</span><strong>${fmt(labRun ? realState.balance : state.balance)}</strong></div><div><span>LAST WIN · LAYR</span><strong>${fmt(state.lastWin)}</strong></div></div><p>Every machine in the casino uses the same shared LAYR balance. Stakes leave this account and winnings return here automatically.</p><p class="fine">Local account on this browser origin. On-chain wallet verification and settlement are not connected.</p>`, 'SHARED LAYR ACCOUNT'); }
function openSettings() { showModal('settings', 'Settings.', `<label class="setting">Sound<input type="checkbox" id="setSound" ${state.muted ? '' : 'checked'}></label><label class="setting">Volume<input type="range" id="setVolume" min="0" max="1" step=".05" value="${state.volume}"></label><label class="setting">Low ambient hum<input type="checkbox" id="setAmbient" ${state.ambient ? 'checked' : ''}></label><label class="setting">Turbo (fast reels and quick bonus scenes)<input type="checkbox" id="setTurbo" ${state.turbo ? 'checked' : ''}></label><label class="setting">Reduced motion (calmer scenes, no particles)<input type="checkbox" id="setReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Show guide paylines<input type="checkbox" id="setLines" ${state.showLines ? 'checked' : ''}></label><p>Space spins and presses whatever a bonus is waiting for. 1–9 open Mooney bags. S skips a bonus to its summary. M mutes. F toggles fullscreen and Esc leaves it.${DEV ? ' L opens the Bonus Lab.' : ''}</p><p class="fine">${sessionLock && !labRun ? 'This tab is read-only because the session is open elsewhere.' : 'Your LAYR session is saved in this browser.'}</p><button class="outline" id="setTwins">Holder Pot</button><button class="outline" id="setHistory">History</button><button class="outline" id="setFair">Fair play</button>`, 'SETTINGS');
  const bind = (id, k, invert = false) => { const el = $(id); el.disabled = (k === 'turbo' || k === 'reduced') && spinInputBusy(); el.onchange = () => { if ((k === 'turbo' || k === 'reduced') && spinInputBusy()) { el.checked = invert ? !state[k] : !!state[k]; return; } state[k] = invert ? !el.checked : el.checked; save(); audioInit(); ambient(); update(); }; };
  bind('setSound', 'muted', true); bind('setAmbient', 'ambient'); bind('setTurbo', 'turbo'); bind('setReduced', 'reduced'); bind('setLines', 'showLines');
  $('setVolume').oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); sound('click'); };
  $('setTwins').onclick = openTwins; $('setHistory').onclick = openHistory; $('setFair').onclick = openFairPlay;
}

/* ---------- Bonus Lab: pick any bonus or event and play it through the full presentation, on a separate lab balance ---------- */
const LAB_ITEMS = [
  { id: 'free', name: 'Moonshot', desc: '3 rockets · 8 free spins at 2×', plan: ['free'] },
  { id: 'free-retrigger', name: 'Moonshot + retrigger', desc: '3 more rockets on the 2nd free spin', plan: ['free', null, 'scatter3'] },
  { id: 'vault', name: 'Mooney Bags', desc: 'Pick bonus · open three', plan: ['vault'] },
  { id: 'chain', name: 'Spell It', desc: 'Hold and respin', plan: ['chain'] },
  { id: 'chain-full', name: 'Spell It · full board', desc: 'All 15 letters lock · wins the jackpot', plan: ['chain'], fill: true },
  { id: 'jackpot', name: 'Full Mooneeb', desc: 'Five Mooneebs on the centre row', plan: ['jackpot'] },
  { id: 'gamble-win', name: 'Moo or Moon · win', desc: 'A line win, then the gamble lands your call', plan: ['line'], gamble: 'win' },
  { id: 'gamble-loss', name: 'Moo or Moon · loss', desc: 'A line win, then the gamble misses', plan: ['line'], gamble: 'loss' },
  { id: 'scatter3', name: 'Scatter pay · 3 rockets', desc: '2× total bet + Moonshot', plan: ['scatter3'] },
  { id: 'scatter4', name: 'Scatter pay · 4 rockets', desc: '5× total bet + Moonshot', plan: ['scatter4'] },
  { id: 'scatter5', name: 'Scatter pay · 5 rockets', desc: '10× total bet + Moonshot', plan: ['scatter5'] },
  { id: 'ladder', name: 'Climb the ladder', desc: 'Five spins: M, MOO, MOON, MOONEY, MOONEEB line wins light each rung', plan: ['rung0', 'rung1', 'rung2', 'rung3', 'rung4'] },
  { id: 'cameo', name: 'Moonshot cameos', desc: 'Free spins that keep winning, so each LEO Cat twin that floats by earns a cameo record', plan: ['free', 'line', 'line', 'line', 'line', 'line', 'line', 'line', 'line'] }
];
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const LAB_SYM = ['cherry', 'lemon', 'chip', 'block', 'bitcoin'];
const winStops = (() => { const has = [], mid = []; for (let c = 0; c < 5; c++) { has[c] = {}; mid[c] = {}; for (const s of BF.symbols) { has[c][s] = []; mid[c][s] = []; } for (let st = 0; st < 32; st++) { const w = BF.windowAt(c, st); for (const s of new Set(w)) has[c][s].push(st); mid[c][w[1]].push(st); } } return { has, mid }; })();
// Finds reel stops that land the wanted event, so the Lab drives the engine's own start(state, rng) and never bypasses it.
function findStops(want, rnd, bet) {
  const pick = a => a[Math.floor(rnd() * a.length)], any = () => Math.floor(rnd() * 32), not = (c, s) => { const h = new Set(winStops.has[c][s]); const o = []; for (let i = 0; i < 32; i++) if (!h.has(i)) o.push(i); return o; };
  const clean = ev => !ev.triggers.free && !ev.triggers.vault && !ev.triggers.chain && !ev.jackpot;
  const test = { free: ev => ev.scatters === 3 && !ev.triggers.vault && !ev.triggers.chain && !ev.jackpot, vault: ev => ev.triggers.vault && !ev.triggers.free && !ev.triggers.chain && !ev.jackpot, chain: ev => ev.triggers.chain && !ev.triggers.free && !ev.triggers.vault && !ev.jackpot, jackpot: ev => ev.jackpot && !ev.triggers.free && !ev.triggers.vault && !ev.triggers.chain, line: ev => clean(ev) && ev.wins.length > 0 };
  let k = 0, gen;
  if (/^scatter\d$/.test(want) || want === 'free') { k = want === 'free' ? 3 : Number(want.slice(-1)); test[want] = test[want] || (ev => ev.scatters === k && !ev.triggers.vault && !ev.triggers.chain && !ev.jackpot); gen = () => { const reels = [0, 1, 2, 3, 4].sort(() => rnd() - .5).slice(0, k); return [0, 1, 2, 3, 4].map(c => reels.includes(c) ? pick(winStops.has[c].scatter) : pick(not(c, 'scatter'))); }; }
  else if (want === 'vault') gen = () => [0, 1, 2, 3, 4].map(c => rnd() < .7 ? pick(winStops.has[c].vault) : pick(not(c, 'vault')));
  else if (want === 'chain') gen = () => [0, 1, 2, 3, 4].map(c => rnd() < .85 ? pick(winStops.has[c].chain) : any());
  else if (want === 'jackpot') gen = () => [0, 1, 2, 3, 4].map(c => pick(winStops.mid[c].bitcoin));
  else if (/^rung\d$/.test(want)) { const sym = LAB_SYM[Number(want.slice(-1))]; test[want] = ev => clean(ev) && ev.wins.some(w => w.symbol === sym); gen = () => [0, 1, 2, 3, 4].map(c => c < 3 ? pick(winStops.has[c][sym]) : any()); }
  else gen = () => [0, 1, 2, 3, 4].map(c => c < 3 ? pick(winStops.has[c][pick(LAB_SYM)]) : any());
  for (let i = 0; i < 400000; i++) { const stops = gen(), ev = BF.evaluate(stops.map((s, c) => BF.windowAt(c, s)), bet); if (test[want](ev)) return stops; }
  return null;
}
function labStartRng() {
  if (!labRun) return undefined; const want = labRun.plan[labRun.step++], rnd = labRun.rnd, bet = state.free ? state.freeBet : state.bet;
  const stops = want ? findStops(want, rnd, bet) : null; let n = 0;
  if (want && !stops) toast(`Lab couldn't land "${want}" with this seed; spinning naturally.`);
  return m => { if (n < 5) { n++; return stops ? stops[n - 1] : Math.floor(rnd() * m); } if (labRun && labRun.item.fill && m === BF.CHAIN_ODDS) return 0; return Math.floor(rnd() * m); };
}
function labGambleRng(choice) { if (!labRun || !labRun.item.gamble) return undefined; const win = labRun.item.gamble === 'win', rnd = labRun.rnd; let first = true; return m => { if (first && m === 2) { first = false; return (choice === 'moo') === win ? 1 : 0; } return Math.floor(rnd() * m); }; }
function labLog() {} function labCollect() {}
function labGambleLog(r) { state.history.unshift({ id: 'g' + Date.now(), time: Date.now(), bet: 0, win: r.amount, kind: 'Gamble', feature: `MOO OR MOON · ${r.win ? 'WIN' : 'LOSS'}`, lab: true }); }
function labStep() { if (!labRun) return; if (labRun.step < labRun.plan.length) { setTimeout(() => { if (labRun && !spinning && !scene) spin(); }, quick() ? 300 : 900); return; } endLab(); }
function startLab(id, bet, seed, auto = false) {
  const item = LAB_ITEMS.find(i => i.id === id); if (!item) return;
  if (spinning || scene || feature() || state.free > 0 || freeMode) { toast('Finish this spin or bonus first.'); return; }
  stopAuto(); closeModal();
  if (!labRun) realState = state;
  const s = seed == null || seed === '' ? (crypto.getRandomValues(new Uint32Array(1))[0]) : Number(seed) >>> 0;
  const ls = BF.fresh(); Object.assign(ls, { balance: labBalance, bet, freeBet: bet, muted: realState.muted, volume: realState.volume, turbo: realState.turbo, reduced: realState.reduced, showLines: false, holder: { period: weekKey(), pot: 0, last: null } });
  ls.grid = realState.grid.map(c => c.slice()); ls.stops = realState.stops.slice();
  state = ls; G = BF; lastResult = null; labRun = { item, bet, seed: s, rnd: mulberry32(s), plan: item.plan.slice(), step: 0, auto: !!auto, gamble: !!item.gamble };
  labLast = { id, bet, seed: s, auto };
  status(`BONUS LAB · ${item.name.toUpperCase()} · SEED ${s}`); toast(`Bonus Lab: ${item.name} · seed ${s}`); update(); spin();
}
function endLab() {
  if (!labRun) return; const item = labRun.item;
  labHistory = [...state.history.map(h => ({ ...h, lab: true, labItem: item.name })), ...labHistory].slice(0, 80);
  labBalance = state.balance; state = realState; realState = null; G = E; labRun = null; freeMode = false; music(false); scene = null; sceneQueue = []; lastResult = null; faces = state.grid.map(col => col.map(pickFace));
  hideBar(); update(); status('LAB RUN FINISHED · BACK TO YOUR REAL LAYR'); toast(`Lab run finished: ${item.name}. Back to your real balance.`);
  if (labAll) { labAll.i++; if (labAll.i < LAB_ITEMS.length) setTimeout(() => startLab(LAB_ITEMS[labAll.i].id, labAll.bet, labAll.seed, true), 900); else { labAll = null; toast('Run all finished: every Lab item played.'); } }
}
function labAutoTick(now) {
  if (!labRun || !labRun.auto || !scene) return; const s = scene, age = now - s.t0, wait = quick() ? 500 : 1400;
  if (s.stage === 'intro' && age > wait) { if (s.kind === 'gamble') callGamble('moo'); else primaryAction(); }
  else if (s.stage === 'play' && s.kind === 'vault' && s.f.picks.length < 3 && age > wait * (s.f.picks.length + 1) * .6) pickBag([4, 0, 8, 2, 6, 1, 3, 5, 7].find(i => !s.f.picks.includes(i)));
  else if (s.stage === 'play' && s.kind === 'jackpot' && age > dur('jackpotPlay')) setStage('outro');
  else if (s.stage === 'outro' && now - s.count0 > dur('outroCount') + wait) primaryAction();
}
function openLab() {
  if (!DEV) return; const sel = labLast ? labLast.id : 'free', bet = labLast ? labLast.bet : state.bet;
  showModal('lab', 'Bonus Lab.', `<p>Choose a bonus or event and press Run: it plays at once through the full presentation, exactly as a player would see it. Lab runs use a <b>separate lab balance</b> (${fmt(labBalance)} LAYR), are marked LAB in History, and never touch the real LAYR account, the jackpot meters, the Holder Pot or the RTP statistics. The Lab passes a scripted random source into the engine's own <code>start(state, rng)</code>; it never edits or bypasses the engine.</p>
  <div class="lab-list">${LAB_ITEMS.map(i => `<label><input type="radio" name="labItem" value="${i.id}" ${i.id === sel ? 'checked' : ''}><span><b>${esc(i.name)}</b><small>${esc(i.desc)}</small></span></label>`).join('')}</div>
  <div class="lab-row"><label>Bet <select id="labBet">${bets.map(b => `<option ${b === bet ? 'selected' : ''}>${b}</option>`).join('')}</select></label><span class="seg" role="group" aria-label="Seed mode"><button id="labSeeded" aria-pressed="${labLast && labLast.seed != null ? 'true' : 'false'}">Seeded</button><button id="labRandom" aria-pressed="${labLast && labLast.seed != null ? 'false' : 'true'}">Random</button></span><label>Seed <input type="number" id="labSeed" min="0" value="${labLast ? labLast.seed : 1337}" style="width:120px"></label><label><input type="checkbox" id="labAuto" ${labLast && labLast.auto ? 'checked' : ''}> Auto-advance</label></div>
  <button class="cta" id="labRun">Run ▶</button><button class="outline" id="labReplay" ${labLast ? '' : 'disabled'}>Replay last</button><button class="outline" id="labAllBtn">Run all</button><button class="outline" id="labReset">Reset lab balance</button>`, 'BONUS LAB · TESTING ONLY');
  let seeded = !(labLast && labLast.seed == null) && $('labSeeded').getAttribute('aria-pressed') === 'true';
  const seg = v => { seeded = v; $('labSeeded').setAttribute('aria-pressed', String(v)); $('labRandom').setAttribute('aria-pressed', String(!v)); $('labSeed').disabled = !v; }; seg(seeded);
  $('labSeeded').onclick = () => seg(true); $('labRandom').onclick = () => seg(false);
  const read = () => ({ id: document.querySelector('[name=labItem]:checked').value, bet: Number($('labBet').value), seed: seeded ? $('labSeed').value : null, auto: $('labAuto').checked });
  $('labRun').onclick = () => { const r = read(); startLab(r.id, r.bet, r.seed, r.auto); };
  $('labReplay').onclick = () => { if (labLast) startLab(labLast.id, labLast.bet, labLast.seed, labLast.auto); };
  $('labAllBtn').onclick = () => { const r = read(); labAll = { i: 0, bet: r.bet, seed: r.seed == null ? null : r.seed }; startLab(LAB_ITEMS[0].id, r.bet, labAll.seed, true); };
  $('labReset').onclick = () => { labBalance = 100000; toast('Lab balance reset to 100,000.'); openLab(); };
}

/* ---------- Test panel (test build only): twins state, balance reset, RTP simulation ---------- */
function simulate(n, onProgress) {
  return new Promise(resolve => {
    const st = BF.fresh(); st.balance = 1e15; st.bet = 100; const rnd = mulberry32(20261102), rng = m => Math.floor(rnd() * m);
    const parts = { lines: 0, scatters: 0, free: 0, pick: 0, hold: 0, jackpot: 0 }; let paid = 0, wager0 = 0, trig = { free: 0, vault: 0, chain: 0, jackpot: 0 };
    const step = () => {
      const end = Math.min(n, paid + 20000);
      while (paid < end) {
        const freeSpin = st.free > 0; if (!freeSpin) paid++;
        BF.start(st, rng); const r = BF.settle(st);
        if (freeSpin) parts.free += r.total - r.jackpotWin; else { parts.lines += r.lineTotal; parts.scatters += r.scatterPay; if (r.triggers.free) trig.free++; if (r.triggers.vault) trig.vault++; if (r.triggers.chain) trig.chain++; }
        parts.jackpot += r.jackpotWin; if (r.jackpotWin) trig.jackpot++;
        while (st.features.length) { const f = BF.feature(st); if (f.type === 'vault') { BF.pick(st, 0); BF.pick(st, 1); BF.pick(st, 2); } else while (BF.respin(st)); const c = BF.collect(st); if (c.type === 'vault') parts.pick += c.amount; else { parts.hold += c.amount - c.jackpotWin; parts.jackpot += c.jackpotWin; if (c.jackpotWin) trig.jackpot++; } }
        if (st.freeActive && !st.free) BF.endFree(st); st.gamble = 0; st.history.length = 0;
      }
      onProgress(paid / n, st, parts, trig);
      if (paid < n) setTimeout(step, 0); else resolve({ n, wagered: st.wagered, paidOut: st.paidOut, parts, trig });
    };
    step();
  });
}
function openTest() {
  if (!DEV) return;
  showModal('test', 'Test panel.', `<p><span class="badge-test">TEST BUILD</span> These controls exist only on the standalone test page and behind the developer flag.</p>
  <h3>TWINS STATE</h3><p>Switch how the LEO Cats in the Moonshot starfield count, to check the NOT YET FOREVER look and the Holder Pot display. This never changes a result.</p><span class="seg" role="group" aria-label="Twins state">${['live', 'all', 'some', 'none'].map(m => `<button data-twins="${m}" aria-pressed="${twinsMode === m}">${m === 'live' ? 'Live' : m[0].toUpperCase() + m.slice(1)}</button>`).join('')}</span>
  <h3>BALANCE</h3><button class="outline" id="testReset" ${LAYR.testReset ? '' : 'disabled'}>Reset test balance</button><button class="outline" id="testLab">Open the Bonus Lab</button>
  <h3>RTP SIMULATION</h3><p>Runs the engine with a seeded random source on a throwaway state (nothing here touches your balance, meters or pot). Expect 94.38%.</p><button class="outline" data-sim="200000">200,000 spins</button><button class="outline" data-sim="1000000">1,000,000 spins</button><button class="outline" data-sim="5000000">5,000,000 spins</button><div class="meterbar"><i id="simBar"></i></div><div id="simOut" class="fine">Not run yet.</div>`, 'TEST PANEL');
  document.querySelectorAll('[data-twins]').forEach(b => b.onclick = () => { twinsMode = b.dataset.twins; document.querySelectorAll('[data-twins]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); screenDirty = true; toast(`Twins state: ${twinsMode}`); });
  $('testReset').onclick = () => { try { LAYR.testReset(); toast('Test balance reset.'); update(); } catch (e) { toast(e.message); } };
  $('testLab').onclick = openLab;
  document.querySelectorAll('[data-sim]').forEach(b => b.onclick = async () => { const n = Number(b.dataset.sim); document.querySelectorAll('[data-sim]').forEach(x => x.disabled = true); const t0 = performance.now();
    const r = await simulate(n, (p, st, parts) => { if ($('simBar')) $('simBar').style.width = (p * 100).toFixed(1) + '%'; if ($('simOut')) $('simOut').textContent = `${Math.round(p * n).toLocaleString()} spins · RTP so far ${(st.paidOut / st.wagered * 100).toFixed(2)}%`; });
    const pct = v => (v / r.wagered * 100).toFixed(2) + '%', per = k => r.trig[k] ? `1 in ${Math.round(n / r.trig[k]).toLocaleString()}` : '—';
    if ($('simOut')) $('simOut').innerHTML = `<b>RTP ${(r.paidOut / r.wagered * 100).toFixed(3)}%</b> over ${n.toLocaleString()} paid spins (${((performance.now() - t0) / 1000).toFixed(1)}s, seed 20261102).<br>Lines ${pct(r.parts.lines)} · scatters ${pct(r.parts.scatters)} · free spins ${pct(r.parts.free)} · pick ${pct(r.parts.pick)} · hold ${pct(r.parts.hold)} · jackpot ${pct(r.parts.jackpot)}<br>Moonshot ${per('free')} · Mooney Bags ${per('vault')} · Spell It ${per('chain')} · jackpots ${r.trig.jackpot}`;
    document.querySelectorAll('[data-sim]').forEach(x => x.disabled = false); });
}

/* ---------- Fullscreen: the screen fills the view and every control except the lever sits on one bottom bar ---------- */
const frameEl = (() => { try { return window.frameElement; } catch (e) { return null; } })();
let fsApi = false, fsPrevStyle = '';
function fsDoc() { return frameEl ? frameEl.ownerDocument : document; }
function setFullscreen(on) {
  if (on === fsOn) return; fsOn = on; document.body.classList.toggle('fs', on);
  if (on) {
    if (frameEl) { fsPrevStyle = frameEl.getAttribute('style') || ''; frameEl.setAttribute('style', 'position:fixed!important;inset:0!important;left:0!important;top:0!important;width:100vw!important;height:100vh!important;height:100dvh!important;z-index:2147483000!important;border:0!important;display:block!important;visibility:visible!important;opacity:1!important;transform:none!important;pointer-events:auto!important;clip:auto!important;clip-path:none!important;max-width:none!important;max-height:none!important;background:#05010c!important'); frameEl.removeAttribute('aria-hidden'); frameEl.tabIndex = 0; }
    const el = frameEl || document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
    fsApi = false; if (req) { try { const p = req.call(el); fsApi = true; if (p && p.catch) p.catch(() => { fsApi = false; }); } catch (e) { fsApi = false; } }
    try { window.focus(); } catch (e) {} setTimeout(() => $('fsBar').querySelector('button')?.focus({ preventScroll: true }), 50);
  } else {
    const d = fsDoc(); if (d.fullscreenElement && (d.exitFullscreen || d.webkitExitFullscreen)) { try { (d.exitFullscreen || d.webkitExitFullscreen).call(d)?.catch?.(() => {}); } catch (e) {} }
    if (frameEl) { if (fsPrevStyle) frameEl.setAttribute('style', fsPrevStyle); else frameEl.removeAttribute('style'); frameEl.setAttribute('aria-hidden', 'true'); frameEl.tabIndex = -1; try { frameEl.ownerDocument.defaultView.focus(); } catch (e) {} }
  }
  if (frameEl && frameEl.ownerDocument.defaultView.PXMachineFullscreenChanged) try { frameEl.ownerDocument.defaultView.PXMachineFullscreenChanged(on); } catch (e) {}
  screenDirty = true; syncFs(); update();
}
try { fsDoc().addEventListener('fullscreenchange', () => { if (fsOn && fsApi && !fsDoc().fullscreenElement) { fsApi = false; setFullscreen(false); } }); } catch (e) {}
function fullscreen() { setFullscreen(!fsOn); }
const FSB = [
  ['spin', 'MOO', 'Spin', () => spinClick(), 'primary'], ['betDown', '−MOO', 'Bet −', () => changeBet(-1)], ['bet', '', 'Bet', null, 'info'], ['betUp', '+MOO', 'Bet +', () => changeBet(1)],
  ['auto', 'AUTO-MOO', 'Auto', () => autoClick()], ['sep'], ['callMoo', 'MOO', 'Gamble · cow', () => { if (!scene) openGamble(); else callGamble('moo'); }, 'gold'], ['callMoon', 'MOON', 'Gamble · moon', () => { if (!scene) openGamble(); else callGamble('moon'); }, 'gold'], ['skip', 'SKIP', 'Skip bonus', () => skipScene()],
  ['sep'], ['pays', 'MOONMAP', 'Pays', () => openRules()], ['fair', 'FAIR PLAY', 'Fair play', () => openFairPlay()], ['turbo', 'TURBO', 'Turbo', () => { if (spinInputBusy()) return; state.turbo = !state.turbo; save(); update(); }],
  ['sound', 'SOUND', 'Sound', () => { state.muted = !state.muted; audioInit(); ambient(); save(); update(); }], ['vol'], ['history', 'HISTORY', 'History', () => openHistory()], ['holder', 'POT', 'Holder', () => openTwins()], ['settings', '⚙', 'Settings', () => openSettings()],
  ['balance', '', 'Balance', null, 'info'], ['sep'], ['lab', 'LAB', 'Bonus lab', () => openLab()], ['test', 'TEST', 'Test panel', () => openTest()], ['exit', 'EXIT', 'Fullscreen', () => setFullscreen(false)]
];
(function buildFsBar() { const bar = $('fsBar'); bar.innerHTML = FSB.map(([id, big, small, , cls]) => id === 'sep' ? '<span class="fs-sep"></span>' : id === 'vol' ? `<label class="fsb vol"><small>VOL</small><input type="range" id="fsVol" min="0" max="1" step=".05" aria-label="Volume"></label>` : `<button class="fsb ${cls || ''}" id="fs_${id}" ${cls === 'info' ? 'tabindex="-1" aria-live="polite"' : ''}><b>${big}</b><small>${small}</small></button>`).join('');
  FSB.forEach(([id, , , fn]) => { if (fn) $('fs_' + id).onclick = () => { audioInit(); fn(); }; });
  $('fsVol').oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); };
  // The bar's one large button: whatever the bonus is waiting for. In Mooney Bags it opens an unopened bag (prizes were dealt before the bonus began).
  $('fsAction').onclick = () => { audioInit(); if (scene && scene.kind === 'vault' && scene.stage === 'play' && scene.f.picks.length < 3) { const left = [...Array(9).keys()].filter(i => !scene.f.picks.includes(i)); pickBag(left[Math.floor(Math.random() * left.length)]); syncFs(); return; } spinClick(); }; })();
function syncFs() {
  if (!$('fsBar')) return; const canGamble = state.gamble > 0 && !busy(), gambleOpen = scene && scene.kind === 'gamble' && scene.stage === 'intro', label = primaryLabel();
  $('fs_spin').querySelector('b').textContent = label; $('fs_spin').disabled = $('spin').disabled;
  $('fs_bet').querySelector('b').textContent = fmt(scene && scene.f ? scene.f.bet : state.free ? state.freeBet : state.bet); $('fs_balance').querySelector('b').textContent = fmt(state.balance) + (labRun ? ' LAB' : '');
  $('fs_betDown').disabled = $('minus').disabled; $('fs_betUp').disabled = $('plus').disabled;
  $('fs_auto').setAttribute('aria-pressed', String(autoLeft > 0)); $('fs_auto').querySelector('b').textContent = autoLeft ? `STOP ${autoLeft}` : 'AUTO-MOO';
  $('fs_turbo').setAttribute('aria-pressed', String(!!state.turbo)); $('fs_sound').setAttribute('aria-pressed', String(!state.muted)); $('fs_sound').querySelector('b').textContent = state.muted ? 'MUTED' : 'SOUND'; $('fsVol').value = state.volume;
  for (const id of ['callMoo', 'callMoon']) $('fs_' + id).hidden = !(canGamble || gambleOpen);
  $('fs_skip').hidden = !(scene || freeMode) || (scene && scene.kind === 'gamble'); $('fs_lab').hidden = !DEV; $('fs_test').hidden = !DEV;
  const picking = scene && scene.kind === 'vault' && scene.stage === 'play' && scene.f.picks.length < 3, waiting = picking || (scene && !(scene.kind === 'gamble' && scene.stage !== 'outro') && !(scene.kind === 'vault' && scene.stage === 'play'));
  // The floating button only appears while bags are waiting to be opened: every other wait has its own button on the screen and the bar's first button.
  const fa = $('fsAction'); fa.hidden = !fsOn || !picking; fa.textContent = picking ? 'OPEN A BAG' : '';
  if (picking) { const c = $('fsCanvas').getBoundingClientRect(), st = $('fsStage').getBoundingClientRect(); fa.style.left = (c.left - st.left + c.width / 2) + 'px'; fa.style.top = (st.bottom - c.bottom > 90 ? c.bottom - st.top + 44 : c.top - st.top + c.height * 852 / 960) + 'px'; }   // below the screen when there is room (phones), else over the hint line under the reels
  void waiting;
}
addEventListener('resize', () => { if (fsOn) syncFs(); });
function copyScreen(c) { const g = c.getContext('2d'); if (c.width !== screen.width) { c.width = screen.width; c.height = screen.height; } g.drawImage(screen, 0, 0); }
function screenTap(x, y) { for (let i = sbtn.length - 1; i >= 0; i--) { const b = sbtn[i]; if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { audioInit(); b.act(); screenDirty = true; return true; } } return false; }
for (const id of ['fsCanvas', 'pageCanvas']) { const c = $(id); c.addEventListener('click', e => { const r = c.getBoundingClientRect(); screenTap((e.clientX - r.left) / r.width * 1400, (e.clientY - r.top) / r.height * 960); }); c.addEventListener('pointermove', e => { if (!scene) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 1400, y = (e.clientY - r.top) / r.height * 960, b = sbtn.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); scene.hover = b ? b.id : ''; c.style.cursor = b ? 'pointer' : ''; }); }

/* ---------- Wiring ---------- */
$('spin').onclick = spinClick; $('minus').onclick = () => changeBet(-1); $('plus').onclick = () => changeBet(1); $('maxBet').onclick = () => changeBet(0, true);
$('auto').onclick = autoClick; $('turbo').onclick = () => { if (spinInputBusy()) return; state.turbo = !state.turbo; save(); update(); toast(state.turbo ? 'Turbo on.' : 'Normal speed.'); };
$('account').onclick = openAccount; $('gamble').onclick = openGamble; $('rules').onclick = openRules; $('help').onclick = openRules; $('historyLink').onclick = openHistory; $('settings').onclick = openSettings; $('fullscreen').onclick = fullscreen; $('fairplay').onclick = openFairPlay; $('labBtn').onclick = openLab; $('testBtn').onclick = openTest;
$('sound').onclick = () => { state.muted = !state.muted; audioInit(); ambient(); save(); update(); toast(state.muted ? 'Sound off.' : 'Sound on.'); };
document.querySelector('.brand').onclick = e => e.preventDefault();
addEventListener('keydown', e => {
  if (e.repeat || e.target.matches('input,textarea,select')) return;
  if ($('modal').open) { if (e.key === 'Escape') { e.preventDefault(); closeModal(); } return; }
  const k = e.key.toLowerCase();
  if (e.code === 'Space') { e.preventDefault(); spinClick(); }
  else if (/^[1-9]$/.test(e.key) && scene && scene.kind === 'vault') pickBag(Number(e.key) - 1);
  else if (k === 'm') $('sound').click(); else if (k === 'f') fullscreen(); else if (k === 's' && (scene || freeMode)) skipScene(); else if (k === 'l' && DEV) openLab(); else if (k === 't') $('turbo').click();
  else if (e.key === 'Escape') { if (autoLeft) { stopAuto(); status('AUTO-MOO STOPPED'); } else if (fsOn) setFullscreen(false); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAuto(); if (ac) ac.suspend().catch(() => {}); } else if (ac && !state.muted) ac.resume().catch(() => {}); });

/* ---------- Frame loop: idle frames capped near 30 fps ---------- */
function drawScreen(now, dt = 0) {
  sbtn = []; sg.drawImage(baseLayer, 0, 0);
  const f = feature(), shownBet = f ? f.bet : state.free ? state.freeBet : state.bet;
  drawTop(now, shownBet);
  if (!artReady) text(sg, 'CLIMBING THE LADDER…', 700, RY + RH / 2, 30, '#e9dcff');
  else if (scene) drawScene(now);
  else if (freeMode) { drawStarfield(now); drawReels(now); drawFreeOverlay(now); }
  else drawReels(now);
  let msg = $('status').textContent, mc = '#e9dcff';
  if (scene) { const c = SCENE[scene.kind] || {}; msg = `${c.title ? c.title.toUpperCase() : ''} · ${scene.stage === 'trigger' ? 'TRIGGERED' : scene.stage === 'intro' ? (c.rule || '').toUpperCase() : scene.stage === 'play' ? 'IN PLAY' : 'SUMMARY'}`; mc = c.color || GOLD; }
  else if (freeMode && !spinning) mc = '#6fe3ff';
  fitText(sg, msg, 700, 812, 24, 1300, mc, '800');
  text(sg, `LAYR  ${fmt(state.balance)}${labRun ? '  (LAB)' : ''}`, 68, 920, 26, '#f4ecff', 'Arial', 'left'); text(sg, `BET  ${fmt(shownBet)}`, 700, 920, 26, '#f4ecff'); text(sg, `WIN  ${fmt(state.freeActive && state.freeCount ? state.freeTotal : state.lastWin)}`, 1332, 920, 26, GOLD, 'Arial', 'right');
  drawFx(dt); drawMooBurst(now);
  screenRev++; screenDirty = false;
  if (fsOn) copyScreen($('fsCanvas')); if (!HOSTED) copyScreen($('pageCanvas'));
}
let lastFrame = 0;
const perf = { frames: 0, drawn: 0 };
function animate(now){if(!pxEngineActive){requestAnimationFrame(animate);return;}
  requestAnimationFrame(animate); const dt = Math.min(.06, (now - (animate.last || now)) / 1000); animate.last = now; perf.frames++;
  if (spinning && animations.every(a => now >= a.start + a.duration)) { drawScreen(now, dt); finishSpin(); }
  const glowHold = (scene && scene.kind === 'jackpot') || now < winUntil; for (let i = 0; i < 5; i++) if (!glowHold) ladderGlow[i] = Math.max(0, ladderGlow[i] - dt * .5); excite = Math.max(0, excite - dt * (scene ? .05 : .4));
  labAutoTick(now);
  const live = spinning || scene || freeMode || fx.length || now - mooBurstAt < 1700 || ladderGlow.some(v => v > 0) || highlightIndex(now) >= 0;
  if (spinning ? now - lastDraw > 16 : (screenDirty || (live && now - lastDraw > 32))) { drawScreen(now, dt); lastDraw = now; perf.drawn++; }
}

/* ---------- Boot ---------- */
function resume() {
  state=LAYR.openGame(GAME_ID,E);G=E;
  faces = state.grid.map(col => col.map(pickFace));
  if (state.pending) { lastResult = E.settle(state); setTimeout(() => toast('Your interrupted spin has been restored and settled.'), 900); }
  holder(); save(); update();
  const f = feature();
  if (f) { scene = null; startScene(f.type, { resumed: true }); if (f.type === 'vault' && f.picks.length && !E.featureDone(f)) scene.stage = 'play'; status('YOUR BONUS IS SAVED · CARRY ON'); }
  else if (state.free) { startScene('free', { resumed: true }); status(`${state.free} SAVED MOONSHOTS · ALL WINS 2×`); }
  else if (state.freeActive) setTimeout(flow, 800);
}
update(); buildArt(); loadTwins().catch(() => { sources.done = true; }); setTimeout(() => loadLiveLogos().catch(() => {}), 1500);
for (const id of ['brandmark']) { const el = $(id); if (el) xtrataLogo(el.getContext('2d'), el.width / 2, el.height / 2, el.width * .9); }
requestAnimationFrame(animate);
requestAnimationFrame(() => { window.__bfReady = true; const l = $('loading'); if (l) { l.style.opacity = 0; setTimeout(() => l.remove(), 550); } });
// Read-only diagnostics for automated tests of the self-contained build.
window.Mooneeb = Object.freeze({ version: '1.0.0', machine: GAME_ID, lastWins: () => lastResult ? lastResult.wins.map(w => w.symbol) : [],
  snapshot: () => JSON.parse(JSON.stringify({ state, spinning, autoLeft, scene: scene ? { kind: scene.kind, stage: scene.stage } : null, freeMode, fsOn, lab: labRun ? { item: labRun.item.id, seed: labRun.seed, step: labRun.step } : null, sessionLock, twinsMode })),
  scene: () => scene ? { kind: scene.kind, stage: scene.stage, picks: scene.f && scene.f.picks ? scene.f.picks.slice() : null } : null, sources: () => ({ ...sources, twins: twins.length, logos: { ...logoSrc } }),
  lab: { items: LAB_ITEMS.map(i => i.id), run: (id, bet = 100, seed = 1337, auto = false) => startLab(id, bet, seed, auto), active: () => !!labRun, allActive: () => !!labAll, runAll: (bet = 100, seed = 1337) => { labAll = { i: 0, bet, seed }; startLab(LAB_ITEMS[0].id, bet, seed, true); }, history: () => labHistory.slice(), balance: () => labRun ? state.balance : labBalance },
  act: { primary: () => primaryAction(), skip: () => skipScene(), pick: i => pickBag(i), call: c => callGamble(c), gamble: () => openGamble(), fullscreen: on => setFullscreen(on), twins: m => { twinsMode = m; screenDirty = true; } },
  soundLog: () => soundLog.map(e => ({ ...e })), fx: () => fx.length, ladder: () => ladderGlow.slice(), holder: () => ({ ...holder() }), jackpots: () => ({ ...(realState || state).jackpots }), perf: () => ({ ...perf }), buttons: () => sbtn.map(b => ({ id: b.id, x: b.x, y: b.y, w: b.w, h: b.h })), rules: { lines: E.lines, pays: E.pays, strips: E.stripCodes }, simulate });
// Cached cabinets borrow the room's LAYR account; they never own a second wallet.
let pxSessionOwned=false,pxSessionEpoch=0,pxSessionPending=null;
function pxReleaseLease(){pxSessionEpoch++;pxSessionOwned=false;sessionLock=true;}
async function pxClaimSession(){
  if(pxSessionOwned&&LAYR.ready())return true;
  if(pxSessionPending)return pxSessionPending;
  const epoch=pxSessionEpoch;
  pxSessionPending=(async()=>{
    if(!await LAYR.acquire()||epoch!==pxSessionEpoch){sessionLock=true;update();status(LAYR.error()||'LAYR connection was cancelled.');return false;}
    sessionLock=false;state=LAYR.openGame(GAME_ID,E);resume();pxSessionOwned=true;return true;
  })().finally(()=>{pxSessionPending=null;});
  return pxSessionPending;
}

// A canvas-and-controls API. The casino owns all visible 3D rendering and cameras.
const pxSourceElements=new Map(),pxSourceTokens=new WeakMap();let pxToken=0;
function pxPort(element){if(!element)return '';for(const n of [element,...element.querySelectorAll('*')]){if(!pxSourceTokens.has(n)){const id=String(++pxToken);pxSourceTokens.set(n,id);pxSourceElements.set(id,n);}n.setAttribute('data-px-source',pxSourceTokens.get(n));}return element.outerHTML;}
function pxControl(action){
  const map={spin:spinClick,betDown:()=>changeBet(-1),betUp:()=>changeBet(1),auto:autoClick,pays:openRules,settings:openSettings,history:openHistory,account:openAccount,fairplay:openFairPlay,holder:openTwins,skip:skipScene,primary:primaryAction,lab:openLab,test:openTest,fullscreen:()=>setFullscreen(!fsOn),gamble:openGamble,moo:()=>scene?callGamble('moo'):openGamble(),moon:()=>scene?callGamble('moon'):openGamble(),max:()=>changeBet(0,true),
    sound:()=>$('sound').click(),turbo:()=>$('turbo').click()};
  (map[action]||(()=>{}))();
}
window.PX_CASINO_ENGINE={
  screen,revision:()=>screenRev,
  refreshAccount(){screenDirty=true;update();drawScreen(performance.now());},
  // lever and spin button as the room expects; lights, ladder and topper excitement are extras a host may use for the light show.
  mechanics(){return {lever:leverStart>0&&performance.now()-leverStart<900?{id:leverStart,elapsed:Math.max(0,performance.now()-leverStart),duration:900,angle:1.02}:null,spinZ:null,armZ:null,lights:excite,ladder:ladderGlow.slice(),scene:scene?scene.kind+':'+scene.stage:freeMode?'free:play':'',jackpot:!!(scene&&scene.kind==='jackpot')};},
  async activate(){const epoch=pxSessionEpoch,ready=await pxClaimSession();if(epoch!==pxSessionEpoch)throw new Error('Connection was cancelled. Reconnect to play.');if(!ready)throw new Error(LAYR.error()||'The LAYR account is unavailable. Close the other casino tab, then reconnect.');pxEngineActive=true;animate.last=performance.now();screenDirty=true;update();drawScreen(performance.now());},
  deactivate(){if(spinning)return false;stopAuto();if(fsOn)setFullscreen(false);clearTimeout(freeTimer);music(false);if(labRun)endLab();if(pxEngineActive)save();pxEngineActive=false;if(ac)ac.suspend().catch(()=>{});pxReleaseLease();return true;},
  action(name){if(pxEngineActive)pxControl(name);},
  stopAuto(){stopAuto();},
  tap(x,y){screenTap(x,y);},
  key(code,key){document.body.dispatchEvent(new KeyboardEvent('keydown',{code,key,bubbles:true}));},
  closeModal(){closeModal();},
  click(token){const el=pxSourceElements.get(token);if(el)el.click();},
  input(token,value,checked,event){const el=pxSourceElements.get(token);if(!el)return;if('value'in el)el.value=value;if('checked'in el)el.checked=checked;el.dispatchEvent(new Event(event,{bubbles:true}));},
  fullscreen(on){setFullscreen(on===undefined?!fsOn:!!on);return fsOn;},
  dev:DEV,
  ui(){const modal=$('modal'),bar=$('featureBar'),bet=state.free?state.freeBet:state.bet,g=$('gamble');return {balance:state.balance,bet,win:state.lastWin,spins:state.spins,spinning,button:$('spinText')?.textContent||'MOO',spinDisabled:$('spin').disabled,betDownDisabled:$('minus').disabled,betUpDisabled:$('plus').disabled,gamble:g&&!g.hidden?g.textContent:'',status:$('status')?.textContent||'',turbo:!!state.turbo,auto:autoLeft>0,muted:!!state.muted,fullscreen:fsOn,lab:!!labRun,scene:scene?scene.kind+':'+scene.stage:'',modal:modal?.open&&!fsOn?pxPort(modal):'',feature:bar&&!bar.hidden&&!fsOn?pxPort(bar):''};}
};
// Opened on its own (not inside a casino or test host), the page claims the account and plays in page view.
if(!HOSTED){window.PX_CASINO_ENGINE.activate().catch(e=>toast(e.message));}
})();
