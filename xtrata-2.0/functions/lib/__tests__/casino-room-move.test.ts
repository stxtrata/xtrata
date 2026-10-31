import { describe, expect, it } from 'vitest';
import {
  MOVE_BOUND,
  MOVE_MIN_GAP_MS,
  MOVE_PER_MINUTE,
  ROOM_FEATURES,
  applyMove,
  applySit,
  applyStand,
  deriveView,
  leaveFloor,
  newPeer,
  parseClientMessage,
  takeMoveRate,
  takeRate,
  upgradePeer,
  type Peer
} from '../casino-room';
import { isChatError } from '../../../src/casino-room/chat-core';

const ALICE = 'ST1ALICE000000000000000000000000000000';
const BOB = 'ST2BOB00000000000000000000000000000000';
const peer = (id: string, a: string | null, now = 1000): Peer => newPeer(id, a, a ? 'k'.repeat(40) : null, now);
const move = (extra: Record<string, unknown> = {}) => JSON.stringify({ t: 'move', x: 1.234, z: -5.678, r: 0.5, ...extra });

describe('walking: what counts as a move', () => {
  it('parses a position, rounding it, and folds any facing angle into -pi..pi', () => {
    expect(parseClientMessage(move())).toEqual({ ok: true, msg: { t: 'move', x: 1.23, z: -5.68, r: 0.5 } });
    const turned = parseClientMessage(move({ r: 3 * Math.PI }));
    expect(turned.ok && turned.msg.t === 'move' && 'r' in turned.msg && Math.abs(Math.abs(turned.msg.r) - Math.PI) < 0.001).toBe(true);
    expect(parseClientMessage(move({ x: MOVE_BOUND, z: -MOVE_BOUND }))).toMatchObject({ ok: true });
  });

  it('parses leaving the floor', () => {
    expect(parseClientMessage(JSON.stringify({ t: 'move', off: true }))).toEqual({ ok: true, msg: { t: 'move', off: true } });
  });

  it('keeps only the fields it knows', () => {
    expect(parseClientMessage(move({ a: BOB, at: 5, spot: 'drop.1' }))).toEqual({ ok: true, msg: { t: 'move', x: 1.23, z: -5.68, r: 0.5 } });
  });

  it('refuses positions off the floor or malformed', () => {
    const bad = [
      { x: MOVE_BOUND + 0.01 }, { z: -MOVE_BOUND - 1 }, { x: '1' }, { z: null }, { x: Infinity }, { z: NaN },
      { r: 'north' }, { r: undefined }, { x: undefined }, { off: 'yes', x: undefined }
    ];
    for (const extra of bad) expect(parseClientMessage(move(extra))).toEqual({ ok: false, code: 'move-bad' });
  });

  it('uses error codes the chat never shows as a chat error', () => {
    for (const code of ['move-bad', 'move-gone', 'move-sign-in-first', 'move-seated', 'move-too-fast']) expect(isChatError(code)).toBe(false);
  });

  it('tells clients the room takes moves (and still spins)', () => {
    expect(ROOM_FEATURES).toEqual(expect.arrayContaining(['play', 'move']));
  });
});

describe('walking: who may move and who hears it', () => {
  it('passes a position to everyone else, guests included, stamped with the room clock', () => {
    const peers = [peer('a', ALICE), peer('b', BOB), peer('g', null), peer('a2', ALICE)];
    const r = applyMove(peers, 'a', { x: 2, z: 3, r: 1 }, 5000);
    expect(r).toEqual({ ok: true, message: { t: 'move', a: ALICE, x: 2, z: 3, r: 1, at: 5000 }, to: ['b', 'g', 'a2'] });
    expect(peers[0].p).toEqual([2, 3, 1]);
    expect(peers[0].pt).toBe(5000);
  });

  it('refuses guests and unknown connections', () => {
    const peers = [peer('g', null), peer('b', BOB)];
    expect(applyMove(peers, 'g', { x: 0, z: 0, r: 0 }, 5000)).toEqual({ ok: false, code: 'move-sign-in-first' });
    expect(applyMove(peers, 'zz', { x: 0, z: 0, r: 0 }, 5000)).toEqual({ ok: false, code: 'move-gone' });
    expect(peers[0].p).toBeNull();
  });

  it('a seat wins: a move while seated is refused, and sitting takes the player off the floor on every tab', () => {
    const peers = [peer('a', ALICE), peer('a2', ALICE), peer('b', BOB)];
    applyMove(peers, 'a', { x: 1, z: 1, r: 0 }, 5000);
    applyMove(peers, 'a2', { x: 2, z: 2, r: 0 }, 5100);
    expect(applySit(peers, 'a', 'blackjack.1', 6000).ok).toBe(true);
    expect(peers[0].p).toBeNull();
    expect(peers[1].p).toBeNull();
    expect(applyMove(peers, 'a', { x: 3, z: 3, r: 0 }, 6100)).toEqual({ ok: false, code: 'move-seated' });
    expect(applyMove(peers, 'a', { off: true }, 6200)).toMatchObject({ ok: true, message: { t: 'move', a: ALICE, off: true } });
    applyStand(peers, 'a');
    expect(applyMove(peers, 'a', { x: 4, z: 4, r: 0 }, 6300)).toMatchObject({ ok: true, message: { x: 4, z: 4 } });
  });
});

describe('walking: the room view', () => {
  it('lists each walking player once, at their latest position, and never someone who is also seated', () => {
    const peers = [peer('a', ALICE), peer('a2', ALICE), peer('b', BOB), peer('g', null)];
    applyMove(peers, 'a', { x: 1, z: 1, r: 0 }, 5000);
    applyMove(peers, 'a2', { x: 9, z: 9, r: 2 }, 5500);           // the newer tab wins
    applyMove(peers, 'b', { x: -3, z: 4, r: 1 }, 5200);
    const view = deriveView(peers);
    expect(view.walkers).toEqual([
      { a: ALICE, n: 'ST1AL…0000', x: 9, z: 9, r: 2, at: 5500 },
      { a: BOB, n: 'ST2BO…0000', x: -3, z: 4, r: 1, at: 5200 }
    ]);
    // Bob sits on another tab of his: he is shown seated, not walking
    const bob2 = peer('b2', BOB); peers.push(bob2); peers[2].p = [-3, 4, 1];
    bob2.spot = 'bar.1';
    expect(deriveView(peers).walkers.map((w) => w.a)).toEqual([ALICE]);
    applyMove(peers, 'a', { off: true }, 6000); applyMove(peers, 'a2', { off: true }, 6000);
    expect(deriveView(peers).walkers).toEqual([]);
  });

  it('a closing connection takes its player off the floor, unless another tab of theirs is still walking', () => {
    const a = peer('a', ALICE), a2 = peer('a2', ALICE), b = peer('b', BOB);
    applyMove([a, a2, b], 'a', { x: 1, z: 1, r: 0 }, 5000);
    expect(leaveFloor([a2, b], a, 7000)).toEqual({ t: 'move', a: ALICE, off: true, at: 7000 });
    applyMove([a, a2, b], 'a2', { x: 2, z: 2, r: 0 }, 5100);
    expect(leaveFloor([a2, b], a, 7000)).toBeNull();
    expect(leaveFloor([a, a2], b, 7000)).toBeNull();                 // Bob was not on the floor
    expect(leaveFloor([a, b], peer('g', null), 7000)).toBeNull();     // guests are never on the floor
  });
});

describe('walking: limits', () => {
  it('needs a short gap between moves and caps moves a minute', () => {
    const p = peer('a', ALICE);
    expect(takeMoveRate(p, 10_000)).toBe(true);
    expect(takeMoveRate(p, 10_000 + MOVE_MIN_GAP_MS - 1)).toBe(false);
    expect(takeMoveRate(p, 10_000 + MOVE_MIN_GAP_MS)).toBe(true);
    // As fast as the gap allows, for just under a minute: the minute's cap stops it short.
    const q = peer('q', ALICE);
    let ok = 0;
    for (let i = 0; i * MOVE_MIN_GAP_MS < 59_000; i += 1) if (takeMoveRate(q, 100_000 + i * MOVE_MIN_GAP_MS)) ok += 1;
    expect(ok).toBe(MOVE_PER_MINUTE);
  });

  it('walking at the page pace (one every 0.4 s) is always allowed, and never uses up the general limit', () => {
    const p = peer('a', ALICE);
    for (let i = 0; i < 600; i += 1) expect(takeMoveRate(p, 10_000 + i * 400)).toBe(true);
    expect(p.rl).toEqual([]);
    expect(takeRate(p, 400_000)).toBe(true);
  });

  it('upgrades a connection saved before walking existed', () => {
    const old = { id: 'o', a: ALICE, k: null, spot: null, since: 1, rl: [], cl: [], b: [], pl: [] } as unknown as Peer;
    upgradePeer(old);
    expect(old.p).toBeNull(); expect(old.ml).toEqual([]); expect(old.pt).toBe(0);
    expect(deriveView([old]).walkers).toEqual([]);
  });
});
