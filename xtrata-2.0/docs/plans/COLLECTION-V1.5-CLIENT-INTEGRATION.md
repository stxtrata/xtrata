# Collection v1.5 client integration

Completed locally on 14 September 2026. This implements the manager and public
mint client stage of the [v1.5 helper plan](COLLECTION-MINT-V1.5-AND-STORAGE.md).

## Result

- New standard manager deployments use v1.5 and select the exact configured
  v3.2.3 core on the wallet's network. An unsupported network blocks deployment;
  there is no fallback to a different network. Pre-inscribed sale deployment keeps
  its historical target. Existing collection metadata is not migrated.
- App and SDK source builders retarget both the allowed-core constant and the
  static duplicate-hash guard. The SDK accepts an explicit deployment registry
  target via its third `coreVersion` argument; legacy selection remains the
  default. This does not change the older generic SDK workflow planner's core
  capabilities or fee model.
- Guided launch controls include inventory verification and registration in
  groups of at most 50 unique hashes. Each registration is an explicit wallet
  action with deny-mode, zero-transfer postconditions. Submission is not treated
  as confirmation; the group must be checked again after confirmation. Existing
  registered URIs are preserved. Newly staged files require a refreshed group
  check before opening minting.
- The public v1.5 mint path verifies the helper's pinned core, reads all four
  granular fee units, and checks that the file is registered before any mint
  wallet prompt. It re-reads fees and price before each payable step. Resuming
  seal uses the price recorded in the reservation, even if phase pricing changes.
- Chunk upload calls still allow **zero STX transfers**. v3.2.3 charges chunk and
  batch components at seal, not during `add-chunk-batch`:
  `seal + min(chunks,32)*chunk + ceil(max(chunks-32,0)/32)*batch`.
  The helper atomic route uses staged begin + seal fees; the core-native
  single-transaction fee does not apply. Client batches and helper atomic mints
  retain their 30-chunk ceiling within the 32-chunk ABI.
- Fee quotes and wallet caps use bigint values, with no guessed aggregate fallback
  for v1.5. Read failures block the new flow; changing fees after a wallet prompt
  can still cause an on-chain cap rejection, requiring a refresh/resume.
- An existing hash is a successful wallet mint only if the helper's immutable
  mint context attributes it to that wallet. The gallery also requires a helper
  receipt. An unrelated same-hash inscription is not silently reported as a sale.
  The contract remains the final duplicate/reservation guard.

## Verification

- 153 targeted app, SDK deployment, inventory UI, storage and simulation tests pass.
- Generated source deploys in simnet under a different principal from the core.
  A 33-chunk mint matches the exact quote with four distinct mutable fee units;
  uploads transfer zero STX, reserved pricing survives a later price update, and
  duplicate begin rejects without changing the buyer balance. Fee boundaries
  1/30/32/33/64/65 are compared with the actual core's `quote-staged-fee`.
- Guided UI tests use a simulated wallet callback, including wrong-network and
  failed-read cases. No personal wallet, live payment or broadcast was used.
- SDK release dry-run passes: 125 package tests, type checks, builds, docs/API and
  machine documentation validation, packed imports, example smoke tests, version
  checks and npm publication dry-runs. No package was published.
- Vite app build and contract-variant verification pass. Repository-wide app
  TypeScript checking still reports existing test type errors; changed production
  modules have no reported errors.

## Activation still required

Push/review these local commits, provision isolated D1 plus separate staging and
private recovery buckets, apply the storage migration, and deploy the worker in
report-only mode. A real collection helper deployment remains a user-driven
wallet action. The registry has no verified testnet v3.2.3 target, so the manager
will not fabricate one or deploy against mainnet from a testnet session.

Run an isolated infrastructure rehearsal before production: confirm upload,
registration, mint receipt, waiting period, copy verification, eviction and preview
fallback. Keep production cleanup in report-only mode until every shared writer
uses immutable uploads and the separate recovery bucket has permanent retention.
Local tests do not activate remote cleanup. The recovery copy and core-purge
restriction from [storage automation](COLLECTION-STORAGE-AUTOMATION.md) still apply.
