import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fixture, start, replay, propose, receive, finish, verifyArchive, signed, hash, keypair } from './proof.mjs';
const { Position } = await import(process.env.XCHESS_PROOF_ENGINE);

function game(moves = ['f2f3', 'e7e5', 'g2g4', 'd8h4']) {
  const { opening, keys } = fixture();
  const begun = start(opening, keys.referee.privateKey);
  let events = [];
  for (const [i, uci] of moves.entries()) {
    const state = replay(Position, opening, begun, events);
    const move = propose(state, uci, keys[i % 2 ? 'black' : 'white'].privateKey);
    events = receive(Position, opening, begun, events, move, (i + 1) * 1000, keys.referee.privateKey);
  }
  const state = replay(Position, opening, begun, events);
  return { opening, keys, begun, events, state, archive: { opening, start: begun, events,
    finish: finish(state, 'checkmate', state.at, keys.referee.privateKey) } };
}
const validate = g => verifyArchive(Position, g.opening, g.archive);

test('winner publishes checkmate with no losing-player final signature', () => {
  const g = game();
  delete g.keys.white; // No loser key or final approval is used by verification.
  assert.equal(validate(g).result, '0-1');
});
test('independent reader verifies archive with public information only', () => {
  const g = game();
  assert.equal(verifyArchive(Position, structuredClone(g.opening), JSON.parse(JSON.stringify(g.archive))).winner, 'black');
});
test('rewriting move history and recomputing hashes cannot replace signatures', () => {
  const g = game(); g.archive.events[0].move.value.uci = 'f2f4';
  g.archive.events[0].receipt.value.move = hash(g.archive.events[0].move.value);
  assert.throws(() => validate(g), /signature/);
});
test('missing and reordered moves fail verification', () => {
  for (const alter of [a => a.splice(1, 1), a => a.reverse()]) {
    const g = game(); alter(g.archive.events); assert.throws(() => validate(g));
  }
});
test('changing game, network, clock or authorized keys breaks opening commitment', () => {
  for (const field of ['game', 'network', 'baseMs', 'white']) {
    const g = game(); g.archive = structuredClone(g.archive);
    g.archive.opening[field] = typeof g.opening[field] === 'number' ? 2 : 'replacement';
    assert.throws(() => validate(g), /opening/);
  }
});
test('another player cannot sign the opponent move', () => {
  const g = game([]), move = propose(g.state, 'e2e4', g.keys.black.privateKey);
  assert.throws(() => receive(Position, g.opening, g.begun, [], move, 1000, g.keys.referee.privateKey), /signature/);
});
test('properly signed illegal moves still fail chess validation', () => {
  const g = game([]), move = propose(g.state, 'e2e5', g.keys.white.privateKey);
  assert.throws(() => receive(Position, g.opening, g.begun, [], move, 1000, g.keys.referee.privateKey), /illegal/);
});
test('false checkmate rejected even with referee signature', () => {
  assert.throws(() => validate(game(['e2e4'])), /not checkmate/);
});
test('changing final board or history root fails even when referee signs it', () => {
  for (const field of ['fen', 'root']) {
    const g = game(); g.archive.finish.value[field] = 'forged';
    g.archive.finish = signed(g.archive.finish.value, g.keys.referee.privateKey);
    assert.throws(() => validate(g), /finish mismatch/);
  }
});
test('increment applied once, with a single authoritative timeline', () => {
  const g = game(['e2e4', 'e7e5']);
  assert.deepEqual(g.state.clocks, { white: 61000, black: 61000 });
});
test('duplicate moves cannot advance sequence or add clock increments', () => {
  const g = game(['e2e4']);
  assert.throws(() => replay(Position, g.opening, g.begun, [...g.events, g.events[0]]));
});
test('move at deadline is too late; a move just before is accepted', () => {
  const g = game([]), move = propose(g.state, 'e2e4', g.keys.white.privateKey);
  assert.equal(receive(Position, g.opening, g.begun, [], move, 59999, g.keys.referee.privateKey).length, 1);
  assert.throws(() => receive(Position, g.opening, g.begun, [], move, 60000, g.keys.referee.privateKey), /flag/);
});
test('clock proof does not require absent player approval', () => {
  const g = game([]);
  g.archive.finish = finish(g.state, 'flag-fall', 60000, g.keys.referee.privateKey);
  delete g.keys.white;
  assert.deepEqual(validate(g), { termination: 'flag-fall', flagged: 'white', result: null });
});
test('premature flag is rejected', () => {
  const g = game([]); g.archive.finish = finish(g.state, 'flag-fall', 59999, g.keys.referee.privateKey);
  assert.throws(() => validate(g), /premature/);
});
test('untrusted clock signature is rejected', () => {
  const g = game([]); g.archive.finish = finish(g.state, 'flag-fall', 60000, keypair().privateKey);
  assert.throws(() => validate(g), /signature/);
});
test('clock cannot move backwards', () => {
  const g = game(['e2e4']), move = propose(g.state, 'e7e5', g.keys.black.privateKey);
  assert.throws(() => receive(Position, g.opening, g.begun, g.events, move, 999, g.keys.referee.privateKey), /clock order/);
});
test('signed receipts prevent a player from substituting a legal alternative branch', () => {
  const g = game(['e2e4']);
  const initial = replay(Position, g.opening, g.begun, []);
  g.events[0].move = propose(initial, 'd2d4', g.keys.white.privateKey);
  assert.throws(() => replay(Position, g.opening, g.begun, g.events), /receipt mismatch/);
});
