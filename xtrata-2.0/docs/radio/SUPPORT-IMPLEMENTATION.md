# Support as you listen: implementation progress

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

No production radio imports these files yet. No new public funding page, key,
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

Next: complete Gate 1's lease/intent schemas and response envelopes; add lifecycle
freshness/revocation and accounting snapshot rules; then integrate the read-only
panel into the actual radio behind a disabled feature flag and test both layouts.
Full Gates 1–2 remain open. Gates 3–9 remain unimplemented. Do not treat passing
focused harness checks as production readiness or authority to spend funds.
