/**
 * Reply to an inbox message as Huge Sphinx — FREE (no sBTC, no x402).
 * Signs "Inbox Reply | {messageId} | {reply}" with Huge Sphinx's BTC key
 * (BIP-322) and POSTs to /api/outbox/{btcAddress}.
 *
 * Use the Huge Sphinx seed (lowercase "olympic").
 *
 *   MSG_ID="msg_..." REPLY="your reply (max 500 chars)" \
 *     WALLET_MNEMONIC="<huge sphinx 24 words>" node scripts/hs-reply.mjs
 *
 * Optional: MARK_READ=1 also marks the message read first.
 */
import { deriveKeys, signBip322, postJson } from './aibtc-lib.mjs';

const MNEMONIC = process.env.WALLET_MNEMONIC;
const MSG_ID = process.env.MSG_ID;
const REPLY = process.env.REPLY;
if (!MNEMONIC || !MSG_ID || !REPLY) {
  console.error('Need WALLET_MNEMONIC (Huge Sphinx), MSG_ID and REPLY.');
  process.exit(1);
}
if (REPLY.length > 500) { console.error('Reply exceeds 500 chars.'); process.exit(1); }

const EXPECTED_BTC = 'bc1q2knwqf77vp9mhru20hqnrxg00hgzmrpjxxsw0l'; // Huge Sphinx
const k = deriveKeys(MNEMONIC);
console.log('Replying as:', k.btcAddress);
if (k.btcAddress !== EXPECTED_BTC) {
  console.error(`\n✗ Seed is not Huge Sphinx (${EXPECTED_BTC}). Use the lowercase "olympic" words. Aborting.`);
  process.exit(1);
}

if (process.env.MARK_READ === '1') {
  const rsig = signBip322(`Inbox Read | ${MSG_ID}`, k.btcPrivKey, k.btcScript);
  const r = await fetch(`https://aibtc.com/api/inbox/${k.btcAddress}/${MSG_ID}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signature: rsig }),
  });
  console.log('Mark-read:', r.status);
}

const message = `Inbox Reply | ${MSG_ID} | ${REPLY}`;
const signature = signBip322(message, k.btcPrivKey, k.btcScript);
const { status, data } = await postJson(`https://aibtc.com/api/outbox/${k.btcAddress}`, {
  messageId: MSG_ID, reply: REPLY, signature,
});
console.log('\nHTTP', status);
console.log(JSON.stringify(data, null, 2));
if (status >= 200 && status < 300) console.log('\n✓ Reply sent (free).');
