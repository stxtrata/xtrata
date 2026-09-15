# Paid-play helper deployment — v1.0

The user has deployed and verified this helper on mainnet. Deployment alone does
not create a listening wallet or enable automatic payments. Existing radio, measured play counts and likes are unchanged.

## Release

- Contract name: `xtrata-radio-plays-v1-0`
- Source: `contracts/live/xtrata-radio-plays-v1.0.clar`
- Language: Clarity 4
- SHA-256: `b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1`
- Source bytes: 2381
- Intended deployer: `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X`
- Canary: `/web/deploy-console.html#radio-plays-deployment`

## Stages in the canary

1. Local transaction tests: commands are shown on the card. Nine simnet tests
   cover payment/count atomicity, exact 50 microSTX transfer, wallet-scoped replay
   protection, ownership changes, all three cores, invalid inputs, proxy callers,
   self-payment, escrow and failed-transfer rollback. Simnet rewrites only the
   production deployer address to its local deployer; canonical bytes are pinned
   independently in the console tests.
2. Read-only preflight: no wallet needed. Checks exact source hash/length, mainnet
   principals, name availability, three core `get-owner(uint)` APIs, and offline
   transaction size. Fails closed if required reads fail. This is not a mainnet
   transaction simulation or proof of live fee acceptance.
3. Deploy: connect the expected mainnet deployer; explicitly click Deploy and
   review the Clarity 4 source/name/fee in the wallet. Availability and source
   preflight run again immediately before opening the wallet. The existing console
   requests a 0.49 STX deployment fee; it is not the per-play fee. Cancellation
   creates no admin/setup transaction.
4. Verify: after confirmation, re-run preflight. It must verify exact deployed
   source plus get-config version, fixed 50-microSTX payment, 16-byte receipts and
   all three core bindings. No admin transaction or activation variable is needed
   for this standalone helper. Ordinary radio playback remains unchanged.
5. Dedicated playback canary: open `/radio/test-wallet` from the deployment card.
   Follow [Radio Test Wallet](TEST-WALLET.md) to create and back up a separate wallet,
   review funding and individually approve a payment or bounded session.
   Never test using the user's personal, deployer or sponsor wallets.

The CLI registry also pins these bytes and Clarity version, but this task neither
runs a production deploy nor accesses a mnemonic.

## ABI and accounting

`play(core uint, id uint, receipt (buff 16))`: selectors 1, 2 and 3 map to the
specified production v1.1.1, v2.1.0 and v3.2.3 contracts. Identity is `(core,id)`,
never an OR search across cores. Frontend master/edition/migration resolution must
be verified before enabling paid listening; this helper does not prove song type,
audio delivery, legal rights or unique human listening.

Owner is resolved at execution. Exactly 50 microSTX moves from payer to current
standard-principal holder; receipt and count commit atomically. Receipts are unique
per payer even across masters. No funds are held by the helper. A failed included
transaction may still consume its miner fee. Print events include core, id, payer,
receipt, actual recipient, amount and cumulative total for indexing. Holder earnings
for a master are its confirmed total multiplied by 50 microSTX; per-recipient
history must use events because ownership may change.

Reads: `get-config`, `get-owner(core,id)`, `get-total(core,id)`,
`get-receipt(payer,receipt)`. No unbounded iteration or public reset/admin function.

Errors: 100 indirect caller; 101 unsupported core; 102 receipt length not 16;
103 duplicate receipt; 104 missing inscription; 105 payer is holder;
106 contract/escrow holder. STX transfer errors propagate (e.g. u1 insufficient
funds). Invalid Clarity argument types/oversized buffers are rejected before entry.

## Fee gate

The protected standard-signature envelope measures **257 bytes** with explicit
core/master, 16-byte receipt and Deny/exact-50-microSTX-spend post-condition.
At 1 microSTX/byte this implies 257 microSTX miner fee, not 200. This is an offline
size baseline, not a current quote or broadcast result. No fee is silently raised,
and automatic playback remains disabled. Settle the actual accepted fee before
advertising 3,600 plays per 1 STX; treasury collection remains out of scope.

## Validation

9 Clarity simnet tests; 12 paid-play console/size tests; 8 existing likes console
regression tests; Vite production build. All passed. Build retains existing asset,
PURE annotation and large-chunk warnings. No browser wallet used, no live signing,
no funds moved. User handles pushing and user-driven deployment.


## Running the tests from Terminal

First change into the `xtrata-2.0` folder containing this project's `package.json`,
then run `npm run test:radio-plays`. Alternatively use
`npm --prefix "/absolute/path/to/xtrata/xtrata-2.0" run test:radio-plays` from
any folder. Replace the example path with your checkout location.

The runner resolves both suites from its own location and uses each project's
installed Vitest version. It checks both runners exist before starting and never
invokes npx or downloads packages. Running bare npx from your home folder can
instead download an unrelated Vitest version; interrupt that run with Ctrl+C.

## In-canary contract tools

Stage 5 provides wallet-free configuration validation, offline protected-transaction
size measurement, explicit-core owner/total reads and wallet-scoped receipt lookup.
Read failures are displayed and requests time out after 30 seconds. Inputs reject
invalid cores, uint overflow and receipts other than 16 bytes. Results include raw
decoded chain values for inspection; paid totals are not measured browser plays.

V1.0 has no admin setters, pause, reset, treasury or contract withdrawal. The
dedicated wallet link provides explicitly approved payment tests and local spending
controls without using the canary's connected deployer wallet. No real transactions
were submitted while implementing these modules.
