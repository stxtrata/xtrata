#!/usr/bin/env node
// Do the rating walk, and write down what it found.
//
//   node harness/wizards/build-checkpoint.mjs                 print it
//   node harness/wizards/build-checkpoint.mjs --out c.json     write it
//
// WRITING ONE IS THE VERIFICATION. This replays every ranked game on the
// contract, in index order, exactly as the board does — so the inscription is a
// receipt for work already done rather than an assertion made in advance.
//
// IT MUST BE REPRODUCIBLE, because that is the only thing making a checkpoint
// safe to believe. Anybody can run this against the same chain state and get
// byte-identical output; if their bytes differ from an inscribed checkpoint,
// one of the two is wrong and the difference says where. That is why the
// writing is canonical and why there is no timestamp in it.
//
// It shares its code with the board rather than reimplementing it: the same
// replay, the same eligibility, the same rating function. A second
// implementation of Elo would drift, and the drift would be invisible until two
// boards disagreed about somebody's rating.

import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Cl } from '@stacks/transactions';

import { ALLOWED_CONTRACT, WizardSafetyError } from './wizards-core.mjs';
import { readOnly } from './play.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');

const arg = (name, fallback = null) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};

/** The board's own modules, bundled rather than reimplemented. */
async function load(entry) {
  const { build } = await import('esbuild');
  const out = await build({
    entryPoints: [resolve(ROOT, entry)],
    bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'error'
  });
  return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);
}

const uint = (n) => Cl.serialize(Cl.uint(n));

async function main() {
  const [checkpoint, replayMod, eligibility, ratings, recover, rules, canonical] = await Promise.all([
    load('packages/protocol/checkpoint.ts'),
    load('packages/replay/replay.ts'),
    load('packages/ratings/eligibility.ts'),
    load('packages/ratings/elo-v1.ts'),
    load('packages/protocol/recover.ts'),
    load('packages/protocol/rules.ts'),
    load('packages/protocol/canonical.ts')
  ]);

  const rankedCount = Number((await readOnly('get-ranked-count')).value);
  // NOT THE CURRENT HEIGHT. The first version of this stamped the chain's
  // height at the moment it ran, and the gate in inscribe-manifest.mjs refused
  // the very first checkpoint it produced — correctly. A height that moves every
  // nine seconds means two walks over identical games disagree, and a document
  // nobody can reproduce is one nobody can check.
  //
  // The honest number is a fact about the INPUTS: the block of the last move of
  // the last game counted. Two walks over the same games produce it identically,
  // and it says what a reader actually wants to know — how far along the chain
  // these ratings reach.
  let height = 0;
  console.log(`\nwalking ${rankedCount} ranked games on ${ALLOWED_CONTRACT}\n`);

  const games = [];
  let skipped = 0;

  for (let index = 0; index < rankedCount; index++) {
    const id = Number((await readOnly('get-ranked-game', [uint(index)])).value.value);
    const row = (await readOnly('get-game', [uint(id)])).value.value;
    const nextSeq = Number(row['next-seq'].value);
    const rulesHash = row['rules-hash']?.value?.value ?? null;

    const entries = [];
    for (let seq = 0; seq < nextSeq; seq++) {
      const e = (await readOnly('get-entry', [uint(id), uint(seq)])).value.value;
      entries.push({
        seq,
        value: e.value.value,
        sender: e.sender.value,
        height: Number(e.height.value)
      });
    }

    // The board's recovery, not a guess: candidates are proposed and the game's
    // own commitment is the judge.
    const found = recover.recoverRules({
      rulesHash, openedBy: row['opened-by'].value, ranked: true,
      senders: entries.map((x) => x.sender), viewer: null, candidates: []
    });
    const useRules = found.confirmed ? found.rules : { ...rules.DEFAULT_RULES, ranked: true };

    const state = replayMod.replay(
      entries.map((e) => ({ mv: e.value, sender: e.sender, seq: e.seq, height: e.height })),
      { rules: useRules }
    );
    const check = eligibility.checkEligibility({ rulesHash }, state.rules, state);
    if (!check.eligible || state.result === null) {
      skipped++;
      process.stdout.write(`  game ${String(id).padEnd(3)} not counted\n`);
      continue;
    }
    const terminal = state.accepted.find((e) => e.seq === state.terminalSequence);
    const at = Number(terminal?.height ?? 0);
    if (at > height) height = at;
    games.push({ id, white: check.white, black: check.black, result: state.result, at });
    process.stdout.write(`  game ${String(id).padEnd(3)} ${check.white.slice(0, 8)} v ${check.black.slice(0, 8)}  ${state.result}\n`);
  }

  // THE SAME FUNCTION THE BOARD USES. Elo is path dependent, so this is fed the
  // games in ranked-index order and nothing re-sorts them.
  const table = ratings.leaderboard(
    ratings.computeRatings(
      games.map((g) => ({ ...g, terminalHeight: g.at }))
    )
  ).map((r) => ({
    // The names the rating table actually uses. Guessing them produced a
    // checkpoint claiming a player with ten games had won none of them — well
    // formed, reproducible, and wrong, which is the combination a shape check
    // cannot catch.
    who: r.principal, rating: r.rating, games: r.games,
    won: r.wins, drawn: r.draws, lost: r.losses
  }));

  const text = checkpoint.buildCheckpoint({
    contract: ALLOWED_CONTRACT,
    block: height,
    // `at` is the walk's own bookkeeping and does not belong in the document.
    games: games.map(({ id, white, black, result }) => ({ id, white, black, result })),
    table,
    note:
      'Chain the next checkpoint to this inscription with --after. Regenerate with ' +
      'harness/wizards/build-checkpoint.mjs and compare bytes before inscribing.'
  });

  const parsed = checkpoint.parseCheckpoint(text);
  if (!parsed.ok) {
    throw new WizardSafetyError(`this builder produced something the parser refuses: ${parsed.problems.join('; ')}`);
  }

  console.log(`\n${games.length} counted, ${skipped} not counted, through block ${height}`);
  const out = arg('out');
  if (out) {
    writeFileSync(out, text);
    console.log(`written to ${out}`);
  } else {
    console.log('\n' + text);
  }
}

main().catch((error) => {
  console.error(`\n${error.message}\n`);
  process.exit(1);
});
