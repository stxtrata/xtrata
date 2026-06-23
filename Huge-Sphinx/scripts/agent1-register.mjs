/**
 * Register Xtrata Agent 1 on the AIBTC network, vouched by Huge Sphinx.
 *
 * Signs "Bitcoin will be the currency of AIs" with Agent 1's BTC key (BIP-322)
 * and Stacks key (RSV), then POSTs to /api/register?ref={REF}.
 *
 * The private key never leaves this machine — only signatures + public
 * addresses are sent to aibtc.com.
 *
 * Usage (preview, no network write):
 *   DRY_RUN=1 WALLET_MNEMONIC="<agent 1 24 words>" REF=ABC123 \
 *     node scripts/agent1-register.mjs
 *
 * Usage (live register):
 *   WALLET_MNEMONIC="<agent 1 24 words>" REF=ABC123 \
 *     node scripts/agent1-register.mjs
 *
 * REF is optional but recommended (Huge Sphinx's referral code → vouch + reward).
 */
import { deriveKeys, signBip322, signStacks, postJson } from './aibtc-lib.mjs';

const MNEMONIC = process.env.WALLET_MNEMONIC;
if (!MNEMONIC) { console.error('Set WALLET_MNEMONIC (Agent 1 24 words).'); process.exit(1); }

// Safety anchor: Agent 1's known Stacks signer. If derivation doesn't match,
// it's the wrong seed/path — abort before touching the network.
const EXPECTED_STX = 'SP2B4V8FTKNR1PY325CN3GZ1187H6GN8SG2FS2P4B';
const MESSAGE = 'Bitcoin will be the currency of AIs';
const REF = process.env.REF || '';
const DESCRIPTION = process.env.DESCRIPTION
  || 'Xtrata Agent 1 — first autonomous agent native to Xtrata, the contract-native inscription protocol on Stacks.';

const k = deriveKeys(MNEMONIC);
console.log('Derived addresses:');
console.log('  BTC (SegWit):', k.btcAddress);
console.log('  STX         :', k.stxAddress);

if (k.stxAddress !== EXPECTED_STX) {
  console.error(`\n✗ Derived STX != Agent 1 (${EXPECTED_STX}).`);
  console.error('  Wrong mnemonic or derivation path. Aborting — nothing sent.');
  process.exit(1);
}
console.log('✓ Matches Agent 1 signer.');

const bitcoinSignature = signBip322(MESSAGE, k.btcPrivKey, k.btcScript);
const stacksSignature = signStacks(MESSAGE, k.stxPrivBytes);

const body = {
  bitcoinSignature,
  stacksSignature,
  btcAddress: k.btcAddress,
  stxAddress: k.stxAddress,
  description: DESCRIPTION,
};

const url = 'https://aibtc.com/api/register' + (REF ? `?ref=${encodeURIComponent(REF)}` : '');
console.log('\nTarget:', url);
console.log('Body (signatures truncated):', JSON.stringify({
  ...body,
  bitcoinSignature: bitcoinSignature.slice(0, 24) + '…',
  stacksSignature: stacksSignature.slice(0, 24) + '…',
}, null, 2));

if (process.env.DRY_RUN === '1') {
  console.log('\nDRY_RUN=1 — not sending. Remove DRY_RUN to register.');
  process.exit(0);
}

const { status, data } = await postJson(url, body);
console.log('\nHTTP', status);
console.log(JSON.stringify(data, null, 2));

if (status === 409) {
  console.log('\n409 = already registered. Check: GET /api/verify/' + k.btcAddress);
} else if (data && data.claimCode) {
  console.log('\n=========================================');
  console.log('  REGISTERED. SAVE THESE:');
  console.log('  displayName:', data.displayName);
  console.log('  claimCode  :', data.claimCode, '  (needed for the X / Genesis claim)');
  console.log('=========================================');
}
