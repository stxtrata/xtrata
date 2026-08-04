// Deployment order matters, and getting it wrong is unrecoverable.
//
// v3.2.4 mints migrated tokens at the SAME id they had on v3.2.3. Its next-id
// starts at 0. So a new inscription minted before next-id is raised will occupy
// an id that a legacy token needs, and that legacy token can then never be
// migrated: ids are unique and set-next-id refuses to run once anything has been
// minted.
//
// This pins the safe order and demonstrates the hazard, so neither can be
// forgotten.
import { initSimnet } from '@stacks/clarinet-sdk';
import { Cl } from '@stacks/transactions';
import { createHash } from 'node:crypto';

const OLD = 'xtrata-v3-2-3';
const NEW = 'xtrata-v3-2-4';
const ERR_DUPLICATE = 114;
const ERR_ALREADY_SET = 115;

let pass = 0;
let fail = 0;
const check = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  ok    ${name}`); }
  else { fail += 1; console.log(`  FAIL  ${name}  ${extra}`); }
};

const sha = (b) => createHash('sha256').update(b).digest();
const roll = (cs) => {
  let h = Buffer.alloc(32, 0);
  for (const c of cs) h = sha(Buffer.concat([h, c]));
  return h;
};
const payload = (tag) => { const b = Buffer.alloc(16384, 0); Buffer.from(tag).copy(b, 0); return b; };

// Each scenario needs a clean chain, because set-next-id is one-shot.
const fresh = async () => {
  const s = await initSimnet('./v3.2.4/Clarinet.toml');
  const a = s.getAccounts();
  s.callPublicFn(OLD, 'set-paused', [Cl.bool(false)], a.get('deployer'));
  s.callPublicFn(NEW, 'set-paused', [Cl.bool(false)], a.get('deployer'));
  return { s, deployer: a.get('deployer'), alice: a.get('wallet_1') };
};
const mint = (s, core, tag, who) => {
  const b = payload(tag);
  return s.callPublicFn(core, 'mint-single-tx', [
    Cl.buffer(roll([b])), Cl.stringAscii('text/plain'), Cl.uint(b.length),
    Cl.list([Cl.buffer(b)]), Cl.stringAscii('ipfs://x')
  ], who);
};
const tokenId = (r) => Number(r.result?.value?.value?.['token-id']?.value ?? -1);
const errCode = (r) => Number(r.result?.value?.value ?? -1);

console.log('\n=== 1. THE HAZARD: minting before raising next-id strands a legacy token ===');
{
  const { s, alice } = await fresh();
  const legacy = tokenId(mint(s, OLD, 'legacy-zero', alice));
  check('v3.2.3 holds token 0', legacy === 0, `got ${legacy}`);

  const taken = tokenId(mint(s, NEW, 'new-work', alice));
  check('a new v3.2.4 mint takes the same id', taken === legacy, `got ${taken}`);

  const mig = s.callPublicFn(NEW, 'migrate-from-v3-2-3', [Cl.uint(legacy)], alice);
  check('migrating that legacy token now FAILS', mig.result.type === 'err');
  check(`with ERR-DUPLICATE (u${ERR_DUPLICATE})`, errCode(mig) === ERR_DUPLICATE, `got u${errCode(mig)}`);

  const late = s.callPublicFn(NEW, 'set-next-id', [Cl.uint(9000)], s.getAccounts().get('deployer'));
  check('and set-next-id can no longer rescue it', late.result.type === 'err');
  check(`because it is one-shot, pre-mint only (u${ERR_ALREADY_SET})`,
    errCode(late) === ERR_ALREADY_SET, `got u${errCode(late)}`);
}

console.log('\n=== 2. THE SAFE ORDER: set-next-id above the v3.2.3 ceiling, then mint ===');
{
  const { s, deployer, alice } = await fresh();
  const legacy = tokenId(mint(s, OLD, 'legacy-zero', alice));

  // Deploy step: raise next-id past everything v3.2.3 will ever hold.
  const set = s.callPublicFn(NEW, 'set-next-id', [Cl.uint(9000)], deployer);
  check('set-next-id succeeds before any mint', set.result.type === 'ok',
    JSON.stringify(set.result).slice(0, 120));

  const fresh1 = tokenId(mint(s, NEW, 'new-work', alice));
  check('new mints now start above the legacy range', fresh1 >= 9000, `got ${fresh1}`);

  const mig = s.callPublicFn(NEW, 'migrate-from-v3-2-3', [Cl.uint(legacy)], alice);
  check('and the legacy token migrates cleanly at its original id',
    mig.result.type === 'ok', JSON.stringify(mig.result).slice(0, 160));

  const owner = s.callReadOnlyFn(NEW, 'get-owner', [Cl.uint(legacy)], alice);
  check('it is owned on the new contract', owner.result?.value?.value?.value === alice);

  const chunk = s.callReadOnlyFn(NEW, 'get-chunk', [Cl.uint(legacy), Cl.uint(0)], alice);
  check('and its content reads back', !!chunk.result?.value?.value);
}

console.log('\n=== 3. set-next-id stays one-shot ===');
{
  const { s, deployer } = await fresh();
  check('first call ok', s.callPublicFn(NEW, 'set-next-id', [Cl.uint(9000)], deployer).result.type === 'ok');
  const again = s.callPublicFn(NEW, 'set-next-id', [Cl.uint(20000)], deployer);
  check('second call rejected', again.result.type === 'err');
  check(`with ERR-ALREADY-SET (u${ERR_ALREADY_SET})`, errCode(again) === ERR_ALREADY_SET, `got u${errCode(again)}`);
}

console.log('\n=== 4. Fee defaults match live mainnet, so no admin tx is needed at deploy ===');
{
  const { s, alice } = await fresh();
  const LIVE = {
    'get-begin-fee-unit': 100000,
    'get-upload-chunk-fee-unit': 1000,
    'get-upload-batch-fee-unit': 100000,
    'get-seal-fee-unit': 100000,
    'get-single-tx-fee-unit': 10000
  };
  for (const [fn, want] of Object.entries(LIVE)) {
    const got = Number(s.callReadOnlyFn(NEW, fn, [], alice).result?.value?.value ?? -1);
    check(`${fn} = ${want}`, got === want, `got ${got}`);
  }
  const q = s.callReadOnlyFn(NEW, 'quote-single-tx-fee', [Cl.uint(16384), Cl.uint(1)], alice);
  const total = Number(q.result?.value?.value?.['total-fee']?.value ?? -1);
  check('a one-chunk article quotes 11000, same as mainnet today', total === 11000, `got ${total}`);
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
