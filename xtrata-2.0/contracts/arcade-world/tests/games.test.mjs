// xtrata-games-v1: the list of extra games the hall reads. Every test boots its own simnet.
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

const BUILT_IN = ['xa_block_defence', 'xa_block_drop', 'xa_block_runner', 'xa_brick_breaker', 'xa_bubble_pop', 'xa_cave_diver',
  'xa_helix_drop', 'xa_invader_wave', 'xa_lunar_lander', 'xa_maze_muncher', 'xa_merge_2048', 'xa_mine_sprint', 'xa_neon_snake',
  'xa_orbit_merge', 'xa_pong_streak', 'xa_reflex_tap', 'xa_road_hopper', 'xa_rock_drift', 'xa_stack_tower', 'xa_swerve', 'xa_tile_tap'];

async function games() {
  const { simnet, deployer, W } = await boot();
  const call = (fn, args = [], sender = deployer) => simnet.callPublicFn('xtrata-games-v1', fn, args, sender);
  const ro = (fn, args = []) => simnet.callReadOnlyFn('xtrata-games-v1', fn, args, deployer).result;
  const h = () => simnet.burnBlockHeight;
  const insc = (id, seed = id, size = 30000, creator = deployer, sealed = true) => {
    mockInscription(simnet, deployer, id, { hash: hash32(seed), size, creator, sealed });
    return { id, hash: hash32(seed), size };
  };
  const add = (id, i, o = {}, sender = deployer) => call('add-game', [
    S(id), S(o.title ?? id.toUpperCase()), U(i.id), Cl.buffer(o.hash ?? i.hash), U(o.size ?? i.size), U(o.kind ?? 1), U(o.engineMin ?? 1),
  ], sender);
  const game = (n) => ro('get-game', [U(n)]);
  return { simnet, deployer, W, call, ro, h, insc, add, game };
}
const R = (r) => pp(r.result);

test('admin only: adding, hiding, settings; admin moves in two steps', async () => {
  const s = await games();
  const { W, deployer } = s;
  const i = s.insc(1);
  assert.equal(R(s.add('neon_pop', i, {}, W[0])), err(500));
  assert.equal(R(s.call('set-hidden', [U(0), Cl.bool(true)], W[0])), err(500));
  assert.equal(R(s.call('set-paused', [Cl.bool(true)], W[0])), err(500));
  assert.equal(R(s.call('set-delay', [U(10)], W[0])), err(500));
  assert.equal(R(s.add('neon_pop', i)), ok('u0'));
  assert.equal(R(s.call('accept-admin', [], W[2])), err(509));
  assert.equal(R(s.call('propose-admin', [P(W[2])], W[0])), err(500));
  assert.equal(R(s.call('propose-admin', [P(W[2])])), OK);
  assert.equal(R(s.call('accept-admin', [], W[3])), err(500));
  assert.equal(R(s.call('accept-admin', [], W[2])), OK);
  // the old admin has lost everything; the new one has it
  const j = s.insc(2, 2, 30000, W[2]);
  assert.equal(R(s.add('second_game', j)), err(500));
  assert.equal(R(s.add('second_game', j, {}, W[2])), ok('u1'));
  assert.equal(pp(s.ro('get-admin')), `'${W[2]}`);
  void deployer;
});

test('a game gets its number and a permanent replay index of 21 + n; it goes live after the delay', async () => {
  const s = await games();
  const a = s.insc(11, 1), b = s.insc(12, 2);
  const h0 = s.h();
  assert.equal(R(s.add('snake_two', a, { title: 'SNAKE TWO', engineMin: 1 })), ok('u0'));
  assert.equal(R(s.add('rocket_run', b, { engineMin: 2 })), ok('u1'));
  const g0 = s.game(0).value.value;
  assert.equal(pp(g0.index), 'u21');
  assert.equal(pp(s.game(1).value.value.index), 'u22');
  assert.equal(pp(g0.id), '"snake_two"');
  assert.equal(pp(g0['code-id']), 'u11');
  assert.equal(pp(g0['engine-min']), 'u1');
  assert.equal(pp(g0['live-at']), `u${Number(pp(g0['added-at']).slice(1)) + 144}`);
  assert.equal(pp(s.ro('get-count')), 'u2');
  assert.equal(pp(s.ro('get-game-number', [S('rocket_run')])), '(some u1)');
  assert.equal(pp(s.ro('get-game-number', [S('nothing_here')])), 'none');
  assert.equal(pp(s.game(9)), 'none');
  // not live yet, then live exactly when the delay has passed
  assert.equal(pp(s.ro('is-live', [U(0)])), 'false');
  s.simnet.mineEmptyBurnBlocks(143);
  assert.equal(pp(s.ro('is-live', [U(0)])), 'false');
  s.simnet.mineEmptyBurnBlocks(2);
  assert.equal(pp(s.ro('is-live', [U(0)])), 'true');
  assert.equal(pp(s.ro('is-live', [U(1)])), 'true');
  assert.equal(pp(s.ro('is-live', [U(7)])), 'false');
  assert.ok(s.h() > h0 + 144);
  // batch read keeps order and returns none for a missing number
  const batch = pp(s.ro('get-games', [Cl.list([U(1), U(0), U(5)])]));
  assert.match(batch, /^\(\(some .*rocket_run.*\) \(some .*snake_two.*\) none\)$|rocket_run[\s\S]*snake_two[\s\S]*none/);
});

test('the 21 built-in games can never be registered, replaced or shadowed', async () => {
  const s = await games();
  const i = s.insc(1);
  for (const id of BUILT_IN) assert.equal(R(s.add(id, i)), err(507), id);
  assert.equal(pp(s.ro('get-count')), 'u0');
  assert.equal(pp(s.ro('get-config').value.genesis), 'u21');
});

test('no new id may begin with a built-in id: it could be mistaken for that game or its extra score boards', async () => {
  const s = await games();
  const i = s.insc(1);
  for (const b of ['xa_tile_tap_rush', 'xa_tile_tap2', 'xa_swerve_x', 'xa_block_drop_hard']) assert.equal(R(s.add(b, i)), err(507), b);
  // names that merely look similar are fine: the test games and anything not starting with a built-in id
  for (const [n, ok_] of [['xa_test_catcher', 'u0'], ['xa_tile', 'u1'], ['my_xa_swerve', 'u2'], ['xa_swerv', 'u3']]) assert.equal(R(s.add(n, i)), ok(ok_), n);
});

test('a hand-over proposed by mistake can be cancelled; the pending admin can be read', async () => {
  const s = await games();
  const { W } = s;
  assert.equal(pp(s.ro('get-pending-admin')), 'none');
  assert.equal(R(s.call('cancel-admin-proposal')), err(509));              // nothing pending
  assert.equal(R(s.call('propose-admin', [P(W[2])])), OK);
  assert.equal(pp(s.ro('get-pending-admin')), `(some '${W[2]})`);
  assert.equal(R(s.call('cancel-admin-proposal', [], W[0])), err(500));    // only the admin
  assert.equal(R(s.call('cancel-admin-proposal')), OK);
  assert.equal(pp(s.ro('get-pending-admin')), 'none');
  assert.equal(R(s.call('accept-admin', [], W[2])), err(509));             // the cancelled wallet can no longer take over
});

test('ids: 3 to 24 characters of a-z 0-9 _ and unique', async () => {
  const s = await games();
  const i = s.insc(1);
  for (const bad of ['ab', 'Upper_case', 'has-dash', 'has space', 'dot.dot', 'quote"x']) {
    // string-ascii allows these; the contract refuses them
    let r;
    try { r = R(s.add(bad, i)); } catch (e) { r = 'threw'; }
    assert.ok(r === err(503) || r === 'threw', `${bad} -> ${r}`);
  }
  assert.equal(R(s.add('abc', i)), ok('u0'));
  assert.equal(R(s.add('abc', i)), err(506));
  assert.equal(R(s.add('a_game_with_24_chars_xx', i)), ok('u1'));
  assert.equal(R(s.add('ok_9', i)), ok('u2'));
});

test('the code inscription must be sealed, the stated size and hash, made by the admin, and at most 1 MiB', async () => {
  const s = await games();
  const { W } = s;
  const good = s.insc(1);
  assert.equal(R(s.add('aaa', { id: 99, hash: hash32(9), size: 5 })), err(504));         // does not exist
  const open = s.insc(2, 2, 30000, s.deployer, false);
  assert.equal(R(s.add('bbb', open)), err(504));                                         // not sealed
  assert.equal(R(s.add('ccc', good, { hash: hash32(77) })), err(504));                   // wrong hash
  assert.equal(R(s.add('ccc', good, { size: 30001 })), err(504));                        // wrong size
  const theirs = s.insc(3, 3, 30000, W[0]);
  assert.equal(R(s.add('ddd', theirs)), err(504));                                       // not the admin's inscription
  const big = s.insc(4, 4, 1048577);
  assert.equal(R(s.add('eee', big)), err(503));                                          // over 1 MiB
  const exact = s.insc(5, 5, 1048576);
  assert.equal(R(s.add('fff', exact)), ok('u0'));
  const zero = s.insc(6, 6, 0);
  assert.equal(R(s.add('ggg', zero)), err(503));
  assert.equal(R(s.add('hhh', good, { hash: new Uint8Array(31) })), err(503));
  assert.equal(R(s.add('hhh', good, { kind: 10 })), err(503));
  assert.equal(R(s.add('hhh', good, { engineMin: 0 })), err(503));
  assert.equal(R(s.add('hhh', good, { engineMin: 256 })), err(503));
  assert.equal(R(s.add('hhh', good, { title: '' })), err(503));
});

test('hide is an emergency switch: reversible, changes nothing else, never touches indices', async () => {
  const s = await games();
  const { W } = s;
  s.add('first_one', s.insc(1));
  s.add('second_one', s.insc(2));
  s.simnet.mineEmptyBurnBlocks(145);
  assert.equal(pp(s.ro('is-live', [U(1)])), 'true');
  assert.equal(R(s.call('set-hidden', [U(9), Cl.bool(true)])), err(502));
  assert.equal(R(s.call('set-hidden', [U(1), Cl.bool(true)])), OK);
  assert.equal(pp(s.ro('is-live', [U(1)])), 'false');
  assert.equal(pp(s.ro('is-live', [U(0)])), 'true');
  assert.equal(pp(s.game(1).value.value.index), 'u22');
  assert.equal(pp(s.game(1).value.value.hidden), 'true');
  assert.equal(R(s.call('set-hidden', [U(1), Cl.bool(false)])), OK);
  assert.equal(pp(s.ro('is-live', [U(1)])), 'true');
  // a hidden game keeps its id: it cannot be added again under the same id
  s.call('set-hidden', [U(1), Cl.bool(true)]);
  assert.equal(R(s.add('second_one', s.insc(3))), err(506));
  void W;
});

test('the delay: default 144, tunable until locked, then fixed for ever', async () => {
  const s = await games();
  assert.equal(pp(s.ro('get-config').value.delay), 'u144');
  assert.equal(R(s.call('set-delay', [U(1009)])), err(503));
  assert.equal(R(s.call('set-delay', [U(6)])), OK);
  s.add('quick_one', s.insc(1));
  const g = s.game(0).value.value;
  assert.equal(Number(pp(g['live-at']).slice(1)) - Number(pp(g['added-at']).slice(1)), 6);
  assert.equal(R(s.call('lock-delay', [U(144)])), err(503));   // the expected value must match the current delay
  assert.equal(R(s.call('lock-delay', [U(6)])), OK);
  assert.equal(R(s.call('set-delay', [U(0)])), err(508));
  assert.equal(pp(s.ro('get-config').value['delay-locked']), 'true');
  assert.equal(R(s.call('lock-delay', [U(6)], s.W[0])), err(500));
});

test('pause blocks adding only; hiding still works', async () => {
  const s = await games();
  s.add('one_game', s.insc(1));
  assert.equal(R(s.call('set-paused', [Cl.bool(true)])), OK);
  assert.equal(R(s.add('two_game', s.insc(2))), err(501));
  assert.equal(R(s.call('set-hidden', [U(0), Cl.bool(true)])), OK);
  assert.equal(R(s.call('set-paused', [Cl.bool(false)])), OK);
  assert.equal(R(s.add('two_game', s.insc(2))), ok('u1'));
});

test('capacity: at most 64 added games, so the highest replay index is 84 and fits one byte', async () => {
  const s = await games();
  for (let n = 0; n < 64; n++) {
    const r = s.add(`game_${n}`, s.insc(100 + n, n + 1));
    assert.equal(R(r), ok(`u${n}`), `add ${n}`);
  }
  assert.equal(pp(s.game(63).value.value.index), 'u84');
  assert.equal(R(s.add('one_more', s.insc(999, 99))), err(505));
  assert.equal(pp(s.ro('get-count')), 'u64');
});

test('successor pointer with a one-way lock', async () => {
  const s = await games();
  const { W } = s;
  assert.equal(R(s.call('set-successor', [Cl.some(P(W[1]))], W[0])), err(500));
  assert.equal(R(s.call('set-successor', [Cl.some(P(W[1]))])), OK);
  assert.equal(pp(s.ro('get-successor').value.successor), `(some '${W[1]})`);
  assert.equal(R(s.call('lock-successor')), OK);
  assert.equal(R(s.call('set-successor', [Cl.none()])), err(508));
});

test('the version counter moves on every change and only then', async () => {
  const s = await games();
  const v = () => Number(pp(s.ro('get-version')).slice(1));
  const v0 = v();
  s.add('first_one', s.insc(1));
  assert.equal(v(), v0 + 1);
  s.call('set-hidden', [U(0), Cl.bool(true)]);
  assert.equal(v(), v0 + 2);
  s.add('first_one', s.insc(2));            // refused: no change
  s.call('set-hidden', [U(5), Cl.bool(true)]); // refused: no change
  assert.equal(v(), v0 + 2);
});
