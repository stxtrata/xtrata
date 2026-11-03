// Tests for xtrata-door-skins-v1. Run: node --test tests/
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { Cl } from '@stacks/transactions';
import { boot, contract, pp, okU, errU, hash32, mockInscription } from './helpers.mjs';

let simnet, deployer, W, X;
const call = (fn, args, sender = deployer) => X.call(fn, args, sender);
const ro = (fn, args) => X.ro(fn, args);
const S = (s) => Cl.stringAscii(s);
const ALL = 16383;                       // the 14 door styles known today
const NOHASH = Cl.buffer(new Uint8Array(0));

// register-skin args: key, name, family, tier, builtin, src-id, src-hash, src-size, styles, sound, frame, hardware, wear
function skinArgs(o = {}) {
  const v = {
    key: 'oak', name: 'Oak', family: 0, tier: 0, builtin: 'oak', id: 0, hash: null, size: 0,
    styles: ALL, sound: 0, frame: 'wood', hardware: 'brass', wear: 20, ...o,
  };
  return [S(v.key), S(v.name), Cl.uint(v.family), Cl.uint(v.tier), S(v.builtin), Cl.uint(v.id),
    v.hash ? Cl.buffer(v.hash) : NOHASH, Cl.uint(v.size), Cl.uint(v.styles), Cl.uint(v.sound), S(v.frame), S(v.hardware), Cl.uint(v.wear)];
}
const reg = (o, who = deployer) => call('register-skin', skinArgs(o), who);
const id = (r) => Number(r.result.value.value);
const skin = (n) => ro('get-skin', [Cl.uint(n)]);
const F = (cv) => (cv.type === 'some' ? cv.value.value : cv.value);   // the fields of a tuple or (some tuple)

before(async () => {
  ({ simnet, deployer, W } = await boot());
  X = contract(simnet, 'xtrata-door-skins-v1', deployer);
});

test('admin registers a built-in skin; reads show it by id and by key; keys are unique', () => {
  assert.equal(pp(ro('get-skin-count')), 'u0');
  const r = reg({});
  assert.equal(pp(r.result), okU(0));
  assert.equal(pp(ro('get-skin-count')), 'u1');
  assert.equal(skin(0).type, 'some');
  const t = { value: F(skin(0)) };
  assert.equal(pp(t.value.key), '"oak"');
  assert.equal(pp(t.value.name), '"Oak"');
  assert.equal(pp(t.value.tier), 'u0');
  assert.equal(pp(t.value.set), 'u0');
  assert.equal(pp(t.value.approved), 'true');
  assert.equal(pp(t.value.hidden), 'false');
  assert.equal(pp(t.value.styles), `u${ALL}`);
  assert.equal(pp(t.value.frame), '"wood"');
  assert.equal(pp(t.value.hardware), '"brass"');
  assert.equal(pp(t.value.wear), 'u20');
  assert.equal(pp(ro('get-skin-id', [S('oak')])), '(some u0)');
  const by = ro('get-skin-by-key', [S('oak')]);
  assert.equal(by.type, 'some');
  assert.equal(pp(F(by).id), 'u0');
  assert.equal(pp(F(by).key), '"oak"');
  assert.equal(pp(ro('get-skin-by-key', [S('nope')])), 'none');
  assert.equal(pp(ro('get-skin-id', [S('nope')])), 'none');
  assert.equal(pp(reg({ name: 'Another oak' }).result), errU(304));      // key already taken
  assert.equal(pp(ro('get-skin-count')), 'u1');
});

test('keys: lowercase letters, digits and hyphens, 2 to 24, no leading or trailing hyphen', () => {
  const bad = ['O', 'a', 'Oak', 'oak wood', 'oak_wood', '-oak', 'oak-', 'oak!', 'oak.wood', '', 'two words', 'UPPER', 'a/b', 'a:b'];
  for (const key of bad) assert.equal(pp(reg({ key, builtin: 'x' }).result), errU(303), `key ${JSON.stringify(key)}`);
  const ok = ['ab', 'brushed-steel', 'door-2', '9lives', 'a-b-c', 'abcdefghijklmnopqrstuvwx'];
  for (const key of ok) assert.match(pp(reg({ key, name: key, builtin: key }).result), /^\(ok u\d+\)$/, key);
});

test('other fields are bounded', () => {
  const n0 = Number(ro('get-skin-count').value);
  const cases = [
    { key: 'f1', family: 6 }, { key: 'f2', sound: 4 }, { key: 'f3', wear: 101 }, { key: 'f4', styles: 0 },
    { key: 'f5', styles: 4294967296 }, { key: 'f6', name: '' }, { key: 'f7', tier: 2 }, { key: 'f8', builtin: '' },
  ];
  for (const c of cases) assert.equal(pp(reg({ builtin: 'x', ...c }).result), errU(303), JSON.stringify(c));
  assert.equal(pp(ro('get-skin-count')), `u${n0}`, 'nothing registered by the refused calls');
  assert.match(pp(reg({ key: 'edge-ok', builtin: 'x', family: 5, sound: 3, wear: 100, styles: 4294967295 }).result), /^\(ok u\d+\)$/);
});

test('publishers: tier 1 recipes only, the inscription must be the sender\'s sealed one, caps apply', () => {
  const pub = W[0];
  assert.equal(pp(reg({ key: 'pub-a', tier: 1, builtin: '', id: 1, hash: hash32(1), size: 100 }, pub).result), errU(300));   // not a publisher yet
  assert.equal(pp(call('set-publisher', [Cl.principal(pub), Cl.bool(true)], pub).result), errU(300));                           // only admin
  assert.equal(pp(call('set-publisher', [Cl.principal(pub), Cl.bool(true)]).result), '(ok true)');
  assert.equal(pp(ro('is-publisher', [Cl.principal(pub)])), 'true');
  // a publisher may not name a built-in
  assert.equal(pp(reg({ key: 'pub-b', tier: 0, builtin: 'x' }, pub).result), errU(300));
  // no inscription yet
  assert.equal(pp(reg({ key: 'pub-a', tier: 1, builtin: '', id: 1, hash: hash32(1), size: 100 }, pub).result), errU(305));
  mockInscription(simnet, deployer, 1, { hash: hash32(1), size: 100, creator: pub });
  mockInscription(simnet, deployer, 2, { hash: hash32(2), size: 100, creator: W[1] });
  mockInscription(simnet, deployer, 3, { hash: hash32(3), size: 100, creator: pub, sealed: false });
  mockInscription(simnet, deployer, 4, { hash: hash32(4), size: 9000, creator: pub });
  const t1 = (o) => reg({ tier: 1, builtin: '', ...o }, pub);
  assert.equal(pp(t1({ key: 'pub-a', id: 2, hash: hash32(2), size: 100 }).result), errU(305), 'someone else\'s inscription');
  assert.equal(pp(t1({ key: 'pub-a', id: 3, hash: hash32(3), size: 100 }).result), errU(305), 'not sealed');
  assert.equal(pp(t1({ key: 'pub-a', id: 1, hash: hash32(9), size: 100 }).result), errU(305), 'wrong hash');
  assert.equal(pp(t1({ key: 'pub-a', id: 1, hash: hash32(1), size: 101 }).result), errU(305), 'wrong size');
  assert.equal(pp(t1({ key: 'pub-a', id: 4, hash: hash32(4), size: 9000 }).result), errU(305), 'bigger than 8192 bytes');
  assert.equal(pp(t1({ key: 'pub-a', id: 1, hash: hash32(1), size: 0 }).result), errU(305), 'empty recipe');
  assert.equal(pp(t1({ key: 'pub-a', id: 1, hash: hash32(1), size: 100, builtin: 'oak' }).result), errU(303), 'a recipe names no built-in');
  const r = t1({ key: 'pub-a', name: 'Publisher skin', id: 1, hash: hash32(1), size: 100 });
  assert.match(pp(r.result), /^\(ok u\d+\)$/);
  const t = F(skin(id(r)));
  assert.equal(pp(t.set), 'u1', 'community');
  assert.equal(pp(t.tier), 'u1');
  assert.equal(pp(t.approved), 'false', 'review lane is on by default');
  assert.equal(pp(t['src-id']), 'u1');
  assert.equal(pp(t.owner), `'${pub}`);
  assert.equal(pp(ro('get-publisher-skins', [Cl.principal(pub)])), 'u1');
});

test('review lane: publisher skins wait for approval; turning the lane off approves new ones at once', () => {
  const pub = W[0];
  const n = Number(ro('get-skin-count').value) - 1;                         // the publisher skin from the last test
  assert.equal(pp(call('approve-skin', [Cl.uint(n), Cl.bool(true)], pub).result), errU(300));
  assert.equal(pp(call('approve-skin', [Cl.uint(n), Cl.bool(true)]).result), '(ok true)');
  assert.equal(pp(F(skin(n)).approved), 'true');
  assert.equal(pp(call('approve-skin', [Cl.uint(n), Cl.bool(false)]).result), '(ok true)');
  assert.equal(pp(F(skin(n)).approved), 'false');
  assert.equal(pp(call('approve-skin', [Cl.uint(9999), Cl.bool(true)]).result), errU(302));
  assert.equal(pp(call('set-review-lane', [Cl.bool(false)], pub).result), errU(300));
  assert.equal(pp(call('set-review-lane', [Cl.bool(false)]).result), '(ok true)');
  assert.equal(pp(ro('get-limits').value['review-lane']), 'false');
  mockInscription(simnet, deployer, 10, { hash: hash32(10), size: 50, creator: pub });
  const r = reg({ key: 'pub-b', tier: 1, builtin: '', id: 10, hash: hash32(10), size: 50 }, pub);
  assert.equal(pp(F(skin(id(r))).approved), 'true');
  call('set-review-lane', [Cl.bool(true)]);
});

test('publisher cap counts every skin the publisher registered, even hidden ones', () => {
  const pub = W[2];
  call('set-publisher', [Cl.principal(pub), Cl.bool(true)]);
  assert.equal(pp(call('set-cap-per-publisher', [Cl.uint(2)], pub).result), errU(300));
  assert.equal(pp(call('set-cap-per-publisher', [Cl.uint(65)]).result), errU(303));
  assert.equal(pp(call('set-cap-per-publisher', [Cl.uint(2)]).result), '(ok true)');
  const mk = (n) => {
    mockInscription(simnet, deployer, 100 + n, { hash: hash32(100 + n), size: 40, creator: pub });
    return reg({ key: `cap-${n}`, tier: 1, builtin: '', id: 100 + n, hash: hash32(100 + n), size: 40 }, pub);
  };
  const a = mk(1), b = mk(2);
  assert.match(pp(a.result), /^\(ok/); assert.match(pp(b.result), /^\(ok/);
  assert.equal(pp(mk(3).result), errU(308));
  call('set-skin-hidden', [Cl.uint(id(a)), Cl.bool(true)]);
  assert.equal(pp(mk(3).result), errU(308), 'hiding does not free a slot');
  assert.equal(pp(call('set-cap-per-publisher', [Cl.uint(3)]).result), '(ok true)');
  assert.match(pp(mk(3).result), /^\(ok/);
  // admin skins are not capped and do not count against the cap
  assert.equal(pp(call('set-cap-per-publisher', [Cl.uint(0)]).result), '(ok true)');
  assert.match(pp(reg({ key: 'admin-uncapped', builtin: 'x' }).result), /^\(ok/);
  call('set-cap-per-publisher', [Cl.uint(24)]);
});

test('hide and unhide: admin only; the key stays reserved; reads keep the skin', () => {
  const n = id(reg({ key: 'to-hide', builtin: 'x' }));
  assert.equal(pp(call('set-skin-hidden', [Cl.uint(n), Cl.bool(true)], W[0]).result), errU(300));
  assert.equal(pp(call('set-skin-hidden', [Cl.uint(n), Cl.bool(true)]).result), '(ok true)');
  assert.equal(pp(F(skin(n)).hidden), 'true');
  assert.equal(pp(reg({ key: 'to-hide', builtin: 'x' }).result), errU(304), 'a hidden skin keeps its key');
  assert.equal(pp(ro('get-skin-id', [S('to-hide')])), `(some u${n})`);
  assert.equal(pp(call('set-skin-hidden', [Cl.uint(n), Cl.bool(false)]).result), '(ok true)');
  assert.equal(pp(call('set-skin-hidden', [Cl.uint(9999), Cl.bool(true)]).result), errU(302));
});

test('styles mask: admin may change which door styles a skin wears, within bounds', () => {
  const n = id(reg({ key: 'pairing', builtin: 'x', styles: 3 }));
  assert.equal(pp(F(skin(n)).styles), 'u3');
  assert.equal(pp(call('set-skin-styles', [Cl.uint(n), Cl.uint(8)], W[0]).result), errU(300));
  assert.equal(pp(call('set-skin-styles', [Cl.uint(n), Cl.uint(0)]).result), errU(303));
  assert.equal(pp(call('set-skin-styles', [Cl.uint(n), Cl.uint(4294967296)]).result), errU(303));
  assert.equal(pp(call('set-skin-styles', [Cl.uint(9999), Cl.uint(1)]).result), errU(302));
  assert.equal(pp(call('set-skin-styles', [Cl.uint(n), Cl.uint(8)]).result), '(ok true)');
  assert.equal(pp(F(skin(n)).styles), 'u8');
  // nothing else about the skin moved
  assert.equal(pp(F(skin(n)).key), '"pairing"');
});

test('get-skins reads up to 20 ids at once and gives none for unknown ids', () => {
  const r = ro('get-skins', [Cl.list([Cl.uint(0), Cl.uint(1), Cl.uint(99999)])]);
  assert.equal(r.type, 'list');
  assert.equal(r.value.length, 3);
  assert.equal(r.value[0].type, 'some');
  assert.equal(r.value[2].type, 'none');
});

test('pause: new registrations stop for everyone including admin; admin moderation keeps working', () => {
  assert.equal(pp(call('set-paused', [Cl.bool(true)], W[0]).result), errU(300));
  assert.equal(pp(call('set-paused', [Cl.bool(true)]).result), '(ok true)');
  assert.equal(pp(ro('get-config').value.paused), 'true');
  assert.equal(pp(reg({ key: 'during-pause', builtin: 'x' }).result), errU(301));
  assert.equal(pp(call('set-skin-hidden', [Cl.uint(0), Cl.bool(true)]).result), '(ok true)');
  assert.equal(pp(call('set-skin-hidden', [Cl.uint(0), Cl.bool(false)]).result), '(ok true)');
  assert.equal(pp(call('approve-skin', [Cl.uint(0), Cl.bool(true)]).result), '(ok true)');
  assert.equal(pp(call('set-paused', [Cl.bool(false)]).result), '(ok true)');
  assert.match(pp(reg({ key: 'after-pause', builtin: 'x' }).result), /^\(ok/);
});

test('every write bumps the version; reads do not', () => {
  const v0 = Number(ro('get-version').value);
  ro('get-skin-count'); ro('get-skin', [Cl.uint(0)]);
  assert.equal(Number(ro('get-version').value), v0);
  reg({ key: 'bumps', builtin: 'x' });
  assert.equal(Number(ro('get-version').value), v0 + 1);
  call('set-skin-hidden', [Cl.uint(0), Cl.bool(false)]);
  assert.equal(Number(ro('get-version').value), v0 + 2);
  reg({ key: 'bumps', builtin: 'x' });                                      // refused: no bump
  assert.equal(Number(ro('get-version').value), v0 + 2);
});

test('admin hand-over is two-step; the old admin loses access', () => {
  assert.equal(pp(call('accept-admin', [], W[3]).result), errU(306));
  assert.equal(pp(call('propose-admin', [Cl.principal(W[3])], W[3]).result), errU(300));
  assert.equal(pp(call('propose-admin', [Cl.principal(W[3])]).result), '(ok true)');
  assert.equal(pp(call('accept-admin', [], W[4]).result), errU(300));
  assert.equal(pp(call('accept-admin', [], W[3]).result), '(ok true)');
  assert.equal(pp(ro('get-config').value.admin), `'${W[3]}`);
  assert.equal(pp(reg({ key: 'old-admin', builtin: 'x' }).result), errU(300));
  assert.match(pp(reg({ key: 'new-admin', builtin: 'x' }, W[3]).result), /^\(ok/);
  // give it back for the tests that follow
  call('propose-admin', [Cl.principal(deployer)], W[3]);
  assert.equal(pp(call('accept-admin', [], deployer).result), '(ok true)');
});

test('successor pointer: set, change, lock for good', () => {
  assert.equal(pp(call('set-successor', [Cl.some(Cl.principal(W[5]))], W[0]).result), errU(300));
  assert.equal(pp(call('set-successor', [Cl.some(Cl.principal(W[5]))]).result), '(ok true)');
  assert.equal(pp(ro('get-successor').value.locked), 'false');
  assert.equal(pp(call('set-successor', [Cl.none()]).result), '(ok true)');
  assert.equal(pp(call('lock-successor', [], W[0]).result), errU(300));
  assert.equal(pp(call('lock-successor', []).result), '(ok true)');
  assert.equal(pp(call('set-successor', [Cl.some(Cl.principal(W[5]))]).result), errU(307));
  assert.equal(pp(ro('get-successor').value.locked), 'true');
});

test('the catalogue is bounded at 512 skins', () => {
  let n = Number(ro('get-skin-count').value);
  const key = (i) => 's' + i.toString(36).padStart(4, '0');
  while (n < 512) { const r = reg({ key: key(n), builtin: 'x' }); assert.match(pp(r.result), /^\(ok/); n++; }
  assert.equal(pp(ro('get-skin-count')), 'u512');
  assert.equal(pp(reg({ key: 'one-too-many', builtin: 'x' }).result), errU(309));
  assert.equal(pp(ro('get-limits').value['max-skins']), 'u512');
});
