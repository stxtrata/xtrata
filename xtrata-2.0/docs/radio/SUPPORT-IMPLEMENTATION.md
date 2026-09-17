# Support as you listen: implementation progress

Current direction: [simplified local wizard plan](../plans/RADIO-MUSIC-BALANCE-SIMPLIFIED.md). Reuse the original backend storage model with automatic local key management and a 1 STX supported balance; no mandatory OS keystore or backup ceremony. Existing implementation evidence below is unchanged. No funded wallet or runtime code was changed by this plan revision.

17 September 2026. First implementation slice after reviewing SOL's plans.

## Review conclusions

The plans support starting a read-only slice. Production payment activation is
not ready. Corrected the timeout rule: losing a response after sending an intent
does not prove a free start. Preserve and reconcile uncertain outcomes.

Request IDs and same-origin page events provide correlation, not authentication
of an extension. A future bridge must enforce pairing/permissions in the native
and extension processes. This slice deliberately accepts only an injected
read-only transport; there is no global event-based signer or localhost discovery.

Five samples cannot substantiate a useful p95 latency claim. Before Gate 6, use
at least 100 paired baseline/candidate starts with warm-up, fixed local audio and
recorded environment; retain the planned latency budgets. The single-unresolved
transaction limit also requires measured paid-start coverage before describing
normal playlists as fully supported.

## Built

- `src/lib/radio/support/protocol.ts`: strict read-only status/history validation,
  exact integer balances, bounded pages, rejection of extra fields and invalid
  transaction links, confirmed versus unknown/aborted/rejected debit rules.
- `panel.ts`: accessible status, balance and expandable paged history; timeout,
  stale-result and account-refresh isolation; text-only metadata rendering.
- `fake.ts`: deterministic public fixtures with no wallet or network access.
- `src/radio-support-preview/`: development-only scenario page. All amounts are
  examples, including the public address. No live balance is read.
- `scripts/radio-support/harness.mjs`: focused executable harness with sanitised
  JSON/Markdown output in ignored `.artifacts/radio-support-harness/`.
- `scripts/radio-support/preview-smoke.mjs`: isolated headless Chrome layout,
  history, absence, timeout and external-request checks at 1200px and 390px.

The shared radio now imports a compile-time-gated read-only attachment; default
builds remove it. Set `VITE_RADIO_SUPPORT_PREVIEW=true` only for preview builds.
The attachment creates a collapsed panel in the standalone station column or
homepage hero area, excludes embeds, and performs no requests before expansion.
No new public funding page, key,
native host, extension, payment hook, signing method or broadcast command exists.
The fixture transport is not an authentication implementation. The compact
read-only types are an initial internal model; lock the native wire schema only
when pairing and version negotiation are implemented. Address format validation
here is display-only; it is not a transaction destination validator.

## Run and inspect

From `xtrata-2.0`:

```sh
npm run test:radio-support
npm run test:radio-support -- --gate schemas
./node_modules/.bin/vite --host 127.0.0.1 --port 8799 --strictPort
```

Open `http://127.0.0.1:8799/src/radio-support-preview/index.html`. With that server
running, `node scripts/radio-support/preview-smoke.mjs` uses installed Chrome and
an isolated temporary profile. Screenshots remain under ignored `.artifacts/`.

## Verification and next work

12 new tests pass; the previously run 86 radio/function regressions also passed.
The four implementation TypeScript modules passed targeted compilation. Browser
checks passed at both widths; the mobile screenshot was visually inspected.
Neither a full app build nor a real-radio payment/performance test is claimed.

Second slice: added strict start-intent/lease-request schemas and correlated
response envelopes in `messages.ts`. Extra transaction fields and page-requested
takeover are rejected. These parsers do not authenticate a caller or authorize
spending. Response nonces provide correlation only. The panel now expires stale
status after 30 seconds and supports injected invalidation with cleanup.

20 focused tests and the 86 radio regressions pass. Targeted TypeScript checks
pass. Default radio build remains 76.06 kB / 30.95 kB gzip; preview-enabled build
is 78.16 kB / 31.66 kB gzip. Preview build outputs remain ignored artifacts.
`radio-layout-smoke.mjs` checks both real page layouts at 1200px and 390px.
The initial homepage check exposed a hidden workspace mount; it was moved after
the visible homepage hero and covered by regression tests. The standalone check
uses the preview-enabled bundle; the homepage check injects the same attachment
into the default development page. Neither check exercises real paid playback.

Next: implement authenticated transport/pairing and lease lifecycle, policy and
snapshot versioning, durable journal recovery, and the actual media-start observer.
Third slice: `tools/music-wallet/simulation.mjs` implements durable SQLite pairing
state, one active document lease, immutable playback IDs, reservations and atomic
simulated reconciliation. Eight new tests cover abrupt process exit, forced write
rollback and duplicate confirmation. The cumulative focused harness has 28 tests.
Status matches the read-only panel schema; history remains a separate simulated
ledger until verified chain evidence exists. No private wallet data was opened.
See [companion notes](../../tools/music-wallet/README.md).

Full Gates 1–2 remain open. Gate 3 has partial simulation coverage; Gates 4–9
remain unimplemented. Do not treat passing
focused harness checks as production readiness or authority to spend funds.

## Read-only transport groundwork — 17 September 2026

Added a development Chrome extension and native-message child host. Requests
are restricted to status/history from the top-level `https://xtrata.xyz` origin;
the extension supplies browser sender context, limits concurrent requests and
times out unresponsive hosts. Native responses are currently fixed unavailable
results. No wallet database, keys, signing, broadcasts or production page wiring
were added. Browser permission in the popup is not native payment approval.

Six transport tests cover trusted sender boundaries, unsupported methods,
fragmented/bounded framing and a real subprocess exchange. The default harness
includes these alongside the existing UI and SQLite simulation tests. Actual
installed-browser/native-host authentication, secure storage and real read-only
wallet status remain outstanding. The radio's default UI is unchanged.

Details: `extensions/music-wallet/README.md`.

Validation: all six harness groups pass (34 focused tests total), and targeted
ESLint passes. Repository-wide `tsc --noEmit` currently fails with broad Vitest
`ExpectStatic` and Vite configuration typing errors; this is not reported as a
passing typecheck. This transport adds no files to the app TypeScript include
paths and changes no production bundle.

## Return controls plan clarification — 17 September 2026

The simplified plan now includes an over-1-STX warning, Return excess and an
always-accessible Return all action. Returns use a user-confirmed destination
and show the amount after miner fees. Pending payments reconcile before a
return; full return releases the listening reserve and disables support. Added
accounting, duplicate/race and recovery acceptance cases. Documentation only;
no withdrawal endpoint, live wallet change or transaction was performed.

## Local wizard return UI implemented — 17 September 2026

The original loopback wizard now has a responsive wallet dashboard: copyable
address, confirmed balance, over-1-STX warning, Return excess, Return all, editable
fee, exact destination/amount/remaining-balance review, approval, cancellation,
Stop and public transaction history with explorer links. The canary link now
describes these controls. This does not activate the public radio companion.

The backend validates mainnet destinations, calculates with integer microSTX,
shares its run lock across tests/returns, reconciles pending plays and returns,
flushes signed return records before broadcasting and deduplicates request IDs
across restarts. Balance/nonce changes, expiry, Stop or restart invalidate an
unsigned review. Full return includes the reserve. Excess return leaves 1 STX
after fees. Above-target balances block new tests. Existing operator spending
caps and kill switches are preserved; no funded wallet was accessed for tests.

Validation: 17 focused backend/deployment tests pass, the existing 34-test support
harness passes, and targeted ESLint passes. Isolated Chrome checks at 1200px and
390px exercise the real local server with disposable keys and mocked chain calls:
wrong-origin/GET/content-type rejection, both returns, fee edits, cancellation,
review restoration after reload, fresh approval, confirmation history and no
horizontal overflow. Four transfers were simulated; no live transfer occurred.
Screenshots are local under `.artifacts/radio-wizard-returns/`.

The funded operator wizard's previously unknown play remains unchanged. If still
unresolved it blocks withdrawal until separately investigated. This release
adds controls, not an automatic bypass of unknown transactions. Restart the
local server and open http://127.0.0.1:8798 to use the updated panel.

## Local radio canary — 17 September 2026

Added a free-by-default radio to the local wizard with live catalogue loading,
verified core-3 audio extraction, song/artist/album display, native playback,
previous/next and playlist loop. Paid test approval is bounded by fee, starts,
duration, one tab, heartbeat expiry and the original wizard limits. The backend
uses the existing protected play call and durable journal with playback IDs;
free/busy starts are not queued. Stop/free, returns, expiry and failures revoke
approval. Nothing auto-enables on reload. The public application is unchanged.

Validation: 21 focused radio/wizard tests pass and targeted lint passes. Real
browser audio checks at 1200px/390px pass for free/paid transitions, mid-song
activation, pause/resume, seek, busy-free skips and reload; four payment calls
were simulated. Existing return UI checks also pass at both widths. A read-only
live media check loaded 47 catalogue entries and verified song 2910's audio/webm
(4,184,290 bytes). No new mainnet payment was sent. Local screenshots remain
ignored under `.artifacts/radio-wizard-listening/`.

## Explicit 257-microSTX retry — 17 September 2026

Added and tested a one-time operator recovery method for the prepared low-fee
attempt. It retains the original nonce/receipt and audit record, checks fresh
chain state before signing, and reconciles either attempted transaction ID.
All 23 focused wizard tests and targeted lint pass. The user explicitly requested
retrying at 257 microSTX; one dedicated-wizard call was submitted with nonce 4,
song 2910/core 3, network fee 257 and a protected 50-microSTX holder payment.
Transaction: `0x1f52d78b2c977a59a0d7b59dc5c6ebeefabe6f7f1b30e54dd1da0b1e3c4f0934`.
No five-start session was enabled by this recovery action.

The retry subsequently confirmed canonically at nonce 4 with exactly 257 microSTX
miner fee and a 50-microSTX transfer to the master holder. The printed receipt
matches the original attempt and reports song 2910's paid total as 5. Total debit:
307 microSTX (0.000307 STX). The local journal was reconciled; no additional
five-start session was activated by the agent.

## Late receipt and recent-outcome correction

Recent start outcomes now refresh from the durable play journal and restore
recorded starts after server restart. A later confirmed payment replaces a stale
unknown outcome without restoring paid approval. A specifically absent optional
receipt is now retried within the existing confirmation loop; a mismatched
receipt still fails closed. The historical error does not prove whether that
specific read was absent or mismatched, because the old message combined them.
25 focused wizard tests pass, including delayed/incorrect receipt distinctions
and recovery of stale outcomes. No payment is sent by this fix.

### Successive paid-start approval (2026-09-17)

Changed the local radio default from one to ten starts per approved session.
Radio session counts are bounded by the existing 5000-microSTX total instead
of the separate manual runner's five-test limit. At fee 257 this permits 16
starts; at fee 300 it permits 14. UI explains that approval covers the whole
session. Lifetime spending, reserve, expiry, single unresolved payment and stop
controls remain unchanged. Reload still requires a fresh approval.

Validation: 10 targeted listening tests passed, including ten successive
confirmations using the same approval and the 16/17-start boundary at fee 257.
Desktop and mobile browser smoke checks passed with simulated payments only.
The idle local wizard was restarted; no real payment was sent for this change.
