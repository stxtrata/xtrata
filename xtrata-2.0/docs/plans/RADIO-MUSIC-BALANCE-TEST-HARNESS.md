# Support as you listen: implementation test harness

Status: proposed harness, 17 September 2026. This document defines the loop for
building the Music Wallet integration in small, reviewable gates. It authorises
no signing, broadcasts or spending. Mainnet work always requires a fresh
disposable wallet and separate, bounded user authorisation.

## Current handoff state

Implementation update: `npm run test:radio-support` now runs read-only schema and
DOM checks, with `--gate schemas` or `--gate ui`. Reports explicitly mark the full
implementation incomplete. Other command examples below remain planned. See
[progress and review findings](../radio/SUPPORT-IMPLEMENTATION.md). Full Gate 1
(including lease/start schemas) and Gate 2 (actual radio layout) remain open.

The commands under **Harness shape** are the target interface and are not present
in `package.json` yet. No harness runner, fake companion, native companion or
browser extension has been implemented. The next implementation starts at Gate 1;
Gate 0 is the verified baseline, not evidence that integration already exists.

Baseline rerun on 17 September 2026:

- `npm run test:radio-plays`: 9 contract and 20 deployment-console tests passed.
- `npm run test:radio-wallet`: 9 browser test-wallet model tests passed.
- Focused radio/function suite: 15 files and 86 tests passed.
- `npm run build:radio`: passed; output was 76.06 kB, 30.95 kB gzip. Vite retained
  the existing `/radio-face.jpg` runtime URL warning.

This is the handoff order:

| Integration stage | Harness evidence required |
| --- | --- |
| Schemas and passive UI | Gates 1–2 |
| Companion policy, journal and recovery | Gate 3 |
| Authenticated bridge and packaging | Gates 4 and 7 |
| Shared audible-start hook | Gates 5–6 |
| Disposable-wallet canary | Gate 8 |
| Small opt-in rollout | Gate 9 |

## Purpose

The harness must answer one question repeatedly: can the radio start immediately
and keep playing while an eligible start is recorded and paid exactly once when
the local wallet is ready, and remain a normal free start in every other case?

Run gates in order. A gate is complete only when its automated checks pass, its
artifact report explains what was tested, and the preceding gates remain green.
On failure, stop at that gate, fix the smallest responsible layer, rerun that gate,
then rerun the cumulative offline suite. Never weaken an assertion, spending rail,
origin check or failure state merely to make the harness pass.

## Harness shape

Create a single offline-first runner, provisionally:

```sh
npm run test:radio-support
npm run test:radio-support -- --gate bridge
npm run test:radio-support -- --gate browser
npm run test:radio-support -- --report
```

The default command runs every implemented non-broadcast gate. `--gate` runs one
gate plus its prerequisites. Each run writes a sanitised JSON result and readable
Markdown summary under `.artifacts/radio-support-harness/<run-id>/`. Reports may
contain public addresses, fake transaction IDs and timings. They must never contain
private keys, mnemonics, unlock material, signed transaction bytes or raw backups.

Use a deterministic fake companion for most tests. It implements the same
versioned `status`, `historyPage`, `acquirePlaybackLease`, `startIntent`,
`releaseLease` and `openDashboard` messages planned for production. Scenario files
control balances, delays, transaction outcomes and crashes without changing
application code.

The live canary is a separate command and is impossible to reach from the default
runner:

```sh
npm run test:radio-support:canary -- --preflight
npm run test:radio-support:canary -- --broadcast --authorization <run-id>
```

The canary command must reject a missing/expired authorization record, a reused
run ID, a non-disposable address, an unresolved journal, changed contract bytes,
or a requested maximum spend above the separately approved amount. Merely running
tests or funding a wallet does not authorise a broadcast.

## Gate 0 — immutable baseline

**Goal:** prove the existing application, radio, likes, counters, deployed helper
definition and wizard safeguards are unchanged before integration work starts.

Run the existing focused suites:

```sh
npm run test:radio-plays
npm run test:radio-wallet
./node_modules/.bin/vitest run \
  src/lib/radio/__tests__ \
  src/home/__tests__/radio-play-token.test.ts \
  src/home/__tests__/radio-likes-ui.test.ts \
  functions/radio/__tests__
npm run build:radio
```

**Pass:** all checks pass; the paid-play source hash, contract ID, 50-microSTX
holder transfer and supported cores remain pinned; the production build contains
no new signer or secret. Save timing and bundle-size baselines.

**Stop:** any existing test fails, the working tree contains unknown changes, or
the pinned contract differs. Resolve before adding integration code.

## Gate 1 — schemas and hostile input

**Goal:** make the page/companion boundary small, versioned and incapable of
expressing an arbitrary transaction.

Add pure unit and property tests for:

- Valid and invalid `MusicWalletStatus`, history page, lease and start-intent data.
- Maximum string lengths, integer microSTX parsing and cursor/page limits.
- Rejection of unknown schema versions, testnet, arbitrary contract IDs, recipient,
  fee, nonce, serialized transaction, signed bytes and extra privileged fields.
- Log/report redaction using generated secret-shaped fixtures.
- Canonical `(mainnet, core, masterId, playbackId)` identity.

**Pass:** malformed or over-sized input fails closed; accepted start intent has no
caller-selected recipient or transaction parameters; a secret scan of output is
empty.

## Gate 2 — passive capability detection and radio UI

**Goal:** render every wallet state without probing, prompting or affecting audio.

Use component/DOM fixtures for: absent, checking, ready, pending, paused, locked,
empty, offline, active elsewhere and recovery required. Test shortened address,
Copy/Explorer targets, confirmed/reserved/usable balances, estimated starts,
accessible labels and stable layout at desktop and mobile widths.

Verify the activity drawer is lazy: no history request before expansion; one
bounded first page after expansion; cursor pagination; no request storm after
rerender. Cover confirmed, pending, abort, rejected, unknown and recovery rows,
missing metadata, cached artwork and failed artwork.

**Pass:** with no companion, the DOM and network behaviour match the free baseline
apart from the inert setup link. Status timeout causes a quiet free state. No UI
state says “connected” from stale cache alone. Visual snapshots show no horizontal
layout shift as the control expands.

## Gate 3 — companion policy and journal simulation

**Goal:** prove a local signer can enforce policy independently of an untrusted
page before any real key or node is involved.

Exercise a temporary OS-like vault and SQLite journal using disposable generated
identities and a simulated chain:

- Wallet creation, encrypted backup verification, lock/unlock and restoration.
- Exact contract/network/core allowlist and fixed holder/miner limits.
- Atomic reservation, usable balance and withdrawal reserve.
- Durable states around every sign, persist, submit and reconcile boundary.
- Duplicate playback IDs, duplicate relay, nonce conflict, reorg, abort, definite
  rejection, unknown submission and restart recovery.
- Pause, kill switch, daily cap, empty balance, foreign nonce and corrupted state.
- Paged sanitised history derived from the journal.

Inject a process crash before and after every durable state transition. Restart
the companion after each injection and verify it cannot create a second debit.

**Pass:** one playback ID can produce at most one confirmed receipt; reserved plus
confirmed spending never exceeds policy; uncertainty stops new signing but does
not erase recovery evidence; no secret appears in status, history, logs or reports.

## Gate 4 — authenticated bridge and lease ownership

**Goal:** ensure only the paired first-party top-level page can request starts and
only one radio instance can spend at a time.

Test correct and incorrect HTTPS origins, preview domains, wildcard subdomains,
iframes, opaque origins, extension IDs, installation IDs, pairing revocation,
document replacement and replayed messages. Use a fake clock for lease expiry,
heartbeat loss and explicit takeover. Race two tabs and the homepage/full-radio
views against the same companion.

**Pass:** untrusted contexts cannot read wallet status/history or acquire a lease;
one active installation-wide writer wins deterministically; stale tabs cannot
submit; lease loss changes subsequent starts to free without stopping audio.

## Gate 5 — radio playback semantics

**Goal:** connect the shared radio observer to the fake bridge and prove exactly
which audible events create start intents.

Run media-event fixtures for first audible play, autoplay rejection, preload,
loading error, muted start then unmute, pause/resume, buffering, repeated `playing`,
seek, fast skip, previous/replay, natural end, native loop, restored playback,
same-engine view switch and ambiguous reload. Capture immutable core/master ID
before asynchronous track state changes.

**Pass:** each eligible new audible start emits one intent with one playback ID;
non-start events emit none; reload reuses durable identity; changing tracks cannot
pay the prior or following holder by mistake. The existing measured-play counter
and on-chain likes tests remain unchanged.

## Gate 6 — browser end-to-end failure matrix

**Goal:** prove the real homepage and `/radio` behave correctly under failures.

Use Playwright with a generated deterministic audible test tone and the fake
companion. Run each flow in the homepage widget and standalone radio, then repeat
the critical flows with two tabs:

| Scenario | Required result |
| --- | --- |
| No installation | normal free playback, no prompt or companion network work |
| Ready funded wallet | music starts immediately; one pending then confirmed row |
| Slow capability/status lookup | music starts immediately; no intent is sent without readiness |
| Timeout after start intent | music continues; outcome remains unknown until reconciled; no replacement |
| Empty/locked/paused | music starts free with an accurate persistent reason |
| Companion crash | music continues; future starts free; recovery state visible |
| Offline node | music continues; no unbounded retry or catch-up billing |
| Reload during pending | artwork/status/history restore; no second debit |
| Rapid skips | correct identities; bounded queue; overflow starts free |
| Two tabs | one lease holder pays; the other clearly plays free |
| Confirmed top-up | support resumes on the next start, never retroactively |

Record request counts, audio start latency, console errors, status transitions
and screenshots. Under the same local five-run fixture, no-companion mode permits
zero companion/network requests, zero permission prompts, at most 20 ms additional
median audio-start latency, at most 50 ms additional p95 latency and at most 5 kB
additional gzip in the radio bundle versus Gate 0. A deliberate budget change
requires documented review rather than weakening the assertion during a failure.

**Pass:** all matrices pass in Chromium; zero unhandled errors; no secret-shaped
material in browser storage or console; free playback never waits for the bridge.

## Gate 7 — build, static security and packaging

**Goal:** verify distributable components and the normal site remain safe.

Run lint, focused tests, production builds and a secret scan. Inspect extension
permissions, native-host manifest, exact origins, CSP interaction, signed package
identity, upgrade persistence and uninstall/recovery instructions. Build artifacts
must not contain test keys, wizard state, broad host permissions or a localhost
HTTP signer.

**Pass:** clean build; permissions match the documented bridge; old and upgraded
companion versions fail safely on schema mismatch; free users download only the
small inert capability stub until an installed extension announces itself.

## Gate 8 — disposable-wallet mainnet canary

**Goal:** validate the integrated path on chain only after Gates 0–7 are green.

This gate is intentionally manual to authorise and automated to execute. Create a
fresh disposable Music Wallet through the production candidate, verify encrypted
backup and withdrawal, fund only the approved maximum, and record its address in
the bounded authorization artifact. Never use the earlier wizard, personal,
deployer, sponsor or likes wallet. Never clear an unresolved journal to proceed.

The automated canary runs a short sequence covering: one normal start; pause/resume
without duplication; next track; reload while pending; two-tab lease; balance-low
fallback; confirmed top-up; and withdrawal after reconciliation. It stops on the
first mismatch or uncertain submission. It does not test expected failures by
spending fees on deliberately bad transactions.

Top-up is an explicit operator checkpoint: the harness pauses, displays only the
disposable address and approved amount, and waits for independently confirmed
funds. It never opens, controls or signs with a personal wallet and never treats a
wallet callback as confirmation.

**Pass:** every expected paid start has one canonical contract receipt and exact
50-microSTX holder transfer; local history, wallet debit, chain event and contract
total reconcile; free starts have no debit; actual spend is within the authorised
maximum; remaining funds can be withdrawn through the reviewed recovery flow.

## Gate 9 — opt-in release and rollback

**Goal:** confirm a small production cohort without risking general radio use.

Enable by capability and allowlist, not by changing the behaviour of all visitors.
Monitor only privacy-safe aggregate health: status category, intent outcome,
confirmation latency and reconciliation failures. Never join Music Wallet and
personal wallet identities. The kill switch stops new intents and leaves dashboard,
history, recovery and withdrawal available.

**Pass:** no free-mode latency/error regression; all paid totals reconcile; no
duplicate receipts; support can be disabled without affecting radio controls.
Expand only after an agreed observation period. Any accounting mismatch, origin
bypass, secret exposure, duplicate debit or playback regression triggers rollback.

## Iteration loop

For each gate:

1. Start from the latest green harness report and a clean tree.
2. Implement only the smallest vertical slice required by that gate.
3. Run the gate locally with deterministic fixtures.
4. On failure, preserve the seed, trace and sanitised artifact; fix and rerun.
5. Run all completed non-broadcast gates cumulatively.
6. Review the diff for secret material, changed wallet policy and radio regressions.
7. Update the plan/report and commit the green slice.

Do not use retries to disguise nondeterminism. Randomised tests must print their
public seed. Quarantine is permitted only for a proven external browser defect,
with a blocking issue and an equivalent deterministic test; payment invariants,
security checks and free-playback tests can never be quarantined.

## Definition of working

The implementation is working when Gates 0–8 pass and the canary report proves:

- Free listeners experience the existing radio with no prompts or payment delay.
- A paired, funded and enabled local Music Wallet is visibly connected with an
  accurate balance and recoverable paged activity history.
- Each eligible audible start is offered exactly once and is paid at most once.
- Payment, bridge, companion and network failures always degrade to free playback.
- The browser cannot request arbitrary signing or receive wallet secrets.
- Reload, two tabs, crashes and uncertain submission cannot duplicate spending.
- Backup, withdrawal, pause, kill switch and rollback work before wider rollout.

Gate 9 determines whether the implementation is ready to expand, not whether the
core mechanism works. Mainnet success alone is insufficient without the offline,
browser, recovery and free-listener gates.
