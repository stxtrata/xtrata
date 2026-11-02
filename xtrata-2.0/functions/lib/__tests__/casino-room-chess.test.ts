import { describe, expect, it } from 'vitest';
import { applySit, newPeer, type Peer } from '../casino-room';
import { CHESS_TABLES, applySeek, isChessTable, isSalonSpot, isTable, parseSocialMessage, routeRelay, seekers } from '../casino-social';

// The lounge chess tables (public/casino/chess.js, docs/plans/CASINO-CHESS-PLAN.md) use the Salon's lobby and relay, but they stand
// in the main room: signing in is enough, no BNS name, and a game may be a friendly (stake 0). The Salon's own rule is unchanged.
const ALICE = 'ST1ALICE000000000000000000000000000000';
const BOB = 'ST2BOB00000000000000000000000000000000';
const named = (id: string, a: string, name: string): Peer => newPeer(id, a, 'k'.repeat(40), 1000, true, { name, checked: true });
const nameless = (id: string, a: string): Peer => newPeer(id, a, 'k'.repeat(40), 1000, true, { name: null, checked: true });
const guest = (id: string): Peer => newPeer(id, null, null, 1000);

describe('the lounge chess tables', () => {
  it('are tables in the main room, not the Salon', () => {
    expect([...CHESS_TABLES]).toEqual(['chess1', 'chess2']);
    for (const t of CHESS_TABLES) { expect(isChessTable(t)).toBe(true); expect(isTable(t)).toBe(true); }
    for (const s of ['chess1.1', 'chess1.2', 'chess2.1', 'chess2.2']) expect(isSalonSpot(s)).toBe(false);
    expect(isChessTable('liars')).toBe(false); expect(isChessTable('chess3')).toBe(false);
  });

  it('seat anyone signed in, with or without a name', () => {
    const peers = [nameless('b', BOB)];
    expect(applySit(peers, 'b', 'chess1.1', 2000).ok).toBe(true);
    expect(applySit(peers, 'b', 'chess2.2', 2100).ok).toBe(true);
  });

  it('accept a friendly or a stake when waiting; the Salon still needs a stake', () => {
    expect(parseSocialMessage({ t: 'seek', tb: 'chess1', stake: 0 })).toEqual({ ok: true, msg: { t: 'seek', tb: 'chess1', stake: 0 } });
    expect(parseSocialMessage({ t: 'seek', tb: 'chess2', stake: 10000 })).toMatchObject({ ok: true });
    expect(parseSocialMessage({ t: 'seek', tb: 'chess1', stake: -1 })).toEqual({ ok: false, code: 'pvp-bad' });
    expect(parseSocialMessage({ t: 'seek', tb: 'chess9', stake: 5 })).toEqual({ ok: false, code: 'pvp-bad' });
    expect(parseSocialMessage({ t: 'seek', tb: 'liars', stake: 0 })).toEqual({ ok: false, code: 'pvp-bad' });
  });

  it('"Find a player" at a chess table needs signing in, not a name, and the waiting list shows it', () => {
    const a = nameless('a', ALICE), b = nameless('b', BOB);
    expect(applySeek([a, b], a, { tb: 'chess1', stake: 0 }, 10).ok).toBe(true);
    expect(seekers([a, b])).toEqual([{ a: ALICE, n: expect.any(String), tb: 'chess1', stake: 0, at: 10 }]);
    expect(applySeek([a, b], b, { tb: 'liars', stake: 25 }, 11)).toEqual({ ok: false, code: 'pvp-bns-required' });   // the Salon's rule stands
    const g = guest('g');
    expect(applySeek([g], g, { tb: 'chess1', stake: 0 }, 12)).toEqual({ ok: false, code: 'pvp-sign-in-first' });
  });

  it('relays chess moves between signed-in players without names; nothing else gets past the Salon rule', () => {
    const a = nameless('a', ALICE), b = nameless('b', BOB);
    const ok = routeRelay([a, b], a, { to: BOB, d: { tb: 'chess1', k: 'op', m: 'act' } }, 0);
    expect(ok.ok && ok.out[0].to).toEqual(['b']);
    expect(routeRelay([a, b], a, { to: BOB, d: { tb: 'liars', k: 'op' } }, 0)).toEqual({ ok: false, code: 'pvp-bns-required' });
    expect(routeRelay([a, b], a, { to: BOB, d: 1 }, 0)).toEqual({ ok: false, code: 'pvp-bns-required' });
    const n = named('n', ALICE, 'alice.btc');
    expect(routeRelay([n, b], n, { to: BOB, d: { tb: 'pvpholdem' } }, 0)).toEqual({ ok: false, code: 'pvp-opponent-no-bns' });
    const g = guest('g');
    expect(routeRelay([g, b], g, { to: BOB, d: { tb: 'chess1' } }, 0)).toEqual({ ok: false, code: 'pvp-sign-in-first' });
  });
});
