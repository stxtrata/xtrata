#!/usr/bin/env node
// Make a disposable test-network key. It is written to a file only you can read; nothing is sent anywhere.
// Never use this for mainnet, and never reuse a wallet you care about for testing.
//   node ops/keygen.mjs --out ~/xa-testnet.key        prints the testnet address to fund from the faucet
import { writeFileSync, existsSync } from 'node:fs';
import { randomPrivateKey, privateKeyToAddress } from '@stacks/transactions';
import { parseArgs, die } from './lib/cli.mjs';

const args = parseArgs(process.argv.slice(2), { out: 'value' });
if (!args.out) die('usage: node ops/keygen.mjs --out <path>');
if (existsSync(args.out)) die(`${args.out} already exists; not overwriting`);
const key = randomPrivateKey();
writeFileSync(args.out, key + '\n', { mode: 0o600 });
console.log(`key written to ${args.out} (readable only by you)`);
console.log(`testnet address: ${privateKeyToAddress(key, 'testnet')}`);
console.log('Fund that address from a testnet faucet, then use --key-file with the tools. This key is for testing only.');
