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

## Funded setup completed — 15 September 2026

Dedicated helper:
`SP3P8VYRTXYVEH2R85YKASHTD65Z4E4RC13MY7X6M.collection-v15-wizard-test`.
Draft page: https://xtrata.xyz/collection/wizard-numbers-1-10
D1 collection ID: `b403e9c4-a57e-4769-93da-e3e4eaf4f115`.

Confirmed mainnet transactions (each verified canonical with at least six confirmations):

| Step | Transaction | Fee STX |
| --- | --- | ---: |
| Deploy | `0x2d2f9205b836f039cb42308ff74a41e0d66dc342ff3bf75a71f0df8293a2afe1` | 1 |
| Supply | `0x5150ce22c0d701054389d197cb90a3b489aa4a2ac55f9476328f952d393b8283` | 0.01 |
| Metadata | `0x66f90e7e06ddcf6d7d690be237690682339d388bbb6a2f40ecbdc89443bab41d` | 0.01 |
| Price | `0x84de4bcea86b1ada9145e0fa9d31f34b6192f1acfcf8e57bc962816a2285f083` | 0.0422 |
| Inventory batch | `0xf2f95a3327e6b03a4eb3fc922668ed0e95f0a351e320f223a5dd68732190b5b3` | 0.01 |

Total 1.0722 STX; verified remaining balance 14.9278 STX from the user's 16 STX
funding. Lifetime cap is 15 STX and per-transaction ceiling remains 1 STX.
Volatile deployment estimates were capped; missing call estimates used the live
minimum byte rate and a bounded floor. No inscription calls were submitted.

Verified owner, pinned core, exact source, metadata Numbers 1-10 / NUM10,
supply=10, price=0, minted=0, reserved=0, paused=true. All ten inventory URIs match
the staged manifest. Ten R2 keys hold 69,363 bytes; every preview download matches
the local JPEG SHA-256. D1/R2 APIs were reused without cleanup or deletion. Draft
records currently expire starting 2026-09-18T12:11:16Z; review before expiry.

The real page was inspected without wallet interactions. It shows 0/10, the wizard
owner, NUM10 and the v1.5 granular fee model (0.201 STX protocol fees for a one-chunk
buyer mint at the observed core schedule). Template metadata was explicitly set
to v1.5; omitting it had selected legacy compatibility pricing. The collection is
still draft, hidden from public listings, and the helper remains paused. Publishing
and unpausing are the remaining release actions; no buyer mint was performed.

Tests: three targeted tests pass, including capped fee, missing-estimate fallback,
setup-only path, ten-item registration without minting, encrypted vault and resume.
Staging was exercised against the live API and all ten files byte-verified twice;
resuming reused the existing ten asset records and ten keys.

## JPEG optimization candidates

Prepared 128×128 grayscale quality-60 MozJPEG candidates in a separate local
`media/wizard-numbered-jpegs-optimized` directory. Ten original JPEGs total 69,363
bytes (4,353–8,266 each); candidates total 7,273 bytes (548–884 each), an 89.5%
reduction. All digits were checked in a contact sheet. Original files, staging
objects and registered hashes remain unchanged pending replacement selection.

Both profiles use one 16 KiB chunk per image, so fixed and chunk protocol fees
are unchanged; only payload-dependent miner costs can decrease. Replacing the
current inventory also needs ten old-hash clear transactions and one new batch
registration, so net cost savings for this already-configured test are not assured.
Keep paused, require no mint/reservation activity, upload and byte-verify new
objects first, register new/clear old hashes and verify mappings, then remove
only the superseded unreserved staging assets after preserving a local backup.
Never overwrite bytes under an already-registered hash. Existing runner identity
checks intentionally reject silent changes to its original fixture manifest.

## Optimized replacement completed — 15 September 2026

The user approved replacement after being told the fixed protocol fee is unchanged.
All ten 512×512 originals were replaced in the paused draft with 128×128 quality-60
grayscale JPEGs. Original size 69,363 bytes; active size 7,273 bytes (89.5% smaller).
Individual active files are 548–884 bytes. Unsigned atomic call payloads including
the existing metadata URIs total 12,074 bytes instead of 74,164, before adding the
same spending postconditions to each profile. No percentage fee saving is assumed.

New hashes were batch registered in transaction
`0x652d77d1c93b0b9a74fd6905fbd5c17878e65a9ab351c65f3c1ff6b6f7834d7a`;
ten individually journaled clear calls removed the original registered hashes.
Each step waited for six confirmations. Replacement fees total **0.095830 STX**.
All setup plus replacement fees total 1.168030 STX; verified remaining wizard
balance **14.831970 STX**. All sixteen transactions were successful and canonical;
minimum observed confirmation count at final verification was fifteen.

Cleanup verified all new on-chain mappings, absent old mappings, new preview bytes,
paused/unminted/unreserved state and byte-identical local originals before deleting
old records. The API explicitly acknowledged deletion of each superseded R2 object.
Final D1 inventory has exactly ten distinct storage keys and 7,273 bytes. Active
staging now records the optimized profile; original files and replacement history
remain local. No artwork was inscribed; helper remains paused and page remains draft.
Earliest active staging expiry is 2026-09-18T12:24:27Z.

Validation: four wizard integration/vault tests pass, including replacement/resume
and refusal to restore old inventory. The actual Clarity collection suite passes
21 tests; the new regression proves cleared inventory cannot mint and its replacement
can. The local original/optimized manifests and all downloaded replacement bytes
were verified. Missing deletion acknowledgements fail closed rather than falsely
claiming successful cleanup. A misleading generic completion log was corrected for
future replacement runs; verified chain state, not that generic line, is authoritative.
