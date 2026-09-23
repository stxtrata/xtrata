# Phase 3 — audible threshold and structured receipts

Checkpoint: branch `codex/music-104-107`, based on Phase 2 `20c214b8c`.
This report and its companion implementation commit are the Phase 3 checkpoint.
Next action after approval: Phase 4 fee estimates, capped approval and head-only bumps.

## Implemented

- Bundled local/desktop radio now uses `/listening/begin` and `/listening/qualify`.
  Begin cannot pay. Qualify checks server media duration, elapsed wall time,
  reported audible time, active consent, duplicate IDs and cumulative admitted
  thresholds against session elapsed time (two seconds tolerance).
- Audible wall-clock accumulator excludes pause, mute, zero volume, seeking,
  buffering and mismatched media. Media position/rate never adds listening time.
  Unknown duration requires 30 seconds; a 12-second track requires 11.
  Skips before the threshold remain free and no catch-up request is queued.
- Strict endpoint schemas and bounded registration/deduplication maps (10,000)
  fail closed. Signing/broadcast still use the existing consent and journal guards.
- Structured 16-byte receipts use runtime platform/staged app version, reported
  seconds, threshold, flags and six random bytes. Duplicate receipts regenerate.
  The actual offline wallet tests still produce 257-byte transactions at fee 257.
- Shared receipt decoder powers audit reports and public/local chain activity.
  It labels legacy random starts separately from threshold listens.
- Local `/listening/start` HTTP route is retired with an update message. The
  separately authenticated legacy extension bridge still invokes the internal
  start path for compatibility and emits legacy random receipts. Operator tests
  also retain start semantics. Neither path claims threshold listening.
- Staged versions are Mac 1.0.4 (standard/legacy), Windows 1.0.7. Public release
  manifests/downloads are unchanged. Queue remains default OFF; no fee bump yet.

## Verification

| Check | Result |
|---|---|
| 26 targeted radio/music suites | PASS: 183 tests |
| New clock/admission/receipt suite | PASS: 8 tests |
| Real disposable wallet + mocked transport: three threshold receipts/nonces | PASS |
| Desktop Electron smoke, isolated profile/local 3/4-second media/simulated wallet | PASS |
| Desktop actual-entrypoint startup/single-instance/off-by-default smoke | PASS |
| Targeted lint on new codec/listening coordinator/player | PASS |
| Repository lint | Existing 276 errors; no rules relaxed (Phase 2 baseline 276) |
| Mac arm64 inspection-only app | PASS: 353 ASAR entries, no wallet/test/dev files |
| Native Windows runtime/DPAPI/installer | NOT RUN this phase |
| Universal/legacy installers | NOT BUILT this phase (Phase 5) |
| Live network signing, fund movements, publication | NOT RUN |

Tests cover skip/short/unknown durations, pause/mute/seek wall time, absent/early/
duplicate qualifies, admission rate, revoked consent, unavailable media/catalogue,
receipt versions/collision, and the existing wallet recovery/returns/rate-limit/
queue suites. The graphical smoke proves real audio events, minimized looping,
pause/resume and catalogue refresh without duplicate payment.

The full broad wizard run also exposed two pre-existing public-history test
fixture failures: its default localhost URL selects manual history loading, while
those tests assert public automatic loading. They now explicitly use the public
site URL. No runtime history timing or fetch policy was changed.

Existing backend start-path tests remain as compatibility regression tests.
`desktop-smoke.mjs` deliberately changes from first-audible payment to real short
track thresholds (2/3 seconds), with normal playback rate. There is **no threshold
override in production or in the harness**. Package inspection checks for test
files and override identifiers; reviewed production configuration has no override.

## Reproduce

From `xtrata-2.0`:

```sh
npx --no-install vitest run scripts/wizard/__tests__/radio-*.test.ts scripts/wizard/__tests__/music-*.test.ts scripts/music-support/__tests__ src/lib/radio/__tests__
npm --prefix desktop/music run prepare:app
node scripts/music-support/desktop-smoke.mjs
node scripts/music-support/desktop-startup-smoke.mjs
npm run lint
```

Inspection build from `desktop/music`:

```sh
npx --no-install electron-builder --mac --dir --arm64 --publish never -c.directories.output=../../.artifacts/music-phase3 -c.extraMetadata.version=1.0.4
```

Then from `xtrata-2.0`:

```sh
node scripts/music-support/windows-package-inspect.mjs --asar '.artifacts/music-phase3/mac-arm64/Xtrata Music.app/Contents/Resources/app.asar' --report .artifacts/music-phase3/package-inspection.json
```

That shared inspector has a historical Windows name; this invocation inspected
Mac arm64 only. The build is unsigned, not notarized and not a release installer.
Screenshot: `.artifacts/music-desktop-test/lounge.png`. Logs from this run are
local `/tmp/music-phase3-*.log`; the persistent evidence is this report and tests.

## Limits / gate

Client audible seconds are not cryptographic proof of listening. The deployed
contract still calls its event a paid play and its aggregate mixes old starts
with new listens. See `RECEIPT-FORMAT.md` and `desktop/music/PLAYBACK-NOTES.md`.

Stop here under the supplied release brief's “stop at each gate and report” rule.
Phase 4 is not yet implemented; this is not release readiness or approval to spend.

Inspection ASAR SHA-256: `ce8107484c58474256d495fb059d97f038cc914a6cafc84905bd3f073a422b31`. Runtime source and Mac 1.0.4 metadata match the final working tree.
