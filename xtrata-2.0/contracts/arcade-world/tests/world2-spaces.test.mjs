// xtrata-world-v2: root owner, admins, spaces, policy ceilings, grants, moderation,
// transfer, sale and fees. Every test boots its own simnet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  world, standardWorld, S, U, P, ok, err, OK, CAP, ADM, POL, PLOT, idOf, good, pp, addr, Cl,
  bindingsArg, hash32, mockInscription,
} from './world2-helpers.mjs';

test('root owner: two-step hand-over; only the owner changes things; admins have narrow caps', async () => {
  const { deployer, W, call, ro } = await world();
  assert.equal(addr(ro('get-root').value.owner), deployer);
  assert.equal(pp(ro('get-interface')), '"xws-1"');
  // a stranger can do nothing
  assert.equal(pp(call('propose-root-owner', [P(W[0])], W[0]).result), err(300));
  assert.equal(pp(call('set-treasury', [P(W[0])], W[0]).result), err(300));
  assert.equal(pp(call('set-fees', [U(0), U(0), U(0)], W[0]).result), err(300));
  assert.equal(pp(call('set-admin', [P(W[0]), U(1)], W[0]).result), err(300));
  // hand-over needs the new owner to accept
  assert.equal(pp(call('accept-root-owner', [], W[0]).result), err(309));
  assert.equal(pp(call('propose-root-owner', [P(W[0])]).result), OK);
  assert.equal(pp(call('accept-root-owner', [], W[1]).result), err(300));
  assert.equal(pp(call('accept-root-owner', [], W[0]).result), OK);
  assert.equal(addr(ro('get-root').value.owner), W[0]);
  // the old owner has lost everything
  assert.equal(pp(call('set-treasury', [P(deployer)]).result), err(300));
  assert.equal(pp(call('set-treasury', [P(W[3])], W[0]).result), OK);
  // admins: caps are bits, owner only; a PAUSE admin can pause but not touch fees or admins
  assert.equal(pp(call('set-admin', [P(W[1]), U(16)], W[0]).result), err(303));
  assert.equal(pp(call('set-admin', [P(W[1]), U(ADM.PAUSE)], W[0]).result), OK);
  assert.equal(pp(call('set-paused', [Cl.bool(true)], W[1]).result), OK);
  assert.equal(pp(call('set-paused', [Cl.bool(false)], W[1]).result), OK);
  assert.equal(pp(call('set-fees', [U(0), U(0), U(0)], W[1]).result), err(300));
  assert.equal(pp(call('set-admin', [P(W[2]), U(1)], W[1]).result), err(300));
  assert.equal(pp(call('set-approved', [P(W[2]), Cl.bool(true)], W[1]).result), err(300));
  // removing an admin (caps 0) takes the rights away
  assert.equal(pp(call('set-admin', [P(W[1]), U(0)], W[0]).result), OK);
  assert.equal(pp(call('set-paused', [Cl.bool(true)], W[1]).result), err(300));
  assert.equal(ro('get-admin', [P(W[1])]).value, 0n);
  // a TRUST admin approves contracts
  call('set-admin', [P(W[2]), U(ADM.TRUST)], W[0]);
  assert.equal(pp(call('set-approved', [P(W[4]), Cl.bool(true)], W[2]).result), OK);
  assert.equal(pp(ro('is-approved', [P(W[4])])), 'true');
});

test('the root owner can be a contract (a multi-signature owner)', async () => {
  const { deployer, W, call, simnet } = await world();
  const owner = `${deployer}.mock-world-owner-v2`;
  assert.equal(pp(call('propose-root-owner', [P(owner)]).result), OK);
  // the contract accepts through its own relay
  const acc = simnet.callPublicFn('mock-world-owner-v2', 'relay-accept', [], W[0]);
  assert.equal(pp(acc.result), OK);
  // now only the contract acts: the old wallet is out, the relay works for anyone who can call it
  assert.equal(pp(call('set-treasury', [P(W[1])]).result), err(300));
  const r = simnet.callPublicFn('mock-world-owner-v2', 'relay-set-treasury', [P(W[1])], W[2]);
  assert.equal(pp(r.result), OK);
  const a = simnet.callPublicFn('mock-world-owner-v2', 'relay-set-admin', [P(W[3]), U(ADM.KINDS)], W[2]);
  assert.equal(pp(a.result), OK);
});

test('spaces: slugs unique among siblings, kinds and bounds checked, path resolves', async () => {
  const w = await standardWorld();
  const { deployer, W, ids, ro } = w;
  assert.equal(pp(w.space(deployer, { parent: ids.arcade, slug: 'lobby' }).result), err(304));       // duplicate slug
  assert.equal(pp(w.space(deployer, { parent: ids.arcade, slug: 'x', kind: 3 }).result), err(303));    // bad kind
  assert.equal(pp(w.space(deployer, { parent: ids.arcade, slug: '' }).result), err(303));              // empty slug
  assert.equal(pp(w.space(deployer, { parent: 999, slug: 'x' }).result), err(302));                    // no such parent
  assert.equal(pp(w.space(W[3], { parent: ids.arcade, slug: 'x' }).result), err(300));                 // not allowed
  assert.equal(pp(w.space(deployer, { parent: ids.arcade, slug: 'x', runtime: 4 }).result), err(303)); // bad runtime
  assert.equal(pp(w.space(W[0], { parent: ids.alice, slug: 'x', runtime: 3 }).result), err(300));      // hosted = root only
  assert.equal(pp(w.space(W[0], { parent: ids.alice, slug: 'x', runtime: 0 }).result), err(300));      // native = root only
  assert.equal(pp(ro('resolve-path', [Cl.list([S('arcade'), S('casino')])])), `(some u${ids.casino})`);
  assert.equal(pp(ro('resolve-path', [Cl.list([S('arcade'), S('nope')])])), 'none');
  assert.equal(pp(ro('resolve-path', [Cl.list([])])), '(some u1)');
  const casino = w.get(ids.casino);
  assert.equal(casino.runtime.value, 3n);
  assert.equal(casino.parent.value, BigInt(ids.arcade));
  assert.equal(casino.depth.value, 2n);
  assert.equal(addr(ro('get-space', [U(1)]).value.value.owner), deployer);
  // children are listed in order
  const kids = ro('get-children', [U(ids.arcade), U(0)]);
  assert.equal(kids.value.length, 16);
  assert.equal(kids.value.filter((k) => k.type === 'some').length, 3);
  assert.equal(kids.value[0].value.value.id.value, BigInt(ids.lobby));
});

test('policy ceilings only narrow: depth, children, runtimes, tiers, bindings, doors', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const sp = (o) => w.space(W[0], { parent: ids.alice, slug: o.slug ?? 'r', policy: o.policy ?? PLOT({ depth: 1 }), ...o });
  assert.equal(pp(sp({ policy: PLOT({ depth: 3 }) }).result), err(307));                  // deeper than alice allows
  assert.equal(pp(sp({ policy: PLOT({ children: 9, depth: 1 }) }).result), err(307));     // more children
  assert.equal(pp(sp({ policy: PLOT({ objects: 49, depth: 1 }) }).result), err(307));
  assert.equal(pp(sp({ policy: PLOT({ runtimes: 6, depth: 1 }) }).result), err(307));      // page runtime not allowed
  assert.equal(pp(sp({ policy: PLOT({ tiers: 7, depth: 1 }) }).result), err(307));         // tier 2 not allowed
  assert.equal(pp(sp({ policy: PLOT({ interfaces: 7, depth: 1 }) }).result), err(307));    // gate not allowed
  assert.equal(pp(sp({ policy: PLOT({ approved: false, depth: 1 }) }).result), err(307));  // may not drop approval
  assert.equal(pp(sp({ policy: PLOT({ pin: 0, depth: 1 }) }).result), err(307));           // may not open doors in
  assert.equal(pp(sp({ policy: PLOT({ pout: 0, depth: 1 }) }).result), err(307));          // may not open doors out
  assert.equal(pp(sp({ policy: POL({ ...{ depth: 1, runtimes: 2, tiers: 3, interfaces: 3, approved: true, pin: 1, pout: 2, children: 8, objects: 48, desc: 20 }, desc: 21 }) }).result), err(307));
  // a runtime the parent does not allow
  assert.equal(pp(sp({ runtime: 2 }).result), err(307)); // page is not allowed by the plot's policy
  // a narrower policy is fine; the plot is two levels deep, so a third level is refused
  assert.equal(pp(sp({ slug: 'studio', owner: W[1], policy: PLOT({ depth: 1, children: 2, objects: 5 }) }).result), ok(8));
  assert.equal(pp(w.space(W[1], { parent: 8, slug: 'attic', policy: PLOT({ depth: 0, children: 0, objects: 2 }) }).result), ok(9));
  assert.equal(pp(w.space(W[1], { parent: 9, slug: 'cellar', policy: PLOT({ depth: 0, children: 0, objects: 1 }) }).result), err(306));
  // set-policy: the owner can only narrow; an ancestor's owner may set anything inside the parent's policy
  const studio = 8;
  assert.equal(pp(w.call('set-policy', [U(studio), PLOT({ depth: 1, children: 3, objects: 5 })], W[1]).result), err(307)); // wider
  assert.equal(pp(w.call('set-policy', [U(studio), PLOT({ depth: 1, children: 1, objects: 4 })], W[1]).result), OK);
  assert.equal(pp(w.call('set-policy', [U(studio), PLOT({ depth: 1, children: 1, objects: 4 })], W[2]).result), err(300));
  assert.equal(pp(w.call('set-policy', [U(studio), PLOT({ depth: 1, children: 8, objects: 40 })], W[0]).result), OK); // above may widen
  assert.equal(pp(w.call('set-policy', [U(studio), PLOT({ depth: 1, children: 9, objects: 40 })], W[0]).result), err(307)); // not past the parent
  assert.equal(pp(w.call('set-policy', [U(studio), PLOT({ depth: 1, children: 8, objects: 40 })], deployer).result), OK);
  // the root can set root policy
  assert.equal(pp(w.call('set-policy', [U(1), POL({ children: 10 })]).result), OK);
});

test('descendant quotas run up the chain and are freed by retiring', async () => {
  const w = await standardWorld();
  const { deployer, ids } = w;
  assert.equal(pp(w.call('set-policy', [U(ids.arcade), w.polOf(ids.arcade, { desc: 5 })]).result), OK); // arcade already has 3 descendants
  assert.equal(pp(w.space(deployer, { parent: ids.arcade, slug: 'a' }).result.type), 'ok');
  assert.equal(pp(w.space(deployer, { parent: ids.arcade, slug: 'b' }).result.type), 'ok');
  assert.equal(pp(w.space(deployer, { parent: ids.arcade, slug: 'c' }).result), err(305));
  assert.equal(w.get(ids.arcade).descendants.value, 5n);
  // retiring a room frees a slot (slug stays reserved)
  const a = w.path(['arcade', 'a']);
  assert.equal(pp(w.setState(deployer, a, 3).result), OK);
  assert.equal(w.get(ids.arcade).descendants.value, 4n);
  assert.equal(w.get(ids.arcade).children.value, 4n);
  assert.equal(pp(w.space(deployer, { parent: ids.arcade, slug: 'a' }).result), err(304));
  assert.equal(pp(w.space(deployer, { parent: ids.arcade, slug: 'c' }).result.type), 'ok');
  // a space with live children cannot be retired
  assert.equal(pp(w.space(deployer, { parent: ids.plots, slug: 'bob', kind: 2, owner: w.W[1], policy: PLOT() }).result.type), 'ok');
  const bob = w.path(['plots', 'bob']);
  assert.equal(pp(w.space(w.W[1], { parent: bob, slug: 'den', policy: PLOT({ depth: 1 }) }).result.type), 'ok');
  assert.equal(pp(w.setState(w.W[1], bob, 3).result), err(308));
  // retired is final
  assert.equal(pp(w.setState(deployer, a, 1).result), err(308));
});

test('grants: delegates build within their caps; never more than the grantor holds; never MOD; expiry; revoke', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const alice = ids.alice;
  // a stranger cannot build in alice's plot; a delegate with CHILD can
  assert.equal(pp(w.space(W[2], { parent: alice, slug: 'd1', policy: PLOT({ depth: 1 }) }).result), err(300));
  assert.equal(pp(w.grant(W[0], alice, W[2], CAP.CHILD).result), OK);
  assert.equal(pp(w.space(W[2], { parent: alice, slug: 'd1', owner: W[2], policy: PLOT({ depth: 1 }) }).result.type), 'ok');
  // ... but cannot grant, and cannot build objects
  assert.equal(pp(w.grant(W[2], alice, W[3], CAP.CHILD).result), err(300));
  assert.equal(pp(w.object(W[2], alice, w.kinds.carpet).result), err(300));
  // a GRANT holder can only pass on caps they hold, and never MOD
  assert.equal(pp(w.grant(W[0], alice, W[3], CAP.GRANT | CAP.CHILD).result), OK);
  assert.equal(pp(w.grant(W[3], alice, W[4], CAP.OBJECT).result), err(319));
  assert.equal(pp(w.grant(W[3], alice, W[4], CAP.CHILD).result), OK);
  assert.equal(pp(w.grant(W[0], alice, W[4], CAP.MOD).result), err(319));
  assert.equal(pp(w.grant(W[0], alice, W[4], 0).result), err(303));
  assert.equal(pp(w.grant(W[0], alice, W[4], 512).result), err(303));
  // expiry is by burn height
  const until = w.h() + 4;
  assert.equal(pp(w.grant(W[0], alice, W[5], CAP.OBJECT, false, until).result), OK);
  assert.equal(pp(w.object(W[5], alice, w.kinds.carpet).result.type), 'ok');
  w.simnet.mineEmptyBurnBlocks(5);
  assert.equal(pp(w.object(W[5], alice, w.kinds.carpet).result), err(300));
  assert.equal(pp(w.grant(W[0], alice, W[5], CAP.OBJECT, false, w.h() - 1).result), err(303)); // already past
  // inherit: a grant on the plot reaches its rooms only when marked inherit
  const room = idOf(w.space(W[0], { parent: alice, slug: 'room', policy: PLOT({ depth: 1 }) }));
  assert.equal(pp(w.grant(W[0], alice, W[1], CAP.OBJECT, false).result), OK);
  assert.equal(pp(w.object(W[1], room, w.kinds.carpet).result), err(300));
  assert.equal(pp(w.grant(W[0], alice, W[1], CAP.OBJECT, true).result), OK);
  assert.equal(pp(w.object(W[1], room, w.kinds.carpet).result.type), 'ok');
  // revoke by a GRANT holder, by a moderator above, or by the delegate themselves
  assert.equal(pp(w.call('revoke', [U(alice), P(W[1])], W[0]).result), OK);
  assert.equal(pp(w.object(W[1], room, w.kinds.carpet).result), err(300));
  assert.equal(pp(w.call('revoke', [U(alice), P(W[2])], W[4]).result), err(300));
  assert.equal(pp(w.call('revoke', [U(alice), P(W[2])], W[2]).result), OK);
  assert.equal(pp(w.call('revoke', [U(alice), P(W[4])], deployer).result), OK); // root is above
  assert.equal(pp(w.space(W[4], { parent: alice, slug: 'late', policy: PLOT({ depth: 1 }) }).result), err(300));
});

test('moderation: ancestors suspend and unsuspend, owners cannot undo it, escape hatches stay open', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const alice = ids.alice;
  const obj = idOf(w.object(W[0], alice, w.kinds.carpet));
  assert.equal(pp(w.addState(W[0], obj).result), ok(0));
  // the owner cannot suspend; a stranger cannot; root (above) can
  assert.equal(pp(w.setState(W[0], alice, 2).result), err(300));
  assert.equal(pp(w.setState(W[3], alice, 2).result), err(300));
  assert.equal(pp(w.setState(deployer, alice, 2).result), OK);
  // suspended: the owner's writes stop everywhere in the subtree
  assert.equal(pp(w.object(W[0], alice, w.kinds.carpet).result), err(301));
  assert.equal(pp(w.space(W[0], { parent: alice, slug: 'x', policy: PLOT({ depth: 1 }) }).result), err(301));
  assert.equal(pp(w.addState(W[0], obj).result), err(301));
  assert.equal(pp(w.grant(W[0], alice, W[1], CAP.OBJECT).result), err(301));
  // the owner cannot lift it
  assert.equal(pp(w.setState(W[0], alice, 1).result), err(300));
  // escape hatches still work: retract a state, hide an object
  assert.equal(pp(w.call('retract-state', [U(obj), U(0)], W[0]).result), OK);
  assert.equal(pp(w.call('set-object-state', [U(obj), U(1)], W[0]).result), OK);
  // ancestors moderate but never edit: root cannot change alice's content
  assert.equal(pp(w.object(deployer, alice, w.kinds.carpet).result), err(301));
  assert.equal(pp(w.setState(deployer, alice, 1).result), OK);
  assert.equal(pp(w.object(deployer, alice, w.kinds.carpet).result), err(300)); // oversight is not a build right
  // a moderator admin (A-MOD) can also suspend, and a PAUSE-capable party can pause the subtree
  w.call('set-admin', [P(W[5]), U(ADM.MOD)]);
  assert.equal(pp(w.setState(W[5], alice, 2).result), OK);
  assert.equal(pp(w.setState(W[5], alice, 1).result), OK);
  assert.equal(pp(w.call('set-space-paused', [U(alice), Cl.bool(true)], W[0]).result), OK); // owner may pause own space
  assert.equal(pp(w.object(W[0], alice, w.kinds.carpet).result), err(301));
  assert.equal(pp(w.call('set-space-paused', [U(alice), Cl.bool(false)], W[3]).result), err(300));
  assert.equal(pp(w.call('set-space-paused', [U(alice), Cl.bool(false)], deployer).result), OK);
  // a suspended parent blocks the whole subtree, not only itself
  const room = idOf(w.space(W[0], { parent: alice, slug: 'room', policy: PLOT({ depth: 1 }) }));
  assert.equal(pp(w.setState(deployer, ids.plots, 2).result), OK);
  assert.equal(pp(w.object(W[0], room, w.kinds.carpet).result), err(301));
  assert.equal(pp(w.setState(deployer, ids.plots, 1).result), OK);
  // the root space cannot be suspended or retired
  assert.equal(pp(w.setState(deployer, 1, 2).result), err(308));
});

test('global pause stops writes; retract and hide still work; unpause restores', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const obj = idOf(w.object(W[0], ids.alice, w.kinds.carpet));
  w.addState(W[0], obj);
  w.call('set-paused', [Cl.bool(true)]);
  assert.equal(pp(w.object(W[0], ids.alice, w.kinds.carpet).result), err(301));
  assert.equal(pp(w.space(deployer, { parent: ids.arcade, slug: 'x' }).result), err(301));
  assert.equal(pp(w.addState(W[0], obj).result), err(301));
  assert.equal(pp(w.call('retract-state', [U(obj), U(0)], W[0]).result), OK);
  assert.equal(pp(w.call('set-object-state', [U(obj), U(1)], W[0]).result), OK);
  assert.equal(pp(w.call('set-paused', [Cl.bool(false)], W[0]).result), err(300));
  w.call('set-paused', [Cl.bool(false)]);
  assert.equal(pp(w.object(W[0], ids.alice, w.kinds.carpet).result.type), 'ok');
});

test('transfer: system spaces are locked; plots move in two steps; the epoch lapses grants and consents', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const alice = ids.alice;
  // system spaces: locked, nobody can unlock but the root owner
  assert.equal(pp(w.call('propose-space-transfer', [U(ids.casino), P(W[1])]).result), err(312));
  assert.equal(pp(w.call('set-transferable', [U(ids.casino), Cl.bool(true)], W[1]).result), err(300));
  assert.equal(pp(w.call('propose-space-transfer', [U(1), P(W[1])]).result), err(312));
  // plots: a delegate exists, then the plot is handed over
  w.grant(W[0], alice, W[3], CAP.CHILD);
  const keep = idOf(w.space(W[3], { parent: alice, slug: 'keep', owner: W[3], policy: PLOT({ depth: 1 }) }));
  assert.equal(pp(w.call('propose-space-transfer', [U(alice), P(W[1])], W[2]).result), err(300));
  assert.equal(pp(w.call('propose-space-transfer', [U(alice), P(W[1])], W[0]).result), OK);
  assert.equal(pp(w.call('accept-space-transfer', [U(alice)], W[2]).result), err(300));
  assert.equal(pp(w.call('accept-space-transfer', [U(ids.lobby)], W[1]).result), err(309));
  assert.equal(pp(w.call('accept-space-transfer', [U(alice)], W[1]).result), OK);
  assert.equal(addr(w.get(alice).owner), W[1]);
  assert.equal(w.get(alice).epoch.value, 1n);
  // the old owner and the old delegate are out; the new owner builds
  assert.equal(pp(w.object(W[0], alice, w.kinds.carpet).result), err(300));
  assert.equal(pp(w.space(W[3], { parent: alice, slug: 'late', owner: W[3], policy: PLOT({ depth: 1 }) }).result), err(300));
  assert.equal(pp(w.object(W[1], alice, w.kinds.carpet).result.type), 'ok');
  // the new owner can lock the plot again but not unlock it
  assert.equal(pp(w.call('set-transferable', [U(alice), Cl.bool(false)], W[1]).result), OK);
  assert.equal(pp(w.call('propose-space-transfer', [U(alice), P(W[0])], W[1]).result), err(312));
  assert.equal(pp(w.call('set-transferable', [U(alice), Cl.bool(true)], W[1]).result), err(300));
  assert.equal(pp(w.call('set-transferable', [U(alice), Cl.bool(true)]).result), OK);
  // cancel works
  w.call('propose-space-transfer', [U(alice), P(W[0])], W[1]);
  assert.equal(pp(w.call('cancel-space-transfer', [U(alice)], W[1]).result), OK);
  assert.equal(pp(w.call('accept-space-transfer', [U(alice)], W[0]).result), err(309));
  // children created by others stay where they are
  assert.equal(addr(w.get(keep).owner), W[3]);
  void deployer;
});

test('sale: price split with Xtrata, buyer-restricted listings, epoch invalidates stale listings', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const alice = ids.alice;
  w.call('set-treasury', [P(W[5])]);
  w.call('set-fees', [U(1000), U(0), U(0)]);
  w.simnet.mineEmptyBurnBlocks(144);
  // only the owner lists; a locked space cannot be listed
  assert.equal(pp(w.call('list-space', [U(alice), U(1_000_000), Cl.none()], W[2]).result), err(300));
  assert.equal(pp(w.call('list-space', [U(ids.casino), U(1), Cl.none()]).result), err(312));
  assert.equal(pp(w.call('buy-space', [U(alice)], W[2]).result), err(318)); // not listed
  // a listing for one buyer only
  w.call('list-space', [U(alice), U(1_000_000), Cl.some(P(W[3]))], W[0]);
  assert.equal(pp(w.call('buy-space', [U(alice)], W[2]).result), err(300));
  assert.equal(pp(w.call('buy-space', [U(alice)], W[0]).result), err(303)); // not your own
  const before = { seller: w.bal(W[0]), buyer: w.bal(W[3]), treasury: w.bal(W[5]) };
  assert.equal(pp(w.call('buy-space', [U(alice)], W[3]).result), OK);
  assert.equal(w.bal(W[3]), before.buyer - 1_000_000n);
  assert.equal(w.bal(W[5]), before.treasury + 100_000n);   // 10% to Xtrata
  assert.equal(w.bal(W[0]), before.seller + 900_000n);     // the rest to the seller
  assert.equal(addr(w.get(alice).owner), W[3]);
  assert.equal(w.ro('get-listing', [U(alice)]).type, 'none');
  assert.equal(pp(w.call('buy-space', [U(alice)], W[2]).result), err(318));
  // a stale listing dies with an ownership change by another route
  w.call('list-space', [U(alice), U(5), Cl.none()], W[3]);
  w.call('propose-space-transfer', [U(alice), P(W[4])], W[3]);
  w.call('accept-space-transfer', [U(alice)], W[4]);
  assert.equal(pp(w.call('buy-space', [U(alice)], W[2]).result), err(318));
  // delist
  w.call('list-space', [U(alice), U(5), Cl.none()], W[4]);
  assert.equal(pp(w.call('delist-space', [U(alice)], W[2]).result), err(300));
  assert.equal(pp(w.call('delist-space', [U(alice)], W[4]).result), OK);
  assert.equal(pp(w.call('buy-space', [U(alice)], W[2]).result), err(318));
  // free at the protocol level: with no fee set, the seller gets everything
  w.call('set-fees', [U(0), U(0), U(0)]);
  w.call('list-space', [U(alice), U(2_000_000), Cl.none()], W[4]);
  const s2 = w.bal(W[4]);
  const t2 = w.bal(W[5]);
  w.call('buy-space', [U(alice)], W[2]);
  assert.equal(w.bal(W[4]), s2 + 2_000_000n);
  assert.equal(w.bal(W[5]), t2);
  void deployer;
});

test('fees: capped; increases wait a day, decreases are immediate; creation split; flat floor; self and root exempt', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const alice = ids.alice;
  w.call('set-treasury', [P(W[5])]);
  // caps
  assert.equal(pp(w.call('set-fees', [U(2501), U(0), U(0)]).result), err(311));
  assert.equal(pp(w.call('set-fees', [U(0), U(50_000_001), U(0)]).result), err(311));
  assert.equal(pp(w.call('set-fees', [U(0), U(0), U(50_000_001)]).result), err(311));
  // an increase is pending for 144 burn blocks, with the current rate unchanged meanwhile
  const t0 = w.h();
  assert.equal(pp(w.call('set-fees', [U(1000), U(0), U(0)]).result), OK);
  let f = w.ro('get-fees').value;
  assert.equal(f.active.value.bps.value, 0n);
  assert.equal(f.pending.type, 'some');
  assert.equal(f.pending.value.value.at.value, BigInt(t0 + 144));
  w.simnet.mineEmptyBurnBlocks(143);
  assert.equal(w.ro('get-fees').value.active.value.bps.value, 0n);
  w.simnet.mineEmptyBurnBlocks(1);
  assert.equal(w.ro('get-fees').value.active.value.bps.value, 1000n);
  // alice charges 1 STX to create under her plot; W2 holds a CHILD grant
  w.call('set-policy', [U(alice), PLOT({ fee: 1_000_000 })], W[0]);
  w.grant(W[0], alice, W[2], CAP.CHILD);
  let b = { payer: w.bal(W[2]), alice: w.bal(W[0]), treasury: w.bal(W[5]) };
  assert.equal(pp(w.space(W[2], { parent: alice, slug: 'r1', owner: W[2], policy: PLOT({ depth: 1 }) }).result.type), 'ok');
  assert.equal(w.bal(W[2]), b.payer - 1_000_000n);
  assert.equal(w.bal(W[5]), b.treasury + 100_000n);
  assert.equal(w.bal(W[0]), b.alice + 900_000n);
  // the owner creating in her own plot pays no price (and, with no flat fee, nothing)
  b = { alice: w.bal(W[0]), treasury: w.bal(W[5]) };
  assert.equal(pp(w.space(W[0], { parent: alice, slug: 'r2', policy: PLOT({ depth: 1 }) }).result.type), 'ok');
  assert.equal(w.bal(W[0]), b.alice);
  assert.equal(w.bal(W[5]), b.treasury);
  // a flat floor: raise it (waits), then it applies to everyone but the root owner
  w.call('set-fees', [U(1000), U(300_000), U(0)]);
  assert.equal(w.ro('get-fees').value.active.value['create-flat'].value, 0n);
  w.simnet.mineEmptyBurnBlocks(144);
  b = { alice: w.bal(W[0]), treasury: w.bal(W[5]), payer: w.bal(W[2]) };
  w.space(W[2], { parent: alice, slug: 'r3', owner: W[2], policy: PLOT({ depth: 1 }) });
  assert.equal(w.bal(W[5]), b.treasury + 300_000n);            // flat beats 10% of 1 STX
  assert.equal(w.bal(W[0]), b.alice + 700_000n);
  assert.equal(w.bal(W[2]), b.payer - 1_000_000n);
  b = { alice: w.bal(W[0]), treasury: w.bal(W[5]) };
  w.space(W[0], { parent: alice, slug: 'r4', policy: PLOT({ depth: 1 }) });
  assert.equal(w.bal(W[5]), b.treasury + 300_000n);            // the owner pays the floor, never her own price
  assert.equal(w.bal(W[0]), b.alice - 300_000n);
  // a price below the floor: the payer pays the floor, the owner gets nothing
  w.call('set-policy', [U(alice), PLOT({ fee: 100_000 })], W[0]);
  b = { alice: w.bal(W[0]), treasury: w.bal(W[5]), payer: w.bal(W[2]) };
  w.space(W[2], { parent: alice, slug: 'r5', owner: W[2], policy: PLOT({ depth: 1 }) });
  assert.equal(w.bal(W[5]), b.treasury + 300_000n);
  assert.equal(w.bal(W[0]), b.alice);
  assert.equal(w.bal(W[2]), b.payer - 300_000n);
  // the root owner never pays
  w.call('set-policy', [U(ids.arcade), w.polOf(ids.arcade, { fee: 5_000_000 })]);
  b = { root: w.bal(deployer), treasury: w.bal(W[5]) };
  assert.equal(pp(w.space(deployer, { parent: ids.arcade, slug: 'free-for-root' }).result.type), 'ok');
  assert.equal(w.bal(deployer), b.root);
  assert.equal(w.bal(W[5]), b.treasury);
  // decreases are immediate and cancel a pending increase
  w.call('set-fees', [U(2000), U(300_000), U(0)]);
  assert.equal(w.ro('get-fees').value.pending.type, 'some');
  assert.equal(pp(w.call('set-fees', [U(500), U(100_000), U(0)]).result), OK);
  f = w.ro('get-fees').value;
  assert.equal(f.active.value.bps.value, 500n);
  assert.equal(f.active.value['create-flat'].value, 100_000n);
  assert.equal(f.pending.type, 'none');
  // a mixed change applies the decrease now and holds the increase
  w.call('set-fees', [U(400), U(200_000), U(0)]);
  f = w.ro('get-fees').value;
  assert.equal(f.active.value.bps.value, 400n);
  assert.equal(f.active.value['create-flat'].value, 100_000n);
  assert.equal(f.pending.type, 'some');
});

test('the flat transfer fee goes to Xtrata when a gift is accepted', async () => {
  const w = await standardWorld();
  const { W, ids } = w;
  w.call('set-treasury', [P(W[5])]);
  w.call('set-fees', [U(0), U(0), U(250_000)]);
  w.simnet.mineEmptyBurnBlocks(144);
  w.call('propose-space-transfer', [U(ids.alice), P(W[1])], W[0]);
  const b = { t: w.bal(W[5]), r: w.bal(W[1]) };
  assert.equal(pp(w.call('accept-space-transfer', [U(ids.alice)], W[1]).result), OK);
  assert.equal(w.bal(W[5]), b.t + 250_000n);
  assert.equal(w.bal(W[1]), b.r - 250_000n);
});

test('successor pointer: owner sets it, one-way lock', async () => {
  const { W, call, ro } = await world();
  assert.equal(pp(call('set-successor', [Cl.some(P(W[1]))], W[0]).result), err(300));
  assert.equal(pp(call('set-successor', [Cl.some(P(W[1]))]).result), OK);
  assert.equal(pp(call('lock-successor', [], W[0]).result), err(300));
  assert.equal(pp(call('lock-successor').result), OK);
  assert.equal(pp(call('set-successor', [Cl.none()]).result), err(310));
  assert.equal(ro('get-successor').value.locked.type, 'true');
});

test('every write bumps the version and prints an event', async () => {
  const { W, call, ro } = await world();
  const v0 = ro('get-version').value;
  const r = call('set-treasury', [P(W[1])]);
  assert.equal(ro('get-version').value, v0 + 1n);
  assert.ok(r.events.some((e) => e.event === 'print_event' && pp(e.data.value).includes('treasury-set')));
});

test('slugs are path pieces: lowercase letters, digits and dashes only', async () => {
  const w = await standardWorld();
  const { deployer, ids } = w;
  for (const bad of ['Hall', 'a b', 'a/b', 'a.b', 'café'.replace('é', 'e!'), 'UP']) {
    assert.equal(pp(w.space(deployer, { parent: ids.arcade, slug: bad }).result), err(303), bad);
  }
  for (const good of ['a', 'room-2', '0', 'x-y-z-1']) {
    assert.equal(w.space(deployer, { parent: ids.arcade, slug: good }).result.type, 'ok', good);
  }
});

test('tightening a parent tightens everything below it at once (effective policy)', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const feed = `${deployer}.mock-xtrata-core`;
  w.call('set-approved', [P(feed), Cl.bool(true)]);
  const room = idOf(w.space(W[0], { parent: ids.alice, slug: 'room', policy: PLOT({ depth: 1 }) }));
  w.setState(W[0], room, 1);
  const sign = idOf(w.object(W[0], room, w.kinds.sign));
  assert.equal(pp(w.call('set-bindings', [U(sign), bindingsArg([['feed', feed, 1]])], W[0]).result), OK);
  // the plots domain stops allowing display bindings and recipes and composed rooms: alice's stored policy is untouched,
  // but nothing below plots can use them any more
  assert.equal(pp(w.call('set-policy', [U(ids.plots), w.polOf(ids.plots, { interfaces: 2, tiers: 1 })]).result), OK);
  assert.equal(w.get(ids.alice).policy.value.interfaces.value, 3n);                 // stored value unchanged
  assert.equal(pp(w.call('set-bindings', [U(sign), bindingsArg([['feed', feed, 1]])], W[0]).result), err(317));
  assert.equal(pp(w.call('set-bindings', [U(sign), bindingsArg([['state', feed, 2]])], W[0]).result), OK);
  assert.equal(pp(w.kind(W[0], { space: ids.alice, tier: 1, srcId: 1, hash: hash32(1), size: 10 }).result), err(307));
  // object quota: plots now allows only 2 objects anywhere beneath it
  w.call('set-policy', [U(ids.plots), w.polOf(ids.plots, { objects: 2 })]);
  assert.equal(pp(w.object(W[0], room, w.kinds.stool).result.type), 'ok');             // second object in the room
  assert.equal(pp(w.object(W[0], room, w.kinds.stool).result), err(305));              // third refused
  // doors: closing doors in at the plots level shuts every space below it
  const door = idOf(w.object(deployer, ids.lobby, w.kinds.door));
  w.call('set-policy', [U(ids.plots), w.polOf(ids.plots, { pin: 2 })]);
  assert.equal(pp(w.portal(deployer, door, room).result), err(316));
  // child spaces cannot be deeper than any ancestor's ceiling
  w.call('set-policy', [U(ids.plots), w.polOf(ids.plots, { depth: 2 })]);                // plots depth 1 + 2 = 3: alice (2) can hold rooms (3) only
  assert.equal(pp(w.space(W[0], { parent: room, slug: 'attic', policy: PLOT({ depth: 0 }) }).result), err(306));
});

test('a kind registrar is limited per space, admins are not; the treasury wallet can still pay fees', async () => {
  const w = await standardWorld();
  const { deployer, W, ids, simnet } = w;
  for (let i = 0; i < 16; i++) mockInscription(simnet, deployer, 900 + i, { hash: hash32(i), size: 100, creator: W[0] });
  for (let i = 0; i < 16; i++) {
    assert.equal(w.kind(W[0], { space: ids.alice, tier: 1, srcId: 900 + i, hash: hash32(i), size: 100, name: `k${i}` }).result.type, 'ok', `kind ${i}`);
  }
  assert.equal(pp(w.kind(W[0], { space: ids.alice, tier: 1, srcId: 900, hash: hash32(0), size: 100 }).result), err(305));
  assert.equal(w.kind(deployer, { space: ids.alice, name: 'admin one' }).result.type, 'ok');
  // a payer who is also the treasury pays nothing to itself and the action still works
  w.call('set-treasury', [P(W[2])]);
  w.call('set-fees', [U(0), U(100_000), U(0)]);
  simnet.mineEmptyBurnBlocks(144);
  w.grant(W[0], ids.alice, W[2], CAP.CHILD);
  const before = w.bal(W[2]);
  assert.equal(pp(w.space(W[2], { parent: ids.alice, slug: 'mine', owner: W[2], policy: PLOT({ depth: 1 }) }).result.type), 'ok');
  assert.equal(w.bal(W[2]), before);
});
