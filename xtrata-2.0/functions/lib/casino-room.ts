/**
 * Casino room logic (pure, no Cloudflare types): who sits where, who is in the room, and what a connection may say.
 * Talk (people list, public chat, private messages, blocking, reports) lives here too: the text rules, the limits and
 * who hears what. Nothing said is stored; only reports are kept, and only by the Durable Object.
 *
 * Plan: docs/plans/CASINO-PRESENCE-PLAN.md. The Durable Object in workers/casino-room is a thin shell around this module, so
 * the rules can be tested without a Workers runtime. The room's truth is a list of peers (one per open connection); a peer
 * is a small record the Durable Object keeps as the connection's "attachment", which survives hibernation.
 */

/**
 * Every place a person can sit or stand in /casino (P1). Table seats follow SEATS in public/casino/index.html ('.1', '.2'... in
 * that order; a single standing place is '.pad'); the ten cabinets are the five machines (drop, twins, ds = Deep Strata,
 * bf = Block Fortune, nv = Neon Vault) on the left wall ('.1') and the right wall ('.2'). The bar ids are reserved for the
 * stools that come later. The server accepts only ids in this list; changing it means redeploying the room Worker.
 */
export const SPOTS = [
  'blackjack.1', 'blackjack.2', 'baccarat.1', 'baccarat.2', 'holdem.1', 'holdem.2',
  'roulette.pad', 'videopoker.pad', 'pvpholdem.1', 'pvpholdem.2', 'pvpholdem.3',
  'liars.1', 'liars.2', 'liars.3',
  'drop.1', 'drop.2', 'twins.1', 'twins.2', 'ds.1', 'ds.2', 'bf.1', 'bf.2', 'nv.1', 'nv.2',
  'bar.1', 'bar.2', 'bar.3', 'bar.4'
] as const;
const SPOT_SET = new Set<string>(SPOTS);
export const isSpot = (value: unknown): value is string => typeof value === 'string' && SPOT_SET.has(value);

/** The five machines, in PX_MACHINE_PACKS order. Their ten cabinets ('drop.1' … 'nv.2') are the only spots that can send spins. */
export const MACHINE_IDS = ['drop', 'twins', 'ds', 'bf', 'nv'] as const;
export const isMachineSpot = (value: unknown): value is string =>
  isSpot(value) && (MACHINE_IDS as readonly string[]).includes(value.split('.')[0]);

/** Large enough for one 280-character message in the widest characters, or a full block list; small enough to ignore junk. */
export const MAX_FRAME_BYTES = 2048;
export const MAX_SOCKETS = 300;
export const MAX_SOCKETS_PER_ADDRESS = 2;
/** Messages a connection may send per window (a token window, kept in the attachment so it survives hibernation). */
export const RATE_LIMIT = 12;
export const RATE_WINDOW_MS = 10_000;

/** Chat (plan section 5.3): at most one chat message every 2 seconds and 20 a minute per connection. */
export const MAX_TEXT_CHARS = 280;
export const CHAT_MIN_GAP_MS = 2_000;
export const CHAT_PER_MINUTE = 20;
/** Most people one player can block (the list is sent in one frame, and rides in the connection's attachment). */
export const MAX_BLOCKS = 40;
/** What a player may say when reporting someone, and how much evidence they may attach. */
export const REPORT_REASONS = ['spam', 'abuse', 'scam', 'other'] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];
export const MAX_REPORT_LINES = 5;
export const MAX_REPORT_LINE_CHARS = 200;

/**
 * Spin replay. A player at a machine sends the reel stops of each spin as it starts; everyone else in the room spins their own
 * copy of that machine to the same stops, so they watch the same reels and the same win. The stops alone decide the reels
 * (every machine picks them first, from its own reel strips), so a spin is a few numbers, not a picture.
 * The room only passes spins on: it never checks or stores a result, and nothing here moves money.
 */
export const ROOM_FEATURES = ['play', 'move'] as const;
/** Spins have their own limit, apart from RATE_LIMIT, so a player on turbo or autoplay never slows their seat updates or chat. */
export const PLAY_MIN_GAP_MS = 400;
export const PLAY_PER_MINUTE = 100;
export const MIN_STOPS = 3;
export const MAX_STOPS = 8;
export const MAX_STOP = 9_999;
export const MAX_BET = 1_000_000;

/**
 * Walking (presence plan 8.4). A signed-in player on the floor sends where they stand and which way they face, a couple of
 * times a second while they move; everyone else draws them walking there, a moment behind. The room keeps only the last
 * position of each connection and never stores a history. `r` is the facing angle in the characters' convention.
 */
export const MOVE_MIN_GAP_MS = 250;
export const MOVE_PER_MINUTE = 200;   // the page sends at most 150 a minute (one every 0.4 s)
/** The floor is 26 x 22 m around the origin; anything beyond this is not a place in the room. */
export const MOVE_BOUND = 20;

/**
 * One open connection. `a` is null for a guest (watching only). `rl` holds recent message times for the rate limit, `cl` the
 * recent chat times, and `b` the addresses this connection's player has blocked (the player's own list, sent on every connect).
 */
export type Peer = {
  id: string; a: string | null; k: string | null; spot: string | null; since: number;
  rl: number[]; cl: number[]; b: string[];
  /** Recent spin times, for the spin limit. */
  pl: number[];
  /** Where this connection's player stands on the floor ([x, z, facing]), or null when they are not on the floor. */
  p: [number, number, number] | null;
  /** When `p` last changed (room clock), and recent move times for the move limit. */
  pt: number;
  ml: number[];
};

export const newPeer = (id: string, address: string | null, hash160: string | null, now: number): Peer => ({
  id, a: address, k: hash160, spot: null, since: now, rl: [], cl: [], b: [], pl: [], p: null, pt: 0, ml: []
});

/** A connection saved before chat (or spins) existed has no `cl`, `b` or `pl`: fill them in so the rest of the code can rely on them. */
export const upgradePeer = (peer: Peer): Peer => {
  if (!Array.isArray(peer.cl)) peer.cl = [];
  if (!Array.isArray(peer.b)) peer.b = [];
  if (!Array.isArray(peer.pl)) peer.pl = [];
  if (!Array.isArray(peer.ml)) peer.ml = [];
  if (!Array.isArray(peer.p) || peer.p.length !== 3) peer.p = null;
  if (typeof peer.pt !== 'number') peer.pt = 0;
  return peer;
};

/** SP3JNSEX...X743 style label from an on-chain address (P0 has no BNS lookup). */
export const shortAddress = (address: string | null) =>
  !address ? 'Guest' : address.length <= 12 ? address : `${address.slice(0, 5)}…${address.slice(-4)}`;

export type SpotView = { a: string; n: string; since: number };
/** One signed-in person in the room, listed once however many tabs they have open; `spot` is where they sit, if anywhere. */
export type PlayerView = { a: string; n: string; spot: string | null };
/** A signed-in player standing or walking on the floor (not seated), once per address: their latest position. */
export type WalkerView = { a: string; n: string; x: number; z: number; r: number; at: number };
export type RoomView = { spots: Record<string, SpotView>; players: PlayerView[]; walkers: WalkerView[]; joined: number; guests: number };

export const deriveView = (peers: Peer[]): RoomView => {
  const spots: Record<string, SpotView> = {};
  const players = new Map<string, PlayerView>();
  const walkers = new Map<string, WalkerView>();
  let joined = 0;
  let guests = 0;
  for (const peer of peers) {
    if (peer.a) joined += 1; else guests += 1;
    if (peer.a) {
      const entry = players.get(peer.a) ?? { a: peer.a, n: shortAddress(peer.a), spot: null };
      if (peer.spot) entry.spot = peer.spot;
      players.set(peer.a, entry);
    }
    if (peer.a && peer.spot) spots[peer.spot] = { a: peer.a, n: shortAddress(peer.a), since: peer.since };
    if (peer.a && peer.p && !peer.spot) {
      const seen = walkers.get(peer.a);
      if (!seen || peer.pt > seen.at) walkers.set(peer.a, { a: peer.a, n: shortAddress(peer.a), x: peer.p[0], z: peer.p[1], r: peer.p[2], at: peer.pt });
    }
  }
  // Someone seated on one tab and walking on another is shown seated.
  for (const a of walkers.keys()) if (Object.values(spots).some((v) => v.a === a)) walkers.delete(a);
  return { spots, players: [...players.values()], walkers: [...walkers.values()], joined, guests };
};

// ------------------------------------------------------------------ text

/** Anything that looks like a Stacks address (checked loosely: the room only ever compares it with addresses it holds). */
export const isAddressLike = (value: unknown): value is string => typeof value === 'string' && /^S[0-9A-Z]{4,63}$/.test(value);

/**
 * Characters that change how text is shown without being visible: control characters, soft hyphens, zero-width characters
 * and the left-to-right and right-to-left overrides that can make one thing read as another. They are removed, not refused.
 */
const HIDDEN = /[\u0000-\u001F\u007F-\u009F\u00AD\u061C\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\uFFF9-\uFFFB]/g;
const LINE_BREAKS = /[\t\n\r\f\v\u0085\u2028\u2029]+/g;
/** Web addresses and bare domains on the endings scammers use. Chat has no links (plan 5.3): a wallet app must not become a phishing channel. */
const LINKISH = new RegExp(
  '(?:[a-z][a-z0-9+.-]*:\\/\\/|\\bwww\\.|\\b[a-z0-9-]+\\.(?:com|net|org|io|xyz|co|app|me|gg|btc|stx|ly|sh|link|site|online|info|dev|ai|club|top|click|fun|live|page|cc|tv|us|uk|eth|nft|fm|vip|shop|store|win|bid|biz|ru|cn|tk|ml|ga|cf|gq|zip|wtf)\\b)',
  'i'
);

export type TextResult = { ok: true; text: string } | { ok: false; code: 'empty' | 'too-long' | 'no-links' | 'bad-message' };

/** Makes one message safe to relay: plain single-spaced text of 1 to `max` characters (counted as people count them), no links. */
export const cleanText = (value: unknown, max = MAX_TEXT_CHARS): TextResult => {
  if (typeof value !== 'string') return { ok: false, code: 'bad-message' };
  const text = value.replace(LINE_BREAKS, ' ').replace(HIDDEN, '').replace(/ {2,}/g, ' ').trim();
  const length = Array.from(text).length;
  if (length === 0) return { ok: false, code: 'empty' };
  if (length > max) return { ok: false, code: 'too-long' };
  if (LINKISH.test(text)) return { ok: false, code: 'no-links' };
  return { ok: true, text };
};

// ------------------------------------------------------------------ messages

export type ClientMessage =
  | { t: 'hello' }
  | { t: 'sit'; spot: string }
  | { t: 'stand' }
  | { t: 'ping' }
  | { t: 'say'; text: string }
  | { t: 'dm'; to: string; text: string }
  /** The player's whole block list (replaces the last one). Kept by the player's browser and sent on every connect. */
  | { t: 'blocks'; list: string[] }
  | { t: 'report'; who: string; why: ReportReason; lines: string[] }
  /** One spin by the player seated at `spot` (a cabinet): the reel stops in reel order, the bet, and whether it was a free spin. */
  | { t: 'play'; spot: string; s: number[]; b: number; f: boolean }
  /** Where the player stands on the floor and which way they face; or `off`: they are not on the floor any more. */
  | { t: 'move'; x: number; z: number; r: number }
  | { t: 'move'; off: true };

export type ParseResult = { ok: true; msg: ClientMessage } | { ok: false; code: string };

export const parseClientMessage = (raw: unknown): ParseResult => {
  if (typeof raw !== 'string') return { ok: false, code: 'text-only' };
  if (new TextEncoder().encode(raw).length > MAX_FRAME_BYTES) return { ok: false, code: 'too-big' };
  let value: any;
  try { value = JSON.parse(raw); } catch { return { ok: false, code: 'bad-json' }; }
  if (!value || typeof value !== 'object' || typeof value.t !== 'string') return { ok: false, code: 'bad-message' };
  switch (value.t) {
    case 'hello': return { ok: true, msg: { t: 'hello' } };
    case 'ping': return { ok: true, msg: { t: 'ping' } };
    case 'stand': return { ok: true, msg: { t: 'stand' } };
    case 'sit':
      return isSpot(value.spot) ? { ok: true, msg: { t: 'sit', spot: value.spot } } : { ok: false, code: 'no-such-spot' };
    case 'say': {
      const text = cleanText(value.text);
      return text.ok ? { ok: true, msg: { t: 'say', text: text.text } } : { ok: false, code: text.code };
    }
    case 'dm': {
      if (!isAddressLike(value.to)) return { ok: false, code: 'no-such-player' };
      const text = cleanText(value.text);
      return text.ok ? { ok: true, msg: { t: 'dm', to: value.to, text: text.text } } : { ok: false, code: text.code };
    }
    case 'blocks': {
      if (!Array.isArray(value.list)) return { ok: false, code: 'bad-message' };
      if (value.list.length > MAX_BLOCKS) return { ok: false, code: 'too-many-blocks' };
      if (!value.list.every(isAddressLike)) return { ok: false, code: 'bad-message' };
      return { ok: true, msg: { t: 'blocks', list: [...new Set<string>(value.list)] } };
    }
    case 'report': {
      if (!isAddressLike(value.who)) return { ok: false, code: 'no-such-player' };
      if (!(REPORT_REASONS as readonly string[]).includes(value.why)) return { ok: false, code: 'bad-message' };
      const raw = value.lines === undefined ? [] : value.lines;
      if (!Array.isArray(raw) || raw.length > MAX_REPORT_LINES) return { ok: false, code: 'bad-message' };
      const lines: string[] = [];
      for (const line of raw) {
        // Evidence is shown to a moderator as written, so it only has to be safe text; it may contain what a link filter would refuse.
        if (typeof line !== 'string') return { ok: false, code: 'bad-message' };
        const clean = line.replace(LINE_BREAKS, ' ').replace(HIDDEN, '').replace(/ {2,}/g, ' ').trim();
        if (clean) lines.push(Array.from(clean).slice(0, MAX_REPORT_LINE_CHARS).join(''));
      }
      return { ok: true, msg: { t: 'report', who: value.who, why: value.why, lines } };
    }
    case 'play': {
      // Codes start with "play-" so the room client never mistakes them for a chat error and shows them to the player.
      if (!isMachineSpot(value.spot)) return { ok: false, code: 'play-bad-spot' };
      const stops = value.s;
      if (!Array.isArray(stops) || stops.length < MIN_STOPS || stops.length > MAX_STOPS) return { ok: false, code: 'play-bad' };
      if (!stops.every((n: unknown) => Number.isSafeInteger(n) && (n as number) >= 0 && (n as number) <= MAX_STOP)) return { ok: false, code: 'play-bad' };
      if (!Number.isSafeInteger(value.b) || value.b <= 0 || value.b > MAX_BET) return { ok: false, code: 'play-bad' };
      return { ok: true, msg: { t: 'play', spot: value.spot, s: stops.slice() as number[], b: value.b, f: value.f === true || value.f === 1 } };
    }
    case 'move': {
      if (value.off === true) return { ok: true, msg: { t: 'move', off: true } };
      const { x, z, r } = value;
      const inside = (n: unknown) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= MOVE_BOUND;
      if (!inside(x) || !inside(z) || typeof r !== 'number' || !Number.isFinite(r)) return { ok: false, code: 'move-bad' };
      const facing = Math.atan2(Math.sin(r), Math.cos(r));      // any angle, folded into -pi..pi
      const round = (n: number, k: number) => Math.round(n * k) / k;
      return { ok: true, msg: { t: 'move', x: round(x, 100), z: round(z, 100), r: round(facing, 1000) } };
    }
    default: return { ok: false, code: 'bad-message' };
  }
};

/** Records one message for this peer. Returns false (and records nothing) when the peer is over its rate limit. */
export const takeRate = (peer: Peer, now: number): boolean => {
  const recent = peer.rl.filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) { peer.rl = recent; return false; }
  recent.push(now);
  peer.rl = recent;
  return true;
};

/** What a change does, for the Durable Object to announce. */
export type Change =
  | { kind: 'sat'; spot: string; who: SpotView; peerId: string }
  | { kind: 'stood'; spot: string; peerId: string }
  /** The same address sat down on another connection, so this connection's seat was taken over. */
  | { kind: 'moved'; spot: string; peerId: string };

export type SitResult = { ok: true; changes: Change[] } | { ok: false; code: string };

/** `me` asks to sit at `spot`. Mutates the matching peers' `spot` fields on success. */
export const applySit = (peers: Peer[], meId: string, spot: string, now: number): SitResult => {
  const me = peers.find((p) => p.id === meId);
  if (!me) return { ok: false, code: 'gone' };
  if (!me.a) return { ok: false, code: 'sign-in-first' };
  if (!isSpot(spot)) return { ok: false, code: 'no-such-spot' };
  const holder = peers.find((p) => p.spot === spot && p.id !== meId);
  if (holder && holder.a !== me.a) return { ok: false, code: 'taken' };
  const changes: Change[] = [];
  // One address, one seat: free whatever this address holds on any connection (including this one).
  for (const p of peers) {
    if (p.a === me.a && p.spot && p.spot !== spot) {
      changes.push({ kind: p.id === meId ? 'stood' : 'moved', spot: p.spot, peerId: p.id });
      if (p.id !== meId) changes.push({ kind: 'stood', spot: p.spot, peerId: p.id });
      p.spot = null;
    }
  }
  if (holder && holder.a === me.a) {   // the same address sits at this spot on another tab: that tab is replaced
    changes.push({ kind: 'moved', spot, peerId: holder.id });
    holder.spot = null;
  }
  me.spot = spot;
  me.since = now;
  for (const p of peers) if (p.a === me.a) { p.p = null; p.pt = now; }   // sitting down takes the player off the floor, on every tab
  changes.push({ kind: 'sat', spot, who: { a: me.a, n: shortAddress(me.a), since: now }, peerId: me.id });
  return { ok: true, changes };
};

export const applyStand = (peers: Peer[], meId: string): Change[] => {
  const me = peers.find((p) => p.id === meId);
  if (!me || !me.spot) return [];
  const change: Change = { kind: 'stood', spot: me.spot, peerId: me.id };
  me.spot = null;
  return [change];
};

/** When a connection closes, the spot it held is free again. */
export const applyLeave = (peers: Peer[], meId: string): Change[] => applyStand(peers, meId);

/** Connections to drop so that no address has more than `MAX_SOCKETS_PER_ADDRESS` (oldest go first). */
export const overflowForAddress = (peers: Peer[], address: string | null): Peer[] => {
  if (!address) return [];
  const mine = peers.filter((p) => p.a === address).sort((a, b) => a.since - b.since);
  return mine.length > MAX_SOCKETS_PER_ADDRESS ? mine.slice(0, mine.length - MAX_SOCKETS_PER_ADDRESS) : [];
};

// ------------------------------------------------------------------ chat

/** Records one chat message (public, private or a report) for this peer. False, recording nothing, when it is too soon or too many. */
export const takeChatRate = (peer: Peer, now: number): boolean => {
  const recent = (Array.isArray(peer.cl) ? peer.cl : []).filter((t) => now - t < 60_000);
  const last = recent[recent.length - 1];
  if ((last !== undefined && now - last < CHAT_MIN_GAP_MS) || recent.length >= CHAT_PER_MINUTE) { peer.cl = recent; return false; }
  recent.push(now);
  peer.cl = recent;
  return true;
};

/** True when `holder` (an address) has blocked `other` on any of their open connections. */
const blocked = (peers: Peer[], holder: string, other: string) =>
  peers.some((p) => p.a === holder && Array.isArray(p.b) && p.b.includes(other));

/** Blocking works both ways (plan 4.6): neither person sees the other's messages. */
const hiddenBetween = (peers: Peer[], one: string, two: string) => blocked(peers, one, two) || blocked(peers, two, one);

export type PersonView = { a: string; n: string };
const person = (address: string): PersonView => ({ a: address, n: shortAddress(address) });

export type SayMessage = { t: 'say'; from: PersonView; text: string; at: number };
export type DmMessage = { t: 'dm'; from: PersonView; to: PersonView; text: string; at: number };
/** `to` lists the connections (by peer id) that should receive `message`. */
export type Routed<M> = { ok: true; message: M; to: string[] } | { ok: false; code: string };

/** A public message goes to every signed-in connection, except people who have blocked the speaker or been blocked by them. */
export const routeSay = (peers: Peer[], meId: string, text: string, now: number): Routed<SayMessage> => {
  const me = peers.find((p) => p.id === meId);
  if (!me) return { ok: false, code: 'gone' };
  if (!me.a) return { ok: false, code: 'sign-in-first' };
  const speaker = me.a;
  const to = peers
    .filter((p) => p.a && (p.a === speaker || !hiddenBetween(peers, p.a, speaker)))
    .map((p) => p.id);
  return { ok: true, message: { t: 'say', from: person(speaker), text, at: now }, to };
};

/**
 * A private message goes to every connection of the person it is for, and back to every connection of the sender (so both of
 * their tabs show it). The target must be in the room now. If the sender has blocked the target they are told; if the target has
 * blocked the sender, the sender sees the message as sent and the target never receives it.
 */
export const routeDm = (peers: Peer[], meId: string, to: string, text: string, now: number): Routed<DmMessage> => {
  const me = peers.find((p) => p.id === meId);
  if (!me) return { ok: false, code: 'gone' };
  if (!me.a) return { ok: false, code: 'sign-in-first' };
  if (to === me.a) return { ok: false, code: 'not-you' };
  const targets = peers.filter((p) => p.a === to);
  if (targets.length === 0) return { ok: false, code: 'not-here' };
  if (blocked(peers, me.a, to)) return { ok: false, code: 'blocked' };
  const mine = peers.filter((p) => p.a === me.a).map((p) => p.id);
  const theirs = blocked(peers, to, me.a) ? [] : targets.map((p) => p.id);
  return { ok: true, message: { t: 'dm', from: person(me.a), to: person(to), text, at: now }, to: [...mine, ...theirs] };
};

/** Replaces the block list of one connection. Never includes the player themself. Returns the list now in force. */
export const setBlocks = (peers: Peer[], meId: string, list: string[]): string[] | null => {
  const me = peers.find((p) => p.id === meId);
  if (!me || !me.a) return null;
  me.b = list.filter((a) => a !== me.a).slice(0, MAX_BLOCKS);
  return me.b;
};

/** What the room keeps when someone is reported: who, about whom, why, and the lines the reporter chose to attach. */
export type Report = { at: number; by: string; who: string; why: ReportReason; lines: string[] };

export const buildReport = (peers: Peer[], meId: string, who: string, why: ReportReason, lines: string[], now: number):
  { ok: true; report: Report } | { ok: false; code: string } => {
  const me = peers.find((p) => p.id === meId);
  if (!me) return { ok: false, code: 'gone' };
  if (!me.a) return { ok: false, code: 'sign-in-first' };
  if (who === me.a) return { ok: false, code: 'not-you' };
  return { ok: true, report: { at: now, by: me.a, who, why, lines } };
};

// ------------------------------------------------------------------ spins

/** Records one spin for this peer. False, recording nothing, when it comes too soon after the last or there are too many a minute. */
export const takePlayRate = (peer: Peer, now: number): boolean => {
  const recent = (Array.isArray(peer.pl) ? peer.pl : []).filter((t) => now - t < 60_000);
  const last = recent[recent.length - 1];
  if ((last !== undefined && now - last < PLAY_MIN_GAP_MS) || recent.length >= PLAY_PER_MINUTE) { peer.pl = recent; return false; }
  recent.push(now);
  peer.pl = recent;
  return true;
};

export type PlayMessage = { t: 'play'; spot: string; a: string; s: number[]; b: number; f: boolean; at: number };

/**
 * A spin goes to every other connection in the room, guests included (they can watch the room too). Only the player seated at
 * that cabinet may send it, so nobody can make a machine they are not at appear to spin. Blocking hides talk, not play, in the
 * same way that it does not hide where someone sits.
 */
export const routePlay = (peers: Peer[], meId: string, msg: { spot: string; s: number[]; b: number; f: boolean }, now: number):
  Routed<PlayMessage> => {
  const me = peers.find((p) => p.id === meId);
  if (!me) return { ok: false, code: 'play-gone' };
  if (!me.a) return { ok: false, code: 'play-sign-in-first' };
  if (me.spot !== msg.spot) return { ok: false, code: 'play-not-your-spot' };
  const to = peers.filter((p) => p.id !== meId).map((p) => p.id);
  return { ok: true, message: { t: 'play', spot: msg.spot, a: me.a, s: msg.s, b: msg.b, f: msg.f, at: now }, to };
};

// ------------------------------------------------------------------ walking

/** Records one move for this peer. False, recording nothing, when it comes too soon after the last or there are too many a minute. */
export const takeMoveRate = (peer: Peer, now: number): boolean => {
  const recent = (Array.isArray(peer.ml) ? peer.ml : []).filter((t) => now - t < 60_000);
  const last = recent[recent.length - 1];
  if ((last !== undefined && now - last < MOVE_MIN_GAP_MS) || recent.length >= MOVE_PER_MINUTE) { peer.ml = recent; return false; }
  recent.push(now);
  peer.ml = recent;
  return true;
};

export type MoveMessage =
  | { t: 'move'; a: string; x: number; z: number; r: number; at: number }
  | { t: 'move'; a: string; off: true; at: number };

/**
 * A player's position (or `off`) goes to every other connection, guests included. Only a signed-in player who is not seated
 * may move: a seat always wins over a position, so a late move after sitting down cannot pull someone off their seat.
 * Records the position on the connection, so later arrivals see it in the room view.
 */
export const applyMove = (peers: Peer[], meId: string, msg: { x: number; z: number; r: number } | { off: true }, now: number):
  Routed<MoveMessage> => {
  const me = peers.find((p) => p.id === meId);
  if (!me) return { ok: false, code: 'move-gone' };
  if (!me.a) return { ok: false, code: 'move-sign-in-first' };
  const to = peers.filter((p) => p.id !== meId).map((p) => p.id);
  if ('off' in msg) {
    me.p = null; me.pt = now;
    return { ok: true, message: { t: 'move', a: me.a, off: true, at: now }, to };
  }
  if (me.spot) return { ok: false, code: 'move-seated' };
  me.p = [msg.x, msg.z, msg.r]; me.pt = now;
  return { ok: true, message: { t: 'move', a: me.a, x: msg.x, z: msg.z, r: msg.r, at: now }, to };
};

/**
 * When a connection closes while its player was on the floor, the others are told to take them off it, unless another tab of
 * the same player is still on the floor (that one goes on being drawn). `others` are the connections still open.
 */
export const leaveFloor = (others: Peer[], gone: Peer, now: number): MoveMessage | null => {
  if (!gone.a || !gone.p) return null;
  if (others.some((p) => p.a === gone.a && p.p)) return null;
  return { t: 'move', a: gone.a, off: true, at: now };
};
