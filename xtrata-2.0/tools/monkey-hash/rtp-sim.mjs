#!/usr/bin/env node
// Seeded RTP simulation of the Block Fortune v2 engine exactly as it ships inside Monkey Hash (src/bf-engine.js).
// Every feature is played to its end (free spins incl. retriggers, all 3 booths, the whole respin sequence, jackpots).
// The gamble is an even bet and is not played. Usage: node tools/monkey-hash/rtp-sim.mjs [spins=5000000] [seed=1] [bet=100]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const HERE = dirname(fileURLToPath(import.meta.url));
const BF = new Function(readFileSync(join(HERE, 'src', 'bf-engine.js'), 'utf8') + '\nreturn BF;')();
const spins = Number(process.argv[2] || 5e6), seed = Number(process.argv[3] || 1), bet = Number(process.argv[4] || 100);
let a = seed >>> 0; const r = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const rng = n => Math.floor(r() * n);
const s = BF.fresh(); s.balance = 1e15; s.bet = bet; let wagered = 0, played = 0, nFree = 0, nVault = 0, nChain = 0, nJack = 0, lines = 0, scat = 0, freeW = 0, vaultW = 0, chainW = 0, jackW = 0;
const t0 = Date.now();
for (let i = 0; i < spins; i++) {
  const free = s.free > 0; if (!free) { wagered += s.bet; played++; }
  const p = BF.start(s, rng), paid0 = s.paidOut; const res = BF.settle(s);
  const jw = res.jackpotWin || 0; if (jw) { nJack++; jackW += jw; }
  if (free) freeW += res.total - jw; else { lines += res.lineTotal; scat += res.scatterPay; }
  if (res.triggers.free && !free) nFree++;
  let g = 0;
  while (BF.feature(s) && g++ < 400) {
    const f = BF.feature(s), b0 = s.paidOut;
    if (f.type === 'vault') { nVault++; const order = [0, 1, 2, 3, 4, 5, 6, 7, 8]; for (let k = 0; k < 3; k++) BF.pick(s, order.splice(rng(order.length), 1)[0]); }
    else { nChain++; while (!BF.featureDone(f)) BF.respin(s); }
    const c = BF.collect(s); if (c) { if (f.type === 'vault') vaultW += c.amount - c.jackpotWin; else chainW += c.amount - c.jackpotWin; if (c.jackpotWin) { nJack++; jackW += c.jackpotWin; } }
  }
  if (s.freeActive && !s.free) BF.endFree(s);
  if (s.balance < 1e14) s.balance = 1e15;
}
const rtp = s.paidOut / wagered, pc = x => (x / wagered * 100).toFixed(2) + '%';
console.log(JSON.stringify({ spinsTotal: spins, paidSpins: played, bet, seed, wagered, paidOut: s.paidOut, RTP: (rtp * 100).toFixed(3) + '%', designed: '94.38%', withinTolerance: Math.abs(rtp * 100 - 94.38) <= 0.3,
  shares: { lines: pc(lines), scatterPay: pc(scat), freeSpinsWins: pc(freeW), pickBonus: pc(vaultW), holdAndRespin: pc(chainW), jackpot: pc(jackW) },
  triggersPer: { freeSpins: Math.round(played / Math.max(1, nFree)), pick: Math.round(played / Math.max(1, nVault)), holdRespin: Math.round(played / Math.max(1, nChain)), jackpotCount: nJack }, seconds: (Date.now() - t0) / 1000 }, null, 1));
