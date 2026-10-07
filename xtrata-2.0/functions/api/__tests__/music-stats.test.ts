// @vitest-environment node
import {describe, it, expect} from 'vitest';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {handleMusicStats, readMusicStats, refreshMusicStats, MIN_REFRESH_MS, MAX_PAGES_PER_REFRESH, PAGE_SIZE} from '../../lib/music-stats';
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
function event(n: number, payer: number, over: {amount?: number; time?: number | null; contract?: string; txid?: string} = {}) {
  const repr = `(tuple (amount u${over.amount ?? 50}) (core u3) (event "radio-paid-play") (id u${3000 + (n % 40)}) (payer '${wallet(payer)}) (receipt 0x584d0102271903001e1e7034b2ac0f3b) (recipient '${wallet(9000 + (n % 7))}) (total u${n}) (version u1))`;
  return {
    event_type: 'smart_contract_log', tx_id: over.txid ?? hex(n),
    ...(over.time === null ? {} : {block_time: over.time ?? 1_790_000_000 + n}),
    contract_log: {contract_id: over.contract ?? CONTRACT, topic: 'print', value: {repr}}
  };
}

/** A fake Hiro: `log` is oldest first; responses are newest first like the real API. */
function hiro(log: any[], hooks: {after?: (call: number) => void; fail?: (call: number) => boolean} = {}) {
  let call = 0;
  const transport = (async (url: any) => {
    call++;
    if (hooks.fail?.(call)) return new Response('{}', {status: 429});
    const u = new URL(String(url));
    const offset = Number(u.searchParams.get('offset')), limit = Number(u.searchParams.get('limit'));
    const results = log.slice().reverse().slice(offset, offset + limit);
    const body = {total: log.length, limit, offset, results};
    hooks.after?.(call);
    return Response.json(body);
  }) as unknown as typeof fetch;
  return {transport, calls: () => call};
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
    const log = Array.from({length: 100}, (_, i) => event(i + 1, 1 + (i % 4)));
    const db = database(), h = hiro(log, {fail: call => call === 4});
    const failed = await refreshMusicStats({DB: db as any}, h.transport, T0);
    expect(failed.ok).toBe(false);
    expect(failed.cursor).toBe(2 * PAGE_SIZE);
    const partial = await readMusicStats({DB: db as any});
    expect(partial.plays).toBe(2 * PAGE_SIZE);
    expect(partial.complete).toBe(false);
    const healed = await refreshMusicStats({DB: db as any}, h.transport, T0 + MIN_REFRESH_MS);
    expect(healed.ok).toBe(true);
    expect((await readMusicStats({DB: db as any})).plays).toBe(100);
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
