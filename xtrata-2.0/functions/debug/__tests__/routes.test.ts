import { describe, expect, it } from 'vitest';
import { onRequest as debugPage } from '../../debug';
import { onRequest as debugData } from '../data';

const call = (fn: typeof debugPage, request: Request, env: unknown) =>
  fn({ request, env } as unknown as Parameters<typeof debugPage>[0]);

const DEBUG_KEY = 'unit-test-debug-key-at-least-24-chars';

describe('/debug dashboard route', () => {
  it('fails closed when DEBUG_VIEW_KEY is missing', async () => {
    const res = await call(debugPage, new Request('https://x/debug'), {});
    expect(res.status).toBe(503);
  });

  it('shows a login form instead of dashboard data without a session', async () => {
    const res = await call(debugPage, new Request('https://x/debug'), {
      DEBUG_VIEW_KEY: DEBUG_KEY
    });
    expect(res.status).toBe(401);
    const html = await res.text();
    expect(html).toContain('Dashboard key');
    expect(html).not.toContain('Crash-outs over time');
  });

  it('exchanges a POSTed key for an HttpOnly cookie and serves the dashboard', async () => {
    const login = await call(
      debugPage,
      new Request('https://x/debug', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ key: DEBUG_KEY })
      }),
      { DEBUG_VIEW_KEY: DEBUG_KEY }
    );
    expect(login.status).toBe(303);
    expect(login.headers.get('set-cookie')).toContain('HttpOnly');
    expect(login.headers.get('location')).toBe('/debug');

    const cookie = login.headers.get('set-cookie')?.split(';')[0] ?? '';
    const res = await call(debugPage, new Request('https://x/debug', { headers: { cookie } }), {
      DEBUG_VIEW_KEY: DEBUG_KEY
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    const html = await res.text();
    expect(html).toContain('Site Health');
    expect(html).toContain('Glossary');
    expect(html).toContain('/debug/data');
  });
});

describe('/debug/data route', () => {
  it('fails closed when DEBUG_VIEW_KEY is missing', async () => {
    const res = await call(debugData, new Request('https://x/debug/data'), { DB: {} });
    expect(res.status).toBe(503);
  });

  it('returns ready:false (with a hint) when the table is missing', async () => {
    const env = {
      DEBUG_VIEW_KEY: DEBUG_KEY,
      DB: {
        prepare() {
          return {
            bind() {
              return {
                all: async () => {
                  throw new Error('D1_ERROR: no such table: telemetry_events');
                }
              };
            },
            all: async () => {
              throw new Error('no such table');
            }
          };
        }
      }
    };
    const res = await call(
      debugData,
      new Request('https://x/debug/data?range=7d', {
        headers: { 'x-debug-key': DEBUG_KEY }
      }),
      env
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ready: boolean; hint?: string };
    expect(body.ready).toBe(false);
    expect(body.hint).toContain('009_telemetry.sql');
  });

  it('401s when secured and no key is provided', async () => {
    const env = { DB: {}, DEBUG_VIEW_KEY: DEBUG_KEY };
    const res = await call(debugData, new Request('https://x/debug/data'), env);
    expect(res.status).toBe(401);
  });

  it('allows access when the correct key is provided', async () => {
    const queries: string[] = [];
    const env = {
      DEBUG_VIEW_KEY: DEBUG_KEY,
      DB: {
        prepare(sql: string) {
          queries.push(sql);
          return {
            bind() {
              return { all: async () => ({ results: [] }) };
            },
            all: async () => ({ results: [] })
          };
        }
      }
    };
    const res = await call(
      debugData,
      new Request('https://x/debug/data?range=24h', {
        headers: { 'x-debug-key': DEBUG_KEY }
      }),
      env
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ready: boolean };
    expect(body.ready).toBe(true);
    expect(queries.some((sql) => sql.includes('last_success > last_error'))).toBe(true);
  });
});
