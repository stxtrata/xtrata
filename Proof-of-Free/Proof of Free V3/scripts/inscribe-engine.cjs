#!/usr/bin/env node
/* Proof of Free — inscribe the v3 recursive engine as a child of 2838.
 *
 *   node scripts/inscribe-engine.cjs                # dry run: verify + print, send nothing
 *   node scripts/inscribe-engine.cjs --broadcast    # actually sign and broadcast
 *
 * Key comes from the environment only. There is no default mnemonic in this file
 * on purpose — this signs from the wallet that owns 2838, not from Agent 27.
 *
 *   SENDER_KEY=<hex privkey>      preferred
 *   POF_MNEMONIC="word word ..."  derived at m/44'/5757'/0'/0/0
 *
 * Aborts before broadcasting if any of these fail:
 *   - engine bytes do not hash to the expected chain hash
 *   - derived sender != the on-chain owner of parent 2838
 *   - parent 2838 is missing or unsealed
 */
'use strict';
const { readFileSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { join } = require('node:path');
const {
  makeContractCall, broadcastTransaction, bufferCV, uintCV, listCV,
  stringAsciiCV, getAddressFromPrivateKey, cvToValue, hexToCV, cvToHex,
  AnchorMode, PostConditionMode, TransactionVersion
} = require('@stacks/transactions');
const { StacksMainnet } = require('@stacks/network');

const ROOT = join(__dirname, '..');
const CONTRACT_ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CONTRACT_NAME = 'xtrata-v3-2-3';
const ENGINE = 'artifacts/proof-of-free-recursive-engine-v3.html';
const TOKEN_URI = 'https://yfa7uhk4vmrr3jjwr57fnm6ccvwi2r2ycufcjs6nsmrpjmr25azq.ardrive.net/wUH6HVyrIx2lNo9-VrPCFWyNR1gVCiTLzZMi9LI66DM';
const MIME = 'text/html';
const PARENT = 2838;
const CHUNK_SIZE = 16384;
const MAX_SINGLE_TX_CHUNKS = 32;
const TX_FEE = Number(process.env.TX_FEE || 3000);

const network = new StacksMainnet();
const BROADCAST = process.argv.includes('--broadcast');
const die = msg => { console.error(`\nABORT — ${msg}\n`); process.exit(1); };

/* ---- key ---- */
function senderKey() {
  if (process.env.SENDER_KEY?.trim()) return process.env.SENDER_KEY.trim();
  if (process.env.POF_MNEMONIC?.trim()) {
    const { mnemonicToSeedSync } = require('@scure/bip39');
    const { HDKey } = require('@scure/bip32');
    const seed = mnemonicToSeedSync(process.env.POF_MNEMONIC.trim());
    const child = HDKey.fromMasterSeed(seed).derive("m/44'/5757'/0'/0/0");
    return `${Buffer.from(child.privateKey).toString('hex')}01`;
  }
  die('no key. Set SENDER_KEY=<hex> or POF_MNEMONIC="..." in the environment.');
}

/* ---- payload ---- */
const engine = readFileSync(join(ROOT, ENGINE));
const chunks = [];
let running = Buffer.alloc(32);
for (let i = 0; i < engine.length; i += CHUNK_SIZE) {
  const c = engine.subarray(i, i + CHUNK_SIZE);
  chunks.push(c);
  running = createHash('sha256').update(Buffer.concat([running, c])).digest();
}
const expectedHash = running.toString('hex');
const flatSha = createHash('sha256').update(engine).digest('hex');

const EXPECT_BYTES = 27388;
const EXPECT_CHAIN = 'e7a35c737e6b34137d2f81b318e56519e10d54b51fbbee9a1538ab33c033bae8';
const EXPECT_FLAT = '824d0b7f034857860f85a52d4d13c525799bd583da176ec586bb522501cfd1cf';

/* ---- read-only helper ---- */
async function readOnly(functionName, args) {
  const res = await fetch(`${network.coreApiUrl}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/${functionName}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: CONTRACT_ADDRESS, arguments: args })
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); }
  catch { throw new Error(`${functionName}: HTTP ${res.status} — ${text.slice(0, 160)}`); }
  if (!json.okay) throw new Error(`${functionName}: ${json.cause}`);
  return cvToValue(hexToCV(json.result));
}

(async () => {
  const key = senderKey();
  const sender = getAddressFromPrivateKey(key, TransactionVersion.Mainnet);

  console.log('Proof of Free — engine v3 inscription');
  console.log('─'.repeat(64));
  console.log(`contract        ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
  console.log(`function        mint-single-tx-with-relationships`);
  console.log(`engine          ${ENGINE}`);
  console.log(`bytes           ${engine.length}`);
  console.log(`chunks          ${chunks.length} (${chunks.map(c => c.length).join(', ')})`);
  console.log(`sha256          ${flatSha}`);
  console.log(`expected-hash   0x${expectedHash}`);
  console.log(`token-uri       ${TOKEN_URI}`);
  console.log(`mime            ${MIME}`);
  console.log(`dependencies    []`);
  console.log(`parents         [u${PARENT}]`);
  console.log(`sender          ${sender}`);
  console.log(`tx fee          ${TX_FEE} uSTX   (protocol fee ${10000 + chunks.length * 1000} uSTX charged by the contract)`);
  console.log('─'.repeat(64));

  /* ---- preflight ---- */
  if (engine.length !== EXPECT_BYTES) die(`engine is ${engine.length} bytes, expected ${EXPECT_BYTES}. Rebuild and re-verify before inscribing.`);
  if (expectedHash !== EXPECT_CHAIN) die(`chain hash mismatch.\n  got      0x${expectedHash}\n  expected 0x${EXPECT_CHAIN}`);
  if (flatSha !== EXPECT_FLAT) die(`sha256 mismatch — the engine file has changed.`);
  if (chunks.length > MAX_SINGLE_TX_CHUNKS) die(`${chunks.length} chunks exceeds the single-tx limit of ${MAX_SINGLE_TX_CHUNKS}.`);
  if (TOKEN_URI.length > 256 || !/^[\x00-\x7F]*$/.test(TOKEN_URI)) die('token URI must be <=256 ASCII chars.');
  console.log('payload         OK — bytes, sha256 and chain hash all match the verified build');

  const parentHex = cvToHex(uintCV(PARENT));
  const owner = await readOnly('get-owner', [parentHex]);
  const ownerAddr = owner?.value?.value ?? null;
  if (!ownerAddr) die(`parent ${PARENT} has no owner — it does not exist on ${CONTRACT_NAME}.`);
  const sealed = await readOnly('is-inscription-sealed', [parentHex]);
  if (sealed?.value !== true && sealed !== true) die(`parent ${PARENT} is not sealed.`);
  console.log(`parent ${PARENT}    OK — sealed, owned by ${ownerAddr}`);

  if (ownerAddr !== sender) {
    die(`sender is not the owner of parent ${PARENT}.\n` +
        `  sender signing : ${sender}\n` +
        `  owner of ${PARENT} : ${ownerAddr}\n` +
        `  validate-parent compares against tx-sender, so this would revert with ERR-NOT-AUTHORIZED.\n` +
        `  Set SENDER_KEY / POF_MNEMONIC for ${ownerAddr}.`);
  }
  console.log('sender          OK — matches the parent owner');

  if (!BROADCAST) {
    console.log('\nDRY RUN — nothing sent. Re-run with --broadcast to sign and submit.');
    return;
  }

  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'mint-single-tx-with-relationships',
    functionArgs: [
      bufferCV(Buffer.from(expectedHash, 'hex')),
      stringAsciiCV(MIME),
      uintCV(engine.length),
      listCV(chunks.map(c => bufferCV(c))),
      stringAsciiCV(TOKEN_URI),
      listCV([]),
      listCV([uintCV(PARENT)])
    ],
    senderKey: key,
    network,
    fee: TX_FEE,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow
  });

  const result = await broadcastTransaction(tx, network);
  if (result.error) die(`broadcast rejected: ${result.error} ${result.reason || ''} ${JSON.stringify(result.reason_data || {})}`);
  const txid = result.txid || result;
  console.log(`\nbroadcast       ${txid}`);
  console.log(`explorer        https://explorer.hiro.so/txid/${txid}?chain=mainnet`);
  console.log(`\nOnce confirmed, read the new inscription id from the tx result, then:`);
  console.log(`  node scripts/build-collection.mjs https://xtrata.xyz/i/<ID> --engine-id <ID>`);
})().catch(e => die(e.stack || e.message));
