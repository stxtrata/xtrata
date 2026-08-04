// The test that would have caught the bug: migrate a v3.2.3 inscription onto
// v3.2.4, then read its content back. Before the fix, get-chunk returned none.
import { initSimnet } from '@stacks/clarinet-sdk';
import { Cl } from '@stacks/transactions';
import { createHash } from 'node:crypto';

const simnet = await initSimnet('./v3.2.4/Clarinet.toml');
const a = simnet.getAccounts();
const deployer = a.get('deployer');
const owner = a.get('wallet_1');

const OLD = 'xtrata-v3-2-3';
const NEW = 'xtrata-v3-2-4';

const sha = (b) => createHash('sha256').update(b).digest();
const roll = (cs) => {
  let h = Buffer.alloc(32, 0);
  for (const c of cs) h = sha(Buffer.concat([h, c]));
  return h;
};

let pass = 0;
let fail = 0;
const check = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  ok   ${name}`); }
  else { fail += 1; console.log(`  FAIL ${name} ${extra}`); }
};

// Both cores deploy paused.
simnet.callPublicFn(OLD, 'set-paused', [Cl.bool(false)], deployer);
simnet.callPublicFn(NEW, 'set-paused', [Cl.bool(false)], deployer);

// A one-chunk inscription with recognisable content.
const body = Buffer.alloc(16384, 0);
Buffer.from('XTRATA-MIGRATION-ROUNDTRIP-PROBE').copy(body, 0);
const hash = roll([body]);

console.log('\n1. mint on v3.2.3');
const mint = simnet.callPublicFn(OLD, 'mint-single-tx', [
  Cl.buffer(hash),
  Cl.stringAscii('text/plain'),
  Cl.uint(body.length),
  Cl.list([Cl.buffer(body)]),
  Cl.stringAscii('ipfs://probe')
], owner);
check('mint succeeded', mint.result.type === 'ok', JSON.stringify(mint.result).slice(0, 200));
const tokenId = Number(mint.result.value?.value?.['token-id']?.value ?? 0);
console.log(`   token-id ${tokenId}`);

console.log('\n2. content readable on v3.2.3 (control)');
const before = simnet.callReadOnlyFn(OLD, 'get-chunk', [Cl.uint(tokenId), Cl.uint(0)], owner);
check('old contract serves chunk 0', before.result.value !== undefined && before.result.value !== null);

console.log('\n3. migrate onto v3.2.4');
const mig = simnet.callPublicFn(NEW, 'migrate-from-v3-2-3', [Cl.uint(tokenId)], owner);
check('migrate succeeded', mig.result.type === 'ok', JSON.stringify(mig.result).slice(0, 300));

console.log('\n4. THE TEST: read the content back from v3.2.4');
const after = simnet.callReadOnlyFn(NEW, 'get-chunk', [Cl.uint(tokenId), Cl.uint(0)], owner);
const got = after.result?.value?.value;
check('new contract serves chunk 0 (was none before the fix)', got !== undefined && got !== null,
  `got ${JSON.stringify(after.result).slice(0, 160)}`);
if (got) {
  const bytes = Buffer.from(got, 'hex');
  check('bytes are byte-identical to what was minted', bytes.equals(body),
    `len ${bytes.length} vs ${body.length}`);
  check('probe string survived', bytes.subarray(0, 32).toString().startsWith('XTRATA-MIGRATION-ROUNDTRIP-PROBE'));
}

console.log('\n5. batch reader too');
const batch = simnet.callReadOnlyFn(NEW, 'get-chunk-batch', [Cl.uint(tokenId), Cl.list([Cl.uint(0)])], owner);
const list = batch.result?.value ?? [];
check('get-chunk-batch returns one entry', Array.isArray(list) ? list.length === 1 : true,
  JSON.stringify(batch.result).slice(0, 160));

console.log('\n6. provenance: original creator survived');
const meta = simnet.callReadOnlyFn(NEW, 'get-inscription-summary', [Cl.uint(tokenId)], owner);
const creator = meta.result?.value?.value?.value?.creator?.value;
check('creator is the original minter, not the migrator', creator === owner, `creator=${creator} owner=${owner}`);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
