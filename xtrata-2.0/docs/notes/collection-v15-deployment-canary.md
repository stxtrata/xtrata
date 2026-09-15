# Collection v1.5 deployment canary

Open `/web/deploy-console.html#collection-v15-deployment`.

1. Run **Load + preflight**, without connecting a wallet.
2. Connect the expected deployer on mainnet. **Deploy (sign in wallet)** becomes
   enabled after successful preflight and only while the name is available.
3. Review the pinned source, contract name and requested 0.49 STX fee in the
   wallet. The console rechecks source/core/name and signer/network immediately
   before opening the wallet. Repeated clicks cannot open duplicate requests.
4. After confirmation, run preflight again. Submission alone is not confirmation.
   Existing deployments require byte-identical source and valid state checks.

Preflight validates pinned mainnet source, principals, target name, core ABI
presence and current core fees/pause state. Existing deployments also require
expected core binding, the atomic chunk limit, supply/reservation invariants and
matching minted/index counters. Admin, metadata, pricing, recipients, splits and
dependency reads are logged for review. API failures fail closed. Reads are
sequential to avoid bursts. Download uses verified bundled source bytes, so it
works in the production bundle as well as the dev server.

## Clarity compatibility correction

The initial canary incorrectly treated the previous Clarity 3 test configuration
as a requirement. The unchanged v1.5 source passes all 20 existing collection mint
simulations with the helper published as Clarity 4 against core v3.2.3. The
Clarinet manifest and generated simulation deployment plan now pin version 4.
No contract source migration or hash change was needed. The canary therefore uses
the existing Clarity 4 wallet publisher and no longer blocks the collection card.

Validation: 20 contract simulations; browser tests mock wallet calls and exercise
preflight, wrong signer/network, exact source/version/fee, cancellation, duplicate
clicks, rechecking availability, API failure, paused core and deployed-source/state
verification. Production Vite build. No personal wallet access, signing,
broadcasting, or on-chain mint testing was performed.

Before launch, configure inventory and collection terms while paused; run
separately authorized disposable-wallet tests for duplicate rejection,
reservations, staged and atomic minting and receipt attribution. Storage-worker
configuration and recovery/reconstruction verification are separate. Never purge
core chunks belonging to sealed inscriptions.
