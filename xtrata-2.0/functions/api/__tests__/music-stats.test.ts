// @vitest-environment node
import {describe, it, expect} from 'vitest';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {handleMusicStats, readMusicStats, refreshMusicStats, CATCHUP_REFRESH_MS, WAVE_PAGES, MIN_REFRESH_MS, MAX_PAGES_PER_REFRESH, PAGE_SIZE, FIRST_VISIT_PAGES} from '../../lib/music-stats';
import {parsePaidPlayEvent} from '../../../public/radio/paid-play-event.mjs';
import {aggregateHeroes} from '../../../public/radio/music-heroes.mjs';
const {DatabaseSync} = createRequire(import.meta.url)('node:sqlite');

function database(migrate = true) {
  const sql = new DatabaseSync(':memory:');
  if (migrate) sql.exec(readFileSync('functions/migrations/022_music_paid_plays.sql', 'utf8'));
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
  return {
    sql,
    prepare: statement,
    async batch(list: any[]) {
      sql.exec('BEGIN');
      try { for (const s of list) await s.run(); sql.exec('COMMIT'); } catch (e) { sql.exec('ROLLBACK'); throw e; }
      return [];
    }
  };
}

const CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0';
const hex = (n: number) => '0x' + n.toString(16).padStart(64, '0');
const wallet = (n: number) => 'SP' + String(n).padStart(10, '0');
function event(n: number, payer: number, over: {amount?: number; time?: number | null; contract?: string; txid?: string; core?: number; song?: number} = {}) {
  const repr = `(tuple (amount u${over.amount ?? 50}) (core u${over.core ?? 3}) (event "radio-paid-play") (id u${over.song ?? 3000 + (n % 40)}) (payer '${wallet(payer)}) (receipt 0x584d0102271903001e1e7034b2ac0f3b) (recipient '${wallet(9000 + (n % 7))}) (total u${n}) (version u1))`;
  return {
    event_type: 'smart_contract_log', tx_id: over.txid ?? hex(n),
    ...(over.time === null ? {} : {block_time: over.time ?? 1_790_000_000 + n}),
    contract_log: {contract_id: over.contract ?? CONTRACT, topic: 'print', value: {repr}}
  };
}

/**
 * A fake Hiro that keeps the real API's rules: `log` is oldest first, results are newest first,
 * limit is capped at 50, v2 rejects offsets above 1000 and v1 reports no total.
 */
function hiro(log: any[], hooks: {after?: (call: number) => void; fail?: (call: number) => boolean} = {}) {
  let call = 0;
  const seen: string[] = [];
  const transport = (async (url: any) => {
    call++;
    if (hooks.fail?.(call)) return new Response('{}', {status: 429});
    const u = new URL(String(url));
    const v2 = u.pathname.includes('/v2/');
    seen.push(v2 ? 'v2' : 'v1');
    const offset = Number(u.searchParams.get('offset')), limit = Number(u.searchParams.get('limit'));
    if (limit > 50 || (v2 && offset > 1000)) return Response.json({statusCode: 400, error: 'Bad Request'}, {status: 400});
    const results = log.slice().reverse().slice(offset, offset + limit);
    const body: any = {limit, offset, results};
    if (v2) body.total = log.length;
    hooks.after?.(call);
    return Response.json(body);
  }) as unknown as typeof fetch;
  return {transport, calls: () => call, seen};
}

const T0 = 1_800_000_000_000;

describe('Music supporter statistics', () => {
  it('copies the whole history and agrees with the Music Heroes page rules', async () => {
    const log = Array.from({length: 137}, (_, i) => event(i + 1, 1 + (i * 7) % 23));
    const db = database(), {transport} = hiro(log);
    const result = await refreshMusicStats({DB: db as any}, transport, T0);
    expect(result).toMatchObject({ok: true, copied: 137, cursor: 137, total: 137});
    const stats = await readMusicStats({DB: db as any});
    const heroes = aggregateHeroes(log.map(parsePaidPlayEvent).filter(Boolean));
    expect(stats.plays).toBe(heroes.reduce((n: number, w: any) => n + w.count, 0));
    expect(stats.supporters).toBe(heroes.length);
    expect(stats.supporters).toBe(23);
    expect(stats.microStx).toBe(137 * 50);
    expect(stats.complete).toBe(true);
    expect(stats.latest.map(p => p.txid)).toEqual([hex(137), hex(136), hex(135)]);
    expect(stats.latest[0].at).toBe(1_790_000_137_000); // block_time seconds, stored as milliseconds
  });

  it('resumes a large first sync across refreshes without gaps', async () => {
    const size = MAX_PAGES_PER_REFRESH * PAGE_SIZE + 300;
    const log = Array.from({length: size}, (_, i) => event(i + 1, 1 + (i % 311)));
    const db = database(), {transport} = hiro(log);
    const first = await refreshMusicStats({DB: db as any}, transport, T0);
    expect(first.ok).toBe(true);
    expect(first.cursor).toBe(MAX_PAGES_PER_REFRESH * PAGE_SIZE);
    expect((await readMusicStats({DB: db as any})).complete).toBe(false);
    await refreshMusicStats({DB: db as any}, transport, T0 + MIN_REFRESH_MS);
    const stats = await readMusicStats({DB: db as any});
    expect(stats).toMatchObject({plays: size, supporters: 311, complete: true});
  });

  it('copies only new events on later refreshes and throttles chain reads', async () => {
    const log = Array.from({length: 45}, (_, i) => event(i + 1, 1 + (i % 5)));
    const db = database(), h = hiro(log);
    await refreshMusicStats({DB: db as any}, h.transport, T0);
    const calls = h.calls();
    expect(await refreshMusicStats({DB: db as any}, h.transport, T0 + 1000)).toMatchObject({skipped: true});
    expect(h.calls()).toBe(calls);
    log.push(event(46, 99), event(47, 98));
    const next = await refreshMusicStats({DB: db as any}, h.transport, T0 + MIN_REFRESH_MS);
    expect(next.copied).toBe(2);
    const stats = await readMusicStats({DB: db as any});
    expect(stats).toMatchObject({plays: 47, supporters: 7});
    expect(stats.latest[0].payer).toBe(wallet(98));
  });

  it('idle refresh costs a single chain read', async () => {
    const log = Array.from({length: 30}, (_, i) => event(i + 1, 1));
    const db = database(), h = hiro(log);
    await refreshMusicStats({DB: db as any}, h.transport, T0);
    const before = h.calls();
    await refreshMusicStats({DB: db as any}, h.transport, T0 + MIN_REFRESH_MS);
    expect(h.calls() - before).toBe(1);
  });

  it('never skips events when new ones arrive while a page is being read', async () => {
    const log = Array.from({length: 60}, (_, i) => event(i + 1, 1 + (i % 9)));
    const db = database();
    const h = hiro(log, {after: call => { if (call === 2) log.push(event(61, 50), event(62, 51), event(63, 52)); }});
    await refreshMusicStats({DB: db as any}, h.transport, T0);
    await refreshMusicStats({DB: db as any}, h.transport, T0 + MIN_REFRESH_MS);
    const stats = await readMusicStats({DB: db as any});
    expect(stats.plays).toBe(63);
    expect(stats.supporters).toBe(12);
    expect(stats.complete).toBe(true);
  });

  it('keeps progress and reports failure when the chain read is rate limited', async () => {
    const log = Array.from({length: 3 * PAGE_SIZE}, (_, i) => event(i + 1, 1 + (i % 4)));
    const db = database(), h = hiro(log, {fail: call => call === 4});
    const failed = await refreshMusicStats({DB: db as any}, h.transport, T0);
    expect(failed.ok).toBe(false);
    expect(failed.cursor).toBe(2 * PAGE_SIZE);
    const partial = await readMusicStats({DB: db as any});
    expect(partial.plays).toBe(2 * PAGE_SIZE);
    expect(partial.complete).toBe(false);
    const healed = await refreshMusicStats({DB: db as any}, h.transport, T0 + MIN_REFRESH_MS);
    expect(healed.ok).toBe(true);
    expect((await readMusicStats({DB: db as any})).plays).toBe(3 * PAGE_SIZE);
  });

  it('reads history older than the v2 window through the v1 endpoint', async () => {
    const log = Array.from({length: 1240}, (_, i) => event(i + 1, 1 + (i % 97)));
    const db = database(), h = hiro(log);
    for (let round = 0; round < 6; round++) await refreshMusicStats({DB: db as any}, h.transport, T0 + round * MIN_REFRESH_MS);
    expect(h.seen).toContain('v1');
    const stats = await readMusicStats({DB: db as any});
    const heroes = aggregateHeroes(log.map(parsePaidPlayEvent).filter(Boolean));
    expect(stats).toMatchObject({plays: 1240, supporters: heroes.length, complete: true, syncError: null});
    expect(stats.latest[0].at).not.toBeNull(); // newest events come from v2, which has block times
  });

  it('never skips events when new ones arrive while a v1 page is being read', async () => {
    const log = Array.from({length: 1100}, (_, i) => event(i + 1, 1 + (i % 61)));
    const db = database();
    let slid = false;
    const h = hiro(log, {after: () => { if (!slid && h.seen.at(-1) === 'v1') { slid = true; log.push(event(1101, 900), event(1102, 901)); } }});
    for (let round = 0; round < 6; round++) await refreshMusicStats({DB: db as any}, h.transport, T0 + round * MIN_REFRESH_MS);
    expect(slid).toBe(true);
    expect(await readMusicStats({DB: db as any})).toMatchObject({plays: 1102, supporters: 63, complete: true});
  });

  it('stays within a safe number of chain reads per refresh', async () => {
    const log = Array.from({length: 3000}, (_, i) => event(i + 1, 1 + (i % 400)));
    const db = database(), h = hiro(log);
    await refreshMusicStats({DB: db as any}, h.transport, T0);
    expect(h.calls()).toBeLessThanOrEqual(45);
  });

  it('reports an unreadable Hiro answer as its own error, not as a network failure', async () => {
    const db = database();
    const odd = (async () => Response.json({unexpected: true})) as unknown as typeof fetch;
    await refreshMusicStats({DB: db as any}, odd, T0);
    expect((await readMusicStats({DB: db as any})).syncError).toBe(-2);
  });

  it('copies the real-sized history in three quick refreshes, each within the request budget', async () => {
    const log = Array.from({length: 4700}, (_, i) => event(i + 1, 1 + (i % 4)));
    const db = database(), h = hiro(log);
    let now = T0, previous = 0;
    for (let round = 0; round < 3; round++) {
      await refreshMusicStats({DB: db as any}, h.transport, now);
      expect(h.calls() - previous).toBeLessThanOrEqual(45);
      previous = h.calls();
      now += CATCHUP_REFRESH_MS;
    }
    expect(await readMusicStats({DB: db as any})).toMatchObject({plays: 4700, supporters: 4, complete: true, syncError: null});
  });

  it('reads the pages of a wave in parallel', async () => {
    const log = Array.from({length: WAVE_PAGES * PAGE_SIZE}, (_, i) => event(i + 1, 1));
    let inFlight = 0, peak = 0;
    const inner = hiro(log).transport;
    const transport = (async (url: any, init: any) => {
      inFlight++; peak = Math.max(peak, inFlight);
      await new Promise(resolve => setTimeout(resolve, 5));
      try { return await inner(url, init); } finally { inFlight--; }
    }) as unknown as typeof fetch;
    await refreshMusicStats({DB: database() as any}, transport, T0);
    expect(peak).toBeGreaterThanOrEqual(WAVE_PAGES);
  });

  it('re-reads sooner while catching up, but throttles once complete or failing', async () => {
    const log = Array.from({length: 3 * WAVE_PAGES * PAGE_SIZE}, (_, i) => event(i + 1, 1 + (i % 9)));
    const db = database(), h = hiro(log);
    await refreshMusicStats({DB: db as any}, h.transport, T0, WAVE_PAGES); // one wave only: incomplete
    expect(await refreshMusicStats({DB: db as any}, h.transport, T0 + 1000)).toMatchObject({skipped: true});
    const catchUp = await refreshMusicStats({DB: db as any}, h.transport, T0 + CATCHUP_REFRESH_MS);
    expect(catchUp.skipped).toBeUndefined();
    expect((await readMusicStats({DB: db as any})).complete).toBe(true);
    expect(await refreshMusicStats({DB: db as any}, h.transport, T0 + 2 * CATCHUP_REFRESH_MS)).toMatchObject({skipped: true});
    // A failing chain is not hammered at the catch-up rate.
    const failing = database();
    await refreshMusicStats({DB: failing as any}, (async () => { throw Error('offline'); }) as unknown as typeof fetch, T0);
    expect(await refreshMusicStats({DB: failing as any}, h.transport, T0 + CATCHUP_REFRESH_MS)).toMatchObject({skipped: true});
  });

  describe('song details for the latest plays', () => {
    const catalogue = (db: any) => db.sql.exec(`
      CREATE TABLE radio_metadata (token_id INTEGER PRIMARY KEY, title TEXT, artist TEXT, cover TEXT NOT NULL DEFAULT '');
      INSERT INTO radio_metadata VALUES (3002, 'Easy Now', 'Hundred Little Reasons', 'data:image/png;base64,AAAA');
      INSERT INTO radio_metadata VALUES (3001, 'Plain Title', '', '');
      INSERT INTO radio_metadata VALUES (3003, 'Inscription #3003', '', '');
    `);
    const synced = async (log: any[], enrich = true) => {
      const db = database(), h = hiro(log);
      if (enrich) catalogue(db);
      await refreshMusicStats({DB: db as any}, h.transport, T0);
      return readMusicStats({DB: db as any});
    };
    it('adds title, artist and artwork for core 3 songs the catalogue knows', async () => {
      const stats = await synced([event(1, 1), event(2, 2), event(3, 3)]);
      // event(n) plays song 3000 + (n % 40): songs 3001, 3002, 3003 for n = 1, 2, 3.
      const bySong = Object.fromEntries(stats.latest.map(p => [p.song, p]));
      expect(bySong[3002]).toMatchObject({title: 'Easy Now', artist: 'Hundred Little Reasons', artwork: '/radio/artwork?id=3002'});
      expect(bySong[3001]).toMatchObject({title: 'Plain Title', artist: null, artwork: null});
      expect(bySong[3003]).toMatchObject({title: null, artist: null, artwork: null}); // placeholder names are not titles
    });
    it('leaves details empty for other cores and when the catalogue is missing', async () => {
      const other = await synced([event(2, 1, {core: 1})]);
      expect(other.latest[0]).toMatchObject({core: 1, song: 3002, title: null, artist: null, artwork: null});
      const none = await synced([event(2, 1)], false);
      expect(none.latest[0]).toMatchObject({song: 3002, title: null, artist: null, artwork: null});
      expect(none.plays).toBe(1);
    });
    it('applies the supplied artist and title corrections used by the Songs page', async () => {
      const db = database(), h = hiro([event(1, 1, {song: 312})]);
      db.sql.exec(`CREATE TABLE radio_metadata (token_id INTEGER PRIMARY KEY, title TEXT, artist TEXT, cover TEXT NOT NULL DEFAULT '');
        INSERT INTO radio_metadata VALUES (312, 'raw title', 'raw artist', '');`);
      await refreshMusicStats({DB: db as any}, h.transport, T0);
      expect((await readMusicStats({DB: db as any})).latest[0]).toMatchObject({song: 312, title: 'Smalltalk', artist: 'Hundred Little Reasons'});
    });
  });

  it('ignores other contracts, wrong amounts and repeated transactions, but still advances', async () => {
    const log = [
      event(1, 1), event(2, 2, {amount: 51}), event(3, 3, {contract: 'SP1.other'}),
      event(4, 4, {txid: hex(1)}), event(5, 5, {time: null}), {event_type: 'stx_transfer_event'}
    ];
    const db = database(), {transport} = hiro(log);
    const result = await refreshMusicStats({DB: db as any}, transport, T0);
    expect(result.cursor).toBe(6);
    const stats = await readMusicStats({DB: db as any});
    expect(stats.plays).toBe(2);
    expect(stats.supporters).toBe(2);
    expect(stats.latest.find(p => p.payer === wallet(5))?.at).toBeNull();
  });

  describe('Hiro access', () => {
    const log = Array.from({length: 30}, (_, i) => event(i + 1, 1 + (i % 4)));
    const served = (init: any) => {
      const results = log.slice().reverse().slice(0, 50);
      return Response.json({total: log.length, limit: 50, offset: 0, results});
    };
    it('sends the configured keys the way the /hiro proxy does and rotates on a rejection', async () => {
      const seen: Array<string | null> = [];
      const transport = (async (url: any, init: any) => {
        const key = new Headers(init.headers).get('x-api-key');
        seen.push(key);
        if (key === 'key-one') return new Response('{}', {status: 429});
        const u = new URL(String(url));
        const offset = Number(u.searchParams.get('offset')), limit = Number(u.searchParams.get('limit'));
        return Response.json({total: log.length, results: log.slice().reverse().slice(offset, offset + limit)});
      }) as unknown as typeof fetch;
      const db = database();
      const result = await refreshMusicStats({DB: db as any, HIRO_API_KEY_1: 'key-one', HIRO_API_KEY_2: 'key-two'}, transport, T0);
      expect(result).toMatchObject({ok: true, cursor: 30});
      expect(seen[0]).toBe('key-one');
      expect(seen).toContain('key-two');
      expect((await readMusicStats({DB: db as any})).plays).toBe(30);
    });
    it('falls back to a keyless request and accepts a single HIRO_API_KEY or a list', async () => {
      const keys: Array<string | null> = [];
      const transport = (async (_url: any, init: any) => { keys.push(new Headers(init.headers).get('x-api-key')); return served(init); }) as unknown as typeof fetch;
      await refreshMusicStats({DB: database() as any, HIRO_API_KEY: 'solo'}, transport, T0);
      expect(keys[0]).toBe('solo');
      keys.length = 0;
      await refreshMusicStats({DB: database() as any, HIRO_API_KEYS: 'a, b'}, transport, T0);
      expect(keys[0]).toBe('a');
      keys.length = 0;
      await refreshMusicStats({DB: database() as any}, transport, T0);
      expect(keys[0]).toBeNull();
    });
    it('reports why the chain could not be read instead of looking like zero plays', async () => {
      const db = database();
      const denied = (async () => new Response('{}', {status: 403})) as unknown as typeof fetch;
      const failed = await refreshMusicStats({DB: db as any}, denied, T0);
      expect(failed.ok).toBe(false);
      const stats = await readMusicStats({DB: db as any});
      expect(stats).toMatchObject({plays: 0, complete: false, syncError: 403});
      const down = (async () => { throw Error('offline'); }) as unknown as typeof fetch;
      await refreshMusicStats({DB: db as any}, down, T0 + MIN_REFRESH_MS);
      expect((await readMusicStats({DB: db as any})).syncError).toBe(-1);
      const healthy = hiro(log);
      await refreshMusicStats({DB: db as any}, healthy.transport, T0 + 2 * MIN_REFRESH_MS);
      expect(await readMusicStats({DB: db as any})).toMatchObject({plays: 30, complete: true, syncError: null});
    });
    it('keeps the first visitor waiting for only the first batch of history', async () => {
      const big = Array.from({length: FIRST_VISIT_PAGES * PAGE_SIZE + 200}, (_, i) => event(i + 1, 1 + (i % 50)));
      const db = database(), h = hiro(big);
      const response = await handleMusicStats(new Request('https://xtrata.xyz/api/music-stats'), {DB: db as any}, h.transport, T0);
      const body: any = await response.json();
      expect(body.plays).toBe(FIRST_VISIT_PAGES * PAGE_SIZE);
      expect(body.complete).toBe(false);
      await refreshMusicStats({DB: db as any}, h.transport, T0 + MIN_REFRESH_MS);
      expect(await readMusicStats({DB: db as any})).toMatchObject({plays: big.length, complete: true});
    });
  });

  describe('HTTP handler', () => {
    const get = (url = 'https://xtrata.xyz/api/music-stats') => new Request(url);
    it('fills the first request from the chain and serves cached JSON', async () => {
      const log = Array.from({length: 25}, (_, i) => event(i + 1, 1 + (i % 6)));
      const db = database(), h = hiro(log);
      const response = await handleMusicStats(get(), {DB: db as any}, h.transport, T0);
      expect(response.status).toBe(200);
      expect(response.headers.get('cache-control')).toContain('max-age=15');
      expect(await response.json()).toMatchObject({version: 1, plays: 25, supporters: 6, complete: true, contract: CONTRACT});
    });
    it('answers from D1 and refreshes in the background after the first sync', async () => {
      const log = Array.from({length: 25}, (_, i) => event(i + 1, 1));
      const db = database(), h = hiro(log);
      await handleMusicStats(get(), {DB: db as any}, h.transport, T0);
      log.push(event(26, 2));
      const pending: Promise<unknown>[] = [];
      const response = await handleMusicStats(get(), {DB: db as any}, h.transport, T0 + MIN_REFRESH_MS, p => { pending.push(p); });
      expect((await response.json()).plays).toBe(25);
      await Promise.all(pending);
      expect((await readMusicStats({DB: db as any})).plays).toBe(26);
    });
    it('serves last known totals when the chain is unreachable', async () => {
      const log = Array.from({length: 25}, (_, i) => event(i + 1, 1));
      const db = database(), h = hiro(log);
      await handleMusicStats(get(), {DB: db as any}, h.transport, T0);
      const down = (async () => { throw Error('offline'); }) as unknown as typeof fetch;
      const response = await handleMusicStats(get(), {DB: db as any}, down, T0 + MIN_REFRESH_MS);
      expect(response.status).toBe(200);
      expect((await response.json()).plays).toBe(25);
    });
    it('rejects other methods and reports a missing migration or binding explicitly', async () => {
      const db = database();
      expect((await handleMusicStats(new Request('https://xtrata.xyz/api/music-stats', {method: 'POST'}), {DB: db as any})).status).toBe(405);
      expect((await handleMusicStats(get(), {})).status).toBe(503);
      const unmigrated = database(false);
      const response = await handleMusicStats(get(), {DB: unmigrated as any});
      expect(response.status).toBe(503);
      expect((await response.json()).error).toContain('migration 022');
    });
  });
});
