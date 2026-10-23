// xtrata-screen-v1: regression tests for the second independent review (L9, 23 Oct 2026): the review window is
// fixed per item at purchase, and a paid run that a reviewer ends early refunds the unused days.
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
    U(o.kind ?? 0), S(o.head ?? 'PAID'), S(''), U(0), Cl.buffer(new Uint8Array(0)), U(0), U(o.days ?? 1),
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
  call('set-publisher', [P(W[1]), U(2)]);           // W1 reviews
  call('set-fee-recipient', [P(W[5])]);
  return { simnet, deployer, W, call, ro, bal, me, buy, item, idOf, paid, solvent };
}
const R = (r) => pp(r.result);

test('L9 the review window is fixed when a slot is bought: set-limits later neither delays the refund nor cuts it short', async () => {
  const s = await screen();
  const { W, simnet } = s;
  const a = s.idOf(s.buy(W[0]));                            // window 432 at purchase
  const bought = simnet.burnBlockHeight;
  assert.equal(s.paid(a).deadline.value, BigInt(bought + 432));
  assert.equal(R(s.call('set-limits', [U(1), U(14), U(8), U(2), U(4320)])), OK);   // the admin widens the window
  assert.equal(s.paid(a).deadline.value, BigInt(bought + 432));
  simnet.mineEmptyBurnBlocks(433);
  assert.equal(R(s.call('approve', [U(a)], W[1])), err(404));      // too late, as when it was bought
  const b0 = s.bal(W[0]);
  assert.equal(R(s.call('sweep', [U(a)], W[3])), OK);              // and the buyer gets the money back on time
  assert.equal(s.bal(W[0]), b0 + 2_000_000n);
  // narrowing the window later does not shorten a pending buyer's wait either
  const b = s.idOf(s.buy(W[0]));
  assert.equal(R(s.call('set-limits', [U(1), U(14), U(8), U(2), U(144)])), OK);
  simnet.mineEmptyBurnBlocks(200);
  assert.equal(R(s.call('sweep', [U(b)], W[3])), err(410));
  assert.equal(R(s.call('approve', [U(b)], W[1])), OK);
  s.solvent();
});

test('L9 hiding a paid item during its run refunds the unused days and ends the run; it cannot be unhidden', async () => {
  const s = await screen();
  const { W, simnet } = s;
  const a = s.idOf(s.buy(W[0], { days: 3 }));               // 3 days of message: 6 STX
  assert.equal(R(s.call('approve', [U(a)], W[1])), OK);
  simnet.mineEmptyBurnBlocks(DAY + 1);                       // day 2 has started: 2 days used, 1 unused
  assert.equal(s.paid(a).unearned.value, 2_000_000n);
  const b0 = s.bal(W[0]), r0 = s.bal(W[5]);
  assert.equal(R(s.call('set-hidden', [U(a), Cl.bool(true)], W[1])), OK);
  assert.equal(s.bal(W[0]), b0 + 2_000_000n);
  assert.equal(s.bal(W[5]), r0 + 4_000_000n);
  const it = s.item(a);
  assert.equal(it.status.value, 2n);
  assert.equal(it['closed-reason'].value, 5n);
  assert.equal(it.hidden.type, 'true');
  assert.equal(it.escrow.value, 0n);
  assert.equal(R(s.call('set-hidden', [U(a), Cl.bool(false)], W[1])), err(409));
  assert.equal(R(s.call('settle', [U(a)], W[3])), err(409));
  assert.deepEqual(s.ro('get-live').value, []);
  assert.equal(s.ro('get-escrow-total').value, 0n);
  s.solvent();
});

test('L9 a run ended in the block it was approved refunds everything; a run already over pays the recipient everything', async () => {
  const s = await screen();
  const { W, simnet } = s;
  const a = s.idOf(s.buy(W[0], { kind: 2, days: 2 }));      // 20 STX
  const b0 = s.bal(W[0]), r0 = s.bal(W[5]);
  assert.equal(R(s.call('approve', [U(a)], W[1])), OK);
  assert.equal(R(s.call('set-hidden', [U(a), Cl.bool(true)])), OK);  // the admin, same burn block: it never ran
  assert.equal(s.bal(W[0]), b0 + 20_000_000n);
  assert.equal(s.bal(W[5]), r0);
  // retire after the run: nothing is unused
  const b = s.idOf(s.buy(W[0], { days: 2 }));
  assert.equal(R(s.call('approve', [U(b)], W[1])), OK);
  simnet.mineEmptyBurnBlocks(2 * DAY + 5);
  const b1 = s.bal(W[0]);
  assert.equal(R(s.call('retire', [U(b)], W[1])), OK);
  assert.equal(s.bal(W[0]), b1);
  assert.equal(s.bal(W[5]), r0 + 4_000_000n);
  assert.equal(s.item(b)['closed-reason'].value, 4n);
  s.solvent();
});

test('L9 retiring a paid item mid-run refunds pro rata, after a partial settle, without paying anything twice', async () => {
  const s = await screen();
  const { W, simnet } = s;
  const a = s.idOf(s.buy(W[0], { kind: 1, days: 5 }));      // 5 days of news: 25 STX
  assert.equal(R(s.call('approve', [U(a)], W[1])), OK);
  simnet.mineEmptyBurnBlocks(1);
  const r0 = s.bal(W[5]), b0 = s.bal(W[0]);
  assert.equal(R(s.call('settle', [U(a)], W[3])), '(ok u20000000)');   // day 1 earned
  assert.equal(s.bal(W[5]), r0 + 5_000_000n);
  simnet.mineEmptyBurnBlocks(2 * DAY);                                  // now in day 3: 3 used, 2 unused
  assert.equal(R(s.call('retire', [U(a)], W[1])), OK);
  assert.equal(s.bal(W[5]), r0 + 15_000_000n);
  assert.equal(s.bal(W[0]), b0 + 10_000_000n);
  assert.equal(s.item(a).escrow.value, 0n);
  assert.equal(R(s.call('retire', [U(a)], W[1])), err(409));
  // a publisher (level 1) cannot retire a paid item, and neither can the buyer
  s.call('set-publisher', [P(W[2]), U(1)]);
  const b = s.idOf(s.buy(W[0]));
  s.call('approve', [U(b)], W[1]);
  assert.equal(R(s.call('retire', [U(b)], W[2])), err(400));
  assert.equal(R(s.call('retire', [U(b)], W[0])), err(400));
  s.solvent();
});

test('L9 a gift sent to the contract is never paid out by settling or refunding', async () => {
  const s = await screen();
  const { W, simnet } = s;
  simnet.transferSTX(3_000_000n, s.me, W[4]);
  const a = s.idOf(s.buy(W[0], { days: 2 }));
  s.call('approve', [U(a)], W[1]);
  simnet.mineEmptyBurnBlocks(DAY + 1);
  s.call('set-hidden', [U(a), Cl.bool(true)], W[1]);
  assert.equal(s.ro('get-escrow-total').value, 0n);
  assert.equal(s.bal(s.me), 3_000_000n);
  assert.equal(s.ro('get-unaccounted').value, 3_000_000n);
  s.solvent();
});
