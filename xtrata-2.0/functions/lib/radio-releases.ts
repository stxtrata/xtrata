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
import { catalogueSongs, ensureGiftTables, GiftError, playerView, storePlayer, type GiftDeps, type GiftEnv } from './radio-gifts';
import { isMainnetStandardAddress } from '../../src/lib/listening-wallet/link';
import { isPlayerId, validatePlayer, type PlayerDefinition, type PlayerView } from '../../src/lib/listening-wallet/gift-players';
import {
  releaseDigest, SHELF_MAX, validateReleaseRequest, validateShelfRequest, verifyReleaseSignature, verifyShelfSignature, type ReleaseRequest, type ShelfRequest
} from '../../src/lib/music-releases/release';

export type ReleaseEnv = GiftEnv & { RADIO_RELEASES_ENABLED?: string };
export const releasesEnabled = (env: ReleaseEnv) => env.RADIO_RELEASES_ENABLED === '1';
/** Releases one wallet may make in a day. */
export const RELEASES_PER_DAY = 20;
/** Inscriptions looked through when listing the songs a wallet holds. */
export const HELD_MAX = 600;
const CORE_ASSET = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3::xtrata-inscription';
const HIRO = 'https://api.mainnet.hiro.so';

const rows = async <T,>(env: ReleaseEnv, sql: string, binds: unknown[] = []) => ((await queryAll(env, sql, binds)).results ?? []) as T[];
const one = async <T,>(env: ReleaseEnv, sql: string, binds: unknown[] = []) => (await rows<T>(env, sql, binds))[0] ?? null;
const requireOn = (env: ReleaseEnv) => { if (!releasesEnabled(env)) throw new GiftError('Releases are not open yet.', 404); };

export async function ensureReleaseTables(env: ReleaseEnv) {
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

export interface ReleaseView extends PlayerView { artist: string; createdAt: number; /** players that have this release on their shelf */ added: number }

async function view(env: ReleaseEnv, r: { id: string; artist: string; created_at: number }): Promise<ReleaseView | null> {
  const p = await playerView(env, r.id);
  if (!p) return null;
  const n = await one<{ n: number }>(env, 'SELECT COUNT(*) AS n FROM radio_release_shelf WHERE release=? AND removed_at IS NULL', [r.id]);
  return { ...p, tracks: p.tracks.filter((t) => !t.hidden), artist: r.artist, createdAt: Number(r.created_at), added: Number(n?.n) || 0 };
}

/** One release, as anyone may see it. */
export async function releaseView(env: ReleaseEnv, id: unknown): Promise<ReleaseView> {
  requireOn(env);
  if (!isPlayerId(id)) throw new GiftError('That is not a release.', 404);
  await ensureReleaseTables(env);
  const r = await one<{ id: string; artist: string; created_at: number }>(env, 'SELECT * FROM radio_releases WHERE id=?', [id]);
  const v = r ? await view(env, r) : null;
  if (!v) throw new GiftError('That release was not found.', 404);
  return v;
}

/** An artist's releases, newest first. */
export async function releasesBy(env: ReleaseEnv, artist: unknown): Promise<{ releases: ReleaseView[] }> {
  requireOn(env);
  if (typeof artist !== 'string' || !isMainnetStandardAddress(artist)) throw new GiftError('A mainnet wallet address is required.', 400);
  await ensureReleaseTables(env);
  const list = await rows<{ id: string; artist: string; created_at: number }>(env, 'SELECT * FROM radio_releases WHERE artist=? ORDER BY created_at DESC LIMIT 50', [artist]);
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
  const list = await rows<{ release: string; added_at: number; hidden: number; artist: string; created_at: number }>(env,
    `SELECT s.release, s.added_at, s.hidden, r.artist, r.created_at FROM radio_release_shelf s JOIN radio_releases r ON r.id=s.release
      WHERE s.player=? AND s.removed_at IS NULL ORDER BY s.added_at DESC LIMIT ?`, [player, SHELF_MAX]);
  const out: ShelfItem[] = [];
  for (const s of list) { const v = await view(env, { id: s.release, artist: s.artist, created_at: s.created_at }); if (v) out.push({ ...v, hidden: !!s.hidden, addedAt: Number(s.added_at) }); }
  return out;
}

/**
 * One signed request about a player's shelf: add, hide, show, remove, or just read it. Always answers with the shelf
 * as it now stands. Only the player's own key can ask (the signature names the player and the action), a request is
 * good for a few minutes, and an older one than the last accepted is refused.
 */
export async function shelfAct(env: ReleaseEnv, body: { request?: ShelfRequest; signature?: unknown }, now: number): Promise<{ albums: ShelfItem[] }> {
  requireOn(env);
  let req: ShelfRequest;
  try { req = validateShelfRequest(body?.request as ShelfRequest, now); } catch (e) { throw new GiftError((e as Error).message, 400); }
  if (!verifyShelfSignature(req, body.signature)) throw new GiftError('That request was not signed by this player.', 403);
  await ensureReleaseTables(env);
  const moved = await run(env, 'INSERT INTO radio_release_seen(player, issued) VALUES(?, ?) ON CONFLICT(player) DO UPDATE SET issued=excluded.issued WHERE excluded.issued > radio_release_seen.issued', [req.player, req.issued]) as { meta?: { changes?: number }; changes?: number };
  if (!(moved?.meta?.changes ?? moved?.changes)) throw new GiftError('That request was already used. Try again.', 409);
  if (req.action === 'add') {
    const r = await one<{ id: string; artist: string; created_at: number }>(env, 'SELECT * FROM radio_releases WHERE id=?', [req.release]);
    if (!r || !(await playerView(env, r.id))) throw new GiftError('That release was not found.', 404);
    const have = await one<{ n: number }>(env, 'SELECT COUNT(*) AS n FROM radio_release_shelf WHERE player=? AND removed_at IS NULL AND release<>?', [req.player, req.release]);
    if (Number(have?.n) >= SHELF_MAX) throw new GiftError(`A player keeps up to ${SHELF_MAX} albums. Remove one first.`, 409);
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
