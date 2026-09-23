# Mac 1.0.4 / Windows 1.0.7 — Phase 0 approval gate

Baseline: 41d74a4fe (new shared logo included), inspected 2026-09-23.
Both supplied briefs read in full. The release brief overrides the queue-only
brief for threshold listens and consent-bound automatic fee bumps. All named
paths exist under xtrata-2.0; no remapping required. No runtime changes, builds,
contract changes or payments performed in this phase.

## Existing invariants and implementation evidence

Paths below are relative to xtrata-2.0. Line numbers refer to this baseline.

| Invariant | Current evidence | Required regression coverage |
|---|---|---|
| Audio independent of payments | scripts/wizard/radio-listening-ui.js:38–56; radio-listening.mjs:53–82 | Free playback through rejection, outage, busy queue and cooldown |
| Consent/session/stop | radio-listening.mjs:27–33,48,72; radio-plays-backend.mjs:51,340–342,383–391 | Token/tab, expiry, stop epoch, kill switch, storage fault before sign and broadcast |
| Budgets and reserve | radio-plays-backend.mjs:15–18,378,385; radio-listening.mjs:37,44–46,65,72 | Cap-based reservation including every pending entry and bump headroom |
| Contract pin/network/postconditions | radio-plays-backend.mjs:10–11,379–389 | Source hash, mainnet, exact Equal 50/Deny, fixed function/arguments |
| Recipient | radio-plays-backend.mjs:386–387 | Missing/contract/self recipient rejected, changed owner read fresh |
| Playback duplicate protection | radio-listening.mjs:56–59,69–72; radio-listening-ui.js:44–56 | Repeated qualify, playback ID, pause/seek/mute/unmute, refresh |
| Durable journal and locks | radio-plays-backend.mjs:29–51,166,185–194,375,390–399 | Atomic write faults, stale locks, crash before/after broadcast, no second signature for nonce |
| Reconciliation/rebroadcast | radio-plays-backend.mjs:272–370 | Canonical abort terminal, receipt verification, lowest nonce only, attempt identity, resend spacing/limit |
| Returns | radio-plays-backend.mjs:195–269 | Block on any unresolved play; retain confirmed-return validation |
| API efficiency | radio-plays-backend.mjs:133–164; radio-listening.mjs:6–13 | Existing request-budget tests plus fee-estimate coalescing/cache and bounded reconciliation |
| Secrets | radio-plays-backend.mjs:14,166–184; radio-plays-report.mjs:13–20 | Explicit public-field projection including nested attempts; no raw/key/vault in UI/report |

## Findings that tighten or qualify the briefs

- Normal run() currently checks guard(), but does not receive the listening
  token/tab check callback at the final signing/broadcast boundaries. Pass an
  explicit authorization callback through submission and bump paths, and check
  it after asynchronous reads and journal saves. This is a strengthening, not
  an already-proven property of the old path.
- Continuous support intentionally ignores bounded lease/time/count expiration
  (radio-listening.mjs:27), while still ending on Stop/close/restart. Preserve
  that documented distinction; do not silently apply a short lease to continuous
  support. Recheck active session identity and epoch at every boundary.
- publicEntry currently strips only top-level raw. New priorAttempts containing
  raw bytes require an explicit public projection before the feature is usable.
- /v2/fees/transaction is a read-only POST. The coordinator currently recognizes
  only GET and contract-read POST calls as reads. Add the fee endpoint explicitly
  to read coalescing/pacing/caching; do not accidentally treat it as a broadcast.
- The asserted network facts in the briefs are inputs to verify, not established
  evidence in this review. Validate actual serialized size with the pinned SDK
  and official node/API references before implementing the 257-byte assertion.
- Never trust a client-supplied low threshold. Derive the threshold from locally
  established media duration; use 30 seconds when unknown. Validate all numbers
  as finite, bind begin/qualify to session, track and playback ID, and impose
  bounded in-memory retention. Client audible time remains an assertion, not
  cryptographic proof or on-chain listening verification.
- Server elapsed-time admission must allow an initial short track only after its
  threshold. Define cumulative time accounting explicitly (sum admitted thresholds
  against session elapsed time, with the stated two-second observation tolerance),
  rather than divide by a client-controlled minimum.
- The briefs forbid unsigned intent backlogs but require same-tick start
  serialization. Use only a bounded in-memory critical-section wait for immediate
  submission, rechecking consent before signing; never retain or retry unpaid
  intents across cooldown, recovery, restart or a long confirmation wait.
- A known gap must be recovered before extending the chain. Unknown/raw-less or
  uncertain entries block new signatures. MAX_PENDING starts at 5, hard limit20.
- A 429 may supply a cached fee estimate for display/selection, but must not bypass
  the shared cooldown or freshness checks needed to sign. That listen stays free.
- Cap approval is a deliberate change from the old fixed-fee promise. Existing
  approvals cannot authorize bumps. New approval must disclose maximum 1000
  microSTX, up to two replacements, and total worst-case cost including 50 to holder.
- Old apps must be tested against multi-entry journals with their old code, not
  merely against new fallback behaviour. Uncertain history is never deleted.

## Concrete implementation sequence (after approval)

1. Create codex/music-104-107 feature branch. Add explicit authorization plumbing,
   public diagnostic projection, unsigned size assertion and additive journal
   fields. Keep fee policy bounds; validate selected effective fee against cap.
2. Extract short locked submitNext; retain sequential run() for operator tests.
   Add nonce reconstruction/validation, reservations and bounded pending depth.
   Reconcile in nonce order with bounded request budgets; generalize manual
   recovery/attempt records without changing existing signed bytes.
   queuedPaidStarts stays off pending the release-default decision.
3. Add a testable audible accumulator, begin/qualify routes with strict schemas,
   server timing validation and clear listening/free/requested/confirmed labels.
   Add shared receipt encoder/decoder, package it for reports and local/public
   activity readers, and derive platform/version from running package metadata.
4. Add cached fee estimation and NoEstimateAvailable fallback; consent-bound
   head-only bumps after three minutes, maximum twice, within reserved fee cap.
   Preserve same nonce/receipt/arguments and reconcile all attempts.
5. Update PLAYBACK-NOTES, RECEIPT-FORMAT, diagnostics and release notes. Set Mac
   1.0.4 / Windows 1.0.7 consistently in package, lock root metadata, version map,
   Mac build overrides and staged runtime version. Include committed logo assets.
6. Run all radio/music/Windows-vault tests, lint, isolated desktop threshold smoke,
   old-journal/old-reader tests and package inspection. Build both universal Mac
   variants and native Windows x64. Test-only timing injection must exist solely
   in harness code, never the packaged runtime. Record exact revision/checksums.
7. Stop at Phase 5 for release-default decision. No mainnet canary, upload/public
   manifest update or publication without the separately required authorization.

## Existing tests deliberately affected

- scripts/wizard/__tests__/radio-listening.test.ts: busy-start/free expectations,
  one-start-one-payment setup and run stubs need explicit flag-off coverage plus
  begin/qualify/submitNext flag-on coverage. Keep continuous-vs-bounded tests.
- scripts/wizard/__tests__/radio-plays-backend.test.ts: signing diagnostics/size,
  pre-submit consent race and unknown submission; preserve old safety assertions.
- scripts/wizard/__tests__/radio-recovery.test.ts: single-unresolved restriction,
  priorAttempts and exact-byte rebroadcast, extended with queue/head cases.
- scripts/wizard/__tests__/radio-returns.test.ts: add multi-entry unresolved queue.
- scripts/music-support/desktop-smoke.mjs: first-audible/unmute timing expectations
  become threshold timing; keep minimized loops, exhaustion and no duplicates.
- scripts/music-support/__tests__/desktop.test.ts and source-package.test.ts:
  package allowlists/version/icon/shared receipt module expectations as needed.
- Browser signer tests: add serialized 257-byte assertion only, no signing-path
  behaviour change. Request-budget and Windows storage suites remain intact.
- Add focused offline threshold, receipt, queue and estimate/bump suites covering
  every case in both briefs. Mock all transport; never use a funded wallet.

## Gate

Awaiting Jim's Phase 0 approval before implementation, as explicitly requested in
PROMPT-music-mac-1.0.4-win-1.0.7.md. Recommended provisional defaults: threshold
mode on for new-version approvals; queuedPaidStarts off until Phase 5 review;
fee estimation on; automatic bumps off until their tests and cap consent pass
that gate. These are recommendations, not enabled settings.
