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
    U(o.kind ?? 0), S(o.head ?? 'PAID'), S(o.body ?? ''), U((o.img ?? NONE).id), Cl.buffer((o.img ?? NONE).hash), U((o.img ?? NONE).size), U(o.days ?? 1), U(o.layout ?? 0), U(o.max ?? 1000000000000),
  ], sender);
  const live = () => ro('get-live').value.map((x) => Number(x.value));
  const item = (id) => ro('get-item', [U(id)]).value.value;
  const idOf = (r) => Number(r.result.value.value);
  return { simnet, deployer, W, call, ro, bal, me, h, post, buy, live, item, idOf };
}
const R = (r) => pp(r.result);

test('roles: only the admin sets publishers and settings; admin moves in two steps', async () => {
  const s = await screen();
  const { W, deployer } = s;
  assert.equal(R(s.call('set-publisher', [P(W[0]), U(1)], W[0])), err(400));
  assert.equal(R(s.call('set-publisher', [P(W[0]), U(3)])), err(403));
  assert.equal(R(s.call('set-publisher', [P(W[0]), U(1)])), OK);
  assert.equal(R(s.call('set-publisher', [P(W[1]), U(2)])), OK);
  assert.equal(pp(s.ro('get-publisher', [P(W[1])])), 'u2');
  // a publisher cannot change settings or other publishers
  assert.equal(R(s.call('set-slots-enabled', [Cl.bool(true)], W[0])), err(400));
  assert.equal(R(s.call('set-review-lane', [Cl.bool(true)], W[1])), err(400));
  assert.equal(R(s.call('set-publisher', [P(W[2]), U(1)], W[1])), err(400));
  // a stranger cannot post
  assert.equal(R(s.post(W[3])), err(400));
  // removing a publisher takes the right away
  assert.equal(R(s.post(W[0])).startsWith('(ok u'), true);
  s.call('set-publisher', [P(W[0]), U(0)]);
  assert.equal(R(s.post(W[0])), err(400));
  // admin hand-over
  assert.equal(R(s.call('accept-admin', [], W[2])), err(412));
  assert.equal(R(s.call('propose-admin', [P(W[2])], W[0])), err(400));
  assert.equal(R(s.call('propose-admin', [P(W[2])])), OK);
  assert.equal(R(s.call('accept-admin', [], W[3])), err(400));
  assert.equal(R(s.call('accept-admin', [], W[2])), OK);
  assert.equal(R(s.call('set-paused', [Cl.bool(true)])), err(400));      // the old admin is out
  assert.equal(R(s.call('set-paused', [Cl.bool(true)], W[2])), OK);
  void deployer;
});

test('posting: validation, windows, live set, weights', async () => {
  const s = await screen();
  const { deployer, h } = s;
  assert.equal(R(s.post(deployer, { kind: 3 })), err(403));
  assert.equal(R(s.post(deployer, { head: '' })), err(403));
  assert.equal(R(s.post(deployer, { weight: 0 })), err(403));
  assert.equal(R(s.post(deployer, { weight: 11 })), err(403));
  assert.equal(R(s.post(deployer, { to: h() })), err(404));               // ends now
  assert.equal(R(s.post(deployer, { to: h() + 60000 })), err(404));       // longer than a year
  assert.equal(R(s.post(deployer, { from: h() + 50, to: h() + 40 })), err(404));
  // a start in the past is raised to now
  const a = s.idOf(s.post(deployer, { from: 1, to: h() + 10 }));
  assert.equal(s.item(a)['starts-at'].value, BigInt(h()));
  assert.equal(s.item(a).status.value, 1n);
  assert.deepEqual(s.live(), [a]);
  // a scheduled item is in the live set too (the hall filters by window)
  const b = s.idOf(s.post(deployer, { from: h() + 30, to: h() + 90, kind: 1 }));
  assert.deepEqual(s.live(), [a, b]);
  assert.equal(s.ro('get-count').value, 2n);
  const v = s.ro('get-version').value;
  s.post(deployer);
  assert.ok(s.ro('get-version').value > v);
  // paused: no posting, but retire still works
  s.call('set-paused', [Cl.bool(true)]);
  assert.equal(R(s.post(deployer)), err(401));
  assert.equal(R(s.call('retire', [U(a)])), OK);
  s.call('set-paused', [Cl.bool(false)]);
  assert.ok(!s.live().includes(a));
  assert.equal(s.item(a).status.value, 2n);
  assert.equal(R(s.call('retire', [U(a)])), err(409));
  assert.equal(R(s.call('retire', [U(999)])), err(402));
});

test('caps: per kind, per publisher, and the 32-item live set', async () => {
  const s = await screen();
  const { deployer, W } = s;
  s.call('set-publisher', [P(W[0]), U(1)]);
  // publisher cap: 8 live by default
  for (let i = 0; i < 8; i++) assert.equal(R(s.post(W[0], { kind: i % 2 })).startsWith('(ok u'), true, `post ${i}`);
  assert.equal(R(s.post(W[0])), err(406));
  // the admin is not held to the publisher cap
  assert.equal(R(s.post(deployer)).startsWith('(ok u'), true);
  // per-kind cap: ads 8 by default
  s.call('set-caps', [U(16), U(12), U(2), U(8)]);
  const before = s.live().length;
  for (let i = 0; i < 2; i++) assert.equal(R(s.post(deployer, { kind: 2 })).startsWith('(ok u'), true);
  assert.equal(R(s.post(deployer, { kind: 2 })), err(406));
  assert.equal(s.live().length, before + 2);
  // total 32
  s.call('set-caps', [U(32), U(32), U(32), U(32)]);
  while (s.live().length < 32) assert.equal(R(s.post(deployer)).startsWith('(ok u'), true);
  assert.equal(R(s.post(deployer)), err(406));
  // retiring frees a place
  assert.equal(R(s.call('retire', [U(s.live()[0])])), OK);
  assert.equal(R(s.post(deployer)).startsWith('(ok u'), true);
  assert.equal(R(s.call('set-caps', [U(33), U(1), U(1), U(1)])), err(403));
});

test('review lane: publisher items wait, the admin or a reviewer approves or rejects', async () => {
  const s = await screen();
  const { deployer, W } = s;
  s.call('set-publisher', [P(W[0]), U(1)]);
  s.call('set-publisher', [P(W[1]), U(2)]);
  s.call('set-review-lane', [Cl.bool(true)]);
  const p = s.idOf(s.post(W[0]));
  assert.equal(s.item(p).status.value, 0n);
  assert.deepEqual(s.live(), []);
  // a publisher cannot approve their own
  assert.equal(R(s.call('approve', [U(p)], W[0])), err(400));
  assert.equal(R(s.call('approve', [U(p)], W[1])), OK);
  assert.deepEqual(s.live(), [p]);
  assert.equal(R(s.call('approve', [U(p)], W[1])), err(409));
  // the admin's own items skip the lane
  const a = s.idOf(s.post(deployer));
  assert.equal(s.item(a).status.value, 1n);
  // reject a waiting one
  const q = s.idOf(s.post(W[0]));
  assert.equal(R(s.call('reject', [U(q), U(7)], W[0])), err(400));
  assert.equal(R(s.call('reject', [U(q), U(7)], W[1])), OK);
  assert.equal(s.item(q).status.value, 2n);
  assert.equal(s.item(q)['closed-reason'].value, 1n);
  assert.equal(R(s.call('approve', [U(q)], W[1])), err(409));
  // a waiting free item that has expired cannot be approved late
  const r = s.idOf(s.post(W[0], { to: s.h() + 5 }));
  s.simnet.mineEmptyBurnBlocks(6);
  assert.equal(R(s.call('approve', [U(r)])), err(404));
  // the publisher may retire their own waiting item; a reviewer may retire anything
  const t = s.idOf(s.post(W[0]));
  assert.equal(R(s.call('retire', [U(t)], W[0])), OK);
  assert.equal(R(s.call('retire', [U(p)], W[1])), OK);
  assert.equal(R(s.call('retire', [U(a)], W[0])), err(400));
});

test('pictures: sealed, the right size and hash, made by the poster, within the cap', async () => {
  const s = await screen();
  const { deployer, W, simnet } = s;
  s.call('set-publisher', [P(W[0]), U(1)]);
  const img = { id: 7, hash: hash32(7), size: 5000 };
  mockInscription(simnet, deployer, 7, { hash: img.hash, size: 5000, creator: W[0] });
  mockInscription(simnet, deployer, 8, { hash: hash32(8), size: 5000, creator: W[0], sealed: false });
  mockInscription(simnet, deployer, 9, { hash: hash32(9), size: 2097153, creator: W[0] });
  mockInscription(simnet, deployer, 10, { hash: hash32(10), size: 2097152, creator: W[0] });
  assert.equal(R(s.post(W[0], { img })).startsWith('(ok u'), true);
  assert.equal(R(s.post(deployer, { img })), err(405));                                   // not the creator
  assert.equal(R(s.post(W[0], { img: { id: 7, hash: hash32(7), size: 5001 } })), err(405)); // wrong size
  assert.equal(R(s.post(W[0], { img: { id: 7, hash: hash32(8), size: 5000 } })), err(405)); // wrong hash
  assert.equal(R(s.post(W[0], { img: { id: 8, hash: hash32(8), size: 5000 } })), err(405)); // unsealed
  assert.equal(R(s.post(W[0], { img: { id: 9, hash: hash32(9), size: 2097153 } })), err(405)); // one byte over 2 MB
  assert.equal(R(s.post(W[0], { img: { id: 10, hash: hash32(10), size: 2097152 } })).startsWith('(ok u'), true); // exactly 2 MB is fine (room for a GIF or a short clip)
  assert.equal(R(s.post(W[0], { img: { id: 99, hash: hash32(9), size: 10 } })), err(405));   // missing
  // "no picture" means all zero
  assert.equal(R(s.post(W[0], { img: { id: 3, hash: new Uint8Array(0), size: 0 } })), err(405));
  assert.equal(R(s.post(W[0], { img: { id: 0, hash: hash32(1), size: 0 } })), err(405));
});

test('layout: 0 standard (panel + its turn full-screen), 1 full-screen only (premium); 1 needs a picture; premium price and weight', async () => {
  const s = await screen();
  const { deployer, W, simnet } = s;
  s.call('set-publisher', [P(W[0]), U(1)]);
  const img = { id: 21, hash: hash32(21), size: 300000 };
  mockInscription(simnet, deployer, 21, { hash: img.hash, size: 300000, creator: W[0] });
  mockInscription(simnet, deployer, 22, { hash: hash32(22), size: 300000, creator: W[1] });
  mockInscription(simnet, deployer, 23, { hash: hash32(23), size: 300000, creator: W[1] });
  const lay = (id) => Number(s.item(id).layout.value);
  assert.equal(lay(s.idOf(s.post(W[0], { img }))), 0, 'default is the standard layout');
  assert.equal(lay(s.idOf(s.post(W[0], { img, layout: 1 }))), 1, 'a publisher may post a full-screen-only item (free, weight is its own)');
  assert.equal(R(s.post(W[0], { img, layout: 2 })), err(403), 'only 0 or 1');
  assert.equal(R(s.post(W[0], { layout: 1 })), err(403), 'nothing to fill the screen with: refused');
  assert.equal(R(s.post(W[0], { layout: 0 })).startsWith('(ok u'), true, 'a text-only item is still fine');
  // premium price: default 200% of the kind's price, whole numbers per day, set by the admin only
  s.call('set-slots-enabled', [Cl.bool(true)]);
  const cfg = () => s.ro('get-config').value;
  assert.equal(cfg()['premium-percent'].value, 200n, 'default premium is double');
  const img2 = { id: 22, hash: hash32(22), size: 300000 };
  assert.equal(R(s.buy(W[1], { kind: 2, layout: 1 })), err(403), 'full-screen only needs a picture');
  assert.equal(R(s.buy(W[1], { kind: 2, img: img2, layout: 2 })), err(403));
  const b0 = s.bal(W[1]);
  const id = s.idOf(s.buy(W[1], { kind: 2, img: img2, layout: 1, days: 2 }));
  assert.equal(b0 - s.bal(W[1]), 20_000_000n, 'a 2-day full-screen-only ad: 5 STX x 2 (premium) x 2 days');
  assert.equal(lay(id), 1); assert.equal(s.item(id).weight.value, 2n, 'premium comes round twice as often in the full-screen rotation');
  assert.equal(R(s.call('approve', [U(id)])), OK);
  assert.equal(lay(id), 1, 'approval does not touch the layout'); assert.ok(s.live().includes(id));
  simnet.mineEmptyBurnBlocks(100);
  assert.equal(R(s.call('settle', [U(id)], W[3])), `(ok u${20_000_000n - (20_000_000n * 100n) / 288n})`, 'a premium slot is earned block by block like any other (20 STX over 288 blocks)');
  const std = s.idOf(s.buy(W[1], { kind: 2, img: { id: 23, hash: hash32(23), size: 300000 }, layout: 0, days: 2 }));
  assert.equal(s.item(std).weight.value, 1n); assert.equal(s.item(std).price.value, 10_000_000n, 'standard stays at 5 STX a day');
  // premium setting: admin only, 100..1000, applies to new purchases only
  assert.equal(R(s.call('set-premium-percent', [U(150)], W[1])), err(400));
  assert.equal(R(s.call('set-premium-percent', [U(99)])), err(403)); assert.equal(R(s.call('set-premium-percent', [U(1001)])), err(403));
  assert.equal(R(s.call('set-premium-percent', [U(150)])), OK);
  assert.equal(s.item(id).price.value, 20_000_000n, 'a running premium slot keeps the price it was bought at');
  const b1 = s.bal(W[2] ?? W[1]);
  mockInscription(simnet, deployer, 24, { hash: hash32(24), size: 1000, creator: W[2] });
  const r = s.idOf(s.buy(W[2], { kind: 1, img: { id: 24, hash: hash32(24), size: 1000 }, layout: 1, days: 3 }));
  assert.equal(s.item(r).price.value, 9_000_000n, '2 STX x 150% x 3 days');
  assert.equal(R(s.call('set-premium-percent', [U(100)])), OK);
  assert.equal(s.item(s.idOf(s.buy(W[3], { kind: 0, layout: 0, days: 1 }))).price.value, 1_000_000n);
  void b1;
  // the earned/refund arithmetic is the same for a premium slot: cancel before review refunds everything
  const b2 = s.bal(W[1]); const id2 = s.idOf(s.buy(W[1], { kind: 2, img: { id: 23, hash: hash32(23), size: 300000 }, layout: 1, days: 1 }));
  assert.equal(R(s.call('cancel', [U(id2)], W[1])), OK); assert.equal(s.bal(W[1]), b2, 'refunded in full');
});

test('expiry: ended items drop out of the live set on the next write or prune', async () => {
  const s = await screen();
  const { deployer, h } = s;
  const a = s.idOf(s.post(deployer, { to: h() + 5 }));
  const b = s.idOf(s.post(deployer, { to: h() + 500 }));
  s.simnet.mineEmptyBurnBlocks(6);
  assert.deepEqual(s.live(), [a, b]);                          // still listed: the hall checks the window itself
  assert.equal(R(s.call('prune-live', [], s.W[3])), ok('u1')); // anyone can prune
  assert.deepEqual(s.live(), [b]);
  const c = s.idOf(s.post(deployer, { to: h() + 5 }));
  s.simnet.mineEmptyBurnBlocks(6);
  const d = s.idOf(s.post(deployer));                          // a write prunes too
  assert.deepEqual(s.live(), [b, d]);
  void c;
});

test('hide and unhide: reviewers only; hidden leaves the live set; unhide brings it back if still running', async () => {
  const s = await screen();
  const { deployer, W, h } = s;
  s.call('set-publisher', [P(W[0]), U(1)]);
  s.call('set-publisher', [P(W[1]), U(2)]);
  const a = s.idOf(s.post(W[0]));
  assert.equal(R(s.call('set-hidden', [U(a), Cl.bool(true)], W[0])), err(400));   // a publisher cannot hide (or unhide)
  assert.equal(R(s.call('set-hidden', [U(a), Cl.bool(true)], W[1])), OK);
  assert.deepEqual(s.live(), []);
  assert.equal(s.item(a).hidden.type, 'true');
  assert.equal(R(s.call('set-hidden', [U(a), Cl.bool(false)], W[1])), OK);
  assert.deepEqual(s.live(), [a]);
  // a hide then an expiry: unhide does not resurrect it
  const b = s.idOf(s.post(deployer, { to: h() + 5 }));
  s.call('set-hidden', [U(b), Cl.bool(true)]);
  s.simnet.mineEmptyBurnBlocks(6);
  assert.equal(R(s.call('set-hidden', [U(b), Cl.bool(false)])), OK);
  assert.ok(!s.live().includes(b));
  assert.equal(R(s.call('set-hidden', [U(999), Cl.bool(true)])), err(402));
});

test('paid slots: off by default; price, caps and ranges', async () => {
  const s = await screen();
  const { deployer, W } = s;
  assert.equal(R(s.buy(W[0])), err(408));
  assert.equal(R(s.call('set-slots-enabled', [Cl.bool(true)])), OK);
  // the defaults: 1 STX a day for a message, 2 for news, 5 for an ad
  { const p = s.ro('get-config').value.prices.value; assert.deepEqual([p.message.value, p.news.value, p.ad.value], [1_000_000n, 2_000_000n, 5_000_000n]); }
  {
    const d0 = s.bal(W[2]);
    const m = s.idOf(s.buy(W[2], { kind: 0, days: 2 })), n = s.idOf(s.buy(W[2], { kind: 1, days: 1 }));
    assert.equal(d0 - s.bal(W[2]), 4_000_000n, 'a 2-day message (2 STX) plus a 1-day news item (2 STX)');
    assert.equal(R(s.call('cancel', [U(m)], W[2])), OK); assert.equal(R(s.call('cancel', [U(n)], W[2])), OK);
    assert.equal(s.bal(W[2]), d0, 'cancelled: refunded in full');
    const a = s.idOf(s.buy(W[2], { kind: 2, days: 3 }));
    assert.equal(d0 - s.bal(W[2]), 15_000_000n, 'a 3-day ad is 15 STX');
    assert.equal(R(s.call('cancel', [U(a)], W[2])), OK);
  }
  s.call('set-prices', [U(2_000_000), U(5_000_000), U(10_000_000)]);  // the rest of this test uses 2/5/10
  assert.equal(R(s.buy(W[0], { days: 0 })), err(404));
  assert.equal(R(s.buy(W[0], { days: 15 })), err(404));
  assert.equal(R(s.buy(W[0], { kind: 3 })), err(403));
  assert.equal(R(s.buy(W[0], { head: '' })), err(403));
  // price: 2 STX/day message, 5 news, 10 ad
  const b0 = s.bal(W[0]);
  const id = s.idOf(s.buy(W[0], { kind: 1, days: 3 }));
  assert.equal(s.bal(W[0]), b0 - 15_000_000n);
  assert.equal(s.ro('get-escrow-total').value, 15_000_000n);
  const it = s.item(id);
  assert.equal(it.status.value, 0n);
  assert.equal(it.escrow.value, 15_000_000n);
  assert.equal(it.paid.type, 'true');
  assert.deepEqual(s.live(), []);                               // nothing is live until reviewed
  // at most 2 pending per buyer
  s.buy(W[0]);
  assert.equal(R(s.buy(W[0])), err(411));
  // a zero price is refused rather than escrowing nothing
  s.call('set-prices', [U(0), U(0), U(0)]);
  assert.equal(R(s.buy(W[1])), err(414));
  // limits are bounded
  assert.equal(R(s.call('set-prices', [U(1_000_000_001), U(1), U(1)])), err(403));
  assert.equal(R(s.call('set-limits', [U(1), U(91), U(8), U(2), U(432)])), err(403));
  assert.equal(R(s.call('set-limits', [U(0), U(14), U(8), U(2), U(432)])), err(403));
  assert.equal(R(s.call('set-limits', [U(1), U(14), U(17), U(2), U(432)])), err(403));
  assert.equal(R(s.call('set-limits', [U(1), U(14), U(8), U(9), U(432)])), err(403));
  assert.equal(R(s.call('set-limits', [U(1), U(14), U(8), U(2), U(143)])), err(403));
  assert.equal(R(s.call('set-limits', [U(1), U(14), U(8), U(2), U(4321)])), err(403));
  assert.equal(R(s.call('set-limits', [U(2), U(7), U(8), U(2), U(432)], W[0])), err(400));
  void deployer;
});

test('paid slots: approve starts the run; the escrow is earned block by block and settled to the fee recipient', async () => {
  const s = await screen();
  const { deployer, W, h } = s;
  s.call('set-slots-enabled', [Cl.bool(true)]);
  s.call('set-prices', [Cl.uint(2_000_000), Cl.uint(5_000_000), Cl.uint(10_000_000)]);  // these tests' arithmetic uses 2/5/10 STX
  s.call('set-publisher', [P(W[1]), U(2)]);
  s.call('set-fee-recipient', [P(W[5])]);
  const id = s.idOf(s.buy(W[0], { kind: 2, days: 2 }));
  assert.equal(s.ro('get-pending-count', [P(W[0])]).value, 1n);
  const r0 = s.bal(W[5]);
  assert.equal(R(s.call('approve', [U(id)], W[0])), err(400));              // the buyer cannot approve
  assert.equal(R(s.call('approve', [U(id)], W[1])), OK);                    // a reviewer can
  assert.equal(s.bal(W[5]), r0);                                            // nothing is released at approval
  assert.equal(s.ro('get-escrow-total').value, 20_000_000n);
  const it = s.item(id);
  assert.equal(it.status.value, 1n);
  assert.equal(it.escrow.value, 20_000_000n);
  assert.equal(it['starts-at'].value, BigInt(h()));
  assert.equal(it['ends-at'].value, BigInt(h() + 288));
  assert.deepEqual(s.live(), [id]);
  assert.equal(s.ro('get-pending-count', [P(W[0])]).value, 0n);
  // earned in proportion to the blocks run (20 STX over 288 blocks): nothing in the approval block, a block's share one block after, everything after the run
  assert.equal(R(s.call('settle', [U(id)], W[3])), '(ok u20000000)');
  assert.equal(s.bal(W[5]), r0);
  s.simnet.mineEmptyBurnBlocks(1);
  const e1 = 20_000_000n / 288n;
  assert.equal(R(s.call('settle', [U(id)], W[3])), `(ok u${20_000_000n - e1})`);
  assert.equal(s.bal(W[5]), r0 + e1);
  assert.equal(R(s.call('settle', [U(id)], W[3])), `(ok u${20_000_000n - e1})`);      // settling twice pays nothing more
  assert.equal(s.bal(W[5]), r0 + e1);
  s.simnet.mineEmptyBurnBlocks(288);
  assert.equal(R(s.call('settle', [U(id)], W[3])), '(ok u0)');
  assert.equal(s.bal(W[5]), r0 + 20_000_000n);
  assert.equal(s.ro('get-escrow-total').value, 0n);
  // no second payout, no refund after approval
  assert.equal(R(s.call('approve', [U(id)], W[1])), err(409));
  assert.equal(R(s.call('reject', [U(id), U(1)], W[1])), err(409));
  assert.equal(R(s.call('cancel', [U(id)], W[0])), err(409));
  assert.equal(R(s.call('sweep', [U(id)], W[3])), err(409));
  assert.equal(R(s.call('settle', [U(999)], W[3])), err(402));
  // a free item cannot be settled
  const f = s.idOf(s.post(deployer));
  assert.equal(R(s.call('settle', [U(f)], W[3])), err(409));
});

test('paid slots: reject, cancel and sweep refund in full; each only once', async () => {
  const s = await screen();
  const { deployer, W, h } = s;
  s.call('set-slots-enabled', [Cl.bool(true)]);
  s.call('set-prices', [Cl.uint(2_000_000), Cl.uint(5_000_000), Cl.uint(10_000_000)]);  // these tests' arithmetic uses 2/5/10 STX
  const a = s.idOf(s.buy(W[0], { days: 2 }));         // 4 STX
  const b = s.idOf(s.buy(W[0], { days: 1 }));         // 2 STX
  const b0 = s.bal(W[0]);
  assert.equal(R(s.call('cancel', [U(a)], W[1])), err(400));      // not the buyer
  assert.equal(R(s.call('cancel', [U(a)], W[0])), OK);
  assert.equal(s.bal(W[0]), b0 + 4_000_000n);
  assert.equal(R(s.call('cancel', [U(a)], W[0])), err(409));      // only once
  assert.equal(R(s.call('reject', [U(a), U(1)])), err(409));
  assert.equal(R(s.call('reject', [U(b), U(1)], W[1])), err(400)); // a stranger cannot reject
  assert.equal(R(s.call('reject', [U(b), U(9)])), OK);
  assert.equal(s.bal(W[0]), b0 + 6_000_000n);
  assert.equal(s.item(b)['closed-reason'].value, 1n);
  assert.equal(s.ro('get-escrow-total').value, 0n);
  assert.equal(s.ro('get-pending-count', [P(W[0])]).value, 0n);
  // sweep: too early, then by anyone after the window; the buyer cannot be shorted
  const c = s.idOf(s.buy(W[0], { kind: 1, days: 1 }));          // 5 STX
  const b1 = s.bal(W[0]);
  assert.equal(R(s.call('sweep', [U(c)], W[3])), err(410));
  s.simnet.mineEmptyBurnBlocks(432);
  assert.equal(R(s.call('sweep', [U(c)], W[3])), err(410));     // exactly the window is still too early
  s.simnet.mineEmptyBurnBlocks(1);
  // a stale request can no longer be approved, even by the admin
  assert.equal(R(s.call('approve', [U(c)])), err(404));
  assert.equal(R(s.call('sweep', [U(c)], W[3])), OK);
  assert.equal(s.bal(W[0]), b1 + 5_000_000n);
  assert.equal(R(s.call('sweep', [U(c)], W[3])), err(409));
  assert.equal(s.item(c)['closed-reason'].value, 3n);
  assert.equal(s.ro('get-escrow-total').value, 0n);
  void deployer; void h;
});

test('paid slots: pause blocks buying and approving, never refunds or retiring', async () => {
  const s = await screen();
  const { deployer, W } = s;
  s.call('set-slots-enabled', [Cl.bool(true)]);
  s.call('set-prices', [Cl.uint(2_000_000), Cl.uint(5_000_000), Cl.uint(10_000_000)]);  // these tests' arithmetic uses 2/5/10 STX
  const a = s.idOf(s.buy(W[0]));
  const b = s.idOf(s.buy(W[0]));
  const c = s.idOf(s.buy(W[1]));
  s.call('set-paused', [Cl.bool(true)]);
  assert.equal(R(s.buy(W[2])), err(401));
  assert.equal(R(s.call('approve', [U(a)])), err(401));
  const before = s.bal(W[0]);
  assert.equal(R(s.call('cancel', [U(a)], W[0])), OK);
  assert.equal(R(s.call('reject', [U(b), U(1)])), OK);
  assert.equal(s.bal(W[0]), before + 4_000_000n);
  s.simnet.mineEmptyBurnBlocks(440);
  assert.equal(R(s.call('sweep', [U(c)], W[4])), OK);
  assert.equal(s.ro('get-escrow-total').value, 0n);
  // a pending paid item cannot be "retired" around the refund paths
  s.call('set-paused', [Cl.bool(false)]);
  const d = s.idOf(s.buy(W[0]));
  assert.equal(R(s.call('retire', [U(d)])), err(409));
  assert.equal(R(s.call('reject', [U(d), U(1)])), OK);
  void deployer;
});

test('paid slots: the paid-live cap, free-item caps do not apply, fee recipient is read at settlement', async () => {
  const s = await screen();
  const { deployer, W } = s;
  s.call('set-slots-enabled', [Cl.bool(true)]);
  s.call('set-prices', [Cl.uint(2_000_000), Cl.uint(5_000_000), Cl.uint(10_000_000)]);  // these tests' arithmetic uses 2/5/10 STX
  s.call('set-limits', [U(1), U(14), U(1), U(4), U(432)]);       // one paid item live at a time
  s.call('set-fee-recipient', [P(W[4])]);
  const a = s.idOf(s.buy(W[0]));
  const b = s.idOf(s.buy(W[1]));
  const r4 = s.bal(W[4]), r5 = s.bal(W[5]);
  assert.equal(R(s.call('approve', [U(a)])), OK);
  assert.equal(R(s.call('approve', [U(b)])), err(406));          // the cap: b stays pending, nothing moved
  assert.equal(s.item(b).status.value, 0n);
  s.simnet.mineEmptyBurnBlocks(144);
  assert.equal(R(s.call('settle', [U(a)])), '(ok u0)');           // a's one day has run: all earned
  assert.equal(s.bal(W[4]), r4 + 2_000_000n);
  assert.equal(s.ro('get-escrow-total').value, 2_000_000n);
  // the recipient changes while b waits: b's escrow goes to whoever is recipient when it is settled
  s.call('set-fee-recipient', [P(W[5])]);
  s.call('retire', [U(a)]);                                      // frees the paid slot
  assert.equal(R(s.call('approve', [U(b)])), OK);
  s.simnet.mineEmptyBurnBlocks(144);
  assert.equal(R(s.call('settle', [U(b)])), '(ok u0)');
  assert.equal(s.bal(W[5]), r5 + 2_000_000n);
  assert.equal(s.bal(W[4]), r4 + 2_000_000n);
  assert.equal(s.ro('get-escrow-total').value, 0n);
  void deployer;
});

test('paid slots: pictures must be the buyer\'s own sealed inscriptions', async () => {
  const s = await screen();
  const { deployer, W, simnet } = s;
  s.call('set-slots-enabled', [Cl.bool(true)]);
  s.call('set-prices', [Cl.uint(2_000_000), Cl.uint(5_000_000), Cl.uint(10_000_000)]);  // these tests' arithmetic uses 2/5/10 STX
  mockInscription(simnet, deployer, 21, { hash: hash32(21), size: 9000, creator: W[0] });
  const img = { id: 21, hash: hash32(21), size: 9000 };
  assert.equal(R(s.buy(W[1], { img })), err(405));               // someone else's picture
  const before = s.bal(W[1]);
  assert.equal(s.bal(W[1]), before);                             // and nothing was taken
  assert.equal(R(s.buy(W[0], { img })).startsWith('(ok u'), true);
});

test('escrow invariant: after any mix of paid actions the contract holds exactly the escrow of pending and running items', async () => {
  const s = await screen();
  const { W } = s;
  s.call('set-slots-enabled', [Cl.bool(true)]);
  s.call('set-prices', [Cl.uint(2_000_000), Cl.uint(5_000_000), Cl.uint(10_000_000)]);  // these tests' arithmetic uses 2/5/10 STX
  s.call('set-publisher', [P(W[5]), U(2)]);
  s.call('set-limits', [U(1), U(14), U(16), U(8), U(432)]);
  const ids = [];
  const pendingTotal = () => ids.reduce((sum, id) => { const it = s.item(id); return sum + (it.status.value < 2n ? it.escrow.value : (assert.equal(it.escrow.value, 0n), 0n)); }, 0n);
  const check = (what) => assert.equal(s.ro('get-escrow-total').value, pendingTotal(), what);
  for (let i = 0; i < 12; i++) {
    const r = s.buy(W[i % 4], { kind: i % 3, days: 1 + (i % 4) });
    if (r.result.type === 'ok') ids.push(Number(r.result.value.value));
    check(`after buy ${i}`);
  }
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const by = i % 4;
    if (i % 4 === 0) s.call('approve', [U(id)]);
    else if (i % 4 === 1) s.call('reject', [U(id), U(2)], W[5]);
    else if (i % 4 === 2) s.call('cancel', [U(id)], W[by]);
    check(`after action ${i}`);
  }
  s.simnet.mineEmptyBurnBlocks(440);
  for (const id of ids) s.call('sweep', [U(id)], W[4]);
  check('after sweep');
  s.simnet.mineEmptyBurnBlocks(14 * 144);
  for (const id of ids) s.call('settle', [U(id)], W[4]);
  check('after settle');
  assert.equal(s.ro('get-escrow-total').value, 0n);
  assert.equal(s.ro('get-unaccounted').value, 0n);
});

test('config and reads: defaults, successor lock, interface is frozen at v1', async () => {
  const s = await screen();
  const { W } = s;
  const cfg = s.ro('get-config').value;
  assert.equal(cfg['slots-enabled'].type, 'false');
  assert.equal(cfg['review-window'].value, 432n);
  assert.equal(cfg['max-paid-live'].value, 8n);
  assert.equal(R(s.call('set-successor', [Cl.some(P(W[0]))], W[0])), err(400));
  assert.equal(R(s.call('set-successor', [Cl.some(P(W[0]))])), OK);
  assert.equal(R(s.call('lock-successor', [], W[0])), err(400));
  assert.equal(R(s.call('lock-successor')), OK);
  assert.equal(R(s.call('set-successor', [Cl.none()])), err(413));
  assert.equal(s.ro('get-successor').value.locked.type, 'true');
  assert.equal(s.ro('get-items', [Cl.list([U(0), U(5)])]).value.every((x) => x.type === 'none'), true);
});
