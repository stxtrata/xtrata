// xtrata-screen-v1: hardening after the third independent review (24 Oct 2026): a price cap on buying, buying and cancelling
// do not move the version the hall polls, paid runs are charged per block, and a mistaken admin hand-over can be cancelled.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Cl } from '@stacks/transactions';
import { boot, pp } from './helpers.mjs';

const S = (s) => Cl.stringAscii(s);
const U = (n) => Cl.uint(n);
const P = (a) => Cl.principal(a);
const err = (n) => `(err u${n})`;
const OK = '(ok true)';
const DAY = 144;

async function screen() {
  const { simnet, deployer, W } = await boot();
  const call = (fn, args = [], sender = deployer) => simnet.callPublicFn('xtrata-screen-v1', fn, args, sender);
  const ro = (fn, args = []) => simnet.callReadOnlyFn('xtrata-screen-v1', fn, args, deployer).result;
  const bal = (who) => simnet.getAssetsMap().get('STX').get(who) ?? 0n;
  const me = `${deployer}.xtrata-screen-v1`;
  const buy = (sender, o = {}) => call('buy-slot', [
    U(o.kind ?? 0), S(o.head ?? 'PAID'), S(''), U(0), Cl.buffer(new Uint8Array(0)), U(0), U(o.days ?? 1), U(0), U(o.max ?? 1000000000000),
  ], sender);
  const item = (id) => ro('get-item', [U(id)]).value.value;
  const idOf = (r) => Number(r.result.value.value);
  const paid = (id) => ro('get-paid-status', [U(id)]).value.value;
  // the contract never holds less than the escrow it owes; every item's escrow adds up to the total
  const solvent = () => {
    let sum = 0n;
    for (let i = 0; i < Number(ro('get-count').value); i++) sum += item(i).escrow.value;
    assert.equal(ro('get-escrow-total').value, sum);
    assert.ok(bal(me) >= sum);
  };
  call('set-slots-enabled', [Cl.bool(true)]);
  call('set-prices', [Cl.uint(2_000_000), Cl.uint(5_000_000), Cl.uint(10_000_000)]);  // this file's arithmetic uses 2/5/10 STX
  call('set-publisher', [P(W[1]), U(2)]);           // W1 reviews
  call('set-fee-recipient', [P(W[5])]);
  return { simnet, deployer, W, call, ro, bal, me, buy, item, idOf, paid, solvent };
}
const R = (r) => pp(r.result);



test('H1 the buyer states the most they will pay: a price rise between click and confirmation is refused, nothing is taken', async () => {
  const s = await screen();
  const { W } = s;
  const b0 = s.bal(W[0]);
  assert.equal(pp(s.buy(W[0], { days: 3, max: 6_000_000 }).result), '(ok u0)');          // exactly the price: fine
  assert.equal(b0 - s.bal(W[0]), 6_000_000n);
  assert.equal(pp(s.buy(W[0], { days: 3, max: 5_999_999 }).result), err(415));            // one uSTX under the price: refused
  s.call('set-prices', [U(900_000_000), U(900_000_000), U(900_000_000)]);                 // the admin raises the price after the buyer clicked
  const b1 = s.bal(W[2]);
  assert.equal(pp(s.buy(W[2], { days: 14, max: 28_000_000 }).result), err(415));
  assert.equal(s.bal(W[2]), b1);                                                          // nothing was taken
  assert.equal(pp(s.ro('get-count')), 'u1');
  s.solvent();
});

test('H2 buying, cancelling, rejecting and sweeping do not move the version the hall polls; approving and hiding do', async () => {
  const s = await screen();
  const { W, simnet } = s;
  const v = () => Number(s.ro('get-version').value);
  const v0 = v();
  const a = s.idOf(s.buy(W[0], { days: 1 }));
  const b = s.idOf(s.buy(W[2], { days: 1 }));
  s.call('cancel', [U(a)], W[0]);
  assert.equal(v(), v0, 'buy and cancel leave the version alone');
  s.call('reject', [U(b), U(1)], W[1]);
  assert.equal(v(), v0, 'reject leaves it alone');
  const c = s.idOf(s.buy(W[3], { days: 1 }));
  simnet.mineEmptyBurnBlocks(432 + 2);
  s.call('sweep', [U(c)], W[4]);
  assert.equal(v(), v0, 'sweep leaves it alone');
  const d = s.idOf(s.buy(W[0], { days: 1 }));
  s.call('approve', [U(d)], W[1]);
  assert.equal(v(), v0 + 1, 'approving changes what the hall paints');
  simnet.mineEmptyBurnBlocks(3);
  s.call('settle', [U(d)], W[4]);
  assert.equal(v(), v0 + 1, 'settling a running slot leaves it alone');
  s.call('set-hidden', [U(d), Cl.bool(true)], W[1]);
  assert.equal(v(), v0 + 2, 'hiding a live slot changes what the hall paints');
  s.solvent();
});

test('H3 paid runs are charged per block: earned + unearned always equals the price, nothing is lost or paid twice', async () => {
  const s = await screen();
  const { W, simnet } = s;
  const a = s.idOf(s.buy(W[0], { kind: 0, days: 7 }));
  assert.equal(s.item(a).price.value, 14_000_000n);
  s.call('approve', [U(a)], W[1]);
  const fee0 = s.bal(W[5]), buyer0 = s.bal(W[0]);
  // one block after approval: charged for one block of 1008, not a whole day
  simnet.mineEmptyBurnBlocks(1);
  const e1 = (14_000_000n * 1n) / 1008n;
  assert.equal(s.paid(a).unearned.value, 14_000_000n - e1);
  // ending the run now refunds everything except that one block
  s.call('set-hidden', [U(a), Cl.bool(true)], W[1]);
  assert.equal(s.bal(W[5]) - fee0, e1);
  assert.equal(s.bal(W[0]) - buyer0, 14_000_000n - e1);
  assert.equal(s.ro('get-escrow-total').value, 0n);
  // a second run, settled in several steps and then retired: the fee recipient is paid exactly the earned part in total
  const b = s.idOf(s.buy(W[0], { kind: 0, days: 3 }));
  s.call('approve', [U(b)], W[1]);
  const fee1 = s.bal(W[5]), buyer1 = s.bal(W[0]);
  let ran = 0;
  for (const step of [5, 17, 100, 3]) {
    simnet.mineEmptyBurnBlocks(step); ran += step;
    s.call('settle', [U(b)], W[4]);
    s.solvent();
  }
  s.call('retire', [U(b)], W[1]);
  const earned = (6_000_000n * BigInt(ran)) / 432n;
  assert.equal(s.bal(W[5]) - fee1, earned);
  assert.equal(s.bal(W[0]) - buyer1, 6_000_000n - earned);
  assert.equal(s.ro('get-escrow-total').value, 0n);
  // a run left to finish earns exactly the price
  const c = s.idOf(s.buy(W[0], { kind: 0, days: 2 }));
  s.call('approve', [U(c)], W[1]);
  const fee2 = s.bal(W[5]);
  simnet.mineEmptyBurnBlocks(2 * DAY + 10);
  assert.equal(pp(s.call('settle', [U(c)], W[4]).result), '(ok u0)');
  assert.equal(s.bal(W[5]) - fee2, 4_000_000n);
  s.solvent();
});

test('H4 a hand-over proposed by mistake can be cancelled; only the admin can cancel it', async () => {
  const s = await screen();
  const { W } = s;
  assert.equal(pp(s.call('cancel-admin-proposal').result), err(412));                     // nothing pending
  assert.equal(pp(s.call('propose-admin', [P(W[2])]).result), OK);
  assert.equal(pp(s.call('cancel-admin-proposal', [], W[2]).result), err(400));
  assert.equal(pp(s.call('cancel-admin-proposal').result), OK);
  assert.equal(pp(s.ro('get-config').value['pending-admin']), 'none');
  assert.equal(pp(s.call('accept-admin', [], W[2]).result), err(412));                    // the cancelled wallet cannot take over
});
