// xtrata-lease-v1 (draft): renting the right to change a space, proven against the real xtrata-world-v2.
// Rent is held in escrow by the lease contract and released to the lessor block by block, so an early end of any kind
// (surrender, revoke, pulled grant, sale) refunds the tenant the part not yet earned.
// The lease contract is deployed at test time from drafts/ (it is not part of Clarinet.toml or the launch).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { standardWorld, U, P, S, Cl, CAP, OK, err, pp, idOf, good, TF } from './world2-helpers.mjs';

const SRC = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../drafts/xtrata-lease-v1.clar'), 'utf8');
const E = { NOT_AUTH: 400, NO_OFFER: 401, INVALID: 402, TAKEN: 403, TOO_LONG: 404, PRICE: 405, STALE: 406, NO_LEASE: 407, OWN: 408 };
const REG = { NOT_AUTH: 300, CAPS: 319 };
const RENT_CAPS = CAP.STATE | CAP.OBJECT;           // what a tenant gets: change states and objects (a poster bay, say)
const DAY = 144;

// a world with the lease contract deployed, an alice-owned room "shop" with one sign object, and the lease grant in place
async function leaseWorld({ grantLease = true, offer = true, price = 1000, fee = 0 } = {}) {
  const w = await standardWorld();
  const { simnet, deployer, W } = w;
  simnet.deployContract('xtrata-lease-v1', SRC, { clarityVersion: 4 }, deployer);
  const lease = `${deployer}.xtrata-lease-v1`;
  const [lessor, tenant, other] = [W[0], W[1], W[2]];
  const L = (fn, args, sender) => simnet.callPublicFn('xtrata-lease-v1', fn, args, sender);
  const Lr = (fn, args = []) => simnet.callReadOnlyFn('xtrata-lease-v1', fn, args, deployer).result;
  // alice (W[0]) owns plot `alice`; the shop is her room inside it
  const shop = idOf(w.space(lessor, { parent: w.ids.alice, slug: 'shop', kind: 1, runtime: 1 }));
  assert.ok(good(w.setState(lessor, shop, 1)));
  const sign = idOf(w.object(lessor, shop, w.kinds.sign, { name: 'sign' }));
  if (grantLease) assert.equal(pp(w.grant(lessor, shop, lease, RENT_CAPS | CAP.GRANT).result), OK);
  if (fee) assert.equal(pp(L('set-fee', [U(fee), P(deployer)], deployer).result), OK);
  if (offer) assert.equal(pp(L('offer', [U(shop), U(RENT_CAPS), U(price), U(1), U(DAY * 7)], lessor).result), OK);
  const mine = (who, obj = sign, text = 'hi') => w.addState(who, obj, { patch: JSON.stringify({ text }) });
  const bal = (who) => w.bal(who) ?? 0n;
  const mine2 = mine;
  return { w, simnet, deployer, lessor, tenant, other, shop, sign, lease, L, Lr, mine: mine2, bal };
}

const ok = (r) => pp(r).startsWith('(ok');
const rentOk = (t, who, blocks, price = 1000) => assert.ok(ok(t.L('rent', [U(t.shop), U(blocks), U(price)], who).result), `rent ${blocks}`);

test('rent is held in escrow, earned block by block, and anyone may settle it to the lessor', async () => {
  const t = await leaseWorld({ price: 1000 });
  assert.equal(pp(t.Lr('quote', [U(t.shop), U(10)])), '(some { cost: u10000 })');
  assert.equal(pp(t.mine(t.tenant).result), err(REG.NOT_AUTH), 'before renting the tenant cannot change anything');
  const b = { l: t.bal(t.lessor), t: t.bal(t.tenant) };
  const r = t.L('rent', [U(t.shop), U(10), U(1000)], t.tenant);
  const exp = t.simnet.burnBlockHeight + 10;
  assert.equal(pp(r.result), `(ok u${exp})`);
  assert.equal(b.t - t.bal(t.tenant), 10_000n, 'the tenant paid the whole term up front');
  assert.equal(t.bal(t.lease), 10_000n, 'held by the lease contract');
  assert.equal(t.bal(t.lessor), b.l, 'the lessor has earned nothing yet');
  assert.ok(ok(t.mine(t.tenant).result), 'the tenant changes the sign');
  assert.equal(pp(t.mine(t.other).result), err(REG.NOT_AUTH), 'nobody else can');
  assert.equal(pp(t.Lr('active-tenant', [U(t.shop)])), `(some '${t.tenant})`);
  t.simnet.mineEmptyBurnBlocks(4);
  assert.match(pp(t.Lr('quote-settle', [U(t.shop)])), /to-lessor: u4000/);
  assert.equal(pp(t.L('settle', [U(t.shop)], t.other).result), '(ok { done: false, pay: u4000, refund: u0 })', 'a stranger can settle; it pays the lessor');
  assert.equal(t.bal(t.lessor) - b.l, 4_000n);
  assert.equal(t.bal(t.lease), 6_000n);
  t.simnet.mineEmptyBurnBlocks(6);
  assert.equal(pp(t.L('settle', [U(t.shop)], t.other).result), '(ok { done: true, pay: u6000, refund: u0 })');
  assert.equal(t.bal(t.lessor) - b.l, 10_000n, 'the lessor got every microSTX');
  assert.equal(t.bal(t.lease), 0n, 'nothing is left in escrow');
  assert.equal(pp(t.L('settle', [U(t.shop)], t.other).result), '(ok { done: true, pay: u0, refund: u0 })', 'settling a finished lease is harmless');
});

test('the right ends by itself at expiry; the next tenant\'s rent settles the old lease first', async () => {
  const t = await leaseWorld();
  rentOk(t, t.tenant, 5);
  assert.ok(ok(t.mine(t.tenant).result));
  t.simnet.mineEmptyBurnBlocks(3);
  assert.ok(ok(t.mine(t.tenant, t.sign, 'still').result), 'still inside the term');
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(1000)], t.other).result), err(E.TAKEN), 'taken while the lease is live');
  t.simnet.mineEmptyBurnBlocks(3);
  assert.equal(pp(t.mine(t.tenant, t.sign, 'late').result), err(REG.NOT_AUTH), 'expired: nothing was sent to end it');
  assert.equal(pp(t.Lr('active-tenant', [U(t.shop)])), 'none');
  const l0 = t.bal(t.lessor);
  rentOk(t, t.other, 5);
  assert.equal(t.bal(t.lessor) - l0, 5_000n, 'the old term was paid out inside the new rent');
  assert.equal(t.bal(t.lease), 5_000n, 'only the new tenant\'s rent is held');
  assert.ok(ok(t.mine(t.other, t.sign, 'mine now').result));
  assert.equal(pp(t.mine(t.tenant, t.sign, 'old tenant').result), err(REG.NOT_AUTH));
});

test('the same tenant extends from the end of the term, never past a week from now', async () => {
  const t = await leaseWorld();
  const h = t.simnet.burnBlockHeight;
  assert.equal(pp(t.L('rent', [U(t.shop), U(100), U(1000)], t.tenant).result), `(ok u${h + 100})`);
  assert.equal(pp(t.L('rent', [U(t.shop), U(100), U(1000)], t.tenant).result), `(ok u${h + 200})`, 'extension is added to the end');
  assert.equal(pp(t.L('rent', [U(t.shop), U(900), U(1000)], t.tenant).result), err(E.TOO_LONG), 'more than a week ahead is refused');
  assert.equal(pp(t.L('rent', [U(t.shop), U(808), U(1000)], t.tenant).result), `(ok u${h + 1008})`, 'exactly a week ahead is fine');
  assert.equal(t.bal(t.lease), 1_008_000n);
  // a rolling week: after 500 blocks the tenant may add 500 more; the lessor was paid for the 500 gone on the way
  t.simnet.mineEmptyBurnBlocks(500);
  const l0 = t.bal(t.lessor);
  assert.equal(pp(t.L('rent', [U(t.shop), U(500), U(1000)], t.tenant).result), `(ok u${h + 1508})`);
  assert.equal(t.bal(t.lessor) - l0, 500_000n);
  assert.equal(t.bal(t.lease), 1_008_000n, 'escrow always holds what is still to be earned');
});

test('the price is pinned, the length is bounded, and the lessor cannot rent from herself', async () => {
  const t = await leaseWorld({ price: 1000 });
  assert.equal(pp(t.L('rent', [U(t.shop), U(10), U(999)], t.tenant).result), err(E.PRICE));
  assert.equal(pp(t.L('rent', [U(t.shop), U(0), U(1000)], t.tenant).result), err(E.INVALID));
  assert.equal(pp(t.L('rent', [U(t.shop), U(1009), U(1000)], t.tenant).result), err(E.INVALID));
  assert.equal(pp(t.L('rent', [U(t.shop), U(10), U(1000)], t.lessor).result), err(E.OWN));
  assert.equal(pp(t.L('rent', [U(999), U(10), U(1000)], t.tenant).result), err(E.NO_OFFER));
});

test('a tenant gets only the offered rights: no owner powers, no passing it on, nothing outside the room', async () => {
  const t = await leaseWorld();
  rentOk(t, t.tenant, 50);
  const { w, tenant, other, shop } = t;
  assert.equal(pp(w.grant(tenant, shop, other, CAP.STATE, false, t.simnet.burnBlockHeight + 10).result), err(REG.NOT_AUTH));
  assert.equal(pp(w.call('set-policy', [U(shop), w.polOf(shop, { objects: 1 })], tenant).result), err(REG.NOT_AUTH));
  assert.equal(pp(w.call('propose-space-transfer', [U(shop), P(tenant)], tenant).result), err(REG.NOT_AUTH));
  assert.equal(pp(w.call('list-space', [U(shop), U(1), Cl.none()], tenant).result).startsWith('(err'), true);
  assert.equal(pp(w.space(tenant, { parent: shop, slug: 'x', kind: 1 }).result), err(REG.NOT_AUTH));
  assert.equal(pp(w.addState(tenant, 0, {}).result).startsWith('(err'), true);
  assert.equal(pp(w.object(tenant, w.ids.hall, w.kinds.sign, {}).result), err(REG.NOT_AUTH));
});

test('an offer cannot include the right to grant or moderate, and the registry refuses rights the lease does not hold', async () => {
  const t = await leaseWorld({ offer: false });
  const o = (caps) => t.L('offer', [U(t.shop), U(caps), U(1), U(1), U(10)], t.lessor).result;
  assert.equal(pp(o(CAP.GRANT | CAP.STATE)), err(E.INVALID));
  assert.equal(pp(o(CAP.MOD)), err(E.INVALID));
  assert.equal(pp(o(0)), err(E.INVALID));
  assert.equal(pp(t.L('offer', [U(t.shop), U(CAP.STATE), U(1), U(5), U(2)], t.lessor).result), err(E.INVALID), 'min over max');
  assert.equal(pp(t.L('offer', [U(t.shop), U(CAP.STATE), U(1), U(1), U(2000)], t.lessor).result), err(E.INVALID), 'more than a week');
  assert.equal(pp(t.L('offer', [U(t.shop), U(CAP.STATE), U(1), U(1), U(10)], t.tenant).result), err(E.NOT_AUTH), 'only the owner offers');
  assert.equal(pp(t.L('offer', [U(t.shop), U(CAP.STATE | CAP.LINK), U(1), U(1), U(10)], t.lessor).result), OK);
  const before = t.bal(t.tenant);
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(1)], t.tenant).result), err(REG.CAPS));
  assert.equal(t.bal(t.tenant), before, 'a refused rent costs the tenant nothing');
  assert.equal(t.bal(t.lease), 0n);
});

test('without a grant from the owner the lease contract can issue nothing', async () => {
  const t = await leaseWorld({ grantLease: false });
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(1000)], t.tenant).result), err(REG.NOT_AUTH));
});

test('DECISION early end by the lessor: pulling the lease contract\'s grant refunds the tenant what was not yet settled', async () => {
  const t = await leaseWorld();
  const b = { l: t.bal(t.lessor), t: t.bal(t.tenant) };
  rentOk(t, t.tenant, 100);
  t.simnet.mineEmptyBurnBlocks(20);
  // the careful lessor claims what is earned first, then pulls the grant
  assert.ok(ok(t.L('settle', [U(t.shop)], t.lessor).result));
  assert.equal(t.bal(t.lessor) - b.l, 20_000n);
  assert.equal(pp(t.w.call('revoke', [U(t.shop), P(t.lease)], t.lessor).result), OK);
  assert.equal(pp(t.mine(t.tenant).result), err(REG.NOT_AUTH), 'what the lease issued lapses with its own grant');
  assert.equal(pp(t.Lr('active-tenant', [U(t.shop)])), 'none');
  assert.match(pp(t.Lr('quote-settle', [U(t.shop)])), /refund: u80000/);
  assert.equal(pp(t.L('settle', [U(t.shop)], t.other).result), '(ok { done: true, pay: u0, refund: u80000 })', 'anyone may trigger the tenant\'s refund');
  assert.equal(b.t - t.bal(t.tenant), 20_000n, 'the tenant paid only for the 20 blocks he had');
  assert.equal(t.bal(t.lessor) - b.l, 20_000n);
  assert.equal(t.bal(t.lease), 0n);
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(1000)], t.other).result), err(REG.NOT_AUTH), 'and no new tenant can be admitted without the grant');
});

test('DECISION early end by the lessor: revoking the tenant directly in the registry refunds the unclaimed rent to the tenant', async () => {
  const t = await leaseWorld();
  const b = { l: t.bal(t.lessor), t: t.bal(t.tenant) };
  rentOk(t, t.tenant, 100);
  t.simnet.mineEmptyBurnBlocks(30);
  assert.equal(pp(t.w.call('revoke', [U(t.shop), P(t.tenant)], t.lessor).result), OK);
  assert.equal(pp(t.mine(t.tenant).result), err(REG.NOT_AUTH));
  // nobody settled before the revoke, so the lessor forfeits the unclaimed 30 blocks: the tenant is made whole
  assert.equal(pp(t.L('settle', [U(t.shop)], t.tenant).result), '(ok { done: true, pay: u0, refund: u100000 })');
  assert.equal(t.bal(t.tenant), b.t, 'the tenant is whole');
  assert.equal(t.bal(t.lessor), b.l, 'the lessor earned nothing she had not claimed');
  // and a new tenant can come straight in
  rentOk(t, t.other, 5);
  assert.ok(ok(t.mine(t.other).result));
});

test('a revoked tenant\'s refund is also paid inside the next tenant\'s rent', async () => {
  const t = await leaseWorld();
  rentOk(t, t.tenant, 100);
  const tBefore = t.bal(t.tenant);
  assert.equal(pp(t.w.call('revoke', [U(t.shop), P(t.tenant)], t.lessor).result), OK);
  rentOk(t, t.other, 10);
  assert.equal(t.bal(t.tenant) - tBefore, 100_000n, 'refunded in full by the next rent');
  assert.equal(t.bal(t.lease), 10_000n);
});

test('DECISION tenant leaves early: surrender pays the lessor to now and refunds the rest pro rata', async () => {
  const t = await leaseWorld();
  const b = { l: t.bal(t.lessor), t: t.bal(t.tenant) };
  rentOk(t, t.tenant, 100);
  t.simnet.mineEmptyBurnBlocks(25);
  assert.equal(pp(t.L('surrender', [U(t.shop)], t.other).result), err(E.NOT_AUTH));
  assert.equal(pp(t.L('surrender', [U(t.shop)], t.tenant).result), OK);
  assert.equal(t.bal(t.lessor) - b.l, 25_000n);
  assert.equal(b.t - t.bal(t.tenant), 25_000n, 'the tenant paid for 25 blocks only');
  assert.equal(t.bal(t.lease), 0n);
  assert.equal(pp(t.mine(t.tenant).result), err(REG.NOT_AUTH));
  assert.equal(pp(t.Lr('active-tenant', [U(t.shop)])), 'none');
  rentOk(t, t.other, 5);
  assert.equal(pp(t.L('surrender', [U(t.shop)], t.tenant).result), err(E.NOT_AUTH), 'the old tenant has no lease to give up');
});

test('rounding never loses a microSTX: odd prices split exactly between lessor and tenant', async () => {
  const t = await leaseWorld({ price: 7 });
  rentOk(t, t.tenant, 13, 7);                       // 91 held
  const b = { l: t.bal(t.lessor), t: t.bal(t.tenant) };
  t.simnet.mineEmptyBurnBlocks(5);
  assert.ok(ok(t.L('settle', [U(t.shop)], t.other).result));
  t.simnet.mineEmptyBurnBlocks(2);
  assert.ok(ok(t.L('surrender', [U(t.shop)], t.tenant).result));
  assert.equal(t.bal(t.lease), 0n);
  const paid = t.bal(t.lessor) - b.l, back = t.bal(t.tenant) - b.t;
  assert.equal(paid + back, 91n, 'every microSTX is accounted for');
  assert.equal(paid, 49n, '7 blocks earned at 7 each');
});

test('DECISION a sale: settle first and the lessor keeps what she earned; the tenant gets the rest back and the buyer is not bound', async () => {
  const t = await leaseWorld();
  const { w } = t;
  const b = { l: t.bal(t.lessor), t: t.bal(t.tenant) };
  rentOk(t, t.tenant, 100);
  t.simnet.mineEmptyBurnBlocks(10);
  assert.ok(ok(t.L('settle', [U(t.shop)], t.lessor).result));
  const buyer = w.simnet.getAccounts().get('wallet_4');
  assert.equal(pp(w.call('propose-space-transfer', [U(t.shop), P(buyer)], t.lessor).result), OK);
  assert.ok(good(w.call('accept-space-transfer', [U(t.shop)], buyer)));
  assert.equal(pp(t.mine(t.tenant).result), err(REG.NOT_AUTH), 'the tenant\'s right went with the old owner');
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(1000)], t.other).result), err(E.STALE), 'the old offer no longer binds the new owner');
  assert.equal(pp(t.L('settle', [U(t.shop)], t.tenant).result), '(ok { done: true, pay: u0, refund: u90000 })');
  assert.equal(b.t - t.bal(t.tenant), 10_000n, 'the tenant paid only for the 10 blocks he had');
  assert.equal(t.bal(t.lessor) - b.l, 10_000n);
  assert.equal(t.bal(t.lease), 0n);
  // the new owner starts again: delegate and offer
  assert.equal(pp(w.grant(buyer, t.shop, t.lease, RENT_CAPS | CAP.GRANT).result), OK);
  assert.equal(pp(t.L('offer', [U(t.shop), U(RENT_CAPS), U(5), U(1), U(50)], buyer).result), OK);
  assert.ok(ok(t.L('rent', [U(t.shop), U(5), U(5)], t.other).result));
  assert.ok(ok(t.mine(t.other).result));
});

test('a sale without settling first: the lessor forfeits the unclaimed rent, the tenant is refunded in full', async () => {
  const t = await leaseWorld();
  const { w } = t;
  const b = { l: t.bal(t.lessor), t: t.bal(t.tenant) };
  rentOk(t, t.tenant, 100);
  t.simnet.mineEmptyBurnBlocks(10);
  const buyer = w.simnet.getAccounts().get('wallet_4');
  assert.equal(pp(w.call('propose-space-transfer', [U(t.shop), P(buyer)], t.lessor).result), OK);
  assert.ok(good(w.call('accept-space-transfer', [U(t.shop)], buyer)));
  assert.equal(pp(t.L('settle', [U(t.shop)], t.other).result), '(ok { done: true, pay: u0, refund: u100000 })');
  assert.equal(t.bal(t.tenant), b.t);
  assert.equal(t.bal(t.lessor), b.l);
});

test('the operator\'s cut comes out of what the lessor earns (capped at 10%); refunds carry no fee', async () => {
  const t = await leaseWorld({ price: 1000, fee: 500 });                // 5%
  assert.equal(pp(t.L('set-fee', [U(1001), P(t.deployer)], t.deployer).result), err(E.INVALID));
  assert.equal(pp(t.L('set-fee', [U(500), P(t.deployer)], t.other).result), err(E.NOT_AUTH));
  const b = { l: t.bal(t.lessor), o: t.bal(t.deployer), t: t.bal(t.tenant) };
  rentOk(t, t.tenant, 100);
  t.simnet.mineEmptyBurnBlocks(40);
  assert.ok(ok(t.L('surrender', [U(t.shop)], t.tenant).result));      // 40 blocks earned = 40,000
  assert.equal(t.bal(t.lessor) - b.l, 38_000n);
  assert.equal(t.bal(t.deployer) - b.o, 2_000n);
  assert.equal(b.t - t.bal(t.tenant), 40_000n, 'the tenant paid 40,000 in all; the unused 60,000 came back untouched');
});

test('free rentals work (price 0), hold nothing, still block a second tenant; a cancelled offer stops new tenants but not the one already in', async () => {
  const t = await leaseWorld({ price: 0 });
  rentOk(t, t.tenant, 20, 0);
  assert.equal(t.bal(t.lease), 0n);
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(0)], t.other).result), err(E.TAKEN), 'a free lease is still a lease');
  assert.equal(pp(t.L('cancel-offer', [U(t.shop)], t.tenant).result), err(E.NOT_AUTH));
  assert.equal(pp(t.L('cancel-offer', [U(t.shop)], t.lessor).result), OK);
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(0)], t.other).result), err(E.NO_OFFER));
  assert.ok(ok(t.mine(t.tenant).result), 'the tenant keeps the term he was given');
  t.simnet.mineEmptyBurnBlocks(21);
  assert.equal(pp(t.Lr('active-tenant', [U(t.shop)])), 'none');
});

test('a tenant\'s changes are scheduled states like anyone\'s, and the owner is back in control after the term', async () => {
  const t = await leaseWorld();
  rentOk(t, t.tenant, 200);
  const h = t.simnet.burnBlockHeight;
  assert.ok(ok(t.w.addState(t.tenant, t.sign, { from: h + 50, patch: '{"text":"later"}' }).result));
  t.simnet.mineEmptyBurnBlocks(201);
  assert.ok(ok(t.w.addState(t.lessor, t.sign, { patch: '{"text":"owner again"}' }).result));
  assert.equal(pp(t.mine(t.tenant).result), err(REG.NOT_AUTH));
});
