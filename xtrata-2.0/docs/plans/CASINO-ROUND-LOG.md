# Casino round log

Added 29 October 2026. Server side of the log for the ParallaX Casino pages
(`/casino/` and `/casino-b/`). Dashboard: `/debug/casino`. Proof is a separate,
later step: [CASINO-ONCHAIN-LAYR-PLAN.md](./CASINO-ONCHAIN-LAYR-PLAN.md).

## What it is, in one paragraph

Every time a machine finishes a spin, pays out a bonus or a double-or-nothing, or
someone buys LAYR or moves it between the shared bankroll and a machine, the page
sends a short note to `POST /casino/log`. The note becomes one row in the D1 table
`casino_events`. `/debug/casino` adds the rows up: LAYR staked, LAYR paid out, the
actual return to player beside the 94.38% design figure, the biggest wins, every
jackpot, LAYR bought and moved. Before this log existed, only the STX-in purchases
were visible anywhere (on the testnet, as payments to the shop address). Game
results and payouts were not recorded at all.

## What it is not

**It is a statistics log, not proof.** The numbers are reported by the player's own
browser. A modified browser can send anything. Use it to see how the machines are
behaving and to spot a bug or a surprising run. Do not use it to settle a dispute or
to pay anyone. The planned proof is on-chain settlement
([CASINO-ONCHAIN-LAYR-PLAN.md](./CASINO-ONCHAIN-LAYR-PLAN.md)), where the contract
holds the LAYR and the result is checked against the chain.

Recording is best effort. If it fails, the casino carries on as normal and the
visitor never sees an error.

## What is stored, and what is not

Stored per event: the time it arrived (server clock) and the time the page says it
happened; the page (`casino` or `casino-b`); the machine; a random per-browser
player id (`p_…`) and a per-page-load id (`s_…`) with a counter, which together make
retries harmless; the connected **testnet** wallet address when one is connected
(public chain data, kept so purchases can be matched to the shop-address ledger);
and the event itself: stake, win, jackpot part, the five reel stops, bonus detail,
or the purchase transaction id.

Not stored: IP address, user agent, browser fingerprint, any key, seed or
signature, anything typed by the player. A mainnet-shaped address is accepted but
discarded (the batch is kept, the address is not). Both pages say in their testnet
note that play is recorded this way.

## How a player sees none of it

`POST /casino/log` answers `204 No Content` to everything except a wrong method
(`405`). A malformed body, a cross-site post, a table that has not been created
yet, a database outage: all `204`, nothing written, nothing shown.

## Event format (version 1)

```json
{
  "v": 1,
  "page": "casino" | "casino-b",
  "pid": "p_[a-z0-9]{10,24}",
  "sid": "s_[a-z0-9]{6,16}",
  "addr": null | "ST…",
  "events": [ up to 50 ]
}
```

Every event has `seq` (counter within `sid`, whole number from 0), `t` (page clock,
epoch ms), `m` (machine) and `k` (kind).

| Machine | Meaning |
| --- | --- |
| `bf` `drop` `twins` `ds` `nv` | Block Fortune, The Drop, Forever Twins, Deep Strata, Neon Vault |
| `ex` | LAYR Exchange (purchases) |
| `bank` | The shared bankroll (moves) |

| Kind | Fields | Rules |
| --- | --- | --- |
| `spin` | `bet` 20..100000, `free` 0/1, `win`, `jp`, `st` (five reel stops, 0..31), `fx` (subset of `F` free spins, `V` vault, `C` chain), `rid` (hex round id, optional) | Game machines only. `jp` cannot exceed `win`. `bet` is charged only when `free` is 0. |
| `bonus` | `ty` `vault`/`chain`/`pick`, `bet`, `win`, `jp`, `rid`, `d` (small detail object) | Game machines only. Paid separately from the spin that triggered it. `d` is rebuilt from a whitelist and left out if over 400 characters. |
| `gamble` | `stake`, `w` 0/1, `win`, `ch` (up to 8 lowercase letters, optional) | Game machines only. `win` must be exactly 0 (lost) or twice the stake (won). |
| `buy` | `tx` (Stacks transaction id), `layr` (LAYR credited), `bh` (block height, optional) | `layr` at least 1. The id is normalised to `0x` plus 64 lower-case hex. |
| `move` | `dir` `in`/`out`, `n` | `in` = bankroll to machine, `out` = machine to bankroll. |

Numbers are whole numbers from 0 to 1,000,000,000,000 (the client time `t` may be up
to 1 January 2100). A bad envelope drops the whole request, a bad event drops only
itself. Retrying the same batch stores it once (`UNIQUE(pid, sid, seq)`).

The reel stops are stored on purpose: the engines are pure functions of the stops
and the stake, so any logged spin can be replayed to check that `win` is what the
engine would have paid. That replay is also the seed of the on-chain playback in the
LAYR plan.

## The browser side

One small logger is built into each page (search for `ROUND LOG` in
`public/casino/index.html` and `public/casino-b/index.html`; it is the same code on
both, exposed as `window.PXRoundLog`). It never waits for the network and nothing it
does can reach the game: every hook is wrapped so the game's own answer is returned
untouched, and a broken hook only means that event is not logged.

- **How it sees the games.** It wraps the pure engine's own `settle`, `collect`,
  `pick` and `gamble` once per engine. `/casino` does this in each machine's module.
  `/casino-b` runs every machine in its own iframe built from a pack; the pack makes
  its engine with `LAYR.machine(GAME_ID, engine)`, which returns a frozen object, so
  `createCasinoEngine` rewrites that one expression in the pack text just before the
  iframe is built (`pxRlPatch`) to hook the raw engine underneath. If the pack text
  is not exactly as expected, it is left alone and that machine is simply not logged.
  The packs inside the page are not changed.
- **When it sends.** Events are queued and sent in batches of up to 40: when 20 are
  waiting or every 12 seconds, and whatever is left is handed to the browser with
  `sendBeacon` when the tab is hidden or closed. At most 500 events are held; a
  failing endpoint is retried with a growing delay, and a 403, 404 or 405 switches the
  log off for that visit (a local copy of the page, or an old deploy).
- **Opting out.** `localStorage.setItem('px_rl_off', '1')` in the browser console
  turns it off for that browser; removing the key turns it back on. A page opened from
  a file (no server) does not send anything.
- **Not logged.** Preview spins (the forced bonus demonstrations), the machines that
  the room's computer-controlled visitors play in `/casino-b`, and anything on a
  copy of the page that is not served over http(s).
- **`move` events exist on `/casino` only.** Its machines hold their own LAYR taken
  from the shared bankroll (the coin slot), so each take and give is logged.
  `/casino-b` plays straight from one shared balance, so there is nothing to move.
- **`buy` events** are sent by the page that credits a payment, once per newly
  credited transaction (a repeat of the same payment is a duplicate and sends
  nothing). `addr` is the connected wallet on `/casino`, and on `/casino-b` the
  address that last paid for LAYR.
- **A rolled-back spin.** `/casino-b` saves each action with its balance and rolls the
  action back if the save fails. The event is queued as the engine answers, so in
  that rare case a spin that never happened could appear in the log. Another reason
  this is statistics, not a ledger.

## Abuse limits

1. Same-origin check. Cross-site posts are dropped.
2. At most 50 events and 64,000 bytes per request, strict field checks, duplicates ignored.
3. **A Cloudflare rate-limiting rule on `POST /casino/log`** (see activation).
4. Kill switch: set the Pages variable `CASINO_LOG_DISABLED` to `1`; the endpoint
   answers `204` and writes nothing.

Because the log is open to the public, anyone can add false rows. That is another
reason it is a statistics tool and not a ledger.

## Reading the dashboard

Sign in at `/debug` with the dashboard key, then open `/debug/casino`. The same key
protects both (`DEBUG_VIEW_KEY`, at least 24 characters). Pick 24 hours, 7 days,
30 days or all time.

- **Actual return** is LAYR paid out (every spin win plus every bonus collected,
  jackpots included) divided by LAYR staked on charged spins. Free spins add to the
  pay-out and not to the stake, which is how the design figure is defined.
- **The design figure is 94.38%** on all five machines (5.62% house edge), from the
  exact audit of 28 October 2026. The dot beside each machine's return is grey until
  it has 20,000 paid spins, then green within 3 points of the design figure, amber
  within 8, red beyond.
- **Small samples swing widely.** A machine only settles near its design figure
  after about a million paid spins (plus or minus 1%). Deep Strata in particular pays
  its big multiples more often than Block Fortune at the same return, so a handful of
  large wins early on is not evidence of a fault.
- **LAYR bought** is as reported by the pages. To check it, list the payments to the
  shop address on the testnet and compare transaction ids. The dashboard flags any
  transaction credited in more than one browser.

## Activation (once, by Jim)

Nothing is recorded until all of these are done. Until then the pages carry on
normally and the dashboard says "No data yet".

1. Create the table (idempotent, safe to repeat):
   `npx wrangler d1 execute xtrata-manage --remote --file functions/migrations/033_casino_events.sql`
2. Make sure `DEBUG_VIEW_KEY` (24 or more characters) is set on the Pages project.
   It already is if `/debug` works.
3. Add a rate-limiting rule in the Cloudflare dashboard: Security, WAF, Rate limiting
   rules. Match: URI path equals `/casino/log` and method equals POST. Suggested:
   120 requests per minute per IP, then block for a minute.
4. Optional kill switch: Pages variable `CASINO_LOG_DISABLED` = `1`.

Retention is manual. The migration header carries the query that deletes rows older
than 180 days, and ready-made queries for per-machine RTP, biggest wins, every
jackpot, purchases per day, double-credited transactions and per-player totals.

## Files

- `functions/migrations/033_casino_events.sql` (table, indexes, column mapping, queries)
- `functions/lib/casino-ingest.ts` (validation and row building)
- `functions/casino/log.ts` (`POST /casino/log`)
- `functions/debug/casino-data.ts` (`GET /debug/casino-data?range=24h|7d|30d|all`)
- `functions/debug/casino.ts` (`GET /debug/casino`)
- `functions/lib/db.ts` (`runBatch` helper), `functions/cloudflare-types.d.ts` (`D1Database.batch`)
- Tests: `functions/lib/__tests__/casino-ingest.test.ts`,
  `functions/__tests__/casino-log.test.ts`, `functions/debug/__tests__/casino.test.ts`

## Where this goes next

The log tells us how the machines behave on the testnet. It cannot make a payout
trustworthy. The LAYR plan replaces trust in the browser with a contract that holds
the LAYR, derives the randomness from the chain, and publishes each round so anyone
can replay it. This log's event format was chosen to line up with that (stops, round
id, stake, win), so the same replay code serves both.
