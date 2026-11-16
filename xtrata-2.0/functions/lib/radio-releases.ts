/**
 * Artists release their own music: the server's part (docs/music/ARTIST-RELEASES.md, stage 1).
 *
 * A release is an album definition stored exactly like a gift player (radio-gifts.ts `storePlayer`: every song a
 * ready song, every song held by its maker right now), made by ANY wallet that holds its songs and signed by it. It
 * comes with no plays and no money passes through here: a listener adds it to their player and plays it with their
 * own plays, each of which already pays the song's holder.
 *
 * A player's SHELF (the releases it has added) is kept here against the player's address, so it follows the player
 * across devices. It is private: every change AND every read is signed by the player's own key inside the wallet box.
 * Only the count of players that have added a release is public.
 *
 * Off unless RADIO_RELEASES_ENABLED=1.
 */
import { queryAll, run } from './db';
import { applyHiroApiKey, getHiroApiKeys, isTransientHiroStatus, shouldRetryWithNextHiroKey } from './hiro-keys';
import { catalogueSongs, ensureGiftTables, GiftError, giftsConfig, playerView, storePlayer, type ChainTransfer, type GiftChain, type GiftDeps, type GiftEnv } from './radio-gifts';
import { isMainnetStandardAddress } from '../../src/lib/listening-wallet/link';
import { isPlayerId, validatePlayer, type PlayerDefinition, type PlayerView } from '../../src/lib/listening-wallet/gift-players';
import {
  isOrderId, orderMemo, releaseDigest, SHELF_MAX, stxText, validatePriceRequest, validateReleaseRequest, validateShelfRequest, verifyPriceSignature, verifyReleaseSignature, verifyShelfSignature,
  type OrderView, type PriceRequest, type ReleaseRequest, type ShelfRequest
} from '../../src/lib/music-releases/release';

export type ReleaseEnv = GiftEnv & {
  RADIO_RELEASES_ENABLED?: string;
  /** Stage 3: artists may put a price on a release; buyers pay the artist directly. Off unless "1". */
  RADIO_RELEASE_SALES_ENABLED?: string;
};
export const releasesEnabled = (env: ReleaseEnv) => env.RADIO_RELEASES_ENABLED === '1';
export const salesEnabled = (env: ReleaseEnv) => releasesEnabled(env) && env.RADIO_RELEASE_SALES_ENABLED === '1';
/** What the page needs to know: releases on or off, and which ways of distributing one are open. */
export function releasesConfig(env: ReleaseEnv, request?: Request) {
  const enabled = releasesEnabled(env);
  let gifts = false;
  try { gifts = giftsConfig(env, null, request).enabled; } catch { /* gifts not set up here */ }
  return { enabled, copies: enabled && env.RADIO_RELEASE_COPIES_ENABLED === '1' && gifts, sales: salesEnabled(env) };
}
/** Releases one wallet may make in a day. */
export const RELEASES_PER_DAY = 20;
/** Inscriptions looked through when listing the songs a wallet holds. */
export const HELD_MAX = 600;
const CORE_ASSET = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3::xtrata-inscription';
const HIRO = 'https://api.mainnet.hiro.so';

const rows = async <T,>(env: ReleaseEnv, sql: string, binds: unknown[] = []) => ((await queryAll(env, sql, binds)).results ?? []) as T[];
const one = async <T,>(env: ReleaseEnv, sql: string, binds: unknown[] = []) => (await rows<T>(env, sql, binds))[0] ?? null;
const requireOn = (env: ReleaseEnv) => { if (!releasesEnabled(env)) throw new GiftError('Releases are not open yet.', 404); };

const ensured = new WeakSet<object>();
export async function ensureReleaseTables(env: ReleaseEnv) {
  const db = (env as any).DB as object | undefined;
  if (db && ensured.has(db)) return;
  await ensureGiftTables(env);
  // A release marks one stored album definition as public and made by an artist (the definition itself is in radio_gift_players).
  await run(env, 'CREATE TABLE IF NOT EXISTS radio_releases(id TEXT PRIMARY KEY, artist TEXT NOT NULL, created_at INTEGER NOT NULL)');
  await run(env, 'CREATE INDEX IF NOT EXISTS radio_releases_artist ON radio_releases(artist, created_at)');
  // A player's shelf. removed_at set: taken off (kept so the same album can be added again, and so nothing is guessed).
  await run(env, `CREATE TABLE IF NOT EXISTS radio_release_shelf(
    player TEXT NOT NULL, release TEXT NOT NULL, added_at INTEGER NOT NULL, hidden INTEGER NOT NULL DEFAULT 0, removed_at INTEGER, PRIMARY KEY(player, release))`);
  await run(env, 'CREATE INDEX IF NOT EXISTS radio_release_shelf_release ON radio_release_shelf(release)');
  // The time of the last request each player signed: an older (or the same) signed request is refused, so one cannot be replayed.
  await run(env, 'CREATE TABLE IF NOT EXISTS radio_release_seen(player TEXT PRIMARY KEY, issued INTEGER NOT NULL)');
  // Stage 3. A release's price (microSTX; 0 = free) and when its artist last signed one (an older signed price is refused).
  for (const column of ['price INTEGER NOT NULL DEFAULT 0', 'price_issued INTEGER NOT NULL DEFAULT 0']) {
    try { await run(env, `ALTER TABLE radio_releases ADD COLUMN ${column}`); } catch (e) { if (!/duplicate column/i.test(String((e as Error)?.message || e))) throw e; }
  }
  // One listener's purchase of one release: paid straight to the artist, found on chain by its memo. Never deleted.
  await run(env, `CREATE TABLE IF NOT EXISTS radio_release_orders(
    id TEXT PRIMARY KEY, release TEXT NOT NULL, player TEXT NOT NULL, artist TEXT NOT NULL, price INTEGER NOT NULL,
    status TEXT NOT NULL, txid TEXT, created_at INTEGER NOT NULL, paid_at INTEGER, UNIQUE(release, player))`);
  await run(env, 'CREATE UNIQUE INDEX IF NOT EXISTS radio_release_orders_txid ON radio_release_orders(txid) WHERE txid IS NOT NULL');
  if (db) ensured.add(db);
}

// ---------------------------------------------------------------- releasing
export async function createRelease(env: ReleaseEnv, body: { definition?: PlayerDefinition; request?: ReleaseRequest; signature?: unknown }, deps: GiftDeps) {
  requireOn(env);
  let def: PlayerDefinition, req: ReleaseRequest;
  try { def = validatePlayer(body?.definition as PlayerDefinition); req = validateReleaseRequest(body?.request as ReleaseRequest, def, deps.now); }
  catch (e) { throw new GiftError((e as Error).message, 400); }
  if (!verifyReleaseSignature(req, body.signature)) throw new GiftError('That release was not signed by this wallet.', 403);
  await ensureReleaseTables(env);
  const recent = await one<{ n: number }>(env, 'SELECT COUNT(*) AS n FROM radio_releases WHERE artist=? AND created_at>?', [req.artist, deps.now - 86_400_000]);
  if (Number(recent?.n) >= RELEASES_PER_DAY) throw new GiftError('That is a lot of releases for one day. Try again tomorrow.', 429);
  // Checks every song is a ready song held by this wallet right now, then stores the definition (or finds the same one).
  const made = await storePlayer(env, def, req.artist, releaseDigest(req), deps);
  const stored = await one<{ owner: string }>(env, 'SELECT owner FROM radio_gift_players WHERE id=?', [made.id]);
  if (stored?.owner !== req.artist) throw new GiftError('An album with exactly this title and these songs already exists.', 409);
  await run(env, 'INSERT OR IGNORE INTO radio_releases(id, artist, created_at) VALUES(?, ?, ?)', [made.id, req.artist, deps.now]);
  return { id: made.id, title: made.title, tracks: made.tracks, existing: made.existing };
}

export interface ReleaseView extends PlayerView { artist: string; createdAt: number; /** players that have this release on their shelf */ added: number; /** microSTX; "0" is free */ price: string; /** copies paid for */ sold: number }
type ReleaseRow = { id: string; artist: string; created_at: number; price?: number | null };

async function view(env: ReleaseEnv, r: ReleaseRow): Promise<ReleaseView | null> {
  const p = await playerView(env, r.id);
  if (!p) return null;
  const n = await one<{ n: number }>(env, 'SELECT COUNT(*) AS n FROM radio_release_shelf WHERE release=? AND removed_at IS NULL', [r.id]);
  const sold = await one<{ n: number }>(env, "SELECT COUNT(*) AS n FROM radio_release_orders WHERE release=? AND status='paid'", [r.id]);
  return { ...p, tracks: p.tracks.filter((t) => !t.hidden), artist: r.artist, createdAt: Number(r.created_at), added: Number(n?.n) || 0, price: String(BigInt(r.price ?? 0)), sold: Number(sold?.n) || 0 };
}

/** One release, as anyone may see it. */
export async function releaseView(env: ReleaseEnv, id: unknown): Promise<ReleaseView> {
  requireOn(env);
  if (!isPlayerId(id)) throw new GiftError('That is not a release.', 404);
  await ensureReleaseTables(env);
  const r = await one<ReleaseRow>(env, 'SELECT * FROM radio_releases WHERE id=?', [id]);
  const v = r ? await view(env, r) : null;
  if (!v) throw new GiftError('That release was not found.', 404);
  return v;
}

/** An artist's releases, newest first. */
export async function releasesBy(env: ReleaseEnv, artist: unknown): Promise<{ releases: ReleaseView[] }> {
  requireOn(env);
  if (typeof artist !== 'string' || !isMainnetStandardAddress(artist)) throw new GiftError('A mainnet wallet address is required.', 400);
  await ensureReleaseTables(env);
  const list = await rows<ReleaseRow>(env, 'SELECT * FROM radio_releases WHERE artist=? ORDER BY created_at DESC LIMIT 50', [artist]);
  const out: ReleaseView[] = [];
  for (const r of list) { const v = await view(env, r); if (v) out.push(v); }
  return { releases: out };
}

// ---------------------------------------------------------------- the songs a wallet holds
/** The inscription numbers a wallet holds on the Xtrata core (up to HELD_MAX). Rejects when that cannot be read. */
export type Held = (wallet: string) => Promise<number[]>;

/** The ready songs this wallet holds, for the release picker. A failed read is an error, never an empty list. */
export async function songsHeld(env: ReleaseEnv, wallet: unknown, held: Held): Promise<{ songs: { id: number; title: string; artist: string }[]; more: boolean }> {
  requireOn(env);
  if (typeof wallet !== 'string' || !isMainnetStandardAddress(wallet)) throw new GiftError('A mainnet wallet address is required.', 400);
  let ids: number[];
  try { ids = await held(wallet); } catch { throw new GiftError('Could not read what this wallet holds right now. Try again shortly.', 503); }
  await ensureGiftTables(env);
  const songs: { id: number; title: string; artist: string }[] = [];
  const unique = [...new Set(ids)].filter((n) => Number.isSafeInteger(n) && n > 0).sort((a, b) => a - b);
  for (let i = 0; i < unique.length; i += 100) {
    const found = await catalogueSongs(env, unique.slice(i, i + 100));
    for (const [id, s] of found) if (!s.hidden) songs.push({ id, title: s.title, artist: s.artist });
  }
  songs.sort((a, b) => a.id - b.id);
  return { songs, more: ids.length >= HELD_MAX };
}

export function hiroHeld(env: ReleaseEnv): Held {
  return async (wallet) => {
    const out: number[] = [];
    for (let offset = 0; offset < HELD_MAX; offset += 200) {
      const path = `/extended/v1/tokens/nft/holdings?principal=${wallet}&asset_identifiers=${encodeURIComponent(CORE_ASSET)}&limit=200&offset=${offset}`;
      let page: { total?: unknown; results?: unknown } | null = null;
      for (let attempt = 0; attempt < 3 && !page; attempt++) {
        const keys = [...getHiroApiKeys(env), null];
        for (let i = 0; i < keys.length && !page; i++) {
          const headers = new Headers(); applyHiroApiKey(headers, keys[i]);
          const r = await fetch(HIRO + path, { headers, signal: AbortSignal.timeout(10_000) });
          if (r.ok) { page = await r.json() as { total?: unknown; results?: unknown }; break; }
          if (i < keys.length - 1 && shouldRetryWithNextHiroKey(r.status)) continue;
          if (!isTransientHiroStatus(r.status)) throw new Error('holdings unavailable');
        }
        if (!page) await new Promise((ok) => setTimeout(ok, 300 * (attempt + 1)));
      }
      if (!page || !Array.isArray(page.results) || !Number.isSafeInteger(page.total)) throw new Error('holdings unavailable');
      for (const h of page.results as any[]) { const m = /^u(\d{1,12})$/.exec(String(h?.value?.repr ?? '')); if (!m) throw new Error('holdings unreadable'); out.push(Number(m[1])); }
      if (offset + 200 >= (page.total as number)) break;
    }
    return out;
  };
}

// ---------------------------------------------------------------- a player's shelf
export interface ShelfItem extends ReleaseView { hidden: boolean; addedAt: number }

async function shelfOf(env: ReleaseEnv, player: string): Promise<ShelfItem[]> {
  const list = await rows<{ release: string; added_at: number; hidden: number; artist: string; created_at: number; price: number }>(env,
    `SELECT s.release, s.added_at, s.hidden, r.artist, r.created_at, r.price FROM radio_release_shelf s JOIN radio_releases r ON r.id=s.release
      WHERE s.player=? AND s.removed_at IS NULL ORDER BY s.added_at DESC LIMIT ?`, [player, SHELF_MAX]);
  const out: ShelfItem[] = [];
  for (const s of list) { const v = await view(env, { id: s.release, artist: s.artist, created_at: s.created_at, price: s.price }); if (v) out.push({ ...v, hidden: !!s.hidden, addedAt: Number(s.added_at) }); }
  return out;
}

/**
 * One signed request about a player's shelf: add, hide, show, remove, or just read it. Always answers with the shelf
 * as it now stands. Only the player's own key can ask (the signature names the player and the action), a request is
 * good for a few minutes, and an older one than the last accepted is refused.
 */
export async function shelfAct(env: ReleaseEnv, body: { request?: ShelfRequest; signature?: unknown }, now: number): Promise<{ albums: ShelfItem[]; pay?: OrderView }> {
  requireOn(env);
  let req: ShelfRequest;
  try { req = validateShelfRequest(body?.request as ShelfRequest, now); } catch (e) { throw new GiftError((e as Error).message, 400); }
  if (!verifyShelfSignature(req, body.signature)) throw new GiftError('That request was not signed by this player.', 403);
  await ensureReleaseTables(env);
  const moved = await run(env, 'INSERT INTO radio_release_seen(player, issued) VALUES(?, ?) ON CONFLICT(player) DO UPDATE SET issued=excluded.issued WHERE excluded.issued > radio_release_seen.issued', [req.player, req.issued]) as { meta?: { changes?: number }; changes?: number };
  if (!(moved?.meta?.changes ?? moved?.changes)) throw new GiftError('That request was already used. Try again.', 409);
  if (req.action === 'add') {
    const r = await one<ReleaseRow>(env, 'SELECT * FROM radio_releases WHERE id=?', [req.release]);
    if (!r || !(await playerView(env, r.id))) throw new GiftError('That release was not found.', 404);
    const have = await one<{ n: number }>(env, 'SELECT COUNT(*) AS n FROM radio_release_shelf WHERE player=? AND removed_at IS NULL AND release<>?', [req.player, req.release]);
    if (Number(have?.n) >= SHELF_MAX) throw new GiftError(`A player keeps up to ${SHELF_MAX} albums. Remove one first.`, 409);
    // A release with a price is added by paying its artist. Once paid it is this player's for good (removing it and
    // adding it again costs nothing), and one already on the shelf from before it had a price simply stays.
    const price = BigInt(r.price ?? 0);
    if (price > 0n) {
      const order = await one<OrderRow>(env, 'SELECT * FROM radio_release_orders WHERE release=? AND player=?', [req.release, req.player]);
      const onShelf = await one<{ n: number }>(env, 'SELECT COUNT(*) AS n FROM radio_release_shelf WHERE player=? AND release=? AND removed_at IS NULL', [req.player, req.release]);
      if (order?.status !== 'paid' && !Number(onShelf?.n)) {
        if (!salesEnabled(env)) throw new GiftError('This album is for sale, and sales are paused right now. Nothing was taken.', 503);
        return { albums: await shelfOf(env, req.player), pay: await openOrder(env, r, req.player, price, order, now) };
      }
    }
    await run(env, `INSERT INTO radio_release_shelf(player, release, added_at, hidden, removed_at) VALUES(?, ?, ?, 0, NULL)
      ON CONFLICT(player, release) DO UPDATE SET hidden=0, added_at=CASE WHEN removed_at IS NULL THEN added_at ELSE excluded.added_at END, removed_at=NULL`, [req.player, req.release, now]);
  } else if (req.action !== 'list') {
    const sql = req.action === 'remove' ? 'UPDATE radio_release_shelf SET removed_at=? WHERE player=? AND release=? AND removed_at IS NULL'
      : `UPDATE radio_release_shelf SET hidden=${req.action === 'hide' ? 1 : 0} WHERE player=? AND release=? AND removed_at IS NULL`;
    const done = await run(env, sql, req.action === 'remove' ? [now, req.player, req.release] : [req.player, req.release]) as { meta?: { changes?: number }; changes?: number };
    if (!(done?.meta?.changes ?? done?.changes)) throw new GiftError('That album is not in this player.', 404);
  }
  return { albums: await shelfOf(env, req.player) };
}

// ---------------------------------------------------------------- selling a release (stage 3)
type OrderRow = { id: string; release: string; player: string; artist: string; price: number; status: 'pending' | 'paid'; txid: string | null; created_at: number; paid_at: number | null };
const orderView = (o: OrderRow): OrderView => ({ order: o.id, release: o.release, to: o.artist, amount: String(BigInt(o.price)), memo: orderMemo(o.id), status: o.status === 'paid' ? 'paid' : o.txid ? 'confirming' : 'pending' });
const newOrderId = () => [...crypto.getRandomValues(new Uint8Array(8))].map((b) => b.toString(16).padStart(2, '0')).join('');

/**
 * The artist signs a price for their release (0 makes it free again). Only the wallet that made the release can, and
 * an older signed price than the last accepted one is refused. Players that already have the album keep it.
 */
export async function setPrice(env: ReleaseEnv, body: { request?: PriceRequest; signature?: unknown }, now: number): Promise<ReleaseView> {
  requireOn(env);
  if (!salesEnabled(env)) throw new GiftError('Selling releases is not open yet.', 404);
  let req: PriceRequest;
  try { req = validatePriceRequest(body?.request as PriceRequest, now); } catch (e) { throw new GiftError((e as Error).message, 400); }
  if (!verifyPriceSignature(req, body.signature)) throw new GiftError('That price was not signed by this wallet.', 403);
  await ensureReleaseTables(env);
  const r = await one<ReleaseRow>(env, 'SELECT * FROM radio_releases WHERE id=?', [req.release]);
  if (!r) throw new GiftError('That release was not found.', 404);
  if (r.artist !== req.artist) throw new GiftError('Only the wallet that made a release can set its price.', 403);
  const done = await run(env, 'UPDATE radio_releases SET price=?, price_issued=? WHERE id=? AND artist=? AND price_issued<?', [Number(req.price), req.issued, req.release, req.artist, req.issued]) as { meta?: { changes?: number }; changes?: number };
  if (!(done?.meta?.changes ?? done?.changes)) throw new GiftError('That request was already used. Sign a new one.', 409);
  return releaseView(env, req.release);
}

/** The order for this player and release: the one already open (at the price it was opened at once a payment is on its way), or a new one. */
async function openOrder(env: ReleaseEnv, r: ReleaseRow, player: string, price: bigint, existing: OrderRow | null, now: number): Promise<OrderView> {
  if (existing) {
    if (!existing.txid && BigInt(existing.price) !== price) await run(env, "UPDATE radio_release_orders SET price=? WHERE id=? AND status='pending' AND txid IS NULL", [Number(price), existing.id]);
    return orderView((await one<OrderRow>(env, 'SELECT * FROM radio_release_orders WHERE id=?', [existing.id]))!);
  }
  const id = newOrderId();
  await run(env, "INSERT OR IGNORE INTO radio_release_orders(id, release, player, artist, price, status, created_at) VALUES(?, ?, ?, ?, ?, 'pending', ?)", [id, r.id, player, r.artist, Number(price), now]);
  return orderView((await one<OrderRow>(env, 'SELECT * FROM radio_release_orders WHERE release=? AND player=?', [r.id, player]))!);
}

/** An order as anyone holding its id may see it: where to pay, how much, the memo, and whether it is paid. */
export async function orderStatus(env: ReleaseEnv, id: unknown): Promise<OrderView> {
  requireOn(env);
  if (!isOrderId(id)) throw new GiftError('Unknown order.', 404);
  await ensureReleaseTables(env);
  const o = await one<OrderRow>(env, 'SELECT * FROM radio_release_orders WHERE id=?', [id]);
  if (!o) throw new GiftError('Unknown order.', 404);
  return orderView(o);
}

/**
 * Looks for an order's payment on chain: by the transaction id when given, else by the memo among the artist's recent
 * deposits. The payment may come from any wallet; what must match is the artist, the memo and at least the price.
 * Only a CONFIRMED match puts the album in the player (in one transaction with marking the order paid). A paid order
 * stays paid whatever happens to the price or to sales afterwards.
 */
export async function orderPaid(env: ReleaseEnv, body: { order?: unknown; txid?: unknown }, chain: Pick<GiftChain, 'transfer' | 'inbound'>, now: number): Promise<OrderView> {
  requireOn(env);
  if (!isOrderId(body?.order)) throw new GiftError('Unknown order.', 404);
  let txid: string | null = null;
  if (body.txid !== undefined && body.txid !== null && body.txid !== '') {
    txid = typeof body.txid === 'string' ? '0x' + body.txid.replace(/^0x/, '').toLowerCase() : '';
    if (!/^0x[0-9a-f]{64}$/.test(txid)) throw new GiftError('Transaction id required.', 400);
  }
  await ensureReleaseTables(env);
  const o = await one<OrderRow>(env, 'SELECT * FROM radio_release_orders WHERE id=?', [body.order]);
  if (!o) throw new GiftError('Unknown order.', 404);
  if (o.status === 'paid') return orderView(o);
  const memo = orderMemo(o.id);
  const matches = (t: ChainTransfer) => t.recipient === o.artist && t.memo === memo && t.amount >= BigInt(o.price);
  let t: (ChainTransfer & { txid: string }) | null = null;
  const known = txid ?? o.txid;
  try {
    if (known) { const x = await chain.transfer(known); t = x ? { ...x, txid: known } : null; }
    else t = (await chain.inbound(o.artist)).find((x) => matches(x) && (x.status === 'success' || x.status === 'pending')) ?? null;
  } catch { throw new GiftError('The payment could not be looked up right now. Nothing is lost: try again shortly.', 503); }
  if (!t) return orderView(o); // not seen yet
  if (!matches(t)) throw new GiftError(`That transaction does not pay this order (it needs the memo “${memo}”, the artist’s address and at least ${stxText(BigInt(o.price))} STX).`, 400);
  if (t.status === 'aborted' || t.status === 'dropped') {
    await run(env, "UPDATE radio_release_orders SET txid=NULL WHERE id=? AND status='pending' AND txid=?", [o.id, t.txid]);
    throw new GiftError('That payment did not go through. Nothing was taken; try again.', 400);
  }
  if (o.txid !== t.txid) await run(env, "UPDATE radio_release_orders SET txid=? WHERE id=? AND status='pending'", [t.txid, o.id]);
  if (t.status === 'pending') return orderView({ ...o, txid: t.txid });
  const db = (env as any).DB;
  await db.batch([
    db.prepare("UPDATE radio_release_orders SET status='paid', paid_at=?, txid=? WHERE id=? AND status='pending'").bind(now, t.txid, o.id),
    db.prepare(`INSERT INTO radio_release_shelf(player, release, added_at, hidden, removed_at) VALUES(?, ?, ?, 0, NULL)
      ON CONFLICT(player, release) DO UPDATE SET hidden=0, added_at=CASE WHEN removed_at IS NULL THEN added_at ELSE excluded.added_at END, removed_at=NULL`).bind(o.player, o.release, now)
  ]);
  return orderView({ ...o, status: 'paid', txid: t.txid });
}
