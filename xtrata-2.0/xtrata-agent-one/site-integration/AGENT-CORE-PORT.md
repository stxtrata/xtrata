# PORT REQUIRED — agent-core.ts fixes (2026-07-01)

`wizard/agent-one.js` is REBUILT from `src/agent-one/agent-core.ts` (site repo) on every deploy,
so fixes patched into the bundle are wiped. All of the following were validated in the bundle and in
`svc/core.mjs` / `server/server.mjs` / `agent-large-inscribe.mjs` (which mirror the same logic and are
the reference implementations — copy from them). Port ALL of these into `src/agent-one/agent-core.ts`,
then set the build tag (last item) so `suno.html`'s version handshake unblocks live runs.

Three mainnet runs failed and refunded (~2–3 STX miner fees burnt each) because the deployed agent
lacked these. `suno.html` now BLOCKS live inscriptions until the deployed bundle reports the expected
build tag.

## 1. Fee-spike / fee-wait policy (the crash you saw 3×: "add-chunk-batch fee N exceeds cap")
Reference: `agent-large-inscribe.mjs` → `send()`.
In the tx-send helper, when the estimated fee exceeds the per-tx cap:
1. Retry estimation 3× (6 s apart) — catches one-off estimator glitches.
2. Then WAIT for fees to settle: up to 12 polls, 20 s apart, reporting progress each poll
   (job.progress = "network fees are high — waiting for them to settle (n/12)") so the UI shows
   waiting, not stuck. Keep progressAt fresh so the reaper doesn't fire.
3. Only then broadcast with a bounded fallback fee: 2× the last successful fee for that function
   (track per-fn in a Map), never above the cap. Never throw on a fee estimate.

## 2. Duplicate-hash guard (contract rejects identical hashes — never take payment for one)
Reference: `svc/core.mjs` → `createJob()`.
In createJob, BEFORE creating the wallet/job: chunk the bytes, compute the incremental hash, call
`get-id-by-hash`; if it exists, throw "already inscribed as token #N — no payment taken".

## 3. Idempotent single-tx mint (safe retries)
Reference: `svc/core.mjs` → `mintFile()`.
Before broadcasting mint-single-tx(-recursive), check `get-id-by-hash`; if present, return that
tokenId instead of re-minting. (Receipt mints go through the same helper — covered automatically.)

## 4. Auto-resume instead of refund on transient errors
Reference: `server/server.mjs` → `startBackground()` + `fastTrackTick()`.
- Classify errors: FATAL = /TX abort|not funded|locked to|unrecoverable|file bytes|empty file|could not determine/i;
  everything else is transient.
- On transient failure: retryCount ≤ 4, park job at status `INSCRIBED` (if tokenId set) else `FUNDED`,
  set job.progress = "recovered from a hiccup — resuming where it left off (attempt n/4)", return
  WITHOUT refunding. Backoff: skip resume until 15 s × retryCount since progressAt.
- Watcher: a job with depositReceivedUstx set counts as funded (mid-flight resumes have spent part of
  the deposit — do NOT re-check balance ≥ required). Skip runJob's funding gate when
  depositReceivedUstx is already set.
- Watcher: fastTrack job at INSCRIBED with tokenId → resume DELIVERY only (never re-mint).
- Clear retryCount on COMPLETE. Fatal errors / exhausted retries → existing refundAndClose failsafe.

## 5. File bytes persisted in IndexedDB (the "tab reloaded — file bytes gone" cancellation)
DB "xtrata-agent-one", store "files", key = jobId. Save bytes at createJob; restore before the
inscribe step and in the funding watcher; only cancel-and-refund after 3 failed restore attempts
("file bytes unrecoverable (browser storage cleared)"). Delete stored bytes on COMPLETE / CANCELLED /
deleteJob. Also suffix jobIds with 6 random chars (Date.now() collisions).

## 6. Dust-resistant funder detection
Reference: `svc/core.mjs` → `detectFunder()`.
Funder = sender with the LARGEST CUMULATIVE inbound STX (aggregate per sender over stx_inbound,
fallback transactions list), NOT the first inbound — blocks 1 µSTX dusting attacks that would steal
fast-track delivery + refunds.

## 7. Never-strand keys on expiry + mempool "payment seen"
Reference: `svc/core.mjs` → `refundAndClose()` / `hasPendingInbound()` / `statusJob()`;
`server/server.mjs` → `reapTick()`.
- Never delete a never-funded job's key: park as EXPIRED (key kept), check mempool before declaring
  empty; final key discard only after a 48 h grace; late payments auto-refund (or resume).
- AWAITING_DEPOSIT reaper window = 12× the normal window (payments can take many minutes).
- statusJob returns pending:true when an inbound transfer is in the mempool (UI-only signal).

## 8. Nakamoto-aware confirmation polling
waitTx: poll 2 s for the first ~45 iterations, then 6 s, ~210 iterations total (same overall ceiling,
much faster per-tx). Funding watcher tick 8 s → 4 s.

## 9. Verbose logging
`xaoLog(jobId, msg)` → console `[xao HH:MM:SS]` lines AND persisted job.log (cap 200, survives
reload); expose `XtrataAgent.getJobLog(jobId)`. Log: every fee estimate (value/cap/attempt),
broadcast txid, confirmation seconds, funder detection, watcher dispatches, resume decisions,
fatal-vs-transient classification. suno.html already renders this via its "View agent log" link.

## 10. Build tag — REQUIRED for the version handshake
Set `window.XAO_AGENT_BUILD = '2026-07-01.5'` and include `build` in the health payload.
`wizard/suno.html` refuses live inscriptions unless the bundle reports exactly this build.
Bump the tag AND suno.html's `XAO_EXPECTED_BUILD` together on future agent changes.
