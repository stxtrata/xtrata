# Phase 2 — bounded nonce chaining (default off)

Branch: codex/music-104-107. No version bump, deployment, publication or live
payment. Queuing is selected only through RadioWizard's constructor option
`queuedPaidStarts: true`; it defaults to false. `maxPending` defaults to 5 and
constructor validation allows only 1–20. No browser endpoint can alter it.

## Implementation

- Listening calls are serialized through a bounded in-memory critical-section
  wait (at most maxPending entrants, a 20-second admission window). They are
  never persisted, retried after failure or retained until confirmation. Consent
  is rechecked after waiting. This is immediate-submission contention handling,
  not an unsigned payment backlog.
- submitNext invokes the shared signing/journalling/broadcast path under run.lock
  and returns once the expected txid is accepted. The sequential operator runner
  still waits for confirmation. Queued confirmations use background recovery.
- Nonces are backfilled in memory from signed bytes when the array journal is
  read. Conflicting explicit nonces or corrupt raw data fail closed. New saves
  persist the additive nonce field. Raw-less historical entries block chaining.
- Before signing, verify saved signatures, signer, contract/function/arguments,
  fee, mainnet and the exact Equal-50/Deny postcondition; validate the contiguous
  nonce chain against account/mempool/missing-nonce information. Foreign nonces,
  gaps, uncertain heads and exhausted resend limits leave new starts free.
- Confirmed balance covers all unresolved fees + 50 per entry, the next payment
  and the bounded-mode reserve. Pending entries count towards session/lifetime
  limits. No new chain calls per start are added beyond the existing checks.
- Reconciliation processes the pending journal in nonce order, records terminal
  aborts without retry, and checks the saved receipts for confirmations.
  Missing recovery resends only the lowest saved nonce, using identical bytes,
  with the same three-resend limit and 60-second spacing. A head nonce reported
  occupied in the mempool is treated conservatively instead of guessed about.
- Manual fee replacement now permits the lowest unresolved nonce with a tail
  behind it. It preserves original raw evidence locally, marks the replacement
  prepared before broadcast, and reconciles either winning txid. Automatic bumps
  remain unimplemented until Phase 4. UI diagnostics omit nested signed bytes.

## Verification

132 tests passed across 14 suites. Queue-specific suite: 21 cases including
rapid/concurrent submissions, duplication, unknown broadcast, exact-byte head
recovery and limits, canonical abort, foreign nonce/gap/depth, balance reservation,
stop/epoch/lease/kill races, cooldown, restart/backfill/raw-less journal, returns,
manual replacement (either winner), bounded reserve and default-off behaviour.
All transports mocked; actual wallet serialization and filesystem code exercised.

A frozen test-only copy of the released 1.0.3/1.0.6 backend (7b6c9e409, only the
inscribe import path adapted) proves that old code refuses the multi-entry
journal without signing or resending. No production source imports that fixture.
Existing suites were retained; this phase changes no old expected behaviours.
Native Windows CI configuration includes the new queue suite for Phase 5.

Isolated Electron playback and actual-entrypoint tests passed: free/muted mode,
one payment on unmute, pause/resume protection, minimized looping/exhaustion,
wallet reuse and second-instance refusal. These exercise the release-default
sequential path; real queue behaviour is covered by the offline wallet suite.

Inspection-only arm64 Mac package: 352 ASAR entries, runtime source matched,
no test/development/wallet files. The same cross-platform package-inspection
script was used; its report target was relabelled Mac rather than claiming a
Windows run. Report: .artifacts/music-phase2/package-inspection.json.
This is not a release installer. Native Windows and universal release builds
remain Phase 5 work. No personal wallet was accessed.

Whole-repository lint: 276 existing-style findings, including the two unchanged
no-unsafe-finally findings duplicated in the frozen historical fixture (274 at
Phase 1). No lint rules disabled. The runtime lock-release handling is unchanged.

## Gate and remaining work

Phase 3 adds server/client listen thresholds and structured receipts. Phase 4
adds estimates, cap reservation and automatic bumps. Phase 5 determines release
defaults and builds Mac 1.0.4 / Windows 1.0.7. Stop at this checkpoint as requested
by the supplied phased brief; nothing is enabled in published apps.
