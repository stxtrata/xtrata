/**
 * Chess results, stakes and spectator bets (docs/plans/CASINO-CHESS-BETTING-PLAN.md; the build prompt is claude/casino-notes-and-betting-build-prompt.md,
 * Part A; the message shapes are claude/chess-betting-messages.md, with the room's answers in claude/chess-betting-room-answers.md).
 *
 * Pure rules, no Cloudflare types and no storage: the room's Durable Object (through casino-chess-room.ts) loads a game record,
 * calls these, and writes the result back in one put.
 *
 * What the room does and does not know. The two pages run a chess game and check each other's moves; the room never reads a move.
 * Each page reports what its own copy says (`cres`) and the room compares the reports. The room only holds play money: the players'
 * stakes and the spectators' bets leave their balances when they are placed and come back (or not) when the game ends. Balances
 * are an honour system until LAYR is on-chain (the browser reports its own changes), so all this keeps honest pages straight; it
 * does not stop a page that edits its own balance.
 *
 * The balance layer is the swap point for on-chain LAYR later: the rules below only ever say "hold", "pay" or "refund" and never
 * touch a balance themselves.
 */
import { MAX_SEEK_STAKE, addressLike, isChessTable, isGid, type ChessTable } from './casino-social';

/** What the room lists in `features` for chess. `cres`: agreed results, the leaving rule and the stakes the room holds. `cbet`: spectator bets. */
export const CHESS_FEATURES = ['cres', 'cbet'] as const;

// ------------------------------------------------------------------ constants

export const BET_MIN = 100;
export const BET_MAX = 10_000;
export const BET_BETTORS = 30;
/** Betting closes this long after the room first sees the game. */
export const BET_WINDOW_MS = 90_000;
/** House cut, in percent of the pool. One constant; 0 for now. */
export const BET_CUT_PERCENT = 0;
/** A single report waits this long for the other page before it stands (or the game is voided). */
export const WAIT_MS = 60_000;
/** A player who has left the room has this long to come back before it counts as resigning. */
export const GRACE_MS = 90_000;
/** A game with no result this long after it began is called off and everything is refunded. */
export const GAME_MAX_MS = 90 * 60_000;
/** Finished games are kept this long (so a player who comes back is told how it ended), then removed. */
export const KEEP_MS = 7 * 86_400_000;
/** A pool update goes to the table at most this often. */
export const POOL_GAP_MS = 2_000;
/** The stake in a game must match a seek the players made within this long. */
export const SEEK_FRESH_MS = 2 * 60 * 60_000;

export const RESULTS = ['1-0', '0-1', '1/2-1/2', '*'] as const;
export type Result = (typeof RESULTS)[number];
export const WAYS = ['checkmate', 'stalemate', 'repetition', 'fifty-move', 'insufficient-material', 'resignation', 'agreement', 'timeout', 'dispute'] as const;
export type Way = (typeof WAYS)[number];
export type Color = 'w' | 'b';
export type How = 'agreed' | 'unchallenged' | 'forfeit' | 'disputed' | 'expired' | 'void';

// ------------------------------------------------------------------ messages a page may send

export type ChessMessage =
  | { t: 'cres'; tb: ChessTable; gid: string; r: Result; tm: Way | 'none'; n: number; h: string }
  | { t: 'cbet'; tb: ChessTable; gid: string; side: Color; amt: number }
  | { t: 'cbet'; tb: ChessTable; gid: string; ask: true };

const HEX16 = /^[0-9a-f]{16}$/;

/** Parses `cres` and `cbet` (the room's other messages are casino-room.ts's and casino-social.ts's). Null: not one of these. */
export const parseChessMessage = (value: any): { ok: true; msg: ChessMessage } | { ok: false; code: string } | null => {
  switch (value?.t) {
    case 'cres': {
      if (!isChessTable(value.tb) || !isGid(value.gid)) return { ok: false, code: 'cres-bad' };
      if (!(RESULTS as readonly string[]).includes(value.r)) return { ok: false, code: 'cres-bad' };
      const star = value.r === '*';
      // `*` ("my copy has no result") may leave the rest out; a real result needs how it ended, the move count and the move hash.
      const tm = star && value.tm === undefined ? 'none' : value.tm;
      if (tm !== 'none' && !(WAYS as readonly string[]).includes(tm)) return { ok: false, code: 'cres-bad' };
      const n = star && value.n === undefined ? 0 : value.n;
      if (!Number.isSafeInteger(n) || n < 0 || n > 2000) return { ok: false, code: 'cres-bad' };
      const h = star && value.h === undefined ? '0'.repeat(16) : value.h;
      if (typeof h !== 'string' || !HEX16.test(h)) return { ok: false, code: 'cres-bad' };
      return { ok: true, msg: { t: 'cres', tb: value.tb, gid: value.gid, r: value.r, tm, n, h } };
    }
    case 'cbet': {
      if (!isChessTable(value.tb) || !isGid(value.gid)) return { ok: false, code: 'cbet-bad' };
      if (value.ask === true) return { ok: true, msg: { t: 'cbet', tb: value.tb, gid: value.gid, ask: true } };
      if (value.side !== 'w' && value.side !== 'b') return { ok: false, code: 'cbet-bad' };
      if (!Number.isSafeInteger(value.amt) || value.amt <= 0 || value.amt > 1_000_000) return { ok: false, code: 'cbet-bad' };
      return { ok: true, msg: { t: 'cbet', tb: value.tb, gid: value.gid, side: value.side, amt: value.amt } };
    }
    default: return null;
  }
};

// ------------------------------------------------------------------ the game record

export type Report = { r: Result; tm: Way | 'none'; n: number; h: string; at: number };
export type Bet = { a: string; side: Color; amt: number };
export type End = { r: Result; tm: string; how: How; a?: string; at: number };

/**
 * One chess game the room is tracking, stored under `cg:<gid>` (about 100 bytes plus about 60 per bettor). `wk` and `bk` are the
 * keys the players' balances are kept under; `bets` is keyed the same way (a spectator is one bettor however many addresses of
 * theirs are signed in).
 */
export type Game = {
  v: 1; gid: string; tb: ChessTable;
  w: string; b: string; wk: string; bk: string;
  sk: number; held: boolean;
  t0: number; closes: number;
  bets: Record<string, Bet>;
  rep: { w?: Report; b?: Report };
  asked?: boolean; waitUntil?: number;
  gone: { w?: number; b?: number };
  end?: End; settled?: boolean;
};

export const newGame = (s: { gid: string; tb: ChessTable; w: string; b: string; sk: number }, keys: { w: string; b: string }, now: number): Game => ({
  v: 1, gid: s.gid, tb: s.tb, w: s.w, b: s.b, wk: keys.w, bk: keys.b, sk: s.sk, held: false,
  t0: now, closes: now + BET_WINDOW_MS, bets: {}, rep: {}, gone: {}
});

/** The colour an address (or balance key) plays in a game, or null. */
export const colorOf = (g: Game, address: string | null, key?: string | null): Color | null =>
  address && address === g.w ? 'w' : address && address === g.b ? 'b' : key && key === g.wk ? 'w' : key && key === g.bk ? 'b' : null;
export const otherColor = (c: Color): Color => (c === 'w' ? 'b' : 'w');
export const addressOf = (g: Game, c: Color) => (c === 'w' ? g.w : g.b);
export const keyOf = (g: Game, c: Color) => (c === 'w' ? g.wk : g.bk);

export const pools = (g: Game) => {
  const p = { w: 0, b: 0 };
  for (const bet of Object.values(g.bets)) p[bet.side] += bet.amt;
  return p;
};
export const bettorCount = (g: Game) => Object.keys(g.bets).length;
export const bettingOpen = (g: Game, now: number) => !g.end && now < g.closes;

// ------------------------------------------------------------------ a snapshot starts a game

/**
 * What the room reads from a host's `spec` snapshot to start a game: the game id, the two players and the stake. A snapshot without
 * a valid `gid` (an older page, or a game against a house player) starts nothing. A snapshot that already carries a result never
 * starts one either (a host that reloads after the game ended must not reopen betting).
 */
export const readSnapshot = (d: unknown): { gid: string; w: string; b: string; sk: number; over: boolean } | null => {
  if (!d || typeof d !== 'object') return null;
  const o = d as Record<string, unknown>;
  if (!isGid(o.gid) || !addressLike(o.w) || !addressLike(o.b) || o.w === o.b) return null;
  const sk = o.sk === undefined ? 0 : o.sk;
  if (typeof sk !== 'number' || !Number.isSafeInteger(sk) || sk < 0 || sk > MAX_SEEK_STAKE) return null;
  const over = typeof o.r === 'string' && o.r !== '' && o.r !== '*';
  return { gid: o.gid as string, w: o.w as string, b: o.b as string, sk, over };
};

// ------------------------------------------------------------------ bets

export type BetError = 'closed' | 'self' | 'side' | 'min' | 'max' | 'full' | 'funds';

/** Why a bet of `amt` on `side` is refused, or null. `who` is the bettor's balance key, `a` their address, `balance` what the room has for them. */
export const betError = (g: Game, who: string, a: string, side: Color, amt: number, balance: number | null, now: number): BetError | null => {
  if (!bettingOpen(g, now)) return 'closed';
  if (who === g.wk || who === g.bk || a === g.w || a === g.b) return 'self';
  const mine = g.bets[who];
  if (mine && mine.side !== side) return 'side';
  if (amt < BET_MIN) return 'min';
  if ((mine ? mine.amt : 0) + amt > BET_MAX) return 'max';
  if (!mine && bettorCount(g) >= BET_BETTORS) return 'full';
  if (balance === null || balance < amt) return 'funds';
  return null;
};

/** Adds `amt` to the bettor's bet (after betError said it is fine). Returns their total on that side. */
export const addBet = (g: Game, who: string, a: string, side: Color, amt: number): number => {
  const mine = g.bets[who];
  g.bets[who] = { a, side, amt: (mine ? mine.amt : 0) + amt };
  return g.bets[who].amt;
};

// ------------------------------------------------------------------ result reports

export type Verdict =
  | { act: 'none' }
  | { act: 'ask'; of: Color }
  | { act: 'end'; end: Omit<End, 'at'> };

const ending = (r: Result, tm: string, how: How, a?: string): Verdict => ({ act: 'end', end: { r, tm, how, ...(a ? { a } : {}) } });
const winnerOf = (r: Result): Color | null => (r === '1-0' ? 'w' : r === '0-1' ? 'b' : null);

/**
 * What the reports so far say. Both match: settle. They differ, or either says `dispute`: void and count a dispute. One report:
 * a resignation reported by the player who resigned stands at once (it is against their interest); anything else asks the other
 * page (once) and waits WAIT_MS (see afterWait).
 */
export const judge = (g: Game): Verdict => {
  const rw = g.rep.w, rb = g.rep.b;
  if ((rw && rw.tm === 'dispute') || (rb && rb.tm === 'dispute')) return ending('*', 'dispute', 'disputed');
  if (rw && rb) return rw.r === rb.r && rw.h === rb.h && rw.r !== '*' ? ending(rw.r, rw.tm, 'agreed') : ending('*', 'dispute', 'disputed');
  const only = rw || rb;
  if (!only) return { act: 'none' };
  const who: Color = rw ? 'w' : 'b';
  if (only.tm === 'resignation' && winnerOf(only.r) === otherColor(who)) return ending(only.r, 'resignation', 'unchallenged');
  return g.asked ? { act: 'none' } : { act: 'ask', of: otherColor(who) };
};

/** After the wait with only one report: it stands if it came from the winner, or says draw; otherwise the game is called off. */
const afterWait = (g: Game): Verdict => {
  const only = g.rep.w || g.rep.b;
  if (!only) return { act: 'none' };
  const who: Color = g.rep.w ? 'w' : 'b';
  if (only.r === '1/2-1/2' || winnerOf(only.r) === who) return ending(only.r, only.tm, 'unchallenged');
  return ending('*', 'expired', 'expired');
};

/** Stores a page's report (replacing its earlier one). Returns false when it is the same as the one already held. */
export const setReport = (g: Game, c: Color, m: { r: Result; tm: Way | 'none'; n: number; h: string }, now: number): boolean => {
  const old = g.rep[c];
  if (old && old.r === m.r && old.tm === m.tm && old.n === m.n && old.h === m.h) return false;
  g.rep[c] = { r: m.r, tm: m.tm, n: m.n, h: m.h, at: now };
  return true;
};

// ------------------------------------------------------------------ leaving

/** The player's last connection closed. Returns the time the grace ends, or null when it was already running. */
export const markGone = (g: Game, c: Color, now: number): number | null => {
  if (g.end || g.gone[c] !== undefined) return null;
  g.gone[c] = now + GRACE_MS;
  return g.gone[c]!;
};
export const markBack = (g: Game, c: Color): boolean => {
  if (g.gone[c] === undefined) return false;
  delete g.gone[c];
  return true;
};

// ------------------------------------------------------------------ deadlines (checked when someone next touches the room)

/**
 * What has fallen due by `now`, if anything: the game is too old, the wait for the other page's report is over, or a player's
 * grace is over. Nothing here sets a timer; the Durable Object calls this when someone connects, sends or the once-a-minute check
 * runs. A player who left and has already filed a report is not forfeited (the report path settles it); if both players have gone,
 * the game is called off rather than given to whoever left last.
 */
export const due = (g: Game, now: number): Verdict => {
  if (g.end) return { act: 'none' };
  if (now >= g.t0 + GAME_MAX_MS) return ending('*', 'expired', 'expired');
  if (g.waitUntil !== undefined && now >= g.waitUntil && (g.rep.w || g.rep.b)) {
    const v = judge(g);
    return v.act === 'end' ? v : afterWait(g);
  }
  const overdue = (c: Color) => g.gone[c] !== undefined && now >= g.gone[c]! && !g.rep[c];
  const wDue = overdue('w'), bDue = overdue('b');
  if (wDue || bDue) {
    if (g.gone.w !== undefined && g.gone.b !== undefined) return ending('*', 'abandoned', 'void');
    const leaver: Color = wDue ? 'w' : 'b';
    return ending(leaver === 'w' ? '0-1' : '1-0', 'resignation', 'forfeit', addressOf(g, leaver));
  }
  return { act: 'none' };
};

// ------------------------------------------------------------------ paying out

export type Credit = { who: string; a: string; amt: number; why: 'chess-win' | 'chess-refund' | 'cbet-win' | 'cbet-refund' };
export type Cpay = { who: string; a: string; side: Color; stake: number; won: number; how: 'result' | 'refund' };
export type Settlement = { credits: Credit[]; cpays: Cpay[]; held: number; paid: number; kept: number };

/** The side the bets are paid on, or null when everyone is refunded (draw, called off, disputed, or nobody backed the winner). */
export const payingSide = (g: Game, end: Pick<End, 'r' | 'how'>): Color | null => {
  if (end.how === 'disputed' || end.how === 'expired' || end.how === 'void') return null;
  const side = winnerOf(end.r);
  if (!side) return null;
  return pools(g)[side] > 0 ? side : null;
};

/**
 * Who gets what when the game ends. A decisive result gives the winner both stakes; anything else returns each player's own. Bets
 * are parimutuel: the whole pool (less BET_CUT_PERCENT) is shared among the backers of the winning side in proportion to their
 * stakes, rounded down to whole LAYR; the remainder stays with the house (`kept`). If nobody backed the winner, or the result is
 * a draw or the game was called off, every bet comes back. Always `paid + kept === held`.
 */
export const settlement = (g: Game, end: Pick<End, 'r' | 'how'>): Settlement => {
  const credits: Credit[] = [], cpays: Cpay[] = [];
  let held = 0, paid = 0;
  if (g.held && g.sk > 0) {
    held += 2 * g.sk;
    const off = end.how === 'disputed' || end.how === 'expired' || end.how === 'void';
    const win = off ? null : winnerOf(end.r);
    if (win) { credits.push({ who: keyOf(g, win), a: addressOf(g, win), amt: 2 * g.sk, why: 'chess-win' }); paid += 2 * g.sk; }
    else for (const c of ['w', 'b'] as const) { credits.push({ who: keyOf(g, c), a: addressOf(g, c), amt: g.sk, why: 'chess-refund' }); paid += g.sk; }
  }
  const p = pools(g), total = p.w + p.b, side = payingSide(g, end);
  held += total;
  if (side) {
    const pot = Math.floor((total * (100 - BET_CUT_PERCENT)) / 100), win = p[side];
    for (const [who, bet] of Object.entries(g.bets)) {
      const won = bet.side === side ? Math.floor((pot * bet.amt) / win) : 0;
      if (won > 0) { credits.push({ who, a: bet.a, amt: won, why: 'cbet-win' }); paid += won; }
      cpays.push({ who, a: bet.a, side: bet.side, stake: bet.amt, won, how: 'result' });
    }
  } else {
    for (const [who, bet] of Object.entries(g.bets)) {
      credits.push({ who, a: bet.a, amt: bet.amt, why: 'cbet-refund' }); paid += bet.amt;
      cpays.push({ who, a: bet.a, side: bet.side, stake: bet.amt, won: bet.amt, how: 'refund' });
    }
  }
  return { credits, cpays, held, paid, kept: held - paid };
};
