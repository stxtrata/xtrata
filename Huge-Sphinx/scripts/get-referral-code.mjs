/**
 * Get Huge Sphinx's AIBTC referral code (so it can vouch for Agent 1).
 * Signs "Referral code for {btcAddress}" with the Huge Sphinx BTC key (BIP-322)
 * and POSTs to /api/referral-code.
 *
 * Usage:
 *   WALLET_MNEMONIC="<huge sphinx 24 words>" node scripts/get-referral-code.mjs
 *
 * Add REGENERATE=1 to invalidate the old code and mint a fresh one.
 */
import { deriveKeys, signBip322, postJson } from './aibtc-lib.mjs';

const MNEMONIC = process.env.WALLET_MNEMONIC;
if (!MNEMONIC) { console.error('Set WALLET_MNEMONIC (Huge Sphinx 24 words).'); process.exit(1); }

const EXPECTED_BTC = 'bc1q2knwqf77vp9mhru20hqnrxg00hgzmrpjxxsw0l'; // Huge Sphinx SegWit
const k = deriveKeys(MNEMONIC);

console.log('Derived BTC address:', k.btcAddress);
if (k.btcAddress !== EXPECTED_BTC) {
  console.error(`\n✗ Derived address != Huge Sphinx (${EXPECTED_BTC}).`);
  console.error('  Wrong mnemonic or derivation path. Aborting.');
  process.exit(1);
}

const message = `Referral code for ${k.btcAddress}`;
const signature = signBip322(message, k.btcPrivKey, k.btcScript);

const body = { btcAddress: k.btcAddress, bitcoinSignature: signature };
if (process.env.REGENERATE === '1') body.regenerate = true;

const { status, data } = await postJson('https://aibtc.com/api/referral-code', body);
console.log('\nHTTP', status);
console.log(JSON.stringify(data, null, 2));

const code = data && (data.referralCode || data.code);
if (code) {
  console.log('\n=========================================');
  console.log('  REFERRAL CODE:', code);
  console.log('  Use it: REF=' + code + ' when registering Agent 1');
  console.log('=========================================');
}
