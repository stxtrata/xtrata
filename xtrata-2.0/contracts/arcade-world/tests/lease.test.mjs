// xtrata-lease-v1 (draft): renting the right to change a space, proven against the real xtrata-world-v2.
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
  return { w, simnet, deployer, lessor, tenant, other, shop, sign, lease, L, Lr, mine, bal: w.bal };
}

test('a tenant pays, can then change the room, and the lessor is paid', async () => {
  const t = await leaseWorld({ price: 1000 });
  assert.equal(pp(t.Lr('quote', [U(t.shop), U(10)])), '(some { cost: u10000, fee: u0, to-lessor: u10000 })');
  assert.equal(pp(t.mine(t.tenant).result), err(REG.NOT_AUTH), 'before renting the tenant cannot change anything');
  const before = { l: t.bal(t.lessor), t: t.bal(t.tenant) };
  const r = t.L('rent', [U(t.shop), U(10), U(1000)], t.tenant);
  const exp = t.simnet.burnBlockHeight + 10;
  assert.equal(pp(r.result), `(ok u${exp})`);
  assert.equal(t.bal(t.lessor) - before.l, 10_000n);
  assert.equal(before.t - t.bal(t.tenant), 10_000n);
  assert.equal(pp(t.mine(t.tenant).result).startsWith('(ok'), true, 'the tenant changes the sign');
  assert.equal(pp(t.mine(t.other).result), err(REG.NOT_AUTH), 'nobody else can');
  assert.equal(pp(t.Lr('active-tenant', [U(t.shop)])), `(some '${t.tenant})`);
});

test('the right ends by itself at expiry; then the next tenant can rent', async () => {
  const t = await leaseWorld();
  assert.ok(pp(t.L('rent', [U(t.shop), U(5), U(1000)], t.tenant).result).startsWith('(ok'));
  assert.ok(pp(t.mine(t.tenant).result).startsWith('(ok'));
  t.simnet.mineEmptyBurnBlocks(3);
  assert.ok(pp(t.mine(t.tenant, t.sign, 'still').result).startsWith('(ok'), 'still inside the term');
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(1000)], t.other).result), err(E.TAKEN), 'taken while the lease is live');
  t.simnet.mineEmptyBurnBlocks(3);
  assert.equal(pp(t.mine(t.tenant, t.sign, 'late').result), err(REG.NOT_AUTH), 'expired: nothing was sent to end it');
  assert.equal(pp(t.Lr('active-tenant', [U(t.shop)])), 'none');
  assert.ok(pp(t.L('rent', [U(t.shop), U(5), U(1000)], t.other).result).startsWith('(ok'));
  assert.ok(pp(t.mine(t.other, t.sign, 'mine now').result).startsWith('(ok'));
  assert.equal(pp(t.mine(t.tenant, t.sign, 'old tenant').result), err(REG.NOT_AUTH));
});

test('the same tenant extends from the end of the term, never past a week from now', async () => {
  const t = await leaseWorld();
  const h = t.simnet.burnBlockHeight;
  assert.equal(pp(t.L('rent', [U(t.shop), U(100), U(1000)], t.tenant).result), `(ok u${h + 100})`);
  assert.equal(pp(t.L('rent', [U(t.shop), U(100), U(1000)], t.tenant).result), `(ok u${h + 200})`, 'extension is added to the end');
  assert.equal(pp(t.L('rent', [U(t.shop), U(900), U(1000)], t.tenant).result), err(E.TOO_LONG), 'more than a week ahead is refused');
  assert.equal(pp(t.L('rent', [U(t.shop), U(808), U(1000)], t.tenant).result), `(ok u${h + 1008})`, 'exactly a week ahead is fine');
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
  assert.ok(pp(t.L('rent', [U(t.shop), U(50), U(1000)], t.tenant).result).startsWith('(ok'));
  const { w, tenant, other, shop } = t;
  // cannot hand the right on, cannot set policy, transfer, list or retitle, cannot add a child space
  assert.equal(pp(w.grant(tenant, shop, other, CAP.STATE, false, t.simnet.burnBlockHeight + 10).result), err(REG.NOT_AUTH));
  assert.equal(pp(w.call('set-policy', [U(shop), w.polOf(shop, { objects: 1 })], tenant).result), err(REG.NOT_AUTH));
  assert.equal(pp(w.call('propose-space-transfer', [U(shop), P(tenant)], tenant).result), err(REG.NOT_AUTH));
  assert.equal(pp(w.call('list-space', [U(shop), U(1), Cl.none()], tenant).result).startsWith('(err'), true);
  assert.equal(pp(w.space(tenant, { parent: shop, slug: 'x', kind: 1 }).result), err(REG.NOT_AUTH));
  // cannot touch the lessor's other space (the plot) or the hall
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
  // an offer wider than what the lessor delegated to the lease: the registry refuses the grant at rent time
  assert.equal(pp(t.L('offer', [U(t.shop), U(CAP.STATE | CAP.LINK), U(1), U(1), U(10)], t.lessor).result), OK);
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(1)], t.tenant).result), err(REG.CAPS));
  assert.ok(t.bal(t.tenant) > 0n);
});

test('without a grant from the owner the lease contract can issue nothing', async () => {
  const t = await leaseWorld({ grantLease: false });
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(1000)], t.tenant).result), err(REG.NOT_AUTH));
});

test('the lessor can pull the lease contract\'s grant: every tenant lapses at once', async () => {
  const t = await leaseWorld();
  assert.ok(pp(t.L('rent', [U(t.shop), U(100), U(1000)], t.tenant).result).startsWith('(ok'));
  assert.ok(pp(t.mine(t.tenant).result).startsWith('(ok'));
  assert.equal(pp(t.w.call('revoke', [U(t.shop), P(t.lease)], t.lessor).result), OK);
  assert.equal(pp(t.mine(t.tenant).result), err(REG.NOT_AUTH), 'what the lease issued lapses with its own grant');
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(1000)], t.other).result), err(REG.NOT_AUTH));
});

test('the lessor can still revoke a tenant directly in the registry (no refund: a known limit of this draft)', async () => {
  const t = await leaseWorld();
  assert.ok(pp(t.L('rent', [U(t.shop), U(100), U(1000)], t.tenant).result).startsWith('(ok'));
  assert.equal(pp(t.w.call('revoke', [U(t.shop), P(t.tenant)], t.lessor).result), OK);
  assert.equal(pp(t.mine(t.tenant).result), err(REG.NOT_AUTH));
});

test('a tenant can surrender; the space is free again at once', async () => {
  const t = await leaseWorld();
  assert.ok(pp(t.L('rent', [U(t.shop), U(100), U(1000)], t.tenant).result).startsWith('(ok'));
  assert.equal(pp(t.L('surrender', [U(t.shop)], t.other).result), err(E.NOT_AUTH));
  assert.equal(pp(t.L('surrender', [U(t.shop)], t.tenant).result), OK);
  assert.equal(pp(t.mine(t.tenant).result), err(REG.NOT_AUTH));
  assert.ok(pp(t.L('rent', [U(t.shop), U(5), U(1000)], t.other).result).startsWith('(ok'));
});

test('a sale of the space ends every lease and makes the old offer stale (the buyer is not bound)', async () => {
  const t = await leaseWorld();
  const { w } = t;
  assert.ok(pp(t.L('rent', [U(t.shop), U(100), U(1000)], t.tenant).result).startsWith('(ok'));
  // alice transfers the shop to wallet 4 (two steps); the epoch moves and every grant lapses
  const buyer = w.simnet.getAccounts().get('wallet_4');
  assert.equal(pp(w.call('propose-space-transfer', [U(t.shop), P(buyer)], t.lessor).result), OK);
  assert.ok(good(w.call('accept-space-transfer', [U(t.shop)], buyer)));
  assert.equal(pp(t.mine(t.tenant).result), err(REG.NOT_AUTH), 'the tenant\'s right went with the old owner');
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(1000)], t.other).result), err(E.STALE), 'the old offer no longer binds the new owner');
  // the new owner starts again: delegate and offer
  assert.equal(pp(w.grant(buyer, t.shop, t.lease, RENT_CAPS | CAP.GRANT).result), OK);
  assert.equal(pp(t.L('offer', [U(t.shop), U(RENT_CAPS), U(5), U(1), U(50)], buyer).result), OK);
  assert.ok(pp(t.L('rent', [U(t.shop), U(5), U(5)], t.other).result).startsWith('(ok'));
  assert.ok(pp(t.mine(t.other).result).startsWith('(ok'));
});

test('the operator\'s cut is taken from the rent, capped at 10%, and the lessor gets the rest', async () => {
  const t = await leaseWorld({ price: 1000, fee: 500 });                // 5%
  assert.equal(pp(t.L('set-fee', [U(1001), P(t.deployer)], t.deployer).result), err(E.INVALID));
  assert.equal(pp(t.L('set-fee', [U(500), P(t.deployer)], t.other).result), err(E.NOT_AUTH));
  const b = { l: t.bal(t.lessor), o: t.bal(t.deployer), t: t.bal(t.tenant) };
  assert.ok(pp(t.L('rent', [U(t.shop), U(100), U(1000)], t.tenant).result).startsWith('(ok'));
  assert.equal(t.bal(t.lessor) - b.l, 95_000n);
  assert.equal(t.bal(t.deployer) - b.o, 5_000n);
  assert.equal(b.t - t.bal(t.tenant), 100_000n);
});

test('free rentals work (price 0) and a cancelled offer stops new tenants but not the one already in', async () => {
  const t = await leaseWorld({ price: 0 });
  assert.ok(pp(t.L('rent', [U(t.shop), U(20), U(0)], t.tenant).result).startsWith('(ok'));
  assert.equal(pp(t.L('cancel-offer', [U(t.shop)], t.tenant).result), err(E.NOT_AUTH));
  assert.equal(pp(t.L('cancel-offer', [U(t.shop)], t.lessor).result), OK);
  assert.equal(pp(t.L('rent', [U(t.shop), U(5), U(0)], t.other).result), err(E.NO_OFFER));
  assert.ok(pp(t.mine(t.tenant).result).startsWith('(ok'), 'the tenant keeps the term he paid for');
});

test('a tenant\'s changes are scheduled states like anyone\'s, and the registry\'s own caps stay in force while the lease is live', async () => {
  const t = await leaseWorld();
  assert.ok(pp(t.L('rent', [U(t.shop), U(200), U(1000)], t.tenant).result).startsWith('(ok'));
  // a state that starts in the future is allowed inside the term; it can be seen in the timeline
  const h = t.simnet.burnBlockHeight;
  assert.ok(pp(t.w.addState(t.tenant, t.sign, { from: h + 50, patch: '{"text":"later"}' }).result).startsWith('(ok'));
  // after the lease expires the owner is back in control and the tenant's old state remains for the owner to retract or keep
  t.simnet.mineEmptyBurnBlocks(201);
  assert.ok(pp(t.w.addState(t.lessor, t.sign, { patch: '{"text":"owner again"}' }).result).startsWith('(ok'));
  assert.equal(pp(t.mine(t.tenant).result), err(REG.NOT_AUTH));
});
