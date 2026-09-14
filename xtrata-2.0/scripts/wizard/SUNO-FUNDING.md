# Suno More with local wizard funding

Suno More can use a disposable wizard as its funding and delivery identity.
An isolated Playwright harness installs `window.XtrataWizardFunding` before the
page loads. The page chooses it instead of the extension wallet, pins the job's
`user` and `expectedFunder` to that address, and sends public deposit fields and
SHA-256 hashes of the prepared player files through a page-scoped binding.
The local signer loads only the selected wizard key from the existing ignored
`.env.wizards` configuration. It never passes that key into the browser.

The existing Suno job wallet still performs upload, seal, delivery and refund.
Its recovery material remains in the isolated browser profile, as in the normal
Suno flow. Preserve that private run directory until delivery/refund completes.
The harness does not change the protocol, fees charged by the job, or receipt.
Parent escrow is currently refused; ordinary dependencies remain supported.

## Rehearse without signing

From the `xtrata-2.0` directory, run the local app (`npm run dev`) and then:

```sh
npm run wizards:suno -- --address PUBLIC_WIZARD_MAINNET_ADDRESS --audio /absolute/song.mp3
```

Use the page to prepare/review the song, then click Inscribe. A dry run saves
`player-1.html` (and further batch players) plus `payment.json.plan.json` in the
printed run directory and displays that funding stopped. No wizard key is read,
no transaction is signed, and no deposit is sent. The real browser agent may
perform read-only quotes and create an unfunded local job. The video is optional:
`--record` captures silent viewport WebM; this is not an audio recorder or a
finished promotional MP4. `--headless` is available for orchestration; on its own
it does not click Inscribe, select a Suno song or finish a promotional workflow.

Use `--url` for another exact Suno page URL (HTTPS or loopback HTTP). The deployed
page must include this adapter change. A redirected URL that does not install the
adapter is refused. Chrome is the default; `--channel` selects another installed
Playwright browser channel. No personal browser profile is reused.

## Authorized live run

Only after separately authorizing the finished player and spending cap, start a
NEW run directory, using one `--player` per approved file in batch order:

```sh
npm run wizards:suno -- --broadcast --wizard archivist \
  --player /absolute/rehearsal/player-1.html \
  --audio /absolute/song.mp3 --spend-cap-ustx APPROVED_CAP_IN_MICROSTX
```

Reproduce the reviewed player in the page. Its bytes must exactly match the
approved file; changing artwork, lyrics or any metadata requires a new review.
The deposit plus funding transaction miner fee must fit the whole-run cap
(default 500000 microSTX). The signer preserves the existing 1000000 microSTX
balance floor and 30000 microSTX maximum funding transaction fee. `--fee-ustx`
sets the exact funding transaction fee (default 3000); it is not a dynamic fee
estimate. Existing wizard kill switches apply before signing and broadcast.
A pending/uncertain nonce is refused. No automatic fee bump or payment retry.

A mode, address, or URL cannot change within an existing `--run-dir`. Resume a
live run with its original arguments and run directory to retain the job profile.
The payment journal permits at most one deposit per run, including concurrent
requests. It reserves the payment before signing and records the local txid
before submission. An ambiguous response stays reserved. Inspect the txid and
chain state before any manual recovery; do not delete the journal to retry.
Submitting the deposit authorizes the existing browser job to spend that deposit
on the inscription; the local signer does not sign each upload transaction.

Generated players, profiles, journals and videos default to root `media/` and stay
local and uncommitted. Never upload the browser profile: it contains job recovery
material. No signer web server is exposed. Child frames and other page URLs
cannot call the funding capability. This trusts the selected Suno page to prepare
the requested job; it is not a signer for arbitrary untrusted websites.

## Validation (11 September 2026)

```sh
npx vitest run scripts/wizard/__tests__/suno-funding.test.ts \
  src/agent-one/__tests__/wizard-pages-parse.test.ts \
  src/agent-one/__tests__/wallet-payment.test.ts
npm run wizards:suno:test:browser
npx eslint scripts/wizard/suno-funding.mjs scripts/wizard/suno-harness.mjs
```

Funding tests use disposable mathematical keys and a mocked broadcast port. They
construct/sign a real Stacks transfer locally, exercise spending/floor/identity/
hash/kill-switch checks, and verify concurrency and uncertain-submission journals.
The browser smoke uses the actual Suno HTML, fixture player construction, mocked
agent/network responses and a fake funding callback. It exercises single/batch
payment wiring, extension isolation, disconnect and child-frame rejection. It is
opt-in so the ordinary unit suite does not require an installed browser.
These tests do not claim a live inscription, real MP3 transcoding, or final
on-chain song playback. No real wallet was used and no funds were spent.
