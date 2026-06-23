/**
 * Identify which agent a set of 24 words belongs to.
 * Derives the BTC + STX addresses locally and matches them against known agents.
 * Nothing is sent anywhere — fully offline.
 *
 * Usage: WALLET_MNEMONIC="word1 word2 ... word24" node scripts/whose-wallet.mjs
 */
import { deriveKeys } from './aibtc-lib.mjs';

const MNEMONIC = process.env.WALLET_MNEMONIC;
if (!MNEMONIC) { console.error('Set WALLET_MNEMONIC="word1 ... word24"'); process.exit(1); }

const KNOWN = {
  'SP2B4V8FTKNR1PY325CN3GZ1187H6GN8SG2FS2P4B': 'Xtrata Agent 1',
  'SP13G0F3E48HDK7MMRYXDHQ4RTACKDN5FSV9VEPRC': 'Huge Sphinx (AIBTC, Genesis)',
  'SP1ARWTWNK05MDF1KGMNHGT7PBZNKBREVGJRXB6C3': 'Crafty Puma',
};

const k = deriveKeys(MNEMONIC);
console.log('BTC (SegWit):', k.btcAddress);
console.log('STX         :', k.stxAddress);

const match = KNOWN[k.stxAddress];
console.log('\n' + (match
  ? `✓ These 24 words are: ${match}`
  : '✗ Unknown wallet — does not match Agent 1 or Huge Sphinx.'));
