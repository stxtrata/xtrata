import { describe, expect, it } from 'vitest';
import { ROOM_FEATURES, STALE_MS, applyAway, applySit, deriveView, newPeer, parseClientMessage, roomMessage, staleIds, type Peer } from '../casino-room';

// Who is here (docs/plans/CASINO-WHO-IS-HERE-PLAN.md): heartbeats, closing connections that have gone quiet, and "away".
const ALICE = 'ST1ALICE000000000000000000000000000000';
const BOB = 'ST2BOB00000000000000000000000000000000';
const peer = (id: string, a: string | null, now = 1000): Peer => newPeer(id, a, a ? 'k'.repeat(40) : null, now);

describe('who is here: the messages', () => {
  it('lists the feature, and parses here and away', () => {
    expect(ROOM_FEATURES).toContain('here');
    expect(parseClientMessage(JSON.stringify({ t: 'here' }))).toEqual({ ok: true, msg: { t: 'here' } });
    expect(parseClientMessage(JSON.stringify({ t: 'away', on: true }))).toEqual({ ok: true, msg: { t: 'away', on: true } });
    expect(parseClientMessage(JSON.stringify({ t: 'away', on: false }))).toEqual({ ok: true, msg: { t: 'away', on: false } });
    expect(parseClientMessage(JSON.stringify({ t: 'away', on: 'yes' }))).toEqual({ ok: true, msg: { t: 'away', on: false } });
  });
});

describe('who is here: connections that have gone quiet', () => {
  const T = 1_000_000;
  it('closes only connections that promised heartbeats and have been silent too long', () => {
    const list = [
      { id: 'live', since: T, hb: true, hd: T + 100_000 },                       // spoke recently
      { id: 'pinging', since: T, hb: true, hd: T, auto: T + 150_000 },           // only heartbeats, answered by the room itself
      { id: 'gone', since: T, hb: true, hd: T + 10_000, auto: T + 20_000 },      // nothing for a long time
      { id: 'old-page', since: T, hd: T },                                       // never said `here`: never closed this way
      { id: 'new', since: T + 150_000, hb: true }                                // just arrived
    ];
    expect(staleIds(list, T + 160_000)).toEqual(['gone']);
    expect(staleIds(list, T + 20_000 + STALE_MS)).toEqual([]);                  // exactly at the limit: not yet
    expect(staleIds(list, T + 20_001 + STALE_MS)).toEqual(['gone']);
    expect(staleIds(list, T + 160_000, 5_000)).toEqual(['live', 'pinging', 'gone', 'new']);   // a test's short limit: 10 s quiet is too long
  });
});

describe('who is here: away', () => {
  it('stands the player up and tells everyone who can see the room', () => {
    const peers = [peer('a', ALICE), peer('b', BOB), peer('g', null)];
    expect(applySit(peers, 'a', 'blackjack.1', 2000).ok).toBe(true);
    const r = applyAway(peers, 'a', true);
    expect(r).toMatchObject({ ok: true, changes: [{ kind: 'stood', spot: 'blackjack.1', peerId: 'a' }], message: { t: 'away', a: ALICE, on: true } });
    expect(r.ok && r.to).toEqual(['a', 'b', 'g']);
    expect(peers[0].spot).toBeNull();
    expect(deriveView(peers).players.find((p) => p.a === ALICE)).toEqual({ a: ALICE, n: 'ST1AL…0000', spot: null, aw: true });
    const back = applyAway(peers, 'a', false);
    expect(back).toMatchObject({ ok: true, changes: [], message: { on: false } });
    expect(deriveView(peers).players.find((p) => p.a === ALICE)?.aw).toBeUndefined();
  });

  it('counts a player as away only while every tab of theirs is', () => {
    const peers = [peer('a1', ALICE), peer('a2', ALICE), peer('b', BOB)];
    expect(applyAway(peers, 'a1', true)).toMatchObject({ message: { a: ALICE, on: false } });
    expect(deriveView(peers).players.find((p) => p.a === ALICE)?.aw).toBeUndefined();
    expect(applyAway(peers, 'a2', true)).toMatchObject({ message: { a: ALICE, on: true } });
    expect(deriveView(peers).players.find((p) => p.a === ALICE)?.aw).toBe(true);
    // the room message lists them as away too
    expect((roomMessage(peers, peers[2], 5000, ROOM_FEATURES).players as Array<{ a: string; aw?: boolean }>).find((p) => p.a === ALICE)?.aw).toBe(true);
  });

  it('refuses a guest and an unknown connection', () => {
    const peers = [peer('g', null)];
    expect(applyAway(peers, 'g', true)).toEqual({ ok: false, code: 'away-sign-in-first' });
    expect(applyAway(peers, 'zz', true)).toEqual({ ok: false, code: 'gone' });
  });
});
