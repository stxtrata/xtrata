#!/usr/bin/env node
/**
 * The Music Hero awards signer key (docs/music/AWARDS-SERVER.md). Run on your own machine.
 *
 *   node scripts/awards-signer-key.mjs            make the key (once) and print its HASH
 *   node scripts/awards-signer-key.mjs --hash     print the hash of the key already made
 *
 * The key is written to ~/.xtrata-awards-signer-key (readable by you only) and is NEVER printed. What is printed
 * is its hash: 20 bytes, public, the value the award contract stores with `set-signer-hash`. The key signs award
 * notes and nothing else; its address holds no money and needs none.
 *
 * Then give the key to Cloudflare without it touching the screen or the shell history:
 *   npx wrangler pages secret put RADIO_AWARDS_SIGNER_KEY --project-name xtrata < ~/.xtrata-awards-signer-key
 */
import { chmodSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import { createStacksPrivateKey, getPublicKey, publicKeyToString } from '@stacks/transactions';

const FILE = join(homedir(), '.xtrata-awards-signer-key');
const SECP256K1_N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
const onlyHash = process.argv.includes('--hash');

if (!existsSync(FILE)) {
  if (onlyHash) { console.error(`No key at ${FILE}. Run without --hash to make one.`); process.exit(1); }
  let hex;
  do { hex = randomBytes(32).toString('hex'); } while (BigInt('0x' + hex) === 0n || BigInt('0x' + hex) >= SECP256K1_N);
  writeFileSync(FILE, hex + '01', { mode: 0o600, flag: 'wx' }); // wx: never overwrite a key that exists
  chmodSync(FILE, 0o600);
  console.log(`Made a new signer key: ${FILE} (not shown).`);
} else if (!onlyHash) {
  console.log(`A signer key already exists at ${FILE}: using it (not shown). Delete that file yourself only if you mean to replace it.`);
}

const key = readFileSync(FILE, 'utf8').trim().toLowerCase();
if (!/^[0-9a-f]{64}(01)?$/.test(key)) { console.error(`${FILE} does not hold a key in the expected form.`); process.exit(1); }
// The contract recovers a COMPRESSED public key from a note's signature and compares hash160 of it with this value.
const publicKey = publicKeyToString(getPublicKey(createStacksPrivateKey(key.slice(0, 64) + '01')));
const sha = createHash('sha256').update(Buffer.from(publicKey, 'hex')).digest();
const hash = createHash('ripemd160').update(sha).digest('hex');
console.log(`\nSigner hash (public): 0x${hash}`);
console.log('Use it as the argument of set-signer-hash on the award contract.');
