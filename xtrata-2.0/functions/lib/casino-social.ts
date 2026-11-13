/**
 * The casino room's social layer (docs/plans/CASINO-PLAY-TOGETHER-PLAN.md): reactions, big wins, the daily drop, table chat and
 * watching a table, shared rounds, drinks for other people, and a relay for two players at a Salon table. Pure (no Cloudflare
 * types) like casino-room.ts, which owns the peers; the Durable Object (workers/casino-room) is the thin shell that calls these.
 *
 * Nothing here moves money. LAYR chips are play money kept in each player's browser, so a daily drop, a gift or a shared round
 * tells the player's own page what to credit or charge; the room only decides who may do what, when, and who hears about it.
 */
import { ALL_MACHINES } from './casino-machines';
import { cleanBets, isRoundTable, betsOpen, roundAt, type Bets, type RoundTable } from './casino-rounds';

/** Features the room offers on top of casino-room's ROOM_FEATURES (the client only uses what the room lists). */
/** `react-more`: the room also takes the later reactions (heart, dance, bow); a page offers them only to a room that lists it. */
export const SOCIAL_FEATURES = ['react', 'win', 'daily', 'table', 'rounds', 'gift', 'pvp', 'spec', 'react-more'] as const;

// ------------------------------------------------------------------ the extra things a connection carries

/**
 * Social fields on a peer (all optional, so a connection saved before they existed still works): `wt` the table the player is at
 * or watching, `rb` their bets on the current shared round, `sk` a Salon game they are waiting for, and recent times for the
 * reaction, win, gift and relay limits.
 */
export type SocialPeer = {
  id: string; a: string | null; spot: string | null; b: string[]; w?: boolean;
  wt?: string | null;
  rb?: { tb: RoundTable; n: number; bets: Bets } | null;
  sk?: { tb: GameTable; stake: number; at: number } | null;
  rx?: number[]; wn?: number[]; gl?: number[]; pv?: number[];
  /** Recent times for the chess spectator limits: snapshots sent (`sp`) and asks (`sa`). */
  sp?: number[]; sa?: number[];
  /** Chess results and bets (casino-bets.ts): recent times for `cres`, `cbet` and `cbet ask`, and the last seek (table, stake, time),
   *  which a game's stake is checked against. */
  cq?: number[]; cr?: number[]; ca?: number[];
  ls?: { tb: string; stake: number; at: number } | null;
  /** The Salon's rule: the primary BNS name read at sign-in, and whether it was checked (see salonRefusal). */
  bn?: string | null; bc?: boolean;
};

/**
 * The Salon (the player-versus-player room: Hold'em and Liar's Dice) is for players with a primary BNS name
 * (docs/plans/CASINO-SALON-BNS-PLAN.md). The name is read at sign-in by the Pages Function and arrives with the connection.
 * Returns why a player may not play there, or null when they may. "Not checked" (the lookup failed) is its own answer.
 */
export const salonRefusal = (peer: { a: string | null; bn?: string | null; bc?: boolean }): string | null =>
  !peer.a ? 'salon-sign-in-first' : peer.bc !== true ? 'salon-bns-unchecked' : !peer.bn ? 'salon-bns-required' : null;
/** The Salon's seats (functions/lib/casino-room.ts SPOTS). */
export const isSalonSpot = (spot: string) => /^(pvpholdem|liars)\./.test(spot);
/** The Salon's floor, behind the arch in the back wall (public/casino/index.html, room.salon): x -11.2 to -0.8, z beyond -11. */
export const SALON_AREA = { x0: -11.4, x1: -0.6, z: -11.05 } as const;
export const isInSalon = (x: number, z: number) => z < SALON_AREA.z && x > SALON_AREA.x0 && x < SALON_AREA.x1;

const seen = (peer: { a: string | null; w?: boolean }) => !!peer.a || peer.w !== false;
const blockedBy = (peers: SocialPeer[], holder: string, other: string) =>
  peers.some((p) => p.a === holder && Array.isArray(p.b) && p.b.includes(other));
const hidden = (peers: SocialPeer[], one: string, two: string) => blockedBy(peers, one, two) || blockedBy(peers, two, one);
const short = (a: string) => (a.length <= 12 ? a : `${a.slice(0, 5)}…${a.slice(-4)}`);

/** Keeps the times in `list` from the last `windowMs`, and adds `now` when there is room under `max` with `gap` since the last. */
export const takeLimit = (list: number[] | undefined, now: number, gap: number, max: number, windowMs = 60_000) => {
  const recent = (Array.isArray(list) ? list : []).filter((t) => now - t < windowMs);
  const last = recent[recent.length - 1];
  if ((last !== undefined && now - last < gap) || recent.length >= max) return { ok: false as const, list: recent };
  recent.push(now);
  return { ok: true as const, list: recent };
};

/** The table a spot belongs to ('blackjack.2' -> 'blackjack'); machines and the bar are not tables. */
export const TABLES = ['blackjack', 'baccarat', 'sicbo', 'holdem', 'roulette', 'videopoker', 'pvpholdem', 'liars', 'chess1', 'chess2'] as const;   // holdem: older pages
export const isTable = (value: unknown): value is string => typeof value === 'string' && (TABLES as readonly string[]).includes(value);
export const tableOf = (peer: Pick<SocialPeer, 'spot' | 'wt'>): string | null => {
  const fromSpot = peer.spot ? peer.spot.split('.')[0] : null;
  if (fromSpot && isTable(fromSpot)) return fromSpot;
  return peer.wt && isTable(peer.wt) ? peer.wt : null;
};

// ------------------------------------------------------------------ messages a client may send

export const REACTIONS = ['wave', 'cheer', 'clap', 'thumbs', 'laugh', 'wow', 'nooo', 'glass', 'heart', 'dance', 'bow'] as const;
export type Reaction = (typeof REACTIONS)[number];
export const DRINKS = ['champagne', 'cocktail', 'whisky', 'beer', 'espresso', 'water'] as const;
export type Drink = (typeof DRINKS)[number];
export const SALON_TABLES = ['pvpholdem', 'liars'] as const;
export type SalonTable = (typeof SALON_TABLES)[number];
/**
 * The chess tables at the two lounge sofas in the main room (public/casino/chess.js, docs/plans/CASINO-CHESS-PLAN.md). Players wait
 * for a game and relay their moves exactly as at the Salon tables, but the main room is open to everyone: signing in is enough, no
 * BNS name. A chess game may be a friendly (stake 0).
 */
export const CHESS_TABLES = ['chess1', 'chess2'] as const;
export type ChessTable = (typeof CHESS_TABLES)[number];
export const isChessTable = (value: unknown): value is ChessTable => typeof value === 'string' && (CHESS_TABLES as readonly string[]).includes(value);
/** Every table where two players can wait for each other and relay a game. */
export type GameTable = SalonTable | ChessTable;

/** A big win is announced only if it is at least this many times the bet, or at least this much (the page also checks). */
export const WIN_MIN_MULT = 10;
export const WIN_MIN_AMOUNT = 50_000;
export const WIN_FEED = 8;
/** One relay message between two Salon players (their game moves): small, so the room is never a file transfer. */
export const MAX_RELAY_BYTES = 1500;
export const MAX_SEEK_STAKE = 1_000_000;

export type SocialMessage =
  | { t: 'react'; e: Reaction; to: string | null }
  | { t: 'win'; g: string; x: number; w: number }
  | { t: 'daily' }
  | { t: 'watch'; tb: string | null }
  | { t: 'round'; tb: RoundTable }
  | { t: 'bet'; tb: RoundTable; n: number; bets: Bets }
  | { t: 'gift'; to: string; d: Drink }
  | { t: 'seek'; tb: GameTable; stake: number }
  | { t: 'seek'; off: true }
  | { t: 'pvp'; to: string; d: unknown }
  | { t: 'spec'; tb: ChessTable; d: unknown }
  | { t: 'spec'; tb: ChessTable; ask: true };

export const addressLike = (v: unknown): v is string => typeof v === 'string' && /^S[0-9A-Z]{4,63}$/.test(v);
/** A chess game's id: 16 lowercase hex characters, chosen by the host at `create` so both pages and the room share it. */
export const isGid = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{16}$/.test(v);
/** What a player may name as a game in a win: a table, or a machine's short id. */
const GAMES = new Set<string>([...TABLES, ...ALL_MACHINES]);

/** Parses the social messages (the room's other messages are casino-room.ts's). Null: not one of these. */
export const parseSocialMessage = (value: any): { ok: true; msg: SocialMessage } | { ok: false; code: string } | null => {
  switch (value?.t) {
    case 'react': {
      if (!(REACTIONS as readonly string[]).includes(value.e)) return { ok: false, code: 'react-bad' };
      if (value.to !== undefined && value.to !== null && !addressLike(value.to)) return { ok: false, code: 'react-bad' };
      return { ok: true, msg: { t: 'react', e: value.e, to: value.to ?? null } };
    }
    case 'win': {
      const x = value.x, w = value.w;
      if (!GAMES.has(value.g) || typeof x !== 'number' || !Number.isFinite(x) || x < 0 || x > 1_000_000) return { ok: false, code: 'win-bad' };
      if (!Number.isSafeInteger(w) || w <= 0 || w > 1_000_000_000) return { ok: false, code: 'win-bad' };
      if (x < WIN_MIN_MULT && w < WIN_MIN_AMOUNT) return { ok: false, code: 'win-small' };
      return { ok: true, msg: { t: 'win', g: value.g, x: Math.round(x * 100) / 100, w } };
    }
    case 'daily': return { ok: true, msg: { t: 'daily' } };
    case 'watch': {
      if (value.tb === null || value.tb === undefined) return { ok: true, msg: { t: 'watch', tb: null } };
      return isTable(value.tb) ? { ok: true, msg: { t: 'watch', tb: value.tb } } : { ok: false, code: 'table-bad' };
    }
    case 'round':
      return isRoundTable(value.tb) ? { ok: true, msg: { t: 'round', tb: value.tb } } : { ok: false, code: 'round-bad' };
    case 'bet': {
      if (!isRoundTable(value.tb) || !Number.isSafeInteger(value.n)) return { ok: false, code: 'round-bad' };
      const bets = cleanBets(value.tb, value.bets);
      return bets ? { ok: true, msg: { t: 'bet', tb: value.tb, n: value.n, bets } } : { ok: false, code: 'round-bad-bets' };
    }
    case 'gift': {
      if (!(DRINKS as readonly string[]).includes(value.d)) return { ok: false, code: 'gift-bad' };
      if (value.to !== 'table' && !addressLike(value.to)) return { ok: false, code: 'gift-bad' };
      return { ok: true, msg: { t: 'gift', to: value.to, d: value.d } };
    }
    case 'seek': {
      if (value.off === true) return { ok: true, msg: { t: 'seek', off: true } };
      const chess = isChessTable(value.tb);
      if (!chess && !(SALON_TABLES as readonly string[]).includes(value.tb)) return { ok: false, code: 'pvp-bad' };
      if (!Number.isSafeInteger(value.stake) || value.stake < (chess ? 0 : 1) || value.stake > MAX_SEEK_STAKE) return { ok: false, code: 'pvp-bad' };
      return { ok: true, msg: { t: 'seek', tb: value.tb, stake: value.stake } };
    }
    case 'pvp': {
      if (!addressLike(value.to) || value.d === undefined) return { ok: false, code: 'pvp-bad' };
      let size = 0;
      try { size = new TextEncoder().encode(JSON.stringify(value.d)).length; } catch { return { ok: false, code: 'pvp-bad' }; }
      if (size > MAX_RELAY_BYTES) return { ok: false, code: 'pvp-too-big' };
      return { ok: true, msg: { t: 'pvp', to: value.to, d: value.d } };
    }
    case 'spec': {
      if (!isChessTable(value.tb)) return { ok: false, code: 'spec-bad' };
      if (value.ask === true) return { ok: true, msg: { t: 'spec', tb: value.tb, ask: true } };
      if (value.d === undefined) return { ok: false, code: 'spec-bad' };
      let size = 0;
      try { size = new TextEncoder().encode(JSON.stringify(value.d)).length; } catch { return { ok: false, code: 'spec-bad' }; }
      if (size > MAX_RELAY_BYTES) return { ok: false, code: 'spec-too-big' };
      return { ok: true, msg: { t: 'spec', tb: value.tb, d: value.d } };
    }
    default: return null;
  }
};

// ------------------------------------------------------------------ routing

export type Out = { to: string[]; message: unknown };
type Result = { ok: true; out: Out[] } | { ok: false; code: string };

/** Reactions: everyone who may see the room, except people who block (or are blocked by) the player. One every 0.8 s, 40 a minute. */
export const routeReact = (peers: SocialPeer[], me: SocialPeer, msg: { e: Reaction; to: string | null }, now: number): Result => {
  if (!me.a) return { ok: false, code: 'react-sign-in-first' };
  const lim = takeLimit(me.rx, now, 800, 40); me.rx = lim.list;
  if (!lim.ok) return { ok: false, code: 'react-too-fast' };
  const from = me.a;
  if (msg.to && !peers.some((p) => p.a === msg.to)) return { ok: false, code: 'react-not-here' };
  const to = peers.filter((p) => seen(p) && (!p.a || p.a === from || !hidden(peers, p.a, from))).map((p) => p.id);
  return { ok: true, out: [{ to, message: { t: 'react', a: from, n: short(from), e: msg.e, to: msg.to, spot: me.spot, at: now } }] };
};

/** A big win: everyone who may see the room hears it (no blocking: it is news, not talk). One every 3 s. */
export const routeWin = (peers: SocialPeer[], me: SocialPeer, msg: { g: string; x: number; w: number }, now: number):
  { ok: true; entry: WinEntry; out: Out[] } | { ok: false; code: string } => {
  if (!me.a) return { ok: false, code: 'win-sign-in-first' };
  const lim = takeLimit(me.wn, now, 3000, 12); me.wn = lim.list;
  if (!lim.ok) return { ok: false, code: 'win-too-fast' };
  const entry: WinEntry = { a: me.a, n: short(me.a), g: msg.g, x: msg.x, w: msg.w, at: now };
  return { ok: true, entry, out: [{ to: peers.filter(seen).map((p) => p.id), message: { t: 'win', ...entry } }] };
};
export type WinEntry = { a: string; n: string; g: string; x: number; w: number; at: number };
/** The win feed the room keeps (newest first): the last few big wins, so a player arriving sees that people win here. */
export const pushWin = (feed: WinEntry[] | undefined, entry: WinEntry): WinEntry[] => [entry, ...(Array.isArray(feed) ? feed : [])].slice(0, WIN_FEED);

/** Table chat: `say` with `ch: 'table'` reaches the people at the speaker's table (sitting there or watching it). */
export const tableAudience = (peers: SocialPeer[], me: SocialPeer): { table: string; ids: string[] } | null => {
  const table = tableOf(me);
  if (!table || !me.a) return null;
  const from = me.a;
  const ids = peers.filter((p) => p.a && tableOf(p) === table && (p.a === from || !hidden(peers, p.a, from))).map((p) => p.id);
  return { table, ids };
};

/** Bets on a shared round: only while that round's bets are open, only signed-in players. Everyone who may see the room is told. */
export const applyBet = (peers: SocialPeer[], me: SocialPeer, msg: { tb: RoundTable; n: number; bets: Bets }, now: number): Result => {
  if (!me.a) return { ok: false, code: 'round-sign-in-first' };
  if (msg.n !== roundAt(msg.tb, now) || !betsOpen(msg.tb, msg.n, now)) return { ok: false, code: 'round-closed' };
  me.rb = Object.keys(msg.bets).length ? { tb: msg.tb, n: msg.n, bets: msg.bets } : null;
  const to = peers.filter((p) => p.id !== me.id && seen(p)).map((p) => p.id);
  return { ok: true, out: [{ to, message: { t: 'bet', tb: msg.tb, n: msg.n, a: me.a, nm: short(me.a), bets: msg.bets, at: now } }] };
};
/** Everyone's bets on the current round of `table` (for a player who just arrived or asked for the round). */
export const currentBets = (peers: SocialPeer[], table: RoundTable, now: number) => {
  const n = roundAt(table, now), seenA = new Set<string>(), out: Array<{ a: string; n: string; bets: Bets }> = [];
  for (const p of peers) {
    if (!p.a || !p.rb || p.rb.tb !== table || p.rb.n !== n || seenA.has(p.a)) continue;
    seenA.add(p.a); out.push({ a: p.a, n: short(p.a), bets: p.rb.bets });
  }
  return out;
};

/**
 * A drink for someone: to one person in the room, or `table` (a round for everyone at the sender's table). The whole room is told
 * (that is the point of buying a round); blocked people are left out of the recipients. One every 3 s, 15 a minute.
 */
export const routeGift = (peers: SocialPeer[], me: SocialPeer, msg: { to: string; d: Drink }, now: number): Result => {
  if (!me.a) return { ok: false, code: 'gift-sign-in-first' };
  const from = me.a;
  let recipients: string[];
  if (msg.to === 'table') {
    const table = tableOf(me);
    if (!table) return { ok: false, code: 'gift-no-table' };
    recipients = [...new Set(peers.filter((p) => p.a && p.a !== from && tableOf(p) === table && !hidden(peers, p.a, from)).map((p) => p.a as string))];
    if (!recipients.length) return { ok: false, code: 'gift-nobody' };
  } else {
    if (msg.to === from) return { ok: false, code: 'gift-not-you' };
    if (!peers.some((p) => p.a === msg.to)) return { ok: false, code: 'gift-not-here' };
    if (hidden(peers, msg.to, from)) return { ok: false, code: 'gift-blocked' };
    recipients = [msg.to];
  }
  const lim = takeLimit(me.gl, now, 3000, 15); me.gl = lim.list;
  if (!lim.ok) return { ok: false, code: 'gift-too-fast' };
  const to = peers.filter(seen).map((p) => p.id);
  return { ok: true, out: [{ to, message: { t: 'gift', a: from, n: short(from), to: recipients, d: msg.d, round: msg.to === 'table', at: now } }] };
};

/** Waiting for a Salon game: everyone who may see the room is told, so somebody can come and sit down. `off` stops waiting. */
export const applySeek = (peers: SocialPeer[], me: SocialPeer, msg: { tb: GameTable; stake: number } | { off: true }, now: number): Result => {
  if (!me.a) return { ok: false, code: 'pvp-sign-in-first' };
  // Waiting for a Salon game needs a primary BNS name; a chess table in the main room only needs signing in. Stopping is always allowed.
  const refused = 'off' in msg || isChessTable(msg.tb) ? null : salonRefusal(me);
  if (refused) return { ok: false, code: refused.replace('salon-', 'pvp-') };
  me.sk = 'off' in msg ? null : { tb: msg.tb, stake: msg.stake, at: now };
  const to = peers.filter((p) => p.id !== me.id && seen(p)).map((p) => p.id);
  return { ok: true, out: [{ to, message: me.sk ? { t: 'seek', a: me.a, n: me.bn || short(me.a), tb: me.sk.tb, stake: me.sk.stake, at: now } : { t: 'seek', a: me.a, off: true, at: now } }] };
};
export const seekers = (peers: SocialPeer[]) => {
  const out: Array<{ a: string; n: string; tb: GameTable; stake: number; at: number }> = [], done = new Set<string>();
  for (const p of peers) if (p.a && p.sk && !done.has(p.a) && (isChessTable(p.sk.tb) || !salonRefusal(p))) { done.add(p.a); out.push({ a: p.a, n: p.bn || short(p.a), tb: p.sk.tb, stake: p.sk.stake, at: p.sk.at }); }
  return out;
};

/**
 * The Salon relay: one player's game move, passed to every connection of the other player. Both must be signed in and neither may
 * block the other. The room never reads `d` (the two pages run the game and check each other's moves). 30 every 10 s.
 */
export const routeRelay = (peers: SocialPeer[], me: SocialPeer, msg: { to: string; d: unknown }, now: number): Result => {
  if (!me.a) return { ok: false, code: 'pvp-sign-in-first' };
  if (msg.to === me.a) return { ok: false, code: 'pvp-not-you' };
  const targets = peers.filter((p) => p.a === msg.to);
  if (!targets.length) return { ok: false, code: 'pvp-not-here' };
  if (hidden(peers, me.a, msg.to)) return { ok: false, code: 'pvp-blocked' };
  // A Salon game is between two players who both have a primary BNS name. A chess game (the move names a chess table) needs only
  // signing in: the Salon tables ignore any move not addressed to them, so naming a chess table never lets a Salon game past the rule.
  const chess = isChessTable((msg.d as { tb?: unknown } | null)?.tb);
  const refused = chess ? null : salonRefusal(me);
  if (refused) return { ok: false, code: refused.replace('salon-', 'pvp-') };
  const allowed = (p: SocialPeer) => chess || !salonRefusal(p);
  if (!targets.some(allowed)) return { ok: false, code: 'pvp-opponent-no-bns' };
  const lim = takeLimit(me.pv, now, 0, 30, 10_000); me.pv = lim.list;
  if (!lim.ok) return { ok: false, code: 'pvp-too-fast' };
  return { ok: true, out: [{ to: targets.filter(allowed).map((p) => p.id), message: { t: 'pvp', a: me.a, n: me.bn || short(me.a), d: msg.d, at: now } }] };
};

/**
 * Watching a chess game (docs/plans/CASINO-CHESS-PLAN.md, section 7). Chess has no hidden information, so a game can be shown to
 * everyone at the table. A player seated at a chess table sends a snapshot of the game (`d`: the position, the moves, the clocks);
 * the room passes it to everyone else sitting at or watching that table, guests who may see the room included. Someone who arrives
 * mid-game asks (`ask`), and the room passes the ask to the players seated there, whose page answers with a snapshot. The room never
 * reads `d`; each watcher's page replays the moves with the XChess engine before showing them. Nothing is stored.
 */
const mayWatch = (p: SocialPeer) => !!p.a || p.w !== false;
export const seatedAt = (p: SocialPeer, table: string) => !!p.spot && p.spot.split('.')[0] === table;

/**
 * What a snapshot may claim about its players. With a `gid` (a player-versus-player game the room tracks): `w` and `b` must be the
 * two people seated at that table and the sender one of them. Against a house player (no `gid`): exactly one side is
 * `house:<id>`, `d.h` is that same id, and the other side is the sender. Older shapes with no `gid` and no house player: if they
 * name `w` and `b`, the sender must be one of them; anything else is passed on as before (the room never reads the rest of `d`).
 */
const HOUSE = /^house:[a-z0-9-]{1,24}$/;
export const snapshotRefusal = (peers: SocialPeer[], me: SocialPeer, table: string, d: unknown): string | null => {
  if (!d || typeof d !== 'object') return null;
  const o = d as Record<string, unknown>;
  const hasGid = o.gid !== undefined;
  if (hasGid && !isGid(o.gid)) return 'spec-bad-gid';
  const w = o.w, b = o.b;
  if (!hasGid && !(typeof w === 'string' && typeof b === 'string')) return null;
  if (typeof w !== 'string' || typeof b !== 'string') return 'spec-bad-players';
  const hw = HOUSE.test(w) ? w.slice(6) : null, hb = HOUSE.test(b) ? b.slice(6) : null;
  if (hw || hb) {
    if (hasGid || (hw && hb)) return 'spec-bad-players';
    return o.h === (hw || hb) && (hw ? b : w) === me.a ? null : 'spec-bad-players';
  }
  if (!addressLike(w) || !addressLike(b) || w === b || (me.a !== w && me.a !== b)) return 'spec-bad-players';
  if (!hasGid) return null;
  const seated = new Set(peers.filter((p) => p.a && seatedAt(p, table)).map((p) => p.a));
  return seated.has(w) && seated.has(b) ? null : 'spec-bad-players';
};
export const routeSpec = (peers: SocialPeer[], me: SocialPeer, msg: { tb: ChessTable; d: unknown } | { tb: ChessTable; ask: true }, now: number): Result => {
  if (tableOf(me) !== msg.tb) return { ok: false, code: 'spec-not-here' };
  const from = me.a;
  const visible = (p: SocialPeer) => p.id !== me.id && mayWatch(p) && (!from || !p.a || !hidden(peers, p.a, from));
  if ('ask' in msg) {
    if (!mayWatch(me)) return { ok: false, code: 'spec-not-here' };
    const lim = takeLimit(me.sa, now, 2000, 10); me.sa = lim.list;
    if (!lim.ok) return { ok: false, code: 'spec-too-fast' };
    const to = peers.filter((p) => visible(p) && !!p.a && seatedAt(p, msg.tb)).map((p) => p.id);
    return { ok: true, out: to.length ? [{ to, message: { t: 'spec', tb: msg.tb, ask: true, at: now } }] : [] };
  }
  if (!from) return { ok: false, code: 'spec-sign-in-first' };
  if (!seatedAt(me, msg.tb)) return { ok: false, code: 'spec-not-seated' };
  const bad = snapshotRefusal(peers, me, msg.tb, msg.d);
  if (bad) return { ok: false, code: bad };
  const lim = takeLimit(me.sp, now, 0, 40, 10_000); me.sp = lim.list;
  if (!lim.ok) return { ok: false, code: 'spec-too-fast' };
  const to = peers.filter((p) => visible(p) && tableOf(p) === msg.tb).map((p) => p.id);
  return { ok: true, out: to.length ? [{ to, message: { t: 'spec', tb: msg.tb, a: from, n: me.bn || short(from), d: msg.d, at: now } }] : [] };
};

// ------------------------------------------------------------------ the daily drop

/** LAYR given on the first, second, ... seventh (and every later) day in a row. Play money, credited by the player's own page. */
export const DAILY_DROPS = [5_000, 7_500, 10_000, 15_000, 20_000, 30_000, 50_000] as const;
export const DAY_MS = 86_400_000;
export const dayOf = (now: number) => Math.floor(now / DAY_MS);
export type DailyRecord = { day: number; streak: number };

/**
 * One claim a day per player (UTC days). Claiming on the day after the last claim grows the streak; missing a day starts it again.
 * Returns what to store and what to tell the player (`got` is 0 when today's drop was already taken).
 */
export const claimDaily = (record: DailyRecord | null | undefined, now: number) => {
  const today = dayOf(now), next = (today + 1) * DAY_MS - now;
  const last = record && Number.isSafeInteger(record.day) ? record : null;
  if (last && last.day === today) return { store: null, reply: { t: 'daily', got: 0, streak: last.streak, next, at: now } };
  const streak = last && last.day === today - 1 ? Math.min(9999, last.streak + 1) : 1;
  const got = DAILY_DROPS[Math.min(streak, DAILY_DROPS.length) - 1];
  return { store: { day: today, streak } as DailyRecord, reply: { t: 'daily', got, streak, next, at: now } };
};

// ------------------------------------------------------------------ usage counters (anonymous, per UTC day)

/**
 * What the room counts, per day, with no address or message kept: connections (`v`), players who signed in (`s`), of whom
 * returning from an earlier day (`r`) or new (`nw`), the most connections at once (`pk`), chat lines (`ch`), reactions (`rx`),
 * big wins (`w`), shared-round bets (`b`), drinks given (`g`), daily drops (`dd`) and Salon relay messages (`pv`); and for chess, games the
 * room tracked (`cg`) and games voided by a dispute (`cd`: if this is ever not zero, the two pages disagreed).
 */
export const COUNTERS = ['v', 's', 'r', 'nw', 'pk', 'ch', 'rx', 'w', 'b', 'g', 'dd', 'pv', 'cg', 'cd'] as const;
export type Counter = (typeof COUNTERS)[number];
export type DayCounts = Partial<Record<Counter, number>>;
export const counterKey = (now: number) => `c:${new Date(dayOf(now) * DAY_MS).toISOString().slice(0, 10)}`;
export const bump = (counts: DayCounts | undefined, key: Counter, by = 1): DayCounts => ({ ...(counts || {}), [key]: ((counts || {})[key] || 0) + by });
export const peak = (counts: DayCounts | undefined, now: number): DayCounts => ({ ...(counts || {}), pk: Math.max((counts || {}).pk || 0, now) });
/** A player's first and last day seen, for the returning / new split. Keyed by a hash of the address, never the address itself. */
export type SeenRecord = { first: number; last: number };
export const markSeen = (record: SeenRecord | null | undefined, now: number) => {
  const today = dayOf(now);
  if (record && record.last === today) return { store: null, counts: [] as Counter[] };
  const counts: Counter[] = ['s', record ? 'r' : 'nw'];
  return { store: { first: record ? record.first : today, last: today } as SeenRecord, counts };
};
