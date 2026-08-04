#!/usr/bin/env node
/**
 * make-wizards.mjs — generate the three throwaway wizard wallets.
 *
 * Same posture as scripts/make-sponsor-wallet.mjs: fresh random keys, never
 * derived from anything you already own, never written to disk by this script.
 * These wallets hold a few STX each and nothing else of value. If one leaks,
 * you lose the float and the throwaway inscriptions it minted, and you generate
 * three more.
 *
 * Usage:
 *   node scripts/wizard/make-wizards.mjs
 *
 * What it does:
 *   - prints three private keys and their mainnet addresses to stdout, once
 *   - prints a paste-ready .env.wizards block, also to stdout only
 *   - writes scripts/wizard/.env.wizards.example, which contains placeholders
 *     and no real key material
 *
 * What it never does:
 *   - write a real key anywhere on disk
 *   - touch .env.wizards (that file is yours to create, and it is gitignored)
 *   - contact the network
 */

import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { HDKey } from '@scure/bip32';
import { generateMnemonic, mnemonicToSeedSync } from '@scure/bip39';
// The explicit .js matters: @scure/bip39@1.1.0 ships no "exports" map, so plain
// node cannot resolve the extensionless subpath and this whole script throws
// ERR_MODULE_NOT_FOUND before printing a thing. Vite's resolver papered over it,
// which is why the tests passed while `node scripts/wizard/make-wizards.mjs` did not.
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { getAddressFromPrivateKey, TransactionVersion } from '@stacks/transactions';

/**
 * Standard Stacks account path. Matches what the other scripts in this repo
 * derive (see scripts/find-derivation.mjs) and what Leather/Xverse produce for
 * the first account, so a wizard phrase can be imported into a normal wallet to
 * inspect or rescue funds by hand.
 */
export const WIZARD_DERIVATION_PATH = "m/44'/5757'/0'/0/0";

import { PERSONAS } from './personas.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const EXAMPLE_PATH = join(HERE, '.env.wizards.example');

/** Env var name that holds a given wizard key. */
export const keyEnvName = (wizardId) => `WIZARD_KEY_${String(wizardId).toUpperCase()}`;
/** Env var name that holds a given wizard address, for cross-checking. */
export const addressEnvName = (wizardId) => `WIZARD_ADDRESS_${String(wizardId).toUpperCase()}`;

/**
 * Derive the compressed mainnet key for a BIP39 phrase at the wizard path.
 * Stacks compressed key = 32-byte private key with an 0x01 suffix.
 */
export function keyFromMnemonic(mnemonic) {
  const node = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic)).derive(WIZARD_DERIVATION_PATH);
  if (!node.privateKey) throw new Error('failed to derive a private key for the wizard path');
  const privateKey = `${Buffer.from(node.privateKey).toString('hex')}01`;
  return { privateKey, address: getAddressFromPrivateKey(privateKey, TransactionVersion.Mainnet) };
}

/**
 * Generate one fresh wizard wallet as a 12-word BIP39 phrase plus the key it
 * derives to. Exported so tests can check the shape without the script
 * printing anything.
 *
 * A recovery phrase rather than a raw key: these wallets hold a real float and
 * accumulate inscriptions that cannot be re-minted, so a wallet that can only
 * be restored from a hex string in a shell scrollback is a wallet that will
 * eventually be lost. The phrase imports into Leather or Xverse directly.
 */
export function generateWizardKey(randomImpl = randomBytes) {
  const mnemonic = generateMnemonic(wordlist, 128, (n) => Uint8Array.from(randomImpl(n)));
  return { mnemonic, ...keyFromMnemonic(mnemonic) };
}

/** Generate the whole fleet, in rotation order. */
export function generateFleet(randomImpl = randomBytes) {
  return PERSONAS.map((persona) => {
    const { mnemonic, privateKey, address } = generateWizardKey(randomImpl);
    return {
      id: persona.id,
      wallet: persona.wallet,
      name: persona.name,
      keyEnv: keyEnvName(persona.id),
      addressEnv: addressEnvName(persona.id),
      mnemonic,
      privateKey,
      address
    };
  });
}

/**
 * The .env.wizards.example body. Deterministic and placeholder-only, so this
 * file is identical on every run and safe to commit.
 */
export function exampleEnvTemplate() {
  const lines = [
    '# scripts/wizard/.env.wizards.example',
    '#',
    '# Copy to scripts/wizard/.env.wizards and fill in the values printed by',
    '#   node scripts/wizard/make-wizards.mjs',
    '#',
    '# .env.wizards is gitignored. Never commit it. Never paste a real key into',
    '# this .example file. These are disposable mainnet wallets holding a small',
    '# STX float, but the float is real money and the transactions are real.',
    '',
    '# --- keys (hex, 33 bytes, compressed, ending 01) ---'
  ];
  for (const persona of PERSONAS) {
    lines.push(`# ${persona.name}`);
    lines.push(`${keyEnvName(persona.id)}=REPLACE_WITH_${persona.id.toUpperCase()}_PRIVATE_KEY_HEX`);
  }
  lines.push('');
  lines.push('# --- addresses (public, used to cross-check the key derives what you funded) ---');
  for (const persona of PERSONAS) {
    lines.push(`${addressEnvName(persona.id)}=REPLACE_WITH_${persona.id.toUpperCase()}_MAINNET_ADDRESS`);
  }
  lines.push('');
  lines.push('# --- safety rails (all optional, these are the defaults) ---');
  lines.push('# Hard ceiling on what one run may spend, in microSTX. Plan section 4.4.');
  lines.push('WIZARD_SPEND_CAP_USTX=500000');
  lines.push('# Refuse to start below this balance, so recovery transactions stay affordable.');
  lines.push('WIZARD_BALANCE_FLOOR_USTX=1000000');
  lines.push('# Maximum miner fee to bid on any single transaction.');
  lines.push('WIZARD_MAX_TX_FEE_USTX=30000');
  lines.push('# Set to 1 to halt the fleet. Nothing broadcasts while this is on.');
  lines.push('WIZARD_KILL_SWITCH=0');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

const isDirectRun = Boolean(process.argv[1]) && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectRun) {
  const fleet = generateFleet();

  console.log('');
  console.log('==============================================================================');
  console.log('  THREE FRESH MAINNET WIZARD WALLETS. THIS IS THE ONLY TIME THEY ARE SHOWN.');
  console.log('==============================================================================');
  console.log('');
  console.log('  These keys are NOT saved anywhere. Copy them now or run this again.');
  console.log('  They are DISPOSABLE. Fund each with a small float (~5 STX) and nothing');
  console.log('  more. Never reuse a personal seed, the deployer, or the sponsor wallet.');
  console.log('  Never commit a key. Never paste one into a chat, an issue or a log.');
  console.log('');

  for (const wizard of fleet) {
    console.log(`  ${wizard.name}`);
    console.log(`    address  : ${wizard.address}`);
    console.log(`    phrase   : ${wizard.mnemonic}`);
    console.log(`    key      : ${wizard.privateKey}`);
    console.log('');
  }
  console.log(`  Phrases derive the keys above at ${WIZARD_DERIVATION_PATH}, the first-account`);
  console.log('  path Leather and Xverse use — so a phrase can be imported into either wallet');
  console.log('  to inspect or rescue a wizard by hand. Write the phrases down. The keys can');
  console.log('  always be re-derived from them; a lost phrase cannot be recovered from a key.');
  console.log('');

  console.log('------------------------------------------------------------------------------');
  console.log('  Paste-ready block for scripts/wizard/.env.wizards (gitignored, create it');
  console.log('  yourself, this script will not write it):');
  console.log('------------------------------------------------------------------------------');
  console.log('');
  for (const wizard of fleet) {
    console.log(`${wizard.keyEnv}=${wizard.privateKey}`);
  }
  for (const wizard of fleet) {
    console.log(`${wizard.addressEnv}=${wizard.address}`);
  }
  console.log('');

  writeFileSync(EXAMPLE_PATH, exampleEnvTemplate(), 'utf8');
  console.log(`  Wrote placeholder template: ${EXAMPLE_PATH}`);
  console.log('  (placeholders only, no key material, safe to commit)');
  console.log('');
  console.log('  Next:');
  console.log('    1. Save the keys somewhere safe, or into scripts/wizard/.env.wizards.');
  console.log('    2. Send ~5 STX to each address above.');
  console.log('    3. Dry run, which needs no key and broadcasts nothing:');
  console.log('         npm run wizards:dry');
  console.log('    4. Read scripts/wizard/README.md before ever passing --broadcast.');
  console.log('');
}
