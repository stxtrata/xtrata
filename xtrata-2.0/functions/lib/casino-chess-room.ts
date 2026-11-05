/**
 * The room's chess desk: the part of casino-bets.ts that touches storage and connections. It holds the players' stakes and the
 * spectators' bets, compares the two pages' result reports, runs the leaving rule and pays out. The Durable Object
 * (workers/casino-room/index.ts) is a thin caller; everything here is written against a small storage interface and a list of
 * connections, so a test can run the whole thing with an in-memory store that counts operations.
 *
 * Cost rules (Jim, 2026-11-04): everything lives in the one room object; no timers or alarms of its own (deadlines are checked when
 * someone connects, sends, or the existing once-a-minute check runs); pool totals only, at most one every 2 s, and no moves are
 * ever read or stored; every storage write for one event is a single `put` of several keys, so a game is never half-paid.
 *
 * Storage keys: `cg:<gid>` the game; `ct:<table>` the live game at a table; `cu:<player key>` that player's latest game (so a player
 * who comes back is told how it ended, and a player who leaves is found); balances are the room's `b:<player key>` records.
 */
import { canSee, type Peer } from './casino-room';
import { creditBalance, type Balance } from './casino-progress';
import { CHESS_TABLES, takeLimit, tableOf, type ChessTable } from './casino-social';
import {
  KEEP_MS, POOL_GAP_MS, SEEK_FRESH_MS, addBet, betError, bettorCount, colorOf, due, judge, keyOf, markBack, markGone,
  newGame, addressOf, pools, readSnapshot, setReport, settlement,
  type ChessMessage, type Color, type End, type Game
} from './casino-bets';

export const GAME_PREFIX = 'cg:';
export const TABLE_PREFIX = 'ct:';
export const USER_PREFIX = 'cu:';
/** The room's balance records (workers/casino-room/index.ts BALANCE_PREFIX). */
export const BALANCE_PREFIX = 'b:';

export interface DeskStore {
  get<T>(key: string): Promise<T | undefined>;
  /** Several keys in one write: all or none. */
  put(entries: Record<string, unknown>): Promise<void>;
  delete(keys: string[]): Promise<unknown>;
  list<T>(options: { prefix: string; limit?: number }): Promise<Map<string, T>>;
}
export type Conn = { id: string; peer: Peer; send: (message: unknown) => void };
export type DeskOptions = {
  /** Whether new games are tracked (CASINO_CHESS_RES_DISABLED off). Games already tracked always finish. */
  on: () => boolean;
  /** Whether new bets are taken (CASINO_BETS_DISABLED off). Bets already placed are always paid or refunded. */
  betsOn: () => boolean;
  /** Anonymous day counters: games tracked (`cg`) and games voided by a dispute (`cd`). Bets are not counted one by one: each count is a row written. */
  count?: (key: 'cg' | 'cd') => void;
};

const keyOfPeer = (p: Peer) => (p.k || p.a) as string;
const cendOf = (g: Game) => ({ t: 'cend', tb: g.tb, gid: g.gid, r: g.end!.r, tm: g.end!.tm, how: g.end!.how, ...(g.end!.a ? { a: g.end!.a } : {}) });

export class ChessDesk {
  /** Pool update bookkeeping, in memory only (a wake-up forgets it, which at worst sends one extra update). */
  private readonly poolState = new Map<string, { at: number; dirty: boolean; final: boolean }>();
  private cleaned = Number.NEGATIVE_INFINITY;

  constructor(private readonly store: DeskStore, private readonly opts: DeskOptions) { }

  // ---------------------------------------------------------------- small helpers

  private game(gid: string) { return this.store.get<Game>(GAME_PREFIX + gid); }
  private async balanceOf(who: string) { return (await this.store.get<Balance>(BALANCE_PREFIX + who)) || null; }
  private tellAddress(conns: Conn[], address: string, message: unknown) { for (const c of conns) if (c.peer.a === address) c.send(message); }
  private bal(conns: Conn[], address: string, b: Balance, why: string, now: number) {
    this.tellAddress(conns, address, { t: 'bal', v: b.v, rev: b.rev, got: 0, why, at: now });
  }
  /** The two players, the people at the table, and every bettor: each connection once. */
  private audience(conns: Conn[], g: Game): Conn[] {
    const bettors = new Set(Object.values(g.bets).map((b) => b.a));
    return conns.filter((c) => c.peer.a === g.w || c.peer.a === g.b || (!!c.peer.a && bettors.has(c.peer.a)) || (tableOf(c.peer) === g.tb && canSee(c.peer)));
  }
  private tellTable(conns: Conn[], tb: string, message: unknown) { for (const c of conns) if (tableOf(c.peer) === tb && canSee(c.peer)) c.send(message); }
  private poolMsg(g: Game) { return { t: 'cpool', tb: g.tb, gid: g.gid, pool: pools(g), n: bettorCount(g), closes: g.closes }; }

  /** Sends the pool to the table when it changed and 2 s have passed, and once more when betting has closed. */
  private flushPool(conns: Conn[], g: Game, now: number, changed = false) {
    const st = this.poolState.get(g.gid) || { at: 0, dirty: false, final: false };
    if (changed) st.dirty = true;
    const closing = now >= g.closes && !st.final;
    if ((st.dirty && now - st.at >= POOL_GAP_MS) || closing) {
      this.tellTable(conns, g.tb, this.poolMsg(g));
      st.at = now; st.dirty = false; if (now >= g.closes) st.final = true;
    }
    this.poolState.set(g.gid, st);
  }

  // ---------------------------------------------------------------- a snapshot starts a game

  /** A host's `spec` snapshot that routeSpec accepted. The first one for a new `gid` opens the game and holds the stakes. */
  async onSnapshot(conns: Conn[], tb: ChessTable, d: unknown, now: number) {
    const s = readSnapshot(d);
    if (!s || s.over || !this.opts.on()) return;
    const known = await this.game(s.gid);
    if (known) { await this.tickTable(conns, tb, now); return; }
    const pw = conns.find((c) => c.peer.a === s.w)?.peer, pb = conns.find((c) => c.peer.a === s.b)?.peer;
    if (!pw || !pb) return;
    const old = await this.store.get<string>(TABLE_PREFIX + tb);
    if (old && old !== s.gid) {
      const g0 = await this.game(old);
      if (g0 && !g0.end) await this.finish(conns, g0, { r: '*', tm: 'replaced', how: 'void' }, now);
    }
    const g = newGame({ gid: s.gid, tb, w: s.w, b: s.b, sk: s.sk }, { w: keyOfPeer(pw), b: keyOfPeer(pb) }, now);
    const writes: Record<string, unknown> = {};
    let refuse = g.wk === g.bk;                     // one person on both sides: not a game
    const debits: Array<{ address: string; bal: Balance }> = [];
    if (s.sk > 0 && !refuse) {
      // The stake must be one the players offered (the host's seek), and both must be able to cover it.
      const offered = [pw, pb].some((p) => !!p.ls && p.ls.tb === tb && p.ls.stake === s.sk && now - p.ls.at < SEEK_FRESH_MS);
      const [bw, bb] = [await this.balanceOf(g.wk), await this.balanceOf(g.bk)];
      if (!offered || !bw || !bb || bw.v < s.sk || bb.v < s.sk) refuse = true;
      else {
        g.held = true;
        const nw = creditBalance(bw, -s.sk), nb = creditBalance(bb, -s.sk);
        writes[BALANCE_PREFIX + g.wk] = nw; writes[BALANCE_PREFIX + g.bk] = nb;
        debits.push({ address: g.w, bal: nw }, { address: g.b, bal: nb });
      }
    }
    if (refuse) {
      g.closes = now;                                 // no betting on a game that never started
      await this.finish(conns, g, { r: '*', tm: 'no-stake', how: 'void' }, now, false);
      return;
    }
    writes[GAME_PREFIX + g.gid] = g; writes[TABLE_PREFIX + tb] = g.gid; writes[USER_PREFIX + g.wk] = g.gid; writes[USER_PREFIX + g.bk] = g.gid;
    await this.store.put(writes);
    for (const d2 of debits) this.bal(conns, d2.address, d2.bal, 'chess-stake', now);
    this.opts.count?.('cg');
  }

  // ---------------------------------------------------------------- result reports

  async onReport(conns: Conn[], me: Conn, msg: Extract<ChessMessage, { t: 'cres' }>, now: number) {
    if (!me.peer.a) { me.send({ t: 'err', code: 'cres-sign-in-first' }); return; }
    const lim = takeLimit(me.peer.cr, now, 0, 20, 60_000); me.peer.cr = lim.list;
    if (!lim.ok) { me.send({ t: 'err', code: 'cres-too-fast' }); return; }
    const g = await this.game(msg.gid);
    if (!g || g.tb !== msg.tb) return;
    const c = colorOf(g, me.peer.a, keyOfPeer(me.peer));
    if (!c) return;
    if (g.end) { me.send(cendOf(g)); return; }       // a page that missed the end (or re-sent after it) is told again
    if (setReport(g, c, msg, now)) {
      let v = judge(g);
      if (v.act === 'ask') { g.asked = true; g.waitUntil = now + 60_000; }
      if (v.act !== 'end') await this.store.put({ [GAME_PREFIX + g.gid]: g });
      if (v.act === 'ask') this.tellAddress(conns, addressOf(g, v.of), { t: 'cres', tb: g.tb, gid: g.gid, ask: true });
      if (v.act === 'end') await this.finish(conns, g, v.end, now);
    }
  }

  // ---------------------------------------------------------------- bets

  async onBet(conns: Conn[], me: Conn, msg: Extract<ChessMessage, { t: 'cbet' }>, now: number) {
    const err = (e: string) => me.send({ t: 'cbet', tb: msg.tb, gid: msg.gid, err: e });
    const asking = 'ask' in msg;
    if (!me.peer.a && !asking) { me.send({ t: 'err', code: 'cbet-sign-in-first' }); return; }       // a guest may look at the pool, not bet
    const lim = asking ? takeLimit(me.peer.ca, now, 2000, 10, 60_000) : takeLimit(me.peer.cq, now, 300, 20, 10_000);
    if (asking) me.peer.ca = lim.list; else me.peer.cq = lim.list;
    if (!lim.ok) { if (asking) me.send({ t: 'err', code: 'cbet-too-fast' }); else err('slow'); return; }
    const g = await this.game(msg.gid);
    if (!g || g.tb !== msg.tb) { if (!asking) err('closed'); return; }
    const who = me.peer.a ? keyOfPeer(me.peer) : '';
    if (asking) {
      this.flushPool(conns, g, now);
      me.send(this.poolMsg(g));
      const mine = who ? g.bets[who] : undefined;
      if (mine) me.send({ t: 'cbet', tb: g.tb, gid: g.gid, ok: true, side: mine.side, amt: mine.amt, pool: pools(g), closes: g.closes });
      return;
    }
    if (!this.opts.betsOn()) { err('off'); return; }
    if (tableOf(me.peer) !== g.tb) { err('not-here'); return; }
    const address = me.peer.a as string;
    const bal = await this.balanceOf(who);
    const e = betError(g, who, address, msg.side, msg.amt, bal ? bal.v : null, now);
    if (e) { err(e); return; }
    const total = addBet(g, who, address, msg.side, msg.amt);
    const next = creditBalance(bal, -msg.amt);
    await this.store.put({ [GAME_PREFIX + g.gid]: g, [BALANCE_PREFIX + who]: next });
    this.bal(conns, address, next, 'cbet', now);
    me.send({ t: 'cbet', tb: g.tb, gid: g.gid, ok: true, side: msg.side, amt: total, pool: pools(g), closes: g.closes });
    this.flushPool(conns, g, now, true);
  }

  // ---------------------------------------------------------------- leaving and coming back

  /** A connection closed. `conns` are the ones that remain. Only a player's last connection counts as leaving. */
  async onGone(conns: Conn[], peer: Peer, now: number) {
    if (!peer.a || conns.some((c) => c.peer.a === peer.a)) return;
    const key = keyOfPeer(peer), gid = await this.store.get<string>(USER_PREFIX + key);
    if (!gid) return;
    const g = await this.game(gid);
    if (!g || g.end) return;
    const c = colorOf(g, peer.a, key);
    if (!c) return;
    const until = markGone(g, c, now);
    if (until === null) return;
    await this.store.put({ [GAME_PREFIX + g.gid]: g });
    const msg = { t: 'cgone', tb: g.tb, gid: g.gid, a: peer.a, until };
    for (const x of this.audience(conns, g)) x.send(msg);
  }

  /** A new connection of a signed-in player: told how their game ended if it ended while they were away, or welcomed back into it. */
  async onConnect(conns: Conn[], me: Conn, now: number) {
    if (!me.peer.a) return;
    const key = keyOfPeer(me.peer), gid = await this.store.get<string>(USER_PREFIX + key);
    if (!gid) return;
    const g = await this.game(gid);
    if (!g) { await this.store.delete([USER_PREFIX + key]); return; }
    if (g.end) { me.send(cendOf(g)); await this.store.delete([USER_PREFIX + key]); return; }
    const c = colorOf(g, me.peer.a, key);
    if (c && markBack(g, c)) {
      await this.store.put({ [GAME_PREFIX + g.gid]: g });
      const msg = { t: 'cgone', tb: g.tb, gid: g.gid, a: me.peer.a, back: true };
      for (const x of this.audience(conns, g)) x.send(msg);
    }
  }

  // ---------------------------------------------------------------- deadlines

  async tickTable(conns: Conn[], tb: ChessTable, now: number) {
    const gid = await this.store.get<string>(TABLE_PREFIX + tb);
    if (!gid) return;
    const g = await this.game(gid);
    if (!g) { await this.store.delete([TABLE_PREFIX + tb]); return; }
    if (g.end) { await this.store.delete([TABLE_PREFIX + tb]); return; }
    const v = due(g, now);
    if (v.act === 'end') await this.finish(conns, g, v.end, now);
    else this.flushPool(conns, g, now);
  }

  /** What falls due by `now`; called when someone connects, sends a chess message, or the once-a-minute check runs. */
  async tick(conns: Conn[], now: number) {
    for (const tb of CHESS_TABLES) await this.tickTable(conns, tb, now);
    await this.clean(conns, now);
  }

  /** Once an hour at most: removes games finished more than a week ago, and settles any that somehow never finished. */
  private async clean(conns: Conn[], now: number) {
    if (now - this.cleaned < 3_600_000) return;
    this.cleaned = now;
    const all = await this.store.list<Game>({ prefix: GAME_PREFIX, limit: 100 });
    const drop: string[] = [];
    for (const [key, g] of all) {
      if (!g.end) { if (now - g.t0 > 2 * 60 * 60_000) await this.finish(conns, g, { r: '*', tm: 'expired', how: 'expired' }, now); continue; }
      if (now - g.end.at > KEEP_MS) drop.push(key);
    }
    if (drop.length) await this.store.delete(drop);
  }

  // ---------------------------------------------------------------- the end

  /**
   * Ends a game: pays every stake and bet back or out (one write, so never half-paid), tells the players, the table and the
   * bettors. Does nothing if the game is already settled, so a repeated call can never pay twice.
   */
  async finish(conns: Conn[], g: Game, end0: Omit<End, 'at'>, now: number, pointers = true) {
    if (g.settled) return;
    const end: End = { ...end0, at: now };
    g.end = end; g.settled = true;
    const s = settlement(g, end);
    const writes: Record<string, unknown> = { [GAME_PREFIX + g.gid]: g };
    const paid = new Map<string, { address: string; bal: Balance; why: string }>();
    for (const c of s.credits) {
      const cur = paid.get(c.who)?.bal || (await this.balanceOf(c.who));
      const bal = creditBalance(cur, c.amt);
      paid.set(c.who, { address: c.a, bal, why: c.why });
      writes[BALANCE_PREFIX + c.who] = bal;
    }
    await this.store.put(writes);
    const gone: string[] = [];
    if (pointers) {
      gone.push(TABLE_PREFIX + g.tb);
      for (const c of ['w', 'b'] as Color[]) {
        const key = keyOf(g, c);
        if (conns.some((x) => x.peer.a === addressOf(g, c)) && (await this.store.get<string>(USER_PREFIX + key)) === g.gid) gone.push(USER_PREFIX + key);
      }
    }
    if (gone.length) await this.store.delete(gone);
    // Money first (the pages apply it through the usual balance path), then the news that explains it.
    for (const p of paid.values()) this.bal(conns, p.address, p.bal, p.why, now);
    const cend = cendOf(g);
    for (const x of this.audience(conns, g)) x.send(cend);
    for (const p of s.cpays) this.tellAddress(conns, p.a, { t: 'cpay', tb: g.tb, gid: g.gid, side: p.side, stake: p.stake, won: p.won, how: p.how });
    if (end.how === 'disputed') this.opts.count?.('cd');
    this.poolState.delete(g.gid);
  }
}

