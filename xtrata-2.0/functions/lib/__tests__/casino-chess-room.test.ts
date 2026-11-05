import { describe, expect, it } from 'vitest';
import { newPeer, type Peer } from '../casino-room';
import { BALANCE_PREFIX, ChessDesk, GAME_PREFIX, TABLE_PREFIX, USER_PREFIX, type Conn, type DeskStore } from '../casino-chess-room';
import { BET_WINDOW_MS, GAME_MAX_MS, GRACE_MS, KEEP_MS, WAIT_MS, type Game } from '../casino-bets';

const ADDR = (n: string) => ('ST' + n.toUpperCase() + '0'.repeat(30)).slice(0, 38);
const GID = '0123456789abcdef', GID2 = 'fedcba9876543210';
const H1 = 'aaaaaaaaaaaaaaaa', H2 = 'bbbbbbbbbbbbbbbb';
const T0 = 1_000_000;

/** An in-memory store that counts what the room would pay for: rows read, rows written (puts and deletes). */
class MemStore implements DeskStore {
  data = new Map<string, unknown>(); reads = 0; written = 0; deleted = 0; puts = 0;
  async get<T>(key: string) { this.reads++; return (this.data.has(key) ? structuredClone(this.data.get(key)) : undefined) as T | undefined; }
  async put(entries: Record<string, unknown>) { this.puts++; for (const [k, v] of Object.entries(entries)) { this.data.set(k, structuredClone(v)); this.written++; } }
  async delete(keys: string[]) { let n = 0; for (const k of keys) if (this.data.delete(k)) { n++; this.deleted++; } return n; }
  async list<T>(o: { prefix: string; limit?: number }) { this.reads++; const out = new Map<string, T>(); for (const [k, v] of [...this.data.entries()].sort()) if (k.startsWith(o.prefix) && out.size < (o.limit ?? 1e9)) out.set(k, structuredClone(v) as T); return out; }
  reset() { this.reads = this.written = this.deleted = this.puts = 0; }
  get rows() { return this.written + this.deleted; }
}

type Person = { name: string; a: string; key: string; peer: Peer; conn: Conn; got: any[] };
const world = (opts: { betsOn?: boolean; on?: boolean } = {}) => {
  const store = new MemStore();
  const counts: Record<string, number> = {};
  const desk = new ChessDesk(store, { on: () => opts.on !== false, betsOn: () => opts.betsOn !== false, count: (k) => { counts[k] = (counts[k] || 0) + 1; } });
  const people: Person[] = [];
  const conns = () => people.map((p) => p.conn);
  const add = (name: string, spot: string | null, bal = 100_000, wt: string | null = null): Person => {
    const a = ADDR(name), key = 'key-' + name;
    const peer = newPeer('id-' + name + people.length, a, key, T0, true, { name: null, checked: true });
    peer.spot = spot; peer.wt = wt;
    const got: any[] = [];
    const p: Person = { name, a, key, peer, got, conn: { id: peer.id, peer, send: (m) => got.push(m) } };
    people.push(p);
    if (bal !== null) store.data.set(BALANCE_PREFIX + key, { v: bal, rev: 1 });
    return p;
  };
  const bal = (p: Person) => ((store.data.get(BALANCE_PREFIX + p.key) as any)?.v ?? null) as number | null;
  const total = () => [...store.data.entries()].filter(([k]) => k.startsWith(BALANCE_PREFIX)).reduce((n, [, v]) => n + (v as any).v, 0);
  const sent = (p: Person, t: string) => p.got.filter((m) => m.t === t);
  const last = (p: Person, t: string) => sent(p, t).slice(-1)[0];
  const game = (gid = GID) => store.data.get(GAME_PREFIX + gid) as Game | undefined;
  const remove = (p: Person) => { const i = people.indexOf(p); if (i >= 0) people.splice(i, 1); };
  return { store, desk, people, conns, add, bal, total, sent, last, game, counts, remove };
};
type W = ReturnType<typeof world>;
const snapshot = (w: Person, b: Person, sk: number, gid = GID) => ({ k: 1, gid, w: w.a, b: b.a, sk, st: sk, m: '' });
const cres = (gid: string, r: string, tm = 'checkmate', h = H1) => ({ t: 'cres' as const, tb: 'chess1' as const, gid, r: r as any, tm: tm as any, n: 40, h });
const cbet = (side: 'w' | 'b', amt: number, gid = GID) => ({ t: 'cbet' as const, tb: 'chess1' as const, gid, side, amt });

/** Alice (White) and Bob (Black) at chess1 with 100,000 each; Carol and Dan watching with 100,000. A stake-1000 game begun. */
const start = async (opts: { sk?: number; seek?: boolean } = {}) => {
  const W = world();
  const alice = W.add('alice', 'chess1.1'), bob = W.add('bob', 'chess1.2'), carol = W.add('carol', null, 100_000, 'chess1'), dan = W.add('dan', null, 100_000, 'chess1');
  const sk = opts.sk ?? 1000;
  if (opts.seek !== false) alice.peer.ls = { tb: 'chess1', stake: sk, at: T0 - 5000 };
  await W.desk.onSnapshot(W.conns(), 'chess1', snapshot(alice, bob, sk), T0);
  return { ...W, alice, bob, carol, dan, sk };
};

describe('starting a game', () => {
  it('holds both stakes through the balance path, once, and writes the game in one go', async () => {
    const g = await start();
    expect(g.bal(g.alice)).toBe(99_000); expect(g.bal(g.bob)).toBe(99_000);
    expect(g.last(g.alice, 'bal')).toMatchObject({ v: 99_000, got: 0, why: 'chess-stake' });
    expect(g.last(g.bob, 'bal')).toMatchObject({ v: 99_000, why: 'chess-stake' });
    expect(g.sent(g.carol, 'bal')).toEqual([]);
    expect(g.game()).toMatchObject({ gid: GID, w: g.alice.a, b: g.bob.a, sk: 1000, held: true, closes: T0 + BET_WINDOW_MS });
    expect(g.store.data.get(TABLE_PREFIX + 'chess1')).toBe(GID);
    expect(g.counts.cg).toBe(1);
    await g.desk.onSnapshot(g.conns(), 'chess1', snapshot(g.alice, g.bob, 1000), T0 + 15_000);          // the next snapshot changes nothing
    expect(g.bal(g.alice)).toBe(99_000); expect(g.counts.cg).toBe(1);
  });
  it('calls a game with a stake nobody offered void, and takes nothing', async () => {
    const g = await start({ seek: false });
    expect(g.bal(g.alice)).toBe(100_000); expect(g.bal(g.bob)).toBe(100_000);
    expect(g.last(g.alice, 'cend')).toMatchObject({ gid: GID, how: 'void', r: '*' });
    expect(g.last(g.carol, 'cend')).toMatchObject({ how: 'void' });
    expect(g.game()).toMatchObject({ settled: true, held: false });
    await g.desk.onBet(g.conns(), g.carol.conn, cbet('w', 500), T0 + 1000);
    expect(g.last(g.carol, 'cbet')).toMatchObject({ err: 'closed' });
  });
  it('calls it void when a player cannot cover the stake, or has no balance on record', async () => {
    const W = world(); const alice = W.add('alice', 'chess1.1', 500), bob = W.add('bob', 'chess1.2', 100_000);
    alice.peer.ls = { tb: 'chess1', stake: 1000, at: T0 };
    await W.desk.onSnapshot(W.conns(), 'chess1', snapshot(alice, bob, 1000), T0);
    expect(W.last(bob, 'cend')).toMatchObject({ how: 'void' }); expect(W.bal(alice)).toBe(500); expect(W.bal(bob)).toBe(100_000);
    const V = world(); const a2 = V.add('alice', 'chess1.1', null), b2 = V.add('bob', 'chess1.2');
    a2.peer.ls = { tb: 'chess1', stake: 1000, at: T0 };
    await V.desk.onSnapshot(V.conns(), 'chess1', snapshot(a2, b2, 1000), T0);
    expect(V.last(b2, 'cend')).toMatchObject({ how: 'void' }); expect(V.bal(b2)).toBe(100_000);
  });
  it('needs the seek to be recent and to match; a friendly (stake 0) needs none', async () => {
    const W = world(); const a = W.add('alice', 'chess1.1'), b = W.add('bob', 'chess1.2');
    a.peer.ls = { tb: 'chess1', stake: 500, at: T0 };                                  // a different stake
    await W.desk.onSnapshot(W.conns(), 'chess1', snapshot(a, b, 1000), T0);
    expect(W.last(a, 'cend')).toMatchObject({ how: 'void' });
    const F = world(); const fa = F.add('alice', 'chess1.1'), fb = F.add('bob', 'chess1.2');
    await F.desk.onSnapshot(F.conns(), 'chess1', snapshot(fa, fb, 0), T0);
    expect(F.game()).toMatchObject({ sk: 0, held: false }); expect(F.game()?.end).toBeUndefined(); expect(F.bal(fa)).toBe(100_000);
  });
  it('starts nothing from a snapshot with no game id, a house snapshot, a finished one, or when switched off', async () => {
    const g = await start({ seek: true }); g.store.data.clear(); g.store.reset();
    await g.desk.onSnapshot(g.conns(), 'chess1', { k: 1, w: g.alice.a, b: g.bob.a }, T0);
    await g.desk.onSnapshot(g.conns(), 'chess1', { k: 1, w: g.alice.a, b: 'house:gambit', h: 'gambit' }, T0);
    await g.desk.onSnapshot(g.conns(), 'chess1', { ...snapshot(g.alice, g.bob, 1000), r: '1-0' }, T0);
    expect(g.store.puts).toBe(0);
    const off = world({ on: false }); const a = off.add('alice', 'chess1.1'), b = off.add('bob', 'chess1.2'); a.peer.ls = { tb: 'chess1', stake: 1000, at: T0 };
    await off.desk.onSnapshot(off.conns(), 'chess1', snapshot(a, b, 1000), T0);
    expect(off.store.puts).toBe(0); expect(off.bal(a)).toBe(100_000);
  });
  it('replaces a game still open at the table: its stakes come back', async () => {
    const g = await start();
    await g.desk.onSnapshot(g.conns(), 'chess1', snapshot(g.alice, g.bob, 1000, GID2), T0 + 600_000);
    expect(g.game(GID)).toMatchObject({ settled: true, end: { how: 'void' } });
    expect(g.store.data.get(TABLE_PREFIX + 'chess1')).toBe(GID2);
    expect(g.bal(g.alice)).toBe(99_000); expect(g.bal(g.bob)).toBe(99_000);          // refunded, then held again for the new game
    expect(g.total()).toBe(400_000 - 2000);
  });
  it('refuses a game between two addresses of one person', async () => {
    const W = world(); const a = W.add('alice', 'chess1.1'), b = W.add('bob', 'chess1.2'); b.peer.k = a.peer.k; a.peer.ls = { tb: 'chess1', stake: 100, at: T0 };
    await W.desk.onSnapshot(W.conns(), 'chess1', snapshot(a, b, 100), T0);
    expect(W.last(a, 'cend')).toMatchObject({ how: 'void' });
  });
});

describe('bets', () => {
  it('hold the stake at once, tell the bettor, and add up', async () => {
    const g = await start();
    await g.desk.onBet(g.conns(), g.carol.conn, cbet('w', 500), T0 + 1000);
    expect(g.bal(g.carol)).toBe(99_500);
    expect(g.last(g.carol, 'bal')).toMatchObject({ v: 99_500, why: 'cbet' });
    expect(g.last(g.carol, 'cbet')).toMatchObject({ ok: true, side: 'w', amt: 500, pool: { w: 500, b: 0 }, closes: T0 + BET_WINDOW_MS });
    await g.desk.onBet(g.conns(), g.carol.conn, cbet('w', 700), T0 + 2000);
    expect(g.last(g.carol, 'cbet')).toMatchObject({ amt: 1200, pool: { w: 1200, b: 0 } });
    expect(g.bal(g.carol)).toBe(98_800);
  });
  it('give the reasons: own game, other side, window closed, not here, no funds, too small, too big, off', async () => {
    const g = await start();
    const eve = g.add('eve', null, 100_000, null);
    await g.desk.onBet(g.conns(), eve.conn, cbet('b', 500), T0 + 1000); expect(g.last(eve, 'cbet')).toMatchObject({ err: 'not-here' });
    g.alice.peer.wt = 'chess1'; g.alice.peer.spot = null;                                                         // watching her own game: still no
    await g.desk.onBet(g.conns(), g.alice.conn, cbet('b', 500), T0 + 2000); expect(g.last(g.alice, 'cbet')).toMatchObject({ err: 'self' });
    await g.desk.onBet(g.conns(), g.carol.conn, cbet('w', 500), T0 + 1000);
    await g.desk.onBet(g.conns(), g.carol.conn, cbet('b', 500), T0 + 2000); expect(g.last(g.carol, 'cbet')).toMatchObject({ err: 'side' });
    await g.desk.onBet(g.conns(), g.dan.conn, cbet('w', 50), T0 + 3000); expect(g.last(g.dan, 'cbet')).toMatchObject({ err: 'min' });
    await g.desk.onBet(g.conns(), g.dan.conn, cbet('w', 10_001), T0 + 4000); expect(g.last(g.dan, 'cbet')).toMatchObject({ err: 'max' });
    g.store.data.set(BALANCE_PREFIX + g.dan.key, { v: 100, rev: 1 });
    await g.desk.onBet(g.conns(), g.dan.conn, cbet('w', 500), T0 + 5000); expect(g.last(g.dan, 'cbet')).toMatchObject({ err: 'funds' });
    await g.desk.onBet(g.conns(), g.dan.conn, cbet('w', 100), T0 + BET_WINDOW_MS + 1); expect(g.last(g.dan, 'cbet')).toMatchObject({ err: 'closed' });
    await g.desk.onBet(g.conns(), g.dan.conn, cbet('w', 100, GID2), T0 + BET_WINDOW_MS + 5000); expect(g.last(g.dan, 'cbet')).toMatchObject({ err: 'closed' });      // a game the room does not know
    expect(g.bal(g.dan)).toBe(100);
  });
  it('are refused when switched off, but bets already placed are still paid', async () => {
    const W = world({ betsOn: true }); let on = true;
    const desk = new ChessDesk(W.store, { on: () => true, betsOn: () => on });
    const a = W.add('alice', 'chess1.1'), b = W.add('bob', 'chess1.2'), c = W.add('carol', null, 100_000, 'chess1');
    a.peer.ls = { tb: 'chess1', stake: 0, at: T0 };
    await desk.onSnapshot(W.conns(), 'chess1', snapshot(a, b, 0), T0);
    await desk.onBet(W.conns(), c.conn, cbet('w', 1000), T0 + 1000); on = false;
    await desk.onBet(W.conns(), c.conn, cbet('w', 1000), T0 + 2000); expect(W.last(c, 'cbet')).toMatchObject({ err: 'off' });
    await desk.onReport(W.conns(), a.conn, cres(GID, '1-0'), T0 + 3000); await desk.onReport(W.conns(), b.conn, cres(GID, '1-0'), T0 + 4000);
    expect(W.bal(c)).toBe(100_000);                                                                           // alone on the winning side: stake back
  });
  it('limit how fast one connection can bet, and answer an ask with the pool', async () => {
    const g = await start();
    for (let i = 0; i < 20; i++) await g.desk.onBet(g.conns(), g.carol.conn, cbet('w', 100), T0 + 1000 + i * 400);
    const before = g.bal(g.carol);
    await g.desk.onBet(g.conns(), g.carol.conn, cbet('w', 100), T0 + 1000 + 20 * 400 - 1);
    await g.desk.onBet(g.conns(), g.carol.conn, cbet('w', 100), T0 + 1000 + 20 * 400 + 5_000);
    expect(g.bal(g.carol)).toBeLessThanOrEqual(before!);
    await g.desk.onBet(g.conns(), g.dan.conn, { t: 'cbet', tb: 'chess1', gid: GID, ask: true }, T0 + 20_000);
    expect(g.last(g.dan, 'cpool')).toMatchObject({ gid: GID, closes: T0 + BET_WINDOW_MS });
    expect(g.sent(g.dan, 'cbet')).toEqual([]);                                                               // Dan has not bet: nothing about his bet
    await g.desk.onBet(g.conns(), g.carol.conn, { t: 'cbet', tb: 'chess1', gid: GID, ask: true }, T0 + 30_000);
    expect(g.last(g.carol, 'cbet')).toMatchObject({ ok: true, side: 'w' });                                    // a reloaded bettor gets their bet back
  });
  it('let a guest watching the table see the pool but not bet', async () => {
    const g = await start();
    const guest = g.add('guest', null, null as any, 'chess1'); guest.peer.a = null; guest.peer.k = null;
    await g.desk.onBet(g.conns(), guest.conn, { t: 'cbet', tb: 'chess1', gid: GID, ask: true }, T0 + 5000);
    expect(g.last(guest, 'cpool')).toMatchObject({ gid: GID });
    await g.desk.onBet(g.conns(), guest.conn, cbet('w', 500), T0 + 6000);
    expect(g.last(guest, 'err')).toEqual({ t: 'err', code: 'cbet-sign-in-first' });
  });
  it('send the pool to the table at most every 2 s, and once more when betting has closed', async () => {
    const g = await start();
    const pools = () => g.sent(g.dan, 'cpool').length;
    await g.desk.onBet(g.conns(), g.carol.conn, cbet('w', 100), T0 + 10_000); expect(pools()).toBe(1);
    await g.desk.onBet(g.conns(), g.carol.conn, cbet('w', 100), T0 + 10_500); expect(pools()).toBe(1);        // too soon
    await g.desk.tickTable(g.conns(), 'chess1', T0 + 11_000); expect(pools()).toBe(1);
    await g.desk.tickTable(g.conns(), 'chess1', T0 + 12_100); expect(pools()).toBe(2);                         // the late one goes out on the next touch
    expect(g.last(g.dan, 'cpool').pool).toEqual({ w: 200, b: 0 });
    await g.desk.tickTable(g.conns(), 'chess1', T0 + 20_000); expect(pools()).toBe(2);
    await g.desk.tickTable(g.conns(), 'chess1', T0 + BET_WINDOW_MS); expect(pools()).toBe(3);                  // final
    await g.desk.tickTable(g.conns(), 'chess1', T0 + BET_WINDOW_MS + 5000); expect(pools()).toBe(3);
    expect(g.sent(g.alice, 'cpool').length).toBe(3);                                                           // players are on the table list too
    expect(g.sent(g.carol, 'cbet').length).toBe(2);
  });
});

describe('results and payouts', () => {
  const bets = async (g: Awaited<ReturnType<typeof start>>) => {
    await g.desk.onBet(g.conns(), g.carol.conn, cbet('w', 1000), T0 + 1000);
    await g.desk.onBet(g.conns(), g.dan.conn, cbet('b', 3000), T0 + 2000);
  };
  it('pay the winner both stakes and the backers of the winning side the pool when both pages agree', async () => {
    const g = await start(); await bets(g); const before = g.total();
    await g.desk.onReport(g.conns(), g.alice.conn, cres(GID, '1-0'), T0 + 100_000);
    expect(g.game()?.end).toBeUndefined(); expect(g.sent(g.bob, 'cres')).toEqual([{ t: 'cres', tb: 'chess1', gid: GID, ask: true }]);        // asked the other page
    expect(g.sent(g.alice, 'cres')).toEqual([]);
    await g.desk.onReport(g.conns(), g.bob.conn, cres(GID, '1-0'), T0 + 101_000);
    expect(g.game()).toMatchObject({ settled: true, end: { r: '1-0', how: 'agreed' } });
    expect(g.bal(g.alice)).toBe(101_000); expect(g.bal(g.bob)).toBe(99_000);
    expect(g.bal(g.carol)).toBe(99_000 + 4000); expect(g.bal(g.dan)).toBe(97_000);
    expect(g.total()).toBe(before + 2000 + 4000);                                       // only what was held came back out
    expect(g.last(g.alice, 'cend')).toMatchObject({ r: '1-0', how: 'agreed', gid: GID });
    for (const p of [g.bob, g.carol, g.dan]) expect(g.last(p, 'cend')).toMatchObject({ how: 'agreed' });
    expect(g.last(g.carol, 'cpay')).toMatchObject({ side: 'w', stake: 1000, won: 4000, how: 'result' });
    expect(g.last(g.dan, 'cpay')).toMatchObject({ side: 'b', stake: 3000, won: 0 });
    // the balance message comes before the news that explains it
    const order = g.carol.got.map((m) => m.t); expect(order.indexOf('bal', order.indexOf('cbet'))).toBeLessThan(order.indexOf('cend'));
    expect(g.store.data.get(TABLE_PREFIX + 'chess1')).toBeUndefined(); expect(g.store.data.get(USER_PREFIX + g.alice.key)).toBeUndefined();
  });
  it('never pays twice if the end is asked for again, or a page re-sends its report afterwards', async () => {
    const g = await start(); await bets(g);
    await g.desk.onReport(g.conns(), g.alice.conn, cres(GID, '1-0'), T0 + 100_000); await g.desk.onReport(g.conns(), g.bob.conn, cres(GID, '1-0'), T0 + 101_000);
    const after = g.total(), sent = g.carol.got.length;
    await g.desk.finish(g.conns(), g.game()!, { r: '0-1', tm: 'x', how: 'agreed' }, T0 + 102_000);
    await g.desk.onReport(g.conns(), g.alice.conn, cres(GID, '1-0'), T0 + 115_000);
    expect(g.total()).toBe(after); expect(g.carol.got.length).toBe(sent);
    expect(g.last(g.alice, 'cend')).toMatchObject({ r: '1-0' });                         // the re-sender was simply told again
  });
  it('void everything and count a dispute when the pages disagree', async () => {
    const g = await start(); await bets(g); const before = g.total();
    await g.desk.onReport(g.conns(), g.alice.conn, cres(GID, '1-0'), T0 + 100_000);
    await g.desk.onReport(g.conns(), g.bob.conn, cres(GID, '1-0', 'checkmate', H2), T0 + 101_000);
    expect(g.game()?.end).toMatchObject({ how: 'disputed' }); expect(g.counts.cd).toBe(1);
    expect(g.total()).toBe(before + 2000 + 4000); expect(g.bal(g.alice)).toBe(100_000); expect(g.bal(g.carol)).toBe(100_000); expect(g.bal(g.dan)).toBe(100_000);
    expect(g.last(g.dan, 'cpay')).toMatchObject({ won: 3000, how: 'refund' });
  });
  it('count a dispute that a page raises itself', async () => {
    const g = await start();
    await g.desk.onReport(g.conns(), g.bob.conn, cres(GID, '*', 'dispute'), T0 + 100_000);
    expect(g.game()?.end).toMatchObject({ how: 'disputed' }); expect(g.counts.cd).toBe(1); expect(g.bal(g.alice)).toBe(100_000);
  });
  it('take the resigning player\'s own word at once', async () => {
    const g = await start();
    await g.desk.onReport(g.conns(), g.bob.conn, cres(GID, '1-0', 'resignation'), T0 + 100_000);
    expect(g.game()?.end).toMatchObject({ r: '1-0', how: 'unchallenged' }); expect(g.bal(g.alice)).toBe(101_000);
  });
  it('let a lone winner\'s report stand after the wait, found when someone next touches the table', async () => {
    const g = await start();
    await g.desk.onReport(g.conns(), g.alice.conn, cres(GID, '1-0'), T0 + 100_000);
    await g.desk.tick(g.conns(), T0 + 100_000 + WAIT_MS - 1); expect(g.game()?.end).toBeUndefined();
    await g.desk.tick(g.conns(), T0 + 100_000 + WAIT_MS); expect(g.game()?.end).toMatchObject({ r: '1-0', how: 'unchallenged' }); expect(g.bal(g.alice)).toBe(101_000);
  });
  it('refund a lone report that is not the winner\'s, and a game that ran 90 minutes', async () => {
    const g = await start();
    await g.desk.onReport(g.conns(), g.alice.conn, cres(GID, '0-1'), T0 + 100_000); await g.desk.tick(g.conns(), T0 + 100_000 + WAIT_MS);
    expect(g.game()?.end).toMatchObject({ how: 'expired' }); expect(g.bal(g.alice)).toBe(100_000);
    const h = await start(); await h.desk.tick(h.conns(), T0 + GAME_MAX_MS);
    expect(h.game()?.end).toMatchObject({ how: 'expired' }); expect(h.bal(h.bob)).toBe(100_000);
  });
  it('ignore reports from people who are not the players, for another table or for no game', async () => {
    const g = await start();
    await g.desk.onReport(g.conns(), g.carol.conn, cres(GID, '1-0'), T0 + 1000);
    await g.desk.onReport(g.conns(), g.alice.conn, { ...cres(GID, '1-0'), tb: 'chess2' }, T0 + 1000);
    await g.desk.onReport(g.conns(), g.alice.conn, cres(GID2, '1-0'), T0 + 1000);
    expect(g.game()?.rep).toEqual({});
  });
});

describe('leaving', () => {
  it('starts the grace when a player\'s last connection closes, and tells the table', async () => {
    const g = await start(); g.remove(g.bob);
    await g.desk.onGone(g.conns(), g.bob.peer, T0 + 30_000);
    const m = g.last(g.alice, 'cgone');
    expect(m).toEqual({ t: 'cgone', tb: 'chess1', gid: GID, a: g.bob.a, until: T0 + 30_000 + GRACE_MS });
    expect(g.last(g.carol, 'cgone')).toEqual(m);
    await g.desk.onGone(g.conns(), g.bob.peer, T0 + 40_000);                                                  // a second close does not restart it
    expect(g.sent(g.alice, 'cgone').length).toBe(1);
  });
  it('is not leaving while another tab of the player stays', async () => {
    const g = await start(); const tab = g.add('bob', null, null as any);
    tab.a = g.bob.a; tab.peer.a = g.bob.a; tab.key = g.bob.key; tab.peer.k = g.bob.key;
    g.remove(g.bob); await g.desk.onGone(g.conns(), g.bob.peer, T0 + 30_000);
    expect(g.sent(g.alice, 'cgone')).toEqual([]);
  });
  it('gives the game to the one who stayed once the grace is over, and the leaver loses their stake', async () => {
    const g = await start(); await g.desk.onBet(g.conns(), g.carol.conn, cbet('w', 1000), T0 + 1000);
    g.remove(g.bob); await g.desk.onGone(g.conns(), g.bob.peer, T0 + 30_000);
    await g.desk.tick(g.conns(), T0 + 30_000 + GRACE_MS - 1); expect(g.game()?.end).toBeUndefined();
    await g.desk.tick(g.conns(), T0 + 30_000 + GRACE_MS);
    expect(g.game()?.end).toMatchObject({ r: '1-0', tm: 'resignation', how: 'forfeit', a: g.bob.a });
    expect(g.bal(g.alice)).toBe(101_000); expect(g.bal(g.bob)).toBe(99_000); expect(g.bal(g.carol)).toBe(100_000);       // Carol backed White alone: her stake back
    expect(g.last(g.alice, 'cend')).toMatchObject({ how: 'forfeit', a: g.bob.a });
    expect(g.store.data.get(USER_PREFIX + g.bob.key)).toBe(GID);                                                   // kept: Bob is not here to be told
  });
  it('tells a player who comes back after the end how it ended, once', async () => {
    const g = await start(); g.remove(g.bob); await g.desk.onGone(g.conns(), g.bob.peer, T0 + 30_000); await g.desk.tick(g.conns(), T0 + 30_000 + GRACE_MS);
    const back = g.add('bob', null, null as any); back.peer.k = g.bob.key; back.peer.a = g.bob.a; back.key = g.bob.key; back.a = g.bob.a;
    await g.desk.onConnect(g.conns(), back.conn, T0 + 500_000);
    expect(g.last(back, 'cend')).toMatchObject({ how: 'forfeit', r: '1-0', a: g.bob.a });
    expect(g.store.data.get(USER_PREFIX + g.bob.key)).toBeUndefined();
    const again = g.add('bob', null, null as any); again.peer.k = g.bob.key; again.peer.a = g.bob.a;
    await g.desk.onConnect(g.conns(), again.conn, T0 + 600_000); expect(g.sent(again, 'cend')).toEqual([]);
  });
  it('welcomes a player back inside the grace and cancels the forfeit', async () => {
    const g = await start(); g.remove(g.bob); await g.desk.onGone(g.conns(), g.bob.peer, T0 + 30_000);
    const back = g.add('bob', null, null as any); back.peer.k = g.bob.key; back.peer.a = g.bob.a;
    await g.desk.onConnect(g.conns(), back.conn, T0 + 60_000);
    expect(g.last(g.alice, 'cgone')).toEqual({ t: 'cgone', tb: 'chess1', gid: GID, a: g.bob.a, back: true });
    await g.desk.tick(g.conns(), T0 + 30_000 + 10 * GRACE_MS); expect(g.game()?.end?.how).not.toBe('forfeit');
  });
  it('calls the game off when both leave', async () => {
    const g = await start();
    g.remove(g.bob); await g.desk.onGone(g.conns(), g.bob.peer, T0 + 30_000); g.remove(g.alice); await g.desk.onGone(g.conns(), g.alice.peer, T0 + 40_000);
    await g.desk.tick(g.conns(), T0 + 30_000 + GRACE_MS); expect(g.game()?.end).toMatchObject({ how: 'void' });
    expect(g.bal(g.alice)).toBe(100_000); expect(g.bal(g.bob)).toBe(100_000);
  });
  it('does nothing for a player who is not in a game', async () => {
    const g = await start(); g.store.reset();
    await g.desk.onGone(g.conns(), g.carol.peer, T0 + 1000);
    expect(g.store.puts).toBe(0);
  });
});

describe('tidying', () => {
  it('removes games finished more than a week ago, and settles one that never finished', async () => {
    const g = await start();
    await g.desk.onReport(g.conns(), g.bob.conn, cres(GID, '1-0', 'resignation'), T0 + 100_000);
    await g.desk.tick(g.conns(), T0 + 100_000 + KEEP_MS + 1); expect(g.game()).toBeUndefined();
    const h = await start(); h.store.data.delete(TABLE_PREFIX + 'chess1');                                        // a game whose pointer was lost
    await h.desk.tick(h.conns(), T0 + 3 * 3_600_000); expect(h.game()?.end).toMatchObject({ how: 'expired' });
    expect(h.bal(h.alice)).toBe(100_000);
  });
  it('checks for old games only once an hour', async () => {
    const g = await start(); g.store.reset();
    await g.desk.tick(g.conns(), T0 + 1000); const first = g.store.reads;
    await g.desk.tick(g.conns(), T0 + 2000); expect(g.store.reads - first).toBeLessThan(first);
  });
});

describe('what a game costs', () => {
  it('writes a bounded number of rows: the flood test', async () => {
    const W = world();
    const alice = W.add('alice', 'chess1.1'), bob = W.add('bob', 'chess1.2');
    alice.peer.ls = { tb: 'chess1', stake: 1000, at: T0 };
    const fans = Array.from({ length: 30 }, (_, i) => W.add('fan' + String(i).padStart(2, '0'), null, 100_000, 'chess1'));
    const spectators = Array.from({ length: 10 }, (_, i) => W.add('look' + i, null, 100_000, 'chess1'));
    const report: Record<string, number> = {};
    const phase = async (name: string, f: () => Promise<void>) => { W.store.reset(); await f(); report[name] = W.store.rows; report[name + ' reads'] = W.store.reads; };
    await phase('start', () => W.desk.onSnapshot(W.conns(), 'chess1', snapshot(alice, bob, 1000), T0));
    let bettors = 0;
    await phase('20 bets', async () => { for (let i = 0; i < 20; i++) { await W.desk.onBet(W.conns(), fans[i].conn, cbet(i % 2 ? 'w' : 'b', 500 + i * 10), T0 + 1000 + i * 400); bettors++; } });
    await phase('10 refused (full, closed, funds...)', async () => { for (let i = 20; i < 30; i++) await W.desk.onBet(W.conns(), fans[i].conn, cbet('w', 99), T0 + 20_000 + i * 400); });
    await phase('150 snapshots in the game (every 15 s or each move)', async () => { for (let i = 0; i < 150; i++) await W.desk.onSnapshot(W.conns(), 'chess1', snapshot(alice, bob, 1000), T0 + 30_000 + i * 5000); });
    await phase('reports and the end', async () => {
      await W.desk.onReport(W.conns(), alice.conn, cres(GID, '1-0'), T0 + 800_000); await W.desk.onReport(W.conns(), alice.conn, cres(GID, '1-0'), T0 + 815_000);
      await W.desk.onReport(W.conns(), bob.conn, cres(GID, '1-0'), T0 + 816_000);
    });
    // 6,000 spectator asks across the game must cost no writes at all
    await phase('200 pool asks', async () => { for (let i = 0; i < 200; i++) await W.desk.onBet(W.conns(), spectators[i % 10].conn, { t: 'cbet', tb: 'chess1', gid: GID, ask: true }, T0 + 900_000 + i * 2100); });
    console.log('[chess desk cost] rows written or deleted per phase, and rows read:', JSON.stringify(report));
    expect(report['start']).toBe(6);                    // the game, the table pointer, two player pointers and the two stake balances
    expect(bettors).toBe(20);
    expect(report['20 bets']).toBe(40);                 // each bet: the game and the bettor's balance
    expect(report['200 pool asks']).toBe(0);
    expect(report['150 snapshots in the game (every 15 s or each move)']).toBe(0);
    expect(report['reports and the end']).toBeLessThanOrEqual(1 + 1 + 2 + 20 + 1 + 2);      // report write(s), the end: game + 2 players + 20 bettors, pointers
    expect(W.total()).toBeGreaterThan(0);
  });
});
