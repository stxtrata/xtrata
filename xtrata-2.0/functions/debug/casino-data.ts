/**
 * Read model for the /debug/casino dashboard. GET /debug/casino-data?range=24h|7d|30d|all
 *
 * Pre-aggregated JSON from D1 `casino_events` (functions/migrations/033_casino_events.sql): per machine spins, money in,
 * money out and the actual return to player (RTP) beside the design figure; gambles; LAYR purchases; bankroll moves;
 * players; the biggest wins; the latest jackpots; a daily trend. Read-only.
 *
 * The numbers are CLIENT-REPORTED. This is a statistics log, not proof (docs/plans/CASINO-ONCHAIN-LAYR-PLAN.md).
 *
 * Access is fail-closed exactly like /debug/data: DEBUG_VIEW_KEY must be configured and a matching x-debug-key header or
 * the HttpOnly dashboard cookie (set by signing in at /debug) is required.
 */
import { jsonResponse } from '../lib/utils';
import { queryAll, type Env as DbEnv } from '../lib/db';
import { configuredDebugKey, hasDebugAccess } from '../lib/debug-auth';
import { SAMPLE_CAUTION, THEORY_RTP } from '../lib/casino-ingest';

type Env = DbEnv & { DEBUG_VIEW_KEY?: string };

/** Hours per range. 'all' reaches back to the start of time. */
const RANGES: Record<string, number | null> = {
  '24h': 24,
  '7d': 24 * 7,
  '30d': 24 * 30,
  all: null
};

function rows<T = Record<string, unknown>>(res: unknown): T[] {
  return ((res as { results?: T[] } | null)?.results ?? []) as T[];
}
const int = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const ratio = (won: number, wagered: number): number | null =>
  wagered > 0 ? Math.round((won / wagered) * 10000) / 10000 : null;

export const onRequest: PagesFunction = async ({ request, env }) => {
  const e = env as Env;
  const url = new URL(request.url);

  const debugKey = configuredDebugKey(e);
  if (!debugKey) {
    return jsonResponse({ ready: false, secured: true, misconfigured: true }, 503, {
      'Cache-Control': 'private, no-store'
    });
  }
  if (!hasDebugAccess(request, debugKey)) {
    return jsonResponse({ ready: false, secured: true, unauthorized: true }, 401, {
      'Cache-Control': 'private, no-store'
    });
  }

  const requested = url.searchParams.get('range') ?? '7d';
  const rangeKey = Object.prototype.hasOwnProperty.call(RANGES, requested) ? requested : '7d';
  const hours = RANGES[rangeKey];
  const since = hours === null ? 0 : Date.now() - hours * 3_600_000;

  try {
    const [byMachine, gamble, buys, duplicates, moves, players, topWins, jackpots, daily] =
      await Promise.all([
        queryAll(
          e,
          `SELECT page, machine,
                SUM(CASE WHEN kind='spin' AND free=0 THEN 1 ELSE 0 END) AS spins,
                SUM(CASE WHEN kind='spin' AND free=1 THEN 1 ELSE 0 END) AS free_spins,
                SUM(CASE WHEN kind='spin' AND free=0 THEN bet ELSE 0 END) AS wagered,
                SUM(win) AS won,
                SUM(CASE WHEN jp>0 THEN 1 ELSE 0 END) AS jackpot_count,
                SUM(jp) AS jackpot_paid,
                MAX(win) AS biggest,
                SUM(CASE WHEN kind='bonus' THEN 1 ELSE 0 END) AS bonuses
           FROM casino_events
          WHERE at > ? AND kind IN ('spin','bonus')
          GROUP BY page, machine
          ORDER BY page, machine`,
          [since]
        ),
        queryAll(
          e,
          `SELECT COUNT(*) AS n, SUM(bet) AS staked,
                SUM(CASE WHEN win>0 THEN bet ELSE -bet END) AS net
           FROM casino_events WHERE at > ? AND kind='gamble'`,
          [since]
        ),
        queryAll(
          e,
          `SELECT COUNT(*) AS n, SUM(win) AS layr, COUNT(DISTINCT pid) AS players,
                COUNT(DISTINCT addr) AS addresses, COUNT(DISTINCT tx) AS distinct_tx
           FROM casino_events WHERE at > ? AND kind='buy'`,
          [since]
        ),
        queryAll(
          e,
          `SELECT COUNT(*) AS n FROM (
             SELECT tx FROM casino_events WHERE at > ? AND kind='buy'
              GROUP BY tx HAVING COUNT(*) > 1)`,
          [since]
        ),
        queryAll(
          e,
          `SELECT flags AS dir, SUM(win) AS layr
           FROM casino_events WHERE at > ? AND kind='move' GROUP BY flags`,
          [since]
        ),
        queryAll(
          e,
          `SELECT COUNT(DISTINCT pid) AS pids, COUNT(DISTINCT addr) AS addrs
           FROM casino_events WHERE at > ?`,
          [since]
        ),
        queryAll(
          e,
          `SELECT kind, machine, page, win, bet, jp, day
           FROM casino_events WHERE at > ? AND kind IN ('spin','bonus') AND win > 0
           ORDER BY win DESC, at DESC LIMIT 10`,
          [since]
        ),
        queryAll(
          e,
          `SELECT at, kind, machine, page, jp, bet
           FROM casino_events WHERE jp > 0 ORDER BY at DESC LIMIT 15`
        ),
        queryAll(
          e,
          `SELECT day,
                SUM(CASE WHEN kind='spin' AND free=0 THEN 1 ELSE 0 END) AS spins,
                SUM(CASE WHEN kind='spin' AND free=0 THEN bet ELSE 0 END) AS wagered,
                SUM(CASE WHEN kind IN ('spin','bonus') THEN win ELSE 0 END) AS won,
                COUNT(DISTINCT pid) AS players
           FROM casino_events WHERE at > ?
          GROUP BY day ORDER BY day`,
          [since]
        )
      ]);

    const machines = rows(byMachine).map((r) => {
      const wagered = int(r.wagered);
      const won = int(r.won);
      return {
        page: String(r.page),
        machine: String(r.machine),
        spins: int(r.spins),
        freeSpins: int(r.free_spins),
        wagered,
        won,
        rtp: ratio(won, wagered),
        theoryRtp: THEORY_RTP,
        jackpots: { count: int(r.jackpot_count), paid: int(r.jackpot_paid) },
        biggestWin: int(r.biggest),
        bonusesCollected: int(r.bonuses)
      };
    });
    const totalWagered = machines.reduce((sum, m) => sum + m.wagered, 0);
    const totalWon = machines.reduce((sum, m) => sum + m.won, 0);

    const g = rows(gamble)[0] ?? {};
    const b = rows(buys)[0] ?? {};
    const p = rows(players)[0] ?? {};
    const moved = rows<{ dir: string; layr: unknown }>(moves);
    const layrIn = int(moved.find((m) => m.dir === 'in')?.layr);
    const layrOut = int(moved.find((m) => m.dir === 'out')?.layr);

    return jsonResponse(
      {
        ready: true,
        secured: true,
        clientReported: true,
        generatedAt: Date.now(),
        range: rangeKey,
        rangeHours: hours,
        theoryRtp: THEORY_RTP,
        caution: SAMPLE_CAUTION,
        totals: {
          spins: machines.reduce((sum, m) => sum + m.spins, 0),
          freeSpins: machines.reduce((sum, m) => sum + m.freeSpins, 0),
          wagered: totalWagered,
          won: totalWon,
          rtp: ratio(totalWon, totalWagered)
        },
        machines,
        gamble: { count: int(g.n), staked: int(g.staked), net: int(g.net) },
        buys: {
          count: int(b.n),
          layrCredited: int(b.layr),
          distinctTransactions: int(b.distinct_tx),
          distinctPlayers: int(b.players),
          distinctAddresses: int(b.addresses),
          transactionsCreditedTwice: int(rows(duplicates)[0]?.n)
        },
        moves: { inLayr: layrIn, outLayr: layrOut },
        players: { distinctPid: int(p.pids), distinctAddr: int(p.addrs) },
        topWins: rows(topWins).map((r) => {
          const bet = int(r.bet);
          const win = int(r.win);
          return {
            kind: String(r.kind),
            machine: String(r.machine),
            page: String(r.page),
            win,
            bet,
            multiple: bet > 0 ? Math.round((win / bet) * 10) / 10 : null,
            jackpot: int(r.jp) > 0,
            day: String(r.day)
          };
        }),
        jackpots: rows(jackpots).map((r) => ({
          at: int(r.at),
          kind: String(r.kind),
          machine: String(r.machine),
          page: String(r.page),
          paid: int(r.jp),
          bet: int(r.bet)
        })),
        daily: rows(daily).map((r) => ({
          day: String(r.day),
          spins: int(r.spins),
          wagered: int(r.wagered),
          won: int(r.won),
          rtp: ratio(int(r.won), int(r.wagered)),
          players: int(r.players)
        }))
      },
      200,
      { 'Cache-Control': 'private, no-store' }
    );
  } catch (err) {
    return jsonResponse(
      {
        ready: false,
        secured: true,
        reason: err instanceof Error ? err.message : 'query failed',
        hint: 'Apply functions/migrations/033_casino_events.sql to the xtrata-manage D1 database.'
      },
      200,
      { 'Cache-Control': 'private, no-store' }
    );
  }
};
