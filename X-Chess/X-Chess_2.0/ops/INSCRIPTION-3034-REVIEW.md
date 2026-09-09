# Inscription 3034 compatibility review

Reviewed 2026-09-07 against https://xtrata.xyz/i/3034 and the local X-Chess 2.1.9 source. This is an assessment of the proposed improvements and the current release baseline, not certification of an unimplemented future release. No wallet was used to sign or broadcast, and nothing was inscribed. Only test coverage and this report were added to the repository.

## Identity and reproducibility

The live header reads `2.1.9 · 2026-08-21 21:44 UTC · #936aba6a`, bound to `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xchess-core-v1-canary` on mainnet.

A fresh source build with the existing contract, network and pinned build timestamp reproduced the existing artifact byte for byte. Applying the four Xtrata Hiro URL replacements and inserting `<base href="null">` after `<head>` then reproduced the **entire downloaded response from /i/3034 exactly**. This establishes that the reviewed local source builds the application currently served at that inscription; matching only the visible version label would not have established this.

| Item | Verified value |
|---|---|
| Board size | 245,304 bytes |
| Upload chunks | 15 × up to 16,384 bytes |
| Remaining within the repository's 32-chunk batch budget | 278,984 bytes |
| Original HTML SHA-256 | `92af7967942fce818e8471032a31f52ad384c0a3c1c1c039d36a1e10d2173b9a` |
| Xtrata rolling chunk hash from the reproducible build | `19c9a303508cbc5b82fb868cbdf9ce9e39ebf540656489c7a80415c8e154cac2` |
| Served response SHA-256, including Xtrata transformations | `ffd103701f020362f0ccb95e575a91ac620253dcafe25744ac761124c421fad2` |

The response hash is not the original inscription hash: the serving layer changes the bytes. Future release comparisons need to distinguish these values.

## Tests and browser interactions

| Check | Result |
|---|---|
| Full ordinary suite after adding the direct-inscription regressions | **1,634 passed, 17 skipped; 89 passing files, 3 skipped files** |
| Built artifact and runtime suite | **129 passed in 11 files**, included in the full count above |
| Separate Clarinet contract, economics and sponsorship suite | **62 passed in 4 files** |
| TypeScript | Passed |
| Serverlessness audit | Passed, including all seven audit canaries |
| Fresh build with pinned timestamp | Same bytes, hashes, contract and protocol versions |
| Live game 1 | Loaded 64 squares, recovered committed rules and displayed Black to move |
| Board flip | Reversed the first square from a8 to h1 without changing the game |
| Skipped submissions | Toggled the 29 rejected entries and their reasons |
| Phone viewport, 390 × 844 | Document width and scroll width both 390; board 340 × 340; no horizontal page overflow |
| Tournament discovery | Found inscriptions 3016, 3001 and 2993 |
| Exhibition Three | Completed the 90-game scoring pass; all 90 marked finished |
| Finished game 47 | Reported Black wins by checkmate, 32 accepted submissions, Wager versus Fathom |
| Replay | Rewound to move 0 with 32 pieces; advanced to move 1 with the white pawn on f4 and f2 empty |
| Copy link | App reported success; clipboard contents were not independently recovered by the browser tool |
| Leaderboard | Loaded using checkpoint inscription 3035, explicitly disclosing the trusted prefix |
| Verify from scratch after checkpoint load | **Defect:** reported 247 counted games after walking a 130-game ranked index; the checkpoint prefix was counted again |
| Framed browser, local shim, accepting stub | One `stx_getAddresses`, then one `stx_callContract`; both returned successfully |
| Framed browser, deployed shim, accepting stub | Same successful one-request connection and one-request contract-call path |
| Framed browser, deployed shim, rejecting stub | **Defect:** one Connect click tried six methods after rejection and ended with misleading NO_ADDRESS wording |

The accepting stub returns a deliberately invalid, all-zero transaction ID and never signs or broadcasts. These checks prove browser-to-shim-to-host request/response routing, not real extension approval, network confirmation, or real-wallet acceptance of sponsorship post conditions. Contract sponsorship accounting and the separate wallet serialization tests cover other layers.

Deep perft was not repeated: the board was rebuilt to the exact existing artifact, and no engine or protocol source was changed. Mobile testing here means a phone-sized desktop browser viewport, not a physical iPhone or Android wallet.

One unattributed `MutationObserver.observe` TypeError appeared in the browser console for each accepting framed harness. Connection and contract routing still completed. The browser log did not identify a source URL, and the reviewed application/runtime files contained no matching observer call. Attribution remains unresolved; this is not a clean-console certification.

## Findings that change the priorities

**Highest priority: full verification double-counts the checkpoint prefix.** This was reproduced through the live 3034 UI. Before verification, the checkpoint-backed table reported 123 counted games and Mason at rating 1374 from 28 games. Clicking Verify from scratch walked 130 ranked entries, then reported **247 counted games**, with Mason at **1440 from 56 games**. Fathom similarly went from 18 games to 36. A checkpoint can legitimately lag new results, so a difference in ratings alone is not proof of a defect; counting 247 distinct rated games from an index of 130 and the source path below establish the problem.

The button sets `verifyEverything = true` (`packages/ui/app.ts:1136`), causing the walk to start at zero (`:7188`), but leaves `this.checkpoint` populated. The result always concatenates `checkpointSeed()` with the walked games (`:7280`), and `checkpointSeed()` ignores verification mode (`:7128`). The verified path must use only the full walk. Add a regression for the transition from checkpoint-backed display to full verification, checking unique game IDs, game totals and ratings; a parser-only checkpoint test cannot catch it.

The inflated table is also written to the persistent rating cache (`:7298`). A corrective inscription should version/invalidate that cache so previously computed bad rows are not presented as fresh in Profile. Preserve the on-chain `elo-v1` protocol: this is duplicate input to its computation, not a reason to change the rating formula or deploy a new contract. The passing automated baseline does not cover this transition.

**Connection cancellation should stop the connection attempt.** In `packages/wallet/connect.ts`, the `ask` helper catches every error and returns null. That loses a user-cancellation error even though the lower wallet layer preserves it. With the deployed shim and a host returning rejection code 4001, a single click attempted `stx_getAddresses`, `wallet_getAccount`, `wallet_connect`, `stx_requestAccounts`, `stx_getAddresses`, and `getAddresses`. The final message was “a wallet answered but did not give an address.” A fix should propagate cancellation immediately while keeping fallback for unsupported methods and timeouts. This is a frontend change and needs tests at the connection orchestrator and actual bridge boundary.

**The local runtime is not identical to production.** The deployed URL-support and module-bootstrap scripts match the sibling repository byte for byte, but the wallet shim does not. The local copy includes underlying-provider and connection re-entry fixes absent from the served copy. The successful bridge path was therefore repeated with an isolated harness loading the downloaded production scripts, not just the local scripts.

| Runtime script | SHA-256 |
|---|---|
| Production and local module-bootstrap.js | `e2fb4fe2a123a815de3406eb7ba16d1477950210fe49a09cfca9c01181871e66` |
| Production and local url-support.js | `c45510d605c6e5151f0d2ced1be9166e9244e7ed37e85f21954c2041c7d2c927` |
| Production wallet-shim.js | `5a2629c88dbb843dbab8b06b38dd8b9d9fe97df0ed25b52c9aa3c7e45063a5ac` |
| Local wallet-shim.js | `3cb1c9c6477dd30eef7ab1a27b7a5bcfc4b0f39c599766413452b7a740882dcc` |

**Direct and framed serving are different paths.** The direct inscription response has the unusual base tag and no injected runtime support scripts. The framed viewer injects support scripts and uses a host token. Preserve proxy detection for the base-tag case, ordinary extension support on a direct page, and host bridging in the framed case. Do not assume every inscription is framed or that relative URLs resolve normally.

**The loading and fee wording issues are live.** The “Looking for game 1” notice survived successful loading, navigation into the tournament, and opening game 47. The fixed 0.0004 STX fee statement is also present in the served build. These recommendations remain applicable to 3034.

## Recommended order and inscription constraints

These are implementation recommendations, not implemented fixes. All can be delivered without changing the chess contract or migrating games if the existing contract binding and protocol semantics are preserved.

| Order | Update | Benefit / implementation risk | Requirements for a future inscription |
|---:|---|---|---|
| 1 | Correct full leaderboard verification and invalidate affected rating caches | Very high / low–medium | Exclude checkpoint seed games from the full walk. Verify each game is counted once and test the seeded-to-full transition. Version the derived rating cache; keep `elo-v1` and the contract unchanged. |
| 2 | Stop wallet connection retries after cancellation | High / low–medium | Preserve rejection codes through `connectWallet`; one cancellation must end the attempt. Test direct extension and deployed-shim paths. Never add automatic transaction retries. |
| 3 | Test against captured production runtime bytes | High / very low production risk | Record runtime hashes and test both direct and framed delivery. Three direct-artifact regression cases were added in this review; full browser automation remains future work. |
| 4 | Recover from invalid cached entries | High / low | Validate and discard malformed cache records; reread the chain. Preserve acceptance of existing valid records. Cache absence must remain supported in restricted/private storage. |
| 5 | Add chain-read deadlines | High / low–medium | Use browser-supported cancellation, preserve endpoint fallback and explicit overrides, and distinguish user/navigation cancellation from an unavailable endpoint. Bound body reads as well as connection establishment. Keep wallet timing separate. |
| 6 | Replace fixed fee claims with accurate wording | High / low | Label historical observations and distinguish contract charges from the wallet's network estimate. No new fee service or hard-coded guarantee. |
| 7 | Scope and complete loading/status messages | Medium–high / low | Tie messages to the relevant game and operation. Late reads must not overwrite a newer transaction or game notice. |
| 8 | Namespace tournament cache by network, contract and schema | High / low–medium | A new namespace should cause a safe cache miss, with paced rebuilding. Do not require data from an old inscription to remain in storage. |
| 9 | Preserve board focus and improve keyboard navigation | Medium–high / low–medium | Retain read-only/replay and pending-transaction guards. Test promotion focus, flipping, touch and keyboard behaviour in the final HTML. |
| 10 | Batch IndexedDB entry operations | Medium–high / medium | Measure real browser timings and transaction counts. Maintain safe failure/rebuild behaviour and keep polling reads within budget. |
| 11 | CI with explicit target and artifact checks | High over time / low production risk | Build the exact intended contract/network; record timestamp, hash and chunk count. Test the bytes intended for inscription after the last build. |
| 12 | Reconcile release and risk documents | Medium / very low | Record 3034 as the current reviewed board and distinguish deployed runtime evidence, test stubs, and real-wallet sign-off. |
| 13 | Clearer game-creation presets | Medium–high / low–medium | Use existing canonical rule fields; show the seats/rules before signing. Do not change interpretation of existing rule hashes or historical games. |
| 14 | Shared read scheduling and deduplication | Medium–high at scale / medium | Preserve proxy/public fallback, prioritise the current game, respect retry delays, and deduplicate read requests only. No signing/broadcast retry queue. |
| 15 | Extract the large application controller incrementally | High maintenance benefit / medium | Keep the single self-contained build and existing wallet payload/boot contracts. Compare replay, results, ratings and artifact tests after each extraction. |

For the first new inscription, fix the verified rating calculation and its cache, then cancellation and the small reliability/wording issues. Use production-runtime coverage throughout. Keep storage batching, broad request scheduling and controller restructuring in later candidates so failures are easier to attribute.

## What must be true of the release candidate

Use the same mainnet chess contract if the intention is continuity with 3034. Preserve the rules, replay, event and rating versions. Keep scripts/styles/assets bundled into the HTML and preserve the existing proxy and wallet discovery behaviour. A new inscription receives a new ID: copied links and navigation must derive the current location, not embed 3034. The added tests exercise boot at both 3034 and a synthetic different ID.

After implementing a proposed change, rebuild and rerun source, artifact, direct-runtime and deployed-shim browser tests on that exact candidate. Record its HTML hash, Xtrata chunk hash and size after the final build. Real Xverse/Leather and mobile wallet checks still require actual extension/device evidence. A passing baseline and compatible design do not establish that a future implementation is correct.

The tests added here are `tests/runtime/direct-inscription.test.ts`. They read `dist/xchess.html`, so they exercise future built candidates as well as the current baseline and add zero bytes to the shipped application.
