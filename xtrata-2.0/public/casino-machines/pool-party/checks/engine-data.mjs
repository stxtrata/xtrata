// Engine-contract verification using only the unchanged core's public API.
// It deliberately does not claim to verify the browser presentation or account adapter.
// node checks/engine-data.mjs
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BF = createRequire(import.meta.url)(join(ROOT, 'src/engine.js'));
const checks = [];
function test(name, fn) {
  try { const info = fn(); checks.push({ name, ok: true, info: info ?? null }); }
  catch (error) { checks.push({ name, ok: false, error: error.message }); }
}
function assert(condition, message) { if (!condition) throw Error(message); }
const clone = value => JSON.parse(JSON.stringify(value));
function fresh() { const state = BF.fresh(); state.balance = 1000000; return state; }
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function rngFor(stops, seed = 4242, fill = false) {
  const random = mulberry32(seed); let index = 0;
  return range => {
    if (index < 5) { assert(range === 32, 'First five draws must be reel stops'); return stops[index++]; }
    return fill && range === BF.CHAIN_ODDS ? 0 : Math.floor(random() * range);
  };
}
const predicates = {
  line: result => result.lineTotal > 0 && !result.jackpot && !Object.values(result.triggers).some(Boolean),
  clean: result => !result.jackpot && !Object.values(result.triggers).some(Boolean),
  free: result => result.scatters === 3 && !result.triggers.chain && !result.triggers.vault,
  vault: result => result.triggers.vault && !result.triggers.chain && !result.triggers.free,
  chain: result => result.triggers.chain && !result.triggers.vault && !result.triggers.free
};
const stopsCache = {};
function stopsFor(type) {
  if (stopsCache[type]) return stopsCache[type];
  if (type === 'jackpot') return stopsCache[type] = BF.strips.map((_, column) =>
    Array.from({ length: 32 }, (_, stop) => stop).find(stop => BF.windowAt(column, stop)[1] === 'bitcoin'));
  const random = mulberry32(728911);
  for (let attempt = 0; attempt < 1000000; attempt++) {
    const stops = BF.strips.map(() => Math.floor(random() * 32));
    const result = BF.evaluate(stops.map((stop, column) => BF.windowAt(column, stop)), 100);
    if (predicates[type](result)) return stopsCache[type] = stops;
  }
  throw Error(`Could not locate valid stops for ${type}`);
}
function deal(state, type, seed = 4242, fill = false) {
  BF.start(state, rngFor(stopsFor(type), seed, fill));
  return BF.settle(state);
}
function collectAll(state) {
  const collected = [];
  while (BF.feature(state)) {
    const feature = BF.feature(state);
    if (feature.type === 'vault') for (const i of [0, 1, 2]) BF.pick(state, i);
    else while (BF.respin(state));
    collected.push(BF.collect(state));
  }
  return collected;
}

test('Pending round survives serialization and settles exactly once', () => {
  const state = fresh(), balanceBefore = state.balance;
  const pending = BF.start(state, rngFor(stopsFor('line')));
  assert(state.spins === 0 && state.balance === balanceBefore - state.bet, 'Start must debit and commit before settlement');
  const restored = BF.load(clone(state));
  assert(restored.pending.id === pending.id, 'Round ID changed after reload');
  const settled = BF.settle(restored), balanceAfter = restored.balance;
  assert(restored.history[0].id === pending.id && restored.spins === 1, 'Restored round was rerolled');
  assert(balanceAfter === balanceBefore - state.bet + settled.total, 'Restored settlement balance is incorrect');
  assert(BF.settle(restored) === null && restored.balance === balanceAfter && restored.spins === 1, 'Duplicate settlement credited twice');
  return { roundId: pending.id, win: settled.total, balanceBefore, balanceAfter };
});

test('Committed hold-and-respin frames are deterministic on reload', () => {
  const state = fresh(); BF.start(state, rngFor(stopsFor('chain'), 99));
  const restored = BF.load(clone(state));
  const before = JSON.stringify(state.pending.features);
  assert(before === JSON.stringify(restored.pending.features), 'Pending bonus frames changed');
  BF.settle(state); BF.settle(restored);
  const played = collectAll(state), skipped = collectAll(restored);
  assert(JSON.stringify(played) === JSON.stringify(skipped) && state.balance === restored.balance, 'Identical predealt frames paid different totals');
  return { payout: played[0].amount, note: 'Core/API invariant; browser Skip is checked separately.' };
});

test('Yield Farm deals nine independent prizes and permits exactly three distinct picks', () => {
  const state = fresh(); deal(state, 'vault', 99);
  const feature = BF.feature(state), awards = feature.awards.slice();
  assert(awards.length === 9 && awards.every(value => BF.vaultPrizes.includes(value)), 'Wrong prize range');
  assert(BF.pick(state, 0) !== null && BF.pick(state, 0) === null, 'Same lounger could be opened twice');
  assert(BF.collect(state) === null, 'Feature could be collected before three picks');
  BF.pick(state, 1); BF.pick(state, 2);
  assert(BF.pick(state, 3) === null, 'Fourth lounger was allowed');
  const result = BF.collect(state), after = state.balance;
  assert(result.amount === (awards[0] + awards[1] + awards[2]) * state.bet, 'Prize total differs from dealt board');
  assert(BF.collect(state) === null && state.balance === after, 'Pick feature double-collected');
  return { awards, opened: [0, 1, 2], amount: result.amount };
});

test('Full pool awards the jackpot once and resets only its bet meter', () => {
  const state = fresh(), original = clone(state.jackpots);
  deal(state, 'chain', 3, true);
  const feature = BF.feature(state);
  assert(feature.full && feature.frames.at(-1).cells.every(Boolean), 'Scripted engine draws did not fill the pool');
  while (BF.respin(state));
  const result = BF.collect(state);
  assert(result.jackpotWin === original[state.bet] + state.bet * BF.JACKPOT_RATE, 'Wrong full-grid jackpot amount');
  assert(state.jackpots[state.bet] === BF.seedFor(state.bet), 'Hit meter did not reset');
  assert(BF.bets.filter(bet => bet !== state.bet).every(bet => state.jackpots[bet] === original[bet]), 'Unrelated meters changed');
  assert(BF.collect(state) === null, 'Full-grid jackpot could be collected twice');
  return result;
});

test('Five STX on the centre row hit; substituting wilds does not hit', () => {
  const state = fresh(), result = deal(state, 'jackpot');
  assert(result.jackpot && result.jackpotWin === 50002, 'Five centre-row STX failed to hit at bet 100');
  const withWild = clone(result.round.grid); withWild[2][1] = 'wild';
  const evaluated = BF.evaluate(withWild, 100);
  assert(!evaluated.jackpot, 'Wild was incorrectly accepted for the jackpot');
  return { jackpot: result.jackpotWin, wildSubstitutionJackpot: evaluated.jackpot };
});

test('Happy Hour awards eight spins, retriggers four, caps at 24, and contributes no free bets', () => {
  const state = fresh(), first = deal(state, 'free');
  assert(first.freeAward === 8 && state.free === 8, 'Initial award differs from eight');
  const meterAfterPaidSpin = state.jackpots[state.bet], wagered = state.wagered;
  const awards = [first.freeAward];
  for (let i = 0; i < 6; i++) awards.push(deal(state, 'free', 4242 + i).freeAward);
  assert(state.freeAwarded === 24 && awards.slice(1, 5).every(value => value === 4) && awards.at(-1) === 0, 'Retrigger/cap differs from core rules');
  assert(state.jackpots[state.bet] === meterAfterPaidSpin && state.wagered === wagered, 'Free spins contributed a paid bet');
  while (state.free) { deal(state, 'clean'); collectAll(state); }
  const total = BF.endFree(state);
  assert(total.count === 24 && !state.freeActive, 'Free spins did not finish cleanly');
  return { awards, spinsPlayed: total.count, total: total.total, paidWagered: wagered };
});

test('Happy Hour doubles line/scatter evaluation while retaining canonical feature prizes', () => {
  const grid = stopsFor('free').map((stop, column) => BF.windowAt(column, stop));
  const base = BF.evaluate(grid, 100, 1), free = BF.evaluate(grid, 100, 2);
  const lineGrid = stopsFor('line').map((stop, column) => BF.windowAt(column, stop));
  const baseLine = BF.evaluate(lineGrid, 100, 1), freeLine = BF.evaluate(lineGrid, 100, 2);
  assert(baseLine.lineTotal > 0 && base.scatterPay > 0, 'Test must exercise actual line and scatter wins');
  assert(freeLine.lineTotal === baseLine.lineTotal * 2 && free.scatterPay === base.scatterPay * 2, 'Free multiplier changed');
  return { baseLine: baseLine.lineTotal, freeLine: freeLine.lineTotal, baseScatter: base.scatterPay, freeScatter: free.scatterPay,
    note: 'The unmodified core does not multiply separate pick/hold feature prizes by two.' };
});

test('Stake or Swap is one 50/50 gamble and cannot be repeated', () => {
  const outcomes = [];
  for (const firstDraw of [0, 1]) {
    const state = fresh(); deal(state, 'line');
    const before = state.balance, stake = state.gamble; let first = true;
    const result = BF.gamble(state, 'odd', range => { if (first) { first = false; assert(range === 2, 'Gamble odds changed'); return firstDraw; } return 0; });
    assert(result.win === Boolean(firstDraw), 'Wrong parity result');
    assert(state.balance === before + (result.win ? stake : -stake), 'Gamble net is wrong');
    assert(BF.gamble(state, 'odd', () => 0) === null, 'Repeated gamble accepted');
    outcomes.push({ win: result.win, stake, payout: result.amount, net: state.balance - before });
  }
  assert(outcomes[0].net + outcomes[1].net === 0, 'Gamble is not an even bet');
  return outcomes;
});

test('Separate pristine engine states do not mutate each other', () => {
  const real = fresh(), before = JSON.stringify(real), practice = fresh();
  deal(practice, 'chain', 4, true); collectAll(practice);
  assert(JSON.stringify(real) === before, 'Practice changed real core state');
  return { note: 'Core state isolation only; browser persistence/service isolation is checked in the browser suite.' };
});

const report = { checkedAt: new Date().toISOString(), scope: 'Canonical engine public API', checks, ok: checks.every(check => check.ok) };
await mkdir(join(ROOT, 'checks/results'), { recursive: true });
await writeFile(join(ROOT, 'checks/results/engine-data.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;
