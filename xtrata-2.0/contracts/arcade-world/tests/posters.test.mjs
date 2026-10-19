// Tests for xtrata-posters-v1. Run: node --test tests/
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { Cl } from '@stacks/transactions';
import { boot, contract, pp, okU, errU, hash32, mockInscription, btcDay } from './helpers.mjs';

let simnet, deployer, W, P;
const call = (fn, args, sender) => P.call(fn, args, sender);
const ro = (fn, args) => P.ro(fn, args);

function poster(o = {}) {
  const d = btcDay(simnet);
  const v = {
    set: 1, kind: 0, head: 'NEW GAME', sub: 'Now on the wall', foot: 'XTRATA', colour: 'gold', art: 'star',
    imageId: 0, imageHash: new Uint8Array(0), imageSize: 0, cols: 0, frames: 0, fps: 0,
    actKind: 0, actId: 0, actText: '', weight: 5, start: d + 1, end: d + 8, scope: [], evergreen: false,
    payout: null, ...o,
  };
  return Cl.tuple({
    set: Cl.uint(v.set), kind: Cl.uint(v.kind),
    head: Cl.stringAscii(v.head), sub: Cl.stringAscii(v.sub), foot: Cl.stringAscii(v.foot),
    colour: Cl.stringAscii(v.colour), art: Cl.stringAscii(v.art),
    'image-id': Cl.uint(v.imageId), 'image-hash': Cl.buffer(v.imageHash), 'image-size': Cl.uint(v.imageSize),
    cols: Cl.uint(v.cols), frames: Cl.uint(v.frames), fps: Cl.uint(v.fps),
    'act-kind': Cl.uint(v.actKind), 'act-id': Cl.uint(v.actId), 'act-text': Cl.stringAscii(v.actText),
    weight: Cl.uint(v.weight), 'start-day': Cl.uint(v.start), 'end-day': Cl.uint(v.end),
    scope: Cl.list(v.scope.map((s) => Cl.stringAscii(s))), evergreen: Cl.bool(v.evergreen),
    payout: v.payout ? Cl.some(Cl.principal(v.payout)) : Cl.none(),
  });
}
const add = (o, who = deployer) => call('add-poster', [poster(o)], who);
const liveIds = () => ro('get-live').value.map((x) => Number(x.value));
const getP = (id) => ro('get-poster', [Cl.uint(id)]);
const gap = () => simnet.mineEmptyBurnBlocks(2);   // min gap is measured in burn blocks

before(async () => {
  ({ simnet, deployer, W } = await boot());
  P = contract(simnet, 'xtrata-posters-v1', deployer);
});

test('admin adds a template poster; it is live and the version moves', () => {
  const v0 = Number(ro('get-version').value);
  const r = add({ set: 0, weight: 40 });
  assert.equal(pp(r.result), okU(0));
  assert.equal(Number(ro('get-count').value), 1);
  assert.deepEqual(liveIds(), [0]);
  assert.ok(Number(ro('get-version').value) > v0);
  const p = getP(0).value.value;
  assert.equal(p.head.value, 'NEW GAME');
  assert.equal(p.hidden.type, 'false');
});

test('publishers: only whitelisted, community only, no evergreen, weight ceiling', () => {
  assert.equal(pp(add({}, W[0]).result), errU(100));
  assert.equal(pp(call('set-publisher', [Cl.principal(W[0]), Cl.bool(true)], W[1]).result), errU(100));
  assert.equal(pp(call('set-publisher', [Cl.principal(W[0]), Cl.bool(true)], deployer).result), '(ok true)');
  gap();
  assert.equal(pp(add({ set: 0 }, W[0]).result), errU(100));       // core is admin only
  gap();
  assert.equal(pp(add({ evergreen: true }, W[0]).result), errU(100));
  gap();
  assert.equal(pp(add({ weight: 21 }, W[0]).result), errU(105));   // community ceiling 20
  gap();
  assert.equal(pp(add({ weight: 0 }, W[0]).result), errU(105));
  gap();
  assert.match(pp(add({ weight: 20 }, W[0]).result), /^\(ok u\d+\)$/);
  assert.match(pp(add({ set: 0, weight: 100 }).result), /^\(ok /);                  // core ceiling is 100
  assert.equal(pp(add({ set: 0, weight: 101 }).result), errU(105));
});

test('windows: start must be in the future, end after start, span capped', () => {
  const d = btcDay(simnet);
  assert.equal(pp(add({ start: d, end: d + 5 }).result), errU(104));
  assert.equal(pp(add({ start: d + 2, end: d + 2 }).result), errU(104));
  assert.equal(pp(add({ start: d + 1, end: d + 1 + 3651 }).result), errU(104));
  assert.match(pp(add({ start: d + 1, end: d + 1 + 3650 }).result), /^\(ok /);
});

test('text rules: head required; bad kind/set/action rejected', () => {
  assert.equal(pp(add({ head: '' }).result), errU(103));
  assert.equal(pp(add({ kind: 4 }).result), errU(103));
  assert.equal(pp(add({ set: 2 }).result), errU(103));
  assert.equal(pp(add({ actKind: 4 }).result), errU(103));
  assert.equal(pp(add({ kind: 3, art: '' }).result), errU(103));   // live needs a binding key
  assert.match(pp(add({ kind: 3, art: 'topscore:astro3' }).result), /^\(ok /);
});

test('image and sheet posters need a sealed inscription that matches, made by the sender', () => {
  const h = hash32(7);
  mockInscription(simnet, deployer, 900, { hash: h, size: 90_000, creator: deployer });
  const good = { kind: 1, imageId: 900, imageHash: h, imageSize: 90_000 };
  assert.match(pp(add(good).result), /^\(ok /);
  assert.equal(pp(add({ ...good, imageHash: hash32(8) }).result), errU(106));
  assert.equal(pp(add({ ...good, imageSize: 90_001 }).result), errU(106));
  assert.equal(pp(add({ ...good, imageId: 901 }).result), errU(106));      // does not exist
  mockInscription(simnet, deployer, 902, { hash: h, size: 90_000, creator: deployer, sealed: false });
  assert.equal(pp(add({ ...good, imageId: 902 }).result), errU(106));     // not sealed
  mockInscription(simnet, deployer, 903, { hash: h, size: 90_000, creator: W[2] });
  assert.equal(pp(add({ ...good, imageId: 903 }).result), errU(106));     // someone else's
  mockInscription(simnet, deployer, 904, { hash: h, size: 131_073, creator: deployer });
  assert.equal(pp(add({ kind: 1, imageId: 904, imageHash: h, imageSize: 131_073 }).result), errU(106)); // > 128 KB
  mockInscription(simnet, deployer, 905, { hash: h, size: 200_000, creator: deployer });
  const sheet = { kind: 2, imageId: 905, imageHash: h, imageSize: 200_000, cols: 4, frames: 8, fps: 12 };
  assert.match(pp(add(sheet).result), /^\(ok /);
  assert.equal(pp(add({ ...sheet, fps: 0 }).result), errU(103));
  assert.equal(pp(add({ ...sheet, fps: 31 }).result), errU(103));
  assert.equal(pp(add({ ...sheet, frames: 65 }).result), errU(103));
  assert.equal(pp(add({ ...sheet, cols: 0 }).result), errU(103));
});

test('publisher caps: per day, live per publisher, min gap; admin exempt; batch is atomic', () => {
  const w = W[3];
  call('set-publisher', [Cl.principal(w), Cl.bool(true)], deployer);
  call('set-caps', [Cl.uint(3), Cl.uint(40), Cl.uint(1)], deployer);
  const base = Number(ro('get-count').value);
  for (let i = 0; i < 3; i++) { gap(); assert.match(pp(add({ weight: 3 }, w).result), /^\(ok /); }
  gap();
  assert.equal(pp(add({}, w).result), errU(107));                          // per-day cap
  assert.match(pp(add({}).result), /^\(ok /);                              // admin exempt
  // batch of 2 would exceed a cap of 3 in total: nothing is written
  const before = Number(ro('get-count').value);
  gap();
  const r = call('add-posters', [Cl.list([poster(), poster()])], W[3]);
  assert.equal(pp(r.result), errU(107));
  assert.equal(Number(ro('get-count').value), before);
  // min gap
  call('set-caps', [Cl.uint(100), Cl.uint(40), Cl.uint(50)], deployer);
  const w2 = W[4];
  call('set-publisher', [Cl.principal(w2), Cl.bool(true)], deployer);
  assert.match(pp(add({}, w2).result), /^\(ok /);
  assert.equal(pp(add({}, w2).result), errU(109));
  simnet.mineEmptyBurnBlocks(50);
  assert.match(pp(add({}, w2).result), /^\(ok /);
  call('set-caps', [Cl.uint(24), Cl.uint(12), Cl.uint(1)], deployer);
  assert.ok(Number(ro('get-count').value) > base);
});

test('caps are bounded: bad set-caps rejected, non-admin cannot set', () => {
  assert.equal(pp(call('set-caps', [Cl.uint(101), Cl.uint(1), Cl.uint(1)], deployer).result), errU(103));
  assert.equal(pp(call('set-caps', [Cl.uint(1), Cl.uint(65), Cl.uint(1)], deployer).result), errU(103));
  assert.equal(pp(call('set-caps', [Cl.uint(1), Cl.uint(1), Cl.uint(145)], deployer).result), errU(103));
  assert.equal(pp(call('set-caps', [Cl.uint(1), Cl.uint(1), Cl.uint(1)], W[0]).result), errU(100));
});

test('hide, release, and who may do which', () => {
  const w = W[5];
  call('set-publisher', [Cl.principal(w), Cl.bool(true)], deployer);
  gap();
  const id = Number(add({}, w).result.value.value);
  assert.ok(liveIds().includes(id));
  assert.equal(pp(call('set-hidden', [Cl.uint(id), Cl.bool(true)], W[0]).result), errU(100)); // stranger
  assert.equal(pp(call('set-hidden', [Cl.uint(id), Cl.bool(true)], w).result), '(ok true)');   // owner hides
  assert.ok(!liveIds().includes(id));
  assert.equal(pp(call('set-hidden', [Cl.uint(id), Cl.bool(false)], w).result), errU(100));    // owner cannot unhide
  assert.equal(pp(call('set-hidden', [Cl.uint(id), Cl.bool(false)], deployer).result), '(ok true)');
  assert.ok(liveIds().includes(id));
  assert.equal(pp(call('set-hidden', [Cl.uint(9999), Cl.bool(true)], deployer).result), errU(102));
});

test('review lane: publisher posters start hidden until admin releases them', () => {
  const w = W[0];
  call('set-publisher', [Cl.principal(w), Cl.bool(true)], deployer);
  assert.equal(pp(call('set-review-lane', [Cl.bool(true)], W[1]).result), errU(100));
  call('set-review-lane', [Cl.bool(true)], deployer);
  gap();
  const id = Number(add({}, w).result.value.value);
  assert.equal(getP(id).value.value.hidden.type, 'true');
  assert.ok(!liveIds().includes(id));
  const adminId = Number(add({}).result.value.value);                      // admin is never held back
  assert.ok(liveIds().includes(adminId));
  assert.equal(pp(call('release-posters', [Cl.list([Cl.uint(id)])], w).result), errU(100));
  assert.equal(pp(call('release-posters', [Cl.list([Cl.uint(id)])], deployer).result), '(ok true)');
  assert.ok(liveIds().includes(id));
  assert.equal(getP(id).value.value.hidden.type, 'false');
  call('set-review-lane', [Cl.bool(false)], deployer);
});

test('live set is bounded at 64 (core posters); hiding frees a place; expired posters are pruned', () => {
  // run on a fresh chain state: hide everything first
  for (const id of liveIds()) call('set-hidden', [Cl.uint(id), Cl.bool(true)], deployer);
  assert.equal(liveIds().length, 0);
  const d = btcDay(simnet);
  for (let b = 0; b < 6; b++) {
    const r = call('add-posters', [Cl.list(Array.from({ length: 10 }, () => poster({ set: 0, start: d + 1, end: d + 3 })))], deployer);
    assert.equal(r.result.type, 'ok');
  }
  const r4 = call('add-posters', [Cl.list(Array.from({ length: 4 }, () => poster({ set: 0, start: d + 1, end: d + 3 })))], deployer);
  assert.equal(r4.result.type, 'ok');
  assert.equal(liveIds().length, 64);
  assert.equal(pp(add({ set: 0, start: d + 1, end: d + 3 }).result), errU(110));
  const first = liveIds()[0];
  call('set-hidden', [Cl.uint(first), Cl.bool(true)], deployer);
  assert.equal(liveIds().length, 63);
  assert.match(pp(add({ set: 0, start: d + 1, end: d + 3 }).result), /^\(ok /);
  assert.equal(liveIds().length, 64);
  // let them expire (end-day d+3), then one add prunes the set
  simnet.mineEmptyBurnBlocks(144 * 4);
  const d2 = btcDay(simnet);
  assert.match(pp(add({ set: 0, start: d2 + 1, end: d2 + 5 }).result), /^\(ok /);
  assert.equal(liveIds().length, 1);
});

test('community posters can take at most 48 of the 64 live places; core always has room', () => {
  for (const id of liveIds()) call('set-hidden', [Cl.uint(id), Cl.bool(true)], deployer);
  const d = btcDay(simnet);
  const comm = () => Array.from({ length: 10 }, () => poster({ set: 1, start: d + 1, end: d + 4 }));
  for (let b = 0; b < 4; b++) assert.equal(call('add-posters', [Cl.list(comm())], deployer).result.type, 'ok');
  assert.equal(call('add-posters', [Cl.list(comm().slice(0, 8))], deployer).result.type, 'ok');   // 48 community
  assert.equal(liveIds().length, 48);
  assert.equal(pp(add({ set: 1, start: d + 1, end: d + 4 }).result), errU(110));                   // 49th community refused
  for (let i = 0; i < 16; i++) assert.match(pp(add({ set: 0, start: d + 1, end: d + 4 }).result), /^\(ok /);
  assert.equal(liveIds().length, 64);
  assert.equal(pp(add({ set: 0, start: d + 1, end: d + 4 }).result), errU(110));
});

test('evergreen posters stay in the live set after their end day', () => {
  for (const id of liveIds()) call('set-hidden', [Cl.uint(id), Cl.bool(true)], deployer);
  const d = btcDay(simnet);
  const id = Number(add({ start: d + 1, end: d + 2, evergreen: true, set: 0 }).result.value.value);
  simnet.mineEmptyBurnBlocks(144 * 4);
  const d2 = btcDay(simnet);
  add({ start: d2 + 1, end: d2 + 5 });                                     // triggers prune
  assert.ok(liveIds().includes(id));
  assert.equal(pp(call('set-evergreen', [Cl.uint(id), Cl.bool(false)], W[0]).result), errU(100));
  call('set-evergreen', [Cl.uint(id), Cl.bool(false)], deployer);
  add({ start: d2 + 1, end: d2 + 5 });
  assert.ok(!liveIds().includes(id));
});

test('weights, sets and windows can be changed by admin only, within the rules', () => {
  const d = btcDay(simnet);
  const id = Number(add({ start: d + 3, end: d + 9, weight: 10 }).result.value.value);
  assert.equal(pp(call('set-weight', [Cl.uint(id), Cl.uint(15)], W[0]).result), errU(100));
  assert.equal(pp(call('set-weight', [Cl.uint(id), Cl.uint(21)], deployer).result), errU(105)); // community ceiling
  assert.equal(pp(call('set-weight', [Cl.uint(id), Cl.uint(15)], deployer).result), '(ok true)');
  assert.equal(pp(call('set-set', [Cl.uint(id), Cl.uint(0)], deployer).result), '(ok true)');
  assert.equal(pp(call('set-weight', [Cl.uint(id), Cl.uint(90)], deployer).result), '(ok true)');
  assert.equal(pp(call('set-set', [Cl.uint(id), Cl.uint(1)], deployer).result), errU(105));      // 90 > community ceiling
  // window: start can move while in the future; once started it is fixed
  assert.equal(pp(call('set-window', [Cl.uint(id), Cl.uint(d + 4), Cl.uint(d + 20)], deployer).result), '(ok true)');
  assert.equal(pp(call('set-window', [Cl.uint(id), Cl.uint(d), Cl.uint(d + 20)], deployer).result), errU(104));
  simnet.mineEmptyBurnBlocks(144 * 5);                                      // now started
  const d2 = btcDay(simnet);
  assert.equal(pp(call('set-window', [Cl.uint(id), Cl.uint(d2 + 1), Cl.uint(d2 + 9)], deployer).result), errU(104));
  assert.equal(pp(call('set-window', [Cl.uint(id), Cl.uint(d + 4), Cl.uint(d2 + 9)], deployer).result), '(ok true)'); // end may move
});

test('pins: admin only, replace by spot, expire, clear', () => {
  const d = btcDay(simnet);
  const id = Number(add({ set: 0, weight: 50, start: d + 1, end: d + 30 }).result.value.value);
  const pin = (room, spot, poster, from, to, who = deployer) =>
    call('set-pin', [Cl.stringAscii(room), Cl.uint(spot), Cl.uint(poster), Cl.uint(from), Cl.uint(to)], who);
  assert.equal(pp(pin('arcade-hall', 1, id, d, d + 2, W[0]).result), errU(100));
  assert.equal(pp(pin('arcade-hall', 1, 99999, d, d + 2).result), errU(102));
  assert.equal(pp(pin('arcade-hall', 1, id, d + 3, d + 2).result), errU(104));
  assert.equal(pp(pin('arcade-hall', 1, id, d, d + 2).result), '(ok true)');
  assert.equal(pp(pin('arcade-hall', 2, id, d, d + 4).result), '(ok true)');
  assert.equal(ro('get-pins', [Cl.stringAscii('arcade-hall')]).value.length, 2);
  assert.equal(pp(pin('arcade-hall', 1, id, d, d + 9).result), '(ok true)'); // same spot replaces
  const pins = ro('get-pins', [Cl.stringAscii('arcade-hall')]).value;
  assert.equal(pins.length, 2);
  assert.equal(pp(call('clear-pin', [Cl.stringAscii('arcade-hall'), Cl.uint(2)], W[0]).result), errU(100));
  call('clear-pin', [Cl.stringAscii('arcade-hall'), Cl.uint(2)], deployer);
  assert.equal(ro('get-pins', [Cl.stringAscii('arcade-hall')]).value.length, 1);
  assert.equal(ro('get-pins', [Cl.stringAscii('lobby')]).value.length, 0);   // per room
  // 16 spots max
  for (let s = 10; s < 25; s++) pin('arcade-hall', s, id, d, d + 2);
  assert.equal(pp(pin('arcade-hall', 99, id, d, d + 2).result), errU(113));
});

test('suppress embedded posters by index', () => {
  const sup = (i, who = deployer) => call('suppress-genesis', [Cl.uint(i)], who);
  assert.equal(pp(sup(3, W[0]).result), errU(100));
  assert.equal(pp(sup(256).result), errU(103));
  assert.equal(pp(sup(3).result), '(ok true)');
  assert.equal(pp(sup(3).result), '(ok true)');                              // idempotent
  assert.equal(pp(sup(5).result), '(ok true)');
  assert.deepEqual(ro('get-suppressed').value.map((x) => Number(x.value)), [3, 5]);
  assert.equal(pp(call('unsuppress-genesis', [Cl.uint(3)], W[0]).result), errU(100));
  call('unsuppress-genesis', [Cl.uint(3)], deployer);
  assert.deepEqual(ro('get-suppressed').value.map((x) => Number(x.value)), [5]);
});

test('paging reads', () => {
  const page = ro('get-page', [Cl.uint(0)]).value;
  assert.equal(page.length, 10);
  assert.equal(page[0].type, 'some');
  const far = ro('get-page', [Cl.uint(100000)]).value;
  assert.ok(far.every((x) => x.type === 'none'));
  assert.equal(ro('get-posters', [Cl.list([Cl.uint(0), Cl.uint(1)])]).value.length, 2);
});

test('pause stops publishing but not hiding; admin hand-over is two steps', () => {
  call('set-publisher', [Cl.principal(W[1]), Cl.bool(true)], deployer);
  assert.equal(pp(call('set-paused', [Cl.bool(true)], W[1]).result), errU(100));
  call('set-paused', [Cl.bool(true)], deployer);
  assert.equal(pp(add({}).result), errU(101));
  assert.equal(pp(add({}, W[1]).result), errU(101));
  const id = liveIds()[0];
  assert.equal(pp(call('set-hidden', [Cl.uint(id), Cl.bool(true)], deployer).result), '(ok true)');
  call('set-paused', [Cl.bool(false)], deployer);
  // hand-over
  assert.equal(pp(call('accept-admin', [], W[2]).result), errU(111));
  assert.equal(pp(call('propose-admin', [Cl.principal(W[2])], W[1]).result), errU(100));
  call('propose-admin', [Cl.principal(W[2])], deployer);
  assert.equal(pp(call('accept-admin', [], W[3]).result), errU(100));
  assert.equal(pp(call('accept-admin', [], W[2]).result), '(ok true)');
  assert.equal(pp(call('set-paused', [Cl.bool(true)], deployer).result), errU(100));   // old admin lost the role
  assert.equal(pp(call('set-paused', [Cl.bool(true)], W[2]).result), '(ok true)');
  call('set-paused', [Cl.bool(false)], W[2]);
  // hand it back so later tests can use the deployer
  call('propose-admin', [Cl.principal(deployer)], W[2]);
  call('accept-admin', [], deployer);
  assert.equal(ro('get-config').value.admin.value, deployer);
});

test('successor pointer: set, clear, lock is one way', () => {
  assert.equal(pp(call('set-successor', [Cl.some(Cl.principal(W[0]))], W[1]).result), errU(100));
  assert.equal(pp(call('set-successor', [Cl.some(Cl.principal(W[0]))], deployer).result), '(ok true)');
  assert.equal(ro('get-successor').value.successor.type, 'some');
  assert.equal(pp(call('set-successor', [Cl.none()], deployer).result), '(ok true)');
  call('set-successor', [Cl.some(Cl.principal(W[0]))], deployer);
  assert.equal(pp(call('lock-successor', [], W[1]).result), errU(100));
  call('lock-successor', [], deployer);
  assert.equal(pp(call('set-successor', [Cl.none()], deployer).result), errU(112));
  assert.equal(ro('get-successor').value.locked.type, 'true');
});

test('live cap per publisher counts only posters still alive (expired ones do not block)', () => {
  const w = W[2];
  call('set-publisher', [Cl.principal(w), Cl.bool(true)], deployer);
  call('set-caps', [Cl.uint(50), Cl.uint(1), Cl.uint(1)], deployer);
  const d = btcDay(simnet);
  gap();
  assert.match(pp(add({ start: d + 1, end: d + 2 }, w).result), /^\(ok /);
  gap();
  assert.equal(pp(add({ start: d + 1, end: d + 5 }, w).result), errU(108));      // one alive already
  simnet.mineEmptyBurnBlocks(144 * 3);                                          // first one has ended
  const d2 = btcDay(simnet);
  gap();
  assert.match(pp(add({ start: d2 + 1, end: d2 + 5 }, w).result), /^\(ok /);
  call('set-caps', [Cl.uint(24), Cl.uint(12), Cl.uint(1)], deployer);
});

test('a pruned poster given a new window goes back into the live set', () => {
  for (const id of liveIds()) call('set-hidden', [Cl.uint(id), Cl.bool(true)], deployer);
  const d = btcDay(simnet);
  const id = Number(add({ start: d + 1, end: d + 2 }).result.value.value);
  simnet.mineEmptyBurnBlocks(144 * 4);
  const d2 = btcDay(simnet);
  add({ start: d2 + 1, end: d2 + 5 });                                      // prunes the expired one
  assert.ok(!liveIds().includes(id));
  assert.equal(pp(call('set-window', [Cl.uint(id), Cl.uint(d + 1), Cl.uint(d2 + 6)], deployer).result), '(ok true)');
  assert.ok(liveIds().includes(id));
});
