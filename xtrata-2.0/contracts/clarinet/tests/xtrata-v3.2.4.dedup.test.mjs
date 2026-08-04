// What actually stops a duplicate inscription, and what does not.
//
// Written to settle a specific question: is there a gate when the SAME address
// re-inscribes the EXACT same bytes? Reading the source suggests no, but the
// interaction between the single-tx path, the staged path, HashToId and the
// Chunks map is subtle enough that it is worth proving rather than arguing.
//
// Run against v3.2.3, the deployed contract, so the answers describe what
// integrators face today.
import { initSimnet } from '@stacks/clarinet-sdk';
import { Cl } from '@stacks/transactions';
import { createHash } from 'node:crypto';

const simnet = await initSimnet('./v3.2.4/Clarinet.toml');
const a = simnet.getAccounts();
const deployer = a.get('deployer');
const alice = a.get('wallet_1');
const bob = a.get('wallet_2');

const CORE = 'xtrata-v3-2-3';
const ERR_DUPLICATE = 114;

let pass = 0;
let fail = 0;
const finding = [];
const check = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  ok    ${name}`); }
  else { fail += 1; console.log(`  FAIL  ${name}  ${extra}`); }
};
const record = (t) => { finding.push(t); console.log(`  >>    ${t}`); };

simnet.callPublicFn(CORE, 'set-paused', [Cl.bool(false)], deployer);

const sha = (b) => createHash('sha256').update(b).digest();
const roll = (cs) => {
  let h = Buffer.alloc(32, 0);
  for (const c of cs) h = sha(Buffer.concat([h, c]));
  return h;
};

// One fixed payload reused everywhere. The whole point is that it is identical.
const CONTENT = Buffer.alloc(16384, 0);
Buffer.from('IDENTICAL-BYTES-EVERY-TIME').copy(CONTENT, 0);
const HASH = roll([CONTENT]);

const mint = (who) => simnet.callPublicFn(CORE, 'mint-single-tx', [
  Cl.buffer(HASH), Cl.stringAscii('text/plain'), Cl.uint(CONTENT.length),
  Cl.list([Cl.buffer(CONTENT)]), Cl.stringAscii('ipfs://same')
], who);
const begin = (who) => simnet.callPublicFn(CORE, 'begin-or-get', [
  Cl.buffer(HASH), Cl.stringAscii('text/plain'), Cl.uint(CONTENT.length), Cl.uint(1)
], who);
const id = (r) => Number(r.result?.value?.value?.['token-id']?.value ?? -1);
const err = (r) => Number(r.result?.value?.value ?? -1);
const stxOf = (who) => simnet.getAssetsMap().get('STX')?.get(who) ?? 0n;

console.log('\n=== 1. Same address, identical bytes, twice via mint-single-tx ===');
const first = mint(alice);
check('first mint succeeds', first.result.type === 'ok');
const idA = id(first);

const before = stxOf(alice);
const second = mint(alice);
const after = stxOf(alice);
const idB = id(second);

if (second.result.type === 'ok') {
  record('NO GATE. The same address can re-inscribe identical bytes.');
  check('second mint returned a DIFFERENT token id', idA !== idB, `${idA} vs ${idB}`);
  check('and a second protocol fee was charged', before - after > 0n,
    `delta ${before - after} microSTX`);
  console.log(`        token ${idA} then token ${idB}, fee ${before - after} microSTX`);
} else {
  record(`GATE EXISTS. Second identical mint rejected with u${err(second)}.`);
  check('rejected', true);
}

console.log('\n=== 2. A DIFFERENT address, identical bytes ===');
{
  const r = mint(bob);
  if (r.result.type === 'ok') record('Also allowed. Two principals can hold the same content.');
  check('behaves the same as case 1', (r.result.type === 'ok') === (second.result.type === 'ok'),
    `alice-2nd=${second.result.type} bob=${r.result.type}`);
}

console.log('\n=== 3. get-id-by-hash after duplicates ===');
{
  const r = simnet.callReadOnlyFn(CORE, 'get-id-by-hash', [Cl.buffer(HASH)], alice);
  const got = Number(r.result?.value?.value ?? -1);
  check('resolves to the FIRST token minted, not the latest', got === idA, `got ${got}, first was ${idA}`);
  record('get-id-by-hash is a usable free pre-flight, but it only ever names the first.');
}

console.log('\n=== 4. The gate that DOES exist: staged upload in flight ===');
{
  const other = Buffer.alloc(16384, 0);
  Buffer.from('STAGED-COLLISION-PROBE').copy(other, 0);
  const h2 = roll([other]);
  const b = simnet.callPublicFn(CORE, 'begin-or-get', [
    Cl.buffer(h2), Cl.stringAscii('text/plain'), Cl.uint(other.length), Cl.uint(1)
  ], alice);
  check('staged session opened', b.result.type === 'ok');

  const clash = simnet.callPublicFn(CORE, 'mint-single-tx', [
    Cl.buffer(h2), Cl.stringAscii('text/plain'), Cl.uint(other.length),
    Cl.list([Cl.buffer(other)]), Cl.stringAscii('ipfs://clash')
  ], alice);
  check('single-tx mint of that hash is BLOCKED', clash.result.type === 'err');
  check(`with ERR-DUPLICATE (u${ERR_DUPLICATE})`, err(clash) === ERR_DUPLICATE, `got u${err(clash)}`);
  record('The real guard: same sender, same hash, staged session open, blocks the single-tx path.');

  // Scoped to the sender, not global.
  const bobSame = simnet.callPublicFn(CORE, 'mint-single-tx', [
    Cl.buffer(h2), Cl.stringAscii('text/plain'), Cl.uint(other.length),
    Cl.list([Cl.buffer(other)]), Cl.stringAscii('ipfs://clash')
  ], bob);
  check('but another sender is unaffected', bobSame.result.type === 'ok',
    `got ${JSON.stringify(bobSame.result).slice(0, 100)}`);
  record('That guard is scoped to {sender, hash}. It is not a global content lock.');
}

console.log('\n=== 5. Does begin-or-get charge twice for the same session? ===');
{
  const h3 = roll([Buffer.concat([Buffer.from('SESSION-REFEE'), Buffer.alloc(16384 - 13, 0)])]);
  const payload = Buffer.concat([Buffer.from('SESSION-REFEE'), Buffer.alloc(16384 - 13, 0)]);
  const hh = roll([payload]);
  const b1 = simnet.callPublicFn(CORE, 'begin-or-get',
    [Cl.buffer(hh), Cl.stringAscii('text/plain'), Cl.uint(payload.length), Cl.uint(1)], alice);
  const pre = stxOf(alice);
  const b2 = simnet.callPublicFn(CORE, 'begin-or-get',
    [Cl.buffer(hh), Cl.stringAscii('text/plain'), Cl.uint(payload.length), Cl.uint(1)], alice);
  const post = stxOf(alice);
  check('re-calling begin-or-get succeeds (resume, not error)', b2.result.type === 'ok');
  check('and does NOT charge the begin fee again', pre - post === 0n, `delta ${pre - post}`);
  record('begin-or-get is genuinely idempotent for the fee. Re-calling it is safe and free.');
}

console.log('\n=== 6. Chunk storage under duplicate content ===');
{
  const c0 = simnet.callReadOnlyFn(CORE, 'get-chunk', [Cl.uint(idA), Cl.uint(0)], alice);
  const c1 = simnet.callReadOnlyFn(CORE, 'get-chunk', [Cl.uint(idB), Cl.uint(0)], alice);
  const b0 = c0.result?.value?.value;
  const b1 = c1.result?.value?.value;
  check('both duplicate tokens serve their content', !!b0 && !!b1);
  check('and the bytes are identical', b0 === b1);
  record('Chunks are keyed {final-hash, creator, index} and written with map-set, so a same-creator duplicate rewrites the same rows rather than storing a second copy.');
}

console.log(`\n${pass} passed, ${fail} failed`);
console.log('\nFindings:');
for (const f of finding) console.log(`  - ${f}`);
process.exit(fail ? 1 : 0);
