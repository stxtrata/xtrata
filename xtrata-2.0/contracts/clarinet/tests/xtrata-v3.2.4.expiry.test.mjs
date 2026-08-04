// Upload expiry must track the burn chain, not the Stacks chain.
//
// The constant is 4320 and has always been documented as "~30 days". That was
// true when one Stacks block meant one Bitcoin block. Post-Nakamoto,
// stacks-block-height advances every ~12s, which silently turned the window
// into about 15 hours. Pegging to burn-block-height restores the stated meaning
// and stops it drifting again.
//
// The load-bearing assertion is the first one: a session must survive a large
// number of Stacks blocks. If anything still reads stacks-block-height, that
// fails.
import { initSimnet } from '@stacks/clarinet-sdk';
import { Cl } from '@stacks/transactions';
import { createHash } from 'node:crypto';

const simnet = await initSimnet('./v3.2.4/Clarinet.toml');
const a = simnet.getAccounts();
const deployer = a.get('deployer');
const alice = a.get('wallet_1');

const CORE = 'xtrata-v3-2-4';
const EXPIRY = 4320;
const ERR_EXPIRED = 112;

let pass = 0;
let fail = 0;
const check = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  ok    ${name}`); }
  else { fail += 1; console.log(`  FAIL  ${name}  ${extra}`); }
};

simnet.callPublicFn(CORE, 'set-paused', [Cl.bool(false)], deployer);

const sha = (b) => createHash('sha256').update(b).digest();
const roll = (cs) => {
  let h = Buffer.alloc(32, 0);
  for (const c of cs) h = sha(Buffer.concat([h, c]));
  return h;
};

let seq = 0;
const startUpload = () => {
  const chunk = Buffer.alloc(16384, 0);
  Buffer.from(`expiry-probe-${seq += 1}`).copy(chunk, 0);
  const hash = roll([chunk]);
  const r = simnet.callPublicFn(CORE, 'begin-or-get', [
    Cl.buffer(hash), Cl.stringAscii('text/plain'), Cl.uint(chunk.length), Cl.uint(1)
  ], alice);
  if (r.result.type !== 'ok') throw new Error(`begin failed: ${JSON.stringify(r.result)}`);
  return { hash, chunk };
};
const addChunk = ({ hash, chunk }) =>
  simnet.callPublicFn(CORE, 'add-chunk-batch', [Cl.buffer(hash), Cl.list([Cl.buffer(chunk)])], alice);
const errCode = (r) => Number(r.result?.value?.value ?? -1);

console.log(`\nstart: stacks=${simnet.stacksBlockHeight} burn=${simnet.burnBlockHeight}`);

console.log('\n=== 1. Stacks blocks alone must NOT expire a session ===');
{
  const up = startUpload();
  // Well past the old 4320 stacks-block window. Under the previous clock this
  // session would be long dead.
  simnet.mineEmptyStacksBlocks(EXPIRY + 500);
  console.log(`  after mining: stacks=${simnet.stacksBlockHeight} burn=${simnet.burnBlockHeight}`);
  const r = addChunk(up);
  check(`session survives ${EXPIRY + 500} Stacks blocks`, r.result.type === 'ok',
    `got ${JSON.stringify(r.result).slice(0, 120)}`);
}

console.log('\n=== 2. Burn blocks DO expire a session ===');
{
  const up = startUpload();
  const before = simnet.burnBlockHeight;
  simnet.mineEmptyBurnBlocks(EXPIRY + 1);
  console.log(`  burn ${before} -> ${simnet.burnBlockHeight}`);
  const r = addChunk(up);
  check('add-chunk-batch rejects after the burn window', r.result.type === 'err');
  check(`and the code is ERR-EXPIRED (u${ERR_EXPIRED})`, errCode(r) === ERR_EXPIRED,
    `got u${errCode(r)}`);
}

console.log('\n=== 3. Just inside the window still works ===');
{
  const up = startUpload();
  simnet.mineEmptyBurnBlocks(EXPIRY - 2);
  const r = addChunk(up);
  check(`alive at ${EXPIRY - 2} burn blocks`, r.result.type === 'ok',
    `got ${JSON.stringify(r.result).slice(0, 120)}`);
}

console.log('\n=== 4. The window is rolling, not a deadline from begin ===');
{
  const up = startUpload();
  // Three quarters of the window, touch, then three quarters again. Total elapsed
  // is 1.5x the window, but no single gap exceeds it.
  simnet.mineEmptyBurnBlocks(Math.floor(EXPIRY * 0.75));
  const mid = addChunk(up);
  check('touch part way through succeeds', mid.result.type === 'ok');
  simnet.mineEmptyBurnBlocks(Math.floor(EXPIRY * 0.75));
  const state = simnet.callReadOnlyFn(CORE, 'get-upload-state',
    [Cl.buffer(up.hash), Cl.principal(alice)], alice);
  check('session still present after 1.5x the window of total elapsed time',
    state.result?.type === 'some' || state.result?.value !== undefined,
    JSON.stringify(state.result).slice(0, 120));
}

console.log('\n=== 5. An expired session cannot be resumed either ===');
{
  const up = startUpload();
  simnet.mineEmptyBurnBlocks(EXPIRY + 1);
  const r = simnet.callPublicFn(CORE, 'begin-or-get', [
    Cl.buffer(up.hash), Cl.stringAscii('text/plain'), Cl.uint(up.chunk.length), Cl.uint(1)
  ], alice);
  check('begin-or-get also rejects an expired session', r.result.type === 'err');
  check(`with ERR-EXPIRED (u${ERR_EXPIRED})`, errCode(r) === ERR_EXPIRED, `got u${errCode(r)}`);
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
