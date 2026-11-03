// @vitest-environment node
import {describe, expect, it, vi} from 'vitest';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {paidPlaysPage, refreshMusicStats, songPaidPlays, MAX_PAGES_PER_REFRESH, PAGE_SIZE} from '../music-stats';
import {likesFor, paidPlaysFor, songCounts} from '../onchain-counts';
import {songStats} from '../../radio/song-stats';
import {onRequest as musicPlays} from '../../api/music-plays';
const {DatabaseSync} = createRequire(import.meta.url)('node:sqlite');

function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(readFileSync('functions/migrations/022_music_paid_plays.sql', 'utf8'));
  const statement = (query: string) => {
    let args: any[] = [];
    const s: any = {
      bind(...values: any[]) { args = values; return s; },
      async first() { return sql.prepare(query).get(...args) ?? null; },
      async all() { return {results: sql.prepare(query).all(...args)}; },
      async run() { sql.prepare(query).run(...args); return {}; }
    };
    return s;
  };
  return {sql, prepare: statement, async batch(list: any[]) { for (const s of list) await s.run(); return []; }};
}

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0';
const hex = (n: number) => '0x' + n.toString(16).padStart(64, '0');
/** A contract log where every event carries the song's running total, exactly as the contract prints it. */
function contractLog(songs: number[]) {
  const running = new Map<number, number>();
  return songs.map((song, i) => {
    const total = (running.get(song) ?? 0) + 1; running.set(song, total);
    const repr = `(tuple (amount u50) (core u3) (event "radio-paid-play") (id u${song}) (payer 'SP${String(i % 4).padStart(10, '0')}) (recipient 'SP9999999999) (total u${total}) (version u1))`;
    return {event_type: 'smart_contract_log', tx_id: hex(i + 1), block_time: 1_790_000_000 + i, contract_log: {contract_id: CONTRACT, topic: 'print', value: {repr}}};
  });
}
function hiro(log: any[]) {
  return (async (url: any) => {
    const u = new URL(String(url));
    const offset = Number(u.searchParams.get('offset')), limit = Number(u.searchParams.get('limit'));
    const body: any = {limit, offset, results: log.slice().reverse().slice(offset, offset + limit)};
    if (u.pathname.includes('/v2/')) body.total = log.length;
    return Response.json(body);
  }) as unknown as typeof fetch;
}
const contractTotal = (log: any[], song: number) => Math.max(0, ...log.map(e => e.contract_log.value.repr).filter((r: string) => r.includes(`(id u${song})`)).map((r: string) => Number(/total u(\d+)/.exec(r)![1])));

describe('one source for on-chain song counts', () => {
  const songs = Array.from({length: 240}, (_, i) => [3567, 2978, 785, 3567, 1107][i % 5]);
  const log = contractLog(songs);

  it('the index gives every song exactly the contract’s own running total', async () => {
    const db = database();
    await refreshMusicStats({DB: db as any}, hiro(log), Date.now());
    const counts = await songPaidPlays({DB: db as any});
    for (const song of [3567, 2978, 785, 1107]) expect(counts.get(song)).toBe(contractTotal(log, song));
    expect(counts.get(3567)).toBe(96);
  });

  it('catalogue, radio display and history all read those same numbers', async () => {
    const db = database();
    await refreshMusicStats({DB: db as any}, hiro(log), Date.now());
    const env = {DB: db} as any; // likes contract not configured here
    const c = await songCounts(env, [3567, 4000]);
    expect([paidPlaysFor(c, 3567), paidPlaysFor(c, 4000), c.paidPlaysStatus]).toEqual([96, 0, 'ready']);
    expect([likesFor(c, 3567), c.likesStatus]).toEqual([null, 'disabled']);
    expect(await songStats(env, 3567)).toEqual({id: 3567, likes: null, plays: 96});
    const page = await paidPlaysPage(env, 0, 3);
    expect(page.total).toBe(240);
    // newest first, each with the song's running total at that play: what the contract printed
    expect(page.results.map(p => [p.txid, p.id, p.total])).toEqual([[hex(240), 1107, 48], [hex(239), 3567, 96], [hex(238), 785, 48]]);
    const res = await musicPlays({request: new Request('https://xtrata.xyz/api/music-plays?offset=0&limit=2'), env});
    expect((await res.json()).results).toHaveLength(2);
    expect((await musicPlays({request: new Request('https://xtrata.xyz/api/music-plays?limit=501'), env})).status).toBe(400);
  });

  it('says it is still catching up instead of passing off a partial copy as complete', async () => {
    const big = contractLog(Array.from({length: MAX_PAGES_PER_REFRESH * PAGE_SIZE + 60}, (_, i) => 100 + (i % 7)));
    const db = database();
    await refreshMusicStats({DB: db as any}, hiro(big), Date.now());
    const c = await songCounts({DB: db} as any, [100], {likes: false});
    expect(c.paidPlaysStatus).toBe('syncing');
    expect((await paidPlaysPage({DB: db} as any, 0, 5)).total).toBeNull();
  });

  it('is unknown, never zero, without the index', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw Error('offline'); }));
    try {
      const c = await songCounts({} as any, [3567]);
      expect([paidPlaysFor(c, 3567), c.paidPlaysStatus]).toEqual([null, 'unavailable']);
    } finally { vi.unstubAllGlobals(); }
  });
});
