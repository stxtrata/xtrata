import { describe, expect, it } from 'vitest';
import { onRequest as casinoPage } from '../casino';
import { onRequest as casinoData } from '../casino-data';
import { debugAccessCookie } from '../../lib/debug-auth';

const KEY = 'unit-test-debug-key-at-least-24-chars';
const cookie = debugAccessCookie(KEY).split(';')[0];

const call = (fn: typeof casinoPage, request: Request, env: unknown) =>
  fn({ request, env } as unknown as Parameters<typeof casinoPage>[0]);

interface Query {
  sql: string;
  binds: unknown[];
}

/** A fake D1 that answers each query by recognising its shape. */
function fakeDb(overrides: Partial<Record<string, unknown[]>> = {}, failWith?: Error) {
  const queries: Query[] = [];
  const answer = (sql: string): unknown[] => {
    const keyed: Array<[string, string]> = [
      ['GROUP BY page, machine', 'machines'],
      ["kind='gamble'", 'gamble'],
      ['FROM (', 'duplicates'],
      ["kind='buy'", 'buys'],
      ["kind='move'", 'moves'],
      ['COUNT(DISTINCT pid) AS pids', 'players'],
      ['ORDER BY win DESC', 'topWins'],
      ['WHERE jp > 0', 'jackpots'],
      ['GROUP BY day', 'daily']
    ];
    for (const [needle, key] of keyed) {
      if (sql.includes(needle)) return (overrides[key] as unknown[]) ?? [];
    }
    return [];
  };
  const DB = {
    prepare(sql: string) {
      const run = (binds: unknown[]) => ({
        all: async () => {
          if (failWith) throw failWith;
          queries.push({ sql, binds });
          return { results: answer(sql) };
        }
      });
      return { ...run([]), bind: (...binds: unknown[]) => run(binds) };
    }
  };
  return { env: { DB, DEBUG_VIEW_KEY: KEY }, queries };
}

const get = (path: string, headers: Record<string, string> = {}) =>
  new Request(`https://x${path}`, { headers });

describe('/debug/casino-data', () => {
  it('fails closed without a configured key', async () => {
    const res = await call(casinoData, get('/debug/casino-data'), {});
    expect(res.status).toBe(503);
  });

  it('refuses a request with no key or the wrong key', async () => {
    const { env, queries } = fakeDb();
    expect((await call(casinoData, get('/debug/casino-data'), env)).status).toBe(401);
    expect(
      (await call(casinoData, get('/debug/casino-data', { 'x-debug-key': 'wrong' }), env)).status
    ).toBe(401);
    expect(queries).toHaveLength(0);
  });

  it('accepts the header or the dashboard cookie', async () => {
    const { env } = fakeDb();
    expect(
      (await call(casinoData, get('/debug/casino-data', { 'x-debug-key': KEY }), env)).status
    ).toBe(200);
    expect((await call(casinoData, get('/debug/casino-data', { cookie }), env)).status).toBe(200);
  });

  it('computes the actual return per machine from the stake and the payout', async () => {
    const { env } = fakeDb({
      machines: [
        {
          page: 'casino',
          machine: 'bf',
          spins: 1000,
          free_spins: 40,
          wagered: 100_000,
          won: 94_380,
          jackpot_count: 1,
          jackpot_paid: 5000,
          biggest: 12_000,
          bonuses: 7
        },
        {
          page: 'casino-b',
          machine: 'ds',
          spins: 10,
          free_spins: 0,
          wagered: 2000,
          won: 3000,
          jackpot_count: 0,
          jackpot_paid: 0,
          biggest: 1500,
          bonuses: 0
        },
        {
          page: 'casino',
          machine: 'nv',
          spins: 0,
          free_spins: 0,
          wagered: 0,
          won: 0,
          jackpot_count: 0,
          jackpot_paid: 0,
          biggest: 0,
          bonuses: 0
        }
      ]
    });
    const res = await call(casinoData, get('/debug/casino-data?range=30d', { cookie }), env);
    const data = await res.json();
    expect(data.ready).toBe(true);
    expect(data.clientReported).toBe(true);
    expect(data.range).toBe('30d');
    expect(data.theoryRtp).toBe(0.9438);
    expect(data.caution).toMatch(/million paid spins/);
    expect(data.machines[0]).toMatchObject({
      page: 'casino',
      machine: 'bf',
      spins: 1000,
      freeSpins: 40,
      wagered: 100_000,
      won: 94_380,
      rtp: 0.9438,
      theoryRtp: 0.9438,
      jackpots: { count: 1, paid: 5000 },
      biggestWin: 12_000,
      bonusesCollected: 7
    });
    expect(data.machines[1].rtp).toBe(1.5);
    expect(data.machines[2].rtp).toBeNull();
    expect(data.totals).toEqual({
      spins: 1010,
      freeSpins: 40,
      wagered: 102_000,
      won: 97_380,
      rtp: Math.round((97_380 / 102_000) * 10000) / 10000
    });
  });

  it('reports purchases, moves, gambles, players, top wins, jackpots and the daily trend', async () => {
    const { env } = fakeDb({
      gamble: [{ n: 6, staked: 3000, net: -1000 }],
      buys: [{ n: 4, layr: 400_000, players: 3, addresses: 2, distinct_tx: 3 }],
      duplicates: [{ n: 1 }],
      moves: [
        { dir: 'in', layr: 70_000 },
        { dir: 'out', layr: 12_000 }
      ],
      players: [{ pids: 9, addrs: 4 }],
      topWins: [
        {
          kind: 'spin',
          machine: 'ds',
          page: 'casino',
          win: 20_000,
          bet: 200,
          jp: 0,
          day: '2026-10-28'
        }
      ],
      jackpots: [
        {
          at: 1_700_000_000_000,
          kind: 'spin',
          machine: 'drop',
          page: 'casino-b',
          jp: 9000,
          bet: 100
        }
      ],
      daily: [{ day: '2026-10-28', spins: 50, wagered: 5000, won: 4719, players: 3 }]
    });
    const data = await (await call(casinoData, get('/debug/casino-data', { cookie }), env)).json();
    expect(data.gamble).toEqual({ count: 6, staked: 3000, net: -1000 });
    expect(data.buys).toEqual({
      count: 4,
      layrCredited: 400_000,
      distinctTransactions: 3,
      distinctPlayers: 3,
      distinctAddresses: 2,
      transactionsCreditedTwice: 1
    });
    expect(data.moves).toEqual({ inLayr: 70_000, outLayr: 12_000 });
    expect(data.players).toEqual({ distinctPid: 9, distinctAddr: 4 });
    expect(data.topWins[0]).toMatchObject({
      win: 20_000,
      multiple: 100,
      jackpot: false,
      day: '2026-10-28'
    });
    expect(data.jackpots[0]).toMatchObject({ machine: 'drop', paid: 9000, bet: 100 });
    expect(data.daily[0]).toMatchObject({ day: '2026-10-28', rtp: 0.9438, players: 3 });
  });

  it('turns the range into a lower time bound, and falls back to 7 days for nonsense', async () => {
    const before = Date.now();
    const day = fakeDb();
    await call(casinoData, get('/debug/casino-data?range=24h', { cookie }), day.env);
    const dayBound = day.queries[0].binds[0] as number;
    expect(before - dayBound).toBeGreaterThanOrEqual(24 * 3_600_000 - 5);
    expect(before - dayBound).toBeLessThan(24 * 3_600_000 + 5000);

    const junk = fakeDb();
    await call(casinoData, get('/debug/casino-data?range=%27%3B--', { cookie }), junk.env);
    expect(Date.now() - (junk.queries[0].binds[0] as number)).toBeGreaterThan(6.9 * 24 * 3_600_000);

    const all = fakeDb();
    const data = await (
      await call(casinoData, get('/debug/casino-data?range=all', { cookie }), all.env)
    ).json();
    expect(all.queries[0].binds[0]).toBe(0);
    expect(data.range).toBe('all');
    expect(data.rangeHours).toBeNull();
  });

  it('answers ready:false with the migration hint when the table is missing', async () => {
    const { env } = fakeDb({}, new Error('no such table: casino_events'));
    const res = await call(casinoData, get('/debug/casino-data', { cookie }), env);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ready).toBe(false);
    expect(data.reason).toContain('no such table');
    expect(data.hint).toContain('033_casino_events.sql');
  });
});

describe('/debug/casino page', () => {
  it('fails closed without a configured key', async () => {
    expect((await call(casinoPage, get('/debug/casino'), {})).status).toBe(503);
  });

  it('sends a signed-out visitor to sign in at /debug and shows no dashboard', async () => {
    const res = await call(casinoPage, get('/debug/casino'), { DEBUG_VIEW_KEY: KEY });
    expect(res.status).toBe(401);
    const html = await res.text();
    expect(html).toContain('/debug');
    expect(html).not.toContain('/debug/casino-data');
  });

  it('answers 405 to anything but GET', async () => {
    const res = await call(casinoPage, new Request('https://x/debug/casino', { method: 'POST' }), {
      DEBUG_VIEW_KEY: KEY
    });
    expect(res.status).toBe(405);
    expect(res.headers.get('allow')).toBe('GET');
  });

  it('serves the dashboard with strict headers to a signed-in visitor', async () => {
    const res = await call(casinoPage, get('/debug/casino', { cookie }), { DEBUG_VIEW_KEY: KEY });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(res.headers.get('cache-control')).toContain('no-store');
    const csp = res.headers.get('content-security-policy') ?? '';
    expect(csp).toContain("default-src 'none'");
    expect(csp).toContain("connect-src 'self'");
    const html = await res.text();
    expect(html).toContain('Casino payouts');
    expect(html).toContain('/debug/casino-data');
    expect(html).toContain('Client-reported');
    expect(html).toContain('docs/plans/CASINO-ONCHAIN-LAYR-PLAN.md');
  });

  // Same trap as /debug: the markup is a template literal, so a stray backslash or dollar-brace
  // would quietly break the inline script while the HTML still looks fine.
  it('serves an inline script that actually parses', async () => {
    const res = await call(casinoPage, get('/debug/casino', { cookie }), { DEBUG_VIEW_KEY: KEY });
    const html = await res.text();
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    expect(scripts.length).toBeGreaterThan(0);
    for (const [i, source] of scripts.entries()) {
      expect(() => new Function(source), `inline script ${i} must parse`).not.toThrow();
    }
  });

  it('keeps the page free of external assets', async () => {
    const res = await call(casinoPage, get('/debug/casino', { cookie }), { DEBUG_VIEW_KEY: KEY });
    const html = await res.text();
    expect(html).not.toMatch(/<script[^>]+src=/);
    expect(html).not.toMatch(/<link[^>]+href=/);
    expect(html).not.toMatch(/https?:\/\/(?!www\.w3\.org)/);
  });
});
