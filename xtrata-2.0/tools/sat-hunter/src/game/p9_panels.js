/* ---------- Panels (every one is a native dialog, so it works the same in the cabinet port and inside fullscreen) ---------- */
function showModal(type, title, html, tagText = 'SAT HUNTER') { stopAuto(); $('modalTag').textContent = tagText; $('modalContent').innerHTML = `<h2>${title}</h2>${html}`; if (!$('modal').open) $('modal').showModal(); screenDirty = true; }
function closeModal() { if ($('modal').open) $('modal').close(); update(); }
$('close').onclick = closeModal; $('modal').addEventListener('cancel', e => { e.preventDefault(); closeModal(); });
$('modal').addEventListener('click', e => { if (e.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal(); } });
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
// A small thumbnail of the symbol's tile (the full tile is large, and the panels are copied into the cabinet port as text).
const icon = s => { if (!iconURL[s]) { const t = tileFor(s, 0), k = 72 / Math.max(t.width, t.height), c = document.createElement('canvas'); c.width = Math.max(1, Math.round(t.width * k)); c.height = Math.max(1, Math.round(t.height * k)); c.getContext('2d').drawImage(t, 0, 0, c.width, c.height); iconURL[s] = c.toDataURL('image/png'); } return iconURL[s]; };
const link = (u, t = 'check', cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`;

/* ---------- The sats: every record on the reels, with its check link ---------- */
const SATS_DB = window.SAT_RECORDS || { types: {}, notes: { tiers: {}, definitions: {} }, hunts: [], gamble: [], exotic: [], timeline: [], mythic: null };
const satNum = s => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const RARITY_CHIPS = { mythic: 'MYTHIC', legendary: 'LEGENDARY', epic: 'EPIC', rare: 'RARE', uncommon: 'UNCOMMON', black: 'BLACK', palindrome: 'PALINDROME', vintage: 'VINTAGE', nakamoto: 'NAKAMOTO', pizza: 'PIZZA', block9: 'BLOCK 9', block78: 'BLOCK 78', range: 'SAT RANGE', common: 'COMMON' };
const rchip = (k, label) => `<span class="rc rc-${esc(k)}">${esc(label || RARITY_CHIPS[k] || String(k).toUpperCase())}</span>`;
const vchip = r => r.verified ? '<span class="vchip ok">checked</span>' : '<span class="vchip">not yet checked</span>';
const SLOT_INFO = {
  cherry: ['Uncommon sat', 'The first sat of a block. The lowest-paying symbol.'],
  lemon: ['Black sat', 'The last sat of a block (a community term). Its tag also says which kind of sat it is: Black Uncommon, Black Rare or Black Epic.'],
  chip: ['Palindrome sat', 'A sat whose number reads the same both ways. The coin shows the digits mirrored about a centre line.'],
  block: ['Vintage sat', 'A sat from the first 1,000 blocks, in sepia.'],
  artifact: ['Pizza sat', 'The pizza purchase of 22 May 2010: 10,000 BTC for two pizzas. Until the sat ranges are read from a full ord index, each tile carries a verified fact about the transaction and says SAT RANGE: PENDING INDEX.'],
  bitcoin: ['Epic sat', 'The jackpot symbol: the first sat of a halving epoch. Five on the centre row win the Mythic jackpot. Sats from halvings that have not happened yet are real numbers, marked NOT YET MINED.'],
  wild: ['Rare sat', 'The wild: the first sat of a difficulty adjustment period. It stands in for every paying symbol, but never for a Nakamoto sat, a Block 9 sat or a sat range.'],
  scatter: ['Nakamoto sat', 'The scatter: a sat from a block in the Patoshi pattern, mined by Satoshi. Three or more anywhere start Satoshi\'s Stash.'],
  vault: ['Block 9 sat', 'A sat from block 9, whose coinbase was spent in the first Bitcoin transaction. Three or more anywhere open the Block 9 Vault.'],
  chain: ['Sat range', 'A real block\'s range, first sat to last sat, under a small loupe. Five or more start The Hunt.']
};
const SLOT_LIST = ['cherry', 'lemon', 'chip', 'block', 'artifact', 'bitcoin', 'wild', 'scatter', 'vault', 'chain'];
function satTags(r) { const t = (r.tags || []).map(k => k === 'black' && r.blackName ? rchip('black', r.blackName.toUpperCase()) : rchip(k)); return t.length ? t.join('') : rchip('common'); }
function satRow(slot, r) {
  if (slot === 'chain') return `<tr><td class="num">${satNum(r.first)}<div class="nm">to ${satNum(r.last)}</div></td><td>Block ${fmt(r.block)}<div class="nm">${esc(r.event || 'a real block range')}</div></td><td class="hide-s">${satTags(r)}</td><td>${vchip(r)} ${link(r.check, 'check block ↗', 'chk')}</td></tr>`;
  if (r.satStatus === 'pending') return `<tr><td class="num">${esc(r.label)}<div class="nm">SAT RANGE: PENDING INDEX</div></td><td>Block ${fmt(r.block)}<div class="nm">${esc(r.date)}</div></td><td class="hide-s">${satTags(r)}<div class="st">${esc(r.fact)}</div><div class="nm">tx ${esc(r.tx.slice(0, 16))}…${esc(r.tx.slice(-8))}</div></td><td>${vchip(r)} ${link(r.check, 'check tx ↗', 'chk')}</td></tr>`;
  const ribbon = r.mined === false ? `<div><span class="ribbon">NOT YET MINED · ${esc(String(r.when || '').toUpperCase())}</span></div>` : '';
  const pz = slot === 'artifact' ? `<div class="st"><b>${esc(r.label)}</b> · ${esc(r.fact)}</div>` : '';
  return `<tr><td class="num">${satNum(r.str)}<div class="nm">${esc(r.name)}</div></td><td>Block ${fmt(r.block)}<div class="nm">${esc(r.degree)}</div></td><td class="hide-s">${satTags(r)}${ribbon}${pz}<div class="st">${esc(r.story || '')}</div></td><td>${vchip(r)} ${link(r.check, 'check ↗', 'chk')}</td></tr>`;
}
function openRecords() {
  const T = SATS_DB.types || {}, my = SATS_DB.mythic, n = SATS_DB.notes || {}, total = SLOT_LIST.reduce((a, k) => a + (T[k] || []).length, 0);
  const unchecked = SLOT_LIST.reduce((a, k) => a + (T[k] || []).filter(r => !r.verified).length, 0) + (my && !my.verified ? 1 : 0);
  const sections = SLOT_LIST.filter(k => (T[k] || []).length).map(k => `<div class="sat-sec"><h3><img src="${icon(k)}" alt="">${esc(SLOT_INFO[k][0].toUpperCase())} · ${T[k].length}</h3><p class="what">${esc(SLOT_INFO[k][1])}</p>
    <table class="sat-table"><thead><tr><th>${k === 'chain' ? 'FIRST SAT' : 'SAT'}</th><th>BLOCK</th><th class="hide-s">WHAT IT IS</th><th>CHECK</th></tr></thead><tbody>${T[k].map(r => satRow(k, r)).join('')}</tbody></table></div>`).join('');
  const myCard = my ? `<div class="stat-cards"><div><span>THE MYTHIC SAT · THE JACKPOT'S LAST SCREEN</span><strong>${satNum(my.str)}</strong><span>${esc(my.name)} · ${esc(my.degree)} · block ${fmt(my.block)}</span></div><div><span>THE GENESIS BLOCK</span><strong style="font-size:15px;line-height:1.4">${esc((my.genesis || {}).headline || '')}</strong><span>${esc((my.genesis || {}).timeUtc || '')} UTC</span></div></div><p>${vchip(my)} ${link(my.check, 'check sat 0 ↗', 'chk')} ${esc(my.story || '')}</p>` : '';
  showModal('records', 'The sats on the reels.', `<p>Every symbol is a real sat, or a real fact. Sat numbers are computed from Bitcoin's issuance schedule with ordinal theory's numbering, then bundled into the machine: it reads nothing from the network. Which sat shows in a cell is chosen after each result is fixed, so it never changes your odds. ${fmt(total)} sats and facts are listed below, each with a link to check it on ordinals.com. A sat marked <span class="vchip">not yet checked</span> was computed here and has not yet been opened on the site.</p>
  ${myCard}<p class="fine">${unchecked} of ${total + 1} are not yet checked. ${esc(n.formula || '')} The Hunt pins sats from ${fmt((SATS_DB.hunts || []).length)} real block ranges (${(SATS_DB.hunts || []).length ? fmt(SATS_DB.hunts[0].finds.length) : 0} finds each), the Block 9 Vault tubes hold ${fmt((SATS_DB.exotic || []).length)} story sats, and Odd Sat or Even Sat shows one of ${fmt((SATS_DB.gamble || []).length)} real sat numbers.</p>${sections}
  <button class="outline" id="satsExport">Download these records (JSON)</button><button class="outline" id="satsRarity">Rarity ↗</button>`, 'THE SATS');
  $('satsRarity').onclick = openRules;
  $('satsExport').onclick = () => { const a = document.createElement('a'), url = URL.createObjectURL(new Blob([JSON.stringify(SATS_DB, null, 1)], { type: 'application/json' })); a.href = url; a.download = GAME_ID + '-sats.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
}

/* ---------- Holder layer, version 1: a meter and a display only. Nothing here pays out. ----------
   The period clock (periodKey, periodLeft, periodText), the wallet count (walletCount, sources.test for the Test panel's sample),
   potShare and shareText live in p1; the stubs linkBitcoinWallet and readWalletSats in p4; recordCameos (no NFTs: always []) in p7.
   TODO(holder-layer v2): at each period end (Monday 00:00 UTC) snapshot the linked wallets that hold an uncommon or rarer sat, then credit pot ÷ wallets to each in LAYR.
   TODO(holder-layer v2): holder spins (5 a week at the lowest bet), a refund fund and a collection cup are not started. */
const HolderLayerStubs = Object.freeze({ linkBitcoinWallet, readWalletSats, recordCameos, snapshotAtPeriodEnd: () => null, sharePerWallet: (pot, wallets) => wallets > 0 ? r2(pot / wallets) : null, claimShare: () => null, holderSpins: () => 0 });
function openPot() {
  const lp = state.lastPot, w = walletCount(), sh = potShare(), sample = sources.test ? ` · TEST SAMPLE: ${sources.test.toUpperCase()}` : '';
  showModal('pot', 'The Holder Pot.', `<div class="stat-cards"><div><span>POT THIS PERIOD · LAYR</span><strong>${fmt(state.pot)}</strong></div><div><span>PERIOD ENDS IN</span><strong>${periodText()}</strong><span>Monday 00:00 UTC</span></div><div><span>SHARE PER WALLET</span><strong>${sh == null ? 'UNKNOWN' : '≈ ' + fmt(sh)}</strong><span>${sh == null ? 'WALLET LINKING: NOT LIVE YET' : fmt(w) + ' WALLETS' + sample}</span></div></div>
  <p>1% of every paid bet on this machine goes into the Holder Pot. It comes out of the house edge, never out of your win. The period is one UTC week. At its end the pot is meant to be shared by <b>every linked wallet that holds an uncommon or rarer sat</b>, one share per wallet.${sh != null ? ` With the sample above that is about <b>${fmt(sh)} LAYR per wallet</b>.` : ''}</p>
  <p>Last period: <b>${lp ? `${fmt(lp.pot)} LAYR${lp.perWallet != null ? ` · ${fmt(lp.perWallet)} per wallet` : ''} (payout pending: v2)` : 'no pot yet'}</b>.</p>
  <p><b>WALLET LINKING: NOT LIVE YET.</b> Linking a Bitcoin wallet and reading the sats it holds need a server with a sat index, so version 1 is a meter and a display only: nothing is snapshotted, claimed or paid. The share per wallet stays <b>unknown</b>, never zero, until wallets can be counted. This machine has no NFTs on its reels, so there is no cameo royalty.</p>
  <button class="outline" id="potLink">Link a Bitcoin wallet</button><button class="outline" id="potSats">The sats ↗</button>
  <p class="fine">The period comes from this device's clock, with no network read. The Holder Pot is a display, not a promise of any payment.</p>`, 'HOLDER POT');
  $('potLink').onclick = () => { linkBitcoinWallet(); sound('click'); };
  $('potSats').onclick = openRecords;
}
function openFair() {
  const counts = E.symbols.map((s, i) => `${(SLOT_INFO[s] || [s])[0]} ${E.weights[i].join('/')}`).join(' · ');
  showModal('fair', 'Fair play.', `<div class="stat-cards"><div><span>RETURN TO PLAYER</span><strong>94.38%</strong></div><div><span>JACKPOT ODDS</span><strong>~1 in 113,000</strong></div></div>
  <table class="paytable"><thead><tr><th>WHERE THE 94.38% COMES FROM</th><th>SHARE</th></tr></thead><tbody><tr><td>Line wins (20 fixed lines)</td><td>59.7%</td></tr><tr><td>Scatters (Nakamoto sats)</td><td>1.5%</td></tr><tr><td>Satoshi's Stash free spins</td><td>8.5%</td></tr><tr><td>Block 9 Vault (pick bonus)</td><td>11.9%</td></tr><tr><td>The Hunt (hold and respin)</td><td>10.3%</td></tr><tr><td>Mythic jackpot</td><td>2.4%</td></tr></tbody></table>
  <p>Satoshi's Stash and the Block 9 Vault each arrive about <b>1 in 140</b> spins, The Hunt about <b>1 in 290</b>, and the Mythic jackpot about <b>1 in 113,000</b>. Odd Sat or Even Sat is an <b>even bet</b> and does not change the return.</p>
  <p>Sat Hunter runs the same engine as Forever Twins, Block Fortune and The Drop: weighted ${E.strips[0].length}-stop reel strips, one stop per reel chosen with the browser's cryptographic random generator, and bonus prizes dealt at the same moment. Only after the result is fixed does the machine choose which sat to show, so the art and the records can never change a result. The Holder Pot (1% of paid bets) comes from the house edge and never reduces a win.</p>
  <p class="fine"><b>This is a mathematical design estimate, not an independently certified RTP.</b> Uses the casino LAYR balance on this browser origin; on-chain settlement is not connected. Symbols per strip, reels 1 to 5: ${counts}.</p>`, 'FAIR PLAY');
}
function openRules() {
  const N = SATS_DB.notes || { tiers: {}, definitions: {} }, cap = s => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);
  const pays = E.pays, top = pays.bitcoin ? pays.bitcoin[2] : 0, lineBet = 100 / 20;
  const def = (k, text) => `<dt>${rchip(k)}</dt><dd>${esc(cap(text))}.</dd>`;
  const ladder = ['mythic', 'legendary', 'epic', 'rare', 'uncommon'].filter(k => N.tiers && N.tiers[k]).map(k => def(k, N.tiers[k])).join('');
  const others = ['black', 'palindrome', 'vintage', 'nakamoto', 'block9', 'pizza'].filter(k => N.definitions && N.definitions[k]).map(k => def(k, N.definitions[k])).join('') + def('range', "a real block's range, first sat to last sat, with the sats found inside it during The Hunt");
  showModal('rules', 'Rarity.', `<p>Match 3, 4 or 5 symbols from the <b>leftmost reel</b> on any of 20 fixed paylines. Each line pays its highest award; line wins add up. Line bet = total bet ÷ 20 (your bet is counted in SATS). The <b>Rare sat</b> is wild: it stands in for every paying symbol and has its own pays, but never for a Nakamoto sat, a Block 9 sat or a sat range.</p>
  <table class="paytable"><thead><tr><th>SYMBOL</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>${Object.entries(pays).reverse().map(([s, p]) => `<tr><td><img class="pay-icon" src="${icon(s)}" alt="">${esc((SLOT_INFO[s] || [s])[0])}${s === 'wild' ? ' · wild' : ''}</td>${p.map(v => `<td>${v}×</td>`).join('')}</tr>`).join('')}</tbody></table>
  <p class="fine">Multipliers apply to the line bet. Five Epic sats on a line at a 100 total bet pays ${top} × ${lineBet} = ${fmt(top * lineBet)} LAYR.</p>
  <h3>HOW RARE A SAT IS</h3><p>Rarity comes from ordinal theory: how a sat sits in the rhythm of Bitcoin's blocks. The tag on every coin says which kind it is.</p><dl class="defs">${ladder}</dl>
  <h3>THE OTHER TAGS</h3><dl class="defs">${others}</dl><p class="fine">Black, palindrome and vintage are community terms, not rarities that the ord index assigns. A sat can carry several tags; the coin takes the colour of the slot it sits in and a small second tag shows when it has more.</p>
  <h3>SATOSHI'S STASH</h3><p>3, 4 or 5 Nakamoto sats anywhere pay 2×, 5× or 10× your total bet and start <b>8 free spins</b>. The lab lights dim and a 2009 timeline lights one early-block sat for every spin. Every win pays <b>2×</b>. More Nakamoto sats add 4 spins, up to 24 awarded. Your bet is locked. The Block 9 Vault and The Hunt can trigger inside it and pay at 1×.</p>
  <h3>BLOCK 9 VAULT</h3><p>3 or more Block 9 sats anywhere bring up nine sealed sample tubes. Each holds ${E.vaultPrizes.join(', ')} × your total bet, dealt before you open any, with a real sat inside. Open three. Each tube holds a sat.</p>
  <h3>THE HUNT</h3><p>5 or more sat ranges start a hold-and-respin. One real block range scrolls under a big loupe, and each lock pins a real sat found in it, worth ${E.chainValues.join(', ')} × total bet. You get 3 respins; each empty cell has a 1 in ${E.CHAIN_ODDS} (4%) chance to lock per respin, and any new find resets the count to 3. Find all 15 to win the Mythic jackpot as well.</p>
  <h3>MYTHIC JACKPOT</h3><p>Five Epic sats on the centre row (wilds don't count), or all 15 Hunt finds, win the jackpot meter on top of your other wins. Each bet level has its own meter: it starts at ${E.JACKPOT_SEED}× that bet, grows by ${E.JACKPOT_RATE * 100}% of every paid bet at that level, and resets after a win. The loupe settles on sat 0.</p>
  <h3>ODD SAT OR EVEN SAT</h3><p>After a paid base win with no bonus you may stake that win on one 50/50 call. The engine settles a fair coin first; the reveal then shows a real sat number of the matching parity. Call <b>ODD SAT</b> or <b>EVEN SAT</b>: call right and the win doubles, call wrong and you lose that win (not half of it). It is an even bet.</p>
  <h3>20 FIXED PAYLINES</h3><div class="rule-grid">${E.lines.map((line, i) => `<div class="line-card"><svg viewBox="0 0 100 50"><path d="${line.map((y, x) => `${x ? 'L' : 'M'}${x * 22 + 6},${y * 18 + 7}`).join(' ')}" fill="none" stroke="#f3cf7a" stroke-width="2"/></svg>${String(i + 1).padStart(2, '0')}</div>`).join('')}</div>
  <button class="outline" id="rulesFair">Fair play ↗</button><button class="outline" id="rulesRecords">The sats ↗</button><button class="outline" id="rulesPot">Holder Pot ↗</button>`, 'RARITY · PAYS & RULES');
  $('rulesFair').onclick = openFair; $('rulesRecords').onclick = openRecords; $('rulesPot').onclick = openPot;
}
const FEATURE_NAMES = { 'GENESIS BLOCK': 'MYTHIC', 'CHAIN': 'THE HUNT', 'VAULT': 'BLOCK 9 VAULT', 'FREE SPINS': "SATOSHI'S STASH", 'RETRIGGER': 'RETRIGGER' };
const featureText = f => String(f).split(' + ').map(x => FEATURE_NAMES[x] || x).join(' + ');
function openHistory() {
  const body = `<div class="stat-cards"><div><span>WAGERED · LAYR</span><strong>${fmt(state.wagered)}</strong></div><div><span>PAID OUT · LAYR</span><strong>${fmt(state.paidOut)}</strong></div></div><p>${lab.on ? 'Bonus Lab rounds (practice LAYR), marked LAB.' : 'Latest 50 rounds.'}</p><div class="history-wrap"><table class="paytable"><thead><tr><th>ROUND</th><th>BET</th><th>WIN</th></tr></thead><tbody>${state.history.map(h => `<tr><td>${h.lab ? '<b class="labtag">LAB</b> ' : ''}${new Date(h.time).toLocaleTimeString()} · ${esc(String(h.kind || 'Spin').replace('LAB · ', '').replace(/^Spin$/, 'Hunt'))}${h.feature ? ' · ' + esc(featureText(h.feature)) : ''}</td><td>${fmt(h.bet)}</td><td>${fmt(h.win)}</td></tr>`).join('')}</tbody></table></div><button class="cta modal-button" id="exportHistory">Export session JSON</button>`;
  showModal('history', lab.on ? 'Lab history.' : 'Your LAYR session.', body, lab.on ? 'BONUS LAB · LOG' : 'LAYR LOG');
  $('exportHistory').onclick = () => { const a = document.createElement('a'), url = URL.createObjectURL(new Blob([JSON.stringify({ game: GAME_ID, currency: 'LAYR', lab: lab.on, wagered: state.wagered, paidOut: state.paidOut, history: state.history }, null, 2)], { type: 'application/json' })); a.href = url; a.download = GAME_ID + (lab.on ? '-lab' : '') + '-layr-history.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
}
function openAccount() { if (spinning) return; showModal('account', 'Your LAYR account.', `<div class="stat-cards"><div><span>${lab.on ? 'LAB BALANCE (PRACTICE)' : 'AVAILABLE LAYR'}</span><strong>${fmt(state.balance)}</strong></div><div><span>LAST WIN · LAYR</span><strong>${fmt(state.lastWin)}</strong></div></div><p>All casino machines use the same LAYR balance. Stakes leave this account and winnings return here automatically. Leaving a machine keeps your remaining balance available.${lab.on ? ' The Bonus Lab uses its own practice balance and never touches this account.' : ''}</p><p class="fine">Local account on this browser origin. On-chain wallet verification and settlement are not connected.</p>`, 'SHARED LAYR ACCOUNT'); }
function openSettings() {
  showModal('settings', 'Settings.', `<label class="setting">Sound<input type="checkbox" id="setSound" ${state.muted ? '' : 'checked'}></label><label class="setting">Volume<input type="range" id="setVolume" min="0" max="1" step=".05" value="${state.volume}"></label><label class="setting">Assay-lab hum ambience<input type="checkbox" id="setAmbient" ${state.ambient ? 'checked' : ''}></label><label class="setting">Turbo reels<input type="checkbox" id="setTurbo" ${state.turbo ? 'checked' : ''}></label><label class="setting">Reduced motion (calmer scenes, quick spins, no particles)<input type="checkbox" id="setReduced" ${state.reduced ? 'checked' : ''}></label><label class="setting">Show guide paylines<input type="checkbox" id="setLines" ${state.showLines ? 'checked' : ''}></label><p>Space hunts, respins and collects. 1–9 open sample tubes. M mutes. F toggles fullscreen. L opens the Bonus Lab (where enabled). Esc stops auto-hunt, closes panels and leaves full screen.</p><p class="fine">${storageOK ? 'Your LAYR session is saved in this browser.' : 'This browser is blocking storage. Keep this tab open to keep your session.'}${sessionLock && !lab.on ? ' This tab is read-only because the session is open elsewhere.' : ''}</p>${LAB_ALLOWED || lab.on ? `<button class="outline" id="setLab">${lab.on ? 'Bonus Lab (leave)' : 'Bonus Lab · test every bonus with practice LAYR'}</button>` : ''}<button class="outline" id="setRecords">The sats</button><button class="outline" id="setPot">Holder Pot</button><button class="outline" id="setHistory">Session log</button>`, 'SETTINGS');
  const bind = (id, k, invert = false) => { const el = $(id); el.disabled = (k === 'turbo' || k === 'reduced') && spinInputBusy(); el.onchange = e => { state[k] = invert ? !el.checked : el.checked; save(); audioInit(); ambient(); update(); }; };
  bind('setSound', 'muted', true); bind('setAmbient', 'ambient'); bind('setTurbo', 'turbo'); bind('setReduced', 'reduced'); bind('setLines', 'showLines');
  $('setVolume').oninput = e => { state.volume = Number(e.target.value); audioInit(); save(); sound('click'); };
  if ($('setLab')) $('setLab').onclick = () => { if (lab.on) { closeModal(); exitLab(); } else { closeModal(); enterLab(); } };
  $('setRecords').onclick = openRecords; $('setPot').onclick = openPot; $('setHistory').onclick = openHistory;
}
