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
import { readOnly, endpoint as chainEndpoint } from './play.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');

/** The wallet whose holdings list the tournaments, as the board reads them. */
const TOURNAMENT_DIRECTORY = 'SP4ERAJ8SN0J7V3DWZNKBWM7HGWCFV9A3HH62S2S';
/** Exhibition One, which predates the directory and is always worth reading. */
const DEFAULT_TOURNAMENT = 2993;

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

/**
 * Read every tournament manifest the directory knows, for candidate building.
 *
 * The same source the board uses: manifests held by the tournament directory,
 * plus whatever `--manifests` names. Reading them is a handful of calls and
 * they are cached by the reader, against a walk that makes thousands.
 *
 * A manifest that cannot be read is skipped rather than fatal — it costs
 * candidates for its games and the walk says how many were not counted, which
 * is visible. Failing the whole build because one document is unreachable
 * would be worse.
 */
async function learnFromManifests({ cands, xtrata, tourney, dir }) {
  const learned = cands.nothingLearned();
  const named = String(arg('manifests', '') || '')
    .split(/[\s,]+/)
    .map((x) => Number(x))
    .filter((x) => Number.isSafeInteger(x) && x > 0);

  const paced = {
    request: async (path, init) => {
      await new Promise((done) => setTimeout(done, 400));
      return (await chainEndpoint()).request(path, init);
    }
  };
  const reader = new xtrata.XtrataReader({ endpoint: paced });

  // THE DIRECTORY THE BOARD READS, through the board's own class. Listing a
  // wallet's manifests is a holdings call and a parse per candidate, and doing
  // it by hand here would be a second implementation of the thing that decides
  // which tournaments exist.
  let ids = named;
  if (!ids.length) {
    try {
      const index = new dir.ManifestDirectory({
        endpoint: paced,
        reader,
        address: TOURNAMENT_DIRECTORY,
        kind: 'tournament',
        parse: (text) => {
          const parsed = tourney.parseTournament(text);
          return parsed.ok ? parsed.tournament : null;
        }
      });
      ids = (await index.list()).map((found) => found.id);
    } catch {
      ids = [];
    }
  }
  ids = [...new Set([...ids, DEFAULT_TOURNAMENT])];

  let read = 0;
  for (const id of ids) {
    try {
      const text = await reader.text(id);
      const parsed = text === null ? null : tourney.parseTournament(text);
      if (parsed?.ok && parsed.tournament) {
        cands.learnFrom(parsed.tournament, learned);
        read++;
      }
    } catch {
      // Unreadable, or not a tournament. Skipped, and counted below.
    }
  }
  console.log(
    `manifests ${read} read of ${ids.length} offered — ` +
      `${learned.pairings.size} pairings, ${learned.entrants.size} entrants, ` +
      `cooldowns {${[...learned.cooldowns].join(', ')}}`
  );
  return learned;
}


async function main() {
  const [checkpoint, replayMod, eligibility, ratings, recover, rules, canonical, cands, xtrata, tourney, dir] =
    await Promise.all([
      load('packages/protocol/checkpoint.ts'),
      load('packages/replay/replay.ts'),
      load('packages/ratings/eligibility.ts'),
      load('packages/ratings/elo-v1.ts'),
      load('packages/protocol/recover.ts'),
      load('packages/protocol/rules.ts'),
      load('packages/protocol/canonical.ts'),
      load('packages/protocol/candidates.ts'),
      load('packages/chain/xtrata.ts'),
      load('packages/protocol/tournament.ts'),
      load('packages/chain/directory.ts')
    ]);

  // THE SAME GUESSES THE BOARD OFFERS, from the same code.
  //
  // This used to pass `candidates: []`, and `recoverRules` searches only the
  // opener and whoever has submitted — so a game whose absent side never
  // appeared on chain could not be confirmed, and an unconfirmed game is not
  // eligible and is not counted. It counted 33 of 128 ranked games where the
  // board counts 114, and a checkpoint written from that tells a board to skip
  // games it could have counted, permanently, in a document nobody replays.
  const learned = await learnFromManifests({ cands, xtrata, tourney, dir });

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
      senders: entries.map((x) => x.sender), viewer: null,
      // No `extra`: that slot is the board's own remembered answer out of local
      // storage, and this has none to remember anything in.
      candidates: cands.candidatesFor({ id, rulesHash }, learned, null)
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
    // THE INDICES CONSUMED, which is every ranked game walked — including the
    // ones no rating could count. This used to be inferred from `games.length`
    // and so renumbered itself down to the countable ones, telling a reader to
    // resume in the middle of the walk it had just done.
    rankedIndex: rankedCount,
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
