#!/usr/bin/env node
// Sweep every NFT out of an old agent wallet into another address (default: xtrata.btc).
// Signs locally. The recovery phrase is read from the MNEMONIC environment variable or a prompt,
// is never written anywhere, and is checked against --expect (the address you believe it controls)
// before anything is built. Dry run by default: nothing is signed or sent without --send.
//
// Usage (from xtrata-2.0, on your own machine):
//   MNEMONIC="word1 word2 ..." node scripts/sweep-agent-wallets.mjs --expect SP15T1W2... --to SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X            # dry run
//   MNEMONIC="..." node scripts/sweep-agent-wallets.mjs --expect SP15T1W2... --send [--max 20] [--fee 3000]
//   node scripts/sweep-agent-wallets.mjs --list-only SP15T1W2...                                                                     # no key needed
//
// Notes
// - The wallet needs a little STX for fees (default 0.003 STX per transfer). The dry run says how much.
// - The Stacks mempool holds about 25 pending transactions per sender, so each --send run sends at most
//   --max (default 20). Wait for them to confirm, then run it again; it works from what the wallet holds now.
// - AIBTC "agent-identity" NFTs are skipped unless you pass --include-identity (they link the wallet to its AIBTC registration).
// - Every transfer carries a post-condition that the sender sends exactly that NFT.
// - Add --curl if Node's fetch cannot reach the network on your machine.

import readline from 'node:readline';
import { execFileSync } from 'node:child_process';
import { mnemonicToSeedSync } from '@scure/bip39';
import { HDKey } from '@scure/bip32';
import { readFileSync, existsSync } from 'node:fs';
import { StacksMainnet } from '@stacks/network';
import { createApiKeyMiddleware, createFetchFn } from '@stacks/common';
import {
  AnchorMode, PostConditionMode, NonFungibleConditionCode, TransactionVersion,
  broadcastTransaction, getAddressFromPrivateKey, makeContractCall,
  makeStandardNonFungiblePostCondition, createAssetInfo, uintCV, principalCV
} from '@stacks/transactions';

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
const flag = (n) => process.argv.includes(n);
const API = arg('--api', 'https://api.hiro.so').replace(/\/$/, '');
const TO = arg('--to', 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X');
const FEE = BigInt(arg('--fee', '3000'));
const MAX = Number(arg('--max', '20'));
const SEND = flag('--send');
const USE_CURL = flag('--curl');
const LIST_ONLY = arg('--list-only', null);
const EXPECT = arg('--expect', null);
const SKIP_IDENTITY = !flag('--include-identity');
const PATH = "m/44'/5757'/0'/0/0";
const ADDR = /^SP[0-9A-Z]{38,40}$/;

// Hiro API key: HIRO_API_KEY from the environment, else the HIRO_API_KEY line in xtrata-2.0/.env.local. Never printed.
const loadApiKey = () => {
  if (process.env.HIRO_API_KEY?.trim()) return process.env.HIRO_API_KEY.trim();
  const f = new URL('../.env.local', import.meta.url);
  if (existsSync(f)) {
    const m = /^\s*HIRO_API_KEY\s*=\s*["']?([^"'\s#]+)/m.exec(readFileSync(f, 'utf8'));
    if (m) return m[1];
  }
  return '';
};
const API_KEY = API.startsWith('https://api.hiro.so') ? loadApiKey() : ''; // the key is only ever sent to Hiro
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const getJson = async (path) => {
  const url = API + path;
  if (USE_CURL) return JSON.parse(execFileSync('curl', ['-sS', '-m', '60', ...(API_KEY ? ['-H', `x-api-key: ${API_KEY}`] : []), url], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
  const r = await fetch(url, API_KEY ? { headers: { 'x-api-key': API_KEY } } : undefined);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
};

async function holdings(address) {
  const out = [];
  for (let offset = 0; ; offset += 50) {
    const j = await getJson(`/extended/v1/tokens/nft/holdings?principal=${address}&limit=50&offset=${offset}`);
    for (const r of j.results) {
      const m = /^u(\d+)$/.exec(r.value.repr);
      if (!m) { console.warn(`  skipping non-uint token id ${r.value.repr} in ${r.asset_identifier}`); continue; }
      const [contract, assetName] = r.asset_identifier.split('::');
      out.push({ contract, assetName, id: BigInt(m[1]) });
    }
    if (offset + 50 >= j.total) break;
  }
  return out;
}

const askPhrase = () => new Promise((resolve) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Paste the recovery phrase: ', (a) => { rl.close(); resolve(a.trim()); });
});

const summarise = (items) => {
  const by = {};
  for (const t of items) by[`${t.contract}::${t.assetName}`] = (by[`${t.contract}::${t.assetName}`] || 0) + 1;
  for (const [k, n] of Object.entries(by)) console.log(`   ${String(n).padStart(4)} x ${k}`);
};

async function main() {
  if (!ADDR.test(TO)) throw new Error(`--to is not a mainnet address: ${TO}`);

  if (LIST_ONLY) {
    if (!ADDR.test(LIST_ONLY)) throw new Error('--list-only needs a mainnet address');
    const items = await holdings(LIST_ONLY);
    console.log(`${LIST_ONLY} holds ${items.length} NFTs:`);
    summarise(items);
    return;
  }

  if (!EXPECT || !ADDR.test(EXPECT)) throw new Error('--expect <the SP address this phrase should control> is required');
  const phrase = (process.env.MNEMONIC || '').trim() || (await askPhrase());
  const words = phrase.split(/\s+/).length;
  if (![12, 24].includes(words)) throw new Error(`expected 12 or 24 words, got ${words}`);
  const priv = Buffer.from(HDKey.fromMasterSeed(mnemonicToSeedSync(phrase)).derive(PATH).privateKey).toString('hex') + '01';
  const from = getAddressFromPrivateKey(priv, TransactionVersion.Mainnet);
  if (from !== EXPECT) throw new Error(`this phrase controls ${from}, not ${EXPECT}. Stopping; nothing was signed.`);
  if (from === TO) throw new Error('--to is the same as the wallet');

  console.log(`From : ${from}\nTo   : ${TO}\nMode : ${SEND ? 'SEND' : 'dry run (add --send to broadcast)'}\nHiro API key: ${API_KEY ? 'loaded' : 'none (public rate limits apply)'}\n`);
  let items = await holdings(from);
  const identity = items.filter((t) => t.contract.includes('identity-registry'));
  if (SKIP_IDENTITY) items = items.filter((t) => !t.contract.includes('identity-registry'));
  console.log(`Holds ${items.length} NFTs to move${identity.length && SKIP_IDENTITY ? ` (${identity.length} AIBTC identity NFT left in place; --include-identity to move it)` : ''}:`);
  summarise(items);

  const bal = await getJson(`/extended/v1/address/${from}/balances`);
  const stx = BigInt(bal.stx.balance) - BigInt(bal.stx.locked || 0);
  const batch = items.slice(0, MAX);
  const needAll = FEE * BigInt(items.length), needBatch = FEE * BigInt(batch.length);
  console.log(`\nSTX balance ${Number(stx) / 1e6}. Fees: ${Number(needBatch) / 1e6} STX for this run of ${batch.length}, ${Number(needAll) / 1e6} STX for all ${items.length}.`);
  if (!SEND) { console.log('\nDry run only. Nothing signed.'); return; }
  if (!batch.length) { console.log('Nothing to move.'); return; }
  if (stx < needBatch) throw new Error(`wallet has ${Number(stx) / 1e6} STX; needs at least ${Number(needBatch) / 1e6} STX for this run. Fund it, then re-run.`);

  const n = await getJson(`/extended/v1/address/${from}/nonces`);
  let nonce = BigInt(n.possible_next_nonce);
  const network = new StacksMainnet({ url: API, ...(API_KEY ? { fetchFn: createFetchFn(createApiKeyMiddleware({ apiKey: API_KEY })) } : {}) });
  let ok = 0;
  for (const t of batch) {
    const [addr, name] = t.contract.split('.');
    const tx = await makeContractCall({
      contractAddress: addr, contractName: name, functionName: 'transfer',
      functionArgs: [uintCV(t.id), principalCV(from), principalCV(TO)],
      senderKey: priv, network, nonce, fee: FEE, anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [makeStandardNonFungiblePostCondition(from, NonFungibleConditionCode.Sends, createAssetInfo(addr, name, t.assetName), uintCV(t.id))]
    });
    let res;
    for (let attempt = 1; ; attempt++) {
      try { res = await broadcastTransaction(tx, network); break; }
      catch (e) {
        // The public Hiro API rate-limits per minute and answers with plain text; wait and send the same signed tx again.
        if (attempt >= 5) throw e;
        console.log(`  rate-limited (attempt ${attempt}); waiting 30 s, then retrying #${t.id}`);
        await sleep(30000);
      }
    }
    if (res.error) { console.error(`  #${t.id} (${t.assetName}): ${res.error} ${res.reason || ''}. Stopping.`); break; }
    ok++; nonce++;
    console.log(`  sent ${t.assetName} #${t.id}  ${res.txid}`);
    await sleep(1500);
  }
  console.log(`\nBroadcast ${ok} of ${batch.length}. ${items.length - ok} still to move. Wait for these to confirm, then run again.`);
}

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
