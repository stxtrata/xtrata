#!/usr/bin/env node
/**
 * make-wizards.mjs — generate the three disposable wizard wallets.
 *
 *   node harness/wizards/make-wizards.mjs
 *
 * Prints three private keys and their mainnet addresses to stdout, ONCE, and
 * forgets them. Nothing here writes a key to disk, touches the network, or
 * derives anything from a wallet you already own.
 *
 * What to do with the output: paste it into `harness/wizards/.env.wizards`,
 * which is gitignored. That file is yours to create; no script in this
 * directory will ever write it.
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

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { privateKeyToAddress, randomPrivateKey } from '@stacks/transactions';

import { DIRECTOR, PERSONAS, addressEnvName, keyEnvName } from './wizards-core.mjs';

/** The Director first: it is the one you fund, so it is the one you read first. */
const ALL = [DIRECTOR, ...PERSONAS];

const HERE = dirname(fileURLToPath(import.meta.url));
const EXAMPLE = join(HERE, '.env.wizards.example');

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
  console.log('\nFUND THE DIRECTOR ONLY — one address, one transfer. Say 8 STX.');
  console.log('Then: node harness/wizards/play.mjs fund --live   (it tops the players up)');
  console.log('Then: node harness/wizards/play.mjs');
  console.log('Nothing broadcasts without --live.\n');
}

if (Boolean(process.argv[1]) && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main();
}
