# Timeloop Detective: minimal public viewer release

## Problem and resulting behavior

Timeloop Detective v1.3.4 uses its parent Xtrata viewer to connect a wallet and
request optional native STX payments. The public homepage lacked that bridge.
Interactive selected/prepared HTML previews, including fullscreen previews, now
support connection, account/network reads, and reviewed native STX transfers.
Connecting through a game preserves its loaded iframe and current play state.

This is a selective promotion onto main `04b63268c99fd84592887d637259ce622127966b`,
not a merge of main-staging or main-staging-chess. Production changes are limited
to `src/home/main.js`, new `src/lib/viewer/public-wallet-bridge.ts`, and the optional
fee field in `src/lib/wallet/connect.ts`. The patches originate from staging
commits `a34bec80240cf287d5dcbd7aacda072f7655d87c` and `bd8325d4`.
Two regression-test files and repository testing rules accompany this note.

## Review and isolation

- Only registered, attached, visible interactive preview frames can request the
  bridge. Existing iframe sandbox permissions remain unchanged.
- Frame/origin-bound tokens expire, navigation resets consent, and replayed
  request IDs are rejected. Account reads require explicit preview consent.
- Host-owned approval dialogs display the sender, recipient, network, amount,
  requested fee, and memo before the wallet is invoked. Wallet approval is still
  required. The bridge validates amounts, addresses, network and signing account,
  bounds optional fees, and rechecks the session after review.
- Public bridge methods are limited to connection, account/network reads, and
  native STX transfers. Contract calls, deployments and arbitrary signing are not
  exposed through this new bridge. Concurrent wallet operations are refused.
- Uncertain payment outcomes remain uncertain; the bridge does not auto-retry or
  claim that a timeout means cancellation.
- The Xverse fallback now forwards an explicitly supplied fee. Requests without
  one retain wallet fee estimation. The game's cafe request is 1 STX plus a
  requested 0.003 STX network fee; the wallet's final fee still needs review.

The shared wallet adapter has one optional-field change; other wallet flows retain
their current behavior. Contracts, mint sequencing, fee defaults, dependencies,
admin bridge, chess changes, and game HTML are outside this promotion. Generated
images/audio/video and the root media directory are not included.

## Validation of the exact main patch

- Targeted public bridge, wallet adapter and runtime fee suites: 81 tests passed.
- Existing premerge smoke suites: 137 tests passed (overlap with targeted tests).
- Full `npm run build`, including prebuild and static-app postbuild: passed.
- `npm run contracts:verify`: passed.
- ESLint of the changed homepage JavaScript and `git diff --check`: passed.
- Validation used the existing local dependency installation via an ignored
  symlink; no dependency or lockfile changes were needed.

Earlier staging validation also exercised the actual game through the public
renderer with simulated wallet and chain responses, including cancellation,
pending/confirmed payment behavior, save metadata and mobile layouts. That is
simulation coverage, not proof of a signed transaction with a real extension.
This promotion does not claim a clean repository-wide TypeScript/lint baseline.

No personal/hot wallet was used during this promotion. No transaction was signed
or broadcast and no inscription was made. Further wallet tests must use disposable
wizard wallets or simulations; funding/spending requires separate authorization.

## Artifact and deployment

The standalone `Timeloop-Detective-Meridian-Heist-v1.3.4-Xtrata.html` remains local
and unchanged: 1,044,346 bytes, SHA-256
`2f3d0dbb9643d56442d72e9db40bc3554edf3010234f66fa56cdfa728dea349d`.
It is not embedded in this website release. Inscription remains a separate action
after deployment verification and any requested final wizard-only checks.

Verify the Cloudflare Pages check against the exact promoted main commit. If a
regression appears, revert this single selective release commit and redeploy;
there are no schema or contract migrations to undo. Reverting removes public
viewer wallet support but cannot reverse already confirmed on-chain payments.
