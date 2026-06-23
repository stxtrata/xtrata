/**
 * Send sBTC from Agent 1 (SP2B4V8…, the capital-"Olympic" seed) to Huge Sphinx.
 *
 * SAFE BY DEFAULT: previews only. Add REALLY_SEND=1 to broadcast.
 * Caps the transfer with an exact-amount deny-mode post-condition.
 * Sends the FULL current sBTC balance unless AMOUNT (in sats) is set.
 *
 * Preview:  WALLET_MNEMONIC="oppose ... Olympic ... buffalo" node scripts/agent1-send-sbtc.mjs
 * Send:     WALLET_MNEMONIC="oppose ... Olympic ... buffalo" REALLY_SEND=1 node scripts/agent1-send-sbtc.mjs
 */
import { deriveKeys } from './aibtc-lib.mjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const MCP = process.env.MCP_MODULES || '/Users/melophonic/.npm/_npx/2232c00bb1f81919/node_modules';
const tx = require(`${MCP}/@stacks/transactions`);

const MNEMONIC = process.env.WALLET_MNEMONIC;
if (!MNEMONIC) { console.error('Set WALLET_MNEMONIC (Agent 1 — capital "Olympic").'); process.exit(1); }

const EXPECTED_STX = 'SP2B4V8FTKNR1PY325CN3GZ1187H6GN8SG2FS2P4B';
const RECIPIENT    = process.env.RECIPIENT || 'SP13G0F3E48HDK7MMRYXDHQ4RTACKDN5FSV9VEPRC'; // Huge Sphinx
const SBTC_ADDR    = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4';
const SBTC_NAME    = 'sbtc-token';
const SBTC_ASSET   = 'sbtc-token';

const k = deriveKeys(MNEMONIC);
console.log('From (Agent 1):', k.stxAddress);
console.log('To (Huge Sphinx):', RECIPIENT);
if (k.stxAddress !== EXPECTED_STX) {
  console.error(`\n✗ Seed does not derive Agent 1 (${EXPECTED_STX}).`);
  console.error('  Did you use lowercase "olympic"? That is Huge Sphinx. Aborting.');
  process.exit(1);
}

// Live balance → send all (or AMOUNT override).
const bal = await (await fetch(`https://api.hiro.so/extended/v1/address/${k.stxAddress}/balances`)).json();
const ftKey = `${SBTC_ADDR}.${SBTC_NAME}::${SBTC_ASSET}`;
const onChain = BigInt(bal.fungible_tokens?.[ftKey]?.balance || '0');
const AMOUNT = process.env.AMOUNT ? BigInt(process.env.AMOUNT) : onChain;
console.log(`sBTC balance: ${onChain} sats`);
console.log(`Sending     : ${AMOUNT} sats`);
if (AMOUNT <= 0n) { console.error('Nothing to send.'); process.exit(1); }
if (AMOUNT > onChain) { console.error('AMOUNT exceeds balance. Aborting.'); process.exit(1); }

// Post-condition: sender sends EXACTLY AMOUNT of sBTC (version-tolerant).
let postConditions;
try {
  postConditions = [tx.Pc.principal(k.stxAddress).willSendEq(AMOUNT).ft(`${SBTC_ADDR}.${SBTC_NAME}`, SBTC_ASSET)];
} catch {
  postConditions = [tx.makeStandardFungiblePostCondition(
    k.stxAddress, tx.FungibleConditionCode.Equal, AMOUNT,
    tx.createAssetInfo(SBTC_ADDR, SBTC_NAME, SBTC_ASSET))];
}

const opts = {
  contractAddress: SBTC_ADDR,
  contractName: SBTC_NAME,
  functionName: 'transfer',
  functionArgs: [
    tx.uintCV(AMOUNT),
    tx.standardPrincipalCV(k.stxAddress),
    tx.standardPrincipalCV(RECIPIENT),
    tx.noneCV(),
  ],
  senderKey: k.stxPrivHex,
  network: tx.STACKS_MAINNET || (tx.StacksMainnet ? new tx.StacksMainnet() : 'mainnet'),
  postConditionMode: tx.PostConditionMode ? tx.PostConditionMode.Deny : 'deny',
  postConditions,
};
if (tx.AnchorMode) opts.anchorMode = tx.AnchorMode.Any; // older versions require this

const transaction = await tx.makeContractCall(opts);

if (process.env.REALLY_SEND !== '1') {
  console.log('\nDRY RUN — not broadcasting. Transaction built OK.');
  console.log('Estimated fee (uSTX):', transaction.auth?.spendingCondition?.fee?.toString?.() ?? 'n/a');
  console.log('\nTo send for real, re-run with REALLY_SEND=1');
  process.exit(0);
}

const network = opts.network;
let result;
try { result = await tx.broadcastTransaction({ transaction, network }); }   // newer API
catch { result = await tx.broadcastTransaction(transaction, network); }       // older API

console.log('\nBroadcast result:', JSON.stringify(result, null, 2));
if (result?.txid) {
  console.log('\n✓ Sent. Track: https://explorer.hiro.so/txid/' + result.txid + '?chain=mainnet');
} else {
  console.log('\n✗ No txid — check the error above (reason/reason_data).');
}
