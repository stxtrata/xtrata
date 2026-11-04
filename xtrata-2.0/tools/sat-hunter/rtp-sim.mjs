// Seeded RTP check for the verbatim Block Fortune v2 engine (the one inside Sat Hunter; byte-identical to Forever Twins').
// Usage: node tools/sat-hunter/rtp-sim.mjs [spins=5000000] [seed=11021]
// Every Block 9 Vault bonus opens tubes 1-3 (prizes are dealt independently, so the choice doesn't change the expectation);
// every Hunt (hold and respin) plays out; the Odd Sat or Even Sat gamble is never taken (it is an even bet).
// The run must land within 0.3 percentage points of the design figure, 94.38%: otherwise it exits with a failure code.
import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import path from 'node:path'; import { createHash } from 'node:crypto';
const here = path.dirname(fileURLToPath(import.meta.url));
const DESIGN = 94.38, TOLERANCE = 0.3, ENGINE_SHA = '7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168';
// Loaded as plain script text (the repo's package.json says "type":"module", so require() of a .js file fails there).
const engineText = readFileSync(path.join(here, 'src', 'bf-engine.js'), 'utf8');
const engineSha = createHash('sha256').update(engineText).digest('hex');
const BF = new Function(engineText + '\nreturn BF;')();
const N = Number(process.argv[2] || 5e6), SEED = Number(process.argv[3] || 11021);
function mulberry32(a) { return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const r = mulberry32(SEED), rng = n => Math.floor(r() * n);
const s = BF.fresh(); s.balance = 1e15; s.bet = 100; let wag = 0; const part = { line: 0, scatter: 0, free: 0, vault: 0, chain: 0, jackpot: 0 }, hits = { free: 0, vault: 0, chain: 0, jackpot: 0 };
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const free = s.free > 0, b = free ? s.freeBet : s.bet; BF.start(s, rng); if (!free) wag += b;
  const r1 = BF.settle(s), jw = r1.jackpotWin;
  if (free) part.free += r1.total; else { part.line += r1.lineTotal; part.scatter += r1.scatterPay; part.jackpot += jw; if (r1.triggers.free) hits.free++; }
  if (jw) hits.jackpot++;
  let g = 0; while (BF.feature(s) && g++ < 400) { const f = BF.feature(s); if (!f.free) hits[f.type]++; if (f.type === 'vault') { for (let k = 0; k < 9 && f.picks.length < 3; k++) BF.pick(s, k); } else { while (!BF.featureDone(f)) BF.respin(s); } const c = BF.collect(s); if (f.free) part.free += c.amount; else { part[f.type] += c.amount - c.jackpotWin; part.jackpot += c.jackpotWin; if (c.jackpotWin) hits.jackpot++; } }
  if (s.freeActive && !s.free) BF.endFree(s); s.gamble = 0;
}
const paid = s.paidOut, pct = x => (x / wag * 100).toFixed(2) + '%', rtp = paid / wag * 100;
// Names on this machine: line = line wins, scatter = Nakamoto sats, free = Satoshi's Stash, vault = Block 9 Vault, chain = The Hunt, jackpot = Mythic
const out = { machine: 'Sat Hunter', spins: N, seed: SEED, engineSha256: engineSha.slice(0, 16), wagered: wag, paidOut: Math.round(paid), rtp: +rtp.toFixed(3), design: DESIGN, tolerance: TOLERANCE,
  parts: Object.fromEntries(Object.entries(part).map(([k, v]) => [k, pct(v)])), oneIn: Object.fromEntries(Object.entries(hits).map(([k, v]) => [k, v ? Math.round(wag / 100 / v) : null])), seconds: (Date.now() - t0) / 1000 };
console.log(JSON.stringify(out, null, 1));
let fail = false;
if (engineSha !== ENGINE_SHA) { console.error(`FAIL engine sha256 ${engineSha} is not the Forever Twins engine ${ENGINE_SHA}`); fail = true; }
if (N >= 1e6 && Math.abs(rtp - DESIGN) > TOLERANCE) { console.error(`FAIL RTP ${rtp.toFixed(3)}% is not within ${TOLERANCE} of ${DESIGN}%`); fail = true; }
else if (N < 1e6) console.log(`NOTE ${N} spins is too few for the ${TOLERANCE}% check (use at least 1,000,000; the full run is 5,000,000)`);
else console.log(`PASS RTP ${rtp.toFixed(3)}% is within ${TOLERANCE} of ${DESIGN}%`);
process.exit(fail ? 1 : 0);
