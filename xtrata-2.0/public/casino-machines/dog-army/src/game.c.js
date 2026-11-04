/* ---------- Faces: which Runestone, transfer or milestone a tile shows. Chosen after the result, with Math.random. ---------- */
let faces = state.grid.map(col => col.map(s => pickFace(s)));

/* ---------- Holder layer v1: the DOG Army Holder Pot meter (display only; payouts are a later service) ---------- */
function weekKey(d = new Date()) { const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())), day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y = t.getUTCFullYear(), w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7); return `${y}-W${String(w).padStart(2, '0')}`; }
function weekEndsIn(d = new Date()) { const day = d.getUTCDay() || 7, end = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + (8 - day)); const ms = end - d.getTime(), h = Math.floor(ms / 36e5); return `${Math.floor(h / 24)}D ${h % 24}H`; }
// Jim's settings for the holder layer. One share per wallet above a minimum that Jim sets.
const HOLDER_CONFIG = Object.freeze({
  MIN_DOG_PER_WALLET: null,   // TODO(Jim sets this): the minimum DOG a wallet must hold for one Holder Pot share. null = not set, so the UI says "share per wallet: TBC (minimum not set)" and invents no number.
  PERIOD: 'weekly',           // the pot period; one Stacks stacking cycle (2,100 Bitcoin blocks) is the alternative
  POT_RATE: 0.01,             // 1% of every paid bet, funded from the house edge; never reduces a win
  STACKS_TOKENS: Object.freeze(['SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.runes-dog', 'SP14NS8MVBRHXMM96BQY0727AJ59SWPV7RMHC0NCG.pontis-bridge-DOG'])   // only these two bridges; never match by name or symbol
});
// Test wallet counts for the Test panel's holder-state switch (simulated, shown as TEST). Live play reads wallets through the stubs below.
const TEST_WALLETS = Object.freeze({ none: 0, some: 3, all: 12 });
function holder() { if (!state.holder || typeof state.holder !== 'object') state.holder = { period: weekKey(), pot: 0, last: null }; const h = state.holder, k = weekKey(); if (h.period !== k) { h.last = { period: h.period, pot: h.pot, wallets: holderWallets() }; h.period = k; h.pot = 0; } return h; }
// 1% of every paid bet, funded from the house edge: it never reduces a player's win. Lab runs never touch it.
function addHolder(bet) { if (labRun) return; const h = holder(); h.pot = Math.round((h.pot + bet * HOLDER_CONFIG.POT_RATE) * 1e4) / 1e4; }
// Wallets counted this period: null = unknown (a failed or missing read is never "no holders").
function holderWallets() { return holderMode === 'live' ? null : TEST_WALLETS[holderMode]; }
// Whether a Runestone's holder counts as a registered holder (decides if its cameo is recorded). Live play: unknown owner, recorded.
function isHeld(r) { return holderMode === 'live' || holderMode === 'all' ? true : holderMode === 'none' ? false : (Number(r && r.number) || 0) % 2 === 0; }
// Named stubs: everything that needs a wallet, a signed message, a server or a contract is out of scope for v1.
const HolderService = Object.freeze({
  readStacksHolder(address) { throw Error('TODO(holder-stacks-read): read the DOG balance of ' + address + ' from runes-dog / the Pontis token through the Hiro read-only API (checked reads: a failed read is "unknown", never "no DOG").'); },
  linkBitcoinWallet() { throw Error('TODO(holder-btc-link): the native-DOG holder signs a message with their Bitcoin address; a service verifies the signature and reads the Runes balance.'); },
  snapshot() { throw Error('TODO(holder-payouts): snapshot at period end, read every linked wallet, split the pot per wallet above HOLDER_CONFIG.MIN_DOG_PER_WALLET.'); },
  claim() { throw Error('TODO(holder-payouts): holder claims need a server or contract.'); },
  cameoRoyalty() { throw Error('TODO(cameo-royalty): pay the Runestone holder 1% of the line win recorded in the spin history.'); },
  holderSpins() { return 0; }   // TODO(holder-spins), TODO(collection-cup): need a server or contract; out of scope for v1.
});

/* ---------- The screen: 1400 × 960 units, drawn at 2× ---------- */
const screen=canvas(2800,1920),sg=screen.getContext('2d');sg.setTransform(2,0,0,2,0,0);
const RX = 45, RY = 206, RW = 1310, RH = 570, CW = RW / 5, RHT = RH / 3;
const baseLayer = canvas(1400, 960);
const starField = Array.from({ length: 140 }, () => ({ x: Math.random() * 1400, y: Math.random() * 960, r: Math.random() * 1.8 + .3, s: Math.random() * .8 + .2, tw: Math.random() * 6 }));
(function drawBase() { const g = baseLayer.getContext('2d');
  g.fillStyle = lin(g, 0, 0, 0, 960, ['#08090a', '#101213', '#181a14']); g.fillRect(0, 0, 1400, 960);
  g.fillStyle = '#ffffff'; for (const s of starField) { g.globalAlpha = .12 + s.s * .3; g.beginPath(); g.arc(s.x, s.y, s.r, 0, 7); g.fill(); } g.globalAlpha = 1;
  // bunting along the top edge
  for (let k = 0; k < 66; k++) { const x = 8 + k * 21; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 18, 0); g.lineTo(x + 9, 12 + (k % 2) * 3); g.closePath(); g.fillStyle = k % 3 === 0 ? '#59613a' : k % 3 === 1 ? '#a39a6e' : '#2b2b26'; g.fill(); }
  round(g, 20, 18, 1360, 172, 22, '#0b0a09cc', '#d9b65855', 2);
  g.save(); g.shadowColor = '#e7e5e4'; g.shadowBlur = 14; round(g, RX - 12, RY - 12, RW + 24, RH + 24, 30, '#070606', '#c9a95c', 6); g.restore();
  round(g, RX - 4, RY - 4, RW + 8, RH + 8, 24, null, '#e7e5e455', 2);
  for (let k = 0; k < 26; k++) { const t = k / 26, x = RX - 6 + t * (RW + 12); for (const y of [RY - 7, RY + RH + 7]) { g.beginPath(); g.arc(x + 25, y, 4, 0, 7); g.fillStyle = '#d9c07a'; g.fill(); g.fillStyle = '#5a4a1c'; g.beginPath(); g.arc(x + 25.8, y + 1, 1.6, 0, 7); g.fill(); } }
  for (let c = 0; c < 5; c++) { g.fillStyle = lin(g, 0, RY, 0, RY + RH, ['#0e0d0b', '#1d1b16', '#0e0d0b']); g.fillRect(RX + c * CW, RY, CW - 3, RH); }
  // the foot of the screen: a wall of sandbags under the readouts
  g.save(); g.beginPath(); g.rect(0, 868, 1400, 92); g.clip(); g.fillStyle = '#14130e'; g.fillRect(0, 868, 1400, 92);
  for (let row = 0; row < 4; row++) for (let k = -1; k < 17; k++) { const x = k * 90 + (row % 2) * 45, y = 870 + row * 24; round(g, x, y, 86, 22, 10, lin(g, 0, y, 0, y + 22, ['#4a4630', '#2f2c1d']), '#15130b', 1.5); g.strokeStyle = '#ffffff10'; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 14, y + 11); g.lineTo(x + 72, y + 11); g.stroke(); }
  g.fillStyle = '#05050490'; g.fillRect(0, 868, 1400, 92); g.restore();
  g.fillStyle = '#ffffff14'; g.fillRect(45, 862, 1310, 1);
  text(g, '3 SNAPSHOTS = THE AIRDROP   ·   3 DOG TAGS = DOG TAGS   ·   5 MARCHES = MARCH OF THE ARMY', 700, 846, 19, '#bdb590'); })();
const shadeGrad = sg.createLinearGradient(0, RY, 0, RY + RH); shadeGrad.addColorStop(0, '#000a'); shadeGrad.addColorStop(.14, '#0000'); shadeGrad.addColorStop(.84, '#0000'); shadeGrad.addColorStop(1, '#000a');
let sbtn = [], pressedBtn = '';   // buttons drawn on the screen this frame: tappable in every view; the one held down sinks
function screenButton(id, label, x, y, w, h, act, style = 'gold', sub = '') {
  const hot = scene && scene.hover === id, g = sg, y0 = y, dn = pressedBtn === id; if (dn) y += 5; g.save();
  // a keycap: a dark lip below the button that the face sinks into when held
  if (!dn) round(g, x, y + 5, w, h, h / 2, '#00000088'); else round(g, x, y + 1, w, h, h / 2, '#00000066');
  g.shadowColor = style === 'gold' ? BRASS : ACCENT; g.shadowBlur = dn ? 6 : hot ? 30 : 16;
  round(g, x, y, w, h, h / 2, style === 'gold' ? lin(g, 0, y, 0, y + h, ['#f6e3a6', '#dcb95e', '#a98430']) : style === 'moon' ? lin(g, 0, y, 0, y + h, ['#fbfaf6', '#c9c5b8']) : style === 'doom' ? lin(g, 0, y, 0, y + h, ['#5a5750', '#2a2824']) : '#14120ee8', style === 'ghost' ? '#d9c07acc' : INK, 4); g.restore();
  fitText(g, label, x + w / 2, y + h / 2 - (sub ? 9 : 1), sub ? 26 : 28, w - 30, style === 'ghost' || style === 'doom' ? '#f4efe0' : INK, '900', HEAD); if (sub) text(g, sub, x + w / 2, y + h / 2 + 18, 13, style === 'ghost' || style === 'doom' ? '#cfc7a6' : '#5a4310', 'Arial', 'center', '800');
  sbtn.push({ id, x, y: y0, w, h, act });
}
function highlightIndex(now) { return !spinning && !scene && !feature() && lastResult && lastResult.wins.length ? Math.floor(now / 1400) % lastResult.wins.length : -1; }
function reelOffset(a, now) {
  const t = now - a.start; if (t <= 0) return 0;
  if (t < a.land) { const s = t / a.land, k = .14; return a.travel * (s < k ? s * s / (2 * k) : s - k / 2) / (1 - k / 2); }
  const u = Math.min(1, (t - a.land) / a.bounce); return a.travel + a.kick * Math.sin(Math.PI * u) * (1 - u);
}
const cellX = c => RX + c * CW + (CW - 176) / 2;
function drawReels(now, opts = {}) {
  const lift = opts.lift || null, dim = opts.dim || 0;
  for (let c = 0; c < 5; c++) {
    sg.save(); sg.beginPath(); sg.rect(RX + c * CW, RY, CW - 3, RH); sg.clip();
    if (freeMode) { sg.fillStyle = '#060706aa'; sg.fillRect(RX + c * CW, RY, CW - 3, RH); }
    const a = spinning && animations[c];
    if (a) { const offset = reelOffset(a, now) * RHT; const first = Math.max(0, Math.floor(offset / RHT)); for (let i = first; i < Math.min(a.sequence.length, first + 4); i++) { const [s, f] = a.sequence[i]; const t = tileFor(s, f); if (t) sg.drawImage(t, cellX(c), RY + i * RHT - offset + 7, 176, 176); } }
    else for (let r = 0; r < 3; r++) { if (lift && lift(c, r)) continue; const t = tileFor(state.grid[c][r], faces[c][r]); if (t) sg.drawImage(t, cellX(c), RY + r * RHT + 7, 176, 176); }
    sg.fillStyle = shadeGrad; sg.fillRect(RX + c * CW, RY, CW, RH); sg.restore();
    if (a && a.antic && now < a.start + a.land) { sg.save(); sg.globalAlpha = .55 + .45 * Math.sin(now / 90); sg.shadowColor = BRASS; sg.shadowBlur = 24; round(sg, RX + c * CW + 4, RY + 4, CW - 11, RH - 8, 16, null, BRASS, 5); sg.restore(); }
  }
  if (dim) { sg.fillStyle = `rgba(4,4,3,${dim})`; sg.fillRect(RX, RY, RW, RH); }
  if (lift) for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) if (lift(c, r)) { const k = lift(c, r), t = tileFor(state.grid[c][r], faces[c][r]); sg.save(); sg.translate(cellX(c) + 88, RY + r * RHT + 95 - k.up); sg.scale(k.scale, k.scale); sg.shadowColor = k.color || BRASS; sg.shadowBlur = 40; if (t) sg.drawImage(t, -88, -88, 176, 176); sg.restore(); }
  const hi = highlightIndex(now), w = hi >= 0 ? lastResult.wins[hi] : null;
  if (w) { const line = E.lines[w.line]; for (let c = 0; c < w.count; c++) round(sg, RX + c * CW + 9, RY + line[c] * RHT + 7, CW - 21, RHT - 14, 18, null, BRASS, 5); sg.save(); sg.shadowColor = BRASS; sg.shadowBlur = 14; sg.lineWidth = 5; sg.strokeStyle = '#f1dc9ad0'; sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); sg.restore(); }
  else if (state.showLines && !spinning && !scene) { sg.strokeStyle = '#e7e5e455'; sg.lineWidth = 2; E.lines.slice(0, 5).forEach(line => { sg.beginPath(); line.forEach((r, c) => c ? sg.lineTo(RX + (c + .5) * CW, RY + (r + .5) * RHT) : sg.moveTo(RX + .5 * CW, RY + (r + .5) * RHT)); sg.stroke(); }); }
  return w;
}
/* The tag lights: the cabinet's rows px-tag0 (bottom) to px-tag7 (top). They step in time on wins, sweep during bonuses and all light on the jackpot. */
function updateTags(now, dt) {
  const t = now / 1000, target = new Array(8).fill(0);
  if (scene && scene.kind === 'jackpot') for (let i = 0; i < 8; i++) target[i] = .82 + .18 * Math.sin(t * 13 + i * .7);
  else if (scene || freeMode) { const pos = (t * 8.5) % 14, p = pos <= 7 ? pos : 14 - pos; for (let i = 0; i < 8; i++) target[i] = Math.max(0, 1 - Math.abs(i - p) / 2.2); }
  else if (now < winUntil) { const beat = Math.floor((now - winStart) / 250), s = winPower; for (let i = 0; i < 8; i++) target[i] = (i % 2 === beat % 2) ? s : s * .16; }
  else for (let i = 0; i < 8; i++) target[i] = .1 + .06 * Math.sin(t * 1.3 + i * .8);
  const k = Math.min(1, dt * 16); for (let i = 0; i < 8; i++) tagGlow[i] += (target[i] - tagGlow[i]) * k;
}
let winPower = .6;
// A small dog tag, lying down, with its hole on the left. glow 0..1 lights it brass.
function miniTag(g, x, y, w, h, glow) {
  g.save(); const path = () => { g.beginPath(); g.roundRect(x, y, w, h, h * .42); };
  path(); g.fillStyle = lin(g, x, y, x, y + h, ['#6a6e70', '#3c3f41', '#2a2c2d']); g.fill();
  if (glow > .02) { g.save(); g.globalAlpha = Math.min(1, glow); g.shadowColor = BRASS; g.shadowBlur = 16 * glow; path(); g.fillStyle = lin(g, x, y, x, y + h, ['#fff0b0', BRASS, BRASS_D]); g.fill(); g.restore(); }
  path(); g.lineWidth = 1.2; g.strokeStyle = glow > .3 ? '#fff6d0' : '#15171899'; g.stroke(); g.beginPath(); g.arc(x + h * .55, y + h / 2, h * .17, 0, 7); g.fillStyle = '#101112'; g.fill();
  g.restore(); }
function drawHudTags() { for (let i = 0; i < 8; i++) miniTag(sg, 62, 30 + (7 - i) * 19.4, 70, 15, tagGlow[i]); }
function holderLines() {
  const h = holder(), n = holderWallets(), mn = HOLDER_CONFIG.MIN_DOG_PER_WALLET;
  const share = mn == null ? 'SHARE PER WALLET: TBC (MINIMUM NOT SET)' : n == null ? `MIN ${fmt(mn)} DOG PER WALLET` : n === 0 ? `MIN ${fmt(mn)} DOG PER WALLET` : `≈ ${fmt(h.pot / n)} PER WALLET`;
  const wallets = n == null ? 'HOLDER WALLETS: NOT READ YET' : n === 0 ? 'NO HOLDER WALLETS LINKED · POT WAITS' : `${fmt(n)} HOLDER WALLETS (TEST)`;
  return { pot: fmt(h.pot), period: `${h.period.replace('-', ' · ')} · ENDS IN ${weekEndsIn()}`, share, wallets, last: h.last ? `LAST ${h.last.period.split('-')[1]}: ${fmt(h.last.pot)} LAYR` : '' };
}
function drawTop(now, shownBet) {
  drawHudTags();
  sg.save(); sg.shadowColor = '#000'; sg.shadowBlur = 6; fitText(sg, 'DOG ARMY', 280, 66, 54, 250, MOONC, '900', HEAD); sg.restore(); text(sg, 'RUNE #3 · NO TEAM · NO PRESALE', 280, 108, 12.5, KHAKI, 'Arial', 'center', '800'); text(sg, '$DOG ARMY ON PARADE', 280, 132, 11.5, '#80795a', 'Arial', 'center', '800');
  text(sg, 'TO THE MOON JACKPOT', 700, 42, 22, BRASS, 'Arial', 'center', '900');
  sg.save(); sg.shadowColor = BRASS; sg.shadowBlur = excite > 0 ? 30 : 10; text(sg, fmt(G.meter(state, shownBet)), 700, 104, 60, '#ffffff', 'Arial', 'center', '300'); sg.restore();
  text(sg, `LAYR PROGRESSIVE  ·  ${fmt(shownBet)} BET LEVEL`, 700, 158, 16, '#bdb590');
  const hl = holderLines(), rx = 1190;
  text(sg, 'DOG ARMY HOLDER POT', rx, 36, 17, ACCENT, 'Arial', 'center', '900');
  text(sg, `${hl.pot} LAYR`, rx, 72, 32, '#ffffff', 'Arial', 'center', '400');
  text(sg, hl.period, rx, 102, 13, '#d6d0b8', 'Arial', 'center', '700'); fitText(sg, hl.share, rx, 124, 13, 330, '#f1dc9a', '700'); fitText(sg, hl.wallets, rx, 144, 12, 330, '#bdb590', '700'); if (hl.last) fitText(sg, hl.last, rx, 164, 12, 330, '#8d876c', '700');
  if (labRun) { round(sg, 590, 172, 220, 26, 13, '#b3402f'); text(sg, 'BONUS LAB · NOT REAL PLAY', 700, 185, 13, '#fff', 'Arial', 'center', '900'); }
}
// The big-win burst: a brass DOG stamp that pops over the screen on big wins (original lettering, not a logo).
let burstAt = -1e9;
function drawBurst(now) { const t = (now - burstAt) / 1600; if (t < 0 || t > 1) return; const k = RM() ? 1 : backOut(clamp(t * 4)) * (t > .8 ? 1 - (t - .8) * 5 : 1); sg.save(); sg.globalAlpha = t > .8 ? 1 - (t - .8) * 5 : 1; sg.translate(700, RY + RH / 2); sg.rotate(-.08); sg.scale(k, k); sg.shadowColor = BRASS; sg.shadowBlur = 40;
  round(sg, -250, -88, 500, 176, 20, '#0b0a07f2', BRASS, 8); sg.shadowBlur = 0; round(sg, -238, -76, 476, 152, 12, null, '#dcb95e66', 2);
  sg.save(); sg.shadowColor = '#000'; sg.shadowBlur = 8; fitText(sg, 'BIG WIN', 0, -20, 92, 440, MOONC, '900', HEAD); sg.restore(); spaced(sg, 'THE ARMY MARCHES ON', 0, 48, 24, 5, BRASS, '900'); sg.restore(); }
/* Particles drawn on the screen itself (coins, sparks, confetti), so effects show on the cabinet and in fullscreen alike. */
const fx = [];
function burst(x, y, n, kind = 'coin', spread = 1) { if (RM()) { if (fx.length >= 8) return; n = Math.min(n, 3, 8 - fx.length); spread *= .6; } for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = (2 + Math.random() * 6) * spread; fx.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5 * spread, life: 1, kind, rot: Math.random() * 6, hue: Math.random() }); } }
function drawFx(dt) {
  for (let i = fx.length - 1; i >= 0; i--) { const p = fx[i]; p.x += p.vx; p.y += p.vy; p.vy += .28; p.rot += .15; p.life -= dt * .55; if (p.life <= 0 || p.y > 980) { fx.splice(i, 1); continue; }
    sg.save(); sg.globalAlpha = Math.min(1, p.life * 1.6); sg.translate(p.x, p.y); sg.rotate(p.kind === 'dog' ? Math.sin(p.rot) * .4 : p.rot);
    if (p.kind === 'coin') { sg.scale(Math.abs(Math.cos(p.rot * 1.3)) * .8 + .2, 1); sg.beginPath(); sg.arc(0, 0, 11, 0, 7); sg.fillStyle = '#dcb95e'; sg.fill(); sg.lineWidth = 3; sg.strokeStyle = '#6d5316'; sg.stroke(); }
    else if (p.kind === 'dog') { sg.beginPath(); sg.arc(0, 0, 15, 0, 7); sg.fillStyle = lin(sg, 0, -15, 0, 15, ['#f6e3a6', '#dcb95e', '#a98430']); sg.fill(); sg.lineWidth = 2.5; sg.strokeStyle = '#4a3a10'; sg.stroke(); text(sg, 'DOG', 0, 1, 9, '#2a200a', HEAD, 'center', '900'); }
    else if (p.kind === 'star') star(sg, 0, 0, 12, p.hue > .5 ? '#fff3c0' : '#e7e5e4');
    else { sg.fillStyle = ['#dcb95e', '#a39a6e', '#e7e5e4', '#b3402f', '#ffffff'][Math.floor(p.hue * 5)]; sg.fillRect(-6, -3, 12, 6); }
    sg.restore(); }
}
