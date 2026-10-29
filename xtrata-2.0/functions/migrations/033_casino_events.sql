-- Casino round log: one append-only row per game event reported by the ParallaX Casino pages (/casino and /casino-b).
-- Written by POST /casino/log (functions/casino/log.ts), read by /debug/casino (functions/debug/casino.ts).
-- Plain-language guide: docs/plans/CASINO-ROUND-LOG.md.
--
-- What is stored: when the event arrived (server clock) and when the page says it happened, which page and machine, a random
-- per-browser player id (pid, "p_..."), a per-page-load session id (sid, "s_...") and a counter (seq) that makes retries harmless,
-- the connected STX address (addr) when a wallet is connected (public chain data, kept so LAYR purchases can be matched to the
-- shop-address ledger), and the event itself: stake, win, jackpot part, reel stops, bonus detail, or the purchase transaction id.
-- What is NOT stored: the IP address, the browser fingerprint, any seed, key or signature, or anything typed by the player.
-- This is a CLIENT-REPORTED log for statistics. It is not proof of anything: a modified browser can send false numbers.
-- Recording is best-effort: if it fails, the casino carries on as normal.
--
--   Run once: npx wrangler d1 execute xtrata-manage --remote --file functions/migrations/033_casino_events.sql
--
-- Column mapping by kind (all money is whole LAYR; 1 STX = 100,000 LAYR):
--   spin   (k="spin")   bet = total stake level (charged only when free = 0), win = total paid by the spin (lines + scatters
--                       + jackpot), jp = the jackpot part of win, free = 1 for a free spin, stops = "a,b,c,d,e" (the five reel
--                       stops, 0..31, enough to replay the spin through the pure engine), flags = triggers seen: F free spins,
--                       V vault, C chain, rid = the engine's round id (hex) when it has one.
--   bonus  (k="bonus")  flags = vault | chain | pick, bet = the stake level of the round, win = LAYR collected, jp = jackpot
--                       part, rid = round id, detail = JSON {aw:[9 prizes], pk:[3 picks]} (vault) | {sum, full} (chain) |
--                       {mult} (a Neon Vault pick). A bonus is paid separately from the spin that triggered it.
--   gamble (k="gamble") bet = the stake risked, win = 0 (lost) or 2 x stake (won), detail = JSON {"w":1,"ch":"odd"}.
--   buy    (k="buy")    tx = the Stacks transaction id (0x + 64 hex), win = LAYR credited, detail = JSON {"bh":height} if sent.
--   move   (k="move")   flags = in (shared bankroll -> machine) | out (machine -> bankroll), win = LAYR moved.
--   machine is one of bf (Block Fortune), drop (The Drop), twins (Forever Twins), ds (Deep Strata), nv (Neon Vault),
--   ex (LAYR Exchange), bank (the shared bankroll).
--
-- Return to player (RTP) is computed as: SUM(win of spin and bonus rows) / SUM(bet of spin rows where free = 0).
-- The design figure is 94.38% on all five machines (docs/plans/CASINO-ROUND-LOG.md). A small sample swings wildly: you need
-- about a million paid spins for +-1%.
--
-- Handy queries (add --json for machine-readable output):
--   Per page and machine, with actual RTP (last 30 days):
--     npx wrangler d1 execute xtrata-manage --remote --command "SELECT page, machine, SUM(kind='spin' AND free=0) AS spins, SUM(CASE WHEN kind='spin' AND free=0 THEN bet ELSE 0 END) AS wagered, SUM(CASE WHEN kind IN ('spin','bonus') THEN win ELSE 0 END) AS won, ROUND(1.0*SUM(CASE WHEN kind IN ('spin','bonus') THEN win ELSE 0 END)/NULLIF(SUM(CASE WHEN kind='spin' AND free=0 THEN bet ELSE 0 END),0),4) AS rtp FROM casino_events WHERE day >= date('now','-30 day') AND kind IN ('spin','bonus') GROUP BY page, machine ORDER BY page, machine"
--   Biggest wins ever:
--     npx wrangler d1 execute xtrata-manage --remote --command "SELECT day, page, machine, kind, bet, win, jp, ROUND(1.0*win/bet,1) AS x_bet FROM casino_events WHERE kind IN ('spin','bonus') AND bet > 0 ORDER BY win DESC LIMIT 20"
--   Every jackpot paid:
--     npx wrangler d1 execute xtrata-manage --remote --command "SELECT datetime(at/1000,'unixepoch') AS time, page, machine, kind, bet, jp FROM casino_events WHERE jp > 0 ORDER BY at DESC LIMIT 50"
--   LAYR bought (as reported by the pages), per day, with transaction counts:
--     npx wrangler d1 execute xtrata-manage --remote --command "SELECT day, COUNT(*) AS purchases, COUNT(DISTINCT tx) AS distinct_tx, SUM(win) AS layr FROM casino_events WHERE kind='buy' GROUP BY day ORDER BY day DESC LIMIT 30"
--   The same transaction credited in more than one browser (should be empty):
--     npx wrangler d1 execute xtrata-manage --remote --command "SELECT tx, COUNT(*) AS times, COUNT(DISTINCT pid) AS browsers, SUM(win) AS layr FROM casino_events WHERE kind='buy' GROUP BY tx HAVING COUNT(*) > 1"
--   LAYR bought vs the chain: list the payments to the shop address and compare the transaction ids with these.
--     https://api.testnet.hiro.so/extended/v1/address/ST10W2EEM757922QTVDZZ5CSEW55JEFNN33V2E7YA/transactions
--     npx wrangler d1 execute xtrata-manage --remote --command "SELECT tx, win AS layr, addr, datetime(at/1000,'unixepoch') AS time FROM casino_events WHERE kind='buy' ORDER BY at DESC LIMIT 100"
--   Per-player totals (a player is a browser, pid; addr is filled when a wallet was connected):
--     npx wrangler d1 execute xtrata-manage --remote --command "SELECT pid, MAX(addr) AS addr, SUM(kind='spin' AND free=0) AS spins, SUM(CASE WHEN kind='spin' AND free=0 THEN bet ELSE 0 END) AS wagered, SUM(CASE WHEN kind IN ('spin','bonus') THEN win ELSE 0 END) AS won, MIN(day) AS first_day, MAX(day) AS last_day FROM casino_events GROUP BY pid ORDER BY wagered DESC LIMIT 50"
--   Delete raw rows older than 180 days (not automatic):
--     npx wrangler d1 execute xtrata-manage --remote --command "DELETE FROM casino_events WHERE at < (strftime('%s','now') - 180*86400) * 1000"
CREATE TABLE IF NOT EXISTS casino_events(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at INTEGER NOT NULL,
  ct INTEGER,
  day TEXT NOT NULL,
  page TEXT NOT NULL,
  pid TEXT NOT NULL,
  sid TEXT NOT NULL,
  seq INTEGER NOT NULL,
  addr TEXT,
  machine TEXT NOT NULL,
  kind TEXT NOT NULL,
  bet INTEGER,
  win INTEGER,
  jp INTEGER,
  free INTEGER,
  stops TEXT,
  flags TEXT,
  rid TEXT,
  tx TEXT,
  detail TEXT,
  UNIQUE(pid, sid, seq)
);
CREATE INDEX IF NOT EXISTS casino_events_day_machine ON casino_events(day, machine, kind);
CREATE INDEX IF NOT EXISTS casino_events_at ON casino_events(at);
CREATE INDEX IF NOT EXISTS casino_events_tx ON casino_events(tx) WHERE tx IS NOT NULL;
CREATE INDEX IF NOT EXISTS casino_events_addr ON casino_events(addr) WHERE addr IS NOT NULL;
CREATE INDEX IF NOT EXISTS casino_events_jp ON casino_events(at) WHERE jp > 0;
