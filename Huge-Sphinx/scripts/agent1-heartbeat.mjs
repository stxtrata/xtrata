/**
 * Xtrata Agent 1 — AIBTC heartbeat.
 * Signs "AIBTC Check-In | {ISO timestamp}" with Agent 1's BTC key (BIP-322)
 * and POSTs to /api/heartbeat. Run every 5 minutes once Agent 1 is registered.
 *
 * Usage: WALLET_MNEMONIC="<agent 1 24 words>" node scripts/agent1-heartbeat.mjs
 */
import { deriveKeys, signBip322, postJson } from './aibtc-lib.mjs';

const MNEMONIC = process.env.WALLET_MNEMONIC;
if (!MNEMONIC) { console.error('Set WALLET_MNEMONIC (Agent 1 24 words).'); process.exit(1); }

const EXPECTED_STX = 'SP2B4V8FTKNR1PY325CN3GZ1187H6GN8SG2FS2P4B';
const k = deriveKeys(MNEMONIC);
if (k.stxAddress !== EXPECTED_STX) {
  console.error(`✗ Derived STX != Agent 1 (${EXPECTED_STX}). Wrong seed. Aborting.`);
  process.exit(1);
}

const timestamp = new Date().toISOString();
const message = `AIBTC Check-In | ${timestamp}`;
const signature = signBip322(message, k.btcPrivKey, k.btcScript);

const { status, data } = await postJson('https://aibtc.com/api/heartbeat', {
  signature, timestamp, btcAddress: k.btcAddress,
});
console.log(timestamp, '→ HTTP', status);
console.log(JSON.stringify(data, null, 2));
