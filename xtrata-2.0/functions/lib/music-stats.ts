// @ts-ignore Plain JS module shared with the browser readers; it ships no declarations.
import {PAID_PLAYS_CONTRACT, parsePaidPlayEvent} from '../../public/radio/paid-play-event.mjs';
import {radioArtist, radioTitle} from '../../src/lib/radio/artist-credits.mjs';
import {applyHiroApiKey, getHiroApiKeys, shouldRetryWithNextHiroKey} from './hiro-keys';

/**
 * Tally of paid plays for the homepage banner and hero.
 *
 * The contract has no global counter, so this copies each paid-play receipt into D1 once
 * and counts from there. Sync is oldest-first by absolute log position with a single
 * contiguous cursor: a page that fails or slides because new events arrived never
 * advances the cursor past a gap, and re-reading a page is harmless (txid is the key).
 * A read that failed is reported as failed, never as zero.
 */
// Hiro caps `limit` at 50 on both log endpoints.
export const PAGE_SIZE = 50;
// Pages are read WAVE_PAGES at a time, in parallel, then confirmed with one total read. A Pages
// Function may make only a limited number of outbound requests per call (50 on the free plan), so
// one refresh stays inside it: 4 waves of 8 pages is 4 x 9 + 1 = 37 reads.
export const WAVE_PAGES = 8;
export const MAX_PAGES_PER_REFRESH = 32;
// How often the chain is read once the tally is complete and healthy.
export const MIN_REFRESH_MS = 20_000;
// While history is still being copied the next batch may start almost at once.
export const CATCHUP_REFRESH_MS = 3_000;
// The first visitor waits for this much history; the rest is copied by the next requests.
export const FIRST_VISIT_PAGES = 16;

type Db = {prepare(query: string): any; batch(statements: any[]): Promise<any[]>};
export type StatsEnv = {DB?: Db} & Record<string, unknown>;
type Transport = typeof fetch;
// `total` is null when the endpoint that answered does not report one (the v1 events endpoint).
type LogPage = {total: number | null; results: any[]};
// Hiro's v2 logs endpoint rejects offsets above this with HTTP 400; older history needs the v1 endpoint.
const V2_MAX_OFFSET = 1000;
// Reported as syncError when Hiro answered but the body was not a contract log page.
const INVALID_RESPONSE = -2;

export type MusicStats = {
  version: 1;
  supporters: number;
  plays: number;
  microStx: number;
  /** Newest first. title, artist and artwork are null when the song's details are not known (yet). */
  latest: Array<{
    txid: string; song: number; core: number; payer: string; recipient: string; at: number | null;
    title: string | null; artist: string | null; artwork: string | null;
  }>;
  complete: boolean;
  checkedAt: number | null;
  /** HTTP status of the last failed chain read (-1 for a network error), or null when the last read worked. */
  syncError: number | null;
  contract: string;
};

// Same base-URL rules as the /hiro proxy (functions/lib/hiro-proxy.ts).
const hiroBase = (env: StatsEnv) =>
  String(env.ARCADE_HIRO_API_BASE_MAINNET || env.HIRO_API_BASE_MAINNET || env.VITE_STACKS_API_MAINNET || 'https://api.mainnet.hiro.so')
    .trim().replace(/\/+$/, '');

// Same key rotation as the /hiro proxy: each configured key in turn, then no key.
async function hiroFetch(env: StatsEnv, transport: Transport, url: string): Promise<Response> {
  const attempts: Array<string | null> = [...getHiroApiKeys(env), null];
  let lastError: unknown;
  for (let index = 0; index < attempts.length; index++) {
    const headers = new Headers({accept: 'application/json'});
    applyHiroApiKey(headers, attempts[index]);
    try {
      const response = await transport(url, {headers, signal: AbortSignal.timeout(8000)});
      if (index < attempts.length - 1 && shouldRetryWithNextHiroKey(response.status)) continue;
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : Error('Hiro request failed');
}

async function hiroPage(env: StatsEnv, transport: Transport, offset: number, limit: number): Promise<LogPage> {
  const id = encodeURIComponent(PAID_PLAYS_CONTRACT);
  // v2 reports the running total, but only serves the newest V2_MAX_OFFSET + limit events.
  // v1 serves any offset but reports no total.
  const attempts: Array<{path: string; v2: boolean}> = [];
  if (offset <= V2_MAX_OFFSET) attempts.push({path: `/extended/v2/smart-contracts/${id}/logs?limit=${limit}&offset=${offset}`, v2: true});
  attempts.push({path: `/extended/v1/contract/${id}/events?limit=${limit}&offset=${offset}`, v2: false});
  let last: unknown;
  for (const {path, v2} of attempts) {
    try {
      const response = await hiroFetch(env, transport, hiroBase(env) + path);
      if (response.status === 429) throw Object.assign(Error('Hiro rate limit'), {status: 429});
      if (!response.ok) throw Object.assign(Error(`Hiro HTTP ${response.status}`), {status: response.status});
      const data: any = await response.json();
      const valid = Array.isArray(data?.results) && (!v2 || (Number.isSafeInteger(data.total) && data.total >= 0));
      if (!valid) throw Object.assign(Error('Invalid contract log response'), {status: INVALID_RESPONSE});
      return {total: v2 ? data.total : null, results: data.results};
    } catch (error: any) {
      if (error?.status === 429) throw error;
      last = error;
    }
  }
  throw last instanceof Error ? last : Error('Contract activity is unavailable');
}

// The newest total, or throws. Costs one small v2 read.
async function currentTotal(env: StatsEnv, transport: Transport): Promise<number> {
  const total = (await hiroPage(env, transport, 0, 1)).total;
  if (total === null) throw Object.assign(Error('Invalid contract log response'), {status: INVALID_RESPONSE});
  return total;
}

async function readState(db: Db): Promise<SyncState> {
  const rows = (await db.prepare('SELECT key, value FROM music_stats_state').all()).results as Array<{key: string; value: number}>;
  const get = (key: string) => Number(rows.find(row => row.key === key)?.value ?? 0);
  return {cursor: get('cursor'), total: get('total'), checkedAt: get('checked_at'), lastStatus: get('last_status')};
}

const upsertState = (db: Db, key: string, value: number, keepHighest = false) =>
  db.prepare(
    `INSERT INTO music_stats_state(key, value) VALUES(?, ?)
     ON CONFLICT(key) DO UPDATE SET value = ${keepHighest ? 'MAX(value, excluded.value)' : 'excluded.value'}`
  ).bind(key, value);

type SyncState = {cursor: number; total: number; checkedAt: number; lastStatus: number};
/** Minimum gap before the next chain read: short while catching up, long when complete or failing. */
export const refreshInterval = (state: SyncState) =>
  state.lastStatus === 0 && state.total > 0 && state.cursor < state.total ? CATCHUP_REFRESH_MS : MIN_REFRESH_MS;

export type RefreshResult = {ok: boolean; skipped?: boolean; copied: number; cursor: number; total: number; error?: string};

export async function refreshMusicStats(
  env: StatsEnv,
  transport: Transport = fetch,
  now = Date.now(),
  maxPages = MAX_PAGES_PER_REFRESH
): Promise<RefreshResult> {
  const db = env.DB;
  if (!db) throw Error('Missing D1 binding');
  const state = await readState(db);
  if (now - state.checkedAt < refreshInterval(state)) return {ok: true, skipped: true, copied: 0, cursor: state.cursor, total: state.total};
  // Claim the slot first so simultaneous visitors do not all read the chain.
  await upsertState(db, 'checked_at', now).run();
  let cursor = state.cursor, total: number | null = null, pages = 0, copied = 0;
  try {
    while (pages < maxPages) {
      if (total === null) total = await currentTotal(env, transport);
      if (cursor >= total) break;
      // Plan a wave of contiguous pages, oldest first. Positions are absolute (1 = oldest play);
      // Hiro counts offsets from the newest event.
      const plan: Array<{end: number; offset: number; size: number}> = [];
      for (let start = cursor + 1; start <= total && plan.length < Math.min(WAVE_PAGES, maxPages - pages); start += PAGE_SIZE) {
        const end = Math.min(start + PAGE_SIZE - 1, total);
        plan.push({end, offset: total - end, size: end - start + 1});
      }
      pages += plan.length;
      const settled = await Promise.allSettled(plan.map(item => hiroPage(env, transport, item.offset, item.size)));
      // Offsets were computed from `total`. If a play arrived while reading, every page may have
      // slid newer and a gap could hide at the old end, so confirm and, if it moved, re-aim.
      const latest = await currentTotal(env, transport);
      if (latest !== total) { total = latest; continue; }
      let failure: unknown = null;
      for (let i = 0; i < plan.length; i++) {
        const outcome = settled[i];
        if (outcome.status === 'rejected') { failure = outcome.reason; break; }
        const {end, size} = plan[i];
        const results = outcome.value.results;
        if (results.length !== size) { failure = Object.assign(Error('Invalid contract log response'), {status: INVALID_RESPONSE}); break; }
        const writes: any[] = [];
        // Results are newest first; absolute position of result j is end - j.
        results.forEach((event, j) => {
          const pos = end - j;
          const play = parsePaidPlayEvent(event);
          if (!play) return; // Not a valid paid play; still consumes a log position.
          writes.push(db.prepare(
            'INSERT OR IGNORE INTO music_paid_plays(txid, pos, payer, recipient, core, song_id, block_time) VALUES(?, ?, ?, ?, ?, ?, ?)'
          ).bind(play.txid, pos, play.payer, play.recipient, play.core, play.id, play.timestamp ?? null));
        });
        writes.push(upsertState(db, 'cursor', end, true), upsertState(db, 'total', total));
        await db.batch(writes);
        copied += writes.length - 2;
        cursor = end;
      }
      // Pages before a failed one are kept; the failure is recorded and the next refresh resumes there.
      if (failure) throw failure;
    }
    if (total !== null) await upsertState(db, 'total', total).run();
    await upsertState(db, 'last_status', 0).run();
    return {ok: true, copied, cursor, total: total ?? state.total};
  } catch (error: any) {
    const status = Number.isInteger(error?.status) ? error.status : -1;
    try { await upsertState(db, 'last_status', status).run(); } catch { /* Diagnostics only. */ }
    return {ok: false, copied, cursor, total: total ?? state.total, error: String(error?.message || error).slice(0, 200)};
  }
}

type SongDetails = {title: string | null; artist: string | null; artwork: string | null};

/**
 * Title, artist and artwork for songs on the current core, from the radio catalogue that the
 * Songs page uses (radio_metadata). Only core 3 songs are catalogued, exactly as on /music/heroes.
 * Anything missing stays null so the page can say "Song #id" instead of inventing a name.
 */
async function songDetails(db: Db, rows: any[]): Promise<Map<number, SongDetails>> {
  const ids = [...new Set(rows.filter(row => Number(row.core) === 3).map(row => Number(row.song_id)))];
  const found = new Map<number, SongDetails>();
  if (!ids.length) return found;
  try {
    const result = await db.prepare(
      `SELECT token_id, title, artist, cover FROM radio_metadata WHERE token_id IN (${ids.map(() => '?').join(',')})`
    ).bind(...ids).all();
    for (const row of result.results as any[]) {
      const id = Number(row.token_id);
      const title = radioTitle(id, String(row.title || '')).trim().slice(0, 200);
      const artist = radioArtist(id, String(row.artist || '')).trim().slice(0, 200);
      found.set(id, {
        title: title && !/^Inscription #\d+$/.test(title) ? title : null,
        artist: artist || null,
        artwork: row.cover ? `/radio/artwork?id=${id}` : null
      });
    }
  } catch { /* The catalogue is optional enrichment: without it plays are listed by song number. */ }
  return found;
}

export async function readMusicStats(env: StatsEnv): Promise<MusicStats> {
  const db = env.DB;
  if (!db) throw Error('Missing D1 binding');
  // A pay-per-play listening wallet counts as the main wallet it is linked to (dual-signed link).
  const linked = (sql: string, plain: string) => db.prepare(sql).first().catch(() => db.prepare(plain).first());
  const linkedAll = (sql: string, plain: string) => db.prepare(sql).all().catch(() => db.prepare(plain).all());
  const [totals, latest, state] = await Promise.all([
    linked('SELECT COUNT(*) AS plays, COUNT(DISTINCT COALESCE(l.main, p.payer)) AS supporters FROM music_paid_plays p LEFT JOIN radio_listening_wallets l ON l.listening = p.payer',
      'SELECT COUNT(*) AS plays, COUNT(DISTINCT payer) AS supporters FROM music_paid_plays'),
    linkedAll('SELECT p.txid, COALESCE(l.main, p.payer) AS payer, p.recipient, p.core, p.song_id, p.block_time FROM music_paid_plays p LEFT JOIN radio_listening_wallets l ON l.listening = p.payer ORDER BY p.pos DESC LIMIT 3',
      'SELECT txid, payer, recipient, core, song_id, block_time FROM music_paid_plays ORDER BY pos DESC LIMIT 3'),
    readState(db)
  ]);
  const plays = Number(totals?.plays ?? 0);
  const details = await songDetails(db, latest.results as any[]);
  return {
    version: 1,
    supporters: Number(totals?.supporters ?? 0),
    plays,
    microStx: plays * 50,
    latest: (latest.results as any[]).map(row => ({
      txid: row.txid, song: Number(row.song_id), core: Number(row.core), payer: row.payer, recipient: row.recipient,
      at: row.block_time ? Number(row.block_time) : null,
      ...(Number(row.core) === 3 && details.get(Number(row.song_id)) || {title: null, artist: null, artwork: null})
    })),
    complete: state.total > 0 && state.cursor >= state.total,
    checkedAt: state.checkedAt || null,
    syncError: state.lastStatus === 0 ? null : state.lastStatus,
    contract: PAID_PLAYS_CONTRACT
  };
}

/**
 * The paid-play index is the ONE source for paid-play numbers everywhere (homepage tally, Music
 * Heroes, lounge history, the song catalogue and the radio's ▶ counter). It is a copy of the
 * paid-plays contract's own event log, so it always agrees with the contract once it has caught
 * up. Every reader calls this first: at most one chain check per MIN_REFRESH_MS, and the very
 * first copy (an empty index) is awaited so nobody is shown zeros.
 */
export async function freshenPaidPlayIndex(
  env: StatsEnv,
  {transport = fetch, now = Date.now(), waitUntil, wait = false}: {transport?: Transport; now?: number; waitUntil?: (promise: Promise<unknown>) => void; wait?: boolean} = {}
): Promise<void> {
  const db = env.DB;
  if (!db) throw Error('Missing D1 binding');
  const state = await readState(db);
  if (now - state.checkedAt < refreshInterval(state)) return;
  const first = state.cursor === 0;
  const run = refreshMusicStats(env, transport, now, first ? FIRST_VISIT_PAGES : MAX_PAGES_PER_REFRESH);
  if (first || wait || !waitUntil) await run;
  else waitUntil(run);
}

export type IndexStatus = 'ready' | 'syncing';
/** ready: every play in the contract log is in the index (as of the last check). */
export async function paidPlayIndexStatus(env: StatsEnv): Promise<IndexStatus> {
  const state = await readState(env.DB!);
  return state.total > 0 && state.cursor >= state.total ? 'ready' : 'syncing';
}

/** Paid plays per song on one core, from the index. Songs with none are simply absent (0). */
export async function songPaidPlays(env: StatsEnv, core = 3): Promise<Map<number, number>> {
  const result = await env.DB!.prepare('SELECT song_id, COUNT(*) AS plays FROM music_paid_plays WHERE core = ? GROUP BY song_id').bind(core).all();
  return new Map((result.results as Array<{song_id: number; plays: number}>).map(row => [Number(row.song_id), Number(row.plays)]));
}

export type IndexedPlay = {txid: string; core: number; id: number; amount: number; total: number; payer: string; recipient: string; timestamp?: number};
/**
 * One page of paid plays, newest first, in the same shape the browser readers parse from the
 * contract log (`total` is the song's running count at that play). `total` (the page's) is null
 * while the index is still catching up, so readers keep saying "loading" instead of "complete".
 */
export async function paidPlaysPage(env: StatsEnv, offset: number, limit: number): Promise<{total: number | null; results: IndexedPlay[]}> {
  const db = env.DB!;
  const [count, rows, status] = await Promise.all([
    db.prepare('SELECT COUNT(*) AS n FROM music_paid_plays').first(),
    db.prepare(`SELECT txid, payer, recipient, core, song_id, block_time,
        ROW_NUMBER() OVER (PARTITION BY core, song_id ORDER BY pos) AS running
      FROM music_paid_plays ORDER BY pos DESC LIMIT ? OFFSET ?`).bind(limit, offset).all(),
    paidPlayIndexStatus(env)
  ]);
  return {
    total: status === 'ready' ? Number((count as any)?.n ?? 0) : null,
    results: (rows.results as any[]).map(row => ({
      txid: String(row.txid), core: Number(row.core), id: Number(row.song_id), amount: 50, total: Number(row.running),
      payer: String(row.payer), recipient: String(row.recipient), ...(row.block_time ? {timestamp: Number(row.block_time)} : {})
    }))
  };
}

export async function handleMusicStats(
  request: Request,
  env: StatsEnv,
  transport: Transport = fetch,
  now = Date.now(),
  waitUntil?: (promise: Promise<unknown>) => void
) {
  const reply = (body: unknown, status = 200, cache = 'no-store') => new Response(JSON.stringify(body), {
    status,
    headers: {'content-type': 'application/json', 'cache-control': cache, 'x-content-type-options': 'nosniff'}
  });
  if (request.method !== 'GET') return reply({error: 'GET required'}, 405);
  if (!env.DB) return reply({error: 'Music statistics are not available on this deployment yet.'}, 503);
  try {
    // First ever visit: waits for a first batch so the reader gets real numbers, but not for
    // the whole history. Later refreshes copy the rest in the background.
    await freshenPaidPlayIndex(env, {transport, now, waitUntil});
    const stats = await readMusicStats(env);
    return reply(stats, 200, 'public, max-age=15');
  } catch {
    return reply({error: 'Music statistics are not activated yet. The operator must apply migration 022.'}, 503);
  }
}
