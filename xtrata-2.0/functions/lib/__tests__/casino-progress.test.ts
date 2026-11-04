import { describe, expect, it } from 'vitest';
import { DAY_MS } from '../casino-social';
import {
  ALL_MISSIONS_BONUS, BADGES, DEFAULT_SCHEDULE, JACKPOT_SEED, TOURNEY_PRIZES, TOURNEY_SPINS, addXp, advanceMissions, applyBalance,
  applyLog, awardBadges, creditBalance, emptyBoards, feedJackpot, happyHour, jackpotStep, joinTourney, lastFinishedTourney,
  levelOf, loadBoards, loadJackpot, loadProfile, meView, missionsFor, newProfile, newTourney, parseProgressMessage, parseSchedule,
  placeOnBoard, resetJackpot, scoreTourney, settleTourney, topBadge, tourneyAt, tourneyView, weekId, weekStart, xpFor,
  type LogMessage
} from '../casino-progress';

const A = 'ST2SMCB4CV776FCP9A2EK0ZM37NAXM1MFJMMX9DW8';
const B = 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA';
const C = 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP';
const T0 = Date.UTC(2026, 10, 2, 12);      // Monday 2 November 2026, noon UTC
const log = (o: Partial<LogMessage>): LogMessage => ({ t: 'log', k: 'hand', g: 'blackjack', bet: 100, won: 0, free: false, sh: false, ...o });

describe('messages', () => {
  it('accepts plays and rejects odd ones', () => {
    expect(parseProgressMessage({ t: 'log', k: 'spin', g: 'drop', bet: 10, won: 250 })).toEqual({ ok: true, msg: log({ k: 'spin', g: 'drop', bet: 10, won: 250 }) });
    expect(parseProgressMessage({ t: 'log', k: 'spin', g: 'blackjack', bet: 10, won: 0 })).toEqual({ ok: false, code: 'log-bad' });
    expect(parseProgressMessage({ t: 'log', k: 'hand', g: 'casino', bet: 10, won: 0 })).toEqual({ ok: false, code: 'log-bad' });
    expect(parseProgressMessage({ t: 'log', k: 'hand', g: 'roulette', bet: 0, won: 0 })).toEqual({ ok: false, code: 'log-bad' });
    expect(parseProgressMessage({ t: 'log', k: 'hand', g: 'roulette', bet: 5, won: -1 })).toEqual({ ok: false, code: 'log-bad' });
    expect(parseProgressMessage({ t: 'bal', d: 0 })).toEqual({ ok: false, code: 'bal-bad' });
    expect(parseProgressMessage({ t: 'bal', d: -250.5 })).toEqual({ ok: true, msg: { t: 'bal', d: -250.5 } });
    expect(parseProgressMessage({ t: 'bal', init: 1200 })).toEqual({ ok: true, msg: { t: 'bal', init: 1200 } });
    expect(parseProgressMessage({ t: 'friends', list: [A, A, B] })).toEqual({ ok: true, msg: { t: 'friends', list: [A, B] } });
    expect(parseProgressMessage({ t: 'friends', list: ['bob'] })).toEqual({ ok: false, code: 'friends-bad' });
    expect(parseProgressMessage({ t: 'card', a: 'x' })).toEqual({ ok: false, code: 'card-bad' });
    expect(parseProgressMessage({ t: 'say' })).toBeNull();
  });
});

describe('levels and badges', () => {
  it('levels follow 50·L·(L−1)', () => {
    expect([0, 99, 100, 299, 300, 1000, 4500, 19000].map(levelOf)).toEqual([1, 1, 2, 2, 3, 5, 10, 20]);
    for (let l = 1; l < 40; l++) { expect(levelOf(xpFor(l))).toBe(l); expect(levelOf(xpFor(l + 1) - 1)).toBe(l); }
  });
  it('caps play XP per day and doubles it in happy hour', () => {
    const p = newProfile();
    expect(addXp(p, 10, T0, true, true)).toBe(20);
    for (let i = 0; i < 400; i++) addXp(p, 10, T0, false, true);
    expect(p.day.xp).toBe(3000);
    expect(addXp(p, 100, T0, false, false)).toBe(100);         // missions and drinks are not play XP
    expect(addXp(p, 10, T0 + DAY_MS, false, true)).toBe(10);   // a new day
  });
  it('earns badges once, shows the rarest on the tag', () => {
    const p = newProfile();
    applyLog(p, A, log({ won: 2000 }), T0, false);             // 20x
    expect(awardBadges(p)).toEqual(['first-win', 'big-win']);
    expect(awardBadges(p)).toEqual([]);
    expect(topBadge(p)).toBe('big-win');
    expect(BADGES.length).toBeGreaterThan(10);
  });
  it('completes an older stored record', () => {
    const p = loadProfile({ xp: 120, st: { h: 3 } });
    expect(p.st.h).toBe(3); expect(p.st.g).toEqual([]); expect(p.ms.p).toEqual([0, 0, 0]); expect(p.xp).toBe(120);
  });
});

describe('a played hand or spin', () => {
  it('counts plays, wins and the best win; free spins add wins but not spins', () => {
    const p = newProfile();
    applyLog(p, A, log({ k: 'spin', g: 'drop', bet: 10, won: 0 }), T0, false);
    const r = applyLog(p, A, log({ k: 'spin', g: 'drop', bet: 10, won: 600, free: true }), T0, false);
    expect(p.st.s).toBe(1); expect(p.st.w).toBe(1); expect(p.st.bx).toBe(60); expect(p.st.bw).toBe(590); expect(p.st.bg).toBe('drop');
    expect(r.big).toEqual({ x: 60, w: 590 });
    expect(p.st.g).toEqual(['drop']);
    expect(p.xp).toBe(4 + 5 + 25);
  });
});

describe('daily missions', () => {
  it('gives each player three missions a day: play, social, stretch', () => {
    const m = missionsFor(A, 100);
    expect(m).toHaveLength(3);
    expect(['hand', 'spin']).toContain(m[0].kind);
    expect(['gift', 'react', 'tchat', 'shared']).toContain(m[1].kind);
    expect(missionsFor(A, 100)).toEqual(m);
    const days = new Set(Array.from({ length: 20 }, (_, d) => missionsFor(A, d).map((x) => x.id).join()));
    expect(days.size).toBeGreaterThan(5);
  });
  it('advances, pays once, and pays the bonus when all three are done', () => {
    const p = newProfile(), day = Math.floor(T0 / DAY_MS), list = missionsFor(B, day);
    let all = false; const paid: string[] = [];
    for (const m of list) {
      for (let i = 0; i < m.need; i++) {
        const ev = m.kind === 'hand' || m.kind === 'spin' ? { kind: m.kind, g: m.g } : { kind: m.kind };
        const r = advanceMissions(p, B, T0, ev); paid.push(...r.done.map((d) => d.id)); all = all || r.all;
      }
    }
    expect(paid).toEqual(list.map((m) => m.id));
    expect(all).toBe(true);
    expect(advanceMissions(p, B, T0, { kind: list[0].kind, g: list[0].g }).done).toEqual([]);
    expect(ALL_MISSIONS_BONUS).toBeGreaterThan(0);
    expect(meView(p, B, T0).missions.list.every((m) => m.done)).toBe(true);
    expect(meView(p, B, T0 + DAY_MS).missions.list.some((m) => m.done)).toBe(false);
  });
});

describe('weekly boards', () => {
  it('weeks start on Monday 00:00 UTC', () => {
    const id = weekId(T0);
    expect(new Date(weekStart(id)).toISOString()).toBe('2026-11-02T00:00:00.000Z');
    expect(weekId(weekStart(id) - 1)).toBe(id - 1);
  });
  it('keeps each player once, best first, ten at most', () => {
    const b = emptyBoards(1);
    expect(placeOnBoard(b, 'big', { a: A, n: 'a', v: 500 })).toBe(true);
    expect(placeOnBoard(b, 'big', { a: A, n: 'a', v: 300 })).toBe(false);
    expect(placeOnBoard(b, 'big', { a: B, n: 'b', v: 900 })).toBe(true);
    expect(b.big.map((e) => e.a)).toEqual([B, A]);
    placeOnBoard(b, 'xp', { a: A, n: 'a', v: 10 }); placeOnBoard(b, 'xp', { a: A, n: 'a', v: 30 });
    expect(b.xp).toEqual([{ a: A, n: 'a', v: 30 }]);
    for (let i = 0; i < 15; i++) placeOnBoard(b, 'play', { a: 'S' + i, n: String(i), v: i + 1 });
    expect(b.play).toHaveLength(10); expect(b.play[0].v).toBe(15);
    expect(placeOnBoard(b, 'play', { a: 'SX', n: 'x', v: 1 })).toBe(false);
    expect(loadBoards(b, 2)).toEqual(emptyBoards(2));
  });
});

describe('the schedule', () => {
  it('happy hour 19:00 and the tournament 20:00 UTC, daily', () => {
    const at = (h: number, m = 0) => Date.UTC(2026, 10, 2, h, m);
    expect(happyHour(at(19, 30)).on).toBe(true);
    expect(happyHour(at(20, 0)).on).toBe(false);
    expect(new Date(happyHour(at(20, 0)).start).toISOString()).toBe('2026-11-03T19:00:00.000Z');
    const t = tourneyAt(at(20, 10));
    expect(t.on).toBe(true); expect(new Date(t.end).toISOString()).toBe('2026-11-02T20:30:00.000Z');
    expect(tourneyAt(at(20, 30)).n).toBe(t.n + 1);
    expect(tourneyAt(at(20, 30)).g).not.toBe(t.g);
    expect(lastFinishedTourney(at(20, 30)).n).toBe(t.n);
    expect(lastFinishedTourney(at(20, 29)).n).toBe(t.n - 1);
  });
  it('can be shortened for tests, and ignores nonsense', () => {
    const s = parseSchedule('{"period":240000,"hh":[0,60000],"tour":[60000,120000]}');
    expect(s.period).toBe(240000);
    expect(tourneyAt(60_000 + 240_000 * 10, s).on).toBe(true);
    expect(parseSchedule('{"period":5}')).toEqual(DEFAULT_SCHEDULE);
    expect(parseSchedule(undefined)).toEqual(DEFAULT_SCHEDULE);
  });
});

describe('the slot tournament', () => {
  const s = DEFAULT_SCHEDULE;
  const cur = tourneyAt(Date.UTC(2026, 10, 2, 20, 5), s);
  const now = cur.start + 1000;
  it('scores wins as multiples of the bet, 50 spins at most, only on its machine', () => {
    const t = newTourney(cur);
    expect(scoreTourney(t, 'ka', log({ k: 'spin', g: cur.g, bet: 10, won: 50 }), now)).toBe(false);    // not joined
    expect(joinTourney(t, 'ka', A)).toBe(true); expect(joinTourney(t, 'ka', A)).toBe(false);
    joinTourney(t, 'kb', B);
    expect(scoreTourney(t, 'ka', log({ k: 'spin', g: cur.g, bet: 10, won: 50 }), now)).toBe(true);
    expect(scoreTourney(t, 'kb', log({ k: 'spin', g: cur.g, bet: 1000, won: 3000 }), now)).toBe(true);   // bet size does not matter
    const other = cur.g === 'drop' ? 'nv' : 'drop';
    expect(scoreTourney(t, 'ka', log({ k: 'spin', g: other, bet: 10, won: 500 }), now)).toBe(false);
    expect(scoreTourney(t, 'ka', log({ k: 'spin', g: cur.g, bet: 10, won: 50 }), cur.end)).toBe(false);
    for (let i = 0; i < 60; i++) scoreTourney(t, 'kb', log({ k: 'spin', g: cur.g, bet: 10, won: 0 }), now);
    expect(t.e.kb.sp).toBe(TOURNEY_SPINS);
    expect(t.e.ka.sc).toBe(5); expect(t.e.kb.sc).toBe(3);
    const view = tourneyView(t, now, s, 'ka');
    expect(view.on).toBe(true); expect(view.mine?.sc).toBe(5); expect(view.top.map((e) => e.a)).toEqual([A, B]);
    const won = settleTourney(t);
    expect(won.map((w) => [w.a, w.place, w.prize])).toEqual([[A, 1, TOURNEY_PRIZES[0]], [B, 2, TOURNEY_PRIZES[1]]]);
    expect(t.done).toBe(true);
    joinTourney(t, 'kc', C);
    expect(settleTourney(newTourney(cur))).toEqual([]);
  });
});

describe('the progressive jackpot', () => {
  it('grows by 1% of each paid spin and is won by chance', () => {
    const j = loadJackpot(null);
    expect(j.v).toBe(JACKPOT_SEED);
    expect(feedJackpot(j, log({ k: 'spin', g: 'nv', bet: 1000 }), 0.5).hit).toBe(false);
    expect(j.v).toBe(JACKPOT_SEED + 10);
    expect(feedJackpot(j, log({ k: 'spin', g: 'nv', bet: 1000, free: true }), 0).hit).toBe(false);
    expect(feedJackpot(j, log({ k: 'hand', g: 'roulette', bet: 1000 }), 0).hit).toBe(false);
    const r = feedJackpot(j, log({ k: 'spin', g: 'nv', bet: 5 }), 0.00001);
    expect(r.hit).toBe(true); if (r.hit) expect(r.win).toBe(JACKPOT_SEED + 11);
    resetJackpot(j, { a: A, g: 'nv', w: 100011 }, T0);
    expect(j.v).toBe(JACKPOT_SEED); expect(j.hits).toBe(1); expect(j.last?.a).toBe(A);
    expect(jackpotStep(100499, 100500)).toBe(true); expect(jackpotStep(100500, 100990)).toBe(false);
  });
});

describe('the balance that follows the player', () => {
  it('the first page sets it, later changes are deltas, prizes are credited', () => {
    expect(applyBalance(null, { init: 500 })).toEqual({ store: { v: 500, rev: 1 }, bal: { v: 500, rev: 1 } });
    expect(applyBalance({ v: 500, rev: 1 }, { init: 9999 })).toEqual({ store: null, bal: { v: 500, rev: 1 } });
    expect(applyBalance({ v: 500, rev: 1 }, { d: -120 }).bal).toEqual({ v: 380, rev: 2 });
    expect(applyBalance({ v: 50, rev: 3 }, { d: -120 }).bal).toEqual({ v: 0, rev: 4 });
    expect(creditBalance({ v: 10, rev: 2 }, 25_000)).toEqual({ v: 25_010, rev: 3 });
    expect(creditBalance(null, 5)).toEqual({ v: 5, rev: 1 });
  });
});
