/**
 * Inscribe one XIP-corpus artifact on xtrata-v3-2-3 (single transaction).
 *
 * Safe by default: with no flags it performs a DRY RUN — it computes the
 * core final-hash, chunking and the exact Clarity call, and prints them.
 * It never touches the network and needs no key unless you pass --broadcast.
 *
 * Mint one artifact per invocation so you can capture the returned inscription
 * id before building the next dependent artifact (manifest needs the doc ids;
 * the viewer needs the manifest id).
 *
 * DRY RUN (no key, no network):
 *   node scripts/inscribe-xip-corpus.mjs \
 *     --file docs/xips/XIP-011-Agent-Inscription-Standard.md \
 *     --mime text/markdown
 *
 *   # supersession example (new XIP-001 replaces #1053):
 *   node scripts/inscribe-xip-corpus.mjs \
 *     --file docs/xips/XIP-001-Manifest-Standard.md \
 *     --mime text/markdown --parents 1053
 *
 * BROADCAST (real mainnet tx, spends STX, irreversible):
 *   XTRATA_NETWORK=mainnet SENDER_KEY=<hex-private-key> \
 *   node scripts/inscribe-xip-corpus.mjs \
 *     --file docs/xips/XIP-011-Agent-Inscription-Standard.md \
 *     --mime text/markdown --token-uri "<uri>" --broadcast
 *
 * Flags:
 *   --file <path>        (required) artifact to inscribe
 *   --mime <type>        (required) e.g. text/markdown,
 *                        application/vnd.xtrata.manifest+json, text/html
 *   --parents a,b        core parent ids (supersession). Sender MUST OWN each.
 *   --deps a,b           dependency ids (references / recursion)
 *   --token-uri <s>      token uri string (<=256 ascii); default below
 *   --broadcast          actually send (otherwise dry run)
 *
 * Requires (already in repo node_modules): @stacks/transactions, @stacks/network,
 * @noble/hashes.
 */
import { readFileSync } from 'fs';
import { sha256 } from '@noble/hashes/sha256';
import {
  makeContractCall, broadcastTransaction, bufferCV, uintCV, listCV,
  stringAsciiCV, AnchorMode, PostConditionMode, getAddressFromPrivateKey,
  TransactionVersion,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const CONTRACT_ADDRESS = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CONTRACT_NAME = 'xtrata-v3-2-3';
const CHUNK_SIZE = 16_384;
const MAX_SINGLE_TX_CHUNKS = 32;
const DEFAULT_TOKEN_URI =
  'https://xvgh3sbdkivby4blejmripeiyjuvji3d4tycym6hgaxalescegjq.arweave.net/vUx9yCNSKhxwKyJZFDyIwmlUo2Pk8CwzxzAuBZJCIZM';

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
}
function idList(s) {
  return s ? String(s).split(',').map((x) => x.trim()).filter(Boolean).map((x) => BigInt(x)) : [];
}

// core final-hash: H_0 = 32 zero bytes; H_i = sha256(H_{i-1} || chunk_i)
function finalHash(bytes) {
  let h = new Uint8Array(32);
  if (bytes.length === 0) return sha256(h);
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    h = sha256(new Uint8Array([...h, ...chunk]));
  }
  return h;
}
const hex = (u8) => '0x' + Buffer.from(u8).toString('hex');

async function main() {
  const file = arg('file');
  const mime = arg('mime');
  if (!file || !mime) {
    console.error('Required: --file <path> --mime <type>. See header for usage.');
    process.exit(2);
  }
  const parents = idList(arg('parents'));
  const deps = idList(arg('deps'));
  const tokenUri = typeof arg('token-uri') === 'string' ? arg('token-uri') : DEFAULT_TOKEN_URI;
  const broadcast = arg('broadcast') === true;

  const data = new Uint8Array(readFileSync(file));
  const totalSize = data.length;
  const totalChunks = Math.max(1, Math.ceil(totalSize / CHUNK_SIZE));
  const fh = finalHash(data);

  // choose the narrowest function that fits
  let fn, fnArgs;
  const chunkCVs = [];
  for (let i = 0; i < data.length; i += CHUNK_SIZE) chunkCVs.push(bufferCV(data.subarray(i, i + CHUNK_SIZE)));
  const base = [bufferCV(fh), stringAsciiCV(mime), uintCV(totalSize), listCV(chunkCVs), stringAsciiCV(tokenUri)];
  if (parents.length > 0) {
    fn = 'mint-single-tx-with-relationships';
    fnArgs = [...base, listCV(deps.map(uintCV)), listCV(parents.map(uintCV))];
  } else if (deps.length > 0) {
    fn = 'mint-single-tx-recursive';
    fnArgs = [...base, listCV(deps.map(uintCV))];
  } else {
    fn = 'mint-single-tx';
    fnArgs = base;
  }

  console.log('--- inscription plan ---');
  console.log('file        :', file);
  console.log('size/chunks :', totalSize, 'bytes /', totalChunks, 'chunk(s)');
  console.log('finalHash   :', hex(fh));
  console.log('mime        :', mime);
  console.log('contract    :', `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
  console.log('function    :', fn);
  console.log('dependencies:', deps.map(String).join(',') || '(none)');
  console.log('parents     :', parents.map(String).join(',') || '(none)');
  console.log('token-uri   :', tokenUri);

  if (totalChunks > MAX_SINGLE_TX_CHUNKS) {
    console.error(`\nABORT: ${totalChunks} chunks exceeds single-tx limit (${MAX_SINGLE_TX_CHUNKS}). Use the chunked begin/add/seal flow.`);
    process.exit(1);
  }
  if (mime.length > 64) { console.error('ABORT: mime > 64 chars'); process.exit(1); }
  if (tokenUri.length > 256) { console.error('ABORT: token-uri > 256 chars'); process.exit(1); }

  if (!broadcast) {
    console.log('\nDRY RUN — nothing sent. Re-run with --broadcast and SENDER_KEY to inscribe.');
    if (parents.length) console.log('Reminder: the sender wallet MUST already OWN each parent id', parents.map(String).join(','));
    return;
  }

  const key = process.env.SENDER_KEY;
  if (!key) { console.error('ABORT: --broadcast requires SENDER_KEY env (hex private key).'); process.exit(2); }
  const netName = (process.env.XTRATA_NETWORK || 'mainnet').toLowerCase();
  const network = netName === 'testnet' ? new StacksTestnet() : new StacksMainnet();
  const txVersion = netName === 'testnet' ? TransactionVersion.Testnet : TransactionVersion.Mainnet;
  const sender = getAddressFromPrivateKey(key, txVersion);
  console.log('\nBROADCAST as', sender, 'on', netName);

  const tx = await makeContractCall({
    contractAddress: CONTRACT_ADDRESS, contractName: CONTRACT_NAME,
    functionName: fn, functionArgs: fnArgs, senderKey: key, network,
    anchorMode: AnchorMode.Any, postConditionMode: PostConditionMode.Allow,
  });
  const res = await broadcastTransaction(tx, network);
  if (res.error) { console.error('BROADCAST ERROR:', JSON.stringify(res)); process.exit(1); }
  console.log('txid:', res.txid);
  console.log('Watch:', `https://explorer.hiro.so/txid/0x${res.txid}?chain=${netName}`);
  console.log('After confirmation, read the new inscription id from get-last-id / the tx events,');
  console.log('then record it for the manifest/viewer steps.');
}

main().catch((e) => { console.error(e); process.exit(1); });
