// xtrata-world-v2: kinds, objects, states, doors (portals), bindings and paged reads.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  world, standardWorld, S, U, P, ok, err, OK, CAP, ADM, POL, PLOT, TF, idOf, good, pp, addr, Cl,
  stateArg, bindingsArg, hash32, mockInscription,
} from './world2-helpers.mjs';

const view = (w, obj) => w.ro('get-object-view', [U(obj)]).value.value;
const activeSeq = (w, obj) => {
  const a = view(w, obj)['active-seq'];
  return a.type === 'some' ? Number(a.value.value) : null;
};
const nextHeight = (w, obj) => {
  const n = view(w, obj)['next-height'];
  return n.type === 'some' ? Number(n.value.value) : null;
};

test('kinds: built-ins and in-hall modules need an admin; recipes need an inscription; modules wait for approval', async () => {
  const w = await standardWorld();
  const { deployer, W, ids, simnet } = w;
  const hh = hash32(3);
  mockInscription(simnet, deployer, 700, { hash: hh, size: 2000, creator: W[0] });
  mockInscription(simnet, deployer, 701, { hash: hh, size: 50_000, creator: deployer });
  mockInscription(simnet, deployer, 702, { hash: hh, size: 9000, creator: W[0] });
  // tier 0 and 3: root owner or KINDS admin only
  assert.equal(pp(w.kind(W[0], { space: ids.alice, tier: 0, builtin: 'x' }).result), err(300));
  assert.equal(pp(w.kind(W[0], { space: ids.alice, tier: 3, srcId: 701, hash: hh, size: 50_000 }).result), err(300));
  // validation
  assert.equal(pp(w.kind(deployer, { category: 11 }).result), err(303));
  assert.equal(pp(w.kind(deployer, { tier: 4 }).result), err(303));
  assert.equal(pp(w.kind(deployer, { name: '' }).result), err(303));
  assert.equal(pp(w.kind(deployer, { tier: 0, builtin: '' }).result), err(303));
  // a stranger cannot register in alice's plot; the owner can, within the plot's tiers
  assert.equal(pp(w.kind(W[3], { space: ids.alice, tier: 1, srcId: 700, hash: hh, size: 2000 }).result), err(300));
  assert.equal(pp(w.kind(W[0], { space: ids.alice, tier: 1, srcId: 700, hash: hh, size: 2001 }).result), err(314));      // wrong size
  assert.equal(pp(w.kind(W[0], { space: ids.alice, tier: 1, srcId: 700, hash: hash32(4), size: 2000 }).result), err(314)); // wrong hash
  assert.equal(pp(w.kind(W[0], { space: ids.alice, tier: 1, srcId: 999, hash: hh, size: 2000 }).result), err(314));       // no such inscription
  assert.equal(pp(w.kind(W[1], { space: ids.alice, tier: 1, srcId: 700, hash: hh, size: 2000 }).result), err(300));
  assert.equal(pp(w.kind(W[0], { space: ids.alice, tier: 1, srcId: 702, hash: hh, size: 9000 }).result), err(314));      // over the 8 KB recipe cap
  const recipe = idOf(w.kind(W[0], { space: ids.alice, category: 3, name: 'Recipe', tier: 1, srcId: 700, hash: hh, size: 2000 }));
  assert.equal(w.ro('get-kind', [U(recipe)]).value.value.approved.type, 'true');
  assert.equal(pp(w.kind(W[0], { space: ids.alice, tier: 1, builtin: 'x', srcId: 700, hash: hh, size: 2000 }).result), err(303)); // recipe carries no built-in key
  // alice's plot does not allow tier 2 modules
  assert.equal(pp(w.kind(W[0], { space: ids.alice, tier: 2, srcId: 701, hash: hh, size: 50_000 }).result), err(307));
  // an admin registers a module in the arcade: unusable until approved
  const mod = idOf(w.kind(deployer, { space: ids.lobby, category: 3, name: 'Module', tier: 2, srcId: 701, hash: hh, size: 50_000 }));
  assert.equal(w.ro('get-kind', [U(mod)]).value.value.approved.type, 'false');
  assert.equal(pp(w.object(deployer, ids.lobby, mod).result), err(313));
  assert.equal(pp(w.call('approve-kind', [U(mod), Cl.bool(true)], W[0]).result), err(300));
  w.call('set-admin', [P(W[4]), U(ADM.KINDS)]);
  assert.equal(pp(w.call('approve-kind', [U(mod), Cl.bool(true)], W[4]).result), OK);
  assert.equal(pp(w.object(deployer, ids.lobby, mod).result.type), 'ok');
  // hidden kinds cannot be used for new objects; existing ones stay
  assert.equal(pp(w.call('set-kind-hidden', [U(mod), Cl.bool(true)], W[0]).result), err(300));
  assert.equal(pp(w.call('set-kind-hidden', [U(mod), Cl.bool(true)], W[4]).result), OK);
  assert.equal(pp(w.object(deployer, ids.lobby, mod).result), err(313));
  // a recipe is usable in the plot, but not in a room limited to built-ins
  assert.equal(pp(w.object(W[0], ids.alice, recipe).result.type), 'ok');
  const strict = idOf(w.space(W[0], { parent: ids.alice, slug: 'strict', policy: PLOT({ depth: 1, tiers: 1 }) }));
  assert.equal(pp(w.object(W[0], strict, recipe).result), err(313));
  assert.equal(pp(w.object(W[0], strict, w.kinds.carpet).result.type), 'ok');
  assert.equal(Number(w.ro('get-kind-count').value), 4 + 2);
  assert.equal(w.ro('get-kinds', [Cl.list([U(0), U(1), U(99)])]).value.length, 3);
});

test('objects: created within quotas, nesting and kinds; edited, hidden and retired', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const alice = ids.alice;
  // permissions and validation
  assert.equal(pp(w.object(W[3], alice, w.kinds.carpet).result), err(300));
  assert.equal(pp(w.object(W[0], 999, w.kinds.carpet).result), err(302));
  assert.equal(pp(w.object(W[0], alice, 99).result), err(313));
  assert.equal(pp(w.object(W[0], alice, w.kinds.carpet, { name: '' }).result), err(303));
  assert.equal(pp(w.object(W[0], alice, w.kinds.carpet, { transform: TF(100001) }).result), err(303));
  assert.equal(pp(w.object(W[0], alice, w.kinds.carpet, { transform: TF(0, 0, 0, 36000) }).result), err(303));
  assert.equal(pp(w.object(W[0], alice, w.kinds.carpet, { transform: TF(0, 0, 0, 0, 0) }).result), err(303));
  assert.equal(pp(w.object(W[0], alice, w.kinds.carpet, { transform: TF(0, 0, 0, 0, 10001) }).result), err(303));
  const floor = idOf(w.object(W[0], alice, w.kinds.carpet, { name: 'floor', transform: TF(-250, 0, 12, 9000, 150), params: '{"colour":"#8a1c1c"}' }));
  const o = w.getObj(floor);
  assert.equal(o.space.value, BigInt(alice));
  assert.equal(o.params.value, '{"colour":"#8a1c1c"}');
  assert.equal(o.transform.value.x.value, -250n);
  assert.equal(o.state.value, 0n);
  assert.equal(w.get(alice).objects.value, 1n);
  // edit
  assert.equal(pp(w.call('set-object', [U(floor), S('rug'), TF(1, 2, 3), S('{"colour":"#000"}')], W[3]).result), err(300));
  assert.equal(pp(w.call('set-object', [U(floor), S('rug'), TF(1, 2, 3), S('{"colour":"#000"}')], W[0]).result), OK);
  assert.equal(w.getObj(floor).name.value, 'rug');
  assert.equal(pp(w.call('set-object', [U(999), S('x'), TF(), S('{}')], W[0]).result), err(302));
  // nesting: four levels, no more; parents must be live parts of the same space
  const a1 = idOf(w.object(W[0], alice, w.kinds.stool, { name: 'a1' }));
  const a2 = idOf(w.object(W[0], alice, w.kinds.stool, { name: 'a2', parent: a1 }));
  const a3 = idOf(w.object(W[0], alice, w.kinds.stool, { name: 'a3', parent: a2 }));
  const a4 = idOf(w.object(W[0], alice, w.kinds.stool, { name: 'a4', parent: a3 }));
  assert.equal(w.getObj(a4).depth.value, 4n);
  assert.equal(pp(w.object(W[0], alice, w.kinds.stool, { name: 'a5', parent: a4 }).result), err(306));
  const other = idOf(w.object(deployer, ids.lobby, w.kinds.stool));
  assert.equal(pp(w.object(W[0], alice, w.kinds.stool, { parent: other }).result), err(306)); // another space's object
  assert.equal(pp(w.object(W[0], alice, w.kinds.stool, { parent: 999 }).result), err(306));
  // retiring: not while it has live parts; bottom up works and frees quota
  assert.equal(pp(w.call('set-object-state', [U(a1), U(2)], W[0]).result), err(308));
  const before = w.get(alice).objects.value;
  assert.equal(pp(w.call('set-object-state', [U(a4), U(2)], W[0]).result), OK);
  assert.equal(w.get(alice).objects.value, before - 1n);
  assert.equal(pp(w.object(W[0], alice, w.kinds.stool, { parent: a4 }).result), err(306)); // retired parent
  assert.equal(pp(w.call('set-object-state', [U(a4), U(0)], W[0]).result), err(308));      // retired is final
  assert.equal(pp(w.call('set-object', [U(a4), S('x'), TF(), S('{}')], W[0]).result), err(308));
  // hide / unhide by the owner; a stranger cannot
  assert.equal(pp(w.call('set-object-state', [U(floor), U(1)], W[3]).result), err(300));
  assert.equal(pp(w.call('set-object-state', [U(floor), U(1)], W[0]).result), OK);
  assert.equal(w.getObj(floor).state.value, 1n);
  assert.equal(pp(w.call('set-object-state', [U(floor), U(3)], W[0]).result), err(300)); // moderated: moderators only
  assert.equal(pp(w.call('set-object-state', [U(floor), U(4)], W[0]).result), err(303));
  assert.equal(pp(w.call('set-object-state', [U(floor), U(0)], W[0]).result), OK);
});

test('objects: per-space quota, per-part limit, and the review lane', async () => {
  const w = await standardWorld();
  const { W, ids } = w;
  // a small room: 3 objects
  const room = idOf(w.space(W[0], { parent: ids.alice, slug: 'small', policy: PLOT({ depth: 1, objects: 3 }) }));
  const ids3 = [1, 2, 3].map(() => idOf(w.object(W[0], room, w.kinds.stool)));
  assert.equal(pp(w.object(W[0], room, w.kinds.stool).result), err(305));
  w.call('set-object-state', [U(ids3[2]), U(2)], W[0]);
  assert.equal(pp(w.object(W[0], room, w.kinds.stool).result.type), 'ok');
  // a part holds at most 32 parts
  const parent = idOf(w.object(w.deployer, ids.hall, w.kinds.stool, { name: 'rack' }));
  for (let i = 0; i < 32; i++) assert.equal(w.object(w.deployer, ids.hall, w.kinds.stool, { name: `p${i}`, parent: i < 3 ? parent : parent }).result.type, 'ok', `part ${i}`);
  assert.equal(pp(w.object(w.deployer, ids.hall, w.kinds.stool, { name: 'p32', parent }).result), err(306));
  // review lane: a delegate's objects start hidden; only the owner or a moderator shows them
  const rv = idOf(w.space(W[0], { parent: ids.alice, slug: 'review', policy: PLOT({ depth: 1, review: true }) }));
  w.grant(W[0], rv, W[2], CAP.OBJECT);
  const theirs = idOf(w.object(W[2], rv, w.kinds.stool));
  const mine = idOf(w.object(W[0], rv, w.kinds.stool));
  assert.equal(w.getObj(theirs).state.value, 1n);
  assert.equal(w.getObj(mine).state.value, 0n);
  assert.equal(pp(w.call('set-object-state', [U(theirs), U(0)], W[2]).result), err(300));
  assert.equal(pp(w.call('set-object-state', [U(theirs), U(0)], W[0]).result), OK);
  assert.equal(w.getObj(theirs).state.value, 0n);
  // hiding is open to the delegate and to a moderator above, even when the plot is suspended
  w.call('set-space-paused', [U(rv), Cl.bool(true)], W[0]);
  assert.equal(pp(w.call('set-object-state', [U(theirs), U(1)], w.deployer).result), OK);
  assert.equal(pp(w.call('set-object-state', [U(theirs), U(1)], W[2]).result), OK);
});

test('states: timeline resolves by burn height; schedule, ties, retract, compact, limits', async () => {
  const w = await standardWorld();
  const { deployer, W, ids, simnet } = w;
  const wall = idOf(w.object(deployer, ids.hall, w.kinds.sign, { name: 'bay0' }));
  // nothing yet: the object shows its own params
  assert.equal(activeSeq(w, wall), null);
  assert.equal(nextHeight(w, wall), null);
  // permissions and validation
  assert.equal(pp(w.addState(W[3], wall).result), err(300));
  assert.equal(pp(w.addState(deployer, 999).result), err(302));
  assert.equal(pp(w.addState(deployer, wall, { visibility: 2 }).result), err(303));
  assert.equal(pp(w.addState(deployer, wall, { interaction: 4 }).result), err(303));
  assert.equal(pp(w.addState(deployer, wall, { interaction: 3 }).result), err(316));   // enter needs a door that leads somewhere
  // now, then a scheduled change
  const t0 = w.h();
  assert.equal(pp(w.addState(deployer, wall, { patch: '{"cover":"curtain"}' }).result), ok(0));
  assert.equal(activeSeq(w, wall), 0);
  assert.equal(pp(w.addState(deployer, wall, { from: t0 + 10, patch: '{"cover":"none"}' }).result), ok(1));
  assert.equal(activeSeq(w, wall), 0);
  assert.equal(nextHeight(w, wall), t0 + 10);
  simnet.mineEmptyBurnBlocks(10);
  assert.equal(activeSeq(w, wall), 1);
  assert.equal(nextHeight(w, wall), null);
  assert.equal(view(w, wall).active.value.value.patch.value, '{"cover":"none"}');
  // a start in the past is raised to now, so it can never be buried under an older state
  assert.equal(pp(w.addState(deployer, wall, { from: 1, patch: '{"light":"on"}' }).result), ok(2));
  assert.equal(w.ro('get-state', [U(wall), U(2)]).value.value['from-height'].value, BigInt(w.h()));
  assert.equal(activeSeq(w, wall), 2);
  // ties: the later one wins
  assert.equal(pp(w.addState(deployer, wall, { patch: '{"sign":"soon"}' }).result), ok(3));
  assert.equal(activeSeq(w, wall), 3);
  // retract removes a state from resolution (history stays readable)
  assert.equal(pp(w.call('retract-state', [U(wall), U(3)], W[3]).result), err(300));
  assert.equal(pp(w.call('retract-state', [U(wall), U(3)]).result), OK);
  assert.equal(activeSeq(w, wall), 2);
  assert.equal(w.ro('get-state', [U(wall), U(3)]).value.value.retracted.type, 'true');
  assert.equal(w.ro('get-timeline', [U(wall)]).value.length, 3);
  assert.equal(Number(w.ro('get-state-count', [U(wall)]).value), 4);
  assert.equal(pp(w.call('retract-state', [U(wall), U(9)]).result), err(302));
  // compact keeps the active state and anything still to come
  w.addState(deployer, wall, { from: w.h() + 50, patch: '{"later":1}' });
  assert.equal(pp(w.call('compact-object', [U(wall)], W[3]).result), err(300));
  assert.equal(pp(w.call('compact-object', [U(wall)]).result), OK);
  const tl = w.ro('get-timeline', [U(wall)]).value;
  assert.equal(tl.length, 2);
  assert.equal(activeSeq(w, wall), 2);
  // the timeline holds 8 live states; compacting frees space
  const o2 = idOf(w.object(deployer, ids.hall, w.kinds.sign, { name: 'bay1' }));
  for (let i = 0; i < 8; i++) assert.equal(pp(w.addState(deployer, o2, { from: w.h() + 100 + i }).result), ok(i));
  assert.equal(pp(w.addState(deployer, o2, { from: w.h() + 200 }).result), err(315));
  assert.equal(pp(w.call('retract-state', [U(o2), U(0)]).result), OK);
  assert.equal(pp(w.addState(deployer, o2, { from: w.h() + 200 }).result), ok(8));
});

test('states: a batch is all or nothing, across objects', async () => {
  const w = await standardWorld();
  const { deployer, ids } = w;
  const a = idOf(w.object(deployer, ids.hall, w.kinds.sign, { name: 'a' }));
  const b = idOf(w.object(deployer, ids.hall, w.kinds.sign, { name: 'b' }));
  const story = [
    stateArg(a, { from: w.h() + 5, patch: '{"cover":"curtain"}' }),
    stateArg(b, { from: w.h() + 6, patch: '{"light":"on"}' }),
    stateArg(a, { from: w.h() + 20, patch: '{"cover":"none"}' }),
  ];
  assert.equal(pp(w.call('add-states', [Cl.list(story)]).result), ok(3));
  assert.equal(Number(w.ro('get-state-count', [U(a)]).value), 2);
  assert.equal(Number(w.ro('get-state-count', [U(b)]).value), 1);
  // a bad entry rolls the whole batch back
  const bad = [stateArg(a, { from: w.h() + 30 }), stateArg(b, { visibility: 7 })];
  assert.equal(pp(w.call('add-states', [Cl.list(bad)]).result), err(303));
  assert.equal(Number(w.ro('get-state-count', [U(a)]).value), 2);
  // a delegate can only touch objects in spaces where they hold STATE
  w.grant(deployer, ids.hall, w.W[2], CAP.STATE);
  const other = idOf(w.object(deployer, ids.lobby, w.kinds.sign));
  assert.equal(pp(w.call('add-states', [Cl.list([stateArg(a), stateArg(other)])], w.W[2]).result), err(300));
  assert.equal(Number(w.ro('get-state-count', [U(a)]).value), 2);
});

test('portals: only door kinds; targets must be open; arrival checked; site paths vetted', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const door = idOf(w.object(deployer, ids.lobby, w.kinds.door, { name: 'door-casino' }));
  const rug = idOf(w.object(deployer, ids.lobby, w.kinds.carpet));
  assert.equal(pp(w.portal(deployer, rug, ids.casino).result), err(316));        // not a door
  assert.equal(pp(w.portal(W[3], door, ids.casino).result), err(300));           // not allowed
  assert.equal(pp(w.portal(deployer, 999, ids.casino).result), err(302));
  assert.equal(pp(w.portal(deployer, door, 999).result), err(316));              // no such target
  assert.equal(pp(w.portal(deployer, door, ids.casino).result), OK);
  assert.equal(w.getObj(door).portal.value.value['to-space'].value, BigInt(ids.casino));
  // a door may lead to its own room's entrance, and can be removed
  assert.equal(pp(w.call('set-portal', [U(door), Cl.none()]).result), OK);
  assert.equal(w.getObj(door).portal.type, 'none');
  // the target must be live all the way up
  const vault = idOf(w.space(deployer, { parent: ids.arcade, slug: 'vault' }));
  assert.equal(pp(w.portal(deployer, door, vault).result), err(316));            // still a draft
  w.setState(deployer, vault, 1);
  assert.equal(pp(w.portal(deployer, door, vault).result), OK);
  w.setState(deployer, ids.arcade, 2);                                           // suspend the whole arcade
  assert.equal(pp(w.portal(deployer, door, ids.casino).result), err(301));       // source chain not writable
  w.setState(deployer, ids.arcade, 1);
  w.setState(deployer, vault, 2);
  assert.equal(pp(w.portal(deployer, door, vault).result), err(316));            // suspended target
  // arrival: the target's entrance (0) or one of its own live objects
  const mat = idOf(w.object(deployer, ids.casino, w.kinds.carpet, { name: 'welcome' }));
  assert.equal(pp(w.portal(deployer, door, ids.casino, mat).result), OK);
  assert.equal(pp(w.portal(deployer, door, ids.casino, rug).result), err(316));  // object of another space
  assert.equal(pp(w.portal(deployer, door, ids.casino, 999).result), err(316));
  w.call('set-object-state', [U(mat), U(2)]);
  assert.equal(pp(w.portal(deployer, door, ids.casino, mat).result), err(316));  // retired
  // site paths: only a plain "/path"
  assert.equal(pp(w.portal(deployer, door, 0, 0, '/gallery').result), OK);
  assert.equal(pp(w.portal(deployer, door, 0, 0, '//evil.example').result), err(316));
  assert.equal(pp(w.portal(deployer, door, 0, 0, '/\\evil').result), err(316));
  assert.equal(pp(w.portal(deployer, door, 0, 0, 'gallery').result), err(316));
  assert.equal(pp(w.portal(deployer, door, 0, 0, '').result), err(316));
  // enter needs a portal: now it has one
  assert.equal(pp(w.addState(deployer, door, { interaction: 3 }).result), ok(0));
  // a retired door cannot be re-pointed
  w.call('set-object-state', [U(door), U(2)]);
  assert.equal(pp(w.portal(deployer, door, ids.casino).result), err(308));
});

test('portals between owners: outbound and inbound policy, consent, same-owner shortcut, epochs', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  // alice (W0) has two rooms; bob (W1) has a plot with looser outbound doors
  const studio = idOf(w.space(W[0], { parent: ids.alice, slug: 'studio', policy: PLOT({ depth: 1 }) }));
  const lounge = idOf(w.space(W[0], { parent: ids.alice, slug: 'lounge', policy: PLOT({ depth: 1 }) }));
  const guest = idOf(w.space(W[0], { parent: ids.alice, slug: 'guest', owner: W[1], policy: PLOT({ depth: 1 }) }));
  for (const s of [studio, lounge, guest]) w.setState(s === guest ? W[1] : W[0], s, 1);
  const bobPlot = idOf(w.space(deployer, { parent: ids.plots, slug: 'bob', kind: 2, owner: W[1], policy: PLOT({ pout: 1 }) }));
  const bobRoom = idOf(w.space(W[1], { parent: bobPlot, slug: 'room', policy: PLOT({ depth: 1, pout: 1 }) }));
  w.setState(deployer, bobPlot, 1); w.setState(W[1], bobRoom, 1);
  const mk = (who, space) => idOf(w.object(who, space, w.kinds.door));
  const dStudio = mk(W[0], studio);
  const dBob = mk(W[1], bobRoom);
  // plot doors that stay inside the plot (outbound 2): the lounge is the same owner, so no consent is needed
  assert.equal(pp(w.portal(W[0], dStudio, lounge).result), OK);
  assert.equal(pp(w.portal(W[0], dStudio, ids.lobby).result), err(316));          // leaving the plot is not allowed
  assert.equal(pp(w.portal(W[0], dStudio, 0, 0, '/home').result), err(316));       // nor leaving the site
  // a room owned by someone else: consent needed (inbound policy 1)
  assert.equal(pp(w.portal(W[0], dStudio, guest).result), err(316));
  assert.equal(pp(w.call('allow-portal-from', [U(guest), U(studio)], W[0]).result), err(300)); // W0 owns the plot, not the guest room
  assert.equal(pp(w.call('allow-portal-from', [U(guest), U(studio)], W[1]).result), OK);
  assert.equal(pp(w.portal(W[0], dStudio, guest).result), OK);
  assert.equal(w.ro('get-consent', [U(guest), U(studio)]).type, 'some');
  // consent is per source: the lounge still cannot reach the guest room
  const dLounge = mk(W[0], lounge);
  assert.equal(pp(w.portal(W[0], dLounge, guest).result), err(316));
  // revoking takes effect for the next door written
  assert.equal(pp(w.call('revoke-portal-from', [U(guest), U(studio)], W[3]).result), err(300));
  assert.equal(pp(w.call('revoke-portal-from', [U(guest), U(studio)], W[1]).result), OK);
  assert.equal(pp(w.portal(W[0], dStudio, guest).result), err(316));
  // consent lapses when the guest room changes hands (epoch)
  w.call('allow-portal-from', [U(guest), U(studio)], W[1]);
  assert.equal(pp(w.portal(W[0], dStudio, guest).result), OK);
  w.call('propose-space-transfer', [U(guest), P(W[2])], W[1]);
  w.call('accept-space-transfer', [U(guest)], W[2]);
  assert.equal(pp(w.portal(W[0], dStudio, guest).result), err(316));
  // outbound 1 may reach open spaces (the lobby) but not consent-only spaces
  assert.equal(pp(w.portal(W[1], dBob, ids.lobby).result), OK);
  assert.equal(pp(w.portal(W[1], dBob, studio).result), err(316));
  assert.equal(pp(w.portal(W[1], dBob, ids.hall).result), OK);
  // a closed room takes no doors, except its own
  w.call('set-policy', [U(lounge), PLOT({ depth: 1, pin: 2 })], W[0]);
  assert.equal(pp(w.portal(W[0], dStudio, lounge).result), err(316));
  assert.equal(pp(w.portal(W[0], dLounge, lounge).result), OK);
});

test('bindings: policy interface list, approval, and money-moving contracts always approved', async () => {
  const w = await standardWorld();
  const { deployer, W, ids } = w;
  const feed = `${deployer}.mock-xtrata-core`;
  const shop = `${deployer}.mock-world-owner-v2`;
  const screen = idOf(w.object(deployer, ids.lobby, w.kinds.sign, { name: 'screen' }));
  const set = (who, obj, list) => w.call('set-bindings', [U(obj), bindingsArg(list)], who);
  // the lobby allows every interface, and does not require approval for read-only ones
  assert.equal(pp(set(deployer, screen, [['feed', feed, 1]]).result), OK);
  assert.equal(pp(set(deployer, screen, [['feed', feed, 1], ['state', feed, 2], ['gate', feed, 3]]).result), OK);
  assert.equal(w.getObj(screen).bindings.value.length, 3);
  assert.equal(pp(set(deployer, screen, [['', feed, 1]]).result), err(317));         // empty role
  assert.equal(pp(set(deployer, screen, [['x', feed, 0]]).result), err(317));        // no such interface
  assert.equal(pp(set(deployer, screen, [['x', feed, 5]]).result), err(317));
  assert.equal(pp(set(W[3], screen, [['feed', feed, 1]]).result), err(300));
  assert.equal(pp(set(deployer, 999, [['feed', feed, 1]]).result), err(302));
  // anything that can move money (action-v1) must be an approved contract, everywhere
  assert.equal(pp(set(deployer, screen, [['buy', shop, 4]]).result), err(317));
  w.call('set-approved', [P(shop), Cl.bool(true)]);
  assert.equal(pp(set(deployer, screen, [['buy', shop, 4]]).result), OK);
  w.call('set-approved', [P(shop), Cl.bool(false)]);
  assert.equal(pp(set(deployer, screen, [['buy', shop, 4]]).result), err(317));
  // a plot: display and state only, approved contracts only
  const sign = idOf(w.object(W[0], ids.alice, w.kinds.sign, { name: 'sign' }));
  assert.equal(pp(set(W[0], sign, [['feed', feed, 1]]).result), err(317));           // not approved
  w.call('set-approved', [P(feed), Cl.bool(true)]);
  assert.equal(pp(set(W[0], sign, [['feed', feed, 1]]).result), OK);
  assert.equal(pp(set(W[0], sign, [['gate', feed, 3]]).result), err(317));           // gate not allowed in plots
  assert.equal(pp(set(W[0], sign, [['buy', feed, 4]]).result), err(317));            // nor action
  assert.equal(pp(set(W[0], sign, []).result), OK);                                  // clearing is always fine
  // a retired object cannot be rebound
  w.call('set-object-state', [U(sign), U(2)], W[0]);
  assert.equal(pp(set(W[0], sign, [['feed', feed, 1]]).result), err(308));
});

test('paged reads: objects and children, 16 per page, with the live view', async () => {
  const w = await standardWorld();
  const { deployer, ids } = w;
  for (let i = 0; i < 20; i++) w.object(deployer, ids.hall, w.kinds.stool, { name: `s${i}` });
  const p0 = w.ro('get-objects', [U(ids.hall), U(0)]).value;
  const p1 = w.ro('get-objects', [U(ids.hall), U(1)]).value;
  assert.equal(p0.length, 16);
  assert.equal(p0.filter((x) => x.type === 'some').length, 16);
  assert.equal(p1.filter((x) => x.type === 'some').length, 4);
  assert.equal(p1[3].value.value.object.value.value.name.value, 's19');
  assert.equal(p1[4].type, 'none');
  // retiring frees the slot: the last object moves into the gap and the index stays dense
  const first = p0[0].value.value.id.value;
  w.call('set-object-state', [U(first), U(2)]);
  const again = w.ro('get-objects', [U(ids.hall), U(0)]).value;
  assert.equal(again[0].value.value.object.value.value.name.value, 's19');
  assert.equal(w.ro('get-objects', [U(ids.hall), U(1)]).value.filter((x) => x.type === 'some').length, 3);
  assert.equal(w.get(ids.hall)['object-slots'].value, 19n);
  // children of the arcade, and unknown parents are empty
  const kids = w.ro('get-children', [U(ids.arcade), U(0)]).value;
  assert.equal(kids.filter((x) => x.type === 'some').length, 3);
  assert.equal(w.ro('get-children', [U(999), U(0)]).value.filter((x) => x.type === 'some').length, 0);
  // the view of a missing object is none
  assert.equal(w.ro('get-object-view', [U(99999)]).type, 'none');
});

test('entry inscription: set with a hash check by ENTRY holders, cleared by none', async () => {
  const w = await standardWorld();
  const { deployer, W, ids, simnet } = w;
  const hh = hash32(8);
  mockInscription(simnet, deployer, 3200, { hash: hh, size: 120_000, creator: deployer });
  const entry = (id, hash, size) => Cl.some(Cl.tuple({ id: U(id), hash: Cl.buffer(hash), size: U(size) }));
  assert.equal(pp(w.call('set-space-entry', [U(ids.casino), entry(3200, hh, 120_000)], W[3]).result), err(300));
  assert.equal(pp(w.call('set-space-entry', [U(ids.casino), entry(3200, hh, 120_001)]).result), err(314));
  assert.equal(pp(w.call('set-space-entry', [U(ids.casino), entry(3200, hash32(9), 120_000)]).result), err(314));
  assert.equal(pp(w.call('set-space-entry', [U(ids.casino), entry(4040, hh, 120_000)]).result), err(314));
  assert.equal(pp(w.call('set-space-entry', [U(ids.casino), entry(3200, hh, 120_000)]).result), OK);
  assert.equal(w.get(ids.casino).entry.type, 'some');
  // a delegate with ENTRY may change it; the title too
  w.grant(deployer, ids.casino, W[2], CAP.ENTRY);
  assert.equal(pp(w.call('set-space-entry', [U(ids.casino), Cl.none()], W[2]).result), OK);
  assert.equal(pp(w.call('set-space-title', [U(ids.casino), S('Royal Flush Casino')], W[2]).result), OK);
  assert.equal(pp(w.call('set-space-title', [U(ids.casino), S('')], W[2]).result), err(303));
  assert.equal(w.get(ids.casino).title.value, 'Royal Flush Casino');
  // runtime changes: the owner only, within the parent's policy; hosted needs the root owner
  assert.equal(pp(w.call('set-space-runtime', [U(ids.alice), U(3)], W[0]).result), err(300));
  assert.equal(pp(w.call('set-space-runtime', [U(ids.alice), U(2)], W[0]).result), err(307));
  assert.equal(pp(w.call('set-space-runtime', [U(ids.alice), U(1)], W[3]).result), err(300));
  assert.equal(pp(w.call('set-space-runtime', [U(ids.alice), U(5)], W[0]).result), err(303));
});
