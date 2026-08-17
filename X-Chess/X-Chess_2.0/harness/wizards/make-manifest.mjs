#!/usr/bin/env node
// Build the tournament manifest from the chain.
//
//   node harness/wizards/make-manifest.mjs            print it
//   node harness/wizards/make-manifest.mjs --write    save it ready to inscribe
//
// FROM THE RULES HASH, NEVER FROM THE SCHEDULE. Every game commits a hash of
// its rules, and the rules name both players — so the pairing is recoverable
// from the chain, exactly, without trusting anything this machine believes.
//
// That distinction is not academic. Reading the standings by hand earlier used
// the schedule order and got games 13 and 15 the wrong way round: they are
// Mason v Wager and Gambit v Oblique, not the reverse. Three games open at once
// and whichever transaction lands first takes the lower id, so schedule order
// and id order are simply different things. Both games then replayed as zero
// plies — every submission rejected as not-a-player — and two real results went
// missing from a table that looked complete.
//
// So this hashes all thirty possible pairings once and looks each game up. A
// game that matches none of them is not in this tournament and is left alone.

import { build } from 'esbuild';
import { Cl } from '@stacks/transactions';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ALLOWED_CONTRACT, addressEnvName } from './wizards-core.mjs';
import { PERSONALITIES } from './personalities.mjs';
import { TOURNAMENT_HEADER } from './manifest-header.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const OUT = join(HERE, 'tournament.json');

/** The engine every player in this tournament was handed. */
const ENGINE_INSCRIPTION = 2991;

const NAME = 'X Chess Exhibition One';
const FORMAT = 'double-round-robin';

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

async function loadBundled(...parts) {
  const out = await build({
    entryPoints: [join(ROOT, ...parts)],
    bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent'
  });
  return import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);
}

/** A contract read, paced and retried — this makes one call per game. */
async function readOnly(fn, args = [], tries = 5) {
  const [address, name] = ALLOWED_CONTRACT.split('.');
  for (let attempt = 1; attempt <= tries; attempt++) {
    const response = await fetch(
      `https://api.hiro.so/v2/contracts/call-read/${address}/${name}/${fn}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: address, arguments: args })
      }
    );
    if (response.ok) return response.json();
    if (response.status !== 429) throw new Error(`${fn}: HTTP ${response.status}`);
    await sleep(4000 * attempt);
  }
  throw new Error(`${fn}: rate limited`);
}

function env() {
  const found = {};
  for (const line of readFileSync(join(HERE, '.env.wizards'), 'utf8').split('\n')) {
    const at = line.indexOf('=');
    if (at > 0) found[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return found;
}

export async function buildManifest() {
  const vars = env();
  const { DEFAULT_RULES, normaliseRules } = await loadBundled('packages', 'protocol', 'rules.ts');
  const { rulesHash } = await loadBundled('packages', 'protocol', 'canonical.ts');

  const entrants = PERSONALITIES.map((character) => ({
    name: character.name,
    address: vars[addressEnvName(character.id)] ?? null
  }));
  const missing = entrants.filter((e) => !e.address);
  if (missing.length) {
    throw new Error(`no address for ${missing.map((e) => e.name).join(', ')}`);
  }

  // Every ordered pairing, hashed the way a game commits it.
  const byHash = new Map();
  for (const white of entrants) {
    for (const black of entrants) {
      if (white.name === black.name) continue;
      const rules = normaliseRules({
        ...DEFAULT_RULES, white: white.address, black: black.address, ranked: true
      });
      byHash.set(rulesHash(rules), { white: white.name, black: black.name });
    }
  }

  const count = Number(Cl.deserialize((await readOnly('get-game-count')).result).value);
  const games = [];
  for (let id = 1; id <= count; id++) {
    try {
      const row = Cl.deserialize((await readOnly('get-game', [Cl.serialize(Cl.uint(id))])).result).value.value;
      const hash = row['rules-hash']?.value?.value ?? null;
      const pairing = hash ? byHash.get(hash) : null;
      if (pairing) games.push({ id, ...pairing });
    } catch {
      // A row that will not read is not one we can claim. Leaving it out is the
      // safe direction: a manifest that omits a game is incomplete, one that
      // invents a game is wrong.
    }
    await sleep(700);
  }

  // Rounds, assigned from the order games were opened rather than from a
  // schedule. Three games to a round is the nonce rule, not a preference: six
  // characters, three games, nobody signing twice at once.
  games.sort((a, b) => a.id - b.id);
  for (const [at, game] of games.entries()) game.round = Math.floor(at / 3) + 1;

  return {
    name: NAME,
    format: FORMAT,
    contract: ALLOWED_CONTRACT,
    engine: ENGINE_INSCRIPTION,
    entrants,
    games
  };
}

export const asManifest = (tournament) =>
  `${TOURNAMENT_HEADER}\n${JSON.stringify(tournament, null, 2)}\n`;

async function main() {
  const tournament = await buildManifest();
  const text = asManifest(tournament);

  console.log(`\n${tournament.name} — ${tournament.games.length} games, ${tournament.entrants.length} entrants`);
  console.log(`${Buffer.byteLength(text)} bytes, one Xtrata chunk is 16,384\n`);
  for (const round of [...new Set(tournament.games.map((g) => g.round))]) {
    const inRound = tournament.games.filter((g) => g.round === round);
    console.log(`  round ${String(round).padStart(2)}  ${inRound.map((g) => `${g.id}:${g.white}v${g.black}`).join('  ')}`);
  }

  if (process.argv.includes('--write')) {
    writeFileSync(OUT, text);
    console.log(`\nwrote ${OUT}`);
    console.log('Commit it, then inscribe it — the inscription id becomes the tournament id.');
  } else {
    console.log('\nAdd --write to save it.');
  }
}

if (process.argv[1] && process.argv[1].endsWith('make-manifest.mjs')) {
  main().catch((error) => {
    console.error(`\n${error.message}\n`);
    process.exit(1);
  });
}
