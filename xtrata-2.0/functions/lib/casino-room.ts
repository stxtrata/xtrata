/**
 * Casino room logic (pure, no Cloudflare types): who sits where, and what a connection may say.
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

export const MAX_FRAME_BYTES = 1024;
export const MAX_SOCKETS = 300;
export const MAX_SOCKETS_PER_ADDRESS = 2;
/** Messages a connection may send per window (a token window, kept in the attachment so it survives hibernation). */
export const RATE_LIMIT = 12;
export const RATE_WINDOW_MS = 10_000;

/** One open connection. `a` is null for a guest (watching only). `rl` holds recent message times for the rate limit. */
export type Peer = { id: string; a: string | null; k: string | null; spot: string | null; since: number; rl: number[] };

export const newPeer = (id: string, address: string | null, hash160: string | null, now: number): Peer => ({
  id, a: address, k: hash160, spot: null, since: now, rl: []
});

/** SP3JNSEX...X743 style label from an on-chain address (P0 has no BNS lookup). */
export const shortAddress = (address: string | null) =>
  !address ? 'Guest' : address.length <= 12 ? address : `${address.slice(0, 5)}…${address.slice(-4)}`;

export type SpotView = { a: string; n: string; since: number };
export type RoomView = { spots: Record<string, SpotView>; joined: number; guests: number };

export const deriveView = (peers: Peer[]): RoomView => {
  const spots: Record<string, SpotView> = {};
  let joined = 0;
  let guests = 0;
  for (const peer of peers) {
    if (peer.a) joined += 1; else guests += 1;
    if (peer.a && peer.spot) spots[peer.spot] = { a: peer.a, n: shortAddress(peer.a), since: peer.since };
  }
  return { spots, joined, guests };
};

export type ClientMessage =
  | { t: 'hello' }
  | { t: 'sit'; spot: string }
  | { t: 'stand' }
  | { t: 'ping' };

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
