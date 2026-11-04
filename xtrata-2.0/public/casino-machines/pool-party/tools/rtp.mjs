// Seeded return-to-player check of the unchanged Block Fortune v2 engine.
// node tools/rtp.mjs [paid-spins=5000000] [seed=20261102]
// Calls the canonical API; finishes all bonuses AND the last paid spin's free-spin tail.
// This is a statistical check of the design estimate, not certification.
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url), BF = require(join(ROOT, 'src/engine.js'));
const N = Number(process.argv[2] || 5000000), SEED = Number(process.argv[3] || 20261102);
if (!Number.isSafeInteger(N) || N < 1 || !Number.isSafeInteger(SEED)) throw Error('Use a positive integer spin count and an integer seed.');
const engineSha256 = createHash('sha256').update(await readFile(join(ROOT, 'src/engine.js'))).digest('hex');
if (engineSha256 !== '7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168') throw Error('Refusing RTP check: canonical engine hash mismatch');
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(SEED), rng = n => Math.floor(rnd() * n);
const st = BF.fresh(); st.balance = 1e15; st.bet = 100;
const parts = { lines: 0, scatters: 0, free: 0, pick: 0, hold: 0, jackpot: 0 };
const triggers = { free: 0, vault: 0, chain: 0, jackpot: 0 };
let paid = 0, freeSpins = 0; const startTime = Date.now();
while (paid < N || st.free > 0) {
  const free = st.free > 0;
  if (free) freeSpins++; else paid++;
  BF.start(st, rng);
  const result = BF.settle(st);
  if (free) parts.free += result.total - result.jackpotWin;
  else {
    parts.lines += result.lineTotal; parts.scatters += result.scatterPay;
    if (result.triggers.free) triggers.free++;
    if (result.triggers.vault) triggers.vault++;
    if (result.triggers.chain) triggers.chain++;
  }
  parts.jackpot += result.jackpotWin;
  if (result.jackpotWin) triggers.jackpot++;
  while (st.features.length) {
    const feature = BF.feature(st), inFree = feature.free;
    if (feature.type === 'vault') { BF.pick(st, 0); BF.pick(st, 1); BF.pick(st, 2); }
    else while (BF.respin(st));
    const collected = BF.collect(st), base = collected.amount - collected.jackpotWin;
    if (inFree) parts.free += base;
    else if (collected.type === 'vault') parts.pick += base;
    else parts.hold += base;
    parts.jackpot += collected.jackpotWin;
    if (collected.jackpotWin) triggers.jackpot++;
  }
  if (st.freeActive && !st.free) BF.endFree(st);
  st.history.length = 0; st.gamble = 0;
}
const percentage = v => Number((v / st.wagered * 100).toFixed(6));
const rtp = st.paidOut / st.wagered * 100;
const partsTotal = Object.values(parts).reduce((sum, value) => sum + value, 0);
const report = {
  completedAt: new Date().toISOString(), engineSha256, paidSpins: N, freeSpins, seed: SEED,
  seconds: Number(((Date.now() - startTime) / 1000).toFixed(3)), rtp: Number(rtp.toFixed(6)),
  target: 94.38, tolerancePercentagePoints: 0.3, withinTolerance: Math.abs(rtp - 94.38) <= 0.3,
  wagered: st.wagered, paidOut: st.paidOut, partAmounts: parts,
  partReturnPercent: Object.fromEntries(Object.entries(parts).map(([name, value]) => [name, percentage(value)])),
  publishedRoundedEstimates: { lines: 59.7, scatters: 1.5, free: 8.5, pick: 11.9, hold: 10.3, jackpot: 2.4 },
  triggers, frequency: { happyHour: N / triggers.free, yieldFarm: N / triggers.vault, deepLiquidity: N / triggers.chain, jackpotHits: triggers.jackpot },
  invariants: { exactlyRequestedPaidSpins: paid === N && st.wagered === N * st.bet,
    componentAccounting: partsTotal === st.paidOut, noUnfinishedRound: !BF.busy(st) && st.free === 0 && !st.freeActive },
  notes: ['All free spins and queued features are drained, including the final paid spin.',
    'Gamble is excluded; its expectation is even.', 'Jackpot variance affects finite-sample return; this is not a certified RTP.']
};
report.ok = report.withinTolerance && Object.values(report.invariants).every(Boolean);
await mkdir(join(ROOT, 'checks/results'), { recursive: true });
await writeFile(join(ROOT, 'checks/results', `rtp-${N}-seed-${SEED}.json`), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;
