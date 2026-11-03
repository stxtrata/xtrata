import { describe, expect, it } from 'vitest';
import { applyMove, applySit, canSee, newPeer, roomMessage, routePlay, ROOM_FEATURES, upgradePeer, type Peer } from '../casino-room';
import { guestsMayWatch } from '../casino-room-http';

/** Anonymous watching off by default (docs/plans/CASINO-ROOM-NEW-WALLETS-PLAN.md, step 6). */
const ALICE = 'ST1ALICE000000000000000000000000000000';
const BOB = 'ST2BOB00000000000000000000000000000000';
const signed = (id: string, a: string): Peer => newPeer(id, a, 'k'.repeat(40), 1000, false);

describe('casino room guests', () => {
  it('the switch is off unless CASINO_ROOM_GUESTS is "1"', () => {
    expect(guestsMayWatch(undefined)).toBe(false);
    expect(guestsMayWatch({})).toBe(false);
    expect(guestsMayWatch({ CASINO_ROOM_GUESTS: '0' })).toBe(false);
    expect(guestsMayWatch({ CASINO_ROOM_GUESTS: 'true' })).toBe(false);
    expect(guestsMayWatch({ CASINO_ROOM_GUESTS: '1' })).toBe(true);
  });

  it('signed-in players always see; guests only while watching is allowed; older saved guests still may', () => {
    expect(canSee(signed('a', ALICE))).toBe(true);
    expect(canSee(newPeer('g', null, null, 1000, false))).toBe(false);
    expect(canSee(newPeer('g', null, null, 1000, true))).toBe(true);
    const old = newPeer('g', null, null, 1000) as Peer; delete old.w;
    expect(canSee(upgradePeer(old))).toBe(true);
  });

  it('a guest who may not watch gets the head count only', () => {
    const alice = signed('a', ALICE), guest = newPeer('g', null, null, 1000, false);
    const peers = [alice, guest];
    expect(applySit(peers, 'a', 'drop.1', 1500).ok).toBe(true);
    const m = roomMessage(peers, guest, 2000, ROOM_FEATURES);
    expect(m).toMatchObject({ t: 'room', watch: false, spots: {}, players: [], walkers: [], joined: 1, guests: 1, you: { a: null, guest: true } });
    const seen = roomMessage(peers, alice, 2000, ROOM_FEATURES);
    expect(seen).toMatchObject({ watch: true, joined: 1, guests: 1 });
    expect(Object.keys(seen.spots)).toEqual(['drop.1']);
    const watcher = newPeer('w', null, null, 1000, true);
    expect(Object.keys(roomMessage([...peers, watcher], watcher, 2000, ROOM_FEATURES).spots)).toEqual(['drop.1']);
  });

  it('spins and walking are not passed to guests who may not watch', () => {
    const alice = signed('a', ALICE), bob = signed('b', BOB);
    const blind = newPeer('g', null, null, 1000, false), watcher = newPeer('w', null, null, 1000, true);
    const peers = [alice, bob, blind, watcher];
    applySit(peers, 'a', 'drop.1', 1500);
    const spin = routePlay(peers, 'a', { spot: 'drop.1', s: [1, 2, 3, 4, 5], b: 40, f: false }, 3000);
    expect(spin.ok && spin.to.sort()).toEqual(['b', 'w']);
    const walk = applyMove(peers, 'b', { t: 'move', x: 1, z: 2, r: 0 }, 4000);
    expect(walk.ok && walk.to.sort()).toEqual(['a', 'w']);
  });
});
