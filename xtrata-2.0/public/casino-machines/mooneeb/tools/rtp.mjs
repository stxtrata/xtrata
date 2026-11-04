// Seeded return-to-player check on the exact engine Mooneeb ships (src/engine.js, the Block Fortune v2 engine).
//   node tools/rtp.mjs [spins=5000000] [seed=20261102]
// Plays every bonus to completion (Mooney Bags opens three bags; prizes are independent so which three doesn't matter),
// counts paid spins only, and reports the return by part against the published 94.38%.
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const BF = require(join(dirname(fileURLToPath(import.meta.url)), '../src/engine.js'));
const N = Number(process.argv[2] || 5e6), SEED = Number(process.argv[3] || 20261102);
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(SEED), rng = n => Math.floor(rnd() * n);
const st = BF.fresh(); st.balance = 1e15; st.bet = 100;
const parts = { lines: 0, scatters: 0, free: 0, pick: 0, hold: 0, jackpot: 0 }, trig = { free: 0, vault: 0, chain: 0, jackpot: 0 };
let paid = 0; const t0 = Date.now();
while (paid < N) {
  const freeSpin = st.free > 0; if (!freeSpin) paid++;
  BF.start(st, rng); const r = BF.settle(st);
  if (freeSpin) parts.free += r.total - r.jackpotWin;
  else { parts.lines += r.lineTotal; parts.scatters += r.scatterPay; if (r.triggers.free) trig.free++; if (r.triggers.vault) trig.vault++; if (r.triggers.chain) trig.chain++; }
  parts.jackpot += r.jackpotWin; if (r.jackpotWin) trig.jackpot++;
  // Bonuses landed during free spins count towards free spins, as in the published breakdown.
  while (st.features.length) { const f = BF.feature(st), inFree = f.free; if (f.type === 'vault') { BF.pick(st, 0); BF.pick(st, 1); BF.pick(st, 2); } else while (BF.respin(st)); const c = BF.collect(st), base = c.amount - c.jackpotWin; if (inFree) parts.free += base; else if (c.type === 'vault') parts.pick += base; else parts.hold += base; parts.jackpot += c.jackpotWin; if (c.jackpotWin) trig.jackpot++; }
  if (st.freeActive && !st.free) BF.endFree(st);
  st.history.length = 0; st.gamble = 0;
}
const pct = v => (v / st.wagered * 100).toFixed(3) + '%', rtp = st.paidOut / st.wagered * 100;
const out = { spins: N, seed: SEED, seconds: (Date.now() - t0) / 1000, rtp: +rtp.toFixed(4), target: 94.38, withinTolerance: Math.abs(rtp - 94.38) <= .3,
  parts: Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, pct(v)])), published: { lines: '59.7%', scatters: '1.5%', free: '8.5%', pick: '11.9%', hold: '10.3%', jackpot: '2.4%' },
  frequency: { moonshot: `1 in ${(N / trig.free).toFixed(1)}`, mooneyBags: `1 in ${(N / trig.vault).toFixed(1)}`, spellIt: `1 in ${(N / trig.chain).toFixed(1)}`, jackpots: trig.jackpot } };
console.log(JSON.stringify(out, null, 2));
if (!out.withinTolerance) process.exit(1);
