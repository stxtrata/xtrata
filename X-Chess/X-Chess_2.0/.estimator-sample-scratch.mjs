// Sample what a wallet would propose for one `submit`, repeatedly.
// The estimator moves; one reading is not a number.
import { readFileSync, appendFileSync } from 'node:fs';
import { Cl, serializePayload, makeUnsignedContractCall } from '@stacks/transactions';

const OUT = '.estimator-samples.jsonl';
const API = 'https://api.mainnet.hiro.so';
const env = {};
for (const line of readFileSync('harness/wizards/.env.wizards', 'utf8').split('\n')) {
  const at = line.indexOf('=');
  if (at < 1 || line.trim().startsWith('#')) continue;
  env[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^["']|["']$/g, '');
}
const headers = { 'content-type': 'application/json', ...(env.HIRO_API_KEY ? { 'x-api-key': env.HIRO_API_KEY } : {}) };

const tx = await makeUnsignedContractCall({
  contractAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
  contractName: 'xchess-core-v1-canary',
  functionName: 'submit',
  functionArgs: [Cl.uint(1), Cl.stringAscii('e2e4')],
  publicKey: '03fe6a4a1cd8ff26db7cbbc8f0eb2ec2b8b1d8b0dcd0e6e0f7d0e5b0a0e0d0c0b0',
  network: 'mainnet',
  fee: 0,
  nonce: 0
});
const raw = serializePayload(tx.payload);
const payloadHex = typeof raw === 'string' ? raw : Buffer.from(raw).toString('hex');
const len = Math.round(tx.serialize().length / 2);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (let i = 0; i < 60; i++) {
  try {
    const res = await fetch(`${API}/v2/fees/transaction`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ transaction_payload: payloadHex, estimated_len: len })
    });
    const body = await res.json();
    const fees = (body.estimations ?? []).map((e) => e.fee);
    appendFileSync(OUT, JSON.stringify({ at: Date.now(), fees }) + '\n');
    console.log(`${i} ${fees.join(' / ')}`);
  } catch (e) {
    console.log(`${i} error ${e.message}`);
  }
  await sleep(20_000);
}
