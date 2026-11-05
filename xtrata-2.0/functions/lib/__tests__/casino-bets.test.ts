import { describe, expect, it } from 'vitest';
import { newPeer, type Peer } from '../casino-room';
import { routeSpec, snapshotRefusal } from '../casino-social';
import {
  BET_BETTORS, BET_MAX, BET_MIN, BET_WINDOW_MS, CHESS_FEATURES, GAME_MAX_MS, GRACE_MS, WAIT_MS,
  addBet, betError, due, judge, markBack, markGone, newGame, parseChessMessage, payingSide, pools, readSnapshot, setReport, settlement,
  type Color, type Game
} from '../casino-bets';

const ALICE = 'ST1ALICE000000000000000000000000000000';
const BOB = 'ST2BOB00000000000000000000000000000000';
const CAROL = 'ST3CAROL0000000000000000000000000000000';
const GID = '0123456789abcdef';
const H1 = 'aaaaaaaaaaaaaaaa', H2 = 'bbbbbbbbbbbbbbbb';
const game = (sk = 1000, now = 1000): Game => newGame({ gid: GID, tb: 'chess1', w: ALICE, b: BOB, sk }, { w: 'kA', b: 'kB' }, now);
const heldGame = (sk = 1000) => { const g = game(sk); g.held = sk > 0; return g; };
const rep = (r: any, tm: any = 'checkmate', h = H1) => ({ r, tm, n: 40, h });

describe('the chess messages', () => {
  it('list two room features', () => { expect([...CHESS_FEATURES]).toEqual(['cres', 'cbet']); });
  it('parse a result report', () => {
    expect(parseChessMessage({ t: 'cres', tb: 'chess1', gid: GID, r: '1-0', tm: 'checkmate', n: 41, h: H1 })).toEqual({ ok: true, msg: { t: 'cres', tb: 'chess1', gid: GID, r: '1-0', tm: 'checkmate', n: 41, h: H1 } });
    expect(parseChessMessage({ t: 'cres', tb: 'chess2', gid: GID, r: '*' })).toMatchObject({ ok: true, msg: { r: '*', tm: 'none', n: 0 } });
    for (const bad of [
      { tb: 'liars', gid: GID, r: '1-0', tm: 'checkmate', n: 1, h: H1 }, { tb: 'chess1', gid: 'ABC', r: '1-0', tm: 'checkmate', n: 1, h: H1 },
      { tb: 'chess1', gid: GID, r: '2-0', tm: 'checkmate', n: 1, h: H1 }, { tb: 'chess1', gid: GID, r: '1-0', tm: 'cheated', n: 1, h: H1 },
      { tb: 'chess1', gid: GID, r: '1-0', tm: 'checkmate', n: -1, h: H1 }, { tb: 'chess1', gid: GID, r: '1-0', tm: 'checkmate', n: 1.5, h: H1 },
      { tb: 'chess1', gid: GID, r: '1-0', tm: 'checkmate', n: 1, h: 'xyz' }, { tb: 'chess1', gid: GID, r: '1-0', n: 1, h: H1 }
    ]) expect(parseChessMessage({ t: 'cres', ...bad })).toEqual({ ok: false, code: 'cres-bad' });
  });
  it('parse a bet, an add-on and an ask', () => {
    expect(parseChessMessage({ t: 'cbet', tb: 'chess1', gid: GID, side: 'w', amt: 500 })).toEqual({ ok: true, msg: { t: 'cbet', tb: 'chess1', gid: GID, side: 'w', amt: 500 } });
    expect(parseChessMessage({ t: 'cbet', tb: 'chess1', gid: GID, ask: true })).toEqual({ ok: true, msg: { t: 'cbet', tb: 'chess1', gid: GID, ask: true } });
    for (const bad of [{ side: 'x', amt: 5 }, { side: 'w', amt: 0 }, { side: 'w', amt: -5 }, { side: 'w', amt: 1.5 }, { side: 'w', amt: 2_000_000 }, { amt: 5 }])
      expect(parseChessMessage({ t: 'cbet', tb: 'chess1', gid: GID, ...bad })).toEqual({ ok: false, code: 'cbet-bad' });
    expect(parseChessMessage({ t: 'react' })).toBeNull();
  });
});

describe('a snapshot that starts a game', () => {
  const snap = { k: 1, gid: GID, w: ALICE, b: BOB, sk: 500, st: 500 };
  it('needs a game id, two different players and a sensible stake', () => {
    expect(readSnapshot(snap)).toEqual({ gid: GID, w: ALICE, b: BOB, sk: 500, over: false });
    expect(readSnapshot({ ...snap, sk: undefined })).toMatchObject({ sk: 0 });
    for (const bad of [{ gid: undefined }, { gid: 'nope' }, { b: ALICE }, { b: 'house:gambit' }, { sk: -1 }, { sk: 1.5 }, { sk: 5_000_000 }]) expect(readSnapshot({ ...snap, ...bad })).toBeNull();
    expect(readSnapshot(null)).toBeNull();
  });
  it('never starts from a snapshot that already has a result', () => {
    expect(readSnapshot({ ...snap, r: '1-0' })?.over).toBe(true);
    expect(readSnapshot({ ...snap, r: '*' })?.over).toBe(false);
  });
});

describe('routeSpec: who a snapshot may name', () => {
  const peer = (id: string, a: string, spot: string | null): Peer => { const p = newPeer(id, a, 'k' + id, 1000, true, { name: null, checked: true }); p.spot = spot; return p; };
  const a = peer('a', ALICE, 'chess1.1'), b = peer('b', BOB, 'chess1.2'), c = peer('c', CAROL, 'chess1.2');   // a sits at chess1.1, so she may send
  const snap = { k: 1, gid: GID, w: ALICE, b: BOB, sk: 0 };
  it('takes a game between the two seated players', () => { expect(routeSpec([a, b], a, { tb: 'chess1', d: snap }, 1000).ok).toBe(true); });
  it('refuses a snapshot whose players are not the two seated there', () => {
    expect(routeSpec([a, b], a, { tb: 'chess1', d: { ...snap, b: CAROL } }, 1000)).toEqual({ ok: false, code: 'spec-bad-players' });
    expect(routeSpec([a, c], a, { tb: 'chess1', d: snap }, 1000)).toEqual({ ok: false, code: 'spec-bad-players' });    // Bob is not here
    expect(routeSpec([a, b], b, { tb: 'chess1', d: { ...snap, w: CAROL } }, 1000)).toEqual({ ok: false, code: 'spec-bad-players' });
    expect(routeSpec([a, b], a, { tb: 'chess1', d: { ...snap, gid: 'xyz' } }, 1000)).toEqual({ ok: false, code: 'spec-bad-gid' });
    expect(routeSpec([a, b], a, { tb: 'chess1', d: { ...snap, b: ALICE } }, 1000)).toEqual({ ok: false, code: 'spec-bad-players' });
  });
  it('refuses a refusal without using up the sender\'s limit', () => {
    for (let i = 0; i < 60; i++) expect(routeSpec([a, b], a, { tb: 'chess1', d: { ...snap, b: CAROL } }, 1000 + i).ok).toBe(false);
    expect(routeSpec([a, b], a, { tb: 'chess1', d: snap }, 2000).ok).toBe(true);
  });
  it('lets a game against a house player through: one side the house, d.h the same id, the other the sender', () => {
    const house = { k: 1, w: ALICE, b: 'house:gambit', h: 'gambit', st: 0 };
    expect(routeSpec([a], a, { tb: 'chess1', d: house }, 20_000).ok).toBe(true);
    expect(routeSpec([a], a, { tb: 'chess1', d: { ...house, w: 'house:gambit', b: ALICE } }, 40_000).ok).toBe(true);
    expect(snapshotRefusal([a], a, 'chess1', { ...house, h: 'other' })).toBe('spec-bad-players');
    expect(snapshotRefusal([a], a, 'chess1', { ...house, w: CAROL })).toBe('spec-bad-players');
    expect(snapshotRefusal([a], a, 'chess1', { ...house, w: 'house:a', b: 'house:b' })).toBe('spec-bad-players');
    expect(snapshotRefusal([a], a, 'chess1', { ...house, gid: GID })).toBe('spec-bad-players');           // a house game never carries a game id
    expect(snapshotRefusal([a], a, 'chess1', { ...house, b: 'house:Bad Id' })).toBe('spec-bad-players');
  });
  it('and a house snapshot never starts a game record', () => { expect(readSnapshot({ k: 1, w: ALICE, b: 'house:gambit', h: 'gambit', st: 0 })).toBeNull(); });
  it('still passes older shapes that name no gid', () => {
    expect(snapshotRefusal([a, b], a, 'chess1', { k: 1, w: ALICE, b: BOB })).toBeNull();
    expect(snapshotRefusal([a, b], a, 'chess1', { k: 1, f: 'x' })).toBeNull();
    expect(snapshotRefusal([a, b], a, 'chess1', { k: 1, w: BOB, b: CAROL })).toBe('spec-bad-players');   // the sender is neither
  });
});

describe('bets', () => {
  const open = (now = 2000) => now;
  it('are refused for the reasons the page can show', () => {
    const g = game(); const e = (who: string, a: string, side: Color, amt: number, bal: number | null, now = 2000) => betError(g, who, a, side, amt, bal, now);
    expect(e('kC', CAROL, 'w', 500, 9999)).toBeNull();
    expect(e('kC', CAROL, 'w', 500, 9999, g.closes)).toBe('closed');
    expect(e('kC', CAROL, 'w', 500, 9999, g.closes - 1)).toBeNull();
    expect(e('kA', ALICE, 'w', 500, 9999)).toBe('self');
    expect(e('kX', BOB, 'b', 500, 9999)).toBe('self');                    // by address as well as by key
    expect(e('kB', 'ST9OTHER0000000', 'b', 500, 9999)).toBe('self');      // and by key alone
    expect(e('kC', CAROL, 'w', BET_MIN - 1, 9999)).toBe('min');
    expect(e('kC', CAROL, 'w', BET_MAX + 1, 99999)).toBe('max');
    expect(e('kC', CAROL, 'w', 500, 499)).toBe('funds');
    expect(e('kC', CAROL, 'w', 500, null)).toBe('funds');
    g.end = { r: '1-0', tm: 'checkmate', how: 'agreed', at: 1 };
    expect(e('kC', CAROL, 'w', 500, 9999)).toBe('closed');
    expect(open()).toBe(2000);
  });
  it('are one side per bettor and may be added to up to the maximum', () => {
    const g = game();
    expect(addBet(g, 'kC', CAROL, 'w', 4000)).toBe(4000);
    expect(addBet(g, 'kC', CAROL, 'w', 5000)).toBe(9000);
    expect(betError(g, 'kC', CAROL, 'b', 500, 9999, 2000)).toBe('side');
    expect(betError(g, 'kC', CAROL, 'w', 1001, 9999, 2000)).toBe('max');
    expect(betError(g, 'kC', CAROL, 'w', 1000, 9999, 2000)).toBeNull();
  });
  it('stop at 30 bettors, but a bettor already in may still add', () => {
    const g = game();
    for (let i = 0; i < BET_BETTORS; i++) addBet(g, 'k' + i, 'ST' + i + 'AAAAAAAAAA', i % 2 ? 'w' : 'b', 100);
    expect(betError(g, 'kNew', 'ST9NEW00000', 'w', 100, 999, 2000)).toBe('full');
    expect(betError(g, 'k1', 'ST1AAAAAAAAAA', 'w', 100, 999, 2000)).toBeNull();
  });
  it('close 90 seconds after the game began', () => { expect(game(0, 5000).closes).toBe(5000 + BET_WINDOW_MS); });
});

describe('who gets what', () => {
  const conserved = (g: Game, end: any) => { const s = settlement(g, end); expect(s.paid + s.kept).toBe(s.held); expect(s.credits.reduce((n, c) => n + c.amt, 0)).toBe(s.paid); return s; };
  it('gives the winner both stakes and refunds a draw', () => {
    const g = heldGame();
    const win = conserved(g, { r: '1-0', how: 'agreed' });
    expect(win.credits).toEqual([{ who: 'kA', a: ALICE, amt: 2000, why: 'chess-win' }]);
    const draw = conserved(g, { r: '1/2-1/2', how: 'agreed' });
    expect(draw.credits.map((c) => [c.who, c.amt, c.why])).toEqual([['kA', 1000, 'chess-refund'], ['kB', 1000, 'chess-refund']]);
    for (const how of ['disputed', 'expired', 'void'] as const) expect(conserved(g, { r: '1-0', how }).credits.every((c) => c.why === 'chess-refund')).toBe(true);
    expect(conserved(g, { r: '0-1', how: 'forfeit' }).credits[0]).toMatchObject({ who: 'kB', amt: 2000 });
  });
  it('holds nothing for a friendly', () => { expect(settlement(game(0), { r: '1-0', how: 'agreed' })).toMatchObject({ credits: [], held: 0 }); });
  it('shares the pool among the backers of the winner in proportion, rounded down, with the dust kept', () => {
    const g = game(0);
    addBet(g, 'k1', 'S1', 'w', 100); addBet(g, 'k2', 'S2', 'w', 200); addBet(g, 'k3', 'S3', 'b', 300); addBet(g, 'k4', 'S4', 'b', 401);
    const s = conserved(g, { r: '1-0', how: 'agreed' });
    // pool 1001, white 300: k1 floor(1001*100/300)=333, k2 floor(1001*200/300)=667
    expect(s.credits).toEqual([{ who: 'k1', a: 'S1', amt: 333, why: 'cbet-win' }, { who: 'k2', a: 'S2', amt: 667, why: 'cbet-win' }]);
    expect(s.kept).toBe(1);
    expect(s.cpays.map((p) => [p.who, p.stake, p.won, p.how])).toEqual([['k1', 100, 333, 'result'], ['k2', 200, 667, 'result'], ['k3', 300, 0, 'result'], ['k4', 401, 0, 'result']]);
  });
  it('gives everyone their stake back when everyone backed the winner, and when nobody did', () => {
    const g = game(0);
    addBet(g, 'k1', 'S1', 'w', 100); addBet(g, 'k2', 'S2', 'w', 700);
    expect(conserved(g, { r: '1-0', how: 'agreed' }).credits.map((c) => c.amt)).toEqual([100, 700]);
    const nobody = conserved(g, { r: '0-1', how: 'agreed' });
    expect(nobody.credits.map((c) => [c.amt, c.why])).toEqual([[100, 'cbet-refund'], [700, 'cbet-refund']]);
    expect(payingSide(g, { r: '0-1', how: 'agreed' })).toBeNull();
    expect(payingSide(g, { r: '1-0', how: 'agreed' })).toBe('w');
  });
  it('refunds every bet on a draw, a dispute, a called-off game', () => {
    const g = game(0); addBet(g, 'k1', 'S1', 'w', 100); addBet(g, 'k2', 'S2', 'b', 300);
    for (const end of [{ r: '1/2-1/2', how: 'agreed' }, { r: '*', how: 'disputed' }, { r: '*', how: 'expired' }, { r: '1-0', how: 'void' }] as const) {
      const s = conserved(g, end);
      expect(s.credits.map((c) => c.amt)).toEqual([100, 300]);
      expect(s.cpays.every((p) => p.how === 'refund' && p.won === p.stake)).toBe(true);
    }
  });
  it('always pays out exactly what was held, whatever the bets (property)', () => {
    let seed = 12345; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let n = 0; n < 400; n++) {
      const g = game(rnd() < 0.5 ? 0 : Math.floor(rnd() * 5000) + 1); g.held = g.sk > 0;
      const bettors = Math.floor(rnd() * 31);
      for (let i = 0; i < bettors; i++) addBet(g, 'k' + i, 'S' + i, rnd() < 0.5 ? 'w' : 'b', BET_MIN + Math.floor(rnd() * (BET_MAX - BET_MIN)));
      const ends = [{ r: '1-0', how: 'agreed' }, { r: '0-1', how: 'unchallenged' }, { r: '1/2-1/2', how: 'agreed' }, { r: '*', how: 'disputed' }, { r: '0-1', how: 'forfeit' }, { r: '*', how: 'expired' }, { r: '*', how: 'void' }] as const;
      const s = conserved(g, ends[Math.floor(rnd() * ends.length)]);
      expect(s.kept).toBeLessThan(Math.max(2, Object.keys(g.bets).length) + 1);        // only rounding dust ever stays
    }
  });
});

describe('result reports', () => {
  it('settle at once when both match, and void when they differ or either says dispute', () => {
    const g = game(); setReport(g, 'w', rep('1-0'), 1); setReport(g, 'b', rep('1-0'), 2);
    expect(judge(g)).toEqual({ act: 'end', end: { r: '1-0', tm: 'checkmate', how: 'agreed' } });
    setReport(g, 'b', rep('1-0', 'checkmate', H2), 3);
    expect(judge(g)).toEqual({ act: 'end', end: { r: '*', tm: 'dispute', how: 'disputed' } });
    setReport(g, 'b', rep('0-1'), 4);
    expect(judge(g)).toMatchObject({ end: { how: 'disputed' } });
    const h = game(); setReport(h, 'w', rep('1-0'), 1); setReport(h, 'b', rep('*', 'dispute'), 2);
    expect(judge(h)).toMatchObject({ end: { how: 'disputed' } });
    const star = game(); setReport(star, 'w', rep('1-0'), 1); setReport(star, 'b', rep('*', 'none'), 2);
    expect(judge(star)).toMatchObject({ end: { how: 'disputed' } });      // "my copy has no result" does not agree
  });
  it('stands at once for a resignation reported by the one who resigned, and not otherwise', () => {
    const g = game(); setReport(g, 'w', rep('0-1', 'resignation'), 1);
    expect(judge(g)).toEqual({ act: 'end', end: { r: '0-1', tm: 'resignation', how: 'unchallenged' } });
    const lie = game(); setReport(lie, 'w', rep('1-0', 'resignation'), 1);           // "Black resigned", said by White
    expect(judge(lie)).toEqual({ act: 'ask', of: 'b' });
  });
  it('asks the other page once for a lone report, then waits', () => {
    const g = game(); setReport(g, 'w', rep('1-0'), 1);
    expect(judge(g)).toEqual({ act: 'ask', of: 'b' });
    g.asked = true; g.waitUntil = 1 + WAIT_MS;
    expect(judge(g)).toEqual({ act: 'none' });
    expect(due(g, WAIT_MS)).toEqual({ act: 'none' });
    expect(due(g, 1 + WAIT_MS)).toEqual({ act: 'end', end: { r: '1-0', tm: 'checkmate', how: 'unchallenged' } });          // the winner's report stands
  });
  it('does not let a loser\'s lone report stand, but does let a draw', () => {
    const g = game(); setReport(g, 'w', rep('0-1'), 1); g.asked = true; g.waitUntil = 1 + WAIT_MS;
    expect(due(g, 1 + WAIT_MS)).toEqual({ act: 'end', end: { r: '*', tm: 'expired', how: 'expired' } });
    const d = game(); setReport(d, 'b', rep('1/2-1/2', 'agreement'), 1); d.asked = true; d.waitUntil = 1 + WAIT_MS;
    expect(due(d, 1 + WAIT_MS)).toMatchObject({ end: { r: '1/2-1/2', how: 'unchallenged' } });
    const s = game(); setReport(s, 'b', rep('*', 'none'), 1); s.asked = true; s.waitUntil = 1 + WAIT_MS;
    expect(due(s, 1 + WAIT_MS)).toMatchObject({ end: { how: 'expired' } });
  });
  it('lets the other page answer inside the wait', () => {
    const g = game(); setReport(g, 'w', rep('1-0'), 1); g.asked = true; g.waitUntil = 1 + WAIT_MS;
    setReport(g, 'b', rep('1-0'), 20_000);
    expect(judge(g)).toMatchObject({ end: { how: 'agreed' } });
  });
  it('ignores a repeated report', () => {
    const g = game(); expect(setReport(g, 'w', rep('1-0'), 1)).toBe(true); expect(setReport(g, 'w', rep('1-0'), 9)).toBe(false); expect(g.rep.w!.at).toBe(1);
  });
});

describe('leaving', () => {
  it('forfeits the one who stayed away past the grace, naming them', () => {
    const g = game(); expect(markGone(g, 'b', 10_000)).toBe(10_000 + GRACE_MS);
    expect(markGone(g, 'b', 20_000)).toBeNull();                                    // already counting
    expect(due(g, 10_000 + GRACE_MS - 1)).toEqual({ act: 'none' });
    expect(due(g, 10_000 + GRACE_MS)).toEqual({ act: 'end', end: { r: '1-0', tm: 'resignation', how: 'forfeit', a: BOB } });
    const w = game(); markGone(w, 'w', 0);
    expect(due(w, GRACE_MS)).toEqual({ act: 'end', end: { r: '0-1', tm: 'resignation', how: 'forfeit', a: ALICE } });
  });
  it('counts nothing against a player who came back in time', () => {
    const g = game(); markGone(g, 'b', 0); expect(markBack(g, 'b')).toBe(true); expect(markBack(g, 'b')).toBe(false);
    expect(due(g, 10 * GRACE_MS)).toEqual({ act: 'none' });
  });
  it('calls the game off when both have gone, rather than giving it to whoever left last', () => {
    const g = game(); markGone(g, 'b', 0); markGone(g, 'w', 30_000);
    expect(due(g, GRACE_MS)).toEqual({ act: 'end', end: { r: '*', tm: 'abandoned', how: 'void' } });
  });
  it('does not forfeit a player who has already filed a report; the report decides', () => {
    const g = game(); setReport(g, 'w', rep('1-0'), 5); markGone(g, 'w', 10); g.asked = true; g.waitUntil = 5 + WAIT_MS;
    expect(due(g, 10 + GRACE_MS)).toMatchObject({ end: { how: 'unchallenged', r: '1-0' } });        // the wait ended first and the winner's report stood
    const h = game(); setReport(h, 'b', rep('1-0'), 5); markGone(h, 'b', 10);
    expect(due(h, 10 + GRACE_MS)).toEqual({ act: 'none' });                         // no ask has been made yet; nothing forfeits them
  });
  it('calls off a game that has run 90 minutes with no result', () => {
    const g = game(0, 1000);
    expect(due(g, 1000 + GAME_MAX_MS - 1)).toEqual({ act: 'none' });
    expect(due(g, 1000 + GAME_MAX_MS)).toEqual({ act: 'end', end: { r: '*', tm: 'expired', how: 'expired' } });
    g.end = { r: '1-0', tm: 'x', how: 'agreed', at: 1 };
    expect(due(g, 1000 + 10 * GAME_MAX_MS)).toEqual({ act: 'none' });
    expect(pools(g)).toEqual({ w: 0, b: 0 });
  });
});
