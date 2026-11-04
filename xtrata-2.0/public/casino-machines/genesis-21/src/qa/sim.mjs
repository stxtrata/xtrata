import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const BF = require('./engine.cjs');
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const N = Number(process.argv[2] || 5000000), seed = Number(process.argv[3] || 21);
const rnd = mulberry32(seed), rng = n => Math.floor(rnd() * n);
const st = BF.fresh(); st.balance = 1e15;
const bets = BF.bets;
const t0 = Date.now(); let paid = 0, wagered = 0, free = 0, vault = 0, chain = 0, jack = 0, lineWin = 0, bonusWin = 0, sc = 0;
for (let i = 0; i < N; i++) {
  st.bet = bets[i % bets.length]; const bet = st.bet;
  BF.start(st, rng); wagered += bet;
  let r = BF.settle(st);
  const beforePaid = r.total;
  lineWin += r.lineTotal; sc += r.scatterPay; if (r.jackpotWin) jack++;
  if (r.triggers.free) free++;
  let guard = 0;
  while (true) {
    let f = BF.feature(st);
    if (f) { if (f.type === 'vault') { vault++; BF.pick(st, 0); BF.pick(st, 1); BF.pick(st, 2); } else { chain++; while (!BF.featureDone(f)) BF.respin(st); } const c = BF.collect(st); bonusWin += c.amount; if (c.jackpotWin) jack++; continue; }
    if (st.free > 0) { BF.start(st, rng); const rr = BF.settle(st); lineWin += rr.lineTotal; sc += rr.scatterPay; if (rr.jackpotWin) jack++; if (rr.triggers.free) free += 0; continue; }
    if (st.freeActive) { BF.endFree(st); continue; }
    break;
  }
  if (++guard > 1e6) throw Error('loop');
}
const rtp = st.paidOut / st.wagered;
console.log(JSON.stringify({ spins: N, seed, wagered: st.wagered, paidOut: st.paidOut, rtp: +(rtp * 100).toFixed(3), freeTriggers: free, oneInFree: +(N / free).toFixed(1), vaultTriggers: vault, oneInVault: +(N / vault).toFixed(1), chainTriggers: chain, oneInChain: +(N / chain).toFixed(1), jackpots: jack, secs: (Date.now() - t0) / 1000 }));
