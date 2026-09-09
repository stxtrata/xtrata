# X Chess #3037 — post-inscription acceptance test

Tested 9 September 2026. **The mainnet game/result round trip passed.** Two new legacy games completed, and a registered off-chain game was signed, published by its winner as **[inscription #3038](https://xtrata.xyz/x/3038)**, read back from the contract, and verified in the actual **[inscribed app #3037](https://xtrata.xyz/i/3037)**. All 14 test transactions succeeded. Live UI and endpoint issues remain; this is not an unconditional release sign-off.

## What passed, and where

| Area | Evidence / outcome | Test environment |
|---|---|---|
| Immutable application | All 20 on-chain chunks reproduce the release HTML exactly. Served HTML matches Xtrata's base/proxy transformation. | Mainnet contract read-back and live site |
| Standard legacy game | Game **136**, named wizard players, unranked: 4 accepted moves, 0 rejected, Black checkmate. | Mainnet, actual SDK transactions and application replay |
| Sponsored legacy game | Game **137**, same result; 0.250 STX bootstrap reached Black, two 0.002 STX rebates paid; 43 rebates / 0.086 STX reserve remain. | Mainnet receipts and contract reads |
| Fully sponsored mode, seat rules, rankings, draw/resign and failure paths | Regression and simnet checks passed. No new fully sponsored mainnet game was opened in this session. | Automated fixtures and contract simulator |
| Existing games | Game 47 replayed 32 accepted moves to checkmate. Rewind and flip worked. Explorer displayed existing games, names, checkmate and resignation results. | Actual #3037 UI |
| Tournaments | Three manifests discovered. Exhibition One #2993 replayed all 21 finished games and showed standings and provenance. Status-label inconsistency noted below. | Actual #3037 UI |
| Leaderboard | Checkpoint-assisted table loaded: 14 players, 123 verified ranked games, one unidentified game. A separate full rebuild stopped on endpoint failure and preserved the previous table. Full rebuild completion is **not** claimed. | Actual #3037 UI |
| Profile and Help | Disconnected profile manifest creation correctly required the owning wallet. Embedded manual #3007 loaded. Publishing a new profile was unnecessary and not tested live. | Actual #3037 UI |
| Named peer registration | Exact reviewed registry source deployed and compared byte-for-byte; game **1** created and joined by the named wizards, then confirmed after two additional blocks. | Mainnet |
| Signed off-chain game | Four legal signed moves, final checkmate, complete history hash and board hash verified against the joined mainnet opening. No move transactions. | Application protocol modules with separate game keys |
| Direct peer transport | Independent Chrome profiles, native ordered WebRTC, signed manual signaling without an ICE service; reconnect and history synchronization passed. | Downloaded #3037 bytes in browser harness |
| Manual fallback | Complete game with WebRTC unavailable; duplicate import harmless; tampering rejected without changing accepted history. | Downloaded #3037 bytes in browser harness |
| Recovery and offline archives | Encrypted recovery restored the key into a fresh profile; reload resumed; fresh keyless reader verified and replayed with external requests blocked. | Native browser storage and offline verifier |
| No loser veto | Browser test closed the loser's browser before the mating move. Winner still exported the completed archive. In the mainnet registered game, Black published using only the existing signed line, with no terminal countersignature. | Browser and mainnet tests |
| Result inscription | **#3038**, 3,185 bytes, one chunk, application/json, dependency **#3037**, owned/published by Black. Sealed bytes equal the original archive exactly. | Mainnet |
| Independent live viewer | Public JSON from Xtrata #3038 imported into #3037 in a browser holding no game key. UI showed “Registered opening verified”, 0–1 checkmate and the exact original SHA/history root in Review & Inscribe. | Actual public websites |

The live registered game used the application protocol and transaction SDK; the native WebRTC game ran separately in browser profiles. This does **not** claim one uninterrupted real wallet-extension/WebRTC/uploader UI session. The frontend's publication flow downloads JSON and opens Xtrata; the wizard SDK performed the actual inscription transaction.

## Repeatable automated checks

| Suite | Result | Evidence |
|---|---|---|
| Regression selection: legacy, UI, runtime, artifacts, wallet, chain, peer and wizard paths | 889 passed, 3 skipped | [JSON](regression-tests.json), [log](regression-tests.log) |
| Rules, engine, replay, protocol, perft and fuzz | 489 passed, 14 deliberately skipped | [JSON](rules-engine.json), [log](rules-engine.log) |
| Clarity contracts, economics and sponsorship | 68 passed | [JSON](contracts.json), [log](contracts.log) |
| Captured inscription runtime, direct/framed, wallet accept/refuse stubs, mobile/keyboard/storage | 44 passed | [Browser report](browser-report.json) |
| Native peer browsers, manual fallback, recovery and offline archive | 13 passed | [Peer browser report](peer-browser-report.json) |
| TypeScript | Passed | [Log](typecheck.log) |
| Standalone public archive verifier | Valid signatures, history and checkmate; correctly distinguishes unchecked chain identity | [Output](offline-verification.json) |

Suite counts overlap and are not an additive count of unique tests. Wallet stubs do not establish real Xverse/Leather extension compatibility. Cross-network NAT/TURN connectivity, real mobile wallets, hardware wallets, reorgs and production-scale load were not exercised. Advisory clock expiry/disconnection remains unfinished play, never a verified timeout win. An archive proves its supplied signed line, not the absence of another signed branch; peer results do not enter legacy ratings.

## Mainnet costs and transactions

Only existing disposable Opener, Responder and Patron wizards were used. All new games were unranked. No funding transfer was needed. The session stayed below its **1 STX** maximum and above the **0.2 STX** balance floors. No further spending is needed to verify the evidence.

| Wizard | Starting STX | Ending STX | Change |
|---|---:|---:|---:|
| White / Opener, SP17…2T7VYT | 2.000 | 1.569 | −0.431 |
| Black / Responder, SP26…269W7S | 2.000 | 2.208 | +0.208 |
| Patron, SPAR…DSTNH | 2.000 | 1.970 | −0.030 |
| **Combined** | **6.000** | **5.747** | **−0.253** |

The receipts reconcile exactly with these balance changes: **0.086 STX network fees**, **0.081 STX other fees** (two opening fees, sponsorship margin and result inscription), and **0.086 STX remaining sponsorship reserve**. Thus nonrefundable expenditure was **0.167 STX**. The sponsor bootstrap and rebates stayed within the wizard fleet. The result itself cost **0.011 STX protocol fee + 0.020 STX network fee**. The conservative mint cap of 0.300 STX in the runner was not the amount charged.

See [all 14 transaction links](TRANSACTIONS.md) and [receipts, assertions and reconciled balances](live-state.json). Initial script recovery errors concerned a read-only broadcast adapter and the mint tuple response; they were corrected without duplicate transactions. A final read-only verifier completed through Hiro after rate limits interrupted a redundant read pass.

## Use the deployed registry with #3037

The registry is now deployed, despite the immutable app's older “undeployed” text. In **Quick Play → Register named players on chain**, choose **Mainnet** and enter:

```text
SPARQA0T0GWJZADHRMGNVTJ51D014V8P7XPDSTNH.xchess-peer-v1
```

It is the exact [reviewed source](../../contracts/xchess-peer-v1.clar), with no managed referee, escrow or mutable administration. Creator and named opponent each sign one setup transaction. Thereafter their game keys sign moves. Registry game **1** is the completed acceptance test; new players should create their own game.

To independently inspect the test, load registered game **1**, then paste [the sealed public archive](sealed-result.json) into Manual exchange and import. Review & Inscribe should show Black checkmate and the hashes below. Do not publish a duplicate merely to verify it. The [standalone verifier](../../releases/2.3.1/verify-peer.mjs) can also read this public JSON without private keys or networking.

## Improvements identified, ordered by benefit and implementation safety

These are findings for a future candidate; the sealed #3037 release has not been edited or rebuilt.

| Priority | Update | Observation and expected benefit | Risk / verification needed |
|---|---|---|---|
| 1 | Always expose a usable retry action after leaderboard failure; clear stale errors after successful recovery | Initial failure instructed “Retry Verify from scratch” while its button was hidden. An old endpoint error also persisted after a successful table load; it cleared during a later refresh. | Low: UI state/error lifecycle. Test initial failure → retry → success and retain the previous table on partial reads. |
| 2 | Keep the Players panel synchronized with verified recovered rules | Game 47 first showed “White anyone / Black anyone” while Rules correctly named Wager/Fathom. Refresh fixed the Players panel. | Low–medium: invalidate/recompute replay presentation when rule recovery completes; ensure no incorrect seat authorization. |
| 3 | Make older-page loading and failure explicit, with a recoverable cursor | Repeated Older clicks left the newest 25 rows and label unchanged during endpoint trouble. Fixture paging tests passed, but live paging was not demonstrated. | Low–medium: pending/error UI and successful cursor commit; reproduce under slow/failed reads before asserting the cause. |
| 4 | Add current registry instructions and Quick Play help | #3037 still says registry undeployed; the embedded legacy manual says every move is a transaction. Both require context now. | Low: help/configuration copy and verified registry default; preserve manual entry and network selection. |
| 5 | Derive tournament status labels from the same replay results as the game list | Exhibition One repeatedly displayed “1 game still being played” / “Running1” while its filters showed “Still playing0”, “Finished21” and all 21 games were verified finished. | Low–medium: summary/cache lifecycle. Verify completed and partially loaded tournaments without changing scoring. |
| 6 | Reduce duplicate chain reads and support restartable full ranking verification | Full-from-scratch verification stopped under public endpoint failures/rate limiting. The partial result was safely withheld. | Medium: request coalescing, pacing and resumable reads with tip/provenance checks; must preserve ranking completeness and cache correctness. |

No signature, hash-chain, legal replay, contract accounting or sealed-byte mismatch was observed in the exercised paths. That statement is bounded by the test matrix above.

## Integrity references

| Artifact | Bytes / SHA-256 |
|---|---|
| Original #3037 HTML | 311,553 / `d20d86835aa73e8b157f48df1c7c49405e210fc988d39a733b9a19a26e1ad1d7` |
| Xtrata-served #3037 HTML | 311,561 / `1d4b695e5a1a49c183046d665cbbfac747e06fe675d510df0b32c9df00322822` |
| Sealed #3038 JSON | 3,185 / `ef37a120bd4cefc26bdfa39bd8f534f9acf0bb6eefb9404544b57d6b2ff60c5f` |
| Signed game history root | `b2c43fa18d464012a0d96fd6e9532373aaabb7311b15d2447c5bb81c4166a816` |
| #3038 Xtrata rolling hash | `c0b3ad1b7a2c429d5592bcc5d21ee0eaf1415bf83fdf66a0e8134939977d0025` |

Supporting evidence: [served identity](identity.json), [original chain bytes](onchain-byte-verification.json), [gateway health](gateway-health.json), [bounded transaction runner](live-test.mjs), [read-only final verifier](finalize-readonly.mjs). Private recovery material is excluded from public evidence and ignored by Git.
