#!/usr/bin/env node
// Generate a FRESH hot wallet for the sponsor relayer.
//
// This is deliberately not derived from any existing mnemonic — the relayer
// key lives on the server as an env var and only ever holds a small STX
// float, so it must never be your personal seed. Run locally, keep the
// output out of git, top the address up like a prepaid card.
//
// Usage: node scripts/make-sponsor-wallet.mjs

import { randomBytes } from 'node:crypto';
import { getAddressFromPrivateKey, TransactionVersion } from '@stacks/transactions';

const priv = randomBytes(32).toString('hex') + '01'; // compressed key
const mainnet = getAddressFromPrivateKey(priv, TransactionVersion.Mainnet);

console.log('Sponsor relayer hot wallet (SAVE THE KEY SOMEWHERE SAFE, NOT IN GIT):\n');
console.log('  SPONSOR_KEY =', priv);
console.log('  address     =', mainnet);
console.log('\nNext steps:');
console.log('  1. Send ~20 STX to the address above (from any wallet or exchange).');
console.log('  2. set-sponsor on both sponsored markets with this address');
console.log('     (deploy console post-deploy step, signed by the admin wallet).');
console.log('  3. Start the relayer:');
console.log('     SPONSOR_KEY=<key above> \\');
console.log('     SPONSOR_MARKETS=SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-sponsored-sbtc-v1-0,SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-sponsored-usdcx-v1-0 \\');
console.log('     node server/server.mjs   (from xtrata-agent-one/)');
