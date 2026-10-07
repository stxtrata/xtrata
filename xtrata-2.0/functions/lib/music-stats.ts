// @ts-ignore Plain JS module shared with the browser readers; it ships no declarations.
import {PAID_PLAYS_CONTRACT, parsePaidPlayEvent} from '../../public/radio/paid-play-event.mjs';

/**
 * Tally of paid plays for the homepage banner and hero.
 *
 * The contract has no global counter, so this copies each paid-play receipt into D1 once
 * and counts from there. Sync is oldest-first by absolute log position with a single
 * contiguous cursor: a page that fails or slides because new events arrived never
 * advances the cursor past a gap, and re-reading a page is harmless (txid is the key).
 * A read that failed is reported as failed, never as zero.
 */
export const PAGE_SIZE = 20;
export const MAX_PAGES_PER_REFRESH = 120;
export const MIN_REFRESH_MS = 20_000;
const HIRO = 'https://api.mainnet.hiro.so';

type Db = {prepare(query: string): any; batch(statements: any[]): Promise<any[]>};
export type StatsEnv = {DB?: Db; HIRO_API_KEY?: string};
type Transport = typeof fetch;
type LogPage = {total: number; results: any[]};

export type MusicStats = {
  version: 1;
  supporters: number;
  plays: number;
  microStx: number;
  latest: Array<{txid: string; song: number; core: number; payer: string; recipient: string; at: number | null}>;
  complete: boolean;
  checkedAt: number | null;
  contract: string;
};

async function hiroPage(env: StatsEnv, transport: Transport, offset: number, limit: number): Promise<LogPage> {
  const headers: Record<string, string> = {};
  if (env.HIRO_API_KEY) headers['x-api-key'] = env.HIRO_API_KEY;
  const id = encodeURIComponent(PAID_PLAYS_CONTRACT);
  let last: unknown;
  for (const path of [
    `/extended/v2/smart-contracts/${id}/logs?limit=${limit}&offset=${offset}`,
    `/extended/v1/contract/${id}/events?limit=${limit}&offset=${offset}`
  ]) {
    try {
      const response = await transport(HIRO + path, {headers, signal: AbortSignal.timeout(8000)});
      if (response.status === 429) throw Object.assign(Error('Hiro rate limit'), {status: 429});
      if (!response.ok) throw Error(`Hiro HTTP ${response.status}`);
      const data: any = await response.json();
      if (!Array.isArray(data.results) || !Number.isSafeInteger(data.total) || data.total < 0) throw Error('Invalid contract log response');
      return {total: data.total, results: data.results};
    } catch (error: any) {
      if (error?.status === 429) throw error;
      last = error;
    }
  }
  throw last instanceof Error ? last : Error('Contract activity is unavailable');
}

async function readState(db: Db): Promise<{cursor: number; total: number; checkedAt: number}> {
  const rows = (await db.prepare('SELECT key, value FROM music_stats_state').all()).results as Array<{key: string; value: number}>;
  const get = (key: string) => Number(rows.find(row => row.key === key)?.value ?? 0);
  return {cursor: get('cursor'), total: get('total'), checkedAt: get('checked_at')};
}

const upsertState = (db: Db, key: string, value: number, keepHighest = false) =>
  db.prepare(
    `INSERT INTO music_stats_state(key, value) VALUES(?, ?)
     ON CONFLICT(key) DO UPDATE SET value = ${keepHighest ? 'MAX(value, excluded.value)' : 'excluded.value'}`
  ).bind(key, value);

export type RefreshResult = {ok: boolean; skipped?: boolean; copied: number; cursor: number; total: number; error?: string};

export async function refreshMusicStats(env: StatsEnv, transport: Transport = fetch, now = Date.now()): Promise<RefreshResult> {
  const db = env.DB;
  if (!db) throw Error('Missing D1 binding');
  const state = await readState(db);
  if (now - state.checkedAt < MIN_REFRESH_MS) return {ok: true, skipped: true, copied: 0, cursor: state.cursor, total: state.total};
  // Claim the slot first so simultaneous visitors do not all read the chain.
  await upsertState(db, 'checked_at', now).run();
  let cursor = state.cursor, total: number | null = null, pages = 0, copied = 0;
  try {
    while (pages < MAX_PAGES_PER_REFRESH) {
      if (total === null) total = (await hiroPage(env, transport, 0, 1)).total;
      if (cursor >= total) break;
      const start = cursor + 1;
      const end = Math.min(start + PAGE_SIZE - 1, total);
      const offset = total - end;
      const page = await hiroPage(env, transport, offset, end - start + 1);
      pages++;
      total = page.total;
      if (!page.results.length) break;
      // Results are newest first; absolute position of result j is high - j.
      const high = total - offset;
      const low = high - page.results.length + 1;
      if (low > cursor + 1) continue; // New events slid this page newer; re-aim with the new total.
      const writes: any[] = [];
      page.results.forEach((event, j) => {
        const pos = high - j;
        if (pos <= cursor) return;
        const play = parsePaidPlayEvent(event);
        if (!play) return; // Not a valid paid play; still consumes a log position.
        writes.push(db.prepare(
          'INSERT OR IGNORE INTO music_paid_plays(txid, pos, payer, recipient, core, song_id, block_time) VALUES(?, ?, ?, ?, ?, ?, ?)'
        ).bind(play.txid, pos, play.payer, play.recipient, play.core, play.id, play.timestamp ?? null));
      });
      writes.push(upsertState(db, 'cursor', high, true), upsertState(db, 'total', total));
      await db.batch(writes);
      copied += writes.length - 2;
      cursor = high;
    }
    if (total !== null) await upsertState(db, 'total', total).run();
    return {ok: true, copied, cursor, total: total ?? state.total};
  } catch (error: any) {
    return {ok: false, copied, cursor, total: total ?? state.total, error: String(error?.message || error).slice(0, 200)};
  }
}

export async function readMusicStats(env: StatsEnv): Promise<MusicStats> {
  const db = env.DB;
  if (!db) throw Error('Missing D1 binding');
  const [totals, latest, state] = await Promise.all([
    db.prepare('SELECT COUNT(*) AS plays, COUNT(DISTINCT payer) AS supporters FROM music_paid_plays').first(),
    db.prepare('SELECT txid, payer, recipient, core, song_id, block_time FROM music_paid_plays ORDER BY pos DESC LIMIT 3').all(),
    readState(db)
  ]);
  const plays = Number(totals?.plays ?? 0);
  return {
    version: 1,
    supporters: Number(totals?.supporters ?? 0),
    plays,
    microStx: plays * 50,
    latest: (latest.results as any[]).map(row => ({
      txid: row.txid, song: Number(row.song_id), core: Number(row.core), payer: row.payer, recipient: row.recipient,
      at: row.block_time ? Number(row.block_time) : null
    })),
    complete: state.total > 0 && state.cursor >= state.total,
    checkedAt: state.checkedAt || null,
    contract: PAID_PLAYS_CONTRACT
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
    let stats = await readMusicStats(env);
    const state = await readState(env.DB);
    if (now - state.checkedAt >= MIN_REFRESH_MS) {
      const refresh = refreshMusicStats(env, transport, now);
      if (stats.plays === 0 && state.cursor === 0) {
        // First ever visit: wait, so the first reader gets real numbers.
        await refresh;
        stats = await readMusicStats(env);
      } else if (waitUntil) waitUntil(refresh);
      else await refresh;
    }
    return reply(stats, 200, 'public, max-age=15');
  } catch {
    return reply({error: 'Music statistics are not activated yet. The operator must apply migration 022.'}, 503);
  }
}
