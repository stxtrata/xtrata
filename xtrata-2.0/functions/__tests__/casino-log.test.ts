import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { onRequest } from '../casino/log';

interface Captured {
  sql: string;
  binds: unknown[];
}

function fakeEnv(options: { batch?: boolean; failWith?: Error } = {}) {
  const calls: Captured[] = [];
  const batches: Captured[][] = [];
  const makeStatement = (sql: string, binds: unknown[]) => ({
    sql,
    binds,
    run: async () => {
      if (options.failWith) throw options.failWith;
      calls.push({ sql, binds });
      return {};
    }
  });
  const DB: Record<string, unknown> = {
    prepare(sql: string) {
      return {
        ...makeStatement(sql, []),
        bind: (...binds: unknown[]) => makeStatement(sql, binds)
      };
    }
  };
  if (options.batch !== false) {
    DB.batch = async (statements: Array<{ sql: string; binds: unknown[] }>) => {
      if (options.failWith) throw options.failWith;
      batches.push(statements.map((s) => ({ sql: s.sql, binds: s.binds })));
      return [];
    };
  }
  return { env: { DB }, calls, batches };
}

const PID = 'p_abcdefghij12';
const SID = 's_abc123';

const spin = (seq: number, extra: Record<string, unknown> = {}) => ({
  seq,
  t: 1_700_000_000_000 + seq,
  m: 'ds',
  k: 'spin',
  bet: 200,
  free: 0,
  win: 0,
  jp: 0,
  st: [0, 1, 2, 3, 4],
  ...extra
});

const body = (events: unknown[], extra: Record<string, unknown> = {}) => ({
  v: 1,
  page: 'casino-b',
  pid: PID,
  sid: SID,
  addr: null,
  events,
  ...extra
});

function post(payload: unknown, headers: Record<string, string> = {}, raw?: string) {
  return new Request('https://xtrata.xyz/casino/log', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://xtrata.xyz', ...headers },
    body: raw ?? JSON.stringify(payload)
  });
}

const call = (request: Request, env: unknown, waitUntil?: (p: Promise<unknown>) => void) =>
  onRequest({ request, env, waitUntil } as unknown as Parameters<typeof onRequest>[0]);

describe('POST /casino/log', () => {
  it('writes every valid event in a single D1 batch and answers 204', async () => {
    const { env, batches, calls } = fakeEnv();
    const res = await call(post(body([spin(0), spin(1, { win: 400 }), spin(2)])), env);
    expect(res.status).toBe(204);
    expect(batches).toHaveLength(1);
    expect(batches[0]).toHaveLength(3);
    expect(calls).toHaveLength(0);
    for (const statement of batches[0]) {
      expect(statement.sql).toContain('INSERT OR IGNORE INTO casino_events');
      expect(statement.binds).toHaveLength(19);
    }
    // seq is bound at index 6, win at 11
    expect(batches[0].map((s) => s.binds[6])).toEqual([0, 1, 2]);
    expect(batches[0][1].binds[11]).toBe(400);
  });

  it('falls back to one statement at a time when the binding has no batch()', async () => {
    const { env, calls } = fakeEnv({ batch: false });
    const res = await call(post(body([spin(0), spin(1)])), env);
    expect(res.status).toBe(204);
    expect(calls).toHaveLength(2);
  });

  it('hands the write to waitUntil when the platform provides it', async () => {
    const { env, batches } = fakeEnv();
    const pending: Array<Promise<unknown>> = [];
    const res = await call(post(body([spin(0)])), env, (p) => pending.push(p));
    expect(res.status).toBe(204);
    expect(pending).toHaveLength(1);
    await Promise.all(pending);
    expect(batches).toHaveLength(1);
  });

  it('answers 405 with Allow: POST to other methods', async () => {
    const { env, batches } = fakeEnv();
    for (const method of ['GET', 'PUT', 'DELETE']) {
      const res = await call(new Request('https://xtrata.xyz/casino/log', { method }), env);
      expect(res.status).toBe(405);
      expect(res.headers.get('allow')).toBe('POST');
    }
    expect(batches).toHaveLength(0);
  });

  it('drops cross-site posts without writing', async () => {
    const { env, batches } = fakeEnv();
    const viaFetchMetadata = await call(
      post(body([spin(0)]), { 'sec-fetch-site': 'cross-site' }),
      env
    );
    const viaOrigin = await call(post(body([spin(1)]), { origin: 'https://evil.example' }), env);
    expect(viaFetchMetadata.status).toBe(204);
    expect(viaOrigin.status).toBe(204);
    expect(batches).toHaveLength(0);
  });

  it('writes nothing while the CASINO_LOG_DISABLED kill switch is on', async () => {
    const { env, batches } = fakeEnv();
    const res = await call(post(body([spin(0)])), { ...env, CASINO_LOG_DISABLED: '1' });
    expect(res.status).toBe(204);
    expect(batches).toHaveLength(0);
  });

  it('drops an explicitly oversized request before reading it', async () => {
    const { env, batches } = fakeEnv();
    const res = await call(post(body([spin(0)]), { 'content-length': '64001' }), env);
    expect(res.status).toBe(204);
    expect(batches).toHaveLength(0);
  });

  it('drops an oversized body even when content-length is missing or wrong', async () => {
    const { env, batches } = fakeEnv();
    const padded = JSON.stringify(body([spin(0)], { padding: 'x'.repeat(70_000) }));
    const res = await call(post(null, {}, padded), env);
    expect(res.status).toBe(204);
    expect(batches).toHaveLength(0);
  });

  it('answers 204 to malformed JSON and bad envelopes without writing', async () => {
    const { env, batches } = fakeEnv();
    expect((await call(post(null, {}, '{not json'), env)).status).toBe(204);
    expect((await call(post({ v: 1, events: [] }), env)).status).toBe(204);
    expect((await call(post(body([spin(0)], { pid: 'nope' })), env)).status).toBe(204);
    expect((await call(post(body([{ garbage: true }])), env)).status).toBe(204);
    expect(batches).toHaveLength(0);
  });

  it('keeps the valid events when some in the batch are invalid', async () => {
    const { env, batches } = fakeEnv();
    await call(post(body([spin(0), { nonsense: 1 }, spin(2, { bet: 1 }), spin(3)])), env);
    expect(batches[0].map((s) => s.binds[6])).toEqual([0, 3]);
  });

  it('never surfaces a database failure (for example the table has not been created yet)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { env } = fakeEnv({ failWith: new Error('no such table: casino_events') });
    const res = await call(post(body([spin(0)])), env);
    expect(res.status).toBe(204);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('never surfaces a missing D1 binding', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const res = await call(post(body([spin(0)])), {});
    expect(res.status).toBe(204);
    warn.mockRestore();
  });
});

describe('migration 033', () => {
  const sql = readFileSync(new URL('../migrations/033_casino_events.sql', import.meta.url), 'utf8');

  it('creates casino_events with the idempotency key the ingest relies on', () => {
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS casino_events');
    expect(sql).toContain('UNIQUE(pid, sid, seq)');
  });

  it('has every column the insert writes', () => {
    for (const column of [
      'at',
      'ct',
      'day',
      'page',
      'pid',
      'sid',
      'seq',
      'addr',
      'machine',
      'kind',
      'bet',
      'win',
      'jp',
      'free',
      'stops',
      'flags',
      'rid',
      'tx',
      'detail'
    ]) {
      expect(sql).toMatch(new RegExp(`\\n\\s+${column} (INTEGER|TEXT)`));
    }
  });

  it('says plainly that it is client-reported and what is not stored', () => {
    expect(sql).toMatch(/CLIENT-REPORTED/);
    expect(sql).toMatch(/NOT stored: the IP address/);
  });
});
