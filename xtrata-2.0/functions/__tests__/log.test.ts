import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { onRequest } from '../log';

interface Captured {
  sql: string;
  binds: unknown[];
}

function fakeEnv() {
  const calls: Captured[] = [];
  const DB = {
    prepare(sql: string) {
      return {
        bind(...binds: unknown[]) {
          return {
            run: async () => {
              calls.push({ sql, binds });
              return {};
            }
          };
        },
        run: async () => {
          calls.push({ sql, binds: [] });
          return {};
        },
        all: async () => ({ results: [] })
      };
    }
  };
  return { env: { DB, TELEMETRY_SALT: 'unit-test-salt' }, calls };
}

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://xtrata.app/log', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://xtrata.app', ...headers },
    body: JSON.stringify(body)
  });
}

const call = (request: Request, env: unknown) =>
  onRequest({ request, env } as unknown as Parameters<typeof onRequest>[0]);

describe('POST /log ingest', () => {
  it('keeps issue occurrence rollup behind an insert-only D1 trigger', () => {
    const migration = readFileSync(
      new URL('../migrations/009_telemetry.sql', import.meta.url),
      'utf8'
    );
    expect(migration).toContain('AFTER INSERT ON telemetry_events');
    expect(migration).toContain('trg_telemetry_issue_rollup');
  });

  it('writes one event row for a non-error event', async () => {
    const { env, calls } = fakeEnv();
    const res = await call(
      post({ events: [{ flow: 'app', outcome: 'start', step: 'boot', sessionId: 's1' }] }),
      env
    );
    expect(res.status).toBe(204);
    expect(calls).toHaveLength(2);
    expect(calls[0].sql).toContain('INSERT OR IGNORE INTO telemetry_events');
    expect(calls[1].sql).toContain('DELETE FROM telemetry_events');
  });

  it('writes one error event and leaves idempotent issue rollup to the D1 trigger', async () => {
    const { env, calls } = fakeEnv();
    await call(
      post({
        events: [
          {
            flow: 'market_buy',
            step: 'broadcast',
            outcome: 'error',
            errorCode: 'NONCE_MISMATCH',
            errorFingerprint: 'abc123def4567890',
            errorMessage: 'nonce mismatch',
            sessionId: 's1',
            journeyId: 'j1'
          }
        ]
      }),
      env
    );
    expect(calls).toHaveLength(2);
    expect(calls[0].sql).toContain('INSERT OR IGNORE INTO telemetry_events');
    expect(calls.some((call) => call.sql.includes('INSERT INTO telemetry_issues'))).toBe(false);
  });

  it('drops malformed events (missing flow/outcome)', async () => {
    const { env, calls } = fakeEnv();
    await call(post({ events: [{ step: 'x' }, { flow: 'app' }] }), env);
    expect(calls).toHaveLength(0);
  });

  it('hashes the wallet address and never stores it raw', async () => {
    const { env, calls } = fakeEnv();
    const address = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
    await call(
      post({
        events: [
          {
            flow: 'wallet_connect',
            outcome: 'success',
            sessionId: 's1',
            walletAddress: address,
            walletPrefix: 'SP3J…743X'
          }
        ]
      }),
      env
    );
    // wallet_hash is column 19 (index 18) in EVENT_INSERT_SQL.
    const walletHash = calls[0].binds[18] as string;
    expect(walletHash).toMatch(/^[0-9a-f]{16}$/);
    expect(calls[0].binds).not.toContain(address);
    expect(calls[0].binds[19]).toBeNull();
  });

  it('reuses the client event_id (idempotency-friendly)', async () => {
    const { env, calls } = fakeEnv();
    await call(
      post({ events: [{ flow: 'app', outcome: 'info', eventId: 'evt-123', sessionId: 's1' }] }),
      env
    );
    expect(calls[0].binds[0]).toBe('evt-123');
  });

  it('redacts wallet principals from messages, targets, stacks and context', async () => {
    const { env, calls } = fakeEnv();
    const address = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
    await call(
      post({
        events: [
          {
            flow: 'app',
            outcome: 'error',
            sessionId: 's1',
            target: address,
            errorMessage: `failed for ${address}`,
            errorStack: `at owner ${address}`,
            context: { owner: address }
          }
        ]
      }),
      env
    );
    expect(JSON.stringify(calls[0].binds)).not.toContain(address);
    expect(JSON.stringify(calls[0].binds)).toContain('<redacted-address>');
  });

  it('silently drops cross-site posts', async () => {
    const { env, calls } = fakeEnv();
    const res = await call(
      post(
        { events: [{ flow: 'app', outcome: 'error', errorFingerprint: 'x', errorMessage: 'y' }] },
        {
          'sec-fetch-site': 'cross-site'
        }
      ),
      env
    );
    expect(res.status).toBe(204);
    expect(calls).toHaveLength(0);
  });

  it('drops an explicitly oversized request before parsing it', async () => {
    const { env, calls } = fakeEnv();
    const request = post(
      { events: [{ flow: 'app', outcome: 'info', sessionId: 's1' }] },
      { 'content-length': '128001' }
    );
    const res = await call(request, env);
    expect(res.status).toBe(204);
    expect(calls).toHaveLength(0);
  });
});
