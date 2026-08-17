// What a WALLET will propose for one `submit`, and what the network is
// actually taking right now. Two different numbers, and the gap is the point.

import { readFileSync } from 'node:fs';
import { Cl, serializePayload, makeUnsignedContractCall } from '@stacks/transactions';

const HERE = '/Users/melophonic/Documents/GitHub/xtrata/X-Chess/X-Chess_2.0/harness/wizards';
const API = 'https://api.mainnet.hiro.so';
const env = {};
for (const line of readFileSync(`${HERE}/.env.wizards`, 'utf8').split('\n')) {
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
const len = tx.serialize().length / 2;

const res = await fetch(`${API}/v2/fees/transaction`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ transaction_payload: payloadHex, estimated_len: Math.round(len) })
});
const body = await res.json();
console.log(`estimated_len ${Math.round(len)} bytes`);
console.log('fee estimator (what a wallet proposes):');
if (Array.isArray(body.estimations)) {
  const names = ['low', 'middle', 'high'];
  body.estimations.forEach((e, i) => console.log(`  ${names[i].padEnd(7)} ${e.fee} uSTX  (rate ${e.fee_rate})`));
} else {
  console.log('  ', JSON.stringify(body));
}

// What the network actually took in the last few blocks, for contract calls.
const pct = (xs, p) => xs.slice().sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(xs.length * p))];
const seen = [];
for (let offset = 0; offset < 600 && seen.length < 400; offset += 50) {
  const page = await fetch(`${API}/extended/v1/tx?limit=50&offset=${offset}&type[]=contract_call`, { headers }).then((r) => r.json());
  for (const tx of page.results ?? []) {
    if (tx.tx_status === 'success') seen.push(Number(tx.fee_rate));
  }
  if (!page.results?.length) break;
}
console.log(`\nnetwork contract calls, last ${seen.length} confirmed:`);
console.log(`  min ${Math.min(...seen)}  p25 ${pct(seen, 0.25)}  median ${pct(seen, 0.5)}  p75 ${pct(seen, 0.75)}  p90 ${pct(seen, 0.9)}  max ${Math.max(...seen)}`);
const under = (n) => `${Math.round((seen.filter((f) => f <= n).length / seen.length) * 100)}%`;
console.log(`  paid <= 400: ${under(400)}   <= 1200: ${under(1200)}   <= 3000: ${under(3000)}   <= 10000: ${under(10000)}`);
