// xtrata-screen-v1: roles, posting, caps, the review lane, expiry, pictures, paid slots with escrow.
// Every test boots its own simnet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Cl } from '@stacks/transactions';
import { boot, pp, hash32, mockInscription } from './helpers.mjs';

const S = (s) => Cl.stringAscii(s);
const U = (n) => Cl.uint(n);
const P = (a) => Cl.principal(a);
const ok = (v) => `(ok ${v})`;
const err = (n) => `(err u${n})`;
const OK = '(ok true)';
const NONE = { id: 0, hash: new Uint8Array(0), size: 0 };

async function screen() {
  const { simnet, deployer, W } = await boot();
  const call = (fn, args = [], sender = deployer) => simnet.callPublicFn('xtrata-screen-v1', fn, args, sender);
  const ro = (fn, args = []) => simnet.callReadOnlyFn('xtrata-screen-v1', fn, args, deployer).result;
  const bal = (who) => simnet.getAssetsMap().get('STX').get(who) ?? 0n;
  const me = `${deployer}.xtrata-screen-v1`;
  const h = () => simnet.burnBlockHeight;
  const post = (sender, o = {}) => call('post-item', [
    U(o.kind ?? 0), S(o.head ?? 'HELLO'), S(o.body ?? ''), U((o.img ?? NONE).id), Cl.buffer((o.img ?? NONE).hash), U((o.img ?? NONE).size),
    U(o.weight ?? 1), U(o.from ?? 0), U(o.to ?? h() + 100), U(o.layout ?? 0),
  ], sender);
  const buy = (sender, o = {}) => call('buy-slot', [
    U(o.kind ?? 0), S(o.head ?? 'PAID'), S(o.body ?? ''), U((o.img ?? NONE).id), Cl.buffer((o.img ?? NONE).hash), U((o.img ?? NONE).size), U(o.days ?? 1), U(o.layout ?? 0),
  ], sender);
  const live = () => ro('get-live').value.map((x) => Number(x.value));
  const item = (id) => ro('get-item', [U(id)]).value.value;
  const idOf = (r) => Number(r.result.value.value);
  return { simnet, deployer, W, call, ro, bal, me, h, post, buy, live, item, idOf };
}
const R = (r) => pp(r.result);

// Findings from the independent review of xtrata-screen-v1 (see claude/xtrata-world-v2-build-notes.md for the list).

test('R1: STX sent straight to the contract is not escrow; it is reported as unaccounted and nothing can take it out', async () => {
  const s = await screen();
  const { simnet, W } = s;
  s.call('set-slots-enabled', [Cl.bool(true)]);
  s.call('set-prices', [Cl.uint(2_000_000), Cl.uint(5_000_000), Cl.uint(10_000_000)]);  // these tests' arithmetic uses 2/5/10 STX
  simnet.transferSTX(5_000_000n, s.me, W[0]);
  assert.equal(s.ro('get-escrow-total').value, 0n);
  assert.equal(s.ro('get-unaccounted').value, 5_000_000n);
  const id = s.idOf(s.buy(W[1], { days: 2 }));
  assert.equal(s.ro('get-escrow-total').value, 4_000_000n);
  assert.equal(s.ro('get-unaccounted').value, 5_000_000n);
  s.call('cancel', [U(id)], W[1]);
  assert.equal(s.ro('get-escrow-total').value, 0n);
  // settling releases only the item's escrow, never the gift (approving releases nothing: the run is earned day by day)
  const id2 = s.idOf(s.buy(W[1], { days: 1 }));
  const fee = s.bal(s.deployer);
  assert.equal(R(s.call('approve', [U(id2)])), OK);
  assert.equal(s.bal(s.deployer), fee);
  simnet.mineEmptyBurnBlocks(1);
  assert.equal(R(s.call('settle', [U(id2)], W[3])), '(ok u0)');
  assert.equal(s.bal(s.deployer) - fee, 2_000_000n);
  assert.equal(s.ro('get-unaccounted').value, 5_000_000n);
  assert.equal(s.bal(s.me), 5_000_000n);
});

test('R2: the fee recipient cannot be the contract itself', async () => {
  const s = await screen();
  assert.equal(R(s.call('set-fee-recipient', [P(s.me)])), err(403));
  assert.equal(R(s.call('set-fee-recipient', [P(s.W[2])])), OK);
});

test('R4: unhiding while paused is refused; hiding while paused is allowed', async () => {
  const s = await screen();
  const a = s.idOf(s.post(s.deployer));
  assert.equal(R(s.call('set-hidden', [U(a), Cl.bool(true)])), OK);
  s.call('set-paused', [Cl.bool(true)]);
  assert.equal(R(s.call('set-hidden', [U(a), Cl.bool(false)])), err(401));
  s.call('set-paused', [Cl.bool(false)]);
  const b = s.idOf(s.post(s.deployer));
  s.call('set-paused', [Cl.bool(true)]);
  assert.equal(R(s.call('set-hidden', [U(b), Cl.bool(true)])), OK);   // hide still works
  s.call('set-paused', [Cl.bool(false)]);
  assert.equal(R(s.call('set-hidden', [U(a), Cl.bool(false)])), OK);
  assert.ok(s.live().includes(a));
});

test('R5: a slot cannot be bought when the kind cap or the paid-live cap is already full', async () => {
  const s = await screen();
  const { deployer, W } = s;
  s.call('set-slots-enabled', [Cl.bool(true)]);
  s.call('set-prices', [Cl.uint(2_000_000), Cl.uint(5_000_000), Cl.uint(10_000_000)]);  // these tests' arithmetic uses 2/5/10 STX
  s.call('set-caps', [U(8), U(8), U(2), U(8)]);                  // two ads at most
  s.post(deployer, { kind: 2, head: 'A1' });
  s.post(deployer, { kind: 2, head: 'A2' });
  const b0 = s.bal(W[0]);
  assert.equal(R(s.buy(W[0], { kind: 2 })), err(406));           // refused before any money moves
  assert.equal(s.bal(W[0]), b0);
  assert.equal(s.ro('get-escrow-total').value, 0n);
  assert.equal(R(s.buy(W[0], { kind: 0 })).startsWith('(ok u'), true);   // another kind still has room
  // paid-live cap: one paid item at a time
  s.call('set-limits', [U(1), U(14), U(1), U(4), U(432)]);
  const p = s.idOf(s.buy(W[1], { kind: 1 }));
  assert.equal(R(s.call('approve', [U(p)])), OK);
  assert.equal(R(s.buy(W[2], { kind: 1 })), err(406));
});

test('R5b: a bought slot does not use up the buyer\'s free-post cap as a publisher', async () => {
  const s = await screen();
  const { deployer, W } = s;
  s.call('set-slots-enabled', [Cl.bool(true)]);
  s.call('set-prices', [Cl.uint(2_000_000), Cl.uint(5_000_000), Cl.uint(10_000_000)]);  // these tests' arithmetic uses 2/5/10 STX
  s.call('set-publisher', [P(W[0]), U(1)]);
  s.call('set-caps', [U(8), U(8), U(8), U(1)]);                  // one live free item per publisher
  const p = s.idOf(s.buy(W[0], { kind: 1 }));
  assert.equal(R(s.call('approve', [U(p)])), OK);
  assert.equal(R(s.post(W[0], { head: 'FREE' })).startsWith('(ok u'), true);   // still allowed
  assert.equal(R(s.post(W[0], { head: 'FREE2' })), err(406));    // the free cap itself still holds
  void deployer;
});

test('R6: an absurd number of days is a window error, not an overflow', async () => {
  const s = await screen();
  s.call('set-slots-enabled', [Cl.bool(true)]);
  s.call('set-prices', [Cl.uint(2_000_000), Cl.uint(5_000_000), Cl.uint(10_000_000)]);  // these tests' arithmetic uses 2/5/10 STX
  assert.equal(R(s.buy(s.W[0], { days: 2n ** 100n })), err(404));
});

test('R7: prune-live only moves the version when it dropped something', async () => {
  const s = await screen();
  const { deployer, simnet } = s;
  s.post(deployer, { to: s.h() + 5 });
  const v0 = s.ro('get-version').value;
  s.call('prune-live', [], s.W[3]);
  assert.equal(s.ro('get-version').value, v0);                   // nothing to drop: no bump
  simnet.mineEmptyBurnBlocks(6);
  assert.equal(R(s.call('prune-live', [], s.W[3])), '(ok u0)');
  assert.equal(s.ro('get-version').value > v0, true);
});
