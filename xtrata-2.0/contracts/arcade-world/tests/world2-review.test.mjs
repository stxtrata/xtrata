// xtrata-world-v2: regression tests for the findings of the independent review
// (grant reach and escalation, root epoch, sticky moderation, sale safety, doors,
// slot griefing, stale timelines, the review lane, policy widening, overflow caps).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  standardWorld, S, U, P, err, OK, CAP, ADM, PLOT, POL, TF, idOf, pp, addr, Cl, stateArg,
} from './world2-helpers.mjs';

test('F1 inherited grants never reach a space held by someone else, or one since sold on', async () => {
  const w = await standardWorld();
  const { W, ids } = w;
  const alice = ids.alice;
  // alice makes one room for herself and one that belongs to W1
  const mine = idOf(w.space(W[0], { parent: alice, slug: 'mine', policy: PLOT({ depth: 1 }) }));
  const theirs = idOf(w.space(W[0], { parent: alice, slug: 'theirs', owner: W[1], policy: PLOT({ depth: 1 }) }));
  w.setState(W[0], mine, 1); w.setState(W[1], theirs, 1);
  assert.equal(pp(w.grant(W[0], alice, W[3], CAP.OBJECT, true).result), OK);
  assert.equal(pp(w.object(W[3], mine, w.kinds.carpet).result.type), 'ok');          // her own room: reached
  assert.equal(pp(w.object(W[3], theirs, w.kinds.carpet).result), err(300));         // W1's room: not reached
  // the room alice delegated into is sold on: the old delegate loses it
  assert.equal(pp(w.call('propose-space-transfer', [U(mine), P(W[2])], W[0]).result), OK);
  assert.equal(pp(w.call('accept-space-transfer', [U(mine)], W[2]).result), OK);
  assert.equal(pp(w.object(W[3], mine, w.kinds.carpet).result), err(300));
});

test('F2/F12 delegates cannot escalate or overwrite; only the owner, a moderator or the issuer change a grant', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const alice = ids.alice;
  assert.equal(pp(w.grant(W[0], alice, W[3], CAP.GRANT | CAP.CHILD).result), OK);        // owner issues a granter
  const soon = w.h() + 100;
  assert.equal(pp(w.grant(W[3], alice, W[4], CAP.CHILD, false, soon).result), OK);
  assert.equal(pp(w.grant(W[3], alice, W[5], CAP.CHILD | CAP.GRANT, false, soon).result), err(319)); // cannot pass on GRANT
  assert.equal(pp(w.grant(W[3], alice, W[5], CAP.CHILD, true, soon).result), err(319));              // cannot inherit
  assert.equal(pp(w.grant(W[3], alice, W[5], CAP.CHILD, false, 0).result), err(319));                // cannot be permanent
  assert.equal(pp(w.grant(W[3], alice, W[5], CAP.CHILD, false, w.h() + 2000).result), err(319));     // cannot be long
  // the owner gives W4 a permanent grant: the granter cannot touch it
  assert.equal(pp(w.grant(W[0], alice, W[4], CAP.CHILD | CAP.OBJECT).result), OK);
  assert.equal(pp(w.grant(W[3], alice, W[4], CAP.CHILD, false, soon).result), err(300));
  assert.equal(pp(w.call('revoke', [U(alice), P(W[4])], W[3]).result), err(300));
  // ... but the issuer can revoke their own grants, and a grantee can drop theirs
  assert.equal(pp(w.grant(W[3], alice, W[5], CAP.CHILD, false, soon).result), OK);
  assert.equal(pp(w.call('revoke', [U(alice), P(W[5])], W[3]).result), OK);
  assert.equal(pp(w.call('revoke', [U(alice), P(W[4])], W[4]).result), OK);
  // a moderator above can revoke anyone's
  assert.equal(pp(w.grant(W[3], alice, W[5], CAP.CHILD, false, soon).result), OK);
  assert.equal(pp(w.call('revoke', [U(alice), P(W[5])], deployer).result), OK);
});

test('F3 a new root owner starts a new epoch: old root grants lapse', async () => {
  const w = await standardWorld();
  const { W } = w;
  assert.equal(pp(w.grant(w.deployer, 1, W[3], CAP.CHILD).result), OK);
  assert.equal(pp(w.space(W[3], { parent: 1, slug: 'extra', policy: PLOT({ depth: 1 }) }).result.type), 'ok');
  assert.equal(pp(w.call('propose-root-owner', [P(W[1])]).result), OK);
  assert.equal(pp(w.call('accept-root-owner', [], W[1]).result), OK);
  assert.equal(w.get(1).epoch.value, 1n);
  assert.equal(addr(w.get(1).owner), W[1]);
  assert.equal(pp(w.space(W[3], { parent: 1, slug: 'extra2', policy: PLOT({ depth: 1 }) }).result), err(300));
});

test('F4 moderation sticks: owners cannot unhide, edit or unpause what a moderator acted on', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const alice = ids.alice;
  const obj = idOf(w.object(W[0], alice, w.kinds.carpet));
  const setObj = (sender, st) => w.call('set-object-state', [U(obj), U(st)], sender);
  // moderators only may set "moderated"
  assert.equal(pp(setObj(W[0], 3).result), err(300));
  assert.equal(pp(setObj(W[3], 3).result), err(300));
  assert.equal(pp(setObj(deployer, 3).result), OK);
  assert.equal(w.getObj(obj).state.value, 3n);
  // the owner is locked out of it: no unhide, no hide, no edit, no states, no bindings
  assert.equal(pp(setObj(W[0], 0).result), err(300));
  assert.equal(pp(setObj(W[0], 1).result), err(300));
  assert.equal(pp(w.call('set-object', [U(obj), S('x'), TF(), S('{}')], W[0]).result), err(308));
  assert.equal(pp(w.addState(W[0], obj).result), err(308));
  // a moderator restores it; an A-MOD admin can moderate too
  assert.equal(pp(setObj(deployer, 0).result), OK);
  w.call('set-admin', [P(W[5]), U(ADM.MOD)]);
  assert.equal(pp(setObj(W[5], 3).result), OK);
  // the owner may still retire it (frees the slot)
  assert.equal(pp(setObj(W[0], 2).result), OK);
  // a moderator can evict an object even while the space is suspended and they hold no build right
  const o2 = idOf(w.object(W[0], alice, w.kinds.carpet));
  w.setState(deployer, alice, 2);
  assert.equal(pp(w.call('set-object-state', [U(o2), U(2)], W[5]).result), OK);
  w.setState(deployer, alice, 1);
  // pausing: a pause from above cannot be lifted by the owner
  assert.equal(pp(w.call('set-space-paused', [U(alice), Cl.bool(true)], deployer).result), OK);
  assert.equal(w.get(alice).paused.value, 2n);
  assert.equal(pp(w.call('set-space-paused', [U(alice), Cl.bool(false)], W[0]).result), err(300));
  assert.equal(pp(w.object(W[0], alice, w.kinds.carpet).result), err(301));
  assert.equal(pp(w.call('set-space-paused', [U(alice), Cl.bool(false)], deployer).result), OK);
  // the owner's own pause is theirs to lift
  assert.equal(pp(w.call('set-space-paused', [U(alice), Cl.bool(true)], W[0]).result), OK);
  assert.equal(w.get(alice).paused.value, 1n);
  assert.equal(pp(w.call('set-space-paused', [U(alice), Cl.bool(false)], W[0]).result), OK);
  // unhiding while suspended is not an escape hatch (only hiding is)
  const o3 = idOf(w.object(W[0], alice, w.kinds.carpet));
  w.call('set-object-state', [U(o3), U(1)], W[0]);
  w.setState(deployer, alice, 2);
  assert.equal(pp(w.call('set-object-state', [U(o3), U(0)], W[0]).result), err(301));
  assert.equal(pp(w.call('compact-object', [U(o3)], W[0]).result), err(301));
});

test('F5 sales name the price and the version; the buyer pays the flat transfer fee; content writes move the version', async () => {
  const w = await standardWorld();
  const { W, ids } = w;
  const alice = ids.alice;
  w.call('set-treasury', [P(W[5])]);
  w.call('set-fees', [U(0), U(0), U(500_000)]);
  w.simnet.mineEmptyBurnBlocks(144);
  w.call('list-space', [U(alice), U(1_000_000), Cl.none()], W[0]);
  const ver = () => w.get(alice).version;
  // the price the buyer saw must be the price on the listing
  assert.equal(pp(w.call('buy-space', [U(alice), U(900_000), ver(), U(1_000_000)], W[2]).result), err(303));
  // the seller edits the content: the version moves and the old sale no longer lands
  const seen = ver();
  const obj = idOf(w.object(W[0], alice, w.kinds.carpet));
  const v1 = ver();
  assert.notEqual(seen.value, v1.value);
  w.call('set-object', [U(obj), S('swapped'), TF(), S('{}')], W[0]);
  assert.notEqual(v1.value, ver().value);
  const v2 = ver();
  w.addState(W[0], obj);
  assert.notEqual(v2.value, ver().value);
  assert.equal(pp(w.call('buy-space', [U(alice), U(1_000_000), seen, U(1_000_000)], W[2]).result), err(308));
  // the right price and version succeed; the buyer pays price (the flat comes out of it)
  const before = { s: w.bal(W[0]), b: w.bal(W[2]), t: w.bal(W[5]) };
  assert.equal(pp(w.call('buy-space', [U(alice), U(1_000_000), ver(), U(1_000_000)], W[2]).result), OK);
  assert.equal(w.bal(W[2]), before.b - 1_000_000n);
  assert.equal(w.bal(W[5]), before.t + 500_000n);
  assert.equal(w.bal(W[0]), before.s + 500_000n);
  assert.equal(w.ro('get-listing', [U(alice)]).type, 'none');
});

test('F6 doors: external paths are plain site paths; internal doors carry no path; external ones no arrival', async () => {
  const w = await standardWorld();
  const { deployer, ids } = w;
  const door = idOf(w.object(deployer, ids.hall, w.kinds.door));
  const ext = (path, arrival = 0) => pp(w.portal(deployer, door, 0, arrival, path).result);
  assert.equal(ext('/play'), OK);
  assert.equal(ext('/play/a-b_c.d~e?x=1&y=2%20#top'), OK);
  assert.equal(ext('//evil.example'), err(316));
  assert.equal(ext('/\\evil'), err(316));
  assert.equal(ext('/a b'), err(316));
  assert.equal(ext('/a"b'), err(316));
  assert.equal(ext('/a<b'), err(316));
  assert.equal(ext('play'), err(316));
  assert.equal(ext('/play', 5), err(316));
  // an internal door: no path
  assert.equal(pp(w.portal(deployer, door, ids.lobby, 0, '/sneaky').result), err(316));
  assert.equal(pp(w.portal(deployer, door, ids.lobby, 0, '').result), OK);
});

test('F7 create-and-retire cannot fill the slot indexes; the last item moves into the gap', async () => {
  const w = await standardWorld();
  const { deployer, ids } = w;
  // children: 70 create/retire cycles in a parent that allows 64
  for (let i = 0; i < 70; i++) {
    const r = w.space(deployer, { parent: ids.arcade, slug: 'tmp', kind: 1 });
    assert.equal(r.result.type, 'ok', `cycle ${i}: ${pp(r.result)}`);
    assert.equal(pp(w.setState(deployer, idOf(r), 3).result), OK);
  }
  assert.equal(w.get(ids.arcade)['child-slots'].value, w.get(ids.arcade).children.value);
  // middle removal keeps the index dense and the moved child's own pointer right
  const a = idOf(w.space(deployer, { parent: ids.arcade, slug: 'a' }));
  const b = idOf(w.space(deployer, { parent: ids.arcade, slug: 'b' }));
  const c = idOf(w.space(deployer, { parent: ids.arcade, slug: 'c' }));
  assert.equal(pp(w.setState(deployer, a, 3).result), OK);
  const kids = w.ro('get-children', [U(ids.arcade), U(0)]).value.filter((x) => x.type === 'some');
  assert.equal(BigInt(kids.length), w.get(ids.arcade).children.value);
  assert.equal(pp(w.setState(deployer, c, 3).result), OK);
  assert.equal(pp(w.setState(deployer, b, 3).result), OK);
  const after = w.ro('get-children', [U(ids.arcade), U(0)]).value.filter((x) => x.type === 'some');
  assert.equal(after.length, 3);                                  // lobby, casino, hall remain
  assert.equal(w.get(ids.arcade)['child-slots'].value, 3n);
  assert.equal(w.get(ids.arcade).children.value, 3n);
  // objects: 140 create/retire cycles in a room that allows 128 live objects
  for (let i = 0; i < 140; i++) {
    const r = w.object(deployer, ids.hall, w.kinds.stool);
    assert.equal(r.result.type, 'ok', `object cycle ${i}: ${pp(r.result)}`);
    assert.equal(pp(w.call('set-object-state', [U(idOf(r)), U(2)]).result), OK);
  }
  assert.equal(w.get(ids.hall)['object-slots'].value, 0n);
  assert.equal(w.get(ids.hall).objects.value, 0n);
  // retiring an object in the middle moves the last one into its place
  const o1 = idOf(w.object(deployer, ids.hall, w.kinds.stool, { name: 'one' }));
  idOf(w.object(deployer, ids.hall, w.kinds.stool, { name: 'two' }));
  idOf(w.object(deployer, ids.hall, w.kinds.stool, { name: 'three' }));
  assert.equal(pp(w.call('set-object-state', [U(o1), U(2)]).result), OK);
  const objs = w.ro('get-objects', [U(ids.hall), U(0)]).value.filter((x) => x.type === 'some');
  assert.equal(objs.length, 2);
  assert.equal(objs[0].value.value.object.value.value.name.value, 'three');
  assert.equal(objs[1].value.value.object.value.value.name.value, 'two');
  // the moved object can itself be retired afterwards without damaging the index
  const three = objs[0].value.value.id.value;
  assert.equal(pp(w.call('set-object-state', [U(three), U(2)]).result), OK);
  const last = w.ro('get-objects', [U(ids.hall), U(0)]).value.filter((x) => x.type === 'some');
  assert.equal(last.length, 1);
  assert.equal(last[0].value.value.object.value.value.name.value, 'two');
});

test('F8 states scheduled by a previous owner do not survive a sale', async () => {
  const w = await standardWorld();
  const { W, ids } = w;
  const alice = ids.alice;
  const obj = idOf(w.object(W[0], alice, w.kinds.sign));
  assert.equal(pp(w.addState(W[0], obj, { from: w.h() + 10, patch: '{"text":"old owner"}' }).result), '(ok u0)');
  w.call('propose-space-transfer', [U(alice), P(W[1])], W[0]);
  w.call('accept-space-transfer', [U(alice)], W[1]);
  w.simnet.mineEmptyBurnBlocks(12);
  const view = w.ro('get-object-view', [U(obj)]).value.value;
  assert.equal(view['active-seq'].type, 'none');
  assert.equal(view['next-height'].type, 'none');
  // the new owner schedules their own, and compaction drops the stale entry
  assert.equal(pp(w.addState(W[1], obj, { patch: '{"text":"new owner"}' }).result), '(ok u1)');
  const view2 = w.ro('get-object-view', [U(obj)]).value.value;
  assert.equal(view2['active-seq'].value.value, 1n);
  assert.equal(pp(w.call('compact-object', [U(obj)], W[1]).result), OK);
  assert.equal(w.ro('get-timeline', [U(obj)]).value.length, 1);
});

test('F9 the review lane covers edits: a delegate edit sends visible content back to hidden', async () => {
  const w = await standardWorld();
  const { W, ids } = w;
  const room = idOf(w.space(W[0], { parent: ids.alice, slug: 'rev', policy: PLOT({ depth: 1, review: true }) }));
  w.setState(W[0], room, 1);
  assert.equal(pp(w.grant(W[0], room, W[3], CAP.OBJECT | CAP.LINK | CAP.STATE).result), OK);
  const obj = idOf(w.object(W[3], room, w.kinds.sign));
  assert.equal(w.getObj(obj).state.value, 1n);                                            // hidden on arrival
  assert.equal(pp(w.call('set-object-state', [U(obj), U(0)], W[3]).result), err(300));    // the delegate cannot show it
  assert.equal(pp(w.call('set-object-state', [U(obj), U(0)], W[0]).result), OK);
  assert.equal(w.getObj(obj).state.value, 0n);
  // the owner's edits keep it visible
  w.call('set-object', [U(obj), S('mine'), TF(), S('{}')], W[0]);
  assert.equal(w.getObj(obj).state.value, 0n);
  // the delegate's edit hides it again, whether params, bindings...
  w.call('set-object', [U(obj), S('theirs'), TF(), S('{"a":1}')], W[3]);
  assert.equal(w.getObj(obj).state.value, 1n);
  w.call('set-object-state', [U(obj), U(0)], W[0]);
  assert.equal(pp(w.call('set-bindings', [U(obj), Cl.list([])], W[3]).result), OK);
  assert.equal(w.getObj(obj).state.value, 1n);
  // ... or doors
  const door = idOf(w.object(W[0], room, w.kinds.door));
  assert.equal(pp(w.call('set-object-state', [U(door), U(0)], W[0]).result), OK);
  w.portal(W[3], door, room, 0, '');
  assert.equal(w.getObj(door).state.value, 1n);
});

test('F10 only the root owner widens a policy; the creation fee is the owner\'s to set', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const alice = ids.alice;
  w.call('set-admin', [P(W[5]), U(ADM.MOD)]);
  // a MOD admin and an ancestor can narrow but not widen, and cannot touch the fee
  assert.equal(pp(w.call('set-policy', [U(alice), w.polOf(alice, { objects: 30 })], W[5]).result), OK);
  assert.equal(pp(w.call('set-policy', [U(alice), w.polOf(alice, { objects: 40 })], W[5]).result), err(307));
  assert.equal(pp(w.call('set-policy', [U(alice), w.polOf(alice, { fee: 1000 })], W[5]).result), err(300));
  // the owner sets their own fee
  assert.equal(pp(w.call('set-policy', [U(alice), w.polOf(alice, { fee: 1000 })], W[0]).result), OK);
  assert.equal(pp(w.call('set-policy', [U(alice), w.polOf(alice, { objects: 48 })], deployer).result), OK);
});

test('F11 prices and fees are capped so split arithmetic cannot overflow', async () => {
  const w = await standardWorld();
  const { W, ids } = w;
  const huge = 1_000_000_000_000_001n;
  assert.equal(pp(w.call('set-policy', [U(ids.alice), w.polOf(ids.alice, { fee: huge })], W[0]).result), err(303));
  assert.equal(pp(w.call('list-space', [U(ids.alice), Cl.uint(huge), Cl.none()], W[0]).result), err(303));
  assert.equal(pp(w.call('list-space', [U(ids.alice), Cl.uint(1_000_000_000_000_000n), Cl.none()], W[0]).result), OK);
});
