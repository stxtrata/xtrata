// xtrata-world-v2: regression tests for the second independent review (23 Oct 2026). Each finding's
// failing scenario from the review is kept here with the behaviour it must have now. See docs/REVIEW-2-FIXES.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  standardWorld, S, U, P, err, OK, CAP, ADM, PLOT, idOf, pp, addr, Cl, stateArg, hash32, mockInscription,
} from './world2-helpers.mjs';
import { measure, BUDGET } from './world2-costs.mjs';

const ERR_REVIEW = 320, ERR_MAX_TOTAL = 321;
const lvl = (w, id) => {
  const m = w.ro('get-moderation', [U(id)]).value;
  return { state: Number(m.space.value.state.value), pause: Number(m.space.value.pause.value), object: Number(m.object.value) };
};

/* ------------------------------------------------------------------ H2 cheap reads */

test('H2 every read the hall makes stays within 24 reads and 90,000 read_length in the worst case', async () => {
  const { rows, compat } = await measure();
  for (const [label, r] of Object.entries(rows)) {
    assert.ok(r.reads <= BUDGET.reads, `${label}: ${r.reads} reads (budget ${BUDGET.reads})`);
    assert.ok(r.readLength <= BUDGET.readLength, `${label}: read_length ${r.readLength} (budget ${BUDGET.readLength})`);
  }
  // the 16-row pages are kept for compatibility only: they are over a stock node's 30 reads at a full page
  assert.ok(compat['get-objects (16)'].reads > 30);
  assert.ok(compat['get-children (16)'].reads > 30);
});

test('H2 get-object-ids and get-objects-8 page the same slots as get-objects; get-child-ids and get-children-8 the same as get-children', async () => {
  const w = await standardWorld();
  const { deployer: D, ids } = w;
  const objs = [];
  for (let i = 0; i < 19; i++) objs.push(idOf(w.object(D, ids.hall, w.kinds.sign, { name: 'o' + i })));
  const idsOf = (page) => w.ro('get-object-ids', [U(ids.hall), U(page)]).value.map((x) => (x.type === 'some' ? Number(x.value.value) : null));
  const rows8 = (page) => w.ro('get-objects-8', [U(ids.hall), U(page)]).value;
  const rows16 = (page) => w.ro('get-objects', [U(ids.hall), U(page)]).value;
  assert.deepEqual(idsOf(0), objs.slice(0, 16));
  assert.deepEqual(idsOf(1), [...objs.slice(16), ...Array(13).fill(null)]);
  assert.equal(rows8(0).length, 8);
  // the 8-row pages are exactly the halves of the 16-row pages
  assert.deepEqual([...rows8(0), ...rows8(1)].map(pp), rows16(0).map(pp));
  assert.deepEqual([...rows8(2), ...rows8(3)].map(pp), rows16(1).map(pp));
  assert.equal(Number(rows8(2)[2].value.value.id.value), objs[18]);
  assert.equal(rows8(2)[3].type, 'none');
  // retiring an object moves the last one into its slot; the id page follows
  assert.equal(pp(w.call('set-object-state', [U(objs[3]), U(2)]).result), OK);
  assert.equal(idsOf(0)[3], objs[18]);
  assert.equal(idsOf(1)[2], null);
  // children
  const kids = w.ro('get-child-ids', [U(ids.arcade), U(0)]).value.filter((x) => x.type === 'some').map((x) => Number(x.value.value));
  assert.deepEqual(kids, [ids.lobby, ids.casino, ids.hall]);
  const c8 = w.ro('get-children-8', [U(ids.arcade), U(0)]).value;
  assert.deepEqual(c8.map(pp), w.ro('get-children', [U(ids.arcade), U(0)]).value.slice(0, 8).map(pp));
  assert.equal(w.ro('get-object-ids', [U(999), U(0)]).value.every((x) => x.type === 'none'), true);
});

/* ------------------------------------------------------------------ M1 sticky moderation */

test('M1 (review A4) a plot owner cannot lift the root owner\'s suspension, moderation or pause of a room in her own plot', async () => {
  const w = await standardWorld();
  const { deployer: D, W, ids } = w;
  const room = idOf(w.space(W[0], { parent: ids.alice, slug: 'mine', policy: PLOT({ depth: 1 }) }));
  assert.equal(pp(w.setState(W[0], room, 1).result), OK);
  const obj = idOf(w.object(W[0], room, w.kinds.carpet));
  // she owns the room and its parent: neither makes her a moderator of the room
  assert.equal(pp(w.setState(W[0], room, 2).result), err(300));
  assert.equal(pp(w.call('set-object-state', [U(obj), U(3)], W[0]).result), err(300));
  // the root owner suspends the room, moderates the object, pauses from above
  assert.equal(pp(w.call('set-object-state', [U(obj), U(3)], D).result), OK);
  assert.equal(pp(w.call('set-space-paused', [U(room), Cl.bool(true)], D).result), OK);
  assert.equal(pp(w.setState(D, room, 2).result), OK);
  assert.deepEqual(lvl(w, room), { state: 3, pause: 3, object: 0 });
  assert.equal(lvl(w, obj).object, 3);
  // alice can undo none of it
  assert.equal(pp(w.call('set-space-paused', [U(room), Cl.bool(false)], W[0]).result), err(300));
  assert.equal(pp(w.setState(W[0], room, 1).result), err(300));
  assert.equal(pp(w.call('set-object-state', [U(obj), U(0)], W[0]).result), err(300));
  assert.equal(pp(w.call('set-object-state', [U(obj), U(1)], W[0]).result), err(300));
  assert.equal(Number(w.get(room).state.value), 2);
  assert.equal(Number(w.get(room).paused.value), 2);
  assert.equal(Number(w.getObj(obj).state.value), 3);
  // the root owner lifts it; the records clear
  assert.equal(pp(w.setState(D, room, 1).result), OK);
  assert.equal(pp(w.call('set-space-paused', [U(room), Cl.bool(false)], D).result), OK);
  assert.equal(pp(w.call('set-object-state', [U(obj), U(0)], D).result), OK);
  assert.deepEqual(lvl(w, room), { state: 0, pause: 0, object: 0 });
  assert.equal(lvl(w, obj).object, 0);
});

test('M1 (review A4b) an intermediate owner or a MOD admin cannot lift the root owner\'s moderation of someone else\'s room', async () => {
  const w = await standardWorld();
  const { deployer: D, W, ids } = w;
  w.call('set-admin', [P(W[5]), U(ADM.MOD)]);
  const room = idOf(w.space(W[0], { parent: ids.alice, slug: 'bobs', owner: W[1], policy: PLOT({ depth: 1 }) }));
  assert.equal(pp(w.setState(W[1], room, 1).result), OK);
  const obj = idOf(w.object(W[1], room, w.kinds.carpet));
  assert.equal(pp(w.setState(D, room, 2).result), OK);
  assert.equal(pp(w.call('set-object-state', [U(obj), U(3)], D).result), OK);
  assert.equal(pp(w.setState(W[0], room, 1).result), err(300));       // alice (plot owner, level 1)
  assert.equal(pp(w.setState(W[5], room, 1).result), err(300));       // MOD admin (level 2)
  assert.equal(pp(w.setState(W[1], room, 1).result), err(300));       // bob (the room's owner)
  assert.equal(pp(w.call('set-object-state', [U(obj), U(0)], W[0]).result), err(300));
  assert.equal(pp(w.call('set-object-state', [U(obj), U(3)], W[5]).result), err(300));  // nor overwrite it with a lower level
  assert.equal(pp(w.setState(D, room, 1).result), OK);
  // alice moderates bob's room (level 1): bob cannot lift it; a MOD admin (higher) can; so can alice herself
  assert.equal(pp(w.setState(W[0], room, 2).result), OK);
  assert.equal(lvl(w, room).state, 1);
  assert.equal(pp(w.setState(W[1], room, 1).result), err(300));
  assert.equal(pp(w.setState(W[5], room, 1).result), OK);
  assert.equal(pp(w.setState(W[0], room, 2).result), OK);
  assert.equal(pp(w.setState(W[0], room, 1).result), OK);
  // the admin moderates (level 2): alice cannot lift it, the root owner can
  assert.equal(pp(w.call('set-object-state', [U(obj), U(0)], D).result), OK);
  assert.equal(pp(w.call('set-object-state', [U(obj), U(3)], W[5]).result), OK);
  assert.equal(lvl(w, obj).object, 2);
  assert.equal(pp(w.call('set-object-state', [U(obj), U(0)], W[0]).result), err(300));
  assert.equal(pp(w.call('set-object-state', [U(obj), U(0)], D).result), OK);
  // the owner's side may still retire a moderated object (frees the slot)
  assert.equal(pp(w.call('set-object-state', [U(obj), U(3)], W[0]).result), OK);
  assert.equal(pp(w.call('set-object-state', [U(obj), U(2)], W[1]).result), OK);
  assert.equal(lvl(w, obj).object, 0);
});

test('M1 a MOD admin who owns the space cannot lift moderation on it; pauses from above keep their level', async () => {
  const w = await standardWorld();
  const { deployer: D, W, ids } = w;
  w.call('set-admin', [P(W[0]), U(ADM.MOD)]);                       // alice is also a MOD admin
  assert.equal(pp(w.setState(D, ids.alice, 2).result), OK);
  assert.equal(pp(w.setState(W[0], ids.alice, 1).result), err(300));
  assert.equal(pp(w.setState(W[0], ids.alice, 2).result), err(300));
  assert.equal(pp(w.setState(D, ids.alice, 1).result), OK);
  w.call('set-admin', [P(W[0]), U(0)]);
  // a pause from above by a MOD admin (level 2) cannot be lifted by alice; the root owner (3) can
  w.call('set-admin', [P(W[5]), U(ADM.MOD)]);
  assert.equal(pp(w.call('set-space-paused', [U(ids.alice), Cl.bool(true)], W[5]).result), OK);
  assert.equal(lvl(w, ids.alice).pause, 2);
  assert.equal(pp(w.call('set-space-paused', [U(ids.alice), Cl.bool(false)], W[0]).result), err(300));
  assert.equal(pp(w.call('set-space-paused', [U(ids.alice), Cl.bool(false)], D).result), OK);
  // the root owner's pause cannot be lifted by the admin
  assert.equal(pp(w.call('set-space-paused', [U(ids.alice), Cl.bool(true)], D).result), OK);
  assert.equal(pp(w.call('set-space-paused', [U(ids.alice), Cl.bool(false)], W[5]).result), err(300));
  assert.equal(pp(w.call('set-space-paused', [U(ids.alice), Cl.bool(true)], W[5]).result), err(300));   // no downgrade either
  assert.equal(lvl(w, ids.alice).pause, 3);
});

test('M1 (review A10) a PAUSE admin\'s pause is a pause from above: the owner cannot lift it', async () => {
  const w = await standardWorld();
  const { deployer: D, W, ids } = w;
  assert.equal(pp(w.call('set-admin', [P(W[2]), U(ADM.PAUSE)], D).result), OK);
  assert.equal(pp(w.call('set-space-paused', [U(ids.alice), Cl.bool(true)], W[2]).result), OK);
  assert.equal(Number(w.get(ids.alice).paused.value), 2);
  assert.equal(lvl(w, ids.alice).pause, 2);
  assert.equal(pp(w.call('set-space-paused', [U(ids.alice), Cl.bool(false)], W[0]).result), err(300));
  assert.equal(pp(w.call('set-space-paused', [U(ids.alice), Cl.bool(false)], W[2]).result), OK);
  // the owner's own pause stays the owner's (level 0, lifted by the owner)
  assert.equal(pp(w.call('set-space-paused', [U(ids.alice), Cl.bool(true)], W[0]).result), OK);
  assert.equal(Number(w.get(ids.alice).paused.value), 1);
  assert.equal(pp(w.call('set-space-paused', [U(ids.alice), Cl.bool(false)], W[0]).result), OK);
});

/* ------------------------------------------------------------------ M2 review lane */

test('M2 (review A9) in a review space a delegate\'s states, title and entry are refused; the owner and moderators are not', async () => {
  const w = await standardWorld();
  const { deployer: D, W, ids, simnet } = w;
  assert.equal(pp(w.call('set-policy', [U(ids.alice), w.polOf(ids.alice, { review: true })], W[0]).result), OK);
  const obj = idOf(w.object(W[0], ids.alice, w.kinds.sign, { params: '{"text":"HELLO"}' }));
  assert.equal(pp(w.grant(W[0], ids.alice, W[3], CAP.STATE | CAP.OBJECT | CAP.ENTRY).result), OK);
  mockInscription(simnet, D, 77, { hash: hash32(77), size: 500, creator: W[3] });
  const entry = Cl.some(Cl.tuple({ id: U(77), hash: Cl.buffer(hash32(77)), size: U(500) }));
  assert.equal(pp(w.addState(W[3], obj, { patch: '{"text":"SCAM-LINK"}' }).result), err(ERR_REVIEW));
  assert.equal(pp(w.call('add-states', [Cl.list([stateArg(obj, { patch: '{"text":"X"}' })])], W[3]).result), err(ERR_REVIEW));
  assert.equal(pp(w.call('set-space-title', [U(ids.alice), S('anything')], W[3]).result), err(ERR_REVIEW));
  assert.equal(pp(w.call('set-space-entry', [U(ids.alice), entry], W[3]).result), err(ERR_REVIEW));
  assert.equal(w.ro('get-state-count', [U(obj)]).value, 0n);
  // the owner is not held back
  assert.equal(w.addState(W[0], obj, { patch: '{"text":"OWNER"}' }).result.type, 'ok');
  assert.equal(pp(w.call('set-space-title', [U(ids.alice), S('Alice')], W[0]).result), OK);
  assert.equal(pp(w.call('set-space-entry', [U(ids.alice), entry], W[0]).result), OK);
  // the review lane inherited from a parent applies too: a room under alice's plot
  const room = idOf(w.space(W[0], { parent: ids.alice, slug: 'room', policy: PLOT({ depth: 1, review: true }) }));
  w.setState(W[0], room, 1);
  const o2 = idOf(w.object(W[0], room, w.kinds.sign));
  assert.equal(pp(w.grant(W[0], room, W[3], CAP.STATE).result), OK);
  assert.equal(pp(w.addState(W[3], o2).result), err(ERR_REVIEW));
  // a moderator holding a STATE grant is not held back either (an A-MOD admin here)
  w.call('set-admin', [P(W[5]), U(ADM.MOD)], D);
  assert.equal(pp(w.grant(W[0], ids.alice, W[5], CAP.STATE).result), OK);
  assert.equal(w.addState(W[5], obj, { patch: '{"text":"MOD"}' }).result.type, 'ok');
  // without a review lane the delegate's state goes straight in
  const bob = idOf(w.space(D, { parent: ids.plots, slug: 'bob', kind: 2, owner: W[1], policy: PLOT() }));
  w.setState(W[1], bob, 1);
  const o3 = idOf(w.object(W[1], bob, w.kinds.sign));
  assert.equal(pp(w.grant(W[1], bob, W[3], CAP.STATE | CAP.ENTRY).result), OK);
  assert.equal(w.addState(W[3], o3).result.type, 'ok');
  assert.equal(pp(w.call('set-space-title', [U(bob), S('Bob by W3')], W[3]).result), OK);
});

/* ------------------------------------------------------------------ L1 grants issued by delegates */

test('L1 (review A2) a grant a delegate issued lapses as soon as the issuer loses GRANT (revoked, expired, or sold on)', async () => {
  const w = await standardWorld();
  const { W, ids, simnet } = w;
  assert.equal(pp(w.grant(W[0], ids.alice, W[3], CAP.GRANT | CAP.OBJECT).result), OK);
  assert.equal(pp(w.grant(W[3], ids.alice, W[4], CAP.OBJECT, false, w.h() + 1000).result), OK);
  assert.equal(w.object(W[4], ids.alice, w.kinds.carpet).result.type, 'ok');
  assert.equal(pp(w.call('revoke', [U(ids.alice), P(W[3])], W[0]).result), OK);
  assert.equal(pp(w.object(W[4], ids.alice, w.kinds.carpet).result), err(300));
  // re-granting the issuer brings the issued grant back while it is still unexpired (the row is still there)
  assert.equal(pp(w.grant(W[0], ids.alice, W[3], CAP.GRANT | CAP.OBJECT, false, w.h() + 20).result), OK);
  assert.equal(w.object(W[4], ids.alice, w.kinds.carpet).result.type, 'ok');
  // the issuer's own grant expires: what they issued stops with it
  simnet.mineEmptyBurnBlocks(25);
  assert.equal(pp(w.object(W[4], ids.alice, w.kinds.carpet).result), err(300));
  // an issuer whose grant no longer carries GRANT
  assert.equal(pp(w.grant(W[0], ids.alice, W[3], CAP.OBJECT).result), OK);
  assert.equal(pp(w.object(W[4], ids.alice, w.kinds.carpet).result), err(300));
  // owner-issued grants are not affected
  assert.equal(w.object(W[3], ids.alice, w.kinds.carpet).result.type, 'ok');
});

test('L1 a delegate issues grants only where it holds GRANT through its own grant on that space (not an inherited one)', async () => {
  const w = await standardWorld();
  const { W, ids } = w;
  const room = idOf(w.space(W[0], { parent: ids.alice, slug: 'room', policy: PLOT({ depth: 1 }) }));
  w.setState(W[0], room, 1);
  assert.equal(pp(w.grant(W[0], ids.alice, W[3], CAP.GRANT | CAP.OBJECT, true).result), OK);   // inheriting
  assert.equal(w.object(W[3], room, w.kinds.carpet).result.type, 'ok');                       // reaches the room
  assert.equal(pp(w.grant(W[3], room, W[4], CAP.OBJECT, false, w.h() + 100).result), err(319)); // but cannot issue there
  assert.equal(pp(w.grant(W[3], ids.alice, W[4], CAP.OBJECT, false, w.h() + 100).result), OK); // where its row is: yes
});

test('L1 (third review P2) a grant a delegate issued never carries a power its issuer has since lost', async () => {
  const w = await standardWorld();
  const { W, ids } = w;
  const bay = idOf(w.object(W[0], ids.alice, w.kinds.carpet, { name: 'bay' }));
  assert.equal(pp(w.grant(W[0], ids.alice, W[3], CAP.GRANT | CAP.OBJECT | CAP.STATE).result), OK);
  assert.equal(pp(w.grant(W[3], ids.alice, W[4], CAP.OBJECT | CAP.STATE, false, w.h() + 1000).result), OK);
  assert.equal(w.object(W[4], ids.alice, w.kinds.carpet).result.type, 'ok');
  assert.equal(w.addState(W[4], bay, {}).result.type, 'ok');
  // the owner cuts the issuer down to GRANT|STATE: the issued OBJECT power goes with it, STATE stays
  assert.equal(pp(w.grant(W[0], ids.alice, W[3], CAP.GRANT | CAP.STATE).result), OK);
  assert.equal(pp(w.object(W[4], ids.alice, w.kinds.carpet).result), err(300));
  assert.equal(w.addState(W[4], bay, {}).result.type, 'ok');
  // the issuer's own powers are unchanged by this rule
  assert.equal(pp(w.object(W[3], ids.alice, w.kinds.carpet).result), err(300));
  assert.equal(w.addState(W[3], bay, {}).result.type, 'ok');
});

/* ------------------------------------------------------------------ L2 sale total */

test('L2 (review D1) buy-space refuses when price plus Xtrata\'s share exceeds the buyer\'s max-total', async () => {
  const w = await standardWorld();
  const { deployer: D, W, ids } = w;
  w.call('set-treasury', [P(W[5])]);
  assert.equal(pp(w.call('set-fees', [U(0), U(0), U(50_000_000)], D).result), OK);
  w.simnet.mineEmptyBurnBlocks(145);
  assert.equal(pp(w.call('list-space', [U(ids.alice), U(1), Cl.none()], W[0]).result), OK);
  const before = w.bal(W[1]);
  assert.equal(pp(w.buy(W[1], ids.alice, 1, 1).result), err(ERR_MAX_TOTAL));
  assert.equal(pp(w.buy(W[1], ids.alice, 1, 49_999_999).result), err(ERR_MAX_TOTAL));
  assert.equal(w.bal(W[1]), before);
  assert.equal(pp(w.buy(W[1], ids.alice, 1, 50_000_000).result), OK);
  assert.equal(before - w.bal(W[1]), 50_000_000n);
  // a percentage share: the total is the price when the price exceeds the share
  assert.equal(pp(w.call('list-space', [U(ids.alice), U(80_000_000), Cl.none()], W[1]).result), OK);
  assert.equal(pp(w.buy(W[2], ids.alice, 80_000_000, 79_999_999).result), err(ERR_MAX_TOTAL));
  assert.equal(pp(w.buy(W[2], ids.alice, 80_000_000, 80_000_000).result), OK);
});

/* ------------------------------------------------------------------ L4 treasury */

test('L4 the treasury cannot be the registry itself (it has no way to spend)', async () => {
  const w = await standardWorld();
  const { deployer: D } = w;
  assert.equal(pp(w.call('set-treasury', [P(`${D}.xtrata-world-v2`)], D).result), err(303));
  assert.equal(addr(w.ro('get-root').value.treasury), D);
  assert.equal(pp(w.call('set-treasury', [P(`${D}.mock-world-owner-v2`)], D).result), OK);    // other contracts may be
});

/* ------------------------------------------------------------------ L10 kept on purpose */

test('L10 (review N1, kept) a CHILD holder may create a space it owns, and keeps it after its grant ends', async () => {
  const w = await standardWorld();
  const { W, ids } = w;
  assert.equal(pp(w.grant(W[0], ids.alice, W[3], CAP.CHILD, false, w.h() + 10).result), OK);
  const room = idOf(w.space(W[3], { parent: ids.alice, slug: 'grab', owner: W[3], policy: PLOT({ depth: 1 }) }));
  w.simnet.mineEmptyBurnBlocks(20);
  assert.equal(addr(w.get(room).owner), W[3]);
  // ... but moderation from above still applies to it, and sticks
  assert.equal(pp(w.setState(W[0], room, 2).result), OK);
  assert.equal(pp(w.setState(W[3], room, 1).result), err(300));
});
