# Timeloop public-viewer wallet support

9 September 2026. Follow-up to the selective Timeloop staging integration.

## Testing wallet policy

The user explicitly requires **wizard accounts only for all wallet tests**.
Never use personal, deployer, sponsor or other hot wallets for testing, even
when they are already installed or unlocked in a browser. Root `AGENTS.md`
records this standing rule. The public browser simulator uses the Archivist
identity and the Skeptic for the account-change case; it has no signing keys.

The offline wizard check below passed against the local provisioned Archivist
configuration. It cross-checked the configured key/address, constructed and
deserialized the cafe and save-memo transaction payloads, and verified that
all signature bytes remained zero. No transaction was signed or broadcast,
and no wizard key was exposed to a browser or output.

```sh
node scripts/wizard/timeloop-payment-dry.mjs /absolute/path/to/.env.wizards
```

This is transaction construction, not a live receipt or extension test.
Real wizard broadcasts remain subject to explicit spend authorization and
the wizard safety limits. Never raise those limits to make a test pass.

Cloudflare reported a successful deployment of production-code commit
`a34bec80240cf287d5dcbd7aacda072f7655d87c` at
<https://80cedd2b.xtrata.pages.dev>. The deployed homepage was opened and its
installed Xverse chooser observed. A personal-wallet connection attempt was
stopped when the user clarified the wallet policy; the test tab was closed,
and no payment was signed or sent. Do not count that as a passed wizard-wallet
or payment test. Subsequent real-wallet testing must use a wizard harness.

## What now works

The public homepage can answer the existing v1.3.4 game's immediate-parent
wallet handshake. No game-byte change is required. The public viewer
registers its interactive selected-inscription and prepared-file previews,
including the two fullscreen variants, with a dedicated bridge module.
Grid thumbnails, marketplace preview frames and unrelated windows receive
no new wallet access.

A player connecting from a registered preview sees a host-owned consent
dialog, then the existing wallet chooser. The selected account is reflected
in the homepage without reloading the inscription grid or replacing the
running game frame. Native STX transfers receive another host review showing
the preview identity, sender, recipient, network, amount, requested fee and
memo before being sent to the existing wallet adapter. Values are rendered
as text, never as inscription-supplied HTML.

The cafe supplies 1,000,000 microSTX to
`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X`, a requested 3,000 microSTX
network fee and memo `TD:WEDNESDAY:1`. The host has no game-specific price,
recipient or memo constants. A wallet can reject or change its fee; its
final approval screen remains authoritative.

The existing save flow also works: generate/download the portable JSON,
publish that JSON separately through Xtrata, then request the optional
one-microSTX transfer to the player's own address with its save-reference
memo. The bridge does not itself publish save inscriptions or infer that a
wallet-returned transaction ID has confirmed.

## Boundaries and compatibility

- Tokens are bound to the exact registered iframe window and origin. They
  expire after ten minutes; a new game handshake rotates the token.
- Reading the account requires explicit connection consent for that document.
  A load/navigation clears consent. Removed, hidden and disconnected frames
  cannot initiate requests; frame validity is checked again after review.
- The bridge rejects wrong sender/network, invalid standard recipient
  addresses, nonpositive/overflowing amounts, overlong UTF-8 memos, replayed
  request IDs and unsupported methods. This public bridge intentionally
  supports connection/account reads and native STX payments, not arbitrary
  contract calls, deployment, message signing or host-wallet disconnection.
- Missing fee/sender fields remain valid. The existing bounded fee parser
  ignores invalid/out-of-range fees so the wallet estimates them.
- Only one bridge wallet operation can run at a time. The homepage's existing
  busy state also blocks normal host wallet controls during that operation.
  It is released on completion, error or cancellation.
- The host review closes without approval after 60 seconds. A transfer's
  response timeout uses the remaining request budget, up to 90 seconds and
  within 110 seconds including host review. An unknown provider outcome is
  returned as an error, not a definite cancellation. There is no automatic
  signing, broadcast or payment retry. Check history if a wallet remains open
  after a timeout; closing the host request does not cancel an external wallet.
- The iframe sandbox remains `allow-scripts`; `allow-same-origin` is not added.
  The admin bridge, contract calls, mint ordering, protocol fee defaults,
  marketplace settlement, caches and game bytes are unchanged by this follow-up.

## Validation

- **103 targeted tests passed**, including 31 public-bridge cases and existing
  admin bridge, runtime fee/opening and wallet-provider tests.
- **137 existing pre-merge smoke tests passed** (overlaps the wallet suite).
- Full `npm run build` passed, including auxiliary bundles and static copies.
- ESLint passed for the changed homepage JavaScript and browser smoke script.
- The repository-wide TypeScript check still has its existing errors; it is
  not a clean release gate. The new test assertions encounter the existing
  `ExpectStatic` call-signature typing problem seen throughout the test suite.
  A new production-module network type inference issue was corrected during
  this check. No unrelated typing or lint repairs were bundled.
- Chromium used the exact production HTML, SHA-256
  `2f3d0dbb9643d56442d72e9db40bc3554edf3010234f66fa56cdfa728dea349d`.
  It verified host connection consent, host and wallet cancellation, account
  change during review, the exact cafe payload, pending versus confirmed
  simulated receipts, wallet metadata in save JSON, the existing save-memo
  transfer without an explicit fee, 390/320px review widths and no page errors.
- A second browser pass used the actual homepage renderer and installed
  bridge, with a test-only wallet-adapter substitution. Connecting from the
  game preserved its iframe and the `allow-scripts` sandbox. Test hooks are
  injected only by the smoke runner and are absent from shipped source.

Run locally from `xtrata-2.0`:

```sh
node scripts/timeloop-public-wallet-smoke.mjs /absolute/path/to/Timeloop-Detective-Meridian-Heist-v1.3.4-Xtrata.html
```

The runner requires an installed Playwright Chromium, or an explicit
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. It starts a loopback Vite server, uses
mock wallets, intercepts receipt services, prints JSON results and closes
the server/browser. No screenshots, audio or video are generated or committed.
The production game is supplied as an argument because `AAA-Collection`
remains local/ignored. No external API keys or signing keys are required.

## Remaining release steps

Pushing `main-staging` is not proof that a hosting deployment succeeded.
Confirm the deployed staging revision, then use a provisioned wizard-only
wallet harness and first review/cancel a payment, checking the amount, recipient,
memo and final fee. Real wallet versions, Safari/iPhone and hosted sandbox
behavior remain unverified by these Chromium simulations.

A real payment/confirmed-receipt recovery test requires explicit spending
authorization. No signature, real payment, inscription, database mutation
or blockchain broadcast was performed in this work. Do not inscribe a mock
preview. The exact production v1.3.4 HTML remains the inscription candidate.

Review the complete staging-to-main promotion separately: main-staging
already includes unrelated work. Do not infer that the entire branch is
production-ready from these Timeloop-specific checks.
