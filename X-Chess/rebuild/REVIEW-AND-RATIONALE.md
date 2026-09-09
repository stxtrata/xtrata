# X-Chess review and rebuild rationale

Reviewed 7 September 2026. Give a new agent **[REBUILD-PROMPT.md](REBUILD-PROMPT.md)** to begin the rewrite. It is approximately 2,100 words, self-contained for the new design, and does not require the old application source. This companion explains the decisions and preserves the review's evidence. Exact compatibility with historical games still requires their frozen specifications and deployed interfaces; a short brief should not pretend to replace every historical consensus vector.

## Recommendation

Keep the permanent chess protocol and rebuild the experience around it. X-Chess's strongest idea is an inscribed application interpreting an immutable transaction log. Its weakest areas are recovering information that was only hashed, finding and loading growing histories, and making users navigate implementation details to play chess.

A better version should deliver three improvements together: immediately understandable play, complete reconstruction from permanent evidence, and predictable operation as history grows. A cosmetic rewrite alone would preserve the difficult problems. Moving everything to a conventional backend would lose the product's distinguishing property.

## Scope and evidence

The review covered both generations (`xtrata-chess` and `X-Chess_2.0`), the current core contract, protocol/replay/ratings logic, chain and wallet integration, inscription build/runtime requirements, tournament/AI tooling, profile/manifest discovery, tests, operational documents, feature proposals, and representative stored desktop/mobile screenshots. Source reading concentrated on the behavior that determines the rebuild specification; this was not a line-by-line security audit of every file.

The current package identifies itself as **2.1.9**. Repository documents include historical deployment and price snapshots with conflicting dates/statuses. No fresh mainnet verification or real-wallet transaction was performed. The screenshots are historical artifacts, not a browser test of today's source. Application code was not changed.

Validation performed: `npm run test:unit` in `X-Chess_2.0` completed successfully: **33 files passed, 1 skipped; 614 tests passed, 14 skipped**, approximately 109 seconds. This command covers engine/perft subsets, replay, rules/protocol, fuzzing, ratings, wallets, and chain unit tests. It does not establish full deep-perft, Clarinet/economic, artifact, browser, or real-wallet conformance; those suites were not run for this documentation task.

## What belongs in the new product

| Area | Preserve | Improve |
|---|---|---|
| Identity | Stacks principals; names and pictures as metadata | Validate addresses and resolve current ownership before committing seats |
| Play | Named challenges, community boards, open seat claiming, advanced rules | Board-first flow; clear checks, promotion, consent, costs and pending moves |
| Evidence | Immutable entries; deterministic legality/result replay | Permanent rule descriptors and complete, portable evidence exports |
| Economics | Opening fee, no core move fee, bootstrap/rebate sponsorship | Explicit top-up terms, expiry meaning, fee variability and reserve proofs |
| Discovery | Spectating, own games, player history, tournaments | Indexed candidates plus verification; recover old games without exhaustive UI stalls |
| Ratings | Opt-in eligibility, deterministic Elo | Explicit pool/version boundaries and checkpoint verification status |
| Tournaments | Inscribed manifests, replayed standings, provenance | Proper match IDs, series/revision distinction, precommitted scoring |
| AI characters | Public sheets, engine/prompt references, external runners | Reliable operator boundaries and truthful availability/reproducibility claims |
| Presentation | Recognisable chess and optional piece/sound customisation | Accessible touch/keyboard design; fewer warnings and technical panels above the board |
| Permanence | Self-contained artifact, versioned contracts, offline replay | Reproducible builds and real runtime/wallet evidence before inscription |

The separate piece-set library is useful inspiration, not an architectural constraint. Ancillary BNS rescue/scanner utilities, screenshot builders, and tournament-specific lab tooling are not core rebuild requirements.

## Findings that shaped the prompt

### 1. Committing a hash is not publishing the rules

The core stores only `rules-hash`; the application remembers descriptors locally before opening and shares them through links. Recovery then tries candidate players/rules, with a 512-candidate budget. This can confirm familiar games, but does not guarantee recovery of an unplayed custom game whose descriptor has disappeared. The current code itself describes the search as deliberately narrow.

**New requirement:** persist canonical descriptors, or a permanent resolvable descriptor reference, at creation. Storing opaque rule bytes does not require the contract to understand chess. This is a protocol improvement requiring a new deployment/interface, not a frontend patch that can repair all historical missing information.

Evidence: [contract](../X-Chess_2.0/contracts/xchess-core-v1.clar), [opening flow](../X-Chess_2.0/packages/ui/app.ts), [recovery](../X-Chess_2.0/packages/protocol/recover.ts), [candidate construction](../X-Chess_2.0/packages/protocol/candidates.ts).

### 2. Rules identity has been used as match identity

The core allocates a new ID for every successful opening; it does **not** forbid matching rules hashes. However, `findByRulesHash` returns the first matching game, and tournament preparation/resumption uses it. Identical rematches are therefore ambiguous in the tooling. Status notes describe changing tournament cooldown to obtain different commitments.

**New requirement:** exact game references and explicit competition/match identity; never use a rules hash as a unique match key. Merely adding a random field everywhere is insufficient unless retry/resume behavior and tournament references use it consistently.

Evidence: [lookup helper](../X-Chess_2.0/harness/wizards/tournament.mjs), [runner](../X-Chess_2.0/harness/wizards/run-tournament.mjs), [status findings](../X-Chess_2.0/ops/STATUS.md).

### 3. Checkpoint authenticity and correctness are different

The newer board can seed ratings from a checkpoint minted by an approved publisher and offers a full verification walk. Its source honestly describes this as continuing from a claim. That is a meaningful trust mode beyond the simpler architecture document's “everything replayed” description. Authorship cannot prove that no eligible games were omitted or that their results were correct.

A ranked-index cursor also needs a policy for earlier games that were unfinished when the snapshot was produced. Treating a consumed index as permanently settled can omit later completions; the new design must test this explicitly. This review identifies the required invariant rather than claiming a reproduced end-to-end omission in the current build.

**New requirement:** provisional checkpoint displays, independent verification, unresolved-game tracking, complete canonical rating order, and a cache-free reconstruction path.

Evidence: [checkpoint format](../X-Chess_2.0/packages/protocol/checkpoint.ts), [checkpoint loading/rating walk](../X-Chess_2.0/packages/ui/app.ts), [rating specification](../X-Chess_2.0/RATING-V1.md).

### 4. Sponsorship needs precise accounting semantics

Three source-level details should not become accidental rules of the rewrite:

- Top-ups add liability calculated using the **current** configured rebate, but keep the sponsorship row's **original** payout amount. For example, ten original rebates at 2 units, followed by ten new rebates priced at 1 unit, produces 20 nominal rebates and only 30 units of reserve: only 15 payouts at 2 units fit. The reserve bound prevents overspending, but the displayed count no longer describes funded payouts. Use tranches or price top-ups at the original terms.
- `maybe-rebate` does not test expiry height. Height makes settlement possible; rebates continue until someone settles. The interface must describe that actual distinction.
- `release` sets total reserved to zero if asked to release too much, despite a comment calling this conservative. That understates liabilities rather than over-reporting them. No reachable exploit was established here; the replacement should abort on reconciliation failures and prove they cannot arise.

Exact `as-contract?` allowances bound transfers, but do not prove that the accounting calculated the correct amount or beneficiary. Likewise, bootstrap funding cannot guarantee play through arbitrary network-fee spikes.

Evidence: `top-up-sponsorship`, `maybe-rebate`, and `release` in the [contract](../X-Chess_2.0/contracts/xchess-core-v1.clar); [sponsorship specification](../X-Chess_2.0/SPONSORSHIP-V1.md).

### 5. Specifications and implementation have drifted

`RULES-V1.md` lists two open-side keywords; the implementation also has `first-mover` and `replay-v2`. `REPLAY-V1.md` specifies sequence ordering, while the replay function iterates its input and relies on callers providing sequence order. The ranked text sometimes says both players “moved,” while eligibility counts accepted entries, including accepted events. These differences matter to independent implementations.

Operational files also disagree: status text says no real wallet signed, while risk notes record successful mainnet sponsorship and retain older contradictory paragraphs. Static price examples differ from documented deployed configuration. These are reasons to separate protocol facts, deployment observations, and historical notes—not evidence that every implemented feature is broken.

**New requirement:** one normative specification per version, executable vectors, defined ingestion/order responsibility, explicit event participation policy, and dated deployment evidence.

Evidence: [rules spec](../X-Chess_2.0/RULES-V1.md), [versions](../X-Chess_2.0/packages/protocol/versions.ts), [replay](../X-Chess_2.0/packages/replay/replay.ts), [eligibility](../X-Chess_2.0/packages/ratings/eligibility.ts), [risks](../X-Chess_2.0/ops/RISKS.md).

### 6. The interface has accumulated too many responsibilities

The current application controller is roughly 8,000 lines, alongside a substantial shell and multiple discovery/recovery paths. Historical mobile screenshots place branding, version/build metadata, navigation, connection controls, and technical context ahead of much of the play experience. Tournament screenshots devote considerable space to provenance and operational notices before standings.

**New requirement:** cohesive domain modules, an explicit transaction state machine, shared queries, and a board-first information hierarchy. The improvement is not simply selecting a different JavaScript framework. Preserve technical inspectability while making routine play straightforward.

Evidence: [app controller](../X-Chess_2.0/packages/ui/app.ts), [mobile screenshot](../shots/08-mobile-game.png), [tournament screenshot](../shots/three/01-standings.png).

### 7. The runtime is part of the product

Recorded failures include double boot/double signing, raw script-closing text breaking bundles, delayed wallet injection, missing contract-outflow postconditions, and proxy detection that passed synthetic tests but failed on served inscriptions. These justify keeping artifact and runtime testing in the condensed prompt.

A specific artifact test titled as agreement with the first inscription currently compares a locally computed hash to itself. It tests no historical expected value. Test titles and large test counts cannot substitute for independent expected results.

**New requirement:** test exact built bytes, real browser embedding, and wallet behavior; use real golden vectors and distinguish mock evidence from live evidence.

Evidence: [legacy runtime lessons](../xtrata-chess/ARCHITECTURE.md), [published errata](../X-Chess_2.0/ops/ERRATA.md), [hash test](../X-Chess_2.0/tests/artifact/xtrata-hash.test.ts).

## What should remain a separate extension

The repository proposes fast off-chain play, enforceable timing, chat, prize pools/wagers, and an automatic house-opponent service. These are not all implemented, and their sketches are not ready-made security specifications.

An off-chain hash chain does not establish who signed, prevent withheld history, or resolve abandonment. A signed elapsed-time claim does not independently establish real elapsed time. Paying a prize requires a settlement mechanism stronger than client replay or the contract's first-writer result hint. An AI house needs a running operator process, credentials, and a policy for answering challenges. The serverless human game should remain usable when all such operators stop.

The rebuild prompt leaves room for these features but does not make completing an unproven channel/wager protocol a prerequisite for delivering a better permanent chess game.

Evidence: [off-chain proposal](../X-Chess_2.0/docs/PLAN-offchain-play.md), [timing proposal](../X-Chess_2.0/docs/PLAN-timed-games.md), [house-player proposal](../X-Chess_2.0/docs/PLAN-play-a-house-player.md), [user feedback](../X-Chess_2.0/ops/feedback-2026-08-12/01-FEEDBACK.md).

## How to use the handoff

Give the new agent the rebuild prompt alone for the initial design and implementation. It deliberately specifies outcomes and permanent invariants rather than directory structure, framework, existing CSS, deployment prices, or historical workarounds. Keep this review available to explain the reasoning. For historical replay support, supply the frozen protocol documents and fixtures as a bounded compatibility pack; the new agent should not need to read the old UI.

The proposed default is a **new implementation and new protocol deployment where required**, with historical games read through explicit adapters. Existing inscriptions and contracts remain permanent. The rewrite does not retroactively repair or overwrite them.
