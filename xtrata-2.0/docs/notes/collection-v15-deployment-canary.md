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

## Management dropdown — 15 September 2026

The collection card now includes six expandable testing/release stages plus
read-only inventory, reservation, phase, index and receipt lookups. Production
configuration forms cover metadata, price, one-time supply, recipients/splits,
registered URIs, dependencies, wallet limits, allowlists, phases, expiry and pause.
Drafts and disclosure state survive console rendering in memory. Each write has
an explicit value review, fresh deployed-source/core preflight, mainnet owner and
finalization checks, then wallet approval with deny postconditions. Submission is
not reported as confirmation. Re-run preflight after confirmation.

This is an owner configuration interface, not a disposable-wallet mint runner or
storage-worker controller. The six testing stages describe required evidence;
they do not claim tests or cleanup have run. No mainnet writes were performed.
Validation: 14 targeted tests pass and Vite production build passes.

## Canary navigation tidy-up

All top-level canary cards now have native keyboard-accessible disclosure controls.
A responsive Quick access index opens and jumps to each card in one click; existing
contract fragment links remain valid. Nested deployment gates and logs collapse
independently, and Expand all / Collapse all include collection management panels.
Disclosure state survives console rerenders in memory. Stable scrollbar space and
wrapping index links keep the layout usable on smaller screens. Navigation never
runs preflights or wallet actions. Validation: 24 existing collection/X-Chess/radio
console tests plus 2 navigation tests pass; production Vite build passes.

## Numbered JPEG fixtures

`node scripts/wizard/prepare-numbered-jpegs.mjs` prepares ten local 512×512
black-on-white numbered JPEGs and a manifest containing byte counts, file SHA-256
and core rolling hashes (16 KiB chunks). Default output is root
`media/wizard-numbered-jpegs`; media remains uncommitted. All ten outputs were
verified as JPEG/512×512 and visually checked using a contact sheet. The generator
has no network, wallet or signing access. URI values remain unset until staging
is chosen. The existing wizard collection runner targets direct core minting;
these files have not been uploaded, registered or minted through the v1.5 helper.

## Dedicated helper test runner

Added `scripts/wizard/collection-v15-run.mjs --dry`. Actual Clarity simulation of
the numbered JPEG collection passed 156 checks across ten mints (four staged,
four atomic, two batched), including reservations, cancellation, deduplication,
byte reconstruction, ownership, receipt attribution and index/counter consistency.
The source comparison permits only the expected local core principal substitution.
JSON evidence is saved with the local fixtures; no generated media is committed.
This is a local runner, not a mainnet adapter or storage lifecycle test. No real
wallets were read and no STX was spent.

## Dedicated encrypted live wizard

Added `collection-v15-live.mjs` with explicit setup/status/authorize/run commands.
Setup generates only a new job-specific wallet, encrypts its key with scrypt and
AES-256-GCM, and leaves spending disabled. Its ignored state directory contains
only the encrypted vault, config and resumable journal; setup never prints keys.
The live flow deploys its own pinned helper, registers ten JPEGs, mints atomically,
verifies owner/bytes/receipts/indexes/reservations and pauses at completion.

Safety controls include a total lifetime cap, per-transaction quote ceiling,
balance floor, existing wizard kill switch, mainnet/core/source checks, explicit
nonces, Deny postconditions, exclusive lock, journal-before-broadcast and six
canonical confirmations. Resume uses the original transaction bytes. Test URNs
are labels, not staging URLs; cleanup and paid split testing remain separate.

Validation: three tests pass, including the entire flow and resume with an offline
API and ephemeral keys, authenticated-vault tamper rejection and budget boundaries.
Offline Clarity 4 deploy/call serialization also passed. No real vault was created,
no funding or live broadcast performed, and no spending cap has been chosen.

## Setup-only wizard and funding — 15 September 2026

Created dedicated public address `SP3P8VYRTXYVEH2R85YKASHTD65Z4E4RC13MY7X6M`.
The ignored encrypted vault is paired with the macOS Keychain item
`xtrata.collection-v15.setup-wizard` / `collection-v15`. No key is printed.
Added Keychain setup/status wrapper and read-only setup fee quotation command.
Hiro returned NoEstimateAvailable for the undeployed helper; recommended funding
is therefore a conservative 16 STX budget: 15 setup transactions at the configured
1 STX fee ceiling plus reserve, not a claim of actual costs. Funds stay in the
wizard until spent. The user will fund the address independently.

The new `prepare --broadcast` path deploys and configures supply/metadata/zero
price, verifies paused state and stops before inventory registration or inscription.
Register inventory only after real R2 staging URLs exist. The original `run` path
still explicitly performs test inscriptions and must not be used for this revised
setup-only task. No real transactions were signed/broadcast during wallet setup.
