import re, sys
R = '..'
s = open(f'{R}/ft/script8.js').read()
rd = lambda n: open(n).read()

def cut(src, start, end, repl):
    a = src.index(start); b = src.index(end, a)
    return src[:a] + repl + src[b:]
def rep(src, old, new, count=None):
    n = src.count(old)
    if n == 0: raise SystemExit(f'MISSING: {old[:90]}')
    if count and n != count: raise SystemExit(f'COUNT {n}!={count}: {old[:90]}')
    return src.replace(old, new)
def rx(src, pat, new, flags=re.S):
    out, n = re.subn(pat, lambda m: new, src, flags=flags)
    if n == 0: raise SystemExit(f'RX MISSING: {pat[:90]}')
    return out

# ---- large replaced blocks ----
s = cut(s, "const symbolImages = {};", "/* ---------- Renderer and scene ---------- */", rd('p_art.js') + '\n')
s = cut(s, "/* ---------- Renderer and scene ---------- */", "/* ---------- The cabinet screen ---------- */", rd('p_stub.js') + '\n')
s = cut(s, "/* ---------- The cabinet screen ---------- */", "/* ---------- Spinning ---------- */", rd('p_screen.js') + '\n')
s = cut(s, "function openGamble() {", "function openAccount() {", '')
s = cut(s, "const iconURL = {}, icon", "function openHistory(){", rd('p_panels.js') + '\n')
s = cut(s, "/* ---------- Frame loop ---------- */", "// Cached cabinets borrow the room's LAYR account", rd('p_frame.js') + '\n')

# ---- header / identity ----
s = cut(s, "/* Forever Twins", "(() => {\n'use strict'", "/* Genesis 21: an Xtrata Arcade fruit machine for the ParallaX Casino. A reskin of the Block Fortune v2 engine (94.38% RTP, copied byte for byte\n   into the BF constant above this file): only names, art, sound and the cabinet differ. Every symbol is a real 2021 Stacks NFT or a real record from\n   Stacks' first blocks. Every outcome comes from BF before any image is chosen, so loaded art can never change a result. */\n")
s = rep(s, "const GAME_ID='forever-twins'", "const GAME_ID='genesis-21'")
s = rep(s, "const KEY='xtrata.parallax.layr.forever-twins.v1', CACHE_KEY = 'xtrata.forevertwins.twins'", "const KEY='xtrata.parallax.layr.genesis-21.v1', CACHE_KEY = 'xtrata.genesis21.twins'")
s = rx(s, r"const NAMES = \{.*?\};", "const NAMES = { cherry: 'Arties', lemon: 'SatoSHE', chip: 'Satoshibles', block: 'Stacks Punks', artifact: 'Bitcoin Bird', bitcoin: 'This Is #1', wild: 'OG Wild', scatter: 'Genesis Block', vault: 'Boombox', chain: 'Bitcoin Anchor' };")
s = rep(s, "if(GAME_ID==='deep-strata'&&!Number.isFinite(state.deepest))state.deepest=0;", "")
s = rep(s, "'INSCRIBE WIN'", "'LAUNCH WIN'")
s = rep(s, "`${state.free} INSCRIBE SPINS · 2×`", "`${state.free} LAUNCH SPINS · 2×`")
s = rep(s, "state.free ? 'INSCRIBE' : broke ? 'GET LAYR' : 'SPIN'", "state.free ? 'LAUNCH' : broke ? 'GET LAYR' : 'MINT'")
s = rep(s, "`STOP ${autoLeft}` : 'AUTO'", "`STOP ${autoLeft}` : 'AUTO-STACK'")
s = rep(s, "$('meterSide').textContent = fmt(E.meter(state, shownBet));", "$('meterSide').textContent = fmt(E.meter(state, shownBet)); if ($('potSide') && state.holder) $('potSide').textContent = fmt(state.holder.pot);")
s = rep(s, "/* ---------- Procedural audio: glassy tones, no files ---------- */", "/* ---------- Procedural audio: warm lo-fi chiptune, no files ---------- */")
s = rep(s, "o.type = type;", "o.type = type === 'sine' ? 'triangle' : type === 'triangle' ? 'square' : type; if (o.type === 'square') v *= .55;")
s = rep(s, "  if (kind === 'swap')", "  if (kind === 'mint') { tone(988, .09, 'square', .07, at); tone(1319, .16, 'square', .06, at + .07); }\n  if (kind === 'fanfare') { const m = Math.min(4, 1 + Math.floor(Math.log2(i + 1))); for (let k = 0; k <= m + 1; k++) tone(PENT[k], .3, 'triangle', .1, k * .08); tone(PENT[m + 2] || 1568, .6, 'sine', .08, (m + 2) * .08); }\n  if (kind === 'launch') { if (i < 3) tone(330 + i * 110, .22, 'square', .1); else { tone(440, .9, 'sawtooth', .06, 0, 4); tone(660, .9, 'triangle', .1, 0, 3); } }\n  if (kind === 'swap')")
s = rep(s, "/* ---------- Canvas helpers, the Forever Twins mark and standard symbols ---------- */", "/* ---------- Canvas helpers ---------- */")

# ---- spinning ----
s = rep(s, "return spinning||(typeof seqRemix", "return spinning||performance.now()<countdownUntil||(typeof seqRemix")
s = rep(s, "let nextFaces = null;", "let nextFaces = null, nextGrid = null;")
s = rep(s, "try { p = E.start(state); }", "try { p = E.start(state, testRng || undefined); testRng = null; }")
s = rep(s, "hideBar(); spinning = true; lastResult = null; save();", "hideBar(); spinning = true; lastResult = null; leverStart = performance.now(); if (!p.free) holderAdd(p.bet); nextGrid = p.grid; save();")
s = rep(s, "status(p.free ? 'INSCRIBE SPIN · ALL WINS 2×' : 'SPINNING FOREVER…');", "status(p.free ? 'LAUNCH SPIN · ALL WINS 2×' : 'MINTING…');")
s = rep(s, "// The result is already fixed; now pick which forevered twins will show in each cell.", "// The result is already fixed; now pick which NFT will show in each cell (Math.random, never the engine's rng).")
s = rep(s, "a.nodes = sound('stop', c, Math.max(0, (a.start + a.land - performance.now()) / 1000 - audioLatency())) || null; }", "const _at = Math.max(0, (a.start + a.land - performance.now()) / 1000 - audioLatency()); a.nodes = sound('stop', c, _at) || null; if (nextGrid && nextFaces && nextGrid[c].some((sy, r) => { const it = faceItem(sy, nextFaces[c][r]); return it && it.twinned; })) sound('mint', c, _at + .05); }")
s = rep(s, "if (nextFaces) faces = nextFaces; nextFaces = null; save(); update();\n  const r = lastResult, bet = r.round.bet;", "if (nextFaces) faces = nextFaces; nextFaces = null; nextGrid = null; save(); update();\n  const r = lastResult, bet = r.round.bet; recordCameos(r); save();")
s = rep(s, "toast(`FOREVER JACKPOT! ${fmt(r.jackpotWin)} LAYR.`)", "toast(`JACKPOT: NUMBER ONE! ${fmt(r.jackpotWin)} LAYR.`)")
s = rep(s, "${r.jackpotWin ? 'FOREVER JACKPOT · ' : ''}", "${r.jackpotWin ? 'JACKPOT: NUMBER ONE · ' : ''}")
s = rep(s, "${r.scatterPay ? ' · INSCRIBE' : ''}", "${r.scatterPay ? ' · MAINNET LAUNCH' : ''}")
s = rep(s, "'INSCRIBE SPIN COMPLETE' : 'NO WIN THIS TIME · SPIN AGAIN'", "'LAUNCH SPIN COMPLETE' : 'NO WIN THIS TIME · PULL AGAIN'")
s = rep(s, "msg += ' · SWAP OR KEEP?'", "msg += ' · ODD OR EVEN?'")
s = rep(s, "toast('Inscribe cap reached: 24 spins awarded this feature.')", "toast('Launch cap reached: 24 spins awarded this feature.')")
s = rep(s, "'Let the twins spin.'", "'Let it stack.'")

# ---- features ----
s = rep(s, "toast(f.type === 'chain' ? 'Finalize! Seal hashes and respin.' : 'Twin Bind! Open three escrow capsules.'); }", "toast(f.type === 'chain' ? 'Proof of Transfer! Anchor blocks and respin.' : 'Stacking Boombox! Open three Boomboxes.'); }")
s = rep(s, "if (view === 'cabinet' && innerWidth < 1000) setView('play'); ", "")
s = rep(s, "'Finalize', done ? `${n}/15 hashes · ${fmt(f.sum * f.bet)} LAYR${f.full ? ' + Forever Jackpot' : ''}` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${n}/15 sealed · ${fmt(f.sum * f.bet)} so far`", "'Proof of Transfer', done ? `${n}/15 blocks · ${fmt(f.sum * f.bet)} LAYR${f.full ? ' + Jackpot: Number One' : ''}` : `${fr.left} respin${fr.left === 1 ? '' : 's'} left · ${n}/15 anchored · ${fmt(f.sum * f.bet)} so far`")
s = rep(s, "'Respin ∞'", "'Respin ▲'")
s = rep(s, "'FINALIZED · COLLECT YOUR LAYR' : 'FINALIZE · PRESS RESPIN'", "'ANCHORED · COLLECT YOUR LAYR' : 'PROOF OF TRANSFER · PRESS RESPIN'")
s = rep(s, "'Twin Bind', done ?", "'Stacking Boombox', done ?")
s = rep(s, "aria-label=\"Escrow capsule ${i + 1}", "aria-label=\"Boombox ${i + 1}")
s = rep(s, "'TWINS BOUND · COLLECT YOUR LAYR' : 'TWIN BIND · OPEN THREE CAPSULES'", "'BOOMBOXES OPENED · COLLECT YOUR LAYR' : 'STACKING BOOMBOX · OPEN THREE'")
s = rep(s, "toast('Open three capsules first.')", "toast('Open three Boomboxes first.')")
s = rep(s, "save(); sound('pick', i); renderBar();", "save(); sound('fanfare', r.multiple); renderBar();")
s = rep(s, "toast(`ALL 15 SEALED! Forever Jackpot pays ${fmt(c.jackpotWin)} LAYR.`)", "toast(`ALL 15 ANCHORED! Jackpot: Number One pays ${fmt(c.jackpotWin)} LAYR.`)")
s = rep(s, "`${c.type === 'chain' ? 'FINALIZE' : 'TWIN BIND'} · ${fmt(c.amount)} LAYR COLLECTED`", "`${c.type === 'chain' ? 'PROOF OF TRANSFER' : 'STACKING BOOMBOX'} · ${fmt(c.amount)} LAYR COLLECTED`")
s = rep(s, "retrigger ? 'More inscribed' : 'Inscribe', `${state.free} free spins", "retrigger ? 'More launches' : 'Mainnet Launch', `${state.free} free spins")
s = rep(s, "retrigger ? 'Keep inscribing ∞' : 'Start inscribing ∞'", "retrigger ? 'Keep launching ▲' : 'Start the countdown ▲'")
s = rep(s, "$('fbGo').onclick = () => { hideBar(); spin(); }; status(`${state.free} INSCRIBE SPINS · ALL WINS 2×`)", "$('fbGo').onclick = () => { hideBar(); startLaunch(retrigger); }; status(`${state.free} LAUNCH SPINS · ALL WINS 2×`)")
s = rep(s, "'Inscribed forever.', `<p>Your ${r.count} inscribe spins paid out</p>", "'Launched.', `<p>Your ${r.count} launch spins paid out</p>")
s = rep(s, "Including any Twin Bind or Finalize awards", "Including any Stacking Boombox or Proof of Transfer awards")
s = rep(s, "'FEATURE 01 / INSCRIBE'); $('featureDone').onclick = closeModal; status('INSCRIBE COMPLETE');", "'FEATURE 01 / MAINNET LAUNCH'); $('featureDone').onclick = closeModal; status('MAINNET LAUNCH COMPLETE');")
s = rep(s, "All five machines", "All six machines")
s = rep(s, "'FEATURE 03'" if "'FEATURE 03'" in s else "`${pre}FEATURE 03`", "`${pre}FEATURE 03`")  # no-op sanity

# ---- settings & wiring ----
s = rx(s, r'<label class="setting">Graphics quality<select id="setQuality">.*?</select></label>', '')
s = rep(s, " Drag the machine to orbit; scroll or pinch to zoom.", "")
s = rx(s, r"\n  \$\('setQuality'\)\.onchange = .*?\n", "\n")
s = rep(s, "id=\"setTwins\">The twins on the reels</button>", "id=\"setTwins\">Hall of Twins</button><button class=\"outline\" id=\"setPot\">The Holder Pot</button>")
s = rep(s, "$('setTwins').onclick = openTwins;", "$('setTwins').onclick = openTwins; $('setPot').onclick = openHolder;")
s = rep(s, "document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => setView(b.dataset.view)); document.querySelector('.brand').onclick = e => { e.preventDefault(); setView('cabinet'); };", "document.querySelector('.brand').onclick = e => { e.preventDefault(); }; if ($('pot')) $('pot').onclick = () => openHolder();")

# extra function appended before the PX bridge
s = rep(s, "// Cached cabinets borrow the room's LAYR account", """// Mainnet Launch: a short countdown, then the free spins run under a starfield.
function startLaunch(retrigger) {
  if (retrigger) { spin(); return; }
  const now = performance.now(); countdownStart = now; countdownUntil = now + 2400;
  for (let k = 0; k < 4; k++) setTimeout(() => sound('launch', k), k * 800);
  status('MAINNET LAUNCH · T-MINUS 3'); screenDirty = true;
  setTimeout(() => { countdownUntil = 0; spin(); }, 2420);
}
// Cached cabinets borrow the room's LAYR account""")

open('g21-game.js', 'w').write(s)
print('game script', len(s), 'bytes')
leftover = [m for m in ['39d8ff','7ff3ff','Forever Twins','FOREVER TWINS','Inscribe','INSCRIBE','Twin Bind','TWIN BIND','Finalize','FINALIZE','THREE.','forever-twins','FT_ART','ForeverTwins','capsule','Pepe','SWAP','Swap'] if m in s]
print('leftover terms:', leftover)
for m in leftover:
    for mm in re.finditer(re.escape(m), s):
        print('  ', m, '->', s[max(0,mm.start()-60):mm.end()+50].replace('\n',' '))
        break
