import { describe, expect, it } from 'vitest';
import { applySit, newPeer, type Peer } from '../casino-room';
import { CHESS_TABLES, MAX_RELAY_BYTES, SOCIAL_FEATURES, applySeek, isChessTable, isSalonSpot, isTable, parseSocialMessage, routeRelay, routeSpec, seekers } from '../casino-social';

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

// Watching a game (plan section 7): snapshots from a seated player go to everyone else at or watching the table.
describe('watching a chess game', () => {
  const CAROL = 'ST3CAROL00000000000000000000000000000';
  const seated = (p: Peer, spot: string) => { p.spot = spot; return p; };
  const watching = (p: Peer, tb: string | null) => { p.wt = tb; return p; };
  const snap = { k: 1, w: ALICE, b: BOB, f: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', m: 'Mc', c: [598, 600] };

  it('is a feature the page can look for, and is parsed for chess tables only', () => {
    expect(SOCIAL_FEATURES).toContain('spec');
    expect(parseSocialMessage({ t: 'spec', tb: 'chess1', d: snap })).toEqual({ ok: true, msg: { t: 'spec', tb: 'chess1', d: snap } });
    expect(parseSocialMessage({ t: 'spec', tb: 'chess2', ask: true })).toEqual({ ok: true, msg: { t: 'spec', tb: 'chess2', ask: true } });
    expect(parseSocialMessage({ t: 'spec', tb: 'liars', d: snap })).toEqual({ ok: false, code: 'spec-bad' });
    expect(parseSocialMessage({ t: 'spec', tb: 'chess1' })).toEqual({ ok: false, code: 'spec-bad' });
    expect(parseSocialMessage({ t: 'spec', tb: 'chess1', d: 'x'.repeat(MAX_RELAY_BYTES) })).toEqual({ ok: false, code: 'spec-too-big' });
  });

  it('sends a seated player\'s snapshot to everyone at or watching that table, guests included, never to other tables', () => {
    const a = seated(named('a', ALICE, 'alice.btc'), 'chess1.1'), b = seated(nameless('b', BOB), 'chess1.2');
    const c = watching(nameless('c', CAROL), 'chess1'), g = watching(guest('g'), 'chess1'), far = watching(guest('f'), 'chess2'), bar = seated(guest('x'), 'blackjack.1');
    const r = routeSpec([a, b, c, g, far, bar], a, { tb: 'chess1', d: snap }, 1000);
    expect(r.ok && r.out[0].to.sort()).toEqual(['b', 'c', 'g']);
    expect(r.ok && r.out[0].message).toMatchObject({ t: 'spec', tb: 'chess1', a: ALICE, n: 'alice.btc', d: snap });
  });

  it('takes snapshots only from someone seated at that table', () => {
    const a = seated(named('a', ALICE, 'alice.btc'), 'chess1.1'), c = watching(nameless('c', CAROL), 'chess1');
    expect(routeSpec([a, c], c, { tb: 'chess1', d: snap }, 1000)).toEqual({ ok: false, code: 'spec-not-seated' });
    expect(routeSpec([a, c], a, { tb: 'chess2', d: snap }, 1000)).toEqual({ ok: false, code: 'spec-not-here' });
    const g = seated(guest('g'), 'chess1.2');
    expect(routeSpec([a, g], g, { tb: 'chess1', d: snap }, 1000)).toEqual({ ok: false, code: 'spec-sign-in-first' });
  });

  it('passes a watcher\'s ask to the players seated there only; a guest may ask', () => {
    const a = seated(named('a', ALICE, 'alice.btc'), 'chess1.1'), b = seated(nameless('b', BOB), 'chess1.2'), c = watching(nameless('c', CAROL), 'chess1'), g = watching(guest('g'), 'chess1');
    const r = routeSpec([a, b, c, g], g, { tb: 'chess1', ask: true }, 1000);
    expect(r.ok && r.out[0].to.sort()).toEqual(['a', 'b']);
    expect(r.ok && r.out[0].message).toEqual({ t: 'spec', tb: 'chess1', ask: true, at: 1000 });
    expect(routeSpec([a, b, c, g], c, { tb: 'chess2', ask: true }, 1000)).toEqual({ ok: false, code: 'spec-not-here' });
    const hidden = guest('h'); hidden.w = false; hidden.wt = 'chess1';
    expect(routeSpec([a, hidden], hidden, { tb: 'chess1', ask: true }, 1000)).toEqual({ ok: false, code: 'spec-not-here' });
  });

  it('has its own limits: asks at most every 2 s, snapshots 40 in 10 s', () => {
    const a = seated(named('a', ALICE, 'alice.btc'), 'chess1.1'), c = watching(nameless('c', CAROL), 'chess1');
    expect(routeSpec([a, c], c, { tb: 'chess1', ask: true }, 1000).ok).toBe(true);
    expect(routeSpec([a, c], c, { tb: 'chess1', ask: true }, 1500)).toEqual({ ok: false, code: 'spec-too-fast' });
    expect(routeSpec([a, c], c, { tb: 'chess1', ask: true }, 3100).ok).toBe(true);
    for (let i = 0; i < 40; i++) expect(routeSpec([a, c], a, { tb: 'chess1', d: snap }, 5000 + i).ok).toBe(true);
    expect(routeSpec([a, c], a, { tb: 'chess1', d: snap }, 6000)).toEqual({ ok: false, code: 'spec-too-fast' });
    expect(routeSpec([a, c], a, { tb: 'chess1', d: snap }, 15_100).ok).toBe(true);
  });

  it('respects blocking: a watcher who blocked a player, or was blocked, is not sent their game', () => {
    const a = seated(named('a', ALICE, 'alice.btc'), 'chess1.1'), c = watching(nameless('c', CAROL), 'chess1'), d = watching(nameless('d', 'ST4DAVE000000000000000000000000000000'), 'chess1');
    c.b = [ALICE];
    const r = routeSpec([a, c, d], a, { tb: 'chess1', d: snap }, 1000);
    expect(r.ok && r.out[0].to).toEqual(['d']);
  });
});

