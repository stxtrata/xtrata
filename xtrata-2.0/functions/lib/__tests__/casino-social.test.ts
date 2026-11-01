import { describe, expect, it } from 'vitest';
import { newPeer, parseClientMessage, type Peer } from '../casino-room';
import {
  DAILY_DROPS, DAY_MS, applyBet, applySeek, claimDaily, currentBets, markSeen, parseSocialMessage, pushWin, routeGift, routeReact,
  routeRelay, routeWin, seekers, tableAudience, tableOf, takeLimit, WIN_FEED
} from '../casino-social';
import {
  ROUND_TIMING, baccaratCards, betsOpen, cleanBets, commitOf, roundAt, roundClose, roundInfo, roundSeed, roundStart, rouletteResult,
  seedRandom, verifySeed
} from '../casino-rounds';

const A = 'ST2SMCB4CV776FCP9A2EK0ZM37NAXM1MFJMMX9DW8';
const B = 'ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA';
const C = 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP';
const peer = (id: string, a: string | null, spot: string | null = null): Peer => ({ ...newPeer(id, a, a ? 'k' + id : null, 0), spot });

describe('parsing the social messages', () => {
  it('takes the known reactions and nothing else', () => {
    expect(parseClientMessage(JSON.stringify({ t: 'react', e: 'cheer' }))).toEqual({ ok: true, msg: { t: 'react', e: 'cheer', to: null } });
    expect(parseClientMessage(JSON.stringify({ t: 'react', e: 'kiss' }))).toEqual({ ok: false, code: 'react-bad' });
    expect(parseClientMessage(JSON.stringify({ t: 'react', e: 'wave', to: 'nobody' }))).toEqual({ ok: false, code: 'react-bad' });
  });
  it('only announces wins that are big', () => {
    expect(parseSocialMessage({ t: 'win', g: 'nv', x: 50, w: 5000 })).toEqual({ ok: true, msg: { t: 'win', g: 'nv', x: 50, w: 5000 } });
    expect(parseSocialMessage({ t: 'win', g: 'nv', x: 2, w: 500 })).toEqual({ ok: false, code: 'win-small' });
    expect(parseSocialMessage({ t: 'win', g: 'poker-site', x: 50, w: 5000 })).toEqual({ ok: false, code: 'win-bad' });
    expect(parseSocialMessage({ t: 'win', g: 'drop', x: 1, w: 60000 })?.ok).toBe(true);
  });
  it('keeps table chat apart from room chat', () => {
    expect(parseClientMessage(JSON.stringify({ t: 'say', text: 'nice hand', ch: 'table' }))).toEqual({ ok: true, msg: { t: 'say', text: 'nice hand', ch: 'table' } });
    expect(parseClientMessage(JSON.stringify({ t: 'say', text: 'hello', ch: 'world' }))).toEqual({ ok: true, msg: { t: 'say', text: 'hello' } });
  });
  it('checks bets, drinks, seeks and relays', () => {
    expect(parseSocialMessage({ t: 'bet', tb: 'roulette', n: 5, bets: { red: 100, 'n:17': 25, 'm:0,2,3': 10 } })?.ok).toBe(true);
    expect(parseSocialMessage({ t: 'bet', tb: 'roulette', n: 5, bets: { 'n:37': 100 } })).toEqual({ ok: false, code: 'round-bad-bets' });
    expect(parseSocialMessage({ t: 'bet', tb: 'baccarat', n: 5, bets: { banker: 1.5 } })).toEqual({ ok: false, code: 'round-bad-bets' });
    expect(parseSocialMessage({ t: 'gift', to: 'table', d: 'champagne' })?.ok).toBe(true);
    expect(parseSocialMessage({ t: 'gift', to: A, d: 'poison' })).toEqual({ ok: false, code: 'gift-bad' });
    expect(parseSocialMessage({ t: 'seek', tb: 'liars', stake: 25 })?.ok).toBe(true);
    expect(parseSocialMessage({ t: 'pvp', to: A, d: { big: 'x'.repeat(2000) } })).toEqual({ ok: false, code: 'pvp-too-big' });
    expect(parseClientMessage(JSON.stringify({ t: 'nonsense' }))).toEqual({ ok: false, code: 'bad-message' });
  });
});

describe('reactions, wins and drinks', () => {
  it('a reaction reaches everyone who may watch, except people blocking each other', () => {
    const me = peer('1', A), friend = peer('2', B), blocker = peer('3', C), guest = peer('4', null);
    blocker.b = [A];
    const r = routeReact([me, friend, blocker, guest], me, { e: 'cheer', to: null }, 1000);
    expect(r.ok && r.out[0].to.sort()).toEqual(['1', '2', '4']);
    expect(routeReact([me], me, { e: 'cheer', to: null }, 1200)).toEqual({ ok: false, code: 'react-too-fast' });
    expect(routeReact([peer('9', null)], peer('9', null), { e: 'wave', to: null }, 0)).toEqual({ ok: false, code: 'react-sign-in-first' });
  });
  it('keeps a short feed of big wins, newest first', () => {
    const me = peer('1', A);
    const r = routeWin([me, peer('2', B)], me, { g: 'nv', x: 40, w: 4000 }, 5000);
    expect(r.ok).toBe(true);
    let feed = r.ok ? pushWin([], r.entry) : [];
    for (let i = 0; i < 20; i++) feed = pushWin(feed, { a: B, n: 'b', g: 'drop', x: i, w: 1, at: i });
    expect(feed.length).toBe(WIN_FEED);
    expect(feed[0].x).toBe(19);
  });
  it('a round of drinks goes to everyone else at the table', () => {
    const me = peer('1', A, 'blackjack.1'), other = peer('2', B, 'blackjack.2'), watcher = { ...peer('3', C), wt: 'blackjack' }, away = peer('4', 'ST000000000000000000002AMW42H', 'roulette.pad');
    const r = routeGift([me, other, watcher, away], me, { to: 'table', d: 'champagne' }, 0);
    expect(r.ok && (r.out[0].message as { to: string[] }).to.sort()).toEqual([B, C].sort());
    expect(routeGift([peer('1', A)], peer('1', A), { to: 'table', d: 'beer' }, 0)).toEqual({ ok: false, code: 'gift-no-table' });
    expect(routeGift([me, other], me, { to: A, d: 'beer' }, 9000)).toEqual({ ok: false, code: 'gift-not-you' });
  });
});

describe('tables: chat, watching, Salon seeks and the relay', () => {
  it('knows which table a person is at or watching', () => {
    expect(tableOf({ spot: 'baccarat.2', wt: null })).toBe('baccarat');
    expect(tableOf({ spot: 'drop.1', wt: 'roulette' })).toBe('roulette');
    expect(tableOf({ spot: null, wt: 'bar' })).toBe(null);
  });
  it('table chat reaches only that table', () => {
    const me = peer('1', A, 'liars.1'), other = peer('2', B, 'liars.2'), elsewhere = peer('3', C, 'blackjack.1');
    expect(tableAudience([me, other, elsewhere], me)?.ids.sort()).toEqual(['1', '2']);
    expect(tableAudience([me], peer('5', A))).toBe(null);
  });
  it('lists who is waiting for a Salon game and stops when they say so', () => {
    const me = peer('1', A);
    expect(applySeek([me], me, { tb: 'liars', stake: 25 }, 10).ok).toBe(true);
    expect(seekers([me])).toEqual([{ a: A, n: 'ST2SM…9DW8', tb: 'liars', stake: 25, at: 10 }]);
    applySeek([me], me, { off: true }, 11);
    expect(seekers([me])).toEqual([]);
  });
  it('relays moves to the other player only', () => {
    const me = peer('1', A), them = peer('2', B), them2 = peer('3', B);
    const r = routeRelay([me, them, them2], me, { to: B, d: { op: 'bid' } }, 0);
    expect(r.ok && r.out[0].to).toEqual(['2', '3']);
    expect(routeRelay([me], me, { to: B, d: 1 }, 0)).toEqual({ ok: false, code: 'pvp-not-here' });
    them.b = [A];
    expect(routeRelay([me, them], me, { to: B, d: 1 }, 50)).toEqual({ ok: false, code: 'pvp-blocked' });
  });
  it('limits by gap and by count', () => {
    let list: number[] = [];
    for (let i = 0; i < 5; i++) list = takeLimit(list, i * 1000, 500, 3).list;
    expect(list.length).toBe(3);
  });
});

describe('the daily drop and the counters', () => {
  it('grows with a streak and starts again after a missed day', () => {
    const day = (d: number) => d * DAY_MS + 3600_000;
    let rec = claimDaily(null, day(100));
    expect(rec.reply.got).toBe(DAILY_DROPS[0]);
    expect(claimDaily(rec.store, day(100) + 1000).reply.got).toBe(0);
    rec = claimDaily(rec.store, day(101));
    expect(rec.reply).toMatchObject({ got: DAILY_DROPS[1], streak: 2 });
    let store = rec.store;
    for (let d = 102; d < 112; d++) store = claimDaily(store, day(d)).store;
    expect(claimDaily(store, day(112)).reply.got).toBe(DAILY_DROPS[DAILY_DROPS.length - 1]);
    expect(claimDaily(store, day(120)).reply).toMatchObject({ got: DAILY_DROPS[0], streak: 1 });
  });
  it('counts a player once a day, as new or returning', () => {
    const first = markSeen(null, 5 * DAY_MS);
    expect(first.counts).toEqual(['s', 'nw']);
    expect(markSeen(first.store, 5 * DAY_MS + 10).counts).toEqual([]);
    expect(markSeen(first.store, 6 * DAY_MS).counts).toEqual(['s', 'r']);
  });
});

describe('shared rounds', () => {
  const secret = new Uint8Array(32).fill(7);
  it('runs on the clock: open, then closed, then the next round', () => {
    const { period, close } = ROUND_TIMING.roulette;
    const n = 1000, start = roundStart('roulette', n);
    expect(roundAt('roulette', start)).toBe(n);
    expect(betsOpen('roulette', n, start + close - 1)).toBe(true);
    expect(betsOpen('roulette', n, start + close)).toBe(false);
    expect(roundAt('roulette', start + period)).toBe(n + 1);
    expect(roundClose('roulette', n)).toBe(start + close);
  });
  it('commits before the close and reveals after, and the seed checks out', async () => {
    const n = 2000, start = roundStart('baccarat', n);
    const open = await roundInfo(secret, 'baccarat', start + 1000);
    expect(open.seed).toBe(null);
    expect(open.prev.seed).toBe(await roundSeed(secret, 'baccarat', n - 1));
    const shut = await roundInfo(secret, 'baccarat', roundClose('baccarat', n) + 5);
    expect(shut.commit).toBe(open.commit);
    expect(await verifySeed(shut.seed as string, open.commit)).toBe(true);
    expect(await verifySeed('0'.repeat(64), open.commit)).toBe(false);
    expect(await commitOf(shut.seed as string)).toBe(open.commit);
  });
  it('takes bets only while they are open, and lists them for the table', () => {
    const me = peer('1', A), now = roundStart('roulette', 50) + 100;
    expect(applyBet([me], me, { tb: 'roulette', n: 50, bets: { red: 10 } }, now).ok).toBe(true);
    expect(currentBets([me], 'roulette', now)).toEqual([{ a: A, n: 'ST2SM…9DW8', bets: { red: 10 } }]);
    expect(applyBet([me], me, { tb: 'roulette', n: 50, bets: { red: 10 } }, roundClose('roulette', 50))).toEqual({ ok: false, code: 'round-closed' });
    expect(applyBet([me], me, { tb: 'roulette', n: 49, bets: { red: 10 } }, now)).toEqual({ ok: false, code: 'round-closed' });
    expect(cleanBets('roulette', { red: 0 })).toBe(null);
  });
  it('derives the same fair results from a seed everywhere', () => {
    const seed = 'ab'.repeat(32);
    expect(rouletteResult(seed)).toBe(rouletteResult(seed));
    const cards = baccaratCards(seed);
    expect(cards).toHaveLength(6);
    expect(cards.every((c) => c.r >= 2 && c.r <= 14 && 'SHDC'.includes(c.s))).toBe(true);
    // every pocket turns up, roughly evenly, across many seeds
    const hits = new Array(37).fill(0);
    for (let i = 0; i < 3700; i++) hits[rouletteResult(i.toString(16).padStart(64, '0'))] += 1;
    expect(Math.min(...hits)).toBeGreaterThan(50);
    expect(Math.max(...hits)).toBeLessThan(160);
    const r = seedRandom(seed);
    for (let i = 0; i < 100; i++) expect(r.below(7)).toBeLessThan(7);
  });
});
