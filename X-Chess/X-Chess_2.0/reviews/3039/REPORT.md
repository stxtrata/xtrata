# Inscription #3039 — post-inscription test report

Tested 9 September 2026. **The sealed board matches X Chess 2.3.2 exactly, and signed peer archive compatibility passes.** This round was read-only: no new transactions or STX spending.

## Integrity and compatibility

- Read all **20 chunks** directly from the inscription contract. The sealed HTML is **314,711 bytes**, byte-for-byte equal to `releases/2.3.2/xchess.html`.
- Original SHA-256: `6bbebca61cc412ebfcde80575a90e0192513f66160d470c609dbf98d105316c3`.
- Xtrata's served HTML is 314,719 bytes, SHA-256 `18249bf9727533dbb46ca4286b2bcea59cd5ff7c56bc3471e613cf8dcee50f83`. Its differences are exactly the expected base/proxy URL substitutions.
- Read existing result **#3038** from chain again and confirmed its registered opening. Its 3,185-byte archive remains unchanged.
- In the actual [#3039 website](https://xtrata.xyz/i/3039), the built-in registry successfully loaded game 1 as a verified replay viewer. Importing #3038's signed history produced **0–1 checkmate**. Review & Inscribe displayed the correct archive SHA and history root, “Opening verified on chain”, and no requirement for loser approval. No duplicate archive was published.

Evidence: [chain verification](chain-verification.json), [served identity](identity.json), [offline verifier output](offline-verification.json).

## Tests run after inscription

| Test | Result | Scope |
|---|---|---|
| Targeted display/recovery regression suite | **31 passed** | Rule adoption, stale responses, retry visibility, pagination, interrupted ranking reuse, incomplete-data rejection, tournament polling and summaries. Source tests; exact source-to-inscription identity established separately. |
| Runtime browser suite | **44 passed** | Actual downloaded #3039 bytes under captured Xtrata runtime, direct/framed contexts, wallet accept/refuse stubs, keyboard/mobile/storage checks. |
| Native peer browser suite | **13 passed** | Actual downloaded #3039 bytes in independent Chrome profiles: WebRTC without an ICE service, reconnect, manual fallback, loser disconnected before mate, encrypted recovery, reload, offline viewer, duplicate/tampered imports. |
| Existing public game verifier | **Passed** | #3038's signatures, move history, board state and checkmate; standalone verifier correctly distinguishes offline verification from chain identity. |

Reports: [display](display-tests.json), [runtime browser](browser-report.json), [peer browser](peer-browser-report.json). The earlier [2.3.2 release validation](../../releases/2.3.2/VALIDATION.json) records the full 1,751-test regression run and 68 contract tests; those entire suites were not repeated unnecessarily after byte identity was established.

## Live website observations

- The board boots with the correct 2.3.2 stamp and the existing core contract, format 1.
- Legacy game 47 loads and replays to Black checkmate with 32 accepted submissions. The live board continued to report unconfirmed rules and “White anyone / Black anyone”, including after Refresh later in the session. The conditional rule-recovery regression passes, but successful named-rule recovery for this specific live game remains unresolved. Its displayed result is therefore explicitly provisional under the open-board fallback, rather than a verified result under recovered committed rules.
- Explorer retry visibly disables navigation while loading. After initial endpoint failures it successfully loaded **137 games**, the newest **25 rows**, and replaced the stale error with “Chain reads recovered”.
- Older pagination subsequently completed successfully: **games 88–112**, with the correct paused-update label and an empty loading status.
- Exhibition One #2993 finished scoring all **21 games**. Its filters showed **Still playing 0 / Finished 21**, freshness said **Every game has finished**, and the picker showed **Finished 1**. These labels now agree with the standings.
- The live checkpoint-assisted leaderboard completed with **14 players**, **123 verified ranked games** and one unidentified game. Its note explicitly identifies checkpoint #3035 and the history taken from that checkpoint. A full-from-scratch live rebuild was not repeated.
- Built-in Help correctly explains off-chain play and distinguishes it from the embedded legacy manual.
- The deployed peer registry default, chain opening verification and signed result review all work on the live inscription.

## Remaining findings and limits

1. **First-load explorer error still shows “0 games on this contract”.** The count is unknown at that point, not zero. The adjacent failure message and enabled Refresh correctly expose the problem, but the count should say “Game count unavailable” and avoid referring to a previous page when none has loaded. This is a small remaining display correction for a later board version; the sealed #3039 bytes were not edited.
2. **Game 47 named-rule recovery remains unresolved in the live browser.** Do not treat the passing recovery fixture as proof that every historical game can be identified. Further diagnosis should compare its committed rules hash with all relevant manifest candidates and distinguish unavailable metadata from unsupported rules.
3. Public Stacks endpoints intermittently returned rate limits/unavailability. Direct read-back initially failed and then completed through Xtrata's public proxy. Browser recovery was observed. A successful controlled regression does not guarantee endpoint availability.
4. Real wallet-extension signing, a new game/result purchase, cross-network NAT conditions and production-scale load were not exercised. Existing #3038 provided a real on-chain result for compatibility testing, avoiding unnecessary spending. Advisory clocks still never establish timeout wins.

No sealed-byte, signature, move-history or result mismatch was found in the exercised paths.
