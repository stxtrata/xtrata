// Composability suite for the v3.2.4 core.
//
// The question this answers: can third parties build on this core without the
// core changing again? Each block is a shape someone would plausibly want to
// build, exercised through `mock-builder-v3.2.4`, which stands in for a
// third-party contract deployed on top.
//
// Failures here are not necessarily bugs. Some are limits worth knowing and
// documenting, so the notes say which is which.
import { initSimnet } from '@stacks/clarinet-sdk';
import { Cl } from '@stacks/transactions';
import { createHash } from 'node:crypto';

const simnet = await initSimnet('./v3.2.4/Clarinet.toml');
const a = simnet.getAccounts();
const deployer = a.get('deployer');
const alice = a.get('wallet_1');
const bob = a.get('wallet_2');
const carol = a.get('wallet_3');

const CORE = 'xtrata-v3-2-4';
const BUILDER = 'mock-builder';
const builderPrincipal = `${deployer}.${BUILDER}`;

const sha = (b) => createHash('sha256').update(b).digest();
const roll = (cs) => {
  let h = Buffer.alloc(32, 0);
  for (const c of cs) h = sha(Buffer.concat([h, c]));
  return h;
};

let n = 0;
let pass = 0;
let fail = 0;
const note = [];
const check = (name, cond, extra = '') => {
  n += 1;
  if (cond) { pass += 1; console.log(`  ok    ${name}`); }
  else { fail += 1; console.log(`  FAIL  ${name}  ${extra}`); }
};
const observe = (name, text) => { note.push(`${name}: ${text}`); console.log(`  note  ${name} -> ${text}`); };

simnet.callPublicFn(CORE, 'set-paused', [Cl.bool(false)], deployer);

let seq = 0;
const body = (tag) => {
  const b = Buffer.alloc(16384, 0);
  Buffer.from(`${tag}-${seq += 1}`).copy(b, 0);
  return b;
};
const args = (b, uri = 'ipfs://x') => [
  Cl.buffer(roll([b])), Cl.stringAscii('text/plain'), Cl.uint(b.length),
  Cl.list([Cl.buffer(b)]), Cl.stringAscii(uri)
];
const idOf = (r) => Number(r.result?.value?.value?.['token-id']?.value ?? -1);
const ownerOf = (id) => simnet.callReadOnlyFn(CORE, 'get-owner', [Cl.uint(id)], alice)
  .result?.value?.value?.value;
const creatorOf = (id) => simnet.callReadOnlyFn(CORE, 'get-inscription-creator', [Cl.uint(id)], alice)
  .result?.value?.value?.value ?? simnet.callReadOnlyFn(CORE, 'get-inscription-creator', [Cl.uint(id)], alice).result?.value?.value;

console.log('\n=== 1. Publisher pays, author owns (the DeOrganized shape) ===');
{
  const b = body('publish');
  const r = simnet.callPublicFn(BUILDER, 'publish-for', [Cl.principal(bob), ...args(b)], alice);
  check('a third-party contract can mint through the core', r.result.type === 'ok',
    JSON.stringify(r.result).slice(0, 200));
  const id = idOf(r);
  if (id >= 0) {
    check('the named author owns it, not the caller', ownerOf(id) === bob, `owner=${ownerOf(id)}`);
    check('the named author is recorded as creator', creatorOf(id) === bob, `creator=${creatorOf(id)}`);
  }
}

console.log('\n=== 2. Fully sponsored: the contract pays from its own balance ===');
{
  simnet.transferSTX(10_000_000, builderPrincipal, alice);
  const b = body('sponsor');
  const r = simnet.callPublicFn(BUILDER, 'sponsor-for', [Cl.principal(carol), ...args(b)], alice);
  check('contract can pay via as-contract while another principal owns',
    r.result.type === 'ok', JSON.stringify(r.result).slice(0, 200));
  const id = idOf(r);
  if (id >= 0) check('recipient owns it even though the contract paid', ownerOf(id) === carol, `owner=${ownerOf(id)}`);
}

console.log('\n=== 3. A contract can own inscriptions (vault, DAO, treasury) ===');
{
  const b = body('vault');
  const r = simnet.callPublicFn(BUILDER, 'mint-into-vault', [...args(b)], alice);
  check('mint to a contract principal succeeds', r.result.type === 'ok',
    JSON.stringify(r.result).slice(0, 200));
  const id = idOf(r);
  if (id >= 0) check('the contract itself is the owner', ownerOf(id) === builderPrincipal, `owner=${ownerOf(id)}`);
}

console.log('\n=== 4. Marketplace custody round-trip ===');
{
  const b = body('market');
  const m = simnet.callPublicFn(CORE, 'mint-single-tx', args(b), alice);
  const id = idOf(m);
  const pull = simnet.callPublicFn(CORE, 'transfer',
    [Cl.uint(id), Cl.principal(alice), Cl.principal(builderPrincipal)], bob);
  check('a market CANNOT pull a token it was not given (no operator approval)',
    pull.result.type === 'err', JSON.stringify(pull.result).slice(0, 120));
  observe('operator pattern', 'absent by design. transfer asserts tx-sender == sender, so sellers must escrow first');

  const escrow = simnet.callPublicFn(CORE, 'transfer',
    [Cl.uint(id), Cl.principal(alice), Cl.principal(builderPrincipal)], alice);
  check('seller can escrow into the market contract', escrow.result.type === 'ok');
  const release = simnet.callPublicFn(BUILDER, 'release-to', [Cl.uint(id), Cl.principal(bob)], bob);
  check('market can release from its own custody to a buyer', release.result.type === 'ok',
    JSON.stringify(release.result).slice(0, 160));
  if (release.result.type === 'ok') check('buyer owns it', ownerOf(id) === bob, `owner=${ownerOf(id)}`);
}

console.log('\n=== 5. Parent links: the lineage-pollution guard ===');
{
  // bob is the artist. His album parent is the thing that must stay clean.
  const album = idOf(simnet.callPublicFn(CORE, 'mint-single-tx', args(body('album')), bob));

  const mine = simnet.callPublicFn(CORE, 'mint-single-tx-with-relationships',
    [...args(body('own-track')), Cl.list([]), Cl.list([Cl.uint(album)])], bob);
  check('the album owner can add his own tracks', mine.result.type === 'ok',
    JSON.stringify(mine.result).slice(0, 160));

  // The attack: a stranger tries to hang junk off bob's album, gifting it to bob
  // so it lands inside his structure.
  const junk = simnet.callPublicFn(CORE, 'mint-single-tx-with-relationships-to',
    [Cl.principal(bob), ...args(body('junk')), Cl.list([]), Cl.list([Cl.uint(album)])], carol);
  check('a stranger CANNOT hang junk off someone else\'s album', junk.result.type === 'err',
    JSON.stringify(junk.result).slice(0, 120));

  // And cannot do it for themselves either.
  const steal = simnet.callPublicFn(CORE, 'mint-single-tx-with-relationships-to',
    [Cl.principal(carol), ...args(body('steal')), Cl.list([]), Cl.list([Cl.uint(album)])], carol);
  check('a stranger cannot claim descent from it for themselves', steal.result.type === 'err');

  console.log('  -- now bob opts alice in, once --');
  const grant = simnet.callPublicFn(CORE, 'set-parent-delegate',
    [Cl.principal(alice), Cl.bool(true)], bob);
  check('an owner can delegate, and it is not an admin call', grant.result.type === 'ok',
    JSON.stringify(grant.result).slice(0, 160));
  const delegated = (owner, delegate) => simnet.callReadOnlyFn(CORE, 'is-parent-delegate',
    [Cl.principal(owner), Cl.principal(delegate)], alice).result?.value?.type === 'true';
  check('the delegation is readable on chain', delegated(bob, alice));
  check('and it is specific, not a blanket opt-in', !delegated(bob, carol));

  const sponsored = simnet.callPublicFn(CORE, 'mint-single-tx-with-relationships-to',
    [Cl.principal(bob), ...args(body('sponsored-track')), Cl.list([]), Cl.list([Cl.uint(album)])], alice);
  check('the delegate can now attach a child, minting it TO bob',
    sponsored.result.type === 'ok', JSON.stringify(sponsored.result).slice(0, 160));

  const keep = simnet.callPublicFn(CORE, 'mint-single-tx-with-relationships-to',
    [Cl.principal(alice), ...args(body('delegate-keeps')), Cl.list([]), Cl.list([Cl.uint(album)])], alice);
  check('but the delegate CANNOT keep the child for herself', keep.result.type === 'err',
    JSON.stringify(keep.result).slice(0, 120));

  const stillBlocked = simnet.callPublicFn(CORE, 'mint-single-tx-with-relationships-to',
    [Cl.principal(bob), ...args(body('carol-still-out')), Cl.list([]), Cl.list([Cl.uint(album)])], carol);
  check('delegating to alice does not let carol in', stillBlocked.result.type === 'err');

  console.log('  -- bob revokes --');
  simnet.callPublicFn(CORE, 'set-parent-delegate', [Cl.principal(alice), Cl.bool(false)], bob);
  const revoked = simnet.callPublicFn(CORE, 'mint-single-tx-with-relationships-to',
    [Cl.principal(bob), ...args(body('after-revoke')), Cl.list([]), Cl.list([Cl.uint(album)])], alice);
  check('revocation takes effect immediately', revoked.result.type === 'err',
    JSON.stringify(revoked.result).slice(0, 120));

  // The publisher-owned-manifest case must keep working untouched.
  const vol = idOf(simnet.callPublicFn(CORE, 'mint-single-tx', args(body('volume')), alice));
  const gifted = simnet.callPublicFn(CORE, 'mint-single-tx-with-relationships-to',
    [Cl.principal(bob), ...args(body('in-volume')), Cl.list([]), Cl.list([Cl.uint(vol)])], alice);
  check('a publisher can still gift a child of their OWN manifest', gifted.result.type === 'ok',
    JSON.stringify(gifted.result).slice(0, 160));

  observe('lineage safety',
    'default is unchanged: only the owner can add children. A delegation is opt-in, one call, revocable, and can only produce children that mint to the owner');
}

console.log('\n=== 6. Paused core: can an allowlisted contract keep working? ===');
{
  simnet.callPublicFn(CORE, 'set-paused', [Cl.bool(true)], deployer);
  const b1 = body('paused-direct');
  const direct = simnet.callPublicFn(CORE, 'mint-single-tx', args(b1), alice);
  check('a normal wallet is blocked while paused', direct.result.type === 'err',
    JSON.stringify(direct.result).slice(0, 120));

  simnet.callPublicFn(CORE, 'set-allowed-caller',
    [Cl.principal(builderPrincipal), Cl.bool(true)], deployer);
  const b2 = body('paused-builder');
  const viaBuilder = simnet.callPublicFn(BUILDER, 'publish-for', [Cl.principal(bob), ...args(b2)], alice);
  check('an allowlisted third-party contract still works while paused',
    viaBuilder.result.type === 'ok', JSON.stringify(viaBuilder.result).slice(0, 160));
  observe('allowlist granularity',
    'keyed on contract-caller, so a builder contract can be allowlisted directly. Good: pause becomes a per-integration switch');

  // Mint to alice while unpaused, then pause, then move it. The core states
  // transfers are deliberately not gated by pause. Verify that on a token she
  // actually owns, or the result is just ERR-NOT-AUTHORIZED and proves nothing.
  simnet.callPublicFn(CORE, 'set-paused', [Cl.bool(false)], deployer);
  const owned = idOf(simnet.callPublicFn(CORE, 'mint-single-tx', args(body('paused-xfer')), alice));
  simnet.callPublicFn(CORE, 'set-paused', [Cl.bool(true)], deployer);
  const t = simnet.callPublicFn(CORE, 'transfer',
    [Cl.uint(owned), Cl.principal(alice), Cl.principal(bob)], alice);
  check('an owner can still transfer while the core is paused', t.result.type === 'ok',
    JSON.stringify(t.result).slice(0, 120));
  observe('pause scope',
    'pause stops new inscriptions, never transfers. Existing holders keep control even if minting is halted');
  simnet.callPublicFn(CORE, 'set-paused', [Cl.bool(false)], deployer);
}

console.log('\n=== 7. On-chain read composability ===');
{
  const b = body('read');
  const m = simnet.callPublicFn(CORE, 'mint-single-tx', args(b), alice);
  const id = idOf(m);
  const peek = simnet.callReadOnlyFn(BUILDER, 'peek-chunk', [Cl.uint(id), Cl.uint(0)], alice);
  const got = peek.result?.value?.value;
  check('a contract can read inscription bytes back on chain', got !== undefined && got !== null,
    JSON.stringify(peek.result).slice(0, 120));
  if (got) check('bytes match', Buffer.from(got, 'hex').equals(b));
  observe('on-chain rendering',
    'a builder contract can read stored content, so composition and derivation can happen on chain');
}

console.log('\n=== 8. SIP-009 surface a marketplace needs ===');
{
  for (const fn of ['get-last-token-id', 'get-token-uri', 'get-owner']) {
    const callArgs = fn === 'get-last-token-id' ? [] : [Cl.uint(0)];
    const r = simnet.callReadOnlyFn(CORE, fn, callArgs, alice);
    check(`${fn} responds`, r.result !== undefined && r.result.type !== 'err');
  }
}

console.log(`\n${pass}/${n} passed, ${fail} failed`);
console.log('\nNotes for the design record:');
for (const t of note) console.log(`  - ${t}`);
process.exit(fail ? 1 : 0);
