// Seeded RTP check for the verbatim Block Fortune v2 engine (the one inside Who Is Satoshi?).
// Usage: node tools/who-is-satoshi/rtp-sim.mjs [spins=5000000] [seed=11021]
// Every pick bonus opens envelopes 1-3 (prizes are dealt independently, so the choice doesn't change the expectation);
// every hold-and-respin plays out; the gamble is never taken (it is an even bet).
import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import path from 'node:path';
const here = path.dirname(fileURLToPath(import.meta.url));
// Loaded as plain script text (the repo's package.json says "type":"module", so require() of a .js file fails there).
const BF = new Function(readFileSync(path.join(here, 'src', 'bf-engine.js'), 'utf8') + '\nreturn BF;')();
const N = Number(process.argv[2] || 5e6), SEED = Number(process.argv[3] || 11021);
function mulberry32(a) { return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const r = mulberry32(SEED), rng = n => Math.floor(r() * n);
const s = BF.fresh(); s.balance = 1e15; s.bet = 100; let wag = 0, paid0 = 0; const part = { line: 0, scatter: 0, free: 0, vault: 0, chain: 0, jackpot: 0 }, hits = { free: 0, vault: 0, chain: 0, jackpot: 0 };
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const free = s.free > 0, b = free ? s.freeBet : s.bet; BF.start(s, rng); if (!free) wag += b;
  const r1 = BF.settle(s), jw = r1.jackpotWin, base = r1.total - jw;
  if (free) part.free += r1.total; else { part.line += r1.lineTotal; part.scatter += r1.scatterPay; part.jackpot += jw; if (r1.triggers.free) hits.free++; }
  if (jw) hits.jackpot++;
  let g = 0; while (BF.feature(s) && g++ < 400) { const f = BF.feature(s); if (!f.free) hits[f.type]++; if (f.type === 'vault') { for (let k = 0; k < 9 && f.picks.length < 3; k++) BF.pick(s, k); } else { while (!BF.featureDone(f)) BF.respin(s); } const c = BF.collect(s); if (f.free) part.free += c.amount; else { part[f.type] += c.amount - c.jackpotWin; part.jackpot += c.jackpotWin; if (c.jackpotWin) hits.jackpot++; } }
  if (s.freeActive && !s.free) BF.endFree(s); s.gamble = 0;
}
const paid = s.paidOut, pct = x => (x / wag * 100).toFixed(2) + '%', paidSpins = N - 0;
const out = { spins: N, seed: SEED, wagered: wag, paidOut: Math.round(paid), rtp: +(paid / wag * 100).toFixed(3), parts: Object.fromEntries(Object.entries(part).map(([k, v]) => [k, pct(v)])), oneIn: Object.fromEntries(Object.entries(hits).map(([k, v]) => [k, v ? Math.round(wag / 100 / v) : null])), seconds: (Date.now() - t0) / 1000 };
console.log(JSON.stringify(out, null, 1));
