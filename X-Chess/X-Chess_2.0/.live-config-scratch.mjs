// What the live canary is actually configured to charge, right now.
import { readFileSync } from 'node:fs';
import { Cl, fetchCallReadOnlyFunction } from '@stacks/transactions';
import { createApiKeyMiddleware, createFetchFn } from '@stacks/common';

const HERE = 'harness/wizards';
const env = {};
for (const line of readFileSync(`${HERE}/.env.wizards`, 'utf8').split('\n')) {
  const at = line.indexOf('=');
  if (at < 1 || line.trim().startsWith('#')) continue;
  env[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^["']|["']$/g, '');
}
const client = env.HIRO_API_KEY
  ? { fetch: createFetchFn(createApiKeyMiddleware({ apiKey: env.HIRO_API_KEY })) }
  : undefined;

const read = (fn, args = []) =>
  fetchCallReadOnlyFunction({
    contractAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
    contractName: 'xchess-core-v1-canary',
    functionName: fn,
    functionArgs: args,
    senderAddress: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
    network: 'mainnet',
    client
  });

const stx = (n) => `${(Number(n) / 1_000_000).toFixed(6)} STX`;

const price = await read('get-sponsor-price');
console.log('get-sponsor-price:');
for (const [k, v] of Object.entries(price.value)) console.log(`  ${k.padEnd(10)} ${v.value} uSTX  (${stx(v.value)})`);

for (const fn of ['get-open-fee', 'get-rebate-amount', 'get-rebate-count', 'get-bootstrap-amount', 'get-expiry-blocks']) {
  try {
    const v = await read(fn);
    console.log(`${fn.padEnd(22)} ${v.value}`);
  } catch (e) {
    console.log(`${fn.padEnd(22)} (no such read-only)`);
  }
}
