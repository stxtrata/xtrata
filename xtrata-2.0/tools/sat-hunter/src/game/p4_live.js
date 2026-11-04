
/* ---------- Nothing here is read live. The machine keeps a clock (the Holder Pot period) and the records it was built with.
   These functions keep their old names so the boot code can still call them; they only refresh what is shown. ---------- */
function liveLabel() {
  const setT = (id, v) => { const el = $(id); if (el) el.textContent = v; }, n = allSats().length;
  setT('liveSrc', `HOLDER POT ${fmt(state.pot)} LAYR · PERIOD ENDS IN ${periodText()} · ${poolText()} · ${shareText()}`);
  setT('twinsSmall', `${n} real sats on the reels · ${(SAT_RECORDS.hunts || []).length} real block ranges`);
  screenDirty = true; drawTopper(); drawCounter();
}
async function loadPool() { sources.done = true; liveLabel(); }
async function readChain() { ensureExtras(); liveLabel(); }
let liveTimer = 0;
function startLive() { clearInterval(liveTimer); ensureExtras(); liveLabel(); liveTimer = setInterval(() => { if (!document.hidden && pxEngineActive) { ensureExtras(); liveLabel(); } }, 30000); }
// TODO(holder-layer v2): link a Bitcoin wallet. This needs a server, so the machine says WALLET LINKING: NOT LIVE YET.
function linkBitcoinWallet() { toast('Wallet linking is not live yet.'); return Promise.resolve(null); }
// TODO(holder-layer v2): read the uncommon-or-rarer sats a linked wallet holds, from an ordinals index. This needs a server.
function readWalletSats() { return Promise.resolve(null); }

/* ---------- The topper plate (1024x320): a jeweller's loupe over a glowing sat, the current jackpot, and a real record that changes every few seconds.
   A canvas of its own (PX_CASINO_ENGINE.topper): the room maps it onto the topper plate under the loupe. drawTopper() or drawTopper(now) draws it and
   bumps topperRev; drawTopper(ctx) draws the same plate into any 2D context. ---------- */
const topper = canvas(1024, 320), tg = topper.getContext('2d'); let topperRev = 0, topperShown = '', topperFlipAt = 0;
const rareSet = new Set(['mythic', 'legendary', 'epic', 'rare']);
function flapWidth(s, h, w) { return [...s].reduce((a, ch) => a + (ch === ',' || ch === '.' ? h * w * .32 : h * w), 0) + h * .08 * (s.length - 1); }
function topperRecord(now) {
  if (pres && pres.bonus === 'jackpot') return SAT_RECORDS.mythic || null;
  if (halvingDay) return symbolRecord('wild', 'rare-find') || null;
  const list = allSats(); return list.length ? list[Math.floor(now / 4200) % list.length] : null;
}
function drawTopper(arg) {
  const isCtx = !!(arg && typeof arg === 'object' && arg.fillRect), now = typeof arg === 'number' ? arg : performance.now(), g = isCtx ? arg : tg, calm = reduced();
  const jp = !!(pres && pres.bonus === 'jackpot'), rf = !!halvingDay && !jp, bet = state.free ? state.freeBet : state.bet, meter = fmt(Math.round(E.meter(state, bet))), rec = topperRecord(now);
  const sig = `${meter}|${rec ? rec.str || rec.tx : ''}|${jp}`; if (!isCtx && sig !== topperShown) { topperShown = sig; topperFlipAt = now; }
  const pulse = calm ? .6 : .5 + .5 * Math.sin(now / (jp ? 160 : 520)), hot = jp ? '#bfe9ff' : rf ? ACCENT2 : BRASS2;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  brushed(g, 0, 0, 1024, 320, BRASS3, 9); g.fillStyle = lin(g, 0, 0, 0, 320, ['rgba(255,236,180,.25)', 'rgba(0,0,0,0)', 'rgba(0,0,0,.35)']); g.fillRect(0, 0, 1024, 320);
  for (const [x, y] of [[12, 12], [1012, 12], [12, 308], [1012, 308]]) rivet(g, x, y, 5);
  g.save(); g.shadowColor = jp || rf ? hot : '#000'; g.shadowBlur = jp || rf ? 14 + pulse * 16 : 8; round(g, 22, 18, 980, 284, 14, lin(g, 0, 18, 0, 302, ['#12303f', '#0a1b25', '#06121a']), jp || rf ? hot : BRASS4, jp || rf ? 4 : 3); g.restore();
  round(g, 30, 26, 964, 268, 10, null, hexA(BRASS, .45), 1.5);
  // the loupe over a glowing sat
  const lx = 205, ly = 150, lr = 88, rock = calm ? 0 : Math.sin(now / 1900) * .08;
  g.save(); g.beginPath(); g.arc(lx, ly, lr * .92, 0, 7); g.clip(); const bg = g.createRadialGradient(lx - 20, ly - 24, 6, lx, ly, lr); bg.addColorStop(0, '#1d5a78'); bg.addColorStop(1, '#06202e'); g.fillStyle = bg; g.fillRect(lx - lr, ly - lr, lr * 2, lr * 2);
  for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) { const d = Math.hypot(i, j), sc = 1.7 - Math.min(d, 6) * .2; if (sc > .5) { g.fillStyle = hexA('#6fd3ff', .12 + (1.7 - sc) * .0 + .12 * (d < 3 ? 1 : 0)); g.beginPath(); g.arc(lx + i * 20 * (1 + (6 - Math.min(d, 6)) * .035), ly + j * 20 * (1 + (6 - Math.min(d, 6)) * .035), sc * 1.5, 0, 7); g.fill(); } }
  const orb = 34 + pulse * 8 + (jp ? 10 : 0), og = g.createRadialGradient(lx, ly, 2, lx, ly, orb * 2.4); og.addColorStop(0, '#ffffff'); og.addColorStop(.18, jp ? '#ffffff' : '#bfe9ff'); og.addColorStop(.45, hexA(ACCENT, .55)); og.addColorStop(1, hexA(ACCENT, 0)); g.fillStyle = og; g.fillRect(lx - orb * 2.5, ly - orb * 2.5, orb * 5, orb * 5);
  g.save(); g.translate(lx, ly); g.rotate(calm ? .2 : now / 2600); g.fillStyle = hexA('#ffffff', .85); for (let k = 0; k < 4; k++) { g.rotate(Math.PI / 2); g.beginPath(); g.moveTo(0, -orb * 1.35); g.lineTo(orb * .1, 0); g.lineTo(-orb * .1, 0); g.closePath(); g.fill(); } g.restore();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(lx, ly, 7 + pulse * 2, 0, 7); g.fill(); g.restore();
  drawLoupe(g, lx, ly, lr, -Math.PI / 4 + rock); glassLens(g, lx, ly, lr);
  // the title, the jackpot, the pot
  spaced(g, jp ? 'THE MYTHIC SAT' : rf ? 'RARE FIND' : 'MYTHIC JACKPOT', 520, 52, 28, 6, hot, '800');
  const h = Math.min(96, 400 / (flapWidth(meter, 1, .6) || 1)), flipT = now - topperFlipAt;
  flapCells(g, meter, 520, 132, h, { w: .6, col: jp ? '#ffffff' : '#fff6d0', scramble: !calm, flip: i => calm ? 1 : (flipT - i * 70) / 420 });
  fitText(g, `LAYR · ${fmt(bet)} BET LEVEL · FIVE EPIC SATS, CENTRE ROW`, 520, 202, 17, 400, SMOKE, MONO, 'center', '700');
  fitText(g, `HOLDER POT ${fmt(state.pot)} LAYR · PERIOD ENDS IN ${periodText()}`, 530, 252, 26, 560, '#e8dcc0', COND, 'center', '700');
  spaced(g, 'EVERY SAT HAS A STORY', 530, 282, 14, 7, BRASS, '700', SERIF);
  // a real record on the bench
  if (rec) {
    const age = calm ? 1e9 : now - Math.floor(now / 4200) * 4200, key = rarityKey(rec), A = RAR[key]; g.save(); g.globalAlpha = jp || rf ? 1 : clampF(age / 500);
    coinFace(g, 868, 110, 52, rec, { key, glow: key === 'mythic' || rareSet.has(key) ? 18 : 8, t: now });
    brassTag(g, 748, 170, 240, 62, tagLines('', rec, key).map(l => ({ ...l, y: l.y - 160 + 172 })));
    spaced(g, rf ? 'FOUND UNDER THE LOUPE' : jp ? 'SAT ZERO' : 'ON THE BENCH', 868, 36, 13, 4, A.matte ? A.edge : A.col, '800', MONO); g.restore();
  }
  g.restore(); if (!isCtx) topperRev++;
}
const topperBusy = now => !!(pres && pres.bonus === 'jackpot') || !!halvingDay || now - Math.max(topperFlipAt, flapKick) < 1400;

/* ---------- The side tape (256x1024): a paper tape of real sat numbers scrolling past a reading window. Both side counters show this canvas.
   While the lab's Rare find runs (halvingDay) the tape eases to a rare sat, stops and glows. drawCounter() or drawCounter(now) draws it and bumps
   counterRev (call it about 20 times a second while counterBusy(now) is true); drawCounter(ctx) draws it into another context. ---------- */
const counter = canvas(256, 1024), cg = counter.getContext('2d'); let counterRev = 0, counterPos = 0, counterLast = 0, counterHold = null;
const TAPE_H = 84, tapePaper = (() => { const c = canvas(212, 168), g = c.getContext('2d'), r = lcg(41); g.fillStyle = PAPER; g.fillRect(0, 0, 212, 168); for (let i = 0; i < 420; i++) { g.fillStyle = r() < .5 ? 'rgba(120,90,40,.07)' : 'rgba(255,255,255,.35)'; g.fillRect(r() * 212, r() * 168, 1 + r() * 3, 1); } return c; })();
function tapeEntry(g, rec, y, hot, glowCol) {
  const key = rarityKey(rec), A = RAR[key], cy = y + TAPE_H / 2;
  g.fillStyle = A.matte ? '#2a2f36' : A.col; g.fillRect(22, y + 4, 7, TAPE_H - 8);
  coinFace(g, 54, cy, 14, rec, { key, glow: 0, center: false, rim: false });
  g.save(); if (hot) { g.shadowColor = glowCol; g.shadowBlur = 14; } fitText(g, String(rec.str), 152, cy - 9, 28, 156, hot ? '#000' : '#1a1206', MONO, 'center', '800'); g.restore();
  fitText(g, key === 'block9' ? `BLOCK 9 · SAT +${fmt(rec.offset || 0)}` : `${A.name} · BLOCK ${fmt(rec.block)}`, 152, cy + 18, 13, 156, '#6a5636', COND, 'center', '800');
  g.strokeStyle = 'rgba(120,90,40,.45)'; g.lineWidth = 1; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(34, y + TAPE_H - .5); g.lineTo(230, y + TAPE_H - .5); g.stroke(); g.setLineDash([]);
}
function drawCounter(arg) {
  const isCtx = !!(arg && typeof arg === 'object' && arg.fillRect), now = typeof arg === 'number' ? arg : performance.now(), g = isCtx ? arg : cg, calm = reduced(), list = allSats(), n = list.length, jp = !!(pres && pres.bonus === 'jackpot');
  const dt = counterLast ? Math.min(120, Math.max(0, now - counterLast)) : 0; counterLast = now;
  if (halvingDay && n) {
    if (!counterHold) { let j = Math.floor((counterPos + 512) / TAPE_H) + 2, guard = 0; while (guard++ < n && !rareSet.has(rarityKey(list[((j % n) + n) % n]))) j++; counterHold = { from: counterPos, to: j * TAPE_H + TAPE_H / 2 - 512, t0: now }; }
    const k = calm ? 1 : ease((now - counterHold.t0) / 1300); counterPos = counterHold.from + (counterHold.to - counterHold.from) * k;
  } else { counterHold = null; if (!calm) counterPos += dt * (jp ? .16 : .04); }
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); oak(g, 0, 0, 256, 1024, 17, OAK2);
  // the paper tape
  g.save(); g.beginPath(); g.rect(22, 0, 212, 1024); g.clip(); const py = -((counterPos % 168) + 168) % 168; for (let y = py - 168; y < 1024; y += 168) g.drawImage(tapePaper, 22, y);
  if (n) { const j0 = Math.floor(counterPos / TAPE_H) - 1, j1 = Math.floor((counterPos + 1024) / TAPE_H) + 1, glowCol = jp ? '#ffffff' : ACCENT;
    for (let j = j0; j <= j1; j++) { const rec = list[((j % n) + n) % n], y = j * TAPE_H - counterPos, mid = y + TAPE_H / 2, inWin = Math.abs(mid - 512) < TAPE_H / 2; tapeEntry(g, rec, y, inWin && (rareSet.has(rarityKey(rec)) || jp || !!halvingDay), glowCol); } }
  else text(g, 'NO SATS LOADED', 128, 512, 20, '#6a5636', COND, 'center', '800');
  const fade = g.createLinearGradient(0, 0, 0, 1024); fade.addColorStop(0, 'rgba(20,10,4,.92)'); fade.addColorStop(.28, 'rgba(20,10,4,0)'); fade.addColorStop(.72, 'rgba(20,10,4,0)'); fade.addColorStop(1, 'rgba(20,10,4,.92)'); g.fillStyle = fade; g.fillRect(22, 0, 212, 1024); g.restore();
  // brass rails and the reading window
  for (const x of [0, 234]) { brushed(g, x, 0, 22, 1024, BRASS3, x + 3); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(x ? x : 21, 0, 1, 1024); for (let y = 32; y < 1024; y += 64) rivet(g, x + 11, y, 4); }
  const gl = (halvingDay && counterHold && (calm || now - counterHold.t0 > 1100)) || jp ? 1 : now < winUntil ? .55 : 0, wc = jp ? '#ffffff' : halvingDay ? ACCENT2 : now < winUntil ? BRASS2 : BRASS;
  g.save(); if (gl) { g.shadowColor = wc; g.shadowBlur = 16 + (calm ? 6 : 6 * Math.sin(now / 160)) * gl; } g.strokeStyle = wc; g.lineWidth = 4; g.beginPath(); g.rect(22, 512 - TAPE_H / 2, 212, TAPE_H); g.stroke(); g.restore();
  g.fillStyle = hexA(ACCENT, gl ? .16 : .07); g.fillRect(22, 512 - TAPE_H / 2, 212, TAPE_H);
  for (const [x, d] of [[2, 1], [254, -1]]) { g.fillStyle = BRASS2; g.beginPath(); g.moveTo(x, 512 - 12); g.lineTo(x + d * 13, 512); g.lineTo(x, 512 + 12); g.closePath(); g.fill(); }
  g.restore(); if (!isCtx) counterRev++;
}
const counterBusy = now => !reduced() || (!!halvingDay && !!counterHold && now - counterHold.t0 < 1500);
