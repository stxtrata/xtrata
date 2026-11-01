import { describe, expect, it } from 'vitest';
import { ROOM_FEATURES, applyMove, applySit, newPeer, roomMessage, type Peer } from '../casino-room';
import { applySeek, isInSalon, isSalonSpot, routeRelay, salonRefusal, seekers } from '../casino-social';
import { isChatError } from '../../../src/casino-room/chat-core';

// The Salon is for players with a primary BNS name (docs/plans/CASINO-SALON-BNS-PLAN.md).
const ALICE = 'ST1ALICE000000000000000000000000000000';
const BOB = 'ST2BOB00000000000000000000000000000000';
const named = (id: string, a: string, name: string): Peer => newPeer(id, a, 'k'.repeat(40), 1000, true, { name, checked: true });
const nameless = (id: string, a: string): Peer => newPeer(id, a, 'k'.repeat(40), 1000, true, { name: null, checked: true });
const unchecked = (id: string, a: string): Peer => newPeer(id, a, 'k'.repeat(40), 1000, true, { name: null, checked: false });
const guest = (id: string): Peer => newPeer(id, null, null, 1000);

describe('who may use the Salon', () => {
  it('three answers: a name, no name, and could not check; guests are told to sign in', () => {
    expect(salonRefusal(named('a', ALICE, 'alice.btc'))).toBeNull();
    expect(salonRefusal(nameless('a', ALICE))).toBe('salon-bns-required');
    expect(salonRefusal(unchecked('a', ALICE))).toBe('salon-bns-unchecked');
    expect(salonRefusal(guest('g'))).toBe('salon-sign-in-first');
    // a connection from before this change carries no answer: treated as not checked, never as allowed
    const old = { ...newPeer('o', ALICE, null, 1) } as Peer; delete (old as any).bn; delete (old as any).bc;
    expect(salonRefusal(old)).toBe('salon-bns-unchecked');
  });

  it('a guest never carries a name, whatever arrives with the connection', () => {
    const g = newPeer('g', null, null, 1, true, { name: 'evil.btc', checked: true });
    expect(g.bn).toBeNull(); expect(g.bc).toBe(false);
  });

  it('knows the Salon seats and the Salon floor', () => {
    for (const s of ['pvpholdem.1', 'pvpholdem.3', 'liars.1', 'liars.3']) expect(isSalonSpot(s)).toBe(true);
    for (const s of ['holdem.1', 'blackjack.2', 'bar.1', 'drop.1']) expect(isSalonSpot(s)).toBe(false);
    expect(isInSalon(-6, -11.5)).toBe(true);        // just through the arch
    expect(isInSalon(-6, -19)).toBe(true);          // the far wall
    expect(isInSalon(-6, -10.9)).toBe(false);       // the main floor, in front of the arch
    expect(isInSalon(3, -15)).toBe(false);          // beside the Salon, not in it
  });

  it('uses codes the chat never shows as chat errors', () => {
    for (const c of ['salon-bns-required', 'salon-bns-unchecked', 'salon-sign-in-first', 'pvp-bns-required', 'pvp-bns-unchecked', 'pvp-opponent-no-bns', 'move-salon']) {
      expect(isChatError(c)).toBe(false);
    }
  });
});

describe('the room enforces it', () => {
  it('Salon seats need a name; the main floor does not', () => {
    const peers = [named('a', ALICE, 'alice.btc'), nameless('b', BOB)];
    expect(applySit(peers, 'b', 'liars.1', 2000)).toEqual({ ok: false, code: 'salon-bns-required' });
    expect(applySit(peers, 'b', 'pvpholdem.2', 2000)).toEqual({ ok: false, code: 'salon-bns-required' });
    expect(applySit(peers, 'b', 'holdem.1', 2000).ok).toBe(true);
    expect(applySit(peers, 'a', 'liars.1', 2000).ok).toBe(true);
    const u = [unchecked('u', BOB)];
    expect(applySit(u, 'u', 'liars.2', 2000)).toEqual({ ok: false, code: 'salon-bns-unchecked' });
  });

  it('walking onto the Salon floor needs a name', () => {
    const peers = [named('a', ALICE, 'alice.btc'), nameless('b', BOB)];
    expect(applyMove(peers, 'b', { x: -6, z: -12, r: 0 }, 2000)).toEqual({ ok: false, code: 'move-salon' });
    expect(peers[1].p).toBeNull();
    expect(applyMove(peers, 'b', { x: -6, z: -10, r: 0 }, 2100).ok).toBe(true);          // up to the arch is fine
    expect(applyMove(peers, 'a', { x: -6, z: -15, r: 0 }, 2200).ok).toBe(true);
    expect(applyMove(peers, 'b', { off: true }, 2300).ok).toBe(true);                    // leaving the floor always works
  });

  it('"Find a player" needs a name; stopping always works; the list shows names', () => {
    const a = named('a', ALICE, 'alice.btc'), b = nameless('b', BOB);
    expect(applySeek([a, b], b, { tb: 'liars', stake: 25 }, 10)).toEqual({ ok: false, code: 'pvp-bns-required' });
    expect(b.sk ?? null).toBeNull();
    expect(applySeek([a, b], b, { off: true }, 11).ok).toBe(true);
    const r = applySeek([a, b], a, { tb: 'pvpholdem', stake: 50 }, 12);
    expect(r.ok && (r.out[0].message as any).n).toBe('alice.btc');
    expect(seekers([a, b])).toEqual([{ a: ALICE, n: 'alice.btc', tb: 'pvpholdem', stake: 50, at: 12 }]);
    b.sk = { tb: 'liars', stake: 25, at: 13 };                                            // somehow waiting without a name
    expect(seekers([a, b]).map((s) => s.a)).toEqual([ALICE]);
    expect(applySeek([unchecked('u', BOB)], unchecked('u', BOB), { tb: 'liars', stake: 25 }, 14)).toEqual({ ok: false, code: 'pvp-bns-unchecked' });
  });

  it('a Salon match is only relayed between two named players', () => {
    const a = named('a', ALICE, 'alice.btc'), b = named('b', BOB, 'bob.btc'), bNoName = nameless('b2', BOB), c = nameless('c', 'ST3CAROL00000000000000000000000000000');
    const ok = routeRelay([a, b, bNoName], a, { to: BOB, d: { op: 'bid' } }, 0);
    expect(ok.ok && ok.out[0].to).toEqual(['b']);                                         // never to a connection without a name
    expect(ok.ok && (ok.out[0].message as any).n).toBe('alice.btc');
    expect(routeRelay([a, c], c, { to: ALICE, d: 1 }, 0)).toEqual({ ok: false, code: 'pvp-bns-required' });
    expect(routeRelay([a, c], a, { to: c.a!, d: 1 }, 0)).toEqual({ ok: false, code: 'pvp-opponent-no-bns' });
  });

  it('tells the player their answer and that the room enforces the rule', () => {
    expect(ROOM_FEATURES).toContain('salon-bns');
    const a = named('a', ALICE, 'alice.btc');
    expect((roomMessage([a], a, 1, ROOM_FEATURES) as any).you).toMatchObject({ a: ALICE, bns: 'alice.btc', bnsChecked: true });
    const u = unchecked('u', BOB);
    expect((roomMessage([u], u, 1, ROOM_FEATURES) as any).you).toMatchObject({ bns: null, bnsChecked: false });
  });
});
