#!/usr/bin/env node
// Play simulated games on a mock board and report what happened.
//
//   npm run sim
//   npm run sim -- --games 20 --seed 7 --grief 0.4
//   npm run sim -- --white random --black greedy --verbose

import { runSimulation, DEFAULTS } from '../src/simulation.js';
import { toPgn } from '../src/replay.js';

function parseArgs(argv) {
  const out = {
    games: 5,
    seed: DEFAULTS.seed,
    white: DEFAULTS.white,
    black: DEFAULTS.black,
    griefRate: DEFAULTS.griefRate,
    verbose: false,
    pgn: false
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => argv[++i];
    if (arg === '--games') out.games = Number(next());
    else if (arg === '--seed') out.seed = Number(next());
    else if (arg === '--white') out.white = next();
    else if (arg === '--black') out.black = next();
    else if (arg === '--grief') out.griefRate = Number(next());
    else if (arg === '--verbose') out.verbose = true;
    else if (arg === '--pgn') out.pgn = true;
    else if (arg === '--help') {
      console.log(
        'usage: sim [--games n] [--seed n] [--white bot] [--black bot] [--grief 0..1] [--verbose] [--pgn]\n' +
          'bots: random, greedy'
      );
      process.exit(0);
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

const tally = new Map();
let totalSubmissions = 0;
let totalFiltered = 0;
let totalAccepted = 0;
let totalRejected = 0;
let nonDeterministic = 0;

console.log(
  `simulating ${args.games} game(s)  white=${args.white}  black=${args.black}  grief=${args.griefRate}\n`
);

for (let i = 0; i < args.games; i++) {
  const seed = args.seed + i;
  const result = await runSimulation({
    seed,
    white: args.white,
    black: args.black,
    griefRate: args.griefRate,
    onSubmission: args.verbose
      ? (info) => {
          const last = info.state.log[info.state.log.length - 1];
          const mark = last.status === 'accepted' ? `✓ ${last.san}` : `✗ ${last.reason}`;
          console.log(
            `  #${String(info.submission).padStart(3)}  ${info.sender.padEnd(14)} ${String(info.mv).padEnd(7)} ${mark}`
          );
        }
      : undefined
  });

  const reason = result.outcome
    ? `${result.outcome.result} ${result.outcome.reason}`
    : result.hitLimit
      ? 'unfinished (hit limit)'
      : 'unfinished';

  tally.set(reason, (tally.get(reason) || 0) + 1);
  totalSubmissions += result.submissions;
  totalFiltered += result.filtered;
  totalAccepted += result.accepted;
  totalRejected += result.rejected;
  if (!result.deterministic) nonDeterministic++;

  console.log(
    `seed ${String(seed).padStart(4)}  ` +
      `${String(result.submissions).padStart(4)} submitted  ` +
      `${String(result.filtered).padStart(3)} filtered  ` +
      `${String(result.accepted).padStart(3)} played  ` +
      `${String(result.rejected).padStart(4)} skipped  ` +
      `${reason}`
  );

  if (args.pgn) {
    console.log('\n' + toPgn(result.state, { Event: `Xtrata Chess (sim seed ${seed})` }) + '\n');
  }
}

const wasted = totalFiltered + totalRejected;
console.log('\n--- totals ---');
console.log(`submissions   ${totalSubmissions}`);
console.log(`filtered      ${totalFiltered}   turned away by the contract, never logged`);
console.log(`skipped       ${totalRejected}   logged, then skipped by replay`);
console.log(`played        ${totalAccepted}`);
console.log(
  `wasted        ${wasted}  (${((wasted / Math.max(1, totalSubmissions)) * 100).toFixed(1)}% of traffic paid a fee and changed nothing)`
);
console.log(`replay agreed ${args.games - nonDeterministic}/${args.games}`);
for (const [reason, count] of [...tally].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(3)}  ${reason}`);
}

if (nonDeterministic > 0) {
  console.error(`\nFAIL: ${nonDeterministic} game(s) replayed differently than they were played`);
  process.exit(1);
}
