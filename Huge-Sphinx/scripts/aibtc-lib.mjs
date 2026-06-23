/**
 * Shared AIBTC signing helpers (BIP-322 BTC + Stacks RSV).
 * Derives keys from a BIP-39 mnemonic. Nothing is logged except public data.
 *
 * Module resolution: reuses the @aibtc MCP server's installed node_modules
 * (same path the existing heartbeat script uses). Override with MCP_MODULES.
 */

const MCP = process.env.MCP_MODULES
  || '/Users/melophonic/.npm/_npx/2232c00bb1f81919/node_modules';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { mnemonicToSeedSync } = require(`${MCP}/@scure/bip39`);
const { HDKey } = require(`${MCP}/@scure/bip32`);
const enc = require(`${MCP}/@stacks/encryption`);
const { hashSha256Sync } = enc;
const btc = await import(`${MCP}/@scure/btc-signer/index.js`);

// Stacks address + signing come from @stacks/transactions (bundled with the MCP server).
let stx;
try {
  stx = require(`${MCP}/@stacks/transactions`);
} catch (e) {
  console.error('Could not load @stacks/transactions from', MCP);
  console.error('Set MCP_MODULES to the dir containing @stacks/transactions, or run');
  console.error('  npx @aibtc/mcp-server@latest --install   (once) to populate it.');
  throw e;
}

export function normalizeMnemonic(m) {
  return (m || '').trim().replace(/,\s*/g, ' ').replace(/\s+/g, ' ');
}

/** Derive BTC (BIP84 m/84'/0'/0'/0/0) and Stacks (m/44'/5757'/0'/0/0) keys. */
export function deriveKeys(mnemonic) {
  const seed = mnemonicToSeedSync(normalizeMnemonic(mnemonic));
  const master = HDKey.fromMasterSeed(seed);

  const btcChild = master.derive("m/84'/0'/0'/0/0");
  const btcPrivKey = btcChild.privateKey;
  const btcPubKey = btcChild.publicKey;
  const p2wpkh = btc.p2wpkh(btcPubKey, btc.NETWORK);

  const stxChild = master.derive("m/44'/5757'/0'/0/0");
  const stxPrivBytes = stxChild.privateKey;                                   // raw 32-byte key (for signing)
  const stxPrivHex = Buffer.from(stxPrivBytes).toString('hex') + '01';        // +01 compressed flag (for address)
  const stxAddress = stx.getAddressFromPrivateKey(stxPrivHex, 'mainnet');

  return {
    btcPrivKey,
    btcPubKey,
    btcScript: p2wpkh.script,
    btcAddress: p2wpkh.address,
    stxPrivBytes,
    stxPrivHex,
    stxAddress,
  };
}

// ---- BIP-322 (BTC) ----
function concatBytes(...arrays) {
  const total = arrays.reduce((a, x) => a + x.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of arrays) { out.set(a, off); off += a.length; }
  return out;
}
function taggedHash(message) {
  const tagHash = hashSha256Sync(new TextEncoder().encode('BIP0322-signed-message'));
  const msg = new TextEncoder().encode(message);
  return hashSha256Sync(concatBytes(tagHash, tagHash, msg));
}
function toSpendTxId(message, scriptPubKey) {
  const msgHash = taggedHash(message);
  const scriptSig = concatBytes(new Uint8Array([0x00, 0x20]), msgHash);
  const rawTx = btc.RawTx.encode({
    version: 0,
    inputs: [{ txid: new Uint8Array(32), index: 0xffffffff, finalScriptSig: scriptSig, sequence: 0 }],
    outputs: [{ amount: 0n, script: scriptPubKey }],
    lockTime: 0,
  });
  return hashSha256Sync(hashSha256Sync(rawTx)).reverse();
}
export function signBip322(message, privateKey, scriptPubKey) {
  const txid = toSpendTxId(message, scriptPubKey);
  const tx = new btc.Transaction({ version: 0, lockTime: 0, allowUnknownOutputs: true });
  tx.addInput({ txid, index: 0, sequence: 0, witnessUtxo: { amount: 0n, script: scriptPubKey } });
  tx.addOutput({ script: btc.Script.encode(['RETURN']), amount: 0n });
  tx.signIdx(privateKey, 0);
  tx.finalizeIdx(0);
  const input = tx.getInput(0);
  if (!input.finalScriptWitness) throw new Error('BIP-322: no witness produced');
  return Buffer.from(btc.RawWitness.encode(input.finalScriptWitness)).toString('base64');
}

// ---- Stacks RSV signature, computed directly via @noble/secp256k1 ----
// Produces a 65-byte (130 hex char) recoverable signature in r||s||v order,
// with v = recovery id (0/1) — the format AIBTC's verifier expects.
const secpMod = require(`${MCP}/@noble/secp256k1`);
const secp = secpMod.secp256k1 || secpMod.default || secpMod;
const toHex = (b) => Buffer.from(b).toString('hex');

export function signStacks(message, stxPrivBytes) {
  // Stacks message hash (SHA256 of the prefixed message) — reuse the canonical impl.
  const mh = Uint8Array.from(enc.hashMessage(message));

  let rsvHex;
  // @noble/secp256k1 v2: sign() is sync and returns a recovered Signature.
  try {
    const sig = secp.sign(mh, stxPrivBytes);
    if (sig && typeof sig.toCompactRawBytes === 'function' && typeof sig.recovery === 'number') {
      rsvHex = toHex(sig.toCompactRawBytes()) + sig.recovery.toString(16).padStart(2, '0');
    } else if (sig && sig.r !== undefined) {
      rsvHex = sig.r.toString(16).padStart(64, '0')
             + sig.s.toString(16).padStart(64, '0')
             + Number(sig.recovery || 0).toString(16).padStart(2, '0');
    }
  } catch { /* fall back to v1 below */ }

  // @noble/secp256k1 v1: signSync with recovered flag.
  if (!rsvHex) {
    if (secp.utils && !secp.utils.hmacSha256Sync) {
      const { hmac } = require(`${MCP}/@noble/hashes/hmac`);
      const { sha256 } = require(`${MCP}/@noble/hashes/sha256`);
      secp.utils.hmacSha256Sync = (key, ...msgs) =>
        hmac(sha256, key, secp.utils.concatBytes(...msgs));
    }
    const [sigBytes, recovery] = secp.signSync(mh, stxPrivBytes, { recovered: true, der: false });
    rsvHex = toHex(sigBytes) + Number(recovery).toString(16).padStart(2, '0');
  }

  if (!rsvHex || rsvHex.length !== 130) {
    throw new Error('Stacks signing failed (unexpected length ' + (rsvHex ? rsvHex.length : 0) + ')');
  }
  return '0x' + rsvHex;
}

export async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data;
  try { data = await res.json(); } catch { data = await res.text(); }
  return { status: res.status, data };
}
