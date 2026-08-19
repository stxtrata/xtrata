#!/usr/bin/env node
// Build the manifest a tournament is played from.
//
//   node harness/wizards/build-manifest.mjs --name "Exhibition Two" --format round-robin
//   node harness/wizards/build-manifest.mjs --name "…" --out /tmp/two.json
//
// THE ORDER MATTERS AND IS FORCED BY THE FORMAT. A manifest names its games by
// id, and ids do not exist until games are opened. So a committed tournament
// goes: open the games, build this, inscribe it, then play. Opening settles no
// result, and `provenance` compares the manifest against the first MOVE, which
// is why that sequence reads as committed rather than compiled.
//
// IT REFUSES TO WRITE A MANIFEST THE BOARD WOULD REJECT. Every pairing is
// checked against the rules hash its game actually committed to, using the same
// `checkGames` the Tournaments tab uses — not a second implementation of the
// same idea. A manifest that would show as `unverified` on the board is a
// manifest nobody should inscribe, and finding that out costs 0.3 STX if this
// script does not find it first.
//
// Games are located BY RULES HASH rather than by id order. Three games open
// concurrently and whichever transaction lands first takes the lower id, so
// position in a list says nothing about who is playing.

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Cl } from '@stacks/transactions';

import { ALLOWED_CONTRACT, WizardSafetyError, addressEnvName, keyEnvName } from './wizards-core.mjs';
import { PERSONALITIES } from './personalities.mjs';
import { ENTRY_INSCRIPTION } from '../skill/build-skill.mjs';
import { doubleRoundRobin, findByRulesHash, roundRobin } from './tournament.mjs';
import { readOnly, wizardRules } from './play.mjs';
import { readFileSync } from 'node:fs';

const HERE = dirname(fileURLToPath(import.meta.url));
const [CONTRACT_ADDRESS, CONTRACT_NAME] = ALLOWED_CONTRACT.split('.');

const arg = (name, fallback = null) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > -1 && process.argv[at + 1] ? process.argv[at + 1] : fallback;
};

/**
 * The cooldown these games committed to, which the manifest must then declare.
 *
 * If this is wrong the manifest is wrong about its own games: every hash it
 * computes to match a pairing misses, and the tournament reads as having no
 * games at all. Passed explicitly rather than guessed, because guessing zero
 * is exactly the failure.
 */
const COOLDOWN = Number(arg('cooldown', '0'));

/**
 * How much deeper than the house engine each seat searches.
 *
 * LADDERED AGAINST THE FIRST EXHIBITION'S FINISH, not with it. Plumb won that
 * tournament and stays level; Wager and Oblique took two points each and get
 * the deepest search. If depth decides chess the table should invert, and if
 * character decides it Plumb wins again from the bottom of the ladder. Handing
 * the deepest search to the players who were already strongest would have
 * measured nothing.
 *
 * Absent means level. Nothing here may exceed MAX_DEPTH_OFFSET, and
 * parseTournament refuses the manifest if it does.
 */
const DEPTHS = Object.freeze({
  Fathom: 2, Oblique: 2, Wager: 2,
  Cadence: 1, Canon: 1, Mason: 1, Gambit: 1
});

/** The inscribed engine every player is handed. See TOURNAMENT.md. */
const ENGINE = Number(arg('engine', '2991'));

/**
 * Stop after this many rounds.
 *
 * A format says how many rounds a tournament WOULD have; a tournament may be
 * shorter on purpose, and Exhibition One is — twenty-one games of a
 * thirty-game double round robin, stopped at round seven. Without this the
 * builder can only describe a format run to completion.
 */
const MAX_ROUNDS = arg('rounds') ? Number(arg('rounds')) : null;

/**
 * The first round of the format to include, counting from one.
 *
 * A tournament need not start where its FORMAT starts. Exhibition One took
 * rounds one to seven of a double round robin, which left rounds eight to ten
 * as the only pairings this field has never played - a second event made
 * entirely of games the first one did not reach.
 *
 * Without this, `--rounds` could only ever slice from the beginning, so the
 * only expressible tournaments were prefixes. That made the second exhibition
 * impossible to describe: naming rounds eight to ten meant also naming rounds
 * one to seven, whose games belong to Exhibition One and are already played.
 *
 * A pairing's identity is its RULES HASH, which is why this matters at all. The
 * same two characters in the same colours is not a similar game, it is the same
 * game, so a format cannot simply be re-run to make a new event.
 */
const FROM_ROUND = arg('from') ? Number(arg('from')) : 1;

function env() {
  const found = {};
  try {
    for (const line of readFileSync(join(HERE, '.env.wizards'), 'utf8').split('\n')) {
      const at = line.indexOf('=');
      if (at > 0 && !line.trim().startsWith('#')) {
        found[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    // No file. A dry build still shows the shape.
  }
  return found;
}

/** The protocol's own parser and checker, bundled rather than reimplemented. */
async function loadProtocolTypes() {
  const { build } = await import('esbuild');
  const out = await build({
    entryPoints: [join(HERE, '..', '..', 'packages', 'protocol', 'tournament.ts')],
    bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'error'
  });
  return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);
}

/** Every game on the contract, with the hash that says who is playing. */
async function readGames() {
  const count = Number((await readOnly('get-game-count')).value);
  const games = [];
  for (let id = 1; id <= count; id++) {
    try {
      const row = (await readOnly('get-game', [Cl.serialize(Cl.uint(id))])).value.value;
      games.push({ id, rulesHash: row['rules-hash']?.value?.value ?? null });
    } catch {
      // A row that will not read is one we cannot claim, which is the safe way
      // round: worst case a pairing is reported missing rather than mismatched.
    }
    await new Promise((done) => setTimeout(done, 250));
  }
  return games;
}

async function main() {
  const name = arg('name');
  if (!name) throw new WizardSafetyError('--name is required: a tournament has to be called something');
  const format = arg('format', 'round-robin');
  const vars = env();

  // EVERY SEAT CARRIES ITS SHEET AND ITS HANDICAP.
  //
  // `entry` has been in the format since it was written — "inscription id of
  // the entry that defines the character" — and neither existing manifest
  // carries it, because both were inscribed after their games had started and
  // were final on arrival. This one is inscribed first, so it can.
  //
  // `kind` says these are programs. Absent means unknown rather than human, so
  // exhibitions one and two are correctly not labelled as games between people.
  //
  // `depth` is the only claim here nobody can check. It is declared because a
  // handicap nobody can see is worse than one that is merely unproven, and the
  // board marks it declared rather than verified.
  const entrants = PERSONALITIES.map((character) => ({
    name: character.name,
    address: vars[addressEnvName(character.id)] ?? null,
    kind: 'ai',
    ...(ENTRY_INSCRIPTION.sheets[character.name]
      ? { entry: ENTRY_INSCRIPTION.sheets[character.name] }
      : {}),
    ...(DEPTHS[character.name] ? { depth: DEPTHS[character.name] } : {})
  }));
  const missing = entrants.filter((e) => !e.address);
  if (missing.length) {
    throw new WizardSafetyError(
      `no address for ${missing.map((e) => e.name).join(', ')}. A manifest names wallets, ` +
        'so every entrant needs one before it can be written.'
    );
  }

  const byName = new Map(entrants.map((e) => [e.name, e.address]));
  const ids = PERSONALITIES.map((c) => c.id);
  const all = format === 'double-round-robin' ? doubleRoundRobin(ids) : roundRobin(ids);
  if (!Number.isInteger(FROM_ROUND) || FROM_ROUND < 1 || FROM_ROUND > all.length) {
    throw new WizardSafetyError(
      `--from ${arg('from')} is not a round of a ${format}, which has ${all.length}.`
    );
  }
  const rounds = all.slice(FROM_ROUND - 1, MAX_ROUNDS ? FROM_ROUND - 1 + MAX_ROUNDS : undefined);
  if (!rounds.length) {
    throw new WizardSafetyError('that leaves no rounds at all, so there is no tournament to describe.');
  }
  const nameOf = Object.fromEntries(PERSONALITIES.map((c) => [c.id, c.name]));

  console.log(`\nbuilding "${name}" — ${format}, ${entrants.length} entrants`);
  console.log('reading every game on the contract to match pairings by rules hash…\n');
  const onChain = await readGames();

  const games = [];
  const unopened = [];
  for (const round of rounds) {
    for (const pairing of round.pairings) {
      const white = nameOf[pairing.white];
      const black = nameOf[pairing.black];
      const { hash } = await wizardRules(byName.get(white), byName.get(black), { cooldown: COOLDOWN });
      const found = findByRulesHash(hash, onChain);
      if (!found) {
        unopened.push(`round ${round.number}: ${white} v ${black}`);
        continue;
      }
      games.push({ id: found.id, white, black, round: round.number });
    }
  }

  if (unopened.length) {
    // NOT A WARNING. A manifest naming a game that does not exist is refused by
    // the runner and shows as `missing` on the board, so writing one would be
    // producing a document whose only purpose is to be rejected.
    throw new WizardSafetyError(
      `${unopened.length} pairing(s) have no game on chain yet:\n  ${unopened.join('\n  ')}\n` +
        'Open the games first — a manifest names them by id, and ids do not exist until then.'
    );
  }

  const manifest = {
    name,
    format,
    contract: ALLOWED_CONTRACT,
    engine: ENGINE,
    // DECLARED, or the manifest is wrong about its own games. It is used above
    // to FIND each game by hash, and a reader needs it to rebuild the same hash
    // and verify. Emitting it only in the first half is how a manifest ends up
    // naming ninety games it then reports as none of its own.
    ...(COOLDOWN > 0 ? { cooldown: COOLDOWN } : {}),
    entrants,
    games: games.sort((a, b) => a.round - b.round || a.id - b.id)
  };
  const text = `X-CHESS-TOURNAMENT/1\n${JSON.stringify(manifest, null, 2)}\n`;

  // VERIFIED BEFORE IT IS WRITTEN, with the board's own code. A manifest that
  // would read as unverified is one nobody should pay to inscribe.
  const { parseTournament, checkGames } = await loadProtocolTypes();
  const parsed = parseTournament(text);
  if (!parsed.ok) {
    throw new WizardSafetyError(
      `this builder produced something the parser refuses: ${parsed.problems
        .map((p) => `${p.where} ${p.says}`)
        .join('; ')}`
    );
  }

  const facts = new Map(
    onChain.filter((g) => games.some((x) => x.id === g.id)).map((g) => [g.id, { rulesHash: g.rulesHash, result: null }])
  );
  const checked = checkGames(parsed.tournament, facts);
  const bad = checked.filter((g) => g.verdict !== 'verified');
  if (bad.length) {
    throw new WizardSafetyError(
      `${bad.length} pairing(s) do not match the chain:\n  ` +
        bad.map((g) => `game ${g.id} ${g.white} v ${g.black}: ${g.says}`).join('\n  ')
    );
  }

  const out = arg('out', join(HERE, `manifest-${format}.json`));
  writeFileSync(out, text);
  console.log(
    `${games.length} games across rounds ${rounds[0].number}-${rounds[rounds.length - 1].number}, ` +
      `all ${checked.length} verified against chain`
  );
  console.log(`${Buffer.byteLength(text, 'utf8')} bytes, ${Math.ceil(Buffer.byteLength(text, 'utf8') / 16384)} chunk`);
  console.log(`written to ${out}`);
  console.log('\nInscribe it, then play with:');
  console.log('  node harness/wizards/run-tournament.mjs --manifest <inscription id> --live');
}

main().catch((error) => {
  console.error(`\n${error.message}\n`);
  process.exit(1);
});
