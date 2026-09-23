# Phase 4 — capped fees and bounded automatic replacements

Checkpoint: `codex/music-104-107`, based on Phase 3 `35feb1eb6`.
This report's implementation commit completes Phase 4. Next gate: Phase 5 native
Windows and standard/legacy Mac builds, inspections and release-default decision.
No publishing, live signing or funded-wallet testing was performed.

## What changed

New bundled UI approvals explicitly send `feeMode: cap`; default maximum is
1,000 microSTX. The usual floor remains 257 microSTX and holder payment is exactly
50 microSTX. Existing fixed-fee approvals, legacy bridge clients and operator tests
remain fixed-fee and do not silently acquire automatic replacement permission.

The estimator sends the unsigned payload plus `estimated_len: 257`. It is a read
operation on the existing serialized/coalesced request coordinator. Successful
estimates and failed checks are paced to once per minute, shared across songs.
`NoEstimateAvailable` uses the transfer-rate × 257 fallback. Other failures use
an estimate younger than ten minutes, otherwise 257. A 429 still blocks signing
and broadcasting throughout cooldown. An above-cap low estimate leaves music free.

The RPC request/response shape was checked against the official
[Stacks RPC documentation](https://docs.stacks.co/reference/api).

The oldest submitted transaction may receive at most two fee increases, after
180,000 ms, only when visibly pending and its original cap/session consent remains
active. Fee is `min(cap, max(old+1, ceil(old*1.5), low estimate))`. Replacements
keep the same nonce, receipt and arguments; they retain every old attempt before
broadcast. Reconciliation accepts either winning attempt and reports its actual
fee and recipient. Prepared/uncertain records never trigger automatic increases.
Missing transactions retain same-bytes recovery of the latest saved attempt.

Consent, stop epoch, kill switch and storage checks run immediately before signing
and submission. Recovery uses unsigned construction followed by an explicitly
guarded signature, rather than a helper that signs internally. The contract hash,
mainnet identity, current owner, 257-byte assertion and Equal-50 Deny post-condition
remain enforced. Recovery 4xx reasons are retained without exposing raw bytes.

All new balance reservations and bounded budgets use the cap. This deliberately
reserves more than the floor and can stop support with some funds remaining.
No payment below that worst-case balance is promised. A head with expired approval,
exhausted replacements or its cap reached blocks new capped listens behind it.

## Verification

| Gate | Result |
|---|---|
| 26 targeted music/radio suites | PASS: 196 tests |
| Real isolated wallet + mocked transport | PASS: fee choice, caps, replacements, reconciliation, consent races |
| Shared read-budget suite | PASS: includes estimation POST pacing/coalescing |
| Electron desktop smoke | PASS: explicit cap approval, muted/free playback, threshold payment, minimized loops, no duplicates |
| Targeted listening/player lint | PASS |
| Repository lint | 276 pre-existing errors, same count as Phase 3; no rules relaxed |
| Mac arm64 inspection-only package | PASS: 353 entries, required runtime present, no secrets/test/dev paths |
| Windows native runtime and installer | NOT RUN in this phase |
| Universal/legacy Mac release installers | NOT BUILT in this phase |
| Live transactions/publication | NOT RUN |

New tests extend existing suites: floor/busy/above-cap choices; transfer fallback;
recent-estimate fallback and expiry; failed-check caching; 429 prevents new signing;
cap balance reservation; two head-only bumps; winning original/replacement; same
receipt across attempts; too-young/prepared/other-session refusals; stop during key
access and journal save; latest-byte recovery; cap-aware approval limits; estimator
POST scheduling. Existing recovery, return, Windows vault, old-journal/downgrade,
metadata and public reader tests remain in the run.

The desktop simulated balance changes from 1,050 to 3,150 microSTX to exercise
three payments at the simulated worst-case cap. Real wallet fee selection is
covered separately with mocked HTTP transport; the GUI simulation does not
represent real mining or spend any funds.

## Reproduction / artifacts

From `xtrata-2.0`:

```sh
npx --no-install vitest run scripts/wizard/__tests__/radio-*.test.ts scripts/wizard/__tests__/music-*.test.ts scripts/music-support/__tests__ src/lib/radio/__tests__
npm --prefix desktop/music run prepare:app
node scripts/music-support/desktop-smoke.mjs
npm run lint
```

From `desktop/music`:

```sh
npx --no-install electron-builder --mac --dir --arm64 --publish never -c.directories.output=../../.artifacts/music-phase4 -c.extraMetadata.version=1.0.4
```

Then from `xtrata-2.0`:

```sh
node scripts/music-support/windows-package-inspect.mjs --asar '.artifacts/music-phase4/mac-arm64/Xtrata Music.app/Contents/Resources/app.asar' --report .artifacts/music-phase4/package-inspection.json
```

The shared inspector's filename is historical; this run inspects Mac arm64, not
Windows. The local build is unsigned and is not a published release installer.
Logs: `/tmp/phase4-*.log`. Screenshot: `.artifacts/music-desktop-test/lounge.png`.
The persistent evidence is this report and the committed tests. Queue stays OFF;
release-default decisions and complete installer builds remain at Phase 5.

Inspected ASAR SHA-256: `3af405af1d8748df7e8bbebbae9e831d5ef05e594ed65f4201634e23d835fa87`; runtime source matches this phase.
