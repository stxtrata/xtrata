#!/usr/bin/env node
/**
 * make-wizards.mjs — generate the three disposable wizard wallets.
 *
 *   node harness/wizards/make-wizards.mjs            print, and forget
 *   node harness/wizards/make-wizards.mjs --write    print, and write .env.wizards
 *
 * Prints four private keys and their mainnet addresses to stdout, ONCE. Without
 * `--write` it forgets them and the file is yours to create by hand.
 *
 * `--write` puts them in `harness/wizards/.env.wizards` at mode 600, having
 * first checked that file is gitignored — and REFUSES to overwrite one that
 * already exists, because that file may belong to a funded fleet whose keys are
 * the only thing that can move its money.
 *
 * Neither form touches the network or derives anything from a wallet you own.
 *
 * THE SECURITY MODEL, in one paragraph. These wallets hold a few STX and
 * nothing else. If a key leaks you lose the float and some throwaway games on a
 * canary contract, and you run this again. That is the whole of it, and it only
 * holds while the wallets stay disposable — so never reuse a personal seed,
 * never fund one heavily, and never paste a key into a chat, an issue, a log or
 * a screenshot.
 *
 * NOT IMPORTABLE INTO A CONSUMER WALLET, deliberately. These are raw keys with
 * no seed phrase, because generating a phrase would need two more dependencies
 * in a project that keeps them countable. To get funds back out, use
 * `node harness/wizards/play.mjs sweep --to SP...`, which is the same key
 * signing a transfer.
 */

import { chmodSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { privateKeyToAddress, randomPrivateKey } from '@stacks/transactions';

import { DIRECTOR, PERSONAS, addressEnvName, keyEnvName } from './wizards-core.mjs';

/** The Director first: it is the one you fund, so it is the one you read first. */
const ALL = [DIRECTOR, ...PERSONAS];

const HERE = dirname(fileURLToPath(import.meta.url));
const EXAMPLE = join(HERE, '.env.wizards.example');
const ENV_FILE = join(HERE, '.env.wizards');
const WRITE = process.argv.includes('--write');

/** One wallet. The key exists in memory for as long as it takes to print it. */
export function makeWizard(persona, generate = randomPrivateKey, toAddress = privateKeyToAddress) {
  const key = generate();
  return { ...persona, key, address: toAddress(key, 'mainnet') };
}

/** The example file: placeholders, and a test asserts it holds nothing real. */
export function exampleFile(personas = ALL) {
  return [
    '# harness/wizards/.env.wizards.example',
    '#',
    '# PLACEHOLDERS ONLY. This file is committed; .env.wizards is not.',
    '# Generate real values with: node harness/wizards/make-wizards.mjs',
    '#',
    '# A test in tests/wizards asserts this file contains nothing key-shaped and',
    '# no mainnet address, so a real key pasted here fails the build rather than',
    '# reaching a commit.',
    '',
    ...personas.flatMap((persona) => [
      `# ${persona.name} — ${persona.concern}`,
      `${keyEnvName(persona.id)}=REPLACE_WITH_A_GENERATED_KEY`,
      `${addressEnvName(persona.id)}=REPLACE_WITH_ITS_ADDRESS`,
      ''
    ])
  ].join('\n');
}

/**
 * Write the real env file, when explicitly asked to.
 *
 * The default is to print and forget, because a script that puts keys on disk
 * without being told to is a script that eventually does it somewhere you did
 * not expect. `--write` is that instruction, given once, out loud.
 *
 * TWO GUARDS, and the first is the one that matters.
 *
 * It REFUSES TO OVERWRITE. A .env.wizards that already exists belongs to a fleet
 * that may be funded, and replacing it would strand that money with no way back:
 * the keys are the only thing that can move it and nothing else has a copy. So
 * an existing file stops the write and the new keys are still on screen, which
 * is recoverable in the direction that matters.
 *
 * And it checks the file is actually ignored before writing, rather than
 * trusting that it is. Being wrong about that publishes the keys.
 */
function writeEnvFile(made) {
  if (existsSync(ENV_FILE)) {
    console.log(`\nREFUSING to overwrite ${ENV_FILE}.`);
    console.log('That file may belong to a funded fleet, and its keys are the only thing that');
    console.log('can move that money. Sweep it first (npm run wizards:sweep -- --live), or');
    console.log('move the file aside, then run this again. The new keys are above.\n');
    process.exitCode = 1;
    return;
  }

  const ignore = join(HERE, '..', '..', '.gitignore');
  const ignored = existsSync(ignore) && readFileSync(ignore, 'utf8').includes('harness/wizards/.env.wizards');
  if (!ignored) {
    console.log(`\nREFUSING to write: harness/wizards/.env.wizards is not in .gitignore.`);
    console.log('Add it before generating anything real, or the next commit publishes the keys.\n');
    process.exitCode = 1;
    return;
  }

  writeFileSync(
    ENV_FILE,
    [
      '# Real wizard keys. NEVER COMMIT THIS FILE.',
      '# Generated by harness/wizards/make-wizards.mjs --write',
      '#',
      '# Disposable mainnet wallets. Fund the Director only:',
      `#   ${made[0].address}`,
      '',
      ...made.flatMap((wizard) => [
        `# ${wizard.name} — ${wizard.concern}`,
        `${keyEnvName(wizard.id)}=${wizard.key}`,
        `${addressEnvName(wizard.id)}=${wizard.address}`,
        ''
      ])
    ].join('\n'),
    { mode: 0o600 }
  );
  chmodSync(ENV_FILE, 0o600);
  console.log(`Wrote ${ENV_FILE} — real keys, gitignored, readable only by you.`);
}

function main() {
  const made = ALL.map((persona) => makeWizard(persona));

  console.log('\nFour disposable mainnet wallets. Printed once, stored nowhere.\n');
  for (const wizard of made) {
    console.log(`${wizard.name}  (${wizard.id})`);
    console.log(`  ${wizard.concern}`);
    console.log(`  address  ${wizard.address}`);
    console.log(`  key      ${wizard.key}`);
    console.log('');
  }

  console.log('Paste into harness/wizards/.env.wizards (gitignored):\n');
  for (const wizard of made) {
    console.log(`${keyEnvName(wizard.id)}=${wizard.key}`);
    console.log(`${addressEnvName(wizard.id)}=${wizard.address}`);
  }

  writeFileSync(EXAMPLE, exampleFile());
  console.log(`\nWrote ${EXAMPLE} — placeholders only.`);

  if (WRITE) writeEnvFile(made);
  console.log('\nFUND THE DIRECTOR ONLY — one address, one transfer. Say 8 STX.');
  console.log('Then: node harness/wizards/play.mjs fund --live   (it tops the players up)');
  console.log('Then: node harness/wizards/play.mjs');
  console.log('Nothing broadcasts without --live.\n');
}

if (Boolean(process.argv[1]) && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main();
}
