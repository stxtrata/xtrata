// Tests for xtrata-world-v1. Run: node --test tests/
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { Cl } from '@stacks/transactions';
import { boot, contract, pp, okU, errU, hash32, mockInscription } from './helpers.mjs';

let simnet, deployer, W, X;
const call = (fn, args, sender = deployer) => X.call(fn, args, sender);
const ro = (fn, args) => X.ro(fn, args);
const S = (s) => Cl.stringAscii(s);

const layer = (slot, look, params = '{}', state = '') =>
  Cl.tuple({ slot: Cl.uint(slot), look: Cl.uint(look), params: S(params), state: S(state) });
const link = (room, arrival = 0, path = '') =>
  Cl.some(Cl.tuple({ 'target-room': S(room), 'arrival-bay': Cl.uint(arrival), path: S(path) }));

function scene(o = {}) {
  const v = { room: 'arcade-hall', bay: 0, from: 0, base: 0, doorLook: null, layers: [], interaction: 0, link: null, ...o };
  return Cl.tuple({
    room: S(v.room), bay: Cl.uint(v.bay), 'from-height': Cl.uint(v.from), base: Cl.uint(v.base),
    'door-look': v.doorLook === null ? Cl.none() : Cl.some(Cl.uint(v.doorLook)),
    layers: Cl.list(v.layers), interaction: Cl.uint(v.interaction), link: v.link ?? Cl.none(),
  });
}
const addScene = (o, who = deployer) => call('add-scene', [scene(o)], who);
const bay = (room = 'arcade-hall', b = 0) => ro('get-bay', [S(room), Cl.uint(b)]);
const activeSeq = (room, b) => {
  const r = bay(room, b);
  if (r.type !== 'some') return 'nobay';
  const a = r.value.value['active-seq'];
  return a.type === 'some' ? Number(a.value.value) : null;
};
const nextHeight = (room, b) => {
  const n = bay(room, b).value.value['next-height'];
  return n.type === 'some' ? Number(n.value.value) : null;
};
const h = () => simnet.burnBlockHeight;

// look ids, filled in by the first tests
const L = {};
const builtin = (kind, name, key) =>
  call('register-look', [Cl.uint(kind), S(name), Cl.uint(0), S(key), Cl.uint(0), Cl.buffer(new Uint8Array(0)), Cl.uint(0)]);
const lookId = (r) => Number(r.result.value.value);

before(async () => {
  ({ simnet, deployer, W } = await boot());
  X = contract(simnet, 'xtrata-world-v1', deployer);
});

test('rooms: admin registers; bays 1..8; no duplicates; entry set by admin or room owner', () => {
  const reg = (id, title, owner, bays, who = deployer) =>
    call('register-room', [S(id), S(title), Cl.principal(owner), Cl.uint(bays)], who);
  assert.equal(pp(reg('arcade-hall', 'Xtrata Arcade', deployer, 2, W[0]).result), errU(200));
  assert.equal(pp(reg('arcade-hall', 'Xtrata Arcade', deployer, 0).result), errU(203));
  assert.equal(pp(reg('arcade-hall', 'Xtrata Arcade', deployer, 9).result), errU(203));
  assert.equal(pp(reg('', 'x', deployer, 2).result), errU(203));
  assert.equal(pp(reg('arcade-hall', 'Xtrata Arcade', deployer, 2).result), '(ok true)');
  assert.equal(pp(reg('arcade-hall', 'Again', deployer, 2).result), errU(204));
  assert.equal(pp(reg('guest-room', 'Guest Room', W[1], 1).result), '(ok true)');
  assert.equal(pp(call('set-room-entry', [S('arcade-hall'), Cl.some(Cl.uint(3111))], W[1]).result), errU(200));
  assert.equal(pp(call('set-room-entry', [S('arcade-hall'), Cl.some(Cl.uint(3111))]).result), '(ok true)');
  assert.equal(pp(call('set-room-entry', [S('guest-room'), Cl.some(Cl.uint(5))], W[1]).result), '(ok true)'); // owner
  assert.equal(pp(call('set-room-entry', [S('nope'), Cl.none()]).result), errU(202));
  assert.equal(ro('get-room', [S('arcade-hall')]).value.value['entry-id'].value.value, 3111n);
  assert.equal(pp(call('set-room-hidden', [S('guest-room'), Cl.bool(true)], W[1]).result), errU(200));
});

test('a bay with no scenes shows the default; bays outside the room are none', () => {
  assert.equal(activeSeq('arcade-hall', 0), null);
  assert.equal(nextHeight('arcade-hall', 0), null);
  assert.equal(bay('arcade-hall', 2).type, 'none');
  assert.equal(bay('missing', 0).type, 'none');
  const all = ro('get-bays', [S('arcade-hall')]).value;
  assert.equal(all.length, 8);
  assert.equal(all[0].type, 'some');
  assert.equal(all[1].type, 'some');
  assert.equal(all[2].type, 'none');
});

test('looks: built-ins admin only; recipes by publishers with inscription checks; modules need approval', () => {
  const nobytes = Cl.buffer(new Uint8Array(0));
  const reg = (kind, name, tier, key, id, hash, size, who = deployer) =>
    call('register-look', [Cl.uint(kind), S(name), Cl.uint(tier), S(key), Cl.uint(id), Cl.buffer(hash), Cl.uint(size)], who);
  const none = new Uint8Array(0);
  // built-ins
  assert.equal(pp(reg(0, 'Oak door', 0, 'door-oak', 0, none, 0, W[0]).result), errU(200));
  let r = reg(0, 'Oak door', 0, 'door-oak', 0, none, 0); L.door = lookId(r); assert.equal(L.door, 0);
  L.cover = lookId(reg(1, 'Velvet curtain', 0, 'curtain-1', 0, none, 0));
  L.cover2 = lookId(reg(1, 'Hoarding', 0, 'hoarding', 0, none, 0));
  L.sign = lookId(reg(2, 'Coming soon', 0, 'sign-soon', 0, none, 0));
  L.sign2 = lookId(reg(2, 'Caution tape', 0, 'tape', 0, none, 0));
  L.sound = lookId(reg(3, 'Hammering', 0, 'snd-hammer', 0, none, 0));
  L.sound2 = lookId(reg(3, 'Sawing', 0, 'snd-saw', 0, none, 0));
  L.light = lookId(reg(4, 'Lamp flicker', 0, 'lamp', 0, none, 0));
  assert.equal(pp(reg(0, 'x', 0, '', 0, none, 0).result), errU(203));            // built-in needs a key
  assert.equal(pp(reg(5, 'x', 0, 'k', 0, none, 0).result), errU(203));           // bad kind
  assert.equal(pp(reg(0, '', 0, 'k', 0, none, 0).result), errU(203));            // no name
  // recipes (tier 1): publisher, sealed inscription of the right size made by the sender
  const hh = hash32(3);
  mockInscription(simnet, deployer, 700, { hash: hh, size: 2000, creator: W[2] });
  assert.equal(pp(reg(1, 'Green curtain', 1, '', 700, hh, 2000, W[2]).result), errU(200));  // not a publisher yet
  call('set-publisher', [Cl.principal(W[2]), Cl.bool(true)]);
  assert.equal(pp(reg(1, 'Green curtain', 1, 'x', 700, hh, 2000, W[2]).result), errU(203)); // tier 1 must not carry a built-in key
  assert.equal(pp(reg(1, 'Green curtain', 1, '', 700, hash32(4), 2000, W[2]).result), errU(206));
  assert.equal(pp(reg(1, 'Green curtain', 1, '', 700, hh, 2001, W[2]).result), errU(206));
  assert.equal(pp(reg(1, 'Green curtain', 1, '', 700, hh, 2000, W[3]).result), errU(200));
  L.recipe = lookId(reg(1, 'Green curtain', 1, '', 700, hh, 2000, W[2]));
  assert.equal(ro('get-look', [Cl.uint(L.recipe)]).value.value.approved.type, 'true');
  assert.equal(ro('get-look', [Cl.uint(L.recipe)]).value.value.set.value, 1n);          // community
  mockInscription(simnet, deployer, 701, { hash: hh, size: 9000, creator: W[2] });
  assert.equal(pp(reg(1, 'Big recipe', 1, '', 701, hh, 9000, W[2]).result), errU(206)); // > 8 KB recipe cap
  // modules (tier 2): publisher can register, but unusable until approved. tier 3 admin only.
  mockInscription(simnet, deployer, 702, { hash: hh, size: 50_000, creator: W[2] });
  L.module = lookId(reg(0, 'Sandboxed door', 2, '', 702, hh, 50_000, W[2]));
  assert.equal(ro('get-look', [Cl.uint(L.module)]).value.value.approved.type, 'false');
  assert.equal(pp(reg(0, 'Hero door', 3, '', 702, hh, 50_000, W[2]).result), errU(200));
  assert.equal(pp(call('approve-look', [Cl.uint(L.module), Cl.bool(true)], W[2]).result), errU(200));
  assert.equal(ro('get-looks', [Cl.list([Cl.uint(0), Cl.uint(1)])]).value.length, 2);
  assert.equal(Number(ro('get-look-count').value), 10);
  void nobytes;
});

test('scenes: permissions, bay range, base and door rules', () => {
  assert.equal(pp(addScene({}, W[0]).result), errU(200));                              // stranger
  assert.equal(pp(addScene({ room: 'nope' }).result), errU(202));
  assert.equal(pp(addScene({ bay: 2 }).result), errU(211));
  assert.equal(pp(addScene({ base: 3 }).result), errU(203));
  assert.equal(pp(addScene({ interaction: 4 }).result), errU(203));
  assert.equal(pp(addScene({ base: 2 }).result), errU(205));                           // door base needs a door look
  assert.equal(pp(addScene({ base: 0, doorLook: L.door }).result), errU(205));         // posters base must not
  assert.equal(pp(addScene({ base: 2, doorLook: L.cover }).result), errU(205));        // wrong kind
  assert.equal(pp(addScene({ base: 2, doorLook: 999 }).result), errU(205));            // no such look
  assert.equal(pp(addScene({ base: 2, doorLook: L.module }).result), errU(205));       // module not approved
  // layer kinds and counts
  assert.equal(pp(addScene({ layers: [layer(1, L.sign)] }).result), errU(205));        // slot 1 wants a cover
  assert.equal(pp(addScene({ layers: [layer(0, L.cover)] }).result), errU(205));       // slot 0 is not a layer
  assert.equal(pp(addScene({ layers: [layer(5, L.cover)] }).result), errU(205));
  assert.equal(pp(addScene({ layers: [layer(1, L.cover), layer(1, L.cover2)] }).result), errU(212));
  assert.equal(pp(addScene({ layers: [layer(3, L.sound), layer(3, L.sound2)] }).result), errU(212));
  assert.equal(pp(addScene({ layers: [layer(4, L.light), layer(4, L.light)] }).result), errU(212));
  // links
  assert.equal(pp(addScene({ interaction: 3 }).result), errU(210));                    // enter needs a link
  assert.equal(pp(addScene({ link: link('missing') }).result), errU(210));
  assert.equal(pp(addScene({ link: link('arcade-hall', 5) }).result), errU(210));      // arrival bay out of range
  assert.equal(pp(addScene({ link: link('', 0, 'x/y') }).result), errU(210));          // path must start with /
  assert.equal(pp(addScene({ link: link('', 0, '//evil.example/x') }).result), errU(210)); // no protocol-relative URLs
  assert.equal(pp(addScene({ link: link('', 0, '/\\evil') }).result), errU(210));
  assert.equal(pp(addScene({ link: link('', 0, '') }).result), errU(210));
  call('set-room-hidden', [S('guest-room'), Cl.bool(true)]);
  assert.equal(pp(addScene({ link: link('guest-room', 0) }).result), errU(210));       // hidden room
  call('set-room-hidden', [S('guest-room'), Cl.bool(false)]);
  assert.equal(activeSeq('arcade-hall', 0), null);                                     // nothing was written
});

test('the room owner can write their own room but not others', () => {
  assert.equal(pp(addScene({ room: 'guest-room' }, W[1]).result), okU(0));
  assert.equal(pp(addScene({ room: 'arcade-hall' }, W[1]).result), errU(200));
  assert.equal(pp(addScene({ room: 'guest-room' }, W[2]).result), errU(200));
  assert.equal(activeSeq('guest-room', 0), 0);
  assert.equal(activeSeq('arcade-hall', 0), null);
});

test('a scripted story plays through by block height', () => {
  const t0 = h();
  const story = Cl.list([
    scene({ from: t0 + 10, base: 2, doorLook: L.door, interaction: 1,
      layers: [layer(1, L.cover, '{"open":0}', 'closed'), layer(2, L.sign, '{"text":"COMING SOON"}'), layer(3, L.sound, '{"gap":4}'), layer(4, L.light)] }),
    scene({ from: t0 + 30, base: 2, doorLook: L.door, interaction: 2, layers: [layer(1, L.cover, '{"open":0.5}', 'half')] }),
    scene({ from: t0 + 50, base: 2, doorLook: L.door, interaction: 3, link: link('guest-room', 0), layers: [layer(1, L.cover, '{"open":1}', 'open')] }),
  ]);
  const r = call('add-scenes', [story]);
  assert.equal(pp(r.result), okU(3));
  const first = Number(ro('get-scene-count', [S('arcade-hall'), Cl.uint(0)]).value) - 3;
  assert.equal(activeSeq('arcade-hall', 0), null);                                     // launch: default posters
  assert.equal(nextHeight('arcade-hall', 0), t0 + 10);
  simnet.mineEmptyBurnBlocks(h() < t0 + 10 ? t0 + 10 - h() : 0);
  assert.equal(activeSeq('arcade-hall', 0), first);
  assert.equal(nextHeight('arcade-hall', 0), t0 + 30);
  const active = bay().value.value.active.value.value;
  assert.equal(active.layers.value.length, 4);
  assert.equal(active.base.value, 2n);
  simnet.mineEmptyBurnBlocks(t0 + 30 - h());
  assert.equal(activeSeq('arcade-hall', 0), first + 1);
  simnet.mineEmptyBurnBlocks(t0 + 50 - h());
  assert.equal(activeSeq('arcade-hall', 0), first + 2);
  assert.equal(nextHeight('arcade-hall', 0), null);
  assert.equal(bay().value.value.active.value.value.interaction.value, 3n);
  // the other bay is untouched
  assert.equal(activeSeq('arcade-hall', 1), null);
});

test('retract reverts to the earlier scene; history stays; escape hatch works while paused', () => {
  const cur = activeSeq('arcade-hall', 0);
  assert.equal(pp(call('retract-scene', [S('arcade-hall'), Cl.uint(0), Cl.uint(cur)], W[0]).result), errU(200));
  call('set-paused', [Cl.bool(true)]);
  assert.equal(pp(addScene({ room: 'guest-room' }, W[1]).result), errU(201));      // owner is blocked while paused
  assert.equal(pp(call('set-room-entry', [S('guest-room'), Cl.none()], W[1]).result), errU(201));
  assert.equal(pp(call('retract-scene', [S('arcade-hall'), Cl.uint(0), Cl.uint(cur)]).result), '(ok true)');
  assert.equal(activeSeq('arcade-hall', 0), cur - 1);
  assert.match(pp(addScene({ bay: 1, base: 0 }).result), /^\(ok /);                // admin can still write while paused
  call('set-paused', [Cl.bool(false)]);
  const s = ro('get-scene', [S('arcade-hall'), Cl.uint(0), Cl.uint(cur)]).value.value;
  assert.equal(s.retracted.type, 'true');                                              // still readable
  assert.equal(pp(call('retract-scene', [S('arcade-hall'), Cl.uint(0), Cl.uint(99)]).result), errU(202));
});

test('a new scene starts now even if its from-height is in the past, and beats earlier ones', () => {
  const before = activeSeq('arcade-hall', 0);
  const r = addScene({ from: 1, base: 0 });                                            // revert to posters from now
  const seq = Number(r.result.value.value);
  assert.equal(activeSeq('arcade-hall', 0), seq);
  assert.notEqual(seq, before);
  const stored = Number(ro('get-scene', [S('arcade-hall'), Cl.uint(0), Cl.uint(seq)]).value.value['from-height'].value);
  assert.ok(stored >= h() - 2);                                                        // raised to the current height
  assert.equal(bay().value.value.active.value.value.base.value, 0n);
});

test('same-height scenes: the later one wins', () => {
  const t = h() + 5;
  addScene({ room: 'guest-room', from: t, base: 1 });
  addScene({ room: 'guest-room', from: t, base: 0 });
  simnet.mineEmptyBurnBlocks(6);
  const v = bay('guest-room', 0).value.value;
  assert.equal(v.active.value.value.base.value, 0n);
});

test('a future scene retracted before it starts never shows', () => {
  const t = h() + 8;
  const seq = Number(addScene({ room: 'guest-room', bay: 0, from: t, base: 1 }).result.value.value);
  assert.equal(nextHeight('guest-room', 0), t);
  call('retract-scene', [S('guest-room'), Cl.uint(0), Cl.uint(seq)], W[1]);
  assert.equal(nextHeight('guest-room', 0), null);
  simnet.mineEmptyBurnBlocks(9);
  assert.notEqual(activeSeq('guest-room', 0), seq);
});

test('batch is all or nothing', () => {
  const countBefore = Number(ro('get-scene-count', [S('arcade-hall'), Cl.uint(1)]).value);
  const r = call('add-scenes', [Cl.list([scene({ bay: 1, base: 1 }), scene({ bay: 1, layers: [layer(1, 999)] })])]);
  assert.equal(pp(r.result), errU(205));
  assert.equal(Number(ro('get-scene-count', [S('arcade-hall'), Cl.uint(1)]).value), countBefore);
});

test('approving a module look makes it usable; hiding takes it out of new scenes', () => {
  assert.equal(pp(addScene({ bay: 1, base: 2, doorLook: L.module }).result), errU(205));
  call('approve-look', [Cl.uint(L.module), Cl.bool(true)]);
  assert.match(pp(addScene({ bay: 1, base: 2, doorLook: L.module }).result), /^\(ok /);
  assert.equal(pp(call('set-look-hidden', [Cl.uint(L.module), Cl.bool(true)], W[0]).result), errU(200));
  assert.equal(pp(call('set-look-hidden', [Cl.uint(L.module), Cl.bool(true)], W[2]).result), errU(200)); // owner cannot hide or re-hide
  assert.equal(pp(call('set-look-hidden', [Cl.uint(L.module), Cl.bool(true)]).result), '(ok true)');
  assert.equal(pp(addScene({ bay: 1, base: 2, doorLook: L.module }).result), errU(205));
  assert.equal(pp(call('set-look-hidden', [Cl.uint(L.module), Cl.bool(false)], W[2]).result), errU(200));
  call('set-look-hidden', [Cl.uint(L.module), Cl.bool(false)]);
  assert.match(pp(addScene({ bay: 1, base: 2, doorLook: L.module }).result), /^\(ok /);
});

test('timeline is bounded at 48; compact frees past scenes but keeps the active one and the future', () => {
  const room = 'guest-room';
  const b = 0;
  const startCount = ro('get-timeline', [S(room), Cl.uint(b)]).value.length;
  let added = 0;
  for (; startCount + added < 48; added++) {
    const r = addScene({ room, bay: b, base: added % 2 }, W[1]);
    assert.equal(r.result.type, 'ok');
  }
  assert.equal(pp(addScene({ room, bay: b }, W[1]).result), errU(207));
  const future = h() + 1000;
  call('retract-scene', [S(room), Cl.uint(b), Cl.uint(Number(ro('get-scene-count', [S(room), Cl.uint(b)]).value) - 1)], W[1]);
  assert.match(pp(addScene({ room, bay: b, from: future, base: 1 }, W[1]).result), /^\(ok /);
  const active = activeSeq(room, b);
  assert.equal(pp(call('compact-bay', [S(room), Cl.uint(b)], W[0]).result), errU(200));
  assert.equal(pp(call('compact-bay', [S(room), Cl.uint(b)], W[1]).result), '(ok true)');
  const tl = ro('get-timeline', [S(room), Cl.uint(b)]).value.map((x) => Number(x.value.seq.value));
  assert.equal(tl.length, 2);                                                          // active + the future one
  assert.ok(tl.includes(active));
  assert.equal(activeSeq(room, b), active);
  assert.equal(nextHeight(room, b), future);
  assert.match(pp(addScene({ room, bay: b }, W[1]).result), /^\(ok /);                 // room again
});

test('admin hand-over, pause and successor behave like the poster contract', () => {
  assert.equal(pp(call('set-paused', [Cl.bool(true)], W[1]).result), errU(200));
  call('set-paused', [Cl.bool(true)]);
  assert.equal(pp(builtin(1, 'x', 'k').result), errU(201));
  call('set-paused', [Cl.bool(false)]);
  assert.equal(pp(call('accept-admin', [], W[2]).result), errU(208));
  call('propose-admin', [Cl.principal(W[2])]);
  assert.equal(pp(call('accept-admin', [], W[3]).result), errU(200));
  assert.equal(pp(call('accept-admin', [], W[2]).result), '(ok true)');
  assert.equal(pp(call('set-paused', [Cl.bool(true)]).result), errU(200));
  call('propose-admin', [Cl.principal(deployer)], W[2]);
  call('accept-admin', [], deployer);
  assert.equal(pp(call('set-successor', [Cl.some(Cl.principal(W[0]))], W[1]).result), errU(200));
  call('set-successor', [Cl.some(Cl.principal(W[0]))]);
  call('lock-successor', []);
  assert.equal(pp(call('set-successor', [Cl.none()]).result), errU(209));
  assert.equal(ro('get-successor').value.locked.type, 'true');
});

test('room owner can be changed by the owner or admin; the old owner loses access', () => {
  assert.equal(pp(call('set-room-owner', [S('guest-room'), Cl.principal(W[4])], W[3]).result), errU(200));
  assert.equal(pp(call('set-room-owner', [S('guest-room'), Cl.principal(W[4])], W[1]).result), '(ok true)');
  assert.equal(pp(addScene({ room: 'guest-room' }, W[1]).result), errU(200));
  assert.match(pp(addScene({ room: 'guest-room' }, W[4]).result), /^\(ok /);
  assert.equal(pp(call('set-room-owner', [S('guest-room'), Cl.principal(W[1])]).result), '(ok true)');  // admin takes it back
  assert.match(pp(addScene({ room: 'guest-room' }, W[1]).result), /^\(ok /);
});
