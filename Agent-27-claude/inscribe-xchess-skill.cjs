/**
 * Inscribe the X Chess deterministic engine on the live Xtrata core.
 *
 * Direct to `xtrata-v3-2-3.mint-single-tx-recursive`, with no helper in the
 * middle. Two earlier attempts failed and both are worth recording:
 *
 *   v2-1-0 via the helper   -> u101 ERR-NOT-FOUND. Genesis #107 lives on
 *                              v3-2-3; on v2-1-0 it belongs to the v3 contract,
 *                              so the dependency could not resolve. Mined, so
 *                              the miner fee burned.
 *   v3-2-3 via the helper   -> BadFunctionArgument, rejected at broadcast and
 *                              therefore free. xtrata-small-mint-v1-0 carries
 *                              its own core setting and will not take v3.
 *
 * The core's own single-tx entry point takes no trait argument and needs no
 * helper, which is why it is the one that works.
 */
const fs = require('fs');
const crypto = require('crypto');
const {
  makeContractCall, broadcastTransaction, bufferCV, uintCV, listCV,
  stringAsciiCV, PostConditionMode, FungibleConditionCode,
  makeStandardSTXPostCondition, getNonce
} = require('@stacks/transactions');
const { StacksMainnet } = require('@stacks/network');
const { getAddressFromPrivateKey, TransactionVersion } = require('@stacks/transactions');
const { deriveAgent27SenderKey } = require('./scripts/agent27-signer.cjs');

const CONTRACT_ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CONTRACT_NAME = 'xtrata-v3-2-3';
const GENESIS = 107;
const CHUNK = 16_384;
const FEE_UNIT = 100_000n;      // read live from get-fee-unit
const TX_FEE = 20_000n;

(async () => {
  const network = new StacksMainnet();
  // Returns the key itself, not a pair — the address is derived from it, the
  // same way inscribe-entry.cjs does.
  const senderKey = deriveAgent27SenderKey();
  const senderAddress = getAddressFromPrivateKey(senderKey, TransactionVersion.Mainnet);

  const bytes = fs.readFileSync('xchess-skill.js');
  const chunks = [];
  let running = Buffer.alloc(32);
  for (let at = 0; at < bytes.length; at += CHUNK) {
    const piece = bytes.subarray(at, at + CHUNK);
    chunks.push(piece);
    running = crypto.createHash('sha256').update(Buffer.concat([running, piece])).digest();
  }

  // begin_fee + seal_fee, per the documented formula. LessEqual, never Equal:
  // an exact-match post-condition aborts and burns the miner fee.
  const spendCap = FEE_UNIT + FEE_UNIT * (1n + BigInt(Math.ceil(chunks.length / 50)));

  console.log(`sender    ${senderAddress}`);
  console.log(`payload   ${bytes.length} bytes in ${chunks.length} chunk(s)`);
  console.log(`hash      0x${running.toString('hex')}`);
  console.log(`spend cap ${spendCap} uSTX + ${TX_FEE} miner fee`);
  console.log(`parent    Genesis #${GENESIS}\n`);

  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'mint-single-tx-recursive',
    functionArgs: [
      bufferCV(running),
      stringAsciiCV('text/javascript'),
      uintCV(bytes.length),
      listCV(chunks.map((c) => bufferCV(c))),
      stringAsciiCV('data:text/plain,x-chess-skill-1-chess-engine'),
      listCV([uintCV(GENESIS)])
    ],
    senderKey,
    network,
    fee: TX_FEE,
    nonce: await getNonce(senderAddress, network),
    postConditions: [
      makeStandardSTXPostCondition(senderAddress, FungibleConditionCode.LessEqual, spendCap)
    ],
    postConditionMode: PostConditionMode.Deny
  });

  const out = await broadcastTransaction(tx, network);
  if (out.error || out.reason) { console.error('REJECTED:', JSON.stringify(out).slice(0, 300)); process.exit(1); }
  console.log('txid:', out.txid || out);
})();
